// @ts-nocheck
// Matrix Multiplication Step-by-Step Visualizer
// Helps students understand the row-by-column computation process
// by animating each entry calculation.
/// <reference types="p5/global" />                                        


// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 320;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let sliderLeftMargin = 200;

let margin = 25;
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

  // Create control buttons - first row
  resetButton = createButton('Reset');
  resetButton.position(150, drawHeight + 8);
  resetButton.mousePressed(resetAnimation);

  nextButton = createButton('First Multiplication');
  nextButton.position(210, drawHeight + 8);
  nextButton.mousePressed(nextStep);

  // Second row - Auto button and speed slider
  autoPlayButton = createButton('Auto');
  autoPlayButton.position(10, drawHeight + 43);
  autoPlayButton.mousePressed(toggleAutoPlay);

  // Create speed slider (inverted: left = slow, right = fast)
  // Slider value 2400 gives animationSpeed = 3200 - 2400 = 800ms
  // Slower is on the left, faster on the right
  speedSlider = createSlider(200, 3000, 1000, 100);
  speedSlider.position(sliderLeftMargin, drawHeight + 43);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
  speedSlider.input(onSpeedChange);

  // Initialize matrices (must be after UI elements are created)
  initializeMatrices();

  describe('Matrix multiplication visualizer showing step-by-step row-by-column dot product calculations with animation.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  // light boarder around both the drawing and control areas
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
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
  
  push();
  translate(0, -10);
  drawCalculationDisplay();
  pop();

  // Control labels - second row
  fill('black');
  noStroke();
  textSize(14);

  // Animation Speed label (right of Auto button)
  textAlign(LEFT, CENTER);
  text('Animation Speed: ', 75, drawHeight + 55);

  // Slow/Fast labels under slider
  textAlign(LEFT, TOP);
  text('Slower', sliderLeftMargin + 20, drawHeight + 63);
  textAlign(RIGHT, TOP);
  text('Faster', canvasWidth - margin -10, drawHeight + 63);
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

// Helper function to draw text with subscripts
// tokens is an array where each element is either:
//   - a string (drawn normally)
//   - an object {base: 'c', sub: 'ij', scale: 2, color: 'red', yOffset: -5, subYOffset: 4}
//     scale is optional (default 1) and multiplies the base letter size
//     color is optional and sets the fill color for this token
//     yOffset is optional additional vertical offset for base letter
//     subYOffset is optional additional vertical offset for subscript
function drawWithSubscripts(tokens, centerX, y, baseSize, defaultColor) {
  // First calculate total width for centering
  let totalWidth = 0;
  for (let token of tokens) {
    if (typeof token === 'string') {
      textSize(baseSize);
      totalWidth += textWidth(token);
    } else {
      let scale = token.scale || 1;
      textSize(baseSize * scale);
      totalWidth += textWidth(token.base);
      textSize(baseSize * 0.7);
      totalWidth += textWidth(token.sub);
    }
  }

  // Draw from left, starting at center minus half width
  let x = centerX - totalWidth / 2;
  textAlign(LEFT, TOP);

  for (let token of tokens) {
    if (typeof token === 'string') {
      if (defaultColor) fill(defaultColor);
      textSize(baseSize);
      text(token, x, y);
      x += textWidth(token);
    } else {
      let scale = token.scale || 1;
      let tokenYOffset = token.yOffset || 0;
      let subYOffset = token.subYOffset || 0;
      // Draw base letter (optionally scaled and colored)
      if (token.color) fill(token.color);
      else if (defaultColor) fill(defaultColor);
      textSize(baseSize * scale);
      let scaleYOffset = (scale > 1) ? -baseSize * (scale - 1) * 0.3 : 0;
      text(token.base, x, y + scaleYOffset + tokenYOffset);
      x += textWidth(token.base);
      // Draw subscript (smaller and lower, same color as base)
      textSize(baseSize * 0.7);
      text(token.sub, x, y + baseSize * 0.4 + subYOffset);
      x += textWidth(token.sub);
      // Reset color for next token
      if (token.color && defaultColor) fill(defaultColor);
    }
  }
}

function drawCalculationDisplay() {
  let y = 220;

  fill('black');
  noStroke();

  // Calculate number of operations
  let numMultiplications = rowsA * colsB * colsA;
  let numAdditions = rowsA * colsB * (colsA - 1);

  // Show operations count
  textAlign(CENTER, TOP);
  textSize(14);
  fill('black');
  text(`Number of Operations: Multiplications = ${numMultiplications}   Additions = ${numAdditions}`, canvasWidth / 2, y);

  if (calculationComplete) {
    fill('green');
    textAlign(CENTER, TOP);
    textSize(14);
    text('Multiplication Complete!', canvasWidth / 2, y + 30);
    return;
  }

  // Show formula with subscripts: Computing c₁₂ = Row 1 of A · Column 2 of B
  let i = currentRow + 1;
  let j = currentCol + 1;
  drawWithSubscripts([
    'Computing ', {base: 'c', sub: `${i}${j}`, scale: 2, color: 'goldenrod', yOffset: -5, subYOffset: 4}, ` = Row ${i} of A · Column ${j} of B`
  ], canvasWidth / 2, y + 20, 14, 'black');

  // Show dot product calculation with numeric values
  let calcStr = '';
  for (let k = 0; k < colsA; k++) {
    if (k > 0) calcStr += ' + ';
    let aVal = matrixA[currentRow][k];
    let bVal = matrixB[k][currentCol];
    if (k < dotProductStep) {
      calcStr += `${aVal}×${bVal}`;
    } else if (k === dotProductStep) {
      calcStr += `[${aVal}×${bVal}]`;
    } else {
      calcStr += `(${aVal}×${bVal})`;
    }
  }

  textAlign(CENTER, TOP);
  textSize(14);
  fill('black');
  text(calcStr, canvasWidth / 2, y + 55);

  // Show running sum
  if (dotProductStep > 0) {
    drawWithSubscripts([
      {base: 'c', sub: `${i}${j}`, scale: 2, color: 'goldenrod', yOffset: -5, subYOffset: 4}, ` = ${runningSum} (running sum)`
    ], canvasWidth / 2, y + 80, 14, 'red');
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
  // If complete and user clicks again, reset
  if (calculationComplete) {
    resetAnimation();
    return;
  }

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
      nextButton.html('Done');
    } else {
      // Reset for next entry
      dotProductStep = 0;
      runningSum = 0;
      nextButton.html('Next Multiplication');
    }
  } else {
    // Update button label after first step
    nextButton.html('Next Multiplication');
  }
}

function resetAnimation() {
  currentRow = 0;
  currentCol = 0;
  dotProductStep = 0;
  runningSum = 0;
  calculationComplete = false;
  stopAutoPlay();
  nextButton.html('First Multiplication');

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
  // Invert slider: left (200) = slow (3000ms), right (3000) = fast (200ms)
  animationSpeed = 3200 - speedSlider.value();
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
