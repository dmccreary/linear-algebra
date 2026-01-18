# Quiz: Eigenvalues and Eigenvectors

Test your understanding of eigenvalues, eigenvectors, and their applications.

---

#### 1. An eigenvector $\mathbf{v}$ of matrix $A$ satisfies:

<div class="upper-alpha" markdown>
1. $A\mathbf{v} = \mathbf{0}$
2. $A\mathbf{v} = \lambda\mathbf{v}$ for some scalar $\lambda$
3. $A + \mathbf{v} = \lambda$
4. $\mathbf{v}^T A = \lambda$
</div>

??? question "Show Answer"
    The correct answer is **B**. An eigenvector $\mathbf{v}$ of matrix $A$ satisfies $A\mathbf{v} = \lambda\mathbf{v}$, where $\lambda$ is the corresponding eigenvalue. The matrix simply scales the eigenvector rather than changing its direction.

    **Concept Tested:** Eigenvector

---

#### 2. The characteristic polynomial of matrix $A$ is:

<div class="upper-alpha" markdown>
1. $\det(A)$
2. $\det(A - \lambda I)$
3. $\det(A + \lambda I)$
4. $\text{tr}(A) - \lambda$
</div>

??? question "Show Answer"
    The correct answer is **B**. The characteristic polynomial is $p(\lambda) = \det(A - \lambda I)$. Setting this equal to zero gives the characteristic equation, whose roots are the eigenvalues.

    **Concept Tested:** Characteristic Polynomial

---

#### 3. The eigenvalues of a symmetric matrix are always:

<div class="upper-alpha" markdown>
1. Complex numbers
2. Real numbers
3. Positive numbers
4. Zero
</div>

??? question "Show Answer"
    The correct answer is **B**. A key property of symmetric matrices is that all eigenvalues are real numbers. Additionally, eigenvectors corresponding to distinct eigenvalues are orthogonal.

    **Concept Tested:** Eigenvalues of Symmetric Matrices

---

#### 4. The sum of all eigenvalues of a matrix equals:

<div class="upper-alpha" markdown>
1. The determinant
2. The trace
3. The rank
4. Zero
</div>

??? question "Show Answer"
    The correct answer is **B**. The sum of all eigenvalues (counting multiplicities) equals the trace of the matrix. Similarly, the product of all eigenvalues equals the determinant.

    **Concept Tested:** Eigenvalue Properties

---

#### 5. If $\lambda$ is an eigenvalue of $A$, then the eigenvalue of $A^2$ for the same eigenvector is:

<div class="upper-alpha" markdown>
1. $\lambda$
2. $2\lambda$
3. $\lambda^2$
4. $\sqrt{\lambda}$
</div>

??? question "Show Answer"
    The correct answer is **C**. If $A\mathbf{v} = \lambda\mathbf{v}$, then $A^2\mathbf{v} = A(A\mathbf{v}) = A(\lambda\mathbf{v}) = \lambda(A\mathbf{v}) = \lambda^2\mathbf{v}$. Raising a matrix to a power raises its eigenvalues to the same power.

    **Concept Tested:** Powers of Matrices

---

#### 6. Eigendecomposition of matrix $A$ (when possible) is:

<div class="upper-alpha" markdown>
1. $A = V + D$
2. $A = VDV^{-1}$
3. $A = V^T D V$
4. $A = D - V$
</div>

??? question "Show Answer"
    The correct answer is **B**. Eigendecomposition expresses a matrix as $A = VDV^{-1}$, where $V$ is the matrix of eigenvectors and $D$ is a diagonal matrix of eigenvalues. For symmetric matrices, $V$ is orthogonal so $A = VDV^T$.

    **Concept Tested:** Eigendecomposition

---

#### 7. A matrix is diagonalizable if:

<div class="upper-alpha" markdown>
1. It is symmetric
2. It has $n$ linearly independent eigenvectors
3. All eigenvalues are positive
4. It is invertible
</div>

??? question "Show Answer"
    The correct answer is **B**. A matrix is diagonalizable if and only if it has $n$ linearly independent eigenvectors, where $n$ is the matrix dimension. Symmetric matrices always satisfy this condition.

    **Concept Tested:** Diagonalizability

---

#### 8. The spectral theorem states that for a real symmetric matrix:

<div class="upper-alpha" markdown>
1. All eigenvalues are complex
2. The matrix has an orthonormal basis of eigenvectors
3. The matrix is not diagonalizable
4. Eigenvalues form a spectrum of colors
</div>

??? question "Show Answer"
    The correct answer is **B**. The spectral theorem guarantees that real symmetric matrices have real eigenvalues and an orthonormal basis of eigenvectors. This enables the decomposition $A = Q\Lambda Q^T$ where $Q$ is orthogonal.

    **Concept Tested:** Spectral Theorem

---

#### 9. Why are eigenvalues important in stability analysis?

<div class="upper-alpha" markdown>
1. They determine the color of the system
2. Negative real parts indicate stable equilibria
3. They measure the matrix size
4. They count the number of solutions
</div>

??? question "Show Answer"
    The correct answer is **B**. In dynamical systems $\dot{\mathbf{x}} = A\mathbf{x}$, eigenvalues determine stability. If all eigenvalues have negative real parts, perturbations decay over time and the system is stable. Positive real parts indicate instability.

    **Concept Tested:** Stability Analysis

---

#### 10. In Principal Component Analysis (PCA), eigenvectors of the covariance matrix represent:

<div class="upper-alpha" markdown>
1. Random noise directions
2. Directions of maximum variance in the data
3. The mean of the data
4. Outlier locations
</div>

??? question "Show Answer"
    The correct answer is **B**. In PCA, eigenvectors of the covariance matrix (principal components) point in directions of maximum variance. The corresponding eigenvalues indicate how much variance is captured by each direction.

    **Concept Tested:** Principal Component Analysis
