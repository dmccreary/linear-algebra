// Positive Definiteness Visualizer MicroSim
// Visualize quadratic form x^T A x as a 3D surface
// Learning objective: Understand positive definiteness geometrically

let canvasWidth = 900;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix (2x2 symmetric)
let a11 = 3;
let a12 = 1;  // a21 = a12 (symmetric)
let a22 = 2;

// Computed values
let eigenvalue1 = 0;
let eigenvalue2 = 0;
let eigenvector1 = [1, 0];
let eigenvector2 = [0, 1];
let classification = '';

// 3D view parameters
let rotX = -0.6;
let rotY = 0.4;
let isDragging = false;
let lastMouseX, lastMouseY;

// Surface mesh
let surfacePoints = [];
let gridSize = 30;
let plotRange = 2;
let verticalScale = 40;

// UI elements
let a11Slider, a12Slider, a22Slider;
let presetSelect;
let showContourCheckbox;

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

  // Preset selector
  presetSelect = createSelect();
  presetSelect.option('Positive Definite', 'pd');
  presetSelect.option('Negative Definite', 'nd');
  presetSelect.option('Indefinite (Saddle)', 'indef');
  presetSelect.option('Positive Semi-Definite', 'psd');
  presetSelect.position(10, drawHeight + 12);
  presetSelect.changed(loadPreset);

  // Matrix entry sliders
  a11Slider = createSlider(-5, 5, a11, 0.1);
  a11Slider.position(250, drawHeight + 10);
  a11Slider.size(100);
  a11Slider.input(updateMatrix);

  a12Slider = createSlider(-5, 5, a12, 0.1);
  a12Slider.position(250, drawHeight + 40);
  a12Slider.size(100);
  a12Slider.input(updateMatrix);

  a22Slider = createSlider(-5, 5, a22, 0.1);
  a22Slider.position(450, drawHeight + 10);
  a22Slider.size(100);
  a22Slider.input(updateMatrix);

  // Contour checkbox
  showContourCheckbox = createCheckbox('Show Contours', true);
  showContourCheckbox.position(580, drawHeight + 15);
  showContourCheckbox.style('font-size', '14px');

  computeEigenvalues();
  generateSurface();

  describe('3D visualization of quadratic form showing positive definiteness', LABEL);
}

function draw() {
  updateCanvasSize();

  // Update sliders if changed
  if (a11 !== a11Slider.value() || a12 !== a12Slider.value() || a22 !== a22Slider.value()) {
    updateMatrix();
  }

  background(240);

  // Draw 3D content
  push();

  // Set up view
  rotateX(rotX);
  rotateY(rotY);

  // Draw coordinate axes
  drawAxes();

  // Draw surface
  drawSurface();

  // Draw contours on base plane if enabled
  if (showContourCheckbox.checked()) {
    drawContours();
  }

  // Draw eigenvector directions on base plane
  drawEigenvectors();

  pop();

  // Draw 2D overlay
  draw2DOverlay();
}

function drawAxes() {
  let axisLen = 120;
  strokeWeight(1);

  // X axis
  stroke(180, 0, 0);
  line(-axisLen, 0, 0, axisLen, 0, 0);

  // Y axis (in 3D space, this is z direction visually)
  stroke(0, 180, 0);
  line(0, 0, -axisLen, 0, 0, axisLen);

  // Z axis (vertical - f(x,y) value)
  stroke(0, 0, 180);
  line(0, -axisLen * 1.5, 0, 0, axisLen * 1.5, 0);

  // Grid on base plane
  stroke(220);
  strokeWeight(0.5);
  let gridStep = 30;
  for (let i = -4; i <= 4; i++) {
    line(i * gridStep, 0, -axisLen, i * gridStep, 0, axisLen);
    line(-axisLen, 0, i * gridStep, axisLen, 0, i * gridStep);
  }
}

function drawSurface() {
  // Draw surface as triangle strip
  let scale = 60;

  for (let i = 0; i < gridSize - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < gridSize; j++) {
      let p1 = surfacePoints[i][j];
      let p2 = surfacePoints[i + 1][j];

      // Color based on height
      let col1 = getHeightColor(p1.z);
      let col2 = getHeightColor(p2.z);

      fill(col1);
      stroke(100, 100, 100, 50);
      strokeWeight(0.5);
      vertex(p1.x * scale, -p1.z * verticalScale, p1.y * scale);

      fill(col2);
      vertex(p2.x * scale, -p2.z * verticalScale, p2.y * scale);
    }
    endShape();
  }
}

function getHeightColor(z) {
  // Map z value to color: negative=red, zero=white, positive=green
  if (z > 0) {
    let g = map(z, 0, 5, 200, 80);
    return color(80, g, 80, 200);
  } else if (z < 0) {
    let r = map(z, -5, 0, 80, 200);
    return color(r, 80, 80, 200);
  } else {
    return color(200, 200, 200, 200);
  }
}

function drawContours() {
  let scale = 60;
  let levels = [-3, -2, -1, 0, 1, 2, 3];

  for (let level of levels) {
    if (level === 0) {
      stroke(0, 0, 0, 200);
      strokeWeight(2);
    } else if (level > 0) {
      stroke(60, 120, 60, 150);
      strokeWeight(1);
    } else {
      stroke(120, 60, 60, 150);
      strokeWeight(1);
    }

    // Draw contour as line segments
    noFill();
    beginShape();
    let points = getContourPoints(level);
    for (let p of points) {
      vertex(p.x * scale, 0.5, p.y * scale);  // On base plane
    }
    endShape();
  }
}

function getContourPoints(level) {
  // Generate contour points for level set x^T A x = level
  // For 2x2: a11*x^2 + 2*a12*x*y + a22*y^2 = level
  let points = [];
  let nPoints = 100;

  for (let i = 0; i <= nPoints; i++) {
    let theta = (i / nPoints) * TWO_PI;

    // Solve for r: r^2 * (a11*cos^2 + 2*a12*cos*sin + a22*sin^2) = level
    let cos_t = cos(theta);
    let sin_t = sin(theta);
    let quadCoef = a11 * cos_t * cos_t + 2 * a12 * cos_t * sin_t + a22 * sin_t * sin_t;

    if (quadCoef * level > 0) {
      let r = sqrt(abs(level / quadCoef));
      points.push({x: r * cos_t, y: r * sin_t});
    }
  }

  return points;
}

function drawEigenvectors() {
  let scale = 80;
  strokeWeight(3);

  // Eigenvector 1
  if (eigenvalue1 > 0) stroke(0, 150, 0);
  else if (eigenvalue1 < 0) stroke(150, 0, 0);
  else stroke(150, 150, 0);

  let len1 = sqrt(eigenvector1[0] * eigenvector1[0] + eigenvector1[1] * eigenvector1[1]);
  let ev1x = eigenvector1[0] / len1 * scale;
  let ev1y = eigenvector1[1] / len1 * scale;
  line(-ev1x, 0, -ev1y, ev1x, 0, ev1y);

  // Eigenvector 2
  if (eigenvalue2 > 0) stroke(0, 150, 0);
  else if (eigenvalue2 < 0) stroke(150, 0, 0);
  else stroke(150, 150, 0);

  let len2 = sqrt(eigenvector2[0] * eigenvector2[0] + eigenvector2[1] * eigenvector2[1]);
  let ev2x = eigenvector2[0] / len2 * scale;
  let ev2y = eigenvector2[1] / len2 * scale;
  line(-ev2x, 0, -ev2y, ev2x, 0, ev2y);
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
  text('Positive Definiteness Visualizer', canvasWidth/2, 10);

  // Left panel - Matrix
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(10, 40, 120, 90, 8);

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text('Matrix A:', 20, 48);

  textSize(16);
  text('[' + a11.toFixed(1) + '  ' + a12.toFixed(1) + ']', 25, 72);
  text('[' + a12.toFixed(1) + '  ' + a22.toFixed(1) + ']', 25, 95);

  // Right panel - Eigenvalues and classification
  fill(255, 255, 255, 240);
  stroke(200);
  rect(canvasWidth - 180, 40, 170, 130, 8);

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text('Eigenvalues:', canvasWidth - 170, 48);

  // λ1
  if (eigenvalue1 > 0.001) fill(0, 120, 0);
  else if (eigenvalue1 < -0.001) fill(180, 0, 0);
  else fill(150, 150, 0);
  textSize(15);
  text('λ₁ = ' + eigenvalue1.toFixed(3), canvasWidth - 170, 70);

  // λ2
  if (eigenvalue2 > 0.001) fill(0, 120, 0);
  else if (eigenvalue2 < -0.001) fill(180, 0, 0);
  else fill(150, 150, 0);
  text('λ₂ = ' + eigenvalue2.toFixed(3), canvasWidth - 170, 92);

  // Classification
  fill(0);
  textSize(13);
  text('Classification:', canvasWidth - 170, 120);

  textSize(14);
  if (classification === 'Positive Definite') fill(0, 120, 0);
  else if (classification === 'Negative Definite') fill(180, 0, 0);
  else if (classification === 'Indefinite') fill(180, 100, 0);
  else fill(150, 150, 0);

  text(classification, canvasWidth - 170, 140);

  // Control area background
  fill(255);
  stroke(200);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Slider labels
  noStroke();
  fill(80);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('a₁₁:', 245, drawHeight + 20);
  text('a₁₂:', 245, drawHeight + 50);
  text('a₂₂:', 445, drawHeight + 20);

  textAlign(LEFT, CENTER);
  text(a11.toFixed(1), 355, drawHeight + 20);
  text(a12.toFixed(1), 355, drawHeight + 50);
  text(a22.toFixed(1), 555, drawHeight + 20);

  // Instructions
  fill(100);
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('Drag to rotate | Green = positive, Red = negative', canvasWidth - 20, drawHeight + 55);

  pop();
}

function updateMatrix() {
  a11 = a11Slider.value();
  a12 = a12Slider.value();
  a22 = a22Slider.value();

  computeEigenvalues();
  generateSurface();
}

function computeEigenvalues() {
  // For 2x2 symmetric matrix: λ = (trace ± sqrt(trace² - 4*det)) / 2
  let trace = a11 + a22;
  let det = a11 * a22 - a12 * a12;
  let discriminant = trace * trace - 4 * det;

  if (discriminant >= 0) {
    let sqrtDisc = sqrt(discriminant);
    eigenvalue1 = (trace + sqrtDisc) / 2;
    eigenvalue2 = (trace - sqrtDisc) / 2;
  } else {
    // Complex eigenvalues (shouldn't happen for symmetric matrix)
    eigenvalue1 = trace / 2;
    eigenvalue2 = trace / 2;
  }

  // Compute eigenvectors
  if (abs(a12) > 0.001) {
    eigenvector1 = [eigenvalue1 - a22, a12];
    eigenvector2 = [eigenvalue2 - a22, a12];
  } else {
    eigenvector1 = [1, 0];
    eigenvector2 = [0, 1];
  }

  // Classification
  let eps = 0.001;
  if (eigenvalue1 > eps && eigenvalue2 > eps) {
    classification = 'Positive Definite';
  } else if (eigenvalue1 < -eps && eigenvalue2 < -eps) {
    classification = 'Negative Definite';
  } else if (eigenvalue1 * eigenvalue2 < -eps * eps) {
    classification = 'Indefinite';
  } else if (eigenvalue1 >= 0 && eigenvalue2 >= 0) {
    classification = 'Positive Semi-Def';
  } else if (eigenvalue1 <= 0 && eigenvalue2 <= 0) {
    classification = 'Negative Semi-Def';
  } else {
    classification = 'Unknown';
  }
}

function generateSurface() {
  surfacePoints = [];

  for (let i = 0; i < gridSize; i++) {
    surfacePoints[i] = [];
    for (let j = 0; j < gridSize; j++) {
      let x = map(i, 0, gridSize - 1, -plotRange, plotRange);
      let y = map(j, 0, gridSize - 1, -plotRange, plotRange);

      // Quadratic form: x^T A x = a11*x² + 2*a12*xy + a22*y²
      let z = a11 * x * x + 2 * a12 * x * y + a22 * y * y;

      // Clamp for visualization
      z = constrain(z, -5, 5);

      surfacePoints[i][j] = {x: x, y: y, z: z};
    }
  }
}

function loadPreset() {
  let preset = presetSelect.value();

  if (preset === 'pd') {
    a11 = 3; a12 = 1; a22 = 2;
  } else if (preset === 'nd') {
    a11 = -3; a12 = 1; a22 = -2;
  } else if (preset === 'indef') {
    a11 = 2; a12 = 0; a22 = -1;
  } else if (preset === 'psd') {
    a11 = 1; a12 = 1; a22 = 1;
  }

  a11Slider.value(a11);
  a12Slider.value(a12);
  a22Slider.value(a22);

  computeEigenvalues();
  generateSurface();
}

function mousePressed() {
  if (mouseY < drawHeight && mouseX > 130 && mouseX < canvasWidth - 190) {
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
