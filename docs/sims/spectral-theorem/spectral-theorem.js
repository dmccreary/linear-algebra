// Spectral Theorem Interactive Demonstration
// Shows how symmetric matrices decompose into orthogonal eigenvectors and real eigenvalues

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Symmetric matrix (always maintain symmetry)
let matrix = [[3, 1], [1, 3]];

// Eigendecomposition
let eigenvalues = [];
let eigenvectors = [];
let Q = [];  // Orthogonal matrix
let Lambda = [];  // Diagonal matrix

// Visualization
let gridScale = 50;
let originX, originY;

// Animation
let blendFactor = 0;
let isAnimating = false;

// Component highlight
let highlightedComponent = -1;

// Controls
let randomButton, identityButton;
let animateButton;
let componentButtons = [];

// Matrix input
let selectedCell = null;
let inputBuffer = '';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    originX = canvasWidth * 0.65;
    originY = drawHeight / 2 + 20;

    // Create controls
    randomButton = createButton('Random Symmetric');
    randomButton.position(10, drawHeight + 10);
    randomButton.mousePressed(setRandomSymmetric);

    identityButton = createButton('Identity');
    identityButton.position(155, drawHeight + 10);
    identityButton.mousePressed(setIdentityMatrix);

    animateButton = createButton('Animate Decomposition');
    animateButton.position(10, drawHeight + 45);
    animateButton.mousePressed(toggleAnimation);

    computeSpectralDecomposition();

    describe('Spectral theorem demonstration showing how symmetric matrices decompose into orthogonal eigenvectors and real eigenvalues with A = QΛQ^T', LABEL);
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

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('Spectral Theorem for Symmetric Matrices', canvasWidth / 2, 8);

    // Draw matrix input panel
    drawMatrixInput();

    // Draw decomposition formula
    drawDecompositionFormula();

    // Draw geometric visualization
    drawGeometricView();

    // Draw orthogonality verification
    drawOrthogonalityCheck();

    // Animation update
    if (isAnimating) {
        blendFactor += 0.02;
        if (blendFactor >= 1) {
            blendFactor = 1;
            isAnimating = false;
            animateButton.html('Reset Animation');
        }
    }

    // Control area text
    fill(100);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text('Symmetric: A = Aᵀ → Real eigenvalues, orthogonal eigenvectors', 200, drawHeight + 50);
}

function drawMatrixInput() {
    let panelX = 10;
    let panelY = 35;
    let panelW = canvasWidth * 0.35 - 15;
    let panelH = 120;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Symmetric Matrix A', panelX + panelW/2, panelY + 5);

    // Matrix cells
    let cellW = 40;
    let cellH = 32;
    let matrixX = panelX + (panelW - 2*cellW) / 2;
    let matrixY = panelY + 28;

    // Brackets
    stroke(0);
    strokeWeight(1.5);
    noFill();
    line(matrixX - 6, matrixY - 3, matrixX - 10, matrixY - 3);
    line(matrixX - 10, matrixY - 3, matrixX - 10, matrixY + 2*cellH + 3);
    line(matrixX - 10, matrixY + 2*cellH + 3, matrixX - 6, matrixY + 2*cellH + 3);

    line(matrixX + 2*cellW + 6, matrixY - 3, matrixX + 2*cellW + 10, matrixY - 3);
    line(matrixX + 2*cellW + 10, matrixY - 3, matrixX + 2*cellW + 10, matrixY + 2*cellH + 3);
    line(matrixX + 2*cellW + 10, matrixY + 2*cellH + 3, matrixX + 2*cellW + 6, matrixY + 2*cellH + 3);

    // Cells
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            // Highlight off-diagonal (symmetric pair)
            let isOffDiag = i !== j;

            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                fill(200, 220, 255);
                stroke(100, 150, 255);
            } else if (isOffDiag) {
                fill(255, 250, 230);
                stroke(180);
            } else {
                fill(255);
                stroke(180);
            }
            strokeWeight(1);
            rect(x, y, cellW, cellH, 3);

            fill(0);
            noStroke();
            textSize(13);
            textAlign(CENTER, CENTER);
            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                text(inputBuffer + '|', x + cellW/2, y + cellH/2);
            } else {
                text(matrix[i][j], x + cellW/2, y + cellH/2);
            }
        }
    }

    // Note about symmetry
    fill(100);
    textSize(9);
    textAlign(CENTER, TOP);
    text('a₁₂ = a₂₁ (symmetric)', panelX + panelW/2, matrixY + 2*cellH + 8);
}

function drawDecompositionFormula() {
    let startY = 165;

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text('A = QΛQᵀ', 15, startY);

    // Show matrices
    let matrixY = startY + 22;
    let cellW = 32;
    let cellH = 24;
    let spacing = 8;

    // Q matrix
    drawSmallMatrix(15, matrixY, Q, 'Q', cellW, cellH);

    // Lambda
    drawSmallMatrix(15 + 2*cellW + spacing + 15, matrixY, Lambda, 'Λ', cellW, cellH);

    // Q^T
    let QT = [[Q[0][0], Q[1][0]], [Q[0][1], Q[1][1]]];
    drawSmallMatrix(15 + 4*cellW + 2*spacing + 30, matrixY, QT, 'Qᵀ', cellW, cellH);

    // Eigenvalues
    let evY = matrixY + 60;
    fill(0);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text('Eigenvalues (all real):', 15, evY);

    fill(33, 150, 243);
    textSize(11);
    for (let i = 0; i < eigenvalues.length; i++) {
        text('λ' + (i+1) + ' = ' + eigenvalues[i].toFixed(3), 20, evY + 14 + i * 14);
    }

    // Spectral decomposition form
    let specY = evY + 50;
    fill(0);
    textSize(10);
    text('A = λ₁q₁q₁ᵀ + λ₂q₂q₂ᵀ', 15, specY);
}

function drawSmallMatrix(x, y, mat, label, cellW, cellH) {
    // Label
    fill(80);
    noStroke();
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(label, x + cellW, y - 2);

    // Values
    fill(0);
    textSize(10);
    textAlign(CENTER, CENTER);

    stroke(150);
    strokeWeight(1);

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            // Light background for diagonal of Lambda
            if (label === 'Λ' && i === j) {
                fill(230, 240, 255);
            } else {
                fill(255);
            }
            rect(x + j*cellW, y + i*cellH, cellW, cellH);

            fill(0);
            noStroke();
            text(formatNum(mat[i][j]), x + j*cellW + cellW/2, y + i*cellH + cellH/2);
            stroke(150);
        }
    }
}

function drawGeometricView() {
    let panelX = canvasWidth * 0.42;
    let panelY = 35;
    let panelW = canvasWidth * 0.55;
    let panelH = 200;

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
    text('Orthogonal Eigenvectors', panelX + panelW/2, panelY + 5);

    let centerX = panelX + panelW/2;
    let centerY = panelY + panelH/2 + 10;
    let scale = 55;

    // Grid
    stroke(235);
    strokeWeight(1);
    for (let i = -2; i <= 2; i++) {
        line(centerX + i * scale/2, panelY + 25, centerX + i * scale/2, panelY + panelH - 10);
        line(panelX + 10, centerY + i * scale/2, panelX + panelW - 10, centerY + i * scale/2);
    }

    // Axes
    stroke(180);
    strokeWeight(1);
    line(panelX + 10, centerY, panelX + panelW - 10, centerY);
    line(centerX, panelY + 25, centerX, panelY + panelH - 10);

    // Unit circle
    stroke(220);
    noFill();
    ellipse(centerX, centerY, scale * 2, scale * 2);

    // Draw eigenvectors (scaled to unit length)
    let colors = [[244, 67, 54], [33, 150, 243]];

    for (let i = 0; i < eigenvectors.length; i++) {
        let ev = eigenvectors[i];
        let mag = sqrt(ev[0]*ev[0] + ev[1]*ev[1]);
        if (mag < 0.01) continue;

        let ux = ev[0] / mag;
        let uy = ev[1] / mag;

        let endX = centerX + ux * scale;
        let endY = centerY - uy * scale;

        // Arrow
        stroke(colors[i][0], colors[i][1], colors[i][2]);
        strokeWeight(3);
        line(centerX, centerY, endX, endY);

        // Arrowhead
        fill(colors[i][0], colors[i][1], colors[i][2]);
        noStroke();
        let angle = atan2(-uy, ux);
        push();
        translate(endX, endY);
        rotate(angle);
        triangle(0, 0, -10, -5, -10, 5);
        pop();

        // Label
        textSize(11);
        textAlign(CENTER, CENTER);
        text('q' + (i+1), endX + ux * 15, endY - uy * 15);
    }

    // Orthogonality indicator (right angle symbol)
    if (eigenvectors.length >= 2) {
        let q1 = eigenvectors[0];
        let q2 = eigenvectors[1];
        let dot = q1[0]*q2[0] + q1[1]*q2[1];

        if (abs(dot) < 0.1) {
            // Draw right angle symbol at origin
            stroke(100);
            strokeWeight(1);
            noFill();
            let sz = 8;
            let u1x = q1[0] / sqrt(q1[0]*q1[0] + q1[1]*q1[1]);
            let u1y = q1[1] / sqrt(q1[0]*q1[0] + q1[1]*q1[1]);
            let u2x = q2[0] / sqrt(q2[0]*q2[0] + q2[1]*q2[1]);
            let u2y = q2[1] / sqrt(q2[0]*q2[0] + q2[1]*q2[1]);

            beginShape();
            vertex(centerX + u1x * sz, centerY - u1y * sz);
            vertex(centerX + (u1x + u2x) * sz, centerY - (u1y + u2y) * sz);
            vertex(centerX + u2x * sz, centerY - u2y * sz);
            endShape();
        }
    }
}

function drawOrthogonalityCheck() {
    let checkX = canvasWidth * 0.42;
    let checkY = 250;
    let checkW = canvasWidth * 0.55;
    let checkH = 70;

    // Background
    fill(240, 255, 240);
    stroke(100, 200, 100);
    strokeWeight(1);
    rect(checkX, checkY, checkW, checkH, 8);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Orthogonality Verification:', checkX + 10, checkY + 8);

    // q1 · q2
    let dot = eigenvectors.length >= 2 ?
        eigenvectors[0][0] * eigenvectors[1][0] + eigenvectors[0][1] * eigenvectors[1][1] : 0;

    textSize(10);
    text('q₁ · q₂ = ' + dot.toFixed(6) + (abs(dot) < 0.0001 ? ' ≈ 0 ✓' : ''), checkX + 15, checkY + 26);

    // Q^T Q = I
    if (Q.length === 2) {
        let QTQ = multiplyMatrices([[Q[0][0], Q[1][0]], [Q[0][1], Q[1][1]]], Q);
        let isIdentity = abs(QTQ[0][0] - 1) < 0.001 && abs(QTQ[1][1] - 1) < 0.001 &&
                         abs(QTQ[0][1]) < 0.001 && abs(QTQ[1][0]) < 0.001;

        text('QᵀQ = I: ' + (isIdentity ? '✓ Orthogonal matrix' : '✗'), checkX + 15, checkY + 44);
    }
}

function formatNum(n) {
    if (Math.abs(n) < 0.001) return '0';
    if (Math.abs(n - Math.round(n)) < 0.001) return Math.round(n).toString();
    return n.toFixed(2);
}

function computeSpectralDecomposition() {
    let a = matrix[0][0], b = matrix[0][1];
    let c = matrix[1][0], d = matrix[1][1];

    // For symmetric matrix: b = c
    let trace = a + d;
    let det = a * d - b * c;
    let discriminant = trace * trace - 4 * det;

    eigenvalues = [];
    eigenvectors = [];

    if (discriminant >= 0) {
        let sqrtD = sqrt(discriminant);
        eigenvalues = [(trace + sqrtD) / 2, (trace - sqrtD) / 2];

        // Compute normalized eigenvectors
        for (let lam of eigenvalues) {
            let ev = computeEigenvector(lam);
            eigenvectors.push(ev);
        }
    }

    // Build Q and Lambda
    if (eigenvectors.length === 2) {
        Q = [[eigenvectors[0][0], eigenvectors[1][0]],
             [eigenvectors[0][1], eigenvectors[1][1]]];
        Lambda = [[eigenvalues[0], 0], [0, eigenvalues[1]]];
    } else {
        Q = [[1, 0], [0, 1]];
        Lambda = [[0, 0], [0, 0]];
    }
}

function computeEigenvector(lambda) {
    let a = matrix[0][0], b = matrix[0][1];

    let ev;
    if (abs(b) > 0.0001) {
        ev = [b, lambda - a];
    } else if (abs(a - lambda) > 0.0001) {
        ev = [0, 1];
    } else {
        ev = [1, 0];
    }

    // Normalize
    let mag = sqrt(ev[0]*ev[0] + ev[1]*ev[1]);
    if (mag > 0.0001) {
        ev = [ev[0]/mag, ev[1]/mag];
    }

    return ev;
}

function multiplyMatrices(A, B) {
    return [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ];
}

function setRandomSymmetric() {
    commitInput();
    let a = Math.floor(random(-5, 6));
    let b = Math.floor(random(-5, 6));
    let d = Math.floor(random(-5, 6));
    matrix = [[a, b], [b, d]];
    computeSpectralDecomposition();
}

function setIdentityMatrix() {
    commitInput();
    matrix = [[1, 0], [0, 1]];
    computeSpectralDecomposition();
}

function toggleAnimation() {
    if (blendFactor >= 1) {
        blendFactor = 0;
        animateButton.html('Animate Decomposition');
    } else {
        isAnimating = !isAnimating;
        animateButton.html(isAnimating ? 'Pause' : 'Animate Decomposition');
    }
}

function mousePressed() {
    let panelX = 10;
    let panelW = canvasWidth * 0.35 - 15;
    let cellW = 40;
    let cellH = 32;
    let matrixX = panelX + (panelW - 2*cellW) / 2;
    let matrixY = 35 + 28;

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
            // Enforce symmetry
            matrix[selectedCell.j][selectedCell.i] = value;
            computeSpectralDecomposition();
        }
    }
    inputBuffer = '';
    selectedCell = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
