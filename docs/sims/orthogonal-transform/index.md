---
title: Orthogonal Matrix Transformation
description: Interactive visualization demonstrating how orthogonal matrices (rotations and reflections) preserve lengths and angles when transforming shapes.
image: /sims/orthogonal-transform/orthogonal-transform.png
og:image: /sims/orthogonal-transform/orthogonal-transform.png
twitter:image: /sims/orthogonal-transform/orthogonal-transform.png
quality_score: 90
social:
   cards: false
---

# Orthogonal Matrix Transformation

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Orthogonal Transform MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Orthogonal Transform MicroSim with the p5.js editor](https://editor.p5js.org/)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/orthogonal-transform/main.html" height="502px" scrolling="no"></iframe>
```

## Description

An **orthogonal matrix** Q satisfies Q^T Q = I, meaning its transpose equals its inverse. This special property makes orthogonal matrices preserve lengths and angles—they represent **rotations** and **reflections** that transform shapes without distortion.

**Key Features:**

- **Real-Time Rotation**: Drag the angle slider to see the unit square rotate smoothly
- **Length Preservation**: Toggle "Lengths" to verify that |Qv| = |v| for all vectors
- **Angle Preservation**: Toggle "Angles" to see that angles between vectors are maintained
- **Reflection Toggle**: Click "Reflect" to add a reflection (changes det(Q) from +1 to -1)
- **Live Matrix Display**: Watch the rotation matrix entries update as cos(θ) and sin(θ)

## The Rotation Matrix

A 2D rotation by angle θ is represented by:

$$Q = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$$

**Properties:**

- **Orthogonal**: Q^T Q = Q Q^T = I
- **Determinant**: det(Q) = 1 (rotation) or -1 (reflection)
- **Preserves Lengths**: ||Qx|| = ||x|| for all vectors x
- **Preserves Angles**: The angle between Qx and Qy equals the angle between x and y

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Explain why orthogonal matrices preserve lengths and angles
2. Write the 2D rotation matrix for any angle θ
3. Distinguish between rotation (det = +1) and reflection (det = -1)
4. Verify that Q^T Q = I for rotation matrices

### Guided Exploration (5-7 minutes)

1. **Rotate the Square**: Move the slider from 0° to 90° and observe the shape transformation
2. **Check Lengths**: Enable "Lengths" and verify the sample vectors maintain their magnitude
3. **Check Angles**: Enable "Angles" and verify the angle between vectors is preserved
4. **Add Reflection**: Click "Reflect" and observe how the square flips

### Key Discussion Points

- Why does the unit square maintain its shape during rotation?
- What happens to the determinant when reflection is added?
- How does this relate to preserving area?

### Assessment Questions

1. What is the rotation matrix for θ = 90°?
2. If a rotation matrix has det = -1, is it a pure rotation?
3. Why is Q^(-1) = Q^T computationally advantageous?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Orthogonal matrices in context
- [3Blue1Brown: Linear Transformations](https://www.youtube.com/watch?v=kYB8IZa5AuE) - Visual understanding of transformations
