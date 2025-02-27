import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from "../../utils/dbConnect";
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Conecta ao banco de dados

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, password } = req.body;

  try {
    console.log("Tentativa de login:", email);

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuário não encontrado");
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Senha incorreta");
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '78h' });

    console.log("Login bem-sucedido, token gerado:", token);

    res.status(200).json({ token });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: 'Erro ao fazer login', error: (error as Error).message });
  }
}
