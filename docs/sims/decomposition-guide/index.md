---
title: Matrix Decomposition Selection Guide
description: Interactive decision tree for choosing the right matrix decomposition based on your problem
image: /sims/decomposition-guide/decomposition-guide.png
---

# Matrix Decomposition Selection Guide

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Selection Guide Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This interactive decision tree helps you choose the **right matrix decomposition** for your problem. Click on blue decision nodes to explore different paths, and green nodes show the recommended decomposition with reasoning.

## Decision Summary

| Goal | Matrix Type | Recommended |
|------|-------------|-------------|
| Solve Ax=b | Symmetric positive definite | **Cholesky** |
| Solve Ax=b | Square, invertible | **LU with pivoting** |
| Solve Ax=b | Rectangular | **QR** or **SVD** |
| Least squares | Any overdetermined | **QR** |
| Low-rank approx | Any | **Truncated SVD** |
| Eigenvalues needed | Any | **SVD** |

## How to Use

1. **Start** at the top "Start" node
2. **Click** on blue question nodes to explore paths
3. **Read** the green answer nodes for recommendations
4. **Hover** over nodes to see explanations

## Learning Objectives

After using this MicroSim, students will be able to:

- Match problems to appropriate decompositions
- Understand why certain decompositions are preferred
- Navigate the decision tree efficiently
- Justify decomposition choices

## Quick Reference

### When to Use Each Decomposition

| Decomposition | Best For | Complexity |
|---------------|----------|------------|
| **Cholesky** | SPD systems, fastest | O(n³/3) |
| **LU** | Square systems, multiple b's | O(2n³/3) |
| **QR** | Least squares, rectangular | O(2mn²) |
| **SVD** | Low-rank, rank analysis | O(mn²) |

## References

- Chapter 7: Matrix Decompositions - Choosing the Right Decomposition
