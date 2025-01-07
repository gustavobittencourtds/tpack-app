import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Question from '../../models/Question';
import Choice from '../../models/Choice';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Iniciando requisição /api/questions...');
  await dbConnect();

  // Listar modelos registrados
  // console.log('Modelos registrados no Mongoose:', Object.keys(mongoose.models));

  const token = req.query.token as string | undefined;

  if (!token) {
    console.error('Token não fornecido.');
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('Token decodificado com sucesso:', decoded);

    const questions = await Question.find().populate('choices').lean();
    // console.log('Questões encontradas:', questions);

    res.status(200).json(questions);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error('=================');
      console.error('Token expirado!');
      console.error('=================');
      // console.error('Token expirado:', error);
      return res.status(401).json({ message: 'O link deste questionário expirou. Por favor, solicite um novo.' });
    }
    console.error('Erro ao buscar as questões:', error);
    res.status(500).json({ message: 'Erro ao buscar as questões.' });
  }
}
