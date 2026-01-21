// Matrix Decomposition Selection Guide MicroSim
// Interactive decision tree for choosing matrix decomposition
// Learning objective: Select appropriate decomposition based on matrix properties

let canvasWidth = 900;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

// Decision tree nodes
let nodes = [];
let edges = [];
let currentPath = [];
let selectedNode = null;
let hoveredNode = null;

// Node positions
let nodeRadius = 35;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  buildDecisionTree();

  describe('Interactive decision tree for selecting the appropriate matrix decomposition', LABEL);
}

function buildDecisionTree() {
  nodes = [];
  edges = [];

  // Root node
  let rootX = canvasWidth / 2;
  let rootY = 50;

  // Level 0 - Start
  nodes.push({
    id: 0, x: rootX, y: rootY,
    text: 'Start',
    question: 'What is your goal?',
    type: 'question',
    color: [100, 150, 200]
  });

  // Level 1 - Goals
  let l1Y = rootY + 80;
  nodes.push({
    id: 1, x: rootX - 200, y: l1Y,
    text: 'Solve\nAx=b',
    type: 'question',
    question: 'Is A symmetric positive definite?',
    color: [100, 150, 200]
  });

  nodes.push({
    id: 2, x: rootX, y: l1Y,
    text: 'Least\nSquares',
    type: 'answer',
    answer: 'QR Decomposition',
    reason: 'QR is numerically stable for overdetermined systems',
    color: [100, 180, 100]
  });

  nodes.push({
    id: 3, x: rootX + 200, y: l1Y,
    text: 'Low-Rank\nApprox',
    type: 'answer',
    answer: 'Truncated SVD',
    reason: 'SVD gives optimal rank-k approximation (Eckart-Young)',
    color: [100, 180, 100]
  });

  // Level 2 - SPD question
  let l2Y = l1Y + 90;
  nodes.push({
    id: 4, x: rootX - 280, y: l2Y,
    text: 'Yes\n(SPD)',
    type: 'answer',
    answer: 'Cholesky Decomposition',
    reason: 'Half the work of LU, no pivoting needed',
    color: [100, 180, 100]
  });

  nodes.push({
    id: 5, x: rootX - 120, y: l2Y,
    text: 'No',
    type: 'question',
    question: 'Is A square and invertible?',
    color: [100, 150, 200]
  });

  // Level 3 - Square question
  let l3Y = l2Y + 90;
  nodes.push({
    id: 6, x: rootX - 200, y: l3Y,
    text: 'Yes',
    type: 'answer',
    answer: 'LU with Pivoting',
    reason: 'Efficient for multiple right-hand sides',
    color: [100, 180, 100]
  });

  nodes.push({
    id: 7, x: rootX - 40, y: l3Y,
    text: 'No',
    type: 'question',
    question: 'Need eigenvalues too?',
    color: [100, 150, 200]
  });

  // Level 4
  let l4Y = l3Y + 90;
  nodes.push({
    id: 8, x: rootX - 100, y: l4Y,
    text: 'Yes',
    type: 'answer',
    answer: 'SVD',
    reason: 'Provides singular values and complete subspace info',
    color: [100, 180, 100]
  });

  nodes.push({
    id: 9, x: rootX + 60, y: l4Y,
    text: 'No',
    type: 'answer',
    answer: 'QR Decomposition',
    reason: 'General-purpose for rectangular matrices',
    color: [100, 180, 100]
  });

  // Edges
  edges = [
    {from: 0, to: 1, label: 'Solve Ax=b'},
    {from: 0, to: 2, label: 'Least squares'},
    {from: 0, to: 3, label: 'Low-rank approx'},
    {from: 1, to: 4, label: 'Yes (SPD)'},
    {from: 1, to: 5, label: 'No'},
    {from: 5, to: 6, label: 'Yes (square)'},
    {from: 5, to: 7, label: 'No'},
    {from: 7, to: 8, label: 'Yes'},
    {from: 7, to: 9, label: 'No'}
  ];

  // Start with root selected
  currentPath = [0];
}

function draw() {
  updateCanvasSize();

  background(250);

  // Title
  fill(0);
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text('Matrix Decomposition Selection Guide', canvasWidth/2, 10);

  // Draw edges first
  for (let edge of edges) {
    let from = nodes.find(n => n.id === edge.from);
    let to = nodes.find(n => n.id === edge.to);
    drawEdge(from, to, edge.label);
  }

  // Draw nodes
  for (let node of nodes) {
    drawNode(node);
  }

  // Draw info panel for selected/hovered node
  drawInfoPanel();

  // Control area
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Instructions
  noStroke();
  fill(80);
  textSize(13);
  textAlign(CENTER, CENTER);
  text('Click on decision nodes (blue) to explore paths. Green nodes show recommended decompositions.', canvasWidth/2, drawHeight + 25);
}

function drawNode(node) {
  let isInPath = currentPath.includes(node.id);
  let isHovered = hoveredNode === node.id;
  let isSelected = selectedNode === node.id;

  // Node circle
  if (isSelected) {
    strokeWeight(4);
    stroke(255, 150, 0);
  } else if (isHovered) {
    strokeWeight(3);
    stroke(100);
  } else if (isInPath) {
    strokeWeight(3);
    stroke(80);
  } else {
    strokeWeight(1);
    stroke(150);
  }

  let c = node.color;
  if (node.type === 'answer') {
    fill(c[0], c[1], c[2], isInPath ? 255 : 150);
  } else {
    fill(c[0], c[1], c[2], isInPath ? 255 : 180);
  }

  ellipse(node.x, node.y, nodeRadius * 2, nodeRadius * 2);

  // Node text
  noStroke();
  fill(isInPath || isHovered ? 0 : 80);
  textSize(11);
  textAlign(CENTER, CENTER);

  // Handle multi-line text
  let lines = node.text.split('\n');
  let lineH = 13;
  let startY = node.y - (lines.length - 1) * lineH / 2;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], node.x, startY + i * lineH);
  }
}

function drawEdge(from, to, label) {
  let isInPath = currentPath.includes(from.id) && currentPath.includes(to.id);

  // Calculate edge endpoints
  let dx = to.x - from.x;
  let dy = to.y - from.y;
  let len = Math.sqrt(dx * dx + dy * dy);
  let ux = dx / len;
  let uy = dy / len;

  let x1 = from.x + ux * nodeRadius;
  let y1 = from.y + uy * nodeRadius;
  let x2 = to.x - ux * nodeRadius;
  let y2 = to.y - uy * nodeRadius;

  // Draw line
  strokeWeight(isInPath ? 3 : 1.5);
  stroke(isInPath ? color(80) : color(180));
  line(x1, y1, x2, y2);

  // Draw arrowhead
  let arrowSize = 8;
  let angle = atan2(dy, dx);
  push();
  translate(x2, y2);
  rotate(angle);
  fill(isInPath ? 80 : 180);
  noStroke();
  triangle(0, 0, -arrowSize, arrowSize/2, -arrowSize, -arrowSize/2);
  pop();

  // Draw label
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;
  noStroke();
  fill(isInPath ? 0 : 120);
  textSize(10);
  textAlign(CENTER, CENTER);

  // Offset label perpendicular to edge
  let perpX = -uy * 12;
  let perpY = ux * 12;
  text(label, midX + perpX, midY + perpY);
}

function drawInfoPanel() {
  let node = hoveredNode !== null ? nodes.find(n => n.id === hoveredNode) :
             (selectedNode !== null ? nodes.find(n => n.id === selectedNode) : null);

  if (!node) return;

  let panelW = 280;
  let panelH = node.type === 'answer' ? 100 : 70;
  let panelX = canvasWidth - panelW - 20;
  let panelY = drawHeight - panelH - 20;

  // Panel background
  fill(255, 255, 240);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Content
  noStroke();
  fill(0);
  textSize(13);
  textAlign(LEFT, TOP);

  if (node.type === 'question') {
    text('Question:', panelX + 12, panelY + 12);
    fill(60);
    textSize(12);
    text(node.question, panelX + 12, panelY + 32, panelW - 24, 40);
  } else {
    fill(0, 120, 0);
    textSize(14);
    text('→ ' + node.answer, panelX + 12, panelY + 12);

    fill(60);
    textSize(11);
    text('Why: ' + node.reason, panelX + 12, panelY + 38, panelW - 24, 60);
  }
}

function mousePressed() {
  // Check if clicked on a node
  for (let node of nodes) {
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < nodeRadius) {
      if (node.type === 'question') {
        selectedNode = node.id;
        // Update path to include this node and its ancestors
        updatePath(node.id);
      }
      return;
    }
  }
}

function mouseMoved() {
  hoveredNode = null;
  for (let node of nodes) {
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < nodeRadius) {
      hoveredNode = node.id;
      cursor(HAND);
      return;
    }
  }
  cursor(ARROW);
}

function updatePath(nodeId) {
  // Build path from root to this node
  currentPath = [0];

  if (nodeId === 0) return;

  // Find path using edges
  let queue = [[0]];
  while (queue.length > 0) {
    let path = queue.shift();
    let lastNode = path[path.length - 1];

    if (lastNode === nodeId) {
      currentPath = path;
      return;
    }

    // Find children
    for (let edge of edges) {
      if (edge.from === lastNode) {
        queue.push([...path, edge.to]);
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  buildDecisionTree();  // Rebuild with new positions
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(600, Math.floor(container.offsetWidth));
  }
}
