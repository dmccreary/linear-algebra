// Orthonormal Basis Coordinate Finder MicroSim
// Learning Objective: Demonstrate how orthonormal bases simplify finding coordinates via inner products
// Shows that coordinates are simply inner products: c_i = <v, q_i>

// Canvas dimensions
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

// Grid settings
let gridMin = -5;
let gridMax = 5;
let scale; // pixels per unit

// Orthonormal basis vectors (always unit length and perpendicular)
let basisAngle = PI / 4; // 45 degrees rotation from standard basis
let q1 = { x: 0, y: 0 };
let q2 = { x: 0, y: 0 };

// Target vector
let v = { x: 3, y: 2 };

// Coordinates in orthonormal basis
let c1 = 0;
let c2 = 0;

// Standard basis coordinates (same as v.x, v.y)
// For comparison with non-orthonormal method

// Display options
let showProjections = true;
let showStandardComparison = false;

// Dragging
let dragging = null;
let dragThreshold = 15;

// UI elements
let angleSlider, angleLabel;
let projectionsCheckbox, comparisonCheckbox;
let resetButton;

// Colors
const colorQ1 = [220, 80, 80];    // Red for q1
const colorQ2 = [80, 80, 220];    // Blue for q2
const colorV = [50, 150, 50];     // Green for v
const colorProj = [255, 150, 0];  // Orange for projections
const colorStdBasis = [180, 180, 180]; // Gray for standard basis

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    updateBasisVectors();
    computeCoordinates();

    createControls();

    describe('Interactive visualization showing how orthonormal bases simplify coordinate finding via inner products');
}

function createControls() {
    const container = document.querySelector('main');

    // Angle slider for basis rotation
    angleLabel = createSpan('Basis angle: 45 deg');
    angleLabel.parent(container);
    angleLabel.position(10, drawHeight + 12);
    angleLabel.style('font-size', '13px');

    angleSlider = createSlider(0, 180, 45, 1);
    angleSlider.parent(container);
    angleSlider.position(130, drawHeight + 10);
    angleSlider.size(120);
    angleSlider.input(onAngleChange);

    // Checkboxes
    projectionsCheckbox = createCheckbox(' Show Projections', true);
    projectionsCheckbox.parent(container);
    projectionsCheckbox.position(10, drawHeight + 40);
    projectionsCheckbox.style('font-size', '13px');
    projectionsCheckbox.changed(() => showProjections = projectionsCheckbox.checked());

    comparisonCheckbox = createCheckbox(' Compare to Standard Basis', false);
    comparisonCheckbox.parent(container);
    comparisonCheckbox.position(10, drawHeight + 60);
    comparisonCheckbox.style('font-size', '13px');
    comparisonCheckbox.changed(() => showStandardComparison = comparisonCheckbox.checked());

    // Reset button
    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(270, drawHeight + 40);
    resetButton.mousePressed(resetSim);
}

function onAngleChange() {
    basisAngle = radians(angleSlider.value());
    angleLabel.html('Basis angle: ' + angleSlider.value() + ' deg');
    updateBasisVectors();
    computeCoordinates();
}

function resetSim() {
    angleSlider.value(45);
    basisAngle = PI / 4;
    angleLabel.html('Basis angle: 45 deg');
    v = { x: 3, y: 2 };
    updateBasisVectors();
    computeCoordinates();
}

function updateBasisVectors() {
    // Orthonormal basis: q1 and q2 are unit vectors, perpendicular
    q1.x = cos(basisAngle);
    q1.y = sin(basisAngle);
    q2.x = -sin(basisAngle);  // Perpendicular to q1
    q2.y = cos(basisAngle);
}

function computeCoordinates() {
    // For orthonormal basis, coordinates are simply inner products!
    // c_i = <v, q_i>
    c1 = v.x * q1.x + v.y * q1.y;
    c2 = v.x * q2.x + v.y * q2.y;
}

function draw() {
    // Calculate scale based on canvas size
    scale = (min(canvasWidth - 200, drawHeight) - 60) / (gridMax - gridMin);

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

    // Main visualization
    push();
    let centerX = (canvasWidth - 180) / 2;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    drawGrid();
    drawAxes();

    // Draw standard basis (dashed, gray) if comparison enabled
    if (showStandardComparison) {
        drawStandardBasis();
    }

    // Draw orthonormal basis vectors
    drawBasisVector(q1.x, q1.y, colorQ1, 'q1');
    drawBasisVector(q2.x, q2.y, colorQ2, 'q2');

    // Draw projections
    if (showProjections) {
        drawProjections();
    }

    // Draw target vector
    drawTargetVector();

    // Draw drag points
    drawDragPoints();

    pop();

    // Info panel on right side
    drawInfoPanel();

    // Draw title
    drawTitle();

    // Draw Parseval identity verification
    drawParsevalVerification();
}

function drawGrid() {
    stroke(235);
    strokeWeight(1);

    for (let i = ceil(gridMin); i <= floor(gridMax); i++) {
        line(i * scale, gridMin * scale, i * scale, gridMax * scale);
        line(gridMin * scale, -i * scale, gridMax * scale, -i * scale);
    }
}

function drawAxes() {
    strokeWeight(2);
    stroke(150);

    // X-axis
    line(gridMin * scale - 10, 0, gridMax * scale + 10, 0);
    // Y-axis
    line(0, -gridMin * scale - 10, 0, -gridMax * scale + 10);

    // Axis labels
    fill(100);
    textSize(12);
    textAlign(CENTER, TOP);
    noStroke();
    text('x', gridMax * scale + 15, 5);
    textAlign(RIGHT, CENTER);
    text('y', -8, -gridMax * scale + 10);
}

function drawStandardBasis() {
    // Draw standard basis vectors e1, e2 as dashed gray arrows
    let e1x = 1 * scale;
    let e2y = -1 * scale;

    stroke(colorStdBasis[0], colorStdBasis[1], colorStdBasis[2]);
    strokeWeight(2);
    drawDashedLine(0, 0, e1x, 0);
    drawDashedLine(0, 0, 0, e2y);

    // Small arrowheads
    fill(colorStdBasis[0], colorStdBasis[1], colorStdBasis[2]);
    noStroke();
    // e1 arrowhead
    push();
    translate(e1x, 0);
    triangle(0, 0, -8, -3, -8, 3);
    pop();
    // e2 arrowhead
    push();
    translate(0, e2y);
    rotate(-HALF_PI);
    triangle(0, 0, -8, -3, -8, 3);
    pop();

    // Labels
    textSize(11);
    textAlign(CENTER, CENTER);
    text('e1', e1x + 15, 0);
    text('e2', 0, e2y - 15);

    // Show standard coordinates
    let vsx = v.x * scale;
    let vsy = -v.y * scale;

    // Dashed projection lines to axes
    stroke(colorStdBasis[0], colorStdBasis[1], colorStdBasis[2], 150);
    drawDashedLine(vsx, vsy, vsx, 0);
    drawDashedLine(vsx, vsy, 0, vsy);

    // Projection points
    fill(colorStdBasis[0], colorStdBasis[1], colorStdBasis[2]);
    noStroke();
    ellipse(vsx, 0, 6, 6);
    ellipse(0, vsy, 6, 6);
}

function drawDashedLine(x1, y1, x2, y2) {
    let segments = 10;
    for (let i = 0; i < segments; i += 2) {
        let t1 = i / segments;
        let t2 = (i + 1) / segments;
        line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
    }
}

function drawBasisVector(bx, by, col, label) {
    let vx = bx * scale;
    let vy = -by * scale;

    // Vector line
    stroke(col[0], col[1], col[2]);
    strokeWeight(3);
    line(0, 0, vx, vy);

    // Arrowhead
    let angle = atan2(vy, vx);
    push();
    translate(vx, vy);
    rotate(angle);
    fill(col[0], col[1], col[2]);
    noStroke();
    triangle(0, 0, -10, -4, -10, 4);
    pop();

    // Label
    fill(col[0], col[1], col[2]);
    textSize(14);
    textAlign(CENTER, CENTER);
    noStroke();
    let labelX = vx * 1.15;
    let labelY = vy * 1.15;
    text(label, labelX, labelY);
}

function drawProjections() {
    let vsx = v.x * scale;
    let vsy = -v.y * scale;

    // Projection onto q1: c1 * q1
    let proj1x = c1 * q1.x * scale;
    let proj1y = -c1 * q1.y * scale;

    // Projection onto q2: c2 * q2
    let proj2x = c2 * q2.x * scale;
    let proj2y = -c2 * q2.y * scale;

    // Draw projection lines from v to projection points
    stroke(colorProj[0], colorProj[1], colorProj[2], 180);
    strokeWeight(2);
    drawDashedLine(vsx, vsy, proj1x, proj1y);
    drawDashedLine(vsx, vsy, proj2x, proj2y);

    // Draw projection vectors from origin
    stroke(colorProj[0], colorProj[1], colorProj[2]);
    strokeWeight(2);
    line(0, 0, proj1x, proj1y);
    line(0, 0, proj2x, proj2y);

    // Projection points
    fill(colorProj[0], colorProj[1], colorProj[2]);
    noStroke();
    ellipse(proj1x, proj1y, 8, 8);
    ellipse(proj2x, proj2y, 8, 8);

    // Labels for projection lengths
    textSize(11);
    fill(colorProj[0], colorProj[1], colorProj[2]);
    textAlign(CENTER, CENTER);

    // c1 label
    let c1LabelX = proj1x / 2 + q2.x * 15;
    let c1LabelY = proj1y / 2 - q2.y * 15;
    text('c1=' + c1.toFixed(2), c1LabelX, c1LabelY);

    // c2 label
    let c2LabelX = proj2x / 2 - q1.x * 15;
    let c2LabelY = proj2y / 2 + q1.y * 15;
    text('c2=' + c2.toFixed(2), c2LabelX, c2LabelY);

    // Right angle indicators
    drawRightAngle(proj1x, proj1y, vsx, vsy);
    drawRightAngle(proj2x, proj2y, vsx, vsy);
}

function drawRightAngle(px, py, vx, vy) {
    // Draw small right angle indicator at projection point
    let size = 8;

    // Direction from projection to v
    let dx = vx - px;
    let dy = vy - py;
    let len = sqrt(dx * dx + dy * dy);
    if (len < 1) return;

    dx /= len;
    dy /= len;

    // Direction along basis vector
    let bx = px;
    let by = py;
    let blen = sqrt(bx * bx + by * by);
    if (blen < 1) return;

    bx /= blen;
    by /= blen;

    // Draw right angle
    stroke(100);
    strokeWeight(1);
    noFill();

    let corner1x = px + dx * size;
    let corner1y = py + dy * size;
    let corner2x = px - bx * size;
    let corner2y = py - by * size;
    let corner3x = corner1x - bx * size;
    let corner3y = corner1y - by * size;

    line(corner1x, corner1y, corner3x, corner3y);
    line(corner2x, corner2y, corner3x, corner3y);
}

function drawTargetVector() {
    let vsx = v.x * scale;
    let vsy = -v.y * scale;

    // Vector line
    stroke(colorV[0], colorV[1], colorV[2]);
    strokeWeight(4);
    line(0, 0, vsx, vsy);

    // Arrowhead
    let angle = atan2(vsy, vsx);
    push();
    translate(vsx, vsy);
    rotate(angle);
    fill(colorV[0], colorV[1], colorV[2]);
    noStroke();
    triangle(0, 0, -12, -5, -12, 5);
    pop();

    // Label
    fill(colorV[0], colorV[1], colorV[2]);
    textSize(16);
    textAlign(CENTER, CENTER);
    noStroke();
    text('v', vsx + cos(angle) * 20, vsy + sin(angle) * 20);
}

function drawDragPoints() {
    // Drag point for v
    let vsx = v.x * scale;
    let vsy = -v.y * scale;

    noFill();
    stroke(colorV[0], colorV[1], colorV[2]);
    strokeWeight(2);
    ellipse(vsx, vsy, 16, 16);
    fill(255);
    noStroke();
    ellipse(vsx, vsy, 10, 10);

    // Drag point for basis angle (on q1 tip)
    let q1sx = q1.x * scale;
    let q1sy = -q1.y * scale;

    noFill();
    stroke(colorQ1[0], colorQ1[1], colorQ1[2]);
    strokeWeight(2);
    ellipse(q1sx, q1sy, 16, 16);
    fill(255);
    noStroke();
    ellipse(q1sx, q1sy, 10, 10);
}

function drawInfoPanel() {
    let panelX = canvasWidth - 175;
    let panelY = 15;
    let panelW = 165;
    let panelH = 260;

    // Panel background
    fill(255, 255, 255, 245);
    stroke(220);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Content
    fill(0);
    textSize(14);
    textAlign(LEFT, TOP);
    noStroke();

    let x = panelX + 10;
    let y = panelY + 10;

    text('Coordinate Finder', x, y);
    y += 25;

    // Target vector
    fill(colorV[0], colorV[1], colorV[2]);
    textSize(12);
    text('v = (' + v.x.toFixed(2) + ', ' + v.y.toFixed(2) + ')', x, y);
    y += 22;

    // Orthonormal basis
    fill(0);
    textSize(13);
    text('Orthonormal Basis:', x, y);
    y += 18;

    fill(colorQ1[0], colorQ1[1], colorQ1[2]);
    textSize(11);
    text('q1 = (' + q1.x.toFixed(2) + ', ' + q1.y.toFixed(2) + ')', x, y);
    y += 15;

    fill(colorQ2[0], colorQ2[1], colorQ2[2]);
    text('q2 = (' + q2.x.toFixed(2) + ', ' + q2.y.toFixed(2) + ')', x, y);
    y += 22;

    // Key formula
    fill(0);
    textSize(13);
    text('Coordinates via', x, y);
    y += 16;
    text('inner products:', x, y);
    y += 20;

    fill(colorProj[0], colorProj[1], colorProj[2]);
    textSize(12);
    text('c1 = <v, q1> = ' + c1.toFixed(3), x, y);
    y += 16;
    text('c2 = <v, q2> = ' + c2.toFixed(3), x, y);
    y += 22;

    // Reconstruction
    fill(0);
    textSize(13);
    text('Reconstruction:', x, y);
    y += 18;

    fill(80);
    textSize(11);
    text('v = c1*q1 + c2*q2', x, y);
    y += 16;

    // Verify reconstruction
    let reconX = c1 * q1.x + c2 * q2.x;
    let reconY = c1 * q1.y + c2 * q2.y;
    let error = sqrt(pow(reconX - v.x, 2) + pow(reconY - v.y, 2));

    if (error < 0.01) {
        fill(50, 180, 50);
        text('Verified!', x, y);
    }
}

function drawTitle() {
    fill(0);
    textSize(18);
    textAlign(CENTER, TOP);
    noStroke();
    let centerX = (canvasWidth - 180) / 2;
    text('Orthonormal Basis Coordinate Finder', centerX, 10);

    fill(100);
    textSize(11);
    text('Drag vector v or basis angle to explore', centerX, 32);
}

function drawParsevalVerification() {
    // Parseval's identity: ||v||^2 = c1^2 + c2^2 (for orthonormal basis)
    let normVSquared = v.x * v.x + v.y * v.y;
    let sumCSquared = c1 * c1 + c2 * c2;

    let x = 360;
    let y = drawHeight + 15;

    fill(0);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();

    text("Parseval's Identity:", x, y);
    y += 18;

    fill(80);
    textSize(11);
    text('||v||^2 = ' + normVSquared.toFixed(3), x, y);
    y += 14;
    text('c1^2 + c2^2 = ' + sumCSquared.toFixed(3), x, y);
    y += 16;

    if (abs(normVSquared - sumCSquared) < 0.01) {
        fill(50, 180, 50);
        text('Equal! (Energy preserved)', x, y);
    }

    // Computational advantage note
    x = 520;
    y = drawHeight + 15;
    fill(80);
    textSize(10);
    text('Advantage: Just 2 dot', x, y);
    y += 12;
    text('products instead of', x, y);
    y += 12;
    text('solving a linear system!', x, y);
}

function mousePressed() {
    let centerX = (canvasWidth - 180) / 2;
    let centerY = drawHeight / 2;

    // Check v endpoint
    let vsx = centerX + v.x * scale;
    let vsy = centerY - v.y * scale;
    if (dist(mouseX, mouseY, vsx, vsy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'v';
        return;
    }

    // Check q1 tip (for rotating basis)
    let q1sx = centerX + q1.x * scale;
    let q1sy = centerY - q1.y * scale;
    if (dist(mouseX, mouseY, q1sx, q1sy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'basis';
        return;
    }
}

function mouseDragged() {
    if (!dragging || mouseY >= drawHeight) return;

    let centerX = (canvasWidth - 180) / 2;
    let centerY = drawHeight / 2;

    if (dragging === 'v') {
        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        // Snap to quarter grid
        gx = round(gx * 4) / 4;
        gy = round(gy * 4) / 4;
        gx = constrain(gx, gridMin + 0.5, gridMax - 0.5);
        gy = constrain(gy, gridMin + 0.5, gridMax - 0.5);

        v.x = gx;
        v.y = gy;
        computeCoordinates();
    }
    else if (dragging === 'basis') {
        // Rotate basis based on mouse position
        let dx = mouseX - centerX;
        let dy = -(mouseY - centerY);
        let newAngle = atan2(dy, dx);

        // Snap to 5 degree increments
        let angleDeg = round(degrees(newAngle) / 5) * 5;
        angleDeg = constrain(angleDeg, 0, 180);

        basisAngle = radians(angleDeg);
        angleSlider.value(angleDeg);
        angleLabel.html('Basis angle: ' + angleDeg + ' deg');

        updateBasisVectors();
        computeCoordinates();
    }
}

function mouseReleased() {
    dragging = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(550, container.offsetWidth);
    }
}
