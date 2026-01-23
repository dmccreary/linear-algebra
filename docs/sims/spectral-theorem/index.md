---
title: Spectral Theorem Demonstration
description: Interactive demonstration of the spectral theorem showing how symmetric matrices decompose into orthogonal eigenvectors and real eigenvalues.
image: /sims/spectral-theorem/spectral-theorem.png
og:image: /sims/spectral-theorem/spectral-theorem.png
twitter:image: /sims/spectral-theorem/spectral-theorem.png
social:
   cards: false
---

# Spectral Theorem Demonstration

<iframe src="main.html" height="432px" width="100%" scrolling="no"></iframe>

[Run the Spectral Theorem Demo Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

The Spectral Theorem is one of the most beautiful results in linear algebra. It states that every symmetric matrix can be orthogonally diagonalized: A = QΛQᵀ, where Q is orthogonal and Λ is diagonal.

**Key Features:**

- **Symmetric matrix input**: Automatically enforces a₁₂ = a₂₁
- **Orthogonal decomposition**: See Q, Λ, and Qᵀ matrices
- **Geometric visualization**: Orthogonal eigenvectors shown at right angles
- **Orthogonality verification**: Confirms q₁ · q₂ = 0 and QᵀQ = I

## The Spectral Theorem

For any real symmetric matrix A (where A = Aᵀ):

**A = QΛQᵀ**

Where:
- Q is an **orthogonal matrix** (Qᵀ = Q⁻¹)
- Columns of Q are **orthonormal eigenvectors**
- Λ is a **diagonal matrix** of eigenvalues
- All eigenvalues are **real** (not complex)

## Why Symmetric Matrices Are Special

| Property | General Matrix | Symmetric Matrix |
|----------|---------------|------------------|
| Eigenvalues | May be complex | Always real |
| Eigenvectors | Not orthogonal | Orthogonal for distinct λ |
| Diagonalizable | Not guaranteed | Always |
| P⁻¹ computation | Matrix inversion | Just Pᵀ (transpose) |

## How to Use

1. **Click matrix cells** to edit values (symmetry is maintained)
2. **Use "Random Symmetric"** for new examples
3. **Observe the decomposition** A = QΛQᵀ
4. **Check orthogonality**: q₁ · q₂ should equal 0

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/spectral-theorem/main.html" height="532px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. State the spectral theorem for real symmetric matrices
2. Verify that eigenvectors of symmetric matrices are orthogonal
3. Explain why Q⁻¹ = Qᵀ for orthogonal matrices
4. Apply the spectral theorem to decompose symmetric matrices

### Suggested Activities

1. **Verify decomposition**: Multiply QΛQᵀ and confirm it equals A
2. **Check orthogonality**: Compute q₁ · q₂ for several examples
3. **Non-symmetric**: What happens if you try a non-symmetric matrix?
4. **Repeated eigenvalues**: Test A = [[2, 0], [0, 2]]

### Assessment Questions

1. Why must eigenvalues of symmetric matrices be real?
2. If A is symmetric with eigenvalues 3 and 7, what are the eigenvalues of A²?
3. What is the computational advantage of QᵀQ = I?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](/learning-graph/)
