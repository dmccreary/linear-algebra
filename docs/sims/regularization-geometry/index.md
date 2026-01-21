---
title: Regularization Geometry Visualizer
description: Interactive visualization showing how L1 and L2 regularization constrain model weights geometrically, and why L1 regularization produces sparse solutions.
image: /sims/regularization-geometry/regularization-geometry.png
og:image: /sims/regularization-geometry/regularization-geometry.png
twitter:image: /sims/regularization-geometry/regularization-geometry.png
quality_score: 85
social:
   cards: false
---

# Regularization Geometry Visualizer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Regularization Geometry Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates the geometric interpretation of regularization in machine learning. By showing how constraint regions (L1 diamond or L2 circle) intersect with loss function contours, students can understand why L1 regularization produces sparse solutions while L2 produces smooth shrinkage.

**Learning Objective:** Understand how L1 and L2 regularization constrain weights geometrically and why L1 produces sparsity.

## How to Use

1. **Drag the OLS Point**: Click and drag the red OLS (Ordinary Least Squares) solution point to different locations
2. **Adjust Regularization Strength**: Use the alpha slider to change the constraint region size
3. **Toggle L1/L2**: Click the buttons to switch between Lasso (L1) and Ridge (L2) regularization
4. **Show Regularization Path**: Enable to see how the solution moves as alpha changes
5. **Animate**: Watch the regularized solution evolve as constraint strength increases

## Key Concepts Demonstrated

### L2 Regularization (Ridge)

$$\min_\theta \|y - X\theta\|_2^2 + \alpha \|\theta\|_2^2$$

- Constraint region is a **circle**
- Solution is found where loss contour is tangent to circle
- All weights shrink proportionally toward zero
- Weights become small but rarely exactly zero

### L1 Regularization (Lasso)

$$\min_\theta \|y - X\theta\|_2^2 + \alpha \|\theta\|_1$$

- Constraint region is a **diamond** (rotated square)
- Solution often hits corners of the diamond
- **Corners lie on the axes** where one or more weights equal zero
- This produces **sparse solutions** with exact zeros

### Why L1 Produces Sparsity

The key insight is geometric:

- **Elliptical loss contours** typically first touch the diamond constraint at a **corner**
- Corners of the diamond correspond to **sparse solutions** (weights on axes)
- For L2, the smooth circle has no corners, so solutions rarely hit the axes exactly

## Mathematical Interpretation

### Constrained vs Penalized Form

The visualization shows the **constrained form**:

- L2: $\|\theta\|_2 \leq t$ (inside circle)
- L1: $\|\theta\|_1 \leq t$ (inside diamond)

This is equivalent to the **penalized form** used in practice, where $\alpha$ controls the tradeoff.

### The Regularization Path

As $\alpha$ increases (constraint tightens):

- L2: Solution moves smoothly toward origin along a curved path
- L1: Solution moves toward axes, with weights becoming exactly zero

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/regularization-geometry/main.html"
        height="532px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate machine learning or statistics course

### Duration
20-25 minutes

### Prerequisites
- Understanding of least squares regression
- Familiarity with norms (L1 and L2)
- Basic optimization concepts

### Learning Activities

1. **Exploration (5 min)**:
   - Start with L2 regularization
   - Drag the OLS solution to various positions
   - Observe how the regularized solution moves along the circle boundary
   - Note that both weights shrink but neither becomes exactly zero

2. **L1 Discovery (5 min)**:
   - Switch to L1 regularization
   - Observe that the constraint region is now a diamond
   - Drag the OLS solution and watch the regularized solution
   - Notice when the solution "snaps" to an axis (sparse solution)

3. **Comparative Analysis (5 min)**:
   - Enable "Show Regularization Path"
   - Click "Animate" to watch the full path
   - Compare paths for L1 vs L2
   - Identify when L1 produces exact zeros

4. **Critical Thinking (5 min)**:
   - Why do the corners of the diamond lie on the axes?
   - What OLS positions produce sparse solutions most easily?
   - How does ellipse orientation affect the result?

5. **Application Discussion (5 min)**:
   - When would you prefer L1 over L2?
   - Feature selection implications
   - Real-world examples (gene selection, image compression)

### Discussion Questions

1. Why is the L1 constraint region diamond-shaped?
2. For what OLS solution positions will L1 definitely produce sparsity?
3. How does the regularization path differ between L1 and L2?
4. Why might L2 be preferred when all features are believed to be relevant?
5. What happens when the OLS solution is already close to the origin?

### Assessment Ideas

- Predict whether L1 or L2 will produce a sparse solution for a given OLS position
- Explain geometrically why L1 promotes sparsity
- Calculate the regularized solution for simple cases
- Compare elastic net (combination of L1 and L2) behavior

## Connections to Machine Learning

### Ridge Regression (L2)
- Used when multicollinearity is present
- Keeps all features with reduced magnitudes
- Closed-form solution exists

### Lasso Regression (L1)
- Automatic feature selection
- Produces interpretable sparse models
- No closed-form solution (requires iterative methods)

### Elastic Net
- Combines L1 and L2 penalties
- Benefits of both sparsity and grouped selection
- Useful when features are correlated

## References

1. Hastie, T., Tibshirani, R., & Friedman, J. (2009). *The Elements of Statistical Learning*. Springer. Chapter 3.
2. [Visual explanation of regularization](https://explained.ai/regularization/) - Terence Parr
3. [Why L1 norm for sparse models](https://stats.stackexchange.com/questions/45643/why-l1-norm-for-sparse-models) - Cross Validated
4. Tibshirani, R. (1996). Regression shrinkage and selection via the lasso. *Journal of the Royal Statistical Society*, 58(1), 267-288.
