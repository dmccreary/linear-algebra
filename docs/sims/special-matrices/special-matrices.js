// Special Matrix Types Gallery MicroSim
// Helps students visually identify and distinguish between different special matrix types
// by their structural patterns.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Matrix settings
let matrixSize = 4;
let showZeros = true;
let selectedType = null;  // Which matrix type is selected for detail view

// Matrix types
const MATRIX_TYPES = ['identity', 'diagonal', 'upper', 'lower'];
const TYPE_LABELS = {
  'identity': 'Identity',
  'diagonal': 'Diagonal',
  'upper': 'Upper Triangular',
  'lower': 'Lower Triangular'
};

const TYPE_COLORS = {
  'identity': { fill: 'gold', stroke: 'darkgoldenrod' },
  'diagonal': { fill: 'lightblue', stroke: 'steelblue' },
  'upper': { fill: 'lightcoral', stroke: 'firebrick' },
  'lower': { fill: 'lightgreen', stroke: 'seagreen' }
};

const TYPE_DESCRIPTIONS = {
  'identity': 'Multiplicative identity: AI = IA = A',
  'diagonal': 'Only diagonal entries are non-zero',
  'upper': 'Zeros below the diagonal',
  'lower': 'Zeros above the diagonal'
};

// Matrix data
let matrices = {};

// UI elements
let sizeSlider;
let zerosCheckbox;
let randomizeButton;

// Cell size (calculated dynamically)
let cellSize = 30;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Generate initial matrices
  generateMatrices();

  // Create size slider
  sizeSlider = createSlider(3, 6, 4, 1);
  sizeSlider.position(sliderLeftMargin, drawHeight + 12);
  sizeSlider.size(canvasWidth - sliderLeftMargin - margin);
  sizeSlider.input(onSizeChange);

  // Create zeros checkbox
  zerosCheckbox = createCheckbox(' Show Zeros', true);
  zerosCheckbox.position(10, drawHeight + 10);
  zerosCheckbox.changed(() => showZeros = zerosCheckbox.checked());

  describe('Gallery of special matrix types: identity, diagonal, upper triangular, and lower triangular matrices with interactive size control.', LABEL);
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
  text('Special Matrix Types', canvasWidth / 2, 8);

  // Calculate cell size based on canvas width and matrix size
  let gridWidth = (canvasWidth - 60) / 2;  // Two columns with some padding
  cellSize = Math.min(30, Math.floor((gridWidth - 40) / matrixSize));

  // Draw 2x2 grid of matrix types
  let startY = 45;
  let colWidth = canvasWidth / 2;

  // Identity (top-left)
  drawMatrixCard('identity', margin, startY, colWidth - margin * 1.5);

  // Diagonal (top-right)
  drawMatrixCard('diagonal', colWidth + margin / 2, startY, colWidth - margin * 1.5);

  // Upper Triangular (bottom-left)
  let row2Y = startY + 165;
  drawMatrixCard('upper', margin, row2Y, colWidth - margin * 1.5);

  // Lower Triangular (bottom-right)
  drawMatrixCard('lower', colWidth + margin / 2, row2Y, colWidth - margin * 1.5);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Size: ' + matrixSize + '×' + matrixSize, 120, drawHeight + 22);
}

function drawMatrixCard(type, x, y, cardWidth) {
  let cardHeight = 155;
  let colors = TYPE_COLORS[type];
  let matrix = matrices[type];

  // Card background
  let isHovered = mouseX > x && mouseX < x + cardWidth && mouseY > y && mouseY < y + cardHeight;

  fill(isHovered ? 'white' : 'rgba(255,255,255,0.8)');
  stroke(isHovered ? colors.stroke : 'lightgray');
  strokeWeight(isHovered ? 2 : 1);
  rect(x, y, cardWidth, cardHeight, 8);

  // Matrix label
  fill(colors.stroke);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text(TYPE_LABELS[type], x + cardWidth / 2, y + 5);

  // Draw matrix
  let matrixWidth = matrixSize * cellSize;
  let matrixX = x + (cardWidth - matrixWidth) / 2;
  let matrixY = y + 25;

  drawMatrix(matrix, type, matrixX, matrixY);

  // Description
  fill('gray');
  textSize(10);
  textAlign(CENTER, TOP);
  text(TYPE_DESCRIPTIONS[type], x + cardWidth / 2, y + 30 + matrixSize * cellSize + 5);
}

function drawMatrix(matrix, type, x, y) {
  let colors = TYPE_COLORS[type];

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      let cellX = x + j * cellSize;
      let cellY = y + i * cellSize;
      let value = matrix[i][j];
      let isNonZero = value !== 0;
      let isDiagonal = i === j;

      // Determine cell appearance based on matrix type
      if (isNonZero) {
        if (type === 'identity' && isDiagonal) {
          fill('gold');
          stroke('darkgoldenrod');
        } else if (type === 'diagonal' && isDiagonal) {
          fill('lightblue');
          stroke('steelblue');
        } else if (type === 'upper') {
          fill(isDiagonal ? 'lightsalmon' : 'lightcoral');
          stroke('firebrick');
        } else if (type === 'lower') {
          fill(isDiagonal ? 'palegreen' : 'lightgreen');
          stroke('seagreen');
        }
        strokeWeight(1);
      } else {
        fill(showZeros ? 'whitesmoke' : 'white');
        stroke(showZeros ? 'lightgray' : 'white');
        strokeWeight(showZeros ? 1 : 0);
      }

      rect(cellX, cellY, cellSize, cellSize, 2);

      // Draw value
      if (isNonZero || showZeros) {
        fill(isNonZero ? 'black' : 'lightgray');
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(cellSize > 25 ? 14 : 11);
        text(value, cellX + cellSize / 2, cellY + cellSize / 2);
      }
    }
  }
}

function generateMatrices() {
  matrices = {};

  // Identity matrix
  matrices['identity'] = [];
  for (let i = 0; i < matrixSize; i++) {
    matrices['identity'][i] = [];
    for (let j = 0; j < matrixSize; j++) {
      matrices['identity'][i][j] = (i === j) ? 1 : 0;
    }
  }

  // Diagonal matrix (random non-zero diagonal)
  matrices['diagonal'] = [];
  for (let i = 0; i < matrixSize; i++) {
    matrices['diagonal'][i] = [];
    for (let j = 0; j < matrixSize; j++) {
      matrices['diagonal'][i][j] = (i === j) ? floor(random(1, 10)) : 0;
    }
  }

  // Upper triangular matrix
  matrices['upper'] = [];
  for (let i = 0; i < matrixSize; i++) {
    matrices['upper'][i] = [];
    for (let j = 0; j < matrixSize; j++) {
      matrices['upper'][i][j] = (j >= i) ? floor(random(1, 10)) : 0;
    }
  }

  // Lower triangular matrix
  matrices['lower'] = [];
  for (let i = 0; i < matrixSize; i++) {
    matrices['lower'][i] = [];
    for (let j = 0; j < matrixSize; j++) {
      matrices['lower'][i][j] = (j <= i) ? floor(random(1, 10)) : 0;
    }
  }
}

function onSizeChange() {
  matrixSize = sizeSlider.value();
  generateMatrices();
}

function mousePressed() {
  // Check if click is on randomize area (clicking any matrix card randomizes)
  if (mouseY < drawHeight && mouseY > 40) {
    generateMatrices();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  sizeSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
