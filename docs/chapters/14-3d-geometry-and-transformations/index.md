---
title: 3D Geometry and Transformations
description: Linear algebra foundations for robotics, AR/VR, and 3D computer vision
generated_by: claude skill chapter-content-generator
date: 2026-01-17 19:30:00
version: 0.03
---

# 3D Geometry and Transformations

## Summary

Understanding 3D geometry is essential for robotics, augmented reality, and autonomous vehicles. This chapter covers 3D coordinate systems, rotation representations including Euler angles and quaternions, homogeneous coordinates, camera models with intrinsic and extrinsic parameters, stereo vision, and point cloud processing. These concepts form the foundation for any system that operates in 3D space.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. 3D Coordinate System
2. Euler Angles
3. Gimbal Lock
4. Quaternion
5. Quaternion Rotation
6. Homogeneous Coordinates
7. Rigid Body Transform
8. SE3 Transform
9. Camera Matrix
10. Intrinsic Parameters
11. Extrinsic Parameters
12. Projection Matrix
13. Perspective Projection
14. Stereo Vision
15. Triangulation
16. Epipolar Geometry
17. Point Cloud

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 4: Linear Transformations](../04-linear-transformations/index.md)
- [Chapter 13: Image Processing and Computer Vision](../13-image-processing-and-computer-vision/index.md)

---

## Introduction

From robot arms assembling cars to AR headsets overlaying digital content on the physical world, systems that interact with 3D space require precise mathematical representations of position, orientation, and motion. Linear algebra provides the essential tools:

- **Coordinate systems** establish frames of reference
- **Rotation matrices and quaternions** represent orientation
- **Homogeneous coordinates** unify rotation and translation
- **Camera models** project 3D scenes onto 2D images
- **Stereo vision** recovers 3D structure from multiple views

This chapter develops the geometric foundations needed for robotics, computer vision, augmented reality, and autonomous systems.

## 3D Coordinate Systems

A **3D coordinate system** defines how we specify positions in three-dimensional space using three numbers $(x, y, z)$.

### Right-Hand vs Left-Hand Systems

Two conventions exist for orienting the axes:

| Convention | X Direction | Y Direction | Z Direction | Used By |
|------------|-------------|-------------|-------------|---------|
| Right-hand | Right/East | Up/North | Out of screen | OpenGL, ROS, most math |
| Left-hand | Right | Up | Into screen | DirectX, Unity |

In a **right-hand system**, if you curl your right hand's fingers from X toward Y, your thumb points in the Z direction.

### Common Coordinate Frames

Different applications use different conventions:

| Domain | X | Y | Z | Origin |
|--------|---|---|---|--------|
| Computer graphics | Right | Up | Out (toward viewer) | Screen center |
| Robotics (ROS) | Forward | Left | Up | Robot base |
| Aviation | Forward | Right | Down | Aircraft center |
| Camera | Right | Down | Forward (optical axis) | Camera center |

Understanding and converting between coordinate frames is essential for integrating sensors, actuators, and displays.

#### Diagram: 3D Coordinate System Visualizer

<details markdown="1">
<summary>3D Coordinate System Visualizer</summary>
Type: microsim

Learning objective: Understand different 3D coordinate system conventions and handedness (Bloom: Understand)

Visual elements:
- 3D view with X, Y, Z axes (color coded: X=red, Y=green, Z=blue)
- Origin sphere
- Sample point with coordinates displayed
- Grid planes (XY, XZ, YZ) toggleable
- Animated right-hand rule demonstration

Interactive controls:
- Toggle: Right-hand vs Left-hand system
- Dropdown: Convention preset (OpenGL, DirectX, ROS, Camera)
- Draggable point in 3D space
- Rotate view with mouse drag
- Toggle grid planes on/off

Canvas layout: 700x600px with 3D view using WEBGL

Behavior:
- Switching handedness mirrors the Z axis
- Presets reorient axes according to convention
- Coordinate display updates as point moves
- Show transformation matrix between conventions

Implementation: p5.js with WEBGL for 3D rendering
</details>

## Homogeneous Coordinates

**Homogeneous coordinates** extend Cartesian coordinates with an additional dimension, enabling rotation and translation to be combined in a single matrix multiplication.

### From Cartesian to Homogeneous

A 3D point $(x, y, z)$ becomes a 4D homogeneous point:

$(x, y, z) \rightarrow \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$

To convert back, divide by the fourth component:

$\begin{bmatrix} X \\ Y \\ Z \\ W \end{bmatrix} \rightarrow \left(\frac{X}{W}, \frac{Y}{W}, \frac{Z}{W}\right)$

Points with $W = 0$ represent **directions** (points at infinity).

### Why Homogeneous Coordinates?

In standard 3D coordinates:

- Rotation: $\mathbf{p}' = \mathbf{R}\mathbf{p}$ (matrix multiplication)
- Translation: $\mathbf{p}' = \mathbf{p} + \mathbf{t}$ (addition)

We cannot combine these into a single matrix. With homogeneous coordinates:

$\begin{bmatrix} \mathbf{p}' \\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} \begin{bmatrix} \mathbf{p} \\ 1 \end{bmatrix}$

Now both operations are matrix multiplications, enabling efficient composition of multiple transformations.

| Operation | 3×3 Matrix | 4×4 Homogeneous |
|-----------|-----------|-----------------|
| Rotation only | Yes | Yes |
| Translation only | No | Yes |
| Scale | Yes | Yes |
| Rotation + Translation | No | Yes |
| Projection | No | Yes |

## Rotation Representations

Representing 3D rotations is surprisingly subtle. Several representations exist, each with trade-offs.

### Euler Angles

**Euler angles** describe a rotation as three successive rotations about coordinate axes. The most common convention is:

1. Rotate by $\psi$ (yaw) about Z axis
2. Rotate by $\theta$ (pitch) about Y axis
3. Rotate by $\phi$ (roll) about X axis

#### Euler Angle Rotation Matrices

$\mathbf{R}_z(\psi) = \begin{bmatrix} \cos\psi & -\sin\psi & 0 \\ \sin\psi & \cos\psi & 0 \\ 0 & 0 & 1 \end{bmatrix}$

$\mathbf{R}_y(\theta) = \begin{bmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{bmatrix}$

$\mathbf{R}_x(\phi) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\phi & -\sin\phi \\ 0 & \sin\phi & \cos\phi \end{bmatrix}$

The combined rotation: $\mathbf{R} = \mathbf{R}_z(\psi) \mathbf{R}_y(\theta) \mathbf{R}_x(\phi)$

Different conventions exist (XYZ, ZYX, ZXZ, etc.)—always verify which convention is used!

#### Diagram: Euler Angles Visualizer

<details markdown="1">
<summary>Euler Angles Visualizer</summary>
Type: microsim

Learning objective: Understand how Euler angles compose to form rotations (Bloom: Apply)

Visual elements:
- 3D coordinate frame (object frame)
- Reference coordinate frame (world frame)
- 3D object (e.g., airplane or box) showing orientation
- Arc indicators for each angle
- Rotation axis highlighted during animation

Interactive controls:
- Slider: Yaw (ψ) from -180° to 180°
- Slider: Pitch (θ) from -90° to 90°
- Slider: Roll (φ) from -180° to 180°
- Dropdown: Convention (ZYX, XYZ, ZXZ)
- Button: "Animate sequence" (show rotations step by step)
- Button: "Reset"

Canvas layout: 750x600px with 3D WEBGL view

Behavior:
- Update object orientation in real-time as sliders change
- Animation shows each rotation applied sequentially
- Display rotation matrix numerically
- Highlight gimbal lock region when pitch approaches ±90°

Implementation: p5.js with WEBGL and matrix computation
</details>

### Gimbal Lock

**Gimbal lock** occurs when two rotation axes align, causing loss of one degree of freedom. In the ZYX convention, when pitch $\theta = \pm 90°$:

$\mathbf{R} = \begin{bmatrix} 0 & \mp\sin(\psi \mp \phi) & \pm\cos(\psi \mp \phi) \\ 0 & \cos(\psi \mp \phi) & \sin(\psi \mp \phi) \\ \mp 1 & 0 & 0 \end{bmatrix}$

Notice that yaw and roll combine into a single term $(\psi \mp \phi)$—we can only control their sum or difference, not each independently. The system has lost a degree of freedom.

| Pitch Value | Effect |
|-------------|--------|
| $\theta = 0°$ | Full 3 DOF, no gimbal lock |
| $\theta = \pm 45°$ | Slight coupling between yaw/roll |
| $\theta = \pm 90°$ | Complete gimbal lock, only 2 DOF |

Gimbal lock is a fundamental problem with Euler angles, not a bug in implementation. It motivated the development of quaternions.

#### Diagram: Gimbal Lock Demonstration

<details markdown="1">
<summary>Gimbal Lock Demonstration</summary>
Type: microsim

Learning objective: Experience gimbal lock and understand why it occurs (Bloom: Analyze)

Visual elements:
- Physical gimbal mechanism (three nested rings)
- Object attached to innermost ring
- Color-coded rotation axes
- Warning indicator when approaching gimbal lock

Interactive controls:
- Slider: Outer ring rotation (yaw)
- Slider: Middle ring rotation (pitch)
- Slider: Inner ring rotation (roll)
- Button: "Go to gimbal lock" (set pitch to 90°)
- Button: "Reset"

Canvas layout: 700x600px with 3D gimbal visualization

Behavior:
- As pitch approaches 90°, outer and inner rings align visually
- At gimbal lock, changing yaw and roll produces same motion
- Display effective degrees of freedom (3 normally, 2 at lock)
- Show that some orientations become unreachable

Implementation: p5.js with WEBGL, mechanical gimbal model
</details>

## Quaternions

**Quaternions** provide a singularity-free representation of 3D rotations, avoiding gimbal lock.

### Quaternion Definition

A quaternion has four components:

$\mathbf{q} = w + xi + yj + zk = (w, x, y, z)$

where:

- $w$ is the scalar (real) part
- $(x, y, z)$ is the vector (imaginary) part
- $i, j, k$ satisfy: $i^2 = j^2 = k^2 = ijk = -1$

For representing rotations, we use **unit quaternions** with $\|\mathbf{q}\| = 1$:

$w^2 + x^2 + y^2 + z^2 = 1$

### Quaternion from Axis-Angle

A rotation of angle $\theta$ about unit axis $\hat{\mathbf{n}} = (n_x, n_y, n_z)$:

#### Axis-Angle to Quaternion

$\mathbf{q} = \left(\cos\frac{\theta}{2}, \sin\frac{\theta}{2} \cdot n_x, \sin\frac{\theta}{2} \cdot n_y, \sin\frac{\theta}{2} \cdot n_z\right)$

where:

- $\theta$ is the rotation angle
- $\hat{\mathbf{n}}$ is the rotation axis (unit vector)
- Note the half-angle: rotating by $\theta$ uses $\frac{\theta}{2}$ in the quaternion

### Quaternion Rotation

To rotate a point $\mathbf{p} = (p_x, p_y, p_z)$ by quaternion $\mathbf{q}$:

1. Express the point as a pure quaternion: $\mathbf{p}_q = (0, p_x, p_y, p_z)$
2. Compute: $\mathbf{p}'_q = \mathbf{q} \cdot \mathbf{p}_q \cdot \mathbf{q}^*$
3. Extract the vector part as the rotated point

where $\mathbf{q}^* = (w, -x, -y, -z)$ is the quaternion conjugate.

### Quaternion Multiplication

Quaternion multiplication (non-commutative):

$\mathbf{q}_1 \cdot \mathbf{q}_2 = (w_1 w_2 - \mathbf{v}_1 \cdot \mathbf{v}_2, \; w_1 \mathbf{v}_2 + w_2 \mathbf{v}_1 + \mathbf{v}_1 \times \mathbf{v}_2)$

Composing rotations: $\mathbf{q}_{total} = \mathbf{q}_2 \cdot \mathbf{q}_1$ (apply $\mathbf{q}_1$ first, then $\mathbf{q}_2$)

### Comparison of Rotation Representations

| Representation | Parameters | Singularities | Interpolation | Composition |
|----------------|-----------|---------------|---------------|-------------|
| Euler angles | 3 | Gimbal lock | Poor | Matrix mult |
| Rotation matrix | 9 (with constraints) | None | Complex | Matrix mult |
| Axis-angle | 4 (3 + 1) | At $\theta = 0$ | Linear | Complex |
| Quaternion | 4 (unit constraint) | None | SLERP | Quaternion mult |

#### Diagram: Quaternion Rotation Visualizer

<details markdown="1">
<summary>Quaternion Rotation Visualizer</summary>
Type: microsim

Learning objective: Understand quaternion representation and rotation operation (Bloom: Apply)

Visual elements:
- 3D object with current orientation
- Rotation axis displayed as arrow through origin
- Arc showing rotation angle
- Quaternion components displayed numerically
- Unit sphere showing quaternion (projected)

Interactive controls:
- Axis input: Unit vector (nx, ny, nz) or draggable direction
- Slider: Rotation angle θ (0° to 360°)
- Button: "Apply rotation"
- Button: "Compose with previous"
- Toggle: Show equivalent Euler angles

Canvas layout: 800x600px with 3D visualization

Behavior:
- Display quaternion (w, x, y, z) updating with axis/angle
- Show rotation applied to 3D object
- Demonstrate composition of multiple rotations
- Compare with Euler angle representation
- Show smooth interpolation (SLERP) between orientations

Implementation: p5.js with WEBGL and quaternion math
</details>

## Rigid Body Transforms

A **rigid body transform** combines rotation and translation, preserving distances and angles. It represents the pose (position and orientation) of an object in 3D space.

### SE(3): The Special Euclidean Group

**SE(3)** is the mathematical group of all rigid body transformations in 3D. An SE(3) transform consists of:

- A rotation $\mathbf{R} \in SO(3)$ (3×3 orthogonal matrix with det = 1)
- A translation $\mathbf{t} \in \mathbb{R}^3$

In homogeneous coordinates:

#### SE(3) Transformation Matrix

$\mathbf{T} = \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} = \begin{bmatrix} r_{11} & r_{12} & r_{13} & t_x \\ r_{21} & r_{22} & r_{23} & t_y \\ r_{31} & r_{32} & r_{33} & t_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$

where:

- $\mathbf{R}$ is a 3×3 rotation matrix
- $\mathbf{t} = (t_x, t_y, t_z)^\top$ is the translation vector
- The bottom row $[0, 0, 0, 1]$ maintains homogeneous structure

### Composing Transforms

Multiple transformations compose by matrix multiplication:

$\mathbf{T}_{total} = \mathbf{T}_n \cdot \mathbf{T}_{n-1} \cdots \mathbf{T}_2 \cdot \mathbf{T}_1$

Transforms apply right-to-left: $\mathbf{T}_1$ first, then $\mathbf{T}_2$, etc.

### Inverse Transform

The inverse of an SE(3) transform:

$\mathbf{T}^{-1} = \begin{bmatrix} \mathbf{R}^\top & -\mathbf{R}^\top \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix}$

Note: We use $\mathbf{R}^\top$ instead of computing a matrix inverse since rotation matrices are orthogonal.

#### Diagram: Rigid Body Transform Chain

<details markdown="1">
<summary>Rigid Body Transform Chain</summary>
Type: microsim

Learning objective: Visualize composition of rigid body transforms (Bloom: Apply)

Visual elements:
- World coordinate frame at origin
- Multiple linked coordinate frames (like robot arm joints)
- 3D objects attached to each frame
- Transform arrows showing relationships

Interactive controls:
- Sliders for each joint angle (rotations)
- Sliders for link lengths (translations)
- Toggle: Show individual transforms vs composed
- Button: "Add link"
- Button: "Reset"
- Display: Full transform matrix from world to end effector

Canvas layout: 850x650px with 3D kinematic chain

Behavior:
- Moving one joint updates all downstream frames
- Show transform matrices at each stage
- Highlight how composition order matters
- Demonstrate forward kinematics visually

Implementation: p5.js with WEBGL, matrix chain computation
</details>

## Camera Models

A **camera model** describes how 3D points in the world project onto a 2D image. The most common model is the pinhole camera.

### The Pinhole Camera Model

Light rays pass through a single point (the pinhole or optical center) and project onto an image plane:

- 3D world point: $\mathbf{P}_w = (X, Y, Z)$
- 2D image point: $\mathbf{p} = (u, v)$

The projection involves two stages:

1. **Extrinsic parameters:** Transform from world to camera coordinates
2. **Intrinsic parameters:** Project from camera coordinates to image pixels

### Intrinsic Parameters

**Intrinsic parameters** describe the camera's internal geometry:

#### Camera Intrinsic Matrix

$\mathbf{K} = \begin{bmatrix} f_x & s & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$

where:

- $f_x, f_y$ are focal lengths in pixels (may differ if pixels are non-square)
- $(c_x, c_y)$ is the principal point (usually near image center)
- $s$ is the skew coefficient (usually 0 for modern cameras)

| Parameter | Meaning | Typical Value |
|-----------|---------|---------------|
| $f_x, f_y$ | Focal length × pixels/mm | 500-2000 pixels |
| $c_x$ | Principal point x | image_width / 2 |
| $c_y$ | Principal point y | image_height / 2 |
| $s$ | Skew | 0 |

### Extrinsic Parameters

**Extrinsic parameters** describe the camera's pose in the world:

$[\mathbf{R} | \mathbf{t}]$

where:

- $\mathbf{R}$ is the 3×3 rotation from world to camera frame
- $\mathbf{t}$ is the translation (camera position in world, negated and rotated)

The extrinsic matrix transforms points from world coordinates to camera coordinates.

### The Full Camera Matrix

The complete **projection matrix** combines intrinsic and extrinsic parameters:

#### Projection Matrix

$\mathbf{P} = \mathbf{K} [\mathbf{R} | \mathbf{t}]$

where:

- $\mathbf{P}$ is a 3×4 matrix
- $\mathbf{K}$ is the 3×3 intrinsic matrix
- $[\mathbf{R} | \mathbf{t}]$ is the 3×4 extrinsic matrix

Projection from world to image:

$\begin{bmatrix} u \\ v \\ 1 \end{bmatrix} \sim \mathbf{P} \begin{bmatrix} X \\ Y \\ Z \\ 1 \end{bmatrix}$

The $\sim$ indicates equality up to scale (divide by the third coordinate to get pixel coordinates).

#### Diagram: Camera Model Visualizer

<details markdown="1">
<summary>Camera Model Visualizer</summary>
Type: microsim

Learning objective: Understand how camera parameters affect projection (Bloom: Analyze)

Visual elements:
- 3D scene with objects at various depths
- Camera frustum showing field of view
- Image plane with projected points
- Ray lines from 3D points through camera center to image

Interactive controls:
- Slider: Focal length (affects FOV)
- Slider: Principal point (cx, cy)
- Camera pose controls: position and orientation
- Toggle: Show projection rays
- Toggle: Show camera frustum

Canvas layout: 900x650px with 3D scene and 2D image view

Behavior:
- Changing focal length zooms in/out
- Moving principal point shifts image
- Moving camera updates all projections
- Display intrinsic and extrinsic matrices
- Show correspondence between 3D points and 2D projections

Implementation: p5.js with WEBGL and matrix projection
</details>

### Perspective Projection

**Perspective projection** is the mathematical model of how 3D points map to 2D:

For a point $(X, Y, Z)$ in camera coordinates:

$u = f_x \frac{X}{Z} + c_x, \quad v = f_y \frac{Y}{Z} + c_y$

Key properties:

- Objects farther away appear smaller (division by $Z$)
- Parallel lines may converge to vanishing points
- Depth information is lost (many 3D points map to the same 2D point)

| Projection Type | Properties | Use Case |
|-----------------|------------|----------|
| Perspective | Realistic, depth-dependent scaling | Photos, human vision |
| Orthographic | No depth scaling, parallel projection | Engineering drawings, CAD |
| Weak perspective | Uniform depth for scene | Approximate when depth range is small |

## Stereo Vision

**Stereo vision** uses two cameras to recover 3D structure, mimicking human binocular vision.

### The Stereo Setup

Two cameras with known relative pose observe the same scene:

- **Baseline** $b$: Distance between camera centers
- **Disparity** $d$: Difference in horizontal image position of corresponding points

#### Depth from Disparity

$Z = \frac{f \cdot b}{d}$

where:

- $Z$ is the depth (distance to the point)
- $f$ is the focal length
- $b$ is the baseline (distance between cameras)
- $d = u_L - u_R$ is the disparity (difference in x-coordinates)

Key insight: Larger baseline gives better depth resolution but makes matching harder.

### Epipolar Geometry

**Epipolar geometry** describes the geometric relationship between two views of the same scene.

Key concepts:

- **Epipole:** Where the line connecting camera centers intersects each image plane
- **Epipolar line:** For a point in one image, the corresponding point in the other image lies on this line
- **Epipolar plane:** Plane containing both camera centers and the 3D point

#### The Fundamental Matrix

The **fundamental matrix** $\mathbf{F}$ encodes epipolar geometry:

$\mathbf{p}_R^\top \mathbf{F} \mathbf{p}_L = 0$

where:

- $\mathbf{p}_L, \mathbf{p}_R$ are corresponding points in left and right images (homogeneous)
- $\mathbf{F}$ is a 3×3 matrix with rank 2
- This constraint means $\mathbf{p}_R$ lies on the epipolar line $\mathbf{l}_R = \mathbf{F} \mathbf{p}_L$

The fundamental matrix has 7 degrees of freedom (9 elements minus scale minus rank constraint).

#### Diagram: Epipolar Geometry Visualizer

<details markdown="1">
<summary>Epipolar Geometry Visualizer</summary>
Type: microsim

Learning objective: Understand epipolar constraints in stereo vision (Bloom: Analyze)

Visual elements:
- Top-down view showing two cameras and 3D point
- Left and right image planes
- Epipolar lines drawn on both images
- Epipoles marked
- Epipolar plane visualization

Interactive controls:
- Draggable 3D point position
- Draggable camera positions
- Click on left image point to show epipolar line on right
- Toggle: Show epipolar plane in 3D
- Toggle: Show all epipolar lines (for multiple points)

Canvas layout: 900x700px with 3D view and stereo pair

Behavior:
- Moving 3D point shows how image points move along epipolar lines
- Display fundamental matrix
- Show that corresponding points satisfy epipolar constraint
- Demonstrate baseline effect on epipole positions

Implementation: p5.js with WEBGL and epipolar line computation
</details>

### Triangulation

**Triangulation** computes the 3D position of a point from its projections in two or more images.

Given:

- Camera matrices $\mathbf{P}_L, \mathbf{P}_R$
- Corresponding image points $\mathbf{p}_L, \mathbf{p}_R$

Find the 3D point $\mathbf{P}$ such that:

$\mathbf{p}_L \sim \mathbf{P}_L \mathbf{P}, \quad \mathbf{p}_R \sim \mathbf{P}_R \mathbf{P}$

#### Linear Triangulation

Each correspondence provides two equations. Stack them into a linear system:

$\mathbf{A} \mathbf{P} = \mathbf{0}$

where $\mathbf{A}$ is a 4×4 matrix built from camera matrices and image points. Solve using SVD (find the null space of $\mathbf{A}$).

| Method | Accuracy | Robustness | Computation |
|--------|----------|------------|-------------|
| Linear (DLT) | Moderate | Sensitive to noise | Fast |
| Optimal (geometric) | Best | Good | Iterative |
| Mid-point | Low | Fast | Very fast |

#### Diagram: Triangulation Visualizer

<details markdown="1">
<summary>Triangulation Visualizer</summary>
Type: microsim

Learning objective: Understand how 3D points are recovered from stereo correspondences (Bloom: Apply)

Visual elements:
- Two cameras with projection rays
- Intersection point (triangulated 3D position)
- Error visualization when rays don't perfectly intersect
- Left and right image planes with point markers

Interactive controls:
- Draggable image points on left and right images
- Camera baseline slider
- Add noise toggle (shows triangulation error)
- Display: 3D coordinates, reprojection error

Canvas layout: 800x650px with 3D scene and stereo pair

Behavior:
- Rays from each camera displayed in 3D
- Show exact intersection or closest point when noisy
- Moving image points updates 3D reconstruction
- Display triangulation uncertainty with depth

Implementation: p5.js with WEBGL and linear triangulation
</details>

## Point Clouds

A **point cloud** is a set of 3D points representing the surface or structure of objects and environments.

### Point Cloud Representation

Each point typically includes:

| Attribute | Type | Description |
|-----------|------|-------------|
| Position | $(x, y, z)$ | 3D coordinates |
| Color | $(r, g, b)$ | Optional RGB values |
| Normal | $(n_x, n_y, n_z)$ | Surface orientation |
| Intensity | scalar | Reflection strength (lidar) |

Point clouds can contain millions to billions of points for large-scale scenes.

### Sources of Point Clouds

| Sensor | Principle | Typical Density | Range |
|--------|-----------|-----------------|-------|
| Stereo cameras | Triangulation | Dense (per-pixel) | 1-50m |
| Structured light | Projected pattern | Dense | 0.5-5m |
| Time-of-flight | Light travel time | Medium | 0.5-10m |
| Lidar | Laser scanning | Sparse to medium | 1-200m |
| Photogrammetry | Multi-view | Variable | Any |

### Point Cloud Processing

Common operations on point clouds:

- **Downsampling:** Reduce density using voxel grids
- **Normal estimation:** Compute surface orientation from local neighborhoods
- **Registration:** Align multiple point clouds (ICP algorithm)
- **Segmentation:** Separate ground, objects, etc.
- **Surface reconstruction:** Create meshes from points

#### Diagram: Point Cloud Visualizer

<details markdown="1">
<summary>Point Cloud Visualizer</summary>
Type: microsim

Learning objective: Explore point cloud data and common processing operations (Bloom: Understand)

Visual elements:
- 3D point cloud rendering
- Color by height/intensity/normal
- Bounding box
- Selected point information display

Interactive controls:
- Rotate/zoom/pan 3D view
- Point size slider
- Color mode: height, intensity, RGB, normals
- Downsampling slider (voxel size)
- Toggle: Show surface normals as arrows
- Sample dataset selector

Canvas layout: 800x650px with 3D point cloud view

Behavior:
- Load and display sample point clouds
- Real-time downsampling preview
- Click point to show coordinates
- Display point count and bounding box dimensions

Implementation: p5.js with WEBGL, point rendering
</details>

### Point Cloud Registration

**Registration** aligns two point clouds into a common coordinate frame. The classic algorithm is **Iterative Closest Point (ICP)**:

1. For each point in source cloud, find nearest neighbor in target
2. Estimate rigid transform minimizing point-to-point distances
3. Apply transform to source cloud
4. Repeat until convergence

ICP finds the transform $(\mathbf{R}, \mathbf{t})$ minimizing:

$E = \sum_{i} \| \mathbf{R} \mathbf{p}_i + \mathbf{t} - \mathbf{q}_i \|^2$

where $\mathbf{p}_i$ are source points and $\mathbf{q}_i$ are corresponding target points.

## Python Implementation

```python
import numpy as np

def quaternion_from_axis_angle(axis, angle):
    """Create quaternion from axis-angle representation."""
    axis = axis / np.linalg.norm(axis)  # Ensure unit axis
    half_angle = angle / 2
    w = np.cos(half_angle)
    xyz = np.sin(half_angle) * axis
    return np.array([w, xyz[0], xyz[1], xyz[2]])

def quaternion_rotate(q, point):
    """Rotate a 3D point by a quaternion."""
    # Point as pure quaternion
    p = np.array([0, point[0], point[1], point[2]])

    # q * p * q_conjugate
    q_conj = np.array([q[0], -q[1], -q[2], -q[3]])
    result = quaternion_multiply(quaternion_multiply(q, p), q_conj)

    return result[1:4]

def quaternion_multiply(q1, q2):
    """Multiply two quaternions."""
    w1, x1, y1, z1 = q1
    w2, x2, y2, z2 = q2
    return np.array([
        w1*w2 - x1*x2 - y1*y2 - z1*z2,
        w1*x2 + x1*w2 + y1*z2 - z1*y2,
        w1*y2 - x1*z2 + y1*w2 + z1*x2,
        w1*z2 + x1*y2 - y1*x2 + z1*w2
    ])

def project_point(P, K, R, t):
    """Project 3D point to 2D using camera model."""
    # World to camera coordinates
    P_cam = R @ P + t

    # Perspective projection
    x = P_cam[0] / P_cam[2]
    y = P_cam[1] / P_cam[2]

    # Apply intrinsic matrix
    u = K[0, 0] * x + K[0, 2]
    v = K[1, 1] * y + K[1, 2]

    return np.array([u, v])

def triangulate(P1, P2, p1, p2):
    """Triangulate 3D point from two views."""
    # Build the A matrix for DLT
    A = np.array([
        p1[0] * P1[2, :] - P1[0, :],
        p1[1] * P1[2, :] - P1[1, :],
        p2[0] * P2[2, :] - P2[0, :],
        p2[1] * P2[2, :] - P2[1, :]
    ])

    # SVD solution
    _, _, Vt = np.linalg.svd(A)
    X = Vt[-1]

    # Convert from homogeneous
    return X[:3] / X[3]
```

## Summary

3D geometry and transformations provide the mathematical foundation for spatial computing:

**Coordinate Systems and Representations:**

- 3D coordinate systems use handedness conventions (right-hand vs left-hand)
- Homogeneous coordinates unify rotation and translation as matrix multiplication
- Different domains (robotics, graphics, vision) use different conventions

**Rotation Representations:**

- Euler angles are intuitive but suffer from gimbal lock
- Quaternions provide singularity-free rotation representation
- Unit quaternions form a double cover of SO(3)

**Rigid Body Transforms:**

- SE(3) combines rotation and translation
- 4×4 homogeneous matrices enable efficient composition
- Transform chains model articulated systems like robot arms

**Camera Models:**

- Intrinsic parameters describe internal camera geometry
- Extrinsic parameters describe camera pose in the world
- The projection matrix combines both for 3D-to-2D mapping

**Stereo Vision:**

- Two views enable 3D reconstruction via triangulation
- Epipolar geometry constrains correspondence search
- Depth is inversely proportional to disparity

**Point Clouds:**

- Represent 3D structure as sets of points
- Generated by various sensors (lidar, stereo, structured light)
- Registration aligns multiple scans into a common frame

## Self-Check Questions

??? question "Why do we use half the rotation angle in the quaternion representation?"
    Quaternions provide a double cover of the rotation group SO(3), meaning both $\mathbf{q}$ and $-\mathbf{q}$ represent the same rotation. Using $\frac{\theta}{2}$ in the quaternion formula ensures that rotating by $\theta$ actually produces a rotation of $\theta$ (not $2\theta$) when we compute $\mathbf{q} \cdot \mathbf{p} \cdot \mathbf{q}^*$. The quaternion multiplication effectively applies the rotation twice (once with $\mathbf{q}$, once with $\mathbf{q}^*$), so we need half angles to get the correct total rotation.

??? question "What information is lost during perspective projection, and why does this matter for 3D reconstruction?"
    Perspective projection loses depth information: all points along a ray from the camera center project to the same image point. Mathematically, $(X, Y, Z)$ and $(kX, kY, kZ)$ for any $k > 0$ produce identical image coordinates. This is why a single image cannot determine 3D structure—we need additional constraints like multiple views (stereo), known object size, or depth sensors. Stereo vision solves this by observing the same point from two locations, where the disparity (difference in image position) encodes depth.

??? question "How does the baseline affect stereo depth estimation?"
    The depth-disparity relationship is $Z = \frac{fb}{d}$. With larger baseline $b$, the same depth produces larger disparity, improving depth resolution (we can distinguish smaller depth differences). However, larger baseline makes stereo matching harder because: (1) occlusions become more common—parts visible in one camera may be hidden in the other, (2) appearance changes more between views, and (3) the search range for correspondences increases. Practical systems balance these trade-offs based on the target depth range.

??? question "Why is gimbal lock a fundamental problem rather than an implementation bug?"
    Gimbal lock is inherent to representing 3D rotation with three sequential rotations about fixed axes. Any three-parameter rotation representation that uses Euler-type angles will have singularities because SO(3) (the rotation group) cannot be smoothly parameterized by $\mathbb{R}^3$. At the singularity, two rotation axes align, reducing the effective degrees of freedom from 3 to 2. No choice of axis order eliminates the problem—it just moves the singularity. Quaternions avoid this by using four parameters with a unit constraint, providing a smooth parameterization of rotations.
