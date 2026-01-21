// Forward Propagation Visualizer
// Step through data flow in a neural network
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Network architecture: 2 → 3 → 2
let architecture = [2, 3, 2];
let weights = [];
let biases = [];
let activations = [];  // a[l] for each layer
let preActivations = [];  // z[l] for each layer

// Input values
let inputValues = [1.0, 0.5];

// Animation state
let currentStep = 0;
let maxSteps;
let isAutoRunning = false;
let autoRunSpeed = 1;
let lastStepTime = 0;

// UI elements
let stepButton;
let resetButton;
let autoRunCheckbox;
let speedSlider;
let input1Slider;
let input2Slider;

// Node positions for visualization
let nodePositions = [];
let nodeRadius = 20;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // Initialize network
  initializeNetwork();
  calculateNodePositions();

  // Row 1: Step, Reset, Auto-run
  stepButton = createButton('Next Step');
  stepButton.position(10, drawHeight + 8);
  stepButton.mousePressed(nextStep);

  resetButton = createButton('Reset');
  resetButton.position(100, drawHeight + 8);
  resetButton.mousePressed(resetNetwork);

  autoRunCheckbox = createCheckbox('Auto Run', false);
  autoRunCheckbox.position(165, drawHeight + 8);
  autoRunCheckbox.changed(() => { isAutoRunning = autoRunCheckbox.checked(); });

  speedSlider = createSlider(0.5, 3, 1, 0.1);
  speedSlider.position(290, drawHeight + 8);
  speedSlider.size(80);

  // Row 2: Input sliders
  input1Slider = createSlider(-2, 2, 1.0, 0.1);
  input1Slider.position(sliderLeftMargin, drawHeight + 45);
  input1Slider.size(100);
  input1Slider.input(updateInputs);

  input2Slider = createSlider(-2, 2, 0.5, 0.1);
  input2Slider.position(sliderLeftMargin + 160, drawHeight + 45);
  input2Slider.size(100);
  input2Slider.input(updateInputs);

  describe('Forward propagation visualizer showing step-by-step data flow through a neural network', LABEL);
}

function initializeNetwork() {
  weights = [];
  biases = [];

  // Initialize with small random weights
  for (let l = 0; l < architecture.length - 1; l++) {
    let nin = architecture[l];
    let nout = architecture[l + 1];

    // Weight matrix: nout x nin
    let W = [];
    for (let i = 0; i < nout; i++) {
      let row = [];
      for (let j = 0; j < nin; j++) {
        row.push(round(random(-1, 1) * 10) / 10);
      }
      W.push(row);
    }
    weights.push(W);

    // Bias vector: nout
    let b = [];
    for (let i = 0; i < nout; i++) {
      b.push(round(random(-0.5, 0.5) * 10) / 10);
    }
    biases.push(b);
  }

  // Calculate max steps: for each layer we have z computation and activation
  maxSteps = (architecture.length - 1) * 2;

  resetActivations();
}

function resetActivations() {
  activations = [];
  preActivations = [];

  // Set input layer activations
  activations.push([...inputValues]);

  // Initialize empty arrays for other layers
  for (let l = 1; l < architecture.length; l++) {
    activations.push(new Array(architecture[l]).fill(null));
    preActivations.push(new Array(architecture[l]).fill(null));
  }

  currentStep = 0;
}

function updateInputs() {
  inputValues = [input1Slider.value(), input2Slider.value()];
  resetActivations();
}

function calculateNodePositions() {
  nodePositions = [];
  let numLayers = architecture.length;
  let layerSpacing = (canvasWidth - 200) / (numLayers - 1);
  let startX = 80;

  for (let l = 0; l < numLayers; l++) {
    let x = startX + l * layerSpacing;
    let neurons = architecture[l];
    let nodeSpacing = min(50, 180 / neurons);
    let startY = 150 - (neurons - 1) * nodeSpacing / 2;

    let positions = [];
    for (let n = 0; n < neurons; n++) {
      positions.push({ x: x, y: startY + n * nodeSpacing });
    }
    nodePositions.push(positions);
  }
}

function nextStep() {
  if (currentStep >= maxSteps) return;

  let layerIndex = Math.floor(currentStep / 2);
  let isZStep = currentStep % 2 === 0;

  if (isZStep) {
    // Compute z = W*a + b
    computePreActivation(layerIndex);
  } else {
    // Apply activation function
    applyActivation(layerIndex);
  }

  currentStep++;
}

function computePreActivation(layerIndex) {
  let W = weights[layerIndex];
  let b = biases[layerIndex];
  let a = activations[layerIndex];
  let z = [];

  for (let i = 0; i < W.length; i++) {
    let sum = 0;
    for (let j = 0; j < W[i].length; j++) {
      sum += W[i][j] * a[j];
    }
    sum += b[i];
    z.push(sum);
  }

  preActivations[layerIndex] = z;
}

function applyActivation(layerIndex) {
  let z = preActivations[layerIndex];
  let a = [];

  let isOutputLayer = layerIndex === architecture.length - 2;

  for (let i = 0; i < z.length; i++) {
    if (isOutputLayer) {
      // Softmax for output layer (simplified: just use sigmoid)
      a.push(1 / (1 + Math.exp(-z[i])));
    } else {
      // ReLU for hidden layers
      a.push(Math.max(0, z[i]));
    }
  }

  activations[layerIndex + 1] = a;
}

function resetNetwork() {
  initializeNetwork();
  isAutoRunning = false;
  autoRunCheckbox.checked(false);
}

function draw() {
  updateCanvasSize();

  // Auto-run logic
  if (isAutoRunning && currentStep < maxSteps) {
    let interval = 1000 / speedSlider.value();
    if (millis() - lastStepTime > interval) {
      nextStep();
      lastStepTime = millis();
    }
  }

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
  text('Forward Propagation Step-by-Step', canvasWidth / 2, 8);

  // Draw network
  drawConnections();
  drawNodes();

  // Draw current operation info
  drawOperationInfo();

  // Draw matrix equation
  drawMatrixEquation();

  // Control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Speed:', 255, drawHeight + 18);
  text('x₁: ' + inputValues[0].toFixed(1), 10, drawHeight + 55);
  text('x₂: ' + inputValues[1].toFixed(1), sliderLeftMargin + 115, drawHeight + 55);

  // Step counter
  textAlign(RIGHT, CENTER);
  text('Step: ' + currentStep + '/' + maxSteps, canvasWidth - 10, drawHeight + 55);
}

function drawConnections() {
  let currentLayer = Math.floor(currentStep / 2);
  let isZStep = currentStep % 2 === 0 || currentStep === 0;

  for (let l = 0; l < architecture.length - 1; l++) {
    let fromLayer = nodePositions[l];
    let toLayer = nodePositions[l + 1];

    for (let i = 0; i < fromLayer.length; i++) {
      for (let j = 0; j < toLayer.length; j++) {
        let from = fromLayer[i];
        let to = toLayer[j];

        // Highlight current layer connections
        if (l === currentLayer && isZStep && currentStep > 0) {
          stroke(100, 200, 100, 200);
          strokeWeight(3);
        } else if (l < currentLayer || (l === currentLayer && !isZStep)) {
          stroke(100, 150, 200, 150);
          strokeWeight(2);
        } else {
          stroke(200, 200, 200, 100);
          strokeWeight(1);
        }

        line(from.x + nodeRadius, from.y, to.x - nodeRadius, to.y);

        // Show weight value on highlighted connections
        if (l === currentLayer && isZStep && currentStep > 0) {
          let midX = (from.x + to.x) / 2;
          let midY = (from.y + to.y) / 2 - 5;
          noStroke();
          fill(50, 100, 50);
          textSize(9);
          textAlign(CENTER, CENTER);
          text(weights[l][j][i].toFixed(1), midX, midY);
        }
      }
    }
  }
}

function drawNodes() {
  let currentLayer = Math.floor(currentStep / 2);
  let isZStep = currentStep % 2 === 0;

  for (let l = 0; l < architecture.length; l++) {
    let layer = nodePositions[l];

    for (let n = 0; n < layer.length; n++) {
      let pos = layer[n];

      // Determine node state and color
      let isHighlighted = false;
      let hasValue = false;
      let value = null;
      let zValue = null;

      if (l === 0) {
        // Input layer always has values
        hasValue = true;
        value = activations[0][n];
      } else {
        // Check if this layer has been computed
        let layerStep = l - 1;
        if (layerStep < currentLayer || (layerStep === currentLayer && !isZStep)) {
          hasValue = true;
          value = activations[l][n];
        }
        if (layerStep < currentLayer || (layerStep === currentLayer && isZStep && currentStep > 0)) {
          zValue = preActivations[layerStep] ? preActivations[layerStep][n] : null;
        }

        // Highlight current computation layer
        if (layerStep === currentLayer) {
          isHighlighted = true;
        }
      }

      // Draw node
      if (isHighlighted) {
        fill(255, 255, 150);
        stroke(255, 200, 0);
        strokeWeight(3);
      } else if (hasValue) {
        if (l === 0) {
          fill(150, 220, 150);
        } else if (l === architecture.length - 1) {
          fill(220, 150, 150);
        } else {
          fill(150, 180, 220);
        }
        stroke(100);
        strokeWeight(2);
      } else {
        fill(230);
        stroke(180);
        strokeWeight(1);
      }

      ellipse(pos.x, pos.y, nodeRadius * 2, nodeRadius * 2);

      // Draw value
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(11);

      if (value !== null) {
        text(value.toFixed(2), pos.x, pos.y);
      }

      // Draw z value above if in z-computation step
      if (zValue !== null && isHighlighted && isZStep) {
        fill(100, 100, 50);
        textSize(9);
        text('z=' + zValue.toFixed(2), pos.x, pos.y - nodeRadius - 10);
      }
    }

    // Layer labels
    noStroke();
    fill(80);
    textAlign(CENTER, TOP);
    textSize(11);
    let labelY = nodePositions[l][nodePositions[l].length - 1].y + nodeRadius + 10;

    if (l === 0) {
      text('Input', nodePositions[l][0].x, labelY);
    } else if (l === architecture.length - 1) {
      text('Output', nodePositions[l][0].x, labelY);
    } else {
      text('Hidden ' + l, nodePositions[l][0].x, labelY);
    }
  }
}

function drawOperationInfo() {
  let boxX = canvasWidth - 170;
  let boxY = 40;
  let boxW = 160;
  let boxH = 90;

  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 8);

  noStroke();
  fill(50);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Current Step:', boxX + 10, boxY + 10);
  textStyle(NORMAL);

  let currentLayer = Math.floor(currentStep / 2);
  let isZStep = currentStep % 2 === 0;

  textSize(11);
  if (currentStep === 0) {
    fill(100);
    text('Ready to start', boxX + 10, boxY + 30);
    text('Click "Next Step"', boxX + 10, boxY + 45);
  } else if (currentStep >= maxSteps) {
    fill(0, 150, 0);
    text('Complete!', boxX + 10, boxY + 30);
    text('Output computed', boxX + 10, boxY + 45);
  } else if (isZStep) {
    fill(50, 100, 50);
    text('Layer ' + (currentLayer + 1) + ':', boxX + 10, boxY + 30);
    text('Computing z = Wa + b', boxX + 10, boxY + 45);
  } else {
    fill(100, 50, 50);
    text('Layer ' + (currentLayer + 1) + ':', boxX + 10, boxY + 30);
    let activation = currentLayer === architecture.length - 2 ? 'sigmoid' : 'ReLU';
    text('Apply ' + activation + '(z)', boxX + 10, boxY + 45);
  }

  // Dimensions
  if (currentStep > 0 && currentStep < maxSteps) {
    fill(100);
    textSize(9);
    let nin = architecture[currentLayer];
    let nout = architecture[currentLayer + 1];
    text('W: ' + nout + '×' + nin + ', a: ' + nin + '×1', boxX + 10, boxY + 65);
    text('→ z: ' + nout + '×1', boxX + 10, boxY + 78);
  }
}

function drawMatrixEquation() {
  let boxY = 280;

  fill(255, 255, 255, 240);
  stroke(200);
  rect(10, boxY, canvasWidth - 20, 120, 8);

  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  textStyle(BOLD);
  fill(50);
  text('Matrix Computation', canvasWidth / 2, boxY + 8);
  textStyle(NORMAL);

  let currentLayer = Math.floor(currentStep / 2);
  if (currentStep === 0 || currentStep >= maxSteps) {
    fill(100);
    textSize(11);
    text('Press "Next Step" to see computations', canvasWidth / 2, boxY + 50);
    return;
  }

  // Show the equation for current layer
  let W = weights[currentLayer];
  let b = biases[currentLayer];
  let a = activations[currentLayer];
  let z = preActivations[currentLayer];

  textSize(10);
  fill(50);

  // Position for matrices
  let startX = 30;
  let matY = boxY + 35;

  // z vector (result)
  text('z =', startX, matY + 15);

  // W matrix
  drawMatrix(W, startX + 25, matY, 'W');

  // a vector
  let wWidth = W[0].length * 28 + 10;
  text('×', startX + 30 + wWidth, matY + 15);
  drawVector(a, startX + 45 + wWidth, matY, 'a');

  // + b
  text('+', startX + 75 + wWidth, matY + 15);
  drawVector(b, startX + 90 + wWidth, matY, 'b');

  // = z result
  if (z && z[0] !== null) {
    text('=', startX + 120 + wWidth, matY + 15);
    drawVector(z, startX + 135 + wWidth, matY, 'z', true);
  }
}

function drawMatrix(M, x, y, label) {
  let rows = M.length;
  let cols = M[0].length;
  let cellW = 28;
  let cellH = 20;

  // Brackets
  stroke(100);
  strokeWeight(1);
  line(x, y, x, y + rows * cellH);
  line(x, y, x + 5, y);
  line(x, y + rows * cellH, x + 5, y + rows * cellH);

  let endX = x + cols * cellW + 5;
  line(endX, y, endX, y + rows * cellH);
  line(endX - 5, y, endX, y);
  line(endX - 5, y + rows * cellH, endX, y + rows * cellH);

  // Values
  noStroke();
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(9);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      text(M[i][j].toFixed(1), x + 8 + j * cellW + cellW / 2, y + i * cellH + cellH / 2);
    }
  }
}

function drawVector(v, x, y, label, highlight = false) {
  let cellW = 28;
  let cellH = 20;

  // Brackets
  stroke(highlight ? color(0, 150, 0) : 100);
  strokeWeight(1);
  line(x, y, x, y + v.length * cellH);
  line(x, y, x + 5, y);
  line(x, y + v.length * cellH, x + 5, y + v.length * cellH);

  let endX = x + cellW + 5;
  line(endX, y, endX, y + v.length * cellH);
  line(endX - 5, y, endX, y);
  line(endX - 5, y + v.length * cellH, endX, y + v.length * cellH);

  // Values
  noStroke();
  fill(highlight ? color(0, 120, 0) : 50);
  textAlign(CENTER, CENTER);
  textSize(9);

  for (let i = 0; i < v.length; i++) {
    let val = v[i];
    if (val !== null) {
      text(val.toFixed(2), x + 8 + cellW / 2, y + i * cellH + cellH / 2);
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  calculateNodePositions();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
