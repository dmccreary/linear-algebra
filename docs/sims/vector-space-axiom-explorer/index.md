---
title: Vector Space Axiom Explorer
description: Interactive infographic for exploring the ten vector space axioms with hover definitions and concrete examples.
image: /sims/vector-space-axiom-explorer/vector-space-axiom-explorer.png
og:image: /sims/vector-space-axiom-explorer/vector-space-axiom-explorer.png
twitter:image: /sims/vector-space-axiom-explorer/vector-space-axiom-explorer.png
quality_score: 85
social:
   cards: false
---

# Vector Space Axiom Explorer

<iframe src="main.html" height="750px" width="100%" scrolling="no"></iframe>

[Run the Vector Space Axiom Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

## About This Infographic

This interactive infographic helps students learn and remember the ten vector space axioms. The axioms are organized into two groups: five for vector addition and five for scalar multiplication. Click on each axiom card to see its definition and a concrete example.

**Learning Objective:** Students will identify and recognize the ten vector space axioms through an interactive concept map with hover definitions and example demonstrations.

## How to Use

1. **Hover over the central hub** to see what a vector space is and examples of vector spaces and fields
2. **Click on axiom cards** to expand and see:
   - Full definition of the axiom
   - A concrete numerical example in R²
3. **Track your progress** with the counter at the bottom showing how many axioms you've viewed
4. A checkmark appears on viewed axioms

## The Ten Vector Space Axioms

For a set V to be a vector space over a field F, it must satisfy:

### Addition Axioms (1-5)
1. **Closure**: u + v ∈ V
2. **Commutativity**: u + v = v + u
3. **Associativity**: (u + v) + w = u + (v + w)
4. **Identity**: v + 0 = v
5. **Inverse**: v + (-v) = 0

### Scalar Multiplication Axioms (6-10)
6. **Closure**: cv ∈ V
7. **Distributivity (vectors)**: c(u + v) = cu + cv
8. **Distributivity (scalars)**: (c + d)v = cv + dv
9. **Associativity**: c(dv) = (cd)v
10. **Identity**: 1·v = v

## Why These Axioms Matter

These ten axioms are the foundation of linear algebra. Any set that satisfies all ten axioms is a vector space, which means all theorems about vector spaces apply to it. This includes:

- **R^n** (n-dimensional real space)
- **Polynomials** of degree ≤ n
- **Matrices** of a given size
- **Continuous functions** on an interval
- **Solutions** to homogeneous differential equations

## Embedding This Infographic

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/vector-space-axiom-explorer/main.html"
        height="750px"
        width="100%"
        scrolling="no">
</iframe>
```

## Lesson Plan

### Grade Level
Undergraduate introductory linear algebra

### Duration
15-20 minutes

### Prerequisites
- Vector addition and scalar multiplication concepts
- Familiarity with R² as an example vector space

### Learning Activities

1. **Introduction (3 min)**:
   - Hover over the central hub to understand what a vector space is
   - Note the two types of operations: addition and scalar multiplication

2. **Addition Axioms (5 min)**:
   - Click through all five addition axioms
   - Work through each example mentally or on paper
   - Note how they formalize intuitive properties

3. **Scalar Multiplication Axioms (5 min)**:
   - Click through all five scalar multiplication axioms
   - Compare distributivity axioms 7 and 8
   - Understand why the identity axiom uses 1

4. **Verification Exercise (5 min)**:
   - Given a candidate vector space (e.g., 2×2 matrices)
   - Check that all ten axioms hold

### Discussion Questions

1. Why do we need all ten axioms? What would go wrong if one was missing?
2. Can you think of a set with addition that violates one of these axioms?
3. Why is the additive identity (zero vector) unique?
4. What's the difference between the two distributivity axioms?

### Assessment Ideas

- List all ten axioms from memory
- Given a set and operations, verify which axioms hold
- Explain why a given set is NOT a vector space

## References

1. [3Blue1Brown - Abstract vector spaces](https://www.youtube.com/watch?v=TgKwz5Ikpc8)
2. [Khan Academy - Vector Spaces](https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/abstract-vector-spaces/v/abstract-vector-space)
3. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Section 3.1.
4. Axler, S. (2015). *Linear Algebra Done Right* (3rd ed.). Chapter 1.
