// Multiplicity Comparison Chart
// Compare algebraic and geometric multiplicity across different matrix types

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Three example cases
let cases = [
    {
        title: "Distinct Eigenvalues",
        matrix: [[2, 0], [0, 3]],
        charPoly: "(λ-2)(λ-3)",
        eigenvalues: [2, 3],
        algMult: [1, 1],
        geoMult: [1, 1],
        diagonalizable: true,
        color: [76, 175, 80] // Green
    },
    {
        title: "Repeated, Full Eigenspace",
        matrix: [[2, 0], [0, 2]],
        charPoly: "(λ-2)²",
        eigenvalues: [2],
        algMult: [2],
        geoMult: [2],
        diagonalizable: true,
        color: [33, 150, 243] // Blue
    },
    {
        title: "Defective Matrix",
        matrix: [[2, 1], [0, 2]],
        charPoly: "(λ-2)²",
        eigenvalues: [2],
        algMult: [2],
        geoMult: [1],
        diagonalizable: false,
        color: [244, 67, 54] // Red
    }
];

// Animation
let hoverCase = -1;
let expandedCase = -1;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    describe('Comparison chart showing three matrix types: distinct eigenvalues, repeated with full eigenspace, and defective matrix, comparing algebraic and geometric multiplicity', LABEL);
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

    // Title
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(18);
    text('Algebraic vs Geometric Multiplicity', canvasWidth / 2, 10);

    // Subtitle
    fill(100);
    textSize(12);
    text('Click cards to expand details', canvasWidth / 2, 32);

    // Draw the three comparison cards
    let cardWidth = (canvasWidth - 40) / 3;
    let cardHeight = drawHeight - 100;
    let startY = 55;

    for (let i = 0; i < cases.length; i++) {
        let x = 10 + i * (cardWidth + 10);
        let isHovered = hoverCase === i;
        let isExpanded = expandedCase === i;

        drawCard(x, startY, cardWidth, cardHeight, cases[i], isHovered, isExpanded);
    }

    // Check hover
    hoverCase = -1;
    for (let i = 0; i < cases.length; i++) {
        let x = 10 + i * (cardWidth + 10);
        if (mouseX >= x && mouseX <= x + cardWidth && mouseY >= startY && mouseY <= startY + cardHeight) {
            hoverCase = i;
            cursor(HAND);
            break;
        }
    }
    if (hoverCase === -1) {
        cursor(ARROW);
    }

    // Control area text
    fill(100);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text('Diagonalizable when: geometric multiplicity = algebraic multiplicity for all eigenvalues', canvasWidth / 2, drawHeight + 25);
}

function drawCard(x, y, w, h, caseData, isHovered, isExpanded) {
    // Card shadow
    if (isHovered) {
        fill(0, 0, 0, 30);
        noStroke();
        rect(x + 3, y + 3, w, h, 8);
    }

    // Card background
    let bgColor = isHovered ? color(255) : color(250);
    fill(bgColor);
    stroke(isHovered ? color(caseData.color[0], caseData.color[1], caseData.color[2]) : color(200));
    strokeWeight(isHovered ? 2 : 1);
    rect(x, y, w, h, 8);

    // Title bar
    fill(caseData.color[0], caseData.color[1], caseData.color[2]);
    noStroke();
    rect(x, y, w, 30, 8, 8, 0, 0);

    // Title text
    fill(255);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(caseData.title, x + w/2, y + 15);

    // Matrix display
    let matrixY = y + 45;
    drawMatrix(x + w/2, matrixY, caseData.matrix);

    // Characteristic polynomial
    fill(80);
    textSize(10);
    textAlign(CENTER, TOP);
    text('p(λ) = ' + caseData.charPoly, x + w/2, matrixY + 50);

    // Eigenvalue info
    let infoY = matrixY + 75;

    fill(0);
    textSize(9);
    textAlign(LEFT, TOP);

    let lineHeight = 16;

    // Eigenvalues
    text('Eigenvalues:', x + 8, infoY);
    fill(60);
    for (let i = 0; i < caseData.eigenvalues.length; i++) {
        text('λ = ' + caseData.eigenvalues[i], x + 12, infoY + lineHeight * (i + 1));
    }

    // Algebraic multiplicity
    let algY = infoY + lineHeight * (caseData.eigenvalues.length + 2);
    fill(0);
    text('Algebraic mult:', x + 8, algY);
    fill(60);
    for (let i = 0; i < caseData.algMult.length; i++) {
        text('m_a = ' + caseData.algMult[i], x + 12, algY + lineHeight * (i + 1));
    }

    // Geometric multiplicity
    let geoY = algY + lineHeight * (caseData.algMult.length + 2);
    fill(0);
    text('Geometric mult:', x + 8, geoY);
    fill(60);
    for (let i = 0; i < caseData.geoMult.length; i++) {
        text('m_g = ' + caseData.geoMult[i], x + 12, geoY + lineHeight * (i + 1));
    }

    // Ratio visualization
    let ratioY = geoY + lineHeight * (caseData.geoMult.length + 2) + 5;
    drawMultiplicityBar(x + 8, ratioY, w - 16, caseData);

    // Diagonalizable status
    let statusY = ratioY + 35;

    if (caseData.diagonalizable) {
        fill(76, 175, 80);
        textSize(11);
        textAlign(CENTER, TOP);
        text('✓ Diagonalizable', x + w/2, statusY);
    } else {
        fill(244, 67, 54);
        textSize(11);
        textAlign(CENTER, TOP);
        text('✗ NOT Diagonalizable', x + w/2, statusY);
    }

    // Additional insight
    let insightY = statusY + 20;
    fill(100);
    textSize(8);
    textAlign(CENTER, TOP);

    if (caseData.title === "Distinct Eigenvalues") {
        text('m_g = m_a = 1 for all', x + w/2, insightY);
    } else if (caseData.title === "Repeated, Full Eigenspace") {
        text('Already diagonal!', x + w/2, insightY);
    } else {
        text('m_g < m_a: deficient', x + w/2, insightY);
    }
}

function drawMatrix(cx, y, mat) {
    let cellW = 25;
    let cellH = 20;
    let n = mat.length;
    let matW = n * cellW;
    let matH = n * cellH;

    let x = cx - matW / 2;

    // Left bracket
    stroke(0);
    strokeWeight(1.5);
    noFill();
    line(x - 6, y - 3, x - 10, y - 3);
    line(x - 10, y - 3, x - 10, y + matH + 3);
    line(x - 10, y + matH + 3, x - 6, y + matH + 3);

    // Right bracket
    line(x + matW + 6, y - 3, x + matW + 10, y - 3);
    line(x + matW + 10, y - 3, x + matW + 10, y + matH + 3);
    line(x + matW + 10, y + matH + 3, x + matW + 6, y + matH + 3);

    // Matrix values
    fill(0);
    noStroke();
    textSize(11);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            text(mat[i][j], x + j * cellW + cellW/2, y + i * cellH + cellH/2);
        }
    }
}

function drawMultiplicityBar(x, y, w, caseData) {
    // Background
    fill(240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, w, 20, 3);

    // Label
    fill(80);
    noStroke();
    textSize(8);
    textAlign(LEFT, TOP);
    text('m_g / m_a:', x, y - 10);

    // Calculate total algebraic multiplicity
    let totalAlg = caseData.algMult.reduce((a, b) => a + b, 0);
    let totalGeo = caseData.geoMult.reduce((a, b) => a + b, 0);

    // Geometric bar (filled portion)
    let geoWidth = (totalGeo / totalAlg) * (w - 4);

    if (totalGeo === totalAlg) {
        fill(76, 175, 80); // Green - full
    } else {
        fill(244, 67, 54); // Red - deficient
    }
    noStroke();
    rect(x + 2, y + 2, geoWidth, 16, 2);

    // Ratio text
    fill(255);
    textSize(9);
    textAlign(CENTER, CENTER);
    text(totalGeo + '/' + totalAlg, x + w/2, y + 10);
}

function mousePressed() {
    let cardWidth = (canvasWidth - 40) / 3;
    let cardHeight = drawHeight - 100;
    let startY = 55;

    for (let i = 0; i < cases.length; i++) {
        let x = 10 + i * (cardWidth + 10);
        if (mouseX >= x && mouseX <= x + cardWidth && mouseY >= startY && mouseY <= startY + cardHeight) {
            expandedCase = (expandedCase === i) ? -1 : i;
            break;
        }
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    canvasWidth = Math.floor(container.width);
}
