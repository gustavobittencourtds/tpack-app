// src/tasks/fetchUserAnswers.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../utils/dbConnect';
import Answer from '../models/Answer';
import Questionnaire from '../models/Questionnaire';
import Choice from '../models/Choice';
import Professor from '../models/Professor';

dotenv.config();

interface IFormattedAnswer {
  questionnaireTitle: string;
  submittedAt: Date;
  answers: { questionText: string; answer: string | number | string[] }[];
}

async function fetchUserAnswers() {
  await dbConnect();

  try {
    console.log(`Buscando todos os professores cadastrados...`);

    // 🔹 Buscar todos os professores no banco
    const professors = await Professor.find().lean();

    if (professors.length === 0) {
      console.log('Nenhum professor encontrado.');
      return { message: 'Nenhum professor encontrado', data: [] };
    }

    console.log(`Total de professores encontrados: ${professors.length}`);

    const allFormattedData: Record<string, IFormattedAnswer[]> = {};

    for (const professor of professors) {
      const userId = professor._id.toString();
      console.log(`Buscando respostas do usuário: ${professor.email}`);

      const questionnaires = await Questionnaire.find({
        userId: new mongoose.Types.ObjectId(userId)
      })
        .populate('questions')
        .lean();

      if (questionnaires.length === 0) {
        console.log(`Nenhum questionário encontrado para ${professor.email}.`);
        allFormattedData[professor.email] = [];
        continue;
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

      allFormattedData[professor.email] = formattedData;
    }

    console.log(`Total de professores processados: ${Object.keys(allFormattedData).length}`);
    return { message: 'Respostas encontradas', data: allFormattedData };
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return { message: 'Erro ao buscar respostas', error };
  } finally {
    mongoose.connection.close();
    console.log('Conexão com MongoDB encerrada.');
  }
}

// 🔹 Executar a função
fetchUserAnswers().then((res) => console.log(JSON.stringify(res, null, 2)));
