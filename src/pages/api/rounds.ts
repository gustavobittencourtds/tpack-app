import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Round from '../../models/Round';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const rounds = await Round.find({ userId }).lean();
    return res.status(200).json(rounds);
  } catch (error) {
    console.error('Erro ao buscar rodadas:', error);
    return res.status(500).json({ message: 'Erro ao buscar rodadas', error });
  }
}