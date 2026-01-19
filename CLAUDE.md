# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **intelligent textbook** for Applied Linear Algebra for AI and Machine Learning, built with MkDocs Material. The course covers 15 chapters spanning vectors, matrices, eigenvalues, neural networks, computer vision, and autonomous systems. Content is generated using Claude skills from the `~/.claude/skills/` directory.

**Live site:** https://dmccreary.github.io/linear-algebra/

## Common Commands

```bash
# Serve locally with live reload
mkdocs serve

# Build static site
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy
```

## Architecture

### Content Structure

- `docs/chapters/NN-chapter-name/index.md` - Chapter content (15 chapters)
- `docs/sims/sim-name/` - Interactive MicroSimulations (p5.js)
- `docs/learning-graph/` - Learning graph with 300 concepts and dependencies
- `docs/course-description.md` - Course metadata and learning objectives

### MicroSim Structure

Each MicroSim in `docs/sims/` follows this pattern:
```
sim-name/
├── index.md          # Documentation with iframe embed
├── main.html         # Standalone HTML wrapper (links to external CSS/JS)
├── sim-name.js       # JavaScript simulation code
├── sim-name.css      # Styles (if needed beyond standard CSS)
└── metadata.json     # Educational metadata (Bloom's level, prerequisites)
```

**Important:** CSS and JavaScript must be in separate files, NOT inline in `main.html`. The HTML file should only contain the document structure and link to external stylesheets and scripts. This keeps code maintainable and allows teachers to easily copy and modify individual files.

MicroSims use p5.js with WEBGL for 3D rendering. They are embedded via iframe in chapter content.

### MicroSim Portability Goal

**Important:** All MicroSims should be designed so teachers can copy the JavaScript file directly into the [p5.js editor](https://editor.p5js.org/) and run it without any changes to HTML or CSS. This allows easy editing, experimentation, and customization by educators.

The standard HTML wrapper (`main.html`) and CSS are minimal and should not contain sim-specific logic:

```css
/* Standard CSS - do not add sim-specific styles */
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}
canvas {
  display: block;
}
```

All simulation logic, styling, and layout should be handled within the JavaScript file itself.

The p5.js editor uses this standard `index.html` (we name ours `main.html`):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta charset="utf-8" />
  </head>
  <body>
    <main>
    </main>
    <script src="sketch.js"></script>
  </body>
</html>
```

**Differences from p5.js editor defaults:**
- We use `main.html` instead of `index.html`
- We use the MicroSim name for the JS file (e.g., `vector-2d-3d-visualizer.js`) instead of `sketch.js`
- We do not include the p5.sound library by default (the editor includes `p5.sound.min.js`)

### MicroSim index.md Template

Every MicroSim `index.md` must include both Fullscreen and Edit links after the iframe:

```markdown
<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Name Fullscreen](./main.html){ .md-button .md-button--primary }

[Edit the MicroSim Name with the p5.js editor](https://editor.p5js.org/)
```

The Edit link allows teachers to quickly open the p5.js editor. Update the URL with a specific sketch ID (e.g., `https://editor.p5js.org/dmccreary/sketches/xxxxx`) after uploading the sketch.

### Chapter Content Format

Chapters use YAML frontmatter with generation metadata:
```yaml
---
title: Chapter Title
description: Brief description
generated_by: claude skill chapter-content-generator
date: YYYY-MM-DD HH:MM:SS
version: 0.03
---
```

Chapters contain:
- Summary and concepts list
- Prerequisites linking to other chapters
- Detailed content with LaTeX math (`$inline$` and `$$block$$`)
- `#### Diagram:` headers followed by `<details markdown="1">` blocks containing MicroSim specifications
- Self-check questions using `??? question` admonition syntax

### Learning Graph

The `docs/learning-graph/concept-list.md` contains 300 concepts organized by chapter. The graph viewer at `docs/sims/graph-viewer/` visualizes concept dependencies.

## Key Conventions

- **Reading level:** College undergraduate (specified in course-description.md)
- **Math rendering:** MathJax via pymdownx.arithmatex
- **Admonitions:** Use `!!!` for notes/warnings, `???` for collapsible questions
- **Diagram specs:** Always prefix with `#### Diagram: [Name]` before `<details>` block
- **No indentation** inside `<details markdown="1">` blocks (MkDocs requirement)
- **Blank line required** before markdown lists and tables

## WEBGL MicroSim Fixes

When creating p5.js sketches with WEBGL mode, address these common issues:

### 1. Parent Controls to Container
DOM elements (sliders, buttons, checkboxes) must be parented to the canvas container for positioning to work in iframes:
```javascript
const container = document.querySelector('main');
xSlider = createSlider(-5, 5, 3, 0.1);
xSlider.parent(container);  // Required
xSlider.position(x, y);
```
Also add `position: relative` to the container CSS.

### 2. No setLineDash() in WEBGL
Use manual dashed lines instead of `drawingContext.setLineDash()`:
```javascript
function drawDashedLine2D(x1, y1, x2, y2) {
    let steps = 10;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
    }
}
```

### 3. Load Font for WEBGL Text
WEBGL requires explicit font loading:
```javascript
let font;
function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}
function setup() {
    createCanvas(width, height, WEBGL);
    textFont(font);
}
```

### 4. WEBGL Coordinate System
Origin is at center. For screen-space drawing:
```javascript
push();
resetMatrix();
translate(-canvasWidth/2, -canvasHeight/2);  // Move origin to top-left
text('Title', x, y);
pop();
```
