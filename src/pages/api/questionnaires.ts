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

      // 🔹 Buscar questionários do professor SEM autenticação por token
      const questionnaires = await Questionnaire.find({ userId: new mongoose.Types.ObjectId(userId as string) })
        .populate('questions')
        .lean();

      return res.status(200).json({ message: 'Questionários encontrados', data: questionnaires });
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      return res.status(500).json({ message: 'Erro ao buscar questionários', error });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ message: `Método ${req.method} não permitido` });
}
