// Sparse vs Dense Matrix Comparison MicroSim
// Helps students understand the structural difference between sparse and dense matrices
// and appreciate why sparsity enables computational efficiency.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 320;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Matrix settings
let matrixSize = 20;
let sparsityLevel = 85;  // Percentage of zeros

// Pattern types
let sparsePattern = 'random';

// UI elements
let sizeSlider;
let sparsitySlider;
let patternSelect;

// Matrix data
let denseMatrix = [];
let sparseMatrix = [];

// Statistics
let denseNonzeros = 0;
let sparseNonzeros = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Generate initial matrices
  generateMatrices();

  // Create pattern selector
  patternSelect = createSelect();
  patternSelect.option('Random', 'random');
  patternSelect.option('Diagonal', 'diagonal');
  patternSelect.option('Banded', 'banded');
  patternSelect.option('Block', 'block');
  patternSelect.selected('random');
  patternSelect.position(10, drawHeight + 8);
  patternSelect.changed(onPatternChange);

  // Create size slider
  sizeSlider = createSlider(10, 50, 20, 5);
  sizeSlider.position(sliderLeftMargin, drawHeight + 18);
  sizeSlider.size(200);
  sizeSlider.input(onSizeChange);

  // Create sparsity slider
  sparsitySlider = createSlider(50, 99, 85, 1);
  sparsitySlider.position(sliderLeftMargin + 220, drawHeight + 18);
  sparsitySlider.size(200);
  sparsitySlider.input(onSparsityChange);

  describe('Side-by-side comparison of dense and sparse matrices showing storage efficiency and sparsity patterns.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  // draw thin gray border around both the drawing and control areas
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
  text('Sparse vs Dense Matrices', canvasWidth / 2, 8);

  // Calculate display area
  let panelWidth = (canvasWidth - 30) / 2;
  let panelHeight = 200;
  let panelY = 40;

  // Draw dense matrix panel
  drawMatrixPanel(10, panelY, panelWidth, panelHeight, denseMatrix, 'Dense Matrix', false);

  // Draw sparse matrix panel
  drawMatrixPanel(panelWidth + 20, panelY, panelWidth, panelHeight, sparseMatrix, 'Sparse Matrix', true);

  // Draw statistics
  drawStatistics();

  // Control labels (above sliders)
  fill('black');
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(12);
  text('Size: ' + matrixSize, sliderLeftMargin + 3, drawHeight + 18);
  text('Sparsity: ' + sparsityLevel + '%', sliderLeftMargin + 223, drawHeight + 18);

  // Second row label
  textAlign(LEFT, TOP);
  text('Storage comparison:', 10, drawHeight + 55);

  // Draw storage bar chart
  drawStorageChart();
}

function drawMatrixPanel(x, y, w, h, matrix, title, isSparse) {
  // Panel background
  fill('white');
  stroke('gray');
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(isSparse ? 'seagreen' : 'steelblue');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text(title, x + w / 2, y + 5);

  // Calculate cell size
  let matrixDisplaySize = min(w - 20, h - 30);
  let cellSize = matrixDisplaySize / matrixSize;
  let matrixX = x + (w - matrixDisplaySize) / 2;
  let matrixY = y + 22;

  // Draw matrix cells
  noStroke();
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      let cellX = matrixX + j * cellSize;
      let cellY = matrixY + i * cellSize;
      let value = matrix[i][j];

      if (value !== 0) {
        // Non-zero: color based on value
        let intensity = map(abs(value), 0, 10, 100, 255);
        fill(isSparse ? color(50, intensity, 100) : color(70, 130, intensity));
      } else {
        // Zero: light gray
        fill(245);
      }
      rect(cellX, cellY, cellSize, cellSize);
    }
  }

  // Border around matrix
  noFill();
  stroke(isSparse ? 'seagreen' : 'steelblue');
  strokeWeight(1);
  rect(matrixX, matrixY, matrixDisplaySize, matrixDisplaySize);
}

function drawStatistics() {
  let y = 250;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Statistics', canvasWidth / 2, y);

  textSize(11);

  // Dense stats
  let totalEntries = matrixSize * matrixSize;

  fill('steelblue');
  textAlign(LEFT, TOP);
  text(`Dense: ${denseNonzeros}/${totalEntries} non-zero (${((denseNonzeros / totalEntries) * 100).toFixed(0)}%)`, 20, y + 20);

  // Sparse stats
  fill('seagreen');
  text(`Sparse: ${sparseNonzeros}/${totalEntries} non-zero (${((sparseNonzeros / totalEntries) * 100).toFixed(1)}%)`, 20, y + 35);

  // Memory comparison
  fill('gray');
  let denseMemory = totalEntries * 8;  // 8 bytes per double
  let sparseMemory = sparseNonzeros * (8 + 4 + 4);  // value + row + col indices
  let savings = ((1 - sparseMemory / denseMemory) * 100).toFixed(0);

  text(`Memory: Dense=${formatBytes(denseMemory)}, Sparse=${formatBytes(sparseMemory)} (${savings}% savings)`, 20, y + 50);
}

function drawStorageChart() {
  let chartX = 150;
  let chartY = drawHeight + 53;
  let chartWidth = canvasWidth - chartX - 20;
  let chartHeight = 20;

  let totalEntries = matrixSize * matrixSize;
  let denseMemory = totalEntries * 8;
  let sparseMemory = sparseNonzeros * 16;  // Simplified CSR estimate

  // Dense bar (full width = 100%)
  fill('steelblue');
  noStroke();
  rect(chartX, chartY, chartWidth, chartHeight / 2 - 1, 2);

  // Sparse bar (proportional)
  let sparseWidth = (sparseMemory / denseMemory) * chartWidth;
  fill('seagreen');
  rect(chartX, chartY + chartHeight / 2 + 1, sparseWidth, chartHeight / 2 - 1, 2);

  // Labels
  fill('white');
  textSize(9);
  textAlign(LEFT, CENTER);
  text('Dense: 100%', chartX + 5, chartY + chartHeight / 4);
  fill('seagreen');
  let sparsePercent = ((sparseMemory / denseMemory) * 100).toFixed(0);
  if (sparseWidth > 50) {
    fill('white');
    text(`Sparse: ${sparsePercent}%`, chartX + 5, chartY + 3 * chartHeight / 4);
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function generateMatrices() {
  denseMatrix = [];
  sparseMatrix = [];
  denseNonzeros = 0;
  sparseNonzeros = 0;

  // Generate dense matrix (mostly non-zero)
  for (let i = 0; i < matrixSize; i++) {
    denseMatrix[i] = [];
    for (let j = 0; j < matrixSize; j++) {
      if (random() > 0.1) {  // 90% non-zero
        denseMatrix[i][j] = floor(random(1, 10));
        denseNonzeros++;
      } else {
        denseMatrix[i][j] = 0;
      }
    }
  }

  // Generate sparse matrix based on pattern
  for (let i = 0; i < matrixSize; i++) {
    sparseMatrix[i] = [];
    for (let j = 0; j < matrixSize; j++) {
      sparseMatrix[i][j] = 0;
    }
  }

  switch (sparsePattern) {
    case 'diagonal':
      // Only diagonal and near-diagonal
      for (let i = 0; i < matrixSize; i++) {
        sparseMatrix[i][i] = floor(random(1, 10));
        sparseNonzeros++;
        if (i > 0 && random() > 0.5) {
          sparseMatrix[i][i - 1] = floor(random(1, 5));
          sparseNonzeros++;
        }
        if (i < matrixSize - 1 && random() > 0.5) {
          sparseMatrix[i][i + 1] = floor(random(1, 5));
          sparseNonzeros++;
        }
      }
      break;

    case 'banded':
      // Tri-diagonal band
      let bandwidth = 2;
      for (let i = 0; i < matrixSize; i++) {
        for (let j = max(0, i - bandwidth); j <= min(matrixSize - 1, i + bandwidth); j++) {
          if (random() > 0.3) {
            sparseMatrix[i][j] = floor(random(1, 10));
            sparseNonzeros++;
          }
        }
      }
      break;

    case 'block':
      // Block diagonal pattern
      let blockSize = max(3, floor(matrixSize / 4));
      for (let b = 0; b < matrixSize; b += blockSize) {
        for (let i = b; i < min(b + blockSize, matrixSize); i++) {
          for (let j = b; j < min(b + blockSize, matrixSize); j++) {
            if (random() > 0.4) {
              sparseMatrix[i][j] = floor(random(1, 10));
              sparseNonzeros++;
            }
          }
        }
      }
      break;

    default:  // random
      let targetNonzeros = floor(matrixSize * matrixSize * (1 - sparsityLevel / 100));
      while (sparseNonzeros < targetNonzeros) {
        let i = floor(random(matrixSize));
        let j = floor(random(matrixSize));
        if (sparseMatrix[i][j] === 0) {
          sparseMatrix[i][j] = floor(random(1, 10));
          sparseNonzeros++;
        }
      }
      break;
  }
}

function onSizeChange() {
  matrixSize = sizeSlider.value();
  generateMatrices();
}

function onSparsityChange() {
  sparsityLevel = sparsitySlider.value();
  generateMatrices();
}

function onPatternChange() {
  sparsePattern = patternSelect.value();
  generateMatrices();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
