// Linear Combination Explorer MicroSim
// Learning Objective: Students will apply their understanding of linear combinations
// by adjusting scalar coefficients to reach target points and observe how span is generated.

// Canvas dimensions
let canvasWidth = 650;
let drawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 50;

// Grid settings
let gridMin = -6;
let gridMax = 6;
let scale;

// Basis vectors
let v1 = { x: 2, y: 1 };
let v2 = { x: 1, y: 2 };

// Coefficients
let c1 = 1;
let c2 = 1;

// Result vector (c1*v1 + c2*v2)
let result = { x: 0, y: 0 };

// Display options
let showSpan = true;
let showComponents = true;

// Challenge mode
let targetPoint = null;
let showSolution = false;

// Dragging
let dragging = null;
let dragThreshold = 15;

// UI elements
let c1Slider, c2Slider;
let spanCheckbox, componentsCheckbox;
let challengeButton, solutionButton, resetButton;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();
    calculateResult();

    describe('Interactive linear combination explorer with adjustable coefficients and target challenges');
}

function createControls() {
    // Coefficient sliders
    c1Slider = createSlider(-3, 3, 1, 0.1);
    c1Slider.position(sliderLeftMargin, drawHeight + 15);
    c1Slider.size(200);

    c2Slider = createSlider(-3, 3, 1, 0.1);
    c2Slider.position(sliderLeftMargin, drawHeight + 45);
    c2Slider.size(200);

    // Checkboxes
    spanCheckbox = createCheckbox(' Show Span', true);
    spanCheckbox.position(sliderLeftMargin + 220, drawHeight + 15);
    spanCheckbox.changed(() => showSpan = spanCheckbox.checked());

    componentsCheckbox = createCheckbox(' Show Components', true);
    componentsCheckbox.position(sliderLeftMargin + 220, drawHeight + 40);
    componentsCheckbox.changed(() => showComponents = componentsCheckbox.checked());

    // Buttons
    challengeButton = createButton('New Challenge');
    challengeButton.position(sliderLeftMargin + 220, drawHeight + 70);
    challengeButton.mousePressed(newChallenge);

    solutionButton = createButton('Show Solution');
    solutionButton.position(sliderLeftMargin + 330, drawHeight + 70);
    solutionButton.mousePressed(revealSolution);

    resetButton = createButton('Reset');
    resetButton.position(sliderLeftMargin + 220, drawHeight + 100);
    resetButton.mousePressed(resetAll);
}

function calculateResult() {
    result.x = c1 * v1.x + c2 * v2.x;
    result.y = c1 * v1.y + c2 * v2.y;
}

function newChallenge() {
    // Generate a random target point that's reachable
    let tc1 = random(-2.5, 2.5);
    let tc2 = random(-2.5, 2.5);
    tc1 = round(tc1 * 2) / 2; // Snap to 0.5
    tc2 = round(tc2 * 2) / 2;

    targetPoint = {
        x: tc1 * v1.x + tc2 * v2.x,
        y: tc1 * v1.y + tc2 * v2.y,
        c1: tc1,
        c2: tc2
    };
    showSolution = false;
}

function revealSolution() {
    if (targetPoint) {
        showSolution = true;
        // Also set sliders to solution
        c1Slider.value(targetPoint.c1);
        c2Slider.value(targetPoint.c2);
    }
}

function resetAll() {
    v1 = { x: 2, y: 1 };
    v2 = { x: 1, y: 2 };
    c1Slider.value(1);
    c2Slider.value(1);
    targetPoint = null;
    showSolution = false;
}

function draw() {
    // Update coefficients from sliders
    c1 = c1Slider.value();
    c2 = c2Slider.value();
    calculateResult();

    // Calculate scale
    scale = (min(canvasWidth - 180, drawHeight) - 60) / (gridMax - gridMin);

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
    let centerX = (canvasWidth - 160) / 2;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    // Check if vectors are parallel
    let isParallel = checkParallel();

    // Draw span visualization
    if (showSpan && !isParallel) {
        drawSpanRegion();
    } else if (showSpan && isParallel) {
        drawSpanLine();
    }

    drawGrid();
    drawAxes();

    // Draw target point if in challenge mode
    if (targetPoint) {
        drawTarget();
    }

    // Draw component arrows (tip-to-tail)
    if (showComponents) {
        drawComponentArrows();
    }

    // Draw basis vectors
    drawBasisVector(v1, color(220, 80, 80), 'v₁');
    drawBasisVector(v2, color(80, 80, 220), 'v₂');

    // Draw result vector
    drawResultVector();

    // Draw drag points for basis vectors
    drawDragPoint(v1.x, v1.y, color(220, 80, 80));
    drawDragPoint(v2.x, v2.y, color(80, 80, 220));

    pop();

    // Draw info panel
    drawInfoPanel();

    // Draw title
    drawTitle();

    // Draw control labels
    drawControlLabels();

    // Check if challenge is solved
    if (targetPoint && !showSolution) {
        checkChallengeSolved();
    }
}

function checkParallel() {
    // Two vectors are parallel if cross product is zero
    let cross = v1.x * v2.y - v1.y * v2.x;
    return abs(cross) < 0.001;
}

function drawSpanRegion() {
    // Draw a subtle shaded region indicating the span
    fill(200, 220, 255, 40);
    noStroke();
    // The span of two non-parallel vectors is the entire plane
    // We'll just show a large shaded area
    rect(-gridMax * scale, -gridMax * scale, gridMax * 2 * scale, gridMax * 2 * scale);
}

function drawSpanLine() {
    // When vectors are parallel, span is a line
    stroke(200, 100, 100, 100);
    strokeWeight(8);

    let mag = sqrt(v1.x * v1.x + v1.y * v1.y);
    if (mag > 0) {
        let dx = v1.x / mag * gridMax * scale;
        let dy = -v1.y / mag * gridMax * scale;
        line(-dx, -dy, dx, dy);
    }

    // Warning label
    push();
    resetMatrix();
    fill(200, 100, 100);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();
    text('⚠ Vectors parallel: span is a line!', 10, drawHeight - 25);
    pop();
}

function drawGrid() {
    stroke(235);
    strokeWeight(1);

    for (let i = gridMin; i <= gridMax; i++) {
        line(i * scale, gridMin * scale, i * scale, gridMax * scale);
        line(gridMin * scale, -i * scale, gridMax * scale, -i * scale);
    }
}

function drawAxes() {
    strokeWeight(2);
    stroke(180);

    // X-axis
    line(gridMin * scale, 0, gridMax * scale, 0);
    // Y-axis
    line(0, -gridMin * scale, 0, -gridMax * scale);

    // Tick labels
    fill(120);
    textSize(10);
    textAlign(CENTER, TOP);
    noStroke();
    for (let i = gridMin; i <= gridMax; i += 2) {
        if (i !== 0) text(i, i * scale, 5);
    }
    textAlign(RIGHT, CENTER);
    for (let i = gridMin; i <= gridMax; i += 2) {
        if (i !== 0) text(i, -5, -i * scale);
    }
}

function drawTarget() {
    let tx = targetPoint.x * scale;
    let ty = -targetPoint.y * scale;

    // Draw star
    push();
    translate(tx, ty);
    fill(255, 220, 0);
    stroke(200, 150, 0);
    strokeWeight(2);
    drawStar(0, 0, 8, 16, 5);
    pop();

    // Label
    fill(200, 150, 0);
    textSize(11);
    textAlign(LEFT, BOTTOM);
    noStroke();
    text('Target', tx + 15, ty - 5);
}

function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = -PI/2; a < TWO_PI - PI/2; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawComponentArrows() {
    // c1*v1 from origin
    let c1v1x = c1 * v1.x * scale;
    let c1v1y = -c1 * v1.y * scale;

    // c2*v2 from tip of c1*v1
    let c2v2x = c2 * v2.x * scale;
    let c2v2y = -c2 * v2.y * scale;

    // Draw c1*v1 (lighter red)
    stroke(220, 150, 150);
    strokeWeight(2);
    line(0, 0, c1v1x, c1v1y);
    drawArrowHead(c1v1x, c1v1y, atan2(c1v1y, c1v1x), color(220, 150, 150));

    // Draw c2*v2 from tip of c1*v1 (lighter blue)
    stroke(150, 150, 220);
    strokeWeight(2);
    line(c1v1x, c1v1y, c1v1x + c2v2x, c1v1y + c2v2y);
    drawArrowHead(c1v1x + c2v2x, c1v1y + c2v2y, atan2(c2v2y, c2v2x), color(150, 150, 220));
}

function drawBasisVector(v, col, label) {
    let vx = v.x * scale;
    let vy = -v.y * scale;

    stroke(col);
    strokeWeight(2);
    line(0, 0, vx, vy);
    drawArrowHead(vx, vy, atan2(vy, vx), col);

    // Label
    fill(col);
    textSize(14);
    textAlign(CENTER, CENTER);
    noStroke();
    let labelOffset = 20;
    let angle = atan2(vy, vx);
    text(label, vx + cos(angle) * labelOffset, vy + sin(angle) * labelOffset);
}

function drawResultVector() {
    let rx = result.x * scale;
    let ry = -result.y * scale;

    stroke(50, 180, 50);
    strokeWeight(4);
    line(0, 0, rx, ry);
    drawArrowHead(rx, ry, atan2(ry, rx), color(50, 180, 50));

    // Endpoint
    fill(50, 180, 50);
    noStroke();
    ellipse(rx, ry, 10, 10);
}

function drawArrowHead(x, y, angle, col) {
    push();
    translate(x, y);
    rotate(angle);
    fill(col);
    noStroke();
    triangle(0, 0, -10, -5, -10, 5);
    pop();
}

function drawDragPoint(x, y, col) {
    let sx = x * scale;
    let sy = -y * scale;

    noFill();
    stroke(col);
    strokeWeight(2);
    ellipse(sx, sy, 14, 14);

    fill(255);
    noStroke();
    ellipse(sx, sy, 8, 8);
}

function drawInfoPanel() {
    let panelX = canvasWidth - 155;
    let panelY = 10;
    let panelW = 145;
    let panelH = 200;

    // Panel background
    fill(255, 255, 255, 245);
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

    text('Linear Combination:', x, y);
    y += 20;

    // Equation
    fill(50, 180, 50);
    textSize(11);
    text('c₁v₁ + c₂v₂ = result', x, y);
    y += 25;

    // v1 info
    fill(220, 80, 80);
    text('v₁ = (' + v1.x.toFixed(1) + ', ' + v1.y.toFixed(1) + ')', x, y);
    y += 15;
    text('c₁ = ' + c1.toFixed(1), x, y);
    y += 20;

    // v2 info
    fill(80, 80, 220);
    text('v₂ = (' + v2.x.toFixed(1) + ', ' + v2.y.toFixed(1) + ')', x, y);
    y += 15;
    text('c₂ = ' + c2.toFixed(1), x, y);
    y += 25;

    // Result
    fill(50, 180, 50);
    text('Result:', x, y);
    y += 15;
    text('(' + result.x.toFixed(1) + ', ' + result.y.toFixed(1) + ')', x, y);

    // Challenge status
    if (targetPoint) {
        y += 25;
        fill(200, 150, 0);
        let dist = sqrt(sq(result.x - targetPoint.x) + sq(result.y - targetPoint.y));
        if (dist < 0.15) {
            fill(50, 180, 50);
            text('✓ Target reached!', x, y);
        } else {
            text('Distance: ' + dist.toFixed(2), x, y);
        }
    }
}

function drawTitle() {
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    noStroke();
    text('Linear Combination Explorer', 10, 10);

    fill(100);
    textSize(11);
    text('Drag basis vector endpoints', 10, 32);
}

function drawControlLabels() {
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();

    text('c₁: ' + c1.toFixed(1), 10, drawHeight + 25);
    text('c₂: ' + c2.toFixed(1), 10, drawHeight + 55);
}

function checkChallengeSolved() {
    let dist = sqrt(sq(result.x - targetPoint.x) + sq(result.y - targetPoint.y));
    // Visual feedback handled in info panel
}

function mousePressed() {
    let centerX = (canvasWidth - 160) / 2;
    let centerY = drawHeight / 2;

    // Check v1
    let v1sx = centerX + v1.x * scale;
    let v1sy = centerY - v1.y * scale;
    if (dist(mouseX, mouseY, v1sx, v1sy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'v1';
        return;
    }

    // Check v2
    let v2sx = centerX + v2.x * scale;
    let v2sy = centerY - v2.y * scale;
    if (dist(mouseX, mouseY, v2sx, v2sy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'v2';
        return;
    }
}

function mouseDragged() {
    if (dragging && mouseY < drawHeight) {
        let centerX = (canvasWidth - 160) / 2;
        let centerY = drawHeight / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        // Snap to 0.5
        gx = round(gx * 2) / 2;
        gy = round(gy * 2) / 2;

        // Constrain
        gx = constrain(gx, -5, 5);
        gy = constrain(gy, -5, 5);

        // Prevent zero vector
        if (abs(gx) < 0.1 && abs(gy) < 0.1) {
            gx = 0.5;
        }

        if (dragging === 'v1') {
            v1.x = gx;
            v1.y = gy;
        } else if (dragging === 'v2') {
            v2.x = gx;
            v2.y = gy;
        }
    }
}

function mouseReleased() {
    dragging = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition controls
    if (c1Slider) c1Slider.size(min(200, canvasWidth - 300));
    if (c2Slider) c2Slider.size(min(200, canvasWidth - 300));
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(550, container.offsetWidth);
    }
}
