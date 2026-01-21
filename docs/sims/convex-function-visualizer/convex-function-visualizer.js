// Convex Function Visualizer MicroSim
// Demonstrates the geometric definition of convexity by visualizing the chord condition
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Plot area
let plotMarginLeft = 60;
let plotMarginRight = 30;
let plotMarginTop = 50;
let plotMarginBottom = 50;
let plotWidth, plotHeight;
let xMin = -3, xMax = 3;
let yMin = -2, yMax = 10;

// Draggable points (x-coordinates)
let x1 = -2;
let x2 = 2;
let draggingPoint = null; // null, 'x1', or 'x2'

// Lambda slider
let lambdaSlider;
let lambda = 0.5;

// Function selector
let functionSelect;
let currentFunction = 'x^2';

// Function definitions
const functions = {
  'x^2': { f: x => x * x, label: 'f(x) = x²', convex: true },
  '|x|': { f: x => Math.abs(x), label: 'f(x) = |x|', convex: true },
  'x^4': { f: x => Math.pow(x, 4), label: 'f(x) = x⁴', convex: true },
  'x^2+sin(x)': { f: x => x * x + Math.sin(x), label: 'f(x) = x² + sin(x)', convex: true },
  '-x^2 (non-convex)': { f: x => -x * x, label: 'f(x) = -x² (non-convex)', convex: false }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Calculate plot dimensions
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Create function selector
  functionSelect = createSelect();
  functionSelect.position(10, drawHeight + 10);
  for (let fname in functions) {
    functionSelect.option(fname);
  }
  functionSelect.selected('x^2');
  functionSelect.changed(() => currentFunction = functionSelect.value());

  // Create lambda slider
  lambdaSlider = createSlider(0, 1, 0.5, 0.01);
  lambdaSlider.position(sliderLeftMargin, drawHeight + 10);
  lambdaSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Interactive visualization of convex functions showing the chord condition. Drag points on the curve to see how the chord relates to the function.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Draw background regions
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Update lambda
  lambda = lambdaSlider.value();

  // Get current function
  let func = functions[currentFunction].f;

  // Recalculate plot dimensions for responsiveness
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Convex Function Visualizer', canvasWidth / 2, 10);

  // Draw axes
  drawAxes();

  // Draw function curve
  drawFunctionCurve(func);

  // Get y-values at points
  let y1 = func(x1);
  let y2 = func(x2);

  // Calculate interpolated point
  let xLambda = lambda * x1 + (1 - lambda) * x2;
  let yOnChord = lambda * y1 + (1 - lambda) * y2;
  let yOnCurve = func(xLambda);

  // Draw chord (line segment between two points)
  stroke(0, 100, 200);
  strokeWeight(2);
  let px1 = mapX(x1);
  let py1 = mapY(y1);
  let px2 = mapX(x2);
  let py2 = mapY(y2);
  line(px1, py1, px2, py2);

  // Draw shaded region between chord and curve
  drawShadedRegion(func, x1, x2, y1, y2);

  // Draw lambda point on chord
  let pxLambda = mapX(xLambda);
  let pyChord = mapY(yOnChord);
  let pyCurve = mapY(yOnCurve);

  // Vertical line showing comparison
  stroke(100, 100, 100);
  strokeWeight(1);
  setLineDash([5, 5]);
  line(pxLambda, pyChord, pxLambda, pyCurve);
  setLineDash([]);

  // Draw point on chord (interpolation point)
  fill(0, 100, 200);
  stroke('white');
  strokeWeight(2);
  ellipse(pxLambda, pyChord, 12, 12);

  // Draw point on curve at lambda position
  fill(200, 100, 0);
  ellipse(pxLambda, pyCurve, 12, 12);

  // Draw draggable points on curve
  // Point 1
  fill(draggingPoint === 'x1' ? color(255, 100, 100) : color(200, 50, 50));
  stroke('white');
  strokeWeight(2);
  ellipse(px1, py1, 18, 18);
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('1', px1, py1);

  // Point 2
  fill(draggingPoint === 'x2' ? color(100, 255, 100) : color(50, 150, 50));
  stroke('white');
  strokeWeight(2);
  ellipse(px2, py2, 18, 18);
  fill('white');
  noStroke();
  text('2', px2, py2);

  // Check convexity condition
  let isConvex = yOnCurve <= yOnChord + 0.001; // Small tolerance

  // Display convexity status
  drawConvexityStatus(isConvex, xLambda, yOnCurve, yOnChord);

  // Draw control labels
  drawControlLabels();
}

function drawAxes() {
  stroke(100);
  strokeWeight(1);

  // X-axis
  let y0 = mapY(0);
  if (y0 >= plotMarginTop && y0 <= drawHeight - plotMarginBottom) {
    line(plotMarginLeft, y0, canvasWidth - plotMarginRight, y0);
  }

  // Y-axis
  let x0 = mapX(0);
  if (x0 >= plotMarginLeft && x0 <= canvasWidth - plotMarginRight) {
    line(x0, plotMarginTop, x0, drawHeight - plotMarginBottom);
  }

  // Axis labels
  fill('black');
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('x', canvasWidth - plotMarginRight + 15, y0 - 5);
  textAlign(RIGHT, CENTER);
  text('f(x)', x0 - 5, plotMarginTop - 10);

  // Tick marks and labels
  textSize(11);
  textAlign(CENTER, TOP);
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    let px = mapX(x);
    stroke(100);
    line(px, y0 - 3, px, y0 + 3);
    noStroke();
    if (x !== 0) text(x, px, y0 + 5);
  }

  textAlign(RIGHT, CENTER);
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += 2) {
    let py = mapY(y);
    if (py >= plotMarginTop && py <= drawHeight - plotMarginBottom) {
      stroke(100);
      line(x0 - 3, py, x0 + 3, py);
      noStroke();
      if (y !== 0) text(y, x0 - 8, py);
    }
  }
}

function drawFunctionCurve(func) {
  stroke(80, 80, 80);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = plotMarginLeft; px <= canvasWidth - plotMarginRight; px += 2) {
    let x = unmapX(px);
    let y = func(x);
    let py = mapY(y);
    if (py >= plotMarginTop - 20 && py <= drawHeight - plotMarginBottom + 20) {
      vertex(px, py);
    }
  }
  endShape();
}

function drawShadedRegion(func, x1Val, x2Val, y1Val, y2Val) {
  // Sort points by x
  let xLeft = Math.min(x1Val, x2Val);
  let xRight = Math.max(x1Val, x2Val);
  let yLeft = x1Val < x2Val ? y1Val : y2Val;
  let yRight = x1Val < x2Val ? y2Val : y1Val;

  // Check if convex at midpoint
  let xMid = (xLeft + xRight) / 2;
  let yChordMid = (yLeft + yRight) / 2;
  let yCurveMid = func(xMid);
  let isConvexRegion = yCurveMid <= yChordMid + 0.001;

  // Draw shaded region
  if (isConvexRegion) {
    fill(100, 200, 100, 50); // Green for convex
  } else {
    fill(255, 100, 100, 50); // Red for non-convex
  }
  noStroke();

  beginShape();
  // Chord from left to right
  vertex(mapX(xLeft), mapY(yLeft));
  vertex(mapX(xRight), mapY(yRight));

  // Curve from right back to left
  for (let x = xRight; x >= xLeft; x -= 0.05) {
    let y = func(x);
    let py = mapY(y);
    if (py >= plotMarginTop - 20 && py <= drawHeight - plotMarginBottom + 20) {
      vertex(mapX(x), py);
    }
  }
  endShape(CLOSE);
}

function drawConvexityStatus(isConvex, xLambda, yOnCurve, yOnChord) {
  // Info box
  let boxX = canvasWidth - 220;
  let boxY = plotMarginTop + 10;
  let boxW = 200;
  let boxH = 120;

  fill(255, 255, 255, 230);
  stroke(isConvex ? color(100, 200, 100) : color(255, 100, 100));
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 10);

  // Status text
  fill(isConvex ? color(0, 150, 0) : color(200, 0, 0));
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text(isConvex ? 'Convex Condition: MET' : 'Convex Condition: VIOLATED', boxX + boxW / 2, boxY + 10);

  // Values
  fill('black');
  textAlign(LEFT, TOP);
  textSize(12);
  let yPos = boxY + 35;
  text('x = ' + xLambda.toFixed(2), boxX + 10, yPos);
  yPos += 18;
  text('f(x) = ' + yOnCurve.toFixed(3), boxX + 10, yPos);
  yPos += 18;
  text('Chord = ' + yOnChord.toFixed(3), boxX + 10, yPos);
  yPos += 18;
  text('Diff = ' + (yOnChord - yOnCurve).toFixed(3), boxX + 10, yPos);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  // Function label
  text('Function:', 10, drawHeight + 45);

  // Lambda label and value
  text('Lambda (\u03BB): ' + lambda.toFixed(2), sliderLeftMargin - 85, drawHeight + 20);

  // Convexity inequality
  textSize(13);
  text('Convexity: f(\u03BBx\u2081 + (1-\u03BB)x\u2082) \u2264 \u03BBf(x\u2081) + (1-\u03BB)f(x\u2082)', 10, drawHeight + 65);
}

// Coordinate mapping functions
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

// Helper function for dashed lines (WEBGL compatibility)
function setLineDash(pattern) {
  drawingContext.setLineDash(pattern);
}

// Mouse interaction for dragging points
function mousePressed() {
  let px1 = mapX(x1);
  let py1 = mapY(functions[currentFunction].f(x1));
  let px2 = mapX(x2);
  let py2 = mapY(functions[currentFunction].f(x2));

  if (dist(mouseX, mouseY, px1, py1) < 15) {
    draggingPoint = 'x1';
  } else if (dist(mouseX, mouseY, px2, py2) < 15) {
    draggingPoint = 'x2';
  }
}

function mouseDragged() {
  if (draggingPoint) {
    let newX = unmapX(mouseX);
    newX = constrain(newX, xMin + 0.1, xMax - 0.1);

    if (draggingPoint === 'x1') {
      x1 = newX;
    } else if (draggingPoint === 'x2') {
      x2 = newX;
    }
  }
}

function mouseReleased() {
  draggingPoint = null;
}

// Responsive design functions
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  lambdaSlider.size(canvasWidth - sliderLeftMargin - margin);
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
