import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { QuizQuestion } from '../grading/types.js';

export interface Lesson {
  id: string;
  title: string;
  order: number;
  markdown: string;
}

export interface QuestionBank {
  lessonId: string;
  questions: QuizQuestion[];
}

/** Minimal frontmatter parser: --- key: value --- block, string/number values. */
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith('---')) return { meta: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of raw.slice(3, end).split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line
      .slice(colon + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key) meta[key] = value;
  }
  return { meta, body: raw.slice(end + 4).trimStart() };
}

export function loadLessons(contentDir = 'content/module-1'): Lesson[] {
  const dir = join(contentDir, 'lessons');
  const lessons = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { meta, body } = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
      if (!meta.id || !meta.title) throw new Error(`Lesson ${file} missing id/title frontmatter`);
      return {
        id: meta.id,
        title: meta.title,
        order: Number(meta.order ?? 0),
        markdown: body,
      };
    });
  return lessons.sort((a, b) => a.order - b.order);
}

export function loadBanks(contentDir = 'content/module-1'): Map<string, QuestionBank> {
  const dir = join(contentDir, 'questions');
  const banks = new Map<string, QuestionBank>();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const bank = JSON.parse(readFileSync(join(dir, file), 'utf8')) as QuestionBank;
    if (!bank.lessonId || !Array.isArray(bank.questions) || bank.questions.length === 0) {
      throw new Error(`Question bank ${file} malformed`);
    }
    banks.set(bank.lessonId, bank);
  }
  return banks;
}
