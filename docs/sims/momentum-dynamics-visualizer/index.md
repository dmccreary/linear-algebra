---
title: Momentum Dynamics Visualizer
description: Interactive comparison of SGD, Momentum, and Nesterov optimization showing velocity accumulation
image: /sims/momentum-dynamics-visualizer/momentum-dynamics-visualizer.png
---

# Momentum Dynamics Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Momentum Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization compares three optimization methods on an ill-conditioned quadratic function:

- **SGD** (blue): Standard gradient descent with characteristic zig-zag oscillation
- **Momentum** (green): Accumulates velocity to smooth the path
- **Nesterov** (orange): "Looks ahead" before computing the gradient

### How to Use

1. **Adjust Momentum (β)**: Control velocity decay (0 = no momentum, 0.99 = high momentum)
2. **Adjust Learning Rate**: Control step size
3. **Step/Run**: Execute optimization steps manually or automatically
4. **Velocity Vectors**: Toggle arrows showing accumulated velocity direction and magnitude
5. **Click**: Click anywhere on the plot to set a new starting point

### Key Observations

- **SGD** shows characteristic zig-zag pattern on elongated contours
- **Momentum** builds up speed in consistent directions, reducing oscillation
- **Nesterov** typically converges slightly faster than classical momentum

### The Momentum Update

Classical momentum maintains a velocity vector:

$$\mathbf{v}_{k+1} = \beta \mathbf{v}_k + \nabla f(\mathbf{x}_k)$$
$$\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha \mathbf{v}_{k+1}$$

The velocity accumulates in directions where the gradient is consistent, while damping oscillations.

## Lesson Plan

### Learning Objectives

- Understand how momentum accumulates and dampens oscillations
- Compare SGD, Momentum, and Nesterov acceleration
- Visualize velocity vectors during optimization

### Suggested Activities

1. **No Momentum**: Set β=0 and observe pure SGD behavior
2. **High Momentum**: Set β=0.95 and watch smooth acceleration
3. **Compare Methods**: Run all three simultaneously and count iterations to convergence
4. **Velocity Vectors**: Enable velocity display to see how momentum builds

## References

- Sutskever et al., *On the importance of initialization and momentum in deep learning*, 2013
- [Wikipedia: Momentum (gradient descent)](https://en.wikipedia.org/wiki/Stochastic_gradient_descent#Momentum)
