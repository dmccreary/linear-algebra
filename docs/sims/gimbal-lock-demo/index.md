---
title: Gimbal Lock Demonstration
description: Interactive demonstration of gimbal lock using a physical gimbal mechanism
image: /sims/gimbal-lock-demo/gimbal-lock-demo.png
quality_score: 88
---
# Gimbal Lock Demonstration

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Gimbal Lock Demo Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Gimbal Lock Demo with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates gimbal lock using a physical gimbal mechanism with three nested rings. Experience firsthand how the system loses a degree of freedom when the middle ring (pitch) reaches ±90°.

## How to Use

1. **Adjust Outer Ring (Yaw)**: Red ring rotates about vertical axis
2. **Adjust Middle Ring (Pitch)**: Green ring rotates about horizontal axis
3. **Adjust Inner Ring (Roll)**: Blue ring rotates about the pointing axis
4. **Go to Gimbal Lock**: Click to set pitch to 90° instantly
5. **Observe the Effect**: At gimbal lock, yaw and roll control the same motion

## Key Concepts

| Pitch Angle | Degrees of Freedom | Status |
|-------------|-------------------|--------|
| 0° to 79° | 3 | Normal operation |
| 80° to 88° | 3 | Warning zone |
| 89° to 90° | 2 | Gimbal lock! |

## Learning Objectives

Students will be able to:
- Visualize how gimbal lock occurs physically
- Understand why two axes align at the singularity
- Experience the loss of controllability at gimbal lock
- Recognize why quaternions were developed as an alternative

## Lesson Plan

### Introduction (5 minutes)
Gimbal lock is not a bug—it's a fundamental property of using three sequential rotations. Any Euler angle representation has this singularity.

### Exploration (10 minutes)
1. Start with all angles at zero
2. Slowly increase pitch while adjusting yaw and roll
3. Notice how the red and blue rings approach alignment
4. At 90° pitch, try changing both yaw and roll—they produce the same motion!

### Historical Context
Apollo 11's guidance system nearly experienced gimbal lock. The astronauts received "gimbal lock" warnings when the lunar module's orientation approached the singularity.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Gimbal Lock - Wikipedia](https://en.wikipedia.org/wiki/Gimbal_lock)
