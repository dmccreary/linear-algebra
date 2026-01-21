// Orthogonal Projection Interactive Visualizer
// Shows how vectors project onto lines with perpendicular error
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 600;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Vector and projection parameters
let vecX = 3;
let vecY = 2;
let lineAngle = 30;

// Controls
let angleSlider;
let showErrorCheckbox;
let showRightAngleCheckbox;
let showFormulaCheckbox;
let animateButton;

// Animation state
let isAnimating = false;
let animPhase = 0;

// Dragging state
let draggingVector = false;
let dragThreshold = 15;

// Drawing scale
let scale = 45;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Line angle slider
  angleSlider = createSlider(-90, 90, 30, 1);
  angleSlider.position(sliderLeftMargin, drawHeight + 5);
  angleSlider.size(canvasWidth - sliderLeftMargin - 120);

  animateButton = createButton('Animate');
  animateButton.position(canvasWidth - 100, drawHeight + 5);
  animateButton.mousePressed(toggleAnimation);

  // Row 2: Checkboxes
  showErrorCheckbox = createCheckbox('Error Vector', true);
  showErrorCheckbox.position(10, drawHeight + 40);
  showErrorCheckbox.style('font-size', '14px');

  showRightAngleCheckbox = createCheckbox('Right Angle', true);
  showRightAngleCheckbox.position(130, drawHeight + 40);
  showRightAngleCheckbox.style('font-size', '14px');

  showFormulaCheckbox = createCheckbox('Formula', true);
  showFormulaCheckbox.position(250, drawHeight + 40);
  showFormulaCheckbox.style('font-size', '14px');

  describe('Orthogonal projection visualizer showing vector projection onto a line with perpendicular error component', LABEL);
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

  // Get current angle
  lineAngle = angleSlider.value();

  // Handle animation
  if (isAnimating) {
    animPhase = (animPhase + 0.02) % 1;
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Orthogonal Projection Visualizer', canvasWidth * 0.4, 8);

  // Main visualization
  let centerX = canvasWidth * 0.4;
  let centerY = drawHeight / 2 + 10;

  push();
  translate(centerX, centerY);

  // Draw coordinate axes
  stroke(180);
  strokeWeight(1);
  line(-scale * 5, 0, scale * 5, 0);
  line(0, -scale * 4, 0, scale * 4);

  // Axis labels
  fill(150);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('x', scale * 5 - 10, 5);
  textAlign(RIGHT, CENTER);
  text('y', -5, -scale * 4 + 10);

  // Calculate projection
  let angleRad = radians(lineAngle);
  let u = { x: cos(angleRad), y: sin(angleRad) };  // Unit direction
  let v = { x: vecX, y: vecY };

  // proj_u(v) = (v·u / u·u) * u = (v·u) * u (since |u|=1)
  let dotVU = v.x * u.x + v.y * u.y;
  let projV = { x: dotVU * u.x, y: dotVU * u.y };
  let errorV = { x: v.x - projV.x, y: v.y - projV.y };

  // Draw projection line (extended)
  stroke(150);
  strokeWeight(2);
  let lineLen = scale * 6;
  line(-lineLen * u.x, lineLen * u.y, lineLen * u.x, -lineLen * u.y);

  // Draw direction label
  fill(100);
  noStroke();
  textSize(11);
  textAlign(LEFT, CENTER);
  let labelDist = scale * 4.5;
  text('Projection line', u.x * labelDist + 5, -u.y * labelDist);

  // Animation: interpolate vector position
  let displayV = v;
  if (isAnimating) {
    // Animate from original to projected position
    let t = (sin(animPhase * TWO_PI - HALF_PI) + 1) / 2;  // Smooth oscillation
    displayV = {
      x: lerp(v.x, projV.x, t),
      y: lerp(v.y, projV.y, t)
    };
  }

  // Draw original vector v (blue)
  drawArrow(0, 0, v.x * scale, -v.y * scale, color(50, 50, 220), 3);
  fill(50, 50, 220);
  noStroke();
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text('v', v.x * scale + 8, -v.y * scale - 5);

  // Draw drag handle on v
  fill(150, 150, 255);
  stroke(50, 50, 220);
  strokeWeight(2);
  ellipse(v.x * scale, -v.y * scale, 14, 14);

  // Draw projected vector (red)
  drawArrow(0, 0, projV.x * scale, -projV.y * scale, color(220, 50, 50), 3);
  fill(220, 50, 50);
  noStroke();
  textSize(14);
  text('proj(v)', projV.x * scale + 8, -projV.y * scale + 15);

  // Draw error vector (green dashed) if enabled
  if (showErrorCheckbox.checked()) {
    // Draw from projection to original vector
    drawDashedArrow(projV.x * scale, -projV.y * scale,
                    v.x * scale, -v.y * scale,
                    color(50, 180, 50), 2);
    fill(50, 180, 50);
    noStroke();
    textSize(12);
    let midX = (projV.x + v.x) / 2 * scale;
    let midY = -(projV.y + v.y) / 2 * scale;
    text('error', midX + 10, midY);
  }

  // Draw right angle indicator if enabled
  if (showRightAngleCheckbox.checked()) {
    let rightAngleSize = 12;
    stroke(50, 180, 50);
    strokeWeight(1);
    noFill();

    // Calculate perpendicular direction
    let perpX = -u.y;  // Perpendicular to line direction
    let perpY = u.x;

    // Position the right angle at the projection point
    let px = projV.x * scale;
    let py = -projV.y * scale;

    // Draw the small square
    beginShape();
    vertex(px, py);
    vertex(px + perpX * rightAngleSize, py - perpY * rightAngleSize);
    vertex(px + perpX * rightAngleSize + u.x * rightAngleSize,
           py - perpY * rightAngleSize + u.y * rightAngleSize);
    vertex(px + u.x * rightAngleSize, py + u.y * rightAngleSize);
    endShape();
  }

  // Draw unit direction vector u
  stroke(100);
  strokeWeight(1);
  drawArrow(0, 0, u.x * scale, -u.y * scale, color(100, 100, 100), 1);
  fill(100);
  noStroke();
  textSize(11);
  text('û', u.x * scale + 5, -u.y * scale - 10);

  pop();

  // Draw formula panel if enabled
  if (showFormulaCheckbox.checked()) {
    drawFormulaPanel(v, u, projV, dotVU);
  }

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Line angle: ' + nf(lineAngle, 1, 0) + '°', 10, drawHeight + 15);
}

function drawArrow(x1, y1, x2, y2, col, weight) {
  stroke(col);
  strokeWeight(weight);
  line(x1, y1, x2, y2);

  // Arrowhead
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

function drawDashedArrow(x1, y1, x2, y2, col, weight) {
  stroke(col);
  strokeWeight(weight);

  let steps = 8;
  for (let i = 0; i < steps; i += 2) {
    let t1 = i / steps;
    let t2 = (i + 1) / steps;
    line(lerp(x1, x2, t1), lerp(y1, y2, t1),
         lerp(x1, x2, t2), lerp(y1, y2, t2));
  }

  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let arrowSize = 8;

  push();
  translate(x2, y2);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -arrowSize, -arrowSize/2.5, -arrowSize, arrowSize/2.5);
  pop();
}

function drawFormulaPanel(v, u, proj, dotVU) {
  let px = canvasWidth - 175;
  let py = 40;

  // Background
  fill(255, 255, 255, 245);
  stroke(200);
  strokeWeight(1);
  rect(px, py, 165, 160, 8);

  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);

  let y = py + 10;
  text('Formula:', px + 10, y);

  y += 20;
  textSize(11);
  text('proj_û(v) = (v·û)û', px + 10, y);

  y += 25;
  text('Calculations:', px + 10, y);

  y += 18;
  fill(50, 50, 220);
  text('v = (' + nf(v.x, 1, 2) + ', ' + nf(v.y, 1, 2) + ')', px + 10, y);

  y += 15;
  fill(100);
  text('û = (' + nf(u.x, 1, 2) + ', ' + nf(u.y, 1, 2) + ')', px + 10, y);

  y += 15;
  fill('black');
  text('v·û = ' + nf(dotVU, 1, 3), px + 10, y);

  y += 20;
  fill(220, 50, 50);
  text('proj = (' + nf(proj.x, 1, 2) + ', ' + nf(proj.y, 1, 2) + ')', px + 10, y);

  y += 18;
  fill(50, 180, 50);
  let errMag = sqrt(pow(v.x - proj.x, 2) + pow(v.y - proj.y, 2));
  text('|error| = ' + nf(errMag, 1, 3), px + 10, y);
}

function mousePressed() {
  let centerX = canvasWidth * 0.4;
  let centerY = drawHeight / 2 + 10;

  // Check if clicking on vector handle
  let handleX = centerX + vecX * scale;
  let handleY = centerY - vecY * scale;

  if (dist(mouseX, mouseY, handleX, handleY) < dragThreshold) {
    draggingVector = true;
  }
}

function mouseDragged() {
  if (draggingVector) {
    let centerX = canvasWidth * 0.4;
    let centerY = drawHeight / 2 + 10;

    // Convert mouse to vector coordinates
    vecX = (mouseX - centerX) / scale;
    vecY = -(mouseY - centerY) / scale;

    // Clamp to reasonable range
    vecX = constrain(vecX, -4, 4);
    vecY = constrain(vecY, -3, 3);

    // Snap to grid (0.5 increments)
    vecX = round(vecX * 2) / 2;
    vecY = round(vecY * 2) / 2;
  }
}

function mouseReleased() {
  draggingVector = false;
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Stop' : 'Animate');
  if (!isAnimating) animPhase = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  angleSlider.size(canvasWidth - sliderLeftMargin - 120);
  animateButton.position(canvasWidth - 100, drawHeight + 5);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
