---
title: Gradient Descent Interactive Visualizer
description: Visualize how gradient descent navigates loss surfaces and how learning rate affects convergence
image: /sims/gradient-descent/gradient-descent.png
---

# Gradient Descent Interactive Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Gradient Descent Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates **gradient descent optimization**, the foundational algorithm for training neural networks and many machine learning models. Watch how the algorithm navigates the loss surface to find minimum values.

$$\theta_{t+1} = \theta_t - \alpha \nabla J(\theta_t)$$

Where:
- $\theta$ are the parameters being optimized
- $\alpha$ is the learning rate
- $\nabla J$ is the gradient of the loss function

## Key Features

- **Contour Plot View**: See optimization path on 2D contour lines
- **3D Surface View**: Visualize the loss landscape in three dimensions
- **Gradient Arrows**: See the direction of steepest descent at each point
- **Loss History Plot**: Track how loss decreases over iterations
- **Multiple Loss Functions**: Explore different optimization landscapes

## Interactive Controls

| Control | Function |
|---------|----------|
| Learning Rate Slider | Adjust step size (0.001 to 1.0, log scale) |
| Step Button | Execute single gradient descent iteration |
| Run/Pause Button | Start or stop continuous optimization |
| Reset Button | Return to initial starting point |
| Loss Function Selector | Choose between Quadratic, Rosenbrock, or Saddle |
| Toggle 3D/Contour | Switch between visualization modes |
| Click on Contour | Set a new starting point |
| Drag in 3D View | Rotate camera angle |

## Loss Functions

### Quadratic Bowl
$$J(\theta_1, \theta_2) = \theta_1^2 + \theta_2^2$$

The simplest loss surface with a single global minimum at the origin. Good for demonstrating basic gradient descent behavior.

### Rosenbrock Function
$$J(\theta_1, \theta_2) = (1 - \theta_1)^2 + 5(\theta_2 - \theta_1^2)^2$$

A classic optimization test function with a narrow curved valley. The global minimum is at $(1, 1)$. Demonstrates how gradient descent can struggle with ill-conditioned problems.

### Saddle Point
$$J(\theta_1, \theta_2) = \theta_1^2 - \theta_2^2 + 0.05\theta_2^4$$

Shows a saddle point at the origin where gradient descent can get stuck. Important for understanding challenges in high-dimensional optimization.

## Learning Rate Effects

### Too Small (< 0.01)
- Very slow convergence
- Many iterations needed
- Stable but inefficient

### Just Right (0.01 - 0.3)
- Smooth convergence
- Efficient path to minimum
- Stable oscillations dampen

### Too Large (> 0.5)
- Oscillation around minimum
- Possible divergence
- May never converge

## How to Use

1. **Start with Quadratic Bowl** to see ideal gradient descent behavior
2. **Adjust learning rate** and observe convergence speed
3. **Set learning rate too high** (> 0.5) to see oscillation/divergence
4. **Try Rosenbrock** to see the challenge of narrow valleys
5. **Click different starting points** to explore convergence basins
6. **Switch to 3D view** to better understand the loss landscape

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain how gradient descent updates parameters using gradients
- Predict how learning rate affects convergence behavior
- Identify when gradient descent will converge, oscillate, or diverge
- Understand why some loss surfaces are harder to optimize
- Recognize the role of learning rate in optimization stability

## Observations to Make

### Convergence Patterns
- On the quadratic bowl, what learning rate gives fastest convergence?
- How does the path differ between small and large learning rates?

### Challenging Surfaces
- On Rosenbrock, why does optimization slow down in the valley?
- Can gradient descent escape the saddle point origin?

### Iteration Counting
- How many iterations to converge with $\alpha = 0.1$ vs $\alpha = 0.01$?
- When does a higher learning rate actually increase total iterations?

## Mathematical Background

The gradient descent update rule:

$$\theta_{new} = \theta_{old} - \alpha \cdot \nabla J(\theta_{old})$$

For a 2D loss function:

$$\nabla J = \begin{bmatrix} \frac{\partial J}{\partial \theta_1} \\ \frac{\partial J}{\partial \theta_2} \end{bmatrix}$$

The gradient points in the direction of steepest ascent, so we subtract it to descend toward the minimum.

### Convergence Condition
Gradient descent converges when $|\nabla J| < \epsilon$ for some small threshold $\epsilon$.

## Connection to Neural Networks

This 2D visualization represents the core idea behind training neural networks:

- Neural networks have millions of parameters (instead of just 2)
- The loss function measures prediction error
- Backpropagation computes the gradient efficiently
- Stochastic Gradient Descent (SGD) uses batches for efficiency

The learning rate is one of the most important hyperparameters in deep learning!

## Lesson Plan

### Introduction (5 minutes)
Ask: "How do we find the minimum of a function when we can only compute its value and gradient at a point?"

### Demonstration (10 minutes)
1. Start with quadratic bowl, show gradient descent converging
2. Demonstrate effect of learning rate (too small, too large)
3. Show Rosenbrock function and the challenge of valleys
4. Explain connection to neural network training

### Hands-on Exploration (10 minutes)
Have students:
1. Find the learning rate that converges fastest on quadratic
2. Make gradient descent diverge
3. Find a starting point on Rosenbrock that converges slowly
4. Count iterations to convergence with different learning rates

### Discussion Questions

1. Why is choosing the right learning rate so important?
2. What happens geometrically when learning rate is too large?
3. How might adaptive learning rates help?

## Extensions

- **Momentum**: Add velocity to escape local minima
- **Adam Optimizer**: Adaptive learning rates per parameter
- **Learning Rate Schedules**: Decrease learning rate over time
- **Stochastic Gradient Descent**: Add noise to gradients

## References

- Chapter 10: Optimization and Gradient Descent
- [3Blue1Brown: Neural Networks](https://www.youtube.com/watch?v=aircAruvnKk)
- Goodfellow et al., "Deep Learning" Chapter 8
