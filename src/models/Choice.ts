import mongoose, { Schema, Document } from 'mongoose';

export interface IChoice extends Document {
  question_id: mongoose.Types.ObjectId;
  text: string;
  level?: number;
  nextLevel?: number;
}

const ChoiceSchema = new Schema<IChoice>({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  text: { type: String, required: true },
  level: { type: Number, default: null },
  nextLevel: { type: Number, default: null },
});

export default mongoose.models.Choice || mongoose.model<IChoice>('Choice', ChoiceSchema);
