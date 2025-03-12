import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Question from '../../models/Question';
import Professor from '../../models/Professor';
import Round from '../../models/Round';
import mongoose from 'mongoose';
import { sendEmail, sendConfirmationEmail } from '../../utils/emailUtils';

dotenv.config();

async function createNewRound(userId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId> {
  const lastRound = await Round.findOne().sort({ roundNumber: -1 }).lean();
  const nextRoundNumber = lastRound ? lastRound.roundNumber + 1 : 1;

  const newRound = await Round.create({
    roundNumber: nextRoundNumber,
    sentDate: new Date(),
    status: 'open',
    description: `Rodada de envio ${nextRoundNumber}`,
    userId,
  });

  return newRound._id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  }

  const { professorIds } = req.body;

  if (!professorIds || !Array.isArray(professorIds)) {
    return res.status(400).json({ message: 'IDs dos professores são obrigatórios' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const roundId = await createNewRound(userId);

    for (const professorId of professorIds) {
      const professor = await Professor.findById(professorId).lean();
      if (!professor) {
        console.warn(`Professor com ID ${professorId} não encontrado. Pulando...`);
        continue;
      }

      const questions = await Question.find().select('_id');
      const questionIds = questions.map((q) => q._id);

      const newQuestionnaire = await Questionnaire.create({
        title: 'Avaliação TPACK',
        description: 'Questionário para avaliar o uso de tecnologia em práticas pedagógicas.',
        userId,
        professorId: professor._id, // Vincula o questionário ao professor
        questions: questionIds,
        completed: false,
        sentDate: new Date(),
        roundId,
      });

      const questionnaireId = newQuestionnaire._id;

      const token = jwt.sign(
        {
          userId: userId.toString(),
          questionnaireId,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '48h' }
      );

      const link = `http://localhost:3000/survey?token=${token}`;

      await sendEmail(professor.email, link);
      console.log(`E-mail enviado para ${professor.email}`);
    }

    return res.status(200).json({ message: 'E-mails enviados com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mails:', error);
    return res.status(500).json({ message: 'Erro ao enviar e-mails', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
}