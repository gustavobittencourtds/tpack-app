import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('As variáveis EMAIL_USER e EMAIL_PASS precisam estar definidas no .env');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
} as nodemailer.TransportOptions); // Usando TransportOptions diretamente

export async function sendEmail(to: string, link: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER as string,
      to,
      subject: 'Seu Questionário de Avaliação TPACK',
      text: `Olá! Acesse o link para responder ao questionário: ${link}. Esse link expira em 48 horas.`,
    });
    console.log(`Email enviado para ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
}
