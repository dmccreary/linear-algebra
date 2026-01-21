---
title: SLAM Visualizer
description: Interactive visualization of Simultaneous Localization and Mapping showing pose estimation, landmarks, and loop closure
image: /sims/slam-visualizer/slam-visualizer.png
quality_score: 90
---

# SLAM Visualizer

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the SLAM Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the SLAM Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **SLAM (Simultaneous Localization and Mapping)** - the problem of building a map while simultaneously localizing within it. SLAM solves the chicken-and-egg problem: you need a map to localize, but you need to know your location to build a map.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/slam-visualizer/main.html"
        height="702px" width="100%" scrolling="no"></iframe>
```

## Features

- **Robot Trajectory**: Move the robot to build a path (green poses)
- **Landmark Observation**: Detect and track landmarks (blue triangles)
- **Odometry Drift**: Watch accumulated error grow without loop closure
- **Loop Closure**: Detect when you revisit a place (red arc)
- **Graph Optimization**: Correct entire trajectory with loop closure constraints
- **Uncertainty Ellipses**: Visualize growing and shrinking uncertainty

## How to Use

1. **Move Robot**: Click repeatedly to build a trajectory (notice drift accumulates)
2. **Observe Landmarks**: Create landmarks to constrain the map
3. **Complete a Loop**: Keep moving until you return near the start
4. **Loop Closure**: Click when near a previous position to detect revisit
5. **Optimize**: Apply graph optimization to correct the trajectory

## Key Concepts

### The SLAM Problem

SLAM jointly estimates:
- **Localization**: Robot pose over time $\mathbf{x}_R$
- **Mapping**: Landmark positions $\mathbf{m}_1, \mathbf{m}_2, ..., \mathbf{m}_n$

### Drift Accumulation

Without loop closure, odometry errors accumulate:
- Each motion adds noise
- Uncertainty ellipses grow over time
- Map becomes inconsistent

### Loop Closure

When the robot recognizes a previously visited place:
1. Creates a constraint between distant poses
2. Graph optimization distributes the correction
3. Entire trajectory and map improve

## Lesson Plan

### Learning Objectives
- Understand the simultaneous localization and mapping problem
- Recognize how drift accumulates in dead-reckoning
- Analyze how loop closure corrects the entire trajectory

### Activities
1. **Build Without Loop Closure**: Move 10+ times without closing the loop, observe drift
2. **Return to Start**: Navigate back to starting area, perform loop closure
3. **Before/After**: Compare trajectory before and after optimization
4. **Multiple Loops**: Add multiple loop closures to see cumulative improvement

### Assessment Questions
1. Why can't you build an accurate map with pure odometry alone?
2. How does a single loop closure help correct poses far from the closure point?
3. What would happen with very noisy odometry but frequent loop closures?

## References

- [GraphSLAM Tutorial](https://www.ri.cmu.edu/pub_files/pub4/thrun_sebastian_2005_2/thrun_sebastian_2005_2.pdf)
- [ORB-SLAM](https://github.com/raulmur/ORB_SLAM2)
- Chapter 15: Autonomous Systems and Sensor Fusion
