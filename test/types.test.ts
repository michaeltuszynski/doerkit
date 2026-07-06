import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { GradedResponse, QuizQuestion } from '../src/index.js';

test('question union discriminates on kind', () => {
  const questions: QuizQuestion[] = [
    { kind: 'mcq', id: 'q1', prompt: 'Pick one', choices: ['a', 'b'], correctChoice: 1 },
    {
      kind: 'crq',
      id: 'q2',
      prompt: 'Explain why',
      modelAnswer: 'Because outliers.',
      rubric: [{ id: 'r1', description: 'mentions outliers', weight: 1 }],
    },
  ];
  const crqs = questions.filter((q) => q.kind === 'crq');
  assert.equal(crqs.length, 1);
  assert.equal(crqs[0]?.rubric.length, 1);
});

test('graded response carries verdict, score, and feedback', () => {
  const graded: GradedResponse = {
    questionId: 'q2',
    verdict: 'partial',
    score: 0.5,
    feedback: 'Good start — now say what outliers do to the mean.',
  };
  assert.equal(graded.verdict, 'partial');
  assert.ok(graded.score > 0 && graded.score < 1);
  assert.match(graded.feedback, /outliers/);
});
