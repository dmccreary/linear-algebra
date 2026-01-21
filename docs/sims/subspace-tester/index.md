---
title: Subspace Tester
description: Interactive visualization to test whether sets are subspaces by checking closure under linear combinations.
image: /sims/subspace-tester/subspace-tester.png
og:image: /sims/subspace-tester/subspace-tester.png
twitter:image: /sims/subspace-tester/subspace-tester.png
quality_score: 85
social:
   cards: false
---

# Subspace Tester

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Subspace Tester Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Subspace Tester with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization helps students understand what makes a set a subspace by testing the closure property. Students can select different sets, drag test vectors within those sets, and observe whether linear combinations stay within the set.

**Learning Objective:** Test whether sets are subspaces by checking closure under linear combinations.

## How to Use

1. **Select a Set**: Use the dropdown to choose different sets (line through origin, line not through origin, first quadrant, circle, or entire plane)
2. **Drag Test Vectors**: Click and drag the endpoints of vectors **u** (red) and **v** (blue). Vectors are constrained to stay within the selected set
3. **Adjust Scalars**: Use the c and d sliders to change the scalar multipliers for the linear combination cu + dv
4. **Observe the Result**: The result vector is shown in green if it stays in the set, or orange if it leaves the set
5. **Check Subspace**: Click "Check if Subspace" to see an explanation of why the set is or is not a subspace

## Key Concepts Demonstrated

### Subspace Definition

A subset H of a vector space V is a **subspace** if:

1. **Zero vector**: The zero vector is in H
2. **Closure under addition**: For all **u**, **v** in H, **u** + **v** is in H
3. **Closure under scalar multiplication**: For all **u** in H and scalar c, c**u** is in H

Equivalently, H is a subspace if it is closed under **linear combinations**: for all **u**, **v** in H and scalars c, d, the vector c**u** + d**v** is also in H.

### Examples Explored

| Set | Is Subspace? | Reason |
|-----|--------------|--------|
| Line through origin | Yes | Contains zero, closed under linear combinations |
| Line NOT through origin | No | Does not contain zero vector |
| First quadrant | No | Not closed under scalar multiplication (try c = -1) |
| Circle | No | Does not contain zero, not closed under addition |
| Entire plane R^2 | Yes | The whole space is always a subspace |

### Finding Counter-Examples

For non-subspaces, try these strategies to find counter-examples:

- **Line not through origin**: Set c = 0, d = 0 to see that (0, 0) is not on the line
- **First quadrant**: Set c = -1, d = 0 to see that -**u** has negative components
- **Circle**: Set c = 1, d = 1 to see that **u** + **v** is not on the circle

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/subspace-tester/main.html"
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
- Vector addition and scalar multiplication
- Linear combinations
- Basic set theory concepts

### Learning Activities

1. **Exploration with a True Subspace (5 min)**:
   - Select "Line through origin (y = 2x)"
   - Drag vectors **u** and **v** along the line
   - Adjust c and d sliders and observe that cu + dv always stays on the line
   - Click "Check if Subspace" to confirm

2. **Finding Counter-Examples (10 min)**:
   - Select "Line not through origin (y = 2x + 1)"
   - Note that vectors can exist on this line
   - Set c = 0, d = 0. Where is the origin relative to the line?
   - Explain why this fails the subspace test

3. **First Quadrant Investigation (5 min)**:
   - Select "First quadrant"
   - Place **u** at (1, 2)
   - Set c = -1, d = 0. Where does the result end up?
   - Discuss: even though (1, 2) is in the first quadrant, (-1, -2) is not

4. **Circle Failure (5 min)**:
   - Select "Circle"
   - Place **u** at (2, 0) and **v** at (0, 2)
   - With c = 1, d = 1, where is **u** + **v**?
   - Verify it's not on the circle

### Discussion Questions

1. Why must every subspace contain the zero vector?
2. If a set is closed under addition, is it necessarily closed under scalar multiplication?
3. Can you think of a set that contains zero but is not a subspace?
4. What is the smallest possible subspace of R^2?

### Assessment Ideas

- Given a description of a set, predict whether it's a subspace
- For non-subspaces, provide specific counter-examples
- Prove that the intersection of two subspaces is also a subspace

## Mathematical Background

### The Subspace Test

To verify H is a subspace, we can use the **combined test**: H is a subspace if and only if for all **u**, **v** in H and all scalars c, d:

$$c\mathbf{u} + d\mathbf{v} \in H$$

This single condition implies all three properties (zero, addition closure, scalar multiplication closure).

### Why Lines Through Origin Are Subspaces

A line through the origin can be written as:

$$L = \{t\mathbf{v} : t \in \mathbb{R}\}$$

for some direction vector **v**. For any $t_1\mathbf{v}$ and $t_2\mathbf{v}$ in L:

$$c(t_1\mathbf{v}) + d(t_2\mathbf{v}) = (ct_1 + dt_2)\mathbf{v} \in L$$

### Why the First Quadrant Fails

The first quadrant Q = {(x, y) : x >= 0, y >= 0} contains (1, 1). However:

$$(-1) \cdot (1, 1) = (-1, -1) \notin Q$$

So Q is not closed under scalar multiplication.

## References

1. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Chapter 3.1 - Spaces of Vectors.
2. Lay, D. C. (2015). *Linear Algebra and Its Applications* (5th ed.). Section 4.1 - Vector Spaces and Subspaces.
3. [3Blue1Brown - Span and Subspaces](https://www.youtube.com/watch?v=k7RM-ot2NWY) - Visual introduction to subspaces.
4. [Khan Academy - Subspaces](https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/subspace-basis/v/linear-subspaces)
