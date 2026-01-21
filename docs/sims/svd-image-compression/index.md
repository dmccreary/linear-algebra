---
title: SVD Image Compression
description: Interactive demonstration of image compression using truncated SVD, showing the quality-storage tradeoff
image: /sims/svd-image-compression/svd-image-compression.png
---

# SVD Image Compression

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the SVD Image Compression Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim in the p5.js Editor](https://editor.p5js.org/){ .md-button .md-button--secondary }

## About This MicroSim

This visualization demonstrates **image compression using SVD** by showing:

- **Original image** as a grayscale matrix
- **Rank-k approximation** using truncated SVD
- **Error image** (difference between original and compressed)
- **Singular value spectrum** showing which values are kept

## Key Concepts

- Images can be represented as matrices (pixel values)
- SVD finds the "most important" directions in the image
- Keeping only top k singular values compresses the image
- Larger singular values capture more of the image structure

## How to Use

1. **Select a pattern** to generate different test images
2. **Adjust rank k** using the slider to control compression
3. **Observe** how image quality changes with k
4. **Watch** the singular value spectrum to see truncation point

## Statistics Explained

| Metric | Meaning |
|--------|---------|
| Compression | How many times smaller the storage |
| Error | Frobenius norm error as percentage |
| Variance | Percentage of total variance captured |
| Storage | Actual elements stored |

## Learning Objectives

After using this MicroSim, students will be able to:

- Apply SVD for image compression
- Understand the quality-storage tradeoff
- Interpret singular value spectra
- Choose appropriate truncation level

## References

- Chapter 7: Matrix Decompositions - Low-Rank Approximation
- Eckart-Young Theorem
