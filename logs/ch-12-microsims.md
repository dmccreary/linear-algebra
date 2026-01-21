# Chapter 12 MicroSims Session Log

**Date:** 2026-01-21
**Chapter:** 12 - Optimization and Learning Algorithms
**Task:** Generate MicroSims for all diagram specifications in Chapter 12

## Summary

Successfully created 8 interactive MicroSims for Chapter 12, covering optimization algorithms from convexity through modern adaptive methods to constrained optimization.

## MicroSims Created

### 1. Convex Function Visualizer
- **Location:** `docs/sims/convex-function-visualizer/`
- **Purpose:** Demonstrate the geometric definition of convexity through the chord condition
- **Features:**
  - Function selector (x², |x|, x⁴, x² + sin(x), -x²)
  - Draggable points on the curve
  - Lambda slider for interpolation
  - Color-coded convexity status (green/red)

### 2. Hessian and Curvature Visualizer
- **Location:** `docs/sims/hessian-curvature-visualizer/`
- **Purpose:** Connect Hessian eigenvalues to geometric curvature
- **Features:**
  - 3D surface plot using WEBGL
  - Function selector (bowl, saddle, elongated forms)
  - Principal curvature direction arrows
  - Eigenvalue display with color coding

### 3. Newton vs Gradient Descent Comparison
- **Location:** `docs/sims/newton-vs-gradient-descent/`
- **Purpose:** Compare convergence behavior of first and second-order methods
- **Features:**
  - Adjustable condition number (1-100)
  - Learning rate control
  - Side-by-side path visualization
  - Iteration counter and function value display

### 4. SGD Trajectory Visualizer
- **Location:** `docs/sims/sgd-trajectory-visualizer/`
- **Purpose:** Show how batch size affects SGD convergence
- **Features:**
  - Batch size slider (1 to 128)
  - Gradient noise visualization
  - Variance estimate display
  - Trajectory path tracking

### 5. Momentum Dynamics Visualizer
- **Location:** `docs/sims/momentum-dynamics-visualizer/`
- **Purpose:** Visualize momentum accumulation and oscillation dampening
- **Features:**
  - Three simultaneous optimizers: SGD, Momentum, Nesterov
  - Velocity vector visualization
  - Momentum coefficient control
  - Ill-conditioned elliptical contours

### 6. Optimizer Comparison Arena
- **Location:** `docs/sims/optimizer-comparison-arena/`
- **Purpose:** Race SGD, Momentum, RMSprop, and Adam on various landscapes
- **Features:**
  - Four loss landscapes (Quadratic, Rosenbrock, Beale, Saddle)
  - Enable/disable individual optimizers
  - "Race!" button for simultaneous comparison
  - Winner declaration and iteration tracking

### 7. Lagrange Multiplier Geometry
- **Location:** `docs/sims/lagrange-multiplier-geometry/`
- **Purpose:** Visualize the geometric interpretation of Lagrange multipliers
- **Features:**
  - Draggable point along constraint curve
  - Gradient and constraint normal vectors
  - Highlight when gradients are parallel (optimum)
  - Lambda value display

### 8. KKT Conditions Visualizer
- **Location:** `docs/sims/kkt-conditions-visualizer/`
- **Purpose:** Understand KKT conditions for inequality-constrained optimization
- **Features:**
  - Toggleable inequality constraints
  - Feasible region shading
  - Active/inactive constraint coloring
  - KKT condition checklist with live status

## Files Modified

### Chapter Content
- `docs/chapters/12-optimization-and-learning-algorithms/index.md`
  - Added 8 iframe embeds after each `#### Diagram:` header

### Navigation
- `mkdocs.yml`
  - Added 8 new entries to MicroSims navigation section (alphabetically sorted)

## Technical Notes

- All MicroSims use p5.js (version 1.11.10)
- Hessian and Curvature Visualizer uses WEBGL mode for 3D rendering
- All MicroSims are width-responsive
- Standard template pattern: `main.html`, `[name].js`, `index.md`

## Testing

MicroSims can be tested by:
1. Running `mkdocs serve` from the repository root
2. Navigating to `http://127.0.0.1:8000/linear-algebra/chapters/12-optimization-and-learning-algorithms/`
3. Or directly to individual MicroSims via the navigation

## Next Steps

- Add screenshots for social media previews (`.png` files)
- Consider adding quiz mode to select MicroSims
- Upload to p5.js editor for easy teacher editing
