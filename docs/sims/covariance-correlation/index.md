---
title: Covariance and Correlation Matrix Visualizer
description: Interactive exploration of how covariance and correlation capture relationships between features through scatter plots and heatmaps.
image: /sims/covariance-correlation/covariance-correlation.png
og:image: /sims/covariance-correlation/covariance-correlation.png
twitter:image: /sims/covariance-correlation/covariance-correlation.png
social:
   cards: false
---

# Covariance and Correlation Matrix Visualizer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Covariance Correlation Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive visualization helps you understand the relationship between covariance and correlation - two fundamental measures of how variables relate to each other. The three-panel layout shows the same data from different perspectives.

**Key Features:**

- **Scatter plot**: Visualize the raw relationship between features X and Y
- **Covariance matrix**: See the unstandardized measure of joint variability
- **Correlation matrix**: See the standardized measure bounded between -1 and 1
- **Draggable points**: Modify data and watch matrices update in real-time
- **Standardize toggle**: Observe how standardization makes covariance equal correlation
- **Eigenvalue display**: See the principal components of the covariance matrix

## Understanding Covariance vs Correlation

| Property | Covariance | Correlation |
|----------|------------|-------------|
| Range | Unbounded | -1 to +1 |
| Scale dependent | Yes | No |
| Units | Product of units | Unitless |
| Interpretation | Direction of relationship | Strength and direction |

### Covariance Formula

$$\text{Cov}(X,Y) = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})$$

### Correlation Formula (Pearson)

$$r_{XY} = \frac{\text{Cov}(X,Y)}{\sigma_X \sigma_Y}$$

## Key Insights

1. **Correlation normalizes for scale**: Changing the units of X or Y changes covariance but not correlation

2. **Standardized data**: When data is standardized (mean=0, std=1), the covariance matrix equals the correlation matrix

3. **Eigenvalues**: The eigenvalues of the covariance matrix represent the variance along principal components

4. **Matrix symmetry**: Both matrices are symmetric because Cov(X,Y) = Cov(Y,X)

## How to Use

1. **Select a dataset preset** to see different correlation patterns
2. **Drag the correlation slider** to smoothly adjust the relationship strength
3. **Drag individual points** in the scatter plot to see how outliers affect the statistics
4. **Toggle "Standardize Data"** to see how standardization affects the covariance matrix
5. **Click matrix cells** to highlight the corresponding relationship

## Interpretation Guide

| Correlation Value | Interpretation |
|-------------------|----------------|
| +0.8 to +1.0 | Very strong positive |
| +0.6 to +0.8 | Strong positive |
| +0.4 to +0.6 | Moderate positive |
| +0.2 to +0.4 | Weak positive |
| -0.2 to +0.2 | Very weak or none |
| -0.4 to -0.2 | Weak negative |
| -0.6 to -0.4 | Moderate negative |
| -0.8 to -0.6 | Strong negative |
| -1.0 to -0.8 | Very strong negative |

## Applications in Machine Learning

- **Feature selection**: Highly correlated features may be redundant
- **PCA**: Principal Component Analysis uses eigendecomposition of the covariance matrix
- **Multicollinearity detection**: Correlation matrices reveal problematic variable relationships
- **Data preprocessing**: Standardization is often required before algorithms like KNN

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/covariance-correlation/main.html" height="582px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Calculate and interpret covariance between two variables
2. Calculate and interpret Pearson correlation coefficient
3. Explain why correlation is preferred over covariance for comparison
4. Describe how standardization affects the covariance matrix
5. Connect eigenvalues of the covariance matrix to PCA

### Suggested Activities

1. **Outlier investigation**: Drag one point far from the cluster and observe the effect on r
2. **Scale independence**: Note that changing the slider changes covariance values but correlation stays interpretable
3. **Standardization experiment**: Toggle standardize on/off and compare the two matrices
4. **Eigenvalue exploration**: Observe how eigenvalues change with correlation strength

### Assessment Questions

1. If Cov(X,Y) = 15 and the standard deviations are 3 and 5, what is the correlation?
2. Why does the diagonal of the correlation matrix always equal 1?
3. What happens to the eigenvalues as correlation approaches 1 or -1?
4. Why might standardizing data before machine learning be important?

## References

- [Chapter 9: Statistics and Linear Algebra](../../chapters/09-statistics-and-linear-algebra/index.md)
- [Chapter 7: Matrix Decomposition](../../chapters/07-matrix-decomposition/index.md)
- [Linear Algebra Learning Graph](/learning-graph/)
