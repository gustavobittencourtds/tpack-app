// src/tasks/fetchUserAnswers.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../utils/dbConnect';
import Answer from '../models/Answer';
import Questionnaire from '../models/Questionnaire';

dotenv.config();

interface IFormattedAnswer {
  questionnaireTitle: string;
  submittedAt: Date;
  answers: { questionText: string; answer: string | number | string[] }[];
}

async function fetchUserAnswers(userId: string) {
  await dbConnect();

  try {
    console.log(`Buscando respostas do usuário: ${userId}`);

    const questionnaires = await Questionnaire.find({ userId }).populate('questions').lean();

    if (questionnaires.length === 0) {
      console.log('Nenhum questionário encontrado para este usuário.');
      return { message: 'Nenhum questionário encontrado para este usuário', data: [] };
    }

    const formattedData: IFormattedAnswer[] = [];

    for (const questionnaire of questionnaires) {
      console.log(`Questionário encontrado: ${questionnaire.title}`);

      const answers = await Answer.find({
        userId,
        questionnaireId: questionnaire._id,
      }).populate({ path: 'questionId', select: 'text' }).lean();

      console.log(`Respostas encontradas: ${answers.length}`);

      const formattedAnswers = answers.map((answer) => ({
        questionText: answer.questionId?.text || 'Pergunta não encontrada',
        answer: answer.answer,
      }));

      formattedData.push({
        questionnaireTitle: questionnaire.title,
        submittedAt: answers[0]?.createdAt || new Date(),
        answers: formattedAnswers,
      });
    }

    return { message: 'Respostas encontradas', data: formattedData };

  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return { message: 'Erro ao buscar respostas', error };
  } finally {
    mongoose.connection.close();
    console.log('Conexão com MongoDB encerrada.');
  }
}

const userId = 'fufa.gustavo@gmail.com';
fetchUserAnswers(userId).then((res) => console.log(JSON.stringify(res, null, 2)));
