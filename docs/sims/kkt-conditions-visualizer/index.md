---
title: KKT Conditions Visualizer
description: Interactive visualization of Karush-Kuhn-Tucker conditions for inequality-constrained optimization
image: /sims/kkt-conditions-visualizer/kkt-conditions-visualizer.png
---

# KKT Conditions Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Visualization Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization demonstrates the **Karush-Kuhn-Tucker (KKT) conditions** for optimization with inequality constraints. The KKT conditions generalize Lagrange multipliers to handle inequality constraints.

### Problem Setup

- **Objective**: Minimize f(x,y) = (x-2)² + (y-2)²
- **Constraints**:
    - g₁: x ≥ 0
    - g₂: y ≥ 0
    - g₃: x + y ≤ 3

### How to Use

1. **Toggle Constraints**: Enable/disable constraints with checkboxes
2. **Click to Place Point**: Click anywhere to set the current point
3. **Solve**: Click to animate to the optimal point
4. **Observe**: Watch which constraints become active (orange)

### Understanding the Display

- **Green Shaded Region**: Feasible set (where all constraints are satisfied)
- **Blue/Orange Lines**: Constraint boundaries (orange = active at optimum)
- **Gray Circles**: Contours of the objective function
- **Green Point**: Optimal solution
- **Blue/Red Point**: Your current point (blue = feasible, red = infeasible)

### The KKT Conditions

For a constrained minimum x*, the KKT conditions state:

1. **Stationarity**: ∇f(x*) + Σμᵢ∇gᵢ(x*) = 0
2. **Primal Feasibility**: gᵢ(x*) ≤ 0 for all i
3. **Dual Feasibility**: μᵢ ≥ 0 for all i
4. **Complementary Slackness**: μᵢgᵢ(x*) = 0 for all i

### Complementary Slackness

The key insight is **complementary slackness**: for each constraint, either:
- The constraint is **inactive** (gᵢ < 0) and its multiplier is zero (μᵢ = 0), OR
- The constraint is **active** (gᵢ = 0) and its multiplier may be positive

Only constraints that the solution "touches" can affect the optimal point.

## Lesson Plan

### Learning Objectives

- Understand KKT conditions for inequality-constrained optimization
- Visualize active vs inactive constraints
- Interpret complementary slackness geometrically

### Suggested Activities

1. **All Constraints**: With all constraints enabled, find the optimal point
2. **Remove Constraints**: Disable constraints one by one and observe how the optimum shifts
3. **Active vs Inactive**: Notice which constraints are orange (active) at the solution
4. **Infeasible Points**: Click outside the feasible region to see infeasibility

## References

- Boyd & Vandenberghe, *Convex Optimization*, Chapter 5
- [Wikipedia: Karush-Kuhn-Tucker Conditions](https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions)
