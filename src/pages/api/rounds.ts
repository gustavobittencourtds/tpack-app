import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Round from '../../models/Round';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const rounds = await Round.find().lean();
    return res.status(200).json(rounds);
  } catch (error) {
    console.error('Erro ao buscar rodadas:', error);
    return res.status(500).json({ message: 'Erro ao buscar rodadas', error });
  }
}