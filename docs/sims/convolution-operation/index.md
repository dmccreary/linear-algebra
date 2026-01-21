---
title: Convolution Operation
description: Interactive visualization of the convolution operation showing how kernels slide across images with stride and padding controls.
image: /sims/convolution-operation/convolution-operation.png
og:image: /sims/convolution-operation/convolution-operation.png
twitter:image: /sims/convolution-operation/convolution-operation.png
social:
   cards: false
---
# Convolution Operation

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Convolution Operation Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This visualization shows exactly how convolution works in convolutional neural networks (CNNs). Watch as the kernel slides across the input image, performing element-wise multiplication and summing to produce each output pixel.

### The Convolution Formula

$(\mathbf{I} * \mathbf{K})_{i,j} = \sum_{m}\sum_{n} I_{i+m, j+n} \cdot K_{m,n}$

### Output Size Formula

$\text{output\_size} = \frac{\text{input\_size} - \text{kernel\_size} + 2 \times \text{padding}}{\text{stride}} + 1$

### Interactive Features

- **Kernel Selector**: Try different kernels (edge detection, blur, sharpen, etc.)
- **Stride**: Change how many pixels the kernel moves between positions
- **Padding**: Valid (no padding) or Same (preserve dimensions)
- **Step**: Advance one position at a time
- **Animate**: Watch the full convolution process

### Preset Kernels

| Kernel | Effect | Pattern |
|--------|--------|---------|
| Edge Detect | Highlights edges | Center +8, neighbors -1 |
| Blur | Smooths image | All equal weights |
| Sharpen | Enhances details | Center +5, cross -1 |
| Sobel X | Detects vertical edges | Gradient filter |

## Lesson Plan

### Learning Objectives

Students will be able to:

1. Explain how convolution kernels extract features from images
2. Calculate output dimensions given input size, kernel size, stride, and padding
3. Describe the effect of different kernel patterns
4. Understand weight sharing in convolutional layers

### Suggested Activities

1. **Dimension Calculation**: For each stride/padding combination, verify the output size formula
2. **Kernel Exploration**: Compare what edge detection vs blur kernels produce
3. **Manual Computation**: Pause and verify one output value by hand
4. **Same vs Valid**: When would you choose "same" padding over "valid"?

### Discussion Questions

1. Why does convolution reduce spatial dimensions (with valid padding)?
2. How does a 3×3 kernel have only 9 parameters but process arbitrarily large images?
3. What real-world features might an edge detection kernel capture?
4. Why might we use stride > 1 instead of pooling for downsampling?

## Mathematical Details

A 3×3 kernel with stride 1 and valid padding on a 7×7 input:

- Output size: $(7 - 3 + 0) / 1 + 1 = 5×5$
- Parameters: 9 weights + 1 bias = 10

## References

- LeCun et al. (1998). Gradient-Based Learning Applied to Document Recognition
- Krizhevsky et al. (2012). ImageNet Classification with Deep CNNs
