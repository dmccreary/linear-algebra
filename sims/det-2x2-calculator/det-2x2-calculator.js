// 2x2 Determinant Calculator
// Interactive calculator showing determinant computation with geometric visualization

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix values
let matrix = [[3, 1], [2, 4]];

// Grid settings
let gridSize = 50;
let originX, originY;

// Animation state
let animatePhase = 0;
let isAnimating = false;

// Controls
let randomButton;
let identityButton;
let singularButton;
let showStepsCheckbox;

// Input handling
let selectedCell = null;
let inputBuffer = '';

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    originX = canvasWidth * 0.65;
    originY = drawHeight / 2;

    // Create controls
    randomButton = createButton('Random');
    randomButton.position(10, drawHeight + 10);
    randomButton.mousePressed(setRandomMatrix);

    identityButton = createButton('Identity');
    identityButton.position(80, drawHeight + 10);
    identityButton.mousePressed(setIdentityMatrix);

    singularButton = createButton('Singular');
    singularButton.position(155, drawHeight + 10);
    singularButton.mousePressed(setSingularMatrix);

    showStepsCheckbox = createCheckbox(' Show Steps', true);
    showStepsCheckbox.position(10, drawHeight + 45);
    showStepsCheckbox.style('font-size', '14px');

    describe('Interactive 2x2 determinant calculator showing matrix input, step-by-step calculation, and geometric parallelogram visualization', LABEL);
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

    // Update origin for responsive design
    originX = canvasWidth * 0.65;

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('2×2 Determinant Calculator', canvasWidth / 2, 10);

    // Draw matrix input area
    drawMatrixInput();

    // Draw calculation steps
    if (showStepsCheckbox.checked()) {
        drawCalculationSteps();
    }

    // Draw geometric visualization
    drawGeometricVisualization();

    // Update animation
    if (isAnimating) {
        animatePhase += 0.02;
        if (animatePhase > 1) {
            animatePhase = 0;
            isAnimating = false;
        }
    }
}

function drawMatrixInput() {
    let matrixX = 30;
    let matrixY = 60;
    let cellW = 50;
    let cellH = 40;

    // Draw "A =" label
    fill(0);
    noStroke();
    textSize(18);
    textAlign(RIGHT, CENTER);
    text('A =', matrixX - 5, matrixY + cellH);

    // Draw bracket
    stroke(0);
    strokeWeight(2);
    noFill();
    // Left bracket
    line(matrixX, matrixY - 5, matrixX - 8, matrixY - 5);
    line(matrixX - 8, matrixY - 5, matrixX - 8, matrixY + 2*cellH + 5);
    line(matrixX - 8, matrixY + 2*cellH + 5, matrixX, matrixY + 2*cellH + 5);
    // Right bracket
    line(matrixX + 2*cellW, matrixY - 5, matrixX + 2*cellW + 8, matrixY - 5);
    line(matrixX + 2*cellW + 8, matrixY - 5, matrixX + 2*cellW + 8, matrixY + 2*cellH + 5);
    line(matrixX + 2*cellW + 8, matrixY + 2*cellH + 5, matrixX + 2*cellW, matrixY + 2*cellH + 5);

    // Draw cells
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
            rect(x, y, cellW, cellH, 5);

            // Draw value
            fill(0);
            noStroke();
            textSize(18);
            textAlign(CENTER, CENTER);
            if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                text(inputBuffer + '|', x + cellW/2, y + cellH/2);
            } else {
                text(matrix[i][j], x + cellW/2, y + cellH/2);
            }
        }
    }

    // Highlight diagonals
    let a = matrix[0][0], b = matrix[0][1], c = matrix[1][0], d = matrix[1][1];

    // Main diagonal highlight
    stroke(0, 180, 0, 100);
    strokeWeight(3);
    line(matrixX + cellW/2, matrixY + cellH/2, matrixX + 1.5*cellW, matrixY + 1.5*cellH);

    // Anti-diagonal highlight
    stroke(200, 0, 0, 100);
    strokeWeight(3);
    line(matrixX + 1.5*cellW, matrixY + cellH/2, matrixX + cellW/2, matrixY + 1.5*cellH);

    // Draw labels
    fill(0, 150, 0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text('a', matrixX + 5, matrixY + 5);
    text('d', matrixX + cellW + 5, matrixY + cellH + 5);

    fill(200, 0, 0);
    text('b', matrixX + cellW + 5, matrixY + 5);
    text('c', matrixX + 5, matrixY + cellH + 5);

    // Click instruction
    fill(100);
    textSize(12);
    textAlign(CENTER, TOP);
    text('Click cells to edit', matrixX + cellW, matrixY + 2*cellH + 15);
}

function drawCalculationSteps() {
    let a = matrix[0][0], b = matrix[0][1], c = matrix[1][0], d = matrix[1][1];
    let det = a * d - b * c;

    let stepX = 30;
    let stepY = 180;

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    text('det(A) = ad - bc', stepX, stepY);

    textSize(13);
    // Main diagonal product
    fill(0, 150, 0);
    text('ad = ' + a + ' × ' + d + ' = ' + (a*d), stepX, stepY + 25);

    // Anti-diagonal product
    fill(200, 0, 0);
    text('bc = ' + b + ' × ' + c + ' = ' + (b*c), stepX, stepY + 45);

    // Result
    fill(0);
    textSize(14);
    text('det(A) = ' + (a*d) + ' - ' + (b*c) + ' = ', stepX, stepY + 70);

    // Colored result
    if (det > 0) {
        fill(0, 150, 0);
    } else if (det < 0) {
        fill(200, 0, 0);
    } else {
        fill(100);
    }
    textSize(18);
    textAlign(LEFT, TOP);
    text(det, stepX + 130, stepY + 67);

    // Status
    textSize(12);
    fill(100);
    textAlign(LEFT, TOP);
    if (det === 0) {
        text('(Singular - not invertible)', stepX, stepY + 95);
    } else if (det > 0) {
        text('(Non-singular, preserves orientation)', stepX, stepY + 95);
    } else {
        text('(Non-singular, reverses orientation)', stepX, stepY + 95);
    }
}

function drawGeometricVisualization() {
    let a = matrix[0][0], b = matrix[0][1], c = matrix[1][0], d = matrix[1][1];
    let det = a * d - b * c;

    // Draw mini coordinate system
    let vizX = originX;
    let vizY = originY;
    let scale = 25;

    // Background for visualization
    fill(255, 255, 255, 200);
    stroke(200);
    strokeWeight(1);
    rect(vizX - 100, vizY - 90, 200, 180, 10);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Geometric View', vizX, vizY - 85);

    // Grid
    stroke(230);
    strokeWeight(1);
    for (let i = -3; i <= 3; i++) {
        line(vizX + i * scale, vizY - 80, vizX + i * scale, vizY + 80);
        line(vizX - 90, vizY + i * scale, vizX + 90, vizY + i * scale);
    }

    // Axes
    stroke(150);
    strokeWeight(1);
    line(vizX - 90, vizY, vizX + 90, vizY);
    line(vizX, vizY - 80, vizX, vizY + 80);

    // Draw parallelogram
    let col1 = { x: a, y: c };  // First column vector
    let col2 = { x: b, y: d };  // Second column vector

    // Parallelogram vertices
    let p0 = { x: vizX, y: vizY };
    let p1 = { x: vizX + col1.x * scale, y: vizY - col1.y * scale };
    let p2 = { x: vizX + (col1.x + col2.x) * scale, y: vizY - (col1.y + col2.y) * scale };
    let p3 = { x: vizX + col2.x * scale, y: vizY - col2.y * scale };

    // Fill parallelogram
    if (det > 0) {
        fill(100, 200, 100, 80);
        stroke(100, 200, 100);
    } else if (det < 0) {
        fill(200, 100, 100, 80);
        stroke(200, 100, 100);
    } else {
        fill(150, 150, 150, 80);
        stroke(150, 150, 150);
    }
    strokeWeight(2);
    beginShape();
    vertex(p0.x, p0.y);
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
    vertex(p3.x, p3.y);
    endShape(CLOSE);

    // Draw column vectors
    drawArrow(vizX, vizY, p1.x, p1.y, color(220, 60, 60), 'col1');
    drawArrow(vizX, vizY, p3.x, p3.y, color(60, 60, 220), 'col2');

    // Area label
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, CENTER);
    text('Area = |' + det + '|', vizX, vizY + 70);
}

function drawArrow(x1, y1, x2, y2, col, label) {
    stroke(col);
    strokeWeight(2);
    line(x1, y1, x2, y2);

    // Arrowhead
    let angle = atan2(y1 - y2, x2 - x1);
    let arrowSize = 8;

    fill(col);
    noStroke();
    push();
    translate(x2, y2);
    rotate(-angle);
    triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
    pop();
}

function mousePressed() {
    let matrixX = 30;
    let matrixY = 60;
    let cellW = 50;
    let cellH = 40;

    // Check if clicking on a matrix cell
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            if (mouseX >= x && mouseX <= x + cellW && mouseY >= y && mouseY <= y + cellH) {
                if (selectedCell && selectedCell.i === i && selectedCell.j === j) {
                    // Already selected, deselect
                    commitInput();
                } else {
                    // Select new cell
                    commitInput();
                    selectedCell = { i: i, j: j };
                    inputBuffer = '';
                }
                return;
            }
        }
    }

    // Clicked outside, commit input
    commitInput();
}

function keyPressed() {
    if (selectedCell) {
        if (keyCode === ENTER || keyCode === TAB) {
            commitInput();
            // Move to next cell
            if (selectedCell) {
                let newJ = (selectedCell.j + 1) % 2;
                let newI = selectedCell.i + (selectedCell.j === 1 ? 1 : 0);
                if (newI < 2) {
                    selectedCell = { i: newI, j: newJ };
                    inputBuffer = '';
                } else {
                    selectedCell = null;
                }
            }
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
        // Allow digits, minus sign, and decimal point
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
            // Clamp to reasonable range
            value = constrain(value, -10, 10);
            matrix[selectedCell.i][selectedCell.j] = Math.round(value * 10) / 10;
        }
    }
    inputBuffer = '';
    selectedCell = null;
}

function setRandomMatrix() {
    commitInput();
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            matrix[i][j] = Math.floor(random(-5, 6));
        }
    }
}

function setIdentityMatrix() {
    commitInput();
    matrix = [[1, 0], [0, 1]];
}

function setSingularMatrix() {
    commitInput();
    matrix = [[2, 4], [1, 2]];
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
    originX = canvasWidth * 0.65;
}
