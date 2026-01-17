---
title: Dot Product and Cross Product Visualizer
description: Interactive visualization comparing dot product (projection and angle) with cross product (perpendicular vector and parallelogram area).
image: /sims/dot-cross-product-visualizer/dot-cross-product-visualizer.png
og:image: /sims/dot-cross-product-visualizer/dot-cross-product-visualizer.png
twitter:image: /sims/dot-cross-product-visualizer/dot-cross-product-visualizer.png
quality_score: 85
social:
   cards: false
---

# Dot Product and Cross Product Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Dot Product and Cross Product Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This visualization helps students understand the geometric meaning of both the dot product and cross product. The dot product view shows how vectors project onto each other and how the angle between vectors affects the result. The cross product view demonstrates the perpendicular vector and its relationship to parallelogram area.

**Learning Objective:** Students will analyze the geometric relationship between dot product (projection and angle) and cross product (perpendicular vector and area) by manipulating vectors and observing how the products change.

## How to Use

### Dot Product View (2D)
1. **Drag Vectors**: Click and drag the endpoints of vectors **u** (blue) and **v** (red)
2. **Observe Projection**: The purple line shows the projection of v onto u
3. **Watch the Angle**: The orange arc shows the angle θ between vectors
4. **See the Formula**: The panel shows how u·v = |u||v|cos(θ)

### Cross Product View (3D)
1. **Toggle View**: Click "Show Cross Product (3D)" to switch views
2. **Rotate Scene**: Click and drag to rotate the 3D view
3. **Observe Parallelogram**: The yellow area shows the parallelogram formed by u and v
4. **See Result Vector**: The green vector u×v is perpendicular to both u and v

### Controls
- **Show Projection**: Toggle the projection visualization
- **Show Parallelogram**: Toggle the parallelogram in 3D view
- **Show Formula**: Toggle the step-by-step formula calculation
- **Animate Angle Sweep**: Watch how the products change as angle varies from 0° to 180°

## Key Concepts Demonstrated

### Dot Product
- **Projection**: The dot product relates to how much one vector projects onto another
- **Angle Relationship**: $\mathbf{u} \cdot \mathbf{v} = |\mathbf{u}||\mathbf{v}|\cos\theta$
- **Perpendicularity**: When θ = 90°, the dot product is zero
- **Sign**: Positive when angle < 90°, negative when angle > 90°

### Cross Product
- **Perpendicular Result**: u×v is perpendicular to both u and v
- **Area**: |u×v| equals the area of the parallelogram formed by u and v
- **Right-Hand Rule**: The direction follows the right-hand rule
- **Only in 3D**: The cross product is only defined for 3D vectors

## Mathematical Formulas

**Dot Product:**
$$\mathbf{u} \cdot \mathbf{v} = u_x v_x + u_y v_y = |\mathbf{u}||\mathbf{v}|\cos\theta$$

**Cross Product:**
$$\mathbf{u} \times \mathbf{v} = \begin{bmatrix} u_y v_z - u_z v_y \\ u_z v_x - u_x v_z \\ u_x v_y - u_y v_x \end{bmatrix}$$

$$|\mathbf{u} \times \mathbf{v}| = |\mathbf{u}||\mathbf{v}|\sin\theta$$

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/dot-cross-product-visualizer/main.html"
        height="552px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate introductory linear algebra

### Duration
25-30 minutes

### Prerequisites
- Vector basics (magnitude, direction, components)
- Trigonometry (cosine, sine)
- Basic understanding of perpendicularity

### Learning Activities

1. **Dot Product Exploration (10 min)**:
   - Start with u = (3, 0) and v = (2, 0) (same direction)
   - Rotate v to 90° and observe dot product becomes zero
   - Continue to 180° and see negative dot product
   - Run animation to see the full sweep

2. **Projection Investigation (5 min)**:
   - Observe how the projection length changes with angle
   - Find configurations where projection equals |v|
   - Find configurations where projection is negative

3. **Cross Product Exploration (10 min)**:
   - Switch to 3D view
   - Observe the green cross product vector
   - Rotate view to verify it's perpendicular to both u and v
   - Change vectors and observe parallelogram area changes

4. **Comparison Activity (5 min)**:
   - Toggle between views for the same vectors
   - Compare how dot product and cross product magnitude change with angle

### Discussion Questions

1. Why is the dot product zero when vectors are perpendicular?
2. What does the sign of the dot product tell you about the angle?
3. Why does the cross product only exist in 3D?
4. How can you use dot product to find the angle between two vectors?

### Assessment Ideas

- Given two vectors, predict whether the dot product is positive, negative, or zero
- Calculate the area of a parallelogram using the cross product
- Find a vector perpendicular to two given vectors

## References

1. [3Blue1Brown - Dot products and duality](https://www.youtube.com/watch?v=LyGKycYT2v0)
2. [3Blue1Brown - Cross products](https://www.youtube.com/watch?v=eu6i7WJeinw)
3. [Khan Academy - Cross Product Introduction](https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/dot-cross-products/v/vector-dot-product-and-vector-length)
4. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Chapter 1.2-1.3.
