---
id: m1-l05
title: "Position: z-Scores, Percentiles, and Box Plots"
order: 5
---

A raw number rarely answers the question people actually ask, which is: *compared to what?* A 27 on the ACT and a 1280 on the SAT — which is the stronger score? The scales don't match, so the raw numbers can't be compared. Measures of position translate any observation into "where it stands relative to its own distribution," which makes almost anything comparable to almost anything else.

## z-Scores

The **z-score** of a value counts how many standard deviations it sits from the mean: z = (x − mean) / standard deviation. Positive z means above the mean, negative means below, and zero means exactly average. z-scores are unitless — the units cancel in the division — which is what licenses cross-scale comparisons.

## Worked example

ACT scores run with mean 21 and standard deviation 5.2; SAT scores with mean 1060 and standard deviation 195 (round figures for illustration).

- ACT 27: z = (27 − 21) / 5.2 ≈ **+1.15**
- SAT 1280: z = (1280 − 1060) / 195 ≈ **+1.13**

The two students stand in nearly the same place relative to their own test-taking populations — a comparison the raw scores 27 and 1280 could never support. As a rough convention, values with |z| > 2 are unusual and |z| > 3 is rare for bell-shaped data (that's the empirical rule from Lesson 4 restated).

## Percentiles and quartiles

The **p-th percentile** is the value at or below which p% of the data falls. The median is the 50th percentile, Q1 the 25th, Q3 the 75th. Percentiles power the language of standardized tests, growth charts, and latency dashboards ("p95 response time") alike.

Two cautions. First, a percentile is a *position*, not a grade: scoring in the 90th percentile means beating 90% of test-takers, even if the raw score was 61 out of 100 on a brutal exam. Second, percentile differences don't represent equal gaps in the underlying value — in a tightly clustered middle, moving from the 50th to the 60th percentile might take 2 points, while moving from the 90th to the 99th takes 30.

## The five-number summary and box plots

The **five-number summary** — minimum, Q1, median, Q3, maximum — compresses a distribution into five landmarks. Its picture is the **box plot**: a box from Q1 to Q3 with a line at the median, and whiskers extending toward the extremes. In the common variant, whiskers reach only to the most extreme values within the 1.5×IQR fences (Lesson 4), and anything beyond is plotted as an individual dot — a suspected outlier, visually indicted.

Box plots earn their place when you compare groups side by side: five sections of a course, boxes stacked on one axis, and you can see at a glance which section runs high, which is most variable, and which has stragglers.

## Worked example

Twelve homework scores, sorted: 55, 62, 68, 70, 72, 75, 78, 80, 84, 88, 92, 98.

- Median = (75 + 78) / 2 = 76.5
- Q1 = median of the lower six = (68 + 70) / 2 = 69; Q3 = (84 + 88) / 2 = 86
- IQR = 86 − 69 = 17; fences at 69 − 25.5 = 43.5 and 86 + 25.5 = 111.5

No score falls outside the fences, so this dataset has no flagged outliers, and the whiskers run to 55 and 98. Add a student who scored 20, and the lower fence catches it: 20 < 43.5, so it plots as a lone dot — the graph itself asks "check this one."

> **Common mistake:** Treating a z-score comparison as meaningful regardless of shape. z-scores compare positions *within each distribution*, and the "unusual beyond |z| = 2" intuition leans on rough bell-shapedness. For strongly skewed data, prefer percentiles — a z of +2 in a heavy right tail may be far less rare than the rule of thumb suggests.

## Why this matters

Position measures are the bridge out of raw data: they're how a grader, a growth chart, and an anomaly detector all say "this one is unusual" in the same language. They're also the last tools of one-variable description — next, we put two variables together.

> Adapted from concepts in *Introductory Statistics 2e* © OpenStax, Rice University, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
