# Quiz: Linear Transformations

Test your understanding of linear transformations and their properties.

---

#### 1. A transformation $T$ is linear if it satisfies:

<div class="upper-alpha" markdown>
1. $T(\mathbf{x} + \mathbf{y}) = T(\mathbf{x}) + T(\mathbf{y})$ and $T(c\mathbf{x}) = cT(\mathbf{x})$
2. $T(\mathbf{x}) = \mathbf{x}$ for all $\mathbf{x}$
3. $T(\mathbf{x}) \cdot T(\mathbf{y}) = T(\mathbf{x} \cdot \mathbf{y})$
4. $T(\mathbf{0}) \neq \mathbf{0}$
</div>

??? question "Show Answer"
    The correct answer is **A**. A linear transformation satisfies two properties: additivity $T(\mathbf{x} + \mathbf{y}) = T(\mathbf{x}) + T(\mathbf{y})$ and homogeneity $T(c\mathbf{x}) = cT(\mathbf{x})$. These can be combined as $T(a\mathbf{x} + b\mathbf{y}) = aT(\mathbf{x}) + bT(\mathbf{y})$.

    **Concept Tested:** Linear Transformation

---

#### 2. Every linear transformation can be represented by:

<div class="upper-alpha" markdown>
1. A scalar
2. A vector
3. A matrix
4. A polynomial
</div>

??? question "Show Answer"
    The correct answer is **C**. Every linear transformation between finite-dimensional vector spaces can be represented by a matrix. For $T: \mathbb{R}^n \to \mathbb{R}^m$, there exists a unique $m \times n$ matrix $A$ such that $T(\mathbf{x}) = A\mathbf{x}$.

    **Concept Tested:** Matrix Representation

---

#### 3. What is the kernel (null space) of a linear transformation?

<div class="upper-alpha" markdown>
1. The set of all possible outputs
2. The set of all inputs that map to the zero vector
3. The identity transformation
4. The inverse transformation
</div>

??? question "Show Answer"
    The correct answer is **B**. The kernel (or null space) of a linear transformation $T$ is the set of all vectors $\mathbf{x}$ such that $T(\mathbf{x}) = \mathbf{0}$. It measures the "collapse" in the transformation.

    **Concept Tested:** Kernel

---

#### 4. The image (range) of a linear transformation is:

<div class="upper-alpha" markdown>
1. The set of all inputs
2. The set of all possible outputs
3. The zero vector
4. The inverse of the kernel
</div>

??? question "Show Answer"
    The correct answer is **B**. The image (or range) of a linear transformation is the set of all possible outputs—all vectors that can be reached by applying the transformation to some input. It equals the column space of the matrix representation.

    **Concept Tested:** Image

---

#### 5. A rotation in 2D by angle $\theta$ counterclockwise is represented by:

<div class="upper-alpha" markdown>
1. $\begin{bmatrix} \cos\theta & \sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$
2. $\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$
3. $\begin{bmatrix} \sin\theta & \cos\theta \\ -\cos\theta & \sin\theta \end{bmatrix}$
4. $\begin{bmatrix} \theta & 0 \\ 0 & \theta \end{bmatrix}$
</div>

??? question "Show Answer"
    The correct answer is **B**. The standard 2D rotation matrix for counterclockwise rotation by angle $\theta$ is $\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$. This preserves lengths and rotates vectors by the specified angle.

    **Concept Tested:** Rotation Transformation

---

#### 6. A linear transformation is injective (one-to-one) if and only if:

<div class="upper-alpha" markdown>
1. Its image is the entire codomain
2. Its kernel contains only the zero vector
3. It is represented by a square matrix
4. It preserves the dot product
</div>

??? question "Show Answer"
    The correct answer is **B**. A linear transformation is injective if and only if its kernel is trivial (contains only $\mathbf{0}$). This means different inputs always produce different outputs—no two distinct vectors map to the same output.

    **Concept Tested:** Injective Transformation

---

#### 7. Which transformation scales a vector by 2 in the x-direction only?

<div class="upper-alpha" markdown>
1. $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$
2. $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$
3. $\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$
4. $\begin{bmatrix} 0 & 2 \\ 2 & 0 \end{bmatrix}$
</div>

??? question "Show Answer"
    The correct answer is **B**. The matrix $\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$ scales the x-component by 2 while leaving the y-component unchanged. This is a non-uniform scaling (stretching) transformation.

    **Concept Tested:** Scaling Transformation

---

#### 8. The composition of two linear transformations $T_1$ and $T_2$ corresponds to:

<div class="upper-alpha" markdown>
1. Adding their matrices
2. Multiplying their matrices
3. Finding the inverse of their matrices
4. Taking the transpose of their matrices
</div>

??? question "Show Answer"
    The correct answer is **B**. The composition of linear transformations corresponds to matrix multiplication. If $T_1$ is represented by $A$ and $T_2$ by $B$, then $T_2 \circ T_1$ (apply $T_1$ first, then $T_2$) is represented by $BA$.

    **Concept Tested:** Composition of Transformations

---

#### 9. A reflection across the x-axis is represented by:

<div class="upper-alpha" markdown>
1. $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$
2. $\begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$
3. $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$
4. $\begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}$
</div>

??? question "Show Answer"
    The correct answer is **A**. The matrix $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ reflects vectors across the x-axis by negating the y-component while preserving the x-component.

    **Concept Tested:** Reflection Transformation

---

#### 10. A shear transformation in the x-direction:

<div class="upper-alpha" markdown>
1. Rotates vectors around the origin
2. Scales all vectors uniformly
3. Shifts x-coordinates proportionally to y-coordinates
4. Projects vectors onto the x-axis
</div>

??? question "Show Answer"
    The correct answer is **C**. A shear in the x-direction shifts x-coordinates by an amount proportional to the y-coordinate, represented by $\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$. This slants rectangles into parallelograms while preserving area.

    **Concept Tested:** Shear Transformation
