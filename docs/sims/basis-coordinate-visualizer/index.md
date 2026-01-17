---
title: Basis and Coordinate System Visualizer
description: Side-by-side comparison of standard and custom basis coordinate systems showing how the same vector has different coordinate representations.
image: /sims/basis-coordinate-visualizer/basis-coordinate-visualizer.png
og:image: /sims/basis-coordinate-visualizer/basis-coordinate-visualizer.png
twitter:image: /sims/basis-coordinate-visualizer/basis-coordinate-visualizer.png
quality_score: 85
social:
   cards: false
---

# Basis and Coordinate System Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Basis and Coordinate System Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This visualization demonstrates that the same geometric vector can have different coordinate representations depending on which basis you use. The left panel shows the standard basis (e₁, e₂) while the right panel shows a custom basis (b₁, b₂) that you can modify.

**Learning Objective:** Students will interpret how the same point has different coordinate representations in different bases by visualizing standard and custom basis vectors simultaneously.

## How to Use

1. **Drag the Vector**: In either panel, drag the green vector endpoint to move it
2. **Drag Basis Vectors**: In the right panel, drag the endpoints of b₁ (red) and b₂ (blue) to change the custom basis
3. **Use Presets**: Click preset buttons to see common basis configurations:
   - **Standard**: b₁ = (1, 0), b₂ = (0, 1) - matches the standard basis
   - **Rotated 45°**: Basis rotated by 45 degrees
   - **Skewed**: Non-orthogonal basis vectors
   - **Stretched**: Basis vectors with different lengths
4. **Toggle Options**:
   - **Show Grid**: Toggle grid lines in both panels
   - **Show Projections**: Toggle dashed projection lines

## Key Concepts Demonstrated

### Coordinate Representation
The same geometric vector v has different coordinates in different bases:
- In standard basis: v = (x, y) means v = x·e₁ + y·e₂
- In custom basis: [v]_B = (c₁, c₂) means v = c₁·b₁ + c₂·b₂

### The Equation
The coordinates [v]_B satisfy:
$$\mathbf{v} = c_1\mathbf{b}_1 + c_2\mathbf{b}_2$$

### Change of Basis
When you change the basis vectors, the grid lines in the right panel change to follow the new basis directions. The coordinates change, but the geometric vector stays the same!

## Important Observations

1. **Same Vector, Different Numbers**: Moving to a stretched basis makes coordinates smaller
2. **Grid Deformation**: The grid follows the basis vectors
3. **Parallel Basis Warning**: If b₁ and b₂ become parallel, coordinates become undefined
4. **Verification**: The formula c₁·b₁ + c₂·b₂ = v is shown at the bottom

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/basis-coordinate-visualizer/main.html"
        height="502px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate introductory linear algebra

### Duration
20-25 minutes

### Prerequisites
- Vector basics
- Linear combinations
- Understanding of basis vectors

### Learning Activities

1. **Exploration (5 min)**:
   - Start with "Standard" preset and observe both panels show same coordinates
   - Move the vector and verify coordinates match

2. **Rotated Basis Investigation (5 min)**:
   - Click "Rotated 45°"
   - Notice how coordinates change but vector stays the same
   - Find a vector where custom coordinates are simpler than standard

3. **Skewed Basis Exploration (5 min)**:
   - Click "Skewed"
   - Observe how grid lines are no longer perpendicular
   - Verify the linear combination formula still works

4. **Custom Basis Creation (10 min)**:
   - Drag b₁ and b₂ to create your own basis
   - Find a basis where a specific vector has integer coordinates
   - Try to make b₁ and b₂ parallel and observe the "undefined" warning

### Discussion Questions

1. Why does the same vector have different coordinates in different bases?
2. What happens geometrically when you stretch a basis vector?
3. Why do parallel basis vectors make coordinates undefined?
4. How would you convert coordinates from one basis to another?

### Assessment Ideas

- Given a vector and a basis, calculate the coordinates by hand and verify
- Explain why the grid deforms when the basis changes
- Find a basis that makes a given vector have coordinates (1, 1)

## References

1. [3Blue1Brown - Change of basis](https://www.youtube.com/watch?v=P2LTAUO1TdA) - Excellent visual explanation
2. [Khan Academy - Change of basis](https://www.khanacademy.org/math/linear-algebra/alternate-bases/change-of-basis/v/linear-algebra-change-of-basis-matrix)
3. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Section 3.5.
4. Lay, D. C. (2015). *Linear Algebra and Its Applications* (5th ed.). Section 4.4.
