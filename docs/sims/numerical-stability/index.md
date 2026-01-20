---
title: Numerical Stability Demonstration
description: Explore how ill-conditioned systems amplify small input errors into large solution changes
image: /sims/numerical-stability/numerical-stability.png
---
# Numerical Stability Demonstration

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Numerical Stability MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/9uumXs7-4)

## About This MicroSim

When solving systems of linear equations on a computer, small errors in the input can sometimes cause large errors in the output. This phenomenon is governed by the **condition number** of the matrix—a fundamental concept in numerical linear algebra that every practitioner must understand.

This MicroSim allows you to experiment with different types of systems and see firsthand how tiny perturbations in the matrix coefficients or right-hand side vector can dramatically change the solution.

### What You'll See

The simulation displays:

- **Original System** (left): The unperturbed augmented matrix $[A | b]$ with its exact solution
- **Perturbed System** (right): The same system with small random changes applied, showing the new solution
- **Error Analysis Panel**: Quantitative measures including condition number, input perturbation size, output error, and error magnification factor
- **Geometric View**: For 2×2 systems, a visualization showing how the lines (and their intersection point) shift with perturbation

### Key Insight

The condition number $\kappa(A)$ bounds how much errors can be amplified:

$$\frac{\|\Delta x\| / \|x\|}{\|\Delta A\| / \|A\|} \leq \kappa(A)$$

This means if your input has a relative error of $10^{-6}$ and $\kappa(A) = 10^{6}$, your solution could have a relative error as large as $10^{0} = 1$ (100% error!).

## Understanding the Condition Number

| Condition Number | Interpretation | Digits of Accuracy Lost |
|-----------------|----------------|------------------------|
| $\kappa \approx 1$ | Well-conditioned, highly stable | ~0 |
| $\kappa \approx 10^2$ | Moderate sensitivity | ~2 |
| $\kappa \approx 10^6$ | Ill-conditioned | ~6 |
| $\kappa \to \infty$ | Singular (no unique solution) | All |

**Rule of Thumb**: If you compute with $d$ digits of precision and $\kappa(A) \approx 10^k$, expect only about $d - k$ accurate digits in your solution.

## Why Does This Matter?

In real-world computations, numerical stability is critical:

1. **Floating-point arithmetic** introduces rounding errors at every operation (typically $10^{-16}$ relative error in double precision)
2. **Measurement errors** in experimental data are unavoidable (sensors, instruments, sampling)
3. **Ill-conditioned systems** amplify these small errors, potentially making solutions meaningless
4. **AI and Machine Learning** systems rely on solving linear systems—ill-conditioning can cause training instability

### Real-World Examples

- **Structural engineering**: Stiffness matrices for finite element analysis can become ill-conditioned for thin structures
- **Computer graphics**: Transformation matrices for nearly-degenerate geometries
- **Machine learning**: Covariance matrices with highly correlated features
- **Signal processing**: Vandermonde matrices for polynomial interpolation with many points

## Geometric Interpretation

For 2×2 systems, each equation represents a line. The solution is where the lines intersect.

- **Nearly perpendicular lines** → Well-conditioned: The intersection point is clearly defined and stable
- **Nearly parallel lines** → Ill-conditioned: A tiny rotation of one line moves the intersection dramatically

The **Geometric View** panel visualizes this: solid blue lines show the original system, dashed red lines show the perturbed system. Watch how the green (original) and red (perturbed) solution points diverge as the condition number increases.

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Define the condition number and explain what it measures
2. Distinguish between well-conditioned and ill-conditioned systems visually and numerically
3. Predict the magnitude of solution errors given input perturbations and condition number
4. Explain why the Hilbert matrix is notoriously ill-conditioned
5. Connect geometric intuition (angle between lines) to numerical stability
6. Recognize when computed solutions may be unreliable

### Step-by-Step Activities

#### Activity 1: Exploring Well-Conditioned Systems (5 minutes)

1. Select **"Well-Conditioned"** from the Example dropdown
2. Observe the condition number in the Error Analysis panel (should be small, around 2-3)
3. Click **"New Random Perturbation"** several times
4. Notice that even though the matrix entries change slightly (highlighted in pink), the solution points (green and red dots) stay close together
5. **Question to consider**: What angle do the two lines make in the Geometric View?

#### Activity 2: Understanding Error Magnification (10 minutes)

1. Stay on the **"Well-Conditioned"** example
2. Set the Perturbation slider to $10^{-4}$ (the leftmost position)
3. Record the Error Magnification value
4. Move the slider to $10^{-3}$, then $10^{-2}$, then $10^{-1}$
5. **Observe**: Does the error magnification stay roughly constant regardless of perturbation size?
6. **Key insight**: The error magnification should stay bounded by the condition number

#### Activity 3: Witnessing Catastrophic Error Amplification (10 minutes)

1. Switch to **"Near-Singular"** from the dropdown
2. Observe the very high condition number (typically $10^5$ or more)
3. Set perturbation to $10^{-4}$ and click "New Random Perturbation" several times
4. **Notice**: Even with tiny input changes ($10^{-4}$), the solution can jump by large amounts
5. Look at the Geometric View: the two lines are nearly parallel!
6. **Discussion**: Why would solving this system on a computer be problematic?

#### Activity 4: The Infamous Hilbert Matrix (10 minutes)

1. Select **"Severely Ill-Conditioned (Hilbert)"** from the dropdown
2. This is a 3×3 Hilbert matrix where $H_{ij} = \frac{1}{i+j-1}$
3. Observe the extremely high condition number
4. Set perturbation to $10^{-4}$ and generate several perturbations
5. **Notice**: The x, y, z solution values can change dramatically
6. **Research extension**: Look up why Hilbert matrices arise in polynomial fitting and why they're problematic

#### Activity 5: Connecting Geometry to Algebra (10 minutes)

1. Select **"Moderately Ill-Conditioned"**
2. In the Geometric View, observe that the lines are close to parallel but not quite
3. Switch to **"Well-Conditioned"** and compare the angle between lines
4. Switch to **"Near-Singular"** and observe the lines are nearly identical
5. **Complete this statement**: "The condition number is large when the lines are ______"
6. **Challenge**: Can you explain why nearly parallel lines lead to sensitive solutions?

#### Activity 6: Quantitative Analysis (15 minutes)

1. For each of the four presets, record:
    - The condition number $\kappa$
    - The input perturbation size (from slider)
    - The output error (solution change)
    - The error magnification
2. Create a table comparing these values
3. Verify that: Error Magnification ≤ Condition Number (approximately)
4. **Discuss**: Why is the actual error magnification often less than the theoretical maximum?

## Self-Assessment Quiz

??? question "Question 1: What does a large condition number indicate?"
    A) The matrix has a large determinant

    B) The system has many solutions

    C) Small input errors may cause large output errors

    D) The matrix is symmetric

    ??? answer "Answer"
        **C) Small input errors may cause large output errors**

        The condition number measures the sensitivity of the solution to perturbations in the input. A large condition number means the system is ill-conditioned and small errors can be amplified significantly.

??? question "Question 2: A matrix has condition number κ = 10⁸. If your input data has relative error 10⁻¹⁰, what is the worst-case relative error in your solution?"
    A) 10⁻¹⁸

    B) 10⁻¹⁰

    C) 10⁻²

    D) 10⁸

    ??? answer "Answer"
        **C) 10⁻²**

        The condition number bounds the error amplification: relative output error ≤ κ × relative input error = 10⁸ × 10⁻¹⁰ = 10⁻².

??? question "Question 3: In the geometric view of a 2×2 system, what visual characteristic indicates an ill-conditioned system?"
    A) The lines are perpendicular

    B) The lines are nearly parallel

    C) The lines pass through the origin

    D) The lines have positive slopes

    ??? answer "Answer"
        **B) The lines are nearly parallel**

        When lines are nearly parallel, a small rotation of one line causes the intersection point to move dramatically. This geometric instability corresponds to algebraic ill-conditioning.

??? question "Question 4: Why is the Hilbert matrix particularly problematic for numerical computation?"
    A) It is always singular

    B) It has complex eigenvalues

    C) Its condition number grows rapidly with matrix size

    D) It cannot be stored in computer memory

    ??? answer "Answer"
        **C) Its condition number grows rapidly with matrix size**

        The condition number of an n×n Hilbert matrix grows exponentially with n. Even a 10×10 Hilbert matrix has a condition number around 10¹³, making accurate numerical solution nearly impossible with standard double precision.

??? question "Question 5: You solve a linear system and get a solution, but you suspect the system may be ill-conditioned. What should you do to verify your result?"
    A) Check if the determinant is zero

    B) Compute the condition number and compare to your working precision

    C) Verify the matrix is square

    D) Check if all entries are positive

    ??? answer "Answer"
        **B) Compute the condition number and compare to your working precision**

        The condition number tells you how many digits of accuracy you might lose. If κ ≈ 10ᵏ and you work with d digits of precision, you can trust only about d−k digits in your solution. If k ≥ d, your solution may be meaningless.
