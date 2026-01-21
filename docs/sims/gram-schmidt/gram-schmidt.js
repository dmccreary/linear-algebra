// Gram-Schmidt Process Visualizer MicroSim
// Step through orthonormalization showing projection and subtraction
// Learning objective: Understand Gram-Schmidt through geometric visualization

let canvasWidth = 900;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Original vectors (3 vectors in 3D)
let originalVectors = [
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1]
];

// Working copies and results
let aVectors = [];  // Original vectors
let qVectors = [];  // Orthonormal vectors
let rValues = [];   // R matrix values

// Algorithm state
let currentStep = 0;
let totalSteps = 0;
let stepPhase = 'start';  // 'start', 'project', 'subtract', 'normalize'
let stepDescription = "Press 'Step' to begin Gram-Schmidt";
let isComplete = false;
let autoRun = false;
let lastAutoTime = 0;
let autoSpeed = 1200;

// Current working vector
let currentVecIdx = 0;
let vVector = [];        // v = a - projections
let projections = [];    // Individual projection vectors

// 3D view
let rotX = -0.5;
let rotY = 0.6;
let isDragging = false;
let lastMouseX, lastMouseY;
let scale3D = 80;

// UI elements
let stepButton, runAllButton, resetButton;
let speedSlider;
let showProjectionsCheckbox;

// Font for WEBGL
let font;

// Colors
let vecColors = [];

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent(document.querySelector('main'));
  textFont(font);

  // Colors for vectors
  vecColors = [
    color(220, 80, 80),   // Red
    color(80, 180, 80),   // Green
    color(80, 80, 220)    // Blue
  ];

  // Buttons
  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 15);
  stepButton.mousePressed(nextStep);

  runAllButton = createButton('Run All');
  runAllButton.position(65, drawHeight + 15);
  runAllButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.position(135, drawHeight + 15);
  resetButton.mousePressed(resetSimulation);

  // Speed slider
  speedSlider = createSlider(300, 2000, 1200, 100);
  speedSlider.position(300, drawHeight + 15);
  speedSlider.size(120);

  // Show projections checkbox
  showProjectionsCheckbox = createCheckbox('Show Projections', true);
  showProjectionsCheckbox.position(10, drawHeight + 45);
  showProjectionsCheckbox.style('font-size', '14px');

  initializeAlgorithm();

  describe('Step-by-step visualization of Gram-Schmidt orthonormalization process', LABEL);
}

function draw() {
  updateCanvasSize();

  // Auto-run logic
  if (autoRun && !isComplete) {
    autoSpeed = speedSlider.value();
    if (millis() - lastAutoTime > autoSpeed) {
      nextStep();
      lastAutoTime = millis();
    }
  }

  background(240);

  // Draw 3D content
  push();

  // Set up view
  rotateX(rotX);
  rotateY(rotY);

  // Draw coordinate axes
  drawAxes();

  // Draw original vectors (faded)
  drawOriginalVectors();

  // Draw orthonormal vectors computed so far
  drawOrthonormalVectors();

  // Draw current working state
  drawCurrentState();

  pop();

  // Draw 2D overlay
  draw2DOverlay();
}

function drawAxes() {
  let axisLen = 150;
  strokeWeight(1);

  // X axis
  stroke(180, 0, 0, 150);
  line(-axisLen, 0, 0, axisLen, 0, 0);

  // Y axis
  stroke(0, 180, 0, 150);
  line(0, -axisLen, 0, 0, axisLen, 0);

  // Z axis
  stroke(0, 0, 180, 150);
  line(0, 0, -axisLen, 0, 0, axisLen);

  // Grid on XZ plane
  stroke(220);
  strokeWeight(0.5);
  let gridStep = 40;
  for (let i = -3; i <= 3; i++) {
    line(i * gridStep, 0, -axisLen, i * gridStep, 0, axisLen);
    line(-axisLen, 0, i * gridStep, axisLen, 0, i * gridStep);
  }
}

function drawOriginalVectors() {
  // Draw original vectors as dashed/faded
  for (let i = 0; i < aVectors.length; i++) {
    let v = aVectors[i];
    let x = v[0] * scale3D;
    let y = -v[1] * scale3D;
    let z = v[2] * scale3D;

    strokeWeight(2);
    let c = vecColors[i];
    stroke(red(c), green(c), blue(c), 100);

    // Draw dashed line
    drawDashedLine3D(0, 0, 0, x, y, z);

    // Label
    push();
    translate(x * 1.1, y * 1.1, z * 1.1);
    fill(red(c), green(c), blue(c), 150);
    noStroke();
    textSize(14);
    text('a' + (i + 1), 0, 0);
    pop();
  }
}

function drawDashedLine3D(x1, y1, z1, x2, y2, z2) {
  let segments = 8;
  for (let i = 0; i < segments; i += 2) {
    let t1 = i / segments;
    let t2 = (i + 1) / segments;
    line(
      lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(z1, z2, t1),
      lerp(x1, x2, t2), lerp(y1, y2, t2), lerp(z1, z2, t2)
    );
  }
}

function drawOrthonormalVectors() {
  // Draw completed orthonormal vectors
  for (let i = 0; i < qVectors.length; i++) {
    let q = qVectors[i];
    let x = q[0] * scale3D;
    let y = -q[1] * scale3D;
    let z = q[2] * scale3D;

    // Draw thick solid arrow
    strokeWeight(4);
    stroke(vecColors[i]);
    line(0, 0, 0, x, y, z);

    // Arrowhead
    push();
    translate(x, y, z);
    noStroke();
    fill(vecColors[i]);
    sphere(6);
    pop();

    // Label
    push();
    translate(x * 1.15, y * 1.15, z * 1.15);
    fill(vecColors[i]);
    noStroke();
    textSize(16);
    text('q' + (i + 1), 0, 0);
    pop();
  }

  // Draw right-angle indicators between consecutive q vectors
  if (qVectors.length >= 2) {
    stroke(100, 200);
    strokeWeight(2);
    noFill();

    for (let i = 0; i < qVectors.length - 1; i++) {
      drawRightAngle(qVectors[i], qVectors[i + 1]);
    }
  }
}

function drawRightAngle(q1, q2) {
  let size = 15;
  let x1 = q1[0] * size;
  let y1 = -q1[1] * size;
  let z1 = q1[2] * size;

  let x2 = q2[0] * size;
  let y2 = -q2[1] * size;
  let z2 = q2[2] * size;

  // Draw small L shape
  line(x1, y1, z1, x1 + x2, y1 + y2, z1 + z2);
  line(x2, y2, z2, x1 + x2, y1 + y2, z1 + z2);
}

function drawCurrentState() {
  if (isComplete) return;

  // Draw current working vector v
  if (vVector.length === 3 && stepPhase !== 'start') {
    let x = vVector[0] * scale3D;
    let y = -vVector[1] * scale3D;
    let z = vVector[2] * scale3D;

    strokeWeight(3);
    stroke(255, 180, 0);  // Orange for working vector
    line(0, 0, 0, x, y, z);

    push();
    translate(x * 1.1, y * 1.1, z * 1.1);
    fill(255, 180, 0);
    noStroke();
    textSize(14);
    text('v', 0, 0);
    pop();
  }

  // Draw projections if enabled
  if (showProjectionsCheckbox.checked() && projections.length > 0) {
    for (let i = 0; i < projections.length; i++) {
      let proj = projections[i];
      let x = proj[0] * scale3D;
      let y = -proj[1] * scale3D;
      let z = proj[2] * scale3D;

      // Projection vector in cyan
      strokeWeight(2);
      stroke(0, 200, 200, 180);
      line(0, 0, 0, x, y, z);

      // Dashed line from tip to original vector
      let aVec = aVectors[currentVecIdx];
      let ax = aVec[0] * scale3D;
      let ay = -aVec[1] * scale3D;
      let az = aVec[2] * scale3D;

      stroke(0, 200, 200, 100);
      drawDashedLine3D(x, y, z, ax, ay, az);
    }
  }
}

function draw2DOverlay() {
  push();
  resetMatrix();
  translate(-canvasWidth/2, -canvasHeight/2);

  // Title
  fill(0);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('Gram-Schmidt Orthonormalization', canvasWidth/2, 10);

  // Left panel - Algorithm state
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(10, 45, 180, 120, 8);

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text('Algorithm State:', 20, 55);

  textSize(12);
  text('Vector: ' + (currentVecIdx + 1) + ' / 3', 20, 80);
  text('Phase: ' + stepPhase, 20, 100);
  text('Step: ' + currentStep, 20, 120);

  // Q vectors completed
  text('Completed: q₁' + (qVectors.length > 0 ? '✓' : '') +
       ' q₂' + (qVectors.length > 1 ? '✓' : '') +
       ' q₃' + (qVectors.length > 2 ? '✓' : ''), 20, 140);

  // Right panel - R values
  fill(255, 255, 255, 240);
  stroke(200);
  rect(canvasWidth - 160, 45, 150, 100, 8);

  fill(0);
  noStroke();
  textSize(14);
  text('R matrix values:', canvasWidth - 150, 55);

  textSize(11);
  let rY = 75;
  for (let i = 0; i < rValues.length && i < 6; i++) {
    text(rValues[i].label + ' = ' + rValues[i].value.toFixed(3), canvasWidth - 150, rY + i * 15);
  }

  // Description box
  fill(255, 255, 220);
  stroke(200);
  rect(200, drawHeight - 60, canvasWidth - 400, 45, 5);

  fill(0);
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  text(stepDescription, canvasWidth/2, drawHeight - 38);

  // Control area background
  fill(255);
  stroke(200);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Slider label
  noStroke();
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Speed: ' + (speedSlider.value()/1000).toFixed(1) + 's', 220, drawHeight + 25);

  // Instructions
  fill(100);
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('Drag to rotate 3D view', canvasWidth - 20, drawHeight + 55);

  pop();
}

function initializeAlgorithm() {
  // Copy original vectors
  aVectors = originalVectors.map(v => [...v]);
  qVectors = [];
  rValues = [];
  vVector = [];
  projections = [];

  currentStep = 0;
  currentVecIdx = 0;
  stepPhase = 'start';
  totalSteps = 9;  // 3 vectors × 3 phases (project, subtract, normalize)
  stepDescription = "Press 'Step' to begin orthonormalizing a₁";
  isComplete = false;
  autoRun = false;
  runAllButton.html('Run All');
}

function nextStep() {
  if (isComplete) return;

  if (stepPhase === 'start') {
    // Begin processing current vector
    vVector = [...aVectors[currentVecIdx]];
    projections = [];

    if (currentVecIdx === 0) {
      stepPhase = 'normalize';
      stepDescription = "First vector: directly normalize a₁ to get q₁";
    } else {
      stepPhase = 'project';
      stepDescription = "Computing projections of a" + (currentVecIdx + 1) + " onto existing q vectors";
    }
  }
  else if (stepPhase === 'project') {
    // Compute projections
    projections = [];
    for (let i = 0; i < qVectors.length; i++) {
      let proj = projectOnto(aVectors[currentVecIdx], qVectors[i]);
      projections.push(proj);

      // Store r value
      let dotProd = dot(qVectors[i], aVectors[currentVecIdx]);
      rValues.push({label: 'r' + (i+1) + (currentVecIdx+1), value: dotProd});
    }

    stepPhase = 'subtract';
    let projStr = projections.length === 1 ? 'projection' : 'projections';
    stepDescription = "Subtracting " + projStr + " from a" + (currentVecIdx + 1) + " to get v";
  }
  else if (stepPhase === 'subtract') {
    // Subtract projections to get v
    vVector = [...aVectors[currentVecIdx]];
    for (let proj of projections) {
      vVector[0] -= proj[0];
      vVector[1] -= proj[1];
      vVector[2] -= proj[2];
    }

    stepPhase = 'normalize';
    stepDescription = "Normalizing v to get q" + (currentVecIdx + 1);
  }
  else if (stepPhase === 'normalize') {
    // Normalize v to get q
    let norm = Math.sqrt(vVector[0]*vVector[0] + vVector[1]*vVector[1] + vVector[2]*vVector[2]);

    if (norm < 0.0001) {
      stepDescription = "Warning: Vector is linearly dependent!";
      isComplete = true;
      return;
    }

    let q = [vVector[0]/norm, vVector[1]/norm, vVector[2]/norm];
    qVectors.push(q);

    // Store diagonal r value
    rValues.push({label: 'r' + (currentVecIdx+1) + (currentVecIdx+1), value: norm});

    // Move to next vector
    currentVecIdx++;
    projections = [];
    vVector = [];

    if (currentVecIdx >= 3) {
      isComplete = true;
      stepDescription = "Gram-Schmidt complete! A = QR with orthonormal Q";
      autoRun = false;
      runAllButton.html('Run All');
    } else {
      stepPhase = 'start';
      stepDescription = "q" + qVectors.length + " computed. Ready for a" + (currentVecIdx + 1);
    }
  }

  currentStep++;
}

function projectOnto(v, onto) {
  // Project v onto unit vector 'onto'
  let d = dot(v, onto);
  return [onto[0] * d, onto[1] * d, onto[2] * d];
}

function dot(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function toggleAuto() {
  autoRun = !autoRun;
  runAllButton.html(autoRun ? 'Pause' : 'Run All');
  if (autoRun) {
    lastAutoTime = millis();
  }
}

function resetSimulation() {
  initializeAlgorithm();
}

function mousePressed() {
  if (mouseY < drawHeight && mouseX > 190 && mouseX < canvasWidth - 170) {
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
    canvasWidth = Math.max(600, Math.floor(container.offsetWidth));
  }
}
