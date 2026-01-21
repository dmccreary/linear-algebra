// Corner Detection Visualizer MicroSim
// Shows Harris corner detection using structure tensor eigenvalues
// Learning objective: Analyze how eigenvalues identify corners (Bloom: Analyze)

let containerWidth;
let canvasWidth = 850;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let defaultTextSize = 16;

// Image data - 20x20 for better corner visibility
let gridSize = 20;
let originalImage = [];
let harrisResponse = [];
let cornerPoints = [];

// Structure tensor components
let Ixx = [];
let Ixy = [];
let Iyy = [];

// UI Controls
let imageSelector;
let kSlider;
let thresholdSlider;
let showHeatmapCheckbox;
let showHeatmap = true;

// Harris parameter
let harrisK = 0.04;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 12);
    imageSelector.option('Checkerboard');
    imageSelector.option('Rectangle');
    imageSelector.option('L-Shape');
    imageSelector.option('Multiple Shapes');
    imageSelector.option('Diamond');
    imageSelector.selected('Checkerboard');
    imageSelector.changed(processImage);

    // Create k slider
    kSlider = createSlider(0.01, 0.15, 0.04, 0.01);
    kSlider.position(180, drawHeight + 12);
    kSlider.size(100);
    kSlider.input(computeHarrisResponse);

    // Create threshold slider
    thresholdSlider = createSlider(0, 100, 30, 1);
    thresholdSlider.position(400, drawHeight + 12);
    thresholdSlider.size(100);
    thresholdSlider.input(detectCorners);

    // Create heatmap checkbox
    showHeatmapCheckbox = createCheckbox(' Response heatmap', true);
    showHeatmapCheckbox.position(600, drawHeight + 12);
    showHeatmapCheckbox.changed(() => { showHeatmap = showHeatmapCheckbox.checked(); });

    // Initialize
    generateImage();
    computeGradients();
    computeHarrisResponse();
    detectCorners();

    describe('Harris corner detection visualization showing structure tensor analysis and detected corner points.', LABEL);
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
    text('Harris Corner Detection Visualizer', canvasWidth / 2, 5);

    // Calculate layout
    let panelWidth = (canvasWidth - 4 * margin) / 3;
    let imageSize = min(panelWidth - 20, 180);
    let startY = 40;

    // Draw panels
    let x = margin;
    drawImageWithCorners(x, startY, imageSize, 'Original + Corners', originalImage);

    x += panelWidth + margin;
    if (showHeatmap) {
        drawResponseHeatmap(x, startY, imageSize, 'Harris Response');
    } else {
        drawEigenvalueScatter(x, startY, imageSize);
    }

    x += panelWidth + margin;
    drawStructureTensorDemo(x, startY, imageSize);

    // Draw explanation
    drawExplanation(margin, startY + imageSize + 25);

    // Control labels
    drawControlLabels();
}

function drawImageWithCorners(x, y, size, label, data) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(label, x + size / 2, y - 3);

    // Draw pixels
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = data[row][col];
            fill(constrain(value, 0, 255));
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Draw corner markers
    fill(255, 0, 0);
    stroke(255, 255, 0);
    strokeWeight(2);
    for (let corner of cornerPoints) {
        let cx = x + corner.col * pixelSize + pixelSize / 2;
        let cy = y + corner.row * pixelSize + pixelSize / 2;
        ellipse(cx, cy, pixelSize * 0.8, pixelSize * 0.8);
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Corner count
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(10);
    text('Detected: ' + cornerPoints.length + ' corners', x + size / 2, y + size + 5);
}

function drawResponseHeatmap(x, y, size, label) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(label, x + size / 2, y - 3);

    // Find max response
    let maxR = 0.001;
    let minR = 0;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (harrisResponse[row][col] > maxR) maxR = harrisResponse[row][col];
            if (harrisResponse[row][col] < minR) minR = harrisResponse[row][col];
        }
    }

    // Draw heatmap
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let r = harrisResponse[row][col];
            let c;
            if (r > 0) {
                // Corner response: red
                let intensity = map(r, 0, maxR, 0, 255);
                c = color(255, 255 - intensity, 255 - intensity);
            } else {
                // Edge or flat: blue to white
                let intensity = map(r, minR, 0, 255, 0);
                c = color(255 - intensity, 255 - intensity, 255);
            }
            fill(c);
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Legend
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(9);
    text('Red = corner, Blue = edge, White = flat', x + size / 2, y + size + 5);
}

function drawEigenvalueScatter(x, y, size) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Eigenvalue Space (λ1 vs λ2)', x + size / 2, y - 3);

    // Background
    fill(255);
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Axes
    stroke(100);
    strokeWeight(1);
    line(x, y + size - 20, x + size, y + size - 20); // x-axis
    line(x + 20, y, x + 20, y + size); // y-axis

    // Axis labels
    fill('black');
    noStroke();
    textSize(9);
    textAlign(CENTER, TOP);
    text('λ1', x + size - 15, y + size - 15);
    textAlign(RIGHT, CENTER);
    text('λ2', x + 15, y + 10);

    // Region labels
    textSize(8);
    fill(150);
    textAlign(LEFT, TOP);
    text('Flat', x + 25, y + size - 35);
    text('Edge', x + size - 40, y + size - 35);
    text('Edge', x + 25, y + 10);
    fill(200, 0, 0);
    text('Corner', x + size - 45, y + 10);

    // Plot points
    let maxEig = 0.001;
    for (let row = 2; row < gridSize - 2; row++) {
        for (let col = 2; col < gridSize - 2; col++) {
            let eigenvalues = computeEigenvalues(row, col);
            if (eigenvalues.l1 > maxEig) maxEig = eigenvalues.l1;
            if (eigenvalues.l2 > maxEig) maxEig = eigenvalues.l2;
        }
    }

    for (let row = 2; row < gridSize - 2; row++) {
        for (let col = 2; col < gridSize - 2; col++) {
            let eigenvalues = computeEigenvalues(row, col);
            let px = map(eigenvalues.l1, 0, maxEig, x + 25, x + size - 10);
            let py = map(eigenvalues.l2, 0, maxEig, y + size - 25, y + 10);

            // Color by response
            let r = harrisResponse[row][col];
            if (r > 0) {
                fill(255, 100, 100);
            } else {
                fill(100, 100, 200);
            }
            noStroke();
            ellipse(px, py, 4, 4);
        }
    }
}

function drawStructureTensorDemo(x, y, size) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Structure Tensor Analysis', x + size / 2, y - 3);

    // Background
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, size, size + 55, 5);

    // Formula
    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(10);

    let lineH = 14;
    let tx = x + 10;
    let ty = y + 10;

    text('Structure Tensor M:', tx, ty);
    ty += lineH + 5;

    textSize(9);
    text('    | Σ Ix²    Σ IxIy |', tx, ty);
    ty += lineH;
    text('M = |                    |', tx, ty);
    ty += lineH;
    text('    | Σ IxIy   Σ Iy²  |', tx, ty);
    ty += lineH + 8;

    text('Harris Response:', tx, ty);
    ty += lineH;
    text('R = det(M) - k·trace(M)²', tx, ty);
    ty += lineH;
    text('R = λ1·λ2 - k·(λ1+λ2)²', tx, ty);
    ty += lineH + 8;

    text('Classification:', tx, ty);
    ty += lineH;
    fill(100, 180, 100);
    text('• Both λ large → Corner', tx, ty);
    ty += lineH;
    fill(100, 100, 200);
    text('• One λ large → Edge', tx, ty);
    ty += lineH;
    fill(150);
    text('• Both λ small → Flat', tx, ty);
}

function drawExplanation(x, y) {
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, canvasWidth - 2 * margin, 55, 5);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(10);

    let col1 = x + 15;
    let col2 = x + 280;
    let col3 = x + 530;

    text('How It Works:', col1, y + 8);
    text('1. Compute image gradients Ix, Iy', col1, y + 22);
    text('2. Build structure tensor from local gradients', col1, y + 36);

    text('Eigenvalue Interpretation:', col2, y + 8);
    text('λ1, λ2 measure gradient change in principal dirs', col2, y + 22);
    text('Large eigenvalues = significant intensity change', col2, y + 36);

    text('Harris Response:', col3, y + 8);
    text('Positive R: corner (both λ large)', col3, y + 22);
    text('Negative R: edge (one λ large)', col3, y + 36);
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    text('k = ' + kSlider.value().toFixed(2), 290, drawHeight + 25);
    text('Threshold: ' + thresholdSlider.value() + '%', 510, drawHeight + 25);
}

function generateImage() {
    let imageType = imageSelector.value();

    for (let row = 0; row < gridSize; row++) {
        originalImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value = 50; // Default background

            switch (imageType) {
                case 'Checkerboard':
                    let blockSize = 4;
                    let blockR = floor(row / blockSize);
                    let blockC = floor(col / blockSize);
                    value = ((blockR + blockC) % 2 === 0) ? 200 : 50;
                    break;

                case 'Rectangle':
                    if (row >= 5 && row <= 14 && col >= 5 && col <= 14) {
                        value = 200;
                    }
                    break;

                case 'L-Shape':
                    if ((row >= 4 && row <= 15 && col >= 4 && col <= 8) ||
                        (row >= 11 && row <= 15 && col >= 4 && col <= 15)) {
                        value = 200;
                    }
                    break;

                case 'Multiple Shapes':
                    // Small square
                    if (row >= 3 && row <= 7 && col >= 3 && col <= 7) value = 200;
                    // Triangle-ish
                    if (row >= 12 && row <= 16 && col >= 12 && col <= 12 + (row - 12)) value = 180;
                    break;

                case 'Diamond':
                    let cx = gridSize / 2;
                    let cy = gridSize / 2;
                    let dist = abs(row - cy) + abs(col - cx);
                    if (dist <= 6) value = 200;
                    break;
            }

            originalImage[row][col] = value;
        }
    }
}

function computeGradients() {
    // Initialize arrays
    for (let row = 0; row < gridSize; row++) {
        Ixx[row] = [];
        Ixy[row] = [];
        Iyy[row] = [];
        for (let col = 0; col < gridSize; col++) {
            Ixx[row][col] = 0;
            Ixy[row][col] = 0;
            Iyy[row][col] = 0;
        }
    }

    // Compute gradients using Sobel
    for (let row = 1; row < gridSize - 1; row++) {
        for (let col = 1; col < gridSize - 1; col++) {
            // Sobel X
            let Ix = (-originalImage[row-1][col-1] + originalImage[row-1][col+1]
                     - 2*originalImage[row][col-1] + 2*originalImage[row][col+1]
                     - originalImage[row+1][col-1] + originalImage[row+1][col+1]) / 8;

            // Sobel Y
            let Iy = (-originalImage[row-1][col-1] - 2*originalImage[row-1][col]
                     - originalImage[row-1][col+1] + originalImage[row+1][col-1]
                     + 2*originalImage[row+1][col] + originalImage[row+1][col+1]) / 8;

            Ixx[row][col] = Ix * Ix;
            Ixy[row][col] = Ix * Iy;
            Iyy[row][col] = Iy * Iy;
        }
    }
}

function computeEigenvalues(row, col) {
    // Sum structure tensor in 3x3 window
    let sumIxx = 0, sumIxy = 0, sumIyy = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let r = constrain(row + dr, 0, gridSize - 1);
            let c = constrain(col + dc, 0, gridSize - 1);
            sumIxx += Ixx[r][c];
            sumIxy += Ixy[r][c];
            sumIyy += Iyy[r][c];
        }
    }

    // Compute eigenvalues of 2x2 matrix
    let trace = sumIxx + sumIyy;
    let det = sumIxx * sumIyy - sumIxy * sumIxy;
    let discriminant = trace * trace - 4 * det;

    if (discriminant < 0) discriminant = 0;
    let sqrtDisc = sqrt(discriminant);

    let l1 = (trace + sqrtDisc) / 2;
    let l2 = (trace - sqrtDisc) / 2;

    return { l1: max(l1, l2), l2: min(l1, l2) };
}

function computeHarrisResponse() {
    harrisK = kSlider.value();

    for (let row = 0; row < gridSize; row++) {
        harrisResponse[row] = [];
        for (let col = 0; col < gridSize; col++) {
            if (row < 2 || row >= gridSize - 2 || col < 2 || col >= gridSize - 2) {
                harrisResponse[row][col] = 0;
                continue;
            }

            // Sum structure tensor in 3x3 window (Gaussian weighting optional)
            let sumIxx = 0, sumIxy = 0, sumIyy = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    sumIxx += Ixx[row + dr][col + dc];
                    sumIxy += Ixy[row + dr][col + dc];
                    sumIyy += Iyy[row + dr][col + dc];
                }
            }

            // Harris response: det(M) - k * trace(M)^2
            let det = sumIxx * sumIyy - sumIxy * sumIxy;
            let trace = sumIxx + sumIyy;
            let R = det - harrisK * trace * trace;

            harrisResponse[row][col] = R;
        }
    }

    detectCorners();
}

function detectCorners() {
    cornerPoints = [];

    // Find threshold
    let maxR = 0;
    for (let row = 2; row < gridSize - 2; row++) {
        for (let col = 2; col < gridSize - 2; col++) {
            if (harrisResponse[row][col] > maxR) {
                maxR = harrisResponse[row][col];
            }
        }
    }

    let threshold = maxR * thresholdSlider.value() / 100;

    // Non-maximum suppression
    for (let row = 2; row < gridSize - 2; row++) {
        for (let col = 2; col < gridSize - 2; col++) {
            let R = harrisResponse[row][col];
            if (R < threshold) continue;

            // Check if local maximum
            let isMax = true;
            for (let dr = -1; dr <= 1 && isMax; dr++) {
                for (let dc = -1; dc <= 1 && isMax; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    if (harrisResponse[row + dr][col + dc] >= R) {
                        isMax = false;
                    }
                }
            }

            if (isMax) {
                cornerPoints.push({ row: row, col: col, response: R });
            }
        }
    }
}

function processImage() {
    generateImage();
    computeGradients();
    computeHarrisResponse();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    kSlider.size(100);
    thresholdSlider.size(100);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
