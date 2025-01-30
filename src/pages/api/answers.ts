import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import jwt from 'jsonwebtoken';
import Answer from '../../models/Answer';
import Questionnaire from '../../models/Questionnaire';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string; questionnaireId: string };
    console.log('Token decodificado com sucesso:', decoded);

    const { email, questionnaireId } = decoded;

    if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
      return res.status(400).json({ message: 'ID de questionário inválido.' });
    }

    // Verifica se o questionário existe no banco
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionário não encontrado.' });
    }

    // 🔹 Verifica se o usuário já respondeu ao questionário
    const existingAnswers = await Answer.findOne({ userId: email, questionnaireId });
    if (existingAnswers) {
      return res.status(400).json({ message: 'Você já respondeu a este questionário.' });
    }

    if (req.method === 'POST') {
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return res.status(400).json({ message: 'Respostas inválidas. O formato esperado é um objeto com questionId e resposta.' });
      }

      // 🔹 Formata as respostas corretamente antes de salvar
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        userId: email,
        questionId: new mongoose.Types.ObjectId(questionId),
        answer,
        questionnaireId: new mongoose.Types.ObjectId(questionnaireId), // Garante que o questionnaireId está salvo
        createdAt: new Date(),
      }));

      // 🔹 Salva as respostas no banco de dados
      await Answer.insertMany(formattedAnswers);

      // 🔹 Marca o questionário como "completed"
      await Questionnaire.findByIdAndUpdate(questionnaireId, { completed: true });

      return res.status(201).json({ message: 'Respostas salvas com sucesso!' });
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Método ${req.method} não permitido` });
  } catch (error) {
    console.error('Erro ao salvar respostas:', error);
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(500).json({ message: 'Erro ao salvar respostas', details: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
}
