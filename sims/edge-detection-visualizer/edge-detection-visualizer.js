// Edge Detection Visualizer MicroSim
// Shows how Sobel operators detect edges in different orientations
// Learning objective: Analyze how gradient operators detect edges (Bloom: Analyze)

let containerWidth;
let canvasWidth = 850;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 15;
let defaultTextSize = 16;

// Image data - 16x16 grayscale
let gridSize = 16;
let originalImage = [];
let gxImage = [];  // Horizontal gradient
let gyImage = [];  // Vertical gradient
let magnitudeImage = [];
let directionImage = [];

// Sobel kernels
let sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
let sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

// UI Controls
let imageSelector;
let detectorSelector;
let thresholdSlider;
let showArrowsCheckbox;
let showArrows = true;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 12);
    imageSelector.option('Simple Shapes');
    imageSelector.option('Vertical Edge');
    imageSelector.option('Horizontal Edge');
    imageSelector.option('Diagonal');
    imageSelector.option('Text-like');
    imageSelector.selected('Simple Shapes');
    imageSelector.changed(processImage);

    // Create detector selector
    detectorSelector = createSelect();
    detectorSelector.position(140, drawHeight + 12);
    detectorSelector.option('Sobel');
    detectorSelector.option('Prewitt');
    detectorSelector.option('Scharr');
    detectorSelector.changed(updateKernels);

    // Create threshold slider
    thresholdSlider = createSlider(0, 200, 50, 5);
    thresholdSlider.position(320, drawHeight + 12);
    thresholdSlider.size(120);

    // Create arrows checkbox
    showArrowsCheckbox = createCheckbox(' Gradient arrows', true);
    showArrowsCheckbox.position(550, drawHeight + 12);
    showArrowsCheckbox.changed(() => { showArrows = showArrowsCheckbox.checked(); });

    // Initialize
    generateImage();
    computeGradients();

    describe('Edge detection visualization showing Gx, Gy gradient components and combined magnitude with direction arrows.', LABEL);
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
    text('Edge Detection Visualizer', canvasWidth / 2, 5);

    // Calculate layout for 5 panels
    let panelWidth = (canvasWidth - 6 * margin) / 5;
    let imageSize = min(panelWidth - 10, 130);
    let startY = 40;

    // Draw panels
    let x = margin;
    drawImagePanel(x, startY, imageSize, 'Original', originalImage, false, false);

    x += panelWidth + margin;
    drawGradientPanel(x, startY, imageSize, 'Gx (Horizontal)', gxImage);

    x += panelWidth + margin;
    drawGradientPanel(x, startY, imageSize, 'Gy (Vertical)', gyImage);

    x += panelWidth + margin;
    drawMagnitudePanel(x, startY, imageSize, 'Magnitude');

    x += panelWidth + margin;
    drawThresholdedPanel(x, startY, imageSize, 'Edges');

    // Draw kernels
    drawKernels(margin, startY + imageSize + 60);

    // Control labels
    drawControlLabels();
}

function drawImagePanel(x, y, size, label, data, showGradient, isGx) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(label, x + size / 2, y - 3);

    // Draw pixels
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = data[row][col];
            fill(value);
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);
}

function drawGradientPanel(x, y, size, label, data) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(label, x + size / 2, y - 3);

    // Draw pixels - gradient values can be negative
    // Map from [-255, 255] to [0, 255] for display
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = data[row][col];
            // Map: negative=dark, zero=gray, positive=bright
            let displayValue = map(value, -255, 255, 0, 255);
            fill(displayValue);
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Legend
    fill('black');
    noStroke();
    textSize(9);
    textAlign(CENTER, TOP);
    text('(-) dark ← gray → bright (+)', x + size / 2, y + size + 5);
}

function drawMagnitudePanel(x, y, size, label) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(label, x + size / 2, y - 3);

    // Draw magnitude
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let mag = magnitudeImage[row][col];
            fill(min(mag, 255));
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Draw gradient arrows if enabled
    if (showArrows) {
        stroke(255, 100, 100);
        strokeWeight(1);
        let arrowStep = 2;
        for (let row = arrowStep; row < gridSize - arrowStep; row += arrowStep) {
            for (let col = arrowStep; col < gridSize - arrowStep; col += arrowStep) {
                let mag = magnitudeImage[row][col];
                if (mag > 30) {
                    let angle = directionImage[row][col];
                    let cx = x + col * pixelSize + pixelSize / 2;
                    let cy = y + row * pixelSize + pixelSize / 2;
                    let len = min(mag / 30, pixelSize);
                    let ex = cx + cos(angle) * len;
                    let ey = cy + sin(angle) * len;
                    line(cx, cy, ex, ey);
                    // Arrow head
                    let headSize = 3;
                    let headAngle = atan2(ey - cy, ex - cx);
                    line(ex, ey, ex - headSize * cos(headAngle - 0.5), ey - headSize * sin(headAngle - 0.5));
                    line(ex, ey, ex - headSize * cos(headAngle + 0.5), ey - headSize * sin(headAngle + 0.5));
                }
            }
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);
}

function drawThresholdedPanel(x, y, size, label) {
    let pixelSize = size / gridSize;
    let threshold = thresholdSlider.value();

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(label + ' (t=' + threshold + ')', x + size / 2, y - 3);

    // Draw thresholded edges
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let mag = magnitudeImage[row][col];
            if (mag > threshold) {
                fill(255);  // White edge
            } else {
                fill(0);    // Black background
            }
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);
}

function drawKernels(x, y) {
    let cellSize = 28;

    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    text('Gx Kernel (detects vertical edges)', x + 60, y - 15);
    text('Gy Kernel (detects horizontal edges)', x + 200, y - 15);

    // Draw Gx kernel
    drawKernelMatrix(x + 20, y, cellSize, sobelX);

    // Draw Gy kernel
    drawKernelMatrix(x + 160, y, cellSize, sobelY);

    // Explanation
    textSize(10);
    textAlign(LEFT, TOP);
    text('Gx responds to vertical edges (intensity changes left-right)', x + 300, y + 10);
    text('Gy responds to horizontal edges (intensity changes top-bottom)', x + 300, y + 30);
    text('Magnitude = sqrt(Gx² + Gy²) shows edge strength', x + 300, y + 50);
    text('Direction = atan2(Gy, Gx) shows edge orientation', x + 300, y + 70);
}

function drawKernelMatrix(x, y, cellSize, kernel) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let value = kernel[row][col];
            let cx = x + col * cellSize;
            let cy = y + row * cellSize;

            // Color by value
            if (value > 0) fill(200, 255, 200);
            else if (value < 0) fill(255, 200, 200);
            else fill(240);

            stroke(150);
            strokeWeight(1);
            rect(cx, cy, cellSize, cellSize);

            // Value
            fill('black');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(12);
            text(value, cx + cellSize / 2, cy + cellSize / 2);
        }
    }
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(12);
    text('Threshold: ' + thresholdSlider.value(), 450, drawHeight + 25);
}

function generateImage() {
    let imageType = imageSelector.value();

    for (let row = 0; row < gridSize; row++) {
        originalImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value;

            switch (imageType) {
                case 'Simple Shapes':
                    // Rectangle and circle
                    if (col >= 2 && col <= 6 && row >= 2 && row <= 6) {
                        value = 200;
                    } else {
                        let cx = 11, cy = 10;
                        let dist = sqrt(pow(col - cx, 2) + pow(row - cy, 2));
                        if (dist < 4) value = 180;
                        else value = 50;
                    }
                    break;

                case 'Vertical Edge':
                    if (col < gridSize / 2) value = 50;
                    else value = 200;
                    break;

                case 'Horizontal Edge':
                    if (row < gridSize / 2) value = 50;
                    else value = 200;
                    break;

                case 'Diagonal':
                    if (col > row) value = 200;
                    else value = 50;
                    break;

                case 'Text-like':
                    // Create letter-like patterns
                    value = 50;
                    // Letter T shape
                    if (col >= 2 && col <= 6 && row === 3) value = 200;
                    if (col === 4 && row >= 3 && row <= 8) value = 200;
                    // Letter L shape
                    if (col === 9 && row >= 3 && row <= 8) value = 200;
                    if (col >= 9 && col <= 13 && row === 8) value = 200;
                    break;
            }

            originalImage[row][col] = constrain(value, 0, 255);
        }
    }
}

function computeGradients() {
    for (let row = 0; row < gridSize; row++) {
        gxImage[row] = [];
        gyImage[row] = [];
        magnitudeImage[row] = [];
        directionImage[row] = [];

        for (let col = 0; col < gridSize; col++) {
            let gx = applyKernelAt(originalImage, sobelX, row, col);
            let gy = applyKernelAt(originalImage, sobelY, row, col);

            gxImage[row][col] = gx;
            gyImage[row][col] = gy;
            magnitudeImage[row][col] = sqrt(gx * gx + gy * gy);
            directionImage[row][col] = atan2(gy, gx);
        }
    }
}

function applyKernelAt(image, kernel, row, col) {
    let sum = 0;
    for (let kr = 0; kr < 3; kr++) {
        for (let kc = 0; kc < 3; kc++) {
            let imgRow = constrain(row + kr - 1, 0, gridSize - 1);
            let imgCol = constrain(col + kc - 1, 0, gridSize - 1);
            sum += image[imgRow][imgCol] * kernel[kr][kc];
        }
    }
    return sum;
}

function updateKernels() {
    let detector = detectorSelector.value();

    switch (detector) {
        case 'Sobel':
            sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
            sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
            break;
        case 'Prewitt':
            sobelX = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
            sobelY = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];
            break;
        case 'Scharr':
            sobelX = [[-3, 0, 3], [-10, 0, 10], [-3, 0, 3]];
            sobelY = [[-3, -10, -3], [0, 0, 0], [3, 10, 3]];
            break;
    }

    computeGradients();
}

function processImage() {
    generateImage();
    computeGradients();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
