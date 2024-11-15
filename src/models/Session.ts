// src/models/Session.ts
import mongoose, { Document } from 'mongoose';

interface ISession extends Document {
  title: string;
  description?: string;
  order: number;
}

const sessionSchema = new mongoose.Schema<ISession>({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true }
});

export default mongoose.model<ISession>('Session', sessionSchema);
