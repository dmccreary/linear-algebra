// Image Matrix Visualizer MicroSim
// Shows how pixel values in a matrix correspond to image appearance
// Learning objective: Understand grayscale image representation (Bloom: Understand)

let containerWidth;
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 240;
let defaultTextSize = 16;

// Image data - 8x8 pixel matrix
let gridSize = 8;
let pixelMatrix = [];

// UI Controls
let imageSelector;
let zoomSlider;
let editModeButton;
let isEditMode = false;

// Interaction state
let hoveredCell = { row: -1, col: -1 };
let selectedCell = { row: -1, col: -1 };

// Display calculations
let imageStartX, imageStartY, imageDisplaySize;
let matrixStartX, matrixStartY, cellSize;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector dropdown
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 8);
    imageSelector.option('Checkerboard');
    imageSelector.option('Gradient');
    imageSelector.option('Simple Shape');
    imageSelector.option('Random');
    imageSelector.selected('Checkerboard');
    imageSelector.changed(generateImage);

    // Create zoom slider
    zoomSlider = createSlider(1, 4, 2, 0.5);
    zoomSlider.position(sliderLeftMargin, drawHeight + 8);
    zoomSlider.size(canvasWidth - sliderLeftMargin - margin);

    // Create edit mode button (second row)
    editModeButton = createButton('Enable Edit Mode');
    editModeButton.position(10, drawHeight + 43);
    editModeButton.mousePressed(toggleEditMode);

    // Initialize with default image
    generateImage();

    describe('Interactive visualization showing an 8x8 grayscale image alongside its numeric matrix representation. Hover to highlight corresponding cells.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Draw background
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
    text('Image Matrix Visualizer', canvasWidth / 2, 8);

    // Calculate display areas
    let availableWidth = canvasWidth - 3 * margin;
    let zoom = zoomSlider.value();

    // Image display area (left side)
    imageDisplaySize = min(180 * zoom, drawHeight - 100, availableWidth / 2 - 40);
    imageStartX = margin + 20;
    imageStartY = 50 + (drawHeight - 80 - imageDisplaySize) / 2;

    // Matrix display area (right side)
    let matrixAreaWidth = canvasWidth / 2 - margin;
    cellSize = min(35, matrixAreaWidth / gridSize - 2);
    let matrixWidth = gridSize * cellSize;
    let matrixHeight = gridSize * cellSize;
    matrixStartX = canvasWidth / 2 + (matrixAreaWidth - matrixWidth) / 2;
    matrixStartY = 50 + (drawHeight - 80 - matrixHeight) / 2;

    // Draw image representation
    drawImagePanel();

    // Draw matrix representation
    drawMatrixPanel();

    // Draw color legend
    drawColorLegend();

    // Draw labels
    drawLabels();

    // Draw control labels
    drawControlLabels();

    // Update hover state
    updateHoverState();
}

function drawImagePanel() {
    let pixelSize = imageDisplaySize / gridSize;

    // Panel background
    fill(255);
    stroke(100);
    strokeWeight(1);
    rect(imageStartX - 5, imageStartY - 5, imageDisplaySize + 10, imageDisplaySize + 10, 5);

    // Draw pixels
    noStroke();
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = pixelMatrix[row][col];
            fill(value);

            let x = imageStartX + col * pixelSize;
            let y = imageStartY + row * pixelSize;
            rect(x, y, pixelSize, pixelSize);

            // Highlight hovered cell
            if (row === hoveredCell.row && col === hoveredCell.col) {
                stroke(255, 100, 100);
                strokeWeight(3);
                noFill();
                rect(x, y, pixelSize, pixelSize);
                noStroke();
            }
        }
    }

    // Grid lines
    stroke(100, 100, 100, 100);
    strokeWeight(1);
    for (let i = 0; i <= gridSize; i++) {
        line(imageStartX, imageStartY + i * pixelSize,
             imageStartX + imageDisplaySize, imageStartY + i * pixelSize);
        line(imageStartX + i * pixelSize, imageStartY,
             imageStartX + i * pixelSize, imageStartY + imageDisplaySize);
    }
}

function drawMatrixPanel() {
    // Panel background
    fill(255);
    stroke(100);
    strokeWeight(1);
    let matrixWidth = gridSize * cellSize;
    let matrixHeight = gridSize * cellSize;
    rect(matrixStartX - 5, matrixStartY - 5, matrixWidth + 10, matrixHeight + 10, 5);

    // Draw matrix cells
    textAlign(CENTER, CENTER);
    textSize(constrain(cellSize * 0.4, 10, 14));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = pixelMatrix[row][col];
            let x = matrixStartX + col * cellSize;
            let y = matrixStartY + row * cellSize;

            // Cell background (lighter version of pixel color)
            let bgColor = map(value, 0, 255, 220, 255);
            fill(bgColor);
            stroke(180);
            strokeWeight(1);
            rect(x, y, cellSize, cellSize);

            // Highlight hovered cell
            if (row === hoveredCell.row && col === hoveredCell.col) {
                fill(255, 220, 220);
                stroke(255, 100, 100);
                strokeWeight(3);
                rect(x, y, cellSize, cellSize);
            }

            // Cell value
            fill(value < 128 ? 80 : 0);
            noStroke();
            text(value, x + cellSize / 2, y + cellSize / 2);
        }
    }
}

function drawColorLegend() {
    let legendX = canvasWidth - margin - 30;
    let legendY = 60;
    let legendHeight = drawHeight - 120;
    let legendWidth = 20;

    // Legend title
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Pixel', legendX + legendWidth / 2, legendY - 5);
    text('Value', legendX + legendWidth / 2, legendY + 8);

    // Gradient bar
    for (let i = 0; i < legendHeight; i++) {
        let value = map(i, 0, legendHeight, 255, 0);
        stroke(value);
        line(legendX, legendY + 20 + i, legendX + legendWidth, legendY + 20 + i);
    }

    // Border
    noFill();
    stroke(100);
    strokeWeight(1);
    rect(legendX, legendY + 20, legendWidth, legendHeight);

    // Labels
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    text('255', legendX + legendWidth + 5, legendY + 20);
    text('(white)', legendX + legendWidth + 5, legendY + 32);
    text('0', legendX + legendWidth + 5, legendY + 20 + legendHeight);
    text('(black)', legendX + legendWidth + 5, legendY + 20 + legendHeight + 12);
}

function drawLabels() {
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14);

    // Image label
    text('Grayscale Image', imageStartX + imageDisplaySize / 2, imageStartY + imageDisplaySize + 10);
    text('(8×8 pixels)', imageStartX + imageDisplaySize / 2, imageStartY + imageDisplaySize + 26);

    // Matrix label
    let matrixWidth = gridSize * cellSize;
    text('Matrix Representation', matrixStartX + matrixWidth / 2, matrixStartY + matrixWidth + 10);

    // Show coordinates on hover
    if (hoveredCell.row >= 0 && hoveredCell.col >= 0) {
        textSize(12);
        let value = pixelMatrix[hoveredCell.row][hoveredCell.col];
        text(`Position: (${hoveredCell.row}, ${hoveredCell.col})  Value: ${value}`,
             canvasWidth / 2, drawHeight - 25);
    }

    // Edit mode indicator
    if (isEditMode) {
        fill(200, 100, 100);
        textSize(12);
        text('Click on matrix cells to edit values (0-255)', canvasWidth / 2, drawHeight - 10);
    }
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);

    // Zoom slider label
    let zoom = zoomSlider.value();
    text('Zoom: ' + zoom.toFixed(1) + 'x', 140, drawHeight + 20);
}

function updateHoverState() {
    let px = mouseX;
    let py = mouseY;

    hoveredCell = { row: -1, col: -1 };

    // Check image area
    if (px >= imageStartX && px < imageStartX + imageDisplaySize &&
        py >= imageStartY && py < imageStartY + imageDisplaySize) {
        let pixelSize = imageDisplaySize / gridSize;
        hoveredCell.col = floor((px - imageStartX) / pixelSize);
        hoveredCell.row = floor((py - imageStartY) / pixelSize);
    }

    // Check matrix area
    if (px >= matrixStartX && px < matrixStartX + gridSize * cellSize &&
        py >= matrixStartY && py < matrixStartY + gridSize * cellSize) {
        hoveredCell.col = floor((px - matrixStartX) / cellSize);
        hoveredCell.row = floor((py - matrixStartY) / cellSize);
    }

    // Clamp to valid range
    hoveredCell.row = constrain(hoveredCell.row, -1, gridSize - 1);
    hoveredCell.col = constrain(hoveredCell.col, -1, gridSize - 1);
}

function mousePressed() {
    if (!isEditMode) return;

    // Check if clicked in matrix area
    if (mouseX >= matrixStartX && mouseX < matrixStartX + gridSize * cellSize &&
        mouseY >= matrixStartY && mouseY < matrixStartY + gridSize * cellSize) {
        let col = floor((mouseX - matrixStartX) / cellSize);
        let row = floor((mouseY - matrixStartY) / cellSize);

        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            // Cycle through values: 0, 64, 128, 192, 255
            let currentValue = pixelMatrix[row][col];
            let newValue;
            if (currentValue < 32) newValue = 64;
            else if (currentValue < 96) newValue = 128;
            else if (currentValue < 160) newValue = 192;
            else if (currentValue < 224) newValue = 255;
            else newValue = 0;

            pixelMatrix[row][col] = newValue;
        }
    }
}

function generateImage() {
    let imageType = imageSelector.value();
    pixelMatrix = [];

    for (let row = 0; row < gridSize; row++) {
        pixelMatrix[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value = 0;

            switch (imageType) {
                case 'Checkerboard':
                    value = ((row + col) % 2 === 0) ? 255 : 0;
                    break;

                case 'Gradient':
                    value = floor(map(col, 0, gridSize - 1, 0, 255));
                    break;

                case 'Simple Shape':
                    // Draw a circle-like shape
                    let centerX = gridSize / 2 - 0.5;
                    let centerY = gridSize / 2 - 0.5;
                    let dist = sqrt(pow(col - centerX, 2) + pow(row - centerY, 2));
                    if (dist < 3) {
                        value = floor(map(dist, 0, 3, 255, 100));
                    } else {
                        value = 50;
                    }
                    break;

                case 'Random':
                    value = floor(random(0, 256));
                    break;
            }

            pixelMatrix[row][col] = value;
        }
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    editModeButton.html(isEditMode ? 'Disable Edit Mode' : 'Enable Edit Mode');
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    zoomSlider.size(canvasWidth - sliderLeftMargin - margin);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
