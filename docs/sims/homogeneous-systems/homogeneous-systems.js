// Homogeneous System Explorer MicroSim
// Explore homogeneous systems Ax = 0 and their null spaces
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 800;
let drawHeight = 380;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// Matrix A (coefficient matrix for Ax = 0)
let matrixA = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Analysis results
let analysis = {};

// Presets
const presets = {
    'trivial-only': {
        name: 'Only Trivial Solution',
        matrix: [[1, 2, 1], [2, 3, 1], [1, 1, 2]],
        desc: 'Full rank matrix: only x = 0 solves Ax = 0'
    },
    '1d-null': {
        name: '1D Null Space',
        matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        desc: 'Rank 2, n=3: null space is a line through origin'
    },
    '2d-null': {
        name: '2D Null Space',
        matrix: [[1, 2, 3, 4], [2, 4, 6, 8]],
        desc: 'Rank 1, n=4: null space is a plane through origin'
    },
    'more-vars': {
        name: 'More Vars than Eqs',
        matrix: [[1, 2, 3], [1, 1, 1]],
        desc: 'm < n guarantees nontrivial solutions'
    }
};

// UI elements
let presetSelect;
let showNullBasisCheckbox;

// Visualization - 3D rotation
let rotX = -0.4;
let rotY = 0.3;
let isDragging = false;
let lastMouseX, lastMouseY;

// Font
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent(document.querySelector('main'));
    textFont(font);
    textSize(defaultTextSize);

    // Analyze initial matrix
    analyzeHomogeneous();

    // Controls
    let row1Y = drawHeight + 15;

    presetSelect = createSelect();
    presetSelect.position(90, row1Y);
    presetSelect.option('Only Trivial Solution', 'trivial-only');
    presetSelect.option('1D Null Space', '1d-null');
    presetSelect.option('2D Null Space', '2d-null');
    presetSelect.option('More Vars than Eqs', 'more-vars');
    presetSelect.selected('1d-null');
    presetSelect.changed(loadPreset);

    showNullBasisCheckbox = createCheckbox(' Show null space basis', true);
    showNullBasisCheckbox.position(300, row1Y + 2);
    showNullBasisCheckbox.style('font-size', '14px');

    describe('Interactive exploration of homogeneous systems Ax = 0 and their null spaces', LABEL);
}

function draw() {
    updateCanvasSize();

    // Reset to 2D mode for backgrounds
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);

    // Draw backgrounds
    noStroke();
    fill('aliceblue');
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke('silver');
    strokeWeight(1);
    noFill();
    rect(0, 0, canvasWidth, drawHeight);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('Homogeneous System: Ax = 0', canvasWidth/2, 8);

    // Left panel: Matrix and analysis
    drawMatrixPanel();

    // Right panel: 3D null space visualization
    draw3DVisualization();

    // Bottom analysis
    drawAnalysisSummary();

    // Control labels
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    text('Example:', 20, drawHeight + 27);
}

function drawMatrixPanel() {
    let panelX = 20;
    let panelY = 40;

    // Matrix title
    fill(0, 70, 150);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text('Coefficient Matrix A', panelX, panelY);

    // Draw matrix A
    let cellW = 40;
    let cellH = 28;
    let matrixStartY = panelY + 25;

    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[i].length; j++) {
            let x = panelX + j * cellW + cellW/2;
            let y = matrixStartY + i * cellH + cellH/2;

            fill('#004080');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(13);
            text(formatNumber(matrixA[i][j]), x, y);
        }
    }

    // Brackets
    stroke(80);
    strokeWeight(2);
    noFill();
    let bracketX = panelX - 8;
    let rightX = panelX + matrixA[0].length * cellW + 3;
    let topY = matrixStartY - 5;
    let bottomY = matrixStartY + matrixA.length * cellH + 5;

    line(bracketX, topY, bracketX, bottomY);
    line(bracketX, topY, bracketX + 6, topY);
    line(bracketX, bottomY, bracketX + 6, bottomY);
    line(rightX, topY, rightX, bottomY);
    line(rightX, topY, rightX - 6, topY);
    line(rightX, bottomY, rightX - 6, bottomY);

    // Show x = 0 (trivial solution always exists)
    let infoY = matrixStartY + matrixA.length * cellH + 20;

    fill(0, 120, 0);
    textAlign(LEFT, TOP);
    textSize(13);
    text('Trivial solution always exists:', panelX, infoY);

    fill(0, 100, 0);
    textSize(14);
    text('x = 0', panelX + 10, infoY + 18);

    // Analysis info
    fill(60);
    textSize(12);
    let analysisY = infoY + 50;
    text('Matrix size: ' + matrixA.length + ' × ' + matrixA[0].length, panelX, analysisY);
    text('Rank: ' + analysis.rank, panelX, analysisY + 18);
    text('Null space dimension: ' + analysis.nullDim, panelX, analysisY + 36);

    // Condition for nontrivial solutions
    fill(analysis.hasNontrivial ? [0, 100, 200] : [150, 150, 150]);
    textSize(11);
    let condY = analysisY + 60;
    if (matrixA[0].length > matrixA.length) {
        text('n > m ⟹ nontrivial solutions exist', panelX, condY);
    } else {
        text('Nontrivial solutions exist iff rank < n', panelX, condY);
    }
}

function draw3DVisualization() {
    let viewX = canvasWidth * 0.45;
    let viewY = 40;
    let viewW = canvasWidth * 0.52;
    let viewH = 280;

    // Background box
    fill(250, 252, 255);
    stroke(200);
    strokeWeight(1);
    rect(viewX, viewY, viewW, viewH, 5);

    // Title
    fill(0, 100, 0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text('Null Space Visualization', viewX + 10, viewY + 8);

    // Null space type
    let typeText, typeColor;
    if (analysis.nullDim === 0) {
        typeText = 'Only the origin (trivial solution)';
        typeColor = [100, 100, 100];
    } else if (analysis.nullDim === 1) {
        typeText = 'Line through origin';
        typeColor = [0, 150, 200];
    } else if (analysis.nullDim === 2) {
        typeText = 'Plane through origin';
        typeColor = [0, 150, 200];
    } else {
        typeText = analysis.nullDim + '-dimensional subspace';
        typeColor = [0, 150, 200];
    }

    fill(typeColor);
    textSize(12);
    text(typeText, viewX + 10, viewY + 28);

    // Draw 3D scene
    push();
    translate(viewX + viewW/2 - canvasWidth/2, viewY + viewH/2 + 20 - canvasHeight/2);

    // Apply rotation
    rotateX(rotX);
    rotateY(rotY);

    let s = 25; // scale

    // Draw axes
    strokeWeight(1.5);
    stroke(200, 100, 100);
    line(-4*s, 0, 0, 4*s, 0, 0); // X
    stroke(100, 200, 100);
    line(0, -4*s, 0, 0, 4*s, 0); // Y
    stroke(100, 100, 200);
    line(0, 0, -4*s, 0, 0, 4*s); // Z

    // Axis labels (approximate positions)
    fill(200, 100, 100);
    noStroke();

    // Draw origin point
    fill(0, 200, 0);
    stroke(0, 100, 0);
    strokeWeight(2);
    sphere(5);

    // Draw null space
    if (analysis.nullDim === 1 && analysis.nullBasis && analysis.nullBasis.length > 0) {
        // Line through origin
        let v = analysis.nullBasis[0];
        stroke(0, 150, 200);
        strokeWeight(3);
        line(-4*v[0]*s, -4*v[1]*s, -4*v[2]*s, 4*v[0]*s, 4*v[1]*s, 4*v[2]*s);

        // Direction arrow
        if (showNullBasisCheckbox.checked()) {
            stroke(200, 100, 0);
            strokeWeight(2);
            line(0, 0, 0, v[0]*2*s, v[1]*2*s, v[2]*2*s);
        }
    } else if (analysis.nullDim === 2 && analysis.nullBasis && analysis.nullBasis.length >= 2) {
        // Plane through origin
        let v1 = analysis.nullBasis[0];
        let v2 = analysis.nullBasis[1];

        fill(0, 150, 200, 100);
        stroke(0, 100, 150);
        strokeWeight(1);
        beginShape();
        vertex((-v1[0] - v2[0])*3*s, (-v1[1] - v2[1])*3*s, (-v1[2] - v2[2])*3*s);
        vertex((v1[0] - v2[0])*3*s, (v1[1] - v2[1])*3*s, (v1[2] - v2[2])*3*s);
        vertex((v1[0] + v2[0])*3*s, (v1[1] + v2[1])*3*s, (v1[2] + v2[2])*3*s);
        vertex((-v1[0] + v2[0])*3*s, (-v1[1] + v2[1])*3*s, (-v1[2] + v2[2])*3*s);
        endShape(CLOSE);

        // Basis vectors
        if (showNullBasisCheckbox.checked()) {
            stroke(200, 100, 0);
            strokeWeight(2);
            line(0, 0, 0, v1[0]*2*s, v1[1]*2*s, v1[2]*2*s);
            stroke(200, 0, 100);
            line(0, 0, 0, v2[0]*2*s, v2[1]*2*s, v2[2]*2*s);
        }
    }

    pop();

    // Instructions
    fill(100);
    textSize(11);
    textAlign(LEFT, TOP);
    text('Drag to rotate', viewX + 10, viewY + viewH - 20);
}

function drawAnalysisSummary() {
    let summaryY = drawHeight + 55;

    fill(60);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);

    let text1 = analysis.hasNontrivial ?
        'This system has nontrivial solutions. The null space is a ' + analysis.nullDim + '-dimensional subspace through the origin.' :
        'This system has only the trivial solution x = 0. The null space contains only the origin.';

    text(text1, 20, summaryY);
}

function loadPreset() {
    let preset = presets[presetSelect.value()];
    matrixA = JSON.parse(JSON.stringify(preset.matrix));
    analyzeHomogeneous();
}

function analyzeHomogeneous() {
    // Compute RREF of A to find rank and null space
    let m = JSON.parse(JSON.stringify(matrixA));
    let numRows = m.length;
    let numCols = m[0].length;

    // Gaussian elimination
    let pivotCols = [];
    let pivotRow = 0;

    for (let col = 0; col < numCols && pivotRow < numRows; col++) {
        let maxRow = pivotRow;
        for (let i = pivotRow + 1; i < numRows; i++) {
            if (Math.abs(m[i][col]) > Math.abs(m[maxRow][col])) maxRow = i;
        }
        if (Math.abs(m[maxRow][col]) < 0.0001) continue;

        [m[pivotRow], m[maxRow]] = [m[maxRow], m[pivotRow]];

        // Scale pivot to 1
        let pivot = m[pivotRow][col];
        for (let j = col; j < numCols; j++) m[pivotRow][j] /= pivot;

        // Eliminate above and below
        for (let i = 0; i < numRows; i++) {
            if (i !== pivotRow && Math.abs(m[i][col]) > 0.0001) {
                let factor = m[i][col];
                for (let j = col; j < numCols; j++) m[i][j] -= factor * m[pivotRow][j];
            }
        }

        pivotCols.push(col);
        pivotRow++;
    }

    analysis.rank = pivotCols.length;
    analysis.nullDim = numCols - analysis.rank;
    analysis.hasNontrivial = analysis.nullDim > 0;

    // Find null space basis
    analysis.nullBasis = [];

    if (analysis.nullDim > 0) {
        // Free columns
        let freeCols = [];
        for (let j = 0; j < numCols; j++) {
            if (!pivotCols.includes(j)) freeCols.push(j);
        }

        // For each free variable, create a basis vector
        for (let freeCol of freeCols) {
            let basisVec = new Array(numCols).fill(0);
            basisVec[freeCol] = 1;

            // Find values for basic variables
            for (let i = 0; i < pivotCols.length; i++) {
                let pivotCol = pivotCols[i];
                // The coefficient of the free variable in this row
                basisVec[pivotCol] = -m[i][freeCol];
            }

            // Normalize for visualization
            let norm = Math.sqrt(basisVec.reduce((sum, v) => sum + v*v, 0));
            if (norm > 0.001) {
                basisVec = basisVec.map(v => v / norm);
            }

            // For 3D visualization, take first 3 components (or pad with zeros)
            let vec3D = [
                basisVec[0] || 0,
                basisVec[1] || 0,
                basisVec[2] || 0
            ];
            analysis.nullBasis.push(vec3D);
        }
    }
}

function formatNumber(val) {
    if (Math.abs(val) < 0.001) return '0';
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(2);
}

function mousePressed() {
    // Check if in 3D view area
    let viewX = canvasWidth * 0.45;
    let viewY = 40;
    let viewW = canvasWidth * 0.52;
    let viewH = 280;

    if (mouseX > viewX && mouseX < viewX + viewW &&
        mouseY > viewY && mouseY < viewY + viewH) {
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
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        containerWidth = container.offsetWidth;
        canvasWidth = Math.max(600, containerWidth);
    }
}
