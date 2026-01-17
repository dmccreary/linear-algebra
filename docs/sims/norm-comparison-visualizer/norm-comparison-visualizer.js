// Norm Comparison Visualizer MicroSim
// Learning Objective: Students will compare and contrast L1, L2, and L-infinity norms
// by observing unit circles and distance measurements for each norm type.

// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 100;

// Grid settings
let gridMin = -2.5;
let gridMax = 2.5;
let scale; // pixels per unit

// Selected point
let point = { x: 0.6, y: 0.8 };

// Display options
let showL1 = true;
let showL2 = true;
let showLinf = true;
let radius = 1;

// Animation
let animating = false;
let animPhase = 0;
let animNorm = 'L2'; // Which norm shape to animate around

// Dragging
let dragging = false;
let dragThreshold = 15;

// UI elements
let radiusSlider;
let l1Checkbox, l2Checkbox, linfCheckbox;
let animateButton;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();

    describe('Interactive comparison of L1, L2, and L-infinity norms showing unit shapes and distance measurements');
}

function createControls() {
    // Checkboxes for norm visibility
    l1Checkbox = createCheckbox(' L1 (Manhattan)', true);
    l1Checkbox.position(10, drawHeight + 15);
    l1Checkbox.changed(() => showL1 = l1Checkbox.checked());
    l1Checkbox.style('color', '#2ca02c');

    l2Checkbox = createCheckbox(' L2 (Euclidean)', true);
    l2Checkbox.position(10, drawHeight + 40);
    l2Checkbox.changed(() => showL2 = l2Checkbox.checked());
    l2Checkbox.style('color', '#1f77b4');

    linfCheckbox = createCheckbox(' L∞ (Maximum)', true);
    linfCheckbox.position(150, drawHeight + 15);
    linfCheckbox.changed(() => showLinf = linfCheckbox.checked());
    linfCheckbox.style('color', '#ff7f0e');

    // Radius slider
    radiusSlider = createSlider(0.5, 2, 1, 0.1);
    radiusSlider.position(sliderLeftMargin + 200, drawHeight + 50);
    radiusSlider.size(canvasWidth - sliderLeftMargin - 280);

    // Animate button
    animateButton = createButton('Animate');
    animateButton.position(150, drawHeight + 40);
    animateButton.mousePressed(startAnimation);
}

function startAnimation() {
    animating = true;
    animPhase = 0;
}

function draw() {
    // Update radius
    radius = radiusSlider.value();

    // Update animation
    if (animating) {
        animPhase += 0.02;
        if (animPhase >= TWO_PI) {
            animPhase = 0;
            animating = false;
        }
        // Move point around L2 unit circle
        point.x = radius * cos(animPhase);
        point.y = radius * sin(animPhase);
    }

    // Calculate scale
    scale = (min(canvasWidth, drawHeight) - 100) / (gridMax - gridMin);

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
    let centerX = canvasWidth / 2 - 70;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    drawGrid();
    drawAxes();

    // Draw unit shapes
    if (showLinf) drawLinfShape();
    if (showL1) drawL1Shape();
    if (showL2) drawL2Shape();

    // Draw point and measurements
    drawPoint();
    drawMeasurements();

    pop();

    // Draw title and info panel
    drawTitle();
    drawInfoPanel();
    drawControlLabels();
}

function drawGrid() {
    stroke(235);
    strokeWeight(1);

    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        // Vertical lines
        line(i * scale, gridMin * scale, i * scale, gridMax * scale);
        // Horizontal lines
        line(gridMin * scale, -i * scale, gridMax * scale, -i * scale);
    }

    // Minor grid lines
    stroke(245);
    for (let i = gridMin; i <= gridMax; i += 0.5) {
        if (i !== floor(i)) {
            line(i * scale, gridMin * scale, i * scale, gridMax * scale);
            line(gridMin * scale, -i * scale, gridMax * scale, -i * scale);
        }
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
    fill(100);
    textSize(14);
    textAlign(CENTER, TOP);
    noStroke();
    text('x', gridMax * scale + 15, 5);
    textAlign(RIGHT, CENTER);
    text('y', -10, -gridMax * scale);

    // Tick labels
    textSize(11);
    textAlign(CENTER, TOP);
    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        if (i !== 0) {
            text(i, i * scale, 5);
        }
    }
    textAlign(RIGHT, CENTER);
    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        if (i !== 0) {
            text(i, -5, -i * scale);
        }
    }
}

function drawL1Shape() {
    // Diamond shape: |x| + |y| = radius
    noFill();
    stroke(44, 160, 44); // Green
    strokeWeight(2);

    beginShape();
    vertex(radius * scale, 0);
    vertex(0, -radius * scale);
    vertex(-radius * scale, 0);
    vertex(0, radius * scale);
    endShape(CLOSE);

    // Fill with transparent
    fill(44, 160, 44, 30);
    noStroke();
    beginShape();
    vertex(radius * scale, 0);
    vertex(0, -radius * scale);
    vertex(-radius * scale, 0);
    vertex(0, radius * scale);
    endShape(CLOSE);
}

function drawL2Shape() {
    // Circle: sqrt(x² + y²) = radius
    noFill();
    stroke(31, 119, 180); // Blue
    strokeWeight(2);
    ellipse(0, 0, radius * 2 * scale, radius * 2 * scale);

    // Fill with transparent
    fill(31, 119, 180, 30);
    noStroke();
    ellipse(0, 0, radius * 2 * scale, radius * 2 * scale);
}

function drawLinfShape() {
    // Square: max(|x|, |y|) = radius
    noFill();
    stroke(255, 127, 14); // Orange
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, radius * 2 * scale, radius * 2 * scale);

    // Fill with transparent
    fill(255, 127, 14, 30);
    noStroke();
    rect(0, 0, radius * 2 * scale, radius * 2 * scale);
    rectMode(CORNER);
}

function drawPoint() {
    let px = point.x * scale;
    let py = -point.y * scale;

    // Line from origin to point
    stroke(80);
    strokeWeight(1);
    line(0, 0, px, py);

    // Point
    fill(50);
    noStroke();
    ellipse(px, py, 12, 12);

    // Draggable indicator
    noFill();
    stroke(50);
    strokeWeight(2);
    ellipse(px, py, 18, 18);

    // Coordinate label
    fill(50);
    textSize(12);
    textAlign(LEFT, BOTTOM);
    noStroke();
    text('(' + point.x.toFixed(2) + ', ' + point.y.toFixed(2) + ')', px + 10, py - 5);
}

function drawMeasurements() {
    // Draw dashed lines showing how each norm measures distance
    let px = point.x * scale;
    let py = -point.y * scale;

    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);

    // L1: Manhattan path (along axes)
    if (showL1) {
        stroke(44, 160, 44, 150);
        line(0, 0, px, 0);
        line(px, 0, px, py);
    }

    drawingContext.setLineDash([]);
}

function drawTitle() {
    fill(0);
    textSize(18);
    textAlign(CENTER, TOP);
    noStroke();
    text('Norm Comparison: Unit "Circles"', canvasWidth/2 - 70, 10);

    fill(100);
    textSize(11);
    text('Drag the point to explore', canvasWidth/2 - 70, 32);
}

function drawInfoPanel() {
    let panelX = canvasWidth - 150;
    let panelY = 50;
    let panelW = 140;
    let panelH = 180;

    // Panel background
    fill(255, 255, 255, 245);
    stroke(220);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Calculate norms
    let l1Norm = abs(point.x) + abs(point.y);
    let l2Norm = sqrt(point.x * point.x + point.y * point.y);
    let linfNorm = max(abs(point.x), abs(point.y));

    // Content
    fill(0);
    textSize(13);
    textAlign(LEFT, TOP);
    noStroke();

    let x = panelX + 10;
    let y = panelY + 10;

    text('Norm Values:', x, y);
    y += 25;

    // L1 norm
    fill(44, 160, 44);
    text('L1:', x, y);
    textAlign(RIGHT, TOP);
    text(l1Norm.toFixed(3), panelX + panelW - 10, y);
    y += 20;
    textAlign(LEFT, TOP);
    fill(100);
    textSize(10);
    text('|x| + |y|', x, y);
    y += 20;

    // L2 norm
    textSize(13);
    fill(31, 119, 180);
    text('L2:', x, y);
    textAlign(RIGHT, TOP);
    text(l2Norm.toFixed(3), panelX + panelW - 10, y);
    y += 20;
    textAlign(LEFT, TOP);
    fill(100);
    textSize(10);
    text('√(x² + y²)', x, y);
    y += 20;

    // L-infinity norm
    textSize(13);
    fill(255, 127, 14);
    text('L∞:', x, y);
    textAlign(RIGHT, TOP);
    text(linfNorm.toFixed(3), panelX + panelW - 10, y);
    y += 20;
    textAlign(LEFT, TOP);
    fill(100);
    textSize(10);
    text('max(|x|, |y|)', x, y);

    // Check if point is on any unit shape
    y += 25;
    textSize(11);
    if (abs(l1Norm - radius) < 0.05 && showL1) {
        fill(44, 160, 44);
        text('On L1 boundary!', x, y);
    } else if (abs(l2Norm - radius) < 0.05 && showL2) {
        fill(31, 119, 180);
        text('On L2 boundary!', x, y);
    } else if (abs(linfNorm - radius) < 0.05 && showLinf) {
        fill(255, 127, 14);
        text('On L∞ boundary!', x, y);
    }
}

function drawControlLabels() {
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();

    text('Radius: ' + radius.toFixed(1), sliderLeftMargin + 130, drawHeight + 60);
}

function mousePressed() {
    let centerX = canvasWidth / 2 - 70;
    let centerY = drawHeight / 2;

    let px = centerX + point.x * scale;
    let py = centerY - point.y * scale;

    if (dist(mouseX, mouseY, px, py) < dragThreshold && mouseY < drawHeight) {
        dragging = true;
    }
}

function mouseDragged() {
    if (dragging && mouseY < drawHeight) {
        let centerX = canvasWidth / 2 - 70;
        let centerY = drawHeight / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        // Constrain to grid
        gx = constrain(gx, gridMin + 0.1, gridMax - 0.1);
        gy = constrain(gy, gridMin + 0.1, gridMax - 0.1);

        point.x = gx;
        point.y = gy;
    }
}

function mouseReleased() {
    dragging = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition controls
    if (radiusSlider) {
        radiusSlider.position(sliderLeftMargin + 200, drawHeight + 50);
        radiusSlider.size(canvasWidth - sliderLeftMargin - 280);
    }
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(500, container.offsetWidth);
    }
}
