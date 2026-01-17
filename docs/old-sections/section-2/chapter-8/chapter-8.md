# Chapter 8: Iterative Methods and Stability

---

## Overview

In Chapter 7, we explored **direct methods** for solving linear systems. However, direct methods can become computationally **impractical** or **unstable** for very large or sparse systems. In this chapter, we shift to **iterative methods**—techniques that generate a sequence of approximations that converge to the true solution.

We'll also study **stability** and **conditioning**—crucial concepts that tell us how errors in the data or rounding errors during computation can impact the final solution.

Understanding these topics ensures that we can solve real-world problems reliably, even when systems are huge, messy, and prone to error.

---

## 8.1 Introduction to Iterative Methods

### Concept
Rather than solving a system in one shot, **iterative methods** start with an initial guess and improve it step-by-step.

### How and Why
- **Why?** Direct methods are too expensive for large or sparse matrices.
- **How?** Each iteration refines the solution based on simple matrix-vector operations.


??? example "Real World Example"
    Google's PageRank algorithm uses an iterative method to rank web pages!


### Basic Structure
1. Start with an initial guess \( \mathbf{x}^{(0)} \).
2. Apply an update rule to get better approximations \( \mathbf{x}^{(1)}, \mathbf{x}^{(2)}, \dots \).
3. Stop when changes become sufficiently small.


---

## 8.2 Jacobi and Gauss-Seidel Methods

### Jacobi Method
- Updates each variable based only on the previous iteration's values.
- **Fully parallelizable**—each new value can be computed independently.

**Update rule:**
$$
x_i^{(k+1)} = \frac{1}{a_{ii}}\left( b_i - \sum_{j \neq i} a_{ij} x_j^{(k)} \right)
$$


### Gauss-Seidel Method
- Updates each variable immediately, using the newest values available.
- **Faster convergence** in many cases because it "learns" from updates within the same iteration.

**Update rule:**
$$
x_i^{(k+1)} = \frac{1}{a_{ii}}\left( b_i - \sum_{j=1}^{i-1} a_{ij} x_j^{(k+1)} - \sum_{j=i+1}^{n} a_{ij} x_j^{(k)} \right)
$$

??? info "Analogy"
    Think of Jacobi as students taking a test independently, while Gauss-Seidel is like students sharing answers immediately during the test!


---

## 8.3 Conjugate Gradient Method

### Concept
The **Conjugate Gradient (CG) Method** is a more advanced iterative method **specialized for symmetric, positive-definite matrices**.

### How and Why
- **Why?** Much faster and memory-efficient for large sparse systems arising in physics simulations, machine learning, and more.
- **How?** CG searches along conjugate directions to minimize the quadratic form associated with \(A\).

**Key Features:**
- Only needs matrix-vector multiplications.
- Requires fewer iterations for convergence.

???+ example "When to Use CG"
    Solving \(Ax = b\) where \(A\) comes from discretizing a 2D Poisson equation—a common physics simulation problem.


---

## 8.4 Matrix Norms

### Concept
A **matrix norm** measures the "size" of a matrix—how much it can stretch a vector.

### How and Why
- **Why?** Helps quantify error and convergence behavior in iterative methods.
- **How?** Different norms exist:
  - **\( \|A\|_1 \)**: maximum absolute column sum.
  - **\( \|A\|_\infty \)**: maximum absolute row sum.
  - **\( \|A\|_2 \)**: largest singular value (spectral norm).

??? tip "Tip"
    Think of a norm as a "magnifying glass"—showing how much a matrix exaggerates changes in input.


---

## 8.5 Condition Number

### Concept
The **condition number** measures how sensitive the solution \( \mathbf{x} \) is to small changes in \(A\) or \( \mathbf{b} \).

### How and Why
- **Why?** Predicts if small input errors will cause large output errors.
- **How?**

**Condition number:**
$$
\kappa(A) = \|A\| \cdot \|A^{-1}\|
$$

- \( \kappa(A) \approx 1 \): well-conditioned (small errors remain small).
- \( \kappa(A) \gg 1 \): ill-conditioned (small errors get amplified).

??? warning "Important"
    Large condition numbers make solving \(A\mathbf{x} = \mathbf{b}\) **numerically risky**, even if \(A\) is invertible theoretically!


---

## 8.6 Stability and Error Analysis

### Concept
**Stability** refers to whether an algorithm produces nearly correct results even when computations have small errors.

### How and Why
- **Why?** All real-world computations have rounding errors.
- **How?** 
  - Stable algorithms control error growth.
  - Unstable algorithms amplify errors unpredictably.


### Forward vs. Backward Error
- **Forward error**: Difference between true solution and computed solution.
- **Backward error**: How much we have to perturb \(A\) or \( \mathbf{b} \) to make the computed solution exact.


??? example "Example"
    A backward stable algorithm might return an answer slightly wrong for your system but exactly right for a very close system.


---

# ✨ Summary
- Iterative methods are essential for solving large or sparse systems.
- Jacobi and Gauss-Seidel are basic iterative schemes.
- Conjugate Gradient is highly efficient for symmetric positive-definite matrices.
- Matrix norms measure "how big" matrices are.
- The condition number quantifies problem sensitivity.
- Stability ensures reliable computation in the presence of unavoidable errors.

---

# 📝 Quiz

If a matrix has a large condition number, what does it imply about solving \(Ax = b\)?

<div class="upper-alpha" markdown>
A. The matrix is singular.  
B. Small input errors can cause large output errors.  
C. The solution is unique and stable.  
D. Gaussian elimination will fail completely.
</div>

??? question "Show Answer"
    The correct answer is **B**. A large condition number means the system is sensitive: small changes in input can cause large changes in output.
