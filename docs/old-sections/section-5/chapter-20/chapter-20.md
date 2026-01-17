# Chapter 20: Kernel Methods and Collaborative Filtering

## Introduction

Suppose you want to classify data that isn’t neatly separated by a straight line (like distinguishing spirals or circles). What if we could "lift" the data into a higher dimension where it **is** separable by a line? **Kernel methods** make this possible — and they rely on clever applications of linear algebra!

This chapter also introduces **collaborative filtering**, which uses matrix factorization to build recommendation systems, and explores real-world applications like **Eigenfaces** for facial recognition.

## 1. Support Vector Machines (SVMs) and the Kernel Trick

### Linear SVMs
In simple SVMs, we seek a hyperplane (a line in 2D, a plane in 3D, etc.) that best separates data into two classes by maximizing the margin between them.

Mathematically, the hyperplane is defined as:

$$
w^T x + b = 0
$$

where:
- $w$ = weight vector (normal to the hyperplane)
- $b$ = bias

Optimization aims to maximize the margin while correctly classifying as many points as possible.


### When Data is Nonlinear
Often, data isn't linearly separable. To fix this, we can map data into a **higher-dimensional space** where separation is easier. But computing these higher-dimensional vectors explicitly is expensive!

### Enter the Kernel Trick
Rather than computing transformations explicitly, the **kernel trick** computes the **inner products** in the higher-dimensional space directly using a **kernel function** $k(x, y)$.

Examples of kernels:
- **Linear Kernel**: $k(x,y) = x^T y$
- **Polynomial Kernel**: $k(x,y) = (x^T y + c)^d$
- **RBF (Gaussian) Kernel**: $k(x,y) = \exp\left(-\gamma \|x-y\|^2\right)$

**Key Insight:**
You never need to know the mapping explicitly; you only need the inner products!

!!! example "Analogy"
    Imagine trying to separate intertwined spaghetti noodles (complex data) on a plate. Instead of untangling them manually, you freeze them into ice, making them rigid and easier to separate. The kernel trick "freezes" complexity into manageable pieces.


## 2. Positive Semidefinite Kernels and Gram Matrices

### Positive Semidefinite (PSD) Kernels
A kernel function must generate a **positive semidefinite Gram matrix**:
- A matrix $K$ where each entry $K_{ij} = k(x_i, x_j)$.
- Positive semidefinite means that for any vector $z$:

$$
z^T K z \geq 0
$$


### Why PSD Matters
- Ensures the kernel represents a valid inner product.
- Guarantees convexity in SVM optimization (critical for finding global minima).

**Important Reminder:**
PSD matrices have **non-negative eigenvalues**, linking back to your earlier understanding of eigenvalues from Chapters 5 and 6!


## 3. Collaborative Filtering and Matrix Factorization

### What is Collaborative Filtering?
Imagine a movie platform like Netflix. How do we recommend movies you haven't seen yet?
- **Collaborative Filtering** predicts your preferences based on patterns in your and others' ratings.

This leads to a large, partially-filled **user-item matrix** where entries are known ratings.

### Matrix Factorization
The idea is to factorize the user-item matrix $M$ into two low-rank matrices:

$$
M \approx U V^T
$$

where:
- $U$ = user factors (preferences)
- $V$ = item factors (attributes)

The product $U V^T$ reconstructs known ratings and fills in the missing ones.

Optimization typically minimizes the reconstruction error:

$$
\min_{U, V} \sum_{(i,j) \in \text{known}} (M_{ij} - U_i^T V_j)^2
$$


## 4. Eigenfaces for Face Recognition

### Eigenfaces Method
- Treat grayscale face images as large vectors.
- Compute the **covariance matrix** of the training faces.
- Perform **eigen decomposition** to find principal components ("Eigenfaces").
- Represent each face as a linear combination of a few Eigenfaces.

**Key Intuition:**
Faces live in a much smaller "face space" than the full pixel space!

This is a direct application of PCA (Chapter 17) to image classification.


## Summary
- SVMs maximize margins for classification and use the **kernel trick** to handle nonlinear data.
- Kernels must create **positive semidefinite Gram matrices** to guarantee valid optimization.
- **Collaborative filtering** uses **low-rank matrix factorization** for recommendation systems.
- **Eigenfaces** apply PCA concepts to facial recognition by finding a lower-dimensional "face space."

These techniques are foundational for modern machine learning applications ranging from Netflix recommendations to facial ID systems!

---

## Quiz Question

**Which concept allows Support Vector Machines to operate in a higher-dimensional space without explicitly computing the mapping?**

<div class="upper-alpha" markdown>
A. Matrix decomposition  
B. Kernel trick  
C. Eigen decomposition  
D. SVD factorization
</div>

??? Question "Show Answer"
    The correct answer is **B**. The kernel trick enables operations in higher-dimensional feature spaces without explicitly computing the transformations.
