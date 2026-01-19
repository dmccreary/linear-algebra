---
title: Sparse vs Dense Matrices
description: Side-by-side comparison of sparse and dense matrices showing structural differences, storage efficiency, and common sparsity patterns.
image: /sims/sparse-dense-matrices/sparse-dense-matrices.png
og:image: /sims/sparse-dense-matrices/sparse-dense-matrices.png
twitter:image: /sims/sparse-dense-matrices/sparse-dense-matrices.png
quality_score: 85
social:
   cards: false
---

# Sparse vs Dense Matrices

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Sparse vs Dense MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Sparse vs Dense MicroSim with the p5.js editor](https://editor.p5js.org/)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/sparse-dense-matrices/main.html" height="452px" scrolling="no"></iframe>
```

## Description

Matrices are classified by their distribution of zero entries. This MicroSim provides a visual comparison of **dense** matrices (mostly non-zero) and **sparse** matrices (mostly zero), helping students understand why sparsity matters for computation.

**Key Features:**

- **Visual Comparison**: Side-by-side matrix visualization with color intensity showing values
- **Sparsity Patterns**: Choose from random, diagonal, banded, or block patterns
- **Storage Statistics**: Real-time comparison of memory requirements
- **Adjustable Parameters**: Control matrix size and sparsity level

## Dense vs Sparse

| Property | Dense Matrix | Sparse Matrix |
|----------|--------------|---------------|
| Zero entries | Few | Many (typically >90%) |
| Storage | O(n²) | O(nnz) |
| Storage format | 2D array | CSR, CSC, COO |
| Example | Covariance matrices | Graph adjacency |

where **nnz** = number of non-zero entries.

## Why Sparsity Matters

### Storage Efficiency
A 10,000 × 10,000 dense matrix requires 800 MB (100M entries × 8 bytes).
The same matrix with 99% sparsity needs only ~16 MB in sparse format.

### Computational Speed
Operations that skip zeros are much faster:

- Matrix-vector multiply: O(nnz) vs O(n²)
- Solving linear systems: specialized algorithms exist

### Real-World Examples

- **Graph adjacency**: Most nodes connect to few others
- **Document-term matrices**: Each document uses few of all possible words
- **Finite elements**: Local interactions create banded structures

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Distinguish sparse and dense matrices visually
2. Estimate storage requirements for both types
3. Recognize common sparsity patterns in applications
4. Explain why sparse storage formats save memory

### Exploration Activity (5 minutes)

1. **Compare Visually**: Note the color distribution in both panels
2. **Try Patterns**: Select diagonal, banded, and block patterns
3. **Increase Size**: Slide to larger matrices and observe storage savings
4. **Adjust Sparsity**: See how storage ratio changes with sparsity level

### Discussion Questions

- At what sparsity level does sparse storage become advantageous?
- Why do graph adjacency matrices tend to be sparse?
- What real-world data would produce a banded matrix?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Sparse and dense matrices in context
- [SciPy Sparse Matrix Documentation](https://docs.scipy.org/doc/scipy/reference/sparse.html) - Python sparse matrix formats
