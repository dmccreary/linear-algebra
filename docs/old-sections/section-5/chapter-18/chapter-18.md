# Chapter 18: Machine Learning Foundations

## Introduction

Imagine teaching a robot how to recognize handwritten digits or detect objects in photos. How do you get it to learn patterns from numbers and pixels? The answer lies in **linear algebra** — particularly the way matrices represent transformations and learning steps.

In this chapter, we build on your knowledge of matrices, eigenvalues, and matrix decompositions to understand the mathematical heart of machine learning. We'll explore **linear layers**, **weight initialization**, **matrix calculus**, and **gradient descent** — the essential "training rituals" behind intelligent systems.

## 1. Neural Networks and Linear Layers

At its core, a **neural network** is just a collection of matrix operations.

### Linear Transformation
Each layer in a network applies a matrix multiplication:

$$
Z = W X + b
$$

where:
- $W$ = weight matrix
- $X$ = input vector
- $b$ = bias vector

This operation **transforms** input data into a new space, hoping to make patterns easier to recognize.

### Building Off Prior Knowledge
Remember PCA? PCA found new axes (principal components) that reveal structure. Similarly, neural networks learn new transformations (via $W$) that uncover hidden patterns in data.


## 2. Weight Initialization Using SVD

Training a neural network can fail if we start with poor weight values.

### The Problem
- If weights are too large or small, the outputs can explode or vanish.
- This makes learning very slow or unstable.

### The Solution
Use ideas from **Singular Value Decomposition (SVD)**:
- Initialize weights so that they are "balanced" across dimensions.
- SVD helps ensure that initial transformations preserve variance, just like PCA!

Common strategies:
- **Xavier Initialization**: weights are scaled according to the number of input and output nodes.
- **He Initialization**: scaled for ReLU activations.

!!! tip "Why This Works"
    Balanced weights prevent early layers from distorting the data too much, making learning smoother and faster.


## 3. Backpropagation and Matrix Calculus

To train a neural network, we must compute how the output error changes with respect to every weight — this is **backpropagation**.

### Key Ideas
- Use **matrix calculus** to compute gradients.
- Gradients tell us the direction and amount to adjust weights.

If $L$ is the loss function and $W$ is the weight matrix:

$$
\frac{\partial L}{\partial W}
$$

computes how a small change in $W$ changes the loss $L$.

Matrix calculus rules (like the chain rule) allow efficient computation over entire layers.


## 4. Gradient Descent for Solving Linear Systems

**Gradient Descent** is the workhorse of learning.

### How It Works
1. Compute the gradient of the loss with respect to parameters.
2. Update parameters in the negative direction of the gradient:

$$
\theta \leftarrow \theta - \eta \nabla L(\theta)
$$

where $\eta$ is the learning rate.

In linear systems, this mirrors methods like the **Conjugate Gradient** for finding solutions iteratively.


## 5. Batch vs. Stochastic Methods

When updating weights, should we use the entire dataset or just parts?

- **Batch Gradient Descent**: Uses the whole dataset. More accurate but slow.
- **Stochastic Gradient Descent (SGD)**: Uses one sample at a time. Faster but noisier.
- **Mini-Batch Gradient Descent**: A compromise — small groups of samples.

Choosing the right method depends on dataset size, noise tolerance, and computational resources.


## Summary
- Neural networks build on linear transformations (matrix multiplication).
- Weight initialization strategies use SVD concepts to stabilize early learning.
- Backpropagation applies matrix calculus to compute gradients.
- Gradient descent is an iterative method similar to solving linear systems.
- Batch, mini-batch, and stochastic updates balance speed and accuracy.

Understanding these concepts is crucial for anyone wanting to master machine learning foundations!

---

## Quiz Question

**In backpropagation, which mathematical concept is primarily used to compute how the loss changes with respect to weights?**

<div class="upper-alpha" markdown>
A. Matrix multiplication  
B. Matrix inverse  
C. Matrix calculus (derivatives)  
D. Kronecker product
</div>

??? Question "Show Answer"
    The correct answer is **C**. Backpropagation requires calculating derivatives of the loss function with respect to model parameters using matrix calculus.
