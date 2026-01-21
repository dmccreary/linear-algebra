// Object Tracking Visualizer
// Demonstrates multi-object tracking with prediction and association
// Learning objective: Understand multi-object tracking (Bloom: Apply)

let canvasWidth = 800;
let drawHeight = 550;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Track state
class Track {
    constructor(id, x, y, vx, vy, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.predX = x;
        this.predY = y;
        this.width = random(30, 50);
        this.height = random(20, 35);
        this.color = color;
        this.history = [];
        this.missCount = 0;
        this.age = 0;
    }

    predict() {
        this.predX = this.x + this.vx;
        this.predY = this.y + this.vy;
    }

    update(detection) {
        // Kalman-like update (simplified)
        let alpha = 0.7;  // Measurement weight
        this.x = this.predX * (1 - alpha) + detection.x * alpha;
        this.y = this.predY * (1 - alpha) + detection.y * alpha;

        // Update velocity estimate
        this.vx = this.vx * 0.8 + (detection.x - this.predX) * 0.2;
        this.vy = this.vy * 0.8 + (detection.y - this.predY) * 0.2;

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 50) this.history.shift();

        this.missCount = 0;
        this.age++;
    }

    updateWithoutDetection() {
        // Use prediction as new position
        this.x = this.predX;
        this.y = this.predY;
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 50) this.history.shift();
        this.missCount++;
        this.age++;
    }

    move() {
        // Actual movement with some randomness
        this.vx += randomGaussian(0, 0.3);
        this.vy += randomGaussian(0, 0.3);
        this.vx = constrain(this.vx, -5, 5);
        this.vy = constrain(this.vy, -5, 5);

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < margin + this.width / 2 || this.x > canvasWidth - margin - this.width / 2) {
            this.vx *= -0.9;
            this.x = constrain(this.x, margin + this.width / 2, canvasWidth - margin - this.width / 2);
        }
        if (this.y < margin + this.height / 2 || this.y > drawHeight - margin - this.height / 2) {
            this.vy *= -0.9;
            this.y = constrain(this.y, margin + this.height / 2, drawHeight - margin - this.height / 2);
        }
    }
}

// Tracking state
let tracks = [];
let detections = [];
let associations = [];
let nextTrackId = 1;

// Parameters
let detectionNoise = 8;
let missProbability = 0.15;

// UI controls
let stepButton;
let runButton;
let resetButton;
let showPredCheckbox;
let showHistoryCheckbox;
let noiseSlider;
let missSlider;

// Simulation state
let isRunning = false;
let frameIdx = 0;

// Colors for tracks
const trackColors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'
];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    resetTracking();
    createControls();

    describe('Multi-object tracking visualization with prediction and association', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Buttons
    stepButton = createButton('Step');
    stepButton.parent(container);
    stepButton.position(10, drawHeight + 8);
    stepButton.mousePressed(doStep);
    stepButton.style('font-size', '14px');
    stepButton.style('padding', '5px 15px');

    runButton = createButton('Run');
    runButton.parent(container);
    runButton.position(80, drawHeight + 8);
    runButton.mousePressed(toggleRun);
    runButton.style('font-size', '14px');
    runButton.style('padding', '5px 15px');

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(140, drawHeight + 8);
    resetButton.mousePressed(resetTracking);
    resetButton.style('font-size', '14px');
    resetButton.style('padding', '5px 15px');

    showPredCheckbox = createCheckbox(' Show Predictions', true);
    showPredCheckbox.parent(container);
    showPredCheckbox.position(220, drawHeight + 11);
    showPredCheckbox.style('font-size', '14px');

    showHistoryCheckbox = createCheckbox(' Show Trails', true);
    showHistoryCheckbox.parent(container);
    showHistoryCheckbox.position(360, drawHeight + 11);
    showHistoryCheckbox.style('font-size', '14px');

    // Row 2: Sliders
    noiseSlider = createSlider(1, 25, 8, 1);
    noiseSlider.parent(container);
    noiseSlider.position(sliderLeftMargin, drawHeight + 50);
    noiseSlider.size(150);
    noiseSlider.input(() => detectionNoise = noiseSlider.value());

    missSlider = createSlider(0, 0.5, 0.15, 0.05);
    missSlider.parent(container);
    missSlider.position(500, drawHeight + 50);
    missSlider.size(150);
    missSlider.input(() => missProbability = missSlider.value());
}

function resetTracking() {
    tracks = [];
    detections = [];
    associations = [];
    nextTrackId = 1;
    isRunning = false;
    if (runButton) runButton.html('Run');
    frameIdx = 0;

    // Create initial objects
    let numObjects = floor(random(4, 7));
    for (let i = 0; i < numObjects; i++) {
        let x = random(100, canvasWidth - 100);
        let y = random(100, drawHeight - 100);
        let vx = random(-3, 3);
        let vy = random(-3, 3);
        let color = trackColors[i % trackColors.length];
        tracks.push(new Track(nextTrackId++, x, y, vx, vy, color));
    }
}

function toggleRun() {
    isRunning = !isRunning;
    runButton.html(isRunning ? 'Pause' : 'Run');
}

function doStep() {
    frameIdx++;

    // 1. Move all objects (ground truth)
    for (let track of tracks) {
        track.move();
    }

    // 2. Predict next positions
    for (let track of tracks) {
        track.predict();
    }

    // 3. Generate noisy detections (some may be missed)
    detections = [];
    for (let track of tracks) {
        if (random() > missProbability) {
            detections.push({
                x: track.x + randomGaussian(0, detectionNoise),
                y: track.y + randomGaussian(0, detectionNoise),
                width: track.width + random(-5, 5),
                height: track.height + random(-5, 5)
            });
        }
    }

    // 4. Associate detections to tracks (Hungarian algorithm simplified)
    associations = [];
    let usedDetections = new Set();

    for (let track of tracks) {
        let bestDet = null;
        let bestDist = Infinity;
        let bestIdx = -1;

        for (let i = 0; i < detections.length; i++) {
            if (usedDetections.has(i)) continue;

            let det = detections[i];
            let d = dist(track.predX, track.predY, det.x, det.y);

            // Gate: only consider detections within a threshold
            if (d < 50 && d < bestDist) {
                bestDist = d;
                bestDet = det;
                bestIdx = i;
            }
        }

        if (bestDet !== null) {
            track.update(bestDet);
            usedDetections.add(bestIdx);
            associations.push({
                track: track,
                detection: bestDet
            });
        } else {
            track.updateWithoutDetection();
        }
    }

    // 5. Create new tracks for unassociated detections
    for (let i = 0; i < detections.length; i++) {
        if (!usedDetections.has(i)) {
            let det = detections[i];
            let color = trackColors[nextTrackId % trackColors.length];
            tracks.push(new Track(nextTrackId++, det.x, det.y, 0, 0, color));
        }
    }

    // 6. Remove lost tracks
    tracks = tracks.filter(t => t.missCount < 5);
}

function draw() {
    updateCanvasSize();

    if (isRunning && frameCount % 8 === 0) {
        doStep();
    }

    // Drawing area
    fill(30);
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke(200);
    line(0, drawHeight, canvasWidth, drawHeight);

    // Title
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('Multi-Object Tracking Visualizer', canvasWidth / 2, 10);

    // Draw elements
    drawTrails();
    drawPredictions();
    drawAssociations();
    drawDetections();
    drawTracks();
    drawLegend();
    drawLabels();
}

function drawTrails() {
    if (!showHistoryCheckbox.checked()) return;

    for (let track of tracks) {
        if (track.history.length < 2) continue;

        noFill();
        stroke(track.color + '80');  // Add transparency
        strokeWeight(2);
        beginShape();
        for (let p of track.history) {
            vertex(p.x, p.y);
        }
        endShape();
    }
}

function drawPredictions() {
    if (!showPredCheckbox.checked()) return;

    for (let track of tracks) {
        // Dashed prediction box
        push();
        stroke(track.color);
        strokeWeight(2);
        drawingContext.setLineDash([5, 5]);
        noFill();
        rectMode(CENTER);
        rect(track.predX, track.predY, track.width, track.height);
        drawingContext.setLineDash([]);
        pop();
    }
}

function drawAssociations() {
    // Draw lines connecting predictions to detections
    for (let assoc of associations) {
        stroke(255, 200, 100, 150);
        strokeWeight(1);
        line(assoc.track.predX, assoc.track.predY, assoc.detection.x, assoc.detection.y);
    }
}

function drawDetections() {
    // Draw raw detections (red boxes)
    for (let det of detections) {
        stroke(255, 100, 100);
        strokeWeight(2);
        fill(255, 100, 100, 30);
        rectMode(CENTER);
        rect(det.x, det.y, det.width, det.height);
    }
}

function drawTracks() {
    for (let track of tracks) {
        // Track box
        stroke(track.color);
        strokeWeight(3);
        fill(track.color + '40');
        rectMode(CENTER);
        rect(track.x, track.y, track.width, track.height);

        // Track ID
        fill(255);
        noStroke();
        textSize(14);
        textAlign(CENTER, CENTER);
        text('ID ' + track.id, track.x, track.y - track.height / 2 - 12);

        // Velocity arrow
        stroke(track.color);
        strokeWeight(2);
        let arrowLen = sqrt(track.vx * track.vx + track.vy * track.vy) * 5;
        let angle = atan2(track.vy, track.vx);
        if (arrowLen > 3) {
            line(track.x, track.y, track.x + cos(angle) * arrowLen, track.y + sin(angle) * arrowLen);
        }
    }
}

function drawLegend() {
    let legendX = 15;
    let legendY = 45;

    fill(255, 255, 255, 230);
    stroke(100);
    strokeWeight(1);
    rect(legendX - 5, legendY - 5, 140, 85, 5);

    textSize(11);
    noStroke();

    // Track box
    fill('#4ECDC4');
    rectMode(CENTER);
    stroke('#4ECDC4');
    strokeWeight(2);
    rect(legendX + 12, legendY + 10, 16, 12);
    noStroke();
    fill(255);
    textAlign(LEFT, CENTER);
    text('Track (estimated)', legendX + 28, legendY + 10);

    // Prediction box
    push();
    stroke('#4ECDC4');
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    noFill();
    rect(legendX + 12, legendY + 32, 16, 12);
    drawingContext.setLineDash([]);
    pop();
    fill(255);
    text('Prediction', legendX + 28, legendY + 32);

    // Detection box
    stroke(255, 100, 100);
    strokeWeight(2);
    fill(255, 100, 100, 30);
    rect(legendX + 12, legendY + 54, 16, 12);
    noStroke();
    fill(255);
    text('Detection (noisy)', legendX + 28, legendY + 54);

    // Association line
    stroke(255, 200, 100);
    strokeWeight(2);
    line(legendX + 4, legendY + 72, legendX + 20, legendY + 72);
    noStroke();
    fill(255);
    text('Association', legendX + 28, legendY + 72);
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    text('Detection Noise: ' + detectionNoise + 'px', 10, drawHeight + 60);
    text('Miss Rate: ' + (missProbability * 100).toFixed(0) + '%', 350, drawHeight + 60);

    // Stats
    textSize(12);
    textAlign(RIGHT, CENTER);
    text('Active Tracks: ' + tracks.length + ' | Frame: ' + frameIdx, canvasWidth - 20, drawHeight + 60);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    stepButton.position(10, drawHeight + 8);
    runButton.position(80, drawHeight + 8);
    resetButton.position(140, drawHeight + 8);
    showPredCheckbox.position(220, drawHeight + 11);
    showHistoryCheckbox.position(360, drawHeight + 11);
    noiseSlider.position(sliderLeftMargin, drawHeight + 50);
    missSlider.position(500, drawHeight + 50);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 700);
    }
}
