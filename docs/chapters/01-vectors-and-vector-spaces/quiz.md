# Quiz: Vectors and Vector Spaces

Test your understanding of vectors, vector operations, and vector space fundamentals.

---

#### 1. What is a vector in the context of linear algebra?

<div class="upper-alpha" markdown>
1. A single number representing magnitude
2. An ordered collection of numbers representing magnitude and direction
3. A matrix with only one row
4. A geometric shape with four sides
</div>

??? question "Show Answer"
    The correct answer is **B**. A vector is an ordered collection of numbers (components) that represents both magnitude and direction. Unlike scalars which are single numbers, vectors have multiple components that together define a quantity in multi-dimensional space.

    **Concept Tested:** Vector

---

#### 2. Which operation produces a scalar result from two vectors?

<div class="upper-alpha" markdown>
1. Vector addition
2. Scalar multiplication
3. Dot product
4. Cross product
</div>

??? question "Show Answer"
    The correct answer is **C**. The dot product (also called inner product or scalar product) of two vectors produces a scalar value. It is computed as the sum of the products of corresponding components: $\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^n a_i b_i$.

    **Concept Tested:** Dot Product

---

#### 3. What does the L2 norm (Euclidean norm) of a vector measure?

<div class="upper-alpha" markdown>
1. The number of non-zero components
2. The sum of all component values
3. The length or magnitude of the vector
4. The angle between the vector and the x-axis
</div>

??? question "Show Answer"
    The correct answer is **C**. The L2 norm (Euclidean norm) measures the length or magnitude of a vector in Euclidean space. It is computed as $\|\mathbf{v}\|_2 = \sqrt{\sum_{i=1}^n v_i^2}$, which corresponds to the geometric distance from the origin to the vector's endpoint.

    **Concept Tested:** Euclidean Norm

---

#### 4. Two vectors are orthogonal when their dot product equals:

<div class="upper-alpha" markdown>
1. One
2. Zero
3. Negative one
4. Their product of magnitudes
</div>

??? question "Show Answer"
    The correct answer is **B**. Two vectors are orthogonal (perpendicular) when their dot product equals zero. This is because $\mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\| \|\mathbf{b}\| \cos\theta$, and when $\theta = 90°$, $\cos(90°) = 0$.

    **Concept Tested:** Orthogonality

---

#### 5. What is a unit vector?

<div class="upper-alpha" markdown>
1. A vector with all components equal to one
2. A vector with magnitude equal to one
3. The first vector in a basis
4. A vector pointing in the positive x-direction
</div>

??? question "Show Answer"
    The correct answer is **B**. A unit vector is a vector with magnitude (norm) equal to one. Any non-zero vector can be converted to a unit vector by dividing it by its magnitude: $\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$. Unit vectors indicate direction without magnitude.

    **Concept Tested:** Unit Vector

---

#### 6. What is a linear combination of vectors?

<div class="upper-alpha" markdown>
1. Adding vectors without any scaling
2. Multiplying all vectors together
3. Scaling vectors by scalars and then adding them
4. Taking the dot product of multiple vectors
</div>

??? question "Show Answer"
    The correct answer is **C**. A linear combination of vectors involves scaling each vector by a scalar coefficient and then summing the results: $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_n\mathbf{v}_n$. This is a fundamental operation in linear algebra used to create new vectors from existing ones.

    **Concept Tested:** Linear Combination

---

#### 7. A set of vectors is linearly independent if:

<div class="upper-alpha" markdown>
1. All vectors are orthogonal to each other
2. No vector can be written as a linear combination of the others
3. All vectors have the same magnitude
4. The vectors point in different directions
</div>

??? question "Show Answer"
    The correct answer is **B**. Vectors are linearly independent if no vector in the set can be expressed as a linear combination of the others. Equivalently, the only solution to $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_n\mathbf{v}_n = \mathbf{0}$ is $c_1 = c_2 = \cdots = c_n = 0$.

    **Concept Tested:** Linear Independence

---

#### 8. Given vectors $\mathbf{a} = [3, 4]$ and $\mathbf{b} = [1, 2]$, what is $\mathbf{a} \cdot \mathbf{b}$?

<div class="upper-alpha" markdown>
1. 7
2. 10
3. 11
4. 14
</div>

??? question "Show Answer"
    The correct answer is **C**. The dot product is computed as $\mathbf{a} \cdot \mathbf{b} = (3)(1) + (4)(2) = 3 + 8 = 11$. The dot product sums the products of corresponding components.

    **Concept Tested:** Dot Product

---

#### 9. The span of a set of vectors is:

<div class="upper-alpha" markdown>
1. The largest vector in the set
2. The set of all possible linear combinations of those vectors
3. The number of vectors in the set
4. The sum of all vector magnitudes
</div>

??? question "Show Answer"
    The correct answer is **B**. The span of a set of vectors is the set of all vectors that can be created through linear combinations of those vectors. It represents all points reachable by scaling and adding the original vectors.

    **Concept Tested:** Span

---

#### 10. What is the dimension of a vector space?

<div class="upper-alpha" markdown>
1. The largest component value among all vectors
2. The number of vectors in the space
3. The number of vectors in a basis for the space
4. The magnitude of the longest vector
</div>

??? question "Show Answer"
    The correct answer is **C**. The dimension of a vector space is the number of vectors in any basis for that space. All bases of a given vector space have the same number of vectors, which defines the dimension. For example, $\mathbb{R}^3$ has dimension 3.

    **Concept Tested:** Dimension
