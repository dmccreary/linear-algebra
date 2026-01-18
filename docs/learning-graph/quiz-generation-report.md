# Quiz Generation Quality Report

**Generated:** 2026-01-17
**Skill Version:** Quiz Generator v0.2

## Overall Statistics

| Metric | Value |
|--------|-------|
| **Total Chapters** | 15 |
| **Total Questions** | 150 |
| **Avg Questions per Chapter** | 10 |
| **Overall Quality Score** | 82/100 |
| **Chapters with Full Content** | 14 |
| **Chapters with Stub Content** | 1 (Ch 5) |

## Per-Chapter Summary

| Chapter | Title | Questions | Concepts | Content Status |
|---------|-------|-----------|----------|----------------|
| 1 | Vectors and Vector Spaces | 10 | 27 | Full |
| 2 | Matrices and Matrix Operations | 10 | 23 | Full |
| 3 | Systems of Linear Equations | 10 | 23 | Full |
| 4 | Linear Transformations | 10 | 27 | Full |
| 5 | Determinants and Matrix Properties | 10 | 12 | Stub* |
| 6 | Eigenvalues and Eigenvectors | 10 | 17 | Full |
| 7 | Matrix Decompositions | 10 | 19 | Full |
| 8 | Vector Spaces and Inner Products | 10 | 19 | Full |
| 9 | Machine Learning Foundations | 10 | 20 | Full |
| 10 | Neural Networks and Deep Learning | 10 | 26 | Full |
| 11 | Generative AI and LLMs | 10 | 19 | Full |
| 12 | Optimization and Learning Algorithms | 10 | 14 | Full |
| 13 | Image Processing and Computer Vision | 10 | 16 | Full |
| 14 | 3D Geometry and Transformations | 10 | 17 | Full |
| 15 | Autonomous Systems and Sensor Fusion | 10 | 20 | Full |

*Chapter 5 quiz generated from concept list only; content pending.

## Bloom's Taxonomy Distribution

### Target Distribution (Intermediate Chapters)

| Level | Target | Description |
|-------|--------|-------------|
| Remember | 25% | Recall facts, terms, basic concepts |
| Understand | 30% | Explain ideas, comprehend relationships |
| Apply | 30% | Use knowledge in new situations |
| Analyze | 15% | Draw connections, identify patterns |
| Evaluate | 0% | Make judgments (advanced only) |
| Create | 0% | Produce original work (advanced only) |

### Actual Distribution (Estimated)

| Level | Actual | Target | Deviation |
|-------|--------|--------|-----------|
| Remember | 28% | 25% | +3% ✓ |
| Understand | 35% | 30% | +5% ✓ |
| Apply | 25% | 30% | -5% ✓ |
| Analyze | 12% | 15% | -3% ✓ |

**Bloom's Distribution Score:** 22/25 (good distribution)

## Answer Balance

### Overall Distribution

| Answer | Count | Percentage | Target |
|--------|-------|------------|--------|
| A | 37 | 24.7% | 25% |
| B | 41 | 27.3% | 25% |
| C | 36 | 24.0% | 25% |
| D | 36 | 24.0% | 25% |

**Answer Balance Score:** 14/15 (excellent distribution, slight B bias)

## Question Quality Analysis

| Metric | Score | Notes |
|--------|-------|-------|
| Well-formed questions | 100% | All questions end with ? |
| Quality distractors | 88% | Plausible alternatives |
| Clear explanations | 100% | All have explanations |
| Concept attribution | 100% | All identify tested concept |
| Unique questions | 100% | No duplicates |

**Question Quality Score:** 28/30

## Coverage Analysis

### Chapters 1-4 (Introductory - Linear Algebra Foundations)

- Strong coverage of fundamental concepts
- Vectors, matrices, systems, transformations well represented
- Good mix of computational and conceptual questions

### Chapters 5-8 (Intermediate - Advanced Linear Algebra)

- Chapter 5: Limited to concept list (content pending)
- Eigenvalues/eigenvectors thoroughly tested
- Matrix decompositions cover SVD, QR, Cholesky
- Inner products and orthogonality well covered

### Chapters 9-12 (Machine Learning and AI)

- ML foundations connect linear algebra to applications
- Neural networks emphasize matrix operations
- Attention mechanisms and transformers included
- Optimization covers both classical and modern methods

### Chapters 13-15 (Applications - Vision and Robotics)

- Image processing links to convolution and Fourier
- 3D geometry covers rotations, homogeneous coordinates
- Autonomous systems integrates all previous concepts

## Recommendations

### High Priority

1. **Generate Chapter 5 content** - Currently a stub; quiz based on concepts only
2. **Add 2-3 more Apply-level questions** per chapter to reach 30% target
3. **Reduce B answer frequency** slightly (currently 27.3%)

### Medium Priority

1. Consider adding alternative questions for high-centrality concepts
2. Add more computational questions with specific numerical examples
3. Include questions that span multiple concepts

### Low Priority

1. Create study guide versions of quizzes
2. Export to LMS-compatible formats (Moodle XML, Canvas QTI)
3. Add timed quiz mode suggestions

## Technical Notes

### Format Compliance

All quizzes use the mkdocs-material question admonition format:

```markdown
#### N. Question text?

<div class="upper-alpha" markdown>
1. Option A
2. Option B
3. Option C
4. Option D
</div>

??? question "Show Answer"
    The correct answer is **X**. [Explanation]

    **Concept Tested:** [Concept Name]
```

### Requirements

For proper rendering, ensure `mkdocs.yml` includes:

```yaml
markdown_extensions:
  - admonition
  - pymdownx.details
  - attr_list
  - md_in_html
```

### CSS for Upper-Alpha Lists

The `upper-alpha` class requires custom CSS in `docs/css/extra.css`:

```css
.upper-alpha ol {
    list-style-type: upper-alpha;
}
```

## Summary

- **150 questions** generated across 15 chapters
- **Quality Score: 82/100** (good)
- All questions have explanations and concept attribution
- Answer distribution well-balanced (24-27% per option)
- Chapter 5 needs content generation for improved quiz quality
