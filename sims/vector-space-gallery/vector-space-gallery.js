// Vector Space Examples Gallery MicroSim
// Interactive infographic showing diverse vector space examples
// Bloom's Level: Understand - Recognize examples and identify zero vectors/operations
// MicroSim template version 2026.02

// Canvas dimensions
let canvasWidth = 900;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

// Layout
let margin = 15;
let cardWidth, cardHeight;
let cards = [];
let hoveredCard = null;
let selectedCard = null;
let animTime = 0;

// Color scheme - finite dimensional vs infinite dimensional
let finiteColor = [70, 130, 180];    // Steel blue for finite
let infiniteColor = [147, 112, 219]; // Medium purple for infinite

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  buildCards();

  describe('Gallery of six vector space examples showing R2, R3, polynomials, continuous functions, matrices, and null spaces', LABEL);
}

function buildCards() {
  cards = [];

  // Calculate card dimensions for 3x2 grid
  let gridCols = 3;
  let gridRows = 2;
  let availableWidth = canvasWidth - margin * 4;
  let availableHeight = drawHeight - 80; // Leave room for title

  cardWidth = (availableWidth - margin * (gridCols - 1)) / gridCols;
  cardHeight = (availableHeight - margin * (gridRows - 1)) / gridRows;

  // Card data
  let cardData = [
    {
      title: "R^2: The Plane",
      icon: "plane",
      zeroVec: "Origin (0, 0)",
      example: "v = (3, 4)",
      dimension: "finite",
      dim: 2,
      addExample: "(1,2) + (3,1) = (4,3)",
      scalarExample: "2 * (1,2) = (2,4)"
    },
    {
      title: "R^3: 3D Space",
      icon: "cube",
      zeroVec: "Origin (0, 0, 0)",
      example: "v = (1, 2, 3)",
      dimension: "finite",
      dim: 3,
      addExample: "(1,0,1) + (0,1,1) = (1,1,2)",
      scalarExample: "3 * (1,1,1) = (3,3,3)"
    },
    {
      title: "P_2: Quadratic Polynomials",
      icon: "parabola",
      zeroVec: "p(x) = 0",
      example: "p(x) = 2x^2 - 3x + 1",
      dimension: "finite",
      dim: 3,
      addExample: "(x^2 + 1) + (2x) = x^2 + 2x + 1",
      scalarExample: "2(x^2 - x) = 2x^2 - 2x"
    },
    {
      title: "Continuous Functions",
      icon: "sine",
      zeroVec: "f(x) = 0 (horizontal axis)",
      example: "f(x) = sin(x)",
      dimension: "infinite",
      dim: "inf",
      addExample: "sin(x) + cos(x)",
      scalarExample: "3 * sin(x) = 3sin(x)"
    },
    {
      title: "R^(2x2): 2x2 Matrices",
      icon: "matrix",
      zeroVec: "Zero matrix [[0,0],[0,0]]",
      example: "A = [[1,2],[3,4]]",
      dimension: "finite",
      dim: 4,
      addExample: "[[1,0],[0,1]] + [[0,1],[1,0]]",
      scalarExample: "2 * [[1,2],[3,4]]"
    },
    {
      title: "Null Space of A",
      icon: "nullspace",
      zeroVec: "Origin",
      example: "All x where Ax = 0",
      dimension: "finite",
      dim: "varies",
      addExample: "If Ax=0 and Ay=0, then A(x+y)=0",
      scalarExample: "If Ax=0, then A(cx)=0"
    }
  ];

  for (let i = 0; i < 6; i++) {
    let col = i % gridCols;
    let row = Math.floor(i / gridCols);

    let x = margin * 2 + col * (cardWidth + margin);
    let y = 60 + row * (cardHeight + margin);

    cards.push({
      ...cardData[i],
      x: x,
      y: y,
      index: i
    });
  }
}

function draw() {
  updateCanvasSize();
  animTime += 0.03;

  // Drawing area background
  background(248, 250, 252);

  // Title
  fill(30);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Vector Space Examples Gallery', canvasWidth / 2, 12);

  // Subtitle
  textSize(13);
  fill(100);
  text('Hover to see operations | Click for axiom verification', canvasWidth / 2, 38);

  // Draw cards
  for (let card of cards) {
    drawCard(card);
  }

  // Control area
  fill(255);
  stroke(220);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Legend
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);

  // Finite dimension indicator
  fill(finiteColor[0], finiteColor[1], finiteColor[2]);
  ellipse(margin + 10, drawHeight + 20, 14, 14);
  fill(80);
  text('Finite Dimensional', margin + 25, drawHeight + 20);

  // Infinite dimension indicator
  fill(infiniteColor[0], infiniteColor[1], infiniteColor[2]);
  ellipse(margin + 160, drawHeight + 20, 14, 14);
  fill(80);
  text('Infinite Dimensional', margin + 175, drawHeight + 20);

  // Hover info
  if (hoveredCard !== null) {
    let card = cards[hoveredCard];
    textAlign(RIGHT, CENTER);
    fill(60);
    text('Addition: ' + card.addExample + '  |  Scalar: ' + card.scalarExample, canvasWidth - margin, drawHeight + 25);
  } else {
    textAlign(RIGHT, CENTER);
    fill(120);
    text('Hover over a card to see vector operations', canvasWidth - margin, drawHeight + 25);
  }
}

function drawCard(card) {
  let isHovered = hoveredCard === card.index;
  let isSelected = selectedCard === card.index;

  // Card shadow
  if (isHovered || isSelected) {
    noStroke();
    fill(0, 0, 0, 30);
    rect(card.x + 4, card.y + 4, cardWidth, cardHeight, 10);
  }

  // Card background
  let baseColor = card.dimension === 'finite' ? finiteColor : infiniteColor;
  if (isHovered) {
    stroke(baseColor[0], baseColor[1], baseColor[2]);
    strokeWeight(3);
  } else {
    stroke(200);
    strokeWeight(1);
  }
  fill(255);
  rect(card.x, card.y, cardWidth, cardHeight, 10);

  // Color accent bar at top
  noStroke();
  fill(baseColor[0], baseColor[1], baseColor[2], isHovered ? 255 : 200);
  rect(card.x, card.y, cardWidth, 6, 10, 10, 0, 0);

  // Card content
  let cx = card.x + cardWidth / 2;
  let cy = card.y;

  // Draw icon
  push();
  translate(cx, cy + 50);
  drawIcon(card.icon, isHovered);
  pop();

  // Title
  noStroke();
  fill(30);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text(card.title, cx, cy + 90);
  textStyle(NORMAL);

  // Dimension badge
  textSize(10);
  let dimText = card.dim === 'inf' ? 'dim = infinity' : (card.dim === 'varies' ? 'dim varies' : 'dim = ' + card.dim);
  fill(baseColor[0], baseColor[1], baseColor[2], 180);
  let badgeWidth = textWidth(dimText) + 16;
  rect(cx - badgeWidth/2, cy + 108, badgeWidth, 18, 9);
  fill(255);
  textAlign(CENTER, CENTER);
  text(dimText, cx, cy + 117);

  // Zero vector
  fill(80);
  textSize(11);
  textAlign(CENTER, TOP);
  text('Zero: ' + card.zeroVec, cx, cy + 135, cardWidth - 20);

  // Example
  fill(60);
  textSize(10);
  text('Example:', cx, cy + 158);
  fill(baseColor[0] - 20, baseColor[1] - 20, baseColor[2] - 20);
  textSize(11);
  text(card.example, cx, cy + 172, cardWidth - 16);
}

function drawIcon(type, animated) {
  let t = animated ? animTime : 0;
  let s = 30; // icon scale

  stroke(60);
  strokeWeight(1.5);
  noFill();

  switch(type) {
    case 'plane':
      // 2D coordinate axes with vector
      line(-s, 0, s, 0);
      line(0, -s, 0, s);
      // Animated vector
      let vx = animated ? 20 * cos(t) : 18;
      let vy = animated ? -15 * sin(t * 0.7) : -12;
      stroke(200, 100, 100);
      strokeWeight(2);
      line(0, 0, vx, vy);
      // Arrowhead
      fill(200, 100, 100);
      push();
      translate(vx, vy);
      rotate(atan2(vy, vx));
      triangle(0, 0, -8, 3, -8, -3);
      pop();
      break;

    case 'cube':
      // 3D coordinate axes
      stroke(60);
      strokeWeight(1.5);
      noFill();
      // X axis
      line(0, 0, s * 0.8, 0);
      // Y axis (going up)
      line(0, 0, 0, -s * 0.8);
      // Z axis (into page - diagonal)
      line(0, 0, -s * 0.5, s * 0.5);
      // Vector
      let v3x = animated ? 15 + 5 * sin(t) : 18;
      let v3y = animated ? -12 + 3 * cos(t * 1.2) : -15;
      stroke(100, 150, 100);
      strokeWeight(2);
      line(0, 0, v3x, v3y);
      fill(100, 150, 100);
      push();
      translate(v3x, v3y);
      rotate(atan2(v3y, v3x));
      triangle(0, 0, -8, 3, -8, -3);
      pop();
      break;

    case 'parabola':
      // Parabola curve
      stroke(100, 100, 180);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let px = -s; px <= s; px += 2) {
        let py = (animated ? 0.03 + 0.01 * sin(t) : 0.035) * px * px - s * 0.6;
        vertex(px, -py);
      }
      endShape();
      // Axes
      stroke(150);
      strokeWeight(1);
      line(-s, s * 0.6, s, s * 0.6);
      line(0, -s * 0.4, 0, s * 0.8);
      break;

    case 'sine':
      // Sine wave
      stroke(180, 100, 180);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let sx = -s; sx <= s; sx += 2) {
        let freq = animated ? 0.15 + 0.02 * sin(t * 0.5) : 0.15;
        let sy = 15 * sin(sx * freq + (animated ? t : 0));
        vertex(sx, -sy);
      }
      endShape();
      // Axes
      stroke(150);
      strokeWeight(1);
      line(-s, 0, s, 0);
      line(-s + 5, -s * 0.6, -s + 5, s * 0.6);
      break;

    case 'matrix':
      // 2x2 matrix grid
      let mSize = 22;
      stroke(60);
      strokeWeight(1.5);
      noFill();
      // Brackets
      line(-mSize - 5, -mSize, -mSize - 5, mSize);
      line(-mSize - 5, -mSize, -mSize, -mSize);
      line(-mSize - 5, mSize, -mSize, mSize);
      line(mSize + 5, -mSize, mSize + 5, mSize);
      line(mSize + 5, -mSize, mSize, -mSize);
      line(mSize + 5, mSize, mSize, mSize);
      // Grid cells with animated values
      noStroke();
      fill(80);
      textSize(11);
      textAlign(CENTER, CENTER);
      let vals = animated ?
        [Math.round(2 + sin(t) * 1), Math.round(1 + cos(t * 0.8)),
         Math.round(1 + sin(t * 1.2)), Math.round(2 + cos(t))] :
        [1, 2, 3, 4];
      text(vals[0], -mSize/2, -mSize/2);
      text(vals[1], mSize/2, -mSize/2);
      text(vals[2], -mSize/2, mSize/2);
      text(vals[3], mSize/2, mSize/2);
      break;

    case 'nullspace':
      // Plane through origin in 3D
      stroke(100, 180, 150);
      strokeWeight(1.5);
      fill(100, 180, 150, animated ? 80 + 30 * sin(t) : 80);
      // Draw a parallelogram representing a plane
      let nAngle = animated ? t * 0.3 : 0;
      let p1 = [-s * cos(nAngle), -s * 0.3];
      let p2 = [s * cos(nAngle), -s * 0.3];
      let p3 = [s * 0.7, s * 0.5];
      let p4 = [-s * 0.7, s * 0.5];
      beginShape();
      vertex(p1[0], p1[1]);
      vertex(p2[0], p2[1]);
      vertex(p3[0], p3[1]);
      vertex(p4[0], p4[1]);
      endShape(CLOSE);
      // Origin point
      fill(50);
      noStroke();
      ellipse(0, 0.1 * s, 6, 6);
      break;
  }
}

function mouseMoved() {
  hoveredCard = null;

  for (let card of cards) {
    if (mouseX >= card.x && mouseX <= card.x + cardWidth &&
        mouseY >= card.y && mouseY <= card.y + cardHeight) {
      hoveredCard = card.index;
      cursor(HAND);
      return;
    }
  }
  cursor(ARROW);
}

function mousePressed() {
  if (hoveredCard !== null) {
    if (selectedCard === hoveredCard) {
      selectedCard = null;
    } else {
      selectedCard = hoveredCard;
    }
  } else {
    selectedCard = null;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  buildCards();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(600, Math.floor(container.offsetWidth));
    buildCards();
  }
}
