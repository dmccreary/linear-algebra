// SLAM (Simultaneous Localization and Mapping) Visualizer
// Demonstrates the SLAM problem and loop closure
// Learning objective: Understand SLAM and loop closure (Bloom: Analyze)

let canvasWidth = 900;
let drawHeight = 600;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Robot state
let truePoses = [];  // Ground truth poses
let estPoses = [];   // Estimated poses
let landmarks = [];  // Landmarks {true: {x,y}, est: {x,y}, id}

// Graph structure
let odometryEdges = [];  // Between consecutive poses
let landmarkEdges = [];  // Between poses and landmarks
let loopClosureEdges = [];  // Loop closures

// SLAM state
let currentPoseIdx = 0;
let odometryNoise = 5;  // pixels
let landmarkNoise = 3;
let accumulatedDrift = { x: 0, y: 0, theta: 0 };

// Uncertainty (simplified)
let poseCovariances = [];

// UI controls
let moveButton;
let addLandmarkButton;
let loopClosureButton;
let optimizeButton;
let resetButton;
let showCovCheckbox;
let odometrySlider;

// Visualization
let loopClosureHighlight = null;
let optimized = false;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    resetSLAM();
    createControls();

    describe('SLAM visualization showing robot trajectory, landmarks, and loop closure', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Main action buttons
    moveButton = createButton('Move Robot');
    moveButton.parent(container);
    moveButton.position(10, drawHeight + 8);
    moveButton.mousePressed(moveRobot);
    moveButton.style('font-size', '14px');
    moveButton.style('padding', '5px 12px');

    addLandmarkButton = createButton('Observe Landmark');
    addLandmarkButton.parent(container);
    addLandmarkButton.position(115, drawHeight + 8);
    addLandmarkButton.mousePressed(observeLandmark);
    addLandmarkButton.style('font-size', '14px');
    addLandmarkButton.style('padding', '5px 12px');

    loopClosureButton = createButton('Loop Closure');
    loopClosureButton.parent(container);
    loopClosureButton.position(260, drawHeight + 8);
    loopClosureButton.mousePressed(detectLoopClosure);
    loopClosureButton.style('font-size', '14px');
    loopClosureButton.style('padding', '5px 12px');

    optimizeButton = createButton('Optimize');
    optimizeButton.parent(container);
    optimizeButton.position(375, drawHeight + 8);
    optimizeButton.mousePressed(optimizeGraph);
    optimizeButton.style('font-size', '14px');
    optimizeButton.style('padding', '5px 12px');
    optimizeButton.style('background-color', '#4CAF50');
    optimizeButton.style('color', 'white');

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(460, drawHeight + 8);
    resetButton.mousePressed(resetSLAM);
    resetButton.style('font-size', '14px');
    resetButton.style('padding', '5px 12px');

    // Row 2: Options
    showCovCheckbox = createCheckbox(' Show Uncertainty', true);
    showCovCheckbox.parent(container);
    showCovCheckbox.position(10, drawHeight + 50);
    showCovCheckbox.style('font-size', '14px');

    // Odometry noise slider
    odometrySlider = createSlider(1, 15, 5, 0.5);
    odometrySlider.parent(container);
    odometrySlider.position(330, drawHeight + 50);
    odometrySlider.size(150);
    odometrySlider.input(() => odometryNoise = odometrySlider.value());
}

function resetSLAM() {
    // Initial pose at center
    let startX = canvasWidth / 2;
    let startY = drawHeight / 2;

    truePoses = [{ x: startX, y: startY, theta: 0 }];
    estPoses = [{ x: startX, y: startY, theta: 0 }];
    poseCovariances = [{ xx: 1, yy: 1, xy: 0 }];

    landmarks = [];
    odometryEdges = [];
    landmarkEdges = [];
    loopClosureEdges = [];

    currentPoseIdx = 0;
    accumulatedDrift = { x: 0, y: 0, theta: 0 };
    loopClosureHighlight = null;
    optimized = false;
}

function moveRobot() {
    // Generate a random motion (circular-ish path)
    let lastTrue = truePoses[truePoses.length - 1];
    let lastEst = estPoses[estPoses.length - 1];

    // True motion (circular path around the environment)
    let angle = (truePoses.length - 1) * 0.4;
    let radius = 150 + sin(angle * 0.5) * 50;
    let dx = cos(angle) * 40;
    let dy = sin(angle) * 40;

    // Keep within bounds
    let newTrueX = constrain(lastTrue.x + dx, 100, canvasWidth - 100);
    let newTrueY = constrain(lastTrue.y + dy, 100, drawHeight - 100);
    let newTheta = atan2(dy, dx);

    truePoses.push({ x: newTrueX, y: newTrueY, theta: newTheta });

    // Estimated motion with noise (accumulates drift)
    let noiseDx = dx + randomGaussian(0, odometryNoise);
    let noiseDy = dy + randomGaussian(0, odometryNoise);
    let noiseTheta = newTheta + randomGaussian(0, 0.1);

    accumulatedDrift.x += randomGaussian(0, odometryNoise * 0.1);
    accumulatedDrift.y += randomGaussian(0, odometryNoise * 0.1);

    let newEstX = lastEst.x + noiseDx + accumulatedDrift.x * 0.1;
    let newEstY = lastEst.y + noiseDy + accumulatedDrift.y * 0.1;

    estPoses.push({ x: newEstX, y: newEstY, theta: noiseTheta });

    // Covariance grows with distance traveled
    let lastCov = poseCovariances[poseCovariances.length - 1];
    poseCovariances.push({
        xx: lastCov.xx + odometryNoise * 0.5,
        yy: lastCov.yy + odometryNoise * 0.5,
        xy: lastCov.xy + odometryNoise * 0.1
    });

    // Add odometry edge
    odometryEdges.push({
        from: estPoses.length - 2,
        to: estPoses.length - 1
    });

    currentPoseIdx = estPoses.length - 1;
    optimized = false;
}

function observeLandmark() {
    if (estPoses.length < 1) return;

    // Create or observe a landmark near the current position
    let currentTrue = truePoses[currentPoseIdx];
    let currentEst = estPoses[currentPoseIdx];

    // Random offset for landmark position
    let angle = random(TWO_PI);
    let dist = random(30, 80);

    // Check if we're near an existing landmark
    let existingLandmark = null;
    for (let lm of landmarks) {
        let d = dist(currentTrue.x, currentTrue.y, lm.true.x, lm.true.y);
        if (d < 100) {
            existingLandmark = lm;
            break;
        }
    }

    if (existingLandmark) {
        // Re-observe existing landmark
        let measurement = {
            x: existingLandmark.true.x - currentTrue.x + randomGaussian(0, landmarkNoise),
            y: existingLandmark.true.y - currentTrue.y + randomGaussian(0, landmarkNoise)
        };

        landmarkEdges.push({
            poseIdx: currentPoseIdx,
            landmarkId: existingLandmark.id,
            measurement: measurement
        });
    } else {
        // Create new landmark
        let trueLmX = currentTrue.x + cos(angle) * dist;
        let trueLmY = currentTrue.y + sin(angle) * dist;

        // Estimated landmark position (from noisy observation + noisy pose)
        let estLmX = currentEst.x + cos(angle) * dist + randomGaussian(0, landmarkNoise);
        let estLmY = currentEst.y + sin(angle) * dist + randomGaussian(0, landmarkNoise);

        let newLandmark = {
            id: landmarks.length,
            true: { x: trueLmX, y: trueLmY },
            est: { x: estLmX, y: estLmY },
            cov: { xx: 10, yy: 10, xy: 0 }
        };

        landmarks.push(newLandmark);

        landmarkEdges.push({
            poseIdx: currentPoseIdx,
            landmarkId: newLandmark.id,
            measurement: { x: cos(angle) * dist, y: sin(angle) * dist }
        });
    }

    optimized = false;
}

function detectLoopClosure() {
    if (estPoses.length < 5) return;

    // Find if current position is close to a previous position
    let currentTrue = truePoses[currentPoseIdx];
    let closestIdx = -1;
    let closestDist = Infinity;

    for (let i = 0; i < truePoses.length - 3; i++) {
        let d = dist(currentTrue.x, currentTrue.y, truePoses[i].x, truePoses[i].y);
        if (d < closestDist && d < 80) {
            closestDist = d;
            closestIdx = i;
        }
    }

    if (closestIdx >= 0) {
        // Add loop closure constraint
        let trueDiff = {
            x: truePoses[closestIdx].x - currentTrue.x,
            y: truePoses[closestIdx].y - currentTrue.y
        };

        // Noisy measurement
        let measurement = {
            x: trueDiff.x + randomGaussian(0, 2),
            y: trueDiff.y + randomGaussian(0, 2)
        };

        loopClosureEdges.push({
            from: currentPoseIdx,
            to: closestIdx,
            measurement: measurement
        });

        loopClosureHighlight = { from: currentPoseIdx, to: closestIdx };
        optimized = false;
    }
}

function optimizeGraph() {
    if (loopClosureEdges.length === 0) return;

    // Simple optimization: shift all poses after loop closure
    // to reduce the gap (simplified bundle adjustment)

    for (let lc of loopClosureEdges) {
        let fromPose = estPoses[lc.from];
        let toPose = estPoses[lc.to];

        // Error: current estimate vs measurement
        let estDiff = {
            x: toPose.x - fromPose.x,
            y: toPose.y - fromPose.y
        };

        let error = {
            x: lc.measurement.x - estDiff.x,
            y: lc.measurement.y - estDiff.y
        };

        // Distribute correction across poses between loop closure points
        let numPoses = lc.from - lc.to + 1;

        for (let i = lc.to; i <= lc.from; i++) {
            let t = (i - lc.to) / numPoses;
            estPoses[i].x += error.x * t * 0.8;
            estPoses[i].y += error.y * t * 0.8;

            // Reduce uncertainty
            poseCovariances[i].xx *= 0.3;
            poseCovariances[i].yy *= 0.3;
        }

        // Also adjust landmarks observed by corrected poses
        for (let edge of landmarkEdges) {
            if (edge.poseIdx >= lc.to && edge.poseIdx <= lc.from) {
                let lm = landmarks[edge.landmarkId];
                let pose = estPoses[edge.poseIdx];
                lm.est.x = pose.x + edge.measurement.x;
                lm.est.y = pose.y + edge.measurement.y;
                lm.cov.xx *= 0.5;
                lm.cov.yy *= 0.5;
            }
        }
    }

    optimized = true;
}

function draw() {
    updateCanvasSize();

    // Drawing area
    fill(240);
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
    fill('black');
    noStroke();
    textSize(20);
    textAlign(CENTER, TOP);
    text('SLAM Visualizer', canvasWidth / 2, 10);

    // Draw SLAM elements
    drawGraph();
    drawLandmarks();
    drawTrajectory();
    drawCurrentPose();
    drawLegend();
    drawLabels();
}

function drawGraph() {
    // Draw odometry edges
    stroke(150);
    strokeWeight(1);
    for (let edge of odometryEdges) {
        let from = estPoses[edge.from];
        let to = estPoses[edge.to];
        line(from.x, from.y, to.x, to.y);
    }

    // Draw landmark observation edges
    stroke(100, 200, 100, 100);
    for (let edge of landmarkEdges) {
        let pose = estPoses[edge.poseIdx];
        let lm = landmarks[edge.landmarkId];
        if (lm) {
            line(pose.x, pose.y, lm.est.x, lm.est.y);
        }
    }

    // Draw loop closure edges
    strokeWeight(3);
    for (let edge of loopClosureEdges) {
        let from = estPoses[edge.from];
        let to = estPoses[edge.to];

        // Highlight if this is the most recent
        if (loopClosureHighlight &&
            edge.from === loopClosureHighlight.from &&
            edge.to === loopClosureHighlight.to) {
            stroke(255, 100, 100);
            strokeWeight(4);
        } else {
            stroke(255, 150, 50);
            strokeWeight(2);
        }

        // Draw curved arc for loop closure
        noFill();
        let midX = (from.x + to.x) / 2;
        let midY = (from.y + to.y) / 2;
        let offset = 30;
        let perpX = -(to.y - from.y) / dist(from.x, from.y, to.x, to.y) * offset;
        let perpY = (to.x - from.x) / dist(from.x, from.y, to.x, to.y) * offset;

        bezier(from.x, from.y, midX + perpX, midY + perpY, midX + perpX, midY + perpY, to.x, to.y);
    }
}

function drawLandmarks() {
    for (let lm of landmarks) {
        // True landmark (small, faint)
        fill(100, 100, 255, 100);
        noStroke();
        triangle(
            lm.true.x, lm.true.y - 8,
            lm.true.x - 6, lm.true.y + 6,
            lm.true.x + 6, lm.true.y + 6
        );

        // Estimated landmark
        fill(100, 100, 255);
        triangle(
            lm.est.x, lm.est.y - 10,
            lm.est.x - 8, lm.est.y + 8,
            lm.est.x + 8, lm.est.y + 8
        );

        // Uncertainty ellipse
        if (showCovCheckbox.checked()) {
            noFill();
            stroke(100, 100, 255, 100);
            strokeWeight(1);
            ellipse(lm.est.x, lm.est.y, sqrt(lm.cov.xx) * 4, sqrt(lm.cov.yy) * 4);
        }
    }
}

function drawTrajectory() {
    // True trajectory (faint)
    noFill();
    stroke(0, 150, 0, 80);
    strokeWeight(2);
    beginShape();
    for (let p of truePoses) {
        vertex(p.x, p.y);
    }
    endShape();

    // Estimated trajectory
    stroke(0, 150, 0);
    strokeWeight(2);
    beginShape();
    for (let p of estPoses) {
        vertex(p.x, p.y);
    }
    endShape();

    // Draw pose markers with uncertainty
    for (let i = 0; i < estPoses.length; i++) {
        let p = estPoses[i];
        let cov = poseCovariances[i];

        // Uncertainty ellipse
        if (showCovCheckbox.checked()) {
            noFill();
            stroke(0, 200, 0, 80);
            strokeWeight(1);
            ellipse(p.x, p.y, sqrt(cov.xx) * 3, sqrt(cov.yy) * 3);
        }

        // Pose marker
        fill(i === currentPoseIdx ? color(255, 200, 0) : color(0, 200, 0));
        noStroke();
        ellipse(p.x, p.y, i === currentPoseIdx ? 12 : 8);
    }
}

function drawCurrentPose() {
    if (estPoses.length > 0) {
        let p = estPoses[currentPoseIdx];

        // Direction indicator
        stroke(255, 200, 0);
        strokeWeight(2);
        let headingLen = 20;
        line(p.x, p.y, p.x + cos(p.theta) * headingLen, p.y + sin(p.theta) * headingLen);
    }
}

function drawLegend() {
    let legendX = 15;
    let legendY = 45;

    fill(255, 255, 255, 230);
    stroke(100);
    strokeWeight(1);
    rect(legendX - 5, legendY - 5, 145, 100, 5);

    textSize(11);
    textAlign(LEFT, CENTER);
    noStroke();

    fill(0, 200, 0);
    ellipse(legendX + 8, legendY + 10, 8, 8);
    fill(0);
    text('Estimated Pose', legendX + 18, legendY + 10);

    fill(0, 150, 0, 80);
    ellipse(legendX + 8, legendY + 28, 8, 8);
    fill(0);
    text('True Pose (faint)', legendX + 18, legendY + 28);

    fill(100, 100, 255);
    triangle(legendX + 8, legendY + 40, legendX + 4, legendY + 52, legendX + 12, legendY + 52);
    fill(0);
    text('Landmark', legendX + 18, legendY + 48);

    stroke(255, 100, 100);
    strokeWeight(2);
    line(legendX, legendY + 68, legendX + 16, legendY + 68);
    noStroke();
    fill(0);
    text('Loop Closure', legendX + 18, legendY + 68);

    fill(255, 200, 0);
    ellipse(legendX + 8, legendY + 86, 10, 10);
    fill(0);
    text('Current Pose', legendX + 18, legendY + 86);
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    text('Odometry Noise: ' + odometryNoise.toFixed(1), 180, drawHeight + 60);

    // Stats
    textSize(12);
    textAlign(RIGHT, CENTER);
    text('Poses: ' + estPoses.length + ' | Landmarks: ' + landmarks.length +
        ' | Loop Closures: ' + loopClosureEdges.length, canvasWidth - 20, drawHeight + 60);

    if (optimized) {
        fill(0, 150, 0);
        textAlign(CENTER, CENTER);
        text('Graph Optimized!', canvasWidth / 2, drawHeight + 80);
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    moveButton.position(10, drawHeight + 8);
    addLandmarkButton.position(115, drawHeight + 8);
    loopClosureButton.position(260, drawHeight + 8);
    optimizeButton.position(375, drawHeight + 8);
    resetButton.position(460, drawHeight + 8);
    showCovCheckbox.position(10, drawHeight + 50);
    odometrySlider.position(330, drawHeight + 50);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 700);
    }
}
