// Euler Angles Visualizer
// Demonstrates how Euler angles compose to form 3D rotations
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 750;
let drawHeight = 500;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Euler angles (in degrees for display, radians for computation)
let yaw = 0;    // ψ - rotation about Z
let pitch = 0;  // θ - rotation about Y
let roll = 0;   // φ - rotation about X

// Controls
let yawSlider, pitchSlider, rollSlider;
let conventionSelect;
let animateButton, resetButton;

// Animation state
let isAnimating = false;
let animStep = 0;
let animPhase = 0;

// View rotation
let viewRotX = -0.3;
let viewRotY = 0.4;

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

    // Row 1: Yaw slider
    let yawLabel = createSpan('Yaw (ψ):');
    yawLabel.parent(container);
    yawLabel.position(10, yRow1);
    yawLabel.style('font-size', '14px');

    yawSlider = createSlider(-180, 180, 0, 1);
    yawSlider.parent(container);
    yawSlider.position(sliderLeftMargin, yRow1);
    yawSlider.size(200);

    // Pitch slider
    let pitchLabel = createSpan('Pitch (θ):');
    pitchLabel.parent(container);
    pitchLabel.position(320, yRow1);
    pitchLabel.style('font-size', '14px');

    pitchSlider = createSlider(-90, 90, 0, 1);
    pitchSlider.parent(container);
    pitchSlider.position(410, yRow1);
    pitchSlider.size(200);

    // Row 2: Roll slider and convention
    let rollLabel = createSpan('Roll (φ):');
    rollLabel.parent(container);
    rollLabel.position(10, yRow2);
    rollLabel.style('font-size', '14px');

    rollSlider = createSlider(-180, 180, 0, 1);
    rollSlider.parent(container);
    rollSlider.position(sliderLeftMargin, yRow2);
    rollSlider.size(200);

    let convLabel = createSpan('Convention:');
    convLabel.parent(container);
    convLabel.position(320, yRow2);
    convLabel.style('font-size', '14px');

    conventionSelect = createSelect();
    conventionSelect.parent(container);
    conventionSelect.position(410, yRow2);
    conventionSelect.option('ZYX (Aerospace)');
    conventionSelect.option('XYZ');
    conventionSelect.option('ZXZ (Classic)');
    conventionSelect.selected('ZYX (Aerospace)');

    // Row 3: Buttons
    animateButton = createButton('Animate Sequence');
    animateButton.parent(container);
    animateButton.position(10, yRow3);
    animateButton.mousePressed(startAnimation);

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(140, yRow3);
    resetButton.mousePressed(resetAngles);

    describe('Interactive Euler angles visualizer showing how rotations compose', LABEL);
}

function draw() {
    updateCanvasSize();

    // Get values
    yaw = yawSlider.value();
    pitch = pitchSlider.value();
    roll = rollSlider.value();

    // Check for gimbal lock
    let nearGimbalLock = abs(pitch) > 85;

    // Draw background in screen space
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Drawing area
    fill(nearGimbalLock ? '#fff0f0' : 'aliceblue');
    stroke(nearGimbalLock ? '#ffaaaa' : 'silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('Euler Angles Visualizer', canvasWidth/2, 10);

    // Display current values
    textSize(14);
    textAlign(LEFT, TOP);
    text('Yaw: ' + yaw + '°', canvasWidth - 200, 40);
    text('Pitch: ' + pitch + '°', canvasWidth - 200, 60);
    text('Roll: ' + roll + '°', canvasWidth - 200, 80);

    // Gimbal lock warning
    if (nearGimbalLock) {
        fill(200, 0, 0);
        textSize(16);
        textAlign(CENTER, TOP);
        text('⚠ Approaching Gimbal Lock!', canvasWidth/2, 35);
    }

    // Display rotation matrix
    drawRotationMatrix();

    pop();

    // 3D visualization
    push();
    translate(-80, 0, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);

    // Draw world frame (fixed)
    drawWorldFrame();

    // Apply Euler rotations and draw object frame
    if (isAnimating) {
        updateAnimation();
        applyAnimatedRotation();
    } else {
        applyFullRotation();
    }

    drawObjectFrame();
    drawAirplane();

    pop();
}

function drawWorldFrame() {
    let len = 150;
    strokeWeight(1);

    // X axis (red, dashed)
    stroke(255, 100, 100, 100);
    line(0, 0, 0, len, 0, 0);

    // Y axis (green, dashed)
    stroke(100, 200, 100, 100);
    line(0, 0, 0, 0, -len, 0);

    // Z axis (blue, dashed)
    stroke(100, 100, 255, 100);
    line(0, 0, 0, 0, 0, len);
}

function drawObjectFrame() {
    let len = 120;
    strokeWeight(3);

    // X axis (red)
    stroke(255, 0, 0);
    line(0, 0, 0, len, 0, 0);

    // Y axis (green)
    stroke(0, 200, 0);
    line(0, 0, 0, 0, -len, 0);

    // Z axis (blue)
    stroke(0, 100, 255);
    line(0, 0, 0, 0, 0, len);

    // Labels
    textSize(14);
    noStroke();

    fill(255, 0, 0);
    push();
    translate(len + 15, 0, 0);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text('X', 0, 0);
    pop();

    fill(0, 200, 0);
    push();
    translate(0, -len - 15, 0);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text('Y', 0, 0);
    pop();

    fill(0, 100, 255);
    push();
    translate(0, 0, len + 15);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text('Z', 0, 0);
    pop();
}

function drawAirplane() {
    // Simple airplane shape
    fill(100, 150, 200);
    stroke(50, 100, 150);
    strokeWeight(1);

    // Fuselage
    push();
    scale(1, 0.3, 0.3);
    box(80, 30, 30);
    pop();

    // Wings
    push();
    translate(0, 0, 0);
    scale(0.2, 0.1, 1);
    box(20, 10, 100);
    pop();

    // Tail
    push();
    translate(-35, -15, 0);
    scale(0.1, 0.5, 0.3);
    box(20, 30, 20);
    pop();

    // Nose cone
    push();
    translate(45, 0, 0);
    rotateZ(HALF_PI);
    cone(8, 20);
    pop();
}

function applyFullRotation() {
    let yawRad = radians(yaw);
    let pitchRad = radians(pitch);
    let rollRad = radians(roll);

    let convention = conventionSelect.value();

    if (convention === 'ZYX (Aerospace)') {
        rotateZ(yawRad);
        rotateY(pitchRad);
        rotateX(rollRad);
    } else if (convention === 'XYZ') {
        rotateX(rollRad);
        rotateY(pitchRad);
        rotateZ(yawRad);
    } else {
        rotateZ(yawRad);
        rotateX(pitchRad);
        rotateZ(rollRad);
    }
}

function applyAnimatedRotation() {
    let yawRad = radians(yaw);
    let pitchRad = radians(pitch);
    let rollRad = radians(roll);

    let convention = conventionSelect.value();
    let t = min(animPhase, 1);

    if (convention === 'ZYX (Aerospace)') {
        if (animStep >= 1) rotateZ(animStep === 1 ? yawRad * t : yawRad);
        if (animStep >= 2) rotateY(animStep === 2 ? pitchRad * t : pitchRad);
        if (animStep >= 3) rotateX(animStep === 3 ? rollRad * t : rollRad);
    } else if (convention === 'XYZ') {
        if (animStep >= 1) rotateX(animStep === 1 ? rollRad * t : rollRad);
        if (animStep >= 2) rotateY(animStep === 2 ? pitchRad * t : pitchRad);
        if (animStep >= 3) rotateZ(animStep === 3 ? yawRad * t : yawRad);
    } else {
        if (animStep >= 1) rotateZ(animStep === 1 ? yawRad * t : yawRad);
        if (animStep >= 2) rotateX(animStep === 2 ? pitchRad * t : pitchRad);
        if (animStep >= 3) rotateZ(animStep === 3 ? rollRad * t : rollRad);
    }
}

function updateAnimation() {
    animPhase += 0.02;
    if (animPhase >= 1.2) {
        animPhase = 0;
        animStep++;
        if (animStep > 3) {
            isAnimating = false;
            animStep = 0;
        }
    }
}

function startAnimation() {
    isAnimating = true;
    animStep = 1;
    animPhase = 0;
}

function resetAngles() {
    yawSlider.value(0);
    pitchSlider.value(0);
    rollSlider.value(0);
    isAnimating = false;
}

function drawRotationMatrix() {
    let yawRad = radians(yaw);
    let pitchRad = radians(pitch);
    let rollRad = radians(roll);

    // Compute ZYX rotation matrix
    let cy = cos(yawRad), sy = sin(yawRad);
    let cp = cos(pitchRad), sp = sin(pitchRad);
    let cr = cos(rollRad), sr = sin(rollRad);

    let R = [
        [cy*cp, cy*sp*sr - sy*cr, cy*sp*cr + sy*sr],
        [sy*cp, sy*sp*sr + cy*cr, sy*sp*cr - cy*sr],
        [-sp, cp*sr, cp*cr]
    ];

    // Display matrix
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text('Rotation Matrix R:', 10, 60);

    textSize(11);
    for (let i = 0; i < 3; i++) {
        let row = R[i].map(v => v.toFixed(2)).join('  ');
        text('[ ' + row + ' ]', 10, 80 + i * 16);
    }
    pop();
}

function mouseDragged() {
    if (mouseY < drawHeight && mouseX > 0 && mouseX < canvasWidth) {
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
