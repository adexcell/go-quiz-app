export interface Question {
  id: number;
  topic: string;
  question_text: string;
  options: string[];
  correct_options: number[];
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  userAnswers: Map<number, number[]>; // questionId -> selectedOptionIndices
  history: {
    questionId: number;
    isCorrect: boolean;
  }[];
}

export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';