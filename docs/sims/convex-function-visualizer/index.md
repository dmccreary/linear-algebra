---
title: Convex Function Visualizer
description: Interactive visualization demonstrating the geometric definition of convexity through the chord condition
image: /sims/convex-function-visualizer/convex-function-visualizer.png
---

# Convex Function Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Convex Function Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization demonstrates the **geometric definition of convexity** - a fundamental concept in optimization and machine learning. A function is convex if any chord (line segment) connecting two points on the curve lies above or on the curve itself.

### How to Use

1. **Select a Function**: Use the dropdown to choose different functions including convex (x², |x|, x⁴) and non-convex (-x²)
2. **Drag the Points**: Click and drag the red (point 1) and green (point 2) markers to move them along the curve
3. **Adjust Lambda**: Use the slider to move the interpolation point along the chord (λ=0 is at point 2, λ=1 is at point 1)
4. **Observe**: Watch how the shaded region changes - green indicates convexity is satisfied, red indicates violation

### The Convexity Condition

For a function f(x) to be convex:

$$f(\lambda x_1 + (1-\lambda) x_2) \leq \lambda f(x_1) + (1-\lambda) f(x_2)$$

This means the value of f at any point between x₁ and x₂ must be at or below the chord connecting (x₁, f(x₁)) and (x₂, f(x₂)).

## Lesson Plan

### Learning Objectives

- Understand the geometric definition of convex functions
- Visualize why convex functions have no local minima (only global)
- Recognize convex vs non-convex functions visually

### Suggested Activities

1. **Exploration**: Start with x² and verify the convexity condition holds for any position of the two points
2. **Contrast**: Switch to -x² and observe how the condition is violated
3. **Edge Cases**: Try x² + sin(x) which is still convex despite the oscillation
4. **Discussion**: Why does convexity matter for optimization algorithms?

## References

- Boyd & Vandenberghe, *Convex Optimization*, Chapter 3
- [Wikipedia: Convex Function](https://en.wikipedia.org/wiki/Convex_function)
