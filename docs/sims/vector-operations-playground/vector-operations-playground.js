// Vector Operations Playground MicroSim
// Learning Objective: Students will apply vector addition, subtraction, and scalar
// multiplication by manipulating vectors interactively and predicting results.

// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 450;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 140;
let defaultTextSize = 14;

// Grid settings
let gridMin = -6;
let gridMax = 6;
let scale; // pixels per unit, calculated based on width

// Vectors (in mathematical coordinates, not screen)
let uVec = { x: 3, y: 2 };
let vVec = { x: 1, y: 4 };
let resultVec = { x: 0, y: 0 };

// Operation state
let operation = 'add'; // 'add', 'subtract', 'scalar'
let scalarValue = 2;
let showParallelogram = true;
let showComponents = true;

// Dragging state
let dragging = null; // 'u', 'v', or null
let dragThreshold = 15; // pixels

// Animation state
let animating = false;
let animProgress = 0;
let animSpeed = 0.02;

// UI elements
let scalarSlider;
let parallelogramCheckbox, componentsCheckbox;
let addRadio, subRadio, scalarRadio;
let animateButton, resetButton;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();
    calculateResult();

    describe('Interactive vector operations playground for addition, subtraction, and scalar multiplication');
}

function createControls() {
    // Operation radio buttons
    addRadio = createRadio('operation');
    addRadio.option('add', ' Add');
    addRadio.option('subtract', ' Subtract');
    addRadio.option('scalar', ' Scalar ×');
    addRadio.selected('add');
    addRadio.position(10, drawHeight + 10);
    addRadio.changed(() => {
        operation = addRadio.value();
        calculateResult();
    });

    // Scalar slider
    scalarSlider = createSlider(-3, 3, 2, 0.1);
    scalarSlider.position(sliderLeftMargin + 120, drawHeight + 45);
    scalarSlider.size(canvasWidth - sliderLeftMargin - 180);

    // Checkboxes
    parallelogramCheckbox = createCheckbox(' Parallelogram', true);
    parallelogramCheckbox.position(10, drawHeight + 45);
    parallelogramCheckbox.changed(() => showParallelogram = parallelogramCheckbox.checked());

    componentsCheckbox = createCheckbox(' Components', true);
    componentsCheckbox.position(10, drawHeight + 70);
    componentsCheckbox.changed(() => showComponents = componentsCheckbox.checked());

    // Buttons
    animateButton = createButton('Animate');
    animateButton.position(canvasWidth - 170, drawHeight + 65);
    animateButton.mousePressed(startAnimation);

    resetButton = createButton('Reset');
    resetButton.position(canvasWidth - 90, drawHeight + 65);
    resetButton.mousePressed(resetVectors);
}

function calculateResult() {
    if (operation === 'add') {
        resultVec.x = uVec.x + vVec.x;
        resultVec.y = uVec.y + vVec.y;
    } else if (operation === 'subtract') {
        resultVec.x = uVec.x - vVec.x;
        resultVec.y = uVec.y - vVec.y;
    } else if (operation === 'scalar') {
        resultVec.x = scalarValue * uVec.x;
        resultVec.y = scalarValue * uVec.y;
    }
}

function startAnimation() {
    animating = true;
    animProgress = 0;
}

function resetVectors() {
    uVec = { x: 3, y: 2 };
    vVec = { x: 1, y: 4 };
    scalarSlider.value(2);
    scalarValue = 2;
    addRadio.selected('add');
    operation = 'add';
    animating = false;
    animProgress = 0;
    calculateResult();
}

function draw() {
    // Update scalar value
    scalarValue = scalarSlider.value();
    calculateResult();

    // Update animation
    if (animating) {
        animProgress += animSpeed;
        if (animProgress >= 1) {
            animProgress = 1;
            animating = false;
        }
    }

    // Calculate scale based on current width
    scale = (canvasWidth - 100) / (gridMax - gridMin);

    // Draw background
    background(245);

    // Drawing area
    fill(250, 252, 255);
    stroke(200);
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(200);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Draw main content
    push();
    // Move origin to center of drawing area
    let centerX = canvasWidth / 2;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    drawGrid();
    drawAxes();

    if (showParallelogram && operation === 'add') {
        drawParallelogram();
    }

    if (showComponents) {
        drawComponentLines();
    }

    // Draw vectors
    drawVectorArrow(0, 0, uVec.x, uVec.y, color(0, 100, 220), 'u', true);

    if (operation !== 'scalar') {
        drawVectorArrow(0, 0, vVec.x, vVec.y, color(220, 50, 50), 'v', true);
    }

    // Draw result or animated result
    if (animating) {
        let progress = easeInOutCubic(animProgress);
        let rx, ry;

        if (operation === 'add') {
            // Animate tip-to-tail
            rx = uVec.x + vVec.x * progress;
            ry = uVec.y + vVec.y * progress;
            // Draw v starting from tip of u
            drawVectorArrow(uVec.x, uVec.y, uVec.x + vVec.x * progress, uVec.y + vVec.y * progress, color(220, 50, 50, 150), '', false);
        } else if (operation === 'subtract') {
            rx = uVec.x - vVec.x * progress;
            ry = uVec.y - vVec.y * progress;
        } else {
            let currentScalar = 1 + (scalarValue - 1) * progress;
            rx = uVec.x * currentScalar;
            ry = uVec.y * currentScalar;
        }
        drawVectorArrow(0, 0, rx, ry, color(50, 180, 50), 'result', false);
    } else {
        drawVectorArrow(0, 0, resultVec.x, resultVec.y, color(50, 180, 50), 'u+v', false);
    }

    // Draw draggable endpoints
    drawDragPoint(uVec.x, uVec.y, color(0, 100, 220));
    if (operation !== 'scalar') {
        drawDragPoint(vVec.x, vVec.y, color(220, 50, 50));
    }

    pop();

    // Draw title
    fill(0);
    textSize(18);
    textAlign(CENTER, TOP);
    noStroke();
    text('Vector Operations Playground', canvasWidth/2, 8);

    // Draw info panel
    drawInfoPanel();

    // Draw control labels
    drawControlLabels();
}

function drawGrid() {
    stroke(230);
    strokeWeight(1);

    for (let i = gridMin; i <= gridMax; i++) {
        // Vertical lines
        line(i * scale, gridMin * scale, i * scale, gridMax * scale);
        // Horizontal lines (inverted Y)
        line(gridMin * scale, -i * scale, gridMax * scale, -i * scale);
    }
}

function drawAxes() {
    strokeWeight(2);

    // X-axis
    stroke(150);
    line(gridMin * scale, 0, gridMax * scale, 0);
    // Arrow
    fill(150);
    noStroke();
    triangle(gridMax * scale + 5, 0, gridMax * scale - 5, -5, gridMax * scale - 5, 5);

    // Y-axis
    stroke(150);
    line(0, -gridMin * scale, 0, -gridMax * scale);
    // Arrow (note: screen Y is inverted)
    fill(150);
    noStroke();
    triangle(0, -gridMax * scale - 5, -5, -gridMax * scale + 5, 5, -gridMax * scale + 5);

    // Axis labels
    fill(100);
    textSize(14);
    textAlign(CENTER, TOP);
    text('x', gridMax * scale + 15, 5);
    textAlign(RIGHT, CENTER);
    text('y', -10, -gridMax * scale);

    // Origin
    fill(100);
    noStroke();
    ellipse(0, 0, 6, 6);
}

function drawParallelogram() {
    // Draw parallelogram for addition visualization
    stroke(150, 150, 200);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);

    let ux = uVec.x * scale;
    let uy = -uVec.y * scale;
    let vx = vVec.x * scale;
    let vy = -vVec.y * scale;

    // Lines from tip of u parallel to v
    line(ux, uy, ux + vx, uy + vy);
    // Lines from tip of v parallel to u
    line(vx, vy, ux + vx, uy + vy);

    drawingContext.setLineDash([]);
}

function drawComponentLines() {
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);

    // u components
    stroke(0, 100, 220, 100);
    line(uVec.x * scale, -uVec.y * scale, uVec.x * scale, 0);
    line(uVec.x * scale, -uVec.y * scale, 0, -uVec.y * scale);

    if (operation !== 'scalar') {
        // v components
        stroke(220, 50, 50, 100);
        line(vVec.x * scale, -vVec.y * scale, vVec.x * scale, 0);
        line(vVec.x * scale, -vVec.y * scale, 0, -vVec.y * scale);
    }

    drawingContext.setLineDash([]);
}

function drawVectorArrow(x1, y1, x2, y2, col, label, showMag) {
    // Convert to screen coordinates
    let sx1 = x1 * scale;
    let sy1 = -y1 * scale;
    let sx2 = x2 * scale;
    let sy2 = -y2 * scale;

    // Draw line
    stroke(col);
    strokeWeight(3);
    line(sx1, sy1, sx2, sy2);

    // Draw arrowhead
    let angle = atan2(sy2 - sy1, sx2 - sx1);
    push();
    translate(sx2, sy2);
    rotate(angle);
    fill(col);
    noStroke();
    triangle(0, 0, -12, -6, -12, 6);
    pop();

    // Draw label
    if (label) {
        fill(col);
        textSize(14);
        textAlign(LEFT, BOTTOM);
        let midX = (sx1 + sx2) / 2;
        let midY = (sy1 + sy2) / 2;
        // Offset label perpendicular to vector
        let perpX = -(sy2 - sy1) / sqrt(sq(sx2-sx1) + sq(sy2-sy1)) * 15;
        let perpY = (sx2 - sx1) / sqrt(sq(sx2-sx1) + sq(sy2-sy1)) * 15;
        if (sqrt(sq(sx2-sx1) + sq(sy2-sy1)) > 10) {
            text(label, midX + perpX, midY + perpY);
        }
    }
}

function drawDragPoint(x, y, col) {
    let sx = x * scale;
    let sy = -y * scale;

    // Outer ring
    noFill();
    stroke(col);
    strokeWeight(2);
    ellipse(sx, sy, 16, 16);

    // Inner fill
    fill(255);
    noStroke();
    ellipse(sx, sy, 10, 10);

    // Center dot
    fill(col);
    ellipse(sx, sy, 4, 4);
}

function drawInfoPanel() {
    let panelX = canvasWidth - 160;
    let panelY = 35;
    let panelW = 150;
    let panelH = 130;

    // Panel background
    fill(255, 255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Content
    fill(0);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();

    let y = panelY + 10;
    let x = panelX + 10;

    // Vector u
    fill(0, 100, 220);
    text('u = (' + uVec.x.toFixed(1) + ', ' + uVec.y.toFixed(1) + ')', x, y);
    y += 18;
    text('|u| = ' + magnitude(uVec).toFixed(2), x, y);
    y += 22;

    // Vector v (if applicable)
    if (operation !== 'scalar') {
        fill(220, 50, 50);
        text('v = (' + vVec.x.toFixed(1) + ', ' + vVec.y.toFixed(1) + ')', x, y);
        y += 18;
        text('|v| = ' + magnitude(vVec).toFixed(2), x, y);
        y += 22;
    } else {
        fill(100);
        text('c = ' + scalarValue.toFixed(1), x, y);
        y += 40;
    }

    // Result
    fill(50, 180, 50);
    let opSymbol = operation === 'add' ? 'u+v' : (operation === 'subtract' ? 'u-v' : 'cu');
    text(opSymbol + ' = (' + resultVec.x.toFixed(1) + ', ' + resultVec.y.toFixed(1) + ')', x, y);
    y += 18;
    text('|' + opSymbol + '| = ' + magnitude(resultVec).toFixed(2), x, y);
}

function drawControlLabels() {
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();

    // Scalar slider label
    text('Scalar c: ' + scalarValue.toFixed(1), sliderLeftMargin, drawHeight + 55);

    // Instructions
    fill(100);
    textSize(11);
    text('Drag vector endpoints to adjust', 150, drawHeight + 15);
}

function magnitude(v) {
    return sqrt(v.x * v.x + v.y * v.y);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function mousePressed() {
    let centerX = canvasWidth / 2;
    let centerY = drawHeight / 2;

    // Check if clicking near u endpoint
    let uScreenX = centerX + uVec.x * scale;
    let uScreenY = centerY - uVec.y * scale;
    if (dist(mouseX, mouseY, uScreenX, uScreenY) < dragThreshold) {
        dragging = 'u';
        return;
    }

    // Check if clicking near v endpoint (if visible)
    if (operation !== 'scalar') {
        let vScreenX = centerX + vVec.x * scale;
        let vScreenY = centerY - vVec.y * scale;
        if (dist(mouseX, mouseY, vScreenX, vScreenY) < dragThreshold) {
            dragging = 'v';
            return;
        }
    }
}

function mouseDragged() {
    if (dragging && mouseY < drawHeight) {
        let centerX = canvasWidth / 2;
        let centerY = drawHeight / 2;

        // Convert mouse position to grid coordinates
        let gridX = (mouseX - centerX) / scale;
        let gridY = -(mouseY - centerY) / scale;

        // Snap to 0.5 increments
        gridX = round(gridX * 2) / 2;
        gridY = round(gridY * 2) / 2;

        // Constrain to grid
        gridX = constrain(gridX, gridMin + 0.5, gridMax - 0.5);
        gridY = constrain(gridY, gridMin + 0.5, gridMax - 0.5);

        if (dragging === 'u') {
            uVec.x = gridX;
            uVec.y = gridY;
        } else if (dragging === 'v') {
            vVec.x = gridX;
            vVec.y = gridY;
        }

        calculateResult();
    }
}

function mouseReleased() {
    dragging = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    repositionControls();
}

function repositionControls() {
    if (scalarSlider) {
        scalarSlider.position(sliderLeftMargin + 120, drawHeight + 45);
        scalarSlider.size(canvasWidth - sliderLeftMargin - 180);
    }
    if (animateButton) {
        animateButton.position(canvasWidth - 170, drawHeight + 65);
    }
    if (resetButton) {
        resetButton.position(canvasWidth - 90, drawHeight + 65);
    }
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(500, container.offsetWidth);
    }
}
