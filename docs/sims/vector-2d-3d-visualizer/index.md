---
title: 2D and 3D Vector Visualization
description: Interactive visualization of vectors in 2D and 3D coordinate systems with adjustable components, projection lines, and component labels.
image: /sims/vector-2d-3d-visualizer/vector-2d-3d-visualizer.png
og:image: /sims/vector-2d-3d-visualizer/vector-2d-3d-visualizer.png
twitter:image: /sims/vector-2d-3d-visualizer/vector-2d-3d-visualizer.png
quality_score: 85
social:
   cards: false
---

# 2D and 3D Vector Visualization

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the 2D and 3D Vector Visualization Fullscreen](./main.html){ .md-button .md-button--primary }

You can embed this MicroSim in your own webpage using the following iframe code:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/vector-2d-3d-visualizer/main.html"
        height="562px"
        width="100%"
        scrolling="no">
</iframe>
```
## About This MicroSim

This interactive visualization helps students understand how vector components determine position and direction in both 2D and 3D coordinate systems. Students can manipulate the x, y, and z components using sliders and observe how the vector changes in real-time.

**Learning Objective:** Students will interpret vectors geometrically by visualizing how component values determine position and direction in 2D and 3D coordinate systems.

## How to Use

1. **Adjust Components**: Use the X, Y, and Z sliders to change the vector components (range: -5 to 5)
2. **Switch Views**: Click "Switch to 3D" to toggle between 2D and 3D visualization modes
3. **Toggle Projections**: Enable/disable dashed projection lines that show how the vector projects onto each axis
4. **Toggle Labels**: Show or hide component labels and axis labels
5. **Rotate 3D View**: In 3D mode, click and drag on the canvas to rotate the view

## Key Concepts Demonstrated

- **Vector Components**: How x, y (and z in 3D) values determine the vector endpoint
- **Vector Magnitude**: The length of the vector, calculated as $\|v\| = \sqrt{x^2 + y^2}$ in 2D or $\|v\| = \sqrt{x^2 + y^2 + z^2}$ in 3D
- **Coordinate Axes**: The standard basis vectors along x, y, and z directions
- **Projection**: How a vector projects onto coordinate planes and axes

## Lesson Plan

### Grade Level
Undergraduate introductory linear algebra or advanced high school mathematics

### Duration
15-20 minutes

### Prerequisites
- Understanding of Cartesian coordinate systems
- Basic knowledge of what vectors represent (magnitude and direction)

### Learning Activities

1. **Exploration (5 min)**: Have students explore the 2D view first, adjusting x and y sliders to see how vectors change
2. **Pattern Recognition (5 min)**: Ask students to find vectors with the same magnitude but different directions
3. **3D Extension (5 min)**: Switch to 3D view and explore how the z-component adds a third dimension
4. **Projection Analysis (5 min)**: Enable projections and discuss how vectors decompose into components

### Discussion Questions

1. What happens to the magnitude when you double all components?
2. Can two different vectors have the same magnitude? Give examples.
3. How do the projection lines help you understand vector components?
4. What is the geometric interpretation when x=0 or y=0?

### Assessment Ideas

- Ask students to create a vector with a specific magnitude
- Have students predict the direction before adjusting sliders
- Quiz on calculating magnitudes from given components

## References

1. [3Blue1Brown - Vectors, what even are they?](https://www.youtube.com/watch?v=fNk_zzaMoSs) - Excellent visual introduction to vectors
2. [Khan Academy - Introduction to Vectors](https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/vectors/v/vector-introduction-linear-algebra)
3. Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Wellesley-Cambridge Press.
