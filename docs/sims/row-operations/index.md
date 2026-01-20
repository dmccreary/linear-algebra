---
title: Row Operations Practice
description: Interactive practice tool for applying elementary row operations on augmented matrices
image: /sims/row-operations/row-operations.png
---
# Row Operations Practice

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Row Operations MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

Practice applying the three elementary row operations on an augmented matrix. This tool helps build fluency with the operations used in Gaussian elimination.

**The Three Row Operations:**

| Operation | Notation | Description |
|-----------|----------|-------------|
| Row Swap | R₁ ↔ R₂ | Exchange two rows |
| Row Scaling | k × Rᵢ → Rᵢ | Multiply a row by a nonzero constant |
| Row Addition | Rᵢ + k×Rⱼ → Rᵢ | Add a multiple of one row to another |

## How to Use

1. **Select Operation Type**: Choose Swap, Scale, or Add Multiple from the dropdown
2. **Choose Rows**: Select which row(s) the operation affects
3. **Set Scalar**: For scaling or adding, enter the multiplier value
4. **Apply**: Click "Apply Operation" to execute
5. **Track Progress**: View your operation history on the right
6. **Undo/Reset**: Use Undo to step back or Reset to start over

## Default System

The default matrix represents this system:

$$2x + y - z = 8$$
$$-3x - y + 2z = -11$$
$$-2x + y + 2z = -3$$

The solution is $x = 2$, $y = 3$, $z = -1$.

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Execute the three elementary row operations correctly
2. Understand how row operations preserve the solution set
3. Develop intuition for which operations help reach row echelon form

### Suggested Activities

1. **Reduce to REF**: Use row operations to reduce the matrix to row echelon form
2. **Minimal Operations Challenge**: Find the shortest sequence of operations to reach REF
3. **Reverse Engineering**: Given an REF matrix, work backward to find an original system
4. **Create Zeros**: Practice creating zeros below pivots using row addition

### Tips for Efficient Reduction

- Start with the leftmost column
- Use row swaps to place a convenient pivot at the top
- Scale to get a leading 1 (optional but often helpful)
- Use row addition to create zeros below each pivot
- Move right and repeat
