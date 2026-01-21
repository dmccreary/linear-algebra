// Eigenspace Visualization
// 3D visualization of eigenspaces as subspaces (lines and planes)
// Shows how geometric multiplicity relates to eigenspace dimension

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Camera rotation
let rotX = -0.4;
let rotY = 0.5;
let isDragging = false;
let lastMouseX, lastMouseY;

// Grid and scale
let gridScale = 80;

// Matrix examples
let currentExample = 0;
let examples = [
    {
        name: "3 Distinct Eigenvalues",
        matrix: [[2, 0, 0], [0, 3, 0], [0, 0, 4]],
        eigenvalues: [2, 3, 4],
        eigenvectors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        eigenspaceTypes: ['line', 'line', 'line'],
        description: "Each eigenspace is a 1D line"
    },
    {
        name: "Repeated Eigenvalue (2D space)",
        matrix: [[3, 0, 0], [0, 3, 0], [0, 0, 5]],
        eigenvalues: [3, 3, 5],
        eigenvectors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        eigenspaceTypes: ['plane-xy', 'line'],
        description: "λ=3 has 2D eigenspace (plane)"
    },
    {
        name: "General Symmetric",
        matrix: [[2, 1, 0], [1, 2, 1], [0, 1, 2]],
        eigenvalues: [2 - Math.sqrt(2), 2, 2 + Math.sqrt(2)],
        eigenvectors: [
            normalize([1, -Math.sqrt(2), 1]),
            normalize([1, 0, -1]),
            normalize([1, Math.sqrt(2), 1])
        ],
        eigenspaceTypes: ['line', 'line', 'line'],
        description: "Orthogonal eigenvectors"
    },
    {
        name: "Rotation-like",
        matrix: [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
        eigenvalues: [1],
        eigenvectors: [[1, 0, 0]],
        eigenspaceTypes: ['line'],
        description: "λ=1 axis, rotation in yz-plane"
    }
];

// Controls
let prevButton, nextButton;
let showGridCheckbox;
let showVectorsCheckbox;

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

    // Create controls
    const container = document.querySelector('main');

    prevButton = createButton('← Prev');
    prevButton.parent(container);
    prevButton.position(10, drawHeight + 10);
    prevButton.mousePressed(() => {
        currentExample = (currentExample - 1 + examples.length) % examples.length;
    });

    nextButton = createButton('Next →');
    nextButton.parent(container);
    nextButton.position(75, drawHeight + 10);
    nextButton.mousePressed(() => {
        currentExample = (currentExample + 1) % examples.length;
    });

    showGridCheckbox = createCheckbox(' Show Grid', true);
    showGridCheckbox.parent(container);
    showGridCheckbox.position(150, drawHeight + 10);
    showGridCheckbox.style('font-size', '14px');

    showVectorsCheckbox = createCheckbox(' Show Vectors', true);
    showVectorsCheckbox.parent(container);
    showVectorsCheckbox.position(260, drawHeight + 10);
    showVectorsCheckbox.style('font-size', '14px');

    describe('3D visualization of eigenspaces showing how eigenvectors span lines or planes through the origin', LABEL);
}

function draw() {
    updateCanvasSize();

    // Move origin to top-left for 2D drawing
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Drawing area background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    textFont(font);
    text('Eigenspace Visualization', canvasWidth/2, 8);

    // Example name and description
    let ex = examples[currentExample];
    textSize(13);
    text(ex.name, canvasWidth/2, 28);
    textSize(11);
    fill(100);
    text(ex.description, canvasWidth/2, 45);

    // Legend
    drawLegend();

    // Control area text
    fill(100);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Drag to rotate view', 10, drawHeight + 45);
    text('Example ' + (currentExample + 1) + '/' + examples.length, 10, drawHeight + 62);

    pop();

    // 3D scene
    push();
    translate(0, -30, 0);
    rotateX(rotX);
    rotateY(rotY);

    // Draw 3D content
    if (showGridCheckbox.checked()) {
        drawGrid3D();
    }
    drawAxes3D();
    drawEigenspaces();
    if (showVectorsCheckbox.checked()) {
        drawEigenvectors();
    }

    pop();
}

function drawLegend() {
    let ex = examples[currentExample];
    let legendX = canvasWidth - 130;
    let legendY = 65;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(legendX - 10, legendY - 5, 135, 20 + ex.eigenvalues.length * 18, 5);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Eigenvalues:', legendX, legendY);

    let colors = [
        [66, 133, 244],   // Blue
        [234, 67, 53],    // Red
        [52, 168, 83]     // Green
    ];

    let uniqueEVs = [...new Set(ex.eigenvalues.map(v => v.toFixed(3)))];
    for (let i = 0; i < uniqueEVs.length; i++) {
        let c = colors[i % colors.length];
        fill(c[0], c[1], c[2]);
        ellipse(legendX + 8, legendY + 22 + i * 18, 10, 10);
        fill(0);
        textAlign(LEFT, CENTER);
        text('λ = ' + parseFloat(uniqueEVs[i]).toFixed(3), legendX + 18, legendY + 22 + i * 18);
    }
}

function drawGrid3D() {
    stroke(220);
    strokeWeight(1);

    let extent = 2 * gridScale;

    // XY plane grid
    for (let i = -2; i <= 2; i++) {
        // Lines parallel to X
        line(-extent, i * gridScale, 0, extent, i * gridScale, 0);
        // Lines parallel to Y
        line(i * gridScale, -extent, 0, i * gridScale, extent, 0);
    }

    // XZ plane grid (faint)
    stroke(235);
    for (let i = -2; i <= 2; i++) {
        line(-extent, 0, i * gridScale, extent, 0, i * gridScale);
        line(i * gridScale, 0, -extent, i * gridScale, 0, extent);
    }
}

function drawAxes3D() {
    let len = 2.5 * gridScale;

    // X axis (red)
    stroke(200, 100, 100);
    strokeWeight(2);
    line(0, 0, 0, len, 0, 0);

    // Y axis (green)
    stroke(100, 200, 100);
    line(0, 0, 0, 0, len, 0);

    // Z axis (blue)
    stroke(100, 100, 200);
    line(0, 0, 0, 0, 0, len);

    // Axis labels
    push();
    fill(150);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);

    // X label
    push();
    translate(len + 15, 0, 0);
    rotateY(-rotY);
    rotateX(-rotX);
    text('x', 0, 0);
    pop();

    // Y label
    push();
    translate(0, len + 15, 0);
    rotateY(-rotY);
    rotateX(-rotX);
    text('y', 0, 0);
    pop();

    // Z label
    push();
    translate(0, 0, len + 15);
    rotateY(-rotY);
    rotateX(-rotX);
    text('z', 0, 0);
    pop();

    pop();
}

function drawEigenspaces() {
    let ex = examples[currentExample];
    let colors = [
        [66, 133, 244, 60],   // Blue
        [234, 67, 53, 60],    // Red
        [52, 168, 83, 60]     // Green
    ];

    // Group eigenvalues and their types
    let processed = new Set();
    let colorIndex = 0;

    for (let i = 0; i < ex.eigenspaceTypes.length; i++) {
        let type = ex.eigenspaceTypes[i];
        let c = colors[colorIndex % colors.length];

        if (type === 'line') {
            let ev = ex.eigenvectors[i];
            drawEigenspaceLine(ev, c);
        } else if (type === 'plane-xy') {
            drawEigenspacePlane([0, 0, 1], c); // Normal to z
        } else if (type === 'plane-xz') {
            drawEigenspacePlane([0, 1, 0], c); // Normal to y
        } else if (type === 'plane-yz') {
            drawEigenspacePlane([1, 0, 0], c); // Normal to x
        }

        colorIndex++;
    }
}

function drawEigenspaceLine(dir, col) {
    let len = 2.2 * gridScale;

    // Draw as thick semi-transparent tube
    stroke(col[0], col[1], col[2], 200);
    strokeWeight(4);
    line(
        -dir[0] * len, -dir[1] * len, -dir[2] * len,
        dir[0] * len, dir[1] * len, dir[2] * len
    );

    // Glow effect
    stroke(col[0], col[1], col[2], 80);
    strokeWeight(12);
    line(
        -dir[0] * len, -dir[1] * len, -dir[2] * len,
        dir[0] * len, dir[1] * len, dir[2] * len
    );
}

function drawEigenspacePlane(normal, col) {
    let size = 1.8 * gridScale;

    push();
    noStroke();
    fill(col[0], col[1], col[2], col[3]);

    // Rotate plane based on normal
    if (normal[2] === 1) {
        // XY plane (default orientation)
    } else if (normal[1] === 1) {
        rotateX(HALF_PI);
    } else if (normal[0] === 1) {
        rotateY(HALF_PI);
    }

    // Draw plane as a quad
    beginShape();
    vertex(-size, -size, 0);
    vertex(size, -size, 0);
    vertex(size, size, 0);
    vertex(-size, size, 0);
    endShape(CLOSE);

    // Draw grid on plane
    stroke(col[0], col[1], col[2], 100);
    strokeWeight(1);
    for (let i = -2; i <= 2; i++) {
        let pos = i * gridScale * 0.8;
        line(-size, pos, 0.1, size, pos, 0.1);
        line(pos, -size, 0.1, pos, size, 0.1);
    }

    pop();
}

function drawEigenvectors() {
    let ex = examples[currentExample];
    let colors = [
        [66, 133, 244],   // Blue
        [234, 67, 53],    // Red
        [52, 168, 83]     // Green
    ];

    for (let i = 0; i < ex.eigenvectors.length; i++) {
        let ev = ex.eigenvectors[i];
        let c = colors[i % colors.length];
        let len = 1.5 * gridScale;

        // Draw arrow
        stroke(c[0], c[1], c[2]);
        strokeWeight(3);
        line(0, 0, 0, ev[0] * len, ev[1] * len, ev[2] * len);

        // Arrowhead using cone
        push();
        translate(ev[0] * len, ev[1] * len, ev[2] * len);

        // Calculate rotation to point in direction of eigenvector
        let dir = createVector(ev[0], ev[1], ev[2]);
        let up = createVector(0, 1, 0);
        if (abs(dir.y) > 0.99) {
            up = createVector(1, 0, 0);
        }
        let right = p5.Vector.cross(up, dir).normalize();
        let newUp = p5.Vector.cross(dir, right).normalize();

        // Apply rotation
        applyMatrix(
            right.x, right.y, right.z, 0,
            newUp.x, newUp.y, newUp.z, 0,
            dir.x, dir.y, dir.z, 0,
            0, 0, 0, 1
        );

        fill(c[0], c[1], c[2]);
        noStroke();
        cone(8, 20);
        pop();
    }
}

function normalize(v) {
    let mag = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return [v[0]/mag, v[1]/mag, v[2]/mag];
}

function mousePressed() {
    if (mouseY < drawHeight && mouseY > 60) {
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

        // Clamp rotX to avoid flipping
        rotX = constrain(rotX, -HALF_PI + 0.1, HALF_PI - 0.1);

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
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
