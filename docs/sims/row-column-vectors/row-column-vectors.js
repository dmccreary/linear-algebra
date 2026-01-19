// Row and Column Vector Visualization MicroSim
// Helps students visually distinguish between row vectors (horizontal)
// and column vectors (vertical), understanding how orientation affects matrix operations.

// Canvas dimensions - responsive width
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;  // 2 rows of controls
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Application-specific variables
let numElements = 4;
let rowValues = [];
let colValues = [];
let showDimensions = true;

// UI elements
let elementsSlider;
let randomizeButton;
let dimensionsCheckbox;

// Cell dimensions
let cellWidth = 50;
let cellHeight = 50;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Initialize random values
  generateRandomValues();

  // Create Randomize button
  randomizeButton = createButton('Randomize');
  randomizeButton.position(10, drawHeight + 8);
  randomizeButton.mousePressed(generateRandomValues);

  // Create elements slider
  elementsSlider = createSlider(2, 6, numElements, 1);
  elementsSlider.position(sliderLeftMargin, drawHeight + 8);
  elementsSlider.size(canvasWidth - sliderLeftMargin - margin);
  elementsSlider.input(onElementsChange);

  // Create show dimensions checkbox
  dimensionsCheckbox = createCheckbox(' Show Dimensions', true);
  dimensionsCheckbox.position(10, drawHeight + 43);
  dimensionsCheckbox.changed(() => showDimensions = dimensionsCheckbox.checked());

  describe('Interactive visualization comparing row vectors (horizontal, 1×n) and column vectors (vertical, m×1) with adjustable number of elements.', LABEL);
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
  textSize(24);
  text('Row and Column Vectors', canvasWidth / 2, 15);

  // Calculate positions for vectors
  let rowVectorX = canvasWidth * 0.25;
  let colVectorX = canvasWidth * 0.75;
  let rowVectorY = 130;
  let colVectorY = 100;

  // Draw row vector (horizontal)
  drawRowVector(rowVectorX, rowVectorY);

  // Draw column vector (vertical)
  drawColumnVector(colVectorX, colVectorY);

  // Draw labels
  textSize(18);
  textAlign(CENTER, TOP);
  fill('steelblue');
  noStroke();
  text('Row Vector', rowVectorX, 60);
  fill('seagreen');
  text('Column Vector', colVectorX, 60);

  // Draw dimension annotations if enabled
  if (showDimensions) {
    drawDimensionAnnotations(rowVectorX, colVectorX, rowVectorY, colVectorY);
  }

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Elements: ' + numElements, 100, drawHeight + 20);
}

function drawRowVector(centerX, y) {
  let totalWidth = numElements * cellWidth;
  let startX = centerX - totalWidth / 2;

  // Draw cells
  for (let i = 0; i < numElements; i++) {
    let x = startX + i * cellWidth;

    // Cell background
    fill('lightblue');
    stroke('steelblue');
    strokeWeight(2);
    rect(x, y, cellWidth, cellHeight, 5);

    // Cell value
    fill('darkblue');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text(rowValues[i], x + cellWidth / 2, y + cellHeight / 2);
  }

  // Draw subscript labels below
  textSize(12);
  fill('gray');
  for (let i = 0; i < numElements; i++) {
    let x = startX + i * cellWidth + cellWidth / 2;
    text('r' + (i + 1), x, y + cellHeight + 15);
  }
}

function drawColumnVector(centerX, y) {
  let totalHeight = numElements * cellHeight;
  let startX = centerX - cellWidth / 2;

  // Draw cells
  for (let i = 0; i < numElements; i++) {
    let cellY = y + i * cellHeight;

    // Cell background
    fill('lightgreen');
    stroke('seagreen');
    strokeWeight(2);
    rect(startX, cellY, cellWidth, cellHeight, 5);

    // Cell value
    fill('darkgreen');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text(colValues[i], startX + cellWidth / 2, cellY + cellHeight / 2);
  }

  // Draw subscript labels to the right
  textSize(12);
  fill('gray');
  for (let i = 0; i < numElements; i++) {
    let cellY = y + i * cellHeight + cellHeight / 2;
    text('c' + (i + 1), startX + cellWidth + 15, cellY);
  }
}

function drawDimensionAnnotations(rowX, colX, rowVectorY, colVectorY) {
  textSize(16);
  noStroke();

  // Row vector dimensions: 1 × n
  let rowTotalWidth = numElements * cellWidth;
  let rowStartX = rowX - rowTotalWidth / 2;

  // Draw bracket above row vector
  stroke('steelblue');
  strokeWeight(2);
  let bracketY = rowVectorY - 20;
  line(rowStartX, bracketY, rowStartX + rowTotalWidth, bracketY);
  line(rowStartX, bracketY, rowStartX, bracketY + 8);
  line(rowStartX + rowTotalWidth, bracketY, rowStartX + rowTotalWidth, bracketY + 8);

  // Dimension label for row vector
  fill('steelblue');
  noStroke();
  textAlign(CENTER, BOTTOM);
  text('1 × ' + numElements, rowX, bracketY - 5);

  // Column vector dimensions: m × 1
  let colTotalHeight = numElements * cellHeight;
  let colStartX = colX - cellWidth / 2;

  // Draw bracket to left of column vector
  stroke('seagreen');
  strokeWeight(2);
  let bracketX = colStartX - 20;
  line(bracketX, colVectorY, bracketX, colVectorY + colTotalHeight);
  line(bracketX, colVectorY, bracketX + 8, colVectorY);
  line(bracketX, colVectorY + colTotalHeight, bracketX + 8, colVectorY + colTotalHeight);

  // Dimension label for column vector
  fill('seagreen');
  noStroke();
  textAlign(RIGHT, CENTER);
  push();
  translate(bracketX - 10, colVectorY + colTotalHeight / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text(numElements + ' × 1', 0, 0);
  pop();
}

function generateRandomValues() {
  rowValues = [];
  colValues = [];
  for (let i = 0; i < 6; i++) {  // Generate up to max elements
    rowValues.push(floor(random(1, 10)));
    colValues.push(floor(random(1, 10)));
  }
}

function onElementsChange() {
  numElements = elementsSlider.value();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  elementsSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
