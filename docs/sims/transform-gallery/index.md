---
title: Geometric Transformations Interactive Gallery
description: Compare and contrast rotation, scaling, shear, and reflection transformations with interactive controls and live matrix display.
image: /sims/transform-gallery/transform-gallery.png
og:image: /sims/transform-gallery/transform-gallery.png
twitter:image: /sims/transform-gallery/transform-gallery.png
social:
   cards: false
---

# Geometric Transformations Interactive Gallery

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Transform Gallery Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This gallery allows you to compare and contrast the four fundamental geometric transformations:

| Transformation | Preserves | Determinant | Invertible |
|---------------|-----------|-------------|------------|
| **Rotation** | Lengths, angles, area | 1 | Always |
| **Scaling** | Angles (if uniform) | sx × sy | If no zero scale |
| **Shear** | Area, parallel lines | 1 | Always |
| **Reflection** | Lengths, angles | -1 | Always |

## How to Use

1. **Select a transformation type** using the buttons (Rotation, Scaling, Shear, Reflection)
2. **Adjust parameters** with the sliders to see how the transformation changes
3. **Change the shape** to see how different geometries are affected
4. **Toggle the grid** to see how the entire space deforms
5. **Click Animate** to see smooth transitions from identity to the transformation

## Key Observations

- **Rotation**: The only transformation that preserves both lengths and angles
- **Scaling**: Changes area by |sx × sy|; negative values also reflect
- **Shear**: Turns rectangles into parallelograms while preserving area
- **Reflection**: Flips orientation (determinant = -1)

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/transform-gallery/main.html" height="522px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Identify transformation type from its matrix structure
2. Predict how transformations affect area (using determinant)
3. Compare properties preserved by different transformations

### Suggested Activities

1. **Classification**: Given a matrix, identify which transformation type it represents
2. **Prediction**: Before applying a transformation, predict the resulting shape
3. **Composition**: What happens when you combine shear followed by rotation?

### Discussion Questions

1. Why does shear preserve area but not angles?
2. When is a scaling transformation equivalent to a rotation?
3. How can you tell if a matrix represents an invertible transformation?

## References

- Chapter 4: Linear Transformations
- [Essence of Linear Algebra - 3Blue1Brown](https://www.3blue1brown.com/topics/linear-algebra)
