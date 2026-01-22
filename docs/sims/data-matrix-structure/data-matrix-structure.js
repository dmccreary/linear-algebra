// Data Matrix Structure Visualizer MicroSim
// Visualize the structure of data matrices and understand the relationship
// between rows (samples) and columns (features)

// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 500;
let controlHeight = 30;
let canvasHeight = drawHeight + controlHeight;

let margin = 15;
let defaultTextSize = 14;

// Example datasets
const datasets = {
  iris: {
    name: "Iris Dataset",
    samples: 8,  // Show subset for visualization
    features: 4,
    featureNames: ["Sepal L", "Sepal W", "Petal L", "Petal W"],
    sampleNames: null,  // Will use "Sample 1", etc.
    data: [
      [5.1, 3.5, 1.4, 0.2],
      [4.9, 3.0, 1.4, 0.2],
      [7.0, 3.2, 4.7, 1.4],
      [6.4, 3.2, 4.5, 1.5],
      [6.3, 3.3, 6.0, 2.5],
      [5.8, 2.7, 5.1, 1.9],
      [4.6, 3.1, 1.5, 0.2],
      [5.0, 3.6, 1.4, 0.2]
    ],
    fullSamples: 150,
    fullFeatures: 4,
    description: "150 samples, 4 features (petal/sepal dimensions)"
  },
  mnist: {
    name: "MNIST Digit",
    samples: 1,
    features: 16,  // Show 4x4 subset for visualization (actual is 784)
    featureNames: null,  // Will use "Pixel 1", etc.
    sampleNames: ["Digit '5'"],
    data: [
      [0, 0.2, 0.8, 0.9, 0.9, 0.7, 0.1, 0, 0.1, 0.6, 0.9, 0.8, 0.2, 0, 0.5, 0.9]
    ],
    fullSamples: 1,
    fullFeatures: 784,
    description: "1 sample, 784 features (28x28 pixel values)"
  },
  housing: {
    name: "Housing Dataset",
    samples: 6,
    features: 5,
    featureNames: ["CRIM", "RM", "AGE", "DIS", "MEDV"],
    sampleNames: null,
    data: [
      [0.006, 6.58, 65.2, 4.09, 24.0],
      [0.027, 6.42, 78.9, 4.97, 21.6],
      [0.027, 7.19, 61.1, 4.97, 34.7],
      [0.032, 6.00, 45.8, 6.06, 33.4],
      [0.069, 7.15, 54.2, 6.06, 36.2],
      [0.030, 6.43, 58.7, 6.06, 28.7]
    ],
    fullSamples: 506,
    fullFeatures: 13,
    description: "506 samples, 13 features"
  },
  custom: {
    name: "Generic Matrix",
    samples: 6,
    features: 5,
    featureNames: null,
    sampleNames: null,
    data: null,  // Will be generated
    fullSamples: "n",
    fullFeatures: "d",
    description: "n samples, d features"
  }
};

// State
let currentDataset = 'iris';
let highlightedRow = -1;
let highlightedCol = -1;
let hoveredRow = -1;
let hoveredCol = -1;
let matrixData = [];

// UI elements
let datasetSelect;

// Matrix display parameters
let cellWidth, cellHeight;
let matrixX, matrixY;
let maxMatrixWidth, maxMatrixHeight;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const container = document.querySelector('main');
  canvas.parent(container);

  textSize(defaultTextSize);

  // Create dataset selector
  datasetSelect = createSelect();
  datasetSelect.option('Iris Dataset', 'iris');
  datasetSelect.option('MNIST Digit', 'mnist');
  datasetSelect.option('Housing Dataset', 'housing');
  datasetSelect.option('Generic Matrix', 'custom');
  datasetSelect.selected('iris');
  datasetSelect.parent(container);
  datasetSelect.position(100, drawHeight + 12);
  datasetSelect.changed(onDatasetChange);

  // Generate custom dataset
  generateCustomData();

  // Initialize with first dataset
  loadDataset();

  describe('Interactive data matrix visualizer showing rows as samples and columns as features with heat map coloring and click-to-highlight functionality.', LABEL);
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
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  let ds = datasets[currentDataset];
  text('Data Matrix Structure: ' + ds.name, canvasWidth / 2, 10);

  // Subtitle with dimensions
  textSize(12);
  fill('#666');
  text(ds.description, canvasWidth / 2, 32);

  // Calculate matrix layout
  calculateMatrixLayout();

  // Draw the matrix
  drawMatrix();

  // Draw dimension annotations
  drawDimensionAnnotations();

  // Draw legend
  drawLegend();

  // Draw info panel
  drawInfoPanel();

  // Control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Dataset:', 20, drawHeight + 25);
}

function calculateMatrixLayout() {
  let ds = datasets[currentDataset];
  let rows = ds.samples;
  let cols = ds.features;

  // Calculate available space
  let leftMargin = 80;  // Space for row labels
  let rightMargin = 60; // Space for dimension annotation
  let topMargin = 100;   // Space for column labels
  let bottomMargin = 90; // Space for info panel

  maxMatrixWidth = canvasWidth - leftMargin - rightMargin;
  maxMatrixHeight = drawHeight - topMargin - bottomMargin;

  // Calculate cell size (keep aspect ratio reasonable)
  cellWidth = Math.min(50, maxMatrixWidth / cols);
  cellHeight = Math.min(35, maxMatrixHeight / rows);

  // Ensure minimum size
  cellWidth = Math.max(30, cellWidth);
  cellHeight = Math.max(25, cellHeight);

  // Center the matrix
  let matrixWidth = cellWidth * cols;
  let matrixHeight = cellHeight * rows;
  matrixX = leftMargin + (maxMatrixWidth - matrixWidth) / 2;
  matrixY = topMargin;
}

function drawMatrix() {
  let ds = datasets[currentDataset];
  let rows = ds.samples;
  let cols = ds.features;

  // Find min/max for heat map coloring
  let minVal = Infinity, maxVal = -Infinity;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let val = matrixData[i][j];
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
  }
  let range = maxVal - minVal || 1;

  // Draw column labels (features)
  noStroke();
  textSize(11);
  textAlign(CENTER, BOTTOM);
  for (let j = 0; j < cols; j++) {
    let x = matrixX + j * cellWidth + cellWidth / 2;
    let y = matrixY - 35;

    push();
    translate(x, y);
    rotate(-PI / 4);

    if (j === highlightedCol) {
      fill('#e65100');
      textStyle(BOLD);
    } else {
      fill('#333');
      textStyle(NORMAL);
    }

    let label = ds.featureNames ? ds.featureNames[j] : 'Feature ' + (j + 1);
    text(label, 0, 0);
    pop();
  }

  // Draw row labels (samples)
  noStroke();
  textSize(11);
  textAlign(RIGHT, CENTER);
  textStyle(NORMAL);
  for (let i = 0; i < rows; i++) {
    let x = matrixX - 8;
    let y = matrixY + i * cellHeight + cellHeight / 2;

    if (i === highlightedRow) {
      fill('#1565c0');
      textStyle(BOLD);
    } else {
      fill('#333');
      textStyle(NORMAL);
    }

    let label = ds.sampleNames ? ds.sampleNames[i] : 'Sample ' + (i + 1);
    text(label, x, y);
  }

  // Draw cells
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = matrixX + j * cellWidth;
      let y = matrixY + i * cellHeight;
      let val = matrixData[i][j];

      // Heat map color
      let normalized = (val - minVal) / range;
      let heatColor = getHeatColor(normalized);

      // Determine cell state
      let isHighlightedRow = (i === highlightedRow);
      let isHighlightedCol = (j === highlightedCol);
      let isHovered = (i === hoveredRow && j === hoveredCol);
      let isIntersection = isHighlightedRow && isHighlightedCol;

      // Draw cell background
      if (isIntersection) {
        fill('#ffcc80');
        stroke('#e65100');
        strokeWeight(3);
      } else if (isHighlightedRow) {
        fill(lerpColor(color(heatColor), color('#bbdefb'), 0.5));
        stroke('#1565c0');
        strokeWeight(2);
      } else if (isHighlightedCol) {
        fill(lerpColor(color(heatColor), color('#ffe0b2'), 0.5));
        stroke('#e65100');
        strokeWeight(2);
      } else if (isHovered) {
        fill('#fff59d');
        stroke('#fbc02d');
        strokeWeight(2);
      } else {
        fill(heatColor);
        stroke('#ccc');
        strokeWeight(1);
      }
      rect(x, y, cellWidth, cellHeight);

      // Draw cell value
      fill(normalized > 0.6 ? 'white' : 'black');
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(10);
      textStyle(NORMAL);
      let displayVal = formatValue(val);
      text(displayVal, x + cellWidth / 2, y + cellHeight / 2);
    }
  }

  // Draw matrix brackets
  drawBrackets(matrixX - 5, matrixY - 5, cellWidth * cols + 10, cellHeight * rows + 10);
}

function drawBrackets(x, y, w, h) {
  stroke('#333');
  strokeWeight(2);
  noFill();

  let bracketSize = 10;

  // Left bracket
  line(x + bracketSize, y, x, y);
  line(x, y, x, y + h);
  line(x, y + h, x + bracketSize, y + h);

  // Right bracket
  line(x + w - bracketSize, y, x + w, y);
  line(x + w, y, x + w, y + h);
  line(x + w, y + h, x + w - bracketSize, y + h);
}

function drawDimensionAnnotations() {
  let ds = datasets[currentDataset];
  let rows = ds.samples;
  let cols = ds.features;

  let matrixWidth = cellWidth * cols;
  let matrixHeight = cellHeight * rows;

  textSize(14);
  textStyle(BOLD);
  noStroke();

  // Draw n (rows) annotation
  fill('#1565c0');
  textAlign(LEFT, CENTER);
  let nX = matrixX + matrixWidth + 20;
  let nY = matrixY + matrixHeight / 2;
  text('n = ' + ds.fullSamples, nX, nY);

  // Draw arrow pointing to rows
  stroke('#1565c0');
  strokeWeight(1.5);
  line(nX - 5, nY, nX - 15, nY - 10);
  line(nX - 5, nY, nX - 15, nY + 10);

  // Draw d (columns) annotation
  noStroke();
  fill('#e65100');
  textAlign(CENTER, TOP);
  let dX = matrixX + matrixWidth / 2;
  let dY = matrixY + matrixHeight + 15;
  text('d = ' + ds.fullFeatures, dX, dY);

  // Draw "rows = samples" label
  textSize(11);
  textStyle(NORMAL);
  fill('#1565c0');
  textAlign(LEFT, CENTER);
  text('(samples)', nX, nY + 18);

  // Draw "columns = features" label
  fill('#e65100');
  textAlign(CENTER, TOP);
  text('(features)', dX, dY + 16);

  textStyle(NORMAL);
}

function drawLegend() {
  let legendX = canvasWidth - 100;
  let legendY = 55;
  let legendWidth = 20;
  let legendHeight = 80;

  // Legend title
  fill('#333');
  noStroke();
  textSize(10);
  textAlign(CENTER, BOTTOM);
  text('Value', legendX + legendWidth / 2, legendY - 3);

  // Draw gradient bar
  for (let i = 0; i < legendHeight; i++) {
    let normalized = 1 - i / legendHeight;
    let c = getHeatColor(normalized);
    stroke(c);
    line(legendX, legendY + i, legendX + legendWidth, legendY + i);
  }

  // Legend border
  noFill();
  stroke('#999');
  strokeWeight(1);
  rect(legendX, legendY, legendWidth, legendHeight);

  // Legend labels
  fill('#333');
  noStroke();
  textSize(9);
  textAlign(LEFT, CENTER);
  text('High', legendX + legendWidth + 5, legendY + 5);
  text('Low', legendX + legendWidth + 5, legendY + legendHeight - 5);
}

function drawInfoPanel() {
  let ds = datasets[currentDataset];
  let panelY = matrixY + cellHeight * ds.samples + 45;

  // Info box background
  fill('#f5f5f5');
  stroke('#ddd');
  strokeWeight(1);
  rect(20, panelY, canvasWidth - 40, 65, 5);

  fill('#333');
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);

  if (highlightedRow >= 0 && highlightedCol >= 0) {
    // Show intersection info
    let featureName = ds.featureNames ? ds.featureNames[highlightedCol] : 'Feature ' + (highlightedCol + 1);
    let sampleName = ds.sampleNames ? ds.sampleNames[highlightedRow] : 'Sample ' + (highlightedRow + 1);
    let val = matrixData[highlightedRow][highlightedCol];

    textStyle(BOLD);
    text('Selected Cell:', 30, panelY + 8);
    textStyle(NORMAL);
    text(sampleName + ', ' + featureName + ' = ' + formatValue(val, 4), 30, panelY + 25);
    text('This is the value of ' + featureName.toLowerCase() + ' for ' + sampleName.toLowerCase(), 30, panelY + 42);
  } else if (highlightedRow >= 0) {
    // Show feature vector info
    let sampleName = ds.sampleNames ? ds.sampleNames[highlightedRow] : 'Sample ' + (highlightedRow + 1);
    textStyle(BOLD);
    fill('#1565c0');
    text('Feature Vector (Row ' + (highlightedRow + 1) + '):', 30, panelY + 8);
    textStyle(NORMAL);
    fill('#333');
    text('x = [' + matrixData[highlightedRow].map(v => formatValue(v)).join(', ') + ']', 30, panelY + 25);
    text('Each row represents one sample with all its feature values', 30, panelY + 42);
  } else if (highlightedCol >= 0) {
    // Show feature column info
    let featureName = ds.featureNames ? ds.featureNames[highlightedCol] : 'Feature ' + (highlightedCol + 1);
    let colValues = [];
    for (let i = 0; i < ds.samples; i++) {
      colValues.push(matrixData[i][highlightedCol]);
    }
    textStyle(BOLD);
    fill('#e65100');
    text('Feature Column (' + featureName + '):', 30, panelY + 8);
    textStyle(NORMAL);
    fill('#333');
    text('Values: [' + colValues.map(v => formatValue(v)).join(', ') + ']', 30, panelY + 25);
    text('Each column represents one feature across all samples', 30, panelY + 42);
  } else if (hoveredRow >= 0 && hoveredCol >= 0) {
    // Show hover info
    let featureName = ds.featureNames ? ds.featureNames[hoveredCol] : 'Feature ' + (hoveredCol + 1);
    let sampleName = ds.sampleNames ? ds.sampleNames[hoveredRow] : 'Sample ' + (hoveredRow + 1);
    let val = matrixData[hoveredRow][hoveredCol];

    textStyle(NORMAL);
    text('Hovering: ' + sampleName + ', ' + featureName + ' = ' + formatValue(val, 4), 30, panelY + 8);
    fill('#666');
    text('Click a row to highlight as feature vector', 30, panelY + 25);
    text('Click a column header to highlight as feature across samples', 30, panelY + 42);
  } else {
    // Show default instructions
    fill('#666');
    text('Click a row to highlight it as a feature vector (sample representation)', 30, panelY + 8);
    text('Click a column header to see one feature across all samples', 30, panelY + 25);
    text('Hover over any cell to see its value', 30, panelY + 42);
  }
}

function getHeatColor(normalized) {
  // Blue to white to orange heat map
  if (normalized < 0.5) {
    let t = normalized * 2;
    return lerpColor(color(66, 133, 244), color(255, 255, 255), t);
  } else {
    let t = (normalized - 0.5) * 2;
    return lerpColor(color(255, 255, 255), color(230, 81, 0), t);
  }
}

function formatValue(val, precision = 2) {
  if (Number.isInteger(val)) return val.toString();
  if (Math.abs(val) < 0.01) return val.toExponential(1);
  return val.toFixed(precision);
}

function loadDataset() {
  let ds = datasets[currentDataset];
  matrixData = ds.data ? ds.data.map(row => [...row]) : generateCustomData();
  highlightedRow = -1;
  highlightedCol = -1;
}

function generateCustomData() {
  let data = [];
  for (let i = 0; i < 6; i++) {
    let row = [];
    for (let j = 0; j < 5; j++) {
      row.push(Math.round(Math.random() * 100) / 10);
    }
    data.push(row);
  }
  datasets.custom.data = data;
  return data;
}

function onDatasetChange() {
  currentDataset = datasetSelect.value();
  if (currentDataset === 'custom') {
    generateCustomData();
  }
  loadDataset();
}

function mousePressed() {
  let ds = datasets[currentDataset];
  let rows = ds.samples;
  let cols = ds.features;

  // Check if clicking in matrix area
  let mx = mouseX;
  let my = mouseY;

  // Check column header click (for feature highlighting)
  if (my >= matrixY - 40 && my < matrixY) {
    for (let j = 0; j < cols; j++) {
      let x1 = matrixX + j * cellWidth;
      let x2 = x1 + cellWidth;
      if (mx >= x1 && mx < x2) {
        if (highlightedCol === j) {
          highlightedCol = -1;  // Toggle off
        } else {
          highlightedCol = j;
          highlightedRow = -1;  // Clear row highlight when selecting column
        }
        return;
      }
    }
  }

  // Check row click (for feature vector highlighting)
  for (let i = 0; i < rows; i++) {
    let y1 = matrixY + i * cellHeight;
    let y2 = y1 + cellHeight;

    // Check row label area or first part of row
    if (my >= y1 && my < y2 && mx >= matrixX - 80 && mx < matrixX + cellWidth * cols) {
      if (highlightedRow === i) {
        highlightedRow = -1;  // Toggle off
      } else {
        highlightedRow = i;
        // Don't clear column highlight - allow intersection
      }
      return;
    }
  }

  // Click outside matrix clears highlights
  if (mx < matrixX - 80 || mx > matrixX + cellWidth * cols + 50 ||
      my < matrixY - 40 || my > matrixY + cellHeight * rows + 10) {
    highlightedRow = -1;
    highlightedCol = -1;
  }
}

function mouseMoved() {
  let ds = datasets[currentDataset];
  let rows = ds.samples;
  let cols = ds.features;

  hoveredRow = -1;
  hoveredCol = -1;

  // Check if hovering over a cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x1 = matrixX + j * cellWidth;
      let y1 = matrixY + i * cellHeight;
      let x2 = x1 + cellWidth;
      let y2 = y1 + cellHeight;

      if (mouseX >= x1 && mouseX < x2 && mouseY >= y1 && mouseY < y2) {
        hoveredRow = i;
        hoveredCol = j;
        return;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.max(400, Math.floor(container.width));
}
