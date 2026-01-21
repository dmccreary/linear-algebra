# Chapter 9 MicroSims Generation Log

**Date:** 2026-01-21
**Chapter:** 09 - Machine Learning Foundations
**Task:** Generate MicroSims for all #### Diagram: headers in chapter content

## Summary

Generated 9 interactive MicroSims for Chapter 9 based on the diagram specifications in the chapter content. All MicroSims use p5.js for consistent styling and are width-responsive. One MicroSim uses WEBGL for 3D rendering (Gradient Descent).

## MicroSims Created

### 1. Data Matrix Structure
- **Location:** `docs/sims/data-matrix-structure/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - Color-coded matrix grid with heat map visualization
  - Row and column labels (samples and features)
  - Click rows to highlight as feature vectors
  - Click columns to highlight feature across all samples
  - Dataset selector (Iris, MNIST digit, Housing, Generic)
  - Dimension annotations showing n (rows) and d (columns)
  - Hover to see individual cell values

### 2. Covariance and Correlation Visualizer
- **Location:** `docs/sims/covariance-correlation/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Three-panel layout: scatter plot, covariance heatmap, correlation heatmap
  - Color scale: Blue (negative) to White (zero) to Red (positive)
  - Draggable data points to modify dataset in real-time
  - Standardize toggle to show covariance = correlation for standardized data
  - Correlation slider to adjust target correlation
  - Eigenvalue display for covariance matrix
  - Trend line in scatter plot

### 3. PCA Explorer
- **Location:** `docs/sims/pca-explorer/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Four-panel layout showing PCA steps (original, centered, PCs, projected)
  - Step-through buttons: "Center", "Find PCs", "Project"
  - Data generator controls: points, spread, rotation, elongation
  - Scree plot showing eigenvalues
  - Variance explained percentage display
  - Show Reconstruction toggle
  - Animated transitions between steps

### 4. Scree Plot
- **Location:** `docs/sims/scree-plot/`
- **Bloom Level:** Evaluate (L5)
- **Features:**
  - Dual-panel: scree plot (bar chart) and cumulative variance (line plot)
  - Draggable threshold line for variance target (default 95%)
  - Elbow point detection and highlight
  - Kaiser criterion line (eigenvalue = 1)
  - Dataset selector (Synthetic with elbow, Gradual Decay, Uniform, Two Groups)
  - Reconstruction error visualization
  - Summary box comparing selection methods

### 5. Linear Regression Visualizer
- **Location:** `docs/sims/linear-regression/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Scatter plot with draggable data points
  - Manual w (slope) and b (intercept) sliders
  - "Fit OLS" button to compute optimal parameters
  - Residual lines visualization toggle
  - Loss surface heatmap showing MSE(w, b)
  - Current and optimal position markers on loss surface
  - R-squared score display
  - Statistics panel with current/optimal parameters

### 6. Regularization Geometry
- **Location:** `docs/sims/regularization-geometry/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - 2D parameter space (theta-1 vs theta-2)
  - Elliptical loss function contours
  - L2 constraint region (blue circle)
  - L1 constraint region (green diamond)
  - Toggle between L1 and L2 regularization
  - Draggable OLS solution point
  - Alpha (regularization strength) slider
  - Regularization path animation
  - Sparsity count display for L1

### 7. Gradient Descent Visualizer
- **Location:** `docs/sims/gradient-descent/`
- **Bloom Level:** Apply (L3)
- **Renderer:** WEBGL (3D) / 2D contour mode
- **Features:**
  - 3D surface plot with wireframe rendering
  - 2D contour plot view toggle
  - Current position marker with gradient arrow
  - Optimization path trace
  - Loss vs iteration plot
  - Learning rate slider (log scale: 0.001 to 1.0)
  - Step button for single iterations
  - Run/Pause and Reset buttons
  - Loss function selector (Quadratic Bowl, Rosenbrock, Saddle Point)
  - Click-to-set starting point on contour plot

### 8. Learning Rate Effect
- **Location:** `docs/sims/learning-rate-effect/`
- **Bloom Level:** Evaluate (L5)
- **Features:**
  - Three parallel contour plots with different learning rates
  - Side-by-side comparison of optimization trajectories
  - Real-time loss curves for each optimizer
  - Status indicators: "Converging", "Oscillating", "Diverging"
  - Step count to convergence
  - Individual learning rate sliders
  - Preset buttons: "Too Small", "Just Right", "Too Large"
  - Shared "Run All" and "Reset All" buttons
  - Speed slider for animation

### 9. ML Pipeline Workflow
- **Location:** `docs/sims/ml-pipeline/`
- **Bloom Level:** Create (L6)
- **Features:**
  - Flowchart with 11 nodes showing complete ML pipeline
  - Color-coded by category (Blue: Data, Green: Modeling, Orange: Optimization, Purple: Evaluation)
  - Steps: Raw Data → Standardization → PCA → Train/Test Split → Model Selection → OLS/Ridge/Lasso → Optimization → Evaluation → Trained Model
  - Click nodes to see Python code examples
  - Hover for detailed explanations
  - Legend showing color categories

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

- WEBGL-specific considerations for Gradient Descent MicroSim:
  - Font preloading with `loadFont()`
  - Controls parented to container for iframe positioning
  - Screen-space text rendering with `resetMatrix()`
  - Toggle between 3D surface and 2D contour views

- Machine Learning computation patterns:
  - Covariance/correlation matrix calculation
  - PCA via eigendecomposition
  - Linear regression normal equations
  - Gradient descent with multiple loss functions
  - Elbow detection for scree plots

## Navigation Updates

Added 9 entries to `mkdocs.yml` under MicroSims section (alphabetically):
- Covariance and Correlation Visualizer
- Data Matrix Structure
- Gradient Descent Visualizer
- Learning Rate Effect
- Linear Regression Visualizer
- ML Pipeline Workflow
- PCA Explorer
- Regularization Geometry
- Scree Plot

## Chapter Content Updates

Added iframe embeds with fullscreen buttons to all 9 diagram sections in:
`docs/chapters/09-machine-learning-foundations/index.md`

## Related Chapter Content

The chapter covers:
- Feature vectors and data matrices
- Standardization for scale invariance
- Covariance and correlation matrices
- Principal Component Analysis (PCA)
- Scree plots and variance explained
- Linear regression and normal equations
- Ridge (L2) and Lasso (L1) regularization
- Gradient vectors and gradient descent
- Learning rate effects on convergence
- Complete ML pipeline workflow

## Next Steps

1. Test all MicroSims locally with `mkdocs serve`
2. Verify iframe heights match canvas heights
3. Add screenshot images (.png) for social media previews
4. Consider adding cross-references between related MicroSims
