// PCA Step-by-Step Visualizer MicroSim
// Understand PCA by visualizing each step from raw data to projected representation
// Learning objective: Understand PCA through step-by-step visualization

let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Data
let numPoints = 100;
let dataPoints = [];        // Original 2D/3D points
let centeredPoints = [];    // After centering
let projectedPoints = [];   // After projection

// Data generation parameters
let clusterSpread = 1.5;
let clusterRotation = 0.5;  // Radians
let elongation = 3.0;       // How elongated the cluster is

// Mean and covariance
let dataMean = [0, 0];
let covMatrix = [[1, 0], [0, 1]];
let eigenvalues = [1, 1];
let eigenvectors = [[1, 0], [0, 1]];

// Algorithm state
let currentStep = 0;  // 0: Original, 1: Centered, 2: PCs found, 3: Projected
let stepNames = ['Original Data', 'Centered Data', 'Principal Components', 'Projected (1D)'];
let animProgress = 1.0;  // Animation progress (0-1)
let isAnimating = false;
let animSpeed = 0.03;

// Components to keep
let numComponents = 1;

// Display options
let showReconstruction = false;
let show3D = false;

// UI elements
let numPointsSlider, spreadSlider, rotationSlider, elongationSlider;
let centerBtn, findPCsBtn, projectBtn, resetBtn;
let componentsSlider;
let reconstructionCheckbox;
let newDataBtn;

// Panel dimensions (computed dynamically)
let panelWidth, panelHeight;
let screeWidth = 120;
let screeHeight = 100;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Generate initial data
  generateData();

  // Create UI elements
  createUIElements();

  describe('Step-by-step visualization of PCA showing centering, finding principal components, and projection', LABEL);
}

function createUIElements() {
  const container = document.querySelector('main');

  // Row 1: Step buttons
  centerBtn = createButton('1. Center');
  centerBtn.position(10, drawHeight + 10);
  centerBtn.mousePressed(() => advanceToStep(1));
  centerBtn.parent(container);

  findPCsBtn = createButton('2. Find PCs');
  findPCsBtn.position(85, drawHeight + 10);
  findPCsBtn.mousePressed(() => advanceToStep(2));
  findPCsBtn.parent(container);

  projectBtn = createButton('3. Project');
  projectBtn.position(175, drawHeight + 10);
  projectBtn.mousePressed(() => advanceToStep(3));
  projectBtn.parent(container);

  resetBtn = createButton('Reset');
  resetBtn.position(260, drawHeight + 10);
  resetBtn.mousePressed(resetVisualization);
  resetBtn.parent(container);

  // Components slider
  componentsSlider = createSlider(1, 2, 1, 1);
  componentsSlider.position(380, drawHeight + 10);
  componentsSlider.size(60);
  componentsSlider.input(onComponentsChange);
  componentsSlider.parent(container);

  // Reconstruction checkbox
  reconstructionCheckbox = createCheckbox('Show Reconstruction', false);
  reconstructionCheckbox.position(460, drawHeight + 8);
  reconstructionCheckbox.style('font-size', '12px');
  reconstructionCheckbox.changed(() => { showReconstruction = reconstructionCheckbox.checked(); });
  reconstructionCheckbox.parent(container);

  // Row 2: Data generation controls
  newDataBtn = createButton('New Data');
  newDataBtn.position(10, drawHeight + 40);
  newDataBtn.mousePressed(generateNewData);
  newDataBtn.parent(container);

  // Number of points
  numPointsSlider = createSlider(20, 200, 100, 10);
  numPointsSlider.position(120, drawHeight + 40);
  numPointsSlider.size(80);
  numPointsSlider.input(generateData);
  numPointsSlider.parent(container);

  // Spread
  spreadSlider = createSlider(0.5, 3, 1.5, 0.1);
  spreadSlider.position(290, drawHeight + 40);
  spreadSlider.size(70);
  spreadSlider.input(generateData);
  spreadSlider.parent(container);

  // Rotation
  rotationSlider = createSlider(-PI/2, PI/2, 0.5, 0.05);
  rotationSlider.position(430, drawHeight + 40);
  rotationSlider.size(70);
  rotationSlider.input(generateData);
  rotationSlider.parent(container);

  // Elongation
  elongationSlider = createSlider(1, 5, 3, 0.1);
  elongationSlider.position(570, drawHeight + 40);
  elongationSlider.size(70);
  elongationSlider.input(generateData);
  elongationSlider.parent(container);

  // Row 3: Labels
  // (drawn in draw function)
}

function draw() {
  updateCanvasSize();

  background(245);

  // Update animation
  if (isAnimating) {
    animProgress += animSpeed;
    if (animProgress >= 1.0) {
      animProgress = 1.0;
      isAnimating = false;
    }
  }

  // Compute panel dimensions
  let totalPanelWidth = canvasWidth - screeWidth - 50;
  panelWidth = (totalPanelWidth - 30) / 4;
  panelHeight = drawHeight - 80;

  // Draw title
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text('PCA Step-by-Step Visualizer', canvasWidth/2, 8);

  // Draw four main panels
  let panelY = 35;
  for (let i = 0; i < 4; i++) {
    let panelX = 10 + i * (panelWidth + 10);
    drawDataPanel(i, panelX, panelY, panelWidth, panelHeight);
  }

  // Draw scree plot
  drawScreePlot(canvasWidth - screeWidth - 15, panelY, screeWidth, screeHeight);

  // Draw variance explained
  drawVarianceInfo(canvasWidth - screeWidth - 15, panelY + screeHeight + 20);

  // Draw control area background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Draw control labels
  drawControlLabels();
}

function drawDataPanel(panelIdx, x, y, w, h) {
  // Panel background
  fill(255);
  stroke(panelIdx === currentStep ? color(50, 150, 250) : color(200));
  strokeWeight(panelIdx === currentStep ? 3 : 1);
  rect(x, y, w, h, 5);

  // Panel title
  fill(panelIdx === currentStep ? color(50, 100, 200) : color(80));
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text(stepNames[panelIdx], x + w/2, y + 5);

  // Coordinate system
  let cx = x + w/2;
  let cy = y + h/2 + 10;
  let scale = Math.min(w, h) * 0.12;

  // Draw axes
  stroke(200);
  strokeWeight(1);
  line(cx - w/2 + 10, cy, cx + w/2 - 10, cy);
  line(cx, cy - h/2 + 25, cx, cy + h/2 - 15);

  // Choose which points to draw
  let points = getPointsForPanel(panelIdx);
  let effectiveProgress = (panelIdx === currentStep && panelIdx > 0) ? animProgress : 1.0;

  // Get previous panel points for interpolation
  let prevPoints = panelIdx > 0 ? getPointsForPanel(panelIdx - 1) : points;

  // Draw points
  noStroke();
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let prevPt = prevPoints[i] || pt;

    // Interpolate position during animation
    let drawX, drawY;
    if (panelIdx <= currentStep) {
      if (panelIdx === currentStep && panelIdx > 0) {
        drawX = lerp(prevPt[0], pt[0], effectiveProgress);
        drawY = lerp(prevPt[1], pt[1], effectiveProgress);
      } else {
        drawX = pt[0];
        drawY = pt[1];
      }
    } else {
      // Show previous state for future panels
      drawX = prevPt[0];
      drawY = prevPt[1];
    }

    // Color by original position
    let hue = map(i, 0, points.length, 0, 360);
    fill(color('hsla(' + hue + ', 70%, 50%, 0.7)'));

    let screenX = cx + drawX * scale;
    let screenY = cy - drawY * scale;

    // Keep within panel bounds
    screenX = constrain(screenX, x + 5, x + w - 5);
    screenY = constrain(screenY, y + 20, y + h - 5);

    ellipse(screenX, screenY, 6, 6);
  }

  // Draw mean point (Panel 0)
  if (panelIdx === 0 && currentStep >= 0) {
    fill(255, 0, 0);
    stroke(100);
    strokeWeight(1);
    let mx = cx + dataMean[0] * scale;
    let my = cy - dataMean[1] * scale;
    ellipse(mx, my, 10, 10);

    noStroke();
    fill(0);
    textSize(9);
    textAlign(LEFT, TOP);
    text('mean', mx + 6, my - 4);
  }

  // Draw eigenvectors (Panel 2 and 3)
  if ((panelIdx === 2 || panelIdx === 3) && currentStep >= 2) {
    drawEigenvectors(cx, cy, scale, panelIdx);
  }

  // Draw projected 1D line (Panel 3)
  if (panelIdx === 3 && currentStep >= 3) {
    drawProjectionLine(cx, cy, scale, w);
  }

  // Draw reconstruction (Panel 3)
  if (panelIdx === 3 && showReconstruction && currentStep >= 3) {
    drawReconstruction(cx, cy, scale);
  }
}

function getPointsForPanel(panelIdx) {
  switch (panelIdx) {
    case 0:
      return dataPoints;
    case 1:
      return centeredPoints.length > 0 ? centeredPoints : dataPoints;
    case 2:
      return centeredPoints.length > 0 ? centeredPoints : dataPoints;
    case 3:
      return projectedPoints.length > 0 ? projectedPoints : (centeredPoints.length > 0 ? centeredPoints : dataPoints);
    default:
      return dataPoints;
  }
}

function drawEigenvectors(cx, cy, scale, panelIdx) {
  let vecScale = scale * 2;

  // First eigenvector (PC1) - red
  stroke(220, 50, 50);
  strokeWeight(3);
  let e1 = eigenvectors[0];
  let len1 = Math.sqrt(eigenvalues[0]) * vecScale;
  drawArrow(cx, cy, cx + e1[0] * len1, cy - e1[1] * len1);

  // Second eigenvector (PC2) - green, thinner if k=1
  if (numComponents >= 2 || panelIdx === 2) {
    stroke(50, 180, 50);
    strokeWeight(numComponents >= 2 ? 3 : 1.5);
    let e2 = eigenvectors[1];
    let len2 = Math.sqrt(eigenvalues[1]) * vecScale;
    drawArrow(cx, cy, cx + e2[0] * len2, cy - e2[1] * len2);
  }

  // Labels
  noStroke();
  fill(180, 50, 50);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('PC1', cx + e1[0] * len1 + 5, cy - e1[1] * len1);

  if (numComponents >= 2 || panelIdx === 2) {
    fill(50, 150, 50);
    let e2 = eigenvectors[1];
    let len2 = Math.sqrt(eigenvalues[1]) * vecScale;
    text('PC2', cx + e2[0] * len2 + 5, cy - e2[1] * len2);
  }
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);

  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let headLen = 8;
  push();
  translate(x2, y2);
  rotate(angle);
  line(0, 0, -headLen, headLen/2);
  line(0, 0, -headLen, -headLen/2);
  pop();
}

function drawProjectionLine(cx, cy, scale, panelW) {
  // Draw the PC1 line across the panel
  let e1 = eigenvectors[0];
  stroke(220, 50, 50, 100);
  strokeWeight(2);

  let lineLen = panelW * 0.4;
  line(cx - e1[0] * lineLen, cy + e1[1] * lineLen,
       cx + e1[0] * lineLen, cy - e1[1] * lineLen);
}

function drawReconstruction(cx, cy, scale) {
  // Draw reconstruction error lines
  stroke(255, 100, 0, 150);
  strokeWeight(1);

  for (let i = 0; i < centeredPoints.length; i++) {
    let orig = centeredPoints[i];
    let proj = projectedPoints[i];

    let ox = cx + orig[0] * scale;
    let oy = cy - orig[1] * scale;
    let px = cx + proj[0] * scale;
    let py = cy - proj[1] * scale;

    // Draw dashed line showing reconstruction error
    drawDashedLine(ox, oy, px, py);
  }
}

function drawDashedLine(x1, y1, x2, y2) {
  let segments = 4;
  for (let i = 0; i < segments; i += 2) {
    let t1 = i / segments;
    let t2 = (i + 1) / segments;
    line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
  }
}

function drawScreePlot(x, y, w, h) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(0);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Scree Plot', x + w/2, y + 5);

  // Only show if we've computed eigenvalues
  if (currentStep < 2) {
    fill(150);
    textSize(10);
    textAlign(CENTER, CENTER);
    text('(after step 2)', x + w/2, y + h/2);
    return;
  }

  // Draw bars
  let barWidth = 25;
  let maxEig = Math.max(eigenvalues[0], eigenvalues[1]);
  let barAreaHeight = h - 40;
  let baseY = y + h - 15;

  for (let i = 0; i < 2; i++) {
    let barHeight = (eigenvalues[i] / maxEig) * barAreaHeight * 0.8;
    let barX = x + 20 + i * (barWidth + 15);

    // Bar
    fill(i === 0 ? color(220, 80, 80) : color(80, 180, 80));
    noStroke();
    rect(barX, baseY - barHeight, barWidth, barHeight, 3);

    // Label
    fill(0);
    textSize(9);
    textAlign(CENTER, TOP);
    text('PC' + (i+1), barX + barWidth/2, baseY + 2);

    // Value
    textSize(8);
    textAlign(CENTER, BOTTOM);
    text(eigenvalues[i].toFixed(2), barX + barWidth/2, baseY - barHeight - 2);
  }
}

function drawVarianceInfo(x, y) {
  if (currentStep < 2) return;

  let totalVar = eigenvalues[0] + eigenvalues[1];
  let var1 = (eigenvalues[0] / totalVar) * 100;
  let var2 = (eigenvalues[1] / totalVar) * 100;
  let keptVar = numComponents === 1 ? var1 : var1 + var2;

  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, screeWidth, 80, 5);

  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);

  text('Variance Explained:', x + 5, y + 5);

  textSize(9);
  fill(180, 50, 50);
  text('PC1: ' + var1.toFixed(1) + '%', x + 5, y + 22);

  fill(50, 150, 50);
  text('PC2: ' + var2.toFixed(1) + '%', x + 5, y + 36);

  fill(0);
  textSize(10);
  text('Kept (k=' + numComponents + '):', x + 5, y + 52);
  textSize(11);
  fill(50, 50, 200);
  text(keptVar.toFixed(1) + '%', x + 5, y + 65);
}

function drawControlLabels() {
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);

  // Row 1 labels
  text('k:', 355, drawHeight + 20);

  // Row 2 labels
  text('Points:', 100, drawHeight + 70);
  text(numPointsSlider.value(), 205, drawHeight + 50);

  text('Spread:', 260, drawHeight + 70);
  text(spreadSlider.value().toFixed(1), 365, drawHeight + 50);

  text('Rotation:', 400, drawHeight + 70);
  text((rotationSlider.value() * 180 / PI).toFixed(0) + '\u00B0', 505, drawHeight + 50);

  text('Elongation:', 530, drawHeight + 70);
  text(elongationSlider.value().toFixed(1), 645, drawHeight + 50);

  // Current step indicator
  textAlign(RIGHT, CENTER);
  fill(50, 100, 200);
  text('Step ' + currentStep + '/3: ' + stepNames[currentStep], canvasWidth - 20, drawHeight + 85);
}

function generateData() {
  numPoints = numPointsSlider ? numPointsSlider.value() : 100;
  clusterSpread = spreadSlider ? spreadSlider.value() : 1.5;
  clusterRotation = rotationSlider ? rotationSlider.value() : 0.5;
  elongation = elongationSlider ? elongationSlider.value() : 3.0;

  dataPoints = [];

  // Generate elongated Gaussian cluster
  let stdX = clusterSpread * elongation;
  let stdY = clusterSpread;

  for (let i = 0; i < numPoints; i++) {
    // Generate unrotated point
    let x = randomGaussian(0, stdX);
    let y = randomGaussian(0, stdY);

    // Rotate
    let rx = x * cos(clusterRotation) - y * sin(clusterRotation);
    let ry = x * sin(clusterRotation) + y * cos(clusterRotation);

    // Add offset to make mean non-zero
    rx += 2;
    ry += 1.5;

    dataPoints.push([rx, ry]);
  }

  // Compute statistics
  computeStatistics();
  resetVisualization();
}

function generateNewData() {
  // Randomize parameters
  rotationSlider.value(random(-PI/2, PI/2));
  spreadSlider.value(random(0.8, 2.5));
  elongationSlider.value(random(1.5, 4.5));
  generateData();
}

function computeStatistics() {
  // Compute mean
  dataMean = [0, 0];
  for (let pt of dataPoints) {
    dataMean[0] += pt[0];
    dataMean[1] += pt[1];
  }
  dataMean[0] /= dataPoints.length;
  dataMean[1] /= dataPoints.length;

  // Compute centered points
  centeredPoints = dataPoints.map(pt => [pt[0] - dataMean[0], pt[1] - dataMean[1]]);

  // Compute covariance matrix
  let cov00 = 0, cov01 = 0, cov11 = 0;
  for (let pt of centeredPoints) {
    cov00 += pt[0] * pt[0];
    cov01 += pt[0] * pt[1];
    cov11 += pt[1] * pt[1];
  }
  let n = centeredPoints.length;
  covMatrix = [
    [cov00 / n, cov01 / n],
    [cov01 / n, cov11 / n]
  ];

  // Compute eigenvalues and eigenvectors (2x2 closed form)
  computeEigen();

  // Compute projected points
  computeProjection();
}

function computeEigen() {
  // For 2x2 symmetric matrix: eigenvalues from quadratic formula
  let a = covMatrix[0][0];
  let b = covMatrix[0][1];
  let c = covMatrix[1][1];

  let trace = a + c;
  let det = a * c - b * b;
  let disc = Math.sqrt(Math.max(0, trace * trace / 4 - det));

  eigenvalues[0] = trace / 2 + disc;
  eigenvalues[1] = trace / 2 - disc;

  // Eigenvectors
  if (Math.abs(b) > 0.0001) {
    // First eigenvector
    let v1x = eigenvalues[0] - c;
    let v1y = b;
    let len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    eigenvectors[0] = [v1x / len1, v1y / len1];

    // Second eigenvector (orthogonal)
    eigenvectors[1] = [-eigenvectors[0][1], eigenvectors[0][0]];
  } else {
    // Matrix is already diagonal
    if (a >= c) {
      eigenvectors[0] = [1, 0];
      eigenvectors[1] = [0, 1];
    } else {
      eigenvectors[0] = [0, 1];
      eigenvectors[1] = [1, 0];
      // Swap eigenvalues
      let temp = eigenvalues[0];
      eigenvalues[0] = eigenvalues[1];
      eigenvalues[1] = temp;
    }
  }
}

function computeProjection() {
  projectedPoints = [];

  for (let pt of centeredPoints) {
    if (numComponents === 1) {
      // Project onto first PC only
      let e1 = eigenvectors[0];
      let proj = pt[0] * e1[0] + pt[1] * e1[1];
      projectedPoints.push([proj * e1[0], proj * e1[1]]);
    } else {
      // Keep both components (no dimensionality reduction)
      projectedPoints.push([pt[0], pt[1]]);
    }
  }
}

function advanceToStep(targetStep) {
  if (targetStep > currentStep) {
    currentStep = targetStep;
    animProgress = 0;
    isAnimating = true;
  } else {
    currentStep = targetStep;
    animProgress = 1.0;
  }
}

function resetVisualization() {
  currentStep = 0;
  animProgress = 1.0;
  isAnimating = false;
}

function onComponentsChange() {
  numComponents = componentsSlider.value();
  computeProjection();
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
