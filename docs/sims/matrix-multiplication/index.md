---
title: Matrix Multiplication Visualizer
description: Step-by-step visualization of matrix multiplication showing row-by-column dot product calculations with animation and highlighting.
image: /sims/matrix-multiplication/matrix-multiplication.png
og:image: /sims/matrix-multiplication/matrix-multiplication.png
twitter:image: /sims/matrix-multiplication/matrix-multiplication.png
quality_score: 90
social:
   cards: false
---

# Matrix Multiplication Visualizer

<iframe src="main.html" height="407px" width="100%" scrolling="no"></iframe>

[Run the Matrix Multiplication MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the Matrix Multiplication MicroSim with the p5.js editor](https://editor.p5js.org/dmccreary/sketches/Xkp-I7oRS)

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/linear-algebra/sims/matrix-multiplication/main.html" height="407px" scrolling="no"></iframe>
```

## About This MicroSim

Matrix multiplication is the most important and nuanced matrix operation in linear algebra—and arguably the most misunderstood! This interactive MicroSim transforms an abstract algorithm into a visual, step-by-step experience that makes the row-by-column dot product process crystal clear. Watch as matrices come alive with color-coded highlighting, animated calculations, and real-time feedback that turns confusion into understanding.

**Key Features:**

- **Color-Coded Highlighting**: The current row of A glows blue while the matching column of B glows green, showing exactly which vectors combine to form each result
- **Step-by-Step Animation**: Watch each element-wise multiplication happen in real-time with the current operation highlighted in yellow
- **Live Running Sum**: See the dot product accumulate as each term is added, building intuition for how entries are computed
- **Operations Counter**: Displays the total number of multiplications and additions required, reinforcing computational complexity concepts
- **Auto-Play Mode**: Sit back and watch the entire multiplication unfold automatically at adjustable speeds
- **Flexible Dimensions**: Experiment with 2×2, 2×3, 3×2, and 3×3 matrices to understand dimension compatibility rules

## How to Use This MicroSim

### Controls

| Control | Function |
|---------|----------|
| **A Dimension Selector** | Choose the dimensions of matrix A (2×2, 2×3, 3×2, or 3×3) |
| **B Dimension Selector** | Choose the dimensions of matrix B (options depend on A's columns) |
| **Reset** | Generate new random matrices and restart the visualization |
| **First/Next Multiplication** | Step through the calculation one multiplication at a time |
| **Auto/Stop** | Toggle automatic playback of the entire multiplication |
| **Animation Speed Slider** | Adjust playback speed (Slower on left, Faster on right) |

### Understanding the Calculation Display

The MicroSim displays the dot product calculation using special notation to show progress:

| Notation | Meaning | Description |
|----------|---------|-------------|
| $3 \times 2$ | **Completed** | This multiplication has been computed and added to the running sum |
| $[4 \times 5]$ | **Current** | This is the multiplication about to be performed (square brackets) |
| $(2 \times 1)$ | **Pending** | This multiplication is waiting to be computed (parentheses) |

For example, when computing $c_{12}$ with a 3-element dot product:

$$3 \times 2 + [4 \times 5] + (2 \times 1)$$

$$\underbrace{3 \times 2}_{\text{Done}} + \underbrace{[4 \times 5]}_{\text{Current}} + \underbrace{(2 \times 1)}_{\text{Future}}$$

### Step-by-Step Walkthrough

1. **Start Fresh**: Click **Reset** to generate new random matrices
2. **Observe the Setup**: Notice how matrix A (blue-tinted) and B (green-tinted) are displayed with their dimensions shown below
3. **Click First Multiplication**: The first row of A and first column of B light up, showing which elements combine
4. **Watch the Calculation**: The equation area shows the dot product formula with the current term in brackets
5. **See the Running Sum**: After each multiplication, the running sum updates in red
6. **Continue Stepping**: Click **Next Multiplication** to process each term until the entry is complete
7. **Move to Next Entry**: Once $c_{11}$ is computed (shown in gold), the visualization moves to $c_{12}$
8. **Try Auto Mode**: Click **Auto** to watch the entire process animate automatically

### Tips for Learning

- **Predict Before Clicking**: Before each step, mentally calculate what the running sum will be
- **Slow Down**: Use the Animation Speed slider to slow down auto-play for careful observation
- **Change Dimensions**: Try different matrix sizes to see how the number of operations changes
- **Count Operations**: Notice how the "Number of Operations" line updates when you change dimensions

## How Matrix Multiplication Works

For matrices A (m×n) and B (n×p), the result C is an (m×p) matrix where:

$$c_{ij} = \sum_{k=1}^{n} a_{ik} \cdot b_{kj}$$

Each entry $c_{ij}$ is the **dot product** of row $i$ of A with column $j$ of B.

### Dimension Compatibility Rule

The number of **columns** in A must equal the number of **rows** in B:

| Matrix A | Matrix B | Result C | Valid? |
|----------|----------|----------|--------|
| 2×3 | 3×2 | 2×2 | Yes |
| 3×2 | 3×4 | — | No |
| 2×2 | 2×2 | 2×2 | Yes |

## Lesson Plan

### Learning Objectives

After using this MicroSim, students will be able to:

1. Explain the row-by-column dot product process for computing each entry
2. Determine the dimensions of the result matrix given input dimensions
3. Identify when two matrices can be multiplied (dimension compatibility)
4. Calculate individual entries of a matrix product

### Guided Exploration (7-10 minutes)

1. **Watch One Entry**: Click "First Multiplication" then "Next Multiplication" repeatedly to see $c_{11}$ computed step by step
2. **Observe the Notation**: Notice how completed terms have no brackets, the current term has square brackets, and future terms have parentheses
3. **Use Auto-Play**: Click "Auto" to watch the entire multiplication animate automatically
4. **Change Dimensions**: Try 3×3 matrices to see more computation steps and higher operation counts
5. **Predict Before Clicking**: Before each step, predict what the running sum will become

### Key Discussion Points

- **Not Commutative**: Unlike regular multiplication, AB ≠ BA in general
- **Dimension Flow**: (m×n) × (n×p) → (m×p) — the inner dimensions must match
- **Computational Cost**: Each entry requires n multiplications and n-1 additions

### Assessment Questions

1. For A (2×3) and B (3×4), what are the dimensions of C = AB?
2. How many multiplication operations are needed to compute one entry of C?
3. If A[1,2] = 3 and B[2,1] = 4, what is their contribution to C[1,1]?

## References

- [Chapter 2: Matrices and Matrix Operations](../../chapters/02-matrices-and-matrix-operations/index.md) - Matrix multiplication in context
- [3Blue1Brown: Matrix Multiplication](https://www.youtube.com/watch?v=XkY2DOUCWMU) - Visual intuition for matrix multiplication
