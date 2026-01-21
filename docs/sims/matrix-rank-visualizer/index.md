---
title: Matrix Rank Visualizer
description: Interactive 3D visualization showing how matrix rank relates to the column space, with column vectors displayed geometrically
image: /sims/matrix-rank-visualizer/matrix-rank-visualizer.png
---

# Matrix Rank Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Matrix Rank Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates **matrix rank** by showing the geometric relationship between a matrix's column vectors and its column space.

**Key Concepts:**

- **Column vectors** are displayed as colored arrows in 3D space
- **Column space** is the span of all column vectors, shown as:
    - A **point** (rank 0) - zero matrix
    - A **line** (rank 1) - all columns are parallel
    - A **plane** (rank 2) - columns span a 2D subspace
    - **All of R³** (rank 3) - full rank, columns span 3D space
- **Row echelon form** shows pivot positions (highlighted in yellow)
- **Pivot columns** indicate which columns are linearly independent

## How to Use

1. **Select a preset** from the dropdown to see different rank scenarios
2. **Toggle checkboxes** to show/hide column vectors and column space
3. **Drag to rotate** the 3D view for different perspectives
4. **Observe** how the row echelon form reveals the rank

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain the geometric meaning of matrix rank
- Identify rank-deficient matrices visually
- Connect row echelon form to linear independence of columns
- Distinguish between full rank and rank-deficient cases

## Presets

| Preset | Matrix | Rank | Column Space |
|--------|--------|------|--------------|
| Rank 2 (Default) | [[1,2,3],[4,5,6],[7,8,9]] | 2 | Plane |
| Full Rank (3) | Identity matrix | 3 | All of R³ |
| Rank 1 | [[1,2,3],[2,4,6],[3,6,9]] | 1 | Line |
| Rank 0 (Zero) | Zero matrix | 0 | Point |

## Lesson Plan

### Introduction (5 minutes)
Start by asking students: "What does it mean for a matrix to be 'full rank'?" Introduce the concept that rank measures the dimension of the column space.

### Exploration (10 minutes)
Have students work through the presets:

1. Start with the **Full Rank** preset - observe that all three column vectors point in different directions
2. Switch to **Rank 2** - notice how the third column lies in the plane spanned by the first two
3. Try **Rank 1** - see how all columns are parallel (scalar multiples of each other)
4. Finally, **Rank 0** - the trivial case of the zero matrix

### Discussion Questions

1. Why is the rank of [[1,2,3],[4,5,6],[7,8,9]] equal to 2, not 3?
2. What happens to the column space when we have linearly dependent columns?
3. How does the row echelon form reveal which columns are pivot columns?

### Assessment
Ask students to predict the rank of a new matrix before computing it, based on visual inspection of the column vectors.

## References

- Chapter 7: Matrix Decompositions - Matrix Rank section
- [3Blue1Brown: Column Space](https://www.youtube.com/watch?v=uQhTuRlWMxw)
- Strang, G. "Linear Algebra and Its Applications" - Chapter on Vector Spaces
