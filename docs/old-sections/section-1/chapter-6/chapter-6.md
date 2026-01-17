# 📘 Chapter 6: Linear Transformations and Eigenanalysis

We've explored matrices, vector spaces, independence, and orthogonality. Now we step into one of the most powerful ideas in linear algebra:  
> **How do matrices act as machines that transform spaces?**

In this chapter, we'll study **linear transformations**, their **matrix representations**, and the profound concepts of **eigenvalues** and **eigenvectors**.  
These ideas form the mathematical core behind control systems, graphics transformations, machine learning models, and beyond.

---

## 6.1 What is a Linear Transformation?

A **linear transformation** \( T \) is a rule that **moves vectors around** — but in a special, structure-preserving way.

**Formally, \( T: \mathbb{R}^n \to \mathbb{R}^m \)** is linear if:

1. \( T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v}) \) (Additivity)
2. \( T(c\mathbf{u}) = cT(\mathbf{u}) \) (Homogeneity)

**Creative Analogy:**  
Imagine stretching, rotating, or flipping an entire room — but no ripping or folding allowed. Every movement is smooth and proportional.

---

### Examples

- **Scaling**: Multiply each coordinate by 2.
- **Rotation**: Spin vectors around the origin.
- **Projection**: Flatten vectors onto a line or plane.

---

## 6.2 Matrix Representation of Linear Transformations

Every linear transformation can be represented by a **matrix**.  
Applying a linear transformation is the same as **multiplying** by its associated matrix.

If \( T \) is a linear transformation, there exists a matrix \( A \) such that:
$$
T(\mathbf{x}) = A\mathbf{x}
$$

---

### Why Matrices?

- They **encode** the action of transformations compactly.
- They allow **easy computation** of complex changes.
- They **unify** geometric intuition and algebraic manipulation.

---

## 6.3 Kernel and Image

### Kernel (Null Space)

The **kernel** of a transformation \(T\) is the set of vectors sent to zero:
$$
\ker(T) = \{ \mathbf{x} \mid T(\mathbf{x}) = \mathbf{0} \}
$$

**Interpretation:**  
The kernel captures all directions that are "flattened" completely.

---

### Image (Range)

The **image** of a transformation is the set of all possible outputs:
$$
\text{Im}(T) = \{ T(\mathbf{x}) \mid \mathbf{x} \in \mathbb{R}^n \}
$$

**Interpretation:**  
The image tells you where vectors can land — the "reach" of the transformation.

---

## 6.4 Change of Basis and Similar Matrices

Sometimes, it's useful to **change coordinates** to better understand a transformation.

Given a basis \(B\), we can:
- Represent vectors differently (relative to \(B\)),
- Represent transformations differently (with respect to \(B\)).

Two matrices are **similar** if they represent the **same transformation** but in **different bases**.

**Formal Definition:**  
Matrices \(A\) and \(B\) are similar if:
$$
B = P^{-1}AP
$$
for some invertible matrix \(P\).

---

### Why Change Basis?

- Simplify computations,
- Reveal hidden structures (like decoupling independent behaviors),
- Diagonalize matrices when possible.

---

## 6.5 Eigenvalues and Eigenvectors

One of the most astonishing concepts in linear algebra:

> Some vectors **don't change direction** when a transformation is applied — only their magnitude changes.

These are **eigenvectors**.

- Given a transformation \(A\),
- An **eigenvector** \(\mathbf{v}\) satisfies:
$$
A\mathbf{v} = \lambda \mathbf{v}
$$
where \(\lambda\) is a **scalar** called the **eigenvalue**.

---

### Interpretation

- \(\mathbf{v}\) points along a **natural direction** of the transformation.
- \(\lambda\) tells you how much \(\mathbf{v}\) is **stretched or shrunk**.

**Creative Analogy:**  
Imagine pushing a swing: the swing moves back and forth along its natural arc — it doesn’t spin sideways or move unpredictably.  
Eigenvectors are the natural "arcs" of linear transformations.

---

## 6.6 Finding Eigenvalues and Eigenvectors

### Step 1: Find Eigenvalues

Solve:
$$
\det(A - \lambda I) = 0
$$
This is the **characteristic equation**.

The solutions \(\lambda\) are the **eigenvalues**.

---

### Step 2: Find Eigenvectors

For each eigenvalue \(\lambda\), solve:
$$
(A - \lambda I)\mathbf{v} = \mathbf{0}
$$
to find eigenvectors.

---

### Example

Let:
$$
A =
\begin{bmatrix}
4 & 1 \\\\
2 & 3
\end{bmatrix}
$$

Find the eigenvalues:

1. Compute \( \det(A - \lambda I) \):
$$
\det
\begin{bmatrix}
4-\lambda & 1 \\\\
2 & 3-\lambda
\end{bmatrix}
= (4-\lambda)(3-\lambda) - 2
$$
Expand:
$$
= \lambda^2 - 7\lambda + 10
$$

2. Solve \( \lambda^2 - 7\lambda + 10 = 0 \).

Solutions: \( \lambda = 5 \) and \( \lambda = 2 \).

3. For each \(\lambda\), solve \( (A - \lambda I)\mathbf{v} = \mathbf{0} \) to find eigenvectors.

---

## 6.7 Eigenspaces, Algebraic and Geometric Multiplicities

- The **eigenspace** for an eigenvalue \(\lambda\) is the set of all corresponding eigenvectors (plus the zero vector).
- **Algebraic multiplicity**: how many times \(\lambda\) appears as a root of the characteristic polynomial.
- **Geometric multiplicity**: the dimension of the eigenspace.

**Important Fact:**  
Geometric multiplicity is always **less than or equal to** algebraic multiplicity.

---

## 6.8 Why This Chapter Matters

Understanding linear transformations and eigenanalysis allows you to:

- Decompose systems into simple behaviors,
- Analyze stability in control systems,
- Perform dimensionality reduction (PCA in machine learning),
- Diagonalize matrices to simplify powers of matrices.

**Building on Earlier Ideas:**  
Matrices don't just store numbers — they **move** vectors in structured ways.  
Eigenvectors and eigenvalues describe the **deep patterns** of these movements.

---

# 📚 Summary

In this chapter, you learned:

- Linear transformations preserve structure and can be represented by matrices.
- Kernels capture vectors that are flattened; images capture vectors that are reachable.
- Similar matrices describe the same transformation in different coordinate systems.
- Eigenvalues and eigenvectors reveal **natural directions and scaling**.
- Eigenspaces, algebraic multiplicity, and geometric multiplicity structure eigenbehaviors.

This chapter prepares you for real-world applications where transformations need to be analyzed, optimized, and decomposed!

---

# 🧠 Quiz
What does it mean if a matrix has fewer than \(n\) linearly independent eigenvectors?
<div class="upper-alpha" markdown>

A. It is not square

B. It cannot be diagonalized

C. It has no eigenvalues

D. Its determinant is zero
</div>

??? Question "Show Answer"
    The correct answer is **B**.  
    If a matrix has fewer than \(n\) linearly independent eigenvectors, it **cannot be diagonalized** — that is, it cannot be written as a diagonal matrix under any basis change.
