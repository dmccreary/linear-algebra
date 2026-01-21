// Four Fundamental Subspaces Visualizer
// Shows Row Space, Column Space, Null Space, and Left Null Space
// Demonstrates orthogonality relationships and the Fundamental Theorem of Linear Algebra
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;

// Layout
let margin = 15;
let defaultTextSize = 14;

// Matrix data (m x n) - default 3x4 rank 2
let m = 3;  // rows
let n = 4;  // columns
let matrix = [
  [1, 2, 1, 0],
  [2, 4, 0, 2],
  [3, 6, 1, 2]
];

// Computed subspace data
let rowSpaceBasis = [];
let colSpaceBasis = [];
let nullSpaceBasis = [];
let leftNullSpaceBasis = [];
let rank = 0;

// UI controls
let computeButton;
let showBasisCheckbox;
let showOrthogCheckbox;
let highlightSlider;
let matrixInputs = [];

// Animation
let animTime = 0;
let showAnimation = false;

// Colors for subspaces
let rowSpaceColor, colSpaceColor, nullSpaceColor, leftNullColor;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Define colors
  rowSpaceColor = color(66, 133, 244);      // Blue
  colSpaceColor = color(219, 68, 55);       // Red
  nullSpaceColor = color(244, 180, 0);      // Yellow/Gold
  leftNullColor = color(15, 157, 88);       // Green

  // Create matrix input fields (4x4 grid, we'll use what we need)
  createMatrixInputs();

  // Compute button
  computeButton = createButton('Compute Subspaces');
  computeButton.position(10, drawHeight + 75);
  computeButton.mousePressed(computeSubspaces);
  computeButton.style('font-size', '14px');

  // Checkboxes
  showBasisCheckbox = createCheckbox('Show Basis Vectors', true);
  showBasisCheckbox.position(160, drawHeight + 75);
  showBasisCheckbox.style('font-size', '13px');

  showOrthogCheckbox = createCheckbox('Verify Orthogonality', false);
  showOrthogCheckbox.position(310, drawHeight + 75);
  showOrthogCheckbox.style('font-size', '13px');

  // Highlight slider
  let sliderLabel = createDiv('Highlight:');
  sliderLabel.position(460, drawHeight + 76);
  sliderLabel.style('font-size', '13px');

  highlightSlider = createSlider(0, 4, 0, 1);
  highlightSlider.position(525, drawHeight + 75);
  highlightSlider.style('width', '100px');

  // Initial computation
  computeSubspaces();

  describe('Four fundamental subspaces visualizer showing row space, column space, null space, and left null space with their orthogonal relationships', LABEL);
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

  // Animation time
  animTime += 0.02;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Four Fundamental Subspaces', canvasWidth / 2, 8);

  // Layout: Two panels side by side
  let panelWidth = (canvasWidth - 60) / 2;
  let leftPanelX = 30;
  let rightPanelX = canvasWidth / 2 + 15;
  let panelY = 50;
  let panelHeight = drawHeight - 80;

  // Draw domain panel (R^n)
  drawDomainPanel(leftPanelX, panelY, panelWidth, panelHeight);

  // Draw codomain panel (R^m)
  drawCodomainPanel(rightPanelX, panelY, panelWidth, panelHeight);

  // Draw transformation arrows between panels
  drawTransformationArrows(leftPanelX + panelWidth, rightPanelX, panelY, panelHeight);

  // Draw dimension formulas
  drawDimensionFormulas();

  // Draw orthogonality verification if enabled
  if (showOrthogCheckbox.checked()) {
    drawOrthogonalityInfo();
  }

  // Control area labels
  drawControlLabels();
}

function createMatrixInputs() {
  // Create a 4x5 grid of inputs for matrix entries
  let startX = 10;
  let startY = drawHeight + 8;
  let inputWidth = 35;
  let inputHeight = 20;
  let spacing = 38;

  for (let i = 0; i < 4; i++) {
    matrixInputs[i] = [];
    for (let j = 0; j < 5; j++) {
      let inp = createInput('0');
      inp.position(startX + j * spacing, startY + i * (inputHeight + 2));
      inp.size(inputWidth, inputHeight);
      inp.style('font-size', '12px');
      inp.style('text-align', 'center');
      matrixInputs[i][j] = inp;
    }
  }

  // Set default matrix values
  setMatrixInputs();
}

function setMatrixInputs() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      if (i < m && j < n) {
        matrixInputs[i][j].value(matrix[i][j].toString());
        matrixInputs[i][j].show();
      } else {
        matrixInputs[i][j].value('0');
        matrixInputs[i][j].hide();
      }
    }
  }
}

function readMatrixInputs() {
  matrix = [];
  for (let i = 0; i < m; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      let val = parseFloat(matrixInputs[i][j].value());
      matrix[i][j] = isNaN(val) ? 0 : val;
    }
  }
}

function drawDomainPanel(x, y, w, h) {
  let highlight = highlightSlider.value();

  // Panel background
  fill(255, 255, 255, 200);
  stroke(150);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Label
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Domain: R' + superscript(n), x + w/2, y + 8);

  // Draw the two subspaces: Row Space and Null Space
  let centerX = x + w/2;
  let centerY = y + h/2 + 10;
  let subspaceWidth = w * 0.35;
  let subspaceHeight = h * 0.6;

  // Row Space (top portion)
  let rowAlpha = (highlight === 0 || highlight === 1) ? 255 : 100;
  fill(red(rowSpaceColor), green(rowSpaceColor), blue(rowSpaceColor), rowAlpha * 0.3);
  stroke(red(rowSpaceColor), green(rowSpaceColor), blue(rowSpaceColor), rowAlpha);
  strokeWeight(2);
  let rowY = centerY - subspaceHeight * 0.3;
  ellipse(centerX, rowY, subspaceWidth, subspaceHeight * 0.5);

  // Row Space label
  fill(red(rowSpaceColor), green(rowSpaceColor), blue(rowSpaceColor), rowAlpha);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text('Row Space', centerX, rowY - 10);
  textSize(11);
  text('dim = ' + rank, centerX, rowY + 10);

  // Null Space (bottom portion) - orthogonal to row space
  let nullAlpha = (highlight === 0 || highlight === 3) ? 255 : 100;
  fill(red(nullSpaceColor), green(nullSpaceColor), blue(nullSpaceColor), nullAlpha * 0.3);
  stroke(red(nullSpaceColor), green(nullSpaceColor), blue(nullSpaceColor), nullAlpha);
  strokeWeight(2);
  let nullY = centerY + subspaceHeight * 0.3;
  ellipse(centerX, nullY, subspaceWidth, subspaceHeight * 0.5);

  // Null Space label
  fill(red(nullSpaceColor), green(nullSpaceColor), blue(nullSpaceColor), nullAlpha);
  noStroke();
  textSize(13);
  text('Null Space', centerX, nullY - 10);
  textSize(11);
  text('dim = ' + (n - rank), centerX, nullY + 10);

  // Orthogonality indicator
  if (highlight === 0) {
    stroke(100);
    strokeWeight(1);
    drawOrthogonalSymbol(centerX - 20, centerY, 12);
    fill(80);
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);
    text('orthogonal', centerX - 5, centerY);
  }

  // Show basis vectors if enabled
  if (showBasisCheckbox.checked()) {
    drawBasisVectors(centerX, rowY, rowSpaceBasis, rowSpaceColor, rowAlpha, 'Row');
    drawBasisVectors(centerX, nullY, nullSpaceBasis, nullSpaceColor, nullAlpha, 'Null');
  }
}

function drawCodomainPanel(x, y, w, h) {
  let highlight = highlightSlider.value();

  // Panel background
  fill(255, 255, 255, 200);
  stroke(150);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Label
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  text('Codomain: R' + superscript(m), x + w/2, y + 8);

  // Draw the two subspaces: Column Space and Left Null Space
  let centerX = x + w/2;
  let centerY = y + h/2 + 10;
  let subspaceWidth = w * 0.35;
  let subspaceHeight = h * 0.6;

  // Column Space (top portion)
  let colAlpha = (highlight === 0 || highlight === 2) ? 255 : 100;
  fill(red(colSpaceColor), green(colSpaceColor), blue(colSpaceColor), colAlpha * 0.3);
  stroke(red(colSpaceColor), green(colSpaceColor), blue(colSpaceColor), colAlpha);
  strokeWeight(2);
  let colY = centerY - subspaceHeight * 0.3;
  ellipse(centerX, colY, subspaceWidth, subspaceHeight * 0.5);

  // Column Space label
  fill(red(colSpaceColor), green(colSpaceColor), blue(colSpaceColor), colAlpha);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text('Column Space', centerX, colY - 10);
  textSize(11);
  text('dim = ' + rank, centerX, colY + 10);

  // Left Null Space (bottom portion) - orthogonal to column space
  let leftAlpha = (highlight === 0 || highlight === 4) ? 255 : 100;
  fill(red(leftNullColor), green(leftNullColor), blue(leftNullColor), leftAlpha * 0.3);
  stroke(red(leftNullColor), green(leftNullColor), blue(leftNullColor), leftAlpha);
  strokeWeight(2);
  let leftY = centerY + subspaceHeight * 0.3;
  ellipse(centerX, leftY, subspaceWidth, subspaceHeight * 0.5);

  // Left Null Space label
  fill(red(leftNullColor), green(leftNullColor), blue(leftNullColor), leftAlpha);
  noStroke();
  textSize(13);
  text('Left Null Space', centerX, leftY - 10);
  textSize(11);
  text('dim = ' + (m - rank), centerX, leftY + 10);

  // Orthogonality indicator
  if (highlight === 0) {
    stroke(100);
    strokeWeight(1);
    drawOrthogonalSymbol(centerX - 20, centerY, 12);
    fill(80);
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);
    text('orthogonal', centerX - 5, centerY);
  }

  // Show basis vectors if enabled
  if (showBasisCheckbox.checked()) {
    drawBasisVectors(centerX, colY, colSpaceBasis, colSpaceColor, colAlpha, 'Col');
    drawBasisVectors(centerX, leftY, leftNullSpaceBasis, leftNullColor, leftAlpha, 'LeftNull');
  }
}

function drawBasisVectors(cx, cy, basis, col, alpha, label) {
  if (basis.length === 0) {
    fill(red(col), green(col), blue(col), alpha);
    textSize(10);
    textAlign(CENTER, CENTER);
    text('{0}', cx, cy + 25);
    return;
  }

  let basisStr = '';
  for (let i = 0; i < basis.length && i < 2; i++) {
    let vec = basis[i];
    let vecStr = '[' + vec.map(v => v.toFixed(1)).join(', ') + ']';
    basisStr += (i > 0 ? ', ' : '') + vecStr;
  }
  if (basis.length > 2) {
    basisStr += '...';
  }

  fill(red(col), green(col), blue(col), alpha);
  textSize(9);
  textAlign(CENTER, CENTER);
  text('Basis: ' + basisStr, cx, cy + 28);
}

function drawTransformationArrows(leftX, rightX, y, h) {
  let midX = (leftX + rightX) / 2;
  let centerY = y + h/2;

  // Arrow: Row Space -> Column Space (upper arrow)
  let upperY = centerY - h * 0.15;
  stroke(100);
  strokeWeight(2);
  line(leftX + 10, upperY, rightX - 10, upperY);

  // Arrowhead
  fill(100);
  noStroke();
  triangle(rightX - 10, upperY, rightX - 20, upperY - 6, rightX - 20, upperY + 6);

  // Label
  textAlign(CENTER, BOTTOM);
  textSize(11);
  fill(50);
  text('A maps Row Space', midX, upperY - 5);
  textAlign(CENTER, TOP);
  text('onto Column Space', midX, upperY + 5);

  // Arrow: Null Space -> {0} (lower arrow)
  let lowerY = centerY + h * 0.25;
  stroke(100, 100, 100, 150);
  strokeWeight(2);
  line(leftX + 10, lowerY, rightX - 10, lowerY);

  // Arrowhead
  fill(100, 100, 100, 150);
  noStroke();
  triangle(rightX - 10, lowerY, rightX - 20, lowerY - 6, rightX - 20, lowerY + 6);

  // Label
  fill(80);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text('A maps Null Space', midX, lowerY - 5);
  textAlign(CENTER, TOP);
  text('to {0}', midX, lowerY + 5);

  // Draw origin point on codomain side
  fill(0);
  noStroke();
  ellipse(rightX - 5, lowerY, 8, 8);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('{0}', rightX + 5, lowerY);
}

function drawDimensionFormulas() {
  let y = drawHeight - 25;

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);

  // Rank-Nullity for domain
  text('Domain: dim(Row Space) + dim(Null Space) = ' + rank + ' + ' + (n - rank) + ' = ' + n + ' = n', canvasWidth * 0.25, y);

  // Rank-Nullity for codomain
  text('Codomain: dim(Col Space) + dim(Left Null) = ' + rank + ' + ' + (m - rank) + ' = ' + m + ' = m', canvasWidth * 0.75, y);
}

function drawOrthogonalSymbol(x, y, size) {
  // Draw right angle symbol
  noFill();
  stroke(100);
  strokeWeight(1);
  line(x, y - size/2, x, y + size/2);
  line(x - size/2, y, x + size/2, y);
  rect(x, y - size/3, size/3, size/3);
}

function drawOrthogonalityInfo() {
  // Draw orthogonality verification panel
  let panelX = canvasWidth - 200;
  let panelY = 35;
  let panelW = 190;
  let panelH = 80;

  fill(255, 255, 240, 240);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 5);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  text('Orthogonality Check:', panelX + 8, panelY + 8);

  textSize(10);
  let dotRow = computeDotProducts(rowSpaceBasis, nullSpaceBasis);
  let dotCol = computeDotProducts(colSpaceBasis, leftNullSpaceBasis);

  fill(dotRow < 0.001 ? color(0, 150, 0) : color(200, 0, 0));
  text('Row . Null = ' + dotRow.toFixed(4), panelX + 8, panelY + 28);

  fill(dotCol < 0.001 ? color(0, 150, 0) : color(200, 0, 0));
  text('Col . LeftNull = ' + dotCol.toFixed(4), panelX + 8, panelY + 43);

  fill(80);
  textSize(9);
  text('(Should be 0 for orthogonal)', panelX + 8, panelY + 60);
}

function computeDotProducts(basis1, basis2) {
  if (basis1.length === 0 || basis2.length === 0) return 0;

  let maxDot = 0;
  for (let v1 of basis1) {
    for (let v2 of basis2) {
      if (v1.length !== v2.length) continue;
      let dot = 0;
      for (let i = 0; i < v1.length; i++) {
        dot += v1[i] * v2[i];
      }
      maxDot = max(maxDot, abs(dot));
    }
  }
  return maxDot;
}

function drawControlLabels() {
  fill(0);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);

  // Matrix label
  text('Matrix A (' + m + 'x' + n + '):', 10, drawHeight + 100);

  // Highlight labels
  let highlightVal = highlightSlider.value();
  let labels = ['All', 'Row Sp', 'Col Sp', 'Null Sp', 'Left Null'];
  textAlign(CENTER, CENTER);
  textSize(11);
  fill(80);
  text(labels[highlightVal], 575, drawHeight + 100);

  // Rank display
  textAlign(RIGHT, CENTER);
  textSize(13);
  fill(0);
  text('Rank(A) = ' + rank, canvasWidth - 20, drawHeight + 100);
}

function computeSubspaces() {
  readMatrixInputs();

  // Compute RREF and find bases
  let augmented = matrix.map(row => [...row]);
  let rref = computeRREF(augmented);

  // Find pivot columns (for rank and row/column space)
  let pivotCols = [];
  let pivotRows = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (abs(rref[i][j] - 1) < 0.0001) {
        let isPivot = true;
        for (let k = 0; k < i; k++) {
          if (abs(rref[k][j]) > 0.0001) {
            isPivot = false;
            break;
          }
        }
        if (isPivot) {
          pivotCols.push(j);
          pivotRows.push(i);
          break;
        }
      }
    }
  }

  rank = pivotCols.length;

  // Row Space basis: non-zero rows of RREF
  rowSpaceBasis = [];
  for (let i = 0; i < rank; i++) {
    rowSpaceBasis.push([...rref[i]]);
  }

  // Column Space basis: original columns at pivot positions
  colSpaceBasis = [];
  for (let j of pivotCols) {
    let col = [];
    for (let i = 0; i < m; i++) {
      col.push(matrix[i][j]);
    }
    colSpaceBasis.push(col);
  }

  // Null Space basis: solve Ax = 0
  nullSpaceBasis = computeNullSpace(rref, pivotCols, n, rank);

  // Left Null Space basis: solve A^T y = 0
  let transposeRREF = computeRREF(transpose(matrix));
  let transPivotCols = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (abs(transposeRREF[i][j] - 1) < 0.0001) {
        let isPivot = true;
        for (let k = 0; k < i; k++) {
          if (abs(transposeRREF[k][j]) > 0.0001) {
            isPivot = false;
            break;
          }
        }
        if (isPivot) {
          transPivotCols.push(j);
          break;
        }
      }
    }
  }
  leftNullSpaceBasis = computeNullSpace(transposeRREF, transPivotCols, m, rank);
}

function computeRREF(mat) {
  let rows = mat.length;
  let cols = mat[0].length;
  let result = mat.map(row => [...row]);

  let lead = 0;
  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;

    let i = r;
    while (abs(result[i][lead]) < 0.0001) {
      i++;
      if (i >= rows) {
        i = r;
        lead++;
        if (lead >= cols) return result;
      }
    }

    // Swap rows
    let temp = result[i];
    result[i] = result[r];
    result[r] = temp;

    // Scale row
    let lv = result[r][lead];
    for (let j = 0; j < cols; j++) {
      result[r][j] /= lv;
    }

    // Eliminate column
    for (let i2 = 0; i2 < rows; i2++) {
      if (i2 !== r) {
        let mult = result[i2][lead];
        for (let j = 0; j < cols; j++) {
          result[i2][j] -= mult * result[r][j];
        }
      }
    }

    lead++;
  }

  return result;
}

function computeNullSpace(rref, pivotCols, numCols, rank) {
  let nullity = numCols - rank;
  if (nullity === 0) return [];

  let basis = [];
  let freeVars = [];

  // Find free variables (non-pivot columns)
  for (let j = 0; j < numCols; j++) {
    if (!pivotCols.includes(j)) {
      freeVars.push(j);
    }
  }

  // For each free variable, create a basis vector
  for (let freeIdx of freeVars) {
    let vec = new Array(numCols).fill(0);
    vec[freeIdx] = 1;

    // Fill in values from pivot equations
    for (let i = 0; i < rank; i++) {
      let pivotCol = pivotCols[i];
      vec[pivotCol] = -rref[i][freeIdx];
    }

    basis.push(vec);
  }

  return basis;
}

function transpose(mat) {
  let rows = mat.length;
  let cols = mat[0].length;
  let result = [];
  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = mat[i][j];
    }
  }
  return result;
}

function superscript(num) {
  let supers = {'0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3',
                '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077',
                '8': '\u2078', '9': '\u2079'};
  return num.toString().split('').map(c => supers[c] || c).join('');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = max(containerWidth, 800);
}
