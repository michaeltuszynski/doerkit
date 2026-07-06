import type { ModelClient } from './modelClient.js';
import { buildGradingSystemPrompt, buildGradingUserPrompt } from './prompt.js';
import type { CrqQuestion, GradedResponse, McqQuestion } from './types.js';

interface CriterionJudgment {
  id: string;
  met: boolean;
}

/** Pure: grade a multiple-choice selection. */
export function gradeMcq(question: McqQuestion, selectedChoice: number): GradedResponse {
  const correct = selectedChoice === question.correctChoice;
  return {
    questionId: question.id,
    verdict: correct ? 'correct' : 'incorrect',
    score: correct ? 1 : 0,
    feedback: correct
      ? 'Correct.'
      : `Not quite — the correct answer was: ${question.choices[question.correctChoice] ?? '?'}`,
  };
}

/**
 * Verdict from weighted criteria: all met → correct, none met → incorrect,
 * anything between → partial. Score is the weighted fraction earned.
 */
export function deriveVerdict(
  question: CrqQuestion,
  judgments: CriterionJudgment[],
): { verdict: GradedResponse['verdict']; score: number } {
  const byId = new Map(judgments.map((j) => [j.id, j.met]));
  let earned = 0;
  let total = 0;
  let metCount = 0;
  for (const criterion of question.rubric) {
    total += criterion.weight;
    if (byId.get(criterion.id) === true) {
      earned += criterion.weight;
      metCount += 1;
    }
  }
  const score = total === 0 ? 0 : earned / total;
  if (metCount === question.rubric.length) return { verdict: 'correct', score };
  if (metCount === 0) return { verdict: 'incorrect', score };
  return { verdict: 'partial', score };
}

/** Extract the first top-level JSON object from model output. */
export function parseGraderJson(raw: string): { criteria: CriterionJudgment[]; feedback: string } {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) {
    throw new Error(`Grader returned no JSON object: ${raw.slice(0, 120)}`);
  }
  const parsed: unknown = JSON.parse(raw.slice(start, end + 1));
  if (typeof parsed !== 'object' || parsed === null)
    throw new Error('Grader JSON is not an object');
  const obj = parsed as Record<string, unknown>;
  if (!Array.isArray(obj.criteria) || typeof obj.feedback !== 'string') {
    throw new Error('Grader JSON missing criteria[] or feedback');
  }
  const criteria = obj.criteria.map((c) => {
    const rec = c as Record<string, unknown>;
    if (typeof rec.id !== 'string' || typeof rec.met !== 'boolean') {
      throw new Error('Grader JSON criterion missing id/met');
    }
    return { id: rec.id, met: rec.met };
  });
  return { criteria, feedback: obj.feedback };
}

/** Grade a constructed-response answer with an LLM against the rubric. */
export async function gradeCrq(
  client: ModelClient,
  question: CrqQuestion,
  studentAnswer: string,
): Promise<GradedResponse> {
  const raw = await client.complete(
    buildGradingSystemPrompt(),
    buildGradingUserPrompt(question, studentAnswer),
  );
  const { criteria, feedback } = parseGraderJson(raw);
  const { verdict, score } = deriveVerdict(question, criteria);
  return { questionId: question.id, verdict, score, feedback };
}
