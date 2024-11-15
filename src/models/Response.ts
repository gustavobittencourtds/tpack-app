// src/models/Response.ts
import mongoose, { Document } from 'mongoose';

interface IResponse extends Document {
  professor_id: mongoose.Schema.Types.ObjectId;
  session_id: mongoose.Schema.Types.ObjectId;
  question_id: mongoose.Schema.Types.ObjectId;
  answer: string | number | Array<string | number>;
  timestamp: Date;
}

const responseSchema = new mongoose.Schema<IResponse>({
  professor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: mongoose.Schema.Types.Mixed, required: true }, // Permite flexibilidade no tipo de resposta
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IResponse>('Response', responseSchema);
