# Quiz: Vector Spaces and Inner Products

Test your understanding of abstract vector spaces and inner product concepts.

---

#### 1. A set $V$ is a vector space if it satisfies:

<div class="upper-alpha" markdown>
1. Contains only numerical vectors
2. Is closed under vector addition and scalar multiplication with 8 axioms satisfied
3. Contains exactly three vectors
4. Has a unique basis
</div>

??? question "Show Answer"
    The correct answer is **B**. A vector space must be closed under vector addition and scalar multiplication, and satisfy eight axioms including associativity, commutativity of addition, existence of zero vector, and distributive laws.

    **Concept Tested:** Vector Space Axioms

---

#### 2. A subspace of a vector space must:

<div class="upper-alpha" markdown>
1. Have the same dimension as the parent space
2. Contain the zero vector and be closed under addition and scalar multiplication
3. Be finite-dimensional
4. Contain at least two vectors
</div>

??? question "Show Answer"
    The correct answer is **B**. A subspace must contain the zero vector and be closed under vector addition and scalar multiplication. These conditions ensure the subspace is itself a vector space under the inherited operations.

    **Concept Tested:** Subspace

---

#### 3. An inner product $\langle \mathbf{u}, \mathbf{v} \rangle$ must satisfy all EXCEPT:

<div class="upper-alpha" markdown>
1. Linearity in the first argument
2. Conjugate symmetry
3. Positive definiteness
4. Multiplicativity: $\langle \mathbf{u}, \mathbf{v} \rangle = \langle \mathbf{u} \rangle \cdot \langle \mathbf{v} \rangle$
</div>

??? question "Show Answer"
    The correct answer is **D**. Inner products require linearity (in first argument for real, conjugate-linear in second for complex), conjugate symmetry $\langle \mathbf{u}, \mathbf{v} \rangle = \overline{\langle \mathbf{v}, \mathbf{u} \rangle}$, and positive definiteness. There is no multiplicativity requirement.

    **Concept Tested:** Inner Product Properties

---

#### 4. The standard inner product in $\mathbb{R}^n$ is:

<div class="upper-alpha" markdown>
1. The sum of vector components
2. The dot product $\mathbf{u} \cdot \mathbf{v} = \sum u_i v_i$
3. The cross product
4. The Euclidean distance
</div>

??? question "Show Answer"
    The correct answer is **B**. The standard inner product in $\mathbb{R}^n$ is the dot product: $\langle \mathbf{u}, \mathbf{v} \rangle = \mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^n u_i v_i$. It induces the Euclidean norm.

    **Concept Tested:** Standard Inner Product

---

#### 5. An orthonormal basis has vectors that are:

<div class="upper-alpha" markdown>
1. Parallel and of any length
2. Mutually orthogonal and each with unit length
3. Linearly dependent
4. All equal to each other
</div>

??? question "Show Answer"
    The correct answer is **B**. An orthonormal basis consists of vectors that are mutually orthogonal (pairwise dot product is zero) and each normalized to unit length. This makes coordinate representation and computation especially convenient.

    **Concept Tested:** Orthonormal Basis

---

#### 6. The projection of vector $\mathbf{u}$ onto vector $\mathbf{v}$ is:

<div class="upper-alpha" markdown>
1. $\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2} \mathbf{v}$
2. $\mathbf{u} + \mathbf{v}$
3. $\mathbf{u} \times \mathbf{v}$
4. $\|\mathbf{u}\| \|\mathbf{v}\|$
</div>

??? question "Show Answer"
    The correct answer is **A**. The orthogonal projection of $\mathbf{u}$ onto $\mathbf{v}$ is $\text{proj}_{\mathbf{v}}\mathbf{u} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2} \mathbf{v}$. This gives the component of $\mathbf{u}$ in the direction of $\mathbf{v}$.

    **Concept Tested:** Orthogonal Projection

---

#### 7. The orthogonal complement of a subspace $W$ contains:

<div class="upper-alpha" markdown>
1. All vectors parallel to $W$
2. All vectors orthogonal to every vector in $W$
3. Only the zero vector
4. The basis vectors of $W$
</div>

??? question "Show Answer"
    The correct answer is **B**. The orthogonal complement $W^\perp$ consists of all vectors that are orthogonal to every vector in $W$. For any $\mathbf{u} \in W^\perp$ and $\mathbf{w} \in W$, we have $\langle \mathbf{u}, \mathbf{w} \rangle = 0$.

    **Concept Tested:** Orthogonal Complement

---

#### 8. The Cauchy-Schwarz inequality states:

<div class="upper-alpha" markdown>
1. $|\langle \mathbf{u}, \mathbf{v} \rangle| \leq \|\mathbf{u}\| \|\mathbf{v}\|$
2. $\|\mathbf{u} + \mathbf{v}\| = \|\mathbf{u}\| + \|\mathbf{v}\|$
3. $\langle \mathbf{u}, \mathbf{v} \rangle = \|\mathbf{u}\|^2$
4. $\|\mathbf{u} - \mathbf{v}\| > \|\mathbf{u}\|$
</div>

??? question "Show Answer"
    The correct answer is **A**. The Cauchy-Schwarz inequality bounds the inner product: $|\langle \mathbf{u}, \mathbf{v} \rangle| \leq \|\mathbf{u}\| \|\mathbf{v}\|$. Equality holds if and only if the vectors are parallel.

    **Concept Tested:** Cauchy-Schwarz Inequality

---

#### 9. An inner product space is:

<div class="upper-alpha" markdown>
1. A vector space with a defined inner product
2. A space containing only unit vectors
3. A subspace of $\mathbb{R}^3$
4. A space with no zero vector
</div>

??? question "Show Answer"
    The correct answer is **A**. An inner product space is a vector space equipped with an inner product function that satisfies the required axioms. This structure enables defining lengths, angles, and orthogonality.

    **Concept Tested:** Inner Product Space

---

#### 10. The angle $\theta$ between two non-zero vectors is determined by:

<div class="upper-alpha" markdown>
1. $\cos\theta = \|\mathbf{u}\| + \|\mathbf{v}\|$
2. $\cos\theta = \frac{\langle \mathbf{u}, \mathbf{v} \rangle}{\|\mathbf{u}\| \|\mathbf{v}\|}$
3. $\theta = \mathbf{u} \cdot \mathbf{v}$
4. $\sin\theta = \frac{\|\mathbf{u}\|}{\|\mathbf{v}\|}$
</div>

??? question "Show Answer"
    The correct answer is **B**. The angle between vectors is given by $\cos\theta = \frac{\langle \mathbf{u}, \mathbf{v} \rangle}{\|\mathbf{u}\| \|\mathbf{v}\|}$. This generalizes the geometric definition of angle to any inner product space.

    **Concept Tested:** Angle Between Vectors
