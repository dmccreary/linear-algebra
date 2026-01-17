---
title: Norm Comparison Visualizer
description: Interactive visualization comparing L1 (Manhattan), L2 (Euclidean), and L-infinity (Maximum) norms through their unit shapes and distance measurements.
image: /sims/norm-comparison-visualizer/norm-comparison-visualizer.png
og:image: /sims/norm-comparison-visualizer/norm-comparison-visualizer.png
twitter:image: /sims/norm-comparison-visualizer/norm-comparison-visualizer.png
quality_score: 85
social:
   cards: false
---

# Norm Comparison Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Norm Comparison Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This visualization helps students understand different ways to measure vector "length" or distance. By showing the unit "circles" for L1, L2, and L-infinity norms simultaneously, students can see how each norm defines what it means for a vector to have "length 1."

**Learning Objective:** Students will compare and contrast L1, L2, and L-infinity norms by observing unit circles and distance measurements for each norm type.

## How to Use

1. **Drag the Point**: Click and drag the black point to any location on the grid
2. **Observe Norm Values**: The info panel shows all three norm values for the current point
3. **Compare Unit Shapes**:
   - **Blue Circle**: L2 norm (Euclidean) - points at distance 1 from origin
   - **Green Diamond**: L1 norm (Manhattan) - points with L1 distance 1 from origin
   - **Orange Square**: L∞ norm (Maximum) - points with L∞ distance 1 from origin
4. **Toggle Norms**: Use checkboxes to show/hide each norm's unit shape
5. **Adjust Radius**: Use the slider to see how the shapes scale
6. **Animate**: Watch the point move around the L2 unit circle

## Key Concepts Demonstrated

### L2 Norm (Euclidean)
$$\|\mathbf{v}\|_2 = \sqrt{x^2 + y^2}$$
- Standard "straight-line" distance
- Unit shape is a circle
- Used in: Least squares regression, ridge regularization

### L1 Norm (Manhattan)
$$\|\mathbf{v}\|_1 = |x| + |y|$$
- Distance measured along axes (like city blocks)
- Unit shape is a diamond (rotated square)
- Used in: Lasso regularization, sparse solutions

### L∞ Norm (Maximum)
$$\|\mathbf{v}\|_\infty = \max(|x|, |y|)$$
- Maximum absolute component value
- Unit shape is a square
- Used in: Constraining maximum deviation

## Why Different Norms Matter

- **For (3, 4)**: L1 = 7, L2 = 5, L∞ = 4
- The same point can have very different "distances" depending on which norm you use
- In machine learning, L1 promotes sparse solutions while L2 distributes weight evenly

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/norm-comparison-visualizer/main.html"
        height="502px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate introductory linear algebra or machine learning

### Duration
15-20 minutes

### Prerequisites
- Basic understanding of vectors and distance
- Familiarity with absolute value

### Learning Activities

1. **Exploration (5 min)**:
   - Drag the point to various locations
   - Observe how the three norm values change differently
   - Find points where two norms give the same value

2. **Unit Shape Analysis (5 min)**:
   - Turn off two norms and examine one at a time
   - Drag the point onto each boundary
   - Notice the indicator when point is "on boundary"

3. **Comparison Activity (5 min)**:
   - Find a point where L1 > L2 > L∞
   - Find a point where all three norms are equal (hint: on an axis)
   - Predict which norm will be largest for a given point

4. **Application Discussion (5 min)**:
   - Why might we use L1 in machine learning?
   - What does it mean geometrically for L1 to "promote sparsity"?

### Discussion Questions

1. Why is the L1 unit "circle" a diamond shape?
2. For what points are all three norms equal?
3. Which norm gives the smallest value for most points? Why?
4. How does the relationship between norms change as points move farther from the origin?

### Assessment Ideas

- Calculate all three norms for a given vector
- Predict which shape a point is inside/outside of
- Explain why L1 regularization promotes sparse solutions

## References

1. [Understanding Different Norms](https://mathworld.wolfram.com/VectorNorm.html) - Wolfram MathWorld
2. [L1 vs L2 Regularization](https://www.youtube.com/watch?v=QNxQWjITiB4) - StatQuest
3. [Why L1 promotes sparsity](https://stats.stackexchange.com/questions/45643/why-l1-norm-for-sparse-models) - Cross Validated discussion
4. Boyd, S. & Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press.
