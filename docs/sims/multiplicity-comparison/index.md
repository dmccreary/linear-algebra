---
title: Multiplicity Comparison Chart
description: Compare algebraic and geometric multiplicity across different matrix types to understand diagonalizability conditions.
image: /sims/multiplicity-comparison/multiplicity-comparison.png
og:image: /sims/multiplicity-comparison/multiplicity-comparison.png
twitter:image: /sims/multiplicity-comparison/multiplicity-comparison.png
social:
   cards: false
---

# Multiplicity Comparison Chart

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Multiplicity Comparison Chart Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This comparison chart displays three canonical cases that illustrate the relationship between algebraic and geometric multiplicity, and how this relationship determines whether a matrix is diagonalizable.

**The Three Cases:**

1. **Distinct Eigenvalues** (Green): Each eigenvalue has multiplicity 1 → Always diagonalizable
2. **Repeated with Full Eigenspace** (Blue): Repeated eigenvalue but m_g = m_a → Diagonalizable (scalar matrix example)
3. **Defective Matrix** (Red): Repeated eigenvalue with m_g < m_a → NOT diagonalizable

## Key Concepts

| Term | Definition |
|------|------------|
| **Algebraic Multiplicity (m_a)** | How many times λ appears as a root of the characteristic polynomial |
| **Geometric Multiplicity (m_g)** | Dimension of the eigenspace, i.e., number of linearly independent eigenvectors |
| **Defective Matrix** | A matrix where m_g < m_a for some eigenvalue |

## The Multiplicity Inequality

For any eigenvalue λ:

**1 ≤ geometric multiplicity ≤ algebraic multiplicity**

A matrix is diagonalizable if and only if geometric multiplicity equals algebraic multiplicity for ALL eigenvalues.

## How to Use

1. **Compare the three cards** side by side
2. **Examine the ratio bar** showing m_g/m_a
3. **Hover over cards** to highlight them
4. **Note the status** indicator showing diagonalizability

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/multiplicity-comparison/main.html" height="532px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Distinguish between algebraic and geometric multiplicity
2. Identify when a matrix is diagonalizable based on multiplicities
3. Recognize defective matrices and explain why they cannot be diagonalized

### Suggested Activities

1. **Verification**: Compute the eigenspaces for each example matrix and verify the geometric multiplicities
2. **Create examples**: Find a 3×3 defective matrix with a different structure
3. **Borderline cases**: Why is [[2, 0], [0, 2]] diagonalizable but [[2, 1], [0, 2]] is not?

### Assessment Questions

1. If a 4×4 matrix has characteristic polynomial (λ-3)⁴, what are the possible geometric multiplicities? Which would make it diagonalizable?
2. Can a matrix with distinct eigenvalues ever be defective? Explain.
3. What is special about the eigenvectors of a defective matrix?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](/learning-graph/)
