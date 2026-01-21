// Perceptron Decision Boundary Visualizer
// Demonstrates how weights and bias define a linear decision boundary
// Interactive: drag weight vector, adjust bias, run perceptron learning
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Coordinate system mapping
let plotMargin = 50;
let plotSize;

// Perceptron parameters
let w1 = 1.0;  // Weight for x1
let w2 = 1.0;  // Weight for x2
let bias = 0;  // Bias term

// Data points: {x1, x2, label}  label: +1 or -1
let dataPoints = [];

// Interactive state
let isDraggingWeight = false;
let addPointMode = false;
let nextPointClass = 1;  // 1 or -1
let isLearning = false;
let learningStep = 0;
let learningRate = 0.1;

// UI elements
let biasSlider;
let datasetSelect;
let addPointButton;
let learnButton;
let resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  plotSize = drawHeight - 2 * plotMargin;

  // Row 1: Dataset selector, Add Point toggle, Learn button, Reset
  datasetSelect = createSelect();
  datasetSelect.position(10, drawHeight + 8);
  datasetSelect.option('Linearly Separable');
  datasetSelect.option('XOR (Not Separable)');
  datasetSelect.option('Clustered');
  datasetSelect.option('Clear');
  datasetSelect.changed(loadDataset);

  addPointButton = createButton('Add Points');
  addPointButton.position(160, drawHeight + 5);
  addPointButton.mousePressed(toggleAddPointMode);

  learnButton = createButton('Learn');
  learnButton.position(260, drawHeight + 5);
  learnButton.mousePressed(startLearning);

  resetButton = createButton('Reset Weights');
  resetButton.position(330, drawHeight + 5);
  resetButton.mousePressed(resetWeights);

  // Row 2: Bias slider
  biasSlider = createSlider(-5, 5, 0, 0.1);
  biasSlider.position(sliderLeftMargin, drawHeight + 45);
  biasSlider.size(canvasWidth - sliderLeftMargin - margin);
  biasSlider.input(() => { bias = biasSlider.value(); });

  // Load initial dataset
  loadDataset();

  describe('Perceptron decision boundary visualizer showing how weights and bias define a linear classifier', LABEL);
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
  textSize(20);
  text('Perceptron Decision Boundary', canvasWidth / 2, 8);

  // Draw coordinate system
  drawCoordinateSystem();

  // Draw shaded regions
  drawClassRegions();

  // Draw decision boundary
  drawDecisionBoundary();

  // Draw weight vector
  drawWeightVector();

  // Draw data points
  drawDataPoints();

  // Calculate and show accuracy
  let accuracy = calculateAccuracy();

  // Draw control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Bias: ' + bias.toFixed(1), 10, drawHeight + 55);

  // Show accuracy
  textAlign(RIGHT, CENTER);
  text('Accuracy: ' + (accuracy * 100).toFixed(0) + '%', canvasWidth - 10, drawHeight + 55);

  // Show weight values
  textAlign(LEFT, TOP);
  textSize(14);
  fill(0, 0, 0, 200);
  text('w = [' + w1.toFixed(2) + ', ' + w2.toFixed(2) + ']', 10, 35);

  // Show add point mode indicator
  if (addPointMode) {
    fill(nextPointClass === 1 ? 'blue' : 'red');
    textAlign(CENTER, TOP);
    text('Click to add ' + (nextPointClass === 1 ? 'blue (+1)' : 'red (-1)') + ' point. Press SPACE to switch class.', canvasWidth / 2, drawHeight - 25);
  }

  // Continue learning animation
  if (isLearning) {
    performLearningStep();
  }
}

function drawCoordinateSystem() {
  let cx = plotMargin + plotSize / 2;
  let cy = plotMargin + plotSize / 2;

  stroke(200);
  strokeWeight(1);

  // Grid lines
  for (let i = -4; i <= 4; i++) {
    let px = map(i, -5, 5, plotMargin, plotMargin + plotSize);
    let py = map(i, -5, 5, plotMargin + plotSize, plotMargin);

    // Vertical line
    line(px, plotMargin, px, plotMargin + plotSize);
    // Horizontal line
    line(plotMargin, py, plotMargin + plotSize, py);
  }

  // Axes
  stroke(100);
  strokeWeight(2);
  // X-axis
  line(plotMargin, cy, plotMargin + plotSize, cy);
  // Y-axis
  line(cx, plotMargin, cx, plotMargin + plotSize);

  // Axis labels
  noStroke();
  fill(100);
  textSize(12);
  textAlign(CENTER, TOP);
  text('x1', plotMargin + plotSize, cy + 5);
  textAlign(LEFT, CENTER);
  text('x2', cx + 5, plotMargin);
}

function drawClassRegions() {
  // Draw semi-transparent regions for each class
  let steps = 50;
  noStroke();

  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      let px = plotMargin + (i + 0.5) * plotSize / steps;
      let py = plotMargin + (j + 0.5) * plotSize / steps;

      let x1 = map(px, plotMargin, plotMargin + plotSize, -5, 5);
      let x2 = map(py, plotMargin + plotSize, plotMargin, -5, 5);

      let z = w1 * x1 + w2 * x2 + bias;

      if (z >= 0) {
        fill(100, 150, 255, 30);  // Light blue for +1
      } else {
        fill(255, 100, 100, 30);  // Light red for -1
      }

      rect(px - plotSize / steps / 2, py - plotSize / steps / 2,
           plotSize / steps, plotSize / steps);
    }
  }
}

function drawDecisionBoundary() {
  // Decision boundary: w1*x1 + w2*x2 + b = 0
  // Solve for x2: x2 = -(w1*x1 + b) / w2

  stroke(0, 100, 0);
  strokeWeight(3);

  if (abs(w2) > 0.01) {
    // Normal case: solve for x2
    let x1_start = -5;
    let x1_end = 5;
    let x2_start = -(w1 * x1_start + bias) / w2;
    let x2_end = -(w1 * x1_end + bias) / w2;

    let px1 = map(x1_start, -5, 5, plotMargin, plotMargin + plotSize);
    let py1 = map(x2_start, -5, 5, plotMargin + plotSize, plotMargin);
    let px2 = map(x1_end, -5, 5, plotMargin, plotMargin + plotSize);
    let py2 = map(x2_end, -5, 5, plotMargin + plotSize, plotMargin);

    line(px1, py1, px2, py2);
  } else if (abs(w1) > 0.01) {
    // Vertical line: x1 = -b/w1
    let x1 = -bias / w1;
    let px = map(x1, -5, 5, plotMargin, plotMargin + plotSize);
    line(px, plotMargin, px, plotMargin + plotSize);
  }
}

function drawWeightVector() {
  let cx = plotMargin + plotSize / 2;
  let cy = plotMargin + plotSize / 2;

  // Normalize and scale weight vector for display
  let wLen = sqrt(w1 * w1 + w2 * w2);
  if (wLen < 0.01) return;

  let scale = plotSize / 10;
  let wx = (w1 / wLen) * scale;
  let wy = -(w2 / wLen) * scale;  // Flip y for screen coordinates

  // Draw from center
  stroke(128, 0, 128);
  strokeWeight(3);
  line(cx, cy, cx + wx * 2, cy + wy * 2);

  // Arrow head
  push();
  translate(cx + wx * 2, cy + wy * 2);
  rotate(atan2(wy, wx));
  fill(128, 0, 128);
  noStroke();
  triangle(0, 0, -10, -5, -10, 5);
  pop();

  // Label
  noStroke();
  fill(128, 0, 128);
  textSize(14);
  textAlign(LEFT, CENTER);
  text('w', cx + wx * 2 + 10, cy + wy * 2);

  // Draw draggable handle
  fill(isDraggingWeight ? 'yellow' : 'orange');
  stroke(128, 0, 128);
  strokeWeight(2);
  ellipse(cx + wx * 2, cy + wy * 2, 16, 16);
}

function drawDataPoints() {
  for (let p of dataPoints) {
    let px = map(p.x1, -5, 5, plotMargin, plotMargin + plotSize);
    let py = map(p.x2, -5, 5, plotMargin + plotSize, plotMargin);

    // Calculate prediction
    let z = w1 * p.x1 + w2 * p.x2 + bias;
    let prediction = z >= 0 ? 1 : -1;
    let correct = prediction === p.label;

    // Draw point
    strokeWeight(correct ? 2 : 4);
    stroke(correct ? 'black' : 'yellow');  // Yellow ring for misclassified

    if (p.label === 1) {
      fill(70, 130, 220);  // Blue for class +1
    } else {
      fill(220, 70, 70);   // Red for class -1
    }

    ellipse(px, py, 16, 16);
  }
}

function calculateAccuracy() {
  if (dataPoints.length === 0) return 1;

  let correct = 0;
  for (let p of dataPoints) {
    let z = w1 * p.x1 + w2 * p.x2 + bias;
    let prediction = z >= 0 ? 1 : -1;
    if (prediction === p.label) correct++;
  }
  return correct / dataPoints.length;
}

function loadDataset() {
  let selected = datasetSelect.value();
  dataPoints = [];

  if (selected === 'Linearly Separable') {
    // Class +1: upper right region
    for (let i = 0; i < 10; i++) {
      dataPoints.push({
        x1: random(1, 4),
        x2: random(1, 4),
        label: 1
      });
    }
    // Class -1: lower left region
    for (let i = 0; i < 10; i++) {
      dataPoints.push({
        x1: random(-4, -1),
        x2: random(-4, -1),
        label: -1
      });
    }
  } else if (selected === 'XOR (Not Separable)') {
    // XOR pattern - not linearly separable
    for (let i = 0; i < 5; i++) {
      dataPoints.push({ x1: random(1, 3), x2: random(1, 3), label: -1 });
      dataPoints.push({ x1: random(-3, -1), x2: random(-3, -1), label: -1 });
      dataPoints.push({ x1: random(1, 3), x2: random(-3, -1), label: 1 });
      dataPoints.push({ x1: random(-3, -1), x2: random(1, 3), label: 1 });
    }
  } else if (selected === 'Clustered') {
    // Two close clusters
    for (let i = 0; i < 10; i++) {
      dataPoints.push({
        x1: random(-1, 1) + 2,
        x2: random(-1, 1) + 2,
        label: 1
      });
    }
    for (let i = 0; i < 10; i++) {
      dataPoints.push({
        x1: random(-1, 1) - 2,
        x2: random(-1, 1) - 2,
        label: -1
      });
    }
  }
  // 'Clear' leaves dataPoints empty

  resetWeights();
}

function resetWeights() {
  w1 = random(-1, 1);
  w2 = random(-1, 1);
  bias = 0;
  biasSlider.value(0);
  isLearning = false;
  learningStep = 0;
  learnButton.html('Learn');
}

function toggleAddPointMode() {
  addPointMode = !addPointMode;
  addPointButton.html(addPointMode ? 'Done Adding' : 'Add Points');
}

function startLearning() {
  if (isLearning) {
    isLearning = false;
    learnButton.html('Learn');
  } else {
    isLearning = true;
    learningStep = 0;
    learnButton.html('Stop');
  }
}

function performLearningStep() {
  // Perceptron learning: update weights for misclassified points
  let updated = false;

  for (let p of dataPoints) {
    let z = w1 * p.x1 + w2 * p.x2 + bias;
    let prediction = z >= 0 ? 1 : -1;

    if (prediction !== p.label) {
      // Update rule: w = w + learning_rate * y * x
      w1 += learningRate * p.label * p.x1;
      w2 += learningRate * p.label * p.x2;
      bias += learningRate * p.label;
      biasSlider.value(constrain(bias, -5, 5));
      updated = true;
      break;  // One update per frame for animation
    }
  }

  learningStep++;

  // Stop if converged or max steps reached
  if (!updated || learningStep > 1000) {
    isLearning = false;
    learnButton.html('Learn');
  }
}

function mousePressed() {
  let cx = plotMargin + plotSize / 2;
  let cy = plotMargin + plotSize / 2;

  // Check if clicking on weight vector handle
  let wLen = sqrt(w1 * w1 + w2 * w2);
  if (wLen > 0.01) {
    let scale = plotSize / 10;
    let wx = (w1 / wLen) * scale * 2;
    let wy = -(w2 / wLen) * scale * 2;

    if (dist(mouseX, mouseY, cx + wx, cy + wy) < 15) {
      isDraggingWeight = true;
      return;
    }
  }

  // Add point mode
  if (addPointMode && mouseY < drawHeight && mouseX > plotMargin &&
      mouseX < plotMargin + plotSize && mouseY > plotMargin && mouseY < plotMargin + plotSize) {
    let x1 = map(mouseX, plotMargin, plotMargin + plotSize, -5, 5);
    let x2 = map(mouseY, plotMargin + plotSize, plotMargin, -5, 5);
    dataPoints.push({ x1: x1, x2: x2, label: nextPointClass });
  }
}

function mouseDragged() {
  if (isDraggingWeight) {
    let cx = plotMargin + plotSize / 2;
    let cy = plotMargin + plotSize / 2;

    let dx = mouseX - cx;
    let dy = -(mouseY - cy);  // Flip y

    let len = sqrt(dx * dx + dy * dy);
    if (len > 10) {
      w1 = dx / len * 2;  // Normalize and scale
      w2 = dy / len * 2;
    }
  }
}

function mouseReleased() {
  isDraggingWeight = false;
}

function keyPressed() {
  if (key === ' ' && addPointMode) {
    nextPointClass = nextPointClass === 1 ? -1 : 1;
    return false;  // Prevent scrolling
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  biasSlider.size(canvasWidth - sliderLeftMargin - margin);
  plotSize = drawHeight - 2 * plotMargin;
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
