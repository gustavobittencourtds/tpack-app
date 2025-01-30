// src/tasks/fetchUserAnswers.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../utils/dbConnect';
import Answer from '../models/Answer';
import Questionnaire from '../models/Questionnaire';
import Choice from '../models/Choice'; // 🔹 Adiciona o modelo de Choice

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

interface IFormattedAnswer {
  questionnaireTitle: string;
  submittedAt: Date;
  answers: { questionText: string; answer: string | number | string[] }[];
}

async function fetchUserAnswers(userId: string) {
  await dbConnect();

  try {
    console.log(`Buscando respostas do usuário: ${userId}`);

    // Buscar questionários respondidos pelo usuário
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
        questionnaireId: questionnaire._id.toString(),
      })
        .populate({
          path: 'questionId',
          populate: { path: 'choices', model: 'Choice' }, // 🔹 Popula as opções de resposta
        })
        .lean();

      console.log(`Respostas encontradas: ${answers.length}`);

      const formattedAnswers = await Promise.all(
        answers.map(async (answer) => {
          let formattedAnswer = answer.answer;

          // 🔹 Se a resposta for um array de IDs (opções selecionadas)
          if (Array.isArray(answer.answer)) {
            const choices = await Choice.find({ _id: { $in: answer.answer } }).lean();
            formattedAnswer = choices.map((choice) => choice.text); // 🔹 Converte para o texto das opções
          }

          return {
            questionText: answer.questionId?.text || 'Pergunta não encontrada',
            answer: formattedAnswer,
          };
        })
      );

      formattedData.push({
        questionnaireTitle: questionnaire.title,
        submittedAt: answers[0]?.createdAt || new Date(),
        answers: formattedAnswers,
      });
    }

    console.log(`Total de questionários respondidos: ${formattedData.length}`);
    return { message: 'Respostas encontradas', data: formattedData };
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return { message: 'Erro ao buscar respostas', error };
  } finally {
    mongoose.connection.close();
    console.log('Conexão com MongoDB encerrada.');
  }
}

// Exemplo de uso:
const userId = 'fufa.gustavo@gmail.com';
fetchUserAnswers(userId).then((res) => console.log(JSON.stringify(res, null, 2)));
