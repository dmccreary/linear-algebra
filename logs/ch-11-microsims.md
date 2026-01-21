# Chapter 11 MicroSims Generation Log

**Date:** 2026-01-21
**Chapter:** 11 - Generative AI and Large Language Models
**Task:** Generate MicroSims for all diagram specifications

## Summary

Created 7 interactive MicroSims for Chapter 11 covering the core concepts of generative AI and transformer architectures. Each MicroSim was generated using the microsim-generator skill with p5.js implementation.

## MicroSims Created

### 1. Embedding Space Visualizer
- **Path:** `docs/sims/embedding-space-visualizer/`
- **Description:** Interactive 2D visualization of word embeddings showing semantic clusters (colors, animals, countries, numbers, food) with click-to-select and nearest neighbor finding
- **Features:**
  - Zoom and pan controls
  - Word selection and nearest neighbor highlighting
  - Multiple cluster visualization
  - Similarity scores display

### 2. Cosine vs Euclidean Similarity
- **Path:** `docs/sims/cosine-euclidean-similarity/`
- **Description:** Compare cosine similarity and Euclidean distance between two draggable vectors
- **Features:**
  - Draggable vector endpoints
  - Real-time similarity calculations
  - Normalize vectors toggle
  - Preset examples (same direction, orthogonal, etc.)
  - Angle arc and distance line visualization

### 3. Attention Mechanism Step-by-Step
- **Path:** `docs/sims/attention-mechanism/`
- **Description:** Step-through visualization of the attention mechanism showing QKV projections
- **Features:**
  - 5-step walkthrough (Input, Project Q/K/V, Scores, Softmax, Output)
  - Query position selector
  - Attention score and weight heatmaps
  - Animated matrix computations

### 4. Multi-Head Attention Visualizer
- **Path:** `docs/sims/multi-head-attention/`
- **Description:** Shows multiple attention heads capturing different relationship patterns
- **Features:**
  - Adjustable number of heads (1-8)
  - Per-head attention pattern visualization
  - Hover tooltips showing learned pattern types
  - Concatenation view toggle

### 5. Transformer Block Visualizer
- **Path:** `docs/sims/transformer-block/`
- **Description:** Architecture diagram showing data flow through transformer blocks
- **Features:**
  - Adjustable number of blocks (1-6)
  - Residual connection highlighting
  - Dimension annotations
  - Layer norm and FFN visualization
  - Color-coded component legend

### 6. LoRA Low-Rank Adaptation Visualizer
- **Path:** `docs/sims/lora-visualizer/`
- **Description:** Demonstrates low-rank matrix decomposition for efficient fine-tuning
- **Features:**
  - Adjustable rank (1-16)
  - Adjustable matrix dimensions
  - Parameter savings calculation and comparison bars
  - W + BA decomposition visualization
  - Frozen weight indicator

### 7. Latent Space Interpolation Visualizer
- **Path:** `docs/sims/latent-space-interpolation/`
- **Description:** Interactive interpolation between points in latent space
- **Features:**
  - Click to select endpoint shapes
  - Linear vs spherical (SLERP) interpolation methods
  - Adjustable interpolation steps
  - Animated path visualization
  - Shape morphing along interpolation path

## Files Created

For each MicroSim, the following files were created:
- `main.html` - HTML wrapper with p5.js CDN
- `<microsim-name>.js` - p5.js JavaScript implementation
- `index.md` - Documentation with iframe embed, lesson plan, and references

## Chapter Updates

Updated `docs/chapters/11-generative-ai-and-llms/index.md`:
- Added iframe embeds after each `#### Diagram:` header
- Added fullscreen links for each MicroSim
- Preserved original specification in `<details>` blocks

## Navigation Updates

Updated `mkdocs.yml` to add all 7 MicroSims to the navigation:
- Attention Mechanism Step-by-Step
- Cosine vs Euclidean Similarity
- Embedding Space Visualizer
- Latent Space Interpolation
- LoRA Low-Rank Adaptation
- Multi-Head Attention Visualizer
- Transformer Block Visualizer

## Testing

To test locally:
```bash
cd /Users/dan/Documents/ws/linear-algebra
mkdocs serve
```

Then visit:
- http://127.0.0.1:8000/linear-algebra/chapters/11-generative-ai-and-llms/
- http://127.0.0.1:8000/linear-algebra/sims/embedding-space-visualizer/
- http://127.0.0.1:8000/linear-algebra/sims/cosine-euclidean-similarity/
- http://127.0.0.1:8000/linear-algebra/sims/attention-mechanism/
- http://127.0.0.1:8000/linear-algebra/sims/multi-head-attention/
- http://127.0.0.1:8000/linear-algebra/sims/transformer-block/
- http://127.0.0.1:8000/linear-algebra/sims/lora-visualizer/
- http://127.0.0.1:8000/linear-algebra/sims/latent-space-interpolation/

## Notes

- All MicroSims use the standard p5.js MicroSim architecture with separate drawing and control regions
- Width-responsive design for embedding in various contexts
- Each MicroSim includes a lesson plan with learning objectives and assessment questions
- The p5.js code can be pasted directly into the p5.js editor for testing/modification
