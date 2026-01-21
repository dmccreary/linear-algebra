// Subspace Tester MicroSim
// Learning Objective: Test whether sets are subspaces by checking closure under linear combinations
// Bloom's Level: Apply

// Canvas dimensions
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 100;

// Grid settings
let gridMin = -5;
let gridMax = 5;
let scale;

// Vectors u and v
let vecU = { x: 1, y: 2 };
let vecV = { x: 2, y: -1 };

// Scalars c and d
let scalarC = 1;
let scalarD = 1;

// Linear combination result
let result = { x: 0, y: 0 };

// Set definitions
const setDefinitions = [
    {
        name: "Line through origin (y = 2x)",
        equation: "y = 2x",
        isSubspace: true,
        checkPoint: (x, y) => Math.abs(y - 2 * x) < 0.1,
        constrainToSet: (x, y) => {
            // Project point onto line y = 2x
            // Direction vector: (1, 2), unit: (1/sqrt(5), 2/sqrt(5))
            let dot = (x + 2 * y) / 5;
            return { x: dot, y: 2 * dot };
        },
        drawSet: (s) => {
            stroke(100, 150, 255);
            strokeWeight(3);
            let x1 = gridMin * s;
            let y1 = -2 * gridMin * s;
            let x2 = gridMax * s;
            let y2 = -2 * gridMax * s;
            line(x1, y1, x2, y2);
        },
        explanation: "A line through the origin IS a subspace. For any vectors on the line y = 2x, their linear combination also lies on the line."
    },
    {
        name: "Line not through origin (y = 2x + 1)",
        equation: "y = 2x + 1",
        isSubspace: false,
        failReason: "Does not contain zero vector",
        checkPoint: (x, y) => Math.abs(y - (2 * x + 1)) < 0.15,
        constrainToSet: (x, y) => {
            // Project point onto line y = 2x + 1
            let dot = (x + 2 * (y - 1)) / 5;
            return { x: dot, y: 2 * dot + 1 };
        },
        drawSet: (s) => {
            stroke(100, 150, 255);
            strokeWeight(3);
            let x1 = gridMin;
            let y1 = -(2 * gridMin + 1);
            let x2 = gridMax;
            let y2 = -(2 * gridMax + 1);
            line(x1 * s, y1 * s, x2 * s, y2 * s);
        },
        explanation: "A line NOT through origin is NOT a subspace. It fails because it does not contain the zero vector (0, 0)."
    },
    {
        name: "First quadrant (x >= 0, y >= 0)",
        equation: "x >= 0, y >= 0",
        isSubspace: false,
        failReason: "Not closed under scalar multiplication",
        checkPoint: (x, y) => x >= -0.1 && y >= -0.1,
        constrainToSet: (x, y) => {
            return { x: Math.max(0.1, x), y: Math.max(0.1, y) };
        },
        drawSet: (s) => {
            fill(100, 150, 255, 40);
            noStroke();
            rect(0, -gridMax * s, gridMax * s, gridMax * s);
            stroke(100, 150, 255);
            strokeWeight(2);
            noFill();
            line(0, -gridMax * s, 0, 0);
            line(0, 0, gridMax * s, 0);
        },
        explanation: "The first quadrant is NOT a subspace. While it contains zero, multiplying by -1 sends vectors outside the set."
    },
    {
        name: "Circle (x^2 + y^2 = 4)",
        equation: "x^2 + y^2 = 4",
        isSubspace: false,
        failReason: "Not closed under addition or scalar multiplication",
        checkPoint: (x, y) => Math.abs(x * x + y * y - 4) < 0.3,
        constrainToSet: (x, y) => {
            let mag = Math.sqrt(x * x + y * y);
            if (mag < 0.01) return { x: 2, y: 0 };
            return { x: 2 * x / mag, y: 2 * y / mag };
        },
        drawSet: (s) => {
            noFill();
            stroke(100, 150, 255);
            strokeWeight(3);
            ellipse(0, 0, 4 * s, 4 * s);
        },
        explanation: "A circle is NOT a subspace. It does not contain the zero vector, and adding two vectors on the circle gives a vector not on the circle."
    },
    {
        name: "All of R^2 (entire plane)",
        equation: "All vectors (x, y)",
        isSubspace: true,
        checkPoint: (x, y) => true,
        constrainToSet: (x, y) => ({ x: x, y: y }),
        drawSet: (s) => {
            fill(100, 150, 255, 20);
            noStroke();
            rect(gridMin * s, -gridMax * s, (gridMax - gridMin) * s, (gridMax - gridMin) * s);
        },
        explanation: "The entire plane R^2 IS a subspace (it's the whole vector space). Any linear combination of vectors stays in R^2."
    }
];

let currentSetIndex = 0;

// Dragging state
let dragging = null;
let dragThreshold = 15;

// UI elements
let setSelect;
let cSlider, dSlider;
let checkButton;
let resetButton;

// Status message
let statusMessage = "";
let statusColor;
let showExplanation = false;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();
    initializeVectors();
    calculateResult();

    describe('Interactive subspace tester that checks if linear combinations stay within a set');
}

function createControls() {
    const container = document.querySelector('main');

    // Set selector dropdown
    setSelect = createSelect();
    setSelect.parent(container);
    setSelect.position(10, drawHeight + 10);
    setDefinitions.forEach((def, i) => {
        setSelect.option(def.name, i);
    });
    setSelect.changed(onSetChange);

    // Scalar c slider
    cSlider = createSlider(-2, 2, 1, 0.1);
    cSlider.parent(container);
    cSlider.position(sliderLeftMargin, drawHeight + 45);
    cSlider.size(150);

    // Scalar d slider
    dSlider = createSlider(-2, 2, 1, 0.1);
    dSlider.parent(container);
    dSlider.position(sliderLeftMargin + 200, drawHeight + 45);
    dSlider.size(150);

    // Check button
    checkButton = createButton('Check if Subspace');
    checkButton.parent(container);
    checkButton.position(sliderLeftMargin + 380, drawHeight + 42);
    checkButton.mousePressed(checkSubspace);

    // Reset button
    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(sliderLeftMargin + 510, drawHeight + 42);
    resetButton.mousePressed(resetAll);
}

function onSetChange() {
    currentSetIndex = parseInt(setSelect.value());
    initializeVectors();
    statusMessage = "";
    showExplanation = false;
}

function initializeVectors() {
    let setDef = setDefinitions[currentSetIndex];

    // Initialize vectors to be on the set
    switch (currentSetIndex) {
        case 0: // Line y = 2x
            vecU = { x: 1, y: 2 };
            vecV = { x: -1, y: -2 };
            break;
        case 1: // Line y = 2x + 1
            vecU = { x: 0, y: 1 };
            vecV = { x: 1, y: 3 };
            break;
        case 2: // First quadrant
            vecU = { x: 1, y: 2 };
            vecV = { x: 2, y: 1 };
            break;
        case 3: // Circle
            vecU = { x: 2, y: 0 };
            vecV = { x: 0, y: 2 };
            break;
        case 4: // Entire plane
            vecU = { x: 1, y: 2 };
            vecV = { x: 2, y: -1 };
            break;
    }

    cSlider.value(1);
    dSlider.value(1);
    calculateResult();
}

function calculateResult() {
    scalarC = cSlider.value();
    scalarD = dSlider.value();
    result.x = scalarC * vecU.x + scalarD * vecV.x;
    result.y = scalarC * vecU.y + scalarD * vecV.y;
}

function checkSubspace() {
    let setDef = setDefinitions[currentSetIndex];
    showExplanation = true;

    // Check if result is in the set
    let inSet = setDef.checkPoint(result.x, result.y);

    if (inSet) {
        if (setDef.isSubspace) {
            statusMessage = "Linear combination stays in set. This IS a subspace!";
            statusColor = color(50, 180, 50);
        } else {
            statusMessage = "This combination stays in set, but try c = -1, d = 0 to find a counter-example.";
            statusColor = color(200, 150, 0);
        }
    } else {
        statusMessage = "Linear combination leaves the set! NOT a subspace. " + (setDef.failReason || "");
        statusColor = color(220, 50, 50);
    }
}

function resetAll() {
    currentSetIndex = 0;
    setSelect.value(0);
    initializeVectors();
    cSlider.value(1);
    dSlider.value(1);
    statusMessage = "";
    showExplanation = false;
    calculateResult();
}

function draw() {
    // Update from sliders
    calculateResult();

    // Calculate scale
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

    // Draw coordinate system
    push();
    let centerX = (canvasWidth - 180) / 2;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    drawGrid();

    // Draw set boundary/region
    let setDef = setDefinitions[currentSetIndex];
    setDef.drawSet(scale);

    drawAxes();

    // Draw vectors
    drawVector(vecU, color(220, 80, 80), 'u');
    drawVector(vecV, color(80, 80, 220), 'v');

    // Draw linear combination result
    drawResultVector();

    // Draw drag points
    drawDragPoint(vecU.x, vecU.y, color(220, 80, 80));
    drawDragPoint(vecV.x, vecV.y, color(80, 80, 220));

    pop();

    // Draw info panel
    drawInfoPanel();

    // Draw title
    drawTitle();

    // Draw control labels
    drawControlLabels();

    // Draw status message
    if (statusMessage) {
        drawStatusMessage();
    }
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

function drawVector(v, col, label) {
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
    let labelOffset = 18;
    let angle = atan2(vy, vx);
    text(label, vx + cos(angle) * labelOffset, vy + sin(angle) * labelOffset);
}

function drawResultVector() {
    let rx = result.x * scale;
    let ry = -result.y * scale;

    // Check if result is in set
    let setDef = setDefinitions[currentSetIndex];
    let inSet = setDef.checkPoint(result.x, result.y);

    // Color based on whether result is in set
    let col = inSet ? color(50, 180, 50) : color(255, 100, 50);

    stroke(col);
    strokeWeight(4);
    line(0, 0, rx, ry);
    drawArrowHead(rx, ry, atan2(ry, rx), col);

    // Endpoint with indicator
    fill(col);
    noStroke();
    ellipse(rx, ry, 12, 12);

    // Label
    fill(col);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();
    text('cu + dv', rx + 15, ry);

    // In/out indicator
    textSize(10);
    if (inSet) {
        fill(50, 180, 50);
        text('(in set)', rx + 15, ry + 15);
    } else {
        fill(255, 100, 50);
        text('(outside!)', rx + 15, ry + 15);
    }
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
    let panelX = canvasWidth - 175;
    let panelY = 10;
    let panelW = 165;
    let panelH = 185;

    // Panel background
    fill(255, 255, 255, 245);
    stroke(220);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    let setDef = setDefinitions[currentSetIndex];

    // Content
    fill(0);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();

    let x = panelX + 10;
    let y = panelY + 10;

    text('Set:', x, y);
    y += 15;

    fill(100, 150, 255);
    textSize(11);
    text(setDef.equation, x, y);
    y += 25;

    // Vector info
    fill(220, 80, 80);
    textSize(11);
    text('u = (' + vecU.x.toFixed(1) + ', ' + vecU.y.toFixed(1) + ')', x, y);
    y += 15;

    fill(80, 80, 220);
    text('v = (' + vecV.x.toFixed(1) + ', ' + vecV.y.toFixed(1) + ')', x, y);
    y += 20;

    // Scalars
    fill(0);
    text('c = ' + scalarC.toFixed(1), x, y);
    text('d = ' + scalarD.toFixed(1), x + 60, y);
    y += 20;

    // Linear combination
    fill(50, 180, 50);
    textSize(11);
    text('cu + dv =', x, y);
    y += 15;
    text('(' + result.x.toFixed(1) + ', ' + result.y.toFixed(1) + ')', x, y);
    y += 20;

    // Subspace status indicator
    if (setDef.isSubspace) {
        fill(50, 180, 50);
        text('Subspace: Yes', x, y);
    } else {
        fill(220, 50, 50);
        text('Subspace: No', x, y);
    }
}

function drawTitle() {
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    noStroke();
    text('Subspace Tester', 10, 10);

    fill(100);
    textSize(11);
    text('Drag vector endpoints to test closure', 10, 32);
}

function drawControlLabels() {
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();

    text('c: ' + scalarC.toFixed(1), 10, drawHeight + 55);
    text('d: ' + scalarD.toFixed(1), sliderLeftMargin + 160, drawHeight + 55);
}

function drawStatusMessage() {
    let setDef = setDefinitions[currentSetIndex];

    // Message background
    fill(255, 255, 255, 240);
    stroke(statusColor);
    strokeWeight(2);
    let msgY = drawHeight - 70;
    rect(10, msgY, canvasWidth - 200, 60, 8);

    // Message text
    fill(statusColor);
    textSize(12);
    textAlign(LEFT, TOP);
    noStroke();
    text(statusMessage, 20, msgY + 10);

    if (showExplanation) {
        fill(80);
        textSize(10);
        text(setDef.explanation, 20, msgY + 30, canvasWidth - 230, 30);
    }
}

function mousePressed() {
    let centerX = (canvasWidth - 180) / 2;
    let centerY = drawHeight / 2;

    // Check vecU
    let usx = centerX + vecU.x * scale;
    let usy = centerY - vecU.y * scale;
    if (dist(mouseX, mouseY, usx, usy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'u';
        return;
    }

    // Check vecV
    let vsx = centerX + vecV.x * scale;
    let vsy = centerY - vecV.y * scale;
    if (dist(mouseX, mouseY, vsx, vsy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'v';
        return;
    }
}

function mouseDragged() {
    if (dragging && mouseY < drawHeight) {
        let centerX = (canvasWidth - 180) / 2;
        let centerY = drawHeight / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        // Constrain to grid
        gx = constrain(gx, gridMin + 0.5, gridMax - 0.5);
        gy = constrain(gy, gridMin + 0.5, gridMax - 0.5);

        // Constrain to set
        let setDef = setDefinitions[currentSetIndex];
        let constrained = setDef.constrainToSet(gx, gy);

        // Prevent zero vector
        if (abs(constrained.x) < 0.1 && abs(constrained.y) < 0.1) {
            constrained.x = 0.1;
            constrained.y = 0.1;
        }

        if (dragging === 'u') {
            vecU.x = constrained.x;
            vecU.y = constrained.y;
        } else if (dragging === 'v') {
            vecV.x = constrained.x;
            vecV.y = constrained.y;
        }

        // Clear status when dragging
        statusMessage = "";
        showExplanation = false;
    }
}

function mouseReleased() {
    dragging = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition controls
    if (cSlider) cSlider.size(min(150, canvasWidth - 450));
    if (dSlider) dSlider.size(min(150, canvasWidth - 450));
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(600, container.offsetWidth);
    }
}
