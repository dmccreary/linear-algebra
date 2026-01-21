---
title: 3D Coordinate System Visualizer
description: Interactive demonstration of different 3D coordinate system conventions and handedness
image: /sims/coordinate-system-3d/coordinate-system-3d.png
quality_score: 85
---
# 3D Coordinate System Visualizer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the 3D Coordinate System Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the 3D Coordinate System Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates different 3D coordinate system conventions used across computer graphics, robotics, and computer vision. Explore how handedness affects axis orientation and learn the standard conventions used by different platforms.

## How to Use

1. **Select Handedness**: Toggle between right-hand and left-hand coordinate systems
2. **Choose Convention**: Select from OpenGL/Math, DirectX/Unity, ROS/Robotics, or Camera conventions
3. **Drag to Rotate**: Click and drag in the 3D view to rotate the visualization
4. **Toggle Grid**: Show or hide the grid planes
5. **Animate**: Watch the right-hand rule demonstration

## Key Concepts

| Convention | X | Y | Z | Used By |
|------------|---|---|---|---------|
| OpenGL/Math | Right | Up | Out (toward viewer) | OpenGL, most mathematics |
| DirectX/Unity | Right | Up | Into screen | DirectX, Unity game engine |
| ROS/Robotics | Forward | Left | Up | Robot Operating System |
| Camera | Right | Down | Forward | Computer vision cameras |

## Learning Objectives

Students will be able to:
- Distinguish between right-hand and left-hand coordinate systems
- Identify the axis conventions used by major platforms
- Apply the right-hand rule to determine axis orientations
- Convert coordinates between different conventions

## Lesson Plan

### Introduction (5 minutes)
Discuss why coordinate system conventions matter in 3D applications and the chaos that can result from mixing conventions.

### Exploration (10 minutes)
1. Start with the right-hand OpenGL convention
2. Use the right-hand rule: curl fingers from X to Y, thumb points to Z
3. Switch to left-hand and observe how Z flips
4. Compare different platform conventions

### Discussion Questions
- Why might different industries have chosen different conventions?
- What happens if you mix coordinate systems in a pipeline?
- How would you convert a point from ROS to camera coordinates?

## References

- [Chapter 14: 3D Geometry and Transformations](../../chapters/14-3d-geometry-and-transformations/index.md)
- [OpenGL Coordinate Systems](https://learnopengl.com/Getting-started/Coordinate-Systems)
