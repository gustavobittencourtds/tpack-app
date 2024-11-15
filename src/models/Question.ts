// src/models/Question.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  type: string;
  note?: string;
  order: number;
  session_id: mongoose.Types.ObjectId;
}

const questionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  type: { type: String, required: true },
  note: { type: String },
  order: { type: Number, required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
});

// Verifica se o modelo já foi definido antes de criá-lo
export default mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema);
