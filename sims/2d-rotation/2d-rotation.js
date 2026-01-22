// 2D Rotation Matrix Visualizer
// Shows how rotation matrices transform vectors and shapes
// Demonstrates relationship between angle and matrix entries (cos/sin)
// MicroSim template version 2026.02
/// 

// Canvas dimensions
let containerWidth;
let canvasWidth = 600;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Rotation parameters
let angle = 45;
let angleSlider;
let shapeSelect;
let showCircleCheckbox;
let showArcCheckbox;
let animateButton;
let isAnimating = false;
let animationSpeed = 2;

// Drawing scale
let scale = 80;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1 controls: Angle slider
  angleSlider = createSlider(-360, 360, 45, 1);
  angleSlider.position(sliderLeftMargin, drawHeight + 5);
  angleSlider.size(canvasWidth - sliderLeftMargin - 180);

  animateButton = createButton('Animate');
  animateButton.position(canvasWidth - 170, drawHeight + 5);
  animateButton.mousePressed(toggleAnimation);

  // Row 2 controls: Shape selector and checkboxes
  shapeSelect = createSelect();
  shapeSelect.position(10, drawHeight + 40);
  shapeSelect.option('F-Shape', 'f');
  shapeSelect.option('Arrow', 'arrow');
  shapeSelect.option('Square', 'square');
  shapeSelect.option('Triangle', 'triangle');

  showCircleCheckbox = createCheckbox('Unit Circle', true);
  showCircleCheckbox.position(120, drawHeight + 40);
  showCircleCheckbox.style('font-size', '14px');

  showArcCheckbox = createCheckbox('Show Arc', true);
  showArcCheckbox.position(230, drawHeight + 40);
  showArcCheckbox.style('font-size', '14px');

  describe('2D rotation matrix visualizer showing how shapes rotate and matrix values update with angle', LABEL);
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

  // Handle animation
  if (isAnimating) {
    angle = (angle + animationSpeed) % 360;
    angleSlider.value(angle);
  } else {
    angle = angleSlider.value();
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('2D Rotation Matrix Visualizer', canvasWidth * 0.35, 8);

  // Main visualization area (left side)
  let mainCenterX = canvasWidth * 0.35;
  let mainCenterY = drawHeight / 2 + 15;

  push();
  translate(mainCenterX, mainCenterY);

  // Draw unit circle
  if (showCircleCheckbox.checked()) {
    stroke(200);
    strokeWeight(1);
    noFill();
    ellipse(0, 0, scale * 2, scale * 2);
  }

  // Draw axes
  stroke(150);
  strokeWeight(1);
  line(-scale * 2, 0, scale * 2, 0);
  line(0, -scale * 2, 0, scale * 2);

  // Draw angle arc
  if (showArcCheckbox.checked() && abs(angle) > 0) {
    let angleRad = radians(angle);
    stroke(100, 200, 100);
    strokeWeight(2);
    noFill();
    if (angle > 0) {
      arc(0, 0, scale * 0.6, scale * 0.6, -angleRad, 0);
    } else {
      arc(0, 0, scale * 0.6, scale * 0.6, 0, -angleRad);
    }

    // Angle label
    fill(100, 200, 100);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    let labelAngle = -angleRad / 2;
    text(nf(angle, 1, 0) + '°', cos(labelAngle) * scale * 0.45, sin(labelAngle) * scale * 0.45);
  }

  // Draw original shape (blue)
  drawShape(shapeSelect.value(), color(50, 50, 220, 150), 0);

  // Draw rotated shape (red)
  drawShape(shapeSelect.value(), color(220, 50, 50, 200), radians(angle));

  // Draw basis vectors
  drawBasisVectors(radians(angle));

  pop();

  // Draw matrix panel (right side)
  drawMatrixPanel();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Angle θ: ' + nf(angle, 1, 0) + '°', 10, drawHeight + 15);
}

function drawShape(shapeType, col, rotation) {
  push();
  rotate(-rotation); // Negative because canvas y is flipped

  stroke(col);
  strokeWeight(2);
  fill(red(col), green(col), blue(col), 80);

  switch(shapeType) {
    case 'f':
      // F-shape to show orientation clearly
      noFill();
      beginShape();
      vertex(0, scale * 0.8);
      vertex(0, -scale * 0.8);
      vertex(scale * 0.5, -scale * 0.8);
      endShape();
      beginShape();
      vertex(0, 0);
      vertex(scale * 0.35, 0);
      endShape();
      break;

    case 'arrow':
      // Arrow pointing right
      line(0, 0, scale, 0);
      triangle(scale, 0, scale - 15, -8, scale - 15, 8);
      break;

    case 'square':
      // Square centered at origin
      rectMode(CENTER);
      rect(0, 0, scale, scale);
      break;

    case 'triangle':
      // Equilateral triangle
      let r = scale * 0.6;
      triangle(
        r * cos(0), -r * sin(0),
        r * cos(TWO_PI/3), -r * sin(TWO_PI/3),
        r * cos(2*TWO_PI/3), -r * sin(2*TWO_PI/3)
      );
      break;
  }
  pop();
}

function drawBasisVectors(rotation) {
  // Original basis vectors (faded)
  stroke(200, 100, 100, 100);
  strokeWeight(1);
  line(0, 0, scale, 0);
  stroke(100, 100, 200, 100);
  line(0, 0, 0, -scale);

  // Rotated basis vectors
  let cosA = cos(rotation);
  let sinA = sin(rotation);

  // Rotated e₁
  stroke(220, 50, 50);
  strokeWeight(2);
  let e1x = scale * cosA;
  let e1y = -scale * sinA;
  line(0, 0, e1x, e1y);

  // Arrowhead for e₁
  push();
  translate(e1x, e1y);
  rotate(-rotation);
  fill(220, 50, 50);
  noStroke();
  triangle(0, 0, -10, -5, -10, 5);
  pop();

  // Rotated e₂
  stroke(50, 50, 220);
  let e2x = -scale * sinA;
  let e2y = -scale * cosA;
  line(0, 0, e2x, e2y);

  // Arrowhead for e₂
  push();
  translate(e2x, e2y);
  rotate(-rotation - HALF_PI);
  fill(50, 50, 220);
  noStroke();
  triangle(0, 0, -10, -5, -10, 5);
  pop();

  // Labels
  fill(220, 50, 50);
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text("e₁'", e1x + 8, e1y);

  fill(50, 50, 220);
  text("e₂'", e2x + 8, e2y);
}

function drawMatrixPanel() {
  let panelX = canvasWidth - 165;
  let panelY = 50;
  let panelWidth = 155;
  let panelHeight = 180;

  // Panel background
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelWidth, panelHeight, 10);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Rotation Matrix', panelX + panelWidth/2, panelY + 10);

  // Formula
  textSize(12);
  text('R(θ) =', panelX + panelWidth/2, panelY + 35);

  // Matrix bracket and values
  let mx = panelX + 25;
  let my = panelY + 60;

  textAlign(CENTER, CENTER);
  textSize(14);

  // Left bracket
  text('[', mx, my + 20);

  // Calculate cos and sin
  let angleRad = radians(angle);
  let cosVal = cos(angleRad);
  let sinVal = sin(angleRad);

  // Matrix entries
  fill(220, 50, 50);
  text(nf(cosVal, 1, 3), mx + 35, my + 10);
  fill(50, 50, 220);
  text(nf(-sinVal, 1, 3), mx + 90, my + 10);
  fill(50, 50, 220);
  text(nf(sinVal, 1, 3), mx + 35, my + 35);
  fill(220, 50, 50);
  text(nf(cosVal, 1, 3), mx + 90, my + 35);

  // Right bracket
  fill('black');
  text(']', mx + 120, my + 20);

  // Show cos(θ) and sin(θ) values
  textAlign(LEFT, TOP);
  textSize(12);
  fill('black');
  text('cos(' + nf(angle, 1, 0) + '°) = ' + nf(cosVal, 1, 4), panelX + 10, panelY + 110);
  text('sin(' + nf(angle, 1, 0) + '°) = ' + nf(sinVal, 1, 4), panelX + 10, panelY + 130);

  // Properties
  textSize(11);
  fill(100);
  text('det(R) = 1', panelX + 10, panelY + 155);
  text('R⁻¹ = Rᵀ', panelX + 80, panelY + 155);
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Stop' : 'Animate');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  angleSlider.size(canvasWidth - sliderLeftMargin - 180);
  animateButton.position(canvasWidth - 170, drawHeight + 5);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
