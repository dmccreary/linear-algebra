---
title: Newton vs Gradient Descent
description: Interactive comparison of gradient descent and Newton's method convergence on ill-conditioned problems
image: /sims/newton-vs-gradient-descent/newton-vs-gradient-descent.png
---

# Newton vs Gradient Descent Comparison

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Comparison Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization compares the convergence behavior of **Gradient Descent** (blue) and **Newton's Method** (orange) on quadratic functions with varying condition numbers. The condition number controls how "elongated" the contour ellipses are.

### How to Use

1. **Adjust Condition Number**: Use the slider to change from 1 (circular contours) to 100 (highly elongated)
2. **Adjust Learning Rate**: Control the step size for gradient descent
3. **Step/Run**: Execute optimization steps manually or automatically
4. **Click**: Click anywhere on the plot to set a new starting point
5. **Reset**: Return to initial state

### Key Observations

- **Newton's Method** converges in exactly **1 step** for quadratic functions regardless of condition number
- **Gradient Descent** shows characteristic **zig-zag oscillation** on ill-conditioned problems
- Higher condition numbers require smaller learning rates for gradient descent stability
- Newton's method is condition-number invariant

### Why Newton Converges Faster

Newton's method uses the inverse Hessian to rescale the gradient:

$$\mathbf{x}_{k+1} = \mathbf{x}_k - \mathbf{H}^{-1} \nabla f(\mathbf{x}_k)$$

This effectively transforms the problem into one with circular contours, eliminating the zig-zag behavior of gradient descent on elongated landscapes.

## Lesson Plan

### Learning Objectives

- Compare convergence rates of first and second-order methods
- Understand the impact of condition number on optimization
- Visualize why Newton's method is condition-number invariant

### Suggested Activities

1. **Low Condition Number**: Set condition number to 1 and observe both methods
2. **High Condition Number**: Increase to 50-100 and watch gradient descent struggle
3. **Learning Rate Tuning**: Find the largest stable learning rate for each condition number
4. **Iteration Counting**: Compare how many iterations each method needs

## References

- Boyd & Vandenberghe, *Convex Optimization*, Chapter 9
- [Wikipedia: Newton's Method in Optimization](https://en.wikipedia.org/wiki/Newton%27s_method_in_optimization)
