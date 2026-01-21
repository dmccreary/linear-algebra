// Power Iteration Algorithm Visualization
// Shows how power iteration converges to the dominant eigenvector

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix A (2x2)
let matrix = [[3, 1], [1, 2]];

// True eigenvalues/eigenvectors (computed analytically)
let trueEigenvalues = [];
let trueEigenvectors = [];

// Power iteration state
let currentVector = { x: 1, y: 0 };
let iterationHistory = [];
let iteration = 0;
let maxIterations = 50;

// Rayleigh quotient estimate
let rayleighEstimate = 0;

// Layout
let leftPanelWidth;
let originX, originY;
let gridScale = 60;

// Controls
let stepButton, runButton, resetButton;
let speedSlider;
let isRunning = false;

// Matrix input
let selectedCell = null;
let inputBuffer = '';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    leftPanelWidth = canvasWidth * 0.55;
    originX = leftPanelWidth / 2;
    originY = drawHeight / 2;

    // Create controls
    stepButton = createButton('Step');
    stepButton.position(10, drawHeight + 10);
    stepButton.mousePressed(doStep);

    runButton = createButton('Run');
    runButton.position(60, drawHeight + 10);
    runButton.mousePressed(toggleRun);

    resetButton = createButton('Reset');
    resetButton.position(110, drawHeight + 10);
    resetButton.mousePressed(resetIteration);

    speedSlider = createSlider(1, 30, 10, 1);
    speedSlider.position(220, drawHeight + 10);
    speedSlider.size(canvasWidth - 250);

    computeTrueEigen();
    resetIteration();

    describe('Power iteration algorithm visualization showing convergence to the dominant eigenvector through repeated matrix-vector multiplication', LABEL);
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

    leftPanelWidth = canvasWidth * 0.55;
    originX = leftPanelWidth / 2;

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('Power Iteration Algorithm', canvasWidth / 2, 8);

    // Draw matrix input
    drawMatrixInput();

    // Draw vector space visualization
    drawVectorSpace();

    // Draw convergence plot
    drawConvergencePlot();

    // Draw info panel
    drawInfoPanel();

    // Auto-run
    if (isRunning && frameCount % (35 - speedSlider.value()) === 0) {
        if (iteration < maxIterations) {
            doStep();
        } else {
            isRunning = false;
            runButton.html('Run');
        }
    }

    // Control labels
    fill(100);
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Speed:', 175, drawHeight + 22);

    textAlign(LEFT, TOP);
    text('Iteration: ' + iteration + ' / ' + maxIterations, 10, drawHeight + 50);
}

function drawMatrixInput() {
    let panelX = leftPanelWidth + 10;
    let panelY = 35;
    let panelW = canvasWidth - leftPanelWidth - 20;
    let panelH = 100;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Title
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('Matrix A', panelX + panelW/2, panelY + 5);

    // Matrix cells
    let cellW = 35;
    let cellH = 28;
    let matrixX = panelX + (panelW - 2*cellW) / 2;
    let matrixY = panelY + 25;

    // Brackets
    stroke(0);
    strokeWeight(1.5);
    noFill();
    line(matrixX - 5, matrixY - 3, matrixX - 8, matrixY - 3);
    line(matrixX - 8, matrixY - 3, matrixX - 8, matrixY + 2*cellH + 3);
    line(matrixX - 8, matrixY + 2*cellH + 3, matrixX - 5, matrixY + 2*cellH + 3);

    line(matrixX + 2*cellW + 5, matrixY - 3, matrixX + 2*cellW + 8, matrixY - 3);
    line(matrixX + 2*cellW + 8, matrixY - 3, matrixX + 2*cellW + 8, matrixY + 2*cellH + 3);
    line(matrixX + 2*cellW + 8, matrixY + 2*cellH + 3, matrixX + 2*cellW + 5, matrixY + 2*cellH + 3);

    // Cells
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                fill(200, 220, 255);
                stroke(100, 150, 255);
            } else {
                fill(255);
                stroke(180);
            }
            strokeWeight(1);
            rect(x, y, cellW, cellH, 3);

            fill(0);
            noStroke();
            textSize(12);
            textAlign(CENTER, CENTER);
            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                text(inputBuffer + '|', x + cellW/2, y + cellH/2);
            } else {
                text(matrix[i][j], x + cellW/2, y + cellH/2);
            }
        }
    }

    // Eigenvalue ratio
    if (trueEigenvalues.length >= 2) {
        let ratio = abs(trueEigenvalues[1] / trueEigenvalues[0]);
        fill(100);
        textSize(9);
        textAlign(CENTER, TOP);
        text('|λ₂/λ₁| = ' + ratio.toFixed(3), panelX + panelW/2, matrixY + 2*cellH + 8);
    }
}

function drawVectorSpace() {
    // Title
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('Vector Space', originX, 28);

    // Grid
    stroke(235);
    strokeWeight(1);
    for (let i = -3; i <= 3; i++) {
        let x = originX + i * gridScale / 2;
        let y = originY + i * gridScale / 2;
        if (x > 0 && x < leftPanelWidth) {
            line(x, 45, x, drawHeight - 150);
        }
        if (y > 45 && y < drawHeight - 150) {
            line(5, y, leftPanelWidth - 5, y);
        }
    }

    // Axes
    stroke(180);
    strokeWeight(1);
    line(5, originY, leftPanelWidth - 5, originY);
    line(originX, 45, originX, drawHeight - 150);

    // True dominant eigenvector direction (dashed line)
    if (trueEigenvectors.length > 0) {
        let ev = trueEigenvectors[0];
        let mag = sqrt(ev.x*ev.x + ev.y*ev.y);
        if (mag > 0.01) {
            let ux = ev.x / mag;
            let uy = ev.y / mag;

            stroke(100, 200, 100, 150);
            strokeWeight(2);
            drawDashedLine(
                originX - ux * 150, originY + uy * 150,
                originX + ux * 150, originY - uy * 150
            );
        }
    }

    // Draw iteration history (faded)
    for (let i = 0; i < iterationHistory.length - 1; i++) {
        let v = iterationHistory[i];
        let alpha = map(i, 0, iterationHistory.length - 1, 50, 150);

        let vx = originX + v.x * gridScale;
        let vy = originY - v.y * gridScale;

        stroke(100, 150, 255, alpha);
        strokeWeight(1);
        line(originX, originY, vx, vy);

        fill(100, 150, 255, alpha);
        noStroke();
        ellipse(vx, vy, 5, 5);
    }

    // Current vector
    let cvx = originX + currentVector.x * gridScale;
    let cvy = originY - currentVector.y * gridScale;

    // Line from origin
    stroke(33, 150, 243);
    strokeWeight(3);
    line(originX, originY, cvx, cvy);

    // Arrowhead
    fill(33, 150, 243);
    noStroke();
    let angle = atan2(-currentVector.y, currentVector.x);
    push();
    translate(cvx, cvy);
    rotate(-angle);
    triangle(0, 0, -12, -6, -12, 6);
    pop();

    // Current vector label
    textSize(10);
    textAlign(LEFT, CENTER);
    text('x_' + iteration, cvx + 10, cvy);

    // Legend
    fill(100, 200, 100);
    textSize(9);
    textAlign(LEFT, TOP);
    text('— True eigenvector', 10, drawHeight - 145);

    fill(33, 150, 243);
    text('→ Current iterate', 10, drawHeight - 130);
}

function drawConvergencePlot() {
    let plotX = 15;
    let plotY = drawHeight - 115;
    let plotW = leftPanelWidth - 30;
    let plotH = 80;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(plotX, plotY, plotW, plotH, 5);

    // Title
    fill(0);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    text('Convergence (angle error)', plotX + plotW/2, plotY + 3);

    // Plot area
    let innerX = plotX + 25;
    let innerY = plotY + 18;
    let innerW = plotW - 35;
    let innerH = plotH - 28;

    // Axes
    stroke(180);
    strokeWeight(1);
    line(innerX, innerY + innerH, innerX + innerW, innerY + innerH);
    line(innerX, innerY, innerX, innerY + innerH);

    // Y-axis label
    fill(100);
    textSize(8);
    textAlign(RIGHT, CENTER);
    text('90°', innerX - 3, innerY);
    text('0°', innerX - 3, innerY + innerH);

    // X-axis label
    textAlign(CENTER, TOP);
    text('iteration', innerX + innerW/2, innerY + innerH + 2);

    // Compute and plot angle errors
    if (iterationHistory.length > 1 && trueEigenvectors.length > 0) {
        let ev = trueEigenvectors[0];
        let evMag = sqrt(ev.x*ev.x + ev.y*ev.y);
        if (evMag < 0.01) return;

        let evx = ev.x / evMag;
        let evy = ev.y / evMag;

        stroke(244, 67, 54);
        strokeWeight(2);
        noFill();
        beginShape();

        for (let i = 0; i < iterationHistory.length; i++) {
            let v = iterationHistory[i];
            let vMag = sqrt(v.x*v.x + v.y*v.y);
            if (vMag < 0.01) continue;

            let vx = v.x / vMag;
            let vy = v.y / vMag;

            let dot = abs(vx * evx + vy * evy);
            dot = constrain(dot, -1, 1);
            let angle = acos(dot) * 180 / PI;

            let px = map(i, 0, maxIterations, innerX, innerX + innerW);
            let py = map(angle, 0, 90, innerY + innerH, innerY);

            vertex(px, py);
        }

        endShape();

        // Theoretical convergence rate line
        if (trueEigenvalues.length >= 2) {
            let ratio = abs(trueEigenvalues[1] / trueEigenvalues[0]);

            stroke(100, 200, 100, 150);
            strokeWeight(1);
            noFill();
            beginShape();

            let initial = iterationHistory.length > 0 ? iterationHistory[0] : { x: 1, y: 0 };
            let iMag = sqrt(initial.x*initial.x + initial.y*initial.y);
            let ix = initial.x / iMag;
            let iy = initial.y / iMag;
            let initialDot = abs(ix * evx + iy * evy);
            let initialAngle = acos(constrain(initialDot, -1, 1)) * 180 / PI;

            for (let i = 0; i <= maxIterations; i++) {
                let theoreticalAngle = initialAngle * pow(ratio, i);
                theoreticalAngle = constrain(theoreticalAngle, 0, 90);

                let px = map(i, 0, maxIterations, innerX, innerX + innerW);
                let py = map(theoreticalAngle, 0, 90, innerY + innerH, innerY);

                vertex(px, py);
            }
            endShape();
        }
    }
}

function drawInfoPanel() {
    let panelX = leftPanelWidth + 10;
    let panelY = 145;
    let panelW = canvasWidth - leftPanelWidth - 20;
    let panelH = drawHeight - panelY - 10;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    fill(0);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);

    let y = panelY + 8;
    let lineH = 14;

    // True eigenvalues
    text('True eigenvalues:', panelX + 8, y);
    y += lineH;
    fill(100);
    textSize(9);
    for (let i = 0; i < trueEigenvalues.length; i++) {
        text('λ' + (i+1) + ' = ' + trueEigenvalues[i].toFixed(4), panelX + 12, y);
        y += lineH - 2;
    }

    y += 8;
    fill(0);
    textSize(10);
    text('Rayleigh quotient:', panelX + 8, y);
    y += lineH;
    fill(33, 150, 243);
    textSize(11);
    text('λ ≈ ' + rayleighEstimate.toFixed(4), panelX + 12, y);

    y += lineH + 5;
    fill(0);
    textSize(10);
    text('Current vector:', panelX + 8, y);
    y += lineH;
    fill(100);
    textSize(9);
    text('(' + currentVector.x.toFixed(3) + ', ' + currentVector.y.toFixed(3) + ')', panelX + 12, y);

    // Convergence status
    y += lineH + 8;
    let error = computeAngleError();
    if (error < 0.1) {
        fill(76, 175, 80);
        textSize(10);
        text('✓ Converged!', panelX + 8, y);
    } else {
        fill(100);
        textSize(9);
        text('Error: ' + error.toFixed(2) + '°', panelX + 8, y);
    }
}

function drawDashedLine(x1, y1, x2, y2) {
    let steps = 20;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
    }
}

function computeTrueEigen() {
    let a = matrix[0][0], b = matrix[0][1];
    let c = matrix[1][0], d = matrix[1][1];

    let trace = a + d;
    let det = a * d - b * c;
    let discriminant = trace * trace - 4 * det;

    trueEigenvalues = [];
    trueEigenvectors = [];

    if (discriminant >= 0) {
        let sqrtD = sqrt(discriminant);
        let lambda1 = (trace + sqrtD) / 2;
        let lambda2 = (trace - sqrtD) / 2;

        // Sort by absolute value (dominant first)
        if (abs(lambda1) >= abs(lambda2)) {
            trueEigenvalues = [lambda1, lambda2];
        } else {
            trueEigenvalues = [lambda2, lambda1];
        }

        // Compute eigenvectors
        for (let lam of trueEigenvalues) {
            let ev;
            if (abs(b) > 0.0001) {
                ev = { x: b, y: lam - a };
            } else if (abs(a - lam) > 0.0001) {
                ev = { x: 0, y: 1 };
            } else {
                ev = { x: 1, y: 0 };
            }

            let mag = sqrt(ev.x*ev.x + ev.y*ev.y);
            if (mag > 0.0001) {
                ev.x /= mag;
                ev.y /= mag;
            }
            trueEigenvectors.push(ev);
        }
    }
}

function doStep() {
    if (iteration >= maxIterations) return;

    // y = Ax
    let y = {
        x: matrix[0][0] * currentVector.x + matrix[0][1] * currentVector.y,
        y: matrix[1][0] * currentVector.x + matrix[1][1] * currentVector.y
    };

    // Normalize
    let mag = sqrt(y.x*y.x + y.y*y.y);
    if (mag > 0.0001) {
        currentVector = { x: y.x / mag, y: y.y / mag };
    }

    // Compute Rayleigh quotient: x^T A x / x^T x
    let Ax = {
        x: matrix[0][0] * currentVector.x + matrix[0][1] * currentVector.y,
        y: matrix[1][0] * currentVector.x + matrix[1][1] * currentVector.y
    };
    let xTAx = currentVector.x * Ax.x + currentVector.y * Ax.y;
    let xTx = currentVector.x * currentVector.x + currentVector.y * currentVector.y;
    rayleighEstimate = xTAx / xTx;

    iteration++;
    iterationHistory.push({ ...currentVector });
}

function computeAngleError() {
    if (trueEigenvectors.length === 0) return 90;

    let ev = trueEigenvectors[0];
    let evMag = sqrt(ev.x*ev.x + ev.y*ev.y);
    if (evMag < 0.01) return 90;

    let evx = ev.x / evMag;
    let evy = ev.y / evMag;

    let vMag = sqrt(currentVector.x*currentVector.x + currentVector.y*currentVector.y);
    if (vMag < 0.01) return 90;

    let vx = currentVector.x / vMag;
    let vy = currentVector.y / vMag;

    let dot = abs(vx * evx + vy * evy);
    dot = constrain(dot, -1, 1);
    return acos(dot) * 180 / PI;
}

function toggleRun() {
    isRunning = !isRunning;
    runButton.html(isRunning ? 'Pause' : 'Run');
}

function resetIteration() {
    iteration = 0;
    // Random starting vector
    let angle = random(TWO_PI);
    currentVector = { x: cos(angle), y: sin(angle) };
    iterationHistory = [{ ...currentVector }];
    rayleighEstimate = 0;
    isRunning = false;
    runButton.html('Run');
}

function mousePressed() {
    let panelX = leftPanelWidth + 10;
    let panelW = canvasWidth - leftPanelWidth - 20;
    let cellW = 35;
    let cellH = 28;
    let matrixX = panelX + (panelW - 2*cellW) / 2;
    let matrixY = 35 + 25;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            if (mouseX >= x && mouseX <= x + cellW && mouseY >= y && mouseY <= y + cellH) {
                if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                    commitInput();
                } else {
                    commitInput();
                    selectedCell = { i: i, j: j };
                    inputBuffer = '';
                }
                return;
            }
        }
    }
    commitInput();
}

function keyPressed() {
    if (selectedCell) {
        if (keyCode === ENTER || keyCode === TAB) {
            commitInput();
            return false;
        } else if (keyCode === ESCAPE) {
            inputBuffer = '';
            selectedCell = null;
            return false;
        } else if (keyCode === BACKSPACE) {
            inputBuffer = inputBuffer.slice(0, -1);
            return false;
        }
    }
}

function keyTyped() {
    if (selectedCell) {
        if ((key >= '0' && key <= '9') || key === '-' || key === '.') {
            inputBuffer += key;
        }
        return false;
    }
}

function commitInput() {
    if (selectedCell && inputBuffer !== '') {
        let value = parseFloat(inputBuffer);
        if (!isNaN(value)) {
            value = Math.round(constrain(value, -10, 10) * 10) / 10;
            matrix[selectedCell.i][selectedCell.j] = value;
            computeTrueEigen();
            resetIteration();
        }
    }
    inputBuffer = '';
    selectedCell = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    speedSlider.size(canvasWidth - 250);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
