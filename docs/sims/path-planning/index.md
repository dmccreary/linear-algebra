---
title: Path Planning Visualizer
description: Interactive comparison of path planning algorithms including A*, Dijkstra, and RRT
image: /sims/path-planning/path-planning.png
quality_score: 90
---

# Path Planning Visualizer

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Path Planning Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Path Planning Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization compares **path planning algorithms** used in robotics and autonomous systems to find collision-free paths from start to goal through obstacle-filled environments.

## Embedding

You can embed this MicroSim in your website using:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/path-planning/main.html"
        height="702px" width="100%" scrolling="no"></iframe>
```

## Features

- **Multiple Algorithms**: Compare A*, Dijkstra, and RRT
- **Custom Obstacles**: Draw obstacles by dragging
- **Exploration Visualization**: See which cells/nodes are explored
- **Performance Metrics**: Path length and computation time
- **Interactive Start/Goal**: Click to reposition

## Algorithms Compared

### A* Algorithm

$$f(n) = g(n) + h(n)$$

- **g(n)**: Cost from start to node n
- **h(n)**: Heuristic estimate to goal
- **Optimal**: Yes (with admissible heuristic)
- **Complete**: Yes

### Dijkstra's Algorithm

- Same as A* but with h(n) = 0 (no heuristic)
- Explores more cells but guarantees optimality
- Good for multiple goals or when heuristic is hard to define

### RRT (Rapidly-exploring Random Trees)

- Sampling-based, builds random tree toward goal
- Works well in high-dimensional spaces
- Probabilistically complete but not optimal
- RRT* variant achieves asymptotic optimality

## Key Observations

| Algorithm | Explored Cells | Path Quality | Speed |
|-----------|---------------|--------------|-------|
| A* | Fewer (focused) | Optimal | Fast |
| Dijkstra | More (uniform) | Optimal | Slower |
| RRT | Variable | Suboptimal | Varies |

## Lesson Plan

### Learning Objectives
- Compare search-based vs sampling-based planning
- Evaluate algorithm tradeoffs (optimality, completeness, speed)
- Apply appropriate algorithm for different scenarios

### Activities
1. **A* vs Dijkstra**: Run both on same environment, compare explored cells
2. **RRT Randomness**: Run RRT multiple times, observe different paths
3. **Dense Obstacles**: Add many obstacles, see which algorithm struggles
4. **Narrow Passages**: Create a maze, test RRT vs A*

### Assessment Questions
1. Why does A* explore fewer cells than Dijkstra?
2. When might RRT be preferred over A*?
3. What makes a heuristic "admissible"?

## References

- [A* Algorithm Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [RRT Paper (LaValle, 1998)](http://msl.cs.illinois.edu/~lavalle/papers/Lav98c.pdf)
- Chapter 15: Autonomous Systems and Sensor Fusion
