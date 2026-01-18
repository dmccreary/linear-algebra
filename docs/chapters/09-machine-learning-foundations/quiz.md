# Quiz: Machine Learning Foundations

Test your understanding of linear algebra concepts in machine learning.

---

#### 1. In machine learning, a feature vector represents:

<div class="upper-alpha" markdown>
1. The output label of a data point
2. The numerical attributes of a single data sample
3. The weights of a neural network
4. The training algorithm
</div>

??? question "Show Answer"
    The correct answer is **B**. A feature vector contains the numerical attributes (features) that describe a single data sample. For example, an image might be represented as a vector of pixel values.

    **Concept Tested:** Feature Vector

---

#### 2. The weight matrix in a linear model maps:

<div class="upper-alpha" markdown>
1. Labels to features
2. Inputs to outputs through linear transformation
3. Features to labels through division
4. Errors to gradients
</div>

??? question "Show Answer"
    The correct answer is **B**. The weight matrix performs a linear transformation from input features to outputs. In $\mathbf{y} = W\mathbf{x} + \mathbf{b}$, the matrix $W$ determines how inputs combine to produce outputs.

    **Concept Tested:** Weight Matrix

---

#### 3. The gradient of a loss function with respect to parameters indicates:

<div class="upper-alpha" markdown>
1. The minimum value of the loss
2. The direction of steepest increase
3. The optimal parameters
4. The training data size
</div>

??? question "Show Answer"
    The correct answer is **B**. The gradient points in the direction of steepest increase of the loss function. To minimize loss, gradient descent moves in the opposite direction (negative gradient).

    **Concept Tested:** Gradient

---

#### 4. A cost function in machine learning measures:

<div class="upper-alpha" markdown>
1. The monetary expense of training
2. The discrepancy between predictions and true values
3. The number of features
4. The model complexity
</div>

??? question "Show Answer"
    The correct answer is **B**. The cost (or loss) function measures how far the model's predictions deviate from the true values. Training aims to minimize this function by adjusting parameters.

    **Concept Tested:** Cost Function

---

#### 5. In gradient descent, the update rule is:

<div class="upper-alpha" markdown>
1. $\mathbf{w} \leftarrow \mathbf{w} + \alpha \nabla L$
2. $\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla L$
3. $\mathbf{w} \leftarrow \alpha \nabla L$
4. $\mathbf{w} \leftarrow \mathbf{w} / \nabla L$
</div>

??? question "Show Answer"
    The correct answer is **B**. Gradient descent subtracts the gradient scaled by learning rate $\alpha$: $\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla L$. This moves parameters in the direction that decreases the loss.

    **Concept Tested:** Gradient Descent

---

#### 6. The learning rate $\alpha$ controls:

<div class="upper-alpha" markdown>
1. The size of the dataset
2. The step size in parameter updates
3. The number of iterations
4. The model architecture
</div>

??? question "Show Answer"
    The correct answer is **B**. The learning rate determines how large a step to take in the direction of the negative gradient. Too large can cause divergence; too small leads to slow convergence.

    **Concept Tested:** Learning Rate

---

#### 7. Linear regression finds parameters that minimize:

<div class="upper-alpha" markdown>
1. The number of features
2. The sum of squared residuals
3. The number of training samples
4. The weight magnitudes
</div>

??? question "Show Answer"
    The correct answer is **B**. Linear regression minimizes the sum of squared residuals: $\sum_i (y_i - \hat{y}_i)^2$, where $\hat{y}_i$ are predictions. This has a closed-form solution via the normal equations.

    **Concept Tested:** Linear Regression

---

#### 8. Regularization adds to the loss function:

<div class="upper-alpha" markdown>
1. More training data
2. A penalty term based on weight magnitudes
3. Additional features
4. More layers
</div>

??? question "Show Answer"
    The correct answer is **B**. Regularization adds a penalty term (like $\lambda\|\mathbf{w}\|^2$ for L2) to prevent overfitting. This encourages smaller weights and simpler models.

    **Concept Tested:** Regularization

---

#### 9. A hyperplane in classification:

<div class="upper-alpha" markdown>
1. Maximizes the loss function
2. Separates data points of different classes
3. Is always vertical
4. Contains all training points
</div>

??? question "Show Answer"
    The correct answer is **B**. A hyperplane is a linear decision boundary that separates data points belonging to different classes. In $n$ dimensions, a hyperplane has $n-1$ dimensions.

    **Concept Tested:** Hyperplane

---

#### 10. The bias term in a linear model:

<div class="upper-alpha" markdown>
1. Must always be zero
2. Allows the model to fit data not passing through the origin
3. Increases overfitting
4. Is the same as the weight
</div>

??? question "Show Answer"
    The correct answer is **B**. The bias term $\mathbf{b}$ in $\mathbf{y} = W\mathbf{x} + \mathbf{b}$ allows the model to represent functions that don't pass through the origin, providing a translation or offset.

    **Concept Tested:** Bias Term
