---
title: Scree Plot and Component Selection
description: Learn to use scree plots and cumulative variance to select the optimal number of principal components in PCA
image: /sims/scree-plot/scree-plot.png
---

# Scree Plot and Component Selection

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Scree Plot MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization teaches the critical skill of **selecting the optimal number of principal components** in PCA. Choosing the right number of components balances dimensionality reduction against information preservation.

The key decision in PCA is: How many components $k$ should we keep?

$$\text{Keep } k \text{ components if } \frac{\sum_{i=1}^{k} \lambda_i}{\sum_{i=1}^{d} \lambda_i} \geq \text{threshold}$$

## Key Features

- **Dual Panel View**: Scree plot (left) and cumulative variance (right) side by side
- **Multiple Datasets**: Compare different eigenvalue decay patterns
- **Three Selection Methods**: Elbow method, variance threshold, and Kaiser criterion
- **Interactive Threshold**: Drag to adjust target variance level
- **Reconstruction Error Display**: Visualize information loss at different k values

## Selection Methods

| Method | Rule | Best For |
|--------|------|----------|
| **Elbow Method** | Find sharp bend in scree plot | Data with clear structure |
| **Variance Threshold** | Keep k to explain 95% variance | When error tolerance is known |
| **Kaiser Criterion** | Keep components with eigenvalue > 1 | Standardized data |

## How to Use

1. **Select a Dataset**: Different patterns show when each method works best
2. **Observe the Scree Plot**: Look for the "elbow" where eigenvalues drop sharply
3. **Check Cumulative Variance**: See how much variance each component adds
4. **Drag the Threshold Line**: Interactively adjust your target variance
5. **Compare Methods**: The summary box shows suggested k from each method
6. **Toggle Reconstruction Error**: Visualize the trade-off between k and information loss

## Understanding the Visualization

### Left Panel: Scree Plot

- **Blue bars**: Eigenvalues of selected components
- **Gray bars**: Eigenvalues of discarded components
- **Orange circle**: Detected elbow point
- **Red dashed line**: Kaiser criterion (eigenvalue = 1)
- **Connecting line**: Helps visualize the "elbow"

### Right Panel: Cumulative Variance

- **Blue line**: Running sum of variance explained
- **Blue shading**: Variance captured by selected components
- **Green dashed line**: Target variance threshold
- **Green dot**: Point where threshold is achieved
- **Draggable handle**: Adjust threshold interactively

### Dataset Patterns

#### Synthetic (Elbow at k=3)
- Clear elbow makes selection straightforward
- All three methods roughly agree
- Ideal case for the elbow method

#### Gradual Decay
- No sharp elbow visible
- Variance threshold method works better
- Common in real-world data

#### Uniform
- No clear structure in eigenvalues
- All components roughly equal importance
- Dimensionality reduction may not be appropriate

#### Two Groups
- Clear separation between important and noise components
- Strong agreement between methods
- Common pattern in data with distinct signal and noise

## Learning Objectives

After using this MicroSim, students will be able to:

- Interpret scree plots to identify natural dimensionality
- Apply the elbow method to select number of components
- Set and justify variance thresholds for component selection
- Understand Kaiser criterion and when to apply it
- Recognize when dimensionality reduction is appropriate
- Evaluate trade-offs between compression and reconstruction quality

## Mathematical Background

### Variance Explained

For eigenvalues $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_d$:

**Individual variance**: $\frac{\lambda_i}{\sum_j \lambda_j}$

**Cumulative variance**: $\frac{\sum_{i=1}^{k} \lambda_i}{\sum_{j=1}^{d} \lambda_j}$

### Reconstruction Error

The Frobenius norm reconstruction error equals the sum of discarded eigenvalues:

$$\|X - X_k\|_F^2 = \sum_{i=k+1}^{d} \lambda_i$$

### Kaiser Criterion

For standardized data (correlation matrix), keep components where:

$$\lambda_i \geq 1$$

This threshold represents average variance per original variable.

## Selection Guidelines

### Use Elbow Method When:
- Scree plot shows clear bend
- Data has distinct signal vs. noise components
- You want a data-driven selection

### Use Variance Threshold When:
- You have a specific accuracy requirement
- Domain knowledge suggests acceptable error level
- Elbow is not clearly visible

### Use Kaiser Criterion When:
- Data is standardized (mean 0, variance 1)
- Working with correlation matrix
- You want components that explain more than one original variable

## Common Patterns and Interpretations

### Sharp Initial Drop
- First few components capture most variance
- Good candidate for significant dimensionality reduction
- Clear separation between signal and noise

### Gradual Decay (Exponential)
- Information distributed across many components
- May need more components to preserve structure
- Consider domain-specific thresholds

### Nearly Flat
- No dominant directions in data
- PCA may not be the right technique
- Consider other approaches or full dimensionality

## Practical Tips

1. **Always visualize**: Don't rely solely on numbers
2. **Compare methods**: Agreement suggests robust choice
3. **Consider the task**: Classification may need fewer components than reconstruction
4. **Cross-validate**: Test downstream performance at different k values
5. **Be conservative**: When uncertain, keep more components

## Lesson Plan

### Introduction (5 minutes)
- Ask: "After computing PCA, how do we decide how many components to use?"
- Introduce the bias-variance trade-off in choosing k

### Demonstration (10 minutes)
1. Start with Synthetic dataset showing clear elbow
2. Walk through each selection method
3. Show how the summary box compares suggestions
4. Demonstrate dragging the threshold line

### Exploration (10 minutes)
Have students:

1. Switch to Gradual Decay - note elbow is less clear
2. Find what k achieves 90% variance for each dataset
3. Identify which dataset is hardest to choose k for
4. Predict reconstruction quality at different k values

### Assessment Questions

1. Why might different selection methods suggest different k values?
2. When would you choose a higher k than the elbow suggests?
3. What does it mean if eigenvalues are nearly uniform?
4. How does the variance threshold relate to reconstruction error?

## Applications

- **Image Processing**: Choose k for face recognition (eigenfaces)
- **Genomics**: Select significant gene expression components
- **Finance**: Identify market factors from many correlated assets
- **Signal Processing**: Separate signal from noise components
- **Machine Learning**: Feature selection for model training

## References

- Chapter 9: Dimensionality Reduction (Component Selection section)
- Cattell, R.B. "The Scree Test for the Number of Factors"
- Kaiser, H.F. "The Application of Electronic Computers to Factor Analysis"
