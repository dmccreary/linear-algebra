// Homography Transformation Demo MicroSim
// Shows how homographies transform images for perspective correction
// Learning objective: Apply homography for perspective transformation (Bloom: Apply)

let containerWidth;
let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let defaultTextSize = 16;

// Source image - checkerboard pattern
let gridSize = 8;
let sourceImage = [];

// Quadrilateral corners (source is always unit square)
let srcCorners = [];
let dstCorners = [];

// Dragging state
let draggedCorner = -1;
let cornerRadius = 10;

// UI Controls
let presetSelector;
let showGridCheckbox;
let showMatrixCheckbox;
let showGrid = true;
let showMatrix = true;

// Homography matrix
let H = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create preset selector
    presetSelector = createSelect();
    presetSelector.position(10, drawHeight + 12);
    presetSelector.option('Identity');
    presetSelector.option('Perspective');
    presetSelector.option('Rotation');
    presetSelector.option('Shear');
    presetSelector.option('Custom');
    presetSelector.selected('Perspective');
    presetSelector.changed(applyPreset);

    // Create checkboxes
    showGridCheckbox = createCheckbox(' Show grid', true);
    showGridCheckbox.position(150, drawHeight + 12);
    showGridCheckbox.changed(() => { showGrid = showGridCheckbox.checked(); });

    showMatrixCheckbox = createCheckbox(' Show matrix', true);
    showMatrixCheckbox.position(260, drawHeight + 12);
    showMatrixCheckbox.changed(() => { showMatrix = showMatrixCheckbox.checked(); });

    // Initialize
    generateImage();
    resetCorners();
    applyPreset();

    describe('Homography transformation demo with draggable corners showing perspective effects on an image.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Homography Transformation Demo', canvasWidth / 2, 5);

    // Calculate layout
    let panelSize = min(200, (canvasWidth - 4 * margin) / 3 - 20);
    let startY = 45;

    // Draw source image panel
    let srcX = margin;
    drawSourcePanel(srcX, startY, panelSize);

    // Draw transformed image panel
    let dstX = srcX + panelSize + margin * 2;
    drawTransformedPanel(dstX, startY, panelSize);

    // Draw matrix and info panel
    if (showMatrix) {
        let infoX = dstX + panelSize + margin * 2;
        drawInfoPanel(infoX, startY, panelSize + 40);
    }

    // Instructions
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(10);
    text('Drag the red corner points to transform the image', canvasWidth / 2, drawHeight - 20);
}

function drawSourcePanel(x, y, size) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Source Image', x + size / 2, y - 3);

    // Draw checkerboard
    let cellSize = size / gridSize;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = sourceImage[row][col];
            fill(value);
            noStroke();
            rect(x + col * cellSize, y + row * cellSize, cellSize, cellSize);
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Draw grid if enabled
    if (showGrid) {
        stroke(100, 100, 100, 100);
        strokeWeight(1);
        for (let i = 1; i < gridSize; i++) {
            line(x + i * cellSize, y, x + i * cellSize, y + size);
            line(x, y + i * cellSize, x + size, y + i * cellSize);
        }
    }

    // Draw source corners
    fill(100, 100, 255);
    stroke(0, 0, 150);
    strokeWeight(2);
    for (let i = 0; i < 4; i++) {
        let px = x + srcCorners[i].x * size;
        let py = y + srcCorners[i].y * size;
        ellipse(px, py, 8, 8);
    }
}

function drawTransformedPanel(x, y, size) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Transformed Image', x + size / 2, y - 3);

    // Background
    fill(240);
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Compute homography
    computeHomography();

    // Draw transformed checkerboard using inverse warping
    let cellSize = 1; // pixel-level for smoother result
    for (let py = 0; py < size; py += cellSize) {
        for (let px = 0; px < size; px += cellSize) {
            // Normalized destination coordinates
            let dx = px / size;
            let dy = py / size;

            // Apply inverse homography to get source coordinates
            let srcCoord = applyInverseHomography(dx, dy);

            if (srcCoord.x >= 0 && srcCoord.x < 1 && srcCoord.y >= 0 && srcCoord.y < 1) {
                // Sample source image
                let srcCol = floor(srcCoord.x * gridSize);
                let srcRow = floor(srcCoord.y * gridSize);
                srcCol = constrain(srcCol, 0, gridSize - 1);
                srcRow = constrain(srcRow, 0, gridSize - 1);

                fill(sourceImage[srcRow][srcCol]);
                noStroke();
                rect(x + px, y + py, cellSize + 1, cellSize + 1);
            }
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Draw grid if enabled
    if (showGrid) {
        stroke(100, 100, 100, 100);
        strokeWeight(1);

        // Draw transformed grid lines
        for (let i = 0; i <= gridSize; i++) {
            let t = i / gridSize;

            // Horizontal lines
            let points = [];
            for (let j = 0; j <= 10; j++) {
                let s = j / 10;
                let transformed = applyHomography(s, t);
                points.push({ x: x + transformed.x * size, y: y + transformed.y * size });
            }
            for (let j = 0; j < points.length - 1; j++) {
                line(points[j].x, points[j].y, points[j+1].x, points[j+1].y);
            }

            // Vertical lines
            points = [];
            for (let j = 0; j <= 10; j++) {
                let s = j / 10;
                let transformed = applyHomography(t, s);
                points.push({ x: x + transformed.x * size, y: y + transformed.y * size });
            }
            for (let j = 0; j < points.length - 1; j++) {
                line(points[j].x, points[j].y, points[j+1].x, points[j+1].y);
            }
        }
    }

    // Draw draggable destination corners
    for (let i = 0; i < 4; i++) {
        let px = x + dstCorners[i].x * size;
        let py = y + dstCorners[i].y * size;

        // Highlight if being dragged
        if (i === draggedCorner) {
            fill(255, 200, 200);
            stroke(255, 0, 0);
            strokeWeight(3);
        } else {
            fill(255, 100, 100);
            stroke(150, 0, 0);
            strokeWeight(2);
        }
        ellipse(px, py, cornerRadius * 2, cornerRadius * 2);

        // Label
        fill('black');
        noStroke();
        textSize(10);
        textAlign(CENTER, CENTER);
        text(['TL', 'TR', 'BR', 'BL'][i], px, py);
    }

    // Store panel bounds for mouse interaction
    this.panelX = x;
    this.panelY = y;
    this.panelSize = size;
}

function drawInfoPanel(x, y, width) {
    let height = 200;

    // Panel background
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, width, height, 5);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);

    let tx = x + 10;
    let ty = y + 10;

    text('Homography Matrix H:', tx, ty);
    ty += 18;

    // Draw matrix
    textSize(10);
    for (let row = 0; row < 3; row++) {
        let rowText = '[ ';
        for (let col = 0; col < 3; col++) {
            rowText += H[row][col].toFixed(3).padStart(8) + ' ';
        }
        rowText += ']';
        text(rowText, tx, ty);
        ty += 14;
    }

    ty += 10;
    textSize(11);
    text('Point Mapping:', tx, ty);
    ty += 16;
    textSize(10);
    text("p' ~ H · p", tx, ty);
    ty += 14;
    text("x' = (h11·x + h12·y + h13) / (h31·x + h32·y + h33)", tx, ty);
    ty += 14;
    text("y' = (h21·x + h22·y + h23) / (h31·x + h32·y + h33)", tx, ty);

    ty += 18;
    textSize(11);
    text('Degrees of Freedom: 8', tx, ty);
    ty += 14;
    text('(9 elements - 1 for scale)', tx, ty);

    // Transformation type
    ty = y + height + 15;
    textSize(10);
    textAlign(LEFT, TOP);

    let transType = classifyTransformation();
    text('Detected: ' + transType, x, ty);
}

function classifyTransformation() {
    // Simple classification based on homography structure
    let isAffine = abs(H[2][0]) < 0.001 && abs(H[2][1]) < 0.001;
    let isRotation = abs(H[0][0] - H[1][1]) < 0.1 && abs(H[0][1] + H[1][0]) < 0.1;
    let isScale = abs(H[0][1]) < 0.01 && abs(H[1][0]) < 0.01;

    if (!isAffine) return 'Projective (Homography)';
    if (isRotation && isScale) return 'Euclidean (Rotation)';
    if (isScale) return 'Scale';
    return 'Affine';
}

function generateImage() {
    // Checkerboard with colors
    let colors = [
        [200, 50, 50],    // Red
        [50, 50, 200],    // Blue
        [50, 200, 50],    // Green
        [200, 200, 50]    // Yellow
    ];

    for (let row = 0; row < gridSize; row++) {
        sourceImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let blockR = floor(row / 2);
            let blockC = floor(col / 2);
            let colorIdx = (blockR + blockC) % 4;

            // Use grayscale for simplicity
            if ((row + col) % 2 === 0) {
                sourceImage[row][col] = 200;
            } else {
                sourceImage[row][col] = 80;
            }
        }
    }
}

function resetCorners() {
    srcCorners = [
        { x: 0, y: 0 },   // Top-left
        { x: 1, y: 0 },   // Top-right
        { x: 1, y: 1 },   // Bottom-right
        { x: 0, y: 1 }    // Bottom-left
    ];

    dstCorners = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 }
    ];
}

function applyPreset() {
    let preset = presetSelector.value();

    switch (preset) {
        case 'Identity':
            dstCorners = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ];
            break;

        case 'Perspective':
            dstCorners = [
                { x: 0.15, y: 0.1 },
                { x: 0.85, y: 0.2 },
                { x: 0.9, y: 0.9 },
                { x: 0.1, y: 0.85 }
            ];
            break;

        case 'Rotation':
            let angle = PI / 6; // 30 degrees
            let cos_a = cos(angle);
            let sin_a = sin(angle);
            let cx = 0.5, cy = 0.5;

            let corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
            dstCorners = corners.map(c => {
                let x = c[0] - cx;
                let y = c[1] - cy;
                return {
                    x: constrain(cx + cos_a * x - sin_a * y, 0, 1),
                    y: constrain(cy + sin_a * x + cos_a * y, 0, 1)
                };
            });
            break;

        case 'Shear':
            dstCorners = [
                { x: 0.1, y: 0 },
                { x: 1, y: 0 },
                { x: 0.9, y: 1 },
                { x: 0, y: 1 }
            ];
            break;

        case 'Custom':
            // Keep current corners
            break;
    }

    computeHomography();
}

function computeHomography() {
    // Build the system of equations for DLT
    // Each correspondence gives 2 equations
    let A = [];

    for (let i = 0; i < 4; i++) {
        let x = srcCorners[i].x;
        let y = srcCorners[i].y;
        let xp = dstCorners[i].x;
        let yp = dstCorners[i].y;

        A.push([-x, -y, -1, 0, 0, 0, x*xp, y*xp, xp]);
        A.push([0, 0, 0, -x, -y, -1, x*yp, y*yp, yp]);
    }

    // Solve using simple pseudo-inverse (for 8 equations, 9 unknowns)
    // This is a simplified approach - real implementations use SVD

    // For this demo, use a direct approach for the 4-point case
    H = computeHomography4Point(srcCorners, dstCorners);
}

function computeHomography4Point(src, dst) {
    // Direct Linear Transform for 4 points
    let A = [];
    for (let i = 0; i < 4; i++) {
        let x = src[i].x, y = src[i].y;
        let xp = dst[i].x, yp = dst[i].y;

        A.push([-x, -y, -1, 0, 0, 0, x*xp, y*xp, xp]);
        A.push([0, 0, 0, -x, -y, -1, x*yp, y*yp, yp]);
    }

    // Simple least squares solution (not as robust as SVD but works for this demo)
    // Find null space of A using simplified method

    // For educational purposes, use explicit formulas for 4-point homography
    let x1 = src[0].x, y1 = src[0].y, x2 = src[1].x, y2 = src[1].y;
    let x3 = src[2].x, y3 = src[2].y, x4 = src[3].x, y4 = src[3].y;

    let xp1 = dst[0].x, yp1 = dst[0].y, xp2 = dst[1].x, yp2 = dst[1].y;
    let xp3 = dst[2].x, yp3 = dst[2].y, xp4 = dst[3].x, yp4 = dst[3].y;

    // Use a numerical approach
    let result = [[1,0,0],[0,1,0],[0,0,1]];

    // Iterative refinement (simplified)
    for (let iter = 0; iter < 100; iter++) {
        let error = 0;
        for (let i = 0; i < 4; i++) {
            let mapped = applyHomographyMatrix(result, src[i].x, src[i].y);
            error += pow(mapped.x - dst[i].x, 2) + pow(mapped.y - dst[i].y, 2);
        }
        if (error < 0.0001) break;
    }

    // Direct computation using cross-ratio formula
    // Compute H that maps unit square to dst quadrilateral
    let h = computeProjectiveMap(dst);
    return h;
}

function computeProjectiveMap(dst) {
    // Map unit square [0,1]x[0,1] to arbitrary quadrilateral
    let x0 = dst[0].x, y0 = dst[0].y;
    let x1 = dst[1].x, y1 = dst[1].y;
    let x2 = dst[2].x, y2 = dst[2].y;
    let x3 = dst[3].x, y3 = dst[3].y;

    let dx1 = x1 - x2;
    let dx2 = x3 - x2;
    let dx3 = x0 - x1 + x2 - x3;

    let dy1 = y1 - y2;
    let dy2 = y3 - y2;
    let dy3 = y0 - y1 + y2 - y3;

    let det = dx1 * dy2 - dy1 * dx2;
    if (abs(det) < 0.0001) det = 0.0001;

    let a13 = (dx3 * dy2 - dy3 * dx2) / det;
    let a23 = (dx1 * dy3 - dy1 * dx3) / det;

    let a11 = x1 - x0 + a13 * x1;
    let a21 = x3 - x0 + a23 * x3;
    let a31 = x0;

    let a12 = y1 - y0 + a13 * y1;
    let a22 = y3 - y0 + a23 * y3;
    let a32 = y0;

    return [
        [a11, a21, a31],
        [a12, a22, a32],
        [a13, a23, 1]
    ];
}

function applyHomographyMatrix(h, x, y) {
    let w = h[2][0] * x + h[2][1] * y + h[2][2];
    if (abs(w) < 0.0001) w = 0.0001;

    return {
        x: (h[0][0] * x + h[0][1] * y + h[0][2]) / w,
        y: (h[1][0] * x + h[1][1] * y + h[1][2]) / w
    };
}

function applyHomography(x, y) {
    return applyHomographyMatrix(H, x, y);
}

function applyInverseHomography(x, y) {
    // Compute inverse of H
    let det = H[0][0] * (H[1][1] * H[2][2] - H[1][2] * H[2][1])
            - H[0][1] * (H[1][0] * H[2][2] - H[1][2] * H[2][0])
            + H[0][2] * (H[1][0] * H[2][1] - H[1][1] * H[2][0]);

    if (abs(det) < 0.0001) return { x: -1, y: -1 };

    let Hinv = [
        [(H[1][1]*H[2][2] - H[1][2]*H[2][1])/det, (H[0][2]*H[2][1] - H[0][1]*H[2][2])/det, (H[0][1]*H[1][2] - H[0][2]*H[1][1])/det],
        [(H[1][2]*H[2][0] - H[1][0]*H[2][2])/det, (H[0][0]*H[2][2] - H[0][2]*H[2][0])/det, (H[0][2]*H[1][0] - H[0][0]*H[1][2])/det],
        [(H[1][0]*H[2][1] - H[1][1]*H[2][0])/det, (H[0][1]*H[2][0] - H[0][0]*H[2][1])/det, (H[0][0]*H[1][1] - H[0][1]*H[1][0])/det]
    ];

    return applyHomographyMatrix(Hinv, x, y);
}

function mousePressed() {
    if (typeof this.panelX === 'undefined') return;

    // Check if clicking on a corner
    for (let i = 0; i < 4; i++) {
        let px = this.panelX + dstCorners[i].x * this.panelSize;
        let py = this.panelY + dstCorners[i].y * this.panelSize;

        if (dist(mouseX, mouseY, px, py) < cornerRadius * 1.5) {
            draggedCorner = i;
            presetSelector.selected('Custom');
            return;
        }
    }
}

function mouseDragged() {
    if (draggedCorner >= 0 && typeof this.panelX !== 'undefined') {
        let newX = (mouseX - this.panelX) / this.panelSize;
        let newY = (mouseY - this.panelY) / this.panelSize;

        dstCorners[draggedCorner].x = constrain(newX, 0.05, 0.95);
        dstCorners[draggedCorner].y = constrain(newY, 0.05, 0.95);

        computeHomography();
    }
}

function mouseReleased() {
    draggedCorner = -1;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
