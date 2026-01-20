// Gaussian Elimination Step-by-Step Visualizer
// Guides students through the complete algorithm
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// Matrix data
let matrix;
let originalMatrix;
let solution = [];

// Algorithm state
let currentPhase = 'forward'; // 'forward', 'backward', 'done'
let currentRow = 0;
let currentCol = 0;
let currentSubStep = 0; // 0: find pivot, 1: swap if needed, 2+: eliminate row i
let eliminatingRow = 1;

// UI elements
let nextButton, autoButton, resetButton;
let speedSlider;
let exampleSelect;

// Animation
let autoSolving = false;
let lastStepTime = 0;

// Explanation text
let explanation = 'Click "Next Step" to begin Gaussian elimination';

// Font
let font;

// Example systems
const examples = {
    '3x3': [
        [2, 1, -1, 8],
        [-3, -1, 2, -11],
        [-2, 1, 2, -3]
    ],
    '3x3 easy': [
        [1, 2, 1, 4],
        [2, -1, 1, 1],
        [1, 1, -1, 1]
    ],
    '2x2': [
        [2, 3, 8],
        [1, -1, 1]
    ]
};

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont(font);
    textSize(defaultTextSize);

    // Initialize with first example
    resetToExample('3x3');

    // Controls - Row 1
    let row1Y = drawHeight + 15;

    exampleSelect = createSelect();
    exampleSelect.position(80, row1Y);
    exampleSelect.option('3×3 System', '3x3');
    exampleSelect.option('3×3 Easy', '3x3 easy');
    exampleSelect.option('2×2 System', '2x2');
    exampleSelect.changed(() => resetToExample(exampleSelect.value()));

    nextButton = createButton('Next Step');
    nextButton.position(200, row1Y);
    nextButton.mousePressed(nextStep);
    nextButton.style('background-color', '#4CAF50');
    nextButton.style('color', 'white');
    nextButton.style('border', 'none');
    nextButton.style('padding', '8px 16px');

    autoButton = createButton('Auto Solve');
    autoButton.position(300, row1Y);
    autoButton.mousePressed(toggleAutoSolve);

    resetButton = createButton('Reset');
    resetButton.position(400, row1Y);
    resetButton.mousePressed(() => resetToExample(exampleSelect.value()));

    // Speed slider
    speedSlider = createSlider(0.5, 3, 1, 0.1);
    speedSlider.position(550, row1Y);
    speedSlider.size(100);

    describe('Step-by-step Gaussian elimination visualizer showing the algorithm with explanations', LABEL);
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

    // Draw title and phase indicator
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('Gaussian Elimination', canvasWidth/2, 10);

    // Phase indicator
    textSize(14);
    let phaseText = currentPhase === 'forward' ? 'Forward Elimination' :
                    currentPhase === 'backward' ? 'Back Substitution' : 'Complete!';
    fill(currentPhase === 'done' ? 'green' : 'blue');
    text('Phase: ' + phaseText, canvasWidth/2, 35);

    // Draw matrix
    drawMatrix();

    // Draw explanation
    drawExplanation();

    // Draw solution if complete
    if (currentPhase === 'done') {
        drawSolution();
    }

    // Draw control labels
    drawControlLabels();

    // Auto-solve logic
    if (autoSolving && millis() - lastStepTime > 1000 / speedSlider.value()) {
        if (currentPhase !== 'done') {
            nextStep();
            lastStepTime = millis();
        } else {
            autoSolving = false;
            autoButton.html('Auto Solve');
        }
    }
}

function drawMatrix() {
    let cellWidth = 55;
    let cellHeight = 40;
    let numCols = matrix[0].length;
    let numRows = matrix.length;
    let startX = canvasWidth/2 - (numCols * cellWidth)/2 - 20;
    let startY = 70;

    // Draw bracket
    stroke(0);
    strokeWeight(2);
    noFill();

    // Left bracket
    let bracketX = startX - 15;
    line(bracketX, startY - 10, bracketX, startY + numRows * cellHeight + 10);
    line(bracketX, startY - 10, bracketX + 10, startY - 10);
    line(bracketX, startY + numRows * cellHeight + 10, bracketX + 10, startY + numRows * cellHeight + 10);

    // Right bracket
    let rightX = startX + numCols * cellWidth + 5;
    line(rightX, startY - 10, rightX, startY + numRows * cellHeight + 10);
    line(rightX, startY - 10, rightX - 10, startY - 10);
    line(rightX, startY + numRows * cellHeight + 10, rightX - 10, startY + numRows * cellHeight + 10);

    // Vertical augmented line
    let augLine = startX + (numCols - 1) * cellWidth - 5;
    stroke(100);
    strokeWeight(1);
    line(augLine, startY - 5, augLine, startY + numRows * cellHeight + 5);

    // Draw entries
    textAlign(CENTER, CENTER);
    textSize(16);

    for (let i = 0; i < numRows; i++) {
        // Highlight pivot row
        if (currentPhase === 'forward' && i === currentRow) {
            fill(255, 255, 150, 180);
            noStroke();
            rect(startX - 5, startY + i * cellHeight, numCols * cellWidth + 10, cellHeight, 5);
        }

        // Highlight row being eliminated
        if (currentPhase === 'forward' && currentSubStep >= 2 && i === eliminatingRow) {
            fill(200, 220, 255, 180);
            noStroke();
            rect(startX - 5, startY + i * cellHeight, numCols * cellWidth + 10, cellHeight, 5);
        }

        for (let j = 0; j < numCols; j++) {
            let x = startX + j * cellWidth + cellWidth/2;
            let y = startY + i * cellHeight + cellHeight/2;

            // Highlight pivot position
            if (currentPhase === 'forward' && i === currentRow && j === currentCol) {
                fill(255, 200, 0);
                noStroke();
                circle(x, y, 35);
            }

            // Color entries
            if (j < numCols - 1) {
                fill(0, 70, 150);
            } else {
                fill(0, 120, 0);
            }
            noStroke();

            let val = matrix[i][j];
            let displayVal = formatNumber(val);
            text(displayVal, x, y);
        }
    }
}

function drawExplanation() {
    // Explanation box
    let boxX = 20;
    let boxY = 70 + matrix.length * 45 + 20;
    let boxW = canvasWidth - 40;
    let boxH = 60;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(boxX, boxY, boxW, boxH, 8);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);

    // Word wrap the explanation
    let words = explanation.split(' ');
    let line = '';
    let y = boxY + 10;
    let lineHeight = 18;

    for (let word of words) {
        let testLine = line + word + ' ';
        if (textWidth(testLine) > boxW - 20) {
            text(line, boxX + 10, y);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    text(line, boxX + 10, y);
}

function drawSolution() {
    let solX = canvasWidth - 180;
    let solY = 80;

    fill(240, 255, 240);
    stroke(0, 150, 0);
    strokeWeight(2);
    rect(solX, solY, 160, 30 + solution.length * 25, 8);

    fill(0, 100, 0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text('Solution:', solX + 10, solY + 8);

    textSize(16);
    let vars = ['x', 'y', 'z', 'w'];
    for (let i = 0; i < solution.length; i++) {
        text(vars[i] + ' = ' + formatNumber(solution[i]), solX + 15, solY + 30 + i * 25);
    }
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);

    text('Example:', 10, drawHeight + 27);
    text('Speed:', 490, drawHeight + 27);
}

function nextStep() {
    if (currentPhase === 'done') return;

    if (currentPhase === 'forward') {
        executeForwardStep();
    } else if (currentPhase === 'backward') {
        executeBackwardStep();
    }
}

function executeForwardStep() {
    let numRows = matrix.length;
    let numCols = matrix[0].length - 1; // exclude augmented column

    if (currentSubStep === 0) {
        // Find pivot
        if (currentCol >= numCols || currentRow >= numRows) {
            // Done with forward elimination
            currentPhase = 'backward';
            currentRow = numRows - 1;
            explanation = 'Forward elimination complete! Starting back substitution...';
            return;
        }

        // Check if we need to swap (find non-zero pivot)
        let pivotRow = -1;
        for (let i = currentRow; i < numRows; i++) {
            if (Math.abs(matrix[i][currentCol]) > 0.0001) {
                pivotRow = i;
                break;
            }
        }

        if (pivotRow === -1) {
            // No pivot in this column, move to next
            currentCol++;
            explanation = 'Column ' + (currentCol) + ' has no valid pivot. Moving to next column.';
            return;
        }

        if (pivotRow !== currentRow) {
            // Need to swap
            currentSubStep = 1;
            eliminatingRow = pivotRow;
            explanation = 'Pivot position (' + (currentRow+1) + ',' + (currentCol+1) + ') has value ' +
                         formatNumber(matrix[currentRow][currentCol]) + '. Need to swap with row ' + (pivotRow+1) +
                         ' to get non-zero pivot.';
        } else {
            // Pivot is already in place
            currentSubStep = 2;
            eliminatingRow = currentRow + 1;
            explanation = 'Pivot is ' + formatNumber(matrix[currentRow][currentCol]) +
                         ' at position (' + (currentRow+1) + ',' + (currentCol+1) + '). ' +
                         'Now eliminating entries below the pivot.';
        }
    } else if (currentSubStep === 1) {
        // Execute swap
        let temp = matrix[currentRow];
        matrix[currentRow] = matrix[eliminatingRow];
        matrix[eliminatingRow] = temp;

        explanation = 'Swapped R' + (currentRow+1) + ' ↔ R' + (eliminatingRow+1) + '. ' +
                     'Pivot is now ' + formatNumber(matrix[currentRow][currentCol]) + '.';

        currentSubStep = 2;
        eliminatingRow = currentRow + 1;
    } else {
        // Eliminate entries below pivot
        if (eliminatingRow >= numRows) {
            // Done with this column
            currentRow++;
            currentCol++;
            currentSubStep = 0;
            explanation = 'Column ' + currentCol + ' complete. Moving to next pivot position.';
            return;
        }

        let pivot = matrix[currentRow][currentCol];
        let target = matrix[eliminatingRow][currentCol];

        if (Math.abs(target) < 0.0001) {
            explanation = 'Entry at (' + (eliminatingRow+1) + ',' + (currentCol+1) + ') is already 0. Skipping.';
            eliminatingRow++;
            return;
        }

        let multiplier = -target / pivot;

        // Apply row operation
        for (let j = 0; j < matrix[eliminatingRow].length; j++) {
            matrix[eliminatingRow][j] += multiplier * matrix[currentRow][j];
        }

        explanation = 'R' + (eliminatingRow+1) + ' + (' + formatNumber(multiplier) + ')×R' + (currentRow+1) +
                     ' → R' + (eliminatingRow+1) + '. Created zero at position (' + (eliminatingRow+1) + ',' + (currentCol+1) + ').';

        eliminatingRow++;
    }
}

function executeBackwardStep() {
    if (currentRow < 0) {
        currentPhase = 'done';
        explanation = 'Gaussian elimination complete! Solution found by back substitution.';
        return;
    }

    let numCols = matrix[0].length;

    // Find the pivot column for this row
    let pivotCol = -1;
    for (let j = 0; j < numCols - 1; j++) {
        if (Math.abs(matrix[currentRow][j]) > 0.0001) {
            pivotCol = j;
            break;
        }
    }

    if (pivotCol === -1) {
        // Row of zeros, skip
        currentRow--;
        return;
    }

    // Solve for variable
    let pivot = matrix[currentRow][pivotCol];
    let rhs = matrix[currentRow][numCols - 1];

    // Substitute known values
    for (let j = pivotCol + 1; j < numCols - 1; j++) {
        if (solution[j] !== undefined) {
            rhs -= matrix[currentRow][j] * solution[j];
        }
    }

    let varValue = rhs / pivot;
    solution[pivotCol] = varValue;

    let vars = ['x', 'y', 'z', 'w'];
    explanation = 'From row ' + (currentRow+1) + ': ' + vars[pivotCol] + ' = ' + formatNumber(varValue);

    currentRow--;
}

function toggleAutoSolve() {
    autoSolving = !autoSolving;
    autoButton.html(autoSolving ? 'Pause' : 'Auto Solve');
    lastStepTime = millis();
}

function resetToExample(name) {
    matrix = JSON.parse(JSON.stringify(examples[name]));
    originalMatrix = JSON.parse(JSON.stringify(matrix));
    currentPhase = 'forward';
    currentRow = 0;
    currentCol = 0;
    currentSubStep = 0;
    eliminatingRow = 1;
    solution = [];
    autoSolving = false;
    if (autoButton) autoButton.html('Auto Solve');
    explanation = 'Click "Next Step" to begin Gaussian elimination. The yellow circle marks the current pivot.';
}

function formatNumber(val) {
    if (Math.abs(val) < 0.0001) return '0';
    if (Number.isInteger(val)) return val.toString();
    let rounded = Math.round(val * 100) / 100;
    return rounded.toString();
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
