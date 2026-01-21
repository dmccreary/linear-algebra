// Epipolar Geometry Visualizer
// Demonstrates epipolar constraints in stereo vision
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 900;
let drawHeight = 600;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Camera parameters
let baseline = 200;  // Distance between cameras
let focalLength = 400;

// 3D point
let point3D = { x: 0, y: -50, z: 300 };

// Controls
let baselineSlider;
let pointXSlider, pointZSlider;
let showPlaneCheckbox, showAllLinesCheckbox;

// View rotation
let viewRotX = -0.35;
let viewRotY = 0.6;

// Image dimensions
let imgW = 200;
let imgH = 150;

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

    // Row 1: Baseline and point controls
    let bLabel = createSpan('Baseline:');
    bLabel.parent(container);
    bLabel.position(10, yRow1);
    bLabel.style('font-size', '13px');

    baselineSlider = createSlider(50, 400, 200, 10);
    baselineSlider.parent(container);
    baselineSlider.position(75, yRow1);
    baselineSlider.size(120);

    let pxLabel = createSpan('Point X:');
    pxLabel.parent(container);
    pxLabel.position(220, yRow1);
    pxLabel.style('font-size', '13px');

    pointXSlider = createSlider(-200, 200, 0, 5);
    pointXSlider.parent(container);
    pointXSlider.position(280, yRow1);
    pointXSlider.size(120);

    let pzLabel = createSpan('Point Z:');
    pzLabel.parent(container);
    pzLabel.position(420, yRow1);
    pzLabel.style('font-size', '13px');

    pointZSlider = createSlider(100, 500, 300, 10);
    pointZSlider.parent(container);
    pointZSlider.position(480, yRow1);
    pointZSlider.size(120);

    // Row 2: Checkboxes
    showPlaneCheckbox = createCheckbox('Show Epipolar Plane', true);
    showPlaneCheckbox.parent(container);
    showPlaneCheckbox.position(10, yRow2);
    showPlaneCheckbox.style('font-size', '13px');

    showAllLinesCheckbox = createCheckbox('Show Multiple Epipolar Lines', false);
    showAllLinesCheckbox.parent(container);
    showAllLinesCheckbox.position(180, yRow2);
    showAllLinesCheckbox.style('font-size', '13px');

    describe('Interactive epipolar geometry visualizer showing stereo vision constraints', LABEL);
}

function draw() {
    updateCanvasSize();

    baseline = baselineSlider.value();
    point3D.x = pointXSlider.value();
    point3D.z = pointZSlider.value();

    // Camera positions
    let camL = { x: -baseline/2, y: 0, z: 0 };
    let camR = { x: baseline/2, y: 0, z: 0 };

    // Project point to both images
    let projL = projectToImage(point3D, camL);
    let projR = projectToImage(point3D, camR);

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
    text('Epipolar Geometry Visualizer', canvasWidth/2, 8);

    // Draw image views
    drawStereoImages(projL, projR, camL, camR);

    // Display info
    drawEpipolarInfo(projL, projR);

    pop();

    // 3D visualization
    push();
    translate(-50, 80, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);
    scale(0.7);

    // Draw cameras
    drawCamera(camL, 'L', [200, 100, 100]);
    drawCamera(camR, 'R', [100, 100, 200]);

    // Draw baseline
    stroke(150);
    strokeWeight(2);
    line(camL.x, -camL.y, camL.z, camR.x, -camR.y, camR.z);

    // Draw 3D point
    push();
    translate(point3D.x, -point3D.y, point3D.z);
    fill(255, 200, 100);
    noStroke();
    sphere(12);
    pop();

    // Draw projection rays
    stroke(255, 150, 100, 150);
    strokeWeight(1);
    line(camL.x, -camL.y, camL.z, point3D.x, -point3D.y, point3D.z);
    line(camR.x, -camR.y, camR.z, point3D.x, -point3D.y, point3D.z);

    // Draw epipolar plane
    if (showPlaneCheckbox.checked()) {
        drawEpipolarPlane(camL, camR, point3D);
    }

    // Draw epipoles
    drawEpipoles(camL, camR);

    pop();
}

function projectToImage(pt, cam) {
    let dx = pt.x - cam.x;
    let dy = pt.y - cam.y;
    let dz = pt.z - cam.z;

    if (dz <= 0) return null;

    let u = focalLength * dx / dz + imgW/2;
    let v = focalLength * dy / dz + imgH/2;

    return { u, v };
}

function drawCamera(pos, label, col) {
    push();
    translate(pos.x, -pos.y, pos.z);

    fill(col[0], col[1], col[2]);
    stroke(col[0]*0.5, col[1]*0.5, col[2]*0.5);
    strokeWeight(1);
    box(30, 20, 40);

    // Lens
    push();
    translate(0, 0, 25);
    fill(80);
    cylinder(10, 15);
    pop();

    // Label
    fill(col[0], col[1], col[2]);
    noStroke();
    textSize(16);
    push();
    translate(0, 25, 0);
    rotateY(-viewRotY);
    rotateX(-viewRotX);
    text(label, 0, 0);
    pop();

    pop();
}

function drawEpipolarPlane(camL, camR, pt) {
    // The epipolar plane contains both camera centers and the 3D point
    fill(255, 200, 100, 50);
    stroke(255, 200, 100, 150);
    strokeWeight(1);

    beginShape();
    vertex(camL.x, -camL.y, camL.z);
    vertex(camR.x, -camR.y, camR.z);
    vertex(pt.x, -pt.y, pt.z);
    endShape(CLOSE);

    // Extend plane to image planes
    let scale = 1.5;
    beginShape();
    vertex(camL.x, -camL.y, camL.z);
    vertex(pt.x * scale, -pt.y * scale, pt.z * scale);
    vertex(camR.x, -camR.y, camR.z);
    endShape(CLOSE);
}

function drawEpipoles(camL, camR) {
    // Epipole in left image: projection of right camera center
    // Epipole in right image: projection of left camera center

    // For parallel cameras, epipoles are at infinity (on the baseline direction)
    // We'll show them symbolically

    push();
    // Left epipole direction (toward right camera)
    translate(camL.x + 50, -camL.y, camL.z + 30);
    fill(100, 200, 100);
    noStroke();
    sphere(5);
    pop();

    push();
    // Right epipole direction (toward left camera)
    translate(camR.x - 50, -camR.y, camR.z + 30);
    fill(100, 200, 100);
    noStroke();
    sphere(5);
    pop();
}

function drawStereoImages(projL, projR, camL, camR) {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    let imgLX = 50;
    let imgRX = canvasWidth - imgW - 50;
    let imgY = 40;

    // Left image
    fill(255);
    stroke(200, 100, 100);
    strokeWeight(2);
    rect(imgLX, imgY, imgW, imgH);

    fill(200, 100, 100);
    noStroke();
    textSize(14);
    textAlign(CENTER, TOP);
    text('Left Image', imgLX + imgW/2, imgY + imgH + 5);

    // Right image
    fill(255);
    stroke(100, 100, 200);
    strokeWeight(2);
    rect(imgRX, imgY, imgW, imgH);

    fill(100, 100, 200);
    noStroke();
    text('Right Image', imgRX + imgW/2, imgY + imgH + 5);

    // Draw projected points
    if (projL) {
        fill(255, 200, 100);
        noStroke();
        ellipse(imgLX + projL.u, imgY + projL.v, 12, 12);
    }

    if (projR) {
        fill(255, 200, 100);
        noStroke();
        ellipse(imgRX + projR.u, imgY + projR.v, 12, 12);
    }

    // Draw epipolar lines
    stroke(100, 200, 100);
    strokeWeight(2);

    // In rectified stereo, epipolar lines are horizontal
    if (projL) {
        line(imgLX, imgY + projL.v, imgLX + imgW, imgY + projL.v);
    }
    if (projR) {
        line(imgRX, imgY + projR.v, imgRX + imgW, imgY + projR.v);
    }

    // Show multiple epipolar lines if enabled
    if (showAllLinesCheckbox.checked()) {
        stroke(100, 200, 100, 100);
        strokeWeight(1);
        for (let y = 20; y < imgH; y += 30) {
            line(imgLX, imgY + y, imgLX + imgW, imgY + y);
            line(imgRX, imgY + y, imgRX + imgW, imgY + y);
        }
    }

    // Disparity indicator
    if (projL && projR) {
        let disparity = projL.u - projR.u;

        // Draw disparity line
        stroke(200, 100, 200);
        strokeWeight(2);
        let midY = imgY + imgH + 40;
        line(imgLX + projL.u, midY, imgRX + projR.u, midY);

        fill(200, 100, 200);
        noStroke();
        textSize(12);
        textAlign(CENTER, TOP);
        text('Disparity: ' + disparity.toFixed(1) + ' px', (imgLX + imgRX + imgW)/2, midY + 5);
    }

    pop();
}

function drawEpipolarInfo(projL, projR) {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);

    let x = 50;
    let y = imgH + 110;

    text('Epipolar Constraint: p\'ᵀ F p = 0', x, y);
    text('For rectified stereo: corresponding points have same y-coordinate', x, y + 18);

    if (projL && projR) {
        let disparity = projL.u - projR.u;
        let depth = (focalLength * baseline) / disparity;
        text('Depth from Disparity: Z = f·B/d = ' + focalLength + '·' + baseline + '/' +
             disparity.toFixed(1) + ' = ' + depth.toFixed(1), x, y + 36);
    }

    pop();
}

function mouseDragged() {
    if (mouseY < drawHeight - 100 && mouseX > canvasWidth * 0.2 && mouseX < canvasWidth * 0.8) {
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
