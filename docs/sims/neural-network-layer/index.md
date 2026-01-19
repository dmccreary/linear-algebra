---
title: Neural Network Layer
description: Interactive visualization of a neural network layer showing how matrix-vector multiplication implements the forward pass with various activation functions.
image: /sims/neural-network-layer/neural-network-layer.png
og:image: /sims/neural-network-layer/neural-network-layer.png
twitter:image: /sims/neural-network-layer/neural-network-layer.png
quality_score: 90
social:
   cards: false
---

# Neural Network Layer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Neural Network Layer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/neural-network-layer/main.html" height="502px" scrolling="no"></iframe>
```

## Description

This MicroSim visualizes how a **fully connected neural network layer** is implemented as matrix-vector multiplication. Each layer computes:

$$h = \sigma(Wx + b)$$

where:

- **x** is the input vector (left neurons)
- **W** is the weight matrix (connection lines)
- **b** is the bias vector (optional, shown as nodes above outputs)
- **σ** is the activation function (ReLU, sigmoid, tanh, or none)
- **h** is the output vector (right neurons)

**Key Features:**

- **Visual Weights**: Connection thickness shows weight magnitude; blue = positive, red = negative
- **Activation Functions**: Compare ReLU, sigmoid, tanh, or linear (none)
- **Adjustable Architecture**: Change the number of inputs and outputs
- **Bias Toggle**: Show or hide bias terms
- **Random Initialization**: Generate new weights or inputs

## The Matrix View

The weight matrix W has dimensions (outputs × inputs). Each row of W corresponds to one output neuron and contains the weights for all connections to that neuron.

For 3 inputs and 2 outputs:

$$W = \begin{bmatrix} w_{11} & w_{12} & w_{13} \\ w_{21} & w_{22} & w_{23} \end{bmatrix}$$

The output is computed as:

$$h_i = \sigma\left(\sum_{j=1}^{n} w_{ij} x_j + b_i\right)$$

## Activation Functions

| Function | Formula | Range | Properties |
|----------|---------|-------|------------|
| None | σ(z) = z | (-∞, ∞) | Linear, no nonlinearity |
| ReLU | σ(z) = max(0, z) | [0, ∞) | Sparse activation, fast |
| Sigmoid | σ(z) = 1/(1+e^(-z)) | (0, 1) | Smooth, probability interpretation |
| Tanh | σ(z) = tanh(z) | (-1, 1) | Zero-centered, smooth |

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Explain how a neural network layer implements matrix-vector multiplication
2. Describe the role of weights, biases, and activation functions
3. Calculate the output of a simple layer by hand
4. Connect linear algebra concepts to deep learning

### Guided Exploration (7-10 minutes)

1. **Start Simple**: Set inputs=2, outputs=2, activation=none, no bias
2. **Observe Weights**: Click "Random W" and watch connection changes
3. **Add Nonlinearity**: Switch to ReLU and note how negative pre-activations become 0
4. **Enable Bias**: Toggle bias on and observe the bias nodes appear

### Key Discussion Points

- Why do we need activation functions? (Without them, the whole network is just one big linear transformation)
- What does a large positive weight vs large negative weight mean visually?
- How many parameters (weights + biases) does this layer have?

### Assessment Questions

1. For a layer with 4 inputs and 3 outputs, what are the dimensions of W?
2. If all weights are positive, can an output ever be negative (with ReLU)?
3. How many total parameters does a 10-input, 5-output layer have (with bias)?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Neural network layers as matrix operations
- [Deep Learning Book](https://www.deeplearningbook.org/) - Goodfellow, Bengio, and Courville
