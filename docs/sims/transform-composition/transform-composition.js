// Transformation Composition Visualizer
// Demonstrates that order of transformations matters
// Shows T then S vs S then T side by side
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 750;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout
let margin = 15;
let defaultTextSize = 14;

// Transformations
let transform1Type = 'rotation';
let transform2Type = 'scaling';
let param1 = 45;  // rotation angle
let param2 = 2;   // scale factor

// Controls
let type1Select, type2Select;
let param1Slider, param2Slider;
let showIntermediateCheckbox;
let animateButton;

// Animation
let isAnimating = false;
let animPhase = 0;

// Drawing scale
let scale = 35;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: First transformation
  type1Select = createSelect();
  type1Select.position(10, drawHeight + 5);
  type1Select.option('Rotation', 'rotation');
  type1Select.option('Scale', 'scaling');
  type1Select.option('Shear', 'shear');
  type1Select.changed(() => transform1Type = type1Select.value());

  param1Slider = createSlider(-180, 180, 45, 1);
  param1Slider.position(150, drawHeight + 5);
  param1Slider.size(120);

  // Second transformation
  type2Select = createSelect();
  type2Select.position(320, drawHeight + 5);
  type2Select.option('Rotation', 'rotation');
  type2Select.option('Scale', 'scaling');
  type2Select.option('Shear', 'shear');
  type2Select.selected('scaling');
  type2Select.changed(() => transform2Type = type2Select.value());

  param2Slider = createSlider(0.2, 3, 2, 0.1);
  param2Slider.position(460, drawHeight + 5);
  param2Slider.size(120);

  // Row 2: Options
  showIntermediateCheckbox = createCheckbox('Show Steps', true);
  showIntermediateCheckbox.position(10, drawHeight + 40);
  showIntermediateCheckbox.style('font-size', '14px');

  animateButton = createButton('Animate');
  animateButton.position(130, drawHeight + 40);
  animateButton.mousePressed(toggleAnimation);

  describe('Transformation composition visualizer showing that order matters: T then S vs S then T', LABEL);
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

  // Update parameters
  param1 = param1Slider.value();
  param2 = param2Slider.value();
  transform1Type = type1Select.value();
  transform2Type = type2Select.value();

  // Animation
  if (isAnimating) {
    animPhase = (animPhase + 0.015) % 1;
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Transformation Composition: Order Matters!', canvasWidth / 2, 5);

  // Get transformation matrices
  let T = getMatrix(transform1Type, param1);
  let S = getMatrix(transform2Type, param2);
  let TS = multiplyMatrices(T, S);  // T first, then S = S·T
  let ST = multiplyMatrices(S, T);  // S first, then T = T·S

  // Layout: Three columns
  let colWidth = canvasWidth / 3;

  // Column 1: T then S (result is S·T)
  drawPipeline(colWidth / 2, 'T then S', T, S, TS, false);

  // Column 2: Original (center)
  push();
  translate(colWidth * 1.5, drawHeight / 2 + 30);
  drawAxes();
  fill(100, 100, 200, 180);
  stroke(50, 50, 150);
  strokeWeight(2);
  drawFShape([[1, 0], [0, 1]]);

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Original', 0, scale * 2 + 10);
  pop();

  // Column 3: S then T (result is T·S)
  drawPipeline(colWidth * 2.5, 'S then T', S, T, ST, true);

  // Draw matrices at bottom of drawing area
  drawMatrixInfo(T, S, TS, ST);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  text('T: ' + getParamLabel(transform1Type, param1), 90, drawHeight + 15);
  text('S: ' + getParamLabel(transform2Type, param2), 410, drawHeight + 15);

  // Comparison result
  let same = matricesEqual(TS, ST);
  fill(same ? color(50, 150, 50) : color(200, 50, 50));
  textAlign(CENTER, CENTER);
  textSize(13);
  text(same ? 'TS = ST (commutative!)' : 'TS ≠ ST (order matters!)',
       canvasWidth / 2, drawHeight + 80);
}

function drawPipeline(centerX, label, first, second, combined, isSTOrder) {
  let showSteps = showIntermediateCheckbox.checked();

  // Calculate animated matrices
  let t = isAnimating ? min(animPhase * 2, 1) : 1;
  let t2 = isAnimating ? max((animPhase - 0.5) * 2, 0) : 1;

  let currentFirst = interpolateMatrix([[1, 0], [0, 1]], first, t);
  let currentCombined = interpolateMatrix(first, combined, t2);

  push();
  translate(centerX, drawHeight / 2 + 30);

  // Draw axes
  drawAxes();

  // Draw intermediate state (after first transform)
  if (showSteps && t < 1) {
    fill(200, 200, 100, 100);
    stroke(150, 150, 50);
    strokeWeight(1);
    drawFShape(currentFirst);
  }

  // Draw final state
  let finalMatrix = isAnimating ? currentCombined : combined;
  let alpha = isAnimating ? map(t2, 0, 1, 100, 200) : 200;

  if (isSTOrder) {
    fill(200, 100, 100, alpha);
    stroke(150, 50, 50);
  } else {
    fill(100, 200, 100, alpha);
    stroke(50, 150, 50);
  }
  strokeWeight(2);
  drawFShape(finalMatrix);

  // Label
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text(label, 0, scale * 2 + 10);

  pop();
}

function drawFShape(matrix) {
  // F-shape vertices (centered)
  let vertices = [
    // Vertical stem
    [[0, -1.3], [0, 1.3]],
    // Top horizontal
    [[0, 1.3], [0.7, 1.3]],
    // Middle horizontal
    [[0, 0.3], [0.5, 0.3]]
  ];

  strokeWeight(3);
  vertices.forEach(line => {
    let p1 = applyMatrix(line[0], matrix);
    let p2 = applyMatrix(line[1], matrix);
    drawingContext.beginPath();
    drawingContext.moveTo(p1[0] * scale, -p1[1] * scale);
    drawingContext.lineTo(p2[0] * scale, -p2[1] * scale);
    drawingContext.stroke();
  });
}

function drawAxes() {
  stroke(200);
  strokeWeight(1);
  line(-scale * 2.5, 0, scale * 2.5, 0);
  line(0, -scale * 2.5, 0, scale * 2.5);
}

function getMatrix(type, param) {
  switch (type) {
    case 'rotation':
      let rad = radians(param);
      return [[cos(rad), -sin(rad)], [sin(rad), cos(rad)]];
    case 'scaling':
      return [[param, 0], [0, param]];
    case 'shear':
      return [[1, param / 50], [0, 1]];
    default:
      return [[1, 0], [0, 1]];
  }
}

function getParamLabel(type, param) {
  switch (type) {
    case 'rotation': return 'Rot ' + nf(param, 1, 0) + '°';
    case 'scaling': return 'Scale ' + nf(param, 1, 1) + '×';
    case 'shear': return 'Shear ' + nf(param / 50, 1, 2);
    default: return '';
  }
}

function applyMatrix(point, matrix) {
  return [
    point[0] * matrix[0][0] + point[1] * matrix[0][1],
    point[0] * matrix[1][0] + point[1] * matrix[1][1]
  ];
}

function multiplyMatrices(A, B) {
  // Result = A * B (B applied first, then A)
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
  ];
}

function interpolateMatrix(m1, m2, t) {
  return [
    [lerp(m1[0][0], m2[0][0], t), lerp(m1[0][1], m2[0][1], t)],
    [lerp(m1[1][0], m2[1][0], t), lerp(m1[1][1], m2[1][1], t)]
  ];
}

function matricesEqual(A, B) {
  let eps = 0.01;
  return abs(A[0][0] - B[0][0]) < eps &&
         abs(A[0][1] - B[0][1]) < eps &&
         abs(A[1][0] - B[1][0]) < eps &&
         abs(A[1][1] - B[1][1]) < eps;
}

function drawMatrixInfo(T, S, TS, ST) {
  let y = drawHeight - 55;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(10);

  // T then S result (= S·T)
  text('S·T =', canvasWidth / 6, y);
  drawSmallMatrix(TS, canvasWidth / 6, y + 12);

  // S then T result (= T·S)
  text('T·S =', canvasWidth * 5 / 6, y);
  drawSmallMatrix(ST, canvasWidth * 5 / 6, y + 12);
}

function drawSmallMatrix(M, cx, cy) {
  textSize(9);
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);

  text('[' + nf(M[0][0], 1, 2) + '  ' + nf(M[0][1], 1, 2) + ']', cx, cy);
  text('[' + nf(M[1][0], 1, 2) + '  ' + nf(M[1][1], 1, 2) + ']', cx, cy + 12);
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Stop' : 'Animate');
  if (!isAnimating) animPhase = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
