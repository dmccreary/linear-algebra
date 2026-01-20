// Block Matrix Partitioning Visualizer
// Helps students understand how matrices can be partitioned into blocks
// and how block operations mirror element-wise operations at a higher level.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let defaultTextSize = 16;

// Matrix settings
const MATRIX_SIZE = 8;
let matrix = [];

// Partition settings
let hPartition = 4;  // Horizontal partition (row split)
let vPartition = 4;  // Vertical partition (column split)

// UI elements
let partitionSelect;
let showDimensionsCheckbox;

// Display settings
let showDimensions = true;

// Cell dimensions (calculated)
let cellSize = 35;
let matrixX, matrixY;

// Block colors
const BLOCK_COLORS = [
  { fill: 'rgba(135, 206, 250, 0.7)', stroke: 'steelblue', label: 'A' },      // Light blue
  { fill: 'rgba(144, 238, 144, 0.7)', stroke: 'seagreen', label: 'B' },       // Light green
  { fill: 'rgba(255, 182, 193, 0.7)', stroke: 'indianred', label: 'C' },      // Light pink
  { fill: 'rgba(255, 218, 185, 0.7)', stroke: 'chocolate', label: 'D' }       // Peach
];

// Dragging state
let isDraggingH = false;
let isDraggingV = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Generate matrix
  generateMatrix();

  // Create partition selector
  partitionSelect = createSelect();
  partitionSelect.option('2×2 Blocks', '4,4');
  partitionSelect.option('Row Partition', '4,8');
  partitionSelect.option('Column Partition', '8,4');
  partitionSelect.option('Asymmetric', '3,5');
  partitionSelect.selected('4,4');
  partitionSelect.position(10, drawHeight + 12);
  partitionSelect.changed(onPartitionSelect);

  // Create show dimensions checkbox
  showDimensionsCheckbox = createCheckbox(' Show Dimensions', true);
  showDimensionsCheckbox.position(150, drawHeight + 12);
  showDimensionsCheckbox.changed(() => showDimensions = showDimensionsCheckbox.checked());

  describe('Interactive block matrix visualization with draggable partition lines showing how matrices can be divided into submatrices.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Calculate cell size based on available space
  cellSize = Math.min(35, (min(canvasWidth * 0.7, drawHeight - 80)) / MATRIX_SIZE);
  matrixX = (canvasWidth - MATRIX_SIZE * cellSize) / 2;
  matrixY = 50;

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
  text('Block Matrix Partitioning', canvasWidth / 2, 10);

  // Draw matrix with blocks
  drawBlockMatrix();

  // Draw partition lines (draggable)
  drawPartitionLines();

  // Draw block information panel
  drawBlockInfo();

  // Instructions
  fill('gray');
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text('Drag partition lines to resize blocks', canvasWidth / 2, drawHeight - 5);
}

function drawBlockMatrix() {
  // Draw block backgrounds first
  for (let blockRow = 0; blockRow < 2; blockRow++) {
    for (let blockCol = 0; blockCol < 2; blockCol++) {
      let startRow = blockRow === 0 ? 0 : hPartition;
      let endRow = blockRow === 0 ? hPartition : MATRIX_SIZE;
      let startCol = blockCol === 0 ? 0 : vPartition;
      let endCol = blockCol === 0 ? vPartition : MATRIX_SIZE;

      let blockIndex = blockRow * 2 + blockCol;
      let color = BLOCK_COLORS[blockIndex];

      // Skip empty blocks
      if (startRow >= endRow || startCol >= endCol) continue;

      // Block background
      let x = matrixX + startCol * cellSize;
      let y = matrixY + startRow * cellSize;
      let w = (endCol - startCol) * cellSize;
      let h = (endRow - startRow) * cellSize;

      fill(color.fill);
      noStroke();
      rect(x, y, w, h);

      // Block label
      fill(color.stroke);
      textSize(20);
      textAlign(CENTER, CENTER);
      text(color.label, x + w / 2, y + h / 2);
    }
  }

  // Draw cell borders
  stroke(200);
  strokeWeight(1);
  for (let i = 0; i < MATRIX_SIZE; i++) {
    for (let j = 0; j < MATRIX_SIZE; j++) {
      let x = matrixX + j * cellSize;
      let y = matrixY + i * cellSize;
      noFill();
      rect(x, y, cellSize, cellSize);
    }
  }

  // Draw cell values
  fill('black');
  noStroke();
  textSize(cellSize > 30 ? 12 : 10);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < MATRIX_SIZE; i++) {
    for (let j = 0; j < MATRIX_SIZE; j++) {
      let x = matrixX + j * cellSize + cellSize / 2;
      let y = matrixY + i * cellSize + cellSize / 2;
      text(matrix[i][j], x, y);
    }
  }

  // Draw outer border
  noFill();
  stroke('black');
  strokeWeight(2);
  rect(matrixX, matrixY, MATRIX_SIZE * cellSize, MATRIX_SIZE * cellSize);
}

function drawPartitionLines() {
  let matrixRight = matrixX + MATRIX_SIZE * cellSize;
  let matrixBottom = matrixY + MATRIX_SIZE * cellSize;

  // Horizontal partition line
  if (hPartition > 0 && hPartition < MATRIX_SIZE) {
    let hLineY = matrixY + hPartition * cellSize;
    stroke('red');
    strokeWeight(3);
    line(matrixX - 10, hLineY, matrixRight + 10, hLineY);

    // Handle
    fill(isDraggingH ? 'red' : 'white');
    stroke('red');
    strokeWeight(2);
    ellipse(matrixX - 15, hLineY, 12, 12);
  }

  // Vertical partition line
  if (vPartition > 0 && vPartition < MATRIX_SIZE) {
    let vLineX = matrixX + vPartition * cellSize;
    stroke('blue');
    strokeWeight(3);
    line(vLineX, matrixY - 10, vLineX, matrixBottom + 10);

    // Handle
    fill(isDraggingV ? 'blue' : 'white');
    stroke('blue');
    strokeWeight(2);
    ellipse(vLineX, matrixY - 15, 12, 12);
  }
}

function drawBlockInfo() {
  let infoX = 10;
  let infoY = matrixY + MATRIX_SIZE * cellSize + 20;

  fill('black');
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);

  // Block structure notation
  text('Block structure:', infoX, infoY);

  if (showDimensions) {
    let aRows = hPartition;
    let aCols = vPartition;
    let bRows = hPartition;
    let bCols = MATRIX_SIZE - vPartition;
    let cRows = MATRIX_SIZE - hPartition;
    let cCols = vPartition;
    let dRows = MATRIX_SIZE - hPartition;
    let dCols = MATRIX_SIZE - vPartition;

    textSize(11);
    fill('steelblue');
    text(`A: ${aRows}×${aCols}`, infoX + 100, infoY);

    fill('seagreen');
    text(`B: ${bRows}×${bCols}`, infoX + 160, infoY);

    fill('indianred');
    text(`C: ${cRows}×${cCols}`, infoX + 220, infoY);

    fill('chocolate');
    text(`D: ${dRows}×${dCols}`, infoX + 280, infoY);
  }

  // Show matrix notation
  fill('gray');
  textSize(11);
  textAlign(CENTER, TOP);
  text('M = [A B; C D]', canvasWidth / 2, infoY + 18);
}

function generateMatrix() {
  matrix = [];
  for (let i = 0; i < MATRIX_SIZE; i++) {
    matrix[i] = [];
    for (let j = 0; j < MATRIX_SIZE; j++) {
      matrix[i][j] = floor(random(1, 10));
    }
  }
}

function onPartitionSelect() {
  let val = partitionSelect.value();
  let parts = val.split(',');
  hPartition = parseInt(parts[0]);
  vPartition = parseInt(parts[1]);
}

function mousePressed() {
  // Check if clicking on horizontal partition handle
  if (hPartition > 0 && hPartition < MATRIX_SIZE) {
    let hLineY = matrixY + hPartition * cellSize;
    if (dist(mouseX, mouseY, matrixX - 15, hLineY) < 15) {
      isDraggingH = true;
      return;
    }
  }

  // Check if clicking on vertical partition handle
  if (vPartition > 0 && vPartition < MATRIX_SIZE) {
    let vLineX = matrixX + vPartition * cellSize;
    if (dist(mouseX, mouseY, vLineX, matrixY - 15) < 15) {
      isDraggingV = true;
      return;
    }
  }
}

function mouseDragged() {
  if (isDraggingH) {
    // Calculate new horizontal partition
    let newH = round((mouseY - matrixY) / cellSize);
    hPartition = constrain(newH, 1, MATRIX_SIZE - 1);
  }

  if (isDraggingV) {
    // Calculate new vertical partition
    let newV = round((mouseX - matrixX) / cellSize);
    vPartition = constrain(newV, 1, MATRIX_SIZE - 1);
  }
}

function mouseReleased() {
  isDraggingH = false;
  isDraggingV = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
