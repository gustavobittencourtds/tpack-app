import mongoose, { Schema, Document } from 'mongoose';

export interface IChoice extends Document {
  question_id: mongoose.Types.ObjectId;
  text: string;
  level?: number;
  nextLevel?: number;
}

const ChoiceSchema: Schema = new Schema({
  question_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Question' },
  text: { type: String, required: true },
  level: { type: Number, required: false },
  nextLevel: { type: Number, required: false },
});

export default mongoose.models.Choice || mongoose.model<IChoice>('Choice', ChoiceSchema);
