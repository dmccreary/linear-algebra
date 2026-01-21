// Gimbal Lock Demonstration
// Physical gimbal mechanism showing how gimbal lock occurs
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 700;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Gimbal angles
let outerAngle = 0;  // Yaw
let middleAngle = 0; // Pitch
let innerAngle = 0;  // Roll

// Controls
let outerSlider, middleSlider, innerSlider;
let gimbalLockButton, resetButton;

// View rotation
let viewRotX = -0.4;
let viewRotY = 0.5;

// Gimbal dimensions
let outerRadius = 180;
let middleRadius = 140;
let innerRadius = 100;
let ringThickness = 8;

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

    // Row 1: Outer ring (Yaw)
    let outerLabel = createSpan('Outer (Yaw):');
    outerLabel.parent(container);
    outerLabel.position(10, yRow1);
    outerLabel.style('font-size', '14px');
    outerLabel.style('color', '#cc0000');

    outerSlider = createSlider(-180, 180, 0, 1);
    outerSlider.parent(container);
    outerSlider.position(sliderLeftMargin, yRow1);
    outerSlider.size(180);

    // Row 1: Middle ring (Pitch)
    let middleLabel = createSpan('Middle (Pitch):');
    middleLabel.parent(container);
    middleLabel.position(320, yRow1);
    middleLabel.style('font-size', '14px');
    middleLabel.style('color', '#00aa00');

    middleSlider = createSlider(-90, 90, 0, 1);
    middleSlider.parent(container);
    middleSlider.position(430, yRow1);
    middleSlider.size(180);

    // Row 2: Inner ring (Roll)
    let innerLabel = createSpan('Inner (Roll):');
    innerLabel.parent(container);
    innerLabel.position(10, yRow2);
    innerLabel.style('font-size', '14px');
    innerLabel.style('color', '#0066cc');

    innerSlider = createSlider(-180, 180, 0, 1);
    innerSlider.parent(container);
    innerSlider.position(sliderLeftMargin, yRow2);
    innerSlider.size(180);

    // Row 3: Buttons
    gimbalLockButton = createButton('Go to Gimbal Lock (Pitch=90°)');
    gimbalLockButton.parent(container);
    gimbalLockButton.position(10, yRow3);
    gimbalLockButton.mousePressed(() => {
        middleSlider.value(90);
    });

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(200, yRow3);
    resetButton.mousePressed(() => {
        outerSlider.value(0);
        middleSlider.value(0);
        innerSlider.value(0);
    });

    describe('Physical gimbal mechanism demonstrating gimbal lock', LABEL);
}

function draw() {
    updateCanvasSize();

    outerAngle = outerSlider.value();
    middleAngle = middleSlider.value();
    innerAngle = innerSlider.value();

    let isGimbalLock = abs(middleAngle) >= 89;
    let nearGimbalLock = abs(middleAngle) >= 80;

    // Draw background
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Drawing area with warning color if near gimbal lock
    if (isGimbalLock) {
        fill('#ffe0e0');
        stroke('#ff8888');
    } else if (nearGimbalLock) {
        fill('#fff8e0');
        stroke('#ddcc88');
    } else {
        fill('aliceblue');
        stroke('silver');
    }
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
    text('Gimbal Lock Demonstration', canvasWidth/2, 10);

    // Status display
    textSize(14);
    textAlign(LEFT, TOP);

    // DOF indicator
    let dof = isGimbalLock ? 2 : 3;
    fill(isGimbalLock ? '#cc0000' : '#006600');
    text('Degrees of Freedom: ' + dof, canvasWidth - 180, 40);

    // Gimbal lock status
    if (isGimbalLock) {
        fill('#cc0000');
        textSize(16);
        textAlign(CENTER, TOP);
        text('⚠ GIMBAL LOCK! Yaw and Roll now control the same axis', canvasWidth/2, 35);
    } else if (nearGimbalLock) {
        fill('#cc8800');
        textSize(14);
        textAlign(CENTER, TOP);
        text('Warning: Approaching gimbal lock', canvasWidth/2, 35);
    }

    // Angle values
    fill(0);
    textSize(12);
    textAlign(RIGHT, TOP);
    text('Yaw: ' + outerAngle + '°', canvasWidth - 10, 60);
    text('Pitch: ' + middleAngle + '°', canvasWidth - 10, 78);
    text('Roll: ' + innerAngle + '°', canvasWidth - 10, 96);

    pop();

    // 3D gimbal visualization
    push();
    translate(0, 20, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);

    // Draw gimbal rings from outside to inside
    drawGimbalSystem();

    pop();
}

function drawGimbalSystem() {
    let outerRad = radians(outerAngle);
    let middleRad = radians(middleAngle);
    let innerRad = radians(innerAngle);

    // Outer ring (red) - rotates about world Z (vertical)
    push();
    rotateY(outerRad);
    drawRing(outerRadius, ringThickness, [200, 50, 50], 'Yaw');

    // Draw yaw axis indicator
    stroke(200, 50, 50);
    strokeWeight(2);
    line(0, -outerRadius - 20, 0, 0, outerRadius + 20, 0);

    // Middle ring (green) - rotates about local X (horizontal)
    push();
    rotateX(middleRad);
    drawRing(middleRadius, ringThickness, [50, 180, 50], 'Pitch');

    // Draw pitch axis indicator
    stroke(50, 180, 50);
    strokeWeight(2);
    line(-middleRadius - 20, 0, 0, middleRadius + 20, 0, 0);

    // Inner ring (blue) - rotates about local Z
    push();
    rotateZ(innerRad);
    drawRing(innerRadius, ringThickness, [50, 100, 200], 'Roll');

    // Draw roll axis indicator
    stroke(50, 100, 200);
    strokeWeight(2);
    line(0, 0, -innerRadius - 20, 0, 0, innerRadius + 20);

    // Draw object attached to innermost ring
    drawAttachedObject();

    pop(); // Inner
    pop(); // Middle
    pop(); // Outer
}

function drawRing(radius, thickness, col, label) {
    noFill();
    stroke(col[0], col[1], col[2]);
    strokeWeight(thickness);

    // Draw ring as a series of line segments
    beginShape();
    for (let a = 0; a <= TWO_PI; a += 0.1) {
        let x = cos(a) * radius;
        let z = sin(a) * radius;
        vertex(x, 0, z);
    }
    endShape(CLOSE);

    // Ring support structures (gimbals)
    strokeWeight(4);
    // Left pivot
    line(-radius, 0, 0, -radius - 15, 0, 0);
    // Right pivot
    line(radius, 0, 0, radius + 15, 0, 0);
}

function drawAttachedObject() {
    // Draw a simple arrow/pointer to show orientation
    fill(255, 200, 100);
    stroke(200, 150, 50);
    strokeWeight(1);

    // Arrow body
    push();
    rotateX(HALF_PI);
    cylinder(8, 50);

    // Arrow head
    translate(0, 30, 0);
    cone(15, 25);
    pop();

    // Small marker on top to show "up" direction
    fill(255, 100, 100);
    push();
    translate(0, -35, 0);
    sphere(8);
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
