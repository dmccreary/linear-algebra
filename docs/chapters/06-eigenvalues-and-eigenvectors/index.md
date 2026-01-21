---
title: Eigenvalues and Eigenvectors
description: Understanding the intrinsic structure of linear transformations through eigenanalysis
generated_by: claude skill chapter-content-generator
date: 2026-01-17 14:30:00
version: 0.03
---

# Eigenvalues and Eigenvectors

## Summary

One of the most important topics in linear algebra, eigenanalysis reveals the intrinsic structure of linear transformations. This chapter covers eigenvalues, eigenvectors, characteristic polynomials, and diagonalization. You will learn the spectral theorem for symmetric matrices and the power iteration method. These concepts are essential for PCA, stability analysis, and understanding how neural networks learn.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Eigenvalue
2. Eigenvector
3. Eigen Equation
4. Characteristic Polynomial
5. Characteristic Equation
6. Eigenspace
7. Algebraic Multiplicity
8. Geometric Multiplicity
9. Diagonalization
10. Diagonal Form
11. Similar Matrices
12. Complex Eigenvalue
13. Spectral Theorem
14. Symmetric Eigenvalues
15. Power Iteration
16. Dominant Eigenvalue
17. Eigendecomposition

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 4: Linear Transformations](../04-linear-transformations/index.md)
- [Chapter 5: Determinants and Matrix Properties](../05-determinants-and-matrix-properties/index.md)

---

## Introduction

When a linear transformation acts on a vector, it typically changes both the direction and magnitude of that vector. However, certain special vectors maintain their direction under transformation—they may stretch, shrink, or flip, but they remain on the same line through the origin. These exceptional vectors, called **eigenvectors**, and their associated scaling factors, called **eigenvalues**, reveal the fundamental structure of linear transformations.

Understanding eigenanalysis is crucial for modern AI and machine learning applications. Principal Component Analysis (PCA) uses eigenvectors to find the directions of maximum variance in data. Google's PageRank algorithm models web importance as an eigenvector problem. Neural networks converge based on the eigenvalues of their weight matrices. Stability analysis of dynamical systems depends entirely on eigenvalue properties.

This chapter develops eigenanalysis from first principles, building intuition through visualizations before presenting the computational techniques used in practice.

## Eigenvalues and Eigenvectors: The Core Concepts

Consider a linear transformation represented by a square matrix $A$. When we apply $A$ to most vectors, both the direction and magnitude change. But for special vectors, the transformation only scales the vector without changing its direction.

#### The Eigen Equation

The relationship between a matrix $A$, an eigenvector $\mathbf{v}$, and its eigenvalue $\lambda$ is captured by the eigen equation:

$A\mathbf{v} = \lambda\mathbf{v}$

where:

- $A$ is an $n \times n$ square matrix
- $\mathbf{v}$ is a non-zero vector (the eigenvector)
- $\lambda$ is a scalar (the eigenvalue)

This equation states that applying the transformation $A$ to the eigenvector $\mathbf{v}$ produces the same result as simply scaling $\mathbf{v}$ by the factor $\lambda$.

#### Diagram: Eigenvector Transformation Visualization

<iframe src="../../sims/eigenvector-transformation/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Eigenvector Transformation Visualizer Fullscreen](../../sims/eigenvector-transformation/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Eigenvector Transformation Visualization</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Demonstrate visually how eigenvectors maintain their direction under linear transformation while other vectors change direction

Visual elements:
- 2D coordinate plane with grid lines
- A unit circle showing sample vectors
- Original vector (blue arrow) that user can drag to different positions
- Transformed vector (red arrow) showing result of A*v
- Eigenvector directions displayed as dashed lines through origin
- Matrix A displayed in corner with editable values

Interactive controls:
- Drag handle on the blue vector to change its direction and magnitude
- 2x2 matrix input fields for A (pre-populated with example: [[2, 1], [1, 2]])
- "Show Eigenvectors" toggle button
- "Animate Transformation" button that smoothly morphs vector to its transformed position
- Reset button

Default parameters:
- Matrix A = [[2, 1], [1, 2]] (eigenvalues 3 and 1)
- Initial vector at (1, 0)
- Canvas size: responsive, minimum 600x500px

Behavior:
- As user drags the vector, show both original and transformed positions
- When vector aligns with an eigenvector direction, highlight this with a glow effect
- Display "Eigenvector detected!" message when alignment occurs
- Show eigenvalue as the ratio of transformed to original length
- Color code: vectors along eigenvectors glow green, others remain blue/red

Implementation: p5.js with responsive canvas design
</details>

The key insight is that eigenvectors define the "natural axes" of a linear transformation. Along these axes, the transformation acts as pure scaling—no rotation or shearing occurs.

### Geometric Interpretation

Different eigenvalue values produce different geometric behaviors:

| Eigenvalue | Geometric Effect |
|------------|------------------|
| $\lambda > 1$ | Stretches the eigenvector away from origin |
| $0 < \lambda < 1$ | Compresses the eigenvector toward origin |
| $\lambda = 1$ | Leaves the eigenvector unchanged |
| $\lambda = 0$ | Collapses the eigenvector to the origin |
| $\lambda < 0$ | Flips and scales the eigenvector |

!!! note "Eigenvectors Are Not Unique in Scale"
    If $\mathbf{v}$ is an eigenvector with eigenvalue $\lambda$, then any non-zero scalar multiple $c\mathbf{v}$ is also an eigenvector with the same eigenvalue. We often normalize eigenvectors to have unit length for convenience.

## Finding Eigenvalues: The Characteristic Polynomial

To find eigenvalues, we need to solve the eigen equation systematically. Rearranging $A\mathbf{v} = \lambda\mathbf{v}$ gives us:

$A\mathbf{v} - \lambda\mathbf{v} = \mathbf{0}$

$(A - \lambda I)\mathbf{v} = \mathbf{0}$

where:

- $I$ is the identity matrix of the same size as $A$
- $\mathbf{0}$ is the zero vector

For a non-zero solution $\mathbf{v}$ to exist, the matrix $(A - \lambda I)$ must be singular (non-invertible). This happens precisely when its determinant equals zero.

#### The Characteristic Equation

The characteristic equation determines all eigenvalues of a matrix:

$\det(A - \lambda I) = 0$

where:

- $\det$ denotes the determinant
- $A$ is the square matrix
- $\lambda$ represents the unknown eigenvalue
- $I$ is the identity matrix

#### The Characteristic Polynomial

Expanding the determinant $\det(A - \lambda I)$ produces a polynomial in $\lambda$ called the **characteristic polynomial**. For an $n \times n$ matrix, this polynomial has degree $n$:

$p(\lambda) = \det(A - \lambda I) = (-1)^n \lambda^n + c_{n-1}\lambda^{n-1} + \cdots + c_1\lambda + c_0$

The eigenvalues are the roots of this polynomial.

### Example: Finding Eigenvalues of a 2×2 Matrix

Consider the matrix:

$A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$

Step 1: Form $(A - \lambda I)$:

$A - \lambda I = \begin{bmatrix} 4-\lambda & 2 \\ 1 & 3-\lambda \end{bmatrix}$

Step 2: Compute the determinant:

$\det(A - \lambda I) = (4-\lambda)(3-\lambda) - (2)(1)$
$= 12 - 4\lambda - 3\lambda + \lambda^2 - 2$
$= \lambda^2 - 7\lambda + 10$

Step 3: Solve the characteristic equation:

$\lambda^2 - 7\lambda + 10 = 0$
$(\lambda - 5)(\lambda - 2) = 0$

The eigenvalues are $\lambda_1 = 5$ and $\lambda_2 = 2$.

#### Diagram: Characteristic Polynomial Explorer

<iframe src="../../sims/characteristic-polynomial/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Characteristic Polynomial Explorer Fullscreen](../../sims/characteristic-polynomial/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Characteristic Polynomial Explorer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Enable students to interactively compute characteristic polynomials and find eigenvalues for 2x2 and 3x3 matrices

Visual elements:
- Left panel: Matrix input grid (2x2 or 3x3)
- Center panel: Step-by-step calculation display showing:
  - The (A - λI) matrix with λ as variable
  - Determinant expansion
  - Resulting polynomial in standard form
- Right panel: Graph of the characteristic polynomial with x-axis as λ
- Eigenvalues marked as points where curve crosses x-axis
- Vertical dashed lines from roots to x-axis

Interactive controls:
- Matrix size toggle (2x2 / 3x3)
- Numeric input fields for matrix entries
- "Calculate" button to compute polynomial
- Slider to trace along the polynomial curve
- Pre-set example matrices dropdown (identity, rotation, symmetric, defective)

Default parameters:
- 2x2 matrix mode
- Matrix A = [[4, 2], [1, 3]]
- Polynomial graph range: λ from -2 to 8
- Canvas size: responsive, minimum 900x500px

Behavior:
- Real-time polynomial graph update as matrix values change
- Highlight eigenvalues on graph with dots and labels
- Show factored form when roots are nice numbers
- Display "Complex roots" indicator when polynomial has no real zeros
- Step-through animation of determinant calculation

Implementation: p5.js with math expression rendering
</details>

## Finding Eigenvectors

Once we have an eigenvalue $\lambda$, we find its corresponding eigenvector(s) by solving:

$(A - \lambda I)\mathbf{v} = \mathbf{0}$

This is a homogeneous system of linear equations. We use row reduction to find the null space of $(A - \lambda I)$.

### Example: Finding Eigenvectors

Continuing with our matrix $A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$:

**For $\lambda_1 = 5$:**

$A - 5I = \begin{bmatrix} -1 & 2 \\ 1 & -2 \end{bmatrix}$

Row reduce to find the null space:

$\begin{bmatrix} -1 & 2 \\ 1 & -2 \end{bmatrix} \rightarrow \begin{bmatrix} 1 & -2 \\ 0 & 0 \end{bmatrix}$

From $x_1 - 2x_2 = 0$, we get $x_1 = 2x_2$. Setting $x_2 = 1$:

$\mathbf{v}_1 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$

**For $\lambda_2 = 2$:**

$A - 2I = \begin{bmatrix} 2 & 2 \\ 1 & 1 \end{bmatrix}$

Row reduce:

$\begin{bmatrix} 2 & 2 \\ 1 & 1 \end{bmatrix} \rightarrow \begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}$

From $x_1 + x_2 = 0$, we get $x_1 = -x_2$. Setting $x_2 = 1$:

$\mathbf{v}_2 = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$

## Eigenspace

The **eigenspace** corresponding to an eigenvalue $\lambda$ is the set of all eigenvectors with that eigenvalue, together with the zero vector. Formally:

$E_\lambda = \text{null}(A - \lambda I) = \{\mathbf{v} \in \mathbb{R}^n : A\mathbf{v} = \lambda\mathbf{v}\}$

The eigenspace is a vector subspace of $\mathbb{R}^n$. Its dimension is called the **geometric multiplicity** of the eigenvalue.

Key properties of eigenspaces:

- Every eigenspace contains the zero vector
- Every eigenspace is closed under addition and scalar multiplication
- The dimension of an eigenspace is at least 1
- Eigenvectors from different eigenspaces are linearly independent

#### Diagram: Eigenspace Visualization

<iframe src="../../sims/eigenspace-visualization/main.html" height="550px" width="100%" scrolling="no"></iframe>

[Run the Eigenspace Visualizer Fullscreen](../../sims/eigenspace-visualization/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Eigenspace Visualization</summary>
Type: diagram

Bloom Taxonomy Level: Understand

Learning Objective: Visualize eigenspaces as subspaces and understand how their dimension relates to geometric multiplicity

Components to show:
- 3D coordinate system with translucent planes/lines representing eigenspaces
- For a 3x3 matrix with three distinct eigenvalues: three lines through origin
- For a 3x3 matrix with a repeated eigenvalue (geometric multiplicity 2): one line and one plane
- Original vectors and their transformed counterparts
- Color coding by eigenvalue

Layout:
- Main 3D view showing eigenspaces
- Rotation controls to view from different angles
- Matrix display in corner
- Legend showing eigenvalue-color correspondence

Visual style:
- Eigenspaces rendered as semi-transparent colored surfaces
- Lines rendered as tubes for visibility
- Sample vectors as arrows with different opacities

Color scheme:
- Eigenspace 1: Blue (line or plane)
- Eigenspace 2: Orange (line or plane)
- Eigenspace 3: Green (line)
- Background grid: Light gray

Implementation: Three.js or p5.js with WEBGL mode for 3D rendering
</details>

## Algebraic and Geometric Multiplicity

The relationship between algebraic and geometric multiplicity is fundamental to understanding when matrices can be diagonalized.

### Algebraic Multiplicity

The **algebraic multiplicity** of an eigenvalue is the number of times it appears as a root of the characteristic polynomial. If the characteristic polynomial factors as:

$p(\lambda) = (\lambda - \lambda_1)^{m_1}(\lambda - \lambda_2)^{m_2} \cdots (\lambda - \lambda_k)^{m_k}$

then the algebraic multiplicity of $\lambda_i$ is $m_i$.

### Geometric Multiplicity

The **geometric multiplicity** of an eigenvalue is the dimension of its eigenspace:

$g_i = \dim(E_{\lambda_i}) = \dim(\text{null}(A - \lambda_i I))$

### The Multiplicity Inequality

A fundamental theorem states that for any eigenvalue:

$1 \leq \text{geometric multiplicity} \leq \text{algebraic multiplicity}$

This inequality has profound implications for diagonalization.

| Scenario | Algebraic | Geometric | Diagonalizable? |
|----------|-----------|-----------|-----------------|
| All eigenvalues distinct | 1 each | 1 each | Yes |
| Repeated eigenvalue, full eigenspace | $m$ | $m$ | Yes |
| Repeated eigenvalue, deficient eigenspace | $m$ | $< m$ | No |

#### Diagram: Multiplicity Comparison Chart

<iframe src="../../sims/multiplicity-comparison/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Multiplicity Comparison Chart Fullscreen](../../sims/multiplicity-comparison/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Multiplicity Comparison Chart</summary>
Type: infographic

Bloom Taxonomy Level: Analyze

Learning Objective: Compare algebraic and geometric multiplicity across different matrix types and understand implications for diagonalization

Layout: Three-column comparison with expandable examples

Sections:
1. "Distinct Eigenvalues" column
   - Example: A = [[2, 0], [0, 3]]
   - Characteristic polynomial: (λ-2)(λ-3)
   - Each eigenvalue has alg. mult. = geo. mult. = 1
   - Status: Diagonalizable ✓

2. "Repeated with Full Eigenspace" column
   - Example: A = [[2, 0], [0, 2]]
   - Characteristic polynomial: (λ-2)²
   - Eigenvalue 2: alg. mult. = 2, geo. mult. = 2
   - Status: Diagonalizable ✓

3. "Defective Matrix" column
   - Example: A = [[2, 1], [0, 2]]
   - Characteristic polynomial: (λ-2)²
   - Eigenvalue 2: alg. mult. = 2, geo. mult. = 1
   - Status: Not Diagonalizable ✗

Interactive elements:
- Hover over each example to see eigenspace visualization
- Click to expand full calculation
- Toggle between 2x2 and 3x3 examples

Visual style:
- Clean cards with matrix notation
- Color indicators: green for diagonalizable, red for defective
- Progress bars showing geometric/algebraic ratio

Implementation: HTML/CSS/JavaScript with SVG visualizations
</details>

## Similar Matrices and Diagonalization

Two matrices $A$ and $B$ are **similar** if there exists an invertible matrix $P$ such that:

$B = P^{-1}AP$

Similar matrices share important properties:

- Same eigenvalues (with same algebraic multiplicities)
- Same determinant
- Same trace
- Same rank
- Same characteristic polynomial

The geometric interpretation is that similar matrices represent the same linear transformation in different bases.

### Diagonalization

A matrix $A$ is **diagonalizable** if it is similar to a diagonal matrix. This means we can write:

$A = PDP^{-1}$

where:

- $D$ is a diagonal matrix containing the eigenvalues
- $P$ is a matrix whose columns are the corresponding eigenvectors

#### The Diagonal Form

The **diagonal form** $D$ of a diagonalizable matrix contains eigenvalues on its main diagonal:

$D = \begin{bmatrix} \lambda_1 & 0 & \cdots & 0 \\ 0 & \lambda_2 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \lambda_n \end{bmatrix}$

### Conditions for Diagonalizability

A matrix $A$ is diagonalizable if and only if:

1. The sum of geometric multiplicities equals $n$ (the matrix dimension), OR
2. For each eigenvalue, geometric multiplicity equals algebraic multiplicity, OR
3. $A$ has $n$ linearly independent eigenvectors

#### Diagram: Diagonalization Process Workflow

<iframe src="../../sims/diagonalization-workflow/main.html" height="540px" width="100%" scrolling="no"></iframe>

[Run the Diagonalization Workflow Fullscreen](../../sims/diagonalization-workflow/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Diagonalization Process Workflow</summary>
Type: workflow

Bloom Taxonomy Level: Apply

Learning Objective: Guide students through the step-by-step process of diagonalizing a matrix

Visual style: Flowchart with decision diamonds and process rectangles

Steps:
1. Start: "Given matrix A"
   Hover text: "Begin with an n×n matrix A"

2. Process: "Find characteristic polynomial det(A - λI)"
   Hover text: "Expand determinant to get polynomial in λ"

3. Process: "Solve characteristic equation for eigenvalues"
   Hover text: "Find all roots λ₁, λ₂, ..., λₖ"

4. Decision: "All n eigenvalues found (counting multiplicity)?"
   Hover text: "Complex eigenvalues count too"
   - No → End: "Check for complex eigenvalues"

5. Process: "For each eigenvalue, find eigenvectors"
   Hover text: "Solve (A - λI)v = 0 for each λ"

6. Process: "Determine geometric multiplicity of each eigenvalue"
   Hover text: "Count linearly independent eigenvectors"

7. Decision: "Geometric mult. = Algebraic mult. for all eigenvalues?"
   - No → End: "Matrix is NOT diagonalizable"
   - Yes → Continue

8. Process: "Form P from eigenvector columns"
   Hover text: "P = [v₁ | v₂ | ... | vₙ]"

9. Process: "Form D from eigenvalues"
   Hover text: "D = diag(λ₁, λ₂, ..., λₙ)"

10. End: "A = PDP⁻¹"
    Hover text: "Diagonalization complete!"

Color coding:
- Blue: Computation steps
- Yellow: Decision points
- Green: Success outcomes
- Red: Failure outcomes

Implementation: Mermaid.js or custom SVG with hover interactions
</details>

### Why Diagonalization Matters

Diagonalization simplifies many computations:

**Matrix Powers:** Computing $A^k$ becomes trivial:

$A^k = PD^kP^{-1}$

where $D^k = \begin{bmatrix} \lambda_1^k & 0 & \cdots \\ 0 & \lambda_2^k & \cdots \\ \vdots & \vdots & \ddots \end{bmatrix}$

**Exponentials:** The matrix exponential $e^A$ is essential for solving differential equations:

$e^A = Pe^DP^{-1}$

where $e^D = \begin{bmatrix} e^{\lambda_1} & 0 & \cdots \\ 0 & e^{\lambda_2} & \cdots \\ \vdots & \vdots & \ddots \end{bmatrix}$

**Systems of Differential Equations:** The system $\frac{d\mathbf{x}}{dt} = A\mathbf{x}$ has solution:

$\mathbf{x}(t) = c_1e^{\lambda_1 t}\mathbf{v}_1 + c_2e^{\lambda_2 t}\mathbf{v}_2 + \cdots$

#### Diagram: Matrix Power Calculator

<iframe src="../../sims/matrix-power-calculator/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Matrix Power Calculator Fullscreen](../../sims/matrix-power-calculator/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Matrix Power Calculator MicroSim</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Demonstrate how diagonalization simplifies computing matrix powers by comparing direct multiplication vs. the eigenvalue approach

Visual elements:
- Left panel: Input matrix A (2x2 or 3x3)
- Center panel: Diagonalization display showing P, D, P⁻¹
- Right panel: Result matrix Aᵏ
- Bottom: Step-by-step calculation toggle

Interactive controls:
- Matrix entry fields for A
- Power k slider (1 to 20)
- "Compute Direct" button (shows A×A×...×A method)
- "Compute via Diagonalization" button (shows PD^kP^{-1} method)
- Speed comparison display
- Animation speed slider

Default parameters:
- Matrix A = [[2, 1], [0, 3]]
- Power k = 5
- Canvas: responsive layout

Behavior:
- Show step-by-step computation for both methods
- Highlight the efficiency of eigenvalue method for large k
- Display operation count for each method
- Warning message if matrix is not diagonalizable
- Show numerical error comparison for high powers

Implementation: p5.js with matrix computation library
</details>

## Eigendecomposition

The **eigendecomposition** (also called spectral decomposition for symmetric matrices) expresses a diagonalizable matrix as a product of its eigenvectors and eigenvalues:

$A = PDP^{-1} = \sum_{i=1}^{n} \lambda_i \mathbf{v}_i \mathbf{v}_i^T$ (for symmetric matrices with orthonormal eigenvectors)

More generally, for any diagonalizable matrix:

$A = \sum_{i=1}^{n} \lambda_i \mathbf{v}_i \mathbf{w}_i^T$

where:

- $\mathbf{v}_i$ are the right eigenvectors (columns of $P$)
- $\mathbf{w}_i$ are the left eigenvectors (rows of $P^{-1}$)
- $\lambda_i$ are the eigenvalues

This representation reveals that a matrix can be decomposed into a sum of rank-1 matrices, each scaled by an eigenvalue.

## Complex Eigenvalues

Real matrices can have **complex eigenvalues**. When they occur, complex eigenvalues always appear in conjugate pairs: if $\lambda = a + bi$ is an eigenvalue, so is $\bar{\lambda} = a - bi$.

### Geometric Interpretation

Complex eigenvalues indicate rotation in the transformation. For a 2×2 real matrix with eigenvalues $\lambda = a \pm bi$:

- $|{\lambda}| = \sqrt{a^2 + b^2}$ gives the scaling factor
- $\theta = \arctan(b/a)$ gives the rotation angle

### Example: Rotation Matrix

The rotation matrix by angle $\theta$:

$R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$

has eigenvalues $\lambda = \cos\theta \pm i\sin\theta = e^{\pm i\theta}$.

For a 90° rotation:

$R_{90°} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$

The eigenvalues are $\lambda = \pm i$, which are purely imaginary—reflecting pure rotation with no scaling.

#### Diagram: Complex Eigenvalue Visualizer

<iframe src="../../sims/complex-eigenvalue/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Complex Eigenvalue Visualizer Fullscreen](../../sims/complex-eigenvalue/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Complex Eigenvalue Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize how complex eigenvalues correspond to rotation-scaling transformations in 2D

Visual elements:
- Left panel: 2D plane showing transformation of a unit square
- Right panel: Complex plane showing eigenvalue locations
- Unit circle on complex plane for reference
- Spiral path showing repeated application of transformation
- Angle arc showing rotation per step

Interactive controls:
- Slider for real part a of eigenvalue (range: -2 to 2)
- Slider for imaginary part b of eigenvalue (range: -2 to 2)
- "Animate" button to show repeated transformation
- Step counter display
- "Show Conjugate Pair" toggle
- Reset button

Default parameters:
- a = 0.9 (slight contraction)
- b = 0.4 (rotation component)
- Canvas: 800x400px responsive

Behavior:
- As sliders adjust, show corresponding matrix A
- Animate unit square through multiple transformation steps
- Plot trajectory of corner point as spiral
- Display eigenvalue magnitude and angle
- Show connection between eigenvalue position and transformation behavior:
  - |λ| > 1: spiral outward
  - |λ| < 1: spiral inward
  - |λ| = 1: pure rotation (circle)
- Highlight conjugate pair relationship

Implementation: p5.js with complex number support
</details>

## Symmetric Matrices and the Spectral Theorem

Symmetric matrices ($A = A^T$) have particularly nice eigenvalue properties that make them central to applications in machine learning, physics, and engineering.

### Symmetric Eigenvalues

For a symmetric matrix $A$:

1. **All eigenvalues are real** (no complex eigenvalues)
2. **Eigenvectors corresponding to distinct eigenvalues are orthogonal**
3. **The matrix is always diagonalizable**

These properties follow from the fact that symmetric matrices equal their own transposes, constraining the characteristic polynomial to have only real roots.

### The Spectral Theorem

The **Spectral Theorem** provides a complete characterization of symmetric matrices:

!!! tip "The Spectral Theorem for Real Symmetric Matrices"
    A real matrix $A$ is symmetric if and only if it can be orthogonally diagonalized:

    $A = Q\Lambda Q^T$

    where $Q$ is an orthogonal matrix ($Q^TQ = I$) whose columns are orthonormal eigenvectors, and $\Lambda$ is a diagonal matrix of real eigenvalues.

The beauty of orthogonal diagonalization is that $Q^{-1} = Q^T$, which is computationally simple to obtain.

### Spectral Decomposition Form

For a symmetric matrix, the eigendecomposition takes the elegant form:

$A = \sum_{i=1}^{n} \lambda_i \mathbf{q}_i \mathbf{q}_i^T$

where:

- $\mathbf{q}_i$ are orthonormal eigenvectors
- $\lambda_i$ are real eigenvalues
- Each $\mathbf{q}_i \mathbf{q}_i^T$ is a projection matrix onto the eigenspace

This decomposition is the foundation of Principal Component Analysis (PCA).

| Property | General Matrix | Symmetric Matrix |
|----------|---------------|------------------|
| Eigenvalues | May be complex | Always real |
| Eigenvectors | Generally not orthogonal | Orthogonal (for distinct λ) |
| Diagonalization | Not guaranteed | Always possible |
| Inverse of P | Must compute P⁻¹ | Simply P^T |
| Numerical stability | May have issues | Highly stable |

#### Diagram: Spectral Theorem for Symmetric Matrices

<iframe src="../../sims/spectral-theorem/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Spectral Theorem Demo Fullscreen](../../sims/spectral-theorem/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Spectral Theorem Interactive Demonstration</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Demonstrate the spectral theorem by showing how symmetric matrices decompose into orthogonal eigenvectors and real eigenvalues

Visual elements:
- Left panel: 2D/3D visualization of transformation
- Center panel: Matrix equation display A = QΛQᵀ
- Right panel: Individual rank-1 components λᵢqᵢqᵢᵀ
- Orthogonality indicator showing qᵢ·qⱼ = 0 for i≠j
- Unit sphere showing eigenvector directions

Interactive controls:
- Symmetric matrix input (auto-enforced: entering aᵢⱼ sets aⱼᵢ)
- Slider to blend between original matrix and diagonal form
- Component selector to highlight individual λᵢqᵢqᵢᵀ terms
- "Verify Orthogonality" button
- 2D/3D toggle (for 2x2 and 3x3 matrices)

Default parameters:
- Matrix A = [[3, 1], [1, 3]] (symmetric)
- Canvas: responsive

Behavior:
- Real-time eigenvalue/eigenvector computation
- Show eigenvectors as perpendicular on unit circle/sphere
- Animate decomposition into sum of outer products
- Verify QQᵀ = I visually
- Display reconstruction error when summing components

Implementation: p5.js with linear algebra computations
</details>

## Power Iteration: Computing the Dominant Eigenvalue

For large matrices, computing eigenvalues through the characteristic polynomial is impractical. **Power iteration** is a simple iterative algorithm for finding the largest eigenvalue and its eigenvector.

### The Dominant Eigenvalue

The **dominant eigenvalue** is the eigenvalue with the largest absolute value:

$|\lambda_1| > |\lambda_2| \geq |\lambda_3| \geq \cdots \geq |\lambda_n|$

The corresponding eigenvector is called the dominant eigenvector.

### Power Iteration Algorithm

The algorithm works by repeatedly multiplying a random vector by the matrix:

1. Start with a random non-zero vector $\mathbf{x}_0$
2. Compute $\mathbf{y}_{k+1} = A\mathbf{x}_k$
3. Normalize: $\mathbf{x}_{k+1} = \mathbf{y}_{k+1} / \|\mathbf{y}_{k+1}\|$
4. Repeat until convergence

#### Convergence Rate

The convergence rate depends on the ratio of the two largest eigenvalues:

$\text{error after } k \text{ iterations} \approx O\left(\left|\frac{\lambda_2}{\lambda_1}\right|^k\right)$

If $|\lambda_1| \gg |\lambda_2|$, convergence is fast. If $|\lambda_1| \approx |\lambda_2|$, convergence is slow.

#### Rayleigh Quotient

After obtaining an approximate eigenvector $\mathbf{x}$, we can estimate the eigenvalue using the **Rayleigh quotient**:

$\lambda \approx R(\mathbf{x}) = \frac{\mathbf{x}^T A \mathbf{x}}{\mathbf{x}^T \mathbf{x}}$

The Rayleigh quotient gives a more accurate eigenvalue estimate than examining vector scaling alone.

#### Diagram: Power Iteration MicroSim

<iframe src="../../sims/power-iteration/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Power Iteration Visualizer Fullscreen](../../sims/power-iteration/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Power Iteration Algorithm Visualization</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how power iteration converges to the dominant eigenvector and how convergence rate depends on the eigenvalue ratio

Visual elements:
- Left panel: 2D plane showing vector iterations
  - Current vector (solid arrow)
  - Previous vectors (faded arrows showing history)
  - True dominant eigenvector direction (dashed line)
  - Angle error indicator
- Right panel: Convergence plot
  - X-axis: iteration number
  - Y-axis: log(error) where error = angle to true eigenvector
  - Theoretical convergence rate line for comparison
- Bottom panel: Matrix and current eigenvalue estimate

Interactive controls:
- 2x2 matrix input
- "Step" button for single iteration
- "Run" button for continuous animation
- Speed slider for animation
- "Reset with Random Vector" button
- Convergence threshold input
- Display of λ₂/λ₁ ratio

Default parameters:
- Matrix A = [[3, 1], [1, 2]] (eigenvalues ≈ 3.62, 1.38)
- Initial vector: random unit vector
- Canvas: 800x600px responsive

Behavior:
- Show each iteration step clearly
- Highlight when convergence criterion met
- Display iteration count and current eigenvalue estimate
- Show Rayleigh quotient computation
- Compare to true eigenvalue (computed analytically for 2x2)
- Demonstrate slow convergence when eigenvalue ratio near 1
- Warning if matrix has complex dominant eigenvalue

Implementation: p5.js with step-by-step animation
</details>

### Variants of Power Iteration

Several important algorithms extend the basic power iteration:

- **Inverse Power Iteration:** Find the smallest eigenvalue by applying power iteration to $A^{-1}$
- **Shifted Inverse Iteration:** Find eigenvalue closest to a given shift $\sigma$ using $(A - \sigma I)^{-1}$
- **QR Algorithm:** Industry-standard method that finds all eigenvalues simultaneously
- **Lanczos Algorithm:** Efficient for large sparse symmetric matrices

## Applications in Machine Learning and AI

Eigenanalysis is fundamental to numerous AI and machine learning algorithms:

### Principal Component Analysis (PCA)

PCA finds the directions of maximum variance in data by computing eigenvectors of the covariance matrix:

1. Center the data: $\bar{X} = X - \mu$
2. Compute covariance matrix: $C = \frac{1}{n-1}\bar{X}^T\bar{X}$
3. Find eigenvalues and eigenvectors of $C$
4. Project data onto top $k$ eigenvectors

The eigenvectors are the principal components, and eigenvalues indicate variance explained.

### PageRank Algorithm

Google's PageRank models web page importance as the dominant eigenvector of a modified adjacency matrix:

$\mathbf{r} = M\mathbf{r}$

where:

- $\mathbf{r}$ is the rank vector (eigenvector)
- $M$ is the transition probability matrix
- PageRank is the eigenvector with eigenvalue 1

### Stability Analysis

In dynamical systems and neural network training, eigenvalues determine stability:

- $|\lambda| < 1$ for all eigenvalues: system is stable (converges)
- $|\lambda| = 1$: system is marginally stable (oscillates)
- $|\lambda| > 1$: system is unstable (explodes)

Neural networks with weight matrices having eigenvalues far from 1 suffer from vanishing or exploding gradients.

#### Diagram: Eigenvalue Applications Map

<iframe src="../../sims/eigenvalue-applications/main.html" height="520px" width="100%" scrolling="no"></iframe>

[Run the Eigenvalue Applications Map Fullscreen](../../sims/eigenvalue-applications/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Eigenvalue Applications in ML and AI</summary>
Type: infographic

Bloom Taxonomy Level: Evaluate

Learning Objective: Connect eigenanalysis concepts to real-world machine learning applications and understand when to apply each technique

Layout: Central hub-and-spoke diagram with clickable nodes

Central concept: "Eigenanalysis"

Spokes (applications):
1. PCA / Dimensionality Reduction
   - Uses: Covariance matrix eigenvectors
   - Key insight: Eigenvectors = directions of max variance
   - Example: Face recognition (Eigenfaces)

2. Spectral Clustering
   - Uses: Graph Laplacian eigenvectors
   - Key insight: Second eigenvector separates clusters
   - Example: Image segmentation

3. Google PageRank
   - Uses: Dominant eigenvector
   - Key insight: Power iteration at web scale
   - Example: Web page ranking

4. Neural Network Stability
   - Uses: Weight matrix eigenvalues
   - Key insight: |λ| controls gradient flow
   - Example: RNN vanishing gradients

5. Recommender Systems
   - Uses: Matrix factorization (related to eigendecomposition)
   - Key insight: Low-rank approximation
   - Example: Netflix recommendations

6. Quantum Computing
   - Uses: Eigenvalues as measurement outcomes
   - Key insight: Observables are Hermitian operators
   - Example: Quantum simulation

Interactive elements:
- Click each spoke to expand details
- Hover for quick summary
- Links to related concepts in other chapters

Visual style:
- Modern flat design with icons for each application
- Color coding by application domain (ML, physics, web, etc.)
- Connecting lines showing concept flow

Implementation: D3.js or custom SVG with interaction handlers
</details>

## Computational Considerations

When working with eigenproblems in practice, several computational issues arise:

### Numerical Stability

- Direct polynomial root-finding is numerically unstable for large matrices
- The QR algorithm is the standard stable method
- Symmetric matrices have more stable algorithms (divide-and-conquer, MRRR)

### Computational Complexity

| Method | Complexity | Use Case |
|--------|------------|----------|
| Characteristic polynomial | $O(n^3)$ for determinant | Theoretical, small matrices |
| Power iteration | $O(n^2)$ per iteration | Dominant eigenvalue only |
| QR algorithm | $O(n^3)$ total | All eigenvalues, dense matrices |
| Lanczos/Arnoldi | $O(kn^2)$ | Top $k$ eigenvalues, sparse matrices |

### Software Libraries

In practice, use optimized libraries:

- **NumPy/SciPy:** `np.linalg.eig()`, `np.linalg.eigh()` for symmetric
- **PyTorch:** `torch.linalg.eig()` for GPU acceleration
- **LAPACK:** Industry-standard Fortran library underlying most implementations

```python
import numpy as np

# General eigenvalue problem
A = np.array([[4, 2], [1, 3]])
eigenvalues, eigenvectors = np.linalg.eig(A)

# Symmetric matrix (more stable)
S = np.array([[3, 1], [1, 3]])
eigenvalues, eigenvectors = np.linalg.eigh(S)
```

## Summary

This chapter introduced eigenanalysis as a fundamental tool for understanding linear transformations:

**Core Concepts:**

- **Eigenvalues and eigenvectors** satisfy $A\mathbf{v} = \lambda\mathbf{v}$, revealing directions preserved by transformations
- The **characteristic polynomial** $\det(A - \lambda I) = 0$ yields eigenvalues as its roots
- **Eigenspaces** are subspaces containing all eigenvectors for a given eigenvalue

**Multiplicities and Diagonalization:**

- **Algebraic multiplicity** counts eigenvalue repetition in the characteristic polynomial
- **Geometric multiplicity** measures eigenspace dimension
- A matrix is **diagonalizable** when geometric equals algebraic multiplicity for all eigenvalues
- **Similar matrices** share eigenvalues and represent the same transformation in different bases

**Special Cases:**

- **Complex eigenvalues** indicate rotation and appear in conjugate pairs for real matrices
- **Symmetric matrices** have real eigenvalues and orthogonal eigenvectors (Spectral Theorem)

**Computation:**

- **Power iteration** finds the dominant eigenvalue through repeated matrix-vector multiplication
- The **Rayleigh quotient** provides eigenvalue estimates from approximate eigenvectors
- **Eigendecomposition** $A = PDP^{-1}$ enables efficient computation of matrix powers and exponentials

**Key Takeaways for AI/ML:**

1. PCA reduces dimensionality using covariance matrix eigenvectors
2. PageRank is an eigenvector problem solved by power iteration
3. Neural network stability depends on weight matrix eigenvalues
4. The spectral theorem guarantees nice properties for symmetric matrices (common in ML)

??? question "Self-Check: Can you identify which eigenvalue property determines whether a neural network's gradients will vanish or explode?"
    The magnitude of the eigenvalues of the weight matrices determines gradient behavior. If $|\lambda| < 1$ for all eigenvalues, gradients shrink exponentially (vanishing). If $|\lambda| > 1$, gradients grow exponentially (exploding). Stable training requires eigenvalues near $|\lambda| = 1$.
