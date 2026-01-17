# Chapter 7: Solving Linear Systems and Decompositions

---

## Overview

In this chapter, we dive into **practical methods for solving systems of linear equations**, a core application of linear algebra in scientific computing. We will explore both classical techniques and efficient matrix factorizations that not only provide solutions but also reveal important structural insights about the system.

Solving linear systems lies at the heart of countless engineering and computing problems: simulating circuits, analyzing networks, training machine learning models, and even 3D graphics rendering. 

We will build on your knowledge of matrix operations and linear transformations from earlier chapters.

---

## 7.1 Matrix Inverse and Solving Systems

### Concept
A matrix inverse, much like the reciprocal of a number, **undoes** the action of a matrix. If a matrix \(A\) is invertible, we can solve \(A\mathbf{x} = \mathbf{b}\) by computing \(\mathbf{x} = A^{-1}\mathbf{b}\).

### How and Why
- **Why?** It gives a direct way to solve equations.
- **How?** If \(A^{-1}\) exists, it satisfies \(A^{-1}A = I\), where \(I\) is the identity matrix.

> **Warning:** Computing \(A^{-1}\) is computationally expensive and numerically unstable for large matrices. In practice, we rarely compute the inverse explicitly!


??? tip "Visual Metaphor"
    Think of matrix multiplication as "squeezing" or "stretching" space. An inverse "unsqueezes" or "unstretches" space exactly.


---

## 7.2 Determinants and Their Properties

### Concept
The **determinant** of a matrix gives a scalar value that indicates whether the matrix is invertible and how it transforms space.

- If \(\text{det}(A) = 0\), the matrix **is not invertible** (it "flattens" space).
- If \(\text{det}(A) \neq 0\), the matrix **is invertible**.

### How and Why
- **Why?** The determinant tells us about volume scaling and collapse.
- **How?** Computed recursively or via triangular forms after row reductions.

??? example "Example"
    The determinant of a 2x2 matrix \(\begin{bmatrix} a & b \\ c & d \end{bmatrix}\) is \(ad - bc\).


---

## 7.3 Cramer's Rule

### Concept
**Cramer's Rule** expresses each variable in \(A\mathbf{x} = \mathbf{b}\) as a ratio of determinants.

### How and Why
- **Why?** It provides a formulaic method for small systems.
- **How?** Replace the column of \(A\) corresponding to the unknown with \(\mathbf{b}\), compute the determinant, and divide by \(\det(A)\).

> **Warning:** Cramer's Rule is **not practical** for large systems because determinant computation grows factorially with matrix size.


---

## 7.4 Gaussian Elimination and RREF

### Concept
**Gaussian elimination** systematically applies row operations to solve a linear system, reducing it to an upper triangular or reduced row echelon form (RREF).

### How and Why
- **Why?** Solving systems becomes easier when matrices are triangular or simple.
- **How?**
  1. Eliminate variables from equations step by step.
  2. Use back substitution to find solutions.

??? tip "Creative Teaching Tip"
    Think of Gaussian elimination as "sweeping" the clutter (variables) under the rug (zeros below the pivots) until only the core (solutions) are visible!


---

## 7.5 Pivot Positions and Free Variables

### Concept
**Pivot positions** are the leading nonzero entries in each row after Gaussian elimination.

- A variable corresponding to a pivot is called a **basic variable**.
- A variable not corresponding to a pivot is called a **free variable**.

### How and Why
- **Why?** They determine the structure of the solution set (unique, infinite, or none).
- **How?** Identify pivots during elimination, and classify variables accordingly.


---

## 7.6 LU, QR, and Cholesky Factorizations

Matrix factorizations break down a complicated matrix into simpler, structured components that make solving systems faster and more stable.

### LU Decomposition
- **Concept:** Express \(A = LU\) where \(L\) is lower triangular, \(U\) is upper triangular.
- **Application:** Solves \(A\mathbf{x} = \mathbf{b}\) via two easier systems: \(L\mathbf{y} = \mathbf{b}\), then \(U\mathbf{x} = \mathbf{y}\).

### QR Decomposition
- **Concept:** Express \(A = QR\) where \(Q\) is orthogonal and \(R\) is upper triangular.
- **Application:** Important in solving least-squares problems and eigenvalue computation.

### Cholesky Decomposition
- **Concept:** For symmetric positive definite matrices, \(A = LL^T\) where \(L\) is lower triangular.
- **Application:** Twice as efficient as LU decomposition for these special matrices.

??? info "Efficiency Tip"
    **Cholesky** decomposition is faster and more stable for symmetric positive definite matrices because it avoids duplicating computations!


---

# ✨ Summary
- Matrix inverses provide a theoretical solution method but are rarely computed directly.
- Determinants help determine invertibility and geometric properties.
- Cramer's Rule, while educational, is inefficient for large systems.
- Gaussian elimination and RREF are fundamental manual solving methods.
- Pivot positions and free variables define the nature of the solution set.
- Matrix decompositions (LU, QR, Cholesky) provide faster, scalable solutions.

---

# 📝 Quiz

What is the most efficient factorization method for solving systems with symmetric, positive definite matrices?

<div class="upper-alpha" markdown>
A. LU decomposition  
B. QR decomposition  
C. Cholesky decomposition  
D. RREF
</div>

??? question "Show Answer"
    The correct answer is **C**. **Cholesky decomposition** is optimized for symmetric positive definite matrices, offering faster and more stable computation than LU or QR.
