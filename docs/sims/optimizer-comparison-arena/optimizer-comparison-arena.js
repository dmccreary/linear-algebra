// Optimizer Comparison Arena MicroSim
// Compare convergence behavior of different optimizers on various loss landscapes
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Plot area
let plotMarginLeft = 50;
let plotMarginRight = 200;
let plotMarginTop = 50;
let plotMarginBottom = 80;
let plotWidth, plotHeight;

// UI controls
let landscapeSelect;
let raceButton, resetButton;
let sgdCheckbox, momentumCheckbox, rmspropCheckbox, adamCheckbox;

// State
let isRunning = false;
let iteration = 0;
let winner = null;
let convergenceThreshold = 0.001;

// Current landscape
let currentLandscape = 'quadratic';

// Landscape definitions
const landscapes = {
  'quadratic': {
    name: 'Quadratic (Elliptical)',
    f: (x, y) => 0.5 * x * x + 10 * y * y,
    grad: (x, y) => [x, 20 * y],
    xRange: [-3, 3],
    yRange: [-1.5, 1.5],
    minimum: [0, 0],
    start: [2.5, 1.2],
    contourLevels: [0.5, 1, 2, 4, 8, 16]
  },
  'rosenbrock': {
    name: 'Rosenbrock (Banana)',
    f: (x, y) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
    grad: (x, y) => [
      -2 * (1 - x) - 400 * x * (y - x * x),
      200 * (y - x * x)
    ],
    xRange: [-2, 2],
    yRange: [-1, 3],
    minimum: [1, 1],
    start: [-1.5, 2],
    contourLevels: [1, 5, 20, 50, 100, 200, 500]
  },
  'beale': {
    name: 'Beale Function',
    f: (x, y) => Math.pow(1.5 - x + x * y, 2) +
      Math.pow(2.25 - x + x * y * y, 2) +
      Math.pow(2.625 - x + x * y * y * y, 2),
    grad: (x, y) => {
      let t1 = 1.5 - x + x * y;
      let t2 = 2.25 - x + x * y * y;
      let t3 = 2.625 - x + x * y * y * y;
      return [
        2 * t1 * (-1 + y) + 2 * t2 * (-1 + y * y) + 2 * t3 * (-1 + y * y * y),
        2 * t1 * x + 2 * t2 * 2 * x * y + 2 * t3 * 3 * x * y * y
      ];
    },
    xRange: [-2, 4],
    yRange: [-2, 2],
    minimum: [3, 0.5],
    start: [-1, 1.5],
    contourLevels: [0.5, 1, 5, 10, 50, 100]
  },
  'saddle': {
    name: 'Saddle Point',
    f: (x, y) => x * x - y * y,
    grad: (x, y) => [2 * x, -2 * y],
    xRange: [-3, 3],
    yRange: [-3, 3],
    minimum: [0, 0],  // Actually a saddle, not minimum
    start: [2, 0.1],
    contourLevels: [-8, -4, -2, -1, 0, 1, 2, 4, 8]
  }
};

// Optimizer states
let optimizers = {};

function initOptimizers() {
  let landscape = landscapes[currentLandscape];
  let start = landscape.start;

  optimizers = {
    sgd: {
      name: 'SGD',
      color: color(0, 100, 255),
      enabled: true,
      x: start[0], y: start[1],
      path: [{ x: start[0], y: start[1] }],
      lr: 0.01,
      converged: false,
      iterations: 0
    },
    momentum: {
      name: 'Momentum',
      color: color(50, 180, 50),
      enabled: true,
      x: start[0], y: start[1],
      vx: 0, vy: 0,
      beta: 0.9,
      path: [{ x: start[0], y: start[1] }],
      lr: 0.01,
      converged: false,
      iterations: 0
    },
    rmsprop: {
      name: 'RMSprop',
      color: color(200, 50, 150),
      enabled: true,
      x: start[0], y: start[1],
      sx: 0, sy: 0,
      gamma: 0.9,
      eps: 1e-8,
      path: [{ x: start[0], y: start[1] }],
      lr: 0.01,
      converged: false,
      iterations: 0
    },
    adam: {
      name: 'Adam',
      color: color(255, 150, 0),
      enabled: true,
      x: start[0], y: start[1],
      mx: 0, my: 0,
      vx: 0, vy: 0,
      beta1: 0.9,
      beta2: 0.999,
      eps: 1e-8,
      t: 0,
      path: [{ x: start[0], y: start[1] }],
      lr: 0.01,
      converged: false,
      iterations: 0
    }
  };
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Create landscape selector
  landscapeSelect = createSelect();
  landscapeSelect.position(10, drawHeight + 10);
  for (let key in landscapes) {
    landscapeSelect.option(landscapes[key].name, key);
  }
  landscapeSelect.changed(() => {
    currentLandscape = landscapeSelect.value();
    resetOptimization();
  });

  // Checkboxes for optimizer selection
  sgdCheckbox = createCheckbox('SGD', true);
  sgdCheckbox.position(10, drawHeight + 45);
  sgdCheckbox.changed(() => optimizers.sgd.enabled = sgdCheckbox.checked());

  momentumCheckbox = createCheckbox('Momentum', true);
  momentumCheckbox.position(80, drawHeight + 45);
  momentumCheckbox.changed(() => optimizers.momentum.enabled = momentumCheckbox.checked());

  rmspropCheckbox = createCheckbox('RMSprop', true);
  rmspropCheckbox.position(180, drawHeight + 45);
  rmspropCheckbox.changed(() => optimizers.rmsprop.enabled = rmspropCheckbox.checked());

  adamCheckbox = createCheckbox('Adam', true);
  adamCheckbox.position(270, drawHeight + 45);
  adamCheckbox.changed(() => optimizers.adam.enabled = adamCheckbox.checked());

  // Buttons
  raceButton = createButton('Race!');
  raceButton.position(10, drawHeight + 80);
  raceButton.mousePressed(startRace);

  resetButton = createButton('Reset');
  resetButton.position(70, drawHeight + 80);
  resetButton.mousePressed(resetOptimization);

  initOptimizers();

  describe('Optimizer comparison arena showing SGD, Momentum, RMSprop, and Adam racing to minimum', LABEL);
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

  // Run optimization if racing
  if (isRunning) {
    for (let i = 0; i < 3; i++) {  // Multiple steps per frame for speed
      stepAllOptimizers();
    }
    checkConvergence();
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Optimizer Comparison Arena', canvasWidth / 2 - 70, 10);

  // Draw landscape
  let landscape = landscapes[currentLandscape];
  drawContours(landscape);

  // Draw minimum marker
  fill(50, 200, 50);
  noStroke();
  let minPx = mapX(landscape.minimum[0], landscape.xRange);
  let minPy = mapY(landscape.minimum[1], landscape.yRange);
  ellipse(minPx, minPy, 12, 12);

  // Draw optimizer paths and points
  for (let key in optimizers) {
    let opt = optimizers[key];
    if (opt.enabled) {
      drawOptimizerPath(opt, landscape);
    }
  }

  // Draw info panel
  drawInfoPanel();

  // Draw control labels
  drawControlLabels();
}

function drawContours(landscape) {
  let levels = landscape.contourLevels;

  for (let level of levels) {
    stroke(level === 0 ? color(100, 100, 100) : color(200));
    strokeWeight(level === 0 ? 1.5 : 1);
    noFill();

    // Draw contour using marching squares approximation
    let gridSize = 50;
    let xStep = (landscape.xRange[1] - landscape.xRange[0]) / gridSize;
    let yStep = (landscape.yRange[1] - landscape.yRange[0]) / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let x0 = landscape.xRange[0] + i * xStep;
        let y0 = landscape.yRange[0] + j * yStep;

        // Check the four corners
        let f00 = landscape.f(x0, y0) - level;
        let f10 = landscape.f(x0 + xStep, y0) - level;
        let f01 = landscape.f(x0, y0 + yStep) - level;
        let f11 = landscape.f(x0 + xStep, y0 + yStep) - level;

        // Simple contour crossing
        if ((f00 > 0) !== (f10 > 0)) {
          let t = f00 / (f00 - f10);
          let px = mapX(x0 + t * xStep, landscape.xRange);
          let py = mapY(y0, landscape.yRange);
          point(px, py);
        }
        if ((f00 > 0) !== (f01 > 0)) {
          let t = f00 / (f00 - f01);
          let px = mapX(x0, landscape.xRange);
          let py = mapY(y0 + t * yStep, landscape.yRange);
          point(px, py);
        }
      }
    }
  }

  // Draw axes
  stroke(100);
  strokeWeight(1);
  line(mapX(landscape.xRange[0], landscape.xRange), mapY(0, landscape.yRange),
    mapX(landscape.xRange[1], landscape.xRange), mapY(0, landscape.yRange));
  line(mapX(0, landscape.xRange), mapY(landscape.yRange[0], landscape.yRange),
    mapX(0, landscape.xRange), mapY(landscape.yRange[1], landscape.yRange));
}

function drawOptimizerPath(opt, landscape) {
  if (opt.path.length < 2) return;

  // Draw path
  stroke(opt.color);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of opt.path) {
    vertex(mapX(p.x, landscape.xRange), mapY(p.y, landscape.yRange));
  }
  endShape();

  // Draw current point
  let px = mapX(opt.x, landscape.xRange);
  let py = mapY(opt.y, landscape.yRange);
  fill(opt.color);
  stroke('white');
  strokeWeight(2);
  ellipse(px, py, opt.converged ? 16 : 12, opt.converged ? 16 : 12);
}

function drawInfoPanel() {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = plotMarginTop;
  let panelW = plotMarginRight - 20;
  let panelH = 300;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  text('Iteration: ' + iteration, panelX + 10, panelY + 10);

  // Optimizer info
  let yOffset = 35;
  let sorted = Object.values(optimizers)
    .filter(o => o.enabled)
    .sort((a, b) => {
      let landscape = landscapes[currentLandscape];
      let fA = landscape.f(a.x, a.y);
      let fB = landscape.f(b.x, b.y);
      return fA - fB;
    });

  for (let opt of sorted) {
    fill(opt.color);
    textSize(12);
    text((opt.converged ? '\u2713 ' : '') + opt.name, panelX + 10, panelY + yOffset);

    fill('black');
    textSize(10);
    let landscape = landscapes[currentLandscape];
    let fVal = landscape.f(opt.x, opt.y);
    text('f = ' + fVal.toFixed(4), panelX + 10, panelY + yOffset + 15);

    if (opt.converged) {
      text('(' + opt.iterations + ' iters)', panelX + 10, panelY + yOffset + 28);
    }

    yOffset += 50;
  }

  // Winner announcement
  if (winner) {
    fill(winner.color);
    textSize(14);
    textAlign(CENTER, TOP);
    text('Winner: ' + winner.name + '!', panelX + panelW / 2, panelY + 270);
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Select landscape and optimizers, then click Race!', 10, drawHeight + 110);
}

function stepAllOptimizers() {
  let landscape = landscapes[currentLandscape];
  iteration++;

  for (let key in optimizers) {
    let opt = optimizers[key];
    if (!opt.enabled || opt.converged) continue;

    let grad = landscape.grad(opt.x, opt.y);

    switch (key) {
      case 'sgd':
        opt.x -= opt.lr * grad[0];
        opt.y -= opt.lr * grad[1];
        break;

      case 'momentum':
        opt.vx = opt.beta * opt.vx + grad[0];
        opt.vy = opt.beta * opt.vy + grad[1];
        opt.x -= opt.lr * opt.vx;
        opt.y -= opt.lr * opt.vy;
        break;

      case 'rmsprop':
        opt.sx = opt.gamma * opt.sx + (1 - opt.gamma) * grad[0] * grad[0];
        opt.sy = opt.gamma * opt.sy + (1 - opt.gamma) * grad[1] * grad[1];
        opt.x -= opt.lr * grad[0] / (sqrt(opt.sx) + opt.eps);
        opt.y -= opt.lr * grad[1] / (sqrt(opt.sy) + opt.eps);
        break;

      case 'adam':
        opt.t++;
        opt.mx = opt.beta1 * opt.mx + (1 - opt.beta1) * grad[0];
        opt.my = opt.beta1 * opt.my + (1 - opt.beta1) * grad[1];
        opt.vx = opt.beta2 * opt.vx + (1 - opt.beta2) * grad[0] * grad[0];
        opt.vy = opt.beta2 * opt.vy + (1 - opt.beta2) * grad[1] * grad[1];
        let mxHat = opt.mx / (1 - Math.pow(opt.beta1, opt.t));
        let myHat = opt.my / (1 - Math.pow(opt.beta1, opt.t));
        let vxHat = opt.vx / (1 - Math.pow(opt.beta2, opt.t));
        let vyHat = opt.vy / (1 - Math.pow(opt.beta2, opt.t));
        opt.x -= opt.lr * mxHat / (sqrt(vxHat) + opt.eps);
        opt.y -= opt.lr * myHat / (sqrt(vyHat) + opt.eps);
        break;
    }

    opt.path.push({ x: opt.x, y: opt.y });
    if (opt.path.length > 500) opt.path.shift();
  }
}

function checkConvergence() {
  let landscape = landscapes[currentLandscape];
  let allConverged = true;

  for (let key in optimizers) {
    let opt = optimizers[key];
    if (!opt.enabled) continue;

    if (!opt.converged) {
      let dx = opt.x - landscape.minimum[0];
      let dy = opt.y - landscape.minimum[1];
      let dist = sqrt(dx * dx + dy * dy);

      if (dist < 0.05) {
        opt.converged = true;
        opt.iterations = iteration;
        if (!winner) winner = opt;
      } else {
        allConverged = false;
      }
    }
  }

  if (allConverged || iteration > 5000) {
    isRunning = false;
    raceButton.html('Race!');
  }
}

function startRace() {
  if (isRunning) {
    isRunning = false;
    raceButton.html('Race!');
  } else {
    resetOptimization();
    isRunning = true;
    raceButton.html('Stop');
  }
}

function resetOptimization() {
  iteration = 0;
  winner = null;
  isRunning = false;
  raceButton.html('Race!');
  initOptimizers();

  // Update checkbox states
  optimizers.sgd.enabled = sgdCheckbox.checked();
  optimizers.momentum.enabled = momentumCheckbox.checked();
  optimizers.rmsprop.enabled = rmspropCheckbox.checked();
  optimizers.adam.enabled = adamCheckbox.checked();
}

// Coordinate mapping
function mapX(x, xRange) {
  return plotMarginLeft + (x - xRange[0]) / (xRange[1] - xRange[0]) * plotWidth;
}

function mapY(y, yRange) {
  return drawHeight - plotMarginBottom - (y - yRange[0]) / (yRange[1] - yRange[0]) * plotHeight;
}

// Responsive design
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
