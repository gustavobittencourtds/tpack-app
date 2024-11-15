// src/tasks/validateDatabase.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Professor from '../models/Professor';
import Session from '../models/Session';
import Question from '../models/Question';
import Choice from '../models/Choice';
import { AnsweredSurvey } from '../types';

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

async function validateDatabase() {
  await connectDB();

  try {
    // Validação das Sessões
    const sessions = await Session.find({});
    console.log('\n--- Sessões ---');
    if (sessions.length === 0) {
      console.log('Nenhuma sessão encontrada.');
    } else {
      sessions.forEach((session, index) => {
        console.log(`\nSessão ${index + 1}:`);
        console.log(`Título: ${session.title}`);
        console.log(`Ordem: ${session.order}`);
      });
    }

    // Validação das Questões
    const questions = await Question.find({});
    console.log('\n--- Questões ---');
    if (questions.length === 0) {
      console.log('Nenhuma questão encontrada.');
    } else {
      questions.forEach((question, index) => {
        console.log(`\nQuestão ${index + 1}:`);
        console.log(`Texto: ${question.text}`);
        console.log(`Nota: ${question.note}`);
        console.log(`Tipo: ${question.type}`);
        console.log(`Ordem: ${question.order}`);
        console.log(`ID da Sessão: ${question.session_id}`);
      });
    }

    // Validação das Alternativas
    const choices = await Choice.find({});
    console.log('\n--- Alternativas ---');
    if (choices.length === 0) {
      console.log('Nenhuma alternativa encontrada.');
    } else {
      choices.forEach((choice, index) => {
        console.log(`\nAlternativa ${index + 1}:`);
        console.log(`Texto: ${choice.text}`);
        console.log(`Nível: ${choice.level}`);
        console.log(`Próximo Nível: ${choice.nextLevel}`);
        console.log(`ID da Questão: ${choice.question_id}`);
      });
    }

    // Validação dos Professores
    const professors = await Professor.find({});
    console.log('\n--- Professores ---');
    if (professors.length === 0) {
      console.log('Nenhum professor encontrado.');
    } else {
      professors.forEach((professor, index) => {
        console.log(`\nProfessor ${index + 1}:`);
        console.log(`E-mail: ${professor.email}`);
        console.log('Questionários respondidos:');
        professor.answeredSurveys.forEach((survey: AnsweredSurvey, i: number) => {
          console.log(`  ${i + 1}. ID do Questionário: ${survey.surveyId}`);
          console.log(`     Respostas: ${JSON.stringify(survey.responses)}`);
          console.log(`     Data de envio: ${survey.submittedAt}`);
        });
      });
    }
  } catch (error) {
    console.error('Erro ao validar o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
}

validateDatabase();
