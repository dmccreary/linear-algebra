// Geometric Transformations Interactive Gallery
// Compare and contrast different geometric transformations
// Rotation, Scaling, Shear, and Reflection
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 420;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

// Layout
let margin = 25;
let sliderLeftMargin = 130;
let defaultTextSize = 16;

// View dimensions
let viewWidth;
let viewMargin = 15;

// Transformation state
let transformType = 'rotation';
let angle = 45;
let scaleX = 1.5;
let scaleY = 1.0;
let shearK = 0.5;
let shearDir = 'horizontal';
let reflectAngle = 0;

// Animation
let animValue = 1.0;
let isAnimating = false;

// Controls
let typeButtons = {};
let param1Slider;
let param2Slider;
let shapeSelect;
let showGridCheckbox;
let animateButton;

// Drawing scale
let scale = 50;
let gridSize = 4;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  viewWidth = (canvasWidth - 3 * viewMargin) / 2;

  // Row 1: Transformation type buttons
  let btnX = 10;
  ['Rotation', 'Scaling', 'Shear', 'Reflection'].forEach((type, i) => {
    let btn = createButton(type);
    btn.position(btnX, drawHeight + 5);
    btn.mousePressed(() => selectTransformType(type.toLowerCase()));
    typeButtons[type.toLowerCase()] = btn;
    btnX += 85;
  });

  animateButton = createButton('Animate');
  animateButton.position(canvasWidth - 90, drawHeight + 5);
  animateButton.mousePressed(toggleAnimation);

  // Row 2: Parameter sliders (will be reconfigured based on type)
  param1Slider = createSlider(-180, 180, 45, 1);
  param1Slider.position(sliderLeftMargin, drawHeight + 40);
  param1Slider.size(200);

  param2Slider = createSlider(-3, 3, 1, 0.1);
  param2Slider.position(sliderLeftMargin + 280, drawHeight + 40);
  param2Slider.size(150);
  param2Slider.hide();

  // Row 3: Shape and grid options
  shapeSelect = createSelect();
  shapeSelect.position(10, drawHeight + 70);
  shapeSelect.option('F-Shape', 'f');
  shapeSelect.option('Square', 'square');
  shapeSelect.option('Arrow', 'arrow');
  shapeSelect.option('Points', 'points');

  showGridCheckbox = createCheckbox('Show Grid', true);
  showGridCheckbox.position(120, drawHeight + 70);
  showGridCheckbox.style('font-size', '14px');

  updateControlsForType();
  describe('Geometric transformations gallery comparing rotation, scaling, shear, and reflection', LABEL);
}

function draw() {
  updateCanvasSize();
  viewWidth = (canvasWidth - 3 * viewMargin) / 2;

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
    animValue = (animValue + 0.02) % 1.01;
    if (animValue > 1) animValue = 0;
  } else {
    animValue = 1.0;
  }

  // Update parameters from sliders
  updateParameters();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Geometric Transformations Gallery', canvasWidth / 2, 8);

  // Subtitle with current type
  textSize(14);
  fill(100);
  text(capitalize(transformType) + ' Transformation', canvasWidth / 2, 30);

  // Draw original space
  push();
  translate(viewMargin + viewWidth / 2, drawHeight / 2 + 20);
  drawSpace(false);
  pop();

  // Draw transformed space
  push();
  translate(viewMargin * 2 + viewWidth + viewWidth / 2, drawHeight / 2 + 20);
  drawSpace(true);
  pop();

  // Labels
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Original', viewMargin + viewWidth / 2, 48);
  text('Transformed', viewMargin * 2 + viewWidth + viewWidth / 2, 48);

  // Draw transformation arrow
  stroke(150);
  strokeWeight(1);
  line(viewMargin + viewWidth + 5, drawHeight / 2 + 20,
       viewMargin * 2 + viewWidth - 5, drawHeight / 2 + 20);
  fill(150);
  noStroke();
  triangle(viewMargin * 2 + viewWidth - 5, drawHeight / 2 + 20,
           viewMargin * 2 + viewWidth - 15, drawHeight / 2 + 15,
           viewMargin * 2 + viewWidth - 15, drawHeight / 2 + 25);

  // Draw matrix and properties panel
  drawInfoPanel();

  // Draw control labels
  drawControlLabels();

  // Update button styles
  updateButtonStyles();
}

function drawSpace(transformed) {
  let matrix = getTransformMatrix();
  let showGrid = showGridCheckbox.checked();

  // Interpolate for animation
  let t = transformed ? animValue : 0;
  let currentMatrix = interpolateMatrix([[1, 0], [0, 1]], matrix, t);

  // Draw grid
  if (showGrid) {
    stroke(transformed ? color(220, 200, 200) : color(200, 200, 220));
    strokeWeight(1);

    for (let i = -gridSize; i <= gridSize; i++) {
      // Vertical lines
      for (let j = -gridSize; j < gridSize; j++) {
        let p1 = applyMatrix([i, j], currentMatrix);
        let p2 = applyMatrix([i, j + 1], currentMatrix);
        line(p1[0] * scale, -p1[1] * scale, p2[0] * scale, -p2[1] * scale);
      }
      // Horizontal lines
      for (let j = -gridSize; j < gridSize; j++) {
        let p1 = applyMatrix([j, i], currentMatrix);
        let p2 = applyMatrix([j + 1, i], currentMatrix);
        line(p1[0] * scale, -p1[1] * scale, p2[0] * scale, -p2[1] * scale);
      }
    }
  }

  // Draw axes
  stroke(150);
  strokeWeight(1);
  line(-viewWidth / 2 + 10, 0, viewWidth / 2 - 10, 0);
  line(0, -drawHeight / 2 + 65, 0, drawHeight / 2 - 35);

  // Draw shape
  let col = transformed ? color(220, 50, 50) : color(50, 50, 220);
  drawShape(shapeSelect.value(), col, currentMatrix);
}

function drawShape(shapeType, col, matrix) {
  stroke(col);
  strokeWeight(2);
  fill(red(col), green(col), blue(col), 60);

  switch (shapeType) {
    case 'f':
      noFill();
      // F-shape
      let fPoints = [
        [0, -1.2], [0, 1.2], [0, 1.2], [0.8, 1.2],
        [0, 0.2], [0.5, 0.2]
      ];
      // Stem
      let p1 = applyMatrix([0, -1.2], matrix);
      let p2 = applyMatrix([0, 1.2], matrix);
      line(p1[0] * scale, -p1[1] * scale, p2[0] * scale, -p2[1] * scale);
      // Top
      let p3 = applyMatrix([0.8, 1.2], matrix);
      line(p2[0] * scale, -p2[1] * scale, p3[0] * scale, -p3[1] * scale);
      // Middle
      let p4 = applyMatrix([0, 0.2], matrix);
      let p5 = applyMatrix([0.5, 0.2], matrix);
      line(p4[0] * scale, -p4[1] * scale, p5[0] * scale, -p5[1] * scale);
      break;

    case 'square':
      beginShape();
      let corners = [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]];
      corners.forEach(c => {
        let pt = applyMatrix(c, matrix);
        vertex(pt[0] * scale, -pt[1] * scale);
      });
      endShape(CLOSE);
      break;

    case 'arrow':
      noFill();
      let arrowPts = [[0, 0], [1.5, 0]];
      let a1 = applyMatrix(arrowPts[0], matrix);
      let a2 = applyMatrix(arrowPts[1], matrix);
      line(a1[0] * scale, -a1[1] * scale, a2[0] * scale, -a2[1] * scale);
      // Arrowhead
      let ah1 = applyMatrix([1.2, 0.2], matrix);
      let ah2 = applyMatrix([1.2, -0.2], matrix);
      line(a2[0] * scale, -a2[1] * scale, ah1[0] * scale, -ah1[1] * scale);
      line(a2[0] * scale, -a2[1] * scale, ah2[0] * scale, -ah2[1] * scale);
      break;

    case 'points':
      // Grid of points
      noStroke();
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          let pt = applyMatrix([i * 0.5, j * 0.5], matrix);
          fill(col);
          ellipse(pt[0] * scale, -pt[1] * scale, 8, 8);
        }
      }
      break;
  }
}

function getTransformMatrix() {
  switch (transformType) {
    case 'rotation':
      let rad = radians(angle);
      return [[cos(rad), -sin(rad)], [sin(rad), cos(rad)]];

    case 'scaling':
      return [[scaleX, 0], [0, scaleY]];

    case 'shear':
      if (shearDir === 'horizontal') {
        return [[1, shearK], [0, 1]];
      } else {
        return [[1, 0], [shearK, 1]];
      }

    case 'reflection':
      let theta = radians(reflectAngle);
      return [[cos(2 * theta), sin(2 * theta)], [sin(2 * theta), -cos(2 * theta)]];

    default:
      return [[1, 0], [0, 1]];
  }
}

function applyMatrix(point, matrix) {
  return [
    point[0] * matrix[0][0] + point[1] * matrix[0][1],
    point[0] * matrix[1][0] + point[1] * matrix[1][1]
  ];
}

function interpolateMatrix(m1, m2, t) {
  return [
    [lerp(m1[0][0], m2[0][0], t), lerp(m1[0][1], m2[0][1], t)],
    [lerp(m1[1][0], m2[1][0], t), lerp(m1[1][1], m2[1][1], t)]
  ];
}

function drawInfoPanel() {
  let px = canvasWidth - 145;
  let py = 55;

  // Background
  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(px - 5, py, 140, 120, 8);

  let matrix = getTransformMatrix();
  let det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  // Matrix display
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Matrix:', px + 65, py + 5);

  textSize(14);
  text('[', px + 15, py + 30);
  text(nf(matrix[0][0], 1, 2), px + 45, py + 25);
  text(nf(matrix[0][1], 1, 2), px + 95, py + 25);
  text(nf(matrix[1][0], 1, 2), px + 45, py + 45);
  text(nf(matrix[1][1], 1, 2), px + 95, py + 45);
  text(']', px + 120, py + 30);

  // Properties
  textAlign(LEFT, TOP);
  textSize(11);
  fill(80);
  text('det = ' + nf(det, 1, 3), px + 5, py + 70);

  // Type-specific info
  let info = '';
  if (transformType === 'rotation') {
    info = 'Orthogonal: Yes';
  } else if (transformType === 'scaling') {
    info = 'Area × ' + nf(abs(det), 1, 2);
  } else if (transformType === 'shear') {
    info = 'Area preserved';
  } else if (transformType === 'reflection') {
    info = 'Flips orientation';
  }
  text(info, px + 5, py + 85);

  // Invertible?
  let invertible = abs(det) > 0.001;
  fill(invertible ? color(50, 150, 50) : color(200, 50, 50));
  text(invertible ? 'Invertible' : 'Not invertible', px + 5, py + 100);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);

  let label1 = '';
  let value1 = '';

  switch (transformType) {
    case 'rotation':
      label1 = 'Angle: ' + nf(angle, 1, 0) + '°';
      break;
    case 'scaling':
      label1 = 'Scale X: ' + nf(scaleX, 1, 1);
      text('Scale Y: ' + nf(scaleY, 1, 1), sliderLeftMargin + 210, drawHeight + 50);
      break;
    case 'shear':
      label1 = 'Shear k: ' + nf(shearK, 1, 2);
      break;
    case 'reflection':
      label1 = 'Line angle: ' + nf(reflectAngle, 1, 0) + '°';
      break;
  }
  text(label1, 10, drawHeight + 50);
}

function updateParameters() {
  switch (transformType) {
    case 'rotation':
      angle = param1Slider.value();
      break;
    case 'scaling':
      scaleX = param1Slider.value();
      scaleY = param2Slider.value();
      break;
    case 'shear':
      shearK = param1Slider.value();
      break;
    case 'reflection':
      reflectAngle = param1Slider.value();
      break;
  }
}

function selectTransformType(type) {
  transformType = type;
  updateControlsForType();
}

function updateControlsForType() {
  switch (transformType) {
    case 'rotation':
      param1Slider.elt.min = -180;
      param1Slider.elt.max = 180;
      param1Slider.elt.step = 1;
      param1Slider.value(angle);
      param2Slider.hide();
      break;

    case 'scaling':
      param1Slider.elt.min = -3;
      param1Slider.elt.max = 3;
      param1Slider.elt.step = 0.1;
      param1Slider.value(scaleX);
      param2Slider.elt.min = -3;
      param2Slider.elt.max = 3;
      param2Slider.elt.step = 0.1;
      param2Slider.value(scaleY);
      param2Slider.show();
      break;

    case 'shear':
      param1Slider.elt.min = -2;
      param1Slider.elt.max = 2;
      param1Slider.elt.step = 0.05;
      param1Slider.value(shearK);
      param2Slider.hide();
      break;

    case 'reflection':
      param1Slider.elt.min = -90;
      param1Slider.elt.max = 90;
      param1Slider.elt.step = 1;
      param1Slider.value(reflectAngle);
      param2Slider.hide();
      break;
  }
}

function updateButtonStyles() {
  Object.keys(typeButtons).forEach(type => {
    if (type === transformType) {
      typeButtons[type].style('background-color', '#4CAF50');
      typeButtons[type].style('color', 'white');
    } else {
      typeButtons[type].style('background-color', '#e7e7e7');
      typeButtons[type].style('color', 'black');
    }
  });
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Stop' : 'Animate');
  if (!isAnimating) animValue = 1.0;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  viewWidth = (canvasWidth - 3 * viewMargin) / 2;
  animateButton.position(canvasWidth - 90, drawHeight + 5);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
