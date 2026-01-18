---
title: Systems of Linear Equations
description: Formulating and solving systems of linear equations using Gaussian elimination, row echelon forms, and solution analysis
generated_by: claude skill chapter-content-generator
date: 2026-01-17 16:00:00
version: 0.03
status: draft
---

# Systems of Linear Equations

## Summary

This chapter teaches you to formulate and solve systems of linear equations, a fundamental skill with applications across all quantitative fields. You will master Gaussian elimination, understand row echelon forms, and learn to analyze when solutions exist, are unique, or are infinite. These computational techniques are essential for everything from optimization to neural network training.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Linear Equation
2. System of Equations
3. Matrix Equation Form
4. Augmented Matrix
5. Gaussian Elimination
6. Row Operations
7. Row Swap
8. Row Scaling
9. Row Addition
10. Row Echelon Form
11. Reduced Row Echelon Form
12. Pivot Position
13. Pivot Column
14. Free Variable
15. Basic Variable
16. Solution Set
17. Unique Solution
18. Infinite Solutions
19. No Solution
20. Homogeneous System
21. Trivial Solution
22. Numerical Stability
23. Back Substitution

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)

---

## Introduction

Systems of linear equations appear everywhere in science, engineering, and data analysis. Whether you're balancing chemical reactions, analyzing electrical circuits, fitting models to data, or training neural networks, you're solving linear systems. This chapter develops the systematic methods for solving these systems and—equally important—understanding when solutions exist and what form they take.

The power of linear algebra lies in its ability to represent complex systems compactly and solve them efficiently. A problem that might involve dozens or thousands of equations becomes a single matrix equation, and the solution emerges through systematic elimination procedures that computers execute with remarkable speed.

## Linear Equations and Systems

### What is a Linear Equation?

A **linear equation** in variables $x_1, x_2, \ldots, x_n$ has the form:

#### Linear Equation Standard Form

$a_1 x_1 + a_2 x_2 + \cdots + a_n x_n = b$

where:

- $a_1, a_2, \ldots, a_n$ are the coefficients (constants)
- $x_1, x_2, \ldots, x_n$ are the variables (unknowns)
- $b$ is the constant term (right-hand side)

The equation is "linear" because each variable appears only to the first power and is not multiplied by other variables. The graph of a linear equation in two variables is a line; in three variables, it's a plane.

Examples of linear equations:

- $3x + 2y = 7$
- $x_1 - 4x_2 + x_3 = 0$
- $w + 2x - y + 3z = 5$

Non-linear equations (not covered by these methods):

- $x^2 + y = 5$ (squared term)
- $xy = 3$ (product of variables)
- $\sin(x) + y = 1$ (nonlinear function)

### Systems of Equations

A **system of equations** is a collection of two or more equations involving the same variables. A solution to the system must satisfy all equations simultaneously.

Consider a system of $m$ linear equations in $n$ unknowns:

$a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1$

$a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2$

$\vdots$

$a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n = b_m$

Geometrically, each equation defines a hyperplane, and solving the system means finding where all hyperplanes intersect.

| Equations | Variables | Geometric Interpretation |
|-----------|-----------|-------------------------|
| 2 equations | 2 variables | Intersection of two lines |
| 3 equations | 3 variables | Intersection of three planes |
| $m$ equations | $n$ variables | Intersection of $m$ hyperplanes in $\mathbb{R}^n$ |

#### Diagram: System of Equations Geometry

<iframe src="../../sims/system-geometry/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>System of Equations Geometric Visualization</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: interpret, explain

Learning Objective: Help students visualize how the solution to a system of linear equations corresponds to the geometric intersection of lines (2D) or planes (3D).

Canvas layout:
- Main area: 2D/3D coordinate system with equations plotted
- Right panel: Equation display and controls

Visual elements:
- 2D mode: Two or three lines with intersection point highlighted
- 3D mode: Two or three planes with intersection shown
- Solution point marked with a distinct marker
- Coordinate axes with labels
- Grid for reference

Interactive controls:
- Toggle: 2D / 3D mode
- Sliders: Coefficients for each equation (a, b, c values)
- Dropdown: Number of equations (2 or 3)
- Checkbox: Show solution coordinates
- Button: Generate random system
- Dropdown: Solution type (unique, infinite, none)

Default parameters:
- Mode: 2D
- Equations: 2
- Example: x + y = 3, x - y = 1 (solution at (2, 1))

Behavior:
- Lines/planes update in real-time as coefficients change
- Intersection point updates dynamically
- When lines are parallel (no solution), display message
- When lines are coincident (infinite solutions), highlight entire line
- 3D mode allows rotation and zoom

Implementation: p5.js with WEBGL for 3D mode
</details>

## Matrix Representation

### Matrix Equation Form

Any system of linear equations can be written compactly as a single **matrix equation**:

#### Matrix Equation Form

$\mathbf{A}\mathbf{x} = \mathbf{b}$

where:

- $\mathbf{A}$ is the $m \times n$ coefficient matrix
- $\mathbf{x}$ is the $n \times 1$ vector of unknowns
- $\mathbf{b}$ is the $m \times 1$ vector of constants

For the system:

$2x + 3y = 8$

$x - y = 1$

The matrix form is:

$\begin{bmatrix} 2 & 3 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 8 \\ 1 \end{bmatrix}$

This representation reveals the structure: the coefficient matrix $\mathbf{A}$ encodes how variables combine, while $\mathbf{b}$ specifies the targets.

### The Augmented Matrix

The **augmented matrix** combines the coefficient matrix and the right-hand side into a single matrix for manipulation:

$[\mathbf{A} \mid \mathbf{b}] = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} & | & b_1 \\ a_{21} & a_{22} & \cdots & a_{2n} & | & b_2 \\ \vdots & \vdots & \ddots & \vdots & | & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} & | & b_m \end{bmatrix}$

The vertical bar separates coefficients from constants, though it's sometimes omitted. All solution procedures work on the augmented matrix, treating coefficients and constants together.

For our example:

$\begin{bmatrix} 2 & 3 & | & 8 \\ 1 & -1 & | & 1 \end{bmatrix}$

!!! note "Why Augmented Matrices?"
    The augmented matrix is the standard data structure for solving linear systems. It keeps all relevant information together and allows us to track how row operations affect both coefficients and constants simultaneously.

## Row Operations

The key to solving linear systems is transforming the augmented matrix into a simpler form while preserving the solution set. Three **row operations** accomplish this.

### The Three Elementary Row Operations

1. **Row Swap** (Interchange): Exchange two rows
   - Notation: $R_i \leftrightarrow R_j$
   - Swaps row $i$ with row $j$

2. **Row Scaling** (Multiplication): Multiply a row by a nonzero constant
   - Notation: $kR_i \rightarrow R_i$ (where $k \neq 0$)
   - Multiplies every entry in row $i$ by $k$

3. **Row Addition** (Replacement): Add a multiple of one row to another
   - Notation: $R_i + kR_j \rightarrow R_i$
   - Adds $k$ times row $j$ to row $i$

| Operation | Effect | Preserves Solutions? |
|-----------|--------|---------------------|
| Row Swap | Reorders equations | Yes |
| Row Scaling | Scales an equation | Yes (if $k \neq 0$) |
| Row Addition | Combines equations | Yes |

These operations correspond to valid algebraic manipulations of equations:

- Swapping two equations doesn't change solutions
- Multiplying an equation by a nonzero constant doesn't change its solutions
- Adding equations produces a valid new equation satisfied by the same solutions

#### Diagram: Row Operations Interactive

<iframe src="../../sims/row-operations/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Row Operations Step-by-Step Visualizer</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: execute, demonstrate

Learning Objective: Enable students to practice applying the three elementary row operations and observe how they transform the augmented matrix while preserving solutions.

Canvas layout:
- Top: Current augmented matrix (large, clear display)
- Middle: Operation selector and parameters
- Bottom: History of operations performed

Visual elements:
- Matrix displayed as a grid with clear row/column separation
- Active rows highlighted during operation
- Animation showing transformation
- Vertical bar separating coefficients from constants
- Operation history as a scrollable list

Interactive controls:
- Dropdown: Select operation (Swap, Scale, Add)
- For Swap: Two row selectors
- For Scale: Row selector + scalar input (prevent 0)
- For Add: Target row + source row + multiplier
- Button: Apply operation
- Button: Undo last operation
- Button: Reset to original
- Toggle: Show intermediate steps with animation

Default parameters:
- Starting matrix: 3×4 augmented matrix
- Example system: 2x + y - z = 8, -3x - y + 2z = -11, -2x + y + 2z = -3

Behavior:
- Selected rows highlight before operation
- Animation shows values changing
- History updates with notation (e.g., "R₁ ↔ R₂")
- Undo restores previous state
- Invalid operations (scaling by 0) show error

Implementation: p5.js with animation states
</details>

## Gaussian Elimination

**Gaussian elimination** is the systematic procedure for reducing an augmented matrix to row echelon form using row operations. Named after Carl Friedrich Gauss, this algorithm is the workhorse of computational linear algebra.

### The Algorithm

Gaussian elimination proceeds column by column, from left to right:

1. **Find a pivot**: Locate the leftmost column with a nonzero entry
2. **Position the pivot**: Use row swaps to move a nonzero entry to the top of the working submatrix
3. **Eliminate below**: Use row addition to create zeros below the pivot
4. **Move down**: Repeat for the next column with the remaining rows

The goal is to create an "upper triangular" structure where all entries below the main diagonal are zero.

### Row Echelon Form

A matrix is in **row echelon form** (REF) if:

- All zero rows are at the bottom
- The leading entry (first nonzero entry) of each row is to the right of the leading entry of the row above
- All entries below a leading entry are zero

A **pivot position** is the location of a leading 1 (or leading nonzero entry). A **pivot column** is a column containing a pivot position.

Example of row echelon form:

$\begin{bmatrix} \boxed{2} & 3 & -1 & | & 5 \\ 0 & \boxed{1} & 4 & | & -2 \\ 0 & 0 & \boxed{3} & | & 6 \end{bmatrix}$

The boxed entries are pivots. Each pivot is to the right of the pivot above it.

### Back Substitution

Once a matrix is in row echelon form, we solve for the variables using **back substitution**—working from the bottom row upward:

1. Solve the last equation for its variable
2. Substitute into the equation above and solve
3. Continue upward until all variables are found

For the example above:

- Row 3: $3z = 6 \Rightarrow z = 2$
- Row 2: $y + 4(2) = -2 \Rightarrow y = -10$
- Row 1: $2x + 3(-10) - 2 = 5 \Rightarrow x = 18.5$

#### Diagram: Gaussian Elimination Visualizer

<iframe src="../../sims/gaussian-elimination/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Gaussian Elimination Step-by-Step Animator</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: execute, implement

Learning Objective: Guide students through the complete Gaussian elimination algorithm, showing each row operation and explaining why it's performed.

Canvas layout:
- Top: Current matrix state with pivot highlighted
- Middle: Current operation being performed with explanation
- Bottom: Controls and solution display

Visual elements:
- Matrix with current pivot position highlighted in yellow
- Rows being modified highlighted in blue
- Zeros created by elimination shown in green (briefly)
- Current column being processed indicated
- Progress indicator showing algorithm phase
- Final solution displayed when complete

Interactive controls:
- Button: Next Step (advances one row operation)
- Button: Auto-solve (animates entire solution)
- Slider: Animation speed
- Button: Reset
- Dropdown: Example system (2×2, 3×3, 4×4)
- Toggle: Show explanatory text for each step
- Checkbox: Enable back substitution phase

Default parameters:
- Matrix size: 3×3
- Animation speed: 1 second per step
- Show explanations: true

Behavior:
- Each step highlights the relevant rows and pivot
- Explanation text describes the operation and purpose
- Algorithm phases clearly labeled (Forward elimination, Back substitution)
- Solution verified by substitution at end
- Can step forward/backward through operations

Implementation: p5.js with state machine for algorithm steps
</details>

## Reduced Row Echelon Form

While row echelon form allows back substitution, **reduced row echelon form** (RREF) goes further to directly reveal solutions.

### Definition and Properties

A matrix is in **reduced row echelon form** if:

- It is in row echelon form
- Each pivot is 1
- Each pivot is the only nonzero entry in its column

The Gauss-Jordan elimination algorithm extends Gaussian elimination to produce RREF by:

1. Scaling each pivot row to make the pivot equal to 1
2. Eliminating entries above each pivot (not just below)

Example transformation to RREF:

$\begin{bmatrix} 2 & 3 & -1 & | & 5 \\ 0 & 1 & 4 & | & -2 \\ 0 & 0 & 3 & | & 6 \end{bmatrix} \rightarrow \begin{bmatrix} 1 & 0 & 0 & | & 18.5 \\ 0 & 1 & 0 & | & -10 \\ 0 & 0 & 1 & | & 2 \end{bmatrix}$

In RREF, the solution is immediately visible: $x = 18.5$, $y = -10$, $z = 2$.

### Comparing REF and RREF

| Property | Row Echelon Form | Reduced Row Echelon Form |
|----------|-----------------|-------------------------|
| Zero rows | At bottom | At bottom |
| Leading entries | Nonzero (any value) | Exactly 1 |
| Below pivots | All zeros | All zeros |
| Above pivots | Any value | All zeros |
| Solution method | Back substitution | Direct reading |
| Uniqueness | Not unique | Unique |

!!! tip "Computational Efficiency"
    For solving a single system, stopping at REF and using back substitution is often more efficient. RREF requires additional operations. However, RREF is valuable for understanding solution structure and for systems requiring multiple right-hand sides.

#### Diagram: REF vs RREF Comparison

<iframe src="../../sims/ref-vs-rref/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>REF vs RREF Side-by-Side Comparison</summary>
Type: infographic

Bloom Level: Analyze (L4)
Bloom Verb: compare, differentiate

Learning Objective: Help students understand the difference between row echelon form and reduced row echelon form, and when each is preferable.

Layout: Side-by-side matrix displays with transformation arrows

Visual elements:
- Left panel: Original matrix
- Center-left: Row echelon form with pivots highlighted
- Center-right: Reduced row echelon form with pivots highlighted
- Annotations showing key differences
- Color coding: pivots (gold), zeros created (green), coefficients (blue)

Interactive features:
- Button: Generate new random system
- Dropdown: Matrix size (2×2, 3×3, 4×4)
- Toggle: Show step count for each form
- Toggle: Show solution extraction method
- Hover: Show definition of each form

Information displayed:
- Number of operations to reach each form
- Solution method for each (back substitution vs direct)
- Uniqueness property highlighted

Color scheme:
- Pivot positions: gold
- Created zeros: light green
- Original nonzero entries: blue
- Structure indicators: gray outlines

Implementation: HTML/CSS/JavaScript with matrix computation
</details>

## Solution Analysis

Not every system of linear equations has a solution, and some have infinitely many. Understanding solution existence and uniqueness is as important as computing solutions.

### Types of Solution Sets

The **solution set** of a system is the collection of all vectors $\mathbf{x}$ satisfying $\mathbf{A}\mathbf{x} = \mathbf{b}$. Three possibilities exist:

1. **Unique Solution**: Exactly one solution exists
2. **Infinite Solutions**: Infinitely many solutions exist (forming a line, plane, or higher-dimensional subspace)
3. **No Solution**: No solution exists (the system is inconsistent)

The row echelon form reveals which case applies:

- **No solution**: A row of the form $[0 \; 0 \; \cdots \; 0 \; | \; c]$ where $c \neq 0$ (equation $0 = c$)
- **Unique solution**: Every column is a pivot column (as many pivots as variables)
- **Infinite solutions**: Some columns are not pivot columns (fewer pivots than variables)

### Basic and Free Variables

In systems with infinitely many solutions, variables split into two types:

- **Basic variables** correspond to pivot columns—they can be expressed in terms of other variables
- **Free variables** correspond to non-pivot columns—they can take any value

The number of free variables determines the "dimension" of the solution set:

| Free Variables | Solution Set |
|----------------|--------------|
| 0 | Unique point |
| 1 | Line |
| 2 | Plane |
| $k$ | $k$-dimensional subspace |

Example with a free variable:

$\begin{bmatrix} 1 & 2 & 3 & | & 4 \\ 0 & 0 & 1 & | & 2 \end{bmatrix}$

Here $x_1$ and $x_3$ are basic variables (columns 1 and 3 are pivot columns), while $x_2$ is free. The general solution is:

$x_1 = 4 - 2x_2 - 3(2) = -2 - 2x_2$

$x_2 = \text{free}$

$x_3 = 2$

Or in vector form: $\mathbf{x} = \begin{bmatrix} -2 \\ 0 \\ 2 \end{bmatrix} + x_2 \begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix}$

#### Diagram: Solution Set Visualizer

<iframe src="../../sims/solution-sets/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Solution Set Type Visualizer</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: classify, examine

Learning Objective: Enable students to explore how different systems produce unique solutions, infinite solutions (lines/planes), or no solution, and to identify the determining factors.

Canvas layout:
- Left: Augmented matrix (editable or preset)
- Center: 2D/3D geometric visualization
- Right: Solution analysis panel

Visual elements:
- Matrix with pivot positions marked
- Geometric view showing lines/planes
- Solution point, line, or empty set visualized
- Pivot columns highlighted
- Free variable columns indicated
- Parametric solution displayed (for infinite solutions)

Interactive controls:
- Dropdown: Preset examples (unique, infinite, none)
- Editable matrix cells (for custom exploration)
- Toggle: 2D / 3D visualization
- Checkbox: Show row echelon form
- Checkbox: Show reduced row echelon form
- Button: Random consistent system
- Button: Random inconsistent system

Default parameters:
- Mode: 2D
- Example: unique solution case

Behavior:
- Matrix edits update visualization in real-time
- Inconsistent systems show parallel lines/planes (no intersection)
- Infinite solutions show line or plane of solutions
- Solution type automatically detected and labeled
- Free variables identified and highlighted

Implementation: p5.js with WEBGL for 3D
</details>

## Homogeneous Systems

A **homogeneous system** has all zero constants on the right-hand side:

$\mathbf{A}\mathbf{x} = \mathbf{0}$

Homogeneous systems have special properties that make them particularly important in linear algebra.

### The Trivial Solution

Every homogeneous system has at least one solution: $\mathbf{x} = \mathbf{0}$. This is called the **trivial solution** because it's obvious—all zeros satisfy any homogeneous equation.

The interesting question is whether nontrivial solutions exist.

### Existence of Nontrivial Solutions

A homogeneous system $\mathbf{A}\mathbf{x} = \mathbf{0}$ has nontrivial solutions if and only if it has free variables. This happens when:

- The number of variables exceeds the number of pivot columns
- Equivalently, the number of variables exceeds the rank of $\mathbf{A}$

Important consequence: If a homogeneous system has more variables than equations, it always has nontrivial solutions.

| Variables vs Equations | Nontrivial Solutions? |
|------------------------|----------------------|
| Variables > Equations | Always |
| Variables = Equations | Maybe (depends on matrix) |
| Variables < Equations | Maybe (depends on matrix) |

### Solution Space Structure

The solution set of a homogeneous system forms a **subspace** called the **null space** of $\mathbf{A}$. This subspace:

- Contains the zero vector
- Is closed under addition (sum of solutions is a solution)
- Is closed under scalar multiplication (scalar times solution is a solution)

This structure is fundamental to understanding linear transformations and will be explored further in later chapters.

#### Diagram: Homogeneous System Explorer

<iframe src="../../sims/homogeneous-systems/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Homogeneous System Solution Space Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret

Learning Objective: Help students understand that homogeneous systems always have the trivial solution and may have additional solutions forming a subspace through the origin.

Canvas layout:
- Left: Coefficient matrix A (editable)
- Center: 2D/3D visualization of solution space
- Right: Solution analysis

Visual elements:
- Matrix display with rank calculation
- Coordinate axes through origin
- Trivial solution (origin) always marked
- Nontrivial solution space (line or plane through origin) when present
- Basis vectors for solution space shown as arrows
- Null space dimension displayed

Interactive controls:
- Matrix size selector (2×2, 2×3, 3×3, 3×4)
- Editable matrix entries
- Button: Generate random full-rank matrix (only trivial solution)
- Button: Generate random rank-deficient matrix (nontrivial solutions)
- Toggle: Show basis vectors for null space
- Slider: Rotate 3D view

Default parameters:
- Size: 3×3
- Initial matrix: rank-deficient (has null space)

Behavior:
- Real-time rank calculation
- Solution space updates as matrix changes
- Clear indication of trivial-only vs nontrivial solutions
- Null space dimension shown (n - rank)
- 3D rotation for spatial understanding

Implementation: p5.js with WEBGL for 3D
</details>

## Numerical Stability

In practice, solving linear systems on computers introduces challenges beyond the pure mathematics.

### Sources of Numerical Error

**Numerical stability** refers to how errors propagate through a computation. In linear systems, instability can arise from:

- **Floating-point representation**: Real numbers are stored with limited precision
- **Round-off errors**: Each arithmetic operation may introduce small errors
- **Ill-conditioned systems**: Some systems amplify small input errors into large output errors

### Partial Pivoting

Standard Gaussian elimination can suffer from numerical instability when small pivots lead to division by near-zero values. **Partial pivoting** addresses this by selecting the largest available pivot:

1. Before eliminating in a column, scan downward for the entry with largest absolute value
2. Swap rows to bring this entry to the pivot position
3. Proceed with elimination

This strategy prevents division by small numbers and improves numerical stability.

### Condition Number

The **condition number** of a matrix quantifies its sensitivity to perturbations. A high condition number indicates an **ill-conditioned** system where small changes in input cause large changes in output.

- Condition number ≈ 1: Well-conditioned (stable)
- Condition number large (e.g., $10^6$): Ill-conditioned (unstable)
- Condition number = ∞: Singular matrix (no unique solution)

!!! warning "Practical Implications"
    When working with real data, always consider numerical stability. Libraries like NumPy use sophisticated algorithms (LU decomposition with partial pivoting) that are more stable than naive Gaussian elimination. Never compute $\mathbf{A}^{-1}\mathbf{b}$ explicitly—use specialized solvers instead.

#### Diagram: Numerical Stability Demonstration

<iframe src="../../sims/numerical-stability/main.html" width="100%" height="460px" scrolling="no"></iframe>

<details markdown="1">
<summary>Numerical Stability and Condition Number Explorer</summary>
Type: microsim

Bloom Level: Evaluate (L5)
Bloom Verb: assess, judge

Learning Objective: Demonstrate how small changes in matrix entries can cause large changes in solutions for ill-conditioned systems, and how partial pivoting improves stability.

Canvas layout:
- Left: Original system and computed solution
- Center: Perturbed system and new solution
- Right: Analysis (condition number, error magnification)

Visual elements:
- Two matrices side-by-side (original and perturbed)
- Solutions displayed with precision indicators
- Error visualization (bar chart showing input vs output error)
- Condition number prominently displayed
- Color coding: green (well-conditioned) to red (ill-conditioned)
- 2D geometric view showing how solution moves

Interactive controls:
- Dropdown: Example type (well-conditioned, moderately ill-conditioned, severely ill-conditioned)
- Slider: Perturbation magnitude (0.0001 to 0.1)
- Toggle: Use partial pivoting
- Button: Apply random perturbation
- Checkbox: Show geometric interpretation
- Display: Precision (decimal places shown)

Default parameters:
- Example: Hilbert matrix 3×3 (ill-conditioned)
- Perturbation: 0.001
- Partial pivoting: off

Behavior:
- Perturbation applied to random entries
- Solution error calculated and displayed
- Error magnification factor shown (output error / input error)
- Comparison with/without partial pivoting
- Geometric view shows solution point movement

Implementation: p5.js with high-precision arithmetic library
</details>

## Applications

### Balancing Chemical Equations

Chemical equations must balance atoms. For the reaction:

$a \text{CH}_4 + b \text{O}_2 \rightarrow c \text{CO}_2 + d \text{H}_2\text{O}$

Balancing each element gives a linear system:

- Carbon: $a = c$
- Hydrogen: $4a = 2d$
- Oxygen: $2b = 2c + d$

This homogeneous system has a one-dimensional solution space. Setting $a = 1$ gives the balanced equation: $\text{CH}_4 + 2\text{O}_2 \rightarrow \text{CO}_2 + 2\text{H}_2\text{O}$.

### Network Flow Analysis

In electrical circuits or traffic networks, conservation laws produce linear systems. At each node, inflow equals outflow. The resulting system determines currents or traffic flows throughout the network.

### Machine Learning: Linear Regression

Fitting a linear model $\mathbf{y} = \mathbf{X}\boldsymbol{\beta}$ to data leads to the **normal equations**:

$\mathbf{X}^T\mathbf{X}\boldsymbol{\beta} = \mathbf{X}^T\mathbf{y}$

Solving this system gives the least-squares coefficients $\boldsymbol{\beta}$ that minimize prediction error.

### Neural Network Training

Training neural networks involves solving systems of equations (approximately) at each optimization step. The gradient computations that guide learning rely on the same matrix operations covered in this chapter.

## Computational Implementation

### NumPy Example

```python
import numpy as np

# Define the system Ax = b
A = np.array([[2, 3, -1],
              [4, 4, -3],
              [1, -1, 2]])
b = np.array([5, 3, 1])

# Solve using NumPy (LU decomposition with pivoting)
x = np.linalg.solve(A, b)
print(f"Solution: {x}")

# Verify: check that Ax = b
print(f"Verification (Ax): {A @ x}")
print(f"Condition number: {np.linalg.cond(A):.2f}")
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `np.linalg.solve(A, b)` | Solve $\mathbf{A}\mathbf{x} = \mathbf{b}$ |
| `np.linalg.matrix_rank(A)` | Compute rank |
| `np.linalg.cond(A)` | Compute condition number |
| `scipy.linalg.lu(A)` | LU decomposition |
| `np.linalg.lstsq(A, b)` | Least squares solution |

## Summary and Key Takeaways

This chapter developed the theory and practice of solving systems of linear equations.

**Formulation:**

- A **linear equation** has variables appearing to the first power only
- A **system of equations** requires simultaneous satisfaction of multiple equations
- **Matrix equation form** $\mathbf{A}\mathbf{x} = \mathbf{b}$ compactly represents the system
- The **augmented matrix** $[\mathbf{A} | \mathbf{b}]$ combines coefficients and constants

**Solution Methods:**

- **Row operations** (swap, scale, add) transform systems while preserving solutions
- **Gaussian elimination** reduces to row echelon form
- **Back substitution** solves from bottom to top
- **Reduced row echelon form** allows direct solution reading

**Solution Analysis:**

- **Pivot positions** and **pivot columns** determine solution structure
- **Unique solution**: all columns are pivot columns
- **Infinite solutions**: some columns are free (non-pivot)
- **No solution**: inconsistent row $[0 \; 0 \; \cdots \; 0 \; | \; c]$ with $c \neq 0$
- **Free variables** can take any value; **basic variables** are determined by them

**Special Systems:**

- **Homogeneous systems** ($\mathbf{A}\mathbf{x} = \mathbf{0}$) always have the **trivial solution**
- Nontrivial solutions exist when there are free variables
- The solution set of a homogeneous system is a subspace

**Computational Considerations:**

- **Numerical stability** matters for practical computation
- **Partial pivoting** improves stability
- **Condition number** measures sensitivity to perturbation
- Use library functions rather than explicit inverse computation

---

## Exercises

??? question "Exercise 1: Row Echelon Form"
    Reduce the following augmented matrix to row echelon form:

    $\begin{bmatrix} 1 & 2 & -1 & | & 3 \\ 2 & 5 & 1 & | & 8 \\ 3 & 7 & 0 & | & 11 \end{bmatrix}$

    Then use back substitution to find the solution.

??? question "Exercise 2: Solution Type Identification"
    For each augmented matrix in row echelon form, determine whether the system has a unique solution, infinite solutions, or no solution:

    a) $\begin{bmatrix} 1 & 3 & | & 5 \\ 0 & 1 & | & 2 \end{bmatrix}$

    b) $\begin{bmatrix} 1 & 2 & 3 & | & 4 \\ 0 & 0 & 1 & | & 2 \end{bmatrix}$

    c) $\begin{bmatrix} 1 & 2 & | & 3 \\ 0 & 0 & | & 5 \end{bmatrix}$

??? question "Exercise 3: Free and Basic Variables"
    Given the reduced row echelon form:

    $\begin{bmatrix} 1 & 0 & 2 & 0 & | & 3 \\ 0 & 1 & -1 & 0 & | & 1 \\ 0 & 0 & 0 & 1 & | & 4 \end{bmatrix}$

    Identify the pivot columns, free variables, and basic variables. Write the general solution in parametric form.

??? question "Exercise 4: Homogeneous System"
    Consider the homogeneous system with coefficient matrix:

    $\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$

    Determine whether nontrivial solutions exist. If so, find a basis for the solution space.

??? question "Exercise 5: Numerical Stability"
    The Hilbert matrix $H_n$ has entries $h_{ij} = \frac{1}{i+j-1}$. For $n = 3$:

    $H_3 = \begin{bmatrix} 1 & 1/2 & 1/3 \\ 1/2 & 1/3 & 1/4 \\ 1/3 & 1/4 & 1/5 \end{bmatrix}$

    Compute the condition number of $H_3$. What does this tell you about solving systems with this coefficient matrix?
