---
id: m1-l06
title: "Correlation and Misleading Statistics"
order: 6
---

Everything so far described one variable at a time. Most interesting questions involve two: does studying more raise scores? Do bigger houses cost more? This lesson introduces the standard tools for *seeing* and *measuring* a two-variable relationship — and then, because this is the module's last stop, a field guide to the ways descriptive statistics get bent.

## Scatterplots

A **scatterplot** puts one variable on each axis and one dot per observation. It's the first and best tool for a pair of quantitative variables. You read three things from it: **direction** (do the variables rise together, or does one fall as the other rises?), **form** (does the cloud follow a line, a curve, or nothing?), and **strength** (how tightly do the points hug the pattern?).

## The correlation coefficient

The **correlation coefficient r** turns "how linear and how tight" into a single number between −1 and +1. The sign gives direction: positive r means the variables rise together; negative means one falls as the other rises. The magnitude gives strength: near ±1 the points lie close to a straight line, near 0 there's no *linear* relationship worth reporting. r is unitless and symmetric — the correlation of study hours with scores equals the correlation of scores with study hours.

Reference points help calibrate intuition: |r| above roughly 0.8 is a strong linear relationship, around 0.5 is moderate, and below 0.3 is weak — worth mentioning only with caution.

Two structural cautions. r measures **linear** association only: a perfect U-shaped relationship can produce r ≈ 0, which is why the scatterplot comes first, always. And like the mean it's built from, r is **not resistant** — one outlying point can manufacture a strong-looking correlation or destroy a real one.

## Worked example

Six students' study hours and quiz scores: (1, 62), (2, 68), (3, 74), (4, 75), (5, 83), (6, 88). Plotting shows dots climbing steadily up and to the right in a near-straight line; the computed r ≈ 0.99. Direction positive, form linear, strength very strong. Now append one student who studied 10 hours but slept through the quiz: (10, 40). That single point drags r down to roughly 0.1 — the summary collapses while six of the seven data points still show the original clean pattern. The scatterplot catches this instantly; the bare number never would.

## Correlation is not causation

The most important sentence in this module: **a correlation between A and B does not show that A causes B.** Ice cream sales correlate with drowning deaths — not because dessert is dangerous, but because summer drives both. A third factor that moves two variables together is a **lurking variable**, and observational data is soaked in them. Establishing cause requires controlling what else varies — the randomized experiments of later chapters — not just observing association, however strong.

Related trap: **Simpson's paradox**, where a relationship that holds in every subgroup reverses when the groups are pooled. A treatment can look worse overall yet better for both mild and severe cases separately, if it was assigned mostly to the severe ones. The pooled number isn't lying about arithmetic; it's answering a subtly different question.

## A short field guide to misleading descriptions

- **Truncated axes:** a bar chart starting at 96 instead of 0 turns a 2% difference into a visual cliff.
- **Convenient center:** citing the mean of skewed data (Lesson 3) to inflate "typical" income, or the median to deflate it.
- **Cherry-picked windows:** a trend that only holds if the data starts in the one year that makes it work.
- **Precision theater:** "34.7% of users" from a sample of 23 people. The decimals imply accuracy the sample can't deliver.
- **Silent denominators:** "shark attacks doubled" — from one to two.

None of these require fake data. That's the lesson: honest numbers, dishonestly framed, mislead just as well.

> **Common mistake:** Rounding "r is not resistant" and "correlation isn't causation" into "correlation is meaningless." Correlation is how screening, forecasting, and recommendation systems work. The discipline is stating exactly what it shows — association, in this data, under this framing — and nothing more.

## Why this matters

You now own the full descriptive toolkit: sampling, shape, center, spread, position, and association. The module review will mix all six lessons — expect questions that give you a scenario and ask *which* tool, not just how to compute it.

> Adapted from concepts in *Introductory Statistics 2e* © OpenStax, Rice University, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
