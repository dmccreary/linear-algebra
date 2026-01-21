// Rigid Body Transform Chain
// Visualizes composition of rigid body transforms (kinematic chain)
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 850;
let drawHeight = 550;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Joint angles (degrees)
let joint1Angle = 30;
let joint2Angle = -45;
let joint3Angle = 20;

// Link lengths
let link1Length = 120;
let link2Length = 100;
let link3Length = 80;

// Controls
let joint1Slider, joint2Slider, joint3Slider;
let showMatricesCheckbox, showFramesCheckbox;
let resetButton;

// View rotation
let viewRotX = -0.5;
let viewRotY = 0.6;

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

    // Row 1: Joint 1 and Joint 2 sliders
    let j1Label = createSpan('Joint 1:');
    j1Label.parent(container);
    j1Label.position(10, yRow1);
    j1Label.style('font-size', '14px');
    j1Label.style('color', '#cc0000');

    joint1Slider = createSlider(-180, 180, 30, 1);
    joint1Slider.parent(container);
    joint1Slider.position(70, yRow1);
    joint1Slider.size(150);

    let j2Label = createSpan('Joint 2:');
    j2Label.parent(container);
    j2Label.position(240, yRow1);
    j2Label.style('font-size', '14px');
    j2Label.style('color', '#00aa00');

    joint2Slider = createSlider(-180, 180, -45, 1);
    joint2Slider.parent(container);
    joint2Slider.position(300, yRow1);
    joint2Slider.size(150);

    let j3Label = createSpan('Joint 3:');
    j3Label.parent(container);
    j3Label.position(470, yRow1);
    j3Label.style('font-size', '14px');
    j3Label.style('color', '#0066cc');

    joint3Slider = createSlider(-180, 180, 20, 1);
    joint3Slider.parent(container);
    joint3Slider.position(530, yRow1);
    joint3Slider.size(150);

    // Row 2: Checkboxes and button
    showFramesCheckbox = createCheckbox('Show Coordinate Frames', true);
    showFramesCheckbox.parent(container);
    showFramesCheckbox.position(10, yRow2);
    showFramesCheckbox.style('font-size', '13px');

    showMatricesCheckbox = createCheckbox('Show Transforms', true);
    showMatricesCheckbox.parent(container);
    showMatricesCheckbox.position(190, yRow2);
    showMatricesCheckbox.style('font-size', '13px');

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(350, yRow2);
    resetButton.mousePressed(() => {
        joint1Slider.value(30);
        joint2Slider.value(-45);
        joint3Slider.value(20);
    });

    describe('Interactive rigid body transform chain showing kinematic chain composition', LABEL);
}

function draw() {
    updateCanvasSize();

    joint1Angle = joint1Slider.value();
    joint2Angle = joint2Slider.value();
    joint3Angle = joint3Slider.value();

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
    text('Rigid Body Transform Chain (Robot Arm)', canvasWidth/2, 10);

    // Display angle values
    textSize(12);
    textAlign(LEFT, TOP);
    fill(200, 0, 0);
    text('θ₁ = ' + joint1Angle + '°', 10, 40);
    fill(0, 170, 0);
    text('θ₂ = ' + joint2Angle + '°', 10, 55);
    fill(0, 100, 200);
    text('θ₃ = ' + joint3Angle + '°', 10, 70);

    // Compute and display end effector position
    let endPos = computeEndEffector();
    fill(0);
    textAlign(RIGHT, TOP);
    text('End Effector Position:', canvasWidth - 10, 40);
    text('X: ' + endPos.x.toFixed(1), canvasWidth - 10, 55);
    text('Y: ' + endPos.y.toFixed(1), canvasWidth - 10, 70);
    text('Z: ' + endPos.z.toFixed(1), canvasWidth - 10, 85);

    // Display transform matrices if enabled
    if (showMatricesCheckbox.checked()) {
        displayTransformInfo();
    }

    pop();

    // 3D visualization
    push();
    translate(0, 50, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);

    // Draw world frame
    if (showFramesCheckbox.checked()) {
        drawCoordinateFrame(60, 'World', [150, 150, 150]);
    }

    // Draw base
    fill(80);
    stroke(40);
    strokeWeight(1);
    push();
    translate(0, 10, 0);
    cylinder(40, 20);
    pop();

    // Draw kinematic chain
    drawKinematicChain();

    pop();
}

function drawKinematicChain() {
    let showFrames = showFramesCheckbox.checked();

    // Joint 1: Rotation about Y (vertical)
    push();
    rotateY(radians(joint1Angle));

    // Draw joint 1
    fill(200, 100, 100);
    stroke(150, 50, 50);
    sphere(15);

    if (showFrames) {
        drawCoordinateFrame(40, '1', [200, 100, 100]);
    }

    // Link 1 (along local Z)
    push();
    translate(0, 0, link1Length/2);
    fill(180, 100, 100);
    stroke(130, 50, 50);
    box(20, 20, link1Length);
    pop();

    // Move to end of link 1
    translate(0, 0, link1Length);

    // Joint 2: Rotation about X (pitch)
    rotateX(radians(joint2Angle));

    // Draw joint 2
    fill(100, 200, 100);
    stroke(50, 150, 50);
    sphere(12);

    if (showFrames) {
        drawCoordinateFrame(35, '2', [100, 200, 100]);
    }

    // Link 2
    push();
    translate(0, 0, link2Length/2);
    fill(100, 180, 100);
    stroke(50, 130, 50);
    box(16, 16, link2Length);
    pop();

    // Move to end of link 2
    translate(0, 0, link2Length);

    // Joint 3: Rotation about X
    rotateX(radians(joint3Angle));

    // Draw joint 3
    fill(100, 100, 200);
    stroke(50, 50, 150);
    sphere(10);

    if (showFrames) {
        drawCoordinateFrame(30, '3', [100, 100, 200]);
    }

    // Link 3 (end effector)
    push();
    translate(0, 0, link3Length/2);
    fill(100, 100, 180);
    stroke(50, 50, 130);
    box(12, 12, link3Length);
    pop();

    // End effector
    translate(0, 0, link3Length);
    fill(255, 200, 100);
    stroke(200, 150, 50);
    sphere(8);

    if (showFrames) {
        drawCoordinateFrame(25, 'E', [255, 200, 100]);
    }

    // Draw end effector gripper
    push();
    fill(100);
    stroke(60);
    translate(0, 0, 15);
    cone(12, 20);
    pop();

    pop();
}

function drawCoordinateFrame(size, label, col) {
    strokeWeight(2);

    // X axis (red)
    stroke(255, 100, 100);
    line(0, 0, 0, size, 0, 0);

    // Y axis (green)  - note: up in our convention
    stroke(100, 255, 100);
    line(0, 0, 0, 0, -size, 0);

    // Z axis (blue)
    stroke(100, 100, 255);
    line(0, 0, 0, 0, 0, size);

    // Label
    if (label) {
        push();
        translate(size * 0.3, -size * 0.3, 0);
        fill(col[0], col[1], col[2]);
        noStroke();
        textSize(12);
        rotateY(-viewRotY);
        rotateX(-viewRotX);
        text(label, 0, 0);
        pop();
    }
}

function computeEndEffector() {
    // Forward kinematics
    let theta1 = radians(joint1Angle);
    let theta2 = radians(joint2Angle);
    let theta3 = radians(joint3Angle);

    // Compute position using forward kinematics
    // Start at origin, apply transforms
    let c1 = cos(theta1), s1 = sin(theta1);
    let c2 = cos(theta2), s2 = sin(theta2);
    let c3 = cos(theta3), s3 = sin(theta3);

    // T1: Rotate about Y by theta1, then translate along Z by link1Length
    // T2: Rotate about X by theta2, then translate along Z by link2Length
    // T3: Rotate about X by theta3, then translate along Z by link3Length

    // Position after link 1 (in world frame)
    let p1 = {
        x: s1 * link1Length,
        y: 0,
        z: c1 * link1Length
    };

    // Direction after joint 2 rotation
    let dir2 = {
        x: s1 * c2,
        y: -s2,
        z: c1 * c2
    };

    // Position after link 2
    let p2 = {
        x: p1.x + dir2.x * link2Length,
        y: p1.y + dir2.y * link2Length,
        z: p1.z + dir2.z * link2Length
    };

    // Direction after joint 3 rotation
    let c23 = cos(theta2 + theta3);
    let s23 = sin(theta2 + theta3);
    let dir3 = {
        x: s1 * c23,
        y: -s23,
        z: c1 * c23
    };

    // Final end effector position
    let p3 = {
        x: p2.x + dir3.x * link3Length,
        y: p2.y + dir3.y * link3Length,
        z: p2.z + dir3.z * link3Length
    };

    return p3;
}

function displayTransformInfo() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);

    let x = 10;
    let y = 95;

    text('Transform Chain: T = T₁ · T₂ · T₃', x, y);
    text('Each Tᵢ = [Rᵢ | tᵢ]  (rotation + translation)', x, y + 15);

    // Show composed transform summary
    let theta1 = joint1Angle;
    let theta2 = joint2Angle;
    let theta3 = joint3Angle;
    text('T₁: Ry(' + theta1 + '°) → translate Z+' + link1Length, x, y + 35);
    text('T₂: Rx(' + theta2 + '°) → translate Z+' + link2Length, x, y + 50);
    text('T₃: Rx(' + theta3 + '°) → translate Z+' + link3Length, x, y + 65);

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
