// Eigenvector Transformation Visualization
// Demonstrates how eigenvectors maintain their direction under linear transformation
// while other vectors change direction

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 140;

// Matrix A (2x2)
let matrix = [[2, 1], [1, 2]];

// Computed eigenvalues and eigenvectors
let eigenvalues = [];
let eigenvectors = [];

// User vector
let userVector = { x: 1, y: 0 };
let isDragging = false;

// Grid and coordinate system
let gridSize = 40;
let originX, originY;

// Animation
let animatePhase = 0;
let isAnimating = false;
let animationDuration = 60; // frames
let animationFrame = 0;

// Controls
let showEigenvectorsCheckbox;
let animateButton;
let resetButton;

// Matrix input
let matrixInputs = [];
let selectedCell = null;
let inputBuffer = '';

// Eigenvector detection threshold (angle in radians)
let eigenThreshold = 0.08;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    originX = canvasWidth / 2;
    originY = drawHeight / 2 - 20;

    // Create controls
    showEigenvectorsCheckbox = createCheckbox(' Show Eigenvectors', true);
    showEigenvectorsCheckbox.position(10, drawHeight + 10);
    showEigenvectorsCheckbox.style('font-size', '14px');

    animateButton = createButton('Animate Transform');
    animateButton.position(160, drawHeight + 10);
    animateButton.mousePressed(startAnimation);

    resetButton = createButton('Reset');
    resetButton.position(290, drawHeight + 10);
    resetButton.mousePressed(resetVector);

    // Compute eigenvectors for initial matrix
    computeEigen();

    describe('Interactive visualization of eigenvectors showing how they maintain direction under linear transformation while other vectors change direction', LABEL);
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

    originX = canvasWidth / 2;

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Eigenvector Transformation Visualization', canvasWidth / 2, 8);

    // Draw matrix display
    drawMatrixDisplay();

    // Draw coordinate grid
    drawGrid();

    // Draw eigenvector directions if checkbox is checked
    if (showEigenvectorsCheckbox.checked()) {
        drawEigenvectorDirections();
    }

    // Draw unit circle (faint)
    stroke(200);
    strokeWeight(1);
    noFill();
    ellipse(originX, originY, gridSize * 2, gridSize * 2);

    // Check if user vector aligns with eigenvector
    let isOnEigenvector = checkEigenvectorAlignment();

    // Draw user vector and transformed vector
    drawVectors(isOnEigenvector);

    // Draw info panel
    drawInfoPanel(isOnEigenvector);

    // Handle animation
    if (isAnimating) {
        animationFrame++;
        animatePhase = animationFrame / animationDuration;
        if (animationFrame >= animationDuration) {
            isAnimating = false;
            animationFrame = 0;
            animatePhase = 1;
        }
    }

    // Control area labels
    fill(100);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text('Drag the blue vector to explore', 10, drawHeight + 45);
    text('Click matrix cells to edit values', 10, drawHeight + 62);
}

function drawMatrixDisplay() {
    let matrixX = canvasWidth - 130;
    let matrixY = 40;
    let cellW = 35;
    let cellH = 30;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(matrixX - 40, matrixY - 25, 120, 100, 8);

    // Label
    fill(0);
    noStroke();
    textSize(14);
    textAlign(CENTER, TOP);
    text('Matrix A', matrixX + 25, matrixY - 20);

    // Draw "A =" label
    textSize(14);
    textAlign(RIGHT, CENTER);
    text('A =', matrixX - 5, matrixY + cellH);

    // Draw matrix cells
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            // Highlight selected cell
            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                fill(200, 220, 255);
                stroke(100, 150, 255);
            } else {
                fill(255);
                stroke(180);
            }
            strokeWeight(1);
            rect(x, y, cellW, cellH, 3);

            // Draw value
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
}

function drawGrid() {
    // Draw grid lines
    stroke(230);
    strokeWeight(1);

    let numLines = 10;
    for (let i = -numLines; i <= numLines; i++) {
        // Vertical lines
        let x = originX + i * gridSize;
        if (x >= 0 && x <= canvasWidth) {
            line(x, 40, x, drawHeight - 40);
        }
        // Horizontal lines
        let y = originY + i * gridSize;
        if (y >= 40 && y <= drawHeight - 40) {
            line(0, y, canvasWidth, y);
        }
    }

    // Draw axes
    stroke(150);
    strokeWeight(2);
    // X-axis
    line(0, originY, canvasWidth, originY);
    // Y-axis
    line(originX, 40, originX, drawHeight - 40);

    // Axis labels
    fill(100);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('x', canvasWidth - 15, originY + 5);
    textAlign(RIGHT, CENTER);
    text('y', originX - 8, 50);
}

function drawEigenvectorDirections() {
    for (let i = 0; i < eigenvectors.length; i++) {
        let ev = eigenvectors[i];
        let lambda = eigenvalues[i];

        // Skip complex eigenvalues
        if (typeof lambda !== 'number') continue;

        // Draw dashed line through origin
        stroke(100, 180, 100, 150);
        strokeWeight(2);
        drawDashedLine(
            originX - ev.x * 300, originY + ev.y * 300,
            originX + ev.x * 300, originY - ev.y * 300
        );

        // Label
        fill(100, 180, 100);
        noStroke();
        textSize(11);
        textAlign(LEFT, CENTER);
        let labelX = originX + ev.x * 120;
        let labelY = originY - ev.y * 120;
        text('λ=' + lambda.toFixed(2), labelX + 5, labelY);
    }
}

function drawDashedLine(x1, y1, x2, y2) {
    let steps = 30;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        line(
            lerp(x1, x2, t1), lerp(y1, y2, t1),
            lerp(x1, x2, t2), lerp(y1, y2, t2)
        );
    }
}

function drawVectors(isOnEigenvector) {
    // Normalize user vector for display
    let mag = sqrt(userVector.x * userVector.x + userVector.y * userVector.y);
    if (mag < 0.01) mag = 1;

    // Original vector endpoint
    let vx = originX + userVector.x * gridSize;
    let vy = originY - userVector.y * gridSize;

    // Compute transformed vector: Av
    let transformed = {
        x: matrix[0][0] * userVector.x + matrix[0][1] * userVector.y,
        y: matrix[1][0] * userVector.x + matrix[1][1] * userVector.y
    };

    // Transformed vector endpoint
    let tvx = originX + transformed.x * gridSize;
    let tvy = originY - transformed.y * gridSize;

    // Interpolate for animation
    let displayTx, displayTy;
    if (isAnimating) {
        displayTx = lerp(vx, tvx, animatePhase);
        displayTy = lerp(vy, tvy, animatePhase);
    } else {
        displayTx = tvx;
        displayTy = tvy;
    }

    // Draw transformed vector (red/green if on eigenvector)
    let transformColor;
    if (isOnEigenvector) {
        transformColor = color(50, 180, 50);
        // Glow effect
        stroke(50, 180, 50, 50);
        strokeWeight(8);
        line(originX, originY, displayTx, displayTy);
    } else {
        transformColor = color(200, 60, 60);
    }

    drawArrow(originX, originY, displayTx, displayTy, transformColor, 3);

    // Draw original vector (blue, with glow if on eigenvector)
    let originalColor;
    if (isOnEigenvector) {
        originalColor = color(50, 100, 200);
        // Glow effect
        stroke(50, 180, 50, 50);
        strokeWeight(8);
        line(originX, originY, vx, vy);
    } else {
        originalColor = color(60, 60, 200);
    }

    drawArrow(originX, originY, vx, vy, originalColor, 3);

    // Draw drag handle
    fill(isOnEigenvector ? color(50, 180, 50) : color(60, 60, 200));
    stroke(255);
    strokeWeight(2);
    ellipse(vx, vy, 16, 16);
}

function drawArrow(x1, y1, x2, y2, col, weight) {
    stroke(col);
    strokeWeight(weight);
    line(x1, y1, x2, y2);

    // Arrowhead
    let angle = atan2(y1 - y2, x2 - x1);
    let arrowSize = 10;

    fill(col);
    noStroke();
    push();
    translate(x2, y2);
    rotate(-angle);
    triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
    pop();
}

function drawInfoPanel(isOnEigenvector) {
    let panelX = 10;
    let panelY = 40;
    let panelW = 150;
    let panelH = 100;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Content
    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    text('Vector v: (' + userVector.x.toFixed(2) + ', ' + userVector.y.toFixed(2) + ')', panelX + 8, panelY + 10);

    let transformed = {
        x: matrix[0][0] * userVector.x + matrix[0][1] * userVector.y,
        y: matrix[1][0] * userVector.x + matrix[1][1] * userVector.y
    };

    text('Av: (' + transformed.x.toFixed(2) + ', ' + transformed.y.toFixed(2) + ')', panelX + 8, panelY + 28);

    // Compute scaling factor (ratio of magnitudes)
    let origMag = sqrt(userVector.x * userVector.x + userVector.y * userVector.y);
    let transMag = sqrt(transformed.x * transformed.x + transformed.y * transformed.y);
    let scaleFactor = origMag > 0.01 ? transMag / origMag : 0;

    text('Scale factor: ' + scaleFactor.toFixed(3), panelX + 8, panelY + 46);

    // Eigenvector detection message
    if (isOnEigenvector) {
        fill(50, 180, 50);
        textSize(13);
        text('Eigenvector detected!', panelX + 8, panelY + 70);

        // Find which eigenvalue
        let closestLambda = findClosestEigenvalue();
        if (closestLambda !== null) {
            textSize(11);
            text('λ ≈ ' + closestLambda.toFixed(3), panelX + 8, panelY + 85);
        }
    } else {
        fill(100);
        textSize(11);
        text('Direction changed', panelX + 8, panelY + 70);
    }
}

function checkEigenvectorAlignment() {
    let mag = sqrt(userVector.x * userVector.x + userVector.y * userVector.y);
    if (mag < 0.01) return false;

    // Normalize user vector
    let ux = userVector.x / mag;
    let uy = userVector.y / mag;

    for (let i = 0; i < eigenvectors.length; i++) {
        let ev = eigenvectors[i];

        // Check if parallel (dot product close to ±1)
        let dot = ux * ev.x + uy * ev.y;
        if (abs(abs(dot) - 1) < eigenThreshold) {
            return true;
        }
    }
    return false;
}

function findClosestEigenvalue() {
    let mag = sqrt(userVector.x * userVector.x + userVector.y * userVector.y);
    if (mag < 0.01) return null;

    let ux = userVector.x / mag;
    let uy = userVector.y / mag;

    let closest = null;
    let bestDot = 0;

    for (let i = 0; i < eigenvectors.length; i++) {
        let ev = eigenvectors[i];
        let dot = abs(ux * ev.x + uy * ev.y);
        if (dot > bestDot) {
            bestDot = dot;
            closest = eigenvalues[i];
        }
    }
    return closest;
}

function computeEigen() {
    // For 2x2 matrix [[a, b], [c, d]]
    // Eigenvalues are roots of λ² - (a+d)λ + (ad-bc) = 0
    let a = matrix[0][0], b = matrix[0][1];
    let c = matrix[1][0], d = matrix[1][1];

    let trace = a + d;
    let det = a * d - b * c;
    let discriminant = trace * trace - 4 * det;

    eigenvalues = [];
    eigenvectors = [];

    if (discriminant >= 0) {
        // Real eigenvalues
        let sqrtDisc = sqrt(discriminant);
        let lambda1 = (trace + sqrtDisc) / 2;
        let lambda2 = (trace - sqrtDisc) / 2;

        eigenvalues.push(lambda1, lambda2);

        // Compute eigenvectors
        eigenvectors.push(computeEigenvector(lambda1));
        eigenvectors.push(computeEigenvector(lambda2));
    } else {
        // Complex eigenvalues - store as objects with real and imag parts
        let realPart = trace / 2;
        let imagPart = sqrt(-discriminant) / 2;
        eigenvalues.push({ re: realPart, im: imagPart });
        eigenvalues.push({ re: realPart, im: -imagPart });
    }
}

function computeEigenvector(lambda) {
    let a = matrix[0][0], b = matrix[0][1];
    let c = matrix[1][0], d = matrix[1][1];

    // Solve (A - λI)v = 0
    // Use the first row: (a-λ)x + by = 0
    // If b ≠ 0, we can use v = [b, λ-a]
    // If b = 0 and a-λ ≠ 0, use v = [0, 1]
    // Otherwise use second row

    let ev;
    if (abs(b) > 0.0001) {
        ev = { x: b, y: lambda - a };
    } else if (abs(a - lambda) > 0.0001) {
        ev = { x: 0, y: 1 };
    } else if (abs(c) > 0.0001) {
        ev = { x: lambda - d, y: c };
    } else {
        ev = { x: 1, y: 0 };
    }

    // Normalize
    let mag = sqrt(ev.x * ev.x + ev.y * ev.y);
    if (mag > 0.0001) {
        ev.x /= mag;
        ev.y /= mag;
    }

    return ev;
}

function mousePressed() {
    // Check matrix cells
    let matrixX = canvasWidth - 130;
    let matrixY = 40;
    let cellW = 35;
    let cellH = 30;

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

    // Check if clicking on vector handle
    let vx = originX + userVector.x * gridSize;
    let vy = originY - userVector.y * gridSize;

    if (dist(mouseX, mouseY, vx, vy) < 20) {
        isDragging = true;
        commitInput();
        return;
    }

    // Clicked elsewhere, commit input
    commitInput();
}

function mouseDragged() {
    if (isDragging) {
        userVector.x = (mouseX - originX) / gridSize;
        userVector.y = (originY - mouseY) / gridSize;

        // Clamp to reasonable range
        let mag = sqrt(userVector.x * userVector.x + userVector.y * userVector.y);
        if (mag > 5) {
            userVector.x *= 5 / mag;
            userVector.y *= 5 / mag;
        }
    }
}

function mouseReleased() {
    isDragging = false;
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
            value = constrain(value, -10, 10);
            matrix[selectedCell.i][selectedCell.j] = Math.round(value * 100) / 100;
            computeEigen();
        }
    }
    inputBuffer = '';
    selectedCell = null;
}

function startAnimation() {
    isAnimating = true;
    animationFrame = 0;
    animatePhase = 0;
}

function resetVector() {
    userVector = { x: 1, y: 0 };
    isAnimating = false;
    animationFrame = 0;
    animatePhase = 0;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
    originX = canvasWidth / 2;
}
