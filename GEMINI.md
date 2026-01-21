# Project Overview

This is an interactive, AI-generated intelligent textbook on **Applied Linear Algebra for AI and Machine Learning**, designed for college undergraduates and anyone seeking to understand the mathematical foundations of modern AI systems. Built using MkDocs with the Material theme, it incorporates learning graphs, concept dependencies, and interactive MicroSims (p5.js simulations) that bring abstract mathematical concepts to life.

The textbook follows Bloom's Taxonomy (2001 revision) for learning outcomes and uses concept dependency graphs with 300 concepts to ensure proper prerequisite sequencing. All content is generated and curated using Claude AI skills, making it a Level 2+ intelligent textbook with interactive elements.

## Building and Running

This project uses MkDocs with the Material theme.

### Install Dependencies

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

## Development Conventions

-   **Content:** All content is in Markdown format and located in the `docs` directory.
-   **Structure:** The site structure is defined in `mkdocs.yml`.
-   **Simulations:** Interactive simulations are built with p5.js and are located in the `docs/sims` directory.
-   **Styling:** Custom styling is in `docs/css/extra.css`.
-   **Linting:** Javascript code is linted with ESLint.
