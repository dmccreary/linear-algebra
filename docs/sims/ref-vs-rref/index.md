---
title: REF vs RREF Comparison
description: Side-by-side comparison of Row Echelon Form and Reduced Row Echelon Form with highlighted differences
image: /sims/ref-vs-rref/ref-vs-rref.png
---
# REF vs RREF Comparison

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the REF vs RREF MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization shows the same matrix in three forms side by side: the original matrix, its Row Echelon Form (REF), and its Reduced Row Echelon Form (RREF). Key features like pivot positions and created zeros are highlighted.

## Key Differences

| Property | REF | RREF |
|----------|-----|------|
| Leading entries | Any nonzero | Must be 1 |
| Zeros below pivots | Yes | Yes |
| Zeros above pivots | No | Yes |
| Solution method | Back substitution | Direct reading |
| Uniqueness | Not unique | Unique |
| Computation cost | Fewer operations | More operations |

## Visual Legend

- **Gold circles**: Pivot positions (leading entries)
- **Green cells**: Zeros created by elimination

## When to Use Each Form

**Row Echelon Form (REF):**

- More efficient for solving a single system
- Sufficient for determining solution existence
- Useful when computational cost matters

**Reduced Row Echelon Form (RREF):**

- Best for reading solutions directly
- Required for finding null space basis
- Unique representation of the matrix
- Better for multiple right-hand sides

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Distinguish between REF and RREF visually
2. Identify the additional operations needed to reach RREF from REF
3. Understand when each form is preferable
4. Recognize that RREF is unique while REF is not

### Suggested Activities

1. **Count the Difference**: Generate several random systems and compare the operation counts
2. **Identify Properties**: For each generated matrix, verify that REF and RREF satisfy their defining properties
3. **Solution Extraction**: Practice reading solutions from RREF and using back substitution on REF
4. **Predict RREF**: Given the REF, predict what additional operations are needed to reach RREF
