---
title: Gram-Schmidt Process Visualizer
description: Step-by-step 3D visualization of Gram-Schmidt orthonormalization showing projections and the construction of orthonormal vectors
image: /sims/gram-schmidt/gram-schmidt.png
---

# Gram-Schmidt Process Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Gram-Schmidt Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates the **Gram-Schmidt orthonormalization** process in 3D, showing how to construct orthonormal vectors from an arbitrary set of linearly independent vectors.

The algorithm takes vectors a₁, a₂, a₃ and produces orthonormal vectors q₁, q₂, q₃ that span the same subspace.

## Key Features

- **3D Visualization**: See vectors in 3D space with rotation
- **Step-by-step Execution**: Watch each phase of the algorithm
- **Projection Visualization**: See projections being subtracted (cyan lines)
- **Right-angle Indicators**: Confirm orthogonality between q vectors
- **R Matrix Values**: See the R matrix being built

## The Algorithm

For each vector aⱼ (j = 1, 2, 3):

1. **Project**: Compute projections onto all existing q vectors
   $$\text{proj}_{q_i}(a_j) = (q_i^T a_j) q_i$$

2. **Subtract**: Remove all projections to get v
   $$v_j = a_j - \sum_{i=1}^{j-1} (q_i^T a_j) q_i$$

3. **Normalize**: Scale v to unit length
   $$q_j = \frac{v_j}{\|v_j\|}$$

## How to Use

1. Click **Step** to advance through algorithm phases
2. Use **Run All** to automatically step through
3. **Drag to rotate** the 3D view
4. Toggle **Show Projections** to see what's being subtracted
5. Watch the **R matrix values** accumulate

## Learning Objectives

After using this MicroSim, students will be able to:

- Execute the Gram-Schmidt process step by step
- Visualize how projections remove components in existing directions
- Understand why the resulting vectors are orthonormal
- Connect Gram-Schmidt to QR decomposition

## Visual Elements

| Element | Color | Meaning |
|---------|-------|---------|
| Dashed lines | Faded colors | Original vectors a₁, a₂, a₃ |
| Solid thick lines | Bright colors | Orthonormal vectors q₁, q₂, q₃ |
| Orange line | Orange | Current working vector v |
| Cyan lines | Cyan | Projection components |
| L-shapes | Gray | Right-angle indicators |

## Lesson Plan

### Introduction (5 minutes)
Ask students: "If we have a basis for a subspace, how can we find an orthonormal basis for the same subspace?"

Explain that orthonormal bases make many computations easier (projections, least squares, etc.).

### Demonstration (10 minutes)
Walk through the algorithm together:

1. **First vector**: Simply normalize a₁ to get q₁
2. **Second vector**:
   - Project a₂ onto q₁
   - Subtract to get component perpendicular to q₁
   - Normalize to get q₂
3. **Third vector**:
   - Project a₃ onto both q₁ and q₂
   - Subtract both projections
   - Normalize to get q₃

### Key Insights

- Each subtraction removes the component in an already-covered direction
- The remainder is perpendicular to all previous q vectors
- Normalizing ensures unit length

### Practice (10 minutes)
Have students:

1. Predict which direction v will point before clicking
2. Verify orthogonality using the right-angle indicators
3. Check that |qᵢ| = 1 for all i

### Discussion Questions

1. Why do we subtract projections instead of adding them?
2. What would happen if the original vectors were linearly dependent?
3. How does this relate to QR decomposition?

## Mathematical Connection to QR

The R matrix values shown are exactly the entries of R in A = QR:

- **Diagonal entries** rⱼⱼ = ||vⱼ|| (the normalization factor)
- **Off-diagonal entries** rᵢⱼ = qᵢᵀaⱼ (the projection coefficients)

## References

- Chapter 7: Matrix Decompositions - QR Decomposition section
- Chapter 8: Vector Spaces and Inner Products - Orthogonalization
- [3Blue1Brown: Gram-Schmidt](https://www.youtube.com/watch?v=rHonltF77zI)
