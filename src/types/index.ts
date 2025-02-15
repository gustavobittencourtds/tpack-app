// src/types/index.ts

export interface Choice {
  _id: string;
  question_id: string;
  text: string;
  level?: number;
  nextLevel?: number;
}

export interface Question {
  _id: string;
  session_id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'scale' | 'number' | 'text' | 'intro';
  note?: string;
  order: number;
  choices?: Choice[];
}


export interface AnsweredSurvey {
  surveyId: string;
  responses: { [questionId: string]: string | string[] };
  submittedAt: Date;
}