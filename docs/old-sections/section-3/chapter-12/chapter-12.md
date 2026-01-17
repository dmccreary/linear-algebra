# Chapter 12: System Stability and Feedback

## Overview

Building upon Chapter 11's foundation in state-space modeling, this chapter dives into ensuring **systems not only move but behave well over time**. We will explore how **stability** and **feedback** strategies are designed using linear algebra. These ideas are essential — a controllable system that is unstable is like a rocket ship you can steer but can't keep from exploding!

Understanding how eigenvalues (from earlier eigenanalysis topics) control system behavior will become your main tool here.

---

## 12.1 Stability of State-Space Systems

In simple terms, a **stable system** tends to return to equilibrium after a disturbance.

For a continuous-time system:

$$
\dot{x}(t) = Ax(t)
$$

the stability depends entirely on the **eigenvalues of the matrix A**.

### Stability Conditions
- **Stable**: All eigenvalues have negative real parts.
- **Unstable**: Any eigenvalue has a positive real part.
- **Marginally Stable**: Eigenvalues are purely imaginary (on the imaginary axis), and no repeated eigenvalues.

### Why Eigenvalues?
Each eigenvalue corresponds to a natural mode of the system. If the real part of an eigenvalue is positive, it describes a mode that grows exponentially over time — leading to instability.

> **Tip:** Think of eigenvalues as "behavior seeds" planted inside the system. If they are healthy (negative real parts), the system calms down. If they are poisonous (positive real parts), the system spirals out of control.

---

## 12.2 Feedback Control

Sometimes, a system isn't stable by itself — but we can **add feedback** to stabilize it!

Feedback means using the output (or state) to influence the input.

A simple **state feedback control law** is:

$$
 u(t) = -Kx(t)
$$

where $K$ is the **feedback gain matrix**.

Substituting this into the state equation gives:

$$
\dot{x}(t) = (A - BK)x(t)
$$

### Why Feedback Works
By choosing $K$ wisely, we modify the system matrix from $A$ to $A - BK$. This new matrix can have **different eigenvalues**, meaning we can *move* the natural behaviors of the system toward stability.

---

## 12.3 Pole Placement

**Pole placement** is the art of designing $K$ so that the closed-loop system $A - BK$ has desired eigenvalues (poles).

### Procedure
1. Decide where you want the eigenvalues (e.g., all with large negative real parts for fast decay).
2. Solve for $K$ that achieves those eigenvalues.

**Key Requirement:**
- The system must be **controllable** (see Chapter 11) to place poles arbitrarily.

### How it connects
Remember: eigenvalues were first studied in basic matrix theory. Now, they determine real-world system behavior, and we actively design matrices to control them!

> **Example:**
> If you want a motor to settle to rest quickly after a bump, you design $K$ to place poles far into the left half-plane.

---

## 12.4 Linear Quadratic Regulator (LQR)

Sometimes, just placing poles isn't enough — we want to **optimize** performance by balancing goals:
- Make the system respond quickly
- Avoid using huge control inputs (which could burn out hardware)

The **Linear Quadratic Regulator (LQR)** solves this optimization problem:

Minimize the cost function:

$$
J = \int_0^\infty \left( x(t)^T Q x(t) + u(t)^T R u(t) \right) dt
$$

where:
- $Q$ penalizes bad states.
- $R$ penalizes control effort.

The resulting **optimal feedback gain** $K$ satisfies an equation called the **Riccati equation**.

### Why use LQR?
- **Energy efficiency**: Control effort is minimized.
- **Performance guarantee**: System stabilizes optimally according to a clear cost.

> **Tip:** LQR uses matrix optimization to find the "best" $K$ rather than just "any" $K$.

---

## 12.5 SVD Applications in Control

The **Singular Value Decomposition (SVD)**, introduced earlier, also plays a powerful role in control theory.

SVD helps in:
- Diagnosing poorly controllable or observable directions.
- Designing **robust controllers** when certain inputs/outputs are weakly connected.
- Understanding how sensitive a system is to disturbances.

### How it fits in
SVD breaks a matrix into "stretching" and "rotating" components — revealing hidden structure. When applying feedback, it helps identify which directions are easy or hard to control.

> **Example:**
> If an SVD shows a very small singular value, you know there are directions where the system reacts sluggishly — caution is needed in control design.

---

# Chapter 12 Quiz

#### Quiz: Feedback Control

What is the primary goal of feedback control in a dynamic system?

<div class="upper-alpha" markdown>
A. Increase computational load  
B. Stabilize the system and improve performance  
C. Make the system uncontrollable  
D. Remove all external inputs
</div>

??? Question "Show Answer"
    The correct answer is **B**. **Feedback control** modifies the system dynamics to ensure stability, enhance performance, and meet design specifications even in the presence of disturbances or uncertainties.

---

# ✨ Coming Up Next

In Chapter 13, we'll extend our control theory knowledge by learning how to **model dynamic systems over time** using matrix exponentiation and **simplify complex systems** without losing essential behavior.

