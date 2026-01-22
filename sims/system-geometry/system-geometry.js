// System of Equations Geometry MicroSim
// Visualize how linear equations intersect geometrically
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

// Equation coefficients: ax + by = c
// Equation 1
let a1 = 1, b1 = 1, c1 = 3;
// Equation 2
let a2 = 1, b2 = -1, c2 = 1;

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

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent(document.querySelector('main'));
    textFont(font);
    textSize(defaultTextSize);

    // Random system button
    randomButton = createButton('Random');
    randomButton.position(10, drawHeight + 5);
    randomButton.mousePressed(generateRandomSystem);

    // Show solution checkbox
    showSolutionCheckbox = createCheckbox(' Show Solution', true);
    showSolutionCheckbox.position(90, drawHeight + 7);
    showSolutionCheckbox.style('font-size', '14px');

    // Equation 1 sliders - Row 2
    let row2Y = drawHeight + 48;
    a1Slider = createSlider(-5, 5, a1, 0.5);
    a1Slider.position(sliderLeftMargin, row2Y);
    a1Slider.size(160);

    b1Slider = createSlider(-5, 5, b1, 0.5);
    b1Slider.position(sliderLeftMargin + 180, row2Y);
    b1Slider.size(160);

    c1Slider = createSlider(-10, 10, c1, 0.5);
    c1Slider.position(sliderLeftMargin + 360, row2Y);
    c1Slider.size(160);

    // Equation 2 sliders - Row 3
    let row3Y = drawHeight + 93;
    a2Slider = createSlider(-5, 5, a2, 0.5);
    a2Slider.position(sliderLeftMargin, row3Y);
    a2Slider.size(160);

    b2Slider = createSlider(-5, 5, b2, 0.5);
    b2Slider.position(sliderLeftMargin + 180, row3Y);
    b2Slider.size(160);

    c2Slider = createSlider(-10, 10, c2, 0.5);
    c2Slider.position(sliderLeftMargin + 360, row3Y);
    c2Slider.size(160);

    describe('Interactive visualization of systems of linear equations showing geometric intersection of lines', LABEL);
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

    // Reset matrix for 2D-like drawing
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

    // Draw the 2D visualization
    draw2D();

    // Reset for title drawing
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Draw title background
    fill('aliceblue');
    noStroke();
    rect(0, 0, canvasWidth, 32);

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('System of Linear Equations', canvasWidth * 0.3, 8);

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
    text('y', -5, -gridRange * scale2D + 40);

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
    let infoX = canvasWidth/2 - 120;
    let infoY = -drawHeight/2 + 30;
    rect(infoX, infoY, 110, 70, 8);

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

function drawLine2D(a, b, c) {
    // ax + by = c
    // If b != 0: y = (c - ax) / b
    // If b == 0: x = c / a (vertical line)

    if (abs(b) < 0.001 && abs(a) < 0.001) return; // degenerate

    // Find intersection points with the grid boundary
    let points = [];
    let minX = -gridRange, maxX = gridRange;
    let minY = -gridRange, maxY = gridRange;

    // Check intersection with left edge (x = minX)
    if (abs(b) > 0.001) {
        let y = (c - a * minX) / b;
        if (y >= minY && y <= maxY) points.push({x: minX, y: y});
    }

    // Check intersection with right edge (x = maxX)
    if (abs(b) > 0.001) {
        let y = (c - a * maxX) / b;
        if (y >= minY && y <= maxY) points.push({x: maxX, y: y});
    }

    // Check intersection with bottom edge (y = minY)
    if (abs(a) > 0.001) {
        let x = (c - b * minY) / a;
        if (x > minX && x < maxX) points.push({x: x, y: minY});
    }

    // Check intersection with top edge (y = maxY)
    if (abs(a) > 0.001) {
        let x = (c - b * maxY) / a;
        if (x > minX && x < maxX) points.push({x: x, y: maxY});
    }

    // Need exactly 2 points to draw a line
    if (points.length >= 2) {
        let x1 = points[0].x, y1 = points[0].y;
        let x2 = points[1].x, y2 = points[1].y;
        // Scale and flip y
        line(x1 * scale2D, -y1 * scale2D, x2 * scale2D, -y2 * scale2D);
    }
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
    text('b₁=' + b1.toFixed(1), sliderLeftMargin + 180, row2Y - 12);
    text('c₁=' + c1.toFixed(1), sliderLeftMargin + 360, row2Y - 12);

    // Row 3 labels (Equation 2)
    let row3Y = drawHeight + 97;
    fill(200, 50, 50);
    text('Eq2:', 10, row3Y);
    fill('black');
    text('a₂=' + a2.toFixed(1), sliderLeftMargin, row3Y - 12);
    text('b₂=' + b2.toFixed(1), sliderLeftMargin + 180, row3Y - 12);
    text('c₂=' + c2.toFixed(1), sliderLeftMargin + 360, row3Y - 12);

    // Format hint
    fill('gray');
    textSize(16);
    text('Format: ax + by = c', 15, drawHeight - 20);
}

function generateRandomSystem() {
    // Generate a random solution point within margin of grid
    let margin = 1.5;
    let solX = random(-gridRange + margin, gridRange - margin);
    let solY = random(-gridRange + margin, gridRange - margin);

    // Generate random coefficients for a and b
    let newA1 = floor(random(-4, 5));
    let newB1 = floor(random(-4, 5));
    let newA2 = floor(random(-4, 5));
    let newB2 = floor(random(-4, 5));

    // Make sure we don't have degenerate equations (both a and b zero)
    if (abs(newA1) < 0.5 && abs(newB1) < 0.5) newA1 = 1;
    if (abs(newA2) < 0.5 && abs(newB2) < 0.5) newA2 = 1;

    // Ensure lines are not parallel (determinant != 0)
    let det = newA1 * newB2 - newA2 * newB1;
    if (abs(det) < 0.5) {
        newB2 = newB2 + 1;
        if (newB2 > 5) newB2 = -4;
    }

    // Calculate c values so solution is at (solX, solY)
    let newC1 = newA1 * solX + newB1 * solY;
    let newC2 = newA2 * solX + newB2 * solY;

    // Round c values to nearest 0.5 and clamp to slider range
    newC1 = constrain(round(newC1 * 2) / 2, -10, 10);
    newC2 = constrain(round(newC2 * 2) / 2, -10, 10);

    // Set slider values
    a1Slider.value(newA1);
    b1Slider.value(newB1);
    c1Slider.value(newC1);
    a2Slider.value(newA2);
    b2Slider.value(newB2);
    c2Slider.value(newC2);
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
