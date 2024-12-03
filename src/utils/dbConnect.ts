import mongoose from 'mongoose';
import '../models/Choice'; // Certifique-se de importar o modelo aqui
import '../models/Question'; // Certifique-se de importar o modelo aqui

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.DB_URI as string);
    isConnected = db.connections[0].readyState === 1;
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}
