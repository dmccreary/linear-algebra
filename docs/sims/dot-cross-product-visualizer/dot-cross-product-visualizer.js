// Dot Product and Cross Product Visualizer MicroSim
// Learning Objective: Students will analyze the geometric relationship between
// dot product (projection and angle) and cross product (perpendicular vector and area).

// Canvas dimensions
let canvasWidth = 650;
let drawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 140;

// View state
let is3DView = false;

// 2D vectors
let u2D = { x: 3, y: 2 };
let v2D = { x: 4, y: 1 };

// 3D vectors (for cross product)
let u3D = { x: 3, y: 2, z: 0 };
let v3D = { x: 1, y: 4, z: 0 };

// Display options
let showProjection = true;
let showParallelogram = true;
let showFormula = true;

// 3D rotation
let rotationX = -0.5;
let rotationY = 0.6;

// Animation
let animating = false;
let animAngle = 0;

// Scale
let scale2D = 30;
let scale3D = 25;

// UI elements
let toggleViewButton;
let projectionCheckbox, parallelogramCheckbox, formulaCheckbox;
let animateButton;

// Dragging
let dragging = null;
let dragThreshold = 15;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent(document.querySelector('main'));

    createControls();

    describe('Interactive visualization comparing dot product and cross product of vectors');
}

function createControls() {
    // Toggle view button
    toggleViewButton = createButton('Show Cross Product (3D)');
    toggleViewButton.position(10, drawHeight + 15);
    toggleViewButton.mousePressed(toggleView);

    // Checkboxes
    projectionCheckbox = createCheckbox(' Show Projection', true);
    projectionCheckbox.position(10, drawHeight + 50);
    projectionCheckbox.changed(() => showProjection = projectionCheckbox.checked());

    parallelogramCheckbox = createCheckbox(' Show Parallelogram', true);
    parallelogramCheckbox.position(10, drawHeight + 75);
    parallelogramCheckbox.changed(() => showParallelogram = parallelogramCheckbox.checked());

    formulaCheckbox = createCheckbox(' Show Formula', true);
    formulaCheckbox.position(10, drawHeight + 100);
    formulaCheckbox.changed(() => showFormula = formulaCheckbox.checked());

    // Animate button
    animateButton = createButton('Animate Angle Sweep');
    animateButton.position(200, drawHeight + 15);
    animateButton.mousePressed(startAnimation);
}

function toggleView() {
    is3DView = !is3DView;
    toggleViewButton.html(is3DView ? 'Show Dot Product (2D)' : 'Show Cross Product (3D)');
}

function startAnimation() {
    animating = true;
    animAngle = 0;
}

function draw() {
    // Update animation
    if (animating) {
        animAngle += 0.02;
        if (animAngle >= PI) {
            animAngle = PI;
            animating = false;
        }
        // Rotate v around origin
        let mag = sqrt(v2D.x * v2D.x + v2D.y * v2D.y);
        let baseAngle = atan2(u2D.y, u2D.x);
        v2D.x = mag * cos(baseAngle + animAngle);
        v2D.y = mag * sin(baseAngle + animAngle);
        // Update 3D vectors
        v3D.x = v2D.x;
        v3D.y = v2D.y;
    }

    resetMatrix();
    background(245);

    if (is3DView) {
        draw3DView();
    } else {
        draw2DView();
    }

    drawControlArea();
}

function draw2DView() {
    push();
    translate(0, -controlHeight/2);

    // Draw grid
    drawGrid2D();

    // Draw axes
    drawAxes2D();

    // Calculate dot product
    let dotProduct = u2D.x * v2D.x + u2D.y * v2D.y;
    let magU = sqrt(u2D.x * u2D.x + u2D.y * u2D.y);
    let magV = sqrt(v2D.x * v2D.x + v2D.y * v2D.y);
    let cosTheta = dotProduct / (magU * magV);
    cosTheta = constrain(cosTheta, -1, 1);
    let theta = acos(cosTheta);

    // Draw angle arc
    drawAngleArc(theta);

    // Draw projection if enabled
    if (showProjection) {
        drawProjection2D(dotProduct, magU);
    }

    // Draw vectors
    drawVector2D(0, 0, u2D.x, u2D.y, color(0, 100, 220), 'u');
    drawVector2D(0, 0, v2D.x, v2D.y, color(220, 50, 50), 'v');

    // Draw drag points
    drawDragPoint2D(u2D.x, u2D.y, color(0, 100, 220));
    drawDragPoint2D(v2D.x, v2D.y, color(220, 50, 50));

    pop();

    // Draw info panel
    drawDotProductInfo(dotProduct, magU, magV, theta);

    // Draw title
    drawTitle2D();
}

function draw3DView() {
    push();
    translate(0, -controlHeight/2);
    rotateX(rotationX);
    rotateY(rotationY);

    // Draw grid
    drawGrid3D();

    // Draw axes
    drawAxes3D();

    // Calculate cross product
    let cross = {
        x: u3D.y * v3D.z - u3D.z * v3D.y,
        y: u3D.z * v3D.x - u3D.x * v3D.z,
        z: u3D.x * v3D.y - u3D.y * v3D.x
    };
    let crossMag = sqrt(cross.x*cross.x + cross.y*cross.y + cross.z*cross.z);

    // Draw parallelogram if enabled
    if (showParallelogram) {
        drawParallelogram3D();
    }

    // Draw vectors
    drawVector3D(0, 0, 0, u3D.x, u3D.y, u3D.z, color(0, 100, 220), 'u');
    drawVector3D(0, 0, 0, v3D.x, v3D.y, v3D.z, color(220, 50, 50), 'v');

    // Draw cross product vector
    if (crossMag > 0.01) {
        drawVector3D(0, 0, 0, cross.x, cross.y, cross.z, color(50, 180, 50), 'u×v');
    }

    pop();

    // Draw info panel
    drawCrossProductInfo(cross, crossMag);

    // Draw title
    drawTitle3D();
}

function drawGrid2D() {
    stroke(230);
    strokeWeight(1);
    for (let i = -6; i <= 6; i++) {
        line(i * scale2D, -6 * scale2D, i * scale2D, 6 * scale2D);
        line(-6 * scale2D, i * scale2D, 6 * scale2D, i * scale2D);
    }
}

function drawAxes2D() {
    strokeWeight(2);

    // X-axis
    stroke(150);
    line(-6.5 * scale2D, 0, 6.5 * scale2D, 0);
    fill(150);
    noStroke();
    triangle(6.5 * scale2D + 5, 0, 6.5 * scale2D - 5, -4, 6.5 * scale2D - 5, 4);

    // Y-axis
    stroke(150);
    line(0, 6.5 * scale2D, 0, -6.5 * scale2D);
    fill(150);
    noStroke();
    triangle(0, -6.5 * scale2D - 5, -4, -6.5 * scale2D + 5, 4, -6.5 * scale2D + 5);
}

function drawAngleArc(theta) {
    noFill();
    stroke(255, 150, 0);
    strokeWeight(2);

    let radius = 40;
    let uAngle = atan2(-u2D.y, u2D.x); // Screen Y is inverted
    let vAngle = atan2(-v2D.y, v2D.x);

    arc(0, 0, radius * 2, radius * 2, min(uAngle, vAngle), max(uAngle, vAngle));

    // Draw theta label
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);
    fill(255, 150, 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    noStroke();
    let labelAngle = (uAngle + vAngle) / 2;
    let labelX = canvasWidth/2 + cos(labelAngle) * 60;
    let labelY = drawHeight/2 + sin(labelAngle) * 60;
    text('θ', labelX, labelY);
    pop();
}

function drawProjection2D(dotProduct, magU) {
    // Projection of v onto u
    let projLength = dotProduct / magU;
    let uHat = { x: u2D.x / magU, y: u2D.y / magU };

    // Draw projection line
    stroke(150, 100, 200);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);

    let vx = v2D.x * scale2D;
    let vy = -v2D.y * scale2D;
    let projX = projLength * uHat.x * scale2D;
    let projY = -projLength * uHat.y * scale2D;

    line(vx, vy, projX, projY);
    drawingContext.setLineDash([]);

    // Draw projection vector
    stroke(150, 100, 200);
    strokeWeight(3);
    line(0, 0, projX, projY);

    // Draw projection point
    fill(150, 100, 200);
    noStroke();
    ellipse(projX, projY, 8, 8);

    // Label
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);
    fill(150, 100, 200);
    textSize(12);
    textAlign(LEFT, CENTER);
    noStroke();
    text('proj', canvasWidth/2 + projX + 10, drawHeight/2 + projY);
    pop();
}

function drawVector2D(x1, y1, x2, y2, col, label) {
    let sx1 = x1 * scale2D;
    let sy1 = -y1 * scale2D;
    let sx2 = x2 * scale2D;
    let sy2 = -y2 * scale2D;

    stroke(col);
    strokeWeight(3);
    line(sx1, sy1, sx2, sy2);

    // Arrowhead
    let angle = atan2(sy2 - sy1, sx2 - sx1);
    push();
    translate(sx2, sy2);
    rotate(angle);
    fill(col);
    noStroke();
    triangle(0, 0, -12, -5, -12, 5);
    pop();

    // Label
    if (label) {
        push();
        resetMatrix();
        translate(-canvasWidth/2, -canvasHeight/2);
        fill(col);
        textSize(14);
        textAlign(CENTER, CENTER);
        noStroke();
        let lx = canvasWidth/2 + (sx1 + sx2)/2 - 15;
        let ly = drawHeight/2 + (sy1 + sy2)/2 - 15;
        text(label, lx, ly);
        pop();
    }
}

function drawDragPoint2D(x, y, col) {
    let sx = x * scale2D;
    let sy = -y * scale2D;

    noFill();
    stroke(col);
    strokeWeight(2);
    ellipse(sx, sy, 14, 14);

    fill(255);
    noStroke();
    ellipse(sx, sy, 8, 8);
}

function drawGrid3D() {
    stroke(220);
    strokeWeight(1);
    for (let i = -5; i <= 5; i++) {
        line(i * scale3D, -5 * scale3D, 0, i * scale3D, 5 * scale3D, 0);
        line(-5 * scale3D, i * scale3D, 0, 5 * scale3D, i * scale3D, 0);
    }
}

function drawAxes3D() {
    strokeWeight(2);

    // X-axis (red)
    stroke(200, 100, 100);
    line(0, 0, 0, 6 * scale3D, 0, 0);

    // Y-axis (green)
    stroke(100, 200, 100);
    line(0, 0, 0, 0, -6 * scale3D, 0);

    // Z-axis (blue)
    stroke(100, 100, 200);
    line(0, 0, 0, 0, 0, 6 * scale3D);
}

function drawParallelogram3D() {
    // Draw filled parallelogram
    fill(200, 200, 100, 100);
    stroke(200, 200, 100);
    strokeWeight(1);

    let ux = u3D.x * scale3D;
    let uy = -u3D.y * scale3D;
    let uz = u3D.z * scale3D;
    let vx = v3D.x * scale3D;
    let vy = -v3D.y * scale3D;
    let vz = v3D.z * scale3D;

    beginShape();
    vertex(0, 0, 0);
    vertex(ux, uy, uz);
    vertex(ux + vx, uy + vy, uz + vz);
    vertex(vx, vy, vz);
    endShape(CLOSE);
}

function drawVector3D(x1, y1, z1, x2, y2, z2, col, label) {
    let sx1 = x1 * scale3D;
    let sy1 = -y1 * scale3D;
    let sz1 = z1 * scale3D;
    let sx2 = x2 * scale3D;
    let sy2 = -y2 * scale3D;
    let sz2 = z2 * scale3D;

    stroke(col);
    strokeWeight(3);
    line(sx1, sy1, sz1, sx2, sy2, sz2);

    // Draw cone at tip
    push();
    translate(sx2, sy2, sz2);

    let v = createVector(sx2 - sx1, sy2 - sy1, sz2 - sz1).normalize();
    let up = createVector(0, -1, 0);
    let axis = up.cross(v);
    let angle = acos(constrain(up.dot(v), -1, 1));
    if (axis.mag() > 0.001) {
        rotate(angle, axis);
    } else if (sy2 > sy1) {
        rotateX(PI);
    }

    fill(col);
    noStroke();
    cone(5, 15);
    pop();
}

function drawDotProductInfo(dotProduct, magU, magV, theta) {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    let panelX = canvasWidth - 200;
    let panelY = 40;

    // Panel background
    fill(255, 255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, 190, showFormula ? 160 : 100, 8);

    // Content
    fill(0);
    textSize(14);
    textAlign(LEFT, TOP);
    noStroke();

    let y = panelY + 10;
    text('Dot Product:', panelX + 10, y);
    y += 22;

    fill(0, 100, 220);
    text('u = (' + u2D.x.toFixed(1) + ', ' + u2D.y.toFixed(1) + ')', panelX + 10, y);
    y += 18;

    fill(220, 50, 50);
    text('v = (' + v2D.x.toFixed(1) + ', ' + v2D.y.toFixed(1) + ')', panelX + 10, y);
    y += 22;

    fill(0);
    text('u · v = ' + dotProduct.toFixed(2), panelX + 10, y);
    y += 18;

    fill(255, 150, 0);
    text('θ = ' + degrees(theta).toFixed(1) + '°', panelX + 10, y);

    if (showFormula) {
        y += 25;
        fill(100);
        textSize(11);
        text('u · v = |u||v|cos(θ)', panelX + 10, y);
        y += 15;
        text('= ' + magU.toFixed(2) + ' × ' + magV.toFixed(2) + ' × ' + cos(theta).toFixed(2), panelX + 10, y);
        y += 15;
        text('= ' + (magU * magV * cos(theta)).toFixed(2), panelX + 10, y);
    }

    // Highlight when perpendicular
    if (abs(dotProduct) < 0.1) {
        fill(50, 200, 50);
        textSize(12);
        text('⟂ Perpendicular!', panelX + 10, panelY + (showFormula ? 145 : 90));
    }

    pop();
}

function drawCrossProductInfo(cross, crossMag) {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    let panelX = canvasWidth - 210;
    let panelY = 40;

    // Panel background
    fill(255, 255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, 200, showFormula ? 180 : 120, 8);

    // Content
    fill(0);
    textSize(14);
    textAlign(LEFT, TOP);
    noStroke();

    let y = panelY + 10;
    text('Cross Product:', panelX + 10, y);
    y += 22;

    fill(0, 100, 220);
    text('u = (' + u3D.x.toFixed(1) + ', ' + u3D.y.toFixed(1) + ', ' + u3D.z.toFixed(1) + ')', panelX + 10, y);
    y += 18;

    fill(220, 50, 50);
    text('v = (' + v3D.x.toFixed(1) + ', ' + v3D.y.toFixed(1) + ', ' + v3D.z.toFixed(1) + ')', panelX + 10, y);
    y += 22;

    fill(50, 180, 50);
    text('u × v = (' + cross.x.toFixed(1) + ', ' + cross.y.toFixed(1) + ', ' + cross.z.toFixed(1) + ')', panelX + 10, y);
    y += 18;

    fill(0);
    text('|u × v| = ' + crossMag.toFixed(2), panelX + 10, y);
    y += 18;
    text('(Area of parallelogram)', panelX + 10, y);

    if (showFormula) {
        y += 22;
        fill(100);
        textSize(10);
        text('u × v = (u₂v₃-u₃v₂, u₃v₁-u₁v₃, u₁v₂-u₂v₁)', panelX + 10, y);
    }

    pop();
}

function drawTitle2D() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);
    fill(0);
    textSize(18);
    textAlign(CENTER, TOP);
    noStroke();
    text('Dot Product Visualizer', canvasWidth/2 - 50, 10);

    fill(100);
    textSize(11);
    text('Drag vector endpoints', canvasWidth/2 - 50, 32);
    pop();
}

function drawTitle3D() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);
    fill(0);
    textSize(18);
    textAlign(CENTER, TOP);
    noStroke();
    text('Cross Product Visualizer', canvasWidth/2 - 50, 10);

    fill(100);
    textSize(11);
    text('Drag to rotate view', canvasWidth/2 - 50, 32);
    pop();
}

function drawControlArea() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Background
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Border
    stroke(200);
    strokeWeight(1);
    line(0, drawHeight, canvasWidth, drawHeight);

    pop();
}

function mousePressed() {
    if (!is3DView && mouseY < drawHeight) {
        let centerX = canvasWidth / 2;
        let centerY = drawHeight / 2;

        // Check u endpoint
        let usx = centerX + u2D.x * scale2D;
        let usy = centerY - u2D.y * scale2D;
        if (dist(mouseX, mouseY, usx, usy) < dragThreshold) {
            dragging = 'u';
            return;
        }

        // Check v endpoint
        let vsx = centerX + v2D.x * scale2D;
        let vsy = centerY - v2D.y * scale2D;
        if (dist(mouseX, mouseY, vsx, vsy) < dragThreshold) {
            dragging = 'v';
            return;
        }
    }
}

function mouseDragged() {
    if (is3DView && mouseY < drawHeight) {
        // 3D rotation
        rotationY += (mouseX - pmouseX) * 0.01;
        rotationX += (mouseY - pmouseY) * 0.01;
        rotationX = constrain(rotationX, -PI/2, PI/2);
    } else if (dragging && mouseY < drawHeight) {
        let centerX = canvasWidth / 2;
        let centerY = drawHeight / 2;

        let gx = (mouseX - centerX) / scale2D;
        let gy = -(mouseY - centerY) / scale2D;

        gx = round(gx * 2) / 2;
        gy = round(gy * 2) / 2;
        gx = constrain(gx, -5.5, 5.5);
        gy = constrain(gy, -5.5, 5.5);

        if (dragging === 'u') {
            u2D.x = gx;
            u2D.y = gy;
            u3D.x = gx;
            u3D.y = gy;
        } else if (dragging === 'v') {
            v2D.x = gx;
            v2D.y = gy;
            v3D.x = gx;
            v3D.y = gy;
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
