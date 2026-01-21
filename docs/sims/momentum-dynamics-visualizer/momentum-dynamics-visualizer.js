// Momentum Dynamics Visualizer MicroSim
// Visualize how momentum accumulates and dampens oscillations
// Compares SGD, Momentum, and Nesterov methods
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 750;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 200;
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
let momentumSlider;
let learningRateSlider;
let stepButton, runButton, resetButton;
let showVelocityCheckbox;

// Parameters
let momentum = 0.9;
let learningRate = 0.05;
let conditionNumber = 20;
let isRunning = false;
let showVelocity = true;

// Starting point
let startX = 3.5;
let startY = 3.5;

// Optimizer states
let optimizers = {
  sgd: { x: 0, y: 0, path: [], color: null, name: 'SGD' },
  momentum: { x: 0, y: 0, vx: 0, vy: 0, path: [], color: null, name: 'Momentum' },
  nesterov: { x: 0, y: 0, vx: 0, vy: 0, path: [], color: null, name: 'Nesterov' }
};

let iteration = 0;
let maxPathLength = 150;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Set colors
  optimizers.sgd.color = color(0, 100, 255);
  optimizers.momentum.color = color(50, 180, 50);
  optimizers.nesterov.color = color(255, 150, 0);

  // Create controls
  // Row 1: Momentum coefficient slider
  momentumSlider = createSlider(0, 0.99, 0.9, 0.01);
  momentumSlider.position(sliderLeftMargin, drawHeight + 10);
  momentumSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  momentumSlider.input(resetOptimization);

  // Row 2: Learning rate slider
  learningRateSlider = createSlider(0.001, 0.1, 0.05, 0.001);
  learningRateSlider.position(sliderLeftMargin, drawHeight + 40);
  learningRateSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  learningRateSlider.input(resetOptimization);

  // Buttons
  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 70);
  stepButton.mousePressed(stepOptimizers);

  runButton = createButton('Run');
  runButton.position(60, drawHeight + 70);
  runButton.mousePressed(toggleRun);

  resetButton = createButton('Reset');
  resetButton.position(110, drawHeight + 70);
  resetButton.mousePressed(resetOptimization);

  showVelocityCheckbox = createCheckbox('Velocity Vectors', true);
  showVelocityCheckbox.position(170, drawHeight + 70);
  showVelocityCheckbox.changed(() => showVelocity = showVelocityCheckbox.checked());

  resetOptimization();

  describe('Comparison of SGD, Momentum, and Nesterov optimization showing velocity accumulation', LABEL);
}

function draw() {
  updateCanvasSize();
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;

  // Update parameters
  momentum = momentumSlider.value();
  learningRate = learningRateSlider.value();

  // Draw backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Auto-run if enabled
  if (isRunning && iteration < 300) {
    stepOptimizers();
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Momentum Dynamics Visualizer', canvasWidth / 2 - 70, 10);

  // Draw contour plot (ill-conditioned quadratic)
  drawContours();

  // Draw paths for all optimizers
  for (let key in optimizers) {
    drawPath(optimizers[key]);
  }

  // Draw current points and velocity vectors
  for (let key in optimizers) {
    drawOptimizer(optimizers[key], key !== 'sgd');
  }

  // Draw minimum marker
  fill(50, 200, 50);
  noStroke();
  ellipse(mapX(0), mapY(0), 10, 10);

  // Draw info panel
  drawInfoPanel();

  // Draw control labels
  drawControlLabels();
}

function drawContours() {
  // Draw contour lines of f(x,y) = 0.5*x² + 0.5*κ*y²
  let levels = [0.5, 1, 2, 4, 8, 16, 32];

  stroke(180);
  strokeWeight(1);
  noFill();

  for (let level of levels) {
    beginShape();
    let steps = 80;
    for (let i = 0; i <= steps; i++) {
      let angle = (i / steps) * TWO_PI;
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
  line(mapX(xMin), mapY(0), mapX(xMax), mapY(0));
  line(mapX(0), mapY(yMin), mapX(0), mapY(yMax));
}

function drawPath(opt) {
  if (opt.path.length < 2) return;

  stroke(opt.color);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of opt.path) {
    vertex(mapX(p.x), mapY(p.y));
  }
  endShape();

  // Draw path points
  noStroke();
  for (let i = Math.max(0, opt.path.length - 30); i < opt.path.length; i++) {
    let alpha = map(i, Math.max(0, opt.path.length - 30), opt.path.length, 50, 200);
    fill(red(opt.color), green(opt.color), blue(opt.color), alpha);
    ellipse(mapX(opt.path[i].x), mapY(opt.path[i].y), 4, 4);
  }
}

function drawOptimizer(opt, hasVelocity) {
  let px = mapX(opt.x);
  let py = mapY(opt.y);

  // Draw velocity vector if applicable
  if (showVelocity && hasVelocity && (abs(opt.vx) > 0.001 || abs(opt.vy) > 0.001)) {
    let vScale = 200;
    let vx = opt.vx * vScale;
    let vy = opt.vy * vScale;

    // Adjust for plot scaling
    let pxEnd = mapX(opt.x + opt.vx * 3);
    let pyEnd = mapY(opt.y + opt.vy * 3);

    stroke(opt.color);
    strokeWeight(3);
    line(px, py, pxEnd, pyEnd);

    // Arrow head
    push();
    translate(pxEnd, pyEnd);
    let angle = atan2(pyEnd - py, pxEnd - px);
    rotate(angle);
    fill(opt.color);
    noStroke();
    triangle(0, 0, -10, 5, -10, -5);
    pop();
  }

  // Draw current point
  fill(opt.color);
  stroke('white');
  strokeWeight(2);
  ellipse(px, py, 14, 14);
}

function drawInfoPanel() {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = plotMarginTop;
  let panelW = plotMarginRight - 20;
  let panelH = 250;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  text('Iteration: ' + iteration, panelX + 10, panelY + 10);

  // Info for each optimizer
  let yOffset = 35;
  for (let key in optimizers) {
    let opt = optimizers[key];
    fill(opt.color);
    textSize(12);
    text(opt.name, panelX + 10, panelY + yOffset);

    fill('black');
    textSize(10);
    let fVal = objectiveFunction(opt.x, opt.y);
    text('f = ' + fVal.toFixed(4), panelX + 10, panelY + yOffset + 15);
    text('(' + opt.x.toFixed(2) + ', ' + opt.y.toFixed(2) + ')', panelX + 10, panelY + yOffset + 28);

    yOffset += 55;
  }

  // Legend
  textSize(10);
  fill(80);
  text('Condition # = ' + conditionNumber, panelX + 10, panelY + 220);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  text('Momentum (\u03B2): ' + momentum.toFixed(2), 10, drawHeight + 20);
  text('Learning Rate (\u03B1): ' + learningRate.toFixed(3), 10, drawHeight + 50);
}

// Objective function: f(x,y) = 0.5*x² + 0.5*κ*y²
function objectiveFunction(x, y) {
  return 0.5 * x * x + 0.5 * conditionNumber * y * y;
}

// Gradient: [x, κy]
function gradient(x, y) {
  return [x, conditionNumber * y];
}

function stepOptimizers() {
  iteration++;

  // SGD step
  let sgd = optimizers.sgd;
  let gSgd = gradient(sgd.x, sgd.y);
  sgd.x -= learningRate * gSgd[0];
  sgd.y -= learningRate * gSgd[1];
  sgd.path.push({ x: sgd.x, y: sgd.y });
  if (sgd.path.length > maxPathLength) sgd.path.shift();

  // Momentum step
  let mom = optimizers.momentum;
  let gMom = gradient(mom.x, mom.y);
  mom.vx = momentum * mom.vx + gMom[0];
  mom.vy = momentum * mom.vy + gMom[1];
  mom.x -= learningRate * mom.vx;
  mom.y -= learningRate * mom.vy;
  mom.path.push({ x: mom.x, y: mom.y });
  if (mom.path.length > maxPathLength) mom.path.shift();

  // Nesterov step
  let nes = optimizers.nesterov;
  // Look ahead
  let lookX = nes.x - learningRate * momentum * nes.vx;
  let lookY = nes.y - learningRate * momentum * nes.vy;
  let gNes = gradient(lookX, lookY);
  nes.vx = momentum * nes.vx + gNes[0];
  nes.vy = momentum * nes.vy + gNes[1];
  nes.x -= learningRate * nes.vx;
  nes.y -= learningRate * nes.vy;
  nes.path.push({ x: nes.x, y: nes.y });
  if (nes.path.length > maxPathLength) nes.path.shift();
}

function toggleRun() {
  isRunning = !isRunning;
  runButton.html(isRunning ? 'Pause' : 'Run');
}

function resetOptimization() {
  iteration = 0;
  isRunning = false;
  runButton.html('Run');

  for (let key in optimizers) {
    let opt = optimizers[key];
    opt.x = startX;
    opt.y = startY;
    opt.vx = 0;
    opt.vy = 0;
    opt.path = [{ x: opt.x, y: opt.y }];
  }
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
  momentumSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  learningRateSlider.size(canvasWidth - sliderLeftMargin - plotMarginRight - margin);
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
