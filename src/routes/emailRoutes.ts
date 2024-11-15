// src/routes/emailRoutes.ts
import express, { Request, Response } from 'express';
import csvParser from 'csv-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import Professor from '../models/Professor.js';
import { sendEmail } from '../utils/emailUtils.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Diretório temporário para armazenar os arquivos CSV

// Função principal da rota para upload do CSV e processamento
router.post('/upload', upload.single('csvFile'), async (req: Request, res: Response): Promise<void> => {
  try {
    const results: string[] = [];

    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).send('CSV file is required.');
      return;
    }

    // Função para processar e-mails após leitura do CSV
    const processEmails = async () => {
      for (const email of results) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '48h' });
        const tokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);
        const sendDate = new Date();

        // Salvar o e-mail, token, data de expiração e data de envio no banco de dados
        await Professor.create({ email, token, tokenExpires, sendDate });

        // Criar link temporário e enviar o e-mail com o link para o professor
        const link = `http://localhost:3000/survey?token=${token}`;
        await sendEmail(email, link);

        console.log(`E-mail enviado para ${email} e salvo no banco de dados.`);
      }
      res.status(200).send('Emails processed, sent, and saved in the database successfully.');
    };

    // Ler o arquivo CSV e processar os e-mails usando o csv-parser
    fs.createReadStream(filePath) // Cria um stream de leitura do arquivo
      .pipe(csvParser()) // Processa o CSV usando csv-parser
      .on('data', (data) => results.push(data.email)) // Armazena cada e-mail no array results
      .on('end', processEmails) // Após o processamento, chama a função processEmails
      .on('error', (error) => {
        console.error(error);
        res.status(500).send('Error reading CSV file.');
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading emails.');
  }
});

export default router;
