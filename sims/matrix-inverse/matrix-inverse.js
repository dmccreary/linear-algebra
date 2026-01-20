// Matrix Inverse Interactive Explorer
// Enables students to explore matrix inversion for 2×2 matrices,
// verify the inverse property AA⁻¹ = I, and understand when matrices are singular.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let defaultTextSize = 16;

// Matrix data (2×2 only for simplicity and educational clarity)
let matrixA = [[2, 1], [1, 1]];
let matrixInv = [[1, -1], [-1, 2]];
let matrixProduct = [[1, 0], [0, 1]];
let determinant = 1;

// UI elements
let randomizeButton;
let singularButton;
let singularitySlider;

// State
let isSingular = false;
let singularityFactor = 0;  // 0 = original, 1 = singular

// Cell dimensions
let cellSize = 45;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Calculate initial inverse
  computeInverse();

  // Create randomize button
  randomizeButton = createButton('Randomize');
  randomizeButton.position(10, drawHeight + 8);
  randomizeButton.mousePressed(randomizeMatrix);

  // Create make singular button
  singularButton = createButton('Make Singular');
  singularButton.position(100, drawHeight + 8);
  singularButton.mousePressed(makeSingular);

  // Create singularity slider
  singularitySlider = createSlider(0, 100, 0, 1);
  singularitySlider.position(10, drawHeight + 43);
  singularitySlider.size(canvasWidth - margin - 10);
  singularitySlider.input(onSingularityChange);

  describe('Matrix inverse explorer showing a 2×2 matrix, its inverse, and verification that AA⁻¹ = I with determinant display.', LABEL);
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
  text('Matrix Inverse: AA⁻¹ = I', canvasWidth / 2, 8);

  // Layout calculations
  let totalWidth = 3 * (2 * cellSize) + 2 * 60;  // 3 matrices + symbols
  let startX = (canvasWidth - totalWidth) / 2;
  let matrixY = 50;

  // Draw Matrix A
  drawMatrix(matrixA, startX, matrixY, 'A', 'lightblue', 'steelblue', true);

  // Draw multiplication symbol
  let multX = startX + 2 * cellSize + 20;
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text('×', multX, matrixY + cellSize);

  // Draw Inverse Matrix
  let invX = startX + 2 * cellSize + 40;
  if (isSingular) {
    drawSingularWarning(invX, matrixY);
  } else {
    drawMatrix(matrixInv, invX, matrixY, 'A⁻¹', 'lightgreen', 'seagreen', false);
  }

  // Draw equals symbol
  let equalsX = invX + 2 * cellSize + 20;
  fill('black');
  text('=', equalsX, matrixY + cellSize);

  // Draw Product (should be identity)
  let prodX = invX + 2 * cellSize + 40;
  if (isSingular) {
    drawMatrix([['-', '-'], ['-', '-']], prodX, matrixY, 'Result', 'lightgray', 'gray', false);
  } else {
    drawMatrix(matrixProduct, prodX, matrixY, 'I', 'lightyellow', 'goldenrod', false);
  }

  // Draw determinant display
  drawDeterminantDisplay();

  // Draw formula
  drawFormulaDisplay();

  // Control label
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  text('Approach singularity: ' + singularitySlider.value() + '%', 10, drawHeight + 58);
}

function drawMatrix(matrix, x, y, label, fillColor, strokeColor, editable) {
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let cellX = x + j * cellSize;
      let cellY = y + i * cellSize;

      // Cell background
      fill(fillColor);
      stroke(strokeColor);
      strokeWeight(1);
      rect(cellX, cellY, cellSize, cellSize, 3);

      // Cell value
      fill('black');
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      let val = matrix[i][j];
      if (typeof val === 'number') {
        text(formatNumber(val), cellX + cellSize / 2, cellY + cellSize / 2);
      } else {
        text(val, cellX + cellSize / 2, cellY + cellSize / 2);
      }
    }
  }

  // Matrix label
  fill(strokeColor);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text(label, x + cellSize, y + 2 * cellSize + 5);
}

function drawSingularWarning(x, y) {
  // Warning background
  fill(255, 200, 200);
  stroke('red');
  strokeWeight(2);
  rect(x, y, 2 * cellSize, 2 * cellSize, 5);

  // Warning text
  fill('red');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Singular!', x + cellSize, y + cellSize - 10);
  textSize(11);
  text('No inverse', x + cellSize, y + cellSize + 10);

  // Label
  fill('red');
  textAlign(CENTER, TOP);
  textSize(14);
  text('A⁻¹', x + cellSize, y + 2 * cellSize + 5);
}

function drawDeterminantDisplay() {
  let detY = 160;

  // Background
  let detColor = isSingular ? color(255, 200, 200) : (abs(determinant) < 0.1 ? color(255, 255, 200) : color(200, 255, 200));
  fill(detColor);
  stroke(isSingular ? 'red' : (abs(determinant) < 0.1 ? 'orange' : 'green'));
  strokeWeight(2);
  rect(canvasWidth / 2 - 80, detY, 160, 40, 8);

  // Determinant text
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text('det(A) = ' + formatNumber(determinant), canvasWidth / 2, detY + 20);

  // Status indicator
  textSize(12);
  if (isSingular) {
    fill('red');
    text('Matrix is singular (not invertible)', canvasWidth / 2, detY + 55);
  } else if (abs(determinant) < 0.1) {
    fill('orange');
    text('Near-singular (numerically unstable)', canvasWidth / 2, detY + 55);
  } else {
    fill('green');
    text('Matrix is invertible', canvasWidth / 2, detY + 55);
  }
}

function drawFormulaDisplay() {
  let y = 240;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);

  // 2×2 inverse formula
  text('For 2×2 matrix:', canvasWidth / 2, y);

  textSize(11);
  fill('gray');
  text('A⁻¹ = (1/det) × adj(A)', canvasWidth / 2, y + 18);
  text('where adj swaps diagonal and negates off-diagonal', canvasWidth / 2, y + 33);

  // Show actual calculation
  if (!isSingular) {
    fill('steelblue');
    textSize(10);
    let a = matrixA[0][0], b = matrixA[0][1];
    let c = matrixA[1][0], d = matrixA[1][1];
    text(`A⁻¹ = (1/${formatNumber(determinant)}) × [${d}, ${-b}; ${-c}, ${a}]`, canvasWidth / 2, y + 55);
  }
}

function formatNumber(n) {
  if (typeof n !== 'number') return n;
  if (Number.isInteger(n)) return n.toString();
  if (abs(n) < 0.001) return '0';
  return n.toFixed(2);
}

function computeInverse() {
  let a = matrixA[0][0], b = matrixA[0][1];
  let c = matrixA[1][0], d = matrixA[1][1];

  determinant = a * d - b * c;

  if (abs(determinant) < 0.0001) {
    isSingular = true;
    matrixInv = [[0, 0], [0, 0]];
    matrixProduct = [[0, 0], [0, 0]];
  } else {
    isSingular = false;
    let invDet = 1 / determinant;
    matrixInv = [
      [d * invDet, -b * invDet],
      [-c * invDet, a * invDet]
    ];

    // Compute product A × A⁻¹
    matrixProduct = multiplyMatrices(matrixA, matrixInv);
  }
}

function multiplyMatrices(A, B) {
  let result = [[0, 0], [0, 0]];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

function randomizeMatrix() {
  singularitySlider.value(0);
  singularityFactor = 0;

  // Generate random invertible matrix
  do {
    matrixA = [
      [floor(random(-5, 6)), floor(random(-5, 6))],
      [floor(random(-5, 6)), floor(random(-5, 6))]
    ];
    determinant = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0];
  } while (abs(determinant) < 0.5);  // Ensure not near-singular

  computeInverse();
}

function makeSingular() {
  // Make row 2 a multiple of row 1
  let k = floor(random(1, 4)) * (random() > 0.5 ? 1 : -1);
  matrixA[1][0] = matrixA[0][0] * k;
  matrixA[1][1] = matrixA[0][1] * k;

  singularitySlider.value(100);
  computeInverse();
}

function onSingularityChange() {
  let factor = singularitySlider.value() / 100;

  // Interpolate toward a singular matrix
  // Start from a good matrix and move toward one where row2 = k * row1
  if (factor === 0) {
    // Reset to a good matrix
    randomizeMatrix();
    singularitySlider.value(0);
  } else {
    // Interpolate row 2 toward being proportional to row 1
    let targetRow2 = [matrixA[0][0] * 2, matrixA[0][1] * 2];
    let originalRow2 = [floor(random(-3, 4)), floor(random(-3, 4))];

    // Linear interpolation
    matrixA[1][0] = round(originalRow2[0] * (1 - factor) + targetRow2[0] * factor);
    matrixA[1][1] = round(originalRow2[1] * (1 - factor) + targetRow2[1] * factor);

    computeInverse();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  singularitySlider.size(canvasWidth - margin - 10);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
