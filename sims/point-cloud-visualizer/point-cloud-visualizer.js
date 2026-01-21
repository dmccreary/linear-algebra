// Point Cloud Visualizer
// Explores point cloud data and common processing operations
// MicroSim for Linear Algebra Chapter 14

let canvasWidth = 800;
let drawHeight = 550;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Point cloud data
let points = [];
let originalPoints = [];
let numPoints = 2000;

// Controls
let pointSizeSlider, voxelSizeSlider;
let colorModeSelect, datasetSelect;
let showNormalsCheckbox, showBoundingBoxCheckbox;

// View rotation
let viewRotX = -0.5;
let viewRotY = 0.4;
let viewScale = 1;

// Point cloud bounds
let minBound = { x: 0, y: 0, z: 0 };
let maxBound = { x: 0, y: 0, z: 0 };

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

    // Generate initial point cloud
    generatePointCloud('terrain');

    let yRow1 = drawHeight + 10;
    let yRow2 = drawHeight + 45;
    let yRow3 = drawHeight + 75;

    // Row 1: Dataset and color mode
    let dsLabel = createSpan('Dataset:');
    dsLabel.parent(container);
    dsLabel.position(10, yRow1);
    dsLabel.style('font-size', '13px');

    datasetSelect = createSelect();
    datasetSelect.parent(container);
    datasetSelect.position(65, yRow1);
    datasetSelect.option('Terrain');
    datasetSelect.option('Building');
    datasetSelect.option('Sphere');
    datasetSelect.option('Random');
    datasetSelect.selected('Terrain');
    datasetSelect.changed(() => generatePointCloud(datasetSelect.value().toLowerCase()));

    let cmLabel = createSpan('Color by:');
    cmLabel.parent(container);
    cmLabel.position(180, yRow1);
    cmLabel.style('font-size', '13px');

    colorModeSelect = createSelect();
    colorModeSelect.parent(container);
    colorModeSelect.position(240, yRow1);
    colorModeSelect.option('Height');
    colorModeSelect.option('Intensity');
    colorModeSelect.option('Normal');
    colorModeSelect.option('RGB');
    colorModeSelect.selected('Height');

    // Row 2: Point size and voxel size
    let psLabel = createSpan('Point Size:');
    psLabel.parent(container);
    psLabel.position(10, yRow2);
    psLabel.style('font-size', '13px');

    pointSizeSlider = createSlider(1, 10, 3, 1);
    pointSizeSlider.parent(container);
    pointSizeSlider.position(85, yRow2);
    pointSizeSlider.size(100);

    let vsLabel = createSpan('Downsample:');
    vsLabel.parent(container);
    vsLabel.position(200, yRow2);
    vsLabel.style('font-size', '13px');

    voxelSizeSlider = createSlider(1, 20, 1, 1);
    voxelSizeSlider.parent(container);
    voxelSizeSlider.position(285, yRow2);
    voxelSizeSlider.size(100);

    // Row 2: Checkboxes
    showNormalsCheckbox = createCheckbox('Show Normals', false);
    showNormalsCheckbox.parent(container);
    showNormalsCheckbox.position(400, yRow2);
    showNormalsCheckbox.style('font-size', '13px');

    showBoundingBoxCheckbox = createCheckbox('Show Bounding Box', true);
    showBoundingBoxCheckbox.parent(container);
    showBoundingBoxCheckbox.position(520, yRow2);
    showBoundingBoxCheckbox.style('font-size', '13px');

    describe('Interactive point cloud visualizer with processing operations', LABEL);
}

function generatePointCloud(type) {
    originalPoints = [];

    switch(type) {
        case 'terrain':
            // Generate terrain-like point cloud
            for (let i = 0; i < numPoints; i++) {
                let x = random(-200, 200);
                let z = random(-200, 200);
                let y = noise(x * 0.02, z * 0.02) * 100 - 50;
                originalPoints.push({
                    x, y, z,
                    intensity: noise(x * 0.05, z * 0.05),
                    r: 100 + y, g: 150, b: 100 - y * 0.5,
                    nx: 0, ny: -1, nz: 0
                });
            }
            break;

        case 'building':
            // Generate building-like structure
            for (let i = 0; i < numPoints; i++) {
                let face = floor(random(6));
                let x, y, z;

                // Box dimensions
                let w = 100, h = 150, d = 80;

                switch(face) {
                    case 0: x = -w/2; y = random(-h, 0); z = random(-d/2, d/2); break;
                    case 1: x = w/2; y = random(-h, 0); z = random(-d/2, d/2); break;
                    case 2: x = random(-w/2, w/2); y = random(-h, 0); z = -d/2; break;
                    case 3: x = random(-w/2, w/2); y = random(-h, 0); z = d/2; break;
                    case 4: x = random(-w/2, w/2); y = 0; z = random(-d/2, d/2); break;
                    case 5: x = random(-w/2, w/2); y = -h; z = random(-d/2, d/2); break;
                }

                originalPoints.push({
                    x, y, z,
                    intensity: random(0.5, 1),
                    r: 150, g: 150, b: 170,
                    nx: face < 2 ? (face === 0 ? -1 : 1) : 0,
                    ny: face >= 4 ? (face === 4 ? -1 : 1) : 0,
                    nz: face >= 2 && face < 4 ? (face === 2 ? -1 : 1) : 0
                });
            }
            break;

        case 'sphere':
            // Generate sphere point cloud
            for (let i = 0; i < numPoints; i++) {
                let theta = random(TWO_PI);
                let phi = acos(random(-1, 1));
                let r = 120 + random(-5, 5);

                let x = r * sin(phi) * cos(theta);
                let y = r * cos(phi);
                let z = r * sin(phi) * sin(theta);

                let nx = sin(phi) * cos(theta);
                let ny = cos(phi);
                let nz = sin(phi) * sin(theta);

                originalPoints.push({
                    x, y, z,
                    intensity: 0.5 + 0.5 * ny,
                    r: 150 + 100 * nx, g: 150 + 100 * ny, b: 150 + 100 * nz,
                    nx, ny, nz
                });
            }
            break;

        case 'random':
            // Random point cloud
            for (let i = 0; i < numPoints; i++) {
                let x = random(-200, 200);
                let y = random(-150, 50);
                let z = random(-200, 200);

                originalPoints.push({
                    x, y, z,
                    intensity: random(),
                    r: random(100, 255), g: random(100, 255), b: random(100, 255),
                    nx: random(-1, 1), ny: random(-1, 1), nz: random(-1, 1)
                });
            }
            break;
    }

    // Normalize normals
    for (let p of originalPoints) {
        let len = sqrt(p.nx**2 + p.ny**2 + p.nz**2);
        if (len > 0) {
            p.nx /= len;
            p.ny /= len;
            p.nz /= len;
        }
    }

    computeBounds();
    points = [...originalPoints];
}

function computeBounds() {
    if (originalPoints.length === 0) return;

    minBound = { x: Infinity, y: Infinity, z: Infinity };
    maxBound = { x: -Infinity, y: -Infinity, z: -Infinity };

    for (let p of originalPoints) {
        minBound.x = min(minBound.x, p.x);
        minBound.y = min(minBound.y, p.y);
        minBound.z = min(minBound.z, p.z);
        maxBound.x = max(maxBound.x, p.x);
        maxBound.y = max(maxBound.y, p.y);
        maxBound.z = max(maxBound.z, p.z);
    }
}

function downsample(voxelSize) {
    if (voxelSize <= 1) {
        points = [...originalPoints];
        return;
    }

    // Voxel grid downsampling
    let voxels = new Map();

    for (let p of originalPoints) {
        let vx = floor(p.x / voxelSize);
        let vy = floor(p.y / voxelSize);
        let vz = floor(p.z / voxelSize);
        let key = vx + ',' + vy + ',' + vz;

        if (!voxels.has(key)) {
            voxels.set(key, { points: [], sum: { x: 0, y: 0, z: 0, intensity: 0, r: 0, g: 0, b: 0, nx: 0, ny: 0, nz: 0 }, count: 0 });
        }

        let v = voxels.get(key);
        v.sum.x += p.x;
        v.sum.y += p.y;
        v.sum.z += p.z;
        v.sum.intensity += p.intensity;
        v.sum.r += p.r;
        v.sum.g += p.g;
        v.sum.b += p.b;
        v.sum.nx += p.nx;
        v.sum.ny += p.ny;
        v.sum.nz += p.nz;
        v.count++;
    }

    points = [];
    for (let [key, v] of voxels) {
        let n = v.count;
        points.push({
            x: v.sum.x / n,
            y: v.sum.y / n,
            z: v.sum.z / n,
            intensity: v.sum.intensity / n,
            r: v.sum.r / n,
            g: v.sum.g / n,
            b: v.sum.b / n,
            nx: v.sum.nx / n,
            ny: v.sum.ny / n,
            nz: v.sum.nz / n
        });
    }
}

function draw() {
    updateCanvasSize();

    let pointSize = pointSizeSlider.value();
    let voxelSize = voxelSizeSlider.value() * 5;
    let colorMode = colorModeSelect.value();
    let showNormals = showNormalsCheckbox.checked();
    let showBBox = showBoundingBoxCheckbox.checked();

    // Downsample if needed
    downsample(voxelSize);

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
    text('Point Cloud Visualizer', canvasWidth/2, 8);

    // Stats
    textSize(12);
    textAlign(LEFT, TOP);
    text('Points: ' + points.length + ' / ' + originalPoints.length, 10, 35);
    text('Bounding Box:', 10, 55);
    let bw = (maxBound.x - minBound.x).toFixed(0);
    let bh = (maxBound.y - minBound.y).toFixed(0);
    let bd = (maxBound.z - minBound.z).toFixed(0);
    text('  ' + bw + ' × ' + bh + ' × ' + bd, 10, 70);

    pop();

    // 3D visualization
    push();
    translate(0, 50, 0);
    rotateX(viewRotX);
    rotateY(viewRotY);
    scale(viewScale);

    // Draw bounding box
    if (showBBox) {
        drawBoundingBox();
    }

    // Draw points
    strokeWeight(pointSize);
    beginShape(POINTS);
    for (let p of points) {
        let col = getPointColor(p, colorMode);
        stroke(col.r, col.g, col.b);
        vertex(p.x, -p.y, p.z);
    }
    endShape();

    // Draw normals
    if (showNormals) {
        drawNormals();
    }

    pop();
}

function getPointColor(p, mode) {
    switch(mode) {
        case 'Height':
            let t = map(p.y, minBound.y, maxBound.y, 0, 1);
            return {
                r: lerp(50, 255, t),
                g: lerp(100, 100, t),
                b: lerp(200, 50, t)
            };
        case 'Intensity':
            let i = p.intensity * 255;
            return { r: i, g: i, b: i };
        case 'Normal':
            return {
                r: (p.nx + 1) * 127,
                g: (p.ny + 1) * 127,
                b: (p.nz + 1) * 127
            };
        case 'RGB':
            return { r: p.r, g: p.g, b: p.b };
    }
    return { r: 200, g: 200, b: 200 };
}

function drawBoundingBox() {
    stroke(150);
    strokeWeight(1);
    noFill();

    let x1 = minBound.x, x2 = maxBound.x;
    let y1 = -maxBound.y, y2 = -minBound.y;  // Flip Y
    let z1 = minBound.z, z2 = maxBound.z;

    // Bottom face
    line(x1, y2, z1, x2, y2, z1);
    line(x2, y2, z1, x2, y2, z2);
    line(x2, y2, z2, x1, y2, z2);
    line(x1, y2, z2, x1, y2, z1);

    // Top face
    line(x1, y1, z1, x2, y1, z1);
    line(x2, y1, z1, x2, y1, z2);
    line(x2, y1, z2, x1, y1, z2);
    line(x1, y1, z2, x1, y1, z1);

    // Vertical edges
    line(x1, y1, z1, x1, y2, z1);
    line(x2, y1, z1, x2, y2, z1);
    line(x2, y1, z2, x2, y2, z2);
    line(x1, y1, z2, x1, y2, z2);
}

function drawNormals() {
    let normalLen = 15;
    let skip = max(1, floor(points.length / 200));

    stroke(100, 200, 100);
    strokeWeight(1);

    for (let i = 0; i < points.length; i += skip) {
        let p = points[i];
        line(p.x, -p.y, p.z,
             p.x + p.nx * normalLen,
             -p.y - p.ny * normalLen,
             p.z + p.nz * normalLen);
    }
}

function mouseDragged() {
    if (mouseY < drawHeight) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        viewRotY += dx * 0.01;
        viewRotX += dy * 0.01;
        viewRotX = constrain(viewRotX, -PI/2, PI/2);
    }
}

function mouseWheel(event) {
    if (mouseY < drawHeight) {
        viewScale *= event.delta > 0 ? 0.95 : 1.05;
        viewScale = constrain(viewScale, 0.3, 3);
        return false;
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
