import { serve } from '@hono/node-server';
import { type Context, Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { marked } from 'marked';
import { createAnthropicClient } from '../grading/modelClient.js';
import type { QuizQuestion } from '../grading/types.js';
import { loadBanks, loadLessons } from './content.js';
import { renderDashboard } from './dashboard.js';
import {
  lastReviewAttempt,
  openDb,
  passedLessons,
  recordAttempt,
  recordEvent,
  reviewPassed,
} from './db.js';
import { esc, gradedCard, page, questionForm } from './html.js';
import {
  LESSON_PASS,
  REVIEW_PASS,
  gradeQuiz,
  pickLessonQuiz,
  pickReviewQuiz,
  retryNudge,
} from './quiz.js';

const db = openDb();
const lessons = loadLessons();
const banks = loadBanks();
const client = createAnthropicClient();
export const app = new Hono();

function student(c: Context): string {
  return getCookie(c, 'student') ?? '';
}

app.get('/', (c) => {
  const who = student(c);
  if (!who) {
    return c.html(
      page(
        'Welcome',
        `<h1>doerkit</h1><p>An assessment-first course. Pick a name to track your progress (stored locally).</p>
<form method="post" action="/hello"><input name="student" placeholder="your name" required> <button>Start</button></form>`,
      ),
    );
  }
  const done = passedLessons(db, who);
  const rows = lessons
    .map(
      (l) =>
        `<li class="${done.has(l.id) ? 'done' : 'todo'}"><a href="/lesson/${esc(l.id)}">${esc(l.title)}</a>${done.has(l.id) ? ' ✓' : ''}</li>`,
    )
    .join('\n');
  const review = reviewPassed(db, who) ? ' ✓' : '';
  return c.html(
    page(
      'Lessons',
      `<h1>Module 1: Descriptive Statistics</h1><p>Signed in as <strong>${esc(who)}</strong>.</p>
<ol>${rows}</ol><p><a href="/review">Cumulative module review${review}</a> — 10 questions across all lessons, 90% to pass.</p>`,
    ),
  );
});

app.post('/hello', async (c) => {
  const body = await c.req.parseBody();
  const name = String(body.student ?? '')
    .trim()
    .slice(0, 40);
  if (name) setCookie(c, 'student', name);
  return c.redirect('/');
});

app.get('/lesson/:id', (c) => {
  const lesson = lessons.find((l) => l.id === c.req.param('id'));
  if (!lesson) return c.notFound();
  const who = student(c);
  if (who) recordEvent(db, who, 'lesson_view', lesson.id);
  return c.html(
    page(
      lesson.title,
      `<h1>${esc(lesson.title)}</h1>${marked.parse(lesson.markdown)}
<p><a href="/lesson/${esc(lesson.id)}/quiz"><button>Take the lesson quiz</button></a></p>`,
    ),
  );
});

function quizForm(action: string, questions: QuizQuestion[], title: string, note = ''): string {
  const items = questions.map((q, i) => questionForm(q, i)).join('\n');
  const ids = questions.map((q) => q.id).join(',');
  return `<h1>${esc(title)}</h1>${note}
<form method="post" action="${esc(action)}">
<input type="hidden" name="qids" value="${esc(ids)}">
${items}
<button>Submit answers</button></form>`;
}

function findQuestions(ids: string[]): QuizQuestion[] {
  const all = [...banks.values()].flatMap((b) => b.questions);
  return ids
    .map((id) => all.find((q) => q.id === id))
    .filter((q): q is QuizQuestion => q !== undefined);
}

async function parseAnswers(c: {
  req: { parseBody(): Promise<Record<string, unknown>> };
}): Promise<{ questions: QuizQuestion[]; answers: Map<string, string> }> {
  const body = await c.req.parseBody();
  const ids = String(body.qids ?? '')
    .split(',')
    .filter(Boolean);
  const questions = findQuestions(ids);
  const answers = new Map<string, string>();
  for (const [key, value] of Object.entries(body)) {
    if (key.startsWith('answer:')) answers.set(key.slice(7), String(value));
  }
  return { questions, answers };
}

app.get('/lesson/:id/quiz', (c) => {
  const bank = banks.get(c.req.param('id'));
  if (!bank) return c.notFound();
  const who = student(c);
  if (!who) return c.redirect('/');
  recordEvent(db, who, 'quiz_start', bank.lessonId);
  const questions = pickLessonQuiz(bank);
  return c.html(
    page(
      'Lesson quiz',
      quizForm(
        `/lesson/${esc(bank.lessonId)}/quiz`,
        questions,
        'Lesson quiz',
        '<p>4 questions, 75% to pass, unlimited retries. Written answers are graded against the instructor rubric.</p>',
      ),
    ),
  );
});

app.post('/lesson/:id/quiz', async (c) => {
  const lessonId = c.req.param('id');
  const who = student(c);
  if (!who) return c.redirect('/');
  const { questions, answers } = await parseAnswers(c);
  const result = await gradeQuiz(client, questions, answers, LESSON_PASS);
  recordAttempt(db, who, 'lesson', lessonId, result.score, result.passed);
  recordEvent(db, who, 'quiz_submit', lessonId, { score: result.score, passed: result.passed });
  const cards = result.graded.map((g, i) => gradedCard(g.question, g.response, i)).join('\n');
  const verdict = result.passed
    ? `<p class="pass">Passed — ${(result.score * 100).toFixed(0)}%</p>`
    : `<p class="fail">${(result.score * 100).toFixed(0)}% — you need 75%. Unlimited retries: <a href="/lesson/${esc(lessonId)}/quiz">try a fresh quiz</a>.</p>`;
  return c.html(
    page(
      'Quiz results',
      `<h1>Results</h1>${verdict}${cards}<p><a href="/">Back to lessons</a></p>`,
    ),
  );
});

app.get('/review', (c) => {
  const who = student(c);
  if (!who) return c.redirect('/');
  recordEvent(db, who, 'review_start', 'module-1');
  const nudge = retryNudge(lastReviewAttempt(db, who)?.created_at, new Date());
  const questions = pickReviewQuiz([...banks.values()]);
  return c.html(
    page(
      'Module review',
      quizForm(
        '/review',
        questions,
        'Cumulative module review',
        `<p>10 questions interleaved across every lesson, 90% to pass.</p>${nudge ? `<div class="nudge">${esc(nudge)}</div>` : ''}`,
      ),
    ),
  );
});

app.post('/review', async (c) => {
  const who = student(c);
  if (!who) return c.redirect('/');
  const { questions, answers } = await parseAnswers(c);
  const result = await gradeQuiz(client, questions, answers, REVIEW_PASS);
  recordAttempt(db, who, 'review', null, result.score, result.passed);
  recordEvent(db, who, 'review_submit', 'module-1', {
    score: result.score,
    passed: result.passed,
  });
  const cards = result.graded.map((g, i) => gradedCard(g.question, g.response, i)).join('\n');
  const verdict = result.passed
    ? `<p class="pass">Review passed — ${(result.score * 100).toFixed(0)}%</p>`
    : `<p class="fail">${(result.score * 100).toFixed(0)}% — the bar is 90%. Spaced retries beat immediate ones; come back tomorrow.</p>`;
  return c.html(
    page(
      'Review results',
      `<h1>Results</h1>${verdict}${cards}<p><a href="/">Back to lessons</a></p>`,
    ),
  );
});

app.get('/dashboard', (c) => c.html(renderDashboard(db, lessons)));

const port = Number(process.env.PORT ?? 8734);
if (process.env.NODE_ENV !== 'test') {
  serve({ fetch: app.fetch, port });
  console.log(`doerkit listening on http://localhost:${port}`);
}
