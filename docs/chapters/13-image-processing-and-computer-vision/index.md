---
title: Image Processing and Computer Vision
description: Linear algebra foundations for image representation, filtering, and transformation
generated_by: claude skill chapter-content-generator
date: 2026-01-17 19:00:00
version: 0.03
---

# Image Processing and Computer Vision

## Summary

Images are matrices of pixel values, making linear algebra the natural language for image processing and computer vision. This chapter covers image representation as matrices and tensors, convolution operations, image filtering (blur, sharpen, edge detection), Fourier transforms, and feature detection. You will also learn about homography for perspective transformations.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Image Matrix
2. Grayscale Image
3. RGB Image
4. Image Tensor
5. Image Convolution
6. Image Filter
7. Blur Filter
8. Sharpen Filter
9. Edge Detection
10. Sobel Operator
11. Fourier Transform
12. Frequency Domain
13. Image Compression
14. Color Space Transform
15. Feature Detection
16. Homography

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Matrices and Matrix Operations](../02-matrices-and-matrix-operations/index.md)
- [Chapter 4: Linear Transformations](../04-linear-transformations/index.md)
- [Chapter 7: Matrix Decompositions](../07-matrix-decompositions/index.md) (for SVD-based compression)
- [Chapter 10: Neural Networks and Deep Learning](../10-neural-networks-and-deep-learning/index.md) (for tensors)

---

## Introduction

Every digital image you see—from smartphone photos to medical scans—is fundamentally a matrix of numbers. This mathematical representation enables powerful image processing operations using linear algebra:

- **Matrix operations** enable pixel-wise transformations
- **Convolution** applies local filters for blurring, sharpening, and edge detection
- **Fourier transforms** reveal frequency content for compression and filtering
- **Linear transformations** correct perspective and align images

Understanding these foundations illuminates how image editing software, computer vision systems, and neural networks process visual information.

## Image Representation

### The Image Matrix

A digital image is stored as a **matrix** where each entry represents a pixel's intensity or color value. For an image with height $H$ and width $W$:

$\mathbf{I} \in \mathbb{R}^{H \times W}$

The matrix entry $I_{i,j}$ corresponds to the pixel at row $i$ (from top) and column $j$ (from left). Pixel values are typically integers in $[0, 255]$ or floats in $[0, 1]$.

### Grayscale Images

A **grayscale image** uses a single value per pixel representing light intensity:

- 0 = black (no light)
- 255 = white (maximum light)
- Intermediate values = shades of gray

| Value Range | Interpretation |
|-------------|----------------|
| 0-50 | Very dark |
| 50-100 | Dark gray |
| 100-150 | Medium gray |
| 150-200 | Light gray |
| 200-255 | Very bright |

A 1920×1080 HD grayscale image is a matrix with over 2 million entries.

#### Diagram: Image Matrix Visualizer

<iframe src="../../sims/image-matrix-visualizer/main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Image Matrix Visualizer Fullscreen](../../sims/image-matrix-visualizer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Image Matrix Visualizer</summary>
Type: microsim

Learning objective: Understand how pixel values in a matrix correspond to image appearance (Bloom: Understand)

Visual elements:
- Left panel: Small grayscale image (e.g., 8×8 or 16×16 pixels)
- Right panel: Matrix showing numeric values
- Hover highlight connecting matrix cell to corresponding pixel
- Color gradient legend (0=black to 255=white)

Interactive controls:
- Dropdown: Select sample image (checkerboard, gradient, simple shape, random)
- Slider: Zoom level for image display
- Click on matrix cell to highlight corresponding pixel
- Click on pixel to highlight corresponding matrix cell
- Button: "Edit mode" to modify individual pixel values

Canvas layout: 800x500px with side-by-side image and matrix

Behavior:
- Hovering over matrix cell highlights pixel with colored border
- Editing a value immediately updates the image
- Show real-time pixel coordinates and value on hover
- Display image dimensions and total pixel count

Implementation: p5.js with matrix rendering and image display
</details>

### RGB Images

Color images use **three channels**—Red, Green, Blue—each stored as a separate matrix:

$\mathbf{I}_R, \mathbf{I}_G, \mathbf{I}_B \in \mathbb{R}^{H \times W}$

Each pixel is a triplet $(r, g, b)$ where each component ranges from 0 to 255:

| Color | RGB Value |
|-------|-----------|
| Red | (255, 0, 0) |
| Green | (0, 255, 0) |
| Blue | (0, 0, 255) |
| Yellow | (255, 255, 0) |
| Cyan | (0, 255, 255) |
| Magenta | (255, 0, 255) |
| White | (255, 255, 255) |
| Black | (0, 0, 0) |

The RGB color model is **additive**—colors are created by adding light. Mixing all three at full intensity produces white.

### Image Tensors

For computational purposes, color images are often represented as **3D tensors**:

$\mathbf{I} \in \mathbb{R}^{H \times W \times C}$

where:

- $H$ is the height (rows)
- $W$ is the width (columns)
- $C$ is the number of channels (3 for RGB, 4 for RGBA with transparency)

In deep learning, batches of images form **4D tensors**:

$\mathbf{X} \in \mathbb{R}^{N \times C \times H \times W}$

where $N$ is the batch size. The ordering of dimensions varies by framework (PyTorch uses $N \times C \times H \times W$; TensorFlow often uses $N \times H \times W \times C$).

#### Diagram: RGB Channel Decomposition

<iframe src="../../sims/rgb-channel-decomposition/main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the RGB Channel Decomposition Fullscreen](../../sims/rgb-channel-decomposition/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>RGB Channel Decomposition</summary>
Type: microsim

Learning objective: Visualize how RGB channels combine to form color images (Bloom: Analyze)

Visual elements:
- Original color image (center or top)
- Three grayscale images showing R, G, B channels separately
- Color-tinted versions of each channel (red, green, blue tints)
- Reconstructed image from selected channels

Interactive controls:
- Image selector: Choose from sample images
- Channel toggles: Enable/disable R, G, B for reconstruction
- Slider: Adjust individual channel intensity (0-100%)
- Toggle: Show grayscale vs color-tinted channel views

Canvas layout: 800x600px with original and channel displays

Behavior:
- Disabling a channel shows image without that color component
- Adjusting channel intensity shows over/under-saturation effects
- Hover over pixel to show (r, g, b) values
- Real-time reconstruction as channels are modified

Implementation: p5.js with pixel array manipulation
</details>

### Color Space Transforms

While RGB is standard for display, other **color spaces** are useful for specific tasks:

| Color Space | Components | Use Cases |
|-------------|------------|-----------|
| RGB | Red, Green, Blue | Display, storage |
| HSV/HSB | Hue, Saturation, Value | Color selection, segmentation |
| HSL | Hue, Saturation, Lightness | Web design, color adjustment |
| YCbCr | Luminance, Chrominance | JPEG compression |
| LAB | Lightness, a*, b* | Perceptual uniformity |

Converting between color spaces involves matrix transformations. For example, RGB to YCbCr:

#### RGB to YCbCr Transform

$\begin{bmatrix} Y \\ C_b \\ C_r \end{bmatrix} = \begin{bmatrix} 0.299 & 0.587 & 0.114 \\ -0.169 & -0.331 & 0.500 \\ 0.500 & -0.419 & -0.081 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix} + \begin{bmatrix} 0 \\ 128 \\ 128 \end{bmatrix}$

where:

- $Y$ is luminance (brightness information)
- $C_b$ and $C_r$ are chrominance (color difference signals)
- The matrix weights reflect human perception (green contributes most to perceived brightness)

This separation enables **chroma subsampling**—reducing color resolution while preserving brightness detail—which is fundamental to JPEG compression.

## Image Convolution

**Convolution** is the foundational operation for image filtering. It applies a small matrix called a **kernel** or **filter** to every location in the image.

### The Convolution Operation

For a 2D image $\mathbf{I}$ and kernel $\mathbf{K}$ of size $(2k+1) \times (2k+1)$:

#### 2D Convolution Formula

$(\mathbf{I} * \mathbf{K})[i, j] = \sum_{m=-k}^{k} \sum_{n=-k}^{k} I[i+m, j+n] \cdot K[m, n]$

where:

- $*$ denotes convolution (not multiplication)
- $(i, j)$ is the output pixel location
- The kernel is centered at each pixel
- Values outside the image boundary require padding (zero, replicate, or reflect)

Convolution is a **linear operation**: convolving with a sum of kernels equals the sum of individual convolutions.

### Image Filters

An **image filter** is a kernel designed to achieve a specific effect. The kernel values determine what features are enhanced or suppressed.

| Filter Type | Effect | Kernel Property |
|-------------|--------|-----------------|
| Low-pass (blur) | Smooths, reduces noise | Positive values, sums to 1 |
| High-pass (sharpen) | Enhances edges | Positive center, negative surround |
| Derivative (edge) | Detects changes | Sums to 0, antisymmetric |
| Identity | No change | 1 at center, 0 elsewhere |

#### Diagram: Convolution Visualizer

<iframe src="../../sims/convolution-visualizer/main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Convolution Visualizer Fullscreen](../../sims/convolution-visualizer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Convolution Visualizer</summary>
Type: microsim

Learning objective: Understand how convolution applies a kernel to an image (Bloom: Apply)

Visual elements:
- Input image (grayscale, small for clarity)
- Sliding kernel window highlighted on input
- Kernel matrix with current values displayed
- Output image being constructed
- Calculation panel showing element-wise products and sum

Interactive controls:
- Kernel selector: Identity, Blur 3×3, Sharpen, Edge detect
- Custom kernel editor: 3×3 grid of editable values
- Animation speed slider
- Button: "Step" (advance one pixel)
- Button: "Run" (animate full convolution)
- Toggle: Show/hide calculation details

Canvas layout: 900x600px with input, kernel, and output panels

Behavior:
- Animate kernel sliding across input image
- Show element-wise multiplication at current position
- Display running sum being computed
- Fill in output pixel when calculation completes
- Handle boundary conditions visually

Implementation: p5.js with step-by-step animation
</details>

### Blur Filters

**Blur filters** smooth images by averaging neighboring pixels, reducing noise and fine detail.

**Box Blur (Mean Filter):**

$\mathbf{K}_{box} = \frac{1}{9} \begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}$

Every pixel contributes equally. Simple but creates blocky artifacts.

**Gaussian Blur:**

$\mathbf{K}_{gauss} = \frac{1}{16} \begin{bmatrix} 1 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 1 \end{bmatrix}$

Weights follow a Gaussian distribution—center pixels contribute more. Produces smoother, more natural blurring.

The general Gaussian kernel is:

$G(x, y) = \frac{1}{2\pi\sigma^2} e^{-\frac{x^2 + y^2}{2\sigma^2}}$

where $\sigma$ controls the blur radius. Larger $\sigma$ means more blurring.

### Sharpen Filters

**Sharpen filters** enhance edges and fine detail by emphasizing differences between neighboring pixels:

$\mathbf{K}_{sharpen} = \begin{bmatrix} 0 & -1 & 0 \\ -1 & 5 & -1 \\ 0 & -1 & 0 \end{bmatrix}$

This kernel can be understood as:
- Identity (center = 1) plus
- Negative Laplacian (edge enhancement)

The result amplifies differences while preserving overall brightness.

#### Diagram: Filter Effects Gallery

<iframe src="../../sims/filter-effects-gallery/main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Filter Effects Gallery Fullscreen](../../sims/filter-effects-gallery/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Filter Effects Gallery</summary>
Type: microsim

Learning objective: Compare effects of different filters on the same image (Bloom: Evaluate)

Visual elements:
- Original image (top center)
- Grid of filtered results (4-6 variants)
- Kernel display below each filtered image
- Difference image option (filtered - original)

Interactive controls:
- Image selector: Choose sample image
- Filter checkboxes: Select which filters to display
- Slider: Filter strength/radius where applicable
- Toggle: Show difference images
- Toggle: Show kernel matrices

Canvas layout: 900x700px with grid layout

Behavior:
- All filters applied to same source image
- Hover over filtered image to see kernel
- Click to show full-size comparison
- Side-by-side slider for before/after on selected filter

Implementation: p5.js with multiple filter implementations
</details>

## Edge Detection

**Edge detection** identifies boundaries in images where intensity changes rapidly. Edges correspond to object boundaries, texture changes, and depth discontinuities.

### Derivative-Based Edge Detection

Edges are locations of high **gradient magnitude**. The image gradient at pixel $(i, j)$:

$\nabla I = \begin{bmatrix} \frac{\partial I}{\partial x} \\ \frac{\partial I}{\partial y} \end{bmatrix}$

The gradient magnitude and direction:

$|\nabla I| = \sqrt{\left(\frac{\partial I}{\partial x}\right)^2 + \left(\frac{\partial I}{\partial y}\right)^2}$

$\theta = \arctan\left(\frac{\partial I / \partial y}{\partial I / \partial x}\right)$

### The Sobel Operator

The **Sobel operator** approximates image derivatives using convolution:

#### Sobel Kernels

$\mathbf{G}_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix}, \quad \mathbf{G}_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ +1 & +2 & +1 \end{bmatrix}$

where:

- $\mathbf{G}_x$ detects vertical edges (horizontal gradient)
- $\mathbf{G}_y$ detects horizontal edges (vertical gradient)
- The weights provide smoothing (via the 1-2-1 pattern) combined with differentiation

The Sobel operator combines Gaussian smoothing with differentiation, making it more robust to noise than simple difference operators.

| Edge Detector | Kernel Size | Noise Sensitivity | Edge Localization |
|---------------|-------------|-------------------|-------------------|
| Simple difference | 1×2 | High | Good |
| Prewitt | 3×3 | Medium | Good |
| Sobel | 3×3 | Low | Good |
| Scharr | 3×3 | Low | Better rotational symmetry |

#### Diagram: Edge Detection Visualizer

<iframe src="../../sims/edge-detection-visualizer/main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Edge Detection Visualizer Fullscreen](../../sims/edge-detection-visualizer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Edge Detection Visualizer</summary>
Type: microsim

Learning objective: Understand how Sobel operators detect edges in different orientations (Bloom: Analyze)

Visual elements:
- Original grayscale image
- Gx result (horizontal gradient) with positive/negative coloring
- Gy result (vertical gradient) with positive/negative coloring
- Gradient magnitude image
- Gradient direction overlay (as arrows or color wheel)

Interactive controls:
- Image selector: Simple shapes, photos, text
- Toggle: Show Gx, Gy, magnitude, direction
- Slider: Threshold for edge display
- Toggle: Show gradient arrows at sample points
- Dropdown: Edge detector (Sobel, Prewitt, Scharr)

Canvas layout: 850x650px with multi-panel display

Behavior:
- Compute and display gradient components
- Color-code positive (white) and negative (black) gradients
- Threshold slider converts magnitude to binary edges
- Arrow overlay shows gradient direction at grid points

Implementation: p5.js with Sobel convolution
</details>

### Edge Detection Pipeline

Complete edge detection typically involves:

1. **Smoothing:** Gaussian blur to reduce noise
2. **Gradient computation:** Sobel or similar operator
3. **Non-maximum suppression:** Thin edges to single-pixel width
4. **Thresholding:** Keep only strong edges (hysteresis thresholding in Canny)

The **Canny edge detector** implements this full pipeline and remains widely used.

## Fourier Transform for Images

The **Fourier transform** represents images in the **frequency domain**, revealing periodic patterns and enabling frequency-based filtering.

### The 2D Discrete Fourier Transform

For an $M \times N$ image, the 2D DFT is:

#### 2D Discrete Fourier Transform

$F(u, v) = \sum_{x=0}^{M-1} \sum_{y=0}^{N-1} f(x, y) \cdot e^{-2\pi i \left(\frac{ux}{M} + \frac{vy}{N}\right)}$

where:

- $f(x, y)$ is the spatial domain image
- $F(u, v)$ is the frequency domain representation
- $(u, v)$ are frequency coordinates
- Low frequencies (near center) represent gradual changes
- High frequencies (near edges) represent rapid changes

The inverse transform recovers the original image:

$f(x, y) = \frac{1}{MN} \sum_{u=0}^{M-1} \sum_{v=0}^{N-1} F(u, v) \cdot e^{2\pi i \left(\frac{ux}{M} + \frac{vy}{N}\right)}$

### Frequency Domain Interpretation

| Frequency Region | Spatial Meaning |
|------------------|-----------------|
| DC component (center) | Average brightness |
| Low frequencies | Smooth regions, gradual changes |
| High frequencies | Edges, textures, fine detail |
| Specific frequency | Periodic patterns (e.g., stripes) |

The **magnitude spectrum** $|F(u,v)|$ shows which frequencies are present.

The **phase spectrum** $\angle F(u,v)$ encodes spatial structure—surprisingly, phase carries more perceptual information than magnitude.

#### Diagram: Fourier Transform Visualizer

<iframe src="../../sims/fourier-transform-visualizer/main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Fourier Transform Visualizer Fullscreen](../../sims/fourier-transform-visualizer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Fourier Transform Visualizer</summary>
Type: microsim

Learning objective: Connect spatial image features to frequency domain representation (Bloom: Analyze)

Visual elements:
- Original image (left)
- Magnitude spectrum (center, log-scaled for visibility)
- Phase spectrum (right, as color wheel or grayscale)
- Reconstructed image after filtering

Interactive controls:
- Image selector: Stripes, checkerboard, photo, text
- Frequency filter: Low-pass, high-pass, band-pass (adjustable radius)
- Toggle: Show magnitude/phase/both
- Slider: Filter cutoff frequency
- Button: Apply filter and show reconstruction

Canvas layout: 900x600px with three-panel display

Behavior:
- Compute and display FFT magnitude (log scale)
- Interactive frequency selection by clicking on spectrum
- Show effect of zeroing selected frequencies
- Real-time filter preview on reconstruction

Implementation: p5.js with FFT library (or pre-computed examples)
</details>

### Frequency Domain Filtering

Filtering in the frequency domain involves:

1. Compute FFT of image: $F = \mathcal{F}(f)$
2. Multiply by filter: $G = F \cdot H$
3. Compute inverse FFT: $g = \mathcal{F}^{-1}(G)$

Common frequency domain filters:

| Filter | Frequency Mask | Effect |
|--------|----------------|--------|
| Ideal low-pass | 1 if $\sqrt{u^2+v^2} < r$, else 0 | Blur (with ringing) |
| Gaussian low-pass | $e^{-(u^2+v^2)/2\sigma^2}$ | Smooth blur |
| Ideal high-pass | 0 if $\sqrt{u^2+v^2} < r$, else 1 | Edge enhancement |
| Notch filter | 0 at specific frequencies | Remove periodic noise |

The **convolution theorem** connects spatial and frequency domains:

$f * g = \mathcal{F}^{-1}(\mathcal{F}(f) \cdot \mathcal{F}(g))$

Convolution in spatial domain equals multiplication in frequency domain.

## Image Compression

**Image compression** reduces storage size by exploiting redundancies in image data. Linear algebra provides key tools for lossy compression.

### SVD-Based Compression

The **Singular Value Decomposition** represents an image as a sum of rank-1 matrices:

$\mathbf{I} = \sum_{i=1}^{r} \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$

where:

- $\sigma_i$ are singular values (in decreasing order)
- $\mathbf{u}_i, \mathbf{v}_i$ are left and right singular vectors
- $r$ is the rank of the image matrix

Keeping only the $k$ largest singular values gives the best rank-$k$ approximation:

$\mathbf{I}_k = \sum_{i=1}^{k} \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$

| Original Storage | Compressed Storage | Compression Ratio |
|-----------------|-------------------|-------------------|
| $H \times W$ values | $k(H + W + 1)$ values | $\frac{HW}{k(H+W+1)}$ |

For a 1000×1000 image with $k=50$: compression ratio ≈ 10:1.

#### Diagram: SVD Compression Visualizer

<iframe src="../../sims/svd-compression-visualizer/main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the SVD Compression Visualizer Fullscreen](../../sims/svd-compression-visualizer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>SVD Compression Visualizer</summary>
Type: microsim

Learning objective: Understand how SVD achieves image compression by truncating singular values (Bloom: Apply)

Visual elements:
- Original image
- Reconstructed image from k singular values
- Singular value plot (bar chart or line, log scale)
- Error image (original - reconstructed)
- Compression statistics display

Interactive controls:
- Slider: Number of singular values k (1 to full rank)
- Image selector: Choose sample image
- Toggle: Show error image
- Toggle: Log scale for singular values
- Display: Compression ratio, PSNR, storage size

Canvas layout: 850x650px with image comparison and statistics

Behavior:
- Real-time reconstruction as k changes
- Show how image quality improves with more singular values
- Display storage calculation
- Highlight "knee" in singular value curve

Implementation: p5.js with pre-computed SVD (for performance)
</details>

### Transform Coding (JPEG)

JPEG compression uses the **Discrete Cosine Transform (DCT)**:

1. Divide image into 8×8 blocks
2. Apply 2D DCT to each block
3. Quantize coefficients (lossy step)
4. Entropy encode (lossless)

The DCT concentrates energy in low-frequency coefficients, which are preserved, while high-frequency coefficients (fine detail) are quantized more aggressively.

### Comparison of Compression Approaches

| Method | Type | Compression | Quality Control |
|--------|------|-------------|-----------------|
| SVD truncation | Lossy | Variable | Number of singular values |
| JPEG (DCT) | Lossy | High | Quality factor (1-100) |
| PNG (lossless) | Lossless | Moderate | N/A |
| WebP | Both | High | Quality factor |

## Feature Detection

**Feature detection** identifies distinctive points in images that can be matched across views, enabling applications like image stitching, object recognition, and 3D reconstruction.

### What Makes a Good Feature?

A good feature should be:

- **Distinctive:** Different from its neighbors
- **Repeatable:** Detectable despite changes in viewpoint, lighting, scale
- **Localizable:** Precisely positioned

| Feature Type | Detection Method | Invariance |
|--------------|-----------------|------------|
| Corners | Harris, Shi-Tomasi | Rotation |
| Blobs | DoG (SIFT), Hessian (SURF) | Rotation, Scale |
| Edges | Canny, Sobel | Limited |

### Harris Corner Detection

The **Harris corner detector** uses the **structure tensor** (second moment matrix):

#### Structure Tensor

$\mathbf{M} = \sum_{(x,y) \in W} \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix}$

where:

- $I_x, I_y$ are image derivatives
- $W$ is a local window (often Gaussian-weighted)
- The eigenvalues of $\mathbf{M}$ characterize the local structure

| Eigenvalue Pattern | Structure | Feature Type |
|-------------------|-----------|--------------|
| Both small | Flat region | Not a feature |
| One large, one small | Edge | Edge point |
| Both large | Corner | Good feature |

The Harris corner response:

$R = \det(\mathbf{M}) - k \cdot \text{trace}(\mathbf{M})^2 = \lambda_1 \lambda_2 - k(\lambda_1 + \lambda_2)^2$

where $k \approx 0.04$. Corners have high $R$ values.

#### Diagram: Corner Detection Visualizer

<iframe src="../../sims/corner-detection-visualizer/main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Corner Detection Visualizer Fullscreen](../../sims/corner-detection-visualizer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Corner Detection Visualizer</summary>
Type: microsim

Learning objective: Understand how eigenvalues of the structure tensor identify corners (Bloom: Analyze)

Visual elements:
- Input image with detected corners marked
- Structure tensor ellipse visualization at selected points
- Eigenvalue scatter plot (λ1 vs λ2)
- Corner response heat map

Interactive controls:
- Image selector: Checkerboard, building, shapes
- Slider: Harris k parameter (0.01 to 0.1)
- Slider: Response threshold
- Click on image to show local structure tensor
- Toggle: Show response heat map vs corner points

Canvas layout: 850x650px with image and analysis panels

Behavior:
- Compute Harris response for entire image
- Mark corners above threshold
- Click on pixel to show structure tensor as ellipse
- Ellipse axes aligned with eigenvectors, lengths proportional to eigenvalues

Implementation: p5.js with gradient and matrix computation
</details>

### Scale-Invariant Features

**SIFT (Scale-Invariant Feature Transform)** detects features at multiple scales:

1. Build **scale space** using Gaussian blur at multiple $\sigma$ values
2. Detect **blob-like structures** as extrema in Difference-of-Gaussian (DoG)
3. Compute **orientation** from local gradients
4. Build **descriptor** from gradient histograms

The 128-dimensional SIFT descriptor is robust to scale, rotation, and moderate viewpoint changes.

## Homography

A **homography** is a projective transformation between two planes, essential for perspective correction, panorama stitching, and augmented reality.

### The Homography Matrix

A homography maps points from one image to another via a 3×3 matrix:

#### Homography Transformation

$\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} \sim \mathbf{H} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix} = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$

where:

- $(x, y)$ and $(x', y')$ are corresponding points in homogeneous coordinates
- $\sim$ denotes equality up to scale
- $\mathbf{H}$ has 8 degrees of freedom (9 elements minus 1 for scale)

To recover Cartesian coordinates:

$x' = \frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}}, \quad y' = \frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}$

### Estimating Homographies

Given $n \geq 4$ point correspondences, we can estimate $\mathbf{H}$ by solving a linear system.

Each correspondence $(x_i, y_i) \leftrightarrow (x_i', y_i')$ provides two equations:

$\begin{bmatrix} x_i & y_i & 1 & 0 & 0 & 0 & -x_i'x_i & -x_i'y_i & -x_i' \\ 0 & 0 & 0 & x_i & y_i & 1 & -y_i'x_i & -y_i'y_i & -y_i' \end{bmatrix} \mathbf{h} = \mathbf{0}$

With 4+ correspondences, solve using SVD (find the null space of the coefficient matrix).

### Transformation Hierarchy

Homographies are part of a hierarchy of 2D transformations:

| Transformation | DOF | Preserves | Matrix Form |
|----------------|-----|-----------|-------------|
| Translation | 2 | Everything | $[I | t]$ |
| Euclidean (rigid) | 3 | Distances, angles | $[R | t]$ |
| Similarity | 4 | Angles, ratios | $[sR | t]$ |
| Affine | 6 | Parallelism | $[A | t]$ |
| Projective (homography) | 8 | Straight lines | General 3×3 |

#### Diagram: Homography Transformation Demo

<iframe src="../../sims/homography-demo/main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Homography Transformation Demo Fullscreen](../../sims/homography-demo/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Homography Transformation Demo</summary>
Type: microsim

Learning objective: Understand how homographies transform images for perspective correction (Bloom: Apply)

Visual elements:
- Source image with draggable corner points
- Transformed image showing perspective effect
- Homography matrix display
- Grid overlay showing transformation

Interactive controls:
- Drag corners of source quadrilateral
- Preset buttons: Perspective, rotation, shear, stretch
- Button: "Reset to identity"
- Toggle: Show transformation grid
- Display: Homography matrix values

Canvas layout: 800x600px with side-by-side source and result

Behavior:
- Compute homography from corner positions in real-time
- Apply inverse warp to display transformed image
- Show how parallel lines may not remain parallel
- Demonstrate perspective correction (make rectangle from trapezoid)

Implementation: p5.js with bilinear interpolation for warping
</details>

### Applications of Homography

| Application | How Homography Is Used |
|-------------|----------------------|
| Panorama stitching | Align overlapping images |
| Perspective correction | Straighten tilted documents/signs |
| Augmented reality | Overlay virtual objects on planar surfaces |
| Sports graphics | Insert ads on playing field |
| Image rectification | Correct lens distortion |

### Python Implementation

```python
import numpy as np

def compute_homography(src_pts, dst_pts):
    """
    Compute homography from 4+ point correspondences.
    src_pts, dst_pts: Nx2 arrays of corresponding points
    """
    n = src_pts.shape[0]
    A = []

    for i in range(n):
        x, y = src_pts[i]
        xp, yp = dst_pts[i]
        A.append([-x, -y, -1, 0, 0, 0, x*xp, y*xp, xp])
        A.append([0, 0, 0, -x, -y, -1, x*yp, y*yp, yp])

    A = np.array(A)

    # Solve using SVD
    _, _, Vt = np.linalg.svd(A)
    H = Vt[-1].reshape(3, 3)

    return H / H[2, 2]  # Normalize

def apply_homography(H, point):
    """Apply homography to a single point."""
    x, y = point
    p = np.array([x, y, 1])
    p_prime = H @ p
    return p_prime[:2] / p_prime[2]
```

## Summary

Image processing and computer vision are built on linear algebra foundations:

**Image Representation:**

- Images are matrices (grayscale) or tensors (color)
- RGB images have three channels; other color spaces serve specific purposes
- Color space transforms are matrix operations

**Filtering and Convolution:**

- Convolution applies kernels to extract features
- Blur filters average neighbors; sharpen filters enhance differences
- Edge detection uses derivative-approximating kernels like Sobel

**Frequency Domain:**

- Fourier transform reveals periodic structure
- Low frequencies encode smooth regions; high frequencies encode edges
- Frequency filtering multiplies spectra

**Compression:**

- SVD truncation provides rank-based compression
- Transform coding (DCT/JPEG) exploits frequency concentration

**Features and Geometry:**

- Corner detection uses structure tensor eigenvalues
- Homographies are projective transformations between planes
- 4 point correspondences determine a homography

## Self-Check Questions

??? question "Why does Gaussian blur produce smoother results than box blur?"
    Box blur weights all pixels in the kernel equally, creating abrupt transitions at the kernel boundary. This causes visible artifacts, especially in smooth gradients. Gaussian blur weights central pixels more heavily, with weights falling off smoothly according to the Gaussian function. This smooth weighting produces gradual blending without sharp discontinuities. Additionally, the Gaussian kernel is separable, meaning a 2D Gaussian blur can be computed as two 1D blurs, making it computationally efficient.

??? question "How does the Sobel operator combine smoothing with differentiation?"
    The Sobel kernels have a specific structure: they can be decomposed as the outer product of a smoothing filter [1, 2, 1] and a difference filter [-1, 0, 1]. For example, Gx = [1, 2, 1]^T × [-1, 0, 1]. The [1, 2, 1] component provides Gaussian-like smoothing perpendicular to the derivative direction, reducing noise sensitivity. The [-1, 0, 1] component computes the derivative. This combination makes Sobel more robust than simple difference operators while maintaining good edge localization.

??? question "Why does keeping the largest singular values give the best low-rank approximation?"
    The Eckart-Young-Mirsky theorem proves that the truncated SVD gives the optimal low-rank approximation in both Frobenius and spectral norms. Intuitively, each singular value represents the "energy" captured by that component—larger singular values correspond to more significant patterns in the image. By keeping the largest singular values, we retain the most important structure while discarding fine details associated with smaller singular values. The approximation error equals the sum of squared discarded singular values.

??? question "What is the geometric meaning of the Harris corner response being large?"
    The Harris response R = λ₁λ₂ - k(λ₁ + λ₂)² is large when both eigenvalues of the structure tensor are large. The eigenvalues measure how quickly image intensity changes in the principal directions. At a corner, intensity changes significantly in both directions (both eigenvalues large). At an edge, intensity changes in only one direction (one eigenvalue large, one small). In a flat region, intensity is constant (both eigenvalues small). The product λ₁λ₂ in the response ensures both must be large.
