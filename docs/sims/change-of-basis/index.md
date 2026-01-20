---
title: Change of Basis Interactive Visualizer
description: Visualize how the same vector has different coordinate representations in different bases, with transition matrix display.
image: /sims/change-of-basis/change-of-basis.png
og:image: /sims/change-of-basis/change-of-basis.png
twitter:image: /sims/change-of-basis/change-of-basis.png
social:
   cards: false
---

# Change of Basis Interactive Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Change of Basis Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates a fundamental concept: **the same vector has different coordinate representations in different bases**.

Key ideas:

- The **vector itself** (green arrow) doesn't change—it's the same geometric object
- Only its **coordinate representation** changes based on which basis we use
- The **transition matrix** P⁻¹ converts coordinates: [v]_B = P⁻¹[v]_std

## How to Use

1. **Drag the vector v** (green) to see how its coordinates change in both bases
2. **Select a preset basis** (Rotated, Skewed, Scaled) or use Custom
3. **Adjust the rotation slider** to rotate the custom basis
4. **Toggle "Overlay Bases"** to see both coordinate systems on one grid
5. **Toggle "Show Grids"** to see the coordinate grid lines

## Key Observations

- The vector arrow stays in the same position regardless of basis choice
- In a rotated basis, the coordinates reflect the new orientation
- The transition matrix P⁻¹ relates the two coordinate systems

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/change-of-basis/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Explain why coordinate representations depend on basis choice
2. Calculate coordinates in a new basis using the transition matrix
3. Distinguish between a vector and its coordinate representation

### Suggested Activities

1. **Predict coordinates**: Before dragging, predict what [v]_B will be
2. **Verify transition**: Check that P⁻¹[v]_std = [v]_B
3. **Special vectors**: Find vectors that have the same coordinates in both bases

### Assessment Questions

1. If the basis is rotated 90°, how do the coordinates of (1, 0) change?
2. What properties do similar matrices share?
3. Why is change of basis useful in linear algebra?

## References

- Chapter 4: Linear Transformations - Change of Basis section
- Similar matrices and diagonalization
