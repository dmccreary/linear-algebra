---
title: Edge Detection Visualizer
description: Interactive visualization of Sobel operators showing Gx, Gy gradients and edge magnitude
image: /sims/edge-detection-visualizer/edge-detection-visualizer.png
quality_score: 90
---
# Edge Detection Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Edge Detection Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Edge Detection Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates how gradient-based edge detection works using Sobel, Prewitt, or Scharr operators. See how horizontal and vertical gradient components combine to reveal edges.

## How to Use

1. **Select an Image Pattern**: Choose patterns with different edge orientations

2. **Select Detector**: Compare Sobel, Prewitt, and Scharr operators

3. **Adjust Threshold**: Control which edges appear in the final binary output

4. **Gradient Arrows**: Toggle to see edge direction vectors

## Panels Explained

| Panel | Shows |
|-------|-------|
| Original | Source grayscale image |
| Gx | Horizontal gradient (detects vertical edges) |
| Gy | Vertical gradient (detects horizontal edges) |
| Magnitude | Combined edge strength √(Gx² + Gy²) |
| Edges | Binary edges after thresholding |

## Learning Objectives

Students will be able to:
- Understand how Sobel kernels approximate image derivatives
- Explain why Gx detects vertical edges and Gy detects horizontal edges
- Calculate gradient magnitude from component gradients
- Apply thresholding to create binary edge maps

## Lesson Plan

### Introduction (5 minutes)
Edges are locations where image intensity changes rapidly. We can detect them by computing derivatives using convolution.

### Kernel Analysis (10 minutes)
1. Examine Gx kernel - why does [-1,0,1] pattern detect horizontal changes?
2. Note the [1,2,1] smoothing factor perpendicular to the derivative
3. Compare Sobel vs Prewitt - Sobel has more smoothing

### Exploration (10 minutes)
1. Start with Vertical Edge - Gx is strong, Gy is weak
2. Try Horizontal Edge - opposite pattern
3. Use Diagonal - both Gx and Gy respond

### Discussion Questions
- Why is the magnitude image brighter than individual gradients?
- What happens if we only use Gx without Gy?
- Why might Scharr perform better for rotational symmetry?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Sobel Operator - Wikipedia](https://en.wikipedia.org/wiki/Sobel_operator)
