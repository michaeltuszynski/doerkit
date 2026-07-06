<!--
SERIES: Assessment-first learning platforms (post 1 of 8)
STATUS: draft — NOT published
PUBLISH: via content-engine draft-and-ship ONLY (Hard-Won Lesson #32). Never copy
this file into mpt-blog by hand. Repo links below go live once both repos are
pushed to GitHub.

Pipeline metadata:
  title: "The AI Tutor Everyone Builds Is the One Students Ignore"
  excerpt: "A Dartmouth pilot put an LLM-graded quiz engine inside the textbook. 90% of students used it voluntarily, and the chatbot everyone thinks is the product went untouched. The evidence points somewhere most edtech isn't looking."
  tags: ["ai-engineering", "edtech", "llm-evals", "assessment", "doerkit"]
  tier: 3
-->

Every student now carries a competent tutor in their pocket, and academic performance hasn't moved. That's the puzzle worth sitting with. The answer, based on a deployment study published this June, is that we've been shipping the wrong product: the chatbot gets built, and the students don't use it.

The study is [Bard (2026), "Balancing Efficacy and Engagement in Interactive Texts"](https://intextbooks.science.uu.nl/workshop2026/files/itb26_s1s2.pdf), from the iTextbooks workshop — a pilot of an LLM-powered learning platform called Phosphor with 151 intro-statistics students at Dartmouth. It's one course at one selective school, observational, no randomization. Hold that skepticism; I'll come back to it. But the pattern in the data is sharp enough to build on, and this post kicks off a series where I do exactly that, in public, with working code.

## What the pilot actually found

Phosphor is a web textbook with quizzes wired into the reading. Multiple-choice questions grade automatically. Constructed-response questions — the ones where you write an answer in your own words — get graded by Claude against an instructor-written rubric, instantly, with unlimited retries. There's also a RAG chat sidebar, the feature every AI-education pitch deck leads with.

Three results stand out.

**The chatbot flopped.** 72 total queries across 143 students over a full term. Fourteen students used it more than once. Students said general-purpose LLMs were faster for their questions. Khan Academy has reported that [about 15% of users regularly engage](https://blog.khanacademy.org/kristens-corner-winter-2026/) with their supplementary chatbot. That's a first-party number from a team with every incentive to round up, which makes it more damning, not less.

**Multiple choice produced nothing.** The team changed quiz formats between course modules, by accident of iteration rather than design. Module 1 mixed constructed-response with multiple choice: each completed lesson tracked with roughly 1.6 extra points on the midterm. Module 2 dropped to multiple-choice only after students complained about the grader: the dosage relationship vanished. Flat-to-negative slope among engaged students, despite *higher* completion rates. Reading plus MCQ looked like learning and measured like nothing. This echoes older cognition work: [Kang et al. (2007)](https://doi.org/10.1080/09541440601056620) found short-answer testing with feedback beat multiple-choice for retention a generation before LLMs existed.

**The boring feature won.** Cumulative module reviews (ten interleaved questions, a 90% pass bar, unlimited retries) showed the largest effect in the study: students who passed all three scored 7.1 points higher on the final (d = 0.66). And the retry logs show students spacing their attempts a median of ~1.5 days apart, which is textbook spaced retrieval. Nobody demos this feature at a conference. It carried the study.

The engagement side is the part that surprised me. Offered as an optional, ungraded alternative to the textbook, 90.2% of students used the platform, against a self-reported reading-compliance baseline around 10–15%. Full engagement was associated with a final-exam gap the authors bracket between 0.71 and 1.30 standard deviations, depending on how aggressively you control for prior ability.

## Why the incumbents ship the weak format anyway

Before LLMs, grading a written answer cost human minutes. Grading a bubble sheet cost nothing. Every courseware platform at scale, the embedded-practice products from the major publishers included, converged on auto-gradable formats because that's what the economics allowed. The format that produces learning was priced out; the format that produces engagement metrics was free.

That constraint is gone. An LLM grades a written answer against a rubric in about a second for well under a cent. What's left is the harder problem, and it's the one the Dartmouth team nearly lost the pilot to: students found the auto-grader "rigid and discouraging," and the team ripped constructed response out of an entire module in response. The grader was accurate. Students quit anyway. Making an LLM judge *trustworthy* — calibrated partial credit, feedback that names what's missing without punishing the attempt, stable behavior across model versions — is a quality-engineering problem, and almost nobody treats it as one.

There's also a warning in the literature about the opposite failure. [Bastani et al. (2025)](https://doi.org/10.1073/pnas.2422633122) ran a randomized trial with roughly a thousand students: unrestricted GPT-4 access made students perform *worse* once the tool was removed. The model that does the work for the student subtracts learning. The model that judges the student's own work adds it. Same API, opposite products.

## Where this breaks

The honest caveats, so we're building on ground truth and not hype. One site, one course, one enthusiastic founder-instructor: the 90% voluntary adoption number will not survive contact with an average deployment, and I'd plan for half. Self-selection is the central threat: motivated students both engage more and score higher, and the 0.71 SD lower bound leans on midterm controls that likely absorb some real treatment effect while leaving some selection in. The MCQ-vs-CRQ contrast is confounded by module content and timing. And the grading itself was never validated against human raters in this study. None of this makes the paper weak; the authors flag all of it. It makes the paper a design brief rather than a proof.

A reading tip for any edtech efficacy claim, this one included: check whether the effect is *dosage* (more use, more gain, among users) or just *binary* (users beat non-users, which is mostly selection), and check what the standard deviations are measured against. The dosage regressions are why this paper is worth your time; the binary comparisons alone wouldn't be.

## What I'm building

The parts of this design are all commercially proven somewhere. Embedded practice exists at publisher scale. Instant AI feedback on written answers exists as a teacher tool. Spaced review exists in every flashcard app. The combination of rubric-graded writing inside the reading flow, cumulative spaced review, and a grader you can actually trust is open territory. So is the engineering discipline underneath it.

Over the next several posts I'm building that stack as open source, in TypeScript, one working stage per post:

- **[rubric-bench](https://github.com/michaeltuszynski/rubric-bench)**: regression testing for LLM judges. Golden sets of answers with known verdicts, run scoring, drift detection between prompt and model versions, adversarial cases (yes, students will put prompt injections in their homework) as first-class tests.
- **doerkit**: the platform itself, named for the [doer effect](https://doi.org/10.1145/2883851.2883957): Koedinger's finding that doing practice woven into reading beats reading alone by a wide multiple. Lessons, mixed-format quizzes, cumulative reviews, telemetry from day one. Demo course: intro statistics, built on OpenStax OER. Its repo goes public with post 2, alongside the grading engine it exists to showcase.

Both repos are scaffolded now: strict TypeScript, CI, and a test suite that runs offline with no API key, because a grading library you can't test without burning tokens is a library you won't test. The scaffold's first passing test is the one that matters most: a deliberately gullible grader fed a prompt-injection "answer" fails the golden set. That's the whole thesis in one assertion.

Next post: the grading engine. Rubric in, verdict out, and the prompt design that makes partial credit behave. The one after that puts the grader under regression tests and breaks it on purpose.

The chatbot took two years of the industry's attention. The quiz engine moved the exam scores. I know which one I'm building.
