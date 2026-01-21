// Multi-Head Attention Visualizer
// Shows how multiple attention heads capture different patterns
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Tokens
let tokens = ['The', 'cat', 'sat', 'down'];
let seqLen = 4;

// Number of heads
let numHeads = 4;
let maxHeads = 8;

// Pre-computed attention patterns for different heads (simulated)
// Each head learns different patterns
let headPatterns = [];
let headDescriptions = [
  'Position proximity',
  'Semantic similarity',
  'Syntactic structure',
  'Long-range deps',
  'Subject-verb',
  'Modifier-noun',
  'Sequential',
  'Global context'
];

let headColors = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
];

// UI elements
let numHeadsSlider;
let selectedHead = -1;  // -1 means show all
let showConcatCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  generateHeadPatterns();

  // Number of heads slider
  numHeadsSlider = createSlider(1, maxHeads, 4, 1);
  numHeadsSlider.position(sliderLeftMargin, drawHeight + 8);
  numHeadsSlider.size(canvasWidth - sliderLeftMargin - margin);
  numHeadsSlider.input(() => numHeads = numHeadsSlider.value());

  // Show concatenation checkbox
  showConcatCheckbox = createCheckbox(' Show Concatenation', false);
  showConcatCheckbox.position(10, drawHeight + 38);
  showConcatCheckbox.style('font-size', '14px');

  describe('Multi-head attention visualization showing how different heads capture different patterns', LABEL);
}

function generateHeadPatterns() {
  headPatterns = [];

  // Head 0: Position proximity (diagonal-ish)
  headPatterns.push([
    [0.7, 0.2, 0.07, 0.03],
    [0.2, 0.6, 0.15, 0.05],
    [0.05, 0.2, 0.55, 0.2],
    [0.03, 0.07, 0.3, 0.6]
  ]);

  // Head 1: Semantic (cat-sat relationship)
  headPatterns.push([
    [0.4, 0.3, 0.2, 0.1],
    [0.1, 0.3, 0.5, 0.1],
    [0.1, 0.4, 0.3, 0.2],
    [0.2, 0.2, 0.3, 0.3]
  ]);

  // Head 2: Syntactic (subject-verb)
  headPatterns.push([
    [0.5, 0.4, 0.05, 0.05],
    [0.3, 0.2, 0.4, 0.1],
    [0.1, 0.5, 0.2, 0.2],
    [0.2, 0.1, 0.4, 0.3]
  ]);

  // Head 3: Long-range dependencies
  headPatterns.push([
    [0.3, 0.1, 0.2, 0.4],
    [0.4, 0.2, 0.1, 0.3],
    [0.2, 0.3, 0.2, 0.3],
    [0.35, 0.25, 0.2, 0.2]
  ]);

  // Head 4-7: More patterns
  headPatterns.push([
    [0.4, 0.4, 0.1, 0.1],
    [0.5, 0.3, 0.15, 0.05],
    [0.2, 0.4, 0.3, 0.1],
    [0.1, 0.3, 0.4, 0.2]
  ]);

  headPatterns.push([
    [0.25, 0.25, 0.25, 0.25],
    [0.3, 0.3, 0.2, 0.2],
    [0.2, 0.3, 0.3, 0.2],
    [0.25, 0.25, 0.25, 0.25]
  ]);

  headPatterns.push([
    [0.6, 0.25, 0.1, 0.05],
    [0.1, 0.6, 0.2, 0.1],
    [0.1, 0.1, 0.6, 0.2],
    [0.05, 0.1, 0.25, 0.6]
  ]);

  headPatterns.push([
    [0.2, 0.3, 0.3, 0.2],
    [0.3, 0.2, 0.2, 0.3],
    [0.25, 0.25, 0.25, 0.25],
    [0.2, 0.2, 0.3, 0.3]
  ]);
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
  text('Multi-Head Attention (' + numHeads + ' heads)', canvasWidth / 2, 8);

  numHeads = numHeadsSlider.value();

  if (showConcatCheckbox.checked()) {
    drawConcatenationView();
  } else {
    drawHeadsGrid();
  }

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Heads: ' + numHeads, 10, drawHeight + 18);
}

function drawHeadsGrid() {
  let startY = 40;
  let availableWidth = canvasWidth - 40;
  let availableHeight = drawHeight - startY - 60;

  // Calculate grid layout
  let cols = Math.min(numHeads, 4);
  let rows = Math.ceil(numHeads / cols);

  let cellWidth = availableWidth / cols;
  let cellHeight = availableHeight / rows;
  let matrixSize = Math.min(cellWidth - 30, cellHeight - 40, 90);

  for (let h = 0; h < numHeads; h++) {
    let col = h % cols;
    let row = Math.floor(h / cols);

    let centerX = 20 + col * cellWidth + cellWidth / 2;
    let centerY = startY + row * cellHeight + cellHeight / 2;

    let isHovered = mouseX > centerX - matrixSize / 2 - 10 &&
                    mouseX < centerX + matrixSize / 2 + 10 &&
                    mouseY > centerY - matrixSize / 2 - 15 &&
                    mouseY < centerY + matrixSize / 2 + 15 &&
                    mouseY < drawHeight;

    // Draw attention heatmap
    drawAttentionMatrix(headPatterns[h], centerX - matrixSize / 2,
                        centerY - matrixSize / 2 + 10, matrixSize, headColors[h], isHovered);

    // Head label
    fill(headColors[h]);
    noStroke();
    textSize(11);
    textAlign(CENTER, BOTTOM);
    text('Head ' + (h + 1), centerX, centerY - matrixSize / 2 + 5);

    // Description on hover
    if (isHovered) {
      fill(255, 255, 255, 230);
      stroke(headColors[h]);
      strokeWeight(2);
      rect(mouseX + 10, mouseY - 30, 120, 25, 5);

      fill(0);
      noStroke();
      textSize(10);
      textAlign(LEFT, CENTER);
      text(headDescriptions[h], mouseX + 15, mouseY - 17);
    }
  }

  // Legend at bottom
  fill(60);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Each head learns to attend to different relationships', canvasWidth / 2, drawHeight - 30);
  textSize(10);
  text('Hover over a head to see its learned pattern type', canvasWidth / 2, drawHeight - 15);
}

function drawConcatenationView() {
  let startY = 50;

  // Show heads being concatenated
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Concatenation of Head Outputs', canvasWidth / 2, startY);

  let headOutputWidth = 30;
  let headOutputHeight = 60;
  let spacing = 5;
  let totalWidth = numHeads * (headOutputWidth + spacing);
  let startX = (canvasWidth - totalWidth) / 2;

  // Draw individual head outputs
  for (let h = 0; h < numHeads; h++) {
    fill(headColors[h]);
    stroke(0);
    strokeWeight(1);
    rect(startX + h * (headOutputWidth + spacing), startY + 25,
         headOutputWidth, headOutputHeight, 3);

    fill(255);
    noStroke();
    textSize(9);
    textAlign(CENTER, CENTER);
    text('H' + (h + 1), startX + h * (headOutputWidth + spacing) + headOutputWidth / 2,
         startY + 25 + headOutputHeight / 2);
  }

  // Arrow to concatenated
  let arrowY = startY + 95;
  stroke(100);
  strokeWeight(2);
  line(canvasWidth / 2, arrowY, canvasWidth / 2, arrowY + 20);
  fill(100);
  noStroke();
  triangle(canvasWidth / 2, arrowY + 25, canvasWidth / 2 - 6, arrowY + 15, canvasWidth / 2 + 6, arrowY + 15);

  // Concatenated output
  let concatY = arrowY + 35;
  let concatWidth = totalWidth + 10;

  // Gradient fill for concatenated
  for (let h = 0; h < numHeads; h++) {
    fill(headColors[h]);
    noStroke();
    let segWidth = concatWidth / numHeads;
    rect(startX - 5 + h * segWidth, concatY, segWidth, 30);
  }
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(startX - 5, concatY, concatWidth, 30, 3);

  fill(0);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Concat (n × h·d_v)', canvasWidth / 2, concatY + 35);

  // Output projection
  arrowY = concatY + 55;
  stroke(100);
  strokeWeight(2);
  line(canvasWidth / 2, arrowY, canvasWidth / 2, arrowY + 20);
  fill(100);
  noStroke();
  triangle(canvasWidth / 2, arrowY + 25, canvasWidth / 2 - 6, arrowY + 15, canvasWidth / 2 + 6, arrowY + 15);

  // W_O multiplication
  fill(200, 200, 255);
  stroke(0);
  strokeWeight(1);
  rect(canvasWidth / 2 - 30, arrowY + 30, 60, 25, 3);
  fill(0);
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text('× W_O', canvasWidth / 2, arrowY + 42);

  // Final output
  let finalY = arrowY + 65;
  fill(150, 200, 255);
  stroke(0);
  strokeWeight(1);
  rect(canvasWidth / 2 - 50, finalY, 100, 30, 3);
  fill(0);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Output (n × d_model)', canvasWidth / 2, finalY + 15);

  // Dimension labels
  fill(80);
  textSize(10);
  textAlign(LEFT, TOP);
  text('d_k = d_model / h', 20, startY + 130);
  text('d_v = d_model / h', 20, startY + 145);

  // Formula
  textAlign(CENTER, TOP);
  text('MultiHead(Q,K,V) = Concat(head₁,...,head_h)W_O', canvasWidth / 2, drawHeight - 45);
  textSize(9);
  text('where head_i = Attention(QW_Q^i, KW_K^i, VW_V^i)', canvasWidth / 2, drawHeight - 30);
}

function drawAttentionMatrix(pattern, x, y, size, baseColor, highlight) {
  let cellSize = size / seqLen;

  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      let val = pattern[i][j];

      // Color based on attention weight
      let c = color(baseColor);
      let intensity = map(val, 0, 1, 240, 50);
      fill(red(c), green(c), blue(c), 255 - intensity + 50);

      if (highlight) {
        stroke(0);
        strokeWeight(1);
      } else {
        stroke(200);
        strokeWeight(0.5);
      }
      rect(x + j * cellSize, y + i * cellSize, cellSize - 1, cellSize - 1);
    }
  }

  // Border
  noFill();
  stroke(highlight ? baseColor : 150);
  strokeWeight(highlight ? 2 : 1);
  rect(x - 1, y - 1, size + 1, size + 1);
}

function mousePressed() {
  // Check if clicking on a head
  // Could add selection behavior here
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  numHeadsSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
