import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadBanks, loadLessons } from '../src/app/content.js';
import { renderDashboard } from '../src/app/dashboard.js';
import { openDb, passedLessons, recordAttempt, recordEvent, reviewPassed } from '../src/app/db.js';
import {
  LESSON_PASS,
  REVIEW_PASS,
  gradeQuiz,
  pickLessonQuiz,
  pickReviewQuiz,
  retryNudge,
} from '../src/app/quiz.js';
import type { ModelClient } from '../src/grading/modelClient.js';

const lessons = loadLessons();
const banks = loadBanks();

test('content loads: 6 ordered lessons, 6 banks of 10 with both kinds', () => {
  assert.equal(lessons.length, 6);
  assert.deepEqual(
    lessons.map((l) => l.order),
    [1, 2, 3, 4, 5, 6],
  );
  assert.equal(banks.size, 6);
  for (const [id, bank] of banks) {
    assert.equal(bank.questions.length, 10, `${id} bank size`);
    assert.ok(
      bank.questions.some((q) => q.kind === 'crq'),
      `${id} has crq`,
    );
    assert.ok(
      bank.questions.some((q) => q.kind === 'mcq'),
      `${id} has mcq`,
    );
  }
});

test('lesson quiz picks 4 questions including 2 CRQ; review interleaves lessons', () => {
  const bank = banks.get('m1-l01');
  assert.ok(bank);
  const quiz = pickLessonQuiz(bank);
  assert.equal(quiz.length, 4);
  assert.equal(quiz.filter((q) => q.kind === 'crq').length, 2);

  const review = pickReviewQuiz([...banks.values()]);
  assert.equal(review.length, 10);
  const lessonsCovered = new Set(review.map((q) => q.id.slice(0, 6)));
  assert.ok(lessonsCovered.size >= 5, `review spans ${lessonsCovered.size} lessons`);
});

test('gradeQuiz applies pass thresholds with mixed MCQ/CRQ', async () => {
  const bank = banks.get('m1-l01');
  assert.ok(bank);
  const mcqs = bank.questions.filter((q) => q.kind === 'mcq').slice(0, 3);
  const crq = bank.questions.find((q) => q.kind === 'crq');
  assert.ok(crq);
  const alwaysCorrect: ModelClient = {
    id: 'fake',
    complete: async () =>
      JSON.stringify({
        criteria: crq.rubric.map((r) => ({ id: r.id, met: true })),
        feedback: 'Solid.',
      }),
  };
  const questions = [...mcqs, crq];
  const answers = new Map<string, string>();
  for (const q of mcqs) answers.set(q.id, String(q.correctChoice));
  answers.set(crq.id, 'a real attempt');
  const result = await gradeQuiz(alwaysCorrect, questions, answers, LESSON_PASS);
  assert.equal(result.passed, true);
  assert.equal(result.score, 1);

  const oneWrong = new Map(answers);
  const firstMcq = mcqs[0];
  assert.ok(firstMcq);
  oneWrong.set(firstMcq.id, String((firstMcq.correctChoice + 1) % 4));
  const partial = await gradeQuiz(alwaysCorrect, questions, oneWrong, REVIEW_PASS);
  assert.equal(partial.passed, false, '75% must fail the 90% review bar');
  assert.equal(partial.score, 0.75);
});

test('db records attempts/events and progress queries reflect them', () => {
  const db = openDb(':memory:');
  recordEvent(db, 'ada', 'lesson_view', 'm1-l01');
  recordAttempt(db, 'ada', 'lesson', 'm1-l01', 1, true);
  recordAttempt(db, 'ada', 'lesson', 'm1-l02', 0.5, false);
  recordAttempt(db, 'ada', 'review', null, 0.9, true);
  assert.deepEqual([...passedLessons(db, 'ada')], ['m1-l01']);
  assert.equal(reviewPassed(db, 'ada'), true);
  const html = renderDashboard(db, lessons);
  assert.match(html, /ada/);
  assert.match(html, /1\/6/);
  assert.match(html, /lesson_view/);
});

test('retryNudge fires inside the spacing window and clears after it', () => {
  const now = new Date('2026-07-06T12:00:00Z');
  assert.equal(retryNudge(undefined, now), null);
  assert.match(retryNudge('2026-07-06T10:00:00Z', now) ?? '', /gap/);
  assert.equal(retryNudge('2026-07-05T10:00:00Z', now), null);
});
