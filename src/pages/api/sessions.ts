import { NextApiRequest, NextApiResponse } from 'next';
import Session from '../../models/Session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Buscar todas as sessões no banco de dados
    const sessions = await Session.find({}).sort({ order: 1 }); // Ordenar por 'order'
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
    res.status(500).json({ message: 'Erro ao buscar sessões' });
  }
}