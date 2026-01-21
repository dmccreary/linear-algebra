// Diagonalization Process Workflow
// Interactive flowchart showing step-by-step diagonalization process

let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Flowchart nodes
let nodes = [];
let currentStep = 0;

// Animation
let animating = false;
let animationProgress = 0;

// Controls
let stepButton;
let resetButton;
let autoCheckbox;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    initializeNodes();

    // Create controls
    stepButton = createButton('Next Step');
    stepButton.position(10, drawHeight + 12);
    stepButton.mousePressed(nextStep);

    resetButton = createButton('Reset');
    resetButton.position(95, drawHeight + 12);
    resetButton.mousePressed(resetWorkflow);

    autoCheckbox = createCheckbox(' Auto-advance', false);
    autoCheckbox.position(155, drawHeight + 12);
    autoCheckbox.style('font-size', '13px');

    describe('Interactive flowchart guiding through the step-by-step process of diagonalizing a matrix', LABEL);
}

function initializeNodes() {
    // Define flowchart structure
    nodes = [
        {
            id: 0,
            type: 'start',
            text: 'Given matrix A',
            x: 0.5,
            y: 0.05,
            next: [1],
            description: 'Begin with an n×n matrix A'
        },
        {
            id: 1,
            type: 'process',
            text: 'Find det(A - λI)',
            x: 0.5,
            y: 0.14,
            next: [2],
            description: 'Compute the characteristic polynomial by expanding det(A - λI)'
        },
        {
            id: 2,
            type: 'process',
            text: 'Solve det(A - λI) = 0',
            x: 0.5,
            y: 0.23,
            next: [3],
            description: 'Find all roots λ₁, λ₂, ..., λₖ'
        },
        {
            id: 3,
            type: 'decision',
            text: 'n eigenvalues\nfound?',
            x: 0.5,
            y: 0.33,
            next: [4, 8],
            description: 'Count eigenvalues (with algebraic multiplicity)'
        },
        {
            id: 4,
            type: 'process',
            text: 'Find eigenvectors for each λ',
            x: 0.5,
            y: 0.44,
            next: [5],
            description: 'Solve (A - λI)v = 0 for each eigenvalue'
        },
        {
            id: 5,
            type: 'process',
            text: 'Compute geometric\nmultiplicity',
            x: 0.5,
            y: 0.54,
            next: [6],
            description: 'Count linearly independent eigenvectors for each λ'
        },
        {
            id: 6,
            type: 'decision',
            text: 'm_g = m_a\nfor all λ?',
            x: 0.5,
            y: 0.65,
            next: [7, 9],
            description: 'Check if geometric equals algebraic multiplicity'
        },
        {
            id: 7,
            type: 'success',
            text: 'A = PDP⁻¹',
            x: 0.5,
            y: 0.80,
            next: [],
            description: 'P = [v₁ | v₂ | ... | vₙ], D = diag(λ₁, λ₂, ..., λₙ)'
        },
        {
            id: 8,
            type: 'side',
            text: 'Check for\ncomplex λ',
            x: 0.82,
            y: 0.33,
            next: [],
            description: 'Complex eigenvalues may exist'
        },
        {
            id: 9,
            type: 'failure',
            text: 'NOT\ndiagonalizable',
            x: 0.82,
            y: 0.65,
            next: [],
            description: 'Matrix is defective'
        }
    ];
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
    textSize(16);
    text('Diagonalization Process', canvasWidth / 2, 8);

    // Draw flowchart
    drawConnections();
    drawNodes();

    // Draw description panel
    drawDescriptionPanel();

    // Auto-advance
    if (autoCheckbox.checked() && frameCount % 120 === 0) {
        if (currentStep < 7 && currentStep !== 3 && currentStep !== 6) {
            nextStep();
        }
    }
}

function drawConnections() {
    strokeWeight(2);

    for (let node of nodes) {
        let x1 = node.x * canvasWidth;
        let y1 = node.y * drawHeight + getNodeHeight(node) / 2 + 25;

        for (let nextId of node.next) {
            let nextNode = nodes.find(n => n.id === nextId);
            if (!nextNode) continue;

            let x2 = nextNode.x * canvasWidth;
            let y2 = nextNode.y * drawHeight + 25;

            // Determine if this is the active path
            let isActive = (currentStep >= node.id && currentStep >= nextId) ||
                           (node.id < currentStep && nextId <= currentStep);
            let isNext = (node.id === currentStep);

            if (isActive) {
                stroke(76, 175, 80);
            } else if (isNext) {
                stroke(33, 150, 243);
            } else {
                stroke(180);
            }

            // Draw connection
            if (node.type === 'decision') {
                // Decision branches
                let yesPath = node.next.indexOf(nextId) === 0;
                if (yesPath) {
                    // Yes path - straight down
                    drawArrow(x1, y1, x2, y2);
                    // Label
                    fill(100);
                    noStroke();
                    textSize(9);
                    textAlign(LEFT, CENTER);
                    text('Yes', x1 + 5, (y1 + y2) / 2);
                } else {
                    // No path - to the right
                    let midX = (x1 + x2) / 2;
                    stroke(isActive ? color(76, 175, 80) : isNext ? color(33, 150, 243) : color(180));
                    strokeWeight(2);
                    noFill();
                    line(x1 + 30, y1 - getNodeHeight(node)/2, midX, y1 - getNodeHeight(node)/2);
                    line(midX, y1 - getNodeHeight(node)/2, midX, y2);
                    drawArrowHead(midX, y2, PI/2);
                    // Label
                    fill(100);
                    noStroke();
                    textSize(9);
                    textAlign(CENTER, BOTTOM);
                    text('No', midX, y1 - getNodeHeight(node)/2 - 3);
                }
            } else {
                drawArrow(x1, y1, x2, y2);
            }
        }
    }
}

function drawArrow(x1, y1, x2, y2) {
    line(x1, y1, x2, y2 - 8);
    drawArrowHead(x2, y2 - 8, atan2(y2 - y1, x2 - x1));
}

function drawArrowHead(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle - HALF_PI);
    fill(stroke());
    noStroke();
    triangle(0, 0, -5, -8, 5, -8);
    pop();
}

function drawNodes() {
    for (let node of nodes) {
        let x = node.x * canvasWidth;
        let y = node.y * drawHeight + 25;
        let w = getNodeWidth(node);
        let h = getNodeHeight(node);

        let isActive = node.id <= currentStep;
        let isCurrent = node.id === currentStep;

        // Draw node based on type
        if (node.type === 'start') {
            drawRoundedRect(x, y, w, h, isActive, isCurrent, [100, 100, 100]);
        } else if (node.type === 'process') {
            drawProcessRect(x, y, w, h, isActive, isCurrent, [33, 150, 243]);
        } else if (node.type === 'decision') {
            drawDiamond(x, y, w, h, isActive, isCurrent, [255, 193, 7]);
        } else if (node.type === 'success') {
            drawRoundedRect(x, y, w, h, isActive, isCurrent, [76, 175, 80]);
        } else if (node.type === 'failure') {
            drawRoundedRect(x, y, w, h, isActive, isCurrent, [244, 67, 54]);
        } else if (node.type === 'side') {
            drawRoundedRect(x, y, w, h, isActive, isCurrent, [156, 39, 176]);
        }

        // Node text
        fill(isActive ? 255 : 80);
        noStroke();
        textSize(10);
        textAlign(CENTER, CENTER);
        let lines = node.text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], x, y + (i - (lines.length-1)/2) * 12);
        }
    }
}

function drawRoundedRect(x, y, w, h, isActive, isCurrent, baseColor) {
    if (isCurrent) {
        // Glow
        fill(baseColor[0], baseColor[1], baseColor[2], 50);
        noStroke();
        rect(x - w/2 - 5, y - h/2 - 5, w + 10, h + 10, 15);
    }

    if (isActive) {
        fill(baseColor[0], baseColor[1], baseColor[2]);
    } else {
        fill(220);
    }

    stroke(isCurrent ? color(0) : color(150));
    strokeWeight(isCurrent ? 2 : 1);
    rect(x - w/2, y - h/2, w, h, 15);
}

function drawProcessRect(x, y, w, h, isActive, isCurrent, baseColor) {
    if (isCurrent) {
        fill(baseColor[0], baseColor[1], baseColor[2], 50);
        noStroke();
        rect(x - w/2 - 5, y - h/2 - 5, w + 10, h + 10, 5);
    }

    if (isActive) {
        fill(baseColor[0], baseColor[1], baseColor[2]);
    } else {
        fill(220);
    }

    stroke(isCurrent ? color(0) : color(150));
    strokeWeight(isCurrent ? 2 : 1);
    rect(x - w/2, y - h/2, w, h, 5);
}

function drawDiamond(x, y, w, h, isActive, isCurrent, baseColor) {
    if (isCurrent) {
        fill(baseColor[0], baseColor[1], baseColor[2], 50);
        noStroke();
        beginShape();
        vertex(x, y - h/2 - 8);
        vertex(x + w/2 + 8, y);
        vertex(x, y + h/2 + 8);
        vertex(x - w/2 - 8, y);
        endShape(CLOSE);
    }

    if (isActive) {
        fill(baseColor[0], baseColor[1], baseColor[2]);
    } else {
        fill(220);
    }

    stroke(isCurrent ? color(0) : color(150));
    strokeWeight(isCurrent ? 2 : 1);
    beginShape();
    vertex(x, y - h/2);
    vertex(x + w/2, y);
    vertex(x, y + h/2);
    vertex(x - w/2, y);
    endShape(CLOSE);
}

function drawDescriptionPanel() {
    let currentNode = nodes.find(n => n.id === currentStep);
    if (!currentNode) return;

    let panelX = 10;
    let panelY = drawHeight - 65;
    let panelW = canvasWidth - 20;
    let panelH = 55;

    fill(255, 255, 255, 240);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);

    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Step ' + (currentStep + 1) + ': ' + currentNode.text.replace('\n', ' '), panelX + 10, panelY + 8);

    fill(80);
    textSize(10);
    text(currentNode.description, panelX + 10, panelY + 28);
}

function getNodeWidth(node) {
    if (node.type === 'decision') return 70;
    if (node.type === 'start') return 100;
    return 110;
}

function getNodeHeight(node) {
    if (node.type === 'decision') return 45;
    let lines = node.text.split('\n').length;
    return 25 + (lines - 1) * 12;
}

function nextStep() {
    let currentNode = nodes.find(n => n.id === currentStep);
    if (currentNode && currentNode.next.length > 0) {
        // For decisions, always take the "Yes" path in demo
        currentStep = currentNode.next[0];
    }
}

function resetWorkflow() {
    currentStep = 0;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
