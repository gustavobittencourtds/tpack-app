import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string; // Email do usuário
  password: string; // Senha do usuário
  professors: mongoose.Types.ObjectId[]; // Lista de professores associados ao usuário
  rounds: mongoose.Types.ObjectId[]; // Lista de rodadas associadas ao usuário
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  professors: [{ type: Schema.Types.ObjectId, ref: 'Professor' }],
  rounds: [{ type: Schema.Types.ObjectId, ref: 'Round' }],
});

// Certifique-se de que o modelo não seja recompilado se já estiver registrado
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;