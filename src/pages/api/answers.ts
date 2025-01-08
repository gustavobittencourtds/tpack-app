import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import jwt from 'jsonwebtoken';
import Answer from '../../models/Answer';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Extrai o token do header "Authorization"

  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
    console.log('Token decodificado com sucesso:', decoded);

    if (req.method === 'POST') {
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return res.status(400).json({ message: 'Respostas inválidas. O formato esperado é um objeto com questionId e resposta.' });
      }

      // Transformar respostas para o formato esperado
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        userId: decoded.email, // Utilize o e-mail do token como `userId`
        questionId, // Certifique-se de que `questionId` seja um ObjectId válido
        answer,
      }));

      console.log('Respostas formatadas:', formattedAnswers);

      // Validação para garantir que `questionId` seja do tipo ObjectId
      formattedAnswers.forEach((answer) => {
        if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
          throw new Error(`O ID da pergunta ${answer.questionId} não é válido.`);
        }
      });

      // Salvar respostas no banco de dados
      await Answer.insertMany(formattedAnswers);
      return res.status(201).json({ message: 'Respostas salvas com sucesso!' });
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Método ${req.method} não permitido` });
  } catch (error) {
    console.error('Erro ao salvar respostas:', error); // Log completo do erro
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
    }
    res.status(500).json({ message: 'Erro ao salvar respostas', details: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
}
