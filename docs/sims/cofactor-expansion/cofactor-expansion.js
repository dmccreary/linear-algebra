// Cofactor Expansion Visualizer
// Shows step-by-step cofactor expansion for computing determinants

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix values (3x3)
let matrix = [[2, 1, 3], [4, 5, 6], [7, 8, 9]];

// Animation state
let currentStep = 0;
let totalSteps = 4; // 0=initial, 1-3 for each cofactor, 4=result
let expandRow = 0; // Row to expand along (0-indexed)

// Controls
let stepButton;
let playButton;
let resetButton;
let rowSelect;
let showSignsCheckbox;

let isPlaying = false;
let lastStepTime = 0;
let stepInterval = 2000;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Create controls
    stepButton = createButton('Step');
    stepButton.position(10, drawHeight + 10);
    stepButton.mousePressed(nextStep);

    playButton = createButton('Play');
    playButton.position(60, drawHeight + 10);
    playButton.mousePressed(togglePlay);

    resetButton = createButton('Reset');
    resetButton.position(115, drawHeight + 10);
    resetButton.mousePressed(resetAnimation);

    rowSelect = createSelect();
    rowSelect.position(10, drawHeight + 45);
    rowSelect.option('Expand Row 1');
    rowSelect.option('Expand Row 2');
    rowSelect.option('Expand Row 3');
    rowSelect.changed(changeRow);

    showSignsCheckbox = createCheckbox(' Show Sign Pattern', true);
    showSignsCheckbox.position(130, drawHeight + 45);
    showSignsCheckbox.style('font-size', '14px');

    describe('Interactive cofactor expansion visualizer showing step-by-step determinant calculation through minors and cofactors', LABEL);
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

    // Auto-advance if playing
    if (isPlaying && millis() - lastStepTime > stepInterval) {
        nextStep();
        lastStepTime = millis();
        if (currentStep === 0) {
            isPlaying = false;
            playButton.html('Play');
        }
    }

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Cofactor Expansion Visualizer', canvasWidth / 2, 10);

    // Draw main matrix
    drawMainMatrix();

    // Draw sign pattern if enabled
    if (showSignsCheckbox.checked()) {
        drawSignPattern();
    }

    // Draw expansion steps
    drawExpansionSteps();

    // Draw step indicator
    fill(100);
    textSize(12);
    textAlign(RIGHT, TOP);
    text('Step ' + currentStep + '/' + totalSteps, canvasWidth - 20, drawHeight - 20);
}

function drawMainMatrix() {
    let matrixX = 30;
    let matrixY = 45;
    let cellW = 40;
    let cellH = 35;

    // Label
    fill(0);
    noStroke();
    textSize(16);
    textAlign(RIGHT, CENTER);
    text('A =', matrixX - 5, matrixY + 1.5*cellH);

    // Draw brackets
    stroke(0);
    strokeWeight(2);
    noFill();
    // Left bracket
    line(matrixX - 5, matrixY - 5, matrixX - 12, matrixY - 5);
    line(matrixX - 12, matrixY - 5, matrixX - 12, matrixY + 3*cellH + 5);
    line(matrixX - 12, matrixY + 3*cellH + 5, matrixX - 5, matrixY + 3*cellH + 5);
    // Right bracket
    line(matrixX + 3*cellW + 5, matrixY - 5, matrixX + 3*cellW + 12, matrixY - 5);
    line(matrixX + 3*cellW + 12, matrixY - 5, matrixX + 3*cellW + 12, matrixY + 3*cellH + 5);
    line(matrixX + 3*cellW + 12, matrixY + 3*cellH + 5, matrixX + 3*cellW + 5, matrixY + 3*cellH + 5);

    // Draw cells
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            // Highlight based on current step
            let isExpansionRow = (i === expandRow);
            let isCurrentColumn = (currentStep > 0 && currentStep <= 3 && j === currentStep - 1);

            if (isExpansionRow && isCurrentColumn) {
                fill(255, 255, 150);
                stroke(255, 200, 0);
                strokeWeight(2);
            } else if (isExpansionRow) {
                fill(255, 255, 220);
                stroke(180);
                strokeWeight(1);
            } else if (currentStep > 0 && currentStep <= 3 && i !== expandRow && j !== currentStep - 1) {
                // Cells that form the minor
                fill(220, 240, 255);
                stroke(100, 150, 200);
                strokeWeight(2);
            } else {
                fill(255);
                stroke(180);
                strokeWeight(1);
            }
            rect(x, y, cellW, cellH);

            // Value
            fill(0);
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            text(matrix[i][j], x + cellW/2, y + cellH/2);
        }
    }

    // Row indicator
    fill(100);
    textSize(11);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < 3; i++) {
        let arrow = (i === expandRow) ? '→' : '';
        text(arrow, matrixX + 3*cellW + 18, matrixY + i*cellH + cellH/2);
    }
}

function drawSignPattern() {
    let patX = canvasWidth - 130;
    let patY = 45;
    let cellW = 30;
    let cellH = 25;

    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Sign Pattern', patX + 1.5*cellW, patY - 18);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = patX + j * cellW;
            let y = patY + i * cellH;

            let sign = ((i + j) % 2 === 0) ? '+' : '-';
            let isCurrentPos = (currentStep > 0 && currentStep <= 3 && i === expandRow && j === currentStep - 1);

            if (isCurrentPos) {
                fill(sign === '+' ? color(200, 255, 200) : color(255, 200, 200));
            } else {
                fill(245);
            }
            stroke(180);
            strokeWeight(1);
            rect(x, y, cellW, cellH);

            fill(sign === '+' ? color(0, 150, 0) : color(200, 0, 0));
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            text(sign, x + cellW/2, y + cellH/2);
        }
    }
}

function drawExpansionSteps() {
    let stepY = 170;

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text('Expansion along Row ' + (expandRow + 1) + ':', 20, stepY);

    // Show formula
    textSize(13);
    text('det(A) = Σ aᵢⱼ × Cᵢⱼ', 20, stepY + 22);

    // Show each term
    let termY = stepY + 50;
    let runningSum = 0;

    for (let j = 0; j < 3; j++) {
        let sign = ((expandRow + j) % 2 === 0) ? 1 : -1;
        let signStr = sign > 0 ? '+' : '-';
        let aij = matrix[expandRow][j];
        let minor = getMinor(expandRow, j);
        let minorDet = minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0];
        let cofactor = sign * minorDet;
        let term = aij * cofactor;

        let isActive = (currentStep === j + 1);
        let isShown = (currentStep > j);

        if (isActive) {
            fill(0, 100, 200);
            textSize(13);
        } else if (isShown) {
            fill(80);
            textSize(12);
        } else {
            fill(180);
            textSize(12);
        }
        textAlign(LEFT, TOP);

        // Term number
        let termText = (j + 1) + '. ';

        // Sign and coefficient
        if (j === 0) {
            termText += signStr + ' ' + Math.abs(aij);
        } else {
            termText += signStr + ' ' + Math.abs(aij);
        }

        // Minor determinant
        termText += ' × det[' + minor[0][0] + ',' + minor[0][1] + ';' + minor[1][0] + ',' + minor[1][1] + ']';

        if (isShown) {
            termText += ' = ' + signStr + Math.abs(aij) + ' × ' + minorDet + ' = ' + (j === 0 ? '' : (term >= 0 ? '+' : '')) + term;
            runningSum += term;
        }

        text(termText, 30, termY + j * 25);

        // Draw minor matrix if active
        if (isActive) {
            drawMinorMatrix(minor, canvasWidth - 120, termY + 20);
        }
    }

    // Final result
    if (currentStep === 4) {
        fill(0);
        textSize(14);
        textAlign(LEFT, TOP);

        let det = calculateDeterminant();
        text('det(A) = ' + det, 20, termY + 85);

        // Status
        textSize(11);
        fill(100);
        if (det === 0) {
            text('(Singular matrix)', 100, termY + 87);
        }
    }
}

function drawMinorMatrix(minor, x, y) {
    let cellW = 30;
    let cellH = 25;

    // Label
    fill(0, 100, 200);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('Minor M', x + cellW, y - 15);

    // Brackets
    stroke(100);
    strokeWeight(1);
    noFill();
    line(x - 3, y - 2, x - 8, y - 2);
    line(x - 8, y - 2, x - 8, y + 2*cellH + 2);
    line(x - 8, y + 2*cellH + 2, x - 3, y + 2*cellH + 2);

    line(x + 2*cellW + 3, y - 2, x + 2*cellW + 8, y - 2);
    line(x + 2*cellW + 8, y - 2, x + 2*cellW + 8, y + 2*cellH + 2);
    line(x + 2*cellW + 8, y + 2*cellH + 2, x + 2*cellW + 3, y + 2*cellH + 2);

    // Cells
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let cx = x + j * cellW;
            let cy = y + i * cellH;

            fill(220, 240, 255);
            stroke(100, 150, 200);
            strokeWeight(1);
            rect(cx, cy, cellW, cellH);

            fill(0);
            noStroke();
            textSize(14);
            textAlign(CENTER, CENTER);
            text(minor[i][j], cx + cellW/2, cy + cellH/2);
        }
    }
}

function getMinor(row, col) {
    let minor = [];
    for (let i = 0; i < 3; i++) {
        if (i === row) continue;
        let minorRow = [];
        for (let j = 0; j < 3; j++) {
            if (j === col) continue;
            minorRow.push(matrix[i][j]);
        }
        minor.push(minorRow);
    }
    return minor;
}

function calculateDeterminant() {
    let det = 0;
    for (let j = 0; j < 3; j++) {
        let sign = ((expandRow + j) % 2 === 0) ? 1 : -1;
        let minor = getMinor(expandRow, j);
        let minorDet = minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0];
        det += sign * matrix[expandRow][j] * minorDet;
    }
    return det;
}

function nextStep() {
    currentStep++;
    if (currentStep > totalSteps) {
        currentStep = 0;
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    playButton.html(isPlaying ? 'Pause' : 'Play');
    lastStepTime = millis();
}

function resetAnimation() {
    currentStep = 0;
    isPlaying = false;
    playButton.html('Play');
}

function changeRow() {
    let selected = rowSelect.value();
    if (selected === 'Expand Row 1') expandRow = 0;
    else if (selected === 'Expand Row 2') expandRow = 1;
    else expandRow = 2;
    resetAnimation();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
