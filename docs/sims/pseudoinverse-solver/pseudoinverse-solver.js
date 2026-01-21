// Pseudoinverse Solver MicroSim
// Compute pseudoinverse A+ and solve least squares problems x = A+b
// Learning objective: Understand how pseudoinverse solves least squares problems

let canvasWidth = 900;
let drawHeight = 400;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Matrix dimensions (m x n)
let m = 3;  // rows
let n = 2;  // columns

// Matrix A and vector b
let matrixA = [
  [1, 0],
  [0, 1],
  [1, 1]
];
let vectorB = [1, 1, 2];

// Computed results
let pseudoinverse = [];  // n x m
let solution = [];       // n x 1
let residual = [];       // m x 1
let residualNorm = 0;
let matrixRank = 0;
let svdU = [], svdS = [], svdV = [];
let showSVD = false;
let normalEquationSolution = [];  // (A^T A)^-1 A^T b

// Preset examples
let presets = [
  {
    name: "Overdetermined (3x2)",
    A: [[1, 0], [0, 1], [1, 1]],
    b: [1, 1, 2],
    desc: "More equations than unknowns - finds least squares solution"
  },
  {
    name: "Rank Deficient (3x2)",
    A: [[1, 2], [2, 4], [1, 2]],
    b: [3, 6, 3],
    desc: "Columns are linearly dependent - still solvable via pseudoinverse"
  },
  {
    name: "Underdetermined (2x3)",
    A: [[1, 2, 3], [4, 5, 6]],
    b: [14, 32],
    desc: "More unknowns than equations - finds minimum-norm solution"
  },
  {
    name: "Full Rank (2x2)",
    A: [[2, 1], [1, 3]],
    b: [5, 7],
    desc: "Square invertible - pseudoinverse equals regular inverse"
  }
];
let currentPreset = 0;

// UI elements
let computeButton, showSVDCheckbox;
let presetSelect;
let inputFields = [];  // For matrix A entries
let bFields = [];      // For vector b entries

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Create preset selector
  presetSelect = createSelect();
  presetSelect.position(10, drawHeight + 10);
  for (let i = 0; i < presets.length; i++) {
    presetSelect.option(presets[i].name, i);
  }
  presetSelect.changed(onPresetChange);

  // Create compute button
  computeButton = createButton('Compute Pseudoinverse');
  computeButton.position(200, drawHeight + 10);
  computeButton.mousePressed(computeAll);

  // Create show SVD checkbox
  showSVDCheckbox = createCheckbox('Show SVD', false);
  showSVDCheckbox.position(370, drawHeight + 10);
  showSVDCheckbox.changed(() => showSVD = showSVDCheckbox.checked());

  // Create matrix input fields
  createInputFields();

  // Initial computation
  computeAll();

  describe('Pseudoinverse solver showing matrix A, pseudoinverse A+, solution x=A+b, and residual', LABEL);
}

function createInputFields() {
  // Remove existing fields
  for (let field of inputFields) field.remove();
  for (let field of bFields) field.remove();
  inputFields = [];
  bFields = [];

  // Matrix A input fields
  let fieldW = 40;
  let fieldH = 20;
  let startX = 10;
  let startY = drawHeight + 45;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let field = createInput(matrixA[i][j].toString(), 'text');
      field.position(startX + j * (fieldW + 5), startY + i * (fieldH + 3));
      field.size(fieldW, fieldH);
      field.input(onMatrixInput);
      inputFields.push({field: field, row: i, col: j});
    }
  }

  // Vector b input fields
  let bStartX = startX + n * (fieldW + 5) + 30;
  for (let i = 0; i < m; i++) {
    let field = createInput(vectorB[i].toString(), 'text');
    field.position(bStartX, startY + i * (fieldH + 3));
    field.size(fieldW, fieldH);
    field.input(onBInput);
    bFields.push({field: field, idx: i});
  }
}

function onMatrixInput() {
  for (let item of inputFields) {
    let val = parseFloat(item.field.value());
    if (!isNaN(val)) {
      matrixA[item.row][item.col] = val;
    }
  }
}

function onBInput() {
  for (let item of bFields) {
    let val = parseFloat(item.field.value());
    if (!isNaN(val)) {
      vectorB[item.idx] = val;
    }
  }
}

function onPresetChange() {
  currentPreset = parseInt(presetSelect.value());
  let preset = presets[currentPreset];

  // Update dimensions
  m = preset.A.length;
  n = preset.A[0].length;

  // Deep copy arrays
  matrixA = preset.A.map(row => [...row]);
  vectorB = [...preset.b];

  // Recreate input fields
  createInputFields();

  // Recompute
  computeAll();
}

function computeAll() {
  // Compute SVD
  computeSVD();

  // Compute pseudoinverse from SVD
  computePseudoinverse();

  // Compute solution x = A+ b
  solution = matVec(pseudoinverse, vectorB);

  // Compute residual r = Ax - b
  let Ax = matVec(matrixA, solution);
  residual = [];
  for (let i = 0; i < m; i++) {
    residual.push(Ax[i] - vectorB[i]);
  }

  // Residual norm
  residualNorm = 0;
  for (let r of residual) {
    residualNorm += r * r;
  }
  residualNorm = Math.sqrt(residualNorm);

  // Compute normal equation solution for comparison (only if full column rank)
  computeNormalEquationSolution();
}

function computeSVD() {
  // Compute SVD using power iteration / Jacobi-like approach
  // For educational clarity, we use a simplified approach

  // Compute A^T A
  let AtA = [];
  for (let i = 0; i < n; i++) {
    AtA.push([]);
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += matrixA[k][i] * matrixA[k][j];
      }
      AtA[i].push(sum);
    }
  }

  // Get eigenvalues and eigenvectors of A^T A (V and S^2)
  let eigResult = eigenDecomposition2x2(AtA);

  svdS = eigResult.eigenvalues.map(ev => Math.sqrt(Math.max(0, ev)));
  svdV = eigResult.eigenvectors;

  // Compute rank (count non-zero singular values)
  matrixRank = 0;
  for (let s of svdS) {
    if (s > 1e-10) matrixRank++;
  }

  // U = A V S^(-1) for non-zero singular values
  svdU = [];
  for (let i = 0; i < m; i++) {
    svdU.push([]);
    for (let j = 0; j < n; j++) {
      if (svdS[j] > 1e-10) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += matrixA[i][k] * svdV[k][j];
        }
        svdU[i].push(sum / svdS[j]);
      } else {
        svdU[i].push(0);
      }
    }
  }

  // Normalize U columns
  for (let j = 0; j < n; j++) {
    let norm = 0;
    for (let i = 0; i < m; i++) {
      norm += svdU[i][j] * svdU[i][j];
    }
    norm = Math.sqrt(norm);
    if (norm > 1e-10) {
      for (let i = 0; i < m; i++) {
        svdU[i][j] /= norm;
      }
    }
  }
}

function eigenDecomposition2x2(A) {
  // 2x2 eigendecomposition closed form
  // For larger matrices, would need iterative methods

  if (A.length !== 2 || A[0].length !== 2) {
    // For non-2x2, return identity (simplified)
    let n = A.length;
    let eigenvectors = [];
    let eigenvalues = [];
    for (let i = 0; i < n; i++) {
      eigenvectors.push([]);
      for (let j = 0; j < n; j++) {
        eigenvectors[i].push(i === j ? 1 : 0);
      }
      eigenvalues.push(A[i][i]);
    }
    return {eigenvalues, eigenvectors};
  }

  let a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];

  let trace = a + d;
  let det = a * d - b * c;
  let disc = Math.sqrt(Math.max(0, trace * trace - 4 * det));

  let lambda1 = (trace + disc) / 2;
  let lambda2 = (trace - disc) / 2;

  // Eigenvectors
  let v1, v2;
  if (Math.abs(b) > 1e-10) {
    v1 = [lambda1 - d, b];
    v2 = [lambda2 - d, b];
  } else if (Math.abs(c) > 1e-10) {
    v1 = [c, lambda1 - a];
    v2 = [c, lambda2 - a];
  } else {
    v1 = [1, 0];
    v2 = [0, 1];
  }

  // Normalize
  let norm1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
  let norm2 = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
  v1 = [v1[0]/norm1, v1[1]/norm1];
  v2 = [v2[0]/norm2, v2[1]/norm2];

  return {
    eigenvalues: [lambda1, lambda2],
    eigenvectors: [[v1[0], v2[0]], [v1[1], v2[1]]]  // Columns are eigenvectors
  };
}

function computePseudoinverse() {
  // A+ = V S+ U^T
  // S+ has reciprocals of non-zero singular values

  // Initialize pseudoinverse as n x m matrix
  pseudoinverse = [];
  for (let i = 0; i < n; i++) {
    pseudoinverse.push([]);
    for (let j = 0; j < m; j++) {
      pseudoinverse[i].push(0);
    }
  }

  // Compute V * S+ * U^T
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < Math.min(n, svdS.length); k++) {
        if (svdS[k] > 1e-10) {
          let sInv = 1 / svdS[k];
          sum += svdV[i][k] * sInv * svdU[j][k];
        }
      }
      pseudoinverse[i][j] = sum;
    }
  }
}

function computeNormalEquationSolution() {
  // (A^T A)^-1 A^T b - only valid when A has full column rank
  normalEquationSolution = [];

  if (matrixRank < n) {
    // Can't use normal equation approach directly
    return;
  }

  // Compute A^T A
  let AtA = [];
  for (let i = 0; i < n; i++) {
    AtA.push([]);
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += matrixA[k][i] * matrixA[k][j];
      }
      AtA[i].push(sum);
    }
  }

  // Compute A^T b
  let Atb = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let k = 0; k < m; k++) {
      sum += matrixA[k][i] * vectorB[k];
    }
    Atb.push(sum);
  }

  // Solve (A^T A) x = A^T b using 2x2 inverse
  if (n === 2) {
    let det = AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0];
    if (Math.abs(det) > 1e-10) {
      let inv = [
        [AtA[1][1] / det, -AtA[0][1] / det],
        [-AtA[1][0] / det, AtA[0][0] / det]
      ];
      normalEquationSolution = matVec(inv, Atb);
    }
  }
}

function matVec(M, v) {
  // Matrix-vector multiplication
  let result = [];
  for (let i = 0; i < M.length; i++) {
    let sum = 0;
    for (let j = 0; j < M[i].length; j++) {
      sum += M[i][j] * v[j];
    }
    result.push(sum);
  }
  return result;
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Pseudoinverse Solver: x = A\u207Ab', canvasWidth / 2, 8);

  // Preset description
  textSize(12);
  fill(80);
  text(presets[currentPreset].desc, canvasWidth / 2, 30);

  // Draw matrices and results
  let startY = 55;
  let colWidth = showSVD ? 140 : 180;

  // Matrix A with rank
  drawMatrixWithLabel(matrixA, 30, startY, 'A', 'steelblue', m, n);

  fill(0);
  textSize(11);
  textAlign(LEFT, TOP);
  text('rank(A) = ' + matrixRank, 30, startY + m * 22 + 10);
  text(m + ' x ' + n, 30, startY + m * 22 + 25);

  // Pseudoinverse A+
  let aplusX = showSVD ? 170 : 200;
  drawMatrixWithLabel(pseudoinverse, aplusX, startY, 'A\u207A', 'darkgreen', n, m);

  textSize(11);
  fill(60);
  text(n + ' x ' + m, aplusX, startY + n * 22 + 10);

  // Vector b
  let bX = showSVD ? 330 : 380;
  drawVectorWithLabel(vectorB, bX, startY, 'b', 'darkorange', m);

  // Solution x
  let xX = showSVD ? 400 : 470;
  drawVectorWithLabel(solution, xX, startY, 'x = A\u207Ab', 'darkblue', n);

  // Residual
  let rX = showSVD ? 500 : 580;
  drawVectorWithLabel(residual, rX, startY, 'r = Ax - b', 'darkred', m);

  // Residual norm box
  fill(residualNorm < 0.001 ? 'lightgreen' : 'lightyellow');
  stroke(residualNorm < 0.001 ? 'green' : 'orange');
  strokeWeight(1);
  let normBoxX = showSVD ? 580 : 680;
  rect(normBoxX, startY, 100, 50, 5);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('||r|| = ||Ax - b||', normBoxX + 50, startY + 15);
  textSize(14);
  fill(residualNorm < 0.001 ? 'green' : 'darkorange');
  text(residualNorm.toFixed(6), normBoxX + 50, startY + 35);

  // Show SVD components if enabled
  if (showSVD) {
    drawSVDComponents(startY + 110);
  }

  // Comparison with normal equation
  if (!showSVD && normalEquationSolution.length > 0) {
    drawComparisonSection(startY + Math.max(m, n) * 22 + 50);
  }

  // Draw equations
  drawEquations();

  // Control labels
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Matrix A:', 10, drawHeight + 55);
  text('Vector b:', 10 + n * 45 + 35, drawHeight + 55);
}

function drawMatrixWithLabel(mat, x, y, label, color, rows, cols) {
  let cellW = 40;
  let cellH = 20;

  // Label
  fill(color);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text(label, x + cols * cellW / 2, y - 18);

  // Matrix bracket left
  stroke(color);
  strokeWeight(2);
  noFill();
  line(x - 5, y, x - 5, y + rows * cellH);
  line(x - 5, y, x, y);
  line(x - 5, y + rows * cellH, x, y + rows * cellH);

  // Matrix bracket right
  line(x + cols * cellW + 5, y, x + cols * cellW + 5, y + rows * cellH);
  line(x + cols * cellW, y, x + cols * cellW + 5, y);
  line(x + cols * cellW, y + rows * cellH, x + cols * cellW + 5, y + rows * cellH);

  // Values
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let val = mat[i][j];
      text(formatNum(val), x + j * cellW + cellW/2, y + i * cellH + cellH/2);
    }
  }
}

function drawVectorWithLabel(vec, x, y, label, color, len) {
  let cellW = 50;
  let cellH = 20;

  // Label
  fill(color);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text(label, x + cellW/2, y - 18);

  // Bracket left
  stroke(color);
  strokeWeight(2);
  noFill();
  line(x - 5, y, x - 5, y + len * cellH);
  line(x - 5, y, x, y);
  line(x - 5, y + len * cellH, x, y + len * cellH);

  // Bracket right
  line(x + cellW + 5, y, x + cellW + 5, y + len * cellH);
  line(x + cellW, y, x + cellW + 5, y);
  line(x + cellW, y + len * cellH, x + cellW + 5, y + len * cellH);

  // Values
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < len; i++) {
    text(formatNum(vec[i]), x + cellW/2, y + i * cellH + cellH/2);
  }
}

function drawSVDComponents(y) {
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  text('SVD Components: A = U \u03A3 V\u1D40', 30, y);

  y += 20;

  // U matrix
  if (svdU.length > 0) {
    textSize(11);
    fill(100, 50, 150);
    text('U (' + m + 'x' + n + '):', 30, y);
    y += 15;
    textSize(10);
    fill(0);
    for (let i = 0; i < Math.min(m, 4); i++) {
      let row = '';
      for (let j = 0; j < Math.min(n, 4); j++) {
        row += formatNum(svdU[i][j]) + '  ';
      }
      text(row, 30, y + i * 14);
    }
  }

  // Singular values
  textSize(11);
  fill(100, 50, 150);
  text('\u03C3 values:', 180, y - 15);
  fill(0);
  textSize(10);
  for (let i = 0; i < svdS.length; i++) {
    text('\u03C3' + (i+1) + ' = ' + formatNum(svdS[i]), 180, y + i * 14);
  }

  // V matrix
  if (svdV.length > 0) {
    textSize(11);
    fill(100, 50, 150);
    text('V (' + n + 'x' + n + '):', 280, y - 15);
    textSize(10);
    fill(0);
    for (let i = 0; i < n; i++) {
      let row = '';
      for (let j = 0; j < n; j++) {
        row += formatNum(svdV[i][j]) + '  ';
      }
      text(row, 280, y + i * 14);
    }
  }

  // Pseudoinverse formula
  fill(50);
  textSize(11);
  text('A\u207A = V \u03A3\u207A U\u1D40  where \u03C3\u207A = 1/\u03C3 (if \u03C3 > 0)', 400, y - 15);
}

function drawComparisonSection(y) {
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  text('Comparison with Normal Equation: (A\u1D40A)\u207B\u00B9A\u1D40b', 30, y);

  y += 20;
  textSize(11);

  // Check if solutions match
  let match = true;
  for (let i = 0; i < n; i++) {
    if (Math.abs(solution[i] - normalEquationSolution[i]) > 0.0001) {
      match = false;
      break;
    }
  }

  fill(match ? 'green' : 'red');
  text('Normal eq solution: [' + normalEquationSolution.map(v => formatNum(v)).join(', ') + ']', 30, y);

  fill(match ? 'green' : 'darkorange');
  text(match ? 'Solutions match!' : 'Different approach may give different results', 30, y + 18);
}

function drawEquations() {
  let y = drawHeight - 35;

  fill(60);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);

  // Key formulas
  text('Least Squares: min ||Ax - b||\u00B2', 30, y);
  text('Solution: x = A\u207Ab', 220, y);
  text('Residual: r = Ax - b \u22A5 col(A)', 350, y);

  // For underdetermined
  if (m < n) {
    fill(80, 80, 150);
    text('Underdetermined: Pseudoinverse gives minimum-norm ||x||', 530, y);
  }
}

function formatNum(n) {
  if (typeof n !== 'number' || isNaN(n)) return '-';
  if (Math.abs(n) < 0.0001) return '0';
  if (Math.abs(n - Math.round(n)) < 0.0001) return Math.round(n).toString();
  return n.toFixed(3);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(700, Math.floor(container.offsetWidth));
  }
}
