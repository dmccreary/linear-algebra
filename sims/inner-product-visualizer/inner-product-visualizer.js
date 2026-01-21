// Inner Product Space Visualizer MicroSim
// Learning Objective: Visualize how different inner products define different notions of length and angle
// Shows standard dot product vs weighted inner products and their effect on geometry

// Canvas dimensions
let canvasWidth = 650;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

// Grid settings
let gridMin = -5;
let gridMax = 5;
let scale; // pixels per unit

// Vectors
let u = { x: 3, y: 1 };
let v = { x: 1, y: 2 };

// Weight matrix for weighted inner product (symmetric positive definite)
// W = [[w11, w12], [w12, w22]]
let w11 = 1;
let w12 = 0;
let w22 = 1;

// Inner product types
const IP_STANDARD = 0;
const IP_WEIGHTED_DIAG = 1;
const IP_WEIGHTED_GENERAL = 2;
let innerProductType = IP_STANDARD;

// UI elements
let ipSelector;
let w11Slider, w12Slider, w22Slider;
let w11Label, w12Label, w22Label;

// Dragging
let dragging = null;
let dragThreshold = 15;

// Colors
const colorU = [0, 100, 220];
const colorV = [220, 50, 50];
const colorUnitBall = [100, 180, 100];
const colorAngleArc = [255, 150, 0];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createControls();

    describe('Interactive visualization of inner product spaces showing how different inner products define length and angle');
}

function createControls() {
    const container = document.querySelector('main');

    // Inner product selector
    ipSelector = createSelect();
    ipSelector.parent(container);
    ipSelector.position(10, drawHeight + 15);
    ipSelector.option('Standard dot product', IP_STANDARD);
    ipSelector.option('Weighted (diagonal W)', IP_WEIGHTED_DIAG);
    ipSelector.option('Weighted (general W)', IP_WEIGHTED_GENERAL);
    ipSelector.changed(onIPChange);
    ipSelector.style('font-size', '13px');

    // Weight matrix sliders
    let sliderX = 220;
    let sliderY = drawHeight + 10;
    let sliderW = 100;

    // w11 slider
    w11Label = createSpan('w11: 1.0');
    w11Label.parent(container);
    w11Label.position(sliderX, sliderY);
    w11Label.style('font-size', '12px');
    w11Slider = createSlider(0.2, 3, 1, 0.1);
    w11Slider.parent(container);
    w11Slider.position(sliderX + 60, sliderY);
    w11Slider.size(sliderW);
    w11Slider.input(() => {
        w11 = w11Slider.value();
        w11Label.html('w11: ' + w11.toFixed(1));
    });

    // w22 slider
    w22Label = createSpan('w22: 1.0');
    w22Label.parent(container);
    w22Label.position(sliderX, sliderY + 25);
    w22Label.style('font-size', '12px');
    w22Slider = createSlider(0.2, 3, 1, 0.1);
    w22Slider.parent(container);
    w22Slider.position(sliderX + 60, sliderY + 25);
    w22Slider.size(sliderW);
    w22Slider.input(() => {
        w22 = w22Slider.value();
        w22Label.html('w22: ' + w22.toFixed(1));
    });

    // w12 slider (only for general weighted)
    w12Label = createSpan('w12: 0.0');
    w12Label.parent(container);
    w12Label.position(sliderX, sliderY + 50);
    w12Label.style('font-size', '12px');
    w12Slider = createSlider(-1, 1, 0, 0.1);
    w12Slider.parent(container);
    w12Slider.position(sliderX + 60, sliderY + 50);
    w12Slider.size(sliderW);
    w12Slider.input(() => {
        w12 = w12Slider.value();
        w12Label.html('w12: ' + w12.toFixed(1));
        // Ensure positive definiteness
        ensurePositiveDefinite();
    });

    // Initial visibility
    updateSliderVisibility();
}

function onIPChange() {
    innerProductType = parseInt(ipSelector.value());
    updateSliderVisibility();

    // Reset weights for standard
    if (innerProductType === IP_STANDARD) {
        w11 = 1; w12 = 0; w22 = 1;
        w11Slider.value(1);
        w12Slider.value(0);
        w22Slider.value(1);
        w11Label.html('w11: 1.0');
        w12Label.html('w12: 0.0');
        w22Label.html('w22: 1.0');
    }

    // Reset w12 for diagonal
    if (innerProductType === IP_WEIGHTED_DIAG) {
        w12 = 0;
        w12Slider.value(0);
        w12Label.html('w12: 0.0');
    }
}

function updateSliderVisibility() {
    let showWeights = innerProductType !== IP_STANDARD;
    let showW12 = innerProductType === IP_WEIGHTED_GENERAL;

    w11Slider.style('display', showWeights ? 'block' : 'none');
    w22Slider.style('display', showWeights ? 'block' : 'none');
    w11Label.style('display', showWeights ? 'block' : 'none');
    w22Label.style('display', showWeights ? 'block' : 'none');
    w12Slider.style('display', showW12 ? 'block' : 'none');
    w12Label.style('display', showW12 ? 'block' : 'none');
}

function ensurePositiveDefinite() {
    // For W to be positive definite: w11 > 0, w22 > 0, det(W) = w11*w22 - w12^2 > 0
    let maxW12 = sqrt(w11 * w22) - 0.01;
    if (abs(w12) >= maxW12) {
        w12 = sign(w12) * (maxW12 - 0.01);
        w12Slider.value(w12);
        w12Label.html('w12: ' + w12.toFixed(1));
    }
}

// Compute inner product <u, v>_W = u^T W v
function innerProduct(a, b) {
    if (innerProductType === IP_STANDARD) {
        return a.x * b.x + a.y * b.y;
    } else {
        // Weighted: [a.x, a.y] * [[w11, w12], [w12, w22]] * [b.x, b.y]^T
        return a.x * (w11 * b.x + w12 * b.y) + a.y * (w12 * b.x + w22 * b.y);
    }
}

// Compute norm ||v||_W = sqrt(<v, v>_W)
function norm(vec) {
    return sqrt(innerProduct(vec, vec));
}

// Compute angle between u and v using inner product
function angleBetween(a, b) {
    let ipUV = innerProduct(a, b);
    let normA = norm(a);
    let normB = norm(b);
    if (normA < 0.0001 || normB < 0.0001) return 0;
    let cosTheta = ipUV / (normA * normB);
    cosTheta = constrain(cosTheta, -1, 1);
    return acos(cosTheta);
}

function draw() {
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

    // Main drawing
    push();
    let centerX = (canvasWidth - 150) / 2;
    let centerY = drawHeight / 2;
    translate(centerX, centerY);

    drawGrid();
    drawAxes();
    drawUnitBall();
    drawAngleArc();
    drawVector(u, colorU, 'u');
    drawVector(v, colorV, 'v');
    drawDragPoints();

    pop();

    // Info panel
    drawInfoPanel();
    drawTitle();
    drawCauchySchwarz();
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
    textSize(14);
    textAlign(CENTER, TOP);
    noStroke();
    text('x', gridMax * scale + 20, 5);
    textAlign(RIGHT, CENTER);
    text('y', -10, -gridMax * scale + 5);

    // Tick labels
    textSize(10);
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

function drawUnitBall() {
    // Draw the unit "circle" for the current inner product
    // For standard: x^2 + y^2 = 1 (circle)
    // For weighted: x^T W x = 1 (ellipse)

    noFill();
    stroke(colorUnitBall[0], colorUnitBall[1], colorUnitBall[2]);
    strokeWeight(2);

    if (innerProductType === IP_STANDARD) {
        ellipse(0, 0, 2 * scale, 2 * scale);
    } else {
        // Draw ellipse for weighted inner product
        // Solve: w11*x^2 + 2*w12*x*y + w22*y^2 = 1
        drawWeightedUnitBall();
    }

    // Fill with transparency
    fill(colorUnitBall[0], colorUnitBall[1], colorUnitBall[2], 30);
    noStroke();
    if (innerProductType === IP_STANDARD) {
        ellipse(0, 0, 2 * scale, 2 * scale);
    } else {
        drawWeightedUnitBall(true);
    }
}

function drawWeightedUnitBall(filled = false) {
    // Parametric approach: find eigenvalues/eigenvectors of W
    // to determine ellipse orientation and semi-axes

    // W = [[w11, w12], [w12, w22]]
    // Eigenvalue decomposition for 2x2 symmetric matrix
    let trace = w11 + w22;
    let det = w11 * w22 - w12 * w12;
    let disc = trace * trace / 4 - det;
    if (disc < 0) disc = 0;

    let lambda1 = trace / 2 + sqrt(disc);
    let lambda2 = trace / 2 - sqrt(disc);

    // Semi-axes of ellipse are 1/sqrt(lambda)
    let a = 1 / sqrt(lambda2); // larger semi-axis
    let b = 1 / sqrt(lambda1); // smaller semi-axis

    // Angle of rotation (eigenvector direction)
    let theta = 0;
    if (abs(w12) > 0.001) {
        theta = atan2(lambda1 - w11, w12);
    } else if (w11 < w22) {
        theta = HALF_PI;
    }

    // Draw rotated ellipse
    push();
    rotate(-theta);
    if (filled) {
        fill(colorUnitBall[0], colorUnitBall[1], colorUnitBall[2], 30);
        noStroke();
    } else {
        noFill();
        stroke(colorUnitBall[0], colorUnitBall[1], colorUnitBall[2]);
        strokeWeight(2);
    }
    ellipse(0, 0, 2 * a * scale, 2 * b * scale);
    pop();
}

function drawAngleArc() {
    let theta = angleBetween(u, v);
    if (theta < 0.01) return;

    let uAngle = atan2(-u.y, u.x);
    let vAngle = atan2(-v.y, v.x);

    // Draw arc
    noFill();
    stroke(colorAngleArc[0], colorAngleArc[1], colorAngleArc[2]);
    strokeWeight(2);

    let radius = 30;

    // Determine arc direction
    let startAngle = uAngle;
    let endAngle = vAngle;

    // Ensure we draw the smaller arc
    let diff = endAngle - startAngle;
    while (diff > PI) diff -= TWO_PI;
    while (diff < -PI) diff += TWO_PI;

    if (diff > 0) {
        arc(0, 0, radius * 2, radius * 2, startAngle, startAngle + diff);
    } else {
        arc(0, 0, radius * 2, radius * 2, endAngle, endAngle - diff);
    }

    // Angle label
    let midAngle = (uAngle + vAngle) / 2;
    // Adjust for wrap-around
    if (abs(uAngle - vAngle) > PI) {
        midAngle += PI;
    }

    fill(colorAngleArc[0], colorAngleArc[1], colorAngleArc[2]);
    textSize(14);
    textAlign(CENTER, CENTER);
    noStroke();
    text('theta', cos(midAngle) * 50, sin(midAngle) * 50);
}

function drawVector(vec, col, label) {
    let sx = vec.x * scale;
    let sy = -vec.y * scale;

    // Vector line
    stroke(col[0], col[1], col[2]);
    strokeWeight(3);
    line(0, 0, sx, sy);

    // Arrowhead
    let angle = atan2(sy, sx);
    push();
    translate(sx, sy);
    rotate(angle);
    fill(col[0], col[1], col[2]);
    noStroke();
    triangle(0, 0, -12, -5, -12, 5);
    pop();

    // Label
    fill(col[0], col[1], col[2]);
    textSize(14);
    textAlign(CENTER, CENTER);
    noStroke();
    let labelX = sx / 2 - 15;
    let labelY = sy / 2 - 15;
    text(label, labelX, labelY);

    // Norm label at tip
    let normVal = norm(vec);
    textSize(11);
    textAlign(LEFT, CENTER);
    let tipOffsetX = 15 * cos(angle + 0.3);
    let tipOffsetY = 15 * sin(angle + 0.3);
    text('|' + label + '| = ' + normVal.toFixed(2), sx + tipOffsetX, sy + tipOffsetY);
}

function drawDragPoints() {
    // u drag point
    let ux = u.x * scale;
    let uy = -u.y * scale;
    noFill();
    stroke(colorU[0], colorU[1], colorU[2]);
    strokeWeight(2);
    ellipse(ux, uy, 14, 14);
    fill(255);
    noStroke();
    ellipse(ux, uy, 8, 8);

    // v drag point
    let vx = v.x * scale;
    let vy = -v.y * scale;
    noFill();
    stroke(colorV[0], colorV[1], colorV[2]);
    strokeWeight(2);
    ellipse(vx, vy, 14, 14);
    fill(255);
    noStroke();
    ellipse(vx, vy, 8, 8);
}

function drawInfoPanel() {
    let panelX = canvasWidth - 160;
    let panelY = 50;
    let panelW = 150;
    let panelH = 200;

    // Panel background
    fill(255, 255, 255, 245);
    stroke(220);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    // Calculate values
    let ipUV = innerProduct(u, v);
    let normU = norm(u);
    let normV = norm(v);
    let theta = angleBetween(u, v);

    // Content
    fill(0);
    textSize(13);
    textAlign(LEFT, TOP);
    noStroke();

    let x = panelX + 10;
    let y = panelY + 10;

    text('Inner Product:', x, y);
    y += 20;

    fill(colorU[0], colorU[1], colorU[2]);
    text('u = (' + u.x.toFixed(1) + ', ' + u.y.toFixed(1) + ')', x, y);
    y += 16;

    fill(colorV[0], colorV[1], colorV[2]);
    text('v = (' + v.x.toFixed(1) + ', ' + v.y.toFixed(1) + ')', x, y);
    y += 22;

    fill(0);
    text('<u, v> = ' + ipUV.toFixed(2), x, y);
    y += 20;

    fill(colorU[0], colorU[1], colorU[2]);
    text('||u|| = ' + normU.toFixed(2), x, y);
    y += 16;

    fill(colorV[0], colorV[1], colorV[2]);
    text('||v|| = ' + normV.toFixed(2), x, y);
    y += 22;

    fill(colorAngleArc[0], colorAngleArc[1], colorAngleArc[2]);
    text('Angle = ' + degrees(theta).toFixed(1) + ' deg', x, y);
    y += 20;

    // Weight matrix display for weighted inner products
    if (innerProductType !== IP_STANDARD) {
        fill(100);
        textSize(10);
        text('W = [' + w11.toFixed(1) + ', ' + w12.toFixed(1) + ']', x, y);
        y += 12;
        text('    [' + w12.toFixed(1) + ', ' + w22.toFixed(1) + ']', x, y);
    }
}

function drawTitle() {
    fill(0);
    textSize(18);
    textAlign(CENTER, TOP);
    noStroke();
    let centerX = (canvasWidth - 150) / 2;
    text('Inner Product Space Visualizer', centerX, 10);

    fill(100);
    textSize(11);
    text('Drag vector endpoints to explore', centerX, 32);
}

function drawCauchySchwarz() {
    // Verify Cauchy-Schwarz: |<u,v>| <= ||u|| * ||v||
    let ipUV = innerProduct(u, v);
    let normU = norm(u);
    let normV = norm(v);
    let lhs = abs(ipUV);
    let rhs = normU * normV;

    // Display in control area
    fill(80);
    textSize(11);
    textAlign(LEFT, TOP);
    noStroke();

    let x = 400;
    let y = drawHeight + 15;

    text('Cauchy-Schwarz:', x, y);
    y += 16;

    text('|<u,v>| = ' + lhs.toFixed(2), x, y);
    y += 14;
    text('||u||||v|| = ' + rhs.toFixed(2), x, y);
    y += 16;

    // Status indicator
    if (lhs <= rhs + 0.01) {
        fill(50, 180, 50);
        text('Satisfied! (<=)', x, y);
    } else {
        fill(220, 50, 50);
        text('Check failed', x, y);
    }

    // Equality case
    y += 16;
    fill(100);
    if (abs(lhs - rhs) < 0.1) {
        text('Equality: u, v collinear', x, y);
    }
}

function mousePressed() {
    let centerX = (canvasWidth - 150) / 2;
    let centerY = drawHeight / 2;

    // Check u endpoint
    let ux = centerX + u.x * scale;
    let uy = centerY - u.y * scale;
    if (dist(mouseX, mouseY, ux, uy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'u';
        return;
    }

    // Check v endpoint
    let vx = centerX + v.x * scale;
    let vy = centerY - v.y * scale;
    if (dist(mouseX, mouseY, vx, vy) < dragThreshold && mouseY < drawHeight) {
        dragging = 'v';
        return;
    }
}

function mouseDragged() {
    if (dragging && mouseY < drawHeight) {
        let centerX = (canvasWidth - 150) / 2;
        let centerY = drawHeight / 2;

        let gx = (mouseX - centerX) / scale;
        let gy = -(mouseY - centerY) / scale;

        // Snap to half-grid for easier positioning
        gx = round(gx * 2) / 2;
        gy = round(gy * 2) / 2;
        gx = constrain(gx, gridMin + 0.5, gridMax - 0.5);
        gy = constrain(gy, gridMin + 0.5, gridMax - 0.5);

        if (dragging === 'u') {
            u.x = gx;
            u.y = gy;
        } else if (dragging === 'v') {
            v.x = gx;
            v.y = gy;
        }
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
        canvasWidth = Math.max(500, container.offsetWidth);
    }
}
