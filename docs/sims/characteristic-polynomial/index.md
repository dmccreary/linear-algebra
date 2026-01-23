---
title: Characteristic Polynomial Explorer
description: Interactive computation of characteristic polynomials and eigenvalues for 2×2 and 3×3 matrices with graphical visualization.
image: /sims/characteristic-polynomial/characteristic-polynomial.png
og:image: /sims/characteristic-polynomial/characteristic-polynomial.png
twitter:image: /sims/characteristic-polynomial/characteristic-polynomial.png
social:
   cards: false
---

# Characteristic Polynomial Explorer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Characteristic Polynomial Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive tool helps you understand how eigenvalues are found by computing the characteristic polynomial det(A - λI) and finding its roots. The visualization shows both the algebraic computation and the graphical representation of the polynomial.

**Key Features:**

- **2×2 and 3×3 matrices**: Toggle between matrix sizes
- **Editable matrix entries**: Click cells to enter custom values
- **Step-by-step calculation**: See the polynomial derivation
- **Polynomial graph**: Visualize p(λ) and see eigenvalues as x-intercepts
- **Trace slider**: Explore points along the polynomial curve
- **Preset examples**: Identity, random, and symmetric matrices

## How to Use

1. **Select matrix size** using the 2×2/3×3 toggle button
2. **Click matrix cells** to edit values
3. **View the characteristic polynomial** in the left panel
4. **See eigenvalues** where the curve crosses the x-axis (red dots)
5. **Use the λ trace slider** to explore values along the polynomial

## Mathematical Background

The characteristic equation is: **det(A - λI) = 0**

For a 2×2 matrix [[a, b], [c, d]]:

- p(λ) = λ² - (a+d)λ + (ad-bc)
- = λ² - trace(A)λ + det(A)

The eigenvalues are the roots of this polynomial, found using the quadratic formula:

λ = (trace ± √(trace² - 4·det)) / 2

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/characteristic-polynomial/main.html" height="532px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Compute the characteristic polynomial for 2×2 and 3×3 matrices
2. Find eigenvalues as roots of the characteristic polynomial
3. Connect the algebraic formula to the graphical representation

### Suggested Activities

1. **Verify by hand**: Compute the characteristic polynomial for [[4, 2], [1, 3]] and verify it matches the display
2. **Trace exploration**: For eigenvalue λ = 5, verify that p(5) = 0 by using the slider
3. **Complex eigenvalues**: Try [[0, -1], [1, 0]] - what happens to the graph?
4. **Triple root**: Can you create a 3×3 matrix where all three eigenvalues are equal?

### Assessment Questions

1. What is the relationship between the trace of A and the coefficient of λ in the characteristic polynomial?
2. If the characteristic polynomial never crosses the x-axis, what does this mean about the eigenvalues?
3. For a triangular matrix, how do eigenvalues relate to diagonal entries?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
