// Neural Network Layer Forward Pass Visualizer
// Shows how matrix-vector multiplication implements a neural network layer,
// connecting abstract matrix operations to concrete deep learning computations.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let defaultTextSize = 16;

// Network architecture
let numInputs = 3;
let numOutputs = 2;
let activationFunc = 'relu';

// Network data
let inputs = [];
let weights = [];
let biases = [];
let preActivation = [];
let outputs = [];

// UI elements
let inputsSlider;
let outputsSlider;
let activationSelect;
let randomWeightsButton;
let randomInputsButton;
let showBiasCheckbox;

// Display settings
let showBias = true;

// Layout
let neuronRadius = 20;
let layerGap = 150;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Initialize network
  initializeNetwork();

  // Create input slider
  inputsSlider = createSlider(2, 5, 3, 1);
  inputsSlider.position(10, drawHeight + 8);
  inputsSlider.size(80);
  inputsSlider.input(onInputsChange);

  // Create output slider
  outputsSlider = createSlider(2, 4, 2, 1);
  outputsSlider.position(130, drawHeight + 8);
  outputsSlider.size(80);
  outputsSlider.input(onOutputsChange);

  // Create activation selector
  activationSelect = createSelect();
  activationSelect.option('None', 'none');
  activationSelect.option('ReLU', 'relu');
  activationSelect.option('Sigmoid', 'sigmoid');
  activationSelect.option('Tanh', 'tanh');
  activationSelect.selected('relu');
  activationSelect.position(250, drawHeight + 8);
  activationSelect.changed(onActivationChange);

  // Create buttons
  randomWeightsButton = createButton('Random W');
  randomWeightsButton.position(10, drawHeight + 43);
  randomWeightsButton.mousePressed(randomizeWeights);

  randomInputsButton = createButton('Random X');
  randomInputsButton.position(100, drawHeight + 43);
  randomInputsButton.mousePressed(randomizeInputs);

  // Create bias checkbox
  showBiasCheckbox = createCheckbox(' Show Bias', true);
  showBiasCheckbox.position(190, drawHeight + 43);
  showBiasCheckbox.changed(() => {
    showBias = showBiasCheckbox.checked();
    computeOutput();
  });

  describe('Neural network layer visualization showing input neurons, weight matrix as connections, and output neurons with activation functions.', LABEL);
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
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Neural Network Layer: h = σ(Wx + b)', canvasWidth / 2, 8);

  // Calculate positions
  let inputX = 80;
  let outputX = canvasWidth - 80;
  let centerY = drawHeight / 2 + 10;

  // Draw connections (weights)
  drawConnections(inputX, outputX, centerY);

  // Draw input layer
  drawInputLayer(inputX, centerY);

  // Draw output layer
  drawOutputLayer(outputX, centerY);

  // Draw formula
  drawFormula();

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(11);
  text('Inputs: ' + numInputs, 10, drawHeight + 30);
  text('Outputs: ' + numOutputs, 130, drawHeight + 30);
}

function drawInputLayer(x, centerY) {
  let startY = centerY - ((numInputs - 1) * 50) / 2;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Input x', x, 30);

  for (let i = 0; i < numInputs; i++) {
    let y = startY + i * 50;

    // Neuron circle
    fill('lightblue');
    stroke('steelblue');
    strokeWeight(2);
    ellipse(x, y, neuronRadius * 2, neuronRadius * 2);

    // Value
    fill('black');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(inputs[i].toFixed(2), x, y);

    // Label
    fill('steelblue');
    textSize(10);
    text('x' + (i + 1), x - neuronRadius - 15, y);
  }
}

function drawOutputLayer(x, centerY) {
  let startY = centerY - ((numOutputs - 1) * 60) / 2;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Output h', x, 30);

  for (let i = 0; i < numOutputs; i++) {
    let y = startY + i * 60;

    // Pre-activation box
    let preVal = preActivation[i];
    let outVal = outputs[i];

    // Neuron circle
    let neuronColor = outVal > 0 ? color(100, 200, 100) : color(200, 100, 100);
    fill(neuronColor);
    stroke('seagreen');
    strokeWeight(2);
    ellipse(x, y, neuronRadius * 2, neuronRadius * 2);

    // Output value
    fill('black');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    text(outVal.toFixed(2), x, y);

    // Label
    fill('seagreen');
    textSize(10);
    text('h' + (i + 1), x + neuronRadius + 15, y);

    // Pre-activation annotation
    fill('gray');
    textSize(9);
    textAlign(LEFT, CENTER);
    text('pre: ' + preVal.toFixed(2), x + neuronRadius + 10, y + 15);
  }

  // Activation function indicator
  fill('purple');
  textSize(10);
  textAlign(CENTER, BOTTOM);
  text('σ = ' + activationFunc, x, drawHeight - 50);
}

function drawConnections(inputX, outputX, centerY) {
  let inputStartY = centerY - ((numInputs - 1) * 50) / 2;
  let outputStartY = centerY - ((numOutputs - 1) * 60) / 2;

  for (let i = 0; i < numOutputs; i++) {
    let outY = outputStartY + i * 60;

    for (let j = 0; j < numInputs; j++) {
      let inY = inputStartY + j * 50;
      let w = weights[i][j];

      // Line color and thickness based on weight
      let absW = abs(w);
      let thickness = map(absW, 0, 1, 0.5, 4);

      if (w > 0) {
        stroke(0, 100, 200, map(absW, 0, 1, 50, 200));  // Blue for positive
      } else {
        stroke(200, 50, 50, map(absW, 0, 1, 50, 200));  // Red for negative
      }
      strokeWeight(thickness);
      line(inputX + neuronRadius, inY, outputX - neuronRadius, outY);
    }

    // Bias connection (from above)
    if (showBias) {
      let b = biases[i];
      let absB = abs(b);
      strokeWeight(map(absB, 0, 1, 0.5, 3));
      if (b > 0) {
        stroke(0, 150, 0, 150);  // Green for positive bias
      } else {
        stroke(150, 0, 150, 150);  // Purple for negative bias
      }
      let biasY = 60;
      line(outputX, biasY, outputX, outY - neuronRadius);

      // Bias node
      fill('white');
      stroke(b > 0 ? 'green' : 'purple');
      strokeWeight(1);
      ellipse(outputX, biasY, 15, 15);
      fill('gray');
      noStroke();
      textSize(8);
      textAlign(CENTER, CENTER);
      text('b', outputX, biasY);
    }
  }

  // Weight matrix label
  fill('gray');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);
  text('W (' + numOutputs + '×' + numInputs + ')', (inputX + outputX) / 2, 50);
}

function drawFormula() {
  let y = drawHeight - 30;

  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);

  // Build formula string
  let formulaStr = 'h = σ(Wx';
  if (showBias) formulaStr += ' + b';
  formulaStr += ')';

  text(formulaStr, canvasWidth / 2, y);

  // Show activation function formula
  fill('gray');
  textSize(9);
  let actFormula = '';
  switch (activationFunc) {
    case 'relu': actFormula = 'σ(z) = max(0, z)'; break;
    case 'sigmoid': actFormula = 'σ(z) = 1/(1+e^(-z))'; break;
    case 'tanh': actFormula = 'σ(z) = tanh(z)'; break;
    default: actFormula = 'σ(z) = z';
  }
  text(actFormula, canvasWidth / 2, y + 15);
}

function initializeNetwork() {
  randomizeInputs();
  randomizeWeights();
}

function randomizeInputs() {
  inputs = [];
  for (let i = 0; i < numInputs; i++) {
    inputs.push(random(0, 1));
  }
  computeOutput();
}

function randomizeWeights() {
  weights = [];
  biases = [];
  for (let i = 0; i < numOutputs; i++) {
    weights[i] = [];
    for (let j = 0; j < numInputs; j++) {
      weights[i][j] = random(-1, 1);
    }
    biases[i] = random(-0.5, 0.5);
  }
  computeOutput();
}

function computeOutput() {
  preActivation = [];
  outputs = [];

  for (let i = 0; i < numOutputs; i++) {
    // Compute Wx + b
    let sum = showBias ? biases[i] : 0;
    for (let j = 0; j < numInputs; j++) {
      sum += weights[i][j] * inputs[j];
    }
    preActivation[i] = sum;

    // Apply activation
    outputs[i] = applyActivation(sum);
  }
}

function applyActivation(z) {
  switch (activationFunc) {
    case 'relu':
      return max(0, z);
    case 'sigmoid':
      return 1 / (1 + exp(-z));
    case 'tanh':
      return (exp(z) - exp(-z)) / (exp(z) + exp(-z));
    default:
      return z;
  }
}

function onInputsChange() {
  numInputs = inputsSlider.value();
  initializeNetwork();
}

function onOutputsChange() {
  numOutputs = outputsSlider.value();
  initializeNetwork();
}

function onActivationChange() {
  activationFunc = activationSelect.value();
  computeOutput();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
