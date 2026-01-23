---
title: Cosine vs Euclidean Similarity
description: Interactive comparison of cosine similarity and Euclidean distance showing when each metric is appropriate
image: /sims/cosine-euclidean-similarity/cosine-euclidean-similarity.png
---

# Cosine vs Euclidean Similarity

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Cosine vs Euclidean Similarity Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization compares two fundamental ways to measure similarity between vectors:

- **Cosine Similarity**: Measures the angle between vectors, ignoring magnitude
- **Euclidean Distance**: Measures the straight-line distance between vector endpoints

Understanding when to use each metric is crucial in machine learning and NLP applications.

## How to Use

1. **Drag Vectors**: Click and drag the red (A) or blue (B) vector endpoints
2. **Normalize**: Toggle the checkbox to see both vectors normalized to the same length
3. **Presets**: Select from preset configurations to explore specific scenarios
4. **Observe**: Watch how cosine similarity and Euclidean distance change differently

## Key Insights

### Same Direction, Different Magnitude

When vectors point the same way but have different lengths:
- **Cosine similarity = 1** (identical direction)
- **Euclidean distance > 0** (endpoints are apart)

This is why cosine similarity is preferred for comparing documents of different lengths!

### Orthogonal Vectors

When vectors are perpendicular:
- **Cosine similarity = 0** (no alignment)
- **Euclidean distance** varies with magnitudes

### Formulas

**Cosine Similarity:**
$$\text{sim}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{|\mathbf{u}| |\mathbf{v}|} = \cos(\theta)$$

**Euclidean Distance:**
$$d(\mathbf{u}, \mathbf{v}) = \sqrt{\sum_{i=1}^n (u_i - v_i)^2}$$

## When to Use Each

| Metric | Best For | Invariant To |
|--------|----------|--------------|
| Cosine Similarity | Text similarity, embeddings | Vector magnitude |
| Euclidean Distance | Spatial positioning, clustering | Nothing (sensitive to scale) |

## Lesson Plan

**Learning Objectives:**

- Compare and contrast cosine similarity and Euclidean distance
- Understand magnitude invariance of cosine similarity
- Determine which metric is appropriate for different applications

**Activities:**

1. Create vectors with same cosine similarity but different Euclidean distances
2. Find configurations where both metrics agree on similarity
3. Explore the effect of normalizing vectors on both metrics

**Assessment:**

- Why is cosine similarity preferred for comparing word embeddings?
- When would Euclidean distance be more appropriate than cosine similarity?

## References

- [Chapter 11: Generative AI and LLMs](../../chapters/11-generative-ai-and-llms/index.md)
- [Cosine Similarity on Wikipedia](https://en.wikipedia.org/wiki/Cosine_similarity)
