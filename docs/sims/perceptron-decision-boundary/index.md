---
title: Perceptron Decision Boundary
description: Interactive visualization showing how perceptron weights and bias define a linear decision boundary for binary classification.
image: /sims/perceptron-decision-boundary/perceptron-decision-boundary.png
og:image: /sims/perceptron-decision-boundary/perceptron-decision-boundary.png
twitter:image: /sims/perceptron-decision-boundary/perceptron-decision-boundary.png
social:
   cards: false
---
# Perceptron Decision Boundary

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Perceptron Decision Boundary Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization demonstrates how a perceptron—the simplest neural network—creates a linear decision boundary to classify data points into two classes.

### Key Concepts

- **Decision Boundary**: The line where $\mathbf{w}^T\mathbf{x} + b = 0$
- **Weight Vector**: Perpendicular to the decision boundary, determines its orientation
- **Bias**: Shifts the boundary away from the origin
- **Linear Separability**: Some datasets (like XOR) cannot be separated by a single line

### Interactive Features

1. **Drag the Weight Vector**: Click and drag the purple arrow to rotate the decision boundary
2. **Adjust Bias**: Use the slider to shift the boundary parallel to itself
3. **Add Custom Points**: Click "Add Points" then click on the plot to add data points
4. **Switch Classes**: Press SPACE while in add-point mode to toggle between blue (+1) and red (-1)
5. **Run Learning**: Watch the perceptron learning algorithm find a solution
6. **Preset Datasets**: Compare linearly separable data with the XOR pattern

### Visual Indicators

- **Blue region**: Points classified as +1
- **Red region**: Points classified as -1
- **Yellow outline**: Misclassified points
- **Accuracy**: Shown as percentage in the control area

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Explain how weight vectors and bias define a linear decision boundary
2. Identify whether a dataset is linearly separable
3. Describe the perceptron learning algorithm
4. Recognize why the XOR problem motivated multilayer networks

### Suggested Activities

1. **Explore Linear Separability**: Load different datasets and observe which can achieve 100% accuracy
2. **Manual Classification**: Try to manually position the boundary to classify all points correctly
3. **XOR Challenge**: Attempt to classify XOR data and discover why it fails
4. **Learning Animation**: Run the learning algorithm and observe how weights update

### Discussion Questions

1. Why does the weight vector always point perpendicular to the decision boundary?
2. What happens when you increase the bias? What about when you make it negative?
3. Why can't a single perceptron solve the XOR problem?
4. How could you modify the network to handle non-linear boundaries?

## References

- Rosenblatt, F. (1958). The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain
- Minsky & Papert (1969). Perceptrons: An Introduction to Computational Geometry
