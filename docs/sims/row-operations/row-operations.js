// Row Operations Interactive MicroSim
// Practice applying elementary row operations on augmented matrices
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 350;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// Matrix data - 3x4 augmented matrix [A|b]
let matrix = [
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3]
];

// Original matrix for reset
let originalMatrix = JSON.parse(JSON.stringify(matrix));

// Operation history
let history = [];
let maxHistoryDisplay = 5;

// UI elements
let opSelect;
let row1Select, row2Select;
let scalarInput;
let applyButton, undoButton, resetButton;

// Animation state
let animating = false;
let animationProgress = 0;
let highlightRows = [];

// Font for matrix display
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont(font);
    textSize(defaultTextSize);

    // Row 1: Operation type selector
    let row1Y = drawHeight + 10;

    // Operation type dropdown
    opSelect = createSelect();
    opSelect.position(110, row1Y);
    opSelect.option('Swap Rows', 'swap');
    opSelect.option('Scale Row', 'scale');
    opSelect.option('Add Multiple', 'add');
    opSelect.changed(updateControlVisibility);

    // Row selectors
    row1Select = createSelect();
    row1Select.position(250, row1Y);
    row1Select.option('R₁', 0);
    row1Select.option('R₂', 1);
    row1Select.option('R₃', 2);

    row2Select = createSelect();
    row2Select.position(310, row1Y);
    row2Select.option('R₁', 0);
    row2Select.option('R₂', 1);
    row2Select.option('R₃', 2);
    row2Select.selected(1);

    // Scalar input
    scalarInput = createInput('2');
    scalarInput.position(390, row1Y);
    scalarInput.size(50);
    scalarInput.attribute('type', 'number');
    scalarInput.attribute('step', '0.5');

    // Row 2: Buttons
    let row2Y = drawHeight + 50;

    applyButton = createButton('Apply Operation');
    applyButton.position(10, row2Y);
    applyButton.mousePressed(applyOperation);
    applyButton.style('background-color', '#4CAF50');
    applyButton.style('color', 'white');
    applyButton.style('border', 'none');
    applyButton.style('padding', '8px 16px');
    applyButton.style('cursor', 'pointer');

    undoButton = createButton('Undo');
    undoButton.position(140, row2Y);
    undoButton.mousePressed(undoOperation);

    resetButton = createButton('Reset');
    resetButton.position(200, row2Y);
    resetButton.mousePressed(resetMatrix);

    updateControlVisibility();

    describe('Interactive row operations practice tool for augmented matrices with swap, scale, and add operations', LABEL);
}

function draw() {
    updateCanvasSize();

    // Draw backgrounds
    fill('aliceblue');
    noStroke();
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke('silver');
    strokeWeight(1);
    noFill();
    rect(0, 0, canvasWidth, drawHeight);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('Row Operations Practice', canvasWidth/2, 10);

    // Draw matrix
    drawMatrix();

    // Draw operation history
    drawHistory();

    // Draw control labels
    drawControlLabels();

    // Update animation
    if (animating) {
        animationProgress += 0.05;
        if (animationProgress >= 1) {
            animating = false;
            highlightRows = [];
        }
    }
}

function drawMatrix() {
    let cellWidth = 60;
    let cellHeight = 40;
    let startX = canvasWidth/2 - (matrix[0].length * cellWidth)/2 - 30;
    let startY = 60;

    // Draw bracket
    stroke(0);
    strokeWeight(2);
    noFill();

    // Left bracket
    let bracketX = startX - 15;
    line(bracketX, startY - 10, bracketX, startY + matrix.length * cellHeight + 10);
    line(bracketX, startY - 10, bracketX + 10, startY - 10);
    line(bracketX, startY + matrix.length * cellHeight + 10, bracketX + 10, startY + matrix.length * cellHeight + 10);

    // Right bracket
    let rightX = startX + matrix[0].length * cellWidth + 5;
    line(rightX, startY - 10, rightX, startY + matrix.length * cellHeight + 10);
    line(rightX, startY - 10, rightX - 10, startY - 10);
    line(rightX, startY + matrix.length * cellHeight + 10, rightX - 10, startY + matrix.length * cellHeight + 10);

    // Vertical line for augmented matrix
    let augLine = startX + 3 * cellWidth - 5;
    stroke(100);
    strokeWeight(1);
    line(augLine, startY - 5, augLine, startY + matrix.length * cellHeight + 5);

    // Draw matrix entries
    textAlign(CENTER, CENTER);
    textSize(18);

    for (let i = 0; i < matrix.length; i++) {
        // Row label
        fill(100);
        noStroke();
        textSize(14);
        text('R' + (i+1), startX - 35, startY + i * cellHeight + cellHeight/2);
        textSize(18);

        // Highlight row if in animation
        if (highlightRows.includes(i)) {
            let alpha = animating ? 150 * (1 - animationProgress) : 150;
            fill(255, 255, 0, alpha);
            noStroke();
            rect(startX - 5, startY + i * cellHeight, matrix[0].length * cellWidth + 10, cellHeight, 5);
        }

        for (let j = 0; j < matrix[i].length; j++) {
            let x = startX + j * cellWidth + cellWidth/2;
            let y = startY + i * cellHeight + cellHeight/2;

            // Color: blue for coefficients, green for constants
            if (j < 3) {
                fill(0, 70, 150);
            } else {
                fill(0, 120, 0);
            }
            noStroke();

            // Format number
            let val = matrix[i][j];
            let displayVal;
            if (Number.isInteger(val)) {
                displayVal = val.toString();
            } else {
                displayVal = val.toFixed(2);
                // Remove trailing zeros
                displayVal = parseFloat(displayVal).toString();
            }
            text(displayVal, x, y);
        }
    }

    // Draw column labels
    fill(80);
    textSize(12);
    let labels = ['x', 'y', 'z', 'b'];
    for (let j = 0; j < labels.length; j++) {
        text(labels[j], startX + j * cellWidth + cellWidth/2, startY - 20);
    }
}

function drawHistory() {
    let startX = canvasWidth - 200;
    let startY = 60;

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text('Operation History:', startX, startY);

    textSize(12);
    let displayHistory = history.slice(-maxHistoryDisplay);
    for (let i = 0; i < displayHistory.length; i++) {
        fill(80);
        text((history.length - maxHistoryDisplay + i + 1) + '. ' + displayHistory[i].notation,
             startX, startY + 20 + i * 18);
    }

    if (history.length === 0) {
        fill(150);
        text('(no operations yet)', startX, startY + 20);
    }
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);

    let row1Y = drawHeight + 22;
    text('Operation:', 10, row1Y);

    // Dynamic labels based on operation type
    let op = opSelect.value();
    if (op === 'swap') {
        text('↔', 295, row1Y);
    } else if (op === 'scale') {
        text('× k =', 350, row1Y);
    } else if (op === 'add') {
        text('+', 295, row1Y);
        text('× k →', 350, row1Y);
    }

    // Row 2 info
    let row2Y = drawHeight + 62;
    fill(80);
    textSize(12);
    text('Tip: Scale by -1 to change signs, or by 1/2 to halve values', 280, row2Y);

    // Current operation preview
    let preview = getOperationNotation();
    textSize(14);
    fill(0, 100, 200);
    textAlign(LEFT, CENTER);
    text('Preview: ' + preview, 10, drawHeight + 95);
}

function updateControlVisibility() {
    let op = opSelect.value();

    if (op === 'swap') {
        row2Select.show();
        scalarInput.hide();
    } else if (op === 'scale') {
        row2Select.hide();
        scalarInput.show();
    } else if (op === 'add') {
        row2Select.show();
        scalarInput.show();
    }
}

function getOperationNotation() {
    let op = opSelect.value();
    let r1 = parseInt(row1Select.value());
    let r2 = parseInt(row2Select.value());
    let k = parseFloat(scalarInput.value()) || 0;

    if (op === 'swap') {
        return 'R' + (r1+1) + ' ↔ R' + (r2+1);
    } else if (op === 'scale') {
        return k + ' × R' + (r1+1) + ' → R' + (r1+1);
    } else if (op === 'add') {
        let sign = k >= 0 ? '+' : '';
        return 'R' + (r1+1) + ' ' + sign + ' ' + k + '×R' + (r2+1) + ' → R' + (r1+1);
    }
    return '';
}

function applyOperation() {
    let op = opSelect.value();
    let r1 = parseInt(row1Select.value());
    let r2 = parseInt(row2Select.value());
    let k = parseFloat(scalarInput.value()) || 0;

    // Validate
    if (op === 'scale' && k === 0) {
        alert('Cannot scale by 0!');
        return;
    }

    if (op === 'swap' && r1 === r2) {
        alert('Select different rows to swap!');
        return;
    }

    // Save state for undo
    let prevMatrix = JSON.parse(JSON.stringify(matrix));
    let notation = getOperationNotation();

    // Apply operation
    if (op === 'swap') {
        let temp = matrix[r1];
        matrix[r1] = matrix[r2];
        matrix[r2] = temp;
        highlightRows = [r1, r2];
    } else if (op === 'scale') {
        for (let j = 0; j < matrix[r1].length; j++) {
            matrix[r1][j] *= k;
        }
        highlightRows = [r1];
    } else if (op === 'add') {
        for (let j = 0; j < matrix[r1].length; j++) {
            matrix[r1][j] += k * matrix[r2][j];
        }
        highlightRows = [r1];
    }

    // Add to history
    history.push({
        notation: notation,
        prevMatrix: prevMatrix
    });

    // Start animation
    animating = true;
    animationProgress = 0;
}

function undoOperation() {
    if (history.length > 0) {
        let lastOp = history.pop();
        matrix = lastOp.prevMatrix;
        highlightRows = [];
    }
}

function resetMatrix() {
    matrix = JSON.parse(JSON.stringify(originalMatrix));
    history = [];
    highlightRows = [];
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        containerWidth = container.offsetWidth;
        canvasWidth = Math.max(500, containerWidth);
    }
}
