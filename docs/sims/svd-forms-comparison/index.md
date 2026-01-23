---
title: SVD Forms Comparison
description: Visual comparison of Full, Compact, and Truncated SVD showing matrix dimensions and storage requirements
image: /sims/svd-forms-comparison/svd-forms-comparison.png
---

# SVD Forms Comparison

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the SVD Forms Comparison Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This infographic compares the three main forms of the **Singular Value Decomposition**:

1. **Full SVD**: Complete decomposition with all singular vectors
2. **Compact SVD**: Only keeps non-zero singular values
3. **Truncated SVD**: Keeps only the top k singular values

## SVD Forms Summary

| Form | Matrices | Exact? | Use Case |
|------|----------|--------|----------|
| Full | U(m×m), Σ(m×n), Vᵀ(n×n) | Yes | Complete subspace analysis |
| Compact | U(m×r), Σ(r×r), Vᵀ(r×n) | Yes | Efficient exact storage |
| Truncated | U(m×k), Σ(k×k), Vᵀ(k×n) | No | Low-rank approximation |

## Visual Legend

- **Blue blocks**: Kept components (contain information)
- **Gray blocks**: Discarded components (zeros or truncated)
- **Light gray**: Structural zeros

## How to Use

1. **Adjust m and n** to change matrix dimensions
2. **Set rank r** to see how many singular values are non-zero
3. **Set k** to control truncation level
4. **Compare storage** requirements between forms

## Learning Objectives

After using this MicroSim, students will be able to:

- Distinguish between Full, Compact, and Truncated SVD
- Calculate storage requirements for each form
- Choose the appropriate SVD form for a given application
- Understand the tradeoff between accuracy and storage

## References

- Chapter 7: Matrix Decompositions - SVD section
- NumPy documentation: `np.linalg.svd(full_matrices=False)`
- scikit-learn: `TruncatedSVD`
