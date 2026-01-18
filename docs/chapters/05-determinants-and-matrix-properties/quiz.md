# Quiz: Determinants and Matrix Properties

Test your understanding of determinants and fundamental matrix properties.

*Note: This quiz covers key concepts from the chapter outline. Full chapter content is under development.*

---

#### 1. What does the determinant of a matrix represent geometrically?

<div class="upper-alpha" markdown>
1. The sum of diagonal elements
2. The signed volume scaling factor of the transformation
3. The number of pivots in row echelon form
4. The trace of the matrix
</div>

??? question "Show Answer"
    The correct answer is **B**. The determinant represents the signed scaling factor for volumes (areas in 2D). A determinant of 2 means the transformation doubles volumes; a negative determinant indicates the transformation reverses orientation.

    **Concept Tested:** Determinant

---

#### 2. If $\det(A) = 0$, then the matrix $A$ is:

<div class="upper-alpha" markdown>
1. Orthogonal
2. Symmetric
3. Singular (non-invertible)
4. Positive definite
</div>

??? question "Show Answer"
    The correct answer is **C**. A matrix with zero determinant is singular, meaning it has no inverse. The transformation collapses space in at least one dimension, making the operation irreversible.

    **Concept Tested:** Singular Matrix

---

#### 3. For any square matrices $A$ and $B$, which property holds?

<div class="upper-alpha" markdown>
1. $\det(A + B) = \det(A) + \det(B)$
2. $\det(AB) = \det(A) \cdot \det(B)$
3. $\det(AB) = \det(A) + \det(B)$
4. $\det(A^{-1}) = \det(A)$
</div>

??? question "Show Answer"
    The correct answer is **B**. The determinant is multiplicative: $\det(AB) = \det(A) \cdot \det(B)$. This reflects that composing transformations multiplies their volume scaling factors.

    **Concept Tested:** Determinant Properties

---

#### 4. The trace of a matrix is:

<div class="upper-alpha" markdown>
1. The product of diagonal elements
2. The sum of diagonal elements
3. The sum of all elements
4. The determinant divided by the dimension
</div>

??? question "Show Answer"
    The correct answer is **B**. The trace of a square matrix is the sum of its diagonal elements: $\text{tr}(A) = \sum_{i=1}^n A_{ii}$. The trace equals the sum of eigenvalues.

    **Concept Tested:** Trace

---

#### 5. What is $\det(A^T)$ in terms of $\det(A)$?

<div class="upper-alpha" markdown>
1. $-\det(A)$
2. $\det(A)$
3. $1/\det(A)$
4. $\det(A)^2$
</div>

??? question "Show Answer"
    The correct answer is **B**. The determinant of a transpose equals the original determinant: $\det(A^T) = \det(A)$. Transposing swaps rows and columns but doesn't change the volume scaling factor.

    **Concept Tested:** Determinant of Transpose

---

#### 6. If matrix $A$ has determinant 5, what is $\det(2A)$ for a $3 \times 3$ matrix?

<div class="upper-alpha" markdown>
1. 10
2. 25
3. 40
4. 80
</div>

??? question "Show Answer"
    The correct answer is **C**. For an $n \times n$ matrix, $\det(cA) = c^n \det(A)$. For a $3 \times 3$ matrix with $\det(A) = 5$: $\det(2A) = 2^3 \cdot 5 = 8 \cdot 5 = 40$.

    **Concept Tested:** Scalar Multiplication and Determinants

---

#### 7. A positive definite matrix has:

<div class="upper-alpha" markdown>
1. All positive entries
2. All positive eigenvalues
3. Positive determinant only
4. Positive trace only
</div>

??? question "Show Answer"
    The correct answer is **B**. A positive definite matrix has all positive eigenvalues. Equivalently, $\mathbf{x}^T A \mathbf{x} > 0$ for all non-zero vectors $\mathbf{x}$. This implies the matrix is invertible.

    **Concept Tested:** Positive Definite

---

#### 8. Which row operation does NOT change the determinant?

<div class="upper-alpha" markdown>
1. Adding a multiple of one row to another
2. Multiplying a row by a non-zero scalar
3. Swapping two rows
4. All row operations change the determinant
</div>

??? question "Show Answer"
    The correct answer is **A**. Adding a multiple of one row to another does not change the determinant. Swapping rows multiplies the determinant by $-1$, and multiplying a row by scalar $c$ multiplies the determinant by $c$.

    **Concept Tested:** Determinant and Row Operations

---

#### 9. What is $\det(A^{-1})$ in terms of $\det(A)$?

<div class="upper-alpha" markdown>
1. $\det(A)$
2. $-\det(A)$
3. $1/\det(A)$
4. $\det(A)^2$
</div>

??? question "Show Answer"
    The correct answer is **C**. Since $AA^{-1} = I$ and $\det(I) = 1$, we have $\det(A) \cdot \det(A^{-1}) = 1$, so $\det(A^{-1}) = 1/\det(A)$.

    **Concept Tested:** Determinant of Inverse

---

#### 10. A matrix is positive semidefinite if:

<div class="upper-alpha" markdown>
1. All eigenvalues are strictly positive
2. All eigenvalues are non-negative (zero or positive)
3. The determinant is positive
4. All entries are non-negative
</div>

??? question "Show Answer"
    The correct answer is **B**. A positive semidefinite matrix has all non-negative eigenvalues (zero or positive). Equivalently, $\mathbf{x}^T A \mathbf{x} \geq 0$ for all vectors $\mathbf{x}$.

    **Concept Tested:** Positive Semidefinite
