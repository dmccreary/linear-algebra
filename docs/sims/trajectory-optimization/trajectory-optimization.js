// Trajectory Optimization Visualizer
// Demonstrates trajectory optimization with constraints
// Learning objective: Understand trajectory optimization with smoothness and obstacle constraints (Bloom: Apply)

let canvasWidth = 900;
let drawHeight = 600;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Trajectory
let waypoints = [];
let optimizedPath = [];
let velocities = [];
let accelerations = [];

// Obstacles
let obstacles = [];

// Optimization parameters
let smoothnessWeight = 1.0;
let speedLimit = 5.0;
let obstacleClearance = 30;

// UI state
let selectedWaypoint = -1;
let isDragging = false;

// UI controls
let smoothnessSlider;
let speedSlider;
let clearanceSlider;
let optimizeButton;
let resetButton;
let showProfilesCheckbox;

// Optimization state
let costHistory = [];
let isOptimizing = false;
let optimizationStep = 0;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    createDefaultScenario();
    createControls();

    describe('Trajectory optimization visualization with smoothness and obstacle constraints', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Sliders
    smoothnessSlider = createSlider(0.1, 3, 1, 0.1);
    smoothnessSlider.parent(container);
    smoothnessSlider.position(120, drawHeight + 8);
    smoothnessSlider.size(120);
    smoothnessSlider.input(() => smoothnessWeight = smoothnessSlider.value());

    speedSlider = createSlider(1, 10, 5, 0.5);
    speedSlider.parent(container);
    speedSlider.position(360, drawHeight + 8);
    speedSlider.size(120);
    speedSlider.input(() => speedLimit = speedSlider.value());

    clearanceSlider = createSlider(10, 60, 30, 5);
    clearanceSlider.parent(container);
    clearanceSlider.position(600, drawHeight + 8);
    clearanceSlider.size(120);
    clearanceSlider.input(() => obstacleClearance = clearanceSlider.value());

    // Row 2: Buttons and checkbox
    optimizeButton = createButton('Optimize');
    optimizeButton.parent(container);
    optimizeButton.position(10, drawHeight + 50);
    optimizeButton.mousePressed(runOptimization);
    optimizeButton.style('font-size', '14px');
    optimizeButton.style('padding', '5px 15px');
    optimizeButton.style('background-color', '#4CAF50');
    optimizeButton.style('color', 'white');

    resetButton = createButton('Reset');
    resetButton.parent(container);
    resetButton.position(100, drawHeight + 50);
    resetButton.mousePressed(resetToInitial);
    resetButton.style('font-size', '14px');
    resetButton.style('padding', '5px 15px');

    showProfilesCheckbox = createCheckbox(' Show Profiles', true);
    showProfilesCheckbox.parent(container);
    showProfilesCheckbox.position(180, drawHeight + 53);
    showProfilesCheckbox.style('font-size', '14px');
}

function createDefaultScenario() {
    // Create obstacles
    obstacles = [
        { x: 250, y: 200, r: 50 },
        { x: 400, y: 350, r: 60 },
        { x: 550, y: 180, r: 45 },
        { x: 650, y: 400, r: 55 }
    ];

    // Create initial waypoints
    waypoints = [
        { x: 80, y: 300 },
        { x: 200, y: 350 },
        { x: 350, y: 250 },
        { x: 480, y: 280 },
        { x: 600, y: 350 },
        { x: 750, y: 300 }
    ];

    // Initialize optimized path as straight-line interpolation
    resetToInitial();
}

function resetToInitial() {
    optimizedPath = [];
    velocities = [];
    accelerations = [];
    costHistory = [];
    isOptimizing = false;

    // Create dense path from waypoints
    let numPoints = 50;
    for (let i = 0; i < numPoints; i++) {
        let t = i / (numPoints - 1);
        let pt = interpolateWaypoints(t);
        optimizedPath.push({ x: pt.x, y: pt.y });
    }

    computeVelocitiesAndAccelerations();
}

function interpolateWaypoints(t) {
    // Catmull-Rom spline interpolation
    let totalLen = waypoints.length - 1;
    let segment = floor(t * totalLen);
    segment = constrain(segment, 0, waypoints.length - 2);
    let localT = (t * totalLen) - segment;

    let p0 = waypoints[max(0, segment - 1)];
    let p1 = waypoints[segment];
    let p2 = waypoints[min(waypoints.length - 1, segment + 1)];
    let p3 = waypoints[min(waypoints.length - 1, segment + 2)];

    return catmullRom(p0, p1, p2, p3, localT);
}

function catmullRom(p0, p1, p2, p3, t) {
    let t2 = t * t;
    let t3 = t2 * t;

    let x = 0.5 * ((2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

    let y = 0.5 * ((2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

    return { x, y };
}

function computeVelocitiesAndAccelerations() {
    velocities = [];
    accelerations = [];

    for (let i = 0; i < optimizedPath.length; i++) {
        let vel = { x: 0, y: 0 };
        if (i > 0 && i < optimizedPath.length - 1) {
            vel.x = (optimizedPath[i + 1].x - optimizedPath[i - 1].x) / 2;
            vel.y = (optimizedPath[i + 1].y - optimizedPath[i - 1].y) / 2;
        } else if (i === 0 && optimizedPath.length > 1) {
            vel.x = optimizedPath[1].x - optimizedPath[0].x;
            vel.y = optimizedPath[1].y - optimizedPath[0].y;
        } else if (i === optimizedPath.length - 1 && optimizedPath.length > 1) {
            vel.x = optimizedPath[i].x - optimizedPath[i - 1].x;
            vel.y = optimizedPath[i].y - optimizedPath[i - 1].y;
        }
        velocities.push(sqrt(vel.x * vel.x + vel.y * vel.y));
    }

    for (let i = 0; i < velocities.length; i++) {
        let acc = 0;
        if (i > 0 && i < velocities.length - 1) {
            acc = velocities[i + 1] - velocities[i - 1];
        }
        accelerations.push(abs(acc));
    }
}

function runOptimization() {
    // Gradient descent optimization
    let iterations = 100;
    let learningRate = 0.5;
    costHistory = [];

    for (let iter = 0; iter < iterations; iter++) {
        let cost = computeCost();
        costHistory.push(cost);

        // Compute gradient and update interior points
        for (let i = 1; i < optimizedPath.length - 1; i++) {
            let grad = computeGradient(i);
            optimizedPath[i].x -= learningRate * grad.x;
            optimizedPath[i].y -= learningRate * grad.y;

            // Keep within bounds
            optimizedPath[i].x = constrain(optimizedPath[i].x, margin, canvasWidth - margin);
            optimizedPath[i].y = constrain(optimizedPath[i].y, margin, drawHeight - margin);
        }

        // Reduce learning rate
        learningRate *= 0.99;
    }

    computeVelocitiesAndAccelerations();
}

function computeCost() {
    let smoothCost = 0;
    let obstacleCost = 0;
    let velocityCost = 0;

    // Smoothness cost (curvature penalty)
    for (let i = 1; i < optimizedPath.length - 1; i++) {
        let prev = optimizedPath[i - 1];
        let curr = optimizedPath[i];
        let next = optimizedPath[i + 1];

        // Second derivative approximation
        let ddx = next.x - 2 * curr.x + prev.x;
        let ddy = next.y - 2 * curr.y + prev.y;
        smoothCost += smoothnessWeight * (ddx * ddx + ddy * ddy);
    }

    // Obstacle cost
    for (let i = 0; i < optimizedPath.length; i++) {
        let pt = optimizedPath[i];
        for (let obs of obstacles) {
            let d = dist(pt.x, pt.y, obs.x, obs.y);
            let minDist = obs.r + obstacleClearance;
            if (d < minDist) {
                obstacleCost += 100 * pow(minDist - d, 2);
            }
        }
    }

    // Velocity cost
    for (let i = 0; i < velocities.length; i++) {
        if (velocities[i] > speedLimit) {
            velocityCost += 10 * pow(velocities[i] - speedLimit, 2);
        }
    }

    return smoothCost + obstacleCost + velocityCost;
}

function computeGradient(idx) {
    let grad = { x: 0, y: 0 };
    let epsilon = 1;

    // Numerical gradient
    let originalX = optimizedPath[idx].x;
    let originalY = optimizedPath[idx].y;

    optimizedPath[idx].x = originalX + epsilon;
    computeVelocitiesAndAccelerations();
    let costXPlus = computeCost();

    optimizedPath[idx].x = originalX - epsilon;
    computeVelocitiesAndAccelerations();
    let costXMinus = computeCost();

    grad.x = (costXPlus - costXMinus) / (2 * epsilon);

    optimizedPath[idx].x = originalX;
    optimizedPath[idx].y = originalY + epsilon;
    computeVelocitiesAndAccelerations();
    let costYPlus = computeCost();

    optimizedPath[idx].y = originalY - epsilon;
    computeVelocitiesAndAccelerations();
    let costYMinus = computeCost();

    grad.y = (costYPlus - costYMinus) / (2 * epsilon);

    // Restore
    optimizedPath[idx].x = originalX;
    optimizedPath[idx].y = originalY;
    computeVelocitiesAndAccelerations();

    return grad;
}

function draw() {
    updateCanvasSize();

    // Main drawing area
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
    text('Trajectory Optimization Visualizer', canvasWidth / 2, 10);

    // Draw elements
    drawObstacleClearance();
    drawObstacles();
    drawTrajectory();
    drawWaypoints();

    if (showProfilesCheckbox.checked()) {
        drawProfiles();
    }

    drawCostPlot();
    drawLabels();
}

function drawObstacleClearance() {
    noFill();
    stroke(255, 200, 200, 100);
    strokeWeight(2);

    for (let obs of obstacles) {
        ellipse(obs.x, obs.y, (obs.r + obstacleClearance) * 2);
    }
}

function drawObstacles() {
    for (let obs of obstacles) {
        fill(100);
        noStroke();
        ellipse(obs.x, obs.y, obs.r * 2);
    }
}

function drawTrajectory() {
    // Draw optimized path
    if (optimizedPath.length > 1) {
        // Color by velocity
        for (let i = 0; i < optimizedPath.length - 1; i++) {
            let vel = velocities[i];
            let normalizedVel = constrain(vel / (speedLimit * 1.5), 0, 1);

            // Green (slow) to red (fast)
            let r = map(normalizedVel, 0, 1, 50, 255);
            let g = map(normalizedVel, 0, 1, 200, 50);
            stroke(r, g, 50);
            strokeWeight(4);

            line(optimizedPath[i].x, optimizedPath[i].y,
                optimizedPath[i + 1].x, optimizedPath[i + 1].y);
        }
    }
}

function drawWaypoints() {
    // Draw waypoint connections
    stroke(150);
    strokeWeight(1);
    for (let i = 0; i < waypoints.length - 1; i++) {
        drawingContext.setLineDash([5, 5]);
        line(waypoints[i].x, waypoints[i].y, waypoints[i + 1].x, waypoints[i + 1].y);
    }
    drawingContext.setLineDash([]);

    // Draw waypoints
    for (let i = 0; i < waypoints.length; i++) {
        let wp = waypoints[i];
        let isSelected = i === selectedWaypoint;

        fill(isSelected ? color(255, 200, 0) : color(50, 150, 255));
        stroke(255);
        strokeWeight(2);
        ellipse(wp.x, wp.y, isSelected ? 20 : 16);

        fill(255);
        noStroke();
        textSize(10);
        textAlign(CENTER, CENTER);
        text(i + 1, wp.x, wp.y);
    }
}

function drawProfiles() {
    // Draw velocity and acceleration profiles at bottom
    let profileY = drawHeight - 100;
    let profileH = 80;
    let profileW = 200;

    // Velocity profile
    let velX = 20;
    fill(255, 255, 255, 200);
    stroke(150);
    strokeWeight(1);
    rect(velX, profileY, profileW, profileH, 5);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Velocity Profile', velX + 5, profileY + 5);

    // Draw velocity curve
    stroke(50, 150, 255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < velocities.length; i++) {
        let x = velX + 10 + (i / velocities.length) * (profileW - 20);
        let y = profileY + profileH - 10 - (velocities[i] / (speedLimit * 2)) * (profileH - 30);
        vertex(x, y);
    }
    endShape();

    // Speed limit line
    stroke(255, 100, 100);
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    let limitY = profileY + profileH - 10 - (speedLimit / (speedLimit * 2)) * (profileH - 30);
    line(velX + 10, limitY, velX + profileW - 10, limitY);
    drawingContext.setLineDash([]);

    // Acceleration profile
    let accX = velX + profileW + 20;
    fill(255, 255, 255, 200);
    stroke(150);
    strokeWeight(1);
    rect(accX, profileY, profileW, profileH, 5);

    fill(0);
    noStroke();
    text('Acceleration Profile', accX + 5, profileY + 5);

    stroke(255, 150, 50);
    strokeWeight(2);
    noFill();
    beginShape();
    let maxAcc = max(accelerations) || 1;
    for (let i = 0; i < accelerations.length; i++) {
        let x = accX + 10 + (i / accelerations.length) * (profileW - 20);
        let y = profileY + profileH - 10 - (accelerations[i] / maxAcc) * (profileH - 30);
        vertex(x, y);
    }
    endShape();
}

function drawCostPlot() {
    if (costHistory.length === 0) return;

    let plotX = canvasWidth - 180;
    let plotY = 50;
    let plotW = 160;
    let plotH = 80;

    fill(255, 255, 255, 230);
    stroke(150);
    strokeWeight(1);
    rect(plotX, plotY, plotW, plotH, 5);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Cost Convergence', plotX + 5, plotY + 5);

    stroke(100, 200, 100);
    strokeWeight(2);
    noFill();
    beginShape();
    let maxCost = max(costHistory);
    let minCost = min(costHistory);
    for (let i = 0; i < costHistory.length; i++) {
        let x = plotX + 10 + (i / costHistory.length) * (plotW - 20);
        let y = plotY + plotH - 10 - ((costHistory[i] - minCost) / (maxCost - minCost + 0.001)) * (plotH - 30);
        vertex(x, y);
    }
    endShape();

    textSize(10);
    textAlign(RIGHT, TOP);
    text('Final: ' + costHistory[costHistory.length - 1].toFixed(1), plotX + plotW - 5, plotY + plotH - 18);
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    text('Smoothness: ' + smoothnessWeight.toFixed(1), 10, drawHeight + 18);
    text('Speed Limit: ' + speedLimit.toFixed(1), 260, drawHeight + 18);
    text('Clearance: ' + obstacleClearance + 'px', 500, drawHeight + 18);

    textSize(11);
    fill(100);
    textAlign(CENTER, CENTER);
    text('Drag waypoints to modify initial path | Green=slow, Red=fast', canvasWidth / 2, drawHeight + 80);
}

function mousePressed() {
    if (mouseY > drawHeight) return;

    // Check if clicking a waypoint
    for (let i = 0; i < waypoints.length; i++) {
        if (dist(mouseX, mouseY, waypoints[i].x, waypoints[i].y) < 15) {
            selectedWaypoint = i;
            isDragging = true;
            return;
        }
    }

    selectedWaypoint = -1;
}

function mouseDragged() {
    if (isDragging && selectedWaypoint >= 0) {
        waypoints[selectedWaypoint].x = constrain(mouseX, margin, canvasWidth - margin);
        waypoints[selectedWaypoint].y = constrain(mouseY, margin, drawHeight - margin);
        resetToInitial();
    }
}

function mouseReleased() {
    isDragging = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    smoothnessSlider.position(120, drawHeight + 8);
    speedSlider.position(360, drawHeight + 8);
    clearanceSlider.position(600, drawHeight + 8);
    optimizeButton.position(10, drawHeight + 50);
    resetButton.position(100, drawHeight + 50);
    showProfilesCheckbox.position(180, drawHeight + 53);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 750);
    }
}
