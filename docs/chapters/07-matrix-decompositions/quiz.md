# Quiz: Matrix Decompositions

Test your understanding of SVD, QR, and other matrix decompositions.

---

#### 1. The Singular Value Decomposition (SVD) factors a matrix $A$ as:

<div class="upper-alpha" markdown>
1. $A = U\Sigma V$
2. $A = U\Sigma V^T$
3. $A = \Sigma UV$
4. $A = U + \Sigma + V$
</div>

??? question "Show Answer"
    The correct answer is **B**. The SVD decomposes any $m \times n$ matrix as $A = U\Sigma V^T$, where $U$ and $V$ are orthogonal matrices and $\Sigma$ is a diagonal matrix of singular values.

    **Concept Tested:** Singular Value Decomposition

---

#### 2. Singular values of a matrix are always:

<div class="upper-alpha" markdown>
1. Complex numbers
2. Negative or zero
3. Non-negative real numbers
4. Equal to the eigenvalues
</div>

??? question "Show Answer"
    The correct answer is **C**. Singular values are always non-negative real numbers, typically arranged in decreasing order: $\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_r > 0$. They are the square roots of eigenvalues of $A^TA$.

    **Concept Tested:** Singular Values

---

#### 3. The rank of a matrix equals:

<div class="upper-alpha" markdown>
1. The number of rows
2. The number of non-zero singular values
3. The largest singular value
4. The trace
</div>

??? question "Show Answer"
    The correct answer is **B**. The rank of a matrix equals the number of non-zero singular values. This provides a robust numerical way to determine rank, especially when using a tolerance for "effectively zero" values.

    **Concept Tested:** Rank and SVD

---

#### 4. In the low-rank approximation via SVD, keeping only the top $k$ singular values minimizes:

<div class="upper-alpha" markdown>
1. The Frobenius norm of the error
2. The rank of the matrix
3. The number of computations
4. The trace of the matrix
</div>

??? question "Show Answer"
    The correct answer is **A**. The truncated SVD gives the best rank-$k$ approximation in both the Frobenius norm and the spectral norm. This is the Eckart-Young-Mirsky theorem.

    **Concept Tested:** Low-Rank Approximation

---

#### 5. QR decomposition factors a matrix as:

<div class="upper-alpha" markdown>
1. $A = QR$ where $Q$ is orthogonal and $R$ is upper triangular
2. $A = QR$ where $Q$ is diagonal and $R$ is symmetric
3. $A = R^TQ$
4. $A = Q + R$
</div>

??? question "Show Answer"
    The correct answer is **A**. QR decomposition expresses a matrix as $A = QR$, where $Q$ is an orthogonal matrix (orthonormal columns) and $R$ is upper triangular. It is used in solving least squares and computing eigenvalues.

    **Concept Tested:** QR Decomposition

---

#### 6. The Gram-Schmidt process produces:

<div class="upper-alpha" markdown>
1. A diagonal matrix
2. An orthonormal basis from a set of vectors
3. The inverse of a matrix
4. The determinant
</div>

??? question "Show Answer"
    The correct answer is **B**. The Gram-Schmidt process takes a set of linearly independent vectors and produces an orthonormal set spanning the same space. It is the foundation of QR decomposition.

    **Concept Tested:** Gram-Schmidt Process

---

#### 7. Cholesky decomposition applies to:

<div class="upper-alpha" markdown>
1. Any square matrix
2. Positive definite symmetric matrices
3. Singular matrices only
4. Rectangular matrices
</div>

??? question "Show Answer"
    The correct answer is **B**. Cholesky decomposition factors a positive definite symmetric matrix as $A = LL^T$, where $L$ is lower triangular. It is twice as efficient as LU decomposition for applicable matrices.

    **Concept Tested:** Cholesky Decomposition

---

#### 8. The left singular vectors (columns of $U$ in SVD) are eigenvectors of:

<div class="upper-alpha" markdown>
1. $A$
2. $A^TA$
3. $AA^T$
4. $A + A^T$
</div>

??? question "Show Answer"
    The correct answer is **C**. The left singular vectors (columns of $U$) are eigenvectors of $AA^T$, while the right singular vectors (columns of $V$) are eigenvectors of $A^TA$. The squared singular values are the eigenvalues.

    **Concept Tested:** SVD and Eigenvalues

---

#### 9. The pseudoinverse $A^+$ computed via SVD satisfies:

<div class="upper-alpha" markdown>
1. $AA^+ = I$ always
2. $AA^+A = A$
3. $A^+ = A^T$
4. $A^+ = A^{-1}$ always
</div>

??? question "Show Answer"
    The correct answer is **B**. The Moore-Penrose pseudoinverse satisfies $AA^+A = A$ (among other conditions). It generalizes the inverse to non-square and singular matrices, providing least-squares solutions.

    **Concept Tested:** Pseudoinverse

---

#### 10. Which decomposition is most useful for image compression?

<div class="upper-alpha" markdown>
1. LU decomposition
2. QR decomposition
3. SVD with truncation
4. Cholesky decomposition
</div>

??? question "Show Answer"
    The correct answer is **C**. Truncated SVD is ideal for image compression because it provides the optimal low-rank approximation. Keeping only the largest singular values captures the most important image features while reducing storage.

    **Concept Tested:** SVD Applications
