# Chapter 03 MicroSims Generation Session Log

**Date**: 2026-01-19
**Chapter**: 03 - Systems of Linear Equations
**Source**: `docs/chapters/03-systems-of-linear-equations/index.md`

## Summary

Generated 7 MicroSims for Chapter 03 based on the `#### Diagram:` headers and their `<details markdown="1">` specifications.

## MicroSims Created

### 1. System of Equations Geometry
- **Location**: `docs/sims/system-geometry/`
- **Bloom Level**: Understand (L2)
- **Learning Objective**: Help students visualize how the solution to a system of linear equations corresponds to the geometric intersection of lines (2D) or planes (3D)
- **Features**:
  - 2D mode with lines and intersection point
  - 3D mode with planes (WEBGL)
  - Real-time coefficient adjustment via sliders
  - Solution type detection (unique, infinite, none)
  - Random system generation

### 2. Row Operations Practice
- **Location**: `docs/sims/row-operations/`
- **Bloom Level**: Apply (L3)
- **Learning Objective**: Enable students to practice applying the three elementary row operations (swap, scale, add) on augmented matrices
- **Features**:
  - Interactive operation selection
  - Step-by-step application with animation
  - Operation history tracking
  - Undo and reset functionality

### 3. Gaussian Elimination Visualizer
- **Location**: `docs/sims/gaussian-elimination/`
- **Bloom Level**: Apply (L3)
- **Learning Objective**: Guide students through the complete Gaussian elimination algorithm with step explanations
- **Features**:
  - Step-by-step algorithm execution
  - Pivot highlighting
  - Explanatory text for each step
  - Auto-solve mode with adjustable speed
  - Back substitution phase

### 4. REF vs RREF Comparison
- **Location**: `docs/sims/ref-vs-rref/`
- **Bloom Level**: Analyze (L4)
- **Learning Objective**: Help students compare Row Echelon Form and Reduced Row Echelon Form
- **Features**:
  - Side-by-side matrix comparison
  - Pivot position highlighting
  - Operation count display
  - Random system generation

### 5. Solution Set Visualizer
- **Location**: `docs/sims/solution-sets/`
- **Bloom Level**: Analyze (L4)
- **Learning Objective**: Enable students to explore different solution types (unique, infinite, none) and identify free vs basic variables
- **Features**:
  - Preset examples for each solution type
  - REF/RREF toggle display
  - Pivot and free column highlighting
  - Geometric interpretation visualization

### 6. Homogeneous System Explorer
- **Location**: `docs/sims/homogeneous-systems/`
- **Bloom Level**: Understand (L2)
- **Learning Objective**: Help students understand homogeneous systems Ax = 0 and visualize their null spaces
- **Features**:
  - 3D null space visualization (WEBGL)
  - Null space dimension calculation
  - Basis vector display
  - Interactive 3D rotation

### 7. Numerical Stability Demonstration
- **Location**: `docs/sims/numerical-stability/`
- **Bloom Level**: Evaluate (L5)
- **Learning Objective**: Demonstrate how ill-conditioned systems amplify small errors
- **Features**:
  - Condition number calculation
  - Perturbation magnitude slider
  - Error magnification display
  - Geometric visualization for 2D systems
  - Multiple preset examples (well-conditioned to near-singular)

## Files Created Per MicroSim

Each MicroSim directory contains:
- `main.html` - HTML wrapper with p5.js CDN
- `[microsim-name].js` - JavaScript simulation code
- `index.md` - Documentation and lesson plan
- `metadata.json` - Dublin Core metadata

## Next Steps

1. **Update mkdocs.yml**: Add new MicroSims to the navigation
2. **Test locally**: Run `mkdocs serve` and verify each MicroSim works
3. **Update chapter references**: Ensure iframe src paths in chapter match the created directories
4. **Create screenshots**: Add `.png` preview images for social sharing

## Technical Notes

- All MicroSims use p5.js v1.11.10 from jsdelivr CDN
- 3D visualizations use WEBGL mode
- Font loaded from CDN for WEBGL text rendering
- Responsive design with `updateCanvasSize()` pattern
- Control height varies: 70-130px depending on complexity
