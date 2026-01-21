// Eigenvalue Applications Map
// Hub-and-spoke infographic showing eigenanalysis applications in ML/AI

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Application nodes
let applications = [
    {
        name: 'PCA',
        fullName: 'Principal Component Analysis',
        icon: '📊',
        color: [66, 133, 244],
        angle: 0,
        description: 'Find directions of maximum variance',
        uses: 'Covariance matrix eigenvectors',
        insight: 'Eigenvectors = principal directions',
        example: 'Face recognition (Eigenfaces)'
    },
    {
        name: 'PageRank',
        fullName: 'Google PageRank',
        icon: '🌐',
        color: [234, 67, 53],
        angle: 60,
        description: 'Rank web pages by importance',
        uses: 'Dominant eigenvector',
        insight: 'Power iteration at web scale',
        example: 'Search engine ranking'
    },
    {
        name: 'Stability',
        fullName: 'Neural Network Stability',
        icon: '🧠',
        color: [52, 168, 83],
        angle: 120,
        description: 'Analyze gradient flow',
        uses: 'Weight matrix eigenvalues',
        insight: '|λ| controls gradient flow',
        example: 'RNN vanishing gradients'
    },
    {
        name: 'Spectral',
        fullName: 'Spectral Clustering',
        icon: '🔷',
        color: [251, 188, 5],
        angle: 180,
        description: 'Cluster data using graph structure',
        uses: 'Graph Laplacian eigenvectors',
        insight: '2nd eigenvector separates clusters',
        example: 'Image segmentation'
    },
    {
        name: 'Quantum',
        fullName: 'Quantum Computing',
        icon: '⚛️',
        color: [156, 39, 176],
        angle: 240,
        description: 'Measurement outcomes',
        uses: 'Eigenvalues as observables',
        insight: 'Hermitian operators = observables',
        example: 'Quantum simulation'
    },
    {
        name: 'Recommender',
        fullName: 'Recommender Systems',
        icon: '🎬',
        color: [255, 87, 34],
        angle: 300,
        description: 'Predict user preferences',
        uses: 'Matrix factorization (SVD)',
        insight: 'Low-rank approximation',
        example: 'Netflix recommendations'
    }
];

// State
let hoveredApp = null;
let selectedApp = null;
let animationPhase = 0;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    describe('Hub and spoke infographic showing applications of eigenanalysis in machine learning, AI, and science including PCA, PageRank, neural network stability, spectral clustering, quantum computing, and recommender systems', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Eigenvalue Applications in AI/ML', canvasWidth / 2, 10);

    // Subtitle
    fill(100);
    textSize(11);
    text('Click nodes for details', canvasWidth / 2, 32);

    // Center of hub
    let centerX = canvasWidth / 2;
    let centerY = drawHeight / 2 - 20;
    let radius = min(canvasWidth, drawHeight) * 0.32;

    // Draw connections first
    drawConnections(centerX, centerY, radius);

    // Draw central hub
    drawCentralHub(centerX, centerY);

    // Draw application nodes
    drawApplicationNodes(centerX, centerY, radius);

    // Draw detail panel if selected
    if (selectedApp !== null) {
        drawDetailPanel(applications[selectedApp]);
    }

    // Update animation
    animationPhase += 0.02;

    // Check hover
    checkHover(centerX, centerY, radius);

    // Control area instruction
    fill(100);
    textSize(11);
    textAlign(CENTER, CENTER);
    text('All these applications depend on eigenvalues and eigenvectors!', canvasWidth / 2, drawHeight + 20);
}

function drawConnections(cx, cy, radius) {
    for (let i = 0; i < applications.length; i++) {
        let app = applications[i];
        let angle = radians(app.angle - 90);
        let nodeX = cx + cos(angle) * radius;
        let nodeY = cy + sin(angle) * radius;

        let isHovered = hoveredApp === i;
        let isSelected = selectedApp === i;

        // Connection line
        if (isHovered || isSelected) {
            stroke(app.color[0], app.color[1], app.color[2], 200);
            strokeWeight(4);
        } else {
            stroke(200);
            strokeWeight(2);
        }

        line(cx, cy, nodeX, nodeY);

        // Animated pulse on hover
        if (isHovered) {
            let pulseSize = 10 + sin(animationPhase * 3) * 3;
            let pulseAlpha = 100 + sin(animationPhase * 3) * 50;
            noFill();
            stroke(app.color[0], app.color[1], app.color[2], pulseAlpha);
            strokeWeight(2);
            ellipse(nodeX, nodeY, 60 + pulseSize, 60 + pulseSize);
        }
    }
}

function drawCentralHub(cx, cy) {
    // Outer glow
    noStroke();
    for (let r = 60; r > 35; r -= 5) {
        let alpha = map(r, 60, 35, 20, 80);
        fill(100, 150, 255, alpha);
        ellipse(cx, cy, r * 2, r * 2);
    }

    // Main circle
    fill(33, 150, 243);
    stroke(255);
    strokeWeight(3);
    ellipse(cx, cy, 70, 70);

    // Text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    text('Eigen-', cx, cy - 8);
    text('analysis', cx, cy + 8);
}

function drawApplicationNodes(cx, cy, radius) {
    for (let i = 0; i < applications.length; i++) {
        let app = applications[i];
        let angle = radians(app.angle - 90);
        let nodeX = cx + cos(angle) * radius;
        let nodeY = cy + sin(angle) * radius;

        let isHovered = hoveredApp === i;
        let isSelected = selectedApp === i;

        // Node background
        let nodeSize = isHovered || isSelected ? 55 : 50;

        // Shadow
        if (isHovered || isSelected) {
            fill(0, 0, 0, 30);
            noStroke();
            ellipse(nodeX + 2, nodeY + 2, nodeSize, nodeSize);
        }

        // Main circle
        fill(app.color[0], app.color[1], app.color[2]);
        stroke(isSelected ? color(0) : color(255));
        strokeWeight(isSelected ? 3 : 2);
        ellipse(nodeX, nodeY, nodeSize, nodeSize);

        // Icon
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);
        text(app.icon, nodeX, nodeY - 2);

        // Label below
        fill(isHovered || isSelected ? color(0) : color(80));
        textSize(10);
        textAlign(CENTER, TOP);
        text(app.name, nodeX, nodeY + nodeSize/2 + 5);
    }
}

function drawDetailPanel(app) {
    let panelX = 15;
    let panelY = drawHeight - 150;
    let panelW = canvasWidth - 30;
    let panelH = 140;

    // Background
    fill(255, 255, 255, 245);
    stroke(app.color[0], app.color[1], app.color[2]);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 10);

    // Title bar
    fill(app.color[0], app.color[1], app.color[2]);
    noStroke();
    rect(panelX, panelY, panelW, 25, 10, 10, 0, 0);

    // Title
    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text(app.icon + ' ' + app.fullName, panelX + 10, panelY + 12);

    // Close button
    textAlign(RIGHT, CENTER);
    text('✕', panelX + panelW - 10, panelY + 12);

    // Content
    fill(0);
    textSize(10);
    textAlign(LEFT, TOP);

    let y = panelY + 35;
    let lineH = 16;
    let labelX = panelX + 10;
    let valueX = panelX + 80;

    // Description
    fill(80);
    text(app.description, labelX, y);
    y += lineH + 5;

    // Uses
    fill(100);
    text('Uses:', labelX, y);
    fill(0);
    text(app.uses, valueX, y);
    y += lineH;

    // Key insight
    fill(100);
    text('Key insight:', labelX, y);
    fill(app.color[0], app.color[1], app.color[2]);
    text(app.insight, valueX, y);
    y += lineH;

    // Example
    fill(100);
    text('Example:', labelX, y);
    fill(0);
    text(app.example, valueX, y);
}

function checkHover(cx, cy, radius) {
    hoveredApp = null;
    cursor(ARROW);

    for (let i = 0; i < applications.length; i++) {
        let app = applications[i];
        let angle = radians(app.angle - 90);
        let nodeX = cx + cos(angle) * radius;
        let nodeY = cy + sin(angle) * radius;

        if (dist(mouseX, mouseY, nodeX, nodeY) < 30) {
            hoveredApp = i;
            cursor(HAND);
            break;
        }
    }

    // Check close button if detail panel is shown
    if (selectedApp !== null) {
        let panelX = 15;
        let panelY = drawHeight - 150;
        let panelW = canvasWidth - 30;

        if (mouseX >= panelX + panelW - 25 && mouseX <= panelX + panelW &&
            mouseY >= panelY && mouseY <= panelY + 25) {
            cursor(HAND);
        }
    }
}

function mousePressed() {
    let centerX = canvasWidth / 2;
    let centerY = drawHeight / 2 - 20;
    let radius = min(canvasWidth, drawHeight) * 0.32;

    // Check if clicking on a node
    for (let i = 0; i < applications.length; i++) {
        let app = applications[i];
        let angle = radians(app.angle - 90);
        let nodeX = centerX + cos(angle) * radius;
        let nodeY = centerY + sin(angle) * radius;

        if (dist(mouseX, mouseY, nodeX, nodeY) < 30) {
            selectedApp = (selectedApp === i) ? null : i;
            return;
        }
    }

    // Check close button
    if (selectedApp !== null) {
        let panelX = 15;
        let panelY = drawHeight - 150;
        let panelW = canvasWidth - 30;

        if (mouseX >= panelX + panelW - 25 && mouseX <= panelX + panelW &&
            mouseY >= panelY && mouseY <= panelY + 25) {
            selectedApp = null;
            return;
        }
    }

    // Click elsewhere closes panel
    if (selectedApp !== null && mouseY < drawHeight - 150) {
        selectedApp = null;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
