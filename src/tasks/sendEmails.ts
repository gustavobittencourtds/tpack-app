// src/tasks/sendEmails.ts
import csvParser from 'csv-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/emailUtils';
import dbConnect from '../utils/dbConnect';
import Questionnaire from '../models/Questionnaire';
import Question from '../models/Question';
import Professor from '../models/Professor';
import mongoose from 'mongoose';

dotenv.config();

async function processEmailsFromCSV(filePath: string) {
  await dbConnect();

  const results: string[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data.email))
    .on('end', async () => {
      for (const email of results) {
        try {
          const professor = await Professor.findOne({ email }).lean();
          if (!professor) {
            console.warn(`⚠ Professor com e-mail ${email} não encontrado. Pulando...`);
            continue;
          }

          const userId = new mongoose.Types.ObjectId(professor._id);

          const questions = await Question.find().select('_id');
          const questionIds = questions.map((q) => q._id);

          const newQuestionnaire = await Questionnaire.create({
            title: 'Avaliação TPACK',
            description: 'Questionário para avaliar o uso de tecnologia em práticas pedagógicas.',
            userId,
            questions: questionIds,
            completed: false,
            sentDate: new Date(),
          });

          const questionnaireId = newQuestionnaire._id;

          const token = jwt.sign(
            {
              userId: userId.toString(),
              questionnaireId,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '48h' }
          );

          const link = `http://localhost:3000/survey?token=${token}`;

          await sendEmail(email, link);
          console.log(`E-mail enviado para ${email}`);
        } catch (error) {
          console.error(`Erro ao criar questionário ou enviar e-mail para ${email}:`, error);
        }
      }
    })
    .on('error', (error) => console.error('Erro ao processar o arquivo CSV:', error));
}

(async () => {
  const filePath = 'data/emails.csv';
  await processEmailsFromCSV(filePath);
})();