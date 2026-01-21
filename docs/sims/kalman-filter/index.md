---
title: Kalman Filter Visualizer
description: Interactive visualization of the Kalman filter showing prediction, measurement, and state estimation
image: /sims/kalman-filter/kalman-filter.png
quality_score: 90
---

# Kalman Filter Visualizer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Kalman Filter Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Kalman Filter Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates the **Kalman Filter**, the optimal linear estimator for systems with Gaussian noise. The Kalman filter recursively estimates the true state of a dynamic system by combining noisy measurements with a prediction model.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/kalman-filter/main.html"
        height="602px" width="100%" scrolling="no"></iframe>
```

## Features

- **State Estimation**: Green point shows the Kalman filter's best estimate
- **Uncertainty Ellipse**: Green ellipse represents 2-sigma uncertainty bounds
- **Measurements**: Red markers show noisy position measurements
- **Innovation Vector**: Orange dashed line shows measurement-prediction difference
- **Velocity Arrow**: Green arrow shows estimated velocity direction
- **Motion Models**: Choose between constant velocity, constant acceleration, or random walk

## Key Concepts

### The Kalman Filter Equations

**Prediction Step:**
$$\hat{\mathbf{x}}_k^- = \mathbf{F}\hat{\mathbf{x}}_{k-1}$$
$$\mathbf{P}_k^- = \mathbf{F}\mathbf{P}_{k-1}\mathbf{F}^\top + \mathbf{Q}$$

**Update Step:**
$$\mathbf{K}_k = \mathbf{P}_k^- \mathbf{H}^\top (\mathbf{H}\mathbf{P}_k^-\mathbf{H}^\top + \mathbf{R})^{-1}$$
$$\hat{\mathbf{x}}_k = \hat{\mathbf{x}}_k^- + \mathbf{K}_k(\mathbf{z}_k - \mathbf{H}\hat{\mathbf{x}}_k^-)$$
$$\mathbf{P}_k = (\mathbf{I} - \mathbf{K}_k\mathbf{H})\mathbf{P}_k^-$$

### Noise Parameters

- **Process Noise Q**: How much random acceleration affects the true motion
- **Measurement Noise R**: How noisy the position measurements are

### What to Observe

- **Low R, High Q**: Trust measurements more → estimate follows measurements closely
- **High R, Low Q**: Trust predictions more → estimate is smoother
- **Uncertainty ellipse**: Grows during prediction, shrinks after measurement update

## Lesson Plan

### Learning Objectives
- Understand the predict-update cycle of the Kalman filter
- Recognize how noise parameters affect estimation quality
- Visualize uncertainty propagation through covariance

### Activities
1. **Single Step**: Click "Step" repeatedly to see predict-update cycle
2. **Noise Tradeoff**: Increase R (measurement noise) and observe smoother but lagged estimates
3. **Motion Models**: Switch between constant velocity and random walk to see how the model affects predictions
4. **Reveal Truth**: Toggle "Show True Position" to see actual estimation error

### Assessment Questions
1. Why does the uncertainty ellipse grow during prediction and shrink during update?
2. What happens to the Kalman gain when measurement noise is very high?
3. How does the motion model assumption affect filter performance?

## References

- [Kalman Filter Wikipedia](https://en.wikipedia.org/wiki/Kalman_filter)
- [Understanding the Kalman Filter](https://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/)
- Chapter 15: Autonomous Systems and Sensor Fusion
