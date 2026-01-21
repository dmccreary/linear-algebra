---
title: Homography Transformation Demo
description: Interactive demonstration of perspective transformations using homography matrices
image: /sims/homography-demo/homography-demo.png
quality_score: 90
---
# Homography Transformation Demo

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Homography Transformation Demo Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Homography Transformation Demo with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates homography transformations - projective mappings between planes. Drag the corner points to see how a 3×3 matrix can create perspective effects.

## How to Use

1. **Select a Preset**: Try Identity, Perspective, Rotation, or Shear transformations

2. **Drag Corners**: Click and drag the red corner points to create custom transformations

3. **Toggle Grid**: Show/hide the transformation grid to see how lines map

4. **View Matrix**: See the computed homography matrix and its interpretation

## Key Concepts

| Transformation | DOF | Preserves | Matrix Structure |
|----------------|-----|-----------|------------------|
| Translation | 2 | Everything | [I \| t] |
| Euclidean | 3 | Distances | [R \| t] |
| Affine | 6 | Parallelism | [A \| t] |
| Projective | 8 | Straight lines | Full 3×3 |

## Learning Objectives

Students will be able to:
- Understand homographies as mappings between projective planes
- Apply the 3×3 homography matrix to transform points
- Recognize the hierarchy of 2D transformations
- Use homographies for perspective correction applications

## The Mathematics

**Homography Equation** (homogeneous coordinates):

$$\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} \sim \mathbf{H} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

**Cartesian Coordinates**:

$$x' = \frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}}$$

$$y' = \frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}$$

## Lesson Plan

### Introduction (5 minutes)
Homographies model the mapping when a camera views a planar surface from different angles. Unlike affine transformations, they can make parallel lines converge.

### Exploration (10 minutes)
1. Start with Identity - source equals destination
2. Try Perspective - observe converging lines (railroad tracks effect)
3. Use Rotation - note that angles are preserved
4. Test Shear - parallel lines remain parallel (affine subset)

### Interactive Exercise (10 minutes)
1. Drag corners to simulate "looking at a sign from an angle"
2. Try to make a trapezoid into a rectangle (perspective correction)
3. Observe the matrix values as you drag

### Discussion Questions
- Why does a homography have 8 DOF, not 9?
- What real-world situations create homography relationships?
- How would you correct a photo of a tilted document?

## Applications

- **Panorama Stitching**: Align overlapping photos
- **Document Scanning**: Straighten tilted captures
- **Augmented Reality**: Place virtual objects on surfaces
- **Sports Graphics**: Insert ads on playing fields

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Homography - Wikipedia](https://en.wikipedia.org/wiki/Homography)
