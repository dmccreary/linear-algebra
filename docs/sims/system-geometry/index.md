---
title: System of Equations Geometry
description: Interactive visualization showing how systems of linear equations correspond to geometric intersections of lines (2D) or planes (3D)
image: /sims/system-geometry/system-geometry.png
---
# System of Equations Geometry

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the System of Equations Geometry MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization helps students understand how the solution to a system of linear equations corresponds to the geometric intersection of lines (in 2D) or planes (in 3D).

**Key Features:**

- **2D Mode**: Visualize two linear equations as lines on a coordinate plane
- **3D Mode**: See the same equations extended as planes in 3D space
- **Real-time Updates**: Adjust coefficients with sliders and watch the geometry change instantly
- **Solution Detection**: Automatically identifies unique solutions, infinite solutions (coincident lines), or no solution (parallel lines)
- **Random Generator**: Create random systems to explore different scenarios

## How to Use

1. **Adjust Coefficients**: Use the sliders to change the values of a, b, and c for each equation in the form ax + by = c
2. **View Solution**: The green point marks the intersection (solution) when one exists
3. **Toggle Modes**: Switch between 2D and 3D views with the mode button
4. **Generate Random**: Click "Random" to create a new system
5. **Explore Cases**: Try creating parallel lines (no solution) or coincident lines (infinite solutions)

## Solution Types

| Configuration | Geometric Interpretation | Algebraic Meaning |
|--------------|-------------------------|-------------------|
| Lines intersect at one point | Unique solution | det(A) ≠ 0 |
| Lines are parallel | No solution | det(A) = 0, inconsistent |
| Lines are coincident | Infinite solutions | det(A) = 0, consistent |

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Interpret the solution of a system of linear equations geometrically
2. Identify when systems have unique, infinite, or no solutions
3. Connect the algebraic determinant condition to geometric configuration

### Suggested Activities

1. **Exploration**: Start with the default system (x + y = 3, x - y = 1) and verify the solution (2, 1) by substitution
2. **Create Parallel Lines**: Adjust coefficients to make the lines parallel. What pattern do you notice in the coefficients?
3. **Create Coincident Lines**: Make both equations represent the same line. How are the coefficients related?
4. **Predict Before Moving**: Before adjusting a slider, predict how the line will change

### Discussion Questions

- How does changing the constant term c affect the line's position?
- What coefficient patterns lead to parallel lines?
- In 3D mode, what does the intersection of two planes look like?
