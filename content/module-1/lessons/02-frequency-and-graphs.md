---
id: m1-l02
title: "Frequency Tables and Graphs"
order: 2
---

Raw data is unreadable. Fifty commute times listed in collection order tell you almost nothing; the same fifty numbers organized into a table or picture can tell you the story in five seconds. This lesson is about the standard ways to organize and draw quantitative data — and how to read the shapes that emerge.

## Frequency and relative frequency

A **frequency table** groups data into classes (intervals) and counts how many observations land in each. The count for a class is its **frequency**. Divide each frequency by the total number of observations and you get the **relative frequency** — the fraction of the data in that class. Relative frequencies always sum to 1 (allowing for rounding), which makes them comparable across datasets of different sizes.

Adding each relative frequency to all the ones before it gives the **cumulative relative frequency**: the fraction of data at or below the top of that class. Cumulative columns answer questions like "what fraction of students study less than 10 hours?" directly.

## Worked example

Twenty quiz scores: 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10.

| Score | Frequency | Relative freq. | Cumulative rel. freq. |
|-------|-----------|----------------|----------------------|
| 5     | 1         | 0.05           | 0.05                 |
| 6     | 2         | 0.10           | 0.15                 |
| 7     | 3         | 0.15           | 0.30                 |
| 8     | 5         | 0.25           | 0.55                 |
| 9     | 4         | 0.20           | 0.75                 |
| 10    | 5         | 0.25           | 1.00                 |

Reading it: 55% of scores were 8 or below; a quarter of the class aced it.

## Histograms

A **histogram** turns a frequency table for continuous data into bars: classes on the horizontal axis, frequency (or relative frequency) as bar height, bars touching because the underlying scale is continuous. Histograms are the workhorse graph of this course because they show **shape**.

Three shapes matter most:

- **Symmetric:** the left and right halves roughly mirror each other. Heights of adults of one sex look like this.
- **Right-skewed (positively skewed):** most data piles up on the left with a long tail stretching right. Incomes are the classic case — most households cluster in a middle range while a few very large values stretch the tail.
- **Left-skewed (negatively skewed):** the mirror image; a long tail to the left. Scores on an easy exam often look like this — most students score high, a few very low scores trail off.

The direction of skew is the direction of the *tail*, not the direction of the pile. This trips up nearly everyone at first.

## Other useful pictures

A **stem-and-leaf plot** keeps every actual data value visible while still showing shape — good for small datasets. A **bar chart** looks like a histogram but is for categorical data: the bars don't touch because the categories have no numeric order between them. A **time series plot** puts time on the horizontal axis and shows how a value moves.

The histogram/bar chart distinction isn't pedantry. Touching bars assert "these intervals sit on a continuous number line"; separated bars assert "these are distinct categories." Using one where the other belongs misleads the reader about the data's nature.

## Worked example

Suppose 100 households report weekly grocery spending, and the histogram shows a tall cluster of bars between $80 and $160 with a thin tail of bars reaching out to $500. That's right-skewed data. You can predict, before computing anything, that the mean will be noticeably larger than the median — the tail drags it right. (Lesson 3 makes that precise.) Shape isn't decoration; it forecasts how your summary numbers will behave.

> **Common mistake:** Choosing class widths that manufacture a shape. Very wide classes smooth real features away; very narrow ones shatter the picture into noise. There's no single correct width, but 5–15 classes serves most datasets — and if a conclusion survives only under one specific choice of classes, it isn't a conclusion about the data.

## Why this matters

Shape is the first diagnostic. Skew tells you which summaries to trust, outliers announce themselves visually before any formula flags them, and a two-humped (bimodal) histogram warns that you may have two populations mixed together — none of which a table of raw numbers will volunteer.

> Adapted from concepts in *Introductory Statistics 2e* © OpenStax, Rice University, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
