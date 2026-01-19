---
title: Matrix Multiplication Visualizer
description: Step-by-step visualization of matrix multiplication showing row-by-column dot product calculations with animation and highlighting.
image: /sims/matrix-multiplication/matrix-multiplication.png
og:image: /sims/matrix-multiplication/matrix-multiplication.png
twitter:image: /sims/matrix-multiplication/matrix-multiplication.png
quality_score: 90
social:
   cards: false
---

# Matrix Multiplication Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Matrix Multiplication MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/matrix-multiplication/main.html" height="502px" scrolling="no"></iframe>
```

## Description

Matrix multiplication is the most important and nuanced matrix operation. This MicroSim breaks down the row-by-column computation process step by step, helping students understand exactly how each entry in the result matrix is computed.

**Key Features:**

- **Row and Column Highlighting**: The current row of A and column of B are highlighted to show which vectors are being combined
- **Step-by-Step Calculation**: Watch each element-wise multiplication and addition as it happens
- **Running Sum Display**: See the dot product accumulate as each term is added
- **Auto-Play Mode**: Watch the entire multiplication unfold automatically
- **Adjustable Dimensions**: Try different matrix sizes to understand dimension compatibility

## How Matrix Multiplication Works

For matrices A (m×n) and B (n×p), the result C is an (m×p) matrix where:

$$c_{ij} = \sum_{k=1}^{n} a_{ik} \cdot b_{kj}$$

Each entry $c_{ij}$ is the **dot product** of row $i$ of A with column $j$ of B.

### Dimension Compatibility Rule

The number of **columns** in A must equal the number of **rows** in B:

| Matrix A | Matrix B | Result C | Valid? |
|----------|----------|----------|--------|
| 2×3 | 3×2 | 2×2 | Yes |
| 3×2 | 3×4 | — | No |
| 2×2 | 2×2 | 2×2 | Yes |

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Explain the row-by-column dot product process for computing each entry
2. Determine the dimensions of the result matrix given input dimensions
3. Identify when two matrices can be multiplied (dimension compatibility)
4. Calculate individual entries of a matrix product

### Guided Exploration (7-10 minutes)

1. **Watch One Entry**: Click "Next" repeatedly to see C[1,1] computed step by step
2. **Use Auto-Play**: Click "Auto" to watch the entire multiplication animate
3. **Change Dimensions**: Try 3×3 matrices to see more computation
4. **Predict Before Clicking**: Before each step, predict the next partial sum

### Key Discussion Points

- **Not Commutative**: Unlike regular multiplication, AB ≠ BA in general
- **Dimension Flow**: (m×n) × (n×p) → (m×p) — the inner dimensions must match
- **Computational Cost**: Each entry requires n multiplications and n-1 additions

### Assessment Questions

1. For A (2×3) and B (3×4), what are the dimensions of C = AB?
2. How many multiplication operations are needed to compute one entry of C?
3. If A[1,2] = 3 and B[2,1] = 4, what is their contribution to C[1,1]?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Matrix multiplication in context
- [3Blue1Brown: Matrix Multiplication](https://www.youtube.com/watch?v=XkY2DOUCWMU) - Visual intuition for matrix multiplication
