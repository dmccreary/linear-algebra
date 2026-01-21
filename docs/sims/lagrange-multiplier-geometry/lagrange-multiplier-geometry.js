// Lagrange Multiplier Geometry MicroSim
// Visualize the geometric interpretation of Lagrange multipliers
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Plot area
let plotMarginLeft = 60;
let plotMarginRight = 200;
let plotMarginTop = 50;
let plotMarginBottom = 50;
let plotWidth, plotHeight;
let xMin = -3, xMax = 3;
let yMin = -3, yMax = 3;

// UI controls
let showGradientFieldCheckbox;
let showNormalFieldCheckbox;
let findOptimumButton;

// State
let pointT = 0.25;  // Parameter along constraint (0 to 1)
let isDragging = false;
let isAnimating = false;
let animationTarget = 0;

// Constraint: x² + y² = 4 (circle of radius 2)
// Objective: f(x,y) = x + 2y (linear function)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Create controls
  showGradientFieldCheckbox = createCheckbox('Show Gradient Field of f', false);
  showGradientFieldCheckbox.position(10, drawHeight + 10);

  showNormalFieldCheckbox = createCheckbox('Show Constraint Normal Field', false);
  showNormalFieldCheckbox.position(10, drawHeight + 35);

  findOptimumButton = createButton('Find Optimum');
  findOptimumButton.position(230, drawHeight + 15);
  findOptimumButton.mousePressed(animateToOptimum);

  describe('Visualization of Lagrange multipliers showing when objective gradient is parallel to constraint normal', LABEL);
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

  // Handle animation
  if (isAnimating) {
    let diff = animationTarget - pointT;
    if (abs(diff) < 0.005) {
      pointT = animationTarget;
      isAnimating = false;
    } else {
      pointT += diff * 0.1;
    }
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Lagrange Multiplier Geometry', canvasWidth / 2 - 80, 10);

  // Draw contours of objective function
  drawObjectiveContours();

  // Draw gradient field if enabled
  if (showGradientFieldCheckbox.checked()) {
    drawGradientField();
  }

  // Draw constraint normal field if enabled
  if (showNormalFieldCheckbox.checked()) {
    drawNormalField();
  }

  // Draw constraint curve
  drawConstraint();

  // Get current point on constraint
  let angle = pointT * TWO_PI;
  let px = 2 * cos(angle);
  let py = 2 * sin(angle);

  // Calculate gradients
  let gradF = [1, 2];  // Gradient of f(x,y) = x + 2y
  let gradH = [2 * px, 2 * py];  // Gradient of h(x,y) = x² + y² - 4

  // Normalize for display
  let gradFNorm = sqrt(gradF[0] * gradF[0] + gradF[1] * gradF[1]);
  let gradHNorm = sqrt(gradH[0] * gradH[0] + gradH[1] * gradH[1]);

  // Draw gradient vectors at current point
  let screenX = mapX(px);
  let screenY = mapY(py);
  let arrowScale = 40;

  // Gradient of f (blue arrow)
  stroke(0, 100, 255);
  strokeWeight(3);
  let gfx = screenX + gradF[0] / gradFNorm * arrowScale;
  let gfy = screenY - gradF[1] / gradFNorm * arrowScale;
  line(screenX, screenY, gfx, gfy);
  drawArrowHead(screenX, screenY, gfx, gfy, color(0, 100, 255));

  // Gradient of h (red arrow) - constraint normal
  stroke(200, 50, 50);
  strokeWeight(3);
  let ghx = screenX + gradH[0] / gradHNorm * arrowScale;
  let ghy = screenY - gradH[1] / gradHNorm * arrowScale;
  line(screenX, screenY, ghx, ghy);
  drawArrowHead(screenX, screenY, ghx, ghy, color(200, 50, 50));

  // Check if gradients are parallel (at optimum)
  let dot = gradF[0] * gradH[0] + gradF[1] * gradH[1];
  let cross = gradF[0] * gradH[1] - gradF[1] * gradH[0];
  let angleOffset = abs(atan2(cross, dot));
  let isParallel = angleOffset < 0.1 || abs(angleOffset - PI) < 0.1;

  // Draw current point
  fill(isParallel ? color(50, 200, 50) : color(255, 100, 100));
  stroke('white');
  strokeWeight(2);
  ellipse(screenX, screenY, 18, 18);

  // Draw optimum point (where gradients are parallel)
  // For f = x + 2y on x² + y² = 4, optimum is at (2/√5, 4/√5) ≈ (0.894, 1.789)
  let optX = 2 / sqrt(5);
  let optY = 4 / sqrt(5);
  fill(50, 200, 50);
  noStroke();
  ellipse(mapX(optX), mapY(optY), 10, 10);

  // Also mark the minimum
  ellipse(mapX(-optX), mapY(-optY), 10, 10);

  // Draw info panel
  drawInfoPanel(px, py, gradF, gradH, isParallel);

  // Draw control instruction
  fill('black');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Drag point along constraint to see when gradients align', 10, drawHeight + 62);
}

function drawObjectiveContours() {
  // Contours of f(x,y) = x + 2y
  let levels = [-6, -4, -2, 0, 2, 4, 6];

  stroke(200);
  strokeWeight(1);

  for (let c of levels) {
    // x + 2y = c => y = (c - x) / 2
    let x1 = xMin;
    let y1 = (c - x1) / 2;
    let x2 = xMax;
    let y2 = (c - x2) / 2;

    // Clip to visible region
    if (y1 > yMax) { y1 = yMax; x1 = c - 2 * y1; }
    if (y1 < yMin) { y1 = yMin; x1 = c - 2 * y1; }
    if (y2 > yMax) { y2 = yMax; x2 = c - 2 * y2; }
    if (y2 < yMin) { y2 = yMin; x2 = c - 2 * y2; }

    if (x1 >= xMin && x1 <= xMax && x2 >= xMin && x2 <= xMax) {
      line(mapX(x1), mapY(y1), mapX(x2), mapY(y2));
    }
  }
}

function drawGradientField() {
  let step = 0.6;
  let arrowSize = 15;
  let gradF = [1, 2];
  let norm = sqrt(5);

  stroke(0, 100, 255, 100);
  strokeWeight(1);

  for (let x = xMin + step / 2; x <= xMax; x += step) {
    for (let y = yMin + step / 2; y <= yMax; y += step) {
      let px = mapX(x);
      let py = mapY(y);
      let dx = gradF[0] / norm * arrowSize;
      let dy = -gradF[1] / norm * arrowSize;
      line(px, py, px + dx, py + dy);
    }
  }
}

function drawNormalField() {
  let arrowSize = 15;

  stroke(200, 50, 50, 100);
  strokeWeight(1);

  // Draw normals around the constraint circle
  for (let t = 0; t < TWO_PI; t += PI / 12) {
    let x = 2 * cos(t);
    let y = 2 * sin(t);
    let px = mapX(x);
    let py = mapY(y);

    // Normal is [2x, 2y], normalized is [x, y] (already unit for radius 2)
    let dx = x / 2 * arrowSize;
    let dy = -y / 2 * arrowSize;
    line(px, py, px + dx, py + dy);
  }
}

function drawConstraint() {
  // Draw constraint circle x² + y² = 4
  stroke(80);
  strokeWeight(3);
  noFill();

  beginShape();
  for (let t = 0; t <= TWO_PI; t += 0.05) {
    let x = 2 * cos(t);
    let y = 2 * sin(t);
    vertex(mapX(x), mapY(y));
  }
  endShape(CLOSE);

  // Label
  fill(80);
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('h(x,y) = x² + y² - 4 = 0', mapX(1.5), mapY(1.8));
}

function drawArrowHead(x1, y1, x2, y2, col) {
  push();
  translate(x2, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -10, 5, -10, -5);
  pop();
}

function drawInfoPanel(px, py, gradF, gradH, isParallel) {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = plotMarginTop;
  let panelW = plotMarginRight - 20;
  let panelH = 230;

  fill(255, 255, 255, 230);
  stroke(isParallel ? color(50, 200, 50) : color(200));
  strokeWeight(isParallel ? 2 : 1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);

  text('Current Point:', panelX + 10, panelY + 10);
  text('(' + px.toFixed(3) + ', ' + py.toFixed(3) + ')', panelX + 10, panelY + 25);

  let fVal = px + 2 * py;
  text('f(x,y) = ' + fVal.toFixed(3), panelX + 10, panelY + 50);

  // Gradient info
  fill(0, 100, 255);
  text('\u2207f = (1, 2)', panelX + 10, panelY + 80);

  fill(200, 50, 50);
  text('\u2207h = (' + (2 * px).toFixed(2) + ', ' + (2 * py).toFixed(2) + ')', panelX + 10, panelY + 100);

  // Calculate lambda
  let lambda = (gradF[0] * gradH[0] + gradF[1] * gradH[1]) / (gradH[0] * gradH[0] + gradH[1] * gradH[1]);

  fill('black');
  text('\u03BB = ' + lambda.toFixed(4), panelX + 10, panelY + 125);

  // Parallel check
  if (isParallel) {
    fill(50, 200, 50);
    textSize(13);
    text('OPTIMAL!', panelX + 10, panelY + 155);
    textSize(11);
    text('\u2207f = \u03BB\u2207h', panelX + 10, panelY + 175);
    text('Gradients parallel', panelX + 10, panelY + 190);
  } else {
    fill(100);
    textSize(11);
    text('Drag point until', panelX + 10, panelY + 155);
    text('gradients are parallel', panelX + 10, panelY + 170);
  }
}

function animateToOptimum() {
  // Optimum is at angle = atan2(2, 1) ≈ 1.107
  let optAngle = atan2(2, 1);
  animationTarget = optAngle / TWO_PI;
  if (animationTarget < 0) animationTarget += 1;
  isAnimating = true;
}

// Mouse interaction for dragging point along constraint
function mousePressed() {
  let angle = pointT * TWO_PI;
  let px = 2 * cos(angle);
  let py = 2 * sin(angle);
  let screenX = mapX(px);
  let screenY = mapY(py);

  if (dist(mouseX, mouseY, screenX, screenY) < 20) {
    isDragging = true;
  }
}

function mouseDragged() {
  if (isDragging) {
    // Convert mouse to world coordinates
    let worldX = unmapX(mouseX);
    let worldY = unmapY(mouseY);

    // Project onto constraint circle
    let angle = atan2(worldY, worldX);
    if (angle < 0) angle += TWO_PI;
    pointT = angle / TWO_PI;
  }
}

function mouseReleased() {
  isDragging = false;
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
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
