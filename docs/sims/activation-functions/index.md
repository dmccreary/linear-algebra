---
title: Activation Functions
description: Interactive comparison of neural network activation functions including ReLU, Sigmoid, Tanh, and their derivatives.
image: /sims/activation-functions/activation-functions.png
og:image: /sims/activation-functions/activation-functions.png
twitter:image: /sims/activation-functions/activation-functions.png
social:
   cards: false
---
# Activation Functions

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Activation Functions Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization compares common neural network activation functions, showing both their shape and derivative behavior—crucial for understanding gradient flow during backpropagation.

### Activation Functions Included

| Function | Formula | Range | Key Property |
|----------|---------|-------|--------------|
| ReLU | max(0, x) | [0, ∞) | Efficient, sparse |
| Sigmoid | 1/(1+e⁻ˣ) | (0, 1) | Probability output |
| Tanh | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | (-1, 1) | Zero-centered |
| Leaky ReLU | max(0.1x, x) | (-∞, ∞) | No dead neurons |
| Softplus | log(1+eˣ) | (0, ∞) | Smooth ReLU |

### Interactive Features

- **Function Selector**: Choose which activation to examine
- **Show Derivative**: Toggle to display f'(x) as dashed line
- **Compare All**: Overlay all functions for comparison
- **Input Slider**: Trace along the curve to see exact values
- **Info Panel**: Shows f(x), f'(x), range, and gradient status

### Visual Indicators

- **Yellow regions**: Low gradient areas (|f'(x)| < 0.1) where vanishing gradients occur
- **Solid line**: The activation function f(x)
- **Dashed line**: The derivative f'(x)

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Describe the shape and range of common activation functions
2. Explain why nonlinear activations are necessary
3. Identify regions where gradients vanish
4. Choose appropriate activations for different use cases

### Suggested Activities

1. **Gradient Exploration**: Move the slider to x = -3 for sigmoid. What happens to f'(x)?
2. **Compare ReLU Family**: Look at ReLU, Leaky ReLU, and Softplus side by side
3. **Saturation Investigation**: Find where sigmoid and tanh have near-zero gradients
4. **Zero-Centered Discussion**: Compare sigmoid (not zero-centered) with tanh (zero-centered)

### Discussion Questions

1. Why does ReLU dominate modern deep learning despite having a discontinuous derivative?
2. What does "vanishing gradient" mean and why is it a problem?
3. When would you choose sigmoid over tanh for an output layer?
4. Why might Leaky ReLU be preferred over standard ReLU?

## References

- Nair & Hinton (2010). Rectified Linear Units Improve Restricted Boltzmann Machines
- Glorot et al. (2011). Deep Sparse Rectifier Neural Networks
