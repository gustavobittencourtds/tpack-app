import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Questionnaire from '../../models/Questionnaire';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { userId, roundId } = req.query;

      if (!userId && !roundId) {
        return res.status(400).json({ message: 'É necessário fornecer userId ou roundId' });
      }

      let filter: any = {};
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId as string)) {
          return res.status(400).json({ message: 'userId inválido' });
        }
        filter.userId = new mongoose.Types.ObjectId(userId as string);
      }

      if (roundId) {
        if (!mongoose.Types.ObjectId.isValid(roundId as string)) {
          return res.status(400).json({ message: 'roundId inválido' });
        }
        filter.round = new mongoose.Types.ObjectId(roundId as string);
      }

      const questionnaires = await Questionnaire.find(filter)
        .populate('questions')
        .lean();

      if (!questionnaires.length) {
        return res.status(404).json({ message: 'Nenhum questionário encontrado' });
      }

      return res.status(200).json({ message: 'Questionários encontrados', data: questionnaires });
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      return res.status(500).json({ message: 'Erro ao buscar questionários', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, userId, questions, round } = req.body;

      if (!title || !userId || !questions || !Array.isArray(questions) || !round) {
        return res.status(400).json({ message: 'Dados inválidos' });
      }

      const newQuestionnaire = await Questionnaire.create({
        title: `TPACK - Aplicação ${new Date().toLocaleDateString('pt-BR')}`,
        description,
        userId,
        questions,
        sentDate: new Date(),
        round: new mongoose.Types.ObjectId(round), // Garante que roundId é um ObjectId
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
