// Linear Regression Interactive Visualizer MicroSim
// Understand linear regression by minimizing squared errors
// Learning objective: Understand linear regression as finding the best-fit line by minimizing squared errors

let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Data points (draggable)
let dataPoints = [];
let numPoints = 20;
let draggedPoint = -1;

// Regression parameters
let slope = 1;        // weight w
let intercept = 0.5;  // bias b
let optimalSlope = 0;
let optimalIntercept = 0;

// Loss and statistics
let currentLoss = 0;
let optimalLoss = 0;
let rSquared = 0;

// UI elements
let wSlider, bSlider;
let fitButton, resetButton, addNoiseButton;
let showResidualsCheckbox, showLossSurfaceCheckbox;

// Loss surface for visualization
let lossSurfaceData = [];
let surfaceResolution = 40;
let wRange = [-2, 4];
let bRange = [-2, 4];

// Plot boundaries
let plotLeft, plotRight, plotTop, plotBottom;
let xMin = 0, xMax = 10, yMin = -2, yMax = 12;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const container = document.querySelector('main');
  canvas.parent(container);

  // Initialize data with linear relationship + noise
  initializeData();

  // Compute optimal fit
  computeOLSFit();

  // Compute loss surface
  computeLossSurface();

  // Create controls
  let row1Y = drawHeight + 15;
  let row2Y = drawHeight + 50;

  // Weight slider (w)
  wSlider = createSlider(-2, 4, slope, 0.05);
  wSlider.parent(container);
  wSlider.position(60, row1Y);
  wSlider.size(120);
  wSlider.input(updateFromSliders);

  // Bias slider (b)
  bSlider = createSlider(-2, 4, intercept, 0.05);
  bSlider.parent(container);
  bSlider.position(240, row1Y);
  bSlider.size(120);
  bSlider.input(updateFromSliders);

  // Checkboxes
  showResidualsCheckbox = createCheckbox('Residuals', true);
  showResidualsCheckbox.parent(container);
  showResidualsCheckbox.position(380, row1Y - 3);
  showResidualsCheckbox.style('font-size', '12px');

  showLossSurfaceCheckbox = createCheckbox('Loss Surface', true);
  showLossSurfaceCheckbox.parent(container);
  showLossSurfaceCheckbox.position(470, row1Y - 3);
  showLossSurfaceCheckbox.style('font-size', '12px');

  // Buttons
  fitButton = createButton('Fit OLS');
  fitButton.parent(container);
  fitButton.position(580, row1Y - 3);
  fitButton.mousePressed(fitOLS);
  fitButton.style('background-color', '#4CAF50');
  fitButton.style('color', 'white');
  fitButton.style('border', 'none');
  fitButton.style('padding', '5px 15px');
  fitButton.style('cursor', 'pointer');

  addNoiseButton = createButton('Add Noise');
  addNoiseButton.parent(container);
  addNoiseButton.position(670, row1Y - 3);
  addNoiseButton.mousePressed(addNoise);

  resetButton = createButton('Reset');
  resetButton.parent(container);
  resetButton.position(760, row1Y - 3);
  resetButton.mousePressed(resetSimulation);

  describe('Linear regression interactive visualizer with scatter plot, residuals, and loss surface', LABEL);
}

function draw() {
  updateCanvasSize();
  background(245);

  // Define plot areas
  definePlotAreas();

  // Draw scatter plot with line
  drawScatterPlot();

  // Draw loss surface (mini plot)
  if (showLossSurfaceCheckbox.checked()) {
    drawLossSurface();
  }

  // Draw statistics panel
  drawStatsPanel();

  // Draw control area
  drawControlArea();
}

function definePlotAreas() {
  plotLeft = 70;
  plotRight = showLossSurfaceCheckbox.checked() ? canvasWidth - 280 : canvasWidth - 180;
  plotTop = 50;
  plotBottom = drawHeight - 30;
}

function drawScatterPlot() {
  let plotWidth = plotRight - plotLeft;
  let plotHeight = plotBottom - plotTop;

  // Draw plot background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(plotLeft, plotTop, plotWidth, plotHeight);

  // Draw grid
  stroke(235);
  strokeWeight(1);
  for (let x = 0; x <= 10; x += 2) {
    let px = map(x, xMin, xMax, plotLeft, plotRight);
    line(px, plotTop, px, plotBottom);
  }
  for (let y = 0; y <= 12; y += 2) {
    let py = map(y, yMin, yMax, plotBottom, plotTop);
    line(plotLeft, py, plotRight, py);
  }

  // Draw axes
  stroke(100);
  strokeWeight(2);
  let xAxisY = map(0, yMin, yMax, plotBottom, plotTop);
  if (xAxisY >= plotTop && xAxisY <= plotBottom) {
    line(plotLeft, xAxisY, plotRight, xAxisY);
  }
  let yAxisX = map(0, xMin, xMax, plotLeft, plotRight);
  if (yAxisX >= plotLeft && yAxisX <= plotRight) {
    line(yAxisX, plotTop, yAxisX, plotBottom);
  }

  // Axis labels
  fill(80);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  for (let x = 0; x <= 10; x += 2) {
    let px = map(x, xMin, xMax, plotLeft, plotRight);
    text(x, px, plotBottom + 5);
  }
  textAlign(RIGHT, CENTER);
  for (let y = 0; y <= 12; y += 2) {
    let py = map(y, yMin, yMax, plotBottom, plotTop);
    text(y, plotLeft - 8, py);
  }

  // Axis titles
  textSize(14);
  textAlign(CENTER, TOP);
  text('x', (plotLeft + plotRight) / 2, plotBottom + 20);

  push();
  translate(plotLeft - 45, (plotTop + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('y', 0, 0);
  pop();

  // Draw residuals if enabled
  if (showResidualsCheckbox.checked()) {
    drawResiduals();
  }

  // Draw fitted line
  stroke(220, 50, 50);
  strokeWeight(2);
  let x1 = xMin;
  let y1 = slope * x1 + intercept;
  let x2 = xMax;
  let y2 = slope * x2 + intercept;

  let px1 = map(x1, xMin, xMax, plotLeft, plotRight);
  let py1 = map(y1, yMin, yMax, plotBottom, plotTop);
  let px2 = map(x2, xMin, xMax, plotLeft, plotRight);
  let py2 = map(y2, yMin, yMax, plotBottom, plotTop);

  // Clip line to plot area
  py1 = constrain(py1, plotTop, plotBottom);
  py2 = constrain(py2, plotTop, plotBottom);
  line(px1, py1, px2, py2);

  // Draw optimal line (dashed, lighter)
  if (abs(slope - optimalSlope) > 0.01 || abs(intercept - optimalIntercept) > 0.01) {
    stroke(50, 180, 50, 150);
    strokeWeight(1.5);
    y1 = optimalSlope * x1 + optimalIntercept;
    y2 = optimalSlope * x2 + optimalIntercept;
    py1 = map(y1, yMin, yMax, plotBottom, plotTop);
    py2 = map(y2, yMin, yMax, plotBottom, plotTop);
    py1 = constrain(py1, plotTop, plotBottom);
    py2 = constrain(py2, plotTop, plotBottom);
    drawDashedLine(px1, py1, px2, py2);
  }

  // Draw data points
  for (let i = 0; i < dataPoints.length; i++) {
    let pt = dataPoints[i];
    let px = map(pt.x, xMin, xMax, plotLeft, plotRight);
    let py = map(pt.y, yMin, yMax, plotBottom, plotTop);

    if (i === draggedPoint) {
      fill(80, 80, 220);
      stroke(40, 40, 180);
      strokeWeight(2);
      ellipse(px, py, 16, 16);
    } else {
      fill(50, 100, 200);
      stroke(30, 60, 160);
      strokeWeight(1.5);
      ellipse(px, py, 12, 12);
    }
  }

  // Title
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text('Linear Regression Interactive Visualizer', canvasWidth / 2, 10);

  // Line equation label
  textSize(14);
  textAlign(LEFT, TOP);
  fill(220, 50, 50);
  let eqText = 'y = ' + nf(slope, 1, 2) + 'x + ' + nf(intercept, 1, 2);
  text(eqText, plotLeft + 10, plotTop + 10);
}

function drawResiduals() {
  stroke(50, 180, 50, 180);
  strokeWeight(1.5);

  for (let pt of dataPoints) {
    let px = map(pt.x, xMin, xMax, plotLeft, plotRight);
    let py = map(pt.y, yMin, yMax, plotBottom, plotTop);
    let predictedY = slope * pt.x + intercept;
    let pPredY = map(predictedY, yMin, yMax, plotBottom, plotTop);

    // Constrain to plot area
    pPredY = constrain(pPredY, plotTop, plotBottom);

    // Draw vertical residual line
    drawDashedLine(px, py, px, pPredY);

    // Draw small square for squared error visualization
    let residualHeight = abs(py - pPredY);
    if (residualHeight > 3 && residualHeight < 50) {
      noStroke();
      fill(50, 180, 50, 40);
      let sqSize = min(residualHeight, 20);
      rect(px - sqSize/2, min(py, pPredY), sqSize, sqSize);
    }
  }
}

function drawDashedLine(x1, y1, x2, y2) {
  let steps = 10;
  for (let i = 0; i < steps; i += 2) {
    let t1 = i / steps;
    let t2 = (i + 1) / steps;
    line(
      lerp(x1, x2, t1), lerp(y1, y2, t1),
      lerp(x1, x2, t2), lerp(y1, y2, t2)
    );
  }
}

function drawLossSurface() {
  let surfaceLeft = canvasWidth - 270;
  let surfaceTop = 50;
  let surfaceWidth = 180;
  let surfaceHeight = 180;

  // Draw border
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(surfaceLeft, surfaceTop, surfaceWidth, surfaceHeight);

  // Draw loss surface as heatmap
  let cellW = surfaceWidth / surfaceResolution;
  let cellH = surfaceHeight / surfaceResolution;

  noStroke();
  for (let i = 0; i < surfaceResolution; i++) {
    for (let j = 0; j < surfaceResolution; j++) {
      let loss = lossSurfaceData[i][j];
      // Map loss to color (log scale for better visualization)
      let logLoss = log(loss + 1);
      let maxLogLoss = log(500);
      let c = map(logLoss, 0, maxLogLoss, 0, 1);
      c = constrain(c, 0, 1);

      // Color gradient: blue (low) -> white -> red (high)
      let col;
      if (c < 0.5) {
        col = lerpColor(color(50, 100, 200), color(255, 255, 255), c * 2);
      } else {
        col = lerpColor(color(255, 255, 255), color(200, 50, 50), (c - 0.5) * 2);
      }

      fill(col);
      rect(surfaceLeft + i * cellW, surfaceTop + (surfaceResolution - 1 - j) * cellH, cellW + 1, cellH + 1);
    }
  }

  // Draw contour lines
  stroke(100, 100, 100, 100);
  strokeWeight(0.5);
  let contourLevels = [10, 50, 100, 200, 300];
  for (let level of contourLevels) {
    drawContour(surfaceLeft, surfaceTop, surfaceWidth, surfaceHeight, level);
  }

  // Mark current position
  let currWPos = map(slope, wRange[0], wRange[1], surfaceLeft, surfaceLeft + surfaceWidth);
  let currBPos = map(intercept, bRange[0], bRange[1], surfaceTop + surfaceHeight, surfaceTop);

  stroke(220, 50, 50);
  strokeWeight(2);
  fill(220, 50, 50);
  ellipse(currWPos, currBPos, 10, 10);

  // Mark optimal position
  let optWPos = map(optimalSlope, wRange[0], wRange[1], surfaceLeft, surfaceLeft + surfaceWidth);
  let optBPos = map(optimalIntercept, bRange[0], bRange[1], surfaceTop + surfaceHeight, surfaceTop);

  stroke(50, 180, 50);
  strokeWeight(2);
  fill(50, 180, 50);
  ellipse(optWPos, optBPos, 8, 8);

  // Labels
  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('Loss Surface L(w, b)', surfaceLeft + surfaceWidth / 2, surfaceTop - 20);

  textSize(10);
  textAlign(CENTER, TOP);
  text('w (slope)', surfaceLeft + surfaceWidth / 2, surfaceTop + surfaceHeight + 5);

  push();
  translate(surfaceLeft - 15, surfaceTop + surfaceHeight / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('b (intercept)', 0, 0);
  pop();

  // Axis ticks
  textSize(9);
  textAlign(CENTER, TOP);
  text(wRange[0], surfaceLeft, surfaceTop + surfaceHeight + 18);
  text(wRange[1], surfaceLeft + surfaceWidth, surfaceTop + surfaceHeight + 18);

  textAlign(RIGHT, CENTER);
  text(bRange[0], surfaceLeft - 5, surfaceTop + surfaceHeight);
  text(bRange[1], surfaceLeft - 5, surfaceTop);

  // Legend
  textSize(10);
  textAlign(LEFT, TOP);
  fill(220, 50, 50);
  text('Current', surfaceLeft + 5, surfaceTop + surfaceHeight + 35);
  fill(50, 180, 50);
  text('Optimal', surfaceLeft + 70, surfaceTop + surfaceHeight + 35);
}

function drawContour(left, top, w, h, level) {
  // Simple marching squares for contour
  let cellW = w / surfaceResolution;
  let cellH = h / surfaceResolution;

  for (let i = 0; i < surfaceResolution - 1; i++) {
    for (let j = 0; j < surfaceResolution - 1; j++) {
      let v00 = lossSurfaceData[i][j];
      let v10 = lossSurfaceData[i + 1][j];
      let v01 = lossSurfaceData[i][j + 1];
      let v11 = lossSurfaceData[i + 1][j + 1];

      // Check if contour passes through this cell
      let above00 = v00 > level;
      let above10 = v10 > level;
      let above01 = v01 > level;
      let above11 = v11 > level;

      if (above00 !== above10 || above00 !== above01 || above00 !== above11) {
        let x = left + (i + 0.5) * cellW;
        let y = top + (surfaceResolution - 1 - j - 0.5) * cellH;
        point(x, y);
      }
    }
  }
}

function drawStatsPanel() {
  let panelLeft = canvasWidth - 270;
  let panelTop = 250;
  let panelWidth = 180;
  let panelHeight = showLossSurfaceCheckbox.checked() ? 170 : 180;

  if (!showLossSurfaceCheckbox.checked()) {
    panelLeft = canvasWidth - 170;
    panelTop = 50;
  }

  fill(255, 255, 255, 245);
  stroke(200);
  strokeWeight(1);
  rect(panelLeft, panelTop, panelWidth, panelHeight, 8);

  fill(0);
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  text('Statistics:', panelLeft + 10, panelTop + 10);

  textSize(11);

  // Current parameters
  fill(220, 50, 50);
  text('Current:', panelLeft + 10, panelTop + 35);
  fill(80);
  text('w = ' + nf(slope, 1, 3), panelLeft + 70, panelTop + 35);
  text('b = ' + nf(intercept, 1, 3), panelLeft + 70, panelTop + 52);

  // Optimal parameters
  fill(50, 180, 50);
  text('Optimal:', panelLeft + 10, panelTop + 75);
  fill(80);
  text('w = ' + nf(optimalSlope, 1, 3), panelLeft + 70, panelTop + 75);
  text('b = ' + nf(optimalIntercept, 1, 3), panelLeft + 70, panelTop + 92);

  // Loss values
  fill(0);
  textSize(12);
  text('Loss (MSE):', panelLeft + 10, panelTop + 115);
  textSize(11);
  fill(220, 50, 50);
  text('Current: ' + nf(currentLoss, 1, 3), panelLeft + 10, panelTop + 133);
  fill(50, 180, 50);
  text('Optimal: ' + nf(optimalLoss, 1, 3), panelLeft + 10, panelTop + 148);

  // R-squared
  fill(0);
  textSize(11);
  text('R\u00B2 = ' + nf(rSquared, 1, 4), panelLeft + 100, panelTop + 133);
}

function drawControlArea() {
  // Control area background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Labels
  noStroke();
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('w:', 10, drawHeight + 25);
  text('b:', 195, drawHeight + 25);

  // Show current values
  textSize(10);
  fill(100);
  text(nf(wSlider.value(), 1, 2), 185, drawHeight + 25);
  text(nf(bSlider.value(), 1, 2), 365, drawHeight + 25);

  // Help text
  textSize(10);
  fill(120);
  textAlign(LEFT, CENTER);
  text('Drag data points | Adjust w, b sliders | Click "Fit OLS" for optimal solution', 10, drawHeight + 60);

  // Normal equation display
  textAlign(RIGHT, CENTER);
  textSize(10);
  fill(80);
  text('Normal Equations: (X\u1D40X)\u03B2 = X\u1D40y', canvasWidth - 10, drawHeight + 60);
}

// =====================
// DATA & COMPUTATION
// =====================

function initializeData() {
  dataPoints = [];

  // Generate data with linear relationship y = 0.8x + 1 + noise
  let trueSlope = 0.8;
  let trueIntercept = 1;
  let noiseLevel = 1.5;

  for (let i = 0; i < numPoints; i++) {
    let x = map(i, 0, numPoints - 1, 0.5, 9.5) + random(-0.3, 0.3);
    let y = trueSlope * x + trueIntercept + randomGaussian(0, noiseLevel);

    dataPoints.push({
      x: constrain(x, 0.1, 9.9),
      y: constrain(y, yMin + 0.5, yMax - 0.5)
    });
  }
}

function computeOLSFit() {
  // Ordinary Least Squares using normal equations
  // y = wx + b
  // Minimize sum of (y_i - (wx_i + b))^2

  let n = dataPoints.length;
  if (n === 0) return;

  // Compute sums
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let pt of dataPoints) {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumX2 += pt.x * pt.x;
    sumY2 += pt.y * pt.y;
  }

  let meanX = sumX / n;
  let meanY = sumY / n;

  // Normal equations solution
  let denom = n * sumX2 - sumX * sumX;

  if (abs(denom) < 0.0001) {
    optimalSlope = 0;
    optimalIntercept = meanY;
  } else {
    optimalSlope = (n * sumXY - sumX * sumY) / denom;
    optimalIntercept = (sumY - optimalSlope * sumX) / n;
  }

  // Compute optimal loss
  optimalLoss = computeLoss(optimalSlope, optimalIntercept);

  // Compute R-squared
  let ssTot = 0, ssRes = 0;
  for (let pt of dataPoints) {
    ssTot += (pt.y - meanY) * (pt.y - meanY);
    let pred = optimalSlope * pt.x + optimalIntercept;
    ssRes += (pt.y - pred) * (pt.y - pred);
  }

  rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 1;

  // Update current loss
  currentLoss = computeLoss(slope, intercept);
}

function computeLoss(w, b) {
  let loss = 0;
  for (let pt of dataPoints) {
    let predicted = w * pt.x + b;
    let residual = pt.y - predicted;
    loss += residual * residual;
  }
  return loss / dataPoints.length; // MSE
}

function computeLossSurface() {
  lossSurfaceData = [];

  for (let i = 0; i < surfaceResolution; i++) {
    lossSurfaceData[i] = [];
    let w = map(i, 0, surfaceResolution - 1, wRange[0], wRange[1]);

    for (let j = 0; j < surfaceResolution; j++) {
      let b = map(j, 0, surfaceResolution - 1, bRange[0], bRange[1]);
      lossSurfaceData[i][j] = computeLoss(w, b) * dataPoints.length; // Total SSE
    }
  }
}

// =====================
// EVENT HANDLERS
// =====================

function updateFromSliders() {
  slope = wSlider.value();
  intercept = bSlider.value();
  currentLoss = computeLoss(slope, intercept);
}

function fitOLS() {
  // Animate to optimal solution
  slope = optimalSlope;
  intercept = optimalIntercept;
  wSlider.value(slope);
  bSlider.value(intercept);
  currentLoss = optimalLoss;
}

function addNoise() {
  for (let pt of dataPoints) {
    pt.y += randomGaussian(0, 0.5);
    pt.y = constrain(pt.y, yMin + 0.5, yMax - 0.5);
  }
  computeOLSFit();
  computeLossSurface();
}

function resetSimulation() {
  slope = 1;
  intercept = 0.5;
  wSlider.value(slope);
  bSlider.value(intercept);

  initializeData();
  computeOLSFit();
  computeLossSurface();
}

// =====================
// MOUSE INTERACTION
// =====================

function mousePressed() {
  // Check if clicking on a data point
  for (let i = 0; i < dataPoints.length; i++) {
    let pt = dataPoints[i];
    let px = map(pt.x, xMin, xMax, plotLeft, plotRight);
    let py = map(pt.y, yMin, yMax, plotBottom, plotTop);

    if (dist(mouseX, mouseY, px, py) < 12) {
      draggedPoint = i;
      return;
    }
  }

  // Check if clicking in plot area to add a point
  if (mouseX > plotLeft && mouseX < plotRight && mouseY > plotTop && mouseY < plotBottom) {
    // Double-click could add a point (optional feature)
  }
}

function mouseDragged() {
  if (draggedPoint >= 0) {
    let newX = map(mouseX, plotLeft, plotRight, xMin, xMax);
    let newY = map(mouseY, plotBottom, plotTop, yMin, yMax);

    dataPoints[draggedPoint].x = constrain(newX, 0.1, 9.9);
    dataPoints[draggedPoint].y = constrain(newY, yMin + 0.5, yMax - 0.5);

    computeOLSFit();
    computeLossSurface();
    currentLoss = computeLoss(slope, intercept);
  }
}

function mouseReleased() {
  draggedPoint = -1;
}

// =====================
// UTILITIES
// =====================

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition controls
  let row1Y = drawHeight + 15;
  wSlider.position(60, row1Y);
  bSlider.position(240, row1Y);
  showResidualsCheckbox.position(380, row1Y - 3);
  showLossSurfaceCheckbox.position(470, row1Y - 3);
  fitButton.position(580, row1Y - 3);
  addNoiseButton.position(670, row1Y - 3);
  resetButton.position(760, row1Y - 3);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(700, floor(container.offsetWidth));
  }
  canvasHeight = drawHeight + controlHeight;
}
