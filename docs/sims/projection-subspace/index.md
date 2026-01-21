---
title: Projection onto Subspace Visualizer
description: Visualize projection as finding the closest point in a subspace with orthogonal error vector in 3D.
image: /sims/projection-subspace/projection-subspace.png
og:image: /sims/projection-subspace/projection-subspace.png
twitter:image: /sims/projection-subspace/projection-subspace.png
social:
   cards: false
---

# Projection onto Subspace Visualizer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Projection onto Subspace Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how vectors project onto subspaces (planes or lines) in 3D space. Key concepts include:

- **Projection**: Finding the closest point in a subspace to a given vector
- **Error vector**: The perpendicular component from the projection to the original vector
- **Orthogonality**: The error vector is always perpendicular to the subspace

## How to Use

1. **Adjust vector v** using the sliders (x, y, z components) to change the vector being projected
2. **Modify basis vectors** u1 and u2 to change the orientation of the subspace
3. **Toggle subspace type** between 2D plane and 1D line
4. **Enable/disable displays** for error vector and projection matrix information
5. **Drag in the 3D view** to rotate and explore different viewing angles
6. **Click Reset** to return to default values

## Key Concepts

### Projection onto a Line (1D Subspace)

The projection of vector **v** onto line spanned by **u** is:

$$\text{proj}_W(\mathbf{v}) = \frac{\mathbf{v} \cdot \mathbf{u}}{\mathbf{u} \cdot \mathbf{u}} \mathbf{u}$$

### Projection onto a Plane (2D Subspace)

For a plane W spanned by vectors **u1** and **u2**, the projection is:

$$\mathbf{p} = A(A^T A)^{-1} A^T \mathbf{v}$$

where $A = [\mathbf{u}_1 | \mathbf{u}_2]$ is the matrix with basis vectors as columns.

### Key Properties

1. **Closest point**: The projection **p** is the closest point in the subspace to **v**
2. **Orthogonal error**: The error **e** = **v** - **p** is perpendicular to the subspace
3. **Minimum distance**: ||**e**|| is the minimum distance from **v** to any point in the subspace

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/projection-subspace/main.html" height="532px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Calculate the projection of a vector onto a subspace
2. Verify that the error vector is orthogonal to the subspace
3. Explain why projection gives the closest point in the subspace
4. Connect projection to least squares and orthogonal decomposition

### Suggested Activities

1. **Verify orthogonality**: Check that e . u1 = 0 and e . u2 = 0 for various configurations
2. **Minimize distance**: Show that moving v closer to the projection decreases ||e||
3. **Special cases**: What happens when v is already in the subspace?
4. **Compare subspace dimensions**: How does projection onto a line differ from projection onto a plane?

### Assessment Questions

1. If v = (2, 3, 4) and W is the xy-plane, what is proj_W(v)?
2. When is the error vector zero?
3. How does the projection change as the subspace rotates?
4. What is the relationship between projection and orthogonal complement?

## Applications

- **Least squares regression**: Finding the best-fit line/plane by projecting data onto a subspace
- **Principal Component Analysis**: Projecting high-dimensional data onto lower-dimensional subspaces
- **Computer graphics**: Shadow casting and 3D-to-2D projection
- **Signal processing**: Extracting signal components by projecting onto signal subspaces

## References

- Chapter 8: Orthogonality and Projections
- Chapter 9: Least Squares Applications
