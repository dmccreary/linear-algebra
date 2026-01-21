---
title: Epipolar Geometry Visualizer
description: Interactive demonstration of epipolar constraints in stereo vision
image: /sims/epipolar-geometry/epipolar-geometry.png
quality_score: 88
---
# Epipolar Geometry Visualizer

<iframe src="main.html" height="682px" width="100%" scrolling="no"></iframe>

[Run the Epipolar Geometry Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Epipolar Geometry Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates epipolar geometry in stereo vision. See how the epipolar constraint restricts correspondence search to a line, and understand the relationship between disparity and depth.

## How to Use

1. **Adjust Baseline**: Change the distance between cameras
2. **Move Point**: Adjust the 3D point's X and Z position
3. **Show Epipolar Plane**: Visualize the plane through cameras and point
4. **Show Multiple Lines**: See the pattern of epipolar lines
5. **Drag to Rotate**: Change the 3D view angle

## Key Concepts

**Epipolar Constraint**: For corresponding points p and p':
$$\mathbf{p'}^T \mathbf{F} \mathbf{p} = 0$$

**Depth from Disparity** (rectified stereo):
$$Z = \frac{f \cdot b}{d}$$

| Term | Symbol | Meaning |
|------|--------|---------|
| Baseline | b | Distance between camera centers |
| Disparity | d | Horizontal shift between corresponding points |
| Epipole | e | Where baseline intersects image plane |
| Epipolar line | l | Line where epipolar plane intersects image |

## Learning Objectives

Students will be able to:
- Understand the epipolar constraint and its geometric meaning
- Relate disparity to depth in stereo vision
- Identify epipoles and epipolar lines
- Apply the fundamental matrix concept

## Lesson Plan

### Introduction (5 minutes)
Epipolar geometry constrains where corresponding points can appear. Instead of searching the entire image, we only search along a line.

### Exploration (10 minutes)
1. Move the 3D point and observe how projected points move
2. Note that both points stay on the green epipolar line
3. Increase baseline - disparity increases, depth estimation improves
4. Move point closer (decrease Z) - disparity increases

### Key Insight
Larger baseline improves depth resolution but makes stereo matching harder due to increased appearance change.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Epipolar Geometry - Wikipedia](https://en.wikipedia.org/wiki/Epipolar_geometry)
