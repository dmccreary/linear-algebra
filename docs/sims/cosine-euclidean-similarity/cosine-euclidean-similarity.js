// Cosine vs Euclidean Similarity Visualizer
// Compare how these two similarity measures behave differently
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Vector endpoints (draggable)
let vectorA = { x: 100, y: -50 };
let vectorB = { x: 60, y: -120 };

// UI state
let draggingVector = null;
let scale = 1.5;
let origin;

// UI elements
let normalizeCheckbox;
let presetSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  origin = { x: canvasWidth / 2, y: drawHeight / 2 + 50 };

  // Normalize checkbox
  normalizeCheckbox = createCheckbox(' Normalize Vectors', false);
  normalizeCheckbox.position(10, drawHeight + 5);
  normalizeCheckbox.style('font-size', '14px');
  normalizeCheckbox.changed(updateDisplay);

  // Preset examples dropdown
  presetSelect = createSelect();
  presetSelect.position(10, drawHeight + 35);
  presetSelect.option('Custom');
  presetSelect.option('Same direction, different magnitude');
  presetSelect.option('Orthogonal vectors');
  presetSelect.option('Similar angle');
  presetSelect.option('Opposite directions');
  presetSelect.changed(loadPreset);

  describe('Interactive comparison of cosine similarity and Euclidean distance between two vectors', LABEL);
}

function loadPreset() {
  let preset = presetSelect.value();

  switch (preset) {
    case 'Same direction, different magnitude':
      vectorA = { x: 50, y: -50 };
      vectorB = { x: 120, y: -120 };
      break;
    case 'Orthogonal vectors':
      vectorA = { x: 80, y: 0 };
      vectorB = { x: 0, y: -80 };
      break;
    case 'Similar angle':
      vectorA = { x: 80, y: -60 };
      vectorB = { x: 90, y: -50 };
      break;
    case 'Opposite directions':
      vectorA = { x: 80, y: -60 };
      vectorB = { x: -80, y: 60 };
      break;
  }
}

function draw() {
  updateCanvasSize();

  // Update origin based on canvas width
  origin = { x: canvasWidth / 2, y: drawHeight / 2 + 50 };

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Cosine vs Euclidean Similarity', canvasWidth / 2, 10);

  // Draw coordinate system
  push();
  translate(origin.x, origin.y);

  // Grid
  stroke(230);
  strokeWeight(0.5);
  for (let i = -200; i <= 200; i += 50) {
    line(i, -200, i, 100);
    line(-200, i, 200, i);
  }

  // Axes
  stroke(150);
  strokeWeight(1);
  drawArrow(0, 0, 180, 0, 6);
  drawArrow(0, 0, 0, -180, 6);

  // Axis labels
  fill(100);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  text('x', 170, 10);
  textAlign(RIGHT, CENTER);
  text('y', -10, -170);

  // Get vectors (possibly normalized)
  let vA = { ...vectorA };
  let vB = { ...vectorB };

  if (normalizeCheckbox.checked()) {
    let magA = sqrt(vA.x * vA.x + vA.y * vA.y);
    let magB = sqrt(vB.x * vB.x + vB.y * vB.y);
    if (magA > 0) {
      vA.x = (vA.x / magA) * 80;
      vA.y = (vA.y / magA) * 80;
    }
    if (magB > 0) {
      vB.x = (vB.x / magB) * 80;
      vB.y = (vB.y / magB) * 80;
    }
  }

  // Draw angle arc
  let angleA = atan2(-vA.y, vA.x);
  let angleB = atan2(-vB.y, vB.x);
  noFill();
  stroke(100, 200, 100, 150);
  strokeWeight(2);
  arc(0, 0, 60, 60, min(angleA, angleB), max(angleA, angleB));

  // Draw distance line between endpoints
  stroke(200, 100, 100, 150);
  strokeWeight(2);
  setLineDash([5, 5]);
  line(vA.x, vA.y, vB.x, vB.y);
  setLineDash([]);

  // Draw vectors
  stroke(220, 50, 50);
  strokeWeight(3);
  drawArrow(0, 0, vA.x, vA.y, 10);

  stroke(50, 50, 220);
  strokeWeight(3);
  drawArrow(0, 0, vB.x, vB.y, 10);

  // Draw draggable points
  fill(220, 50, 50);
  stroke(0);
  strokeWeight(1);
  ellipse(vectorA.x, vectorA.y, 16, 16);

  fill(50, 50, 220);
  ellipse(vectorB.x, vectorB.y, 16, 16);

  // Labels
  fill(220, 50, 50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('A', vectorA.x + 12, vectorA.y);

  fill(50, 50, 220);
  text('B', vectorB.x + 12, vectorB.y);

  pop();

  // Calculate similarities
  let dotProduct = vA.x * vB.x + vA.y * vB.y;
  let magA = sqrt(vA.x * vA.x + vA.y * vA.y);
  let magB = sqrt(vB.x * vB.x + vB.y * vB.y);

  let cosineSim = (magA > 0 && magB > 0) ? dotProduct / (magA * magB) : 0;
  let euclideanDist = sqrt(pow(vA.x - vB.x, 2) + pow(vA.y - vB.y, 2));
  let angle = acos(constrain(cosineSim, -1, 1)) * 180 / PI;

  // Info panel
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(canvasWidth - 190, 40, 180, 140, 10);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  let infoX = canvasWidth - 180;
  let infoY = 50;

  text('Cosine Similarity:', infoX, infoY);
  fill(100, 200, 100);
  textSize(16);
  text(cosineSim.toFixed(4), infoX, infoY + 18);

  fill(0);
  textSize(13);
  text('Euclidean Distance:', infoX, infoY + 45);
  fill(200, 100, 100);
  textSize(16);
  text(euclideanDist.toFixed(2), infoX, infoY + 63);

  fill(0);
  textSize(13);
  text('Angle (degrees):', infoX, infoY + 90);
  textSize(16);
  text(angle.toFixed(1) + '°', infoX, infoY + 108);

  // Legend
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text('Drag vector endpoints to explore', 15, 40);

  fill(100, 200, 100);
  ellipse(22, 65, 10, 10);
  fill(0);
  text('Angle (cosine)', 35, 58);

  fill(200, 100, 100);
  setLineDash([3, 3]);
  stroke(200, 100, 100);
  line(17, 82, 27, 82);
  setLineDash([]);
  noStroke();
  fill(0);
  text('Distance (Euclidean)', 35, 75);

  // Formula display
  fill(50);
  textSize(11);
  textAlign(LEFT, TOP);
  text('cos(θ) = (A·B)/(|A||B|)', 15, drawHeight + 70);
  text('d = √((Ax-Bx)² + (Ay-By)²)', 15, drawHeight + 85);
}

function drawArrow(x1, y1, x2, y2, arrowSize) {
  line(x1, y1, x2, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(angle);
  fill(red(stroke()), green(stroke()), blue(stroke()));
  noStroke();
  triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
  pop();
}

function setLineDash(pattern) {
  drawingContext.setLineDash(pattern);
}

function mousePressed() {
  let mx = mouseX - origin.x;
  let my = mouseY - origin.y;

  if (mouseY < drawHeight) {
    if (dist(mx, my, vectorA.x, vectorA.y) < 15) {
      draggingVector = 'A';
    } else if (dist(mx, my, vectorB.x, vectorB.y) < 15) {
      draggingVector = 'B';
    }
  }
}

function mouseDragged() {
  if (draggingVector && mouseY < drawHeight) {
    let mx = mouseX - origin.x;
    let my = mouseY - origin.y;

    // Constrain to reasonable bounds
    mx = constrain(mx, -150, 150);
    my = constrain(my, -150, 100);

    if (draggingVector === 'A') {
      vectorA.x = mx;
      vectorA.y = my;
    } else {
      vectorB.x = mx;
      vectorB.y = my;
    }

    presetSelect.value('Custom');
  }
}

function mouseReleased() {
  draggingVector = null;
}

function updateDisplay() {
  // Triggered when normalize checkbox changes
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
