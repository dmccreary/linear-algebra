---
title: Linear Transformation Fundamentals Visualizer
description: Interactive visualization showing how linear transformations preserve grid structure and are determined by where basis vectors map.
image: /sims/linear-transform-basics/linear-transform-basics.png
og:image: /sims/linear-transform-basics/linear-transform-basics.png
twitter:image: /sims/linear-transform-basics/linear-transform-basics.png
social:
   cards: false
---

# Linear Transformation Fundamentals Visualizer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Linear Transformation Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization demonstrates the fundamental concepts of linear transformations:

1. **Basis vectors determine everything**: The transformation is completely defined by where the standard basis vectors e₁ = (1,0) and e₂ = (0,1) map to
2. **Grid structure is preserved**: Linear transformations map parallel lines to parallel lines (or points)
3. **The matrix columns are the transformed basis vectors**: The transformation matrix A has columns T(e₁) and T(e₂)

## How to Use

- **Drag the handle points** on T(e₁) and T(e₂) in the transformed space to define any linear transformation
- **Use the Morph slider** to animate between the identity transformation and your current transformation
- **Select presets** from the dropdown to see common transformations (rotation, scaling, shear, reflection)
- **Toggle checkboxes** to show/hide the grid and sample vector

## Embedding

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/linear-transform-basics/main.html" height="482px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

By using this simulation, students will be able to:

1. Explain how the columns of a transformation matrix relate to the images of basis vectors
2. Predict how a linear transformation will affect arbitrary vectors based on its matrix
3. Identify common transformations (rotation, scaling, shear, reflection) by their matrix form

### Suggested Activities

1. **Discovery**: Start with identity, then drag T(e₁) and T(e₂) to see how the grid deforms
2. **Prediction**: Given a transformation matrix, predict where a sample vector will map before checking
3. **Recognition**: Use presets to learn the characteristic matrix patterns for rotation, scaling, shear, and reflection

### Assessment Questions

1. If T(e₁) = (2, 0) and T(e₂) = (0, 2), what type of transformation is this?
2. What matrix represents a 90° counterclockwise rotation?
3. Why does a shear transformation preserve area but not angles?

## References

- Chapter 4: Linear Transformations in Applied Linear Algebra for AI and Machine Learning
- [3Blue1Brown: Linear transformations and matrices](https://www.3blue1brown.com/lessons/linear-transformations)
