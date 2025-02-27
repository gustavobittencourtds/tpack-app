import mongoose, { Schema, Document } from 'mongoose';

interface IRound extends Document {
  roundNumber: number; // Número sequencial da rodada
  sentDate: Date; // Data de envio da rodada
  status: 'open' | 'closed' | 'finalized'; // Status da rodada
  description?: string; // Descrição opcional da rodada
  userId: mongoose.Types.ObjectId; // Referência ao usuário que criou a rodada
}

const RoundSchema = new Schema<IRound>({
  roundNumber: { type: Number, required: true, unique: true },
  sentDate: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['open', 'closed', 'finalized'], default: 'open' },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Round || mongoose.model<IRound>('Round', RoundSchema);