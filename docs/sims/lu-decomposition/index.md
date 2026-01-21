---
title: LU Decomposition Algorithm Visualizer
description: Step-by-step visualization of LU decomposition showing how Gaussian elimination produces L and U matrices
image: /sims/lu-decomposition/lu-decomposition.png
---

# LU Decomposition Algorithm Visualizer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the LU Decomposition Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates the **LU Decomposition** algorithm step-by-step, showing how Gaussian elimination transforms a matrix A into the product of:

- **L** - a lower triangular matrix containing the multipliers
- **U** - an upper triangular matrix (the row echelon form)

## Key Features

- **Step-by-step execution**: Watch each elimination step in detail
- **Multiplier tracking**: See how multipliers are stored in L
- **Pivot highlighting**: Current pivot shown in yellow
- **Row highlighting**: Row being eliminated shown in red
- **Verification**: Confirm that L × U = A after completion
- **Multiple sizes**: Try with 3×3 or 4×4 matrices

## How to Use

1. Click **Next Step** to advance through the algorithm
2. Use **Auto Run** to automatically step through
3. Adjust the **Speed slider** to control animation pace
4. Click **Reset** to start over
5. After completion, click **Verify L×U=A** to confirm

## The Algorithm

For each column k (from 1 to n-1):

1. **Select pivot**: Use element A[k,k] as the pivot
2. **For each row below pivot** (rows k+1 to n):
    - Calculate multiplier: `l[i,k] = A[i,k] / A[k,k]`
    - Store multiplier in L
    - Subtract: `Row i = Row i - multiplier × Row k`
3. Continue until A becomes upper triangular (U)

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain how LU decomposition relates to Gaussian elimination
- Identify where multipliers are stored in the L matrix
- Understand why L is lower triangular with 1s on the diagonal
- Verify that A = LU holds after the decomposition

## Lesson Plan

### Warm-up (3 minutes)
Ask students to recall Gaussian elimination and what information is "lost" during the process.

### Demonstration (7 minutes)
Walk through the 3×3 example together:

1. First pivot: A[1,1] = 2
2. Eliminate A[2,1]: multiplier = 4/2 = 2
3. Eliminate A[3,1]: multiplier = 8/2 = 4
4. Continue with second pivot

### Key Insight
Emphasize that LU decomposition "saves" the multipliers that would otherwise be discarded in Gaussian elimination.

### Practice (10 minutes)
Have students:

1. Predict the next multiplier before clicking
2. Try the 4×4 matrix
3. Verify the decomposition

### Discussion Questions

1. Why is L lower triangular?
2. Why are the diagonal elements of L all equal to 1?
3. What would happen if a pivot were zero?

## References

- Chapter 7: Matrix Decompositions - LU Decomposition section
- Strang, G. "Introduction to Linear Algebra" - Chapter on Elimination
- [MIT OCW: LU Decomposition](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/)
