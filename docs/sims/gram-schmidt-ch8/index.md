---
title: Gram-Schmidt Step-by-Step Visualizer
description: Detailed step-by-step 3D visualization of Gram-Schmidt orthonormalization showing projection computation, subtraction, and normalization phases
image: /sims/gram-schmidt-ch8/gram-schmidt-ch8.png
---

# Gram-Schmidt Step-by-Step Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Gram-Schmidt Step-by-Step Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization provides a **detailed step-by-step walkthrough** of the Gram-Schmidt orthonormalization process in 3D. Unlike the Chapter 7 overview, this version shows each individual projection computation and subtraction, making it ideal for understanding the mechanics of the algorithm.

## Key Features

- **Detailed Step Control**: Watch each projection, subtraction, and normalization step individually
- **Customizable Input Vectors**: Adjust all three input vectors using sliders
- **Projection Visualization**: See each projection vector being computed and subtracted
- **Residual Display**: View the intermediate u vectors before normalization
- **Right-Angle Indicators**: Confirm orthogonality between output vectors
- **Linear Dependence Warning**: Get notified if vectors become nearly dependent

## Visual Elements

| Element | Color | Meaning |
|---------|-------|---------|
| Dashed gray lines | Gray (faded) | Input vectors v1, v2, v3 |
| Solid colored lines | Red/Green/Blue | Orthonormal output vectors q1, q2, q3 |
| Orange line | Orange | Intermediate u vector (before normalization) |
| Cyan lines | Cyan | Projection components |
| L-shapes | Gray | Right-angle indicators between q vectors |

## How to Use

1. **Adjust Input Vectors**: Use the sliders on the right to set custom input vectors
2. **Click "Next Step"**: Advance through each phase of the algorithm
3. **Use "Auto Run"**: Automatically step through with adjustable speed
4. **Toggle Options**:
   - "Show All Projections" displays all computed projections
   - "Show Residual" displays the intermediate u vector
5. **Drag to Rotate**: Click and drag on the 3D view to change perspective
6. **Reset**: Return to the initial state

## The Algorithm in Detail

### For the First Vector (v1)

Simply normalize:
$$q_1 = \frac{v_1}{\|v_1\|}$$

### For Subsequent Vectors (v2, v3, ...)

**Step 1 - Compute Projections**: For each existing q vector, compute:
$$\text{proj}_{q_i}(v_j) = (v_j \cdot q_i) \cdot q_i$$

**Step 2 - Subtract Projections**: Remove all components in existing directions:
$$u_j = v_j - \sum_{i=1}^{j-1} \text{proj}_{q_i}(v_j)$$

**Step 3 - Normalize**: Scale to unit length:
$$q_j = \frac{u_j}{\|u_j\|}$$

## Learning Objectives

After using this MicroSim, students will be able to:

- Execute each step of Gram-Schmidt with full understanding
- Visualize how projections identify components parallel to existing vectors
- Understand why subtraction yields orthogonal residuals
- Recognize when vectors are linearly dependent
- Connect the geometric intuition to the algebraic formulas

## Why This Matters

Gram-Schmidt orthonormalization is fundamental to:

- **QR Decomposition**: The Q matrix columns are exactly the output of Gram-Schmidt
- **Least Squares**: Computing orthonormal bases simplifies projection calculations
- **Numerical Stability**: Orthonormal vectors avoid numerical conditioning issues
- **Signal Processing**: Orthogonal bases are essential for Fourier analysis

## Practice Exercises

1. **Standard Basis**: Set v1=(1,0,0), v2=(0,1,0), v3=(0,0,1). Verify the output matches the input.

2. **Dependent Vectors**: Try v1=(1,0,0), v2=(2,0,0), v3=(0,1,0). What happens with the linear dependence?

3. **General Case**: Use the default vectors and predict each projection direction before clicking "Next Step".

4. **Orthogonality Check**: After completion, mentally verify that each pair of q vectors is perpendicular.

## Mathematical Connection

The Gram-Schmidt process produces the QR factorization:

$$A = QR$$

where:
- **A** is the matrix with input vectors as columns
- **Q** is the matrix with orthonormal vectors q1, q2, q3 as columns
- **R** is upper triangular with entries:
  - Diagonal: $r_{jj} = \|u_j\|$ (the normalization factors)
  - Off-diagonal: $r_{ij} = q_i \cdot v_j$ (the projection coefficients)

## References

- Chapter 7: Matrix Decompositions - QR Decomposition
- Chapter 8: Vector Spaces and Inner Products - Orthogonalization
- [3Blue1Brown: Gram-Schmidt Process](https://www.youtube.com/watch?v=rHonltF77zI)
