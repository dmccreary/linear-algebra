---
title: SVD Compression Visualizer
description: Interactive demonstration of image compression using truncated Singular Value Decomposition
image: /sims/svd-compression-visualizer/svd-compression-visualizer.png
quality_score: 90
---
# SVD Compression Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the SVD Compression Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the SVD Compression Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates how Singular Value Decomposition enables image compression by keeping only the most significant components. Watch quality degrade gracefully as you reduce the number of singular values.

## How to Use

1. **Select an Image Pattern**: Different patterns have different rank characteristics

2. **Adjust Rank k**: Control how many singular values to keep (1 to 16)

3. **Show Error**: Toggle to see the difference between original and reconstructed images

## Key Insights

- **Singular values** are ordered by importance - first few capture most information
- **Low rank images** (gradients, simple shapes) compress well
- **Complex/noisy images** need more components for good reconstruction
- **Compression ratio** improves as k decreases, but quality suffers

## Learning Objectives

Students will be able to:
- Understand SVD as a sum of rank-1 matrices
- Apply truncated SVD for lossy compression
- Evaluate the quality-compression tradeoff
- Connect singular value magnitude to image features

## The Mathematics

The SVD decomposes an image matrix as:

$$\mathbf{I} = \sum_{i=1}^{r} \sigma_i \mathbf{u}_i \mathbf{v}_i^T$$

The **truncated SVD** keeps only k terms:

$$\mathbf{I}_k = \sum_{i=1}^{k} \sigma_i \mathbf{u}_i \mathbf{v}_i^T$$

**Storage comparison:**
- Original: H × W values
- Compressed: k × (H + W + 1) values

## Lesson Plan

### Introduction (5 minutes)
SVD reveals that images can be approximated as sums of simpler "building block" images. Each building block is the outer product of two vectors.

### Exploration (10 minutes)
1. Start with Gradient image - observe it reconstructs perfectly with few components (it's nearly rank-1!)
2. Try Low Rank image - designed to show clear rank structure
3. Use Complex image - needs many components

### Compression Analysis (10 minutes)
1. Note the "knee" in the singular value plot
2. Calculate compression ratios at different k values
3. Observe PSNR and energy retained metrics

### Discussion Questions
- Why does the gradient compress so well?
- What does a large first singular value indicate?
- How does JPEG differ from SVD compression?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Chapter 7: Matrix Decompositions](../../chapters/07-matrix-decompositions/index.md)
- [SVD - Wikipedia](https://en.wikipedia.org/wiki/Singular_value_decomposition)
