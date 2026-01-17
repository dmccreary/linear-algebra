# Chapter 9: Advanced Matrix Factorizations

---

## Overview

Building on our understanding of solving linear systems and iterative methods, we now venture into the world of **advanced matrix factorizations**. These techniques allow us to uncover deep structural insights into matrices, simplify complex computations, and enable applications in areas like **data science**, **control systems**, and **optimization**.

In this chapter, you will learn about powerful tools like the **Singular Value Decomposition (SVD)**, the **Moore-Penrose pseudoinverse**, **Schur decomposition**, and structured orthogonal transformations such as **Householder reflections** and **Givens rotations**.

These methods are fundamental to mastering modern scientific computing.

---

## 9.1 Singular Value Decomposition (SVD)

### Concept
**SVD** expresses any matrix \(A\) as a product:

$$
A = U \Sigma V^T
$$

where:
- \(U\) and \(V\) are orthogonal matrices.
- \(\Sigma\) is a diagonal matrix with non-negative real numbers (the **singular values**).

### How and Why
- **Why?** It reveals the "geometry" of how \(A\) stretches and rotates space.
- **How?** Through careful decomposition of \(A\) into simpler, interpretable parts.


???+ example "Geometric Intuition"
    Imagine \(A\) as first rotating space (via \(V\)), then stretching or shrinking (via \(\Sigma\)), then rotating again (via \(U\)).


### Applications
- Principal Component Analysis (PCA) in data science.
- Solving least-squares problems.
- Noise reduction and signal compression.

---

## 9.2 Moore-Penrose Pseudoinverse

### Concept
For matrices that are **non-square** or **singular**, the **pseudoinverse** \(A^+\) provides a best-fit solution to \(A\mathbf{x} = \mathbf{b}\).

### How and Why
- **Why?** Not all systems have exact solutions—sometimes we must seek an approximate (least-squares) one.
- **How?**

$$
A^+ = V \Sigma^+ U^T
$$

where \(\Sigma^+\) replaces each nonzero singular value \(\sigma\) with \(1/\sigma\).


??? tip "Best Fit Solutions"
    When the system is inconsistent, \(A^+\mathbf{b}\) gives the solution \(\mathbf{x}\) minimizing \(\|A\mathbf{x} - \mathbf{b}\|\).


---

## 9.3 Schur Decomposition

### Concept
Any square matrix \(A\) can be decomposed as:

$$
A = Q T Q^*
$$

where:
- \(Q\) is unitary (or orthogonal for real matrices).
- \(T\) is upper triangular.

### How and Why
- **Why?** Triangular matrices are easier to analyze and work with.
- **How?** By applying a sequence of orthogonal transformations to \(A\).


### Applications
- Simplifies eigenvalue computation.
- Forms the basis for many iterative methods (e.g., QR algorithm for eigenvalues).


??? info "Triangular Advantage"
    Finding eigenvalues of a triangular matrix \(T\) is as easy as reading its diagonal entries!


---

## 9.4 Householder Transformations

### Concept
A **Householder transformation** reflects a vector across a plane or hyperplane to introduce zeros below the pivot.

### How and Why
- **Why?** Useful in QR decomposition and in reducing matrices to simpler forms.
- **How?**

$$
H = I - 2 \frac{\mathbf{v}\mathbf{v}^T}{\mathbf{v}^T \mathbf{v}}
$$

where \(\mathbf{v}\) is carefully chosen.


### Applications
- Efficiently zeroing entries during QR decomposition.
- Constructing orthogonal matrices numerically stably.


???+ example "Intuitive Picture"
    Picture a beam of light reflecting off a flat mirror: the vector is flipped symmetrically across a plane!


---

## 9.5 Givens Rotations

### Concept
**Givens rotations** apply a simple 2D rotation to zero a specific matrix entry.

### How and Why
- **Why?** Targeted and efficient way to introduce zeros while preserving orthogonality.
- **How?** Rotates within the plane of two coordinates.

### Applications
- Building QR decompositions especially for sparse matrices.
- Fine-grained control over numerical stability.


??? example "When to Use Givens"
    When you want to zero just one specific off-diagonal element without touching the rest of the matrix too much.


---

# ✨ Summary
- **SVD** decomposes any matrix into orthogonal transformations and singular values.
- The **Moore-Penrose pseudoinverse** finds least-squares solutions for non-square systems.
- **Schur decomposition** simplifies matrix analysis by reducing to upper triangular form.
- **Householder reflections** efficiently zero entire columns below the pivot.
- **Givens rotations** perform selective 2D zeroing while maintaining orthogonality.

These tools are essential for stability, performance, and deeper understanding of linear systems in scientific computing.

---

# 📝 Quiz

Which decomposition represents any \(m \times n\) matrix as a product of two orthogonal matrices and a diagonal matrix?

<div class="upper-alpha" markdown>
A. LU Decomposition  
B. Schur Decomposition  
C. QR Decomposition  
D. Singular Value Decomposition (SVD)
</div>

??? question "Show Answer"
    The correct answer is **D**. **Singular Value Decomposition (SVD)** expresses any matrix as \(U\Sigma V^T\) with orthogonal \(U\) and \(V\), and a diagonal \(\Sigma\).
