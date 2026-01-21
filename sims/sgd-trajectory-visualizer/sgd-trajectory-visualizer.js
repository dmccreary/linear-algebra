// SGD Trajectory Visualizer MicroSim
// Understand how batch size affects SGD convergence behavior
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Plot area
let plotMarginLeft = 60;
let plotMarginRight = 180;
let plotMarginTop = 50;
let plotMarginBottom = 50;
let plotWidth, plotHeight;
let xMin = -4, xMax = 4;
let yMin = -4, yMax = 4;

// UI controls
let batchSizeSlider;
let learningRateSlider;
let stepButton, runButton, resetButton;
let showNoiseCheckbox;

// Optimization state
let batchSize = 32;
let learningRate = 0.1;
let isRunning = false;
let showNoise = true;

// Starting point
let startX = 3;
let startY = 3;

// Current position
let currentX, currentY;

// Path history
let path = [];
let maxPathLength = 200;

// Simulated data (for stochastic gradients)
let numDataPoints = 128;
let dataPoints = [];

// Iteration counter
let iteration = 0;

// Gradient noise visualization
let noiseVectors = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Generate random data points for stochastic simulation
  generateDataPoints();

  // Create controls
  // Row 1: Batch size slider
  batchSizeSlider = createSlider(1, 128, 32, 1);
  batchSizeSlider.position(sliderLeftMargin, drawHeight + 10);
  batchSizeSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  batchSizeSlider.input(() => {
    batchSize = batchSizeSlider.value();
  });

  // Row 2: Learning rate slider
  learningRateSlider = createSlider(0.01, 0.5, 0.1, 0.01);
  learningRateSlider.position(sliderLeftMargin, drawHeight + 40);
  learningRateSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  learningRateSlider.input(() => {
    learningRate = learningRateSlider.value();
  });

  // Buttons
  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 70);
  stepButton.mousePressed(stepSGD);

  runButton = createButton('Run');
  runButton.position(60, drawHeight + 70);
  runButton.mousePressed(toggleRun);

  resetButton = createButton('Reset');
  resetButton.position(110, drawHeight + 70);
  resetButton.mousePressed(resetOptimization);

  showNoiseCheckbox = createCheckbox('Show Noise', true);
  showNoiseCheckbox.position(170, drawHeight + 70);
  showNoiseCheckbox.changed(() => showNoise = showNoiseCheckbox.checked());

  resetOptimization();

  describe('SGD trajectory visualization showing how batch size affects convergence noise', LABEL);
}

function draw() {
  updateCanvasSize();
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;

  // Update parameters
  batchSize = batchSizeSlider.value();
  learningRate = learningRateSlider.value();

  // Draw backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Auto-run if enabled
  if (isRunning && iteration < 500) {
    stepSGD();
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('SGD Trajectory Visualizer', canvasWidth / 2 - 70, 10);

  // Draw contour plot
  drawContours();

  // Draw noise cloud if enabled
  if (showNoise) {
    drawNoiseCloud();
  }

  // Draw optimization path
  drawPath();

  // Draw gradient arrows
  drawGradientArrows();

  // Draw current point
  drawCurrentPoint();

  // Draw info panel
  drawInfoPanel();

  // Draw control labels
  drawControlLabels();
}

function generateDataPoints() {
  // Generate random "data points" that contribute to the loss
  // Each has its own optimum offset, creating stochastic gradient noise
  dataPoints = [];
  for (let i = 0; i < numDataPoints; i++) {
    dataPoints.push({
      offsetX: randomGaussian(0, 0.5),
      offsetY: randomGaussian(0, 0.5)
    });
  }
}

function drawContours() {
  // Draw contour lines of f(x,y) = 0.5*(x² + y²)
  let levels = [0.5, 1, 2, 4, 8, 16];

  stroke(180);
  strokeWeight(1);
  noFill();

  for (let level of levels) {
    beginShape();
    let r = sqrt(2 * level);
    let steps = 60;
    for (let i = 0; i <= steps; i++) {
      let angle = (i / steps) * TWO_PI;
      let x = r * cos(angle);
      let y = r * sin(angle);
      if (abs(x) <= xMax && abs(y) <= yMax) {
        vertex(mapX(x), mapY(y));
      }
    }
    endShape(CLOSE);
  }

  // Draw axes
  stroke(100);
  strokeWeight(1);
  line(mapX(xMin), mapY(0), mapX(xMax), mapY(0));
  line(mapX(0), mapY(yMin), mapX(0), mapY(yMax));
}

function drawNoiseCloud() {
  // Draw a cloud representing gradient variance
  let trueGrad = trueGradient(currentX, currentY);
  let variance = estimateVariance();

  fill(255, 200, 100, 30);
  noStroke();

  // Draw ellipse representing noise distribution
  let px = mapX(currentX);
  let py = mapY(currentY);
  let noiseScale = 50 * sqrt(variance);

  ellipse(px, py, noiseScale * 2, noiseScale * 2);

  // Draw sample gradient vectors
  if (noiseVectors.length > 0) {
    stroke(255, 150, 50, 100);
    strokeWeight(1);
    for (let v of noiseVectors) {
      let scale = 30;
      line(px, py, px - v.x * scale, py - v.y * scale);
    }
  }
}

function drawPath() {
  if (path.length < 2) return;

  // Draw path
  stroke(0, 100, 255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of path) {
    vertex(mapX(p.x), mapY(p.y));
  }
  endShape();

  // Draw path points
  fill(0, 100, 255, 150);
  noStroke();
  for (let i = Math.max(0, path.length - 50); i < path.length; i++) {
    let alpha = map(i, Math.max(0, path.length - 50), path.length, 50, 255);
    fill(0, 100, 255, alpha);
    ellipse(mapX(path[i].x), mapY(path[i].y), 5, 5);
  }
}

function drawGradientArrows() {
  let px = mapX(currentX);
  let py = mapY(currentY);

  // True gradient (gray, dashed conceptually)
  let trueGrad = trueGradient(currentX, currentY);
  let scale = 40;

  // Draw true gradient direction
  stroke(100, 100, 100);
  strokeWeight(2);
  let gx = px - trueGrad[0] * scale;
  let gy = py - trueGrad[1] * scale;
  line(px, py, gx, gy);

  // Arrow head for true gradient
  push();
  translate(gx, gy);
  let angle = atan2(gy - py, gx - px);
  rotate(angle);
  fill(100);
  noStroke();
  triangle(0, 0, 10, 4, 10, -4);
  pop();
}

function drawCurrentPoint() {
  // Current position
  fill(0, 100, 255);
  stroke('white');
  strokeWeight(2);
  ellipse(mapX(currentX), mapY(currentY), 16, 16);

  // Minimum marker
  fill(50, 200, 50);
  noStroke();
  ellipse(mapX(0), mapY(0), 10, 10);
}

function drawInfoPanel() {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = plotMarginTop;
  let panelW = plotMarginRight - 20;
  let panelH = 180;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);

  text('Iteration: ' + iteration, panelX + 10, panelY + 10);

  let fVal = objectiveFunction(currentX, currentY);
  text('f(x,y) = ' + fVal.toFixed(4), panelX + 10, panelY + 30);

  text('x = ' + currentX.toFixed(4), panelX + 10, panelY + 50);
  text('y = ' + currentY.toFixed(4), panelX + 10, panelY + 70);

  // Gradient variance estimate
  let variance = estimateVariance();
  text('Grad Variance:', panelX + 10, panelY + 95);
  text(variance.toFixed(4), panelX + 10, panelY + 112);

  // Effective batch
  textSize(11);
  text('Batch reduces', panelX + 10, panelY + 135);
  text('variance by ' + batchSize + 'x', panelX + 10, panelY + 150);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  let batchLabel = batchSize === 128 ? 'Full Batch' : batchSize.toString();
  text('Batch Size: ' + batchLabel, 10, drawHeight + 20);
  text('Learning Rate: ' + learningRate.toFixed(2), 10, drawHeight + 50);
}

// Objective function (average over all data points)
function objectiveFunction(x, y) {
  return 0.5 * (x * x + y * y);
}

// True gradient (expected value)
function trueGradient(x, y) {
  return [x, y];
}

// Stochastic gradient using a mini-batch
function stochasticGradient(x, y) {
  let gx = 0, gy = 0;

  // Sample a mini-batch
  let indices = [];
  for (let i = 0; i < batchSize; i++) {
    indices.push(floor(random(numDataPoints)));
  }

  // Compute gradient contribution from each sample
  for (let idx of indices) {
    let dp = dataPoints[idx];
    // Individual gradient with noise
    gx += (x - dp.offsetX);
    gy += (y - dp.offsetY);
  }

  // Average
  gx /= batchSize;
  gy /= batchSize;

  return [gx, gy];
}

// Estimate gradient variance based on batch size
function estimateVariance() {
  // Variance is approximately inversely proportional to batch size
  let baseVariance = 0.5; // Simulated base variance
  return baseVariance / batchSize;
}

function stepSGD() {
  iteration++;

  // Compute stochastic gradient
  let grad = stochasticGradient(currentX, currentY);

  // Store for noise visualization
  noiseVectors = [];
  for (let i = 0; i < min(10, batchSize); i++) {
    let idx = floor(random(numDataPoints));
    let dp = dataPoints[idx];
    noiseVectors.push({
      x: currentX - dp.offsetX,
      y: currentY - dp.offsetY
    });
  }

  // Update position
  currentX -= learningRate * grad[0];
  currentY -= learningRate * grad[1];

  // Add to path
  path.push({ x: currentX, y: currentY });
  if (path.length > maxPathLength) {
    path.shift();
  }

  // Check convergence
  if (abs(currentX) < 0.01 && abs(currentY) < 0.01) {
    // Allow some oscillation for SGD
  }
}

function toggleRun() {
  isRunning = !isRunning;
  runButton.html(isRunning ? 'Pause' : 'Run');
}

function resetOptimization() {
  iteration = 0;
  currentX = startX;
  currentY = startY;
  path = [{ x: currentX, y: currentY }];
  noiseVectors = [];
  isRunning = false;
  runButton.html('Run');
  generateDataPoints();
}

// Click to set starting point
function mousePressed() {
  if (mouseX >= plotMarginLeft && mouseX <= canvasWidth - plotMarginRight &&
    mouseY >= plotMarginTop && mouseY <= drawHeight - plotMarginBottom) {
    startX = unmapX(mouseX);
    startY = unmapY(mouseY);
    resetOptimization();
  }
}

// Coordinate mapping
function mapX(x) {
  return plotMarginLeft + (x - xMin) / (xMax - xMin) * plotWidth;
}

function mapY(y) {
  return drawHeight - plotMarginBottom - (y - yMin) / (yMax - yMin) * plotHeight;
}

function unmapX(px) {
  return xMin + (px - plotMarginLeft) / plotWidth * (xMax - xMin);
}

function unmapY(py) {
  return yMin + (drawHeight - plotMarginBottom - py) / plotHeight * (yMax - yMin);
}

// Responsive design
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  batchSizeSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  learningRateSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
