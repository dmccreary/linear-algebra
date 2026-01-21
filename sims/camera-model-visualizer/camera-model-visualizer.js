// Camera Model Visualizer
// Demonstrates how camera parameters affect 3D-to-2D projection
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 900;
let drawHeight = 550;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Camera intrinsic parameters
let focalLength = 500;  // in pixels
let cx = 320;  // principal point x
let cy = 240;  // principal point y

// Camera extrinsic parameters
let camX = 0, camY = -100, camZ = -400;
let camRotX = 0.3, camRotY = 0;

// Controls
let focalSlider, cxSlider, cySlider;
let camDistSlider;
let showRaysCheckbox, showFrustumCheckbox;

// 3D scene objects
let scenePoints = [];

// View rotation
let viewRotX = -0.4;
let viewRotY = 0.5;

// Image dimensions
let imgWidth = 640;
let imgHeight = 480;

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

    // Create scene points (3D objects)
    createScenePoints();

    let yRow1 = drawHeight + 10;
    let yRow2 = drawHeight + 45;
    let yRow3 = drawHeight + 75;

    // Row 1: Focal length and principal point
    let fLabel = createSpan('Focal Length:');
    fLabel.parent(container);
    fLabel.position(10, yRow1);
    fLabel.style('font-size', '13px');

    focalSlider = createSlider(200, 1500, 500, 10);
    focalSlider.parent(container);
    focalSlider.position(100, yRow1);
    focalSlider.size(150);

    let cxLabel = createSpan('Cx:');
    cxLabel.parent(container);
    cxLabel.position(270, yRow1);
    cxLabel.style('font-size', '13px');

    cxSlider = createSlider(0, 640, 320, 1);
    cxSlider.parent(container);
    cxSlider.position(300, yRow1);
    cxSlider.size(100);

    let cyLabel = createSpan('Cy:');
    cyLabel.parent(container);
    cyLabel.position(420, yRow1);
    cyLabel.style('font-size', '13px');

    cySlider = createSlider(0, 480, 240, 1);
    cySlider.parent(container);
    cySlider.position(450, yRow1);
    cySlider.size(100);

    // Row 2: Camera distance and checkboxes
    let distLabel = createSpan('Camera Distance:');
    distLabel.parent(container);
    distLabel.position(10, yRow2);
    distLabel.style('font-size', '13px');

    camDistSlider = createSlider(200, 800, 400, 10);
    camDistSlider.parent(container);
    camDistSlider.position(120, yRow2);
    camDistSlider.size(150);

    showRaysCheckbox = createCheckbox('Show Projection Rays', true);
    showRaysCheckbox.parent(container);
    showRaysCheckbox.position(290, yRow2);
    showRaysCheckbox.style('font-size', '13px');

    showFrustumCheckbox = createCheckbox('Show Camera Frustum', true);
    showFrustumCheckbox.parent(container);
    showFrustumCheckbox.position(450, yRow2);
    showFrustumCheckbox.style('font-size', '13px');

    describe('Interactive camera model visualizer showing projection from 3D to 2D', LABEL);
}

function createScenePoints() {
    // Create a grid of 3D points at different depths
    scenePoints = [];

    // Ground plane points
    for (let x = -150; x <= 150; x += 75) {
        for (let z = 100; z <= 400; z += 100) {
            scenePoints.push({
                x: x,
                y: 50,  // ground level
                z: z,
                color: [100, 150, 100]
            });
        }
    }

    // Vertical objects (like poles)
    scenePoints.push({ x: -100, y: 0, z: 200, color: [200, 100, 100] });
    scenePoints.push({ x: -100, y: -50, z: 200, color: [200, 100, 100] });
    scenePoints.push({ x: 100, y: 0, z: 300, color: [100, 100, 200] });
    scenePoints.push({ x: 100, y: -80, z: 300, color: [100, 100, 200] });

    // Floating points
    scenePoints.push({ x: 0, y: -100, z: 250, color: [255, 200, 100] });
    scenePoints.push({ x: 50, y: -70, z: 350, color: [200, 100, 200] });
}

function draw() {
    updateCanvasSize();

    focalLength = focalSlider.value();
    cx = cxSlider.value();
    cy = cySlider.value();
    camZ = -camDistSlider.value();

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
    textSize(18);
    textAlign(CENTER, TOP);
    text('Camera Model Visualizer', canvasWidth/2, 8);

    // Display intrinsic matrix
    drawIntrinsicMatrix();

    // Draw 2D image view
    drawImageView();

    pop();

    // 3D visualization
    push();
    translate(-canvasWidth/4 + 50, 30, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);
    scale(0.8);

    // Draw ground plane
    drawGroundPlane();

    // Draw camera
    drawCamera();

    // Draw scene points
    drawScenePoints();

    // Draw projection rays
    if (showRaysCheckbox.checked()) {
        drawProjectionRays();
    }

    pop();
}

function drawIntrinsicMatrix() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);

    let x = 10;
    let y = 35;

    text('Intrinsic Matrix K:', x, y);
    textSize(11);
    text('[ ' + focalLength.toFixed(0) + '    0    ' + cx.toFixed(0) + ' ]', x, y + 18);
    text('[   0   ' + focalLength.toFixed(0) + '   ' + cy.toFixed(0) + ' ]', x, y + 33);
    text('[   0     0     1 ]', x, y + 48);

    // FOV calculation
    let fovH = 2 * atan(imgWidth / (2 * focalLength));
    let fovV = 2 * atan(imgHeight / (2 * focalLength));
    text('FOV: ' + degrees(fovH).toFixed(1) + '° × ' + degrees(fovV).toFixed(1) + '°', x, y + 70);

    pop();
}

function drawImageView() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Image view position
    let imgX = canvasWidth - 220;
    let imgY = 40;
    let imgScale = 0.3;

    // Draw image border
    fill(255);
    stroke(100);
    strokeWeight(2);
    rect(imgX, imgY, imgWidth * imgScale, imgHeight * imgScale);

    // Draw principal point
    fill(255, 0, 0);
    noStroke();
    let ppX = imgX + cx * imgScale;
    let ppY = imgY + cy * imgScale;
    ellipse(ppX, ppY, 6, 6);

    // Project and draw scene points on image
    for (let pt of scenePoints) {
        let proj = projectPoint(pt);
        if (proj) {
            let px = imgX + proj.u * imgScale;
            let py = imgY + proj.v * imgScale;

            if (px >= imgX && px <= imgX + imgWidth * imgScale &&
                py >= imgY && py <= imgY + imgHeight * imgScale) {
                fill(pt.color[0], pt.color[1], pt.color[2]);
                noStroke();
                ellipse(px, py, 8, 8);
            }
        }
    }

    // Image label
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('2D Image', imgX + imgWidth * imgScale / 2, imgY + imgHeight * imgScale + 5);

    pop();
}

function projectPoint(pt) {
    // Transform to camera coordinates
    let dx = pt.x - camX;
    let dy = pt.y - camY;
    let dz = pt.z - camZ;

    // Apply camera rotation (simplified)
    let cRx = cos(camRotX), sRx = sin(camRotX);
    let y1 = cRx * dy - sRx * dz;
    let z1 = sRx * dy + cRx * dz;

    // Point is behind camera
    if (z1 <= 0) return null;

    // Perspective projection
    let u = focalLength * dx / z1 + cx;
    let v = focalLength * y1 / z1 + cy;

    return { u, v, z: z1 };
}

function drawCamera() {
    push();
    translate(camX, -camY, -camZ);
    rotateX(-camRotX);

    // Camera body
    fill(50, 50, 50);
    stroke(30);
    strokeWeight(1);
    box(40, 30, 50);

    // Lens
    fill(80, 80, 100);
    push();
    translate(0, 0, 30);
    cylinder(15, 20);
    pop();

    // Draw frustum
    if (showFrustumCheckbox.checked()) {
        drawFrustum();
    }

    pop();
}

function drawFrustum() {
    let nearZ = 50;
    let farZ = 500;

    let nearW = nearZ * imgWidth / (2 * focalLength);
    let nearH = nearZ * imgHeight / (2 * focalLength);
    let farW = farZ * imgWidth / (2 * focalLength);
    let farH = farZ * imgHeight / (2 * focalLength);

    stroke(255, 200, 100, 150);
    strokeWeight(1);
    noFill();

    // Near plane
    beginShape();
    vertex(-nearW, -nearH, nearZ);
    vertex(nearW, -nearH, nearZ);
    vertex(nearW, nearH, nearZ);
    vertex(-nearW, nearH, nearZ);
    endShape(CLOSE);

    // Far plane
    beginShape();
    vertex(-farW, -farH, farZ);
    vertex(farW, -farH, farZ);
    vertex(farW, farH, farZ);
    vertex(-farW, farH, farZ);
    endShape(CLOSE);

    // Edges connecting planes
    line(-nearW, -nearH, nearZ, -farW, -farH, farZ);
    line(nearW, -nearH, nearZ, farW, -farH, farZ);
    line(nearW, nearH, nearZ, farW, farH, farZ);
    line(-nearW, nearH, nearZ, -farW, farH, farZ);
}

function drawGroundPlane() {
    stroke(200, 200, 200, 100);
    strokeWeight(1);

    let groundY = 50;
    for (let x = -200; x <= 200; x += 50) {
        line(x, groundY, 0, x, groundY, 500);
    }
    for (let z = 0; z <= 500; z += 50) {
        line(-200, groundY, z, 200, groundY, z);
    }
}

function drawScenePoints() {
    for (let pt of scenePoints) {
        push();
        translate(pt.x, -pt.y, pt.z);
        fill(pt.color[0], pt.color[1], pt.color[2]);
        noStroke();
        sphere(8);
        pop();
    }
}

function drawProjectionRays() {
    stroke(255, 150, 100, 100);
    strokeWeight(1);

    for (let pt of scenePoints) {
        let proj = projectPoint(pt);
        if (proj && proj.z > 0) {
            line(camX, -camY, -camZ, pt.x, -pt.y, pt.z);
        }
    }
}

function mouseDragged() {
    if (mouseY < drawHeight && mouseX > 0 && mouseX < canvasWidth * 0.6) {
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
