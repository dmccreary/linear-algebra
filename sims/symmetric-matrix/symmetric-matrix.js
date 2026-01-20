// Symmetric Matrix Visualization MicroSim
// Demonstrates the symmetry property of matrices where A[i,j] = A[j,i]

// Canvas dimensions - responsive width
let canvasWidth = 450;
let drawHeight = 450;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;

let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Application-specific variables
let matrixSize = 6;  // Default size
let matrix = [];

// UI elements
let sizeSlider;
let regenerateButton;

// Cell dimensions - will be calculated based on matrix size
let cellSize = 40;
let maxCellSize = 50;
let minCellSize = 25;

// Helper function to draw text with subscripts
// tokens is an array where each element is either:
//   - a string (drawn normally)
//   - an object {base: 'A', sub: 'ij', scale: 1, color: 'red'}
function drawWithSubscripts(tokens, centerX, y, baseSize, defaultColor) {
    // First calculate total width for centering
    let totalWidth = 0;
    for (let token of tokens) {
        if (typeof token === 'string') {
            textSize(baseSize);
            totalWidth += textWidth(token);
        } else {
            let scale = token.scale || 1;
            textSize(baseSize * scale);
            totalWidth += textWidth(token.base);
            textSize(baseSize * 0.7);
            totalWidth += textWidth(token.sub);
        }
    }

    // Draw from left, starting at center minus half width
    let x = centerX - totalWidth / 2;
    textAlign(LEFT, TOP);

    for (let token of tokens) {
        if (typeof token === 'string') {
            if (defaultColor) fill(defaultColor);
            textSize(baseSize);
            text(token, x, y);
            x += textWidth(token);
        } else {
            let scale = token.scale || 1;
            // Draw base letter (optionally scaled and colored)
            if (token.color) fill(token.color);
            else if (defaultColor) fill(defaultColor);
            textSize(baseSize * scale);
            text(token.base, x, y);
            x += textWidth(token.base);
            // Draw subscript (smaller and lower)
            textSize(baseSize * 0.7);
            text(token.sub, x, y + baseSize * 0.4);
            x += textWidth(token.sub);
            // Reset color for next token
            if (token.color && defaultColor) fill(defaultColor);
        }
    }
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    textSize(defaultTextSize);

    // Initialize matrix with random values
    generateSymmetricMatrix();

    // Create Regenerate button
    regenerateButton = createButton('Regenerate');
    regenerateButton.parent(document.querySelector('main'));
    regenerateButton.position(10, drawHeight + 12);
    regenerateButton.mousePressed(generateSymmetricMatrix);

    // Create size slider
    sizeSlider = createSlider(2, 10, matrixSize, 1);
    sizeSlider.parent(document.querySelector('main'));
    sizeSlider.position(sliderLeftMargin, drawHeight + 12);
    sizeSlider.size(canvasWidth - sliderLeftMargin - margin);
    sizeSlider.input(onSizeChange);

    describe('Interactive visualization of a symmetric matrix where A[i,j] = A[j,i], with adjustable size from 2×2 to 10×10.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area background
    fill('aliceblue');
    // Draw a thin light gray border around both the drawing and control areas
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(24);
    text('Symmetric Matrix', canvasWidth / 2, 10);

    // Subtitle showing property with proper subscripts
    drawWithSubscripts([
        {base: 'A', sub: 'i,j', color: '#4682B4'},
        ' = ',
        {base: 'A', sub: 'j,i', color: '#2E8B57'}
    ], canvasWidth / 2, 42, 18, 'gray');

    // Calculate cell size based on matrix size
    let availableSpace = Math.min(canvasWidth - 80, drawHeight - 120);
    cellSize = Math.floor(availableSpace / matrixSize);
    cellSize = constrain(cellSize, minCellSize, maxCellSize);

    // Draw the matrix
    drawMatrix();

    // Control labels
    fill('black');
    noStroke();
    textAlign(RIGHT, CENTER);
    textSize(defaultTextSize);
    text('Size: ' + matrixSize + '×' + matrixSize, sliderLeftMargin - 10, drawHeight + 24);
}

function drawMatrix() {
    let totalSize = matrixSize * cellSize;
    let startX = (canvasWidth - totalSize) / 2;
    let startY = 85;

    // Draw row and column indices
    textSize(12);
    fill('gray');
    textAlign(CENTER, CENTER);

    // Column indices (top)
    for (let j = 0; j < matrixSize; j++) {
        let x = startX + j * cellSize + cellSize / 2;
        text(j + 1, x, startY - 12);
    }

    // Row indices (left)
    for (let i = 0; i < matrixSize; i++) {
        let y = startY + i * cellSize + cellSize / 2;
        text(i + 1, startX - 15, y);
    }

    // Draw cells
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            let x = startX + j * cellSize;
            let y = startY + i * cellSize;

            // Color coding: diagonal is different, symmetric pairs share colors
            if (i === j) {
                // Diagonal elements
                fill('#E8D5B7');  // Tan/beige for diagonal
                stroke('#8B7355');
            } else if (i < j) {
                // Upper triangle
                fill('#B8D4E8');  // Light blue
                stroke('#4682B4');
            } else {
                // Lower triangle (mirrors upper)
                fill('#B8E8D4');  // Light green
                stroke('#2E8B57');
            }

            strokeWeight(2);
            rect(x, y, cellSize, cellSize, 3);

            // Cell value
            fill('black');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(cellSize > 35 ? 18 : 14);
            text(matrix[i][j], x + cellSize / 2, y + cellSize / 2);
        }
    }

    // Draw legend
    drawLegend(startX, startY + totalSize + 15);
}

function drawLegend(x, y) {
    textSize(12);
    textAlign(LEFT, CENTER);

    let legendX = canvasWidth / 2 - 120;
    let boxSize = 15;
    let spacing = 80;

    // Diagonal
    fill('#E8D5B7');
    stroke('#8B7355');
    strokeWeight(1);
    rect(legendX, y, boxSize, boxSize, 2);
    fill('black');
    noStroke();
    text('Diagonal', legendX + boxSize + 5, y + boxSize / 2);

    // Upper triangle
    fill('#B8D4E8');
    stroke('#4682B4');
    strokeWeight(1);
    rect(legendX + spacing, y, boxSize, boxSize, 2);
    fill('black');
    noStroke();
    text('Upper', legendX + spacing + boxSize + 5, y + boxSize / 2);

    // Lower triangle
    fill('#B8E8D4');
    stroke('#2E8B57');
    strokeWeight(1);
    rect(legendX + spacing * 2, y, boxSize, boxSize, 2);
    fill('black');
    noStroke();
    text('Lower', legendX + spacing * 2 + boxSize + 5, y + boxSize / 2);
}

function generateSymmetricMatrix() {
    matrix = [];
    for (let i = 0; i < 10; i++) {  // Generate up to max size
        matrix[i] = [];
        for (let j = 0; j < 10; j++) {
            if (j >= i) {
                // Generate random value for upper triangle and diagonal
                matrix[i][j] = floor(random(0, 10));
            } else {
                // Mirror from upper triangle to ensure symmetry
                matrix[i][j] = matrix[j][i];
            }
        }
    }
}

function onSizeChange() {
    matrixSize = sizeSlider.value();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    sizeSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
    if (canvasWidth < 300) canvasWidth = 300;  // Minimum width
}
