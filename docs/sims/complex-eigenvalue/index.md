---
title: Complex Eigenvalue Visualizer
description: Visualize how complex eigenvalues λ = a + bi correspond to rotation-scaling transformations in 2D.
image: /sims/complex-eigenvalue/complex-eigenvalue.png
og:image: /sims/complex-eigenvalue/complex-eigenvalue.png
twitter:image: /sims/complex-eigenvalue/complex-eigenvalue.png
social:
   cards: false
---

# Complex Eigenvalue Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Complex Eigenvalue Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

Complex eigenvalues reveal the rotational nature of certain linear transformations. When a real matrix has complex eigenvalues, they always appear in conjugate pairs λ = a ± bi, and the transformation involves both rotation and scaling.

**Key Features:**

- **Dual view**: Transformation plane (left) and complex plane (right)
- **Adjustable eigenvalue**: Sliders for real and imaginary parts
- **Spiral animation**: Watch repeated transformation create spirals
- **Conjugate pair**: Toggle to show both λ and λ̄
- **Behavior indicators**: Shows whether spiral expands, contracts, or circles

## How to Use

1. **Adjust "Re" slider** to change the real part of λ
2. **Adjust "Im" slider** to change the imaginary part
3. **Click "Animate"** to see repeated transformation
4. **Click "Reset"** to start over from (1, 0)
5. **Toggle "Show Conjugate"** to display both eigenvalues

## Geometric Interpretation

For complex eigenvalue λ = a + bi:

| Property | Formula | Meaning |
|----------|---------|---------|
| **Magnitude** | \|λ\| = √(a² + b²) | Scaling factor per step |
| **Angle** | θ = arctan(b/a) | Rotation angle per step |

**Behavior Patterns:**

- **\|λ\| > 1**: Spiral outward (expanding)
- **\|λ\| < 1**: Spiral inward (contracting)
- **\|λ\| = 1**: Pure rotation (circle)
- **Im(λ) = 0**: No rotation (pure scaling)

## Example: Rotation Matrix

The 90° rotation matrix has eigenvalues λ = ±i:
- \|λ\| = 1 → no scaling
- θ = 90° → quarter turn each step

Try setting Re = 0, Im = 1 to see pure rotation!

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/complex-eigenvalue/main.html" height="502px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Connect complex eigenvalues to rotation-scaling transformations
2. Interpret eigenvalue magnitude as scaling factor
3. Interpret eigenvalue argument (angle) as rotation amount
4. Predict trajectory behavior from eigenvalue position in complex plane

### Suggested Activities

1. **Find the circle**: Adjust sliders until \|λ\| = 1 exactly and observe pure rotation
2. **Predict behavior**: Before animating, predict if spiral will expand or contract
3. **Conjugate pairs**: Why do complex eigenvalues of real matrices come in conjugate pairs?
4. **Matrix connection**: For λ = 0.9 + 0.4i, what 2×2 matrix produces this behavior?

### Assessment Questions

1. If λ = 2i, what happens to points under repeated transformation?
2. What eigenvalue produces a 60° rotation with 10% shrinkage per step?
3. Where on the complex plane are eigenvalues of stable systems located?

## References

- [Chapter 6: Eigenvalues and Eigenvectors](../../chapters/06-eigenvalues-and-eigenvectors/index.md)
- [Linear Algebra Learning Graph](../../learning-graph/index.md)
