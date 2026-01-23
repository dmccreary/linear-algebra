---
title: Singular vs Non-Singular Matrix Visualizer
description: Visualize the geometric difference between singular and non-singular matrices through transformation animation.
image: /sims/singular-matrix/singular-matrix.png
og:image: /sims/singular-matrix/singular-matrix.png
twitter:image: /sims/singular-matrix/singular-matrix.png
social:
   cards: false
---

# Singular vs Non-Singular Matrix Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Singular Matrix Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization shows the fundamental geometric difference between **singular** and **non-singular** matrices.

**Key Insights:**

- **Non-singular** (det ≠ 0): Transformation is reversible, area preserved (scaled)
- **Singular** (det = 0): Transformation collapses dimension, not reversible

Watch how the unit square transforms:

- **Green**: Non-singular, positive determinant (orientation preserved)
- **Purple**: Non-singular, negative determinant (orientation flipped)
- **Red line**: Singular - the square collapses to a line!

## How to Use

1. **Click preset buttons**: Singular, Non-singular, or Random matrix
2. **Use morph slider**: Smoothly animate from identity to target matrix
3. **Toggle grid**: Show/hide the transformed coordinate grid
4. **Watch the collapse**: See how singular matrices flatten the plane

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/singular-matrix/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Recognize singular matrices visually and algebraically
2. Explain why singular matrices are not invertible
3. Connect det = 0 to dimension collapse

### Suggested Activities

1. **Morph slowly**: Watch the exact moment area becomes zero
2. **Column relationship**: When singular, what's the relationship between columns?
3. **Predict singularity**: Before clicking, guess if a random matrix will be singular

### Assessment Questions

1. Why can't you "undo" a singular transformation?
2. What happens to a circle under a singular transformation?
3. If two columns are parallel, what is the determinant? Why?

## References

- Chapter 5: Determinants and Matrix Properties - Singular Matrices section
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
