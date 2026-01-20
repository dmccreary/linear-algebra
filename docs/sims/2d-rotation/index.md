---
title: 2D Rotation Matrix Visualizer
description: Interactive visualization of 2D rotation matrices showing the relationship between rotation angle and cos/sin matrix entries.
image: /sims/2d-rotation/2d-rotation.png
og:image: /sims/2d-rotation/2d-rotation.png
twitter:image: /sims/2d-rotation/2d-rotation.png
social:
   cards: false
---

# 2D Rotation Matrix Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the 2D Rotation Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates 2D rotation matrices and their properties:

- **Rotation matrix structure**: R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]]
- **Orthogonality**: The transpose equals the inverse (R⁻¹ = Rᵀ)
- **Determinant = 1**: Rotations preserve area and orientation
- **Basis vector transformation**: Watch how e₁ and e₂ rotate together

## How to Use

1. **Drag the angle slider** to rotate shapes from -360° to 360°
2. **Select different shapes** to see how rotation affects various geometries
3. **Click Animate** to watch continuous rotation
4. **Toggle checkboxes** to show/hide the unit circle and angle arc
5. **Observe the matrix panel** to see how cos(θ) and sin(θ) values change

## Key Observations

- At 0°: Matrix is identity [[1,0],[0,1]]
- At 90°: Matrix is [[0,-1],[1,0]]
- At 180°: Matrix is [[-1,0],[0,-1]]
- At 270°: Matrix is [[0,1],[-1,0]]

## Embedding

You can include this MicroSim on your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/2d-rotation/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Calculate cos(θ) and sin(θ) values for common angles
2. Write the 2D rotation matrix for any given angle
3. Verify that rotation matrices preserve lengths and angles

### Suggested Activities

1. **Verify orthogonality**: Compute R(θ)·R(θ)ᵀ and verify it equals I
2. **Composition**: Set angle to 30°, note the matrix, then 60°. What's R(30°)·R(30°)?
3. **F-Shape orientation**: Use F-shape to verify counterclockwise rotation direction

## References

- Chapter 4: Linear Transformations - 2D Rotation section
- [Rotation matrix on Wikipedia](https://en.wikipedia.org/wiki/Rotation_matrix)
