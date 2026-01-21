// Complex Eigenvalue Visualizer
// Shows how complex eigenvalues correspond to rotation-scaling transformations

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 50;

// Eigenvalue: λ = a + bi
let realPart = 0.9;
let imagPart = 0.4;

// Animation
let stepCount = 0;
let maxSteps = 50;
let isAnimating = false;
let animationSpeed = 1;

// Transformation history (for spiral)
let transformHistory = [];

// Layout
let leftPanelWidth, rightPanelWidth;
let leftOriginX, leftOriginY;
let rightOriginX, rightOriginY;
let gridScale = 35;

// Controls
let realSlider, imagSlider;
let animateButton, resetButton;
let showConjugateCheckbox;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    calculateLayout();

    // Create controls
    realSlider = createSlider(-2, 2, realPart, 0.05);
    realSlider.position(sliderLeftMargin, drawHeight + 10);
    realSlider.size((canvasWidth - sliderLeftMargin - margin) / 2 - 10);

    imagSlider = createSlider(-2, 2, imagPart, 0.05);
    imagSlider.position(canvasWidth/2 + 20, drawHeight + 10);
    imagSlider.size((canvasWidth - sliderLeftMargin - margin) / 2 - 10);

    animateButton = createButton('Animate');
    animateButton.position(10, drawHeight + 45);
    animateButton.mousePressed(toggleAnimation);

    resetButton = createButton('Reset');
    resetButton.position(80, drawHeight + 45);
    resetButton.mousePressed(resetAnimation);

    showConjugateCheckbox = createCheckbox(' Show Conjugate', true);
    showConjugateCheckbox.position(140, drawHeight + 45);
    showConjugateCheckbox.style('font-size', '13px');

    resetAnimation();

    describe('Complex eigenvalue visualizer showing how complex eigenvalues produce rotation-scaling transformations in 2D', LABEL);
}

function calculateLayout() {
    leftPanelWidth = canvasWidth * 0.55;
    rightPanelWidth = canvasWidth * 0.45;

    leftOriginX = leftPanelWidth / 2;
    leftOriginY = drawHeight / 2;

    rightOriginX = leftPanelWidth + rightPanelWidth / 2;
    rightOriginY = drawHeight / 2 - 30;
}

function draw() {
    updateCanvasSize();
    calculateLayout();

    // Drawing area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Get slider values
    realPart = realSlider.value();
    imagPart = imagSlider.value();

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('Complex Eigenvalue Visualizer', canvasWidth / 2, 8);

    // Draw left panel (transformation view)
    drawTransformationPanel();

    // Draw right panel (complex plane)
    drawComplexPlane();

    // Draw eigenvalue info
    drawEigenvalueInfo();

    // Animation
    if (isAnimating) {
        if (frameCount % (5 - animationSpeed) === 0 && stepCount < maxSteps) {
            stepCount++;
            updateTransformHistory();
        }
    }

    // Control labels
    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Re:', 10, drawHeight + 22);
    text('Im:', canvasWidth/2 - 10, drawHeight + 22);
}

function drawTransformationPanel() {
    // Panel title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Transformation View', leftOriginX, 28);

    // Grid
    stroke(230);
    strokeWeight(1);
    for (let i = -4; i <= 4; i++) {
        let x = leftOriginX + i * gridScale;
        let y = leftOriginY + i * gridScale;
        if (x > 0 && x < leftPanelWidth) {
            line(x, 45, x, drawHeight - 30);
        }
        if (y > 45 && y < drawHeight - 30) {
            line(5, y, leftPanelWidth - 5, y);
        }
    }

    // Axes
    stroke(150);
    strokeWeight(1);
    line(5, leftOriginY, leftPanelWidth - 5, leftOriginY);
    line(leftOriginX, 45, leftOriginX, drawHeight - 30);

    // Unit circle
    stroke(200);
    strokeWeight(1);
    noFill();
    ellipse(leftOriginX, leftOriginY, gridScale * 2, gridScale * 2);

    // Draw spiral trajectory
    if (transformHistory.length > 1) {
        stroke(100, 180, 100, 150);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let p of transformHistory) {
            let sx = leftOriginX + p.x * gridScale;
            let sy = leftOriginY - p.y * gridScale;
            vertex(sx, sy);
        }
        endShape();
    }

    // Draw current point
    if (transformHistory.length > 0) {
        let current = transformHistory[transformHistory.length - 1];
        let cx = leftOriginX + current.x * gridScale;
        let cy = leftOriginY - current.y * gridScale;

        // Line from origin
        stroke(33, 150, 243);
        strokeWeight(2);
        line(leftOriginX, leftOriginY, cx, cy);

        // Point
        fill(33, 150, 243);
        noStroke();
        ellipse(cx, cy, 12, 12);
    }

    // Starting point indicator
    let startX = leftOriginX + gridScale;
    let startY = leftOriginY;
    fill(244, 67, 54);
    noStroke();
    ellipse(startX, startY, 10, 10);

    // Legend
    fill(100);
    textSize(9);
    textAlign(LEFT, TOP);
    text('Start: (1, 0)', 10, drawHeight - 25);
    text('Step: ' + stepCount, 10, drawHeight - 12);
}

function drawComplexPlane() {
    let panelX = leftPanelWidth + 5;
    let panelW = rightPanelWidth - 10;
    let panelH = 200;
    let panelY = 45;

    // Background
    fill(255, 255, 255, 200);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Title
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('Complex Plane', rightOriginX, panelY + 5);

    // Axes
    let scale = 40;
    let centerX = rightOriginX;
    let centerY = panelY + panelH / 2 + 10;

    stroke(180);
    strokeWeight(1);
    // Real axis
    line(panelX + 10, centerY, panelX + panelW - 10, centerY);
    // Imaginary axis
    line(centerX, panelY + 25, centerX, panelY + panelH - 10);

    // Axis labels
    fill(100);
    textSize(9);
    textAlign(CENTER, TOP);
    text('Real', panelX + panelW - 20, centerY + 3);
    textAlign(RIGHT, CENTER);
    text('Im', centerX - 5, panelY + 30);

    // Unit circle
    stroke(220);
    strokeWeight(1);
    noFill();
    ellipse(centerX, centerY, scale * 2, scale * 2);

    // Plot eigenvalue λ = a + bi
    let evX = centerX + realPart * scale;
    let evY = centerY - imagPart * scale;

    // Dashed lines to axes
    stroke(150, 150);
    strokeWeight(1);
    drawDashedLine(evX, evY, evX, centerY);
    drawDashedLine(evX, evY, centerX, evY);

    // Magnitude circle
    let mag = sqrt(realPart * realPart + imagPart * imagPart);
    if (mag > 0.1) {
        stroke(33, 150, 243, 100);
        strokeWeight(1);
        noFill();
        ellipse(centerX, centerY, mag * scale * 2, mag * scale * 2);
    }

    // Angle arc
    if (imagPart !== 0 || realPart !== 0) {
        let angle = atan2(imagPart, realPart);
        stroke(255, 150, 50, 150);
        strokeWeight(2);
        noFill();
        arc(centerX, centerY, scale * 0.6, scale * 0.6, -angle, 0);

        // Angle label
        fill(255, 150, 50);
        textSize(9);
        textAlign(LEFT, CENTER);
        let labelX = centerX + cos(-angle/2) * scale * 0.5;
        let labelY = centerY + sin(-angle/2) * scale * 0.5;
        text('θ', labelX, labelY);
    }

    // Eigenvalue point
    fill(244, 67, 54);
    noStroke();
    ellipse(evX, evY, 10, 10);

    // Label
    fill(200, 50, 50);
    textSize(9);
    textAlign(LEFT, TOP);
    text('λ', evX + 6, evY - 12);

    // Conjugate
    if (showConjugateCheckbox.checked() && abs(imagPart) > 0.01) {
        let conjY = centerY + imagPart * scale;
        fill(67, 160, 244);
        noStroke();
        ellipse(evX, conjY, 10, 10);

        fill(50, 100, 200);
        textSize(9);
        text('λ̄', evX + 6, conjY - 12);
    }
}

function drawEigenvalueInfo() {
    let infoX = leftPanelWidth + 10;
    let infoY = 260;
    let infoW = rightPanelWidth - 20;
    let infoH = drawHeight - infoY - 10;

    // Background
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(infoX, infoY, infoW, infoH, 8);

    // Content
    fill(0);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);

    let y = infoY + 8;
    let lineH = 14;

    // Eigenvalue
    text('λ = ' + realPart.toFixed(2) + (imagPart >= 0 ? ' + ' : ' - ') + abs(imagPart).toFixed(2) + 'i', infoX + 8, y);
    y += lineH + 5;

    // Magnitude
    let mag = sqrt(realPart * realPart + imagPart * imagPart);
    text('|λ| = ' + mag.toFixed(3), infoX + 8, y);
    y += lineH;

    // Angle
    let angle = atan2(imagPart, realPart);
    text('θ = ' + (angle * 180 / PI).toFixed(1) + '°', infoX + 8, y);
    y += lineH + 5;

    // Behavior
    fill(80);
    textSize(9);
    if (mag > 1) {
        fill(200, 50, 50);
        text('|λ| > 1: Spiral outward', infoX + 8, y);
    } else if (mag < 1) {
        fill(50, 150, 50);
        text('|λ| < 1: Spiral inward', infoX + 8, y);
    } else {
        fill(33, 150, 243);
        text('|λ| = 1: Pure rotation', infoX + 8, y);
    }
    y += lineH;

    fill(80);
    if (abs(imagPart) < 0.01) {
        text('Im(λ) ≈ 0: No rotation', infoX + 8, y);
    } else {
        text('Im(λ) ≠ 0: Rotation ' + (imagPart > 0 ? 'CCW' : 'CW'), infoX + 8, y);
    }
}

function drawDashedLine(x1, y1, x2, y2) {
    let steps = 10;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
    }
}

function updateTransformHistory() {
    // Apply transformation: multiply by λ in complex form
    // (a + bi)(x + yi) = (ax - by) + (ay + bx)i
    let last = transformHistory[transformHistory.length - 1];
    let newX = realPart * last.x - imagPart * last.y;
    let newY = realPart * last.y + imagPart * last.x;
    transformHistory.push({ x: newX, y: newY });
}

function toggleAnimation() {
    isAnimating = !isAnimating;
    animateButton.html(isAnimating ? 'Pause' : 'Animate');
}

function resetAnimation() {
    stepCount = 0;
    transformHistory = [{ x: 1, y: 0 }];
    isAnimating = false;
    animateButton.html('Animate');
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    realSlider.size((canvasWidth - sliderLeftMargin - margin) / 2 - 10);
    imagSlider.position(canvasWidth/2 + 20, drawHeight + 10);
    imagSlider.size((canvasWidth - sliderLeftMargin - margin) / 2 - 10);
    calculateLayout();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
