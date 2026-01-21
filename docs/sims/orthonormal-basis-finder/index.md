---
title: Orthonormal Basis Coordinate Finder
description: Interactive visualization demonstrating how orthonormal bases simplify coordinate finding through inner products
image: /sims/orthonormal-basis-finder/orthonormal-basis-finder.png
---

# Orthonormal Basis Coordinate Finder

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Orthonormal Basis Coordinate Finder Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates the remarkable simplicity of finding coordinates when using an **orthonormal basis**. Instead of solving a system of equations, coordinates are simply **inner products**!

**Learning Objective:** Demonstrate how orthonormal bases simplify finding coordinates via inner products: $c_i = \langle v, q_i \rangle$

## Key Features

- **Draggable Vector**: Move the target vector v to see coordinates update instantly
- **Adjustable Basis**: Rotate the orthonormal basis to any angle
- **Projection Visualization**: See how projections give the coordinates
- **Parseval's Identity**: Verify that energy (norm squared) is preserved
- **Standard Basis Comparison**: Toggle to compare with standard coordinates

## The Mathematics

### Coordinates as Inner Products

For an orthonormal basis $\{q_1, q_2\}$, the coordinates of any vector $v$ are:

$$c_1 = \langle v, q_1 \rangle = v \cdot q_1$$
$$c_2 = \langle v, q_2 \rangle = v \cdot q_2$$

This works because:
$$v = c_1 q_1 + c_2 q_2$$

Taking the inner product with $q_1$:
$$\langle v, q_1 \rangle = c_1 \langle q_1, q_1 \rangle + c_2 \langle q_2, q_1 \rangle = c_1 \cdot 1 + c_2 \cdot 0 = c_1$$

### Parseval's Identity

For orthonormal bases, the norm is preserved:
$$\|v\|^2 = c_1^2 + c_2^2$$

This means the "energy" of the vector equals the sum of squared coordinates.

### Computational Advantage

| Method | For Orthonormal Basis | For General Basis |
|--------|----------------------|-------------------|
| Find coordinates | 2 dot products | Solve 2x2 system |
| Complexity | O(n) | O(n^2) to O(n^3) |
| Numerical stability | Excellent | Depends on condition |

## How to Use

1. **Drag the vector v** (green) to change the target vector
2. **Drag the q1 endpoint** (red) to rotate the orthonormal basis
3. Use the **angle slider** for precise basis angles
4. Toggle **Show Projections** to see projection lines
5. Toggle **Compare to Standard Basis** to see both coordinate systems

## Visual Elements

| Element | Color | Meaning |
|---------|-------|---------|
| q1, q2 | Red, Blue | Orthonormal basis vectors |
| v | Green | Target vector |
| Projection lines | Orange (dashed) | Perpendicular projections |
| c1, c2 labels | Orange | Coordinate values |
| e1, e2 | Gray (dashed) | Standard basis (when enabled) |

## Learning Activities

### Activity 1: Verify the Formula (5 minutes)

1. Set v = (3, 2) and basis angle = 45 degrees
2. Manually calculate: $c_1 = 3 \cdot \cos(45) + 2 \cdot \sin(45)$
3. Compare with the displayed c1 value
4. Verify the reconstruction: $c_1 q_1 + c_2 q_2 = v$

### Activity 2: Explore Parseval's Identity (5 minutes)

1. Note that $\|v\|^2 = v_x^2 + v_y^2$ in standard coordinates
2. Rotate the basis to different angles
3. Observe that $c_1^2 + c_2^2$ always equals $\|v\|^2$
4. This works because orthonormal bases preserve length!

### Activity 3: Compare with Standard Basis (5 minutes)

1. Enable "Compare to Standard Basis"
2. At 0 degrees: orthonormal and standard bases align
3. Notice coordinates match when bases align
4. At other angles: different coordinates, same vector!

### Activity 4: Special Angles (10 minutes)

Find vectors where coordinates become nice numbers:

1. At 45 degrees, find a vector with c1 = c2
2. Find a vector where c2 = 0 (lies along q1)
3. Find a vector where c1 = 0 (lies along q2)

## Discussion Questions

1. Why does the formula $c_i = \langle v, q_i \rangle$ only work for orthonormal bases?
2. What would happen if we tried this formula with a non-orthonormal basis?
3. Why is computational efficiency important for high-dimensional spaces?
4. How does this relate to Fourier analysis (representing signals as sums of sines and cosines)?

## Connection to Other Topics

- **Fourier Transform**: Sines and cosines form an orthonormal basis for functions
- **Principal Component Analysis**: Uses orthonormal eigenvectors
- **Quantum Mechanics**: States expressed in orthonormal bases of observables
- **Signal Processing**: Orthogonal wavelets for compression

## Prerequisites

- Understanding of basis and coordinates
- Inner product (dot product)
- Projection of vectors

## References

- Chapter 8: Vector Spaces and Inner Products - Orthonormal Bases section
- Chapter 7: Matrix Decompositions - QR Decomposition
- [3Blue1Brown: Change of basis](https://www.youtube.com/watch?v=P2LTAUO1TdA)
- Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Section 4.4.
