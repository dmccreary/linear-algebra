// Kernel and Range Interactive Visualizer
// Shows kernel (null space) and range (column space) of a transformation
// Demonstrates rank-nullity theorem visually
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout
let margin = 15;
let defaultTextSize = 14;

// Matrix (2×2 for visualization)
let matrix = [[2, 1], [4, 2]];  // Rank 1: columns are multiples

// Controls
let fullRankButton, deficientButton;
let showKernelCheckbox, showMappingCheckbox;
let animateButton;

// Animation
let isAnimating = false;
let animPhase = 0;

// Sample vectors
let sampleVectors = [];
let kernelVectors = [];

// Drawing scale
let scale = 40;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Matrix control buttons
  fullRankButton = createButton('Full Rank');
  fullRankButton.position(10, drawHeight + 5);
  fullRankButton.mousePressed(setFullRank);

  deficientButton = createButton('Rank Deficient');
  deficientButton.position(100, drawHeight + 5);
  deficientButton.mousePressed(setRankDeficient);

  animateButton = createButton('Animate');
  animateButton.position(220, drawHeight + 5);
  animateButton.mousePressed(toggleAnimation);

  // Row 2: Checkboxes
  showKernelCheckbox = createCheckbox('Show Kernel', true);
  showKernelCheckbox.position(10, drawHeight + 40);
  showKernelCheckbox.style('font-size', '14px');

  showMappingCheckbox = createCheckbox('Show Mapping', true);
  showMappingCheckbox.position(130, drawHeight + 40);
  showMappingCheckbox.style('font-size', '14px');

  generateSampleVectors();

  describe('Kernel and range visualizer showing null space and column space of a linear transformation', LABEL);
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Animation
  if (isAnimating) {
    animPhase = (animPhase + 0.02) % 1;
  }

  // Calculate rank and nullity
  let det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  let rank = abs(det) > 0.01 ? 2 : 1;
  let nullity = 2 - rank;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Kernel and Range Visualizer', canvasWidth / 2, 5);

  // Layout
  let leftCenterX = canvasWidth * 0.25;
  let rightCenterX = canvasWidth * 0.75;
  let centerY = drawHeight / 2 + 20;

  // Draw domain (left)
  push();
  translate(leftCenterX, centerY);
  drawDomain(rank, nullity);
  pop();

  // Draw codomain (right)
  push();
  translate(rightCenterX, centerY);
  drawCodomain(rank);
  pop();

  // Draw transformation arrow
  stroke(100);
  strokeWeight(2);
  let arrowY = centerY;
  line(leftCenterX + scale * 3, arrowY, rightCenterX - scale * 3, arrowY);

  // Arrowhead
  fill(100);
  noStroke();
  triangle(rightCenterX - scale * 3, arrowY,
           rightCenterX - scale * 3 - 12, arrowY - 6,
           rightCenterX - scale * 3 - 12, arrowY + 6);

  // Label "T"
  textAlign(CENTER, BOTTOM);
  textSize(16);
  text('T', canvasWidth / 2, arrowY - 10);

  // Draw mapping lines if enabled
  if (showMappingCheckbox.checked()) {
    drawMappings(leftCenterX, rightCenterX, centerY);
  }

  // Draw labels
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Domain (ℝ²)', leftCenterX, 28);
  text('Codomain (ℝ²)', rightCenterX, 28);

  // Draw info panel
  drawInfoPanel(rank, nullity, det);

  // Control area labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Rank: ' + rank + '    Nullity: ' + nullity, 10, drawHeight + 80);
  text('Rank + Nullity = ' + (rank + nullity) + ' = dim(Domain)', 180, drawHeight + 80);
}

function drawDomain(rank, nullity) {
  // Draw axes
  stroke(180);
  strokeWeight(1);
  line(-scale * 3, 0, scale * 3, 0);
  line(0, -scale * 3, 0, scale * 3);

  // If rank < 2, draw kernel line
  if (showKernelCheckbox.checked() && nullity > 0) {
    // Find kernel direction: solve Ax = 0
    // For our matrix, kernel is spanned by (-matrix[0][1], matrix[0][0])
    let kernelDir = normalizeVec([-matrix[0][1], matrix[0][0]]);

    stroke(150, 150, 150, 200);
    strokeWeight(4);
    line(kernelDir[0] * scale * 3, -kernelDir[1] * scale * 3,
         -kernelDir[0] * scale * 3, kernelDir[1] * scale * 3);

    // Label
    fill(100);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    text('Kernel', kernelDir[0] * scale * 2 + 5, -kernelDir[1] * scale * 2 - 10);

    // Draw kernel vectors
    stroke(100, 100, 100);
    strokeWeight(2);
    for (let t of [-2, -1, 1, 2]) {
      let kv = [kernelDir[0] * t * 0.8, kernelDir[1] * t * 0.8];
      drawArrow(0, 0, kv[0] * scale, -kv[1] * scale, color(100, 100, 100));
    }
  }

  // Draw sample vectors
  sampleVectors.forEach((v, i) => {
    let inKernel = isInKernel(v);
    let col = inKernel ? color(100, 100, 100, 150) : color(50, 100, 200, 200);
    drawArrow(0, 0, v[0] * scale, -v[1] * scale, col);
  });
}

function drawCodomain(rank) {
  // Draw axes
  stroke(180);
  strokeWeight(1);
  line(-scale * 3, 0, scale * 3, 0);
  line(0, -scale * 3, 0, scale * 3);

  // Draw range (column space)
  if (rank < 2) {
    // Range is a line through origin
    let rangeDir = normalizeVec([matrix[0][0], matrix[1][0]]);

    stroke(220, 100, 100, 200);
    strokeWeight(4);
    line(rangeDir[0] * scale * 3, -rangeDir[1] * scale * 3,
         -rangeDir[0] * scale * 3, rangeDir[1] * scale * 3);

    // Label
    fill(180, 80, 80);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    text('Range', rangeDir[0] * scale * 2 + 5, -rangeDir[1] * scale * 2 - 10);
  } else {
    // Range is all of R²
    fill(255, 200, 200, 50);
    noStroke();
    rect(-scale * 3, -scale * 3, scale * 6, scale * 6);
    fill(180, 80, 80);
    textAlign(CENTER, CENTER);
    textSize(11);
    text('Range = ℝ²', 0, -scale * 2.5);
  }

  // Mark origin (zero vector)
  fill(0);
  noStroke();
  ellipse(0, 0, 10, 10);
  textSize(10);
  textAlign(LEFT, TOP);
  text('0', 5, 3);

  // Draw transformed sample vectors
  sampleVectors.forEach((v, i) => {
    let tv = applyMatrix(v);
    let inKernel = isInKernel(v);
    let col = inKernel ? color(100, 100, 100, 200) : color(220, 80, 80, 200);

    if (isAnimating) {
      let t = (sin(animPhase * TWO_PI - HALF_PI) + 1) / 2;
      let displayV = [lerp(v[0], tv[0], t), lerp(v[1], tv[1], t)];
      drawArrow(0, 0, displayV[0] * scale, -displayV[1] * scale, col);
    } else {
      drawArrow(0, 0, tv[0] * scale, -tv[1] * scale, col);
    }
  });
}

function drawMappings(leftX, rightX, centerY) {
  sampleVectors.forEach((v, i) => {
    let tv = applyMatrix(v);
    let inKernel = isInKernel(v);

    stroke(inKernel ? color(100, 100, 100, 80) : color(150, 100, 150, 80));
    strokeWeight(1);

    let x1 = leftX + v[0] * scale;
    let y1 = centerY - v[1] * scale;
    let x2 = rightX + tv[0] * scale;
    let y2 = centerY - tv[1] * scale;

    // Draw curved mapping line
    noFill();
    bezier(x1, y1, x1 + 30, y1 - 30, x2 - 30, y2 - 30, x2, y2);
  });
}

function drawInfoPanel(rank, nullity, det) {
  let px = canvasWidth / 2 - 80;
  let py = 45;

  // Background
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(px, py, 160, 85, 8);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);

  let y = py + 8;
  text('Matrix A:', px + 10, y);

  y += 15;
  textSize(12);
  text('[' + nf(matrix[0][0], 1, 1) + '  ' + nf(matrix[0][1], 1, 1) + ']', px + 15, y);
  text('[' + nf(matrix[1][0], 1, 1) + '  ' + nf(matrix[1][1], 1, 1) + ']', px + 15, y + 14);

  y += 35;
  textSize(11);
  text('det(A) = ' + nf(det, 1, 2), px + 10, y);

  y += 15;
  fill(rank === 2 ? color(50, 150, 50) : color(200, 100, 50));
  text(rank === 2 ? 'Full rank (invertible)' : 'Rank deficient', px + 10, y);
}

function drawArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(2);
  line(x1, y1, x2, y2);

  let angle = atan2(y2 - y1, x2 - x1);
  let arrowSize = 8;

  push();
  translate(x2, y2);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -arrowSize, -arrowSize/2.5, -arrowSize, arrowSize/2.5);
  pop();
}

function applyMatrix(v) {
  return [
    matrix[0][0] * v[0] + matrix[0][1] * v[1],
    matrix[1][0] * v[0] + matrix[1][1] * v[1]
  ];
}

function isInKernel(v) {
  let tv = applyMatrix(v);
  return abs(tv[0]) < 0.1 && abs(tv[1]) < 0.1;
}

function normalizeVec(v) {
  let len = sqrt(v[0] * v[0] + v[1] * v[1]);
  if (len < 0.001) return [1, 0];
  return [v[0] / len, v[1] / len];
}

function generateSampleVectors() {
  sampleVectors = [];
  // Regular sample grid
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (i !== 0 || j !== 0) {
        sampleVectors.push([i * 0.7, j * 0.7]);
      }
    }
  }
}

function setFullRank() {
  // Random full rank matrix
  matrix = [
    [random(1, 3), random(-2, 2)],
    [random(-2, 2), random(1, 3)]
  ];
  // Ensure not rank deficient
  let det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  if (abs(det) < 0.5) {
    matrix[1][1] += 2;
  }
}

function setRankDeficient() {
  // Rank 1 matrix: second row is multiple of first
  let a = random(1, 2);
  let b = random(-1, 1);
  let k = random(1.5, 2.5);
  matrix = [
    [a, b],
    [a * k, b * k]
  ];
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Stop' : 'Animate');
  if (!isAnimating) animPhase = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
