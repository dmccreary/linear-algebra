---
title: Determinant Properties Explorer
description: Interactive exploration of how row operations affect determinant values.
image: /sims/det-properties/det-properties.png
og:image: /sims/det-properties/det-properties.png
twitter:image: /sims/det-properties/det-properties.png
social:
   cards: false
---

# Determinant Properties Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Determinant Properties Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This explorer helps you understand how different operations affect the determinant of a matrix.

**Key Properties:**

| Operation | Effect on Determinant |
|-----------|----------------------|
| Swap rows | $\det(A') = -\det(A)$ |
| Scale row by k | $\det(A') = k \cdot \det(A)$ |
| Add multiple of one row to another | $\det(A') = \det(A)$ (unchanged) |
| Transpose | $\det(A^T) = \det(A)$ (unchanged) |

## How to Use

1. **Click operation buttons** to apply different transformations
2. **Adjust k slider** to change the scaling/addition factor
3. **Compare matrices** - see original (left) and modified (right)
4. **Watch parallelogram area** change in the geometric view
5. **Click Reset** to restore the original matrix

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/det-properties/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Predict how row operations change the determinant
2. Explain why adding row multiples preserves the determinant
3. Connect algebraic properties to geometric area changes

### Suggested Activities

1. **Verify properties**: Apply each operation and check the relationship holds
2. **Chain operations**: What happens if you swap, then scale, then swap back?
3. **Find invariants**: Which operations preserve |det|?

### Assessment Questions

1. If det(A) = 6, what is det(A) after scaling row 1 by 3?
2. You perform 5 row swaps. Is det(A') positive or negative if det(A) > 0?
3. Why doesn't adding row multiples change the determinant geometrically?

## References

- Chapter 5: Determinants and Matrix Properties - Properties of Determinants section
- [Linear Algebra Learning Graph](/learning-graph/)
