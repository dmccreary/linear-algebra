# Quiz: Systems of Linear Equations

Test your understanding of solving linear systems and related concepts.

---

#### 1. What is the matrix equation form of a system of linear equations?

<div class="upper-alpha" markdown>
1. $A + \mathbf{x} = \mathbf{b}$
2. $A\mathbf{x} = \mathbf{b}$
3. $\mathbf{x}A = \mathbf{b}$
4. $A\mathbf{b} = \mathbf{x}$
</div>

??? question "Show Answer"
    The correct answer is **B**. A system of linear equations can be written as $A\mathbf{x} = \mathbf{b}$, where $A$ is the coefficient matrix, $\mathbf{x}$ is the vector of unknowns, and $\mathbf{b}$ is the vector of constants.

    **Concept Tested:** Matrix Equation

---

#### 2. What is the purpose of Gaussian elimination?

<div class="upper-alpha" markdown>
1. To compute the determinant of a matrix
2. To transform a matrix to row echelon form for solving linear systems
3. To find the eigenvalues of a matrix
4. To compute the transpose of a matrix
</div>

??? question "Show Answer"
    The correct answer is **B**. Gaussian elimination transforms a matrix (or augmented matrix) to row echelon form using elementary row operations. This simplifies the system so that solutions can be found through back substitution.

    **Concept Tested:** Gaussian Elimination

---

#### 3. A system of linear equations has infinitely many solutions when:

<div class="upper-alpha" markdown>
1. The coefficient matrix is square
2. There are more unknowns than equations and the system is consistent
3. The determinant of the coefficient matrix is non-zero
4. All equations are identical
</div>

??? question "Show Answer"
    The correct answer is **B**. A system has infinitely many solutions when it is consistent (at least one solution exists) but has free variables—typically when there are more unknowns than independent equations, or when rows become zero during elimination.

    **Concept Tested:** Solution Types

---

#### 4. What is row echelon form?

<div class="upper-alpha" markdown>
1. A matrix where all elements are in ascending order
2. A matrix with a staircase pattern of leading ones and zeros below them
3. A diagonal matrix
4. A matrix equal to its transpose
</div>

??? question "Show Answer"
    The correct answer is **B**. Row echelon form has a staircase pattern: each row's leading entry (pivot) is to the right of the row above it, and all entries below each pivot are zero. This form enables back substitution.

    **Concept Tested:** Row Echelon Form

---

#### 5. What does it mean for a system to be inconsistent?

<div class="upper-alpha" markdown>
1. The system has exactly one solution
2. The system has infinitely many solutions
3. The system has no solution
4. The system has negative solutions
</div>

??? question "Show Answer"
    The correct answer is **C**. An inconsistent system has no solution—the equations are contradictory. This occurs when row reduction produces a row like $[0, 0, \ldots, 0 | c]$ where $c \neq 0$, representing $0 = c$.

    **Concept Tested:** Consistent vs Inconsistent Systems

---

#### 6. LU decomposition factors a matrix $A$ as:

<div class="upper-alpha" markdown>
1. $A = L + U$
2. $A = LU$ where $L$ is lower triangular and $U$ is upper triangular
3. $A = L^TU^T$
4. $A = U^{-1}L^{-1}$
</div>

??? question "Show Answer"
    The correct answer is **B**. LU decomposition factors a matrix as $A = LU$, where $L$ is a lower triangular matrix (with ones on the diagonal in Doolittle form) and $U$ is an upper triangular matrix. This is useful for efficiently solving multiple systems with the same coefficient matrix.

    **Concept Tested:** LU Decomposition

---

#### 7. What is back substitution used for?

<div class="upper-alpha" markdown>
1. Converting a matrix to row echelon form
2. Solving a triangular system by working from the last equation upward
3. Computing the inverse of a matrix
4. Finding the determinant
</div>

??? question "Show Answer"
    The correct answer is **B**. Back substitution solves an upper triangular system by starting with the last equation (which has only one unknown), solving for that variable, then substituting back into previous equations to find remaining unknowns.

    **Concept Tested:** Back Substitution

---

#### 8. The least squares solution minimizes:

<div class="upper-alpha" markdown>
1. The number of variables
2. The sum of squared residuals $\|A\mathbf{x} - \mathbf{b}\|^2$
3. The determinant of the coefficient matrix
4. The condition number
</div>

??? question "Show Answer"
    The correct answer is **B**. The least squares solution finds the $\mathbf{x}$ that minimizes the squared error $\|A\mathbf{x} - \mathbf{b}\|^2$. This is essential for overdetermined systems (more equations than unknowns) where an exact solution may not exist.

    **Concept Tested:** Least Squares

---

#### 9. Which matrix operation is NOT an elementary row operation?

<div class="upper-alpha" markdown>
1. Swapping two rows
2. Multiplying a row by a non-zero scalar
3. Adding a multiple of one row to another
4. Taking the transpose of a row
</div>

??? question "Show Answer"
    The correct answer is **D**. The three elementary row operations are: (1) swapping two rows, (2) multiplying a row by a non-zero scalar, and (3) adding a multiple of one row to another. Transposing is not an elementary row operation.

    **Concept Tested:** Elementary Row Operations

---

#### 10. The normal equations for least squares are:

<div class="upper-alpha" markdown>
1. $A\mathbf{x} = \mathbf{b}$
2. $A^TA\mathbf{x} = A^T\mathbf{b}$
3. $AA^T\mathbf{x} = \mathbf{b}$
4. $A^{-1}\mathbf{b} = \mathbf{x}$
</div>

??? question "Show Answer"
    The correct answer is **B**. The normal equations $A^TA\mathbf{x} = A^T\mathbf{b}$ are derived by setting the gradient of the squared error to zero. They provide the least squares solution when $A^TA$ is invertible.

    **Concept Tested:** Normal Equations
