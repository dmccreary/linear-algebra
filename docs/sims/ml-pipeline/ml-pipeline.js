// Machine Learning Pipeline Workflow
// Interactive flowchart showing the complete ML pipeline from raw data to trained model

let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Flowchart nodes
let nodes = [];
let selectedNode = null;
let hoveredNode = null;

// Controls
let resetButton;

// Color scheme
const colors = {
    dataProcessing: [66, 133, 244],    // Blue
    modeling: [52, 168, 83],            // Green
    optimization: [251, 188, 5],        // Orange
    evaluation: [153, 51, 255]          // Purple
};

// Code examples for each stage
const codeExamples = {
    rawData: `# Raw Data
import pandas as pd
data = pd.read_csv('dataset.csv')
X = data.drop('target', axis=1)
y = data['target']`,

    standardization: `# Standardization
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
# Now: mean=0, std=1`,

    pca: `# PCA (optional)
from sklearn.decomposition import PCA
pca = PCA(n_components=0.95)  # 95% variance
X_reduced = pca.fit_transform(X_scaled)`,

    trainTest: `# Train/Test Split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = \\
    train_test_split(X, y, test_size=0.2)`,

    modelSelection: `# Model Selection
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge, Lasso
model = Ridge(alpha=1.0)  # or Lasso, OLS`,

    ols: `# OLS (Ordinary Least Squares)
from sklearn.linear_model import LinearRegression
model = LinearRegression()
# Closed-form: beta = (X'X)^{-1}X'y`,

    ridge: `# Ridge Regression
from sklearn.linear_model import Ridge
model = Ridge(alpha=1.0)
# Adds L2 penalty: ||beta||^2`,

    lasso: `# Lasso Regression
from sklearn.linear_model import Lasso
model = Lasso(alpha=0.1)
# Adds L1 penalty: |beta|`,

    optimization: `# Optimization
model.fit(X_train, y_train)
# Gradient descent or closed-form solution
# Minimizes loss function`,

    evaluation: `# Evaluation
from sklearn.metrics import mean_squared_error, r2_score
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)`,

    trainedModel: `# Trained Model
import joblib
joblib.dump(model, 'trained_model.pkl')
# Ready for deployment!`
};

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    initializeNodes();

    // Create controls
    resetButton = createButton('Clear Selection');
    resetButton.position(10, drawHeight + 12);
    resetButton.mousePressed(clearSelection);

    describe('Interactive ML pipeline flowchart showing the complete workflow from raw data to trained model', LABEL);
}

function initializeNodes() {
    nodes = [
        {
            id: 'rawData',
            type: 'start',
            text: 'Raw Data',
            x: 0.5,
            y: 0.06,
            next: ['standardization'],
            color: colors.dataProcessing,
            hover: 'Original features, possibly different scales and units',
            category: 'Data Processing'
        },
        {
            id: 'standardization',
            type: 'process',
            text: 'Standardization',
            x: 0.5,
            y: 0.16,
            next: ['pca'],
            color: colors.dataProcessing,
            hover: 'Transform to zero mean, unit variance: z = (x - mean) / std',
            category: 'Data Processing'
        },
        {
            id: 'pca',
            type: 'optional',
            text: 'PCA (optional)',
            x: 0.5,
            y: 0.26,
            next: ['trainTest'],
            color: colors.dataProcessing,
            hover: 'Reduce dimensionality while preserving variance',
            category: 'Data Processing'
        },
        {
            id: 'trainTest',
            type: 'process',
            text: 'Train/Test Split',
            x: 0.5,
            y: 0.36,
            next: ['modelSelection'],
            color: colors.dataProcessing,
            hover: 'Hold out data for evaluation (typically 80/20 or 70/30)',
            category: 'Data Processing'
        },
        {
            id: 'modelSelection',
            type: 'decision',
            text: 'Model\nSelection',
            x: 0.5,
            y: 0.48,
            next: ['ols', 'ridge', 'lasso'],
            color: colors.modeling,
            hover: 'Choose algorithm and hyperparameters',
            category: 'Modeling'
        },
        {
            id: 'ols',
            type: 'branch',
            text: 'OLS',
            x: 0.2,
            y: 0.58,
            next: ['optimization'],
            color: colors.modeling,
            hover: 'Ordinary Least Squares: minimizes sum of squared residuals',
            category: 'Modeling'
        },
        {
            id: 'ridge',
            type: 'branch',
            text: 'Ridge',
            x: 0.5,
            y: 0.58,
            next: ['optimization'],
            color: colors.modeling,
            hover: 'L2 regularization: shrinks coefficients toward zero',
            category: 'Modeling'
        },
        {
            id: 'lasso',
            type: 'branch',
            text: 'Lasso',
            x: 0.8,
            y: 0.58,
            next: ['optimization'],
            color: colors.modeling,
            hover: 'L1 regularization: can produce sparse solutions',
            category: 'Modeling'
        },
        {
            id: 'optimization',
            type: 'process',
            text: 'Optimization',
            x: 0.5,
            y: 0.70,
            next: ['evaluation'],
            color: colors.optimization,
            hover: 'Find optimal parameters (closed-form or gradient descent)',
            category: 'Optimization'
        },
        {
            id: 'evaluation',
            type: 'process',
            text: 'Evaluation',
            x: 0.5,
            y: 0.82,
            next: ['trainedModel'],
            color: colors.evaluation,
            hover: 'Assess on test set using metrics: MSE, R-squared, etc.',
            category: 'Evaluation'
        },
        {
            id: 'trainedModel',
            type: 'end',
            text: 'Trained Model',
            x: 0.5,
            y: 0.92,
            next: [],
            color: colors.evaluation,
            hover: 'Model is ready for deployment and predictions',
            category: 'Evaluation'
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
    text('Machine Learning Pipeline', canvasWidth / 2, 6);

    // Draw legend
    drawLegend();

    // Draw flowchart
    drawConnections();
    drawNodes();

    // Draw info panels
    if (hoveredNode && !selectedNode) {
        drawHoverPanel(hoveredNode);
    }
    if (selectedNode) {
        drawCodePanel(selectedNode);
    }

    // Check for hover
    checkHover();
}

function drawLegend() {
    let legendX = canvasWidth - 95;
    let legendY = 28;
    let boxSize = 10;
    let spacing = 15;

    textAlign(LEFT, CENTER);
    textSize(9);
    noStroke();

    // Data Processing - Blue
    fill(colors.dataProcessing);
    rect(legendX, legendY, boxSize, boxSize, 2);
    fill(80);
    text('Data', legendX + 14, legendY + boxSize/2);

    // Modeling - Green
    fill(colors.modeling);
    rect(legendX, legendY + spacing, boxSize, boxSize, 2);
    fill(80);
    text('Model', legendX + 14, legendY + spacing + boxSize/2);

    // Optimization - Orange
    fill(colors.optimization);
    rect(legendX, legendY + 2*spacing, boxSize, boxSize, 2);
    fill(80);
    text('Optimize', legendX + 14, legendY + 2*spacing + boxSize/2);

    // Evaluation - Purple
    fill(colors.evaluation);
    rect(legendX, legendY + 3*spacing, boxSize, boxSize, 2);
    fill(80);
    text('Evaluate', legendX + 14, legendY + 3*spacing + boxSize/2);
}

function drawConnections() {
    strokeWeight(2);

    for (let node of nodes) {
        let x1 = node.x * canvasWidth;
        let y1 = node.y * drawHeight + getNodeHeight(node) / 2;

        for (let nextId of node.next) {
            let nextNode = nodes.find(n => n.id === nextId);
            if (!nextNode) continue;

            let x2 = nextNode.x * canvasWidth;
            let y2 = nextNode.y * drawHeight - getNodeHeight(nextNode) / 2;

            // Determine line color based on connection type
            let isSelected = selectedNode &&
                (selectedNode.id === node.id || selectedNode.id === nextId);

            if (isSelected) {
                stroke(50, 50, 50);
                strokeWeight(3);
            } else {
                stroke(150);
                strokeWeight(2);
            }

            // Special handling for model selection branches
            if (node.id === 'modelSelection') {
                // Draw branching lines
                let midY = (y1 + y2) / 2;
                line(x1, y1, x1, midY);
                line(x1, midY, x2, midY);
                line(x2, midY, x2, y2);
                drawArrowHead(x2, y2, HALF_PI);
            } else if (node.type === 'branch') {
                // Branches converging to optimization
                let midY = y1 + 20;
                line(x1, y1, x1, midY);
                line(x1, midY, x2, midY);
                line(x2, midY, x2, y2);
                drawArrowHead(x2, y2, HALF_PI);
            } else {
                // Standard straight arrow
                drawArrow(x1, y1, x2, y2);
            }
        }
    }
}

function drawArrow(x1, y1, x2, y2) {
    line(x1, y1, x2, y2);
    drawArrowHead(x2, y2, atan2(y2 - y1, x2 - x1));
}

function drawArrowHead(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle - HALF_PI);
    let c = color(stroke());
    fill(c);
    noStroke();
    triangle(0, 0, -5, -8, 5, -8);
    pop();
}

function drawNodes() {
    for (let node of nodes) {
        let x = node.x * canvasWidth;
        let y = node.y * drawHeight;
        let w = getNodeWidth(node);
        let h = getNodeHeight(node);

        let isHovered = hoveredNode && hoveredNode.id === node.id;
        let isSelected = selectedNode && selectedNode.id === node.id;

        // Draw node based on type
        if (node.type === 'start' || node.type === 'end') {
            drawRoundedNode(x, y, w, h, node.color, isHovered, isSelected);
        } else if (node.type === 'decision') {
            drawDiamondNode(x, y, w, h, node.color, isHovered, isSelected);
        } else if (node.type === 'optional') {
            drawDashedNode(x, y, w, h, node.color, isHovered, isSelected);
        } else if (node.type === 'branch') {
            drawSmallNode(x, y, w, h, node.color, isHovered, isSelected);
        } else {
            drawProcessNode(x, y, w, h, node.color, isHovered, isSelected);
        }

        // Node text
        fill(255);
        noStroke();
        textSize(node.type === 'branch' ? 10 : 11);
        textAlign(CENTER, CENTER);

        let lines = node.text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], x, y + (i - (lines.length-1)/2) * 12);
        }
    }
}

function drawRoundedNode(x, y, w, h, col, isHovered, isSelected) {
    // Glow effect
    if (isHovered || isSelected) {
        fill(col[0], col[1], col[2], 60);
        noStroke();
        rect(x - w/2 - 4, y - h/2 - 4, w + 8, h + 8, 18);
    }

    fill(col[0], col[1], col[2]);
    stroke(isSelected ? 0 : (isHovered ? 50 : 150));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    rect(x - w/2, y - h/2, w, h, 15);
}

function drawProcessNode(x, y, w, h, col, isHovered, isSelected) {
    if (isHovered || isSelected) {
        fill(col[0], col[1], col[2], 60);
        noStroke();
        rect(x - w/2 - 4, y - h/2 - 4, w + 8, h + 8, 8);
    }

    fill(col[0], col[1], col[2]);
    stroke(isSelected ? 0 : (isHovered ? 50 : 150));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    rect(x - w/2, y - h/2, w, h, 5);
}

function drawDiamondNode(x, y, w, h, col, isHovered, isSelected) {
    if (isHovered || isSelected) {
        fill(col[0], col[1], col[2], 60);
        noStroke();
        beginShape();
        vertex(x, y - h/2 - 6);
        vertex(x + w/2 + 6, y);
        vertex(x, y + h/2 + 6);
        vertex(x - w/2 - 6, y);
        endShape(CLOSE);
    }

    fill(col[0], col[1], col[2]);
    stroke(isSelected ? 0 : (isHovered ? 50 : 150));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    beginShape();
    vertex(x, y - h/2);
    vertex(x + w/2, y);
    vertex(x, y + h/2);
    vertex(x - w/2, y);
    endShape(CLOSE);
}

function drawDashedNode(x, y, w, h, col, isHovered, isSelected) {
    if (isHovered || isSelected) {
        fill(col[0], col[1], col[2], 60);
        noStroke();
        rect(x - w/2 - 4, y - h/2 - 4, w + 8, h + 8, 8);
    }

    fill(col[0], col[1], col[2], 200);
    stroke(isSelected ? 0 : (isHovered ? 50 : 150));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));

    // Draw dashed border
    rect(x - w/2, y - h/2, w, h, 5);

    // Draw dashed lines on top
    stroke(255, 100);
    strokeWeight(1);
    drawDashedRect(x - w/2, y - h/2, w, h, 5);
}

function drawDashedRect(x, y, w, h, r) {
    let dashLen = 5;
    let gapLen = 3;

    // Top edge
    for (let i = x + r; i < x + w - r; i += dashLen + gapLen) {
        line(i, y, min(i + dashLen, x + w - r), y);
    }
    // Bottom edge
    for (let i = x + r; i < x + w - r; i += dashLen + gapLen) {
        line(i, y + h, min(i + dashLen, x + w - r), y + h);
    }
    // Left edge
    for (let i = y + r; i < y + h - r; i += dashLen + gapLen) {
        line(x, i, x, min(i + dashLen, y + h - r));
    }
    // Right edge
    for (let i = y + r; i < y + h - r; i += dashLen + gapLen) {
        line(x + w, i, x + w, min(i + dashLen, y + h - r));
    }
}

function drawSmallNode(x, y, w, h, col, isHovered, isSelected) {
    if (isHovered || isSelected) {
        fill(col[0], col[1], col[2], 60);
        noStroke();
        rect(x - w/2 - 3, y - h/2 - 3, w + 6, h + 6, 10);
    }

    fill(col[0], col[1], col[2]);
    stroke(isSelected ? 0 : (isHovered ? 50 : 150));
    strokeWeight(isSelected ? 3 : (isHovered ? 2 : 1));
    rect(x - w/2, y - h/2, w, h, 8);
}

function drawHoverPanel(node) {
    let panelX = 10;
    let panelY = drawHeight - 45;
    let panelW = canvasWidth - 20;
    let panelH = 38;

    fill(255, 255, 255, 245);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 6);

    fill(node.color[0], node.color[1], node.color[2]);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text(node.category + ': ' + node.text.replace('\n', ' '), panelX + 8, panelY + 6);

    fill(60);
    textSize(10);
    text(node.hover, panelX + 8, panelY + 20);
}

function drawCodePanel(node) {
    let panelX = 10;
    let panelY = drawHeight - 130;
    let panelW = canvasWidth - 20;
    let panelH = 125;

    // Semi-transparent background
    fill(40, 40, 50, 240);
    stroke(100);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 6);

    // Code content
    fill(220, 220, 180);
    noStroke();
    textSize(9);
    textAlign(LEFT, TOP);
    textFont('monospace');

    let code = codeExamples[node.id] || '# Click a node to see code';
    let lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
        // Syntax highlighting
        let line = lines[i];
        if (line.startsWith('#')) {
            fill(120, 180, 120); // Green for comments
        } else if (line.includes('import') || line.includes('from')) {
            fill(200, 150, 220); // Purple for imports
        } else {
            fill(220, 220, 180); // Default
        }
        text(lines[i], panelX + 8, panelY + 8 + i * 11);
    }

    textFont('sans-serif');

    // Close hint
    fill(150);
    textSize(8);
    textAlign(RIGHT, BOTTOM);
    text('Click elsewhere to close', panelX + panelW - 8, panelY + panelH - 4);
}

function getNodeWidth(node) {
    if (node.type === 'decision') return 70;
    if (node.type === 'branch') return 55;
    if (node.type === 'start' || node.type === 'end') return 100;
    return 110;
}

function getNodeHeight(node) {
    if (node.type === 'decision') return 45;
    if (node.type === 'branch') return 22;
    let lines = node.text.split('\n').length;
    return 24 + (lines - 1) * 12;
}

function checkHover() {
    hoveredNode = null;

    for (let node of nodes) {
        let x = node.x * canvasWidth;
        let y = node.y * drawHeight;
        let w = getNodeWidth(node);
        let h = getNodeHeight(node);

        if (node.type === 'decision') {
            // Diamond hit detection
            let dx = abs(mouseX - x);
            let dy = abs(mouseY - y);
            if (dx / (w/2) + dy / (h/2) <= 1) {
                hoveredNode = node;
                cursor(HAND);
                return;
            }
        } else {
            // Rectangle hit detection
            if (mouseX > x - w/2 && mouseX < x + w/2 &&
                mouseY > y - h/2 && mouseY < y + h/2) {
                hoveredNode = node;
                cursor(HAND);
                return;
            }
        }
    }
    cursor(ARROW);
}

function mousePressed() {
    if (mouseY > drawHeight) return; // Ignore clicks in control area

    if (hoveredNode) {
        if (selectedNode && selectedNode.id === hoveredNode.id) {
            selectedNode = null; // Toggle off
        } else {
            selectedNode = hoveredNode;
        }
    } else {
        selectedNode = null;
    }
}

function clearSelection() {
    selectedNode = null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
