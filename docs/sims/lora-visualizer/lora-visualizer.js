// LoRA (Low-Rank Adaptation) Visualizer
// Shows how LoRA approximates weight updates with low-rank matrices
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Matrix dimensions
let d = 32;  // Weight matrix dimension (d x d for simplicity)
let k = 32;
let r = 4;   // LoRA rank
let maxRank = 16;

// UI elements
let rankSlider;
let dimSlider;
let showDecompCheckbox;
let compareCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Rank slider
  rankSlider = createSlider(1, maxRank, 4, 1);
  rankSlider.position(sliderLeftMargin, drawHeight + 8);
  rankSlider.size(canvasWidth - sliderLeftMargin - margin);
  rankSlider.input(() => r = rankSlider.value());

  // Dimension slider
  dimSlider = createSlider(16, 64, 32, 8);
  dimSlider.position(sliderLeftMargin, drawHeight + 38);
  dimSlider.size(canvasWidth - sliderLeftMargin - margin);
  dimSlider.input(() => {
    d = dimSlider.value();
    k = d;
  });

  describe('LoRA low-rank adaptation visualization showing parameter efficient fine-tuning', LABEL);
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
  text('LoRA: Low-Rank Adaptation', canvasWidth / 2, 8);

  r = rankSlider.value();
  d = dimSlider.value();
  k = d;

  drawLoRAVisualization();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Rank r: ' + r, 10, drawHeight + 18);
  text('Dim d: ' + d, 10, drawHeight + 48);
}

function drawLoRAVisualization() {
  let startY = 40;
  let centerX = canvasWidth / 2;

  // Formula
  fill(60);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text("W' = W + ΔW = W + BA", centerX, startY);

  startY += 30;

  // Draw the main equation visualization
  let matrixScale = Math.min(3, 100 / d);
  let wWidth = d * matrixScale;
  let wHeight = k * matrixScale;
  let maxMatrixWidth = 100;

  wWidth = Math.min(wWidth, maxMatrixWidth);
  wHeight = Math.min(wHeight, maxMatrixWidth);

  // Calculate positions
  let spacing = 30;
  let totalWidth = wWidth + spacing + wWidth + spacing + wWidth;
  let startX = (canvasWidth - totalWidth) / 2;

  // W (frozen)
  let wX = startX;
  drawMatrix(wX, startY, wWidth, wHeight, '#95a5a6', 'W (frozen)');
  drawFrozenIcon(wX + wWidth - 15, startY + 5);

  // Plus sign
  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text('+', wX + wWidth + spacing / 2, startY + wHeight / 2);

  // BA product visualization
  let baX = wX + wWidth + spacing;
  drawLowRankProduct(baX, startY, wWidth, wHeight);

  // Equals sign
  fill(0);
  textSize(24);
  text('=', baX + wWidth + spacing / 2, startY + wHeight / 2);

  // W' (updated)
  let wPrimeX = baX + wWidth + spacing;
  drawMatrix(wPrimeX, startY, wWidth, wHeight, '#3498db', "W' (adapted)");

  // Draw detailed decomposition below
  let decompY = startY + wHeight + 50;
  drawDecompositionDetail(centerX, decompY);

  // Parameter comparison
  let compareY = decompY + 140;
  drawParameterComparison(compareY);
}

function drawMatrix(x, y, w, h, color, label) {
  // Matrix visualization as a grid pattern
  fill(color);
  stroke(0);
  strokeWeight(1);
  rect(x, y, w, h, 3);

  // Grid pattern
  stroke(255, 255, 255, 100);
  strokeWeight(0.5);
  let gridSize = Math.max(w / 8, 5);
  for (let i = gridSize; i < w; i += gridSize) {
    line(x + i, y, x + i, y + h);
  }
  for (let j = gridSize; j < h; j += gridSize) {
    line(x, y + j, x + w, y + j);
  }

  // Label
  fill(0);
  noStroke();
  textSize(10);
  textAlign(CENTER, TOP);
  text(label, x + w / 2, y + h + 5);

  // Dimensions
  fill(100);
  textSize(9);
  text(d + '×' + k, x + w / 2, y + h + 18);
}

function drawFrozenIcon(x, y) {
  // Snowflake/lock icon
  fill(200, 220, 255);
  stroke(100, 150, 200);
  strokeWeight(1);
  ellipse(x, y, 15, 15);

  // Asterisk pattern
  stroke(100, 150, 200);
  strokeWeight(1.5);
  let cx = x, cy = y;
  for (let i = 0; i < 6; i++) {
    let angle = i * PI / 3;
    line(cx, cy, cx + cos(angle) * 5, cy + sin(angle) * 5);
  }
}

function drawLowRankProduct(x, y, w, h) {
  // BA = B × A where B is d×r and A is r×k
  let bWidth = Math.max(15, r * 2);
  let aHeight = Math.max(15, r * 2);

  // Background for the product
  fill(255, 230, 230);
  stroke(0);
  strokeWeight(1);
  rect(x, y, w, h, 3);

  // B matrix (d × r)
  let bX = x + 5;
  let bY = y + (h - h) / 2;
  fill('#e74c3c');
  stroke(0);
  strokeWeight(1);
  rect(bX, bY + 5, bWidth, h - 10, 2);

  // A matrix (r × k)
  let aX = x + w - bWidth - 5;
  let aY = y + 5;
  fill('#2ecc71');
  stroke(0);
  strokeWeight(1);
  rect(aX, aY, w - bWidth - 15, aHeight, 2);

  // Multiply symbol
  fill(0);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text('×', x + w / 2, y + h / 2);

  // Labels
  textSize(8);
  fill(255);
  text('B', bX + bWidth / 2, y + h / 2);
  text('A', aX + (w - bWidth - 15) / 2, aY + aHeight / 2);

  // Overall label
  fill(0);
  textSize(10);
  textAlign(CENTER, TOP);
  text('ΔW = BA', x + w / 2, y + h + 5);
  fill(100);
  textSize(9);
  text('(low-rank)', x + w / 2, y + h + 18);
}

function drawDecompositionDetail(centerX, y) {
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Low-Rank Decomposition Detail', centerX, y);

  y += 25;

  // B matrix
  let bWidth = 25;
  let bHeight = 60;
  let aWidth = 60;
  let aHeight = 25;
  let spacing = 20;

  let totalWidth = bWidth + spacing + aWidth;
  let startX = centerX - totalWidth / 2;

  // B (d × r)
  fill('#e74c3c');
  stroke(0);
  strokeWeight(1);
  rect(startX, y, bWidth, bHeight, 2);
  fill(255);
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text('B', startX + bWidth / 2, y + bHeight / 2);

  // Dimension labels for B
  fill(80);
  textSize(9);
  textAlign(RIGHT, CENTER);
  text(d, startX - 5, y + bHeight / 2);
  textAlign(CENTER, BOTTOM);
  text(r, startX + bWidth / 2, y - 3);

  // Multiply
  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  text('×', startX + bWidth + spacing / 2, y + bHeight / 2);

  // A (r × k)
  let aX = startX + bWidth + spacing;
  fill('#2ecc71');
  stroke(0);
  strokeWeight(1);
  rect(aX, y + (bHeight - aHeight) / 2, aWidth, aHeight, 2);
  fill(255);
  noStroke();
  textSize(10);
  textAlign(CENTER, CENTER);
  text('A', aX + aWidth / 2, y + bHeight / 2);

  // Dimension labels for A
  fill(80);
  textSize(9);
  textAlign(LEFT, CENTER);
  text(k, aX + aWidth + 5, y + bHeight / 2);
  textAlign(CENTER, BOTTOM);
  text(r, aX + aWidth / 2, y + (bHeight - aHeight) / 2 - 3);

  // Trainable indicator
  y += bHeight + 15;
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Only B and A are trained (rank = ' + r + ')', centerX, y);
}

function drawParameterComparison(y) {
  let centerX = canvasWidth / 2;

  // Calculate parameter counts
  let fullParams = d * k;
  let loraParams = r * (d + k);
  let savings = ((1 - loraParams / fullParams) * 100).toFixed(1);

  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Parameter Efficiency', centerX, y);

  y += 20;

  // Comparison bars
  let barMaxWidth = canvasWidth - 100;
  let barHeight = 20;
  let barX = 50;

  // Full fine-tuning bar
  fill('#95a5a6');
  stroke(0);
  strokeWeight(1);
  rect(barX, y, barMaxWidth, barHeight, 3);
  fill(255);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text('Full: ' + formatNumber(fullParams) + ' params', barX + 10, y + barHeight / 2);

  y += barHeight + 8;

  // LoRA bar (scaled)
  let loraWidth = (loraParams / fullParams) * barMaxWidth;
  fill('#2ecc71');
  stroke(0);
  strokeWeight(1);
  rect(barX, y, loraWidth, barHeight, 3);
  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text('LoRA: ' + formatNumber(loraParams) + ' params (' + savings + '% savings)', barX + loraWidth + 10, y + barHeight / 2);

  // Formula
  y += barHeight + 15;
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Full: d×k = ' + d + '×' + k + ' = ' + fullParams, centerX, y);
  text('LoRA: r(d+k) = ' + r + '(' + d + '+' + k + ') = ' + loraParams, centerX, y + 14);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  rankSlider.size(canvasWidth - sliderLeftMargin - margin);
  dimSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
