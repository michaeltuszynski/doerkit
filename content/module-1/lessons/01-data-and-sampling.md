---
id: m1-l01
title: "Data and Sampling"
order: 1
---

Statistics starts with a question about a group you can't fully observe. You want to know the average commute time of everyone in a city, but you can't ask all two million residents. So you ask a smaller group and reason carefully from their answers to the whole. That gap — between the group you care about and the group you actually measure — is where most statistical thinking lives.

## Populations, samples, and their numbers

The **population** is the entire collection of people or things you want conclusions about. The **sample** is the subset you actually measure. A number that describes a population is a **parameter**; the same kind of number computed from a sample is a **statistic**. If the true average commute across the whole city is 31.4 minutes, that's a parameter. If your survey of 500 residents averages 29.8 minutes, that's a statistic — your working estimate of the parameter.

The distinction matters because parameters are usually unknowable directly. Nearly everything that follows in this course is machinery for judging how well a statistic stands in for a parameter.

## Types of data

Data comes in two broad flavors. **Qualitative (categorical)** data places each observation into a category: blood type, zip code, favorite streaming service. **Quantitative** data is numeric and supports arithmetic: height, commute time, number of pets.

Quantitative data splits again. **Discrete** data counts things and takes separated values — you can have 2 pets or 3, never 2.6. **Continuous** data measures things and can take any value in a range — a commute can last 31.42 minutes. A quick test: if "half of one" makes sense, the data is probably continuous.

One trap: numbers aren't automatically quantitative. Zip codes are digits, but averaging them is meaningless — they're categories wearing numeric costumes.

## Worked example

A campus survey records, for each student: their major, the number of credit hours enrolled, and the time they spend on coursework each week.

- Major → qualitative
- Credit hours → quantitative, discrete (you enroll in 12 or 15, not 13.7)
- Weekly coursework time → quantitative, continuous (7.25 hours is a legitimate value)

## How samples go wrong (and right)

A sample is only useful if it resembles the population. The gold standard is the **simple random sample**: every group of *n* members of the population has an equal chance of being the group selected, like drawing names from a well-mixed hat.

Other legitimate designs adapt randomness to practical constraints. A **stratified sample** divides the population into groups (strata) that matter — class years, say — and randomly samples from each, guaranteeing every group appears. A **cluster sample** randomly picks whole groups (entire lab sections) and measures everyone inside the chosen ones. A **systematic sample** takes every *k*-th member from an ordered list after a random start.

The design to distrust is the **convenience sample**: measuring whoever is easiest to reach. Polling only students in the library at 9 p.m. tells you about late-night library users, not about students. The catch is that convenience samples don't look broken — they produce clean-looking numbers with invisible bias baked in.

Bias also creeps into well-designed samples through **nonresponse** (the people who skip your survey may differ systematically from those who answer) and through question wording that nudges answers.

## Worked example

A university wants to estimate what fraction of its 8,000 undergraduates would use a late-night shuttle. Compare three plans:

1. Survey the first 200 students entering the student union at noon — convenience sample; misses commuters and night-shift students entirely.
2. Randomly select 50 students from each class year (first-year through senior) — stratified sample; every class year is represented by design.
3. Number all undergraduates 1–8,000 and use a random number generator to pick 200 — simple random sample.

Plans 2 and 3 are both defensible. Plan 1 will produce a precise-looking percentage that may be badly wrong.

> **Common mistake:** Believing a bigger sample fixes bias. Size reduces random error, not systematic error. Two million responses to a poll that only reached landline owners is still a landline-owners poll — a biased sampling method just becomes *confidently* wrong at scale.

## Why this matters

Every summary you'll compute in the next lessons — means, spreads, correlations — inherits the quality of the sample beneath it. Garbage in, garbage out is not a slogan here; it's arithmetic.

> Adapted from concepts in *Introductory Statistics 2e* © OpenStax, Rice University, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
