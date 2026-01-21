// Fourier Transform Visualizer MicroSim
// Shows relationship between spatial and frequency domain
// Learning objective: Connect spatial image features to frequency representation (Bloom: Analyze)

let containerWidth;
let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let defaultTextSize = 16;

// Image data - 32x32 for better frequency resolution
let gridSize = 32;
let spatialImage = [];
let magnitudeSpectrum = [];
let phaseSpectrum = [];
let filteredImage = [];

// UI Controls
let imageSelector;
let filterSelector;
let cutoffSlider;

// FFT results cache
let realPart = [];
let imagPart = [];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 12);
    imageSelector.option('Vertical Stripes');
    imageSelector.option('Horizontal Stripes');
    imageSelector.option('Checkerboard');
    imageSelector.option('Single Edge');
    imageSelector.option('Diagonal Stripes');
    imageSelector.option('Circle');
    imageSelector.selected('Vertical Stripes');
    imageSelector.changed(processImage);

    // Create filter selector
    filterSelector = createSelect();
    filterSelector.position(170, drawHeight + 12);
    filterSelector.option('None');
    filterSelector.option('Low-pass');
    filterSelector.option('High-pass');
    filterSelector.option('Band-pass');
    filterSelector.selected('None');
    filterSelector.changed(applyFrequencyFilter);

    // Create cutoff slider
    cutoffSlider = createSlider(1, 15, 8, 1);
    cutoffSlider.position(370, drawHeight + 12);
    cutoffSlider.size(150);
    cutoffSlider.input(applyFrequencyFilter);

    // Initialize
    generateImage();
    computeDFT();
    applyFrequencyFilter();

    describe('Fourier transform visualization showing original image, frequency magnitude spectrum, and filtered reconstruction.', LABEL);
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
    text('Fourier Transform Visualizer', canvasWidth / 2, 5);

    // Calculate layout for 4 panels
    let panelWidth = (canvasWidth - 5 * margin) / 4;
    let imageSize = min(panelWidth - 10, 150);
    let startY = 45;

    // Draw panels
    let x = margin;
    drawImagePanel(x, startY, imageSize, 'Original Image', spatialImage);

    x += panelWidth + margin;
    drawSpectrumPanel(x, startY, imageSize, 'Magnitude Spectrum', magnitudeSpectrum);

    x += panelWidth + margin;
    drawPhasePanel(x, startY, imageSize, 'Phase Spectrum', phaseSpectrum);

    x += panelWidth + margin;
    drawImagePanel(x, startY, imageSize, 'Filtered Image', filteredImage);

    // Draw frequency interpretation guide
    drawFrequencyGuide(margin, startY + imageSize + 30);

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

function drawSpectrumPanel(x, y, size, label, data) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(label, x + size / 2, y - 3);

    // Find max for normalization
    let maxVal = 1;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (data[row][col] > maxVal) maxVal = data[row][col];
        }
    }

    // Draw log-scaled magnitude
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = data[row][col];
            // Log scale for better visualization
            let logValue = log(1 + value) / log(1 + maxVal) * 255;
            fill(logValue);
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Draw filter region overlay
    let filterType = filterSelector.value();
    if (filterType !== 'None') {
        let cutoff = cutoffSlider.value();
        let centerX = x + size / 2;
        let centerY = y + size / 2;
        let cutoffPixels = cutoff * pixelSize;

        noFill();
        stroke(255, 100, 100);
        strokeWeight(2);

        if (filterType === 'Low-pass') {
            // Circle showing kept frequencies
            ellipse(centerX, centerY, cutoffPixels * 2, cutoffPixels * 2);
        } else if (filterType === 'High-pass') {
            // Circle showing removed frequencies
            ellipse(centerX, centerY, cutoffPixels * 2, cutoffPixels * 2);
        } else if (filterType === 'Band-pass') {
            let innerRadius = max(1, cutoff - 3) * pixelSize;
            ellipse(centerX, centerY, cutoffPixels * 2, cutoffPixels * 2);
            ellipse(centerX, centerY, innerRadius * 2, innerRadius * 2);
        }
    }

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Axis labels
    fill('black');
    noStroke();
    textSize(9);
    textAlign(CENTER, TOP);
    text('Low freq (center) → High freq (edges)', x + size / 2, y + size + 5);
}

function drawPhasePanel(x, y, size, label, data) {
    let pixelSize = size / gridSize;

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(label, x + size / 2, y - 3);

    // Draw phase as color wheel
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let phase = data[row][col];
            // Map phase [-PI, PI] to hue [0, 360]
            let hue = map(phase, -PI, PI, 0, 360);
            colorMode(HSB, 360, 100, 100);
            fill(hue, 70, 80);
            noStroke();
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }
    colorMode(RGB, 255);

    // Border
    noFill();
    stroke(150);
    strokeWeight(1);
    rect(x, y, size, size);

    // Legend
    fill('black');
    noStroke();
    textSize(9);
    textAlign(CENTER, TOP);
    text('Phase encodes spatial structure', x + size / 2, y + size + 5);
}

function drawFrequencyGuide(x, y) {
    fill(255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, canvasWidth - 2 * margin, 90, 5);

    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);

    let col1 = x + 15;
    let col2 = x + 280;
    let col3 = x + 560;

    text('Frequency Interpretation:', col1, y + 10);
    text('• DC (center): Average brightness', col1, y + 28);
    text('• Low freq: Smooth regions, gradual changes', col1, y + 44);
    text('• High freq: Edges, textures, fine detail', col1, y + 60);

    text('Pattern ↔ Spectrum:', col2, y + 10);
    text('• Vertical stripes → Horizontal line in spectrum', col2, y + 28);
    text('• Horizontal stripes → Vertical line in spectrum', col2, y + 44);
    text('• More stripes → Higher frequency', col2, y + 60);

    text('Filtering:', col3, y + 10);
    text('• Low-pass: Keeps smooth areas, blurs', col3, y + 28);
    text('• High-pass: Keeps edges, enhances detail', col3, y + 44);
    text('• Band-pass: Selects specific frequencies', col3, y + 60);
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(12);
    text('Filter cutoff: ' + cutoffSlider.value(), 530, drawHeight + 25);
}

function generateImage() {
    let imageType = imageSelector.value();

    for (let row = 0; row < gridSize; row++) {
        spatialImage[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let value;

            switch (imageType) {
                case 'Vertical Stripes':
                    let freq1 = 4;
                    value = 128 + 100 * sin(col * 2 * PI * freq1 / gridSize);
                    break;

                case 'Horizontal Stripes':
                    let freq2 = 4;
                    value = 128 + 100 * sin(row * 2 * PI * freq2 / gridSize);
                    break;

                case 'Checkerboard':
                    let blockSize = 4;
                    let blockRow = floor(row / blockSize);
                    let blockCol = floor(col / blockSize);
                    value = ((blockRow + blockCol) % 2 === 0) ? 200 : 50;
                    break;

                case 'Single Edge':
                    if (col < gridSize / 2) value = 50;
                    else value = 200;
                    break;

                case 'Diagonal Stripes':
                    let freq3 = 4;
                    value = 128 + 100 * sin((col + row) * 2 * PI * freq3 / gridSize);
                    break;

                case 'Circle':
                    let cx = gridSize / 2;
                    let cy = gridSize / 2;
                    let dist = sqrt(pow(col - cx, 2) + pow(row - cy, 2));
                    if (dist < gridSize / 4) value = 200;
                    else value = 50;
                    break;
            }

            spatialImage[row][col] = constrain(value, 0, 255);
        }
    }
}

function computeDFT() {
    // Initialize arrays
    for (let v = 0; v < gridSize; v++) {
        realPart[v] = [];
        imagPart[v] = [];
        magnitudeSpectrum[v] = [];
        phaseSpectrum[v] = [];

        for (let u = 0; u < gridSize; u++) {
            // Compute DFT at frequency (u, v)
            let sumReal = 0;
            let sumImag = 0;

            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    let angle = -2 * PI * (u * x / gridSize + v * y / gridSize);
                    sumReal += spatialImage[y][x] * cos(angle);
                    sumImag += spatialImage[y][x] * sin(angle);
                }
            }

            // Shift to center the spectrum
            let shiftU = (u + gridSize / 2) % gridSize;
            let shiftV = (v + gridSize / 2) % gridSize;

            realPart[shiftV][shiftU] = sumReal;
            imagPart[shiftV][shiftU] = sumImag;
            magnitudeSpectrum[shiftV][shiftU] = sqrt(sumReal * sumReal + sumImag * sumImag);
            phaseSpectrum[shiftV][shiftU] = atan2(sumImag, sumReal);
        }
    }
}

function applyFrequencyFilter() {
    let filterType = filterSelector.value();
    let cutoff = cutoffSlider.value();

    // Create filtered spectrum
    let filteredReal = [];
    let filteredImag = [];

    let center = gridSize / 2;

    for (let v = 0; v < gridSize; v++) {
        filteredReal[v] = [];
        filteredImag[v] = [];

        for (let u = 0; u < gridSize; u++) {
            let dist = sqrt(pow(u - center, 2) + pow(v - center, 2));
            let mask = 1;

            if (filterType === 'Low-pass') {
                mask = dist <= cutoff ? 1 : 0;
            } else if (filterType === 'High-pass') {
                mask = dist >= cutoff ? 1 : 0;
            } else if (filterType === 'Band-pass') {
                let innerRadius = max(1, cutoff - 3);
                mask = (dist >= innerRadius && dist <= cutoff) ? 1 : 0;
            }

            filteredReal[v][u] = realPart[v][u] * mask;
            filteredImag[v][u] = imagPart[v][u] * mask;
        }
    }

    // Inverse DFT
    for (let y = 0; y < gridSize; y++) {
        filteredImage[y] = [];
        for (let x = 0; x < gridSize; x++) {
            let sumReal = 0;

            for (let v = 0; v < gridSize; v++) {
                for (let u = 0; u < gridSize; u++) {
                    // Unshift coordinates
                    let origU = (u - gridSize / 2 + gridSize) % gridSize;
                    let origV = (v - gridSize / 2 + gridSize) % gridSize;

                    let angle = 2 * PI * (origU * x / gridSize + origV * y / gridSize);
                    sumReal += filteredReal[v][u] * cos(angle) - filteredImag[v][u] * sin(angle);
                }
            }

            filteredImage[y][x] = sumReal / (gridSize * gridSize);
        }
    }
}

function processImage() {
    generateImage();
    computeDFT();
    applyFrequencyFilter();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    cutoffSlider.size(150);
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
