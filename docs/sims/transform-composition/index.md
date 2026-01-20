---
title: Transformation Composition Visualizer
description: Demonstrate that the order of transformations matters by comparing T then S versus S then T side by side.
image: /sims/transform-composition/transform-composition.png
og:image: /sims/transform-composition/transform-composition.png
twitter:image: /sims/transform-composition/transform-composition.png
social:
   cards: false
---

# Transformation Composition Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Composition Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates one of the most important properties of matrix multiplication: **order matters**!

When composing two transformations T and S:

- **T then S** means apply T first, then S → Matrix product is **S·T**
- **S then T** means apply S first, then T → Matrix product is **T·S**

In general, S·T ≠ T·S (matrix multiplication is not commutative).

## How to Use

1. **Select transformation types** for T and S (rotation, scaling, or shear)
2. **Adjust parameters** using the sliders
3. **Compare the results**: Left shows T then S, right shows S then T
4. **Toggle "Show Steps"** to see intermediate states
5. **Click Animate** to watch the transformations apply sequentially

## When Do They Commute?

Some pairs of transformations give the same result regardless of order:

- Two rotations: R(α)·R(β) = R(β)·R(α) = R(α+β)
- Two uniform scalings: Same result either way
- Rotation by 180° and reflection

Try different combinations to discover which ones commute!

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/transform-composition/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Demonstrate that matrix multiplication order affects the result
2. Identify cases where transformations commute
3. Interpret matrix products as composed transformations

### Suggested Activities

1. **Compare orders**: Try rotation then scaling vs scaling then rotation
2. **Find commutative pairs**: Which transformation pairs give the same result?
3. **Predict results**: Given T and S, predict if TS = ST before checking

### Assessment Questions

1. If T is rotation by 90° and S is scaling by 2, is TS = ST?
2. When does rotation commute with shear?
3. Why does the order "T then S" correspond to the product S·T?

## References

- Chapter 4: Linear Transformations - Composition section
- [Matrix multiplication order](https://mathworld.wolfram.com/MatrixMultiplication.html)
