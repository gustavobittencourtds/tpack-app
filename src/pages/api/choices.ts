import { NextApiRequest, NextApiResponse } from 'next';
import Choice from '../../models/Choice';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Busca todas as opções no banco de dados
    const choices = await Choice.find({});
    res.status(200).json(choices);
  } catch (error) {
    console.error('Erro ao buscar opções:', error);
    res.status(500).json({ message: 'Erro ao buscar opções' });
  }
}