// src/tasks/sendEmails.ts
import csvParser from 'csv-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/emailUtils';
import dbConnect from '../utils/dbConnect';
import Questionnaire from '../models/Questionnaire';
import Question from '../models/Question';

dotenv.config();

async function processEmailsFromCSV(filePath: string) {
  await dbConnect(); // Conectar ao MongoDB

  const results: string[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data.email))
    .on('end', async () => {
      for (const email of results) {
        try {
          // Criar um novo questionário
          const questions = await Question.find().select('_id'); // Seleciona os IDs das perguntas
          const questionIds = questions.map((q) => q._id);

          const newQuestionnaire = await Questionnaire.create({
            title: 'Avaliação TPACK',
            description: 'Questionário para avaliar o uso de tecnologia em práticas pedagógicas.',
            userId: email,
            questions: questionIds,
            completed: false,
          });

          const questionnaireId = newQuestionnaire._id;

          // Gerar o token com `questionnaireId`
          const token = jwt.sign(
            {
              email,
              questionnaireId, // Inclui o questionnaireId no token
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '48h' }
          );

          const link = `http://localhost:3000/survey?token=${token}`;

          // Envia o e-mail com o link
          await sendEmail(email, link);
          console.log(`E-mail enviado para ${email} com link: ${link}`);
        } catch (error) {
          console.error(`Erro ao criar questionário ou enviar e-mail para ${email}:`, error);
        }
      }
    })
    .on('error', (error) => console.error('Erro ao processar o arquivo CSV:', error));
}

// Executa o processamento
(async () => {
  const filePath = 'data/emails.csv';
  await processEmailsFromCSV(filePath);
})();
