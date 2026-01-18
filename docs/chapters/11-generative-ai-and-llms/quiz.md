# Quiz: Generative AI and Large Language Models

Test your understanding of embeddings, attention mechanisms, and transformer architecture.

---

#### 1. An embedding maps:

<div class="upper-alpha" markdown>
1. Continuous values to discrete tokens
2. Discrete tokens to continuous vectors
3. Images to text
4. Gradients to weights
</div>

??? question "Show Answer"
    The correct answer is **B**. An embedding maps discrete items (like words or tokens) to continuous vector representations. This enables neural networks to process symbolic data like text.

    **Concept Tested:** Embedding

---

#### 2. Cosine similarity between two vectors measures:

<div class="upper-alpha" markdown>
1. Their Euclidean distance
2. The angle between them (ignoring magnitude)
3. Their element-wise product sum
4. The difference in their norms
</div>

??? question "Show Answer"
    The correct answer is **B**. Cosine similarity measures the cosine of the angle between vectors: $\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}$. It ranges from -1 to 1 and ignores vector magnitudes.

    **Concept Tested:** Cosine Similarity

---

#### 3. In attention mechanisms, the query-key dot product determines:

<div class="upper-alpha" markdown>
1. The size of the output
2. How much each position attends to other positions
3. The number of attention heads
4. The embedding dimension
</div>

??? question "Show Answer"
    The correct answer is **B**. The query-key dot product computes attention scores that determine how much each position should focus on other positions. Higher scores mean stronger attention.

    **Concept Tested:** Attention Score

---

#### 4. The scaling factor $\sqrt{d_k}$ in attention is used to:

<div class="upper-alpha" markdown>
1. Increase the attention weights
2. Prevent softmax saturation from large dot products
3. Reduce the number of parameters
4. Speed up training
</div>

??? question "Show Answer"
    The correct answer is **B**. Dividing by $\sqrt{d_k}$ prevents the dot products from becoming too large as dimension increases, which would push softmax into regions with very small gradients.

    **Concept Tested:** Scaled Dot-Product Attention

---

#### 5. Multi-head attention:

<div class="upper-alpha" markdown>
1. Uses only one attention computation
2. Runs multiple attention operations in parallel to capture different patterns
3. Eliminates the need for queries and keys
4. Replaces the transformer architecture
</div>

??? question "Show Answer"
    The correct answer is **B**. Multi-head attention runs several attention computations in parallel, each potentially learning different relationship patterns (syntactic, semantic, positional, etc.), then combines their outputs.

    **Concept Tested:** Multi-Head Attention

---

#### 6. Self-attention allows each position to:

<div class="upper-alpha" markdown>
1. Only attend to itself
2. Attend to all positions in the same sequence
3. Only attend to previous positions
4. Ignore all other positions
</div>

??? question "Show Answer"
    The correct answer is **B**. Self-attention allows each position in a sequence to attend to all other positions (including itself), enabling direct modeling of long-range dependencies.

    **Concept Tested:** Self-Attention

---

#### 7. Position encoding in transformers provides:

<div class="upper-alpha" markdown>
1. Word meaning information
2. Sequence order information since attention is permutation-invariant
3. Grammar rules
4. Vocabulary size
</div>

??? question "Show Answer"
    The correct answer is **B**. Since self-attention treats input as a set (permutation-invariant), position encodings inject information about the order of tokens in the sequence.

    **Concept Tested:** Position Encoding

---

#### 8. LoRA (Low-Rank Adaptation) reduces fine-tuning cost by:

<div class="upper-alpha" markdown>
1. Removing all attention layers
2. Adding trainable low-rank matrices instead of updating full weights
3. Using smaller vocabulary
4. Eliminating position encodings
</div>

??? question "Show Answer"
    The correct answer is **B**. LoRA keeps original weights frozen and adds small, trainable low-rank matrices ($A$ and $B$) such that $W' = W + BA$. This dramatically reduces the number of trainable parameters.

    **Concept Tested:** LoRA

---

#### 9. In a latent space, similar items typically:

<div class="upper-alpha" markdown>
1. Have very different vector representations
2. Are mapped to nearby points
3. Have zero cosine similarity
4. Require different embedding dimensions
</div>

??? question "Show Answer"
    The correct answer is **B**. A well-trained latent space maps semantically similar items to nearby points. This structure enables meaningful interpolation and arithmetic operations.

    **Concept Tested:** Latent Space

---

#### 10. The Value matrix in attention provides:

<div class="upper-alpha" markdown>
1. The content to be aggregated based on attention weights
2. The query for matching
3. The key for compatibility
4. The position information
</div>

??? question "Show Answer"
    The correct answer is **A**. The Value matrix contains the actual information to be retrieved. Attention weights (from Query-Key matching) determine how to combine Values to produce the output.

    **Concept Tested:** Value Matrix
