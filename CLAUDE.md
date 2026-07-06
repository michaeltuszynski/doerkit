# doerkit — agent guidance

Assessment-first learning platform (demo course: intro statistics from OpenStax OER).
Sibling repo: `~/code/rubric-bench` regression-tests the grading engine. Both repos are the
artifacts of an 8-post blog series (plan: `~/.claude/plans/lets-plan-a-series-golden-sprout.md`).

## Rules

- Test suite must pass **offline with no API key**; LLM calls stay behind interfaces.
- Grading types must remain drop-in compatible with rubric-bench's `Grader` interface.
- Scope is frozen to the paper's minimal feature set: lessons, lesson quizzes (MCQ + CRQ),
  module reviews, telemetry. No LMS/LTI, no SSO, no multi-tenancy, no RAG chat — these are
  deliberate exclusions the blog series explains; don't add them.
- Every lesson file under `content/` carries an OpenStax CC BY 4.0 attribution block.
- Student answers are untrusted input to the grader — treat injection as a standing threat
  (adversarial cases live in rubric-bench golden sets).

## Commands

- `npm test` — node:test via tsx, offline
- `npm run lint` / `npm run typecheck`

## Roadmap anchors (blog series milestones)

- M2 / post 2: grading engine (rubric + model answer + response → verdict/score/feedback).
- M5 / post 5: tone-calibrated grader prompts.
- M6 / post 6: web app (lessons, quizzes, review scheduler) — Next.js + SQLite.
- M7 / post 7: telemetry events + dashboard.
- M8 / post 8: deployed demo, v1.0.
