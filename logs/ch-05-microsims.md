# Chapter 5 MicroSims Generation Log

**Date:** 2026-01-20
**Chapter:** 05 - Determinants and Matrix Properties
**Task:** Generate MicroSims for all #### Diagram: headers in chapter content

## Summary

Generated 8 interactive MicroSims for Chapter 5 based on the diagram specifications in the chapter content. All MicroSims use p5.js for consistent styling and are width-responsive. One MicroSim (volume-scaling-3d) uses WEBGL for 3D rendering.

## MicroSims Created

### 1. Signed Area Interactive Visualizer
- **Location:** `docs/sims/signed-area/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Draggable vectors u (red) and v (blue)
  - Parallelogram visualization with color-coded sign
  - Real-time signed area calculation
  - Formula display showing ad - bc computation
  - Orientation indicator (CCW/CW/Parallel)

### 2. 2×2 Determinant Calculator
- **Location:** `docs/sims/det-2x2-calculator/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Editable matrix cells with click-to-edit
  - Main diagonal (green) and anti-diagonal (red) highlighting
  - Step-by-step calculation display
  - Geometric parallelogram visualization
  - Preset buttons: Random, Identity, Singular

### 3. Rule of Sarrus Visualizer
- **Location:** `docs/sims/sarrus-rule/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - 3×3 matrix with extended columns display
  - Step-by-step diagonal animation
  - Positive diagonals (green) and negative diagonals (red)
  - Running total calculation
  - Play/Pause and speed control
  - Preset example matrices

### 4. Cofactor Expansion Interactive Visualizer
- **Location:** `docs/sims/cofactor-expansion/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Expansion row selector
  - Sign pattern checkerboard display
  - Minor matrix visualization for each cofactor
  - Step-by-step term calculation
  - Accumulating sum display
  - Color-coded replaced columns

### 5. Determinant Properties Explorer
- **Location:** `docs/sims/det-properties/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Side-by-side original and modified matrix display
  - Operation buttons: Swap, Scale, Add, Transpose
  - Determinant ratio visualization
  - Geometric parallelogram comparison
  - Property explanation panel
  - Scale factor k slider

### 6. Singular vs Non-Singular Matrix Visualizer
- **Location:** `docs/sims/singular-matrix/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Unit square transformation visualization
  - Morph slider (identity → matrix)
  - Transformed grid display
  - Column vector arrows
  - Singular/Non-singular status indicator
  - Color-coded by determinant sign

### 7. 3D Volume Scaling Visualizer
- **Location:** `docs/sims/volume-scaling-3d/`
- **Bloom Level:** Understand (L2)
- **Renderer:** WEBGL (3D)
- **Features:**
  - 3D parallelepiped visualization
  - Camera rotation (click and drag)
  - Unit cube wireframe reference
  - Column vectors as 3D arrows
  - Volume ratio display
  - Preset buttons: Scaling, Rotation, Singular

### 8. Cramer's Rule Interactive Solver
- **Location:** `docs/sims/cramers-rule/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - System of equations display
  - Step-by-step determinant calculations
  - Modified matrices A₁, A₂ with highlighted replaced columns
  - Solution computation with Cramer's formula
  - Geometric view showing line intersection
  - Singular system handling

## Files Created Per MicroSim

Each MicroSim directory contains:
- `main.html` - HTML shell with p5.js CDN link
- `[name].js` - p5.js JavaScript code
- `index.md` - Documentation with iframe, lesson plan, and references
- `metadata.json` - Dublin Core metadata and control descriptions

## Technical Notes

- All MicroSims follow the standard template with:
  - `drawHeight = 400-420` (drawing area)
  - `controlHeight = 50-100` (control area)
  - Width-responsive design via `updateCanvasSize()`
  - Consistent color scheme (aliceblue drawing area, white controls)
  - `describe()` function for accessibility

- WEBGL-specific considerations for volume-scaling-3d:
  - Font preloading with `loadFont()`
  - Controls parented to container for iframe positioning
  - Screen-space text rendering with `resetMatrix()`
  - Camera rotation via mouse drag

## Navigation Updated

Added 8 new entries to `mkdocs.yml` under MicroSims section:
- Signed Area Visualizer
- 2x2 Determinant Calculator
- Rule of Sarrus Visualizer
- Cofactor Expansion Visualizer
- Determinant Properties Explorer
- Singular Matrix Visualizer
- 3D Volume Scaling Visualizer
- Cramers Rule Solver

## Next Steps

1. Add screenshot images (.png) for social media previews
2. Test all MicroSims locally with `mkdocs serve`
3. Verify iframe heights match canvas heights in chapter content
4. Consider adding quiz mode for learning analytics

## Related Chapter Content

The chapter covers:
- Determinant definition and geometric meaning
- 2×2 determinant formula (ad - bc)
- 3×3 determinant via Rule of Sarrus
- Cofactor expansion (Laplace expansion)
- Minors and cofactors
- Determinant properties (row operations, multiplicative, transpose)
- Singular matrices and invertibility
- Volume scaling factor interpretation
- Cramer's Rule for solving systems
