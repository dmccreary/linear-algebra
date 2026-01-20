// Solution Set Visualizer MicroSim
// Explore different types of solution sets: unique, infinite, or none
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

// Matrix display
let matrix = [
    [1, 2, 1, 4],
    [2, 4, 3, 9],
    [1, 2, 2, 5]
];

// Preset examples
const presets = {
    'unique': {
        name: 'Unique Solution',
        matrix: [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]],
        desc: 'All columns are pivot columns'
    },
    'infinite-1': {
        name: 'Infinite (1 free)',
        matrix: [[1, 2, 1, 4], [2, 4, 3, 9], [1, 2, 2, 5]],
        desc: 'One free variable → line of solutions'
    },
    'infinite-2': {
        name: 'Infinite (2 free)',
        matrix: [[1, 2, 1, 4], [2, 4, 2, 8], [3, 6, 3, 12]],
        desc: 'Two free variables → plane of solutions'
    },
    'none': {
        name: 'No Solution',
        matrix: [[1, 2, 3], [1, 2, 5], [2, 4, 8]],
        desc: 'Inconsistent system: 0 = 2'
    }
};

// Analysis results
let analysis = {};

// UI elements
let presetSelect;
let showREFCheckbox, showRREFCheckbox;

// Visualization
let scale = 30;
let gridRange = 5;

// Font
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont(font);
    textSize(defaultTextSize);

    // Analyze initial matrix
    analyzeSystem();

    // Controls
    let row1Y = drawHeight + 15;

    presetSelect = createSelect();
    presetSelect.position(90, row1Y);
    presetSelect.option('Unique Solution', 'unique');
    presetSelect.option('Infinite (1 free)', 'infinite-1');
    presetSelect.option('Infinite (2 free)', 'infinite-2');
    presetSelect.option('No Solution', 'none');
    presetSelect.changed(loadPreset);

    showREFCheckbox = createCheckbox(' Show REF', false);
    showREFCheckbox.position(260, row1Y + 2);
    showREFCheckbox.style('font-size', '14px');

    showRREFCheckbox = createCheckbox(' Show RREF', true);
    showRREFCheckbox.position(360, row1Y + 2);
    showRREFCheckbox.style('font-size', '14px');

    describe('Interactive visualization exploring different solution set types for systems of linear equations', LABEL);
}

function draw() {
    updateCanvasSize();

    // Draw backgrounds
    fill('aliceblue');
    noStroke();
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke('silver');
    strokeWeight(1);
    noFill();
    rect(0, 0, canvasWidth, drawHeight);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20);
    text('Solution Set Analysis', canvasWidth/2, 8);

    // Left side: Matrix display
    drawMatrixPanel();

    // Right side: Geometric visualization
    drawGeometricView();

    // Bottom: Analysis summary
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
    let panelW = canvasWidth * 0.4;

    // Draw original or reduced matrix based on checkboxes
    let displayMatrix = matrix;
    let matrixTitle = 'Augmented Matrix [A|b]';

    if (showRREFCheckbox.checked() && analysis.rref) {
        displayMatrix = analysis.rref;
        matrixTitle = 'RREF';
    } else if (showREFCheckbox.checked() && analysis.ref) {
        displayMatrix = analysis.ref;
        matrixTitle = 'REF';
    }

    // Title
    fill(0, 70, 150);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text(matrixTitle, panelX, panelY);

    // Draw matrix
    let cellW = 45;
    let cellH = 30;
    let matrixStartY = panelY + 25;

    for (let i = 0; i < displayMatrix.length; i++) {
        for (let j = 0; j < displayMatrix[i].length; j++) {
            let x = panelX + j * cellW + cellW/2;
            let y = matrixStartY + i * cellH + cellH/2;

            // Highlight pivot columns
            if (analysis.pivotCols && analysis.pivotCols.includes(j) && j < displayMatrix[i].length - 1) {
                fill(255, 255, 200, 150);
                noStroke();
                rect(panelX + j * cellW + 2, matrixStartY + i * cellH + 2, cellW - 4, cellH - 4, 3);
            }

            // Highlight free variable columns
            if (analysis.freeCols && analysis.freeCols.includes(j)) {
                fill(200, 220, 255, 150);
                noStroke();
                rect(panelX + j * cellW + 2, matrixStartY + i * cellH + 2, cellW - 4, cellH - 4, 3);
            }

            // Highlight inconsistent row
            if (analysis.inconsistentRow === i) {
                fill(255, 200, 200);
                noStroke();
                rect(panelX + 2, matrixStartY + i * cellH + 2, displayMatrix[i].length * cellW - 4, cellH - 4, 3);
            }

            // Entry
            fill(j < displayMatrix[i].length - 1 ? '#004080' : '#008000');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(13);
            text(formatNumber(displayMatrix[i][j]), x, y);
        }
    }

    // Augmented line
    let augX = panelX + (displayMatrix[0].length - 1) * cellW - 3;
    stroke(150);
    strokeWeight(1);
    line(augX, matrixStartY - 3, augX, matrixStartY + displayMatrix.length * cellH + 3);

    // Variable labels
    let vars = ['x', 'y', 'z', 'w'];
    let numVars = displayMatrix[0].length - 1;
    textSize(11);
    fill(100);
    textAlign(CENTER, TOP);
    for (let j = 0; j < numVars; j++) {
        let colType = '';
        if (analysis.pivotCols && analysis.pivotCols.includes(j)) {
            colType = '(basic)';
            fill(150, 100, 0);
        } else if (analysis.freeCols && analysis.freeCols.includes(j)) {
            colType = '(free)';
            fill(0, 100, 150);
        } else {
            fill(100);
        }
        text(vars[j] + ' ' + colType, panelX + j * cellW + cellW/2, matrixStartY + displayMatrix.length * cellH + 8);
    }
}

function drawGeometricView() {
    let viewX = canvasWidth * 0.45;
    let viewY = 40;
    let viewW = canvasWidth * 0.52;
    let viewH = 250;

    // Background
    fill(250, 252, 255);
    stroke(200);
    strokeWeight(1);
    rect(viewX, viewY, viewW, viewH, 5);

    // Title
    fill(0, 100, 0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text('Geometric Interpretation', viewX + 10, viewY + 8);

    // Solution type indicator
    let typeColor, typeText;
    if (analysis.solutionType === 'unique') {
        typeColor = [0, 150, 0];
        typeText = 'UNIQUE SOLUTION';
    } else if (analysis.solutionType === 'infinite') {
        typeColor = [0, 100, 200];
        typeText = 'INFINITE SOLUTIONS';
    } else {
        typeColor = [200, 50, 50];
        typeText = 'NO SOLUTION';
    }

    fill(typeColor);
    textSize(16);
    textAlign(CENTER, TOP);
    text(typeText, viewX + viewW/2, viewY + 30);

    // Draw appropriate visualization
    let vizCenterX = viewX + viewW/2;
    let vizCenterY = viewY + viewH/2 + 20;

    push();
    translate(vizCenterX, vizCenterY);

    if (analysis.solutionType === 'unique') {
        // Draw intersecting lines/planes with a single point
        drawUniqueVisualization();
    } else if (analysis.solutionType === 'infinite') {
        // Draw line or plane of solutions
        drawInfiniteVisualization();
    } else {
        // Draw parallel lines/planes
        drawNoSolutionVisualization();
    }

    pop();
}

function drawUniqueVisualization() {
    // Draw coordinate axes
    stroke(180);
    strokeWeight(1);
    line(-80, 0, 80, 0);
    line(0, -60, 0, 60);

    // Draw two lines intersecting at a point
    stroke(0, 100, 200);
    strokeWeight(2);
    line(-70, -50, 70, 50);

    stroke(200, 50, 50);
    strokeWeight(2);
    line(-70, 50, 70, -50);

    // Solution point
    fill(0, 200, 0);
    stroke(0, 100, 0);
    strokeWeight(2);
    circle(0, 0, 16);

    // Label
    fill(0, 100, 0);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text('(x, y)', 12, -8);
}

function drawInfiniteVisualization() {
    // Draw coordinate axes
    stroke(180);
    strokeWeight(1);
    line(-80, 0, 80, 0);
    line(0, -60, 0, 60);

    let numFree = analysis.freeCols ? analysis.freeCols.length : 1;

    if (numFree === 1) {
        // Line of solutions
        stroke(0, 150, 200);
        strokeWeight(4);
        line(-70, 40, 70, -40);

        // Highlight solution line
        fill(0, 150, 200, 100);
        noStroke();
        beginShape();
        vertex(-70, 40 - 8);
        vertex(70, -40 - 8);
        vertex(70, -40 + 8);
        vertex(-70, 40 + 8);
        endShape(CLOSE);

        // Label
        fill(0, 100, 150);
        noStroke();
        textSize(12);
        textAlign(CENTER, TOP);
        text('Line of solutions', 0, 55);
    } else {
        // Plane of solutions (shown as filled region)
        fill(0, 150, 200, 80);
        stroke(0, 100, 150);
        strokeWeight(2);
        beginShape();
        vertex(-60, -50);
        vertex(60, -30);
        vertex(60, 50);
        vertex(-60, 30);
        endShape(CLOSE);

        // Label
        fill(0, 100, 150);
        noStroke();
        textSize(12);
        textAlign(CENTER, TOP);
        text('Plane of solutions', 0, 55);
    }
}

function drawNoSolutionVisualization() {
    // Draw coordinate axes
    stroke(180);
    strokeWeight(1);
    line(-80, 0, 80, 0);
    line(0, -60, 0, 60);

    // Parallel lines (no intersection)
    stroke(0, 100, 200);
    strokeWeight(2);
    line(-70, -30, 70, 30);

    stroke(200, 50, 50);
    strokeWeight(2);
    line(-70, -50, 70, 10);

    // Gap indicator
    stroke(100);
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(0, -10, 0, 20);
    drawingContext.setLineDash([]);

    // Label
    fill(200, 50, 50);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Parallel - no intersection', 0, 55);
}

function drawAnalysisSummary() {
    let summaryY = drawHeight + 50;

    fill(60);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);

    let summaryText = '';
    if (analysis.solutionType === 'unique') {
        summaryText = 'Every column is a pivot column. The system has exactly one solution.';
    } else if (analysis.solutionType === 'infinite') {
        let numFree = analysis.freeCols ? analysis.freeCols.length : 0;
        summaryText = numFree + ' free variable(s) → ' + (numFree === 1 ? 'line' : 'plane') + ' of solutions. ';
        summaryText += 'Free variables can take any value; basic variables are determined by them.';
    } else {
        summaryText = 'Row of form [0 0 ... 0 | c] where c ≠ 0 means 0 = c, which is impossible. System is inconsistent.';
    }

    text(summaryText, 20, summaryY);
}

function loadPreset() {
    let preset = presets[presetSelect.value()];
    matrix = JSON.parse(JSON.stringify(preset.matrix));
    analyzeSystem();
}

function analyzeSystem() {
    // Compute RREF and analyze solution set
    let ref = computeREF(JSON.parse(JSON.stringify(matrix)));
    let rref = computeRREF(JSON.parse(JSON.stringify(matrix)));

    analysis.ref = ref;
    analysis.rref = rref;

    // Find pivot columns
    let pivotCols = [];
    let numRows = rref.length;
    let numCols = rref[0].length - 1;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (Math.abs(rref[i][j]) > 0.001) {
                pivotCols.push(j);
                break;
            }
        }
    }

    analysis.pivotCols = pivotCols;

    // Find free columns
    let freeCols = [];
    for (let j = 0; j < numCols; j++) {
        if (!pivotCols.includes(j)) {
            freeCols.push(j);
        }
    }
    analysis.freeCols = freeCols;

    // Check for inconsistency
    analysis.inconsistentRow = -1;
    for (let i = 0; i < numRows; i++) {
        let allZero = true;
        for (let j = 0; j < numCols; j++) {
            if (Math.abs(rref[i][j]) > 0.001) {
                allZero = false;
                break;
            }
        }
        if (allZero && Math.abs(rref[i][numCols]) > 0.001) {
            analysis.inconsistentRow = i;
            break;
        }
    }

    // Determine solution type
    if (analysis.inconsistentRow >= 0) {
        analysis.solutionType = 'none';
    } else if (freeCols.length > 0) {
        analysis.solutionType = 'infinite';
    } else {
        analysis.solutionType = 'unique';
    }
}

function computeREF(m) {
    let n = m.length;
    let cols = m[0].length;
    let pivotRow = 0;

    for (let col = 0; col < cols - 1 && pivotRow < n; col++) {
        let maxRow = pivotRow;
        for (let i = pivotRow + 1; i < n; i++) {
            if (Math.abs(m[i][col]) > Math.abs(m[maxRow][col])) maxRow = i;
        }
        if (Math.abs(m[maxRow][col]) < 0.0001) continue;
        [m[pivotRow], m[maxRow]] = [m[maxRow], m[pivotRow]];
        for (let i = pivotRow + 1; i < n; i++) {
            if (Math.abs(m[i][col]) > 0.0001) {
                let factor = m[i][col] / m[pivotRow][col];
                for (let j = col; j < cols; j++) m[i][j] -= factor * m[pivotRow][j];
            }
        }
        pivotRow++;
    }
    return m;
}

function computeRREF(m) {
    m = computeREF(m);
    let n = m.length;
    let cols = m[0].length;

    for (let i = n - 1; i >= 0; i--) {
        let pivotCol = -1;
        for (let j = 0; j < cols - 1; j++) {
            if (Math.abs(m[i][j]) > 0.0001) { pivotCol = j; break; }
        }
        if (pivotCol === -1) continue;
        let pivot = m[i][pivotCol];
        for (let j = pivotCol; j < cols; j++) m[i][j] /= pivot;
        for (let k = 0; k < i; k++) {
            if (Math.abs(m[k][pivotCol]) > 0.0001) {
                let factor = m[k][pivotCol];
                for (let j = pivotCol; j < cols; j++) m[k][j] -= factor * m[i][j];
            }
        }
    }
    return m;
}

function formatNumber(val) {
    if (Math.abs(val) < 0.001) return '0';
    let rounded = Math.round(val * 100) / 100;
    if (Number.isInteger(rounded)) return rounded.toString();
    return rounded.toFixed(1);
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
