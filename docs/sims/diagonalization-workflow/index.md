---
title: Diagonalization Process Workflow
description: Interactive flowchart guiding through the step-by-step process of diagonalizing a matrix with decision points.
image: /sims/diagonalization-workflow/diagonalization-workflow.png
og:image: /sims/diagonalization-workflow/diagonalization-workflow.png
twitter:image: /sims/diagonalization-workflow/diagonalization-workflow.png
social:
   cards: false
---

# Diagonalization Process Workflow

<iframe src="main.html" height="572px" width="100%" scrolling="no"></iframe>

[Run the Diagonalization Workflow Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive flowchart guides you through the complete diagonalization process, highlighting the key decision points that determine whether a matrix can be diagonalized.

**Workflow Steps:**

1. Start with matrix A
2. Compute characteristic polynomial det(A - λI)
3. Solve for eigenvalues
4. Check if n eigenvalues exist
5. Find eigenvectors for each eigenvalue
6. Compute geometric multiplicities
7. Check m_g = m_a condition
8. Result: A = PDP⁻¹ or NOT diagonalizable

## How to Use

1. **Click "Next Step"** to advance through the workflow
2. **Click "Reset"** to start over
3. **Toggle "Auto-advance"** for automatic progression
4. **Read the description panel** for details about each step

## Node Types

| Shape | Meaning |
|-------|---------|
| Rounded rectangle (gray) | Start node |
| Rectangle (blue) | Process/computation step |
| Diamond (yellow) | Decision point |
| Rounded rectangle (green) | Success outcome |
| Rounded rectangle (red) | Failure outcome |

## The Diagonalization Algorithm

```
1. Given n×n matrix A
2. Form (A - λI) and compute det(A - λI)
3. Solve characteristic equation to get λ₁, ..., λₖ
4. For each λᵢ:
   a. Solve (A - λᵢI)v = 0
   b. Find basis for null space (eigenspace)
   c. Record geometric multiplicity
5. If Σ(geometric multiplicities) = n:
   - Form P = [v₁ | v₂ | ... | vₙ]
   - Form D = diag(λ₁, ..., λₙ)
   - A = PDP⁻¹ ✓
6. Otherwise: NOT diagonalizable ✗
```

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/diagonalization-workflow/main.html" height="572px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Follow the systematic process for diagonalizing a matrix
2. Identify the two key decision points in the diagonalization process
3. Determine when a matrix is not diagonalizable and why

### Suggested Activities

1. **Apply the workflow**: Use the flowchart to diagonalize [[4, 2], [1, 3]]
2. **Find the failure point**: Which step fails for [[2, 1], [0, 2]]?
3. **Complex eigenvalues**: What happens when eigenvalues are complex?

### Assessment Questions

1. At which step do you first know the algebraic multiplicities?
2. What is the purpose of computing geometric multiplicity?
3. If a 3×3 matrix has only 2 linearly independent eigenvectors, what path does it take in the flowchart?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
