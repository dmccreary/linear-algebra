---
title: Vector Spaces and Inner Products
description: Abstract framework for vector spaces, orthogonality, projections, and the fundamental subspaces
generated_by: claude skill chapter-content-generator
date: 2026-01-17 15:30:00
version: 0.03
---

# Vector Spaces and Inner Products

## Summary

Generalizing concepts from earlier chapters, this section develops the abstract framework underlying all applications. You will learn about abstract vector spaces, inner products, orthogonality, the Gram-Schmidt orthogonalization process, and projections. This chapter also covers the four fundamental subspaces of a matrix and the pseudoinverse, which are essential for least squares and machine learning.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Abstract Vector Space
2. Subspace
3. Vector Space Axioms
4. Inner Product
5. Inner Product Space
6. Norm from Inner Product
7. Cauchy-Schwarz Inequality
8. Orthogonality
9. Orthogonal Vectors
10. Orthonormal Set
11. Orthonormal Basis
12. Gram-Schmidt Process
13. Projection onto Subspace
14. Least Squares Problem
15. Normal Equations
16. Row Space
17. Left Null Space
18. Four Subspaces
19. Pseudoinverse

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 4: Linear Transformations](../04-linear-transformations/index.md)

---

## Introduction

So far, we have worked with vectors as arrows in $\mathbb{R}^n$—ordered lists of real numbers that we can add and scale. But the power of linear algebra extends far beyond number arrays. Functions, matrices, polynomials, and even quantum states can all be treated as "vectors" in appropriately defined spaces.

This chapter develops the abstract framework that unifies these diverse applications. By identifying the essential properties that make $\mathbb{R}^n$ useful—the ability to add vectors, scale them, measure lengths, and find angles—we can extend linear algebra to any mathematical structure satisfying these properties.

The payoff is enormous. The same techniques that solve systems of equations in $\mathbb{R}^n$ can approximate functions with polynomials, denoise signals, and find optimal solutions in infinite-dimensional spaces. The abstract perspective reveals that linear algebra is not just about numbers—it's about structure.

## Abstract Vector Spaces

An **abstract vector space** is a set $V$ equipped with two operations—vector addition and scalar multiplication—that satisfy certain axioms. The elements of $V$ are called vectors, though they need not be column vectors in the traditional sense.

### Vector Space Axioms

A vector space over the real numbers must satisfy the following **vector space axioms**:

**Addition axioms:**

1. **Closure under addition:** For all $\mathbf{u}, \mathbf{v} \in V$, we have $\mathbf{u} + \mathbf{v} \in V$
2. **Commutativity:** $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$
3. **Associativity:** $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$
4. **Zero vector:** There exists $\mathbf{0} \in V$ such that $\mathbf{v} + \mathbf{0} = \mathbf{v}$ for all $\mathbf{v}$
5. **Additive inverse:** For each $\mathbf{v}$, there exists $-\mathbf{v}$ such that $\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$

**Scalar multiplication axioms:**

6. **Closure under scalar multiplication:** For all $c \in \mathbb{R}$ and $\mathbf{v} \in V$, we have $c\mathbf{v} \in V$
7. **Distributivity over vector addition:** $c(\mathbf{u} + \mathbf{v}) = c\mathbf{u} + c\mathbf{v}$
8. **Distributivity over scalar addition:** $(c + d)\mathbf{v} = c\mathbf{v} + d\mathbf{v}$
9. **Associativity of scalar multiplication:** $c(d\mathbf{v}) = (cd)\mathbf{v}$
10. **Identity element:** $1 \cdot \mathbf{v} = \mathbf{v}$

These axioms capture the essential algebraic properties needed for linear algebra to work.

### Examples of Vector Spaces

| Vector Space | Elements | Addition | Scalar Multiplication |
|--------------|----------|----------|----------------------|
| $\mathbb{R}^n$ | Column vectors | Component-wise | Component-wise |
| $\mathcal{P}_n$ | Polynomials of degree $\leq n$ | Add coefficients | Multiply coefficients |
| $\mathcal{C}[a,b]$ | Continuous functions on $[a,b]$ | $(f+g)(x) = f(x)+g(x)$ | $(cf)(x) = c \cdot f(x)$ |
| $\mathbb{R}^{m \times n}$ | $m \times n$ matrices | Entry-wise | Entry-wise |
| Solutions to $A\mathbf{x} = \mathbf{0}$ | Null space vectors | Inherited from $\mathbb{R}^n$ | Inherited from $\mathbb{R}^n$ |

!!! note "The Zero Vector"
    Every vector space must contain a zero vector $\mathbf{0}$. In $\mathbb{R}^n$, it's the origin. In function spaces, it's the function $f(x) = 0$. In matrix spaces, it's the zero matrix.

#### Diagram: Vector Space Examples Gallery

<details markdown="1">
<summary>Vector Space Examples Gallery</summary>
Type: infographic

Bloom Taxonomy Level: Understand

Learning Objective: Recognize diverse examples of vector spaces and identify the zero vector and operations in each

Layout: Grid of 6 cards, each representing a different vector space

Cards:
1. "$\mathbb{R}^2$: The Plane"
   - Visual: 2D coordinate system with vectors
   - Zero: Origin (0, 0)
   - Example: $\mathbf{v} = (3, 4)$

2. "$\mathbb{R}^3$: 3D Space"
   - Visual: 3D coordinate system
   - Zero: Origin (0, 0, 0)
   - Example: $\mathbf{v} = (1, 2, 3)$

3. "$\mathcal{P}_2$: Quadratic Polynomials"
   - Visual: Parabola graphs
   - Zero: $p(x) = 0$
   - Example: $p(x) = 2x^2 - 3x + 1$

4. "Continuous Functions"
   - Visual: Function curve plot
   - Zero: $f(x) = 0$ (horizontal axis)
   - Example: $f(x) = \sin(x)$

5. "$\mathbb{R}^{2 \times 2}$: 2×2 Matrices"
   - Visual: Matrix grid representation
   - Zero: Zero matrix
   - Example: $A = [[1,2],[3,4]]$

6. "Null Space of A"
   - Visual: Plane through origin in 3D
   - Zero: Origin
   - Example: All $\mathbf{x}$ where $A\mathbf{x} = \mathbf{0}$

Interactive elements:
- Hover to see addition and scalar multiplication examples
- Click to verify axioms interactively

Visual style:
- Consistent card format with icons
- Color-coded by dimension (finite vs. infinite)

Implementation: HTML/CSS grid with SVG visualizations
</details>

## Subspaces

A **subspace** of a vector space $V$ is a non-empty subset $W \subseteq V$ that is itself a vector space under the same operations. Rather than checking all ten axioms, we can use a simpler test.

### Subspace Test

A non-empty subset $W$ of $V$ is a subspace if and only if:

1. **Closed under addition:** For all $\mathbf{u}, \mathbf{w} \in W$, we have $\mathbf{u} + \mathbf{w} \in W$
2. **Closed under scalar multiplication:** For all $c \in \mathbb{R}$ and $\mathbf{w} \in W$, we have $c\mathbf{w} \in W$

Equivalently (single condition): For all $\mathbf{u}, \mathbf{w} \in W$ and scalars $c, d$:
$c\mathbf{u} + d\mathbf{w} \in W$

### Important Subspaces

Every matrix $A$ has associated subspaces:

- **Column space** $\text{col}(A)$: All linear combinations of columns of $A$
- **Null space** $\text{null}(A)$: All solutions to $A\mathbf{x} = \mathbf{0}$
- **Row space** $\text{row}(A)$: All linear combinations of rows of $A$
- **Left null space** $\text{null}(A^T)$: All solutions to $A^T\mathbf{y} = \mathbf{0}$

### Non-Examples

Not every subset is a subspace:

- The unit circle in $\mathbb{R}^2$ is not a subspace (not closed under addition)
- The first quadrant in $\mathbb{R}^2$ is not a subspace (not closed under scalar multiplication by negatives)
- A line not through the origin is not a subspace (no zero vector)

#### Diagram: Subspace Tester

<details markdown="1">
<summary>Subspace Tester MicroSim</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Test whether sets are subspaces by checking closure under linear combinations

Visual elements:
- 2D coordinate plane
- Set definition displayed (equation or description)
- Test vectors $\mathbf{u}$ and $\mathbf{v}$ as draggable arrows
- Linear combination $c\mathbf{u} + d\mathbf{v}$ shown
- Set boundary highlighted

Interactive controls:
- Preset sets dropdown: "Line through origin", "Line not through origin", "First quadrant", "Circle", "Plane in 3D"
- Sliders for scalars c and d
- Draggable points for u and v (constrained to set)
- "Check if Subspace" button with explanation

Default parameters:
- Set: Line through origin (y = 2x)
- Scalars c = 1, d = 1
- Canvas: responsive

Behavior:
- Highlight when linear combination leaves the set (subspace test fails)
- Green indicator when combination stays in set
- Explain which property fails for non-subspaces
- Show counter-example automatically

Implementation: p5.js with interactive geometry
</details>

## Inner Products and Inner Product Spaces

An **inner product** generalizes the dot product to abstract vector spaces, enabling us to measure lengths and angles.

### Inner Product Definition

An **inner product** on a vector space $V$ is a function $\langle \cdot, \cdot \rangle : V \times V \to \mathbb{R}$ satisfying:

1. **Symmetry:** $\langle \mathbf{u}, \mathbf{v} \rangle = \langle \mathbf{v}, \mathbf{u} \rangle$
2. **Linearity in first argument:** $\langle c\mathbf{u} + d\mathbf{w}, \mathbf{v} \rangle = c\langle \mathbf{u}, \mathbf{v} \rangle + d\langle \mathbf{w}, \mathbf{v} \rangle$
3. **Positive definiteness:** $\langle \mathbf{v}, \mathbf{v} \rangle \geq 0$, with equality iff $\mathbf{v} = \mathbf{0}$

A vector space equipped with an inner product is called an **inner product space**.

### Standard Inner Products

| Space | Inner Product | Formula |
|-------|---------------|---------|
| $\mathbb{R}^n$ | Dot product | $\langle \mathbf{u}, \mathbf{v} \rangle = \mathbf{u}^T\mathbf{v} = \sum_{i=1}^n u_i v_i$ |
| $\mathcal{C}[a,b]$ | Integral | $\langle f, g \rangle = \int_a^b f(x)g(x)\,dx$ |
| $\mathbb{R}^{m \times n}$ | Frobenius | $\langle A, B \rangle = \text{tr}(A^TB) = \sum_{i,j} a_{ij}b_{ij}$ |
| Weighted $\mathbb{R}^n$ | Weighted dot | $\langle \mathbf{u}, \mathbf{v} \rangle_W = \mathbf{u}^TW\mathbf{v}$ (W positive definite) |

### Norm from Inner Product

Every inner product induces a **norm** (length function):

$\|\mathbf{v}\| = \sqrt{\langle \mathbf{v}, \mathbf{v} \rangle}$

For the standard dot product on $\mathbb{R}^n$, this gives the Euclidean norm:

$\|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}$

The norm satisfies:

- **Positivity:** $\|\mathbf{v}\| \geq 0$, with equality iff $\mathbf{v} = \mathbf{0}$
- **Homogeneity:** $\|c\mathbf{v}\| = |c| \cdot \|\mathbf{v}\|$
- **Triangle inequality:** $\|\mathbf{u} + \mathbf{v}\| \leq \|\mathbf{u}\| + \|\mathbf{v}\|$

#### Diagram: Inner Product Visualizer

<details markdown="1">
<summary>Inner Product Space Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize how different inner products define different notions of length and angle

Visual elements:
- 2D plane with two adjustable vectors u and v
- Unit circle for standard inner product
- Transformed unit "circle" (ellipse) for weighted inner product
- Angle arc between vectors
- Length labels for each vector

Interactive controls:
- Draggable endpoints for vectors u and v
- Inner product selector: "Standard dot product", "Weighted (diagonal W)", "Weighted (general W)"
- Weight matrix input (for weighted inner products)
- Display: inner product value, norms, angle

Default parameters:
- Standard dot product
- u = (3, 1), v = (1, 2)
- Canvas: responsive

Behavior:
- Real-time update of inner product, norms, angle
- Show how unit ball changes with different inner products
- Demonstrate that angle definition depends on inner product
- Verify Cauchy-Schwarz inequality visually

Implementation: p5.js with dynamic geometry
</details>

### The Cauchy-Schwarz Inequality

The **Cauchy-Schwarz inequality** is one of the most important results in linear algebra:

$|\langle \mathbf{u}, \mathbf{v} \rangle| \leq \|\mathbf{u}\| \cdot \|\mathbf{v}\|$

where:

- Equality holds if and only if $\mathbf{u}$ and $\mathbf{v}$ are linearly dependent
- This inequality holds in every inner product space

For the standard dot product in $\mathbb{R}^n$:

$|\mathbf{u} \cdot \mathbf{v}| \leq \|\mathbf{u}\|_2 \cdot \|\mathbf{v}\|_2$

### Angle Between Vectors

The Cauchy-Schwarz inequality guarantees that:

$-1 \leq \frac{\langle \mathbf{u}, \mathbf{v} \rangle}{\|\mathbf{u}\| \cdot \|\mathbf{v}\|} \leq 1$

This allows us to define the **angle** $\theta$ between vectors:

$\cos\theta = \frac{\langle \mathbf{u}, \mathbf{v} \rangle}{\|\mathbf{u}\| \cdot \|\mathbf{v}\|}$

!!! tip "Cauchy-Schwarz in Applications"
    Cauchy-Schwarz appears throughout machine learning:

    - **Cosine similarity:** $\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$ measures document/word similarity
    - **Correlation coefficient:** Normalized covariance uses Cauchy-Schwarz to bound $|\rho| \leq 1$
    - **Attention mechanisms:** Softmax of dot products for similarity scoring

## Orthogonality

**Orthogonality** is the generalization of perpendicularity to abstract vector spaces.

### Orthogonal Vectors

Two vectors $\mathbf{u}$ and $\mathbf{v}$ are **orthogonal** (written $\mathbf{u} \perp \mathbf{v}$) if:

$\langle \mathbf{u}, \mathbf{v} \rangle = 0$

In $\mathbb{R}^n$ with the standard dot product, this means $\mathbf{u} \cdot \mathbf{v} = 0$.

Key properties:

- The zero vector is orthogonal to every vector
- Orthogonal non-zero vectors are linearly independent
- The Pythagorean theorem generalizes: if $\mathbf{u} \perp \mathbf{v}$, then $\|\mathbf{u} + \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2$

### Orthonormal Sets and Bases

An **orthonormal set** is a set of vectors that are:

1. **Pairwise orthogonal:** $\langle \mathbf{u}_i, \mathbf{u}_j \rangle = 0$ for $i \neq j$
2. **Unit length:** $\|\mathbf{u}_i\| = 1$ for all $i$

An **orthonormal basis** is an orthonormal set that spans the entire space.

| Property | Orthogonal Set | Orthonormal Set | Orthonormal Basis |
|----------|----------------|-----------------|-------------------|
| Pairwise orthogonal | ✓ | ✓ | ✓ |
| Unit vectors | ✗ | ✓ | ✓ |
| Spans space | ✗ | ✗ | ✓ |
| Linearly independent | ✓ (if non-zero) | ✓ | ✓ |

### Why Orthonormal Bases Matter

Orthonormal bases dramatically simplify computations:

**Coordinate computation:** If $\{\mathbf{q}_1, \ldots, \mathbf{q}_n\}$ is orthonormal:

$\mathbf{v} = \sum_{i=1}^n \langle \mathbf{v}, \mathbf{q}_i \rangle \mathbf{q}_i$

The coefficients are just inner products—no matrix inversion needed!

**Parseval's identity:**

$\|\mathbf{v}\|^2 = \sum_{i=1}^n |\langle \mathbf{v}, \mathbf{q}_i \rangle|^2$

**Orthogonal matrices:** A matrix $Q$ is orthogonal if its columns form an orthonormal basis:

$Q^TQ = I \quad \Rightarrow \quad Q^{-1} = Q^T$

#### Diagram: Orthonormal Basis Coordinate Finder

<details markdown="1">
<summary>Orthonormal Basis Coordinate Finder</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Demonstrate how orthonormal bases simplify finding coordinates via inner products

Visual elements:
- 2D or 3D coordinate system
- Standard basis vectors (gray, dashed)
- Orthonormal basis vectors q₁, q₂ (colored arrows)
- Target vector v (black arrow)
- Projection lines from v to each qᵢ
- Coordinate display in both bases

Interactive controls:
- Draggable orthonormal basis vectors (constrained to stay orthonormal)
- Draggable target vector v
- Toggle between 2D and 3D
- "Show Projections" toggle
- "Compare to Standard Basis" toggle

Default parameters:
- 2D mode
- Orthonormal basis at 45° rotation
- v = (3, 2)
- Canvas: responsive

Behavior:
- Show coefficients as inner products: cᵢ = ⟨v, qᵢ⟩
- Demonstrate reconstruction: v = c₁q₁ + c₂q₂
- Verify Parseval's identity visually
- Compare computation effort with non-orthonormal basis

Implementation: p5.js with vector geometry
</details>

## The Gram-Schmidt Process

The **Gram-Schmidt process** converts any linearly independent set of vectors into an orthonormal set spanning the same subspace.

### Algorithm

Given linearly independent vectors $\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_n\}$:

**Step 1: First vector**

$\mathbf{u}_1 = \mathbf{v}_1, \quad \mathbf{q}_1 = \frac{\mathbf{u}_1}{\|\mathbf{u}_1\|}$

**Step 2: Subtract projection, normalize**

For $k = 2, \ldots, n$:

$\mathbf{u}_k = \mathbf{v}_k - \sum_{j=1}^{k-1} \langle \mathbf{v}_k, \mathbf{q}_j \rangle \mathbf{q}_j$

$\mathbf{q}_k = \frac{\mathbf{u}_k}{\|\mathbf{u}_k\|}$

### Geometric Interpretation

Each step:

1. Takes the next input vector $\mathbf{v}_k$
2. Subtracts its projections onto all previously computed $\mathbf{q}_j$
3. Normalizes the result to unit length

The projection $\langle \mathbf{v}_k, \mathbf{q}_j \rangle \mathbf{q}_j$ removes the component of $\mathbf{v}_k$ in the direction of $\mathbf{q}_j$, leaving only the component orthogonal to all previous vectors.

#### Diagram: Gram-Schmidt Process Visualizer

<details markdown="1">
<summary>Gram-Schmidt Step-by-Step Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand the Gram-Schmidt process by watching projection and orthogonalization steps

Visual elements:
- 3D coordinate system
- Input vectors v₁, v₂, v₃ (original, semi-transparent after processing)
- Current vector being processed (highlighted)
- Projection vectors being subtracted (dashed arrows)
- Output orthonormal vectors q₁, q₂, q₃ (solid, colored)
- Right-angle indicators

Interactive controls:
- Input matrix (3 column vectors)
- "Next Step" button
- "Auto Run" with speed slider
- "Reset" button
- "Show All Projections" toggle
- "Show Residual" toggle

Default parameters:
- Three linearly independent vectors in 3D
- Step-by-step mode
- Canvas: responsive 3D view

Behavior:
- Animate each projection subtraction
- Show normalization as length scaling
- Highlight orthogonality between output vectors
- Display intermediate u vectors before normalization
- Warning if vectors become nearly dependent

Implementation: p5.js with WEBGL for 3D
</details>

### Connection to QR Decomposition

Gram-Schmidt applied to the columns of matrix $A$ produces:

$A = QR$

where:

- $Q$ contains the orthonormal vectors $\mathbf{q}_1, \ldots, \mathbf{q}_n$
- $R$ is upper triangular with $r_{ij} = \langle \mathbf{v}_j, \mathbf{q}_i \rangle$ for $i < j$ and $r_{ii} = \|\mathbf{u}_i\|$

## Projection onto Subspaces

**Projection** finds the closest point in a subspace to a given vector—the foundation of least squares.

### Projection onto a Line

The projection of $\mathbf{v}$ onto the line spanned by $\mathbf{u}$ is:

$\text{proj}_{\mathbf{u}}(\mathbf{v}) = \frac{\langle \mathbf{v}, \mathbf{u} \rangle}{\langle \mathbf{u}, \mathbf{u} \rangle} \mathbf{u} = \frac{\mathbf{u}^T\mathbf{v}}{\mathbf{u}^T\mathbf{u}} \mathbf{u}$

The projection matrix onto the line is:

$P = \frac{\mathbf{u}\mathbf{u}^T}{\mathbf{u}^T\mathbf{u}}$

### Projection onto a Subspace

For a subspace $W$ with orthonormal basis $\{\mathbf{q}_1, \ldots, \mathbf{q}_k\}$:

$\text{proj}_W(\mathbf{v}) = \sum_{i=1}^k \langle \mathbf{v}, \mathbf{q}_i \rangle \mathbf{q}_i$

The projection matrix is:

$P = QQ^T$

where $Q = [\mathbf{q}_1 | \cdots | \mathbf{q}_k]$.

For a general subspace with basis columns of $A$:

$P = A(A^TA)^{-1}A^T$

### Properties of Projection Matrices

Projection matrices satisfy:

- **Symmetric:** $P = P^T$
- **Idempotent:** $P^2 = P$ (projecting twice gives the same result)
- **Eigenvalues:** Only 0 and 1 (0 for orthogonal complement, 1 for subspace)

#### Diagram: Projection Visualizer

<details markdown="1">
<summary>Projection onto Subspace Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Visualize projection as finding the closest point in a subspace and understand the orthogonal error

Visual elements:
- 3D coordinate system
- Subspace W shown as a plane through origin (or line)
- Vector v (starting point)
- Projection p = proj_W(v) (on subspace)
- Error vector e = v - p (perpendicular to subspace)
- Right angle indicator between e and subspace

Interactive controls:
- Draggable vector v
- Subspace definition: basis vectors or normal vector
- Toggle between 1D subspace (line) and 2D subspace (plane)
- "Show Projection Matrix" toggle
- "Show Error Vector" toggle

Default parameters:
- 2D subspace (plane) in 3D
- v outside the subspace
- Canvas: responsive 3D view

Behavior:
- Real-time projection update as v moves
- Show that e is orthogonal to subspace
- Display projection formula and computation
- Highlight that p is closest point in subspace to v
- Show distance ||e|| as length of error

Implementation: p5.js with WEBGL for 3D
</details>

## The Least Squares Problem

When a system $A\mathbf{x} = \mathbf{b}$ has no exact solution (overdetermined), we seek the **least squares solution**—the $\mathbf{x}$ that minimizes the error $\|A\mathbf{x} - \mathbf{b}\|^2$.

### Geometric View

The least squares problem asks: find the point $A\mathbf{x}$ in the column space of $A$ closest to $\mathbf{b}$.

The answer is the projection of $\mathbf{b}$ onto the column space:

$A\hat{\mathbf{x}} = \text{proj}_{\text{col}(A)}(\mathbf{b})$

### The Normal Equations

The least squares solution satisfies the **normal equations**:

$A^TA\hat{\mathbf{x}} = A^T\mathbf{b}$

where:

- $A^TA$ is an $n \times n$ symmetric positive semi-definite matrix
- $A^T\mathbf{b}$ is an $n \times 1$ vector
- If $A$ has full column rank, $A^TA$ is positive definite and invertible

#### Derivation

The error vector $\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}}$ must be orthogonal to the column space of $A$:

$A^T\mathbf{e} = \mathbf{0}$

$A^T(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0}$

$A^TA\hat{\mathbf{x}} = A^T\mathbf{b}$

### Solving Least Squares

| Method | Formula | When to Use |
|--------|---------|-------------|
| Normal equations | $\hat{\mathbf{x}} = (A^TA)^{-1}A^T\mathbf{b}$ | Small, well-conditioned problems |
| QR decomposition | $R\hat{\mathbf{x}} = Q^T\mathbf{b}$ | General, numerically stable |
| SVD | $\hat{\mathbf{x}} = V\Sigma^{-1}U^T\mathbf{b}$ | Rank-deficient or ill-conditioned |

!!! warning "Numerical Stability"
    Avoid explicitly forming $A^TA$ when possible. It squares the condition number, amplifying numerical errors. Use QR or SVD instead.

#### Diagram: Least Squares Visualizer

<details markdown="1">
<summary>Least Squares Problem Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Understand least squares as projection and visualize the geometric relationship between b, Ax̂, and the error

Visual elements:
- 3D space showing column space of A as a plane
- Vector b (outside the plane)
- Projection Ax̂ (on the plane)
- Error vector e = b - Ax̂ (perpendicular to plane)
- Data points and fitted line (for 2D regression example)

Interactive controls:
- Switch between "Geometric View" and "Regression View"
- In geometric view: adjust b position
- In regression view: drag data points
- "Show Normal Equations" toggle
- "Compare Methods" (normal eq vs QR vs SVD)

Default parameters:
- Simple 2D linear regression example
- 5 data points
- Canvas: responsive

Behavior:
- Real-time update of least squares solution
- Show residuals as vertical lines to fitted line
- Display sum of squared residuals
- Highlight that solution minimizes total squared error
- Show condition number warning if ill-conditioned

Implementation: p5.js with dual view modes
</details>

### Linear Regression as Least Squares

Fitting a line $y = mx + c$ to data points $(x_1, y_1), \ldots, (x_n, y_n)$:

$\begin{bmatrix} x_1 & 1 \\ x_2 & 1 \\ \vdots & \vdots \\ x_n & 1 \end{bmatrix} \begin{bmatrix} m \\ c \end{bmatrix} = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix}$

This is $A\mathbf{x} = \mathbf{b}$ with $n > 2$ equations and 2 unknowns—overdetermined!

The least squares solution minimizes $\sum_{i=1}^n (y_i - mx_i - c)^2$.

## The Four Fundamental Subspaces

Every $m \times n$ matrix $A$ defines four fundamental subspaces that partition $\mathbb{R}^n$ and $\mathbb{R}^m$.

### Column Space and Row Space

The **column space** $\text{col}(A)$ is the span of the columns of $A$:

$\text{col}(A) = \{A\mathbf{x} : \mathbf{x} \in \mathbb{R}^n\} \subseteq \mathbb{R}^m$

The **row space** $\text{row}(A)$ is the span of the rows of $A$ (equivalently, column space of $A^T$):

$\text{row}(A) = \text{col}(A^T) \subseteq \mathbb{R}^n$

Both have dimension equal to the rank of $A$.

### Null Space and Left Null Space

The **null space** (kernel) $\text{null}(A)$ contains all solutions to $A\mathbf{x} = \mathbf{0}$:

$\text{null}(A) = \{\mathbf{x} \in \mathbb{R}^n : A\mathbf{x} = \mathbf{0}\}$

The **left null space** $\text{null}(A^T)$ contains all solutions to $A^T\mathbf{y} = \mathbf{0}$:

$\text{null}(A^T) = \{\mathbf{y} \in \mathbb{R}^m : A^T\mathbf{y} = \mathbf{0}\}$

### The Fundamental Theorem

The **Four Subspaces Theorem** reveals beautiful orthogonal relationships:

| Subspace | Dimension | Orthogonal Complement |
|----------|-----------|----------------------|
| Column space $\text{col}(A)$ | $r$ | Left null space $\text{null}(A^T)$ |
| Row space $\text{row}(A)$ | $r$ | Null space $\text{null}(A)$ |
| Null space $\text{null}(A)$ | $n - r$ | Row space $\text{row}(A)$ |
| Left null space $\text{null}(A^T)$ | $m - r$ | Column space $\text{col}(A)$ |

where $r = \text{rank}(A)$.

Key insights:

- $\mathbb{R}^n = \text{row}(A) \oplus \text{null}(A)$ (direct sum)
- $\mathbb{R}^m = \text{col}(A) \oplus \text{null}(A^T)$ (direct sum)
- The matrix $A$ maps row space to column space (bijectively if full rank)
- The matrix $A$ maps null space to zero

#### Diagram: Four Fundamental Subspaces

<details markdown="1">
<summary>Four Fundamental Subspaces Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Visualize the four fundamental subspaces and their orthogonal relationships

Visual elements:
- Two side-by-side panels: Domain (R^n) and Codomain (R^m)
- In R^n: Row space and null space as orthogonal subspaces
- In R^m: Column space and left null space as orthogonal subspaces
- Arrow showing A maps row space → column space
- Arrow showing A maps null space → {0}
- Dimension labels on each subspace

Interactive controls:
- Matrix A input (up to 4×4)
- "Compute Subspaces" button
- Toggle to show basis vectors for each subspace
- Toggle to show orthogonality verification
- Slider to highlight one subspace at a time

Default parameters:
- 3×4 matrix with rank 2
- Show all four subspaces
- Canvas: responsive dual-panel layout

Behavior:
- Compute and display bases for each subspace
- Verify orthogonality numerically
- Show rank and dimension formulas
- Animate vector mapping from domain to codomain
- Highlight which vectors map to zero

Implementation: p5.js with SVG diagrams
</details>

### Visualization

```
             A
    R^n  ─────────→  R^m

┌─────────────┐      ┌─────────────┐
│             │      │             │
│  row(A)     │ ───→ │   col(A)    │
│  dim = r    │      │   dim = r   │
│             │      │             │
├─────────────┤      ├─────────────┤
│             │      │             │
│  null(A)    │ ───→ │   {0}       │
│  dim = n-r  │      │             │
│             │      │  null(A^T)  │
│             │      │  dim = m-r  │
└─────────────┘      └─────────────┘
        ⊥                  ⊥
```

## The Pseudoinverse

The **pseudoinverse** (Moore-Penrose inverse) $A^+$ generalizes the matrix inverse to rectangular and singular matrices.

### Definition via SVD

If $A = U\Sigma V^T$ is the SVD with non-zero singular values $\sigma_1, \ldots, \sigma_r$:

$A^+ = V\Sigma^+ U^T$

where:

$\Sigma^+ = \begin{bmatrix} \sigma_1^{-1} & & \\ & \ddots & \\ & & \sigma_r^{-1} \\ & \mathbf{0} & \end{bmatrix}^T$

### Properties

The pseudoinverse satisfies the **Moore-Penrose conditions**:

1. $AA^+A = A$
2. $A^+AA^+ = A^+$
3. $(AA^+)^T = AA^+$ (symmetric)
4. $(A^+A)^T = A^+A$ (symmetric)

### Special Cases

| Matrix Type | Pseudoinverse |
|-------------|---------------|
| Invertible | $A^+ = A^{-1}$ |
| Full column rank ($m > n$) | $A^+ = (A^TA)^{-1}A^T$ (left inverse) |
| Full row rank ($m < n$) | $A^+ = A^T(AA^T)^{-1}$ (right inverse) |
| Rank-deficient | Use SVD formula |

### Least Squares via Pseudoinverse

The least squares solution is:

$\hat{\mathbf{x}} = A^+\mathbf{b}$

When $A$ has full column rank, this equals $(A^TA)^{-1}A^T\mathbf{b}$.

When $A$ is rank-deficient, the pseudoinverse gives the **minimum-norm least squares solution**—the smallest $\hat{\mathbf{x}}$ that minimizes $\|A\mathbf{x} - \mathbf{b}\|$.

#### Diagram: Pseudoinverse Application

<details markdown="1">
<summary>Pseudoinverse Solver MicroSim</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how the pseudoinverse solves least squares problems, especially for rank-deficient systems

Visual elements:
- Matrix A display with rank indicator
- Vector b input
- Solution x = A⁺b display
- Residual ||Ax - b|| display
- SVD components visualization
- Comparison: exact solution (if exists) vs least squares

Interactive controls:
- Matrix A entry fields (up to 4×4)
- Vector b entry fields
- "Compute Pseudoinverse" button
- "Show SVD" toggle
- Preset examples: full rank, rank deficient, underdetermined

Default parameters:
- 3×2 matrix (overdetermined)
- Show solution and residual
- Canvas: responsive

Behavior:
- Compute and display A⁺
- Solve x = A⁺b
- Show residual and verify it's minimal
- For underdetermined: show minimum-norm property
- Compare with direct (A^TA)^{-1}A^T when applicable

Implementation: p5.js with numerical computation
</details>

## Practical Implementation

```python
import numpy as np
from scipy import linalg

# Vector space operations
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

# Inner product (dot product)
inner = np.dot(v1, v2)

# Norm from inner product
norm_v1 = np.sqrt(np.dot(v1, v1))  # or np.linalg.norm(v1)

# Angle between vectors (Cauchy-Schwarz)
cos_theta = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
theta = np.arccos(cos_theta)

# Gram-Schmidt (via QR)
A = np.array([[1, 1, 0], [1, 0, 1], [0, 1, 1]], dtype=float)
Q, R = np.linalg.qr(A)
print("Orthonormal basis Q:\n", Q)

# Projection onto column space
def project_onto_colspace(A, b):
    """Project b onto column space of A."""
    Q, _ = np.linalg.qr(A)
    return Q @ Q.T @ b

# Least squares
A = np.array([[1, 1], [1, 2], [1, 3]], dtype=float)
b = np.array([1, 2, 2], dtype=float)

# Method 1: Normal equations (less stable)
x_normal = np.linalg.solve(A.T @ A, A.T @ b)

# Method 2: QR decomposition (stable)
x_qr, residuals, rank, s = np.linalg.lstsq(A, b, rcond=None)

# Method 3: Pseudoinverse
A_pinv = np.linalg.pinv(A)
x_pinv = A_pinv @ b

# Four fundamental subspaces via SVD
U, s, Vh = np.linalg.svd(A)
rank = np.sum(s > 1e-10)

col_space_basis = U[:, :rank]      # Column space
left_null_basis = U[:, rank:]       # Left null space
row_space_basis = Vh[:rank, :].T    # Row space
null_space_basis = Vh[rank:, :].T   # Null space

print(f"Rank: {rank}")
print(f"Column space dim: {rank}, Left null space dim: {A.shape[0] - rank}")
print(f"Row space dim: {rank}, Null space dim: {A.shape[1] - rank}")
```

## Summary

This chapter developed the abstract framework for linear algebra:

**Vector Spaces:**

- **Abstract vector spaces** satisfy ten axioms enabling addition and scalar multiplication
- **Subspaces** are closed under linear combinations
- The framework applies to functions, matrices, and beyond $\mathbb{R}^n$

**Inner Products:**

- **Inner products** generalize dot products, enabling length and angle measurement
- **Norms** derive from inner products: $\|\mathbf{v}\| = \sqrt{\langle \mathbf{v}, \mathbf{v} \rangle}$
- **Cauchy-Schwarz inequality:** $|\langle \mathbf{u}, \mathbf{v} \rangle| \leq \|\mathbf{u}\| \|\mathbf{v}\|$

**Orthogonality:**

- **Orthogonal vectors** satisfy $\langle \mathbf{u}, \mathbf{v} \rangle = 0$
- **Orthonormal bases** simplify coordinate computation to inner products
- **Gram-Schmidt** converts any basis to orthonormal

**Projections and Least Squares:**

- **Projection** finds the closest point in a subspace
- **Least squares** minimizes $\|A\mathbf{x} - \mathbf{b}\|^2$
- **Normal equations:** $A^TA\hat{\mathbf{x}} = A^T\mathbf{b}$

**Fundamental Subspaces:**

- Every matrix has **four fundamental subspaces**: column, row, null, left null
- Row space $\perp$ null space; column space $\perp$ left null space
- Dimensions sum correctly: $r + (n-r) = n$ and $r + (m-r) = m$

**Pseudoinverse:**

- **$A^+$** generalizes inversion to any matrix
- Provides minimum-norm least squares solutions
- Computed via SVD: $A^+ = V\Sigma^+ U^T$

??? question "Self-Check: Why must the error vector in least squares be orthogonal to the column space of A?"
    The error $\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}}$ must be orthogonal to $\text{col}(A)$ because projection gives the closest point. If $\mathbf{e}$ had any component in $\text{col}(A)$, we could subtract that component from $\mathbf{e}$ to get closer to $\mathbf{b}$, contradicting minimality. Mathematically, the first-order optimality condition $\nabla_\mathbf{x}\|A\mathbf{x} - \mathbf{b}\|^2 = 0$ yields $A^T(A\mathbf{x} - \mathbf{b}) = 0$, meaning $A^T\mathbf{e} = 0$—the error is orthogonal to every column of $A$.
