---
title: Matrix Power Calculator
description: Demonstrates how diagonalization simplifies computing matrix powers using the eigenvalue decomposition A^k = PD^kP⁻¹.
image: /sims/matrix-power-calculator/matrix-power-calculator.png
og:image: /sims/matrix-power-calculator/matrix-power-calculator.png
twitter:image: /sims/matrix-power-calculator/matrix-power-calculator.png
social:
   cards: false
---

# Matrix Power Calculator

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Matrix Power Calculator Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This calculator demonstrates one of the most practical applications of diagonalization: efficiently computing high powers of a matrix. Instead of multiplying A by itself k times, we use the decomposition A = PDP⁻¹ to compute A^k = PD^kP⁻¹.

**Key Features:**

- **Editable matrix**: Click cells to enter custom values
- **Power slider**: Compute A^k for k from 1 to 20
- **Diagonalization display**: See P, D, and P⁻¹ matrices
- **Step-by-step**: Watch how D^k is trivially computed
- **Defective detection**: Shows when diagonalization fails

## How to Use

1. **Click matrix cells** to enter custom values
2. **Adjust the power slider** to compute different powers
3. **Toggle "Show Steps"** to see the diagonalization process
4. **Use preset buttons** for quick examples:
   - **Random**: Generate a random matrix
   - **Diagonalizable**: A simple diagonalizable example
   - **Defective**: A matrix that cannot be diagonalized

## Why Diagonalization is Efficient

**Direct Method:** To compute A^20, you need 19 matrix multiplications.

**Diagonalization Method:**
1. Compute P, D, P⁻¹ once (3 operations)
2. Compute D^20 = diag(λ₁^20, λ₂^20) (trivial - just raise scalars to powers)
3. Compute PD^20P⁻¹ (2 matrix multiplications)

For large k, diagonalization is dramatically faster!

## Mathematical Formula

For a diagonalizable matrix A = PDP⁻¹:

**A^k = PD^kP⁻¹**

where D^k = diag(λ₁^k, λ₂^k, ..., λₙ^k)

This works because:
- A² = (PDP⁻¹)(PDP⁻¹) = PD(P⁻¹P)DP⁻¹ = PD²P⁻¹
- By induction: A^k = PD^kP⁻¹

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/matrix-power-calculator/main.html" height="532px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Compute matrix powers using diagonalization
2. Explain why D^k is easy to compute (diagonal matrices)
3. Identify when diagonalization cannot be used (defective matrices)

### Suggested Activities

1. **Manual verification**: For A = [[2, 1], [0, 3]], verify that PD²P⁻¹ = A²
2. **Efficiency comparison**: Count operations for A^10 using both methods
3. **Large powers**: Use the calculator for A^20 and notice how eigenvalues dominate

### Assessment Questions

1. Why is D^k so easy to compute?
2. If A has eigenvalues 0.5 and 2, what happens to A^k as k → ∞?
3. Can you use this method for complex eigenvalues?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
