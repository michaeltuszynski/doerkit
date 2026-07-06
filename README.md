# doerkit

[![CI](https://github.com/michaeltuszynski/doerkit/actions/workflows/ci.yml/badge.svg)](https://github.com/michaeltuszynski/doerkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An assessment-first learning platform. Named for the
[doer effect](https://doi.org/10.1145/2883851.2883957): completing practice questions woven
into reading produces several times the learning of reading alone.

Most "AI education" products bolt a chatbot onto content. The deployment evidence says that's
backwards: students ignore the chatbot, multiple-choice quizzing produces no measurable
learning gain, and what actually moves exam scores is **writing answers in your own words and
having them graded against a rubric — instantly, with unlimited retries** — plus spaced,
cumulative review. doerkit builds exactly that loop and nothing else.

## What it will be

- **Lessons** — markdown course content (demo course: intro statistics, from OpenStax OER)
- **Lesson quizzes** — mixed multiple-choice (auto-graded) and constructed-response
  (LLM-graded against instructor rubrics), unlimited retries, no gating
- **Module reviews** — cumulative, interleaved, high pass bar, spaced-retry nudges
- **Telemetry** — dosage events wired in from day one, so a real deployment measures itself

Deliberately out of scope: LMS/LTI integration, SSO, multi-tenancy, and a RAG chat sidebar —
the blog series covers why each is excluded.

## Status

Early scaffold. Built milestone-by-milestone alongside a blog series at
[The Cloud Codex](https://www.mpt.solutions); each post ships a working stage. The grading
engine is regression-tested with the sibling project
[rubric-bench](https://github.com/michaeltuszynski/rubric-bench).

## Development

```bash
npm install
npm test        # offline — no API key required
npm run lint
npm run typecheck
```

## Provenance

Design follows the deployment evidence in: Bard, J. (2026). *Balancing Efficacy and
Engagement in Interactive Texts.* Seventh Workshop on Intelligent Textbooks (iTextbooks'26),
CEUR-WS (CC BY 4.0). Key findings this project is built around: constructed-response dosage
tracked exam performance while MCQ-only did not; cumulative reviews were the largest single
lever (d = 0.66); the RAG chat assistant went unused; grader tone was the make-or-break
product issue.

Demo course content derives from OpenStax *Introductory Statistics 2e* (CC BY 4.0) — see
[content/README.md](content/README.md).

## License

Code MIT © 2026 Michael Tuszynski. Course content under `content/` CC BY 4.0.
