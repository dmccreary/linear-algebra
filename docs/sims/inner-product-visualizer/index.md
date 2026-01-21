---
title: Inner Product Space Visualizer
description: Interactive visualization showing how different inner products define different notions of length and angle, including standard dot product and weighted inner products.
image: /sims/inner-product-visualizer/inner-product-visualizer.png
og:image: /sims/inner-product-visualizer/inner-product-visualizer.png
twitter:image: /sims/inner-product-visualizer/inner-product-visualizer.png
quality_score: 85
social:
   cards: false
---

# Inner Product Space Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Inner Product Space Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Inner Product Space Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization helps students understand how different inner products define different geometric structures. The same pair of vectors can have different lengths and angles depending on which inner product is used. By adjusting the weight matrix W, students can see how the unit "circle" transforms into an ellipse and how this affects all geometric measurements.

**Learning Objective:** Visualize how different inner products define different notions of length and angle.

## How to Use

1. **Drag the Vectors**: Click and drag the endpoints of vectors u (blue) and v (red) to any position
2. **Select Inner Product Type**:
   - **Standard dot product**: The familiar $\langle u, v \rangle = u_1 v_1 + u_2 v_2$
   - **Weighted (diagonal W)**: Adjust w11 and w22 to scale x and y differently
   - **Weighted (general W)**: Add w12 to create off-diagonal terms (cross-coupling)
3. **Observe the Unit Ball**: The green shape shows all vectors of norm 1 under the current inner product
4. **Check Cauchy-Schwarz**: The inequality $|\langle u, v \rangle| \leq \|u\| \|v\|$ is verified in real-time

## Key Concepts Demonstrated

### Standard Inner Product (Dot Product)
$$\langle u, v \rangle = u^T v = u_1 v_1 + u_2 v_2$$

- Unit ball is a circle
- Angle and length match our geometric intuition
- Norm: $\|v\| = \sqrt{v_1^2 + v_2^2}$

### Weighted Inner Product
$$\langle u, v \rangle_W = u^T W v$$

where W is a symmetric positive definite matrix:
$$W = \begin{pmatrix} w_{11} & w_{12} \\ w_{12} & w_{22} \end{pmatrix}$$

- Unit ball becomes an ellipse
- The ellipse orientation depends on the eigenvectors of W
- The ellipse semi-axes are related to $1/\sqrt{\lambda_i}$ where $\lambda_i$ are eigenvalues

### Induced Norm
$$\|v\|_W = \sqrt{\langle v, v \rangle_W} = \sqrt{v^T W v}$$

### Angle Between Vectors
$$\cos(\theta) = \frac{\langle u, v \rangle_W}{\|u\|_W \|v\|_W}$$

The angle depends on which inner product we use!

## Cauchy-Schwarz Inequality

For any inner product:
$$|\langle u, v \rangle| \leq \|u\| \cdot \|v\|$$

Equality holds if and only if u and v are linearly dependent (collinear).

This fundamental inequality is verified visually in the simulation. Try making the vectors collinear to see equality achieved.

## Why Inner Products Matter

- **Machine Learning**: Different inner products measure similarity differently
- **Optimization**: The metric tensor defines gradient descent geometry
- **Physics**: Minkowski inner product in special relativity
- **Statistics**: Mahalanobis distance uses covariance-weighted inner product

## Exploration Activities

1. **Standard vs Weighted**: Set u = (2, 0) and v = (0, 2). Note they are perpendicular under standard inner product. Now increase w11 to 2. Are they still perpendicular?

2. **Unit Ball Shape**: With diagonal W, set w11 = 2 and w22 = 0.5. The unit ball should be an ellipse stretched along the y-axis.

3. **Off-Diagonal Effects**: With general W, add w12 = 0.5. Notice how the ellipse rotates.

4. **Cauchy-Schwarz**: Move v to be collinear with u. Watch the inequality become an equality.

## Lesson Plan

### Grade Level
Undergraduate linear algebra or advanced high school

### Duration
20-30 minutes

### Prerequisites
- Vector operations
- Dot product basics
- Matrix-vector multiplication
- Positive definite matrices (helpful but can be introduced)

### Learning Activities

1. **Exploration (5-7 min)**: Use standard inner product, drag vectors, observe angle and norms

2. **Introduce Weighting (5-7 min)**: Switch to diagonal W, adjust w11 and w22, observe unit ball and measurements change

3. **General Weights (5-7 min)**: Enable general W, add w12, see ellipse rotation

4. **Cauchy-Schwarz Verification (5 min)**: Test the inequality with various vector configurations

### Discussion Questions

1. If two vectors are perpendicular under one inner product, are they perpendicular under all inner products?

2. What happens to the unit ball as w11 approaches 0? Why can't W have a zero eigenvalue?

3. Why must W be positive definite for this to be a valid inner product?

4. How does the weighted inner product relate to the Mahalanobis distance in statistics?

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/inner-product-visualizer/main.html"
        height="502px"
        width="100%"
        scrolling="no">
</iframe>
```

## References

1. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Wellesley-Cambridge Press.
2. [Inner Product Spaces](https://mathworld.wolfram.com/InnerProductSpace.html) - Wolfram MathWorld
3. [Cauchy-Schwarz Inequality](https://www.youtube.com/watch?v=YiH_Br0D03o) - 3Blue1Brown
4. Boyd, S. & Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press. (Chapter on norms and inner products)
