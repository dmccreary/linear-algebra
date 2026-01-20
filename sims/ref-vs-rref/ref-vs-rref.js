// REF vs RREF Comparison MicroSim
// Side-by-side comparison of Row Echelon Form and Reduced Row Echelon Form
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 900;
let drawHeight = 380;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 15;
let defaultTextSize = 16;

// Matrix data
let originalMatrix;
let refMatrix;
let rrefMatrix;

// UI elements
let newSystemButton;
let sizeSelect;
let showStepsCheckbox;

// Current matrix size
let matrixSize = 3;

// Operation counts
let refOps = 0;
let rrefOps = 0;

// Font
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

    // Generate initial system
    generateNewSystem();

    // Controls
    let row1Y = drawHeight + 20;

    sizeSelect = createSelect();
    sizeSelect.position(80, row1Y);
    sizeSelect.option('2×2', 2);
    sizeSelect.option('3×3', 3);
    sizeSelect.option('4×4', 4);
    sizeSelect.selected(3);
    sizeSelect.changed(() => {
        matrixSize = parseInt(sizeSelect.value());
        generateNewSystem();
    });

    newSystemButton = createButton('New Random System');
    newSystemButton.position(150, row1Y);
    newSystemButton.mousePressed(generateNewSystem);
    newSystemButton.style('background-color', '#4CAF50');
    newSystemButton.style('color', 'white');

    showStepsCheckbox = createCheckbox(' Show operation counts', true);
    showStepsCheckbox.position(320, row1Y + 3);
    showStepsCheckbox.style('font-size', '14px');

    describe('Side-by-side comparison of Row Echelon Form and Reduced Row Echelon Form showing the differences and operation counts', LABEL);
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
    text('REF vs RREF Comparison', canvasWidth/2, 8);

    // Layout: three matrices side by side
    let matrixWidth = (canvasWidth - 60) / 3;

    // Draw original matrix
    drawMatrixSection(originalMatrix, 'Original Matrix', 20, 45, matrixWidth, 'black', []);

    // Arrow
    drawArrow(20 + matrixWidth - 10, 150, 20 + matrixWidth + 15, 150);

    // Draw REF
    let refPivots = findPivots(refMatrix);
    drawMatrixSection(refMatrix, 'Row Echelon Form (REF)', 30 + matrixWidth, 45, matrixWidth, 'blue', refPivots);

    // Arrow
    drawArrow(30 + 2*matrixWidth - 10, 150, 30 + 2*matrixWidth + 15, 150);

    // Draw RREF
    let rrefPivots = findPivots(rrefMatrix);
    drawMatrixSection(rrefMatrix, 'Reduced REF (RREF)', 40 + 2*matrixWidth, 45, matrixWidth, 'green', rrefPivots);

    // Draw comparison info
    drawComparisonInfo();

    // Draw control labels
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    text('Size:', 20, drawHeight + 32);
}

function drawMatrixSection(matrix, title, x, y, width, color, pivots) {
    // Section title
    fill(color);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14);
    text(title, x + width/2, y);

    // Draw matrix
    let cellWidth = 45;
    let cellHeight = 32;
    let numRows = matrix.length;
    let numCols = matrix[0].length;
    let matrixStartX = x + width/2 - (numCols * cellWidth)/2;
    let matrixStartY = y + 30;

    // Brackets
    stroke(80);
    strokeWeight(2);
    noFill();
    let bracketX = matrixStartX - 10;
    let rightX = matrixStartX + numCols * cellWidth + 5;
    line(bracketX, matrixStartY - 5, bracketX, matrixStartY + numRows * cellHeight + 5);
    line(bracketX, matrixStartY - 5, bracketX + 8, matrixStartY - 5);
    line(bracketX, matrixStartY + numRows * cellHeight + 5, bracketX + 8, matrixStartY + numRows * cellHeight + 5);
    line(rightX, matrixStartY - 5, rightX, matrixStartY + numRows * cellHeight + 5);
    line(rightX, matrixStartY - 5, rightX - 8, matrixStartY - 5);
    line(rightX, matrixStartY + numRows * cellHeight + 5, rightX - 8, matrixStartY + numRows * cellHeight + 5);

    // Augmented line
    let augX = matrixStartX + (numCols - 1) * cellWidth - 3;
    stroke(150);
    strokeWeight(1);
    line(augX, matrixStartY - 3, augX, matrixStartY + numRows * cellHeight + 3);

    // Matrix entries
    textAlign(CENTER, CENTER);
    textSize(14);

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let cx = matrixStartX + j * cellWidth + cellWidth/2;
            let cy = matrixStartY + i * cellHeight + cellHeight/2;

            // Highlight pivot
            let isPivot = pivots.some(p => p[0] === i && p[1] === j);
            if (isPivot) {
                fill(255, 215, 0, 180);
                noStroke();
                circle(cx, cy, 28);
            }

            // Highlight zeros below pivots (REF property)
            let isBelowPivot = pivots.some(p => p[1] === j && i > p[0]);
            if (isBelowPivot && Math.abs(matrix[i][j]) < 0.001 && j < numCols - 1) {
                fill(200, 255, 200, 150);
                noStroke();
                rect(cx - cellWidth/2 + 2, cy - cellHeight/2 + 2, cellWidth - 4, cellHeight - 4, 3);
            }

            // Highlight zeros above pivots (RREF property)
            if (color === 'green') {
                let isAbovePivot = pivots.some(p => p[1] === j && i < p[0]);
                if (isAbovePivot && Math.abs(matrix[i][j]) < 0.001 && j < numCols - 1) {
                    fill(200, 255, 200, 150);
                    noStroke();
                    rect(cx - cellWidth/2 + 2, cy - cellHeight/2 + 2, cellWidth - 4, cellHeight - 4, 3);
                }
            }

            // Entry color
            if (j < numCols - 1) {
                fill(0, 50, 120);
            } else {
                fill(0, 100, 0);
            }
            noStroke();

            text(formatNumber(matrix[i][j]), cx, cy);
        }
    }

    // Operation count
    if (showStepsCheckbox.checked()) {
        let ops = (color === 'blue') ? refOps : (color === 'green') ? rrefOps : 0;
        if (color !== 'black') {
            fill(100);
            textSize(11);
            textAlign(CENTER, TOP);
            text(ops + ' operations', x + width/2, matrixStartY + numRows * cellHeight + 12);
        }
    }
}

function drawArrow(x1, y1, x2, y2) {
    stroke(100);
    strokeWeight(2);
    line(x1, y1, x2, y2);
    // Arrowhead
    let angle = atan2(y2 - y1, x2 - x1);
    let headLen = 8;
    line(x2, y2, x2 - headLen * cos(angle - PI/6), y2 - headLen * sin(angle - PI/6));
    line(x2, y2, x2 - headLen * cos(angle + PI/6), y2 - headLen * sin(angle + PI/6));
}

function drawComparisonInfo() {
    let infoY = 250;
    let col1X = 50;
    let col2X = canvasWidth/2 + 30;

    // REF properties
    fill(0, 70, 150);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(13);
    text('REF Properties:', col1X, infoY);

    fill(60);
    textSize(12);
    text('• Zero rows at bottom', col1X + 10, infoY + 20);
    text('• Leading entry right of row above', col1X + 10, infoY + 38);
    text('• All zeros below leading entries', col1X + 10, infoY + 56);
    text('• Solve via back substitution', col1X + 10, infoY + 74);

    // RREF properties
    fill(0, 120, 0);
    textSize(13);
    text('RREF Additional Properties:', col2X, infoY);

    fill(60);
    textSize(12);
    text('• Each leading entry is 1', col2X + 10, infoY + 20);
    text('• Leading 1 is only nonzero in its column', col2X + 10, infoY + 38);
    text('• Solution is directly readable', col2X + 10, infoY + 56);
    text('• Unique for any matrix', col2X + 10, infoY + 74);

    // Legend
    let legY = infoY + 100;
    textSize(11);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Legend:', col1X, legY);

    fill(255, 215, 0);
    noStroke();
    circle(col1X + 55, legY, 14);
    fill(60);
    text('= Pivot', col1X + 68, legY);

    fill(200, 255, 200);
    rect(col1X + 130, legY - 8, 16, 16, 2);
    fill(60);
    text('= Created zero', col1X + 150, legY);
}

function findPivots(matrix) {
    let pivots = [];
    let pivotCol = 0;
    for (let i = 0; i < matrix.length; i++) {
        while (pivotCol < matrix[0].length - 1) {
            if (Math.abs(matrix[i][pivotCol]) > 0.001) {
                pivots.push([i, pivotCol]);
                pivotCol++;
                break;
            }
            pivotCol++;
        }
    }
    return pivots;
}

function generateNewSystem() {
    // Generate random matrix with integer entries
    originalMatrix = [];
    for (let i = 0; i < matrixSize; i++) {
        let row = [];
        for (let j = 0; j <= matrixSize; j++) {
            row.push(Math.floor(Math.random() * 13) - 6); // -6 to 6
        }
        originalMatrix.push(row);
    }

    // Make sure it's not singular (has a unique solution)
    // Simple check: ensure diagonal dominance roughly
    for (let i = 0; i < matrixSize; i++) {
        if (Math.abs(originalMatrix[i][i]) < 2) {
            originalMatrix[i][i] = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 2);
        }
    }

    // Compute REF and RREF
    computeForms();
}

function computeForms() {
    // Deep copy
    refMatrix = JSON.parse(JSON.stringify(originalMatrix));
    rrefMatrix = JSON.parse(JSON.stringify(originalMatrix));

    refOps = 0;
    rrefOps = 0;

    // Compute REF
    let n = refMatrix.length;
    let m = refMatrix[0].length;
    let pivotRow = 0;

    for (let col = 0; col < m - 1 && pivotRow < n; col++) {
        // Find pivot
        let maxRow = pivotRow;
        for (let i = pivotRow + 1; i < n; i++) {
            if (Math.abs(refMatrix[i][col]) > Math.abs(refMatrix[maxRow][col])) {
                maxRow = i;
            }
        }

        if (Math.abs(refMatrix[maxRow][col]) < 0.0001) continue;

        // Swap
        if (maxRow !== pivotRow) {
            [refMatrix[pivotRow], refMatrix[maxRow]] = [refMatrix[maxRow], refMatrix[pivotRow]];
            refOps++;
        }

        // Eliminate below
        for (let i = pivotRow + 1; i < n; i++) {
            if (Math.abs(refMatrix[i][col]) > 0.0001) {
                let factor = refMatrix[i][col] / refMatrix[pivotRow][col];
                for (let j = col; j < m; j++) {
                    refMatrix[i][j] -= factor * refMatrix[pivotRow][j];
                }
                refOps++;
            }
        }
        pivotRow++;
    }

    // Compute RREF (continue from REF)
    rrefMatrix = JSON.parse(JSON.stringify(refMatrix));
    rrefOps = refOps;

    // Make pivots 1 and eliminate above
    for (let i = n - 1; i >= 0; i--) {
        // Find pivot column
        let pivotCol = -1;
        for (let j = 0; j < m - 1; j++) {
            if (Math.abs(rrefMatrix[i][j]) > 0.0001) {
                pivotCol = j;
                break;
            }
        }

        if (pivotCol === -1) continue;

        // Scale to make pivot 1
        let pivot = rrefMatrix[i][pivotCol];
        if (Math.abs(pivot - 1) > 0.0001) {
            for (let j = pivotCol; j < m; j++) {
                rrefMatrix[i][j] /= pivot;
            }
            rrefOps++;
        }

        // Eliminate above
        for (let k = 0; k < i; k++) {
            if (Math.abs(rrefMatrix[k][pivotCol]) > 0.0001) {
                let factor = rrefMatrix[k][pivotCol];
                for (let j = pivotCol; j < m; j++) {
                    rrefMatrix[k][j] -= factor * rrefMatrix[i][j];
                }
                rrefOps++;
            }
        }
    }
}

function formatNumber(val) {
    if (Math.abs(val) < 0.001) return '0';
    let rounded = Math.round(val * 100) / 100;
    if (Number.isInteger(rounded)) return rounded.toString();
    return rounded.toFixed(2);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        containerWidth = container.offsetWidth;
        canvasWidth = Math.max(700, containerWidth);
    }
}
