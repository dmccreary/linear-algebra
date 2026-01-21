---
title: Four Fundamental Subspaces Visualizer
description: Visualize the four fundamental subspaces of a matrix and their orthogonal relationships, demonstrating the Fundamental Theorem of Linear Algebra.
image: /sims/four-subspaces/four-subspaces.png
og:image: /sims/four-subspaces/four-subspaces.png
twitter:image: /sims/four-subspaces/four-subspaces.png
social:
   cards: false
---

# Four Fundamental Subspaces Visualizer

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Four Fundamental Subspaces Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization illustrates the **Fundamental Theorem of Linear Algebra**, showing the four fundamental subspaces associated with any matrix A (m x n):

### Domain (R^n)

- **Row Space**: The span of the rows of A (dimension = rank)
- **Null Space**: Vectors x where Ax = 0 (dimension = n - rank)

### Codomain (R^m)

- **Column Space**: The span of the columns of A (dimension = rank)
- **Left Null Space**: Vectors y where A^T y = 0 (dimension = m - rank)

### Key Relationships

The four subspaces satisfy these fundamental properties:

$$\text{Row Space} \perp \text{Null Space}$$

$$\text{Column Space} \perp \text{Left Null Space}$$

$$\dim(\text{Row Space}) + \dim(\text{Null Space}) = n$$

$$\dim(\text{Column Space}) + \dim(\text{Left Null Space}) = m$$

The transformation A maps the **Row Space** onto the **Column Space**, and maps the **Null Space** to the zero vector.

## How to Use

1. **Edit the matrix A** using the input fields (up to 4x4 matrix)
2. **Click "Compute Subspaces"** to calculate and display all four subspaces
3. **Toggle "Show Basis Vectors"** to see the basis for each subspace
4. **Toggle "Verify Orthogonality"** to check that orthogonal pairs have zero dot product
5. **Use the Highlight slider** to focus on one subspace at a time:
   - 0 = All subspaces
   - 1 = Row Space
   - 2 = Column Space
   - 3 = Null Space
   - 4 = Left Null Space

## Key Observations

- **Rank determines all dimensions**: Once you know rank(A), you know the dimension of all four subspaces
- **Orthogonal complements**: Row space and null space are orthogonal complements in R^n; column space and left null space are orthogonal complements in R^m
- **Rank-deficient matrices**: When rank < min(m,n), the null space and/or left null space are nontrivial
- **Full rank**: When rank = min(m,n), either null space or left null space reduces to {0}

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/four-subspaces/main.html" height="542px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Identify and describe all four fundamental subspaces of a matrix
2. Verify the orthogonality relationships between subspace pairs
3. Apply the rank-nullity theorem to determine subspace dimensions
4. Explain how the transformation A relates the domain and codomain subspaces

### Suggested Activities

1. **Verify dimensions**: For various matrices, confirm rank + nullity = n
2. **Orthogonality test**: Pick vectors from row space and null space, verify dot product = 0
3. **Mapping exploration**: Trace how a row space vector maps to column space, and how a null space vector maps to zero
4. **Rank variations**: Compare subspaces for full rank vs rank-deficient matrices

### Assessment Questions

1. If a 3x4 matrix has rank 2, what are the dimensions of all four subspaces?
2. Why must the row space and null space be orthogonal?
3. If Ax = b has a solution, what does this say about b and the column space?
4. How does the left null space relate to the solvability of A^T y = c?

## References

- Chapter 8: Vector Spaces and Subspaces
- Strang, G. "The Fundamental Theorem of Linear Algebra"
- Rank-Nullity Theorem
