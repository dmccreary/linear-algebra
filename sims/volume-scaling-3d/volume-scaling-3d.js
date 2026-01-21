// 3D Volume Scaling Visualizer
// Shows how 3×3 matrix transformations scale volume using WEBGL

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// 3×3 matrix (diagonal scaling by default)
let matrix = [
    [2, 0, 0],
    [0, 1.5, 0],
    [0, 0, 1]
];

// Camera rotation
let rotX = 0.5;
let rotY = 0.5;
let isDragging = false;
let lastMouseX, lastMouseY;

// Animation
let morphT = 1.0;

// Controls
let morphSlider;
let rotationButton;
let scalingButton;
let singularButton;
let showCubeCheckbox;

// Font for WEBGL text
let font;

function preload() {
    // Load font for WEBGL text
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    const container = document.querySelector('main');
    canvas.parent(container);

    textFont(font);

    // Create controls and parent to container
    scalingButton = createButton('Scaling');
    scalingButton.parent(container);
    scalingButton.position(10, drawHeight + 10);
    scalingButton.mousePressed(setScaling);

    rotationButton = createButton('Rotation');
    rotationButton.parent(container);
    rotationButton.position(80, drawHeight + 10);
    rotationButton.mousePressed(setRotation);

    singularButton = createButton('Singular');
    singularButton.parent(container);
    singularButton.position(160, drawHeight + 10);
    singularButton.mousePressed(setSingular);

    morphSlider = createSlider(0, 1, 1, 0.01);
    morphSlider.parent(container);
    morphSlider.position(sliderLeftMargin, drawHeight + 45);
    morphSlider.size(canvasWidth - sliderLeftMargin - margin);

    showCubeCheckbox = createCheckbox(' Show Unit Cube', true);
    showCubeCheckbox.parent(container);
    showCubeCheckbox.position(10, drawHeight + 50);
    showCubeCheckbox.style('font-size', '14px');

    describe('3D visualization showing how matrix transformations scale volume, with interactive camera rotation', LABEL);
}

function draw() {
    updateCanvasSize();

    morphT = morphSlider.value();

    // Background
    background(240, 248, 255); // aliceblue

    // Draw 2D control area overlay
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Control area background
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Border for drawing area
    stroke(192, 192, 192);
    strokeWeight(1);
    noFill();
    rect(0, 0, canvasWidth, drawHeight);

    // Draw title
    fill(0);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('3D Volume Scaling Visualizer', canvasWidth / 2, 10);

    // Draw control labels
    textSize(12);
    textAlign(LEFT, CENTER);
    text('Morph: ' + (morphT * 100).toFixed(0) + '%', sliderLeftMargin - 60, drawHeight + 55);

    pop();

    // Setup 3D view
    translate(0, -40, 0);

    // Apply camera rotation
    rotateX(rotX);
    rotateY(rotY);

    // Calculate interpolated matrix
    let identity = [[1,0,0], [0,1,0], [0,0,1]];
    let interpMatrix = interpolateMatrix3(identity, matrix, morphT);

    // Calculate determinant
    let det = det3x3(interpMatrix);

    // Draw coordinate axes
    drawAxes3D();

    // Draw unit cube if enabled
    if (showCubeCheckbox.checked()) {
        drawUnitCube(0.3);
    }

    // Draw transformed parallelepiped
    drawTransformedParallelepiped(interpMatrix, det);

    // Draw info overlay
    drawInfoOverlay(interpMatrix, det);

    // Update control positions
    morphSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function drawAxes3D() {
    let axisLen = 150;

    strokeWeight(2);

    // X axis (red)
    stroke(200, 50, 50);
    line(0, 0, 0, axisLen, 0, 0);

    // Y axis (green)
    stroke(50, 200, 50);
    line(0, 0, 0, 0, -axisLen, 0);

    // Z axis (blue)
    stroke(50, 50, 200);
    line(0, 0, 0, 0, 0, axisLen);

    // Axis labels
    push();
    textSize(14);
    fill(200, 50, 50);
    noStroke();
    translate(axisLen + 10, 0, 0);
    rotateY(PI/2);
    text('x', 0, 0);
    pop();

    push();
    fill(50, 200, 50);
    noStroke();
    translate(0, -axisLen - 15, 0);
    text('y', 0, 0);
    pop();

    push();
    fill(50, 50, 200);
    noStroke();
    translate(0, 0, axisLen + 10);
    rotateY(-PI/2);
    text('z', 0, 0);
    pop();
}

function drawUnitCube(alpha) {
    let s = 50; // scale

    stroke(100, 100, 100, alpha * 255);
    strokeWeight(1);
    noFill();

    // Draw edges of unit cube
    // Bottom face
    line(0, 0, 0, s, 0, 0);
    line(s, 0, 0, s, 0, s);
    line(s, 0, s, 0, 0, s);
    line(0, 0, s, 0, 0, 0);

    // Top face
    line(0, -s, 0, s, -s, 0);
    line(s, -s, 0, s, -s, s);
    line(s, -s, s, 0, -s, s);
    line(0, -s, s, 0, -s, 0);

    // Vertical edges
    line(0, 0, 0, 0, -s, 0);
    line(s, 0, 0, s, -s, 0);
    line(s, 0, s, s, -s, s);
    line(0, 0, s, 0, -s, s);
}

function drawTransformedParallelepiped(mat, det) {
    let s = 50; // scale

    // Get transformed basis vectors (scaled)
    let e1 = { x: mat[0][0] * s, y: -mat[1][0] * s, z: mat[2][0] * s };
    let e2 = { x: mat[0][1] * s, y: -mat[1][1] * s, z: mat[2][1] * s };
    let e3 = { x: mat[0][2] * s, y: -mat[1][2] * s, z: mat[2][2] * s };

    // Vertices of parallelepiped
    let v000 = { x: 0, y: 0, z: 0 };
    let v100 = e1;
    let v010 = e2;
    let v001 = e3;
    let v110 = { x: e1.x + e2.x, y: e1.y + e2.y, z: e1.z + e2.z };
    let v101 = { x: e1.x + e3.x, y: e1.y + e3.y, z: e1.z + e3.z };
    let v011 = { x: e2.x + e3.x, y: e2.y + e3.y, z: e2.z + e3.z };
    let v111 = { x: e1.x + e2.x + e3.x, y: e1.y + e2.y + e3.y, z: e1.z + e2.z + e3.z };

    // Color based on determinant sign
    let fillCol, strokeCol;
    if (Math.abs(det) < 0.01) {
        fillCol = color(150, 150, 150, 100);
        strokeCol = color(100, 100, 100);
    } else if (det > 0) {
        fillCol = color(100, 200, 100, 100);
        strokeCol = color(50, 150, 50);
    } else {
        fillCol = color(200, 100, 100, 100);
        strokeCol = color(150, 50, 50);
    }

    // Draw faces
    fill(fillCol);
    stroke(strokeCol);
    strokeWeight(2);

    // Front face (z=0)
    beginShape();
    vertex(v000.x, v000.y, v000.z);
    vertex(v100.x, v100.y, v100.z);
    vertex(v110.x, v110.y, v110.z);
    vertex(v010.x, v010.y, v010.z);
    endShape(CLOSE);

    // Back face (z=1)
    beginShape();
    vertex(v001.x, v001.y, v001.z);
    vertex(v101.x, v101.y, v101.z);
    vertex(v111.x, v111.y, v111.z);
    vertex(v011.x, v011.y, v011.z);
    endShape(CLOSE);

    // Bottom face (y=0)
    beginShape();
    vertex(v000.x, v000.y, v000.z);
    vertex(v100.x, v100.y, v100.z);
    vertex(v101.x, v101.y, v101.z);
    vertex(v001.x, v001.y, v001.z);
    endShape(CLOSE);

    // Top face (y=1)
    beginShape();
    vertex(v010.x, v010.y, v010.z);
    vertex(v110.x, v110.y, v110.z);
    vertex(v111.x, v111.y, v111.z);
    vertex(v011.x, v011.y, v011.z);
    endShape(CLOSE);

    // Left face (x=0)
    beginShape();
    vertex(v000.x, v000.y, v000.z);
    vertex(v010.x, v010.y, v010.z);
    vertex(v011.x, v011.y, v011.z);
    vertex(v001.x, v001.y, v001.z);
    endShape(CLOSE);

    // Right face (x=1)
    beginShape();
    vertex(v100.x, v100.y, v100.z);
    vertex(v110.x, v110.y, v110.z);
    vertex(v111.x, v111.y, v111.z);
    vertex(v101.x, v101.y, v101.z);
    endShape(CLOSE);

    // Draw column vectors as arrows
    strokeWeight(3);

    // e1 (red)
    stroke(220, 60, 60);
    line(0, 0, 0, e1.x, e1.y, e1.z);

    // e2 (green)
    stroke(60, 180, 60);
    line(0, 0, 0, e2.x, e2.y, e2.z);

    // e3 (blue)
    stroke(60, 60, 220);
    line(0, 0, 0, e3.x, e3.y, e3.z);
}

function drawInfoOverlay(mat, det) {
    // Draw info panel in screen space
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    let panelX = canvasWidth - 140;
    let panelY = 45;
    let panelW = 130;
    let panelH = 100;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 10);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    text('det(A) = ' + det.toFixed(2), panelX + 10, panelY + 10);
    text('|det| = ' + Math.abs(det).toFixed(2), panelX + 10, panelY + 30);

    textSize(11);
    text('Volume ratio:', panelX + 10, panelY + 52);
    text("V'/V = " + Math.abs(det).toFixed(2), panelX + 10, panelY + 68);

    // Status
    textSize(12);
    if (Math.abs(det) < 0.01) {
        fill(150, 50, 50);
        text('Singular', panelX + 10, panelY + 85);
    } else if (det > 0) {
        fill(50, 150, 50);
        text('Orientation +', panelX + 10, panelY + 85);
    } else {
        fill(150, 50, 150);
        text('Orientation -', panelX + 10, panelY + 85);
    }

    // Instructions
    fill(100);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text('Drag to rotate view', canvasWidth/2, drawHeight - 5);

    pop();
}

function interpolateMatrix3(m1, m2, t) {
    let result = [];
    for (let i = 0; i < 3; i++) {
        result.push([]);
        for (let j = 0; j < 3; j++) {
            result[i][j] = m1[i][j] * (1-t) + m2[i][j] * t;
        }
    }
    return result;
}

function det3x3(m) {
    return m[0][0] * (m[1][1]*m[2][2] - m[1][2]*m[2][1])
         - m[0][1] * (m[1][0]*m[2][2] - m[1][2]*m[2][0])
         + m[0][2] * (m[1][0]*m[2][1] - m[1][1]*m[2][0]);
}

function setScaling() {
    matrix = [[2, 0, 0], [0, 1.5, 0], [0, 0, 1]];
    morphSlider.value(0);
}

function setRotation() {
    // Rotation around z-axis by 45 degrees
    let c = cos(PI/4);
    let s = sin(PI/4);
    matrix = [[c, -s, 0], [s, c, 0], [0, 0, 1]];
    morphSlider.value(0);
}

function setSingular() {
    // Singular: third column is sum of first two
    matrix = [[1, 0, 1], [0, 1, 1], [1, 1, 2]];
    morphSlider.value(0);
}

function mousePressed() {
    if (mouseY < drawHeight && mouseY > 0 && mouseX > 0 && mouseX < canvasWidth) {
        isDragging = true;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseDragged() {
    if (isDragging) {
        let dx = mouseX - lastMouseX;
        let dy = mouseY - lastMouseY;

        rotY += dx * 0.01;
        rotX += dy * 0.01;

        rotX = constrain(rotX, -PI/2, PI/2);

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseReleased() {
    isDragging = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    morphSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
