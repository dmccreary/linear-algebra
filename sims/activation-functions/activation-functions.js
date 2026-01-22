// Activation Functions Visualizer
// Compare activation functions by their shape, range, and gradient behavior
// MicroSim template version 2026.02
/// 

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Plot dimensions
let plotLeft = 60;
let plotRight;
let plotTop = 50;
let plotBottom;
let plotWidth;
let plotHeight;

// Input range
let xMin = -5;
let xMax = 5;
let yMin = -2;
let yMax = 2;

// UI elements
let functionSelect;
let showDerivativeCheckbox;
let compareAllCheckbox;
let inputSlider;

// Current traced value
let tracedX = 0;

// Function definitions
const activations = {
  'ReLU': {
    f: (x) => max(0, x),
    df: (x) => x > 0 ? 1 : 0,
    range: '[0, +∞)',
    color: [65, 105, 225],  // Royal blue
    description: 'Efficient, sparse activations'
  },
  'Sigmoid': {
    f: (x) => 1 / (1 + exp(-x)),
    df: (x) => {
      let s = 1 / (1 + exp(-x));
      return s * (1 - s);
    },
    range: '(0, 1)',
    color: [220, 20, 60],  // Crimson
    description: 'Probability output'
  },
  'Tanh': {
    f: (x) => tanh(x),
    df: (x) => 1 - pow(tanh(x), 2),
    range: '(-1, 1)',
    color: [34, 139, 34],  // Forest green
    description: 'Zero-centered'
  },
  'Leaky ReLU': {
    f: (x) => x > 0 ? x : 0.1 * x,
    df: (x) => x > 0 ? 1 : 0.1,
    range: '(-∞, +∞)',
    color: [255, 140, 0],  // Dark orange
    description: 'Prevents dead neurons'
  },
  'Softplus': {
    f: (x) => log(1 + exp(x)),
    df: (x) => 1 / (1 + exp(-x)),
    range: '(0, +∞)',
    color: [138, 43, 226],  // Blue violet
    description: 'Smooth ReLU'
  }
};

// JavaScript tanh function
function tanh(x) {
  let e2x = exp(2 * x);
  return (e2x - 1) / (e2x + 1);
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  updatePlotDimensions();

  // Row 1: Function selector and checkboxes
  functionSelect = createSelect();
  functionSelect.position(10, drawHeight + 8);
  for (let name in activations) {
    functionSelect.option(name);
  }
  functionSelect.selected('ReLU');

  showDerivativeCheckbox = createCheckbox('Show Derivative', true);
  showDerivativeCheckbox.position(130, drawHeight + 8);

  compareAllCheckbox = createCheckbox('Compare All', false);
  compareAllCheckbox.position(270, drawHeight + 8);

  // Row 2: Input value slider
  inputSlider = createSlider(xMin, xMax, 0, 0.01);
  inputSlider.position(sliderLeftMargin, drawHeight + 45);
  inputSlider.size(canvasWidth - sliderLeftMargin - margin);
  inputSlider.input(() => { tracedX = inputSlider.value(); });

  describe('Activation functions visualizer comparing ReLU, Sigmoid, Tanh and other functions', LABEL);
}

function draw() {
  updateCanvasSize();
  updatePlotDimensions();

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
  textSize(20);
  text('Activation Functions', canvasWidth / 2, 8);

  // Draw plot area
  fill('white');
  stroke('silver');
  rect(plotLeft, plotTop, plotWidth, plotHeight);

  // Draw grid and axes
  drawGrid();
  drawAxes();

  // Get current selections
  let selectedFunc = functionSelect.value();
  let showDeriv = showDerivativeCheckbox.checked();
  let compareAll = compareAllCheckbox.checked();
  tracedX = inputSlider.value();

  // Draw functions
  if (compareAll) {
    // Draw all functions
    for (let name in activations) {
      drawFunction(activations[name], showDeriv);
    }
  } else {
    // Draw selected function
    drawFunction(activations[selectedFunc], showDeriv);
  }

  // Draw traced point
  if (!compareAll) {
    drawTracedPoint(activations[selectedFunc]);
  }

  // Draw info panel
  if (!compareAll) {
    drawInfoPanel(selectedFunc, activations[selectedFunc]);
  } else {
    drawLegend();
  }

  // Draw control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Input x: ' + tracedX.toFixed(2), 10, drawHeight + 55);
}

function updatePlotDimensions() {
  plotRight = canvasWidth - 150;  // Leave room for info panel
  plotBottom = drawHeight - 40;
  plotWidth = plotRight - plotLeft;
  plotHeight = plotBottom - plotTop;
}

function drawGrid() {
  stroke(230);
  strokeWeight(1);

  // Vertical grid lines
  for (let x = xMin; x <= xMax; x++) {
    let px = map(x, xMin, xMax, plotLeft, plotRight);
    line(px, plotTop, px, plotBottom);
  }

  // Horizontal grid lines
  for (let y = yMin; y <= yMax; y += 0.5) {
    let py = map(y, yMin, yMax, plotBottom, plotTop);
    line(plotLeft, py, plotRight, py);
  }
}

function drawAxes() {
  stroke(100);
  strokeWeight(2);

  // X-axis
  let y0 = map(0, yMin, yMax, plotBottom, plotTop);
  if (y0 >= plotTop && y0 <= plotBottom) {
    line(plotLeft, y0, plotRight, y0);
  }

  // Y-axis
  let x0 = map(0, xMin, xMax, plotLeft, plotRight);
  if (x0 >= plotLeft && x0 <= plotRight) {
    line(x0, plotTop, x0, plotBottom);
  }

  // Axis labels
  noStroke();
  fill(100);
  textSize(12);
  textAlign(CENTER, TOP);

  // X-axis labels
  for (let x = xMin; x <= xMax; x++) {
    let px = map(x, xMin, xMax, plotLeft, plotRight);
    text(x, px, plotBottom + 5);
  }

  // Y-axis labels
  textAlign(RIGHT, CENTER);
  for (let y = yMin; y <= yMax; y += 0.5) {
    if (abs(y) > 0.01) {
      let py = map(y, yMin, yMax, plotBottom, plotTop);
      text(y.toFixed(1), plotLeft - 5, py);
    }
  }

  // Axis titles
  textAlign(CENTER, TOP);
  textSize(14);
  text('x (input)', (plotLeft + plotRight) / 2, plotBottom + 20);

  push();
  translate(15, (plotTop + plotBottom) / 2);
  rotate(-PI / 2);
  text('f(x)', 0, 0);
  pop();
}

function drawFunction(func, showDeriv) {
  let col = func.color;

  // Draw main function
  stroke(col[0], col[1], col[2]);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let px = plotLeft; px <= plotRight; px++) {
    let x = map(px, plotLeft, plotRight, xMin, xMax);
    let y = func.f(x);
    let py = map(y, yMin, yMax, plotBottom, plotTop);
    if (py >= plotTop - 20 && py <= plotBottom + 20) {
      vertex(px, constrain(py, plotTop, plotBottom));
    }
  }
  endShape();

  // Draw derivative if enabled
  if (showDeriv) {
    stroke(col[0], col[1], col[2], 150);
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    beginShape();
    for (let px = plotLeft; px <= plotRight; px++) {
      let x = map(px, plotLeft, plotRight, xMin, xMax);
      let dy = func.df(x);
      let py = map(dy, yMin, yMax, plotBottom, plotTop);
      if (py >= plotTop - 20 && py <= plotBottom + 20) {
        vertex(px, constrain(py, plotTop, plotBottom));
      }
    }
    endShape();
    drawingContext.setLineDash([]);
  }

  // Highlight saturation regions (near-zero gradient)
  noStroke();
  fill(255, 255, 0, 30);
  for (let px = plotLeft; px <= plotRight; px += 2) {
    let x = map(px, plotLeft, plotRight, xMin, xMax);
    let dy = func.df(x);
    if (abs(dy) < 0.1) {
      rect(px, plotTop, 2, plotHeight);
    }
  }
}

function drawTracedPoint(func) {
  let px = map(tracedX, xMin, xMax, plotLeft, plotRight);
  let y = func.f(tracedX);
  let py = map(y, yMin, yMax, plotBottom, plotTop);

  // Vertical line to point
  stroke(100);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(px, plotBottom, px, py);
  line(plotLeft, py, px, py);
  drawingContext.setLineDash([]);

  // Point marker
  let col = func.color;
  fill(col[0], col[1], col[2]);
  stroke(255);
  strokeWeight(2);
  ellipse(px, constrain(py, plotTop, plotBottom), 12, 12);
}

function drawInfoPanel(name, func) {
  let panelX = plotRight + 10;
  let panelY = plotTop;
  let panelW = canvasWidth - panelX - 10;
  let panelH = 180;

  // Panel background
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Function name
  noStroke();
  let col = func.color;
  fill(col[0], col[1], col[2]);
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  text(name, panelX + 10, panelY + 10);
  textStyle(NORMAL);

  // Computed values
  fill('black');
  textSize(12);
  let y = func.f(tracedX);
  let dy = func.df(tracedX);

  let lineY = panelY + 35;
  text('f(' + tracedX.toFixed(2) + ') = ' + y.toFixed(4), panelX + 10, lineY);
  lineY += 20;
  text("f'(" + tracedX.toFixed(2) + ') = ' + dy.toFixed(4), panelX + 10, lineY);
  lineY += 25;

  // Properties
  fill(100);
  text('Range: ' + func.range, panelX + 10, lineY);
  lineY += 20;

  // Description
  fill(80);
  textSize(11);
  text(func.description, panelX + 10, lineY, panelW - 20, 40);

  // Gradient status
  lineY += 40;
  if (abs(dy) < 0.1) {
    fill(200, 100, 0);
    text('⚠ Low gradient', panelX + 10, lineY);
    text('(vanishing)', panelX + 10, lineY + 15);
  } else {
    fill(0, 150, 0);
    text('✓ Good gradient', panelX + 10, lineY);
  }
}

function drawLegend() {
  let panelX = plotRight + 10;
  let panelY = plotTop;
  let panelW = canvasWidth - panelX - 10;
  let panelH = plotHeight;

  // Panel background
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  fill('black');
  text('Legend', panelX + 10, panelY + 10);
  textStyle(NORMAL);

  let lineY = panelY + 35;
  for (let name in activations) {
    let func = activations[name];
    let col = func.color;

    // Color swatch
    fill(col[0], col[1], col[2]);
    rect(panelX + 10, lineY, 20, 3);

    // Name
    fill('black');
    textSize(11);
    text(name, panelX + 35, lineY - 5);

    lineY += 25;
  }

  // Note about dashed lines
  lineY += 10;
  fill(100);
  textSize(10);
  text('Solid: f(x)', panelX + 10, lineY);
  text('Dashed: f\'(x)', panelX + 10, lineY + 15);
  text('Yellow: low gradient', panelX + 10, lineY + 30);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  updatePlotDimensions();
  inputSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
