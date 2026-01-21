---
title: Euler Angles Visualizer
description: Interactive demonstration of how Euler angles compose to form 3D rotations
image: /sims/euler-angles-visualizer/euler-angles-visualizer.png
quality_score: 85
---
# Euler Angles Visualizer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Euler Angles Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Euler Angles Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates how Euler angles work to represent 3D rotations. See how yaw, pitch, and roll combine to orient an object in space, and observe the gimbal lock problem as pitch approaches ±90°.

## How to Use

1. **Adjust Yaw (ψ)**: Rotate about the Z axis (-180° to 180°)
2. **Adjust Pitch (θ)**: Rotate about the Y axis (-90° to 90°)
3. **Adjust Roll (φ)**: Rotate about the X axis (-180° to 180°)
4. **Select Convention**: Choose ZYX, XYZ, or ZXZ rotation order
5. **Animate Sequence**: Watch each rotation applied step by step
6. **Drag to Rotate**: Click and drag to change the view angle

## Key Concepts

| Euler Angle | Axis | Range | Aviation Term |
|-------------|------|-------|---------------|
| Yaw (ψ) | Z | -180° to 180° | Heading |
| Pitch (θ) | Y | -90° to 90° | Attitude |
| Roll (φ) | X | -180° to 180° | Bank |

## Learning Objectives

Students will be able to:
- Understand how three sequential rotations define any 3D orientation
- Apply the correct rotation order for different conventions
- Recognize the signs of approaching gimbal lock
- Compute the rotation matrix from Euler angles

## Lesson Plan

### Introduction (5 minutes)
Euler angles are intuitive for human understanding but have mathematical limitations. They're widely used in aviation, robotics, and animation.

### Exploration (10 minutes)
1. Set all angles to zero, then increase yaw - observe rotation about Z
2. Add pitch - notice how the rotation axis changes
3. Finally add roll - see the complete orientation
4. Use "Animate Sequence" to watch rotations applied in order

### Gimbal Lock Demonstration (5 minutes)
1. Set pitch to 85°
2. Notice the warning indicator
3. Try adjusting yaw and roll - observe reduced control

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Euler Angles - Wikipedia](https://en.wikipedia.org/wiki/Euler_angles)
