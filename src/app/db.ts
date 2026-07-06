import Database from 'better-sqlite3';

export interface AttemptRow {
  id: number;
  student: string;
  kind: 'lesson' | 'review';
  lesson_id: string | null;
  score: number;
  passed: number;
  created_at: string;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('lesson','review')),
  lesson_id TEXT,
  score REAL NOT NULL,
  passed INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student, kind, lesson_id);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_events_student ON events(student, type);
`;

export function openDb(path = process.env.DOERKIT_DB ?? 'data/doerkit.db'): Database.Database {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(SCHEMA);
  return db;
}

export function recordEvent(
  db: Database.Database,
  student: string,
  type: string,
  subject: string,
  detail?: unknown,
): void {
  db.prepare('INSERT INTO events (student, type, subject, detail) VALUES (?, ?, ?, ?)').run(
    student,
    type,
    subject,
    detail === undefined ? null : JSON.stringify(detail),
  );
}

export function recordAttempt(
  db: Database.Database,
  student: string,
  kind: 'lesson' | 'review',
  lessonId: string | null,
  score: number,
  passed: boolean,
): void {
  db.prepare(
    'INSERT INTO attempts (student, kind, lesson_id, score, passed) VALUES (?, ?, ?, ?, ?)',
  ).run(student, kind, lessonId, score, passed ? 1 : 0);
}

/** Lesson ids this student has passed at least once. */
export function passedLessons(db: Database.Database, student: string): Set<string> {
  const rows = db
    .prepare(
      "SELECT DISTINCT lesson_id FROM attempts WHERE student = ? AND kind = 'lesson' AND passed = 1",
    )
    .all(student) as Array<{ lesson_id: string }>;
  return new Set(rows.map((r) => r.lesson_id));
}

export function lastReviewAttempt(db: Database.Database, student: string): AttemptRow | undefined {
  return db
    .prepare(
      "SELECT * FROM attempts WHERE student = ? AND kind = 'review' ORDER BY id DESC LIMIT 1",
    )
    .get(student) as AttemptRow | undefined;
}

export function reviewPassed(db: Database.Database, student: string): boolean {
  const row = db
    .prepare(
      "SELECT COUNT(*) AS n FROM attempts WHERE student = ? AND kind = 'review' AND passed = 1",
    )
    .get(student) as { n: number };
  return row.n > 0;
}
