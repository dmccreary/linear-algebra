---
title: Autonomous Systems and Sensor Fusion
description: Linear algebra powering self-driving cars, robots, and autonomous systems
generated_by: claude skill chapter-content-generator
date: 2026-01-17 20:00:00
version: 0.03
---

# Autonomous Systems and Sensor Fusion

## Summary

The capstone chapter applies all course concepts to the complex, safety-critical domain of autonomous vehicles and robotics. You will learn LIDAR point cloud processing, camera calibration, sensor fusion with Kalman filters, state estimation and prediction, SLAM (Simultaneous Localization and Mapping), object detection and tracking, and path planning algorithms. These are the techniques that enable self-driving cars and autonomous robots.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. LIDAR Point Cloud
2. Camera Calibration
3. Sensor Fusion
4. Kalman Filter
5. State Vector
6. Measurement Vector
7. Prediction Step
8. Update Step
9. Kalman Gain
10. Extended Kalman Filter
11. State Estimation
12. SLAM
13. Localization
14. Mapping
15. Object Detection
16. Object Tracking
17. Bounding Box
18. Path Planning
19. Motion Planning
20. Trajectory Optimization

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 10: Neural Networks and Deep Learning](../10-neural-networks-and-deep-learning/index.md)
- [Chapter 12: Optimization and Learning Algorithms](../12-optimization-and-learning-algorithms/index.md)
- [Chapter 13: Image Processing and Computer Vision](../13-image-processing-and-computer-vision/index.md)
- [Chapter 14: 3D Geometry and Transformations](../14-3d-geometry-and-transformations/index.md)

---

## Introduction

Autonomous systems—self-driving cars, delivery robots, drones—must perceive their environment, understand their location, and plan safe paths through the world. These capabilities require integrating everything we've learned about linear algebra:

- **Sensor data** arrives as vectors and matrices (images, point clouds)
- **State estimation** uses matrix equations to fuse noisy measurements
- **Transformations** relate sensor frames to world coordinates
- **Optimization** finds efficient, collision-free trajectories

This capstone chapter synthesizes these concepts into the complete autonomy stack used by real-world robots and vehicles.

## Sensing the Environment

Autonomous systems perceive the world through multiple sensors, each providing complementary information.

### LIDAR Point Clouds

**LIDAR** (Light Detection and Ranging) measures distances by timing laser pulses. A spinning LIDAR captures a **point cloud**—a set of 3D points representing surfaces in the environment.

Each LIDAR point contains:

| Attribute | Description | Typical Range |
|-----------|-------------|---------------|
| $(x, y, z)$ | 3D position | 0.5-200 meters |
| Intensity | Reflection strength | 0-255 |
| Ring/Channel | Which laser beam | 0-127 |
| Timestamp | Acquisition time | Nanosecond precision |

A single LIDAR scan may contain 100,000+ points, producing a sparse but accurate 3D representation.

**Processing pipeline:**

1. **Ground removal:** Segment points into ground vs obstacles
2. **Clustering:** Group nearby points into objects
3. **Classification:** Identify object types (car, pedestrian, cyclist)
4. **Tracking:** Associate objects across frames

#### Diagram: LIDAR Point Cloud Visualizer

<details markdown="1">
<summary>LIDAR Point Cloud Visualizer</summary>
Type: microsim

Learning objective: Understand LIDAR data structure and basic processing (Bloom: Understand)

Visual elements:
- 3D point cloud rendering with intensity coloring
- Ground plane visualization
- Clustered objects highlighted in different colors
- Ego vehicle position marker at origin
- Distance rings at 10m, 25m, 50m

Interactive controls:
- Rotate/zoom/pan 3D view
- Toggle: Show ground points
- Toggle: Show clustered objects
- Slider: Point size
- Slider: Intensity threshold
- Dropdown: Color by (intensity, height, distance, cluster)

Canvas layout: 850x650px with 3D point cloud view

Behavior:
- Load sample LIDAR scans from driving dataset
- Real-time ground segmentation preview
- Click on cluster to show point count and bounding box
- Animate through sequence of scans

Implementation: p5.js with WEBGL, point rendering
</details>

### Camera Calibration

**Camera calibration** determines the intrinsic and extrinsic parameters needed to accurately project 3D points to image pixels and vice versa.

**Intrinsic calibration** finds the camera matrix $\mathbf{K}$:

$\mathbf{K} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$

Plus distortion coefficients $(k_1, k_2, p_1, p_2, k_3)$ for radial and tangential lens distortion.

**Extrinsic calibration** finds the transformation between sensors:

- Camera-to-LIDAR: $\mathbf{T}_{CL}$ for projecting LIDAR points onto images
- Camera-to-vehicle: $\mathbf{T}_{CV}$ for relating detections to vehicle frame

| Calibration Type | What It Determines | Method |
|------------------|-------------------|--------|
| Intrinsic | Focal length, principal point, distortion | Checkerboard pattern |
| Extrinsic (camera-LIDAR) | Relative pose | Correspondences or joint optimization |
| Extrinsic (multi-camera) | Camera arrangement | Overlapping views |

#### Diagram: Camera Calibration Visualizer

<details markdown="1">
<summary>Camera Calibration Visualizer</summary>
Type: microsim

Learning objective: Understand camera calibration process and distortion correction (Bloom: Apply)

Visual elements:
- Raw image with detected checkerboard corners
- Undistorted image showing correction
- 3D view of checkerboard poses
- Reprojection error visualization

Interactive controls:
- Slider: Radial distortion k1, k2
- Slider: Focal length
- Toggle: Show/hide detected corners
- Toggle: Show reprojection errors as vectors
- Button: "Calibrate" (run optimization)

Canvas layout: 900x600px with raw/corrected image comparison

Behavior:
- Display checkerboard corner detection
- Show barrel/pincushion distortion effects
- Visualize how calibration reduces reprojection error
- Display calibration matrix values

Implementation: p5.js with corner detection simulation
</details>

## State Estimation

Autonomous systems must estimate their state (position, velocity, orientation) from noisy sensor measurements. **State estimation** is the process of inferring the true state from uncertain observations.

### The State Vector

The **state vector** $\mathbf{x}$ contains all variables we want to estimate:

#### Vehicle State Vector Example

$\mathbf{x} = \begin{bmatrix} p_x \\ p_y \\ v_x \\ v_y \\ \theta \\ \omega \end{bmatrix}$

where:

- $(p_x, p_y)$ is position
- $(v_x, v_y)$ is velocity
- $\theta$ is heading angle
- $\omega$ is angular velocity (yaw rate)

The state dimension depends on what we're tracking:

| Application | State Variables | Dimension |
|-------------|-----------------|-----------|
| 2D position only | $x, y$ | 2 |
| 2D with velocity | $x, y, v_x, v_y$ | 4 |
| 2D with heading | $x, y, \theta, v, \omega$ | 5 |
| 3D pose | $x, y, z, \phi, \theta, \psi$ | 6 |
| Full 3D dynamics | Position, velocity, orientation, angular velocity | 12+ |

### The Measurement Vector

The **measurement vector** $\mathbf{z}$ contains sensor observations:

$\mathbf{z} = \begin{bmatrix} z_1 \\ z_2 \\ \vdots \\ z_m \end{bmatrix}$

Measurements are related to the state by the **observation model**:

$\mathbf{z} = \mathbf{H}\mathbf{x} + \mathbf{v}$

where:

- $\mathbf{H}$ is the observation matrix (which state variables are observed)
- $\mathbf{v}$ is measurement noise (typically Gaussian with covariance $\mathbf{R}$)

| Sensor | Measures | Observation Matrix $\mathbf{H}$ |
|--------|----------|--------------------------------|
| GPS | Position only | $[I_{2×2}, 0_{2×4}]$ |
| Speedometer | Speed magnitude | Nonlinear |
| IMU | Acceleration, angular velocity | Depends on state definition |
| Camera | Bearing to landmarks | Nonlinear |

## The Kalman Filter

The **Kalman filter** is the optimal estimator for linear systems with Gaussian noise. It recursively estimates the state by combining predictions with measurements.

### The Kalman Filter Model

The system evolves according to:

**State transition:**
$\mathbf{x}_k = \mathbf{F}\mathbf{x}_{k-1} + \mathbf{B}\mathbf{u}_k + \mathbf{w}_k$

**Observation:**
$\mathbf{z}_k = \mathbf{H}\mathbf{x}_k + \mathbf{v}_k$

where:

- $\mathbf{F}$ is the state transition matrix
- $\mathbf{B}$ is the control input matrix
- $\mathbf{u}_k$ is the control input (e.g., acceleration command)
- $\mathbf{w}_k \sim \mathcal{N}(0, \mathbf{Q})$ is process noise
- $\mathbf{v}_k \sim \mathcal{N}(0, \mathbf{R})$ is measurement noise

### The Prediction Step

The **prediction step** propagates the state estimate forward in time:

#### Kalman Filter Prediction

$\hat{\mathbf{x}}_k^- = \mathbf{F}\hat{\mathbf{x}}_{k-1} + \mathbf{B}\mathbf{u}_k$

$\mathbf{P}_k^- = \mathbf{F}\mathbf{P}_{k-1}\mathbf{F}^\top + \mathbf{Q}$

where:

- $\hat{\mathbf{x}}_k^-$ is the predicted state (prior)
- $\mathbf{P}_k^-$ is the predicted covariance (uncertainty grows)
- The superscript $^-$ indicates "before incorporating measurement"

### The Update Step

The **update step** incorporates the new measurement:

#### Kalman Filter Update

$\mathbf{K}_k = \mathbf{P}_k^- \mathbf{H}^\top (\mathbf{H}\mathbf{P}_k^-\mathbf{H}^\top + \mathbf{R})^{-1}$

$\hat{\mathbf{x}}_k = \hat{\mathbf{x}}_k^- + \mathbf{K}_k(\mathbf{z}_k - \mathbf{H}\hat{\mathbf{x}}_k^-)$

$\mathbf{P}_k = (\mathbf{I} - \mathbf{K}_k\mathbf{H})\mathbf{P}_k^-$

where:

- $\mathbf{K}_k$ is the Kalman gain
- $(\mathbf{z}_k - \mathbf{H}\hat{\mathbf{x}}_k^-)$ is the innovation (measurement residual)
- $\mathbf{P}_k$ is the updated (posterior) covariance

### The Kalman Gain

The **Kalman gain** $\mathbf{K}$ optimally weights the prediction versus the measurement:

- When measurement noise $\mathbf{R}$ is large: $\mathbf{K} \to 0$ (trust prediction)
- When prediction uncertainty $\mathbf{P}^-$ is large: $\mathbf{K} \to \mathbf{H}^{-1}$ (trust measurement)

The Kalman gain minimizes the expected squared estimation error—it's the optimal linear estimator.

#### Diagram: Kalman Filter Visualizer

<details markdown="1">
<summary>Kalman Filter Visualizer</summary>
Type: microsim

Learning objective: Understand how Kalman filter combines prediction and measurement (Bloom: Apply)

Visual elements:
- 2D tracking display with true position (hidden), estimate, and measurements
- Uncertainty ellipse showing covariance
- Prediction arrow (where we expect to go)
- Measurement marker (noisy observation)
- Innovation vector (measurement - prediction)

Interactive controls:
- Slider: Process noise Q (how much motion varies)
- Slider: Measurement noise R (sensor accuracy)
- Button: "Step" (one predict-update cycle)
- Button: "Run" (continuous tracking)
- Toggle: Show true position (for debugging)
- Dropdown: Motion model (constant velocity, constant acceleration)

Canvas layout: 800x600px with tracking visualization

Behavior:
- Simulate object moving with random accelerations
- Generate noisy measurements
- Show uncertainty ellipse growing in prediction, shrinking after update
- Display Kalman gain magnitude
- Plot estimation error over time

Implementation: p5.js with matrix operations for Kalman equations
</details>

### Extended Kalman Filter

The **Extended Kalman Filter (EKF)** handles nonlinear systems by linearizing around the current estimate.

For nonlinear models:

$\mathbf{x}_k = f(\mathbf{x}_{k-1}, \mathbf{u}_k) + \mathbf{w}_k$

$\mathbf{z}_k = h(\mathbf{x}_k) + \mathbf{v}_k$

The EKF uses Jacobians instead of constant matrices:

| Standard KF | EKF Equivalent |
|-------------|----------------|
| $\mathbf{F}$ | $\mathbf{F}_k = \frac{\partial f}{\partial \mathbf{x}}\bigg|_{\hat{\mathbf{x}}_{k-1}}$ |
| $\mathbf{H}$ | $\mathbf{H}_k = \frac{\partial h}{\partial \mathbf{x}}\bigg|_{\hat{\mathbf{x}}_k^-}$ |

Common nonlinearities in autonomous systems:

- **Coordinate transforms:** Polar to Cartesian for radar
- **Motion models:** Constant turn rate and velocity (CTRV)
- **Observation models:** Bearing and range from position

## Sensor Fusion

**Sensor fusion** combines data from multiple sensors to achieve better accuracy and robustness than any single sensor alone.

### Why Fuse Sensors?

| Sensor | Strengths | Weaknesses |
|--------|-----------|------------|
| GPS | Absolute position, global | Low rate, poor in tunnels/urban canyons |
| IMU | High rate, works everywhere | Drift over time |
| LIDAR | Accurate 3D, works in dark | Expensive, sparse |
| Camera | Dense, semantic info | Affected by lighting, no direct depth |
| Radar | Works in weather, velocity | Low resolution |

Fusion compensates for individual sensor weaknesses:

- GPS + IMU: High-rate positioning with drift correction
- Camera + LIDAR: Dense semantic 3D understanding
- Radar + Camera: All-weather perception with classification

### Fusion Architectures

| Architecture | Description | Pros | Cons |
|--------------|-------------|------|------|
| Early fusion | Combine raw data | Maximum information | Complex, tight coupling |
| Late fusion | Combine detections/tracks | Modular, sensor-independent | May lose information |
| Mid-level fusion | Combine features | Balance of flexibility and info | Design complexity |

The Kalman filter naturally performs sensor fusion by incorporating multiple measurement sources in the update step:

$\mathbf{z} = \begin{bmatrix} \mathbf{z}_{GPS} \\ \mathbf{z}_{IMU} \\ \vdots \end{bmatrix}, \quad \mathbf{H} = \begin{bmatrix} \mathbf{H}_{GPS} \\ \mathbf{H}_{IMU} \\ \vdots \end{bmatrix}$

#### Diagram: Sensor Fusion Visualizer

<details markdown="1">
<summary>Sensor Fusion Visualizer</summary>
Type: microsim

Learning objective: Understand how multiple sensors improve state estimation (Bloom: Analyze)

Visual elements:
- Vehicle track with true position
- GPS measurements (blue dots, noisy, low rate)
- IMU-based dead reckoning (orange line, drifting)
- Fused estimate (green line, best of both)
- Uncertainty ellipses for each estimate

Interactive controls:
- Toggle: Enable/disable GPS
- Toggle: Enable/disable IMU
- Slider: GPS noise level
- Slider: IMU drift rate
- Button: "Run simulation"
- Display: RMSE for each estimation method

Canvas layout: 850x650px with tracking comparison

Behavior:
- Show GPS-only tracking (jumpy, gaps)
- Show IMU-only tracking (smooth but drifting)
- Show fused result (smooth and accurate)
- Quantify improvement from fusion

Implementation: p5.js with multi-sensor Kalman filter
</details>

## SLAM: Simultaneous Localization and Mapping

**SLAM** solves the chicken-and-egg problem: to localize, you need a map; to build a map, you need to know your location.

### The SLAM Problem

SLAM jointly estimates:

1. **Localization:** The robot's pose over time
2. **Mapping:** The positions of landmarks/features in the environment

The state vector grows as new landmarks are discovered:

$\mathbf{x} = \begin{bmatrix} \mathbf{x}_R \\ \mathbf{m}_1 \\ \mathbf{m}_2 \\ \vdots \\ \mathbf{m}_n \end{bmatrix}$

where $\mathbf{x}_R$ is the robot pose and $\mathbf{m}_i$ are landmark positions.

### SLAM Approaches

| Approach | Representation | Scalability | Accuracy |
|----------|---------------|-------------|----------|
| EKF-SLAM | Gaussian, dense covariance | O(n²) landmarks | High (small maps) |
| Particle Filter SLAM | Particles for pose, EKF for map | Medium maps | Good |
| Graph-based SLAM | Pose graph, optimization | Large maps | Very high |
| Visual SLAM | Features from cameras | Real-time capable | Good |

### Graph-Based SLAM

Modern SLAM systems formulate the problem as **graph optimization**:

- **Nodes:** Robot poses at different times, landmark positions
- **Edges:** Constraints from odometry and observations
- **Optimization:** Find poses/landmarks minimizing total constraint error

The optimization minimizes:

$\mathbf{x}^* = \arg\min_{\mathbf{x}} \sum_{\langle i,j \rangle} \| \mathbf{z}_{ij} - h(\mathbf{x}_i, \mathbf{x}_j) \|^2_{\mathbf{\Omega}_{ij}}$

where $\mathbf{z}_{ij}$ is the measurement between nodes $i$ and $j$, and $\mathbf{\Omega}_{ij}$ is the information matrix (inverse covariance).

#### Diagram: SLAM Visualizer

<details markdown="1">
<summary>SLAM Visualizer</summary>
Type: microsim

Learning objective: Understand the SLAM problem and loop closure (Bloom: Analyze)

Visual elements:
- Robot trajectory (estimated vs true)
- Landmark positions (estimated vs true)
- Pose graph edges
- Loop closure detection highlight
- Uncertainty ellipses on poses and landmarks

Interactive controls:
- Button: "Move robot" (add new pose)
- Button: "Add landmark observation"
- Button: "Loop closure" (recognize previously seen place)
- Toggle: Show covariance ellipses
- Slider: Odometry noise
- Button: "Optimize graph"

Canvas layout: 900x700px with SLAM visualization

Behavior:
- Show drift accumulating without loop closures
- Demonstrate how loop closure corrects the entire trajectory
- Visualize uncertainty reduction after optimization
- Display before/after comparison for loop closure

Implementation: p5.js with simple graph optimization
</details>

## Object Detection and Tracking

Autonomous systems must detect other road users and track them over time to predict their future behavior.

### Object Detection

**Object detection** identifies and localizes objects in sensor data:

- **2D detection (camera):** Bounding boxes in image coordinates
- **3D detection (LIDAR):** 3D bounding boxes in world coordinates

Modern detection uses deep learning (CNNs for images, PointNets for point clouds).

### Bounding Boxes

A **bounding box** represents an object's spatial extent:

**2D Bounding Box:**
$(x_{min}, y_{min}, x_{max}, y_{max})$ or $(x_{center}, y_{center}, width, height)$

**3D Bounding Box:**

$\mathbf{B} = (x, y, z, l, w, h, \theta)$

where:

- $(x, y, z)$ is the center position
- $(l, w, h)$ are length, width, height
- $\theta$ is the heading angle (yaw)

| Detection Output | Components | Use Case |
|------------------|------------|----------|
| 2D box | 4 values + class | Image-based detection |
| 3D box | 7 values + class | LIDAR/fusion detection |
| Oriented box | Center, axes, rotation | General 3D objects |
| Polygon/mask | Variable points | Precise shape |

### Object Tracking

**Object tracking** associates detections across time to maintain consistent object identities.

The tracking pipeline:

1. **Prediction:** Where do we expect objects to be? (Kalman filter)
2. **Association:** Match predictions to new detections
3. **Update:** Refine state estimates with matched detections
4. **Track management:** Create new tracks, delete lost tracks

**Association** uses distance metrics:

- **IoU (Intersection over Union):** Geometric overlap of boxes
- **Mahalanobis distance:** Statistical distance using uncertainty
- **Appearance features:** Visual similarity (deep learning embeddings)

The **Hungarian algorithm** finds optimal one-to-one assignment minimizing total cost.

#### Diagram: Object Tracking Visualizer

<details markdown="1">
<summary>Object Tracking Visualizer</summary>
Type: microsim

Learning objective: Understand multi-object tracking with prediction and association (Bloom: Apply)

Visual elements:
- Top-down view of scene with multiple moving objects
- Predicted positions (dashed boxes)
- Detected positions (solid boxes)
- Track IDs displayed on each object
- Association lines connecting predictions to detections

Interactive controls:
- Button: "Step" (advance one frame)
- Button: "Run" (continuous tracking)
- Toggle: Show predictions
- Toggle: Show track history (trails)
- Slider: Detection noise
- Slider: Miss probability (some detections missing)

Canvas layout: 800x650px with tracking visualization

Behavior:
- Objects move with realistic motion patterns
- Generate noisy detections with occasional misses
- Show prediction-to-detection association
- Handle track creation (new objects) and deletion (lost objects)
- Display track count and IDs

Implementation: p5.js with Kalman tracking and Hungarian assignment
</details>

## Path and Motion Planning

Given the current state and a goal, planning algorithms find safe, efficient paths through the environment.

### Path Planning

**Path planning** finds a collision-free geometric path from start to goal.

Classic algorithms:

| Algorithm | Type | Optimality | Completeness |
|-----------|------|------------|--------------|
| A* | Graph search | Optimal (with admissible heuristic) | Yes |
| RRT | Sampling-based | Asymptotically optimal (RRT*) | Probabilistically complete |
| Dijkstra | Graph search | Optimal | Yes |
| Potential fields | Gradient descent | No | No (local minima) |

**A* algorithm:**

$f(n) = g(n) + h(n)$

where:

- $g(n)$ is the cost from start to node $n$
- $h(n)$ is the heuristic estimate from $n$ to goal
- A* expands nodes in order of lowest $f(n)$

### Motion Planning

**Motion planning** extends path planning to consider vehicle dynamics:

- **Kinematic constraints:** Minimum turning radius, maximum steering angle
- **Dynamic constraints:** Acceleration limits, comfort bounds
- **Temporal constraints:** Speed limits, timing requirements

The vehicle must follow paths that are physically achievable.

### Trajectory Optimization

**Trajectory optimization** finds the optimal trajectory minimizing a cost function:

#### Trajectory Cost Function

$J = \int_0^T \left[ w_1 \|\ddot{\mathbf{x}}\|^2 + w_2 \|\mathbf{u}\|^2 + w_3 c_{obstacle}(\mathbf{x}) \right] dt + w_4 \|\mathbf{x}(T) - \mathbf{x}_{goal}\|^2$

where:

- $\|\ddot{\mathbf{x}}\|^2$ penalizes acceleration (smoothness)
- $\|\mathbf{u}\|^2$ penalizes control effort
- $c_{obstacle}$ penalizes proximity to obstacles
- The final term penalizes distance to goal

This is solved using:

- **Nonlinear optimization:** Sequential quadratic programming (SQP)
- **Model predictive control:** Receding horizon optimization
- **Sampling methods:** Generate and evaluate candidate trajectories

#### Diagram: Path Planning Visualizer

<details markdown="1">
<summary>Path Planning Visualizer</summary>
Type: microsim

Learning objective: Compare path planning algorithms (Bloom: Evaluate)

Visual elements:
- 2D environment with obstacles
- Start and goal positions
- Planned path(s)
- Explored nodes/samples (for search visualization)
- Collision-free corridor

Interactive controls:
- Click to place start/goal
- Draw obstacles (click and drag)
- Dropdown: Algorithm (A*, RRT, Dijkstra, RRT*)
- Slider: Grid resolution (for A*)
- Button: "Plan" (run algorithm)
- Button: "Clear obstacles"
- Toggle: Show exploration

Canvas layout: 850x700px with planning environment

Behavior:
- Animate algorithm exploration (A* wave, RRT tree growth)
- Display path length and computation time
- Show algorithm-specific parameters
- Compare multiple algorithms on same environment

Implementation: p5.js with grid-based and sampling-based planners
</details>

#### Diagram: Trajectory Optimization Visualizer

<details markdown="1">
<summary>Trajectory Optimization Visualizer</summary>
Type: microsim

Learning objective: Understand trajectory optimization with constraints (Bloom: Apply)

Visual elements:
- Vehicle trajectory through obstacle field
- Velocity profile along path
- Acceleration profile
- Obstacle proximity visualization
- Optimization cost convergence plot

Interactive controls:
- Slider: Smoothness weight (w1)
- Slider: Speed limit
- Slider: Obstacle clearance margin
- Draggable waypoints
- Button: "Optimize"
- Toggle: Show velocity/acceleration profiles

Canvas layout: 900x700px with trajectory and profiles

Behavior:
- Initial path from waypoints
- Optimization smooths path while avoiding obstacles
- Show tradeoff between path length and smoothness
- Display constraint satisfaction (velocity limits, clearance)

Implementation: p5.js with gradient-based trajectory optimization
</details>

## Putting It All Together

A complete autonomous system integrates all these components:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   LIDAR     │────▶│  Detection  │────▶│   Tracks    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
┌─────────────┐     ┌─────────────┐            │
│   Camera    │────▶│  Detection  │────────────┤
└─────────────┘     └─────────────┘            │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  GPS/IMU    │────▶│   State     │────▶│    SLAM     │
└─────────────┘     │  Estimation │     │  (optional) │
                    └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Fusion    │◀────│  World      │
                    │             │     │  Model      │
                    └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Planning   │────▶│   Control   │
                    └─────────────┘     └─────────────┘
```

The system runs at different rates:

| Component | Typical Rate | Latency Requirement |
|-----------|-------------|---------------------|
| LIDAR processing | 10-20 Hz | <50ms |
| Camera detection | 10-30 Hz | <100ms |
| State estimation | 100-400 Hz | <10ms |
| Tracking | 10-20 Hz | <50ms |
| Planning | 5-10 Hz | <100ms |
| Control | 50-100 Hz | <20ms |

## Python Implementation

```python
import numpy as np

class KalmanFilter:
    def __init__(self, dim_x, dim_z):
        """Initialize Kalman filter for state dimension dim_x, measurement dimension dim_z."""
        self.dim_x = dim_x
        self.dim_z = dim_z

        # State estimate and covariance
        self.x = np.zeros((dim_x, 1))
        self.P = np.eye(dim_x)

        # State transition and control matrices
        self.F = np.eye(dim_x)
        self.B = np.zeros((dim_x, 1))

        # Observation matrix
        self.H = np.zeros((dim_z, dim_x))

        # Noise covariances
        self.Q = np.eye(dim_x)  # Process noise
        self.R = np.eye(dim_z)  # Measurement noise

    def predict(self, u=None):
        """Prediction step."""
        if u is None:
            u = np.zeros((self.B.shape[1], 1))

        # Predicted state
        self.x = self.F @ self.x + self.B @ u

        # Predicted covariance
        self.P = self.F @ self.P @ self.F.T + self.Q

    def update(self, z):
        """Update step with measurement z."""
        # Innovation (measurement residual)
        y = z - self.H @ self.x

        # Innovation covariance
        S = self.H @ self.P @ self.H.T + self.R

        # Kalman gain
        K = self.P @ self.H.T @ np.linalg.inv(S)

        # Updated state
        self.x = self.x + K @ y

        # Updated covariance
        I = np.eye(self.dim_x)
        self.P = (I - K @ self.H) @ self.P


def iou_2d(box1, box2):
    """Compute 2D IoU between two boxes [x1, y1, x2, y2]."""
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    intersection = max(0, x2 - x1) * max(0, y2 - y1)

    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])

    union = area1 + area2 - intersection

    return intersection / union if union > 0 else 0


def astar(grid, start, goal):
    """A* path planning on a grid."""
    from heapq import heappush, heappop

    rows, cols = grid.shape
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}

    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    while open_set:
        _, current = heappop(open_set)

        if current == goal:
            # Reconstruct path
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return path[::-1]

        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            neighbor = (current[0] + dx, current[1] + dy)

            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols:
                if grid[neighbor] == 1:  # Obstacle
                    continue

                tentative_g = g_score[current] + 1

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f = tentative_g + heuristic(neighbor, goal)
                    heappush(open_set, (f, neighbor))

    return None  # No path found
```

## Summary

This capstone chapter integrates linear algebra concepts into the autonomous systems pipeline:

**Sensing:**

- LIDAR provides 3D point clouds for accurate range data
- Camera calibration ensures accurate projection between 3D and 2D
- Multiple sensors provide complementary information

**State Estimation:**

- State and measurement vectors represent system and observations
- Kalman filter optimally fuses predictions with measurements
- Extended Kalman filter handles nonlinear dynamics
- Sensor fusion combines multiple sources for robust estimation

**Localization and Mapping:**

- SLAM jointly estimates robot pose and environment map
- Graph-based SLAM scales to large environments
- Loop closure corrects accumulated drift

**Perception:**

- Object detection identifies road users
- Bounding boxes represent object extent in 2D and 3D
- Multi-object tracking maintains consistent identities

**Planning:**

- Path planning finds collision-free routes
- Motion planning respects vehicle dynamics
- Trajectory optimization balances multiple objectives

## Self-Check Questions

??? question "Why does the Kalman filter covariance grow during prediction and shrink during update?"
    During prediction, we're uncertain about the process—random accelerations, unmodeled dynamics—so uncertainty increases. The process noise covariance $\mathbf{Q}$ is added to $\mathbf{P}$. During update, we receive new information from sensors, which reduces uncertainty. The more accurate the measurement (smaller $\mathbf{R}$), the more the covariance shrinks. The Kalman gain determines how much to trust the measurement versus the prediction.

??? question "What problem does SLAM solve that pure localization or pure mapping cannot?"
    Pure localization requires a pre-existing map, which isn't available in new environments. Pure mapping requires known robot poses, which requires localization. SLAM solves this by jointly estimating both, using the observation that landmarks constrain the robot pose and vice versa. As the robot revisits places (loop closure), the joint estimation corrects accumulated drift in both the trajectory and the map.

??? question "Why is sensor fusion more than just averaging sensor measurements?"
    Sensor fusion must account for: (1) different sensors measuring different things (GPS measures position, IMU measures acceleration), (2) different noise characteristics (GPS is noisy but absolute, IMU is precise but drifts), (3) different update rates (IMU at 400Hz, GPS at 10Hz), and (4) correlations between measurements. The Kalman filter optimally weights each measurement based on its uncertainty and what it measures, propagates state between measurements, and maintains consistent uncertainty estimates.

??? question "How does trajectory optimization differ from path planning?"
    Path planning finds a geometric path (sequence of positions) that avoids obstacles. Trajectory optimization adds: (1) time parameterization (when to be where), (2) velocity and acceleration profiles, (3) dynamic feasibility (can the vehicle actually follow this?), and (4) smoothness and comfort objectives. A path might be geometrically valid but require infinite acceleration at corners. Trajectory optimization produces paths that are both collision-free and physically achievable.
