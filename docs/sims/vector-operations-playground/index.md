---
title: Vector Operations Playground
description: Interactive visualization of vector addition, subtraction, and scalar multiplication with draggable vectors and geometric constructions.
image: /sims/vector-operations-playground/vector-operations-playground.png
og:image: /sims/vector-operations-playground/vector-operations-playground.png
twitter:image: /sims/vector-operations-playground/vector-operations-playground.png
quality_score: 85
social:
   cards: false
---

# Vector Operations Playground

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Vector Operations Playground Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive playground allows students to explore vector operations by directly manipulating vectors and observing the results in real-time. Students can perform vector addition, subtraction, and scalar multiplication while seeing both the geometric and numerical representations.

**Learning Objective:** Students will apply vector addition, subtraction, and scalar multiplication by manipulating vectors interactively and predicting results before seeing them visualized.

## How to Use

1. **Drag Vectors**: Click and drag the circular endpoints of vectors **u** (blue) and **v** (red) to position them anywhere on the grid
2. **Select Operation**: Use the radio buttons to choose between:
   - **Add**: Shows u + v (green result vector)
   - **Subtract**: Shows u - v (green result vector)
   - **Scalar ×**: Shows c·u where c is controlled by the slider
3. **Adjust Scalar**: When in scalar multiplication mode, use the slider to change the scalar value from -3 to 3
4. **Toggle Visualizations**:
   - **Parallelogram**: Shows the parallelogram construction for addition
   - **Components**: Shows projection lines to the axes
5. **Animate**: Click to see a step-by-step animation of the operation
6. **Reset**: Return all vectors to their default positions

## Key Concepts Demonstrated

- **Vector Addition**: The parallelogram rule and tip-to-tail method
- **Vector Subtraction**: Finding the difference vector u - v
- **Scalar Multiplication**: How scalars stretch, shrink, or reverse vectors
- **Component Operations**: How operations work on individual components

## Mathematical Formulas

**Addition:** $\mathbf{u} + \mathbf{v} = (u_x + v_x, u_y + v_y)$

**Subtraction:** $\mathbf{u} - \mathbf{v} = (u_x - v_x, u_y - v_y)$

**Scalar Multiplication:** $c\mathbf{u} = (c \cdot u_x, c \cdot u_y)$

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/vector-operations-playground/main.html"
        height="552px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate introductory linear algebra or advanced high school mathematics

### Duration
20-25 minutes

### Prerequisites
- Understanding of 2D coordinate systems
- Basic knowledge of vectors as arrows with magnitude and direction

### Learning Activities

1. **Exploration (5 min)**: Let students freely drag vectors and observe how operations change
2. **Addition Investigation (5 min)**:
   - Enable parallelogram view
   - Ask students to verify the parallelogram rule geometrically
   - Have them predict the sum before moving vectors
3. **Subtraction Investigation (5 min)**:
   - Switch to subtraction mode
   - Explore how u - v relates to the vector from v's tip to u's tip
4. **Scalar Multiplication (5 min)**:
   - Vary the scalar from -3 to 3
   - Observe what happens at c = 0, c = 1, c = -1
5. **Synthesis (5 min)**: Combine concepts to solve problems

### Discussion Questions

1. What is the geometric meaning of the parallelogram in vector addition?
2. If u + v = w, what is u - v geometrically?
3. What happens to the direction of a vector when multiplied by a negative scalar?
4. Can two different pairs of vectors have the same sum?

### Assessment Ideas

- Given a target point, find u and v that add to reach it
- Predict the result of an operation before seeing it
- Find a scalar that makes cu equal to a specific vector

## References

1. [3Blue1Brown - Linear combinations, span, and basis vectors](https://www.youtube.com/watch?v=k7RM-ot2NWY)
2. [Khan Academy - Vector Addition](https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/vectors/v/adding-vectors)
3. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Wellesley-Cambridge Press. Chapter 1.
