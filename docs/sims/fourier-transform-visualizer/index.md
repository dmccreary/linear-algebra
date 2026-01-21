---
title: Fourier Transform Visualizer
description: Interactive visualization of 2D Fourier transform showing spatial to frequency domain conversion
image: /sims/fourier-transform-visualizer/fourier-transform-visualizer.png
quality_score: 90
---
# Fourier Transform Visualizer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Fourier Transform Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Fourier Transform Visualizer with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates the 2D Discrete Fourier Transform, showing how spatial patterns map to frequency representations and how frequency filtering affects images.

## How to Use

1. **Select an Image Pattern**: Different patterns produce characteristic frequency spectra

2. **Apply Frequency Filter**:
   - Low-pass: Keeps smooth areas, removes high frequencies (blurs)
   - High-pass: Keeps edges, removes low frequencies (edge enhancement)
   - Band-pass: Keeps specific frequency range

3. **Adjust Cutoff**: Control the filter radius in frequency space

## Panels Explained

| Panel | Shows |
|-------|-------|
| Original Image | Spatial domain input |
| Magnitude Spectrum | Frequency content (log-scaled for visibility) |
| Phase Spectrum | Spatial structure information (color-coded) |
| Filtered Image | Reconstruction after frequency filtering |

## Learning Objectives

Students will be able to:
- Understand the relationship between spatial patterns and frequency spectra
- Recognize that periodic patterns create discrete frequency peaks
- Apply frequency filtering for image processing
- Explain why phase carries more structural information than magnitude

## Key Insights

- **Vertical stripes** → Horizontal line in spectrum (perpendicular!)
- **More stripes** → Peaks farther from center (higher frequency)
- **Edges** → Broad frequency content (sharp transitions need many frequencies)
- **Phase** surprisingly carries most perceptual information

## Lesson Plan

### Introduction (5 minutes)
The Fourier transform decomposes an image into sine wave components. Every image is a sum of 2D sinusoids of different frequencies and orientations.

### Pattern-Spectrum Mapping (10 minutes)
1. Start with Vertical Stripes - observe the horizontal line in spectrum
2. Switch to Horizontal Stripes - the line rotates 90 degrees
3. Try Checkerboard - see the diagonal peaks
4. Single Edge - notice the broad frequency spread

### Frequency Filtering (10 minutes)
1. Apply Low-pass filter - smooth areas preserved, edges blur
2. Apply High-pass filter - only edges remain
3. Adjust cutoff to see gradual effect

### Discussion Questions
- Why does the spectrum have the pattern perpendicular to the image stripes?
- What does the DC component (center point) represent?
- Why would JPEG compression work in frequency domain?

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [Discrete Fourier Transform - Wikipedia](https://en.wikipedia.org/wiki/Discrete_Fourier_transform)
