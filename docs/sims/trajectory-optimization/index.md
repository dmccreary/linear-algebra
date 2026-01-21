---
title: Trajectory Optimization Visualizer
description: Interactive trajectory optimization with smoothness, velocity, and obstacle constraints
image: /sims/trajectory-optimization/trajectory-optimization.png
quality_score: 90
---

# Trajectory Optimization Visualizer

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Trajectory Optimization Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Trajectory Optimization Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **trajectory optimization** - finding smooth, safe paths that respect velocity limits and obstacle constraints. Unlike path planning, trajectory optimization produces dynamically feasible motions with time profiles.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/trajectory-optimization/main.html"
        height="702px" width="100%" scrolling="no"></iframe>
```

## Features

- **Draggable Waypoints**: Define initial path by moving waypoints
- **Gradient-Based Optimization**: Watch cost decrease as path improves
- **Velocity Coloring**: Green=slow, Red=fast along the path
- **Velocity/Acceleration Profiles**: See dynamics constraints
- **Obstacle Clearance**: Configurable safety margin around obstacles
- **Cost Convergence Plot**: Visualize optimization progress

## Key Concepts

### Trajectory Cost Function

The optimization minimizes:

$$J = \underbrace{w_1 \sum_i \|\ddot{\mathbf{x}}_i\|^2}_{\text{smoothness}} + \underbrace{w_2 \sum_i c_{obs}(\mathbf{x}_i)}_{\text{obstacle}} + \underbrace{w_3 \sum_i [\|v_i\| - v_{max}]_+^2}_{\text{velocity}}$$

Where:
- **Smoothness term**: Penalizes curvature/acceleration
- **Obstacle term**: Penalizes proximity to obstacles
- **Velocity term**: Penalizes exceeding speed limit

### Gradient Descent

The optimizer iteratively adjusts each path point in the direction that reduces total cost:

$$\mathbf{x}_i^{new} = \mathbf{x}_i^{old} - \alpha \nabla_{\mathbf{x}_i} J$$

### Tradeoffs

| Parameter | Low Value | High Value |
|-----------|-----------|------------|
| Smoothness | Sharp turns | Gentle curves |
| Speed Limit | Slow, safe | Fast, aggressive |
| Clearance | Close to obstacles | Wide margin |

## Lesson Plan

### Learning Objectives
- Understand multi-objective trajectory optimization
- Recognize tradeoffs between smoothness, speed, and safety
- Apply gradient descent to motion planning problems

### Activities
1. **Smooth vs Short**: Increase smoothness weight, observe longer but smoother paths
2. **Speed Constraint**: Lower speed limit, see velocity profile flatten
3. **Tight Passages**: Move waypoints through narrow gaps, adjust clearance
4. **Before/After**: Compare initial waypoint path vs optimized trajectory

### Assessment Questions
1. Why might a longer path have lower total cost?
2. How does the obstacle cost term create a "force field" effect?
3. What happens if smoothness weight is zero?

## References

- [CHOMP: Covariant Hamiltonian Optimization for Motion Planning](https://www.ri.cmu.edu/pub_files/2013/5/CHOMP_pedestrian.pdf)
- [TrajOpt: Trajectory Optimization](https://rll.berkeley.edu/trajopt/)
- Chapter 15: Autonomous Systems and Sensor Fusion
