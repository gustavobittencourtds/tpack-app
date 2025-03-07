import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Answer from '../../models/Answer';
import Questionnaire from '../../models/Questionnaire';
import Professor from '../../models/Professor';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { questionnaireIds } = req.query;
    if (!questionnaireIds || typeof questionnaireIds !== 'string') {
      return res.status(400).json({ message: 'IDs dos questionários são obrigatórios' });
    }

    try {
      const idsArray = questionnaireIds.split(',').map((id) => new mongoose.Types.ObjectId(id));

      // Contar quantos professores distintos receberam os questionários
      const professorCount = await Questionnaire.distinct("userId", { _id: { $in: idsArray } });

      return res.status(200).json({ professorCount: professorCount.length });
    } catch (error) {
      console.error('Erro ao buscar quantidade de professores:', error);
      return res.status(500).json({ message: 'Erro ao buscar quantidade de professores', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  }


  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token ausente' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { questionnaireId: string, userId: string };
      const { questionnaireId, userId } = decoded;

      const { answers } = req.body;
      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return res.status(400).json({ message: 'Respostas são obrigatórias e devem estar no formato correto' });
      }

      const questionnaire = await Questionnaire.findById(questionnaireId);
      if (!questionnaire) {
        return res.status(404).json({ message: 'Questionário não encontrado' });
      }

      const professor = await Professor.findOne({ userId: questionnaire.userId }).lean();
      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionnaireId,
        questionId,
        userId,
        answer,
        submittedAt: new Date(),
      }));

      const newAnswers = await Answer.insertMany(formattedAnswers);

      questionnaire.completed = true;
      questionnaire.responseDate = new Date();
      await questionnaire.save();

      return res.status(201).json({ ...newAnswers, professorEmail: professor.email });
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
      return res.status(500).json({ message: 'Erro ao enviar respostas', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }

  }

  return res.status(405).json({ message: `Método ${req.method} não permitido` });
}
