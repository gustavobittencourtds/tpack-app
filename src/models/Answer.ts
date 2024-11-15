// src/models/Answer.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IAnswer extends Document {
  userId: string;
  questionId: Types.ObjectId;
  answer: string | number | string[];
}

const answerSchema = new Schema<IAnswer>({
  userId: { type: String, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: Schema.Types.Mixed, required: true },
});

export default mongoose.models.Answer || mongoose.model<IAnswer>('Answer', answerSchema);
