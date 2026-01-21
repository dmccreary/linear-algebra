// Rule of Sarrus Visualizer
// Step-by-step animation showing how to compute 3×3 determinants using Sarrus' rule

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// Matrix values
let matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

// Animation state
let currentStep = 0;
let totalSteps = 7; // 0=initial, 1-3 positive diagonals, 4-6 negative diagonals, 7=result
let isPlaying = false;
let animationSpeed = 1;
let lastStepTime = 0;
let stepInterval = 1500;

// Diagonal products
let posProducts = [];
let negProducts = [];

// Controls
let stepButton;
let playButton;
let resetButton;
let speedSlider;
let exampleSelect;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    calculateProducts();

    // Create controls
    stepButton = createButton('Step');
    stepButton.position(10, drawHeight + 10);
    stepButton.mousePressed(nextStep);

    playButton = createButton('Play');
    playButton.position(60, drawHeight + 10);
    playButton.mousePressed(togglePlay);

    resetButton = createButton('Reset');
    resetButton.position(115, drawHeight + 10);
    resetButton.mousePressed(resetAnimation);

    speedSlider = createSlider(0.5, 3, 1, 0.5);
    speedSlider.position(sliderLeftMargin, drawHeight + 10);
    speedSlider.size(canvasWidth - sliderLeftMargin - margin);

    exampleSelect = createSelect();
    exampleSelect.position(10, drawHeight + 45);
    exampleSelect.option('Custom');
    exampleSelect.option('Identity');
    exampleSelect.option('Rotation');
    exampleSelect.option('Singular');
    exampleSelect.changed(changeExample);

    describe('Interactive Rule of Sarrus visualizer showing step-by-step 3x3 determinant calculation with animated diagonal highlighting', LABEL);
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
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Update animation speed
    animationSpeed = speedSlider.value();
    stepInterval = 1500 / animationSpeed;

    // Auto-advance if playing
    if (isPlaying && millis() - lastStepTime > stepInterval) {
        nextStep();
        lastStepTime = millis();
        if (currentStep === 0) {
            isPlaying = false;
            playButton.html('Play');
        }
    }

    // Draw title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Rule of Sarrus Visualizer', canvasWidth / 2, 10);

    // Draw extended matrix
    drawExtendedMatrix();

    // Draw diagonal lines based on current step
    drawDiagonals();

    // Draw calculation progress
    drawCalculation();

    // Update control positions
    speedSlider.size(canvasWidth - sliderLeftMargin - margin);

    // Draw slider label
    fill('black');
    noStroke();
    textSize(14);
    textAlign(LEFT, CENTER);
    text('Speed: ' + animationSpeed.toFixed(1) + 'x', sliderLeftMargin - 75, drawHeight + 20);
}

function drawExtendedMatrix() {
    let matrixX = canvasWidth / 2 - 125;
    let matrixY = 50;
    let cellW = 40;
    let cellH = 35;

    // Draw main matrix with brackets
    stroke(0);
    strokeWeight(2);
    noFill();

    // Left bracket
    line(matrixX - 5, matrixY - 5, matrixX - 12, matrixY - 5);
    line(matrixX - 12, matrixY - 5, matrixX - 12, matrixY + 3*cellH + 5);
    line(matrixX - 12, matrixY + 3*cellH + 5, matrixX - 5, matrixY + 3*cellH + 5);

    // Right bracket
    line(matrixX + 3*cellW + 5, matrixY - 5, matrixX + 3*cellW + 12, matrixY - 5);
    line(matrixX + 3*cellW + 12, matrixY - 5, matrixX + 3*cellW + 12, matrixY + 3*cellH + 5);
    line(matrixX + 3*cellW + 12, matrixY + 3*cellH + 5, matrixX + 3*cellW + 5, matrixY + 3*cellH + 5);

    // Draw cells - main matrix
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = matrixX + j * cellW;
            let y = matrixY + i * cellH;

            fill(255);
            stroke(180);
            strokeWeight(1);
            rect(x, y, cellW, cellH);

            fill(0);
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            text(matrix[i][j], x + cellW/2, y + cellH/2);
        }
    }

    // Draw extended columns (first two columns repeated)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            let x = matrixX + (3 + j) * cellW + 10;
            let y = matrixY + i * cellH;

            fill(240, 240, 255);
            stroke(180);
            strokeWeight(1);
            rect(x, y, cellW, cellH);

            fill(100);
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            text(matrix[i][j], x + cellW/2, y + cellH/2);
        }
    }

    // Label
    fill(100);
    textSize(11);
    textAlign(CENTER, TOP);
    text('Extended columns', matrixX + 3.5*cellW + 10 + cellW/2, matrixY + 3*cellH + 10);
}

function drawDiagonals() {
    let matrixX = canvasWidth / 2 - 125;
    let matrixY = 50;
    let cellW = 40;
    let cellH = 35;

    // Positive diagonals (top-left to bottom-right) - steps 1, 2, 3
    let posColors = [color(0, 180, 0), color(0, 150, 0), color(0, 120, 0)];
    for (let d = 0; d < 3; d++) {
        if (currentStep >= d + 1) {
            let alpha = (currentStep === d + 1) ? 255 : 150;
            let col = posColors[d];
            col.setAlpha(alpha);
            stroke(col);
            strokeWeight(currentStep === d + 1 ? 4 : 2);

            let startX = matrixX + d * cellW + cellW/2;
            let startY = matrixY + cellH/2;
            let endX = matrixX + (d + 2) * cellW + cellW/2 + (d > 0 ? 10 : 0);
            let endY = matrixY + 2.5 * cellH;

            line(startX, startY, endX, endY);

            // Highlight cells
            if (currentStep === d + 1) {
                for (let i = 0; i < 3; i++) {
                    let cx = matrixX + (d + i) * cellW + (d + i >= 3 ? 10 : 0);
                    let cy = matrixY + i * cellH;
                    noFill();
                    stroke(col);
                    strokeWeight(3);
                    rect(cx, cy, cellW, cellH, 5);
                }
            }
        }
    }

    // Negative diagonals (top-right to bottom-left) - steps 4, 5, 6
    let negColors = [color(200, 0, 0), color(170, 0, 0), color(140, 0, 0)];
    for (let d = 0; d < 3; d++) {
        if (currentStep >= d + 4) {
            let alpha = (currentStep === d + 4) ? 255 : 150;
            let col = negColors[d];
            col.setAlpha(alpha);
            stroke(col);
            strokeWeight(currentStep === d + 4 ? 4 : 2);

            let startX = matrixX + (2 + d) * cellW + cellW/2 + (d > 0 ? 10 : 0);
            let startY = matrixY + cellH/2;
            let endX = matrixX + d * cellW + cellW/2 + (d >= 3 ? 10 : 0);
            let endY = matrixY + 2.5 * cellH;

            line(startX, startY, endX, endY);

            // Highlight cells
            if (currentStep === d + 4) {
                for (let i = 0; i < 3; i++) {
                    let col_idx = (2 + d - i);
                    let cx = matrixX + col_idx * cellW + (col_idx >= 3 ? 10 : 0);
                    let cy = matrixY + i * cellH;
                    noFill();
                    stroke(col);
                    strokeWeight(3);
                    rect(cx, cy, cellW, cellH, 5);
                }
            }
        }
    }
}

function drawCalculation() {
    let calcX = 20;
    let calcY = 200;

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    // Positive products
    text('Positive diagonals:', calcX, calcY);
    for (let i = 0; i < 3; i++) {
        let shown = currentStep > i;
        let active = currentStep === i + 1;

        if (shown) {
            fill(active ? color(0, 180, 0) : color(100));
        } else {
            fill(200);
        }
        textSize(12);

        let a = matrix[0][i];
        let b = matrix[1][(i+1)%3];
        let c = matrix[2][(i+2)%3];

        text((i+1) + '. ' + a + '×' + b + '×' + c + ' = ' + (a*b*c), calcX + 10, calcY + 20 + i*18);
    }

    // Negative products
    fill(0);
    textSize(14);
    text('Negative diagonals:', calcX, calcY + 80);
    for (let i = 0; i < 3; i++) {
        let shown = currentStep > i + 3;
        let active = currentStep === i + 4;

        if (shown) {
            fill(active ? color(200, 0, 0) : color(100));
        } else {
            fill(200);
        }
        textSize(12);

        let a = matrix[0][2-i];
        let b = matrix[1][(4-i)%3];
        let c = matrix[2][(3-i)%3];

        text((i+1) + '. ' + a + '×' + b + '×' + c + ' = ' + (a*b*c), calcX + 10, calcY + 100 + i*18);
    }

    // Final result
    if (currentStep === 7 || currentStep === 0) {
        let det = calculateDeterminant();
        let posSum = posProducts.reduce((a, b) => a + b, 0);
        let negSum = negProducts.reduce((a, b) => a + b, 0);

        fill(0);
        textSize(14);
        textAlign(LEFT, TOP);
        text('Result:', calcX, calcY + 165);

        textSize(12);
        fill(0, 150, 0);
        text('+ ' + posSum, calcX + 10, calcY + 185);

        fill(200, 0, 0);
        text('- ' + negSum, calcX + 60, calcY + 185);

        fill(0);
        textSize(16);
        text('= ' + det, calcX + 110, calcY + 183);

        // Status indicator
        textSize(12);
        if (det === 0) {
            fill(150);
            text('(Singular matrix)', calcX + 10, calcY + 205);
        }
    }

    // Step indicator
    fill(100);
    textSize(12);
    textAlign(RIGHT, TOP);
    text('Step ' + currentStep + '/7', canvasWidth - 20, calcY);
}

function calculateProducts() {
    posProducts = [];
    negProducts = [];

    // Positive diagonals
    for (let i = 0; i < 3; i++) {
        posProducts.push(matrix[0][i] * matrix[1][(i+1)%3] * matrix[2][(i+2)%3]);
    }

    // Negative diagonals
    for (let i = 0; i < 3; i++) {
        negProducts.push(matrix[0][2-i] * matrix[1][(4-i)%3] * matrix[2][(3-i)%3]);
    }
}

function calculateDeterminant() {
    let posSum = posProducts.reduce((a, b) => a + b, 0);
    let negSum = negProducts.reduce((a, b) => a + b, 0);
    return posSum - negSum;
}

function nextStep() {
    currentStep++;
    if (currentStep > 7) {
        currentStep = 0;
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    playButton.html(isPlaying ? 'Pause' : 'Play');
    lastStepTime = millis();
}

function resetAnimation() {
    currentStep = 0;
    isPlaying = false;
    playButton.html('Play');
}

function changeExample() {
    let selected = exampleSelect.value();

    if (selected === 'Identity') {
        matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    } else if (selected === 'Rotation') {
        // 90-degree rotation around z-axis
        matrix = [[0, -1, 0], [1, 0, 0], [0, 0, 1]];
    } else if (selected === 'Singular') {
        matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    }

    calculateProducts();
    resetAnimation();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
