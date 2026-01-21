---
title: Camera Calibration Visualizer
description: Interactive demonstration of camera calibration, lens distortion, and distortion correction
image: /sims/camera-calibration/camera-calibration.png
quality_score: 85
---

# Camera Calibration Visualizer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Camera Calibration Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Camera Calibration Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **camera calibration** - the process of determining camera intrinsic parameters (focal length, principal point, distortion coefficients) needed for accurate computer vision and autonomous systems.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/camera-calibration/main.html"
        height="602px" width="100%" scrolling="no"></iframe>
```

## Features

- **Distortion Simulation**: Adjust k1 and k2 to see barrel (k1 < 0) and pincushion (k1 > 0) distortion
- **Side-by-Side Comparison**: Distorted image on left, ideal/corrected image on right
- **Corner Detection**: See detected checkerboard corners as green markers
- **Reprojection Error**: After calibration, red vectors show residual errors
- **Interactive Calibration**: Click "Calibrate" to compute and store distortion parameters

## Key Concepts

### Camera Matrix (Intrinsics)

The intrinsic calibration matrix **K** relates 3D points to 2D image pixels:

$$\mathbf{K} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$$

Where:
- $f_x, f_y$ are focal lengths in pixels
- $c_x, c_y$ is the principal point (image center)

### Radial Distortion

Real camera lenses introduce radial distortion, modeled as:

$$x_d = x_n(1 + k_1 r^2 + k_2 r^4)$$
$$y_d = y_n(1 + k_1 r^2 + k_2 r^4)$$

Where:
- **k1 < 0**: Barrel distortion (lines curve outward)
- **k1 > 0**: Pincushion distortion (lines curve inward)
- **k2**: Higher-order distortion correction

### Checkerboard Calibration

The standard calibration process:
1. Capture images of a checkerboard pattern at various poses
2. Detect corner points in each image
3. Solve for camera parameters that minimize reprojection error
4. Use calibrated parameters to undistort new images

## Lesson Plan

### Learning Objectives
- Understand the camera intrinsic matrix and its parameters
- Recognize barrel and pincushion distortion effects
- Apply the calibration process to correct lens distortion

### Activities
1. **Explore Distortion**: Move k1 slider to see barrel vs pincushion distortion
2. **Calibrate**: Apply some distortion, click Calibrate, then observe the corrected view
3. **Reprojection Error**: Toggle "Show Errors" to see calibration accuracy
4. **Focal Length Effect**: Adjust focal length to see how it affects distortion appearance

### Assessment Questions
1. What type of distortion does a negative k1 value produce?
2. Why is a checkerboard pattern commonly used for calibration?
3. How does reprojection error measure calibration quality?

## References

- [OpenCV Camera Calibration Tutorial](https://docs.opencv.org/master/dc/dbb/tutorial_py_calibration.html)
- [Zhang's Camera Calibration Method](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/)
- Chapter 15: Autonomous Systems and Sensor Fusion
