import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Questionnaire from '../../models/Questionnaire';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { userId, roundId, professorId } = req.query;
      const token = req.headers.authorization?.split(' ')[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
          // Se não foi passado userId explicitamente, use o do token
          if (!userId) {
            const userIdFromToken = decoded.userId;
            if (userIdFromToken) {
              req.query.userId = userIdFromToken;
            }
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          // Prossegue sem usar o userId do token
        }
      }

      let filter: any = {};

      if (req.query.userId) {
        if (!mongoose.Types.ObjectId.isValid(req.query.userId as string)) {
          return res.status(400).json({ message: 'userId inválido' });
        }
        filter.userId = new mongoose.Types.ObjectId(req.query.userId as string);
      }

      // Ajuste para verificar tanto roundId quanto round
      if (roundId) {
        if (!mongoose.Types.ObjectId.isValid(roundId as string)) {
          return res.status(400).json({ message: 'roundId inválido' });
        }
        // Verifica se o campo no banco é roundId ou round
        filter.roundId = new mongoose.Types.ObjectId(roundId as string);
      }

      if (professorId) {
        if (!mongoose.Types.ObjectId.isValid(professorId as string)) {
          return res.status(400).json({ message: 'professorId inválido' });
        }
        filter.professorId = new mongoose.Types.ObjectId(professorId as string);
      }

      const questionnaires = await Questionnaire.find(filter)
        .populate('questions')
        .lean();

      if (!questionnaires.length) {
        return res.status(200).json({ questionnaires: [] }); // Retorna array vazio em vez de 404
      }

      // Retorna os dados no formato esperado pelo getParticipatingProfessorsCount
      return res.status(200).json({
        questionnaires: questionnaires,
        count: questionnaires.length
      });
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      return res.status(500).json({ message: 'Erro ao buscar questionários', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, userId, questions, round, professorId } = req.body;

      if (!title || !userId || !questions || !Array.isArray(questions) || !round || !professorId) {
        return res.status(400).json({ message: 'Dados inválidos' });
      }

      const newQuestionnaire = await Questionnaire.create({
        title: `TPACK - Aplicação ${new Date().toLocaleDateString('pt-BR')}`,
        description,
        userId,
        questions,
        sentDate: new Date(),
        roundId: new mongoose.Types.ObjectId(round), // Ajustado para roundId para manter consistência
        professorId: new mongoose.Types.ObjectId(professorId),
      });

      return res.status(201).json({ message: 'Questionário criado com sucesso', data: newQuestionnaire });
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      return res.status(500).json({ message: 'Erro ao criar questionário', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ message: `Método ${req.method} não permitido` });
}