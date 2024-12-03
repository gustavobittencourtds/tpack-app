// src/models/Question.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  session_id: mongoose.Types.ObjectId;
  text: string;
  type: 'multiple_choice' | 'scale' | 'number' | 'text' | 'intro';
  note?: string;
  order: number;
  choices?: mongoose.Types.ObjectId[]; // Relacionamento com as Choices
}

const QuestionSchema = new Schema<IQuestion>({
  session_id: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple_choice', 'scale', 'number', 'text', 'intro'], required: true },
  note: { type: String },
  order: { type: Number, required: true },
  choices: [{ type: Schema.Types.ObjectId, ref: 'Choice' }], // Referência às Choices
});

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
