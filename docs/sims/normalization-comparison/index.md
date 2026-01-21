---
title: Normalization Comparison
description: Visual comparison of batch normalization and layer normalization showing which tensor dimensions each technique normalizes.
image: /sims/normalization-comparison/normalization-comparison.png
og:image: /sims/normalization-comparison/normalization-comparison.png
twitter:image: /sims/normalization-comparison/normalization-comparison.png
social:
   cards: false
---
# Normalization Comparison

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Normalization Comparison Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization clarifies the difference between batch normalization and layer normalization by showing exactly which dimensions of a tensor each technique normalizes over.

### Batch Normalization

Normalizes **across the batch dimension** for each channel:

$\hat{x} = \frac{x - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}$

where $\mu_B$ and $\sigma_B^2$ are computed over all samples in the batch, but separately for each channel.

### Layer Normalization

Normalizes **across the feature dimension** for each sample:

$\hat{x} = \frac{x - \mu_L}{\sqrt{\sigma_L^2 + \epsilon}}$

where $\mu_L$ and $\sigma_L^2$ are computed over all features in a single sample.

### Key Differences

| Aspect | Batch Norm | Layer Norm |
|--------|------------|------------|
| Normalizes | Per channel | Per sample |
| Batch dependency | Yes | No |
| Train/Test | Different | Same |
| Best for | CNNs, large batches | Transformers, RNNs |
| Batch size 1 | Problems | Works fine |

### Interactive Features

- **View Selector**: Compare both techniques or focus on one
- **Animated Highlight**: Shows which cells are normalized together
- **Properties Panel**: Details about each technique

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Distinguish which tensor dimensions batch norm and layer norm operate over
2. Explain why batch normalization needs different behavior during training vs inference
3. Choose the appropriate normalization for different architectures
4. Describe the role of learnable parameters γ and β

### Suggested Activities

1. **Dimension Tracing**: For a tensor of shape (B, C, H, W), identify which values batch norm averages together
2. **Architecture Matching**: Why do transformers prefer layer norm while CNNs use batch norm?
3. **Small Batch Problem**: What happens to batch norm statistics with batch size 1?
4. **Running Statistics**: Why does batch norm track running mean/variance during training?

### Discussion Questions

1. Why can't batch normalization be used effectively with batch size 1?
2. How do the learnable parameters γ and β help after normalization?
3. Why is layer normalization independent of batch size?
4. When might you use instance normalization or group normalization?

## References

- Ioffe & Szegedy (2015). Batch Normalization: Accelerating Deep Network Training
- Ba, Kiros & Hinton (2016). Layer Normalization
- Wu & He (2018). Group Normalization
