---
title: Condition Number Visualizer
description: Visualize how condition number affects the sensitivity of linear system solutions to perturbations
image: /sims/condition-number/condition-number.png
---

# Condition Number and Sensitivity Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Condition Number Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates how the **condition number** affects the sensitivity of linear system solutions. When solving Ax = b:

- **Well-conditioned** (κ ≈ 1): Small changes in b cause small changes in x
- **Ill-conditioned** (κ large): Small changes in b cause large changes in x

## Key Concepts

The condition number κ(A) = σ₁/σ₂ bounds how much errors amplify:

$$\frac{\|\delta \mathbf{x}\|}{\|\mathbf{x}\|} \leq \kappa(A) \cdot \frac{\|\delta \mathbf{b}\|}{\|\mathbf{b}\|}$$

## Visual Elements

- **Two lines**: Represent the two equations in the 2×2 system
- **Green point**: The solution x
- **Orange cloud**: Perturbed solutions when b is slightly changed
- **Bar chart**: Shows relative sizes of σ₁ and σ₂

## How to Use

1. **Select a preset** to see different conditioning levels
2. **Adjust ε** to control perturbation magnitude
3. **Toggle perturbations** to show/hide the solution cloud
4. **Observe** how the cloud grows with condition number

## Presets

| Preset | κ | Lines | Behavior |
|--------|---|-------|----------|
| Well-conditioned | ~1 | Perpendicular | Stable |
| Moderate | ~10 | Angled | Some spread |
| Ill-conditioned | ~1000 | Nearly parallel | Large spread |
| Nearly Singular | ~∞ | Almost same | Unstable |

## Learning Objectives

After using this MicroSim, students will be able to:

- Interpret condition number geometrically
- Predict solution sensitivity from κ
- Recognize ill-conditioned systems visually
- Connect singular values to conditioning

## References

- Chapter 7: Matrix Decompositions - Condition Number section
- Numerical stability in scientific computing
