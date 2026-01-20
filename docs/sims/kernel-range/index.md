---
title: Kernel and Range Interactive Visualizer
description: Visualize the kernel (null space) and range (column space) of linear transformations, demonstrating the rank-nullity theorem.
image: /sims/kernel-range/kernel-range.png
og:image: /sims/kernel-range/kernel-range.png
twitter:image: /sims/kernel-range/kernel-range.png
social:
   cards: false
---

# Kernel and Range Interactive Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Kernel and Range Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization shows the two fundamental subspaces of a linear transformation:

- **Kernel (Null Space)**: Vectors that map to zero, shown in gray
- **Range (Column Space)**: All possible outputs, shown in red

The **Rank-Nullity Theorem** states:

$$\text{dim(Domain)} = \text{Rank} + \text{Nullity}$$

For a 2×2 matrix, this means Rank + Nullity = 2.

## How to Use

1. **Click "Full Rank"** to generate an invertible matrix (rank 2, nullity 0)
2. **Click "Rank Deficient"** to generate a rank-1 matrix with nontrivial kernel
3. **Toggle "Show Kernel"** to highlight the null space direction
4. **Toggle "Show Mapping"** to see how vectors map from domain to codomain
5. **Click "Animate"** to watch vectors transform

## Key Observations

- **Full rank**: Kernel = {0}, Range = all of ℝ², transformation is invertible
- **Rank deficient**: Kernel is a line, Range is a line, dimension collapses

Watch how vectors in the kernel (gray) all collapse to the origin, while vectors outside the kernel map to the range subspace.

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/kernel-range/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Identify the kernel and range of a transformation visually
2. Verify the rank-nullity theorem for 2×2 matrices
3. Explain why rank-deficient transformations are not invertible

### Suggested Activities

1. **Verify theorem**: For each matrix, check that rank + nullity = 2
2. **Trace vectors**: Follow a specific vector from domain to codomain
3. **Kernel test**: Given a vector, predict if it's in the kernel

### Assessment Questions

1. If a 3×4 matrix has rank 2, what is its nullity?
2. Why can't a transformation with nontrivial kernel be inverted?
3. How are the columns of a matrix related to its range?

## References

- Chapter 4: Linear Transformations - Kernel and Range section
- Rank-Nullity Theorem
