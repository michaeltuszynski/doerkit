import { gradeCrq, gradeMcq } from '../grading/grader.js';
import type { ModelClient } from '../grading/modelClient.js';
import type { GradedResponse, QuizQuestion } from '../grading/types.js';
import type { QuestionBank } from './content.js';

export const LESSON_QUIZ_SIZE = 4;
export const LESSON_PASS = 0.75;
export const REVIEW_QUIZ_SIZE = 10;
export const REVIEW_PASS = 0.9;

/** Deterministic-free random pick without replacement. */
function pick<T>(pool: T[], n: number): T[] {
  const copy = [...pool];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(...copy.splice(i, 1));
  }
  return out;
}

/** 4 random questions from one lesson's bank, biased to include CRQ. */
export function pickLessonQuiz(bank: QuestionBank): QuizQuestion[] {
  const crq = bank.questions.filter((q) => q.kind === 'crq');
  const mcq = bank.questions.filter((q) => q.kind === 'mcq');
  const chosen = [...pick(crq, 2), ...pick(mcq, LESSON_QUIZ_SIZE - Math.min(2, crq.length))];
  return pick(chosen, chosen.length); // shuffle order
}

/**
 * Module review: interleaved questions across all lessons — at most two per
 * lesson, so retrieval hops between topics (the interleaving the Dartmouth
 * review data pointed at).
 */
export function pickReviewQuiz(banks: QuestionBank[]): QuizQuestion[] {
  const perLesson = banks.map((b) => pick(b.questions, 2));
  const flat = perLesson.flat();
  return pick(flat, Math.min(REVIEW_QUIZ_SIZE, flat.length));
}

export interface QuizGradeResult {
  graded: Array<{ question: QuizQuestion; response: GradedResponse }>;
  score: number;
  passed: boolean;
}

/**
 * Grade a submitted quiz. MCQ answers are choice indices; CRQ answers are
 * free text (graded with one model call each, concurrently).
 */
export async function gradeQuiz(
  client: ModelClient,
  questions: QuizQuestion[],
  answers: Map<string, string>,
  passThreshold: number,
): Promise<QuizGradeResult> {
  const graded = await Promise.all(
    questions.map(async (question) => {
      const raw = answers.get(question.id) ?? '';
      const response =
        question.kind === 'mcq'
          ? gradeMcq(question, Number(raw))
          : await gradeCrq(client, question, raw.trim() || '(blank)');
      return { question, response };
    }),
  );
  const score =
    graded.length === 0 ? 0 : graded.reduce((sum, g) => sum + g.response.score, 0) / graded.length;
  return { graded, score, passed: score >= passThreshold };
}

/** Hours until a spaced retry is "due" (encourages next-day retries, not cramming). */
export const RETRY_SPACING_HOURS = 20;

export function retryNudge(lastAttemptIso: string | undefined, now: Date): string | null {
  if (!lastAttemptIso) return null;
  const elapsedH = (now.getTime() - new Date(lastAttemptIso).getTime()) / 3_600_000;
  if (elapsedH >= RETRY_SPACING_HOURS) return null;
  const wait = Math.ceil(RETRY_SPACING_HOURS - elapsedH);
  return `You attempted this review recently. Retrieval sticks better with a gap — coming back in about ${wait}h beats retrying now (you can retry anyway).`;
}
