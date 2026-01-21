// Matrix Power Calculator
// Demonstrates how diagonalization simplifies computing matrix powers

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 80;

// Matrix A (2x2)
let matrix = [[2, 1], [0, 3]];

// Diagonalization components
let P = [];
let D = [];
let Pinv = [];
let eigenvalues = [];
let eigenvectors = [];
let isDiagonalizable = true;

// Power
let power = 5;

// Result matrices
let resultDirect = [];
let resultDiag = [];

// Controls
let powerSlider;
let randomButton;
let diagButton;
let defectiveButton;
let showStepsCheckbox;

// Matrix input
let selectedCell = null;
let inputBuffer = '';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Create controls
    powerSlider = createSlider(1, 20, 5, 1);
    powerSlider.position(sliderLeftMargin, drawHeight + 10);
    powerSlider.size(canvasWidth - sliderLeftMargin - margin);

    randomButton = createButton('Random');
    randomButton.position(10, drawHeight + 45);
    randomButton.mousePressed(setRandomMatrix);

    diagButton = createButton('Diagonalizable');
    diagButton.position(75, drawHeight + 45);
    diagButton.mousePressed(setDiagonalizableMatrix);

    defectiveButton = createButton('Defective');
    defectiveButton.position(175, drawHeight + 45);
    defectiveButton.mousePressed(setDefectiveMatrix);

    showStepsCheckbox = createCheckbox(' Show Steps', true);
    showStepsCheckbox.position(255, drawHeight + 45);
    showStepsCheckbox.style('font-size', '13px');

    computeDiagonalization();
    computePowers();

    describe('Matrix power calculator showing how diagonalization simplifies computing A^k using eigenvalue decomposition', LABEL);
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

    power = powerSlider.value();

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('Matrix Power Calculator: A^' + power, canvasWidth / 2, 8);

    // Draw matrix input
    drawMatrixInput();

    // Compute and display
    computePowers();

    if (isDiagonalizable) {
        if (showStepsCheckbox.checked()) {
            drawDiagonalizationSteps();
        }
        drawResult();
    } else {
        drawDefectiveMessage();
    }

    // Power slider label
    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text('k = ' + power, 10, drawHeight + 22);
}

function drawMatrixInput() {
    let matrixX = 25;
    let matrixY = 40;
    let cellW = 40;
    let cellH = 35;

    // Background panel
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(matrixX - 15, matrixY - 10, 120, 100, 8);

    // Label
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Matrix A', matrixX + 40, matrixY - 5);

    // Matrix brackets
    let my = matrixY + 15;
    stroke(0);
    strokeWeight(2);
    noFill();
    line(matrixX - 8, my - 3, matrixX - 12, my - 3);
    line(matrixX - 12, my - 3, matrixX - 12, my + 2*cellH + 3);
    line(matrixX - 12, my + 2*cellH + 3, matrixX - 8, my + 2*cellH + 3);

    line(matrixX + 2*cellW + 8, my - 3, matrixX + 2*cellW + 12, my - 3);
    line(matrixX + 2*cellW + 12, my - 3, matrixX + 2*cellW + 12, my + 2*cellH + 3);
    line(matrixX + 2*cellW + 12, my + 2*cellH + 3, matrixX + 2*cellW + 8, my + 2*cellH + 3);

    // Draw cells
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + j * cellW;
            let y = my + i * cellH;

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
            textSize(14);
            textAlign(CENTER, CENTER);
            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                text(inputBuffer + '|', x + cellW/2, y + cellH/2);
            } else {
                text(matrix[i][j], x + cellW/2, y + cellH/2);
            }
        }
    }

    // Click instruction
    fill(100);
    textSize(9);
    textAlign(CENTER, TOP);
    text('Click to edit', matrixX + 40, my + 2*cellH + 8);
}

function drawDiagonalizationSteps() {
    let startX = 150;
    let startY = 45;

    // Title
    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Diagonalization: A = PDP⁻¹', startX, startY);

    // Show P, D, P⁻¹
    let cellW = 28;
    let cellH = 22;
    let spacing = 75;

    // P matrix
    drawSmallMatrix(startX + 10, startY + 25, P, 'P', cellW, cellH);

    // D matrix
    drawSmallMatrix(startX + spacing + 10, startY + 25, D, 'D', cellW, cellH);

    // P⁻¹ matrix
    drawSmallMatrix(startX + 2*spacing + 10, startY + 25, Pinv, 'P⁻¹', cellW, cellH);

    // Power formula
    fill(0);
    textSize(11);
    textAlign(LEFT, TOP);
    text('A^' + power + ' = PD^' + power + 'P⁻¹', startX, startY + 90);

    // D^k is easy to compute
    let Dk = [[Math.pow(eigenvalues[0], power), 0], [0, Math.pow(eigenvalues[1], power)]];

    // Show D^k
    textSize(10);
    text('D^' + power + ' = diag(λ₁^' + power + ', λ₂^' + power + ')', startX, startY + 110);
    text('    = diag(' + formatNum(eigenvalues[0]) + '^' + power + ', ' + formatNum(eigenvalues[1]) + '^' + power + ')', startX, startY + 125);
    text('    = diag(' + formatNum(Dk[0][0]) + ', ' + formatNum(Dk[1][1]) + ')', startX, startY + 140);
}

function drawSmallMatrix(x, y, mat, label, cellW, cellH) {
    // Label
    fill(80);
    noStroke();
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(label, x + cellW, y - 2);

    // Brackets
    stroke(100);
    strokeWeight(1);
    noFill();
    line(x - 4, y - 2, x - 6, y - 2);
    line(x - 6, y - 2, x - 6, y + 2*cellH + 2);
    line(x - 6, y + 2*cellH + 2, x - 4, y + 2*cellH + 2);

    line(x + 2*cellW + 4, y - 2, x + 2*cellW + 6, y - 2);
    line(x + 2*cellW + 6, y - 2, x + 2*cellW + 6, y + 2*cellH + 2);
    line(x + 2*cellW + 6, y + 2*cellH + 2, x + 2*cellW + 4, y + 2*cellH + 2);

    // Values
    fill(0);
    noStroke();
    textSize(9);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            text(formatNum(mat[i][j]), x + j*cellW + cellW/2, y + i*cellH + cellH/2);
        }
    }
}

function drawResult() {
    let resultY = showStepsCheckbox.checked() ? 200 : 160;

    // Result panel
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(20, resultY, canvasWidth - 40, 120, 8);

    // Title
    fill(0);
    noStroke();
    textSize(14);
    textAlign(CENTER, TOP);
    text('Result: A^' + power, canvasWidth / 2, resultY + 10);

    // Result matrix
    let cellW = 55;
    let cellH = 35;
    let mx = canvasWidth / 2 - cellW;
    let my = resultY + 40;

    // Brackets
    stroke(0);
    strokeWeight(2);
    noFill();
    line(mx - 8, my - 3, mx - 12, my - 3);
    line(mx - 12, my - 3, mx - 12, my + 2*cellH + 3);
    line(mx - 12, my + 2*cellH + 3, mx - 8, my + 2*cellH + 3);

    line(mx + 2*cellW + 8, my - 3, mx + 2*cellW + 12, my - 3);
    line(mx + 2*cellW + 12, my - 3, mx + 2*cellW + 12, my + 2*cellH + 3);
    line(mx + 2*cellW + 12, my + 2*cellH + 3, mx + 2*cellW + 8, my + 2*cellH + 3);

    // Values
    fill(33, 150, 243);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            text(formatNum(resultDiag[i][j]), mx + j*cellW + cellW/2, my + i*cellH + cellH/2);
        }
    }

    // Comparison note
    fill(100);
    textSize(10);
    textAlign(CENTER, TOP);
    if (showStepsCheckbox.checked()) {
        text('Direct: ' + power + ' matrix multiplications vs Diagonalization: 3 matrix multiplications', canvasWidth/2, resultY + 115);
    }
}

function drawDefectiveMessage() {
    let msgY = 180;

    fill(255, 230, 230);
    stroke(244, 67, 54);
    strokeWeight(2);
    rect(30, msgY, canvasWidth - 60, 100, 10);

    fill(200, 0, 0);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Matrix is DEFECTIVE', canvasWidth / 2, msgY + 25);

    fill(100);
    textSize(11);
    text('Cannot use diagonalization method.', canvasWidth / 2, msgY + 50);
    text('Must compute A^' + power + ' directly or use Jordan form.', canvasWidth / 2, msgY + 70);

    // Show direct computation result
    fill(0);
    textSize(12);
    textAlign(CENTER, TOP);
    text('Direct result: A^' + power + ' =', canvasWidth / 2, msgY + 120);

    // Result using direct multiplication
    let resultY = msgY + 145;
    let cellW = 55;
    let cellH = 35;
    let mx = canvasWidth / 2 - cellW;

    stroke(0);
    strokeWeight(2);
    noFill();
    line(mx - 8, resultY - 3, mx - 12, resultY - 3);
    line(mx - 12, resultY - 3, mx - 12, resultY + 2*cellH + 3);
    line(mx - 12, resultY + 2*cellH + 3, mx - 8, resultY + 2*cellH + 3);

    line(mx + 2*cellW + 8, resultY - 3, mx + 2*cellW + 12, resultY - 3);
    line(mx + 2*cellW + 12, resultY - 3, mx + 2*cellW + 12, resultY + 2*cellH + 3);
    line(mx + 2*cellW + 12, resultY + 2*cellH + 3, mx + 2*cellW + 8, resultY + 2*cellH + 3);

    fill(0);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            text(formatNum(resultDirect[i][j]), mx + j*cellW + cellW/2, resultY + i*cellH + cellH/2);
        }
    }
}

function formatNum(n) {
    if (Math.abs(n) < 0.001) return '0';
    if (Math.abs(n - Math.round(n)) < 0.001) return Math.round(n).toString();
    return n.toFixed(2);
}

function computeDiagonalization() {
    let a = matrix[0][0], b = matrix[0][1];
    let c = matrix[1][0], d = matrix[1][1];

    let trace = a + d;
    let det = a * d - b * c;
    let discriminant = trace * trace - 4 * det;

    if (discriminant < 0) {
        isDiagonalizable = false;
        eigenvalues = [];
        return;
    }

    let sqrtD = Math.sqrt(discriminant);
    let lambda1 = (trace + sqrtD) / 2;
    let lambda2 = (trace - sqrtD) / 2;

    eigenvalues = [lambda1, lambda2];

    // Compute eigenvectors
    eigenvectors = [];

    // For lambda1
    let ev1 = computeEigenvector(lambda1);
    // For lambda2
    let ev2 = computeEigenvector(lambda2);

    // Check if we have 2 linearly independent eigenvectors
    let cross = ev1[0] * ev2[1] - ev1[1] * ev2[0];
    if (Math.abs(cross) < 0.0001) {
        isDiagonalizable = false;
        return;
    }

    isDiagonalizable = true;
    eigenvectors = [ev1, ev2];

    // P matrix (eigenvectors as columns)
    P = [[ev1[0], ev2[0]], [ev1[1], ev2[1]]];

    // D matrix (diagonal of eigenvalues)
    D = [[lambda1, 0], [0, lambda2]];

    // P inverse
    let detP = P[0][0] * P[1][1] - P[0][1] * P[1][0];
    Pinv = [
        [P[1][1] / detP, -P[0][1] / detP],
        [-P[1][0] / detP, P[0][0] / detP]
    ];
}

function computeEigenvector(lambda) {
    let a = matrix[0][0], b = matrix[0][1];
    let c = matrix[1][0], d = matrix[1][1];

    // Solve (A - λI)v = 0
    if (Math.abs(b) > 0.0001) {
        return normalize2D([b, lambda - a]);
    } else if (Math.abs(a - lambda) > 0.0001) {
        return [0, 1];
    } else if (Math.abs(c) > 0.0001) {
        return normalize2D([lambda - d, c]);
    } else {
        return [1, 0];
    }
}

function normalize2D(v) {
    let mag = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    if (mag < 0.0001) return [1, 0];
    return [v[0]/mag, v[1]/mag];
}

function computePowers() {
    // Direct computation
    resultDirect = [[1, 0], [0, 1]]; // Start with identity
    for (let k = 0; k < power; k++) {
        resultDirect = multiplyMatrices(resultDirect, matrix);
    }

    if (isDiagonalizable) {
        // Diagonalization method: A^k = P * D^k * P^-1
        let Dk = [[Math.pow(eigenvalues[0], power), 0], [0, Math.pow(eigenvalues[1], power)]];
        let temp = multiplyMatrices(P, Dk);
        resultDiag = multiplyMatrices(temp, Pinv);
    } else {
        resultDiag = resultDirect;
    }
}

function multiplyMatrices(A, B) {
    return [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ];
}

function setRandomMatrix() {
    commitInput();
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            matrix[i][j] = Math.floor(random(-5, 6));
        }
    }
    computeDiagonalization();
}

function setDiagonalizableMatrix() {
    commitInput();
    matrix = [[2, 1], [0, 3]];
    computeDiagonalization();
}

function setDefectiveMatrix() {
    commitInput();
    matrix = [[2, 1], [0, 2]];
    computeDiagonalization();
}

function mousePressed() {
    let matrixX = 25;
    let matrixY = 55;
    let cellW = 40;
    let cellH = 35;

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
            computeDiagonalization();
        }
    }
    inputBuffer = '';
    selectedCell = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    powerSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
