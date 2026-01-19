// Matrix Addition and Scalar Multiplication MicroSim
// Enables students to practice matrix addition and scalar multiplication interactively,
// reinforcing the element-wise nature of these operations.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Matrix dimensions
const ROWS = 3;
const COLS = 3;

// Matrices
let matrixA = [];
let matrixB = [];
let matrixC = [];

// UI elements
let operationSelect;
let scalarSlider;
let randomizeButton;
let stepButton;

// State
let operation = 'addition';  // 'addition' or 'scalar'
let scalarValue = 2;
let highlightIndex = -1;  // For step-through animation
let isAnimating = false;

// Cell dimensions
let cellSize = 40;
let matrixGap = 30;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Initialize matrices with random values
  initializeMatrices();

  // Create operation selector (using buttons instead of radio)
  operationSelect = createSelect();
  operationSelect.option('Addition', 'addition');
  operationSelect.option('Scalar Multiply', 'scalar');
  operationSelect.selected('addition');
  operationSelect.position(10, drawHeight + 8);
  operationSelect.changed(onOperationChange);

  // Create scalar slider
  scalarSlider = createSlider(-3, 3, 2, 0.5);
  scalarSlider.position(sliderLeftMargin, drawHeight + 8);
  scalarSlider.size(canvasWidth - sliderLeftMargin - margin);
  scalarSlider.input(onScalarChange);

  // Create randomize button
  randomizeButton = createButton('Randomize');
  randomizeButton.position(10, drawHeight + 43);
  randomizeButton.mousePressed(initializeMatrices);

  // Create step button
  stepButton = createButton('Step');
  stepButton.position(100, drawHeight + 43);
  stepButton.mousePressed(stepAnimation);

  describe('Interactive matrix calculator showing addition of two 3×3 matrices or scalar multiplication with step-by-step highlighting.', LABEL);
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
  textSize(20);
  let titleText = operation === 'addition' ? 'Matrix Addition: A + B = C' : 'Scalar Multiplication: k × A = C';
  text(titleText, canvasWidth / 2, 10);

  // Calculate matrix positions based on canvas width
  let totalWidth = 3 * (COLS * cellSize) + 2 * matrixGap + 60;  // matrices + gaps + symbols
  let startX = (canvasWidth - totalWidth) / 2;
  let matrixY = 60;

  // Calculate result
  calculateResult();

  if (operation === 'addition') {
    // Draw Matrix A
    drawMatrix(matrixA, startX, matrixY, 'A', 'lightblue', 'steelblue');

    // Draw plus symbol
    let plusX = startX + COLS * cellSize + matrixGap / 2;
    fill('black');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(28);
    text('+', plusX, matrixY + (ROWS * cellSize) / 2);

    // Draw Matrix B
    let matrixBX = startX + COLS * cellSize + matrixGap;
    drawMatrix(matrixB, matrixBX, matrixY, 'B', 'lightgreen', 'seagreen');

    // Draw equals symbol
    let equalsX = matrixBX + COLS * cellSize + matrixGap / 2;
    text('=', equalsX, matrixY + (ROWS * cellSize) / 2);

    // Draw Matrix C (result)
    let matrixCX = matrixBX + COLS * cellSize + matrixGap;
    drawMatrix(matrixC, matrixCX, matrixY, 'C', 'lightyellow', 'goldenrod');
  } else {
    // Scalar multiplication layout
    // Draw scalar value
    let scalarX = startX;
    fill('purple');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(28);
    text('k=' + scalarValue.toFixed(1), scalarX + 30, matrixY + (ROWS * cellSize) / 2);

    // Draw multiplication symbol
    let multX = scalarX + 70;
    fill('black');
    text('×', multX, matrixY + (ROWS * cellSize) / 2);

    // Draw Matrix A
    let matrixAX = scalarX + 90;
    drawMatrix(matrixA, matrixAX, matrixY, 'A', 'lightblue', 'steelblue');

    // Draw equals symbol
    let equalsX = matrixAX + COLS * cellSize + matrixGap / 2;
    text('=', equalsX, matrixY + (ROWS * cellSize) / 2);

    // Draw Matrix C (result)
    let matrixCX = matrixAX + COLS * cellSize + matrixGap;
    drawMatrix(matrixC, matrixCX, matrixY, 'C', 'lightyellow', 'goldenrod');
  }

  // Draw formula explanation
  drawFormulaExplanation();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Scalar k: ' + scalarValue.toFixed(1), 130, drawHeight + 20);
}

function drawMatrix(matrix, x, y, label, fillColor, strokeColor) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let cellX = x + j * cellSize;
      let cellY = y + i * cellSize;

      // Check if this cell should be highlighted
      let cellIndex = i * COLS + j;
      let isHighlighted = (highlightIndex === cellIndex);

      // Cell background
      if (isHighlighted) {
        fill('yellow');
        stroke('orange');
        strokeWeight(3);
      } else {
        fill(fillColor);
        stroke(strokeColor);
        strokeWeight(1);
      }
      rect(cellX, cellY, cellSize, cellSize, 3);

      // Cell value
      fill(isHighlighted ? 'red' : 'black');
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      let val = matrix[i][j];
      text(Number.isInteger(val) ? val : val.toFixed(1), cellX + cellSize / 2, cellY + cellSize / 2);
    }
  }

  // Matrix label
  fill(strokeColor);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text(label, x + (COLS * cellSize) / 2, y + ROWS * cellSize + 5);
}

function drawFormulaExplanation() {
  let y = 200;
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);

  if (operation === 'addition') {
    text('Formula: c_ij = a_ij + b_ij', canvasWidth / 2, y);
    textSize(12);
    fill('gray');
    text('Each entry in C is the sum of corresponding entries in A and B', canvasWidth / 2, y + 20);
  } else {
    text('Formula: c_ij = k × a_ij', canvasWidth / 2, y);
    textSize(12);
    fill('gray');
    text('Each entry in C is the scalar k times the corresponding entry in A', canvasWidth / 2, y + 20);
  }

  // Show current highlighted calculation
  if (highlightIndex >= 0 && highlightIndex < ROWS * COLS) {
    let i = Math.floor(highlightIndex / COLS);
    let j = highlightIndex % COLS;
    textSize(14);
    fill('red');
    if (operation === 'addition') {
      text(`c_${i + 1}${j + 1} = ${matrixA[i][j]} + ${matrixB[i][j]} = ${matrixC[i][j]}`, canvasWidth / 2, y + 45);
    } else {
      let result = matrixC[i][j];
      text(`c_${i + 1}${j + 1} = ${scalarValue.toFixed(1)} × ${matrixA[i][j]} = ${Number.isInteger(result) ? result : result.toFixed(1)}`, canvasWidth / 2, y + 45);
    }
  }
}

function initializeMatrices() {
  matrixA = [];
  matrixB = [];
  for (let i = 0; i < ROWS; i++) {
    matrixA[i] = [];
    matrixB[i] = [];
    for (let j = 0; j < COLS; j++) {
      matrixA[i][j] = floor(random(-5, 6));
      matrixB[i][j] = floor(random(-5, 6));
    }
  }
  highlightIndex = -1;
  calculateResult();
}

function calculateResult() {
  matrixC = [];
  for (let i = 0; i < ROWS; i++) {
    matrixC[i] = [];
    for (let j = 0; j < COLS; j++) {
      if (operation === 'addition') {
        matrixC[i][j] = matrixA[i][j] + matrixB[i][j];
      } else {
        matrixC[i][j] = scalarValue * matrixA[i][j];
      }
    }
  }
}

function onOperationChange() {
  operation = operationSelect.value();
  highlightIndex = -1;
}

function onScalarChange() {
  scalarValue = scalarSlider.value();
}

function stepAnimation() {
  highlightIndex++;
  if (highlightIndex >= ROWS * COLS) {
    highlightIndex = 0;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  scalarSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
