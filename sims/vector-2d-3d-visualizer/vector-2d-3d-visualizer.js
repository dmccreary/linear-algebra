// 2D and 3D Vector Visualization MicroSim
// Learning Objective: Students will interpret vectors geometrically by visualizing
// how component values determine position and direction in 2D and 3D coordinate systems.

// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 450;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Vector components
let vx = 3;
let vy = 4;
let vz = 2;

// View state
let is3DView = false;
let showProjections = true;
let showLabels = true;

// 3D rotation angles (for mouse interaction)
let rotationX = -0.4;
let rotationY = 0.5;

// UI elements
let xSlider, ySlider, zSlider;
let projectionsCheckbox, labelsCheckbox;
let toggleViewButton;

// Scale for drawing
let scale2D = 35; // pixels per unit in 2D
let scale3D = 35; // pixels per unit in 3D

// Mouse drag tracking
let isDragging = false;
let lastMouseX, lastMouseY;

// Font for WEBGL text
let font;

function preload() {
    // Load font for WEBGL text rendering
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent(document.querySelector('main'));

    // Set font for WEBGL text
    textFont(font);

    // Create controls
    createControls();

    describe('Interactive visualization of vectors in 2D and 3D coordinate systems with adjustable components');
}

function createControls() {
    const container = document.querySelector('main');

    // X component slider
    xSlider = createSlider(-5, 5, 3, 0.1);
    xSlider.parent(container);
    xSlider.position(sliderLeftMargin, drawHeight + 15);
    xSlider.size(canvasWidth/2 - sliderLeftMargin - margin);

    // Y component slider
    ySlider = createSlider(-5, 5, 4, 0.1);
    ySlider.parent(container);
    ySlider.position(sliderLeftMargin, drawHeight + 45);
    ySlider.size(canvasWidth/2 - sliderLeftMargin - margin);

    // Z component slider (hidden initially for 2D mode)
    zSlider = createSlider(-5, 5, 2, 0.1);
    zSlider.parent(container);
    zSlider.position(sliderLeftMargin, drawHeight + 75);
    zSlider.size(canvasWidth/2 - sliderLeftMargin - margin);
    zSlider.hide();

    // Toggle view button
    toggleViewButton = createButton('Switch to 3D');
    toggleViewButton.parent(container);
    toggleViewButton.position(canvasWidth/2 + 20, drawHeight + 15);
    toggleViewButton.mousePressed(toggleView);

    // Checkboxes
    projectionsCheckbox = createCheckbox(' Show Projections', true);
    projectionsCheckbox.parent(container);
    projectionsCheckbox.position(canvasWidth/2 + 20, drawHeight + 45);
    projectionsCheckbox.changed(() => showProjections = projectionsCheckbox.checked());

    labelsCheckbox = createCheckbox(' Show Labels', true);
    labelsCheckbox.parent(container);
    labelsCheckbox.position(canvasWidth/2 + 20, drawHeight + 75);
    labelsCheckbox.changed(() => showLabels = labelsCheckbox.checked());
}

function toggleView() {
    is3DView = !is3DView;
    toggleViewButton.html(is3DView ? 'Switch to 2D' : 'Switch to 3D');
    // Show/hide Z slider based on view mode
    if (is3DView) {
        zSlider.show();
    } else {
        zSlider.hide();
    }
}

function draw() {
    // Get slider values
    vx = xSlider.value();
    vy = ySlider.value();
    vz = zSlider.value();

    // Reset transformations for WEBGL
    resetMatrix();

    // Draw background
    background(240);

    // Translate to center for WEBGL coordinate system
    translate(0, 0, 0);

    // Draw the main visualization
    if (is3DView) {
        draw3DView();
    } else {
        draw2DView();
    }

    // Draw control area background (in 2D overlay)
    drawControlArea();
}

function draw2DView() {
    // Move origin to center of drawing area
    push();
    translate(0, -controlHeight/2, 0);

    // Draw grid
    drawGrid2D();

    // Draw axes
    drawAxes2D();

    // Draw projection lines if enabled
    if (showProjections) {
        drawProjections2D();
    }

    // Draw vector
    drawVector2D();

    // Draw labels if enabled
    if (showLabels) {
        drawLabels2D();
    }

    // Draw title and info
    drawInfo2D();

    pop();
}

function draw3DView() {
    // Apply rotation from mouse drag
    push();
    translate(0, -controlHeight/2, 0);
    rotateX(rotationX);
    rotateY(rotationY);

    // Draw 3D grid
    drawGrid3D();

    // Draw 3D axes
    drawAxes3D();

    // Draw projection lines if enabled
    if (showProjections) {
        drawProjections3D();
    }

    // Draw vector
    drawVector3D();

    // Draw labels if enabled
    if (showLabels) {
        drawLabels3D();
    }

    pop();

    // Draw title and info (in screen space)
    drawInfo3D();
}

function drawGrid2D() {
    stroke(220);
    strokeWeight(1);

    // Draw grid lines
    for (let i = -5; i <= 5; i++) {
        // Vertical lines
        line(i * scale2D, -5 * scale2D, i * scale2D, 5 * scale2D);
        // Horizontal lines
        line(-5 * scale2D, i * scale2D, 5 * scale2D, i * scale2D);
    }
}

function drawAxes2D() {
    strokeWeight(2);

    // X-axis (red)
    stroke(200, 50, 50);
    line(-5.5 * scale2D, 0, 5.5 * scale2D, 0);
    // Arrow head
    push();
    translate(5.5 * scale2D, 0);
    fill(200, 50, 50);
    noStroke();
    triangle(0, 0, -10, -5, -10, 5);
    pop();

    // Y-axis (green) - note: inverted for screen coordinates
    stroke(50, 150, 50);
    line(0, 5.5 * scale2D, 0, -5.5 * scale2D);
    // Arrow head
    push();
    translate(0, -5.5 * scale2D);
    fill(50, 150, 50);
    noStroke();
    triangle(0, 0, -5, 10, 5, 10);
    pop();

    // Origin
    fill(0);
    noStroke();
    ellipse(0, 0, 8, 8);
}

function drawProjections2D() {
    stroke(100, 100, 200);
    strokeWeight(1);

    let px = vx * scale2D;
    let py = -vy * scale2D; // Invert Y for screen

    // X projection (dashed line from vector tip to x-axis)
    drawDashedLine2D(px, py, px, 0);
    // Y projection (dashed line from vector tip to y-axis)
    drawDashedLine2D(px, py, 0, py);

    // Projection points
    fill(100, 100, 200);
    noStroke();
    ellipse(px, 0, 6, 6);
    ellipse(0, py, 6, 6);
}

function drawDashedLine2D(x1, y1, x2, y2) {
    let steps = 10;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        let sx = lerp(x1, x2, t1);
        let sy = lerp(y1, y2, t1);
        let ex = lerp(x1, x2, t2);
        let ey = lerp(y1, y2, t2);
        line(sx, sy, ex, ey);
    }
}

function drawVector2D() {
    let px = vx * scale2D;
    let py = -vy * scale2D; // Invert Y for screen

    // Draw vector line
    stroke(0, 100, 200);
    strokeWeight(3);
    line(0, 0, px, py);

    // Draw arrow head
    push();
    translate(px, py);
    let angle = atan2(py, px);
    rotate(angle);
    fill(0, 100, 200);
    noStroke();
    triangle(0, 0, -15, -7, -15, 7);
    pop();

    // Draw endpoint
    fill(0, 100, 200);
    noStroke();
    ellipse(px, py, 10, 10);
}

function drawLabels2D() {
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);

    // Axis labels
    push();
    // Reset to 2D text rendering
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2 + controlHeight/2);

    let centerX = canvasWidth / 2;
    let centerY = drawHeight / 2;

    // X-axis label
    fill(200, 50, 50);
    text('x', centerX + 5.8 * scale2D, centerY + 20);

    // Y-axis label
    fill(50, 150, 50);
    text('y', centerX - 20, centerY - 5.5 * scale2D);

    // Component values
    fill(0, 100, 200);
    let px = centerX + vx * scale2D;
    let py = centerY - vy * scale2D;
    text('(' + vx.toFixed(1) + ', ' + vy.toFixed(1) + ')', px + 30, py - 15);

    pop();
}

function drawInfo2D() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Title
    fill(0);
    textSize(20);
    textAlign(CENTER, TOP);
    noStroke();
    text('2D Vector Visualization', canvasWidth/2, 10);

    // Magnitude display
    let magnitude = sqrt(vx*vx + vy*vy);
    textSize(16);
    textAlign(LEFT, TOP);
    fill(60);
    text('|v| = ' + magnitude.toFixed(2), 15, 40);
    text('v = (' + vx.toFixed(1) + ', ' + vy.toFixed(1) + ')', 15, 60);

    pop();
}

function drawGrid3D() {
    stroke(220);
    strokeWeight(1);

    // XY plane grid (z=0)
    for (let i = -5; i <= 5; i++) {
        line(i * scale3D, -5 * scale3D, 0, i * scale3D, 5 * scale3D, 0);
        line(-5 * scale3D, i * scale3D, 0, 5 * scale3D, i * scale3D, 0);
    }
}

function drawAxes3D() {
    strokeWeight(2);

    // X-axis (red)
    stroke(200, 50, 50);
    line(0, 0, 0, 6 * scale3D, 0, 0);
    push();
    translate(6 * scale3D, 0, 0);
    fill(200, 50, 50);
    noStroke();
    cone(5, 15);
    pop();

    // Y-axis (green) - in 3D, Y points up
    stroke(50, 150, 50);
    line(0, 0, 0, 0, -6 * scale3D, 0);
    push();
    translate(0, -6 * scale3D, 0);
    rotateX(PI);
    fill(50, 150, 50);
    noStroke();
    cone(5, 15);
    pop();

    // Z-axis (blue)
    stroke(50, 50, 200);
    line(0, 0, 0, 0, 0, 6 * scale3D);
    push();
    translate(0, 0, 6 * scale3D);
    rotateX(PI/2);
    fill(50, 50, 200);
    noStroke();
    cone(5, 15);
    pop();

    // Origin sphere
    push();
    fill(50);
    noStroke();
    sphere(4);
    pop();
}

function drawProjections3D() {
    stroke(150, 150, 150);
    strokeWeight(1);

    let px = vx * scale3D;
    let py = -vy * scale3D; // Y is inverted in screen coords
    let pz = vz * scale3D;

    // Draw dashed lines using segments
    drawDashedLine3D(px, py, pz, px, py, 0); // to XY plane
    drawDashedLine3D(px, py, 0, px, 0, 0);   // to X axis
    drawDashedLine3D(px, py, 0, 0, py, 0);   // to Y axis
    drawDashedLine3D(px, py, pz, 0, py, pz); // parallel to X
    drawDashedLine3D(px, py, pz, px, 0, pz); // parallel to Y

    // Projection points
    fill(150);
    noStroke();
    push(); translate(px, 0, 0); sphere(3); pop();
    push(); translate(0, py, 0); sphere(3); pop();
    push(); translate(0, 0, pz); sphere(3); pop();
    push(); translate(px, py, 0); sphere(3); pop();
}

function drawDashedLine3D(x1, y1, z1, x2, y2, z2) {
    let steps = 10;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        let sx = lerp(x1, x2, t1);
        let sy = lerp(y1, y2, t1);
        let sz = lerp(z1, z2, t1);
        let ex = lerp(x1, x2, t2);
        let ey = lerp(y1, y2, t2);
        let ez = lerp(z1, z2, t2);
        line(sx, sy, sz, ex, ey, ez);
    }
}

function drawVector3D() {
    let px = vx * scale3D;
    let py = -vy * scale3D;
    let pz = vz * scale3D;

    // Draw vector line
    stroke(0, 100, 200);
    strokeWeight(3);
    line(0, 0, 0, px, py, pz);

    // Draw arrow head (cone at tip)
    push();
    translate(px, py, pz);

    // Calculate rotation to point cone along vector
    let mag = sqrt(px*px + py*py + pz*pz);
    if (mag > 0) {
        // Default cone points in -Y direction, we need to rotate it
        let v = createVector(px, py, pz).normalize();
        let up = createVector(0, -1, 0);
        let axis = up.cross(v);
        let angle = acos(up.dot(v));
        if (axis.mag() > 0.001) {
            rotate(angle, axis);
        } else if (py > 0) {
            rotateX(PI);
        }
    }

    fill(0, 100, 200);
    noStroke();
    cone(6, 18);
    pop();

    // Endpoint sphere
    push();
    translate(px, py, pz);
    fill(0, 100, 200);
    noStroke();
    sphere(5);
    pop();
}

function drawLabels3D() {
    push();
    // Axis labels need billboard rendering - simplified version
    fill(200, 50, 50);
    textSize(14);

    // Draw axis labels at endpoints
    push();
    translate(6.5 * scale3D, 0, 0);
    rotateY(-rotationY);
    rotateX(-rotationX);
    text('x', 0, 0);
    pop();

    push();
    translate(0, -6.5 * scale3D, 0);
    rotateY(-rotationY);
    rotateX(-rotationX);
    fill(50, 150, 50);
    text('y', 0, 0);
    pop();

    push();
    translate(0, 0, 6.5 * scale3D);
    rotateY(-rotationY);
    rotateX(-rotationX);
    fill(50, 50, 200);
    text('z', 0, 0);
    pop();

    pop();
}

function drawInfo3D() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Title
    fill(0);
    textSize(20);
    textAlign(CENTER, TOP);
    noStroke();
    text('3D Vector Visualization', canvasWidth/2, 10);

    // Magnitude display
    let magnitude = sqrt(vx*vx + vy*vy + vz*vz);
    textSize(16);
    textAlign(LEFT, TOP);
    fill(60);
    text('|v| = ' + magnitude.toFixed(2), 15, 40);
    text('v = (' + vx.toFixed(1) + ', ' + vy.toFixed(1) + ', ' + vz.toFixed(1) + ')', 15, 60);

    // Instructions
    textSize(12);
    fill(100);
    text('Drag to rotate view', 15, drawHeight - 25);

    pop();
}

function drawControlArea() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Control area background
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Border
    stroke(200);
    strokeWeight(1);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Slider labels
    fill(0);
    textSize(14);
    textAlign(LEFT, CENTER);
    noStroke();
    text('X: ' + vx.toFixed(1), 10, drawHeight + 25);
    text('Y: ' + vy.toFixed(1), 10, drawHeight + 55);
    if (is3DView) {
        text('Z: ' + vz.toFixed(1), 10, drawHeight + 85);
    }

    pop();
}

function mouseDragged() {
    if (is3DView && mouseY < drawHeight) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        rotationY += dx * 0.01;
        rotationX += dy * 0.01;
        // Clamp rotationX to avoid flipping
        rotationX = constrain(rotationX, -PI/2, PI/2);
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition controls
    if (xSlider) {
        xSlider.position(sliderLeftMargin, drawHeight + 15);
        xSlider.size(canvasWidth/2 - sliderLeftMargin - margin);
    }
    if (ySlider) {
        ySlider.position(sliderLeftMargin, drawHeight + 45);
        ySlider.size(canvasWidth/2 - sliderLeftMargin - margin);
    }
    if (zSlider) {
        zSlider.position(sliderLeftMargin, drawHeight + 75);
        zSlider.size(canvasWidth/2 - sliderLeftMargin - margin);
    }
    if (toggleViewButton) {
        toggleViewButton.position(canvasWidth/2 + 20, drawHeight + 15);
    }
    if (projectionsCheckbox) {
        projectionsCheckbox.position(canvasWidth/2 + 20, drawHeight + 45);
    }
    if (labelsCheckbox) {
        labelsCheckbox.position(canvasWidth/2 + 20, drawHeight + 75);
    }
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(400, container.offsetWidth);
    }
}
