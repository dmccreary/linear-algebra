// Projection onto Subspace Visualizer MicroSim
// Visualize projection as finding the closest point in a subspace
// Learning objective: Understand projection and orthogonal error

let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Vector v to project
let vecV = [2, 3, 2];

// Subspace definition
// For plane (2D subspace): two basis vectors spanning the plane
// For line (1D subspace): one direction vector
let basisU1 = [1, 0, 0];  // First basis vector
let basisU2 = [0, 1, 0];  // Second basis vector (for plane)

// Computed values
let projP = [0, 0, 0];    // Projection of v onto subspace
let errorE = [0, 0, 0];   // Error vector e = v - p

// Subspace type: 'plane' or 'line'
let subspaceType = 'plane';

// UI elements
let vxSlider, vySlider, vzSlider;
let u1xSlider, u1ySlider, u1zSlider;
let u2xSlider, u2ySlider, u2zSlider;
let subspaceSelect;
let showErrorCheckbox, showMatrixCheckbox;
let resetButton;

// 3D view
let rotX = -0.4;
let rotY = 0.6;
let isDragging = false;
let lastMouseX, lastMouseY;
let scale3D = 50;

// Font for WEBGL
let font;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent(document.querySelector('main'));
  textFont(font);

  // Row 1: Vector v sliders
  let row1Y = drawHeight + 8;
  let sliderWidth = 70;

  vxSlider = createSlider(-4, 4, vecV[0], 0.1);
  vxSlider.position(55, row1Y);
  vxSlider.size(sliderWidth);
  vxSlider.input(updateProjection);

  vySlider = createSlider(-4, 4, vecV[1], 0.1);
  vySlider.position(155, row1Y);
  vySlider.size(sliderWidth);
  vySlider.input(updateProjection);

  vzSlider = createSlider(-4, 4, vecV[2], 0.1);
  vzSlider.position(255, row1Y);
  vzSlider.size(sliderWidth);
  vzSlider.input(updateProjection);

  // Row 1: Subspace type select
  subspaceSelect = createSelect();
  subspaceSelect.position(380, row1Y);
  subspaceSelect.option('2D Plane');
  subspaceSelect.option('1D Line');
  subspaceSelect.selected('2D Plane');
  subspaceSelect.changed(onSubspaceChange);

  // Row 1: Checkboxes
  showErrorCheckbox = createCheckbox('Error Vector', true);
  showErrorCheckbox.position(480, row1Y);
  showErrorCheckbox.style('font-size', '13px');

  showMatrixCheckbox = createCheckbox('Projection Matrix', true);
  showMatrixCheckbox.position(590, row1Y);
  showMatrixCheckbox.style('font-size', '13px');

  resetButton = createButton('Reset');
  resetButton.position(canvasWidth - 70, row1Y);
  resetButton.mousePressed(resetSimulation);

  // Row 2: Basis vector sliders
  let row2Y = drawHeight + 45;

  u1xSlider = createSlider(-2, 2, basisU1[0], 0.1);
  u1xSlider.position(55, row2Y);
  u1xSlider.size(sliderWidth);
  u1xSlider.input(updateProjection);

  u1ySlider = createSlider(-2, 2, basisU1[1], 0.1);
  u1ySlider.position(155, row2Y);
  u1ySlider.size(sliderWidth);
  u1ySlider.input(updateProjection);

  u1zSlider = createSlider(-2, 2, basisU1[2], 0.1);
  u1zSlider.position(255, row2Y);
  u1zSlider.size(sliderWidth);
  u1zSlider.input(updateProjection);

  u2xSlider = createSlider(-2, 2, basisU2[0], 0.1);
  u2xSlider.position(380, row2Y);
  u2xSlider.size(sliderWidth);
  u2xSlider.input(updateProjection);

  u2ySlider = createSlider(-2, 2, basisU2[1], 0.1);
  u2ySlider.position(480, row2Y);
  u2ySlider.size(sliderWidth);
  u2ySlider.input(updateProjection);

  u2zSlider = createSlider(-2, 2, basisU2[2], 0.1);
  u2zSlider.position(580, row2Y);
  u2zSlider.size(sliderWidth);
  u2zSlider.input(updateProjection);

  updateProjection();

  describe('Projection onto subspace visualizer showing vector projection and orthogonal error', LABEL);
}

function draw() {
  updateCanvasSize();

  background(240);

  // Draw 3D content
  push();

  // Set up view
  rotateX(rotX);
  rotateY(rotY);

  // Draw coordinate axes
  drawAxes();

  // Draw subspace (plane or line)
  drawSubspace();

  // Draw original vector v
  drawVector3D(vecV, color(50, 50, 220), 'v', 3);

  // Draw projection p
  drawVector3D(projP, color(220, 50, 50), 'p', 3);

  // Draw error vector e if enabled
  if (showErrorCheckbox.checked()) {
    drawErrorVector();
    drawRightAngleIndicator();
  }

  // Draw basis vectors
  drawBasisVectors();

  pop();

  // Draw 2D overlay
  draw2DOverlay();
}

function drawAxes() {
  let axisLen = 180;
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

  // Grid on floor (XZ plane at y=0)
  stroke(220);
  strokeWeight(0.5);
  let gridStep = 50;
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

function drawSubspace() {
  if (subspaceType === 'plane') {
    // Draw plane through origin
    let planeSize = 120;

    // Get plane normal
    let normal = crossProduct(basisU1, basisU2);
    let normLen = vecLength(normal);

    if (normLen < 0.001) {
      // Basis vectors are parallel, can't draw plane
      return;
    }

    // Draw translucent plane
    push();
    fill(100, 150, 200, 80);
    noStroke();

    // Draw as a grid of triangles
    beginShape(TRIANGLES);
    let steps = 10;
    for (let i = -steps; i < steps; i++) {
      for (let j = -steps; j < steps; j++) {
        let s1 = i / steps;
        let t1 = j / steps;
        let s2 = (i + 1) / steps;
        let t2 = (j + 1) / steps;

        // Points on plane: s * u1 + t * u2
        let p1 = planePoint(s1, t1, planeSize);
        let p2 = planePoint(s2, t1, planeSize);
        let p3 = planePoint(s1, t2, planeSize);
        let p4 = planePoint(s2, t2, planeSize);

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
    stroke(100, 150, 200, 150);
    strokeWeight(1);
    noFill();
    beginShape();
    let corners = [
      planePoint(-1, -1, planeSize),
      planePoint(1, -1, planeSize),
      planePoint(1, 1, planeSize),
      planePoint(-1, 1, planeSize)
    ];
    for (let c of corners) {
      vertex(c.x, c.y, c.z);
    }
    endShape(CLOSE);

  } else {
    // Draw line through origin
    let lineLen = 180;
    let dir = normalize(basisU1);

    stroke(100, 150, 200, 200);
    strokeWeight(2);
    line(
      -dir[0] * lineLen, dir[1] * lineLen, -dir[2] * lineLen,
      dir[0] * lineLen, -dir[1] * lineLen, dir[2] * lineLen
    );
  }
}

function planePoint(s, t, size) {
  return {
    x: (s * basisU1[0] + t * basisU2[0]) * size,
    y: -(s * basisU1[1] + t * basisU2[1]) * size,
    z: (s * basisU1[2] + t * basisU2[2]) * size
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
  textSize(16);
  text(label, 0, 0);
  pop();
}

function drawBasisVectors() {
  // Draw u1
  let u1 = normalize(basisU1);
  let x1 = u1[0] * scale3D * 1.5;
  let y1 = -u1[1] * scale3D * 1.5;
  let z1 = u1[2] * scale3D * 1.5;

  strokeWeight(2);
  stroke(0, 150, 150);
  line(0, 0, 0, x1, y1, z1);

  push();
  translate(x1 * 1.1, y1 * 1.1, z1 * 1.1);
  fill(0, 150, 150);
  noStroke();
  textSize(12);
  text('u1', 0, 0);
  pop();

  // Draw u2 if plane
  if (subspaceType === 'plane') {
    let u2 = normalize(basisU2);
    let x2 = u2[0] * scale3D * 1.5;
    let y2 = -u2[1] * scale3D * 1.5;
    let z2 = u2[2] * scale3D * 1.5;

    stroke(150, 100, 0);
    line(0, 0, 0, x2, y2, z2);

    push();
    translate(x2 * 1.1, y2 * 1.1, z2 * 1.1);
    fill(150, 100, 0);
    noStroke();
    textSize(12);
    text('u2', 0, 0);
    pop();
  }
}

function drawErrorVector() {
  // Draw error vector from projection to original vector
  let px = projP[0] * scale3D;
  let py = -projP[1] * scale3D;
  let pz = projP[2] * scale3D;

  let vx = vecV[0] * scale3D;
  let vy = -vecV[1] * scale3D;
  let vz = vecV[2] * scale3D;

  // Draw dashed line
  strokeWeight(2);
  stroke(50, 180, 50);
  drawDashedLine3D(px, py, pz, vx, vy, vz);

  // Draw small sphere at connection
  push();
  translate(px, py, pz);
  noStroke();
  fill(50, 180, 50);
  sphere(4);
  pop();

  // Label
  let midX = (px + vx) / 2;
  let midY = (py + vy) / 2;
  let midZ = (pz + vz) / 2;

  push();
  translate(midX + 10, midY, midZ);
  fill(50, 180, 50);
  noStroke();
  textSize(14);
  text('e', 0, 0);
  pop();
}

function drawRightAngleIndicator() {
  // Draw right angle indicator at projection point
  let px = projP[0] * scale3D;
  let py = -projP[1] * scale3D;
  let pz = projP[2] * scale3D;

  // Error direction (normalized)
  let errLen = vecLength(errorE);
  if (errLen < 0.001) return;

  let errDir = [errorE[0] / errLen, errorE[1] / errLen, errorE[2] / errLen];

  // Get a direction in the subspace
  let subDir;
  if (subspaceType === 'plane') {
    // Use u1 direction
    subDir = normalize(basisU1);
  } else {
    subDir = normalize(basisU1);
  }

  let indicatorSize = 12;

  // Draw small L shape
  stroke(50, 180, 50, 200);
  strokeWeight(1.5);

  let e1 = [errDir[0] * indicatorSize, -errDir[1] * indicatorSize, errDir[2] * indicatorSize];
  let s1 = [subDir[0] * indicatorSize, -subDir[1] * indicatorSize, subDir[2] * indicatorSize];

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

function draw2DOverlay() {
  push();
  resetMatrix();
  translate(-canvasWidth / 2, -canvasHeight / 2);

  // Title
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text('Projection onto Subspace Visualizer', canvasWidth / 2, 8);

  // Info panel - left side
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(10, 40, 180, 150, 8);

  fill(0);
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  text('Vectors:', 20, 50);

  textSize(11);
  fill(50, 50, 220);
  text('v = (' + nf(vecV[0], 1, 2) + ', ' + nf(vecV[1], 1, 2) + ', ' + nf(vecV[2], 1, 2) + ')', 20, 70);

  fill(220, 50, 50);
  text('p = (' + nf(projP[0], 1, 2) + ', ' + nf(projP[1], 1, 2) + ', ' + nf(projP[2], 1, 2) + ')', 20, 88);

  fill(50, 180, 50);
  text('e = (' + nf(errorE[0], 1, 2) + ', ' + nf(errorE[1], 1, 2) + ', ' + nf(errorE[2], 1, 2) + ')', 20, 106);

  fill(0);
  textSize(12);
  text('Distance ||e|| = ' + nf(vecLength(errorE), 1, 4), 20, 128);

  // Show orthogonality check
  let orthCheck = subspaceType === 'plane' ?
    dotProduct(errorE, basisU1).toFixed(4) + ', ' + dotProduct(errorE, basisU2).toFixed(4) :
    dotProduct(errorE, basisU1).toFixed(4);

  textSize(10);
  fill(80);
  text('e . basis = [' + orthCheck + ']', 20, 148);
  text('(should be ~0)', 20, 162);

  // Formula panel - right side
  if (showMatrixCheckbox.checked()) {
    drawProjectionMatrixPanel();
  }

  // Control area background
  fill(255);
  stroke(200);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control labels
  noStroke();
  fill(50, 50, 220);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('v:', 10, drawHeight + 18);
  text('x', 130, drawHeight + 18);
  text('y', 230, drawHeight + 18);
  text('z', 330, drawHeight + 18);

  fill(0, 120, 120);
  text('u1:', 10, drawHeight + 55);
  text('x', 130, drawHeight + 55);
  text('y', 230, drawHeight + 55);
  text('z', 330, drawHeight + 55);

  if (subspaceType === 'plane') {
    fill(150, 100, 0);
    text('u2:', 340, drawHeight + 55);
    text('x', 455, drawHeight + 55);
    text('y', 555, drawHeight + 55);
    text('z', 655, drawHeight + 55);
  }

  // Drag instruction
  fill(100);
  textSize(10);
  textAlign(RIGHT, CENTER);
  text('Drag to rotate 3D view', canvasWidth - 20, drawHeight - 15);

  pop();
}

function drawProjectionMatrixPanel() {
  let px = canvasWidth - 210;
  let py = 40;

  fill(255, 255, 255, 245);
  stroke(200);
  strokeWeight(1);
  rect(px, py, 200, 180, 8);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  text('Projection Matrix P:', px + 10, py + 10);

  // Formula
  textSize(10);
  fill(80);
  if (subspaceType === 'plane') {
    text('P = A(A^T A)^(-1) A^T', px + 10, py + 30);
    text('where A = [u1 | u2]', px + 10, py + 45);
  } else {
    text('P = u(u^T u)^(-1) u^T', px + 10, py + 30);
    text('  = uu^T / ||u||^2', px + 10, py + 45);
  }

  // Show projection matrix (simplified display)
  textSize(11);
  fill(0);
  text('p = Pv', px + 10, py + 70);

  // Key insight
  textSize(10);
  fill(60, 120, 60);
  text('Key insight:', px + 10, py + 95);
  text('p is the closest point', px + 10, py + 110);
  text('in subspace W to v', px + 10, py + 125);

  textSize(10);
  fill(80);
  text('e = v - p is perpendicular', px + 10, py + 145);
  text('to the subspace', px + 10, py + 160);
}

function updateProjection() {
  // Read slider values
  vecV = [vxSlider.value(), vySlider.value(), vzSlider.value()];
  basisU1 = [u1xSlider.value(), u1ySlider.value(), u1zSlider.value()];
  basisU2 = [u2xSlider.value(), u2ySlider.value(), u2zSlider.value()];

  // Compute projection
  if (subspaceType === 'plane') {
    projP = projectOntoPlane(vecV, basisU1, basisU2);
  } else {
    projP = projectOntoLine(vecV, basisU1);
  }

  // Compute error
  errorE = [vecV[0] - projP[0], vecV[1] - projP[1], vecV[2] - projP[2]];
}

function projectOntoLine(v, u) {
  // proj_u(v) = (v.u / u.u) * u
  let uLen2 = dotProduct(u, u);
  if (uLen2 < 0.0001) return [0, 0, 0];

  let scalar = dotProduct(v, u) / uLen2;
  return [scalar * u[0], scalar * u[1], scalar * u[2]];
}

function projectOntoPlane(v, u1, u2) {
  // Project v onto plane spanned by u1, u2
  // P = A(A^T A)^(-1) A^T where A = [u1 | u2]

  // Gram-Schmidt to get orthonormal basis
  let q1 = normalize(u1);
  if (vecLength(q1) < 0.001) return [0, 0, 0];

  // q2 = u2 - proj_q1(u2), then normalize
  let proj1 = projectOntoLine(u2, q1);
  let q2_unnorm = [u2[0] - proj1[0], u2[1] - proj1[1], u2[2] - proj1[2]];
  let q2 = normalize(q2_unnorm);

  // If u1 and u2 are parallel, just project onto line
  if (vecLength(q2) < 0.001) {
    return projectOntoLine(v, u1);
  }

  // Projection: p = (v.q1)q1 + (v.q2)q2
  let c1 = dotProduct(v, q1);
  let c2 = dotProduct(v, q2);

  return [
    c1 * q1[0] + c2 * q2[0],
    c1 * q1[1] + c2 * q2[1],
    c1 * q1[2] + c2 * q2[2]
  ];
}

function onSubspaceChange() {
  let selected = subspaceSelect.value();
  subspaceType = selected === '2D Plane' ? 'plane' : 'line';

  // Show/hide u2 sliders
  let show = subspaceType === 'plane';
  u2xSlider.style('display', show ? 'block' : 'none');
  u2ySlider.style('display', show ? 'block' : 'none');
  u2zSlider.style('display', show ? 'block' : 'none');

  updateProjection();
}

function resetSimulation() {
  // Reset to defaults
  vecV = [2, 3, 2];
  basisU1 = [1, 0, 0];
  basisU2 = [0, 1, 0];

  vxSlider.value(vecV[0]);
  vySlider.value(vecV[1]);
  vzSlider.value(vecV[2]);

  u1xSlider.value(basisU1[0]);
  u1ySlider.value(basisU1[1]);
  u1zSlider.value(basisU1[2]);

  u2xSlider.value(basisU2[0]);
  u2ySlider.value(basisU2[1]);
  u2zSlider.value(basisU2[2]);

  subspaceSelect.selected('2D Plane');
  subspaceType = 'plane';

  u2xSlider.style('display', 'block');
  u2ySlider.style('display', 'block');
  u2zSlider.style('display', 'block');

  rotX = -0.4;
  rotY = 0.6;

  updateProjection();
}

// Vector utilities
function dotProduct(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function crossProduct(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function vecLength(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize(v) {
  let len = vecLength(v);
  if (len < 0.0001) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}

// Mouse interaction for 3D rotation
function mousePressed() {
  if (mouseY < drawHeight && mouseY > 35 && mouseX > 200 && mouseX < canvasWidth - 220) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging) {
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
  isDragging = false;
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
