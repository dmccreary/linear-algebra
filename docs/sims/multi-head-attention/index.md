---
title: Multi-Head Attention Visualizer
description: Interactive visualization showing how multiple attention heads capture different relationship patterns and combine their outputs
image: /sims/multi-head-attention/multi-head-attention.png
---

# Multi-Head Attention Visualizer

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Multi-Head Attention Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how **multi-head attention** captures diverse relationship patterns by running multiple attention operations in parallel.

Each attention head can learn to focus on different types of relationships:

- **Position proximity**: Nearby tokens attend to each other
- **Semantic similarity**: Words with similar meanings connect
- **Syntactic structure**: Subject-verb, modifier-noun relationships
- **Long-range dependencies**: Connections across the sequence

## How to Use

1. **Number of Heads**: Adjust the slider to see 1-8 attention heads
2. **Hover**: Move over any head to see what pattern type it has learned
3. **Show Concatenation**: Toggle to see how head outputs combine

## Key Concepts

### Why Multiple Heads?

A single attention head might focus on only one type of relationship. Multiple heads allow the model to:

- Capture syntactic AND semantic relationships
- Attend to both local and global context
- Learn diverse, complementary patterns

### The Multi-Head Formula

$$\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)W^O$$

where each head is:

$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

### Dimension Management

With $d_{model} = 512$ and $h = 8$ heads:

- Each head uses $d_k = d_v = d_{model}/h = 64$
- Total computation is similar to single full-dimension head
- But captures 8× richer patterns

## Lesson Plan

**Learning Objectives:**

- Understand why multiple attention heads improve model expressiveness
- Visualize how different heads learn different patterns
- Trace the concatenation and projection flow

**Activities:**

1. Compare attention patterns across all 8 heads
2. Identify which heads capture local vs. global patterns
3. Explain why the output projection (W_O) is necessary

**Assessment:**

- Why not just use one head with larger dimension?
- How does head count affect model capacity vs. computation?
- What would happen if all heads learned the same pattern?

## References

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Original transformer paper
- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/index.md)
- [BertViz: Attention Head Visualization](https://github.com/jessevig/bertviz)
