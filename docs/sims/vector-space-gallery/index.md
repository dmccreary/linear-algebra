---
title: Vector Space Examples Gallery
description: Interactive gallery showing diverse examples of vector spaces including R2, R3, polynomials, continuous functions, matrices, and null spaces.
image: /sims/vector-space-gallery/vector-space-gallery.png
og:image: /sims/vector-space-gallery/vector-space-gallery.png
twitter:image: /sims/vector-space-gallery/vector-space-gallery.png
social:
   cards: false
---

# Vector Space Examples Gallery

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Vector Space Gallery Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This gallery presents six diverse examples of vector spaces, demonstrating that the vector space structure appears throughout mathematics. Each card shows:

- **The vector space name and dimension**
- **Visual representation** with animated icons
- **The zero vector** for that space
- **A concrete example** of an element

## The Six Vector Spaces

| Vector Space | Dimension | Zero Vector | Key Property |
|-------------|-----------|-------------|--------------|
| $\mathbb{R}^2$ | 2 | Origin $(0,0)$ | Standard 2D plane |
| $\mathbb{R}^3$ | 3 | Origin $(0,0,0)$ | Physical 3D space |
| $\mathcal{P}_2$ | 3 | $p(x) = 0$ | Polynomials up to degree 2 |
| $C[a,b]$ | $\infty$ | $f(x) = 0$ | All continuous functions |
| $\mathbb{R}^{2\times 2}$ | 4 | Zero matrix | Square matrices |
| $\text{Null}(A)$ | varies | Origin | Solution space of $A\mathbf{x} = \mathbf{0}$ |

## How to Use

1. **Hover** over any card to see vector addition and scalar multiplication examples
2. **Notice the colors**: blue for finite dimensional, purple for infinite dimensional
3. **Observe the animations** that show elements "living" in each space
4. **Click** a card to highlight it for discussion

## Key Insights

### What Makes These Vector Spaces?

All six examples satisfy the same ten axioms:

1. **Closure under addition**: Adding two elements stays in the space
2. **Closure under scalar multiplication**: Scaling stays in the space
3. **Contains a zero vector**: Every space has an additive identity
4. **Additive inverses exist**: Every element has a negative

### Finite vs. Infinite Dimensional

- **Finite**: Can be described by finitely many basis vectors ($\mathbb{R}^n$, $\mathcal{P}_n$, matrices)
- **Infinite**: Requires infinitely many basis vectors (continuous functions, sequences)

### Why This Matters

Understanding that polynomials, functions, and matrices are vector spaces allows us to apply all linear algebra tools (basis, dimension, linear transformations) to these objects.

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/vector-space-gallery/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Identify six different examples of vector spaces
2. Recognize the zero vector in each vector space
3. Distinguish finite from infinite dimensional spaces
4. Verify that addition and scalar multiplication work in each space

### Suggested Activities

1. **Identification**: For each card, verify closure under addition using the hover examples
2. **Zero Vector**: Explain why each "zero" really acts as the additive identity
3. **Dimension Count**: For finite spaces, identify a basis and verify the dimension

### Discussion Questions

1. Why is $\mathcal{P}_2$ (polynomials of degree at most 2) three-dimensional, not two-dimensional?
2. Why can't we just count the number of functions to find the dimension of $C[a,b]$?
3. If $A$ is a $3 \times 3$ matrix with rank 2, what is the dimension of its null space?

## References

- Chapter 2: Vector Spaces and Subspaces
- [MIT 18.06 - Introduction to Vector Spaces](https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/)
