# Session Log: Chapter 1 MicroSims Creation

**Date:** 2026-01-17
**Task:** Create MicroSims for Chapter 1 - Vectors and Vector Spaces
**Duration:** Single session
**Model:** Claude Opus 4.5

## Overview

Created 7 interactive MicroSims to accompany Chapter 1 of the Linear Algebra intelligent textbook. Each MicroSim was specified in the chapter's `<details>` blocks and implemented using the microsim-generator skill.

## MicroSims Created

### 1. 2D and 3D Vector Visualization
- **Location:** `docs/sims/vector-2d-3d-visualizer/`
- **Technology:** p5.js with WEBGL
- **Bloom Level:** Understand (L2)
- **Learning Objective:** Students will interpret vectors geometrically by visualizing how component values determine position and direction in 2D and 3D coordinate systems.
- **Features:**
  - Toggle between 2D and 3D views
  - X, Y, Z component sliders (-5 to 5)
  - Show/hide projection lines
  - Show/hide component labels
  - 3D mouse-drag rotation
  - Real-time magnitude calculation

### 2. Vector Operations Playground
- **Location:** `docs/sims/vector-operations-playground/`
- **Technology:** p5.js
- **Bloom Level:** Apply (L3)
- **Learning Objective:** Students will apply vector addition, subtraction, and scalar multiplication by manipulating vectors interactively.
- **Features:**
  - Draggable vector endpoints for u and v
  - Radio buttons: Add, Subtract, Scalar Multiply
  - Scalar slider (-3 to 3)
  - Parallelogram visualization for addition
  - Component breakdown display
  - Animation button
  - Real-time result calculation

### 3. Dot Product and Cross Product Visualizer
- **Location:** `docs/sims/dot-cross-product-visualizer/`
- **Technology:** p5.js with WEBGL
- **Bloom Level:** Analyze (L4)
- **Learning Objective:** Students will analyze the geometric relationship between dot product (projection and angle) and cross product (perpendicular vector and area).
- **Features:**
  - Toggle between dot product (2D) and cross product (3D) views
  - Draggable vector endpoints
  - Projection visualization
  - Angle arc display with θ label
  - Parallelogram area for cross product
  - Step-by-step formula display
  - Angle sweep animation

### 4. Norm Comparison Visualizer
- **Location:** `docs/sims/norm-comparison-visualizer/`
- **Technology:** p5.js
- **Bloom Level:** Analyze (L4)
- **Learning Objective:** Students will compare and contrast L1, L2, and L-infinity norms by observing unit circles and distance measurements.
- **Features:**
  - Draggable point to select vector
  - L1 (diamond), L2 (circle), L∞ (square) unit shapes
  - Toggle visibility of each norm
  - Radius slider to scale shapes
  - Real-time norm value display
  - Boundary detection indicators

### 5. Linear Combination Explorer
- **Location:** `docs/sims/linear-combination-explorer/`
- **Technology:** p5.js
- **Bloom Level:** Apply (L3)
- **Learning Objective:** Students will apply their understanding of linear combinations by adjusting scalar coefficients to reach target points.
- **Features:**
  - c₁ and c₂ coefficient sliders (-3 to 3)
  - Draggable basis vector endpoints
  - Span visualization (shaded region)
  - Tip-to-tail component arrows
  - Challenge mode with target points
  - Show Solution button
  - Parallel vector warning

### 6. Basis and Coordinate System Visualizer
- **Location:** `docs/sims/basis-coordinate-visualizer/`
- **Technology:** p5.js
- **Bloom Level:** Understand (L2)
- **Learning Objective:** Students will interpret how the same point has different coordinate representations in different bases.
- **Features:**
  - Side-by-side panels (standard vs custom basis)
  - Draggable vector (synced in both panels)
  - Draggable custom basis vectors b₁, b₂
  - Preset buttons: Standard, Rotated 45°, Skewed, Stretched
  - Grid deformation visualization
  - Real-time coordinate transformation
  - Projection lines to basis directions

### 7. Vector Space Axiom Explorer
- **Location:** `docs/sims/vector-space-axiom-explorer/`
- **Technology:** HTML/CSS/JavaScript (infographic)
- **Bloom Level:** Remember (L1)
- **Learning Objective:** Students will identify and recognize the ten vector space axioms through an interactive concept map.
- **Features:**
  - Central hub with vector space definition
  - Two branches: Addition (5 axioms) and Scalar Multiplication (5 axioms)
  - Click to expand axiom cards
  - Full definition and concrete examples
  - Progress tracker (viewed axioms counter)
  - Checkmarks for viewed axioms
  - Hover tooltips

## Files Created

For each MicroSim:
- `main.html` - Main HTML file with library imports
- `[name].js` - JavaScript implementation (for p5.js sims)
- `index.md` - Documentation with:
  - YAML frontmatter (title, description, quality_score: 85, image paths)
  - Iframe embed
  - Fullscreen button
  - Copy-paste iframe example
  - How to Use section
  - Key Concepts Demonstrated
  - Lesson Plan (grade level, duration, prerequisites, activities, discussion questions, assessment)
  - References
- `metadata.json` - Dublin Core metadata

## Navigation Updates

Updated `mkdocs.yml` to include all new MicroSims in the navigation:

```yaml
- MicroSims:
  - Graph Viewer: sims/graph-viewer/index.md
  - 2D and 3D Vector Visualization: sims/vector-2d-3d-visualizer/index.md
  - Vector Operations Playground: sims/vector-operations-playground/index.md
  - Dot Product and Cross Product Visualizer: sims/dot-cross-product-visualizer/index.md
  - Norm Comparison Visualizer: sims/norm-comparison-visualizer/index.md
  - Linear Combination Explorer: sims/linear-combination-explorer/index.md
  - Basis and Coordinate System Visualizer: sims/basis-coordinate-visualizer/index.md
  - Vector Space Axiom Explorer: sims/vector-space-axiom-explorer/index.md
```

## Technical Notes

1. **WEBGL Mode**: Used for 3D visualizations (vector-2d-3d-visualizer, dot-cross-product-visualizer)
2. **Responsive Design**: All MicroSims use `updateCanvasSize()` to adapt to container width
3. **Drag Interaction**: Implemented with `mousePressed()`, `mouseDragged()`, `mouseReleased()` functions
4. **Grid Snapping**: Most draggable elements snap to 0.25 or 0.5 unit increments
5. **Quality Score**: All MicroSims assigned quality_score: 85 (meets standardization requirements)

## Recommendations for Follow-up

1. **Screenshots**: Create `.png` images for each MicroSim for social media previews
2. **Testing**: Run `mkdocs serve` to test all MicroSims locally
3. **p5.js Editor Links**: Upload sketches to p5.js editor and add links
4. **Deployment**: Run `mkdocs gh-deploy` to publish

## Concepts Covered by MicroSims

The 7 MicroSims cover the following concepts from Chapter 1:

| Concept | MicroSim |
|---------|----------|
| Scalar, Vector, Vector Notation | Vector 2D/3D Visualizer |
| 2D Vector, 3D Vector, N-Dimensional Vector | Vector 2D/3D Visualizer |
| Vector Addition, Scalar Multiplication, Vector Subtraction | Vector Operations Playground |
| Dot Product, Cross Product | Dot/Cross Product Visualizer |
| Vector Magnitude, Unit Vector, Vector Normalization | Vector 2D/3D Visualizer |
| L1 Norm, L2 Norm, L-Infinity Norm, Euclidean Distance | Norm Comparison Visualizer |
| Linear Combination, Span | Linear Combination Explorer |
| Linear Independence, Linear Dependence | Linear Combination Explorer |
| Basis Vector, Standard Basis, Coordinate System | Basis Coordinate Visualizer |
| Vector Space, Dimension of Space | Vector Space Axiom Explorer |

## Session Statistics

- **Total files created:** 28 (4 per MicroSim × 7 MicroSims)
- **Total lines of JavaScript:** ~2,500
- **Documentation pages:** 7 index.md files with lesson plans
- **Metadata files:** 7 metadata.json files
