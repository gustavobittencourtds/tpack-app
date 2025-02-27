import dbConnect from "../../utils/dbConnect";
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Conecta ao banco de dados

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria um novo usuário
    const user = new User({
      email,
      password: hashedPassword,
      professors: [],
      rounds: [],
    });
    await user.save();

    console.log('Usuário criado com sucesso:', user);

    // Retorna sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: (error as Error).message });
  }
}