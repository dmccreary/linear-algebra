---
title: RGB Channel Decomposition
description: Interactive visualization showing how RGB color channels combine to form color images
image: /sims/rgb-channel-decomposition/rgb-channel-decomposition.png
quality_score: 90
---
# RGB Channel Decomposition

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the RGB Channel Decomposition Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the RGB Channel Decomposition with the p5.js editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim demonstrates how color images are composed of three separate channels: Red, Green, and Blue. Each channel is a grayscale matrix that, when combined, produces the full-color image.

## How to Use

1. **Select an Image Pattern**: Choose from Rainbow, Sunset, Nature, or Random patterns

2. **Channel Intensity Sliders**: Adjust the R, G, B sliders (0-100%) to see how reducing a channel's contribution affects the final image

3. **Channel Toggles**: Enable/disable individual channels to see their contribution

4. **Color Tint Toggle**: Switch between color-tinted channel views and grayscale views

5. **Hover**: Move mouse over any pixel to see its RGB values

## Learning Objectives

Students will be able to:
- Understand that color images consist of three separate channels
- Analyze how each channel contributes to the final color
- Recognize the additive nature of RGB color mixing
- Connect matrix operations to color image manipulation

## Key Concepts

- **Additive Color Model**: RGB colors add together - mixing all three at full intensity produces white
- **Channel Independence**: Each channel is a separate matrix that can be processed independently
- **Color Space**: RGB is the standard for displays; other spaces (HSV, YCbCr) are used for different purposes

## Lesson Plan

### Introduction (5 minutes)
Explain that every color on a screen is created by mixing red, green, and blue light at different intensities. This is fundamentally different from mixing paints (subtractive color).

### Exploration (10 minutes)
1. Start with Rainbow - observe how pure hues use different channel combinations
2. Disable channels one at a time to see their contribution
3. Reduce channel intensities to see how colors shift

### Interactive Exercise (10 minutes)
1. Try to predict: What color results from R=255, G=255, B=0? (Yellow)
2. What about R=255, G=0, B=255? (Magenta)
3. Why does the sky appear mostly in the Blue channel?

### Discussion Questions
- Why do we use three channels? (Human vision has three cone types)
- What would happen with four channels? (Some cameras use RGBW)
- How does JPEG compression use this? (YCbCr separates brightness from color)

## References

- [Chapter 13: Image Processing and Computer Vision](../../chapters/13-image-processing-and-computer-vision/index.md)
- [RGB Color Model - Wikipedia](https://en.wikipedia.org/wiki/RGB_color_model)
