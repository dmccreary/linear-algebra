// Kalman Filter Visualizer
// Demonstrates how Kalman filter combines prediction and measurement
// Learning objective: Understand Kalman filter predict-update cycle (Bloom: Apply)

let canvasWidth = 800;
let drawHeight = 500;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

// Kalman filter state
let x = [];  // State estimate [x, y, vx, vy]
let P = [];  // Covariance matrix
let F = [];  // State transition matrix
let H = [];  // Observation matrix
let Q = [];  // Process noise covariance
let R = [];  // Measurement noise covariance

// True state (hidden)
let trueX = [];
let trueVel = [];

// Visualization data
let history = [];
let measurements = [];
let predictions = [];
const MAX_HISTORY = 100;

// UI controls
let qSlider;
let rSlider;
let stepButton;
let runButton;
let resetButton;
let showTrueCheckbox;
let motionModelSelect;

// Simulation state
let isRunning = false;
let dt = 1.0;  // Time step
let stepCount = 0;

// Parameters
let processNoise = 0.5;
let measurementNoise = 20;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    initKalmanFilter();
    createControls();

    describe('Interactive Kalman filter visualization showing prediction, measurement, and state estimation', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Sliders
    qSlider = createSlider(0.01, 2, 0.5, 0.01);
    qSlider.parent(container);
    qSlider.position(sliderLeftMargin, drawHeight + 8);
    qSlider.size(180);
    qSlider.input(updateNoiseParameters);

    rSlider = createSlider(1, 50, 20, 1);
    rSlider.parent(container);
    rSlider.position(520, drawHeight + 8);
    rSlider.size(180);
    rSlider.input(updateNoiseParameters);

    // Row 2: Buttons and controls
    stepButton = createButton('Step');
    stepButton.parent(container);
    stepButton.position(10, drawHeight + 45);
    stepButton.mousePressed(doStep);
    stepButton.style('font-size', '14px');
    stepButton.style('padding', '5px 15px');

    runButton = createButton('Run');
    runButton.parent(container);
    runButton.position(80, drawHeight + 45);
    runButton.mousePressed(toggleRun);
    runButton.style('font-size', '14px');
    runButton.style('padding', '5px 15px');

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(145, drawHeight + 45);
    resetButton.mousePressed(resetSimulation);
    resetButton.style('font-size', '14px');
    resetButton.style('padding', '5px 15px');

    showTrueCheckbox = createCheckbox(' Show True Position', false);
    showTrueCheckbox.parent(container);
    showTrueCheckbox.position(230, drawHeight + 48);
    showTrueCheckbox.style('font-size', '14px');

    motionModelSelect = createSelect();
    motionModelSelect.parent(container);
    motionModelSelect.position(420, drawHeight + 45);
    motionModelSelect.option('Constant Velocity');
    motionModelSelect.option('Constant Acceleration');
    motionModelSelect.option('Random Walk');
    motionModelSelect.selected('Constant Velocity');
    motionModelSelect.style('font-size', '14px');
    motionModelSelect.style('padding', '4px');
    motionModelSelect.changed(updateMotionModel);
}

function initKalmanFilter() {
    // Initialize true state
    trueX = [canvasWidth / 2, drawHeight / 2];
    trueVel = [random(-2, 2), random(-2, 2)];

    // Initialize state estimate [x, y, vx, vy]
    x = [trueX[0] + random(-30, 30), trueX[1] + random(-30, 30), 0, 0];

    // Initial covariance (large uncertainty)
    P = [
        [100, 0, 0, 0],
        [0, 100, 0, 0],
        [0, 0, 10, 0],
        [0, 0, 0, 10]
    ];

    // State transition matrix (constant velocity model)
    updateMotionModel();

    // Observation matrix (we only observe position)
    H = [
        [1, 0, 0, 0],
        [0, 1, 0, 0]
    ];

    updateNoiseParameters();

    // Clear history
    history = [];
    measurements = [];
    predictions = [];
    stepCount = 0;
}

function updateMotionModel() {
    let model = motionModelSelect.value();

    if (model === 'Constant Velocity') {
        F = [
            [1, 0, dt, 0],
            [0, 1, 0, dt],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    } else if (model === 'Constant Acceleration') {
        F = [
            [1, 0, dt, 0],
            [0, 1, 0, dt],
            [0, 0, 0.98, 0],  // Slight velocity decay
            [0, 0, 0, 0.98]
        ];
    } else {  // Random Walk
        F = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }
}

function updateNoiseParameters() {
    processNoise = qSlider.value();
    measurementNoise = rSlider.value();

    // Process noise covariance
    let q = processNoise;
    Q = [
        [q * dt * dt * dt / 3, 0, q * dt * dt / 2, 0],
        [0, q * dt * dt * dt / 3, 0, q * dt * dt / 2],
        [q * dt * dt / 2, 0, q * dt, 0],
        [0, q * dt * dt / 2, 0, q * dt]
    ];

    // Measurement noise covariance
    let r = measurementNoise;
    R = [
        [r * r, 0],
        [0, r * r]
    ];
}

function predict() {
    // Predict state: x = F * x
    let newX = matVecMult(F, x);

    // Add random process noise to true state
    let ax = randomGaussian(0, processNoise);
    let ay = randomGaussian(0, processNoise);
    trueVel[0] += ax * dt;
    trueVel[1] += ay * dt;

    // Keep true state in bounds
    if (trueX[0] < margin || trueX[0] > canvasWidth - margin) {
        trueVel[0] *= -0.9;
    }
    if (trueX[1] < margin || trueX[1] > drawHeight - margin) {
        trueVel[1] *= -0.9;
    }

    trueX[0] += trueVel[0] * dt;
    trueX[1] += trueVel[1] * dt;
    trueX[0] = constrain(trueX[0], margin, canvasWidth - margin);
    trueX[1] = constrain(trueX[1], margin, drawHeight - margin);

    // Store prediction before update
    predictions.push({x: newX[0], y: newX[1]});

    // Predict covariance: P = F * P * F' + Q
    let FP = matMult(F, P);
    let Ft = transpose(F);
    let FPFt = matMult(FP, Ft);
    P = matAdd(FPFt, Q);

    x = newX;
}

function update(z) {
    // Innovation: y = z - H * x
    let Hx = matVecMult(H, x);
    let y = [z[0] - Hx[0], z[1] - Hx[1]];

    // Innovation covariance: S = H * P * H' + R
    let HP = matMult(H, P);
    let Ht = transpose(H);
    let HPHt = matMult(HP, Ht);
    let S = matAdd(HPHt, R);

    // Kalman gain: K = P * H' * S^-1
    let PHt = matMult(P, Ht);
    let Sinv = inverse2x2(S);
    let K = matMult(PHt, Sinv);

    // Update state: x = x + K * y
    let Ky = matVecMult(K, y);
    x = [x[0] + Ky[0], x[1] + Ky[1], x[2] + Ky[2], x[3] + Ky[3]];

    // Update covariance: P = (I - K * H) * P
    let KH = matMult(K, H);
    let I = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    let IKH = matSub(I, KH);
    P = matMult(IKH, P);
}

function doStep() {
    // Predict
    predict();

    // Generate noisy measurement from true state
    let z = [
        trueX[0] + randomGaussian(0, measurementNoise),
        trueX[1] + randomGaussian(0, measurementNoise)
    ];
    measurements.push({x: z[0], y: z[1]});

    // Update
    update(z);

    // Store history
    history.push({
        estimate: {x: x[0], y: x[1]},
        true: {x: trueX[0], y: trueX[1]},
        covariance: [P[0][0], P[1][1], P[0][1]]
    });

    // Trim history
    if (history.length > MAX_HISTORY) {
        history.shift();
        measurements.shift();
        predictions.shift();
    }

    stepCount++;
}

function toggleRun() {
    isRunning = !isRunning;
    runButton.html(isRunning ? 'Pause' : 'Run');
}

function resetSimulation() {
    isRunning = false;
    runButton.html('Run');
    initKalmanFilter();
}

function draw() {
    updateCanvasSize();

    // Run simulation if active
    if (isRunning && frameCount % 10 === 0) {
        doStep();
    }

    // Drawing area
    fill('aliceblue');
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
    fill('black');
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('Kalman Filter Visualizer', canvasWidth / 2, 10);

    // Draw history trails
    drawHistory();

    // Draw measurements
    drawMeasurements();

    // Draw current state
    drawCurrentState();

    // Draw info panel
    drawInfoPanel();

    // Draw labels
    drawLabels();
}

function drawHistory() {
    // Estimate trail (green)
    noFill();
    stroke(0, 200, 0, 150);
    strokeWeight(2);
    beginShape();
    for (let h of history) {
        vertex(h.estimate.x, h.estimate.y);
    }
    endShape();

    // True trail (blue, if shown)
    if (showTrueCheckbox.checked()) {
        stroke(0, 100, 255, 150);
        beginShape();
        for (let h of history) {
            vertex(h.true.x, h.true.y);
        }
        endShape();
    }
}

function drawMeasurements() {
    // Draw measurement points
    fill(255, 100, 100, 150);
    noStroke();
    for (let m of measurements) {
        ellipse(m.x, m.y, 6, 6);
    }

    // Draw latest measurement larger
    if (measurements.length > 0) {
        let latest = measurements[measurements.length - 1];
        stroke(255, 0, 0);
        strokeWeight(2);
        noFill();
        ellipse(latest.x, latest.y, 15, 15);
        line(latest.x - 10, latest.y, latest.x + 10, latest.y);
        line(latest.x, latest.y - 10, latest.x, latest.y + 10);
    }
}

function drawCurrentState() {
    // Draw uncertainty ellipse
    push();
    translate(x[0], x[1]);
    noFill();
    stroke(0, 200, 0, 100);
    strokeWeight(2);

    // Compute ellipse axes from covariance
    let sigmaX = sqrt(P[0][0]) * 2;  // 2-sigma
    let sigmaY = sqrt(P[1][1]) * 2;
    let rho = P[0][1] / (sqrt(P[0][0]) * sqrt(P[1][1]) + 0.001);
    let angle = 0.5 * atan2(2 * rho * sigmaX * sigmaY, sigmaX * sigmaX - sigmaY * sigmaY);

    rotate(angle);
    ellipse(0, 0, sigmaX * 2, sigmaY * 2);
    pop();

    // Draw velocity arrow (prediction direction)
    stroke(0, 150, 0);
    strokeWeight(2);
    let velScale = 10;
    let endX = x[0] + x[2] * velScale;
    let endY = x[1] + x[3] * velScale;
    line(x[0], x[1], endX, endY);
    // Arrow head
    push();
    translate(endX, endY);
    rotate(atan2(x[3], x[2]));
    line(0, 0, -8, -4);
    line(0, 0, -8, 4);
    pop();

    // Draw innovation vector (if we have measurements)
    if (measurements.length > 0) {
        let latest = measurements[measurements.length - 1];
        stroke(255, 150, 0);
        strokeWeight(1);
        setLineDash([5, 5]);
        line(x[0], x[1], latest.x, latest.y);
        setLineDash([]);
    }

    // Draw estimate point
    fill(0, 200, 0);
    noStroke();
    ellipse(x[0], x[1], 12, 12);

    // Draw true position (if shown)
    if (showTrueCheckbox.checked()) {
        fill(0, 100, 255);
        ellipse(trueX[0], trueX[1], 10, 10);
    }
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function drawInfoPanel() {
    // Info box
    let boxX = canvasWidth - 180;
    let boxY = 40;
    let boxW = 170;
    let boxH = 120;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(boxX, boxY, boxW, boxH, 5);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    text('Step: ' + stepCount, boxX + 10, boxY + 10);
    text('Est: (' + x[0].toFixed(1) + ', ' + x[1].toFixed(1) + ')', boxX + 10, boxY + 28);
    text('Vel: (' + x[2].toFixed(2) + ', ' + x[3].toFixed(2) + ')', boxX + 10, boxY + 46);
    text('σx: ' + sqrt(P[0][0]).toFixed(1) + ' σy: ' + sqrt(P[1][1]).toFixed(1), boxX + 10, boxY + 64);

    if (showTrueCheckbox.checked()) {
        let err = sqrt((x[0] - trueX[0]) ** 2 + (x[1] - trueX[1]) ** 2);
        text('True: (' + trueX[0].toFixed(1) + ', ' + trueX[1].toFixed(1) + ')', boxX + 10, boxY + 82);
        text('Error: ' + err.toFixed(1) + ' px', boxX + 10, boxY + 100);
    }

    // Legend
    textSize(11);
    textAlign(LEFT, CENTER);
    let legY = drawHeight - 60;

    fill(0, 200, 0);
    ellipse(20, legY, 8, 8);
    fill(0);
    text('Estimate', 30, legY);

    fill(255, 100, 100);
    ellipse(100, legY, 8, 8);
    fill(0);
    text('Measurement', 110, legY);

    if (showTrueCheckbox.checked()) {
        fill(0, 100, 255);
        ellipse(200, legY, 8, 8);
        fill(0);
        text('True', 210, legY);
    }

    stroke(255, 150, 0);
    setLineDash([5, 5]);
    line(260, legY, 290, legY);
    setLineDash([]);
    fill(0);
    noStroke();
    text('Innovation', 295, legY);
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    // Row 1 labels
    text('Process Noise Q: ' + processNoise.toFixed(2), 10, drawHeight + 18);
    text('Measurement Noise R: ' + measurementNoise, 360, drawHeight + 18);

    // Row 2 label
    text('Model:', 360, drawHeight + 55);
}

// Matrix utility functions
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

    qSlider.position(sliderLeftMargin, drawHeight + 8);
    qSlider.size(180);
    rSlider.position(520, drawHeight + 8);
    rSlider.size(180);
    stepButton.position(10, drawHeight + 45);
    runButton.position(80, drawHeight + 45);
    resetButton.position(145, drawHeight + 45);
    showTrueCheckbox.position(230, drawHeight + 48);
    motionModelSelect.position(420, drawHeight + 45);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 700);
    }
}
