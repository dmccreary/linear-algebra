---
title: Rule of Sarrus Interactive Visualizer
description: Step-by-step animation showing how to compute 3×3 determinants using the Rule of Sarrus.
image: /sims/sarrus-rule/sarrus-rule.png
og:image: /sims/sarrus-rule/sarrus-rule.png
twitter:image: /sims/sarrus-rule/sarrus-rule.png
social:
   cards: false
---

# Rule of Sarrus Interactive Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Rule of Sarrus Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates the **Rule of Sarrus** for computing 3×3 determinants through step-by-step animation.

The method:

1. **Extend the matrix** by repeating the first two columns
2. **Add products** along the three downward diagonals (green)
3. **Subtract products** along the three upward diagonals (red)

!!! warning "Important"
    The Rule of Sarrus only works for 3×3 matrices. For larger matrices, use cofactor expansion.

## How to Use

1. **Step through**: Click "Step" to advance one diagonal at a time
2. **Auto-play**: Click "Play" to animate automatically
3. **Adjust speed**: Use the slider to control animation speed
4. **Try examples**: Select Identity, Rotation, or Singular matrix presets

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/sarrus-rule/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Apply the Rule of Sarrus to compute 3×3 determinants
2. Identify positive and negative diagonal products
3. Understand why this method only works for 3×3 matrices

### Suggested Activities

1. **Practice computation**: Step through each example and verify the calculation
2. **Compare methods**: Use Sarrus on a matrix, then verify using cofactor expansion
3. **Predict results**: Before stepping through, predict which diagonals will contribute most

### Assessment Questions

1. What is the determinant of the identity matrix? Why does this make sense geometrically?
2. The example matrix [[1,2,3],[4,5,6],[7,8,9]] has determinant 0. What does this tell you?
3. How many multiplications does Sarrus require compared to cofactor expansion?

## References

- Chapter 5: Determinants and Matrix Properties - The 3×3 Determinant section
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
