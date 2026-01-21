---
title: Power Iteration Algorithm
description: Visualization of the power iteration method for finding the dominant eigenvalue and eigenvector through repeated matrix-vector multiplication.
image: /sims/power-iteration/power-iteration.png
og:image: /sims/power-iteration/power-iteration.png
twitter:image: /sims/power-iteration/power-iteration.png
social:
   cards: false
---

# Power Iteration Algorithm

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Power Iteration Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

Power iteration is a simple yet powerful algorithm for finding the dominant eigenvalue (largest in absolute value) and its corresponding eigenvector. It works by repeatedly multiplying a vector by the matrix and normalizing.

**Key Features:**

- **Step-by-step iteration**: Watch each multiply-and-normalize step
- **Convergence visualization**: Plot of angle error over iterations
- **Rayleigh quotient**: Real-time eigenvalue estimate
- **Theoretical comparison**: Green line shows expected convergence rate
- **Editable matrix**: Try different matrices

## The Algorithm

```
1. Start with random unit vector x₀
2. Repeat:
   a. y = Ax
   b. x = y / ||y||
   c. λ ≈ xᵀAx / xᵀx (Rayleigh quotient)
3. Until converged
```

## Convergence Rate

The error decreases proportionally to |λ₂/λ₁|^k where:
- λ₁ is the dominant eigenvalue
- λ₂ is the second largest eigenvalue
- k is the iteration number

**Faster convergence when |λ₂/λ₁| is small!**

## How to Use

1. **Click "Step"** to perform one iteration
2. **Click "Run"** for continuous iteration
3. **Adjust speed slider** to control animation speed
4. **Click "Reset"** to start with a new random vector
5. **Edit matrix cells** to try different matrices

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/power-iteration/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Explain how power iteration finds the dominant eigenvector
2. Connect the eigenvalue ratio |λ₂/λ₁| to convergence speed
3. Use the Rayleigh quotient to estimate eigenvalues

### Suggested Activities

1. **Predict convergence**: Before running, predict if convergence will be fast or slow based on eigenvalue ratio
2. **Worst case**: Find a matrix where power iteration converges very slowly
3. **Best case**: Find a matrix where it converges in one step
4. **Complex eigenvalues**: What happens with [[0, -1], [1, 0]]?

### Assessment Questions

1. Why does power iteration find the *dominant* eigenvalue specifically?
2. If |λ₁| = |λ₂|, what goes wrong with power iteration?
3. How does the Rayleigh quotient provide a better eigenvalue estimate than just looking at vector scaling?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](/learning-graph/)
