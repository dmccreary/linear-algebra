---
title: Machine Learning Pipeline Workflow
description: Interactive flowchart showing the complete ML pipeline from raw data to trained model with code examples.
image: /sims/ml-pipeline/ml-pipeline.png
og:image: /sims/ml-pipeline/ml-pipeline.png
twitter:image: /sims/ml-pipeline/ml-pipeline.png
social:
   cards: false
---

# Machine Learning Pipeline Workflow

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the ML Pipeline Workflow Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This interactive flowchart visualizes the complete machine learning pipeline from raw data to a trained model. Each stage is color-coded by category and includes both hover explanations and Python code examples.

**Pipeline Stages:**

1. **Raw Data** - Original features, possibly different scales and units
2. **Standardization** - Transform to zero mean, unit variance
3. **PCA (optional)** - Reduce dimensionality while preserving variance
4. **Train/Test Split** - Hold out data for evaluation
5. **Model Selection** - Choose algorithm (OLS, Ridge, or Lasso)
6. **Optimization** - Find optimal parameters
7. **Evaluation** - Assess on test set (MSE, R-squared)
8. **Trained Model** - Ready for deployment

## How to Use

1. **Hover over nodes** to see detailed explanations of each stage
2. **Click on nodes** to view Python code examples for that stage
3. **Click "Clear Selection"** or click elsewhere to dismiss the code panel
4. **Follow the arrows** to understand the data flow through the pipeline

## Color Coding

| Color | Category | Stages |
|-------|----------|--------|
| Blue | Data Processing | Raw Data, Standardization, PCA, Train/Test Split |
| Green | Modeling | Model Selection, OLS, Ridge, Lasso |
| Orange | Optimization | Optimization |
| Purple | Evaluation | Evaluation, Trained Model |

## The ML Pipeline in Linear Algebra Terms

The machine learning pipeline heavily relies on linear algebra operations:

### Standardization
$$z = \frac{x - \mu}{\sigma}$$

This transforms the data matrix $X$ so each column has mean 0 and variance 1.

### PCA (Principal Component Analysis)
Uses SVD to find the directions of maximum variance:
$$X = U\Sigma V^T$$

The principal components are the columns of $V$.

### Linear Regression Models

**OLS (Ordinary Least Squares):**
$$\hat{\beta} = (X^TX)^{-1}X^Ty$$

**Ridge Regression (L2 regularization):**
$$\hat{\beta} = (X^TX + \lambda I)^{-1}X^Ty$$

**Lasso Regression (L1 regularization):**
Minimizes $\|y - X\beta\|_2^2 + \lambda\|\beta\|_1$

## Embedding

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/ml-pipeline/main.html" height="552px" scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Describe the complete workflow of a machine learning pipeline
2. Explain the purpose of each preprocessing and modeling stage
3. Compare and contrast OLS, Ridge, and Lasso regression approaches
4. Identify where linear algebra operations occur in the pipeline

### Suggested Activities

1. **Trace the pipeline**: Follow the data flow and explain what happens at each stage
2. **Code walkthrough**: Use the code examples to implement a complete pipeline in Python
3. **Model comparison**: Run all three regression types on the same dataset and compare results

### Assessment Questions

1. Why is standardization important before applying PCA?
2. What is the key difference between Ridge and Lasso regularization?
3. Why do we need a separate test set for evaluation?
4. At which stage does the closed-form solution $(X^TX)^{-1}X^Ty$ get computed?

## References

- [Chapter 10: PCA and Dimensionality Reduction](../../chapters/10-pca/index.md)
- [Chapter 11: Linear Regression](../../chapters/11-linear-regression/index.md)
- [Linear Algebra Learning Graph](/learning-graph/)
