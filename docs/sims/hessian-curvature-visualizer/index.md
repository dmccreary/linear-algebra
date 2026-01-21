---
title: Hessian and Curvature Visualizer
description: 3D visualization connecting Hessian eigenvalues to geometric curvature of functions
image: /sims/hessian-curvature-visualizer/hessian-curvature-visualizer.png
---

# Hessian and Curvature Visualizer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Hessian Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This 3D visualization demonstrates the connection between the **Hessian matrix eigenvalues** and the **geometric curvature** of a function surface. The Hessian is a matrix of second partial derivatives that captures how a function curves in different directions.

### How to Use

1. **Select a Function**: Choose from bowl-shaped (minimum), saddle, or elongated surfaces
2. **Rotate View**: Click and drag to rotate the 3D view
3. **Zoom**: Use mouse scroll wheel to zoom in/out
4. **Move Point**: Use arrow keys to move the analysis point
5. **Toggle Options**: Show/hide principal curvature directions and quadratic approximation

### Understanding the Display

- **Surface**: The colored 3D surface of f(x,y)
- **Contour Lines**: Level curves on the base plane
- **Red Sphere**: Current point on the surface
- **Green Arrows**: Principal directions with positive eigenvalues (curving up)
- **Red Arrows**: Principal directions with negative eigenvalues (curving down)
- **Info Panel**: Shows eigenvalues and point classification

### Eigenvalue Interpretation

| Eigenvalue Pattern | Curvature Type | Optimization |
|-------------------|----------------|--------------|
| Both positive (λ₁, λ₂ > 0) | Bowl (minimum) | Local minimum |
| Both negative (λ₁, λ₂ < 0) | Dome (maximum) | Local maximum |
| Mixed signs | Saddle point | Neither |

## Lesson Plan

### Learning Objectives

- Connect Hessian eigenvalues to geometric curvature
- Identify minima, maxima, and saddle points from eigenvalue signs
- Visualize how curvature varies with direction

### Suggested Activities

1. **Bowl Functions**: Start with x²+y² and observe both positive eigenvalues
2. **Saddle Point**: Switch to x²-y² and see how mixed eigenvalues create a saddle
3. **Elongation**: Compare x²+0.1y² to see how different eigenvalue magnitudes affect shape
4. **Approximation**: Enable "Show Quadratic Approx" to see how the Hessian provides a local approximation

## References

- Boyd & Vandenberghe, *Convex Optimization*, Chapter 3
- [Wikipedia: Hessian Matrix](https://en.wikipedia.org/wiki/Hessian_matrix)
