import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Suprime avisos de depreciação
process.removeAllListeners('warning');

dotenv.config();

// Função para limpar todo o banco de dados
const cleanDatabase = async () => {
  await mongoose.connect(process.env.DB_URI as string);
  console.log('\x1b[32m%s\x1b[0m', '✅ Conectado ao MongoDB');

  try {
    // Obtém todas as coleções do banco de dados
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Itera sobre cada coleção e remove todos os documentos
    for (const collection of collections) {
      const collectionName = collection.name;
      const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
      console.log('\x1b[33m%s\x1b[0m', `🗑️ ${result.deletedCount} registros removidos de ${collectionName}.`);
    }

    console.log('\x1b[32m%s\x1b[0m', '🎉 Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Erro ao limpar o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Função para perguntar ao usuário se deseja limpar o banco de dados
const askToCleanDatabase = () => {
  process.stdout.write('\x1b[36mTem certeza de que deseja limpar TODO o banco de dados? (sim/não): \x1b[0m');

  process.stdin.once('data', (input) => {
    const answer = input.toString().trim().toLowerCase();

    if (answer === 'sim' || answer === 's') {
      cleanDatabase();
    } else {
      console.log('\x1b[31m%s\x1b[0m', '🚫 Operação cancelada.'); // Vermelho
      process.exit(0); // Encerra o processo
    }
  });
};

// Inicia o processo de confirmação
askToCleanDatabase();