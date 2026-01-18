---
title: Matrix Decompositions
description: Powerful matrix factorization techniques for computation, analysis, and dimensionality reduction
generated_by: claude skill chapter-content-generator
date: 2026-01-17 15:00:00
version: 0.03
---

# Matrix Decompositions

## Summary

Matrix factorizations provide powerful tools for analysis, computation, and dimensionality reduction. This chapter covers LU, QR, Cholesky, and Singular Value Decomposition (SVD). Each decomposition has specific use cases: LU for solving systems efficiently, QR for least squares problems, Cholesky for symmetric positive definite matrices, and SVD for low-rank approximations and recommender systems.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Matrix Factorization
2. LU Decomposition
3. Partial Pivoting
4. QR Decomposition
5. Gram-Schmidt QR
6. Householder QR
7. Cholesky Decomposition
8. Positive Definite Matrix
9. SVD
10. Singular Value
11. Left Singular Vector
12. Right Singular Vector
13. Full SVD
14. Compact SVD
15. Truncated SVD
16. Low-Rank Approximation
17. Matrix Rank
18. Numerical Rank
19. Condition Number

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 3: Systems of Linear Equations](../03-systems-of-linear-equations/index.md)
- [Chapter 4: Linear Transformations](../04-linear-transformations/index.md)
- [Chapter 6: Eigenvalues and Eigenvectors](../06-eigenvalues-and-eigenvectors/index.md)
- [Chapter 8: Vector Spaces and Inner Products](../08-vector-spaces-and-inner-products/index.md) (for Gram-Schmidt)

---

## Introduction

Just as integers can be factored into primes to reveal their structure, matrices can be decomposed into products of simpler matrices. These **matrix factorizations** expose the underlying structure of linear transformations, enable efficient computation, and provide geometric insight into how matrices act on vectors.

Matrix decompositions are the workhorses of numerical linear algebra. When you solve a system of linear equations, compute a least-squares fit, reduce dimensionality with PCA, or build a recommender system, you are using matrix decompositions behind the scenes. Understanding these factorizations—when to use each one and what makes them numerically stable—is essential for any practitioner working with data.

This chapter covers four major decompositions, each with distinct purposes:

| Decomposition | Form | Primary Use Cases |
|---------------|------|-------------------|
| LU | $A = LU$ | Solving systems, computing determinants |
| QR | $A = QR$ | Least squares, eigenvalue algorithms |
| Cholesky | $A = LL^T$ | Symmetric positive definite systems |
| SVD | $A = U\Sigma V^T$ | Low-rank approximation, dimensionality reduction |

## Matrix Rank: A Foundation for Decompositions

Before diving into specific decompositions, we need to understand **matrix rank**, which fundamentally determines what decompositions are possible and their properties.

#### Matrix Rank

The **rank** of a matrix $A$ is the dimension of its column space (equivalently, its row space):

$\text{rank}(A) = \dim(\text{col}(A)) = \dim(\text{row}(A))$

For an $m \times n$ matrix:

- $\text{rank}(A) \leq \min(m, n)$
- If $\text{rank}(A) = \min(m, n)$, the matrix has **full rank**
- If $\text{rank}(A) < \min(m, n)$, the matrix is **rank-deficient**

The rank tells us how many linearly independent columns (or rows) the matrix contains, which directly impacts the uniqueness of solutions to linear systems and the structure of decompositions.

#### Diagram: Matrix Rank Visualizer

<details markdown="1">
<summary>Matrix Rank Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize how matrix rank relates to the column space and understand rank-deficient matrices geometrically

Visual elements:
- Left panel: 3x3 matrix input with editable values
- Center panel: 3D visualization showing column vectors as arrows from origin
- Column space displayed as a plane (rank 2) or line (rank 1) or point (rank 0)
- Right panel: Row echelon form showing pivot positions

Interactive controls:
- Matrix entry fields (3x3)
- "Compute Rank" button
- Toggle to show/hide individual column vectors
- Toggle to show column space as shaded region
- Preset examples dropdown (full rank, rank 2, rank 1)
- Animation to show column reduction

Default parameters:
- Matrix A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] (rank 2)
- Canvas: responsive, minimum 900x500px

Behavior:
- Real-time rank computation as matrix values change
- Highlight linearly dependent columns
- Show column space dimension visually
- Display row echelon form with pivot columns highlighted
- Animate transition when rank changes

Implementation: p5.js with WEBGL for 3D visualization
</details>

## LU Decomposition

**LU Decomposition** factors a square matrix into the product of a lower triangular matrix $L$ and an upper triangular matrix $U$:

$A = LU$

where:

- $L$ is lower triangular with 1s on the diagonal
- $U$ is upper triangular

This decomposition essentially records the steps of Gaussian elimination in matrix form.

### Why LU Decomposition Matters

LU decomposition transforms the problem of solving $A\mathbf{x} = \mathbf{b}$ into two simpler triangular systems:

1. Solve $L\mathbf{y} = \mathbf{b}$ for $\mathbf{y}$ (forward substitution)
2. Solve $U\mathbf{x} = \mathbf{y}$ for $\mathbf{x}$ (back substitution)

Each triangular solve takes only $O(n^2)$ operations, compared to $O(n^3)$ for the original system. The key advantage is that once we have computed the LU factorization (which costs $O(n^3)$), we can solve for multiple right-hand sides $\mathbf{b}_1, \mathbf{b}_2, \ldots$ with only $O(n^2)$ additional work each.

### Computing LU Decomposition

The algorithm follows Gaussian elimination, but instead of modifying the right-hand side, we store the multipliers:

1. For each column $k = 1, \ldots, n-1$:
   - For each row $i = k+1, \ldots, n$:
     - Compute multiplier: $l_{ik} = a_{ik}/a_{kk}$
     - Eliminate: $a_{ij} \leftarrow a_{ij} - l_{ik} \cdot a_{kj}$ for $j = k, \ldots, n$

2. The multipliers form $L$, and the reduced matrix becomes $U$

### Example: LU Decomposition

Consider the matrix:

$A = \begin{bmatrix} 2 & 1 & 1 \\ 4 & 3 & 3 \\ 8 & 7 & 9 \end{bmatrix}$

**Step 1:** Eliminate below the first pivot (2):

- Multiplier for row 2: $l_{21} = 4/2 = 2$
- Multiplier for row 3: $l_{31} = 8/2 = 4$

After elimination:

$\begin{bmatrix} 2 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 3 & 5 \end{bmatrix}$

**Step 2:** Eliminate below the second pivot (1):

- Multiplier for row 3: $l_{32} = 3/1 = 3$

After elimination:

$U = \begin{bmatrix} 2 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 2 \end{bmatrix}$

The multipliers form $L$:

$L = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 4 & 3 & 1 \end{bmatrix}$

You can verify: $LU = A$.

#### Diagram: LU Decomposition Step-by-Step

<details markdown="1">
<summary>LU Decomposition Algorithm Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand the LU decomposition algorithm by watching elimination steps and multiplier storage

Visual elements:
- Left panel: Original matrix A with current state
- Center panel: L matrix being built (showing multipliers)
- Right panel: U matrix being formed (showing elimination)
- Highlight current pivot element
- Arrows showing elimination operations
- Step counter and description

Interactive controls:
- Matrix size selector (2x2, 3x3, 4x4)
- Matrix entry fields
- "Next Step" button for manual stepping
- "Auto Run" button with speed slider
- "Reset" button
- "Verify LU = A" button

Default parameters:
- 3x3 matrix mode
- Matrix A = [[2, 1, 1], [4, 3, 3], [8, 7, 9]]
- Canvas: responsive

Behavior:
- Highlight current pivot in yellow
- Highlight elements being eliminated in red
- Show multiplier calculation
- Animate row operations
- Display running product L×U for verification
- Warning if zero pivot encountered (needs pivoting)

Implementation: p5.js with matrix animation
</details>

### Partial Pivoting

The basic LU decomposition fails when a pivot element is zero, and becomes numerically unstable when pivots are small. **Partial pivoting** addresses this by swapping rows to bring the largest element in the column to the pivot position.

With partial pivoting, we compute:

$PA = LU$

where:

- $P$ is a permutation matrix recording the row swaps
- $L$ is lower triangular with entries $|l_{ij}| \leq 1$
- $U$ is upper triangular

The permutation matrix $P$ is orthogonal ($P^{-1} = P^T$), so solving $A\mathbf{x} = \mathbf{b}$ becomes:

1. Compute $P\mathbf{b}$ (apply row permutations)
2. Solve $L\mathbf{y} = P\mathbf{b}$
3. Solve $U\mathbf{x} = \mathbf{y}$

!!! warning "Numerical Stability"
    Always use partial pivoting in practice. Without it, even small rounding errors can be amplified catastrophically. Most numerical libraries (LAPACK, NumPy) use partial pivoting by default.

### Computational Cost

| Operation | Cost |
|-----------|------|
| LU factorization | $\frac{2}{3}n^3$ flops |
| Forward substitution | $n^2$ flops |
| Back substitution | $n^2$ flops |
| Total for one solve | $\frac{2}{3}n^3 + 2n^2$ flops |
| Additional solves | $2n^2$ flops each |

## Cholesky Decomposition

For **symmetric positive definite** matrices, we can use a more efficient and stable decomposition called **Cholesky decomposition**:

$A = LL^T$

where:

- $A$ is symmetric ($A = A^T$) and positive definite
- $L$ is lower triangular with positive diagonal entries

### Positive Definite Matrix

A symmetric matrix $A$ is **positive definite** if:

$\mathbf{x}^T A \mathbf{x} > 0 \quad \text{for all } \mathbf{x} \neq \mathbf{0}$

Equivalent characterizations:

- All eigenvalues of $A$ are positive
- All leading principal minors are positive
- $A$ can be written as $A = B^TB$ for some matrix $B$ with full column rank
- The Cholesky decomposition exists

Positive definite matrices arise frequently in applications:

- Covariance matrices in statistics
- Gram matrices $X^TX$ in machine learning
- Hessians of convex functions at minima
- Stiffness matrices in finite element analysis

| Property | Positive Definite | Positive Semi-Definite |
|----------|-------------------|------------------------|
| Eigenvalues | All $> 0$ | All $\geq 0$ |
| Quadratic form | $\mathbf{x}^TA\mathbf{x} > 0$ for $\mathbf{x} \neq 0$ | $\mathbf{x}^TA\mathbf{x} \geq 0$ for all $\mathbf{x}$ |
| Invertibility | Always invertible | May be singular |
| Cholesky | Unique $LL^T$ exists | $LL^T$ exists but $L$ may have zeros |

#### Diagram: Positive Definiteness Visualizer

<details markdown="1">
<summary>Positive Definiteness Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize the quadratic form $\mathbf{x}^T A \mathbf{x}$ and understand how positive definiteness relates to the shape of the surface

Visual elements:
- Left panel: 2x2 symmetric matrix input
- Center panel: 3D surface plot of $f(x,y) = [x, y] A [x, y]^T$
- Eigenvalue display with color coding (positive=green, negative=red)
- Level curves (contour plot) below 3D surface
- Classification label: "Positive Definite", "Negative Definite", "Indefinite", "Positive Semi-Definite"

Interactive controls:
- Matrix entry fields (symmetric: entering a₁₂ sets a₂₁)
- Rotation controls for 3D view
- Toggle contour lines
- Preset examples: positive definite, negative definite, indefinite, semi-definite

Default parameters:
- Matrix A = [[3, 1], [1, 2]] (positive definite)
- Surface plot range: x, y ∈ [-2, 2]
- Canvas: responsive

Behavior:
- Real-time surface update as matrix changes
- Color surface by height (red for negative, green for positive)
- Show eigenvalues and eigenvector directions on contour plot
- Highlight minimum point for positive definite matrices
- Saddle point visualization for indefinite matrices

Implementation: p5.js with WEBGL for 3D surface rendering
</details>

### Computing Cholesky Decomposition

The Cholesky algorithm computes $L$ column by column:

For $j = 1, \ldots, n$:

$l_{jj} = \sqrt{a_{jj} - \sum_{k=1}^{j-1} l_{jk}^2}$

For $i = j+1, \ldots, n$:

$l_{ij} = \frac{1}{l_{jj}}\left(a_{ij} - \sum_{k=1}^{j-1} l_{ik}l_{jk}\right)$

### Example: Cholesky Decomposition

Consider the positive definite matrix:

$A = \begin{bmatrix} 4 & 2 & 2 \\ 2 & 5 & 1 \\ 2 & 1 & 6 \end{bmatrix}$

**Column 1:**

- $l_{11} = \sqrt{4} = 2$
- $l_{21} = 2/2 = 1$
- $l_{31} = 2/2 = 1$

**Column 2:**

- $l_{22} = \sqrt{5 - 1^2} = \sqrt{4} = 2$
- $l_{32} = (1 - 1 \cdot 1)/2 = 0$

**Column 3:**

- $l_{33} = \sqrt{6 - 1^2 - 0^2} = \sqrt{5}$

Result:

$L = \begin{bmatrix} 2 & 0 & 0 \\ 1 & 2 & 0 \\ 1 & 0 & \sqrt{5} \end{bmatrix}$

### Advantages of Cholesky

- **Half the work:** Cholesky requires $\frac{1}{3}n^3$ flops vs. $\frac{2}{3}n^3$ for LU
- **No pivoting needed:** Positive definiteness guarantees numerical stability
- **Natural for applications:** Covariance matrices and Gram matrices are positive semi-definite

## QR Decomposition

**QR Decomposition** factors a matrix into an orthogonal matrix $Q$ and an upper triangular matrix $R$:

$A = QR$

where:

- $Q$ is orthogonal ($Q^TQ = I$, columns form orthonormal basis)
- $R$ is upper triangular

For an $m \times n$ matrix with $m \geq n$:
- Full QR: $Q$ is $m \times m$, $R$ is $m \times n$
- Reduced QR: $Q$ is $m \times n$, $R$ is $n \times n$

### Why QR Decomposition Matters

QR decomposition is the foundation of:

1. **Least squares problems:** Solving $A\mathbf{x} \approx \mathbf{b}$ in the overdetermined case
2. **QR algorithm:** The standard method for computing eigenvalues
3. **Orthogonalization:** Creating orthonormal bases from arbitrary vectors

For least squares, the normal equations $A^TA\mathbf{x} = A^T\mathbf{b}$ can have numerical issues. Using QR, we instead solve:

$R\mathbf{x} = Q^T\mathbf{b}$

which is numerically stable because $Q$ preserves norms.

### Gram-Schmidt QR

The **Gram-Schmidt process** constructs $Q$ by orthonormalizing the columns of $A$ one at a time:

For $j = 1, \ldots, n$:

1. Start with column $\mathbf{a}_j$
2. Subtract projections onto previous $\mathbf{q}$ vectors:
   $\mathbf{v}_j = \mathbf{a}_j - \sum_{i=1}^{j-1} (\mathbf{q}_i^T \mathbf{a}_j) \mathbf{q}_i$
3. Normalize: $\mathbf{q}_j = \mathbf{v}_j / \|\mathbf{v}_j\|$

The coefficients form the upper triangular matrix $R$:

- $r_{ij} = \mathbf{q}_i^T \mathbf{a}_j$ for $i < j$
- $r_{jj} = \|\mathbf{v}_j\|$

#### Diagram: Gram-Schmidt Orthogonalization

<details markdown="1">
<summary>Gram-Schmidt Process Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how Gram-Schmidt creates orthonormal vectors by visualizing the projection and subtraction steps

Visual elements:
- 3D coordinate system
- Original vectors a₁, a₂, a₃ as colored arrows
- Orthonormal vectors q₁, q₂, q₃ as they are computed
- Projection vectors showing what is subtracted
- Right-angle indicators between orthogonal vectors

Interactive controls:
- Input matrix A (3 columns, 3 rows for 3D visualization)
- "Step" button to advance one orthonormalization step
- "Run All" button for complete animation
- "Reset" button
- Speed slider
- Toggle to show/hide projection components

Default parameters:
- Matrix A with 3 linearly independent columns
- Canvas: responsive 3D view

Behavior:
- Show each projection step clearly
- Animate subtraction of projection
- Show normalization step
- Display current q vector and r values
- Highlight orthogonality with right-angle symbols
- Warning if vectors are nearly linearly dependent

Implementation: p5.js with WEBGL for 3D rendering
</details>

!!! note "Classical vs. Modified Gram-Schmidt"
    The classical Gram-Schmidt algorithm described above can lose orthogonality due to rounding errors. The modified Gram-Schmidt algorithm recomputes projections against the updated vectors rather than original vectors, providing better numerical stability.

### Householder QR

**Householder QR** uses orthogonal reflections (Householder transformations) to zero out elements below the diagonal. Each Householder matrix has the form:

$H = I - 2\mathbf{v}\mathbf{v}^T$

where:

- $\mathbf{v}$ is a unit vector defining the reflection plane
- $H$ is orthogonal and symmetric ($H = H^T = H^{-1}$)

The algorithm applies successive Householder reflections:

$H_n \cdots H_2 H_1 A = R$

Therefore:

$Q = H_1 H_2 \cdots H_n$

#### Advantages of Householder QR

- **Numerically stable:** Each transformation is exactly orthogonal
- **Efficient storage:** Only need to store reflection vectors $\mathbf{v}$
- **Standard choice:** Used by LAPACK and all major numerical libraries

| Method | Stability | Flops | Storage |
|--------|-----------|-------|---------|
| Classical Gram-Schmidt | Poor | $2mn^2$ | $mn + n^2$ |
| Modified Gram-Schmidt | Good | $2mn^2$ | $mn + n^2$ |
| Householder | Excellent | $2mn^2 - \frac{2}{3}n^3$ | $mn$ (compact) |

## Singular Value Decomposition (SVD)

The **Singular Value Decomposition** is perhaps the most important and versatile matrix decomposition. It applies to any $m \times n$ matrix (not just square matrices):

$A = U\Sigma V^T$

where:

- $U$ is an $m \times m$ orthogonal matrix (left singular vectors)
- $\Sigma$ is an $m \times n$ diagonal matrix (singular values)
- $V$ is an $n \times n$ orthogonal matrix (right singular vectors)

### Understanding SVD Components

#### Singular Values

The **singular values** $\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_r > 0$ are the diagonal entries of $\Sigma$, where $r = \text{rank}(A)$. They measure how much the matrix stretches vectors in each principal direction.

Key relationships:

- $\sigma_i = \sqrt{\lambda_i(A^TA)} = \sqrt{\lambda_i(AA^T)}$ (singular values are square roots of eigenvalues)
- $\|A\|_2 = \sigma_1$ (spectral norm is largest singular value)
- $\|A\|_F = \sqrt{\sum_i \sigma_i^2}$ (Frobenius norm)

#### Left Singular Vectors

The columns of $U$ are **left singular vectors**. They form an orthonormal basis for the column space (first $r$ vectors) and left null space (remaining vectors) of $A$.

$A\mathbf{v}_i = \sigma_i \mathbf{u}_i$

#### Right Singular Vectors

The columns of $V$ are **right singular vectors**. They form an orthonormal basis for the row space (first $r$ vectors) and null space (remaining vectors) of $A$.

$A^T\mathbf{u}_i = \sigma_i \mathbf{v}_i$

#### Diagram: SVD Geometry

<details markdown="1">
<summary>SVD Geometric Interpretation</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Visualize SVD as a sequence of rotation, scaling, and rotation operations on the unit sphere

Visual elements:
- Four panels showing transformation stages:
  1. Original unit circle/sphere
  2. After V^T rotation (aligns with principal axes)
  3. After Σ scaling (ellipse with σ₁, σ₂ semi-axes)
  4. After U rotation (final orientation)
- Matrix display showing A = UΣV^T
- Singular values displayed as axis lengths

Interactive controls:
- 2x2 or 2x3 matrix input for A
- "Animate Transformation" button showing step-by-step
- Slider to interpolate between stages
- Toggle to show/hide singular vectors
- Toggle 2D (circle→ellipse) vs 3D (sphere→ellipsoid)

Default parameters:
- Matrix A = [[3, 1], [1, 3]]
- Animation duration: 2 seconds per stage
- Canvas: responsive

Behavior:
- Show unit circle transforming to ellipse
- Label semi-axes with singular values
- Show right singular vectors as directions on original circle
- Show left singular vectors as directions on transformed ellipse
- Display matrix factorization alongside visualization

Implementation: p5.js with smooth animation transitions
</details>

### The Fundamental Picture

The SVD reveals the geometry of any linear transformation:

1. $V^T$ rotates the input space to align with the principal axes
2. $\Sigma$ stretches/compresses along each axis by the singular values
3. $U$ rotates the output space to the final orientation

This decomposition exposes the four fundamental subspaces:

| Subspace | Dimension | Basis from SVD |
|----------|-----------|----------------|
| Column space | $r$ | First $r$ columns of $U$ |
| Left null space | $m - r$ | Last $m - r$ columns of $U$ |
| Row space | $r$ | First $r$ columns of $V$ |
| Null space | $n - r$ | Last $n - r$ columns of $V$ |

### Full SVD vs. Compact SVD vs. Truncated SVD

There are three forms of SVD depending on how we handle zero singular values:

#### Full SVD

The **full SVD** includes all $m$ left singular vectors and all $n$ right singular vectors:

$A = U_{m \times m} \Sigma_{m \times n} V^T_{n \times n}$

#### Compact SVD

The **compact (reduced) SVD** keeps only the $r$ non-zero singular values and their vectors:

$A = U_{m \times r} \Sigma_{r \times r} V^T_{r \times n}$

This is more memory-efficient and is what NumPy's `np.linalg.svd(full_matrices=False)` returns.

#### Truncated SVD

The **truncated SVD** keeps only the $k$ largest singular values (where $k < r$):

$A_k = U_{m \times k} \Sigma_{k \times k} V^T_{k \times n}$

This gives the best rank-$k$ approximation to $A$ (Eckart-Young theorem).

#### Diagram: SVD Forms Comparison

<details markdown="1">
<summary>SVD Forms Comparison</summary>
Type: infographic

Bloom Taxonomy Level: Analyze

Learning Objective: Compare full, compact, and truncated SVD visually and understand when to use each form

Layout: Three columns showing matrix dimensions for each SVD form

Sections:
1. "Full SVD" column
   - Matrix dimensions: U(m×m), Σ(m×n), V^T(n×n)
   - Visual: Full-size matrices with zero padding shown
   - Use case: Complete basis for all four fundamental subspaces
   - Memory: O(m² + mn + n²)

2. "Compact SVD" column
   - Matrix dimensions: U(m×r), Σ(r×r), V^T(r×n)
   - Visual: Trimmed matrices, only rank-r portion
   - Use case: Efficient storage, exact reconstruction
   - Memory: O(mr + r² + rn)

3. "Truncated SVD" column
   - Matrix dimensions: U(m×k), Σ(k×k), V^T(k×n)
   - Visual: Further trimmed to k components
   - Use case: Low-rank approximation, denoising
   - Memory: O(mk + k² + kn)
   - Note: "k < r, approximate reconstruction"

Interactive elements:
- Hover to see example with specific dimensions
- Click to see Python code for each form
- Toggle to show reconstruction error for truncated form

Visual style:
- Matrix blocks with dimension labels
- Color coding: kept components in blue, discarded in gray
- Singular values shown as bar chart below

Implementation: HTML/CSS/JavaScript with SVG matrices
</details>

### Computing SVD

SVD is typically computed in two stages:

1. **Bidiagonalization:** Transform $A$ to bidiagonal form using Householder reflections
2. **Diagonalization:** Apply the QR algorithm (or divide-and-conquer) to find singular values

For an $m \times n$ matrix with $m \geq n$:

| Operation | Flops |
|-----------|-------|
| Full SVD | $2mn^2 + 11n^3$ |
| Compact SVD | $2mn^2 + 11n^3$ |
| Truncated SVD (randomized) | $O(mnk + (m+n)k^2)$ |

!!! tip "Randomized SVD for Large Matrices"
    For very large matrices where only the top $k$ singular values are needed, randomized algorithms provide significant speedups. Libraries like `sklearn.decomposition.TruncatedSVD` implement these efficient methods.

## Low-Rank Approximation

One of the most powerful applications of SVD is **low-rank approximation**. Given a matrix $A$ with rank $r$, the best rank-$k$ approximation (for $k < r$) is:

$A_k = \sum_{i=1}^{k} \sigma_i \mathbf{u}_i \mathbf{v}_i^T$

#### The Eckart-Young Theorem

The truncated SVD provides the optimal low-rank approximation:

$A_k = \arg\min_{\text{rank}(B) \leq k} \|A - B\|_F$

The approximation error is:

$\|A - A_k\|_F = \sqrt{\sigma_{k+1}^2 + \sigma_{k+2}^2 + \cdots + \sigma_r^2}$

$\|A - A_k\|_2 = \sigma_{k+1}$

This theorem justifies using truncated SVD for:

- **Image compression:** Store only top $k$ singular components
- **Noise reduction:** Small singular values often correspond to noise
- **Dimensionality reduction:** Project data onto top $k$ principal directions
- **Recommender systems:** Approximate user-item matrices

#### Diagram: Image Compression with SVD

<details markdown="1">
<summary>Image Compression MicroSim</summary>
Type: microsim

Bloom Taxonomy Level: Evaluate

Learning Objective: Understand how truncated SVD compresses images by observing the quality-storage tradeoff as k varies

Visual elements:
- Left panel: Original grayscale image (as matrix)
- Center panel: Reconstructed image using rank-k approximation
- Right panel: Difference image (error visualization)
- Bottom: Singular value spectrum (bar chart or line plot)
- Statistics display: compression ratio, PSNR, % variance captured

Interactive controls:
- Image selector (sample images or upload)
- Slider for rank k (1 to full rank)
- "Show Singular Values" toggle
- "Show Error Image" toggle
- "Compare Side-by-Side" view option

Default parameters:
- Sample grayscale image (256×256)
- Initial k = 50
- Canvas: responsive

Behavior:
- Real-time reconstruction as k changes
- Show compression ratio: k(m+n+1) / (m×n)
- Display percentage of Frobenius norm captured
- Highlight "elbow" in singular value plot
- Show time/memory comparison

Implementation: p5.js with image processing
</details>

### Applications of Low-Rank Approximation

1. **Recommender Systems (Netflix Problem)**
   - User-movie rating matrix is approximately low-rank
   - Missing entries predicted from low-rank factors
   - $R \approx UV^T$ where $U$ = user factors, $V$ = item factors

2. **Latent Semantic Analysis (LSA)**
   - Term-document matrix decomposed via SVD
   - Captures semantic relationships between words
   - Precursor to modern word embeddings

3. **Principal Component Analysis (PCA)**
   - Centered data matrix $X$ decomposed as $X = U\Sigma V^T$
   - Principal components are columns of $V$
   - Variance along each PC is $\sigma_i^2/(n-1)$

## Numerical Rank and Condition Number

In exact arithmetic, rank is well-defined. In floating-point computation, small singular values may arise from noise rather than true rank deficiency.

### Numerical Rank

The **numerical rank** is the number of singular values larger than a threshold $\epsilon$:

$\text{rank}_\epsilon(A) = |\{i : \sigma_i > \epsilon\}|$

Common choices for $\epsilon$:

- $\epsilon = \max(m,n) \cdot \epsilon_{\text{machine}} \cdot \sigma_1$
- $\epsilon = \sqrt{\epsilon_{\text{machine}}} \cdot \sigma_1$

where $\epsilon_{\text{machine}} \approx 2.2 \times 10^{-16}$ for double precision.

### Condition Number

The **condition number** measures how sensitive a matrix computation is to perturbations:

$\kappa(A) = \frac{\sigma_1}{\sigma_r} = \|A\| \cdot \|A^{-1}\|$

where:

- $\sigma_1$ is the largest singular value
- $\sigma_r$ is the smallest non-zero singular value

#### Interpretation

| Condition Number | Interpretation |
|------------------|----------------|
| $\kappa \approx 1$ | Well-conditioned (stable computation) |
| $\kappa \approx 10^k$ | Lose ~$k$ digits of accuracy |
| $\kappa = \infty$ | Singular matrix (not invertible) |

For solving $A\mathbf{x} = \mathbf{b}$, the relative error in the solution satisfies:

$\frac{\|\delta \mathbf{x}\|}{\|\mathbf{x}\|} \leq \kappa(A) \cdot \frac{\|\delta \mathbf{b}\|}{\|\mathbf{b}\|}$

A small perturbation $\delta \mathbf{b}$ in the right-hand side can be amplified by $\kappa(A)$ in the solution.

#### Diagram: Condition Number Visualizer

<details markdown="1">
<summary>Condition Number and Sensitivity Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Evaluate

Learning Objective: Understand how condition number affects solution sensitivity by perturbing linear systems

Visual elements:
- Left panel: 2D visualization of linear system Ax = b
  - Two lines representing equations
  - Intersection point (solution)
  - Perturbation region around b
  - Resulting uncertainty region around x
- Right panel: Singular value bar chart
  - σ₁ and σ₂ (or more) as bars
  - Condition number κ = σ₁/σ₂ displayed
- Matrix A and vectors b, x displayed

Interactive controls:
- 2x2 matrix input
- Slider to control perturbation magnitude ε
- "Add Random Perturbation" button
- Toggle between well-conditioned and ill-conditioned examples
- Show/hide uncertainty ellipse

Default parameters:
- Well-conditioned example: A = [[2, 0], [0, 2]] (κ = 1)
- Ill-conditioned example: A = [[1, 1], [1, 1.0001]] (κ ≈ 10000)
- Canvas: responsive

Behavior:
- Show how nearly parallel lines (ill-conditioned) create large uncertainty
- Animate perturbations and show solution movement
- Display digits of accuracy lost
- Compare κ calculation methods

Implementation: p5.js with geometric visualization
</details>

### Improving Conditioning

Several techniques can improve numerical conditioning:

- **Preconditioning:** Transform $A\mathbf{x} = \mathbf{b}$ to $M^{-1}A\mathbf{x} = M^{-1}\mathbf{b}$ where $M \approx A$
- **Regularization:** Replace $A^TA$ with $A^TA + \lambda I$ (ridge regression)
- **Scaling:** Equilibrate row and column norms of $A$

## Choosing the Right Decomposition

The choice of decomposition depends on the matrix structure and application:

```
Is A square?
├── Yes: Is A symmetric positive definite?
│   ├── Yes: Use Cholesky (fastest, most stable)
│   └── No: Use LU with partial pivoting
│
└── No (rectangular): What's the goal?
    ├── Least squares: Use QR
    ├── Low-rank approximation: Use SVD
    └── Eigenvalue-like analysis: Use SVD
```

| Application | Recommended Decomposition | Why |
|-------------|---------------------------|-----|
| Solve $A\mathbf{x} = \mathbf{b}$ (multiple $\mathbf{b}$) | LU | Factor once, solve many |
| Solve $A\mathbf{x} = \mathbf{b}$ ($A$ SPD) | Cholesky | Half the work, more stable |
| Least squares | QR | Numerically stable |
| Eigenvalues (symmetric) | QR algorithm on tridiagonal form | Standard method |
| Singular values | SVD via bidiagonalization | Definitive answer |
| Low-rank approximation | Truncated SVD | Optimal by Eckart-Young |
| Matrix rank | SVD | Count significant $\sigma_i$ |

#### Diagram: Decomposition Decision Tree

<details markdown="1">
<summary>Matrix Decomposition Selection Guide</summary>
Type: workflow

Bloom Taxonomy Level: Evaluate

Learning Objective: Guide students to select the appropriate matrix decomposition based on matrix properties and application needs

Visual style: Interactive decision tree flowchart

Steps:
1. Start: "Given matrix A, what do you need?"
   Hover text: "First consider your goal and matrix properties"

2. Decision: "Goal?"
   - "Solve linear system" → Branch A
   - "Least squares / overdetermined" → Branch B
   - "Low-rank approximation" → Branch C
   - "Eigenvalues" → Branch D

3a. Decision: "Is A symmetric positive definite?"
    - Yes → "Use Cholesky LL^T"
      Hover text: "Fastest, half the flops of LU"
    - No → "Use LU with pivoting"
      Hover text: "Works for any invertible matrix"

3b. Process: "Use QR Decomposition"
    Hover text: "More stable than normal equations"

3c. Process: "Use Truncated SVD"
    Hover text: "Optimal rank-k approximation by Eckart-Young"

3d. Decision: "Is A symmetric?"
    - Yes → "Eigendecomposition via QR algorithm"
    - No → "Consider SVD for singular values"

Color coding:
- Blue: Decision nodes
- Green: Recommended decompositions
- Orange: Computation nodes
- Gray: Information nodes

Interactive:
- Click nodes to see code examples
- Hover for complexity information
- Links to relevant sections

Implementation: D3.js or Mermaid.js with interaction handlers
</details>

## Practical Implementation

Here is how to use these decompositions in Python:

```python
import numpy as np
from scipy import linalg

# Sample matrices
A = np.array([[4, 2, 1], [2, 5, 3], [1, 3, 6]], dtype=float)
b = np.array([1, 2, 3], dtype=float)

# LU Decomposition (with pivoting)
P, L, U = linalg.lu(A)
x_lu = linalg.solve_triangular(U,
       linalg.solve_triangular(L, P @ b, lower=True))

# Cholesky (if A is positive definite)
L_chol = linalg.cholesky(A, lower=True)
x_chol = linalg.cho_solve((L_chol, True), b)

# QR Decomposition
Q, R = linalg.qr(A)
x_qr = linalg.solve_triangular(R, Q.T @ b)

# SVD
U, s, Vh = linalg.svd(A)
# Solve via pseudoinverse
x_svd = Vh.T @ np.diag(1/s) @ U.T @ b

# Condition number
cond = np.linalg.cond(A)
print(f"Condition number: {cond:.2f}")

# Low-rank approximation
k = 2  # rank of approximation
A_k = U[:, :k] @ np.diag(s[:k]) @ Vh[:k, :]
error = np.linalg.norm(A - A_k, 'fro')
print(f"Rank-{k} approximation error: {error:.4f}")
```

## Summary

This chapter covered the four essential matrix decompositions:

**LU Decomposition:**

- Factors $A = LU$ (with pivoting: $PA = LU$)
- Used for solving linear systems efficiently
- Cost: $\frac{2}{3}n^3$ flops to factor, $2n^2$ per solve

**Cholesky Decomposition:**

- Factors $A = LL^T$ for symmetric positive definite matrices
- Half the cost of LU, no pivoting needed
- Positive definite means all eigenvalues positive, $\mathbf{x}^TA\mathbf{x} > 0$

**QR Decomposition:**

- Factors $A = QR$ with orthogonal $Q$
- Foundation for least squares and eigenvalue algorithms
- Gram-Schmidt (intuitive) vs. Householder (stable)

**Singular Value Decomposition:**

- Factors $A = U\Sigma V^T$ for any matrix
- Singular values reveal matrix structure and rank
- Truncated SVD gives optimal low-rank approximation

**Key Concepts:**

- **Matrix rank** determines decomposition structure
- **Numerical rank** accounts for floating-point limitations
- **Condition number** $\kappa = \sigma_1/\sigma_r$ measures sensitivity

**Practical Guidelines:**

1. Use Cholesky for symmetric positive definite systems
2. Use LU for general square systems (with pivoting!)
3. Use QR for least squares problems
4. Use SVD for low-rank approximation and dimensionality reduction
5. Always check condition number before trusting numerical results

??? question "Self-Check: When would you choose SVD over QR for a least squares problem?"
    SVD is preferred when the matrix is rank-deficient or nearly rank-deficient (ill-conditioned). QR can fail or give unstable results when columns are nearly linearly dependent, while SVD explicitly reveals the rank through singular values and handles rank deficiency gracefully via the pseudoinverse. SVD also provides the minimum-norm solution when multiple solutions exist.
