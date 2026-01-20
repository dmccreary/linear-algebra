---
title: Symmetric Matrix
description: Interactive visualization demonstrating symmetric matrices where A[i,j] = A[j,i], with adjustable size from 2×2 to 10×10.
image: /sims/symmetric-matrix/symmetric-matrix.png
og:image: /sims/symmetric-matrix/symmetric-matrix.png
twitter:image: /sims/symmetric-matrix/symmetric-matrix.png
quality_score: 95
social:
   cards: false
---

# Symmetric Matrix

<iframe src="main.html" height="500px" width="100%" scrolling="no"></iframe>

[Run the Symmetric Matrix MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Symmetric Matrix MicroSim with the p5.js editor](https://editor.p5js.org/dmccreary/sketches/U66gi8zxJ)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/symmetric-matrix/main.html" height="520px" scrolling="no"></iframe>
```

## Description

This MicroSim provides an interactive visualization of **symmetric matrices**, a fundamental concept in linear algebra. A matrix is symmetric when it equals its own transpose, meaning the element at position (i,j) equals the element at position (j,i) for all indices.

**Key Features:**

- **Visual Symmetry**: Color coding highlights the relationship between the upper triangle (blue), lower triangle (green), and diagonal elements (tan)
- **Dynamic Size**: Adjust the matrix dimensions from 2×2 to 10×10 using the slider
- **Random Generation**: The Regenerate button creates new random symmetric matrices with values 0-9
- **Index Labels**: Row and column indices help identify element positions

## Symmetry Property

A matrix $A$ is symmetric if and only if:

$$A = A^T$$

Which means for all valid indices $i$ and $j$:

$$a_{ij} = a_{ji}$$

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Identify whether a given matrix is symmetric by visual inspection
2. Understand that symmetric matrices are equal to their transpose
3. Recognize that only square matrices can be symmetric
4. Observe that the diagonal elements have no symmetry constraint

### Warm-up Activity (2 minutes)

Ask students: "If you fold a square matrix along its main diagonal, which elements would overlap?" Let them discover that $a_{ij}$ overlaps with $a_{ji}$.

### Guided Exploration (5 minutes)

1. Start with a small 3×3 matrix
2. Point out that blue cells in the upper triangle have matching green cells in the lower triangle
3. Click "Regenerate" several times to see that the symmetry property always holds
4. Increase the size to 6×6 and observe the same pattern

### Key Discussion Points

- **Transpose Relationship**: $A^T$ is obtained by swapping rows and columns, so $A = A^T$ means this swap leaves the matrix unchanged
- **Degrees of Freedom**: An $n×n$ symmetric matrix has only $\frac{n(n+1)}{2}$ independent values (upper triangle + diagonal)
- **Applications**: Covariance matrices, distance matrices, and adjacency matrices of undirected graphs are always symmetric

### Assessment Questions

1. How many unique values determine a 5×5 symmetric matrix?
2. If $a_{23} = 7$ in a symmetric matrix, what is $a_{32}$?
3. Can a 3×4 matrix be symmetric? Why or why not?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Matrix properties
- [Special Matrices](../../sims/special-matrices/index.md) - Other important matrix types
