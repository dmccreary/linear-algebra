// Batch vs Layer Normalization Comparison
// Visualizes which dimensions each normalization operates over
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Tensor dimensions for visualization
let batchSize = 3;
let channels = 4;
let height = 3;

// Sample data
let tensorData = [];

// UI elements
let normTypeSelect;
let animateCheckbox;

// Animation
let highlightPhase = 0;
let isAnimating = true;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // Initialize random tensor data
  initializeTensor();

  // Controls
  normTypeSelect = createSelect();
  normTypeSelect.position(10, drawHeight + 12);
  normTypeSelect.option('Batch Normalization');
  normTypeSelect.option('Layer Normalization');
  normTypeSelect.option('Compare Both');
  normTypeSelect.selected('Compare Both');

  animateCheckbox = createCheckbox('Animate', true);
  animateCheckbox.position(200, drawHeight + 12);
  animateCheckbox.changed(() => { isAnimating = animateCheckbox.checked(); });

  describe('Comparison of batch normalization and layer normalization showing which dimensions are normalized', LABEL);
}

function initializeTensor() {
  tensorData = [];
  for (let b = 0; b < batchSize; b++) {
    let batch = [];
    for (let c = 0; c < channels; c++) {
      let channel = [];
      for (let h = 0; h < height; h++) {
        // Generate data with different means per channel and batch
        let baseMean = c * 10 + b * 5;
        channel.push(baseMean + random(-5, 5));
      }
      batch.push(channel);
    }
    tensorData.push(batch);
  }
}

function draw() {
  updateCanvasSize();

  if (isAnimating) {
    highlightPhase += 0.03;
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
  text('Batch vs Layer Normalization', canvasWidth / 2, 8);

  let selected = normTypeSelect.value();

  if (selected === 'Compare Both') {
    drawComparison();
  } else if (selected === 'Batch Normalization') {
    drawSingleNorm('batch');
  } else {
    drawSingleNorm('layer');
  }
}

function drawComparison() {
  let halfWidth = canvasWidth / 2 - 20;

  // Batch Normalization (left side)
  push();
  translate(10, 40);
  drawNormVisualization('batch', halfWidth - 10);
  pop();

  // Layer Normalization (right side)
  push();
  translate(canvasWidth / 2 + 10, 40);
  drawNormVisualization('layer', halfWidth - 10);
  pop();

  // Divider
  stroke(200);
  strokeWeight(2);
  line(canvasWidth / 2, 40, canvasWidth / 2, drawHeight - 60);

  // Comparison table
  drawComparisonTable();
}

function drawSingleNorm(type) {
  push();
  translate(canvasWidth / 4, 40);
  drawNormVisualization(type, canvasWidth / 2);
  pop();

  // Details panel
  drawDetailsPanel(type);
}

function drawNormVisualization(type, width) {
  let cellW = min(25, width / (channels + 2));
  let cellH = 20;
  let depthOffset = 8;

  // Title
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text(type === 'batch' ? 'Batch Normalization' : 'Layer Normalization', width / 2, 0);
  textStyle(NORMAL);

  // Draw 3D tensor representation
  let startX = 20;
  let startY = 30;

  // Calculate highlight based on animation phase
  let highlightChannel = type === 'batch' ? Math.floor((sin(highlightPhase) + 1) * channels / 2) % channels : -1;
  let highlightBatch = type === 'layer' ? Math.floor((sin(highlightPhase) + 1) * batchSize / 2) % batchSize : -1;

  // Draw tensor slices (back to front)
  for (let b = batchSize - 1; b >= 0; b--) {
    let offsetX = b * depthOffset;
    let offsetY = b * depthOffset;

    for (let c = 0; c < channels; c++) {
      for (let h = 0; h < height; h++) {
        let x = startX + offsetX + c * cellW;
        let y = startY + offsetY + h * cellH;

        // Determine highlight
        let isHighlighted = false;
        if (type === 'batch' && c === highlightChannel) {
          isHighlighted = true;
        } else if (type === 'layer' && b === highlightBatch) {
          isHighlighted = true;
        }

        // Cell color
        let val = tensorData[b][c][h];
        let normalizedVal = map(val, -20, 50, 50, 255);

        if (isHighlighted) {
          fill(255, 200, 100, 200 + 50 * sin(highlightPhase * 3));
          stroke(255, 150, 0);
          strokeWeight(2);
        } else {
          fill(normalizedVal, normalizedVal * 0.8, 200);
          stroke(100);
          strokeWeight(1);
        }

        // Draw cell
        rect(x, y, cellW - 2, cellH - 2, 2);

        // Value
        if (cellW >= 20) {
          noStroke();
          fill(0);
          textSize(8);
          textAlign(CENTER, CENTER);
          text(round(val), x + cellW / 2 - 1, y + cellH / 2 - 1);
        }
      }
    }
  }

  // Axis labels
  noStroke();
  fill(80);
  textSize(10);
  textAlign(CENTER, TOP);

  // Channel axis
  text('Channels (C=' + channels + ')', startX + channels * cellW / 2, startY + height * cellH + depthOffset * batchSize + 5);

  // Batch axis
  push();
  translate(startX - 5, startY + height * cellH / 2);
  rotate(-PI / 4);
  textAlign(RIGHT, CENTER);
  text('Batch (B=' + batchSize + ')', 0, 0);
  pop();

  // Normalization scope indicator
  let indicatorY = startY + height * cellH + depthOffset * batchSize + 25;

  fill(type === 'batch' ? color(255, 150, 0) : color(100, 150, 255));
  textAlign(CENTER, TOP);
  textSize(10);

  if (type === 'batch') {
    text('Normalize across batch', width / 2, indicatorY);
    text('(per channel)', width / 2, indicatorY + 12);
  } else {
    text('Normalize across features', width / 2, indicatorY);
    text('(per sample)', width / 2, indicatorY + 12);
  }

  // Draw formula
  let formulaY = indicatorY + 35;
  textSize(9);
  fill(50);

  if (type === 'batch') {
    text('μ = (1/B)Σᵦ xᵦ', width / 2, formulaY);
    text('Computed per channel', width / 2, formulaY + 12);
  } else {
    text('μ = (1/D)Σᵈ xᵈ', width / 2, formulaY);
    text('Computed per sample', width / 2, formulaY + 12);
  }
}

function drawComparisonTable() {
  let tableY = drawHeight - 55;
  let col1 = 30;
  let col2 = canvasWidth / 2 - 60;
  let col3 = canvasWidth / 2 + 60;

  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);

  // Headers
  fill(80);
  textStyle(BOLD);
  text('Property', col1, tableY);
  text('Batch Norm', col2, tableY);
  text('Layer Norm', col3, tableY);
  textStyle(NORMAL);

  // Row 1
  tableY += 15;
  fill(100);
  text('Norm. dim:', col1, tableY);
  fill(50);
  text('Across batch', col2, tableY);
  text('Across features', col3, tableY);

  // Row 2
  tableY += 13;
  fill(100);
  text('Best for:', col1, tableY);
  fill(50);
  text('CNNs', col2, tableY);
  text('Transformers, RNNs', col3, tableY);
}

function drawDetailsPanel(type) {
  let panelX = canvasWidth * 0.6;
  let panelY = 100;
  let panelW = canvasWidth * 0.35;
  let panelH = 200;

  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  noStroke();
  fill(50);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Properties', panelX + 10, panelY + 10);
  textStyle(NORMAL);

  textSize(10);
  let y = panelY + 35;
  let lineH = 18;

  if (type === 'batch') {
    text('• Normalizes per channel', panelX + 10, y); y += lineH;
    text('• Uses batch statistics', panelX + 10, y); y += lineH;
    text('• Different in train/test', panelX + 10, y); y += lineH;
    text('• Learnable γ, β', panelX + 10, y); y += lineH;
    text('• Best for large batches', panelX + 10, y); y += lineH * 1.5;

    fill(100);
    text('Formula:', panelX + 10, y); y += lineH;
    fill(50);
    textSize(9);
    text('x̂ = (x - μᴮ) / √(σ²ᴮ + ε)', panelX + 10, y); y += 14;
    text('y = γx̂ + β', panelX + 10, y);
  } else {
    text('• Normalizes per sample', panelX + 10, y); y += lineH;
    text('• Independent of batch', panelX + 10, y); y += lineH;
    text('• Same in train/test', panelX + 10, y); y += lineH;
    text('• Learnable γ, β', panelX + 10, y); y += lineH;
    text('• Works with batch=1', panelX + 10, y); y += lineH * 1.5;

    fill(100);
    text('Formula:', panelX + 10, y); y += lineH;
    fill(50);
    textSize(9);
    text('x̂ = (x - μᴸ) / √(σ²ᴸ + ε)', panelX + 10, y); y += 14;
    text('y = γx̂ + β', panelX + 10, y);
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
