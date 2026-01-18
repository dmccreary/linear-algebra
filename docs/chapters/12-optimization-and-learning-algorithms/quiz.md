# Quiz: Optimization and Learning Algorithms

Test your understanding of optimization methods for machine learning.

---

#### 1. The Hessian matrix contains:

<div class="upper-alpha" markdown>
1. First-order partial derivatives
2. Second-order partial derivatives
3. The gradient vector
4. The loss function values
</div>

??? question "Show Answer"
    The correct answer is **B**. The Hessian matrix contains all second-order partial derivatives: $H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}$. It captures the curvature of the function.

    **Concept Tested:** Hessian Matrix

---

#### 2. A function is convex if:

<div class="upper-alpha" markdown>
1. It has multiple local minima
2. Any chord lies above or on the function graph
3. Its gradient is always zero
4. It is defined only for positive inputs
</div>

??? question "Show Answer"
    The correct answer is **B**. A convex function lies below any chord connecting two points on its graph: $f(\lambda x + (1-\lambda)y) \leq \lambda f(x) + (1-\lambda)f(y)$. Convex functions have a single global minimum.

    **Concept Tested:** Convex Function

---

#### 3. Newton's method uses:

<div class="upper-alpha" markdown>
1. Only first-order gradient information
2. Second-order Hessian information for faster convergence
3. Random search
4. No derivatives at all
</div>

??? question "Show Answer"
    The correct answer is **B**. Newton's method uses both gradient and Hessian: $\mathbf{x}_{k+1} = \mathbf{x}_k - H^{-1}\nabla f$. The Hessian provides curvature information enabling quadratic convergence near the solution.

    **Concept Tested:** Newton's Method

---

#### 4. Stochastic Gradient Descent (SGD) differs from batch gradient descent by:

<div class="upper-alpha" markdown>
1. Never converging
2. Using gradients from random subsets of data
3. Requiring second-order derivatives
4. Only working on convex functions
</div>

??? question "Show Answer"
    The correct answer is **B**. SGD computes gradients using random mini-batches rather than the full dataset. This introduces noise but enables much faster iteration, especially with large datasets.

    **Concept Tested:** SGD

---

#### 5. Momentum in optimization:

<div class="upper-alpha" markdown>
1. Slows down convergence
2. Accumulates gradient information to accelerate and dampen oscillations
3. Eliminates the learning rate
4. Only works for linear functions
</div>

??? question "Show Answer"
    The correct answer is **B**. Momentum maintains a velocity vector that accumulates past gradients, helping to accelerate convergence in consistent directions while dampening oscillations in others.

    **Concept Tested:** Momentum

---

#### 6. The Adam optimizer combines:

<div class="upper-alpha" markdown>
1. Newton's method and SGD
2. Momentum and adaptive learning rates (RMSprop-like)
3. L1 and L2 regularization
4. Batch and online learning
</div>

??? question "Show Answer"
    The correct answer is **B**. Adam combines momentum (first moment) with RMSprop-style adaptive learning rates (second moment), plus bias correction. This makes it robust across many problem types.

    **Concept Tested:** Adam Optimizer

---

#### 7. RMSprop adapts learning rates by:

<div class="upper-alpha" markdown>
1. Keeping them constant
2. Dividing by the running average of squared gradients
3. Multiplying by the gradient magnitude
4. Using second-order derivatives
</div>

??? question "Show Answer"
    The correct answer is **B**. RMSprop divides the learning rate by the root mean square of recent gradients, reducing step size for parameters with large gradients and increasing it for those with small gradients.

    **Concept Tested:** RMSprop

---

#### 8. Lagrange multipliers are used to:

<div class="upper-alpha" markdown>
1. Increase the number of variables
2. Convert constrained optimization to unconstrained
3. Compute the Hessian
4. Initialize weights randomly
</div>

??? question "Show Answer"
    The correct answer is **B**. Lagrange multipliers transform constrained optimization problems into unconstrained ones by incorporating constraints into the objective function through the Lagrangian.

    **Concept Tested:** Lagrange Multiplier

---

#### 9. The KKT conditions generalize Lagrange multipliers to handle:

<div class="upper-alpha" markdown>
1. Only equality constraints
2. Inequality constraints
3. Unconstrained problems
4. Non-differentiable functions
</div>

??? question "Show Answer"
    The correct answer is **B**. The Karush-Kuhn-Tucker (KKT) conditions extend Lagrange multipliers to problems with inequality constraints, introducing complementary slackness conditions.

    **Concept Tested:** KKT Conditions

---

#### 10. Mini-batch SGD is preferred over pure SGD (batch size 1) because:

<div class="upper-alpha" markdown>
1. It never converges
2. It reduces gradient variance while maintaining computational efficiency
3. It requires more memory than full-batch
4. It eliminates the need for a learning rate
</div>

??? question "Show Answer"
    The correct answer is **B**. Mini-batches reduce gradient variance (averaging over multiple samples) while still being much faster than full-batch. They also enable efficient GPU parallelization.

    **Concept Tested:** Mini-Batch SGD
