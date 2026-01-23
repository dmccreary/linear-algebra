// SVD Forms Comparison MicroSim
// Compare Full, Compact, and Truncated SVD visually
// Learning objective: Understand when to use each SVD form

let canvasWidth = 900;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix dimensions
let m = 6;  // rows
let n = 4;  // columns
let r = 3;  // rank
let k = 2;  // truncation level

// UI elements
let mSlider, nSlider, rSlider, kSlider;

// Colors
let keptColor, discardedColor, zeroColor;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  keptColor = color(70, 130, 200);
  discardedColor = color(200, 200, 200);
  zeroColor = color(240, 240, 240);

  // Sliders
  mSlider = createSlider(3, 8, m, 1);
  mSlider.position(40, drawHeight + 15);
  mSlider.size(80);
  mSlider.input(updateDimensions);

  nSlider = createSlider(3, 8, n, 1);
  nSlider.position(190, drawHeight + 15);
  nSlider.size(80);
  nSlider.input(updateDimensions);

  rSlider = createSlider(1, 4, r, 1);
  rSlider.position(340, drawHeight + 15);
  rSlider.size(80);
  rSlider.input(updateDimensions);

  kSlider = createSlider(1, 3, k, 1);
  kSlider.position(490, drawHeight + 15);
  kSlider.size(80);
  kSlider.input(updateDimensions);

  describe('Comparison of Full, Compact, and Truncated SVD forms', LABEL);
}

function draw() {
  updateCanvasSize();

  background('aliceblue');

  // Title
  fill(0);
  noStroke();
  textSize(22);
  textAlign(CENTER, TOP);
  text('SVD Forms Comparison', canvasWidth/2, 10);

  // Three columns
  let colWidth = (canvasWidth - 80) / 3;
  let colX = [30, 30 + colWidth + 20, 30 + 2 * colWidth + 25];

  // Draw each SVD form
  drawFullSVD(colX[0], 50, colWidth);
  drawCompactSVD(colX[1], 50, colWidth);
  drawTruncatedSVD(colX[2], 50, colWidth);

  // Control area
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Slider labels
  noStroke();
  fill(80);
  textSize(13);
  textAlign(RIGHT, CENTER);
  text('m:', 35, drawHeight + 25);
  text('n:', 185, drawHeight + 25);
  text('rank:', 335, drawHeight + 25);
  text('k:', 485, drawHeight + 25);

  textAlign(LEFT, CENTER);
  text(m, 125, drawHeight + 25);
  text(n, 275, drawHeight + 25);
  text(r, 425, drawHeight + 25);
  text(k, 575, drawHeight + 25);

  // Legend
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  // Legend in lower right of drawing area
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Legend:', canvasWidth - 240, drawHeight - 35);

  fill(keptColor);
  noStroke();
  rect(canvasWidth - 240, drawHeight - 25, 15, 12);
  fill(80);
  text('Kept', canvasWidth - 220, drawHeight - 19);

  fill(discardedColor);
  rect(canvasWidth - 180, drawHeight - 25, 15, 12);
  fill(80);
  text('Discarded', canvasWidth - 160, drawHeight - 19);

  fill(zeroColor);
  stroke(200);
  rect(canvasWidth - 100, drawHeight - 25, 15, 12);
  noStroke();
  fill(80);
  text('Zero', canvasWidth - 80, drawHeight - 19);
}

function drawFullSVD(x, y, w) {
  // Title
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text('Full SVD', x + w/2, y);

  // Dimensions text
  fill(80);
  textSize(11);
  text('A = U × Σ × Vᵀ', x + w/2, y + 22);
  text('(' + m + '×' + n + ') = (' + m + '×' + m + ')(' + m + '×' + n + ')(' + n + '×' + n + ')', x + w/2, y + 38);

  // Draw matrices
  let matY = y + 60;
  let cellSize = 12;
  let spacing = 15;

  // Calculate layout
  let totalWidth = m * cellSize + spacing + m * cellSize + spacing + n * cellSize;
  let startX = x + (w - totalWidth) / 2;

  // U matrix (m × m)
  drawMatrixBlock(startX, matY, m, m, cellSize, 'full-U');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('U', startX + m * cellSize / 2, matY + m * cellSize + 5);
  text(m + '×' + m, startX + m * cellSize / 2, matY + m * cellSize + 18);

  // × symbol
  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  text('×', startX + m * cellSize + spacing/2, matY + m * cellSize / 2);

  // Σ matrix (m × n)
  drawMatrixBlock(startX + m * cellSize + spacing, matY, m, n, cellSize, 'full-Sigma');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Σ', startX + m * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 5);
  text(m + '×' + n, startX + m * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 18);

  // × symbol
  fill(0);
  textSize(14);
  text('×', startX + m * cellSize + spacing + n * cellSize + spacing/2, matY + m * cellSize / 2);

  // V^T matrix (n × n)
  drawMatrixBlock(startX + m * cellSize + spacing + n * cellSize + spacing, matY, n, n, cellSize, 'full-Vt');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Vᵀ', startX + m * cellSize + spacing + n * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 5);
  text(n + '×' + n, startX + m * cellSize + spacing + n * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 18);

  // Info box
  let infoY = matY + m * cellSize + 45;
  fill(255, 255, 240);
  stroke(200);
  rect(x + 10, infoY, w - 20, 90, 5);

  fill(60);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  let lineH = 15;
  text('• Use case: Complete basis for', x + 18, infoY + 8);
  text('  all four fundamental subspaces', x + 18, infoY + 8 + lineH);
  text('• Exact reconstruction: A = UΣVᵀ', x + 18, infoY + 8 + 2*lineH);
  text('• Memory: O(m² + mn + n²)', x + 18, infoY + 8 + 3*lineH);

  let mem = m*m + m*n + n*n;
  text('• Storage: ' + mem + ' elements', x + 18, infoY + 8 + 4*lineH);
}

function drawCompactSVD(x, y, w) {
  // Title
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text('Compact SVD', x + w/2, y);

  // Dimensions text
  fill(80);
  textSize(11);
  text('A = Uᵣ × Σᵣ × Vᵣᵀ', x + w/2, y + 22);
  text('(' + m + '×' + n + ') = (' + m + '×' + r + ')(' + r + '×' + r + ')(' + r + '×' + n + ')', x + w/2, y + 38);

  // Draw matrices
  let matY = y + 60;
  let cellSize = 12;
  let spacing = 15;

  let totalWidth = r * cellSize + spacing + r * cellSize + spacing + n * cellSize;
  let startX = x + (w - totalWidth) / 2;

  // U_r matrix (m × r)
  drawMatrixBlock(startX, matY, m, r, cellSize, 'compact-U');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Uᵣ', startX + r * cellSize / 2, matY + m * cellSize + 5);
  text(m + '×' + r, startX + r * cellSize / 2, matY + m * cellSize + 18);

  // × symbol
  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  text('×', startX + r * cellSize + spacing/2, matY + m * cellSize / 2);

  // Σ_r matrix (r × r)
  drawMatrixBlock(startX + r * cellSize + spacing, matY, r, r, cellSize, 'compact-Sigma');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Σᵣ', startX + r * cellSize + spacing + r * cellSize / 2, matY + m * cellSize + 5);
  text(r + '×' + r, startX + r * cellSize + spacing + r * cellSize / 2, matY + m * cellSize + 18);

  // × symbol
  fill(0);
  textSize(14);
  text('×', startX + r * cellSize + spacing + r * cellSize + spacing/2, matY + m * cellSize / 2);

  // V_r^T matrix (r × n)
  drawMatrixBlock(startX + r * cellSize + spacing + r * cellSize + spacing, matY, r, n, cellSize, 'compact-Vt');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Vᵣᵀ', startX + r * cellSize + spacing + r * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 5);
  text(r + '×' + n, startX + r * cellSize + spacing + r * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 18);

  // Info box
  let infoY = matY + m * cellSize + 45;
  fill(245, 255, 245);
  stroke(200);
  rect(x + 10, infoY, w - 20, 90, 5);

  fill(60);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  let lineH = 15;
  text('• Use case: Efficient storage,', x + 18, infoY + 8);
  text('  exact reconstruction', x + 18, infoY + 8 + lineH);
  text('• Only r non-zero singular values', x + 18, infoY + 8 + 2*lineH);
  text('• Memory: O(mr + r² + rn)', x + 18, infoY + 8 + 3*lineH);

  let mem = m*r + r*r + r*n;
  text('• Storage: ' + mem + ' elements', x + 18, infoY + 8 + 4*lineH);
}

function drawTruncatedSVD(x, y, w) {
  // Title
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text('Truncated SVD', x + w/2, y);

  // Dimensions text
  fill(80);
  textSize(11);
  text('Aₖ ≈ Uₖ × Σₖ × Vₖᵀ', x + w/2, y + 22);
  text('(' + m + '×' + n + ') ≈ (' + m + '×' + k + ')(' + k + '×' + k + ')(' + k + '×' + n + ')', x + w/2, y + 38);

  // Draw matrices
  let matY = y + 60;
  let cellSize = 12;
  let spacing = 15;

  let totalWidth = k * cellSize + spacing + k * cellSize + spacing + n * cellSize;
  let startX = x + (w - totalWidth) / 2;

  // U_k matrix (m × k)
  drawMatrixBlock(startX, matY, m, k, cellSize, 'truncated-U');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Uₖ', startX + k * cellSize / 2, matY + m * cellSize + 5);
  text(m + '×' + k, startX + k * cellSize / 2, matY + m * cellSize + 18);

  // × symbol
  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  text('×', startX + k * cellSize + spacing/2, matY + m * cellSize / 2);

  // Σ_k matrix (k × k)
  drawMatrixBlock(startX + k * cellSize + spacing, matY, k, k, cellSize, 'truncated-Sigma');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Σₖ', startX + k * cellSize + spacing + k * cellSize / 2, matY + m * cellSize + 5);
  text(k + '×' + k, startX + k * cellSize + spacing + k * cellSize / 2, matY + m * cellSize + 18);

  // × symbol
  fill(0);
  textSize(14);
  text('×', startX + k * cellSize + spacing + k * cellSize + spacing/2, matY + m * cellSize / 2);

  // V_k^T matrix (k × n)
  drawMatrixBlock(startX + k * cellSize + spacing + k * cellSize + spacing, matY, k, n, cellSize, 'truncated-Vt');
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Vₖᵀ', startX + k * cellSize + spacing + k * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 5);
  text(k + '×' + n, startX + k * cellSize + spacing + k * cellSize + spacing + n * cellSize / 2, matY + m * cellSize + 18);

  // Info box
  let infoY = matY + m * cellSize + 45;
  fill(255, 245, 245);
  stroke(200);
  rect(x + 10, infoY, w - 20, 90, 5);

  fill(60);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  let lineH = 15;
  text('• Use case: Low-rank approximation,', x + 18, infoY + 8);
  text('  dimensionality reduction, denoising', x + 18, infoY + 8 + lineH);
  text('• k < r: approximate reconstruction', x + 18, infoY + 8 + 2*lineH);
  text('• Memory: O(mk + k² + kn)', x + 18, infoY + 8 + 3*lineH);

  let mem = m*k + k*k + k*n;
  text('• Storage: ' + mem + ' elements', x + 18, infoY + 8 + 4*lineH);
}

function drawMatrixBlock(x, y, rows, cols, cellSize, type) {
  stroke(150);
  strokeWeight(0.5);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cx = x + j * cellSize;
      let cy = y + i * cellSize;

      // Determine color based on type
      let c = getBlockColor(type, i, j, rows, cols);
      fill(c);
      rect(cx, cy, cellSize - 1, cellSize - 1);
    }
  }
}

function getBlockColor(type, i, j, rows, cols) {
  if (type === 'full-U') {
    return (j < r) ? keptColor : discardedColor;
  }
  else if (type === 'full-Sigma') {
    if (i === j && i < r) return keptColor;
    if (i === j && i >= r) return discardedColor;
    return zeroColor;
  }
  else if (type === 'full-Vt') {
    return (i < r) ? keptColor : discardedColor;
  }
  else if (type === 'compact-U') {
    return keptColor;
  }
  else if (type === 'compact-Sigma') {
    return (i === j) ? keptColor : zeroColor;
  }
  else if (type === 'compact-Vt') {
    return keptColor;
  }
  else if (type === 'truncated-U') {
    return keptColor;
  }
  else if (type === 'truncated-Sigma') {
    return (i === j) ? keptColor : zeroColor;
  }
  else if (type === 'truncated-Vt') {
    return keptColor;
  }

  return color(200);
}

function updateDimensions() {
  m = mSlider.value();
  n = nSlider.value();
  r = rSlider.value();
  k = kSlider.value();

  // Ensure constraints
  r = min(r, min(m, n));
  k = min(k, r);

  rSlider.value(r);
  kSlider.value(k);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(700, Math.floor(container.offsetWidth));
  }
}
