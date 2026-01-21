// Characteristic Polynomial Explorer
// Interactive computation of characteristic polynomials with graph visualization

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix (2x2 or 3x3)
let matrixSize = 2;
let matrix2 = [[4, 2], [1, 3]];
let matrix3 = [[2, 1, 0], [1, 2, 1], [0, 1, 2]];

// Computed polynomial coefficients and eigenvalues
let polyCoeffs = [];
let eigenvalues = [];

// Graph settings
let graphX, graphY, graphW, graphH;
let lambdaMin = -2;
let lambdaMax = 8;

// Trace slider
let traceValue = 0;

// Controls
let sizeButton;
let randomButton;
let identityButton;
let symmetricButton;
let traceSlider;

// Matrix input
let selectedCell = null;
let inputBuffer = '';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Create controls
    sizeButton = createButton('2×2');
    sizeButton.position(10, drawHeight + 10);
    sizeButton.mousePressed(toggleSize);

    randomButton = createButton('Random');
    randomButton.position(55, drawHeight + 10);
    randomButton.mousePressed(setRandomMatrix);

    identityButton = createButton('Identity');
    identityButton.position(120, drawHeight + 10);
    identityButton.mousePressed(setIdentityMatrix);

    symmetricButton = createButton('Symmetric');
    symmetricButton.position(190, drawHeight + 10);
    symmetricButton.mousePressed(setSymmetricMatrix);

    traceSlider = createSlider(-3, 9, 3, 0.01);
    traceSlider.position(70, drawHeight + 45);
    traceSlider.size(canvasWidth - 100);

    computeCharacteristicPolynomial();

    describe('Interactive characteristic polynomial explorer showing matrix input, step-by-step calculation, and polynomial graph with eigenvalue roots', LABEL);
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

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Characteristic Polynomial Explorer', canvasWidth / 2, 8);

    // Layout panels
    let leftPanelW = canvasWidth * 0.4;
    let rightPanelW = canvasWidth * 0.55;

    // Draw matrix input panel
    drawMatrixPanel(10, 35, leftPanelW - 15);

    // Draw calculation steps
    drawCalculationSteps(10, matrixSize === 2 ? 170 : 210);

    // Draw polynomial graph
    graphX = leftPanelW + 10;
    graphY = 45;
    graphW = rightPanelW - 20;
    graphH = drawHeight - 80;
    drawPolynomialGraph();

    // Update trace value from slider
    traceValue = traceSlider.value();

    // Control labels
    fill(100);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text('λ trace:', 10, drawHeight + 57);
}

function drawMatrixPanel(x, y, w) {
    let cellSize = matrixSize === 2 ? 40 : 32;
    let matrixW = matrixSize * cellSize;
    let matrixH = matrixSize * cellSize;

    // Panel background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(x, y, w, matrixH + 55, 8);

    // Title
    fill(0);
    noStroke();
    textSize(13);
    textAlign(CENTER, TOP);
    text(matrixSize + '×' + matrixSize + ' Matrix A', x + w/2, y + 8);

    // Matrix brackets and cells
    let matrixX = x + (w - matrixW) / 2;
    let matrixY = y + 30;

    // Left bracket
    stroke(0);
    strokeWeight(2);
    noFill();
    line(matrixX - 8, matrixY - 3, matrixX - 12, matrixY - 3);
    line(matrixX - 12, matrixY - 3, matrixX - 12, matrixY + matrixH + 3);
    line(matrixX - 12, matrixY + matrixH + 3, matrixX - 8, matrixY + matrixH + 3);

    // Right bracket
    line(matrixX + matrixW + 8, matrixY - 3, matrixX + matrixW + 12, matrixY - 3);
    line(matrixX + matrixW + 12, matrixY - 3, matrixX + matrixW + 12, matrixY + matrixH + 3);
    line(matrixX + matrixW + 12, matrixY + matrixH + 3, matrixX + matrixW + 8, matrixY + matrixH + 3);

    // Get current matrix
    let currentMatrix = matrixSize === 2 ? matrix2 : matrix3;

    // Draw cells
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            let cx = matrixX + j * cellSize;
            let cy = matrixY + i * cellSize;

            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                fill(200, 220, 255);
                stroke(100, 150, 255);
            } else {
                fill(255);
                stroke(180);
            }
            strokeWeight(1);
            rect(cx, cy, cellSize, cellSize, 3);

            fill(0);
            noStroke();
            textSize(matrixSize === 2 ? 14 : 12);
            textAlign(CENTER, CENTER);
            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                text(inputBuffer + '|', cx + cellSize/2, cy + cellSize/2);
            } else {
                text(currentMatrix[i][j], cx + cellSize/2, cy + cellSize/2);
            }
        }
    }

    // Click instruction
    fill(100);
    textSize(10);
    textAlign(CENTER, TOP);
    text('Click cells to edit', x + w/2, matrixY + matrixH + 8);
}

function drawCalculationSteps(x, y) {
    let currentMatrix = matrixSize === 2 ? matrix2 : matrix3;

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    text('det(A - λI) = 0', x, y);

    y += 20;
    textSize(11);

    if (matrixSize === 2) {
        let a = currentMatrix[0][0], b = currentMatrix[0][1];
        let c = currentMatrix[1][0], d = currentMatrix[1][1];

        text('(' + a + '-λ)(' + d + '-λ) - (' + b + ')(' + c + ')', x, y);
        y += 18;

        let trace = a + d;
        let det = a * d - b * c;
        text('= λ² - ' + trace + 'λ + ' + det, x, y);
        y += 22;

        // Show roots
        fill(0, 100, 180);
        textSize(12);
        text('Eigenvalues:', x, y);
        y += 16;

        textSize(11);
        for (let i = 0; i < eigenvalues.length; i++) {
            let ev = eigenvalues[i];
            if (typeof ev === 'number') {
                text('λ' + (i+1) + ' = ' + ev.toFixed(3), x + 10, y);
            } else {
                text('λ' + (i+1) + ' = ' + ev.re.toFixed(2) + (ev.im >= 0 ? '+' : '') + ev.im.toFixed(2) + 'i', x + 10, y);
            }
            y += 14;
        }
    } else {
        // 3x3 case - simplified display
        text('Characteristic polynomial:', x, y);
        y += 16;

        // Show polynomial
        let polyStr = 'p(λ) = ';
        if (polyCoeffs.length >= 4) {
            polyStr += '-λ³';
            if (polyCoeffs[2] >= 0) polyStr += ' + ' + polyCoeffs[2].toFixed(1) + 'λ²';
            else polyStr += ' - ' + (-polyCoeffs[2]).toFixed(1) + 'λ²';
            if (polyCoeffs[1] >= 0) polyStr += ' + ' + polyCoeffs[1].toFixed(1) + 'λ';
            else polyStr += ' - ' + (-polyCoeffs[1]).toFixed(1) + 'λ';
            if (polyCoeffs[0] >= 0) polyStr += ' + ' + polyCoeffs[0].toFixed(1);
            else polyStr += ' - ' + (-polyCoeffs[0]).toFixed(1);
        }
        textSize(10);
        text(polyStr, x, y);
        y += 22;

        // Show roots
        fill(0, 100, 180);
        textSize(11);
        text('Eigenvalues:', x, y);
        y += 14;

        textSize(10);
        for (let i = 0; i < eigenvalues.length; i++) {
            let ev = eigenvalues[i];
            if (typeof ev === 'number') {
                text('λ' + (i+1) + ' = ' + ev.toFixed(3), x + 5, y);
            } else {
                text('λ' + (i+1) + ' = ' + ev.re.toFixed(2) + (ev.im >= 0 ? '+' : '') + ev.im.toFixed(2) + 'i', x + 5, y);
            }
            y += 12;
        }
    }
}

function drawPolynomialGraph() {
    // Background
    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(graphX, graphY, graphW, graphH, 8);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('p(λ) = det(A - λI)', graphX + graphW/2, graphY + 5);

    // Graph area
    let plotX = graphX + 40;
    let plotY = graphY + 30;
    let plotW = graphW - 55;
    let plotH = graphH - 60;

    // Grid
    stroke(230);
    strokeWeight(1);

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        let x = plotX + (i / 10) * plotW;
        line(x, plotY, x, plotY + plotH);
    }

    // Horizontal grid lines
    for (let i = 0; i <= 8; i++) {
        let y = plotY + (i / 8) * plotH;
        line(plotX, y, plotX + plotW, y);
    }

    // Find y range for plot
    let yMin = -20, yMax = 20;
    for (let px = 0; px <= plotW; px += 5) {
        let lambda = map(px, 0, plotW, lambdaMin, lambdaMax);
        let pVal = evaluatePolynomial(lambda);
        if (isFinite(pVal)) {
            yMin = min(yMin, pVal);
            yMax = max(yMax, pVal);
        }
    }
    // Add padding
    let yRange = yMax - yMin;
    yMin -= yRange * 0.1;
    yMax += yRange * 0.1;
    if (yMax - yMin < 1) {
        yMin = -10;
        yMax = 10;
    }

    // Axes
    stroke(100);
    strokeWeight(1);

    // X-axis (y=0 line)
    let zeroY = map(0, yMin, yMax, plotY + plotH, plotY);
    if (zeroY >= plotY && zeroY <= plotY + plotH) {
        line(plotX, zeroY, plotX + plotW, zeroY);
    }

    // Y-axis (lambda=0 line)
    let zeroX = map(0, lambdaMin, lambdaMax, plotX, plotX + plotW);
    if (zeroX >= plotX && zeroX <= plotX + plotW) {
        line(zeroX, plotY, zeroX, plotY + plotH);
    }

    // Axis labels
    fill(80);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    text('λ', plotX + plotW + 12, zeroY - 5);
    textAlign(RIGHT, CENTER);
    text('p(λ)', plotX - 5, plotY + 10);

    // X-axis tick labels
    textAlign(CENTER, TOP);
    for (let v = Math.ceil(lambdaMin); v <= Math.floor(lambdaMax); v += 2) {
        let x = map(v, lambdaMin, lambdaMax, plotX, plotX + plotW);
        text(v, x, plotY + plotH + 5);
    }

    // Draw polynomial curve
    stroke(0, 100, 200);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let px = 0; px <= plotW; px++) {
        let lambda = map(px, 0, plotW, lambdaMin, lambdaMax);
        let pVal = evaluatePolynomial(lambda);
        let y = map(pVal, yMin, yMax, plotY + plotH, plotY);
        y = constrain(y, plotY - 10, plotY + plotH + 10);
        vertex(plotX + px, y);
    }
    endShape();

    // Mark eigenvalues (roots)
    for (let i = 0; i < eigenvalues.length; i++) {
        let ev = eigenvalues[i];
        if (typeof ev === 'number' && ev >= lambdaMin && ev <= lambdaMax) {
            let x = map(ev, lambdaMin, lambdaMax, plotX, plotX + plotW);
            let y = zeroY;

            // Dashed vertical line
            stroke(200, 50, 50, 150);
            strokeWeight(1);
            drawDashedLine(x, plotY, x, plotY + plotH);

            // Point on x-axis
            fill(200, 50, 50);
            noStroke();
            ellipse(x, y, 10, 10);

            // Label
            textSize(9);
            textAlign(CENTER, TOP);
            text('λ' + (i+1) + '=' + ev.toFixed(2), x, y + 8);
        }
    }

    // Trace point
    let traceX = map(traceValue, lambdaMin, lambdaMax, plotX, plotX + plotW);
    let traceY = evaluatePolynomial(traceValue);
    let tracePY = map(traceY, yMin, yMax, plotY + plotH, plotY);
    tracePY = constrain(tracePY, plotY, plotY + plotH);

    if (traceX >= plotX && traceX <= plotX + plotW) {
        // Vertical line to curve
        stroke(100, 180, 100);
        strokeWeight(1);
        line(traceX, zeroY, traceX, tracePY);

        // Point on curve
        fill(100, 180, 100);
        noStroke();
        ellipse(traceX, tracePY, 12, 12);

        // Value label
        fill(0);
        textSize(10);
        textAlign(LEFT, CENTER);
        text('p(' + traceValue.toFixed(2) + ') = ' + traceY.toFixed(2), traceX + 8, tracePY);
    }
}

function drawDashedLine(x1, y1, x2, y2) {
    let steps = 15;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
    }
}

function evaluatePolynomial(lambda) {
    let result = 0;
    for (let i = 0; i < polyCoeffs.length; i++) {
        result += polyCoeffs[i] * pow(lambda, i);
    }
    return result;
}

function computeCharacteristicPolynomial() {
    if (matrixSize === 2) {
        let a = matrix2[0][0], b = matrix2[0][1];
        let c = matrix2[1][0], d = matrix2[1][1];

        // p(λ) = λ² - (a+d)λ + (ad-bc)
        let trace = a + d;
        let det = a * d - b * c;
        polyCoeffs = [det, -trace, 1]; // c0 + c1*λ + c2*λ²

        // Compute eigenvalues
        let discriminant = trace * trace - 4 * det;
        eigenvalues = [];
        if (discriminant >= 0) {
            let sqrtD = sqrt(discriminant);
            eigenvalues.push((trace + sqrtD) / 2);
            eigenvalues.push((trace - sqrtD) / 2);
        } else {
            let sqrtD = sqrt(-discriminant);
            eigenvalues.push({ re: trace / 2, im: sqrtD / 2 });
            eigenvalues.push({ re: trace / 2, im: -sqrtD / 2 });
        }

        // Adjust graph range
        let evMax = Math.max(...eigenvalues.filter(e => typeof e === 'number').map(Math.abs), 5);
        lambdaMin = -evMax * 0.5;
        lambdaMax = evMax * 1.5;
    } else {
        // 3x3 case
        let m = matrix3;
        let a = m[0][0], b = m[0][1], c = m[0][2];
        let d = m[1][0], e = m[1][1], f = m[1][2];
        let g = m[2][0], h = m[2][1], i = m[2][2];

        // Trace
        let trace = a + e + i;

        // Sum of 2x2 principal minors
        let minorSum = (a*e - b*d) + (a*i - c*g) + (e*i - f*h);

        // Determinant (using Sarrus/cofactor expansion)
        let det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);

        // p(λ) = -λ³ + trace*λ² - minorSum*λ + det
        polyCoeffs = [det, -minorSum, trace, -1];

        // Find eigenvalues numerically using Newton's method
        eigenvalues = findCubicRoots(polyCoeffs);

        // Adjust graph range
        let realEVs = eigenvalues.filter(e => typeof e === 'number');
        if (realEVs.length > 0) {
            let evMin = Math.min(...realEVs);
            let evMax = Math.max(...realEVs);
            lambdaMin = evMin - (evMax - evMin) * 0.3 - 1;
            lambdaMax = evMax + (evMax - evMin) * 0.3 + 1;
        }
    }
}

function findCubicRoots(coeffs) {
    // Numerical root finding for cubic polynomial
    let roots = [];

    // Search for real roots using bisection/Newton
    for (let start = -10; start < 10; start += 0.5) {
        let root = newtonMethod(coeffs, start);
        if (root !== null) {
            // Check if we already have this root
            let isDuplicate = false;
            for (let r of roots) {
                if (typeof r === 'number' && abs(r - root) < 0.01) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                roots.push(root);
            }
        }
    }

    return roots.slice(0, 3);
}

function newtonMethod(coeffs, x0) {
    let x = x0;
    for (let iter = 0; iter < 50; iter++) {
        let fx = 0, fpx = 0;
        for (let i = 0; i < coeffs.length; i++) {
            fx += coeffs[i] * pow(x, i);
            if (i > 0) fpx += i * coeffs[i] * pow(x, i - 1);
        }
        if (abs(fpx) < 1e-10) return null;
        let xNew = x - fx / fpx;
        if (abs(xNew - x) < 1e-8) {
            // Verify it's actually a root
            let fxNew = 0;
            for (let i = 0; i < coeffs.length; i++) {
                fxNew += coeffs[i] * pow(xNew, i);
            }
            if (abs(fxNew) < 0.01) return xNew;
            return null;
        }
        x = xNew;
    }
    return null;
}

function toggleSize() {
    matrixSize = matrixSize === 2 ? 3 : 2;
    sizeButton.html(matrixSize + '×' + matrixSize);
    selectedCell = null;
    inputBuffer = '';
    computeCharacteristicPolynomial();
}

function setRandomMatrix() {
    commitInput();
    if (matrixSize === 2) {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                matrix2[i][j] = Math.floor(random(-5, 6));
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                matrix3[i][j] = Math.floor(random(-4, 5));
            }
        }
    }
    computeCharacteristicPolynomial();
}

function setIdentityMatrix() {
    commitInput();
    if (matrixSize === 2) {
        matrix2 = [[1, 0], [0, 1]];
    } else {
        matrix3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    computeCharacteristicPolynomial();
}

function setSymmetricMatrix() {
    commitInput();
    if (matrixSize === 2) {
        matrix2 = [[3, 1], [1, 3]];
    } else {
        matrix3 = [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
    }
    computeCharacteristicPolynomial();
}

function mousePressed() {
    // Check matrix cells
    let currentMatrix = matrixSize === 2 ? matrix2 : matrix3;
    let cellSize = matrixSize === 2 ? 40 : 32;
    let panelW = canvasWidth * 0.4 - 15;
    let matrixW = matrixSize * cellSize;
    let matrixX = 10 + (panelW - matrixW) / 2;
    let matrixY = 35 + 30;

    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            let cx = matrixX + j * cellSize;
            let cy = matrixY + i * cellSize;

            if (mouseX >= cx && mouseX <= cx + cellSize && mouseY >= cy && mouseY <= cy + cellSize) {
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
            value = constrain(value, -20, 20);
            if (matrixSize === 2) {
                matrix2[selectedCell.i][selectedCell.j] = Math.round(value * 10) / 10;
            } else {
                matrix3[selectedCell.i][selectedCell.j] = Math.round(value * 10) / 10;
            }
            computeCharacteristicPolynomial();
        }
    }
    inputBuffer = '';
    selectedCell = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    traceSlider.size(canvasWidth - 100);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
