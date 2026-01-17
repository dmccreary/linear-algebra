# 📘 Chapter 3: Vector Spaces and Subspaces

In Chapters 1 and 2, we explored **scalars**, **vectors**, **matrices**, and how to operate on them.  
Now, we shift our focus to something deeper: **spaces** built from vectors.

This chapter unlocks a profound idea: **vectors aren't isolated — they live in vast, structured universes called vector spaces**. Understanding these spaces is essential for everything from solving systems of equations to building machine learning models.

---

## 3.1 What is a Vector Space?

A **vector space** is a **collection of vectors** where you can:
- **Add** any two vectors and stay inside the space.
- **Scale** any vector by a scalar and stay inside the space.

In short: **add and stretch without leaving**.

**Formal Definition:**  
A set \(V\) is a vector space over a field (like \(\mathbb{R}\) for real numbers) if it satisfies:
- **Closure under addition and scalar multiplication**,
- **Existence of a zero vector** (an "origin"),
- **Existence of additive inverses** (every vector has a "negative" vector),
- and other technical properties (like associativity, distributivity).

**Example 1:**  
All 2D vectors \((x, y)\) where \(x, y\in\mathbb{R}\) form a vector space: \(\mathbb{R}^2\).

**Example 2:**  
All 3D vectors \((x, y, z)\) where \(x, y, z\in\mathbb{R}\) form \(\mathbb{R}^3\).

---

## 3.2 Subspaces

A **subspace** is simply a **vector space within another vector space**.

**Criteria for a Subspace:**  
A subset \(W\) of a vector space \(V\) is a subspace if:
1. The **zero vector** is in \(W\),
2. \(W\) is **closed under addition**,
3. \(W\) is **closed under scalar multiplication**.

**Example:**  
In \(\mathbb{R}^3\), the set of all vectors of the form \((x, 0, 0)\) (i.e., lying on the \(x\)-axis) is a subspace.

**Why Subspaces Matter:**  
Subspaces capture **constrained movement**: movement along a line, inside a plane, or through a lower-dimensional world embedded inside a bigger space.

**Creative Analogy:**  
Imagine a vector space like a **giant 3D room**.  
Subspaces are like **wires, sheets, or corners** inside the room where all action is confined!

---

## 3.3 Span

The **span** of a set of vectors is the **smallest subspace** containing them — it's **everything you can build** by adding and scaling those vectors.

**Example:**  
If you have vectors:
$$
\mathbf{v}_1 =
\begin{bmatrix}
1 \\\\
0
\end{bmatrix}
, \quad
\mathbf{v}_2 =
\begin{bmatrix}
0 \\\\
1
\end{bmatrix}
$$
in \(\mathbb{R}^2\), then their span is the **entire plane** \(\mathbb{R}^2\).

**Why Span?**  
When you ask, "What directions can I move using just these vectors?" — you are really asking about the span.

---

## 3.4 Basis and Dimension

A **basis** is a **minimal set of vectors** that:
- **Span** the space,
- Are **linearly independent** (none of them is redundant).

**Example:**  
$$
\{
\begin{bmatrix}
1 \\\\
0
\end{bmatrix},
\begin{bmatrix}
0 \\\\
1
\end{bmatrix}
\}
$$
is a basis for \(\mathbb{R}^2\).

**Dimension:**  
The **dimension** of a vector space is the **number of vectors in any basis**.

Thus:
- \(\mathbb{R}^2\) has dimension 2,
- \(\mathbb{R}^3\) has dimension 3,
- A line through the origin in \(\mathbb{R}^3\) has dimension 1.

**Creative Analogy:**  
If the vector space is a world, the basis vectors are its **fundamental directions** — the minimum GPS instructions you need to navigate everywhere!

---

## 3.5 Row Space, Column Space, and Null Space

When dealing with a matrix \(A\), we encounter three critical subspaces:

### Row Space

The space spanned by the **rows** of \(A\).

- It tells us about **relationships among equations**.
- Lives in \(\mathbb{R}^n\) if \(A\) has \(n\) columns.

### Column Space

The space spanned by the **columns** of \(A\).

- It represents all **possible outputs** of the system \(A\mathbf{x}\).
- Lives in \(\mathbb{R}^m\) if \(A\) has \(m\) rows.

### Null Space (Kernel)

The set of all vectors \(\mathbf{x}\) such that:
$$
A\mathbf{x} = \mathbf{0}
$$

- It captures all the **"invisible" directions** — inputs that produce zero output.
- Tells us about **solutions to homogeneous systems**.

---

## 3.6 Why This Chapter Matters

Understanding vector spaces and subspaces helps you:

- **Solve systems more intelligently** (using dimensions and bases),
- **Analyze models** (like feature spaces in machine learning),
- **Simplify problems** (by recognizing redundancies and patterns).

**Link to Previous Chapters:**  
Everything we've learned about vectors and matrices now deepens:  
Instead of just manipulating individual objects, you begin to **analyze entire worlds** formed by them.

**Forward Connection:**  
In the next chapter, we'll ask **how to tell** if vectors are **independent** or **redundant** — leading us into **linear independence and rank**.

---

# 📚 Summary

In this chapter, you learned:

- **Vector spaces** are collections of vectors closed under addition and scaling.
- **Subspaces** are smaller spaces inside vector spaces, satisfying similar rules.
- The **span** of a set of vectors is all combinations you can build from them.
- A **basis** is a minimal spanning set; the **dimension** counts its vectors.
- Matrices naturally give rise to **row space**, **column space**, and **null space**.

These ideas create a bridge from basic matrix operations to the beautiful architecture of linear systems and transformations.

---

# 🧠 Quiz
Which of the following sets is a subspace of ℝ³?
<div class="upper-alpha" markdown>
A. All vectors with \(x + y + z = 1\)

B. All vectors with \(x = y = z\)

C. All vectors with \(x^2 + y^2 + z^2 < 1\)

D. All unit vectors in ℝ³
</div>

??? Question "Show Answer"
    The correct answer is **B**.  
    The set of all vectors where \(x = y = z\) is a subspace: it contains the zero vector, is closed under addition, and is closed under scalar multiplication.  
    Sets defined by non-homogeneous conditions (like \(x + y + z = 1\)) or norm constraints (like unit vectors) are **not subspaces**.
