// Path Planning Visualizer
// Compare path planning algorithms: A*, RRT, Dijkstra
// Learning objective: Evaluate different path planning algorithms (Bloom: Evaluate)

let canvasWidth = 850;
let drawHeight = 600;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Grid
let gridResolution = 20;  // pixels per cell
let grid = [];
let gridCols, gridRows;

// Planning state
let startPos = { x: 60, y: 300 };
let goalPos = { x: 790, y: 300 };
let path = [];
let exploredCells = [];
let rrtTree = [];

// Obstacles
let obstacles = [];
let isDrawingObstacle = false;
let currentObstacle = null;

// Algorithm selection
let algorithm = 'A*';

// UI controls
let algorithmSelect;
let resolutionSlider;
let planButton;
let clearButton;
let showExplorationCheckbox;
let addObstaclesButton;

// Visualization
let isPlanning = false;
let planningStep = 0;
let animationSpeed = 20;

// Timing
let planningTime = 0;
let pathLength = 0;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    initGrid();
    createDefaultObstacles();
    createControls();

    describe('Path planning visualization comparing A*, RRT, and Dijkstra algorithms', LABEL);
}

function createControls() {
    const container = document.querySelector('main');

    // Row 1: Main controls
    algorithmSelect = createSelect();
    algorithmSelect.parent(container);
    algorithmSelect.position(10, drawHeight + 8);
    algorithmSelect.option('A*');
    algorithmSelect.option('Dijkstra');
    algorithmSelect.option('RRT');
    algorithmSelect.selected('A*');
    algorithmSelect.style('font-size', '14px');
    algorithmSelect.style('padding', '4px');
    algorithmSelect.changed(() => {
        algorithm = algorithmSelect.value();
        resetPlanning();
    });

    planButton = createButton('Plan Path');
    planButton.parent(container);
    planButton.position(100, drawHeight + 8);
    planButton.mousePressed(startPlanning);
    planButton.style('font-size', '14px');
    planButton.style('padding', '5px 15px');
    planButton.style('background-color', '#4CAF50');
    planButton.style('color', 'white');

    clearButton = createButton('Clear All');
    clearButton.parent(container);
    clearButton.position(200, drawHeight + 8);
    clearButton.mousePressed(clearAll);
    clearButton.style('font-size', '14px');
    clearButton.style('padding', '5px 15px');

    showExplorationCheckbox = createCheckbox(' Show Exploration', true);
    showExplorationCheckbox.parent(container);
    showExplorationCheckbox.position(300, drawHeight + 11);
    showExplorationCheckbox.style('font-size', '14px');

    // Row 2
    resolutionSlider = createSlider(10, 40, 20, 5);
    resolutionSlider.parent(container);
    resolutionSlider.position(130, drawHeight + 50);
    resolutionSlider.size(120);
    resolutionSlider.input(() => {
        gridResolution = resolutionSlider.value();
        initGrid();
        resetPlanning();
    });
}

function initGrid() {
    gridCols = floor(canvasWidth / gridResolution);
    gridRows = floor(drawHeight / gridResolution);
    grid = [];

    for (let i = 0; i < gridCols; i++) {
        grid[i] = [];
        for (let j = 0; j < gridRows; j++) {
            grid[i][j] = 0;  // 0 = free, 1 = obstacle
        }
    }

    // Mark obstacle cells
    for (let obs of obstacles) {
        markObstacleCells(obs);
    }
}

function markObstacleCells(obs) {
    let minCol = floor(obs.x / gridResolution);
    let maxCol = floor((obs.x + obs.w) / gridResolution);
    let minRow = floor(obs.y / gridResolution);
    let maxRow = floor((obs.y + obs.h) / gridResolution);

    for (let i = max(0, minCol); i <= min(gridCols - 1, maxCol); i++) {
        for (let j = max(0, minRow); j <= min(gridRows - 1, maxRow); j++) {
            grid[i][j] = 1;
        }
    }
}

function createDefaultObstacles() {
    obstacles = [
        { x: 200, y: 150, w: 60, h: 300 },
        { x: 400, y: 50, w: 60, h: 250 },
        { x: 400, y: 400, w: 60, h: 200 },
        { x: 600, y: 150, w: 60, h: 300 }
    ];

    for (let obs of obstacles) {
        markObstacleCells(obs);
    }
}

function clearAll() {
    obstacles = [];
    initGrid();
    resetPlanning();
}

function resetPlanning() {
    path = [];
    exploredCells = [];
    rrtTree = [];
    isPlanning = false;
    planningStep = 0;
    planningTime = 0;
    pathLength = 0;
}

function startPlanning() {
    resetPlanning();

    let startTime = millis();

    if (algorithm === 'A*') {
        path = astar();
    } else if (algorithm === 'Dijkstra') {
        path = dijkstra();
    } else if (algorithm === 'RRT') {
        path = rrt();
    }

    planningTime = millis() - startTime;

    // Calculate path length
    if (path.length > 1) {
        pathLength = 0;
        for (let i = 1; i < path.length; i++) {
            pathLength += dist(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
        }
    }
}

function astar() {
    let startCell = posToCell(startPos);
    let goalCell = posToCell(goalPos);

    let openSet = [startCell];
    let closedSet = new Set();
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    let key = cellKey(startCell);
    gScore[key] = 0;
    fScore[key] = heuristic(startCell, goalCell);

    while (openSet.length > 0) {
        // Find node with lowest fScore
        let current = openSet.reduce((a, b) =>
            fScore[cellKey(a)] < fScore[cellKey(b)] ? a : b
        );

        // Record exploration
        exploredCells.push({ ...current });

        if (current.col === goalCell.col && current.row === goalCell.row) {
            return reconstructPath(cameFrom, current);
        }

        openSet = openSet.filter(n => !(n.col === current.col && n.row === current.row));
        closedSet.add(cellKey(current));

        // Check neighbors
        let neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            let nKey = cellKey(neighbor);
            if (closedSet.has(nKey)) continue;

            let tentativeG = gScore[cellKey(current)] + dist(
                current.col, current.row, neighbor.col, neighbor.row
            ) * gridResolution;

            if (!gScore[nKey] || tentativeG < gScore[nKey]) {
                cameFrom[nKey] = current;
                gScore[nKey] = tentativeG;
                fScore[nKey] = tentativeG + heuristic(neighbor, goalCell);

                if (!openSet.some(n => n.col === neighbor.col && n.row === neighbor.row)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];  // No path found
}

function dijkstra() {
    let startCell = posToCell(startPos);
    let goalCell = posToCell(goalPos);

    let openSet = [startCell];
    let closedSet = new Set();
    let cameFrom = {};
    let gScore = {};

    gScore[cellKey(startCell)] = 0;

    while (openSet.length > 0) {
        // Find node with lowest gScore (no heuristic)
        let current = openSet.reduce((a, b) =>
            gScore[cellKey(a)] < gScore[cellKey(b)] ? a : b
        );

        exploredCells.push({ ...current });

        if (current.col === goalCell.col && current.row === goalCell.row) {
            return reconstructPath(cameFrom, current);
        }

        openSet = openSet.filter(n => !(n.col === current.col && n.row === current.row));
        closedSet.add(cellKey(current));

        let neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            let nKey = cellKey(neighbor);
            if (closedSet.has(nKey)) continue;

            let tentativeG = gScore[cellKey(current)] + dist(
                current.col, current.row, neighbor.col, neighbor.row
            ) * gridResolution;

            if (!gScore[nKey] || tentativeG < gScore[nKey]) {
                cameFrom[nKey] = current;
                gScore[nKey] = tentativeG;

                if (!openSet.some(n => n.col === neighbor.col && n.row === neighbor.row)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];
}

function rrt() {
    let maxIterations = 2000;
    let stepSize = 30;

    rrtTree = [{ x: startPos.x, y: startPos.y, parent: null }];

    for (let i = 0; i < maxIterations; i++) {
        // Random point (bias toward goal)
        let randPt;
        if (random() < 0.1) {
            randPt = { x: goalPos.x, y: goalPos.y };
        } else {
            randPt = { x: random(margin, canvasWidth - margin), y: random(margin, drawHeight - margin) };
        }

        // Find nearest node
        let nearest = rrtTree.reduce((a, b) =>
            dist(a.x, a.y, randPt.x, randPt.y) < dist(b.x, b.y, randPt.x, randPt.y) ? a : b
        );

        // Steer toward random point
        let angle = atan2(randPt.y - nearest.y, randPt.x - nearest.x);
        let newX = nearest.x + cos(angle) * stepSize;
        let newY = nearest.y + sin(angle) * stepSize;

        // Check collision
        if (!lineCollision(nearest.x, nearest.y, newX, newY)) {
            let newNode = { x: newX, y: newY, parent: nearest };
            rrtTree.push(newNode);
            exploredCells.push({ x: newX, y: newY });

            // Check if reached goal
            if (dist(newX, newY, goalPos.x, goalPos.y) < stepSize) {
                // Add goal
                let goalNode = { x: goalPos.x, y: goalPos.y, parent: newNode };
                rrtTree.push(goalNode);

                // Extract path
                let pathNodes = [];
                let current = goalNode;
                while (current) {
                    pathNodes.unshift({ x: current.x, y: current.y });
                    current = current.parent;
                }
                return pathNodes;
            }
        }
    }

    return [];
}

function heuristic(a, b) {
    return dist(a.col, a.row, b.col, b.row) * gridResolution;
}

function posToCell(pos) {
    return {
        col: constrain(floor(pos.x / gridResolution), 0, gridCols - 1),
        row: constrain(floor(pos.y / gridResolution), 0, gridRows - 1)
    };
}

function cellToPos(cell) {
    return {
        x: cell.col * gridResolution + gridResolution / 2,
        y: cell.row * gridResolution + gridResolution / 2
    };
}

function cellKey(cell) {
    return cell.col + ',' + cell.row;
}

function getNeighbors(cell) {
    let neighbors = [];
    let dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];

    for (let [dc, dr] of dirs) {
        let nc = cell.col + dc;
        let nr = cell.row + dr;

        if (nc >= 0 && nc < gridCols && nr >= 0 && nr < gridRows && grid[nc][nr] === 0) {
            neighbors.push({ col: nc, row: nr });
        }
    }

    return neighbors;
}

function reconstructPath(cameFrom, current) {
    let pathCells = [current];
    let key = cellKey(current);

    while (cameFrom[key]) {
        current = cameFrom[key];
        pathCells.unshift(current);
        key = cellKey(current);
    }

    return pathCells.map(c => cellToPos(c));
}

function lineCollision(x1, y1, x2, y2) {
    let steps = ceil(dist(x1, y1, x2, y2) / 5);
    for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        let x = lerp(x1, x2, t);
        let y = lerp(y1, y2, t);

        let col = floor(x / gridResolution);
        let row = floor(y / gridResolution);

        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
            if (grid[col][row] === 1) return true;
        }
    }
    return false;
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
    text('Path Planning Visualizer', canvasWidth / 2, 10);

    // Draw grid (faint)
    stroke(220);
    strokeWeight(1);
    for (let i = 0; i <= gridCols; i++) {
        line(i * gridResolution, 0, i * gridResolution, drawHeight);
    }
    for (let j = 0; j <= gridRows; j++) {
        line(0, j * gridResolution, canvasWidth, j * gridResolution);
    }

    // Draw obstacles
    fill(60);
    noStroke();
    for (let obs of obstacles) {
        rect(obs.x, obs.y, obs.w, obs.h, 3);
    }

    // Draw exploration
    if (showExplorationCheckbox.checked()) {
        if (algorithm === 'RRT') {
            // Draw RRT tree
            stroke(150, 200, 150);
            strokeWeight(1);
            for (let node of rrtTree) {
                if (node.parent) {
                    line(node.x, node.y, node.parent.x, node.parent.y);
                }
            }
        } else {
            // Draw explored cells
            noStroke();
            fill(200, 230, 255, 150);
            for (let cell of exploredCells) {
                rect(cell.col * gridResolution, cell.row * gridResolution, gridResolution, gridResolution);
            }
        }
    }

    // Draw path
    if (path.length > 1) {
        stroke(50, 150, 255);
        strokeWeight(4);
        noFill();
        beginShape();
        for (let p of path) {
            vertex(p.x, p.y);
        }
        endShape();
    }

    // Draw start and goal
    fill(0, 200, 0);
    noStroke();
    ellipse(startPos.x, startPos.y, 20, 20);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text('S', startPos.x, startPos.y);

    fill(255, 100, 100);
    ellipse(goalPos.x, goalPos.y, 20, 20);
    fill(255);
    text('G', goalPos.x, goalPos.y);

    // Draw labels and stats
    drawLabels();
}

function drawLabels() {
    fill(0);
    noStroke();
    textSize(defaultTextSize);
    textAlign(LEFT, CENTER);

    text('Grid Size: ' + gridResolution + 'px', 10, drawHeight + 60);

    // Stats
    textSize(12);
    textAlign(RIGHT, CENTER);

    let stats = 'Explored: ' + exploredCells.length;
    if (path.length > 0) {
        stats += ' | Path: ' + pathLength.toFixed(0) + 'px';
        stats += ' | Time: ' + planningTime.toFixed(0) + 'ms';
    } else if (exploredCells.length > 0) {
        stats += ' | No path found';
    }
    text(stats, canvasWidth - 20, drawHeight + 60);

    textSize(11);
    textAlign(CENTER, CENTER);
    fill(100);
    text('Click to place start (green) or goal (red) | Drag to draw obstacles', canvasWidth / 2, drawHeight + 80);
}

function mousePressed() {
    if (mouseY > drawHeight || mouseY < 0) return;

    // Check if clicking on obstacle cell
    let col = floor(mouseX / gridResolution);
    let row = floor(mouseY / gridResolution);

    if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
        if (keyIsDown(SHIFT)) {
            // Place goal
            goalPos = { x: mouseX, y: mouseY };
            resetPlanning();
        } else if (grid[col][row] === 0) {
            // Place start or start drawing obstacle
            if (dist(mouseX, mouseY, startPos.x, startPos.y) < 15) {
                // Dragging start
            } else if (dist(mouseX, mouseY, goalPos.x, goalPos.y) < 15) {
                // Dragging goal
            } else {
                // Start drawing obstacle
                isDrawingObstacle = true;
                currentObstacle = { x: mouseX, y: mouseY, w: 1, h: 1 };
            }
        }
    }
}

function mouseDragged() {
    if (mouseY > drawHeight) return;

    if (isDrawingObstacle && currentObstacle) {
        currentObstacle.w = max(10, mouseX - currentObstacle.x);
        currentObstacle.h = max(10, mouseY - currentObstacle.y);
    }
}

function mouseReleased() {
    if (isDrawingObstacle && currentObstacle) {
        if (currentObstacle.w > 15 && currentObstacle.h > 15) {
            obstacles.push(currentObstacle);
            markObstacleCells(currentObstacle);
            resetPlanning();
        }
        currentObstacle = null;
        isDrawingObstacle = false;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    initGrid();

    algorithmSelect.position(10, drawHeight + 8);
    planButton.position(100, drawHeight + 8);
    clearButton.position(200, drawHeight + 8);
    showExplorationCheckbox.position(300, drawHeight + 11);
    resolutionSlider.position(130, drawHeight + 50);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.floor(container.getBoundingClientRect().width);
        canvasWidth = max(canvasWidth, 700);
    }
}
