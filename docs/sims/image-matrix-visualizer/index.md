---
title: Image Matrix Visualizer
description: Interactive visualization showing how pixel values in a matrix correspond to grayscale image appearance
image: /sims/image-matrix-visualizer/image-matrix-visualizer.png
quality_score: 90
---
# Image Matrix Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Image Matrix Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Image Matrix Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates the fundamental concept that digital images are stored as matrices of numbers. Each cell in the matrix represents a pixel, with values from 0 (black) to 255 (white).

## How to Use

1. **Select an Image Pattern**: Use the dropdown to choose from:
   - **Checkerboard**: Alternating black and white pixels
   - **Gradient**: Values increasing from left to right
   - **Simple Shape**: A circular pattern with varying intensities
   - **Random**: Randomly generated pixel values

2. **Zoom**: Adjust the slider to enlarge or reduce the image display

3. **Hover Interaction**: Move your mouse over either the image or matrix to highlight the corresponding cell in both views

4. **Edit Mode**: Click "Enable Edit Mode" to modify individual pixel values by clicking on matrix cells

## Learning Objectives

Students will be able to:
- Understand that digital images are stored as matrices of numbers
- Connect pixel intensity values (0-255) to visual brightness
- Recognize how matrix dimensions correspond to image resolution
- Modify pixel values and observe the visual result

## Lesson Plan

### Introduction (5 minutes)
Explain that every digital image is fundamentally a grid of numbers. Each number represents how bright that tiny square (pixel) should be displayed.

### Exploration (10 minutes)
1. Start with the Checkerboard pattern - ask students what values they expect for black vs. white pixels
2. Switch to Gradient - observe how values increase from 0 to 255
3. Try Random - see how arbitrary values create noise-like patterns

### Interactive Exercise (10 minutes)
1. Enable Edit Mode
2. Challenge students to create simple patterns (diagonal line, border, letter shape)
3. Discuss: What's the smallest value change you can perceive?

### Discussion Questions
- Why do computers use numbers 0-255? (Hint: 8 bits = 256 values)
- What would a 1000x1000 pixel image require for storage?
- How might color images differ from grayscale?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Digital Image Basics - Wikipedia](https://en.wikipedia.org/wiki/Digital_image)
