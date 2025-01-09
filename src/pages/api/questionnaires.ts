import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import jwt from 'jsonwebtoken';
import Questionnaire from '../../models/Questionnaire';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (req.method === 'GET') {
      const questionnaires = await Questionnaire.find({ userId: (decoded as jwt.JwtPayload).email }).populate('questions').lean();
      return res.status(200).json({ message: 'Questionários encontrados', data: questionnaires });
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar questionários', error });
  }
}
