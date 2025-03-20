import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Question from '../../models/Question';
import Professor from '../../models/Professor';
import mongoose from 'mongoose';
import { sendEmail } from '../../utils/emailUtils';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  }

  const { professorId, roundId, questionnaireId } = req.body;

  if (!professorId || !roundId) {
    return res.status(400).json({ message: 'professorId e roundId são obrigatórios' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const professor = await Professor.findById(professorId).lean();
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    const questions = await Question.find().select('_id');
    const questionIds = questions.map((q) => q._id);

    // Deleta o questionário antigo, se existir
    if (questionnaireId) {
      await Questionnaire.findByIdAndDelete(questionnaireId);
    }

    // Cria um novo questionário e vincula à mesma rodada
    const newQuestionnaire = await Questionnaire.create({
      title: 'Avaliação TPACK',
      description: 'Questionário para avaliar o uso de tecnologia em práticas pedagógicas.',
      userId,
      professorId: professor._id,
      questions: questionIds,
      completed: false,
      sentDate: new Date(),
      roundId,
    });

    // Gera um novo token para o questionário
    const newToken = jwt.sign(
      {
        userId: userId.toString(),
        questionnaireId: newQuestionnaire._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '48h' }
    );

    // Envia o e-mail com o novo link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${baseUrl}/survey?token=${newToken}`;
    await sendEmail(professor.email, link);

    return res.status(200).json({
      message: 'Questionário reenviado com sucesso',
      newQuestionnaire,
    });
    
  } catch (error) {
    console.error('Erro ao reenviar questionário:', error);
    return res.status(500).json({ message: 'Erro ao reenviar questionário', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
}