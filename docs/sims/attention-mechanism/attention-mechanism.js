// Attention Mechanism Step-by-Step Visualizer
// Shows how attention computes weighted combinations through QKV projections
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Sequence tokens
let tokens = ['The', 'cat', 'sat', 'down'];
let seqLen = 4;
let dModel = 4;  // Embedding dimension (small for visualization)
let dK = 2;      // Query/Key dimension

// Matrices
let embeddings;
let W_Q, W_K, W_V;
let Q, K, V;
let scores, attention, output;

// Animation/step state
let currentStep = 0;
let maxSteps = 5;
let stepNames = ['Input', 'Project Q,K,V', 'Compute Scores', 'Softmax', 'Weighted Sum'];

// UI elements
let stepSlider;
let queryPosSlider;
let queryPos = 0;  // Which position's attention to visualize

// Colors
let tokenColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  initializeMatrices();

  // Step slider
  stepSlider = createSlider(0, maxSteps - 1, 0, 1);
  stepSlider.position(sliderLeftMargin, drawHeight + 8);
  stepSlider.size(canvasWidth - sliderLeftMargin - margin);
  stepSlider.input(() => currentStep = stepSlider.value());

  // Query position slider
  queryPosSlider = createSlider(0, seqLen - 1, 0, 1);
  queryPosSlider.position(sliderLeftMargin, drawHeight + 38);
  queryPosSlider.size(canvasWidth - sliderLeftMargin - margin);
  queryPosSlider.input(() => {
    queryPos = queryPosSlider.value();
  });

  describe('Step-by-step visualization of transformer attention mechanism showing QKV projections', LABEL);
}

function initializeMatrices() {
  // Initialize with fixed values for reproducibility
  embeddings = [
    [0.8, 0.2, 0.5, 0.1],
    [0.3, 0.9, 0.1, 0.6],
    [0.1, 0.4, 0.8, 0.3],
    [0.6, 0.1, 0.3, 0.7]
  ];

  // Projection matrices (simplified)
  W_Q = [[0.5, 0.3], [0.2, 0.6], [0.4, 0.1], [0.3, 0.5]];
  W_K = [[0.4, 0.2], [0.3, 0.5], [0.1, 0.4], [0.5, 0.3]];
  W_V = [[0.6, 0.2], [0.1, 0.5], [0.3, 0.4], [0.2, 0.6]];

  // Compute projections
  Q = matMul(embeddings, W_Q);
  K = matMul(embeddings, W_K);
  V = matMul(embeddings, W_V);

  // Compute attention scores (QK^T / sqrt(d_k))
  let KT = transpose(K);
  let rawScores = matMul(Q, KT);
  let scale = Math.sqrt(dK);
  scores = rawScores.map(row => row.map(val => val / scale));

  // Softmax
  attention = scores.map(row => softmax(row));

  // Output (attention @ V)
  output = matMul(attention, V);
}

function matMul(A, B) {
  let result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < B.length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function transpose(M) {
  let result = [];
  for (let j = 0; j < M[0].length; j++) {
    result[j] = [];
    for (let i = 0; i < M.length; i++) {
      result[j][i] = M[i][j];
    }
  }
  return result;
}

function softmax(arr) {
  let max = Math.max(...arr);
  let exps = arr.map(x => Math.exp(x - max));
  let sum = exps.reduce((a, b) => a + b);
  return exps.map(x => x / sum);
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
  text('Attention Mechanism: ' + stepNames[currentStep], canvasWidth / 2, 8);

  currentStep = stepSlider.value();
  queryPos = queryPosSlider.value();

  // Draw based on current step
  switch (currentStep) {
    case 0:
      drawInputStep();
      break;
    case 1:
      drawProjectionStep();
      break;
    case 2:
      drawScoresStep();
      break;
    case 3:
      drawSoftmaxStep();
      break;
    case 4:
      drawOutputStep();
      break;
  }

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Step: ' + (currentStep + 1) + '/' + maxSteps, 10, drawHeight + 18);
  text('Query Pos: ' + tokens[queryPos], 10, drawHeight + 48);
}

function drawInputStep() {
  // Show tokens and embeddings
  let startY = 50;

  // Tokens
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Input Sequence', canvasWidth / 2, startY);

  let boxWidth = 60;
  let boxHeight = 30;
  let startX = (canvasWidth - tokens.length * boxWidth) / 2;

  for (let i = 0; i < tokens.length; i++) {
    fill(tokenColors[i]);
    stroke(0);
    strokeWeight(1);
    rect(startX + i * boxWidth, startY + 20, boxWidth - 5, boxHeight, 5);

    fill(255);
    noStroke();
    textSize(14);
    text(tokens[i], startX + i * boxWidth + (boxWidth - 5) / 2, startY + 20 + boxHeight / 2);
  }

  // Embeddings matrix
  let matrixY = startY + 80;
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Embedding Matrix X (' + seqLen + '×' + dModel + ')', canvasWidth / 2, matrixY);

  drawMatrix(embeddings, (canvasWidth - 180) / 2, matrixY + 20, 180, 120);

  // Explanation
  fill(60);
  textSize(12);
  textAlign(CENTER, TOP);
  text('Each token is represented as a ' + dModel + '-dimensional vector', canvasWidth / 2, matrixY + 160);
}

function drawProjectionStep() {
  let startY = 45;
  let matrixWidth = 100;
  let matrixHeight = 80;

  // Title for each projection
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(13);

  let qX = canvasWidth / 6 - 10;
  let kX = canvasWidth / 2;
  let vX = 5 * canvasWidth / 6 + 10;

  text('Queries (Q)', qX, startY);
  text('Keys (K)', kX, startY);
  text('Values (V)', vX, startY);

  // Draw Q, K, V matrices
  drawMatrix(Q, qX - matrixWidth / 2, startY + 20, matrixWidth, matrixHeight, tokenColors);
  drawMatrix(K, kX - matrixWidth / 2, startY + 20, matrixWidth, matrixHeight, tokenColors);
  drawMatrix(V, vX - matrixWidth / 2, startY + 20, matrixWidth, matrixHeight, tokenColors);

  // Formulas
  textSize(11);
  fill(60);
  text('Q = XW_Q', qX, startY + matrixHeight + 30);
  text('K = XW_K', kX, startY + matrixHeight + 30);
  text('V = XW_V', vX, startY + matrixHeight + 30);

  // Highlight query position row
  let rowHeight = matrixHeight / seqLen;
  noFill();
  stroke(255, 200, 0);
  strokeWeight(3);
  rect(qX - matrixWidth / 2 - 2, startY + 20 + queryPos * rowHeight - 2,
       matrixWidth + 4, rowHeight + 4, 3);

  // Explanation
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Linear projections create Query, Key, Value vectors', canvasWidth / 2, startY + matrixHeight + 50);
  text('Highlighted: Query for position "' + tokens[queryPos] + '"', canvasWidth / 2, startY + matrixHeight + 68);

  // Show dimensions
  textSize(10);
  fill(100);
  text('(' + seqLen + '×' + dK + ')', qX, startY + matrixHeight + 10);
  text('(' + seqLen + '×' + dK + ')', kX, startY + matrixHeight + 10);
  text('(' + seqLen + '×' + dK + ')', vX, startY + matrixHeight + 10);
}

function drawScoresStep() {
  let startY = 50;

  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Attention Scores (QKᵀ/√d_k)', canvasWidth / 2, startY);

  // Draw score matrix as heatmap
  let matrixSize = 160;
  let cellSize = matrixSize / seqLen;
  let startX = (canvasWidth - matrixSize) / 2;
  let matrixStartY = startY + 50;

  // Row/column labels
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i < seqLen; i++) {
    fill(tokenColors[i]);
    text(tokens[i], startX - 8, matrixStartY + i * cellSize + cellSize / 2);
  }

  textAlign(CENTER, BOTTOM);
  for (let j = 0; j < seqLen; j++) {
    fill(tokenColors[j]);
    text(tokens[j], startX + j * cellSize + cellSize / 2, matrixStartY - 5);
  }

  // Draw cells
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      let val = scores[i][j];
      let intensity = map(val, -1, 2, 50, 255);
      fill(intensity, intensity, 255);
      stroke(100);
      strokeWeight(1);
      rect(startX + j * cellSize, matrixStartY + i * cellSize, cellSize, cellSize);

      fill(val > 1 ? 255 : 0);
      noStroke();
      textSize(10);
      textAlign(CENTER, CENTER);
      text(val.toFixed(2), startX + j * cellSize + cellSize / 2, matrixStartY + i * cellSize + cellSize / 2);
    }
  }

  // Highlight query row
  noFill();
  stroke(255, 200, 0);
  strokeWeight(3);
  rect(startX - 2, matrixStartY + queryPos * cellSize - 2, matrixSize + 4, cellSize + 4);

  // Formula
  fill(60);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Score(i,j) = qᵢ · kⱼ / √d_k', canvasWidth / 2, matrixStartY + matrixSize + 15);
  text('Higher scores = more attention', canvasWidth / 2, matrixStartY + matrixSize + 32);
}

function drawSoftmaxStep() {
  let startY = 50;

  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Attention Weights (softmax)', canvasWidth / 2, startY);

  // Draw attention matrix as heatmap
  let matrixSize = 160;
  let cellSize = matrixSize / seqLen;
  let startX = (canvasWidth - matrixSize) / 2;
  let matrixStartY = startY + 50;

  // Row/column labels
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i < seqLen; i++) {
    fill(tokenColors[i]);
    text(tokens[i], startX - 8, matrixStartY + i * cellSize + cellSize / 2);
  }

  textAlign(CENTER, BOTTOM);
  for (let j = 0; j < seqLen; j++) {
    fill(tokenColors[j]);
    text(tokens[j], startX + j * cellSize + cellSize / 2, matrixStartY - 5);
  }

  // Draw cells
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      let val = attention[i][j];
      let intensity = map(val, 0, 1, 255, 50);
      fill(50, intensity, 50);
      stroke(100);
      strokeWeight(1);
      rect(startX + j * cellSize, matrixStartY + i * cellSize, cellSize, cellSize);

      fill(val > 0.3 ? 255 : 0);
      noStroke();
      textSize(10);
      textAlign(CENTER, CENTER);
      text(val.toFixed(2), startX + j * cellSize + cellSize / 2, matrixStartY + i * cellSize + cellSize / 2);
    }
  }

  // Highlight query row
  noFill();
  stroke(255, 200, 0);
  strokeWeight(3);
  rect(startX - 2, matrixStartY + queryPos * cellSize - 2, matrixSize + 4, cellSize + 4);

  // Show row sum
  let rowSum = attention[queryPos].reduce((a, b) => a + b, 0);
  fill(0);
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Σ=' + rowSum.toFixed(2), startX + matrixSize + 10, matrixStartY + queryPos * cellSize + cellSize / 2);

  // Explanation
  fill(60);
  textSize(12);
  textAlign(CENTER, TOP);
  text('Softmax normalizes each row to sum to 1', canvasWidth / 2, matrixStartY + matrixSize + 15);
  text('Weights show how much each position attends to others', canvasWidth / 2, matrixStartY + matrixSize + 32);
}

function drawOutputStep() {
  let startY = 45;

  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Output = Attention × Values', canvasWidth / 2, startY);

  // Show weighted sum visualization
  let barY = startY + 40;
  let barHeight = 25;
  let maxBarWidth = canvasWidth - 100;

  fill(60);
  textSize(12);
  text('Attention weights for "' + tokens[queryPos] + '":', canvasWidth / 2, barY);

  barY += 25;

  for (let j = 0; j < seqLen; j++) {
    let weight = attention[queryPos][j];
    let barWidth = weight * maxBarWidth;

    fill(tokenColors[j]);
    stroke(0);
    strokeWeight(1);
    rect(50, barY, barWidth, barHeight, 3);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text(tokens[j] + ': ' + (weight * 100).toFixed(1) + '%', 55, barY + barHeight / 2);

    barY += barHeight + 5;
  }

  // Output vector
  barY += 15;
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Output vector for "' + tokens[queryPos] + '":', canvasWidth / 2, barY);

  // Draw output row
  barY += 25;
  let outputRow = output[queryPos];
  let cellWidth = 60;
  let startX = (canvasWidth - outputRow.length * cellWidth) / 2;

  for (let k = 0; k < outputRow.length; k++) {
    fill(200, 200, 255);
    stroke(100);
    strokeWeight(1);
    rect(startX + k * cellWidth, barY, cellWidth - 5, 30, 5);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(outputRow[k].toFixed(3), startX + k * cellWidth + (cellWidth - 5) / 2, barY + 15);
  }

  // Explanation
  fill(60);
  textSize(11);
  textAlign(CENTER, TOP);
  text('Each output is a weighted sum of Value vectors', canvasWidth / 2, barY + 45);
}

function drawMatrix(M, x, y, w, h, rowColors) {
  let rows = M.length;
  let cols = M[0].length;
  let cellW = w / cols;
  let cellH = h / rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (rowColors) {
        fill(colorWithAlpha(rowColors[i], 100));
      } else {
        let val = M[i][j];
        let intensity = map(val, 0, 1, 255, 150);
        fill(intensity, intensity, 255);
      }
      stroke(150);
      strokeWeight(0.5);
      rect(x + j * cellW, y + i * cellH, cellW - 1, cellH - 1);

      fill(0);
      noStroke();
      textSize(9);
      textAlign(CENTER, CENTER);
      text(M[i][j].toFixed(2), x + j * cellW + cellW / 2, y + i * cellH + cellH / 2);
    }
  }
}

function colorWithAlpha(hexColor, alpha) {
  let c = color(hexColor);
  return color(red(c), green(c), blue(c), alpha);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  stepSlider.size(canvasWidth - sliderLeftMargin - margin);
  queryPosSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
