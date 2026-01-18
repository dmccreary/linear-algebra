# Quiz: Neural Networks and Deep Learning

Test your understanding of neural network architecture and deep learning concepts.

---

#### 1. A fully connected (dense) layer computes:

<div class="upper-alpha" markdown>
1. Element-wise multiplication only
2. $\mathbf{y} = \sigma(W\mathbf{x} + \mathbf{b})$ with linear transform and activation
3. Convolution of input with a kernel
4. Max pooling of input values
</div>

??? question "Show Answer"
    The correct answer is **B**. A dense layer performs a linear transformation followed by a nonlinear activation: $\mathbf{y} = \sigma(W\mathbf{x} + \mathbf{b})$, where $W$ is the weight matrix, $\mathbf{b}$ is the bias, and $\sigma$ is the activation function.

    **Concept Tested:** Dense Layer

---

#### 2. The purpose of an activation function is to:

<div class="upper-alpha" markdown>
1. Initialize weights randomly
2. Introduce nonlinearity into the network
3. Reduce the number of parameters
4. Normalize input data
</div>

??? question "Show Answer"
    The correct answer is **B**. Activation functions introduce nonlinearity, enabling neural networks to learn complex patterns. Without them, stacking layers would just produce another linear transformation.

    **Concept Tested:** Activation Function

---

#### 3. The ReLU activation function is defined as:

<div class="upper-alpha" markdown>
1. $\sigma(x) = \frac{1}{1+e^{-x}}$
2. $\sigma(x) = \max(0, x)$
3. $\sigma(x) = \tanh(x)$
4. $\sigma(x) = x^2$
</div>

??? question "Show Answer"
    The correct answer is **B**. ReLU (Rectified Linear Unit) is defined as $\max(0, x)$—it outputs $x$ for positive inputs and 0 for negative inputs. It's computationally efficient and helps mitigate vanishing gradients.

    **Concept Tested:** ReLU Activation

---

#### 4. Backpropagation computes:

<div class="upper-alpha" markdown>
1. The forward pass predictions
2. Gradients of the loss with respect to all parameters
3. The optimal learning rate
4. The activation function values
</div>

??? question "Show Answer"
    The correct answer is **B**. Backpropagation efficiently computes gradients of the loss with respect to all network parameters using the chain rule, enabling gradient-based optimization.

    **Concept Tested:** Backpropagation

---

#### 5. The softmax function:

<div class="upper-alpha" markdown>
1. Sets all outputs to zero
2. Converts scores to probabilities that sum to 1
3. Applies ReLU to each element
4. Computes the maximum value
</div>

??? question "Show Answer"
    The correct answer is **B**. Softmax converts a vector of real-valued scores to a probability distribution: $\text{softmax}(\mathbf{z})_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$. All outputs are positive and sum to 1.

    **Concept Tested:** Softmax Function

---

#### 6. A tensor in deep learning is:

<div class="upper-alpha" markdown>
1. Always a 2D matrix
2. A multidimensional array of numbers
3. A type of activation function
4. A loss function
</div>

??? question "Show Answer"
    The correct answer is **B**. A tensor is a multidimensional array—a generalization of scalars (0D), vectors (1D), and matrices (2D) to higher dimensions. Tensors represent data and parameters in neural networks.

    **Concept Tested:** Tensor

---

#### 7. Cross-entropy loss is commonly used for:

<div class="upper-alpha" markdown>
1. Regression problems
2. Classification problems with probability outputs
3. Dimensionality reduction
4. Feature extraction
</div>

??? question "Show Answer"
    The correct answer is **B**. Cross-entropy loss measures the difference between predicted probability distributions and true labels. It's the standard loss for classification, especially with softmax outputs.

    **Concept Tested:** Cross-Entropy Loss

---

#### 8. Batch normalization:

<div class="upper-alpha" markdown>
1. Increases batch size automatically
2. Normalizes layer inputs to have zero mean and unit variance
3. Removes all biases from the network
4. Converts images to grayscale
</div>

??? question "Show Answer"
    The correct answer is **B**. Batch normalization normalizes activations across a mini-batch to zero mean and unit variance, then applies learned scale and shift. This stabilizes training and can act as regularization.

    **Concept Tested:** Batch Normalization

---

#### 9. The chain rule in backpropagation enables:

<div class="upper-alpha" markdown>
1. Computing gradients through composed functions
2. Increasing network depth automatically
3. Selecting the best activation function
4. Determining batch size
</div>

??? question "Show Answer"
    The correct answer is **A**. The chain rule allows computing gradients through composed functions: $\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial x}$. This is essential for propagating gradients through all network layers.

    **Concept Tested:** Chain Rule

---

#### 10. Dropout during training:

<div class="upper-alpha" markdown>
1. Removes entire layers permanently
2. Randomly sets some neuron outputs to zero
3. Doubles the learning rate
4. Freezes all weights
</div>

??? question "Show Answer"
    The correct answer is **B**. Dropout randomly sets a fraction of neuron outputs to zero during training, preventing co-adaptation of neurons. This serves as regularization and improves generalization.

    **Concept Tested:** Dropout
