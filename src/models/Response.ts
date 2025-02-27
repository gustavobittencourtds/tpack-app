import mongoose, { Document } from 'mongoose';

interface IResponse extends Document {
  professor_id: mongoose.Schema.Types.ObjectId; // Referência ao professor
  session_id: mongoose.Schema.Types.ObjectId; // Referência à sessão
  question_id: mongoose.Schema.Types.ObjectId; // Referência à questão
  answer: string | number | Array<string | number>; // Resposta
  timestamp: Date; // Data de envio
}

const responseSchema = new mongoose.Schema<IResponse>({
  professor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Response || mongoose.model<IResponse>('Response', responseSchema);