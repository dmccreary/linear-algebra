---
title: Vectors and Vector Spaces
description: Introduction to vectors as the fundamental building blocks of linear algebra
generated_by: claude skill chapter-content-generator
date: 2026-01-17
version: 0.03
---

# Vectors and Vector Spaces

## Summary

This chapter introduces vectors as the fundamental building blocks of linear algebra. Students explore vector operations, geometric interpretations, and the concept of vector spaces. By the end of this chapter, you will understand how to perform vector operations, compute norms and distances, and work with the abstract concepts of span, linear independence, and basis vectors that form the foundation for all subsequent topics.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Scalar
2. Vector
3. Vector Notation
4. 2D Vector
5. 3D Vector
6. N-Dimensional Vector
7. Vector Addition
8. Scalar Multiplication
9. Vector Subtraction
10. Dot Product
11. Cross Product
12. Vector Magnitude
13. Unit Vector
14. Vector Normalization
15. Euclidean Distance
16. L1 Norm
17. L2 Norm
18. L-Infinity Norm
19. Linear Combination
20. Span
21. Linear Independence
22. Linear Dependence
23. Basis Vector
24. Standard Basis
25. Coordinate System
26. Vector Space
27. Dimension of Space

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md): College Algebra and familiarity with basic calculus concepts.

---

## Introduction

Linear algebra provides the mathematical foundation for modern artificial intelligence, machine learning, and computer vision. At the heart of this mathematical framework lies the vector—an elegant structure that represents both magnitude and direction. Whether you're representing a data point in a machine learning model, describing the velocity of an autonomous vehicle, or encoding the semantic meaning of a word, vectors serve as your fundamental tool.

This chapter establishes the foundational concepts you'll build upon throughout this course. We begin with the simple distinction between scalars and vectors, then progressively develop your understanding through vector operations, norms, and the powerful abstractions of vector spaces.

## Scalars and Vectors

### Understanding Scalars

A **scalar** is a single numerical value that represents a quantity with magnitude only. Scalars are the numbers you've worked with throughout your mathematical education—they can be positive, negative, or zero. In the context of linear algebra, scalars typically come from a field (usually the real numbers $\mathbb{R}$ or complex numbers $\mathbb{C}$).

Examples of scalars include:

- Temperature: 72°F
- Mass: 5.2 kg
- Speed: 60 mph
- Count: 42 items

### What is a Vector?

A **vector** is an ordered collection of scalars that represents both magnitude and direction. While scalars tell us "how much," vectors tell us "how much and in which direction." Geometrically, we can visualize a vector as an arrow in space—the length represents magnitude, and the arrowhead indicates direction.

More formally, a vector in $n$-dimensional space is an ordered $n$-tuple of real numbers:

$$\mathbf{v} = (v_1, v_2, \ldots, v_n)$$

where each $v_i$ is a scalar component of the vector.

### Vector Notation

Mathematical texts use several conventions for denoting vectors. Throughout this course, we use the following:

| Notation | Description | Example |
|----------|-------------|---------|
| Bold lowercase | Standard textbook notation | $\mathbf{v}$, $\mathbf{u}$, $\mathbf{w}$ |
| Arrow above | Handwritten notation | $\vec{v}$, $\vec{u}$ |
| Column matrix | Computational notation | $\begin{bmatrix} v_1 \\ v_2 \end{bmatrix}$ |
| Row matrix | Alternative notation | $[v_1 \quad v_2]$ |
| Component form | Explicit values | $(3, 4)$ or $\langle 3, 4 \rangle$ |

!!! tip "Notation in Code"
    In programming contexts like NumPy, vectors are typically represented as one-dimensional arrays: `v = np.array([3, 4, 5])`.

## Vectors in Different Dimensions

### 2D Vectors

A **2D vector** exists in a two-dimensional plane and consists of two components. We write a 2D vector as:

$$\mathbf{v} = \begin{bmatrix} v_x \\ v_y \end{bmatrix}$$

where $v_x$ is the horizontal component and $v_y$ is the vertical component. Geometrically, this represents an arrow from the origin to the point $(v_x, v_y)$.

Common applications of 2D vectors include:

- Position coordinates on a screen
- Velocity in a plane
- Force components in 2D physics simulations

### 3D Vectors

A **3D vector** extends into three-dimensional space with three components:

$$\mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$$

The additional $z$-component allows us to represent quantities in our three-dimensional world, such as the position of a drone or the direction of a camera in virtual reality.

#### Diagram: 2D and 3D Vector Visualization

<iframe src="../../sims/vector-2d-3d-visualizer" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>2D and 3D Vector Visualization MicroSim</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: interpret, visualize

Learning Objective: Students will interpret vectors geometrically by visualizing how component values determine position and direction in 2D and 3D coordinate systems.

Canvas layout:
- Left panel (500px): 2D vector visualization with coordinate grid
- Right panel (400px): 3D vector visualization with rotatable axes
- Bottom controls: Component sliders and toggle switches

Visual elements:
- 2D coordinate grid with x and y axes, grid lines at unit intervals
- 3D coordinate system with x, y, z axes (perspective view)
- Vector arrow from origin to point, with distinct arrowhead
- Dashed projection lines from vector tip to each axis
- Component labels showing current values
- Origin point clearly marked

Interactive controls:
- Slider: x-component (-5 to 5, default 3)
- Slider: y-component (-5 to 5, default 4)
- Slider: z-component (-5 to 5, default 2) for 3D view
- Toggle: Show/hide projection lines
- Toggle: Show/hide component labels
- Button: Switch between 2D and 3D views
- For 3D: Mouse drag to rotate view

Default parameters:
- 2D vector: (3, 4)
- 3D vector: (3, 4, 2)
- Projection lines: visible
- Component labels: visible

Behavior:
- As sliders change, vector arrow updates in real-time
- Projection lines dynamically connect to axis intersections
- Magnitude value updates and displays
- 3D view allows full rotation with mouse drag

Implementation: p5.js with WEBGL for 3D rendering
</details>

### N-Dimensional Vectors

An **N-dimensional vector** generalizes to any number of dimensions:

$$\mathbf{v} = \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix}$$

While we cannot visualize vectors beyond three dimensions geometrically, the mathematical operations extend naturally. In machine learning, it's common to work with vectors having hundreds or thousands of dimensions:

- Word embeddings: 300-dimensional vectors representing word meanings
- Image features: 2048-dimensional vectors from convolutional neural networks
- User preference vectors: 100+ dimensions in recommendation systems

The power of linear algebra is that the same operations and theorems apply regardless of dimensionality.

## Basic Vector Operations

### Vector Addition

**Vector addition** combines two vectors of the same dimension by adding their corresponding components:

$$\mathbf{u} + \mathbf{v} = \begin{bmatrix} u_1 \\ u_2 \\ \vdots \\ u_n \end{bmatrix} + \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix} = \begin{bmatrix} u_1 + v_1 \\ u_2 + v_2 \\ \vdots \\ u_n + v_n \end{bmatrix}$$

Geometrically, vector addition follows the **parallelogram rule** or the **tip-to-tail method**. If you place the tail of $\mathbf{v}$ at the tip of $\mathbf{u}$, the sum $\mathbf{u} + \mathbf{v}$ points from the tail of $\mathbf{u}$ to the tip of $\mathbf{v}$.

Vector addition has the following properties:

- **Commutative:** $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$
- **Associative:** $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$
- **Identity:** $\mathbf{v} + \mathbf{0} = \mathbf{v}$
- **Inverse:** $\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$

### Scalar Multiplication

**Scalar multiplication** multiplies each component of a vector by a scalar value:

$$c \cdot \mathbf{v} = c \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix} = \begin{bmatrix} c \cdot v_1 \\ c \cdot v_2 \\ \vdots \\ c \cdot v_n \end{bmatrix}$$

The geometric effect of scalar multiplication:

- $c > 1$: Stretches the vector (increases magnitude)
- $0 < c < 1$: Shrinks the vector (decreases magnitude)
- $c = 0$: Produces the zero vector
- $c < 0$: Reverses direction and scales magnitude

### Vector Subtraction

**Vector subtraction** is defined in terms of addition and scalar multiplication:

$$\mathbf{u} - \mathbf{v} = \mathbf{u} + (-1)\mathbf{v}$$

This yields component-wise subtraction:

$$\mathbf{u} - \mathbf{v} = \begin{bmatrix} u_1 - v_1 \\ u_2 - v_2 \\ \vdots \\ u_n - v_n \end{bmatrix}$$

#### Diagram: Vector Operations Playground

<iframe src="../../sims/vector-operations-playground" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Vector Operations Playground MicroSim</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: execute, practice, demonstrate

Learning Objective: Students will apply vector addition, subtraction, and scalar multiplication by manipulating vectors interactively and predicting results before seeing them visualized.

Canvas layout:
- Main area (600px): Coordinate grid showing vectors
- Right panel (200px): Controls and result display
- Bottom: Operation selector and calculation display

Visual elements:
- Coordinate grid with axes from -10 to 10
- Vector u (blue arrow) with adjustable endpoint
- Vector v (red arrow) with adjustable endpoint
- Result vector (green arrow) showing operation result
- Parallelogram outline when showing addition (dashed lines)
- Component labels on each vector
- Magnitude display for each vector

Interactive controls:
- Draggable endpoints for vectors u and v
- Radio buttons: Addition, Subtraction, Scalar Multiply
- Slider: Scalar value c (-3 to 3, default 2) for scalar multiplication
- Checkbox: Show parallelogram construction
- Checkbox: Show component breakdown
- Button: Animate operation step-by-step
- Button: Reset to defaults

Default parameters:
- Vector u: (3, 2)
- Vector v: (1, 4)
- Operation: Addition
- Scalar: 2
- Show parallelogram: true

Behavior:
- Dragging vector endpoints updates all calculations in real-time
- Operation result vector updates immediately
- Step-by-step animation shows geometric construction
- Component breakdown displays numerical computation
- Parallelogram appears for addition to show geometric interpretation

Implementation: p5.js with drag-and-drop interaction
</details>

## Vector Products

### The Dot Product

The **dot product** (also called the inner product or scalar product) takes two vectors of the same dimension and returns a scalar. For vectors $\mathbf{u}$ and $\mathbf{v}$ in $\mathbb{R}^n$:

$$\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i = u_1 v_1 + u_2 v_2 + \cdots + u_n v_n$$

The geometric interpretation reveals the dot product's significance:

$$\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$$

where $\theta$ is the angle between the vectors and $\|\cdot\|$ denotes magnitude. This relationship connects algebraic computation with geometric meaning.

Key properties and insights:

| Condition | Geometric Meaning | Dot Product Value |
|-----------|-------------------|-------------------|
| $\theta = 0°$ | Vectors point same direction | Maximum positive |
| $\theta = 90°$ | Vectors are perpendicular | Zero |
| $\theta = 180°$ | Vectors point opposite directions | Maximum negative |

The dot product has important applications:

- Computing angles between vectors
- Projecting one vector onto another
- Calculating work in physics (force · displacement)
- Measuring similarity between feature vectors

### The Cross Product

The **cross product** is defined only for 3D vectors and produces a vector perpendicular to both input vectors:

$$\mathbf{u} \times \mathbf{v} = \begin{bmatrix} u_2 v_3 - u_3 v_2 \\ u_3 v_1 - u_1 v_3 \\ u_1 v_2 - u_2 v_1 \end{bmatrix}$$

The magnitude of the cross product equals the area of the parallelogram formed by the two vectors:

$$\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\| \|\mathbf{v}\| \sin\theta$$

The direction follows the **right-hand rule**: if you curl your fingers from $\mathbf{u}$ toward $\mathbf{v}$, your thumb points in the direction of $\mathbf{u} \times \mathbf{v}$.

Important properties of the cross product:

- **Anti-commutative:** $\mathbf{u} \times \mathbf{v} = -(\mathbf{v} \times \mathbf{u})$
- **Not associative:** $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w} \neq \mathbf{u} \times (\mathbf{v} \times \mathbf{w})$
- **Self-cross is zero:** $\mathbf{v} \times \mathbf{v} = \mathbf{0}$

#### Diagram: Dot Product and Cross Product Visualizer

<iframe src="../../sims/dot-cross-product-visualizer" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dot Product and Cross Product Visualizer MicroSim</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: examine, compare, differentiate

Learning Objective: Students will analyze the geometric relationship between dot product (projection and angle) and cross product (perpendicular vector and area) by manipulating vectors and observing how the products change.

Canvas layout:
- Left panel (400px): 2D view for dot product with projection visualization
- Right panel (400px): 3D view for cross product with parallelogram and result vector
- Bottom panel: Numerical results and formulas

Visual elements:
- 2D panel: Two vectors, projection line, angle arc, shaded projection component
- 3D panel: Two vectors, cross product result vector (perpendicular), parallelogram surface
- Angle measurement display with theta symbol
- Area calculation display for parallelogram
- Formula display showing computation steps

Interactive controls:
- Draggable vector endpoints in both panels
- Slider: Angle between vectors (0° to 180°)
- Toggle: Show projection in 2D
- Toggle: Show parallelogram in 3D
- Toggle: Show right-hand rule animation
- Button: Animate angle sweep from 0° to 180°
- 3D rotation via mouse drag

Default parameters:
- Vector u: (3, 2) in 2D, (3, 2, 0) in 3D
- Vector v: (4, 1) in 2D, (1, 4, 0) in 3D
- Show projection: true
- Show parallelogram: true

Behavior:
- Dot product value updates with cos(theta) relationship visible
- When vectors perpendicular, dot product display highlights zero
- Cross product vector length changes with parallelogram area
- Right-hand rule animation shows finger curl and thumb direction
- Numerical display shows step-by-step calculation

Implementation: p5.js with WEBGL for 3D panel
</details>

## Magnitude and Norms

### Vector Magnitude

The **magnitude** (or length) of a vector measures how far the vector extends from the origin. For a vector $\mathbf{v} = (v_1, v_2, \ldots, v_n)$, the magnitude is:

$$\|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2 + \cdots + v_n^2} = \sqrt{\sum_{i=1}^{n} v_i^2}$$

This formula is the generalization of the Pythagorean theorem to $n$ dimensions. For a 2D vector $(3, 4)$, the magnitude is $\sqrt{9 + 16} = 5$.

### Understanding Norms

A **norm** is a function that assigns a non-negative length to each vector in a vector space. Different norms measure "length" differently, and each has applications in machine learning and optimization.

#### L2 Norm (Euclidean Norm)

The **L2 norm** is the standard Euclidean distance from the origin:

$$\|\mathbf{v}\|_2 = \sqrt{\sum_{i=1}^{n} v_i^2}$$

This is the magnitude we computed above. It's the "straight-line" distance and is used extensively in:

- Least squares regression
- Euclidean distance calculations
- Ridge regularization (L2 regularization)

#### L1 Norm (Manhattan Norm)

The **L1 norm** sums the absolute values of components:

$$\|\mathbf{v}\|_1 = \sum_{i=1}^{n} |v_i|$$

Named after the grid-like street layout of Manhattan, this norm measures distance as if you could only travel along axes. It's used in:

- Lasso regularization (L1 regularization)
- Robust statistics
- Sparse signal recovery

#### L-Infinity Norm (Maximum Norm)

The **L-infinity norm** returns the maximum absolute component value:

$$\|\mathbf{v}\|_\infty = \max(|v_1|, |v_2|, \ldots, |v_n|)$$

This norm is useful when you need to constrain the maximum deviation in any single dimension.

#### Diagram: Norm Comparison Visualizer

<iframe src="../../sims/norm-comparison-visualizer" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Norm Comparison Visualizer MicroSim</summary>
Type: microsim

Bloom Level: Analyze (L4)
Bloom Verb: compare, contrast, differentiate

Learning Objective: Students will compare and contrast L1, L2, and L-infinity norms by observing unit circles and distance measurements for each norm type.

Canvas layout:
- Main area (600px): Coordinate grid with unit "circles" for each norm
- Right panel (200px): Numerical values and controls

Visual elements:
- Coordinate grid from -2 to 2 on both axes
- Unit circle for L2 norm (actual circle, blue)
- Unit "circle" for L1 norm (diamond/rhombus shape, green)
- Unit "circle" for L-infinity norm (square, orange)
- Point showing selected vector with lines to origin
- Distance measurements for each norm displayed

Interactive controls:
- Draggable point to select vector
- Checkboxes: Show L1, L2, L-infinity unit shapes (all on by default)
- Slider: Adjust norm "radius" to see scaled shapes
- Toggle: Animate point around each unit shape
- Display: Current coordinates and all three norm values

Default parameters:
- Selected point: (0.6, 0.8)
- All three norm shapes visible
- Radius: 1

Behavior:
- As point is dragged, all three norm values update
- Unit shapes clearly show different "distance = 1" definitions
- Points on each unit shape highlight when norm equals 1
- Animation moves point around each shape showing equal norm path

Implementation: p5.js with parametric curve drawing
</details>

### Euclidean Distance

The **Euclidean distance** between two vectors measures the straight-line separation:

$$d(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|_2 = \sqrt{\sum_{i=1}^{n} (u_i - v_i)^2}$$

This fundamental metric appears throughout machine learning:

- k-Nearest Neighbors classification
- K-means clustering
- Distance-based similarity measures

### Unit Vectors and Normalization

A **unit vector** has magnitude exactly 1. Any non-zero vector can be converted to a unit vector through **normalization**:

$$\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$$

The resulting vector $\hat{\mathbf{v}}$ (pronounced "v-hat") points in the same direction as $\mathbf{v}$ but has unit length. Normalization is essential for:

- Comparing vector directions without magnitude bias
- Creating orthonormal bases
- Preparing features for machine learning algorithms

## Linear Combinations and Span

### Linear Combinations

A **linear combination** of vectors $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k$ is a sum of scalar multiples:

$$c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k$$

where $c_1, c_2, \ldots, c_k$ are scalars. Linear combinations allow us to create new vectors from existing ones and form the foundation for understanding vector spaces.

**Example:** Given $\mathbf{v}_1 = (1, 0)$ and $\mathbf{v}_2 = (0, 1)$, the linear combination $3\mathbf{v}_1 + 2\mathbf{v}_2 = (3, 2)$.

### The Span of Vectors

The **span** of a set of vectors is the collection of all possible linear combinations of those vectors:

$$\text{span}\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\} = \{c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k : c_i \in \mathbb{R}\}$$

Geometrically, the span represents all points reachable by combining the vectors:

- The span of one non-zero vector is a line through the origin
- The span of two non-parallel vectors in 3D is a plane through the origin
- The span of three non-coplanar vectors in 3D is all of $\mathbb{R}^3$

#### Diagram: Linear Combination Explorer

<iframe src="../../sims/linear-combination-explorer" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Linear Combination Explorer MicroSim</summary>
Type: microsim

Bloom Level: Apply (L3)
Bloom Verb: use, demonstrate, calculate

Learning Objective: Students will apply their understanding of linear combinations by adjusting scalar coefficients to reach target points and observe how span is generated.

Canvas layout:
- Main area (550px): 2D coordinate grid with vectors and span visualization
- Right panel (250px): Controls for coefficients and target challenges

Visual elements:
- Coordinate grid from -6 to 6
- Two basis vectors v1 (red) and v2 (blue) with adjustable directions
- Scaled versions c1*v1 (light red) and c2*v2 (light blue)
- Result vector as sum (green, thick arrow)
- Shaded region showing span (when two vectors span a plane)
- Target point for challenges (yellow star)
- Trail showing path as coefficients change

Interactive controls:
- Slider: Coefficient c1 (-3 to 3, step 0.1)
- Slider: Coefficient c2 (-3 to 3, step 0.1)
- Draggable endpoints to adjust v1 and v2 directions
- Toggle: Show span region (shaded area)
- Toggle: Show component arrows tip-to-tail
- Button: Random target challenge
- Button: Show solution for current target
- Display: Current linear combination equation

Default parameters:
- v1: (2, 1)
- v2: (1, 2)
- c1: 1, c2: 1
- Show span: true
- Show components: true

Behavior:
- Adjusting c1/c2 sliders moves result vector smoothly
- Target challenges require finding correct coefficients
- When vectors are parallel, span collapses to a line (visual feedback)
- Component arrows show tip-to-tail construction of sum

Implementation: p5.js with slider controls
</details>

## Linear Independence and Dependence

### Linear Independence

A set of vectors $\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\}$ is **linearly independent** if the only solution to:

$$c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k = \mathbf{0}$$

is $c_1 = c_2 = \cdots = c_k = 0$. In other words, no vector in the set can be written as a linear combination of the others.

Geometric interpretation:

- Two vectors are linearly independent if they are not parallel
- Three vectors in 3D are linearly independent if they don't all lie in the same plane
- Linearly independent vectors point in "genuinely different" directions

### Linear Dependence

Vectors are **linearly dependent** if at least one can be expressed as a linear combination of the others. This occurs when there exist scalars, not all zero, such that:

$$c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k = \mathbf{0}$$

**Example of dependence:** The vectors $\mathbf{v}_1 = (1, 2)$, $\mathbf{v}_2 = (2, 4)$, and $\mathbf{v}_3 = (3, 6)$ are linearly dependent because $\mathbf{v}_2 = 2\mathbf{v}_1$ and $\mathbf{v}_3 = 3\mathbf{v}_1$. They all lie on the same line.

| Property | Linearly Independent | Linearly Dependent |
|----------|---------------------|-------------------|
| Unique representation | Each point in span has unique coefficients | Multiple ways to reach same point |
| Redundancy | No redundant vectors | At least one vector is redundant |
| Span efficiency | Minimal set to span a subspace | Could remove vectors without reducing span |

## Basis and Coordinate Systems

### Basis Vectors

A **basis** for a vector space is a set of linearly independent vectors that span the entire space. Every vector in the space can be written uniquely as a linear combination of basis vectors.

A basis provides:

- A coordinate system for the space
- A way to represent any vector as a list of coefficients
- The minimum number of vectors needed to describe the space

### The Standard Basis

The **standard basis** for $\mathbb{R}^n$ consists of vectors with a single 1 and all other components 0:

For $\mathbb{R}^2$:
$$\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

For $\mathbb{R}^3$:
$$\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{e}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$

The standard basis vectors align with the coordinate axes, making them intuitive for visualization and computation.

### Coordinate Systems

A **coordinate system** assigns a unique tuple of numbers to each point in space. When we choose a basis $\{\mathbf{b}_1, \mathbf{b}_2, \ldots, \mathbf{b}_n\}$, any vector $\mathbf{v}$ can be written as:

$$\mathbf{v} = c_1\mathbf{b}_1 + c_2\mathbf{b}_2 + \cdots + c_n\mathbf{b}_n$$

The coefficients $(c_1, c_2, \ldots, c_n)$ are the **coordinates** of $\mathbf{v}$ with respect to this basis. Different bases give different coordinate representations of the same vector.

#### Diagram: Basis and Coordinate System Visualizer

<iframe src="../../sims/basis-coordinate-visualizer" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>Basis and Coordinate System Visualizer MicroSim</summary>
Type: microsim

Bloom Level: Understand (L2)
Bloom Verb: explain, interpret, compare

Learning Objective: Students will interpret how the same point has different coordinate representations in different bases by visualizing standard and custom basis vectors simultaneously.

Canvas layout:
- Left panel (400px): Standard basis grid with vector
- Right panel (400px): Custom basis grid with same vector
- Bottom: Coordinate comparison display

Visual elements:
- Standard basis: Traditional x-y grid with e1, e2 as unit vectors
- Custom basis: Skewed grid based on chosen basis vectors b1, b2
- Same geometric vector shown in both coordinate systems
- Grid lines parallel to basis vectors in each panel
- Coordinate labels showing (x,y) in standard and (c1,c2) in custom
- Dashed lines from vector tip to axes showing coordinates

Interactive controls:
- Draggable point to select vector (synced between panels)
- Draggable endpoints for custom basis vectors b1 and b2
- Preset buttons: Standard, Rotated 45°, Skewed, Stretched
- Toggle: Show grid lines
- Toggle: Show coordinate projections
- Animation: Morph from standard to custom basis

Default parameters:
- Vector: (3, 2) in standard basis
- Custom basis: b1 = (2, 0), b2 = (1, 1)
- Grid lines: visible
- Projections: visible

Behavior:
- Moving point updates coordinates in both systems
- Changing custom basis redraws right panel grid
- Coordinates update in real-time showing transformation
- Morph animation shows how grid deforms between bases

Implementation: p5.js with matrix transformation for grid rendering
</details>

## Vector Spaces

### Definition of a Vector Space

A **vector space** is a collection of objects called vectors that satisfies ten axioms regarding addition and scalar multiplication. For a set $V$ to be a vector space over a field $F$ (typically $\mathbb{R}$), it must satisfy:

**Addition axioms:**

1. Closure: $\mathbf{u} + \mathbf{v} \in V$
2. Commutativity: $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$
3. Associativity: $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$
4. Identity: There exists $\mathbf{0}$ such that $\mathbf{v} + \mathbf{0} = \mathbf{v}$
5. Inverse: For each $\mathbf{v}$, there exists $-\mathbf{v}$ such that $\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$

**Scalar multiplication axioms:**

6. Closure: $c\mathbf{v} \in V$
7. Distributivity (vectors): $c(\mathbf{u} + \mathbf{v}) = c\mathbf{u} + c\mathbf{v}$
8. Distributivity (scalars): $(c + d)\mathbf{v} = c\mathbf{v} + d\mathbf{v}$
9. Associativity: $c(d\mathbf{v}) = (cd)\mathbf{v}$
10. Identity: $1\mathbf{v} = \mathbf{v}$

### Examples of Vector Spaces

The most familiar vector space is $\mathbb{R}^n$, but vector spaces are more general:

| Vector Space | Elements | Operations |
|--------------|----------|------------|
| $\mathbb{R}^n$ | n-tuples of real numbers | Component-wise addition/scaling |
| Polynomials of degree ≤ n | Polynomials $a_0 + a_1x + \cdots + a_nx^n$ | Add coefficients, scale coefficients |
| Continuous functions on $[a,b]$ | Functions $f: [a,b] \to \mathbb{R}$ | $(f+g)(x) = f(x) + g(x)$ |
| $m \times n$ matrices | Matrices with $m$ rows, $n$ columns | Matrix addition, scalar multiplication |

### Dimension of a Vector Space

The **dimension** of a vector space is the number of vectors in any basis. This count is always the same regardless of which basis you choose—a fundamental theorem of linear algebra.

- $\mathbb{R}^2$ has dimension 2
- $\mathbb{R}^3$ has dimension 3
- The space of polynomials of degree ≤ 3 has dimension 4 (basis: $\{1, x, x^2, x^3\}$)

Dimension tells us the "degrees of freedom" in a vector space—how many independent directions exist.

#### Diagram: Vector Space Axiom Explorer

<iframe src="../../sims/vector-space-axiom-explorer" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Vector Space Axiom Explorer Infographic</summary>
Type: infographic

Bloom Level: Remember (L1)
Bloom Verb: identify, recognize, list

Learning Objective: Students will identify and recognize the ten vector space axioms through an interactive concept map with hover definitions and example demonstrations.

Layout: Central hub showing "Vector Space" with two branches for Addition and Scalar Multiplication axioms

Visual elements:
- Central node: "Vector Space V over field F"
- Left branch (blue theme): Five addition axiom nodes
- Right branch (green theme): Five scalar multiplication axiom nodes
- Each axiom node shows: name, symbolic form, geometric mini-visualization
- Connection lines showing axiom groupings

Interactive elements:
- Hover over axiom node: Tooltip shows full definition and concrete example
- Click axiom node: Animates a 2D example demonstrating the axiom
- Hover over "V": Shows examples of vector spaces
- Hover over "F": Shows examples of fields (R, C)
- Progress tracker: Checkmarks for viewed axioms

Hover text content:
- Closure (add): "For any u, v in V, the sum u + v is also in V"
- Commutativity: "Order doesn't matter: u + v = v + u"
- Associativity (add): "Grouping doesn't matter: (u + v) + w = u + (v + w)"
- Additive identity: "The zero vector 0 exists: v + 0 = v"
- Additive inverse: "Every vector has an opposite: v + (-v) = 0"
- Closure (scalar): "For any scalar c and v in V, cv is also in V"
- Distributivity (vectors): "c(u + v) = cu + cv"
- Distributivity (scalars): "(c + d)v = cv + dv"
- Associativity (scalar): "c(dv) = (cd)v"
- Scalar identity: "1v = v"

Visual style: Modern node-and-edge layout with pastel colors

Implementation: HTML/CSS/JavaScript with SVG nodes and CSS transitions
</details>

## Applications in AI and Machine Learning

The concepts introduced in this chapter form the foundation for understanding machine learning algorithms:

### Feature Vectors

Machine learning represents data points as vectors. A sample with features $(x_1, x_2, \ldots, x_n)$ becomes a vector in $\mathbb{R}^n$. Vector operations enable:

- **Distance-based classification:** k-NN uses Euclidean distance between feature vectors
- **Similarity measures:** Cosine similarity uses the dot product to compare vectors
- **Centering data:** Subtracting the mean vector centers the dataset at the origin

### Word Embeddings

Natural language processing represents words as dense vectors (typically 100-300 dimensions). These embedding vectors capture semantic meaning:

- Similar words have nearby vectors (small Euclidean distance)
- Analogies appear as vector arithmetic: $\vec{king} - \vec{man} + \vec{woman} \approx \vec{queen}$
- The dot product measures semantic similarity

### Neural Network Parameters

Neural networks store learned knowledge in weight matrices and bias vectors. Forward propagation consists of:

1. Linear combination: $\mathbf{z} = \mathbf{W}\mathbf{x} + \mathbf{b}$
2. Nonlinear activation: $\mathbf{a} = \sigma(\mathbf{z})$

Understanding vector spaces helps interpret what neural networks learn and how they transform data.

## Summary

This chapter established the fundamental concepts of linear algebra that underpin all subsequent topics:

**Core Concepts:**

- **Scalars** are single numbers; **vectors** are ordered collections with magnitude and direction
- Vectors exist in spaces of any dimension, from 2D and 3D to high-dimensional feature spaces
- Basic operations include **addition**, **scalar multiplication**, and **subtraction**

**Products and Measurements:**

- The **dot product** returns a scalar measuring projection and angle
- The **cross product** (3D only) returns a perpendicular vector
- **Norms** (L1, L2, L-infinity) measure vector length in different ways
- **Normalization** creates unit vectors for direction comparison

**Abstract Structures:**

- **Linear combinations** create new vectors from scaled sums
- The **span** is all reachable points through linear combinations
- **Linear independence** means no vector is redundant
- A **basis** provides a coordinate system for a vector space
- The **dimension** counts basis vectors (degrees of freedom)

These concepts provide the vocabulary and tools for the matrix operations, transformations, and decompositions explored in subsequent chapters.

??? question "Self-Check: Can you answer these questions?"
    1. What is the geometric interpretation of the dot product $\mathbf{u} \cdot \mathbf{v} = 0$?
    2. If vectors $\mathbf{v}_1$, $\mathbf{v}_2$, $\mathbf{v}_3$ are linearly dependent, what does this mean geometrically in 3D?
    3. Why must a basis for $\mathbb{R}^3$ contain exactly three vectors?
    4. How does the L1 norm differ from the L2 norm when measuring the vector $(3, 4)$?

