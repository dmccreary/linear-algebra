---
title: System of Equations Geometry
description: Interactive visualization showing how systems of linear equations correspond to geometric intersections of lines
image: /sims/system-geometry/system-geometry.png
---
# System of Equations Geometry

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the System of Equations Geometry MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization helps students understand how the solution to a system of linear equations corresponds to the geometric intersection of lines on a coordinate plane.

**Key Features:**

- **Line Visualization**: See two linear equations displayed as colored lines on a coordinate grid
- **Real-time Updates**: Adjust coefficients with sliders and watch the geometry change instantly
- **Solution Detection**: Automatically identifies unique solutions, infinite solutions (coincident lines), or no solution (parallel lines)
- **Random Generator**: Create random systems that always have solutions within the visible grid

## How to Use

1. **Adjust Coefficients**: Use the sliders to change the values of a, b, and c for each equation in the form ax + by = c
2. **View Solution**: The green point marks the intersection (solution) when one exists
3. **Generate Random**: Click "Random" to create a new system with a guaranteed solution
4. **Explore Cases**: Try creating parallel lines (no solution) or coincident lines (infinite solutions)

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
- Why does the determinant being zero correspond to parallel or coincident lines?
