// src/types/index.ts

export interface Choice {
  _id: string;
  text: string;
}

export interface Question {
  _id: string;
  text: string;
  note?: string;
  type: 'multiple_choice' | 'scale' | 'number' | 'text';
  choices?: Choice[];
}

export interface AnsweredSurvey {
  surveyId: string;
  responses: { [questionId: string]: string | string[] };
  submittedAt: Date;
}