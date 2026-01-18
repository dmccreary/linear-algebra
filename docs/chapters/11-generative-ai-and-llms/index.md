---
title: Generative AI and Large Language Models
description: The linear algebra foundations of transformers, attention mechanisms, and modern generative AI
generated_by: claude skill chapter-content-generator
date: 2026-01-17 17:00:00
version: 0.03
---

# Generative AI and Large Language Models

## Summary

Modern generative AI systems rely heavily on sophisticated linear algebra. This chapter explores the mathematical foundations of transformers and large language models, including embedding spaces, attention mechanisms, query-key-value matrices, and multi-head attention. You will also learn about LoRA for efficient fine-tuning and latent space interpolation in generative models.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Embedding
2. Embedding Space
3. Word Embedding
4. Semantic Similarity
5. Cosine Similarity
6. Attention Mechanism
7. Self-Attention
8. Cross-Attention
9. Query Matrix
10. Key Matrix
11. Value Matrix
12. Attention Score
13. Attention Weights
14. Multi-Head Attention
15. Transformer Architecture
16. Position Encoding
17. LoRA
18. Latent Space
19. Interpolation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 7: Matrix Decompositions](../07-matrix-decompositions/index.md) (for low-rank approximation)
- [Chapter 9: Machine Learning Foundations](../09-machine-learning-foundations/index.md)
- [Chapter 10: Neural Networks and Deep Learning](../10-neural-networks-and-deep-learning/index.md)

---

## Introduction

Large language models like GPT and Claude have transformed artificial intelligence, demonstrating remarkable capabilities in understanding and generating human language. At their core, these models are sophisticated linear algebra engines—they represent words as vectors, compute relationships through matrix operations, and generate output by manipulating high-dimensional spaces.

This chapter reveals the mathematical machinery behind modern generative AI:

- **Embeddings** map discrete tokens to continuous vector spaces
- **Attention mechanisms** compute dynamic, context-dependent relationships
- **Transformers** stack these operations to build powerful models
- **Low-rank adaptation** enables efficient fine-tuning

Understanding these foundations demystifies AI systems and enables you to reason about their capabilities and limitations.

## Embeddings: From Symbols to Vectors

Natural language consists of discrete symbols—words, characters, or subword tokens. Neural networks require continuous numerical input. **Embeddings** bridge this gap.

### What Is an Embedding?

An **embedding** is a learned mapping from discrete items to continuous vectors:

$e: \{1, 2, \ldots, V\} \to \mathbb{R}^d$

where:

- $V$ is the vocabulary size (e.g., 50,000 tokens)
- $d$ is the embedding dimension (e.g., 768, 1024, or 4096)

In practice, embeddings are stored as an **embedding matrix** $E \in \mathbb{R}^{V \times d}$:

$\mathbf{e}_i = E[i, :] \quad \text{(row } i \text{ of } E \text{)}$

### Embedding Space

The **embedding space** is the $d$-dimensional vector space where embeddings live. This space has remarkable properties:

- Similar items are mapped to nearby points
- Relationships are encoded as directions
- Arithmetic operations have semantic meaning

The famous Word2Vec example: $\text{king} - \text{man} + \text{woman} \approx \text{queen}$

This works because the embedding space encodes the "royalty" and "gender" concepts as roughly orthogonal directions.

### Word Embeddings

**Word embeddings** specifically represent words (or subword tokens) as vectors. They are learned from large text corpora by predicting context:

- **Word2Vec:** Predict surrounding words from center word (or vice versa)
- **GloVe:** Factorize word co-occurrence matrix
- **Transformer embeddings:** Learned end-to-end with the model

| Method | Approach | Context |
|--------|----------|---------|
| Word2Vec (Skip-gram) | Predict context from word | Fixed window |
| Word2Vec (CBOW) | Predict word from context | Fixed window |
| GloVe | Matrix factorization | Global co-occurrence |
| BERT/GPT | End-to-end transformer | Full sequence |

#### Diagram: Embedding Space Visualizer

<details markdown="1">
<summary>Embedding Space Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize how words are positioned in embedding space and explore semantic relationships

Visual elements:
- 2D projection (t-SNE or PCA) of word embeddings
- Clusters of related words (colors, animals, countries)
- Vector arithmetic visualization
- Distance/similarity measurements

Interactive controls:
- Word search to highlight specific embeddings
- "Find Similar" to show nearest neighbors
- Vector arithmetic input: word1 - word2 + word3 = ?
- Projection method selector (PCA, t-SNE)
- Zoom and pan controls

Default parameters:
- Pre-computed embeddings for 1000 common words
- 2D PCA projection
- Sample clusters highlighted
- Canvas: responsive

Behavior:
- Hover to see word labels
- Click word to show nearest neighbors
- Enter vector arithmetic to see result
- Animate projection computation
- Show similarity scores

Implementation: p5.js with pre-computed embedding data
</details>

## Measuring Similarity

How do we determine if two embeddings represent similar concepts?

### Semantic Similarity

**Semantic similarity** measures how related two concepts are in meaning. In embedding space, semantic similarity corresponds to geometric proximity.

Two approaches:

1. **Euclidean distance:** $d(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|_2$
2. **Cosine similarity:** $\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$

### Cosine Similarity

**Cosine similarity** measures the angle between vectors, ignoring magnitude:

$\text{sim}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u}^T\mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2} = \frac{\sum_{i=1}^d u_i v_i}{\sqrt{\sum_{i=1}^d u_i^2} \sqrt{\sum_{i=1}^d v_i^2}}$

Properties:

- Range: $[-1, 1]$
- $+1$: identical direction (most similar)
- $0$: orthogonal (unrelated)
- $-1$: opposite direction (most dissimilar)

Why cosine over Euclidean?

- Invariant to vector magnitude (important for variable-length documents)
- Efficient computation in high dimensions
- More robust to the "curse of dimensionality"

For normalized embeddings ($\|\mathbf{u}\| = \|\mathbf{v}\| = 1$):

$\text{cosine}(\mathbf{u}, \mathbf{v}) = \mathbf{u}^T\mathbf{v}$

This is just the dot product—extremely fast to compute.

#### Diagram: Similarity Comparison

<details markdown="1">
<summary>Cosine vs Euclidean Similarity</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Compare cosine and Euclidean similarity measures and understand when each is appropriate

Visual elements:
- 2D plane with origin
- Two adjustable vectors (draggable endpoints)
- Angle arc between vectors
- Distance line between endpoints
- Similarity scores displayed

Interactive controls:
- Drag vector endpoints
- "Normalize Vectors" toggle
- Show cosine similarity value
- Show Euclidean distance value
- Preset examples: same direction different magnitude, orthogonal, similar angle

Default parameters:
- Two vectors in 2D
- Both similarity measures shown
- Canvas: responsive

Behavior:
- Real-time similarity updates
- Show how cosine ignores magnitude
- Demonstrate normalization effect
- Highlight angle vs distance
- Show formulas with current values

Implementation: p5.js with vector geometry
</details>

## The Attention Mechanism

**Attention** is the key innovation enabling transformers to model long-range dependencies. Rather than processing sequences left-to-right, attention allows every position to directly interact with every other position.

### Core Idea

Given a sequence of vectors, attention computes a weighted combination where the weights depend on the content of the vectors themselves. This is "content-based" addressing—the model decides what to focus on based on what it's looking at.

### Self-Attention

**Self-attention** computes attention within a single sequence. Each position attends to all positions in the same sequence (including itself):

For input sequence $X = [\mathbf{x}_1, \ldots, \mathbf{x}_n]^T \in \mathbb{R}^{n \times d}$:

1. Each position queries: "What should I pay attention to?"
2. Each position offers keys: "Here's what I contain"
3. Each position provides values: "Here's my information"

### Cross-Attention

**Cross-attention** computes attention between two different sequences:

- Queries come from one sequence (e.g., decoder)
- Keys and values come from another sequence (e.g., encoder)

This enables:

- Machine translation (attend to source while generating target)
- Image captioning (attend to image regions while generating text)
- Question answering (attend to context while generating answer)

| Attention Type | Queries From | Keys/Values From | Use Case |
|----------------|--------------|------------------|----------|
| Self-attention | Sequence X | Sequence X | Language modeling |
| Cross-attention | Sequence Y | Sequence X | Translation, QA |
| Masked self-attention | Sequence X | Past positions of X | Autoregressive generation |

## Query, Key, Value Matrices

The attention mechanism is implemented using three learned linear projections.

### The QKV Framework

For input $X \in \mathbb{R}^{n \times d_{model}}$:

**Query Matrix:**

$Q = XW^Q$

where $W^Q \in \mathbb{R}^{d_{model} \times d_k}$

**Key Matrix:**

$K = XW^K$

where $W^K \in \mathbb{R}^{d_{model} \times d_k}$

**Value Matrix:**

$V = XW^V$

where $W^V \in \mathbb{R}^{d_{model} \times d_v}$

Resulting shapes:

- $Q \in \mathbb{R}^{n \times d_k}$ — one query per position
- $K \in \mathbb{R}^{n \times d_k}$ — one key per position
- $V \in \mathbb{R}^{n \times d_v}$ — one value per position

### Intuition

Think of attention as a soft dictionary lookup:

- **Query:** "I'm looking for information about X"
- **Keys:** "I contain information about Y"
- **Values:** "Here's my actual content"

The query-key dot product measures compatibility. High compatibility means "this key matches my query," so that value should contribute more to my output.

### Attention Scores

**Attention scores** measure query-key compatibility:

$S = QK^T \in \mathbb{R}^{n \times n}$

where:

- $S_{ij} = \mathbf{q}_i^T \mathbf{k}_j$ is the score between position $i$'s query and position $j$'s key
- Higher score means stronger relevance

The scores are scaled to prevent softmax saturation:

$S_{scaled} = \frac{QK^T}{\sqrt{d_k}}$

The $\sqrt{d_k}$ factor keeps the variance of dot products manageable as dimension increases.

### Attention Weights

**Attention weights** are normalized scores (probabilities):

$A = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)$

where softmax is applied row-wise:

$A_{ij} = \frac{\exp(S_{ij})}{\sum_{k=1}^n \exp(S_{ik})}$

Properties:

- Each row sums to 1: $\sum_j A_{ij} = 1$
- All entries non-negative: $A_{ij} \geq 0$
- Represents a probability distribution over positions

### Complete Attention Formula

The attention output combines values weighted by attention:

$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$

Output shape: $n \times d_v$ — one output vector per position.

#### Diagram: Attention Mechanism Visualizer

<details markdown="1">
<summary>Attention Mechanism Step-by-Step</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how attention computes weighted combinations through QKV projections

Visual elements:
- Input sequence (tokens with embeddings)
- Q, K, V projection matrices
- Attention score matrix (heatmap)
- Softmax attention weights
- Output vectors as weighted sums

Interactive controls:
- Input sequence editor (3-5 tokens)
- Step-through: "Project Q", "Project K", "Project V", "Compute Scores", "Softmax", "Weighted Sum"
- Query position selector (which position to visualize)
- "Show All Attention Heads" toggle
- Matrix dimension display

Default parameters:
- 4-token sequence
- d_model = 8, d_k = d_v = 4
- Single attention head
- Canvas: responsive

Behavior:
- Animate each projection step
- Show attention score computation
- Visualize softmax normalization
- Demonstrate weighted sum of values
- Highlight which positions attend to which

Implementation: p5.js with matrix visualization
</details>

## Multi-Head Attention

**Multi-head attention** runs multiple attention operations in parallel, each learning different relationship patterns.

### Why Multiple Heads?

A single attention head might focus on one type of relationship (e.g., syntactic). Multiple heads can capture diverse patterns:

- Head 1: Subject-verb agreement
- Head 2: Coreference (pronouns to antecedents)
- Head 3: Positional patterns
- Head 4: Semantic similarity

### Multi-Head Computation

For $h$ attention heads:

$\text{head}_i = \text{Attention}(XW_i^Q, XW_i^K, XW_i^V)$

where each head has its own projection matrices.

Heads are concatenated and projected:

$\text{MultiHead}(X) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)W^O$

where $W^O \in \mathbb{R}^{hd_v \times d_{model}}$ is the output projection.

### Dimension Management

Typical configuration (e.g., $d_{model} = 512$, $h = 8$):

- $d_k = d_v = d_{model}/h = 64$
- Each head operates on lower dimension
- Total computation similar to single full-dimension head
- But captures richer patterns

| Component | Shape |
|-----------|-------|
| Input $X$ | $n \times d_{model}$ |
| Per-head $W^Q, W^K$ | $d_{model} \times d_k$ |
| Per-head $W^V$ | $d_{model} \times d_v$ |
| Per-head output | $n \times d_v$ |
| Concatenated | $n \times hd_v$ |
| After $W^O$ | $n \times d_{model}$ |

#### Diagram: Multi-Head Attention Visualizer

<details markdown="1">
<summary>Multi-Head Attention Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Understand how multiple attention heads capture different patterns and combine their outputs

Visual elements:
- Parallel attention head diagrams
- Per-head attention weight heatmaps
- Concatenation visualization
- Output projection
- Comparison of what each head attends to

Interactive controls:
- Number of heads slider (1-8)
- Input sequence editor
- Head selector to highlight individual heads
- "Compare Heads" mode
- "Show Learned Patterns" toggle

Default parameters:
- 4 attention heads
- 5-token sequence
- Pre-trained attention patterns
- Canvas: responsive

Behavior:
- Show each head's attention independently
- Visualize concatenation step
- Demonstrate different heads learning different patterns
- Compare head outputs before/after combination
- Display dimension flow through computation

Implementation: p5.js with parallel visualization
</details>

## The Transformer Architecture

The **transformer** stacks attention layers with feedforward networks to build powerful sequence models.

### Transformer Block

A single transformer block contains:

1. **Multi-head self-attention** (with residual connection and layer norm)
2. **Feedforward network** (with residual connection and layer norm)

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

### Residual Connections

Residual connections add the input to the output:

$\text{output} = x + \text{SubLayer}(x)$

Benefits:

- Enable gradient flow through deep networks
- Allow layers to learn "refinements" rather than full transformations
- Stabilize training

### Layer Normalization

Layer norm normalizes across features (not batch):

$\text{LayerNorm}(x) = \gamma \cdot \frac{x - \mu}{\sigma} + \beta$

Applied before or after each sublayer (pre-norm vs post-norm).

### Position Encoding

Self-attention is permutation-invariant—it treats input as a set, not a sequence. **Position encodings** inject positional information.

**Sinusoidal encoding** (original transformer):

$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$

$PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{model}})$

where:

- $pos$ is the position in the sequence
- $i$ is the dimension index

Properties:

- Unique encoding for each position
- Relative positions can be computed from absolute encodings
- Generalizes to longer sequences than seen during training

**Learned position embeddings** (GPT, BERT):

- Add learnable position embedding matrix $P \in \mathbb{R}^{L_{max} \times d_{model}}$
- $\text{input} = \text{token\_embedding} + \text{position\_embedding}$

#### Diagram: Transformer Architecture

<details markdown="1">
<summary>Transformer Block Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize data flow through a transformer block including attention, FFN, residuals, and layer norms

Visual elements:
- Block diagram of transformer layer
- Data tensors at each stage (shape annotations)
- Residual connection paths
- Layer norm visualization
- Stacking multiple blocks

Interactive controls:
- Number of blocks slider (1-6)
- "Step Through" one operation at a time
- "Show Dimensions" toggle
- "Highlight Residuals" toggle
- Input sequence length slider

Default parameters:
- 2 transformer blocks
- Sequence length 4
- d_model = 512, d_ff = 2048
- Canvas: responsive

Behavior:
- Animate data flow through block
- Show dimension changes at each stage
- Visualize residual addition
- Display parameter count per component
- Compare pre-norm vs post-norm

Implementation: p5.js with architecture diagram
</details>

## Efficient Fine-Tuning with LoRA

Training all parameters of large models is expensive. **LoRA (Low-Rank Adaptation)** enables efficient fine-tuning.

### The LoRA Idea

Instead of updating full weight matrices, LoRA adds trainable low-rank decomposition:

$W' = W + \Delta W = W + BA$

where:

- $W \in \mathbb{R}^{d \times k}$ is the frozen pre-trained weight
- $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$ are trainable
- $r \ll \min(d, k)$ is the rank (e.g., 4, 8, 16)

### Parameter Efficiency

For a weight matrix of size $d \times k$:

- Full fine-tuning: $dk$ parameters
- LoRA: $r(d + k)$ parameters

Example: $d = k = 4096$, $r = 8$:

- Full: $16.7M$ parameters per matrix
- LoRA: $65K$ parameters per matrix (0.4%)

### Why Low-Rank Works

The update $\Delta W$ has rank at most $r$. Research suggests that:

- Model adaptation often lies in a low-dimensional subspace
- The "intrinsic dimension" of fine-tuning is much smaller than parameter count
- Low-rank updates capture task-specific modifications

### Implementation

During fine-tuning:

1. Freeze all original parameters $W$
2. Initialize $A$ with small random values, $B$ with zeros
3. Train only $A$ and $B$
4. Forward pass: $h = (W + BA)x = Wx + BAx$

For inference, can merge: $W' = W + BA$ (no added latency).

#### Diagram: LoRA Visualization

<details markdown="1">
<summary>LoRA Low-Rank Adaptation Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how LoRA approximates weight updates with low-rank matrices

Visual elements:
- Original weight matrix W (large, frozen)
- Low-rank factors A and B
- Product BA visualization
- Updated matrix W' = W + BA
- Parameter count comparison

Interactive controls:
- Matrix dimensions d and k sliders
- Rank r slider (1-32)
- "Show Decomposition" toggle
- "Compare to Full Fine-tune" toggle
- Animation of forward pass

Default parameters:
- d = k = 64 (for visualization)
- r = 4
- Canvas: responsive

Behavior:
- Show A and B shapes change with r
- Display parameter savings percentage
- Visualize low-rank approximation quality
- Compare BA to random full-rank update
- Show merged weight option

Implementation: p5.js with matrix visualization
</details>

## Latent Spaces in Generative Models

Generative models learn to map between data and abstract **latent spaces**.

### What Is a Latent Space?

A **latent space** is a compressed, continuous representation where:

- Each point corresponds to a potential data sample
- Similar points produce similar outputs
- The space is typically lower-dimensional than data space

For images:

- Data space: $\mathbb{R}^{H \times W \times 3}$ (millions of pixels)
- Latent space: $\mathbb{R}^{512}$ (compressed representation)

### Structure in Latent Space

Well-trained generative models learn latent spaces with meaningful structure:

- **Clusters:** Similar items group together
- **Directions:** Moving along certain directions changes specific attributes
- **Arithmetic:** Vector operations have semantic meaning

### Interpolation

**Interpolation** generates intermediate points between two latent vectors:

**Linear interpolation:**

$\mathbf{z}(t) = (1-t)\mathbf{z}_1 + t\mathbf{z}_2, \quad t \in [0, 1]$

**Spherical interpolation (slerp):** Better for normalized latent spaces:

$\mathbf{z}(t) = \frac{\sin((1-t)\theta)}{\sin\theta}\mathbf{z}_1 + \frac{\sin(t\theta)}{\sin\theta}\mathbf{z}_2$

where $\theta = \arccos(\mathbf{z}_1 \cdot \mathbf{z}_2)$ for normalized vectors.

### Applications

- **Image morphing:** Smooth transition between faces
- **Style mixing:** Combine attributes of different samples
- **Attribute editing:** Move along discovered directions
- **Data augmentation:** Generate novel training samples

#### Diagram: Latent Space Interpolation

<details markdown="1">
<summary>Latent Space Interpolation Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand latent space structure through interpolation and vector arithmetic

Visual elements:
- 2D latent space projection
- Two endpoint vectors (selectable)
- Interpolation path (linear vs spherical)
- Generated samples along path
- Vector arithmetic demonstration

Interactive controls:
- Select two points in latent space
- Interpolation method: linear vs slerp
- Number of intermediate steps slider
- "Show Path" toggle
- "Try Vector Arithmetic" mode

Default parameters:
- Pre-computed latent points for simple shapes
- Linear interpolation
- 5 intermediate steps
- Canvas: responsive

Behavior:
- Visualize interpolation path
- Show how generated output changes along path
- Compare linear vs spherical interpolation
- Demonstrate attribute manipulation via vector arithmetic
- Show distance metrics along path

Implementation: p5.js with latent space visualization
</details>

## Practical Implementation

Here's a simplified attention implementation:

```python
import numpy as np

def softmax(x, axis=-1):
    """Numerically stable softmax."""
    exp_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return exp_x / np.sum(exp_x, axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Compute scaled dot-product attention.

    Args:
        Q: Queries, shape (n, d_k)
        K: Keys, shape (m, d_k)
        V: Values, shape (m, d_v)
        mask: Optional attention mask

    Returns:
        Attention output, shape (n, d_v)
    """
    d_k = Q.shape[-1]

    # Compute attention scores
    scores = Q @ K.T / np.sqrt(d_k)  # (n, m)

    # Apply mask if provided (for causal attention)
    if mask is not None:
        scores = np.where(mask, scores, -1e9)

    # Softmax to get attention weights
    attention_weights = softmax(scores, axis=-1)  # (n, m)

    # Weighted sum of values
    output = attention_weights @ V  # (n, d_v)

    return output, attention_weights

def multi_head_attention(X, W_Q, W_K, W_V, W_O, num_heads):
    """
    Multi-head attention.

    Args:
        X: Input, shape (n, d_model)
        W_Q, W_K, W_V: Per-head projection weights
        W_O: Output projection weight
        num_heads: Number of attention heads
    """
    n, d_model = X.shape
    d_k = d_model // num_heads

    heads = []
    for h in range(num_heads):
        Q = X @ W_Q[h]
        K = X @ W_K[h]
        V = X @ W_V[h]
        head_output, _ = scaled_dot_product_attention(Q, K, V)
        heads.append(head_output)

    # Concatenate heads
    concat = np.concatenate(heads, axis=-1)

    # Output projection
    output = concat @ W_O

    return output

def cosine_similarity(u, v):
    """Compute cosine similarity between vectors."""
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

def lora_forward(x, W, A, B):
    """Forward pass with LoRA adaptation."""
    # Original path + low-rank update
    return x @ W.T + x @ A.T @ B.T

# Example: Embedding lookup
def embed(token_ids, embedding_matrix):
    """Look up embeddings for token IDs."""
    return embedding_matrix[token_ids]

# Example: Position encoding
def positional_encoding(seq_len, d_model):
    """Generate sinusoidal position encodings."""
    positions = np.arange(seq_len)[:, np.newaxis]
    dims = np.arange(d_model)[np.newaxis, :]

    angles = positions / np.power(10000, (2 * (dims // 2)) / d_model)

    # Apply sin to even, cos to odd
    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(angles[:, 0::2])
    pe[:, 1::2] = np.cos(angles[:, 1::2])

    return pe

# Example usage
seq_len, d_model = 10, 64
X = np.random.randn(seq_len, d_model)

# Add position encoding
pos_enc = positional_encoding(seq_len, d_model)
X_with_pos = X + pos_enc

print(f"Input shape: {X.shape}")
print(f"Position encoding shape: {pos_enc.shape}")
```

## Summary

This chapter explored the linear algebra foundations of modern generative AI:

**Embeddings:**

- **Embeddings** map discrete tokens to continuous vectors
- **Embedding spaces** encode semantic relationships geometrically
- **Cosine similarity** measures semantic relatedness: $\frac{\mathbf{u}^T\mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}$

**Attention Mechanism:**

- **Self-attention** allows each position to attend to all others
- **Query, Key, Value** matrices create content-based addressing
- **Attention scores** $QK^T/\sqrt{d_k}$ measure query-key compatibility
- **Attention weights** are softmax-normalized scores

**Multi-Head and Transformers:**

- **Multi-head attention** captures diverse relationship patterns
- **Transformer blocks** stack attention with feedforward layers
- **Position encodings** inject sequential order information
- **Residual connections** enable deep network training

**Efficient Adaptation:**

- **LoRA** adds low-rank trainable matrices: $W' = W + BA$
- Reduces trainable parameters by 100-1000x

**Latent Spaces:**

- **Latent spaces** provide compressed, continuous representations
- **Interpolation** generates smooth transitions between points
- Vector arithmetic enables semantic manipulation

??? question "Self-Check: Why does attention use $\sqrt{d_k}$ scaling in the score computation?"
    The dot product $QK^T$ produces values with variance proportional to $d_k$ (the key/query dimension). Without scaling, as $d_k$ grows large, the dot products grow large, pushing softmax into regions of extreme gradients (near-zero for most values, near-one for the maximum). Dividing by $\sqrt{d_k}$ normalizes the variance to approximately 1, keeping softmax in a region where gradients flow well and the attention distribution isn't too peaked.
