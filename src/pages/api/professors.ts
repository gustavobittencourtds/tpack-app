import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Professor from '../../models/Professor';
import fs from 'fs';
import path from 'path';

const csvFilePath = path.join(process.cwd(), 'data', 'emails.csv');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, query: { id }, body: { email } } = req;

  switch (method) {
    case 'GET':
      try {
        const professors = await Professor.find().select('_id email').lean();
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
        const newProfessor = await Professor.create({ email });
        fs.appendFileSync(csvFilePath, `\n${email}`);
        return res.status(201).json(newProfessor);
      } catch (error) {
        console.error('Erro ao adicionar professor:', error);
        return res.status(500).json({ message: 'Erro ao adicionar professor', error: error instanceof Error ? error.message : 'Erro desconhecido' });
      }

    case 'PUT':
      if (!id || !email) {
        return res.status(400).json({ message: 'ID e email são obrigatórios' });
      }

      try {
        const updatedProfessor = await Professor.findByIdAndUpdate(id, { email }, { new: true });
        if (!updatedProfessor) {
          return res.status(404).json({ message: 'Professor não encontrado' });
        }

        // Atualizar o arquivo CSV
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        const updatedCsvData = csvData
          .split('\n')
          .map((line) => (line.includes(updatedProfessor.email) ? email : line))
          .join('\n');
        fs.writeFileSync(csvFilePath, updatedCsvData);

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
        const deletedProfessor = await Professor.findByIdAndDelete(id);
        if (!deletedProfessor) {
          return res.status(404).json({ message: 'Professor não encontrado' });
        }

        // Atualizar o arquivo CSV
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        const updatedCsvData = csvData
          .split('\n')
          .filter((line) => !line.includes(deletedProfessor.email))
          .join('\n');
        fs.writeFileSync(csvFilePath, updatedCsvData);

        return res.status(200).json({ message: 'Professor removido com sucesso' });
      } catch (error) {
        console.error('Erro ao remover professor:', error);
        return res.status(500).json({ message: 'Erro ao remover professor', error: error instanceof Error ? error.message : 'Erro desconhecido' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Método ${method} não permitido` });
  }
}
