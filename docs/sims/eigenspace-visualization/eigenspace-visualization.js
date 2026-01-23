// Eigenspace Visualization - 2D Version
// Shows eigenvectors and eigenspaces in 2D for clarity

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

// Grid and scale
let gridScale = 60;
let originX, originY;

// Matrix examples (2D matrices)
let currentExample = 0;
let examples = [
    {
        name: "Diagonal Matrix",
        matrix: [[2, 0], [0, 3]],
        eigenvalues: [2, 3],
        eigenvectors: [[1, 0], [0, 1]],
        description: "Scaling along x and y axes"
    },
    {
        name: "Symmetric Matrix",
        matrix: [[3, 1], [1, 3]],
        eigenvalues: [4, 2],
        eigenvectors: [normalize2D([1, 1]), normalize2D([1, -1])],
        description: "Orthogonal eigenvectors"
    },
    {
        name: "Shear-like Matrix",
        matrix: [[2, 1], [0, 2]],
        eigenvalues: [2, 2],
        eigenvectors: [[1, 0]],
        description: "Repeated eigenvalue, 1D eigenspace"
    },
    {
        name: "Reflection Matrix",
        matrix: [[0, 1], [1, 0]],
        eigenvalues: [1, -1],
        eigenvectors: [normalize2D([1, 1]), normalize2D([1, -1])],
        description: "Reflection across y=x line"
    }
];

// Controls
let prevButton, nextButton;
let showGridCheckbox;
let showTransformedCheckbox;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    originX = canvasWidth / 2;
    originY = drawHeight / 2 + 20;

    // Create controls
    const container = document.querySelector('main');

    prevButton = createButton('← Prev');
    prevButton.parent(container);
    prevButton.position(10, drawHeight + 10);
    prevButton.mousePressed(() => {
        currentExample = (currentExample - 1 + examples.length) % examples.length;
    });

    nextButton = createButton('Next →');
    nextButton.parent(container);
    nextButton.position(75, drawHeight + 10);
    nextButton.mousePressed(() => {
        currentExample = (currentExample + 1) % examples.length;
    });

    showGridCheckbox = createCheckbox(' Show Grid', true);
    showGridCheckbox.parent(container);
    showGridCheckbox.position(150, drawHeight + 10);
    showGridCheckbox.style('font-size', '14px');

    showTransformedCheckbox = createCheckbox(' Show Transformed', true);
    showTransformedCheckbox.parent(container);
    showTransformedCheckbox.position(260, drawHeight + 10);
    showTransformedCheckbox.style('font-size', '14px');
}

function draw() {
    updateCanvasSize();
    originX = canvasWidth / 2;

    // Drawing area background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Clip drawing to the drawing region
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(0, 0, canvasWidth, drawHeight);
    drawingContext.clip();

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('Eigenspace Visualization (2D)', canvasWidth/2, 8);

    // Example name and description
    let ex = examples[currentExample];
    textSize(13);
    text(ex.name, canvasWidth/2, 28);
    textSize(11);
    fill(100);
    text(ex.description, canvasWidth/2, 45);

    // Draw grid
    if (showGridCheckbox.checked()) {
        drawGrid();
    }

    // Draw axes
    drawAxes();

    // Draw eigenspaces (extended lines through origin)
    drawEigenspaces();

    // Draw eigenvectors
    drawEigenvectors();

    // Draw legend
    drawLegend();

    // Draw matrix display
    drawMatrixDisplay();

    // Restore drawing context (remove clipping)
    drawingContext.restore();

    // Control area text (drawn outside clip region)
    fill(100);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Example ' + (currentExample + 1) + '/' + examples.length, 10, drawHeight + 45);
}

function drawGrid() {
    stroke(220);
    strokeWeight(1);

    // Vertical lines
    for (let x = originX % gridScale; x < canvasWidth; x += gridScale) {
        line(x, 60, x, drawHeight - 10);
    }

    // Horizontal lines
    for (let y = 60; y < drawHeight - 10; y += gridScale) {
        line(0, y, canvasWidth, y);
    }
}

function drawAxes() {
    // X axis
    stroke(180);
    strokeWeight(2);
    line(10, originY, canvasWidth - 10, originY);

    // Y axis
    line(originX, 60, originX, drawHeight - 10);

    // Axis labels
    fill(150);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text('x', canvasWidth - 15, originY + 15);
    text('y', originX + 15, 70);

    // Origin label
    textSize(10);
    text('O', originX - 10, originY + 10);
}

function drawEigenspaces() {
    let ex = examples[currentExample];
    let colors = [
        [66, 133, 244, 100],   // Blue
        [234, 67, 53, 100],    // Red
        [52, 168, 83, 100]     // Green
    ];

    // Draw eigenspace lines (extended through origin)
    for (let i = 0; i < ex.eigenvectors.length; i++) {
        let ev = ex.eigenvectors[i];
        let c = colors[i % colors.length];

        // Draw extended line through origin
        stroke(c[0], c[1], c[2], c[3]);
        strokeWeight(8);

        let extent = 300;
        let x1 = originX - ev[0] * extent;
        let y1 = originY + ev[1] * extent;  // Flip y for screen coords
        let x2 = originX + ev[0] * extent;
        let y2 = originY - ev[1] * extent;

        line(x1, y1, x2, y2);
    }
}

function drawEigenvectors() {
    let ex = examples[currentExample];
    let colors = [
        [66, 133, 244],   // Blue
        [234, 67, 53],    // Red
        [52, 168, 83]     // Green
    ];

    for (let i = 0; i < ex.eigenvectors.length; i++) {
        let ev = ex.eigenvectors[i];
        let c = colors[i % colors.length];
        let len = 2.5 * gridScale;

        // Calculate endpoint (flip y for screen coordinates)
        let endX = originX + ev[0] * len;
        let endY = originY - ev[1] * len;

        // Draw arrow line
        stroke(c[0], c[1], c[2]);
        strokeWeight(3);
        line(originX, originY, endX, endY);

        // Draw arrowhead
        drawArrowhead(originX, originY, endX, endY, c);

        // Draw transformed vector if checkbox is checked
        if (showTransformedCheckbox.checked()) {
            let lambda = ex.eigenvalues[i];
            let transformedLen = len * lambda / 2;  // Scale down for visibility
            let txEndX = originX + ev[0] * transformedLen;
            let txEndY = originY - ev[1] * transformedLen;

            // Draw dashed transformed vector
            stroke(c[0], c[1], c[2], 150);
            strokeWeight(2);
            drawDashedLine(originX, originY, txEndX, txEndY);

            // Small arrowhead for transformed
            drawArrowhead(originX, originY, txEndX, txEndY, c, 0.7);
        }
    }
}

function drawArrowhead(x1, y1, x2, y2, col, scale = 1) {
    let angle = atan2(y2 - y1, x2 - x1);
    let arrowSize = 12 * scale;

    push();
    translate(x2, y2);
    rotate(angle);

    fill(col[0], col[1], col[2]);
    noStroke();
    triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
    pop();
}

function drawDashedLine(x1, y1, x2, y2) {
    let steps = 12;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        line(
            lerp(x1, x2, t1), lerp(y1, y2, t1),
            lerp(x1, x2, t2), lerp(y1, y2, t2)
        );
    }
}

function drawLegend() {
    let ex = examples[currentExample];
    let legendX = canvasWidth - 130;
    let legendY = 65;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    let legendHeight = 25 + ex.eigenvectors.length * 22;
    rect(legendX - 10, legendY - 5, 135, legendHeight, 5);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Eigenvectors:', legendX, legendY);

    let colors = [
        [66, 133, 244],
        [234, 67, 53],
        [52, 168, 83]
    ];

    for (let i = 0; i < ex.eigenvectors.length; i++) {
        let c = colors[i % colors.length];
        let ev = ex.eigenvectors[i];
        let lambda = ex.eigenvalues[i];

        fill(c[0], c[1], c[2]);
        ellipse(legendX + 8, legendY + 22 + i * 22, 10, 10);

        fill(0);
        textAlign(LEFT, CENTER);
        let evStr = '(' + ev[0].toFixed(2) + ', ' + ev[1].toFixed(2) + ')';
        text('λ=' + lambda.toFixed(1) + ' ' + evStr, legendX + 18, legendY + 22 + i * 22);
    }
}

function drawMatrixDisplay() {
    let ex = examples[currentExample];
    let mx = 15;
    let my = 70;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(mx - 5, my - 5, 75, 55, 5);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Matrix A:', mx, my);

    textSize(12);
    textAlign(CENTER, TOP);
    // Draw matrix brackets
    text('[', mx + 10, my + 18);
    text(ex.matrix[0][0].toFixed(1), mx + 25, my + 18);
    text(ex.matrix[0][1].toFixed(1), mx + 50, my + 18);
    text(']', mx + 65, my + 18);

    text('[', mx + 10, my + 33);
    text(ex.matrix[1][0].toFixed(1), mx + 25, my + 33);
    text(ex.matrix[1][1].toFixed(1), mx + 50, my + 33);
    text(']', mx + 65, my + 33);
}

function normalize2D(v) {
    let mag = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    return [v[0]/mag, v[1]/mag];
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
