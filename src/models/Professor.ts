import mongoose, { Schema, Document } from 'mongoose';

interface IProfessor extends Document {
  email: string; // Email do professor
  userId: mongoose.Types.ObjectId; // Referência ao usuário que criou o professor
  answeredSurveys: AnsweredSurvey[]; // Questionários respondidos
}

interface AnsweredSurvey {
  surveyId: mongoose.Types.ObjectId; // Relacionado ao questionário
  responses: Map<string, string | string[]>; // Respostas por questão
  submittedAt: Date; // Data de envio
}

const AnsweredSurveySchema = new Schema<AnsweredSurvey>({
  surveyId: { type: Schema.Types.ObjectId, ref: 'Questionnaire', required: true },
  responses: { type: Map, of: Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, required: true },
});

const ProfessorSchema = new Schema<IProfessor>({
  email: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answeredSurveys: [AnsweredSurveySchema],
});

// Garantir que a combinação de email e userId seja única
ProfessorSchema.index({ email: 1, userId: 1 }, { unique: true });

export default mongoose.models.Professor || mongoose.model<IProfessor>('Professor', ProfessorSchema);