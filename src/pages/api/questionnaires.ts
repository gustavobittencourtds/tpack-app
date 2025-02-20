import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Questionnaire from '../../models/Questionnaire';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: 'userId inválido' });
      }

      const questionnaires = await Questionnaire.find({ userId: new mongoose.Types.ObjectId(userId as string) })
        .populate('questions')
        .lean();

      return res.status(200).json({ message: 'Questionários encontrados', data: questionnaires });
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      return res.status(500).json({ message: 'Erro ao buscar questionários', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, userId, questions } = req.body;

      if (!title || !userId || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: 'Dados inválidos' });
      }

      const newQuestionnaire = await Questionnaire.create({
        title: `TPACK - Aplicação ${new Date().toLocaleDateString('pt-BR')}`, // Adiciona a data ao título
        description,
        userId,
        questions,
        sentDate: new Date(), // Data de envio
      });

      return res.status(201).json({ message: 'Questionário criado com sucesso', data: newQuestionnaire });
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      return res.status(500).json({ message: 'Erro ao criar questionário', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ message: `Método ${req.method} não permitido` });
}