# Chapter 14 MicroSims Session Log

**Date:** 2026-01-21
**Chapter:** 14 - 3D Geometry and Transformations
**Task:** Generate MicroSims for all diagram specifications in Chapter 14

## Summary

Successfully created 9 interactive MicroSims for Chapter 14, covering 3D geometry fundamentals from coordinate systems through rotations, transforms, camera models, stereo vision, and point clouds.

## MicroSims Created

### 1. 3D Coordinate System Visualizer
- **Location:** `docs/sims/coordinate-system-3d/`
- **Purpose:** Demonstrate different 3D coordinate system conventions and handedness
- **Features:**
  - Toggle right-hand vs left-hand systems
  - Presets for OpenGL, DirectX, ROS, Camera conventions
  - 3D axis visualization with color coding
  - Animated right-hand rule demonstration
  - Sample point with coordinate display
- **Height:** 582px

### 2. Euler Angles Visualizer
- **Location:** `docs/sims/euler-angles-visualizer/`
- **Purpose:** Show how Euler angles (yaw, pitch, roll) compose to form rotations
- **Features:**
  - Independent sliders for yaw, pitch, roll
  - Multiple conventions (ZYX, XYZ, ZXZ)
  - Animated rotation sequence
  - Gimbal lock warning indicator
  - Live rotation matrix display
- **Height:** 602px

### 3. Gimbal Lock Demonstration
- **Location:** `docs/sims/gimbal-lock-demo/`
- **Purpose:** Visualize gimbal lock using a physical gimbal mechanism
- **Features:**
  - Three nested gimbal rings (outer/middle/inner)
  - Color-coded rotation axes
  - "Go to Gimbal Lock" button
  - Degrees of freedom indicator
  - Visual warning when axes align
- **Height:** 592px

### 4. Quaternion Rotation Visualizer
- **Location:** `docs/sims/quaternion-rotation/`
- **Purpose:** Demonstrate quaternion representation and rotation operations
- **Features:**
  - Axis-angle input for quaternion creation
  - Apply and compose rotations
  - Quaternion components display
  - Equivalent Euler angles toggle
  - Unit sphere visualization
- **Height:** 602px

### 5. Rigid Body Transform Chain
- **Location:** `docs/sims/rigid-body-transform/`
- **Purpose:** Visualize SE(3) transform composition in a robot arm
- **Features:**
  - 3-joint kinematic chain
  - Joint angle sliders
  - Coordinate frame visualization
  - End effector position tracking
  - Transform matrix display
- **Height:** 652px

### 6. Camera Model Visualizer
- **Location:** `docs/sims/camera-model-visualizer/`
- **Purpose:** Demonstrate pinhole camera model and projection
- **Features:**
  - Focal length control (affects FOV)
  - Principal point adjustment
  - Camera frustum visualization
  - Projection ray display
  - 3D-to-2D projection demonstration
- **Height:** 652px

### 7. Epipolar Geometry Visualizer
- **Location:** `docs/sims/epipolar-geometry/`
- **Purpose:** Show epipolar constraints in stereo vision
- **Features:**
  - Stereo camera pair
  - Epipolar plane visualization
  - Epipolar lines on both images
  - Disparity and depth relationship
  - Baseline control
- **Height:** 682px

### 8. Triangulation Visualizer
- **Location:** `docs/sims/triangulation-visualizer/`
- **Purpose:** Demonstrate 3D reconstruction from stereo correspondences
- **Features:**
  - Projection rays from both cameras
  - True vs triangulated point comparison
  - Noise injection for error demonstration
  - Baseline effect on accuracy
  - 3D error metric display
- **Height:** 632px

### 9. Point Cloud Visualizer
- **Location:** `docs/sims/point-cloud-visualizer/`
- **Purpose:** Explore point cloud data and processing operations
- **Features:**
  - Multiple datasets (terrain, building, sphere, random)
  - Color modes (height, intensity, normal, RGB)
  - Voxel grid downsampling
  - Surface normal visualization
  - Bounding box display
- **Height:** 652px

## Files Modified

### Chapter Content
- `docs/chapters/14-3d-geometry-and-transformations/index.md`
  - Added 9 iframe embeds after each `#### Diagram:` header
  - Added fullscreen buttons for each MicroSim

### Navigation
- `mkdocs.yml`
  - Added 9 new entries to MicroSims navigation section (alphabetically sorted):
    - Camera Model Visualizer
    - Coordinate System 3D
    - Epipolar Geometry Visualizer
    - Euler Angles Visualizer
    - Gimbal Lock Demo
    - Point Cloud Visualizer
    - Quaternion Rotation Visualizer
    - Rigid Body Transform Chain
    - Triangulation Visualizer

## Technical Notes

- All MicroSims use p5.js (version 1.11.10) with WEBGL mode for 3D rendering
- Font loading required for WEBGL text rendering (SourceSansPro via CDN)
- All MicroSims are width-responsive using `updateCanvasSize()` pattern
- Standard template pattern: `main.html`, `[name].js`, `index.md`, `metadata.json`
- Controls parented to container for proper iframe positioning
- Mouse drag for 3D view rotation, scroll for zoom (on some MicroSims)

## Learning Objectives Covered

| MicroSim | Bloom's Level | Key Concept |
|----------|---------------|-------------|
| Coordinate System 3D | Understand | Handedness, conventions |
| Euler Angles Visualizer | Apply | Rotation composition |
| Gimbal Lock Demo | Analyze | Singularity, DOF loss |
| Quaternion Rotation | Apply | Quaternion operations |
| Rigid Body Transform | Apply | SE(3), kinematics |
| Camera Model | Analyze | Projection, intrinsics |
| Epipolar Geometry | Analyze | Stereo constraints |
| Triangulation | Apply | 3D reconstruction |
| Point Cloud | Understand | 3D data representation |

## Testing

MicroSims can be tested by:
1. Running `mkdocs serve` from the repository root
2. Navigating to `http://127.0.0.1:8000/linear-algebra/chapters/14-3d-geometry-and-transformations/`
3. Or directly to individual MicroSims via the navigation

## Next Steps

- Add screenshots for social media previews (`.png` files)
- Upload to p5.js editor for easy teacher editing
- Consider adding ICP registration demo for point cloud registration
- Add camera calibration demonstration
