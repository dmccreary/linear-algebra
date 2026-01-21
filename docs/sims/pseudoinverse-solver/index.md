---
title: Pseudoinverse Solver MicroSim
description: Interactive visualization of the Moore-Penrose pseudoinverse for solving least squares problems
image: /sims/pseudoinverse-solver/pseudoinverse-solver.png
---

# Pseudoinverse Solver MicroSim

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Pseudoinverse Solver Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates the **Moore-Penrose pseudoinverse** and how it solves least squares problems. The pseudoinverse $A^+$ provides a generalized solution to systems $Ax = b$ even when:

- The system is **overdetermined** (more equations than unknowns)
- The system is **underdetermined** (more unknowns than equations)
- The matrix is **rank-deficient** (linearly dependent rows or columns)

## Key Concepts

### The Pseudoinverse Solution

For any matrix $A$, the pseudoinverse $A^+$ provides:

$$x = A^+ b$$

This solution has two important properties:

1. **Least squares**: Minimizes $\|Ax - b\|$ when no exact solution exists
2. **Minimum norm**: Among all solutions, gives the one with smallest $\|x\|$

### SVD Connection

The pseudoinverse is computed from the SVD:

$$A = U \Sigma V^T$$

$$A^+ = V \Sigma^+ U^T$$

where $\Sigma^+$ has reciprocals of non-zero singular values.

## Preset Examples

| Example | Type | What It Shows |
|---------|------|---------------|
| Overdetermined (3x2) | More rows than columns | Least squares solution minimizing residual |
| Rank Deficient (3x2) | Linearly dependent columns | Pseudoinverse handles rank deficiency |
| Underdetermined (2x3) | More columns than rows | Minimum-norm solution among infinitely many |
| Full Rank (2x2) | Square invertible | Pseudoinverse equals regular inverse |

## How to Use

1. **Select a preset** to see different system types
2. **Modify matrix entries** directly in the input fields
3. Click **Compute Pseudoinverse** to update results
4. Toggle **Show SVD** to see the underlying decomposition
5. Observe the **residual norm** to verify solution quality

## Understanding the Display

- **Matrix A**: The input system matrix with rank indicator
- **Pseudoinverse A+**: The computed generalized inverse
- **Vector b**: The right-hand side target
- **Solution x**: The computed solution $x = A^+ b$
- **Residual r**: The error vector $r = Ax - b$
- **Residual Norm**: $\|r\|$ - should be minimal for least squares

## Learning Objectives

After using this MicroSim, students will be able to:

- Apply the pseudoinverse to solve overdetermined systems
- Explain why the pseudoinverse gives the least squares solution
- Identify rank-deficient systems and understand their solutions
- Compare pseudoinverse with normal equation approach
- Connect the pseudoinverse to SVD computation

## Mathematical Background

### Normal Equations vs Pseudoinverse

For full column rank matrices, the normal equation gives:

$$x = (A^T A)^{-1} A^T b$$

The pseudoinverse approach:

$$x = A^+ b = V \Sigma^+ U^T b$$

Both give the same result for full rank, but the pseudoinverse:

- Works for rank-deficient matrices
- Is numerically more stable
- Gives minimum-norm solution for underdetermined systems

### Geometric Interpretation

- **Overdetermined**: Projects $b$ onto column space of $A$
- **Underdetermined**: Finds the smallest $x$ in row space of $A$
- **Residual**: Always perpendicular to column space

## Observations to Make

### Overdetermined System (Default)

With the 3x2 system, notice:
- The residual is generally non-zero (no exact solution)
- The solution minimizes the squared error
- Adding the residual to $Ax$ gives exactly $b$

### Rank-Deficient System

When columns are linearly dependent:
- Rank is less than the number of columns
- Some singular values are zero
- Pseudoinverse still works correctly

### Underdetermined System

When there are more unknowns than equations:
- Infinitely many solutions exist
- Pseudoinverse gives the one with minimum $\|x\|$
- Residual is typically zero (exact solution exists)

## Lesson Plan

### Introduction (5 minutes)

Ask: "What do we do when a system has no exact solution?"

Introduce least squares as finding the closest approximation.

### Demonstration (10 minutes)

1. Start with the overdetermined preset
2. Show that the residual is non-zero but minimal
3. Try adjusting $b$ to make the system consistent (residual = 0)
4. Switch to underdetermined and observe minimum-norm property

### Key Insight

The pseudoinverse unifies:
- Solving overdetermined systems (least squares)
- Solving underdetermined systems (minimum norm)
- Handling rank deficiency gracefully

### Practice (10 minutes)

Have students:
1. Predict if a system will have zero or non-zero residual
2. Verify the least squares property manually
3. Compare with the normal equation when applicable

### Assessment Questions

1. Why is $\|Ax - b\| = 0$ not always achievable?
2. What does "minimum norm" mean geometrically?
3. When does $A^+ = A^{-1}$?

## References

- Chapter 7: Matrix Decompositions - Pseudoinverse section
- Chapter 9: Solving Linear Systems - Least Squares
- Strang, G. "Linear Algebra and Learning from Data"
