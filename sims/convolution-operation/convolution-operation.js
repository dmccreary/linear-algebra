// Convolution Operation Visualizer
// Shows how convolution kernels slide across images
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Image dimensions
let inputSize = 7;
let inputImage = [];
let outputImage = [];

// Kernel
let kernelSize = 3;
let kernel = [];

// Convolution parameters
let stride = 1;
let padding = 0;  // 0 for valid, calculated for same

// Animation state
let currentRow = 0;
let currentCol = 0;
let isAnimating = false;
let animationSpeed = 0.5;
let lastStepTime = 0;
let convolutionComplete = false;

// UI elements
let kernelSelect;
let strideSelect;
let paddingSelect;
let stepButton;
let animateButton;
let resetButton;

// Cell size for visualization
let cellSize;

// Preset kernels
const presetKernels = {
  'Edge Detect': [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
  ],
  'Blur': [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9]
  ],
  'Sharpen': [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ],
  'Sobel X': [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ],
  'Identity': [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  // Initialize input image (checkerboard pattern)
  initializeImage();

  // Initialize kernel
  kernel = presetKernels['Edge Detect'];

  // Calculate initial output
  calculateOutputSize();
  initializeOutput();

  // Row 1: Kernel select, Stride, Padding
  kernelSelect = createSelect();
  kernelSelect.position(10, drawHeight + 8);
  for (let name in presetKernels) {
    kernelSelect.option(name);
  }
  kernelSelect.changed(changeKernel);

  strideSelect = createSelect();
  strideSelect.position(130, drawHeight + 8);
  strideSelect.option('Stride 1');
  strideSelect.option('Stride 2');
  strideSelect.changed(() => {
    stride = strideSelect.value() === 'Stride 1' ? 1 : 2;
    resetConvolution();
  });

  paddingSelect = createSelect();
  paddingSelect.position(220, drawHeight + 8);
  paddingSelect.option('Valid');
  paddingSelect.option('Same');
  paddingSelect.changed(() => {
    padding = paddingSelect.value() === 'Same' ? Math.floor(kernelSize / 2) : 0;
    resetConvolution();
  });

  // Row 2: Step, Animate, Reset buttons
  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 45);
  stepButton.mousePressed(stepConvolution);

  animateButton = createButton('Animate');
  animateButton.position(70, drawHeight + 45);
  animateButton.mousePressed(toggleAnimation);

  resetButton = createButton('Reset');
  resetButton.position(150, drawHeight + 45);
  resetButton.mousePressed(resetConvolution);

  describe('Convolution operation visualizer showing kernel sliding across input image', LABEL);
}

function initializeImage() {
  inputImage = [];
  for (let i = 0; i < inputSize; i++) {
    let row = [];
    for (let j = 0; j < inputSize; j++) {
      // Create a pattern with some variation
      if ((i + j) % 2 === 0) {
        row.push(200 + random(-20, 20));
      } else {
        row.push(50 + random(-20, 20));
      }
    }
    inputImage.push(row);
  }

  // Add a bright spot
  inputImage[3][3] = 255;
  inputImage[3][4] = 255;
  inputImage[4][3] = 255;
}

function calculateOutputSize() {
  let paddedSize = inputSize + 2 * padding;
  return Math.floor((paddedSize - kernelSize) / stride) + 1;
}

function initializeOutput() {
  let outSize = calculateOutputSize();
  outputImage = [];
  for (let i = 0; i < outSize; i++) {
    let row = [];
    for (let j = 0; j < outSize; j++) {
      row.push(null);
    }
    outputImage.push(row);
  }
  currentRow = 0;
  currentCol = 0;
  convolutionComplete = false;
}

function changeKernel() {
  let selected = kernelSelect.value();
  kernel = presetKernels[selected];
  resetConvolution();
}

function resetConvolution() {
  calculateOutputSize();
  initializeOutput();
  isAnimating = false;
  animateButton.html('Animate');
}

function stepConvolution() {
  if (convolutionComplete) return;

  let outSize = calculateOutputSize();

  // Compute convolution at current position
  let sum = 0;
  for (let ki = 0; ki < kernelSize; ki++) {
    for (let kj = 0; kj < kernelSize; kj++) {
      let imgI = currentRow * stride + ki - padding;
      let imgJ = currentCol * stride + kj - padding;

      let pixelVal = 0;
      if (imgI >= 0 && imgI < inputSize && imgJ >= 0 && imgJ < inputSize) {
        pixelVal = inputImage[imgI][imgJ];
      }
      sum += pixelVal * kernel[ki][kj];
    }
  }

  outputImage[currentRow][currentCol] = sum;

  // Move to next position
  currentCol++;
  if (currentCol >= outSize) {
    currentCol = 0;
    currentRow++;
    if (currentRow >= outSize) {
      convolutionComplete = true;
    }
  }
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Pause' : 'Animate');
}

function draw() {
  updateCanvasSize();

  // Animation
  if (isAnimating && !convolutionComplete) {
    if (millis() - lastStepTime > 300 / animationSpeed) {
      stepConvolution();
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
  text('Convolution Operation', canvasWidth / 2, 8);

  // Calculate layout
  let outSize = calculateOutputSize();
  cellSize = min(30, (canvasWidth - 180) / (inputSize + outSize + 4));

  // Draw input image
  let inputX = 40;
  let inputY = 60;
  drawImage(inputImage, inputX, inputY, 'Input (' + inputSize + '×' + inputSize + ')');

  // Draw kernel
  let kernelX = inputX + (inputSize + 1) * cellSize + 30;
  let kernelY = inputY + 80;
  drawKernel(kernelX, kernelY);

  // Draw output image
  let outputX = kernelX + kernelSize * cellSize + 50;
  let outputY = inputY;
  drawImage(outputImage, outputX, outputY, 'Output (' + outSize + '×' + outSize + ')');

  // Highlight current position on input
  if (!convolutionComplete) {
    drawKernelOverlay(inputX, inputY);
  }

  // Draw computation detail
  drawComputationDetail();

  // Control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(12);

  // Output dimensions
  textAlign(RIGHT, CENTER);
  text('Out: ' + outSize + '×' + outSize, canvasWidth - 10, drawHeight + 55);
}

function drawImage(img, x, y, label) {
  // Label
  noStroke();
  fill(80);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text(label, x + img.length * cellSize / 2, y - 5);

  // Draw cells
  for (let i = 0; i < img.length; i++) {
    for (let j = 0; j < img[i].length; j++) {
      let val = img[i][j];

      if (val === null) {
        fill(240);
      } else {
        // Normalize for display
        let displayVal = constrain(val, 0, 255);
        fill(displayVal);
      }

      stroke(180);
      strokeWeight(1);
      rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);

      // Show value for small images
      if (cellSize >= 25 && val !== null) {
        noStroke();
        fill(val > 128 ? 0 : 255);
        textAlign(CENTER, CENTER);
        textSize(8);
        text(round(val), x + j * cellSize + cellSize / 2, y + i * cellSize + cellSize / 2);
      }
    }
  }
}

function drawKernel(x, y) {
  // Label
  noStroke();
  fill(80);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text('Kernel', x + kernelSize * cellSize / 2, y - 5);

  // Draw cells
  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      let val = kernel[i][j];

      // Color based on sign
      if (val > 0) {
        fill(100, 200, 100);
      } else if (val < 0) {
        fill(200, 100, 100);
      } else {
        fill(220);
      }

      stroke(100);
      strokeWeight(1);
      rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);

      // Value
      noStroke();
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(9);
      text(val.toFixed(1), x + j * cellSize + cellSize / 2, y + i * cellSize + cellSize / 2);
    }
  }
}

function drawKernelOverlay(inputX, inputY) {
  let startI = currentRow * stride - padding;
  let startJ = currentCol * stride - padding;

  // Draw overlay rectangle
  stroke(255, 100, 100);
  strokeWeight(3);
  noFill();
  rect(
    inputX + startJ * cellSize,
    inputY + startI * cellSize,
    kernelSize * cellSize,
    kernelSize * cellSize
  );

  // Highlight cells being multiplied
  for (let ki = 0; ki < kernelSize; ki++) {
    for (let kj = 0; kj < kernelSize; kj++) {
      let imgI = startI + ki;
      let imgJ = startJ + kj;

      if (imgI >= 0 && imgI < inputSize && imgJ >= 0 && imgJ < inputSize) {
        fill(255, 200, 100, 100);
        noStroke();
        rect(
          inputX + imgJ * cellSize,
          inputY + imgI * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }
}

function drawComputationDetail() {
  let boxX = 10;
  let boxY = drawHeight - 100;
  let boxW = canvasWidth - 20;
  let boxH = 85;

  fill(255, 255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  fill(50);
  text('Current Computation', boxX + 10, boxY + 8);
  textStyle(NORMAL);

  if (convolutionComplete) {
    fill(0, 120, 0);
    text('Convolution complete!', boxX + 10, boxY + 28);
    return;
  }

  let outSize = calculateOutputSize();
  fill(80);
  text('Position: output[' + currentRow + '][' + currentCol + ']', boxX + 10, boxY + 28);

  // Show the element-wise multiplication
  let startI = currentRow * stride - padding;
  let startJ = currentCol * stride - padding;

  let terms = [];
  let sum = 0;
  for (let ki = 0; ki < kernelSize; ki++) {
    for (let kj = 0; kj < kernelSize; kj++) {
      let imgI = startI + ki;
      let imgJ = startJ + kj;

      let pixelVal = 0;
      if (imgI >= 0 && imgI < inputSize && imgJ >= 0 && imgJ < inputSize) {
        pixelVal = inputImage[imgI][imgJ];
      }
      let kernelVal = kernel[ki][kj];
      let product = pixelVal * kernelVal;
      sum += product;

      if (abs(kernelVal) > 0.01) {
        terms.push(round(pixelVal) + '×' + kernelVal.toFixed(1));
      }
    }
  }

  textSize(9);
  fill(100);
  let termStr = terms.slice(0, 4).join(' + ');
  if (terms.length > 4) termStr += ' + ...';
  text('Sum: ' + termStr, boxX + 10, boxY + 45);

  fill(50, 100, 150);
  textStyle(BOLD);
  text('Result: ' + sum.toFixed(1), boxX + 10, boxY + 62);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
