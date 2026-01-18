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
├── main.html         # Standalone HTML wrapper
├── sim-name.js       # p5.js simulation code
└── metadata.json     # Educational metadata (Bloom's level, prerequisites)
```

MicroSims use p5.js with WEBGL for 3D rendering. They are embedded via iframe in chapter content.

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
