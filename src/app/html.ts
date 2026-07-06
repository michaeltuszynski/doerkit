import type { GradedResponse, QuizQuestion } from '../grading/types.js';

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CSS = `
  body{font:16px/1.6 system-ui;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#1a1a1a}
  a{color:#0b5fff} nav{margin-bottom:1.5rem;font-size:.9rem}
  .card{border:1px solid #ddd;border-radius:8px;padding:1rem 1.25rem;margin:1rem 0}
  .pass{color:#0a7d33;font-weight:600}.fail{color:#b00020;font-weight:600}
  .partial{color:#b26a00;font-weight:600}
  .done{color:#0a7d33}.todo{color:#888}
  textarea{width:100%;min-height:5rem;font:inherit;padding:.5rem}
  button{font:inherit;padding:.5rem 1.25rem;border-radius:6px;border:1px solid #0b5fff;background:#0b5fff;color:#fff;cursor:pointer}
  .nudge{background:#fff8e6;border:1px solid #e6c862;border-radius:8px;padding:.75rem 1rem;margin:1rem 0}
  blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:1rem;color:#555}
  code{background:#f4f4f4;padding:.1rem .3rem;border-radius:4px}
  table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .6rem}
`;

export function page(title: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · doerkit</title><style>${CSS}</style></head>
<body><nav><a href="/">doerkit</a> · <a href="/review">module review</a> · <a href="/dashboard">dashboard</a></nav>
${body}</body></html>`;
}

export function questionForm(q: QuizQuestion, index: number): string {
  const head = `<div class="card"><p><strong>Q${index + 1}.</strong> ${esc(q.prompt)}</p>`;
  if (q.kind === 'mcq') {
    const choices = q.choices
      .map(
        (choice, i) =>
          `<label style="display:block"><input type="radio" name="answer:${esc(q.id)}" value="${i}" required> ${esc(choice)}</label>`,
      )
      .join('\n');
    return `${head}${choices}</div>`;
  }
  return `${head}<textarea name="answer:${esc(q.id)}" placeholder="Answer in your own words (2–5 sentences)" required></textarea></div>`;
}

export function gradedCard(q: QuizQuestion, r: GradedResponse, index: number): string {
  const cls = r.verdict === 'correct' ? 'pass' : r.verdict === 'partial' ? 'partial' : 'fail';
  return `<div class="card"><p><strong>Q${index + 1}.</strong> ${esc(q.prompt)}</p>
<p class="${cls}">${r.verdict} · ${(r.score * 100).toFixed(0)}%</p>
<p>${esc(r.feedback)}</p></div>`;
}
