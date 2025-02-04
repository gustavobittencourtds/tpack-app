import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Professor from '../../models/Professor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // console.log('Buscando professores no banco...');
      const professors = await Professor.find().select('_id email').lean();

      if (!professors || professors.length === 0) {
        // console.log('Nenhum professor encontrado.');
        return res.status(404).json({ message: 'Nenhum professor encontrado' });
      }

      // console.log('Professores encontrados:', professors);
      return res.status(200).json({ professors });
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      return res.status(500).json({ message: 'Erro ao buscar professores', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ message: `Método ${req.method} não permitido` });
}
