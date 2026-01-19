# WEBGL Fixes to Remember

When creating p5.js sketches with WEBGL mode, these issues commonly arise and need to be addressed.

## 1. Controls Must Be Parented to Container

When using `position()` on p5.js DOM elements (sliders, buttons, checkboxes), they must be parented to the same container as the canvas for positioning to work correctly in iframes.

**Problem:** Controls positioned with `position()` appear outside the visible area or don't show at all.

**Fix:** Add `.parent(container)` to all controls:

```javascript
function createControls() {
    const container = document.querySelector('main');

    xSlider = createSlider(-5, 5, 3, 0.1);
    xSlider.parent(container);  // Add this line
    xSlider.position(sliderLeftMargin, drawHeight + 15);
    xSlider.size(canvasWidth/2 - sliderLeftMargin - margin);

    // Same for all other controls...
}
```

Also ensure the container has `position: relative` in CSS:

```css
main {
    position: relative;
}
```

## 2. No setLineDash() in WEBGL Mode

The 2D canvas method `drawingContext.setLineDash()` does not work in WEBGL mode because the drawing context is WebGL, not 2D canvas.

**Problem:** Error: `"setLineDash" could not be called as a function`

**Fix:** Draw dashed lines manually using line segments:

```javascript
// Instead of:
// drawingContext.setLineDash([5, 5]);
// line(x1, y1, x2, y2);
// drawingContext.setLineDash([]);

// Use this function:
function drawDashedLine2D(x1, y1, x2, y2) {
    let steps = 10;
    for (let i = 0; i < steps; i += 2) {
        let t1 = i / steps;
        let t2 = (i + 1) / steps;
        let sx = lerp(x1, x2, t1);
        let sy = lerp(y1, y2, t1);
        let ex = lerp(x1, x2, t2);
        let ey = lerp(y1, y2, t2);
        line(sx, sy, ex, ey);
    }
}
```

## 3. Font Must Be Loaded for Text in WEBGL

WEBGL mode requires explicitly loading a font before using `text()`. The default font doesn't work.

**Problem:** Error: `WEBGL: you must load and set a font before drawing text`

**Fix:** Load a font in `preload()` and set it in `setup()`:

```javascript
let font;

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
    createCanvas(canvasWidth, canvasHeight, WEBGL);
    textFont(font);
    // ...
}
```

Alternative font URLs:
- `https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf`
- `https://cdn.jsdelivr.net/gh/processing/p5.js-website@main/src/assets/fonts/Inconsolata-Bold.otf`

## 4. Coordinate System Differences

In WEBGL mode, the origin (0,0) is at the center of the canvas, not the top-left corner.

**Fix:** Use `translate()` to adjust for screen-space drawing:

```javascript
function drawInfo() {
    push();
    resetMatrix();
    translate(-canvasWidth/2, -canvasHeight/2);  // Move origin to top-left

    // Now draw using standard screen coordinates
    text('Title', canvasWidth/2, 10);

    pop();
}
```

## Summary Checklist

When creating a WEBGL sketch:

- [ ] Load font in `preload()` and set with `textFont()` in `setup()`
- [ ] Parent all DOM controls to the canvas container
- [ ] Add `position: relative` to container CSS
- [ ] Use manual dashed line functions instead of `setLineDash()`
- [ ] Remember origin is at center, use `translate()` for screen-space drawing
