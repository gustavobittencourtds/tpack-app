import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Question from '../../models/Question';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import Questionnaire from '../../models/Questionnaire';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const token = req.query.token as string | undefined;

  if (!token) {
    console.error('Token não fornecido.');
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; questionnaireId: string };
    console.log('Token decodificado com sucesso:', decoded);

    // Verifica se o questionário já foi respondido
    const questionnaire = await Questionnaire.findById(decoded.questionnaireId);
    if (questionnaire?.completed) {
      return res.status(400).json({ message: 'Este questionário já foi respondido!' });
    }

    // Busca as perguntas
    const questions = await Question.find().populate('choices').lean();
    res.status(200).json(questions);

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error('Token expirado');
      return res.status(401).json({ message: 'O link deste questionário expirou. Por favor, solicite um novo.' });
    }
    console.error('Erro ao buscar as questões:', error);
    res.status(500).json({ message: 'Erro ao buscar as questões.' });
  }
}