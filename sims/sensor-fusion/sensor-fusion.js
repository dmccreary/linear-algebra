// Sensor Fusion Visualizer
// Demonstrates how multiple sensors improve state estimation
// Learning objective: Understand multi-sensor fusion benefits (Bloom: Analyze)

let canvasWidth = 850;
let drawHeight = 550;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 130;
let defaultTextSize = 16;

// Vehicle state
let truePosition = { x: 0, y: 0 };
let trueVelocity = { x: 2, y: 0 };
let trueHeading = 0;

// Sensor estimates
let gpsEstimate = { x: 0, y: 0 };
let imuEstimate = { x: 0, y: 0, vx: 0, vy: 0 };
let fusedEstimate = { x: 0, y: 0, vx: 0, vy: 0 };

// Kalman filter for fusion
let fusedP = [[100, 0, 0, 0], [0, 100, 0, 0], [0, 0, 10, 0], [0, 0, 0, 10]];

// History trails
let trueHistory = [];
let gpsHistory = [];
let imuHistory = [];
let fusedHistory = [];
const MAX_HISTORY = 200;

// Error tracking
let gpsErrors = [];
let imuErrors = [];
let fusedErrors = [];

// Simulation parameters
let gpsNoiseLevel = 15;  // meters
let imuDriftRate = 0.1;   // drift per step
let imuBias = { x: 0, y: 0 };

// Timing
let gpsInterval = 20;  // frames between GPS updates
let lastGpsFrame = 0;

// UI controls
let gpsNoiseSlider;
let imuDriftSlider;
let enableGpsCheckbox;
let enableImuCheckbox;
let runButton;
let resetButton;

// Simulation state
let isRunning = false;
let stepCount = 0;

// Path parameters
let pathRadius = 150;
let pathCenterX, pathCenterY;
let pathAngle = 0;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    pathCenterX = canvasWidth / 2;
    pathCenterY = drawHeight / 2;

    resetSimulation();
    createControls();

    describe('Sensor fusion visualization comparing GPS-only, IMU-only, and fused estimation', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Sliders
    gpsNoiseSlider = createSlider(5, 40, 15, 1);
    gpsNoiseSlider.parent(container);
    gpsNoiseSlider.position(sliderLeftMargin, drawHeight + 8);
    gpsNoiseSlider.size(160);
    gpsNoiseSlider.input(() => gpsNoiseLevel = gpsNoiseSlider.value());

    imuDriftSlider = createSlider(0, 0.5, 0.1, 0.01);
    imuDriftSlider.parent(container);
    imuDriftSlider.position(470, drawHeight + 8);
    imuDriftSlider.size(160);
    imuDriftSlider.input(() => imuDriftRate = imuDriftSlider.value());

    // Row 2: Checkboxes and buttons
    enableGpsCheckbox = createCheckbox(' Enable GPS', true);
    enableGpsCheckbox.parent(container);
    enableGpsCheckbox.position(10, drawHeight + 45);
    enableGpsCheckbox.style('font-size', '14px');

    enableImuCheckbox = createCheckbox(' Enable IMU', true);
    enableImuCheckbox.parent(container);
    enableImuCheckbox.position(130, drawHeight + 45);
    enableImuCheckbox.style('font-size', '14px');

    runButton = createButton('Run');
    runButton.parent(container);
    runButton.position(260, drawHeight + 42);
    runButton.mousePressed(toggleRun);
    runButton.style('font-size', '14px');
    runButton.style('padding', '5px 15px');

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(320, drawHeight + 42);
    resetButton.mousePressed(resetSimulation);
    resetButton.style('font-size', '14px');
    resetButton.style('padding', '5px 15px');
}

function resetSimulation() {
    // Reset true state to starting position on circle
    pathAngle = 0;
    truePosition = {
        x: pathCenterX + pathRadius,
        y: pathCenterY
    };
    trueVelocity = { x: 0, y: 2 };
    trueHeading = HALF_PI;

    // Reset estimates
    gpsEstimate = { ...truePosition };
    imuEstimate = { ...truePosition, vx: trueVelocity.x, vy: trueVelocity.y };
    fusedEstimate = { ...truePosition, vx: trueVelocity.x, vy: trueVelocity.y };

    // Reset IMU bias
    imuBias = { x: random(-0.02, 0.02), y: random(-0.02, 0.02) };

    // Reset Kalman covariance
    fusedP = [[100, 0, 0, 0], [0, 100, 0, 0], [0, 0, 10, 0], [0, 0, 0, 10]];

    // Clear histories
    trueHistory = [];
    gpsHistory = [];
    imuHistory = [];
    fusedHistory = [];
    gpsErrors = [];
    imuErrors = [];
    fusedErrors = [];

    stepCount = 0;
    lastGpsFrame = 0;
    isRunning = false;
    runButton.html('Run');
}

function toggleRun() {
    isRunning = !isRunning;
    runButton.html(isRunning ? 'Pause' : 'Run');
}

function updateSimulation() {
    stepCount++;

    // Update true position (circular path with some variation)
    pathAngle += 0.015;
    let targetX = pathCenterX + pathRadius * cos(pathAngle);
    let targetY = pathCenterY + pathRadius * sin(pathAngle);

    // Add some noise to the path
    targetX += sin(pathAngle * 3) * 20;
    targetY += cos(pathAngle * 2) * 15;

    trueVelocity.x = targetX - truePosition.x;
    trueVelocity.y = targetY - truePosition.y;
    truePosition.x = targetX;
    truePosition.y = targetY;

    // Store true history
    trueHistory.push({ ...truePosition });
    if (trueHistory.length > MAX_HISTORY) trueHistory.shift();

    // GPS update (low rate, noisy but absolute)
    let useGps = enableGpsCheckbox.checked();
    if (stepCount - lastGpsFrame >= gpsInterval && useGps) {
        lastGpsFrame = stepCount;
        gpsEstimate = {
            x: truePosition.x + randomGaussian(0, gpsNoiseLevel),
            y: truePosition.y + randomGaussian(0, gpsNoiseLevel)
        };
        gpsHistory.push({ ...gpsEstimate });
        if (gpsHistory.length > MAX_HISTORY / gpsInterval) gpsHistory.shift();
    }

    // IMU update (high rate, but drifts)
    let useImu = enableImuCheckbox.checked();
    if (useImu) {
        // Measure acceleration with bias and noise
        let measuredVx = trueVelocity.x + imuBias.x + randomGaussian(0, 0.2);
        let measuredVy = trueVelocity.y + imuBias.y + randomGaussian(0, 0.2);

        // IMU bias drifts over time
        imuBias.x += randomGaussian(0, imuDriftRate * 0.01);
        imuBias.y += randomGaussian(0, imuDriftRate * 0.01);

        // Dead reckoning integration
        imuEstimate.vx = imuEstimate.vx * 0.95 + measuredVx * 0.05;
        imuEstimate.vy = imuEstimate.vy * 0.95 + measuredVy * 0.05;
        imuEstimate.x += imuEstimate.vx;
        imuEstimate.y += imuEstimate.vy;
    }
    imuHistory.push({ x: imuEstimate.x, y: imuEstimate.y });
    if (imuHistory.length > MAX_HISTORY) imuHistory.shift();

    // Kalman filter fusion
    updateFusedEstimate(useGps && (stepCount - lastGpsFrame < 2), useImu);

    fusedHistory.push({ x: fusedEstimate.x, y: fusedEstimate.y });
    if (fusedHistory.length > MAX_HISTORY) fusedHistory.shift();

    // Calculate errors
    let gpsErr = sqrt(sq(gpsEstimate.x - truePosition.x) + sq(gpsEstimate.y - truePosition.y));
    let imuErr = sqrt(sq(imuEstimate.x - truePosition.x) + sq(imuEstimate.y - truePosition.y));
    let fusedErr = sqrt(sq(fusedEstimate.x - truePosition.x) + sq(fusedEstimate.y - truePosition.y));

    gpsErrors.push(gpsErr);
    imuErrors.push(imuErr);
    fusedErrors.push(fusedErr);

    if (gpsErrors.length > 100) gpsErrors.shift();
    if (imuErrors.length > 100) imuErrors.shift();
    if (fusedErrors.length > 100) fusedErrors.shift();
}

function updateFusedEstimate(hasGps, hasImu) {
    let dt = 1;

    // State transition (constant velocity)
    let F = [[1, 0, dt, 0], [0, 1, 0, dt], [0, 0, 1, 0], [0, 0, 0, 1]];

    // Process noise
    let q = hasImu ? 0.5 : 2;
    let Q = [[q, 0, 0, 0], [0, q, 0, 0], [0, 0, q * 0.1, 0], [0, 0, 0, q * 0.1]];

    // Predict
    let x = [fusedEstimate.x, fusedEstimate.y, fusedEstimate.vx, fusedEstimate.vy];
    let xPred = matVecMult(F, x);

    let FP = matMult(F, fusedP);
    let Ft = transpose(F);
    let PPred = matAdd(matMult(FP, Ft), Q);

    // Update with IMU velocity if available
    if (hasImu) {
        // IMU provides velocity-like information
        xPred[2] = xPred[2] * 0.7 + (trueVelocity.x + imuBias.x) * 0.3;
        xPred[3] = xPred[3] * 0.7 + (trueVelocity.y + imuBias.y) * 0.3;
    }

    // Update with GPS if available
    if (hasGps) {
        let H = [[1, 0, 0, 0], [0, 1, 0, 0]];
        let R = [[gpsNoiseLevel * gpsNoiseLevel, 0], [0, gpsNoiseLevel * gpsNoiseLevel]];

        // Innovation
        let Hx = [xPred[0], xPred[1]];
        let y = [gpsEstimate.x - Hx[0], gpsEstimate.y - Hx[1]];

        // Innovation covariance
        let HP = matMult(H, PPred);
        let Ht = transpose(H);
        let S = matAdd(matMult(HP, Ht), R);

        // Kalman gain
        let PHt = matMult(PPred, Ht);
        let Sinv = inverse2x2(S);
        let K = matMult(PHt, Sinv);

        // Update state
        let Ky = matVecMult(K, y);
        xPred = [xPred[0] + Ky[0], xPred[1] + Ky[1], xPred[2] + Ky[2], xPred[3] + Ky[3]];

        // Update covariance
        let KH = matMult(K, H);
        let I = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        PPred = matMult(matSub(I, KH), PPred);
    }

    fusedEstimate = { x: xPred[0], y: xPred[1], vx: xPred[2], vy: xPred[3] };
    fusedP = PPred;
}

function draw() {
    updateCanvasSize();

    if (isRunning && frameCount % 2 === 0) {
        updateSimulation();
    }

    // Drawing area
    fill(30);
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(200);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Title
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('Sensor Fusion Visualizer', canvasWidth / 2, 10);

    // Draw reference path (faint)
    noFill();
    stroke(60);
    strokeWeight(1);
    ellipse(pathCenterX, pathCenterY, pathRadius * 2, pathRadius * 2);

    // Draw trails
    drawTrail(trueHistory, color(100, 100, 255), 2);
    if (enableGpsCheckbox.checked()) drawPoints(gpsHistory, color(50, 150, 255), 8);
    if (enableImuCheckbox.checked()) drawTrail(imuHistory, color(255, 150, 50), 2);
    drawTrail(fusedHistory, color(50, 255, 100), 2);

    // Draw current positions
    // True position
    fill(100, 100, 255);
    noStroke();
    ellipse(truePosition.x, truePosition.y, 12, 12);

    // GPS position
    if (enableGpsCheckbox.checked()) {
        stroke(50, 150, 255);
        strokeWeight(2);
        noFill();
        ellipse(gpsEstimate.x, gpsEstimate.y, 20, 20);
        line(gpsEstimate.x - 8, gpsEstimate.y, gpsEstimate.x + 8, gpsEstimate.y);
        line(gpsEstimate.x, gpsEstimate.y - 8, gpsEstimate.x, gpsEstimate.y + 8);
    }

    // IMU position
    if (enableImuCheckbox.checked()) {
        fill(255, 150, 50);
        noStroke();
        rectMode(CENTER);
        rect(imuEstimate.x, imuEstimate.y, 10, 10);
        rectMode(CORNER);
    }

    // Fused position with uncertainty ellipse
    push();
    translate(fusedEstimate.x, fusedEstimate.y);
    noFill();
    stroke(50, 255, 100, 100);
    strokeWeight(2);
    let sigmaX = sqrt(fusedP[0][0]) * 2;
    let sigmaY = sqrt(fusedP[1][1]) * 2;
    ellipse(0, 0, sigmaX, sigmaY);
    pop();

    fill(50, 255, 100);
    noStroke();
    ellipse(fusedEstimate.x, fusedEstimate.y, 14, 14);

    // Draw legend and stats
    drawLegend();
    drawStats();
    drawLabels();
}

function drawTrail(history, col, weight) {
    if (history.length < 2) return;
    noFill();
    stroke(col);
    strokeWeight(weight);
    beginShape();
    for (let p of history) {
        vertex(p.x, p.y);
    }
    endShape();
}

function drawPoints(history, col, size) {
    fill(col);
    noStroke();
    for (let p of history) {
        ellipse(p.x, p.y, size, size);
    }
}

function drawLegend() {
    let legendX = 15;
    let legendY = 45;

    fill(255, 255, 255, 200);
    stroke(100);
    strokeWeight(1);
    rect(legendX - 5, legendY - 5, 130, 90, 5);

    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();

    fill(100, 100, 255);
    ellipse(legendX + 8, legendY + 10, 10, 10);
    fill(255);
    text('True Position', legendX + 20, legendY + 10);

    fill(50, 150, 255);
    ellipse(legendX + 8, legendY + 30, 10, 10);
    fill(255);
    text('GPS (noisy)', legendX + 20, legendY + 30);

    fill(255, 150, 50);
    rectMode(CENTER);
    rect(legendX + 8, legendY + 50, 8, 8);
    rectMode(CORNER);
    fill(255);
    text('IMU (drifts)', legendX + 20, legendY + 50);

    fill(50, 255, 100);
    ellipse(legendX + 8, legendY + 70, 10, 10);
    fill(255);
    text('Fused (best)', legendX + 20, legendY + 70);
}

function drawStats() {
    let statsX = canvasWidth - 170;
    let statsY = 45;

    fill(255, 255, 255, 200);
    stroke(100);
    strokeWeight(1);
    rect(statsX - 5, statsY - 5, 160, 100, 5);

    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();
    fill(0);
    text('RMSE (last 100 steps):', statsX + 5, statsY);

    let gpsRmse = rms(gpsErrors);
    let imuRmse = rms(imuErrors);
    let fusedRmse = rms(fusedErrors);

    fill(50, 150, 255);
    text('GPS: ' + gpsRmse.toFixed(1) + ' px', statsX + 5, statsY + 22);

    fill(200, 100, 0);
    text('IMU: ' + imuRmse.toFixed(1) + ' px', statsX + 5, statsY + 42);

    fill(0, 180, 50);
    text('Fused: ' + fusedRmse.toFixed(1) + ' px', statsX + 5, statsY + 62);

    fill(0);
    textSize(10);
    text('Step: ' + stepCount, statsX + 5, statsY + 82);
}

function rms(arr) {
    if (arr.length === 0) return 0;
    let sum = arr.reduce((a, b) => a + b * b, 0);
    return sqrt(sum / arr.length);
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    text('GPS Noise: ' + gpsNoiseLevel + 'm', 10, drawHeight + 18);
    text('IMU Drift: ' + imuDriftRate.toFixed(2), 340, drawHeight + 18);

    textSize(12);
    fill(100);
    textAlign(CENTER, CENTER);
    text('GPS updates every 20 frames | IMU updates every frame', canvasWidth / 2, drawHeight + 78);
}

// Matrix utilities
function matVecMult(A, v) {
    let result = [];
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = 0; j < v.length; j++) {
            sum += A[i][j] * v[j];
        }
        result.push(sum);
    }
    return result;
}

function matMult(A, B) {
    let result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = [];
        for (let j = 0; j < B[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < B.length; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function matAdd(A, B) {
    let result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = [];
        for (let j = 0; j < A[0].length; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    return result;
}

function matSub(A, B) {
    let result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = [];
        for (let j = 0; j < A[0].length; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

function transpose(A) {
    let result = [];
    for (let i = 0; i < A[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < A.length; j++) {
            result[i][j] = A[j][i];
        }
    }
    return result;
}

function inverse2x2(A) {
    let det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return [
        [A[1][1] / det, -A[0][1] / det],
        [-A[1][0] / det, A[0][0] / det]
    ];
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    pathCenterX = canvasWidth / 2;

    gpsNoiseSlider.position(sliderLeftMargin, drawHeight + 8);
    imuDriftSlider.position(470, drawHeight + 8);
    enableGpsCheckbox.position(10, drawHeight + 45);
    enableImuCheckbox.position(130, drawHeight + 45);
    runButton.position(260, drawHeight + 42);
    resetButton.position(320, drawHeight + 42);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 700);
    }
}
