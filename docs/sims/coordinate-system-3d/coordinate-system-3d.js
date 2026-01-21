// 3D Coordinate System Visualizer
// Demonstrates different 3D coordinate system conventions and handedness
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 700;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// 3D rotation angles for view
let rotX = -0.4;
let rotY = 0.5;

// Controls
let handednessSelect;
let conventionSelect;
let showGridCheckbox;
let animateCheckbox;

// Sample point
let samplePoint = { x: 150, y: 100, z: 80 };

// Dragging state
let isDragging = false;
let lastMouseX, lastMouseY;

// Animation
let animPhase = 0;

// Font for WEBGL text
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    const container = document.querySelector('main');
    canvas.parent(container);
    textFont(font);

    // Create controls - parent to container for proper positioning
    let yRow1 = drawHeight + 8;
    let yRow2 = drawHeight + 45;

    // Row 1: Handedness and Convention
    let label1 = createSpan('Handedness:');
    label1.parent(container);
    label1.position(10, yRow1);
    label1.style('font-size', '14px');

    handednessSelect = createSelect();
    handednessSelect.parent(container);
    handednessSelect.position(90, yRow1);
    handednessSelect.option('Right-hand');
    handednessSelect.option('Left-hand');
    handednessSelect.selected('Right-hand');

    let label2 = createSpan('Convention:');
    label2.parent(container);
    label2.position(200, yRow1);
    label2.style('font-size', '14px');

    conventionSelect = createSelect();
    conventionSelect.parent(container);
    conventionSelect.position(280, yRow1);
    conventionSelect.option('OpenGL/Math');
    conventionSelect.option('DirectX/Unity');
    conventionSelect.option('ROS/Robotics');
    conventionSelect.option('Camera');
    conventionSelect.selected('OpenGL/Math');

    // Row 2: Checkboxes
    showGridCheckbox = createCheckbox('Show Grid Planes', true);
    showGridCheckbox.parent(container);
    showGridCheckbox.position(10, yRow2);
    showGridCheckbox.style('font-size', '14px');

    animateCheckbox = createCheckbox('Animate Right-Hand Rule', false);
    animateCheckbox.parent(container);
    animateCheckbox.position(160, yRow2);
    animateCheckbox.style('font-size', '14px');

    describe('Interactive 3D coordinate system visualizer showing different conventions and handedness', LABEL);
}

function draw() {
    updateCanvasSize();

    // Draw control area background in screen space
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Drawing area
    fill(240, 248, 255);
    stroke(192);
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    pop();

    // Get settings
    let isRightHand = handednessSelect.value() === 'Right-hand';
    let convention = conventionSelect.value();
    let showGrid = showGridCheckbox.checked();
    let animate = animateCheckbox.checked();

    // Apply rotation based on mouse drag
    push();
    translate(0, -40, 0);
    rotateX(rotX);
    rotateY(rotY);

    // Draw grid planes
    if (showGrid) {
        drawGridPlanes(isRightHand);
    }

    // Draw axes
    drawAxes(isRightHand, convention);

    // Draw sample point
    drawSamplePoint(isRightHand);

    // Draw right-hand rule animation
    if (animate) {
        animPhase += 0.03;
        drawRightHandRule(isRightHand);
    }

    pop();

    // Draw title and info in screen space
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('3D Coordinate System Visualizer', canvasWidth/2, 10);

    // Draw convention info
    textSize(14);
    textAlign(LEFT, TOP);
    let info = getConventionInfo(convention);
    text(info, 10, 40);

    // Draw coordinates of sample point
    textAlign(RIGHT, TOP);
    let zSign = isRightHand ? 1 : -1;
    text('Sample Point: (' + samplePoint.x.toFixed(0) + ', ' +
         samplePoint.y.toFixed(0) + ', ' + (samplePoint.z * zSign).toFixed(0) + ')',
         canvasWidth - 10, 40);

    // Draw handedness indicator
    textAlign(RIGHT, TOP);
    text(isRightHand ? 'Right-Hand System' : 'Left-Hand System', canvasWidth - 10, 60);

    pop();
}

function drawAxes(isRightHand, convention) {
    let axisLength = 200;
    let arrowSize = 10;

    // Get axis colors and directions based on convention
    let axes = getAxisConfig(convention, isRightHand);

    strokeWeight(3);

    // X axis (red)
    stroke(255, 0, 0);
    line(0, 0, 0, axes.x.dir[0] * axisLength, axes.x.dir[1] * axisLength, axes.x.dir[2] * axisLength);
    drawArrowHead(axes.x.dir[0] * axisLength, axes.x.dir[1] * axisLength, axes.x.dir[2] * axisLength, axes.x.dir, [255, 0, 0]);

    // Y axis (green)
    stroke(0, 200, 0);
    line(0, 0, 0, axes.y.dir[0] * axisLength, axes.y.dir[1] * axisLength, axes.y.dir[2] * axisLength);
    drawArrowHead(axes.y.dir[0] * axisLength, axes.y.dir[1] * axisLength, axes.y.dir[2] * axisLength, axes.y.dir, [0, 200, 0]);

    // Z axis (blue)
    stroke(0, 100, 255);
    let zDir = isRightHand ? axes.z.dir : [-axes.z.dir[0], -axes.z.dir[1], -axes.z.dir[2]];
    line(0, 0, 0, zDir[0] * axisLength, zDir[1] * axisLength, zDir[2] * axisLength);
    drawArrowHead(zDir[0] * axisLength, zDir[1] * axisLength, zDir[2] * axisLength, zDir, [0, 100, 255]);

    // Axis labels
    textSize(18);
    fill(255, 0, 0);
    noStroke();
    push();
    translate(axes.x.dir[0] * (axisLength + 20), axes.x.dir[1] * (axisLength + 20), axes.x.dir[2] * (axisLength + 20));
    rotateY(-rotY);
    rotateX(-rotX);
    text('X', 0, 0);
    pop();

    fill(0, 200, 0);
    push();
    translate(axes.y.dir[0] * (axisLength + 20), axes.y.dir[1] * (axisLength + 20), axes.y.dir[2] * (axisLength + 20));
    rotateY(-rotY);
    rotateX(-rotX);
    text('Y', 0, 0);
    pop();

    fill(0, 100, 255);
    push();
    translate(zDir[0] * (axisLength + 20), zDir[1] * (axisLength + 20), zDir[2] * (axisLength + 20));
    rotateY(-rotY);
    rotateX(-rotX);
    text('Z', 0, 0);
    pop();

    // Origin sphere
    fill(50);
    noStroke();
    sphere(8);
}

function drawArrowHead(x, y, z, dir, col) {
    push();
    translate(x, y, z);
    fill(col[0], col[1], col[2]);
    noStroke();
    // Simple cone approximation
    sphere(6);
    pop();
}

function getAxisConfig(convention, isRightHand) {
    // Standard: X=right, Y=up, Z=out
    let config = {
        x: { dir: [1, 0, 0], label: 'Right' },
        y: { dir: [0, -1, 0], label: 'Up' },  // p5 WEBGL has Y down
        z: { dir: [0, 0, 1], label: 'Out' }
    };

    switch(convention) {
        case 'DirectX/Unity':
            // Left-hand by default
            config.z.dir = [0, 0, -1];
            config.z.label = 'Into';
            break;
        case 'ROS/Robotics':
            // X forward, Y left, Z up
            config.x.dir = [0, 0, -1];
            config.x.label = 'Forward';
            config.y.dir = [-1, 0, 0];
            config.y.label = 'Left';
            config.z.dir = [0, -1, 0];
            config.z.label = 'Up';
            break;
        case 'Camera':
            // X right, Y down, Z forward
            config.y.dir = [0, 1, 0];
            config.y.label = 'Down';
            config.z.dir = [0, 0, -1];
            config.z.label = 'Forward';
            break;
    }

    return config;
}

function getConventionInfo(convention) {
    switch(convention) {
        case 'OpenGL/Math':
            return 'X: Right, Y: Up, Z: Out (toward viewer)';
        case 'DirectX/Unity':
            return 'X: Right, Y: Up, Z: Into screen';
        case 'ROS/Robotics':
            return 'X: Forward, Y: Left, Z: Up';
        case 'Camera':
            return 'X: Right, Y: Down, Z: Forward';
    }
    return '';
}

function drawGridPlanes(isRightHand) {
    let gridSize = 150;
    let gridStep = 30;

    stroke(200, 200, 255, 100);
    strokeWeight(1);

    // XY plane (at z=0)
    for (let i = -gridSize; i <= gridSize; i += gridStep) {
        line(i, -gridSize, 0, i, gridSize, 0);
        line(-gridSize, i, 0, gridSize, i, 0);
    }

    // XZ plane (at y=0) - lighter
    stroke(200, 255, 200, 60);
    for (let i = -gridSize; i <= gridSize; i += gridStep) {
        line(i, 0, -gridSize, i, 0, gridSize);
        line(-gridSize, 0, i, gridSize, 0, i);
    }
}

function drawSamplePoint(isRightHand) {
    let x = samplePoint.x;
    let y = -samplePoint.y;  // Flip for p5 WEBGL
    let z = isRightHand ? samplePoint.z : -samplePoint.z;

    // Draw projection lines
    stroke(150);
    strokeWeight(1);
    setLineDash([5, 5]);

    // Lines to XY plane
    line(x, y, z, x, y, 0);
    line(x, y, 0, x, 0, 0);
    line(x, y, 0, 0, y, 0);

    setLineDash([]);

    // Draw the point
    push();
    translate(x, y, z);
    fill(255, 100, 100);
    noStroke();
    sphere(12);
    pop();
}

function setLineDash(pattern) {
    // WEBGL doesn't support setLineDash, draw dashed manually if needed
    // For simplicity, just use solid lines
}

function drawRightHandRule(isRightHand) {
    // Animate curl from X to Y, thumb points Z
    let t = (sin(animPhase) + 1) / 2;

    // Draw curved arrow from X toward Y
    stroke(255, 150, 0);
    strokeWeight(3);
    noFill();

    beginShape();
    for (let a = 0; a <= PI/2 * t; a += 0.1) {
        let r = 80;
        vertex(cos(a) * r, -sin(a) * r, 0);
    }
    endShape();

    // Thumb indicator (Z direction)
    if (t > 0.5) {
        let alpha = map(t, 0.5, 1, 0, 255);
        stroke(255, 150, 0, alpha);
        strokeWeight(4);
        let zDir = isRightHand ? 1 : -1;
        line(0, 0, 0, 0, 0, zDir * 100);

        // Label
        push();
        translate(0, 0, zDir * 110);
        fill(255, 150, 0, alpha);
        noStroke();
        textSize(14);
        rotateY(-rotY);
        rotateX(-rotX);
        text('Thumb→Z', 0, 0);
        pop();
    }
}

function mouseDragged() {
    if (mouseY < drawHeight) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        rotX = constrain(rotX, -PI/2, PI/2);
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
    }
}
