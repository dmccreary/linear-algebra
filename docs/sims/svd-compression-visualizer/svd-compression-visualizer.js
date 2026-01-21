// SVD Compression Visualizer MicroSim
// Shows how SVD truncation compresses images
// Learning objective: Apply SVD for image compression (Bloom: Apply)

let containerWidth;
let canvasWidth = 850;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let defaultTextSize = 16;

// Image data - 16x16 grayscale
let gridSize = 16;
let originalImage = [];
let reconstructedImage = [];
let errorImage = [];

// SVD components (pre-computed for educational demo)
let singularValues = [];
let leftVectors = [];
let rightVectors = [];

// UI Controls
let imageSelector;
let rankSlider;
let showErrorCheckbox;
let showError = false;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 12);
    imageSelector.option('Gradient');
    imageSelector.option('Simple Shape');
    imageSelector.option('Text-like');
    imageSelector.option('Complex');
    imageSelector.option('Low Rank');
    imageSelector.selected('Gradient');
    imageSelector.changed(processImage);

    // Create rank slider
    rankSlider = createSlider(1, gridSize, 4, 1);
    rankSlider.position(200, drawHeight + 12);
    rankSlider.size(200);
    rankSlider.input(reconstructImage);

    // Create show error checkbox
    showErrorCheckbox = createCheckbox(' Show error image', false);
    showErrorCheckbox.position(500, drawHeight + 12);
    showErrorCheckbox.changed(() => { showError = showErrorCheckbox.checked(); });

    // Initialize
    generateImage();
    computeSVD();
    reconstructImage();

    describe('SVD compression visualization showing original image, reconstruction from k singular values, and compression statistics.', LABEL);
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
    text('SVD Compression Visualizer', canvasWidth / 2, 5);

    // Calculate layout
    let panelWidth = (canvasWidth - 4 * margin) / 3;
    let imageSize = min(panelWidth - 20, 180);
    let startY = 40;

    // Draw panels
    let x = margin;
    drawImagePanel(x, startY, imageSize, 'Original Image', originalImage);

    x += panelWidth + margin;
    if (showError) {
        drawErrorPanel(x, startY, imageSize, 'Error (Original - Reconstructed)');
    } else {
        drawImagePanel(x, startY, imageSize, 'Reconstructed (k=' + rankSlider.value() + ')', reconstructedImage);
    }

    x += panelWidth + margin;
    drawSingularValuePlot(x, startY, panelWidth - 20, imageSize);

    // Draw compression statistics
    drawStatistics(margin, startY + imageSize + 20);

    // Control labels
    drawControlLabels();
}

function drawImagePanel(x, y, size, label, data) {
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

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);
}

function drawErrorPanel(x, y, size, label) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(label, x + size / 2, y - 3);

    // Find max error for scaling
    let maxError = 1;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let err = abs(originalImage[row][col] - reconstructedImage[row][col]);
            if (err > maxError) maxError = err;
        }
    }

    // Draw error (amplified for visibility)
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let err = originalImage[row][col] - reconstructedImage[row][col];
            // Map error to color: negative=blue, zero=gray, positive=red
            let r, g, b;
            if (err >= 0) {
                let intensity = map(abs(err), 0, maxError, 128, 255);
                r = intensity;
                g = 128 - map(abs(err), 0, maxError, 0, 128);
                b = 128 - map(abs(err), 0, maxError, 0, 128);
            } else {
                let intensity = map(abs(err), 0, maxError, 128, 255);
                r = 128 - map(abs(err), 0, maxError, 0, 128);
                g = 128 - map(abs(err), 0, maxError, 0, 128);
                b = intensity;
            }
            fill(r, g, b);
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
    textSize(9);
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    text('Red: positive error, Blue: negative', x + size / 2, y + size + 5);
}

function drawSingularValuePlot(x, y, width, height) {
    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Singular Values (log scale)', x + width / 2, y - 3);

    // Plot background
    fill(255);
    stroke(150);
    strokeWeight(1);
    rect(x, y, width, height);

    // Find max singular value
    let maxSV = max(singularValues);
    if (maxSV < 1) maxSV = 1;

    // Draw bars
    let barWidth = (width - 20) / gridSize;
    let k = rankSlider.value();

    for (let i = 0; i < gridSize; i++) {
        let sv = singularValues[i];
        // Log scale
        let logSV = log(sv + 1);
        let logMax = log(maxSV + 1);
        let barHeight = map(logSV, 0, logMax, 0, height - 30);

        // Color: green if kept, gray if discarded
        if (i < k) {
            fill(100, 200, 100);
        } else {
            fill(200);
        }

        stroke(80);
        strokeWeight(1);
        rect(x + 10 + i * barWidth, y + height - 20 - barHeight,
             barWidth - 2, barHeight);
    }

    // X-axis labels
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(9);
    text('1', x + 10 + barWidth / 2, y + height - 15);
    text(gridSize, x + 10 + (gridSize - 0.5) * barWidth, y + height - 15);

    // Y-axis label
    push();
    translate(x - 5, y + height / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, BOTTOM);
    text('Magnitude', 0, 0);
    pop();

    // Highlight cutoff line
    stroke(255, 100, 100);
    strokeWeight(2);
    let cutoffX = x + 10 + k * barWidth;
    line(cutoffX, y + 10, cutoffX, y + height - 20);

    // Legend
    fill(100, 200, 100);
    noStroke();
    rect(x + 10, y + height + 10, 15, 10);
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(10);
    text('Kept', x + 30, y + height + 15);

    fill(200);
    noStroke();
    rect(x + 80, y + height + 10, 15, 10);
    fill('black');
    text('Discarded', x + 100, y + height + 15);
}

function drawStatistics(x, y) {
    let k = rankSlider.value();

    // Calculate statistics
    let originalStorage = gridSize * gridSize;
    let compressedStorage = k * (gridSize + gridSize + 1); // k*(m + n + 1)
    let compressionRatio = originalStorage / compressedStorage;

    // Calculate error metrics
    let mse = 0;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let diff = originalImage[row][col] - reconstructedImage[row][col];
            mse += diff * diff;
        }
    }
    mse /= (gridSize * gridSize);
    let psnr = mse > 0 ? 10 * log(255 * 255 / mse) / log(10) : 99;

    // Energy retained
    let totalEnergy = 0;
    let retainedEnergy = 0;
    for (let i = 0; i < gridSize; i++) {
        totalEnergy += singularValues[i] * singularValues[i];
        if (i < k) retainedEnergy += singularValues[i] * singularValues[i];
    }
    let energyPercent = (retainedEnergy / totalEnergy * 100).toFixed(1);

    // Draw statistics panel
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, canvasWidth - 2 * margin, 85, 5);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);

    let col1 = x + 20;
    let col2 = x + 220;
    let col3 = x + 450;

    text('Storage Comparison:', col1, y + 10);
    text('Original: ' + originalStorage + ' values', col1, y + 28);
    text('Compressed: ' + compressedStorage + ' values', col1, y + 44);
    text('Compression ratio: ' + compressionRatio.toFixed(2) + ':1', col1, y + 60);

    text('Quality Metrics:', col2, y + 10);
    text('Mean Squared Error: ' + mse.toFixed(2), col2, y + 28);
    text('PSNR: ' + psnr.toFixed(1) + ' dB', col2, y + 44);
    text('Energy retained: ' + energyPercent + '%', col2, y + 60);

    text('SVD Formula:', col3, y + 10);
    text('I ≈ Σ σᵢ uᵢ vᵢᵀ (i = 1 to k)', col3, y + 28);
    text('Using k = ' + k + ' of ' + gridSize + ' components', col3, y + 44);
    text('Eckart-Young theorem: optimal rank-k approx', col3, y + 60);
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(12);
    text('Rank k: ' + rankSlider.value() + ' / ' + gridSize, 410, drawHeight + 25);
}

function generateImage() {
    let imageType = imageSelector.value();

    for (let row = 0; row < gridSize; row++) {
        originalImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value;

            switch (imageType) {
                case 'Gradient':
                    // Diagonal gradient
                    value = map(row + col, 0, 2 * (gridSize - 1), 30, 230);
                    break;

                case 'Simple Shape':
                    // Circle
                    let cx = gridSize / 2 - 0.5;
                    let cy = gridSize / 2 - 0.5;
                    let dist = sqrt(pow(col - cx, 2) + pow(row - cy, 2));
                    if (dist < gridSize / 3) value = 200;
                    else value = 50;
                    break;

                case 'Text-like':
                    // Letter patterns
                    value = 40;
                    // H shape
                    if (col === 2 && row >= 2 && row <= 8) value = 200;
                    if (col === 6 && row >= 2 && row <= 8) value = 200;
                    if (row === 5 && col >= 2 && col <= 6) value = 200;
                    // I shape
                    if (col === 10 && row >= 2 && row <= 8) value = 200;
                    if (row === 2 && col >= 8 && col <= 12) value = 200;
                    if (row === 8 && col >= 8 && col <= 12) value = 200;
                    break;

                case 'Complex':
                    // Checkerboard with noise
                    let block = 2;
                    let blockR = floor(row / block);
                    let blockC = floor(col / block);
                    value = ((blockR + blockC) % 2 === 0) ? 180 : 60;
                    value += random(-20, 20);
                    break;

                case 'Low Rank':
                    // Image that's actually low rank (sum of few outer products)
                    value = 100;
                    // Horizontal band
                    if (row >= 4 && row <= 6) value += 50;
                    // Vertical band
                    if (col >= 6 && col <= 9) value += 50;
                    break;
            }

            originalImage[row][col] = constrain(value, 0, 255);
        }
    }
}

function computeSVD() {
    // Simplified SVD computation using power iteration
    // This is educational - real implementations use more robust algorithms

    // Initialize singular values and vectors
    singularValues = [];
    leftVectors = [];
    rightVectors = [];

    // Create working copy of matrix
    let A = [];
    for (let i = 0; i < gridSize; i++) {
        A[i] = [...originalImage[i]];
    }

    // Extract singular values one by one
    for (let k = 0; k < gridSize; k++) {
        // Power iteration to find largest singular value
        let v = [];
        for (let i = 0; i < gridSize; i++) v[i] = random();

        // Normalize
        let norm = 0;
        for (let i = 0; i < gridSize; i++) norm += v[i] * v[i];
        norm = sqrt(norm);
        for (let i = 0; i < gridSize; i++) v[i] /= norm;

        // Power iterations
        for (let iter = 0; iter < 50; iter++) {
            // u = A * v
            let u = [];
            for (let i = 0; i < gridSize; i++) {
                u[i] = 0;
                for (let j = 0; j < gridSize; j++) {
                    u[i] += A[i][j] * v[j];
                }
            }

            // Normalize u
            norm = 0;
            for (let i = 0; i < gridSize; i++) norm += u[i] * u[i];
            norm = sqrt(norm);
            if (norm < 0.0001) break;
            for (let i = 0; i < gridSize; i++) u[i] /= norm;

            // v = A^T * u
            for (let j = 0; j < gridSize; j++) {
                v[j] = 0;
                for (let i = 0; i < gridSize; i++) {
                    v[j] += A[i][j] * u[i];
                }
            }

            // Normalize v
            norm = 0;
            for (let j = 0; j < gridSize; j++) norm += v[j] * v[j];
            norm = sqrt(norm);
            if (norm < 0.0001) break;
            for (let j = 0; j < gridSize; j++) v[j] /= norm;
        }

        // Compute singular value: sigma = ||A*v||
        let Av = [];
        let sigma = 0;
        for (let i = 0; i < gridSize; i++) {
            Av[i] = 0;
            for (let j = 0; j < gridSize; j++) {
                Av[i] += A[i][j] * v[j];
            }
            sigma += Av[i] * Av[i];
        }
        sigma = sqrt(sigma);

        // Compute u = (1/sigma) * A * v
        let u = [];
        for (let i = 0; i < gridSize; i++) {
            u[i] = sigma > 0.0001 ? Av[i] / sigma : 0;
        }

        singularValues.push(sigma);
        leftVectors.push(u);
        rightVectors.push(v);

        // Deflate: A = A - sigma * u * v^T
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                A[i][j] -= sigma * u[i] * v[j];
            }
        }
    }
}

function reconstructImage() {
    let k = rankSlider.value();

    // Reconstruct: I_k = sum of sigma_i * u_i * v_i^T for i = 1 to k
    for (let row = 0; row < gridSize; row++) {
        reconstructedImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value = 0;
            for (let i = 0; i < k; i++) {
                value += singularValues[i] * leftVectors[i][row] * rightVectors[i][col];
            }
            reconstructedImage[row][col] = value;
        }
    }
}

function processImage() {
    generateImage();
    computeSVD();
    reconstructImage();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    rankSlider.size(200);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
