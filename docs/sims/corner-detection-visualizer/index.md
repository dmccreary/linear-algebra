---
title: Corner Detection Visualizer
description: Interactive Harris corner detection showing structure tensor eigenvalue analysis
image: /sims/corner-detection-visualizer/corner-detection-visualizer.png
quality_score: 90
---
# Corner Detection Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Corner Detection Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Corner Detection Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates Harris corner detection, which uses the eigenvalues of the structure tensor to identify corners - distinctive points useful for image matching and tracking.

## How to Use

1. **Select an Image Pattern**: Different shapes have different corner configurations

2. **Adjust k Parameter**: Controls the sensitivity of corner detection (0.04 is typical)

3. **Adjust Threshold**: Filter out weak corner responses

4. **Response Heatmap**: Toggle to see the Harris response across the image

## Key Concepts

| Eigenvalue Pattern | Structure | Classification |
|-------------------|-----------|----------------|
| Both λ₁, λ₂ small | Flat region | Not a feature |
| One λ large, one small | Edge | Not distinctive |
| Both λ₁, λ₂ large | Corner | Good feature! |

## Learning Objectives

Students will be able to:
- Understand the structure tensor as a covariance matrix of gradients
- Interpret eigenvalues as measures of gradient change in principal directions
- Apply the Harris corner response formula
- Evaluate corner detection quality using different thresholds

## The Mathematics

**Structure Tensor** (second moment matrix):

$$\mathbf{M} = \sum_{(x,y) \in W} \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix}$$

**Harris Response**:

$$R = \det(\mathbf{M}) - k \cdot \text{trace}(\mathbf{M})^2 = \lambda_1 \lambda_2 - k(\lambda_1 + \lambda_2)^2$$

## Lesson Plan

### Introduction (5 minutes)
Corners are distinctive image points useful for matching, tracking, and 3D reconstruction. Unlike edges, corners can be localized precisely in both directions.

### Eigenvalue Interpretation (10 minutes)
1. Start with Rectangle - see corners at the four vertices
2. Note how edge pixels have different eigenvalue patterns
3. Observe the eigenvalue scatter plot (if visible)

### Parameter Exploration (10 minutes)
1. Vary k parameter - higher k = fewer corners
2. Adjust threshold to control false positives
3. Compare Checkerboard vs L-Shape corner counts

### Discussion Questions
- Why does the checkerboard have so many corners?
- Why can't edges be used as reliable matching features?
- How would you make corners scale-invariant?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Harris Corner Detector - Wikipedia](https://en.wikipedia.org/wiki/Harris_corner_detector)
