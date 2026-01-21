---
title: Neural Network Architecture
description: Interactive visualization of neural network architecture showing layers, neurons, weight matrices, and parameter counts.
image: /sims/neural-network-architecture/neural-network-architecture.png
og:image: /sims/neural-network-architecture/neural-network-architecture.png
twitter:image: /sims/neural-network-architecture/neural-network-architecture.png
social:
   cards: false
---
# Neural Network Architecture

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Neural Network Architecture Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization helps you understand how neural networks are structured, showing the connections between layers and the dimensions of weight matrices that make learning possible.

### Key Concepts

- **Layers**: Input, hidden, and output layers each serve different purposes
- **Weight Matrix**: For a layer with $n_{in}$ inputs and $n_{out}$ outputs, $W \in \mathbb{R}^{n_{out} \times n_{in}}$
- **Bias Vector**: Each layer has a bias $\mathbf{b} \in \mathbb{R}^{n_{out}}$
- **Parameters**: Total trainable values = weights + biases

### Interactive Features

- **Input Neurons**: Adjust the input layer size (feature dimension)
- **Hidden Layers**: Change the number of hidden layers (1-5)
- **Hidden Neurons**: Set the width of hidden layers
- **Output Neurons**: Set the output dimension (e.g., number of classes)
- **Show Dims**: Toggle weight matrix dimension labels

### Understanding the Display

- **Green nodes**: Input layer (receives data)
- **Blue nodes**: Hidden layers (learn features)
- **Red nodes**: Output layer (produces predictions)
- **W labels**: Weight matrix dimensions (rows × columns)
- **b labels**: Bias vector dimensions
- **σ labels**: Activation function at each layer

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Describe the role of input, hidden, and output layers
2. Calculate the dimensions of weight matrices between layers
3. Compute the total number of parameters in a network
4. Explain why hidden layer width and depth affect capacity

### Suggested Activities

1. **Parameter Counting**: Create a 784→128→64→10 network (like MNIST) and verify the parameter count
2. **Dimension Matching**: Explain why W must have shape (output_size × input_size)
3. **Depth vs Width**: Compare 4→16→16→2 vs 4→32→2. Which has more parameters?
4. **Scaling Analysis**: How does doubling hidden neurons affect parameter count?

### Discussion Questions

1. Why must the weight matrix dimensions be $n_{out} \times n_{in}$ and not the reverse?
2. How do biases differ from weights in terms of what they learn?
3. What's the tradeoff between deeper networks and wider networks?
4. Why might a 4→8→8→2 network be preferred over 4→16→2?

## References

- Goodfellow et al. (2016). Deep Learning, Chapter 6: Deep Feedforward Networks
- He et al. (2015). Delving Deep into Rectifiers (weight initialization)
