---
title: Quaternion Rotation Visualizer
description: Interactive demonstration of quaternion rotation representation and operations
image: /sims/quaternion-rotation/quaternion-rotation.png
quality_score: 88
---
# Quaternion Rotation Visualizer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Quaternion Rotation Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Quaternion Rotation Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates quaternion rotation representation. Define a rotation axis and angle, see the quaternion components, apply rotations, and compose multiple rotations without gimbal lock.

## How to Use

1. **Set Rotation Axis**: Adjust X, Y, Z sliders to define the rotation axis
2. **Set Angle**: Choose the rotation angle (0° to 360°)
3. **Apply Rotation**: Set the object to this orientation
4. **Compose**: Multiply this rotation with the current orientation
5. **Show Euler Angles**: Toggle to see equivalent Euler angles
6. **Drag to Rotate**: Change the view angle

## Key Concepts

The quaternion formula for rotation by angle θ about unit axis **n̂**:

$$\mathbf{q} = \left(\cos\frac{\theta}{2}, \sin\frac{\theta}{2} \cdot n_x, \sin\frac{\theta}{2} \cdot n_y, \sin\frac{\theta}{2} \cdot n_z\right)$$

| Component | Symbol | Range |
|-----------|--------|-------|
| Scalar | w | -1 to 1 |
| Vector | (x, y, z) | unit sphere |

## Learning Objectives

Students will be able to:
- Convert between axis-angle and quaternion representations
- Apply quaternion rotation formula q·p·q*
- Compose rotations using quaternion multiplication
- Compare quaternion and Euler angle representations

## Lesson Plan

### Introduction (5 minutes)
Quaternions extend complex numbers to 4D and provide a singularity-free rotation representation.

### Exploration (15 minutes)
1. Set axis to (0, 1, 0) and angle to 90° - observe the quaternion
2. Apply the rotation and see the object orient
3. Compose multiple rotations without gimbal lock
4. Compare with equivalent Euler angles

### Key Insight
Notice the half-angle in the quaternion: 90° rotation uses 45° in the formula because the q·p·q* operation effectively applies the rotation twice.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Quaternions - Wikipedia](https://en.wikipedia.org/wiki/Quaternion)
