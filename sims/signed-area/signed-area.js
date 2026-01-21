// Signed Area Visualizer
// Demonstrates the signed area of a parallelogram formed by two vectors
// Shows how orientation affects the sign of the determinant

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Grid and coordinate system
let gridSize = 40; // pixels per unit
let originX, originY;

// Vector endpoints (in grid coordinates)
let u = { x: 2, y: 1 };
let v = { x: 1, y: 2 };

// Dragging state
let dragging = null; // 'u' or 'v' or null
let dragOffset = { x: 0, y: 0 };

// Controls
let showParallelogramCheckbox;
let showFormulaCheckbox;
let resetButton;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    originX = canvasWidth / 2;
    originY = drawHeight / 2;

    // Create controls
    showParallelogramCheckbox = createCheckbox(' Show Parallelogram', true);
    showParallelogramCheckbox.position(10, drawHeight + 10);
    showParallelogramCheckbox.style('font-size', '14px');

    showFormulaCheckbox = createCheckbox(' Show Formula', true);
    showFormulaCheckbox.position(180, drawHeight + 10);
    showFormulaCheckbox.style('font-size', '14px');

    resetButton = createButton('Reset');
    resetButton.position(canvasWidth - 70, drawHeight + 10);
    resetButton.mousePressed(resetVectors);

    describe('Interactive visualization of signed area showing a parallelogram formed by two draggable vectors with color indicating positive or negative area', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Update origin for responsive design
    originX = canvasWidth / 2;

    // Draw grid
    drawGrid();

    // Draw axes
    drawAxes();

    // Calculate signed area
    let signedArea = u.x * v.y - u.y * v.x;

    // Draw parallelogram if enabled
    if (showParallelogramCheckbox.checked()) {
        drawParallelogram(signedArea);
    }

    // Draw vectors
    drawVector(u, color(220, 60, 60), 'u');
    drawVector(v, color(60, 60, 220), 'v');

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('Signed Area Visualizer', canvasWidth / 2, 10);

    // Draw info panel
    drawInfoPanel(signedArea);

    // Draw formula if enabled
    if (showFormulaCheckbox.checked()) {
        drawFormula(signedArea);
    }

    // Update reset button position
    resetButton.position(canvasWidth - 70, drawHeight + 10);
}

function drawGrid() {
    stroke(220);
    strokeWeight(1);

    // Vertical lines
    for (let x = originX % gridSize; x < canvasWidth; x += gridSize) {
        line(x, 0, x, drawHeight);
    }

    // Horizontal lines
    for (let y = originY % gridSize; y < drawHeight; y += gridSize) {
        line(0, y, canvasWidth, y);
    }
}

function drawAxes() {
    stroke(100);
    strokeWeight(2);

    // X-axis
    line(0, originY, canvasWidth, originY);
    // Y-axis
    line(originX, 0, originX, drawHeight);

    // Axis labels
    fill(100);
    noStroke();
    textSize(14);
    textAlign(CENTER, TOP);
    text('x', canvasWidth - 15, originY + 5);
    textAlign(LEFT, CENTER);
    text('y', originX + 5, 15);
}

function drawParallelogram(signedArea) {
    // Convert to screen coordinates
    let o = { x: originX, y: originY };
    let uScreen = { x: originX + u.x * gridSize, y: originY - u.y * gridSize };
    let vScreen = { x: originX + v.x * gridSize, y: originY - v.y * gridSize };
    let uvScreen = { x: originX + (u.x + v.x) * gridSize, y: originY - (u.y + v.y) * gridSize };

    // Color based on sign
    if (signedArea > 0) {
        fill(100, 200, 100, 100); // Green for positive
        stroke(100, 200, 100);
    } else if (signedArea < 0) {
        fill(200, 100, 100, 100); // Red for negative
        stroke(200, 100, 100);
    } else {
        fill(150, 150, 150, 100); // Gray for zero
        stroke(150, 150, 150);
    }
    strokeWeight(2);

    beginShape();
    vertex(o.x, o.y);
    vertex(uScreen.x, uScreen.y);
    vertex(uvScreen.x, uvScreen.y);
    vertex(vScreen.x, vScreen.y);
    endShape(CLOSE);
}

function drawVector(vec, col, label) {
    let startX = originX;
    let startY = originY;
    let endX = originX + vec.x * gridSize;
    let endY = originY - vec.y * gridSize;

    stroke(col);
    strokeWeight(3);
    line(startX, startY, endX, endY);

    // Draw arrowhead
    let angle = atan2(startY - endY, endX - startX);
    let arrowSize = 12;

    fill(col);
    noStroke();
    push();
    translate(endX, endY);
    rotate(-angle);
    triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
    pop();

    // Draw draggable handle
    fill(col);
    stroke(255);
    strokeWeight(2);
    ellipse(endX, endY, 16, 16);

    // Label
    fill(col);
    noStroke();
    textSize(16);
    textAlign(LEFT, BOTTOM);
    let labelOffsetX = 10;
    let labelOffsetY = -10;
    text(label + ' = (' + vec.x.toFixed(1) + ', ' + vec.y.toFixed(1) + ')', endX + labelOffsetX, endY + labelOffsetY);
}

function drawInfoPanel(signedArea) {
    // Info panel in top right
    let panelX = canvasWidth - 160;
    let panelY = 40;
    let panelW = 150;
    let panelH = 80;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 10);

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    text('Signed Area:', panelX + 10, panelY + 10);

    // Color the value based on sign
    if (signedArea > 0) {
        fill(0, 150, 0);
    } else if (signedArea < 0) {
        fill(200, 0, 0);
    } else {
        fill(100);
    }
    textSize(24);
    textAlign(CENTER, CENTER);
    text(signedArea.toFixed(2), panelX + panelW/2, panelY + 50);

    // Sign indicator
    textSize(12);
    fill(100);
    if (signedArea > 0) {
        text('(CCW orientation)', panelX + panelW/2, panelY + 70);
    } else if (signedArea < 0) {
        text('(CW orientation)', panelX + panelW/2, panelY + 70);
    } else {
        text('(Parallel vectors)', panelX + panelW/2, panelY + 70);
    }
}

function drawFormula(signedArea) {
    let panelX = 10;
    let panelY = drawHeight - 80;
    let panelW = 200;
    let panelH = 70;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 10);

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    text('ad - bc =', panelX + 10, panelY + 10);

    // Show calculation
    let a = u.x, b = v.x, c = u.y, d = v.y;
    textSize(12);
    text('(' + a.toFixed(1) + ')(' + d.toFixed(1) + ') - (' + b.toFixed(1) + ')(' + c.toFixed(1) + ')', panelX + 10, panelY + 30);
    text('= ' + (a*d).toFixed(1) + ' - ' + (b*c).toFixed(1) + ' = ' + signedArea.toFixed(2), panelX + 10, panelY + 50);
}

function mousePressed() {
    // Check if clicking on vector u endpoint
    let uEndX = originX + u.x * gridSize;
    let uEndY = originY - u.y * gridSize;
    if (dist(mouseX, mouseY, uEndX, uEndY) < 15) {
        dragging = 'u';
        return;
    }

    // Check if clicking on vector v endpoint
    let vEndX = originX + v.x * gridSize;
    let vEndY = originY - v.y * gridSize;
    if (dist(mouseX, mouseY, vEndX, vEndY) < 15) {
        dragging = 'v';
        return;
    }
}

function mouseDragged() {
    if (dragging && mouseY < drawHeight) {
        let newX = (mouseX - originX) / gridSize;
        let newY = (originY - mouseY) / gridSize;

        // Clamp to reasonable range
        newX = constrain(newX, -4, 4);
        newY = constrain(newY, -4, 4);

        // Round to 0.5 increments for cleaner values
        newX = round(newX * 2) / 2;
        newY = round(newY * 2) / 2;

        if (dragging === 'u') {
            u.x = newX;
            u.y = newY;
        } else if (dragging === 'v') {
            v.x = newX;
            v.y = newY;
        }
    }
}

function mouseReleased() {
    dragging = null;
}

function resetVectors() {
    u = { x: 2, y: 1 };
    v = { x: 1, y: 2 };
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
    originX = canvasWidth / 2;
}
