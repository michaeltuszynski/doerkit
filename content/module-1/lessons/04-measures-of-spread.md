---
id: m1-l04
title: "Measures of Spread"
order: 4
---

Two classes both average 75 on an exam. In one, nearly everyone scored between 70 and 80; in the other, scores ran from 40 to 100. Same center, completely different stories. Spread is the half of description that center leaves out, and it's usually the half that matters for risk, fairness, and prediction.

## Range and IQR

The **range** is the simplest spread measure: maximum minus minimum. It's easy and fragile — built from exactly the two observations most likely to be flukes.

The **interquartile range (IQR)** is sturdier. Quartiles split sorted data into four equal parts: the first quartile Q1 has a quarter of the data at or below it, the median is Q2, and the third quartile Q3 has three quarters at or below. The IQR is Q3 − Q1: the width of the middle half of the data. Because it ignores the top and bottom quarters entirely, the IQR is resistant to outliers, the same way the median is.

The IQR also powers the standard outlier flag: any value below Q1 − 1.5×IQR or above Q3 + 1.5×IQR is a suspected **outlier**. (Lesson 5 uses this rule in box plots.)

## Variance and standard deviation

The most important spread measure is the **standard deviation** — roughly, the typical distance between an observation and the mean.

The recipe for a sample of n values: find each observation's **deviation** from the mean (x − x̄); square every deviation (so negatives don't cancel positives); add the squares; divide by n − 1; that's the **variance** s². Take the square root to get the standard deviation s, which lands back in the original units.

Why n − 1 instead of n? The sample mean was computed *from these same observations*, so the deviations are slightly too small on average — the data is closer to its own mean than to the true population mean. Dividing by the smaller n − 1 corrects that, making s² an honest estimate of the population variance. (Population formulas, where you truly have everyone, divide by N.)

## Worked example

Five delivery times in minutes: 22, 25, 27, 30, 41. The mean is 145 / 5 = 29.

| x | x − x̄ | (x − x̄)² |
|----|-------|----------|
| 22 | −7    | 49       |
| 25 | −4    | 16       |
| 27 | −2    | 4        |
| 30 | 1     | 1        |
| 41 | 12    | 144      |

Sum of squares = 214. Variance s² = 214 / 4 = 53.5. Standard deviation s = √53.5 ≈ 7.3 minutes.

Notice the 41 contributes 144 of the 214 — squaring makes far values dominate. Like the mean it's built on, the standard deviation is **not resistant** to outliers.

## Reading a standard deviation

A standard deviation means little in isolation; it earns its keep in comparisons and in rules of thumb. For reasonably bell-shaped data, the **empirical rule** says roughly 68% of observations fall within one standard deviation of the mean, about 95% within two, and nearly all within three. So for exam scores with mean 75 and s = 5, a score of 90 (three standard deviations up) is genuinely exceptional; with s = 15, the same 90 is merely good.

Comparing spread across different units or scales calls for the **coefficient of variation** (s divided by the mean): a standard deviation of 5 means something very different when the mean is 10 than when it's 1,000.

> **Common mistake:** Forgetting that variance lives in *squared* units. A variance of 53.5 "square minutes" is not interpretable as a time; only after the square root do you get a number (7.3 minutes) you can picture. Report standard deviations, compute with variances.

## Why this matters

Almost every question that sounds like "is this difference real or just noise?" is secretly a spread question — a difference of 4 points is enormous when s = 1 and invisible when s = 20. From Lesson 5 onward, spread is the yardstick every other number gets measured against.

> Adapted from concepts in *Introductory Statistics 2e* © OpenStax, Rice University, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
