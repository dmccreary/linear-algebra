---
title: SGD Trajectory Visualizer
description: Interactive visualization showing how batch size affects stochastic gradient descent convergence
image: /sims/sgd-trajectory-visualizer/sgd-trajectory-visualizer.png
---

# SGD Trajectory Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the SGD Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how **batch size** affects the behavior of **Stochastic Gradient Descent (SGD)**. Small batch sizes lead to noisy, erratic optimization paths, while larger batch sizes produce smoother convergence.

### How to Use

1. **Adjust Batch Size**: Slide from 1 (pure SGD) to 128 (full batch)
2. **Adjust Learning Rate**: Control step size
3. **Step/Run**: Execute optimization steps manually or automatically
4. **Show Noise**: Toggle visualization of gradient variance
5. **Click**: Click anywhere on the plot to set a new starting point

### Key Observations

| Batch Size | Behavior |
|------------|----------|
| 1 (Pure SGD) | Very noisy, erratic path |
| 8-32 | Moderate noise, faster per-step |
| 128 (Full Batch) | Smooth path, slower per-step |

### Understanding the Visualization

- **Blue Path**: The optimization trajectory
- **Orange Cloud**: Represents gradient variance (uncertainty)
- **Gray Arrow**: True gradient direction
- **Orange Arrows**: Sample stochastic gradients

### Why Batch Size Matters

The variance of the stochastic gradient estimate decreases with batch size:

$$\text{Var}[\nabla f_B] = \frac{\text{Var}[\nabla f_i]}{|B|}$$

Larger batches give more accurate gradient estimates but require more computation per step.

## Lesson Plan

### Learning Objectives

- Understand the trade-off between gradient accuracy and computation
- Visualize how noise affects optimization paths
- Compare pure SGD, mini-batch, and full-batch gradient descent

### Suggested Activities

1. **Pure SGD**: Set batch size to 1 and observe the noisy trajectory
2. **Mini-Batch**: Try batch sizes of 8, 16, 32 and compare smoothness
3. **Full Batch**: Set to 128 and see the deterministic path
4. **Learning Rate Interaction**: High learning rate + small batch = unstable

## References

- Goodfellow et al., *Deep Learning*, Chapter 8
- [Wikipedia: Stochastic Gradient Descent](https://en.wikipedia.org/wiki/Stochastic_gradient_descent)
