// Quaternion Rotation Visualizer
// Demonstrates quaternion representation and rotation operation
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 800;
let drawHeight = 500;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Quaternion components
let axisX = 0, axisY = 1, axisZ = 0;  // Default: Y-axis
let angle = 45;  // Degrees

// Current orientation (accumulated quaternion)
let currentQ = [1, 0, 0, 0];  // Identity quaternion

// Controls
let axisXSlider, axisYSlider, axisZSlider;
let angleSlider;
let applyButton, composeButton, resetButton;
let showEulerCheckbox;

// View rotation
let viewRotX = -0.3;
let viewRotY = 0.5;

// Font
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

    let yRow1 = drawHeight + 10;
    let yRow2 = drawHeight + 45;
    let yRow3 = drawHeight + 75;

    // Row 1: Axis components
    let axLabel = createSpan('Axis X:');
    axLabel.parent(container);
    axLabel.position(10, yRow1);
    axLabel.style('font-size', '13px');

    axisXSlider = createSlider(-100, 100, 0, 1);
    axisXSlider.parent(container);
    axisXSlider.position(60, yRow1);
    axisXSlider.size(80);

    let ayLabel = createSpan('Y:');
    ayLabel.parent(container);
    ayLabel.position(150, yRow1);
    ayLabel.style('font-size', '13px');

    axisYSlider = createSlider(-100, 100, 100, 1);
    axisYSlider.parent(container);
    axisYSlider.position(170, yRow1);
    axisYSlider.size(80);

    let azLabel = createSpan('Z:');
    azLabel.parent(container);
    azLabel.position(260, yRow1);
    azLabel.style('font-size', '13px');

    axisZSlider = createSlider(-100, 100, 0, 1);
    axisZSlider.parent(container);
    axisZSlider.position(280, yRow1);
    axisZSlider.size(80);

    let angLabel = createSpan('Angle θ:');
    angLabel.parent(container);
    angLabel.position(380, yRow1);
    angLabel.style('font-size', '13px');

    angleSlider = createSlider(0, 360, 45, 1);
    angleSlider.parent(container);
    angleSlider.position(440, yRow1);
    angleSlider.size(150);

    // Row 2: Buttons
    applyButton = createButton('Apply Rotation');
    applyButton.parent(container);
    applyButton.position(10, yRow2);
    applyButton.mousePressed(applyRotation);

    composeButton = createButton('Compose with Previous');
    composeButton.parent(container);
    composeButton.position(120, yRow2);
    composeButton.mousePressed(composeRotation);

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(280, yRow2);
    resetButton.mousePressed(resetOrientation);

    showEulerCheckbox = createCheckbox('Show Euler Angles', true);
    showEulerCheckbox.parent(container);
    showEulerCheckbox.position(350, yRow2);
    showEulerCheckbox.style('font-size', '13px');

    describe('Interactive quaternion rotation visualizer showing axis-angle representation', LABEL);
}

function draw() {
    updateCanvasSize();

    // Get axis values and normalize
    axisX = axisXSlider.value() / 100;
    axisY = axisYSlider.value() / 100;
    axisZ = axisZSlider.value() / 100;
    angle = angleSlider.value();

    // Normalize axis
    let axisLen = sqrt(axisX*axisX + axisY*axisY + axisZ*axisZ);
    if (axisLen < 0.001) axisLen = 1;
    let nx = axisX / axisLen;
    let ny = axisY / axisLen;
    let nz = axisZ / axisLen;

    // Compute preview quaternion
    let previewQ = axisAngleToQuat(nx, ny, nz, radians(angle));

    // Draw background
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('Quaternion Rotation Visualizer', canvasWidth/2, 10);

    // Display quaternion values
    textSize(12);
    textAlign(LEFT, TOP);

    // Preview quaternion
    fill(0);
    text('Preview Quaternion:', 10, 45);
    text('q = (' + previewQ[0].toFixed(3) + ', ' + previewQ[1].toFixed(3) +
         ', ' + previewQ[2].toFixed(3) + ', ' + previewQ[3].toFixed(3) + ')', 10, 60);
    text('  = (w, x, y, z)', 10, 75);

    // Current accumulated quaternion
    text('Current Orientation:', 10, 100);
    text('Q = (' + currentQ[0].toFixed(3) + ', ' + currentQ[1].toFixed(3) +
         ', ' + currentQ[2].toFixed(3) + ', ' + currentQ[3].toFixed(3) + ')', 10, 115);

    // Axis-angle display
    textAlign(LEFT, TOP);
    text('Axis: (' + nx.toFixed(2) + ', ' + ny.toFixed(2) + ', ' + nz.toFixed(2) + ')', 10, 140);
    text('Angle: ' + angle + '°', 10, 155);

    // Show equivalent Euler angles if checkbox is checked
    if (showEulerCheckbox.checked()) {
        let euler = quatToEuler(currentQ);
        textAlign(RIGHT, TOP);
        text('Equivalent Euler Angles:', canvasWidth - 10, 100);
        text('Yaw: ' + degrees(euler.yaw).toFixed(1) + '°', canvasWidth - 10, 115);
        text('Pitch: ' + degrees(euler.pitch).toFixed(1) + '°', canvasWidth - 10, 130);
        text('Roll: ' + degrees(euler.roll).toFixed(1) + '°', canvasWidth - 10, 145);
    }

    pop();

    // 3D visualization
    push();
    translate(100, 30, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);

    // Draw world axes
    drawWorldAxes();

    // Draw rotation axis
    drawRotationAxis(nx, ny, nz);

    // Draw angle arc
    drawAngleArc(nx, ny, nz, radians(angle));

    // Apply current orientation and draw object
    applyQuaternion(currentQ);
    drawOrientedObject();

    pop();

    // Draw unit sphere representation
    push();
    translate(-canvasWidth/4, 80, 0);
    drawQuaternionSphere(currentQ, previewQ);
    pop();
}

function drawWorldAxes() {
    let len = 150;
    strokeWeight(2);

    // X (red)
    stroke(255, 100, 100, 150);
    line(0, 0, 0, len, 0, 0);

    // Y (green)
    stroke(100, 255, 100, 150);
    line(0, 0, 0, 0, -len, 0);

    // Z (blue)
    stroke(100, 100, 255, 150);
    line(0, 0, 0, 0, 0, len);
}

function drawRotationAxis(nx, ny, nz) {
    let len = 200;
    strokeWeight(4);
    stroke(255, 150, 0);
    // Note: p5 WEBGL has Y pointing down, so we negate ny
    line(-nx * len, ny * len, -nz * len, nx * len, -ny * len, nz * len);

    // Arrow head
    push();
    translate(nx * len, -ny * len, nz * len);
    fill(255, 150, 0);
    noStroke();
    sphere(8);
    pop();

    // Label
    push();
    translate(nx * (len + 20), -ny * (len + 20), nz * (len + 20));
    fill(255, 150, 0);
    noStroke();
    textSize(14);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text('n̂', 0, 0);
    pop();
}

function drawAngleArc(nx, ny, nz, theta) {
    if (theta < 0.01) return;

    stroke(255, 200, 100);
    strokeWeight(3);
    noFill();

    // Find perpendicular vectors to the axis
    let perpX, perpY, perpZ;
    if (abs(nx) < 0.9) {
        perpX = 0; perpY = -nz; perpZ = ny;
    } else {
        perpX = -ny; perpY = nx; perpZ = 0;
    }
    let perpLen = sqrt(perpX*perpX + perpY*perpY + perpZ*perpZ);
    perpX /= perpLen; perpY /= perpLen; perpZ /= perpLen;

    let r = 80;
    beginShape();
    for (let a = 0; a <= theta; a += 0.1) {
        let q = axisAngleToQuat(nx, ny, nz, a);
        let p = rotateByQuat([perpX * r, perpY * r, perpZ * r], q);
        vertex(p[0], -p[1], p[2]);
    }
    endShape();
}

function drawOrientedObject() {
    // Draw a colored cube to show orientation
    fill(100, 150, 200, 200);
    stroke(50, 100, 150);
    strokeWeight(1);
    box(80, 40, 60);

    // Front face marker
    fill(255, 100, 100);
    push();
    translate(0, 0, 31);
    box(20, 20, 2);
    pop();

    // Top face marker
    fill(100, 255, 100);
    push();
    translate(0, -21, 0);
    box(20, 2, 20);
    pop();
}

function drawQuaternionSphere(q, previewQ) {
    // Simplified unit sphere visualization
    strokeWeight(1);
    stroke(200);
    noFill();

    // Draw sphere outline
    ellipse(0, 0, 100, 100);

    // Show quaternion as point on sphere (w, x projected)
    fill(255, 0, 0);
    noStroke();
    let px = q[1] * 40;  // x component
    let py = -q[0] * 40; // w component (negative for screen coords)
    ellipse(px, py, 10, 10);

    // Label
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text('Q on S³', 0, 60);
}

function axisAngleToQuat(nx, ny, nz, theta) {
    let halfAngle = theta / 2;
    let s = sin(halfAngle);
    return [
        cos(halfAngle),
        s * nx,
        s * ny,
        s * nz
    ];
}

function quatMultiply(q1, q2) {
    return [
        q1[0]*q2[0] - q1[1]*q2[1] - q1[2]*q2[2] - q1[3]*q2[3],
        q1[0]*q2[1] + q1[1]*q2[0] + q1[2]*q2[3] - q1[3]*q2[2],
        q1[0]*q2[2] - q1[1]*q2[3] + q1[2]*q2[0] + q1[3]*q2[1],
        q1[0]*q2[3] + q1[1]*q2[2] - q1[2]*q2[1] + q1[3]*q2[0]
    ];
}

function rotateByQuat(v, q) {
    let qv = [0, v[0], v[1], v[2]];
    let qConj = [q[0], -q[1], -q[2], -q[3]];
    let result = quatMultiply(quatMultiply(q, qv), qConj);
    return [result[1], result[2], result[3]];
}

function applyQuaternion(q) {
    // Convert quaternion to rotation matrix and apply
    let w = q[0], x = q[1], y = q[2], z = q[3];

    let m = [
        1 - 2*y*y - 2*z*z, 2*x*y - 2*z*w, 2*x*z + 2*y*w, 0,
        2*x*y + 2*z*w, 1 - 2*x*x - 2*z*z, 2*y*z - 2*x*w, 0,
        2*x*z - 2*y*w, 2*y*z + 2*x*w, 1 - 2*x*x - 2*y*y, 0,
        0, 0, 0, 1
    ];

    applyMatrix(...m);
}

function quatToEuler(q) {
    let w = q[0], x = q[1], y = q[2], z = q[3];

    // Roll (x-axis rotation)
    let sinr_cosp = 2 * (w * x + y * z);
    let cosr_cosp = 1 - 2 * (x * x + y * y);
    let roll = atan2(sinr_cosp, cosr_cosp);

    // Pitch (y-axis rotation)
    let sinp = 2 * (w * y - z * x);
    let pitch;
    if (abs(sinp) >= 1)
        pitch = sinp > 0 ? HALF_PI : -HALF_PI;
    else
        pitch = asin(sinp);

    // Yaw (z-axis rotation)
    let siny_cosp = 2 * (w * z + x * y);
    let cosy_cosp = 1 - 2 * (y * y + z * z);
    let yaw = atan2(siny_cosp, cosy_cosp);

    return { roll, pitch, yaw };
}

function applyRotation() {
    let axisLen = sqrt(axisX*axisX + axisY*axisY + axisZ*axisZ);
    if (axisLen < 0.001) return;

    let nx = axisX / axisLen;
    let ny = axisY / axisLen;
    let nz = axisZ / axisLen;

    currentQ = axisAngleToQuat(nx, ny, nz, radians(angle));
}

function composeRotation() {
    let axisLen = sqrt(axisX*axisX + axisY*axisY + axisZ*axisZ);
    if (axisLen < 0.001) return;

    let nx = axisX / axisLen;
    let ny = axisY / axisLen;
    let nz = axisZ / axisLen;

    let newQ = axisAngleToQuat(nx, ny, nz, radians(angle));
    currentQ = quatMultiply(newQ, currentQ);

    // Normalize
    let len = sqrt(currentQ[0]**2 + currentQ[1]**2 + currentQ[2]**2 + currentQ[3]**2);
    currentQ = currentQ.map(c => c / len);
}

function resetOrientation() {
    currentQ = [1, 0, 0, 0];
}

function mouseDragged() {
    if (mouseY < drawHeight && mouseX > canvasWidth/3) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        viewRotY += dx * 0.01;
        viewRotX += dy * 0.01;
        viewRotX = constrain(viewRotX, -PI/2, PI/2);
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
