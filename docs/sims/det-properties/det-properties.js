// Determinant Properties Explorer
// Interactive exploration of how row operations affect determinants

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Original matrix
let originalMatrix = [[2, 1], [3, 4]];
// Modified matrix
let modifiedMatrix = [[2, 1], [3, 4]];

// Current operation
let currentOp = 'none';
let scaleK = 2;
let swapRows = [0, 1];
let addFromRow = 0;
let addToRow = 1;
let addMultiple = 1;

// Controls
let swapButton;
let scaleButton;
let addButton;
let transposeButton;
let resetButton;
let kSlider;

// Grid settings
let gridSize = 40;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Create operation buttons
    swapButton = createButton('Swap Rows');
    swapButton.position(10, drawHeight + 10);
    swapButton.mousePressed(() => applyOperation('swap'));

    scaleButton = createButton('Scale Row');
    scaleButton.position(95, drawHeight + 10);
    scaleButton.mousePressed(() => applyOperation('scale'));

    addButton = createButton('Add Rows');
    addButton.position(180, drawHeight + 10);
    addButton.mousePressed(() => applyOperation('add'));

    transposeButton = createButton('Transpose');
    transposeButton.position(265, drawHeight + 10);
    transposeButton.mousePressed(() => applyOperation('transpose'));

    resetButton = createButton('Reset');
    resetButton.position(10, drawHeight + 45);
    resetButton.mousePressed(resetMatrix);

    kSlider = createSlider(-3, 3, 2, 0.5);
    kSlider.position(sliderLeftMargin, drawHeight + 45);
    kSlider.size(canvasWidth - sliderLeftMargin - margin);

    describe('Interactive determinant properties explorer showing how row operations affect the determinant value', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    scaleK = kSlider.value();

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Determinant Properties Explorer', canvasWidth / 2, 10);

    // Draw both matrices side by side
    let leftX = 30;
    let rightX = canvasWidth / 2 + 30;
    let matrixY = 50;

    drawMatrix(originalMatrix, leftX, matrixY, 'Original A');
    drawMatrix(modifiedMatrix, rightX, matrixY, 'Modified A\'');

    // Draw determinants
    let detOriginal = det2x2(originalMatrix);
    let detModified = det2x2(modifiedMatrix);

    drawDeterminantInfo(leftX, matrixY + 110, detOriginal);
    drawDeterminantInfo(rightX, matrixY + 110, detModified);

    // Draw geometric visualization
    drawGeometricView(originalMatrix, leftX + 30, 230, color(100, 100, 200, 100));
    drawGeometricView(modifiedMatrix, rightX + 30, 230, color(200, 100, 100, 100));

    // Draw property explanation
    drawPropertyExplanation(detOriginal, detModified);

    // Update slider
    kSlider.size(canvasWidth - sliderLeftMargin - margin);

    // Draw k value label
    fill('black');
    noStroke();
    textSize(14);
    textAlign(LEFT, CENTER);
    text('k = ' + scaleK, sliderLeftMargin - 50, drawHeight + 55);
}

function drawMatrix(mat, x, y, label) {
    let cellW = 45;
    let cellH = 35;

    // Label
    fill(0);
    noStroke();
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(label, x + cellW, y - 5);

    // Brackets
    stroke(0);
    strokeWeight(2);
    noFill();
    // Left
    line(x - 5, y - 3, x - 10, y - 3);
    line(x - 10, y - 3, x - 10, y + 2*cellH + 3);
    line(x - 10, y + 2*cellH + 3, x - 5, y + 2*cellH + 3);
    // Right
    line(x + 2*cellW + 5, y - 3, x + 2*cellW + 10, y - 3);
    line(x + 2*cellW + 10, y - 3, x + 2*cellW + 10, y + 2*cellH + 3);
    line(x + 2*cellW + 10, y + 2*cellH + 3, x + 2*cellW + 5, y + 2*cellH + 3);

    // Cells
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let cx = x + j * cellW;
            let cy = y + i * cellH;

            fill(255);
            stroke(180);
            strokeWeight(1);
            rect(cx, cy, cellW, cellH);

            fill(0);
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            let val = mat[i][j];
            text(Number.isInteger(val) ? val : val.toFixed(1), cx + cellW/2, cy + cellH/2);
        }
    }
}

function drawDeterminantInfo(x, y, det) {
    fill(0);
    noStroke();
    textSize(13);
    textAlign(LEFT, TOP);
    text('det = ', x, y);

    if (det > 0) {
        fill(0, 150, 0);
    } else if (det < 0) {
        fill(200, 0, 0);
    } else {
        fill(100);
    }
    textSize(16);
    text(Number.isInteger(det) ? det : det.toFixed(2), x + 40, y - 2);
}

function drawGeometricView(mat, centerX, centerY, col) {
    let scale = 15;

    // Draw mini axes
    stroke(180);
    strokeWeight(1);
    line(centerX - 50, centerY, centerX + 50, centerY);
    line(centerX, centerY - 50, centerX, centerY + 50);

    // Column vectors
    let v1 = { x: mat[0][0], y: mat[1][0] };
    let v2 = { x: mat[0][1], y: mat[1][1] };

    // Parallelogram
    fill(col);
    stroke(red(col), green(col), blue(col));
    strokeWeight(1);
    beginShape();
    vertex(centerX, centerY);
    vertex(centerX + v1.x * scale, centerY - v1.y * scale);
    vertex(centerX + (v1.x + v2.x) * scale, centerY - (v1.y + v2.y) * scale);
    vertex(centerX + v2.x * scale, centerY - v2.y * scale);
    endShape(CLOSE);

    // Vectors
    stroke(150, 50, 50);
    strokeWeight(2);
    line(centerX, centerY, centerX + v1.x * scale, centerY - v1.y * scale);
    stroke(50, 50, 150);
    line(centerX, centerY, centerX + v2.x * scale, centerY - v2.y * scale);
}

function drawPropertyExplanation(detOrig, detMod) {
    let boxX = 10;
    let boxY = 340;
    let boxW = canvasWidth - 20;
    let boxH = 50;

    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(boxX, boxY, boxW, boxH, 5);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    let explanation = '';
    let ratio = '';

    if (currentOp === 'swap') {
        explanation = 'Swapping rows negates the determinant';
        ratio = 'det(A\') = -det(A)';
    } else if (currentOp === 'scale') {
        explanation = 'Scaling a row by k multiplies det by k';
        ratio = 'det(A\') = k × det(A) = ' + scaleK + ' × ' + detOrig + ' = ' + detMod;
    } else if (currentOp === 'add') {
        explanation = 'Adding a multiple of one row to another: det unchanged';
        ratio = 'det(A\') = det(A) = ' + detOrig;
    } else if (currentOp === 'transpose') {
        explanation = 'Transposing does not change the determinant';
        ratio = 'det(A\') = det(A) = ' + detOrig;
    } else {
        explanation = 'Click an operation button to explore properties';
        ratio = 'det(A) = ' + detOrig;
    }

    text(explanation, boxX + 10, boxY + 8);
    fill(80);
    textSize(13);
    text(ratio, boxX + 10, boxY + 28);
}

function applyOperation(op) {
    currentOp = op;

    if (op === 'swap') {
        // Swap rows 0 and 1
        modifiedMatrix = [
            [...originalMatrix[1]],
            [...originalMatrix[0]]
        ];
    } else if (op === 'scale') {
        // Scale row 0 by k
        modifiedMatrix = [
            [originalMatrix[0][0] * scaleK, originalMatrix[0][1] * scaleK],
            [...originalMatrix[1]]
        ];
    } else if (op === 'add') {
        // Add k times row 0 to row 1
        modifiedMatrix = [
            [...originalMatrix[0]],
            [originalMatrix[1][0] + scaleK * originalMatrix[0][0],
             originalMatrix[1][1] + scaleK * originalMatrix[0][1]]
        ];
    } else if (op === 'transpose') {
        // Transpose
        modifiedMatrix = [
            [originalMatrix[0][0], originalMatrix[1][0]],
            [originalMatrix[0][1], originalMatrix[1][1]]
        ];
    }
}

function resetMatrix() {
    originalMatrix = [[2, 1], [3, 4]];
    modifiedMatrix = [[2, 1], [3, 4]];
    currentOp = 'none';
}

function det2x2(mat) {
    return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    kSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
