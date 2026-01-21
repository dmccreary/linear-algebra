---
title: Learning Rate Effect on Convergence
description: Interactive visualization comparing how different learning rates affect gradient descent optimization, demonstrating convergence, oscillation, and divergence behaviors.
image: /sims/learning-rate-effect/learning-rate-effect.png
og:image: /sims/learning-rate-effect/learning-rate-effect.png
twitter:image: /sims/learning-rate-effect/learning-rate-effect.png
quality_score: 85
social:
   cards: false
---

# Learning Rate Effect on Convergence

<iframe src="main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Learning Rate Effect MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how the choice of learning rate dramatically affects gradient descent optimization. By running three optimizations simultaneously with different learning rates, students can directly observe and compare convergence behaviors.

**Learning Objective:** Understand how learning rate choice affects optimization behavior through side-by-side comparison.

## How to Use

1. **Click "Run All"** to start the optimization on all three panels simultaneously
2. **Adjust individual learning rates** using the sliders below each panel
3. **Use preset buttons** to quickly set typical scenarios:
   - **Too Small**: Very slow convergence
   - **Just Right**: Efficient convergence
   - **Too Large**: Oscillation or divergence
4. **Adjust animation speed** to slow down or speed up the visualization
5. **Click "Reset All"** to restart from the initial position

## Key Concepts Demonstrated

### The Learning Rate Tradeoff

The learning rate $\eta$ (eta) controls the step size in gradient descent:

$$\theta_{t+1} = \theta_t - \eta \nabla L(\theta_t)$$

- **Too small** ($\eta < 0.01$): Safe but slow, may never reach optimum in reasonable time
- **Just right** ($\eta \approx 0.1$): Fast and stable convergence
- **Too large** ($\eta > 0.3$): May overshoot, oscillate, or diverge entirely

### Visual Indicators

Each panel shows:

- **Contour plot**: Elliptical contours of the loss function
- **Path trace**: The trajectory taken by gradient descent
- **Status indicator**:
  - **Converging** (blue): Making steady progress
  - **Converged** (green): Reached the minimum
  - **Oscillating** (yellow): Bouncing around the minimum
  - **Diverging** (red): Moving away from the minimum
- **Loss curve**: Real-time plot of loss value over iterations
- **Step count**: Number of iterations taken

### Loss Function

The visualization uses a quadratic loss function:

$$L(x, y) = x^2 + 3y^2$$

This creates elliptical contours where:

- The minimum is at the origin $(0, 0)$
- The y-direction has a steeper gradient (factor of 3)
- Different eigenvalues create the classic "elongated bowl" optimization challenge

### Why Large Learning Rates Cause Problems

For quadratic functions, stability requires:

$$\eta < \frac{2}{\lambda_{max}}$$

where $\lambda_{max}$ is the largest eigenvalue of the Hessian. In our case:

- Hessian eigenvalues: 2 and 6
- Maximum stable learning rate: $\eta < 2/6 \approx 0.33$

Beyond this threshold, the optimizer overshoots and may diverge.

## Mathematical Details

### Gradient Descent Update

At each step, the algorithm computes:

$$\nabla L = \begin{pmatrix} 2x \\ 6y \end{pmatrix}$$

And updates:

$$\begin{pmatrix} x_{t+1} \\ y_{t+1} \end{pmatrix} = \begin{pmatrix} x_t \\ y_t \end{pmatrix} - \eta \begin{pmatrix} 2x_t \\ 6y_t \end{pmatrix}$$

### Convergence Rate

For quadratic functions, the convergence rate is:

$$\|x_{t+1} - x^*\| \leq \left(1 - \frac{2\eta\lambda_{min}\lambda_{max}}{(\lambda_{min} + \lambda_{max})^2}\right) \|x_t - x^*\|$$

The optimal learning rate that minimizes this bound is:

$$\eta^* = \frac{2}{\lambda_{min} + \lambda_{max}}$$

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/learning-rate-effect/main.html"
        height="520px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate machine learning or optimization course

### Duration
20-25 minutes

### Prerequisites
- Understanding of gradient descent
- Basic calculus (partial derivatives)
- Familiarity with loss functions

### Learning Activities

1. **Initial Exploration (5 min)**:
   - Run with default settings
   - Observe the three different behaviors
   - Note which optimizer reaches the minimum first

2. **Learning Rate Sensitivity (5 min)**:
   - Use "Too Large" preset
   - Watch oscillation and divergence
   - Identify the threshold where behavior changes

3. **Finding Optimal Rate (5 min)**:
   - Manually adjust sliders to find the fastest convergence
   - Compare step counts to convergence
   - Discuss the tradeoff between speed and stability

4. **Analysis Discussion (5 min)**:
   - Why does the y-direction cause more oscillation?
   - How do eigenvalues relate to the optimal learning rate?
   - What happens at the stability boundary?

5. **Real-World Connection (5 min)**:
   - How do modern optimizers (Adam, RMSprop) handle this?
   - Why is learning rate scheduling important?
   - Connection to neural network training

### Discussion Questions

1. Why does the optimizer oscillate more in the y-direction with large learning rates?
2. What is the relationship between the loss function's curvature and the optimal learning rate?
3. How would you design an adaptive learning rate algorithm based on these observations?
4. Why might a learning rate that's "just right" for one problem be wrong for another?
5. How do momentum-based optimizers help with oscillation?

### Assessment Ideas

- Predict the behavior given a specific learning rate
- Calculate the maximum stable learning rate for a given Hessian
- Design an experiment to find the optimal learning rate empirically
- Explain the convergence/divergence criteria mathematically

## Connections to Machine Learning

### Neural Network Training
- Learning rate is one of the most important hyperparameters
- Too small: training takes forever, may get stuck
- Too large: loss explodes, training fails
- Common strategy: start larger, decay over time

### Learning Rate Schedules
- **Step decay**: Reduce by factor after fixed epochs
- **Exponential decay**: $\eta_t = \eta_0 e^{-kt}$
- **Cosine annealing**: Smooth decrease following cosine curve
- **Warmup**: Start small, increase, then decay

### Adaptive Methods
Modern optimizers adapt the learning rate per-parameter:
- **AdaGrad**: Accumulates squared gradients
- **RMSprop**: Exponential moving average of squared gradients
- **Adam**: Combines momentum with adaptive rates

## References

1. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press. Chapter 8.
2. Bottou, L. (2010). Large-scale machine learning with stochastic gradient descent. *COMPSTAT*.
3. [Why Learning Rate is So Important](https://www.jeremyjordan.me/nn-learning-rate/) - Jeremy Jordan
4. Ruder, S. (2016). An overview of gradient descent optimization algorithms. *arXiv:1609.04747*.
