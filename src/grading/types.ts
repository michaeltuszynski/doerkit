/**
 * Grading domain types. The LLM grading engine that implements these lands in M2
 * (series post 2); rubric/verdict shapes stay compatible with rubric-bench so the
 * production grader can be dropped straight into a golden-set run.
 */

export type QuestionKind = 'mcq' | 'crq';

export interface McqQuestion {
  kind: 'mcq';
  id: string;
  prompt: string;
  choices: string[];
  /** Index into choices. */
  correctChoice: number;
}

export interface CrqQuestion {
  kind: 'crq';
  id: string;
  prompt: string;
  modelAnswer: string;
  rubric: Array<{ id: string; description: string; weight: number }>;
}

export type QuizQuestion = McqQuestion | CrqQuestion;

export interface GradedResponse {
  questionId: string;
  verdict: 'correct' | 'partial' | 'incorrect';
  /** 0–1 fraction of credit earned. */
  score: number;
  /** Shown to the student. Tone matters: specific, encouraging, names what was missing. */
  feedback: string;
}
