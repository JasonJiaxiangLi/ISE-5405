/**
 * Native Lecture 10 / public Lecture 6: Simplex II.
 *
 * The lifted-column diagrams reproduce the complete instructional geometry of
 * the canonical PDF with exact source coordinates.  All derivations reveal
 * cumulatively: an earlier line remains visible when the next line appears.
 */

const checkpointAdjacency = Object.freeze({
  prompt: "At a degenerate basic feasible solution, does exchanging one basis column always move to a distinct vertex?",
  choices: [
    "Yes — adjacent bases always represent adjacent vertices",
    "No — several bases can represent the same point, so the step can have length zero",
    "Yes, provided the entering reduced cost is negative",
    "No — a degenerate basis can never pivot",
  ],
  correctIndex: 1,
  explanation:
    "Simplex moves between bases. At a degenerate BFS, a one-column exchange can change the basis while leaving both the feasible point and objective value unchanged.",
  autoOpen: true,
});

const checkpointRatio = Object.freeze({
  prompt: "For u = B⁻¹Aⱼ, which rows constrain the positive step θ in x_B(θ) = x_B − θu?",
  choices: [
    "Only rows with uᵢ > 0",
    "Only rows with uᵢ < 0",
    "Every row, using the absolute value of uᵢ",
    "Only rows whose basic value is strictly positive",
  ],
  correctIndex: 0,
  explanation:
    "When uᵢ > 0, the component x_B,i − θuᵢ decreases and can hit zero. Rows with uᵢ ≤ 0 do not impose an upper bound on a nonnegative step.",
  autoOpen: true,
});

const checkpointReducedCost = Object.freeze({
  prompt: "At a degenerate BFS in a minimization problem, what does c̄ⱼ < 0 guarantee?",
  choices: [
    "A strictly positive feasible step",
    "The largest possible objective improvement",
    "An improving objective slope, but not necessarily a positive step",
    "That the current point is not optimal",
  ],
  correctIndex: 2,
  explanation:
    "A negative reduced cost prices the basic direction: its objective slope is negative. A zero basic component can still block that direction at θ = 0.",
  autoOpen: true,
});

const checkpointOptimalBasis = Object.freeze({
  prompt: "Which pair certifies that a basis is optimal for this minimization LP?",
  choices: [
    "B⁻¹b ≥ 0 and every nonbasic reduced cost is nonnegative",
    "B⁻¹b = 0 and every nonbasic reduced cost is negative",
    "B is nonsingular and the objective value is negative",
    "Every basic variable and every reduced cost is strictly positive",
  ],
  correctIndex: 0,
  explanation:
    "B⁻¹b ≥ 0 supplies primal feasibility. Nonnegative nonbasic reduced costs show that no feasible nonbasic displacement can lower the objective.",
  autoOpen: true,
});

export const metadata = {
  id: "lecture-10",
  number: 10,
  title: "Simplex II: Directions, Reduced Costs, and Column Geometry",
  subtitle: "Lecture 6 · Optimality and One Pivot",
  course: "ISE 5405 · Optimization I",
  date: "2026-09-15",
  homeUrl: "../../",
  pdfUrl: "../../materials/lecture_10.pdf",
  whiteboards: 3,
};

const LIFTED_POINTS = Object.freeze({
  B: Object.freeze([1.0, 3.0, 4.1]),
  C: Object.freeze([4.0, 2.8, 3.4]),
  D: Object.freeze([3.5, 0.8, 1.2]),
  E: Object.freeze([2.2, 1.1, 0.30]),
  F: Object.freeze([0.0, 0.6, 2.1]),
  b: Object.freeze([2.3, 1.0, 0]),
  G: Object.freeze([2.3, 1.0, 408 / 655]),
  H: Object.freeze([2.3, 1.0, 6299 / 3450]),
  P: Object.freeze([2.2, 1.1, 13637 / 6900]),
});

function projectLifted([x, y, z]) {
  const scale = 68;
  return [
    66 + scale * (0.85 * x + 0.42 * y),
    355 - scale * (-0.16 * x + 0.26 * y + 0.68 * z),
  ];
}

function liftedPoint(name, { className = "", dx = 9, dy = -9 } = {}) {
  const coordinates = LIFTED_POINTS[name];
  const [cx, cy] = projectLifted(coordinates);
  const [x, y, z] = coordinates;
  return `<g class="l10-lift-point ${className}" data-l10-lift-point="${name}" data-x="${x}" data-y="${y}" data-z="${z}">
    <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="6"/>
    <text x="${(cx + dx).toFixed(2)}" y="${(cy + dy).toFixed(2)}">${name}</text>
  </g>`;
}

function liftedLine(a, b, className = "") {
  const [x1, y1] = projectLifted(LIFTED_POINTS[a]);
  const [x2, y2] = projectLifted(LIFTED_POINTS[b]);
  return `<line class="${className}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
}

function liftedPolygon(names, className) {
  const points = names.map((name) => projectLifted(LIFTED_POINTS[name]).map((value) => value.toFixed(2)).join(",")).join(" ");
  return `<polygon class="${className}" points="${points}" data-l10-lift-face="${names.join("")}"/>`;
}

function columnHullSvg() {
  const requirementTop = projectLifted([2.3, 1.0, 4.5]);
  const requirementBottom = projectLifted(LIFTED_POINTS.b);
  return `
    <svg class="l10-lifted-svg" viewBox="0 0 520 390" role="img" aria-labelledby="l10-hull-title l10-hull-desc" data-l10-column-hull>
      <title id="l10-hull-title">Lifted column hull and vertical requirement line</title>
      <desc id="l10-hull-desc">Columns B through F are lifted by their costs. The vertical line through b intersects the hull first at G, the optimal cost; H is a higher intersection.</desc>
      <defs><marker id="l10-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs>
      <g class="l10-lift-axes" aria-hidden="true">
        <line x1="54" y1="357" x2="490" y2="357" marker-end="url(#l10-axis-arrow)"/>
        <line x1="66" y1="365" x2="66" y2="52" marker-end="url(#l10-axis-arrow)"/>
        <text x="388" y="380">column space</text><text x="76" y="61">cost z</text>
      </g>
      <g class="l10-hull-shape">
        ${liftedPolygon(["F", "B", "C", "E"], "l10-hull-face l10-hull-face-back")}
        ${liftedPolygon(["F", "C", "D"], "l10-hull-face l10-hull-face-mid")}
        ${liftedPolygon(["F", "D", "E"], "l10-hull-face l10-hull-face-low")}
        ${liftedLine("F", "B", "l10-hull-edge")}${liftedLine("B", "C", "l10-hull-edge")}
        ${liftedLine("C", "E", "l10-hull-edge")}${liftedLine("E", "F", "l10-hull-edge")}
        ${liftedLine("F", "C", "l10-hull-edge")}${liftedLine("C", "D", "l10-hull-edge")}
        ${liftedLine("D", "E", "l10-hull-edge")}
        ${["B", "C", "D", "E", "F"].map((name) => liftedPoint(name)).join("")}
      </g>
      <g data-reveal="requirement" class="l10-requirement-line">
        <line x1="${requirementBottom[0].toFixed(2)}" y1="${requirementBottom[1].toFixed(2)}" x2="${requirementTop[0].toFixed(2)}" y2="${requirementTop[1].toFixed(2)}"/>
        ${liftedPoint("b", { className: "l10-base-point", dx: -19, dy: 20 })}
        <text x="${(requirementTop[0] + 10).toFixed(2)}" y="${(requirementTop[1] + 4).toFixed(2)}">requirement line</text>
      </g>
      <g data-reveal="intersections" class="l10-intersections">
        ${liftedPoint("H", { className: "l10-point-h", dx: 10, dy: 17 })}
        ${liftedPoint("G", { className: "l10-point-g", dx: -20, dy: -9 })}
      </g>
    </svg>`;
}

function pivotGeometrySvg() {
  const requirementTop = projectLifted([2.3, 1.0, 4.4]);
  const requirementBottom = projectLifted(LIFTED_POINTS.b);
  const [gapX, gapY] = projectLifted([2.2, 1.1, 1.13]);
  return `
    <svg class="l10-lifted-svg l10-pivot-svg" viewBox="0 0 520 390" role="img" aria-labelledby="l10-pivot-title l10-pivot-desc" data-l10-pivot-geometry>
      <title id="l10-pivot-title">A column-geometry pivot lowers the basic simplex</title>
      <desc id="l10-pivot-desc">The old basic simplex CDF meets the requirement line at H. E lies below its dual plane by negative reduced cost. Pivoting around shared edge DF produces lower simplex DEF and moves the intersection to G.</desc>
      <defs>
        <marker id="l10-pivot-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker>
        <marker id="l10-gap-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker>
      </defs>
      <g class="l10-lift-axes" aria-hidden="true">
        <line x1="54" y1="357" x2="490" y2="357" marker-end="url(#l10-pivot-arrow)"/>
        <line x1="66" y1="365" x2="66" y2="52" marker-end="url(#l10-pivot-arrow)"/>
        <text x="75" y="61">z</text>
      </g>
      <g class="l10-old-simplex" data-l10-old-simplex="CDF">
        ${liftedPolygon(["C", "D", "F"], "l10-old-plane")}
        ${liftedLine("C", "D", "l10-old-edge")}${liftedLine("C", "F", "l10-old-edge")}${liftedLine("D", "F", "l10-old-edge")}
        <text x="155" y="140">old dual plane</text>
        ${["C", "D", "F"].map((name) => liftedPoint(name)).join("")}
      </g>
      <g class="l10-requirement-line">
        <line x1="${requirementBottom[0].toFixed(2)}" y1="${requirementBottom[1].toFixed(2)}" x2="${requirementTop[0].toFixed(2)}" y2="${requirementTop[1].toFixed(2)}"/>
        ${liftedPoint("H", { className: "l10-point-h", dx: 10, dy: 17 })}
      </g>
      <g data-reveal="gap" class="l10-gap-group">
        ${liftedPoint("E", { className: "l10-point-e", dx: 10, dy: 18 })}
        ${liftedPoint("P", { className: "l10-projection-point", dx: 10, dy: -8 })}
        ${liftedLine("E", "P", "l10-reduced-cost-gap")}
        <text x="${(gapX + 16).toFixed(2)}" y="${gapY.toFixed(2)}">vertical distance = −c̄<tspan baseline-shift="sub" font-size="75%">E</tspan></text>
      </g>
      <g data-reveal="pivot" class="l10-new-simplex" data-l10-new-simplex="DEF">
        ${liftedPolygon(["D", "E", "F"], "l10-new-plane")}
        ${liftedLine("D", "E", "l10-new-edge")}${liftedLine("E", "F", "l10-new-edge")}${liftedLine("D", "F", "l10-pivot-axis")}
        <text x="250" y="286">new lower simplex</text>
      </g>
      <g data-reveal="lower" class="l10-lower-intersection">
        ${liftedPoint("G", { className: "l10-point-g", dx: -20, dy: -9 })}
        ${liftedLine("H", "G", "l10-intersection-drop")}
        <text x="360" y="232">H → G</text>
      </g>
    </svg>`;
}

function adjacencySvg({ solution = false } = {}) {
  const vertices = [[0, 0], [3, 0], [3, 1], [2, 2], [0, 2]];
  const project = ([x, y]) => [64 + 100 * x, 304 - 108 * y];
  const points = vertices.map((point) => project(point).join(",")).join(" ");
  const marked = [[0, 0], [3, 0], [3, 1]].map(([x, y]) => {
    const [cx, cy] = project([x, y]);
    return `<g data-l10-adjacency-point="${x},${y}" data-x1="${x}" data-x2="${y}"><circle cx="${cx}" cy="${cy}" r="8"/><text x="${cx + 10}" y="${cy - 10}">(${x},${y})</text></g>`;
  }).join("");
  const [a0x, a0y] = project([0, 0]);
  const [a1x, a1y] = project([3, 0]);
  const [a2x, a2y] = project([3, 1]);
  return `<svg class="l10-adjacency-svg" viewBox="0 0 500 350" role="img" aria-label="Feasible polygon with marked points zero zero, three zero, and three one" data-l10-adjacency-plot>
    <g class="l10-mini-grid" aria-hidden="true"><line x1="64" y1="304" x2="464" y2="304"/><line x1="64" y1="196" x2="464" y2="196"/><line x1="64" y1="88" x2="464" y2="88"/><line x1="64" y1="304" x2="64" y2="55"/><line x1="164" y1="304" x2="164" y2="55"/><line x1="264" y1="304" x2="264" y2="55"/><line x1="364" y1="304" x2="364" y2="55"/><line x1="464" y1="304" x2="464" y2="55"/></g>
    <g class="l10-mini-axes" aria-hidden="true"><line x1="52" y1="304" x2="476" y2="304"/><line x1="64" y1="318" x2="64" y2="44"/><text x="463" y="331">x₁</text><text x="40" y="50">x₂</text></g>
    <polygon class="l10-adjacency-region" points="${points}"/>
    ${solution ? `<g class="l10-adjacent-edges" aria-hidden="true"><line x1="${a0x}" y1="${a0y}" x2="${a1x}" y2="${a1y}"/><line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}"/></g>` : ""}
    <g class="l10-marked-points">${marked}</g>
  </svg>`;
}

function edgeIdeaSvg() {
  return `<svg class="l10-edge-svg" viewBox="0 0 560 350" role="img" aria-label="A simplex path taking one improving edge from a corner of a polygon">
    <defs><marker id="l10-edge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z"/></marker></defs>
    <polygon points="70,290 360,290 460,190 340,65 145,105"/>
    <g class="l10-edge-vertices"><circle cx="70" cy="290" r="8"/><circle cx="360" cy="290" r="8"/><circle cx="460" cy="190" r="8"/><circle cx="340" cy="65" r="8"/><circle cx="145" cy="105" r="8"/></g>
    <line class="l10-improving-edge" x1="82" y1="290" x2="335" y2="290" marker-end="url(#l10-edge-arrow)"/>
    <line class="l10-objective-arrow" x1="265" y1="190" x2="350" y2="120" marker-end="url(#l10-edge-arrow)"/>
    <text x="350" y="111">−c</text><text x="154" y="321">improving incident edge</text>
  </svg>`;
}

export const slides = [
  {
    id: "l10-01", page: 1, kind: "title", className: "l10-title",
    eyebrow: "ISE 5405 · Optimization I",
    title: "Simplex II: Directions, Reduced Costs, and Column Geometry",
    html: String.raw`
      <div class="l10-title-grid">
        <div>
          <p class="l10-title-kicker">Lecture 6</p>
          <p class="l10-lede">Directions, Reduced Costs, and Column Geometry</p>
          <p class="l10-muted">Bertsimas–Tsitsiklis §§3.1–3.2 and §3.6 · September 15, 2026</p>
          <div class="ns-title-shortcuts" aria-label="Presentation keyboard shortcuts">
            <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span><span><kbd>←</kbd> back</span><span><kbd>F</kbd> fullscreen</span>
            <span><kbd>M</kbd> menu</span><span><kbd>P</kbd> pen</span><span><kbd>E</kbd> eraser</span><span><kbd>W</kbd> whiteboard</span>
            <span><kbd>H</kbd> handout</span><span><kbd>K</kbd> checkpoint</span><span><kbd>?</kbd> help</span>
          </div>
          <p class="ns-title-handout"><strong>Saving an annotated PDF:</strong> press <kbd>H</kbd>, then print and choose “Save as PDF.” Final reveal states and saved slide ink are included.</p>
        </div>
        <svg class="l10-title-art" viewBox="0 0 520 350" role="img" aria-label="A sequence from basis to direction to reduced cost to pivot">
          <defs><marker id="l10-title-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z"/></marker></defs>
          <g class="l10-title-nodes"><rect x="35" y="126" width="105" height="92" rx="12"/><rect x="157" y="126" width="105" height="92" rx="12"/><rect x="279" y="126" width="105" height="92" rx="12"/><rect x="401" y="126" width="84" height="92" rx="12"/></g>
          <g class="l10-title-arrows"><line x1="141" y1="172" x2="153" y2="172" marker-end="url(#l10-title-arrow)"/><line x1="263" y1="172" x2="275" y2="172" marker-end="url(#l10-title-arrow)"/><line x1="385" y1="172" x2="397" y2="172" marker-end="url(#l10-title-arrow)"/></g>
          <g class="l10-title-labels"><text x="87" y="160">basis</text><text x="87" y="188">B</text><text x="209" y="158">direction</text><text x="209" y="190">u</text><text x="331" y="158">price</text><text x="331" y="190">c̄ⱼ</text><text x="443" y="158">pivot</text><text x="443" y="190">↘</text></g>
          <polyline points="42,274 165,284 288,240 410,92 478,72" fill="none"/>
          <g class="l10-title-path-points"><circle cx="42" cy="274" r="9"/><circle cx="165" cy="284" r="9"/><circle cx="288" cy="240" r="9"/><circle cx="410" cy="92" r="9"/><circle cx="478" cy="72" r="9"/></g>
        </svg>
      </div>`,
  },
  {
    id: "l10-02", page: 2, title: "What You Should Be Able to Do",
    html: String.raw`
      <ol class="l10-outcomes">
        <li><strong>Distinguish</strong> adjacency of points from adjacency of bases.</li>
        <li><strong>Construct</strong> a basic direction from a nonbasic column.</li>
        <li><strong>Decide</strong> whether that direction permits a positive feasible step.</li>
        <li><strong>Derive and interpret</strong> a reduced cost.</li>
        <li><strong>Test</strong> whether a feasible basis is optimal and read the column geometry.</li>
      </ol>
      <aside class="l10-callout" data-tone="orange" data-reveal><strong>One continuous story:</strong> choose a column, price its direction, find the available step, then pivot—or certify optimality.</aside>`,
  },
  {
    id: "l10-03", page: 3, title: "Retrieval: What Does a Basis Give Us?",
    html: String.raw`
      <p>For \(P=\{x\in\mathbb R^n:Ax=b,\ x\ge0\}\), with \(\operatorname{rank}(A)=m\), a basis contains \(m\) independent columns:</p>
      <div class="l10-equation">\[x_B=A_B^{-1}b,\qquad x_N=0.\]</div>
      <div class="l10-two-checks">
        <section data-reveal="feasible"><h3>1 · Feasibility</h3><p>Is \(x_B\ge0\)?</p></section>
        <section data-reveal="improve"><h3>2 · Improvement</h3><p>Can an adjacent basis lower \(c^\top x\)?</p></section>
      </div>`,
  },
  {
    id: "l10-04", page: 4, className: "l10-visual-slide", title: "Edges Suggest an Algorithm",
    html: String.raw`
      <div class="l10-visual-pair"><div class="l10-figure-shell">${edgeIdeaSvg()}</div>
      <div class="l10-side-stack">
        <section class="l10-card"><h3>Start</h3><p>Choose a corner: a basic feasible solution.</p></section>
        <section class="l10-card" data-reveal="move"><h3>Move</h3><p>Find an improving incident edge and go to the next corner.</p></section>
        <aside class="l10-callout" data-tone="orange" data-reveal="algebra"><strong>Algebra must provide both:</strong> the direction and its maximum feasible step.</aside>
      </div></div>`,
  },
  {
    id: "l10-05", page: 5, title: "Adjacent Basic Feasible Solutions",
    html: String.raw`
      <p class="l10-lede-small">Two distinct vertices in \(\mathbb R^n\) are <strong>adjacent</strong> when they share \(n-1\) linearly independent active constraints.</p>
      <div class="l10-flow-row" aria-label="A nondegenerate standard-form pivot">
        <section><strong>one column enters</strong><span>the bases differ by one column</span></section>
        <span aria-hidden="true">→</span>
        <section><strong>one column leaves</strong><span>the ratio test names it</span></section>
        <span aria-hidden="true">→</span>
        <section><strong>one edge is traversed</strong><span>the points are distinct</span></section>
      </div>
      <aside class="l10-callout" data-tone="blue" data-reveal><strong>Qualification:</strong> this clean equivalence uses a nondegenerate standard-form BFS.</aside>`,
  },
  {
    id: "l10-06", page: 6, title: "Adjacent Bases Need Not Mean Distinct Points",
    html: String.raw`
      <p>At a degenerate BFS, at least one basic variable is zero.</p>
      <ul class="l10-spaced-list">
        <li>Several bases can encode the same feasible point.</li>
        <li data-reveal="exchange">Exchanging one column may produce a zero-length step.</li>
        <li data-reveal="distinguish">Adjacent bases and adjacent vertices are not interchangeable without a nondegeneracy qualification.</li>
      </ul>
      <aside class="l10-callout" data-tone="maroon" data-reveal="consequence"><strong>Consequence:</strong> simplex operates on bases; its geometric location need not change at every pivot.</aside>`,
  },
  {
    id: "l10-07", page: 7, className: "l10-visual-slide", title: "Quick Check: Are These Points Adjacent?",
    html: String.raw`
      <p class="l10-compact-model">\(P=\{(x_1,x_2):x_1+x_2\le4,\ x_1\le3,\ x_2\le2,\ x\ge0\}.\)</p>
      <div class="l10-visual-pair l10-adjacency-pair">
        <div class="l10-figure-shell">${adjacencySvg()}</div>
        <ol class="l10-question-list">
          <li>List the active constraints at \((0,0),(3,0),(3,1)\).</li>
          <li>Which pairs share one independent active constraint?</li>
          <li>Which pairs are joined by an edge?</li>
        </ol>
      </div>
      <aside class="l10-callout" data-tone="orange"><strong>Work for two minutes:</strong> use the definition, not only a mental sketch.</aside>`,
  },
  {
    id: "l10-08", page: 8, className: "l10-visual-slide", title: "Quick Check: Solution",
    html: String.raw`
      <div class="l10-visual-pair l10-adjacency-pair">
        <div class="l10-figure-shell">${adjacencySvg({ solution: true })}</div>
        <div>
          <table class="l10-table"><caption>Active constraints at the three marked points</caption><thead><tr><th scope="col">Point</th><th scope="col">Active constraints</th></tr></thead><tbody>
            <tr><th scope="row">\((0,0)\)</th><td>\(x_1=0,\ x_2=0\)</td></tr>
            <tr><th scope="row">\((3,0)\)</th><td>\(x_1=3,\ x_2=0\)</td></tr>
            <tr><th scope="row">\((3,1)\)</th><td>\(x_1=3,\ x_1+x_2=4\)</td></tr>
          </tbody></table>
          <p class="l10-result-line" data-reveal="answer">The orange pairs are adjacent; \((0,0)\) and \((3,1)\) are not.</p>
        </div>
      </div>`,
    checkpoint: checkpointAdjacency,
  },
  {
    id: "l10-09", page: 9, title: "The Standard-Form Setting",
    html: String.raw`
      <div class="l10-equation">\[\min\{c^\top x:Ax=b,\ x\ge0\}.\]</div>
      <p>Partition the columns and variables according to a feasible basis:</p>
      <div class="l10-equation" data-reveal="partition">\[A=[\,A_B\ A_N\,],\qquad x=\begin{bmatrix}x_B\\x_N\end{bmatrix}=\begin{bmatrix}A_B^{-1}b\\0\end{bmatrix}.\]</div>
      <aside class="l10-callout" data-tone="blue" data-reveal="notation">Write \(B=A_B\) when there is no ambiguity.</aside>`,
  },
  {
    id: "l10-10", page: 10, title: "Feasible Directions",
    html: String.raw`
      <section class="l10-definition"><h3>Definition</h3><p>\(d\) is a feasible direction at \(x\in P\) if some \(\epsilon>0\) satisfies \(x+\theta d\in P\) for every \(0\le\theta\le\epsilon\).</p></section>
      <div class="l10-two-checks">
        <section data-reveal="equalities"><h3>Equalities</h3><p>Require \(Ad=0\).</p></section>
        <section data-reveal="signs"><h3>Nonnegativity</h3><p>Require \(x_i+\theta d_i\ge0\).</p></section>
      </div>
      <p class="l10-result-line" data-reveal="both">Both conditions matter.</p>`,
  },
  {
    id: "l10-11", page: 11, className: "l10-proof-slide", title: "Preserving the Equalities",
    html: String.raw`
      <div class="l10-proof-stack">
        <div class="l10-proof-step">\[Ax=b.\]</div>
        <div class="l10-proof-step" data-reveal="move">\[A(x+\theta d)=Ax+\theta Ad=b+\theta Ad.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="condition">\[\boxed{Ad=0}.\]</div>
      </div>
      <aside class="l10-callout" data-tone="blue" data-reveal="null"><strong>Null-space view:</strong> every edge direction in standard form lies in the null space of \(A\).</aside>`,
  },
  {
    id: "l10-12", page: 12, title: "Preserving Nonnegativity Locally",
    html: String.raw`
      <div class="l10-equation">\[x_i+\theta d_i\ge0.\]</div>
      <div class="l10-case-grid">
        <section><h3>When \(x_i>0\)</h3><p>A negative \(d_i\) is allowed for a sufficiently small step.</p></section>
        <section data-reveal="zero"><h3>When \(x_i=0\)</h3><p>A positive step requires \(d_i\ge0\).</p></section>
      </div>
      <aside class="l10-callout" data-tone="maroon" data-reveal="warning"><strong>Degeneracy warning:</strong> \(Ad=0\) alone does not make \(d\) feasible at \(x\). A zero basic component can block the direction immediately.</aside>`,
  },
  {
    id: "l10-13", page: 13, title: "Choose One Nonbasic Variable",
    html: String.raw`
      <p>For a nonbasic index \(j\), prescribe</p>
      <div class="l10-equation">\[d_j=1,\qquad d_k=0\quad(k\in N\setminus\{j\}).\]</div>
      <p data-reveal="compensate">The basic components must compensate:</p>
      <div class="l10-equation" data-reveal="compensate">\[A_Bd_B+A_j=0.\]</div>
      <aside class="l10-callout" data-tone="orange" data-reveal="name">This choice defines the \(j\)-th <strong>basic direction</strong>.</aside>`,
  },
  {
    id: "l10-14", page: 14, className: "l10-proof-slide", title: "Solve for the Basic Components",
    html: String.raw`
      <div class="l10-proof-stack">
        <div class="l10-proof-step">\[Bd_B=-A_j.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="solve">\[\boxed{d_B=-B^{-1}A_j}.\]</div>
        <div class="l10-proof-step" data-reveal="name">\[u:=B^{-1}A_j,\qquad d_B=-u.\]</div>
      </div>
      <aside class="l10-callout" data-tone="green" data-reveal="name"><strong>One basis solve produces the direction.</strong> The inverse notation describes the answer; it is not an instruction to form \(B^{-1}\).</aside>`,
  },
  {
    id: "l10-15", page: 15, className: "l10-proof-slide", title: "Check the Direction Algebra",
    html: String.raw`
      <div class="l10-proof-stack l10-proof-stack-four">
        <div class="l10-proof-step">\[Ad=A_Bd_B+A_jd_j\]</div>
        <div class="l10-proof-step" data-reveal="substitute">\[=B(-B^{-1}A_j)+A_j\]</div>
        <div class="l10-proof-step" data-reveal="cancel">\[=-A_j+A_j\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="cancel">\[=0.\]</div>
      </div>
      <p class="l10-result-line" data-reveal="meaning">Every basic direction preserves the equalities. Feasibility still requires a sign check at zero components.</p>`,
  },
  {
    id: "l10-16", page: 16, className: "l10-proof-slide", title: "Does the Direction Permit a Step?",
    html: String.raw`
      <div class="l10-proof-stack">
        <div class="l10-proof-step">\[x_B(\theta)=x_B-\theta u.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="ratio">\[\boxed{\theta^*=\min_{i:u_i>0}\frac{(x_B)_i}{u_i}}.\]</div>
      </div>
      <div class="l10-case-grid" data-reveal="cases">
        <section><h3>\(\theta^*>0\)</h3><p>A genuine edge step exists.</p></section>
        <section><h3>\(\theta^*=0\)</h3><p>The direction is blocked, though a basis pivot is possible.</p></section>
      </div>`,
    checkpoint: checkpointRatio,
  },
  {
    id: "l10-17", page: 17, title: "Running Example",
    html: String.raw`
      <div class="l10-model" data-l10-running-model data-a1="1,2,2" data-a2="2,1,2" data-a3="2,2,1" data-b="20,20,20">\[\begin{aligned}\min\quad&-10x_1-12x_2-12x_3\\
      \text{s.t.}\quad&x_1+2x_2+2x_3+x_4=20,\\
      &2x_1+x_2+2x_3+x_5=20,\\
      &2x_1+2x_2+x_3+x_6=20,\qquad x\ge0.\end{aligned}\]</div>
      <aside class="l10-callout" data-tone="blue" data-reveal>This one model will connect matrix simplex, tableaus, and revised simplex.</aside>`,
  },
  {
    id: "l10-18", page: 18, title: "Initial Basis and Basic Feasible Solution",
    html: String.raw`
      <div class="l10-equation">\[B_0=[A_4\ A_5\ A_6]=I.\]</div>
      <div class="l10-proof-stack">
        <div class="l10-proof-step" data-reveal="values">\[x_B=(20,20,20)^\top,\qquad x_N=(x_1,x_2,x_3)=0.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="point">\[x^{(0)}=(0,0,0,20,20,20),\qquad c^\top x^{(0)}=0.\]</div>
      </div>
      <aside class="l10-callout" data-tone="green" data-reveal="point">Every basic value is positive, so the starting BFS is nondegenerate.</aside>`,
  },
  {
    id: "l10-19", page: 19, title: "Your Turn: Direction for x₁",
    html: String.raw`
      <p>At the slack basis, let \(x_1\) increase.</p>
      <ol class="l10-question-list l10-question-list-wide">
        <li>Compute \(u=B^{-1}A_1\).</li>
        <li>Form all six components of \(d\).</li>
        <li>Verify \(Ad=0\).</li>
        <li>Identify the variables that decrease.</li>
      </ol>
      <aside class="l10-callout" data-tone="orange"><strong>Work for three minutes:</strong> keep the variable order \((x_1,\ldots,x_6)\).</aside>`,
  },
  {
    id: "l10-20", page: 20, className: "l10-proof-slide", title: "Direction for x₁: Solution",
    html: String.raw`
      <div class="l10-proof-stack" data-l10-direction="1,0,0,-1,-2,-2">
        <div class="l10-proof-step">\[u=A_1=(1,2,2)^\top,\qquad d_B=(-1,-2,-2)^\top.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="direction">\[\boxed{d=(1,0,0,-1,-2,-2)^\top}.\]</div>
        <div class="l10-proof-step" data-reveal="verify">\[Ad=A_1-A_4-2A_5-2A_6=0.\]</div>
      </div>
      <p class="l10-result-line" data-reveal="verify">All three slack variables decrease.</p>`,
  },
  {
    id: "l10-21", page: 21, className: "l10-proof-slide", title: "How Far Along That Edge?",
    html: String.raw`
      <div class="l10-proof-stack" data-l10-step="10" data-l10-tie="x5,x6">
        <div class="l10-proof-step">\[x_B(\theta)=\begin{bmatrix}20\\20\\20\end{bmatrix}-\theta\begin{bmatrix}1\\2\\2\end{bmatrix}.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="ratio">\[\theta^*=\min\left\{\frac{20}{1},\frac{20}{2},\frac{20}{2}\right\}=10.\]</div>
      </div>
      <aside class="l10-callout" data-tone="maroon" data-reveal="tie"><strong>Ratio tie:</strong> both \(x_5\) and \(x_6\) reach zero, so the new point is degenerate.</aside>`,
  },
  {
    id: "l10-22", page: 22, className: "l10-proof-slide", title: "Objective Slope Along a Direction",
    html: String.raw`
      <div class="l10-proof-stack l10-proof-stack-four">
        <div class="l10-proof-step">\[c^\top(x+\theta d)=c^\top x+\theta c^\top d.\]</div>
        <div class="l10-proof-step" data-reveal="basic">\[c^\top d=c_j+c_B^\top d_B\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="substitute">\[=c_j-c_B^\top B^{-1}A_j.\]</div>
      </div>
      <p class="l10-result-line" data-reveal="meaning">The coefficient of \(\theta\) is the objective slope along that basic direction.</p>`,
  },
  {
    id: "l10-23", page: 23, title: "Reduced Cost",
    html: String.raw`
      <section class="l10-definition"><h3>Definition</h3><div class="l10-equation">\[\boxed{\bar c_j=c_j-c_B^\top B^{-1}A_j}.\]</div></section>
      <div class="l10-slope-sign" data-reveal="slope"><span>\(c^\top d=\bar c_j\)</span><span aria-hidden="true">⟹</span><span>\(\bar c_j<0\) gives an improving slope for minimization</span></div>`,
  },
  {
    id: "l10-24", page: 24, title: "Direct Cost Minus Displacement Cost",
    html: String.raw`
      <div class="l10-equation l10-underbrace">\[\bar c_j=\underbrace{c_j}_{\text{direct cost}}-\underbrace{c_B^\top B^{-1}A_j}_{\text{cost of displaced basics}}.\]</div>
      <ul class="l10-spaced-list">
        <li data-reveal="basic">A basic variable has zero reduced cost.</li>
        <li data-reveal="basis">Reduced cost depends on the current basis.</li>
        <li data-reveal="slope">It is a slope; the ratio test separately determines the available step.</li>
      </ul>`,
  },
  {
    id: "l10-25", page: 25, title: "Reduced Costs at the Slack Basis",
    html: String.raw`
      <p>\(c_B=0\) and \(B=I\), so \(\bar c_j=c_j\):</p>
      <table class="l10-table l10-cost-table"><caption>Reduced costs at the slack basis</caption><thead><tr><th scope="col">variable</th><th scope="col">\(x_1\)</th><th scope="col">\(x_2\)</th><th scope="col">\(x_3\)</th><th scope="col">\(x_4\)</th><th scope="col">\(x_5\)</th><th scope="col">\(x_6\)</th></tr></thead><tbody><tr><th scope="row">\(\bar c_j\)</th><td>−10</td><td>−12</td><td>−12</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>
      <aside class="l10-callout" data-tone="green" data-reveal>All three structural variables offer an improving slope.</aside>`,
  },
  {
    id: "l10-26", page: 26, title: "Choose an Entering Variable",
    html: String.raw`
      <p>For this worked path, choose the eligible variable \(x_1\). This is a deliberate pivot choice, not the most-negative-cost rule.</p>
      <ol class="l10-question-list l10-question-list-wide">
        <li>Why is \(x_1\) eligible?</li>
        <li>Which variables would most-negative pricing consider instead?</li>
        <li>Why can two valid pivot rules trace different paths?</li>
      </ol>
      <aside class="l10-callout" data-tone="orange"><strong>Thirty-second check:</strong> separate eligibility from the chosen pivot rule.</aside>`,
  },
  {
    id: "l10-27", page: 27, title: "Entering Choice: Solution",
    html: String.raw`
      <div class="l10-equation">\[\bar c_1=-10,\qquad \bar c_2=-12,\qquad \bar c_3=-12.\]</div>
      <ul class="l10-spaced-list">
        <li data-reveal="eligible">All three structural variables are eligible because their reduced costs are negative.</li>
        <li data-reveal="worked">The worked path selects \(x_1\).</li>
        <li data-reveal="rule">Most-negative pricing would instead choose between \(x_2\) and \(x_3\).</li>
      </ul>`,
  },
  {
    id: "l10-28", page: 28, className: "l10-proof-slide", title: "The First Edge Step",
    html: String.raw`
      <div class="l10-proof-stack l10-proof-stack-four" data-l10-first-point="10,0,0,10,0,0" data-l10-first-value="-100" data-l10-first-basis="A4,A1,A6">
        <div class="l10-proof-step">\[u=(1,2,2)^\top,\qquad \theta^*=10.\]</div>
        <div class="l10-proof-step" data-reveal="basis">\[x_5\text{ leaves},\quad x_1\text{ enters},\quad B_1=[A_4\ A_1\ A_6].\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="point">\[x^{(1)}=(10,0,0,10,0,0),\qquad c^\top x^{(1)}=-100.\]</div>
      </div>`,
  },
  {
    id: "l10-29", page: 29, title: "One Edge, Two Newly Active Constraints",
    html: String.raw`
      <div class="l10-equation">\[x^{(1)}=x^{(0)}+10(1,0,0,-1,-2,-2).\]</div>
      <div class="l10-pivot-events">
        <section data-reveal="x5"><strong>\(x_5\to0\)</strong><span>leaves the basis</span></section>
        <section data-reveal="x6"><strong>\(x_6\to0\)</strong><span>stays basic after the tied ratio</span></section>
        <section data-reveal="degenerate"><strong>two active rows</strong><span>the arrival is degenerate</span></section>
      </div>`,
  },
  {
    id: "l10-30", page: 30, title: "The New Basis Inverse",
    html: String.raw`
      <p>For \(B_1=[A_4\ A_1\ A_6]\),</p>
      <div class="l10-matrix-pair">
        <section><h3>Inverse</h3><div>\[B_1^{-1}=\begin{bmatrix}1&-\tfrac12&0\\0&\tfrac12&0\\0&-1&1\end{bmatrix}.\]</div></section>
        <section data-reveal="values"><h3>Basic values</h3><div>\[B_1^{-1}b=\begin{bmatrix}10\\10\\0\end{bmatrix}.\]</div></section>
      </div>
      <aside class="l10-callout" data-tone="maroon" data-reveal="values">The zero basic component records degeneracy algebraically.</aside>`,
  },
  {
    id: "l10-31", page: 31, className: "l10-proof-slide", title: "Reduced Costs at the New Basis",
    html: String.raw`
      <div class="l10-proof-stack" data-l10-new-costs="0,-7,-2,0,5,0">
        <div class="l10-proof-step">\[c_B=(0,-10,0)^\top.\]</div>
        <div class="l10-proof-step" data-reveal="price">\[c_B^\top B_1^{-1}=(0,-5,0).\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="costs">\[\bar c=(0,-7,-2,0,5,0).\]</div>
      </div>
      <aside class="l10-callout" data-tone="orange" data-reveal="costs">Both nonbasic \(x_2\) and \(x_3\) have negative reduced cost.</aside>`,
  },
  {
    id: "l10-32", page: 32, title: "Two Improving Slopes at a Degenerate BFS",
    html: String.raw`
      <div class="l10-direction-compare" data-l10-x2-u="1.5,0.5,1" data-l10-x2-step="0" data-l10-x3-u="1,1,-1" data-l10-x3-step="10">
        <section><h3>Try \(x_2\)</h3><div>\[B_1^{-1}A_2=\begin{bmatrix}\tfrac32\\\tfrac12\\1\end{bmatrix},\qquad \bar c_2=-7.\]</div><p>The zero basic \(x_6\) blocks the direction at step zero.</p></section>
        <section data-reveal="x3"><h3>Try \(x_3\)</h3><div>\[B_1^{-1}A_3=\begin{bmatrix}1\\1\\-1\end{bmatrix},\qquad \bar c_3=-2.\]</div><p>No zero row has a positive component of \(u\).</p></section>
      </div>`,
  },
  {
    id: "l10-33", page: 33, title: "The Pivot Choice Can Move or Stall",
    html: String.raw`
      <div class="l10-ratio-compare">
        <section><h3>Enter \(x_2\): stall</h3><div>\[\theta^*(x_2)=\min\left\{\frac{10}{3/2},\frac{10}{1/2},\frac01\right\}=0.\]</div><p>A degenerate basis change occurs at the same point.</p></section>
        <section data-reveal="move"><h3>Enter \(x_3\): move</h3><div>\[\theta^*(x_3)=\min\left\{\frac{10}{1},\frac{10}{1}\right\}=10.\]</div><p>Let \(x_4\) leave and move to \((x_1,x_2,x_3)=(0,0,10)\).</p></section>
      </div>
      <aside class="l10-callout" data-tone="blue" data-reveal="meaning">Both entering choices have improving slopes; the basis path records more than the visible edge path.</aside>`,
  },
  {
    id: "l10-34", page: 34, title: "What a Negative Reduced Cost Really Says",
    html: String.raw`
      <p class="l10-lede-small">For minimization, \(\bar c_j<0\) says the objective decreases along the \(j\)-th basic direction <em>if a positive feasible step is available</em>.</p>
      <p>It does <strong>not</strong> guarantee:</p>
      <ul class="l10-spaced-list">
        <li data-reveal="step">a positive step at a degenerate BFS;</li>
        <li data-reveal="amount">the largest total improvement; or</li>
        <li data-reveal="point">that the pivot reaches a distinct point.</li>
      </ul>`,
    checkpoint: checkpointReducedCost,
  },
  {
    id: "l10-35", page: 35, className: "l10-column-slide", title: "Column Geometry: Lift Every Column by Its Cost",
    html: String.raw`
      <p class="l10-column-intro">For the bounded form with \(\mathbf1^\top x=1\), lift each column to \(q_j=(A_j,c_j)\): \((b,z)=\sum_jx_jq_j\), with \(x\ge0\) and \(\sum_jx_j=1\).</p>
      <div class="l10-column-layout">
        <div class="l10-figure-shell">${columnHullSvg()}</div>
        <div class="l10-side-stack">
          <section class="l10-card"><h3>Convex hull</h3><p>All feasible lifted combinations lie in \(\operatorname{conv}\{q_1,\ldots,q_n\}\).</p></section>
          <section class="l10-card" data-reveal="requirement"><h3>Requirement line</h3><p>Fixing \(Ax=b\) leaves a vertical line through \(b\); height is objective value.</p></section>
          <aside class="l10-callout" data-tone="green" data-reveal="intersections"><strong>Optimization:</strong> no intersection means infeasible; the lowest intersection \(G\) is optimal.</aside>
        </div>
      </div>`,
  },
  {
    id: "l10-36", page: 36, className: "l10-column-slide", title: "A Pivot Tilts the Basic Simplex Downward",
    html: String.raw`
      <div class="l10-column-layout l10-pivot-layout">
        <div class="l10-figure-shell">${pivotGeometrySvg()}</div>
        <div class="l10-side-stack">
          <section class="l10-card"><h3>Current basis</h3><p>The gray basic simplex \(CDF\) lies in its dual plane and meets the requirement line at \(H\).</p></section>
          <section class="l10-card" data-reveal="gap"><h3>Price \(E\)</h3><p>\(E\) lies below that plane exactly when \(\bar c_E<0\); the signed vertical gap is \(-\bar c_E\).</p></section>
          <section class="l10-card" data-reveal="pivot"><h3>Pivot</h3><p>Let \(E\) enter and \(C\) leave, rotating around the shared face \(DF\).</p></section>
          <aside class="l10-callout" data-tone="orange" data-reveal="lower">The new simplex \(DEF\) meets the requirement line lower: \(H\to G\).</aside>
        </div>
      </div>`,
  },
  {
    id: "l10-37", page: 37, className: "l10-proof-slide", title: "Why Nonnegative Reduced Costs Prove Optimality",
    html: String.raw`
      <div class="l10-proof-stack l10-proof-stack-four">
        <div class="l10-proof-step">\[Ax=b\quad\Longrightarrow\quad Bx_B+A_Nx_N=b.\]</div>
        <div class="l10-proof-step" data-reveal="solve">\[x_B=B^{-1}b-B^{-1}A_Nx_N.\]</div>
        <div class="l10-proof-step" data-reveal="cost">\[c^\top x=c_B^\top B^{-1}b+\bar c_N^\top x_N.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="conclude">\[\bar c_N\ge0,\ x_N\ge0\quad\Longrightarrow\quad c^\top x\ge c_B^\top B^{-1}b.\]</div>
      </div>
      <aside class="l10-callout" data-tone="green" data-reveal="conclude">No feasible solution has value below the current basic value.</aside>`,
  },
  {
    id: "l10-38", page: 38, title: "The Two Checks for an Optimal Basis",
    html: String.raw`
      <div class="l10-optimality-checks">
        <section><h3>Primal feasibility</h3><div>\[\boxed{B^{-1}b\ge0}\]</div><p>The current basic point is feasible.</p></section>
        <section data-reveal="costs"><h3>No improving slope</h3><div>\[\boxed{\bar c_N=c_N-A_N^\top B^{-\top}c_B\ge0}\]</div><p>Every nonbasic displacement has nonnegative price.</p></section>
      </div>`,
    checkpoint: checkpointOptimalBasis,
  },
  {
    id: "l10-39", page: 39, title: "The Converse Needs Care",
    html: String.raw`
      <ul class="l10-spaced-list l10-converse-list">
        <li>A feasible basis with nonnegative reduced costs is optimal.</li>
        <li data-reveal="nondegenerate">At a nondegenerate optimal BFS, a negative reduced cost would provide a positive improving step.</li>
        <li data-reveal="degenerate">At a degenerate optimum, one basis can have a negative reduced cost whose direction is blocked at step zero.</li>
        <li data-reveal="other">The same point can possess another basis with nonnegative reduced costs.</li>
      </ul>`,
  },
  {
    id: "l10-40", page: 40, title: "Final Check: A Candidate Optimal Basis",
    html: String.raw`
      <div class="l10-equation">\[B_*=[A_2\ A_3\ A_1],\qquad x_{B_*}=(4,4,4)^\top,\]</div>
      <div class="l10-equation">\[c_{B_*}^\top B_*^{-1}=\left(-\tfrac{18}{5},-\tfrac85,-\tfrac85\right).\]</div>
      <ol class="l10-question-list l10-question-list-wide">
        <li>Verify feasibility.</li><li>Compute reduced costs of \(x_4,x_5,x_6\).</li><li>State the solution and value.</li>
      </ol>`,
  },
  {
    id: "l10-41", page: 41, className: "l10-proof-slide", title: "Candidate Basis: Solution",
    html: String.raw`
      <div class="l10-proof-stack l10-proof-stack-four" data-l10-optimum="4,4,4,0,0,0" data-l10-optimum-value="-136" data-l10-slack-costs="18/5,8/5,8/5">
        <div class="l10-proof-step">\[(x_2,x_3,x_1)=(4,4,4)\quad\Longrightarrow\quad x^*=(4,4,4,0,0,0).\]</div>
        <div class="l10-proof-step" data-reveal="value">\[c^\top x^*=-136.\]</div>
        <div class="l10-proof-step" data-reveal="costs">\[\bar c_4=\tfrac{18}{5},\qquad\bar c_5=\tfrac85,\qquad\bar c_6=\tfrac85.\]</div>
        <div class="l10-proof-step l10-proof-result" data-reveal="finish">\[B_*^{-1}b\ge0,\quad \bar c_N\ge0\quad\Longrightarrow\quad B_*\text{ is optimal}.\]</div>
      </div>`,
  },
  {
    id: "l10-42", page: 42, title: "What We Built Today",
    html: String.raw`
      <ol class="l10-summary-list">
        <li><span>1</span><p>\(u=B^{-1}A_j\) and \(d_B=-u\) define a basic direction.</p></li>
        <li><span>2</span><p>The ratio test decides whether a positive step is possible.</p></li>
        <li><span>3</span><p>\(\bar c_j=c_j-c_B^\top B^{-1}A_j\) is its objective slope.</p></li>
        <li><span>4</span><p>Feasible basic values and nonnegative reduced costs certify optimality.</p></li>
        <li><span>5</span><p>Degeneracy separates a basis change from a geometric move.</p></li>
      </ol>
      <aside class="l10-callout" data-tone="orange" data-reveal><strong>Next:</strong> turn these ingredients into a complete primal-simplex iteration.</aside>`,
  },
];

export const deck = {
  schemaVersion: 1,
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  metadata,
  styles: new URL("./lecture-10.css", import.meta.url).href,
  slides,
};

export default deck;
