export enum Category {
  NUMERICAL = 'numerical',
  LOGICAL = 'logical',
  SPATIAL = 'spatial',
  VERBAL = 'verbal',
}

export interface Question {
  id: number;
  category: Category;
  questionText: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  asciiArt?: string; // Optional visual representation
}

export interface UserAnswers {
  [questionId: number]: number; // Maps question ID to selected option index
}

export interface ScoreAnalysis {
  iqEstimate: number;
  classification: string;
  correctCount: number;
  breakdown: Record<Category, { correct: number; total: number }>;
}