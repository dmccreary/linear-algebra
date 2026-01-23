---
title: Latent Space Interpolation Visualizer
description: Interactive visualization of latent space interpolation showing smooth transitions between generated samples using linear and spherical methods
image: /sims/latent-space-interpolation/latent-space-interpolation.png
---

# Latent Space Interpolation Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Latent Space Interpolation Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **interpolation in latent space**, a key technique in generative models. By smoothly moving between two points in latent space, we can generate intermediate samples that smoothly transition between the endpoints.

## How to Use

1. **Select Points**: Click on shapes to select point A (red highlight) and point B (blue highlight)
2. **Adjust t**: Use the slider to move along the interpolation path
3. **Change Steps**: Adjust the number of intermediate samples
4. **Method**: Switch between linear and spherical (SLERP) interpolation

## Key Concepts

### Latent Space

A **latent space** is a compressed representation where:
- Each point corresponds to a potential generated sample
- Nearby points produce similar outputs
- The space is typically lower-dimensional than data space

### Linear Interpolation

The simplest method walks in a straight line:

$$\mathbf{z}(t) = (1-t)\mathbf{z}_1 + t\mathbf{z}_2, \quad t \in [0, 1]$$

### Spherical Interpolation (SLERP)

For normalized latent vectors, SLERP maintains constant magnitude:

$$\mathbf{z}(t) = \frac{\sin((1-t)\theta)}{\sin\theta}\mathbf{z}_1 + \frac{\sin(t\theta)}{\sin\theta}\mathbf{z}_2$$

where $\theta = \arccos(\mathbf{z}_1 \cdot \mathbf{z}_2)$

### Why SLERP?

- Linear interpolation can pass through low-density regions
- SLERP stays on the "surface" of the latent manifold
- Often produces more realistic intermediate samples

## Applications

- **Image Morphing**: Smooth transitions between faces
- **Style Mixing**: Blend attributes from different samples
- **Data Augmentation**: Generate novel training examples
- **Exploration**: Understand what the model has learned

## Lesson Plan

**Learning Objectives:**

- Understand the concept of latent space in generative models
- Compare linear vs spherical interpolation methods
- Predict how generated outputs change along interpolation paths

**Activities:**

1. Select two very different shapes and observe the transition
2. Compare linear vs SLERP paths - when do they differ most?
3. Find configurations where interpolation produces unexpected results

**Assessment:**

- Why might linear interpolation produce unrealistic intermediate samples?
- When would you choose SLERP over linear interpolation?
- How does the number of interpolation steps affect perceived smoothness?

## References

- [Understanding Latent Space](https://towardsdatascience.com/understanding-latent-space-in-machine-learning-de5a7c687d8d)
- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/index.md)
- [Spherical Linear Interpolation](https://en.wikipedia.org/wiki/Slerp)
