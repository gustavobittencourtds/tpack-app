// src/tasks/clearDatabase.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função principal para limpar o banco de dados
const cleanDatabase = async () => {
  await mongoose.connect(process.env.DB_URI as string);
  console.log('Connected to MongoDB');

  try {
    const collections = [
      'sessions',
      'questions',
      'choices',
      'professors',
      'questionnaires',
      'answers'
    ];

    for (const collection of collections) {
      const result = await mongoose.connection.db.collection(collection).deleteMany({});
      console.log(`${result.deletedCount} registros removidos de ${collection}.`);
    }
    console.log('Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Confirmação antes de limpar o banco de dados
const confirmAndClean = async () => {
  rl.question('Tem certeza de que deseja limpar o banco de dados? (sim/não): ', async (answer) => {
    if (answer.toLowerCase() === 'sim') {
      await cleanDatabase();
    } else {
      console.log('Operação cancelada.');
    }
    rl.close();
  });
};

// Executa a função de confirmação
confirmAndClean();
