import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Answer from '../../models/Answer';
import Choice from '../../models/Choice';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { questionnaireId } = req.query;

      if (!questionnaireId || !mongoose.Types.ObjectId.isValid(questionnaireId as string)) {
        return res.status(400).json({ message: 'questionnaireId inválido' });
      }

      // 🔹 Buscar respostas SEM autenticação por token
      const answers = await Answer.find({ questionnaireId: new mongoose.Types.ObjectId(questionnaireId as string) })
        .populate('questionId', 'text')
        .lean();

      // 🔹 Identificar quais respostas são IDs e buscar os textos das opções
      const choiceIds = new Set<string>();

      answers.forEach((a) => {
        if (Array.isArray(a.answer)) {
          a.answer.forEach((id) => choiceIds.add(id));
        }
      });

      // 🔹 Buscar os textos das alternativas selecionadas
      const choices = await Choice.find({ _id: { $in: Array.from(choiceIds) } }).lean();
      const choiceMap = choices.reduce((acc, choice) => {
        acc[choice._id.toString()] = choice.text;
        return acc;
      }, {} as Record<string, string>);

      // 🔹 Substituir os IDs pelos textos correspondentes
      const formattedAnswers = answers.map((a) => ({
        questionText: a.questionId?.text || 'Pergunta não encontrada',
        answer: Array.isArray(a.answer)
          ? a.answer.map((id) => choiceMap[id] || id).join(', ') // 🔹 Converte IDs para texto
          : a.answer,
      }));

      return res.status(200).json({ message: 'Respostas encontradas', answers: formattedAnswers });
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      return res.status(500).json({ message: 'Erro ao buscar respostas', error });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ message: `Método ${req.method} não permitido` });
}
