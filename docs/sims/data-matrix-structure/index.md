---
title: Data Matrix Structure Visualizer
description: Interactive visualization showing the structure of data matrices with rows as samples and columns as features, including heat map coloring and click-to-highlight functionality.
image: /sims/data-matrix-structure/data-matrix-structure.png
og:image: /sims/data-matrix-structure/data-matrix-structure.png
twitter:image: /sims/data-matrix-structure/data-matrix-structure.png
quality_score: 85
social:
   cards: false
---

# Data Matrix Structure Visualizer

<iframe src="main.html" height="540px" width="100%" scrolling="no"></iframe>

[Run the Data Matrix Structure Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Data Matrix Structure Visualizer with the p5.js editor](https://editor.p5js.org/)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/data-matrix-structure/main.html" height="520px" scrolling="no"></iframe>
```

## Description

This MicroSim helps students understand the fundamental structure of data matrices used in machine learning and data science. A data matrix organizes observations (samples) in rows and measurements (features) in columns, forming the foundation for most ML algorithms.

**Key Features:**

- **Real Dataset Examples**: Explore Iris (botanical measurements), MNIST (image pixels), and Housing (socioeconomic factors)
- **Heat Map Visualization**: Colors indicate relative values across the matrix
- **Row Highlighting**: Click any row to highlight it as a feature vector representing one sample
- **Column Highlighting**: Click column headers to see how one feature varies across all samples
- **Dimension Annotations**: Clear labels showing n (samples) and d (features)
- **Cell Hover**: View individual values and their context

## Matrix Structure Concepts

### Rows as Samples

Each row in a data matrix represents a single **sample** (also called an observation, instance, or data point). A row contains all feature values for one sample, forming a **feature vector**:

$$\mathbf{x}_i = [x_{i1}, x_{i2}, \ldots, x_{id}]$$

### Columns as Features

Each column represents a single **feature** (also called an attribute, variable, or dimension). A column shows how one measurement varies across all samples.

### Matrix Notation

The full data matrix $\mathbf{X}$ with n samples and d features:

$$\mathbf{X} = \begin{bmatrix} x_{11} & x_{12} & \cdots & x_{1d} \\ x_{21} & x_{22} & \cdots & x_{2d} \\ \vdots & \vdots & \ddots & \vdots \\ x_{n1} & x_{n2} & \cdots & x_{nd} \end{bmatrix} \in \mathbb{R}^{n \times d}$$

## Example Datasets

### Iris Dataset

- **Samples**: 150 flower specimens
- **Features**: 4 measurements (sepal length/width, petal length/width)
- **Use case**: Classification of flower species

### MNIST Digit

- **Samples**: 1 handwritten digit image
- **Features**: 784 pixel intensities (28x28 grid)
- **Use case**: Image classification

### Housing Dataset

- **Samples**: 506 Boston neighborhoods
- **Features**: 13 socioeconomic indicators
- **Use case**: Price prediction (regression)

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Identify rows as samples and columns as features in a data matrix
2. Extract a feature vector for a specific sample
3. Compare feature values across different samples
4. Recognize the dimensions n (samples) and d (features)

### Guided Exploration (5-7 minutes)

1. **Start with Iris**: Observe the 4-feature structure representing flower measurements
2. **Click a Row**: See how one flower's measurements form a feature vector
3. **Click a Column**: Observe how sepal length varies across different flowers
4. **Switch to MNIST**: Notice the dramatic increase in features (pixels as features)
5. **Explore Housing**: See how socioeconomic features describe neighborhoods

### Key Discussion Points

- **Feature Selection**: Not all columns contribute equally to predictions
- **Sample Size**: More rows generally improve model reliability
- **Curse of Dimensionality**: High d relative to n can cause problems
- **Data Normalization**: Features may have different scales

### Assessment Questions

1. If the Iris dataset has 150 samples and 4 features, what is the shape of the data matrix?
2. In the MNIST dataset, why does a single image have 784 features?
3. Which dimension (n or d) grows when you collect more data points?
4. What does it mean to extract "row 3" from a data matrix?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Matrix fundamentals
- [Chapter 9: Machine Learning Fundamentals](../../chapters/09-ml-fundamentals/index.md) - Data representation in ML
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/) - Source for example datasets
