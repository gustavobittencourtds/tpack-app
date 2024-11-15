import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';
import testEmailRoute from './routes/testEmailRoute.js';

dotenv.config();

const app = express();
app.use(express.json());

// Configuração para preparar para Mongoose 7
mongoose.set('strictQuery', true); // Adicione esta linha

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Encerra o processo se não conseguir conectar
  }
}

connectDB(); // Estabelece a conexão ao iniciar o servidor

app.use('/api/emails', emailRoutes);


app.use('/api/test', testEmailRoute);

export default app;
