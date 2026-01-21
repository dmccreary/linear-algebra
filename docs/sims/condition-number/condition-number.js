// Condition Number and Sensitivity Visualizer MicroSim
// Demonstrate how condition number affects solution sensitivity
// Learning objective: Understand condition number through perturbation analysis

let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix A (2x2)
let a11 = 2, a12 = 0;
let a21 = 0, a22 = 2;

// Vector b
let b1 = 4, b2 = 4;

// Computed values
let x1, x2;  // Solution
let sigma1, sigma2;  // Singular values
let kappa;  // Condition number

// Perturbation
let epsilon = 0.3;
let showPerturbations = true;
let numPerturbations = 50;
let perturbedSolutions = [];

// UI elements
let presetSelect;
let epsilonSlider;
let showPerturbCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Preset selector
  presetSelect = createSelect();
  presetSelect.option('Well-conditioned (κ≈1)', 'well');
  presetSelect.option('Moderate (κ≈10)', 'moderate');
  presetSelect.option('Ill-conditioned (κ≈1000)', 'ill');
  presetSelect.option('Nearly Singular', 'singular');
  presetSelect.position(10, drawHeight + 15);
  presetSelect.changed(loadPreset);

  // Epsilon slider
  epsilonSlider = createSlider(0.01, 1, 0.3, 0.01);
  epsilonSlider.position(300, drawHeight + 15);
  epsilonSlider.size(120);
  epsilonSlider.input(updatePerturbations);

  // Show perturbations checkbox
  showPerturbCheckbox = createCheckbox('Show Perturbations', true);
  showPerturbCheckbox.position(10, drawHeight + 50);
  showPerturbCheckbox.style('font-size', '14px');

  computeSolution();
  updatePerturbations();

  describe('Visualization of condition number showing how perturbations in b affect the solution x', LABEL);
}

function draw() {
  updateCanvasSize();

  background(248);

  // Title
  fill(0);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('Condition Number and Sensitivity', canvasWidth/2, 10);

  // Layout: left panel (lines), right panel (info)
  let leftW = canvasWidth * 0.55;
  let rightW = canvasWidth * 0.4;

  // Draw linear system visualization
  drawLinearSystem(20, 50, leftW - 40, drawHeight - 100);

  // Draw info panel
  drawInfoPanel(leftW + 20, 50, rightW - 40, drawHeight - 100);

  // Control area
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control labels
  noStroke();
  fill(80);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Preset:', 90, drawHeight + 25);
  text('ε:', 260, drawHeight + 25);
  text(epsilon.toFixed(2), 430, drawHeight + 25);
}

function drawLinearSystem(x, y, w, h) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(0);
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('Linear System Ax = b', x + w/2, y + 5);

  // Coordinate system
  let cx = x + w/2;
  let cy = y + h/2 + 20;
  let scale = 40;
  let range = 4;

  // Grid
  stroke(230);
  strokeWeight(0.5);
  for (let i = -range; i <= range; i++) {
    line(cx + i * scale, cy - range * scale, cx + i * scale, cy + range * scale);
    line(cx - range * scale, cy + i * scale, cx + range * scale, cy + i * scale);
  }

  // Axes
  stroke(180);
  strokeWeight(1);
  line(cx - range * scale, cy, cx + range * scale, cy);
  line(cx, cy - range * scale, cx, cy + range * scale);

  // Axis labels
  fill(100);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('x₁', cx + range * scale - 10, cy + 5);
  textAlign(RIGHT, CENTER);
  text('x₂', cx - 5, cy - range * scale + 15);

  // Draw the two lines representing equations
  // Line 1: a11*x1 + a12*x2 = b1
  // Line 2: a21*x1 + a22*x2 = b2

  strokeWeight(2);

  // Line 1 (red)
  stroke(200, 80, 80);
  drawLine(cx, cy, scale, range, a11, a12, b1);

  // Line 2 (blue)
  stroke(80, 80, 200);
  drawLine(cx, cy, scale, range, a21, a22, b2);

  // Draw perturbation cloud if enabled
  if (showPerturbCheckbox.checked() && perturbedSolutions.length > 0) {
    fill(255, 180, 0, 100);
    noStroke();
    for (let p of perturbedSolutions) {
      ellipse(cx + p.x * scale, cy - p.y * scale, 5, 5);
    }
  }

  // Draw solution point
  fill(0, 180, 0);
  noStroke();
  ellipse(cx + x1 * scale, cy - x2 * scale, 12, 12);

  // Solution label
  fill(0);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('x = (' + x1.toFixed(2) + ', ' + x2.toFixed(2) + ')', cx + x1 * scale + 10, cy - x2 * scale);

  // Legend
  textSize(11);
  textAlign(LEFT, TOP);

  stroke(200, 80, 80);
  strokeWeight(2);
  line(x + 10, y + h - 35, x + 30, y + h - 35);
  noStroke();
  fill(80);
  text('Equation 1', x + 35, y + h - 40);

  stroke(80, 80, 200);
  line(x + 10, y + h - 18, x + 30, y + h - 18);
  noStroke();
  text('Equation 2', x + 35, y + h - 23);
}

function drawLine(cx, cy, scale, range, a, b, c) {
  // Draw line ax + by = c
  let points = [];

  if (Math.abs(b) > 0.001) {
    // y = (c - ax) / b
    for (let x = -range; x <= range; x += 0.1) {
      let y = (c - a * x) / b;
      if (y >= -range && y <= range) {
        points.push({x: x, y: y});
      }
    }
  } else if (Math.abs(a) > 0.001) {
    // Vertical line x = c/a
    let x = c / a;
    if (x >= -range && x <= range) {
      points.push({x: x, y: -range});
      points.push({x: x, y: range});
    }
  }

  if (points.length >= 2) {
    noFill();
    beginShape();
    for (let p of points) {
      vertex(cx + p.x * scale, cy - p.y * scale);
    }
    endShape();
  }
}

function drawInfoPanel(x, y, w, h) {
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  let lineH = 22;
  let curY = y + 15;

  // Matrix A
  text('Matrix A:', x + 15, curY);
  curY += lineH;

  textSize(13);
  text('[' + a11.toFixed(3) + '  ' + a12.toFixed(3) + ']', x + 25, curY);
  curY += 18;
  text('[' + a21.toFixed(3) + '  ' + a22.toFixed(3) + ']', x + 25, curY);
  curY += lineH + 5;

  // Vector b
  textSize(14);
  text('Vector b:', x + 15, curY);
  curY += lineH;
  textSize(13);
  text('[' + b1.toFixed(2) + ', ' + b2.toFixed(2) + ']ᵀ', x + 25, curY);
  curY += lineH + 10;

  // Singular values
  textSize(14);
  text('Singular Values:', x + 15, curY);
  curY += lineH;
  textSize(13);
  fill(0, 120, 0);
  text('σ₁ = ' + sigma1.toFixed(4), x + 25, curY);
  curY += 18;
  fill(sigma2 < 0.01 ? color(200, 0, 0) : color(0, 120, 0));
  text('σ₂ = ' + sigma2.toFixed(4), x + 25, curY);
  curY += lineH + 5;

  // Condition number
  fill(0);
  textSize(14);
  text('Condition Number:', x + 15, curY);
  curY += lineH;

  // Color based on condition
  let kappaColor;
  if (kappa < 10) kappaColor = color(0, 150, 0);
  else if (kappa < 100) kappaColor = color(200, 150, 0);
  else kappaColor = color(200, 0, 0);

  textSize(16);
  fill(kappaColor);
  let kappaStr = kappa < 1e6 ? 'κ = ' + kappa.toFixed(1) : 'κ ≈ ∞';
  text(kappaStr, x + 25, curY);
  curY += lineH + 5;

  // Interpretation
  fill(60);
  textSize(12);
  let interp;
  if (kappa < 10) {
    interp = '✓ Well-conditioned: stable';
  } else if (kappa < 100) {
    interp = '⚠ Moderate: some sensitivity';
  } else if (kappa < 1e6) {
    interp = '⚠ Ill-conditioned: lose ~' + Math.floor(Math.log10(kappa)) + ' digits';
  } else {
    interp = '✗ Nearly singular: unstable';
  }
  text(interp, x + 15, curY);
  curY += lineH + 10;

  // Singular value bar chart
  fill(0);
  textSize(12);
  text('σ₁/σ₂ ratio:', x + 15, curY);
  curY += 20;

  let barW = w - 50;
  let barH = 15;

  // σ₁ bar
  fill(70, 130, 200);
  noStroke();
  rect(x + 15, curY, barW, barH, 3);

  // σ₂ bar (scaled)
  let s2Width = sigma1 > 0.001 ? (sigma2 / sigma1) * barW : 0;
  fill(200, 130, 70);
  rect(x + 15, curY + 20, max(s2Width, 2), barH, 3);

  fill(80);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('σ₁', x + 15 + barW + 5, curY + barH/2);
  text('σ₂', x + 15 + s2Width + 5, curY + 20 + barH/2);
}

function computeSolution() {
  // Solve Ax = b using Cramer's rule
  let det = a11 * a22 - a12 * a21;

  if (Math.abs(det) > 1e-10) {
    x1 = (b1 * a22 - b2 * a12) / det;
    x2 = (a11 * b2 - a21 * b1) / det;
  } else {
    x1 = 0;
    x2 = 0;
  }

  // Compute singular values
  // For 2x2: eigenvalues of A^T A
  let AtA = [
    [a11*a11 + a21*a21, a11*a12 + a21*a22],
    [a12*a11 + a22*a21, a12*a12 + a22*a22]
  ];

  let trace = AtA[0][0] + AtA[1][1];
  let detAtA = AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0];
  let disc = Math.sqrt(Math.max(0, trace * trace - 4 * detAtA));

  sigma1 = Math.sqrt(Math.max(0, (trace + disc) / 2));
  sigma2 = Math.sqrt(Math.max(0, (trace - disc) / 2));

  // Condition number
  kappa = sigma2 > 1e-10 ? sigma1 / sigma2 : 1e10;
}

function updatePerturbations() {
  epsilon = epsilonSlider.value();

  perturbedSolutions = [];

  for (let i = 0; i < numPerturbations; i++) {
    // Random perturbation to b
    let angle = Math.random() * TWO_PI;
    let r = Math.random() * epsilon;
    let db1 = r * Math.cos(angle);
    let db2 = r * Math.sin(angle);

    // Solve perturbed system
    let pb1 = b1 + db1;
    let pb2 = b2 + db2;

    let det = a11 * a22 - a12 * a21;
    if (Math.abs(det) > 1e-10) {
      let px1 = (pb1 * a22 - pb2 * a12) / det;
      let px2 = (a11 * pb2 - a21 * pb1) / det;
      perturbedSolutions.push({x: px1, y: px2});
    }
  }
}

function loadPreset() {
  let preset = presetSelect.value();

  if (preset === 'well') {
    a11 = 2; a12 = 0;
    a21 = 0; a22 = 2;
    b1 = 4; b2 = 4;
  } else if (preset === 'moderate') {
    a11 = 10; a12 = 1;
    a21 = 1; a22 = 1;
    b1 = 11; b2 = 2;
  } else if (preset === 'ill') {
    a11 = 1; a12 = 1;
    a21 = 1; a22 = 1.001;
    b1 = 2; b2 = 2.001;
  } else if (preset === 'singular') {
    a11 = 1; a12 = 2;
    a21 = 2; a22 = 4.0001;
    b1 = 3; b2 = 6;
  }

  computeSolution();
  updatePerturbations();
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
