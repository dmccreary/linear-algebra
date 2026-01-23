---
title: Attention Mechanism Step-by-Step
description: Interactive visualization showing how transformer attention computes weighted combinations through QKV projections
image: /sims/attention-mechanism/attention-mechanism.png
---

# Attention Mechanism Step-by-Step

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Attention Mechanism Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This step-by-step visualization demonstrates how the **attention mechanism** works in transformers. Walk through each stage of the computation:

1. **Input**: Token embeddings as vectors
2. **Project Q,K,V**: Linear projections create Query, Key, Value matrices
3. **Compute Scores**: Query-Key dot products measure compatibility
4. **Softmax**: Normalize scores to attention weights (probabilities)
5. **Weighted Sum**: Combine Value vectors using attention weights

## How to Use

1. **Step Slider**: Move through the 5 stages of attention computation
2. **Query Position**: Select which token's attention to visualize
3. **Observe**: Watch how attention weights determine which positions to focus on

## Key Concepts

### The Attention Formula

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### Query-Key-Value Intuition

- **Query**: "What am I looking for?"
- **Key**: "What do I contain?"
- **Value**: "What's my actual content?"

High query-key compatibility means that value contributes more to the output.

### Softmax Normalization

Attention weights in each row sum to 1, creating a probability distribution over positions:

$$A_{ij} = \frac{\exp(S_{ij})}{\sum_k \exp(S_{ik})}$$

## Lesson Plan

**Learning Objectives:**

- Understand the role of Query, Key, and Value matrices
- Trace the flow of information through attention computation
- Interpret attention weights as a soft addressing mechanism

**Activities:**

1. Step through all 5 stages and describe what happens at each
2. Change the query position and observe how attention patterns change
3. Identify which tokens attend most strongly to each other

**Assessment:**

- Why do we scale by √d_k in the score computation?
- What does a uniform attention distribution (all weights equal) mean?
- How would masking affect the attention computation?

## References

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Original transformer paper
- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/index.md)
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
