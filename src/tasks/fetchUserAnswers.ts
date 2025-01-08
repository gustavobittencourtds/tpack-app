import 'dotenv/config'; // Carrega automaticamente o arquivo .env
import mongoose from 'mongoose';
import dbConnect from '../utils/dbConnect';
import Answer from '../models/Answer';

async function fetchUserAnswers(userId: string) {
  await dbConnect(); // Conectar ao banco de dados

  try {
    console.log(`Buscando respostas do usuário: ${userId}`);
    console.log(`DB_URI atual: ${process.env.DB_URI}`);

    const userAnswers = await Answer.find({ userId }).populate('questionId').lean();

    if (userAnswers.length === 0) {
      console.log('Nenhuma resposta encontrada para este usuário.');
      return { message: 'Nenhuma resposta encontrada para este usuário', data: [] };
    }

    console.log(`Total de respostas encontradas: ${userAnswers.length}`);
    return { message: 'Respostas encontradas', data: userAnswers };
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return { message: 'Erro ao buscar respostas', error };
  } finally {
    await mongoose.connection.close();
    console.log('Conexão com MongoDB encerrada.');
  }
}

const userId = 'fufa.gustavo@gmail.com';
fetchUserAnswers(userId).then((res) => console.log(res));
