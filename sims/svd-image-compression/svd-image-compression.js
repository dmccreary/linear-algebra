// SVD Image Compression MicroSim
// Demonstrate low-rank approximation using SVD
// Learning objective: Understand SVD compression quality-storage tradeoff

let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Image dimensions (small for real-time SVD)
let imgSize = 64;

// Original image matrix
let originalImage = [];
let reconstructedImage = [];
let errorImage = [];

// SVD components
let U = [];
let S = [];  // Singular values only (diagonal)
let Vt = [];

// Current rank for approximation
let k = 10;

// UI elements
let kSlider;
let patternSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create pattern selector
  patternSelect = createSelect();
  patternSelect.option('Gradient + Circles', 'circles');
  patternSelect.option('Checkerboard', 'checker');
  patternSelect.option('Diagonal Lines', 'diagonal');
  patternSelect.option('Face-like', 'face');
  patternSelect.position(10, drawHeight + 15);
  patternSelect.changed(generateImage);

  // Rank slider
  kSlider = createSlider(1, imgSize, k, 1);
  kSlider.position(250, drawHeight + 15);
  kSlider.size(200);
  kSlider.input(updateReconstruction);

  // Generate initial image
  generateImage();

  describe('SVD image compression showing original, reconstructed, and error images', LABEL);
}

function draw() {
  updateCanvasSize();

  background(245);

  // Title
  fill(0);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('SVD Image Compression', canvasWidth/2, 10);

  // Calculate layout
  let imgDisplaySize = 160;
  let spacing = 30;
  let totalWidth = 3 * imgDisplaySize + 2 * spacing;
  let startX = (canvasWidth - totalWidth) / 2;
  let imgY = 50;

  // Draw original image
  drawImageMatrix(originalImage, startX, imgY, imgDisplaySize, 'Original');

  // Draw reconstructed image
  drawImageMatrix(reconstructedImage, startX + imgDisplaySize + spacing, imgY, imgDisplaySize, 'Rank-' + k + ' Approximation');

  // Draw error image (magnified)
  drawErrorMatrix(startX + 2 * (imgDisplaySize + spacing), imgY, imgDisplaySize, 'Error (×5)');

  // Draw singular value spectrum
  drawSingularValues(startX, imgY + imgDisplaySize + 40, totalWidth, 100);

  // Control area
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control labels
  noStroke();
  fill(80);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Pattern:', 80, drawHeight + 25);
  text('Rank k:', 200, drawHeight + 25);
  text(k, 460, drawHeight + 25);

  // Statistics
  let compRatio = (imgSize * imgSize) / (k * (imgSize + imgSize + 1));
  let frobError = computeFrobeniusError();
  let varianceCaptured = computeVarianceCaptured();

  textSize(12);
  text('Compression: ' + compRatio.toFixed(1) + '×', 500, drawHeight + 15);
  text('Error: ' + (frobError * 100).toFixed(1) + '%', 500, drawHeight + 35);
  text('Variance: ' + (varianceCaptured * 100).toFixed(1) + '%', 620, drawHeight + 15);
  text('Storage: ' + k + '(' + imgSize + '+' + imgSize + '+1) = ' + (k * (2*imgSize + 1)), 620, drawHeight + 35);

  // Instructions
  fill(100);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Move slider to adjust rank k. Lower k = more compression but more error.', canvasWidth/2, drawHeight + 65);
}

function drawImageMatrix(mat, x, y, size, label) {
  let cellSize = size / imgSize;

  // Label
  fill(0);
  noStroke();
  textSize(13);
  textAlign(CENTER, BOTTOM);
  text(label, x + size/2, y - 5);

  // Draw pixels
  noStroke();
  for (let i = 0; i < imgSize; i++) {
    for (let j = 0; j < imgSize; j++) {
      let val = mat[i][j];
      val = constrain(val, 0, 255);
      fill(val);
      rect(x + j * cellSize, y + i * cellSize, cellSize + 0.5, cellSize + 0.5);
    }
  }

  // Border
  noFill();
  stroke(100);
  strokeWeight(1);
  rect(x, y, size, size);
}

function drawErrorMatrix(x, y, size, label) {
  let cellSize = size / imgSize;

  // Label
  fill(0);
  noStroke();
  textSize(13);
  textAlign(CENTER, BOTTOM);
  text(label, x + size/2, y - 5);

  // Draw error pixels (red = positive, blue = negative)
  noStroke();
  for (let i = 0; i < imgSize; i++) {
    for (let j = 0; j < imgSize; j++) {
      let err = errorImage[i][j] * 5;  // Magnify for visibility
      if (err > 0) {
        fill(128 + err, 128 - err/2, 128 - err/2);
      } else {
        fill(128 + err/2, 128 + err/2, 128 - err);
      }
      rect(x + j * cellSize, y + i * cellSize, cellSize + 0.5, cellSize + 0.5);
    }
  }

  // Border
  noFill();
  stroke(100);
  strokeWeight(1);
  rect(x, y, size, size);
}

function drawSingularValues(x, y, w, h) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text('Singular Value Spectrum', x + 10, y + 5);

  // Draw bar chart
  let barW = (w - 40) / Math.min(imgSize, 40);
  let maxS = S[0] || 1;

  for (let i = 0; i < Math.min(imgSize, 40); i++) {
    let barH = (S[i] / maxS) * (h - 35);
    let barX = x + 20 + i * barW;
    let barY = y + h - 10 - barH;

    if (i < k) {
      fill(70, 130, 200);  // Kept
    } else {
      fill(200, 200, 200);  // Discarded
    }

    noStroke();
    rect(barX, barY, barW - 1, barH);
  }

  // Mark k position
  stroke(255, 100, 100);
  strokeWeight(2);
  let kX = x + 20 + k * barW;
  line(kX, y + 20, kX, y + h - 10);

  noStroke();
  fill(255, 100, 100);
  textSize(10);
  textAlign(CENTER, BOTTOM);
  text('k=' + k, kX, y + 18);
}

function generateImage() {
  let pattern = patternSelect.value();

  originalImage = [];
  for (let i = 0; i < imgSize; i++) {
    originalImage[i] = [];
    for (let j = 0; j < imgSize; j++) {
      originalImage[i][j] = getPixelValue(pattern, i, j);
    }
  }

  // Compute SVD
  computeSVD();
  updateReconstruction();
}

function getPixelValue(pattern, i, j) {
  let val = 0;

  if (pattern === 'circles') {
    // Gradient background with circles
    val = 50 + j * 2;
    // Add circles
    let cx1 = imgSize * 0.3, cy1 = imgSize * 0.4;
    let cx2 = imgSize * 0.7, cy2 = imgSize * 0.6;
    let d1 = Math.sqrt((i - cy1)**2 + (j - cx1)**2);
    let d2 = Math.sqrt((i - cy2)**2 + (j - cx2)**2);
    if (d1 < imgSize * 0.2) val = 220;
    if (d2 < imgSize * 0.15) val = 180;
  }
  else if (pattern === 'checker') {
    let blockSize = 8;
    let bi = Math.floor(i / blockSize);
    let bj = Math.floor(j / blockSize);
    val = ((bi + bj) % 2 === 0) ? 220 : 50;
  }
  else if (pattern === 'diagonal') {
    val = 128 + 80 * Math.sin((i + j) * 0.3);
  }
  else if (pattern === 'face') {
    // Simple face-like pattern
    val = 200;  // Background
    let cx = imgSize / 2, cy = imgSize / 2;
    let d = Math.sqrt((i - cy)**2 + (j - cx)**2);

    // Face outline
    if (d < imgSize * 0.45 && d > imgSize * 0.4) val = 50;
    if (d < imgSize * 0.4) val = 230;

    // Eyes
    let eyeY = cy - imgSize * 0.1;
    let eyeL = cx - imgSize * 0.15;
    let eyeR = cx + imgSize * 0.15;
    let dL = Math.sqrt((i - eyeY)**2 + (j - eyeL)**2);
    let dR = Math.sqrt((i - eyeY)**2 + (j - eyeR)**2);
    if (dL < imgSize * 0.08) val = 50;
    if (dR < imgSize * 0.08) val = 50;

    // Mouth
    if (i > cy + imgSize * 0.1 && i < cy + imgSize * 0.2) {
      if (j > cx - imgSize * 0.15 && j < cx + imgSize * 0.15) {
        val = 100;
      }
    }
  }

  return constrain(val, 0, 255);
}

function computeSVD() {
  // Simple power iteration for SVD (for educational purposes)
  // In practice, use a library like numeric.js

  let A = originalImage.map(row => [...row]);
  U = [];
  S = [];
  Vt = [];

  // Compute SVD iteratively
  for (let iter = 0; iter < imgSize; iter++) {
    // Power iteration to find largest singular value/vectors
    let v = randomVector(imgSize);
    let u;

    for (let p = 0; p < 20; p++) {
      // u = A * v
      u = matVecMult(A, v);
      let uNorm = vecNorm(u);
      if (uNorm < 1e-10) break;
      u = vecScale(u, 1 / uNorm);

      // v = A^T * u
      v = matTransposeVecMult(A, u);
      let vNorm = vecNorm(v);
      if (vNorm < 1e-10) break;
      v = vecScale(v, 1 / vNorm);
    }

    // Singular value
    let Av = matVecMult(A, v);
    let sigma = vecNorm(Av);

    if (sigma < 1e-10) {
      // Fill remaining with zeros
      for (let i = iter; i < imgSize; i++) {
        S.push(0);
        U.push(Array(imgSize).fill(0));
        Vt.push(Array(imgSize).fill(0));
      }
      break;
    }

    S.push(sigma);
    u = vecScale(Av, 1 / sigma);
    U.push(u);
    Vt.push(v);

    // Deflate: A = A - sigma * u * v^T
    for (let i = 0; i < imgSize; i++) {
      for (let j = 0; j < imgSize; j++) {
        A[i][j] -= sigma * u[i] * v[j];
      }
    }
  }
}

function updateReconstruction() {
  k = kSlider.value();

  // Reconstruct using top k components
  reconstructedImage = [];
  errorImage = [];

  for (let i = 0; i < imgSize; i++) {
    reconstructedImage[i] = [];
    errorImage[i] = [];
    for (let j = 0; j < imgSize; j++) {
      let val = 0;
      for (let l = 0; l < k && l < S.length; l++) {
        val += S[l] * U[l][i] * Vt[l][j];
      }
      reconstructedImage[i][j] = val;
      errorImage[i][j] = originalImage[i][j] - val;
    }
  }
}

function computeFrobeniusError() {
  let errSum = 0;
  let origSum = 0;
  for (let i = 0; i < imgSize; i++) {
    for (let j = 0; j < imgSize; j++) {
      errSum += errorImage[i][j] ** 2;
      origSum += originalImage[i][j] ** 2;
    }
  }
  return Math.sqrt(errSum / origSum);
}

function computeVarianceCaptured() {
  let totalVar = 0;
  let keptVar = 0;
  for (let i = 0; i < S.length; i++) {
    totalVar += S[i] ** 2;
    if (i < k) keptVar += S[i] ** 2;
  }
  return totalVar > 0 ? keptVar / totalVar : 0;
}

// Vector/matrix helper functions
function randomVector(n) {
  let v = [];
  for (let i = 0; i < n; i++) v.push(Math.random() - 0.5);
  let norm = vecNorm(v);
  return vecScale(v, 1 / norm);
}

function vecNorm(v) {
  let sum = 0;
  for (let i = 0; i < v.length; i++) sum += v[i] ** 2;
  return Math.sqrt(sum);
}

function vecScale(v, s) {
  return v.map(x => x * s);
}

function matVecMult(A, v) {
  let result = [];
  for (let i = 0; i < A.length; i++) {
    let sum = 0;
    for (let j = 0; j < v.length; j++) {
      sum += A[i][j] * v[j];
    }
    result.push(sum);
  }
  return result;
}

function matTransposeVecMult(A, v) {
  let result = [];
  for (let j = 0; j < A[0].length; j++) {
    let sum = 0;
    for (let i = 0; i < v.length; i++) {
      sum += A[i][j] * v[i];
    }
    result.push(sum);
  }
  return result;
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
