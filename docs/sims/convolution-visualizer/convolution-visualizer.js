// Convolution Visualizer MicroSim
// Shows how convolution applies a kernel to an image step-by-step
// Learning objective: Apply convolution operation to understand image filtering (Bloom: Apply)

let containerWidth;
let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Image data - 8x8 grayscale
let gridSize = 8;
let inputImage = [];
let outputImage = [];

// Kernel data - 3x3
let kernel = [];
let kernelSize = 3;

// Animation state
let currentRow = 0;
let currentCol = 0;
let isRunning = false;
let animationSpeed = 5;

// UI Controls
let kernelSelector;
let speedSlider;
let startButton;
let stepButton;
let resetButton;
let showCalcCheckbox;
let showCalc = true;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create kernel selector
    kernelSelector = createSelect();
    kernelSelector.position(10, drawHeight + 8);
    kernelSelector.option('Identity');
    kernelSelector.option('Box Blur');
    kernelSelector.option('Gaussian Blur');
    kernelSelector.option('Sharpen');
    kernelSelector.option('Edge Detect');
    kernelSelector.selected('Box Blur');
    kernelSelector.changed(resetSimulation);

    // Create speed slider
    speedSlider = createSlider(1, 20, 5, 1);
    speedSlider.position(sliderLeftMargin + 100, drawHeight + 8);
    speedSlider.size(100);

    // Create buttons (Row 2)
    stepButton = createButton('Step');
    stepButton.position(10, drawHeight + 43);
    stepButton.mousePressed(stepConvolution);

    startButton = createButton('Run');
    startButton.position(60, drawHeight + 43);
    startButton.mousePressed(toggleRun);

    resetButton = createButton('Reset');
    resetButton.position(110, drawHeight + 43);
    resetButton.mousePressed(resetSimulation);

    showCalcCheckbox = createCheckbox(' Show calculation', true);
    showCalcCheckbox.position(180, drawHeight + 43);
    showCalcCheckbox.changed(() => showCalc = showCalcCheckbox.checked());

    // Initialize
    initializeImage();
    selectKernel();

    describe('Step-by-step convolution visualizer showing how a kernel is applied to each pixel position.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Background
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
    text('Convolution Visualizer', canvasWidth / 2, 5);

    // Calculate layout
    let cellSize = 32;
    let inputX = margin + 20;
    let inputY = 50;
    let kernelX = inputX + gridSize * cellSize + 60;
    let kernelY = inputY + 80;
    let outputX = kernelX + kernelSize * cellSize + 100;
    let outputY = inputY;

    // Draw panels
    drawInputImage(inputX, inputY, cellSize);
    drawKernel(kernelX, kernelY, cellSize);
    drawOutputImage(outputX, outputY, cellSize);

    // Draw calculation panel if enabled
    if (showCalc && currentRow < gridSize - 1 && currentCol < gridSize - 1) {
        drawCalculation(kernelX - 20, kernelY + kernelSize * cellSize + 40);
    }

    // Control labels
    drawControlLabels();

    // Animation
    if (isRunning && frameCount % max(1, 21 - speedSlider.value()) === 0) {
        stepConvolution();
    }
}

function drawInputImage(x, y, cellSize) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text('Input Image', x + gridSize * cellSize / 2, y - 5);

    // Draw cells
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = inputImage[row][col];
            let cx = x + col * cellSize;
            let cy = y + row * cellSize;

            // Cell background
            fill(value);
            stroke(150);
            strokeWeight(1);
            rect(cx, cy, cellSize, cellSize);

            // Highlight kernel window
            let inKernel = row >= currentRow && row < currentRow + kernelSize &&
                          col >= currentCol && col < currentCol + kernelSize;
            if (inKernel && currentRow < gridSize - 1) {
                fill(255, 200, 200, 150);
                noStroke();
                rect(cx, cy, cellSize, cellSize);

                // Show value
                fill(value < 128 ? 255 : 0);
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(10);
                text(value, cx + cellSize / 2, cy + cellSize / 2);
            }
        }
    }

    // Kernel window outline
    if (currentRow < gridSize - 1 && currentCol < gridSize - 1) {
        noFill();
        stroke(255, 100, 100);
        strokeWeight(3);
        rect(x + currentCol * cellSize, y + currentRow * cellSize,
             kernelSize * cellSize, kernelSize * cellSize);
    }
}

function drawKernel(x, y, cellSize) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text('Kernel', x + kernelSize * cellSize / 2, y - 5);

    // Draw cells
    for (let row = 0; row < kernelSize; row++) {
        for (let col = 0; col < kernelSize; col++) {
            let value = kernel[row][col];
            let cx = x + col * cellSize;
            let cy = y + row * cellSize;

            // Cell background
            if (value > 0) fill(200, 255, 200);
            else if (value < 0) fill(255, 200, 200);
            else fill(240);

            stroke(100);
            strokeWeight(1);
            rect(cx, cy, cellSize, cellSize);

            // Value
            fill('black');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(11);
            text(value.toFixed(2), cx + cellSize / 2, cy + cellSize / 2);
        }
    }
}

function drawOutputImage(x, y, cellSize) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text('Output Image', x + gridSize * cellSize / 2, y - 5);

    // Draw cells
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let cx = x + col * cellSize;
            let cy = y + row * cellSize;

            // Only draw computed cells
            if (row < currentRow || (row === currentRow && col < currentCol)) {
                let value = outputImage[row][col];
                fill(value);
            } else if (row === currentRow && col === currentCol && currentRow < gridSize - 1) {
                // Current cell being computed
                fill(255, 255, 150);
            } else {
                // Not yet computed
                fill(230);
            }

            stroke(150);
            strokeWeight(1);
            rect(cx, cy, cellSize, cellSize);

            // Highlight current output position
            if (row === currentRow && col === currentCol && currentRow < gridSize - 1) {
                stroke(255, 100, 100);
                strokeWeight(3);
                noFill();
                rect(cx, cy, cellSize, cellSize);
            }
        }
    }

    // Progress indicator
    let totalCells = (gridSize - 2) * (gridSize - 2);
    let completedCells = currentRow * (gridSize - 2) + currentCol;
    if (currentRow >= gridSize - 2) completedCells = totalCells;

    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    text(`Progress: ${completedCells}/${totalCells} pixels`, x + gridSize * cellSize / 2, y + gridSize * cellSize + 10);
}

function drawCalculation(x, y) {
    // Calculation panel
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, 250, 80, 5);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);

    // Show element-wise products
    let sum = 0;
    let calcText = 'Calculation:\n';
    let products = [];

    for (let kr = 0; kr < kernelSize; kr++) {
        for (let kc = 0; kc < kernelSize; kc++) {
            let imgRow = currentRow + kr;
            let imgCol = currentCol + kc;
            let imgVal = inputImage[imgRow][imgCol];
            let kVal = kernel[kr][kc];
            let product = imgVal * kVal;
            sum += product;
            if (kVal !== 0) {
                products.push(`${imgVal}×${kVal.toFixed(1)}`);
            }
        }
    }

    text('Sum of (pixel × kernel):', x + 10, y + 10);
    text(products.slice(0, 4).join(' + '), x + 10, y + 30);
    if (products.length > 4) {
        text('+ ' + products.slice(4).join(' + '), x + 10, y + 45);
    }
    text(`= ${sum.toFixed(0)} → clamped to [0,255]`, x + 10, y + 62);
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);

    text('Speed: ' + speedSlider.value(), sliderLeftMargin + 100, drawHeight + 20);
}

function stepConvolution() {
    if (currentRow >= gridSize - 2 && currentCol >= gridSize - 2) {
        isRunning = false;
        startButton.html('Run');
        return;
    }

    // Compute convolution at current position
    let sum = 0;
    for (let kr = 0; kr < kernelSize; kr++) {
        for (let kc = 0; kc < kernelSize; kc++) {
            let imgRow = currentRow + kr;
            let imgCol = currentCol + kc;
            sum += inputImage[imgRow][imgCol] * kernel[kr][kc];
        }
    }

    // Store result (clamped)
    outputImage[currentRow][currentCol] = constrain(round(sum), 0, 255);

    // Move to next position
    currentCol++;
    if (currentCol > gridSize - 2) {
        currentCol = 0;
        currentRow++;
    }
}

function toggleRun() {
    isRunning = !isRunning;
    startButton.html(isRunning ? 'Pause' : 'Run');
}

function resetSimulation() {
    currentRow = 0;
    currentCol = 0;
    isRunning = false;
    startButton.html('Run');

    // Clear output
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            outputImage[row][col] = 128;
        }
    }

    selectKernel();
}

function initializeImage() {
    // Create a simple test pattern
    for (let row = 0; row < gridSize; row++) {
        inputImage[row] = [];
        outputImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            // Create an edge pattern
            if (col < gridSize / 2) {
                inputImage[row][col] = 50;
            } else {
                inputImage[row][col] = 200;
            }
            outputImage[row][col] = 128;
        }
    }

    // Add some variation
    inputImage[2][2] = 255;
    inputImage[2][3] = 255;
    inputImage[3][2] = 255;
    inputImage[3][3] = 255;
}

function selectKernel() {
    let kernelType = kernelSelector.value();

    switch (kernelType) {
        case 'Identity':
            kernel = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ];
            break;
        case 'Box Blur':
            kernel = [
                [1/9, 1/9, 1/9],
                [1/9, 1/9, 1/9],
                [1/9, 1/9, 1/9]
            ];
            break;
        case 'Gaussian Blur':
            kernel = [
                [1/16, 2/16, 1/16],
                [2/16, 4/16, 2/16],
                [1/16, 2/16, 1/16]
            ];
            break;
        case 'Sharpen':
            kernel = [
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0]
            ];
            break;
        case 'Edge Detect':
            kernel = [
                [-1, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1]
            ];
            break;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    speedSlider.size(100);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
