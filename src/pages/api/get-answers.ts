import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Answer from '../../models/Answer';
import Choice from '../../models/Choice';
import Questionnaire from '../../models/Questionnaire';
import Professor from '../../models/Professor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  }

  const { questionnaireId } = req.query;
  if (!questionnaireId || typeof questionnaireId !== 'string') {
    return res.status(400).json({ message: 'ID do questionário é obrigatório' });
  }

  try {
    const questionnaire = await Questionnaire.findById(questionnaireId).lean();
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionário não encontrado' });
    }

    // Busca o professor associado ao questionário (se houver)
    const professor = questionnaire.professorId
      ? await Professor.findById(questionnaire.professorId).lean()
      : null;

    const answers = await Answer.find({ questionnaireId: new mongoose.Types.ObjectId(questionnaireId as string) })
      .populate('questionId', 'text')
      .lean();

    const choiceIds = new Set<string>();
    answers.forEach((a) => {
      if (Array.isArray(a.answer)) {
        a.answer.forEach((id) => choiceIds.add(id));
      }
    });

    const choices = await Choice.find({ _id: { $in: Array.from(choiceIds) } }).lean();
    const choiceMap = choices.reduce((acc, choice) => {
      acc[choice._id.toString()] = choice.text;
      return acc;
    }, {} as Record<string, string>);

    const formattedAnswers = answers.map((a) => ({
      questionText: a.questionId?.text || 'Pergunta não encontrada',
      answer: Array.isArray(a.answer)
        ? a.answer.map((id) => choiceMap[id] || id).join(', ')
        : a.answer,
    }));

    return res.status(200).json({
      message: 'Respostas encontradas',
      answers: formattedAnswers,
      questionnaireTitle: questionnaire.title,
      professorEmail: professor?.email || 'Professor não associado',
      sentDate: questionnaire.sentDate,
      responseDate: questionnaire.responseDate,
    });
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return res.status(500).json({ message: 'Erro ao buscar respostas', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
}