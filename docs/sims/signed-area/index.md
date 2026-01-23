---
title: Signed Area Interactive Visualizer
description: Visualize the signed area of a parallelogram formed by two vectors, showing how orientation affects the sign of the determinant.
image: /sims/signed-area/signed-area.png
og:image: /sims/signed-area/signed-area.png
twitter:image: /sims/signed-area/signed-area.png
social:
   cards: false
---

# Signed Area Interactive Visualizer

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Signed Area Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates the geometric meaning of the 2×2 determinant as the **signed area** of the parallelogram formed by two vectors.

Key concepts illustrated:

- **Positive area**: When vector v is counterclockwise from vector u
- **Negative area**: When vector v is clockwise from vector u
- **Zero area**: When vectors are parallel (collinear)

The formula shown is: Area = ad - bc, where u = (a, c) and v = (b, d).

## How to Use

1. **Drag the vector endpoints** (red for u, blue for v) to change the vectors
2. **Observe the signed area** value update in real-time
3. **Watch the color change**: green for positive, red for negative, gray for zero
4. **Toggle options**: Show/hide the parallelogram and formula display

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/signed-area/main.html" height="452px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Interpret the determinant geometrically as signed area
2. Explain how vector orientation affects the sign
3. Predict when the determinant equals zero

### Suggested Activities

1. **Predict the sign**: Before dragging, predict whether the area will be positive or negative
2. **Find zero area**: Move vectors to make the area exactly zero - what do you notice?
3. **Maximize area**: For vectors of fixed length, what orientation maximizes area?

### Assessment Questions

1. If u = (3, 0) and v = (0, 2), what is the signed area? Is it positive or negative?
2. What happens to the signed area if you swap the two vectors?
3. Why does the signed area equal zero when vectors are parallel?

## References

- Chapter 5: Determinants and Matrix Properties - Geometric Motivation section
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
