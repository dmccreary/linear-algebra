// Neural Network Architecture Visualizer
// Visualize network structure and weight matrix dimensions
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Network architecture
let inputNeurons = 4;
let hiddenLayers = 2;
let hiddenNeurons = 8;
let outputNeurons = 2;

// UI elements
let inputSlider;
let hiddenLayersSlider;
let hiddenNeuronsSlider;
let outputSlider;
let showDimensionsCheckbox;

// Visualization settings
let nodeRadius = 15;
let maxNodesDisplay = 8;  // Max nodes to display per layer

// Animation
let highlightedLayer = -1;
let animationPhase = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Input and Hidden Layers sliders
  inputSlider = createSlider(1, 10, inputNeurons, 1);
  inputSlider.position(sliderLeftMargin, drawHeight + 8);
  inputSlider.size(100);
  inputSlider.input(() => { inputNeurons = inputSlider.value(); });

  hiddenLayersSlider = createSlider(1, 5, hiddenLayers, 1);
  hiddenLayersSlider.position(sliderLeftMargin + 180, drawHeight + 8);
  hiddenLayersSlider.size(80);
  hiddenLayersSlider.input(() => { hiddenLayers = hiddenLayersSlider.value(); });

  // Row 2: Hidden neurons and Output sliders
  hiddenNeuronsSlider = createSlider(1, 16, hiddenNeurons, 1);
  hiddenNeuronsSlider.position(sliderLeftMargin, drawHeight + 45);
  hiddenNeuronsSlider.size(100);
  hiddenNeuronsSlider.input(() => { hiddenNeurons = hiddenNeuronsSlider.value(); });

  outputSlider = createSlider(1, 10, outputNeurons, 1);
  outputSlider.position(sliderLeftMargin + 180, drawHeight + 45);
  outputSlider.size(80);
  outputSlider.input(() => { outputNeurons = outputSlider.value(); });

  showDimensionsCheckbox = createCheckbox('Show Dims', true);
  showDimensionsCheckbox.position(canvasWidth - 100, drawHeight + 25);

  describe('Neural network architecture visualizer showing layers and weight matrix dimensions', LABEL);
}

function draw() {
  updateCanvasSize();
  animationPhase += 0.02;

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
  text('Neural Network Architecture', canvasWidth / 2, 8);

  // Build architecture array
  let architecture = buildArchitecture();

  // Draw network
  drawNetwork(architecture);

  // Draw parameter summary
  drawParameterSummary(architecture);

  // Draw control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Input: ' + inputNeurons, 10, drawHeight + 18);
  text('Hidden Layers: ' + hiddenLayers, sliderLeftMargin + 115, drawHeight + 18);
  text('Hidden: ' + hiddenNeurons, 10, drawHeight + 55);
  text('Output: ' + outputNeurons, sliderLeftMargin + 115, drawHeight + 55);
}

function buildArchitecture() {
  let arch = [inputNeurons];
  for (let i = 0; i < hiddenLayers; i++) {
    arch.push(hiddenNeurons);
  }
  arch.push(outputNeurons);
  return arch;
}

function drawNetwork(architecture) {
  let numLayers = architecture.length;
  let layerSpacing = (canvasWidth - 120) / (numLayers - 1);
  let startX = 60;

  // Calculate layer positions
  let layerPositions = [];
  for (let l = 0; l < numLayers; l++) {
    let x = startX + l * layerSpacing;
    let neurons = architecture[l];
    let displayNeurons = min(neurons, maxNodesDisplay);
    let nodeSpacing = min(30, (drawHeight - 120) / (displayNeurons + 1));
    let startY = (drawHeight - 40) / 2 - (displayNeurons - 1) * nodeSpacing / 2;

    let positions = [];
    for (let n = 0; n < displayNeurons; n++) {
      let y = startY + n * nodeSpacing;
      positions.push({ x: x, y: y, visible: true });
    }

    // Add indicator for hidden neurons
    if (neurons > maxNodesDisplay) {
      positions.hasMore = true;
      positions.totalNeurons = neurons;
    }

    layerPositions.push(positions);
  }

  // Draw connections (edges)
  for (let l = 0; l < numLayers - 1; l++) {
    let fromLayer = layerPositions[l];
    let toLayer = layerPositions[l + 1];

    // Determine if this layer is highlighted
    let isHighlighted = (highlightedLayer === l);

    for (let i = 0; i < fromLayer.length; i++) {
      for (let j = 0; j < toLayer.length; j++) {
        let from = fromLayer[i];
        let to = toLayer[j];

        // Animated pulse effect
        let pulseAlpha = 50 + 30 * sin(animationPhase + i * 0.3 + j * 0.2);

        if (isHighlighted) {
          stroke(100, 150, 255, 200);
          strokeWeight(2);
        } else {
          stroke(150, 150, 150, pulseAlpha);
          strokeWeight(1);
        }
        line(from.x + nodeRadius, from.y, to.x - nodeRadius, to.y);
      }
    }

    // Show weight matrix dimensions
    if (showDimensionsCheckbox.checked()) {
      let midX = (layerPositions[l][0].x + layerPositions[l + 1][0].x) / 2;
      let midY = 55;

      let fromSize = architecture[l];
      let toSize = architecture[l + 1];

      noStroke();
      fill(70, 130, 180);
      textAlign(CENTER, CENTER);
      textSize(11);

      // Weight matrix dimensions
      let dimText = 'W: ' + toSize + '×' + fromSize;
      text(dimText, midX, midY);

      // Bias dimensions
      fill(150, 100, 50);
      text('b: ' + toSize + '×1', midX, midY + 14);
    }
  }

  // Draw neurons (nodes)
  for (let l = 0; l < numLayers; l++) {
    let layer = layerPositions[l];
    let isInput = (l === 0);
    let isOutput = (l === numLayers - 1);

    for (let n = 0; n < layer.length; n++) {
      let pos = layer[n];

      // Node color based on layer type
      if (isInput) {
        fill(100, 200, 100);  // Green for input
      } else if (isOutput) {
        fill(200, 100, 100);  // Red for output
      } else {
        fill(100, 150, 255);  // Blue for hidden
      }

      stroke(50);
      strokeWeight(2);
      ellipse(pos.x, pos.y, nodeRadius * 2, nodeRadius * 2);
    }

    // Draw "..." indicator if more neurons
    if (layer.hasMore) {
      noStroke();
      fill(100);
      textAlign(CENTER, CENTER);
      textSize(16);
      text('...', layer[0].x, layer[layer.length - 1].y + 30);
      textSize(10);
      text('(' + layer.totalNeurons + ' total)', layer[0].x, layer[layer.length - 1].y + 45);
    }

    // Layer labels
    noStroke();
    fill(80);
    textAlign(CENTER, TOP);
    textSize(12);

    let labelY = drawHeight - 55;
    if (isInput) {
      text('Input', layer[0].x, labelY);
      text('(' + architecture[l] + ')', layer[0].x, labelY + 14);
    } else if (isOutput) {
      text('Output', layer[0].x, labelY);
      text('(' + architecture[l] + ')', layer[0].x, labelY + 14);
    } else {
      text('Hidden ' + l, layer[0].x, labelY);
      text('(' + architecture[l] + ')', layer[0].x, labelY + 14);
    }
  }

  // Draw activation function labels
  textSize(10);
  fill(100, 100, 150);
  for (let l = 1; l < numLayers; l++) {
    let x = layerPositions[l][0].x;
    let y = 38;
    let activation = (l === numLayers - 1) ? 'softmax' : 'ReLU';
    text('σ: ' + activation, x, y);
  }
}

function drawParameterSummary(architecture) {
  // Calculate total parameters
  let totalWeights = 0;
  let totalBiases = 0;

  for (let l = 0; l < architecture.length - 1; l++) {
    let fromSize = architecture[l];
    let toSize = architecture[l + 1];
    totalWeights += fromSize * toSize;
    totalBiases += toSize;
  }

  let totalParams = totalWeights + totalBiases;

  // Draw summary box
  let boxX = 10;
  let boxY = 70;
  let boxW = 110;
  let boxH = 70;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 5);

  noStroke();
  fill(50);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Parameters', boxX + 8, boxY + 8);
  textStyle(NORMAL);

  textSize(10);
  text('Weights: ' + totalWeights.toLocaleString(), boxX + 8, boxY + 25);
  text('Biases: ' + totalBiases.toLocaleString(), boxX + 8, boxY + 38);

  fill(70, 130, 180);
  textStyle(BOLD);
  text('Total: ' + totalParams.toLocaleString(), boxX + 8, boxY + 53);
  textStyle(NORMAL);
}

function mousePressed() {
  // Check if clicking on a layer connection to highlight it
  let architecture = buildArchitecture();
  let numLayers = architecture.length;
  let layerSpacing = (canvasWidth - 120) / (numLayers - 1);
  let startX = 60;

  for (let l = 0; l < numLayers - 1; l++) {
    let midX = startX + l * layerSpacing + layerSpacing / 2;
    if (abs(mouseX - midX) < layerSpacing / 3 && mouseY < drawHeight) {
      highlightedLayer = (highlightedLayer === l) ? -1 : l;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  showDimensionsCheckbox.position(canvasWidth - 100, drawHeight + 25);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
