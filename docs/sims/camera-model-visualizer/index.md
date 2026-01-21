---
title: Camera Model Visualizer
description: Interactive demonstration of how camera parameters affect 3D-to-2D projection
image: /sims/camera-model-visualizer/camera-model-visualizer.png
quality_score: 90
---
# Camera Model Visualizer

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Camera Model Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Camera Model Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates the pinhole camera model and how intrinsic parameters affect 3D-to-2D projection. See the relationship between focal length, principal point, and the projected image.

## How to Use

1. **Adjust Focal Length**: Change the "zoom" - higher = narrower FOV
2. **Move Principal Point**: Shift the image center (Cx, Cy)
3. **Camera Distance**: Move the camera closer or farther
4. **Show Projection Rays**: Visualize rays from 3D points to camera
5. **Show Frustum**: See the camera's viewing volume
6. **Drag to Rotate**: Change the 3D view angle

## Key Concepts

Camera Intrinsic Matrix K:

$$\mathbf{K} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$$

Perspective projection formula:
$$u = f_x \cdot \frac{X}{Z} + c_x, \quad v = f_y \cdot \frac{Y}{Z} + c_y$$

| Parameter | Meaning | Typical Range |
|-----------|---------|---------------|
| f_x, f_y | Focal length (pixels) | 200-2000 |
| c_x | Principal point x | image_width/2 |
| c_y | Principal point y | image_height/2 |

## Learning Objectives

Students will be able to:
- Understand intrinsic and extrinsic camera parameters
- Apply the projection matrix to transform 3D points
- Relate focal length to field of view
- Visualize how camera position affects the image

## Lesson Plan

### Introduction (5 minutes)
The pinhole camera model is fundamental to computer vision. All 3D rays pass through a single point (the optical center).

### Exploration (10 minutes)
1. Start with default focal length - note the projected points
2. Increase focal length - objects appear larger (zoom in)
3. Move the principal point - image shifts
4. Toggle projection rays to see the geometry

### Key Insight
Depth information is lost in projection: all points along a ray project to the same 2D location.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Camera Matrix - Wikipedia](https://en.wikipedia.org/wiki/Camera_matrix)
