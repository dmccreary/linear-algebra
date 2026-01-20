---
title: Gaussian Elimination Visualizer
description: Step-by-step animated guide through the Gaussian elimination algorithm with explanations
image: /sims/gaussian-elimination/gaussian-elimination.png
---
# Gaussian Elimination Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Gaussian Elimination MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

Watch the Gaussian elimination algorithm solve a system of linear equations step by step. Each operation is explained, helping you understand not just *what* happens but *why*.

**Algorithm Phases:**

1. **Forward Elimination**: Create zeros below each pivot to reach row echelon form
2. **Back Substitution**: Solve for variables starting from the last row

## How to Use

1. **Choose an Example**: Select a system size from the dropdown
2. **Step Through**: Click "Next Step" to advance one operation at a time
3. **Auto Solve**: Click "Auto Solve" to watch the algorithm run automatically
4. **Adjust Speed**: Use the slider to control auto-solve speed
5. **Reset**: Start over with the current or a new example

## Visual Guide

| Element | Meaning |
|---------|---------|
| Yellow circle | Current pivot position |
| Yellow row highlight | Row containing the pivot |
| Blue row highlight | Row being modified |
| Green box | Final solution |

## The Algorithm

**Forward Elimination:**

1. Find a non-zero pivot in the current column
2. Swap rows if necessary to position the pivot
3. Use row addition to create zeros below the pivot
4. Move to the next column and repeat

**Back Substitution:**

1. Start with the last row
2. Solve for the variable in that row
3. Substitute the known value into the row above
4. Repeat until all variables are found

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Execute the Gaussian elimination algorithm correctly
2. Identify pivot positions and understand their role
3. Explain why each row operation is performed
4. Apply back substitution to find the solution

### Suggested Activities

1. **Predict the Next Step**: Pause before each step and predict what operation will be performed
2. **Manual Verification**: After auto-solve completes, verify the solution by substitution
3. **Compare Approaches**: Note which pivots the algorithm chooses and discuss alternatives
4. **Error Analysis**: What happens if we skip a step or make an error?
