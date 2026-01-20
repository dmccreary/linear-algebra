---
title: Orthogonal Projection Interactive Visualizer
description: Visualize how vectors project onto lines with perpendicular error vectors and live formula display.
image: /sims/orthogonal-projection/orthogonal-projection.png
og:image: /sims/orthogonal-projection/orthogonal-projection.png
twitter:image: /sims/orthogonal-projection/orthogonal-projection.png
social:
   cards: false
---

# Orthogonal Projection Interactive Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Orthogonal Projection Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates orthogonal projection of vectors onto lines:

- **Projection formula**: proj_û(v) = (v·û)û where û is the unit direction vector
- **Error vector**: The component perpendicular to the line (v - proj(v))
- **Orthogonality**: The error vector is always perpendicular to the projection line

## How to Use

1. **Drag the vector v** (blue) to change its position
2. **Adjust the line angle** to rotate the projection line
3. **Toggle checkboxes** to show/hide error vector, right angle indicator, and formulas
4. **Click Animate** to see the vector oscillate between original and projected positions

## Key Concepts

The projection of v onto unit vector û is:

$$\text{proj}_{\hat{\mathbf{u}}}(\mathbf{v}) = (\mathbf{v} \cdot \hat{\mathbf{u}}) \hat{\mathbf{u}}$$

Properties:

- The error vector is perpendicular to the projection line
- Projection is idempotent: projecting twice gives the same result
- The error vector has minimum length among all vectors from v to the line

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/orthogonal-projection/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Calculate the projection of a vector onto a line using the dot product formula
2. Identify the error vector and verify its orthogonality
3. Explain why projection minimizes distance to the subspace

### Suggested Activities

1. **Verify orthogonality**: Check that error · projection = 0 for various vectors
2. **Minimize distance**: Show that the projection gives the closest point on the line
3. **Special cases**: What happens when v is parallel or perpendicular to the line?

### Assessment Questions

1. If v = (4, 3) and the line is the x-axis, what is proj(v)?
2. When is the error vector zero?
3. How does the projection change as the line rotates?

## References

- Chapter 4: Linear Transformations - Projection section
- Chapter 8: Orthogonality (upcoming)
