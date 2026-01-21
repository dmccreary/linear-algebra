---
title: Filter Effects Gallery
description: Side-by-side comparison of different image filters showing blur, sharpen, and edge detection effects
image: /sims/filter-effects-gallery/filter-effects-gallery.png
quality_score: 90
---
# Filter Effects Gallery

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Filter Effects Gallery Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Filter Effects Gallery with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim displays the same source image processed through six different filters simultaneously, enabling direct comparison of their effects.

## How to Use

1. **Select an Image Pattern**: Choose from Edge Pattern, Gradient, Checkerboard, Circle, or Random

2. **Show Difference**: Toggle to see how each filter changes pixels relative to the original (gray = no change, bright = increased, dark = decreased)

3. **Show Kernels**: Display the 3×3 kernel matrices used by each filter

## Filters Explained

| Filter | Effect | Kernel Property |
|--------|--------|-----------------|
| Original | No change | Identity matrix |
| Box Blur | Simple averaging | All values equal, sum to 1 |
| Gaussian | Smooth blur | Weighted by distance from center |
| Sharpen | Enhance edges | Positive center, negative surroundings |
| Edge | Detect boundaries | Sum of values equals 0 |
| Emboss | 3D relief effect | Asymmetric weights create shadow |

## Learning Objectives

Students will be able to:
- Compare effects of different convolution kernels
- Identify which filter to use for specific image processing tasks
- Understand how kernel values relate to visual effects
- Evaluate filter effectiveness on different image types

## Lesson Plan

### Introduction (5 minutes)
Different kernels produce dramatically different effects. Today we'll see why by comparing them side-by-side.

### Exploration (10 minutes)
1. Start with Edge Pattern - observe how Edge and Sharpen filters respond to boundaries
2. Try Gradient - see how blur smooths transitions while edge detection finds them
3. Use Checkerboard - notice how small patterns interact with filter size

### Analysis Activity (10 minutes)
1. Enable "Show difference" - gray means no change
2. Compare Box Blur vs Gaussian - why does Gaussian look smoother?
3. Look at kernel values - connect positive/negative to bright/dark effects

### Discussion Questions
- Why do blur kernels sum to 1?
- Why does the edge detection kernel sum to 0?
- What happens when filter size matches feature size?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Image Filter Gallery - Wikipedia](https://en.wikipedia.org/wiki/Digital_image_processing)
