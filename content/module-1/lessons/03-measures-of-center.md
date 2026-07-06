---
id: m1-l03
title: "Measures of Center"
order: 3
---

"What's a typical value?" is the most common question asked of any dataset, and statistics gives three standard answers. They agree on tidy symmetric data and disagree — sometimes wildly — the moment the data gets messy. Knowing *which* answer to report, and why, is the skill.

## The three centers

The **mean** is the arithmetic average: add every value, divide by the count. For a sample it's written x̄ ("x-bar"). The mean is the balance point of the data — if the histogram were a physical object, the mean is where it would balance on a fulcrum.

The **median** is the middle value once the data is sorted. With an odd count, it's the exact middle observation; with an even count, it's the average of the two middle observations. Half the data sits at or below the median, half at or above.

The **mode** is the most frequent value. It's the only center that works for categorical data (there's a most common blood type, but no "average" one), and a dataset can have more than one mode or none worth reporting.

## Worked example

Nine employees at a small company earn (in thousands): 42, 45, 48, 50, 52, 54, 55, 58, 61.

- Mean: sum = 465, so x̄ = 465 / 9 ≈ 51.7
- Median: the 5th sorted value = 52
- The mean and median nearly agree, because the data is roughly symmetric.

Now the founder, who pays herself 400, joins the list. With n = 10:

- Mean: (465 + 400) / 10 = 86.5
- Median: average of the 5th and 6th values = (52 + 54) / 2 = 53

One number moved the mean from 51.7 to 86.5 — a value larger than what 9 of the 10 people earn. The median barely budged: 52 to 53.

## Resistance

That example is the whole concept of **resistance**. The median is resistant to outliers: extreme values can't drag it far, because it only cares about the *order* of the middle, not the magnitude of the ends. The mean is not resistant: every value pulls on it in proportion to its size, so one extreme observation exerts enormous leverage.

Neither behavior is "right." The mean uses all the information in the data and has beautiful mathematical properties that later statistics depend on. The median summarizes the typical case honestly when tails are long. The choice is about the question: "what does the typical household earn?" wants the median; "how much total money flows through these households, per household?" is genuinely a mean question.

## Skew moves the mean

Shape (Lesson 2) predicts the relationship between mean and median:

- **Symmetric data:** mean ≈ median.
- **Right-skewed data:** the long right tail pulls the mean above the median.
- **Left-skewed data:** the tail pulls the mean below the median.

This works as a diagnostic in reverse, too. If you're told the mean home price in a county is $610,000 and the median is $405,000, you know the distribution is strongly right-skewed before seeing a single graph — a small number of expensive homes is inflating the mean.

## Weighted means

Sometimes values shouldn't count equally. A **weighted mean** multiplies each value by its weight, sums, and divides by the total weight. Your course grade is the everyday example: a 90 on a final worth 40% and an 80 on homework worth 60% gives 90(0.4) + 80(0.6) = 84 — not the naive 85, because the components don't count equally.

> **Common mistake:** Reporting the mean *because it's the default*, without checking shape. For skewed data — incomes, house prices, hospital bills, time-to-complete — the mean quietly answers a different question than "what's typical." If a single observation could plausibly be 10× the middle of your data, look at the median first.

## Why this matters

Center is the most quoted, most weaponized statistic there is. "Average" in a headline can mean whichever center flatters the argument. After this lesson, you should reflexively ask: which center, and how skewed is the data underneath it?

> Adapted from concepts in *Introductory Statistics 2e* © OpenStax, Rice University, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
