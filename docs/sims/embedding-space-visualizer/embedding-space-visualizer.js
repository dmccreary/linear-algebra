// Embedding Space Visualizer
// Demonstrates word embeddings in 2D space with semantic relationships
// Chapter 11: Generative AI and Large Language Models

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Pre-computed word embeddings (simulated 2D projection)
// In practice, these would come from real embeddings (Word2Vec, GloVe, etc.)
let words = [];
let clusters = {
  colors: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink'],
  animals: ['dog', 'cat', 'bird', 'fish', 'horse', 'lion', 'tiger'],
  countries: ['USA', 'France', 'Japan', 'Brazil', 'India', 'Germany', 'Italy'],
  numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven'],
  food: ['apple', 'bread', 'cheese', 'pizza', 'rice', 'soup', 'cake']
};

let clusterColors = {
  colors: '#e74c3c',
  animals: '#3498db',
  countries: '#2ecc71',
  numbers: '#9b59b6',
  food: '#f39c12'
};

// View controls
let offsetX = 0;
let offsetY = 0;
let zoom = 1;
let isDragging = false;
let lastMouseX, lastMouseY;

// Interaction state
let hoveredWord = null;
let selectedWord = null;
let nearestNeighbors = [];

// UI elements
let searchInput;
let findSimilarBtn;
let resetViewBtn;
let zoomSlider;
let showLabelsCheckbox;

// Vector arithmetic
let word1Input, word2Input, word3Input;
let resultWord = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Generate word positions
  generateEmbeddings();

  // Create UI elements
  let yOffset = drawHeight + 8;

  // Zoom slider
  zoomSlider = createSlider(0.5, 3, 1, 0.1);
  zoomSlider.position(sliderLeftMargin, yOffset);
  zoomSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Show labels checkbox
  showLabelsCheckbox = createCheckbox(' Show All Labels', false);
  showLabelsCheckbox.position(10, yOffset + 30);
  showLabelsCheckbox.style('font-size', '14px');

  // Reset view button
  resetViewBtn = createButton('Reset View');
  resetViewBtn.position(140, yOffset + 30);
  resetViewBtn.mousePressed(resetView);

  // Find Similar button
  findSimilarBtn = createButton('Find Similar');
  findSimilarBtn.position(230, yOffset + 30);
  findSimilarBtn.mousePressed(findSimilarWords);

  describe('Interactive embedding space visualization showing word clusters and semantic relationships', LABEL);
}

function generateEmbeddings() {
  // Generate positions for each cluster
  let clusterCenters = {
    colors: { x: -150, y: -100 },
    animals: { x: 100, y: -80 },
    countries: { x: -100, y: 120 },
    numbers: { x: 150, y: 100 },
    food: { x: 0, y: 0 }
  };

  words = [];

  for (let category in clusters) {
    let center = clusterCenters[category];
    let wordList = clusters[category];

    for (let i = 0; i < wordList.length; i++) {
      // Add some randomness around cluster center
      let angle = (i / wordList.length) * TWO_PI;
      let radius = 30 + random(20);

      words.push({
        text: wordList[i],
        x: center.x + cos(angle) * radius,
        y: center.y + sin(angle) * radius,
        category: category
      });
    }
  }
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Embedding Space Visualizer', canvasWidth / 2, 10);

  // Update zoom from slider
  zoom = zoomSlider.value();

  // Draw coordinate system
  push();
  translate(canvasWidth / 2 + offsetX, drawHeight / 2 + offsetY);
  scale(zoom);

  // Draw grid
  stroke(220);
  strokeWeight(0.5);
  for (let i = -300; i <= 300; i += 50) {
    line(i, -300, i, 300);
    line(-300, i, 300, i);
  }

  // Draw axes
  stroke(150);
  strokeWeight(1);
  line(-300, 0, 300, 0);
  line(0, -300, 0, 300);

  // Draw words
  hoveredWord = null;
  let mouseXTransformed = (mouseX - canvasWidth / 2 - offsetX) / zoom;
  let mouseYTransformed = (mouseY - drawHeight / 2 - offsetY) / zoom;

  for (let word of words) {
    let d = dist(mouseXTransformed, mouseYTransformed, word.x, word.y);
    let isHovered = d < 15 && mouseY < drawHeight;
    let isSelected = selectedWord && selectedWord.text === word.text;
    let isNeighbor = nearestNeighbors.includes(word.text);

    if (isHovered) {
      hoveredWord = word;
    }

    // Draw point
    if (isSelected) {
      fill(255, 200, 0);
      stroke(0);
      strokeWeight(2);
      ellipse(word.x, word.y, 20, 20);
    } else if (isNeighbor) {
      fill(100, 255, 100);
      stroke(0);
      strokeWeight(1);
      ellipse(word.x, word.y, 16, 16);
    } else {
      fill(clusterColors[word.category]);
      stroke(0);
      strokeWeight(isHovered ? 2 : 1);
      ellipse(word.x, word.y, isHovered ? 14 : 10, isHovered ? 14 : 10);
    }

    // Draw label
    if (isHovered || isSelected || isNeighbor || showLabelsCheckbox.checked()) {
      fill(0);
      noStroke();
      textAlign(CENTER, BOTTOM);
      textSize(12 / zoom);
      text(word.text, word.x, word.y - 10);
    }
  }

  // Draw result word if vector arithmetic was performed
  if (resultWord) {
    fill(255, 0, 255);
    stroke(0);
    strokeWeight(2);
    ellipse(resultWord.x, resultWord.y, 18, 18);
    fill(255, 0, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12 / zoom);
    text('Result: ' + resultWord.text, resultWord.x, resultWord.y - 12);
  }

  // Draw lines to nearest neighbors
  if (selectedWord && nearestNeighbors.length > 0) {
    stroke(100, 255, 100, 150);
    strokeWeight(1);
    for (let neighborText of nearestNeighbors) {
      let neighbor = words.find(w => w.text === neighborText);
      if (neighbor) {
        line(selectedWord.x, selectedWord.y, neighbor.x, neighbor.y);
      }
    }
  }

  pop();

  // Draw legend
  let legendX = 15;
  let legendY = 45;
  textAlign(LEFT, TOP);
  textSize(12);
  noStroke();
  fill(0);
  text('Clusters:', legendX, legendY);
  legendY += 18;

  for (let category in clusterColors) {
    fill(clusterColors[category]);
    ellipse(legendX + 6, legendY + 6, 10, 10);
    fill(0);
    noStroke();
    text(category, legendX + 18, legendY);
    legendY += 16;
  }

  // Draw info panel
  if (hoveredWord || selectedWord) {
    let infoWord = hoveredWord || selectedWord;
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(canvasWidth - 160, 40, 150, 70, 10);

    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text('Word: ' + infoWord.text, canvasWidth - 150, 50);
    textSize(12);
    text('Category: ' + infoWord.category, canvasWidth - 150, 70);
    text('x: ' + infoWord.x.toFixed(1) + ', y: ' + infoWord.y.toFixed(1), canvasWidth - 150, 86);
  }

  // Draw similarity score if neighbors shown
  if (selectedWord && nearestNeighbors.length > 0) {
    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(canvasWidth - 160, 120, 150, 90, 10);

    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    text('Nearest Neighbors:', canvasWidth - 150, 130);
    let ny = 148;
    for (let i = 0; i < Math.min(4, nearestNeighbors.length); i++) {
      text((i+1) + '. ' + nearestNeighbors[i], canvasWidth - 150, ny);
      ny += 14;
    }
  }

  // Draw control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Zoom: ' + zoom.toFixed(1) + 'x', 10, drawHeight + 18);

  // Instructions
  textSize(11);
  fill(100);
  text('Click word to select, drag to pan', 10, drawHeight + 65);
}

function mousePressed() {
  if (mouseY < drawHeight) {
    if (hoveredWord) {
      selectedWord = hoveredWord;
      nearestNeighbors = [];
    } else {
      isDragging = true;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }
  }
}

function mouseDragged() {
  if (isDragging && mouseY < drawHeight) {
    offsetX += mouseX - lastMouseX;
    offsetY += mouseY - lastMouseY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseWheel(event) {
  if (mouseY < drawHeight) {
    zoom -= event.delta * 0.001;
    zoom = constrain(zoom, 0.5, 3);
    zoomSlider.value(zoom);
    return false;
  }
}

function findSimilarWords() {
  if (!selectedWord) {
    return;
  }

  // Calculate distances to all other words
  let distances = [];
  for (let word of words) {
    if (word.text !== selectedWord.text) {
      let d = dist(selectedWord.x, selectedWord.y, word.x, word.y);
      distances.push({ text: word.text, distance: d });
    }
  }

  // Sort by distance and get top 5
  distances.sort((a, b) => a.distance - b.distance);
  nearestNeighbors = distances.slice(0, 5).map(d => d.text);
}

function resetView() {
  offsetX = 0;
  offsetY = 0;
  zoom = 1;
  zoomSlider.value(1);
  selectedWord = null;
  nearestNeighbors = [];
  resultWord = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  zoomSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
