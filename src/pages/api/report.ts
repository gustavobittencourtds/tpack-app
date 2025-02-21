import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Answer from '../../models/Answer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Verifica se é uma requisição GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { roundId } = req.query;

  if (!roundId || typeof roundId !== 'string') {
    return res.status(400).json({ message: 'roundId é obrigatório e deve ser uma string' });
  }

  try {
    // Busca todos os questionários da rodada
    const questionnaires = await Questionnaire.find({ roundId }).lean();

    if (questionnaires.length === 0) {
      return res.status(404).json({ message: 'Nenhum questionário encontrado para esta rodada' });
    }

    // Busca todas as respostas relacionadas aos questionários dessa rodada
    const answers = await Answer.find({
      questionnaireId: { $in: questionnaires.map((q) => q._id) },
    }).lean();

    return res.status(200).json({ questionnaires, answers });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ message: 'Erro interno ao gerar relatório', error });
  }
}
