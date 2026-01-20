// System of Equations Geometry MicroSim
// Visualize how linear equations intersect geometrically
// 2D mode: lines, 3D mode: planes
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 600;
let drawHeight = 400;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 90;
let defaultTextSize = 16;

// Mode: '2D' or '3D'
let mode = '2D';
let modeButton;

// Number of equations
let numEquations = 2;
let numEqSelect;

// Equation coefficients for 2D: ax + by = c
// Equation 1
let a1 = 1, b1 = 1, c1 = 3;
// Equation 2
let a2 = 1, b2 = -1, c2 = 1;
// Equation 3 (optional)
let a3 = 2, b3 = 1, c3 = 5;

// 3D rotation
let rotX = -0.5;
let rotY = 0.5;

// UI elements
let a1Slider, b1Slider, c1Slider;
let a2Slider, b2Slider, c2Slider;
let showSolutionCheckbox;
let randomButton;

// Scale for coordinate system
let scale2D = 40; // pixels per unit
let gridRange = 5; // -5 to 5

// Font for WEBGL
let font;

// Track mouse for 3D rotation
let isDragging = false;
let lastMouseX, lastMouseY;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent(document.querySelector('main'));
    textFont(font);
    textSize(defaultTextSize);

    // Mode toggle button
    modeButton = createButton('Switch to 3D');
    modeButton.position(10, drawHeight + 5);
    modeButton.mousePressed(toggleMode);

    // Random system button
    randomButton = createButton('Random');
    randomButton.position(120, drawHeight + 5);
    randomButton.mousePressed(generateRandomSystem);

    // Show solution checkbox
    showSolutionCheckbox = createCheckbox(' Show Solution', true);
    showSolutionCheckbox.position(200, drawHeight + 7);
    showSolutionCheckbox.style('font-size', '14px');

    // Equation 1 sliders - Row 2
    let row2Y = drawHeight + 40;
    a1Slider = createSlider(-5, 5, a1, 0.5);
    a1Slider.position(sliderLeftMargin, row2Y);
    a1Slider.size(80);

    b1Slider = createSlider(-5, 5, b1, 0.5);
    b1Slider.position(sliderLeftMargin + 120, row2Y);
    b1Slider.size(80);

    c1Slider = createSlider(-10, 10, c1, 0.5);
    c1Slider.position(sliderLeftMargin + 240, row2Y);
    c1Slider.size(80);

    // Equation 2 sliders - Row 3
    let row3Y = drawHeight + 75;
    a2Slider = createSlider(-5, 5, a2, 0.5);
    a2Slider.position(sliderLeftMargin, row3Y);
    a2Slider.size(80);

    b2Slider = createSlider(-5, 5, b2, 0.5);
    b2Slider.position(sliderLeftMargin + 120, row3Y);
    b2Slider.size(80);

    c2Slider = createSlider(-10, 10, c2, 0.5);
    c2Slider.position(sliderLeftMargin + 240, row3Y);
    c2Slider.size(80);

    describe('Interactive visualization of systems of linear equations showing geometric intersection of lines in 2D or planes in 3D', LABEL);
}

function draw() {
    updateCanvasSize();

    // Get current slider values
    a1 = a1Slider.value();
    b1 = b1Slider.value();
    c1 = c1Slider.value();
    a2 = a2Slider.value();
    b2 = b2Slider.value();
    c2 = c2Slider.value();

    // Reset to 2D-like drawing
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Draw background regions
    noStroke();
    fill('aliceblue');
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke('silver');
    strokeWeight(1);
    noFill();
    rect(0, 0, canvasWidth, drawHeight);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('System of Linear Equations', canvasWidth/2, 8);

    // Draw based on mode
    if (mode === '2D') {
        draw2D();
    } else {
        draw3D();
    }

    // Draw control labels
    drawControlLabels();
}

function draw2D() {
    push();
    // Center of drawing area
    let cx = canvasWidth / 2;
    let cy = drawHeight / 2;
    translate(cx, cy);

    // Draw grid
    stroke(220);
    strokeWeight(1);
    for (let i = -gridRange; i <= gridRange; i++) {
        // Vertical lines
        line(i * scale2D, -gridRange * scale2D, i * scale2D, gridRange * scale2D);
        // Horizontal lines
        line(-gridRange * scale2D, i * scale2D, gridRange * scale2D, i * scale2D);
    }

    // Draw axes
    stroke(100);
    strokeWeight(2);
    line(-gridRange * scale2D, 0, gridRange * scale2D, 0); // x-axis
    line(0, -gridRange * scale2D, 0, gridRange * scale2D); // y-axis

    // Axis labels
    fill('black');
    noStroke();
    textSize(14);
    textAlign(CENTER, TOP);
    text('x', gridRange * scale2D - 10, 5);
    textAlign(RIGHT, CENTER);
    text('y', -5, -gridRange * scale2D + 15);

    // Draw Line 1 (blue)
    stroke(0, 100, 200);
    strokeWeight(3);
    drawLine2D(a1, b1, c1);

    // Draw Line 2 (red)
    stroke(200, 50, 50);
    strokeWeight(3);
    drawLine2D(a2, b2, c2);

    // Calculate and draw solution
    let solution = solve2x2(a1, b1, c1, a2, b2, c2);

    // Display solution info
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);

    // Equation display
    fill(0, 100, 200);
    text(formatEquation(a1, b1, c1, 1), 10 - canvasWidth/2 + 10, -drawHeight/2 + 35);
    fill(200, 50, 50);
    text(formatEquation(a2, b2, c2, 2), 10 - canvasWidth/2 + 10, -drawHeight/2 + 55);

    // Solution info box
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rectMode(CORNER);
    let infoX = canvasWidth/2 - 160;
    let infoY = -drawHeight/2 + 30;
    rect(infoX, infoY, 150, 70, 8);

    noStroke();
    fill('black');
    textSize(12);

    if (solution.type === 'unique') {
        fill(0, 150, 0);
        text('Unique Solution', infoX + 10, infoY + 10);
        fill('black');
        text('x = ' + solution.x.toFixed(2), infoX + 10, infoY + 30);
        text('y = ' + solution.y.toFixed(2), infoX + 10, infoY + 48);

        // Draw solution point
        if (showSolutionCheckbox.checked()) {
            let px = solution.x * scale2D;
            let py = -solution.y * scale2D; // flip y

            fill(0, 200, 0);
            stroke(0, 100, 0);
            strokeWeight(2);
            circle(px, py, 16);

            // Label the point
            noStroke();
            fill(0, 100, 0);
            textSize(12);
            textAlign(LEFT, CENTER);
            text('(' + solution.x.toFixed(1) + ', ' + solution.y.toFixed(1) + ')', px + 12, py);
        }
    } else if (solution.type === 'infinite') {
        fill(0, 0, 200);
        text('Infinite Solutions', infoX + 10, infoY + 10);
        fill('black');
        text('Lines are coincident', infoX + 10, infoY + 30);
        text('(same line)', infoX + 10, infoY + 48);
    } else {
        fill(200, 0, 0);
        text('No Solution', infoX + 10, infoY + 10);
        fill('black');
        text('Lines are parallel', infoX + 10, infoY + 30);
    }

    pop();
}

function draw3D() {
    push();
    // Move to center of drawing area
    translate(0, -controlHeight/2);

    // Apply rotation
    rotateX(rotX);
    rotateY(rotY);

    // Scale down
    let s = 30;

    // Draw 3D axes
    strokeWeight(2);
    // X-axis (red)
    stroke(255, 100, 100);
    line(-5*s, 0, 0, 5*s, 0, 0);
    // Y-axis (green)
    stroke(100, 255, 100);
    line(0, -5*s, 0, 0, 5*s, 0);
    // Z-axis (blue)
    stroke(100, 100, 255);
    line(0, 0, -5*s, 0, 0, 5*s);

    // Draw planes
    // Plane 1: a1*x + b1*y = c1 (extend to 3D as a1*x + b1*y + 0*z = c1)
    fill(0, 100, 200, 100);
    stroke(0, 100, 200);
    strokeWeight(1);
    drawPlane3D(a1, b1, 0, c1, s);

    // Plane 2: a2*x + b2*y = c2
    fill(200, 50, 50, 100);
    stroke(200, 50, 50);
    drawPlane3D(a2, b2, 0, c2, s);

    // Draw intersection line if exists
    let solution = solve2x2(a1, b1, c1, a2, b2, c2);
    if (solution.type === 'unique' && showSolutionCheckbox.checked()) {
        stroke(0, 200, 0);
        strokeWeight(4);
        // In 3D, the intersection is a vertical line through (x, y)
        let px = solution.x * s;
        let py = solution.y * s;
        line(px, py, -5*s, px, py, 5*s);
    }

    pop();

    // Draw info overlay (in screen space)
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill(0, 100, 200);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text(formatEquation(a1, b1, c1, 1), 15, 35);
    fill(200, 50, 50);
    text(formatEquation(a2, b2, c2, 2), 15, 55);

    fill('gray');
    textSize(12);
    text('Drag to rotate', 15, drawHeight - 25);
}

function drawLine2D(a, b, c) {
    // ax + by = c
    // If b != 0: y = (c - ax) / b
    // If b == 0: x = c / a (vertical line)

    if (abs(b) < 0.001 && abs(a) < 0.001) return; // degenerate

    let x1, y1, x2, y2;
    let range = gridRange + 1;

    if (abs(b) > abs(a)) {
        // More horizontal - use x to calculate y
        x1 = -range;
        x2 = range;
        y1 = (c - a * x1) / b;
        y2 = (c - a * x2) / b;
    } else {
        // More vertical - use y to calculate x
        y1 = -range;
        y2 = range;
        x1 = (c - b * y1) / a;
        x2 = (c - b * y2) / a;
    }

    // Scale and flip y
    line(x1 * scale2D, -y1 * scale2D, x2 * scale2D, -y2 * scale2D);
}

function drawPlane3D(a, b, c, d, s) {
    // ax + by + cz = d
    // For simplicity, draw as a quad
    // If c is 0, plane is vertical

    beginShape();
    let range = 4;

    if (abs(b) > 0.001) {
        // Solve for y: y = (d - ax - cz) / b
        for (let x = -range; x <= range; x += range*2) {
            for (let z = -range; z <= range; z += range*2) {
                let y = (d - a * x - c * z) / b;
                vertex(x * s, y * s, z * s);
            }
        }
    } else if (abs(a) > 0.001) {
        // Solve for x: x = (d - by - cz) / a
        for (let y = -range; y <= range; y += range*2) {
            for (let z = -range; z <= range; z += range*2) {
                let x = (d - b * y - c * z) / a;
                vertex(x * s, y * s, z * s);
            }
        }
    }
    endShape(CLOSE);
}

function solve2x2(a1, b1, c1, a2, b2, c2) {
    // Solve: a1*x + b1*y = c1
    //        a2*x + b2*y = c2
    // Using Cramer's rule

    let det = a1 * b2 - a2 * b1;

    if (abs(det) < 0.0001) {
        // Lines are parallel or coincident
        // Check if coincident: ratios a1/a2 = b1/b2 = c1/c2
        let ratioA = (abs(a2) > 0.001) ? a1 / a2 : null;
        let ratioB = (abs(b2) > 0.001) ? b1 / b2 : null;
        let ratioC = (abs(c2) > 0.001) ? c1 / c2 : null;

        // Check if all defined ratios are equal
        let ratios = [ratioA, ratioB, ratioC].filter(r => r !== null);
        if (ratios.length >= 2) {
            let allEqual = ratios.every(r => abs(r - ratios[0]) < 0.01);
            if (allEqual) {
                return { type: 'infinite' };
            }
        }
        return { type: 'none' };
    }

    let x = (c1 * b2 - c2 * b1) / det;
    let y = (a1 * c2 - a2 * c1) / det;

    return { type: 'unique', x: x, y: y };
}

function formatEquation(a, b, c, num) {
    let str = 'Eq' + num + ': ';

    // Format a*x term
    if (a === 1) str += 'x';
    else if (a === -1) str += '-x';
    else if (a !== 0) str += a + 'x';

    // Format b*y term
    if (b > 0 && a !== 0) str += ' + ';
    else if (b < 0) str += ' - ';

    if (b === 1) str += 'y';
    else if (b === -1 && a !== 0) str += 'y';
    else if (b === -1 && a === 0) str += '-y';
    else if (abs(b) !== 0 && abs(b) !== 1) str += abs(b) + 'y';

    str += ' = ' + c;
    return str;
}

function drawControlLabels() {
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);

    // Row 2 labels (Equation 1)
    let row2Y = drawHeight + 52;
    fill(0, 100, 200);
    text('Eq1:', 10, row2Y);
    fill('black');
    text('a₁=' + a1.toFixed(1), sliderLeftMargin, row2Y - 12);
    text('b₁=' + b1.toFixed(1), sliderLeftMargin + 120, row2Y - 12);
    text('c₁=' + c1.toFixed(1), sliderLeftMargin + 240, row2Y - 12);

    // Row 3 labels (Equation 2)
    let row3Y = drawHeight + 87;
    fill(200, 50, 50);
    text('Eq2:', 10, row3Y);
    fill('black');
    text('a₂=' + a2.toFixed(1), sliderLeftMargin, row3Y - 12);
    text('b₂=' + b2.toFixed(1), sliderLeftMargin + 120, row3Y - 12);
    text('c₂=' + c2.toFixed(1), sliderLeftMargin + 240, row3Y - 12);

    // Format hint
    fill('gray');
    textSize(12);
    text('Format: ax + by = c', sliderLeftMargin + 330, drawHeight + 70);
}

function toggleMode() {
    if (mode === '2D') {
        mode = '3D';
        modeButton.html('Switch to 2D');
    } else {
        mode = '2D';
        modeButton.html('Switch to 3D');
    }
}

function generateRandomSystem() {
    // Generate random coefficients
    a1Slider.value(floor(random(-4, 5)));
    b1Slider.value(floor(random(-4, 5)));
    c1Slider.value(floor(random(-8, 9)));
    a2Slider.value(floor(random(-4, 5)));
    b2Slider.value(floor(random(-4, 5)));
    c2Slider.value(floor(random(-8, 9)));

    // Make sure we don't have degenerate equations (both a and b zero)
    if (abs(a1Slider.value()) < 0.5 && abs(b1Slider.value()) < 0.5) {
        a1Slider.value(1);
    }
    if (abs(a2Slider.value()) < 0.5 && abs(b2Slider.value()) < 0.5) {
        a2Slider.value(1);
    }
}

function mousePressed() {
    if (mode === '3D' && mouseY < drawHeight && mouseY > 0) {
        isDragging = true;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseReleased() {
    isDragging = false;
}

function mouseDragged() {
    if (isDragging && mode === '3D') {
        let dx = mouseX - lastMouseX;
        let dy = mouseY - lastMouseY;
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        containerWidth = container.offsetWidth;
        canvasWidth = containerWidth;
    }
}
