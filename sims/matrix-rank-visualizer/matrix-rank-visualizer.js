// Matrix Rank Visualizer MicroSim
// Visualize how matrix rank relates to the column space
// Shows column vectors, column space (plane/line/point), and row echelon form
// Learning objective: Understand rank-deficient matrices geometrically

let canvasWidth = 900;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// 3D rotation angles
let rotX = -0.4;
let rotY = 0.5;
let isDragging = false;
let lastMouseX, lastMouseY;

// Matrix data (3x3)
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Computed values
let refMatrix = [];
let rank = 0;
let pivotCols = [];

// UI elements
let presetSelect;
let showVectorsCheckbox;
let showSpaceCheckbox;

// Colors for columns
let colColors = [];

// Font for WEBGL text
let font;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent(document.querySelector('main'));
  textFont(font);

  // Column colors
  colColors = [
    color(220, 60, 60),   // Red for col 1
    color(60, 160, 60),   // Green for col 2
    color(60, 60, 220)    // Blue for col 3
  ];

  // Create preset selector
  presetSelect = createSelect();
  presetSelect.option('Rank 2 (Default)', 'rank2');
  presetSelect.option('Full Rank (3)', 'full');
  presetSelect.option('Rank 1', 'rank1');
  presetSelect.option('Rank 0 (Zero)', 'zero');
  presetSelect.position(10, drawHeight + 12);
  presetSelect.changed(loadPreset);

  // Checkboxes
  showVectorsCheckbox = createCheckbox('Show Vectors', true);
  showVectorsCheckbox.position(180, drawHeight + 12);
  showVectorsCheckbox.style('font-size', '14px');

  showSpaceCheckbox = createCheckbox('Show Column Space', true);
  showSpaceCheckbox.position(300, drawHeight + 12);
  showSpaceCheckbox.style('font-size', '14px');

  computeRank();

  describe('Interactive visualization of matrix rank showing column vectors and column space in 3D', LABEL);
}

function draw() {
  updateCanvasSize();
  background(240);

  // Draw in WEBGL coordinates (origin at center)
  push();

  // Set up 3D view
  let scale3D = 50;

  // Apply rotation
  rotateX(rotX);
  rotateY(rotY);

  // Draw coordinate axes
  drawAxes(scale3D * 4);

  // Draw column vectors if enabled
  if (showVectorsCheckbox.checked()) {
    drawColumnVectors(scale3D);
  }

  // Draw column space if enabled
  if (showSpaceCheckbox.checked()) {
    drawColumnSpace(scale3D);
  }

  pop();

  // Draw 2D overlay elements
  draw2DOverlay();
}

function drawAxes(len) {
  strokeWeight(1);

  // X axis - red
  stroke(180, 0, 0);
  line(-len, 0, 0, len, 0, 0);

  // Y axis - green
  stroke(0, 180, 0);
  line(0, -len, 0, 0, len, 0);

  // Z axis - blue
  stroke(0, 0, 180);
  line(0, 0, -len, 0, 0, len);

  // Axis labels
  textSize(14);
  fill(100);
  noStroke();

  push();
  translate(len + 10, 0, 0);
  rotateY(HALF_PI);
  text('x', 0, 0);
  pop();

  push();
  translate(0, -len - 10, 0);
  text('y', 0, 0);
  pop();

  push();
  translate(0, 0, len + 10);
  rotateY(HALF_PI);
  text('z', 0, 0);
  pop();

  // Grid on XZ plane
  stroke(220);
  strokeWeight(0.5);
  for (let i = -4; i <= 4; i++) {
    let gridScale = len / 4;
    line(i * gridScale, 0, -len, i * gridScale, 0, len);
    line(-len, 0, i * gridScale, len, 0, i * gridScale);
  }
}

function drawColumnVectors(scale) {
  for (let col = 0; col < 3; col++) {
    let x = matrix[0][col] * scale;
    let y = -matrix[1][col] * scale; // Negate y for visual convention
    let z = matrix[2][col] * scale;

    // Determine if this column is a pivot column
    let isPivot = pivotCols.includes(col);

    // Draw vector as thick line with arrowhead
    strokeWeight(isPivot ? 4 : 2);
    stroke(colColors[col]);
    line(0, 0, 0, x, y, z);

    // Draw arrowhead
    push();
    translate(x, y, z);
    let len = sqrt(x*x + y*y + z*z);
    if (len > 0.01) {
      // Draw sphere at tip
      noStroke();
      fill(colColors[col]);
      sphere(isPivot ? 8 : 5);
    }
    pop();

    // Label
    push();
    translate(x * 1.15, y * 1.15, z * 1.15);
    fill(colColors[col]);
    noStroke();
    textSize(16);
    text('c' + (col + 1), 0, 0);
    pop();
  }
}

function drawColumnSpace(scale) {
  if (rank === 0) {
    // Just the origin - draw a point
    push();
    noStroke();
    fill(100, 100, 255, 150);
    sphere(10);
    pop();
  } else if (rank === 1) {
    // Column space is a line - use first non-zero column
    let col = findFirstNonZeroCol();
    if (col >= 0) {
      let x = matrix[0][col] * scale;
      let y = -matrix[1][col] * scale;
      let z = matrix[2][col] * scale;
      let len = sqrt(x*x + y*y + z*z);
      if (len > 0.01) {
        // Normalize and extend
        let nx = x / len * 200;
        let ny = y / len * 200;
        let nz = z / len * 200;

        strokeWeight(3);
        stroke(100, 100, 255, 200);
        line(-nx, -ny, -nz, nx, ny, nz);
      }
    }
  } else if (rank === 2) {
    // Column space is a plane - compute normal from two independent columns
    let cols = findTwoIndependentCols();
    if (cols.length >= 2) {
      let v1 = [matrix[0][cols[0]], -matrix[1][cols[0]], matrix[2][cols[0]]];
      let v2 = [matrix[0][cols[1]], -matrix[1][cols[1]], matrix[2][cols[1]]];

      // Cross product for normal
      let nx = v1[1] * v2[2] - v1[2] * v2[1];
      let ny = v1[2] * v2[0] - v1[0] * v2[2];
      let nz = v1[0] * v2[1] - v1[1] * v2[0];

      // Draw semi-transparent plane
      drawPlane(v1, v2, scale * 3);
    }
  } else if (rank === 3) {
    // Full rank - all of R³ (don't draw anything special, or draw unit cube outline)
    stroke(100, 100, 255, 100);
    strokeWeight(1);
    noFill();
    box(scale * 6);
  }
}

function drawPlane(v1, v2, size) {
  // Draw a parallelogram defined by v1 and v2, scaled
  let len1 = sqrt(v1[0]*v1[0] + v1[1]*v1[1] + v1[2]*v1[2]);
  let len2 = sqrt(v2[0]*v2[0] + v2[1]*v2[1] + v2[2]*v2[2]);

  if (len1 < 0.01 || len2 < 0.01) return;

  // Normalize
  let u1 = [v1[0]/len1 * size, v1[1]/len1 * size, v1[2]/len1 * size];
  let u2 = [v2[0]/len2 * size, v2[1]/len2 * size, v2[2]/len2 * size];

  fill(100, 100, 255, 80);
  stroke(100, 100, 255, 150);
  strokeWeight(1);

  beginShape();
  vertex(-u1[0] - u2[0], -u1[1] - u2[1], -u1[2] - u2[2]);
  vertex(u1[0] - u2[0], u1[1] - u2[1], u1[2] - u2[2]);
  vertex(u1[0] + u2[0], u1[1] + u2[1], u1[2] + u2[2]);
  vertex(-u1[0] + u2[0], -u1[1] + u2[1], -u1[2] + u2[2]);
  endShape(CLOSE);
}

function findFirstNonZeroCol() {
  for (let col = 0; col < 3; col++) {
    let norm = 0;
    for (let row = 0; row < 3; row++) {
      norm += matrix[row][col] * matrix[row][col];
    }
    if (norm > 0.0001) return col;
  }
  return -1;
}

function findTwoIndependentCols() {
  // Return indices of two linearly independent columns
  let result = [];
  for (let col of pivotCols) {
    result.push(col);
    if (result.length >= 2) break;
  }
  return result;
}

function draw2DOverlay() {
  // Switch to 2D drawing mode
  push();
  resetMatrix();

  // Translate to top-left corner
  translate(-canvasWidth/2, -canvasHeight/2);

  // Draw background panels
  // Left panel - Matrix input display
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(10, 10, 160, 160, 8);

  // Right panel - REF and rank info
  fill(255, 255, 255, 240);
  rect(canvasWidth - 200, 10, 190, 200, 8);

  // Title
  fill(0);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('Matrix Rank Visualizer', canvasWidth/2, 15);

  // Draw matrix A
  textSize(14);
  textAlign(LEFT, TOP);
  fill(0);
  text('Matrix A:', 20, 20);

  textSize(13);
  for (let row = 0; row < 3; row++) {
    let y = 45 + row * 35;
    // Draw bracket
    stroke(0);
    strokeWeight(1);
    line(25, y - 5, 25, y + 25);
    line(25, y - 5, 30, y - 5);
    line(25, y + 25, 30, y + 25);

    line(145, y - 5, 145, y + 25);
    line(140, y - 5, 145, y - 5);
    line(140, y + 25, 145, y + 25);

    noStroke();
    for (let col = 0; col < 3; col++) {
      // Color-code by column
      fill(colColors[col]);
      let val = matrix[row][col];
      let valStr = Number.isInteger(val) ? val.toString() : val.toFixed(1);
      text(valStr, 40 + col * 35, y);
    }
  }

  // Right panel content
  textAlign(LEFT, TOP);
  fill(0);
  textSize(14);
  text('Row Echelon Form:', canvasWidth - 190, 20);

  textSize(12);
  for (let row = 0; row < 3; row++) {
    let y = 45 + row * 30;
    // Draw bracket
    stroke(0);
    strokeWeight(1);
    line(canvasWidth - 185, y - 3, canvasWidth - 185, y + 20);
    line(canvasWidth - 185, y - 3, canvasWidth - 180, y - 3);
    line(canvasWidth - 185, y + 20, canvasWidth - 180, y + 20);

    line(canvasWidth - 35, y - 3, canvasWidth - 35, y + 20);
    line(canvasWidth - 40, y - 3, canvasWidth - 35, y - 3);
    line(canvasWidth - 40, y + 20, canvasWidth - 35, y + 20);

    noStroke();
    for (let col = 0; col < 3; col++) {
      // Highlight pivot positions
      let isPivot = (pivotCols.indexOf(col) === row && row < rank);
      if (isPivot) {
        fill(255, 255, 0);
        rect(canvasWidth - 175 + col * 45 - 3, y - 2, 35, 18, 3);
      }
      fill(0);
      let val = refMatrix[row] ? refMatrix[row][col] : 0;
      let valStr = Math.abs(val) < 0.001 ? '0' : val.toFixed(2);
      text(valStr, canvasWidth - 175 + col * 45, y);
    }
  }

  // Rank display
  textSize(16);
  fill(0);
  text('Rank: ' + rank, canvasWidth - 190, 140);

  // Pivot columns
  textSize(13);
  text('Pivot cols: [' + pivotCols.map(c => c+1).join(', ') + ']', canvasWidth - 190, 165);

  // Interpretation
  textSize(12);
  fill(60);
  let interpText = '';
  if (rank === 0) interpText = 'Zero matrix → point';
  else if (rank === 1) interpText = 'Col space: line';
  else if (rank === 2) interpText = 'Col space: plane';
  else if (rank === 3) interpText = 'Full rank → all of R³';
  text(interpText, canvasWidth - 190, 185);

  // Control area background
  fill(255);
  stroke(200);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Instructions
  noStroke();
  fill(80);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('Drag to rotate view', canvasWidth - 20, drawHeight + 25);

  pop();
}

function computeRank() {
  // Create a copy for row echelon reduction
  refMatrix = matrix.map(row => [...row]);
  pivotCols = [];

  let lead = 0;
  let numRows = 3;
  let numCols = 3;

  for (let r = 0; r < numRows; r++) {
    if (lead >= numCols) break;

    let i = r;
    while (Math.abs(refMatrix[i][lead]) < 0.0001) {
      i++;
      if (i >= numRows) {
        i = r;
        lead++;
        if (lead >= numCols) break;
      }
    }

    if (lead >= numCols) break;

    // Swap rows i and r
    let temp = refMatrix[i];
    refMatrix[i] = refMatrix[r];
    refMatrix[r] = temp;

    // Scale row r
    let div = refMatrix[r][lead];
    if (Math.abs(div) > 0.0001) {
      pivotCols.push(lead);
      for (let j = 0; j < numCols; j++) {
        refMatrix[r][j] /= div;
      }

      // Eliminate column entries below pivot
      for (let i2 = r + 1; i2 < numRows; i2++) {
        let mult = refMatrix[i2][lead];
        for (let j = 0; j < numCols; j++) {
          refMatrix[i2][j] -= mult * refMatrix[r][j];
        }
      }
    }

    lead++;
  }

  rank = pivotCols.length;
}

function loadPreset() {
  let preset = presetSelect.value();

  if (preset === 'full') {
    matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  } else if (preset === 'rank2') {
    matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
  } else if (preset === 'rank1') {
    matrix = [
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9]
    ];
  } else if (preset === 'zero') {
    matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
  }

  computeRank();
}

function mousePressed() {
  // Check if mouse is in 3D view area (not in panels or controls)
  let mx = mouseX;
  let my = mouseY;

  if (my < drawHeight && mx > 170 && mx < canvasWidth - 210) {
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

    // Clamp rotX to avoid gimbal lock
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
