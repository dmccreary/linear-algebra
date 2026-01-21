---
title: LoRA Low-Rank Adaptation Visualizer
description: Interactive visualization of LoRA showing how low-rank matrices enable parameter-efficient fine-tuning of large models
image: /sims/lora-visualizer/lora-visualizer.png
---

# LoRA Low-Rank Adaptation Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the LoRA Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **LoRA (Low-Rank Adaptation)**, a technique for efficiently fine-tuning large language models by training only a small number of additional parameters.

Instead of updating the full weight matrix $W$, LoRA adds a low-rank decomposition:

$$W' = W + \Delta W = W + BA$$

where:
- $W$ is **frozen** (not trained)
- $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$ are **trainable**
- $r \ll \min(d, k)$ is the rank (typically 4, 8, or 16)

## How to Use

1. **Rank Slider**: Adjust the LoRA rank (1-16) to see parameter savings
2. **Dimension Slider**: Change matrix size to see scaling behavior
3. **Observe**: Watch how parameter count changes with rank

## Key Insights

### Parameter Efficiency

For a $d \times k$ weight matrix:

| Method | Parameters |
|--------|-----------|
| Full fine-tuning | $d \times k$ |
| LoRA (rank $r$) | $r(d + k)$ |

**Example**: With $d = k = 4096$ and $r = 8$:
- Full: 16.7M parameters per matrix
- LoRA: 65K parameters (0.4%)

### Why Low-Rank Works

Research suggests that model adaptation often lies in a **low-dimensional subspace**. The "intrinsic dimension" of fine-tuning is much smaller than the total parameter count.

### LoRA Benefits

1. **Memory efficient**: Train only 0.1-1% of original parameters
2. **No inference latency**: Can merge $W' = W + BA$ after training
3. **Modular**: Swap different LoRA adapters for different tasks
4. **Stable**: Original model weights remain frozen

## Lesson Plan

**Learning Objectives:**

- Understand why low-rank approximations enable efficient fine-tuning
- Calculate parameter savings for different rank values
- Explain the LoRA forward pass: $h = Wx + BAx$

**Activities:**

1. Find the rank that achieves 99% parameter savings for a 1024×1024 matrix
2. Compare parameter counts for different model sizes
3. Discuss when LoRA might not work well (what if task requires full-rank updates?)

**Assessment:**

- Why is $B$ initialized to zeros and $A$ to small random values?
- How does LoRA compare to other efficient fine-tuning methods?
- What's the computational overhead during training vs inference?

## References

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) - Original paper
- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/)
- [Hugging Face PEFT Library](https://huggingface.co/docs/peft)
