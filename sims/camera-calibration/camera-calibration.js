// Camera Calibration Visualizer
// Demonstrates camera calibration process and distortion correction
// Learning objective: Understand camera calibration and lens distortion (Bloom: Apply)

let canvasWidth = 900;
let drawHeight = 500;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// View panels
let leftPanelWidth, rightPanelWidth;
let panelMargin = 10;

// Calibration parameters
let focalLength = 500;  // pixels
let k1 = 0;  // radial distortion coefficient 1
let k2 = 0;  // radial distortion coefficient 2
let cx, cy;  // principal point

// Checkerboard parameters
const BOARD_ROWS = 6;
const BOARD_COLS = 8;
const SQUARE_SIZE = 25;  // pixels in display

// Detected corners (simulated)
let idealCorners = [];
let distortedCorners = [];
let reprojectedCorners = [];

// UI controls
let focalSlider;
let k1Slider;
let k2Slider;
let showCornersCheckbox;
let showErrorsCheckbox;
let calibrateButton;

// Calibration state
let isCalibrated = false;
let calibratedK1 = 0;
let calibratedK2 = 0;
let calibratedF = 500;
let reprojectionError = 0;

// Font for WEBGL (if needed)
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Calculate panel widths
    updatePanelSizes();

    // Generate checkerboard corners
    generateCorners();

    // Create controls
    createControls();

    describe('Camera calibration visualizer showing distortion effects and correction', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Sliders for distortion parameters
    k1Slider = createSlider(-0.5, 0.5, 0, 0.01);
    k1Slider.parent(container);
    k1Slider.position(sliderLeftMargin, drawHeight + 8);
    k1Slider.size(150);
    k1Slider.input(updateDistortion);

    k2Slider = createSlider(-0.3, 0.3, 0, 0.01);
    k2Slider.parent(container);
    k2Slider.position(330, drawHeight + 8);
    k2Slider.size(150);
    k2Slider.input(updateDistortion);

    focalSlider = createSlider(300, 800, 500, 10);
    focalSlider.parent(container);
    focalSlider.position(590, drawHeight + 8);
    focalSlider.size(150);
    focalSlider.input(updateDistortion);

    // Row 2: Checkboxes and button
    showCornersCheckbox = createCheckbox(' Show Corners', true);
    showCornersCheckbox.parent(container);
    showCornersCheckbox.position(10, drawHeight + 45);
    showCornersCheckbox.style('font-size', '14px');

    showErrorsCheckbox = createCheckbox(' Show Errors', true);
    showErrorsCheckbox.parent(container);
    showErrorsCheckbox.position(140, drawHeight + 45);
    showErrorsCheckbox.style('font-size', '14px');

    calibrateButton = createButton('Calibrate');
    calibrateButton.parent(container);
    calibrateButton.position(280, drawHeight + 42);
    calibrateButton.mousePressed(runCalibration);
    calibrateButton.style('font-size', '14px');
    calibrateButton.style('padding', '5px 15px');

    let resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(370, drawHeight + 42);
    resetButton.mousePressed(resetCalibration);
    resetButton.style('font-size', '14px');
    resetButton.style('padding', '5px 15px');
}

function generateCorners() {
    idealCorners = [];
    cx = leftPanelWidth / 2;
    cy = drawHeight / 2;

    // Generate ideal checkerboard corners
    let startX = cx - (BOARD_COLS - 1) * SQUARE_SIZE / 2;
    let startY = cy - (BOARD_ROWS - 1) * SQUARE_SIZE / 2;

    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            idealCorners.push({
                x: startX + col * SQUARE_SIZE,
                y: startY + row * SQUARE_SIZE
            });
        }
    }

    updateDistortion();
}

function updateDistortion() {
    k1 = k1Slider.value();
    k2 = k2Slider.value();
    focalLength = focalSlider.value();

    // Apply distortion to ideal corners
    distortedCorners = [];
    for (let corner of idealCorners) {
        let distorted = applyDistortion(corner.x, corner.y, cx, cy, k1, k2, focalLength);
        distortedCorners.push(distorted);
    }

    // Calculate reprojection if calibrated
    if (isCalibrated) {
        reprojectedCorners = [];
        let totalError = 0;
        for (let i = 0; i < distortedCorners.length; i++) {
            // Undistort using calibrated parameters
            let undistorted = removeDistortion(
                distortedCorners[i].x,
                distortedCorners[i].y,
                cx, cy,
                calibratedK1, calibratedK2,
                calibratedF
            );
            reprojectedCorners.push(undistorted);

            let dx = undistorted.x - idealCorners[i].x;
            let dy = undistorted.y - idealCorners[i].y;
            totalError += sqrt(dx * dx + dy * dy);
        }
        reprojectionError = totalError / distortedCorners.length;
    }
}

function applyDistortion(x, y, cx, cy, k1, k2, f) {
    // Normalize coordinates
    let xn = (x - cx) / f;
    let yn = (y - cy) / f;

    // Radial distance
    let r2 = xn * xn + yn * yn;
    let r4 = r2 * r2;

    // Distortion factor
    let distortion = 1 + k1 * r2 + k2 * r4;

    // Apply distortion
    let xd = xn * distortion;
    let yd = yn * distortion;

    // Convert back to pixel coordinates
    return {
        x: xd * f + cx,
        y: yd * f + cy
    };
}

function removeDistortion(x, y, cx, cy, k1, k2, f) {
    // Normalize coordinates
    let xd = (x - cx) / f;
    let yd = (y - cy) / f;

    // Iterative undistortion (Newton-Raphson)
    let xn = xd;
    let yn = yd;

    for (let i = 0; i < 10; i++) {
        let r2 = xn * xn + yn * yn;
        let r4 = r2 * r2;
        let distortion = 1 + k1 * r2 + k2 * r4;

        xn = xd / distortion;
        yn = yd / distortion;
    }

    return {
        x: xn * f + cx,
        y: yn * f + cy
    };
}

function runCalibration() {
    // Simulate calibration by storing current distortion parameters
    calibratedK1 = k1;
    calibratedK2 = k2;
    calibratedF = focalLength;
    isCalibrated = true;
    updateDistortion();
}

function resetCalibration() {
    isCalibrated = false;
    reprojectedCorners = [];
    reprojectionError = 0;
    k1Slider.value(0);
    k2Slider.value(0);
    focalSlider.value(500);
    updateDistortion();
}

function draw() {
    updateCanvasSize();
    updatePanelSizes();

    // Background
    background(240);

    // Draw left panel (distorted view)
    drawLeftPanel();

    // Draw right panel (undistorted/corrected view)
    drawRightPanel();

    // Draw control area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(200);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Draw labels
    drawLabels();
}

function drawLeftPanel() {
    push();
    // Panel background
    fill(30);
    stroke(100);
    rect(panelMargin, panelMargin, leftPanelWidth - panelMargin * 2, drawHeight - panelMargin * 2, 5);

    // Clip to panel
    // Draw checkerboard pattern
    let startX = cx - (BOARD_COLS) * SQUARE_SIZE / 2 + panelMargin;
    let startY = cy - (BOARD_ROWS) * SQUARE_SIZE / 2;

    for (let row = 0; row < BOARD_ROWS + 1; row++) {
        for (let col = 0; col < BOARD_COLS + 1; col++) {
            if ((row + col) % 2 === 0) {
                fill(255);
            } else {
                fill(50);
            }
            noStroke();

            // Get distorted quad corners
            let corners = getDistortedSquare(startX, startY, row, col, SQUARE_SIZE);

            beginShape();
            for (let c of corners) {
                vertex(c.x, c.y);
            }
            endShape(CLOSE);
        }
    }

    // Draw detected corners
    if (showCornersCheckbox.checked()) {
        for (let i = 0; i < distortedCorners.length; i++) {
            // Draw corner marker
            stroke(0, 255, 0);
            strokeWeight(2);
            noFill();
            let c = distortedCorners[i];

            // Cross marker
            line(c.x - 5, c.y, c.x + 5, c.y);
            line(c.x, c.y - 5, c.x, c.y + 5);

            // Circle
            circle(c.x, c.y, 10);
        }
    }

    // Panel label
    fill(255);
    noStroke();
    textSize(16);
    textAlign(CENTER, TOP);
    text('Distorted Image', leftPanelWidth / 2, panelMargin + 10);

    // Distortion info
    textSize(12);
    textAlign(LEFT, TOP);
    text('k1: ' + k1.toFixed(3), panelMargin + 10, panelMargin + 35);
    text('k2: ' + k2.toFixed(3), panelMargin + 10, panelMargin + 50);
    text('f: ' + focalLength + 'px', panelMargin + 10, panelMargin + 65);

    pop();
}

function getDistortedSquare(startX, startY, row, col, size) {
    // Get the four corners of a checkerboard square with distortion applied
    let corners = [];
    let offsets = [[0, 0], [1, 0], [1, 1], [0, 1]];

    for (let [dr, dc] of offsets) {
        let idealX = startX + (col + dc) * size;
        let idealY = startY + (row + dr) * size;
        let distorted = applyDistortion(idealX, idealY, cx, cy, k1, k2, focalLength);
        corners.push(distorted);
    }

    return corners;
}

function drawRightPanel() {
    push();
    translate(leftPanelWidth, 0);

    let rightCx = rightPanelWidth / 2;

    // Panel background
    fill(30);
    stroke(100);
    rect(panelMargin, panelMargin, rightPanelWidth - panelMargin * 2, drawHeight - panelMargin * 2, 5);

    // Draw undistorted checkerboard
    let startX = rightCx - (BOARD_COLS) * SQUARE_SIZE / 2;
    let startY = cy - (BOARD_ROWS) * SQUARE_SIZE / 2;

    for (let row = 0; row < BOARD_ROWS + 1; row++) {
        for (let col = 0; col < BOARD_COLS + 1; col++) {
            if ((row + col) % 2 === 0) {
                fill(255);
            } else {
                fill(50);
            }
            noStroke();
            rect(startX + col * SQUARE_SIZE, startY + row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
    }

    // Draw ideal corners
    if (showCornersCheckbox.checked()) {
        for (let i = 0; i < idealCorners.length; i++) {
            // Offset to right panel
            let ix = idealCorners[i].x - cx + rightCx;
            let iy = idealCorners[i].y;

            stroke(0, 150, 255);
            strokeWeight(2);
            noFill();

            // Cross marker
            line(ix - 5, iy, ix + 5, iy);
            line(ix, iy - 5, ix, iy + 5);
            circle(ix, iy, 10);
        }
    }

    // Draw reprojection errors if calibrated
    if (isCalibrated && showErrorsCheckbox.checked() && reprojectedCorners.length > 0) {
        for (let i = 0; i < reprojectedCorners.length; i++) {
            let rx = reprojectedCorners[i].x - cx + rightCx;
            let ry = reprojectedCorners[i].y;
            let ix = idealCorners[i].x - cx + rightCx;
            let iy = idealCorners[i].y;

            // Error vector
            stroke(255, 100, 100);
            strokeWeight(1);
            line(ix, iy, rx, ry);

            // Reprojected point
            fill(255, 0, 0);
            noStroke();
            circle(rx, ry, 4);
        }
    }

    // Panel label
    fill(255);
    noStroke();
    textSize(16);
    textAlign(CENTER, TOP);
    text(isCalibrated ? 'Corrected Image' : 'Ideal (Undistorted)', rightPanelWidth / 2, panelMargin + 10);

    // Calibration info
    textSize(12);
    textAlign(LEFT, TOP);
    if (isCalibrated) {
        fill(100, 255, 100);
        text('Calibrated!', panelMargin + 10, panelMargin + 35);
        fill(255);
        text('RMS Error: ' + reprojectionError.toFixed(2) + 'px', panelMargin + 10, panelMargin + 50);
    } else {
        fill(255, 200, 100);
        text('Not calibrated', panelMargin + 10, panelMargin + 35);
    }

    pop();
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    // Row 1 labels
    text('k1:', 10, drawHeight + 18);
    text('k2:', 260, drawHeight + 18);
    text('Focal:', 520, drawHeight + 18);

    // Values
    textAlign(RIGHT, CENTER);
    text(k1.toFixed(2), sliderLeftMargin - 10, drawHeight + 18);
    text(k2.toFixed(2), 320, drawHeight + 18);
    text(focalLength, 580, drawHeight + 18);

    // Title
    textSize(14);
    textAlign(CENTER, CENTER);
    fill(100);
    text('Adjust k1 and k2 to add barrel/pincushion distortion, then click Calibrate', canvasWidth / 2, drawHeight + 78);
}

function updatePanelSizes() {
    leftPanelWidth = canvasWidth / 2;
    rightPanelWidth = canvasWidth / 2;
    cx = leftPanelWidth / 2;
    cy = drawHeight / 2;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    updatePanelSizes();
    generateCorners();

    // Reposition controls
    k1Slider.position(sliderLeftMargin, drawHeight + 8);
    k2Slider.position(330, drawHeight + 8);
    focalSlider.position(590, drawHeight + 8);
    showCornersCheckbox.position(10, drawHeight + 45);
    showErrorsCheckbox.position(140, drawHeight + 45);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 750);
    }
}
