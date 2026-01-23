---
title: Matrix Addition and Scalar Multiplication
description: Interactive visualization demonstrating element-wise matrix addition and scalar multiplication with step-by-step calculation highlighting.
image: /sims/matrix-basic-ops/matrix-basic-ops.png
og:image: /sims/matrix-basic-ops/matrix-basic-ops.png
twitter:image: /sims/matrix-basic-ops/matrix-basic-ops.png
quality_score: 85
social:
   cards: false
---

# Matrix Addition and Scalar Multiplication

<iframe src="main.html" height="350px" width="100%" scrolling="no"></iframe>

[Run the Matrix Basic Operations MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Matrix Basic Operations MicroSim with the p5.js editor](https://editor.p5js.org/)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/matrix-basic-ops/main.html" height="482px" scrolling="no"></iframe>
```

## Description

This MicroSim provides hands-on practice with the two most fundamental matrix operations: addition and scalar multiplication. Both operations are **element-wise**, meaning they operate on corresponding entries independently.

**Key Features:**

- **Dual Operations**: Switch between matrix addition (A + B = C) and scalar multiplication (k × A = C)
- **Visual Layout**: Three matrices displayed with operation symbols for clear understanding
- **Step-Through Mode**: Click "Step" to highlight each calculation sequentially
- **Adjustable Scalar**: Slider controls the scalar value from -3 to 3 for multiplication
- **Formula Display**: Shows the mathematical formula and current calculation

## How It Works

### Matrix Addition
For two matrices A and B of the same dimensions, their sum C is computed entry-by-entry:

$$c_{ij} = a_{ij} + b_{ij}$$

### Scalar Multiplication
For a scalar k and matrix A, the product C multiplies each entry by k:

$$c_{ij} = k \cdot a_{ij}$$

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Calculate the sum of two matrices by adding corresponding entries
2. Multiply a matrix by a scalar by multiplying each entry
3. Recognize that both operations preserve matrix dimensions
4. Understand the element-wise nature of these operations

### Guided Exploration (5-7 minutes)

1. **Start with Addition**: Observe how each entry in C equals the sum of corresponding entries in A and B
2. **Use Step Mode**: Click "Step" repeatedly to see each calculation highlighted in sequence
3. **Switch to Scalar Multiply**: Change to scalar multiplication and adjust the slider
4. **Explore Edge Cases**: What happens when k = 0? When k = -1?

### Key Discussion Points

- **Dimension Requirement**: For addition, matrices must have the same dimensions
- **Commutativity**: Matrix addition is commutative (A + B = B + A)
- **Scalar Distribution**: k(A + B) = kA + kB

### Assessment Questions

1. If A[2,3] = 4 and B[2,3] = -2, what is C[2,3] in A + B?
2. If k = -2 and A[1,1] = 5, what is C[1,1] in kA?
3. Does the order of matrices matter for addition? Why or why not?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Matrix addition and scalar multiplication in context
- [Linear Algebra and Its Applications](https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006185) - Lay, Lay, and McDonald
