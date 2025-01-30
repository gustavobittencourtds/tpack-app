// src/models/Answer.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IAnswer extends Document {
  questionnaireId: Types.ObjectId; // Relacionamento com o questionário
  userId: string; // Identificação do usuário que respondeu
  questionId: Types.ObjectId; // Relacionamento com a pergunta
  answer: string | number | string[]; // Resposta (texto, número ou múltipla escolha)
  createdAt: Date; // Data de criação da resposta
}

const answerSchema = new Schema<IAnswer>({
  questionnaireId: { type: Schema.Types.ObjectId, ref: 'Questionnaire', required: true }, // Adicionado o vínculo com o questionário
  userId: { type: String, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }, // Campo para registrar a data de envio
});

export default mongoose.models.Answer || mongoose.model<IAnswer>('Answer', answerSchema);
