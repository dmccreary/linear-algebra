// Basis and Coordinate System Visualizer MicroSim
// Learning Objective: Students will interpret how the same point has different
// coordinate representations in different bases.

// Canvas dimensions
let canvasWidth = 750;
let drawHeight = 380;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

// Panel dimensions
let panelWidth;
let panelGap = 30;

// Standard basis (always e1=(1,0), e2=(0,1))
// Custom basis
let b1 = { x: 2, y: 0 };
let b2 = { x: 1, y: 1 };

// Vector in standard coordinates
let vector = { x: 3, y: 2 };

// Custom coordinates (computed from standard)
let customCoords = { c1: 0, c2: 0 };

// Display options
let showGrid = true;
let showProjections = true;

// Animation
let animating = false;
let animProgress = 0;

// Scale
let scale = 35;

// Dragging
let dragging = null;
let dragThreshold = 15;

// UI elements
let gridCheckbox, projectionsCheckbox;
let standardBtn, rotatedBtn, skewedBtn, stretchedBtn;
let animateButton;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();
    computeCustomCoordinates();

    describe('Side-by-side comparison of standard and custom basis coordinate systems');
}

function createControls() {
    // Preset buttons
    standardBtn = createButton('Standard');
    standardBtn.position(10, drawHeight + 15);
    standardBtn.mousePressed(() => setPreset('standard'));

    rotatedBtn = createButton('Rotated 45°');
    rotatedBtn.position(80, drawHeight + 15);
    rotatedBtn.mousePressed(() => setPreset('rotated'));

    skewedBtn = createButton('Skewed');
    skewedBtn.position(170, drawHeight + 15);
    skewedBtn.mousePressed(() => setPreset('skewed'));

    stretchedBtn = createButton('Stretched');
    stretchedBtn.position(240, drawHeight + 15);
    stretchedBtn.mousePressed(() => setPreset('stretched'));

    // Checkboxes
    gridCheckbox = createCheckbox(' Show Grid', true);
    gridCheckbox.position(10, drawHeight + 50);
    gridCheckbox.changed(() => showGrid = gridCheckbox.checked());

    projectionsCheckbox = createCheckbox(' Show Projections', true);
    projectionsCheckbox.position(10, drawHeight + 75);
    projectionsCheckbox.changed(() => showProjections = projectionsCheckbox.checked());

    // Animate button
    animateButton = createButton('Animate Morph');
    animateButton.position(150, drawHeight + 60);
    animateButton.mousePressed(startAnimation);
}

function setPreset(preset) {
    switch(preset) {
        case 'standard':
            b1 = { x: 1, y: 0 };
            b2 = { x: 0, y: 1 };
            break;
        case 'rotated':
            let angle = PI / 4;
            b1 = { x: cos(angle), y: sin(angle) };
            b2 = { x: -sin(angle), y: cos(angle) };
            break;
        case 'skewed':
            b1 = { x: 1, y: 0.5 };
            b2 = { x: 0.3, y: 1 };
            break;
        case 'stretched':
            b1 = { x: 2, y: 0 };
            b2 = { x: 0, y: 0.5 };
            break;
    }
    computeCustomCoordinates();
}

function startAnimation() {
    animating = true;
    animProgress = 0;
}

function computeCustomCoordinates() {
    // Solve: vector = c1*b1 + c2*b2
    // This is a 2x2 system: [b1.x b2.x] [c1]   [vector.x]
    //                       [b1.y b2.y] [c2] = [vector.y]

    let det = b1.x * b2.y - b2.x * b1.y;

    if (abs(det) < 0.0001) {
        // Singular matrix - basis vectors are parallel
        customCoords = { c1: NaN, c2: NaN };
        return;
    }

    // Using Cramer's rule or inverse
    customCoords.c1 = (vector.x * b2.y - vector.y * b2.x) / det;
    customCoords.c2 = (vector.y * b1.x - vector.x * b1.y) / det;
}

function draw() {
    // Update animation
    if (animating) {
        animProgress += 0.02;
        if (animProgress >= 1) {
            animProgress = 1;
            animating = false;
        }
    }

    // Calculate panel width
    panelWidth = (canvasWidth - panelGap - 40) / 2;

    // Background
    background(248);

    // Draw panels
    drawStandardPanel();
    drawCustomPanel();

    // Control area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(220);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Draw coordinate comparison
    drawCoordinateComparison();
}

function drawStandardPanel() {
    let x = 20;
    let y = 10;
    let centerX = x + panelWidth / 2;
    let centerY = y + (drawHeight - 20) / 2;

    // Panel background
    fill(252, 254, 255);
    stroke(200);
    strokeWeight(1);
    rect(x, y, panelWidth, drawHeight - 20, 5);

    // Title
    fill(0);
    textSize(14);
    textAlign(CENTER, TOP);
    noStroke();
    text('Standard Basis', x + panelWidth/2, y + 5);

    push();
    translate(centerX, centerY);

    // Draw grid
    if (showGrid) {
        drawStandardGrid();
    }

    // Draw axes
    drawStandardAxes();

    // Draw projections
    if (showProjections) {
        drawStandardProjections();
    }

    // Draw basis vectors
    drawBasisVector(1, 0, color(200, 100, 100), 'e₁');
    drawBasisVector(0, 1, color(100, 100, 200), 'e₂');

    // Draw vector
    drawMainVector(vector.x, vector.y);

    // Draw drag point for vector
    drawDragPoint(vector.x * scale, -vector.y * scale, color(50, 150, 50));

    pop();
}

function drawCustomPanel() {
    let x = 20 + panelWidth + panelGap;
    let y = 10;
    let centerX = x + panelWidth / 2;
    let centerY = y + (drawHeight - 20) / 2;

    // Panel background
    fill(252, 254, 255);
    stroke(200);
    strokeWeight(1);
    rect(x, y, panelWidth, drawHeight - 20, 5);

    // Title
    fill(0);
    textSize(14);
    textAlign(CENTER, TOP);
    noStroke();
    text('Custom Basis', x + panelWidth/2, y + 5);

    push();
    translate(centerX, centerY);

    // Draw custom grid
    if (showGrid) {
        drawCustomGrid();
    }

    // Draw standard axes (faint)
    stroke(230);
    strokeWeight(1);
    line(-panelWidth/2 + 10, 0, panelWidth/2 - 10, 0);
    line(0, -drawHeight/2 + 30, 0, drawHeight/2 - 30);

    // Draw projections in custom basis
    if (showProjections && !isNaN(customCoords.c1)) {
        drawCustomProjections();
    }

    // Draw custom basis vectors
    drawBasisVector(b1.x, b1.y, color(200, 100, 100), 'b₁');
    drawBasisVector(b2.x, b2.y, color(100, 100, 200), 'b₂');

    // Draw vector (same geometric position)
    drawMainVector(vector.x, vector.y);

    // Draw drag points for basis vectors
    drawDragPoint(b1.x * scale, -b1.y * scale, color(200, 100, 100));
    drawDragPoint(b2.x * scale, -b2.y * scale, color(100, 100, 200));

    pop();
}

function drawStandardGrid() {
    stroke(235);
    strokeWeight(1);

    for (let i = -5; i <= 5; i++) {
        line(i * scale, -4 * scale, i * scale, 4 * scale);
        line(-5 * scale, -i * scale, 5 * scale, -i * scale);
    }
}

function drawCustomGrid() {
    if (isNaN(customCoords.c1)) return;

    stroke(235);
    strokeWeight(1);

    // Draw grid lines parallel to b1 and b2
    for (let i = -5; i <= 5; i++) {
        // Lines parallel to b1 (starting from i*b2)
        let startX = i * b2.x * scale;
        let startY = -i * b2.y * scale;
        let endX = startX + 5 * b1.x * scale;
        let endY = startY - 5 * b1.y * scale;
        let endX2 = startX - 5 * b1.x * scale;
        let endY2 = startY + 5 * b1.y * scale;
        line(endX2, endY2, endX, endY);

        // Lines parallel to b2 (starting from i*b1)
        startX = i * b1.x * scale;
        startY = -i * b1.y * scale;
        endX = startX + 5 * b2.x * scale;
        endY = startY - 5 * b2.y * scale;
        endX2 = startX - 5 * b2.x * scale;
        endY2 = startY + 5 * b2.y * scale;
        line(endX2, endY2, endX, endY);
    }
}

function drawStandardAxes() {
    strokeWeight(2);
    stroke(150);

    // X-axis
    line(-panelWidth/2 + 10, 0, panelWidth/2 - 10, 0);
    // Y-axis
    line(0, -drawHeight/2 + 30, 0, drawHeight/2 - 30);

    // Labels
    fill(100);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();
    text('x', panelWidth/2 - 25, 12);
    textAlign(CENTER, BOTTOM);
    text('y', 12, -drawHeight/2 + 45);
}

function drawStandardProjections() {
    let vx = vector.x * scale;
    let vy = -vector.y * scale;

    stroke(150, 150, 200);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);

    line(vx, vy, vx, 0);
    line(vx, vy, 0, vy);

    drawingContext.setLineDash([]);

    // Projection points
    fill(150, 150, 200);
    noStroke();
    ellipse(vx, 0, 6, 6);
    ellipse(0, vy, 6, 6);
}

function drawCustomProjections() {
    let vx = vector.x * scale;
    let vy = -vector.y * scale;

    // c1*b1 point
    let c1b1x = customCoords.c1 * b1.x * scale;
    let c1b1y = -customCoords.c1 * b1.y * scale;

    // c2*b2 point
    let c2b2x = customCoords.c2 * b2.x * scale;
    let c2b2y = -customCoords.c2 * b2.y * scale;

    stroke(150, 150, 200);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);

    // Line from tip to c1*b1 (parallel to b2)
    line(vx, vy, c1b1x, c1b1y);
    // Line from tip to c2*b2 (parallel to b1)
    line(vx, vy, c2b2x, c2b2y);

    drawingContext.setLineDash([]);

    // Projection points on basis directions
    fill(150, 150, 200);
    noStroke();
    ellipse(c1b1x, c1b1y, 6, 6);
    ellipse(c2b2x, c2b2y, 6, 6);
}

function drawBasisVector(bx, by, col, label) {
    let vx = bx * scale;
    let vy = -by * scale;

    stroke(col);
    strokeWeight(2);
    line(0, 0, vx, vy);

    // Arrowhead
    let angle = atan2(vy, vx);
    push();
    translate(vx, vy);
    rotate(angle);
    fill(col);
    noStroke();
    triangle(0, 0, -8, -4, -8, 4);
    pop();

    // Label
    fill(col);
    textSize(12);
    textAlign(CENTER, CENTER);
    noStroke();
    let labelDist = 15;
    text(label, vx + cos(angle) * labelDist, vy + sin(angle) * labelDist);
}

function drawMainVector(vx, vy) {
    let sx = vx * scale;
    let sy = -vy * scale;

    stroke(50, 150, 50);
    strokeWeight(3);
    line(0, 0, sx, sy);

    // Arrowhead
    let angle = atan2(sy, sx);
    push();
    translate(sx, sy);
    rotate(angle);
    fill(50, 150, 50);
    noStroke();
    triangle(0, 0, -10, -5, -10, 5);
    pop();

    // Endpoint
    fill(50, 150, 50);
    noStroke();
    ellipse(sx, sy, 8, 8);
}

function drawDragPoint(sx, sy, col) {
    noFill();
    stroke(col);
    strokeWeight(2);
    ellipse(sx, sy, 14, 14);

    fill(255);
    noStroke();
    ellipse(sx, sy, 8, 8);
}

function drawCoordinateComparison() {
    let x = 300;
    let y = drawHeight + 15;

    fill(0);
    textSize(14);
    textAlign(LEFT, TOP);
    noStroke();

    // Standard coordinates
    text('Standard coordinates:', x, y);
    fill(50, 150, 50);
    text('v = (' + vector.x.toFixed(2) + ', ' + vector.y.toFixed(2) + ')', x, y + 18);

    // Custom coordinates
    fill(0);
    text('Custom basis coordinates:', x, y + 45);
    if (isNaN(customCoords.c1)) {
        fill(200, 50, 50);
        text('Undefined (parallel basis)', x, y + 63);
    } else {
        fill(50, 150, 50);
        text('[v]_B = (' + customCoords.c1.toFixed(2) + ', ' + customCoords.c2.toFixed(2) + ')', x, y + 63);
    }

    // Verification
    if (!isNaN(customCoords.c1)) {
        fill(100);
        textSize(11);
        let verify = customCoords.c1.toFixed(1) + '·b₁ + ' + customCoords.c2.toFixed(1) + '·b₂ = v';
        text(verify, x, y + 85);
    }

    // Custom basis values
    fill(0);
    textSize(12);
    text('b₁ = (' + b1.x.toFixed(1) + ', ' + b1.y.toFixed(1) + ')', x + 250, y + 15);
    text('b₂ = (' + b2.x.toFixed(1) + ', ' + b2.y.toFixed(1) + ')', x + 250, y + 35);
}

function mousePressed() {
    // Check standard panel - vector drag
    let stdCenterX = 20 + panelWidth / 2;
    let stdCenterY = 10 + (drawHeight - 20) / 2;
    let vsx = stdCenterX + vector.x * scale;
    let vsy = stdCenterY - vector.y * scale;

    if (dist(mouseX, mouseY, vsx, vsy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'vector_std';
        return;
    }

    // Check custom panel - vector drag
    let custCenterX = 20 + panelWidth + panelGap + panelWidth / 2;
    let custCenterY = 10 + (drawHeight - 20) / 2;
    let vcx = custCenterX + vector.x * scale;
    let vcy = custCenterY - vector.y * scale;

    if (dist(mouseX, mouseY, vcx, vcy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'vector_cust';
        return;
    }

    // Check custom panel - b1 drag
    let b1x = custCenterX + b1.x * scale;
    let b1y = custCenterY - b1.y * scale;

    if (dist(mouseX, mouseY, b1x, b1y) < dragThreshold && mouseY < drawHeight) {
        dragging = 'b1';
        return;
    }

    // Check custom panel - b2 drag
    let b2x = custCenterX + b2.x * scale;
    let b2y = custCenterY - b2.y * scale;

    if (dist(mouseX, mouseY, b2x, b2y) < dragThreshold && mouseY < drawHeight) {
        dragging = 'b2';
        return;
    }
}

function mouseDragged() {
    if (!dragging || mouseY >= drawHeight) return;

    if (dragging === 'vector_std') {
        let centerX = 20 + panelWidth / 2;
        let centerY = 10 + (drawHeight - 20) / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        gx = round(gx * 4) / 4;
        gy = round(gy * 4) / 4;
        gx = constrain(gx, -4, 4);
        gy = constrain(gy, -3.5, 3.5);

        vector.x = gx;
        vector.y = gy;
        computeCustomCoordinates();
    }
    else if (dragging === 'vector_cust') {
        let centerX = 20 + panelWidth + panelGap + panelWidth / 2;
        let centerY = 10 + (drawHeight - 20) / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        gx = round(gx * 4) / 4;
        gy = round(gy * 4) / 4;
        gx = constrain(gx, -4, 4);
        gy = constrain(gy, -3.5, 3.5);

        vector.x = gx;
        vector.y = gy;
        computeCustomCoordinates();
    }
    else if (dragging === 'b1' || dragging === 'b2') {
        let centerX = 20 + panelWidth + panelGap + panelWidth / 2;
        let centerY = 10 + (drawHeight - 20) / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        gx = round(gx * 4) / 4;
        gy = round(gy * 4) / 4;
        gx = constrain(gx, -3, 3);
        gy = constrain(gy, -3, 3);

        // Prevent zero vector
        if (abs(gx) < 0.1 && abs(gy) < 0.1) gx = 0.25;

        if (dragging === 'b1') {
            b1.x = gx;
            b1.y = gy;
        } else {
            b2.x = gx;
            b2.y = gy;
        }
        computeCustomCoordinates();
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
        canvasWidth = Math.max(600, container.offsetWidth);
    }
}
