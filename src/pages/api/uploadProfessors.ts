import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'csv-parse';
import dbConnect from '../../utils/dbConnect';
import Professor from '../../models/Professor';
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  }

  // Verificar autenticação
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const form = formidable({});
    
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Erro ao processar o arquivo:', err);
          res.status(500).json({ message: 'Erro ao processar o arquivo' });
          return resolve(null);
        }

        // Verificar se o arquivo foi enviado
        const fileArray = files.file;
        if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
          res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
          return resolve(null);
        }

        const file = fileArray[0];
        
        // Ler o arquivo CSV
        const results: string[] = [];
        const errors: string[] = [];
        let successCount = 0;

        try {
          // Criar um stream de leitura do arquivo
          const parser = fs
            .createReadStream(file.filepath)
            .pipe(parse({ 
              columns: true,
              skip_empty_lines: true,
              trim: true 
            }));

          // Processar cada linha do CSV
          for await (const record of parser) {
            try {
              // Verificar se a linha tem o campo 'email'
              const email = record.email || '';
              if (!email) {
                errors.push(`Linha ignorada: Email não encontrado.`);
                continue;
              }

              // Verificar se o email já existe para este usuário
              const existingProfessor = await Professor.findOne({ email, userId });
              if (existingProfessor) {
                errors.push(`Email ${email} já cadastrado para este usuário.`);
                continue;
              }

              // Cadastrar o professor
              await Professor.create({ email, userId });
              successCount++;
              results.push(`Professor ${email} cadastrado com sucesso.`);
            } catch (error) {
              console.error('Erro ao processar linha do CSV:', error);
              errors.push(`Erro ao processar email: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }
          }

          // Remover o arquivo temporário
          fs.unlinkSync(file.filepath);

          // Retornar resultado
          res.status(200).json({
            message: `Processamento concluído. ${successCount} professor(es) cadastrado(s) com sucesso.`,
            success: successCount > 0,
            results,
            errors
          });
          
          return resolve(null);
        } catch (error) {
          console.error('Erro ao processar arquivo CSV:', error);
          res.status(500).json({ message: 'Erro ao processar o arquivo CSV' });
          return resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
}
