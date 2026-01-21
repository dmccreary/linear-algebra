---
title: Linear Regression Interactive Visualizer
description: Interactive visualization of linear regression showing how the best-fit line minimizes squared errors with a loss surface heatmap
image: /sims/linear-regression/linear-regression.png
---

# Linear Regression Interactive Visualizer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Linear Regression Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates **linear regression** as an optimization problem where we find the line that best fits the data by minimizing the sum of squared errors (residuals).

## Key Features

- **Draggable Data Points**: Click and drag any point to see how it affects the regression line
- **Manual Parameter Control**: Adjust the slope (w) and intercept (b) sliders to explore the loss landscape
- **Fit OLS Button**: Instantly compute the optimal parameters using Ordinary Least Squares
- **Residual Visualization**: See the vertical distances from each point to the fitted line
- **Loss Surface Heatmap**: Visualize the Mean Squared Error as a function of w and b
- **Real-time Statistics**: View current and optimal parameters, loss values, and R-squared
- **Add Noise**: Introduce random noise to see how it affects the fit

## The Linear Regression Problem

Given data points $(x_i, y_i)$ for $i = 1, \ldots, n$, we want to find the line:

$$\hat{y} = wx + b$$

that minimizes the **sum of squared residuals**:

$$L(w, b) = \sum_{i=1}^{n} (y_i - (wx_i + b))^2$$

### The Normal Equations

The optimal parameters satisfy the **normal equations**:

$$(X^T X)\beta = X^T y$$

where:

$$X = \begin{bmatrix} 1 & x_1 \\ 1 & x_2 \\ \vdots & \vdots \\ 1 & x_n \end{bmatrix}, \quad y = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix}, \quad \beta = \begin{bmatrix} b \\ w \end{bmatrix}$$

### Closed-Form Solution

The optimal slope and intercept are:

$$w^* = \frac{n\sum x_i y_i - \sum x_i \sum y_i}{n\sum x_i^2 - (\sum x_i)^2}$$

$$b^* = \bar{y} - w^*\bar{x}$$

## How to Use

### Exploring the Loss Surface

1. **Move the sliders** for w (slope) and b (intercept)
2. Watch the **red dot** move on the loss surface heatmap
3. Notice how the loss increases as you move away from the optimal point (green dot)
4. The **bowl shape** of the loss surface shows this is a convex optimization problem

### Understanding Residuals

1. Enable **Residuals** checkbox to see vertical error lines
2. Each residual shows the distance from a data point to the fitted line
3. The **small squares** visualize the squared error being minimized
4. Notice that residuals are **vertical** (not perpendicular to the line)

### Interactive Exploration

1. **Drag data points** to change the dataset
2. Watch the optimal line (green dashed) update instantly
3. Use **Fit OLS** to snap to the optimal solution
4. Compare your manual fit to the computed optimal

## Visual Elements

| Element | Color | Meaning |
|---------|-------|---------|
| Data points | Blue | Observed data $(x_i, y_i)$ |
| Fitted line | Red | Current line $\hat{y} = wx + b$ |
| Optimal line | Green dashed | OLS solution |
| Residuals | Green dashed | Vertical errors $y_i - \hat{y}_i$ |
| Loss surface | Blue-White-Red | MSE as function of (w, b) |
| Current position | Red dot | Current (w, b) on loss surface |
| Optimal position | Green dot | Optimal $(w^*, b^*)$ |

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain why we minimize squared errors (not absolute errors)
- Interpret the loss surface as a function of model parameters
- Understand why the OLS solution is at the minimum of the loss surface
- Derive and apply the normal equations
- Calculate and interpret the R-squared goodness-of-fit measure
- Recognize that vertical residuals differ from perpendicular distances

## Key Insights

### Why Squared Errors?

1. **Differentiable**: Allows calculus-based optimization
2. **Penalizes large errors**: Outliers have significant impact
3. **Unique minimum**: Convex loss surface guarantees global optimum
4. **Statistical properties**: MLE under Gaussian noise assumption

### Why Vertical Residuals?

Linear regression minimizes errors in **y** (the dependent variable), not perpendicular distance to the line. This makes sense when:

- **x** is known precisely (independent variable)
- **y** has measurement error (dependent variable)

For errors in both variables, use **Total Least Squares** instead.

### The R-Squared Statistic

$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}$$

- $R^2 = 1$: Perfect fit (all points on line)
- $R^2 = 0$: Model no better than predicting the mean
- $R^2 < 0$: Model is worse than the mean (usually indicates error)

## Lesson Plan

### Introduction (5 minutes)

Pose the question: "Given scattered data, how do we find the 'best' line through it?"

### Exploration Phase (10 minutes)

1. Let students drag sliders to find their best fit manually
2. Discuss what makes a line "good" or "bad"
3. Reveal the loss surface - where is your solution?
4. Click "Fit OLS" to see the optimal solution

### Mathematical Foundation (10 minutes)

1. Introduce the loss function $L(w, b)$
2. Show why the minimum is where partial derivatives equal zero
3. Derive the normal equations
4. Connect to matrix form $X^T X \beta = X^T y$

### Interactive Experiments (10 minutes)

1. **Drag an outlier**: How much does one point affect the fit?
2. **Add noise**: How does noise affect R-squared?
3. **Change slope**: What happens to the loss surface?

### Discussion Questions

1. Why do we square the residuals instead of using absolute values?
2. What would happen if we minimized perpendicular distance instead?
3. How would you extend this to multiple independent variables?
4. When might linear regression be inappropriate?

## Connections to Linear Algebra

Linear regression connects to several key concepts:

- **Least Squares**: Finding the best approximation when Ax = b has no solution
- **Projection**: The fitted values $\hat{y} = X\beta$ are the projection of y onto Col(X)
- **Normal Equations**: $X^T X \beta = X^T y$ ensures the residual is orthogonal to Col(X)
- **Pseudoinverse**: $\beta = (X^T X)^{-1} X^T y = X^+ y$

## References

- Chapter 8: Vector Spaces and Subspaces - Least Squares section
- Chapter 9: Solving Linear Systems - Normal equations
- [3Blue1Brown: Linear Regression](https://www.youtube.com/watch?v=PaVvduP_ZRc)
