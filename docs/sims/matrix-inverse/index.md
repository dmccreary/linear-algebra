---
title: Matrix Inverse Explorer
description: Interactive exploration of 2×2 matrix inversion with real-time computation, verification that AA⁻¹ = I, and visualization of singular matrices.
image: /sims/matrix-inverse/matrix-inverse.png
og:image: /sims/matrix-inverse/matrix-inverse.png
twitter:image: /sims/matrix-inverse/matrix-inverse.png
quality_score: 90
social:
   cards: false
---

# Matrix Inverse Explorer

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Matrix Inverse Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Matrix Inverse Explorer MicroSim with the p5.js editor](https://editor.p5js.org/)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/matrix-inverse/main.html" height="452px" scrolling="no"></iframe>
```

## Description

The **matrix inverse** generalizes division to matrices. For a square matrix A, its inverse A⁻¹ (if it exists) satisfies AA⁻¹ = A⁻¹A = I, where I is the identity matrix. This MicroSim lets you explore matrix inversion interactively.

**Key Features:**

- **Real-Time Computation**: See the inverse update instantly for random matrices
- **Verification Display**: Watch AA⁻¹ = I computed live
- **Determinant Indicator**: Color-coded display shows invertibility status
- **Singularity Exploration**: Make matrices singular or approach singularity smoothly
- **Formula Display**: See the 2×2 inverse formula applied

## The 2×2 Inverse Formula

For a 2×2 matrix:

$$A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$$

The inverse is:

$$A^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$$

**Key insight**: The inverse exists if and only if det(A) = ad - bc ≠ 0.

## Singular Matrices

A matrix is **singular** (not invertible) when:

- det(A) = 0
- The columns are linearly dependent
- The matrix maps some non-zero vector to zero

The MicroSim shows this by turning red when you click "Make Singular" or slide toward singularity.

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Apply the 2×2 inverse formula to compute A⁻¹
2. Verify that AA⁻¹ = I for invertible matrices
3. Identify singular matrices by their zero determinant
4. Explain why singular matrices have no inverse

### Guided Exploration (5-7 minutes)

1. **Start with Default**: Observe the invertible matrix and verify AA⁻¹ = I
2. **Click Randomize**: Generate new matrices and check determinants
3. **Make Singular**: Click the button and observe the warning
4. **Approach Singularity**: Use the slider to see determinant approach zero

### Discussion Points

- What happens to the inverse entries as det(A) approaches zero?
- Why does "Make Singular" make row 2 proportional to row 1?
- How does this connect to solving systems of equations?

### Assessment Questions

1. For A = [[3, 1], [2, 1]], compute det(A) and A⁻¹.
2. Why can't you divide by a matrix the way you divide by a number?
3. If det(A) = 0.001, is A technically invertible? Is it practically invertible?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Matrix inverse in context
- [Khan Academy: Inverse Matrices](https://www.khanacademy.org/math/linear-algebra/matrix-transformations/inverse-matrices/v/inverse-matrix) - Video explanation
