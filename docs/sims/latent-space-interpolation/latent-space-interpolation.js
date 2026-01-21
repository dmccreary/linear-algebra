// Latent Space Interpolation Visualizer
// Demonstrates interpolation between points in latent space
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Latent space samples (represented as simple shapes for visualization)
let samples = [];
let numSamples = 8;

// Selected points for interpolation
let pointA = null;
let pointB = null;
let selectionMode = 'A';  // 'A', 'B', or 'none'

// Interpolation
let interpT = 0.5;
let interpMethod = 'linear';  // 'linear' or 'slerp'
let numInterpSteps = 5;

// UI elements
let tSlider;
let stepsSlider;
let methodSelect;

// Shape types for samples
let shapeTypes = ['circle', 'square', 'triangle', 'star', 'pentagon', 'hexagon', 'diamond', 'cross'];
let shapeColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  generateSamples();

  // T slider for interpolation
  tSlider = createSlider(0, 1, 0.5, 0.01);
  tSlider.position(sliderLeftMargin, drawHeight + 8);
  tSlider.size(canvasWidth - sliderLeftMargin - margin);
  tSlider.input(() => interpT = tSlider.value());

  // Number of steps slider
  stepsSlider = createSlider(3, 10, 5, 1);
  stepsSlider.position(sliderLeftMargin, drawHeight + 38);
  stepsSlider.size(canvasWidth - sliderLeftMargin - margin);
  stepsSlider.input(() => numInterpSteps = stepsSlider.value());

  // Method selector
  methodSelect = createSelect();
  methodSelect.position(10, drawHeight + 55);
  methodSelect.option('Linear');
  methodSelect.option('Spherical (SLERP)');
  methodSelect.changed(() => {
    interpMethod = methodSelect.value() === 'Linear' ? 'linear' : 'slerp';
  });

  describe('Latent space interpolation visualization showing smooth transitions between generated samples', LABEL);
}

function generateSamples() {
  samples = [];

  // Generate samples in a circular pattern
  let centerX = 150;
  let centerY = 180;
  let radius = 100;

  for (let i = 0; i < numSamples; i++) {
    let angle = (i / numSamples) * TWO_PI - PI / 2;
    let x = centerX + cos(angle) * radius + random(-20, 20);
    let y = centerY + sin(angle) * radius + random(-20, 20);

    samples.push({
      x: x,
      y: y,
      type: shapeTypes[i % shapeTypes.length],
      color: shapeColors[i % shapeColors.length],
      // Latent vector (2D for visualization)
      z: [x / 100 - 1.5, y / 100 - 1.8]
    });
  }

  // Set default selection
  pointA = samples[0];
  pointB = samples[4];
}

function draw() {
  updateCanvasSize();

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
  textSize(18);
  text('Latent Space Interpolation', canvasWidth / 2, 8);

  interpT = tSlider.value();
  numInterpSteps = stepsSlider.value();

  drawLatentSpace();
  drawInterpolationPath();
  drawInterpolatedSamples();
  drawInfoPanel();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('t = ' + interpT.toFixed(2), 10, drawHeight + 18);
  text('Steps: ' + numInterpSteps, 10, drawHeight + 48);
}

function drawLatentSpace() {
  let spaceX = 30;
  let spaceY = 50;
  let spaceW = 240;
  let spaceH = 240;

  // Latent space background
  fill(255, 255, 255, 200);
  stroke(150);
  strokeWeight(1);
  rect(spaceX, spaceY, spaceW, spaceH, 10);

  // Grid
  stroke(230);
  strokeWeight(0.5);
  for (let i = 0; i <= 4; i++) {
    let x = spaceX + (i / 4) * spaceW;
    let y = spaceY + (i / 4) * spaceH;
    line(x, spaceY, x, spaceY + spaceH);
    line(spaceX, y, spaceX + spaceW, y);
  }

  // Label
  fill(100);
  noStroke();
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text('Latent Space (2D projection)', spaceX + spaceW / 2, spaceY - 5);

  // Draw samples
  for (let sample of samples) {
    let isSelected = sample === pointA || sample === pointB;
    let isA = sample === pointA;
    let isB = sample === pointB;

    // Offset to fit in space
    let drawX = spaceX + 20 + sample.x;
    let drawY = spaceY + 20 + sample.y;

    // Selection highlight
    if (isSelected) {
      noFill();
      stroke(isA ? '#e74c3c' : '#3498db');
      strokeWeight(3);
      ellipse(drawX, drawY, 35, 35);
    }

    // Draw shape
    drawShape(drawX, drawY, 25, sample.type, sample.color);

    // Label
    if (isSelected) {
      fill(isA ? '#e74c3c' : '#3498db');
      noStroke();
      textSize(12);
      textAlign(CENTER, CENTER);
      text(isA ? 'A' : 'B', drawX, drawY - 22);
    }
  }

  // Instructions
  fill(80);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Click shapes to select A and B', spaceX + spaceW / 2, spaceY + spaceH + 5);
}

function drawInterpolationPath() {
  if (!pointA || !pointB) return;

  let spaceX = 30;
  let spaceY = 50;

  let ax = spaceX + 20 + pointA.x;
  let ay = spaceY + 20 + pointA.y;
  let bx = spaceX + 20 + pointB.x;
  let by = spaceY + 20 + pointB.y;

  // Draw path based on method
  if (interpMethod === 'linear') {
    // Straight line
    stroke(150, 100, 200, 150);
    strokeWeight(2);
    line(ax, ay, bx, by);
  } else {
    // Curved path for slerp (arc)
    stroke(150, 100, 200, 150);
    strokeWeight(2);
    noFill();
    let cx = (ax + bx) / 2;
    let cy = (ay + by) / 2;
    let bulge = 30;

    beginShape();
    for (let t = 0; t <= 1; t += 0.05) {
      let x = lerp(ax, bx, t);
      let y = lerp(ay, by, t);
      // Add arc bulge
      let perpX = -(by - ay);
      let perpY = bx - ax;
      let perpLen = sqrt(perpX * perpX + perpY * perpY);
      perpX /= perpLen;
      perpY /= perpLen;
      let bulgeFactor = sin(t * PI) * bulge;
      vertex(x + perpX * bulgeFactor, y + perpY * bulgeFactor);
    }
    endShape();
  }

  // Draw interpolation points along path
  for (let i = 0; i <= numInterpSteps; i++) {
    let t = i / numInterpSteps;
    let pos = getInterpolatedPosition(ax, ay, bx, by, t);

    fill(255);
    stroke(100);
    strokeWeight(1);
    ellipse(pos.x, pos.y, 8, 8);
  }

  // Current t position
  let currentPos = getInterpolatedPosition(ax, ay, bx, by, interpT);
  fill(255, 200, 0);
  stroke(0);
  strokeWeight(2);
  ellipse(currentPos.x, currentPos.y, 15, 15);
}

function getInterpolatedPosition(ax, ay, bx, by, t) {
  if (interpMethod === 'linear') {
    return {
      x: lerp(ax, bx, t),
      y: lerp(ay, by, t)
    };
  } else {
    // Slerp approximation with arc
    let x = lerp(ax, bx, t);
    let y = lerp(ay, by, t);
    let perpX = -(by - ay);
    let perpY = bx - ax;
    let perpLen = sqrt(perpX * perpX + perpY * perpY);
    perpX /= perpLen;
    perpY /= perpLen;
    let bulgeFactor = sin(t * PI) * 30;
    return {
      x: x + perpX * bulgeFactor,
      y: y + perpY * bulgeFactor
    };
  }
}

function drawInterpolatedSamples() {
  if (!pointA || !pointB) return;

  let startX = 290;
  let startY = 60;
  let sampleSize = 40;
  let spacing = 50;

  fill(0);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Generated Samples', startX + 50, startY - 15);

  // Draw interpolated samples
  for (let i = 0; i <= numInterpSteps; i++) {
    let t = i / numInterpSteps;
    let y = startY + i * spacing;

    // Interpolate shape properties
    let interpColor = lerpColor(color(pointA.color), color(pointB.color), t);

    // Draw sample
    drawInterpolatedShape(startX + 50, y + 20, sampleSize,
                          pointA.type, pointB.type, t, interpColor);

    // t label
    fill(100);
    noStroke();
    textSize(9);
    textAlign(LEFT, CENTER);
    text('t=' + t.toFixed(1), startX + 90, y + 20);
  }

  // Highlight current t
  let currentY = startY + interpT * numInterpSteps * spacing;
  noFill();
  stroke(255, 200, 0);
  strokeWeight(2);
  rect(startX + 25, currentY + 3, 60, 38, 5);
}

function drawInterpolatedShape(x, y, size, typeA, typeB, t, col) {
  // Morph between shapes using size interpolation
  push();
  translate(x, y);

  fill(col);
  stroke(0);
  strokeWeight(1);

  // Simple shape morphing: blend sizes
  let sizeA = size * (1 - t);
  let sizeB = size * t;

  // Draw both shapes with varying opacity/size
  if (t < 0.5) {
    drawShapeAtOrigin(sizeA + sizeB * 0.5, typeA);
  } else {
    drawShapeAtOrigin(sizeA * 0.5 + sizeB, typeB);
  }

  pop();
}

function drawShape(x, y, size, type, col) {
  push();
  translate(x, y);
  fill(col);
  stroke(0);
  strokeWeight(1);
  drawShapeAtOrigin(size, type);
  pop();
}

function drawShapeAtOrigin(size, type) {
  let r = size / 2;

  switch (type) {
    case 'circle':
      ellipse(0, 0, size, size);
      break;
    case 'square':
      rectMode(CENTER);
      rect(0, 0, size * 0.8, size * 0.8);
      break;
    case 'triangle':
      triangle(0, -r, -r * 0.866, r * 0.5, r * 0.866, r * 0.5);
      break;
    case 'star':
      drawStar(0, 0, r * 0.4, r, 5);
      break;
    case 'pentagon':
      drawPolygon(0, 0, r, 5);
      break;
    case 'hexagon':
      drawPolygon(0, 0, r, 6);
      break;
    case 'diamond':
      quad(0, -r, r * 0.6, 0, 0, r, -r * 0.6, 0);
      break;
    case 'cross':
      let w = r * 0.3;
      beginShape();
      vertex(-w, -r); vertex(w, -r); vertex(w, -w);
      vertex(r, -w); vertex(r, w); vertex(w, w);
      vertex(w, r); vertex(-w, r); vertex(-w, w);
      vertex(-r, w); vertex(-r, -w); vertex(-w, -w);
      endShape(CLOSE);
      break;
  }
}

function drawStar(cx, cy, innerR, outerR, points) {
  beginShape();
  for (let i = 0; i < points * 2; i++) {
    let angle = (i * PI / points) - PI / 2;
    let r = (i % 2 === 0) ? outerR : innerR;
    vertex(cx + cos(angle) * r, cy + sin(angle) * r);
  }
  endShape(CLOSE);
}

function drawPolygon(cx, cy, r, sides) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    let angle = (i * TWO_PI / sides) - PI / 2;
    vertex(cx + cos(angle) * r, cy + sin(angle) * r);
  }
  endShape(CLOSE);
}

function drawInfoPanel() {
  if (!pointA || !pointB) return;

  let panelX = 280;
  let panelY = drawHeight - 90;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, 110, 80, 8);

  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);

  let x = panelX + 8;
  let y = panelY + 8;

  text('Method:', x, y);
  text(interpMethod === 'linear' ? 'Linear' : 'Spherical', x + 50, y);

  y += 15;
  text('Formula:', x, y);
  y += 12;

  textSize(9);
  if (interpMethod === 'linear') {
    text('z(t) = (1-t)z₁ + tz₂', x, y);
  } else {
    text('z(t) = slerp(z₁, z₂, t)', x, y);
  }

  y += 15;
  textSize(10);
  text('t = ' + interpT.toFixed(2), x, y);
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  let spaceX = 30;
  let spaceY = 50;

  // Check if clicking on a sample
  for (let sample of samples) {
    let drawX = spaceX + 20 + sample.x;
    let drawY = spaceY + 20 + sample.y;

    if (dist(mouseX, mouseY, drawX, drawY) < 20) {
      if (selectionMode === 'A' || pointA === null) {
        pointA = sample;
        selectionMode = 'B';
      } else {
        if (sample !== pointA) {
          pointB = sample;
          selectionMode = 'A';
        }
      }
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  tSlider.size(canvasWidth - sliderLeftMargin - margin);
  stepsSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
