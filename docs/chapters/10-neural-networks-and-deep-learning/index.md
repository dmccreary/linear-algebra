---
title: Neural Networks and Deep Learning
description: The matrix mathematics powering deep learning, from neurons to convolutional architectures
generated_by: claude skill chapter-content-generator
date: 2026-01-17 16:30:00
version: 0.03
---

# Neural Networks and Deep Learning

## Summary

Neural networks are fundamentally sequences of linear transformations interleaved with nonlinearities. This chapter reveals the matrix mathematics powering deep learning, covering neurons, activation functions, weight matrices, forward propagation, and backpropagation. You will also learn about specialized architectures including convolutional layers, batch normalization, and tensor operations.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Perceptron
2. Neuron Model
3. Activation Function
4. ReLU
5. Sigmoid
6. Tanh
7. Softmax
8. Weight Matrix
9. Bias Vector
10. Forward Propagation
11. Backpropagation
12. Chain Rule Matrices
13. Loss Function
14. Cross-Entropy Loss
15. Neural Network Layer
16. Hidden Layer
17. Deep Network
18. Convolutional Layer
19. Convolution Kernel
20. Stride
21. Padding
22. Pooling Layer
23. Batch Normalization
24. Layer Normalization
25. Tensor
26. Tensor Operations

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Vectors and Vector Spaces](../01-vectors-and-vector-spaces/index.md)
- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 4: Linear Transformations](../04-linear-transformations/index.md)
- [Chapter 9: Machine Learning Foundations](../09-machine-learning-foundations/index.md)
- [Chapter 13: Image Processing](../13-image-processing-and-computer-vision/index.md) (for convolution concepts)

---

## Introduction

Deep learning has revolutionized artificial intelligence, powering breakthroughs in image recognition, natural language processing, and game playing. Behind the impressive applications lies elegant mathematics: neural networks are compositions of linear transformations (matrix multiplications) and elementwise nonlinearities.

Understanding neural networks through the lens of linear algebra provides crucial insights:

- Why networks need nonlinear activation functions
- How gradients flow backward through matrix operations
- Why certain architectures are more effective than others
- How to debug and optimize network training

This chapter develops neural networks from first principles, revealing the matrix operations at every step. You'll see that deep learning is not magic—it's linear algebra with a few clever twists.

## The Perceptron: Where It Began

The **perceptron**, invented by Frank Rosenblatt in 1958, is the simplest neural network—a single artificial neuron that performs binary classification.

### Perceptron Model

Given input vector $\mathbf{x} \in \mathbb{R}^d$, the perceptron computes:

$y = \text{sign}(\mathbf{w}^T\mathbf{x} + b)$

where:

- $\mathbf{w} \in \mathbb{R}^d$ is the weight vector
- $b \in \mathbb{R}$ is the bias
- $\text{sign}(z) = +1$ if $z \geq 0$, else $-1$

The perceptron defines a hyperplane $\mathbf{w}^T\mathbf{x} + b = 0$ that separates the input space into two half-spaces.

### Geometric Interpretation

The weight vector $\mathbf{w}$ is perpendicular to the decision boundary, and the bias $b$ controls the boundary's offset from the origin. Points on one side of the hyperplane are classified as $+1$, points on the other side as $-1$.

#### Diagram: Perceptron Decision Boundary

<iframe src="../../sims/perceptron-decision-boundary/main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/perceptron-decision-boundary/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Perceptron Decision Boundary Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize how perceptron weights and bias define a linear decision boundary

Visual elements:
- 2D input space with data points (two classes, different colors)
- Decision boundary line
- Weight vector shown perpendicular to boundary
- Shaded regions for each class
- Misclassified points highlighted

Interactive controls:
- Draggable weight vector (changes boundary orientation)
- Bias slider (shifts boundary)
- "Add Point" mode to create custom datasets
- "Run Perceptron Learning" button
- Preset datasets: linearly separable, XOR (not separable)

Default parameters:
- Linearly separable 2D dataset
- Initial random weights
- Canvas: responsive

Behavior:
- Real-time boundary update as weights change
- Show classification accuracy
- Highlight that XOR cannot be solved
- Animate perceptron learning algorithm steps
- Display weight update rule

Implementation: p5.js with interactive geometry
</details>

### Limitations

The perceptron can only learn linearly separable functions. The famous XOR problem demonstrated that a single perceptron cannot compute XOR—motivating multilayer networks.

## The Neuron Model

A **neuron** (or unit) generalizes the perceptron with a continuous activation function:

$a = \sigma(\mathbf{w}^T\mathbf{x} + b) = \sigma(z)$

where:

- $z = \mathbf{w}^T\mathbf{x} + b$ is the pre-activation (weighted sum)
- $\sigma$ is the activation function
- $a$ is the activation (output)

This two-step process—linear combination followed by nonlinearity—is the fundamental building block of all neural networks.

## Activation Functions

**Activation functions** introduce nonlinearity, enabling neural networks to learn complex patterns. Without them, any depth of linear layers would collapse to a single linear transformation.

### ReLU (Rectified Linear Unit)

The **ReLU** activation is the most widely used in modern deep learning:

$\text{ReLU}(z) = \max(0, z) = \begin{cases} z & \text{if } z > 0 \\ 0 & \text{if } z \leq 0 \end{cases}$

Properties:

- Computationally efficient (just a threshold)
- Sparse activations (many zeros)
- Avoids vanishing gradients for positive inputs
- "Dead ReLU" problem: neurons can get stuck at zero

Derivative: $\frac{d}{dz}\text{ReLU}(z) = \begin{cases} 1 & \text{if } z > 0 \\ 0 & \text{if } z < 0 \end{cases}$

### Sigmoid

The **sigmoid** function squashes inputs to the range $(0, 1)$:

$\sigma(z) = \frac{1}{1 + e^{-z}}$

Properties:

- Output interpretable as probability
- Smooth and differentiable everywhere
- Saturates for large $|z|$ (vanishing gradients)
- Outputs not zero-centered

Derivative: $\sigma'(z) = \sigma(z)(1 - \sigma(z))$

### Tanh

The **tanh** function maps inputs to $(-1, 1)$:

$\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}} = 2\sigma(2z) - 1$

Properties:

- Zero-centered outputs (often better than sigmoid)
- Still suffers from vanishing gradients at extremes
- Commonly used in RNNs and LSTMs

Derivative: $\tanh'(z) = 1 - \tanh^2(z)$

### Softmax

The **softmax** function converts a vector of scores to a probability distribution:

$\text{softmax}(\mathbf{z})_i = \frac{e^{z_i}}{\sum_{j=1}^K e^{z_j}}$

where:

- Input: $\mathbf{z} \in \mathbb{R}^K$ (logits for $K$ classes)
- Output: probability vector with $\sum_i \text{softmax}(\mathbf{z})_i = 1$

Properties:

- Used for multi-class classification output layer
- Exponential amplifies differences between scores
- Numerically stabilized by subtracting $\max(\mathbf{z})$ before exponentiating

| Activation | Range | Use Case | Gradient Issue |
|------------|-------|----------|----------------|
| ReLU | $[0, \infty)$ | Hidden layers | Dead neurons |
| Sigmoid | $(0, 1)$ | Binary output | Vanishing |
| Tanh | $(-1, 1)$ | Hidden layers, RNNs | Vanishing |
| Softmax | $(0, 1)^K$, sums to 1 | Multi-class output | — |

#### Diagram: Activation Function Comparison

<iframe src="../../sims/activation-functions/main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/activation-functions/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Activation Functions Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Compare activation functions by their shape, range, and gradient behavior

Visual elements:
- Main panel: Graph showing selected activation function
- Derivative overlay (toggleable)
- Gradient magnitude heatmap for different input values
- Side panel: Function properties summary

Interactive controls:
- Activation selector: ReLU, Sigmoid, Tanh, Leaky ReLU, Softplus
- Input range slider
- "Show Derivative" toggle
- "Compare All" mode showing functions overlaid
- Input value slider to trace along curve

Default parameters:
- ReLU selected
- Input range: [-5, 5]
- Canvas: responsive

Behavior:
- Real-time function and derivative plotting
- Highlight saturation regions (near-zero gradient)
- Show numerical values at traced point
- For softmax: show 3-class probability bar chart
- Display gradient flow implications

Implementation: p5.js with function plotting
</details>

## Network Architecture: Layers and Matrices

A neural network organizes neurons into layers, with each layer performing a matrix operation.

### Weight Matrix and Bias Vector

For a layer with $n_{in}$ inputs and $n_{out}$ outputs:

- **Weight matrix** $W \in \mathbb{R}^{n_{out} \times n_{in}}$ contains connection strengths
- **Bias vector** $\mathbf{b} \in \mathbb{R}^{n_{out}}$ provides learnable offsets

The layer computes:

$\mathbf{z} = W\mathbf{x} + \mathbf{b}$

where:

- $\mathbf{x} \in \mathbb{R}^{n_{in}}$ is the input
- $\mathbf{z} \in \mathbb{R}^{n_{out}}$ is the pre-activation

Each row of $W$ contains the weights for one output neuron.

### Neural Network Layer

A complete **neural network layer** combines the linear transformation with an activation:

$\mathbf{a} = \sigma(W\mathbf{x} + \mathbf{b})$

where $\sigma$ is applied elementwise.

For a batch of $m$ inputs (stored as columns of $X \in \mathbb{R}^{n_{in} \times m}$):

$A = \sigma(WX + \mathbf{b}\mathbf{1}^T)$

where $\mathbf{1}^T = [1, 1, \ldots, 1]$ broadcasts the bias to all samples.

### Hidden Layers and Deep Networks

- **Hidden layers** are layers between input and output—their activations are not directly observed
- A **deep network** has multiple hidden layers, enabling hierarchical feature learning

A network with $L$ layers computes:

$\mathbf{a}^{[0]} = \mathbf{x}$ (input)

$\mathbf{z}^{[l]} = W^{[l]}\mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}$ for $l = 1, \ldots, L$

$\mathbf{a}^{[l]} = \sigma^{[l]}(\mathbf{z}^{[l]})$ for $l = 1, \ldots, L$

The output is $\mathbf{a}^{[L]}$.

#### Diagram: Network Architecture Visualizer

<iframe src="../../sims/neural-network-architecture/main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/neural-network-architecture/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Neural Network Architecture Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Understand

Learning Objective: Visualize neural network architecture and understand the dimensions of weight matrices at each layer

Visual elements:
- Node-and-edge diagram of network
- Layer labels with dimensions
- Weight matrix dimensions displayed on connections
- Activation function icons at each layer
- Parameter count summary

Interactive controls:
- Layer count slider (1-5 hidden layers)
- Neurons per layer sliders
- Activation function selector per layer
- "Show Dimensions" toggle
- "Show Weight Matrices" toggle (expands to show matrix shapes)
- Input/output dimension selectors

Default parameters:
- 2 hidden layers
- Architecture: 4 → 8 → 8 → 2
- ReLU hidden, Softmax output
- Canvas: responsive

Behavior:
- Real-time architecture update
- Calculate and display total parameters
- Show data flow animation
- Highlight one layer at a time with matrix equation
- Demonstrate dimension matching requirements

Implementation: p5.js with network diagram rendering
</details>

## Forward Propagation

**Forward propagation** computes the network output by passing input through all layers sequentially.

### Algorithm

```
Input: x, weights {W[l], b[l]} for l = 1,...,L

a[0] = x
For l = 1 to L:
    z[l] = W[l] @ a[l-1] + b[l]
    a[l] = activation[l](z[l])

Output: a[L]
```

### Matrix Form for Batches

For a batch of $m$ samples (columns of $X$):

$A^{[0]} = X$

$Z^{[l]} = W^{[l]}A^{[l-1]} + \mathbf{b}^{[l]}\mathbf{1}^T$

$A^{[l]} = \sigma^{[l]}(Z^{[l]})$

The output $A^{[L]}$ has shape $n_L \times m$.

### Why Nonlinearity Is Essential

Consider a 2-layer network without activations:

$\mathbf{y} = W^{[2]}(W^{[1]}\mathbf{x}) = (W^{[2]}W^{[1]})\mathbf{x} = W'\mathbf{x}$

The composition of linear functions is linear! Without nonlinear activations, deep networks would have no more expressive power than a single layer.

#### Diagram: Forward Propagation Visualizer

<iframe src="../../sims/forward-propagation/main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/forward-propagation/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Forward Propagation Step-by-Step</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Trace data flow through a neural network and see the matrix operations at each layer

Visual elements:
- Network diagram with numerical values
- Current layer highlighted
- Matrix multiplication visualization
- Activation function application shown
- Values flowing through connections

Interactive controls:
- "Next Step" button
- "Auto Run" with speed slider
- Input vector editor
- Weight matrix display (expandable)
- "Show Matrix Multiplication" detail toggle

Default parameters:
- 3-layer network: 2 → 3 → 2
- Random initialized weights
- Input: [1.0, 0.5]
- Canvas: responsive

Behavior:
- Step through z = Wa + b computation
- Show activation function application
- Display intermediate values at each neuron
- Animate data flow
- Verify dimensions at each step

Implementation: p5.js with matrix computation display
</details>

## Loss Functions

**Loss functions** measure how well the network's predictions match the targets, providing the signal for learning.

### Common Loss Functions

**Mean Squared Error (MSE)** for regression:

$\mathcal{L}_{MSE} = \frac{1}{m}\sum_{i=1}^m \|\mathbf{y}_i - \hat{\mathbf{y}}_i\|^2$

**Cross-Entropy Loss** for classification:

For binary classification with sigmoid output $\hat{y} \in (0, 1)$:

$\mathcal{L}_{BCE} = -\frac{1}{m}\sum_{i=1}^m [y_i \log(\hat{y}_i) + (1-y_i)\log(1-\hat{y}_i)]$

For multi-class with softmax output $\hat{\mathbf{y}} \in \mathbb{R}^K$:

$\mathcal{L}_{CE} = -\frac{1}{m}\sum_{i=1}^m \sum_{k=1}^K y_{ik} \log(\hat{y}_{ik})$

where $y_{ik}$ is the one-hot encoded true label.

### Why Cross-Entropy?

Cross-entropy loss has favorable gradient properties:

- Combined with softmax, the gradient simplifies to $\hat{\mathbf{y}} - \mathbf{y}$
- Penalizes confident wrong predictions heavily
- Derived from maximum likelihood estimation

| Loss Function | Output Layer | Use Case |
|---------------|--------------|----------|
| MSE | Linear | Regression |
| Binary Cross-Entropy | Sigmoid | Binary classification |
| Categorical Cross-Entropy | Softmax | Multi-class classification |

## Backpropagation

**Backpropagation** efficiently computes gradients of the loss with respect to all parameters using the chain rule.

### The Chain Rule for Matrices

For composed functions $\mathcal{L} = f(g(h(\theta)))$, the chain rule gives:

$\frac{\partial \mathcal{L}}{\partial \theta} = \frac{\partial \mathcal{L}}{\partial f} \cdot \frac{\partial f}{\partial g} \cdot \frac{\partial g}{\partial h} \cdot \frac{\partial h}{\partial \theta}$

In neural networks, this chain extends through all layers.

### Chain Rule Matrices (Jacobians)

For vector-valued functions, derivatives become Jacobian matrices. If $\mathbf{z} = f(\mathbf{a})$ where $\mathbf{z} \in \mathbb{R}^n$ and $\mathbf{a} \in \mathbb{R}^m$:

$\frac{\partial \mathbf{z}}{\partial \mathbf{a}} = \begin{bmatrix} \frac{\partial z_1}{\partial a_1} & \cdots & \frac{\partial z_1}{\partial a_m} \\ \vdots & \ddots & \vdots \\ \frac{\partial z_n}{\partial a_1} & \cdots & \frac{\partial z_n}{\partial a_m} \end{bmatrix}$

For scalar loss $\mathcal{L}$, we work with gradient vectors and propagate them backward.

### Backpropagation Algorithm

Starting from the output layer and moving backward:

**Output layer gradient:**

$\delta^{[L]} = \nabla_{\mathbf{a}^{[L]}} \mathcal{L} \odot \sigma'^{[L]}(\mathbf{z}^{[L]})$

**Propagate backward:** For $l = L-1, \ldots, 1$:

$\delta^{[l]} = (W^{[l+1]})^T \delta^{[l+1]} \odot \sigma'^{[l]}(\mathbf{z}^{[l]})$

**Parameter gradients:**

$\frac{\partial \mathcal{L}}{\partial W^{[l]}} = \delta^{[l]} (\mathbf{a}^{[l-1]})^T$

$\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[l]}} = \delta^{[l]}$

where:

- $\delta^{[l]}$ is the error signal at layer $l$
- $\odot$ is elementwise multiplication
- $\sigma'$ is the derivative of the activation function

#### Diagram: Backpropagation Visualizer

<iframe src="../../sims/backpropagation/main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/backpropagation/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Backpropagation Step-by-Step</summary>
Type: microsim

Bloom Taxonomy Level: Analyze

Learning Objective: Understand how gradients flow backward through a network via the chain rule

Visual elements:
- Network diagram with forward values
- Backward arrows showing gradient flow
- Current layer highlighted
- Gradient values displayed at each node
- Matrix transpose visualization for weight gradients

Interactive controls:
- "Forward Pass" button (must run first)
- "Backward Step" button
- "Auto Backprop" with speed slider
- Target value input
- Loss function selector (MSE, Cross-Entropy)
- "Show Chain Rule" detail toggle

Default parameters:
- 3-layer network: 2 → 3 → 1
- MSE loss
- Single training example
- Canvas: responsive

Behavior:
- Compute and display output error
- Show gradient flowing backward through each layer
- Display δ values at each neuron
- Show weight gradient computation
- Verify gradient dimensions match weight dimensions

Implementation: p5.js with gradient computation display
</details>

### Gradient Flow and Vanishing/Exploding Gradients

Gradients are multiplied by weight matrices at each layer during backpropagation. If weights are:

- Too small: gradients shrink exponentially → **vanishing gradients**
- Too large: gradients grow exponentially → **exploding gradients**

This motivates careful weight initialization and architectural choices like residual connections.

## Convolutional Neural Networks

**Convolutional layers** exploit spatial structure in images and sequences through weight sharing.

### Convolution Kernel

A **convolution kernel** (or filter) is a small matrix of learnable weights that slides across the input:

$(\mathbf{I} * \mathbf{K})_{i,j} = \sum_{m}\sum_{n} I_{i+m, j+n} \cdot K_{m,n}$

where:

- $\mathbf{I}$ is the input (e.g., image)
- $\mathbf{K}$ is the kernel (e.g., $3 \times 3$)
- The sum is over all kernel positions

A $3 \times 3$ kernel has only 9 parameters but processes arbitrarily large inputs—this is **weight sharing**.

### Convolutional Layer

A **convolutional layer** applies multiple kernels to produce multiple output channels:

$\text{Output}_{c_{out}, i, j} = \sum_{c_{in}} (\mathbf{I}_{c_{in}} * \mathbf{K}_{c_{out}, c_{in}})_{i,j} + b_{c_{out}}$

where:

- $c_{in}$ input channels, $c_{out}$ output channels
- Each output channel has its own set of kernels (one per input channel)
- Total parameters: $c_{out} \times c_{in} \times k_h \times k_w + c_{out}$

### Stride and Padding

**Stride** controls how many pixels the kernel moves between applications:

- Stride 1: kernel moves one pixel at a time (full resolution)
- Stride 2: kernel moves two pixels (halves spatial dimensions)

**Padding** adds zeros around the input border:

- "Valid" padding: no padding, output shrinks
- "Same" padding: pad to keep output size equal to input

Output dimension formula:

$\text{out\_size} = \frac{\text{in\_size} - \text{kernel\_size} + 2 \times \text{padding}}{\text{stride}} + 1$

### Pooling Layer

**Pooling layers** downsample spatial dimensions:

- **Max pooling:** takes maximum value in each window
- **Average pooling:** takes average value in each window

Common configuration: $2 \times 2$ pool with stride 2 halves each spatial dimension.

| Operation | Effect | Parameters |
|-----------|--------|------------|
| Convolution | Feature extraction | Kernel weights |
| Stride > 1 | Downsampling | None (hyperparameter) |
| Padding | Preserve dimensions | None (hyperparameter) |
| Pooling | Downsample, invariance | None |

#### Diagram: Convolution Visualizer

<iframe src="../../sims/convolution-operation/main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/convolution-operation/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Convolution Operation Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand how convolution kernels slide across images and the effect of stride and padding

Visual elements:
- Input image (grayscale, small e.g., 7×7)
- Kernel overlay showing current position
- Output feature map being built
- Kernel weights displayed
- Highlighted multiplication-addition operation

Interactive controls:
- Step through kernel positions manually
- Kernel size selector (3×3, 5×5)
- Stride selector (1, 2)
- Padding selector (valid, same)
- "Animate Convolution" button
- Preset kernels: edge detection, blur, sharpen

Default parameters:
- 7×7 grayscale input
- 3×3 kernel
- Stride 1, valid padding
- Edge detection kernel

Behavior:
- Show kernel sliding across input
- Display element-wise multiplication
- Show sum being placed in output
- Output dimensions update with settings
- Visualize different kernel effects on sample image

Implementation: p5.js with image processing
</details>

## Normalization Techniques

Normalization stabilizes training by controlling activation distributions.

### Batch Normalization

**Batch normalization** normalizes activations across the batch dimension:

For a mini-batch $\{x_i\}_{i=1}^m$:

$\mu_B = \frac{1}{m}\sum_{i=1}^m x_i$

$\sigma_B^2 = \frac{1}{m}\sum_{i=1}^m (x_i - \mu_B)^2$

$\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}$

$y_i = \gamma \hat{x}_i + \beta$

where:

- $\gamma$ and $\beta$ are learnable scale and shift parameters
- $\epsilon$ is a small constant for numerical stability
- During inference, running averages of $\mu$ and $\sigma$ are used

Benefits:

- Enables higher learning rates
- Reduces sensitivity to initialization
- Acts as regularization (due to batch statistics noise)

### Layer Normalization

**Layer normalization** normalizes across the feature dimension instead of batch:

$\mu_l = \frac{1}{d}\sum_{j=1}^d x_j$

$\sigma_l^2 = \frac{1}{d}\sum_{j=1}^d (x_j - \mu_l)^2$

Benefits:

- Works with batch size 1
- Preferred in transformers and RNNs
- No difference between training and inference

| Normalization | Normalize Over | Best For |
|---------------|----------------|----------|
| Batch Norm | Batch dimension | CNNs, large batches |
| Layer Norm | Feature dimension | Transformers, RNNs |
| Instance Norm | Spatial dimensions | Style transfer |
| Group Norm | Channel groups | Small batch CNNs |

#### Diagram: Normalization Comparison

<iframe src="../../sims/normalization-comparison/main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/normalization-comparison/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Batch vs Layer Normalization</summary>
Type: infographic

Bloom Taxonomy Level: Analyze

Learning Objective: Understand the difference between normalization techniques by visualizing which dimensions they operate over

Layout: Side-by-side comparison with 3D tensor diagrams

Visual elements:
- 3D tensor representation (batch × channels × spatial)
- Highlighted region showing normalization scope
- Before/after distribution plots
- Learnable parameter display

Sections:
1. Batch Normalization
   - Normalize across batch (vertical slice)
   - Show statistics computed per channel
   - Training vs inference difference noted

2. Layer Normalization
   - Normalize across features (horizontal slice)
   - Show statistics computed per sample
   - Same computation in training and inference

3. Comparison table
   - Batch dependency
   - Use cases
   - Computational considerations

Interactive elements:
- Toggle to highlight normalization region
- Slider to show effect on activation distribution
- Animation of statistics computation

Implementation: HTML/CSS/JavaScript with 3D tensor SVG
</details>

## Tensors and Tensor Operations

Modern deep learning operates on **tensors**—multi-dimensional arrays that generalize vectors and matrices.

### Tensor Definition

A **tensor** is a multi-dimensional array:

- 0D tensor: scalar (e.g., $3.14$)
- 1D tensor: vector (e.g., $\mathbf{x} \in \mathbb{R}^n$)
- 2D tensor: matrix (e.g., $A \in \mathbb{R}^{m \times n}$)
- 3D tensor: e.g., RGB image $\in \mathbb{R}^{H \times W \times 3}$
- 4D tensor: batch of images $\in \mathbb{R}^{B \times H \times W \times C}$

### Common Tensor Operations

| Operation | Description | Example |
|-----------|-------------|---------|
| Reshape | Change shape, preserve elements | $(6,) \to (2, 3)$ |
| Transpose | Permute axes | $(B, H, W, C) \to (B, C, H, W)$ |
| Broadcasting | Expand dimensions for elementwise ops | $(3,) + (2, 3) \to (2, 3)$ |
| Concatenate | Join along axis | Two $(B, 10) \to (B, 20)$ |
| Stack | Create new axis | Two $(H, W) \to (2, H, W)$ |
| Squeeze/Unsqueeze | Remove/add size-1 dimensions | $(1, 3, 1) \to (3,)$ |

### Tensor Operations in Neural Networks

**Batched matrix multiplication:**

For batched inputs $A \in \mathbb{R}^{B \times M \times K}$ and $B \in \mathbb{R}^{B \times K \times N}$:

$(A @ B)_{b,i,j} = \sum_k A_{b,i,k} \cdot B_{b,k,j}$

Result has shape $B \times M \times N$.

**Einsum notation** provides a powerful way to express tensor operations:

```python
# Batched matrix multiply
torch.einsum('bik,bkj->bij', A, B)

# Attention: Q @ K^T
torch.einsum('bqd,bkd->bqk', Q, K)
```

#### Diagram: Tensor Shape Visualizer

<iframe src="../../sims/tensor-operations/main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run Fullscreen](../../sims/tensor-operations/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Tensor Operations Visualizer</summary>
Type: microsim

Bloom Taxonomy Level: Apply

Learning Objective: Understand tensor shapes and how common operations transform them

Visual elements:
- 3D/4D tensor visualization as nested boxes
- Shape annotation on each dimension
- Operation selector showing input → output shapes
- Animated transformation between shapes

Interactive controls:
- Input tensor shape editor
- Operation selector: reshape, transpose, squeeze, concatenate, broadcast
- Target shape input (for reshape)
- Axis selector (for operations that need it)
- "Apply Operation" button

Default parameters:
- Input tensor shape: (2, 3, 4)
- Operation: reshape to (6, 4)
- Canvas: responsive

Behavior:
- Visualize tensor as nested rectangles
- Show valid reshape targets
- Animate element rearrangement
- Error message for invalid operations
- Display resulting shape

Implementation: p5.js with 3D tensor rendering
</details>

## Putting It All Together

Here's a complete neural network implementation using these concepts:

```python
import numpy as np

class NeuralNetwork:
    def __init__(self, layer_sizes):
        """Initialize network with given layer sizes."""
        self.L = len(layer_sizes) - 1  # number of layers
        self.weights = []
        self.biases = []

        # Xavier initialization
        for i in range(self.L):
            n_in, n_out = layer_sizes[i], layer_sizes[i+1]
            W = np.random.randn(n_out, n_in) * np.sqrt(2.0 / n_in)
            b = np.zeros((n_out, 1))
            self.weights.append(W)
            self.biases.append(b)

    def relu(self, z):
        return np.maximum(0, z)

    def relu_derivative(self, z):
        return (z > 0).astype(float)

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=0, keepdims=True))
        return exp_z / np.sum(exp_z, axis=0, keepdims=True)

    def forward(self, X):
        """Forward propagation."""
        self.activations = [X]
        self.pre_activations = []

        A = X
        for l in range(self.L):
            Z = self.weights[l] @ A + self.biases[l]
            self.pre_activations.append(Z)

            if l == self.L - 1:  # output layer
                A = self.softmax(Z)
            else:  # hidden layers
                A = self.relu(Z)
            self.activations.append(A)

        return A

    def backward(self, Y):
        """Backpropagation with cross-entropy loss."""
        m = Y.shape[1]
        self.weight_grads = []
        self.bias_grads = []

        # Output layer gradient (softmax + cross-entropy)
        dA = self.activations[-1] - Y  # simplified gradient

        for l in range(self.L - 1, -1, -1):
            if l == self.L - 1:
                dZ = dA  # softmax-CE gradient
            else:
                dZ = dA * self.relu_derivative(self.pre_activations[l])

            dW = (1/m) * dZ @ self.activations[l].T
            db = (1/m) * np.sum(dZ, axis=1, keepdims=True)

            self.weight_grads.insert(0, dW)
            self.bias_grads.insert(0, db)

            if l > 0:
                dA = self.weights[l].T @ dZ

    def update(self, learning_rate):
        """Gradient descent update."""
        for l in range(self.L):
            self.weights[l] -= learning_rate * self.weight_grads[l]
            self.biases[l] -= learning_rate * self.bias_grads[l]

    def train(self, X, Y, epochs, learning_rate):
        """Training loop."""
        for epoch in range(epochs):
            # Forward pass
            predictions = self.forward(X)

            # Compute loss
            loss = -np.mean(Y * np.log(predictions + 1e-8))

            # Backward pass
            self.backward(Y)

            # Update weights
            self.update(learning_rate)

            if epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")

# Example usage
net = NeuralNetwork([784, 128, 64, 10])  # MNIST-like
```

## Summary

This chapter revealed the linear algebra powering neural networks:

**Foundations:**

- **Perceptrons** compute linear decision boundaries: $y = \text{sign}(\mathbf{w}^T\mathbf{x} + b)$
- **Neurons** add nonlinear activations: $a = \sigma(\mathbf{w}^T\mathbf{x} + b)$

**Activation Functions:**

- **ReLU:** $\max(0, z)$ — efficient, sparse, avoids vanishing gradients
- **Sigmoid:** $(0, 1)$ output for probabilities
- **Softmax:** probability distribution over $K$ classes

**Network Architecture:**

- **Weight matrices** $W^{[l]}$ transform between layers
- **Hidden layers** enable hierarchical feature learning
- **Deep networks** compose multiple transformations

**Training:**

- **Forward propagation:** sequential matrix operations through layers
- **Loss functions:** MSE for regression, cross-entropy for classification
- **Backpropagation:** chain rule computes gradients via matrix transposes

**Convolutional Networks:**

- **Kernels** slide across spatial dimensions with weight sharing
- **Stride** and **padding** control output dimensions
- **Pooling** provides downsampling and translation invariance

**Normalization and Tensors:**

- **Batch normalization:** normalize across batch dimension
- **Layer normalization:** normalize across feature dimension
- **Tensors:** multi-dimensional arrays with reshape, transpose, broadcast operations

??? question "Self-Check: Why does backpropagation use the transpose of the weight matrix when propagating gradients?"
    When propagating gradients backward from layer $l+1$ to layer $l$, we need to compute how changes in $\mathbf{a}^{[l]}$ affect the loss. During forward propagation, we computed $\mathbf{z}^{[l+1]} = W^{[l+1]}\mathbf{a}^{[l]}$. The Jacobian $\frac{\partial \mathbf{z}^{[l+1]}}{\partial \mathbf{a}^{[l]}} = W^{[l+1]}$. By the chain rule, the gradient with respect to $\mathbf{a}^{[l]}$ is $(W^{[l+1]})^T \delta^{[l+1]}$, where the transpose distributes the error from each output neuron back to the input neurons that contributed to it.
