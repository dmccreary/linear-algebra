---
title: Eigenspace Visualization
description: Interactive 2D visualization of eigenspaces showing eigenvectors, eigenvalues, and how matrices transform vectors along eigenspace directions.
image: /sims/eigenspace-visualization/eigenspace-visualization.png
og:image: /sims/eigenspace-visualization/eigenspace-visualization.png
twitter:image: /sims/eigenspace-visualization/eigenspace-visualization.png
social:
   cards: false
---

# Eigenspace Visualization

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Eigenspace Visualization Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This 2D visualization demonstrates how eigenspaces are vector subspaces containing all eigenvectors for a given eigenvalue. Eigenvectors are shown as colored arrows, and their corresponding eigenspaces are displayed as semi-transparent lines extending through the origin.

**Key Features:**

- **Multiple matrix examples**: Browse through different 2×2 matrices with varying eigenspace structures
- **Visual eigenspaces**: Extended lines through the origin showing the full eigenspace
- **Eigenvector arrows**: Solid arrows showing unit eigenvector directions
- **Transformed vectors**: Optional dashed arrows showing how eigenvalues scale eigenvectors
- **Matrix display**: Current matrix A shown in the corner
- **Color-coded legend**: Each eigenvalue and eigenvector pair has a distinct color

## How to Use

1. **Use Prev/Next buttons** to browse through different matrix examples
2. **Toggle "Show Grid"** to see or hide the coordinate grid
3. **Toggle "Show Transformed"** to see how the matrix scales eigenvectors by their eigenvalues
4. **Examine the legend** to see eigenvalue and eigenvector component values

## Mathematical Background

The **eigenspace** for eigenvalue λ is defined as:

$$E_λ = \text{null}(A - λI) = \{v ∈ ℝ^n : Av = λv\}$$

Key properties:

- Every eigenspace is a vector subspace passing through the origin
- For 2×2 matrices, eigenspaces are lines through the origin
- The eigenvalue λ determines how much vectors in that eigenspace are scaled
- If λ > 1, vectors are stretched; if 0 < λ < 1, vectors are compressed
- If λ < 0, vectors are reflected and scaled

## Examples Included

1. **Diagonal Matrix** $\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$: Eigenspaces along the x and y axes with λ=2 and λ=3

2. **Symmetric Matrix** $\begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}$: Orthogonal eigenvectors along the diagonals with λ=4 and λ=2

3. **Shear-like Matrix** $\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$: Repeated eigenvalue λ=2 with only one linearly independent eigenvector (defective matrix)

4. **Reflection Matrix** $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$: Reflection across y=x line with λ=1 and λ=-1

## Understanding the Visualization

- **Solid arrows**: Unit eigenvectors showing the direction of each eigenspace
- **Semi-transparent lines**: The full eigenspace (all scalar multiples of the eigenvector)
- **Dashed arrows** (when enabled): Show Av = λv, demonstrating how the matrix scales eigenvectors

The dashed transformed vectors illustrate the fundamental eigenvector equation: when a matrix multiplies an eigenvector, it only scales the vector by the eigenvalue—it doesn't change its direction.

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/eigenspace-visualization/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Visualize eigenspaces as lines through the origin in 2D
2. Understand how eigenvalues scale vectors within their eigenspaces
3. Recognize the relationship between matrix structure and eigenvector directions
4. Identify when matrices have orthogonal vs. non-orthogonal eigenvectors

### Suggested Activities

1. **Predict eigenspaces**: Given a diagonal matrix, predict what directions the eigenvectors will point
2. **Verify Av = λv**: Use the "Show Transformed" option to verify that transformed eigenvectors are scalar multiples of the original
3. **Compare symmetric vs. non-symmetric**: Note that symmetric matrices always have orthogonal eigenvectors
4. **Defective matrices**: Observe how the shear-like matrix has only one eigenspace despite having algebraic multiplicity 2

### Discussion Questions

1. Why do diagonal matrices always have eigenvectors along the coordinate axes?
2. What does it mean geometrically when an eigenvalue is negative?
3. Why can't two different eigenspaces (for different eigenvalues) overlap except at the origin?
4. What happens to a vector that is NOT an eigenvector when multiplied by the matrix?

### Assessment Questions

1. If a 2×2 matrix has eigenvalues λ₁=3 and λ₂=-1, describe what happens to eigenvectors in each eigenspace when multiplied by the matrix.
2. Why does a symmetric matrix always have orthogonal eigenvectors?
3. For the reflection matrix, explain why λ=1 corresponds to vectors on the line y=x and λ=-1 corresponds to vectors on the line y=-x.

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
