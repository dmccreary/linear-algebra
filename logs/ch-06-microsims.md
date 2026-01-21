# Chapter 6 MicroSims Generation Log

**Date:** 2026-01-21
**Chapter:** 06 - Eigenvalues and Eigenvectors
**Task:** Generate MicroSims for all #### Diagram: headers in chapter content

## Summary

Generated 10 interactive MicroSims for Chapter 6 based on the diagram specifications in the chapter content. All MicroSims use p5.js for consistent styling and are width-responsive. One MicroSim (eigenspace-visualization) uses WEBGL for 3D rendering of eigenspaces.

## MicroSims Created

### 1. Eigenvector Transformation Visualization
- **Location:** `docs/sims/eigenvector-transformation/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Draggable vector on 2D coordinate plane
  - Original vector (blue) and transformed vector (red)
  - Eigenvector direction lines (dashed gold)
  - Glow effect when vector aligns with eigenvector
  - "Eigenvector detected!" message on alignment
  - Eigenvalue displayed as length ratio
  - Editable 2×2 matrix with clickable cells

### 2. Characteristic Polynomial Explorer
- **Location:** `docs/sims/characteristic-polynomial/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Editable 2×2 matrix with click-to-edit cells
  - Real-time polynomial coefficient computation
  - Interactive graph of characteristic polynomial
  - Draggable λ slider on the graph
  - Root visualization where polynomial crosses x-axis
  - Highlighted eigenvalue roots
  - Formula display: det(A - λI) = λ² - tr(A)λ + det(A)

### 3. Eigenspace Visualization
- **Location:** `docs/sims/eigenspace-visualization/`
- **Bloom Level:** Understand (L2)
- **Renderer:** WEBGL (3D)
- **Features:**
  - 3D coordinate system with axis lines
  - Eigenspace lines (1D) or planes (2D) rendered
  - Color-coded eigenvectors with labels
  - Moveable test point with projection to eigenspace
  - Camera rotation via mouse drag
  - Checkbox toggles for each eigenspace
  - Editable 3×3 matrix

### 4. Multiplicity Comparison Chart
- **Location:** `docs/sims/multiplicity-comparison/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Three-column layout: Algebraic, Relationship, Geometric
  - Animated bar comparisons
  - Color-coded multiplicity values
  - Example matrix presets (Defective, Diagonalizable)
  - Diagonalizability status indicator
  - Explanation panel for each case

### 5. Diagonalization Process Workflow
- **Location:** `docs/sims/diagonalization-workflow/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Step-by-step flowchart visualization
  - Current step highlighting with glow
  - Status indicators (check/fail icons)
  - Input matrix display
  - P and D matrix construction
  - Decision nodes with yes/no branches
  - Step/Run/Reset controls

### 6. Matrix Power Calculator
- **Location:** `docs/sims/matrix-power-calculator/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Side-by-side display: A^k direct vs PD^kP⁻¹
  - Editable 2×2 matrix
  - Power k slider (1-20)
  - Animated matrix multiplication steps
  - Operation count comparison
  - Efficiency visualization bar graph
  - Auto-play toggle

### 7. Complex Eigenvalue Visualizer
- **Location:** `docs/sims/complex-eigenvalue/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Left panel: Complex plane with eigenvalue points
  - Right panel: Vector space transformation
  - Rotation angle from imaginary part
  - Scaling factor from real part
  - Spiral trajectory animation
  - Parameter sliders for a (scaling) and b (rotation)
  - Animated vector transformation

### 8. Spectral Theorem Interactive Demonstration
- **Location:** `docs/sims/spectral-theorem/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Symmetric matrix input (auto-symmetry on edit)
  - QΛQ^T decomposition display
  - Q matrix with orthonormal eigenvectors
  - Λ diagonal matrix with real eigenvalues
  - Visual verification Q^TQ = I
  - Coordinate system rotation visualization
  - Step-through decomposition process

### 9. Power Iteration Algorithm Visualization
- **Location:** `docs/sims/power-iteration/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Vector convergence animation on 2D plane
  - Iteration history trail
  - Rayleigh quotient eigenvalue estimate
  - Convergence graph (error vs iteration)
  - True eigenvector comparison
  - Editable matrix with eigenvalue ratio display
  - Step/Run/Reset/Speed controls

### 10. Eigenvalue Applications Map
- **Location:** `docs/sims/eigenvalue-applications/`
- **Bloom Level:** Evaluate (L5)
- **Type:** Interactive Infographic
- **Features:**
  - Hub-and-spoke layout with central "Eigenanalysis" node
  - Six application nodes: PCA, PageRank, Neural Network Stability, Spectral Clustering, Quantum Computing, Recommender Systems
  - Hover highlighting of connections
  - Click for detailed information panel
  - Icon and color-coded categories
  - Key insight and example for each application

## Files Created Per MicroSim

Each MicroSim directory contains:
- `main.html` - HTML shell with p5.js CDN link
- `[name].js` - p5.js JavaScript code
- `index.md` - Documentation with iframe, lesson plan, and references
- `metadata.json` - Dublin Core metadata and control descriptions

## Technical Notes

- All MicroSims follow the standard template with:
  - `drawHeight = 400-480` (drawing area)
  - `controlHeight = 40-100` (control area)
  - Width-responsive design via `updateCanvasSize()`
  - Consistent color scheme (aliceblue drawing area, white controls)
  - `describe()` function for accessibility

- WEBGL-specific considerations for eigenspace-visualization:
  - Font preloading with `loadFont()`
  - Controls parented to container for iframe positioning
  - Screen-space text rendering with `resetMatrix()`
  - Camera rotation via mouse drag
  - 3D coordinate axes and plane rendering

- Matrix input pattern used in multiple MicroSims:
  - Clickable cells for editing
  - `editing` state tracking
  - Keyboard number input capture
  - Automatic symmetry enforcement (spectral-theorem)

- Eigenvalue computation:
  - 2×2 analytical formula via quadratic equation
  - 3×3 numerical approximation
  - Complex eigenvalue handling for rotation matrices

## Navigation

Add these entries to `mkdocs.yml` under MicroSims section:
- Eigenvector Transformation
- Characteristic Polynomial
- Eigenspace Visualization
- Multiplicity Comparison
- Diagonalization Workflow
- Matrix Power Calculator
- Complex Eigenvalue Visualizer
- Spectral Theorem Demo
- Power Iteration
- Eigenvalue Applications Map

## Next Steps

1. Add screenshot images (.png) for social media previews
2. Test all MicroSims locally with `mkdocs serve`
3. Verify iframe heights match canvas heights in chapter content
4. Update mkdocs.yml navigation to include new MicroSims
5. Consider adding links from chapter content to relevant MicroSims

## Related Chapter Content

The chapter covers:
- Eigenvalue and eigenvector definitions
- Characteristic polynomial computation
- Eigenspaces and their dimensions
- Algebraic vs geometric multiplicity
- Diagonalization criteria and process
- Matrix powers via diagonalization
- Complex eigenvalues and rotations
- Spectral theorem for symmetric matrices
- Power iteration algorithm
- Real-world applications in ML/AI
