# Chapter 8 MicroSims Generation Log

**Date:** 2026-01-21
**Chapter:** 08 - Vector Spaces and Inner Products
**Task:** Generate MicroSims for all #### Diagram: headers in chapter content

## Summary

Generated 9 interactive MicroSims for Chapter 8 based on the diagram specifications in the chapter content. All MicroSims use p5.js for consistent styling and are width-responsive. Several MicroSims use WEBGL for 3D rendering.

## MicroSims Created

### 1. Vector Space Examples Gallery
- **Location:** `docs/sims/vector-space-gallery/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Grid of 6 cards representing different vector spaces
  - Animated visual icons for each space (2D vectors, 3D axes, parabolas, sine waves, matrices, null space planes)
  - Hover interactions showing addition and scalar multiplication examples
  - Color-coded by dimension (finite vs. infinite)
  - Dimension badges on each card

### 2. Subspace Tester
- **Location:** `docs/sims/subspace-tester/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - 2D coordinate plane with set visualization
  - Draggable test vectors u and v
  - Linear combination cu + dv display
  - Preset sets: Line through origin, Line not through origin, First quadrant, Circle, All of R²
  - Visual feedback when combination leaves set
  - Explanation of which subspace property fails

### 3. Inner Product Space Visualizer
- **Location:** `docs/sims/inner-product-visualizer/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - 2D plane with draggable vectors u and v
  - Inner product type selector (Standard, Weighted diagonal, Weighted general)
  - Dynamic unit ball visualization (circle or ellipse)
  - Angle arc between vectors
  - Real-time calculation of inner product, norms, angle
  - Cauchy-Schwarz inequality verification

### 4. Orthonormal Basis Coordinate Finder
- **Location:** `docs/sims/orthonormal-basis-finder/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - 2D coordinate system with standard and orthonormal bases
  - Draggable target vector and basis vectors
  - Projection lines from v to each basis vector
  - Coefficients displayed as inner products
  - Parseval's identity verification
  - Comparison with standard basis computation

### 5. Gram-Schmidt Step-by-Step Visualizer (Ch8)
- **Location:** `docs/sims/gram-schmidt-ch8/`
- **Bloom Level:** Apply (L3)
- **Renderer:** WEBGL (3D)
- **Features:**
  - 3D coordinate system with mouse rotation
  - Input vectors v₁, v₂, v₃ (semi-transparent after processing)
  - Projection vectors shown in cyan with dashed lines
  - Output orthonormal vectors q₁, q₂, q₃ (colored)
  - Step-by-step animation with phases (project, subtract, normalize)
  - Warning for nearly dependent vectors

### 6. Projection onto Subspace Visualizer
- **Location:** `docs/sims/projection-subspace/`
- **Bloom Level:** Analyze (L4)
- **Renderer:** WEBGL (3D)
- **Features:**
  - 3D coordinate system with interactive rotation
  - Subspace W as translucent plane or line
  - Vector v, projection p, and error e visualization
  - Right-angle indicator showing perpendicularity
  - Toggle between 1D and 2D subspaces
  - Orthogonality verification display

### 7. Least Squares Problem Visualizer
- **Location:** `docs/sims/least-squares-visualizer/`
- **Bloom Level:** Analyze (L4)
- **Renderer:** WEBGL (3D for geometric view)
- **Features:**
  - Dual view modes: Regression and Geometric
  - Regression view: draggable data points, fitted line, residuals
  - Geometric view: column space plane, projection, error vector
  - Method comparison (Normal equations, QR, SVD)
  - Sum of squared residuals display
  - Condition number warning

### 8. Four Fundamental Subspaces Visualizer
- **Location:** `docs/sims/four-subspaces/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Dual-panel layout: Domain (R^n) and Codomain (R^m)
  - Row space and null space visualization (orthogonal in R^n)
  - Column space and left null space (orthogonal in R^m)
  - Transformation arrows showing mappings
  - Matrix input up to 4×4
  - Basis vectors and orthogonality verification toggles
  - Dimension labels and rank-nullity display

### 9. Pseudoinverse Solver
- **Location:** `docs/sims/pseudoinverse-solver/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Matrix A display with rank indicator
  - Pseudoinverse A⁺ computation and display
  - Solution x = A⁺b calculation
  - Residual ||Ax - b|| visualization
  - SVD components toggle
  - Preset examples: overdetermined, rank-deficient, underdetermined, full rank

## Files Created Per MicroSim

Each MicroSim directory contains:
- `main.html` - HTML shell with p5.js CDN link
- `[name].js` - p5.js JavaScript code
- `index.md` - Documentation with iframe, lesson plan, and references
- `metadata.json` - Dublin Core metadata and control descriptions

## Technical Notes

- All MicroSims follow the standard template with:
  - `drawHeight` + `controlHeight` layout
  - Width-responsive design via `updateCanvasSize()`
  - Consistent color schemes
  - `describe()` function for accessibility

- WEBGL-specific considerations for 3D MicroSims:
  - Font preloading with `loadFont()`
  - Controls parented to container for iframe positioning
  - Screen-space text rendering with `resetMatrix()`
  - Camera rotation via mouse drag

- Numerical computation patterns:
  - SVD via eigendecomposition of A^T A
  - RREF for subspace basis computation
  - Inner product and norm calculations

## Navigation Updates

Added 9 entries to `mkdocs.yml` under MicroSims section (alphabetically):
- Four Fundamental Subspaces
- Gram-Schmidt Step-by-Step (Ch8)
- Inner Product Space Visualizer
- Least Squares Visualizer
- Orthonormal Basis Finder
- Projection onto Subspace
- Pseudoinverse Solver
- Subspace Tester
- Vector Space Gallery

## Chapter Content Updates

Added iframe embeds with fullscreen buttons to all 9 diagram sections in:
`docs/chapters/08-vector-spaces-and-inner-products/index.md`

## Next Steps

1. Test all MicroSims locally with `mkdocs serve`
2. Verify iframe heights match canvas heights
3. Add screenshot images (.png) for social media previews
4. Consider adding cross-references between related MicroSims

## Related Chapter Content

The chapter covers:
- Abstract vector spaces and axioms
- Subspaces and subspace test
- Inner products and inner product spaces
- Norms and Cauchy-Schwarz inequality
- Orthogonality and orthonormal bases
- Gram-Schmidt orthogonalization
- Projection onto subspaces
- Least squares problem and normal equations
- Four fundamental subspaces
- Pseudoinverse (Moore-Penrose inverse)
