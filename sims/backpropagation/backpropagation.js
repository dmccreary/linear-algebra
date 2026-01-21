// Backpropagation Visualizer
// Step through gradient computation in a neural network
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Network architecture: 2 → 3 → 1
let architecture = [2, 3, 1];
let weights = [];
let biases = [];
let activations = [];
let preActivations = [];
let deltas = [];  // Error signals
let weightGrads = [];
let biasGrads = [];

// Input and target
let inputValues = [1.0, 0.5];
let targetValue = 1.0;

// State machine
let phase = 'ready';  // ready, forward, backward, complete
let currentStep = 0;
let forwardSteps = 4;  // 2 layers × 2 steps
let backwardSteps = 3;  // output error + 2 backward passes

// Animation
let isAutoRunning = false;
let autoRunSpeed = 1;
let lastStepTime = 0;

// UI elements
let forwardButton;
let backwardButton;
let resetButton;
let targetSlider;
let autoRunCheckbox;

// Node positions
let nodePositions = [];
let nodeRadius = 20;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  initializeNetwork();
  calculateNodePositions();

  // Row 1: Forward, Backward, Reset, Auto-run
  forwardButton = createButton('Forward Pass');
  forwardButton.position(10, drawHeight + 8);
  forwardButton.mousePressed(runForward);

  backwardButton = createButton('Backward Step');
  backwardButton.position(120, drawHeight + 8);
  backwardButton.mousePressed(backwardStep);

  resetButton = createButton('Reset');
  resetButton.position(240, drawHeight + 8);
  resetButton.mousePressed(resetAll);

  autoRunCheckbox = createCheckbox('Auto', false);
  autoRunCheckbox.position(305, drawHeight + 8);
  autoRunCheckbox.changed(() => { isAutoRunning = autoRunCheckbox.checked(); });

  // Row 2: Target slider
  targetSlider = createSlider(0, 1, 1.0, 0.1);
  targetSlider.position(sliderLeftMargin, drawHeight + 45);
  targetSlider.size(canvasWidth - sliderLeftMargin - margin);
  targetSlider.input(() => { targetValue = targetSlider.value(); resetAll(); });

  describe('Backpropagation visualizer showing gradient flow through a neural network', LABEL);
}

function initializeNetwork() {
  weights = [];
  biases = [];

  // Fixed weights for reproducibility
  weights.push([
    [0.5, -0.3],
    [0.2, 0.4],
    [-0.1, 0.6]
  ]);
  weights.push([
    [0.3, -0.2, 0.5]
  ]);

  biases.push([0.1, -0.1, 0.2]);
  biases.push([0.0]);

  resetActivations();
}

function resetActivations() {
  activations = [[...inputValues], null, null];
  preActivations = [null, null];
  deltas = [null, null];
  weightGrads = [null, null];
  biasGrads = [null, null];
  phase = 'ready';
  currentStep = 0;
}

function runForward() {
  if (phase !== 'ready') return;

  // Compute full forward pass
  let a = [...inputValues];
  activations[0] = a;

  for (let l = 0; l < weights.length; l++) {
    let W = weights[l];
    let b = biases[l];
    let z = [];
    let aNext = [];

    // z = Wa + b
    for (let i = 0; i < W.length; i++) {
      let sum = 0;
      for (let j = 0; j < W[i].length; j++) {
        sum += W[i][j] * a[j];
      }
      sum += b[i];
      z.push(sum);

      // Activation (ReLU for hidden, sigmoid for output)
      if (l === weights.length - 1) {
        aNext.push(sigmoid(sum));
      } else {
        aNext.push(relu(sum));
      }
    }

    preActivations[l] = z;
    activations[l + 1] = aNext;
    a = aNext;
  }

  phase = 'forward';
  currentStep = 0;
}

function backwardStep() {
  if (phase === 'ready') {
    runForward();
    return;
  }

  if (phase === 'complete') return;

  let L = weights.length;

  if (currentStep === 0) {
    // Compute output error
    let output = activations[L][0];
    let error = output - targetValue;
    let sigmoidDeriv = output * (1 - output);
    deltas[L - 1] = [error * sigmoidDeriv];
    currentStep++;
    phase = 'backward';
  } else if (currentStep <= L) {
    // Backward pass through layers
    let l = L - currentStep;  // Current layer (0-indexed from input)

    if (l > 0) {
      // Compute delta for hidden layer
      let delta_next = deltas[l];
      let W_next = weights[l];
      let z = preActivations[l - 1];

      let delta = [];
      for (let i = 0; i < architecture[l]; i++) {
        let sum = 0;
        for (let j = 0; j < delta_next.length; j++) {
          sum += W_next[j][i] * delta_next[j];
        }
        // Multiply by ReLU derivative
        sum *= reluDeriv(z[i]);
        delta.push(sum);
      }
      deltas[l - 1] = delta;
    }

    // Compute weight gradients for layer l
    let delta = deltas[l];
    let aPrev = activations[l];

    let dW = [];
    for (let i = 0; i < delta.length; i++) {
      let row = [];
      for (let j = 0; j < aPrev.length; j++) {
        row.push(delta[i] * aPrev[j]);
      }
      dW.push(row);
    }
    weightGrads[l] = dW;
    biasGrads[l] = [...delta];

    currentStep++;

    if (currentStep > L) {
      phase = 'complete';
    }
  }
}

function resetAll() {
  resetActivations();
  isAutoRunning = false;
  autoRunCheckbox.checked(false);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function relu(x) {
  return Math.max(0, x);
}

function reluDeriv(x) {
  return x > 0 ? 1 : 0;
}

function calculateNodePositions() {
  nodePositions = [];
  let numLayers = architecture.length;
  let layerSpacing = (canvasWidth - 250) / (numLayers - 1);
  let startX = 80;

  for (let l = 0; l < numLayers; l++) {
    let x = startX + l * layerSpacing;
    let neurons = architecture[l];
    let nodeSpacing = min(50, 150 / neurons);
    let startY = 140 - (neurons - 1) * nodeSpacing / 2;

    let positions = [];
    for (let n = 0; n < neurons; n++) {
      positions.push({ x: x, y: startY + n * nodeSpacing });
    }
    nodePositions.push(positions);
  }
}

function draw() {
  updateCanvasSize();

  // Auto-run
  if (isAutoRunning && phase !== 'complete') {
    if (millis() - lastStepTime > 1000) {
      if (phase === 'ready') {
        runForward();
      } else {
        backwardStep();
      }
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
  text('Backpropagation Step-by-Step', canvasWidth / 2, 8);

  // Draw network
  drawConnections();
  drawNodes();

  // Draw info panel
  drawInfoPanel();

  // Draw gradient equations
  if (phase === 'backward' || phase === 'complete') {
    drawGradientEquations();
  }

  // Control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Target: ' + targetValue.toFixed(1), 10, drawHeight + 55);
}

function drawConnections() {
  let L = weights.length;

  for (let l = 0; l < L; l++) {
    let fromLayer = nodePositions[l];
    let toLayer = nodePositions[l + 1];

    // Check if we should show gradients for this layer
    let showGrad = weightGrads[l] !== null;

    for (let i = 0; i < fromLayer.length; i++) {
      for (let j = 0; j < toLayer.length; j++) {
        let from = fromLayer[i];
        let to = toLayer[j];

        // Forward connections
        if (phase === 'forward' || phase === 'backward' || phase === 'complete') {
          stroke(100, 150, 200);
          strokeWeight(2);
          line(from.x + nodeRadius, from.y, to.x - nodeRadius, to.y);

          // Weight value
          let midX = (from.x + to.x) / 2;
          let midY = (from.y + to.y) / 2 - 8;
          noStroke();
          fill(80);
          textSize(9);
          textAlign(CENTER, CENTER);
          text(weights[l][j][i].toFixed(2), midX, midY);
        } else {
          stroke(200);
          strokeWeight(1);
          line(from.x + nodeRadius, from.y, to.x - nodeRadius, to.y);
        }

        // Gradient arrows (backward)
        if (showGrad) {
          let grad = weightGrads[l][j][i];
          let gradColor = grad > 0 ? color(200, 50, 50) : color(50, 50, 200);

          stroke(gradColor);
          strokeWeight(2);

          // Draw backward arrow
          let arrowLen = min(20, abs(grad) * 30);
          let dirX = from.x - to.x;
          let dirY = from.y - to.y;
          let len = sqrt(dirX * dirX + dirY * dirY);
          dirX /= len;
          dirY /= len;

          let startArrow = { x: to.x - nodeRadius - 5, y: to.y };
          push();
          translate(startArrow.x, startArrow.y);
          rotate(atan2(dirY, dirX));
          line(0, 0, arrowLen, 0);
          fill(gradColor);
          noStroke();
          triangle(arrowLen, 0, arrowLen - 5, -3, arrowLen - 5, 3);
          pop();

          // Gradient value
          let gradX = (from.x + to.x) / 2;
          let gradY = (from.y + to.y) / 2 + 8;
          noStroke();
          fill(gradColor);
          textSize(8);
          text('∂:' + grad.toFixed(3), gradX, gradY);
        }
      }
    }
  }
}

function drawNodes() {
  let L = architecture.length;

  for (let l = 0; l < L; l++) {
    let layer = nodePositions[l];
    let isOutput = (l === L - 1);

    for (let n = 0; n < layer.length; n++) {
      let pos = layer[n];
      let hasValue = activations[l] !== null;
      let hasDelta = (l > 0 && deltas[l - 1] !== null);

      // Node color
      if (isOutput && phase !== 'ready') {
        fill(220, 150, 150);
      } else if (l === 0) {
        fill(150, 220, 150);
      } else if (hasValue) {
        fill(150, 180, 220);
      } else {
        fill(230);
      }

      stroke(100);
      strokeWeight(2);
      ellipse(pos.x, pos.y, nodeRadius * 2, nodeRadius * 2);

      // Activation value
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(10);

      if (hasValue) {
        text(activations[l][n].toFixed(2), pos.x, pos.y);
      }

      // Delta value (error signal)
      if (hasDelta) {
        let delta = deltas[l - 1][n];
        fill(delta > 0 ? color(200, 50, 50) : color(50, 50, 200));
        textSize(9);
        text('δ=' + delta.toFixed(3), pos.x, pos.y - nodeRadius - 12);
      }
    }

    // Layer labels
    noStroke();
    fill(80);
    textAlign(CENTER, TOP);
    textSize(11);
    let labelY = nodePositions[l][nodePositions[l].length - 1].y + nodeRadius + 15;

    if (l === 0) text('Input', nodePositions[l][0].x, labelY);
    else if (isOutput) text('Output', nodePositions[l][0].x, labelY);
    else text('Hidden', nodePositions[l][0].x, labelY);
  }
}

function drawInfoPanel() {
  let boxX = canvasWidth - 160;
  let boxY = 40;
  let boxW = 150;
  let boxH = 120;

  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 8);

  noStroke();
  fill(50);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Status', boxX + 10, boxY + 10);
  textStyle(NORMAL);

  textSize(10);
  let y = boxY + 30;

  // Phase indicator
  fill(80);
  text('Phase: ' + phase, boxX + 10, y);
  y += 18;

  // Output and target
  if (phase !== 'ready') {
    let output = activations[architecture.length - 1][0];
    text('Output: ' + output.toFixed(4), boxX + 10, y);
    y += 15;
    text('Target: ' + targetValue.toFixed(4), boxX + 10, y);
    y += 15;

    // Loss
    let loss = 0.5 * Math.pow(output - targetValue, 2);
    fill(150, 50, 50);
    text('Loss: ' + loss.toFixed(4), boxX + 10, y);
    y += 18;

    // Error
    fill(80);
    let error = output - targetValue;
    text('Error: ' + error.toFixed(4), boxX + 10, y);
  }
}

function drawGradientEquations() {
  let boxY = 280;

  fill(255, 255, 255, 240);
  stroke(200);
  rect(10, boxY, canvasWidth - 20, 110, 8);

  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  textStyle(BOLD);
  fill(50);
  text('Gradient Computation (Chain Rule)', canvasWidth / 2, boxY + 8);
  textStyle(NORMAL);

  textSize(10);
  fill(80);
  textAlign(LEFT, TOP);

  let y = boxY + 28;

  // Show the chain rule
  text('δᴸ = (output - target) × σ\'(zᴸ)', 20, y);
  y += 16;
  text('δˡ = (Wˡ⁺¹)ᵀ δˡ⁺¹ ⊙ σ\'(zˡ)', 20, y);
  y += 16;
  text('∂L/∂W = δ × aᵀ', 20, y);
  y += 20;

  // Current step info
  fill(100);
  if (phase === 'backward') {
    text('Step ' + currentStep + ': Computing gradients...', 20, y);
  } else if (phase === 'complete') {
    fill(0, 120, 0);
    text('Complete! All gradients computed.', 20, y);
  }

  // Show actual gradient values
  if (weightGrads[1] !== null) {
    let rightX = canvasWidth / 2 + 20;
    y = boxY + 28;
    fill(150, 50, 50);
    text('∂L/∂W² = [' + weightGrads[1][0].map(g => g.toFixed(3)).join(', ') + ']', rightX, y);
  }
  if (weightGrads[0] !== null) {
    y += 16;
    fill(50, 50, 150);
    textSize(9);
    text('∂L/∂W¹ computed (3×2 matrix)', canvasWidth / 2 + 20, y);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  calculateNodePositions();
  targetSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
