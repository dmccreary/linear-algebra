---
title: Lagrange Multiplier Geometry
description: Interactive visualization of the geometric interpretation of Lagrange multipliers
image: /sims/lagrange-multiplier-geometry/lagrange-multiplier-geometry.png
---

# Lagrange Multiplier Geometry

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Visualization Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates the **geometric interpretation of Lagrange multipliers**. The key insight is that at a constrained optimum, the gradient of the objective function must be parallel to the gradient of the constraint (the constraint normal).

### Problem Setup

- **Objective**: Maximize f(x,y) = x + 2y
- **Constraint**: x² + y² = 4 (circle of radius 2)

### How to Use

1. **Drag the Red Point**: Move it along the constraint circle
2. **Watch the Arrows**: Blue is ∇f (gradient of objective), Red is ∇h (constraint normal)
3. **Find Optimum**: Click the button to animate to the optimal point
4. **Toggle Fields**: Show gradient and normal fields to see the global picture

### Key Insight

At the **optimal point**:

$$\nabla f(\mathbf{x}^*) = \lambda \nabla h(\mathbf{x}^*)$$

The gradients are **parallel**! This means you cannot improve f while staying on the constraint surface.

### Understanding the Visualization

- **Gray Lines**: Level curves of f(x,y) = x + 2y (higher = upper-right)
- **Bold Circle**: The constraint h(x,y) = x² + y² - 4 = 0
- **Blue Arrow**: Direction of steepest increase of f (∇f)
- **Red Arrow**: Normal to the constraint (∇h)
- **Green Point**: At optimum, both gradients are parallel

## Lesson Plan

### Learning Objectives

- Understand the geometric meaning of Lagrange multipliers
- Visualize why gradients must be parallel at constrained optima
- Connect the algebraic condition ∇f = λ∇h to geometry

### Suggested Activities

1. **Exploration**: Drag the point around the entire circle and observe when gradients align
2. **Two Optima**: Notice there's both a maximum and minimum on the circle
3. **Field Visualization**: Enable gradient field to see why ∇f is constant for linear f
4. **Lambda Interpretation**: Watch how λ changes as you move the point

## References

- Boyd & Vandenberghe, *Convex Optimization*, Chapter 5
- [Wikipedia: Lagrange Multiplier](https://en.wikipedia.org/wiki/Lagrange_multiplier)
