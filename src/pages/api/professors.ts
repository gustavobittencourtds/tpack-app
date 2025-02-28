import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Professor from '../../models/Professor';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const { method, query: { id }, body: { email } } = req;

    switch (method) {
      // No arquivo professors.ts, modifique o case 'GET' para:
      case 'GET':
      try {
        // Se foram passados userIds na query, filtra por eles
        if (req.query.userIds) {
          const userIds = Array.isArray(req.query.userIds)
            ? req.query.userIds
            : (req.query.userIds as string).split(',');

          const professors = await Professor.find({
            userId: { $in: userIds }
          }).select('_id email userId').lean();

          if (!professors || professors.length === 0) {
            return res.status(404).json({ message: 'Nenhum professor encontrado' });
          }
          return res.status(200).json({ professors });
        }

        // Caso contrário, mantém a busca original por userId do token
        const professors = await Professor.find({ userId }).select('_id email userId').lean();
        if (!professors || professors.length === 0) {
          return res.status(404).json({ message: 'Nenhum professor encontrado' });
        }
        return res.status(200).json({ professors });
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
        return res.status(500).json({ message: 'Erro ao buscar professores', error: error instanceof Error ? error.message : 'Erro desconhecido' });
      }

      case 'POST':
        if (!email) {
          return res.status(400).json({ message: 'Email é obrigatório' });
        }

        try {
          // Verificar se o email já está vinculado ao usuário logado
          const existingProfessor = await Professor.findOne({ email, userId });
          if (existingProfessor) {
            return res.status(400).json({ message: 'Email já cadastrado para este usuário' });
          }

          const newProfessor = await Professor.create({ email, userId });
          return res.status(201).json(newProfessor);
        } catch (error) {
          console.error('Erro ao adicionar professor:', error);

          // Captura o erro de duplicidade e retorna uma mensagem amigável
          if ((error as any).code === 11000) {
            return res.status(400).json({ message: 'Email já cadastrado para este usuário' });
          }

          return res.status(500).json({ message: 'Erro ao adicionar professor', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }

      case 'PUT':
        if (!id || !email) {
          return res.status(400).json({ message: 'ID e email são obrigatórios' });
        }

        try {
          const updatedProfessor = await Professor.findOneAndUpdate({ _id: id, userId }, { email }, { new: true });
          if (!updatedProfessor) {
            return res.status(404).json({ message: 'Professor não encontrado' });
          }

          return res.status(200).json(updatedProfessor);
        } catch (error) {
          console.error('Erro ao editar professor:', error);
          return res.status(500).json({ message: 'Erro ao editar professor', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ message: 'ID é obrigatório' });
        }

        try {
          const deletedProfessor = await Professor.findOneAndDelete({ _id: id, userId });
          if (!deletedProfessor) {
            return res.status(404).json({ message: 'Professor não encontrado' });
          }

          return res.status(200).json({ message: 'Professor removido com sucesso' });
        } catch (error) {
          console.error('Erro ao remover professor:', error);
          return res.status(500).json({ message: 'Erro ao remover professor', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Método ${method} não permitido` });
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
}