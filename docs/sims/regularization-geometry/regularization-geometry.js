// Regularization Geometry Visualizer MicroSim
// Learning Objective: Understand how L1 and L2 regularization constrain weights
// geometrically and why L1 produces sparsity

// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

// Grid settings
let gridMin = -5;
let gridMax = 5;
let scale; // pixels per unit

// OLS solution (can be dragged)
let olsSolution = { x: 3, y: 2 };

// Ellipse parameters (loss function contours)
let ellipseA = 1.2; // x scaling
let ellipseB = 0.8; // y scaling
let ellipseRotation = -0.3; // rotation angle

// Regularization parameters
let alpha = 1.5; // regularization strength
let regType = 'L2'; // 'L1' or 'L2'

// Animation
let animating = false;
let animAlpha = 0;
let animSpeed = 0.03;

// Regularization path
let showPath = false;
let pathPoints = [];

// Dragging
let draggingOLS = false;
let dragThreshold = 15;

// Current regularized solution
let regSolution = { x: 0, y: 0 };

// UI elements
let alphaSlider;
let l1Button, l2Button;
let pathCheckbox;
let animateButton;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();
    computeRegularizationPath();
    updateRegularizedSolution();

    describe('Interactive visualization of L1 and L2 regularization geometry showing how constraint regions intersect loss contours');
}

function createControls() {
    // Alpha slider
    alphaSlider = createSlider(0.1, 4, 1.5, 0.1);
    alphaSlider.position(80, drawHeight + 15);
    alphaSlider.size(150);
    alphaSlider.input(() => {
        alpha = alphaSlider.value();
        updateRegularizedSolution();
    });

    // L1/L2 toggle buttons
    l1Button = createButton('L1 (Lasso)');
    l1Button.position(280, drawHeight + 12);
    l1Button.mousePressed(() => {
        regType = 'L1';
        computeRegularizationPath();
        updateRegularizedSolution();
    });

    l2Button = createButton('L2 (Ridge)');
    l2Button.position(370, drawHeight + 12);
    l2Button.mousePressed(() => {
        regType = 'L2';
        computeRegularizationPath();
        updateRegularizedSolution();
    });

    // Show path checkbox
    pathCheckbox = createCheckbox(' Show Regularization Path', false);
    pathCheckbox.position(280, drawHeight + 45);
    pathCheckbox.changed(() => {
        showPath = pathCheckbox.checked();
    });

    // Animate button
    animateButton = createButton('Animate');
    animateButton.position(470, drawHeight + 45);
    animateButton.mousePressed(startAnimation);
}

function startAnimation() {
    animating = true;
    animAlpha = 0.1;
    showPath = true;
    pathCheckbox.checked(true);
}

function computeRegularizationPath() {
    pathPoints = [];
    for (let a = 0.1; a <= 5; a += 0.1) {
        let sol = computeConstrainedSolution(a);
        pathPoints.push({ alpha: a, x: sol.x, y: sol.y });
    }
}

function computeConstrainedSolution(constraintRadius) {
    // Find intersection of loss contours with constraint region
    // This is an approximation using gradient descent toward origin constrained to region

    let x = olsSolution.x;
    let y = olsSolution.y;

    if (regType === 'L2') {
        // L2: project onto circle if outside
        let dist = sqrt(x * x + y * y);
        if (dist > constraintRadius) {
            x = (x / dist) * constraintRadius;
            y = (y / dist) * constraintRadius;
        }
    } else {
        // L1: project onto diamond if outside
        let l1Dist = abs(x) + abs(y);
        if (l1Dist > constraintRadius) {
            // Find the point on the diamond that minimizes distance to ellipse center
            // Simplified: scale down proportionally
            let scaleFactor = constraintRadius / l1Dist;
            x = x * scaleFactor;
            y = y * scaleFactor;

            // For L1, solution tends to hit corners (axis)
            // Simulate this behavior for low constraint radius
            if (constraintRadius < sqrt(olsSolution.x * olsSolution.x + olsSolution.y * olsSolution.y) * 0.6) {
                // Determine which axis is closer to the solution direction
                if (abs(olsSolution.x) > abs(olsSolution.y)) {
                    // Solution moves toward x-axis
                    let signX = olsSolution.x >= 0 ? 1 : -1;
                    x = signX * constraintRadius;
                    y = 0;
                } else {
                    // Solution moves toward y-axis
                    let signY = olsSolution.y >= 0 ? 1 : -1;
                    x = 0;
                    y = signY * constraintRadius;
                }
            }
        }
    }

    return { x: x, y: y };
}

function updateRegularizedSolution() {
    regSolution = computeConstrainedSolution(alpha);
}

function draw() {
    // Update animation
    if (animating) {
        animAlpha += animSpeed;
        alpha = animAlpha;
        alphaSlider.value(alpha);
        updateRegularizedSolution();

        if (animAlpha >= 4) {
            animating = false;
        }
    }

    // Calculate scale
    let plotSize = min(canvasWidth - 200, drawHeight - 60);
    scale = plotSize / (gridMax - gridMin);

    // Background
    background(248);

    // Drawing area
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

    // Draw main content
    push();
    let centerX = canvasWidth / 2 - 80;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    drawGrid();
    drawAxes();

    // Draw loss contours (ellipses centered at OLS solution)
    drawLossContours();

    // Draw constraint region
    drawConstraintRegion();

    // Draw regularization path
    if (showPath) {
        drawRegularizationPath();
    }

    // Draw solutions
    drawOLSSolution();
    drawRegularizedSolution();

    pop();

    // Draw title and info panel
    drawTitle();
    drawInfoPanel();
    drawControlLabels();
    updateButtonStyles();
}

function drawGrid() {
    stroke(240);
    strokeWeight(1);

    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        // Vertical lines
        line(i * scale, gridMin * scale, i * scale, gridMax * scale);
        // Horizontal lines
        line(gridMin * scale, -i * scale, gridMax * scale, -i * scale);
    }
}

function drawAxes() {
    strokeWeight(2);
    stroke(150);

    // X-axis
    line(gridMin * scale, 0, gridMax * scale, 0);
    // Y-axis
    line(0, -gridMin * scale, 0, -gridMax * scale);

    // Axis labels
    fill(80);
    textSize(14);
    textAlign(CENTER, TOP);
    noStroke();
    text('\u03B8\u2081', gridMax * scale + 15, 5);
    textAlign(RIGHT, CENTER);
    text('\u03B8\u2082', -10, -gridMax * scale + 5);

    // Tick labels
    textSize(10);
    textAlign(CENTER, TOP);
    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        if (i !== 0 && i % 2 === 0) {
            text(i, i * scale, 5);
        }
    }
    textAlign(RIGHT, CENTER);
    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        if (i !== 0 && i % 2 === 0) {
            text(i, -5, -i * scale);
        }
    }
}

function drawLossContours() {
    // Draw elliptical contours centered at OLS solution
    noFill();

    let cx = olsSolution.x * scale;
    let cy = -olsSolution.y * scale;

    push();
    translate(cx, cy);
    rotate(ellipseRotation);

    // Draw multiple contour levels
    let contourLevels = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
    for (let level of contourLevels) {
        let distToOrigin = sqrt(olsSolution.x * olsSolution.x + olsSolution.y * olsSolution.y);

        // Highlight the contour that passes through the regularized solution
        let regDist = sqrt(pow(regSolution.x - olsSolution.x, 2) + pow(regSolution.y - olsSolution.y, 2));
        let isActive = abs(level - regDist) < 0.3;

        if (isActive) {
            stroke(200, 50, 50, 200);
            strokeWeight(2);
        } else {
            stroke(200, 100, 100, 80);
            strokeWeight(1);
        }

        let w = level * ellipseA * scale * 2;
        let h = level * ellipseB * scale * 2;
        ellipse(0, 0, w, h);
    }

    pop();
}

function drawConstraintRegion() {
    let constraintRadius = alpha * scale;

    if (regType === 'L2') {
        // L2: Circle
        noFill();
        stroke(31, 119, 180);
        strokeWeight(3);
        ellipse(0, 0, constraintRadius * 2, constraintRadius * 2);

        // Fill with transparent
        fill(31, 119, 180, 30);
        noStroke();
        ellipse(0, 0, constraintRadius * 2, constraintRadius * 2);
    } else {
        // L1: Diamond
        noFill();
        stroke(44, 160, 44);
        strokeWeight(3);

        beginShape();
        vertex(constraintRadius, 0);
        vertex(0, -constraintRadius);
        vertex(-constraintRadius, 0);
        vertex(0, constraintRadius);
        endShape(CLOSE);

        // Fill with transparent
        fill(44, 160, 44, 30);
        noStroke();
        beginShape();
        vertex(constraintRadius, 0);
        vertex(0, -constraintRadius);
        vertex(-constraintRadius, 0);
        vertex(0, constraintRadius);
        endShape(CLOSE);
    }
}

function drawRegularizationPath() {
    // Draw path from OLS solution to origin
    stroke(128, 0, 128, 150);
    strokeWeight(2);
    noFill();

    beginShape();
    for (let pt of pathPoints) {
        vertex(pt.x * scale, -pt.y * scale);
    }
    endShape();

    // Draw small dots along path
    fill(128, 0, 128, 100);
    noStroke();
    for (let i = 0; i < pathPoints.length; i += 3) {
        let pt = pathPoints[i];
        ellipse(pt.x * scale, -pt.y * scale, 4, 4);
    }
}

function drawOLSSolution() {
    let px = olsSolution.x * scale;
    let py = -olsSolution.y * scale;

    // OLS point
    fill(200, 50, 50);
    noStroke();
    ellipse(px, py, 14, 14);

    // Draggable indicator
    noFill();
    stroke(200, 50, 50);
    strokeWeight(2);
    ellipse(px, py, 20, 20);

    // Label
    fill(200, 50, 50);
    textSize(12);
    textAlign(LEFT, BOTTOM);
    noStroke();
    text('OLS', px + 12, py - 5);
}

function drawRegularizedSolution() {
    let px = regSolution.x * scale;
    let py = -regSolution.y * scale;

    // Regularized point
    let color = regType === 'L2' ? [31, 119, 180] : [44, 160, 44];
    fill(color[0], color[1], color[2]);
    noStroke();
    ellipse(px, py, 14, 14);

    // White center
    fill(255);
    ellipse(px, py, 6, 6);

    // Label
    fill(color[0], color[1], color[2]);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();
    text(regType, px + 10, py + 5);
}

function drawTitle() {
    fill(0);
    textSize(16);
    textAlign(CENTER, TOP);
    noStroke();
    text('Regularization Geometry: ' + regType + ' Constraint', canvasWidth/2 - 80, 10);

    fill(100);
    textSize(11);
    text('Drag the red OLS point to explore', canvasWidth/2 - 80, 30);
}

function drawInfoPanel() {
    let panelX = canvasWidth - 165;
    let panelY = 50;
    let panelW = 155;
    let panelH = 220;

    // Panel background
    fill(255, 255, 255, 250);
    stroke(220);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Content
    fill(0);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();

    let x = panelX + 10;
    let y = panelY + 10;

    text('Weight Values:', x, y);
    y += 22;

    // OLS values
    fill(200, 50, 50);
    textSize(11);
    text('OLS Solution:', x, y);
    y += 16;
    fill(60);
    text('\u03B8\u2081 = ' + olsSolution.x.toFixed(2), x + 10, y);
    y += 14;
    text('\u03B8\u2082 = ' + olsSolution.y.toFixed(2), x + 10, y);
    y += 22;

    // Regularized values
    let color = regType === 'L2' ? [31, 119, 180] : [44, 160, 44];
    fill(color[0], color[1], color[2]);
    text(regType + ' Solution:', x, y);
    y += 16;
    fill(60);
    text('\u03B8\u2081 = ' + regSolution.x.toFixed(2), x + 10, y);
    y += 14;
    text('\u03B8\u2082 = ' + regSolution.y.toFixed(2), x + 10, y);
    y += 22;

    // Sparsity indicator for L1
    if (regType === 'L1') {
        fill(44, 160, 44);
        textSize(11);
        text('Sparsity:', x, y);
        y += 16;
        fill(60);
        let sparseCount = 0;
        if (abs(regSolution.x) < 0.01) sparseCount++;
        if (abs(regSolution.y) < 0.01) sparseCount++;
        text(sparseCount + ' of 2 weights = 0', x + 10, y);

        if (sparseCount > 0) {
            y += 18;
            fill(44, 160, 44);
            textSize(10);
            text('Sparse solution!', x, y);
        }
    } else {
        fill(31, 119, 180);
        textSize(11);
        text('Shrinkage:', x, y);
        y += 16;
        fill(60);
        let shrinkage = 1 - sqrt(regSolution.x*regSolution.x + regSolution.y*regSolution.y) /
                           sqrt(olsSolution.x*olsSolution.x + olsSolution.y*olsSolution.y);
        shrinkage = max(0, shrinkage);
        text((shrinkage * 100).toFixed(1) + '% reduction', x + 10, y);
    }

    // Constraint value
    y += 22;
    fill(100);
    textSize(10);
    let constraintVal = regType === 'L2' ?
        sqrt(regSolution.x*regSolution.x + regSolution.y*regSolution.y).toFixed(2) :
        (abs(regSolution.x) + abs(regSolution.y)).toFixed(2);
    text(regType + ' norm: ' + constraintVal, x, y);
}

function drawControlLabels() {
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();

    text('\u03B1: ' + alpha.toFixed(1), 10, drawHeight + 25);
}

function updateButtonStyles() {
    if (regType === 'L1') {
        l1Button.style('background-color', '#2ca02c');
        l1Button.style('color', 'white');
        l2Button.style('background-color', '#f0f0f0');
        l2Button.style('color', 'black');
    } else {
        l2Button.style('background-color', '#1f77b4');
        l2Button.style('color', 'white');
        l1Button.style('background-color', '#f0f0f0');
        l1Button.style('color', 'black');
    }
}

function mousePressed() {
    let centerX = canvasWidth / 2 - 80;
    let centerY = drawHeight / 2;

    let px = centerX + olsSolution.x * scale;
    let py = centerY - olsSolution.y * scale;

    if (dist(mouseX, mouseY, px, py) < dragThreshold && mouseY < drawHeight) {
        draggingOLS = true;
    }
}

function mouseDragged() {
    if (draggingOLS && mouseY < drawHeight) {
        let centerX = canvasWidth / 2 - 80;
        let centerY = drawHeight / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        // Constrain to grid
        gx = constrain(gx, gridMin + 0.5, gridMax - 0.5);
        gy = constrain(gy, gridMin + 0.5, gridMax - 0.5);

        olsSolution.x = gx;
        olsSolution.y = gy;

        computeRegularizationPath();
        updateRegularizedSolution();
    }
}

function mouseReleased() {
    draggingOLS = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition controls
    if (alphaSlider) {
        alphaSlider.position(80, drawHeight + 15);
    }
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(550, container.offsetWidth);
    }
}
