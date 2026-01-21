---
title: Least Squares Problem Visualizer
description: Interactive visualization of least squares as projection showing the geometric relationship between b, Ax-hat, and the error vector
image: /sims/least-squares-visualizer/least-squares-visualizer.png
---

# Least Squares Problem Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Least Squares Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates the **least squares problem** from two complementary perspectives:

1. **Regression View**: See how least squares finds the best-fit line through data points by minimizing the sum of squared residuals
2. **Geometric View**: Understand least squares as finding the projection of vector **b** onto the column space of matrix **A**

## Key Features

- **Dual View Modes**: Switch between regression and geometric perspectives
- **Interactive Data Points**: Drag points in regression view to see solution update
- **Residual Visualization**: See vertical distances from points to fitted line
- **3D Projection**: Visualize Ax-hat as the closest point in Col(A) to b
- **Error Vector**: See e = b - Ax-hat perpendicular to the column space
- **Method Comparison**: Compare Normal Equations, QR, and SVD approaches
- **Real-time Updates**: Solution updates instantly as you modify inputs

## The Least Squares Problem

Given an overdetermined system **Ax = b** (more equations than unknowns), we seek **x-hat** that minimizes:

$$\|b - Ax\|^2 = \sum_{i=1}^{m} (b_i - (Ax)_i)^2$$

### Geometric Interpretation

The solution **x-hat** satisfies the **normal equations**:

$$A^T A \hat{x} = A^T b$$

Geometrically:

- **Ax-hat** = projection of **b** onto Col(A)
- **e = b - Ax-hat** is perpendicular to Col(A)
- **x-hat** minimizes the length of the error vector

### For Linear Regression

For fitting y = mx + c to data points (x_i, y_i):

$$A = \begin{bmatrix} 1 & x_1 \\ 1 & x_2 \\ \vdots & \vdots \\ 1 & x_n \end{bmatrix}, \quad b = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix}, \quad x = \begin{bmatrix} c \\ m \end{bmatrix}$$

## How to Use

### Regression View

1. **Drag data points** to adjust their positions
2. Watch the best-fit line update in real-time
3. Toggle **Show Residuals** to see vertical error lines
4. Observe the **Sum of Squared Residuals (SSR)** minimize

### Geometric View

1. Adjust **b vector** using sliders
2. **Drag to rotate** the 3D view
3. See **b** (blue), **Ax-hat** (red), and **e** (green)
4. Verify **e** is perpendicular to the column space plane

### Method Comparison

Select different solution methods to understand their trade-offs:

| Method | Speed | Stability | Best For |
|--------|-------|-----------|----------|
| Normal Equations | Fastest | May be unstable | Well-conditioned problems |
| QR Decomposition | Medium | More stable | General use |
| SVD Method | Slowest | Most stable | Rank-deficient problems |

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain least squares as finding the projection onto column space
- Interpret the error vector as perpendicular to Col(A)
- Connect the normal equations to the projection formula
- Apply least squares to linear regression problems
- Recognize when different solution methods are appropriate

## Visual Elements

| Element | Color | Meaning |
|---------|-------|---------|
| Data points | Blue | Observed data (regression view) |
| Fitted line | Red | Least squares solution y-hat = mx + c |
| Residuals | Green dashed | Vertical errors (y - y-hat) |
| Vector b | Blue | Observation vector (geometric view) |
| Vector Ax-hat | Red | Projection onto Col(A) |
| Vector e | Green | Error = b - Ax-hat |
| Plane | Light blue | Column space of A |

## Mathematical Insights

### Why Perpendicularity?

The minimum occurs when **e** is perpendicular to Col(A) because:

1. Moving **Ax-hat** in any direction within Col(A) would increase ||e||
2. This is the same as minimizing distance from a point to a plane

### The Normal Equations

From e perpendicular to Col(A):
$$A^T e = 0$$
$$A^T(b - A\hat{x}) = 0$$
$$A^T A \hat{x} = A^T b$$

### Condition Number Warning

If the condition number of **A^T A** is large (> 100), the problem is ill-conditioned and:

- Small changes in data cause large changes in solution
- QR or SVD methods are more reliable than normal equations

## Lesson Plan

### Introduction (5 minutes)

Motivate with a real example: "Given noisy measurements, how do we find the best trend line?"

### Regression View Exploration (10 minutes)

1. Start with default points
2. Drag points to see line adjust
3. Discuss what "best fit" means (minimizing squared errors)
4. Show that residuals are vertical (why not perpendicular to line?)

### Geometric View Exploration (10 minutes)

1. Switch to geometric view
2. Explain Col(A) as the space of all possible Ax
3. Show that b is usually not in Col(A)
4. Identify Ax-hat as the closest point in Col(A)
5. Verify e is perpendicular to the plane

### Connecting the Views (5 minutes)

- Regression: minimize sum of squared residuals
- Geometric: minimize ||b - Ax||
- Both are the same optimization problem!

### Discussion Questions

1. Why do we square the residuals instead of using absolute values?
2. What would happen if all data points were collinear?
3. When might QR be preferred over normal equations?

## References

- Chapter 9: Solving Linear Systems - Least Squares section
- Chapter 7: Matrix Decompositions - QR Decomposition
- [3Blue1Brown: Least Squares](https://www.youtube.com/watch?v=PaVvduP_ZRc)
