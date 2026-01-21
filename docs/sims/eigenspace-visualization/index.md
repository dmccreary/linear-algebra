---
title: Eigenspace Visualization
description: 3D visualization of eigenspaces showing how geometric multiplicity determines whether eigenspaces are lines or planes through the origin.
image: /sims/eigenspace-visualization/eigenspace-visualization.png
og:image: /sims/eigenspace-visualization/eigenspace-visualization.png
twitter:image: /sims/eigenspace-visualization/eigenspace-visualization.png
social:
   cards: false
---

# Eigenspace Visualization

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Eigenspace Visualization Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This 3D visualization demonstrates how eigenspaces are vector subspaces containing all eigenvectors for a given eigenvalue. The dimension of an eigenspace (geometric multiplicity) determines whether it appears as a line (1D) or plane (2D) through the origin.

**Key Features:**

- **3D rotation**: Drag to rotate the view and explore from different angles
- **Multiple examples**: Browse through matrices with different eigenspace structures
- **Visual eigenspaces**: Lines and planes shown as semi-transparent colored regions
- **Eigenvector arrows**: Toggle to see individual eigenvector directions
- **Color-coded**: Each eigenvalue has a distinct color

## How to Use

1. **Drag the 3D view** to rotate and examine eigenspaces from different angles
2. **Use Prev/Next buttons** to browse through different matrix examples
3. **Toggle "Show Grid"** to see or hide the coordinate grid
4. **Toggle "Show Vectors"** to see eigenvector arrows

## Mathematical Background

The **eigenspace** for eigenvalue λ is defined as:

**E_λ = null(A - λI) = {v ∈ ℝⁿ : Av = λv}**

Key properties:

- Every eigenspace is a vector subspace
- The dimension equals the **geometric multiplicity** of λ
- If geometric multiplicity = 1, eigenspace is a line
- If geometric multiplicity = 2, eigenspace is a plane
- Eigenvectors from different eigenspaces are linearly independent

## Examples Included

1. **3 Distinct Eigenvalues**: Diagonal matrix with three 1D eigenspaces (lines along axes)
2. **Repeated Eigenvalue**: λ=3 has multiplicity 2 with a 2D eigenspace (xy-plane)
3. **General Symmetric**: Orthogonal eigenvectors in arbitrary directions
4. **Rotation-like**: Single real eigenvalue, complex pair causes rotation

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/eigenspace-visualization/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Visualize eigenspaces as subspaces (lines or planes) through the origin
2. Connect geometric multiplicity to eigenspace dimension
3. Understand why eigenvectors from different eigenspaces are linearly independent

### Suggested Activities

1. **Identify dimensions**: For each example, count the dimension of each eigenspace
2. **Predict eigenspaces**: Given a diagonal matrix, predict what the eigenspaces will look like
3. **Orthogonality check**: Verify that symmetric matrices have orthogonal eigenspaces
4. **Basis vectors**: Identify basis vectors for each eigenspace

### Assessment Questions

1. If a 3×3 matrix has eigenvalue λ=2 with algebraic multiplicity 2 and geometric multiplicity 1, what does the eigenspace look like?
2. Why can't eigenspaces from different eigenvalues overlap (except at the origin)?
3. What is the maximum possible dimension for an eigenspace of a 4×4 matrix?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](/learning-graph/)
