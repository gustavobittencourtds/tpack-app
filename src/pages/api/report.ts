import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Answer from '../../models/Answer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { roundId } = req.query;

  if (!roundId) {
    return res.status(400).json({ message: 'roundId é obrigatório' });
  }

  try {
    // Busca todos os questionários da rodada
    const questionnaires = await Questionnaire.find({ roundId }).lean();

    // Busca as respostas de todos os questionários da rodada
    const answers = await Answer.find({
      questionnaireId: { $in: questionnaires.map((q) => q._id) },
    }).lean();

    return res.status(200).json({ questionnaires, answers });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório', error });
  }
}
