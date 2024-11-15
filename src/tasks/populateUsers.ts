import csvParser from 'csv-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Professor from '../models/Professor';

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

async function processEmailsFromCSV(filePath: string) {
  const emails: string[] = [];

  const processEmails = async () => {
    for (const email of emails) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '48h' });
      const tokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const sendDate = new Date();

      const existingProfessor = await Professor.findOne({ email });
      if (existingProfessor) {
        existingProfessor.token = token;
        existingProfessor.tokenExpires = tokenExpires;
        existingProfessor.sendDate = sendDate;
        await existingProfessor.save();
      } else {
        await Professor.create({ email, token, tokenExpires, sendDate });
      }

      console.log(`E-mail processado para ${email}`);
    }

    console.log('Processamento de e-mails concluído.');
    mongoose.connection.close();
  };

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => emails.push(data.email))
    .on('end', processEmails)
    .on('error', (error) => console.error('Erro ao processar CSV:', error));
}

(async () => {
  await connectDB();
  await processEmailsFromCSV('data/emails.csv');
})();
