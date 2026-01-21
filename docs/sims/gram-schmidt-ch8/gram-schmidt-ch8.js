// Gram-Schmidt Step-by-Step Visualizer MicroSim (Chapter 8)
// Detailed step-by-step visualization showing projection and orthogonalization
// Learning objective: Understand Gram-Schmidt by watching each projection/subtraction step

let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

// Default input vectors (3 linearly independent vectors in 3D)
let defaultVectors = [
  [2, 0, 0],
  [1, 2, 0],
  [1, 1, 2]
];

// Working copies
let inputVectors = [];   // v1, v2, v3 (original input)
let uVectors = [];       // Intermediate u vectors (before normalization)
let qVectors = [];       // Orthonormal output vectors

// Algorithm state
let currentVecIdx = 0;      // Which vector we're processing (0, 1, 2)
let currentProjIdx = 0;     // Which projection we're computing
let stepPhase = 'start';    // 'start', 'project', 'subtract', 'normalize', 'complete'
let stepDescription = "Press 'Next Step' to begin Gram-Schmidt";
let warningMessage = "";

// Animation state
let isAnimating = false;
let animProgress = 0;       // 0 to 1 for current animation
let animSpeed = 0.03;
let autoRun = false;
let lastAutoTime = 0;
let autoDelay = 1500;

// Current working values
let currentU = [0, 0, 0];   // Current u vector being built
let currentProj = [0, 0, 0]; // Current projection being shown
let allProjections = [];     // All projections for current vector

// 3D view
let rotX = -0.4;
let rotY = 0.5;
let isDragging = false;
let lastMouseX, lastMouseY;
let scale3D = 60;

// UI elements
let nextStepButton, autoRunButton, resetButton;
let speedSlider;
let showAllProjectionsCheckbox, showResidualCheckbox;

// Input sliders
let vecSliders = [];

// Font for WEBGL
let font;

// Colors
let inputColor, projColor, uColor, qColors;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  const container = document.querySelector('main');
  canvas.parent(container);
  textFont(font);

  // Define colors
  inputColor = color(150, 150, 150, 120);
  projColor = color(0, 200, 200);
  uColor = color(255, 180, 0);
  qColors = [
    color(220, 80, 80),   // q1 - Red
    color(80, 180, 80),   // q2 - Green
    color(80, 80, 220)    // q3 - Blue
  ];

  // Create buttons
  nextStepButton = createButton('Next Step');
  nextStepButton.parent(container);
  nextStepButton.position(10, drawHeight + 12);
  nextStepButton.mousePressed(nextStep);

  autoRunButton = createButton('Auto Run');
  autoRunButton.parent(container);
  autoRunButton.position(95, drawHeight + 12);
  autoRunButton.mousePressed(toggleAutoRun);

  resetButton = createButton('Reset');
  resetButton.parent(container);
  resetButton.position(175, drawHeight + 12);
  resetButton.mousePressed(resetSimulation);

  // Speed slider
  speedSlider = createSlider(500, 3000, 1500, 100);
  speedSlider.parent(container);
  speedSlider.position(310, drawHeight + 12);
  speedSlider.size(100);

  // Checkboxes
  showAllProjectionsCheckbox = createCheckbox('Show All Projections', true);
  showAllProjectionsCheckbox.parent(container);
  showAllProjectionsCheckbox.position(10, drawHeight + 45);
  showAllProjectionsCheckbox.style('font-size', '12px');

  showResidualCheckbox = createCheckbox('Show Residual', true);
  showResidualCheckbox.parent(container);
  showResidualCheckbox.position(150, drawHeight + 45);
  showResidualCheckbox.style('font-size', '12px');

  // Vector input sliders (3 vectors x 3 components = 9 sliders)
  let sliderStartX = 440;
  let sliderY = drawHeight + 8;

  for (let v = 0; v < 3; v++) {
    vecSliders[v] = [];
    for (let c = 0; c < 3; c++) {
      let slider = createSlider(-3, 3, defaultVectors[v][c], 0.1);
      slider.parent(container);
      slider.position(sliderStartX + c * 55, sliderY + v * 28);
      slider.size(50);
      slider.input(onVectorChange);
      vecSliders[v][c] = slider;
    }
  }

  initializeAlgorithm();

  describe('Step-by-step Gram-Schmidt orthonormalization with projection visualization', LABEL);
}

function draw() {
  updateCanvasSize();

  // Auto-run logic
  if (autoRun && stepPhase !== 'complete') {
    autoDelay = speedSlider.value();
    if (millis() - lastAutoTime > autoDelay) {
      nextStep();
      lastAutoTime = millis();
    }
  }

  // Update animation
  if (isAnimating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      isAnimating = false;
    }
  }

  background(245);

  // Draw 3D content
  push();
  rotateX(rotX);
  rotateY(rotY);

  drawAxes();
  drawInputVectors();
  drawOrthonormalVectors();
  drawCurrentState();

  pop();

  // Draw 2D overlay
  draw2DOverlay();
}

function drawAxes() {
  let axisLen = 180;
  strokeWeight(1);

  // X axis (red)
  stroke(180, 0, 0, 150);
  line(-axisLen, 0, 0, axisLen, 0, 0);

  // Y axis (green) - note: p5 Y is inverted
  stroke(0, 180, 0, 150);
  line(0, axisLen, 0, 0, -axisLen, 0);

  // Z axis (blue)
  stroke(0, 0, 180, 150);
  line(0, 0, -axisLen, 0, 0, axisLen);

  // Grid on XZ plane (Y=0)
  stroke(220);
  strokeWeight(0.5);
  let gridStep = 30;
  for (let i = -5; i <= 5; i++) {
    line(i * gridStep, 0, -axisLen, i * gridStep, 0, axisLen);
    line(-axisLen, 0, i * gridStep, axisLen, 0, i * gridStep);
  }

  // Axis labels
  push();
  fill(180, 0, 0);
  noStroke();
  textSize(14);
  translate(axisLen + 10, 0, 0);
  text('x', 0, 0);
  pop();

  push();
  fill(0, 180, 0);
  noStroke();
  textSize(14);
  translate(0, -axisLen - 10, 0);
  text('y', 0, 0);
  pop();

  push();
  fill(0, 0, 180);
  noStroke();
  textSize(14);
  translate(0, 0, axisLen + 10);
  text('z', 0, 0);
  pop();
}

function drawInputVectors() {
  // Draw original input vectors (semi-transparent after processing)
  for (let i = 0; i < inputVectors.length; i++) {
    let v = inputVectors[i];
    let x = v[0] * scale3D;
    let y = -v[1] * scale3D;  // Flip Y for proper orientation
    let z = v[2] * scale3D;

    let alpha = (i < currentVecIdx) ? 80 : 150;
    if (i === currentVecIdx && stepPhase !== 'start') {
      alpha = 100;
    }

    strokeWeight(2);
    stroke(150, 150, 150, alpha);
    drawDashedLine3D(0, 0, 0, x, y, z);

    // Label
    push();
    translate(x * 1.1, y * 1.1, z * 1.1);
    fill(100, alpha);
    noStroke();
    textSize(12);
    text('v' + (i + 1), 0, 0);
    pop();
  }
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

function drawOrthonormalVectors() {
  // Draw completed orthonormal vectors with spheres at tips
  for (let i = 0; i < qVectors.length; i++) {
    let q = qVectors[i];
    let x = q[0] * scale3D;
    let y = -q[1] * scale3D;
    let z = q[2] * scale3D;

    strokeWeight(4);
    stroke(qColors[i]);
    line(0, 0, 0, x, y, z);

    // Arrowhead sphere
    push();
    translate(x, y, z);
    noStroke();
    fill(qColors[i]);
    sphere(5);
    pop();

    // Label
    push();
    translate(x * 1.15, y * 1.15, z * 1.15);
    fill(qColors[i]);
    noStroke();
    textSize(14);
    text('q' + (i + 1), 0, 0);
    pop();
  }

  // Draw right-angle indicators between q vectors
  if (qVectors.length >= 2) {
    stroke(100, 150);
    strokeWeight(1.5);
    noFill();

    for (let i = 0; i < qVectors.length; i++) {
      for (let j = i + 1; j < qVectors.length; j++) {
        drawRightAngle(qVectors[i], qVectors[j]);
      }
    }
  }
}

function drawRightAngle(q1, q2) {
  let size = 12;
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
  if (stepPhase === 'start' || stepPhase === 'complete') return;

  // Show all projections if enabled
  if (showAllProjectionsCheckbox.checked() && allProjections.length > 0) {
    for (let i = 0; i < allProjections.length; i++) {
      let proj = allProjections[i];
      let px = proj[0] * scale3D;
      let py = -proj[1] * scale3D;
      let pz = proj[2] * scale3D;

      strokeWeight(2);
      stroke(0, 200, 200, 150);
      line(0, 0, 0, px, py, pz);

      // Label
      push();
      translate(px * 1.1, py * 1.1, pz * 1.1);
      fill(0, 180, 180);
      noStroke();
      textSize(10);
      text('proj_q' + (i + 1), 0, 0);
      pop();
    }
  }

  // Show current projection being computed (animated)
  if (stepPhase === 'project' && vecMagnitude(currentProj) > 0.001) {
    let t = isAnimating ? animProgress : 1;
    let px = currentProj[0] * scale3D * t;
    let py = -currentProj[1] * scale3D * t;
    let pz = currentProj[2] * scale3D * t;

    strokeWeight(3);
    stroke(0, 220, 220);
    line(0, 0, 0, px, py, pz);

    // Dashed line from projection to original vector
    let v = inputVectors[currentVecIdx];
    let vx = v[0] * scale3D;
    let vy = -v[1] * scale3D;
    let vz = v[2] * scale3D;

    stroke(0, 200, 200, 100);
    strokeWeight(1);
    drawDashedLine3D(px, py, pz, vx, vy, vz);
  }

  // Show residual/u vector if enabled
  if (showResidualCheckbox.checked() && stepPhase !== 'project') {
    if (vecMagnitude(currentU) > 0.001) {
      let t = (stepPhase === 'subtract' && isAnimating) ? animProgress : 1;
      let ux = currentU[0] * scale3D * t;
      let uy = -currentU[1] * scale3D * t;
      let uz = currentU[2] * scale3D * t;

      strokeWeight(3);
      stroke(255, 180, 0);
      line(0, 0, 0, ux, uy, uz);

      // Label
      push();
      translate(ux * 1.1, uy * 1.1, uz * 1.1);
      fill(255, 180, 0);
      noStroke();
      textSize(12);
      text('u' + (currentVecIdx + 1), 0, 0);
      pop();
    }
  }

  // During normalize phase, show scaling animation
  if (stepPhase === 'normalize' && isAnimating && vecMagnitude(currentU) > 0.001) {
    let uNorm = vecMagnitude(currentU);
    let scaleFactor = lerp(1, 1 / uNorm, animProgress);

    let qx = currentU[0] * scaleFactor * scale3D;
    let qy = -currentU[1] * scaleFactor * scale3D;
    let qz = currentU[2] * scaleFactor * scale3D;

    strokeWeight(4);
    stroke(qColors[currentVecIdx]);
    line(0, 0, 0, qx, qy, qz);
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
  text('Gram-Schmidt Step-by-Step Visualizer', canvasWidth / 2, 8);

  // Left panel - Algorithm state
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(10, 35, 160, 95, 6);

  fill(0);
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  text('Algorithm State:', 20, 42);

  textSize(11);
  text('Processing: v' + (currentVecIdx + 1), 20, 62);
  text('Phase: ' + stepPhase, 20, 78);

  // Show which q vectors are complete
  let qStatus = 'Complete: ';
  for (let i = 0; i < 3; i++) {
    qStatus += 'q' + (i + 1) + (qVectors.length > i ? '\u2713 ' : '_ ');
  }
  text(qStatus, 20, 94);

  if (stepPhase === 'project' && currentProjIdx < qVectors.length) {
    text('Projecting onto: q' + (currentProjIdx + 1), 20, 110);
  }

  // Warning message
  if (warningMessage !== "") {
    fill(200, 50, 50);
    textSize(12);
    textAlign(CENTER, TOP);
    text(warningMessage, canvasWidth / 2, 35);
  }

  // Description box
  fill(255, 255, 220);
  stroke(200);
  rect(180, drawHeight - 50, canvasWidth - 370, 40, 5);

  fill(0);
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  text(stepDescription, canvasWidth / 2 - 95, drawHeight - 30);

  // Control area background
  fill(255);
  stroke(200);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Labels in control area
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Speed: ' + (speedSlider.value() / 1000).toFixed(1) + 's', 230, drawHeight + 22);

  // Vector input labels
  textSize(10);
  let labelX = 442;
  text('v1:', labelX - 20, drawHeight + 18);
  text('v2:', labelX - 20, drawHeight + 46);
  text('v3:', labelX - 20, drawHeight + 74);

  text('x', labelX + 20, drawHeight - 2);
  text('y', labelX + 75, drawHeight - 2);
  text('z', labelX + 130, drawHeight - 2);

  // Instructions
  fill(100);
  textSize(10);
  textAlign(RIGHT, BOTTOM);
  text('Drag to rotate 3D view', canvasWidth - 15, drawHeight - 5);

  // Formula display
  textAlign(LEFT, TOP);
  textSize(10);
  fill(60);
  let formulaY = drawHeight + 68;
  text('Formula: u = v - proj_q1(v) - proj_q2(v) - ...', 10, formulaY);
  text('q = u / ||u||', 10, formulaY + 14);

  pop();
}

function initializeAlgorithm() {
  // Read vectors from sliders
  inputVectors = [];
  for (let v = 0; v < 3; v++) {
    inputVectors[v] = [];
    for (let c = 0; c < 3; c++) {
      inputVectors[v][c] = vecSliders[v][c].value();
    }
  }

  uVectors = [];
  qVectors = [];
  allProjections = [];
  currentU = [0, 0, 0];
  currentProj = [0, 0, 0];

  currentVecIdx = 0;
  currentProjIdx = 0;
  stepPhase = 'start';
  stepDescription = "Press 'Next Step' to begin: q1 = v1 / ||v1||";
  warningMessage = "";

  isAnimating = false;
  animProgress = 0;
  autoRun = false;
  autoRunButton.html('Auto Run');
}

function nextStep() {
  if (stepPhase === 'complete') return;

  warningMessage = "";

  if (stepPhase === 'start') {
    // Initialize processing for current vector
    currentU = [...inputVectors[currentVecIdx]];
    allProjections = [];
    currentProjIdx = 0;

    if (currentVecIdx === 0) {
      // First vector: skip projection, go directly to normalize
      stepPhase = 'normalize';
      stepDescription = 'Normalizing v1: q1 = v1 / ||v1||';
      isAnimating = true;
      animProgress = 0;
    } else if (qVectors.length > 0) {
      // Start projecting onto first q vector
      stepPhase = 'project';
      currentProjIdx = 0;
      computeCurrentProjection();
      stepDescription = 'Computing projection of v' + (currentVecIdx + 1) + ' onto q1';
      isAnimating = true;
      animProgress = 0;
    }
  }
  else if (stepPhase === 'project') {
    // Store this projection
    allProjections.push([...currentProj]);
    currentProjIdx++;

    if (currentProjIdx < qVectors.length) {
      // More projections to compute
      computeCurrentProjection();
      stepDescription = 'Computing projection of v' + (currentVecIdx + 1) + ' onto q' + (currentProjIdx + 1);
      isAnimating = true;
      animProgress = 0;
    } else {
      // All projections computed, now subtract
      stepPhase = 'subtract';
      subtractProjections();
      stepDescription = 'Subtracting projections: u' + (currentVecIdx + 1) + ' = v' + (currentVecIdx + 1) + ' - projections';
      isAnimating = true;
      animProgress = 0;
    }
  }
  else if (stepPhase === 'subtract') {
    // Check for linear dependence
    let uMag = vecMagnitude(currentU);
    if (uMag < 0.0001) {
      warningMessage = "Warning: Vector is linearly dependent!";
      stepPhase = 'complete';
      stepDescription = 'Algorithm stopped: vectors are linearly dependent';
      autoRun = false;
      autoRunButton.html('Auto Run');
      return;
    }

    // Move to normalize
    stepPhase = 'normalize';
    stepDescription = 'Normalizing u' + (currentVecIdx + 1) + ': q' + (currentVecIdx + 1) + ' = u' + (currentVecIdx + 1) + ' / ||u' + (currentVecIdx + 1) + '||';
    isAnimating = true;
    animProgress = 0;
  }
  else if (stepPhase === 'normalize') {
    // Complete normalization
    let uMag = vecMagnitude(currentU);
    if (uMag < 0.0001) {
      warningMessage = "Warning: Vector has near-zero magnitude!";
      stepPhase = 'complete';
      stepDescription = 'Algorithm stopped: near-zero vector';
      autoRun = false;
      autoRunButton.html('Auto Run');
      return;
    }

    let q = [currentU[0] / uMag, currentU[1] / uMag, currentU[2] / uMag];
    qVectors.push(q);
    uVectors.push([...currentU]);

    currentVecIdx++;

    if (currentVecIdx >= 3) {
      stepPhase = 'complete';
      stepDescription = 'Gram-Schmidt complete! Three orthonormal vectors q1, q2, q3';
      autoRun = false;
      autoRunButton.html('Auto Run');
    } else {
      stepPhase = 'start';
      currentU = [0, 0, 0];
      currentProj = [0, 0, 0];
      allProjections = [];
      stepDescription = 'Ready for v' + (currentVecIdx + 1) + '. Press Next Step to continue.';
    }
  }
}

function computeCurrentProjection() {
  let v = inputVectors[currentVecIdx];
  let q = qVectors[currentProjIdx];

  // proj_q(v) = (v . q) * q
  let dotProd = vecDot(v, q);
  currentProj = [q[0] * dotProd, q[1] * dotProd, q[2] * dotProd];
}

function subtractProjections() {
  currentU = [...inputVectors[currentVecIdx]];
  for (let proj of allProjections) {
    currentU[0] -= proj[0];
    currentU[1] -= proj[1];
    currentU[2] -= proj[2];
  }
}

function vecDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vecMagnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function toggleAutoRun() {
  autoRun = !autoRun;
  autoRunButton.html(autoRun ? 'Pause' : 'Auto Run');
  if (autoRun) {
    lastAutoTime = millis();
  }
}

function resetSimulation() {
  initializeAlgorithm();
}

function onVectorChange() {
  // Reset when vectors change
  if (stepPhase !== 'start') {
    initializeAlgorithm();
  } else {
    // Just update the input vectors
    for (let v = 0; v < 3; v++) {
      inputVectors[v] = [];
      for (let c = 0; c < 3; c++) {
        inputVectors[v][c] = vecSliders[v][c].value();
      }
    }
  }
}

function mousePressed() {
  // Only allow dragging in the 3D view area, avoiding control panels
  if (mouseY < drawHeight && mouseX > 170 && mouseX < canvasWidth - 20) {
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
    canvasWidth = Math.max(650, Math.floor(container.offsetWidth));
  }
  canvasHeight = drawHeight + controlHeight;
}
