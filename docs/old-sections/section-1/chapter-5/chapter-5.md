# 📘 Chapter 5: Inner Products and Orthogonality

In the last chapter, we explored **independence** and **rank** — how vectors relate in terms of structure.  
Now, we expand our view to include **geometry**:  
> **How can we measure angles, distances, and projections between vectors?**

This chapter introduces **inner products**, **norms**, and the powerful idea of **orthogonality** — essential for understanding projections, least squares methods, and so much more.

---

## 5.1 The Inner Product

The **inner product** (also called the **dot product**) gives a way to "multiply" two vectors and produce a **single number**.

### Definition

For two vectors \(\mathbf{u}, \mathbf{v} \in \mathbb{R}^n\),
$$
\mathbf{u} \cdot \mathbf{v} = u_1v_1 + u_2v_2 + \cdots + u_nv_n
$$

**Example:**
$$
\mathbf{u} =
\begin{bmatrix}
1 \\\\ 2 \\\\ 3
\end{bmatrix},
\quad
\mathbf{v} =
\begin{bmatrix}
4 \\\\ 5 \\\\ 6
\end{bmatrix}
\quad \Rightarrow \quad
\mathbf{u} \cdot \mathbf{v} = 1\cdot4 + 2\cdot5 + 3\cdot6 = 32
$$

---

### Geometric Interpretation

The inner product relates to the **angle** \(\theta\) between vectors:
$$
\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta
$$

Thus:
- If \(\cos\theta > 0\), the vectors point generally **in the same direction**.
- If \(\cos\theta = 0\), the vectors are **orthogonal** (perpendicular).
- If \(\cos\theta < 0\), the vectors point **opposite** directions.

**Creative Analogy:**  
Think of the inner product as measuring **how much two vectors "agree" in direction** — like two people pushing an object: are they cooperating, conflicting, or independent?

---

## 5.2 Norm and Distance

Using the inner product, we can define a **norm**, which measures the **length** (or magnitude) of a vector.

### Norm (Length)

The norm of \(\mathbf{v}\) is:
$$
\|\mathbf{v}\| = \sqrt{\mathbf{v} \cdot \mathbf{v}}
$$

**Example:**
$$
\|\mathbf{v}\| = \sqrt{4^2 + 5^2 + 6^2} = \sqrt{77}
$$

**Why Norms Matter:**  
Norms allow us to measure **how big** a vector is — crucial for computing distances, speeds, and energy.

---

### Distance Between Vectors

The distance between \(\mathbf{u}\) and \(\mathbf{v}\) is:
$$
\|\mathbf{u} - \mathbf{v}\|
$$

It's simply the length of the vector from \(\mathbf{u}\) to \(\mathbf{v}\).

**Applications:**  
- In machine learning: measuring similarity between data points.
- In physics: measuring displacement.

---

## 5.3 Orthogonality

Two vectors are **orthogonal** if:
$$
\mathbf{u} \cdot \mathbf{v} = 0
$$

**Geometric Meaning:**  
They meet at a **90° angle** — they are **completely independent** directionally.

---

### Why Orthogonality Is Powerful

- **Simplifies Computations**: Orthogonal vectors are easier to work with — projections, decompositions, and optimizations become cleaner.
- **Decouples Systems**: In control systems or signal processing, orthogonal modes can be studied independently.
- **Basis for Least Squares**: Approximating solutions in "best fit" problems often uses orthogonality.

---

## 5.4 Orthogonal Projections

Sometimes, we want to **project** a vector onto another vector (or subspace).

### Projecting onto a Vector

Given a vector \(\mathbf{v}\) and a unit vector \(\mathbf{u}\), the projection of \(\mathbf{v}\) onto \(\mathbf{u}\) is:
$$
\text{proj}_{\mathbf{u}}(\mathbf{v}) = (\mathbf{v} \cdot \mathbf{u}) \mathbf{u}
$$

**Creative Picture:**  
Imagine shining a flashlight directly onto \(\mathbf{u}\) — the "shadow" of \(\mathbf{v}\) on \(\mathbf{u}\) is the projection.

---

### Example

Project \(\mathbf{v} = [3, 4]\) onto \(\mathbf{u} = [1, 0]\) (already a unit vector):

$$
\text{proj}_{\mathbf{u}}(\mathbf{v}) = (3\cdot1 + 4\cdot0) \times [1,0] = 3 [1,0] = [3,0]
$$

---

## 5.5 Orthogonal Complement

The **orthogonal complement** of a subspace \(W\) consists of **all vectors orthogonal to every vector in \(W\)**.

**Notation:**  
\(W^\perp\)

**Importance:**  
- It provides a way to "complete" spaces: everything not captured by \(W\) lies in \(W^\perp\).
- Essential for decomposition techniques like the Gram-Schmidt process.

---

## 5.6 Orthonormal Bases and Gram-Schmidt Process

### Orthonormal Basis

A set of vectors is **orthonormal** if:
- Each vector is a **unit vector** (\(\|\mathbf{v}\| = 1\)),
- Vectors are **mutually orthogonal**.

**Example:**
$$
\begin{bmatrix}
1 \\\\ 0
\end{bmatrix},
\begin{bmatrix}
0 \\\\ 1
\end{bmatrix}
$$
is an orthonormal basis for \(\mathbb{R}^2\).

---

### Gram-Schmidt Process

The **Gram-Schmidt process** converts any basis into an **orthonormal basis**.

**Outline:**
1. Start with a basis \( \{\mathbf{v}_1, \mathbf{v}_2, \dots\} \).
2. Orthogonalize:
   - Subtract projections onto earlier vectors.
3. Normalize:
   - Scale to unit length.

---

### Why Orthonormal Bases?

- Simplify calculations (e.g., finding coefficients in expansions).
- Critical for decompositions (QR decomposition, spectral methods).
- Basis for least squares approximations and many machine learning algorithms.

---

# 📚 Summary

In this chapter, you learned:

- The **inner product** measures alignment between vectors.
- The **norm** measures the size of a vector; the **distance** measures separation.
- **Orthogonal vectors** are directionally independent.
- **Projections** help decompose vectors into components along subspaces.
- **Orthonormal bases** are simple, efficient building blocks.
- **Gram-Schmidt** provides a systematic method for orthogonalization.

This geometric language makes linear algebra a powerful tool for **modeling, optimization, and approximation**.

---

# 🧠 Quiz
What is the result of projecting vector \( \mathbf{b} \) onto a unit vector \( \mathbf{u} \)?
<div class="upper-alpha" markdown>

A. \( \mathbf{b} \cdot \mathbf{u} \)

B. \( (\mathbf{b} \cdot \mathbf{u}) \mathbf{u} \)

C. \( \mathbf{u} \cdot \mathbf{u} \)

D. \( \mathbf{b} \cdot \mathbf{b} \)
</div>

??? Question "Show Answer"
    The correct answer is **B**.  
    The projection of \( \mathbf{b} \) onto a unit vector \( \mathbf{u} \) is \((\mathbf{b} \cdot \mathbf{u})\mathbf{u}\).
