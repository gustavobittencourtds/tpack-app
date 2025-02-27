import mongoose, { Schema, Document, Types } from 'mongoose';

interface IAnswer extends Document {
  questionnaireId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  answer: string | string[];
  submittedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionnaireId: { type: mongoose.Types.ObjectId, ref: 'Questionnaire', required: true },
  questionId: { type: mongoose.Types.ObjectId, ref: 'Question', required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, required: true },
});

export default mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);