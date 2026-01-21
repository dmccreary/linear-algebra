// Cramer's Rule Interactive Solver
// Step-by-step visualization of solving systems using determinants

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// System: Ax = b
// Default: 2x + 3y = 7, x + 4y = 9
let A = [[2, 3], [1, 4]];
let b = [7, 9];

// Animation state
let currentStep = 0;
let totalSteps = 4; // 0=system, 1=det(A), 2=det(A₁), 3=det(A₂), 4=solution

// Controls
let stepButton;
let playButton;
let resetButton;
let randomButton;
let singularButton;

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

    randomButton = createButton('Random');
    randomButton.position(10, drawHeight + 45);
    randomButton.mousePressed(setRandom);

    singularButton = createButton('Singular');
    singularButton.position(80, drawHeight + 45);
    singularButton.mousePressed(setSingular);

    describe('Interactive Cramer\'s Rule solver showing step-by-step determinant calculations and geometric interpretation', LABEL);
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
    text("Cramer's Rule Solver", canvasWidth / 2, 10);

    // Draw system of equations
    drawSystemOfEquations();

    // Draw step-by-step solution
    drawSolutionSteps();

    // Draw geometric view
    drawGeometricView();

    // Draw step indicator
    fill(100);
    textSize(12);
    textAlign(RIGHT, TOP);
    text('Step ' + currentStep + '/' + totalSteps, canvasWidth - 20, drawHeight - 20);
}

function drawSystemOfEquations() {
    let x = 20;
    let y = 45;

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text('System of Equations:', x, y);

    textSize(13);
    // First equation
    let eq1 = formatTerm(A[0][0], 'x', true) + formatTerm(A[0][1], 'y', false) + ' = ' + b[0];
    text(eq1, x + 10, y + 22);

    // Second equation
    let eq2 = formatTerm(A[1][0], 'x', true) + formatTerm(A[1][1], 'y', false) + ' = ' + b[1];
    text(eq2, x + 10, y + 40);

    // Matrix form
    textSize(12);
    fill(100);
    text('Matrix form: Ax = b', x, y + 65);
}

function formatTerm(coef, varName, isFirst) {
    if (coef === 0) return '';
    let sign = coef >= 0 ? (isFirst ? '' : ' + ') : ' - ';
    let absCoef = Math.abs(coef);
    if (absCoef === 1) {
        return sign + varName;
    }
    return sign + absCoef + varName;
}

function drawSolutionSteps() {
    let x = 20;
    let y = 130;

    let detA = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    let A1 = [[b[0], A[0][1]], [b[1], A[1][1]]];
    let A2 = [[A[0][0], b[0]], [A[1][0], b[1]]];
    let detA1 = A1[0][0] * A1[1][1] - A1[0][1] * A1[1][0];
    let detA2 = A2[0][0] * A2[1][1] - A2[0][1] * A2[1][0];

    // Step 1: det(A)
    fill(currentStep >= 1 ? 0 : 180);
    textSize(13);
    textAlign(LEFT, TOP);
    text('Step 1: Compute det(A)', x, y);

    if (currentStep >= 1) {
        textSize(12);
        drawMiniMatrix(A, x + 20, y + 18, currentStep === 1);
        text('= ' + A[0][0] + '×' + A[1][1] + ' - ' + A[0][1] + '×' + A[1][0] + ' = ' + detA, x + 90, y + 32);

        if (detA === 0) {
            fill(200, 0, 0);
            textSize(11);
            text('det(A) = 0: No unique solution!', x + 20, y + 52);
        }
    }

    // Step 2: det(A₁)
    y += 70;
    fill(currentStep >= 2 ? 0 : 180);
    textSize(13);
    text('Step 2: Compute det(A₁) [replace col 1 with b]', x, y);

    if (currentStep >= 2) {
        textSize(12);
        drawMiniMatrix(A1, x + 20, y + 18, currentStep === 2, 0);
        fill(currentStep === 2 ? color(0, 100, 200) : 0);
        text('= ' + detA1, x + 90, y + 32);
    }

    // Step 3: det(A₂)
    y += 60;
    fill(currentStep >= 3 ? 0 : 180);
    textSize(13);
    text('Step 3: Compute det(A₂) [replace col 2 with b]', x, y);

    if (currentStep >= 3) {
        textSize(12);
        drawMiniMatrix(A2, x + 20, y + 18, currentStep === 3, 1);
        fill(currentStep === 3 ? color(0, 100, 200) : 0);
        text('= ' + detA2, x + 90, y + 32);
    }

    // Step 4: Solution
    y += 60;
    fill(currentStep >= 4 ? 0 : 180);
    textSize(13);
    text('Step 4: Apply Cramer\'s Rule', x, y);

    if (currentStep >= 4) {
        textSize(12);
        if (detA !== 0) {
            let xSol = detA1 / detA;
            let ySol = detA2 / detA;

            fill(0, 100, 200);
            text('x = det(A₁)/det(A) = ' + detA1 + '/' + detA + ' = ' + xSol.toFixed(3), x + 20, y + 18);
            text('y = det(A₂)/det(A) = ' + detA2 + '/' + detA + ' = ' + ySol.toFixed(3), x + 20, y + 35);

            fill(0, 150, 0);
            textSize(14);
            text('Solution: (' + xSol.toFixed(2) + ', ' + ySol.toFixed(2) + ')', x + 20, y + 55);
        } else {
            fill(200, 0, 0);
            text('No unique solution (det(A) = 0)', x + 20, y + 18);
        }
    }
}

function drawMiniMatrix(mat, x, y, highlight, replacedCol) {
    let cellW = 25;
    let cellH = 20;

    // Brackets
    stroke(highlight ? color(0, 100, 200) : 100);
    strokeWeight(1);
    noFill();
    line(x - 3, y - 2, x - 6, y - 2);
    line(x - 6, y - 2, x - 6, y + 2*cellH + 2);
    line(x - 6, y + 2*cellH + 2, x - 3, y + 2*cellH + 2);

    line(x + 2*cellW + 3, y - 2, x + 2*cellW + 6, y - 2);
    line(x + 2*cellW + 6, y - 2, x + 2*cellW + 6, y + 2*cellH + 2);
    line(x + 2*cellW + 6, y + 2*cellH + 2, x + 2*cellW + 3, y + 2*cellH + 2);

    // Values
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let cx = x + j * cellW + cellW/2;
            let cy = y + i * cellH + cellH/2;

            // Highlight replaced column
            if (replacedCol !== undefined && j === replacedCol) {
                fill(255, 220, 150);
                noStroke();
                rect(x + j * cellW, y + i * cellH, cellW, cellH);
                fill(200, 100, 0);
            } else {
                fill(0);
            }
            text(mat[i][j], cx, cy);
        }
    }
}

function drawGeometricView() {
    let detA = A[0][0] * A[1][1] - A[0][1] * A[1][0];

    // Only draw if we have a solution
    if (currentStep < 4 || detA === 0) return;

    let detA1 = b[0] * A[1][1] - A[0][1] * b[1];
    let detA2 = A[0][0] * b[1] - b[0] * A[1][0];
    let xSol = detA1 / detA;
    let ySol = detA2 / detA;

    // Draw mini coordinate system
    let viewX = canvasWidth - 130;
    let viewY = 60;
    let viewW = 120;
    let viewH = 100;
    let scale = 12;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(viewX - 10, viewY - 15, viewW, viewH + 20, 10);

    // Title
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('Geometric View', viewX + viewW/2 - 10, viewY - 12);

    let centerX = viewX + 40;
    let centerY = viewY + 50;

    // Axes
    stroke(180);
    strokeWeight(1);
    line(centerX - 40, centerY, centerX + 60, centerY);
    line(centerX, centerY - 40, centerX, centerY + 40);

    // Draw the two lines
    // Line 1: A[0][0]*x + A[0][1]*y = b[0]
    stroke(200, 80, 80);
    strokeWeight(2);
    drawLine2D(A[0][0], A[0][1], b[0], centerX, centerY, scale);

    // Line 2: A[1][0]*x + A[1][1]*y = b[1]
    stroke(80, 80, 200);
    strokeWeight(2);
    drawLine2D(A[1][0], A[1][1], b[1], centerX, centerY, scale);

    // Solution point
    fill(0, 180, 0);
    noStroke();
    ellipse(centerX + xSol * scale, centerY - ySol * scale, 10, 10);

    // Label
    fill(0, 150, 0);
    textSize(9);
    textAlign(LEFT, TOP);
    text('(' + xSol.toFixed(1) + ',' + ySol.toFixed(1) + ')', centerX + xSol * scale + 5, centerY - ySol * scale - 5);
}

function drawLine2D(a, b, c, cx, cy, scale) {
    // Draw line ax + by = c
    if (Math.abs(b) > 0.01) {
        // y = (c - ax) / b
        let x1 = -5, x2 = 8;
        let y1 = (c - a * x1) / b;
        let y2 = (c - a * x2) / b;
        line(cx + x1 * scale, cy - y1 * scale, cx + x2 * scale, cy - y2 * scale);
    } else if (Math.abs(a) > 0.01) {
        // Vertical line x = c/a
        let x = c / a;
        line(cx + x * scale, cy - 50, cx + x * scale, cy + 50);
    }
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

function setRandom() {
    A = [
        [Math.floor(random(-5, 6)), Math.floor(random(-5, 6))],
        [Math.floor(random(-5, 6)), Math.floor(random(-5, 6))]
    ];
    // Ensure non-singular
    while (A[0][0] * A[1][1] - A[0][1] * A[1][0] === 0) {
        A[1][1] = Math.floor(random(-5, 6));
    }
    b = [Math.floor(random(-10, 11)), Math.floor(random(-10, 11))];
    resetAnimation();
}

function setSingular() {
    A = [[2, 4], [1, 2]];  // det = 0
    b = [6, 3];
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
