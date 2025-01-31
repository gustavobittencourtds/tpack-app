import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';
import Choice from '../models/Choice';
import Session from '../models/Session';

dotenv.config();

const validate = async () => {
  console.log('Iniciando validação...');

  // Testa a conexão com o MongoDB
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.DB_URI as string);
    console.log('Conexão bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    return;
  }

  try {
    // Valida se o modelo `Session` funciona
    console.log('\nValidando Sessões...');
    const sessions = await Session.find().lean();
    if (sessions.length === 0) {
      console.warn('Nenhuma sessão encontrada no banco de dados.');
    } else {
      console.log(`Sessões encontradas: ${sessions.length}`);
      sessions.forEach((session) => console.log(`Sessão: ${session.title}`));
    }

    // Valida se o modelo `Question` funciona
    console.log('\nValidando Questões...');
    const questions = await Question.find().populate('choices').lean();
    if (questions.length === 0) {
      console.warn('Nenhuma questão encontrada no banco de dados.');
    } else {
      console.log(`Questões encontradas: ${questions.length}`);
      questions.forEach((question) => {
        console.log(`Pergunta: ${question.text} (ID: ${question._id})`);
        if (question.choices && question.choices.length > 0) {
          console.log(`Alternativas (${question.choices.length}):`);
          question.choices.forEach((choice: any) => {
            console.log(`  - ${choice.text}`);
          });
        } else {
          console.warn('  Nenhuma alternativa encontrada.');
        }
      });
    }

    // Valida se o modelo `Choice` funciona
    console.log('\nValidando Alternativas...');
    const choices = await Choice.find().lean();
    if (choices.length === 0) {
      console.warn('Nenhuma alternativa encontrada no banco de dados.');
    } else {
      console.log(`Alternativas encontradas: ${choices.length}`);
      choices.forEach((choice) =>
        console.log(`Alternativa: ${choice.text} (Vinculada à pergunta: ${choice.question_id})`)
      );
    }
  } catch (error) {
    console.error('Erro durante a validação:', error);
  } finally {
    console.log('\Validação finalizada');
    mongoose.connection.close();
  }
};

// Executa o script
validate();
