import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Answer from '../../models/Answer';
import Question from '../../models/Question';
import Session from '../../models/Session';
import Round from '../../models/Round';
import jwt from 'jsonwebtoken';


// Função para calcular a moda
function calculateMode(values: number[]): number[] {
  const frequencyMap = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const maxFrequency = Math.max(...Object.values(frequencyMap));
  const modes = Object.keys(frequencyMap)
    .filter((key) => frequencyMap[key] === maxFrequency)
    .map((key) => parseFloat(key));

  return modes;
}

// Função para calcular média, desvio padrão, mediana, moda, amplitude e coeficiente de variação
function calculateStats(values: number[]): {
  average: number;
  stdDeviation: number;
  median: number;
  mode: number[]; // Agora a moda é um array
  range: number;
  cv: number;
} {
  const n = values.length;
  if (n === 0) return { average: 0, stdDeviation: 0, median: 0, mode: [], range: 0, cv: 0 };

  // Média
  const average = values.reduce((acc, val) => acc + val, 0) / n;

  // Desvio Padrão
  const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / n;
  const stdDeviation = Math.sqrt(variance);

  // Mediana
  const sortedValues = [...values].sort((a, b) => a - b);
  const midpoint = Math.floor(n / 2);
  const median =
    n % 2 === 0
      ? (sortedValues[midpoint - 1] + sortedValues[midpoint]) / 2
      : sortedValues[midpoint];

  // Moda (agora retorna um array)
  const mode = calculateMode(values);

  // Amplitude
  const range = Math.max(...values) - Math.min(...values);

  // Coeficiente de Variação (CV)
  const cv = (stdDeviation / average) * 100;

  return { average, stdDeviation, median, mode, range, cv };
}

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

    // Calcula a média, desvio padrão, mediana, moda, amplitude e coeficiente de variação das respostas dos professores para cada questão dentro de cada sessão
    const sessionAverages = sessions.map((session) => {
      const sessionQuestions = questions.filter((question) => question.session_id.toString() === session._id.toString());
      const questionAverages = sessionQuestions.map((question) => {
        const questionAnswers = answers.filter((answer) => answer.questionId.toString() === question._id.toString());

        // Extrai os valores das respostas e converte para números
        const answerValues = questionAnswers.map((answer) => {
          const numericValue = parseFloat(answer.answer);
          return isNaN(numericValue) ? 0 : numericValue; // Trata valores inválidos
        });

        // Calcula todas as métricas
        const { average, stdDeviation, median, mode, range, cv } = calculateStats(answerValues);
        return { questionId: question._id, average, stdDeviation, median, mode, range, cv };
      });

      return { sessionId: session._id, questionAverages };
    });

    return res.status(200).json({ round, questionnaires, answers, questions, sessions, sessionAverages });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório', error });
  }
}