// Transformer Block Visualizer
// Shows data flow through attention, FFN, residuals, and layer norms
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Configuration
let numBlocks = 2;
let maxBlocks = 6;
let showDimensions = true;
let highlightResiduals = false;

// Animation
let currentStep = 0;
let maxSteps = 7;
let stepNames = [
  'Input',
  'Layer Norm 1',
  'Multi-Head Attention',
  'Residual Add 1',
  'Layer Norm 2',
  'Feed Forward',
  'Residual Add 2'
];

// UI elements
let numBlocksSlider;
let stepSlider;
let showDimsCheckbox;
let highlightResCheckbox;

// Colors
let inputColor = '#3498db';
let attnColor = '#e74c3c';
let ffnColor = '#2ecc71';
let normColor = '#f39c12';
let residualColor = '#9b59b6';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Number of blocks slider
  numBlocksSlider = createSlider(1, maxBlocks, 2, 1);
  numBlocksSlider.position(sliderLeftMargin, drawHeight + 8);
  numBlocksSlider.size(canvasWidth - sliderLeftMargin - margin);
  numBlocksSlider.input(() => numBlocks = numBlocksSlider.value());

  // Show dimensions checkbox
  showDimsCheckbox = createCheckbox(' Show Dimensions', true);
  showDimsCheckbox.position(10, drawHeight + 35);
  showDimsCheckbox.style('font-size', '14px');
  showDimsCheckbox.changed(() => showDimensions = showDimsCheckbox.checked());

  // Highlight residuals checkbox
  highlightResCheckbox = createCheckbox(' Highlight Residuals', false);
  highlightResCheckbox.position(150, drawHeight + 35);
  highlightResCheckbox.style('font-size', '14px');
  highlightResCheckbox.changed(() => highlightResiduals = highlightResCheckbox.checked());

  describe('Transformer block architecture visualization showing attention, feedforward, and residual connections', LABEL);
}

function draw() {
  updateCanvasSize();

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
  text('Transformer Architecture (' + numBlocks + ' blocks)', canvasWidth / 2, 8);

  numBlocks = numBlocksSlider.value();

  drawTransformerArchitecture();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Blocks: ' + numBlocks, 10, drawHeight + 18);
}

function drawTransformerArchitecture() {
  let startY = 40;
  let availableHeight = drawHeight - startY - 30;
  let blockHeight = Math.min(180, (availableHeight - 60) / numBlocks);
  let boxWidth = 120;
  let centerX = canvasWidth / 2;

  // Input
  let currentY = startY;

  fill(inputColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - boxWidth / 2, currentY, boxWidth, 25, 5);
  fill(255);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Input (n × d)', centerX, currentY + 12);

  currentY += 30;

  // Position Encoding
  fill(inputColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - boxWidth / 2, currentY, boxWidth, 20, 5);
  fill(255);
  noStroke();
  textSize(10);
  text('+ Position Encoding', centerX, currentY + 10);

  currentY += 25;

  // Draw arrow
  drawArrowDown(centerX, currentY, 15);
  currentY += 20;

  // Transformer blocks
  for (let b = 0; b < numBlocks; b++) {
    drawTransformerBlock(centerX, currentY, boxWidth, blockHeight, b);
    currentY += blockHeight + 10;
  }

  // Output
  fill(inputColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - boxWidth / 2, currentY, boxWidth, 25, 5);
  fill(255);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Output (n × d)', centerX, currentY + 12);

  // Legend
  drawLegend();
}

function drawTransformerBlock(centerX, startY, boxWidth, blockHeight, blockNum) {
  let smallBoxHeight = 22;
  let gap = 5;
  let innerWidth = boxWidth - 20;

  // Block container
  fill(255, 255, 255, 200);
  stroke(150);
  strokeWeight(1);
  rect(centerX - boxWidth / 2 - 15, startY - 5, boxWidth + 30, blockHeight, 8);

  // Block label
  fill(100);
  noStroke();
  textSize(9);
  textAlign(LEFT, TOP);
  text('Block ' + (blockNum + 1), centerX - boxWidth / 2 - 10, startY);

  let y = startY + 15;
  let inputY = y;

  // Layer Norm 1
  fill(normColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - innerWidth / 2, y, innerWidth, smallBoxHeight, 3);
  fill(255);
  noStroke();
  textSize(9);
  textAlign(CENTER, CENTER);
  text('Layer Norm', centerX, y + smallBoxHeight / 2);
  y += smallBoxHeight + gap;

  // Multi-Head Attention
  fill(attnColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - innerWidth / 2, y, innerWidth, smallBoxHeight + 5, 3);
  fill(255);
  noStroke();
  textSize(9);
  text('Multi-Head Attention', centerX, y + (smallBoxHeight + 5) / 2);

  // First residual connection
  let residualX = centerX + innerWidth / 2 + 8;
  if (highlightResiduals) {
    stroke(residualColor);
    strokeWeight(3);
  } else {
    stroke(150);
    strokeWeight(1);
  }
  noFill();

  // Draw residual path
  line(residualX, inputY + smallBoxHeight / 2, residualX, y + smallBoxHeight + gap + smallBoxHeight / 2);

  // Arrows for residual
  let addY1 = y + smallBoxHeight + gap + 3;
  line(residualX, addY1 + 7, residualX - 5, addY1 + 7);

  y += smallBoxHeight + gap + 5;

  // Add symbol 1
  fill(255);
  stroke(residualColor);
  strokeWeight(2);
  ellipse(centerX + innerWidth / 4, y + 7, 18, 18);
  fill(residualColor);
  noStroke();
  textSize(14);
  text('+', centerX + innerWidth / 4, y + 8);
  y += 20;

  // Layer Norm 2
  let inputY2 = y;
  fill(normColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - innerWidth / 2, y, innerWidth, smallBoxHeight, 3);
  fill(255);
  noStroke();
  textSize(9);
  textAlign(CENTER, CENTER);
  text('Layer Norm', centerX, y + smallBoxHeight / 2);
  y += smallBoxHeight + gap;

  // Feed Forward
  fill(ffnColor);
  stroke(0);
  strokeWeight(1);
  rect(centerX - innerWidth / 2, y, innerWidth, smallBoxHeight + 5, 3);
  fill(255);
  noStroke();
  textSize(9);
  text('Feed Forward', centerX, y + (smallBoxHeight + 5) / 2);

  // Second residual connection
  if (highlightResiduals) {
    stroke(residualColor);
    strokeWeight(3);
  } else {
    stroke(150);
    strokeWeight(1);
  }
  noFill();

  line(residualX, inputY2 + smallBoxHeight / 2, residualX, y + smallBoxHeight + gap + 7);
  let addY2 = y + smallBoxHeight + gap + 3;
  line(residualX, addY2 + 7, residualX - 5, addY2 + 7);

  y += smallBoxHeight + gap + 5;

  // Add symbol 2
  fill(255);
  stroke(residualColor);
  strokeWeight(2);
  ellipse(centerX + innerWidth / 4, y + 7, 18, 18);
  fill(residualColor);
  noStroke();
  textSize(14);
  text('+', centerX + innerWidth / 4, y + 8);

  // Dimension annotations
  if (showDimensions) {
    fill(100);
    textSize(8);
    textAlign(LEFT, CENTER);
    text('n×d', centerX - boxWidth / 2 - 30, inputY + smallBoxHeight / 2);
    text('n×d', centerX - boxWidth / 2 - 30, y + 7);
  }
}

function drawArrowDown(x, y, length) {
  stroke(100);
  strokeWeight(2);
  line(x, y, x, y + length);
  fill(100);
  noStroke();
  triangle(x, y + length + 5, x - 5, y + length - 2, x + 5, y + length - 2);
}

function drawLegend() {
  let legendX = 15;
  let legendY = drawHeight - 90;
  let boxSize = 12;
  let spacing = 18;

  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text('Components:', legendX, legendY);

  legendY += 15;

  // Input/Output
  fill(inputColor);
  rect(legendX, legendY, boxSize, boxSize, 2);
  fill(0);
  text('Input/Output', legendX + boxSize + 5, legendY + boxSize / 2);

  // Attention
  fill(attnColor);
  rect(legendX + 90, legendY, boxSize, boxSize, 2);
  fill(0);
  text('Attention', legendX + 90 + boxSize + 5, legendY + boxSize / 2);

  legendY += spacing;

  // Layer Norm
  fill(normColor);
  rect(legendX, legendY, boxSize, boxSize, 2);
  fill(0);
  text('Layer Norm', legendX + boxSize + 5, legendY + boxSize / 2);

  // FFN
  fill(ffnColor);
  rect(legendX + 90, legendY, boxSize, boxSize, 2);
  fill(0);
  text('Feed Forward', legendX + 90 + boxSize + 5, legendY + boxSize / 2);

  legendY += spacing;

  // Residual
  stroke(residualColor);
  strokeWeight(2);
  line(legendX, legendY + boxSize / 2, legendX + boxSize, legendY + boxSize / 2);
  fill(0);
  noStroke();
  text('Residual', legendX + boxSize + 5, legendY + boxSize / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  numBlocksSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
