---
title: Transformer Block Visualizer
description: Interactive visualization of transformer architecture showing data flow through attention, feedforward networks, residuals, and layer normalization
image: /sims/transformer-block/transformer-block.png
---

# Transformer Block Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Transformer Block Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization shows the architecture of a **transformer** neural network, the foundation of modern large language models like GPT and BERT.

Each transformer block contains:

1. **Layer Normalization** - Stabilizes training
2. **Multi-Head Attention** - Models relationships between positions
3. **Feed Forward Network** - Applies position-wise transformations
4. **Residual Connections** - Enable gradient flow through deep networks

## How to Use

1. **Number of Blocks**: Adjust to see 1-6 stacked transformer blocks
2. **Show Dimensions**: Toggle to see tensor shapes at each stage
3. **Highlight Residuals**: Toggle to emphasize residual connection paths

## Key Concepts

### Residual Connections

Residual connections add the input directly to the output:

$$\text{output} = x + \text{SubLayer}(x)$$

Benefits:
- Enable gradient flow through very deep networks
- Allow layers to learn "refinements" rather than complete transformations
- Stabilize training

### Layer Normalization

Normalizes across features (not batch):

$$\text{LayerNorm}(x) = \gamma \cdot \frac{x - \mu}{\sigma} + \beta$$

### Transformer Block Structure

```
Input x
    │
    ├──────────────────┐
    ▼                  │
LayerNorm              │
    │                  │
MultiHeadAttn          │
    │                  │
    ▼                  │
    + ◄────────────────┘  (residual)
    │
    ├──────────────────┐
    ▼                  │
LayerNorm              │
    │                  │
FeedForward            │
    │                  │
    ▼                  │
    + ◄────────────────┘  (residual)
    │
Output
```

## Lesson Plan

**Learning Objectives:**

- Understand the structure of a transformer block
- Explain the role of residual connections
- Trace data flow through stacked transformer layers

**Activities:**

1. Count total operations per block and multiply by block count
2. Explain why residual connections help with deep networks
3. Compare pre-norm vs post-norm architectures (this shows pre-norm)

**Assessment:**

- What would happen without residual connections in a 12-layer model?
- Why use layer norm instead of batch norm in transformers?
- How do dimensions change (or not change) through a transformer block?

## References

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Original transformer paper
- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/)
- [The Annotated Transformer](https://nlp.seas.harvard.edu/2018/04/03/attention.html)
