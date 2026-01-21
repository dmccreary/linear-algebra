---
title: Sensor Fusion Visualizer
description: Interactive demonstration of GPS and IMU sensor fusion showing how combining sensors improves state estimation
image: /sims/sensor-fusion/sensor-fusion.png
quality_score: 90
---

# Sensor Fusion Visualizer

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Sensor Fusion Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Sensor Fusion Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **sensor fusion** - combining data from multiple sensors to achieve better accuracy and robustness than any single sensor alone. It shows GPS (noisy but absolute) and IMU (smooth but drifting) sensors being fused via Kalman filtering.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/sensor-fusion/main.html"
        height="652px" width="100%" scrolling="no"></iframe>
```

## Features

- **True Position**: Blue circle follows a circular path with variations
- **GPS Measurements**: Cyan markers appear periodically (low rate, noisy, absolute)
- **IMU Dead Reckoning**: Orange trail showing integration drift
- **Fused Estimate**: Green trail with uncertainty ellipse (best of both)
- **RMSE Comparison**: Real-time error statistics for each method

## Key Concepts

### Why Fuse Sensors?

| Sensor | Strengths | Weaknesses |
|--------|-----------|------------|
| **GPS** | Absolute position, global | Low rate (~10Hz), poor in tunnels/canyons |
| **IMU** | High rate (~400Hz), works everywhere | Drift accumulates over time |

### The Fusion Principle

Kalman filter fusion exploits complementary characteristics:
- GPS corrects IMU drift with absolute measurements
- IMU fills gaps between GPS updates with smooth predictions
- Result: High-rate, accurate position with bounded error

### Error Growth

- **GPS Only**: Error bounded but noisy (no smooth trajectory)
- **IMU Only**: Error grows unboundedly over time (drift)
- **Fused**: Error bounded AND smooth (best of both worlds)

## Lesson Plan

### Learning Objectives
- Understand why multiple sensors outperform single sensors
- Recognize drift vs noise characteristics
- Analyze fusion improvement quantitatively via RMSE

### Activities
1. **GPS Only**: Disable IMU, observe jumpy but bounded tracking
2. **IMU Only**: Disable GPS, watch trajectory drift away
3. **Fusion Benefit**: Enable both, compare RMSE values
4. **Noise Tradeoffs**: Increase GPS noise, see fusion degrade gracefully

### Assessment Questions
1. Why does IMU-only tracking drift while GPS-only stays bounded?
2. How does the fused estimate achieve lower RMSE than either sensor alone?
3. What happens to fusion quality when GPS updates become less frequent?

## References

- [Sensor Fusion and Tracking (MATLAB)](https://www.mathworks.com/help/fusion/sensor-fusion-and-tracking.html)
- [GPS/IMU Integration](https://www.navipedia.net/index.php/IMU/GNSS_Integration)
- Chapter 15: Autonomous Systems and Sensor Fusion
