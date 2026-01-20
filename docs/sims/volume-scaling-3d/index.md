---
title: 3D Volume Scaling Interactive Visualizer
description: Visualize how 3×3 matrix transformations scale 3D volumes, connecting the determinant to geometric volume change.
image: /sims/volume-scaling-3d/volume-scaling-3d.png
og:image: /sims/volume-scaling-3d/volume-scaling-3d.png
twitter:image: /sims/volume-scaling-3d/volume-scaling-3d.png
social:
   cards: false
---

# 3D Volume Scaling Interactive Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the 3D Volume Scaling Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This 3D visualization extends the concept of signed area to **signed volume** in three dimensions.

**Key Concepts:**

- The determinant of a 3×3 matrix equals the signed volume of the parallelepiped formed by its column vectors
- $|\det(A)|$ = volume scaling factor
- $\det(A) > 0$: orientation preserved (green)
- $\det(A) < 0$: orientation reversed (red)
- $\det(A) = 0$: volume collapses (singular)

## How to Use

1. **Click preset buttons**: Scaling, Rotation, or Singular matrix
2. **Drag to rotate**: Click and drag in the 3D view to rotate camera
3. **Use morph slider**: Animate from identity to target matrix
4. **Toggle unit cube**: Show/hide the reference unit cube

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/volume-scaling-3d/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Visualize the determinant as a volume scaling factor in 3D
2. Distinguish between orientation-preserving and orientation-reversing transformations
3. Recognize when a 3D transformation is singular

### Suggested Activities

1. **Compare 2D and 3D**: How does area scaling in 2D relate to volume scaling in 3D?
2. **Rotation exploration**: Why do rotation matrices have det = 1?
3. **Singular detection**: What happens to the parallelepiped when columns become coplanar?

### Assessment Questions

1. If det(A) = 8, how does a 1-cubic-unit region transform?
2. What is the determinant of a 90° rotation matrix in 3D?
3. Why does a scaling matrix [[2,0,0],[0,3,0],[0,0,4]] have det = 24?

## References

- Chapter 5: Determinants and Matrix Properties - Volume Scaling section
- [Linear Algebra Learning Graph](/learning-graph/)
