// Hessian and Curvature Visualizer MicroSim
// Connect Hessian eigenvalues to geometric curvature of 2D functions
// Uses WEBGL for 3D rendering
// Author: Claude AI for Linear Algebra Intelligent Textbook

// Canvas dimensions
let containerWidth;
let canvasWidth = 800;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// 3D view parameters
let rotateX = -0.6;
let rotateY = 0.0;
let zoom = 1.0;

// Current point on surface
let pointX = 0;
let pointY = 0;
let isDragging = false;

// UI controls
let functionSelect;
let showDirectionsCheckbox;
let showApproxCheckbox;
let currentFunction = 'x^2+y^2';

// Font for WEBGL text
let font;

// Function definitions with their Hessians
const functions = {
  'x^2+y^2': {
    f: (x, y) => x * x + y * y,
    hessian: (x, y) => [[2, 0], [0, 2]],
    label: 'f(x,y) = x² + y² (Bowl)',
    type: 'minimum'
  },
  'x^2-y^2': {
    f: (x, y) => x * x - y * y,
    hessian: (x, y) => [[2, 0], [0, -2]],
    label: 'f(x,y) = x² - y² (Saddle)',
    type: 'saddle'
  },
  'x^2+0.1y^2': {
    f: (x, y) => x * x + 0.1 * y * y,
    hessian: (x, y) => [[2, 0], [0, 0.2]],
    label: 'f(x,y) = x² + 0.1y² (Elongated)',
    type: 'minimum'
  },
  '2x^2+y^2': {
    f: (x, y) => 2 * x * x + y * y,
    hessian: (x, y) => [[4, 0], [0, 2]],
    label: 'f(x,y) = 2x² + y² (Elliptical)',
    type: 'minimum'
  }
};

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textFont(font);

  // Create function selector
  functionSelect = createSelect();
  functionSelect.parent(mainElement);
  functionSelect.position(10, drawHeight + 10);
  for (let fname in functions) {
    functionSelect.option(fname);
  }
  functionSelect.selected('x^2+y^2');
  functionSelect.changed(() => currentFunction = functionSelect.value());

  // Create checkboxes
  showDirectionsCheckbox = createCheckbox('Show Principal Directions', true);
  showDirectionsCheckbox.parent(mainElement);
  showDirectionsCheckbox.position(10, drawHeight + 45);

  showApproxCheckbox = createCheckbox('Show Quadratic Approx', false);
  showApproxCheckbox.parent(mainElement);
  showApproxCheckbox.position(200, drawHeight + 45);

  describe('3D visualization of function surfaces with Hessian eigenvalue analysis showing curvature directions', LABEL);
}

function draw() {
  updateCanvasSize();

  // Clear and set up
  background(245);

  // Draw control area background (in screen space)
  push();
  resetMatrix();
  translate(-canvasWidth/2, -canvasHeight/2);
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);
  pop();

  // Get current function data
  let funcData = functions[currentFunction];
  let f = funcData.f;
  let H = funcData.hessian(pointX, pointY);

  // Calculate eigenvalues and eigenvectors
  let eigen = computeEigen2x2(H);

  // Set up 3D view
  push();
  translate(0, -50, 0);
  rotateX(rotateX);
  rotateY(rotateY);
  scale(zoom);

  // Draw coordinate axes
  drawAxes3D();

  // Draw surface
  drawSurface(f);

  // Draw contour lines on the base
  drawContours(f);

  // Draw current point and analysis
  let z = f(pointX, pointY);
  drawCurrentPoint(pointX, pointY, z, eigen);

  // Draw principal directions if enabled
  if (showDirectionsCheckbox.checked()) {
    drawPrincipalDirections(pointX, pointY, z, eigen);
  }

  // Draw quadratic approximation if enabled
  if (showApproxCheckbox.checked()) {
    drawQuadraticApprox(pointX, pointY, f, H);
  }

  pop();

  // Draw info panel (in screen space)
  drawInfoPanel(eigen, funcData.type);

  // Draw title (in screen space)
  push();
  resetMatrix();
  translate(-canvasWidth/2, -canvasHeight/2);
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text('Hessian and Curvature Visualizer', canvasWidth/2, 10);
  textSize(14);
  text('Drag to rotate view, click on base plane to move point', canvasWidth/2, 32);
  pop();
}

function drawAxes3D() {
  let axisLength = 150;
  strokeWeight(1.5);

  // X axis (red)
  stroke(200, 50, 50);
  line(0, 0, 0, axisLength, 0, 0);

  // Y axis (green)
  stroke(50, 150, 50);
  line(0, 0, 0, 0, 0, axisLength);

  // Z axis (blue) - points up
  stroke(50, 50, 200);
  line(0, 0, 0, 0, -axisLength, 0);
}

function drawSurface(f) {
  let gridSize = 30;
  let range = 2;
  let step = (2 * range) / gridSize;
  let scale = 50;
  let zScale = 30;

  stroke(100, 100, 150, 100);
  strokeWeight(0.5);

  for (let i = 0; i < gridSize; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j <= gridSize; j++) {
      let x1 = -range + i * step;
      let x2 = -range + (i + 1) * step;
      let y = -range + j * step;

      let z1 = f(x1, y);
      let z2 = f(x2, y);

      // Color based on z value
      let c1 = lerpColor(color(100, 150, 255), color(255, 150, 100), map(z1, 0, 4, 0, 1));
      let c2 = lerpColor(color(100, 150, 255), color(255, 150, 100), map(z2, 0, 4, 0, 1));

      fill(c1);
      vertex(x1 * scale, -z1 * zScale, y * scale);
      fill(c2);
      vertex(x2 * scale, -z2 * zScale, y * scale);
    }
    endShape();
  }
}

function drawContours(f) {
  let scale = 50;
  let range = 2;
  let levels = [0.5, 1, 2, 3, 4];

  stroke(80);
  strokeWeight(1);
  noFill();

  for (let level of levels) {
    // Draw contour at this level using marching approach
    beginShape();
    let steps = 60;
    for (let i = 0; i <= steps; i++) {
      let angle = (i / steps) * TWO_PI;
      // Find radius where f(r*cos(a), r*sin(a)) = level
      // For quadratic forms, approximate
      let r = sqrt(level);  // Works exactly for x²+y²
      let x = r * cos(angle);
      let y = r * sin(angle);
      if (abs(f(x, y) - level) > 0.5) {
        // Adjust radius iteratively
        for (let iter = 0; iter < 5; iter++) {
          let fVal = f(x, y);
          let ratio = sqrt(level / max(0.01, fVal));
          x *= ratio;
          y *= ratio;
        }
      }
      if (abs(x) <= range && abs(y) <= range) {
        vertex(x * scale, 0, y * scale);
      }
    }
    endShape(CLOSE);
  }
}

function drawCurrentPoint(x, y, z, eigen) {
  let scale = 50;
  let zScale = 30;

  // Point on surface
  push();
  translate(x * scale, -z * zScale, y * scale);
  fill(255, 100, 100);
  noStroke();
  sphere(6);
  pop();

  // Point projection on base
  push();
  translate(x * scale, 0, y * scale);
  fill(100, 100, 255, 150);
  noStroke();
  sphere(5);
  pop();

  // Vertical line connecting them
  stroke(150);
  strokeWeight(1);
  line(x * scale, 0, y * scale, x * scale, -z * zScale, y * scale);
}

function drawPrincipalDirections(px, py, pz, eigen) {
  let scale = 50;
  let zScale = 30;
  let arrowScale = 30;

  push();
  translate(px * scale, -pz * zScale, py * scale);

  // First eigenvector
  let e1 = eigen.v1;
  let mag1 = abs(eigen.l1) * 0.5;
  let color1 = eigen.l1 > 0 ? color(50, 200, 50) : color(200, 50, 50);
  stroke(color1);
  strokeWeight(3);
  line(0, 0, 0, e1[0] * arrowScale * mag1, 0, e1[1] * arrowScale * mag1);
  line(0, 0, 0, -e1[0] * arrowScale * mag1, 0, -e1[1] * arrowScale * mag1);

  // Second eigenvector
  let e2 = eigen.v2;
  let mag2 = abs(eigen.l2) * 0.5;
  let color2 = eigen.l2 > 0 ? color(50, 200, 50) : color(200, 50, 50);
  stroke(color2);
  line(0, 0, 0, e2[0] * arrowScale * mag2, 0, e2[1] * arrowScale * mag2);
  line(0, 0, 0, -e2[0] * arrowScale * mag2, 0, -e2[1] * arrowScale * mag2);

  pop();
}

function drawQuadraticApprox(px, py, f, H) {
  let scale = 50;
  let zScale = 30;
  let range = 0.8;
  let gridSize = 15;
  let step = (2 * range) / gridSize;

  let fP = f(px, py);

  stroke(255, 200, 100, 150);
  strokeWeight(0.5);
  fill(255, 220, 150, 100);

  for (let i = 0; i < gridSize; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j <= gridSize; j++) {
      let dx1 = -range + i * step;
      let dx2 = -range + (i + 1) * step;
      let dy = -range + j * step;

      // Quadratic approximation: f(p) + 0.5 * d^T H d
      let z1 = fP + 0.5 * (H[0][0] * dx1 * dx1 + 2 * H[0][1] * dx1 * dy + H[1][1] * dy * dy);
      let z2 = fP + 0.5 * (H[0][0] * dx2 * dx2 + 2 * H[0][1] * dx2 * dy + H[1][1] * dy * dy);

      vertex((px + dx1) * scale, -z1 * zScale, (py + dy) * scale);
      vertex((px + dx2) * scale, -z2 * zScale, (py + dy) * scale);
    }
    endShape();
  }
}

function drawInfoPanel(eigen, type) {
  push();
  resetMatrix();
  translate(-canvasWidth/2, -canvasHeight/2);

  let panelX = 10;
  let panelY = 60;
  let panelW = 180;
  let panelH = 130;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text('Hessian Eigenvalues:', panelX + 10, panelY + 10);

  // First eigenvalue
  let color1 = eigen.l1 > 0 ? color(50, 150, 50) : color(200, 50, 50);
  fill(color1);
  textSize(13);
  text('\u03BB\u2081 = ' + eigen.l1.toFixed(2), panelX + 10, panelY + 35);

  // Second eigenvalue
  let color2 = eigen.l2 > 0 ? color(50, 150, 50) : color(200, 50, 50);
  fill(color2);
  text('\u03BB\u2082 = ' + eigen.l2.toFixed(2), panelX + 10, panelY + 55);

  // Type indicator
  fill(0);
  textSize(12);
  text('Point type:', panelX + 10, panelY + 80);

  let typeText, typeColor;
  if (eigen.l1 > 0 && eigen.l2 > 0) {
    typeText = 'Local Minimum';
    typeColor = color(50, 150, 50);
  } else if (eigen.l1 < 0 && eigen.l2 < 0) {
    typeText = 'Local Maximum';
    typeColor = color(200, 50, 50);
  } else {
    typeText = 'Saddle Point';
    typeColor = color(200, 150, 50);
  }

  fill(typeColor);
  textSize(14);
  text(typeText, panelX + 10, panelY + 100);

  pop();
}

// Compute eigenvalues and eigenvectors of 2x2 matrix
function computeEigen2x2(H) {
  let a = H[0][0], b = H[0][1];
  let c = H[1][0], d = H[1][1];

  // Eigenvalues from characteristic polynomial
  let trace = a + d;
  let det = a * d - b * c;
  let disc = sqrt(max(0, trace * trace - 4 * det));

  let l1 = (trace + disc) / 2;
  let l2 = (trace - disc) / 2;

  // Eigenvectors
  let v1, v2;
  if (abs(b) > 0.0001) {
    v1 = normalize2D([l1 - d, b]);
    v2 = normalize2D([l2 - d, b]);
  } else if (abs(c) > 0.0001) {
    v1 = normalize2D([b, l1 - a]);
    v2 = normalize2D([b, l2 - a]);
  } else {
    v1 = [1, 0];
    v2 = [0, 1];
  }

  return { l1: l1, l2: l2, v1: v1, v2: v2 };
}

function normalize2D(v) {
  let mag = sqrt(v[0] * v[0] + v[1] * v[1]);
  if (mag < 0.0001) return [1, 0];
  return [v[0] / mag, v[1] / mag];
}

// Mouse interaction
function mousePressed() {
  if (mouseY < drawHeight) {
    isDragging = true;
  }
}

function mouseDragged() {
  if (isDragging && mouseY < drawHeight) {
    rotateY += (mouseX - pmouseX) * 0.01;
    rotateX += (mouseY - pmouseY) * 0.01;
    rotateX = constrain(rotateX, -PI/2, 0);
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseWheel(event) {
  if (mouseY < drawHeight) {
    zoom -= event.delta * 0.001;
    zoom = constrain(zoom, 0.5, 2);
    return false;
  }
}

// Keyboard for moving point
function keyPressed() {
  let step = 0.1;
  if (keyCode === LEFT_ARROW) pointX -= step;
  if (keyCode === RIGHT_ARROW) pointX += step;
  if (keyCode === UP_ARROW) pointY -= step;
  if (keyCode === DOWN_ARROW) pointY += step;
  pointX = constrain(pointX, -1.5, 1.5);
  pointY = constrain(pointY, -1.5, 1.5);
}

// Responsive design functions
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
