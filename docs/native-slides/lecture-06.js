/**
 * Native Lecture 06: Simplex I — From a Basis to a Better Corner.
 *
 * The GILP sequences reproduce the mathematics and teaching states of the
 * faculty-authorized reference visually, using exact native SVG geometry and
 * selectable MathJax rather than screenshots or a private runtime.
 */

const checkpointGeometry = Object.freeze({
  prompt: "What remains unchanged during a simplex pivot?",
  choices: [
    "The current basis",
    "The current dictionary",
    "The feasible polyhedron",
    "The current endpoint",
  ],
  correctIndex: 2,
  explanation:
    "A pivot changes the basis, dictionary, and current basic feasible solution. The constraints—and therefore the feasible polyhedron—stay fixed.",
  autoOpen: true,
});

const checkpointOptimality = Object.freeze({
  prompt: "For a feasible basis in a minimization LP, what does every nonbasic reduced cost being nonnegative certify?",
  choices: [
    "The current basic feasible solution is optimal",
    "The current basic feasible solution is unique",
    "The feasible polyhedron is bounded",
    "Every nonbasic variable must enter",
  ],
  correctIndex: 0,
  explanation:
    "Primal feasibility requires B⁻¹b ≥ 0. Nonnegative nonbasic reduced costs show that no feasible nonbasic direction can lower the objective.",
  autoOpen: true,
});

const checkpointUnbounded = Object.freeze({
  prompt: "An entering variable has negative reduced cost and u = B⁻¹Aⱼ ≤ 0. What follows?",
  choices: [
    "The current basis is optimal",
    "The ratio test chooses the largest component of u",
    "The direction is blocked at step zero",
    "The path stays feasible for every nonnegative step and the objective is unbounded below",
  ],
  correctIndex: 3,
  explanation:
    "Then d_B = −u ≥ 0, so no basic variable blocks the move. The ray remains feasible and its negative slope drives the objective to −∞.",
  autoOpen: true,
});

const checkpointDegeneratePivot = Object.freeze({
  prompt: "Why is x⁽¹⁾ = (10, 0, 0, 10, 0, 0) degenerate after x₁ enters and x₅ leaves?",
  choices: [
    "The entering variable has zero reduced cost",
    "The basis matrix is singular",
    "x₆ remains basic at value zero because two ratio-test rows tied",
    "The objective did not improve",
  ],
  correctIndex: 2,
  explanation:
    "Rows x₅ and x₆ tie in the ratio test. After x₅ leaves, x₆ remains basic but also reaches zero, which is exactly degeneracy in standard form.",
  autoOpen: true,
});

const TWO_D_VERTICES = Object.freeze([
  Object.freeze([0, 0]),
  Object.freeze([7, 0]),
  Object.freeze([7, 6]),
  Object.freeze([4, 12]),
  Object.freeze([0, 16]),
]);

const TWO_D_STATES = Object.freeze([
  Object.freeze({
    point: Object.freeze([0, 0]), value: 0,
    basis: "\\(\\mathcal B=(x_3,x_4,x_5),\\quad \\mathcal N=(x_1,x_2)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=5x_1+3x_2,\\x_3&=20-2x_1-x_2,\\x_4&=16-x_1-x_2,\\x_5&=7-x_1.\end{aligned}\]`,
    transition: "Start at the slack basis. Next: x₁ enters, x₅ leaves, θ = 7.",
  }),
  Object.freeze({
    point: Object.freeze([7, 0]), value: 35,
    basis: "\\(\\mathcal B=(x_1,x_3,x_4),\\quad \\mathcal N=(x_2,x_5)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=35+3x_2-5x_5,\\x_1&=7-x_5,\\x_3&=6-x_2+2x_5,\\x_4&=9-x_2+x_5.\end{aligned}\]`,
    transition: "x₁ entered and x₅ left. Next: x₂ enters, x₃ leaves, θ = 6.",
  }),
  Object.freeze({
    point: Object.freeze([7, 6]), value: 53,
    basis: "\\(\\mathcal B=(x_1,x_2,x_4),\\quad \\mathcal N=(x_3,x_5)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=53-3x_3+x_5,\\x_1&=7-x_5,\\x_2&=6-x_3+2x_5,\\x_4&=3+x_3-x_5.\end{aligned}\]`,
    transition: "x₂ entered and x₃ left. Next: x₅ enters, x₄ leaves, θ = 3.",
  }),
  Object.freeze({
    point: Object.freeze([4, 12]), value: 56,
    basis: "\\(\\mathcal B=(x_1,x_2,x_5),\\quad \\mathcal N=(x_3,x_4)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=56-2x_3-x_4,\\x_1&=4-x_3+x_4,\\x_2&=12+x_3-2x_4,\\x_5&=3+x_3-x_4.\end{aligned}\]`,
    transition: "Current point = marked optimum. Both remaining max-dictionary coefficients are nonpositive.",
  }),
]);

const THREE_D_VERTICES = Object.freeze([
  Object.freeze([0, 0, 0]), Object.freeze([0, 0, 5]),
  Object.freeze([0, 3, 5]), Object.freeze([0, 8, 0]),
  Object.freeze([3, 0, 5]), Object.freeze([3, 3, 5]),
  Object.freeze([6, 0, 0]), Object.freeze([6, 0, 2]),
  Object.freeze([6, 6, 2]), Object.freeze([6, 8, 0]),
]);

const THREE_D_EDGES = Object.freeze([
  Object.freeze([0, 1]), Object.freeze([0, 3]), Object.freeze([0, 6]),
  Object.freeze([1, 2]), Object.freeze([1, 4]), Object.freeze([2, 3]),
  Object.freeze([2, 5]), Object.freeze([3, 9]), Object.freeze([4, 5]),
  Object.freeze([4, 7]), Object.freeze([5, 8]), Object.freeze([6, 7]),
  Object.freeze([6, 9]), Object.freeze([7, 8]), Object.freeze([8, 9]),
]);

const THREE_D_FACES = Object.freeze([
  Object.freeze([0, 1, 2, 3]), Object.freeze([0, 1, 4, 7, 6]),
  Object.freeze([0, 3, 9, 6]), Object.freeze([6, 7, 8, 9]),
  Object.freeze([4, 5, 8, 7]), Object.freeze([1, 2, 5, 4]),
  Object.freeze([2, 3, 9, 8, 5]),
]);

const THREE_D_PATH_INDICES = Object.freeze([0, 6, 9, 8, 5]);
const THREE_D_PATH = Object.freeze(THREE_D_PATH_INDICES.map((index) => THREE_D_VERTICES[index]));

const THREE_D_STATES = Object.freeze([
  Object.freeze({
    point: THREE_D_PATH[0], value: 0,
    basis: "\\(\\mathcal B=(x_4,x_5,x_6,x_7),\\quad \\mathcal N=(x_1,x_2,x_3)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=x_1+2x_2+4x_3,\\x_4&=6-x_1,\\x_5&=8-x_1-x_3,\\x_6&=5-x_3,\\x_7&=8-x_2-x_3.\end{aligned}\]`,
    transition: "Origin. Next: x₁ enters, x₄ leaves, θ = 6.",
  }),
  Object.freeze({
    point: THREE_D_PATH[1], value: 6,
    basis: "\\(\\mathcal B=(x_1,x_5,x_6,x_7),\\quad \\mathcal N=(x_2,x_3,x_4)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=6+2x_2+4x_3-x_4,\\x_1&=6-x_4,\\x_5&=2-x_3+x_4,\\x_6&=5-x_3,\\x_7&=8-x_2-x_3.\end{aligned}\]`,
    transition: "x₁ entered, x₄ left. Next: x₂ enters, x₇ leaves, θ = 8.",
  }),
  Object.freeze({
    point: THREE_D_PATH[2], value: 22,
    basis: "\\(\\mathcal B=(x_1,x_2,x_5,x_6),\\quad \\mathcal N=(x_3,x_4,x_7)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=22+2x_3-x_4-2x_7,\\x_1&=6-x_4,\\x_2&=8-x_3-x_7,\\x_5&=2-x_3+x_4,\\x_6&=5-x_3.\end{aligned}\]`,
    transition: "x₂ entered, x₇ left. Next: x₃ enters, x₅ leaves, θ = 2.",
  }),
  Object.freeze({
    point: THREE_D_PATH[3], value: 26,
    basis: "\\(\\mathcal B=(x_1,x_2,x_3,x_6),\\quad \\mathcal N=(x_4,x_5,x_7)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=26+x_4-2x_5-2x_7,\\x_1&=6-x_4,\\x_2&=6-x_4+x_5-x_7,\\x_3&=2+x_4-x_5,\\x_6&=3-x_4+x_5.\end{aligned}\]`,
    transition: "x₃ entered, x₅ left. Next: x₄ enters, x₆ leaves, θ = 3.",
  }),
  Object.freeze({
    point: THREE_D_PATH[4], value: 29,
    basis: "\\(\\mathcal B=(x_1,x_2,x_3,x_4),\\quad \\mathcal N=(x_5,x_6,x_7)\\)",
    dictionary: String.raw`\[\begin{aligned}z&=29-x_5-x_6-2x_7,\\x_1&=3-x_5+x_6,\\x_2&=3+x_6-x_7,\\x_3&=5-x_6,\\x_4&=3+x_5-x_6.\end{aligned}\]`,
    transition: "Unique optimum. Every remaining max-dictionary coefficient is nonpositive.",
  }),
]);

export const metadata = {
  id: "lecture-06",
  number: 6,
  title: "Simplex I: Basis Directions and Reduced Costs",
  subtitle: "Lecture 5 · From a Basis to a Better Corner",
  course: "ISE 5405 · Optimization I",
  date: "2026-09-10",
  homeUrl: "../../",
  pdfUrl: "../../materials/lecture_06.pdf",
  whiteboards: 3,
};

const pointText = (point) => `(${point.join(", ")})`;
const jsonAttribute = (value) => JSON.stringify(value).replaceAll("'", "&#39;");

function project2D([x1, x2]) {
  return [54 + 44 * x1, 380 - 18 * x2];
}

function twoDPlotSvg(stateIndex, { print = false } = {}) {
  const polygon = TWO_D_VERTICES.map((point) => project2D(point).join(",")).join(" ");
  const pathSegments = TWO_D_STATES.slice(1).map((state, index) => {
    const [x1, y1] = project2D(TWO_D_STATES[index].point);
    const [x2, y2] = project2D(state.point);
    const visible = index < stateIndex;
    return `<line class="l6-path-segment" data-l6-segment="${index + 1}" x1="${x1}" y1="${y1}" x2="${visible ? x2 : x1}" y2="${visible ? y2 : y1}"${visible ? "" : " hidden"}/>`;
  }).join("");
  const [currentX, currentY] = project2D(TWO_D_STATES[stateIndex].point);
  const [optX, optY] = project2D([4, 12]);
  return `
    <svg class="l6-gilp-svg l6-gilp-2d" viewBox="0 0 520 420" role="img"
      aria-label="Feasible polygon and cumulative simplex path through iteration ${stateIndex}"
      data-l6-2d-svg ${print ? "data-l6-print-path" : ""}>
      <g class="l6-grid" aria-hidden="true">
        <line x1="54" y1="380" x2="494" y2="380"/><line x1="54" y1="308" x2="494" y2="308"/>
        <line x1="54" y1="236" x2="494" y2="236"/><line x1="54" y1="164" x2="494" y2="164"/>
        <line x1="54" y1="92" x2="494" y2="92"/>
        <line x1="54" y1="380" x2="54" y2="56"/><line x1="142" y1="380" x2="142" y2="56"/>
        <line x1="230" y1="380" x2="230" y2="56"/><line x1="318" y1="380" x2="318" y2="56"/>
        <line x1="406" y1="380" x2="406" y2="56"/><line x1="494" y1="380" x2="494" y2="56"/>
      </g>
      <g class="l6-axes" aria-hidden="true">
        <line x1="54" y1="392" x2="504" y2="392"/><line x1="42" y1="380" x2="42" y2="46"/>
        <text x="500" y="414">x₁</text><text x="17" y="54">x₂</text>
        <text x="45" y="410">0</text><text x="352" y="410">7</text><text x="480" y="410">10</text>
        <text x="18" y="385">0</text><text x="14" y="169">12</text><text x="14" y="98">16</text>
      </g>
      <g class="l6-constraints" aria-hidden="true">
        <line x1="142" y1="92" x2="494" y2="380"/><line x1="54" y1="92" x2="494" y2="272"/>
        <line x1="362" y1="56" x2="362" y2="380"/>
        <text x="382" y="292">2x₁+x₂=20</text><text x="330" y="218">x₁+x₂=16</text><text x="369" y="78">x₁=7</text>
      </g>
      <polygon class="l6-feasible-region" points="${polygon}"/>
      <g class="l6-path" aria-hidden="true">${pathSegments}</g>
      <polygon class="l6-optimum-marker" points="${optX},${optY - 10} ${optX + 10},${optY} ${optX},${optY + 10} ${optX - 10},${optY}"/>
      <text class="l6-marker-label" x="${optX + 14}" y="${optY - 12}">optimum (4,12)</text>
      <circle class="l6-current-marker" data-l6-current-marker cx="${currentX}" cy="${currentY}" r="12"/>
      <text class="l6-current-label" data-l6-current-label x="${currentX + 14}" y="${currentY + 24}">iterate ${stateIndex}</text>
    </svg>`;
}

function project3D(point, yaw = -0.7, pitch = 0.54) {
  const x = point[0] - 3;
  const y = point[1] - 4;
  const z = point[2] - 2.5;
  const horizontal = x * Math.cos(yaw) - y * Math.sin(yaw);
  const depth = x * Math.sin(yaw) + y * Math.cos(yaw);
  return {
    x: 300 + horizontal * 43,
    y: 225 - z * 43 + depth * 18 * Math.cos(pitch),
    depth: depth + z * Math.sin(pitch),
  };
}

function threeDPlotSvg(stateIndex, { print = false } = {}) {
  const projected = THREE_D_VERTICES.map((point) => project3D(point));
  const faces = THREE_D_FACES.map((face, index) => ({
    index,
    depth: face.reduce((sum, vertex) => sum + projected[vertex].depth, 0) / face.length,
    points: face.map((vertex) => `${projected[vertex].x.toFixed(2)},${projected[vertex].y.toFixed(2)}`).join(" "),
  })).sort((a, b) => a.depth - b.depth)
    .map((face) => `<polygon class="l6-poly-face" data-l6-face="${face.index}" points="${face.points}"/>`).join("");
  const edges = THREE_D_EDGES.map(([from, to], index) => {
    const a = projected[from]; const b = projected[to];
    return `<line class="l6-poly-edge" data-l6-poly-edge="${index}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  }).join("");
  const pathSegments = THREE_D_PATH.slice(1).map((point, index) => {
    const a = project3D(THREE_D_PATH[index]); const b = project3D(point);
    const visible = index < stateIndex;
    return `<line class="l6-path-segment" data-l6-segment="${index + 1}" x1="${a.x}" y1="${a.y}" x2="${visible ? b.x : a.x}" y2="${visible ? b.y : a.y}"${visible ? "" : " hidden"}/>`;
  }).join("");
  const current = project3D(THREE_D_STATES[stateIndex].point);
  const optimum = project3D([3, 3, 5]);
  const origin = project3D([0, 0, 0]);
  const xAxis = project3D([7, 0, 0]);
  const yAxis = project3D([0, 9, 0]);
  const zAxis = project3D([0, 0, 6]);
  return `
    <svg class="l6-gilp-svg l6-gilp-3d" viewBox="0 0 600 450" role="img" tabindex="0"
      aria-label="Three-dimensional feasible polyhedron and cumulative simplex path through iteration ${stateIndex}"
      data-l6-3d-svg ${print ? "data-l6-print-path" : ""}>
      <g class="l6-3d-axes" aria-hidden="true">
        <line data-l6-axis="x" x1="${origin.x}" y1="${origin.y}" x2="${xAxis.x}" y2="${xAxis.y}"/>
        <line data-l6-axis="y" x1="${origin.x}" y1="${origin.y}" x2="${yAxis.x}" y2="${yAxis.y}"/>
        <line data-l6-axis="z" x1="${origin.x}" y1="${origin.y}" x2="${zAxis.x}" y2="${zAxis.y}"/>
        <text data-l6-axis-label="x" x="${xAxis.x + 8}" y="${xAxis.y}">x₁</text>
        <text data-l6-axis-label="y" x="${yAxis.x + 8}" y="${yAxis.y}">x₂</text>
        <text data-l6-axis-label="z" x="${zAxis.x + 8}" y="${zAxis.y}">x₃</text>
      </g>
      <g data-l6-faces>${faces}</g><g data-l6-edges>${edges}</g>
      <g class="l6-path" aria-hidden="true">${pathSegments}</g>
      <polygon class="l6-optimum-marker" data-l6-optimum-marker points="${optimum.x},${optimum.y - 10} ${optimum.x + 10},${optimum.y} ${optimum.x},${optimum.y + 10} ${optimum.x - 10},${optimum.y}"/>
      <text class="l6-marker-label" data-l6-optimum-label x="${optimum.x + 14}" y="${optimum.y - 12}">optimum (3,3,5)</text>
      <circle class="l6-current-marker" data-l6-current-marker cx="${current.x}" cy="${current.y}" r="12"/>
      <text class="l6-current-label" data-l6-current-label x="${current.x + 14}" y="${current.y + 24}">iterate ${stateIndex}</text>
    </svg>`;
}

function stateButtons(maximum) {
  return `<div class="l6-state-buttons" role="group" aria-label="Choose simplex iteration">
    ${Array.from({ length: maximum + 1 }, (_, index) => `<button type="button" data-l6-state-button="${index}" aria-pressed="false">${index}</button>`).join("")}
  </div>`;
}

function pathControls(kind, interactive) {
  if (!interactive) {
    return `<div class="l6-player-controls" aria-label="Diagram controls">
      <button type="button" data-l6-action="replay">Replay edge</button>
      ${kind === "3d" ? '<button type="button" data-l6-action="rotate-left" aria-label="Rotate plot left">Rotate left</button><button type="button" data-l6-action="rotate-right" aria-label="Rotate plot right">Rotate right</button>' : ""}
    </div>`;
  }
  return `<div class="l6-player-controls" aria-label="Simplex path controls">
    <button type="button" data-l6-action="restart">Restart</button>
    <button type="button" data-l6-action="previous">Previous</button>
    <button type="button" data-l6-action="play" aria-pressed="false">Play</button>
    <button type="button" data-l6-action="next">Next</button>
    ${kind === "3d" ? '<button type="button" data-l6-action="rotate-left" aria-label="Rotate plot left">Rotate left</button><button type="button" data-l6-action="rotate-right" aria-label="Rotate plot right">Rotate right</button>' : ""}
  </div>`;
}

function statePanelCopies(states, stateIndex, summaryItems = null) {
  const copies = states.map((state, index) => `<div class="l6-state-copy" data-l6-state-copy="${index}"${index === stateIndex ? "" : " hidden"}>
      <h3>Iteration ${index}: ${pointText(state.point)}</h3>
      <p class="l6-objective">\(z=${state.value}\)</p>
      ${summaryItems ? "" : `<p class="l6-basis-line">${state.basis}</p><div class="l6-dictionary ns-math">${state.dictionary}</div><p class="l6-transition">${state.transition}</p>`}
    </div>`).join("");
  return `${copies}${summaryItems ?? ""}`;
}

function twoDPlayerMarkup(stateIndex, { interactive = false, summary = false, print = false } = {}) {
  const state = TWO_D_STATES[stateIndex];
  const summaryItems = summary
    ? '<ul class="l6-compact-list"><li>Every segment stays feasible.</li><li>Every move joins neighboring corners.</li><li>The final dictionary has no improving max coefficient.</li></ul>'
    : null;
  return `<div class="l6-gilp-player ${summary ? "l6-gilp-summary" : ""}" data-l6-path="2d"
      data-points='${jsonAttribute(TWO_D_STATES.map((item) => item.point))}'
      data-vertices='${jsonAttribute(TWO_D_VERTICES)}'
      data-objectives='${jsonAttribute(TWO_D_STATES.map((item) => item.value))}'
      data-initial-state="${stateIndex}" data-current-state="${stateIndex}" data-visible-segments="${stateIndex}"
      data-l6-interactive="${interactive}">
    <div class="l6-plot-shell">
      ${twoDPlotSvg(stateIndex, { print })}
      <p class="l6-visual-key"><span data-key="region">feasible set</span><span data-key="path">simplex path</span><span data-key="current">current iterate</span><span data-key="optimum">fixed optimum</span></p>
    </div>
    <aside class="l6-state-panel">
      ${statePanelCopies(TWO_D_STATES, stateIndex, summaryItems)}
      <p class="l6-player-status" data-l6-status role="status" aria-live="polite">Iteration ${stateIndex}; point ${pointText(state.point)}; objective ${state.value}.</p>
    </aside>
    ${print ? "" : `<div class="l6-player-footer">${interactive ? stateButtons(3) : ""}${pathControls("2d", interactive)}</div>`}
  </div>`;
}

function threeDPlayerMarkup(stateIndex, { interactive = false, summary = false, print = false } = {}) {
  const state = THREE_D_STATES[stateIndex];
  const summaryItems = summary
    ? '<ul class="l6-compact-list"><li>The blue polyhedron never changes.</li><li>The red path accumulates one edge at a time.</li><li>A pivot changes the basis and dictionary.</li><li>The same algebra works when we cannot draw the geometry.</li></ul>'
    : null;
  return `<div class="l6-gilp-player l6-gilp-player-3d ${summary ? "l6-gilp-summary" : ""}" data-l6-path="3d"
      data-points='${jsonAttribute(THREE_D_PATH)}'
      data-vertices='${jsonAttribute(THREE_D_VERTICES)}'
      data-edges='${jsonAttribute(THREE_D_EDGES)}'
      data-objectives='${jsonAttribute(THREE_D_STATES.map((item) => item.value))}'
      data-initial-state="${stateIndex}" data-current-state="${stateIndex}" data-visible-segments="${stateIndex}"
      data-l6-interactive="${interactive}">
    <div class="l6-plot-shell">
      ${threeDPlotSvg(stateIndex, { print })}
      <p class="l6-visual-key"><span data-key="region">feasible polyhedron</span><span data-key="path">simplex path</span><span data-key="current">current iterate</span><span data-key="optimum">fixed optimum</span></p>
      ${print ? "" : '<p class="l6-rotate-hint">Drag the model, use the rotate buttons, or focus it and press ←/→.</p>'}
    </div>
    <aside class="l6-state-panel">
      ${statePanelCopies(THREE_D_STATES, stateIndex, summaryItems)}
      <p class="l6-player-status" data-l6-status role="status" aria-live="polite">Iteration ${stateIndex}; point ${pointText(state.point)}; objective ${state.value}.</p>
    </aside>
    ${print ? "" : `<div class="l6-player-footer">${interactive ? stateButtons(4) : ""}${pathControls("3d", interactive)}</div>`}
  </div>`;
}

function mountTwoDPlayer(slideElement, announce, typesetMath, clearMath) {
  const root = slideElement.querySelector('[data-l6-path="2d"]');
  if (!root) return undefined;
  const interactive = root.dataset.l6Interactive === "true";
  const maximum = TWO_D_STATES.length - 1;
  const storageKey = "ise5405:simplex-path:lecture-06:l6-10:v1";
  const preferredState = Number(root.dataset.initialState || 0);
  const storedState = interactive ? Number(localStorage.getItem(storageKey)) : Number.NaN;
  let stateIndex = Number.isInteger(storedState) && storedState >= 0 && storedState <= maximum
    ? storedState : preferredState;
  let frame = 0;
  let timer = 0;
  let playing = false;
  let finishCallback = null;
  const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  root.dataset.reducedMotion = String(prefersReducedMotion());
  const svg = root.querySelector("[data-l6-2d-svg]");
  const currentMarker = root.querySelector("[data-l6-current-marker]");
  const currentLabel = root.querySelector("[data-l6-current-label]");
  const stateCopies = [...root.querySelectorAll("[data-l6-state-copy]")];
  const status = root.querySelector("[data-l6-status]");
  const segments = [...root.querySelectorAll("[data-l6-segment]")];
  const stateButtonElements = [...root.querySelectorAll("[data-l6-state-button]")];
  const actionButtons = new Map([...root.querySelectorAll("[data-l6-action]")].map((button) => [button.dataset.l6Action, button]));

  const cancelAnimation = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (finishCallback) finishCallback(false);
    finishCallback = null;
  };

  const persist = () => {
    if (interactive) localStorage.setItem(storageKey, String(stateIndex));
  };

  const updatePanel = () => {
    stateCopies.forEach((copy) =>
      copy.toggleAttribute("hidden", Number(copy.dataset.l6StateCopy) !== stateIndex));
  };

  const render = (progress = 1) => {
    const boundedProgress = Math.max(0, Math.min(1, progress));
    segments.forEach((segment, index) => {
      const segmentNumber = index + 1;
      const start = project2D(TWO_D_STATES[index].point);
      const end = project2D(TWO_D_STATES[segmentNumber].point);
      if (segmentNumber > stateIndex) {
        segment.setAttribute("hidden", "");
        segment.setAttribute("x2", String(start[0]));
        segment.setAttribute("y2", String(start[1]));
        return;
      }
      const amount = segmentNumber === stateIndex ? boundedProgress : 1;
      segment.removeAttribute("hidden");
      segment.setAttribute("x1", String(start[0]));
      segment.setAttribute("y1", String(start[1]));
      segment.setAttribute("x2", String(start[0] + (end[0] - start[0]) * amount));
      segment.setAttribute("y2", String(start[1] + (end[1] - start[1]) * amount));
    });
    let currentPoint = TWO_D_STATES[stateIndex].point;
    if (stateIndex > 0 && boundedProgress < 1) {
      const previous = TWO_D_STATES[stateIndex - 1].point;
      const target = TWO_D_STATES[stateIndex].point;
      currentPoint = previous.map((value, index) => value + (target[index] - value) * boundedProgress);
    }
    const [cx, cy] = project2D(currentPoint);
    currentMarker.setAttribute("cx", String(cx)); currentMarker.setAttribute("cy", String(cy));
    currentLabel.setAttribute("x", String(cx + 14)); currentLabel.setAttribute("y", String(cy + 24));
    currentLabel.textContent = `iterate ${stateIndex}`;
    root.dataset.currentState = String(stateIndex);
    root.dataset.visibleSegments = String(stateIndex - (stateIndex > 0 && boundedProgress < 1 ? 1 : 0));
    svg.setAttribute("aria-label", `Feasible polygon and cumulative simplex path through iteration ${stateIndex}; current point ${pointText(TWO_D_STATES[stateIndex].point)}; objective ${TWO_D_STATES[stateIndex].value}`);
    stateButtonElements.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.l6StateButton) === stateIndex)));
    actionButtons.get("previous")?.toggleAttribute("disabled", stateIndex <= 0);
    actionButtons.get("next")?.toggleAttribute("disabled", stateIndex >= maximum);
  };

  const finishState = (shouldAnnounce = true) => {
    render(1);
    persist();
    const state = TWO_D_STATES[stateIndex];
    const summary = root.classList.contains("l6-gilp-summary");
    status.textContent = `Iteration ${stateIndex}; point ${pointText(state.point)}; objective ${state.value}.${summary ? "" : ` ${state.transition}`}`;
    if (shouldAnnounce) announce(status.textContent);
  };

  const animateState = (target, callback = null, shouldTypeset = true) => {
    cancelAnimation();
    stateIndex = Math.max(0, Math.min(maximum, target));
    updatePanel(shouldTypeset);
    render(stateIndex > 0 ? 0 : 1);
    root.dataset.reducedMotion = String(prefersReducedMotion());
    if (stateIndex === 0 || prefersReducedMotion()) {
      finishState();
      callback?.(true);
      return;
    }
    status.textContent = `Moving to iteration ${stateIndex}: ${pointText(TWO_D_STATES[stateIndex].point)}.`;
    const started = performance.now();
    finishCallback = callback;
    const tick = (now) => {
      const amount = Math.min(1, (now - started) / 680);
      render(1 - Math.pow(1 - amount, 3));
      if (amount < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      frame = 0;
      finishState();
      const finished = finishCallback;
      finishCallback = null;
      finished?.(true);
    };
    frame = requestAnimationFrame(tick);
  };

  const setPlaying = (next) => {
    playing = next;
    const button = actionButtons.get("play");
    if (button) {
      button.textContent = playing ? "Pause" : "Play";
      button.setAttribute("aria-pressed", String(playing));
    }
    if (!playing) {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    }
  };

  const playNext = () => {
    if (!playing) return;
    if (stateIndex >= maximum) {
      setPlaying(false);
      return;
    }
    animateState(stateIndex + 1, (completed) => {
      if (!completed || !playing) return;
      timer = window.setTimeout(playNext, 220);
    });
  };

  const clickHandlers = [];
  const bind = (element, handler) => {
    if (!element) return;
    element.addEventListener("click", handler);
    clickHandlers.push([element, handler]);
  };
  bind(actionButtons.get("replay"), () => animateState(stateIndex));
  bind(actionButtons.get("restart"), () => {
    setPlaying(false); cancelAnimation(); stateIndex = 0; localStorage.removeItem(storageKey);
    updatePanel(true); render(1); finishState();
  });
  bind(actionButtons.get("previous"), () => {
    setPlaying(false); cancelAnimation(); stateIndex = Math.max(0, stateIndex - 1);
    updatePanel(true); render(1); finishState();
  });
  bind(actionButtons.get("next"), () => {
    setPlaying(false); animateState(Math.min(maximum, stateIndex + 1));
  });
  bind(actionButtons.get("play"), () => {
    if (playing) { setPlaying(false); cancelAnimation(); finishState(false); return; }
    if (stateIndex >= maximum) {
      stateIndex = 0; updatePanel(true); render(1); persist();
    }
    setPlaying(true); playNext();
  });
  stateButtonElements.forEach((button) => bind(button, () => {
    setPlaying(false);
    const target = Number(button.dataset.l6StateButton);
    if (target === stateIndex) finishState();
    else if (target === stateIndex + 1) animateState(target);
    else { cancelAnimation(); stateIndex = target; updatePanel(true); render(1); finishState(); }
  }));

  if (!interactive && stateIndex > 0) animateState(stateIndex, null, false);
  else { updatePanel(false); render(1); finishState(false); }

  return () => {
    setPlaying(false); cancelAnimation();
    clickHandlers.forEach(([element, handler]) => element.removeEventListener("click", handler));
  };
}

function mountThreeDPlayer(slideElement, announce, typesetMath, clearMath) {
  const root = slideElement.querySelector('[data-l6-path="3d"]');
  if (!root) return undefined;
  const interactive = root.dataset.l6Interactive === "true";
  const maximum = THREE_D_STATES.length - 1;
  const storageKey = "ise5405:simplex-path:lecture-06:l6-16:v1";
  const preferredState = Number(root.dataset.initialState || 0);
  const storedState = interactive ? Number(localStorage.getItem(storageKey)) : Number.NaN;
  let stateIndex = Number.isInteger(storedState) && storedState >= 0 && storedState <= maximum
    ? storedState : preferredState;
  let yaw = -0.7;
  let pitch = 0.54;
  let frame = 0;
  let timer = 0;
  let playing = false;
  let finishCallback = null;
  let pointerId = null;
  let pointerX = 0;
  let pointerY = 0;
  const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  root.dataset.reducedMotion = String(prefersReducedMotion());
  const svg = root.querySelector("[data-l6-3d-svg]");
  const faceLayer = root.querySelector("[data-l6-faces]");
  const faces = new Map([...root.querySelectorAll("[data-l6-face]")].map((element) => [Number(element.dataset.l6Face), element]));
  const edges = [...root.querySelectorAll("[data-l6-poly-edge]")];
  const segments = [...root.querySelectorAll("[data-l6-segment]")];
  const currentMarker = root.querySelector("[data-l6-current-marker]");
  const currentLabel = root.querySelector("[data-l6-current-label]");
  const optimumMarker = root.querySelector("[data-l6-optimum-marker]");
  const optimumLabel = root.querySelector("[data-l6-optimum-label]");
  const stateCopies = [...root.querySelectorAll("[data-l6-state-copy]")];
  const status = root.querySelector("[data-l6-status]");
  const stateButtonElements = [...root.querySelectorAll("[data-l6-state-button]")];
  const actionButtons = new Map([...root.querySelectorAll("[data-l6-action]")].map((button) => [button.dataset.l6Action, button]));

  const cancelAnimation = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (finishCallback) finishCallback(false);
    finishCallback = null;
  };
  const persist = () => {
    if (interactive) localStorage.setItem(storageKey, String(stateIndex));
  };
  const updatePanel = () => {
    stateCopies.forEach((copy) =>
      copy.toggleAttribute("hidden", Number(copy.dataset.l6StateCopy) !== stateIndex));
  };

  const position = (point) => project3D(point, yaw, pitch);
  const setLine = (line, start, end) => {
    line.setAttribute("x1", String(start.x)); line.setAttribute("y1", String(start.y));
    line.setAttribute("x2", String(end.x)); line.setAttribute("y2", String(end.y));
  };

  const render = (progress = 1) => {
    const boundedProgress = Math.max(0, Math.min(1, progress));
    const projected = THREE_D_VERTICES.map(position);
    THREE_D_FACES.map((face, index) => ({
      index,
      depth: face.reduce((sum, vertex) => sum + projected[vertex].depth, 0) / face.length,
      points: face.map((vertex) => `${projected[vertex].x},${projected[vertex].y}`).join(" "),
    })).sort((a, b) => a.depth - b.depth).forEach((face) => {
      const element = faces.get(face.index);
      element.setAttribute("points", face.points);
      faceLayer.append(element);
    });
    edges.forEach((edge, index) => {
      const [from, to] = THREE_D_EDGES[index]; setLine(edge, projected[from], projected[to]);
    });
    segments.forEach((segment, index) => {
      const segmentNumber = index + 1;
      const start = position(THREE_D_PATH[index]);
      const target = position(THREE_D_PATH[segmentNumber]);
      if (segmentNumber > stateIndex) {
        segment.setAttribute("hidden", ""); setLine(segment, start, start); return;
      }
      const amount = segmentNumber === stateIndex ? boundedProgress : 1;
      const end = {
        x: start.x + (target.x - start.x) * amount,
        y: start.y + (target.y - start.y) * amount,
      };
      segment.removeAttribute("hidden"); setLine(segment, start, end);
    });
    let currentPoint = THREE_D_STATES[stateIndex].point;
    if (stateIndex > 0 && boundedProgress < 1) {
      const previous = THREE_D_STATES[stateIndex - 1].point;
      const target = THREE_D_STATES[stateIndex].point;
      currentPoint = previous.map((value, index) => value + (target[index] - value) * boundedProgress);
    }
    const current = position(currentPoint);
    currentMarker.setAttribute("cx", String(current.x)); currentMarker.setAttribute("cy", String(current.y));
    currentLabel.setAttribute("x", String(current.x + 14)); currentLabel.setAttribute("y", String(current.y + 24));
    currentLabel.textContent = `iterate ${stateIndex}`;
    const optimum = position([3, 3, 5]);
    optimumMarker.setAttribute("points", `${optimum.x},${optimum.y - 10} ${optimum.x + 10},${optimum.y} ${optimum.x},${optimum.y + 10} ${optimum.x - 10},${optimum.y}`);
    optimumLabel.setAttribute("x", String(optimum.x + 14)); optimumLabel.setAttribute("y", String(optimum.y - 12));
    const origin = position([0, 0, 0]);
    [["x", [7, 0, 0]], ["y", [0, 9, 0]], ["z", [0, 0, 6]]].forEach(([axis, endpoint]) => {
      const end = position(endpoint);
      const line = root.querySelector(`[data-l6-axis="${axis}"]`); setLine(line, origin, end);
      const label = root.querySelector(`[data-l6-axis-label="${axis}"]`);
      label.setAttribute("x", String(end.x + 8)); label.setAttribute("y", String(end.y));
    });
    root.dataset.currentState = String(stateIndex);
    root.dataset.visibleSegments = String(stateIndex - (stateIndex > 0 && boundedProgress < 1 ? 1 : 0));
    svg.setAttribute("aria-label", `Three-dimensional feasible polyhedron and cumulative simplex path through iteration ${stateIndex}; current point ${pointText(THREE_D_STATES[stateIndex].point)}; objective ${THREE_D_STATES[stateIndex].value}`);
    stateButtonElements.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.l6StateButton) === stateIndex)));
    actionButtons.get("previous")?.toggleAttribute("disabled", stateIndex <= 0);
    actionButtons.get("next")?.toggleAttribute("disabled", stateIndex >= maximum);
  };

  const finishState = (shouldAnnounce = true) => {
    render(1); persist();
    const state = THREE_D_STATES[stateIndex];
    const summary = root.classList.contains("l6-gilp-summary");
    status.textContent = `Iteration ${stateIndex}; point ${pointText(state.point)}; objective ${state.value}.${summary ? "" : ` ${state.transition}`}`;
    if (shouldAnnounce) announce(status.textContent);
  };

  const animateState = (target, callback = null, shouldTypeset = true) => {
    cancelAnimation();
    stateIndex = Math.max(0, Math.min(maximum, target));
    updatePanel(shouldTypeset);
    render(stateIndex > 0 ? 0 : 1);
    root.dataset.reducedMotion = String(prefersReducedMotion());
    if (stateIndex === 0 || prefersReducedMotion()) {
      finishState(); callback?.(true); return;
    }
    status.textContent = `Moving to iteration ${stateIndex}: ${pointText(THREE_D_STATES[stateIndex].point)}.`;
    const started = performance.now();
    finishCallback = callback;
    const tick = (now) => {
      const amount = Math.min(1, (now - started) / 720);
      render(1 - Math.pow(1 - amount, 3));
      if (amount < 1) { frame = requestAnimationFrame(tick); return; }
      frame = 0; finishState();
      const finished = finishCallback; finishCallback = null; finished?.(true);
    };
    frame = requestAnimationFrame(tick);
  };

  const setPlaying = (next) => {
    playing = next;
    const button = actionButtons.get("play");
    if (button) {
      button.textContent = playing ? "Pause" : "Play";
      button.setAttribute("aria-pressed", String(playing));
    }
    if (!playing) { if (timer) window.clearTimeout(timer); timer = 0; }
  };
  const playNext = () => {
    if (!playing) return;
    if (stateIndex >= maximum) { setPlaying(false); return; }
    animateState(stateIndex + 1, (completed) => {
      if (!completed || !playing) return;
      timer = window.setTimeout(playNext, 220);
    });
  };

  const clickHandlers = [];
  const bind = (element, handler) => {
    if (!element) return;
    element.addEventListener("click", handler); clickHandlers.push([element, handler]);
  };
  bind(actionButtons.get("replay"), () => animateState(stateIndex));
  bind(actionButtons.get("restart"), () => {
    setPlaying(false); cancelAnimation(); stateIndex = 0; localStorage.removeItem(storageKey);
    updatePanel(true); render(1); finishState();
  });
  bind(actionButtons.get("previous"), () => {
    setPlaying(false); cancelAnimation(); stateIndex = Math.max(0, stateIndex - 1);
    updatePanel(true); render(1); finishState();
  });
  bind(actionButtons.get("next"), () => { setPlaying(false); animateState(Math.min(maximum, stateIndex + 1)); });
  bind(actionButtons.get("play"), () => {
    if (playing) { setPlaying(false); cancelAnimation(); finishState(false); return; }
    if (stateIndex >= maximum) { stateIndex = 0; updatePanel(true); render(1); persist(); }
    setPlaying(true); playNext();
  });
  bind(actionButtons.get("rotate-left"), () => { yaw -= 0.16; render(1); });
  bind(actionButtons.get("rotate-right"), () => { yaw += 0.16; render(1); });
  stateButtonElements.forEach((button) => bind(button, () => {
    setPlaying(false);
    const target = Number(button.dataset.l6StateButton);
    if (target === stateIndex) finishState();
    else if (target === stateIndex + 1) animateState(target);
    else { cancelAnimation(); stateIndex = target; updatePanel(true); render(1); finishState(); }
  }));

  const pointerDown = (event) => {
    pointerId = event.pointerId; pointerX = event.clientX; pointerY = event.clientY;
    svg.setPointerCapture?.(pointerId); event.preventDefault();
  };
  const pointerMove = (event) => {
    if (pointerId !== event.pointerId) return;
    yaw += (event.clientX - pointerX) * 0.008;
    pitch = Math.max(0.2, Math.min(1.05, pitch + (event.clientY - pointerY) * 0.004));
    pointerX = event.clientX; pointerY = event.clientY; render(1);
  };
  const pointerUp = (event) => {
    if (pointerId !== event.pointerId) return;
    svg.releasePointerCapture?.(pointerId); pointerId = null;
  };
  const keyDown = (event) => {
    const delta = { ArrowLeft: -0.12, ArrowRight: 0.12 }[event.key];
    if (delta === undefined) return;
    event.preventDefault(); yaw += delta; render(1); announce("Rotated the three-dimensional feasible polyhedron.");
  };
  svg.addEventListener("pointerdown", pointerDown);
  svg.addEventListener("pointermove", pointerMove);
  svg.addEventListener("pointerup", pointerUp);
  svg.addEventListener("pointercancel", pointerUp);
  svg.addEventListener("keydown", keyDown);

  if (!interactive && stateIndex > 0) animateState(stateIndex, null, false);
  else { updatePanel(false); render(1); finishState(false); }

  return () => {
    setPlaying(false); cancelAnimation();
    clickHandlers.forEach(([element, handler]) => element.removeEventListener("click", handler));
    svg.removeEventListener("pointerdown", pointerDown);
    svg.removeEventListener("pointermove", pointerMove);
    svg.removeEventListener("pointerup", pointerUp);
    svg.removeEventListener("pointercancel", pointerUp);
    svg.removeEventListener("keydown", keyDown);
  };
}

const twoDStateSlides = TWO_D_STATES.map((state, index) => ({
  id: `l6-${String(index + 6).padStart(2, "0")}`,
  page: index + 6,
  className: "l6-gilp-slide",
  title: `GILP Path in Two Dimensions: Iteration ${index} at (${state.point.join(",")})`,
  html: twoDPlayerMarkup(index),
  printHtml: twoDPlayerMarkup(index, { print: true }),
  onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
    mountTwoDPlayer(slideElement, announce, typesetMath, clearMath),
}));

const threeDStateSlides = THREE_D_STATES.map((state, index) => ({
  id: `l6-${String(index + 11).padStart(2, "0")}`,
  page: index + 11,
  className: "l6-gilp-slide l6-gilp-slide-3d",
  title: `GILP Path in Three Dimensions: Iteration ${index}`,
  html: threeDPlayerMarkup(index),
  printHtml: threeDPlayerMarkup(index, { print: true }),
  onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
    mountThreeDPlayer(slideElement, announce, typesetMath, clearMath),
}));

export const slides = [
  {
    id: "l6-01",
    page: 1,
    kind: "title",
    className: "l6-title",
    eyebrow: "ISE 5405 · Optimization I",
    title: "Simplex I: Basis Directions and Reduced Costs",
    html: String.raw`
      <div class="l6-title-grid">
        <div>
          <p class="l6-title-kicker">Lecture 5</p>
          <p class="l6-lede">From a Basis to a Better Corner</p>
          <p class="l6-muted">Bertsimas–Tsitsiklis §§3.1–3.2 · September 10, 2026</p>
          <div class="ns-title-shortcuts" aria-label="Presentation keyboard shortcuts">
            <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span><span><kbd>←</kbd> back</span>
            <span><kbd>F</kbd> fullscreen</span><span><kbd>M</kbd> menu</span>
            <span><kbd>P</kbd> pen</span><span><kbd>E</kbd> eraser</span>
            <span><kbd>C</kbd> clear ink</span><span><kbd>L</kbd> laser</span>
            <span><kbd>W</kbd> whiteboard</span><span><kbd>H</kbd> handout</span>
            <span><kbd>K</kbd> checkpoint</span><span><kbd>?</kbd> help</span>
          </div>
          <p class="ns-title-handout"><strong>Saving an annotated PDF:</strong> press <kbd>H</kbd>, then print and choose “Save as PDF.” Final reveal states and saved slide ink are included.</p>
        </div>
        <svg class="l6-title-art" viewBox="0 0 480 340" role="img" aria-label="A simplex path climbing along edges of a translucent three-dimensional polyhedron">
          <g fill="#d9edf7" fill-opacity=".72" stroke="#1f5d7a" stroke-width="4">
            <polygon points="80,265 205,310 392,245 260,205"/><polygon points="80,265 128,105 268,58 205,310"/>
            <polygon points="205,310 268,58 420,133 392,245"/><polygon points="128,105 268,58 420,133 260,205"/>
          </g>
          <polyline points="80,265 205,310 392,245 420,133 268,58" fill="none" stroke="#c64600" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="80" cy="265" r="13" fill="white" stroke="#861f41" stroke-width="6"/>
          <polygon points="268,42 284,58 268,74 252,58" fill="#861f41" stroke="white" stroke-width="4"/>
        </svg>
      </div>`,
  },
  {
    id: "l6-02",
    page: 2,
    title: "What You Should Be Able to Do",
    html: String.raw`
      <ol class="l6-outcomes">
        <li><strong>Explain</strong> why simplex moves between basic feasible solutions.</li>
        <li><strong>Construct</strong> a basic direction by solving one basis system.</li>
        <li><strong>Interpret</strong> a reduced cost as an objective slope.</li>
        <li><strong>Apply</strong> the ratio test and identify entering and leaving variables.</li>
        <li><strong>Recognize</strong> optimality, unboundedness, and a degenerate pivot.</li>
      </ol>
      <aside class="l6-callout" data-tone="orange" data-reveal><strong>Today’s route:</strong> see the path, derive the direction, price the direction, then take one pivot.</aside>`,
  },
  {
    id: "l6-03",
    page: 3,
    title: "The Standard-Form Setting",
    html: String.raw`
      <div class="l6-equation ns-math" role="math" aria-label="Minimize c transpose x subject to A x equals b and x nonnegative">
        \[\min\{c^\top x:Ax=b,\ x\ge0\},\qquad A\in\mathbb R^{m\times n},\quad \operatorname{rank}(A)=m.\]
      </div>
      <p>A feasible basis chooses \(m\) independent columns \(B=A_{\mathcal B}\) and sets</p>
      <div class="l6-equation ns-math">\[x_{\mathcal B}=B^{-1}b\ge0,\qquad x_{\mathcal N}=0.\]</div>
      <aside class="l6-callout" data-tone="maroon" data-reveal><strong>Starting point:</strong> primal simplex starts from a feasible basis and preserves feasibility while searching for a lower objective value.</aside>`,
  },
  {
    id: "l6-04",
    page: 4,
    title: "The Simplex Method: The Big Picture",
    html: String.raw`
      <ol class="l6-cycle">
        <li data-reveal="locate"><span>1</span><div><strong>Locate a corner</strong><p>Start at a basic feasible solution.</p></div></li>
        <li data-reveal="locate"><span>2</span><div><strong>Price its edges</strong><p>Find a basic direction that lowers the cost.</p></div></li>
        <li data-reveal="move"><span>3</span><div><strong>Move to the neighbor</strong><p>Go as far as feasibility permits.</p></div></li>
        <li data-reveal="move"><span>4</span><div><strong>Stop or repeat</strong><p>Stop when every nonbasic reduced cost is nonnegative.</p></div></li>
      </ol>
      <aside class="l6-callout" data-tone="green" data-reveal="theorem"><strong>Why corners are enough:</strong> if an LP has an optimal solution, then it has an optimal basic feasible solution.</aside>`,
  },
  {
    id: "l6-05",
    page: 5,
    title: "How to Read the GILP Sequence",
    html: String.raw`
      <p>The GILP reference sequence uses</p>
      <div class="l6-equation ns-math">\[\max\ z=5x_1+3x_2,\]</div>
      <p>whereas our algebra uses minimization. Multiplying by \(-1\) connects the conventions:</p>
      <div class="l6-sign-bridge ns-math" aria-label="Larger z in the picture is equivalent to a negative reduced cost when minimizing negative z">
        <span>larger \(z\) in the picture</span><span aria-hidden="true">⇅</span><span>negative reduced cost for minimizing \(-z\)</span>
      </div>
      <aside class="l6-callout" data-tone="blue" data-reveal><strong>Watch three things:</strong> the red path accumulates, the current basis dictionary changes, and every move follows an edge of the blue feasible set.</aside>`,
  },
  ...twoDStateSlides,
  {
    id: "l6-10",
    page: 10,
    className: "l6-gilp-slide l6-gilp-synthesis",
    title: "What the 2D Path Shows",
    html: String.raw`
      <div class="l6-sequence-equations ns-math">
        <span>\((0,0)\to(7,0)\to(7,6)\to(4,12)\)</span>
        <span>\(z:\ 0\to35\to53\to56\)</span>
      </div>
      ${twoDPlayerMarkup(0, { interactive: true, summary: true })}`,
    printHtml: String.raw`
      <div class="l6-sequence-equations ns-math"><span>\((0,0)\to(7,0)\to(7,6)\to(4,12)\)</span><span>\(z:\ 0\to35\to53\to56\)</span></div>
      ${twoDPlayerMarkup(3, { summary: true, print: true })}`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountTwoDPlayer(slideElement, announce, typesetMath, clearMath),
  },
  ...threeDStateSlides,
  {
    id: "l6-16",
    page: 16,
    className: "l6-gilp-slide l6-gilp-synthesis",
    title: "The Same Mechanism in 3D",
    html: String.raw`
      ${threeDPlayerMarkup(0, { interactive: true, summary: true })}
      <aside class="l6-callout l6-algorithm-question" data-tone="orange" data-reveal><strong>The algorithmic question:</strong> which nonbasic variable gives an improving direction, and how far can we move?</aside>`,
    printHtml: String.raw`
      ${threeDPlayerMarkup(4, { summary: true, print: true })}
      <aside class="l6-callout l6-algorithm-question" data-tone="orange"><strong>The algorithmic question:</strong> which nonbasic variable gives an improving direction, and how far can we move?</aside>`,
    checkpoint: checkpointGeometry,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountThreeDPlayer(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l6-17",
    page: 17,
    title: "Feasible Directions",
    html: String.raw`
      <section class="l6-card">
        <h3>Definition</h3>
        <p>For \(x\in P\), a vector \(d\in\mathbb R^n\) is a <strong>feasible direction</strong> at \(x\) if some \(\epsilon>0\) satisfies</p>
        <div class="l6-equation ns-math">\[x+\theta d\in P\qquad\text{for every }0\le\theta\le\epsilon.\]</div>
      </section>
      <p>For \(P=\{x:Ax=b,\ x\ge0\}\), two checks are required:</p>
      <div class="l6-check-pair" data-reveal>
        <span>\(Ad=0\)<small>preserve equalities</small></span>
        <span>\(x+\theta d\ge0\)<small>preserve nonnegativity for a small positive step</small></span>
      </div>`,
  },
  {
    id: "l6-18",
    page: 18,
    title: "A Basis Partitions the Variables",
    html: String.raw`
      <div class="l6-equation ns-math">\[A=[\,B\ A_{\mathcal N}\,],\qquad x=\begin{bmatrix}x_{\mathcal B}\\x_{\mathcal N}\end{bmatrix},\qquad x_{\mathcal B}=B^{-1}b,\quad x_{\mathcal N}=0.\]</div>
      <p class="l6-emphasis-line" data-reveal="leave">To leave this corner, choose one nonbasic variable \(x_j\) to increase while the other nonbasic variables remain zero.</p>
      <aside class="l6-callout" data-tone="blue" data-reveal="edge"><strong>One column, one candidate edge:</strong> each nonbasic column \(A_j\) defines one basic direction relative to the current basis.</aside>`,
  },
  {
    id: "l6-19",
    page: 19,
    className: "l6-derivation-slide",
    title: "Construct a Basic Direction: State 1 of 3",
    html: String.raw`
      <p>Choose a nonbasic index \(j\in\mathcal N\). Prescribe</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step" data-step="1">\[d_j=1,\qquad d_k=0\quad(k\in\mathcal N\setminus\{j\}).\]</div>
        <div class="l6-proof-slot" aria-hidden="true"></div>
        <div class="l6-proof-slot" aria-hidden="true"></div>
      </div>
      <aside class="l6-callout" data-tone="orange"><strong>Interpretation:</strong> \(x_j\) increases at unit rate; the basic variables must compensate so the equalities remain satisfied.</aside>`,
  },
  {
    id: "l6-20",
    page: 20,
    className: "l6-derivation-slide",
    title: "Construct a Basic Direction: State 2 of 3",
    html: String.raw`
      <p>Keep the prescribed nonbasic components visible:</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step" data-step="1">\[d_j=1,\qquad d_k=0\quad(k\in\mathcal N\setminus\{j\}).\]</div>
        <div class="l6-proof-step" data-step="2" data-reveal="preserve">\[0=Ad=Bd_{\mathcal B}+A_j.\]</div>
        <div class="l6-proof-step" data-step="3" data-reveal="solve">\[Bd_{\mathcal B}=-A_j.\]</div>
      </div>`,
  },
  {
    id: "l6-21",
    page: 21,
    className: "l6-derivation-slide",
    title: "Construct a Basic Direction: State 3 of 3",
    html: String.raw`
      <p>The complete cumulative derivation is</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step" data-step="1">\[d_j=1,\qquad d_k=0\quad(k\in\mathcal N\setminus\{j\}).\]</div>
        <div class="l6-proof-step" data-step="2">\[0=Ad=Bd_{\mathcal B}+A_j.\]</div>
        <div class="l6-proof-step l6-proof-result" data-step="3" data-reveal>\[\boxed{d_{\mathcal B}=-B^{-1}A_j}.\]</div>
      </div>
      <aside class="l6-callout" data-tone="green" data-reveal><strong>Compute by solving:</strong> solve \(Bd_{\mathcal B}=-A_j\). The inverse notation describes the answer; it is not an instruction to form \(B^{-1}\).</aside>`,
  },
  {
    id: "l6-22",
    page: 22,
    title: "Equality Preservation Is Not Enough",
    html: String.raw`
      <section class="l6-card" data-tone="green"><h3>Nondegenerate basic feasible solution</h3><p>If \(x_{\mathcal B}>0\), every basic direction permits a sufficiently small positive step: \(x_{\mathcal B}+\theta d_{\mathcal B}\ge0\).</p></section>
      <section class="l6-card" data-tone="orange" data-reveal><h3>Degenerate basic feasible solution</h3><p>If some \(x_{B(i)}=0\) and \(d_{B(i)}<0\), every positive step makes that component negative. The direction is blocked at \(\theta=0\).</p></section>
      <aside class="l6-callout" data-tone="maroon" data-reveal><strong>The distinction:</strong> equality preservation gives an algebraically valid direction; nonnegativity decides whether it permits a positive geometric move.</aside>`,
  },
  {
    id: "l6-23",
    page: 23,
    className: "l6-derivation-slide",
    title: "Objective Slope Along a Basic Direction",
    html: String.raw`
      <p>Along \(x(\theta)=x+\theta d\),</p>
      <div class="l6-derivation-history l6-three-lines">
        <div class="l6-proof-step">\[c^\top x(\theta)=c^\top x+\theta c^\top d.\]</div>
        <div class="l6-proof-step" data-reveal="slope">\[c^\top d=c_j+c_{\mathcal B}^\top d_{\mathcal B}\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="slope">\[=c_j-c_{\mathcal B}^\top B^{-1}A_j.\]</div>
      </div>
      <aside class="l6-callout" data-tone="blue" data-reveal="meaning">This scalar is the objective change per unit increase in \(x_j\).</aside>`,
  },
  {
    id: "l6-24",
    page: 24,
    title: "Reduced Cost",
    html: String.raw`
      <section class="l6-card l6-definition-card">
        <h3>Definition</h3>
        <p>The reduced cost of \(x_j\) relative to basis \(B\) is</p>
        <div class="l6-equation ns-math">\[\boxed{\bar c_j=c_j-c_{\mathcal B}^\top B^{-1}A_j}.\]</div>
      </section>
      <div class="l6-sign-table" role="table" aria-label="Reduced-cost signs for a minimization problem" data-reveal>
        <div role="row"><strong role="cell">\(\bar c_j<0\)</strong><span role="cell">improving slope</span></div>
        <div role="row"><strong role="cell">\(\bar c_j=0\)</strong><span role="cell">locally flat direction</span></div>
        <div role="row"><strong role="cell">\(\bar c_j>0\)</strong><span role="cell">objective initially rises</span></div>
      </div>`,
  },
  {
    id: "l6-25",
    page: 25,
    title: "Compute Reduced Costs with a Transpose Solve",
    html: String.raw`
      <p>Rather than form \(B^{-1}\), solve</p>
      <div class="l6-equation ns-math">\[B^\top y=c_{\mathcal B}.\]</div>
      <div class="l6-derivation-pair" data-reveal>
        <span>\(y^\top=c_{\mathcal B}^\top B^{-1}\)</span>
        <span>\(\boxed{\bar c_j=c_j-y^\top A_j}\)</span>
      </div>
      <aside class="l6-callout" data-tone="green" data-reveal><strong>Reusable basis computation:</strong> one factorization of \(B\) supports basic values, pivot columns, and the transpose solve used for pricing.</aside>`,
  },
  {
    id: "l6-26",
    page: 26,
    className: "l6-derivation-slide",
    title: "Every Basic Variable Has Zero Reduced Cost",
    html: String.raw`
      <p>For a basic index \(B(i)\),</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[B^{-1}A_{B(i)}=e_i.\]</div>
        <div class="l6-proof-step" data-reveal="substitute">\[\bar c_{B(i)}=c_{B(i)}-c_{\mathcal B}^\top B^{-1}A_{B(i)}\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="finish">\[=c_{B(i)}-c_{\mathcal B}^\top e_i=0.\]</div>
      </div>
      <aside class="l6-callout" data-tone="blue" data-reveal="finish"><strong>Therefore:</strong> only nonbasic reduced costs need to be examined.</aside>`,
  },
  {
    id: "l6-27",
    page: 27,
    title: "Optimality Conditions",
    html: String.raw`
      <section class="l6-card l6-theorem-card">
        <h3>Theorem</h3>
        <p>Let \(x\) be a basic feasible solution associated with basis \(B\).</p>
        <ol>
          <li>If every reduced cost is nonnegative, then \(x\) is optimal.</li>
          <li>If \(x\) is optimal and nondegenerate, then every reduced cost is nonnegative.</li>
        </ol>
      </section>
      <aside class="l6-callout" data-tone="orange" data-reveal><strong>Degenerate caveat:</strong> an optimal degenerate point can have a basis with a negative reduced cost whose direction is blocked at step zero.</aside>`,
  },
  {
    id: "l6-28",
    page: 28,
    className: "l6-derivation-slide l6-proof-optimality",
    title: "Why Nonnegative Reduced Costs Prove Optimality",
    html: String.raw`
      <p>For any feasible \(x\), retain each substitution:</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[x_{\mathcal B}=B^{-1}b-B^{-1}A_{\mathcal N}x_{\mathcal N}.\]</div>
        <div class="l6-proof-step" data-reveal="substitute">\[c^\top x=c_{\mathcal B}^\top B^{-1}b+\bigl(c_{\mathcal N}^\top-c_{\mathcal B}^\top B^{-1}A_{\mathcal N}\bigr)x_{\mathcal N}\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="collect">\[=c_{\mathcal B}^\top B^{-1}b+\bar c_{\mathcal N}^\top x_{\mathcal N}.\]</div>
      </div>
      <aside class="l6-callout" data-tone="green" data-reveal="conclude">If \(\bar c_{\mathcal N}\ge0\) and \(x_{\mathcal N}\ge0\), no feasible point has value below the current basic value.</aside>`,
  },
  {
    id: "l6-29",
    page: 29,
    title: "The Two Checks for an Optimal Basis",
    html: String.raw`
      <div class="l6-optimal-checks">
        <section><h3>1 · Primal feasibility</h3><div class="ns-math">\[\boxed{B^{-1}b\ge0}\]</div><p>The associated basic solution lies in the feasible set.</p></section>
        <section data-reveal><h3>2 · Optimality</h3><div class="ns-math">\[\boxed{\bar c_{\mathcal N}\ge0}\]</div><p>No nonbasic direction has a negative objective slope.</p></section>
      </div>
      <aside class="l6-callout" data-tone="orange" data-reveal><strong>Keep the questions separate:</strong> a nonsingular basis need not be feasible, and a feasible basis need not be optimal.</aside>`,
    checkpoint: checkpointOptimality,
  },
  {
    id: "l6-30",
    page: 30,
    className: "l6-derivation-slide",
    title: "A Negative Reduced Cost Chooses an Entering Variable",
    html: String.raw`
      <p>Suppose a nonbasic \(x_j\) has \(\bar c_j<0\). Let</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[u=B^{-1}A_j,\qquad d_{\mathcal B}=-u,\qquad d_j=1.\]</div>
        <div class="l6-proof-step" data-reveal="path">\[x_{\mathcal B}(\theta)=x_{\mathcal B}-\theta u,\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="path">\[c^\top x(\theta)=c^\top x+\theta\bar c_j.\]</div>
      </div>
      <aside class="l6-callout" data-tone="blue" data-reveal="enter"><strong>Entering variable:</strong> \(x_j\) enters if the ratio test permits a positive move.</aside>`,
  },
  {
    id: "l6-31",
    page: 31,
    className: "l6-derivation-slide",
    title: "The Maximum Feasible Step",
    html: String.raw`
      <p>For each component with \(u_i>0\), nonnegativity requires</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[x_{\mathcal B,i}-\theta u_i\ge0\]</div>
        <div class="l6-proof-step" data-reveal="bound">\[\theta\le\frac{x_{\mathcal B,i}}{u_i}\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="ratio">\[\boxed{\theta^*=\min_{i:u_i>0}\frac{x_{\mathcal B,i}}{u_i}}.\]</div>
      </div>
      <aside class="l6-callout" data-tone="orange" data-reveal="ratio">An index attaining the minimum identifies a basic variable that reaches zero and may <strong>leave</strong> the basis.</aside>`,
  },
  {
    id: "l6-32",
    page: 32,
    className: "l6-derivation-slide",
    title: "When No Variable Blocks the Move",
    html: String.raw`
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[u\le0\quad\Longrightarrow\quad d_{\mathcal B}=-u\ge0\quad\Longrightarrow\quad x+\theta d\ge0\ \text{for every }\theta\ge0.\]</div>
        <div class="l6-proof-step" data-reveal="certificate">\[Ad=0,\qquad d\ge0,\qquad c^\top d=\bar c_j<0.\]</div>
        <div class="l6-proof-slot" aria-hidden="true"></div>
      </div>
      <aside class="l6-callout" data-tone="maroon" data-reveal="unbounded"><strong>Unboundedness certificate:</strong> \(x+\theta d\) stays feasible while the objective tends to \(-\infty\).</aside>`,
  },
  {
    id: "l6-33",
    page: 33,
    className: "l6-algorithm-slide",
    title: "One Simplex Iteration: State 1 of 2",
    html: String.raw`
      <ol class="l6-algorithm">
        <li data-reveal="start"><span>1</span><p>Start with a feasible basis \(B\) and \(x_{\mathcal B}=B^{-1}b\).</p></li>
        <li data-reveal="price"><span>2</span><p>Solve \(B^\top y=c_{\mathcal B}\) and price \(\bar c_j=c_j-y^\top A_j\).</p></li>
        <li data-reveal="price"><span>3</span><p>If every \(\bar c_j\ge0\), stop: the current basis is optimal.</p></li>
        <li data-reveal="enter"><span>4</span><p>Otherwise choose \(j\) with \(\bar c_j<0\) and solve \(Bu=A_j\).</p></li>
        <li class="l6-algorithm-placeholder" aria-hidden="true"></li><li class="l6-algorithm-placeholder" aria-hidden="true"></li>
      </ol>`,
  },
  {
    id: "l6-34",
    page: 34,
    className: "l6-algorithm-slide",
    title: "One Simplex Iteration: State 2 of 2",
    html: String.raw`
      <ol class="l6-algorithm l6-algorithm-complete">
        <li><span>1</span><p>Start with a feasible basis \(B\) and \(x_{\mathcal B}=B^{-1}b\).</p></li>
        <li><span>2</span><p>Price nonbasic columns; stop if every \(\bar c_j\ge0\).</p></li>
        <li><span>3</span><p>Choose entering \(j\) with \(\bar c_j<0\); solve \(Bu=A_j\).</p></li>
        <li data-reveal="unbounded"><span>4</span><p>If \(u\le0\), return the unbounded direction \(d\).</p></li>
        <li data-reveal="ratio"><span>5</span><p>Otherwise compute \(\displaystyle\theta^*=\min_{i:u_i>0}x_{\mathcal B,i}/u_i\).</p></li>
        <li data-reveal="pivot"><span>6</span><p>Choose a minimizing row, exchange entering and leaving columns, and update.</p></li>
      </ol>`,
    checkpoint: checkpointUnbounded,
  },
  {
    id: "l6-35",
    page: 35,
    className: "l6-worked-slide",
    title: "Worked Example",
    html: String.raw`
      <div class="l6-worked-model ns-math">
        \[\begin{aligned}\min\quad&-10x_1-12x_2-12x_3\\
        \text{s.t.}\quad&x_1+2x_2+2x_3+x_4=20,\\
        &2x_1+x_2+2x_3+x_5=20,\\
        &2x_1+2x_2+x_3+x_6=20,\\&x\ge0.\end{aligned}\]
      </div>
      <aside class="l6-callout" data-tone="blue" data-reveal><strong>Slack-basis start:</strong> \(B_0=[A_4\ A_5\ A_6]=I\), so \(x^{(0)}=(0,0,0,20,20,20)\) and \(c^\top x^{(0)}=0\).</aside>`,
  },
  {
    id: "l6-36",
    page: 36,
    title: "Your Turn: Choose a First Pivot",
    html: String.raw`
      <div class="l6-equation ns-math">\[\bar c=(-10,-12,-12,0,0,0).\]</div>
      <ol class="l6-questions">
        <li>Which nonbasic variables are eligible to enter?</li>
        <li>Which variable does the most-negative rule choose, breaking a tie by smaller index?</li>
        <li>May a different eligible variable enter under another valid simplex rule?</li>
      </ol>
      <section class="l6-answer" data-reveal="answer"><h3>Answer</h3><p>\(x_1,x_2,x_3\) are eligible; the stated most-negative rule selects \(x_2\); and yes—\(x_1\) or \(x_3\) may enter under a valid rule.</p></section>
      <aside class="l6-callout" data-tone="orange" data-reveal="trace"><strong>Our worked trace deliberately chooses \(x_1\).</strong> It is valid, though not the most-negative choice.</aside>`,
  },
  {
    id: "l6-37",
    page: 37,
    className: "l6-derivation-slide",
    title: "First Pivot: Direction and Ratio Test",
    html: String.raw`
      <p>For entering variable \(x_1\),</p>
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[u=B_0^{-1}A_1=A_1=\begin{bmatrix}1\\2\\2\end{bmatrix}.\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="ratio">\[\theta^*=\min\left\{\frac{20}{1},\frac{20}{2},\frac{20}{2}\right\}=10.\]</div>
        <div class="l6-proof-slot" aria-hidden="true"></div>
      </div>
      <aside class="l6-callout" data-tone="orange" data-reveal="tie">Rows \(x_5\) and \(x_6\) tie. Choosing the smaller variable index makes \(x_5\) leave and \(x_1\) enter.</aside>`,
  },
  {
    id: "l6-38",
    page: 38,
    title: "After the First Pivot",
    html: String.raw`
      <div class="l6-pivot-summary">
        <section><h3>Updated point</h3><p>\(x^{(1)}=(10,0,0,10,0,0)\)</p><p>\(c^\top x^{(1)}=-100\)</p></section>
        <section><h3>New basis</h3><p>\(B_1=[A_4\ A_1\ A_6]\)</p><p>remaining reduced costs: \(\bar c_2=-7,\ \bar c_3=-2\)</p></section>
      </div>
      <aside class="l6-callout" data-tone="maroon" data-reveal="degenerate"><strong>A degenerate arrival:</strong> \(x_6\) remains basic at value zero because two ratios tied. The step length was positive, but the new BFS is degenerate.</aside>
      <p class="l6-emphasis-line" data-reveal="continue">Both \(x_2\) and \(x_3\) still have negative reduced costs, so simplex continues.</p>`,
    checkpoint: checkpointDegeneratePivot,
  },
  {
    id: "l6-39",
    page: 39,
    className: "l6-final-dictionary-slide",
    title: "The Final Dictionary",
    html: String.raw`
      <p>After valid pivots, use basic row order \(x_3,x_1,x_2\) and nonbasic slacks \(x_4,x_5,x_6\):</p>
      <table class="l6-dictionary-table">
        <caption class="l6-visually-hidden">Final simplex dictionary coefficients</caption>
        <thead><tr><th scope="col">basic</th><th scope="col">value</th><th scope="col">\(x_4\)</th><th scope="col">\(x_5\)</th><th scope="col">\(x_6\)</th></tr></thead>
        <tbody>
          <tr><th scope="row">\(x_3\)</th><td>4</td><td>\(-2/5\)</td><td>\(-2/5\)</td><td>\(3/5\)</td></tr>
          <tr><th scope="row">\(x_1\)</th><td>4</td><td>\(3/5\)</td><td>\(-2/5\)</td><td>\(-2/5\)</td></tr>
          <tr><th scope="row">\(x_2\)</th><td>4</td><td>\(-2/5\)</td><td>\(3/5\)</td><td>\(-2/5\)</td></tr>
        </tbody>
      </table>
      <aside class="l6-callout" data-tone="green" data-reveal>Set \(x_4=x_5=x_6=0\): \(\boxed{x^*=(4,4,4,0,0,0)}\).</aside>`,
  },
  {
    id: "l6-40",
    page: 40,
    className: "l6-derivation-slide",
    title: "Verify the Final Basis",
    html: String.raw`
      <div class="l6-derivation-history">
        <div class="l6-proof-step">\[B_*^{-1}b=\begin{bmatrix}4\\4\\4\end{bmatrix}\ge0.\]</div>
        <div class="l6-proof-step" data-reveal="costs">\[\bar c_4=\frac{18}{5},\qquad \bar c_5=\frac{8}{5},\qquad \bar c_6=\frac{8}{5}.\]</div>
        <div class="l6-proof-step l6-proof-result" data-reveal="finish">\[c^\top x^*=-136.\]</div>
      </div>
      <aside class="l6-callout" data-tone="green" data-reveal="finish"><strong>Optimal:</strong> both the primal-feasibility and reduced-cost checks pass.</aside>`,
  },
  {
    id: "l6-41",
    page: 41,
    title: "Why Simplex Terminates Without Degeneracy",
    html: String.raw`
      <p>Assume every basic feasible solution is nondegenerate.</p>
      <ol class="l6-proof-list">
        <li data-reveal="decrease"><strong>Strict decrease:</strong> \(\theta^*>0\) and \(\bar c_j<0\), so every finite pivot lowers the objective.</li>
        <li data-reveal="revisit"><strong>No revisit:</strong> a basic feasible solution cannot be visited twice.</li>
        <li data-reveal="finite"><strong>Finite choices:</strong> there are only finitely many bases.</li>
      </ol>
      <p class="l6-conclusion" data-reveal="conclude">Therefore simplex terminates with an optimal basis or an unboundedness certificate.</p>
      <aside class="l6-callout" data-tone="blue" data-reveal="conclude"><strong>What the assumption buys:</strong> strict improvement—not merely a change of basis—drives the finite argument.</aside>`,
  },
  {
    id: "l6-42",
    page: 42,
    title: "Degeneracy and Cycling: A Preview",
    html: String.raw`
      <p>At a degenerate basic feasible solution:</p>
      <ul class="l6-consequence-list">
        <li>the minimum ratio can be \(\theta^*=0\);</li>
        <li>the basis can change while the point and objective stay fixed;</li>
        <li>a sequence of such pivots can revisit a basis and cycle.</li>
      </ul>
      <aside class="l6-callout" data-tone="maroon" data-reveal><strong>Pivot-rule precision:</strong> Bland’s anti-cycling rule selects the smallest eligible index for <em>both</em> entering and leaving choices.</aside>
      <p class="l6-muted" data-reveal>We will study degeneracy and anti-cycling rules in the later simplex meetings.</p>`,
  },
  {
    id: "l6-43",
    page: 43,
    title: "Implementation Preview and Takeaway",
    html: String.raw`
      <section class="l6-card"><h3>Full tableau</h3><p>Stores \(B^{-1}b\) and \(B^{-1}A\); pivots are explicit row operations.</p></section>
      <section class="l6-card" data-reveal="revised"><h3>Revised simplex</h3><p>Stores a basis factorization, computes only needed solves, and exploits sparsity. It does not repeatedly form \(B^{-1}\).</p></section>
      <aside class="l6-callout l6-final-flow" data-tone="orange" data-reveal="flow">
        <strong>The complete logic</strong>
        <div class="ns-math">\[\text{feasible basis}\to\text{price}\to\text{direction}\to\text{ratio test}\to\text{pivot or certificate}.\]</div>
      </aside>`,
  },
];

export const deck = {
  schemaVersion: 1,
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  metadata,
  styles: new URL("./lecture-06.css", import.meta.url).href,
  slides,
};

export default deck;
