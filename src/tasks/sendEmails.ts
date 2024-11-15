// src/tasks/sendEmails.ts
import csvParser from 'csv-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/emailUtils';

dotenv.config();

async function processEmailsFromCSV(filePath: string) {
  const results: string[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data.email))
    .on('end', async () => {
      for (const email of results) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '48h' });

        // Envia o e-mail com o link atualizado
        const link = `http://localhost:3000/survey?token=${token}`;
        await sendEmail(email, link);
        console.log(`E-mail enviado para ${email} com link: ${link}`);
      }
    })
    .on('error', (error) => console.error('Erro ao processar o arquivo CSV:', error));
}

// Executa o processamento
(async () => {
  const filePath = 'data/emails.csv'; // Substitua pelo caminho correto
  await processEmailsFromCSV(filePath);
})();
