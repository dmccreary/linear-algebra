// Orthogonal Matrix Transformation Visualizer
// Demonstrates that orthogonal matrices preserve lengths and angles
// by visualizing how rotation matrices transform shapes without distortion.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Transformation parameters
let angle = 45;  // degrees
let isReflection = false;

// UI elements
let angleSlider;
let showLengthsCheckbox;
let showAnglesCheckbox;
let reflectionButton;

// Display options
let showLengths = true;
let showAngles = false;

// Coordinate system
let scale = 60;  // pixels per unit
let originX, originY;

// Original shape vertices (unit square)
let originalVertices = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 }
];

// Sample vectors for demonstration
let sampleVectors = [
  { x: 1, y: 0 },
  { x: 0.7, y: 0.7 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Create angle slider
  angleSlider = createSlider(0, 360, 45, 1);
  angleSlider.position(sliderLeftMargin, drawHeight + 8);
  angleSlider.size(canvasWidth - sliderLeftMargin - margin - 150);
  angleSlider.input(() => angle = angleSlider.value());

  // Create checkboxes
  showLengthsCheckbox = createCheckbox(' Lengths', true);
  showLengthsCheckbox.position(10, drawHeight + 43);
  showLengthsCheckbox.changed(() => showLengths = showLengthsCheckbox.checked());

  showAnglesCheckbox = createCheckbox(' Angles', false);
  showAnglesCheckbox.position(90, drawHeight + 43);
  showAnglesCheckbox.changed(() => showAngles = showAnglesCheckbox.checked());

  // Create reflection button
  reflectionButton = createButton('Reflect');
  reflectionButton.position(170, drawHeight + 43);
  reflectionButton.mousePressed(() => isReflection = !isReflection);

  describe('Visualization of orthogonal matrix transformations showing rotation and reflection with length and angle preservation.', LABEL);
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
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Orthogonal Matrix Transformation', canvasWidth / 2, 8);

  // Set origin to center of drawing area
  originX = canvasWidth * 0.4;
  originY = drawHeight * 0.55;

  // Draw coordinate system
  drawCoordinateSystem();

  // Get transformation matrix
  let theta = radians(angle);
  let cosT = cos(theta);
  let sinT = sin(theta);

  // Apply reflection if enabled
  let reflectFactor = isReflection ? -1 : 1;

  // Draw original shape
  drawShape(originalVertices, color(0, 100, 200, 100), color(0, 100, 200), 'Original');

  // Transform and draw
  let transformedVertices = originalVertices.map(v => ({
    x: cosT * v.x - sinT * v.y * reflectFactor,
    y: sinT * v.x + cosT * v.y * reflectFactor
  }));

  drawShape(transformedVertices, color(200, 50, 50, 100), color(200, 50, 50), 'Transformed');

  // Draw vectors and annotations
  if (showLengths || showAngles) {
    drawVectorAnnotations(theta, reflectFactor);
  }

  // Draw matrix display
  drawMatrixDisplay(cosT, sinT, reflectFactor);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Angle: ' + angle + '°', 10, drawHeight + 20);

  // Update reflection button text
  reflectionButton.html(isReflection ? 'Undo Reflect' : 'Reflect');
}

function drawCoordinateSystem() {
  // Grid
  stroke(220);
  strokeWeight(1);
  for (let i = -3; i <= 3; i++) {
    // Vertical lines
    line(originX + i * scale, originY - 3 * scale, originX + i * scale, originY + 3 * scale);
    // Horizontal lines
    line(originX - 3 * scale, originY - i * scale, originX + 3 * scale, originY - i * scale);
  }

  // Axes
  stroke(100);
  strokeWeight(2);
  // X axis
  line(originX - 3 * scale, originY, originX + 3 * scale, originY);
  // Y axis
  line(originX, originY + 3 * scale, originX, originY - 3 * scale);

  // Axis labels
  fill(100);
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('x', originX + 3 * scale + 10, originY - 5);
  textAlign(RIGHT, CENTER);
  text('y', originX + 5, originY - 3 * scale - 10);

  // Origin label
  textAlign(RIGHT, TOP);
  textSize(12);
  text('O', originX - 5, originY + 5);
}

function drawShape(vertices, fillColor, strokeColor, label) {
  // Draw filled shape
  fill(fillColor);
  stroke(strokeColor);
  strokeWeight(2);
  beginShape();
  for (let v of vertices) {
    vertex(originX + v.x * scale, originY - v.y * scale);
  }
  endShape(CLOSE);

  // Draw vertices as dots
  fill(strokeColor);
  noStroke();
  for (let v of vertices) {
    circle(originX + v.x * scale, originY - v.y * scale, 6);
  }
}

function drawVectorAnnotations(theta, reflectFactor) {
  let cosT = cos(theta);
  let sinT = sin(theta);

  // Draw sample vectors
  for (let i = 0; i < sampleVectors.length; i++) {
    let v = sampleVectors[i];
    let tv = {
      x: cosT * v.x - sinT * v.y * reflectFactor,
      y: sinT * v.x + cosT * v.y * reflectFactor
    };

    // Original vector
    stroke(0, 100, 200);
    strokeWeight(2);
    drawArrow(originX, originY, originX + v.x * scale, originY - v.y * scale);

    // Transformed vector
    stroke(200, 50, 50);
    drawArrow(originX, originY, originX + tv.x * scale, originY - tv.y * scale);

    if (showLengths) {
      // Calculate lengths
      let origLen = sqrt(v.x * v.x + v.y * v.y);
      let transLen = sqrt(tv.x * tv.x + tv.y * tv.y);

      // Show length annotations
      fill(0, 100, 200);
      noStroke();
      textSize(11);
      textAlign(LEFT, CENTER);
      let midOrig = { x: v.x * 0.5, y: v.y * 0.5 };
      text('|v|=' + origLen.toFixed(2), originX + midOrig.x * scale + 5, originY - midOrig.y * scale - 10);

      fill(200, 50, 50);
      let midTrans = { x: tv.x * 0.5, y: tv.y * 0.5 };
      text('|Qv|=' + transLen.toFixed(2), originX + midTrans.x * scale + 5, originY - midTrans.y * scale + 10);
    }
  }

  if (showAngles && sampleVectors.length >= 2) {
    // Draw angle between original vectors
    let v1 = sampleVectors[0];
    let v2 = sampleVectors[1];
    let angle1 = atan2(v1.y, v1.x);
    let angle2 = atan2(v2.y, v2.x);

    // Transform vectors
    let tv1 = {
      x: cosT * v1.x - sinT * v1.y * reflectFactor,
      y: sinT * v1.x + cosT * v1.y * reflectFactor
    };
    let tv2 = {
      x: cosT * v2.x - sinT * v2.y * reflectFactor,
      y: sinT * v2.x + cosT * v2.y * reflectFactor
    };
    let tAngle1 = atan2(tv1.y, tv1.x);
    let tAngle2 = atan2(tv2.y, tv2.x);

    // Draw angle arcs
    noFill();
    stroke(0, 100, 200, 150);
    strokeWeight(2);
    arc(originX, originY, 40, 40, -angle2, -angle1);

    stroke(200, 50, 50, 150);
    arc(originX, originY, 50, 50, -tAngle2, -tAngle1);

    // Angle labels
    let angleBetween = degrees(abs(angle2 - angle1));
    let tAngleBetween = degrees(abs(tAngle2 - tAngle1));

    fill(0, 100, 200);
    noStroke();
    textSize(10);
    text('θ=' + angleBetween.toFixed(0) + '°', originX + 25, originY - 25);

    fill(200, 50, 50);
    text('θ\'=' + tAngleBetween.toFixed(0) + '°', originX + 35, originY - 35);
  }
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);

  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let arrowSize = 8;
  push();
  translate(x2, y2);
  rotate(angle);
  fill(stroke());
  noStroke();
  triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
  pop();
}

function drawMatrixDisplay(cosT, sinT, reflectFactor) {
  let matrixX = canvasWidth - 140;
  let matrixY = 50;

  // Background
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(matrixX - 10, matrixY - 10, 130, 110, 8);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text(isReflection ? 'Reflection Matrix' : 'Rotation Matrix', matrixX + 55, matrixY - 5);

  // Matrix notation
  textSize(14);
  text('Q =', matrixX + 10, matrixY + 25);

  // Matrix brackets
  stroke(0);
  strokeWeight(2);
  // Left bracket
  line(matrixX + 30, matrixY + 20, matrixX + 30, matrixY + 80);
  line(matrixX + 30, matrixY + 20, matrixX + 35, matrixY + 20);
  line(matrixX + 30, matrixY + 80, matrixX + 35, matrixY + 80);
  // Right bracket
  line(matrixX + 115, matrixY + 20, matrixX + 115, matrixY + 80);
  line(matrixX + 115, matrixY + 20, matrixX + 110, matrixY + 20);
  line(matrixX + 115, matrixY + 80, matrixX + 110, matrixY + 80);

  // Matrix entries
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(12);

  // Format values
  let a11 = cosT.toFixed(2);
  let a12 = (-sinT * reflectFactor).toFixed(2);
  let a21 = sinT.toFixed(2);
  let a22 = (cosT * reflectFactor).toFixed(2);

  text(a11, matrixX + 55, matrixY + 35);
  text(a12, matrixX + 95, matrixY + 35);
  text(a21, matrixX + 55, matrixY + 65);
  text(a22, matrixX + 95, matrixY + 65);

  // Property note
  textSize(10);
  fill('gray');
  textAlign(CENTER, TOP);
  text('Q^T Q = I', matrixX + 55, matrixY + 90);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  angleSlider.size(canvasWidth - sliderLeftMargin - margin - 150);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
