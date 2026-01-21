// Least Squares Problem Visualizer MicroSim
// Visualize least squares as projection and see geometric relationships
// Learning objective: Understand least squares as projection and visualize b, Ax̂, and error

let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// View modes
let viewMode = 'regression';  // 'regression' or 'geometric'

// Data points for regression view (5 points)
let dataPoints = [];
let numPoints = 5;

// Least squares solution
let slope = 0;
let intercept = 0;
let sumSquaredResiduals = 0;

// Geometric view vectors (for 3D visualization)
let vecB = [2, 3, 1];       // Vector b (observation)
let colSpace = [[1, 0, 0], [0, 1, 0]];  // Column space of A (2 basis vectors)
let projAxHat = [0, 0, 0];  // Projection Ax̂
let errorVec = [0, 0, 0];   // Error e = b - Ax̂

// UI elements
let viewSelect;
let showNormalEqCheckbox, showResidualsCheckbox;
let methodSelect;
let resetButton;

// Geometric view controls
let bxSlider, bySlider, bzSlider;

// 3D rotation for geometric view
let rotX = -0.5;
let rotY = 0.6;
let isDragging = false;
let lastMouseX, lastMouseY;
let scale3D = 60;

// Dragging data points
let draggedPoint = -1;

// Font for WEBGL
let font;

// Condition number and method info
let conditionNumber = 1;
let methodInfo = { name: 'Normal Equations', time: '1.0x' };

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent(document.querySelector('main'));
  textFont(font);

  // Initialize data points
  initializeDataPoints();

  // Row 1 controls
  let row1Y = drawHeight + 10;

  // View mode selector
  viewSelect = createSelect();
  viewSelect.position(70, row1Y);
  viewSelect.option('Regression View');
  viewSelect.option('Geometric View');
  viewSelect.selected('Regression View');
  viewSelect.changed(onViewChange);

  // Method comparison selector
  methodSelect = createSelect();
  methodSelect.position(250, row1Y);
  methodSelect.option('Normal Equations');
  methodSelect.option('QR Decomposition');
  methodSelect.option('SVD Method');
  methodSelect.selected('Normal Equations');
  methodSelect.changed(updateMethodInfo);

  // Checkboxes
  showResidualsCheckbox = createCheckbox('Show Residuals', true);
  showResidualsCheckbox.position(420, row1Y);
  showResidualsCheckbox.style('font-size', '13px');

  showNormalEqCheckbox = createCheckbox('Show Equations', true);
  showNormalEqCheckbox.position(550, row1Y);
  showNormalEqCheckbox.style('font-size', '13px');

  resetButton = createButton('Reset');
  resetButton.position(canvasWidth - 70, row1Y);
  resetButton.mousePressed(resetSimulation);

  // Row 2: Sliders for geometric view (initially hidden)
  let row2Y = drawHeight + 45;

  bxSlider = createSlider(-3, 3, vecB[0], 0.1);
  bxSlider.position(70, row2Y);
  bxSlider.size(80);
  bxSlider.input(updateGeometricProjection);
  bxSlider.style('display', 'none');

  bySlider = createSlider(-3, 3, vecB[1], 0.1);
  bySlider.position(200, row2Y);
  bySlider.size(80);
  bySlider.input(updateGeometricProjection);
  bySlider.style('display', 'none');

  bzSlider = createSlider(-3, 3, vecB[2], 0.1);
  bzSlider.position(330, row2Y);
  bzSlider.size(80);
  bzSlider.input(updateGeometricProjection);
  bzSlider.style('display', 'none');

  // Compute initial solutions
  computeLeastSquares();
  updateGeometricProjection();
  updateMethodInfo();

  describe('Least squares problem visualizer showing regression and geometric views', LABEL);
}

function draw() {
  updateCanvasSize();
  background(245);

  if (viewMode === 'regression') {
    drawRegressionView();
  } else {
    drawGeometricView();
  }

  draw2DOverlay();
}

// =====================
// REGRESSION VIEW
// =====================

function drawRegressionView() {
  push();
  resetMatrix();
  translate(-canvasWidth / 2, -canvasHeight / 2);

  // Define plot area
  let plotLeft = 80;
  let plotRight = canvasWidth - 220;
  let plotTop = 60;
  let plotBottom = drawHeight - 40;
  let plotWidth = plotRight - plotLeft;
  let plotHeight = plotBottom - plotTop;

  // Draw plot background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(plotLeft, plotTop, plotWidth, plotHeight);

  // Find data range
  let xMin = -0.5, xMax = 5.5;
  let yMin = -1, yMax = 6;

  // Draw grid
  stroke(230);
  strokeWeight(1);
  for (let x = 0; x <= 5; x++) {
    let px = map(x, xMin, xMax, plotLeft, plotRight);
    line(px, plotTop, px, plotBottom);
  }
  for (let y = 0; y <= 6; y++) {
    let py = map(y, yMin, yMax, plotBottom, plotTop);
    line(plotLeft, py, plotRight, py);
  }

  // Draw axes
  stroke(100);
  strokeWeight(2);
  // X-axis
  let xAxisY = map(0, yMin, yMax, plotBottom, plotTop);
  line(plotLeft, xAxisY, plotRight, xAxisY);
  // Y-axis
  let yAxisX = map(0, xMin, xMax, plotLeft, plotRight);
  line(yAxisX, plotTop, yAxisX, plotBottom);

  // Axis labels
  fill(80);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  for (let x = 0; x <= 5; x++) {
    let px = map(x, xMin, xMax, plotLeft, plotRight);
    text(x, px, plotBottom + 5);
  }
  textAlign(RIGHT, CENTER);
  for (let y = 0; y <= 6; y++) {
    let py = map(y, yMin, yMax, plotBottom, plotTop);
    text(y, plotLeft - 5, py);
  }

  // Axis titles
  textAlign(CENTER, TOP);
  textSize(14);
  text('x', (plotLeft + plotRight) / 2, plotBottom + 20);

  push();
  translate(plotLeft - 40, (plotTop + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('y', 0, 0);
  pop();

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

  py1 = constrain(py1, plotTop, plotBottom);
  py2 = constrain(py2, plotTop, plotBottom);
  line(px1, py1, px2, py2);

  // Draw residuals if enabled
  if (showResidualsCheckbox.checked()) {
    stroke(50, 180, 50, 180);
    strokeWeight(2);
    for (let pt of dataPoints) {
      let px = map(pt.x, xMin, xMax, plotLeft, plotRight);
      let py = map(pt.y, yMin, yMax, plotBottom, plotTop);
      let predictedY = slope * pt.x + intercept;
      let pPredY = map(predictedY, yMin, yMax, plotBottom, plotTop);

      // Dashed residual line
      drawDashedLine2D(px, py, px, pPredY);
    }
  }

  // Draw data points
  for (let i = 0; i < dataPoints.length; i++) {
    let pt = dataPoints[i];
    let px = map(pt.x, xMin, xMax, plotLeft, plotRight);
    let py = map(pt.y, yMin, yMax, plotBottom, plotTop);

    // Highlight if being dragged
    if (i === draggedPoint) {
      fill(80, 80, 220);
      stroke(40, 40, 180);
      strokeWeight(2);
      ellipse(px, py, 18, 18);
    } else {
      fill(50, 50, 220);
      stroke(30, 30, 180);
      strokeWeight(2);
      ellipse(px, py, 14, 14);
    }
  }

  pop();
}

function drawDashedLine2D(x1, y1, x2, y2) {
  let steps = 8;
  for (let i = 0; i < steps; i += 2) {
    let t1 = i / steps;
    let t2 = (i + 1) / steps;
    line(
      lerp(x1, x2, t1), lerp(y1, y2, t1),
      lerp(x1, x2, t2), lerp(y1, y2, t2)
    );
  }
}

// =====================
// GEOMETRIC VIEW
// =====================

function drawGeometricView() {
  push();

  // Apply 3D rotation
  rotateX(rotX);
  rotateY(rotY);

  // Draw coordinate axes
  drawAxes3D();

  // Draw column space plane
  drawColumnSpacePlane();

  // Draw vector b (observation) - blue
  drawVector3D(vecB, color(50, 50, 220), 'b', 3);

  // Draw projection Ax̂ - red
  drawVector3D(projAxHat, color(220, 50, 50), 'Ax\u0302', 3);

  // Draw error vector e = b - Ax̂ - green, perpendicular to plane
  if (showResidualsCheckbox.checked()) {
    drawErrorVector3D();
  }

  pop();
}

function drawAxes3D() {
  let axisLen = 150;
  strokeWeight(1);

  // X axis (red)
  stroke(180, 80, 80, 150);
  line(-axisLen, 0, 0, axisLen, 0, 0);

  // Y axis (green)
  stroke(80, 180, 80, 150);
  line(0, -axisLen, 0, 0, axisLen, 0);

  // Z axis (blue)
  stroke(80, 80, 180, 150);
  line(0, 0, -axisLen, 0, 0, axisLen);

  // Grid on XZ plane
  stroke(220);
  strokeWeight(0.5);
  let gridStep = 40;
  for (let i = -3; i <= 3; i++) {
    line(i * gridStep, 0, -axisLen, i * gridStep, 0, axisLen);
    line(-axisLen, 0, i * gridStep, axisLen, 0, i * gridStep);
  }

  // Axis labels
  push();
  fill(150, 80, 80);
  noStroke();
  textSize(14);
  translate(axisLen + 10, 0, 0);
  text('x', 0, 0);
  pop();

  push();
  fill(80, 150, 80);
  noStroke();
  textSize(14);
  translate(0, -axisLen - 10, 0);
  text('y', 0, 0);
  pop();

  push();
  fill(80, 80, 150);
  noStroke();
  textSize(14);
  translate(0, 0, axisLen + 10);
  text('z', 0, 0);
  pop();
}

function drawColumnSpacePlane() {
  // Draw plane representing column space of A
  let planeSize = 120;

  // Draw translucent plane
  push();
  fill(100, 150, 200, 70);
  noStroke();

  beginShape(TRIANGLES);
  let steps = 10;
  for (let i = -steps; i < steps; i++) {
    for (let j = -steps; j < steps; j++) {
      let s1 = i / steps;
      let t1 = j / steps;
      let s2 = (i + 1) / steps;
      let t2 = (j + 1) / steps;

      // Points on plane: s * col1 + t * col2
      let p1 = planePoint3D(s1, t1, planeSize);
      let p2 = planePoint3D(s2, t1, planeSize);
      let p3 = planePoint3D(s1, t2, planeSize);
      let p4 = planePoint3D(s2, t2, planeSize);

      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
      vertex(p3.x, p3.y, p3.z);

      vertex(p2.x, p2.y, p2.z);
      vertex(p4.x, p4.y, p4.z);
      vertex(p3.x, p3.y, p3.z);
    }
  }
  endShape();
  pop();

  // Draw plane border
  stroke(100, 150, 200, 180);
  strokeWeight(1);
  noFill();
  beginShape();
  let corners = [
    planePoint3D(-1, -1, planeSize),
    planePoint3D(1, -1, planeSize),
    planePoint3D(1, 1, planeSize),
    planePoint3D(-1, 1, planeSize)
  ];
  for (let c of corners) {
    vertex(c.x, c.y, c.z);
  }
  endShape(CLOSE);

  // Label the plane
  push();
  fill(80, 120, 160);
  noStroke();
  textSize(14);
  translate(planeSize * 0.8, -10, planeSize * 0.8);
  text('Col(A)', 0, 0);
  pop();
}

function planePoint3D(s, t, size) {
  return {
    x: (s * colSpace[0][0] + t * colSpace[1][0]) * size,
    y: -(s * colSpace[0][1] + t * colSpace[1][1]) * size,
    z: (s * colSpace[0][2] + t * colSpace[1][2]) * size
  };
}

function drawVector3D(v, col, label, weight) {
  let x = v[0] * scale3D;
  let y = -v[1] * scale3D;
  let z = v[2] * scale3D;

  // Draw vector line
  strokeWeight(weight);
  stroke(col);
  line(0, 0, 0, x, y, z);

  // Arrowhead as sphere
  push();
  translate(x, y, z);
  noStroke();
  fill(col);
  sphere(5);
  pop();

  // Label
  push();
  translate(x * 1.12, y * 1.12, z * 1.12);
  fill(col);
  noStroke();
  textSize(14);
  text(label, 0, 0);
  pop();
}

function drawErrorVector3D() {
  // Draw error vector from projection to b
  let px = projAxHat[0] * scale3D;
  let py = -projAxHat[1] * scale3D;
  let pz = projAxHat[2] * scale3D;

  let bx = vecB[0] * scale3D;
  let by = -vecB[1] * scale3D;
  let bz = vecB[2] * scale3D;

  // Draw dashed line
  strokeWeight(2);
  stroke(50, 180, 50);
  drawDashedLine3D(px, py, pz, bx, by, bz);

  // Draw small sphere at projection point
  push();
  translate(px, py, pz);
  noStroke();
  fill(50, 180, 50);
  sphere(4);
  pop();

  // Label
  let midX = (px + bx) / 2;
  let midY = (py + by) / 2;
  let midZ = (pz + bz) / 2;

  push();
  translate(midX + 10, midY, midZ);
  fill(50, 180, 50);
  noStroke();
  textSize(14);
  text('e', 0, 0);
  pop();

  // Draw right angle indicator
  drawRightAngleIndicator3D();
}

function drawRightAngleIndicator3D() {
  let px = projAxHat[0] * scale3D;
  let py = -projAxHat[1] * scale3D;
  let pz = projAxHat[2] * scale3D;

  // Error direction (normalized)
  let errLen = vecLength(errorVec);
  if (errLen < 0.001) return;

  let errDir = normalize3D(errorVec);

  // Get a direction in the plane
  let planeDir = normalize3D(colSpace[0]);

  let indicatorSize = 12;

  stroke(50, 180, 50, 200);
  strokeWeight(1.5);

  let e1 = [-errDir[0] * indicatorSize, errDir[1] * indicatorSize, -errDir[2] * indicatorSize];
  let s1 = [planeDir[0] * indicatorSize, -planeDir[1] * indicatorSize, planeDir[2] * indicatorSize];

  line(px + e1[0], py + e1[1], pz + e1[2],
    px + e1[0] + s1[0], py + e1[1] + s1[1], pz + e1[2] + s1[2]);
  line(px + s1[0], py + s1[1], pz + s1[2],
    px + e1[0] + s1[0], py + e1[1] + s1[1], pz + e1[2] + s1[2]);
}

function drawDashedLine3D(x1, y1, z1, x2, y2, z2) {
  let segments = 10;
  for (let i = 0; i < segments; i += 2) {
    let t1 = i / segments;
    let t2 = (i + 1) / segments;
    line(
      lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(z1, z2, t1),
      lerp(x1, x2, t2), lerp(y1, y2, t2), lerp(z1, z2, t2)
    );
  }
}

// =====================
// 2D OVERLAY
// =====================

function draw2DOverlay() {
  push();
  resetMatrix();
  translate(-canvasWidth / 2, -canvasHeight / 2);

  // Title
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  let title = viewMode === 'regression' ?
    'Least Squares: Linear Regression' :
    'Least Squares: Geometric Projection';
  text(title, canvasWidth / 2, 10);

  // Info panel
  drawInfoPanel();

  // Normal equations panel
  if (showNormalEqCheckbox.checked()) {
    drawEquationsPanel();
  }

  // Control area background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control labels
  noStroke();
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('View:', 10, drawHeight + 20);
  text('Method:', 190, drawHeight + 20);

  // Slider labels for geometric view
  if (viewMode === 'geometric') {
    fill(50, 50, 220);
    text('b: x', 10, drawHeight + 55);
    text('y', 155, drawHeight + 55);
    text('z', 285, drawHeight + 55);

    fill(100);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text('Drag to rotate 3D view', canvasWidth - 20, drawHeight + 55);
  } else {
    fill(100);
    textSize(10);
    textAlign(LEFT, CENTER);
    text('Drag data points to adjust', 10, drawHeight + 55);
  }

  pop();
}

function drawInfoPanel() {
  let px = 10;
  let py = 40;

  fill(255, 255, 255, 245);
  stroke(200);
  strokeWeight(1);
  rect(px, py, 180, viewMode === 'regression' ? 130 : 150, 8);

  fill(0);
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  text('Solution:', px + 10, py + 10);

  textSize(11);

  if (viewMode === 'regression') {
    fill(220, 50, 50);
    text('y\u0302 = ' + nf(slope, 1, 3) + 'x + ' + nf(intercept, 1, 3), px + 10, py + 35);

    fill(0);
    text('Slope (m): ' + nf(slope, 1, 4), px + 10, py + 55);
    text('Intercept (b): ' + nf(intercept, 1, 4), px + 10, py + 73);

    fill(50, 180, 50);
    text('SSR: ' + nf(sumSquaredResiduals, 1, 4), px + 10, py + 95);

    // Condition number warning
    if (conditionNumber > 100) {
      fill(200, 100, 0);
      textSize(10);
      text('Warning: High condition', px + 10, py + 115);
      text('number (' + nf(conditionNumber, 1, 1) + ')', px + 10, py + 128);
    }
  } else {
    fill(50, 50, 220);
    text('b = (' + nf(vecB[0], 1, 2) + ', ' + nf(vecB[1], 1, 2) + ', ' + nf(vecB[2], 1, 2) + ')', px + 10, py + 35);

    fill(220, 50, 50);
    text('Ax\u0302 = (' + nf(projAxHat[0], 1, 2) + ', ' + nf(projAxHat[1], 1, 2) + ', ' + nf(projAxHat[2], 1, 2) + ')', px + 10, py + 55);

    fill(50, 180, 50);
    text('e = (' + nf(errorVec[0], 1, 2) + ', ' + nf(errorVec[1], 1, 2) + ', ' + nf(errorVec[2], 1, 2) + ')', px + 10, py + 75);

    fill(0);
    text('||e|| = ' + nf(vecLength(errorVec), 1, 4), px + 10, py + 95);

    // Orthogonality check
    let orthCheck = dotProduct3D(errorVec, colSpace[0]).toFixed(4);
    textSize(10);
    fill(80);
    text('e \u00B7 Col(A) = ' + orthCheck, px + 10, py + 115);
    text('(should be ~0)', px + 10, py + 130);
  }
}

function drawEquationsPanel() {
  let px = canvasWidth - 210;
  let py = 40;

  fill(255, 255, 255, 245);
  stroke(200);
  strokeWeight(1);
  rect(px, py, 200, 160, 8);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  text('Normal Equations:', px + 10, py + 10);

  textSize(10);
  fill(80);
  text('A\u1D40Ax\u0302 = A\u1D40b', px + 10, py + 32);

  // Method comparison
  textSize(12);
  fill(0);
  text('Method: ' + methodInfo.name, px + 10, py + 55);

  textSize(10);
  fill(80);
  text('Relative Speed: ' + methodInfo.time, px + 10, py + 75);

  // Key formulas
  textSize(11);
  fill(0);
  text('Key Relationships:', px + 10, py + 100);

  textSize(10);
  fill(80);
  text('Ax\u0302 = projection of b', px + 10, py + 118);
  text('e = b - Ax\u0302 \u22A5 Col(A)', px + 10, py + 133);
  text('||e||\u00B2 = min ||b - Ax||\u00B2', px + 10, py + 148);
}

// =====================
// COMPUTATIONS
// =====================

function initializeDataPoints() {
  dataPoints = [
    { x: 0.5, y: 1.2 },
    { x: 1.5, y: 2.3 },
    { x: 2.5, y: 2.8 },
    { x: 3.5, y: 3.5 },
    { x: 4.5, y: 4.2 }
  ];
}

function computeLeastSquares() {
  // Compute least squares fit: y = mx + b
  // Using normal equations: (A^T A) x = A^T b

  let n = dataPoints.length;

  // Build sums
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let pt of dataPoints) {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumX2 += pt.x * pt.x;
  }

  // A^T A = [[n, sumX], [sumX, sumX2]]
  // A^T b = [sumY, sumXY]

  let det = n * sumX2 - sumX * sumX;

  // Check condition
  let trace = n + sumX2;
  conditionNumber = Math.abs(trace / det) * 10;  // Simplified condition estimate

  if (Math.abs(det) < 0.0001) {
    slope = 0;
    intercept = sumY / n;
  } else {
    intercept = (sumX2 * sumY - sumX * sumXY) / det;
    slope = (n * sumXY - sumX * sumY) / det;
  }

  // Compute sum of squared residuals
  sumSquaredResiduals = 0;
  for (let pt of dataPoints) {
    let residual = pt.y - (slope * pt.x + intercept);
    sumSquaredResiduals += residual * residual;
  }
}

function updateGeometricProjection() {
  // Read slider values
  vecB[0] = bxSlider.value();
  vecB[1] = bySlider.value();
  vecB[2] = bzSlider.value();

  // Project b onto column space of A (XY plane)
  // For simplicity, column space is the XY plane (z=0)
  projAxHat = [vecB[0], vecB[1], 0];

  // Error vector
  errorVec = [
    vecB[0] - projAxHat[0],
    vecB[1] - projAxHat[1],
    vecB[2] - projAxHat[2]
  ];
}

function updateMethodInfo() {
  let method = methodSelect.value();

  if (method === 'Normal Equations') {
    methodInfo = {
      name: 'Normal Equations',
      time: '1.0x (fastest)',
      note: 'Direct solve, may be unstable'
    };
  } else if (method === 'QR Decomposition') {
    methodInfo = {
      name: 'QR Decomposition',
      time: '2.0x',
      note: 'More stable than normal eq.'
    };
  } else {
    methodInfo = {
      name: 'SVD Method',
      time: '5.0x (slowest)',
      note: 'Most stable, handles rank deficiency'
    };
  }
}

// =====================
// EVENT HANDLERS
// =====================

function onViewChange() {
  let selected = viewSelect.value();
  viewMode = selected === 'Regression View' ? 'regression' : 'geometric';

  // Show/hide geometric view sliders
  let showSliders = viewMode === 'geometric';
  bxSlider.style('display', showSliders ? 'block' : 'none');
  bySlider.style('display', showSliders ? 'block' : 'none');
  bzSlider.style('display', showSliders ? 'block' : 'none');
}

function resetSimulation() {
  if (viewMode === 'regression') {
    initializeDataPoints();
    computeLeastSquares();
  } else {
    vecB = [2, 3, 1];
    bxSlider.value(vecB[0]);
    bySlider.value(vecB[1]);
    bzSlider.value(vecB[2]);
    updateGeometricProjection();
  }

  rotX = -0.5;
  rotY = 0.6;
}

// =====================
// MOUSE INTERACTION
// =====================

function mousePressed() {
  if (viewMode === 'regression') {
    // Check if clicking on a data point
    let plotLeft = 80;
    let plotRight = canvasWidth - 220;
    let plotTop = 60;
    let plotBottom = drawHeight - 40;

    let xMin = -0.5, xMax = 5.5;
    let yMin = -1, yMax = 6;

    // Adjust for WEBGL canvas offset
    let mx = mouseX;
    let my = mouseY;

    for (let i = 0; i < dataPoints.length; i++) {
      let pt = dataPoints[i];
      let px = map(pt.x, xMin, xMax, plotLeft, plotRight);
      let py = map(pt.y, yMin, yMax, plotBottom, plotTop);

      if (dist(mx, my, px, py) < 15) {
        draggedPoint = i;
        return;
      }
    }
  } else {
    // Geometric view - start rotation
    if (mouseY < drawHeight && mouseY > 35) {
      isDragging = true;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }
  }
}

function mouseDragged() {
  if (viewMode === 'regression' && draggedPoint >= 0) {
    // Drag data point
    let plotLeft = 80;
    let plotRight = canvasWidth - 220;
    let plotTop = 60;
    let plotBottom = drawHeight - 40;

    let xMin = -0.5, xMax = 5.5;
    let yMin = -1, yMax = 6;

    let newX = map(mouseX, plotLeft, plotRight, xMin, xMax);
    let newY = map(mouseY, plotBottom, plotTop, yMin, yMax);

    dataPoints[draggedPoint].x = constrain(newX, 0, 5);
    dataPoints[draggedPoint].y = constrain(newY, 0, 6);

    computeLeastSquares();
  } else if (viewMode === 'geometric' && isDragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;

    rotY += dx * 0.01;
    rotX += dy * 0.01;
    rotX = constrain(rotX, -HALF_PI + 0.1, HALF_PI - 0.1);

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  draggedPoint = -1;
  isDragging = false;
}

// =====================
// UTILITIES
// =====================

function dotProduct3D(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vecLength(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize3D(v) {
  let len = vecLength(v);
  if (len < 0.0001) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
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
