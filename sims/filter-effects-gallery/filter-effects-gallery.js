// Filter Effects Gallery MicroSim
// Compare effects of different filters on the same image
// Learning objective: Evaluate and compare different image filters (Bloom: Evaluate)

let containerWidth;
let canvasWidth = 900;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 15;
let defaultTextSize = 16;

// Image data - 16x16 grayscale
let gridSize = 16;
let originalImage = [];
let filteredImages = {};

// UI Controls
let imageSelector;
let showDiffCheckbox;
let showKernelCheckbox;
let showDiff = false;
let showKernel = true;

// Filter definitions
let filters = {
    'Original': [[0,0,0],[0,1,0],[0,0,0]],
    'Box Blur': [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]],
    'Gaussian': [[1/16,2/16,1/16],[2/16,4/16,2/16],[1/16,2/16,1/16]],
    'Sharpen': [[0,-1,0],[-1,5,-1],[0,-1,0]],
    'Edge': [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
    'Emboss': [[-2,-1,0],[-1,1,1],[0,1,2]]
};

let filterNames = ['Original', 'Box Blur', 'Gaussian', 'Sharpen', 'Edge', 'Emboss'];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 12);
    imageSelector.option('Edge Pattern');
    imageSelector.option('Gradient');
    imageSelector.option('Checkerboard');
    imageSelector.option('Circle');
    imageSelector.option('Random');
    imageSelector.selected('Edge Pattern');
    imageSelector.changed(regenerateAll);

    // Create checkboxes
    showDiffCheckbox = createCheckbox(' Show difference', false);
    showDiffCheckbox.position(150, drawHeight + 12);
    showDiffCheckbox.changed(() => { showDiff = showDiffCheckbox.checked(); });

    showKernelCheckbox = createCheckbox(' Show kernels', true);
    showKernelCheckbox.position(290, drawHeight + 12);
    showKernelCheckbox.changed(() => { showKernel = showKernelCheckbox.checked(); });

    // Initialize
    generateImage();
    applyAllFilters();

    describe('Gallery comparing different image filters side-by-side including blur, sharpen, and edge detection.', LABEL);
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
    text('Filter Effects Gallery', canvasWidth / 2, 5);

    // Calculate layout for 6 panels (2 rows of 3)
    let cols = 3;
    let rows = 2;
    let panelMargin = 10;
    let availableWidth = canvasWidth - 2 * margin - (cols - 1) * panelMargin;
    let panelWidth = availableWidth / cols;
    let imageSize = min(panelWidth - 20, 120);
    let kernelHeight = showKernel ? 60 : 0;
    let panelHeight = imageSize + 45 + kernelHeight;
    let startY = 35;

    // Draw filter panels
    for (let i = 0; i < filterNames.length; i++) {
        let col = i % cols;
        let row = floor(i / cols);
        let x = margin + col * (panelWidth + panelMargin);
        let y = startY + row * (panelHeight + 10);

        drawFilterPanel(x, y, panelWidth, imageSize, filterNames[i]);
    }
}

function drawFilterPanel(x, y, width, imageSize, filterName) {
    let kernel = filters[filterName];
    let filtered = filteredImages[filterName];

    // Panel background
    fill(255);
    stroke(180);
    strokeWeight(1);
    rect(x, y, width, imageSize + (showKernel ? 100 : 45), 5);

    // Filter name
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    textStyle(BOLD);
    text(filterName, x + width / 2, y + 5);
    textStyle(NORMAL);

    // Draw filtered image
    let imgX = x + (width - imageSize) / 2;
    let imgY = y + 22;
    let pixelSize = imageSize / gridSize;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value;
            if (showDiff && filterName !== 'Original') {
                // Show difference from original
                let diff = filtered[row][col] - originalImage[row][col];
                value = 128 + diff; // Center at gray
            } else {
                value = filtered[row][col];
            }
            fill(constrain(value, 0, 255));
            noStroke();
            rect(imgX + col * pixelSize, imgY + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Image border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(imgX, imgY, imageSize, imageSize);

    // Draw kernel if enabled
    if (showKernel && filterName !== 'Original') {
        drawMiniKernel(x + width / 2 - 30, imgY + imageSize + 8, kernel);
    }
}

function drawMiniKernel(x, y, kernel) {
    let cellSize = 18;
    let size = 3;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let value = kernel[row][col];
            let cx = x + col * cellSize;
            let cy = y + row * cellSize;

            // Color by value
            if (value > 0.1) fill(200, 255, 200);
            else if (value < -0.1) fill(255, 200, 200);
            else fill(240);

            stroke(150);
            strokeWeight(1);
            rect(cx, cy, cellSize, cellSize);

            // Value text
            fill('black');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(8);
            if (abs(value) < 0.01) {
                text('0', cx + cellSize/2, cy + cellSize/2);
            } else if (abs(value - round(value)) < 0.01) {
                text(round(value), cx + cellSize/2, cy + cellSize/2);
            } else {
                text(value.toFixed(2), cx + cellSize/2, cy + cellSize/2);
            }
        }
    }
}

function generateImage() {
    let imageType = imageSelector.value();

    for (let row = 0; row < gridSize; row++) {
        originalImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value;

            switch (imageType) {
                case 'Edge Pattern':
                    // Vertical edge in middle
                    if (col < gridSize / 2) value = 60;
                    else value = 200;
                    // Add some texture
                    if (row % 4 === 0 && col > 2 && col < gridSize - 2) value += 30;
                    break;

                case 'Gradient':
                    value = floor(map(col, 0, gridSize - 1, 30, 230));
                    break;

                case 'Checkerboard':
                    let blockSize = 2;
                    let blockRow = floor(row / blockSize);
                    let blockCol = floor(col / blockSize);
                    value = ((blockRow + blockCol) % 2 === 0) ? 40 : 220;
                    break;

                case 'Circle':
                    let centerX = gridSize / 2 - 0.5;
                    let centerY = gridSize / 2 - 0.5;
                    let dist = sqrt(pow(col - centerX, 2) + pow(row - centerY, 2));
                    if (dist < gridSize / 3) {
                        value = 200;
                    } else {
                        value = 60;
                    }
                    break;

                case 'Random':
                    value = floor(random(50, 210));
                    break;
            }

            originalImage[row][col] = constrain(value, 0, 255);
        }
    }
}

function applyAllFilters() {
    for (let filterName of filterNames) {
        filteredImages[filterName] = applyFilter(originalImage, filters[filterName]);
    }
}

function applyFilter(image, kernel) {
    let result = [];
    let kSize = 3;
    let kHalf = floor(kSize / 2);

    for (let row = 0; row < gridSize; row++) {
        result[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let sum = 0;

            for (let kr = 0; kr < kSize; kr++) {
                for (let kc = 0; kc < kSize; kc++) {
                    let imgRow = row + kr - kHalf;
                    let imgCol = col + kc - kHalf;

                    // Clamp to image bounds
                    imgRow = constrain(imgRow, 0, gridSize - 1);
                    imgCol = constrain(imgCol, 0, gridSize - 1);

                    sum += image[imgRow][imgCol] * kernel[kr][kc];
                }
            }

            result[row][col] = constrain(round(sum), 0, 255);
        }
    }

    return result;
}

function regenerateAll() {
    generateImage();
    applyAllFilters();
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
