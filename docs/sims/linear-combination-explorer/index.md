---
title: Linear Combination Explorer
description: Interactive visualization of linear combinations with adjustable coefficients, target challenges, and span visualization.
image: /sims/linear-combination-explorer/linear-combination-explorer.png
og:image: /sims/linear-combination-explorer/linear-combination-explorer.png
twitter:image: /sims/linear-combination-explorer/linear-combination-explorer.png
quality_score: 85
social:
   cards: false
---

# Linear Combination Explorer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Linear Combination Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This visualization helps students understand linear combinations by allowing them to adjust scalar coefficients and observe how the result vector changes. The challenge mode tests students' ability to find the right coefficients to reach a target point.

**Learning Objective:** Students will apply their understanding of linear combinations by adjusting scalar coefficients to reach target points and observe how span is generated.

## How to Use

1. **Adjust Coefficients**: Use the c₁ and c₂ sliders to change the scalar multipliers
2. **Drag Basis Vectors**: Click and drag the endpoints of v₁ (red) and v₂ (blue) to change their directions
3. **Observe the Result**: The green arrow shows c₁v₁ + c₂v₂
4. **See Tip-to-Tail**: Enable "Show Components" to see how the scaled vectors add tip-to-tail
5. **Challenge Mode**: Click "New Challenge" to get a target point (yellow star), then find the coefficients to reach it
6. **Get Help**: Click "Show Solution" to see the answer

## Key Concepts Demonstrated

### Linear Combination
$$c_1\mathbf{v}_1 + c_2\mathbf{v}_2$$

A linear combination is a sum of scalar multiples of vectors. Any vector in the plane can be written as a linear combination of two non-parallel vectors.

### Span
The span of vectors is the set of all possible linear combinations. For two non-parallel vectors in 2D, the span is the entire plane.

### Parallel Vectors
When v₁ and v₂ are parallel (one is a scalar multiple of the other), their span collapses to a line. The visualization shows this with a warning.

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/linear-combination-explorer/main.html"
        height="552px"
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
- Vector addition and scalar multiplication
- Basic understanding of coordinate systems

### Learning Activities

1. **Exploration (5 min)**:
   - Set c₁ = 1, c₂ = 0 and observe: result equals v₁
   - Set c₁ = 0, c₂ = 1 and observe: result equals v₂
   - Set c₁ = 1, c₂ = 1 and observe: tip-to-tail addition

2. **Coefficient Investigation (5 min)**:
   - What happens when c₁ = -1?
   - Find coefficients that put the result at (0, 0)
   - Make the result point in the opposite direction of v₁

3. **Challenge Mode (10 min)**:
   - Click "New Challenge" to get a target
   - Try to reach the target by adjusting only c₁ and c₂
   - Record how many attempts it takes
   - After solving, verify by checking the math

4. **Span Investigation (5 min)**:
   - Drag v₂ to be parallel to v₁
   - Notice the "span is a line" warning
   - Try to reach targets outside the line - impossible!

### Discussion Questions

1. Why can any point in the plane be reached with two non-parallel vectors?
2. What happens to the span when the vectors become parallel?
3. Is the linear combination c₁v₁ + c₂v₂ the same as c₂v₂ + c₁v₁?
4. How would you find the coefficients algebraically?

### Assessment Ideas

- Given a target point, calculate the coefficients by solving a system of equations
- Explain why two parallel vectors only span a line
- Predict whether a given point is reachable with given basis vectors

## References

1. [3Blue1Brown - Linear combinations, span, and basis vectors](https://www.youtube.com/watch?v=k7RM-ot2NWY) - Excellent visual introduction
2. [Khan Academy - Linear Combinations and Span](https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/linear-combinations/v/linear-combinations-and-span)
3. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Chapter 1.3.
4. Lay, D. C. (2015). *Linear Algebra and Its Applications* (5th ed.). Section 1.3.
