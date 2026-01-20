# Chapter 4 MicroSims Generation Log

**Date:** 2026-01-20
**Chapter:** 04 - Linear Transformations
**Task:** Generate MicroSims for all #### Diagram: headers in chapter content

## Summary

Generated 7 interactive MicroSims for Chapter 4 based on the diagram specifications in the chapter content. All MicroSims use p5.js for consistent styling and are width-responsive.

## MicroSims Created

### 1. Linear Transformation Fundamentals Visualizer
- **Location:** `docs/sims/linear-transform-basics/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Split view: original space and transformed space
  - Draggable basis vectors T(e₁) and T(e₂)
  - Animation slider for morphing between identity and transformation
  - Preset transformations (rotation, scaling, shear, reflection)
  - Real-time matrix display
  - Grid deformation visualization

### 2. 2D Rotation Matrix Visualizer
- **Location:** `docs/sims/2d-rotation/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Rotation angle slider (-360° to 360°)
  - Multiple shape options (F-shape, arrow, square, triangle)
  - Unit circle reference
  - Angle arc visualization
  - Live cos/sin values in matrix display
  - Animation button for continuous rotation

### 3. Geometric Transformations Interactive Gallery
- **Location:** `docs/sims/transform-gallery/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Tabbed interface for Rotation, Scaling, Shear, Reflection
  - Type-specific parameter controls
  - Side-by-side original and transformed views
  - Determinant and property display
  - Invertibility indicator
  - Grid deformation toggle

### 4. Orthogonal Projection Interactive Visualizer
- **Location:** `docs/sims/orthogonal-projection/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Draggable vector v
  - Adjustable projection line angle
  - Error vector display (perpendicular component)
  - Right angle indicator
  - Projection formula with live calculations
  - Animation between original and projected positions

### 5. Transformation Composition Visualizer
- **Location:** `docs/sims/transform-composition/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Side-by-side comparison: T then S vs S then T
  - Selectable transformation types for T and S
  - Intermediate state visualization
  - Matrix product display (S·T and T·S)
  - Commutative/non-commutative result indicator
  - Step-by-step animation

### 6. Kernel and Range Interactive Visualizer
- **Location:** `docs/sims/kernel-range/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Domain and codomain side-by-side
  - Kernel (null space) highlighting
  - Range (column space) visualization
  - Full rank vs rank-deficient matrix buttons
  - Mapping lines showing transformation
  - Rank-nullity theorem verification

### 7. Change of Basis Interactive Visualizer
- **Location:** `docs/sims/change-of-basis/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Standard and custom basis views
  - Draggable vector with coordinates in both bases
  - Basis preset options (rotated, skewed, scaled)
  - Transition matrix display
  - Overlay mode to see both bases simultaneously
  - Grid visualization for each basis

## Files Created Per MicroSim

Each MicroSim directory contains:
- `main.html` - HTML shell with p5.js CDN link
- `[name].js` - p5.js JavaScript code
- `index.md` - Documentation with iframe, lesson plan, and references
- `metadata.json` - Dublin Core metadata and control descriptions

## Technical Notes

- All MicroSims follow the standard template with:
  - `drawHeight = 400` (drawing area)
  - `controlHeight = 80-100` (control area)
  - Width-responsive design via `updateCanvasSize()`
  - Consistent color scheme (aliceblue drawing area, white controls)
  - `describe()` function for accessibility

## Next Steps

1. Add screenshot images (.png) for social media previews
2. Update `mkdocs.yml` to include new MicroSims in navigation
3. Test all MicroSims locally with `mkdocs serve`
4. Consider adding quiz mode or xAPI integration for learning analytics

## Related Chapter Content

The chapter covers:
- Functions and linear transformations
- Transformation matrices
- Rotation, scaling, shear, reflection
- Projection (orthogonal)
- Composition of transformations
- Kernel and range (null space and column space)
- Rank-nullity theorem
- Invertible transformations
- Change of basis
