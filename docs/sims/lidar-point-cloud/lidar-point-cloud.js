// LIDAR Point Cloud Visualizer
// Demonstrates LIDAR data structure with 3D point cloud rendering
// Learning objective: Understand LIDAR data structure and basic processing (Bloom: Understand)

let canvasWidth = 850;
let drawHeight = 550;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// 3D view controls
let rotX = -0.3;  // Tilt down to see ground plane
let rotY = 0;
let zoom = 1.0;
let isDragging = false;
let lastMouseX, lastMouseY;

// Point cloud data
let points = [];
let clusters = [];
let groundPoints = [];
let objectPoints = [];
const NUM_POINTS = 5000;
const MAX_RANGE = 50; // 50 meters

// UI controls
let pointSizeSlider;
let intensityThresholdSlider;
let showGroundCheckbox;
let showClustersCheckbox;
let colorModeSelect;
let animateCheckbox;

// Animation
let frameIdx = 0;
let animationSpeed = 0.02;
let isAnimating = true;

// Font for WEBGL text
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent(document.querySelector('main'));
    textFont(font);

    // Generate initial point cloud
    generatePointCloud();

    // Create controls
    createControls();

    describe('Interactive LIDAR point cloud visualizer showing 3D point data with ground segmentation and clustering', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Point Size and Intensity Threshold sliders
    pointSizeSlider = createSlider(1, 8, 3, 0.5);
    pointSizeSlider.parent(container);
    pointSizeSlider.position(sliderLeftMargin, drawHeight + 8);
    pointSizeSlider.size(180);

    intensityThresholdSlider = createSlider(0, 255, 0, 5);
    intensityThresholdSlider.parent(container);
    intensityThresholdSlider.position(500, drawHeight + 8);
    intensityThresholdSlider.size(180);

    // Row 2: Checkboxes and dropdown
    showGroundCheckbox = createCheckbox(' Show Ground', true);
    showGroundCheckbox.parent(container);
    showGroundCheckbox.position(10, drawHeight + 40);
    showGroundCheckbox.style('font-size', '14px');

    showClustersCheckbox = createCheckbox(' Show Clusters', true);
    showClustersCheckbox.parent(container);
    showClustersCheckbox.position(140, drawHeight + 40);
    showClustersCheckbox.style('font-size', '14px');

    animateCheckbox = createCheckbox(' Animate', true);
    animateCheckbox.parent(container);
    animateCheckbox.position(280, drawHeight + 40);
    animateCheckbox.style('font-size', '14px');
    animateCheckbox.changed(() => isAnimating = animateCheckbox.checked());

    // Color mode dropdown
    colorModeSelect = createSelect();
    colorModeSelect.parent(container);
    colorModeSelect.position(500, drawHeight + 40);
    colorModeSelect.option('Intensity');
    colorModeSelect.option('Height');
    colorModeSelect.option('Distance');
    colorModeSelect.option('Cluster');
    colorModeSelect.selected('Intensity');
    colorModeSelect.style('font-size', '14px');
    colorModeSelect.style('padding', '4px');

    // Row 3: Regenerate button
    let regenButton = createButton('Regenerate');
    regenButton.parent(container);
    regenButton.position(10, drawHeight + 70);
    regenButton.mousePressed(generatePointCloud);
    regenButton.style('font-size', '14px');
    regenButton.style('padding', '4px 12px');
}

function generatePointCloud() {
    points = [];
    clusters = [];
    groundPoints = [];
    objectPoints = [];

    // Generate random point cloud simulating LIDAR scan
    // Ground points (low z values, spread across x-y)
    for (let i = 0; i < NUM_POINTS * 0.4; i++) {
        let angle = random(TWO_PI);
        let dist = random(5, MAX_RANGE);
        let x = dist * cos(angle);
        let y = dist * sin(angle);
        let z = random(-0.3, 0.3) + noise(x * 0.05, y * 0.05) * 0.5 - 0.25;
        let intensity = random(50, 150);
        groundPoints.push({ x, y, z, intensity, cluster: -1 });
    }

    // Generate clustered objects (vehicles, pedestrians, etc.)
    let numClusters = floor(random(5, 10));
    for (let c = 0; c < numClusters; c++) {
        let clusterAngle = random(TWO_PI);
        let clusterDist = random(8, 35);
        let clusterX = clusterDist * cos(clusterAngle);
        let clusterY = clusterDist * sin(clusterAngle);
        let clusterWidth = random(1, 4);
        let clusterDepth = random(1, 5);
        let clusterHeight = random(1, 3);
        let pointsInCluster = floor(random(50, 200));

        let clusterPoints = [];
        for (let i = 0; i < pointsInCluster; i++) {
            let x = clusterX + random(-clusterWidth/2, clusterWidth/2);
            let y = clusterY + random(-clusterDepth/2, clusterDepth/2);
            let z = random(0, clusterHeight);
            let intensity = random(100, 255);
            let pt = { x, y, z, intensity, cluster: c };
            clusterPoints.push(pt);
            objectPoints.push(pt);
        }

        clusters.push({
            center: { x: clusterX, y: clusterY },
            width: clusterWidth,
            depth: clusterDepth,
            height: clusterHeight,
            points: clusterPoints,
            color: color(random(100, 255), random(100, 255), random(100, 255))
        });
    }

    // Add some noise/outlier points
    for (let i = 0; i < NUM_POINTS * 0.1; i++) {
        let angle = random(TWO_PI);
        let dist = random(2, MAX_RANGE);
        let x = dist * cos(angle);
        let y = dist * sin(angle);
        let z = random(0, 5);
        let intensity = random(30, 100);
        objectPoints.push({ x, y, z, intensity, cluster: -2 });
    }

    points = [...groundPoints, ...objectPoints];
}

function draw() {
    updateCanvasSize();

    // Background
    background(20);

    // Draw control area background
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(200);
    line(0, drawHeight, canvasWidth, drawHeight);
    pop();

    // Get control values
    let pointSize = pointSizeSlider.value();
    let intensityThreshold = intensityThresholdSlider.value();
    let showGround = showGroundCheckbox.checked();
    let showClusters = showClustersCheckbox.checked();
    let colorMode = colorModeSelect.value();

    // Apply 3D transformations
    translate(0, -50, 0);

    // Apply zoom
    scale(zoom);

    // Apply rotation
    rotateX(rotX);
    rotateY(rotY + (isAnimating ? frameIdx : 0));

    // Scale for visualization (meters to pixels)
    let scaleFactor = 8;

    // Draw distance rings on ground plane
    push();
    stroke(60);
    strokeWeight(1);
    noFill();
    rotateX(HALF_PI);

    // 10m ring
    stroke(80);
    ellipse(0, 0, 10 * scaleFactor * 2, 10 * scaleFactor * 2);
    // 25m ring
    stroke(60);
    ellipse(0, 0, 25 * scaleFactor * 2, 25 * scaleFactor * 2);
    // 50m ring
    stroke(50);
    ellipse(0, 0, 50 * scaleFactor * 2, 50 * scaleFactor * 2);
    pop();

    // Draw coordinate axes
    strokeWeight(2);
    // X axis (red)
    stroke(255, 100, 100);
    line(0, 0, 0, 30, 0, 0);
    // Y axis (green)
    stroke(100, 255, 100);
    line(0, 0, 0, 0, 30, 0);
    // Z axis (blue) - pointing up
    stroke(100, 100, 255);
    line(0, 0, 0, 0, 0, 30);

    // Draw ego vehicle marker at origin
    push();
    fill(255, 200, 0);
    noStroke();
    translate(0, 0, 2);
    box(4, 8, 3);
    pop();

    // Draw points
    strokeWeight(pointSize);

    // Draw ground points
    if (showGround) {
        for (let pt of groundPoints) {
            if (pt.intensity >= intensityThreshold) {
                let c = getPointColor(pt, colorMode, 'ground');
                stroke(c);
                point(pt.x * scaleFactor, pt.y * scaleFactor, pt.z * scaleFactor);
            }
        }
    }

    // Draw object points
    if (showClusters) {
        for (let pt of objectPoints) {
            if (pt.intensity >= intensityThreshold) {
                let c = getPointColor(pt, colorMode, 'object');
                stroke(c);
                point(pt.x * scaleFactor, pt.y * scaleFactor, pt.z * scaleFactor);
            }
        }

        // Draw cluster bounding boxes
        for (let cluster of clusters) {
            push();
            translate(cluster.center.x * scaleFactor, cluster.center.y * scaleFactor, cluster.height * scaleFactor / 2);
            stroke(cluster.color);
            strokeWeight(1);
            noFill();
            box(cluster.width * scaleFactor, cluster.depth * scaleFactor, cluster.height * scaleFactor);
            pop();
        }
    }

    // Update animation
    if (isAnimating) {
        frameIdx += animationSpeed;
    }

    // Draw labels (in screen space)
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Title
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('LIDAR Point Cloud Visualizer', canvasWidth/2, 10);

    // Info text
    textSize(14);
    textAlign(LEFT, TOP);
    fill(200);
    text('Drag to rotate | Scroll to zoom', 10, 40);
    text('Points: ' + points.length + ' | Clusters: ' + clusters.length, 10, 60);

    // Distance ring labels
    textAlign(RIGHT, TOP);
    fill(100);
    text('Rings: 10m, 25m, 50m', canvasWidth - 10, 40);

    // Control labels
    fill(0);
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);
    text('Point Size: ' + pointSize.toFixed(1), 10, drawHeight + 18);
    text('Min Intensity: ' + intensityThreshold, 355, drawHeight + 18);
    text('Color by:', 430, drawHeight + 50);

    pop();
}

function getPointColor(pt, mode, type) {
    let c;
    switch (mode) {
        case 'Intensity':
            let i = map(pt.intensity, 0, 255, 50, 255);
            c = color(i, i, i);
            break;
        case 'Height':
            let h = map(pt.z, -0.5, 3, 0, 1);
            c = color(
                map(h, 0, 1, 0, 255),
                map(h, 0, 0.5, 100, 255) * (1 - h) + map(h, 0.5, 1, 255, 100) * h,
                map(h, 0, 1, 255, 0)
            );
            break;
        case 'Distance':
            let d = sqrt(pt.x * pt.x + pt.y * pt.y);
            let dn = map(d, 0, MAX_RANGE, 0, 1);
            c = color(
                map(dn, 0, 1, 255, 50),
                map(dn, 0, 0.5, 255, 100),
                map(dn, 0, 1, 50, 255)
            );
            break;
        case 'Cluster':
            if (type === 'ground') {
                c = color(100, 80, 60);  // Brown for ground
            } else if (pt.cluster >= 0 && pt.cluster < clusters.length) {
                c = clusters[pt.cluster].color;
            } else {
                c = color(150, 150, 150);  // Gray for noise
            }
            break;
        default:
            c = color(255);
    }
    return c;
}

function mousePressed() {
    // Check if in drawing area
    if (mouseY < drawHeight && mouseY > 0) {
        isDragging = true;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseReleased() {
    isDragging = false;
}

function mouseDragged() {
    if (isDragging) {
        let dx = mouseX - lastMouseX;
        let dy = mouseY - lastMouseY;
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        rotX = constrain(rotX, -HALF_PI, HALF_PI);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseWheel(event) {
    if (mouseY < drawHeight && mouseY > 0) {
        zoom *= 1 - event.delta * 0.001;
        zoom = constrain(zoom, 0.3, 3);
        return false;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    // Reposition controls
    pointSizeSlider.position(sliderLeftMargin, drawHeight + 8);
    intensityThresholdSlider.position(500, drawHeight + 8);
    showGroundCheckbox.position(10, drawHeight + 40);
    showClustersCheckbox.position(140, drawHeight + 40);
    animateCheckbox.position(280, drawHeight + 40);
    colorModeSelect.position(500, drawHeight + 40);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 700);  // Minimum width for controls
    }
}
