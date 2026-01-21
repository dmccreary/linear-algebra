---
title: Forward Propagation
description: Step-by-step visualization of forward propagation through a neural network showing matrix operations at each layer.
image: /sims/forward-propagation/forward-propagation.png
og:image: /sims/forward-propagation/forward-propagation.png
twitter:image: /sims/forward-propagation/forward-propagation.png
social:
   cards: false
---
# Forward Propagation

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Forward Propagation Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization shows exactly how data flows through a neural network, step by step. Watch as inputs are transformed through matrix multiplications and activation functions to produce outputs.

### The Forward Propagation Algorithm

For each layer $l$ from 1 to L:

1. **Linear Step**: $\mathbf{z}^{[l]} = W^{[l]}\mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}$
2. **Activation Step**: $\mathbf{a}^{[l]} = \sigma^{[l]}(\mathbf{z}^{[l]})$

### Interactive Features

- **Next Step**: Advance one computation at a time
- **Auto Run**: Watch the propagation animate automatically
- **Speed Control**: Adjust animation speed
- **Input Sliders**: Change input values and restart
- **Reset**: Reinitialize with new random weights

### What You'll See

- **Yellow nodes**: Currently being computed
- **Colored nodes**: Values already computed (green=input, blue=hidden, red=output)
- **Gray nodes**: Not yet computed
- **Weight labels**: Shown on connections during computation
- **Matrix equation**: Full computation displayed at bottom

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Trace data flow through a neural network layer by layer
2. Perform matrix multiplication for the linear step z = Wa + b
3. Apply activation functions elementwise
4. Verify dimension compatibility at each step

### Suggested Activities

1. **Manual Verification**: Pause at each step and verify the z values by hand
2. **Input Exploration**: Try different input values and predict the output
3. **Dimension Tracking**: For each step, verify that matrix dimensions are compatible
4. **ReLU vs Sigmoid**: Notice which activation is used where (ReLU=hidden, sigmoid=output)

### Discussion Questions

1. Why do we alternate between linear and nonlinear operations?
2. What would happen if we removed all activation functions?
3. How does the matrix multiplication $Wa$ combine information from the previous layer?
4. Why might the output use sigmoid instead of ReLU?

## Mathematical Details

For the network 2 → 3 → 2:

- Layer 1: $W^{[1]} \in \mathbb{R}^{3\times2}$, $\mathbf{b}^{[1]} \in \mathbb{R}^{3}$
- Layer 2: $W^{[2]} \in \mathbb{R}^{2\times3}$, $\mathbf{b}^{[2]} \in \mathbb{R}^{2}$

## References

- Goodfellow et al. (2016). Deep Learning, Chapter 6.5: Forward Propagation
- Nielsen (2015). Neural Networks and Deep Learning, Chapter 2
