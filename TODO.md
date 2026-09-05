# TODO

<!-- p5js-v2-audit-2026-09-05 -->
## p5.js 2.x Upgrade: MicroSim Fixes Needed (2026-09-05)

A static scan of this repo's `docs/sims/` MicroSims found **28 sim(s)** using p5.js v1-only APIs that will break if upgraded to p5.js 2.x (the microsim-generator skill's templates now default to p5@2.3.2). Fix these before bumping this repo's MicroSims past p5@1.x.

- [ ] **camera-calibration** (`docs/sims/camera-calibration/`)
    - `camera-calibration.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **camera-model-visualizer** (`docs/sims/camera-model-visualizer/`)
    - `camera-model-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **coordinate-system-3d** (`docs/sims/coordinate-system-3d/`)
    - `coordinate-system-3d.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **dot-cross-product-visualizer** (`docs/sims/dot-cross-product-visualizer/`)
    - `dot-cross-product-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **epipolar-geometry** (`docs/sims/epipolar-geometry/`)
    - `epipolar-geometry.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **euler-angles-visualizer** (`docs/sims/euler-angles-visualizer/`)
    - `euler-angles-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **gaussian-elimination** (`docs/sims/gaussian-elimination/`)
    - `gaussian-elimination.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **gimbal-lock-demo** (`docs/sims/gimbal-lock-demo/`)
    - `gimbal-lock-demo.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **gradient-descent** (`docs/sims/gradient-descent/`)
    - `gradient-descent.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **gram-schmidt** (`docs/sims/gram-schmidt/`)
    - `gram-schmidt.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **gram-schmidt-ch8** (`docs/sims/gram-schmidt-ch8/`)
    - `gram-schmidt-ch8.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **hessian-curvature-visualizer** (`docs/sims/hessian-curvature-visualizer/`)
    - `hessian-curvature-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **homogeneous-systems** (`docs/sims/homogeneous-systems/`)
    - `homogeneous-systems.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **least-squares-visualizer** (`docs/sims/least-squares-visualizer/`)
    - `least-squares-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **lidar-point-cloud** (`docs/sims/lidar-point-cloud/`)
    - `lidar-point-cloud.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **matrix-rank-visualizer** (`docs/sims/matrix-rank-visualizer/`)
    - `matrix-rank-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **point-cloud-visualizer** (`docs/sims/point-cloud-visualizer/`)
    - `point-cloud-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **positive-definiteness** (`docs/sims/positive-definiteness/`)
    - `positive-definiteness.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **projection-subspace** (`docs/sims/projection-subspace/`)
    - `projection-subspace.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **quaternion-rotation** (`docs/sims/quaternion-rotation/`)
    - `quaternion-rotation.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **ref-vs-rref** (`docs/sims/ref-vs-rref/`)
    - `ref-vs-rref.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **rigid-body-transform** (`docs/sims/rigid-body-transform/`)
    - `rigid-body-transform.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **row-operations** (`docs/sims/row-operations/`)
    - `row-operations.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **solution-sets** (`docs/sims/solution-sets/`)
    - `solution-sets.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **system-geometry** (`docs/sims/system-geometry/`)
    - `system-geometry.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **triangulation-visualizer** (`docs/sims/triangulation-visualizer/`)
    - `triangulation-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **vector-2d-3d-visualizer** (`docs/sims/vector-2d-3d-visualizer/`)
    - `vector-2d-3d-visualizer.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **volume-scaling-3d** (`docs/sims/volume-scaling-3d/`)
    - `volume-scaling-3d.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.

Reference: [p5.js Teachers' Guide to v2 transition](https://p5js.org/tutorials/v2_transition/)
