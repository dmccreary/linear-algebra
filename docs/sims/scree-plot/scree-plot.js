// Scree Plot and Component Selection MicroSim
// Learn to use scree plots and cumulative variance to select optimal number of components
// Learning objective: Use scree plots and cumulative variance to select optimal number of principal components

let canvasWidth = 900;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Data
let numPoints = 100;
let dataPoints = [];
let eigenvalues = [];
let cumulativeVariance = [];
let totalVariance = 0;

// Dataset configurations
let datasets = {
  'synthetic': { name: 'Synthetic (elbow at k=3)', eigenPattern: 'elbow' },
  'gradual': { name: 'Gradual Decay', eigenPattern: 'gradual' },
  'uniform': { name: 'Uniform (no clear elbow)', eigenPattern: 'uniform' },
  'two_group': { name: 'Two Groups', eigenPattern: 'two_group' }
};

// Current settings
let currentDataset = 'synthetic';
let numComponents = 3;
let varianceThreshold = 0.95;
let showKaiserLine = true;
let showElbowPoint = true;
let showReconstructionError = false;

// Elbow detection
let elbowK = 3;
let kaiserK = 0;
let thresholdK = 0;

// Panel dimensions
let leftPanelWidth, rightPanelWidth, panelHeight;
let leftPanelX, rightPanelX, panelY;

// UI elements
let datasetSelect;
let componentsSlider;
let thresholdSlider;
let kaiserCheckbox, elbowCheckbox, reconstructionCheckbox;

// Dragging state for threshold line
let draggingThreshold = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Generate initial data
  generateDataset();

  // Create UI elements
  createUIElements();

  describe('Scree plot and cumulative variance visualization for PCA component selection', LABEL);
}

function createUIElements() {
  const container = document.querySelector('main');

  // Dataset selector
  datasetSelect = createSelect();
  datasetSelect.option('Synthetic (elbow at k=3)', 'synthetic');
  datasetSelect.option('Gradual Decay', 'gradual');
  datasetSelect.option('Uniform', 'uniform');
  datasetSelect.option('Two Groups', 'two_group');
  datasetSelect.position(10, drawHeight + 12);
  datasetSelect.changed(onDatasetChange);
  datasetSelect.parent(container);

  // Components slider
  componentsSlider = createSlider(1, 10, 3, 1);
  componentsSlider.position(270, drawHeight + 12);
  componentsSlider.size(100);
  componentsSlider.input(onComponentsChange);
  componentsSlider.parent(container);

  // Threshold slider
  thresholdSlider = createSlider(0.7, 0.99, 0.95, 0.01);
  thresholdSlider.position(510, drawHeight + 12);
  thresholdSlider.size(100);
  thresholdSlider.input(onThresholdChange);
  thresholdSlider.parent(container);

  // Checkboxes row 2
  kaiserCheckbox = createCheckbox('Kaiser Line', true);
  kaiserCheckbox.position(10, drawHeight + 48);
  kaiserCheckbox.style('font-size', '12px');
  kaiserCheckbox.changed(() => { showKaiserLine = kaiserCheckbox.checked(); });
  kaiserCheckbox.parent(container);

  elbowCheckbox = createCheckbox('Show Elbow', true);
  elbowCheckbox.position(120, drawHeight + 48);
  elbowCheckbox.style('font-size', '12px');
  elbowCheckbox.changed(() => { showElbowPoint = elbowCheckbox.checked(); });
  elbowCheckbox.parent(container);

  reconstructionCheckbox = createCheckbox('Show Reconstruction Error', false);
  reconstructionCheckbox.position(230, drawHeight + 48);
  reconstructionCheckbox.style('font-size', '12px');
  reconstructionCheckbox.changed(() => { showReconstructionError = reconstructionCheckbox.checked(); });
  reconstructionCheckbox.parent(container);
}

function draw() {
  updateCanvasSize();

  background(245);

  // Calculate panel dimensions
  leftPanelWidth = (canvasWidth - 60) / 2;
  rightPanelWidth = (canvasWidth - 60) / 2;
  panelHeight = drawHeight - 80;
  leftPanelX = 20;
  rightPanelX = leftPanelX + leftPanelWidth + 20;
  panelY = 50;

  // Title
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text('Scree Plot and Component Selection', canvasWidth / 2, 10);

  // Draw panels
  drawScreePlot(leftPanelX, panelY, leftPanelWidth, panelHeight);
  drawCumulativeVariance(rightPanelX, panelY, rightPanelWidth, panelHeight);

  // Draw control area
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Draw control labels
  drawControlLabels();

  // Draw summary info
  drawSummary();
}

function drawScreePlot(x, y, w, h) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(0);
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('Scree Plot (Eigenvalues)', x + w / 2, y + 8);

  // Plot area
  let plotX = x + 50;
  let plotY = y + 35;
  let plotW = w - 70;
  let plotH = h - 65;

  // Axes
  stroke(100);
  strokeWeight(1);
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH); // x-axis
  line(plotX, plotY, plotX, plotY + plotH); // y-axis

  // Axis labels
  fill(80);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Component Number', plotX + plotW / 2, plotY + plotH + 18);

  push();
  translate(x + 15, plotY + plotH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('Eigenvalue', 0, 0);
  pop();

  // Draw bars
  let numEig = eigenvalues.length;
  let barWidth = plotW / (numEig + 1);
  let maxEig = Math.max(...eigenvalues, 1);

  // Kaiser criterion line (eigenvalue = 1 for standardized data)
  if (showKaiserLine) {
    let kaiserY = plotY + plotH - (1 / maxEig) * plotH;
    stroke(200, 100, 100);
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(plotX, kaiserY, plotX + plotW, kaiserY);
    drawingContext.setLineDash([]);

    // Label
    fill(200, 100, 100);
    noStroke();
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text('Kaiser (=1)', plotX + plotW - 50, kaiserY - 3);
  }

  // Draw bars
  for (let i = 0; i < numEig; i++) {
    let barH = (eigenvalues[i] / maxEig) * plotH;
    let barX = plotX + (i + 0.5) * barWidth;
    let barY = plotY + plotH - barH;

    // Color based on selection
    if (i < numComponents) {
      fill(70, 130, 200); // Selected
    } else {
      fill(180, 180, 180); // Not selected
    }

    noStroke();
    rect(barX, barY, barWidth * 0.7, barH, 2);

    // Tick label
    fill(80);
    textSize(9);
    textAlign(CENTER, TOP);
    text(i + 1, barX + barWidth * 0.35, plotY + plotH + 3);
  }

  // Draw elbow point
  if (showElbowPoint && elbowK > 0 && elbowK <= numEig) {
    let elbowX = plotX + (elbowK - 0.5) * barWidth + barWidth * 0.35;
    let elbowY = plotY + plotH - (eigenvalues[elbowK - 1] / maxEig) * plotH;

    // Circle highlight
    stroke(255, 150, 50);
    strokeWeight(3);
    noFill();
    ellipse(elbowX, elbowY - 10, 30, 30);

    // Label
    fill(255, 150, 50);
    noStroke();
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text('Elbow', elbowX, elbowY - 25);
  }

  // Draw connecting line for scree
  stroke(100, 150, 200);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < numEig; i++) {
    let px = plotX + (i + 0.5) * barWidth + barWidth * 0.35;
    let py = plotY + plotH - (eigenvalues[i] / maxEig) * plotH;
    vertex(px, py);
  }
  endShape();

  // Y-axis ticks
  fill(80);
  noStroke();
  textSize(9);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= maxEig; v += maxEig / 4) {
    let tickY = plotY + plotH - (v / maxEig) * plotH;
    text(v.toFixed(1), plotX - 5, tickY);
    stroke(220);
    strokeWeight(1);
    line(plotX, tickY, plotX + plotW, tickY);
    noStroke();
  }
}

function drawCumulativeVariance(x, y, w, h) {
  // Panel background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Title
  fill(0);
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('Cumulative Variance Explained', x + w / 2, y + 8);

  // Plot area
  let plotX = x + 50;
  let plotY = y + 35;
  let plotW = w - 70;
  let plotH = h - 65;

  // Axes
  stroke(100);
  strokeWeight(1);
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH); // x-axis
  line(plotX, plotY, plotX, plotY + plotH); // y-axis

  // Axis labels
  fill(80);
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  text('Number of Components', plotX + plotW / 2, plotY + plotH + 18);

  push();
  translate(x + 15, plotY + plotH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('Cumulative Variance', 0, 0);
  pop();

  // Threshold line (draggable)
  let thresholdY = plotY + plotH - varianceThreshold * plotH;

  stroke(50, 180, 50);
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  line(plotX, thresholdY, plotX + plotW, thresholdY);
  drawingContext.setLineDash([]);

  // Threshold label
  fill(50, 180, 50);
  noStroke();
  textSize(10);
  textAlign(RIGHT, BOTTOM);
  text((varianceThreshold * 100).toFixed(0) + '%', plotX + plotW, thresholdY - 3);

  // Draggable indicator
  fill(50, 180, 50);
  stroke(255);
  strokeWeight(1);
  ellipse(plotX + plotW + 10, thresholdY, 12, 12);

  // Draw cumulative variance line
  let numEig = cumulativeVariance.length;
  let stepW = plotW / numEig;

  // Fill area under curve up to selected k
  fill(70, 130, 200, 50);
  noStroke();
  beginShape();
  vertex(plotX, plotY + plotH);
  for (let i = 0; i < numComponents && i < numEig; i++) {
    let px = plotX + (i + 1) * stepW;
    let py = plotY + plotH - cumulativeVariance[i] * plotH;
    vertex(px, py);
  }
  vertex(plotX + numComponents * stepW, plotY + plotH);
  endShape(CLOSE);

  // Draw line
  stroke(70, 130, 200);
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(plotX, plotY + plotH);
  for (let i = 0; i < numEig; i++) {
    let px = plotX + (i + 1) * stepW;
    let py = plotY + plotH - cumulativeVariance[i] * plotH;
    vertex(px, py);
  }
  endShape();

  // Draw points
  for (let i = 0; i < numEig; i++) {
    let px = plotX + (i + 1) * stepW;
    let py = plotY + plotH - cumulativeVariance[i] * plotH;

    if (i < numComponents) {
      fill(70, 130, 200);
    } else {
      fill(180, 180, 180);
    }
    noStroke();
    ellipse(px, py, 8, 8);
  }

  // Highlight threshold crossing point
  if (thresholdK > 0 && thresholdK <= numEig) {
    let threshX = plotX + thresholdK * stepW;
    let threshY = plotY + plotH - cumulativeVariance[thresholdK - 1] * plotH;

    stroke(50, 180, 50);
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    line(threshX, threshY, threshX, plotY + plotH);
    drawingContext.setLineDash([]);

    fill(50, 180, 50);
    noStroke();
    ellipse(threshX, threshY, 12, 12);

    textSize(10);
    textAlign(CENTER, TOP);
    text('k=' + thresholdK, threshX, plotY + plotH + 3);
  }

  // X-axis ticks
  fill(80);
  noStroke();
  textSize(9);
  textAlign(CENTER, TOP);
  for (let i = 1; i <= numEig; i++) {
    let tickX = plotX + i * stepW;
    text(i, tickX, plotY + plotH + 3);
  }

  // Y-axis ticks
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 1; v += 0.25) {
    let tickY = plotY + plotH - v * plotH;
    text((v * 100).toFixed(0) + '%', plotX - 5, tickY);
    stroke(220);
    strokeWeight(1);
    line(plotX, tickY, plotX + plotW, tickY);
    noStroke();
  }

  // Reconstruction error display
  if (showReconstructionError) {
    drawReconstructionInfo(x + 10, y + h - 60, w - 20);
  }
}

function drawReconstructionInfo(x, y, w) {
  fill(255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, 50, 3);

  let varExplained = numComponents > 0 ? cumulativeVariance[numComponents - 1] : 0;
  let reconstructionError = 1 - varExplained;

  fill(0);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text('Reconstruction with k=' + numComponents + ' components:', x + 10, y + 8);

  // Draw bar showing variance explained vs error
  let barX = x + 10;
  let barY = y + 28;
  let barW = w - 20;
  let barH = 15;

  fill(70, 130, 200);
  noStroke();
  rect(barX, barY, barW * varExplained, barH, 2);

  fill(255, 100, 100);
  rect(barX + barW * varExplained, barY, barW * reconstructionError, barH, 2);

  // Labels
  fill(255);
  textSize(9);
  textAlign(CENTER, CENTER);
  if (varExplained > 0.15) {
    text((varExplained * 100).toFixed(1) + '% kept', barX + barW * varExplained / 2, barY + barH / 2);
  }
  if (reconstructionError > 0.1) {
    fill(255);
    text((reconstructionError * 100).toFixed(1) + '% lost', barX + barW * varExplained + barW * reconstructionError / 2, barY + barH / 2);
  }
}

function drawControlLabels() {
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);

  text('Dataset:', 85, drawHeight + 22);
  text('Components (k):', 190, drawHeight + 22);
  text(numComponents, 375, drawHeight + 22);
  text('Variance Target:', 420, drawHeight + 22);
  text((varianceThreshold * 100).toFixed(0) + '%', 615, drawHeight + 22);
}

function drawSummary() {
  let summaryX = canvasWidth - 250;
  let summaryY = drawHeight + 8;

  fill(240, 248, 255);
  stroke(200);
  strokeWeight(1);
  rect(summaryX, summaryY, 240, 65, 5);

  fill(0);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text('Suggested k values:', summaryX + 10, summaryY + 5);

  textSize(10);
  fill(255, 150, 50);
  text('Elbow method: k = ' + elbowK, summaryX + 10, summaryY + 22);

  fill(50, 180, 50);
  text('Variance ' + (varianceThreshold * 100).toFixed(0) + '%: k = ' + thresholdK, summaryX + 10, summaryY + 36);

  fill(200, 100, 100);
  text('Kaiser criterion: k = ' + kaiserK, summaryX + 10, summaryY + 50);
}

function generateDataset() {
  let pattern = datasets[currentDataset].eigenPattern;
  eigenvalues = [];

  // Generate eigenvalues based on pattern
  if (pattern === 'elbow') {
    // Clear elbow at k=3
    eigenvalues = [4.5, 3.2, 2.1, 0.5, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05];
    elbowK = 3;
  } else if (pattern === 'gradual') {
    // Gradual decay, no clear elbow
    for (let i = 0; i < 10; i++) {
      eigenvalues.push(3 * Math.exp(-0.3 * i));
    }
    elbowK = 4;
  } else if (pattern === 'uniform') {
    // Nearly uniform, no clear structure
    for (let i = 0; i < 10; i++) {
      eigenvalues.push(1.2 - 0.05 * i + (Math.random() - 0.5) * 0.1);
    }
    elbowK = 0; // No clear elbow
  } else if (pattern === 'two_group') {
    // Two groups of eigenvalues
    eigenvalues = [4.2, 3.8, 3.5, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];
    elbowK = 3;
  }

  // Ensure eigenvalues are sorted descending
  eigenvalues.sort((a, b) => b - a);

  // Compute statistics
  computeStatistics();

  // Update slider max
  if (componentsSlider) {
    componentsSlider.attribute('max', eigenvalues.length);
    numComponents = Math.min(numComponents, eigenvalues.length);
  }
}

function computeStatistics() {
  // Total variance
  totalVariance = eigenvalues.reduce((sum, e) => sum + e, 0);

  // Cumulative variance
  cumulativeVariance = [];
  let cumSum = 0;
  for (let e of eigenvalues) {
    cumSum += e;
    cumulativeVariance.push(cumSum / totalVariance);
  }

  // Find k for variance threshold
  thresholdK = eigenvalues.length;
  for (let i = 0; i < cumulativeVariance.length; i++) {
    if (cumulativeVariance[i] >= varianceThreshold) {
      thresholdK = i + 1;
      break;
    }
  }

  // Find k for Kaiser criterion (eigenvalue > 1)
  kaiserK = 0;
  for (let i = 0; i < eigenvalues.length; i++) {
    if (eigenvalues[i] >= 1) {
      kaiserK = i + 1;
    } else {
      break;
    }
  }

  // Detect elbow using second derivative
  detectElbow();
}

function detectElbow() {
  if (eigenvalues.length < 3) {
    elbowK = 1;
    return;
  }

  // Compute second differences (discrete second derivative)
  let secondDiff = [];
  for (let i = 1; i < eigenvalues.length - 1; i++) {
    let d2 = eigenvalues[i - 1] - 2 * eigenvalues[i] + eigenvalues[i + 1];
    secondDiff.push({ idx: i, val: d2 });
  }

  // Find maximum second difference (most negative curvature = elbow)
  let maxDiff = -Infinity;
  let maxIdx = 1;
  for (let item of secondDiff) {
    if (item.val > maxDiff) {
      maxDiff = item.val;
      maxIdx = item.idx;
    }
  }

  elbowK = maxIdx + 1;
}

function onDatasetChange() {
  currentDataset = datasetSelect.value();
  generateDataset();
}

function onComponentsChange() {
  numComponents = componentsSlider.value();
}

function onThresholdChange() {
  varianceThreshold = thresholdSlider.value();
  computeStatistics();
}

function mousePressed() {
  // Check if clicking on threshold drag handle
  let plotX = rightPanelX + 50;
  let plotY = panelY + 35;
  let plotW = rightPanelWidth - 70;
  let plotH = panelHeight - 65;

  let thresholdY = plotY + plotH - varianceThreshold * plotH;
  let handleX = plotX + plotW + 10;

  if (dist(mouseX, mouseY, handleX, thresholdY) < 15) {
    draggingThreshold = true;
  }
}

function mouseDragged() {
  if (draggingThreshold) {
    let plotY = panelY + 35;
    let plotH = panelHeight - 65;

    let newThreshold = 1 - (mouseY - plotY) / plotH;
    varianceThreshold = constrain(newThreshold, 0.7, 0.99);
    thresholdSlider.value(varianceThreshold);
    computeStatistics();
  }
}

function mouseReleased() {
  draggingThreshold = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(700, Math.floor(container.offsetWidth));
  }
}
