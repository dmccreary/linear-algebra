---
title: Object Tracking Visualizer
description: Interactive multi-object tracking demonstration showing prediction, detection, and data association
image: /sims/object-tracking/object-tracking.png
quality_score: 90
---

# Object Tracking Visualizer

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Object Tracking Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Object Tracking Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates **multi-object tracking (MOT)** - the problem of maintaining consistent identities for multiple moving objects across frames. This is essential for autonomous vehicles to track pedestrians, vehicles, and cyclists.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/object-tracking/main.html"
        height="652px" width="100%" scrolling="no"></iframe>
```

## Features

- **Multiple Objects**: Colored bounding boxes with unique track IDs
- **Predictions**: Dashed boxes show where tracks are expected to appear
- **Detections**: Red boxes show noisy sensor measurements
- **Associations**: Yellow lines connect predictions to matched detections
- **Track Trails**: Historical positions showing object paths
- **Track Management**: New tracks created, lost tracks deleted

## Key Concepts

### The Tracking Pipeline

1. **Prediction**: Use motion model to predict where each track will be
2. **Detection**: Generate (noisy) measurements of objects
3. **Association**: Match predictions to detections
4. **Update**: Refine track states with matched detections
5. **Track Management**: Create new tracks, delete lost tracks

### Data Association

The key challenge is matching detections to tracks:
- **Gating**: Only consider detections within a distance threshold
- **Cost Matrix**: Compute distance between all prediction-detection pairs
- **Hungarian Algorithm**: Find optimal one-to-one assignment

### Association Metrics

| Metric | Description |
|--------|-------------|
| **IoU** | Intersection over Union of bounding boxes |
| **Mahalanobis** | Distance accounting for uncertainty |
| **Euclidean** | Simple distance between centers |

## Lesson Plan

### Learning Objectives
- Understand the multi-object tracking pipeline
- Recognize the role of prediction in data association
- Apply tracking concepts to handle missed detections

### Activities
1. **Step Through**: Click "Step" to see each predict-associate-update cycle
2. **High Noise**: Increase detection noise, observe association errors
3. **High Miss Rate**: Increase miss probability, see tracks use predictions
4. **Track Creation/Deletion**: Observe new tracks spawn, lost tracks disappear

### Assessment Questions
1. Why do we predict before associating detections?
2. What happens when a detection is missed for several frames?
3. How would you handle objects that cross paths?

## References

- [SORT: Simple Online Realtime Tracking](https://arxiv.org/abs/1602.00763)
- [DeepSORT](https://github.com/nwojke/deep_sort)
- Chapter 15: Autonomous Systems and Sensor Fusion
