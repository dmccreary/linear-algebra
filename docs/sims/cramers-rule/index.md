---
title: Cramer's Rule Interactive Solver
description: Step-by-step visualization of solving systems of equations using Cramer's Rule with determinants.
image: /sims/cramers-rule/cramers-rule.png
og:image: /sims/cramers-rule/cramers-rule.png
twitter:image: /sims/cramers-rule/cramers-rule.png
social:
   cards: false
---

# Cramer's Rule Interactive Solver

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Cramer's Rule Solver Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **Cramer's Rule**, a method for solving systems of linear equations using determinants.

**For a 2×2 system $A\mathbf{x} = \mathbf{b}$:**

$$x = \frac{\det(A_1)}{\det(A)} \quad \text{and} \quad y = \frac{\det(A_2)}{\det(A)}$$

Where:

- $A_1$ = matrix $A$ with column 1 replaced by $\mathbf{b}$
- $A_2$ = matrix $A$ with column 2 replaced by $\mathbf{b}$

## How to Use

1. **Step through**: Click "Step" to see each determinant computed
2. **Auto-play**: Click "Play" to animate through all steps
3. **Try examples**: Random (non-singular) or Singular system
4. **Watch the geometry**: See the intersection of two lines

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/cramers-rule/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Apply Cramer's Rule to solve 2×2 systems
2. Recognize when Cramer's Rule fails (det(A) = 0)
3. Connect algebraic solution to geometric intersection

### Suggested Activities

1. **Verify solutions**: Substitute the solution back into original equations
2. **Compare methods**: Solve the same system using Gaussian elimination
3. **Singular case**: What does it mean geometrically when det(A) = 0?

### Assessment Questions

1. Use Cramer's Rule to solve: 3x + 2y = 8, x - y = 1
2. When would you prefer Gaussian elimination over Cramer's Rule?
3. If det(A) = 0 and the system has infinitely many solutions, what's the geometric interpretation?

## References

- Chapter 5: Determinants and Matrix Properties - Cramer's Rule section
- [Linear Algebra Learning Graph](/learning-graph/)
