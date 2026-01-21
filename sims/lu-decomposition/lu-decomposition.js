// LU Decomposition Algorithm Visualizer MicroSim
// Step through LU decomposition showing L and U matrices being built
// Learning objective: Understand LU decomposition through elimination steps

let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix data (default 3x3)
let originalMatrix = [
  [2, 1, 1],
  [4, 3, 3],
  [8, 7, 9]
];

let matrixA = [];  // Working copy
let matrixL = [];  // Lower triangular
let matrixU = [];  // Upper triangular (final result)

// Algorithm state
let currentStep = 0;
let totalSteps = 0;
let pivotRow = 0;
let pivotCol = 0;
let eliminationRow = 0;
let multiplier = 0;
let stepDescription = "Press 'Next Step' to begin";
let isComplete = false;
let autoRun = false;
let lastAutoTime = 0;
let autoSpeed = 1000; // ms between steps

// Animation
let highlightPivot = false;
let highlightElim = false;

// UI elements
let nextButton;
let autoButton;
let resetButton;
let verifyButton;
let speedSlider;
let sizeSelect;

// Step history for visualization
let steps = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create buttons
  nextButton = createButton('Next Step');
  nextButton.position(10, drawHeight + 15);
  nextButton.mousePressed(nextStep);

  autoButton = createButton('Auto Run');
  autoButton.position(95, drawHeight + 15);
  autoButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.position(175, drawHeight + 15);
  resetButton.mousePressed(resetSimulation);

  verifyButton = createButton('Verify L×U=A');
  verifyButton.position(235, drawHeight + 15);
  verifyButton.mousePressed(verifyDecomposition);

  // Size selector
  sizeSelect = createSelect();
  sizeSelect.option('3×3', '3');
  sizeSelect.option('4×4', '4');
  sizeSelect.position(10, drawHeight + 50);
  sizeSelect.changed(changeSize);

  // Speed slider
  speedSlider = createSlider(200, 2000, 1000, 100);
  speedSlider.position(400, drawHeight + 15);
  speedSlider.size(150);

  initializeAlgorithm();

  describe('Step-by-step visualization of LU decomposition algorithm', LABEL);
}

function draw() {
  updateCanvasSize();

  // Background
  background(245);

  // Draw border around draw area
  stroke(200);
  strokeWeight(1);
  noFill();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill(255);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Auto-run logic
  if (autoRun && !isComplete) {
    autoSpeed = speedSlider.value();
    if (millis() - lastAutoTime > autoSpeed) {
      nextStep();
      lastAutoTime = millis();
    }
  }

  // Title
  fill(0);
  noStroke();
  textSize(22);
  textAlign(CENTER, TOP);
  text('LU Decomposition Algorithm', canvasWidth/2, 10);

  // Draw the three matrices
  let matrixWidth = 160;
  let spacing = 40;
  let startX = (canvasWidth - 3 * matrixWidth - 2 * spacing) / 2;
  let matrixY = 60;

  // Matrix A (working)
  drawMatrix(matrixA, startX, matrixY, 'A (working)', true);

  // Matrix L
  drawMatrix(matrixL, startX + matrixWidth + spacing, matrixY, 'L', false);

  // Matrix U (final state of A)
  let uMatrix = isComplete ? matrixA : createEmptyMatrix(matrixA.length);
  drawMatrix(uMatrix, startX + 2 * (matrixWidth + spacing), matrixY, 'U', false);

  // Step info
  textSize(14);
  textAlign(LEFT, TOP);
  fill(0);

  let infoY = matrixY + matrixA.length * 40 + 80;

  // Step counter
  text('Step: ' + currentStep + ' / ' + totalSteps, 30, infoY);

  // Description
  fill(50);
  textSize(14);
  text(stepDescription, 30, infoY + 25);

  // Current multiplier if applicable
  if (multiplier !== 0 && !isComplete) {
    fill(180, 60, 60);
    text('Multiplier: l[' + (eliminationRow+1) + ',' + (pivotCol+1) + '] = ' + multiplier.toFixed(3), 30, infoY + 50);
  }

  // Control labels
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Speed: ' + (speedSlider.value()/1000).toFixed(1) + 's', 320, drawHeight + 25);
  text('Matrix size:', 70, drawHeight + 60);
}

function drawMatrix(mat, x, y, label, showHighlight) {
  let n = mat.length;
  let cellW = 45;
  let cellH = 35;

  // Label
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text(label, x + (n * cellW) / 2, y - 5);

  // Draw brackets
  stroke(0);
  strokeWeight(2);
  noFill();

  // Left bracket
  line(x - 5, y, x - 5, y + n * cellH);
  line(x - 5, y, x, y);
  line(x - 5, y + n * cellH, x, y + n * cellH);

  // Right bracket
  line(x + n * cellW + 5, y, x + n * cellW + 5, y + n * cellH);
  line(x + n * cellW, y, x + n * cellW + 5, y);
  line(x + n * cellW, y + n * cellH, x + n * cellW + 5, y + n * cellH);

  // Draw cells
  textSize(13);
  textAlign(CENTER, CENTER);

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      let cx = x + col * cellW;
      let cy = y + row * cellH;

      // Highlight current pivot
      if (showHighlight && highlightPivot && row === pivotRow && col === pivotCol) {
        fill(255, 255, 100);
        noStroke();
        rect(cx, cy, cellW, cellH, 3);
      }
      // Highlight elimination row
      else if (showHighlight && highlightElim && row === eliminationRow) {
        fill(255, 200, 200);
        noStroke();
        rect(cx, cy, cellW, cellH, 3);
      }

      // Draw value
      noStroke();
      fill(0);
      let val = mat[row][col];
      let valStr = formatValue(val);
      text(valStr, cx + cellW/2, cy + cellH/2);
    }
  }
}

function formatValue(val) {
  if (Math.abs(val) < 0.0001) return '0';
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(2);
}

function createEmptyMatrix(n) {
  let m = [];
  for (let i = 0; i < n; i++) {
    m[i] = [];
    for (let j = 0; j < n; j++) {
      m[i][j] = 0;
    }
  }
  return m;
}

function initializeAlgorithm() {
  let n = originalMatrix.length;

  // Copy original matrix to working matrix
  matrixA = [];
  for (let i = 0; i < n; i++) {
    matrixA[i] = [...originalMatrix[i]];
  }

  // Initialize L as identity
  matrixL = [];
  for (let i = 0; i < n; i++) {
    matrixL[i] = [];
    for (let j = 0; j < n; j++) {
      matrixL[i][j] = (i === j) ? 1 : 0;
    }
  }

  // Calculate total steps
  totalSteps = 0;
  for (let k = 0; k < n - 1; k++) {
    totalSteps += (n - k - 1);
  }

  // Build step sequence
  steps = [];
  for (let k = 0; k < n - 1; k++) {
    for (let i = k + 1; i < n; i++) {
      steps.push({pivotRow: k, pivotCol: k, elimRow: i});
    }
  }

  currentStep = 0;
  pivotRow = 0;
  pivotCol = 0;
  eliminationRow = 1;
  multiplier = 0;
  stepDescription = "Press 'Next Step' to begin LU decomposition";
  isComplete = false;
  highlightPivot = false;
  highlightElim = false;
  autoRun = false;
  autoButton.html('Auto Run');
}

function nextStep() {
  if (isComplete) return;

  if (currentStep >= totalSteps) {
    isComplete = true;
    stepDescription = "LU decomposition complete! A = LU";
    highlightPivot = false;
    highlightElim = false;
    autoRun = false;
    autoButton.html('Auto Run');
    return;
  }

  let step = steps[currentStep];
  pivotRow = step.pivotRow;
  pivotCol = step.pivotCol;
  eliminationRow = step.elimRow;

  // Calculate multiplier
  let pivot = matrixA[pivotRow][pivotCol];

  if (Math.abs(pivot) < 0.0001) {
    stepDescription = "Warning: Zero pivot! Needs pivoting.";
    isComplete = true;
    return;
  }

  multiplier = matrixA[eliminationRow][pivotCol] / pivot;

  // Store multiplier in L
  matrixL[eliminationRow][pivotCol] = multiplier;

  // Eliminate row
  let n = matrixA.length;
  for (let j = 0; j < n; j++) {
    matrixA[eliminationRow][j] -= multiplier * matrixA[pivotRow][j];
  }

  // Update description
  stepDescription = `Row ${eliminationRow+1} -= ${multiplier.toFixed(3)} × Row ${pivotRow+1}`;

  highlightPivot = true;
  highlightElim = true;

  currentStep++;
}

function toggleAuto() {
  autoRun = !autoRun;
  autoButton.html(autoRun ? 'Pause' : 'Auto Run');
  if (autoRun) {
    lastAutoTime = millis();
  }
}

function resetSimulation() {
  initializeAlgorithm();
}

function verifyDecomposition() {
  if (!isComplete) {
    stepDescription = "Complete the decomposition first!";
    return;
  }

  // Compute L × U
  let n = matrixA.length;
  let product = createEmptyMatrix(n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        product[i][j] += matrixL[i][k] * matrixA[k][j];
      }
    }
  }

  // Check if equals original
  let match = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (Math.abs(product[i][j] - originalMatrix[i][j]) > 0.001) {
        match = false;
      }
    }
  }

  if (match) {
    stepDescription = "✓ Verified: L × U = A (decomposition correct!)";
  } else {
    stepDescription = "✗ Error in decomposition";
  }
}

function changeSize() {
  let size = parseInt(sizeSelect.value());

  if (size === 3) {
    originalMatrix = [
      [2, 1, 1],
      [4, 3, 3],
      [8, 7, 9]
    ];
  } else if (size === 4) {
    originalMatrix = [
      [2, 1, 1, 0],
      [4, 3, 3, 1],
      [8, 7, 9, 5],
      [6, 7, 9, 8]
    ];
  }

  initializeAlgorithm();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  speedSlider.size(canvasWidth - 600);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(600, Math.floor(container.offsetWidth));
  }
}
