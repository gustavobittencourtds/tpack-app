import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
} as nodemailer.TransportOptions);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log('Método da requisição:', req.method);
  // console.log('Corpo da requisição:', req.body);

  if (req.method !== 'POST') {
    console.log('Método não permitido:', req.method);
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { to, questionnaireId } = req.body;

  if (!to) {
    console.log('Campo "to" não definido no corpo da requisição');
    return res.status(400).json({ message: 'Campo "to" é obrigatório' });
  }


  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Recebimento</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            color: #2d3436;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          h1 {
            font-size: 2rem;
            color: #2d3436;
            margin-bottom: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          p {
            font-size: 1.1rem;
            color: #636e72;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }
          .note {
            font-size: 0.9rem;
            color: #636e72;
            margin-top: 1.5rem;
            padding-left: 1rem;
            border-left: 3px solid #6c5ce7;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #2d3436;
              color: #dfe6e9;
            }
            .container {
              background: rgba(30, 30, 30, 0.95);
              border-color: rgba(255, 255, 255, 0.1);
            }
            h1 {
              color: #ffffff;
            }
            p {
              color: #b2bec3;
            }
            .note {
              color: #b2bec3;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Confirmação de Recebimento</h1>
          <p>Olá!</p>
          <p>Recebemos suas respostas para o questionário de avaliação TPACK. Agradecemos por sua participação!</p>
          <p class="note">Se você tiver alguma dúvida ou precisar de mais informações, sinta-se à vontade para responder a este e-mail.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"TPACK APP" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Confirmação de Recebimento - Questionário TPACK',
      text: 'Recebemos suas respostas para o questionário de avaliação TPACK. Agradecemos por sua participação!',
      html: emailHtml,
    });

    return res.status(200).json({ message: 'E-mail de confirmação enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de confirmação:', error);
    return res.status(500).json({ message: 'Erro ao enviar e-mail de confirmação' });
  }
}