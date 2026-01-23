// SVD Geometric Interpretation MicroSim
// Visualize SVD as rotation-scaling-rotation transformation
// Learning objective: Understand SVD through geometric transformation

let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Matrix A (2x2)
let a11 = 3, a12 = 1;
let a21 = 1, a22 = 3;

// SVD components
let U = [[1, 0], [0, 1]];
let S = [1, 1];  // Singular values
let Vt = [[1, 0], [0, 1]];

// Animation state
let animPhase = 0;  // 0 to 3 (controls which stage)
let animT = 0;      // 0 to 1 within each phase
let isAnimating = false;
let animSpeed = 0.02;

// UI elements
let animateButton, resetButton;
let phaseSlider;
let a11Slider, a12Slider, a21Slider, a22Slider;
let showVectorsCheckbox;

// Unit circle points
let circlePoints = [];
let numPoints = 60;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Generate unit circle points
  for (let i = 0; i <= numPoints; i++) {
    let theta = (i / numPoints) * TWO_PI;
    circlePoints.push({x: cos(theta), y: sin(theta)});
  }

  // Buttons
  animateButton = createButton('Animate');
  animateButton.position(10, drawHeight + 15);
  animateButton.mousePressed(toggleAnimation);

  resetButton = createButton('Reset');
  resetButton.position(85, drawHeight + 15);
  resetButton.mousePressed(resetAnimation);

  // Phase slider
  phaseSlider = createSlider(0, 300, 0, 1);
  phaseSlider.position(200, drawHeight + 15);
  phaseSlider.size(120);
  phaseSlider.input(onPhaseSliderChange);

  // Matrix sliders
  let matrixSliderX = 370;
  a11Slider = createSlider(-4, 4, a11, 0.1);
  a11Slider.position(matrixSliderX, drawHeight + 10);
  a11Slider.size(80);
  a11Slider.input(updateMatrix);

  a12Slider = createSlider(-4, 4, a12, 0.1);
  a12Slider.position(515, drawHeight + 10);
  a12Slider.size(80);
  a12Slider.input(updateMatrix);

  a21Slider = createSlider(-4, 4, a21, 0.1);
  a21Slider.position(matrixSliderX, drawHeight + 45);
  a21Slider.size(80);
  a21Slider.input(updateMatrix);

  a22Slider = createSlider(-4, 4, a22, 0.1);
  a22Slider.position(515, drawHeight + 45);
  a22Slider.size(80);
  a22Slider.input(updateMatrix);

  // Show vectors checkbox
  showVectorsCheckbox = createCheckbox('Show Singular Vectors', true);
  showVectorsCheckbox.position(canvasWidth - 90, drawHeight + 15);
  showVectorsCheckbox.style('font-size', '14px');

  computeSVD();

  describe('Visualization of SVD as rotation-scaling-rotation transformation', LABEL);
}

function draw() {
  updateCanvasSize();

  background(245);

  // Draw border
  stroke(200);
  strokeWeight(1);
  noFill();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill(255);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Animation update
  if (isAnimating) {
    let sliderVal = phaseSlider.value();
    sliderVal += animSpeed * 100;
    if (sliderVal >= 300) {
      sliderVal = 300;
      isAnimating = false;
      animateButton.html('Animate');
    }
    phaseSlider.value(sliderVal);
  }

  // Parse slider to phases
  let sliderVal = phaseSlider.value();
  if (sliderVal <= 100) {
    animPhase = 0;
    animT = sliderVal / 100;
  } else if (sliderVal <= 200) {
    animPhase = 1;
    animT = (sliderVal - 100) / 100;
  } else {
    animPhase = 2;
    animT = (sliderVal - 200) / 100;
  }

  // Title
  fill(0);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('SVD Geometric Interpretation: A = UΣVᵀ', canvasWidth/2, 10);

  // Draw four panels
  let panelW = (canvasWidth - 80) / 4;
  let panelH = 240;
  let panelY = 50;

  for (let i = 0; i < 4; i++) {
    let panelX = 20 + i * (panelW + 15);
    drawPanel(i, panelX, panelY, panelW, panelH);
  }

  // Draw SVD matrix equation
  drawMatrixEquation();

  // Draw control labels
  noStroke();
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Phase:', 155, drawHeight + 25);

  // Phase indicator
  let phaseNames = ['Vᵀ rotation', 'Σ scaling', 'U rotation'];
  let currentPhase = Math.min(animPhase, 2);
  fill(50);
  text('Current: ' + phaseNames[currentPhase] + ' (' + (animT * 100).toFixed(0) + '%)', 155, drawHeight + 55);

  // Matrix labels
  fill(80);
  textAlign(RIGHT, CENTER);
  text('a₁₁:'+a11.toFixed(1), 370, drawHeight + 20);
  text('a₂₁:'+a21.toFixed(1), 370, drawHeight + 55);
  text('a₁₂:'+a12.toFixed(1), 510, drawHeight + 20);
  text('a₂₂:'+a22.toFixed(1), 510, drawHeight + 55);

}

function drawPanel(panelIdx, x, y, w, h) {
  // Panel background
  fill(255);
  stroke(180);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  // Panel title
  let titles = ['Original', 'After Vᵀ', 'After Σ', 'After U (= A)'];
  fill(0);
  noStroke();
  textSize(13);
  textAlign(CENTER, TOP);
  text(titles[panelIdx], x + w/2, y + 5);

  // Coordinate system
  let cx = x + w/2;
  let cy = y + h/2 + 10;
  let scale = (panelIdx === 3) ? 17.5 : 35;

  // Draw grid
  stroke(230);
  strokeWeight(0.5);
  for (let i = -2; i <= 2; i++) {
    line(cx + i * scale, cy - 2 * scale, cx + i * scale, cy + 2 * scale);
    line(cx - 2 * scale, cy + i * scale, cx + 2 * scale, cy + i * scale);
  }

  // Draw axes
  stroke(150);
  strokeWeight(1);
  line(cx - 2.5 * scale, cy, cx + 2.5 * scale, cy);
  line(cx, cy - 2.5 * scale, cx, cy + 2.5 * scale);

  // Determine what transformation to apply
  let points = transformPoints(panelIdx);

  // Draw transformed shape
  stroke(50, 100, 200);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of points) {
    vertex(cx + p.x * scale, cy - p.y * scale);
  }
  endShape(CLOSE);

  // Draw singular vectors if enabled
  if (showVectorsCheckbox.checked()) {
    drawSingularVectors(panelIdx, cx, cy, scale);
  }

  // Highlight current panel
  if (panelIdx === animPhase + 1 || (panelIdx === 3 && animPhase >= 2)) {
    noFill();
    stroke(255, 150, 0);
    strokeWeight(3);
    rect(x, y, w, h, 5);
  }
}

function transformPoints(panelIdx) {
  let result = [];

  for (let p of circlePoints) {
    let x = p.x;
    let y = p.y;

    if (panelIdx === 0) {
      // Original unit circle
      result.push({x: x, y: y});
    }
    else if (panelIdx === 1) {
      // After V^T (interpolated if animating phase 0)
      let t = (animPhase === 0) ? animT : 1;
      let newX = lerp(x, Vt[0][0] * x + Vt[0][1] * y, t);
      let newY = lerp(y, Vt[1][0] * x + Vt[1][1] * y, t);
      result.push({x: newX, y: newY});
    }
    else if (panelIdx === 2) {
      // After V^T and Σ
      let vx = Vt[0][0] * x + Vt[0][1] * y;
      let vy = Vt[1][0] * x + Vt[1][1] * y;

      let t = (animPhase === 1) ? animT : (animPhase > 1 ? 1 : 0);
      if (animPhase < 1) t = 0;

      let sx = lerp(vx, S[0] * vx, t);
      let sy = lerp(vy, S[1] * vy, t);
      result.push({x: sx, y: sy});
    }
    else {
      // After full transformation (U Σ V^T)
      let vx = Vt[0][0] * x + Vt[0][1] * y;
      let vy = Vt[1][0] * x + Vt[1][1] * y;
      let sx = S[0] * vx;
      let sy = S[1] * vy;

      let t = (animPhase === 2) ? animT : (animPhase > 2 ? 1 : 0);
      if (animPhase < 2) t = 0;

      let ux = lerp(sx, U[0][0] * sx + U[0][1] * sy, t);
      let uy = lerp(sy, U[1][0] * sx + U[1][1] * sy, t);
      result.push({x: ux, y: uy});
    }
  }

  return result;
}

function drawSingularVectors(panelIdx, cx, cy, scale) {
  strokeWeight(2);

  if (panelIdx === 0) {
    // Draw v1, v2 (columns of V = rows of V^T transposed)
    let v1 = [Vt[0][0], Vt[1][0]];
    let v2 = [Vt[0][1], Vt[1][1]];

    stroke(220, 80, 80);
    drawArrow(cx, cy, cx + v1[0] * scale * 1.3, cy - v1[1] * scale * 1.3);

    stroke(80, 180, 80);
    drawArrow(cx, cy, cx + v2[0] * scale * 1.3, cy - v2[1] * scale * 1.3);
  }
  else if (panelIdx === 1) {
    // After V^T: vectors are now aligned with axes (unit vectors)
    let t = (animPhase === 0) ? animT : 1;

    // v1 transforms to e1 (1,0), v2 transforms to e2 (0,1)
    let v1 = [Vt[0][0], Vt[1][0]];
    let v2 = [Vt[0][1], Vt[1][1]];

    let v1x = lerp(v1[0], 1, t);
    let v1y = lerp(v1[1], 0, t);
    let v2x = lerp(v2[0], 0, t);
    let v2y = lerp(v2[1], 1, t);

    stroke(220, 80, 80);
    drawArrow(cx, cy, cx + v1x * scale * 1.3, cy - v1y * scale * 1.3);

    stroke(80, 180, 80);
    drawArrow(cx, cy, cx + v2x * scale * 1.3, cy - v2y * scale * 1.3);
  }
  else if (panelIdx === 2) {
    // After Σ: vectors are scaled by singular values
    let t = (animPhase === 1) ? animT : (animPhase > 1 ? 1 : 0);
    if (animPhase < 1) t = 0;

    // Start from unit vectors, scale to σ1 and σ2
    let v1x = lerp(1, S[0], t);
    let v1y = 0;
    let v2x = 0;
    let v2y = lerp(1, S[1], t);

    stroke(220, 80, 80);
    drawArrow(cx, cy, cx + v1x * scale, cy - v1y * scale);

    stroke(80, 180, 80);
    drawArrow(cx, cy, cx + v2x * scale, cy - v2y * scale);
  }
  else if (panelIdx === 3) {
    // Draw u1, u2 (columns of U) scaled by singular values
    stroke(220, 80, 80);
    drawArrow(cx, cy, cx + U[0][0] * S[0] * scale, cy - U[1][0] * S[0] * scale);

    stroke(80, 180, 80);
    drawArrow(cx, cy, cx + U[0][1] * S[1] * scale, cy - U[1][1] * S[1] * scale);
  }
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);

  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let headLen = 8;
  push();
  translate(x2, y2);
  rotate(angle);
  line(0, 0, -headLen, headLen/2);
  line(0, 0, -headLen, -headLen/2);
  pop();
}

function drawMatrixEquation() {
  let eqY = drawHeight - 70;
  let startX = 20;

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);

  // A = U Σ V^T
  text('A =', startX, eqY);

  // Draw A matrix
  drawSmallMatrix([[a11, a12], [a21, a22]], startX + 30, eqY - 15);

  text('=', startX + 100, eqY);

  // Draw U
  drawSmallMatrix(U, startX + 115, eqY - 15);
  text("U", startX + 140, eqY + 25);

  text('×', startX + 183, eqY);

  // Draw Σ (diagonal)
  drawSmallMatrix([[S[0].toFixed(2), '0'], ['0', S[1].toFixed(2)]], startX + 200, eqY - 15);
  text('Σ', startX + 225, eqY + 25);

  text('×', startX + 275, eqY);

  // Draw V^T
  drawSmallMatrix(Vt, startX + 295, eqY - 15);
  text('Vᵀ', startX + 320, eqY + 25);

  // Singular values display
  fill(100);
  textSize(12);
  text('σ₁ = ' + S[0].toFixed(3) + ', σ₂ = ' + S[1].toFixed(3), startX + 440, eqY);
}

function drawSmallMatrix(mat, x, y) {
  let cellW = 28;
  let cellH = 14;

  // Brackets
  stroke(0);
  strokeWeight(1);
  line(x - 3, y, x - 3, y + 30);
  line(x - 3, y, x, y);
  line(x - 3, y + 30, x, y + 30);

  line(x + 2 * cellW + 3, y, x + 2 * cellW + 3, y + 30);
  line(x + 2 * cellW, y, x + 2 * cellW + 3, y);
  line(x + 2 * cellW, y + 30, x + 2 * cellW + 3, y + 30);

  // Values
  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let val = mat[i][j];
      let str = (typeof val === 'number') ? val.toFixed(2) : val;
      text(str, x + j * cellW + cellW/2, y + i * cellH + cellH -5);
    }
  }
}

function computeSVD() {
  // Compute SVD for 2x2 matrix using closed-form solution
  let A = [[a11, a12], [a21, a22]];

  // A^T A
  let AtA = [
    [a11*a11 + a21*a21, a11*a12 + a21*a22],
    [a12*a11 + a22*a21, a12*a12 + a22*a22]
  ];

  // Eigenvalues of A^T A (singular values squared)
  let trace = AtA[0][0] + AtA[1][1];
  let det = AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0];
  let disc = Math.sqrt(Math.max(0, trace * trace - 4 * det));

  let sigma1Sq = (trace + disc) / 2;
  let sigma2Sq = (trace - disc) / 2;

  S[0] = Math.sqrt(Math.max(0, sigma1Sq));
  S[1] = Math.sqrt(Math.max(0, sigma2Sq));

  // V (eigenvectors of A^T A)
  if (Math.abs(AtA[0][1]) > 0.0001) {
    let v1 = [sigma1Sq - AtA[1][1], AtA[0][1]];
    let len1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
    v1 = [v1[0]/len1, v1[1]/len1];

    let v2 = [-v1[1], v1[0]];  // Orthogonal

    Vt = [[v1[0], v1[1]], [v2[0], v2[1]]];
  } else {
    Vt = [[1, 0], [0, 1]];
  }

  // U = A V Σ^(-1)
  if (S[0] > 0.0001) {
    let u1x = (A[0][0] * Vt[0][0] + A[0][1] * Vt[0][1]) / S[0];
    let u1y = (A[1][0] * Vt[0][0] + A[1][1] * Vt[0][1]) / S[0];

    if (S[1] > 0.0001) {
      let u2x = (A[0][0] * Vt[1][0] + A[0][1] * Vt[1][1]) / S[1];
      let u2y = (A[1][0] * Vt[1][0] + A[1][1] * Vt[1][1]) / S[1];
      U = [[u1x, u2x], [u1y, u2y]];
    } else {
      U = [[u1x, -u1y], [u1y, u1x]];
    }
  } else {
    U = [[1, 0], [0, 1]];
  }
}

function updateMatrix() {
  a11 = a11Slider.value();
  a12 = a12Slider.value();
  a21 = a21Slider.value();
  a22 = a22Slider.value();
  computeSVD();
}

function toggleAnimation() {
  if (phaseSlider.value() >= 300) {
    phaseSlider.value(0);
  }
  isAnimating = !isAnimating;
  animateButton.html(isAnimating ? 'Pause' : 'Animate');
}

function resetAnimation() {
  phaseSlider.value(0);
  isAnimating = false;
  animateButton.html('Animate');
}

function onPhaseSliderChange() {
  // Stop auto animation when user drags slider
  isAnimating = false;
  animateButton.html('Animate');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
