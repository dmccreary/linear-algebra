# Chapter 11: Linear Systems in Control Theory

## Overview

In this chapter, we connect the dots between the abstract world of linear algebra and real-world dynamic systems. Specifically, we'll see how **state-space models** use matrices to represent, analyze, and design control systems in electrical engineering.

Understanding **controllability** and **observability** is crucial for engineers: if a system cannot be controlled or observed, then no amount of clever engineering will make it behave as desired. These ideas build directly on your earlier understanding of **vector spaces, matrix rank, eigenvalues,** and **transformations**.

---

## 11.1 State-Space Representation

Imagine trying to describe every possible behavior of a system like a robot arm or an electric motor. Instead of writing down countless equations, we **organize** everything neatly into matrices and vectors.

A **state-space model** expresses a system with two main equations:

$$
\dot{x}(t) = Ax(t) + Bu(t) \\\\
y(t) = Cx(t) + Du(t)
$$

Where:
- $x(t)$: **State vector** (describes the internal condition of the system)
- $u(t)$: **Input vector** (external signals we control)
- $y(t)$: **Output vector** (what we measure or observe)
- $A$, $B$, $C$, $D$: **Matrices** that define how states and inputs relate to state changes and outputs

### Why does this work?
Matrix multiplication naturally captures how multiple inputs affect multiple outputs simultaneously. Instead of writing separate equations for every variable, matrices elegantly compress all the relationships into a compact form.

> **Tip:** Think of $A$ as "how the system evolves," $B$ as "how inputs affect the system," $C$ as "how we observe the system," and $D$ as "direct influence of inputs on outputs."

---

## 11.2 Controllability

**Controllability** asks: *"Can we move the system to any desired state using available inputs?"*

To answer this, we use the **Controllability Matrix**:

$$
\mathcal{C} = \begin{bmatrix} B & AB & A^2B & \dots & A^{n-1}B \end{bmatrix}
$$

- If $\mathcal{C}$ has **full rank** (i.e., rank = number of states $n$), the system is **controllable**.

### Intuitive View
Picture a video game controller. If certain buttons are broken, you might not be able to move your character anywhere you want. Similarly, if $\mathcal{C}$ is missing "directions" (lacks rank), you can't steer the system to any state.

### How to check controllability
1. Form $\mathcal{C}$.
2. Compute its rank.
3. Compare to the number of states.

> **Example:**
> If $\mathcal{C}$ has rank 2 for a 2-state system, you're good. But if it only has rank 1, you can't reach every state.

---

## 11.3 Observability

**Observability** asks: *"Can we deduce the internal states from measurements?"*

To test this, use the **Observability Matrix**:

$$
\mathcal{O} = \begin{bmatrix} C \\\\ CA \\\\ CA^2 \\\\ \vdots \\\\ CA^{n-1} \end{bmatrix}
$$

- If $\mathcal{O}$ has **full rank**, the system is **observable**.

### Intuitive View
Imagine trying to figure out the position of a hidden car by only watching its shadow. If the light source and shadow don't reveal everything, you're missing vital information — the system is not fully observable.

### How to check observability
1. Form $\mathcal{O}$.
2. Compute its rank.
3. Compare to the number of states.

---

## 11.4 Kalman Decomposition

Sometimes, parts of a system are controllable and observable, while others aren't. The **Kalman Decomposition** reorganizes the system into blocks that separate these parts.

**Why is this useful?**
- You can focus on controllable/observable parts and ignore the rest.
- Simplifies design and analysis.

Kalman Decomposition uses special coordinate transformations (like changing basis in linear algebra) to reveal these hidden structures.

> **Note:** Kalman Decomposition relies heavily on understanding **matrix similarity transformations** from earlier chapters!

---

## 11.5 Transfer Function Representation

While state-space models are great for multiple-input, multiple-output (MIMO) systems, sometimes it's easier to think about how inputs are transformed into outputs **directly**.

The **Transfer Function** $G(s)$ relates input to output in the Laplace domain:

$$
G(s) = C(sI - A)^{-1}B + D
$$

- $s$ is a complex variable representing frequency.
- $(sI - A)^{-1}$ is the resolvent matrix that describes how system dynamics respond to inputs.

**How is this helpful?**
- Transfer functions give direct frequency response.
- Easier to design filters and controllers for single-input, single-output (SISO) systems.

> **Tip:** Transfer Functions are like "black box" descriptions, while state-space models are "white box" internal blueprints.

---

# Chapter 11 Quiz

#### Quiz: Controllability

Which matrix determines whether all states of a system can be influenced by the input?

<div class="upper-alpha" markdown>
A. Observability Matrix  
B. Controllability Matrix  
C. Transfer Function Matrix  
D. State Transition Matrix
</div>

??? Question "Show Answer"
    The correct answer is **B**. The **Controllability Matrix** evaluates if the system can reach any state using suitable input sequences. Full rank controllability ensures maximum maneuverability of the system.

---

# ✨ Coming Up Next

In the next chapter, we'll build on this foundation by learning how to **assess and design stability and feedback control mechanisms**, ensuring that not only can we control a system but that it behaves well over time!

