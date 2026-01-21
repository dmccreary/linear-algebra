// KKT Conditions Visualizer MicroSim
// Understand KKT conditions for inequality-constrained optimization
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Plot area
let plotMarginLeft = 60;
let plotMarginRight = 250;
let plotMarginTop = 50;
let plotMarginBottom = 50;
let plotWidth, plotHeight;
let xMin = -1, xMax = 4;
let yMin = -1, yMax = 4;

// UI controls
let constraint1Checkbox, constraint2Checkbox, constraint3Checkbox;
let solveButton;

// State
let currentPoint = { x: 2, y: 2 };
let optimalPoint = null;
let isDragging = false;
let isAnimating = false;

// Constraints (inequality: g(x,y) <= 0)
// g1: x >= 0  =>  -x <= 0
// g2: y >= 0  =>  -y <= 0
// g3: x + y <= 3
let constraints = [
  { enabled: true, g: (x, y) => -x, grad: (x, y) => [-1, 0], label: 'g₁: x ≥ 0' },
  { enabled: true, g: (x, y) => -y, grad: (x, y) => [0, -1], label: 'g₂: y ≥ 0' },
  { enabled: true, g: (x, y) => x + y - 3, grad: (x, y) => [1, 1], label: 'g₃: x + y ≤ 3' }
];

// Objective: minimize f(x,y) = (x-2)² + (y-2)²  (distance from (2,2))
// This has minimum at (2,2) but may be constrained

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
  plotHeight = drawHeight - plotMarginTop - plotMarginBottom;

  // Create constraint checkboxes
  constraint1Checkbox = createCheckbox('g₁: x ≥ 0', true);
  constraint1Checkbox.position(10, drawHeight + 10);
  constraint1Checkbox.changed(() => {
    constraints[0].enabled = constraint1Checkbox.checked();
    findOptimum();
  });

  constraint2Checkbox = createCheckbox('g₂: y ≥ 0', true);
  constraint2Checkbox.position(120, drawHeight + 10);
  constraint2Checkbox.changed(() => {
    constraints[1].enabled = constraint2Checkbox.checked();
    findOptimum();
  });

  constraint3Checkbox = createCheckbox('g₃: x + y ≤ 3', true);
  constraint3Checkbox.position(230, drawHeight + 10);
  constraint3Checkbox.changed(() => {
    constraints[2].enabled = constraint3Checkbox.checked();
    findOptimum();
  });

  solveButton = createButton('Solve');
  solveButton.position(10, drawHeight + 45);
  solveButton.mousePressed(animateToOptimum);

  findOptimum();

  describe('Visualization of KKT conditions showing feasible region, active constraints, and optimal point', LABEL);
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
  if (isAnimating && optimalPoint) {
    let dx = optimalPoint.x - currentPoint.x;
    let dy = optimalPoint.y - currentPoint.y;
    if (sqrt(dx * dx + dy * dy) < 0.01) {
      currentPoint.x = optimalPoint.x;
      currentPoint.y = optimalPoint.y;
      isAnimating = false;
    } else {
      currentPoint.x += dx * 0.1;
      currentPoint.y += dy * 0.1;
    }
  }

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('KKT Conditions Visualizer', canvasWidth / 2 - 100, 10);

  // Draw objective contours
  drawObjectiveContours();

  // Draw feasible region
  drawFeasibleRegion();

  // Draw constraint boundaries
  drawConstraintBoundaries();

  // Draw optimal point
  if (optimalPoint) {
    fill(50, 200, 50);
    stroke('white');
    strokeWeight(2);
    ellipse(mapX(optimalPoint.x), mapY(optimalPoint.y), 16, 16);
  }

  // Draw current point
  let screenX = mapX(currentPoint.x);
  let screenY = mapY(currentPoint.y);

  // Check if current point is feasible
  let isFeasible = checkFeasibility(currentPoint.x, currentPoint.y);

  fill(isFeasible ? color(0, 100, 255) : color(255, 100, 100));
  stroke('white');
  strokeWeight(2);
  ellipse(screenX, screenY, 14, 14);

  // Draw unconstrained minimum
  fill(200, 200, 200);
  noStroke();
  ellipse(mapX(2), mapY(2), 10, 10);

  // Draw info panel
  drawInfoPanel();

  // Draw KKT status panel
  drawKKTPanel();

  // Draw control instruction
  fill('black');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Click to place point. Toggle constraints to see how optimal point changes.', 10, drawHeight + 80);
}

function drawObjectiveContours() {
  // Contours of f(x,y) = (x-2)² + (y-2)²
  let levels = [0.25, 0.5, 1, 2, 4, 8];

  stroke(220);
  strokeWeight(1);
  noFill();

  for (let level of levels) {
    beginShape();
    let r = sqrt(level);
    for (let t = 0; t <= TWO_PI; t += 0.05) {
      let x = 2 + r * cos(t);
      let y = 2 + r * sin(t);
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        vertex(mapX(x), mapY(y));
      }
    }
    endShape();
  }
}

function drawFeasibleRegion() {
  // Draw the feasible region as a shaded polygon
  fill(100, 200, 100, 50);
  noStroke();

  // Feasible region with all constraints: triangle (0,0), (3,0), (0,3)
  // Adjust based on which constraints are enabled
  beginShape();

  if (constraints[0].enabled && constraints[1].enabled && constraints[2].enabled) {
    // Triangle
    vertex(mapX(0), mapY(0));
    vertex(mapX(3), mapY(0));
    vertex(mapX(0), mapY(3));
  } else if (constraints[0].enabled && constraints[1].enabled) {
    // First quadrant
    vertex(mapX(0), mapY(0));
    vertex(mapX(xMax), mapY(0));
    vertex(mapX(xMax), mapY(yMax));
    vertex(mapX(0), mapY(yMax));
  } else if (constraints[0].enabled && constraints[2].enabled) {
    // x >= 0, x + y <= 3
    vertex(mapX(0), mapY(yMin));
    vertex(mapX(0), mapY(3));
    vertex(mapX(3), mapY(0));
    vertex(mapX(3), mapY(yMin));
  } else if (constraints[1].enabled && constraints[2].enabled) {
    // y >= 0, x + y <= 3
    vertex(mapX(xMin), mapY(0));
    vertex(mapX(3), mapY(0));
    vertex(mapX(0), mapY(3));
    vertex(mapX(xMin), mapY(3 - xMin));
  } else if (constraints[0].enabled) {
    // x >= 0 only
    vertex(mapX(0), mapY(yMin));
    vertex(mapX(0), mapY(yMax));
    vertex(mapX(xMax), mapY(yMax));
    vertex(mapX(xMax), mapY(yMin));
  } else if (constraints[1].enabled) {
    // y >= 0 only
    vertex(mapX(xMin), mapY(0));
    vertex(mapX(xMax), mapY(0));
    vertex(mapX(xMax), mapY(yMax));
    vertex(mapX(xMin), mapY(yMax));
  } else if (constraints[2].enabled) {
    // x + y <= 3 only
    vertex(mapX(xMin), mapY(3 - xMin));
    vertex(mapX(3 - yMin), mapY(yMin));
    vertex(mapX(xMax), mapY(yMin));
    vertex(mapX(xMax), mapY(yMax));
    vertex(mapX(xMin), mapY(yMax));
  } else {
    // No constraints - entire region
    vertex(mapX(xMin), mapY(yMin));
    vertex(mapX(xMax), mapY(yMin));
    vertex(mapX(xMax), mapY(yMax));
    vertex(mapX(xMin), mapY(yMax));
  }

  endShape(CLOSE);
}

function drawConstraintBoundaries() {
  strokeWeight(2);

  // g1: x = 0 (y-axis)
  if (constraints[0].enabled) {
    let active = optimalPoint && abs(optimalPoint.x) < 0.01;
    stroke(active ? color(255, 150, 0) : color(100, 100, 200));
    line(mapX(0), mapY(yMin), mapX(0), mapY(yMax));
  }

  // g2: y = 0 (x-axis)
  if (constraints[1].enabled) {
    let active = optimalPoint && abs(optimalPoint.y) < 0.01;
    stroke(active ? color(255, 150, 0) : color(100, 100, 200));
    line(mapX(xMin), mapY(0), mapX(xMax), mapY(0));
  }

  // g3: x + y = 3
  if (constraints[2].enabled) {
    let active = optimalPoint && abs(optimalPoint.x + optimalPoint.y - 3) < 0.01;
    stroke(active ? color(255, 150, 0) : color(100, 100, 200));
    line(mapX(xMin), mapY(3 - xMin), mapX(3 - yMin), mapY(yMin));
  }
}

function drawInfoPanel() {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = plotMarginTop;
  let panelW = plotMarginRight - 20;
  let panelH = 120;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);

  text('Objective: min (x-2)² + (y-2)²', panelX + 10, panelY + 10);

  let fVal = Math.pow(currentPoint.x - 2, 2) + Math.pow(currentPoint.y - 2, 2);
  text('f = ' + fVal.toFixed(4), panelX + 10, panelY + 30);

  text('Point: (' + currentPoint.x.toFixed(2) + ', ' + currentPoint.y.toFixed(2) + ')', panelX + 10, panelY + 50);

  let feasible = checkFeasibility(currentPoint.x, currentPoint.y);
  fill(feasible ? color(50, 150, 50) : color(200, 50, 50));
  text(feasible ? 'Feasible' : 'Infeasible', panelX + 10, panelY + 70);

  if (optimalPoint) {
    fill(50, 150, 50);
    text('Optimal: (' + optimalPoint.x.toFixed(2) + ', ' + optimalPoint.y.toFixed(2) + ')', panelX + 10, panelY + 95);
  }
}

function drawKKTPanel() {
  let panelX = canvasWidth - plotMarginRight + 10;
  let panelY = 185;
  let panelW = plotMarginRight - 20;
  let panelH = 180;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);

  text('KKT Conditions:', panelX + 10, panelY + 10);

  let yOffset = 30;

  // List active constraints with multipliers
  for (let i = 0; i < constraints.length; i++) {
    let c = constraints[i];
    if (!c.enabled) continue;

    let gVal = c.g(optimalPoint ? optimalPoint.x : currentPoint.x,
      optimalPoint ? optimalPoint.y : currentPoint.y);
    let isActive = abs(gVal) < 0.01;

    fill(isActive ? color(255, 150, 0) : color(100, 150, 100));
    text(c.label + (isActive ? ' (ACTIVE)' : ' (inactive)'), panelX + 10, panelY + yOffset);
    yOffset += 18;

    // Show multiplier
    let mu = isActive ? (i === 2 ? 2 : 0) : 0;  // Simplified
    fill('black');
    text('  \u03BC' + (i + 1) + ' = ' + (isActive ? '> 0' : '0'), panelX + 10, panelY + yOffset);
    yOffset += 20;
  }

  // Complementary slackness note
  fill(100);
  textSize(10);
  text('Complementary slackness:', panelX + 10, panelY + 140);
  text('\u03BC\u1D62 g\u1D62(x*) = 0 for all i', panelX + 10, panelY + 155);
}

function findOptimum() {
  // For this specific problem, compute the constrained optimum
  let unconstrained = { x: 2, y: 2 };

  // Check if unconstrained is feasible
  if (checkFeasibility(unconstrained.x, unconstrained.y)) {
    optimalPoint = unconstrained;
    return;
  }

  // Otherwise, find the closest feasible point
  // Check constraint boundaries
  let candidates = [];

  // Interior of feasible region (already checked above)

  // On g3: x + y = 3, closest point to (2,2) is (1.5, 1.5)
  if (constraints[2].enabled) {
    candidates.push({ x: 1.5, y: 1.5 });
  }

  // Corners
  if (constraints[0].enabled && constraints[1].enabled) {
    candidates.push({ x: 0, y: 0 });
  }
  if (constraints[0].enabled && constraints[2].enabled) {
    candidates.push({ x: 0, y: 3 });
  }
  if (constraints[1].enabled && constraints[2].enabled) {
    candidates.push({ x: 3, y: 0 });
  }

  // Edge projections
  if (constraints[0].enabled && !constraints[2].enabled) {
    candidates.push({ x: 0, y: 2 });
  }
  if (constraints[1].enabled && !constraints[2].enabled) {
    candidates.push({ x: 2, y: 0 });
  }

  // Find best feasible candidate
  let bestDist = Infinity;
  optimalPoint = null;

  for (let c of candidates) {
    if (checkFeasibility(c.x, c.y)) {
      let dist = Math.pow(c.x - 2, 2) + Math.pow(c.y - 2, 2);
      if (dist < bestDist) {
        bestDist = dist;
        optimalPoint = c;
      }
    }
  }
}

function checkFeasibility(x, y) {
  for (let c of constraints) {
    if (c.enabled && c.g(x, y) > 0.001) {
      return false;
    }
  }
  return true;
}

function animateToOptimum() {
  if (optimalPoint) {
    isAnimating = true;
  }
}

// Mouse interaction
function mousePressed() {
  if (mouseX >= plotMarginLeft && mouseX <= canvasWidth - plotMarginRight &&
    mouseY >= plotMarginTop && mouseY <= drawHeight - plotMarginBottom) {
    currentPoint.x = unmapX(mouseX);
    currentPoint.y = unmapY(mouseY);
    isAnimating = false;
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
  plotWidth = canvasWidth - plotMarginLeft - plotMarginRight;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
