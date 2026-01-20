---
title: Numerical Stability Demonstration
description: Explore how ill-conditioned systems amplify small input errors into large solution changes
image: /sims/numerical-stability/numerical-stability.png
---
# Numerical Stability Demonstration

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Numerical Stability MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

When solving systems of linear equations on a computer, small errors in the input can sometimes cause large errors in the output. This phenomenon is governed by the **condition number** of the matrix.

**Key Insight**: The condition number tells you how much errors can be amplified:

$$\frac{\text{relative error in output}}{\text{relative error in input}} \leq \kappa(A)$$

## Condition Number Interpretation

| Condition Number | Interpretation |
|-----------------|----------------|
| κ ≈ 1 | Well-conditioned, stable |
| κ ≈ 10-100 | Moderate sensitivity |
| κ ≈ 10³-10⁶ | Ill-conditioned, significant error amplification |
| κ → ∞ | Singular or near-singular |

## Why Does This Matter?

In real-world computations:

1. **Floating-point arithmetic** introduces small rounding errors
2. **Measurement errors** in input data are inevitable
3. **Ill-conditioned systems** amplify these small errors
4. **Solutions may be meaningless** if errors are too large

## Geometric Interpretation

For 2D systems, the condition number relates to the angle between the lines:

- **Nearly perpendicular lines** → Well-conditioned (intersection is stable)
- **Nearly parallel lines** → Ill-conditioned (small changes move intersection far)

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Explain what the condition number measures
2. Identify well-conditioned vs ill-conditioned systems
3. Predict when solutions will be sensitive to perturbations
4. Understand why numerical stability matters in practice

### Suggested Activities

1. **Compare Examples**: Switch between presets and observe how error magnification differs
2. **Adjust Perturbation**: Use the slider to see how error scales with input perturbation
3. **Hilbert Matrix**: Explore why Hilbert matrices are notoriously ill-conditioned
4. **Geometric Connection**: For 2D cases, observe how nearly-parallel lines cause instability
