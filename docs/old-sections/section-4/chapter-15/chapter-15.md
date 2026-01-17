# 📖 Chapter 15: Graph Theory and Linear Algebra

---

## Overview

Graph theory models **relationships between objects**, and linear algebra provides the powerful language to study these connections. In this chapter, you'll learn how **matrices** represent and analyze graphs, and how **eigenvalues and eigenvectors** reveal deep insights about network structure.

By extending your knowledge of matrices, projections, and spectral theory, you will now be able to tackle problems like:
- Finding important nodes in a network,
- Partitioning a network into communities,
- Modeling flow and connectivity in real-world systems.

---

## 15.1 Adjacency and Incidence Matrices

### Adjacency Matrix
An **adjacency matrix** $A$ for a graph with $n$ nodes is an $n \times n$ matrix where:
- $A_{ij} = 1$ if there is an edge from node $i$ to node $j$,
- $A_{ij} = 0$ otherwise.

If the graph is **undirected**, $A$ is symmetric.

#### Example
A simple graph:
```
1 --- 2
|     |
3 --- 4
```
Adjacency matrix:
$$
A = \begin{bmatrix}0 & 1 & 1 & 0 \\\\ 1 & 0 & 0 & 1 \\\\ 1 & 0 & 0 & 1 \\\\ 0 & 1 & 1 & 0\end{bmatrix}
$$

### Incidence Matrix
An **incidence matrix** $B$ for a graph with $n$ nodes and $m$ edges is an $n \times m$ matrix where:
- Each column represents an edge.
- Entries are $1$, $-1$, or $0$, depending on whether a node is the start or end of the edge (for directed graphs).

---

## 15.2 Graph Laplacians and Their Properties

### Definition
The **graph Laplacian** $L$ is defined as:
$$
L = D - A
$$
where:
- $D$ is the degree matrix (diagonal, with node degrees),
- $A$ is the adjacency matrix.

### Why the Laplacian?
- It captures both **local** (neighbor) and **global** (whole graph) structure.
- Laplacian eigenvalues reveal important properties like **connectivity** and **clustering**.

#### Key Properties:
- The smallest eigenvalue is always $0$.
- The number of zero eigenvalues = the number of connected components.

---

## 15.3 Spectral Clustering

### What is Spectral Clustering?
Spectral clustering uses the **eigenvectors** of the Laplacian matrix to group nodes into clusters.

### How It Works
1. Compute the Laplacian matrix $L$.
2. Find the eigenvectors corresponding to the smallest nonzero eigenvalues.
3. Treat rows of these eigenvectors as new coordinates.
4. Apply a simple clustering algorithm (like k-means) in this new space.

#### Visual Analogy
Imagine stretching a rubber band model of your graph. Natural clusters will "pull apart" — and that's what the eigenvectors show!

### Why It Works
The eigenvectors minimize a quantity called **graph cut**, ensuring that closely connected nodes stay together.

---

## 15.4 Connecting to Previous Topics

This chapter builds on:
- **Matrix representations**: Adjacency and incidence matrices extend your matrix vocabulary.
- **Eigenvalues and eigenvectors**: Understanding Laplacian spectra gives you a way to "feel" the structure of graphs.
- **Subspaces and projections**: Spectral clustering is really a projection of graph data into meaningful subspaces.

---

# ✏️ Quiz

#### Graph Theory and Linear Algebra

What matrix is typically used to understand graph connectivity and clustering in spectral graph theory?

<div class="upper-alpha" markdown>
A. Adjacency matrix  
B. Laplacian matrix  
C. Incidence matrix  
D. Degree matrix  
</div>

??? Question "Show Answer"
    The correct answer is **B**. The Laplacian matrix captures the structure of a graph and its eigenvalues and eigenvectors provide critical information for clustering, connectivity analysis, and spectral graph theory applications.

---

# ✅ Key Takeaways
- Adjacency and incidence matrices encode graph connections.
- The Laplacian matrix reveals deep structural properties of graphs.
- Spectral methods use eigenvalues and eigenvectors to partition graphs and analyze network connectivity.

---

Ready for Chapter 16? We'll explore **network flows, convolutions, and spatial transformations** next!
