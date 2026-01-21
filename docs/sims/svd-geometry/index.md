---
title: SVD Geometric Interpretation
description: Visualize SVD as a sequence of rotation-scaling-rotation transformations on the unit circle
image: /sims/svd-geometry/svd-geometry.png
---

# SVD Geometric Interpretation

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the SVD Geometry Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates the **geometric interpretation of SVD** by showing how a matrix transformation can be decomposed into three steps:

$$A = U \Sigma V^T$$

- **Vᵀ**: Rotate to align with principal axes
- **Σ**: Scale along each axis by singular values
- **U**: Rotate to final orientation

## Key Features

- **Four-panel View**: See each transformation stage simultaneously
- **Animated Transition**: Watch the unit circle transform step by step
- **Interactive Matrix**: Modify the 2×2 matrix entries
- **Singular Vectors**: Visualize v₁, v₂ and u₁, u₂ directions
- **SVD Computation**: See the full decomposition A = UΣVᵀ

## The SVD Geometry

The SVD reveals that any linear transformation can be understood as:

| Step | Operation | Geometric Effect |
|------|-----------|------------------|
| 1 | Vᵀ | Rotate to align with right singular vectors |
| 2 | Σ | Stretch/compress by σ₁ and σ₂ |
| 3 | U | Rotate to align with left singular vectors |

The unit circle becomes an ellipse with:
- **Semi-axes** of length σ₁ and σ₂
- **Axes directions** along columns of U

## How to Use

1. Click **Animate** to watch the transformation unfold
2. Use the **Phase slider** to manually control the animation
3. **Adjust matrix entries** to see different transformations
4. Toggle **Show Singular Vectors** to see v and u directions
5. Click **Reset** to return to the beginning

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain SVD as rotation-scaling-rotation
- Identify singular values as ellipse semi-axis lengths
- Connect singular vectors to input/output principal directions
- Understand why any matrix can be decomposed this way

## Observations to Make

### Symmetric Matrix (try a₁₂ = a₂₁)
When A is symmetric, U = V (or U = -V), so the input and output rotations align.

### Diagonal Matrix (try a₁₂ = a₂₁ = 0)
No rotation needed—the circle just stretches along the coordinate axes.

### Rotation Matrix (try a₁₁ = a₂₂ = cos(θ), a₁₂ = -a₂₁ = sin(θ))
Both singular values are 1, so no scaling—just rotation.

## Lesson Plan

### Introduction (5 minutes)
Ask: "What's the simplest way to understand what any matrix transformation does?"

Introduce the idea that any matrix can be broken into rotation, scaling, and rotation.

### Demonstration (10 minutes)

1. Start with the default matrix and animate
2. Point out:
   - The unit circle becomes an ellipse
   - The ellipse axes are σ₁ and σ₂
   - Red and green vectors show principal directions

3. Try different matrices:
   - Symmetric: a₁₂ = a₂₁
   - Diagonal: off-diagonal = 0
   - Singular: det(A) ≈ 0

### Key Insight
The SVD finds the directions where the transformation acts most simply—just stretching, no rotation.

### Practice (10 minutes)
Have students:

1. Predict the shape of the transformed ellipse
2. Identify which singular value is larger
3. Draw the principal directions before/after

### Assessment Questions

1. What does σ₁ > σ₂ mean geometrically?
2. Why does the unit circle become an ellipse?
3. When would the ellipse be a circle?

## Mathematical Notes

For a 2×2 matrix:

- **Singular values**: σᵢ = √(eigenvalues of AᵀA)
- **Right singular vectors** (V): eigenvectors of AᵀA
- **Left singular vectors** (U): eigenvectors of AAᵀ

The decomposition exists for any matrix—not just square or symmetric ones.

## References

- Chapter 7: Matrix Decompositions - SVD section
- [3Blue1Brown: SVD](https://www.youtube.com/watch?v=mhy-ZKSARxI)
- Strang, G. "Linear Algebra and Learning from Data"
