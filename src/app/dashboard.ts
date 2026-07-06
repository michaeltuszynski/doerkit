import type Database from 'better-sqlite3';
import type { Lesson } from './content.js';
import { esc, page } from './html.js';

interface StudentRow {
  student: string;
  lessons_passed: number;
  lesson_attempts: number;
  avg_lesson_score: number;
  review_attempts: number;
  review_passed: number;
  events: number;
}

/**
 * Instructor dosage view. The Dartmouth study could only discover that
 * MCQ-only quizzing produced nothing because per-lesson dosage was logged
 * from day one — this is that instrument, minimal edition.
 */
export function renderDashboard(db: Database.Database, lessons: Lesson[]): string {
  const rows = db
    .prepare(`
      SELECT s.student,
        (SELECT COUNT(DISTINCT lesson_id) FROM attempts a
          WHERE a.student = s.student AND a.kind = 'lesson' AND a.passed = 1) AS lessons_passed,
        (SELECT COUNT(*) FROM attempts a
          WHERE a.student = s.student AND a.kind = 'lesson') AS lesson_attempts,
        (SELECT COALESCE(AVG(score), 0) FROM attempts a
          WHERE a.student = s.student AND a.kind = 'lesson') AS avg_lesson_score,
        (SELECT COUNT(*) FROM attempts a
          WHERE a.student = s.student AND a.kind = 'review') AS review_attempts,
        (SELECT COUNT(*) FROM attempts a
          WHERE a.student = s.student AND a.kind = 'review' AND a.passed = 1) AS review_passed,
        (SELECT COUNT(*) FROM events e WHERE e.student = s.student) AS events
      FROM (SELECT DISTINCT student FROM events UNION SELECT DISTINCT student FROM attempts) s
      ORDER BY lessons_passed DESC, avg_lesson_score DESC
    `)
    .all() as StudentRow[];

  const eventCounts = db
    .prepare('SELECT type, COUNT(*) AS n FROM events GROUP BY type ORDER BY n DESC')
    .all() as Array<{ type: string; n: number }>;

  const studentRows = rows
    .map(
      (r) =>
        `<tr><td>${esc(r.student)}</td><td>${r.lessons_passed}/${lessons.length}</td><td>${r.lesson_attempts}</td><td>${(r.avg_lesson_score * 100).toFixed(0)}%</td><td>${r.review_passed}/${r.review_attempts}</td><td>${r.events}</td></tr>`,
    )
    .join('\n');
  const eventRows = eventCounts
    .map((e) => `<tr><td>${esc(e.type)}</td><td>${e.n}</td></tr>`)
    .join('\n');

  return page(
    'Dashboard',
    `<h1>Dosage dashboard</h1>
<p>Per-student engagement. "Dosage" is lessons passed — the variable that tracked exam
performance in the study this platform is built from.</p>
<table><tr><th>student</th><th>lessons passed</th><th>quiz attempts</th><th>avg quiz score</th><th>reviews passed/attempted</th><th>events</th></tr>
${studentRows || '<tr><td colspan="6">no activity yet</td></tr>'}
</table>
<h2>Event volume</h2>
<table><tr><th>event</th><th>count</th></tr>
${eventRows || '<tr><td colspan="2">none</td></tr>'}
</table>`,
  );
}
