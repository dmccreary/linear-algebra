---
title: PCA Step-by-Step Visualizer
description: Understand Principal Component Analysis by visualizing each step from raw data to projected low-dimensional representation
image: /sims/pca-explorer/pca-explorer.png
---

# PCA Step-by-Step Visualizer

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the PCA Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates **Principal Component Analysis (PCA)** step by step, showing how data is transformed from its original representation to a lower-dimensional projection.

PCA finds the directions of maximum variance in the data and projects onto those directions:

$$\text{PCA: } X \rightarrow X_{centered} \rightarrow \text{eigenvectors of } X^TX \rightarrow \text{projection}$$

## Key Features

- **Four-Panel View**: See each transformation stage simultaneously
- **Animated Transitions**: Watch the data transform step by step
- **Interactive Data Generation**: Control cluster shape, spread, rotation, and elongation
- **Scree Plot**: Visualize eigenvalue magnitudes
- **Variance Explained**: See how much information each component captures
- **Reconstruction Toggle**: Visualize the error from dimensionality reduction

## The PCA Steps

| Step | Operation | Geometric Effect |
|------|-----------|------------------|
| 0 | Original Data | Raw data with mean point shown |
| 1 | Center | Translate data so mean is at origin |
| 2 | Find PCs | Compute eigenvectors of covariance matrix |
| 3 | Project | Project onto first k principal components |

## How to Use

1. Click **"1. Center"** to see the data shifted to have zero mean
2. Click **"2. Find PCs"** to compute and display principal component vectors
3. Click **"3. Project"** to see data projected onto the first PC
4. Adjust **k** slider to keep 1 or 2 components
5. Toggle **"Show Reconstruction"** to see projection error
6. Use **data controls** to change cluster shape and regenerate

## Understanding the Visualization

### Panel 1: Original Data
- Raw data points colored by index
- Red dot shows the mean (center of mass)
- Data may be offset from origin

### Panel 2: Centered Data
- Data shifted so mean is at origin
- Same shape, just translated
- This is essential before computing covariance

### Panel 3: Principal Components
- Red arrow (PC1): Direction of maximum variance
- Green arrow (PC2): Direction of second-most variance (orthogonal to PC1)
- Arrow lengths proportional to square root of eigenvalues

### Panel 4: Projected Data
- Points projected onto PC1 (when k=1)
- Red line shows the projection subspace
- Orange dashed lines show reconstruction error (when enabled)

### Scree Plot
- Bar chart showing eigenvalue magnitudes
- Helps decide how many components to keep
- Large drop between bars suggests natural dimensionality

### Variance Explained
- Percentage of total variance captured by each PC
- Sum of kept components shows information retained
- Higher is better for reconstruction quality

## Learning Objectives

After using this MicroSim, students will be able to:

- Explain why centering data is the first step in PCA
- Identify principal components as eigenvectors of the covariance matrix
- Understand that eigenvalues indicate variance along each PC direction
- Demonstrate how projection reduces dimensionality while preserving variance
- Interpret scree plots to choose the number of components

## Observations to Make

### Elongated Cluster
When the elongation is high:
- PC1 captures most of the variance (large first eigenvalue)
- Projection onto PC1 loses little information
- Scree plot shows large first bar, small second bar

### Circular Cluster (elongation ≈ 1)
When data is roughly circular:
- Both eigenvalues are similar
- Neither PC direction is clearly "best"
- Dimensionality reduction loses significant information

### Effect of Rotation
- Changing rotation changes PC directions
- But variance explained remains the same
- PCA finds the natural axes regardless of original orientation

## Mathematical Background

For data matrix $X$ (centered):

1. **Covariance Matrix**: $C = \frac{1}{n}X^TX$

2. **Eigendecomposition**: $C = V\Lambda V^T$
   - $V$: matrix of eigenvectors (principal components)
   - $\Lambda$: diagonal matrix of eigenvalues

3. **Projection**: $X_{reduced} = XV_k$
   - $V_k$: first k columns of V

4. **Reconstruction**: $\hat{X} = X_{reduced}V_k^T$

5. **Reconstruction Error**: $\|X - \hat{X}\|^2 = \sum_{i=k+1}^{d} \lambda_i$

## Lesson Plan

### Introduction (5 minutes)
Ask: "How can we represent high-dimensional data with fewer dimensions while keeping the important structure?"

Introduce PCA as finding the directions where data varies most.

### Demonstration (10 minutes)

1. Generate an elongated cluster and step through all phases
2. Point out:
   - Mean computation and centering
   - PC1 aligns with the elongated direction
   - Projection loses the "thickness" but keeps the "length"

3. Toggle reconstruction to show what information is lost

### Exploration (10 minutes)
Have students:

1. Adjust elongation and observe scree plot changes
2. Find settings where 90% variance is captured by PC1
3. Find settings where both PCs capture equal variance

### Assessment Questions

1. Why must we center the data before computing covariance?
2. What does a large gap in the scree plot indicate?
3. When would reducing to 1 dimension be a bad choice?
4. How does the rotation of the original data affect the variance explained?

## Applications

- **Image Compression**: Reduce dimensionality of face images (eigenfaces)
- **Feature Extraction**: Find most informative features for machine learning
- **Data Visualization**: Project high-dimensional data to 2D or 3D for plotting
- **Noise Reduction**: Remove low-variance components that may be noise

## References

- Chapter 9: Dimensionality Reduction (PCA section)
- [3Blue1Brown: PCA](https://www.youtube.com/watch?v=PFDu9oVAE-g)
- Shlens, J. "A Tutorial on Principal Component Analysis"
