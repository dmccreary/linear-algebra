// Gradient Descent Interactive Visualizer
// Demonstrates how gradient descent navigates the loss surface
// Learning objective: Understand gradient descent and learning rate effects

let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 120;

// Current position on loss surface
let theta1 = -2.0;
let theta2 = 2.0;

// Optimization history
let path = [];
let lossHistory = [];
let maxHistoryLength = 200;

// Animation state
let isRunning = false;
let animationSpeed = 1;

// Learning rate (exponential scale)
let learningRateExp = -1;  // 10^(-1) = 0.1
let learningRate = 0.1;

// Loss function type
let lossFunctionType = 0;  // 0: quadratic, 1: Rosenbrock, 2: Saddle

// View mode
let viewMode = 'contour';  // '3d' or 'contour'

// Camera rotation for 3D view
let rotX = 0.6;
let rotY = -0.5;
let isDragging = false;
let lastMouseX, lastMouseY;

// Iteration counter
let iteration = 0;
let converged = false;
let convergenceThreshold = 0.0001;

// Font for WEBGL
let font;

// UI elements
let lrSlider, stepButton, runButton, resetButton;
let lossSelect, viewToggle;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    const container = document.querySelector('main');
    canvas.parent(container);
    textFont(font);

    // Learning rate slider (log scale: -3 to 0 maps to 0.001 to 1.0)
    lrSlider = createSlider(-30, 0, -10, 1);
    lrSlider.parent(container);
    lrSlider.position(sliderLeftMargin, drawHeight + 15);
    lrSlider.size(150);
    lrSlider.input(onLrChange);

    // Step button
    stepButton = createButton('Step');
    stepButton.parent(container);
    stepButton.position(290, drawHeight + 12);
    stepButton.mousePressed(doStep);

    // Run button
    runButton = createButton('Run');
    runButton.parent(container);
    runButton.position(345, drawHeight + 12);
    runButton.mousePressed(toggleRun);

    // Reset button
    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(400, drawHeight + 12);
    resetButton.mousePressed(doReset);

    // Loss function selector
    lossSelect = createSelect();
    lossSelect.parent(container);
    lossSelect.position(sliderLeftMargin, drawHeight + 50);
    lossSelect.option('Quadratic Bowl');
    lossSelect.option('Rosenbrock');
    lossSelect.option('Saddle Point');
    lossSelect.changed(onLossChange);

    // View toggle button
    viewToggle = createButton('Toggle 3D/Contour');
    viewToggle.parent(container);
    viewToggle.position(290, drawHeight + 50);
    viewToggle.mousePressed(toggleView);

    // Initialize
    learningRate = pow(10, lrSlider.value() / 10);
    initializePath();

    describe('Interactive gradient descent visualizer showing optimization on various loss surfaces', LABEL);
}

function draw() {
    updateCanvasSize();

    // Run animation if active
    if (isRunning && !converged) {
        for (let i = 0; i < animationSpeed; i++) {
            if (!converged) doGradientStep();
        }
    }

    background(245);

    // Draw in screen coordinates
    push();
    resetMatrix();
    translate(-canvasWidth / 2, -canvasHeight / 2);

    // Draw border
    stroke(200);
    strokeWeight(1);
    noFill();
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill(0);
    noStroke();
    textSize(18);
    textAlign(CENTER, TOP);
    text('Gradient Descent Interactive Visualizer', canvasWidth / 2, 8);

    pop();

    // Main visualization
    if (viewMode === '3d') {
        draw3DView();
    } else {
        drawContourView();
    }

    // Draw loss history plot
    drawLossPlot();

    // Draw info panel
    drawInfoPanel();

    // Draw control labels
    drawControlLabels();
}

function draw3DView() {
    push();
    translate(0, -40, 0);

    // Apply camera rotation
    rotateX(rotX);
    rotateY(rotY);

    let scale3D = 40;
    let range = 3;

    // Draw coordinate axes
    strokeWeight(2);
    stroke(200, 50, 50);
    line(-range * scale3D, 0, 0, range * scale3D, 0, 0);
    stroke(50, 200, 50);
    line(0, range * scale3D, 0, 0, -range * scale3D, 0);
    stroke(50, 50, 200);
    line(0, 0, -range * scale3D, 0, 0, range * scale3D);

    // Draw surface as wireframe
    stroke(100, 150, 200, 150);
    strokeWeight(0.5);
    noFill();

    let step = 0.3;
    let heightScale = 15;

    // Grid lines along theta1
    for (let t2 = -range; t2 <= range; t2 += step) {
        beginShape();
        for (let t1 = -range; t1 <= range; t1 += step / 2) {
            let loss = computeLoss(t1, t2);
            loss = constrain(loss, 0, 10);
            vertex(t1 * scale3D, -loss * heightScale, t2 * scale3D);
        }
        endShape();
    }

    // Grid lines along theta2
    for (let t1 = -range; t1 <= range; t1 += step) {
        beginShape();
        for (let t2 = -range; t2 <= range; t2 += step / 2) {
            let loss = computeLoss(t1, t2);
            loss = constrain(loss, 0, 10);
            vertex(t1 * scale3D, -loss * heightScale, t2 * scale3D);
        }
        endShape();
    }

    // Draw optimization path
    if (path.length > 1) {
        stroke(255, 100, 50);
        strokeWeight(3);
        noFill();
        beginShape();
        for (let p of path) {
            let loss = constrain(p.loss, 0, 10);
            vertex(p.t1 * scale3D, -loss * heightScale, p.t2 * scale3D);
        }
        endShape();
    }

    // Draw current position
    let currentLoss = constrain(computeLoss(theta1, theta2), 0, 10);
    push();
    translate(theta1 * scale3D, -currentLoss * heightScale, theta2 * scale3D);
    fill(255, 50, 50);
    noStroke();
    sphere(6);
    pop();

    // Draw gradient arrow at current position
    let grad = computeGradient(theta1, theta2);
    let gradMag = sqrt(grad.g1 * grad.g1 + grad.g2 * grad.g2);
    if (gradMag > 0.01) {
        let arrowScale = min(1, 30 / gradMag);
        stroke(50, 200, 50);
        strokeWeight(3);
        line(
            theta1 * scale3D, -currentLoss * heightScale, theta2 * scale3D,
            (theta1 - grad.g1 * arrowScale) * scale3D, -currentLoss * heightScale, (theta2 - grad.g2 * arrowScale) * scale3D
        );
    }

    pop();
}

function drawContourView() {
    push();
    resetMatrix();
    translate(-canvasWidth / 2, -canvasHeight / 2);

    let plotX = 30;
    let plotY = 40;
    let plotW = canvasWidth * 0.55 - 40;
    let plotH = drawHeight - 80;

    // Background
    fill(255);
    stroke(180);
    strokeWeight(1);
    rect(plotX, plotY, plotW, plotH);

    let centerX = plotX + plotW / 2;
    let centerY = plotY + plotH / 2;
    let scale2D = min(plotW, plotH) / 6;
    let range = 3;

    // Draw contour lines
    let numContours = 15;
    let maxLoss = 10;

    for (let level = 0; level < numContours; level++) {
        let targetLoss = (level / numContours) * maxLoss;
        stroke(lerpColor(color(50, 100, 200), color(200, 50, 50), level / numContours));
        strokeWeight(1);
        noFill();

        // Draw contour by checking grid cells
        let step = 0.1;
        for (let t1 = -range; t1 < range; t1 += step) {
            for (let t2 = -range; t2 < range; t2 += step) {
                let loss = computeLoss(t1, t2);
                let lossRight = computeLoss(t1 + step, t2);
                let lossDown = computeLoss(t1, t2 + step);

                // Horizontal edge crossing
                if ((loss - targetLoss) * (lossRight - targetLoss) < 0) {
                    let t = (targetLoss - loss) / (lossRight - loss);
                    let px = centerX + (t1 + t * step) * scale2D;
                    let py = centerY - t2 * scale2D;
                    point(px, py);
                }

                // Vertical edge crossing
                if ((loss - targetLoss) * (lossDown - targetLoss) < 0) {
                    let t = (targetLoss - loss) / (lossDown - loss);
                    let px = centerX + t1 * scale2D;
                    let py = centerY - (t2 + t * step) * scale2D;
                    point(px, py);
                }
            }
        }
    }

    // Draw axes
    stroke(150);
    strokeWeight(1);
    line(plotX, centerY, plotX + plotW, centerY);
    line(centerX, plotY, centerX, plotY + plotH);

    // Axis labels
    fill(80);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('theta_1', centerX, plotY + plotH + 5);
    textAlign(RIGHT, CENTER);
    text('theta_2', plotX - 5, centerY);

    // Draw optimization path
    if (path.length > 1) {
        stroke(255, 100, 50);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let p of path) {
            vertex(centerX + p.t1 * scale2D, centerY - p.t2 * scale2D);
        }
        endShape();

        // Draw path points
        fill(255, 150, 100);
        noStroke();
        for (let i = 0; i < path.length; i++) {
            let p = path[i];
            let sz = (i === path.length - 1) ? 8 : 3;
            ellipse(centerX + p.t1 * scale2D, centerY - p.t2 * scale2D, sz, sz);
        }
    }

    // Draw current position
    fill(255, 50, 50);
    stroke(0);
    strokeWeight(1);
    ellipse(centerX + theta1 * scale2D, centerY - theta2 * scale2D, 12, 12);

    // Draw gradient arrow
    let grad = computeGradient(theta1, theta2);
    let gradMag = sqrt(grad.g1 * grad.g1 + grad.g2 * grad.g2);
    if (gradMag > 0.01) {
        let arrowLen = min(50, gradMag * 30);
        let dirX = -grad.g1 / gradMag;
        let dirY = grad.g2 / gradMag;  // Flip for screen coords

        let startX = centerX + theta1 * scale2D;
        let startY = centerY - theta2 * scale2D;
        let endX = startX + dirX * arrowLen;
        let endY = startY + dirY * arrowLen;

        stroke(50, 180, 50);
        strokeWeight(3);
        line(startX, startY, endX, endY);

        // Arrowhead
        fill(50, 180, 50);
        noStroke();
        let angle = atan2(endY - startY, endX - startX);
        push();
        translate(endX, endY);
        rotate(angle);
        triangle(0, 0, -10, -5, -10, 5);
        pop();
    }

    // Minimum marker
    let minPos = getMinimumPosition();
    stroke(0, 200, 0);
    strokeWeight(2);
    noFill();
    let minX = centerX + minPos.t1 * scale2D;
    let minY = centerY - minPos.t2 * scale2D;
    line(minX - 8, minY - 8, minX + 8, minY + 8);
    line(minX - 8, minY + 8, minX + 8, minY - 8);

    // Click instruction
    fill(100);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text('Click to set starting point', centerX, plotY + plotH - 5);

    pop();
}

function drawLossPlot() {
    push();
    resetMatrix();
    translate(-canvasWidth / 2, -canvasHeight / 2);

    let plotX = canvasWidth * 0.57;
    let plotY = 40;
    let plotW = canvasWidth * 0.40 - 20;
    let plotH = (drawHeight - 80) * 0.5;

    // Background
    fill(255);
    stroke(180);
    strokeWeight(1);
    rect(plotX, plotY, plotW, plotH);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Loss vs Iteration', plotX + plotW / 2, plotY + 5);

    // Draw loss history
    if (lossHistory.length > 1) {
        let maxLoss = max(lossHistory);
        let minLoss = min(lossHistory);
        let lossRange = max(maxLoss - minLoss, 0.1);

        stroke(50, 100, 200);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < lossHistory.length; i++) {
            let x = plotX + 10 + (i / max(lossHistory.length - 1, 1)) * (plotW - 20);
            let y = plotY + plotH - 25 - ((lossHistory[i] - minLoss) / lossRange) * (plotH - 40);
            vertex(x, y);
        }
        endShape();
    }

    // Axes labels
    fill(80);
    textSize(10);
    textAlign(CENTER, TOP);
    text('Iteration', plotX + plotW / 2, plotY + plotH - 15);
    textAlign(RIGHT, CENTER);
    push();
    translate(plotX + 15, plotY + plotH / 2);
    rotate(-HALF_PI);
    text('Loss J', 0, 0);
    pop();

    pop();
}

function drawInfoPanel() {
    push();
    resetMatrix();
    translate(-canvasWidth / 2, -canvasHeight / 2);

    let panelX = canvasWidth * 0.57;
    let panelY = (drawHeight - 80) * 0.5 + 60;
    let panelW = canvasWidth * 0.40 - 20;
    let panelH = (drawHeight - 80) * 0.5 - 20;

    // Background
    fill(250, 250, 255);
    stroke(180);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Info text
    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    let y = panelY + 10;
    let lineH = 20;

    text('Iteration: ' + iteration, panelX + 15, y);
    y += lineH;

    let currentLoss = computeLoss(theta1, theta2);
    text('Loss J(theta): ' + currentLoss.toFixed(6), panelX + 15, y);
    y += lineH;

    text('theta_1: ' + theta1.toFixed(4), panelX + 15, y);
    y += lineH;

    text('theta_2: ' + theta2.toFixed(4), panelX + 15, y);
    y += lineH;

    let grad = computeGradient(theta1, theta2);
    let gradMag = sqrt(grad.g1 * grad.g1 + grad.g2 * grad.g2);
    text('|grad J|: ' + gradMag.toFixed(6), panelX + 15, y);
    y += lineH;

    // Status
    if (converged) {
        fill(50, 150, 50);
        text('CONVERGED', panelX + 15, y);
    } else if (isRunning) {
        fill(200, 100, 50);
        text('Running...', panelX + 15, y);
    } else if (gradMag > 100) {
        fill(200, 50, 50);
        text('DIVERGING - reduce learning rate', panelX + 15, y);
    }

    pop();
}

function drawControlLabels() {
    push();
    resetMatrix();
    translate(-canvasWidth / 2, -canvasHeight / 2);

    fill(80);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);

    text('Learning Rate: ' + learningRate.toFixed(4), 10, drawHeight + 25);
    text('Loss Function:', 10, drawHeight + 60);

    pop();
}

// Loss function implementations
function computeLoss(t1, t2) {
    switch (lossFunctionType) {
        case 0:  // Quadratic bowl
            return t1 * t1 + t2 * t2;
        case 1:  // Rosenbrock
            let a = 1, b = 5;
            return (a - t1) * (a - t1) + b * (t2 - t1 * t1) * (t2 - t1 * t1);
        case 2:  // Saddle point
            return t1 * t1 - t2 * t2 + 0.5 * t2 * t2 * t2 * t2 / 10;
        default:
            return t1 * t1 + t2 * t2;
    }
}

function computeGradient(t1, t2) {
    switch (lossFunctionType) {
        case 0:  // Quadratic bowl
            return { g1: 2 * t1, g2: 2 * t2 };
        case 1:  // Rosenbrock
            let a = 1, b = 5;
            let g1 = -2 * (a - t1) - 4 * b * t1 * (t2 - t1 * t1);
            let g2 = 2 * b * (t2 - t1 * t1);
            return { g1: g1, g2: g2 };
        case 2:  // Saddle point
            return { g1: 2 * t1, g2: -2 * t2 + 2 * t2 * t2 * t2 / 10 };
        default:
            return { g1: 2 * t1, g2: 2 * t2 };
    }
}

function getMinimumPosition() {
    switch (lossFunctionType) {
        case 0:  // Quadratic
            return { t1: 0, t2: 0 };
        case 1:  // Rosenbrock
            return { t1: 1, t2: 1 };
        case 2:  // Saddle - no global min shown
            return { t1: 0, t2: 0 };
        default:
            return { t1: 0, t2: 0 };
    }
}

function doGradientStep() {
    let grad = computeGradient(theta1, theta2);

    // Update parameters
    theta1 = theta1 - learningRate * grad.g1;
    theta2 = theta2 - learningRate * grad.g2;

    // Constrain to visible range
    theta1 = constrain(theta1, -3, 3);
    theta2 = constrain(theta2, -3, 3);

    iteration++;

    // Record path
    let loss = computeLoss(theta1, theta2);
    path.push({ t1: theta1, t2: theta2, loss: loss });
    lossHistory.push(loss);

    // Limit history length
    if (path.length > maxHistoryLength) {
        path.shift();
    }
    if (lossHistory.length > maxHistoryLength) {
        lossHistory.shift();
    }

    // Check convergence
    let gradMag = sqrt(grad.g1 * grad.g1 + grad.g2 * grad.g2);
    if (gradMag < convergenceThreshold) {
        converged = true;
        isRunning = false;
        runButton.html('Run');
    }
}

function doStep() {
    if (!converged) {
        doGradientStep();
    }
}

function toggleRun() {
    if (converged) {
        doReset();
    }
    isRunning = !isRunning;
    runButton.html(isRunning ? 'Pause' : 'Run');
}

function doReset() {
    theta1 = -2.0;
    theta2 = 2.0;
    initializePath();
    iteration = 0;
    converged = false;
    isRunning = false;
    runButton.html('Run');
}

function initializePath() {
    path = [];
    lossHistory = [];
    let loss = computeLoss(theta1, theta2);
    path.push({ t1: theta1, t2: theta2, loss: loss });
    lossHistory.push(loss);
}

function onLrChange() {
    learningRate = pow(10, lrSlider.value() / 10);
}

function onLossChange() {
    let selected = lossSelect.value();
    if (selected === 'Quadratic Bowl') {
        lossFunctionType = 0;
    } else if (selected === 'Rosenbrock') {
        lossFunctionType = 1;
    } else if (selected === 'Saddle Point') {
        lossFunctionType = 2;
    }
    doReset();
}

function toggleView() {
    viewMode = (viewMode === '3d') ? 'contour' : '3d';
}

function mousePressed() {
    // Check if click is in contour plot area for starting point selection
    if (viewMode === 'contour') {
        let plotX = 30;
        let plotY = 40;
        let plotW = canvasWidth * 0.55 - 40;
        let plotH = drawHeight - 80;

        // Convert mouse to screen coords (accounting for WEBGL offset)
        let mx = mouseX;
        let my = mouseY;

        if (mx > plotX && mx < plotX + plotW && my > plotY && my < plotY + plotH) {
            let centerX = plotX + plotW / 2;
            let centerY = plotY + plotH / 2;
            let scale2D = min(plotW, plotH) / 6;

            theta1 = (mx - centerX) / scale2D;
            theta2 = -(my - centerY) / scale2D;

            theta1 = constrain(theta1, -3, 3);
            theta2 = constrain(theta2, -3, 3);

            initializePath();
            iteration = 0;
            converged = false;
            isRunning = false;
            runButton.html('Run');
        }
    }

    // Check if dragging in 3D view
    if (viewMode === '3d' && mouseY < drawHeight && mouseY > 0 && mouseX > 0 && mouseX < canvasWidth) {
        isDragging = true;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseDragged() {
    if (isDragging && viewMode === '3d') {
        let dx = mouseX - lastMouseX;
        let dy = mouseY - lastMouseY;

        rotY += dx * 0.01;
        rotX += dy * 0.01;

        rotX = constrain(rotX, -PI / 2, PI / 2);

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseReleased() {
    isDragging = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Update slider size
    lrSlider.size(150);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.max(600, Math.floor(container.width));
}
