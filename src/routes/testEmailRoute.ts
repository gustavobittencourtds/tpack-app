import express, { Request, Response } from 'express';
import { sendEmail } from '../utils/emailUtils.js';

const router = express.Router();

router.get('/send-test-email', async (req: Request, res: Response) => {
  try {
    await sendEmail('gustavo.bittencourtds@gmail.com', 'https://exemplo.com/questionario');
    res.send('E-mail de teste enviado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao enviar o e-mail de teste');
  }
});

export default router;