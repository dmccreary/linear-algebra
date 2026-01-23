---
title: Embedding Space Visualizer
description: Interactive visualization of word embeddings showing how words are positioned in 2D space with semantic clusters
image: /sims/embedding-space-visualizer/embedding-space-visualizer.png
---

# Embedding Space Visualizer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Embedding Space Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how words are represented as vectors in an **embedding space**. In real language models like Word2Vec, GloVe, or transformer embeddings, words with similar meanings cluster together in high-dimensional space.

This simplified 2D visualization shows:

- **Word Clusters**: Words from similar categories (colors, animals, countries, numbers, food) naturally group together
- **Semantic Relationships**: Click on any word and use "Find Similar" to see its nearest neighbors
- **Vector Space Structure**: The coordinate system shows how embeddings map discrete words to continuous vectors

## How to Use

1. **Pan**: Click and drag on empty space to move around the embedding space
2. **Zoom**: Use the slider or mouse wheel to zoom in/out
3. **Select Word**: Click on any word point to select it
4. **Find Neighbors**: With a word selected, click "Find Similar" to highlight the 5 nearest words
5. **Show Labels**: Toggle the checkbox to display all word labels

## Key Concepts

### Embeddings

An **embedding** maps discrete tokens (like words) to continuous vectors:

$$e: \{1, 2, \ldots, V\} \to \mathbb{R}^d$$

### Semantic Similarity

Words with similar meanings have vectors that are close in the embedding space. This proximity can be measured using:

- **Euclidean distance**: $d(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|_2$
- **Cosine similarity**: $\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$

## Lesson Plan

**Learning Objectives:**

- Understand how words are represented as vectors in embedding space
- Observe how semantic relationships manifest as geometric proximity
- Explore the concept of word clusters and nearest neighbors

**Activities:**

1. Identify which word clusters are most distinct from each other
2. Find a word whose nearest neighbors come from different categories
3. Discuss why certain words might be positioned between clusters

**Assessment:**

- Can students explain why similar words cluster together?
- Can students predict which words will be nearest neighbors?

## References

- [Word2Vec Paper](https://arxiv.org/abs/1301.3781) - Original word embedding method
- [GloVe: Global Vectors](https://nlp.stanford.edu/projects/glove/) - Stanford NLP word vectors
- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/index.md)
