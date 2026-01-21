// Linear Transformation Fundamentals Visualizer
// Shows how linear transformations preserve grid structure
// and are determined by where basis vectors map
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout margins
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Split view dimensions
let viewWidth;
let viewMargin = 20;

// Transformation matrix components (columns are T(e1) and T(e2))
let te1 = { x: 1, y: 0 };  // T(e₁) - where (1,0) maps to
let te2 = { x: 0, y: 1 };  // T(e₂) - where (0,1) maps to

// Sample vector
let sampleVec = { x: 1, y: 1 };

// Animation and controls
let animSlider;
let animValue = 1.0;
let presetSelect;
let showGridCheckbox;
let showVectorCheckbox;
let resetButton;

// Dragging state
let dragging = null;
let dragThreshold = 15;

// Grid settings
let gridSize = 5;
let scale = 35;

// Presets
const presets = {
  'identity': { te1: {x:1, y:0}, te2: {x:0, y:1} },
  'rotation45': { te1: {x:0.707, y:0.707}, te2: {x:-0.707, y:0.707} },
  'scale2x': { te1: {x:2, y:0}, te2: {x:0, y:2} },
  'shearX': { te1: {x:1, y:0}, te2: {x:1, y:1} },
  'reflectY': { te1: {x:-1, y:0}, te2: {x:0, y:1} },
  'stretch': { te1: {x:2, y:0}, te2: {x:0, y:0.5} }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  viewWidth = (canvasWidth - 3 * viewMargin) / 2;

  // Row 1 controls
  resetButton = createButton('Reset');
  resetButton.position(10, drawHeight + 5);
  resetButton.mousePressed(resetTransform);

  animSlider = createSlider(0, 1, 1, 0.01);
  animSlider.position(sliderLeftMargin, drawHeight + 5);
  animSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 2 controls
  presetSelect = createSelect();
  presetSelect.position(10, drawHeight + 40);
  presetSelect.option('Identity', 'identity');
  presetSelect.option('Rotation 45°', 'rotation45');
  presetSelect.option('Scale 2×', 'scale2x');
  presetSelect.option('Shear X', 'shearX');
  presetSelect.option('Reflect Y', 'reflectY');
  presetSelect.option('Stretch', 'stretch');
  presetSelect.changed(applyPreset);

  showGridCheckbox = createCheckbox('Show Grid', true);
  showGridCheckbox.position(150, drawHeight + 40);
  showGridCheckbox.style('font-size', '14px');

  showVectorCheckbox = createCheckbox('Show Sample', true);
  showVectorCheckbox.position(260, drawHeight + 40);
  showVectorCheckbox.style('font-size', '14px');

  describe('Linear transformation visualizer showing how basis vectors determine the transformation matrix', LABEL);
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

  // Get animation value
  animValue = animSlider.value();

  // Calculate view dimensions
  viewWidth = (canvasWidth - 3 * viewMargin) / 2;

  // Draw title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Linear Transformation Visualizer', canvasWidth/2, 8);

  // Draw original space (left)
  push();
  translate(viewMargin + viewWidth/2, drawHeight/2 + 15);
  drawOriginalSpace();
  pop();

  // Draw transformed space (right)
  push();
  translate(viewMargin * 2 + viewWidth + viewWidth/2, drawHeight/2 + 15);
  drawTransformedSpace();
  pop();

  // Draw labels for each view
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Original Space', viewMargin + viewWidth/2, 32);
  text('Transformed Space', viewMargin * 2 + viewWidth + viewWidth/2, 32);

  // Draw transformation arrow
  drawArrow(viewMargin + viewWidth + 5, drawHeight/2 + 15, viewMargin * 2 + viewWidth - 5, drawHeight/2 + 15, 'gray');
  fill('gray');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('T', viewMargin + viewWidth + viewMargin/2, drawHeight/2);

  // Draw matrix display
  drawMatrixDisplay();

  // Draw control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Morph: ' + nf(animValue, 1, 2), 80, drawHeight + 15);
}

function drawOriginalSpace() {
  let showGrid = showGridCheckbox.checked();
  let showSample = showVectorCheckbox.checked();

  // Draw grid
  if (showGrid) {
    stroke(220);
    strokeWeight(1);
    for (let i = -gridSize; i <= gridSize; i++) {
      // Vertical lines
      line(i * scale, -gridSize * scale, i * scale, gridSize * scale);
      // Horizontal lines
      line(-gridSize * scale, i * scale, gridSize * scale, i * scale);
    }
  }

  // Draw axes
  stroke(150);
  strokeWeight(1);
  line(-viewWidth/2 + 10, 0, viewWidth/2 - 10, 0);
  line(0, -drawHeight/2 + 50, 0, drawHeight/2 - 30);

  // Draw basis vectors
  // e₁ (red)
  drawArrow(0, 0, scale, 0, color(220, 50, 50));
  fill(220, 50, 50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('e₁', scale + 5, -5);

  // e₂ (blue)
  drawArrow(0, 0, 0, -scale, color(50, 50, 220));
  fill(50, 50, 220);
  text('e₂', 5, -scale - 10);

  // Draw sample vector
  if (showSample) {
    let sx = sampleVec.x * scale;
    let sy = -sampleVec.y * scale;
    drawArrow(0, 0, sx, sy, color(50, 180, 50));
    fill(50, 180, 50);
    textSize(12);
    text('v', sx + 5, sy - 5);
  }
}

function drawTransformedSpace() {
  let showGrid = showGridCheckbox.checked();
  let showSample = showVectorCheckbox.checked();

  // Interpolate between identity and current transformation
  let currentTe1 = {
    x: lerp(1, te1.x, animValue),
    y: lerp(0, te1.y, animValue)
  };
  let currentTe2 = {
    x: lerp(0, te2.x, animValue),
    y: lerp(1, te2.y, animValue)
  };

  // Draw transformed grid
  if (showGrid) {
    stroke(200, 200, 220);
    strokeWeight(1);
    for (let i = -gridSize; i <= gridSize; i++) {
      // Transformed vertical lines (varying x at fixed y values)
      for (let j = -gridSize; j < gridSize; j++) {
        let p1 = transformPoint(i, j, currentTe1, currentTe2);
        let p2 = transformPoint(i, j + 1, currentTe1, currentTe2);
        line(p1.x * scale, -p1.y * scale, p2.x * scale, -p2.y * scale);
      }
      // Transformed horizontal lines
      for (let j = -gridSize; j < gridSize; j++) {
        let p1 = transformPoint(j, i, currentTe1, currentTe2);
        let p2 = transformPoint(j + 1, i, currentTe1, currentTe2);
        line(p1.x * scale, -p1.y * scale, p2.x * scale, -p2.y * scale);
      }
    }
  }

  // Draw axes (transformed)
  stroke(150);
  strokeWeight(1);
  line(-viewWidth/2 + 10, 0, viewWidth/2 - 10, 0);
  line(0, -drawHeight/2 + 50, 0, drawHeight/2 - 30);

  // Draw transformed basis vectors
  // T(e₁) (red) - draggable
  let te1Screen = { x: currentTe1.x * scale, y: -currentTe1.y * scale };
  drawArrow(0, 0, te1Screen.x, te1Screen.y, color(220, 50, 50));

  // Draw drag handle for T(e₁)
  fill(255, 200, 200);
  stroke(220, 50, 50);
  strokeWeight(2);
  ellipse(te1.x * scale, -te1.y * scale, 12, 12);

  fill(220, 50, 50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text('T(e₁)', te1Screen.x + 8, te1Screen.y - 5);

  // T(e₂) (blue) - draggable
  let te2Screen = { x: currentTe2.x * scale, y: -currentTe2.y * scale };
  drawArrow(0, 0, te2Screen.x, te2Screen.y, color(50, 50, 220));

  // Draw drag handle for T(e₂)
  fill(200, 200, 255);
  stroke(50, 50, 220);
  strokeWeight(2);
  ellipse(te2.x * scale, -te2.y * scale, 12, 12);

  fill(50, 50, 220);
  noStroke();
  text('T(e₂)', te2Screen.x + 8, te2Screen.y - 5);

  // Draw transformed sample vector
  if (showSample) {
    let transformedSample = transformPoint(sampleVec.x, sampleVec.y, currentTe1, currentTe2);
    let tsx = transformedSample.x * scale;
    let tsy = -transformedSample.y * scale;
    drawArrow(0, 0, tsx, tsy, color(50, 180, 50));
    fill(50, 180, 50);
    textSize(12);
    text('T(v)', tsx + 5, tsy - 5);
  }
}

function transformPoint(x, y, te1, te2) {
  return {
    x: x * te1.x + y * te2.x,
    y: x * te1.y + y * te2.y
  };
}

function drawArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(2);
  line(x1, y1, x2, y2);

  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let arrowSize = 8;

  push();
  translate(x2, y2);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
  pop();
}

function drawMatrixDisplay() {
  // Position matrix display in the bottom right of the drawing area
  let mx = canvasWidth - 150;
  let my = drawHeight - 70;

  // Background
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(mx - 10, my - 5, 140, 60, 5);

  // Matrix label
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text('Matrix A:', mx, my);

  // Matrix brackets and values
  textSize(16);
  textAlign(CENTER, CENTER);

  // Left bracket
  text('[', mx + 15, my + 35);

  // Matrix entries (interpolated)
  let a = lerp(1, te1.x, animValue);
  let b = lerp(0, te2.x, animValue);
  let c = lerp(0, te1.y, animValue);
  let d = lerp(1, te2.y, animValue);

  fill(220, 50, 50);
  text(nf(a, 1, 2), mx + 45, my + 28);
  fill(50, 50, 220);
  text(nf(b, 1, 2), mx + 90, my + 28);
  fill(220, 50, 50);
  text(nf(c, 1, 2), mx + 45, my + 48);
  fill(50, 50, 220);
  text(nf(d, 1, 2), mx + 90, my + 48);

  // Right bracket
  fill('black');
  text(']', mx + 120, my + 35);
}

function mousePressed() {
  // Check if clicking on drag handles in transformed space
  let rightOriginX = viewMargin * 2 + viewWidth + viewWidth/2;
  let rightOriginY = drawHeight/2 + 15;

  // Check T(e₁) handle
  let te1ScreenX = rightOriginX + te1.x * scale;
  let te1ScreenY = rightOriginY - te1.y * scale;
  if (dist(mouseX, mouseY, te1ScreenX, te1ScreenY) < dragThreshold) {
    dragging = 'te1';
    return;
  }

  // Check T(e₂) handle
  let te2ScreenX = rightOriginX + te2.x * scale;
  let te2ScreenY = rightOriginY - te2.y * scale;
  if (dist(mouseX, mouseY, te2ScreenX, te2ScreenY) < dragThreshold) {
    dragging = 'te2';
    return;
  }
}

function mouseDragged() {
  if (dragging) {
    let rightOriginX = viewMargin * 2 + viewWidth + viewWidth/2;
    let rightOriginY = drawHeight/2 + 15;

    // Convert mouse position to vector coordinates
    let newX = (mouseX - rightOriginX) / scale;
    let newY = -(mouseY - rightOriginY) / scale;

    // Clamp to reasonable range
    newX = constrain(newX, -3, 3);
    newY = constrain(newY, -3, 3);

    // Snap to grid (0.25 increments)
    newX = round(newX * 4) / 4;
    newY = round(newY * 4) / 4;

    if (dragging === 'te1') {
      te1.x = newX;
      te1.y = newY;
    } else if (dragging === 'te2') {
      te2.x = newX;
      te2.y = newY;
    }

    // Update preset selector to show custom
    presetSelect.selected('identity');
  }
}

function mouseReleased() {
  dragging = null;
}

function resetTransform() {
  te1 = { x: 1, y: 0 };
  te2 = { x: 0, y: 1 };
  animSlider.value(1);
  presetSelect.selected('identity');
}

function applyPreset() {
  let preset = presets[presetSelect.value()];
  if (preset) {
    te1 = { x: preset.te1.x, y: preset.te1.y };
    te2 = { x: preset.te2.x, y: preset.te2.y };
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  animSlider.size(canvasWidth - sliderLeftMargin - margin);
  viewWidth = (canvasWidth - 3 * viewMargin) / 2;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
