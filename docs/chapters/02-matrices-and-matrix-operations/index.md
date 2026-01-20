---
title: Matrices and Matrix Operations
description: Introduction to matrices as collections of vectors, matrix algebra, special matrix types, and fundamental operations
generated_by: claude skill chapter-content-generator
date: 2026-01-17 15:30:00
version: 0.03
status: draft
---

# Matrices and Matrix Operations

## Summary

Building on vectors, this chapter introduces matrices as collections of vectors and explores the rich algebra of matrix operations. You will learn about matrix notation, various special matrix types including diagonal, triangular, symmetric, and orthogonal matrices, and master core operations like multiplication, transpose, and inverse. These concepts form the computational backbone of all linear algebra applications.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Matrix
2. Matrix Notation
3. Matrix Dimensions
4. Row Vector
5. Column Vector
6. Matrix Entry
7. Matrix Addition
8. Matrix Scalar Multiply
9. Matrix-Vector Product
10. Matrix Multiplication
11. Matrix Transpose
12. Symmetric Matrix
13. Identity Matrix
14. Diagonal Matrix
15. Triangular Matrix
16. Upper Triangular
17. Lower Triangular
18. Orthogonal Matrix
19. Matrix Inverse
20. Invertible Matrix
21. Sparse Matrix
22. Dense Matrix
23. Block Matrix

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)

---

## Introduction to Matrices

In the previous chapter, we explored vectors as the fundamental objects of linear algebra—ordered lists of numbers representing points or directions in space. Now we extend this foundation to **matrices**, rectangular arrays of numbers that organize multiple vectors into a single mathematical object. Matrices are ubiquitous in modern computing: they represent images as pixel grids, encode neural network weights, store graph adjacency relationships, and transform coordinates in computer graphics.

The matrix perspective transforms our understanding of linear systems. Rather than thinking of equations individually, we can represent entire systems compactly and manipulate them using matrix operations. This algebraic framework enables efficient computation on modern hardware, where matrix operations are highly optimized through libraries like NumPy, TensorFlow, and PyTorch.

## What is a Matrix?

A **matrix** is a rectangular array of numbers arranged in rows and columns. We denote matrices with bold uppercase letters such as $\mathbf{A}$, $\mathbf{B}$, or $\mathbf{M}$. The numbers within a matrix are called **entries** or **elements**.

#### Matrix Definition

$\mathbf{A} = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}$

where:

- $a_{ij}$ is the entry in row $i$ and column $j$
- $m$ is the number of rows
- $n$ is the number of columns

### Matrix Notation and Dimensions

The **dimensions** of a matrix describe its shape. An $m \times n$ matrix (read "m by n") has $m$ rows and $n$ columns. The first number always indicates rows, and the second indicates columns.

| Dimensions | Description | Example Use Case |
|------------|-------------|------------------|
| $3 \times 3$ | Square matrix | Rotation in 3D |
| $28 \times 28$ | Square matrix | MNIST digit image |
| $m \times n$ | Rectangular | Data matrix with $m$ samples, $n$ features |
| $1 \times n$ | Row vector | Single observation |
| $m \times 1$ | Column vector | Single feature across samples |

Using standard **matrix notation**, we refer to individual entries with subscripts. The entry $a_{ij}$ (or $A_{ij}$) denotes the element in row $i$ and column $j$. This indexing convention—row first, column second—is consistent across mathematics and most programming languages.

### Row and Column Vectors

Matrices with only one row or one column receive special names. A **row vector** is a $1 \times n$ matrix containing $n$ elements arranged horizontally:

$\mathbf{r} = \begin{bmatrix} r_1 & r_2 & \cdots & r_n \end{bmatrix}$

A **column vector** is an $m \times 1$ matrix containing $m$ elements arranged vertically:

$\mathbf{c} = \begin{bmatrix} c_1 \\ c_2 \\ \vdots \\ c_m \end{bmatrix}$

In machine learning contexts, column vectors typically represent individual data points or feature vectors, while row vectors represent observations in a data matrix. This distinction matters because matrix multiplication requires compatible dimensions.

#### Diagram: Row and Column Vector Visualization

<iframe src="../../sims/row-column-vectors/main.html" width="100%" height="490px" scrolling="no"></iframe>

<details markdown="1">
<summary>Row and Column Vector Visualization</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: compare, contrast

Learning Objective: Help students visually distinguish between row vectors (horizontal) and column vectors (vertical), understanding how their orientation affects matrix operations.

Canvas layout:
- Main drawing area showing both vector types side by side
- Controls below for adjusting vector dimensions

Visual elements:
- Left side: A row vector displayed horizontally with labeled entries
- Right side: A column vector displayed vertically with labeled entries
- Color coding: row vector in blue, column vector in green
- Grid background showing the row/column structure
- Dimension labels showing "1 × n" for row and "m × 1" for column

Interactive controls:
- Slider: Number of elements (2-6)
- Toggle: Show/hide dimension annotations
- Button: Randomize values

Default parameters:
- Elements: 4
- Values: random integers 1-9

Behavior:
- Adjusting element count updates both vectors simultaneously
- Dimension labels update dynamically
- Values displayed inside each cell

Implementation: p5.js
</details>

## Matrix Entries and Indexing

Each **matrix entry** $a_{ij}$ occupies a specific position determined by its row index $i$ and column index $j$. Understanding this indexing system is essential for implementing matrix algorithms and interpreting matrix operations.

Consider a $3 \times 4$ matrix:

$\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 5 & 6 & 7 & 8 \\ 9 & 10 & 11 & 12 \end{bmatrix}$

In this example:

- $a_{11} = 1$ (first row, first column)
- $a_{23} = 7$ (second row, third column)
- $a_{32} = 10$ (third row, second column)

!!! note "Zero-Based vs One-Based Indexing"
    Mathematical notation uses one-based indexing (starting from 1), while programming languages like Python and JavaScript use zero-based indexing (starting from 0). In NumPy, accessing element $a_{23}$ requires `A[1, 2]`.

### Viewing Matrices as Collections of Vectors

A powerful perspective views matrices as collections of vectors. An $m \times n$ matrix can be interpreted as:

- **$n$ column vectors** of dimension $m$, or
- **$m$ row vectors** of dimension $n$

This dual interpretation underlies many matrix operations. When we multiply a matrix by a vector, we're computing a linear combination of the matrix's column vectors. When we compute the transpose, we're swapping between row and column interpretations.

## Basic Matrix Operations

### Matrix Addition

**Matrix addition** combines two matrices of identical dimensions by adding corresponding entries. If $\mathbf{A}$ and $\mathbf{B}$ are both $m \times n$ matrices, their sum $\mathbf{C} = \mathbf{A} + \mathbf{B}$ is also an $m \times n$ matrix where each entry is:

#### Matrix Addition Formula

$c_{ij} = a_{ij} + b_{ij}$

where:

- $c_{ij}$ is the entry in the sum matrix
- $a_{ij}$ is the corresponding entry in $\mathbf{A}$
- $b_{ij}$ is the corresponding entry in $\mathbf{B}$

Matrix addition is both **commutative** ($\mathbf{A} + \mathbf{B} = \mathbf{B} + \mathbf{A}$) and **associative** ($(\mathbf{A} + \mathbf{B}) + \mathbf{C} = \mathbf{A} + (\mathbf{B} + \mathbf{C})$).

### Scalar Multiplication

**Matrix scalar multiplication** multiplies every entry of a matrix by a single number (scalar). If $k$ is a scalar and $\mathbf{A}$ is a matrix, then $k\mathbf{A}$ has entries:

#### Scalar Multiplication Formula

$(k\mathbf{A})_{ij} = k \cdot a_{ij}$

where:

- $k$ is the scalar multiplier
- $a_{ij}$ is the original matrix entry

Scalar multiplication scales all entries uniformly. In neural networks, this operation appears when applying learning rates to gradient matrices during backpropagation.

#### Diagram: Matrix Addition and Scalar Multiplication

<iframe src="../../sims/matrix-basic-ops/main.html" width="100%" height="350px" scrolling="no"></iframe>

<details markdown="1">
<summary>Matrix Addition and Scalar Multiplication Interactive</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: calculate, demonstrate

Learning Objective: Enable students to practice matrix addition and scalar multiplication interactively, reinforcing the element-wise nature of these operations.

Canvas layout:
- Top section: Two input matrices A and B displayed side by side
- Middle: Result matrix C with operation indicator
- Bottom: Control panel

Visual elements:
- 3×3 matrices displayed as grids with editable cells
- Color highlighting showing corresponding entries during addition
- Animation showing values flowing into result matrix
- Operation symbol (+, ×) displayed between matrices

Interactive controls:
- Radio buttons: Select operation (Addition / Scalar Multiply)
- Slider: Scalar value k (for scalar multiplication, range -3 to 3)
- Button: Randomize matrices
- Button: Step through calculation
- Toggle: Show/hide calculation details

Default parameters:
- Matrix size: 3×3
- Operation: Addition
- Scalar: 2
- Values: small integers (-5 to 5)

Behavior:
- Clicking a cell allows value editing
- Result updates in real-time as inputs change
- Step mode highlights each entry calculation sequentially
- Animation shows entry-by-entry computation

Implementation: p5.js with editable input fields
</details>

## Matrix Multiplication

Matrix multiplication is the most important and nuanced matrix operation. Unlike addition, matrix multiplication has specific dimension requirements and is not commutative.

### Matrix-Vector Product

The **matrix-vector product** multiplies an $m \times n$ matrix by an $n \times 1$ column vector, producing an $m \times 1$ column vector. This operation represents applying a linear transformation to a vector.

#### Matrix-Vector Product Formula

$\mathbf{y} = \mathbf{A}\mathbf{x}$

where:

- $\mathbf{A}$ is an $m \times n$ matrix
- $\mathbf{x}$ is an $n \times 1$ column vector
- $\mathbf{y}$ is the resulting $m \times 1$ column vector

Each entry of the result is the dot product of a row of $\mathbf{A}$ with the vector $\mathbf{x}$:

$y_i = \sum_{j=1}^{n} a_{ij} x_j = a_{i1}x_1 + a_{i2}x_2 + \cdots + a_{in}x_n$

Alternatively, the matrix-vector product can be viewed as a linear combination of the columns of $\mathbf{A}$:

$\mathbf{A}\mathbf{x} = x_1 \mathbf{a}_1 + x_2 \mathbf{a}_2 + \cdots + x_n \mathbf{a}_n$

where $\mathbf{a}_j$ denotes the $j$-th column of $\mathbf{A}$.

### Matrix-Matrix Multiplication

**Matrix multiplication** extends the matrix-vector product. The product of an $m \times n$ matrix $\mathbf{A}$ and an $n \times p$ matrix $\mathbf{B}$ is an $m \times p$ matrix $\mathbf{C}$.

#### Matrix Multiplication Formula

$c_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj}$

where:

- $c_{ij}$ is the entry in row $i$, column $j$ of the product
- The sum runs over the shared dimension $n$
- Each entry requires $n$ multiplications and $n-1$ additions

The dimension compatibility rule states: the number of columns in $\mathbf{A}$ must equal the number of rows in $\mathbf{B}$.

| Matrix A | Matrix B | Product C | Valid? |
|----------|----------|-----------|--------|
| $2 \times 3$ | $3 \times 4$ | $2 \times 4$ | Yes |
| $3 \times 2$ | $3 \times 4$ | — | No |
| $4 \times 4$ | $4 \times 4$ | $4 \times 4$ | Yes |
| $1 \times 5$ | $5 \times 1$ | $1 \times 1$ | Yes (scalar) |

!!! warning "Matrix Multiplication is Not Commutative"
    In general, $\mathbf{A}\mathbf{B} \neq \mathbf{B}\mathbf{A}$. In fact, if $\mathbf{A}\mathbf{B}$ exists, $\mathbf{B}\mathbf{A}$ may not even be defined (different dimensions). Even for square matrices where both products exist, they typically differ.

#### Diagram: Matrix Multiplication Visualizer

<iframe src="../../sims/matrix-multiplication/main.html" width="100%" height="407px" scrolling="no"></iframe>

<details markdown="1">
<summary>Matrix Multiplication Step-by-Step Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret

Learning Objective: Help students understand the row-by-column computation process in matrix multiplication by animating each entry calculation.

Canvas layout:
- Left: Matrix A (highlighted rows)
- Center: Matrix B (highlighted columns)
- Right: Result matrix C (entries fill in as computed)
- Bottom: Control panel and calculation display

Visual elements:
- Matrix A with current row highlighted in blue
- Matrix B with current column highlighted in green
- Result matrix C with current entry position highlighted in yellow
- Dot product calculation shown step by step below matrices
- Running sum displayed during computation

Interactive controls:
- Dropdown: Matrix A dimensions (2×2, 2×3, 3×2, 3×3)
- Dropdown: Matrix B dimensions (matching first dimension of result)
- Button: "Next Entry" - advance to next calculation
- Button: "Auto Play" - animate all calculations
- Slider: Animation speed (200ms - 2000ms per step)
- Button: Reset
- Toggle: Show column interpretation (linear combination view)

Default parameters:
- Matrix A: 2×3
- Matrix B: 3×2
- Animation speed: 800ms
- Values: small integers (1-5)

Behavior:
- Highlight corresponding row of A and column of B
- Show element-wise multiplication with + signs
- Display running sum as computation proceeds
- Fill in result entry when complete
- Move to next entry automatically or on button click
- Column interpretation mode shows result as linear combination

Implementation: p5.js with animation states [here](/linear-algebra/sims/matrix-multiplication)
</details>

### Properties of Matrix Multiplication

Matrix multiplication satisfies several important algebraic properties:

- **Associativity:** $(\mathbf{A}\mathbf{B})\mathbf{C} = \mathbf{A}(\mathbf{B}\mathbf{C})$
- **Distributivity:** $\mathbf{A}(\mathbf{B} + \mathbf{C}) = \mathbf{A}\mathbf{B} + \mathbf{A}\mathbf{C}$
- **Scalar compatibility:** $k(\mathbf{A}\mathbf{B}) = (k\mathbf{A})\mathbf{B} = \mathbf{A}(k\mathbf{B})$
- **Non-commutativity:** $\mathbf{A}\mathbf{B} \neq \mathbf{B}\mathbf{A}$ in general

These properties enable powerful algebraic manipulations while requiring careful attention to the order of operations.

## The Matrix Transpose

The **matrix transpose** operation flips a matrix over its diagonal, converting rows to columns and vice versa. For an $m \times n$ matrix $\mathbf{A}$, its transpose $\mathbf{A}^T$ is an $n \times m$ matrix.

#### Transpose Definition

$(\mathbf{A}^T)_{ij} = a_{ji}$

where:

- The entry in row $i$, column $j$ of $\mathbf{A}^T$ equals the entry in row $j$, column $i$ of $\mathbf{A}$

For example:

$\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix} \implies \mathbf{A}^T = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}$

### Transpose Properties

The transpose operation satisfies these properties:

- $(\mathbf{A}^T)^T = \mathbf{A}$ (double transpose returns original)
- $(\mathbf{A} + \mathbf{B})^T = \mathbf{A}^T + \mathbf{B}^T$ (transpose distributes over addition)
- $(k\mathbf{A})^T = k\mathbf{A}^T$ (scalars pass through)
- $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T\mathbf{A}^T$ (order reverses for products!)

The last property is particularly important: when transposing a product, the order of the matrices reverses. This "reverse order law" appears frequently in derivations involving neural network backpropagation.

## Special Matrix Types

Many matrices have special structures that simplify computation or carry geometric meaning. Recognizing these types enables algorithmic optimizations and deeper understanding.

### Identity Matrix

The **identity matrix** $\mathbf{I}_n$ is the multiplicative identity for $n \times n$ matrices. It has ones on the diagonal and zeros elsewhere:

$\mathbf{I}_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

For any matrix $\mathbf{A}$ with compatible dimensions:

$\mathbf{I}_m \mathbf{A} = \mathbf{A} \mathbf{I}_n = \mathbf{A}$

The identity matrix represents the "do nothing" transformation—it maps every vector to itself.

### Diagonal Matrix

A **diagonal matrix** has nonzero entries only on its main diagonal. All off-diagonal entries are zero:

$\mathbf{D} = \begin{bmatrix} d_1 & 0 & 0 \\ 0 & d_2 & 0 \\ 0 & 0 & d_3 \end{bmatrix}$

Diagonal matrices have special computational properties:

- **Multiplication:** Multiplying by a diagonal matrix scales rows or columns
- **Powers:** $\mathbf{D}^k$ has entries $d_i^k$
- **Inverse:** $\mathbf{D}^{-1}$ has entries $1/d_i$ (if all $d_i \neq 0$)

In machine learning, diagonal matrices appear in batch normalization and as covariance matrices for independent features.

### Triangular Matrices

A **triangular matrix** has zeros on one side of the diagonal.

An **upper triangular** matrix has zeros below the diagonal:

$\mathbf{U} = \begin{bmatrix} u_{11} & u_{12} & u_{13} \\ 0 & u_{22} & u_{23} \\ 0 & 0 & u_{33} \end{bmatrix}$

A **lower triangular** matrix has zeros above the diagonal:

$\mathbf{L} = \begin{bmatrix} l_{11} & 0 & 0 \\ l_{21} & l_{22} & 0 \\ l_{31} & l_{32} & l_{33} \end{bmatrix}$

Triangular matrices are computationally advantageous:

- Solving $\mathbf{L}\mathbf{x} = \mathbf{b}$ uses **forward substitution** (start from top)
- Solving $\mathbf{U}\mathbf{x} = \mathbf{b}$ uses **back substitution** (start from bottom)
- Both require only $O(n^2)$ operations instead of $O(n^3)$

LU decomposition factors any matrix into lower and upper triangular components, enabling efficient system solving.

#### Diagram: Special Matrix Types Gallery

<iframe src="../../sims/special-matrices/main.html" width="100%" height="542px" scrolling="no"></iframe>

<details markdown="1">
<summary>Special Matrix Types Interactive Gallery</summary>
Type: infographic

Bloom Level: Remember (L1)
Bloom Verb: identify, recognize

Learning Objective: Help students visually identify and distinguish between different special matrix types (identity, diagonal, upper/lower triangular) by their structural patterns.

Layout: Grid of matrix visualizations with interactive selection

Visual elements:
- 4×4 grid showing four matrix types simultaneously
- Each matrix displayed as a colored grid:
  - Identity: ones on diagonal (gold), zeros elsewhere (light gray)
  - Diagonal: colored diagonal entries, zeros elsewhere
  - Upper triangular: colored upper triangle including diagonal, zeros below
  - Lower triangular: colored lower triangle including diagonal, zeros above
- Structural pattern highlighted with shading
- Labels below each matrix type

Interactive features:
- Click on a matrix type to enlarge and see detailed properties
- Hover over entries to see position (i,j) and value
- Toggle: Show/hide zero entries
- Slider: Matrix size (3×3 to 6×6)
- Button: Show random example values

Information panels (on click):
- Definition of the matrix type
- Key properties
- Computational advantages
- Common applications

Color scheme:
- Non-zero entries: blue gradient based on value
- Zero entries: light gray or hidden
- Diagonal: highlighted in gold
- Structural regions: subtle background shading

Implementation: HTML/CSS/JavaScript with SVG or Canvas
</details>

### Symmetric Matrix

#### Diagram: Symmetric Matrix

<iframe src="../../sims/symmetric-matrix/main.html" height="500px" width="100%" scrolling="no"></iframe>

A **symmetric matrix** equals its own transpose: $\mathbf{A} = \mathbf{A}^T$. This means $a_{ij} = a_{ji}$ for all entries—the matrix is mirror-symmetric across the diagonal.

$\mathbf{S} = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 5 \\ 3 & 5 & 6 \end{bmatrix}$

Symmetric matrices arise naturally in many contexts:

- **Covariance matrices** in statistics
- **Adjacency matrices** for undirected graphs
- **Hessian matrices** (second derivatives) in optimization
- **Gram matrices** $\mathbf{A}^T\mathbf{A}$ from any matrix $\mathbf{A}$

Symmetric matrices have remarkable spectral properties: they always have real eigenvalues and orthogonal eigenvectors, enabling powerful decomposition methods.

### Orthogonal Matrix

An **orthogonal matrix** $\mathbf{Q}$ satisfies $\mathbf{Q}^T\mathbf{Q} = \mathbf{Q}\mathbf{Q}^T = \mathbf{I}$. Equivalently, its inverse equals its transpose: $\mathbf{Q}^{-1} = \mathbf{Q}^T$.

The columns of an orthogonal matrix form an orthonormal set—they are mutually perpendicular unit vectors. Orthogonal matrices represent **rotations** and **reflections** that preserve lengths and angles.

Properties of orthogonal matrices:

- **Length preservation:** $\|\mathbf{Q}\mathbf{x}\| = \|\mathbf{x}\|$ for all vectors $\mathbf{x}$
- **Angle preservation:** The angle between $\mathbf{Q}\mathbf{x}$ and $\mathbf{Q}\mathbf{y}$ equals the angle between $\mathbf{x}$ and $\mathbf{y}$
- **Determinant:** $\det(\mathbf{Q}) = \pm 1$ (rotation if $+1$, reflection if $-1$)
- **Easy inversion:** Computing $\mathbf{Q}^{-1}$ requires only a transpose

#### Diagram: Orthogonal Matrix Transformation

<iframe src="../../sims/orthogonal-transform/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Orthogonal Matrix Transformation Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret

Learning Objective: Demonstrate that orthogonal matrices preserve lengths and angles by visualizing how rotation matrices transform shapes without distortion.

Canvas layout:
- Main area: 2D coordinate plane with original and transformed shapes
- Right panel: Matrix display and controls

Visual elements:
- Coordinate grid with x and y axes
- Original shape (unit square or set of vectors) in blue
- Transformed shape in red (semi-transparent overlay)
- Length indicators showing preservation
- Angle arc showing angle preservation between vectors
- 2×2 rotation matrix displayed with current angle

Interactive controls:
- Slider: Rotation angle θ (0° to 360°)
- Checkbox: Show length comparison
- Checkbox: Show angle comparison
- Dropdown: Shape to transform (square, triangle, circle of vectors)
- Button: Add reflection (multiply by reflection matrix)
- Display: Matrix values updating with angle

Default parameters:
- Angle: 45°
- Shape: unit square
- Show lengths: true
- Show angles: false

Behavior:
- Shape smoothly rotates as angle slider changes
- Length indicators show |Qx| = |x|
- Angle arcs update to show angle preservation
- Matrix entries update: cos(θ), -sin(θ), sin(θ), cos(θ)
- Reflection button flips across an axis

Implementation: p5.js with trigonometric calculations
</details>

## Matrix Inverse

The **matrix inverse** generalizes division to matrices. For a square matrix $\mathbf{A}$, its inverse $\mathbf{A}^{-1}$ (if it exists) satisfies:

#### Matrix Inverse Definition

$\mathbf{A}\mathbf{A}^{-1} = \mathbf{A}^{-1}\mathbf{A} = \mathbf{I}$

where:

- $\mathbf{A}$ is an $n \times n$ square matrix
- $\mathbf{A}^{-1}$ is the inverse matrix
- $\mathbf{I}$ is the $n \times n$ identity matrix

### Invertible Matrices

A matrix is **invertible** (also called **nonsingular** or **non-degenerate**) if its inverse exists. Not all matrices are invertible—those without inverses are called **singular**.

Conditions for invertibility (all equivalent):

- $\mathbf{A}^{-1}$ exists
- $\det(\mathbf{A}) \neq 0$
- The columns of $\mathbf{A}$ are linearly independent
- The rows of $\mathbf{A}$ are linearly independent
- $\mathbf{A}\mathbf{x} = \mathbf{0}$ has only the trivial solution $\mathbf{x} = \mathbf{0}$
- $\mathbf{A}$ has full rank

For a 2×2 matrix, the inverse has a closed form:

#### 2×2 Matrix Inverse Formula

$\mathbf{A} = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \implies \mathbf{A}^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$

where:

- $ad - bc$ is the determinant of $\mathbf{A}$
- The inverse exists only if $ad - bc \neq 0$

### Properties of Matrix Inverse

When inverses exist, they satisfy these properties:

- $(\mathbf{A}^{-1})^{-1} = \mathbf{A}$
- $(\mathbf{A}^T)^{-1} = (\mathbf{A}^{-1})^T$
- $(k\mathbf{A})^{-1} = \frac{1}{k}\mathbf{A}^{-1}$ for $k \neq 0$
- $(\mathbf{A}\mathbf{B})^{-1} = \mathbf{B}^{-1}\mathbf{A}^{-1}$ (order reverses!)

The inverse enables solving linear systems: if $\mathbf{A}\mathbf{x} = \mathbf{b}$, then $\mathbf{x} = \mathbf{A}^{-1}\mathbf{b}$.

!!! tip "Computational Practice"
    While mathematically elegant, computing $\mathbf{A}^{-1}\mathbf{b}$ explicitly is usually avoided in practice. Instead, we solve $\mathbf{A}\mathbf{x} = \mathbf{b}$ directly using methods like LU decomposition, which are more numerically stable and efficient.

#### Diagram: Matrix Inverse Explorer

<iframe src="../../sims/matrix-inverse/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Matrix Inverse Interactive Explorer</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: calculate, demonstrate

Learning Objective: Enable students to explore matrix inversion for 2×2 and 3×3 matrices, verify the inverse property AA⁻¹ = I, and understand when matrices are singular.

Canvas layout:
- Left: Input matrix A (editable)
- Center: Computed inverse A⁻¹ (or "Singular" warning)
- Right: Verification showing AA⁻¹ = I
- Bottom: Controls and determinant display

Visual elements:
- Editable matrix cells with color-coded entries
- Determinant value prominently displayed
- Color indicator: green for invertible, red for singular/near-singular
- Verification matrix showing identity (or near-identity for numerical precision)
- Warning icon when determinant is near zero

Interactive controls:
- Matrix size toggle: 2×2 / 3×3
- Editable cells for matrix entries
- Button: Randomize matrix
- Button: Make singular (set det = 0)
- Slider: Approach singularity (smoothly varies toward singular)
- Toggle: Show calculation steps

Default parameters:
- Size: 2×2
- Initial matrix: [[2, 1], [1, 1]] (invertible)

Behavior:
- Real-time inverse computation as entries change
- Determinant updates continuously
- Verification matrix computes A × A⁻¹
- Near-singular matrices show numerical instability
- Step-by-step mode shows cofactor/adjugate method for 2×2

Implementation: p5.js with matrix computation library
</details>

## Sparse and Dense Matrices

Matrices are classified by their distribution of zero and nonzero entries.

A **dense matrix** has few zero entries relative to its total size. Most entries contain meaningful nonzero values. Dense matrices require $O(mn)$ storage and $O(mn)$ operations for most computations.

A **sparse matrix** has many zero entries—typically the number of nonzero entries is $O(n)$ or $O(n \log n)$ rather than $O(n^2)$ for an $n \times n$ matrix. Sparse matrices arise naturally in:

- **Graph adjacency matrices:** Most nodes connect to few others
- **Document-term matrices:** Each document uses few of all possible words
- **Finite element methods:** Local interactions produce banded structures

| Property | Dense Matrix | Sparse Matrix |
|----------|--------------|---------------|
| Storage | $O(mn)$ | $O(\text{nnz})$ |
| Zero entries | Few | Many (typically >90%) |
| Storage format | 2D array | CSR, CSC, COO |
| Multiplication | Standard algorithms | Specialized sparse algorithms |
| Examples | Covariance matrices | Adjacency matrices |

where $\text{nnz}$ denotes the number of nonzero entries.

Sparse matrix formats like Compressed Sparse Row (CSR) store only nonzero values along with their positions, dramatically reducing memory requirements and enabling faster operations by skipping zero computations.

#### Diagram: Sparse vs Dense Matrix Visualization

<iframe src="../../sims/sparse-dense-matrices/main.html" width="100%" height="420px" scrolling="no"></iframe>

<details markdown="1">
<summary>Sparse vs Dense Matrix Comparison</summary>
Type: infographic

Bloom Level: Analyze (L4)
Bloom Verb: compare, contrast, differentiate

Learning Objective: Help students understand the structural difference between sparse and dense matrices and appreciate why sparsity enables computational efficiency.

Layout: Side-by-side matrix visualizations with statistics

Visual elements:
- Left panel: Dense matrix (most cells filled with color)
- Right panel: Sparse matrix (few colored cells, most white/gray)
- Color intensity indicates value magnitude
- Zero entries shown as white or light gray
- Statistics overlay:
  - Total entries
  - Nonzero entries
  - Sparsity percentage
  - Memory comparison (dense vs sparse storage)

Interactive features:
- Slider: Matrix size (10×10 to 100×100)
- Slider: Sparsity level (10% to 99% zeros)
- Dropdown: Sparse pattern (random, diagonal, banded, block)
- Toggle: Show storage comparison bar chart
- Hover: Show value at position

Example data:
- Dense: Random values in most cells
- Sparse: Graph adjacency pattern or banded structure

Statistics display:
- Memory ratio: "Sparse uses X% of dense storage"
- Multiplication speedup estimate

Implementation: HTML Canvas or p5.js with efficient rendering
</details>

## Block Matrices

A **block matrix** (or partitioned matrix) is a matrix viewed as an array of smaller matrices called **blocks** or **submatrices**. Block structure often reflects natural problem decomposition.

$\mathbf{M} = \begin{bmatrix} \mathbf{A} & \mathbf{B} \\ \mathbf{C} & \mathbf{D} \end{bmatrix}$

where $\mathbf{A}$, $\mathbf{B}$, $\mathbf{C}$, $\mathbf{D}$ are matrices of compatible dimensions.

### Block Matrix Operations

Block matrices support "block-wise" operations that mirror scalar operations:

**Block Addition:** If two matrices have the same block structure:

$\begin{bmatrix} \mathbf{A}_1 & \mathbf{B}_1 \\ \mathbf{C}_1 & \mathbf{D}_1 \end{bmatrix} + \begin{bmatrix} \mathbf{A}_2 & \mathbf{B}_2 \\ \mathbf{C}_2 & \mathbf{D}_2 \end{bmatrix} = \begin{bmatrix} \mathbf{A}_1 + \mathbf{A}_2 & \mathbf{B}_1 + \mathbf{B}_2 \\ \mathbf{C}_1 + \mathbf{C}_2 & \mathbf{D}_1 + \mathbf{D}_2 \end{bmatrix}$

**Block Multiplication:** With compatible block dimensions:

$\begin{bmatrix} \mathbf{A} & \mathbf{B} \\ \mathbf{C} & \mathbf{D} \end{bmatrix} \begin{bmatrix} \mathbf{E} \\ \mathbf{F} \end{bmatrix} = \begin{bmatrix} \mathbf{A}\mathbf{E} + \mathbf{B}\mathbf{F} \\ \mathbf{C}\mathbf{E} + \mathbf{D}\mathbf{F} \end{bmatrix}$

Block structure enables:

- Parallel computation on independent blocks
- Efficient algorithms exploiting structure
- Conceptual clarity in complex systems
- Memory-efficient storage when blocks have special properties

In deep learning, weight matrices are often organized in blocks corresponding to different layers or attention heads.

#### Diagram: Block Matrix Structure

<iframe src="../../sims/block-matrix/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Block Matrix Partitioning Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, classify

Learning Objective: Help students understand how matrices can be partitioned into blocks and how block operations mirror element-wise operations at a higher level.

Canvas layout:
- Main area: Large matrix with adjustable partition lines
- Right panel: Block extraction and operation display

Visual elements:
- 8×8 matrix displayed as a grid
- Draggable horizontal and vertical partition lines
- Distinct colors for each block region
- Block labels (A, B, C, D, etc.) overlaid on regions
- Extracted blocks shown separately on right

Interactive controls:
- Drag partition lines to resize blocks
- Dropdown: Example partitioning (2×2 blocks, row partition, column partition)
- Toggle: Show block dimensions
- Button: Demonstrate block multiplication
- Checkbox: Show compatibility requirements

Default parameters:
- Matrix size: 8×8
- Initial partition: 4×4 blocks (2×2 block structure)
- Values: integers 1-9

Behavior:
- Partition lines snap to integer positions
- Block colors update as partitioning changes
- Dimension labels update dynamically
- Block multiplication demo shows step-by-step block operations

Implementation: p5.js with draggable elements
</details>

## Applications in Machine Learning and AI

The matrix concepts covered in this chapter form the computational foundation of modern machine learning systems.

### Data Representation

Machine learning datasets are naturally represented as matrices:

- **Design matrix $\mathbf{X}$:** Each row is a sample, each column is a feature
- **Weight matrix $\mathbf{W}$:** Neural network parameters connecting layers
- **Embedding matrix $\mathbf{E}$:** Word or token embeddings in NLP

For a dataset with $m$ samples and $n$ features, the design matrix is $m \times n$. Feature scaling, normalization, and transformation all use matrix operations.

### Neural Network Layers

A fully connected neural network layer performs:

$\mathbf{h} = \sigma(\mathbf{W}\mathbf{x} + \mathbf{b})$

where:

- $\mathbf{W}$ is the weight matrix
- $\mathbf{x}$ is the input vector
- $\mathbf{b}$ is the bias vector
- $\sigma$ is a nonlinear activation function

Batch processing extends this to:

$\mathbf{H} = \sigma(\mathbf{X}\mathbf{W}^T + \mathbf{b})$

where $\mathbf{X}$ contains multiple input vectors as rows, enabling parallel computation of many samples.

### Attention Mechanisms

Transformer models compute attention using three matrices:

- **Query matrix $\mathbf{Q}$:** What we're looking for
- **Key matrix $\mathbf{K}$:** What's available to match
- **Value matrix $\mathbf{V}$:** What we retrieve

The attention computation:

$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left(\frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}}\right)\mathbf{V}$

relies entirely on matrix multiplications and transposes covered in this chapter.

#### Diagram: Neural Network Layer Matrix Operations

<iframe src="../../sims/neural-network-layer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Neural Network Layer Forward Pass Visualizer</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: implement, demonstrate

Learning Objective: Show how matrix-vector multiplication implements a neural network layer, connecting abstract matrix operations to concrete deep learning computations.

Canvas layout:
- Left: Input vector visualization
- Center: Weight matrix with connection lines
- Right: Output vector (pre and post activation)
- Bottom: Controls and formula display

Visual elements:
- Input neurons (circles) with values
- Weight matrix displayed as a heatmap
- Connection lines from inputs to outputs (thickness = weight magnitude)
- Output neurons showing weighted sums
- Activation function visualization (ReLU, sigmoid curve)
- Formula: h = σ(Wx + b) displayed with current values

Interactive controls:
- Slider: Number of inputs (2-6)
- Slider: Number of outputs (2-6)
- Dropdown: Activation function (none, ReLU, sigmoid, tanh)
- Button: Randomize weights
- Button: Randomize input
- Toggle: Show bias term
- Toggle: Show matrix multiplication step-by-step

Default parameters:
- Inputs: 3
- Outputs: 2
- Activation: ReLU
- Random weights in [-1, 1]
- Random inputs in [0, 1]

Behavior:
- Changing input values updates outputs in real-time
- Connection line colors indicate positive (blue) vs negative (red) weights
- Step-by-step mode highlights each row-vector dot product
- Activation function applied visually to each output

Implementation: p5.js with animation
</details>

## Summary and Key Takeaways

This chapter introduced matrices as the fundamental data structures of linear algebra with broad applications in AI and machine learning.

**Core Concepts:**

- A **matrix** is a rectangular array of numbers with dimensions $m \times n$
- **Matrix entries** are indexed by row and column: $a_{ij}$
- **Row vectors** ($1 \times n$) and **column vectors** ($m \times 1$) are special cases

**Fundamental Operations:**

- **Matrix addition** adds corresponding entries (requires same dimensions)
- **Scalar multiplication** scales all entries by a constant
- **Matrix-vector product** $\mathbf{A}\mathbf{x}$ produces a linear combination of columns
- **Matrix multiplication** $\mathbf{A}\mathbf{B}$ requires matching inner dimensions
- **Transpose** $\mathbf{A}^T$ flips rows and columns

**Special Matrix Types:**

- **Identity matrix** $\mathbf{I}$: multiplicative identity
- **Diagonal matrix**: nonzeros only on diagonal
- **Triangular matrices**: zeros above or below diagonal
- **Symmetric matrix**: $\mathbf{A} = \mathbf{A}^T$
- **Orthogonal matrix**: $\mathbf{Q}^T\mathbf{Q} = \mathbf{I}$ (preserves lengths/angles)

**Inverse and Structure:**

- **Matrix inverse** $\mathbf{A}^{-1}$ satisfies $\mathbf{A}\mathbf{A}^{-1} = \mathbf{I}$
- **Invertible matrices** have nonzero determinant and linearly independent columns
- **Sparse matrices** have few nonzero entries; **dense matrices** have many
- **Block matrices** partition into submatrices for structured computation

**Key Properties to Remember:**

- Matrix multiplication is NOT commutative: $\mathbf{A}\mathbf{B} \neq \mathbf{B}\mathbf{A}$
- Product transpose reverses order: $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T\mathbf{A}^T$
- Inverse product reverses order: $(\mathbf{A}\mathbf{B})^{-1} = \mathbf{B}^{-1}\mathbf{A}^{-1}$

These operations form the computational vocabulary of machine learning, from basic linear regression to advanced transformer architectures.

---

## Exercises

??? question "Exercise 1: Matrix Dimensions"
    Given matrices $\mathbf{A}$ (3×4), $\mathbf{B}$ (4×2), and $\mathbf{C}$ (3×2), which products are defined? What are their dimensions?

    - $\mathbf{A}\mathbf{B}$
    - $\mathbf{B}\mathbf{A}$
    - $\mathbf{A}\mathbf{C}$
    - $\mathbf{A}\mathbf{B} + \mathbf{C}$

??? question "Exercise 2: Transpose Properties"
    Prove that $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T\mathbf{A}^T$ for 2×2 matrices by computing both sides with generic entries.

??? question "Exercise 3: Symmetric Matrices"
    Show that for any matrix $\mathbf{A}$, both $\mathbf{A}^T\mathbf{A}$ and $\mathbf{A}\mathbf{A}^T$ are symmetric matrices.

??? question "Exercise 4: Orthogonal Matrix Verification"
    Verify that the following matrix is orthogonal and determine if it represents a rotation or reflection:

    $\mathbf{Q} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}$

??? question "Exercise 5: Block Multiplication"
    Compute the product of the following block matrices:

    $\begin{bmatrix} \mathbf{I}_2 & \mathbf{0} \\ \mathbf{A} & \mathbf{I}_2 \end{bmatrix} \begin{bmatrix} \mathbf{I}_2 & \mathbf{0} \\ -\mathbf{A} & \mathbf{I}_2 \end{bmatrix}$

    where $\mathbf{A}$ is any 2×2 matrix.
