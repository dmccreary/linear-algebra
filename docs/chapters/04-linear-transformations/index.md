---
title: Linear Transformations
description: Understanding matrices as geometric transformations including rotation, scaling, shearing, and projection, with applications to computer graphics and neural networks
generated_by: claude skill chapter-content-generator
date: 2026-01-17 16:45:00
version: 0.03
status: draft
---

# Linear Transformations

## Summary

This chapter reveals how matrices represent transformations, connecting algebraic operations to geometric intuition. You will learn about rotation, scaling, shearing, reflection, and projection transformations, and understand abstract concepts like kernel, range, and change of basis. These ideas are fundamental to computer graphics, robotics, and understanding how neural networks transform data.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Function
2. Linear Transformation
3. Transformation Matrix
4. Domain
5. Codomain
6. Image
7. Rotation Matrix
8. 2D Rotation
9. 3D Rotation
10. Scaling Matrix
11. Uniform Scaling
12. Non-Uniform Scaling
13. Shear Matrix
14. Reflection Matrix
15. Projection
16. Orthogonal Projection
17. Composition of Transforms
18. Kernel
19. Null Space
20. Range
21. Column Space
22. Rank
23. Nullity
24. Rank-Nullity Theorem
25. Invertible Transform
26. Change of Basis
27. Basis Transition Matrix

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 3: Systems of Linear Equations](../03-systems-of-linear-equations/index.md)

---

## Introduction

Every matrix multiplication $\mathbf{A}\mathbf{x}$ can be viewed as a transformation—taking an input vector $\mathbf{x}$ and producing an output vector $\mathbf{y}$. This perspective transforms matrices from static arrays of numbers into dynamic operators that rotate, scale, shear, project, and transform geometric objects.

Understanding transformations is essential for computer graphics, where every rotation, scaling, and perspective projection is a matrix multiplication. It's equally crucial for machine learning, where neural networks apply layer after layer of linear transformations (with nonlinearities between them) to map inputs to outputs. This chapter develops the mathematical framework for understanding these transformations and their properties.

## Functions and Transformations

### Functions Between Vector Spaces

A **function** $T$ from a set $V$ to a set $W$, written $T: V \rightarrow W$, is a rule that assigns to each element $\mathbf{v}$ in $V$ exactly one element $T(\mathbf{v})$ in $W$.

Key terminology:

- The **domain** of $T$ is the set $V$ of all possible inputs
- The **codomain** of $T$ is the set $W$ of all possible outputs
- The **image** of a vector $\mathbf{v}$ is its output $T(\mathbf{v})$
- The **range** (or image of $T$) is the set of all outputs: $\{T(\mathbf{v}) : \mathbf{v} \in V\}$

!!! note "Range vs Codomain"
    The codomain is the set where outputs *could* live. The range is where outputs *actually* live. For example, $T: \mathbb{R}^2 \rightarrow \mathbb{R}^3$ has codomain $\mathbb{R}^3$, but its range might be a plane within $\mathbb{R}^3$.

### Linear Transformations

A **linear transformation** (or linear map) is a function $T: V \rightarrow W$ between vector spaces that preserves vector addition and scalar multiplication:

#### Linearity Conditions

1. $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$ for all $\mathbf{u}, \mathbf{v} \in V$

2. $T(c\mathbf{v}) = cT(\mathbf{v})$ for all $\mathbf{v} \in V$ and scalars $c$

These two conditions can be combined into one:

$T(c_1\mathbf{v}_1 + c_2\mathbf{v}_2) = c_1 T(\mathbf{v}_1) + c_2 T(\mathbf{v}_2)$

Linear transformations preserve linear combinations. They map lines to lines (or points), planes to planes (or lines or points), and the origin to the origin.

| Property | Linear | Non-Linear |
|----------|--------|------------|
| Origin maps to origin | Always | Not necessarily |
| Lines map to... | Lines or points | Curves possible |
| Parallelism preserved | Yes | No |
| Grid structure | Preserved | Distorted |

### The Transformation Matrix

Every linear transformation $T: \mathbb{R}^n \rightarrow \mathbb{R}^m$ can be represented by an $m \times n$ matrix $\mathbf{A}$. The transformation is then:

$T(\mathbf{x}) = \mathbf{A}\mathbf{x}$

To find the **transformation matrix**, apply $T$ to each standard basis vector:

$\mathbf{A} = \begin{bmatrix} T(\mathbf{e}_1) & T(\mathbf{e}_2) & \cdots & T(\mathbf{e}_n) \end{bmatrix}$

The columns of $\mathbf{A}$ are the images of the standard basis vectors. This fundamental observation connects abstract transformations to concrete matrix computations.

#### Diagram: Linear Transformation Visualizer

<iframe src="../../sims/linear-transform-basics/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Linear Transformation Fundamentals Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret

Learning Objective: Help students understand that linear transformations preserve the grid structure and that the transformation is completely determined by where basis vectors map.

Canvas layout:
- Left: Original coordinate plane with basis vectors and grid
- Right: Transformed plane showing result of applying T
- Bottom: Matrix display and controls

Visual elements:
- Standard basis vectors e₁ (red) and e₂ (blue) in original space
- Transformed basis vectors T(e₁) and T(e₂) in target space
- Grid of points in original space
- Corresponding grid in transformed space
- Sample vector (user-controlled) showing before/after
- 2×2 transformation matrix displayed

Interactive controls:
- Draggable endpoints for T(e₁) and T(e₂) to define transformation
- Slider: Animation between original and transformed states
- Button: Reset to identity
- Dropdown: Preset transformations (rotation, scaling, shear, reflection)
- Checkbox: Show grid lines
- Checkbox: Show sample vector path

Default parameters:
- Initial transformation: identity
- Grid: 5×5
- Sample vector: (1, 1)

Behavior:
- Dragging basis vector endpoints updates matrix in real-time
- Grid morphs smoothly during animation
- Matrix entries update as endpoints move
- Preset dropdown smoothly transitions to new transformation
- Sample vector shows how arbitrary points transform

Implementation: p5.js with smooth animation
</details>

## Geometric Transformations in 2D

The power of linear transformations becomes vivid when we visualize their geometric effects. Each type of transformation has a characteristic matrix structure.

### Rotation Matrix

A **rotation matrix** rotates vectors around the origin by a fixed angle. For **2D rotation** by angle $\theta$ counterclockwise:

#### 2D Rotation Matrix

$\mathbf{R}(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$

where:

- $\theta$ is the rotation angle (positive = counterclockwise)
- The columns are the rotated basis vectors

Properties of 2D rotation matrices:

- $\mathbf{R}(\theta)^T = \mathbf{R}(-\theta) = \mathbf{R}(\theta)^{-1}$ (orthogonal matrix)
- $\det(\mathbf{R}(\theta)) = 1$ (preserves area and orientation)
- $\mathbf{R}(\alpha)\mathbf{R}(\beta) = \mathbf{R}(\alpha + \beta)$ (rotations compose by adding angles)

#### Diagram: 2D Rotation Interactive

<iframe src="../../sims/2d-rotation/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>2D Rotation Matrix Visualizer</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: demonstrate, calculate

Learning Objective: Enable students to see how the rotation matrix transforms vectors and shapes, and verify the relationship between angle and matrix entries.

Canvas layout:
- Main area: Coordinate plane with original and rotated shapes
- Right panel: Matrix display with cos/sin values
- Bottom: Angle control

Visual elements:
- Unit circle for reference
- Original shape (arrow, square, or F-shape) in blue
- Rotated shape in red (semi-transparent)
- Angle arc showing rotation amount
- Basis vectors before and after rotation
- Matrix entries updating with angle

Interactive controls:
- Slider: Rotation angle θ (-360° to 360°)
- Dropdown: Shape to rotate (arrow, square, triangle, F-shape)
- Checkbox: Show unit circle
- Checkbox: Show angle arc
- Button: Animate full rotation
- Input: Enter specific angle in degrees

Default parameters:
- Angle: 45°
- Shape: F-shape (to show orientation)
- Unit circle: visible

Behavior:
- Shape rotates smoothly as angle slider moves
- Matrix entries display cos(θ) and sin(θ) values
- Animation shows continuous rotation
- F-shape clearly shows orientation preservation

Implementation: p5.js with trigonometric calculations
</details>

### 3D Rotation

**3D rotation** is more complex because we must specify an axis of rotation. The three fundamental rotation matrices rotate around the coordinate axes:

#### Rotation Around X-Axis

$\mathbf{R}_x(\theta) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{bmatrix}$

#### Rotation Around Y-Axis

$\mathbf{R}_y(\theta) = \begin{bmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{bmatrix}$

#### Rotation Around Z-Axis

$\mathbf{R}_z(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}$

General 3D rotations can be composed from these basic rotations, though the order matters (rotations don't commute in 3D).

!!! warning "Gimbal Lock"
    When composing rotations using Euler angles, certain orientations cause "gimbal lock" where a degree of freedom is lost. Quaternions provide an alternative representation that avoids this problem, used extensively in robotics and game development.

### Scaling Matrix

A **scaling matrix** stretches or compresses vectors along the coordinate axes.

**Uniform scaling** scales equally in all directions:

$\mathbf{S}_{\text{uniform}}(k) = \begin{bmatrix} k & 0 \\ 0 & k \end{bmatrix}$

**Non-uniform scaling** scales differently along each axis:

$\mathbf{S}(s_x, s_y) = \begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}$

where:

- $s_x$ is the scaling factor along the x-axis
- $s_y$ is the scaling factor along the y-axis
- $|s| > 1$ stretches; $|s| < 1$ compresses
- $s < 0$ also reflects

| Scaling Type | Effect | Determinant |
|--------------|--------|-------------|
| Uniform $k > 1$ | Enlarges | $k^2$ |
| Uniform $0 < k < 1$ | Shrinks | $k^2$ |
| Non-uniform | Stretches/compresses differently | $s_x \cdot s_y$ |
| Negative factor | Also reflects | Negative |

### Shear Matrix

A **shear matrix** skews shapes by shifting points parallel to an axis, proportional to their distance from that axis.

Horizontal shear (shifts x based on y):

$\mathbf{H}_x(k) = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$

Vertical shear (shifts y based on x):

$\mathbf{H}_y(k) = \begin{bmatrix} 1 & 0 \\ k & 1 \end{bmatrix}$

Shear transformations:

- Turn rectangles into parallelograms
- Preserve area ($\det = 1$)
- Are not orthogonal (don't preserve angles)

### Reflection Matrix

A **reflection matrix** mirrors points across a line (in 2D) or plane (in 3D).

Reflection across the x-axis:

$\mathbf{F}_x = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$

Reflection across the y-axis:

$\mathbf{F}_y = \begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$

Reflection across a line through the origin at angle $\theta$:

$\mathbf{F}(\theta) = \begin{bmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta \end{bmatrix}$

Reflections have determinant $-1$, indicating they reverse orientation (turning clockwise into counterclockwise).

#### Diagram: Geometric Transformations Gallery

<iframe src="../../sims/transform-gallery/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Geometric Transformations Interactive Gallery</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: compare, differentiate

Learning Objective: Enable students to compare and contrast different geometric transformations, understanding their visual effects and matrix structures.

Canvas layout:
- Main area: Split view showing original and transformed shapes
- Right panel: Transformation type selector and parameters
- Bottom: Matrix display

Visual elements:
- Original shape (configurable) in blue
- Transformed shape in red
- Grid showing deformation
- Transformation type label
- Matrix with current values
- Key properties (determinant, orthogonality)

Interactive controls:
- Tabs: Rotation | Scaling | Shear | Reflection
- For Rotation: Angle slider
- For Scaling: sx and sy sliders (or single k for uniform)
- For Shear: k slider, direction toggle (horizontal/vertical)
- For Reflection: Angle slider for reflection line
- Dropdown: Shape (square, circle of points, F-shape, arrow)
- Toggle: Show grid deformation
- Button: Animate transformation

Default parameters:
- Transformation: Rotation
- Shape: F-shape
- Show grid: true

Behavior:
- Smooth animation between original and transformed states
- Matrix updates in real-time with parameter changes
- Properties panel shows det, orthogonality, etc.
- Grid clearly shows how space is warped
- Comparisons possible by switching between tabs

Implementation: p5.js with tabbed interface
</details>

## Projection

A **projection** maps vectors onto a subspace (line, plane, etc.). Unlike the transformations above, projections typically reduce dimension and are not invertible.

### Orthogonal Projection

An **orthogonal projection** projects vectors perpendicularly onto a subspace. For projection onto a line through the origin with direction $\mathbf{u}$:

#### Projection onto a Line

$\text{proj}_{\mathbf{u}}(\mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{u} \cdot \mathbf{u}} \mathbf{u}$

The projection matrix onto the line spanned by unit vector $\hat{\mathbf{u}}$ is:

$\mathbf{P} = \hat{\mathbf{u}} \hat{\mathbf{u}}^T$

For projection onto the x-axis:

$\mathbf{P}_x = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$

Properties of orthogonal projection matrices:

- $\mathbf{P}^2 = \mathbf{P}$ (applying twice gives same result)
- $\mathbf{P}^T = \mathbf{P}$ (symmetric)
- Eigenvalues are 0 and 1
- Not invertible (determinant = 0)

#### Diagram: Orthogonal Projection Visualizer

<iframe src="../../sims/orthogonal-projection/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Orthogonal Projection Interactive Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret

Learning Objective: Help students visualize how orthogonal projection maps vectors onto lines or planes, showing the perpendicular relationship between the original vector, its projection, and the error component.

Canvas layout:
- Main area: 2D/3D coordinate space
- Right panel: Vector components and projection formula

Visual elements:
- Original vector v (blue arrow)
- Projection line/plane (gray)
- Projected vector proj(v) (red arrow on line)
- Error vector (v - proj(v)) shown as dashed green arrow
- Right angle indicator showing orthogonality
- Unit direction vector u

Interactive controls:
- Draggable vector v endpoint
- Slider: Direction of projection line (angle)
- Toggle: 2D / 3D mode
- Checkbox: Show error vector
- Checkbox: Show right angle indicator
- Checkbox: Show projection formula with values
- Button: Animate projection process

Default parameters:
- Mode: 2D
- Projection line: 30° from x-axis
- Vector v: (3, 2)

Behavior:
- Vector v can be dragged to any position
- Projection updates in real-time
- Error vector clearly perpendicular to projection line
- Formula shows computed values
- 3D mode allows projection onto plane

Implementation: p5.js with WEBGL for 3D
</details>

## Composition of Transformations

Applying one transformation after another is called **composition**. If $S$ and $T$ are linear transformations, the composition $S \circ T$ applies $T$ first, then $S$:

$(S \circ T)(\mathbf{x}) = S(T(\mathbf{x}))$

For matrix representations, composition corresponds to matrix multiplication:

$\mathbf{A}_{S \circ T} = \mathbf{A}_S \mathbf{A}_T$

!!! warning "Order Matters"
    Matrix multiplication is not commutative, so $\mathbf{A}_S \mathbf{A}_T \neq \mathbf{A}_T \mathbf{A}_S$ in general. Rotating then scaling gives different results than scaling then rotating.

Common composition examples:

- **Rotation around a point**: Translate to origin, rotate, translate back
- **Scaling about a point**: Translate to origin, scale, translate back
- **Euler angles**: Compose three axis-aligned rotations

| Composition | Matrix Product | Application |
|-------------|----------------|-------------|
| Rotate then scale | $\mathbf{S}\mathbf{R}$ | Graphics, robotics |
| Scale then rotate | $\mathbf{R}\mathbf{S}$ | Different result! |
| Multiple rotations | $\mathbf{R}_3 \mathbf{R}_2 \mathbf{R}_1$ | 3D orientation |

#### Diagram: Transformation Composition

<iframe src="../../sims/transform-composition/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Transformation Composition Visualizer</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: examine, compare

Learning Objective: Demonstrate that the order of transformations matters and show how composed transformations combine into a single matrix product.

Canvas layout:
- Top: Two transformation pipelines side by side (T then S vs S then T)
- Bottom: Resulting shapes and combined matrices

Visual elements:
- Original shape in center
- Pipeline 1: Original → T → S (with intermediate state shown)
- Pipeline 2: Original → S → T (with intermediate state shown)
- Final shapes for each pipeline (different unless transformations commute)
- Matrices for T, S, and their products ST and TS

Interactive controls:
- Dropdown: First transformation type (rotation, scaling, shear)
- Parameters for first transformation
- Dropdown: Second transformation type
- Parameters for second transformation
- Checkbox: Show intermediate states
- Button: Animate both pipelines
- Toggle: Show matrix products

Default parameters:
- T: Rotation 45°
- S: Scaling (2, 1)
- Shape: unit square

Behavior:
- Both pipelines animate simultaneously for comparison
- Intermediate shapes visible between transformations
- Matrix products computed and displayed
- Clear visual demonstration that order matters
- Commutative cases (e.g., two rotations) show same result

Implementation: p5.js with parallel animation
</details>

## Kernel and Range

Every linear transformation has two fundamental subspaces that reveal its structure.

### Kernel (Null Space)

The **kernel** of a linear transformation $T: V \rightarrow W$ is the set of all vectors that map to zero:

$\ker(T) = \{\mathbf{v} \in V : T(\mathbf{v}) = \mathbf{0}\}$

For a matrix transformation $T(\mathbf{x}) = \mathbf{A}\mathbf{x}$, the kernel equals the **null space** of $\mathbf{A}$:

$\text{Null}(\mathbf{A}) = \{\mathbf{x} : \mathbf{A}\mathbf{x} = \mathbf{0}\}$

The kernel is always a subspace of the domain. Its dimension is called the **nullity** of $T$.

### Range (Column Space)

The **range** of $T$ is the set of all possible outputs:

$\text{Range}(T) = \{T(\mathbf{v}) : \mathbf{v} \in V\}$

For a matrix $\mathbf{A}$, the range equals the **column space**—the span of the columns of $\mathbf{A}$:

$\text{Col}(\mathbf{A}) = \text{Span}\{\mathbf{a}_1, \mathbf{a}_2, \ldots, \mathbf{a}_n\}$

The range is always a subspace of the codomain. Its dimension is the **rank** of $T$.

| Subspace | Definition | Dimension Name |
|----------|------------|----------------|
| Kernel / Null Space | Vectors mapping to zero | Nullity |
| Range / Column Space | All possible outputs | Rank |

#### Diagram: Kernel and Range Visualizer

<iframe src="../../sims/kernel-range/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Kernel and Range Interactive Visualizer</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: differentiate, examine

Learning Objective: Help students visualize the kernel (what maps to zero) and range (what outputs are possible) of a linear transformation, understanding their relationship to the matrix structure.

Canvas layout:
- Left: Domain space showing kernel
- Right: Codomain space showing range
- Center: Transformation arrow
- Bottom: Matrix and dimension information

Visual elements:
- Domain with kernel subspace highlighted (line or plane in gray)
- Arrows from domain to codomain
- Codomain with range subspace highlighted (line or plane in color)
- Zero vector in codomain marked
- Vectors in kernel shown collapsing to zero
- Sample vectors outside kernel shown mapping to range

Interactive controls:
- Matrix editor (2×2 or 3×2 or 2×3)
- Button: Random full-rank matrix
- Button: Random rank-deficient matrix
- Checkbox: Show kernel vectors
- Checkbox: Show how kernel maps to zero
- Checkbox: Animate transformation
- Display: Rank and nullity values

Default parameters:
- Matrix: 2×3 with rank 2 (nontrivial kernel)

Behavior:
- Kernel automatically computed and displayed
- Range computed as column space
- Arrows show transformation action
- Rank and nullity update with matrix changes
- Animation shows vectors transforming

Implementation: p5.js with linear algebra computations
</details>

## The Rank-Nullity Theorem

One of the most important theorems in linear algebra connects the dimensions of the kernel and range.

### Statement of the Theorem

For a linear transformation $T: V \rightarrow W$ where $V$ is finite-dimensional:

#### Rank-Nullity Theorem

$\dim(V) = \text{rank}(T) + \text{nullity}(T)$

where:

- $\dim(V)$ is the dimension of the domain (number of columns of $\mathbf{A}$)
- $\text{rank}(T)$ is the dimension of the range
- $\text{nullity}(T)$ is the dimension of the kernel

For an $m \times n$ matrix $\mathbf{A}$:

$n = \text{rank}(\mathbf{A}) + \text{nullity}(\mathbf{A})$

### Intuition

The theorem says that dimension is conserved: what doesn't go into the kernel must go somewhere (the range). If more vectors collapse to zero (higher nullity), fewer independent output directions remain (lower rank).

### Consequences

The Rank-Nullity Theorem has powerful implications:

- If $\text{rank}(\mathbf{A}) = n$ (full column rank), then $\text{nullity} = 0$, so $T$ is injective (one-to-one)
- If $\text{rank}(\mathbf{A}) = m$ (full row rank), then $T$ is surjective (onto)
- If both, $T$ is bijective (invertible) and $m = n$

| Matrix Size | Rank | Nullity | Properties |
|-------------|------|---------|------------|
| $3 \times 3$, rank 3 | 3 | 0 | Invertible |
| $3 \times 3$, rank 2 | 2 | 1 | Kernel is a line |
| $3 \times 4$, rank 3 | 3 | 1 | Kernel is a line |
| $4 \times 3$, rank 3 | 3 | 0 | One-to-one |

## Invertible Transformations

An **invertible transformation** is a linear transformation with an inverse—a transformation that "undoes" the original.

### Conditions for Invertibility

A linear transformation $T: V \rightarrow W$ is invertible if and only if:

- $T$ is one-to-one (injective): different inputs give different outputs
- $T$ is onto (surjective): every output is achieved
- Equivalently: $\ker(T) = \{\mathbf{0}\}$ and $\text{Range}(T) = W$

For a matrix $\mathbf{A}$:

- Must be square ($m = n$)
- Must have full rank ($\text{rank}(\mathbf{A}) = n$)
- Must have nullity zero
- Must have nonzero determinant

### Inverse of Geometric Transformations

| Transformation | Matrix | Inverse |
|----------------|--------|---------|
| Rotation by $\theta$ | $\mathbf{R}(\theta)$ | $\mathbf{R}(-\theta) = \mathbf{R}^T$ |
| Scaling by $(s_x, s_y)$ | $\text{diag}(s_x, s_y)$ | $\text{diag}(1/s_x, 1/s_y)$ |
| Shear by $k$ | $\mathbf{H}(k)$ | $\mathbf{H}(-k)$ |
| Reflection | $\mathbf{F}$ | $\mathbf{F}$ (self-inverse) |
| Projection | $\mathbf{P}$ | Not invertible |

Projections are never invertible because they collapse dimension—once information is lost, it cannot be recovered.

## Change of Basis

Different bases provide different "viewpoints" on the same vector space. **Change of basis** allows us to translate between these viewpoints.

### Basis Transition Matrix

Given two bases $\mathcal{B} = \{\mathbf{b}_1, \ldots, \mathbf{b}_n\}$ and $\mathcal{C} = \{\mathbf{c}_1, \ldots, \mathbf{c}_n\}$, the **basis transition matrix** $\mathbf{P}_{\mathcal{B} \leftarrow \mathcal{C}}$ converts coordinates from $\mathcal{C}$ to $\mathcal{B}$.

If $[\mathbf{v}]_{\mathcal{C}}$ are the coordinates of $\mathbf{v}$ in basis $\mathcal{C}$, then:

$[\mathbf{v}]_{\mathcal{B}} = \mathbf{P}_{\mathcal{B} \leftarrow \mathcal{C}} [\mathbf{v}]_{\mathcal{C}}$

The columns of $\mathbf{P}_{\mathcal{B} \leftarrow \mathcal{C}}$ are the $\mathcal{C}$ basis vectors expressed in $\mathcal{B}$ coordinates.

### Similar Matrices

If $\mathbf{A}$ represents a transformation in the standard basis and $\mathbf{P}$ is the change of basis matrix, then:

$\mathbf{A}' = \mathbf{P}^{-1}\mathbf{A}\mathbf{P}$

represents the same transformation in the new basis. Matrices related this way are called **similar matrices**—they represent the same transformation in different coordinate systems.

Similar matrices have the same:

- Determinant
- Trace
- Eigenvalues
- Rank

#### Diagram: Change of Basis Visualizer

<iframe src="../../sims/change-of-basis/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Change of Basis Interactive Visualizer</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret

Learning Objective: Help students understand that the same vector has different coordinate representations in different bases, and how the transition matrix converts between them.

Canvas layout:
- Left: Standard basis view with vector
- Right: Custom basis view with same vector
- Bottom: Coordinate displays and transition matrix

Visual elements:
- Standard basis vectors (e₁, e₂) in black
- Custom basis vectors (b₁, b₂) in purple
- Same geometric vector shown in both views
- Coordinates displayed in each basis
- Transition matrix P
- Grid lines for each basis

Interactive controls:
- Draggable endpoints for custom basis vectors
- Draggable vector to transform
- Button: Reset to standard basis
- Checkbox: Show both bases overlaid
- Checkbox: Show transition matrix calculation
- Dropdown: Preset bases (standard, rotated, skewed)

Default parameters:
- Custom basis: rotated 30° from standard
- Vector: (2, 1) in standard coordinates

Behavior:
- Vector stays fixed geometrically as basis changes
- Coordinates update to reflect new basis
- Transition matrix updates with basis
- Overlay mode shows both grids simultaneously
- Clear visualization that vector is unchanged, only representation

Implementation: p5.js with coordinate transformation
</details>

## Applications

### Computer Graphics

Every transformation in computer graphics—modeling, viewing, projection—is a linear (or affine) transformation represented by matrices. The graphics pipeline applies a sequence of transformations:

1. **Model matrix**: Object space → World space
2. **View matrix**: World space → Camera space
3. **Projection matrix**: Camera space → Clip space

GPUs are optimized for these matrix multiplications, processing millions of vertices per second.

### Robotics

Robot arm kinematics uses transformation matrices to track how joints connect. Each joint applies a rotation or translation, and composing these gives the end-effector position:

$\mathbf{T}_{\text{total}} = \mathbf{T}_1 \mathbf{T}_2 \cdots \mathbf{T}_n$

### Neural Networks

Each layer of a neural network applies a linear transformation (weights) followed by a nonlinearity:

$\mathbf{h} = \sigma(\mathbf{W}\mathbf{x} + \mathbf{b})$

Understanding transformations helps interpret:

- What the network "sees" at each layer
- How information flows and transforms
- Why deep networks can learn complex mappings

### Principal Component Analysis

PCA finds a change of basis that:

- Aligns axes with directions of maximum variance
- Decorrelates the data
- Enables dimensionality reduction by projecting onto top components

This is a change of basis to the eigenvector basis of the covariance matrix.

## Summary and Key Takeaways

This chapter connected matrix algebra to geometric transformation.

**Foundations:**

- A **function** maps inputs from a **domain** to outputs in a **codomain**
- A **linear transformation** preserves addition and scalar multiplication
- Every linear transformation has a **transformation matrix** whose columns are images of basis vectors

**Geometric Transformations:**

- **Rotation matrices** rotate while preserving lengths and angles
- **Scaling matrices** stretch or compress along coordinate axes
- **Shear matrices** skew shapes by sliding parallel to an axis
- **Reflection matrices** mirror across a line or plane
- **Projection matrices** map onto lower-dimensional subspaces

**Composition and Structure:**

- **Composition** of transformations corresponds to matrix multiplication
- Order matters: $\mathbf{AB} \neq \mathbf{BA}$ in general
- The **kernel** contains vectors mapping to zero; its dimension is **nullity**
- The **range** is the set of all outputs; its dimension is **rank**
- **Rank-Nullity Theorem**: $n = \text{rank} + \text{nullity}$

**Invertibility and Basis:**

- **Invertible transformations** have trivial kernel and full range
- **Change of basis** provides different coordinate views of the same transformation
- **Similar matrices** represent the same transformation in different bases

**Key Properties:**

| Transformation | Preserves Lengths? | Preserves Angles? | Invertible? | Determinant |
|----------------|-------------------|-------------------|-------------|-------------|
| Rotation | Yes | Yes | Yes | 1 |
| Uniform Scaling | No | Yes | Yes (if $k \neq 0$) | $k^n$ |
| Shear | No | No | Yes | 1 |
| Reflection | Yes | Yes | Yes | $-1$ |
| Projection | No | No | No | 0 |

---

## Exercises

??? question "Exercise 1: Finding Transformation Matrices"
    Find the 2×2 matrix for the linear transformation that:

    a) Reflects across the line $y = x$

    b) Rotates by 90° counterclockwise, then scales by factor 2

    c) Projects onto the line $y = 2x$

??? question "Exercise 2: Composition Order"
    Let $R$ be rotation by 45° and $S$ be scaling by $(2, 1)$. Compute both $RS$ and $SR$, and describe geometrically why they differ.

??? question "Exercise 3: Kernel and Range"
    For the matrix $\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \end{bmatrix}$:

    a) Find a basis for the kernel (null space)

    b) Find a basis for the range (column space)

    c) Verify the Rank-Nullity Theorem

??? question "Exercise 4: Invertibility"
    Determine which transformations are invertible and find the inverse if it exists:

    a) $T(\mathbf{x}) = \begin{bmatrix} 1 & 2 \\ 3 & 6 \end{bmatrix}\mathbf{x}$

    b) $T(\mathbf{x}) = \begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}\mathbf{x}$

    c) Projection onto the x-axis

??? question "Exercise 5: Change of Basis"
    Let $\mathcal{B} = \{(1, 1), (1, -1)\}$ be a basis for $\mathbb{R}^2$.

    a) Find the change of basis matrix from standard coordinates to $\mathcal{B}$-coordinates

    b) Express the vector $(3, 1)$ in $\mathcal{B}$-coordinates

    c) If a transformation is rotation by 90° in standard coordinates, what matrix represents it in $\mathcal{B}$-coordinates?
