// pages/api/professor-questionnaires.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Questionnaire from '../../models/Questionnaire';
import Professor from '../../models/Professor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { professorId } = req.query;

  if (req.method === 'GET') {
    try {
      const professor = await Professor.findById(professorId).populate('answeredSurveys.surveyId');
      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      const questionnaires = professor.answeredSurveys.map((survey: any) => ({
        _id: survey.surveyId._id,
        title: survey.surveyId.title,
        responseDate: survey.submittedAt,
      }));

      return res.status(200).json({ questionnaires });
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      return res.status(500).json({ message: 'Erro ao buscar questionários', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  }

  return res.status(405).json({ message: `Método ${req.method} não permitido` });
}