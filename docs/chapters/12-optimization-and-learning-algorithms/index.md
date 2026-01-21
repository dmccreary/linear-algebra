---
title: Optimization and Learning Algorithms
description: The linear algebra foundations of optimization algorithms powering machine learning
generated_by: claude skill chapter-content-generator
date: 2026-01-17 18:30:00
version: 0.03
---

# Optimization and Learning Algorithms

## Summary

Optimization is the engine of machine learning, and linear algebra provides the tools to understand and improve optimization algorithms. This chapter covers the Hessian matrix, convexity, Newton's method, and modern adaptive optimizers like Adam and RMSprop. You will also learn constrained optimization with Lagrange multipliers and KKT conditions.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Hessian Matrix
2. Convexity
3. Convex Function
4. Newtons Method
5. Quasi-Newton Method
6. BFGS Algorithm
7. SGD
8. Mini-Batch SGD
9. Momentum
10. Adam Optimizer
11. RMSprop
12. Lagrange Multiplier
13. Constrained Optimization
14. KKT Conditions

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 9: Machine Learning Foundations](../09-machine-learning-foundations/index.md)

---

## Introduction

Training machine learning models fundamentally requires solving optimization problems—finding the parameters that minimize a loss function. From simple linear regression to complex deep neural networks, optimization algorithms determine both the quality and efficiency of learning. Linear algebra provides essential tools for understanding these algorithms:

- **Gradients** indicate the direction of steepest ascent
- **Hessians** capture curvature information
- **Matrix operations** enable efficient computation
- **Eigenvalue analysis** reveals optimization landscapes

This chapter builds from foundational concepts like convexity through classical algorithms like Newton's method to modern adaptive optimizers used in deep learning.

## Convexity and Convex Functions

Before diving into optimization algorithms, we need to understand the landscape we're optimizing over. **Convexity** is the most important property that makes optimization tractable.

### What Makes a Set Convex?

A set $S$ is **convex** if for any two points $\mathbf{x}, \mathbf{y} \in S$, the line segment connecting them lies entirely within $S$:

$\lambda \mathbf{x} + (1 - \lambda) \mathbf{y} \in S \quad \text{for all } \lambda \in [0, 1]$

Intuitively, a convex set has no "dents" or "holes."

| Set Type | Examples | Convex? |
|----------|----------|---------|
| Ball/Sphere interior | $\{\mathbf{x} : \|\mathbf{x}\| \leq r\}$ | Yes |
| Hyperplane | $\{\mathbf{x} : \mathbf{a}^\top \mathbf{x} = b\}$ | Yes |
| Half-space | $\{\mathbf{x} : \mathbf{a}^\top \mathbf{x} \leq b\}$ | Yes |
| Donut/Annulus | $\{\mathbf{x} : r_1 \leq \|\mathbf{x}\| \leq r_2\}$ | No |

### Convex Functions

A function $f: \mathbb{R}^n \to \mathbb{R}$ is **convex** if its domain is a convex set and for all points in its domain:

$f(\lambda \mathbf{x} + (1-\lambda) \mathbf{y}) \leq \lambda f(\mathbf{x}) + (1-\lambda) f(\mathbf{y})$

where:

- $\mathbf{x}, \mathbf{y}$ are any two points in the domain
- $\lambda \in [0, 1]$ is a mixing coefficient

Geometrically, the function lies below the chord connecting any two points on its graph—it "curves upward."

#### Diagram: Convex Function Visualizer

<iframe src="../../sims/convex-function-visualizer/main.html" height="482px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Convex Function Visualizer</summary>
Type: microsim

Learning objective: Understand the geometric definition of convexity by visualizing the chord condition (Bloom: Understand)

Visual elements:
- 2D plot showing function curve f(x)
- Two draggable points on the curve (x1, f(x1)) and (x2, f(x2))
- Line segment (chord) connecting the two points
- Shaded region between chord and curve
- Color indicator: green if convex condition satisfied, red otherwise

Interactive controls:
- Dropdown to select function: x², |x|, x⁴, x² + sin(x), -x² (non-convex)
- Draggable points to adjust x1 and x2 positions
- Slider for lambda (0 to 1) to show interpolation point
- Display showing f(λx+(1-λ)y) vs λf(x)+(1-λ)f(y)

Canvas layout: 700x500px with function plot area and value comparison

Behavior:
- As user drags points, chord updates in real-time
- Lambda slider moves a point along chord and on curve to compare heights
- Text displays the convexity inequality with current values
- Red highlight appears when a non-convex function violates the condition

Implementation: p5.js with interactive draggable elements
</details>

### First-Order Condition for Convexity

For differentiable functions, convexity has an equivalent characterization using the gradient:

$f(\mathbf{y}) \geq f(\mathbf{x}) + \nabla f(\mathbf{x})^\top (\mathbf{y} - \mathbf{x})$

This says the function always lies above its tangent hyperplane—the linearization underestimates the function everywhere.

### Second-Order Condition for Convexity

For twice-differentiable functions, convexity is equivalent to the Hessian being positive semidefinite everywhere:

$\nabla^2 f(\mathbf{x}) \succeq 0 \quad \text{for all } \mathbf{x}$

This connects convexity to the eigenvalues of the Hessian matrix.

## The Hessian Matrix

The **Hessian matrix** captures all second-order partial derivative information of a function. For a function $f: \mathbb{R}^n \to \mathbb{R}$:

#### Hessian Matrix Definition

$\mathbf{H} = \nabla^2 f(\mathbf{x}) = \begin{bmatrix} \frac{\partial^2 f}{\partial x_1^2} & \frac{\partial^2 f}{\partial x_1 \partial x_2} & \cdots & \frac{\partial^2 f}{\partial x_1 \partial x_n} \\ \frac{\partial^2 f}{\partial x_2 \partial x_1} & \frac{\partial^2 f}{\partial x_2^2} & \cdots & \frac{\partial^2 f}{\partial x_2 \partial x_n} \\ \vdots & \vdots & \ddots & \vdots \\ \frac{\partial^2 f}{\partial x_n \partial x_1} & \frac{\partial^2 f}{\partial x_n \partial x_2} & \cdots & \frac{\partial^2 f}{\partial x_n^2} \end{bmatrix}$

where:

- $\mathbf{H}$ is an $n \times n$ symmetric matrix (if $f$ is twice continuously differentiable)
- $H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}$ is the $(i,j)$ entry
- Diagonal entries are second derivatives with respect to single variables
- Off-diagonal entries capture how the gradient changes in one direction as we move in another

### Eigenvalue Interpretation

The eigenvalues of the Hessian reveal the curvature of the function:

| Eigenvalue Pattern | Curvature Type | Optimization Implication |
|-------------------|----------------|-------------------------|
| All positive | Bowl (minimum) | Local minimum found |
| All negative | Dome (maximum) | Local maximum |
| Mixed signs | Saddle point | Neither min nor max |
| Zero eigenvalue | Flat direction | Infinitely many solutions |

#### Diagram: Hessian and Curvature Visualizer

<iframe src="../../sims/hessian-curvature-visualizer/main.html" height="582px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Hessian and Curvature Visualizer</summary>
Type: microsim

Learning objective: Connect Hessian eigenvalues to geometric curvature of 2D functions (Bloom: Analyze)

Visual elements:
- 3D surface plot of f(x,y)
- Contour plot below the surface
- Current point indicator (draggable)
- Principal curvature directions shown as arrows at current point
- Eigenvalue display with color coding

Interactive controls:
- Function selector: x²+y², x²-y² (saddle), x²+0.1y², 2x²+y²
- Draggable point on contour plot to change evaluation location
- Toggle to show/hide principal directions
- Toggle to show local quadratic approximation

Canvas layout: 800x600px with 3D plot and eigenvector overlay

Behavior:
- As point moves, Hessian is recomputed and displayed as matrix
- Eigenvalues update with color (green=positive, red=negative)
- Principal direction arrows scale with eigenvalue magnitude
- Quadratic approximation surface overlays at current point

Implementation: p5.js with WEBGL for 3D rendering
</details>

### The Hessian in Taylor Expansion

The Hessian appears in the second-order Taylor expansion:

$f(\mathbf{x} + \mathbf{d}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^\top \mathbf{d} + \frac{1}{2} \mathbf{d}^\top \mathbf{H} \mathbf{d}$

This quadratic approximation is the foundation of Newton's method.

## Newton's Method for Optimization

**Newton's method** uses second-order information to find where the gradient equals zero. By setting the gradient of the quadratic approximation to zero:

#### Newton Update Rule

$\mathbf{x}_{k+1} = \mathbf{x}_k - \mathbf{H}^{-1} \nabla f(\mathbf{x}_k)$

where:

- $\mathbf{x}_k$ is the current iterate
- $\mathbf{H} = \nabla^2 f(\mathbf{x}_k)$ is the Hessian at the current point
- $\nabla f(\mathbf{x}_k)$ is the gradient at the current point
- The term $\mathbf{H}^{-1} \nabla f$ is called the **Newton direction**

### Comparison with Gradient Descent

| Property | Gradient Descent | Newton's Method |
|----------|-----------------|-----------------|
| Update direction | $-\nabla f$ (steepest descent) | $-\mathbf{H}^{-1} \nabla f$ (Newton direction) |
| Step size | Requires tuning $\alpha$ | Natural step size of 1 |
| Convergence rate | Linear | Quadratic (near solution) |
| Cost per iteration | $O(n)$ gradient | $O(n^3)$ Hessian solve |
| Condition number sensitivity | High | Low |

Newton's method effectively rescales the problem to have uniform curvature in all directions, making it condition-number independent.

#### Diagram: Newton vs Gradient Descent

<iframe src="../../sims/newton-vs-gradient-descent/main.html" height="552px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Newton vs Gradient Descent Comparison</summary>
Type: microsim

Learning objective: Compare convergence behavior of gradient descent and Newton's method on ill-conditioned problems (Bloom: Analyze)

Visual elements:
- Contour plot of 2D quadratic function with adjustable condition number
- Two optimization paths: gradient descent (blue) and Newton (orange)
- Current iterate markers for both methods
- Iteration counter and function value display

Interactive controls:
- Slider: Condition number (1 to 100)
- Slider: Learning rate for gradient descent (0.001 to 0.1)
- Button: "Step" (advance one iteration)
- Button: "Run to Convergence"
- Button: "Reset"
- Starting point selector (click on contour plot)

Canvas layout: 700x600px with contour plot and convergence comparison

Behavior:
- Newton's method converges in 1 step for quadratics
- Gradient descent shows zig-zag pattern for high condition numbers
- Display shows iteration count to reach tolerance
- Side panel shows current gradient norm for both methods

Implementation: p5.js with eigenvalue-based ellipse generation
</details>

### Challenges with Newton's Method

Despite quadratic convergence, Newton's method has practical limitations:

- **Hessian computation:** $O(n^2)$ storage and $O(n^3)$ inversion
- **Non-convexity:** May converge to saddle points or maxima
- **Numerical stability:** Requires Hessian to be positive definite
- **Scalability:** Impractical for deep learning with millions of parameters

These limitations motivate quasi-Newton methods.

## Quasi-Newton Methods

**Quasi-Newton methods** approximate the Hessian (or its inverse) using only gradient information, avoiding explicit Hessian computation.

### The Secant Equation

Quasi-Newton methods build approximations $\mathbf{B}_k \approx \mathbf{H}_k$ satisfying the **secant equation**:

$\mathbf{B}_{k+1} \mathbf{s}_k = \mathbf{y}_k$

where:

- $\mathbf{s}_k = \mathbf{x}_{k+1} - \mathbf{x}_k$ is the step taken
- $\mathbf{y}_k = \nabla f(\mathbf{x}_{k+1}) - \nabla f(\mathbf{x}_k)$ is the gradient difference
- This equation states that $\mathbf{B}_{k+1}$ correctly maps the step to the gradient change

### The BFGS Algorithm

The **Broyden-Fletcher-Goldfarb-Shanno (BFGS)** algorithm is the most successful quasi-Newton method. It directly maintains an approximation $\mathbf{M}_k \approx \mathbf{H}_k^{-1}$:

#### BFGS Update Formula

$\mathbf{M}_{k+1} = \left(\mathbf{I} - \rho_k \mathbf{s}_k \mathbf{y}_k^\top\right) \mathbf{M}_k \left(\mathbf{I} - \rho_k \mathbf{y}_k \mathbf{s}_k^\top\right) + \rho_k \mathbf{s}_k \mathbf{s}_k^\top$

where:

- $\rho_k = \frac{1}{\mathbf{y}_k^\top \mathbf{s}_k}$
- $\mathbf{M}_k$ is the current inverse Hessian approximation
- $\mathbf{s}_k$ and $\mathbf{y}_k$ are the step and gradient difference

Key properties of BFGS:

- Maintains positive definiteness if initialized positive definite
- Converges superlinearly (faster than linear, slower than quadratic)
- Only requires gradient evaluations, not Hessian
- $O(n^2)$ storage and update cost

| Method | Hessian Cost | Storage | Convergence |
|--------|-------------|---------|-------------|
| Newton | $O(n^3)$ exact | $O(n^2)$ | Quadratic |
| BFGS | $O(n^2)$ approximate | $O(n^2)$ | Superlinear |
| L-BFGS | $O(mn)$ limited memory | $O(mn)$ | Superlinear |
| Gradient Descent | None | $O(n)$ | Linear |

L-BFGS (Limited-memory BFGS) stores only the $m$ most recent $(\mathbf{s}_k, \mathbf{y}_k)$ pairs, making it suitable for large-scale problems.

## Stochastic Gradient Descent

While Newton and quasi-Newton methods work well for moderate-sized problems, deep learning requires optimizing millions of parameters using billions of data points. **Stochastic Gradient Descent (SGD)** trades accuracy for efficiency.

### The SGD Algorithm

Instead of computing the full gradient over all training examples:

$\nabla f(\mathbf{x}) = \frac{1}{N} \sum_{i=1}^{N} \nabla f_i(\mathbf{x})$

SGD uses a single randomly selected example:

#### SGD Update Rule

$\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha \nabla f_{i_k}(\mathbf{x}_k)$

where:

- $\alpha$ is the learning rate
- $i_k$ is a randomly selected index from $\{1, \ldots, N\}$
- $\nabla f_{i_k}$ is the gradient for example $i_k$

The stochastic gradient is an **unbiased estimator** of the true gradient:

$\mathbb{E}[\nabla f_{i_k}(\mathbf{x})] = \nabla f(\mathbf{x})$

### Mini-Batch SGD

**Mini-batch SGD** balances the efficiency of single-sample SGD with the stability of full-batch gradient descent:

$\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha \cdot \frac{1}{|B_k|} \sum_{i \in B_k} \nabla f_i(\mathbf{x}_k)$

where:

- $B_k$ is a randomly sampled mini-batch of size $|B_k|$ (typically 32-512)
- The average reduces gradient variance by factor $|B_k|$

| Batch Size | Gradient Variance | GPU Utilization | Generalization |
|------------|------------------|-----------------|----------------|
| 1 (pure SGD) | High | Poor | Often good |
| 32-64 | Moderate | Good | Good |
| 256-512 | Low | Excellent | May need tuning |
| Full batch | Zero | Memory limited | May overfit |

#### Diagram: SGD Trajectory Visualizer

<iframe src="../../sims/sgd-trajectory-visualizer/main.html" height="552px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>SGD Trajectory Visualizer</summary>
Type: microsim

Learning objective: Understand how batch size affects SGD convergence behavior (Bloom: Apply)

Visual elements:
- 2D contour plot of loss landscape
- Optimization trajectory showing recent steps
- "True gradient" arrow and "stochastic gradient" arrow at current point
- Noise cloud visualization around true gradient

Interactive controls:
- Slider: Batch size (1, 8, 32, 128, full)
- Slider: Learning rate (0.001 to 0.5)
- Button: "Step" (one update)
- Button: "Run 100 steps"
- Button: "Reset"
- Toggle: Show gradient noise distribution

Canvas layout: 700x600px with contour plot and gradient visualization

Behavior:
- Small batch sizes show noisy, erratic paths
- Large batch sizes show smoother convergence
- Display running average of gradient norm
- Show variance estimate of stochastic gradient

Implementation: p5.js with random gradient noise simulation
</details>

## Momentum-Based Optimization

Pure SGD can oscillate in ravines—directions where the curvature differs significantly. **Momentum** addresses this by accumulating gradient information across iterations.

### Classical Momentum

The momentum update maintains a velocity vector:

#### Momentum Update

$\mathbf{v}_{k+1} = \beta \mathbf{v}_k + \nabla f(\mathbf{x}_k)$

$\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha \mathbf{v}_{k+1}$

where:

- $\mathbf{v}_k$ is the velocity (accumulated gradient)
- $\beta \in [0, 1)$ is the momentum coefficient (typically 0.9)
- $\alpha$ is the learning rate

Momentum has a physical interpretation: the parameters move like a ball rolling downhill with friction. The ball builds up speed in consistent gradient directions while damping oscillations.

### Nesterov Accelerated Gradient

**Nesterov momentum** looks ahead before computing the gradient:

$\mathbf{v}_{k+1} = \beta \mathbf{v}_k + \nabla f(\mathbf{x}_k - \alpha \beta \mathbf{v}_k)$

$\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha \mathbf{v}_{k+1}$

This "lookahead" provides a correction that improves convergence, especially near the optimum.

#### Diagram: Momentum Dynamics

<iframe src="../../sims/momentum-dynamics-visualizer/main.html" height="552px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Momentum Dynamics Visualizer</summary>
Type: microsim

Learning objective: Visualize how momentum accumulates and dampens oscillations (Bloom: Understand)

Visual elements:
- 2D contour plot with elongated elliptical contours (ill-conditioned)
- Three simultaneous optimization paths: SGD (blue), Momentum (green), Nesterov (orange)
- Velocity vectors shown as arrows at current positions
- Trace of recent positions for each method

Interactive controls:
- Slider: Momentum coefficient beta (0 to 0.99)
- Slider: Learning rate (0.001 to 0.1)
- Button: "Step"
- Button: "Run to convergence"
- Button: "Reset"
- Checkbox: Show velocity vectors

Canvas layout: 750x600px with contour visualization

Behavior:
- SGD shows characteristic zig-zag oscillation
- Momentum shows smooth acceleration toward minimum
- Nesterov shows slightly faster convergence
- Velocity vectors grow in consistent directions, shrink during oscillation

Implementation: p5.js with physics-based animation
</details>

## Adaptive Learning Rate Methods

Different parameters often require different learning rates. **Adaptive methods** automatically adjust per-parameter learning rates based on historical gradient information.

### RMSprop

**RMSprop** (Root Mean Square Propagation) maintains a running average of squared gradients:

#### RMSprop Update

$\mathbf{s}_{k+1} = \gamma \mathbf{s}_k + (1 - \gamma) \nabla f(\mathbf{x}_k)^2$

$\mathbf{x}_{k+1} = \mathbf{x}_k - \frac{\alpha}{\sqrt{\mathbf{s}_{k+1} + \epsilon}} \odot \nabla f(\mathbf{x}_k)$

where:

- $\mathbf{s}_k$ is the running average of squared gradients (element-wise)
- $\gamma \approx 0.9$ is the decay rate
- $\epsilon \approx 10^{-8}$ prevents division by zero
- $\odot$ denotes element-wise multiplication
- The division is element-wise

RMSprop divides the learning rate by the root mean square of recent gradients, effectively:

- Reducing step size for parameters with large gradients
- Increasing step size for parameters with small gradients

### The Adam Optimizer

**Adam** (Adaptive Moment Estimation) combines momentum with RMSprop:

#### Adam Update

$\mathbf{m}_{k+1} = \beta_1 \mathbf{m}_k + (1 - \beta_1) \nabla f(\mathbf{x}_k)$

$\mathbf{v}_{k+1} = \beta_2 \mathbf{v}_k + (1 - \beta_2) \nabla f(\mathbf{x}_k)^2$

$\hat{\mathbf{m}} = \frac{\mathbf{m}_{k+1}}{1 - \beta_1^{k+1}}, \quad \hat{\mathbf{v}} = \frac{\mathbf{v}_{k+1}}{1 - \beta_2^{k+1}}$

$\mathbf{x}_{k+1} = \mathbf{x}_k - \frac{\alpha}{\sqrt{\hat{\mathbf{v}}} + \epsilon} \odot \hat{\mathbf{m}}$

where:

- $\mathbf{m}_k$ is the first moment (mean) estimate
- $\mathbf{v}_k$ is the second moment (variance) estimate
- $\beta_1 \approx 0.9$ is the first moment decay
- $\beta_2 \approx 0.999$ is the second moment decay
- $\hat{\mathbf{m}}, \hat{\mathbf{v}}$ are bias-corrected estimates

The bias correction compensates for initialization at zero, which otherwise underestimates moments early in training.

| Optimizer | First Moment | Second Moment | Bias Correction |
|-----------|--------------|---------------|-----------------|
| SGD | No | No | N/A |
| Momentum | Yes | No | No |
| RMSprop | No | Yes | No |
| Adam | Yes | Yes | Yes |
| AdaGrad | No | Yes (cumulative) | No |

#### Diagram: Optimizer Comparison Arena

<iframe src="../../sims/optimizer-comparison-arena/main.html" height="582px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Optimizer Comparison Arena</summary>
Type: microsim

Learning objective: Compare convergence behavior of different optimizers on various loss landscapes (Bloom: Evaluate)

Visual elements:
- 2D loss landscape (selectable)
- Multiple optimization paths: SGD, Momentum, RMSprop, Adam
- Color-coded trajectories with position markers
- Loss vs iteration plot below main visualization

Interactive controls:
- Dropdown: Loss landscape (Quadratic, Rosenbrock, Beale, Saddle)
- Sliders for each optimizer's hyperparameters
- Button: "Race!" (run all optimizers simultaneously)
- Button: "Reset"
- Checkboxes to enable/disable each optimizer

Canvas layout: 800x700px with landscape and convergence plot

Behavior:
- All optimizers start from same initial point
- Animate simultaneous optimization
- Display current loss value for each
- Declare "winner" when first reaches tolerance
- Show iteration count for each optimizer

Implementation: p5.js with multiple optimizer state tracking
</details>

### Python Implementation

```python
import numpy as np

class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = None  # First moment
        self.v = None  # Second moment
        self.t = 0     # Time step

    def step(self, params, grads):
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)

        self.t += 1

        # Update biased first and second moment estimates
        self.m = self.beta1 * self.m + (1 - self.beta1) * grads
        self.v = self.beta2 * self.v + (1 - self.beta2) * grads**2

        # Bias correction
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)

        # Update parameters
        params -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
        return params
```

## Constrained Optimization

Many optimization problems have constraints—parameter bounds, equality requirements, or inequality restrictions. **Constrained optimization** finds optima while satisfying these constraints.

### Problem Formulation

A general constrained optimization problem:

$\min_{\mathbf{x}} f(\mathbf{x})$

subject to:

- $g_i(\mathbf{x}) \leq 0$ for $i = 1, \ldots, m$ (inequality constraints)
- $h_j(\mathbf{x}) = 0$ for $j = 1, \ldots, p$ (equality constraints)

### Lagrange Multipliers

For equality-constrained problems, **Lagrange multipliers** convert the constrained problem to an unconstrained one.

Consider minimizing $f(\mathbf{x})$ subject to $h(\mathbf{x}) = 0$. We form the **Lagrangian**:

#### Lagrangian Function

$\mathcal{L}(\mathbf{x}, \lambda) = f(\mathbf{x}) + \lambda h(\mathbf{x})$

where:

- $\lambda$ is the Lagrange multiplier
- The optimal $(\mathbf{x}^*, \lambda^*)$ satisfies $\nabla_{\mathbf{x}} \mathcal{L} = 0$ and $\nabla_\lambda \mathcal{L} = 0$

The condition $\nabla_{\mathbf{x}} \mathcal{L} = 0$ gives:

$\nabla f(\mathbf{x}^*) = -\lambda \nabla h(\mathbf{x}^*)$

At the optimum, the gradient of $f$ is parallel to the constraint gradient—we can't improve $f$ while staying on the constraint surface.

#### Diagram: Lagrange Multiplier Geometry

<iframe src="../../sims/lagrange-multiplier-geometry/main.html" height="532px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Lagrange Multiplier Geometry</summary>
Type: microsim

Learning objective: Visualize the geometric interpretation of Lagrange multipliers (Bloom: Understand)

Visual elements:
- 2D contour plot of objective function f(x,y)
- Constraint curve h(x,y) = 0 (bold line)
- Gradient vectors: ∇f at selected point (blue arrow)
- Constraint normal: ∇h at selected point (red arrow)
- Highlighted optimal point where gradients are parallel

Interactive controls:
- Draggable point along constraint curve
- Toggle: Show gradient field of f
- Toggle: Show constraint normal field
- Button: "Find Optimum" (animate to solution)
- Display: Current f value, λ value

Canvas layout: 700x600px with contour and vector field

Behavior:
- As user drags point along constraint, show gradient angles
- Highlight when ∇f and ∇h become parallel
- Display computed λ = -||∇f||/||∇h|| at parallel point
- Animate optimization path along constraint

Implementation: p5.js with gradient computation
</details>

### KKT Conditions

The **Karush-Kuhn-Tucker (KKT) conditions** generalize Lagrange multipliers to include inequality constraints. For the problem with both equality and inequality constraints, the KKT conditions are:

#### KKT Conditions

1. **Stationarity:** $\nabla f(\mathbf{x}^*) + \sum_{i=1}^{m} \mu_i \nabla g_i(\mathbf{x}^*) + \sum_{j=1}^{p} \lambda_j \nabla h_j(\mathbf{x}^*) = 0$

2. **Primal feasibility:** $g_i(\mathbf{x}^*) \leq 0$ and $h_j(\mathbf{x}^*) = 0$

3. **Dual feasibility:** $\mu_i \geq 0$ for all $i$

4. **Complementary slackness:** $\mu_i g_i(\mathbf{x}^*) = 0$ for all $i$

where:

- $\mu_i$ are multipliers for inequality constraints
- $\lambda_j$ are multipliers for equality constraints
- Complementary slackness means either $\mu_i = 0$ or $g_i(\mathbf{x}^*) = 0$

| Condition | Meaning |
|-----------|---------|
| Stationarity | Gradient balance at optimum |
| Primal feasibility | Solution satisfies constraints |
| Dual feasibility | Inequality multipliers are non-negative |
| Complementary slackness | Inactive constraints have zero multipliers |

### Active Constraints

The **complementary slackness** condition is particularly important:

- If $g_i(\mathbf{x}^*) < 0$, the constraint is **inactive** and $\mu_i = 0$
- If $g_i(\mathbf{x}^*) = 0$, the constraint is **active** and may have $\mu_i > 0$

Inactive constraints don't affect the solution—they're not "binding."

#### Diagram: KKT Conditions Visualizer

<iframe src="../../sims/kkt-conditions-visualizer/main.html" height="552px" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>KKT Conditions Visualizer</summary>
Type: microsim

Learning objective: Understand KKT conditions for inequality-constrained optimization (Bloom: Analyze)

Visual elements:
- 2D contour plot of objective function
- Feasible region shaded (where all g_i ≤ 0)
- Constraint boundaries with active/inactive coloring
- Optimal point with gradient vectors
- KKT condition checklist with live status

Interactive controls:
- Draggable objective function center
- Toggle constraints on/off
- Button: "Solve" (find KKT point)
- Display: Multiplier values μ_i for each constraint

Canvas layout: 800x650px with visualization and KKT status panel

Behavior:
- Show feasible region as intersection of half-planes
- Animate solution finding
- Display which constraints are active at solution
- Show complementary slackness: μ_i = 0 for inactive constraints
- Color-code constraints: green (inactive), orange (active)

Implementation: p5.js with linear programming solver
</details>

## Applications in Machine Learning

### Regularized Optimization

Many machine learning problems add regularization terms that can be viewed through the lens of constrained optimization:

| Formulation | Constraint View | Effect |
|-------------|-----------------|--------|
| $\min f(\mathbf{x}) + \lambda\|\mathbf{x}\|_2^2$ | $\|\mathbf{x}\|_2 \leq r$ | L2 regularization (weight decay) |
| $\min f(\mathbf{x}) + \lambda\|\mathbf{x}\|_1$ | $\|\mathbf{x}\|_1 \leq r$ | L1 regularization (sparsity) |
| $\min f(\mathbf{x})$ s.t. $\|\mathbf{x}\|_2 = 1$ | Unit sphere | Normalized embeddings |

### Support Vector Machines

SVMs solve a constrained quadratic program:

$\min_{\mathbf{w}, b} \frac{1}{2}\|\mathbf{w}\|^2$

subject to $y_i(\mathbf{w}^\top \mathbf{x}_i + b) \geq 1$ for all training examples.

The KKT conditions reveal which training examples are **support vectors** (those with active constraints).

### Neural Network Constraints

Modern deep learning increasingly uses constrained optimization:

- **Spectral normalization:** Constrain weight matrix spectral norm
- **Gradient clipping:** Constrain gradient magnitude
- **Projected gradient descent:** Project onto feasible set after each step

## Summary

Optimization algorithms form the computational backbone of machine learning. This chapter covered:

**Foundational Concepts:**

- Convexity guarantees global optima are local optima
- The Hessian matrix captures curvature and determines convergence behavior
- Positive definite Hessians indicate convexity

**Classical Methods:**

- Newton's method uses the Hessian for quadratic convergence
- Quasi-Newton methods (BFGS) approximate the Hessian efficiently
- L-BFGS scales to large problems with limited memory

**Stochastic Methods:**

- SGD enables optimization with large datasets
- Mini-batches balance variance reduction with efficiency
- Momentum accelerates convergence and dampens oscillations

**Adaptive Methods:**

- RMSprop adapts learning rates using gradient magnitudes
- Adam combines momentum with adaptive rates
- Bias correction handles initialization effects

**Constrained Optimization:**

- Lagrange multipliers handle equality constraints
- KKT conditions extend to inequality constraints
- Complementary slackness identifies active constraints

## Self-Check Questions

??? question "Why does Newton's method converge faster than gradient descent?"
    Newton's method uses second-order (curvature) information from the Hessian to account for the shape of the objective function. While gradient descent takes steps proportional to the gradient magnitude, Newton's method takes steps that account for how quickly the gradient changes. In the quadratic approximation, Newton's method jumps directly to the minimum. For well-behaved functions near a minimum, this gives quadratic convergence: the number of correct digits roughly doubles each iteration.

??? question "What is the purpose of bias correction in Adam?"
    The first and second moment estimates in Adam are initialized to zero. In early iterations, these running averages are biased toward zero because they haven't accumulated enough gradient history. Bias correction divides by $(1 - \beta^t)$ to compensate, essentially scaling up the estimates early in training. As $t \to \infty$, the correction factor approaches 1 and has no effect.

??? question "Explain the geometric meaning of the KKT complementary slackness condition."
    Complementary slackness states that $\mu_i g_i(\mathbf{x}^*) = 0$ for each inequality constraint. This means either the constraint is inactive ($g_i < 0$) and its multiplier is zero ($\mu_i = 0$), or the constraint is active ($g_i = 0$) and the multiplier may be positive. Geometrically, only constraints that the solution "touches" can exert force on the solution. Constraints that are strictly satisfied (with slack) don't affect where the optimum lies.

??? question "Why is mini-batch SGD preferred over pure SGD in practice?"
    Pure SGD (batch size 1) has high variance in gradient estimates, leading to noisy optimization paths. While this noise can help escape local minima, it also slows convergence and makes training unstable. Mini-batches reduce variance by averaging over multiple examples while still being much faster than full-batch gradient descent. Additionally, mini-batches enable efficient GPU parallelization—processing 32 examples takes nearly the same time as 1 on modern hardware.
