---
title: Homogeneous System Explorer
description: Explore homogeneous systems Ax = 0 and visualize their null spaces as subspaces through the origin
image: /sims/homogeneous-systems/homogeneous-systems.png
---
# Homogeneous System Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Homogeneous Systems MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

A **homogeneous system** has the form $Ax = 0$ where all right-hand side values are zero. These systems have special properties:

- The **trivial solution** $x = 0$ always exists
- **Nontrivial solutions** may or may not exist
- The set of all solutions forms a **subspace** (the null space of $A$)

## Key Concepts

**When do nontrivial solutions exist?**

| Condition | Nontrivial Solutions? |
|-----------|----------------------|
| Number of variables > number of equations | Always |
| rank(A) < number of variables | Yes |
| rank(A) = number of variables | No (only trivial) |

**Null Space Dimension:**

$$\text{dim(null space)} = n - \text{rank}(A)$$

where $n$ is the number of variables (columns of $A$).

## Visualizing the Null Space

| Null Space Dimension | Geometric Shape |
|---------------------|-----------------|
| 0 | Just the origin (point) |
| 1 | Line through origin |
| 2 | Plane through origin |
| k | k-dimensional subspace through origin |

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Identify when homogeneous systems have nontrivial solutions
2. Calculate the dimension of the null space from the rank
3. Visualize the null space as a geometric subspace
4. Understand why the null space always passes through the origin

### Suggested Activities

1. **Compare Examples**: Switch between presets and observe how the null space dimension changes
2. **Verify the Formula**: For each example, verify that dim(null space) = n - rank
3. **Geometric Intuition**: Drag to rotate the 3D view and understand the null space shape
4. **More Variables**: Notice that when n > m, nontrivial solutions are guaranteed
