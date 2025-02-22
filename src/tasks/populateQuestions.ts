import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from '../models/Session';
import Question from '../models/Question';
import Choice from '../models/Choice';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function readJSONFile(filePath: string) {
  const data = fs.readFileSync(path.join(__dirname, '..', '..', 'data', filePath), 'utf-8');
  return JSON.parse(data);
}

async function populateQuestions() {
  const sessionsData = readJSONFile('sessions.json');
  const questionsData = readJSONFile('questions.json');
  const choicesData = readJSONFile('choices.json');

  const sessionDocs = [];
  for (const s of sessionsData) {
    let session = await Session.findOne({ title: s.title });
    if (!session) {
      session = await Session.create({ title: s.title, order: s.order });
      console.log(`Sessão "${s.title}" inserida.`);
    } else {
      console.log(`Sessão "${s.title}" já existe.`);
    }
    sessionDocs.push(session);
  }

  const sessionMap = sessionDocs.reduce((map, doc) => {
    map[doc.order] = doc._id;
    return map;
  }, {} as { [key: number]: mongoose.Types.ObjectId });

  const questionDocs = [];
  for (const question of questionsData) {
    let existingQuestion = await Question.findOne({ text: question.text });
    if (!existingQuestion) {
      existingQuestion = await Question.create({
        session_id: sessionMap[question.session_id],
        text: question.text,
        type: question.type,
        note: question.note,
        order: question.order,
      });
      console.log(`Pergunta "${question.text}" inserida.`);
    } else {
      console.log(`Pergunta "${question.text}" já existe.`);
    }
    questionDocs.push(existingQuestion);
  }

  const questionMap = questionDocs.reduce((map, doc) => {
    map[doc.order] = doc._id;
    return map;
  }, {} as { [key: number]: mongoose.Types.ObjectId });

  for (const choice of choicesData) {
    let existingChoice = await Choice.findOne({ text: choice.text, question_id: questionMap[choice.question_id] });
    if (!existingChoice) {
      const createdChoice = await Choice.create({
        question_id: questionMap[choice.question_id],
        text: choice.text,
        level: choice.level,
        nextLevel: choice.nextLevel,
      });
      await Question.findByIdAndUpdate(questionMap[choice.question_id], {
        $push: { choices: createdChoice._id },
      });
      console.log(`Opção "${choice.text}" inserida e vinculada à pergunta.`);
    } else {
      console.log(`Opção "${choice.text}" já existe.`);
    }
  }

  console.log('\n----------\nPopulação do banco de dados concluída.\n----------\n');
  mongoose.connection.close();
}

(async () => {
  await connectDB();
  await populateQuestions();
})();
