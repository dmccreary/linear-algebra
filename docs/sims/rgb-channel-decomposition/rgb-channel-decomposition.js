// RGB Channel Decomposition MicroSim
// Visualize how RGB channels combine to form color images
// Learning objective: Analyze how separate color channels create full images (Bloom: Analyze)

let containerWidth;
let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Image data - 8x8 pixel color image
let gridSize = 8;
let redChannel = [];
let greenChannel = [];
let blueChannel = [];

// UI Controls
let imageSelector;
let redSlider, greenSlider, blueSlider;
let redToggle, greenToggle, blueToggle;
let showTintedCheckbox;

// Channel states
let redEnabled = true;
let greenEnabled = true;
let blueEnabled = true;
let showTinted = true;

// Hover state
let hoveredCell = { row: -1, col: -1 };

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);

    textSize(defaultTextSize);

    // Create image selector dropdown
    imageSelector = createSelect();
    imageSelector.position(10, drawHeight + 8);
    imageSelector.option('Rainbow');
    imageSelector.option('Sunset');
    imageSelector.option('Nature');
    imageSelector.option('Random');
    imageSelector.selected('Rainbow');
    imageSelector.changed(generateImage);

    // Create channel intensity sliders (Row 1)
    redSlider = createSlider(0, 100, 100, 1);
    redSlider.position(sliderLeftMargin + 130, drawHeight + 8);
    redSlider.size(80);

    greenSlider = createSlider(0, 100, 100, 1);
    greenSlider.position(sliderLeftMargin + 260, drawHeight + 8);
    greenSlider.size(80);

    blueSlider = createSlider(0, 100, 100, 1);
    blueSlider.position(sliderLeftMargin + 390, drawHeight + 8);
    blueSlider.size(80);

    // Create channel toggle checkboxes (Row 2)
    redToggle = createCheckbox(' R', true);
    redToggle.position(sliderLeftMargin + 130, drawHeight + 43);
    redToggle.changed(() => redEnabled = redToggle.checked());
    redToggle.style('color', '#CC0000');

    greenToggle = createCheckbox(' G', true);
    greenToggle.position(sliderLeftMargin + 200, drawHeight + 43);
    greenToggle.changed(() => greenEnabled = greenToggle.checked());
    greenToggle.style('color', '#00AA00');

    blueToggle = createCheckbox(' B', true);
    blueToggle.position(sliderLeftMargin + 270, drawHeight + 43);
    blueToggle.changed(() => blueEnabled = blueToggle.checked());
    blueToggle.style('color', '#0000CC');

    showTintedCheckbox = createCheckbox(' Color tint channels', true);
    showTintedCheckbox.position(sliderLeftMargin + 340, drawHeight + 43);
    showTintedCheckbox.changed(() => showTinted = showTintedCheckbox.checked());

    // Initialize image
    generateImage();

    describe('Interactive RGB channel decomposition showing how red, green, and blue channels combine to create color images.', LABEL);
}

function draw() {
    updateCanvasSize();

    // Draw background
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
    text('RGB Channel Decomposition', canvasWidth / 2, 5);

    // Get intensity values
    let rIntensity = redSlider.value() / 100;
    let gIntensity = greenSlider.value() / 100;
    let bIntensity = blueSlider.value() / 100;

    // Calculate layout
    let panelSize = min(90, (canvasWidth - 6 * margin) / 5);
    let totalWidth = panelSize * 5 + margin * 4;
    let startX = (canvasWidth - totalWidth) / 2;
    let panelY = 70;

    // Draw original image
    drawImagePanel(startX, panelY, panelSize, 'Original', null, null, null, 1, 1, 1);

    // Draw R channel
    let rX = startX + panelSize + margin;
    if (showTinted) {
        drawImagePanel(rX, panelY, panelSize, 'Red', redChannel, null, null,
                       redEnabled ? rIntensity : 0, 0, 0);
    } else {
        drawGrayscalePanel(rX, panelY, panelSize, 'Red', redChannel,
                           redEnabled ? rIntensity : 0, color(200, 0, 0));
    }

    // Draw G channel
    let gX = rX + panelSize + margin;
    if (showTinted) {
        drawImagePanel(gX, panelY, panelSize, 'Green', null, greenChannel, null,
                       0, greenEnabled ? gIntensity : 0, 0);
    } else {
        drawGrayscalePanel(gX, panelY, panelSize, 'Green', greenChannel,
                           greenEnabled ? gIntensity : 0, color(0, 150, 0));
    }

    // Draw B channel
    let bX = gX + panelSize + margin;
    if (showTinted) {
        drawImagePanel(bX, panelY, panelSize, 'Blue', null, null, blueChannel,
                       0, 0, blueEnabled ? bIntensity : 0);
    } else {
        drawGrayscalePanel(bX, panelY, panelSize, 'Blue', blueChannel,
                           blueEnabled ? bIntensity : 0, color(0, 0, 200));
    }

    // Draw reconstructed image
    let reconX = bX + panelSize + margin;
    drawImagePanel(reconX, panelY, panelSize, 'Reconstructed',
                   redEnabled ? redChannel : null,
                   greenEnabled ? greenChannel : null,
                   blueEnabled ? blueChannel : null,
                   rIntensity, gIntensity, bIntensity);

    // Draw pixel info on hover
    drawPixelInfo(panelY + panelSize + 20);

    // Draw control labels
    drawControlLabels();

    // Update hover state
    updateHoverState();
}

function drawImagePanel(x, y, size, label, rChan, gChan, bChan, rMult, gMult, bMult) {
    let pixelSize = size / gridSize;

    // Panel background
    fill(255);
    stroke(100);
    strokeWeight(1);
    rect(x - 2, y - 2, size + 4, size + 4, 3);

    // Draw pixels
    noStroke();
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let r = (rChan ? rChan[row][col] : redChannel[row][col]) * rMult;
            let g = (gChan ? gChan[row][col] : greenChannel[row][col]) * gMult;
            let b = (bChan ? bChan[row][col] : blueChannel[row][col]) * bMult;

            fill(r, g, b);
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Label
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    text(label, x + size / 2, y + size + 5);
}

function drawGrayscalePanel(x, y, size, label, channel, intensity, borderColor) {
    let pixelSize = size / gridSize;

    // Panel background with colored border
    fill(255);
    stroke(borderColor);
    strokeWeight(2);
    rect(x - 2, y - 2, size + 4, size + 4, 3);

    // Draw pixels in grayscale
    noStroke();
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let value = channel[row][col] * intensity;
            fill(value);
            rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Label
    fill(borderColor);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    text(label, x + size / 2, y + size + 5);
}

function drawPixelInfo(y) {
    if (hoveredCell.row < 0 || hoveredCell.col < 0) return;

    let r = redChannel[hoveredCell.row][hoveredCell.col];
    let g = greenChannel[hoveredCell.row][hoveredCell.col];
    let b = blueChannel[hoveredCell.row][hoveredCell.col];

    // Color preview box
    let boxX = canvasWidth / 2 - 150;
    fill(r, g, b);
    stroke(100);
    strokeWeight(1);
    rect(boxX, y, 30, 30, 3);

    // RGB values
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    text(`Position: (${hoveredCell.row}, ${hoveredCell.col})`, boxX + 40, y + 8);

    fill(180, 0, 0);
    text(`R: ${r}`, boxX + 40, y + 24);
    fill(0, 140, 0);
    text(`G: ${g}`, boxX + 90, y + 24);
    fill(0, 0, 180);
    text(`B: ${b}`, boxX + 140, y + 24);

    // Show combined as hex
    fill('black');
    let hex = '#' + r.toString(16).padStart(2, '0') +
                    g.toString(16).padStart(2, '0') +
                    b.toString(16).padStart(2, '0');
    text(`Hex: ${hex.toUpperCase()}`, boxX + 190, y + 16);
}

function drawControlLabels() {
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);

    // Slider labels
    fill(180, 0, 0);
    text('R: ' + redSlider.value() + '%', sliderLeftMargin + 130, drawHeight + 20);

    fill(0, 140, 0);
    text('G: ' + greenSlider.value() + '%', sliderLeftMargin + 260, drawHeight + 20);

    fill(0, 0, 180);
    text('B: ' + blueSlider.value() + '%', sliderLeftMargin + 390, drawHeight + 20);
}

function updateHoverState() {
    hoveredCell = { row: -1, col: -1 };

    // Calculate panel positions (same as in draw)
    let panelSize = min(90, (canvasWidth - 6 * margin) / 5);
    let totalWidth = panelSize * 5 + margin * 4;
    let startX = (canvasWidth - totalWidth) / 2;
    let panelY = 70;
    let pixelSize = panelSize / gridSize;

    // Check all panels
    let panels = [
        startX,
        startX + panelSize + margin,
        startX + 2 * (panelSize + margin),
        startX + 3 * (panelSize + margin),
        startX + 4 * (panelSize + margin)
    ];

    for (let px of panels) {
        if (mouseX >= px && mouseX < px + panelSize &&
            mouseY >= panelY && mouseY < panelY + panelSize) {
            hoveredCell.col = floor((mouseX - px) / pixelSize);
            hoveredCell.row = floor((mouseY - panelY) / pixelSize);
            break;
        }
    }

    hoveredCell.row = constrain(hoveredCell.row, -1, gridSize - 1);
    hoveredCell.col = constrain(hoveredCell.col, -1, gridSize - 1);
}

function generateImage() {
    let imageType = imageSelector.value();

    for (let row = 0; row < gridSize; row++) {
        redChannel[row] = [];
        greenChannel[row] = [];
        blueChannel[row] = [];

        for (let col = 0; col < gridSize; col++) {
            let r, g, b;

            switch (imageType) {
                case 'Rainbow':
                    // Horizontal rainbow gradient
                    let hue = map(col, 0, gridSize - 1, 0, 360);
                    let rgb = hsvToRgb(hue, 1, 1);
                    r = rgb.r;
                    g = rgb.g;
                    b = rgb.b;
                    break;

                case 'Sunset':
                    // Sunset gradient (orange/red at top, purple/blue at bottom)
                    let t = map(row, 0, gridSize - 1, 0, 1);
                    r = floor(lerp(255, 100, t));
                    g = floor(lerp(200, 50, t));
                    b = floor(lerp(100, 150, t));
                    break;

                case 'Nature':
                    // Green/brown landscape-like pattern
                    if (row < gridSize / 2) {
                        // Sky
                        r = floor(map(row, 0, gridSize / 2, 135, 200));
                        g = floor(map(row, 0, gridSize / 2, 206, 230));
                        b = floor(map(row, 0, gridSize / 2, 235, 255));
                    } else {
                        // Ground/foliage
                        r = floor(random(60, 120));
                        g = floor(random(100, 180));
                        b = floor(random(40, 80));
                    }
                    break;

                case 'Random':
                    r = floor(random(256));
                    g = floor(random(256));
                    b = floor(random(256));
                    break;
            }

            redChannel[row][col] = r;
            greenChannel[row][col] = g;
            blueChannel[row][col] = b;
        }
    }
}

function hsvToRgb(h, s, v) {
    let c = v * s;
    let x = c * (1 - abs(((h / 60) % 2) - 1));
    let m = v - c;

    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
        r: floor((r + m) * 255),
        g: floor((g + m) * 255),
        b: floor((b + m) * 255)
    };
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
