// Change of Basis Interactive Visualizer
// Shows how the same vector has different coordinate representations in different bases
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout
let margin = 15;
let sliderLeftMargin = 150;
let defaultTextSize = 14;

// Bases
let standardBasis = [[1, 0], [0, 1]];
let customBasis = [[1, 0.5], [0.3, 1]];  // Initial custom basis

// Vector to display
let vector = [2, 1.5];

// Controls
let basisAngleSlider, basisScaleSlider;
let showBothCheckbox, showGridCheckbox;
let presetSelect;
let resetButton;

// Drawing scale
let scale = 50;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Basis controls
  presetSelect = createSelect();
  presetSelect.position(10, drawHeight + 5);
  presetSelect.option('Rotated 30°', 'rotated');
  presetSelect.option('Skewed', 'skewed');
  presetSelect.option('Scaled', 'scaled');
  presetSelect.option('Custom', 'custom');
  presetSelect.changed(applyPreset);

  basisAngleSlider = createSlider(-60, 60, 30, 1);
  basisAngleSlider.position(sliderLeftMargin, drawHeight + 5);
  basisAngleSlider.size(150);

  resetButton = createButton('Reset Vector');
  resetButton.position(canvasWidth - 120, drawHeight + 5);
  resetButton.mousePressed(resetVector);

  // Row 2: Display options
  showBothCheckbox = createCheckbox('Overlay Bases', false);
  showBothCheckbox.position(10, drawHeight + 40);
  showBothCheckbox.style('font-size', '14px');

  showGridCheckbox = createCheckbox('Show Grids', true);
  showGridCheckbox.position(130, drawHeight + 40);
  showGridCheckbox.style('font-size', '14px');

  applyPreset();

  describe('Change of basis visualizer showing how the same vector has different coordinates in different bases', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Update custom basis from slider
  if (presetSelect.value() === 'custom' || presetSelect.value() === 'rotated') {
    let angle = radians(basisAngleSlider.value());
    customBasis = [
      [cos(angle), sin(angle)],
      [-sin(angle), cos(angle)]
    ];
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Change of Basis Visualizer', canvasWidth / 2, 5);

  // Layout
  let viewWidth = canvasWidth / 2 - 20;
  let leftCenterX = viewWidth / 2 + 10;
  let rightCenterX = canvasWidth - viewWidth / 2 - 10;
  let centerY = drawHeight / 2 + 20;

  // Calculate coordinates in both bases
  let standardCoords = vector;  // Already in standard coords
  let customCoords = vectorInBasis(vector, customBasis);

  // Draw standard basis view (left)
  if (!showBothCheckbox.checked()) {
    push();
    translate(leftCenterX, centerY);
    drawBasisView(standardBasis, standardCoords, 'Standard Basis', color(50, 50, 200), true);
    pop();
  }

  // Draw custom basis view (right) or overlay
  push();
  translate(showBothCheckbox.checked() ? canvasWidth / 2 : rightCenterX, centerY);

  if (showBothCheckbox.checked()) {
    // Overlay both bases
    drawBasisView(standardBasis, standardCoords, '', color(50, 50, 200, 100), false);
  }

  drawBasisView(customBasis, customCoords, 'Custom Basis', color(200, 50, 50), !showBothCheckbox.checked());
  pop();

  // Draw the vector in both views
  if (!showBothCheckbox.checked()) {
    // Standard basis view
    push();
    translate(leftCenterX, centerY);
    drawVector(vector, color(50, 180, 50), 'v');
    pop();

    // Custom basis view
    push();
    translate(rightCenterX, centerY);
    drawVector(vector, color(50, 180, 50), 'v');
    pop();
  } else {
    // Overlay view
    push();
    translate(canvasWidth / 2, centerY);
    drawVector(vector, color(50, 180, 50), 'v');
    pop();
  }

  // Labels
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);

  if (!showBothCheckbox.checked()) {
    text('Standard Basis', leftCenterX, 28);
    text('Custom Basis', rightCenterX, 28);
  } else {
    text('Both Bases Overlaid', canvasWidth / 2, 28);
  }

  // Draw coordinate info panels
  drawCoordinatePanels(standardCoords, customCoords);

  // Draw transition matrix
  drawTransitionMatrix();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Basis rotation: ' + nf(basisAngleSlider.value(), 1, 0) + '°', 320, drawHeight + 15);
}

function drawBasisView(basis, coords, label, col, drawAxesFlag) {
  let showGrid = showGridCheckbox.checked();

  // Draw grid in this basis
  if (showGrid) {
    stroke(red(col), green(col), blue(col), 50);
    strokeWeight(1);

    for (let i = -4; i <= 4; i++) {
      // Lines along basis[0] direction
      let p1 = addVec(scaleVec(basis[0], -4), scaleVec(basis[1], i));
      let p2 = addVec(scaleVec(basis[0], 4), scaleVec(basis[1], i));
      line(p1[0] * scale, -p1[1] * scale, p2[0] * scale, -p2[1] * scale);

      // Lines along basis[1] direction
      p1 = addVec(scaleVec(basis[1], -4), scaleVec(basis[0], i));
      p2 = addVec(scaleVec(basis[1], 4), scaleVec(basis[0], i));
      line(p1[0] * scale, -p1[1] * scale, p2[0] * scale, -p2[1] * scale);
    }
  }

  // Draw coordinate axes
  if (drawAxesFlag) {
    stroke(180);
    strokeWeight(1);
    line(-scale * 3.5, 0, scale * 3.5, 0);
    line(0, -scale * 3, 0, scale * 3);
  }

  // Draw basis vectors
  let b1 = basis[0];
  let b2 = basis[1];

  // b1
  stroke(col);
  strokeWeight(2);
  drawArrow(0, 0, b1[0] * scale, -b1[1] * scale, col);
  fill(col);
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('b₁', b1[0] * scale + 8, -b1[1] * scale);

  // b2
  drawArrow(0, 0, b2[0] * scale, -b2[1] * scale, col);
  fill(col);
  noStroke();
  text('b₂', b2[0] * scale + 8, -b2[1] * scale - 5);
}

function drawVector(v, col, label) {
  drawArrow(0, 0, v[0] * scale, -v[1] * scale, col);

  fill(col);
  noStroke();
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text(label, v[0] * scale + 10, -v[1] * scale - 5);

  // Drag handle
  fill(200, 255, 200);
  stroke(col);
  strokeWeight(2);
  ellipse(v[0] * scale, -v[1] * scale, 14, 14);
}

function drawArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(2);
  line(x1, y1, x2, y2);

  let angle = atan2(y2 - y1, x2 - x1);
  let arrowSize = 10;

  push();
  translate(x2, y2);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -arrowSize, -arrowSize/2.5, -arrowSize, arrowSize/2.5);
  pop();
}

function drawCoordinatePanels(stdCoords, custCoords) {
  // Standard coords panel
  let px = 15;
  let py = drawHeight - 75;

  fill(255, 255, 255, 230);
  stroke(50, 50, 200);
  strokeWeight(1);
  rect(px, py, 140, 55, 5);

  fill(50, 50, 200);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  text('Standard coordinates:', px + 5, py + 5);
  textSize(14);
  text('[v]_std = (' + nf(stdCoords[0], 1, 2) + ', ' + nf(stdCoords[1], 1, 2) + ')', px + 5, py + 22);

  // Custom coords panel
  px = canvasWidth - 155;

  fill(255, 255, 255, 230);
  stroke(200, 50, 50);
  rect(px, py, 140, 55, 5);

  fill(200, 50, 50);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  text('Custom coordinates:', px + 5, py + 5);
  textSize(14);
  text('[v]_B = (' + nf(custCoords[0], 1, 2) + ', ' + nf(custCoords[1], 1, 2) + ')', px + 5, py + 22);
}

function drawTransitionMatrix() {
  // P^-1 (from standard to custom basis)
  let Pinv = invertMatrix(customBasis);

  let px = canvasWidth / 2 - 70;
  let py = drawHeight - 75;

  fill(255, 255, 255, 230);
  stroke(150);
  strokeWeight(1);
  rect(px, py, 140, 55, 5);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(10);
  text('Transition P⁻¹ (std→B):', px + 5, py + 5);

  textSize(11);
  text('[' + nf(Pinv[0][0], 1, 2) + '  ' + nf(Pinv[0][1], 1, 2) + ']', px + 10, py + 22);
  text('[' + nf(Pinv[1][0], 1, 2) + '  ' + nf(Pinv[1][1], 1, 2) + ']', px + 10, py + 36);
}

function vectorInBasis(v, basis) {
  // Solve: v = c1*b1 + c2*b2 for [c1, c2]
  // This is v = B*c, so c = B^-1 * v
  let Binv = invertMatrix(basis);
  return [
    Binv[0][0] * v[0] + Binv[0][1] * v[1],
    Binv[1][0] * v[0] + Binv[1][1] * v[1]
  ];
}

function invertMatrix(m) {
  let det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (abs(det) < 0.001) return [[1, 0], [0, 1]];
  return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det]
  ];
}

function addVec(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function scaleVec(v, s) {
  return [v[0] * s, v[1] * s];
}

function applyPreset() {
  let preset = presetSelect.value();
  switch (preset) {
    case 'rotated':
      basisAngleSlider.value(30);
      let angle = radians(30);
      customBasis = [[cos(angle), sin(angle)], [-sin(angle), cos(angle)]];
      break;
    case 'skewed':
      customBasis = [[1, 0.5], [0.2, 1]];
      basisAngleSlider.value(0);
      break;
    case 'scaled':
      customBasis = [[1.5, 0], [0, 0.8]];
      basisAngleSlider.value(0);
      break;
    case 'custom':
      // Use slider
      break;
  }
}

function resetVector() {
  vector = [2, 1.5];
}

function mousePressed() {
  checkVectorDrag();
}

function mouseDragged() {
  if (draggingVector) {
    let centerX = showBothCheckbox.checked() ? canvasWidth / 2 :
                  (mouseX < canvasWidth / 2 ? canvasWidth / 4 : canvasWidth * 3 / 4);
    let centerY = drawHeight / 2 + 20;

    vector[0] = (mouseX - centerX) / scale;
    vector[1] = -(mouseY - centerY) / scale;

    // Clamp
    vector[0] = constrain(vector[0], -3, 3);
    vector[1] = constrain(vector[1], -2.5, 2.5);

    // Snap
    vector[0] = round(vector[0] * 4) / 4;
    vector[1] = round(vector[1] * 4) / 4;
  }
}

let draggingVector = false;

function checkVectorDrag() {
  let centers = showBothCheckbox.checked() ?
    [[canvasWidth / 2, drawHeight / 2 + 20]] :
    [[canvasWidth / 4, drawHeight / 2 + 20], [canvasWidth * 3 / 4, drawHeight / 2 + 20]];

  for (let [cx, cy] of centers) {
    let vx = cx + vector[0] * scale;
    let vy = cy - vector[1] * scale;
    if (dist(mouseX, mouseY, vx, vy) < 15) {
      draggingVector = true;
      return;
    }
  }
  draggingVector = false;
}

function mouseReleased() {
  draggingVector = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  resetButton.position(canvasWidth - 120, drawHeight + 5);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
