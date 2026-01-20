---
title: Cofactor Expansion Interactive Visualizer
description: Step-by-step animation showing cofactor expansion for computing determinants of any size matrix.
image: /sims/cofactor-expansion/cofactor-expansion.png
og:image: /sims/cofactor-expansion/cofactor-expansion.png
twitter:image: /sims/cofactor-expansion/cofactor-expansion.png
social:
   cards: false
---

# Cofactor Expansion Interactive Visualizer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Cofactor Expansion Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **cofactor expansion** (Laplace expansion), a general method for computing determinants of any square matrix.

Key concepts:

- **Minor** $M_{ij}$: Determinant of submatrix after removing row $i$ and column $j$
- **Cofactor** $C_{ij} = (-1)^{i+j} M_{ij}$: Minor with alternating sign
- **Expansion**: $\det(A) = \sum_j a_{ij} \cdot C_{ij}$

The sign pattern follows a checkerboard: + for even $(i+j)$, - for odd $(i+j)$.

## How to Use

1. **Step through**: Click "Step" to see each cofactor computed
2. **Play animation**: Click "Play" to auto-advance through all steps
3. **Change expansion row**: Select which row to expand along
4. **Toggle sign pattern**: Show/hide the checkerboard sign display

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/cofactor-expansion/main.html" height="522px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Identify minors and cofactors of matrix entries
2. Apply the cofactor expansion formula along any row
3. Understand why expansion along any row gives the same determinant

### Suggested Activities

1. **Compare rows**: Expand along different rows and verify same result
2. **Efficiency analysis**: Which row would be most efficient if some entries are zero?
3. **Recursive thinking**: How would you extend this to 4×4 matrices?

### Assessment Questions

1. For a 3×3 matrix, how many 2×2 determinants must be computed?
2. Why does the sign alternate in a checkerboard pattern?
3. If row 2 of a matrix is [0, 5, 0], which cofactor expansion would be most efficient?

## References

- Chapter 5: Determinants and Matrix Properties - Cofactor Expansion section
- [Linear Algebra Learning Graph](/learning-graph/)
