// Tensor Operations Visualizer
// Shows how tensor shapes transform under common operations
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Tensor shapes
let inputShape = [2, 3, 4];
let outputShape = [6, 4];
let operation = 'reshape';

// Sample data for visualization
let tensorData = [];
let flatData = [];

// UI elements
let operationSelect;
let dim1Slider;
let dim2Slider;
let dim3Slider;
let applyButton;
let targetInput;

// Animation
let animationProgress = 1.0;
let isAnimating = false;

// Error state
let errorMessage = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  initializeTensor();

  // Row 1: Operation selector and Apply button
  operationSelect = createSelect();
  operationSelect.position(10, drawHeight + 8);
  operationSelect.option('Reshape');
  operationSelect.option('Transpose');
  operationSelect.option('Flatten');
  operationSelect.option('Squeeze');
  operationSelect.option('Unsqueeze');
  operationSelect.changed(updateOperation);

  applyButton = createButton('Apply');
  applyButton.position(130, drawHeight + 5);
  applyButton.mousePressed(applyOperation);

  // Row 2: Dimension sliders
  dim1Slider = createSlider(1, 6, inputShape[0], 1);
  dim1Slider.position(50, drawHeight + 45);
  dim1Slider.size(80);
  dim1Slider.input(updateInputShape);

  dim2Slider = createSlider(1, 6, inputShape[1], 1);
  dim2Slider.position(160, drawHeight + 45);
  dim2Slider.size(80);
  dim2Slider.input(updateInputShape);

  dim3Slider = createSlider(1, 6, inputShape[2], 1);
  dim3Slider.position(270, drawHeight + 45);
  dim3Slider.size(80);
  dim3Slider.input(updateInputShape);

  describe('Tensor operations visualizer showing how reshape, transpose, and other operations transform tensor shapes', LABEL);
}

function initializeTensor() {
  tensorData = [];
  flatData = [];
  let counter = 0;

  for (let i = 0; i < inputShape[0]; i++) {
    let plane = [];
    for (let j = 0; j < inputShape[1]; j++) {
      let row = [];
      for (let k = 0; k < inputShape[2]; k++) {
        row.push(counter);
        flatData.push(counter);
        counter++;
      }
      plane.push(row);
    }
    tensorData.push(plane);
  }
}

function updateInputShape() {
  inputShape = [dim1Slider.value(), dim2Slider.value(), dim3Slider.value()];
  initializeTensor();
  calculateOutputShape();
  animationProgress = 1.0;
  errorMessage = '';
}

function updateOperation() {
  operation = operationSelect.value().toLowerCase();
  calculateOutputShape();
  animationProgress = 1.0;
  errorMessage = '';
}

function calculateOutputShape() {
  let totalElements = inputShape.reduce((a, b) => a * b, 1);

  switch (operation) {
    case 'reshape':
      // Reshape to (dim0*dim1, dim2)
      outputShape = [inputShape[0] * inputShape[1], inputShape[2]];
      break;
    case 'transpose':
      // Swap last two dimensions
      outputShape = [inputShape[0], inputShape[2], inputShape[1]];
      break;
    case 'flatten':
      outputShape = [totalElements];
      break;
    case 'squeeze':
      // Remove dimensions of size 1
      outputShape = inputShape.filter(d => d > 1);
      if (outputShape.length === 0) outputShape = [1];
      break;
    case 'unsqueeze':
      // Add dimension at the beginning
      outputShape = [1, ...inputShape];
      break;
  }
}

function applyOperation() {
  calculateOutputShape();
  animationProgress = 0;
  isAnimating = true;
  errorMessage = '';
}

function draw() {
  updateCanvasSize();

  // Animation
  if (isAnimating && animationProgress < 1) {
    animationProgress += 0.03;
    if (animationProgress >= 1) {
      animationProgress = 1;
      isAnimating = false;
    }
  }

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Tensor Operations', canvasWidth / 2, 8);

  // Draw visualizations
  let leftX = 30;
  let rightX = canvasWidth - 30;
  let centerY = 180;

  // Input tensor
  drawTensorVisualization(inputShape, leftX, centerY, 'Input', 1);

  // Arrow
  drawArrow(canvasWidth / 2 - 40, centerY, canvasWidth / 2 + 40, centerY);

  // Operation label
  noStroke();
  fill(100, 50, 150);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(operation.toUpperCase(), canvasWidth / 2, centerY - 60);
  textStyle(NORMAL);

  // Output tensor
  drawTensorVisualization(outputShape, rightX - getVisualizationWidth(outputShape), centerY, 'Output', animationProgress);

  // Shape annotations
  drawShapeInfo();

  // Error message
  if (errorMessage) {
    fill(200, 50, 50);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(errorMessage, canvasWidth / 2, drawHeight - 30);
  }

  // Draw comparison table
  drawOperationTable();

  // Control labels
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('d₀: ' + inputShape[0], 85, drawHeight + 40);
  text('d₁: ' + inputShape[1], 195, drawHeight + 40);
  text('d₂: ' + inputShape[2], 305, drawHeight + 40);
}

function drawTensorVisualization(shape, x, y, label, progress) {
  let cellSize = min(20, 150 / max(...shape));
  let depth3d = 8;

  // Label
  noStroke();
  fill(80);
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text(label, x + getVisualizationWidth(shape) / 2, y - 70);

  // Shape
  fill(50, 100, 150);
  textSize(14);
  textStyle(BOLD);
  text('(' + shape.join(', ') + ')', x + getVisualizationWidth(shape) / 2, y - 55);
  textStyle(NORMAL);

  // Draw tensor based on dimensions
  let alpha = 150 + 100 * progress;

  if (shape.length === 1) {
    // 1D - single row
    for (let i = 0; i < min(shape[0], 12); i++) {
      fill(100 + i * 10, 150, 200, alpha);
      stroke(100);
      strokeWeight(1);
      rect(x + i * cellSize, y - cellSize / 2, cellSize - 2, cellSize - 2, 2);
    }
    if (shape[0] > 12) {
      noStroke();
      fill(100);
      text('...', x + 12 * cellSize + 10, y);
    }
  } else if (shape.length === 2) {
    // 2D - grid
    for (let i = 0; i < min(shape[0], 6); i++) {
      for (let j = 0; j < min(shape[1], 6); j++) {
        fill(100 + i * 20, 150 + j * 15, 200, alpha);
        stroke(100);
        strokeWeight(1);
        rect(x + j * cellSize, y - shape[0] * cellSize / 2 + i * cellSize, cellSize - 2, cellSize - 2, 2);
      }
    }
  } else if (shape.length >= 3) {
    // 3D - stacked grids
    let d0 = min(shape[0], 4);
    let d1 = min(shape[1], 5);
    let d2 = min(shape[2], 5);

    for (let i = d0 - 1; i >= 0; i--) {
      let offsetX = i * depth3d;
      let offsetY = -i * depth3d;

      for (let j = 0; j < d1; j++) {
        for (let k = 0; k < d2; k++) {
          let hue = (i * 40 + j * 20 + k * 10) % 200;
          fill(hue + 50, 150, 200, alpha);
          stroke(100);
          strokeWeight(1);
          rect(
            x + offsetX + k * cellSize,
            y + offsetY - d1 * cellSize / 2 + j * cellSize,
            cellSize - 2,
            cellSize - 2,
            2
          );
        }
      }
    }
  }
}

function getVisualizationWidth(shape) {
  let cellSize = min(20, 150 / max(...shape));
  if (shape.length === 1) {
    return min(shape[0], 12) * cellSize + 20;
  } else if (shape.length === 2) {
    return min(shape[1], 6) * cellSize + 20;
  } else {
    let d0 = min(shape[0], 4);
    let d2 = min(shape[2], 5);
    return d2 * cellSize + d0 * 8 + 20;
  }
}

function drawArrow(x1, y1, x2, y2) {
  stroke(100, 50, 150);
  strokeWeight(3);
  line(x1, y1, x2 - 10, y2);

  // Arrow head
  fill(100, 50, 150);
  noStroke();
  push();
  translate(x2, y2);
  triangle(0, 0, -12, -6, -12, 6);
  pop();
}

function drawShapeInfo() {
  let boxY = 280;
  let boxH = 80;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(10, boxY, canvasWidth - 20, boxH, 8);

  noStroke();
  fill(50);
  textAlign(LEFT, TOP);
  textSize(11);

  let y = boxY + 10;
  let col1 = 20;
  let col2 = canvasWidth / 2 + 10;

  // Input info
  let inputTotal = inputShape.reduce((a, b) => a * b, 1);
  text('Input: (' + inputShape.join(' × ') + ') = ' + inputTotal + ' elements', col1, y);

  // Output info
  let outputTotal = outputShape.reduce((a, b) => a * b, 1);
  text('Output: (' + outputShape.join(' × ') + ') = ' + outputTotal + ' elements', col1, y + 18);

  // Operation description
  fill(100, 50, 150);
  y += 40;
  textSize(10);

  switch (operation) {
    case 'reshape':
      text('Reshape: Changes shape while preserving element order and count', col1, y);
      break;
    case 'transpose':
      text('Transpose: Swaps the last two dimensions (permutes axes)', col1, y);
      break;
    case 'flatten':
      text('Flatten: Collapses all dimensions into a single 1D array', col1, y);
      break;
    case 'squeeze':
      text('Squeeze: Removes all dimensions of size 1', col1, y);
      break;
    case 'unsqueeze':
      text('Unsqueeze: Adds a dimension of size 1 at position 0', col1, y);
      break;
  }
}

function drawOperationTable() {
  // Small reference table
  let tableX = canvasWidth - 180;
  let tableY = 40;

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(9);

  let ops = [
    ['reshape', '(a,b,c) → (ab,c)'],
    ['transpose', '(a,b,c) → (a,c,b)'],
    ['flatten', '(a,b,c) → (abc,)'],
    ['squeeze', 'removes dim=1'],
    ['unsqueeze', 'adds dim=1']
  ];

  for (let i = 0; i < ops.length; i++) {
    fill(operation === ops[i][0] ? color(100, 50, 150) : 120);
    text(ops[i][0] + ': ' + ops[i][1], tableX, tableY + i * 14);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
