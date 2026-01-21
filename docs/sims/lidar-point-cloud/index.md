---
title: LIDAR Point Cloud Visualizer
description: Interactive 3D visualization of LIDAR point cloud data with ground segmentation and object clustering
image: /sims/lidar-point-cloud/lidar-point-cloud.png
quality_score: 85
---

# LIDAR Point Cloud Visualizer

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the LIDAR Point Cloud Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the LIDAR Point Cloud Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates how **LIDAR (Light Detection and Ranging)** sensors capture 3D point cloud data for autonomous vehicles and robotics. LIDAR systems emit laser pulses and measure the time for reflections to return, creating a sparse but accurate 3D representation of the environment.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/lidar-point-cloud/main.html"
        height="652px" width="100%" scrolling="no"></iframe>
```

## Features

- **3D Point Cloud Rendering**: Visualize thousands of LIDAR points in an interactive 3D view
- **Ground Segmentation**: Toggle ground points (brown) vs object points
- **Object Clustering**: See how points are grouped into discrete objects with bounding boxes
- **Distance Rings**: Reference circles at 10m, 25m, and 50m from the ego vehicle
- **Color Modes**: View points colored by intensity, height, distance, or cluster assignment
- **Interactive Controls**: Drag to rotate, scroll to zoom

## Key Concepts

### LIDAR Data Structure
Each LIDAR point contains:
- **(x, y, z)**: 3D position in the sensor frame
- **Intensity**: Reflection strength (0-255)
- **Cluster ID**: Assignment to detected object (-1 for ground, -2 for noise)

### Ground Segmentation
The simulation shows how points are classified as ground (low z-values) versus obstacles. Real systems use algorithms like RANSAC plane fitting or grid-based methods.

### Object Clustering
Nearby points are grouped into clusters representing vehicles, pedestrians, or other obstacles. Each cluster has a bounding box showing its spatial extent.

## Lesson Plan

### Learning Objectives
- Understand the structure of LIDAR point cloud data
- Recognize how ground segmentation separates drivable surface from obstacles
- Visualize how clustering algorithms group points into objects

### Activities
1. **Explore Point Density**: Observe how point density decreases with distance
2. **Compare Color Modes**: Switch between intensity, height, and distance coloring to see different data properties
3. **Identify Clusters**: Count the number of detected objects and estimate their sizes from bounding boxes
4. **Ground vs Objects**: Toggle ground points to understand the two-class segmentation problem

### Assessment Questions
1. Why does LIDAR point density decrease with distance from the sensor?
2. What information does point intensity provide about the detected surface?
3. How do autonomous vehicles use clustered point clouds for navigation?

## References

- [Velodyne LIDAR Documentation](https://velodynelidar.com/)
- [PCL (Point Cloud Library)](https://pointclouds.org/)
- Chapter 15: Autonomous Systems and Sensor Fusion
