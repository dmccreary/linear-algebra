---
title: Optimizer Comparison Arena
description: Race SGD, Momentum, RMSprop, and Adam on various loss landscapes
image: /sims/optimizer-comparison-arena/optimizer-comparison-arena.png
---

# Optimizer Comparison Arena

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Arena Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This arena lets you race four popular optimization algorithms against each other on different loss landscapes. Watch as they navigate toward the minimum (green dot) with varying strategies.

### The Optimizers

| Optimizer | Color | Key Feature |
|-----------|-------|-------------|
| **SGD** | Blue | Basic gradient descent |
| **Momentum** | Green | Accumulates velocity |
| **RMSprop** | Purple | Adapts per-parameter rates |
| **Adam** | Orange | Combines momentum + adaptive rates |

### How to Use

1. **Select Landscape**: Choose from Quadratic, Rosenbrock, Beale, or Saddle
2. **Enable/Disable Optimizers**: Check which optimizers to include
3. **Race!**: Click to start the competition
4. **Observe**: Watch which optimizer reaches the minimum first

### Loss Landscapes

- **Quadratic**: Elongated ellipses testing condition number handling
- **Rosenbrock**: Famous banana-shaped valley with global minimum at (1,1)
- **Beale**: Multiple local valleys with tricky gradients
- **Saddle Point**: Tests optimizer behavior near saddle points

### Key Observations

- **SGD** may oscillate wildly on ill-conditioned problems
- **Momentum** accelerates in consistent directions
- **RMSprop** handles varying gradient scales well
- **Adam** often provides good all-around performance

## Lesson Plan

### Learning Objectives

- Compare convergence behavior of different optimizers
- Understand when different optimizers excel
- Visualize adaptive learning rate mechanisms

### Suggested Activities

1. **Quadratic Landscape**: Which optimizer handles ill-conditioning best?
2. **Rosenbrock Challenge**: Watch optimizers navigate the narrow valley
3. **Saddle Point**: Observe behavior when there's no local minimum
4. **Selective Racing**: Disable optimizers one by one to see their individual paths

## References

- Ruder, S., *An overview of gradient descent optimization algorithms*, 2016
- Kingma & Ba, *Adam: A Method for Stochastic Optimization*, 2014
