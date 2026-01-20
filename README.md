# Linear Algebra for AI and Machine Learning

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/linear-algebra/)
[![GitHub](https://img.shields.io/badge/GitHub-dmccreary%2Flinear--Algebra-blue?logo=github)](https://github.com/dmccreary/linear-algebra)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/linear-algebra/](https://dmccreary.github.io/linear-algebra/)

## Overview

This is an interactive, AI-generated intelligent textbook on **Applied Linear Algebra for AI and Machine Learning**, designed for college undergraduates and anyone seeking to understand the mathematical foundations of modern AI systems. Built using MkDocs with the Material theme, it incorporates learning graphs, concept dependencies, and interactive MicroSims (p5.js simulations) that bring abstract mathematical concepts to life.

Linear algebra is the language in which modern AI systems are written. From the matrix operations that power neural networks to the transformations that enable computer vision and autonomous vehicles, this textbook bridges the gap between abstract mathematics and real-world applications. The course spans 15 chapters covering vectors, matrices, eigenvalues, neural networks, generative AI, computer vision, and autonomous systems.

The textbook follows Bloom's Taxonomy (2001 revision) for learning outcomes and uses concept dependency graphs with 300 concepts to ensure proper prerequisite sequencing. All content is generated and curated using Claude AI skills, making it a Level 2+ intelligent textbook with interactive elements.

## Site Status and Metrics

| Metric | Count |
|--------|-------|
| Concepts in Learning Graph | 300 |
| Chapters | 15 |
| Markdown Files | 62 |
| Total Words | ~98,000 |
| Interactive MicroSims | 8 |
| Images | 7 |

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/linear-algebra.git
cd linear-algebra
```

### Install Dependencies

This project uses MkDocs with the Material theme:

```bash
pip install mkdocs
pip install mkdocs-material
```

### Build and Serve Locally

Serve locally for development (with live reload):

```bash
mkdocs serve
```

Open your browser to `http://localhost:8000`

Build the static site:

```bash
mkdocs build
```

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

This will build the site and push it to the `gh-pages` branch.

### Using the Book

**Navigation:**

- Use the left sidebar to browse chapters
- Click on the search icon to search all content
- Each chapter includes self-check questions and interactive elements

**Interactive MicroSims:**

- Found in the "MicroSims" section of the navigation
- Each simulation runs standalone in your browser
- Adjust parameters with sliders and controls to explore concepts

**Customization:**

- Edit markdown files in `docs/` to modify content
- Modify `mkdocs.yml` to change site structure
- Add your own MicroSims in `docs/sims/`
- Customize theme in `docs/css/extra.css`

## Repository Structure

```
linear-algebra/
├── docs/                          # MkDocs documentation source
│   ├── chapters/                  # 15 chapter directories
│   │   ├── 01-vectors-and-vector-spaces/
│   │   ├── 02-matrices-and-matrix-operations/
│   │   └── ...
│   ├── sims/                      # Interactive p5.js MicroSims
│   │   ├── graph-viewer/          # Learning graph visualizer
│   │   ├── vector-2d-3d-visualizer/
│   │   └── ...
│   ├── learning-graph/            # 300 concepts with dependencies
│   │   ├── concept-list.md
│   │   ├── concept-taxonomy.md
│   │   └── quality-metrics.md
│   ├── course-description.md      # Full course overview
│   └── index.md                   # Homepage
├── mkdocs.yml                     # MkDocs configuration
├── CLAUDE.md                      # Claude Code guidance
└── README.md                      # This file
```

## Reporting Issues

Found a bug, typo, or have a suggestion for improvement? Please report it:

[GitHub Issues](https://github.com/dmccreary/linear-algebra/issues)

When reporting issues, please include:

- Description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/environment details (for MicroSims)

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**

- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

## Acknowledgements

This project is built on the shoulders of giants in the open source community:

- **[MkDocs](https://www.mkdocs.org/)** - Static site generator optimized for project documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Beautiful, responsive theme
- **[p5.js](https://p5js.org/)** - Creative coding library for interactive MicroSims
- **[vis-network](https://visjs.org/)** - Network visualization library for learning graphs
- **[MathJax](https://www.mathjax.org/)** - Beautiful mathematics rendering
- **[Claude AI](https://claude.ai)** by Anthropic - AI-assisted content generation
- **[GitHub Pages](https://pages.github.com/)** - Free hosting for open source projects

Special thanks to the educators and developers who contribute to making educational resources accessible and interactive.

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, suggestions, or collaboration opportunities? Feel free to connect on LinkedIn or open an issue on GitHub.
