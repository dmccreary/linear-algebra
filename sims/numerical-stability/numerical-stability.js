// Numerical Stability Demonstration MicroSim
// Show how small changes can cause large solution errors in ill-conditioned systems
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 800;
let drawHeight = 380;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// Original matrix and perturbed matrix
let originalA, originalB;
let perturbedA, perturbedB;
let originalSolution, perturbedSolution;

// Presets
const presets = {
    'well': {
        name: 'Well-Conditioned',
        A: [[4, 1], [1, 3]],
        b: [1, 2],
        desc: 'Small condition number, stable'
    },
    'moderate': {
        name: 'Moderately Ill-Conditioned',
        A: [[1, 2], [1.0001, 2]],
        b: [3, 3.0001],
        desc: 'Somewhat sensitive to perturbations'
    },
    'severe': {
        name: 'Severely Ill-Conditioned (Hilbert)',
        A: [[1, 0.5, 1/3], [0.5, 1/3, 0.25], [1/3, 0.25, 0.2]],
        b: [1, 1, 1],
        desc: 'Very high condition number'
    },
    'near-singular': {
        name: 'Near-Singular',
        A: [[1, 1], [1, 1.00001]],
        b: [2, 2.00001],
        desc: 'Almost no unique solution'
    }
};

// Analysis
let conditionNumber = 0;
let inputError = 0;
let outputError = 0;
let errorMagnification = 0;

// UI elements
let presetSelect;
let perturbSlider;
let applyPerturbButton;
let currentPreset = 'well';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const container = document.querySelector('main');
    if (container) {
        canvas.parent(container);
        container.style.position = 'relative';
    }
    textSize(defaultTextSize);

    // Controls
    let row1Y = drawHeight + 15;

    presetSelect = createSelect();
    if (container) presetSelect.parent(container);
    presetSelect.position(90, row1Y);
    presetSelect.option('Well-Conditioned', 'well');
    presetSelect.option('Moderately Ill-Conditioned', 'moderate');
    presetSelect.option('Severely Ill-Conditioned', 'severe');
    presetSelect.option('Near-Singular', 'near-singular');
    presetSelect.changed(() => loadPreset(presetSelect.value()));

    // Perturbation controls
    let row2Y = drawHeight + 55;

    perturbSlider = createSlider(-4, -1, -3, 0.5);
    if (container) perturbSlider.parent(container);
    perturbSlider.position(160, row2Y);
    perturbSlider.size(150);
    perturbSlider.input(applyPerturbation);

    applyPerturbButton = createButton('New Random Perturbation');
    if (container) applyPerturbButton.parent(container);
    applyPerturbButton.position(330, row2Y);
    applyPerturbButton.mousePressed(applyPerturbation);

    // Load initial preset AFTER controls are created
    loadPreset('well');

    describe('Demonstration of numerical stability showing how ill-conditioned systems amplify small input errors', LABEL);
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

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('Numerical Stability & Condition Number', canvasWidth/2, 8);

    // Draw original system
    drawSystemPanel(originalA, originalB, originalSolution, 'Original System', 20, 45, false);

    // Draw perturbed system
    drawSystemPanel(perturbedA, perturbedB, perturbedSolution, 'Perturbed System', canvasWidth/2 + 20, 45, true);

    // Draw error analysis
    drawErrorAnalysis();

    // Draw geometric view
    if (originalA.length === 2) {
        drawGeometricComparison();
    }

    // Preset description at bottom of drawing area
    fill(100);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(16);
    text(presets[currentPreset].desc, canvasWidth/2, drawHeight - margin);

    // Control labels
    drawControlLabels();
}

function drawSystemPanel(A, b, solution, title, x, y, showDiff) {
    // Title
    fill(showDiff ? [200, 50, 50] : [0, 70, 150]);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text(title, x, y);

    // Matrix display
    let cellW = 55;
    let cellH = 25;
    let matrixY = y + 25;

    // Brackets
    stroke(80);
    strokeWeight(1.5);
    noFill();
    let bracketX = x - 5;
    let rightX = x + A[0].length * cellW + cellW + 15;
    let topY = matrixY - 3;
    let bottomY = matrixY + A.length * cellH + 3;

    line(bracketX, topY, bracketX, bottomY);
    line(bracketX, topY, bracketX + 5, topY);
    line(bracketX, bottomY, bracketX + 5, bottomY);
    line(rightX, topY, rightX, bottomY);
    line(rightX, topY, rightX - 5, topY);
    line(rightX, bottomY, rightX - 5, bottomY);

    // Augmented line
    let augX = x + A[0].length * cellW + 6;
    stroke(150);
    line(augX, topY, augX, bottomY);

    // Matrix entries
    textAlign(CENTER, CENTER);
    textSize(12);

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
            let cx = x + j * cellW + cellW/2;
            let cy = matrixY + i * cellH + cellH/2;

            // Highlight changes
            if (showDiff && originalA && Math.abs(A[i][j] - originalA[i][j]) > 1e-10) {
                fill(255, 220, 220);
                noStroke();
                rect(cx - cellW/2 + 2, cy - cellH/2 + 2, cellW - 4, cellH - 4, 3);
            }

            fill('#004080');
            noStroke();
            text(formatNumber(A[i][j], 6), cx, cy);
        }

        // b vector
        let bx = x + A[i].length * cellW + cellW/2 + 10;
        let by = matrixY + i * cellH + cellH/2;

        if (showDiff && originalB && Math.abs(b[i] - originalB[i]) > 1e-10) {
            fill(255, 220, 220);
            noStroke();
            rect(bx - cellW/2 + 2, by - cellH/2 + 2, cellW - 4, cellH - 4, 3);
        }

        fill('#008000');
        noStroke();
        text(formatNumber(b[i], 6), bx, by);
    }

    // Solution
    if (solution && solution.length > 0) {
        let solY = matrixY + A.length * cellH + 15;
        fill(60);
        textAlign(LEFT, TOP);
        textSize(11);
        text('Solution:', x - 5, solY);

        let vars = ['x', 'y', 'z', 'w'];
        for (let i = 0; i < solution.length; i++) {
            let solColor = '#006600';
            if (showDiff && originalSolution) {
                let diff = Math.abs(solution[i] - originalSolution[i]);
                if (diff > 0.1) solColor = '#cc0000';
                else if (diff > 0.01) solColor = '#cc6600';
            }
            fill(solColor);
            text(vars[i] + ' = ' + formatNumber(solution[i], 6), x + 55 + i * 85, solY);
        }
    }
}

function drawErrorAnalysis() {
    let panelX = 20;
    let panelY = 175;
    let panelW = canvasWidth/2 - 40;

    // Background
    fill(255, 255, 250);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, 150, 5);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(13);
    text('Error Analysis', panelX + 10, panelY + 8);

    textSize(12);
    let y = panelY + 30;

    // Condition number
    let condColor = conditionNumber < 10 ? [0, 150, 0] :
                    conditionNumber < 1000 ? [200, 150, 0] : [200, 50, 50];
    fill(condColor);
    text('Condition Number: ' + formatNumber(conditionNumber, 2), panelX + 15, y);

    y += 22;

    // Input error
    fill(60);
    text('Input perturbation: ' + inputError.toExponential(2), panelX + 15, y);

    y += 20;

    // Output error
    let outColor = errorMagnification > 100 ? [200, 50, 50] :
                   errorMagnification > 10 ? [200, 150, 0] : [0, 150, 0];
    fill(outColor);
    text('Solution change: ' + outputError.toExponential(2), panelX + 15, y);

    y += 20;

    // Error magnification
    fill(outColor);
    text('Error magnification: ' + formatNumber(errorMagnification, 1) + '×', panelX + 15, y);

    // Warning
    if (errorMagnification > 10) {
        fill(200, 50, 50);
        textSize(11);
        text('⚠ Small input errors cause large output errors!', panelX + 15, y + 20);
    }
}

function drawGeometricComparison() {
    let viewX = canvasWidth/2 + 20;
    let viewY = 175;
    let viewW = canvasWidth/2 - 60;
    let viewH = 150;

    // Background
    fill(250, 255, 250);
    stroke(200);
    strokeWeight(1);
    rect(viewX, viewY, viewW, viewH, 5);

    fill(0, 100, 0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(13);
    text('Geometric View (2D)', viewX + 10, viewY + 8);

    // Draw mini coordinate system
    let cx = viewX + viewW/2;
    let cy = viewY + viewH/2 + 10;
    let scale = 15;
    let range = 3;

    // Axes
    stroke(200);
    strokeWeight(1);
    line(cx - range*scale, cy, cx + range*scale, cy);
    line(cx, cy - range*scale, cx, cy + range*scale);

    // Original lines
    stroke(0, 100, 200);
    strokeWeight(2);
    drawLine2D(originalA[0][0], originalA[0][1], originalB[0], cx, cy, scale, range);
    drawLine2D(originalA[1][0], originalA[1][1], originalB[1], cx, cy, scale, range);

    // Perturbed lines (dashed)
    stroke(200, 100, 100);
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    drawLine2D(perturbedA[0][0], perturbedA[0][1], perturbedB[0], cx, cy, scale, range);
    drawLine2D(perturbedA[1][0], perturbedA[1][1], perturbedB[1], cx, cy, scale, range);
    drawingContext.setLineDash([]);

    // Original solution point
    if (originalSolution && originalSolution.length === 2) {
        fill(0, 150, 0);
        stroke(0, 100, 0);
        strokeWeight(1);
        let ox = cx + originalSolution[0] * scale;
        let oy = cy - originalSolution[1] * scale;
        circle(ox, oy, 8);
    }

    // Perturbed solution point
    if (perturbedSolution && perturbedSolution.length === 2) {
        fill(200, 50, 50);
        stroke(150, 0, 0);
        strokeWeight(1);
        let px = cx + perturbedSolution[0] * scale;
        let py = cy - perturbedSolution[1] * scale;
        circle(px, py, 8);
    }

    // Legend
    textSize(10);
    noStroke();
    fill(0, 100, 200);
    text('Original', viewX + 10, viewY + viewH - 25);
    fill(200, 100, 100);
    text('Perturbed', viewX + 60, viewY + viewH - 25);
}

function drawLine2D(a, b, c, cx, cy, scale, range) {
    // ax + by = c
    if (Math.abs(b) > Math.abs(a)) {
        let x1 = -range, x2 = range;
        let y1 = (c - a * x1) / b;
        let y2 = (c - a * x2) / b;
        line(cx + x1 * scale, cy - y1 * scale, cx + x2 * scale, cy - y2 * scale);
    } else if (Math.abs(a) > 0.001) {
        let y1 = -range, y2 = range;
        let x1 = (c - b * y1) / a;
        let x2 = (c - b * y2) / a;
        line(cx + x1 * scale, cy - y1 * scale, cx + x2 * scale, cy - y2 * scale);
    }
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);

    text('Example:', 20, drawHeight + 27);

    // Perturbation label with superscript exponent
    text('Perturbation: 10', 20, drawHeight + 67);
    let baseWidth = textWidth('Perturbation: 10');
    textSize(10);
    text(perturbSlider.value().toFixed(1), 20 + baseWidth, drawHeight + 67 - 6);
    textSize(14);
}

function loadPreset(name) {
    currentPreset = name;
    let preset = presets[name];
    originalA = JSON.parse(JSON.stringify(preset.A));
    originalB = JSON.parse(JSON.stringify(preset.b));

    // Solve original system
    originalSolution = solveSystem(originalA, originalB);

    // Compute condition number
    conditionNumber = estimateConditionNumber(originalA);

    // Apply initial perturbation
    applyPerturbation();
}

function applyPerturbation() {
    let magnitude = Math.pow(10, perturbSlider.value());

    // Copy original
    perturbedA = JSON.parse(JSON.stringify(originalA));
    perturbedB = JSON.parse(JSON.stringify(originalB));

    // Apply random perturbation to one entry
    let i = Math.floor(Math.random() * perturbedA.length);
    let j = Math.floor(Math.random() * perturbedA[0].length);

    let perturbation = (Math.random() - 0.5) * 2 * magnitude;
    perturbedA[i][j] += perturbation;

    // Also perturb b slightly
    let bi = Math.floor(Math.random() * perturbedB.length);
    perturbedB[bi] += (Math.random() - 0.5) * 2 * magnitude;

    // Solve perturbed system
    perturbedSolution = solveSystem(perturbedA, perturbedB);

    // Calculate errors
    inputError = magnitude;

    if (originalSolution && perturbedSolution) {
        let sumSq = 0;
        for (let k = 0; k < originalSolution.length; k++) {
            sumSq += Math.pow(perturbedSolution[k] - originalSolution[k], 2);
        }
        outputError = Math.sqrt(sumSq);
        errorMagnification = inputError > 0 ? outputError / inputError : 0;
    }
}

function solveSystem(A, b) {
    // Simple Gaussian elimination with partial pivoting
    let n = A.length;
    let aug = [];
    for (let i = 0; i < n; i++) {
        aug.push([...A[i], b[i]]);
    }

    // Forward elimination
    for (let col = 0; col < n; col++) {
        // Partial pivoting
        let maxRow = col;
        for (let i = col + 1; i < n; i++) {
            if (Math.abs(aug[i][col]) > Math.abs(aug[maxRow][col])) {
                maxRow = i;
            }
        }
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

        if (Math.abs(aug[col][col]) < 1e-12) continue;

        for (let i = col + 1; i < n; i++) {
            let factor = aug[i][col] / aug[col][col];
            for (let j = col; j <= n; j++) {
                aug[i][j] -= factor * aug[col][j];
            }
        }
    }

    // Back substitution
    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = aug[i][n];
        for (let j = i + 1; j < n; j++) {
            sum -= aug[i][j] * x[j];
        }
        if (Math.abs(aug[i][i]) > 1e-12) {
            x[i] = sum / aug[i][i];
        }
    }

    return x;
}

function estimateConditionNumber(A) {
    // Estimate using 1-norm and inverse
    let n = A.length;

    // 1-norm of A
    let normA = 0;
    for (let j = 0; j < n; j++) {
        let colSum = 0;
        for (let i = 0; i < n; i++) {
            colSum += Math.abs(A[i][j]);
        }
        normA = Math.max(normA, colSum);
    }

    // Approximate inverse norm using a few iterations
    let x = new Array(n).fill(1);
    for (let iter = 0; iter < 5; iter++) {
        let y = solveSystem(A, x);
        let normY = y.reduce((s, v) => s + Math.abs(v), 0);
        if (normY > 0) {
            x = y.map(v => v / normY);
        }
    }

    let normAinv = solveSystem(A, x).reduce((s, v) => s + Math.abs(v), 0);

    return normA * normAinv;
}

function formatNumber(val, precision = 4) {
    if (Math.abs(val) < 1e-10) return '0';
    if (Math.abs(val) > 1e6 || Math.abs(val) < 1e-4) {
        return val.toExponential(2);
    }
    return val.toFixed(precision);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        containerWidth = container.offsetWidth;
        canvasWidth = Math.max(600, containerWidth);
    }
}
