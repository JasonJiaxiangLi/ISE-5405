// Column geometry, adapted from the authorized Simplex Part 2 reference.
// Its schematic figures have no numeric axes. These explicitly constructed
// coordinates realize their incidences and pivot sequence; they are not
// claimed to be the reference author's numerical data.
export const columnModel = Object.freeze({
  points: { B: [.5, .5, 7], C: [3, 0, 4], D: [0, 3, 4], E: [2, .5, 1], F: [0, 0, 4] },
  requirement: [1, 1],
  outsideRequirement: [2.4, 2.4],
  intersections: { I: [1, 1, 5.5], H: [1, 1, 4], G: [1, 1, 2.5] },
  bases: {
    CDF: { names: ['C', 'D', 'F'], weights: [1 / 3, 1 / 3, 1 / 3], cost: 4 },
    BCD: { names: ['B', 'C', 'D'], weights: [.5, .25, .25], cost: 5.5 },
    DEF: { names: ['D', 'E', 'F'], weights: [.25, .5, .25], cost: 2.5 },
  },
  directionEnteringE: { C: -2 / 3, D: -1 / 6, F: -1 / 6, E: 1 },
  ratioBoundsEnteringE: [.5, 2, 2],
  currentPlane: [0, 0, 4],
  optimalPlane: [-1.5, 0, 4],
});

export const example310 = Object.freeze({
  a: [5, 1, -2, -3, 3, 4, 2, -1],
  c: [7, 6, 6, 5, 2, 8, 5, 3],
  b: 0,
  states: [
    { basis: [3, 6], weights: [2 / 3, 1 / 3], slope: 1 / 3, intercept: 20 / 3, entering: 5, leaving: 6, step: 2 / 5 },
    { basis: [3, 5], weights: [3 / 5, 2 / 5], slope: -4 / 5, intercept: 22 / 5, entering: 8, leaving: 3, step: 3 / 4 },
    { basis: [5, 8], weights: [1 / 4, 3 / 4], slope: -1 / 4, intercept: 11 / 4, entering: null, leaving: null, step: null },
  ],
});

const COLORS = { ink: '#263943', blue: '#326b8c', green: '#177441', orange: '#b95013', maroon: '#861f41', grid: '#a8b7bf' };
const DEFAULT_CAMERA = { yaw: -.65, pitch: .35 };
const raw = String.raw;
const box = (body, tone = 'blue', reveal = '') => `<section class="l10-box" data-tone="${tone}"${reveal ? ` data-reveal="${reveal}"` : ''}>${body}</section>`;
const pair = (body, figure) => `<div class="l10-pair"><div class="l10-stack">${body}</div>${figure}</div>`;
const math = text => `<div class="l10-math">${text}</div>`;
const p = text => `<p>${text}</p>`;
const f = value => Number(value.toFixed(5));

function cameraProject(point, yaw = DEFAULT_CAMERA.yaw, pitch = DEFAULT_CAMERA.pitch) {
  // One orthographic camera, shared by all world points, planes and labels.
  // Horizontal chart units use 1.7 times the vertical chart scale.
  const x = 1.7 * (point[0] - 1.1), y = 1.7 * (point[1] - 1.1), z = point[2] - 3.5;
  const left = Math.cos(yaw) * x - Math.sin(yaw) * y;
  const back = Math.sin(yaw) * x + Math.cos(yaw) * y;
  return [290 + 82 * left, 180 + 42 * (Math.sin(pitch) * back - Math.cos(pitch) * z), Math.cos(pitch) * back + Math.sin(pitch) * z];
}

function sceneMarkup(kind, yaw = DEFAULT_CAMERA.yaw, pitch = DEFAULT_CAMERA.pitch, hinge = 0) {
  // Keep the full teaching object in view while rotating. The bounds include
  // both hinge endpoints, so dragging the pivot slider never rescales a scene.
  const framePoints = [...Object.values(columnModel.points), ...Object.values(columnModel.intersections),
    [-.25, -.25, 0], [-.25, -.25, 7.1], [3.4, 0, 0], [0, 1.7, 0],
    [1.8, 1.5, 0], [2.4, 2.4, 0], [2.4, 2.4, 7.6], [.5, 2.5, 0],
    [-.15, 3.15, 4], [3.15, -.15, -.725], [2.1, 2.1, 4]];
  const projectedFrame = framePoints.map(point => cameraProject(point, yaw, pitch));
  const xs = projectedFrame.map(point => point[0]), ys = projectedFrame.map(point => point[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const fit = Math.min(1, 470 / (xmax - xmin), 295 / (ymax - ymin));
  const project = point => {
    const q = cameraProject(point, yaw, pitch);
    return [290 + fit * (q[0] - (xmin + xmax) / 2), 175 + fit * (q[1] - (ymin + ymax) / 2), q[2]];
  };
  const pointList = points => points.map(point => project(point).slice(0, 2).map(f).join(',')).join(' ');
  const line = (a, b, color = COLORS.ink, width = 2, dashed = false, extra = '') => {
    const u = project(a), v = project(b);
    return `<line x1="${f(u[0])}" y1="${f(u[1])}" x2="${f(v[0])}" y2="${f(v[1])}" stroke="${color}" stroke-width="${width}"${dashed ? ' stroke-dasharray="6 5"' : ''} ${extra}/>`;
  };
  const label = (point, text, dx = 10, dy = -8, color = COLORS.ink, small = false) => {
    const q = project(point);
    return `<text x="${f(q[0] + dx)}" y="${f(q[1] + dy)}" style="fill:${color}"${small ? ' class="l10-plot-small"' : ''}>${text}</text>`;
  };
  const dot = (point, name, color = COLORS.ink, radius = 5, offset = [10, -8]) => {
    const q = project(point);
    return `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${radius}" fill="${color}" stroke="white" stroke-width="2" data-world="${point.join(',')}"/>${name ? label(point, name, ...offset, color) : ''}`;
  };
  const polygon = (points, color, opacity = .2, width = 2) => `<polygon points="${pointList(points)}" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-width="${width}"/>`;
  const pts = columnModel.points;
  const floor = [[-.25, -.25, 0], [3.3, -.25, 0], [1.8, 1.5, 0], [-.25, 1.5, 0]];
  let result = polygon(floor, '#c7d3da', .13, 1);
  result += line([0, 0, 0], [3.4, 0, 0], COLORS.grid) + line([0, 0, 0], [0, 1.7, 0], COLORS.grid);
  result += line([-.25, -.25, 0], [-.25, -.25, 7.1], COLORS.ink);
  result += label([-.25, -.25, 7.1], 'cost', -24, -8, COLORS.ink);
  if (kind === 'lift') {
    const lifted = [[.25, .4, 4.5], [2.1, .3, 3], [.5, 2.5, 6.5], [2.6, 2.5, 4]];
    lifted.forEach((point, i) => {
      const base = [point[0], point[1], 0];
      result += line(base, point, COLORS.blue, 2.5) + dot(base, `${i + 1}`, COLORS.blue, 3, i === 1 ? [-32, -5] : [8, 15]);
      result += dot(point, `${i + 1}`, COLORS.blue, 5);
    });
    return result + line([1.3, 1.4, 0], [1.3, 1.4, 7.4], COLORS.maroon, 3) + dot([1.3, 1.4, 0], 'b', COLORS.maroon, 4);
  }
  const tetra = ['tetrahedron', 'faces', 'leaving', 'hinge'].includes(kind);
  const triangleOnly = kind === 'triangle';
  const basis = kind === 'candidate-b' ? ['B', 'C', 'D'] : ['candidate-e', 'optimal-plane'].includes(kind) ? ['D', 'E', 'F'] : ['C', 'D', 'F'];
  const faces = tetra ? [['C', 'D', 'F'], ['C', 'D', 'E'], ['C', 'E', 'F'], ['D', 'E', 'F']] : triangleOnly ? [['C', 'D', 'F']] : [['B', 'C', 'D'], ['B', 'C', 'F'], ['B', 'D', 'F'], ['E', 'C', 'D'], ['E', 'C', 'F'], ['E', 'D', 'F']];
  // Depth sorting only changes paint order. Teaching stages are separate slides.
  const sorted = faces.map(names => ({ names, depth: names.reduce((s, name) => s + project(pts[name])[2], 0) / names.length })).sort((a, b) => b.depth - a.depth);
  sorted.forEach(({ names }) => { result += polygon(names.map(name => pts[name]), COLORS.blue, .045, 1); });
  if (kind === 'dual-plane' || kind === 'gaps' || kind === 'optimal-plane') {
    const plane = kind === 'optimal-plane' ? columnModel.optimalPlane : columnModel.currentPlane;
    const corners = [[-.15, -.15], [3.15, -.15], [2.1, 2.1], [-.15, 3.15]].map(([x, y]) => [x, y, plane[0] * x + plane[1] * y + plane[2]]);
    result += polygon(corners, COLORS.orange, .12, 1.5);
  }
  result += polygon(basis.map(name => pts[name]), kind === 'candidate-b' ? COLORS.orange : kind === 'candidate-e' || kind === 'optimal-plane' ? COLORS.green : COLORS.blue, .24, 3);
  if (kind === 'leaving' || kind === 'faces' || kind === 'hinge') result += polygon(['D', 'E', 'F'].map(name => pts[name]), COLORS.green, .18, 3);
  if (kind === 'gaps' || kind === 'dual-plane') {
    ['B', 'E'].forEach(name => { const point = pts[name]; result += line([point[0], point[1], 4], point, name === 'E' ? COLORS.green : COLORS.orange, 5); });
  }
  if (kind === 'optimal-plane') {
    ['B', 'C'].forEach(name => { const point = pts[name]; result += line([point[0], point[1], 4 - 1.5 * point[0]], point, COLORS.orange, 3, true); });
  }
  if (kind !== 'triangle' && kind !== 'tetrahedron') {
    const b = kind === 'infeasible' ? columnModel.outsideRequirement : columnModel.requirement;
    result += line([...b, 0], [...b, 7.6], COLORS.maroon, 2.5, true);
    result += dot([...b, 0], kind === 'infeasible' ? 'b′' : 'b', COLORS.maroon, 4, [9, 12]);
    if (kind !== 'infeasible') {
      result += line(columnModel.intersections.G, columnModel.intersections.I, COLORS.maroon, 5);
      const selected = kind === 'candidate-b' ? 'I' : ['candidate-e', 'optimal-plane', 'leaving'].includes(kind) ? 'G' : 'H';
      Object.entries(columnModel.intersections).forEach(([name, point]) => {
        result += dot(point, name, name === 'G' ? COLORS.green : name === 'I' ? COLORS.orange : COLORS.maroon, name === selected ? 7 : 4.5, name === 'G' ? [-32, 8] : [-30, -6]);
      });
    }
  }
  Object.entries(pts).filter(([name]) => !tetra || name !== 'B').filter(([name]) => !triangleOnly || ['C', 'D', 'F'].includes(name)).forEach(([name, point]) => {
    const color = name === 'E' ? COLORS.green : name === 'B' ? COLORS.orange : COLORS.ink;
    result += dot(point, name, color, 5.5, name === 'D' ? [15, -5] : name === 'E' ? [12, 9] : name === 'F' ? [-24, -3] : [10, -8]);
  });
  if (kind === 'hinge') {
    const moved = pts.C.map((value, i) => (1 - hinge) * value + hinge * pts.E[i]);
    result += polygon([moved, pts.D, pts.F], COLORS.maroon, .3, 3);
    result += line(pts.D, pts.F, COLORS.maroon, 5);
    result += line(pts.C, pts.E, COLORS.green, 2, true);
    const height = 4 - 3 * hinge / (3 - hinge);
    result += dot([1, 1, height], '', COLORS.maroon, 8);
    result += dot(moved, hinge === 0 ? '' : hinge === 1 ? '' : 'moving corner', COLORS.maroon, 6, [10, -12]);
  }
  return result;
}

function columnFigure(kind = 'hull', { hinge = false, print = false } = {}) {
  const t = print && hinge ? 1 : 0;
  const description = {
    lift: 'Four columns at the horizontal floor, each joined vertically to its lifted point at objective height. The requirement line passes through b.',
    infeasible: 'The requirement line at the changed target (2.4,2.4) misses the convex hull of lifted points B, C, D, E and F.',
    triangle: 'The three noncollinear lifted points C, D and F form a triangle.',
    tetrahedron: 'Noncoplanar points C, D, E and F form a tetrahedron with four triangular faces.',
    faces: 'Tetrahedron CDEF with old face CDF and candidate replacement faces CDE, CEF and DEF. The requirement line meets CDF at H and DEF at G.',
    leaving: 'The requirement line passes through the tetrahedron from H on CDF to G on DEF. Point C leaves and E enters.',
    hinge: 'The triangle hinges about its fixed edge DF as corner C moves toward E. Its intersection with the requirement line descends from H to G.',
    'candidate-b': 'The highlighted new basic triangle BCD meets the requirement line at I, above the previous intersection H.',
    'candidate-e': 'The highlighted new basic triangle DEF meets the requirement line at G, below the previous intersection H.',
    'optimal-plane': 'The supporting plane through D, E and F is below every other lifted point. G attains its height at the requirement.',
  }[kind] || 'Lifted points B, C, D, E and F; the shaded basic triangle CDF; and the requirement line with feasible intersections I, H and G in descending cost order.';
  return `<figure class="l10-column-figure" data-column-view="${kind}" data-hinge="${t}">
    <svg class="l10-column-svg" viewBox="0 0 580 350" role="img" tabindex="0" aria-label="${description} Drag to rotate; arrow keys rotate while focused.">
      <g data-column-scene>${sceneMarkup(kind, DEFAULT_CAMERA.yaw, DEFAULT_CAMERA.pitch, t)}</g>
    </svg>
    ${print ? '' : `<div class="l10-column-controls" data-screen-only><button type="button" data-column-reset>Reset view</button><span class="l10-column-instruction">Drag or use arrow keys to rotate.</span>${hinge ? '<label>Pivot progress <input type="range" min="0" max="1" step="0.05" value="0" data-column-hinge aria-label="Move the leaving corner C toward E"></label>' : ''}</div>`}
    ${hinge ? `<p class="l10-column-status" role="status" data-column-status>${print ? 'New triangle DEF; cost 2.50.' : 'Initial triangle CDF; cost 4.00.'}</p>` : ''}
  </figure>`;
}

function mountColumnGeometry({ slideElement }) {
  const root = slideElement.querySelector('[data-column-view]');
  if (!root) return undefined;
  const svg = root.querySelector('svg'), group = root.querySelector('[data-column-scene]');
  const reset = root.querySelector('[data-column-reset]'), slider = root.querySelector('[data-column-hinge]');
  let yaw = DEFAULT_CAMERA.yaw, pitch = DEFAULT_CAMERA.pitch, dragging = null, last = [0, 0];
  const update = () => {
    const t = slider ? Number(slider.value) : 0;
    group.innerHTML = sceneMarkup(root.dataset.columnView, yaw, pitch, t);
    root.dataset.camera = JSON.stringify([yaw, pitch]);
    root.dataset.hinge = String(t);
    if (slider) {
      const height = 4 - 3 * t / (3 - t);
      const status = `${t === 0 ? 'Initial triangle CDF' : t === 1 ? 'New triangle DEF' : `Pivot progress ${Math.round(100 * t)}%`}; cost ${height.toFixed(2)}.`;
      root.querySelector('[data-column-status]').textContent = status;
      slider.setAttribute('aria-valuetext', status);
    }
  };
  const down = event => { if (event.button !== 0) return; dragging = event.pointerId; last = [event.clientX, event.clientY]; svg.setPointerCapture(event.pointerId); svg.style.cursor = 'grabbing'; };
  const move = event => { if (dragging !== event.pointerId) return; yaw += .008 * (event.clientX - last[0]); pitch = Math.max(.1, Math.min(1.25, pitch + .006 * (event.clientY - last[1]))); last = [event.clientX, event.clientY]; update(); };
  const up = event => { if (event.pointerId !== dragging) return; if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId); dragging = null; svg.style.cursor = 'grab'; };
  const key = event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    if (event.key === 'ArrowLeft') yaw -= .12;
    if (event.key === 'ArrowRight') yaw += .12;
    if (event.key === 'ArrowUp') pitch = Math.min(1.25, pitch + .08);
    if (event.key === 'ArrowDown') pitch = Math.max(.1, pitch - .08);
    update();
  };
  const resetView = () => { yaw = DEFAULT_CAMERA.yaw; pitch = DEFAULT_CAMERA.pitch; update(); };
  const handlers = [[svg, 'pointerdown', down], [svg, 'pointermove', move], [svg, 'pointerup', up], [svg, 'pointercancel', up], [svg, 'lostpointercapture', up], [svg, 'keydown', key], [reset, 'click', resetView], ...(slider ? [[slider, 'input', update]] : [])];
  handlers.forEach(([element, event, handler]) => element.addEventListener(event, handler));
  update();
  // Render only on changes: no autonomous animation, including reduced motion.
  return () => { handlers.forEach(([element, event, handler]) => element.removeEventListener(event, handler)); if (dragging !== null && svg.hasPointerCapture(dragging)) svg.releasePointerCapture(dragging); };
}

function examplePlot(stateIndex = 0, all = false, onlyPoints = false) {
  const state = example310.states[stateIndex];
  const point = (a, c) => [58 + (a + 3.6) * 48, 330 - c * 32];
  const xy = values => values.map(f).join(',');
  const line = (start, end, color, width = 2, dash = false) => `<line x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" stroke="${color}" stroke-width="${width}"${dash ? ' stroke-dasharray="7 5"' : ''}/>`;
  let content = line(point(-3.5, 0), point(5.5, 0), COLORS.ink) + line(point(-3.5, 0), point(-3.5, 9), COLORS.ink);
  content += `<text x="20" y="30">cost</text><text x="493" y="360">a</text>`;
  content += line(point(0, 0), point(0, 9), COLORS.maroon, 3, true) + `<text x="${point(0, 0)[0] - 7}" y="360">b = 0</text>`;
  if (!onlyPoints) {
    content += line(point(-3.4, state.slope * -3.4 + state.intercept), point(5.3, state.slope * 5.3 + state.intercept), COLORS.orange, 2, true);
    const show = all ? [0, 1, 2] : [stateIndex];
    show.forEach(index => {
      const item = example310.states[index]; const coords = item.basis.map(label => point(example310.a[label - 1], example310.c[label - 1]));
      content += line(coords[0], coords[1], [COLORS.blue, COLORS.orange, COLORS.green][index], 4);
    });
    if (state.entering) {
      const j = state.entering - 1;
      content += line(point(example310.a[j], state.slope * example310.a[j] + state.intercept), point(example310.a[j], example310.c[j]), COLORS.green, 4, true);
    }
    const crossing = point(0, state.intercept);
    content += `<circle cx="${crossing[0]}" cy="${crossing[1]}" r="7" fill="${COLORS.maroon}" stroke="white" stroke-width="2"/>`;
  }
  example310.a.forEach((a, index) => {
    const q = point(a, example310.c[index]);
    content += `<circle cx="${q[0]}" cy="${q[1]}" r="5.5" fill="${state.basis.includes(index + 1) && !onlyPoints ? COLORS.maroon : COLORS.ink}" data-example310-point="${index + 1}" data-world="${a},${example310.c[index]}"/>`;
    content += `<text x="${q[0] + (index === 7 ? -23 : 10)}" y="${q[1] - 10}">${index + 1}</text>`;
  });
  return `<figure class="l10-column-figure"><svg class="l10-column-svg" viewBox="0 0 530 385" role="img" aria-label="Eight labeled lifted columns and the requirement line at b equals zero. ${onlyPoints ? 'Coordinates are given in the table.' : `Current basis ${state.basis.join(', ')}. ${state.entering ? `The entering point is ${state.entering}.` : 'Every point is on or above the optimal supporting line.'}`}" data-example310-state="${stateIndex}">${content}</svg>${all ? '<figcaption class="l10-column-key"><span style="--key-color:#326b8c">initial: 3, 6</span><span style="--key-color:#b95013">next: 3, 5</span><span style="--key-color:#177441">optimal: 5, 8</span></figcaption>' : ''}</figure>`;
}

const geometryCheckpoint = {
  prompt: 'A nonbasic lifted point is below the current dual plane. What does its signed vertical gap tell us?',
  choices: ['It is a negative reduced cost; a feasible positive step lowers the objective.', 'It gives the maximum feasible step.', 'It identifies the leaving basic point without a ratio test.', 'It proves that the original LP is infeasible.'],
  correctIndex: 0,
  explanation: 'The signed height difference is the reduced cost. It gives the objective slope. Feasibility and the ratio test still decide whether a positive step is possible and which variable leaves.',
  autoOpen: true,
};
const exampleCheckpoint = {
  prompt: 'In the final basis 5, 8, every lifted point is on or above the line through 5 and 8. Why is the current feasible mixture optimal?',
  choices: ['All eight points are basic.', 'The requirement line can no longer meet the convex hull.', 'Every convex combination lies on or above that line, so no feasible mixture at b can have lower cost.', 'Every feasible mixture must use exactly the same weights.'],
  correctIndex: 2,
  explanation: 'A supporting line bounds the cost of every convex combination from below. At the required horizontal coordinate, the mixture of points 5 and 8 attains the bound. Other optimal mixtures could exist in a different example.',
  autoOpen: true,
};

const slide = (key, title, html, referencePages, options = {}) => ({ key, title, html, referencePages, className: 'l10-column-slide', ...options });
const visualSlide = (key, title, body, kind, referencePages, options = {}) => slide(key, title, pair(body, columnFigure(kind)), referencePages, { onMount: mountColumnGeometry, ...options });

export const geometrySlides = [
  slide('column-geometry-model', 'Column geometry: use the variables as mixture weights',
    p('The same basis calculations have a second geometric interpretation.') +
    math(raw`\[\begin{aligned}\min\quad &c^\top x\\\text{s.t.}\quad &Ax=b,\quad \sum_{j=1}^{n}x_j=1,\quad x\ge0.\end{aligned}\]`) +
    box(p(raw`The added <strong>convexity constraint</strong> makes the variables nonnegative weights that sum to one. Here \(A\) has \(m\) rows.`)) +
    box(p('A bounded feasible LP can be reformulated this way. Self-study: derive such a reformulation by rescaling bounded nonnegative variables and adding one slack weight.'), 'orange', '1'), [91, 92]),

  visualSlide('lifted-columns', 'Lift each column to its objective height',
    p(raw`Set \(z=c^\top x\) and attach cost \(c_j\) to column \(A_j\):`) +
    math(raw`\[P_j=\begin{pmatrix}A_j\\c_j\end{pmatrix},\qquad\sum_jx_jP_j=\begin{pmatrix}b\\z\end{pmatrix}.\]`) +
    box(p(raw`For \(m=2\), columns live in the horizontal plane. Their costs provide the third coordinate. The vertical line passes through \(b\).`)) +
    p(raw`Each label \(j\) identifies column \(A_j\) at the floor and lifted point \(P_j\) above it.`), 'lift', [93, 94]),

  slide('column-coordinate-model', 'A concrete realization of the five-point picture',
    p('We will use these constructed coordinates throughout the 3D example. A point name also labels its mixture weight.') +
    `<div class="l10-table-wrap"><table class="l10-table l10-column-coordinates"><thead><tr><th>Point</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead><tbody><tr><th>${raw`\(A_{1j}\)`}</th><td>${raw`\(1/2\)`}</td><td>3</td><td>0</td><td>2</td><td>0</td></tr><tr><th>${raw`\(A_{2j}\)`}</th><td>${raw`\(1/2\)`}</td><td>0</td><td>3</td><td>${raw`\(1/2\)`}</td><td>0</td></tr><tr><th>${raw`\(c_j\)`}</th><td>7</td><td>4</td><td>4</td><td>1</td><td>4</td></tr></tbody></table></div>` +
    math(raw`\[\min\sum_jc_jx_j\quad\text{s.t.}\quad\sum_jA_jx_j=(1,1)^\top,\quad\sum_jx_j=1,\quad x_j\ge0.\]`) +
    p(raw`The target horizontal coordinate stays fixed at \(b=(1,1)\).`), [97]),

  visualSlide('requirement-line', 'Feasibility is an intersection with a vertical line',
    p(raw`A feasible weight vector places \((b,z)\) inside the convex hull of the lifted columns.`) +
    box(p(raw`The <strong>requirement line</strong> consists of all points \((b,z)\) with the same horizontal coordinate \(b\).`)) +
    box(p('The thick vertical segment contains all attainable costs. Its lowest point, G, is optimal.'), 'green', '1') +
    p('H and I are feasible too, but they sit higher.'),
    'hull', [95, 96, 97]),

  visualSlide('empty-requirement-line', 'If the line misses the hull, no mixture is feasible',
    p(raw`Keep the same five lifted columns, but change the requirement to \(b'=(2.4,2.4)\).`) +
    box(p(raw`Every column satisfies \(A_{1j}+A_{2j}\le3\). Therefore every convex combination satisfies the same inequality.`)) +
    math(raw`\[b'_1+b'_2=4.8>3.\]`) +
    box(p('The new requirement line never meets the hull. The LP is infeasible, regardless of its objective.'), 'orange', '1'),
    'infeasible', [96]),

  visualSlide('affine-independence', 'Affine independence gives a nonflat simplex',
    p(raw`Points \(v_1,\ldots,v_{k+1}\in\mathbb R^n\) are <strong>affinely independent</strong> when`) +
    math(raw`\[v_1-v_{k+1},\ldots,v_k-v_{k+1}\]`) +
    p(raw`are linearly independent. Necessarily \(k\le n\).`) +
    box(p(raw`Their convex hull is a <strong>\(k\)-dimensional simplex</strong>. Three noncollinear points give a triangle: CDF is a 2-simplex.`), 'blue', '1'),
    'triangle', [98]),

  visualSlide('tetrahedron-definition', 'Four noncoplanar points give a tetrahedron',
    p('Four points are either coplanar or affinely independent.') +
    box(p('In the independent case their convex hull is a 3-simplex: a tetrahedron, with four triangular faces.')) +
    p('C, D and F lie in one plane. E lies below it, so C, D, E and F are not coplanar.') +
    box(p('Self-check: three differences from F span three dimensions. Which new direction does E contribute?'), 'orange', '1'),
    'tetrahedron', [99]),

  visualSlide('basis-columns-and-points', 'A basis selects three lifted points',
    p(raw`Including convexity, the constraint matrix is`) +
    math(raw`\[\widetilde A=\begin{pmatrix}A\\\mathbf1^\top\end{pmatrix},\qquad\widetilde b=\begin{pmatrix}b\\1\end{pmatrix}.\]`) +
    box(p(raw`Assume \(\widetilde A\) has full row rank. A basis selects \(m+1\) independent columns \((A_j,1)\).`)) +
    p(raw`Here \(m=2\): choose C, D, F. Their lifted versions are the <strong>basic points</strong>. B and E are nonbasic.`),
    'basis', [100, 101, 102]),

  visualSlide('basic-simplex-independence', 'The selected points form the basic simplex',
    p(raw`The basic columns \((A_j,1)\) are independent, so their horizontal points \(A_j\) are affinely independent.`) +
    box(p(raw`Lifting them to \((A_j,c_j)\) preserves that affine independence: a relation between lifted differences would also be a relation between horizontal differences.`), 'blue', '1') +
    p('Their convex hull is the basic simplex. Our three basic points form the shaded triangle CDF.'),
    'basis', [103]),

  visualSlide('weights-at-h', 'The intersection H determines the basic weights',
    p('Intersect the requirement line with triangle CDF.') +
    math(raw`\[H=\tfrac13 C+\tfrac13 D+\tfrac13 F=(1,1,4).\]`) +
    box(p(raw`Thus \(x_C=x_D=x_F=1/3\), while \(x_B=x_E=0\). These are the entries of the <strong>basic feasible solution</strong>.`), 'blue', '1') +
    p('The point H is a lifted mixture. Its height 4 is the objective value; its coordinates are not the five decision variables.'),
    'basis', [104, 105]),

  visualSlide('h-versus-g', 'A feasible basic mixture need not be optimal',
    p('The same requirement line meets several possible basic triangles.') +
    math(raw`\[\begin{aligned}H&=(1,1,4),\\G&=(1,1,5/2).\end{aligned}\]`) +
    box(p('H uses CDF. The lower point G uses DEF. A change of basis can move the intersection downward while the requirement stays fixed.'), 'green', '1') +
    p('The task is to choose a new basic point and an old basic point to remove.'),
    'hull', [105, 106]),

  visualSlide('enter-b', 'Candidate B: replace F and move upward to I',
    p('Starting with CDF, let B enter and F leave. The new basic simplex is BCD.') +
    math(raw`\[I=\tfrac12 B+\tfrac14 C+\tfrac14 D=(1,1,11/2).\]`) +
    box(p(raw`The weights are feasible, but cost rises from \(4\) to \(11/2\). This is a valid basis exchange with the wrong objective direction for minimization.`), 'orange', '1'),
    'candidate-b', [106, 107]),

  visualSlide('enter-e', 'Candidate E: replace C and move downward to G',
    p('Instead, let E enter and C leave. The new basic simplex is DEF.') +
    math(raw`\[G=\tfrac14 D+\tfrac12 E+\tfrac14 F=(1,1,5/2).\]`) +
    box(p(raw`Cost falls from \(4\) to \(5/2\). The next question is how to predict the better entering point before completing the exchange.`), 'green', '1'),
    'candidate-e', [108]),

  visualSlide('dual-plane', 'The dual plane predicts the objective slope',
    p('Extend the plane through the basic points C, D and F. This is the current dual plane.') +
    math(raw`\[z=4.\]`) +
    box(p('E is below this plane; B is above it. Increasing the weight on E can decrease cost, while increasing the weight on B increases cost.'), 'blue', '1') +
    p('Strict improvement also needs a positive feasible step. A degenerate pivot may change the basis without changing the cost.'),
    'dual-plane', [109, 110]),

  visualSlide('reduced-cost-height', 'Reduced cost is a signed vertical gap',
    p(raw`Write the dual plane as \(z=\pi^\top a+\alpha\). It agrees with each basic point's cost.`) +
    math(raw`\[\widetilde B^\top\begin{pmatrix}\pi\\\alpha\end{pmatrix}=c_{\mathcal B}.\]`) +
    box(math(raw`\[\bar c_j=c_j-(\pi^\top A_j+\alpha).\]`) + p('Subtract plane height from point height. Below the plane means a negative gap.'), 'blue', '1') +
    p(raw`For CDF, \(\pi=(0,0)\), \(\alpha=4\): \(\bar c_E=-3\), \(\bar c_B=3\).`),
    'gaps', [111], { checkpoint: geometryCheckpoint }),

  visualSlide('entering-tetrahedron', 'Adding E creates four possible boundary faces',
    p('The current triangle CDF together with E forms the tetrahedron CDEF.') +
    box(p('Its four faces are CDF, CDE, CEF and DEF. The three new faces are candidates obtained by removing F, D or C.'), 'blue', '1') +
    p(raw`In general an \((m+1)\)-simplex has \(m+2\) faces: the old basic simplex plus \(m+1\) candidate replacements.`),
    'faces', [112, 113]),

  visualSlide('leaving-face', 'The requirement line selects the feasible new face',
    p('At H, the requirement line meets the old face CDF. Follow the line downward through the tetrahedron.') +
    box(p('The next boundary intersection is G, on face DEF. That face contains E and excludes C: E enters and C leaves.'), 'green', '1') +
    p('A candidate face that does not meet the requirement line cannot give nonnegative weights for this requirement.'),
    'leaving', [114, 115]),

  visualSlide('geometric-ratio-test', 'The same face choice comes from the ratio test',
    p(raw`Let \(x_E=\theta\), starting from \(x_C=x_D=x_F=1/3\). Preserving all three equalities gives`) +
    math(raw`\[\begin{aligned}x_C&=\tfrac13-\tfrac23\theta,\\x_D&=\tfrac13-\tfrac16\theta,\\x_F&=\tfrac13-\tfrac16\theta.\end{aligned}\]`) +
    box(math(raw`\[\theta^*=\min\{1/2,2,2\}=1/2.\]`) + p('C reaches zero first, producing the face DEF.'), 'green', '1'),
    'leaving', [115]),

  slide('physical-hinge', 'Pivot the triangle from CDF to DEF',
    pair(p('Keep D and F anchored. Pull the corner C toward the entering point E. The triangle hinges around its shared edge DF and stretches.') +
      box(p('Watch its intersection with the requirement line descend from H to G. This picture explains the names “simplex” and “pivot”.')) +
      p('The moving corner is a physical analogy. Intermediate positions are not additional columns of the LP.'), columnFigure('hinge', { hinge: true })),
    [116, 117, 118], {
      onMount: mountColumnGeometry,
      printHtml: pair(p('The old triangle CDF and new triangle DEF share the hinge DF.') +
        math(raw`\[H=(1,1,4)\quad\longrightarrow\quad G=(1,1,5/2).\]`) +
        p('C leaves, E enters, and the cost decreases. The dashed corner path shows the physical analogy.'), columnFigure('hinge', { hinge: true, print: true })),
    }),

  visualSlide('supporting-plane-optimality', 'The final plane supports the entire convex hull',
    p('The plane through D, E and F is') +
    math(raw`\[z=4-\tfrac32 a_1.\]`) +
    box(p(raw`Every lifted column lies on or above it. Therefore every convex combination satisfies \(z\ge4-\tfrac32 a_1\).`), 'blue', '1') +
    p(raw`At \(b=(1,1)\), this gives \(z\ge5/2\). The mixture G attains the bound, so it is optimal.`) +
    p('Self-study: verify the five signed gaps using the coordinate table.'),
    'optimal-plane', [111, 118]),

  slide('example310-data', 'Example 3.10: eight points, one horizontal coordinate',
    p(raw`With \(m=1\), the basic simplex is a line segment. Use this constructed numerical realization of the eight-point picture:`) +
    `<div class="l10-table-wrap"><table class="l10-table l10-column-coordinates"><thead><tr><th>${raw`\(j\)`}</th>${example310.a.map((_, i) => `<th>${i + 1}</th>`).join('')}</tr></thead><tbody><tr><th>${raw`\(A_j\)`}</th>${example310.a.map(value => `<td>${value}</td>`).join('')}</tr><tr><th>${raw`\(c_j\)`}</th>${example310.c.map(value => `<td>${value}</td>`).join('')}</tr></tbody></table></div>` +
    math(raw`\[\min\sum_{j=1}^{8}c_jx_j\quad\text{s.t.}\quad\sum_{j=1}^{8}A_jx_j=0,\quad\sum_{j=1}^{8}x_j=1,\quad x\ge0.\]`) +
    box(p('We will choose the point with the most negative reduced cost: the largest downward vertical gap from the current dual line.'), 'blue', '1'), [119]),

  slide('example310-initial', 'Initial basis 3, 6: point 5 has the largest downward gap',
    pair(p('The line segment between points 3 and 6 crosses the requirement line.') +
      math(raw`\[x_3=\tfrac23,\quad x_6=\tfrac13,\quad z=\tfrac{20}{3}.\]`) +
      box(math(raw`\[z=\tfrac13a+\tfrac{20}{3}.\]`) + p(raw`Point 5 has gap \(2-23/3=-17/3\), the most negative reduced cost.`), 'blue', '1') +
      p('Point 5 enters. The requirement lies between 3 and 5, so point 6 leaves.'), examplePlot(0)), [119, 120]),

  slide('example310-next', 'Next basis 3, 5: point 8 is now the best candidate',
    pair(p('After the first pivot, the segment is 3, 5.') +
      math(raw`\[x_3=\tfrac35,\quad x_5=\tfrac25,\quad z=\tfrac{22}{5}.\]`) +
      box(math(raw`\[z=-\tfrac45a+\tfrac{22}{5}.\]`) + p(raw`Now point 8 has the most negative gap: \(3-26/5=-11/5\).`), 'blue', '1') +
      p('Point 8 enters and point 3 leaves. The new segment must still cross the requirement line.'), examplePlot(1)), [120]),

  slide('example310-optimal', 'Final basis 5, 8: every point is on or above the line',
    pair(p('The final segment uses points 5 and 8.') +
      math(raw`\[x_5=\tfrac14,\quad x_8=\tfrac34,\quad z=\tfrac{11}{4}.\]`) +
      box(math(raw`\[z=-\tfrac14a+\tfrac{11}{4}.\]`) + p('All remaining points are above this line. Every nonbasic reduced cost is positive.'), 'green', '1') +
      p('The current feasible mixture attains the lowest possible height at the requirement.'), examplePlot(2)), [120], { checkpoint: exampleCheckpoint }),

  slide('example310-sequence', 'Read the entire path: 3, 6 → 3, 5 → 5, 8',
    pair(p('Each pivot changes one endpoint of the basic segment while preserving its intersection with the requirement line.') +
      math(raw`\[\frac{20}{3}\;>\;\frac{22}{5}\;>\;\frac{11}{4}.\]`) +
      box(p('Self-study: recover the weights by solving the two equalities for each pair. Then calculate every reduced cost to confirm the entering choices.')) +
      p('The 2D segment rotates at a shared endpoint. The 3D triangle pivots around a shared edge. Both pictures describe the same basis exchange.'), examplePlot(2, true)), [119, 120]),
];

export const auditData = {
  columnModel, example310,
  sourceCoordinatesAreConstructed: true,
  sourcePageCorrections: {
    109: 'Strict objective decrease requires a positive feasible step; degenerate pivots may have zero objective change.',
    112: 'There are m+1 candidate replacement faces, plus the original face, on an (m+1)-simplex.',
  },
  hinge: { corner: '(1-t)C+tE', intersectionCost: '4-3t/(3-t)', interval: [0, 1] },
  referenceCoverage: geometrySlides.map(({ key, referencePages }) => ({ key, referencePages })),
};
