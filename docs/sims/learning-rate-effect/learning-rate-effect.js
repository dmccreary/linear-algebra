// Learning Rate Effect on Convergence MicroSim
// Learning Objective: Understand how learning rate choice affects optimization behavior
// through side-by-side comparison of gradient descent with different learning rates

// Canvas dimensions
let canvasWidth = 900;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;

// Panel dimensions (calculated in setup)
let panelWidth;
let panelHeight;
let panelY = 40;

// Grid settings for contour plots
let gridMin = -4;
let gridMax = 4;

// Three optimizers with different learning rates
let optimizers = [
    { lr: 0.01, name: "Too Small", color: [66, 133, 244] },
    { lr: 0.1, name: "Just Right", color: [52, 168, 83] },
    { lr: 0.5, name: "Too Large", color: [234, 67, 53] }
];

// Optimization state for each panel
let optState = [];

// Loss function: f(x,y) = x^2 + 3*y^2 (elliptical bowl)
// Gradient: df/dx = 2x, df/dy = 6y
let lossA = 1;  // x coefficient
let lossB = 3;  // y coefficient

// Starting point (same for all)
let startX = 3.5;
let startY = 2.5;

// Animation settings
let isRunning = false;
let animationSpeed = 1;
let maxSteps = 500;

// Loss history for comparison plot
let lossHistoryMax = 100;

// UI elements
let lrSliders = [];
let speedSlider;
let runButton, resetButton;
let presetButtons = [];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    panelWidth = (canvasWidth - 4 * margin) / 3;
    panelHeight = drawHeight - 80;

    initializeOptimizers();
    createControls();

    describe('Side-by-side comparison of gradient descent with three different learning rates showing convergence behavior');
}

function initializeOptimizers() {
    optState = [];
    for (let i = 0; i < 3; i++) {
        optState.push({
            x: startX,
            y: startY,
            path: [{x: startX, y: startY}],
            lossHistory: [computeLoss(startX, startY)],
            steps: 0,
            status: "Ready",
            converged: false,
            diverged: false
        });
    }
}

function createControls() {
    const container = document.querySelector('main');

    // Learning rate sliders for each panel
    let sliderStartX = margin + 50;
    let sliderY = drawHeight + 15;
    let sliderSpacing = panelWidth + margin;

    for (let i = 0; i < 3; i++) {
        let slider = createSlider(0.001, 1, optimizers[i].lr, 0.001);
        slider.parent(container);
        slider.position(sliderStartX + i * sliderSpacing, sliderY);
        slider.size(panelWidth - 70);
        slider.input(() => {
            optimizers[i].lr = slider.value();
            resetOptimization();
        });
        lrSliders.push(slider);
    }

    // Bottom row controls
    let bottomY = drawHeight + 55;

    // Preset buttons
    let presetTooSmall = createButton('Too Small');
    presetTooSmall.parent(container);
    presetTooSmall.position(margin, bottomY);
    presetTooSmall.mousePressed(() => setPreset(0.01, 0.03, 0.05));
    presetButtons.push(presetTooSmall);

    let presetJustRight = createButton('Just Right');
    presetJustRight.parent(container);
    presetJustRight.position(margin + 80, bottomY);
    presetJustRight.mousePressed(() => setPreset(0.08, 0.12, 0.18));
    presetButtons.push(presetJustRight);

    let presetTooLarge = createButton('Too Large');
    presetTooLarge.parent(container);
    presetTooLarge.position(margin + 170, bottomY);
    presetTooLarge.mousePressed(() => setPreset(0.3, 0.5, 0.7));
    presetButtons.push(presetTooLarge);

    // Speed slider
    speedSlider = createSlider(1, 10, 1, 1);
    speedSlider.parent(container);
    speedSlider.position(margin + 330, bottomY);
    speedSlider.size(80);

    // Run/Pause button
    runButton = createButton('Run All');
    runButton.parent(container);
    runButton.position(canvasWidth - 180, bottomY);
    runButton.mousePressed(toggleRun);
    runButton.style('background-color', '#4CAF50');
    runButton.style('color', 'white');
    runButton.style('padding', '5px 15px');

    // Reset button
    resetButton = createButton('Reset All');
    resetButton.parent(container);
    resetButton.position(canvasWidth - 90, bottomY);
    resetButton.mousePressed(resetOptimization);
    resetButton.style('padding', '5px 15px');
}

function setPreset(lr1, lr2, lr3) {
    optimizers[0].lr = lr1;
    optimizers[1].lr = lr2;
    optimizers[2].lr = lr3;
    lrSliders[0].value(lr1);
    lrSliders[1].value(lr2);
    lrSliders[2].value(lr3);
    resetOptimization();
}

function toggleRun() {
    isRunning = !isRunning;
    if (isRunning) {
        runButton.html('Pause');
        runButton.style('background-color', '#FF9800');
    } else {
        runButton.html('Run All');
        runButton.style('background-color', '#4CAF50');
    }
}

function resetOptimization() {
    isRunning = false;
    runButton.html('Run All');
    runButton.style('background-color', '#4CAF50');
    initializeOptimizers();
}

function computeLoss(x, y) {
    return lossA * x * x + lossB * y * y;
}

function computeGradient(x, y) {
    return {
        dx: 2 * lossA * x,
        dy: 2 * lossB * y
    };
}

function stepOptimization(index) {
    let state = optState[index];
    let lr = optimizers[index].lr;

    if (state.converged || state.diverged) return;

    let grad = computeGradient(state.x, state.y);

    // Gradient descent step
    let newX = state.x - lr * grad.dx;
    let newY = state.y - lr * grad.dy;

    let loss = computeLoss(newX, newY);

    // Check for divergence
    if (loss > 1000 || isNaN(loss) || abs(newX) > 100 || abs(newY) > 100) {
        state.diverged = true;
        state.status = "Diverging";
        return;
    }

    // Update state
    state.x = newX;
    state.y = newY;
    state.path.push({x: newX, y: newY});
    state.lossHistory.push(loss);
    state.steps++;

    // Check for convergence
    if (loss < 0.001) {
        state.converged = true;
        state.status = "Converged";
    } else if (state.steps > maxSteps) {
        state.status = "Max Steps";
    } else if (abs(grad.dx) < 0.01 && abs(grad.dy) < 0.01) {
        state.converged = true;
        state.status = "Converged";
    } else {
        // Check for oscillation
        if (state.lossHistory.length > 10) {
            let recent = state.lossHistory.slice(-10);
            let increasing = 0;
            for (let i = 1; i < recent.length; i++) {
                if (recent[i] > recent[i-1]) increasing++;
            }
            if (increasing > 5) {
                state.status = "Oscillating";
            } else {
                state.status = "Converging";
            }
        } else {
            state.status = "Converging";
        }
    }
}

function draw() {
    // Animation steps
    if (isRunning) {
        let steps = speedSlider.value();
        for (let s = 0; s < steps; s++) {
            for (let i = 0; i < 3; i++) {
                stepOptimization(i);
            }
        }

        // Check if all finished
        let allDone = optState.every(s => s.converged || s.diverged || s.steps >= maxSteps);
        if (allDone) {
            isRunning = false;
            runButton.html('Run All');
            runButton.style('background-color', '#4CAF50');
        }
    }

    // Background
    background(248);

    // Draw main area
    fill(252, 254, 255);
    stroke(220);
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(220);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Title
    fill(0);
    noStroke();
    textSize(16);
    textAlign(CENTER, TOP);
    text('Learning Rate Effect on Gradient Descent Convergence', canvasWidth / 2, 8);

    // Draw three panels
    for (let i = 0; i < 3; i++) {
        let panelX = margin + i * (panelWidth + margin);
        drawPanel(panelX, panelY, panelWidth, panelHeight, i);
    }

    // Draw control labels
    drawControlLabels();
}

function drawPanel(x, y, w, h, index) {
    let opt = optimizers[index];
    let state = optState[index];

    // Panel background
    fill(255);
    stroke(opt.color[0], opt.color[1], opt.color[2]);
    strokeWeight(2);
    rect(x, y, w, h, 5);

    // Panel title
    fill(opt.color[0], opt.color[1], opt.color[2]);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text(opt.name + ' (\u03B7 = ' + opt.lr.toFixed(3) + ')', x + w/2, y + 5);

    // Contour plot area
    let plotX = x + 10;
    let plotY = y + 25;
    let plotW = w - 20;
    let plotH = h - 90;

    // Draw contour plot
    push();
    // Clip to plot area
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(plotX, plotY, plotW, plotH);
    drawingContext.clip();

    drawContours(plotX, plotY, plotW, plotH);
    drawPath(plotX, plotY, plotW, plotH, state, opt.color);

    drawingContext.restore();
    pop();

    // Plot border
    noFill();
    stroke(200);
    strokeWeight(1);
    rect(plotX, plotY, plotW, plotH);

    // Status indicator
    let statusY = plotY + plotH + 8;
    drawStatusIndicator(x + w/2, statusY, state);

    // Mini loss curve
    let lossY = statusY + 22;
    let lossH = 30;
    drawMiniLossCurve(x + 10, lossY, w - 20, lossH, state, opt.color);

    // Final loss value
    let finalLoss = state.lossHistory[state.lossHistory.length - 1];
    fill(80);
    textSize(9);
    textAlign(CENTER, TOP);
    text('Loss: ' + (finalLoss < 1000 ? finalLoss.toFixed(4) : 'INF') + '  Steps: ' + state.steps, x + w/2, lossY + lossH + 2);
}

function drawContours(x, y, w, h) {
    let scale = w / (gridMax - gridMin);
    let centerX = x + w / 2;
    let centerY = y + h / 2;

    // Draw contour levels
    let levels = [0.5, 2, 5, 10, 20, 35, 50];

    noFill();
    for (let i = 0; i < levels.length; i++) {
        let level = levels[i];
        let alpha = map(i, 0, levels.length, 100, 40);
        stroke(180, 180, 180, alpha);
        strokeWeight(1);

        // For f(x,y) = ax^2 + by^2 = c
        // Ellipse with semi-axes sqrt(c/a) and sqrt(c/b)
        let semiX = sqrt(level / lossA) * scale;
        let semiY = sqrt(level / lossB) * scale;

        ellipse(centerX, centerY, semiX * 2, semiY * 2);
    }

    // Draw axes
    stroke(150);
    strokeWeight(1);
    line(x, centerY, x + w, centerY);
    line(centerX, y, centerX, y + h);

    // Origin marker
    fill(100);
    noStroke();
    ellipse(centerX, centerY, 6, 6);
}

function drawPath(x, y, w, h, state, color) {
    let scale = w / (gridMax - gridMin);
    let centerX = x + w / 2;
    let centerY = y + h / 2;

    if (state.path.length < 2) {
        // Just draw starting point
        fill(color[0], color[1], color[2]);
        noStroke();
        let px = centerX + state.path[0].x * scale / (gridMax - gridMin) * w;
        let py = centerY - state.path[0].y * scale / (gridMax - gridMin) * w / (w/h);
        ellipse(centerX + state.path[0].x * (w / (gridMax - gridMin)),
                centerY - state.path[0].y * (h / (gridMax - gridMin)), 10, 10);
        return;
    }

    // Draw path
    stroke(color[0], color[1], color[2]);
    strokeWeight(1.5);
    noFill();

    beginShape();
    for (let i = 0; i < state.path.length; i++) {
        let pt = state.path[i];
        let px = centerX + pt.x * (w / (gridMax - gridMin));
        let py = centerY - pt.y * (h / (gridMax - gridMin));
        vertex(px, py);
    }
    endShape();

    // Draw points along path (sparse for performance)
    fill(color[0], color[1], color[2]);
    noStroke();
    let step = max(1, floor(state.path.length / 20));
    for (let i = 0; i < state.path.length; i += step) {
        let pt = state.path[i];
        let px = centerX + pt.x * (w / (gridMax - gridMin));
        let py = centerY - pt.y * (h / (gridMax - gridMin));
        ellipse(px, py, 4, 4);
    }

    // Draw current position
    let current = state.path[state.path.length - 1];
    let cx = centerX + current.x * (w / (gridMax - gridMin));
    let cy = centerY - current.y * (h / (gridMax - gridMin));

    fill(color[0], color[1], color[2]);
    stroke(255);
    strokeWeight(2);
    ellipse(cx, cy, 10, 10);

    // Draw start position
    let start = state.path[0];
    let sx = centerX + start.x * (w / (gridMax - gridMin));
    let sy = centerY - start.y * (h / (gridMax - gridMin));

    noFill();
    stroke(0);
    strokeWeight(1);
    ellipse(sx, sy, 12, 12);
}

function drawStatusIndicator(x, y, state) {
    let statusColor;
    let statusText = state.status;

    switch(state.status) {
        case "Converged":
            statusColor = [52, 168, 83]; // Green
            break;
        case "Converging":
            statusColor = [66, 133, 244]; // Blue
            break;
        case "Oscillating":
            statusColor = [251, 188, 4]; // Yellow/Orange
            break;
        case "Diverging":
            statusColor = [234, 67, 53]; // Red
            break;
        default:
            statusColor = [128, 128, 128]; // Gray
    }

    // Status dot
    fill(statusColor[0], statusColor[1], statusColor[2]);
    noStroke();
    ellipse(x - 35, y + 6, 10, 10);

    // Status text
    textSize(11);
    textAlign(LEFT, CENTER);
    fill(statusColor[0], statusColor[1], statusColor[2]);
    text(statusText, x - 25, y + 6);
}

function drawMiniLossCurve(x, y, w, h, state, color) {
    // Background
    fill(250);
    stroke(220);
    strokeWeight(1);
    rect(x, y, w, h);

    if (state.lossHistory.length < 2) return;

    // Find max loss for scaling (cap at initial loss * 2)
    let maxLoss = min(state.lossHistory[0] * 2, max(...state.lossHistory));
    maxLoss = max(maxLoss, 1);

    // Draw loss curve
    stroke(color[0], color[1], color[2]);
    strokeWeight(1.5);
    noFill();

    beginShape();
    let displayPoints = min(state.lossHistory.length, lossHistoryMax);
    for (let i = 0; i < displayPoints; i++) {
        let idx = state.lossHistory.length <= lossHistoryMax ? i :
                  floor(i * state.lossHistory.length / lossHistoryMax);
        let loss = min(state.lossHistory[idx], maxLoss);
        let px = x + (i / (displayPoints - 1)) * w;
        let py = y + h - (loss / maxLoss) * h;
        vertex(px, py);
    }
    endShape();
}

function drawControlLabels() {
    fill(60);
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);

    // Learning rate labels
    for (let i = 0; i < 3; i++) {
        let labelX = margin + i * (panelWidth + margin);
        text('\u03B7:', labelX, drawHeight + 25);
    }

    // Speed label
    textAlign(LEFT, CENTER);
    text('Speed:', margin + 280, drawHeight + 65);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    panelWidth = (canvasWidth - 4 * margin) / 3;

    // Reposition sliders
    let sliderSpacing = panelWidth + margin;
    for (let i = 0; i < 3; i++) {
        lrSliders[i].position(margin + 50 + i * sliderSpacing, drawHeight + 15);
        lrSliders[i].size(panelWidth - 70);
    }
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(700, container.offsetWidth);
    }
}
