// src/models/Questionnaire.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IQuestionnaire extends Document {
  title: string;
  description: string;
  userId: string;
  questions: Types.ObjectId[];
  completed: boolean;
}

const questionnaireSchema = new Schema<IQuestionnaire>({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
  completed: { type: Boolean, default: false },
});

export default mongoose.models.Questionnaire || mongoose.model<IQuestionnaire>('Questionnaire', questionnaireSchema);
