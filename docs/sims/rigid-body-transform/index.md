---
title: Rigid Body Transform Chain
description: Interactive visualization of rigid body transform composition in a robot arm kinematic chain
image: /sims/rigid-body-transform/rigid-body-transform.png
quality_score: 88
---
# Rigid Body Transform Chain

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Rigid Body Transform Chain Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Rigid Body Transform Chain with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates how rigid body transforms compose in a kinematic chain, like a robot arm. See how each joint's rotation and link's translation combine to position the end effector.

## How to Use

1. **Adjust Joint Angles**: Use sliders to rotate each joint
2. **Show Coordinate Frames**: Toggle to see local coordinate systems
3. **Show Transforms**: View the transform composition
4. **Drag to Rotate**: Change the 3D view angle
5. **Track End Effector**: Watch the computed position update

## Key Concepts

Each transform in SE(3) combines rotation R and translation t:

$$\mathbf{T} = \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$$

Transform composition: **T_total = T₁ · T₂ · T₃**

| Joint | Rotation Axis | Link Length |
|-------|---------------|-------------|
| 1 (Base) | Y (yaw) | 120 |
| 2 (Shoulder) | X (pitch) | 100 |
| 3 (Elbow) | X (pitch) | 80 |

## Learning Objectives

Students will be able to:
- Understand SE(3) rigid body transforms
- Compose multiple transforms via matrix multiplication
- Compute forward kinematics for serial chains
- Visualize how local transforms affect global position

## Lesson Plan

### Introduction (5 minutes)
Robot arms use chains of transforms where each joint adds rotation and each link adds translation. The composition order matters!

### Exploration (10 minutes)
1. Start with all joints at zero
2. Rotate joint 1 - notice the entire arm rotates
3. Rotate joint 2 - only links 2 and 3 move
4. Observe how the end effector position updates

### Forward Kinematics
The end effector position is computed by multiplying all transform matrices from base to tip. This is called forward kinematics.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [SE(3) - Wikipedia](https://en.wikipedia.org/wiki/Euclidean_group)
