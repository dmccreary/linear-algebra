---
title: Machine Learning Foundations
description: Connecting linear algebra to core machine learning algorithms including PCA, regression, and gradient descent
generated_by: claude skill chapter-content-generator
date: 2026-01-17 16:00:00
version: 0.03
---

# Machine Learning Foundations

## Summary

This chapter explicitly connects linear algebra concepts to core machine learning algorithms and techniques. You will learn how data is represented as matrices, understand covariance and correlation, master Principal Component Analysis (PCA) for dimensionality reduction, and implement linear regression with regularization. Gradient descent, the workhorse of machine learning optimization, is covered in detail.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Feature Vector
2. Feature Matrix
3. Data Matrix
4. Covariance Matrix
5. Correlation Matrix
6. Standardization
7. PCA
8. Principal Component
9. Variance Explained
10. Scree Plot
11. Dimensionality Reduction
12. Linear Regression
13. Design Matrix
14. Ridge Regression
15. Lasso Regression
16. Regularization
17. Gradient Vector
18. Gradient Descent
19. Batch Gradient Descent
20. Learning Rate

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 6: Eigenvalues and Eigenvectors](../06-eigenvalues-and-eigenvectors/index.md)
- [Chapter 7: Matrix Decompositions](../07-matrix-decompositions/index.md)
- [Chapter 8: Vector Spaces and Inner Products](../08-vector-spaces-and-inner-products/index.md)

---

## Introduction

Machine learning is, at its core, applied linear algebra. When you train a model, you perform matrix operations. When you reduce dimensions, you compute eigendecompositions. When you optimize, you follow gradients through high-dimensional spaces. Understanding the linear algebra behind these operations transforms you from a user of black-box algorithms into a practitioner who can debug, optimize, and innovate.

This chapter bridges abstract linear algebra and practical machine learning. We start with how data becomes matrices, develop statistical tools like covariance, build up to PCA for dimensionality reduction, implement regression with regularization, and master gradient descent for optimization. Each section reinforces that machine learning "magic" is really linear algebra in action.

## Data as Matrices

In machine learning, data is organized into matrices where each row represents an observation and each column represents a feature.

### Feature Vectors

A **feature vector** represents a single data point as a vector of measurements or attributes:

$\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_d \end{bmatrix} \in \mathbb{R}^d$

where:

- $d$ is the number of features (dimensionality)
- Each $x_i$ is a measurement (e.g., height, weight, pixel intensity)

Examples of feature vectors:

| Domain | Features | Dimensionality |
|--------|----------|----------------|
| Housing | bedrooms, sqft, age, location | 4+ |
| Images | pixel intensities | 784 (28×28) to millions |
| Text | word counts or embeddings | 100 to 768+ |
| Tabular | mixed numerical/categorical | varies |

### Feature Matrix and Data Matrix

A **feature matrix** (also called **data matrix**) stacks $n$ feature vectors as rows:

$X = \begin{bmatrix} — \mathbf{x}_1^T — \\ — \mathbf{x}_2^T — \\ \vdots \\ — \mathbf{x}_n^T — \end{bmatrix} = \begin{bmatrix} x_{11} & x_{12} & \cdots & x_{1d} \\ x_{21} & x_{22} & \cdots & x_{2d} \\ \vdots & \vdots & \ddots & \vdots \\ x_{n1} & x_{n2} & \cdots & x_{nd} \end{bmatrix}$

where:

- $X$ is $n \times d$ (n samples, d features)
- Row $i$ is sample $\mathbf{x}_i^T$
- Column $j$ contains all values of feature $j$

!!! note "Convention Alert"
    Some texts use columns for samples (X is d×n). We follow the more common machine learning convention where rows are samples, matching NumPy/Pandas defaults. Always check the convention when reading papers or documentation.

#### Diagram: Data Matrix Structure

<details markdown="1">
<summary>Data Matrix Structure Visualizer</summary>
Type: infographic

Bloom Taxonomy Level: Understand

Learning Objective: Visualize the structure of data matrices and understand the relationship between rows (samples) and columns (features)

Layout: Interactive matrix representation with labeled dimensions

Visual elements:
- Main panel: Color-coded matrix grid
- Row labels: "Sample 1", "Sample 2", ..., "Sample n"
- Column labels: "Feature 1", "Feature 2", ..., "Feature d"
- Highlighted single row showing feature vector
- Highlighted single column showing all values of one feature
- Dimension annotations: n (rows) and d (columns)

Interactive elements:
- Click a row to highlight as feature vector
- Click a column to highlight as feature across all samples
- Hover to see individual cell value
- Toggle to show actual example data (iris, housing, etc.)

Example datasets:
1. Iris: 150 samples, 4 features (petal/sepal dimensions)
2. MNIST digit: 1 sample, 784 features (pixel values)
3. Housing: 506 samples, 13 features

Visual style:
- Heat map coloring for numerical values
- Clean grid lines
- Responsive sizing

Implementation: HTML/CSS/JavaScript with interactive highlighting
</details>

## Statistical Foundations

Before applying machine learning algorithms, we must understand the statistical structure of our data.

### Standardization

**Standardization** transforms features to have zero mean and unit variance:

$z_{ij} = \frac{x_{ij} - \mu_j}{\sigma_j}$

where:

- $\mu_j = \frac{1}{n}\sum_{i=1}^n x_{ij}$ is the mean of feature $j$
- $\sigma_j = \sqrt{\frac{1}{n-1}\sum_{i=1}^n (x_{ij} - \mu_j)^2}$ is the standard deviation

In matrix form, if $\boldsymbol{\mu}$ is the row vector of means:

$Z = (X - \mathbf{1}\boldsymbol{\mu}) \text{diag}(\boldsymbol{\sigma})^{-1}$

#### Why Standardize?

- **Scale invariance:** Features measured in different units become comparable
- **Numerical stability:** Prevents features with large values from dominating
- **Algorithm requirements:** Many algorithms (PCA, gradient descent, regularization) assume or benefit from standardized data

| Algorithm | Standardization |
|-----------|-----------------|
| PCA | Required for meaningful results |
| k-Means | Recommended |
| SVM | Required (especially with RBF kernel) |
| Neural Networks | Strongly recommended |
| Decision Trees | Not necessary |
| Linear Regression | Recommended for regularization |

### Covariance Matrix

The **covariance matrix** captures how features vary together:

$\Sigma = \frac{1}{n-1}(X - \mathbf{1}\boldsymbol{\mu})^T(X - \mathbf{1}\boldsymbol{\mu}) = \frac{1}{n-1}\tilde{X}^T\tilde{X}$

where:

- $\tilde{X}$ is the centered data matrix (mean subtracted)
- $\Sigma$ is a $d \times d$ symmetric positive semi-definite matrix
- $\Sigma_{jk} = \text{Cov}(X_j, X_k)$

#### Covariance Formula

The covariance between features $j$ and $k$:

$\text{Cov}(X_j, X_k) = \frac{1}{n-1}\sum_{i=1}^n (x_{ij} - \mu_j)(x_{ik} - \mu_k)$

Properties:

- Diagonal entries $\Sigma_{jj} = \text{Var}(X_j)$ are variances
- Off-diagonal entries measure linear relationships
- $\Sigma_{jk} > 0$: features increase together
- $\Sigma_{jk} < 0$: one increases as other decreases
- $\Sigma_{jk} = 0$: no linear relationship (not necessarily independent)

### Correlation Matrix

The **correlation matrix** is the standardized covariance:

$R = D^{-1}\Sigma D^{-1}$

where:

- $D = \text{diag}(\sigma_1, \ldots, \sigma_d)$ contains standard deviations
- $R_{jk} = \frac{\Sigma_{jk}}{\sigma_j \sigma_k} = \frac{\text{Cov}(X_j, X_k)}{\sqrt{\text{Var}(X_j)\text{Var}(X_k)}}$

Properties:

- Diagonal entries are 1 (features perfectly correlate with themselves)
- Off-diagonal entries satisfy $-1 \leq R_{jk} \leq 1$
- $R_{jk} = \pm 1$: perfect linear relationship
- The correlation matrix is the covariance matrix of standardized data

#### Diagram: Covariance and Correlation Visualizer

<details markdown="1">
<summary>Covariance and Correlation Matrix Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Understand how covariance and correlation capture relationships between features through interactive exploration

Visual elements:
- Left panel: Scatter plot matrix (pairs of features)
- Center panel: Covariance matrix as heatmap
- Right panel: Correlation matrix as heatmap
- Color scale: Blue (negative) to White (zero) to Red (positive)
- Eigenvalue display for covariance matrix

Interactive controls:
- Dataset selector (generated bivariate, iris, custom)
- Draggable data points to modify dataset
- "Standardize" toggle to see effect on covariance
- Highlight cell to see corresponding scatter plot
- Slider to add/remove correlation between features

Default parameters:
- 2D generated data with moderate positive correlation
- 100 sample points
- Canvas: responsive three-panel layout

Behavior:
- Real-time update of matrices as data changes
- Show how correlation normalizes for scale
- Highlight relationship between scatter plot shape and correlation value
- Display eigenvalues/eigenvectors of covariance matrix
- Demonstrate that standardized data has correlation = covariance

Implementation: p5.js with matrix visualization
</details>

## Principal Component Analysis (PCA)

**Principal Component Analysis** is a technique for **dimensionality reduction** that finds the directions of maximum variance in data.

### The Goal of Dimensionality Reduction

High-dimensional data presents challenges:

- **Visualization:** Cannot plot more than 3 dimensions
- **Computation:** Many algorithms scale poorly with dimensions
- **Curse of dimensionality:** Data becomes sparse in high dimensions
- **Noise:** Some dimensions may be noise rather than signal

**Dimensionality reduction** projects data from $\mathbb{R}^d$ to $\mathbb{R}^k$ where $k < d$, preserving as much information as possible.

### Principal Components

**Principal components** are the eigenvectors of the covariance matrix, ordered by their eigenvalues:

$\Sigma \mathbf{v}_i = \lambda_i \mathbf{v}_i$

where:

- $\mathbf{v}_1$ is the first principal component (direction of maximum variance)
- $\mathbf{v}_2$ is orthogonal to $\mathbf{v}_1$ and captures maximum remaining variance
- $\lambda_i$ is the variance explained by the $i$-th component

The principal components form an orthonormal basis aligned with the data's natural axes of variation.

### PCA Algorithm

**Step 1: Center the data**

$\tilde{X} = X - \mathbf{1}\boldsymbol{\mu}$

**Step 2: Compute covariance matrix**

$\Sigma = \frac{1}{n-1}\tilde{X}^T\tilde{X}$

**Step 3: Eigendecomposition**

$\Sigma = V\Lambda V^T$

where $V = [\mathbf{v}_1 | \cdots | \mathbf{v}_d]$ and $\Lambda = \text{diag}(\lambda_1, \ldots, \lambda_d)$ with $\lambda_1 \geq \cdots \geq \lambda_d$.

**Step 4: Project onto top $k$ components**

$Z = \tilde{X}V_k$

where $V_k = [\mathbf{v}_1 | \cdots | \mathbf{v}_k]$ contains the first $k$ principal components.

### Variance Explained

The **variance explained** by each principal component is its eigenvalue:

- Total variance: $\sum_{i=1}^d \lambda_i = \text{trace}(\Sigma)$
- Proportion of variance explained by component $i$: $\frac{\lambda_i}{\sum_{j=1}^d \lambda_j}$
- Cumulative variance explained by first $k$ components: $\frac{\sum_{i=1}^k \lambda_i}{\sum_{j=1}^d \lambda_j}$

### Scree Plot

A **scree plot** visualizes eigenvalues to help choose the number of components:

- X-axis: Component number (1, 2, 3, ...)
- Y-axis: Eigenvalue (variance explained) or proportion of variance
- Look for an "elbow" where eigenvalues drop sharply

#### Diagram: PCA Interactive Explorer

<details markdown="1">
<summary>PCA Step-by-Step Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand PCA by visualizing each step from raw data to projected low-dimensional representation

Visual elements:
- Panel 1: Original 2D/3D data with mean point
- Panel 2: Centered data (translated to origin)
- Panel 3: Principal component vectors overlaid on data
- Panel 4: Projected 1D data along first PC
- Scree plot showing eigenvalues
- Variance explained percentage display

Interactive controls:
- Data generator: cluster shape, spread, rotation
- Number of points slider (20-200)
- Dimension selector (2D or 3D)
- Step-through buttons: "Center", "Find PCs", "Project"
- Number of components to keep (k)
- "Show Reconstruction" toggle

Default parameters:
- Elongated 2D Gaussian cluster
- 100 points
- Canvas: responsive multi-panel

Behavior:
- Animate centering transformation
- Show eigenvectors with length proportional to eigenvalue
- Demonstrate projection onto first PC
- Show reconstruction error when reducing dimensions
- Display scree plot updating with data changes

Implementation: p5.js with eigenvalue computation
</details>

### PCA via SVD

In practice, PCA is computed using SVD for numerical stability:

$\tilde{X} = U\Sigma V^T$

The relationship to eigendecomposition:

- Right singular vectors $V$ are the principal components
- Singular values relate to eigenvalues: $\lambda_i = \frac{\sigma_i^2}{n-1}$
- This avoids forming $\tilde{X}^T\tilde{X}$ explicitly

#### Diagram: Scree Plot Interactive

<details markdown="1">
<summary>Scree Plot and Component Selection</summary>
Type: microsim

Bloom Taxonomy Level: Evaluate

Learning Objective: Use scree plots and cumulative variance to select the optimal number of principal components

Visual elements:
- Left panel: Scree plot (bar chart of eigenvalues)
- Right panel: Cumulative variance explained (line plot)
- Threshold line for desired variance (e.g., 95%)
- Elbow point detection and highlight
- Reconstruction comparison at different k values

Interactive controls:
- Dataset selector (synthetic, iris, digits subset)
- Draggable threshold line for variance target
- Number of components slider
- "Show Reconstructed Data" toggle
- "Compare Original vs Reconstructed" toggle

Default parameters:
- Synthetic dataset with clear elbow at k=3
- 95% variance threshold line
- Canvas: responsive dual-panel

Behavior:
- Highlight suggested k based on elbow detection
- Show which k achieves target variance
- Display reconstruction error as k changes
- For image data: show visual reconstruction quality
- Kaiser criterion line (eigenvalue = 1 for standardized data)

Implementation: p5.js with statistical visualization
</details>

## Linear Regression

**Linear regression** fits a linear model to predict a target variable from features.

### The Model

Given features $\mathbf{x} \in \mathbb{R}^d$ and target $y \in \mathbb{R}$:

$y = \mathbf{w}^T\mathbf{x} + b = w_1x_1 + w_2x_2 + \cdots + w_dx_d + b$

where:

- $\mathbf{w} \in \mathbb{R}^d$ is the weight vector
- $b \in \mathbb{R}$ is the bias (intercept)

### Design Matrix

The **design matrix** augments features with a column of ones to absorb the bias:

$X = \begin{bmatrix} 1 & x_{11} & x_{12} & \cdots & x_{1d} \\ 1 & x_{21} & x_{22} & \cdots & x_{2d} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_{n1} & x_{n2} & \cdots & x_{nd} \end{bmatrix}$

Now the model becomes:

$\mathbf{y} = X\boldsymbol{\theta}$

where $\boldsymbol{\theta} = [b, w_1, \ldots, w_d]^T$ combines bias and weights.

### Ordinary Least Squares

The least squares solution minimizes:

$J(\boldsymbol{\theta}) = \|X\boldsymbol{\theta} - \mathbf{y}\|^2 = \sum_{i=1}^n (x_i^T\boldsymbol{\theta} - y_i)^2$

The closed-form solution (normal equations):

$\hat{\boldsymbol{\theta}} = (X^TX)^{-1}X^T\mathbf{y}$

#### Diagram: Linear Regression Visualizer

<details markdown="1">
<summary>Linear Regression Interactive Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand linear regression as finding the best-fit line/plane by minimizing squared errors

Visual elements:
- Main panel: Scatter plot of data points
- Fitted line/plane (2D or 3D)
- Residual lines from points to fitted line
- Loss function surface (for 2D: 3D surface of loss vs w, b)
- Current parameter values display

Interactive controls:
- Drag data points to modify dataset
- Manual sliders for w and b to see effect on fit and loss
- "Fit OLS" button to compute optimal parameters
- Toggle residual visualization
- Switch between 1D (line fit) and 2D (plane fit) examples

Default parameters:
- 2D scatter with linear relationship plus noise
- 20 data points
- Canvas: responsive

Behavior:
- Real-time residual and loss computation
- Show that OLS solution is at minimum of loss surface
- Display R² score for goodness of fit
- Highlight vertical (y) residuals vs perpendicular distance
- Show normal equations computation

Implementation: p5.js with regression computation
</details>

## Regularization

**Regularization** adds a penalty term to prevent overfitting by constraining model complexity.

### Why Regularize?

Without regularization, models can:

- Overfit to noise in training data
- Have large, unstable weights
- Perform poorly on new data
- Fail when features are correlated (multicollinearity)

### Ridge Regression (L2)

**Ridge regression** adds an L2 penalty on weights:

$J(\boldsymbol{\theta}) = \|X\boldsymbol{\theta} - \mathbf{y}\|^2 + \alpha\|\boldsymbol{\theta}\|^2$

where:

- $\alpha \geq 0$ is the regularization strength
- $\|\boldsymbol{\theta}\|^2 = \sum_j \theta_j^2$ (typically excluding bias)

The closed-form solution:

$\hat{\boldsymbol{\theta}} = (X^TX + \alpha I)^{-1}X^T\mathbf{y}$

Key properties:

- Always invertible (even if $X^TX$ is singular)
- Shrinks weights toward zero
- Keeps all features (no feature selection)
- Equivalent to adding "fake" data points

### Lasso Regression (L1)

**Lasso regression** uses an L1 penalty:

$J(\boldsymbol{\theta}) = \|X\boldsymbol{\theta} - \mathbf{y}\|^2 + \alpha\|\boldsymbol{\theta}\|_1$

where:

- $\|\boldsymbol{\theta}\|_1 = \sum_j |\theta_j|$ is the L1 norm

Key properties:

- Produces sparse solutions (some weights exactly zero)
- Performs automatic feature selection
- No closed-form solution (requires iterative optimization)
- Useful when only few features are truly relevant

| Property | Ridge (L2) | Lasso (L1) |
|----------|-----------|------------|
| Penalty | $\sum \theta_j^2$ | $\sum |\theta_j|$ |
| Sparsity | No | Yes (feature selection) |
| Closed-form | Yes | No |
| Multicollinearity | Handles well | Picks one of correlated features |
| Geometry | Circular constraint | Diamond constraint |

#### Diagram: Regularization Geometry

<details markdown="1">
<summary>Regularization Geometry Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Understand how L1 and L2 regularization constrain weights geometrically and why L1 produces sparsity

Visual elements:
- 2D parameter space (θ₁ vs θ₂)
- Contour lines of unregularized loss function
- L2 constraint region (circle)
- L1 constraint region (diamond)
- OLS solution point
- Regularized solution point
- Regularization path as α varies

Interactive controls:
- Slider for regularization strength α
- Toggle between L1 and L2
- Drag ellipse center (changing OLS solution location)
- "Show Regularization Path" toggle
- Animation of solution as α increases

Default parameters:
- OLS solution at (3, 2)
- Moderate α
- Canvas: responsive

Behavior:
- Show how constraint region intersects loss contours
- Demonstrate L1 hitting corners (sparse solution)
- Animate solution moving toward origin as α increases
- Show weight values and their evolution
- Display sparsity count for L1

Implementation: p5.js with geometric visualization
</details>

## Gradient-Based Optimization

When closed-form solutions don't exist or are too expensive, we use iterative **gradient descent**.

### Gradient Vector

The **gradient vector** of a scalar function $f : \mathbb{R}^d \to \mathbb{R}$ collects all partial derivatives:

$\nabla f(\boldsymbol{\theta}) = \begin{bmatrix} \frac{\partial f}{\partial \theta_1} \\ \frac{\partial f}{\partial \theta_2} \\ \vdots \\ \frac{\partial f}{\partial \theta_d} \end{bmatrix}$

Key properties:

- Points in the direction of steepest increase
- Magnitude indicates rate of change
- At a minimum, $\nabla f = \mathbf{0}$

For linear regression loss $J(\boldsymbol{\theta}) = \|X\boldsymbol{\theta} - \mathbf{y}\|^2$:

$\nabla J(\boldsymbol{\theta}) = 2X^T(X\boldsymbol{\theta} - \mathbf{y})$

### Gradient Descent Algorithm

**Gradient descent** iteratively moves in the negative gradient direction:

$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta \nabla J(\boldsymbol{\theta}^{(t)})$

where:

- $\eta > 0$ is the **learning rate** (step size)
- $t$ is the iteration number
- We move against the gradient to decrease the function

### Batch Gradient Descent

**Batch gradient descent** uses all training samples to compute the gradient at each step:

```
Initialize θ randomly
For t = 1, 2, ..., max_iterations:
    gradient = (2/n) * X^T @ (X @ θ - y)  # Full batch gradient
    θ = θ - η * gradient
    If ||gradient|| < tolerance:
        break
Return θ
```

Characteristics:

- Deterministic updates (same path from same initialization)
- Smooth convergence
- Expensive per iteration for large datasets
- May be slow for large $n$

### Learning Rate

The **learning rate** $\eta$ controls step size and critically affects convergence:

| Learning Rate | Behavior |
|---------------|----------|
| Too small | Very slow convergence, may take forever |
| Just right | Smooth, efficient convergence |
| Too large | Oscillation, overshooting |
| Way too large | Divergence (loss increases) |

Choosing the learning rate:

- Start with $\eta = 0.01$ or $0.001$
- Use learning rate schedules (decay over time)
- Adaptive methods (Adam, RMSprop) adjust per-parameter

#### Diagram: Gradient Descent Visualizer

<details markdown="1">
<summary>Gradient Descent Interactive Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how gradient descent navigates the loss surface and how learning rate affects convergence

Visual elements:
- Main panel: 3D surface plot of loss function J(θ₁, θ₂)
- Contour plot view (top-down)
- Current position marker
- Gradient arrow at current position
- Path traced by optimization
- Loss vs iteration plot

Interactive controls:
- Learning rate slider (0.001 to 1.0, log scale)
- "Step" button for single iteration
- "Run" button for continuous optimization
- "Reset" button to reinitialize
- Starting point selector (click on surface)
- Loss function selector (quadratic, Rosenbrock, etc.)

Default parameters:
- Simple quadratic loss with single minimum
- Learning rate = 0.1
- Starting point away from minimum
- Canvas: responsive multi-view

Behavior:
- Show gradient vector at each step
- Trace optimization path on contour plot
- Display convergence (or divergence) in loss plot
- Demonstrate oscillation with high learning rate
- Show slow progress with low learning rate
- Count iterations to convergence

Implementation: p5.js with 3D surface rendering (WEBGL)
</details>

### Variants of Gradient Descent

Beyond batch gradient descent, several variants improve efficiency:

**Stochastic Gradient Descent (SGD):**

- Uses single sample per update: $\nabla J_i(\boldsymbol{\theta})$
- Fast iterations but noisy updates
- Can escape local minima due to noise

**Mini-batch Gradient Descent:**

- Uses subset of samples (batch size $b$): $\frac{1}{b}\sum_{i \in B}\nabla J_i(\boldsymbol{\theta})$
- Balances noise and efficiency
- Standard in deep learning (batch size 32-256)

**Momentum:**

- Accumulates velocity: $\mathbf{v}^{(t+1)} = \beta\mathbf{v}^{(t)} + \nabla J(\boldsymbol{\theta}^{(t)})$
- Update: $\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta\mathbf{v}^{(t+1)}$
- Accelerates through flat regions, dampens oscillations

| Method | Per-Iteration Cost | Convergence | Noise |
|--------|-------------------|-------------|-------|
| Batch GD | $O(nd)$ | Smooth | None |
| SGD | $O(d)$ | Noisy | High |
| Mini-batch | $O(bd)$ | Moderate | Moderate |

#### Diagram: Learning Rate Effect Visualizer

<details markdown="1">
<summary>Learning Rate Effect on Convergence</summary>
Type: microsim

Bloom Taxonomy Level: Evaluate

Learning Objective: Understand how learning rate choice affects optimization behavior through side-by-side comparison

Visual elements:
- Three parallel contour plots with different learning rates
- Path traces showing optimization trajectories
- Loss curves for each learning rate
- Status indicators: "Converging", "Oscillating", "Diverging"
- Step count to convergence

Interactive controls:
- Individual learning rate sliders for each panel
- Preset buttons: "Too Small", "Just Right", "Too Large"
- Shared "Run All" button
- "Reset All" button
- Speed slider for animation

Default parameters:
- Left: η = 0.01 (too small)
- Center: η = 0.1 (good)
- Right: η = 0.5 (too large)
- Same starting point for all

Behavior:
- Simultaneous animation of all three optimizations
- Real-time loss comparison plot
- Show oscillation in too-large case
- Show slow progress in too-small case
- Identify optimal learning rate region
- Display final loss values

Implementation: p5.js with synchronized animations
</details>

## Putting It All Together

Here's a complete machine learning pipeline using these concepts:

```python
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import Ridge, Lasso

# Load data
X_train, y_train = load_data()  # n×d feature matrix, n×1 target

# Step 1: Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Step 2: PCA for dimensionality reduction
pca = PCA(n_components=0.95)  # Keep 95% variance
X_reduced = pca.fit_transform(X_scaled)
print(f"Reduced from {X_train.shape[1]} to {X_reduced.shape[1]} dimensions")

# Step 3: Examine variance explained
import matplotlib.pyplot as plt
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.bar(range(len(pca.explained_variance_ratio_)),
        pca.explained_variance_ratio_)
plt.title('Scree Plot')
plt.subplot(1, 2, 2)
plt.plot(np.cumsum(pca.explained_variance_ratio_))
plt.axhline(0.95, color='r', linestyle='--')
plt.title('Cumulative Variance Explained')
plt.show()

# Step 4: Ridge regression
ridge = Ridge(alpha=1.0)
ridge.fit(X_reduced, y_train)

# Step 5: Lasso for feature selection (on original features)
lasso = Lasso(alpha=0.1)
lasso.fit(X_scaled, y_train)
selected_features = np.where(lasso.coef_ != 0)[0]
print(f"Lasso selected {len(selected_features)} features")

# Step 6: Manual gradient descent implementation
def gradient_descent(X, y, learning_rate=0.01, n_iterations=1000):
    n, d = X.shape
    theta = np.zeros(d)
    losses = []

    for i in range(n_iterations):
        # Compute predictions
        y_pred = X @ theta

        # Compute gradient
        gradient = (2/n) * X.T @ (y_pred - y)

        # Update parameters
        theta = theta - learning_rate * gradient

        # Track loss
        loss = np.mean((y_pred - y)**2)
        losses.append(loss)

    return theta, losses

# Add bias column and run gradient descent
X_with_bias = np.c_[np.ones(len(X_reduced)), X_reduced]
theta_gd, losses = gradient_descent(X_with_bias, y_train,
                                     learning_rate=0.1,
                                     n_iterations=500)
```

#### Diagram: ML Pipeline Workflow

<details markdown="1">
<summary>Machine Learning Pipeline Workflow</summary>
Type: workflow

Bloom Taxonomy Level: Create

Learning Objective: Understand the complete ML pipeline from raw data to trained model

Visual style: Flowchart with processing stages

Steps:
1. Start: "Raw Data"
   Hover text: "Original features, possibly different scales and units"

2. Process: "Standardization"
   Hover text: "Transform to zero mean, unit variance"
   - Input: Raw features X
   - Output: Standardized Z

3. Process: "PCA (optional)"
   Hover text: "Reduce dimensionality while preserving variance"
   - Input: Standardized data Z
   - Output: Reduced data (k dimensions)
   - Decision: Scree plot analysis

4. Process: "Train/Test Split"
   Hover text: "Hold out data for evaluation"

5. Process: "Model Selection"
   Hover text: "Choose algorithm and hyperparameters"
   - Branch A: OLS (no regularization)
   - Branch B: Ridge (L2)
   - Branch C: Lasso (L1)

6. Process: "Optimization"
   Hover text: "Find optimal parameters"
   - Closed-form (Ridge) or
   - Gradient descent (Lasso, Neural Networks)

7. Process: "Evaluation"
   Hover text: "Assess on test set"
   - Metrics: MSE, R², etc.

8. End: "Trained Model"

Color coding:
- Blue: Data processing
- Green: Modeling
- Orange: Optimization
- Purple: Evaluation

Interactive:
- Click nodes to see code examples
- Hover for detailed explanations

Implementation: D3.js or Mermaid.js
</details>

## Summary

This chapter connected linear algebra to machine learning:

**Data Representation:**

- **Feature vectors** represent samples as $d$-dimensional vectors
- **Data matrices** organize $n$ samples as rows, $d$ features as columns
- Consistent conventions are crucial for correct matrix operations

**Statistical Foundations:**

- **Standardization** ensures comparable scales and improves algorithm performance
- **Covariance matrices** capture feature relationships: $\Sigma = \frac{1}{n-1}\tilde{X}^T\tilde{X}$
- **Correlation matrices** are standardized covariances with values in $[-1, 1]$

**Dimensionality Reduction:**

- **PCA** finds directions of maximum variance via eigendecomposition
- **Principal components** are eigenvectors of the covariance matrix
- **Scree plots** help choose the number of components to retain
- Use SVD for numerical stability in practice

**Regression:**

- **Linear regression** minimizes squared error: $J = \|X\boldsymbol{\theta} - \mathbf{y}\|^2$
- **Design matrices** incorporate the bias term
- **Ridge (L2)** shrinks weights, handles multicollinearity
- **Lasso (L1)** produces sparse solutions for feature selection

**Optimization:**

- **Gradient vectors** point in the direction of steepest increase
- **Gradient descent** iteratively minimizes: $\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta\nabla J$
- **Learning rate** is critical: too small = slow, too large = diverge
- Batch, mini-batch, and stochastic variants trade off noise vs. efficiency

??? question "Self-Check: Why does PCA use the covariance matrix of centered data rather than the original data?"
    Centering (subtracting the mean) is essential because PCA seeks directions of maximum variance from the data's center of mass. Without centering, the first principal component would largely capture the offset from the origin rather than the true variation structure. The covariance matrix of centered data measures how features vary around their means, which is exactly what PCA needs to find the principal directions of spread.
