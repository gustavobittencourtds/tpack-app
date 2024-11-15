// src/pages/api/answers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Professor from '../../models/Professor';
import { AnsweredSurvey } from '../../types';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
    const { email } = decoded;

    const { surveyId, responses } = req.body;
    if (!surveyId || !responses) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    await mongoose.connect(process.env.DB_URI as string);

    // Encontra o professor pelo e-mail
    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    // Adiciona ou atualiza as respostas do questionário
    const existingSurvey = professor.answeredSurveys.find((s: AnsweredSurvey) => s.surveyId === surveyId);
    if (existingSurvey) {
      existingSurvey.responses = responses;
      existingSurvey.submittedAt = new Date();
    } else {
      professor.answeredSurveys.push({ surveyId, responses, submittedAt: new Date() });
    }

    await professor.save();
    return res.status(200).json({ message: 'Respostas salvas com sucesso' });
  } catch (error) {
    console.error('Erro ao processar as respostas:', error);
    return res.status(500).json({ message: 'Erro ao salvar as respostas' });
  }
}
