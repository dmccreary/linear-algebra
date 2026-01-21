---
title: Point Cloud Visualizer
description: Interactive exploration of point cloud data and common processing operations
image: /sims/point-cloud-visualizer/point-cloud-visualizer.png
quality_score: 88
---
# Point Cloud Visualizer

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Point Cloud Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Point Cloud Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates point cloud representation and processing. Explore different datasets, color modes, downsampling, and surface normal visualization.

## How to Use

1. **Select Dataset**: Choose terrain, building, sphere, or random point clouds
2. **Color Mode**: Visualize by height, intensity, normal direction, or RGB
3. **Point Size**: Adjust visualization size
4. **Downsample**: Apply voxel grid downsampling
5. **Show Normals**: Display surface normal vectors
6. **Drag to Rotate**: Change the 3D view angle
7. **Scroll to Zoom**: Adjust scale

## Key Concepts

| Attribute | Type | Description |
|-----------|------|-------------|
| Position | (x, y, z) | 3D coordinates |
| Color | (r, g, b) | RGB values |
| Normal | (nx, ny, nz) | Surface orientation |
| Intensity | scalar | Reflection strength |

**Voxel Grid Downsampling**:
Divides space into voxels (3D cells) and replaces points within each voxel with their centroid.

## Learning Objectives

Students will be able to:
- Understand point cloud data representation
- Apply voxel grid downsampling
- Interpret surface normals
- Visualize 3D spatial data

## Lesson Plan

### Introduction (5 minutes)
Point clouds are the raw output of 3D sensors like lidar and depth cameras. Each point has coordinates and optional attributes.

### Exploration (15 minutes)
1. Load the terrain dataset - notice how height varies
2. Switch color mode to see different attributes
3. Increase downsampling - observe point reduction
4. Enable normals - see surface orientation
5. Compare building (structured) vs random (unstructured)

### Key Insight
Point clouds can represent any 3D surface but require processing (normal estimation, segmentation, registration) for analysis.

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [Point Cloud Library (PCL)](https://pointclouds.org/)
