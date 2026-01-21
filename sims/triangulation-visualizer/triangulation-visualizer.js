// Triangulation Visualizer
// Demonstrates how 3D points are recovered from stereo correspondences
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 800;
let drawHeight = 550;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Camera parameters
let baseline = 200;
let focalLength = 400;

// True 3D point
let truePoint = { x: 50, y: -40, z: 300 };

// Observed image points (can add noise)
let leftPoint = { u: 0, v: 0 };
let rightPoint = { u: 0, v: 0 };
let noiseLevel = 0;

// Controls
let baselineSlider, noiseSlider;
let leftUSlider, leftVSlider;

// View rotation
let viewRotX = -0.4;
let viewRotY = 0.6;

// Image dimensions
let imgW = 160;
let imgH = 120;

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

    // Compute initial projections
    updateProjections();

    let yRow1 = drawHeight + 10;
    let yRow2 = drawHeight + 45;

    // Row 1: Baseline and noise
    let bLabel = createSpan('Baseline:');
    bLabel.parent(container);
    bLabel.position(10, yRow1);
    bLabel.style('font-size', '13px');

    baselineSlider = createSlider(50, 400, 200, 10);
    baselineSlider.parent(container);
    baselineSlider.position(75, yRow1);
    baselineSlider.size(120);

    let nLabel = createSpan('Noise:');
    nLabel.parent(container);
    nLabel.position(220, yRow1);
    nLabel.style('font-size', '13px');

    noiseSlider = createSlider(0, 20, 0, 1);
    noiseSlider.parent(container);
    noiseSlider.position(270, yRow1);
    noiseSlider.size(100);

    // Row 2: Left image point adjustment
    let luLabel = createSpan('Left U:');
    luLabel.parent(container);
    luLabel.position(10, yRow2);
    luLabel.style('font-size', '13px');

    leftUSlider = createSlider(-80, 80, 0, 1);
    leftUSlider.parent(container);
    leftUSlider.position(65, yRow2);
    leftUSlider.size(100);

    let lvLabel = createSpan('Left V:');
    lvLabel.parent(container);
    lvLabel.position(180, yRow2);
    lvLabel.style('font-size', '13px');

    leftVSlider = createSlider(-60, 60, 0, 1);
    leftVSlider.parent(container);
    leftVSlider.position(230, yRow2);
    leftVSlider.size(100);

    describe('Interactive triangulation visualizer showing 3D reconstruction from stereo', LABEL);
}

function updateProjections() {
    let camL = { x: -baseline/2, y: 0, z: 0 };
    let camR = { x: baseline/2, y: 0, z: 0 };

    // Project true point
    leftPoint = projectPoint(truePoint, camL);
    rightPoint = projectPoint(truePoint, camR);
}

function projectPoint(pt, cam) {
    let dx = pt.x - cam.x;
    let dy = pt.y - cam.y;
    let dz = pt.z - cam.z;

    let u = focalLength * dx / dz;
    let v = focalLength * dy / dz;

    return { u, v };
}

function draw() {
    updateCanvasSize();

    baseline = baselineSlider.value();
    noiseLevel = noiseSlider.value();

    let camL = { x: -baseline/2, y: 0, z: 0 };
    let camR = { x: baseline/2, y: 0, z: 0 };

    // Update projections
    updateProjections();

    // Add user offset to left point
    let observedLeft = {
        u: leftPoint.u + leftUSlider.value(),
        v: leftPoint.v + leftVSlider.value()
    };

    // Add noise to right point
    let observedRight = {
        u: rightPoint.u + random(-noiseLevel, noiseLevel),
        v: rightPoint.v + random(-noiseLevel, noiseLevel)
    };

    // Triangulate
    let triangulated = triangulate(observedLeft, observedRight, camL, camR);

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
    text('Triangulation Visualizer', canvasWidth/2, 8);

    // Draw image views
    drawImageViews(observedLeft, observedRight);

    // Display triangulation results
    drawTriangulationInfo(triangulated);

    pop();

    // 3D visualization
    push();
    translate(50, 100, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);
    scale(0.65);

    // Draw cameras
    drawCamera(camL, 'L', [200, 100, 100]);
    drawCamera(camR, 'R', [100, 100, 200]);

    // Draw baseline
    stroke(150);
    strokeWeight(2);
    line(camL.x, 0, 0, camR.x, 0, 0);

    // Draw true 3D point
    push();
    translate(truePoint.x, -truePoint.y, truePoint.z);
    fill(100, 200, 100);
    noStroke();
    sphere(10);
    pop();

    // Draw triangulated point
    if (triangulated) {
        push();
        translate(triangulated.x, -triangulated.y, triangulated.z);
        fill(255, 100, 100, 200);
        noStroke();
        sphere(12);
        pop();

        // Draw error line
        stroke(255, 100, 100);
        strokeWeight(1);
        line(truePoint.x, -truePoint.y, truePoint.z,
             triangulated.x, -triangulated.y, triangulated.z);
    }

    // Draw projection rays
    drawProjectionRays(observedLeft, observedRight, camL, camR, triangulated);

    pop();
}

function triangulate(pL, pR, camL, camR) {
    // Simple mid-point triangulation
    // Ray from left camera: camL + t * dirL
    // Ray from right camera: camR + s * dirR

    // Direction from left camera through image point
    let dirL = {
        x: pL.u / focalLength,
        y: pL.v / focalLength,
        z: 1
    };
    let lenL = sqrt(dirL.x**2 + dirL.y**2 + dirL.z**2);
    dirL.x /= lenL; dirL.y /= lenL; dirL.z /= lenL;

    // Direction from right camera through image point
    let dirR = {
        x: pR.u / focalLength,
        y: pR.v / focalLength,
        z: 1
    };
    let lenR = sqrt(dirR.x**2 + dirR.y**2 + dirR.z**2);
    dirR.x /= lenR; dirR.y /= lenR; dirR.z /= lenR;

    // Find closest point between rays (mid-point method)
    // Using least squares solution
    let w0 = {
        x: camL.x - camR.x,
        y: camL.y - camR.y,
        z: camL.z - camR.z
    };

    let a = dirL.x * dirL.x + dirL.y * dirL.y + dirL.z * dirL.z;
    let b = dirL.x * dirR.x + dirL.y * dirR.y + dirL.z * dirR.z;
    let c = dirR.x * dirR.x + dirR.y * dirR.y + dirR.z * dirR.z;
    let d = dirL.x * w0.x + dirL.y * w0.y + dirL.z * w0.z;
    let e = dirR.x * w0.x + dirR.y * w0.y + dirR.z * w0.z;

    let denom = a * c - b * b;
    if (abs(denom) < 0.0001) return null;

    let t = (b * e - c * d) / denom;
    let s = (a * e - b * d) / denom;

    // Points on each ray
    let p1 = {
        x: camL.x + t * dirL.x,
        y: camL.y + t * dirL.y,
        z: camL.z + t * dirL.z
    };

    let p2 = {
        x: camR.x + s * dirR.x,
        y: camR.y + s * dirR.y,
        z: camR.z + s * dirR.z
    };

    // Mid-point
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        z: (p1.z + p2.z) / 2
    };
}

function drawCamera(pos, label, col) {
    push();
    translate(pos.x, -pos.y, pos.z);

    fill(col[0], col[1], col[2]);
    stroke(col[0]*0.5, col[1]*0.5, col[2]*0.5);
    strokeWeight(1);
    box(25, 18, 35);

    // Lens
    push();
    translate(0, 0, 22);
    fill(80);
    cylinder(8, 12);
    pop();

    // Label
    fill(col[0], col[1], col[2]);
    noStroke();
    textSize(14);
    push();
    translate(0, 22, 0);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text(label, 0, 0);
    pop();

    pop();
}

function drawProjectionRays(pL, pR, camL, camR, triangulated) {
    // Ray from left camera
    let dirL = { x: pL.u / focalLength, y: pL.v / focalLength, z: 1 };
    let lenL = sqrt(dirL.x**2 + dirL.y**2 + dirL.z**2);
    let rayLen = 600;

    stroke(200, 100, 100, 150);
    strokeWeight(2);
    line(camL.x, 0, 0,
         camL.x + dirL.x/lenL * rayLen,
         -dirL.y/lenL * rayLen,
         dirL.z/lenL * rayLen);

    // Ray from right camera
    let dirR = { x: pR.u / focalLength, y: pR.v / focalLength, z: 1 };
    let lenR = sqrt(dirR.x**2 + dirR.y**2 + dirR.z**2);

    stroke(100, 100, 200, 150);
    strokeWeight(2);
    line(camR.x, 0, 0,
         camR.x + dirR.x/lenR * rayLen,
         -dirR.y/lenR * rayLen,
         dirR.z/lenR * rayLen);
}

function drawImageViews(pL, pR) {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    let imgLX = 30;
    let imgRX = 30 + imgW + 20;
    let imgY = 40;

    // Left image
    fill(255);
    stroke(200, 100, 100);
    strokeWeight(2);
    rect(imgLX, imgY, imgW, imgH);

    fill(200, 100, 100);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Left Image', imgLX + imgW/2, imgY + imgH + 3);

    // Draw point in left image
    fill(255, 200, 100);
    noStroke();
    ellipse(imgLX + imgW/2 + pL.u * 0.5, imgY + imgH/2 + pL.v * 0.5, 10, 10);

    // Right image
    fill(255);
    stroke(100, 100, 200);
    strokeWeight(2);
    rect(imgRX, imgY, imgW, imgH);

    fill(100, 100, 200);
    noStroke();
    text('Right Image', imgRX + imgW/2, imgY + imgH + 3);

    // Draw point in right image
    fill(255, 200, 100);
    noStroke();
    ellipse(imgRX + imgW/2 + pR.u * 0.5, imgY + imgH/2 + pR.v * 0.5, 10, 10);

    pop();
}

function drawTriangulationInfo(triangulated) {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    let x = 30;
    let y = imgH + 80;

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);

    text('True Point: (' + truePoint.x.toFixed(1) + ', ' + truePoint.y.toFixed(1) + ', ' + truePoint.z.toFixed(1) + ')', x, y);

    if (triangulated) {
        text('Triangulated: (' + triangulated.x.toFixed(1) + ', ' + triangulated.y.toFixed(1) + ', ' + triangulated.z.toFixed(1) + ')', x, y + 18);

        let error = sqrt((triangulated.x - truePoint.x)**2 +
                        (triangulated.y - truePoint.y)**2 +
                        (triangulated.z - truePoint.z)**2);
        fill(error > 10 ? '#cc0000' : '#006600');
        text('3D Error: ' + error.toFixed(2) + ' units', x, y + 36);
    }

    fill(100);
    text('Drag left image point or add noise to see triangulation error', x, y + 60);

    pop();
}

function mouseDragged() {
    if (mouseY < drawHeight && mouseX > canvasWidth * 0.35) {
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
