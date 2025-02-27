import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Answer from '../../models/Answer';
import Question from '../../models/Question';
import Session from '../../models/Session';
import Round from '../../models/Round';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { roundId } = req.query;

  if (!roundId) {
    return res.status(400).json({ message: 'roundId é obrigatório' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    // Busca o objeto round correspondente ao roundId e userId
    const round = await Round.findOne({ _id: roundId, userId }).lean();

    // Busca todos os questionários da rodada e userId
    const questionnaires = await Questionnaire.find({ roundId, userId }).lean();

    // Busca todas as respostas dos questionários da rodada
    const answers = await Answer.find({
      questionnaireId: { $in: questionnaires.map((q) => q._id) },
    }).lean();

    // Busca todas as questões da rodada
    const questions = await Question.find({
      _id: { $in: questionnaires.flatMap((q) => q.questions) },
    }).lean();

    // Busca todas as sessões
    const sessions = await Session.find({
      title: {
        $in: [
          "Conhecimento pedagógico tecnológico do conteúdo",
          "Conhecimento do conteúdo tecnológico",
          "Conhecimento pedagógico tecnológico",
          "Conhecimento pedagógico do conteúdo",
          "Conhecimento em tecnologia",
          "Conhecimento de conteúdo",
          "Conhecimento pedagógico",
        ],
      },
    }).lean();

    // Calcula a média das respostas dos professores para cada questão dentro de cada sessão
    const sessionAverages = sessions.map((session) => {
      const sessionQuestions = questions.filter((question) => question.session_id.toString() === session._id.toString());
      const questionAverages = sessionQuestions.map((question) => {
        const questionAnswers = answers.filter((answer) => answer.questionId.toString() === question._id.toString());
        const total = questionAnswers.reduce((sum, answer) => sum + parseFloat(answer.answer), 0);
        const average = questionAnswers.length > 0 ? total / questionAnswers.length : 0;
        return { questionId: question._id, average };
      });

      return { sessionId: session._id, questionAverages };
    });

    return res.status(200).json({ round, questionnaires, answers, questions, sessions, sessionAverages });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório', error });
  }
}
