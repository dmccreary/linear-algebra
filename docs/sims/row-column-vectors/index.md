---
title: Row and Column Vectors
description: Interactive visualization comparing row vectors (horizontal, 1×n) and column vectors (vertical, m×1) to help students understand how orientation affects matrix operations.
image: /sims/row-column-vectors/row-column-vectors.png
og:image: /sims/row-column-vectors/row-column-vectors.png
twitter:image: /sims/row-column-vectors/row-column-vectors.png
quality_score: 85
social:
   cards: false
---

# Row and Column Vectors

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Row and Column Vectors MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/row-column-vectors/main.html" height="482px" scrolling="no"></iframe>
```

## Description

This MicroSim provides a side-by-side comparison of row vectors and column vectors, the two fundamental vector orientations in linear algebra. Understanding the distinction between these vector types is essential for matrix operations, as the orientation determines how vectors interact with matrices during multiplication.

**Key Features:**

- **Visual Comparison**: Row vectors are displayed horizontally (1×n), while column vectors are displayed vertically (m×1)
- **Color Coding**: Blue for row vectors, green for column vectors helps reinforce the distinction
- **Dynamic Dimensions**: Adjust the number of elements (2-6) to see how both vector types scale
- **Dimension Annotations**: Toggle display of dimension labels (1×n and m×1) to reinforce notation

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Visually distinguish between row vectors and column vectors
2. Correctly identify the dimensions of row vectors (1×n) and column vectors (m×1)
3. Understand that the same values can be arranged as either a row or column vector
4. Recognize how vector orientation affects matrix compatibility in multiplication

### Warm-up Activity (2 minutes)

Ask students: "If I have 4 numbers, how many different ways can I arrange them in a rectangle?" Let them discover that a 1×4 row and 4×1 column are two valid arrangements.

### Guided Exploration (5 minutes)

1. Start with the default 4 elements
2. Point out that both vectors contain the same number of values
3. Toggle the dimension annotations to show 1×4 for the row and 4×1 for the column
4. Click "Randomize" several times to show that values change but structure remains

### Key Discussion Points

- **Notation**: Row vectors are written horizontally: $[r_1, r_2, r_3, r_4]$
- **Transpose Relationship**: A row vector transposed becomes a column vector
- **Matrix Multiplication**: A row vector (1×n) can multiply a column vector (n×1) to produce a scalar (dot product)

### Assessment Questions

1. What are the dimensions of a row vector with 5 elements?
2. If you transpose a 1×6 row vector, what are the resulting dimensions?
3. Can you multiply a 1×3 row vector by a 3×1 column vector? What is the result's dimension?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Row and column vectors in context
- [Linear Algebra and Its Applications](https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006185) - Lay, Lay, and McDonald
