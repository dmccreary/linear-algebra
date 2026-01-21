---
title: Convolution Visualizer
description: Step-by-step visualization of how convolution applies a kernel to an image
image: /sims/convolution-visualizer/convolution-visualizer.png
quality_score: 90
---
# Convolution Visualizer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Convolution Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Convolution Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates image convolution - the fundamental operation behind image filtering. Watch step-by-step as a kernel slides across an image, computing weighted sums at each position.

## How to Use

1. **Select a Kernel**: Choose from Identity, Box Blur, Gaussian Blur, Sharpen, or Edge Detect

2. **Step Through**: Click "Step" to advance one pixel at a time and see the calculation

3. **Run Animation**: Click "Run" to animate the convolution process

4. **Adjust Speed**: Use the slider to control animation speed

5. **Show Calculation**: Toggle to see the element-wise multiplication and sum

## Learning Objectives

Students will be able to:
- Understand how convolution slides a kernel across an image
- Calculate the weighted sum at each pixel position
- Predict the effect of different kernel values
- Connect kernel properties to visual effects

## Key Concepts

- **Kernel/Filter**: A small matrix of weights applied to each neighborhood
- **Convolution Sum**: Sum of element-wise products between kernel and image patch
- **Boundary Handling**: Edge pixels require special treatment (padding)
- **Linear Operation**: Convolution preserves linearity (sum of filters = filter of sums)

## Lesson Plan

### Introduction (5 minutes)
Explain that convolution is like looking at each pixel through a magnifying glass that blends neighboring values according to specific weights.

### Step-by-Step Demo (10 minutes)
1. Start with Identity kernel - show it produces no change
2. Switch to Box Blur - each pixel becomes the average of its neighbors
3. Use Step button to walk through the calculation manually

### Kernel Analysis (10 minutes)
1. Compare Box Blur vs Gaussian Blur - why is Gaussian smoother?
2. Examine Sharpen kernel - negative weights enhance edges
3. Edge Detect - why does the sum of weights equal 0?

### Discussion Questions
- What happens at image boundaries?
- Why must blur kernel values sum to 1?
- How would a 5×5 kernel differ from 3×3?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Kernel (Image Processing) - Wikipedia](https://en.wikipedia.org/wiki/Kernel_(image_processing))
