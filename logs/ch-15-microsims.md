# Chapter 15 MicroSims Generation Log

**Date:** 2026-01-21
**Model:** Claude Opus 4.5

## Summary

Generated 8 interactive MicroSimulations for Chapter 15: Autonomous Systems and Sensor Fusion. All MicroSims use p5.js and follow the standard MicroSim architecture.

## MicroSims Created

### 1. LIDAR Point Cloud Visualizer
- **Location:** `docs/sims/lidar-point-cloud/`
- **Purpose:** Visualize LIDAR data structure with 3D point cloud rendering
- **Features:** Ground segmentation, object clustering, distance rings, color modes (intensity, height, distance, cluster)
- **Bloom Level:** Understand

### 2. Camera Calibration Visualizer
- **Location:** `docs/sims/camera-calibration/`
- **Purpose:** Demonstrate camera calibration and lens distortion correction
- **Features:** Barrel/pincushion distortion, checkerboard corner detection, reprojection error visualization
- **Bloom Level:** Apply

### 3. Kalman Filter Visualizer
- **Location:** `docs/sims/kalman-filter/`
- **Purpose:** Show predict-update cycle of Kalman filter for state estimation
- **Features:** Uncertainty ellipse, innovation vector, multiple motion models, noise parameter tuning
- **Bloom Level:** Apply

### 4. Sensor Fusion Visualizer
- **Location:** `docs/sims/sensor-fusion/`
- **Purpose:** Demonstrate GPS/IMU sensor fusion benefits
- **Features:** GPS (noisy but absolute) vs IMU (smooth but drifting) vs fused estimate, RMSE comparison
- **Bloom Level:** Analyze

### 5. SLAM Visualizer
- **Location:** `docs/sims/slam-visualizer/`
- **Purpose:** Illustrate Simultaneous Localization and Mapping problem
- **Features:** Robot trajectory, landmark mapping, loop closure detection, graph optimization
- **Bloom Level:** Analyze

### 6. Object Tracking Visualizer
- **Location:** `docs/sims/object-tracking/`
- **Purpose:** Show multi-object tracking with prediction and data association
- **Features:** Track IDs, prediction boxes, detection boxes, association lines, track trails
- **Bloom Level:** Apply

### 7. Path Planning Visualizer
- **Location:** `docs/sims/path-planning/`
- **Purpose:** Compare path planning algorithms (A*, Dijkstra, RRT)
- **Features:** Custom obstacles, exploration visualization, performance metrics
- **Bloom Level:** Evaluate

### 8. Trajectory Optimization Visualizer
- **Location:** `docs/sims/trajectory-optimization/`
- **Purpose:** Demonstrate trajectory optimization with constraints
- **Features:** Draggable waypoints, smoothness/velocity/obstacle cost, gradient descent optimization
- **Bloom Level:** Apply

## Files Modified

### Chapter Content
- `docs/chapters/15-autonomous-systems-and-sensor-fusion/index.md`
  - Added 8 iframe embeds after each `#### Diagram:` header
  - Added fullscreen links for each MicroSim

### Navigation
- `mkdocs.yml`
  - Added all 8 MicroSims to the MicroSims navigation section in alphabetical order

## MicroSim File Structure

Each MicroSim follows the standard structure:
```
docs/sims/<microsim-name>/
├── index.md           # Documentation with iframe embed
├── main.html          # HTML wrapper
├── <microsim-name>.js # p5.js JavaScript code
└── metadata.json      # Dublin Core metadata
```

## Testing Notes

All MicroSims should be tested by:
1. Running `mkdocs serve` and navigating to Chapter 15
2. Verifying each iframe loads and is interactive
3. Testing fullscreen links
4. Checking responsive behavior at different widths

## Key Concepts Covered

The MicroSims collectively cover these Chapter 15 concepts:
- LIDAR Point Cloud
- Camera Calibration
- Sensor Fusion
- Kalman Filter (Prediction/Update Steps, Kalman Gain)
- Extended Kalman Filter
- State Estimation
- SLAM (Localization, Mapping)
- Object Detection/Tracking, Bounding Boxes
- Path Planning, Motion Planning
- Trajectory Optimization

## Technical Notes

- All MicroSims use p5.js v1.11.10 from CDN
- Canvas sizes vary based on content complexity (600-700px height)
- Control regions use standard 100px height for consistency
- All are width-responsive and work in iframe embeds
