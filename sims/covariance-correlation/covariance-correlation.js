// Covariance and Correlation Matrix Visualizer
// Understand how covariance and correlation capture relationships between features
// Bloom's Level: Analyze

let canvasWidth = 900;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;

// Data storage
let dataPoints = [];
let numPoints = 100;
let numFeatures = 2;

// Statistics
let means = [];
let stdDevs = [];
let covarianceMatrix = [];
let correlationMatrix = [];
let eigenvalues = [];
let eigenvectors = [];

// UI elements
let datasetSelect;
let standardizeCheckbox;
let correlationSlider;
let resetButton;
let highlightedCell = null;

// Dragging
let draggedPoint = -1;

// Color scale bounds
let maxCovValue = 1;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Create controls - Row 1
    let row1Y = drawHeight + 12;

    datasetSelect = createSelect();
    datasetSelect.position(75, row1Y);
    datasetSelect.option('Positive Correlation');
    datasetSelect.option('Negative Correlation');
    datasetSelect.option('No Correlation');
    datasetSelect.option('Strong Correlation');
    datasetSelect.selected('Positive Correlation');
    datasetSelect.changed(onDatasetChange);

    standardizeCheckbox = createCheckbox('Standardize Data', false);
    standardizeCheckbox.position(230, row1Y);
    standardizeCheckbox.style('font-size', '13px');
    standardizeCheckbox.changed(updateStatistics);

    resetButton = createButton('Reset');
    resetButton.position(canvasWidth - 70, row1Y);
    resetButton.mousePressed(resetData);

    // Row 2 - Correlation slider
    let row2Y = drawHeight + 45;

    correlationSlider = createSlider(-0.95, 0.95, 0.6, 0.05);
    correlationSlider.position(130, row2Y);
    correlationSlider.size(150);
    correlationSlider.input(onCorrelationChange);

    // Generate initial data
    generateData(0.6);

    describe('Covariance and correlation matrix visualizer showing scatter plot, covariance heatmap, and correlation heatmap with interactive data manipulation', LABEL);
}

function draw() {
    updateCanvasSize();

    // Drawing area background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    fill(0);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('Covariance and Correlation Matrix Visualizer', canvasWidth / 2, 8);

    // Calculate panel dimensions
    let panelGap = 15;
    let totalGap = margin * 2 + panelGap * 2;
    let panelWidth = (canvasWidth - totalGap) / 3;
    let panelTop = 35;
    let panelHeight = drawHeight - panelTop - 15;

    // Draw three panels
    drawScatterPlot(margin, panelTop, panelWidth, panelHeight);
    drawCovarianceMatrix(margin + panelWidth + panelGap, panelTop, panelWidth, panelHeight);
    drawCorrelationMatrix(margin + 2 * (panelWidth + panelGap), panelTop, panelWidth, panelHeight);

    // Control labels
    fill(80);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text('Dataset:', 10, drawHeight + 22);
    text('Correlation:', 10, drawHeight + 55);
    text(correlationSlider.value().toFixed(2), 290, drawHeight + 55);

    textSize(10);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Drag points in scatter plot to modify data', 370, drawHeight + 22);
    text('Click matrix cells to highlight relationship', 370, drawHeight + 55);
}

function drawScatterPlot(px, py, pw, ph) {
    // Panel background
    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(px, py, pw, ph, 5);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Scatter Plot (X vs Y)', px + pw / 2, py + 5);

    // Plot area
    let plotMargin = 35;
    let plotLeft = px + plotMargin;
    let plotRight = px + pw - 15;
    let plotTop = py + 30;
    let plotBottom = py + ph - 25;
    let plotWidth = plotRight - plotLeft;
    let plotHeight = plotBottom - plotTop;

    // Grid
    stroke(235);
    strokeWeight(1);
    for (let i = 0; i <= 5; i++) {
        let x = plotLeft + (i / 5) * plotWidth;
        let y = plotTop + (i / 5) * plotHeight;
        line(x, plotTop, x, plotBottom);
        line(plotLeft, y, plotRight, y);
    }

    // Axes
    stroke(150);
    strokeWeight(1);
    line(plotLeft, plotBottom, plotRight, plotBottom);
    line(plotLeft, plotTop, plotLeft, plotBottom);

    // Axis labels
    fill(80);
    noStroke();
    textSize(10);
    textAlign(CENTER, TOP);
    text('Feature X', plotLeft + plotWidth / 2, plotBottom + 8);

    push();
    translate(px + 12, plotTop + plotHeight / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, BOTTOM);
    text('Feature Y', 0, 0);
    pop();

    // Find data range
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;

    let displayData = getDisplayData();

    for (let pt of displayData) {
        xMin = min(xMin, pt.x);
        xMax = max(xMax, pt.x);
        yMin = min(yMin, pt.y);
        yMax = max(yMax, pt.y);
    }

    // Add padding
    let xPad = (xMax - xMin) * 0.1 || 1;
    let yPad = (yMax - yMin) * 0.1 || 1;
    xMin -= xPad;
    xMax += xPad;
    yMin -= yPad;
    yMax += yPad;

    // Draw trend line (regression)
    if (displayData.length > 1) {
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        let n = displayData.length;
        for (let pt of displayData) {
            sumX += pt.x;
            sumY += pt.y;
            sumXY += pt.x * pt.y;
            sumX2 += pt.x * pt.x;
        }
        let denom = n * sumX2 - sumX * sumX;
        if (abs(denom) > 0.0001) {
            let slope = (n * sumXY - sumX * sumY) / denom;
            let intercept = (sumY - slope * sumX) / n;

            stroke(200, 100, 100, 150);
            strokeWeight(1.5);
            let x1 = xMin;
            let y1 = slope * x1 + intercept;
            let x2 = xMax;
            let y2 = slope * x2 + intercept;

            let px1 = map(x1, xMin, xMax, plotLeft, plotRight);
            let py1 = map(y1, yMin, yMax, plotBottom, plotTop);
            let px2 = map(x2, xMin, xMax, plotLeft, plotRight);
            let py2 = map(y2, yMin, yMax, plotBottom, plotTop);

            // Clip to plot area
            py1 = constrain(py1, plotTop, plotBottom);
            py2 = constrain(py2, plotTop, plotBottom);
            line(px1, py1, px2, py2);
        }
    }

    // Draw data points
    for (let i = 0; i < displayData.length; i++) {
        let pt = displayData[i];
        let x = map(pt.x, xMin, xMax, plotLeft, plotRight);
        let y = map(pt.y, yMin, yMax, plotBottom, plotTop);

        if (i === draggedPoint) {
            fill(50, 100, 200);
            stroke(30, 70, 170);
            strokeWeight(2);
            ellipse(x, y, 12, 12);
        } else {
            fill(70, 130, 220, 180);
            stroke(50, 100, 180);
            strokeWeight(1);
            ellipse(x, y, 8, 8);
        }
    }

    // Statistics display
    fill(0);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    let statY = plotTop + 5;
    let corrVal = correlationMatrix.length > 0 ? correlationMatrix[0][1] : 0;
    text('r = ' + corrVal.toFixed(3), plotLeft + 5, statY);

    // Highlight cell indicator
    if (highlightedCell && highlightedCell.i !== highlightedCell.j) {
        fill(255, 200, 100, 100);
        noStroke();
        rect(plotLeft, plotTop, plotWidth, plotHeight);
    }
}

function drawCovarianceMatrix(px, py, pw, ph) {
    // Panel background
    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(px, py, pw, ph, 5);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Covariance Matrix', px + pw / 2, py + 5);

    // Matrix area
    let matrixSize = min(pw - 80, ph - 120);
    let cellSize = matrixSize / numFeatures;
    let matrixX = px + (pw - matrixSize) / 2;
    let matrixY = py + 35;

    // Feature labels
    textSize(11);
    textAlign(CENTER, BOTTOM);
    fill(80);
    text('X', matrixX + cellSize * 0.5, matrixY - 3);
    text('Y', matrixX + cellSize * 1.5, matrixY - 3);

    textAlign(RIGHT, CENTER);
    text('X', matrixX - 5, matrixY + cellSize * 0.5);
    text('Y', matrixX - 5, matrixY + cellSize * 1.5);

    // Draw matrix cells
    for (let i = 0; i < numFeatures; i++) {
        for (let j = 0; j < numFeatures; j++) {
            let cx = matrixX + j * cellSize;
            let cy = matrixY + i * cellSize;
            let val = covarianceMatrix.length > 0 ? covarianceMatrix[i][j] : 0;

            // Color based on value
            let col = getHeatmapColor(val, maxCovValue);
            fill(col);

            // Highlight on hover/click
            if (highlightedCell && highlightedCell.i === i && highlightedCell.j === j && highlightedCell.type === 'cov') {
                stroke(0);
                strokeWeight(3);
            } else {
                stroke(150);
                strokeWeight(1);
            }
            rect(cx, cy, cellSize, cellSize);

            // Value text
            fill(abs(val) > maxCovValue * 0.5 ? 255 : 0);
            noStroke();
            textSize(11);
            textAlign(CENTER, CENTER);
            text(val.toFixed(2), cx + cellSize / 2, cy + cellSize / 2);
        }
    }

    // Color scale
    drawColorScale(px + 10, matrixY + matrixSize + 15, pw - 20, 15, -maxCovValue, maxCovValue, 'Covariance');

    // Eigenvalue display
    let eigY = matrixY + matrixSize + 60;
    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text('Eigenvalues:', px + 10, eigY);

    textSize(10);
    fill(80);
    if (eigenvalues.length >= 2) {
        text('\u03BB\u2081 = ' + eigenvalues[0].toFixed(3), px + 15, eigY + 16);
        text('\u03BB\u2082 = ' + eigenvalues[1].toFixed(3), px + 15, eigY + 30);

        // Total variance
        let totalVar = eigenvalues[0] + eigenvalues[1];
        text('Total: ' + totalVar.toFixed(3), px + 100, eigY + 16);

        // Variance explained
        if (totalVar > 0.001) {
            let pct1 = (eigenvalues[0] / totalVar * 100).toFixed(1);
            text('\u03BB\u2081: ' + pct1 + '% var', px + 100, eigY + 30);
        }
    }

    // Formula reminder
    fill(100);
    textSize(9);
    textAlign(CENTER, BOTTOM);
    text('Cov(X,Y) = E[(X-\u03BCx)(Y-\u03BCy)]', px + pw / 2, py + ph - 5);
}

function drawCorrelationMatrix(px, py, pw, ph) {
    // Panel background
    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(px, py, pw, ph, 5);

    // Title
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text('Correlation Matrix', px + pw / 2, py + 5);

    // Matrix area
    let matrixSize = min(pw - 80, ph - 120);
    let cellSize = matrixSize / numFeatures;
    let matrixX = px + (pw - matrixSize) / 2;
    let matrixY = py + 35;

    // Feature labels
    textSize(11);
    textAlign(CENTER, BOTTOM);
    fill(80);
    text('X', matrixX + cellSize * 0.5, matrixY - 3);
    text('Y', matrixX + cellSize * 1.5, matrixY - 3);

    textAlign(RIGHT, CENTER);
    text('X', matrixX - 5, matrixY + cellSize * 0.5);
    text('Y', matrixX - 5, matrixY + cellSize * 1.5);

    // Draw matrix cells
    for (let i = 0; i < numFeatures; i++) {
        for (let j = 0; j < numFeatures; j++) {
            let cx = matrixX + j * cellSize;
            let cy = matrixY + i * cellSize;
            let val = correlationMatrix.length > 0 ? correlationMatrix[i][j] : 0;

            // Color based on value (correlation is always -1 to 1)
            let col = getHeatmapColor(val, 1);
            fill(col);

            // Highlight on hover/click
            if (highlightedCell && highlightedCell.i === i && highlightedCell.j === j && highlightedCell.type === 'corr') {
                stroke(0);
                strokeWeight(3);
            } else {
                stroke(150);
                strokeWeight(1);
            }
            rect(cx, cy, cellSize, cellSize);

            // Value text
            fill(abs(val) > 0.5 ? 255 : 0);
            noStroke();
            textSize(11);
            textAlign(CENTER, CENTER);
            text(val.toFixed(2), cx + cellSize / 2, cy + cellSize / 2);
        }
    }

    // Color scale
    drawColorScale(px + 10, matrixY + matrixSize + 15, pw - 20, 15, -1, 1, 'Correlation');

    // Standardization info
    let infoY = matrixY + matrixSize + 60;
    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);

    if (standardizeCheckbox.checked()) {
        fill(50, 150, 50);
        text('Standardized:', px + 10, infoY);
        fill(80);
        textSize(10);
        text('Cov = Corr (when standardized)', px + 15, infoY + 16);
        text('\u03C3x = \u03C3y = 1, \u03BCx = \u03BCy = 0', px + 15, infoY + 30);
    } else {
        text('Interpretation:', px + 10, infoY);
        fill(80);
        textSize(10);
        let r = correlationMatrix.length > 0 ? correlationMatrix[0][1] : 0;
        let strength = '';
        let absR = abs(r);
        if (absR > 0.8) strength = 'Very strong';
        else if (absR > 0.6) strength = 'Strong';
        else if (absR > 0.4) strength = 'Moderate';
        else if (absR > 0.2) strength = 'Weak';
        else strength = 'Very weak/None';

        let direction = r >= 0 ? 'positive' : 'negative';
        text(strength + ' ' + direction, px + 15, infoY + 16);
        text('|r| = ' + absR.toFixed(3), px + 15, infoY + 30);
    }

    // Formula reminder
    fill(100);
    textSize(9);
    textAlign(CENTER, BOTTOM);
    text('Corr(X,Y) = Cov(X,Y) / (\u03C3x\u03C3y)', px + pw / 2, py + ph - 5);
}

function drawColorScale(x, y, w, h, minVal, maxVal, label) {
    // Draw gradient
    noStroke();
    for (let i = 0; i < w; i++) {
        let val = map(i, 0, w, minVal, maxVal);
        fill(getHeatmapColor(val, abs(maxVal)));
        rect(x + i, y, 1, h);
    }

    // Border
    stroke(150);
    strokeWeight(1);
    noFill();
    rect(x, y, w, h);

    // Labels
    fill(80);
    noStroke();
    textSize(9);
    textAlign(LEFT, TOP);
    text(minVal.toFixed(1), x, y + h + 2);
    textAlign(CENTER, TOP);
    text('0', x + w / 2, y + h + 2);
    textAlign(RIGHT, TOP);
    text(maxVal.toFixed(1), x + w, y + h + 2);
}

function getHeatmapColor(val, maxVal) {
    // Blue (negative) -> White (zero) -> Red (positive)
    let t = map(constrain(val, -maxVal, maxVal), -maxVal, maxVal, 0, 1);

    if (t < 0.5) {
        // Blue to White
        let s = t * 2;
        return color(lerp(70, 255, s), lerp(130, 255, s), lerp(220, 255, s));
    } else {
        // White to Red
        let s = (t - 0.5) * 2;
        return color(255, lerp(255, 100, s), lerp(255, 100, s));
    }
}

function getDisplayData() {
    if (standardizeCheckbox.checked()) {
        // Return standardized data
        let result = [];
        for (let pt of dataPoints) {
            result.push({
                x: (pt.x - means[0]) / (stdDevs[0] || 1),
                y: (pt.y - means[1]) / (stdDevs[1] || 1)
            });
        }
        return result;
    }
    return dataPoints;
}

function generateData(targetCorrelation) {
    dataPoints = [];

    // Generate correlated bivariate normal data
    // Using Cholesky-like approach
    let meanX = 3;
    let meanY = 4;
    let stdX = 1.5;
    let stdY = 2;

    for (let i = 0; i < numPoints; i++) {
        // Generate two independent standard normals using Box-Muller
        let u1 = random(0.0001, 0.9999);
        let u2 = random(0.0001, 0.9999);
        let z1 = sqrt(-2 * log(u1)) * cos(TWO_PI * u2);
        let z2 = sqrt(-2 * log(u1)) * sin(TWO_PI * u2);

        // Create correlated variables
        let x = z1;
        let y = targetCorrelation * z1 + sqrt(1 - targetCorrelation * targetCorrelation) * z2;

        // Scale and shift
        x = x * stdX + meanX;
        y = y * stdY + meanY;

        dataPoints.push({ x: x, y: y });
    }

    updateStatistics();
}

function updateStatistics() {
    if (dataPoints.length < 2) return;

    let displayData = standardizeCheckbox.checked() ? getDisplayData() : dataPoints;
    let n = displayData.length;

    // Calculate means (for original data, used in standardization)
    means = [0, 0];
    for (let pt of dataPoints) {
        means[0] += pt.x;
        means[1] += pt.y;
    }
    means[0] /= n;
    means[1] /= n;

    // Calculate standard deviations (for original data)
    stdDevs = [0, 0];
    for (let pt of dataPoints) {
        stdDevs[0] += (pt.x - means[0]) * (pt.x - means[0]);
        stdDevs[1] += (pt.y - means[1]) * (pt.y - means[1]);
    }
    stdDevs[0] = sqrt(stdDevs[0] / (n - 1));
    stdDevs[1] = sqrt(stdDevs[1] / (n - 1));

    // Get data for covariance calculation (may be standardized)
    displayData = getDisplayData();

    // Recalculate means for display data
    let dispMeans = [0, 0];
    for (let pt of displayData) {
        dispMeans[0] += pt.x;
        dispMeans[1] += pt.y;
    }
    dispMeans[0] /= n;
    dispMeans[1] /= n;

    // Calculate covariance matrix
    covarianceMatrix = [[0, 0], [0, 0]];
    for (let pt of displayData) {
        let dx = pt.x - dispMeans[0];
        let dy = pt.y - dispMeans[1];
        covarianceMatrix[0][0] += dx * dx;
        covarianceMatrix[0][1] += dx * dy;
        covarianceMatrix[1][0] += dx * dy;
        covarianceMatrix[1][1] += dy * dy;
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            covarianceMatrix[i][j] /= (n - 1);
        }
    }

    // Update max covariance value for color scale
    maxCovValue = max(abs(covarianceMatrix[0][0]), abs(covarianceMatrix[1][1]), abs(covarianceMatrix[0][1])) * 1.1;
    maxCovValue = max(maxCovValue, 0.1);

    // Calculate correlation matrix
    let sdX = sqrt(covarianceMatrix[0][0]);
    let sdY = sqrt(covarianceMatrix[1][1]);

    correlationMatrix = [[1, 0], [0, 1]];
    if (sdX > 0.0001 && sdY > 0.0001) {
        let corr = covarianceMatrix[0][1] / (sdX * sdY);
        corr = constrain(corr, -1, 1);
        correlationMatrix[0][1] = corr;
        correlationMatrix[1][0] = corr;
    }

    // Calculate eigenvalues of covariance matrix
    computeEigenvalues();
}

function computeEigenvalues() {
    // For 2x2 matrix: eigenvalues from characteristic polynomial
    let a = covarianceMatrix[0][0];
    let b = covarianceMatrix[0][1];
    let c = covarianceMatrix[1][0];
    let d = covarianceMatrix[1][1];

    let trace = a + d;
    let det = a * d - b * c;
    let discriminant = trace * trace - 4 * det;

    if (discriminant >= 0) {
        let sqrtD = sqrt(discriminant);
        eigenvalues = [(trace + sqrtD) / 2, (trace - sqrtD) / 2];
        eigenvalues.sort((x, y) => y - x); // Descending order
    } else {
        eigenvalues = [trace / 2, trace / 2];
    }

    // Compute eigenvectors
    eigenvectors = [];
    for (let lambda of eigenvalues) {
        let ev;
        if (abs(b) > 0.0001) {
            ev = [b, lambda - a];
        } else if (abs(a - lambda) > 0.0001) {
            ev = [0, 1];
        } else {
            ev = [1, 0];
        }
        // Normalize
        let mag = sqrt(ev[0] * ev[0] + ev[1] * ev[1]);
        if (mag > 0.0001) {
            ev = [ev[0] / mag, ev[1] / mag];
        }
        eigenvectors.push(ev);
    }
}

function onDatasetChange() {
    let selected = datasetSelect.value();
    let corr = 0.6;

    if (selected === 'Positive Correlation') {
        corr = 0.6;
    } else if (selected === 'Negative Correlation') {
        corr = -0.6;
    } else if (selected === 'No Correlation') {
        corr = 0;
    } else if (selected === 'Strong Correlation') {
        corr = 0.9;
    }

    correlationSlider.value(corr);
    generateData(corr);
}

function onCorrelationChange() {
    generateData(correlationSlider.value());
}

function resetData() {
    let corr = correlationSlider.value();
    generateData(corr);
    highlightedCell = null;
}

function mousePressed() {
    // Check scatter plot for point dragging
    let panelGap = 15;
    let totalGap = margin * 2 + panelGap * 2;
    let panelWidth = (canvasWidth - totalGap) / 3;
    let panelTop = 35;
    let panelHeight = drawHeight - panelTop - 15;

    let plotMargin = 35;
    let plotLeft = margin + plotMargin;
    let plotRight = margin + panelWidth - 15;
    let plotTop = panelTop + 30;
    let plotBottom = panelTop + panelHeight - 25;

    // Find data range
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let displayData = getDisplayData();

    for (let pt of displayData) {
        xMin = min(xMin, pt.x);
        xMax = max(xMax, pt.x);
        yMin = min(yMin, pt.y);
        yMax = max(yMax, pt.y);
    }

    let xPad = (xMax - xMin) * 0.1 || 1;
    let yPad = (yMax - yMin) * 0.1 || 1;
    xMin -= xPad;
    xMax += xPad;
    yMin -= yPad;
    yMax += yPad;

    // Check if clicking on a data point
    for (let i = 0; i < displayData.length; i++) {
        let pt = displayData[i];
        let x = map(pt.x, xMin, xMax, plotLeft, plotRight);
        let y = map(pt.y, yMin, yMax, plotBottom, plotTop);

        if (dist(mouseX, mouseY, x, y) < 10) {
            draggedPoint = i;
            return;
        }
    }

    // Check covariance matrix cells
    checkMatrixClick(margin + panelWidth + panelGap, panelTop, panelWidth, panelHeight, 'cov');

    // Check correlation matrix cells
    checkMatrixClick(margin + 2 * (panelWidth + panelGap), panelTop, panelWidth, panelHeight, 'corr');
}

function checkMatrixClick(px, py, pw, ph, type) {
    let matrixSize = min(pw - 80, ph - 120);
    let cellSize = matrixSize / numFeatures;
    let matrixX = px + (pw - matrixSize) / 2;
    let matrixY = py + 35;

    for (let i = 0; i < numFeatures; i++) {
        for (let j = 0; j < numFeatures; j++) {
            let cx = matrixX + j * cellSize;
            let cy = matrixY + i * cellSize;

            if (mouseX >= cx && mouseX <= cx + cellSize && mouseY >= cy && mouseY <= cy + cellSize) {
                if (highlightedCell && highlightedCell.i === i && highlightedCell.j === j && highlightedCell.type === type) {
                    highlightedCell = null;
                } else {
                    highlightedCell = { i: i, j: j, type: type };
                }
                return;
            }
        }
    }
}

function mouseDragged() {
    if (draggedPoint >= 0 && !standardizeCheckbox.checked()) {
        let panelGap = 15;
        let totalGap = margin * 2 + panelGap * 2;
        let panelWidth = (canvasWidth - totalGap) / 3;
        let panelTop = 35;
        let panelHeight = drawHeight - panelTop - 15;

        let plotMargin = 35;
        let plotLeft = margin + plotMargin;
        let plotRight = margin + panelWidth - 15;
        let plotTop = panelTop + 30;
        let plotBottom = panelTop + panelHeight - 25;

        // Find data range
        let xMin = Infinity, xMax = -Infinity;
        let yMin = Infinity, yMax = -Infinity;

        for (let pt of dataPoints) {
            xMin = min(xMin, pt.x);
            xMax = max(xMax, pt.x);
            yMin = min(yMin, pt.y);
            yMax = max(yMax, pt.y);
        }

        let xPad = (xMax - xMin) * 0.1 || 1;
        let yPad = (yMax - yMin) * 0.1 || 1;
        xMin -= xPad;
        xMax += xPad;
        yMin -= yPad;
        yMax += yPad;

        // Map mouse position to data coordinates
        let newX = map(mouseX, plotLeft, plotRight, xMin, xMax);
        let newY = map(mouseY, plotBottom, plotTop, yMin, yMax);

        dataPoints[draggedPoint].x = newX;
        dataPoints[draggedPoint].y = newY;

        updateStatistics();
    }
}

function mouseReleased() {
    draggedPoint = -1;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition controls
    resetButton.position(canvasWidth - 70, drawHeight + 12);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = max(700, floor(container.offsetWidth));
    }
}
