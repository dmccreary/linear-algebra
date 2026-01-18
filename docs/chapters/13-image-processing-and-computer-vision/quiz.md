# Quiz: Image Processing and Computer Vision

Test your understanding of image representation, filtering, and computer vision concepts.

---

#### 1. A grayscale image is represented as:

<div class="upper-alpha" markdown>
1. A 3D tensor with RGB channels
2. A 2D matrix of intensity values
3. A 1D vector of pixel positions
4. A list of color names
</div>

??? question "Show Answer"
    The correct answer is **B**. A grayscale image is a 2D matrix where each entry represents the intensity (brightness) of a pixel, typically ranging from 0 (black) to 255 (white).

    **Concept Tested:** Grayscale Image

---

#### 2. An RGB image is stored as:

<div class="upper-alpha" markdown>
1. A single 2D matrix
2. Three separate matrices (one per color channel)
3. A 1D array of values
4. A text file
</div>

??? question "Show Answer"
    The correct answer is **B**. An RGB image consists of three 2D matrices (or a 3D tensor), one for each color channel: Red, Green, and Blue. Each pixel has three values.

    **Concept Tested:** RGB Image

---

#### 3. Image convolution:

<div class="upper-alpha" markdown>
1. Increases image resolution
2. Applies a kernel to extract features or transform the image
3. Converts color to grayscale
4. Compresses the image
</div>

??? question "Show Answer"
    The correct answer is **B**. Convolution slides a kernel (small matrix) across the image, computing weighted sums at each position. Different kernels produce different effects like blurring, sharpening, or edge detection.

    **Concept Tested:** Image Convolution

---

#### 4. A Gaussian blur filter:

<div class="upper-alpha" markdown>
1. Sharpens edges in the image
2. Smooths the image by averaging with Gaussian-weighted neighbors
3. Detects vertical edges only
4. Increases image contrast
</div>

??? question "Show Answer"
    The correct answer is **B**. Gaussian blur uses weights that follow a Gaussian distribution, giving more weight to nearby pixels. This produces smooth, natural-looking blur without blocky artifacts.

    **Concept Tested:** Blur Filter

---

#### 5. The Sobel operator is used for:

<div class="upper-alpha" markdown>
1. Image compression
2. Edge detection by computing image gradients
3. Color space conversion
4. Image resizing
</div>

??? question "Show Answer"
    The correct answer is **B**. The Sobel operator approximates image derivatives (gradients) to detect edges. It uses two kernels: one for horizontal gradients ($G_x$) and one for vertical gradients ($G_y$).

    **Concept Tested:** Sobel Operator

---

#### 6. The Fourier transform of an image reveals:

<div class="upper-alpha" markdown>
1. The color distribution
2. Frequency components (how quickly intensity changes)
3. The number of objects
4. The image dimensions
</div>

??? question "Show Answer"
    The correct answer is **B**. The Fourier transform decomposes an image into frequency components. Low frequencies represent gradual changes (smooth areas); high frequencies represent rapid changes (edges, textures).

    **Concept Tested:** Fourier Transform

---

#### 7. SVD-based image compression works by:

<div class="upper-alpha" markdown>
1. Removing all color information
2. Keeping only the largest singular values and discarding the rest
3. Reducing the number of pixels
4. Converting to a different file format
</div>

??? question "Show Answer"
    The correct answer is **B**. SVD compression keeps only the $k$ largest singular values, which capture the most important structure. The approximation $A_k = \sum_{i=1}^k \sigma_i u_i v_i^T$ requires less storage.

    **Concept Tested:** Image Compression

---

#### 8. In Harris corner detection, a corner is characterized by:

<div class="upper-alpha" markdown>
1. Only one large eigenvalue of the structure tensor
2. Two large eigenvalues of the structure tensor
3. Zero eigenvalues
4. Negative eigenvalues
</div>

??? question "Show Answer"
    The correct answer is **B**. At a corner, the structure tensor has two large eigenvalues, indicating significant intensity changes in both directions. An edge has one large eigenvalue; flat regions have none.

    **Concept Tested:** Feature Detection

---

#### 9. A homography transformation:

<div class="upper-alpha" markdown>
1. Only handles rotation
2. Maps points between two planes, handling perspective
3. Is always the identity
4. Only works on 1D signals
</div>

??? question "Show Answer"
    The correct answer is **B**. A homography is a 3×3 projective transformation that maps points between two planes. It can represent perspective distortion, rotation, scaling, and translation.

    **Concept Tested:** Homography

---

#### 10. The convolution theorem states that convolution in spatial domain equals:

<div class="upper-alpha" markdown>
1. Addition in frequency domain
2. Multiplication in frequency domain
3. Division in frequency domain
4. Convolution in frequency domain
</div>

??? question "Show Answer"
    The correct answer is **B**. The convolution theorem states that $f * g = \mathcal{F}^{-1}(\mathcal{F}(f) \cdot \mathcal{F}(g))$. Convolution in spatial domain corresponds to element-wise multiplication in frequency domain.

    **Concept Tested:** Frequency Domain
