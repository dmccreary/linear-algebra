// Newton vs Gradient Descent Comparison MicroSim
// Compare convergence behavior of gradient descent and Newton's method
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
let conditionSlider;
let learningRateSlider;
let stepButton, runButton, resetButton;

// Optimization state
let conditionNumber = 10;
let learningRate = 0.05;
let isRunning = false;

// Starting point
let startX = 3.5;
let startY = 3.5;

// Gradient descent path
let gdPath = [];
let gdX, gdY;

// Newton path
let newtonPath = [];
let newtonX, newtonY;

// Iteration counter
let iteration = 0;
let maxIterations = 100;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Create controls
  // Row 1: Condition number slider
  conditionSlider = createSlider(1, 100, 10, 1);
  conditionSlider.position(sliderLeftMargin, drawHeight + 10);
  conditionSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  conditionSlider.input(resetOptimization);

  // Row 2: Learning rate slider
  learningRateSlider = createSlider(0.001, 0.2, 0.05, 0.001);
  learningRateSlider.position(sliderLeftMargin, drawHeight + 40);
  learningRateSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  learningRateSlider.input(resetOptimization);

  // Buttons
  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 70);
  stepButton.mousePressed(stepOptimization);

  runButton = createButton('Run');
  runButton.position(60, drawHeight + 70);
  runButton.mousePressed(toggleRun);

  resetButton = createButton('Reset');
  resetButton.position(110, drawHeight + 70);
  resetButton.mousePressed(resetOptimization);

  resetOptimization();

  describe('Comparison of gradient descent and Newton method convergence on elliptical contours', LABEL);
}

function draw() {
  updateCanvasSize();
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;

  // Draw backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Update parameters
  conditionNumber = conditionSlider.value();
  learningRate = learningRateSlider.value();

  // Auto-run if enabled
  if (isRunning && iteration < maxIterations) {
    stepOptimization();
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Newton vs Gradient Descent Comparison', canvasWidth / 2 - 70, 10);

  // Draw contour plot
  drawContours();

  // Draw optimization paths
  drawPaths();

  // Draw current points
  drawCurrentPoints();

  // Draw info panel
  drawInfoPanel();

  // Draw control labels
  drawControlLabels();
}

function drawContours() {
  // Draw contour lines of f(x,y) = x²/2 + (κ/2)y²
  // where κ is the condition number
  let levels = [0.5, 1, 2, 4, 8, 16, 32];

  stroke(180);
  strokeWeight(1);
  noFill();

  for (let level of levels) {
    beginShape();
    let steps = 100;
    for (let i = 0; i <= steps; i++) {
      let angle = (i / steps) * TWO_PI;
      // For f = x²/2 + κy²/2 = c
      // x = sqrt(2c) * cos(θ)
      // y = sqrt(2c/κ) * sin(θ)
      let a = sqrt(2 * level);
      let b = sqrt(2 * level / conditionNumber);
      let x = a * cos(angle);
      let y = b * sin(angle);

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

  // Axis labels
  fill('black');
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('x', mapX(xMax) - 10, mapY(0) + 5);
  textAlign(RIGHT, CENTER);
  text('y', mapX(0) - 5, mapY(yMax) + 10);
}

function drawPaths() {
  // Draw gradient descent path (blue)
  if (gdPath.length > 1) {
    stroke(0, 100, 255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of gdPath) {
      vertex(mapX(p.x), mapY(p.y));
    }
    endShape();

    // Draw points along path
    fill(0, 100, 255);
    noStroke();
    for (let p of gdPath) {
      ellipse(mapX(p.x), mapY(p.y), 6, 6);
    }
  }

  // Draw Newton path (orange)
  if (newtonPath.length > 1) {
    stroke(255, 150, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of newtonPath) {
      vertex(mapX(p.x), mapY(p.y));
    }
    endShape();

    // Draw points along path
    fill(255, 150, 0);
    noStroke();
    for (let p of newtonPath) {
      ellipse(mapX(p.x), mapY(p.y), 6, 6);
    }
  }
}

function drawCurrentPoints() {
  // Current GD point
  fill(0, 100, 255);
  stroke('white');
  strokeWeight(2);
  ellipse(mapX(gdX), mapY(gdY), 14, 14);

  // Current Newton point
  fill(255, 150, 0);
  stroke('white');
  ellipse(mapX(newtonX), mapY(newtonY), 14, 14);

  // Minimum marker
  fill(50, 200, 50);
  noStroke();
  ellipse(mapX(0), mapY(0), 10, 10);
}

function drawInfoPanel() {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = plotMarginTop;
  let panelW = plotMarginRight - 20;
  let panelH = 200;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text('Iteration: ' + iteration, panelX + 10, panelY + 10);

  // Gradient Descent info
  fill(0, 100, 255);
  textSize(13);
  text('Gradient Descent', panelX + 10, panelY + 40);
  fill('black');
  textSize(11);
  let gdF = objectiveFunction(gdX, gdY);
  text('f = ' + gdF.toFixed(6), panelX + 10, panelY + 58);
  text('x = ' + gdX.toFixed(4), panelX + 10, panelY + 73);
  text('y = ' + gdY.toFixed(4), panelX + 10, panelY + 88);

  // Newton info
  fill(255, 150, 0);
  textSize(13);
  text("Newton's Method", panelX + 10, panelY + 115);
  fill('black');
  textSize(11);
  let newtonF = objectiveFunction(newtonX, newtonY);
  text('f = ' + newtonF.toFixed(6), panelX + 10, panelY + 133);
  text('x = ' + newtonX.toFixed(4), panelX + 10, panelY + 148);
  text('y = ' + newtonY.toFixed(4), panelX + 10, panelY + 163);

  // Legend
  textSize(10);
  fill(50, 200, 50);
  ellipse(panelX + 15, panelY + 188, 8, 8);
  fill('black');
  text('Minimum', panelX + 25, panelY + 183);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  text('Condition #: ' + conditionNumber, 10, drawHeight + 20);
  text('Learning Rate: ' + learningRate.toFixed(3), 10, drawHeight + 50);
}

// Objective function: f(x,y) = x²/2 + (κ/2)y²
function objectiveFunction(x, y) {
  return 0.5 * x * x + 0.5 * conditionNumber * y * y;
}

// Gradient: [x, κy]
function gradient(x, y) {
  return [x, conditionNumber * y];
}

// Hessian inverse: [[1, 0], [0, 1/κ]]
function newtonStep(x, y) {
  let g = gradient(x, y);
  // Newton direction = -H⁻¹ * g = [-g[0], -g[1]/κ]
  return [-g[0], -g[1] / conditionNumber];
}

function stepOptimization() {
  if (iteration >= maxIterations) return;

  iteration++;

  // Gradient descent step
  let g = gradient(gdX, gdY);
  gdX -= learningRate * g[0];
  gdY -= learningRate * g[1];
  gdPath.push({ x: gdX, y: gdY });

  // Newton step (converges in 1 step for quadratics!)
  if (newtonPath.length < 2) {
    let step = newtonStep(newtonX, newtonY);
    newtonX += step[0];
    newtonY += step[1];
    newtonPath.push({ x: newtonX, y: newtonY });
  }

  // Check convergence
  if (abs(gdX) < 0.001 && abs(gdY) < 0.001) {
    isRunning = false;
    runButton.html('Run');
  }
}

function toggleRun() {
  isRunning = !isRunning;
  runButton.html(isRunning ? 'Pause' : 'Run');
}

function resetOptimization() {
  iteration = 0;
  gdX = startX;
  gdY = startY;
  newtonX = startX;
  newtonY = startY;
  gdPath = [{ x: gdX, y: gdY }];
  newtonPath = [{ x: newtonX, y: newtonY }];
  isRunning = false;
  runButton.html('Run');
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
  conditionSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  learningRateSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
