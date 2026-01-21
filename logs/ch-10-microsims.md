# Chapter 10 MicroSims Generation Log

**Date:** 2026-01-21
**Chapter:** 10 - Neural Networks and Deep Learning
**Task:** Generate MicroSims for all #### Diagram: headers in chapter content

## Summary

Generated 8 interactive MicroSims for Chapter 10 based on the diagram specifications in the chapter content. All MicroSims use p5.js for consistent styling and are width-responsive. The MicroSims cover fundamental neural network concepts from perceptrons to tensor operations.

## MicroSims Created

### 1. Perceptron Decision Boundary
- **Location:** `docs/sims/perceptron-decision-boundary/`
- **Bloom Level:** Understand (L2)
- **Features:**
  - 2D input space with two-class data points (red and blue)
  - Decision boundary line perpendicular to weight vector
  - Draggable weight vector to change boundary orientation
  - Bias slider to shift boundary position
  - "Add Point" mode to create custom datasets
  - "Run Perceptron Learning" button with animated steps
  - Preset datasets: Linearly Separable, XOR (not separable)
  - Classification accuracy display
  - Misclassified points highlighted
  - Weight update rule shown during learning

### 2. Activation Functions Visualizer
- **Location:** `docs/sims/activation-functions/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Side-by-side plots of multiple activation functions
  - Functions: ReLU, Sigmoid, Tanh, Leaky ReLU, Softplus
  - Derivative plots shown below each function
  - Saturation regions highlighted with shading
  - Checkboxes to toggle individual functions
  - Vertical line at x=0 to show output values
  - Movable x-position slider to explore function values
  - Legend with function equations
  - Vanishing gradient regions marked

### 3. Neural Network Architecture Visualizer
- **Location:** `docs/sims/neural-network-architecture/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Visual network diagram with layers as node columns
  - Connections drawn between adjacent layers
  - Layer configuration sliders (input, hidden, output sizes)
  - Number of hidden layers selector (1-3)
  - Weight matrix dimensions displayed between layers
  - Total parameter count calculation
  - Activation function selector per layer
  - Hover to highlight specific neuron connections
  - Color-coded layers (input: green, hidden: blue, output: orange)

### 4. Forward Propagation Visualizer
- **Location:** `docs/sims/forward-propagation/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Network diagram with data flowing left to right
  - Step-by-step animation of forward pass
  - Current layer highlighted during computation
  - Matrix computation displayed: z = Wx + b
  - Activation function application shown: a = f(z)
  - Numerical values displayed at each neuron
  - "Step" button for manual progression
  - "Auto-run" toggle for continuous animation
  - Input vector editor
  - Speed control slider
  - Reset button to restart from inputs

### 5. Backpropagation Visualizer
- **Location:** `docs/sims/backpropagation/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Network with gradients flowing right to left (red arrows)
  - Error signals (δ) displayed at each neuron
  - Chain rule expansion shown for selected connection
  - Weight gradients (∂L/∂w) displayed on connections
  - Step-by-step backward pass animation
  - Loss function selector (MSE, Cross-Entropy)
  - Target output editor
  - Gradient magnitude color coding (darker = larger)
  - "Step Back" button for manual progression
  - Gradient clipping visualization option
  - Current gradient values panel

### 6. Convolution Operation Visualizer
- **Location:** `docs/sims/convolution-operation/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - Input image grid (adjustable size)
  - Kernel overlay sliding across input
  - Output feature map building in real-time
  - Element-wise multiplication shown during computation
  - Sum result displayed before placement
  - Stride slider (1-3)
  - Padding toggle (valid vs same)
  - Preset kernels: Edge Detection (Sobel), Blur, Sharpen, Identity
  - Custom kernel value editor
  - Step button for manual sliding
  - Auto-animate toggle
  - Output dimension formula displayed

### 7. Normalization Comparison
- **Location:** `docs/sims/normalization-comparison/`
- **Bloom Level:** Analyze (L4)
- **Features:**
  - Side-by-side comparison of Batch Normalization vs Layer Normalization
  - 3D tensor visualization (batch, height, width)
  - Highlighted regions showing normalization scope
  - Statistics display: mean and variance for each method
  - Mini-batch size slider
  - Feature dimension slider
  - Before/after distribution histograms
  - Toggle to show gamma/beta learned parameters
  - Animation of normalization computation
  - Use case annotations (CNNs vs Transformers)

### 8. Tensor Operations Visualizer
- **Location:** `docs/sims/tensor-operations/`
- **Bloom Level:** Apply (L3)
- **Features:**
  - 3D tensor visualization with colored cells
  - Operation selector: Reshape, Transpose, Flatten, Squeeze, Unsqueeze
  - Dimension sliders for input tensor shape
  - Apply button with animated transformation
  - Before/after shape annotations
  - Element count verification (must be preserved)
  - Invalid reshape detection with error message
  - Axis selector for transpose and unsqueeze
  - Color tracking to show element movement
  - Common pattern examples (batch dimension, flatten for FC)

## Files Created Per MicroSim

Each MicroSim directory contains:
- `main.html` - HTML shell with p5.js CDN link
- `[name].js` - p5.js JavaScript code
- `index.md` - Documentation with iframe, lesson plan, and references
- `metadata.json` - Dublin Core metadata and control descriptions

## Technical Notes

- All MicroSims follow the standard template with:
  - `drawHeight` + `controlHeight` layout
  - Width-responsive design via `updateCanvasSize()`
  - Consistent color schemes
  - `describe()` function for accessibility

- Neural Network specific patterns:
  - Layer-by-layer visualization with node/connection paradigm
  - Animation of data and gradient flow
  - Matrix multiplication displays
  - Interactive weight/bias manipulation

- Convolution specific considerations:
  - Kernel sliding animation with position tracking
  - Element-wise multiplication highlighting
  - Output size calculation based on stride/padding

- Tensor operations:
  - 3D grid rendering for tensor visualization
  - Shape transformation animations
  - Element tracking with consistent coloring

## Navigation Updates

Added 8 entries to `mkdocs.yml` under MicroSims section (alphabetically):
- Activation Functions Visualizer
- Backpropagation Visualizer
- Convolution Operation Visualizer
- Forward Propagation Visualizer
- Neural Network Architecture Visualizer
- Normalization Comparison
- Perceptron Decision Boundary
- Tensor Operations Visualizer

## Chapter Content Updates

Added iframe embeds with fullscreen buttons to all 8 diagram sections in:
`docs/chapters/10-neural-networks-and-deep-learning/index.md`

## Related Chapter Content

The chapter covers:
- Perceptrons and linear classification
- Activation functions (ReLU, Sigmoid, Tanh)
- Multi-layer perceptrons and universal approximation
- Forward propagation and matrix operations
- Backpropagation and the chain rule
- Convolutional neural networks
- Batch and layer normalization
- Tensor operations in deep learning frameworks

## Next Steps

1. Test all MicroSims locally with `mkdocs serve`
2. Verify iframe heights match canvas heights
3. Add screenshot images (.png) for social media previews
4. Consider adding cross-references between related MicroSims
