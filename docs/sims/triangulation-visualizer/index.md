---
title: Triangulation Visualizer
description: Interactive demonstration of 3D point recovery from stereo correspondences
image: /sims/triangulation-visualizer/triangulation-visualizer.png
quality_score: 88
---
# Triangulation Visualizer

<iframe src="main.html" height="632px" width="100%" scrolling="no"></iframe>

[Run the Triangulation Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Triangulation Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates triangulation - the process of recovering 3D points from stereo correspondences. See how observation noise affects 3D reconstruction accuracy.

## How to Use

1. **Adjust Baseline**: Change the stereo camera separation
2. **Add Noise**: Introduce measurement noise to observe error effects
3. **Drag Left Point**: Manually adjust the left image observation
4. **Compare**: See true point (green) vs triangulated point (red)
5. **Drag to Rotate**: Change the 3D view angle

## Key Concepts

**Triangulation** finds the 3D point P where rays from two cameras intersect.

Given:
- Camera matrices P_L, P_R
- Corresponding image points p_L, p_R

Solve: Find P such that p_L ~ P_L · P and p_R ~ P_R · P

| Method | Accuracy | Speed |
|--------|----------|-------|
| Mid-point | Moderate | Fast |
| Linear (DLT) | Good | Fast |
| Optimal | Best | Iterative |

## Learning Objectives

Students will be able to:
- Understand how triangulation recovers 3D structure
- Observe the effect of noise on reconstruction accuracy
- Relate baseline to depth precision
- Apply linear algebra to solve the triangulation problem

## Lesson Plan

### Introduction (5 minutes)
Triangulation is the core algorithm for 3D reconstruction from stereo. Given known camera geometry and corresponding points, we can recover depth.

### Exploration (10 minutes)
1. Start with zero noise - observe perfect reconstruction
2. Add noise - see how the triangulated point deviates
3. Increase baseline - observe improved depth precision
4. Manually drag the left point to simulate matching errors

### Key Insight
Longer baseline improves depth precision (reduces the uncertainty cone) but makes finding correspondences harder.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Triangulation - Wikipedia](https://en.wikipedia.org/wiki/Triangulation_(computer_vision))
