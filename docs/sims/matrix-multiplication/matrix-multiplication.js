// Matrix Multiplication Step-by-Step Visualizer
// Helps students understand the row-by-column computation process
// by animating each entry calculation.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 280;
let defaultTextSize = 16;

// Matrix dimensions
let rowsA = 2;
let colsA = 3;
let rowsB = 3;  // Must equal colsA
let colsB = 2;

// Matrices
let matrixA = [];
let matrixB = [];
let matrixC = [];

// UI elements
let dimSelectA;
let dimSelectB;
let nextButton;
let autoPlayButton;
let resetButton;
let speedSlider;

// Animation state
let currentRow = 0;
let currentCol = 0;
let dotProductStep = 0;  // Which element of the dot product we're on
let runningSum = 0;
let isAutoPlaying = false;
let autoPlayInterval = null;
let animationSpeed = 800;
let calculationComplete = false;

// Cell dimensions
let cellSize = 36;
let matrixGap = 20;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Initialize matrices
  initializeMatrices();

  // Create dimension selector for A
  dimSelectA = createSelect();
  dimSelectA.option('2×2', '2x2');
  dimSelectA.option('2×3', '2x3');
  dimSelectA.option('3×2', '3x2');
  dimSelectA.option('3×3', '3x3');
  dimSelectA.selected('2x3');
  dimSelectA.position(10, drawHeight + 8);
  dimSelectA.changed(onDimensionChangeA);

  // Create dimension selector for B
  dimSelectB = createSelect();
  updateDimSelectB();
  dimSelectB.position(80, drawHeight + 8);
  dimSelectB.changed(onDimensionChangeB);

  // Create control buttons
  nextButton = createButton('Next');
  nextButton.position(150, drawHeight + 8);
  nextButton.mousePressed(nextStep);

  autoPlayButton = createButton('Auto');
  autoPlayButton.position(200, drawHeight + 8);
  autoPlayButton.mousePressed(toggleAutoPlay);

  resetButton = createButton('Reset');
  resetButton.position(250, drawHeight + 8);
  resetButton.mousePressed(resetAnimation);

  // Create speed slider
  speedSlider = createSlider(200, 2000, 800, 100);
  speedSlider.position(sliderLeftMargin, drawHeight + 43);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  speedSlider.input(onSpeedChange);

  describe('Matrix multiplication visualizer showing step-by-step row-by-column dot product calculations with animation.', LABEL);
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
  text('Matrix Multiplication: A × B = C', canvasWidth / 2, 8);

  // Calculate layout
  let totalMatrixWidth = (colsA * cellSize) + matrixGap + (colsB * cellSize) + matrixGap + (colsB * cellSize) + 80;
  let startX = (canvasWidth - totalMatrixWidth) / 2;
  let matrixY = 50;

  // Draw matrices
  let matrixAX = startX;
  drawMatrixA(matrixAX, matrixY);

  let symbolX = matrixAX + colsA * cellSize + matrixGap / 2;
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text('×', symbolX, matrixY + (rowsA * cellSize) / 2);

  let matrixBX = matrixAX + colsA * cellSize + matrixGap;
  drawMatrixB(matrixBX, matrixY);

  let equalsX = matrixBX + colsB * cellSize + matrixGap / 2;
  text('=', equalsX, matrixY + (rowsA * cellSize) / 2);

  let matrixCX = matrixBX + colsB * cellSize + matrixGap;
  drawMatrixC(matrixCX, matrixY);

  // Draw dimension labels
  drawDimensionLabels(matrixAX, matrixBX, matrixCX, matrixY);

  // Draw calculation display
  drawCalculationDisplay();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Speed: ' + animationSpeed + 'ms', 10, drawHeight + 55);
}

function drawMatrixA(x, y) {
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      let cellX = x + j * cellSize;
      let cellY = y + i * cellSize;

      // Highlight current row
      let isHighlightedRow = (i === currentRow && !calculationComplete);
      let isCurrentElement = (i === currentRow && j === dotProductStep && !calculationComplete);

      if (isCurrentElement) {
        fill('yellow');
        stroke('orange');
        strokeWeight(3);
      } else if (isHighlightedRow) {
        fill('lightblue');
        stroke('steelblue');
        strokeWeight(2);
      } else {
        fill('white');
        stroke('gray');
        strokeWeight(1);
      }
      rect(cellX, cellY, cellSize, cellSize, 3);

      // Cell value
      fill(isCurrentElement ? 'red' : 'black');
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      text(matrixA[i][j], cellX + cellSize / 2, cellY + cellSize / 2);
    }
  }

  // Label
  fill('steelblue');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('A', x + (colsA * cellSize) / 2, y + rowsA * cellSize + 3);
}

function drawMatrixB(x, y) {
  for (let i = 0; i < rowsB; i++) {
    for (let j = 0; j < colsB; j++) {
      let cellX = x + j * cellSize;
      let cellY = y + i * cellSize;

      // Highlight current column
      let isHighlightedCol = (j === currentCol && !calculationComplete);
      let isCurrentElement = (j === currentCol && i === dotProductStep && !calculationComplete);

      if (isCurrentElement) {
        fill('yellow');
        stroke('orange');
        strokeWeight(3);
      } else if (isHighlightedCol) {
        fill('lightgreen');
        stroke('seagreen');
        strokeWeight(2);
      } else {
        fill('white');
        stroke('gray');
        strokeWeight(1);
      }
      rect(cellX, cellY, cellSize, cellSize, 3);

      // Cell value
      fill(isCurrentElement ? 'red' : 'black');
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      text(matrixB[i][j], cellX + cellSize / 2, cellY + cellSize / 2);
    }
  }

  // Label
  fill('seagreen');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('B', x + (colsB * cellSize) / 2, y + rowsB * cellSize + 3);
}

function drawMatrixC(x, y) {
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let cellX = x + j * cellSize;
      let cellY = y + i * cellSize;

      // Highlight current entry being calculated
      let isCurrentEntry = (i === currentRow && j === currentCol && !calculationComplete);
      let isComputed = matrixC[i][j] !== null;

      if (isCurrentEntry) {
        fill('lightyellow');
        stroke('goldenrod');
        strokeWeight(3);
      } else if (isComputed) {
        fill('lightgoldenrodyellow');
        stroke('goldenrod');
        strokeWeight(1);
      } else {
        fill('white');
        stroke('gray');
        strokeWeight(1);
      }
      rect(cellX, cellY, cellSize, cellSize, 3);

      // Cell value
      if (isComputed || (isCurrentEntry && dotProductStep >= colsA)) {
        fill('black');
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(14);
        let val = isCurrentEntry ? runningSum : matrixC[i][j];
        text(val, cellX + cellSize / 2, cellY + cellSize / 2);
      }
    }
  }

  // Label
  fill('goldenrod');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('C', x + (colsB * cellSize) / 2, y + rowsA * cellSize + 3);
}

function drawDimensionLabels(aX, bX, cX, y) {
  let labelY = y + max(rowsA, rowsB) * cellSize + 20;

  fill('gray');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);

  text(`(${rowsA}×${colsA})`, aX + (colsA * cellSize) / 2, labelY);
  text(`(${rowsB}×${colsB})`, bX + (colsB * cellSize) / 2, labelY);
  text(`(${rowsA}×${colsB})`, cX + (colsB * cellSize) / 2, labelY);
}

function drawCalculationDisplay() {
  let y = 250;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);

  if (calculationComplete) {
    fill('green');
    text('Multiplication Complete!', canvasWidth / 2, y);
    return;
  }

  // Show formula
  text(`Computing C[${currentRow + 1},${currentCol + 1}] = Row ${currentRow + 1} of A · Column ${currentCol + 1} of B`, canvasWidth / 2, y);

  // Show dot product calculation
  let calcStr = '';
  for (let k = 0; k < colsA; k++) {
    if (k > 0) calcStr += ' + ';
    if (k < dotProductStep) {
      calcStr += `${matrixA[currentRow][k]}×${matrixB[k][currentCol]}`;
    } else if (k === dotProductStep) {
      calcStr += `[${matrixA[currentRow][k]}×${matrixB[k][currentCol]}]`;
    } else {
      calcStr += `(${matrixA[currentRow][k]}×${matrixB[k][currentCol]})`;
    }
  }

  textSize(12);
  fill('black');
  text(calcStr, canvasWidth / 2, y + 25);

  // Show running sum
  if (dotProductStep > 0) {
    fill('red');
    textSize(14);
    text(`Running sum: ${runningSum}`, canvasWidth / 2, y + 50);
  }
}

function initializeMatrices() {
  matrixA = [];
  matrixB = [];
  matrixC = [];

  for (let i = 0; i < rowsA; i++) {
    matrixA[i] = [];
    for (let j = 0; j < colsA; j++) {
      matrixA[i][j] = floor(random(1, 6));
    }
  }

  for (let i = 0; i < rowsB; i++) {
    matrixB[i] = [];
    for (let j = 0; j < colsB; j++) {
      matrixB[i][j] = floor(random(1, 6));
    }
  }

  // Initialize result matrix with nulls
  for (let i = 0; i < rowsA; i++) {
    matrixC[i] = [];
    for (let j = 0; j < colsB; j++) {
      matrixC[i][j] = null;
    }
  }

  resetAnimation();
}

function nextStep() {
  if (calculationComplete) return;

  if (dotProductStep < colsA) {
    // Add next product to running sum
    runningSum += matrixA[currentRow][dotProductStep] * matrixB[dotProductStep][currentCol];
    dotProductStep++;
  }

  if (dotProductStep >= colsA) {
    // Entry complete, store result
    matrixC[currentRow][currentCol] = runningSum;

    // Move to next entry
    currentCol++;
    if (currentCol >= colsB) {
      currentCol = 0;
      currentRow++;
    }

    if (currentRow >= rowsA) {
      calculationComplete = true;
      stopAutoPlay();
    } else {
      // Reset for next entry
      dotProductStep = 0;
      runningSum = 0;
    }
  }
}

function resetAnimation() {
  currentRow = 0;
  currentCol = 0;
  dotProductStep = 0;
  runningSum = 0;
  calculationComplete = false;
  stopAutoPlay();

  // Clear result matrix
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      matrixC[i][j] = null;
    }
  }
}

function toggleAutoPlay() {
  if (isAutoPlaying) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

function startAutoPlay() {
  if (calculationComplete) {
    resetAnimation();
  }
  isAutoPlaying = true;
  autoPlayButton.html('Stop');
  autoPlayInterval = setInterval(nextStep, animationSpeed);
}

function stopAutoPlay() {
  isAutoPlaying = false;
  autoPlayButton.html('Auto');
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

function onSpeedChange() {
  animationSpeed = speedSlider.value();
  if (isAutoPlaying) {
    stopAutoPlay();
    startAutoPlay();
  }
}

function onDimensionChangeA() {
  let val = dimSelectA.value();
  let parts = val.split('x');
  rowsA = parseInt(parts[0]);
  colsA = parseInt(parts[1]);
  rowsB = colsA;  // Must match
  updateDimSelectB();
  initializeMatrices();
}

function updateDimSelectB() {
  // Remove old options
  dimSelectB.elt.innerHTML = '';

  // Add options where rowsB matches colsA
  if (colsA === 2) {
    dimSelectB.option('2×2', '2x2');
    dimSelectB.option('2×3', '2x3');
    dimSelectB.selected('2x2');
    colsB = 2;
  } else if (colsA === 3) {
    dimSelectB.option('3×2', '3x2');
    dimSelectB.option('3×3', '3x3');
    dimSelectB.selected('3x2');
    colsB = 2;
  }
  rowsB = colsA;
}

function onDimensionChangeB() {
  let val = dimSelectB.value();
  let parts = val.split('x');
  rowsB = parseInt(parts[0]);
  colsB = parseInt(parts[1]);
  initializeMatrices();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
