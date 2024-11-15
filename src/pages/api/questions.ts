// src/pages/api/questions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Question from '../../models/Question';
import Choice from '../../models/Choice';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const token = req.query.token as string | undefined;

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    // Verifica o token usando a chave secreta
    jwt.verify(token, process.env.JWT_SECRET as string);

    // Busca todas as questões e inclui as alternativas correspondentes
    const questions = await Question.find().lean();

    // Para cada questão, buscamos as alternativas associadas e as incluímos no resultado
    const questionsWithChoices = await Promise.all(
      questions.map(async (question) => {
        const choices = await Choice.find({ question_id: question._id }).lean();
        return { ...question, choices };
      })
    );

    res.status(200).json(questionsWithChoices);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error('Erro de autenticação do token: Token expirado');
      return res.status(401).json({ message: 'Token expirado. Por favor, solicite um novo link para acessar o questionário.' });
    } else {
      console.error('Erro de autenticação do token ou ao buscar as questões:', error);
      res.status(500).json({ message: 'Erro ao buscar as questões' });
    }
  }
}
