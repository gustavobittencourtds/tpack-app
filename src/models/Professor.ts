// src/models/Professor.ts
import mongoose, { Schema, Document } from 'mongoose';

// Interface para uma pesquisa respondida
export interface AnsweredSurvey {
  surveyId: mongoose.Types.ObjectId; // Relacionado ao questionário
  responses: Map<string, string | string[]>; // Respostas por questão
  submittedAt: Date; // Data de envio
}

// Interface do Professor
export interface IProfessor extends Document {
  email: string; // Email do professor
  answeredSurveys: AnsweredSurvey[]; // Questionários respondidos
}

// Sub-esquema para pesquisas respondidas
const AnsweredSurveySchema = new Schema<AnsweredSurvey>({
  surveyId: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
  responses: { type: Map, of: Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, required: true },
});

// Esquema principal do Professor
const ProfessorSchema = new Schema<IProfessor>({
  email: { type: String, required: true, unique: true },
  answeredSurveys: [AnsweredSurveySchema],
});

// Exportação do modelo
export default mongoose.models.Professor || mongoose.model<IProfessor>('Professor', ProfessorSchema);
