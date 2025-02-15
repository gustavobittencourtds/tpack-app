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
} as nodemailer.TransportOptions);

export async function sendEmail(to: string, link: string): Promise<void> {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Questionário de Avaliação TPACK</title>
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
          .button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #6c5ce7, #8e7cf3);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(108, 92, 231, 0.2);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(108, 92, 231, 0.3);
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
          <h1>Questionário de Avaliação TPACK</h1>
          <p>Olá!</p>
          <p>Você foi convidado(a) para responder ao questionário de avaliação TPACK. Clique no botão abaixo para acessar o questionário:</p>
          <a href="${link}" class="button">Acessar Questionário</a>
          <p class="note">Este link expira em 48 horas. Se você não solicitou este questionário, por favor, ignore este e-mail.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER as string,
      to,
      subject: 'Seu Questionário de Avaliação TPACK',
      text: 'Você foi convidado(a) para responder ao questionário de avaliação TPACK. Clique no link para acessar o questionário: ' + link,
      html: emailHtml,
    });
    console.log(`E-mail enviado para ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
}