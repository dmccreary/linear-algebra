# Quiz: Matrices and Matrix Operations

Test your understanding of matrices, matrix operations, and their properties.

---

#### 1. What is the result of multiplying an $m \times n$ matrix by an $n \times p$ matrix?

<div class="upper-alpha" markdown>
1. An $m \times p$ matrix
2. An $n \times n$ matrix
3. An $m \times n$ matrix
4. A scalar value
</div>

??? question "Show Answer"
    The correct answer is **A**. When multiplying an $m \times n$ matrix by an $n \times p$ matrix, the result is an $m \times p$ matrix. The inner dimensions ($n$) must match, and the outer dimensions ($m$ and $p$) determine the output size.

    **Concept Tested:** Matrix Multiplication

---

#### 2. Which property does matrix multiplication NOT have?

<div class="upper-alpha" markdown>
1. Associativity: $(AB)C = A(BC)$
2. Distributivity: $A(B + C) = AB + AC$
3. Commutativity: $AB = BA$
4. Identity: $AI = IA = A$
</div>

??? question "Show Answer"
    The correct answer is **C**. Matrix multiplication is not commutative in general—$AB \neq BA$ for most matrices. The order of multiplication matters because each product represents a different sequence of transformations.

    **Concept Tested:** Matrix Multiplication Properties

---

#### 3. What is the transpose of a matrix?

<div class="upper-alpha" markdown>
1. The matrix with all elements negated
2. The matrix with rows and columns interchanged
3. The inverse of the matrix
4. The matrix multiplied by itself
</div>

??? question "Show Answer"
    The correct answer is **B**. The transpose of a matrix is obtained by interchanging its rows and columns. If $A$ is an $m \times n$ matrix, then $A^T$ is an $n \times m$ matrix where $(A^T)_{ij} = A_{ji}$.

    **Concept Tested:** Matrix Transpose

---

#### 4. A square matrix $A$ is invertible if and only if:

<div class="upper-alpha" markdown>
1. It is symmetric
2. Its determinant is non-zero
3. All diagonal elements are positive
4. It has more rows than columns
</div>

??? question "Show Answer"
    The correct answer is **B**. A square matrix is invertible (has an inverse) if and only if its determinant is non-zero. A zero determinant indicates the matrix is singular and maps some non-zero vectors to zero, making the transformation irreversible.

    **Concept Tested:** Matrix Inverse

---

#### 5. What is the identity matrix?

<div class="upper-alpha" markdown>
1. A matrix with all ones
2. A matrix with all zeros
3. A square matrix with ones on the diagonal and zeros elsewhere
4. A matrix that equals its transpose
</div>

??? question "Show Answer"
    The correct answer is **C**. The identity matrix $I$ is a square matrix with ones on the main diagonal and zeros elsewhere. It is the multiplicative identity for matrices: $AI = IA = A$ for any compatible matrix $A$.

    **Concept Tested:** Identity Matrix

---

#### 6. If $A$ is a $3 \times 2$ matrix and $B$ is a $2 \times 4$ matrix, what are the dimensions of $AB$?

<div class="upper-alpha" markdown>
1. $2 \times 2$
2. $3 \times 4$
3. $4 \times 3$
4. $3 \times 2$
</div>

??? question "Show Answer"
    The correct answer is **B**. For matrix multiplication $AB$ where $A$ is $3 \times 2$ and $B$ is $2 \times 4$, the inner dimensions (2) match, so multiplication is valid. The result has dimensions from the outer dimensions: $3 \times 4$.

    **Concept Tested:** Matrix Multiplication

---

#### 7. A symmetric matrix satisfies which condition?

<div class="upper-alpha" markdown>
1. $A = -A$
2. $A = A^T$
3. $A = A^{-1}$
4. $A = A^2$
</div>

??? question "Show Answer"
    The correct answer is **B**. A symmetric matrix equals its own transpose: $A = A^T$. This means $A_{ij} = A_{ji}$ for all $i, j$. Symmetric matrices have real eigenvalues and orthogonal eigenvectors.

    **Concept Tested:** Symmetric Matrix

---

#### 8. What does the rank of a matrix represent?

<div class="upper-alpha" markdown>
1. The number of rows in the matrix
2. The number of non-zero elements
3. The dimension of the column space (number of linearly independent columns)
4. The determinant value
</div>

??? question "Show Answer"
    The correct answer is **C**. The rank of a matrix is the dimension of its column space, which equals the number of linearly independent columns (or equivalently, rows). Rank indicates the effective dimensionality of the transformation the matrix represents.

    **Concept Tested:** Matrix Rank

---

#### 9. If $A^{-1}$ exists, what is $A \cdot A^{-1}$?

<div class="upper-alpha" markdown>
1. The zero matrix
2. The identity matrix
3. The transpose of $A$
4. $A$ squared
</div>

??? question "Show Answer"
    The correct answer is **B**. By definition, $A \cdot A^{-1} = A^{-1} \cdot A = I$, the identity matrix. The inverse "undoes" the transformation performed by the original matrix.

    **Concept Tested:** Matrix Inverse

---

#### 10. An orthogonal matrix $Q$ satisfies:

<div class="upper-alpha" markdown>
1. $Q^T = Q$
2. $Q^T = Q^{-1}$
3. $Q^2 = I$
4. $Q + Q^T = I$
</div>

??? question "Show Answer"
    The correct answer is **B**. An orthogonal matrix satisfies $Q^T = Q^{-1}$, which means $Q^TQ = QQ^T = I$. Orthogonal matrices preserve lengths and angles, representing rotations and reflections.

    **Concept Tested:** Orthogonal Matrix
