// src/tasks/validateDatabase.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';
import Choice from '../models/Choice';

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
    console.log('--- Questões e Alternativas ---');
    const questions = await Question.find().lean();
    for (const question of questions) {
      console.log(`\nPergunta: ${question.text} (ID: ${question._id})`);
      const choices = await Choice.find({ question_id: question._id }).lean();
      if (choices.length > 0) {
        console.log('Alternativas:');
        choices.forEach((choice) => console.log(`  - ${choice.text}`));
      } else {
        console.log('Nenhuma alternativa encontrada.');
      }
    }
  } catch (error) {
    console.error('Erro ao validar o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
}

validateDatabase();
