---
title: Tensor Operations
description: Interactive visualization of common tensor operations including reshape, transpose, flatten, squeeze, and unsqueeze.
image: /sims/tensor-operations/tensor-operations.png
og:image: /sims/tensor-operations/tensor-operations.png
twitter:image: /sims/tensor-operations/tensor-operations.png
social:
   cards: false
---
# Tensor Operations

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Tensor Operations Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization helps you understand how tensor shapes transform under common operations. Tensors are the fundamental data structures in deep learning, and manipulating their shapes is a crucial skill.

### Operations Covered

| Operation | Description | Example |
|-----------|-------------|---------|
| **Reshape** | Changes shape, preserves elements | (2,3,4) → (6,4) |
| **Transpose** | Permutes axes | (2,3,4) → (2,4,3) |
| **Flatten** | Collapses to 1D | (2,3,4) → (24,) |
| **Squeeze** | Removes size-1 dims | (1,3,1) → (3,) |
| **Unsqueeze** | Adds size-1 dim | (3,4) → (1,3,4) |

### Key Principle

**Total elements must be preserved** in reshape operations:

$\prod_i \text{input\_dim}_i = \prod_j \text{output\_dim}_j$

For a (2,3,4) tensor: $2 \times 3 \times 4 = 24$ elements

### Interactive Features

- **Dimension Sliders**: Adjust input tensor dimensions
- **Operation Selector**: Choose which transformation to apply
- **Apply Button**: Animate the transformation
- **Shape Annotations**: See input and output shapes with element counts

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Predict output tensor shapes for common operations
2. Verify that element counts are preserved in reshapes
3. Choose the appropriate operation for a given shape transformation
4. Debug shape mismatch errors in neural network code

### Suggested Activities

1. **Reshape Chain**: Starting from (2,3,4), reshape to (6,4), then (24,), then back to (2,3,4)
2. **Transpose Exploration**: What happens when you transpose twice?
3. **Squeeze/Unsqueeze**: Create a tensor (1,5,1,3), squeeze it, then unsqueeze back
4. **Invalid Reshape**: Try to reshape (2,3,4) to (5,5). Why does it fail?

### Discussion Questions

1. Why might you need to flatten a tensor before a fully-connected layer?
2. When would you use unsqueeze vs reshape to add a dimension?
3. How does transpose relate to matrix transpose from linear algebra?
4. What does "contiguous" mean for tensors after transpose?

## Common Patterns in Deep Learning

```python
# Batch dimension: (batch, features) → (batch, 1, features)
x.unsqueeze(1)

# Flatten for FC layer: (batch, C, H, W) → (batch, C*H*W)
x.flatten(start_dim=1)

# Swap height/width: (B, C, H, W) → (B, C, W, H)
x.transpose(2, 3)
```

## References

- PyTorch Documentation: Tensor Views and Reshaping
- NumPy Documentation: Array Manipulation Routines
