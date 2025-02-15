import mongoose, { Document } from 'mongoose';

interface ISession extends Document {
  title: string;
  order: number;
  description?: string;
}

const sessionSchema = new mongoose.Schema<ISession>({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  description: { type: String },
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);