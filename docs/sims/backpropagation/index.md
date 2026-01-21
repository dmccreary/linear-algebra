---
title: Backpropagation
description: Step-by-step visualization of backpropagation showing how gradients flow backward through a neural network.
image: /sims/backpropagation/backpropagation.png
og:image: /sims/backpropagation/backpropagation.png
twitter:image: /sims/backpropagation/backpropagation.png
social:
   cards: false
---
# Backpropagation

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Backpropagation Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how gradients propagate backward through a neural network using the chain rule. Understanding backpropagation is essential for grasping how neural networks learn.

### The Backpropagation Algorithm

Starting from the output layer and working backward:

1. **Output Error**: $\delta^{[L]} = (\hat{y} - y) \cdot \sigma'(z^{[L]})$
2. **Hidden Layer Error**: $\delta^{[l]} = (W^{[l+1]})^T \delta^{[l+1]} \odot \sigma'(z^{[l]})$
3. **Weight Gradients**: $\frac{\partial \mathcal{L}}{\partial W^{[l]}} = \delta^{[l]} (\mathbf{a}^{[l-1]})^T$

### Key Insight: The Transpose

Notice how $W^{[l+1]}$ appears **transposed** when propagating gradients backward. This "distributes" each output error back to the neurons that contributed to it.

### Interactive Features

- **Forward Pass**: First compute all activations (required before backprop)
- **Backward Step**: Step through gradient computation layer by layer
- **Target Slider**: Change the target value and see how gradients change
- **Auto Mode**: Watch the full backward pass animate

### Visual Indicators

- **δ values**: Error signals shown above each neuron
- **Red/Blue colors**: Positive/negative gradients
- **Arrows**: Direction of gradient flow
- **∂ values**: Weight gradients on connections

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Explain how the chain rule enables gradient computation through composed functions
2. Describe why the weight matrix transpose appears in backpropagation
3. Compute error signals (δ) at each layer
4. Calculate weight gradients from error signals and activations

### Suggested Activities

1. **Manual Backprop**: Verify the δ and gradient values by hand calculation
2. **Target Exploration**: Change the target from 0 to 1 and observe how gradients flip sign
3. **Trace the Chain**: For one weight, write out the full chain rule expression
4. **Dimension Verification**: Confirm that $\delta^{[l]} (a^{[l-1]})^T$ has the same shape as $W^{[l]}$

### Discussion Questions

1. Why does the transpose of $W^{[l+1]}$ appear when computing $\delta^{[l]}$?
2. What happens to gradients when neurons have zero activation (dead ReLU)?
3. How does the magnitude of the output error affect all gradients in the network?
4. Why is it important that gradient dimensions match weight dimensions?

## Mathematical Details

For MSE loss: $\mathcal{L} = \frac{1}{2}(\hat{y} - y)^2$

The derivative: $\frac{\partial \mathcal{L}}{\partial \hat{y}} = \hat{y} - y$

## References

- Rumelhart, Hinton & Williams (1986). Learning Representations by Back-propagating Errors
- Goodfellow et al. (2016). Deep Learning, Chapter 6.5
