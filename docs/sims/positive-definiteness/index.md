---
title: Positive Definiteness Visualizer
description: Interactive 3D visualization of quadratic forms showing how eigenvalue signs determine positive definiteness
image: /sims/positive-definiteness/positive-definiteness.png
---

# Positive Definiteness Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Positive Definiteness Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates **positive definiteness** for 2×2 symmetric matrices by plotting the quadratic form:

$$f(x, y) = \mathbf{x}^T A \mathbf{x} = a_{11}x^2 + 2a_{12}xy + a_{22}y^2$$

The 3D surface shows how the function value changes with input, revealing the geometric meaning of:

- **Positive Definite**: Bowl shape (minimum at origin), all eigenvalues positive
- **Negative Definite**: Inverted bowl (maximum at origin), all eigenvalues negative
- **Indefinite**: Saddle shape, eigenvalues have opposite signs
- **Semi-Definite**: Trough shape, one eigenvalue is zero

## Key Features

- **3D Surface Plot**: Visualize the quadratic form as a surface
- **Eigenvalue Display**: See eigenvalues with color coding (green=positive, red=negative)
- **Contour Lines**: Level curves showing where f(x,y) = constant
- **Eigenvector Directions**: Principal axes shown on the base plane
- **Interactive Matrix**: Adjust matrix entries with sliders
- **Presets**: Common examples of each classification

## How to Use

1. **Select a preset** to see classic examples of each type
2. **Adjust sliders** to modify individual matrix entries
3. **Drag to rotate** the 3D view
4. **Toggle contours** to see level curves
5. **Observe** how eigenvalues change with matrix entries

## Learning Objectives

After using this MicroSim, students will be able to:

- Connect eigenvalue signs to the shape of quadratic forms
- Identify positive definite matrices visually
- Understand why positive definite matrices arise in optimization
- Recognize the relationship between contour shapes and eigenvalues

## Mathematical Background

A symmetric matrix A is:

| Classification | Condition | Surface Shape |
|---------------|-----------|---------------|
| Positive Definite | All λ > 0 | Bowl (upward) |
| Negative Definite | All λ < 0 | Bowl (downward) |
| Indefinite | Mixed signs | Saddle |
| Positive Semi-Def | All λ ≥ 0, some = 0 | Trough |

## Lesson Plan

### Introduction (5 minutes)
Ask students: "What does it mean for a function to have a minimum at the origin?"

Connect this to the quadratic form: f(x,y) > 0 for all (x,y) ≠ (0,0) means the surface is a bowl opening upward.

### Exploration (10 minutes)

1. **Positive Definite**: Start with preset, note bowl shape and green eigenvalues
2. **Negative Definite**: Switch preset, observe inverted bowl and red eigenvalues
3. **Indefinite**: See the saddle point and mixed-color eigenvalues
4. **Semi-Definite**: Watch how the surface flattens when one eigenvalue is zero

### Key Insight
The eigenvectors are the principal axes of the contour ellipses. The eigenvalues determine how "stretched" the ellipses are along each axis.

### Hands-on Activity
Have students predict what happens when:

1. a₁₁ and a₂₂ are both positive but a₁₂ is large
2. a₁₂ = 0 (diagonal matrix)
3. a₁₁ = a₂₂ and a₁₂ = 0 (scalar matrix)

### Assessment Questions

1. What is the geometric meaning of xᵀAx > 0?
2. Why must all eigenvalues be positive for positive definiteness?
3. What shape do the contour lines form?

## References

- Chapter 7: Matrix Decompositions - Cholesky Decomposition section
- Chapter 6: Eigenvalues and Eigenvectors - Symmetric matrices
- [3Blue1Brown: Eigenvectors and eigenvalues](https://www.youtube.com/watch?v=PFDu9oVAE-g)
