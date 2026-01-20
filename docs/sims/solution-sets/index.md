---
title: Solution Set Visualizer
description: Explore how different systems produce unique solutions, infinite solutions (lines/planes), or no solution
image: /sims/solution-sets/solution-sets.png
---
# Solution Set Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Solution Set MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization helps you understand the three possible outcomes when solving a system of linear equations:

1. **Unique Solution**: Exactly one answer exists
2. **Infinite Solutions**: A line, plane, or higher-dimensional subspace of answers
3. **No Solution**: The system is inconsistent

## Solution Types Explained

| Type | RREF Indicator | Geometric Meaning |
|------|----------------|-------------------|
| Unique | All variable columns are pivot columns | Lines/planes meet at exactly one point |
| Infinite | Some columns are not pivot columns (free variables) | Lines/planes overlap along a line or plane |
| None | Row of form [0 0 ... 0 \| c] where c ≠ 0 | Lines/planes are parallel, never meeting |

## Variables Classification

**Basic Variables** (pivot columns - highlighted yellow):

- Correspond to pivot columns in RREF
- Their values are determined by the free variables
- Appear in the parametric solution

**Free Variables** (non-pivot columns - highlighted blue):

- Correspond to non-pivot columns
- Can take any real value
- The number of free variables equals the dimension of the solution set

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Classify systems as having unique, infinite, or no solutions
2. Identify basic and free variables from the RREF
3. Understand the geometric meaning of each solution type
4. Connect the algebraic analysis to geometric visualization

### Suggested Activities

1. **Explore Each Type**: Select each preset and observe how the RREF reveals the solution type
2. **Count Free Variables**: For infinite solutions, count the free variables and relate to the solution geometry
3. **Find Inconsistency**: For the "No Solution" case, identify the inconsistent row
4. **Predict Before Viewing**: Before checking RREF, predict the solution type from the original matrix
