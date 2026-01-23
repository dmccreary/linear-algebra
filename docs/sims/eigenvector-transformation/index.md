---
title: Eigenvector Transformation Visualization
description: Interactive visualization demonstrating how eigenvectors maintain their direction under linear transformation while other vectors change direction.
image: /sims/eigenvector-transformation/eigenvector-transformation.png
og:image: /sims/eigenvector-transformation/eigenvector-transformation.png
twitter:image: /sims/eigenvector-transformation/eigenvector-transformation.png
social:
   cards: false
---

# Eigenvector Transformation Visualization

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Eigenvector Transformation Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization demonstrates the fundamental concept of eigenvectors: special vectors that maintain their direction under a linear transformation. When matrix A transforms a vector v, most vectors change both direction and magnitude. However, eigenvectors only scale by their corresponding eigenvalue λ.

**Key Features:**

- **Draggable vector**: Move the blue vector to explore how different vectors transform
- **Eigenvector detection**: When you align with an eigenvector direction, both vectors glow green
- **Editable matrix**: Click matrix cells to enter custom values
- **Animation**: Watch the transformation animate smoothly
- **Real-time computation**: See Av computed for any vector position

## How to Use

1. **Drag the blue vector** around the coordinate plane
2. Watch the red/green vector show the transformed result Av
3. When the vectors align (same direction), you've found an eigenvector!
4. **Click matrix cells** to edit values and explore different transformations
5. **Toggle "Show Eigenvectors"** to see the eigenvector directions as dashed lines
6. **Click "Animate Transform"** to see the transformation animated

## Mathematical Background

The eigen equation is: **Av = λv**

Where:
- A is a 2×2 matrix
- v is the eigenvector (non-zero)
- λ is the eigenvalue (scalar)

This equation states that when we apply transformation A to eigenvector v, the result is simply v scaled by λ. The default matrix [[2, 1], [1, 2]] has eigenvalues λ₁ = 3 and λ₂ = 1.

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/eigenvector-transformation/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Identify eigenvectors by observing which vectors maintain their direction under transformation
2. Understand the relationship between eigenvalues and scaling factors
3. Explain why eigenvectors are the "natural axes" of a linear transformation

### Suggested Activities

1. **Eigenvector Hunt**: Find both eigenvector directions for the default matrix by dragging the vector
2. **Eigenvalue Verification**: When on an eigenvector, verify that the scale factor equals the eigenvalue
3. **Matrix Exploration**: Try different matrices and predict how many real eigenvectors they have
4. **Rotation Matrix**: Enter [[0, -1], [1, 0]] - why does it have no real eigenvectors?

### Assessment Questions

1. For matrix [[3, 0], [0, 2]], what are the eigenvector directions? Why?
2. If a vector is scaled by factor 5 when transformed, what can you say about the eigenvalue?
3. Can a non-zero vector ever transform to zero? What would this imply about the eigenvalue?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
