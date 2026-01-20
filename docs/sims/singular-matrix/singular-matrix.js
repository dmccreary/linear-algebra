// Singular vs Non-Singular Matrix Visualizer
// Shows geometric difference between singular and non-singular transformations

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Matrix values
let matrix = [[2, 4], [1, 2]]; // Default: singular

// Animation
let morphT = 1.0; // 0 = identity, 1 = current matrix
let isAnimating = false;
let animationDir = 1;

// Grid settings
let gridSize = 50;
let originX, originY;

// Controls
let morphSlider;
let singularButton;
let nonSingularButton;
let randomButton;
let showGridCheckbox;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    originX = canvasWidth / 2;
    originY = drawHeight / 2;

    // Controls
    singularButton = createButton('Singular');
    singularButton.position(10, drawHeight + 10);
    singularButton.mousePressed(setSingular);

    nonSingularButton = createButton('Non-singular');
    nonSingularButton.position(85, drawHeight + 10);
    nonSingularButton.mousePressed(setNonSingular);

    randomButton = createButton('Random');
    randomButton.position(185, drawHeight + 10);
    randomButton.mousePressed(setRandom);

    morphSlider = createSlider(0, 1, 1, 0.01);
    morphSlider.position(sliderLeftMargin, drawHeight + 45);
    morphSlider.size(canvasWidth - sliderLeftMargin - margin);

    showGridCheckbox = createCheckbox(' Show Grid', true);
    showGridCheckbox.position(10, drawHeight + 50);
    showGridCheckbox.style('font-size', '14px');

    describe('Visualization showing the geometric difference between singular and non-singular matrices through transformation of a unit square', LABEL);
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
    morphT = morphSlider.value();

    // Calculate interpolated matrix
    let interpMatrix = interpolateMatrix([[1, 0], [0, 1]], matrix, morphT);
    let det = interpMatrix[0][0] * interpMatrix[1][1] - interpMatrix[0][1] * interpMatrix[1][0];

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Singular vs Non-Singular Transformation', canvasWidth / 2, 10);

    // Draw grid if enabled
    if (showGridCheckbox.checked()) {
        drawTransformedGrid(interpMatrix);
    }

    // Draw axes
    drawAxes();

    // Draw unit square transformation
    drawUnitSquareTransformation(interpMatrix);

    // Draw column vectors
    drawColumnVectors(interpMatrix);

    // Draw info panel
    drawInfoPanel(interpMatrix, det);

    // Update control positions
    morphSlider.size(canvasWidth - sliderLeftMargin - margin);

    // Draw morph label
    fill('black');
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text('Morph: ' + (morphT * 100).toFixed(0) + '%', sliderLeftMargin - 60, drawHeight + 55);
}

function drawAxes() {
    stroke(150);
    strokeWeight(1);

    // X-axis
    line(0, originY, canvasWidth, originY);
    // Y-axis
    line(originX, 0, originX, drawHeight);

    // Axis labels
    fill(100);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('x', canvasWidth - 15, originY + 5);
    textAlign(LEFT, CENTER);
    text('y', originX + 5, 15);
}

function drawTransformedGrid(mat) {
    stroke(220);
    strokeWeight(1);

    // Draw transformed grid lines
    for (let i = -5; i <= 5; i++) {
        // Vertical lines in original space
        let x1Orig = i;
        let y1Orig = -5;
        let x2Orig = i;
        let y2Orig = 5;

        let p1 = transformPoint(x1Orig, y1Orig, mat);
        let p2 = transformPoint(x2Orig, y2Orig, mat);

        line(originX + p1.x * gridSize, originY - p1.y * gridSize,
             originX + p2.x * gridSize, originY - p2.y * gridSize);

        // Horizontal lines
        let hx1Orig = -5;
        let hy1Orig = i;
        let hx2Orig = 5;
        let hy2Orig = i;

        let hp1 = transformPoint(hx1Orig, hy1Orig, mat);
        let hp2 = transformPoint(hx2Orig, hy2Orig, mat);

        line(originX + hp1.x * gridSize, originY - hp1.y * gridSize,
             originX + hp2.x * gridSize, originY - hp2.y * gridSize);
    }
}

function drawUnitSquareTransformation(mat) {
    // Original unit square corners
    let corners = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 }
    ];

    // Transform corners
    let transformed = corners.map(c => transformPoint(c.x, c.y, mat));

    // Calculate determinant to determine color
    let det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];

    // Draw transformed shape
    if (Math.abs(det) < 0.01) {
        // Singular - collapsed to line
        stroke(150, 50, 50);
        strokeWeight(4);
        fill(150, 50, 50, 50);
    } else if (det > 0) {
        stroke(50, 150, 50);
        strokeWeight(2);
        fill(50, 150, 50, 80);
    } else {
        stroke(150, 50, 150);
        strokeWeight(2);
        fill(150, 50, 150, 80);
    }

    beginShape();
    for (let p of transformed) {
        vertex(originX + p.x * gridSize, originY - p.y * gridSize);
    }
    endShape(CLOSE);

    // Draw corner dots
    fill(0);
    noStroke();
    for (let p of transformed) {
        ellipse(originX + p.x * gridSize, originY - p.y * gridSize, 6, 6);
    }
}

function drawColumnVectors(mat) {
    // Column 1 (red)
    let col1 = { x: mat[0][0], y: mat[1][0] };
    // Column 2 (blue)
    let col2 = { x: mat[0][1], y: mat[1][1] };

    // Draw column 1
    stroke(200, 60, 60);
    strokeWeight(3);
    line(originX, originY, originX + col1.x * gridSize, originY - col1.y * gridSize);
    drawArrowHead(originX + col1.x * gridSize, originY - col1.y * gridSize,
                  atan2(-col1.y, col1.x), color(200, 60, 60));

    // Draw column 2
    stroke(60, 60, 200);
    strokeWeight(3);
    line(originX, originY, originX + col2.x * gridSize, originY - col2.y * gridSize);
    drawArrowHead(originX + col2.x * gridSize, originY - col2.y * gridSize,
                  atan2(-col2.y, col2.x), color(60, 60, 200));

    // Labels
    fill(200, 60, 60);
    noStroke();
    textSize(14);
    textAlign(LEFT, BOTTOM);
    text('col₁', originX + col1.x * gridSize + 5, originY - col1.y * gridSize - 5);

    fill(60, 60, 200);
    text('col₂', originX + col2.x * gridSize + 5, originY - col2.y * gridSize - 5);
}

function drawArrowHead(x, y, angle, col) {
    fill(col);
    noStroke();
    push();
    translate(x, y);
    rotate(-angle);
    triangle(0, 0, -10, -5, -10, 5);
    pop();
}

function drawInfoPanel(mat, det) {
    let panelX = 10;
    let panelY = 40;
    let panelW = 120;
    let panelH = 120;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 10);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    // Matrix display
    text('Matrix:', panelX + 10, panelY + 8);
    textSize(11);
    text('[' + mat[0][0].toFixed(2) + ', ' + mat[0][1].toFixed(2) + ']', panelX + 10, panelY + 25);
    text('[' + mat[1][0].toFixed(2) + ', ' + mat[1][1].toFixed(2) + ']', panelX + 10, panelY + 40);

    // Determinant
    textSize(12);
    text('det(A) = ' + det.toFixed(2), panelX + 10, panelY + 60);

    // Status
    textSize(14);
    if (Math.abs(det) < 0.01) {
        fill(150, 50, 50);
        text('SINGULAR', panelX + 10, panelY + 80);
        textSize(10);
        fill(100);
        text('Not invertible', panelX + 10, panelY + 98);
        text('Collapses space', panelX + 10, panelY + 110);
    } else {
        fill(50, 150, 50);
        text('NON-SINGULAR', panelX + 10, panelY + 80);
        textSize(10);
        fill(100);
        text('Invertible', panelX + 10, panelY + 98);
        text('Area = |' + Math.abs(det).toFixed(2) + '|', panelX + 10, panelY + 110);
    }
}

function transformPoint(x, y, mat) {
    return {
        x: mat[0][0] * x + mat[0][1] * y,
        y: mat[1][0] * x + mat[1][1] * y
    };
}

function interpolateMatrix(m1, m2, t) {
    return [
        [m1[0][0] * (1-t) + m2[0][0] * t, m1[0][1] * (1-t) + m2[0][1] * t],
        [m1[1][0] * (1-t) + m2[1][0] * t, m1[1][1] * (1-t) + m2[1][1] * t]
    ];
}

function setSingular() {
    matrix = [[2, 4], [1, 2]];
    morphSlider.value(0);
}

function setNonSingular() {
    matrix = [[2, 1], [1, 3]];
    morphSlider.value(0);
}

function setRandom() {
    matrix = [
        [random(-2, 3), random(-2, 3)],
        [random(-2, 3), random(-2, 3)]
    ];
    morphSlider.value(0);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    morphSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
    originX = canvasWidth / 2;
}
