/**
 * Lecture 02 native-slide content.
 *
 * Runtime API assumptions (kept intentionally small):
 * - Import the default `deck`; it carries `metadata`, `slides`, and inline
 *   `styles`. Inject `deck.styles` once.
 * - Render `slide.html` as trusted, repository-authored markup inside a
 *   `.native-slide` element. Set `data-deck-id` on the deck root.
 * - The runtime owns navigation, fullscreen, speaker controls, fragments,
 *   printing, and MathJax/KaTeX enhancement when available.
 * - Elements carrying `data-reveal` are revealed in DOM order. Their full
 *   text remains in the DOM for accessibility and print.
 * - Call `slide.onMount({slideElement, announce, ...})` after rendering. Its
 *   returned function removes local listeners before leaving the slide.
 * - Checkpoints use the same deterministic schema as `course.json`; the
 *   runtime may display them inline or in its standard checkpoint dialog.
 *
 * The content remains readable without JavaScript. Native controls enhance
 * selected pages; `<details>` supplies a no-script disclosure fallback.
 */

const matrix = (rows) => String.raw`\begin{bmatrix}
  ${rows.map((row) => row.join(" & ")).join(String.raw` \\ `)}
\end{bmatrix}`;

const math = (content, label = "") => String.raw`<span class="l2-math" role="math"${label ? ` aria-label="${label}"` : ""}>\(${content}\)</span>`;

const equation = (content, label = "") => String.raw`
  <div class="l2-equation" role="math"${label ? ` aria-label="${label}"` : ""}>\[${content}\]</div>`;

const model = (direction, objective, constraints, label = "") => String.raw`
  <div class="l2-model" role="math"${label ? ` aria-label="${label}"` : ""}>
    \[
    \begin{aligned}
      \text{${direction}}\quad & ${objective} \\
      \text{subject to}\quad & ${constraints.join(String.raw` \\ & `)}
    \end{aligned}
    \]
  </div>`;

const checkpoint11 = {
  prompt: "True or false: a feasible solution must minimize the objective function.",
  choices: [
    "True",
    "False — feasible only means it satisfies the constraints",
  ],
  correctIndex: 1,
  explanation:
    "Feasible just means all constraints hold. Optimal is stronger: feasible, with no feasible point having a better cost.",
  autoOpen: true,
};

const checkpoint23 = {
  prompt:
    String.raw`Why use \(x_j\) = nurses starting their week on day \(j\), instead of \(y_j\) = nurses working on day \(j\)?`,
  choices: [
    "It gives fewer variables",
    String.raw`The five-consecutive-days rule cannot be captured with \(y_j\) alone`,
    String.raw`\(y_j\) would have to be fractional`,
    "The objective would become nonlinear",
  ],
  correctIndex: 1,
  explanation:
    "Start-day variables build the five-consecutive-days rule into the model. Variable choice is a modeling decision.",
  autoOpen: true,
};

const checkpoint29 = {
  prompt: String.raw`An equality constraint \(a^{\mathsf T}x=b\) can be replaced by…`,
  choices: [
    String.raw`One \(\ge\) constraint`,
    "Two opposing inequality constraints",
    "A single slack variable",
    "Nothing — equalities cannot be converted",
  ],
  correctIndex: 1,
  explanation:
    String.raw`Equality is exactly the intersection of \(a^{\mathsf T}x \ge b\) and \(a^{\mathsf T}x \le b\).`,
  autoOpen: true,
};

const checkpointPrograms = {
  prompt: "Every mathematical program has three ingredients. Which item is not one of them?",
  choices: [
    "Decision variables",
    "An objective to optimize",
    "Constraints on the decisions",
    "A guarantee that the optimal solution is unique",
  ],
  correctIndex: 3,
  explanation:
    "A mathematical program supplies variables, an objective, and constraints, but it does not promise that an optimum is unique—or even that one exists.",
  autoOpen: true,
};

const checkpointRelaxation = {
  prompt: "Take an integer program and relax its integrality requirement. The resulting LP optimum is…",
  choices: [
    "Always equal to the integer-program optimum",
    "At least as good—an optimistic bound",
    "Always strictly worse",
    "Unrelated to the integer-program value",
  ],
  correctIndex: 1,
  explanation:
    "Dropping constraints enlarges the feasible set, so the relaxation can only improve the objective. It may improve strictly when its optimizer is fractional.",
  autoOpen: true,
};

const checkpointAxioms = {
  prompt: "A model contains x = number of delivery trucks to purchase. Which LP axiom is at risk?",
  choices: ["Proportionality", "Additivity", "Divisibility", "Certainty"],
  correctIndex: 2,
  explanation:
    "Whole trucks are inherently discrete. That breaks divisibility and turns the model into an integer program.",
  autoOpen: true,
};

const checkpointProduction = {
  prompt: "In the production-planning LP, which item is a decision variable?",
  choices: [
    "The 200 labor hours available",
    "The number of units of product A to make",
    "The $40 profit per unit of A",
    "The number of constraints",
  ],
  correctIndex: 1,
  explanation:
    "Capacities and unit profits are fixed data. The product quantities are the choices made by the model.",
  autoOpen: true,
};

const checkpointFlavors = {
  prompt: "A city must buy whole delivery trucks to serve routes at minimum cost. Which optimization flavor is it?",
  choices: [
    "A linear program",
    "A mixed-integer program",
    "A nonlinear program",
    "Not an optimization problem",
  ],
  correctIndex: 1,
  explanation:
    "Whole trucks are discrete. Dropping that requirement gives the LP relaxation shown in the middle panel.",
  autoOpen: true,
};

export const styles = new URL("./lecture-02.css", import.meta.url).href;

/*
 * The first native edition of this route contained the 41-page lecture that
 * preceded Robert's 2026 recut.  Keep those authored objects locally as
 * building blocks while the public export below follows the updated 66-page
 * Lecture 1 exactly.  Reusing an object here never changes its stable public
 * id: `adapt()` assigns the new l2-01 … l2-66 sequence explicitly.
 */
const legacySlides = [
  {
    id: "l2-01",
    page: 1,
    title: "Introduction to Linear Optimization",
    eyebrow: "ISE 5405 · Lecture 2",
    className: "native-title-slide",
    html: `
      <section class="l2-stack" aria-labelledby="l2-title">
        <p class="eyebrow">Optimization I · Fall 2026</p>
        <h2 id="l2-title" class="l2-title-word">Introduction to Linear Optimization</h2>
        <p class="native-lede">From decision stories to vectors, constraints, geometry, and canonical forms.</p>
        <p>Dr. Jiaxiang “Jason” Li · August 27, 2026</p>
        <p class="l2-muted">Bertsimas–Tsitsiklis, §§1.1–1.4</p>
      </section>`,
    notes: "Frame the lecture as a modeling language first and an algorithmic form second.",
  },
  {
    id: "l2-02",
    page: 2,
    title: "Outline",
    html: `
      <ol class="l2-cards" aria-label="Lecture route">
        <li class="l2-card"><h3>Setup · §1.1</h3><p>Vectors, matrices, LPs, feasibility, optimality.</p></li>
        <li class="l2-card"><h3>Model · §1.2</h3><p>Production, diet, power, and scheduling.</p></li>
        <li class="l2-card"><h3>See · §1.4</h3><p>Halfspaces, level lines, corners, outcomes.</p></li>
        <li class="l2-card"><h3>Transform · §1.1</h3><p>General form, standard form, equivalence.</p></li>
        <li class="l2-card"><h3>Recognize · §1.3</h3><p>Absolute values and piecewise-linear objectives.</p></li>
      </ol>
      <aside class="l2-callout"><h3>Order matters</h3><p>We build models worth solving before converting them for algorithms.</p></aside>`,
  },
  {
    id: "l2-03",
    page: 3,
    title: "Notation — Matrices",
    html: `
      <div class="l2-grid">
        <div class="l2-stack">
          <p>An <strong>${math(String.raw`m \times n`, "m by n")} matrix</strong> has ${math("m")} rows and ${math("n")} columns.</p>
          ${equation(String.raw`A = ${matrix([["a_{11}", "a_{12}", String.raw`\cdots`, "a_{1n}"], ["a_{21}", "a_{22}", String.raw`\cdots`, "a_{2n}"], [String.raw`\vdots`, String.raw`\vdots`, String.raw`\ddots`, String.raw`\vdots`], ["a_{m1}", "a_{m2}", String.raw`\cdots`, "a_{mn}"]])}`, "A is an m by n matrix")}
          <aside class="l2-callout"><h3>Course convention</h3><p>${math("a_{ij}", "a sub i j")} means row ${math("i")}, column ${math("j")}. Rows will represent constraints; columns will represent variables.</p></aside>
        </div>
        <div class="l2-card">
          <h3>Read a coordinate</h3>
          ${equation(String.raw`A = ${matrix([[3, -1, 0, 2], [1, 4, -2, 0], [0, 5, 1, -3]])}`, "A is a three by four example matrix")}
          <p data-reveal>${math("a_{23} = -2", "a sub 2 3 equals negative 2")}: second row, third column.</p>
          <p data-reveal>${math("a_{32} = 5", "a sub 3 2 equals 5")}: third row, second column.</p>
        </div>
      </div>`,
    fragments: ["Read a₂₃", "Read a₃₂"],
  },
  {
    id: "l2-04",
    page: 4,
    title: "The Transpose: Rows Become Columns",
    html: String.raw`
      <div class="l2-text-visual">
        <svg class="l2-figure" viewBox="0 0 600 250" role="img" aria-label="A two-by-three matrix A beside its transpose. The maroon first row becomes the maroon first column, and the blue second row becomes the blue second column.">
          <text x="30" y="40" font-size="20" font-family="Georgia" font-style="italic">A =</text>
          <g font-size="19" text-anchor="middle" font-family="monospace">
            <rect x="80" y="60" width="150" height="44" rx="7" fill="#f4dee6" stroke="#861f41" stroke-width="2"/>
            <text x="105" y="89">3</text><text x="155" y="89">1</text><text x="205" y="89">4</text>
            <rect x="80" y="112" width="150" height="44" rx="7" fill="#dfe9f1" stroke="#33658a" stroke-width="2"/>
            <text x="105" y="141">2</text><text x="155" y="141">0</text><text x="205" y="141">5</text>
          </g>
          <text x="110" y="188" font-size="14" fill="#861f41">row 1</text><text x="176" y="188" font-size="14" fill="#33658a">row 2</text>
          <g data-reveal>
            <path d="M265 110h55" stroke="#5a4634" stroke-width="2.5"/><path d="M320 110l-9-5v10z" fill="#5a4634"/>
            <text x="262" y="95" font-size="14" fill="#5a4634">transpose</text><text x="345" y="40" font-size="20" font-family="Georgia" font-style="italic">A′ =</text>
          </g>
          <g data-reveal font-size="19" text-anchor="middle" font-family="monospace">
            <rect x="405" y="55" width="52" height="140" rx="7" fill="#f4dee6" stroke="#861f41" stroke-width="2"/>
            <text x="431" y="87">3</text><text x="431" y="133">1</text><text x="431" y="179">4</text>
            <text x="405" y="225" font-size="14" font-family="sans-serif" text-anchor="start" fill="#861f41">column 1</text>
          </g>
          <g data-reveal font-size="19" text-anchor="middle" font-family="monospace">
            <rect x="465" y="55" width="52" height="140" rx="7" fill="#dfe9f1" stroke="#33658a" stroke-width="2"/>
            <text x="491" y="87">2</text><text x="491" y="133">0</text><text x="491" y="179">5</text>
            <text x="465" y="240" font-size="14" font-family="sans-serif" text-anchor="start" fill="#33658a">column 2</text>
          </g>
        </svg>
        <div class="l2-stack l2-small">
          <div class="l2-box"><strong>BT convention:</strong> Bertsimas–Tsitsiklis writes \(A'\); elsewhere you will see \(A^{\mathsf T}\). They mean the same transpose.</div>
          <ul><li data-reveal>Rows become columns, and \((A')'=A\).</li><li data-reveal>Dimensions flip: \(m\times n\to n\times m\). Here, \(2\times3\to3\times2\).</li><li data-reveal>A column vector \(x\) is \(n\times1\); its transpose \(x'\) is a \(1\times n\) row vector.</li></ul>
          <div class="l2-box l2-orange" data-reveal>Why care? \(c'x\) and \(a_i'x\) are <strong>row times column</strong>—and therefore one number.</div>
        </div>
      </div>`,
    fragments: ["Show the transpose operation", "Track row 1 into column 1", "Track row 2 into column 2", "Dimensions and row-vector convention"],
  },
  {
    id: "l2-05",
    page: 5,
    title: "Vectors: Columns of Numbers = Points = Arrows",
    html: String.raw`
      <div class="l2-grid">
        <div class="l2-stack">
          <div class="l2-equation">\[x=\begin{bmatrix}x_1\\x_2\\\vdots\\x_n\end{bmatrix}\in\mathbb R^n,\qquad x'=(x_1,x_2,\ldots,x_n)\]</div>
          <aside class="l2-callout"><h3>Decision-vector convention</h3><p>Vectors are <strong>columns</strong> unless transposed. \(x\in\mathbb R^n\) collects <em>all</em> decision variables—one coordinate per decision.</p></aside>
          <aside class="l2-callout l2-orange" data-reveal><h3>Three mental pictures</h3><p>The same \(x=(3,2)'\) is a list of numbers, a <strong>point</strong> in the plane, and an <strong>arrow</strong> from the origin. Fluency means switching freely.</p></aside>
        </div>
        <svg class="l2-figure" viewBox="0 0 440 330" role="img" aria-label="Coordinate plane showing x equals three comma two as both a point and an arrow: three across and two up">
          <defs>
            <marker id="l2-axis-arrow-5" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 8 6"><path d="M0 0L8 3L0 6Z" fill="#526168"/></marker>
            <marker id="l2-vector-arrow-5" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 8"><path d="M0 0L10 4L0 8Z" fill="#861f41"/></marker>
          </defs>
          <path d="M55 275H405 M55 275V30" stroke="#526168" stroke-width="2.5" fill="none" marker-end="url(#l2-axis-arrow-5)"/>
          <path d="M55 275L315 105" stroke="#861f41" stroke-width="4" fill="none" marker-end="url(#l2-vector-arrow-5)"/>
          <path d="M315 275V105H55" stroke="#82929a" stroke-width="2" stroke-dasharray="8 7" fill="none"/>
          <circle cx="315" cy="105" r="8" fill="#e87722"/>
          <text x="304" y="87" font-size="23" font-weight="700">x = (3, 2)′</text><text x="394" y="303" font-size="23">x₁</text><text x="28" y="43" font-size="23">x₂</text>
          <text x="170" y="312" font-size="16" fill="#6d6d6d">3 across</text><text x="12" y="205" font-size="16" fill="#6d6d6d">2 up</text>
        </svg>
      </div>`,
  },
  {
    id: "l2-06",
    page: 6,
    title: "The Inner Product xᵀy — the Course Workhorse",
    html: `
      ${equation(String.raw`x^{\mathsf T}y = x_1y_1 + \cdots + x_ny_n = \sum_{i=1}^{n} x_i y_i`, "the inner product is the sum of coordinate products")}
      <div class="l2-grid">
        <div>
          <div class="l2-controls" data-widget="dot-product">
            <label>${math("x_1")} <input type="range" min="-3" max="3" step="1" value="1" data-dot="x1"><output data-value-for="x1">1</output></label>
            <label>${math("x_2")} <input type="range" min="-3" max="3" step="1" value="3" data-dot="x2"><output data-value-for="x2">3</output></label>
            <label>${math("y_1")} <input type="range" min="-3" max="3" step="1" value="2" data-dot="y1"><output data-value-for="y1">2</output></label>
            <label>${math("y_2")} <input type="range" min="-3" max="3" step="1" value="-1" data-dot="y2"><output data-value-for="y2">−1</output></label>
          </div>
          <p class="l2-answer" aria-live="polite"><span data-dot-expression>1(2) + 3(−1)</span> = <output data-dot-result>−1</output></p>
        </div>
        <aside class="l2-callout"><h3>Every linear expression is one</h3><p>Objective: ${math(String.raw`c^{\mathsf T}x`)}</p><p>Constraint row: ${math(String.raw`a_i^{\mathsf T}x \ge b_i`)}</p><p>Sign gives directional alignment; zero means perpendicular.</p></aside>
      </div>`,
    onMount: ({ slideElement }) => mountDotProduct(slideElement),
  },
  {
    id: "l2-07",
    page: 7,
    title: "One Inequality aᵀx ≥ b = Half the Plane",
    html: `
      <div class="l2-grid">
        <div class="l2-stack">
          <ul>
            <li>${math(String.raw`a^{\mathsf T}x = b`)} is the boundary line.</li>
            <li>${math("a")} is perpendicular to it and points toward increasing ${math(String.raw`a^{\mathsf T}x`)}.</li>
            <li>The inequality retains one side: a <strong>halfspace</strong>.</li>
          </ul>
          <p class="l2-muted">An LP feasible set is an intersection of finitely many halfspaces—hence flat sides and corners.</p>
          <label>Move the requirement b
            <input type="range" min="-2" max="3" step="0.25" value="1" data-halfspace-b>
            <output data-halfspace-value>1.00</output>
          </label>
          <p>At ${math("P=(-1.2,2.2)")}, ${math(String.raw`a^{\mathsf T}P=0.4`)}. <strong data-halfspace-test>P violates b = 1.</strong></p>
        </div>
        <svg class="l2-figure" viewBox="0 0 500 340" role="img" aria-label="A boundary line, its normal vector, and one shaded halfspace">
          <defs><marker id="l2-arrow-7" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 8"><path d="M0 0L10 4L0 8Z" fill="#2878a8"/></marker></defs>
          <path d="M25 300H475 M70 325V25" stroke="#526168" stroke-width="2.5" fill="none"/>
          <g data-halfspace-line>
            <path d="M35 250L465 70L465 20L35 200Z" fill="#dcecf7"/>
            <path d="M35 250L465 70" stroke="#861f41" stroke-width="5"/>
            <text x="310" y="95" font-size="23">aᵀx ≥ b</text>
          </g>
          <path d="M250 170L190 90" stroke="#2878a8" stroke-width="3" marker-end="url(#l2-arrow-7)"/>
          <text x="155" y="72" font-size="24">a</text>
          <circle cx="130" cy="115" r="8" fill="#e87722"/><text x="143" y="110" font-size="21">P</text>
        </svg>
      </div>`,
    onMount: ({ slideElement }) => mountHalfspace(slideElement),
  },
  {
    id: "l2-08",
    page: 8,
    title: "A Linear Programming Problem (Ex. 1.1)",
    html: `
      ${model("minimize", String.raw`2x_1 - x_2 + 4x_3`, [String.raw`x_1 + x_2 + x_4 \le 2`, String.raw`3x_2 - x_3 = 5`, String.raw`x_3 + x_4 \ge 3`, String.raw`x_1 \ge 0,\quad x_3 \le 0`], "Linear program example one point one")}
      <div class="l2-cards">
        <article class="l2-card"><h3>Objective</h3><p>One inner product, ${math(String.raw`c^{\mathsf T}x`)}, with ${math(String.raw`c=(2,-1,4,0)^{\mathsf T}`)}. The variable ${math("x_4")} is invisible here because its cost coefficient is zero.</p></article>
        <article class="l2-card" data-reveal><h3>Functional rows</h3><p>Each row is ${math(String.raw`a_i^{\mathsf T}x\{\le,=,\ge\}b_i`)}. For row 1, ${math(String.raw`a_1=(1,1,0,1)^{\mathsf T}`)} and ${math("b_1=2")}.</p></article>
        <article class="l2-card" data-reveal><h3>Signs and free variables</h3><p>${math("x_1")} is nonnegative; ${math("x_3")} is nonpositive. Since ${math("x_2")} and ${math("x_4")} have no sign bounds, they are <strong>free</strong>.</p></article>
      </div>`,
    fragments: ["Decode a functional row", "Identify the sign constraints and free variables"],
  },
  {
    id: "l2-09",
    page: 9,
    title: "The General LP Problem",
    html: `
      ${model("minimize", String.raw`c^{\mathsf T}x`, [String.raw`a_i^{\mathsf T}x \ge b_i \quad \text{for } i \in M_1`, String.raw`a_i^{\mathsf T}x \le b_i \quad \text{for } i \in M_2`, String.raw`a_i^{\mathsf T}x = b_i \quad \text{for } i \in M_3`, String.raw`x_j \ge 0 \quad \text{for } j \in N_1`, String.raw`x_j \le 0 \quad \text{for } j \in N_2`], "General linear programming problem")}
      <p aria-label="Five ingredient types">
        <span class="l2-chip">${math("M_1")}: lower-bound rows</span>
        <span class="l2-chip">${math("M_2")}: upper-bound rows</span>
        <span class="l2-chip">${math("M_3")}: equalities</span>
        <span class="l2-chip">${math("N_1")}: nonnegative</span>
        <span class="l2-chip">${math("N_2")}: nonpositive</span>
      </p>
      <aside class="l2-callout"><h3>What about every other variable?</h3><p>If ${math(String.raw`j \notin N_1 \cup N_2`)}, then ${math("x_j")} is <strong>free</strong>.</p></aside>`,
  },
  {
    id: "l2-10",
    page: 10,
    title: "From ∑ Notation to Ax",
    html: `
      <div class="l2-grid l2-compact-equations">
        <div>
          ${equation(String.raw`A = ${matrix([[4, 5, 0], [2, 4, 1]])},\quad x = ${matrix([["x_1"], ["x_2"], ["x_3"]])},\quad b = ${matrix([[200], [160]])}`, "Coefficient matrix A, decision vector x, and right hand side b")}
          <p><strong>One row at a time:</strong></p>
          <div data-reveal>${equation(String.raw`a_1^{\mathsf T}x = 4x_1 + 5x_2 + 0x_3`)}</div>
          <div data-reveal>${equation(String.raw`a_2^{\mathsf T}x = 2x_1 + 4x_2 + x_3`)}</div>
        </div>
        <div class="l2-stack" data-reveal>
          <div class="l2-card"><h3>Stack the row results</h3>${equation(String.raw`Ax = ${matrix([["4x_1 + 5x_2"], ["2x_1 + 4x_2 + x_3"]])}`, "matrix vector product")}</div>
          <div class="l2-callout"><h3>Compact, not different</h3><p>${math(String.raw`Ax \ge b`)} means both scalar inequalities hold. Matrix notation packages the system without rotating or compressing its labels.</p></div>
        </div>
      </div>`,
    fragments: ["First row", "Second row", "Stack and interpret"],
  },
  {
    id: "l2-11",
    page: 11,
    title: "Basic Definitions",
    html: `
      <div class="l2-cards">
        <article class="l2-card"><h3>Feasible solution</h3><p>A point satisfying every constraint.</p></article>
        <article class="l2-card"><h3>Feasible set</h3><p>All feasible points. It may be empty.</p></article>
        <article class="l2-card"><h3>Cost</h3><p>The value ${math(String.raw`c^{\mathsf T}x`)} at a feasible point ${math("x")}.</p></article>
        <article class="l2-card"><h3>Optimal solution</h3><p>A feasible ${math("x^*")} with ${math(String.raw`c^{\mathsf T}x^* \le c^{\mathsf T}x`)} for every feasible ${math("x")}; ${math(String.raw`c^{\mathsf T}x^*`)} is the <strong>optimal cost</strong>.</p></article>
      </div>
      <aside class="l2-callout"><h3>Do not confuse them</h3><p><strong>Feasibility</strong> is a pass/fail test. <strong>Optimality</strong> means winning the entire feasible competition.</p></aside>`,
    checkpoint: checkpoint11,
  },
  {
    id: "l2-12",
    page: 12,
    title: "Unboundedness & Maximization",
    html: `
      <div class="l2-grid l2-grid--equal">
        <article class="l2-card">
          <h3>Unbounded minimization</h3>
          <p>For every target ${math("K")}, a feasible ${math("x")} exists with ${math(String.raw`c^{\mathsf T}x \le K`)}.</p>
          ${equation(String.raw`\text{optimal cost} = -\infty`)}
          <svg class="l2-figure" viewBox="0 0 440 190" role="img" aria-label="Objective level lines moving without bound through an unbounded feasible region">
            <path d="M30 160H410V55L100 105Z" fill="#dcecf7" stroke="#2878a8" stroke-width="3"/>
            <g stroke="#e87722" stroke-width="3" stroke-dasharray="8 7"><path d="M130 175L190 20"/><path d="M220 175L280 20"/><path d="M310 175L370 20"/></g>
          </svg>
        </article>
        <article class="l2-card" data-reveal>
          <h3>Max is min after one sign change</h3>
          ${equation(String.raw`\max_{x \in S} c^{\mathsf T}x = -\min_{x \in S}(-c)^{\mathsf T}x`, "max c x equals negative min negative c x")}
          <p>The same point wins both contests. Only the objective vector reverses.</p>
          <aside class="l2-callout"><h3>Course convention</h3><p>We state theory for minimization.</p></aside>
        </article>
      </div>`,
    fragments: ["Max/min equivalence"],
  },
  {
    id: "l2-13",
    page: 13,
    title: "Why min c′x with Ax ≥ b?",
    html: `
      <div class="l2-grid l2-grid--equal">
        <article class="l2-card"><h3>Our convention · following BT</h3>${model("minimize", String.raw`c^{\mathsf T}x`, [String.raw`Ax \ge b`])}<p>Minimize cost while meeting requirements: the cheapest diet that meets nutrient lower bounds, or staffing that covers each shift.</p></article>
        <article class="l2-card" data-reveal><h3>Another common convention</h3>${model("maximize", String.raw`c^{\mathsf T}x`, [String.raw`Ax \le b`])}<p>Maximize profit within resource limits: production and capacity. Sign changes make the two forms mirror images.</p></article>
      </div>
      <aside class="l2-callout l2-orange" data-reveal><h3>The deeper reason</h3><p>Convex optimization minimizes convex functions over convex sets. A linear objective is both <strong>convex and concave</strong>, so LP is its cleanest special case.</p>${equation(String.raw`\underbrace{\min\;c^{\mathsf T}x}_{\text{LP}}\ \subset\ \underbrace{\min\;f(x),\quad f\text{ convex}}_{\text{convex optimization}}`)}</aside>
      <aside class="l2-callout" data-reveal><h3>Payoff · ISE 5406</h3><p>Local = global, optimality conditions, and duality translate directly to nonlinear convex settings. Learn the minimization convention once; reuse it everywhere.</p></aside>`,
    fragments: ["Other convention", "Convex-optimization reason", "ISE 5406 payoff"],
  },
  {
    id: "l2-14",
    page: 14,
    title: "From Words to Math",
    html: `
      <p class="native-lede">Do not begin by writing constraints. Begin by naming the decision.</p>
      <div class="l2-cards">
        <article class="l2-step" data-reveal><strong>1</strong><div><h3>Decisions</h3><p>What quantities can we choose? State symbols and units.</p></div></article>
        <article class="l2-step" data-reveal><strong>2</strong><div><h3>Objective</h3><p>What scalar measure should improve?</p></div></article>
        <article class="l2-step" data-reveal><strong>3</strong><div><h3>Constraints</h3><p>What limits, balances, or requirements must hold?</p></div></article>
        <article class="l2-step" data-reveal><strong>4</strong><div><h3>Audit</h3><p>Do units match on both sides of every row?</p></div></article>
      </div>
      <p><a class="l2-touch-link" href="https://open-optimization.github.io/open-optimization-or-book/visualizations" target="_blank" rel="noopener">Open the guided modeling tutorial <span aria-hidden="true">↗</span></a></p>`,
    fragments: ["Decisions", "Objective", "Constraints", "Audit"],
  },
  {
    id: "l2-15",
    page: 15,
    title: "A Production Problem",
    html: `
      <div class="l2-grid l2-production-layout">
        <div>
          <p>Produce ${math("n")} goods using ${math("m")} limited materials.</p>
          <dl>
            <dt><strong>${math("x_j")}</strong></dt><dd>amount of good ${math("j")} to produce</dd>
            <dt><strong>${math("c_j")}</strong></dt><dd>revenue per unit of good ${math("j")}</dd>
            <dt><strong>${math("a_{ij}")}</strong></dt><dd>material ${math("i")} used per unit of good ${math("j")}</dd>
            <dt><strong>${math("b_i")}</strong></dt><dd>available amount of material ${math("i")}</dd>
          </dl>
        </div>
        ${model("maximize", String.raw`\sum_{j=1}^{n} c_j x_j`, [String.raw`\sum_{j=1}^{n} a_{ij}x_j \le b_i \quad \text{for } i=1,\ldots,m`, String.raw`x_j \ge 0 \quad \text{for } j=1,\ldots,n`], "production planning model")}
      </div>
      <aside class="l2-callout"><h3>Read the matrix</h3><p>One row is a material budget. One column is a product’s resource profile.</p></aside>`,
  },
  {
    id: "l2-16",
    page: 16,
    title: "Modeling Sandbox: Production Planning",
    html: `
      <div class="l2-grid">
        <div class="l2-stack">
          <p><strong>Data:</strong> drag to change the world. A uses 4 labor hours + 2 kg per unit; B uses 5 hours + 4 kg.</p>
          <div class="l2-controls l2-production-controls" data-widget="production">
            <label>Profit A · $<output data-value-for="pa">40</output><input type="range" min="10" max="100" step="5" value="40" data-prod="pa"></label>
            <label>Profit B · $<output data-value-for="pb">55</output><input type="range" min="10" max="100" step="5" value="55" data-prod="pb"></label>
            <label>Labor · <output data-value-for="labor">200</output> h<input type="range" min="100" max="320" step="10" value="200" data-prod="labor"></label>
            <label>Material · <output data-value-for="material">160</output> kg<input type="range" min="80" max="260" step="10" value="160" data-prod="material"></label>
          </div>
          <p class="l2-answer" aria-live="polite" data-prod-result>Optimal plan: make 0 of A and 40 of B; profit = $2,200; binding: material.</p>
        </div>
        <svg class="l2-figure" viewBox="0 0 500 390" role="img" aria-labelledby="l2-prod-title l2-prod-desc">
          <title id="l2-prod-title">Production-planning feasible region and optimal corner</title>
          <desc id="l2-prod-desc">The polygon changes with labor and material capacity. A dashed profit line and a green point mark the optimum reported beside the sliders.</desc>
          <g stroke="#e3e6e7" stroke-width="2"><path d="M128 30V350M219 30V350M310 30V350M401 30V350"/><path d="M60 73H470M60 158H470M60 243H470"/></g>
          <path d="M60 350H475M60 350V25" stroke="#526168" stroke-width="3"/>
          <polygon data-prod-region points="83,329 311,329 83,158" fill="#ead0d9" stroke="#861f41" stroke-width="5"/>
          <path data-prod-objective d="M60 317L470 65" fill="none" stroke="#e87722" stroke-width="4" stroke-dasharray="10 7"/>
          <g data-prod-corners fill="#263238"><circle r="6"/><circle r="6"/><circle r="6"/><circle r="6"/></g>
          <circle data-prod-optimum cx="83" cy="158" r="10" fill="#25834a" stroke="#fff" stroke-width="3"/>
          <text data-prod-optimum-label x="100" y="145" font-size="23" font-weight="750" fill="#176b3a">optimum</text>
          <text x="450" y="380" font-size="22">x<tspan baseline-shift="sub">A</tspan></text><text x="25" y="38" font-size="22">x<tspan baseline-shift="sub">B</tspan></text>
        </svg>
      </div>
      <aside class="l2-callout l2-compact-callout"><h3>Watch the optimum</h3><p>It can jump from one corner to another as prices change; capacities reshape the feasible region.</p></aside>`,
    onMount: ({ slideElement }) => mountProduction(slideElement),
  },
  {
    id: "l2-17",
    page: 17,
    title: "Bakery Production (3 variables)",
    html: `
      <table class="l2-table" aria-label="Bakery resource data">
        <thead><tr><th>Per unit</th><th>Cake</th><th>Cookie</th><th>Muffin</th><th>Available</th></tr></thead>
        <tbody><tr><th>Profit</th><td>$6.00</td><td>$1.50</td><td>$2.50</td><td>—</td></tr><tr><th>Flour (g)</th><td>500</td><td>100</td><td>200</td><td>4,800</td></tr><tr><th>Sugar (g)</th><td>200</td><td>50</td><td>80</td><td>2,060</td></tr><tr><th>Oven (min)</th><td>60</td><td>10</td><td>20</td><td>480</td></tr></tbody>
      </table>
      <details>
        <summary>Build the LP from this table</summary>
        ${model("maximize", String.raw`6x_1 + 1.5x_2 + 2.5x_3`, [String.raw`500x_1 + 100x_2 + 200x_3 \le 4800`, String.raw`200x_1 + 50x_2 + 80x_3 \le 2060`, String.raw`60x_1 + 10x_2 + 20x_3 \le 480`, String.raw`x_1,x_2,x_3 \ge 0`], "bakery production model")}
      </details>
      <p class="l2-muted">The picture leaves the plane at three variables. The modeling recipe does not change—and this bakery returns when we pivot simplex by hand.</p>`,
  },
  {
    id: "l2-18",
    page: 18,
    title: "Practice: the Welding Robots",
    html: `
      <p>A fabrication shop uses transparent aluminum alloy and two leased robots to make bookcases, desks, and cabinets for sale. It has <strong>21 units of transparent aluminum alloy (TAA)</strong>, a joining robot for <strong>23 hours</strong>, and a cutting robot for <strong>17 hours</strong>. Bookcases sell for <strong>$18</strong>, desks for <strong>$16</strong>, and cabinets for <strong>$10</strong>; the table shows the resources needed to make one unit of each product.</p>
      <table class="l2-table" aria-label="Welding robot production data">
        <thead><tr><th>Product</th><th>Revenue</th><th>Alloy</th><th>Join</th><th>Cut</th></tr></thead>
        <tbody><tr><th>Bookcase</th><td>$18</td><td>2</td><td>3</td><td>1</td></tr><tr><th>Desk</th><td>$16</td><td>2</td><td>2</td><td>2</td></tr><tr><th>Cabinet</th><td>$10</td><td>1</td><td>2</td><td>1</td></tr></tbody>
      </table>
      <aside class="l2-callout l2-compact-callout"><h3>Your turn · 2 minutes</h3><p>Name variables. Then write one objective, three resource rows, and domains.</p></aside>
      <details class="l2-practice-solution"><summary>Reveal and audit the formulation</summary>${model("maximize", String.raw`18x_1 + 16x_2 + 10x_3`, [String.raw`2x_1 + 2x_2 + x_3 \le 21`, String.raw`3x_1 + 2x_2 + 2x_3 \le 23`, String.raw`x_1 + 2x_2 + x_3 \le 17`, String.raw`x \ge 0`], "welding robot production model")}</details>`,
  },
  {
    id: "l2-19",
    page: 19,
    title: "Example 1.3 — The Diet Problem",
    html: `
      <div class="l2-grid">
        <dl class="l2-definition-list">
          <dt><strong>${math("x_j")}</strong></dt><dd>amount of ingredient ${math("j")}</dd>
          <dt><strong>${math("c_j")}</strong></dt><dd>cost per unit</dd>
          <dt><strong>${math("A_j")}</strong></dt><dd>nutrient profile of ingredient ${math("j")}</dd>
          <dt><strong>${math("b")}</strong></dt><dd>required nutrient vector</dd>
        </dl>
        ${model("minimize", String.raw`\sum_j c_jx_j`, [String.raw`\sum_j A_jx_j = b`, String.raw`x_j \ge 0`], "diet model")}
      </div>
      <aside class="l2-callout"><h3>Requirement or exact target?</h3><p>If ${math("b")} gives minimum nutrient requirements, use ${math(String.raw`Ax \ge b`)}. Units decide the coefficients; the story decides the inequality direction. This is the classic Stigler diet LP.</p></aside>`,
  },
  {
    id: "l2-20",
    page: 20,
    title: "Multiperiod Planning of Electric Power",
    html: `
      <p class="native-lede">Capacity built today remains available for several future years.</p>
      <div class="l2-cards">
        <article class="l2-card"><h3>Build</h3><p>${math("x_t")} = new coal; ${math("y_t")} = new nuclear in year ${math("t")}.</p></article>
        <article class="l2-card"><h3>Carry</h3><p>${math("w_t")} = available coal; ${math("z_t")} = available nuclear in year ${math("t")}.</p></article>
        <article class="l2-card"><h3>Meet &amp; limit</h3><p>Demand ${math("d_t")}, together with existing oil capacity ${math("e_t")}; nuclear may be at most 20% of total capacity.</p></article>
      </div>
      ${equation(String.raw`\operatorname{minimize}\quad \sum_{t=1}^{T}(c_tx_t + n_ty_t)`, "minimize total coal and nuclear build cost")}
      <svg class="l2-figure" viewBox="0 0 900 130" role="img" aria-label="Timeline showing coal lasting twenty years and nuclear lasting fifteen years">
        <path d="M60 70H840" stroke="#526168" stroke-width="4"/><g fill="#526168" font-size="23"><text x="45" y="110">t</text><text x="805" y="110">future</text></g>
        <path d="M180 48H760" stroke="#861f41" stroke-width="18"/><text x="370" y="35" font-size="22">coal · 20 years</text>
        <path d="M180 86H620" stroke="#2878a8" stroke-width="18"/><text x="335" y="124" font-size="22">nuclear · 15 years</text>
      </svg>`,
  },
  {
    id: "l2-21",
    page: 21,
    title: "Electric Power — Constraints",
    html: `
      <div class="l2-cards">
        <article class="l2-card" data-reveal><h3>Lifetime</h3>${equation(String.raw`\begin{aligned} w_t &= \sum_{s=\max(1,t-19)}^{t}x_s \\ z_t &= \sum_{s=\max(1,t-14)}^{t}y_s \end{aligned}`)}</article>
        <article class="l2-card" data-reveal><h3>Demand</h3>${equation(String.raw`w_t + z_t + e_t \ge d_t`)}</article>
        <article class="l2-card" data-reveal><h3>Policy</h3>${equation(String.raw`\frac{z_t}{w_t + z_t + e_t} \le 0.2`)}</article>
      </div>
      <details><summary>Why the ratio is secretly linear</summary>${equation(String.raw`\begin{aligned} z_t &\le 0.2(w_t + z_t + e_t) \\ 0.2w_t - 0.8z_t + 0.2e_t &\ge 0 \end{aligned}`)}<p>The denominator is known nonnegative, so cross-multiplication preserves the inequality.</p></details>
      <p class="l2-muted">Moral: some nonlinear-looking ratios are linear after algebra when the denominator has a known sign.</p>`,
    fragments: ["Lifetime", "Demand", "Policy"],
  },
  {
    id: "l2-22",
    page: 22,
    title: "A Scheduling Problem (Nurses)",
    html: `
      <p>Night-shift demand on day ${math("j")} is ${math("d_j")}, and every nurse works five consecutive days. Let <strong>${math("x_j")} = nurses starting a five-day workweek on day ${math("j")}</strong>.</p>
      <div class="l2-grid">
        ${equation(String.raw`\begin{aligned} \operatorname{minimize}\quad & \sum_{j=1}^{7}x_j \\ \text{Monday}\quad & x_1+x_4+x_5+x_6+x_7 \ge d_1 \\ \text{Tuesday}\quad & x_1+x_2+x_5+x_6+x_7 \ge d_2 \\ & \vdots\quad \text{one coverage row per day} \\ \text{Sunday}\quad & x_3+x_4+x_5+x_6+x_7 \ge d_7 \end{aligned}`, "nurse scheduling model")}
        <aside class="l2-callout"><h3>Why starts?</h3><p>A start-day choice automatically creates five consecutive working days. “Nurses working today” does not identify which individual works tomorrow.</p></aside>
      </div>
      <p><span class="l2-chip">${math(String.raw`x_j \ge 0`)}</span><span class="l2-chip">${math(String.raw`x_j \in \mathbb{Z}`)}</span><span class="l2-chip">cyclic week</span></p>`,
  },
  {
    id: "l2-23",
    page: 23,
    title: "…But That's an Integer Program",
    html: `
      <div class="l2-grid l2-grid--equal">
        <article class="l2-card"><h3>Integer model</h3><p>${math(String.raw`x_j \in \mathbb{Z}`)} makes nurse counts physically meaningful.</p>${equation(String.raw`\text{best value} = Z_{\mathrm{ILP}}`)}</article>
        <article class="l2-card" data-reveal><h3>LP relaxation</h3><p>Drop integrality and allow fractional ${math("x")}.</p>${equation(String.raw`Z_{\mathrm{LP}} \le Z_{\mathrm{ILP}}`)}<p class="l2-muted">For minimization, more allowed points can only improve the bound.</p></article>
      </div>
      <ul data-reveal>
        <li>If an LP optimum is integral, it solves the ILP too.</li>
        <li>Rounding may produce a feasible schedule here, but need not produce the best one.</li>
      </ul>
      <aside class="l2-callout"><h3>Preview</h3><p>Bounds plus branching lead to integer programming and ISE 5406.</p></aside>`,
    fragments: ["LP relaxation", "Consequences"],
    checkpoint: checkpoint23,
  },
  {
    id: "l2-24",
    page: 24,
    title: "Graphical Representation",
    html: `
      <p class="native-lede">Build the geometry in three deliberate steps.</p>
      <div class="l2-grid">
        <ol>
          <li data-reveal="feasible-region"><strong>Feasible region:</strong> each equation ${math(String.raw`a^{\mathsf T}x = b`)} is a line perpendicular to ${math("a")}; choose its halfspace and intersect the retained sides.</li>
          <li data-reveal="objective-motion"><strong>Objective motion:</strong> slide the parallel level lines ${math(String.raw`c^{\mathsf T}x = t`)} in direction ${math("-c")}.</li>
          <li data-reveal="last-contact"><strong>Optimal contact:</strong> stop at the last feasible point or face.</li>
        </ol>
        <svg class="l2-figure" viewBox="0 0 500 360" role="img" aria-label="Polygonal feasible region with parallel objective level lines moving toward a corner">
          <defs><marker id="l2-arrow-24" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 8"><path d="M0 0L10 4L0 8Z" fill="#861f41"/></marker></defs>
          <g data-reveal="feasible-region"><path d="M70 305L405 305L345 105L125 65Z" fill="#dcecf7" stroke="#2878a8" stroke-width="4"/></g>
          <g data-reveal="objective-motion">
            <g stroke="#e87722" stroke-width="2.5" stroke-dasharray="9 7"><line data-objective-level x1="25" y1="240" x2="455" y2="80"/><line x1="25" y1="285" x2="455" y2="125"/><line x1="25" y1="330" x2="455" y2="170"/></g>
            <line data-objective-direction x1="250" y1="150" x2="282" y2="236" stroke="#861f41" stroke-width="3" marker-end="url(#l2-arrow-24)"/><text x="291" y="229" font-size="22" fill="#861f41">−c</text>
          </g>
          <g data-reveal="last-contact"><line data-objective-support x1="257" y1="360" x2="485" y2="275" stroke="#e87722" stroke-width="2.5" stroke-dasharray="9 7"/><circle data-objective-contact cx="405" cy="305" r="7" fill="#861f41"/><text x="310" y="338" font-size="20">last contact</text></g>
        </svg>
      </div>`,
    fragments: ["Feasible region", "Objective motion", "Optimal contact"],
  },
  {
    id: "l2-25",
    page: 25,
    title: "2D LP Grapher",
    html: `
      <div class="l2-grid">
        <svg class="l2-figure" viewBox="0 0 500 390" role="img" aria-label="Feasible polygon for two constraints with four marked corners">
          <path d="M65 330H435 M65 330V35" stroke="#526168" stroke-width="3"/>
          <path d="M65 330L330 330L240 155L65 68Z" fill="#dcecf7" stroke="#2878a8" stroke-width="5"/>
          <g fill="#861f41"><circle cx="65" cy="330" r="8"/><circle cx="330" cy="330" r="8"/><circle cx="240" cy="155" r="8"/><circle cx="65" cy="68" r="8"/></g>
          <text x="72" y="360" font-size="20">(0,0)</text><text x="315" y="360" font-size="20">(1.5,0)</text><text x="248" y="143" font-size="20">(1,1)</text><text x="75" y="62" font-size="20">(0,1.5)</text>
        </svg>
        <div>
          ${model("minimize", String.raw`c_1x_1 + c_2x_2`, [String.raw`x_1 + 2x_2 \le 3`, String.raw`2x_1 + x_2 \le 3`, String.raw`x \ge 0`], "two dimensional linear program")}
          <div class="l2-controls" data-widget="corner-objective">
            <label>${math("c_1")} <input type="range" min="-3" max="3" step="0.5" value="-1" data-corner="c1"><output data-value-for="c1">−1</output></label>
            <label>${math("c_2")} <input type="range" min="-3" max="3" step="0.5" value="-1" data-corner="c2"><output data-value-for="c2">−1</output></label>
          </div>
          <p class="l2-answer" aria-live="polite" data-corner-result>Best corner: (1, 1), objective −2.</p>
        </div>
      </div>`,
    onMount: ({ slideElement }) => mountCornerObjective(slideElement),
  },
  {
    id: "l2-26",
    page: 26,
    title: "Four LP Outcomes · Five Cases",
    html: `
      <div class="l2-tabs" role="tablist" aria-label="LP outcomes">
        <button type="button" role="tab" aria-selected="true" data-tab="unique">1 · Unique</button>
        <button type="button" role="tab" aria-selected="false" data-tab="bounded-many">2a · Many, bounded</button>
        <button type="button" role="tab" aria-selected="false" data-tab="unbounded-many">2b · Many, unbounded</button>
        <button type="button" role="tab" aria-selected="false" data-tab="minus-infinity">3 · Objective ${math(String.raw`\to-\infty`, "approaches negative infinity")}</button>
        <button type="button" role="tab" aria-selected="false" data-tab="infeasible">4 · Infeasible</button>
      </div>
      <div class="l2-card" role="tabpanel" data-panel="unique"><h3>${math(String.raw`c = (1,1)^{\mathsf T}`)}</h3><p>Unique optimum at ${math("(0,0)")}.</p></div>
      <div class="l2-card" role="tabpanel" data-panel="bounded-many" hidden><h3>${math(String.raw`c = (1,0)^{\mathsf T}`)}</h3><p>Every point ${math("(0,x_2)")}, ${math(String.raw`0 \le x_2 \le 1`)}, is optimal.</p></div>
      <div class="l2-card" role="tabpanel" data-panel="unbounded-many" hidden><h3>${math(String.raw`c = (0,1)^{\mathsf T}`)}</h3><p>The entire nonnegative ${math("x_1")}-axis is optimal.</p></div>
      <div class="l2-card" role="tabpanel" data-panel="minus-infinity" hidden><h3>${math(String.raw`c = (-1,-1)^{\mathsf T}`)}</h3><p>Feasible points exist, but cost falls without bound.</p></div>
      <div class="l2-card" role="tabpanel" data-panel="infeasible" hidden><h3>Add ${math(String.raw`x_1 + x_2 \le -2`)}</h3><p>No point satisfies all constraints; the feasible set is empty.</p></div>
      <aside class="l2-callout"><h3>Distinction</h3><p>An unbounded feasible set can still have a finite, attained optimum.</p></aside>`,
    onMount: ({ slideElement }) => mountTabs(slideElement),
  },
  {
    id: "l2-27",
    page: 27,
    title: "Example 1.7 in 3D — The Unit Cube",
    html: `
      <div class="l2-grid">
        <div>
          ${model("minimize", String.raw`-x_1-x_2-x_3`, [String.raw`0 \le x_i \le 1 \quad i=1,2,3`], "unit cube linear program")}
          <ul><li>8 corners</li><li>12 edges</li><li>6 faces</li><li>optimum ${math("(1,1,1)")}, cost ${math("-3")}</li></ul>
        </div>
        <svg class="l2-figure" viewBox="0 0 500 430" role="img" aria-label="Drawing of a cube with the optimal corner highlighted">
          <g>
            <path d="M100 290L310 290L400 210L190 210Z" fill="#dcecf7" stroke="#2878a8" stroke-width="4"/>
            <path d="M100 290L190 210L190 70L100 150Z" fill="#eef5fa" stroke="#2878a8" stroke-width="4"/>
            <path d="M310 290L400 210L400 70L310 150Z" fill="#cce4f2" stroke="#2878a8" stroke-width="4"/>
            <path d="M100 150L310 150L400 70L190 70Z" fill="#e5f0f7" stroke="#2878a8" stroke-width="4"/>
            <path d="M100 150V290M310 150V290M400 70V210M190 70V210" stroke="#2878a8" stroke-width="4"/>
            <circle cx="400" cy="70" r="11" fill="#861f41"/><text x="300" y="48" font-size="24">(1,1,1)</text>
          </g>
        </svg>
      </div>
      <aside class="l2-callout"><h3>Scale</h3><p>The ${math("n")}-cube has ${math("2^n")} corners—more than a googol when ${math("n=333")}.</p></aside>`,
  },
  {
    id: "l2-28",
    page: 28,
    title: "Higher Dimensions & the Key Observation",
    html: `
      <div class="l2-grid">
        <ul>
          <li>In 3D, ${math(String.raw`c^{\mathsf T}x = t`)} is a plane perpendicular to ${math("c")}.</li>
          <li>${math(String.raw`Ax = b`)} confines ${math("x")} to an ${math("(n-m)")}-dimensional affine set when ${math("A")} has ${math("m")} independent rows.</li>
          <li>${math(String.raw`x_1+x_2+x_3=1`)} with ${math(String.raw`x \ge 0`)} is a triangle living in ${math(String.raw`\mathbb R^3`)}.</li>
        </ul>
        <svg class="l2-figure" viewBox="0 0 480 360" role="img" aria-label="Triangle embedded in three dimensional coordinate axes">
          <defs><marker id="l2-arrow-28" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 8 6"><path d="M0 0L8 3L0 6Z" fill="#526168"/></marker></defs>
          <path d="M100 280L420 280M100 280L55 70M100 280L285 90" stroke="#526168" stroke-width="2.2" marker-end="url(#l2-arrow-28)"/>
          <path d="M365 280L75 155L250 125Z" fill="#dcecf7" stroke="#2878a8" stroke-width="5"/>
          <text x="370" y="310" font-size="22">x₁</text><text x="35" y="65" font-size="22">x₂</text><text x="287" y="80" font-size="22">x₃</text>
        </svg>
      </div>
      <aside class="l2-callout"><h3>Key observation</h3><p>If an LP optimum exists, one can be found at a corner. Chapter 2 proves it; Chapter 3 turns it into simplex.</p></aside>`,
  },
  {
    id: "l2-29",
    page: 29,
    title: "A Simpler Form: All Constraints as “≥”",
    html: `
      <div class="l2-cards">
        <article class="l2-card" data-reveal><h3>Flip a ≤ row</h3>${equation(String.raw`a_i^{\mathsf T}x \le b_i \quad \Longleftrightarrow \quad -a_i^{\mathsf T}x \ge -b_i`)}</article>
        <article class="l2-card" data-reveal><h3>Split an equality</h3>${equation(String.raw`a_i^{\mathsf T}x = b_i \quad \Longleftrightarrow \quad \begin{cases}a_i^{\mathsf T}x \ge b_i,\\-a_i^{\mathsf T}x \ge -b_i.\end{cases}`)}</article>
        <article class="l2-card" data-reveal><h3>Include signs as rows</h3><p>${math(String.raw`x_j \ge 0`)} uses ${math("e_j")}; ${math(String.raw`x_j \le 0`)} uses ${math("-e_j")}.</p></article>
      </div>
      <div data-reveal>${model("minimize", String.raw`c^{\mathsf T}x`, [String.raw`Ax \ge b`], "general form linear program")}</div>`,
    fragments: ["Flip", "Split", "Signs", "Stack"],
    checkpoint: checkpoint29,
  },
  {
    id: "l2-30",
    page: 30,
    title: "Ex. 1.2 → General Form Ax ≥ b",
    html: `
      <p>Start from the mixed-form LP on page 8. Convert one ingredient at a time.</p>
      <div class="l2-derivation-tabs" role="tablist" aria-label="Conversion steps">
        <button type="button" role="tab" id="l2-30-tab-1" aria-controls="l2-30-panel-1" aria-selected="true" data-derivation-step="1">1 · Flip ≤</button>
        <button type="button" role="tab" id="l2-30-tab-2" aria-controls="l2-30-panel-2" aria-selected="false" data-derivation-step="2">2 · Split =</button>
        <button type="button" role="tab" id="l2-30-tab-3" aria-controls="l2-30-panel-3" aria-selected="false" data-derivation-step="3">3 · Sign rows</button>
        <button type="button" role="tab" id="l2-30-tab-4" aria-controls="l2-30-panel-4" aria-selected="false" data-derivation-step="4">4 · Stack</button>
      </div>
      <div class="l2-derivation-panel" role="tabpanel" id="l2-30-panel-1" aria-labelledby="l2-30-tab-1" data-derivation-panel="1"><h3>Flip the ≤ row</h3>${equation(String.raw`x_1+x_2+x_4 \le 2 \quad \Longrightarrow \quad -x_1-x_2-x_4 \ge -2`)}</div>
      <div class="l2-derivation-panel" role="tabpanel" id="l2-30-panel-2" aria-labelledby="l2-30-tab-2" data-derivation-panel="2" hidden><h3>Split the equality</h3>${equation(String.raw`\begin{aligned}3x_2-x_3 &\ge 5,\\-3x_2+x_3 &\ge -5.\end{aligned}`)}</div>
      <div class="l2-derivation-panel" role="tabpanel" id="l2-30-panel-3" aria-labelledby="l2-30-tab-3" data-derivation-panel="3" hidden><h3>Include sign rows</h3>${equation(String.raw`x_1 \ge 0,\qquad -x_3 \ge 0`)}</div>
      <div class="l2-derivation-panel" role="tabpanel" id="l2-30-panel-4" aria-labelledby="l2-30-tab-4" data-derivation-panel="4" hidden><h3>Stack A, b, and c</h3>${equation(String.raw`A=${matrix([[-1,-1,0,-1],[0,3,-1,0],[0,-3,1,0],[0,0,1,1],[1,0,0,0],[0,0,-1,0]])},\quad b=${matrix([[-2],[5],[-5],[3],[0],[0]])},\quad c=${matrix([[2],[-1],[4],[0]])}`, "converted matrix A, right hand side b, and objective vector c")}</div>`,
    printHtml: `
      <p>Convert the mixed-form LP one ingredient at a time.</p>
      <div class="l2-print-conversion">
        <div class="l2-stack">
          <section class="l2-card"><h3>1 · Flip the ≤ row</h3>${equation(String.raw`x_1+x_2+x_4 \le 2 \quad \Longrightarrow \quad -x_1-x_2-x_4 \ge -2`)}</section>
          <section class="l2-card"><h3>2 · Split the equality</h3>${equation(String.raw`\begin{aligned}3x_2-x_3 &\ge 5,\\-3x_2+x_3 &\ge -5.\end{aligned}`)}</section>
          <section class="l2-card"><h3>3 · Include sign rows</h3>${equation(String.raw`x_1 \ge 0,\qquad -x_3 \ge 0`)}</section>
        </div>
        <section class="l2-card"><h3>4 · Stack A, b, and c</h3>${equation(String.raw`A=${matrix([[-1,-1,0,-1],[0,3,-1,0],[0,-3,1,0],[0,0,1,1],[1,0,0,0],[0,0,-1,0]])},\quad b=${matrix([[-2],[5],[-5],[3],[0],[0]])},\quad c=${matrix([[2],[-1],[4],[0]])}`, "converted matrix A, right hand side b, and objective vector c")}</section>
      </div>`,
    onMount: ({ slideElement }) => mountDerivationTabs(slideElement),
  },
  {
    id: "l2-31",
    page: 31,
    title: "Standard Form",
    html: `
      <div class="l2-grid">
        ${model("minimize", String.raw`c^{\mathsf T}x`, [String.raw`Ax=b`, String.raw`x \ge 0`], "standard form linear program")}
        <div class="l2-card"><h3>Only two ingredients</h3><p><span class="l2-chip">equalities</span><span class="l2-chip">nonnegative variables</span></p><p>This is the form used by simplex.</p></div>
      </div>
      <aside class="l2-callout"><h3>Column interpretation</h3>${equation(String.raw`Ax=A_1x_1+\cdots+A_nx_n=b`)}<p>Synthesize ${math("b")} from columns ${math("A_j")}, using nonnegative amounts ${math("x_j")} at unit costs ${math("c_j")}.</p></aside>`,
  },
  {
    id: "l2-32",
    page: 32,
    title: "Reduction to Standard Form",
    html: `
      <div class="l2-grid l2-grid--equal">
        <article class="l2-card"><h3>General form</h3><p>${math(String.raw`\min c^{\mathsf T}x`)}</p><p>rows may be ${math(String.raw`\ge`)}, ${math(String.raw`\le`)}, or ${math("=")}</p><p>variables may be ${math(String.raw`\ge 0`)}, ${math(String.raw`\le 0`)}, or free</p></article>
        <article class="l2-card" data-reveal><h3>Standard form</h3><p>${math(String.raw`\min \widetilde c^{\mathsf T}z`)}</p><p>${math(String.raw`\widetilde A z=\widetilde b`)}</p><p>${math(String.raw`z \ge 0`)}</p></article>
      </div>
      <div class="l2-cards">
        <article class="l2-step" data-reveal><strong>1</strong><div><h3>Variables</h3><p>Eliminate nonpositive and free variables.</p></div></article>
        <article class="l2-step" data-reveal><strong>2</strong><div><h3>Rows</h3><p>Replace inequalities by equalities.</p></div></article>
      </div>
      <aside class="l2-callout"><h3>Payoff</h3><p>We need algorithms for only one canonical form.</p></aside>`,
    fragments: ["Standard form", "Variables", "Rows"],
  },
  {
    id: "l2-33",
    page: 33,
    title: "The Four Transformation Rules",
    html: `
      <div class="l2-cards">
        <article class="l2-step" data-reveal><strong>1</strong><div><h3>Nonpositive variable</h3>${equation(String.raw`x_j=-x'_j,\qquad x'_j \ge 0`)}</div></article>
        <article class="l2-step" data-reveal><strong>2</strong><div><h3>Free variable</h3>${equation(String.raw`x_j=x_j^+-x_j^-,\qquad x_j^+,x_j^- \ge 0`)}<p>Every real value is a difference of nonnegatives; for example, ${math("-5=0-5")}.</p></div></article>
        <article class="l2-step" data-reveal><strong>3</strong><div><h3>≤ constraint</h3>${equation(String.raw`a_i^{\mathsf T}x+s_i=b_i,\qquad s_i \ge 0`)}<p>Add <strong>slack</strong>.</p></div></article>
        <article class="l2-step" data-reveal><strong>4</strong><div><h3>≥ constraint</h3>${equation(String.raw`a_i^{\mathsf T}x-s_i=b_i,\qquad s_i \ge 0`)}<p>Subtract <strong>surplus</strong>.</p></div></article>
      </div>
      <p class="l2-muted">The transformation introduces variables, but leaves us with the one form that simplex expects.</p>`,
    fragments: ["Nonpositive", "Free", "Slack", "Surplus"],
  },
  {
    id: "l2-34",
    page: 34,
    title: "Ex. 1.4 → Standard Form",
    html: `
      <div class="l2-grid l2-grid--equal">
        <article class="l2-card"><h3>Original</h3>${model("minimize", String.raw`2x_1+4x_2`, [String.raw`x_1+x_2 \ge 3`, String.raw`3x_1+2x_2=14`, String.raw`x_1 \ge 0;\quad x_2 \text{ free}`], "original mixed-form linear program")}</article>
        <article class="l2-card" data-reveal><h3>Standard form</h3><p>Set ${math(String.raw`x_2=x_2^+-x_2^-`)} and subtract surplus ${math("x_3")}.</p>${model("minimize", String.raw`2x_1+4x_2^+-4x_2^-`, [String.raw`x_1+x_2^+-x_2^--x_3=3`, String.raw`3x_1+2x_2^+-2x_2^-=14`, String.raw`x_1,x_2^+,x_2^-,x_3 \ge 0`], "equivalent standard-form linear program")}</article>
      </div>
      <details><summary>Test the two-way mapping</summary><p>${math(String.raw`(6,-2) \mapsto (6,0,2,1)`)}, while ${math(String.raw`(8,1,6,0) \mapsto (8,-5)`)}.</p><p>Both retain feasibility and objective value.</p></details>`,
    fragments: ["Converted model"],
  },
  {
    id: "l2-35",
    page: 35,
    title: "What Does “Equivalent” Mean?",
    html: `
      <p class="native-lede">Equivalent models may look different and have different variables.</p>
      <div class="l2-grid l2-grid--equal">
        <article class="l2-card"><h3>${math(String.raw`\Pi_1 \to \Pi_2`)}</h3><p>Every ${math(String.raw`\Pi_1`)}-feasible solution maps to a ${math(String.raw`\Pi_2`)}-feasible solution with equal or lower cost.</p></article>
        <article class="l2-card"><h3>${math(String.raw`\Pi_2 \to \Pi_1`)}</h3><p>Every ${math(String.raw`\Pi_2`)}-feasible solution maps back with equal or lower cost.</p></article>
      </div>
      <div data-reveal>${equation(String.raw`\text{both infeasible}\qquad\text{or}\qquad\text{same optimal cost}`)}</div>
      <aside class="l2-callout"><h3>Two jobs, two forms</h3><p>Use ${math(String.raw`Ax \ge b`)} to develop theory. Use ${math(String.raw`Ax=b,\ x \ge 0`)} to run simplex.</p></aside>`,
    fragments: ["Consequence"],
  },
  {
    id: "l2-36",
    page: 36,
    title: "Piecewise Linear Convex Functions",
    html: `
      <div class="l2-grid">
        <div>
          ${equation(String.raw`f(x)=\max_{i=1,\ldots,m}(c_i^{\mathsf T}x+d_i)`, "f is the maximum of affine pieces")}
          <p>The upper envelope is piecewise linear and convex.</p>
          <p>Simplest example: <strong>${math(String.raw`|x|=\max\{x,-x\}`)}</strong>.</p>
          <label>Move ${math("x")} <input type="range" min="-3" max="3" step="0.1" value="0.5" data-piecewise-x><output data-piecewise-value>0.5</output></label>
          <p class="l2-answer" aria-live="polite" data-piecewise-result>max{1.10, 0.95} = 1.10</p>
        </div>
        <svg class="l2-figure" viewBox="0 0 500 350" role="img" aria-label="The lines y equals x and y equals negative x, their upper envelope absolute value of x, and a movable point constrained to that envelope">
          <path d="M45 175H465M250 325V25" stroke="#526168" stroke-width="2.5"/>
          <g stroke="#8b979d" stroke-width="3">
            <line data-piecewise-line="positive" x1="55" y1="310" x2="445" y2="40"/>
            <line data-piecewise-line="negative" x1="55" y1="40" x2="445" y2="310"/>
          </g>
          <path data-piecewise-envelope d="M55 40L250 175L445 40" stroke="#861f41" stroke-width="7" stroke-linejoin="round" fill="none"/>
          <circle data-piecewise-dot cx="282.5" cy="152.5" r="9" fill="#e87722"/>
          <g font-size="20" fill="#46545a"><text x="392" y="66">y=x</text><text x="62" y="66">y=−x</text><text x="452" y="166">x</text><text x="260" y="36">f(x)</text></g>
          <text x="278" y="105" font-size="21" fill="#861f41">|x| = max{x, −x}</text>
        </svg>
      </div>
      <aside class="l2-callout l2-orange" data-reveal><h3>LP in disguise</h3><p>Minimizing a piecewise-linear convex function over a polyhedron <strong>is an LP in disguise</strong>. The epigraph trick on the next slide makes that exact.</p></aside>`,
    onMount: ({ slideElement }) => mountPiecewise(slideElement),
  },
  {
    id: "l2-37",
    page: 37,
    title: "The Epigraph Trick",
    html: `
      <div class="l2-grid l2-epigraph-grid">
        <div>
          <p>Original objective:</p>
          ${equation(String.raw`\min_x\max_i(c_i^{\mathsf T}x+d_i)`)}
          <div data-reveal>
            <p>Introduce one height variable ${math("z")}:</p>
            ${model("minimize", "z", [String.raw`z \ge c_i^{\mathsf T}x+d_i \quad \text{for every } i`, String.raw`Ax \ge b`], "epigraph linear program")}
          </div>
        </div>
        <svg class="l2-figure" viewBox="0 0 500 360" role="img" aria-label="Epigraph above a piecewise linear convex function">
          <path d="M45 310H470M245 335V20" stroke="#526168" stroke-width="3"/>
          <path d="M55 65L240 170L455 55L455 15L55 15Z" fill="#f6dce5" opacity=".75"/>
          <path d="M55 65L240 170L455 55" stroke="#861f41" stroke-width="7" fill="none"/>
          <path d="M340 250V95" stroke="#e87722" stroke-width="5" stroke-dasharray="8 6"/><circle cx="340" cy="95" r="8" fill="#e87722"/>
          <text x="355" y="100" font-size="24">z</text><text x="75" y="42" font-size="23">feasible epigraph</text>
        </svg>
      </div>
      <aside class="l2-callout l2-epigraph-example" data-reveal><h3>Why exact?</h3><p>For fixed ${math("x")}, minimization pushes ${math("z")} down until it touches the largest affine piece.</p><p><strong>Example:</strong> replace ${math(String.raw`\min\max\{2x_1+4x_2,\ 2x_1+x_2\}`)} by ${math(String.raw`\min z`)} with ${math(String.raw`z \ge 2x_1+4x_2`)} and ${math(String.raw`z \ge 2x_1+x_2`)}.</p></aside>`,
    printHtml: `
      <div class="l2-grid">
        <div>
          <p><strong>Original:</strong> ${math(String.raw`\min_x\max_i(c_i^{\mathsf T}x+d_i)`)}.</p>
          <p><strong>Epigraph LP:</strong> ${math(String.raw`\min z`)} subject to ${math(String.raw`z \ge c_i^{\mathsf T}x+d_i`)} for every ${math("i")}, and ${math(String.raw`Ax \ge b`)}.</p>
          <aside class="l2-callout"><h3>Why exact?</h3><p>For fixed ${math("x")}, minimization pushes ${math("z")} down to the largest affine piece.</p></aside>
        </div>
        <svg class="l2-figure" viewBox="0 0 500 360" role="img" aria-label="Epigraph above a piecewise linear convex function">
          <path d="M45 310H470M245 335V20" stroke="#526168" stroke-width="3"/>
          <path d="M55 65L240 170L455 55L455 15L55 15Z" fill="#f6dce5" opacity=".75"/>
          <path d="M55 65L240 170L455 55" stroke="#861f41" stroke-width="7" fill="none"/>
          <path d="M340 250V95" stroke="#e87722" stroke-width="5" stroke-dasharray="8 6"/><circle cx="340" cy="95" r="8" fill="#e87722"/>
          <text x="355" y="100" font-size="24">z</text><text x="75" y="42" font-size="23">feasible epigraph</text>
        </svg>
      </div>`,
    fragments: ["Introduce z and formulate the LP", "Explain exactness"],
  },
  {
    id: "l2-38",
    page: 38,
    title: "Absolute Values as an LP",
    html: `
      <div class="l2-grid">
        <div>
          ${model("minimize", String.raw`\sum_{i=1}^{n}c_i|x_i|`, [String.raw`Ax \ge b`], "absolute-value linear program")}
          <p>Put ${math("z_i")} above both branches:</p>
          ${equation(String.raw`x_i \le z_i \qquad\text{and}\qquad -x_i \le z_i`)}
        </div>
        <div data-reveal>${model("minimize", String.raw`\sum_i c_i z_i`, [String.raw`Ax \ge b`, String.raw`x_i \le z_i`, String.raw`-x_i \le z_i`], "linearized absolute-value model")}</div>
      </div>
      <aside class="l2-callout"><h3>Warning</h3><p>Exactness uses <strong>minimization</strong> and coefficients ${math(String.raw`c_i \ge 0`)}. Then every ${math("z_i")} is pushed to ${math(String.raw`|x_i|`)}.</p></aside>
      <details><summary>One-line example</summary><p>For ${math(String.raw`\min 2|x_1|+x_2`)} with ${math(String.raw`x_1+x_2 \ge 4`)}, minimize ${math(String.raw`2z_1+x_2`)} and add ${math(String.raw`x_1 \le z_1`)} and ${math(String.raw`-x_1 \le z_1`)}.</p></details>`,
    fragments: ["LP form"],
  },
  {
    id: "l2-39",
    page: 39,
    title: "Application: Data Fitting",
    html: `
      <div class="l2-grid">
        <div>
          <p>Fit ${math(String.raw`b \approx ma+q`)}. Residual ${math("i")} is ${math(String.raw`|b_i-(ma_i+q)|`)}.</p>
          <div class="l2-controls" data-widget="data-fit">
            <label>Slope ${math("m")} <input type="range" min="0" max="2" step="0.1" value="1" data-fit="m"><output data-value-for="m">1.0</output></label>
            <label>Intercept ${math("q")} <input type="range" min="-2" max="2" step="0.1" value="0" data-fit="q"><output data-value-for="q">0.0</output></label>
          </div>
          <p class="l2-answer" aria-live="polite" data-fit-result>largest residual = 1.00; sum = 2.00</p>
        </div>
        <div class="l2-cards">
          <article class="l2-card"><h3>${math(String.raw`\ell_\infty`)} fit</h3><p>Minimize ${math("z")} with ${math(String.raw`-z \le b_i-a_i^{\mathsf T}x \le z`)}.</p></article>
          <article class="l2-card"><h3>${math(String.raw`\ell_1`)} fit</h3><p>Minimize ${math(String.raw`\sum_i z_i`)} with ${math(String.raw`-z_i \le b_i-a_i^{\mathsf T}x \le z_i`)}.</p></article>
        </div>
      </div>
      <aside class="l2-callout"><h3>Classification</h3><p>Robust ${math(String.raw`\ell_\infty`)} and ${math(String.raw`\ell_1`)} regression are LPs. Least squares (${math(String.raw`\ell_2`)}) is their quadratic cousin.</p></aside>`,
    onMount: ({ slideElement }) => mountDataFit(slideElement),
  },
  {
    id: "l2-40",
    page: 40,
    title: "Explore More (self-study)",
    html: `
      <p class="native-lede">Optional practice for the material assigned after page 35.</p>
      <div class="l2-cards">
        <a class="l2-card" href="https://open-optimization.github.io/open-optimization-or-book/visualizations#modeling-intro" target="_blank" rel="noopener"><h3>Words → math</h3><p>Guided modeling tutorial</p></a>
        <a class="l2-card" href="https://open-optimization.github.io/open-optimization-or-book/visualizations#objective-slider" target="_blank" rel="noopener"><h3>Objective slider</h3><p>Move level lines geometrically</p></a>
        <a class="l2-card" href="https://open-optimization.github.io/open-optimization-or-book/visualizations#concept-quiz" target="_blank" rel="noopener"><h3>Concept quiz</h3><p>Check LP vocabulary</p></a>
        <a class="l2-card" href="https://open-optimization.github.io/open-optimization-or-book/visualizations#simplex-dictionary" target="_blank" rel="noopener"><h3>Bakery pivots</h3><p>Preview Chapter 3</p></a>
      </div>
      <aside class="l2-callout"><h3>Keep going</h3><p>Use this deck’s local graphical explorer on page 25. Hildebrand’s free course text, <cite>Mathematical Programming and Operations Research</cite>, is available through <a href="https://github.com/open-optimization" target="_blank" rel="noopener">Open Optimization</a>; duality and sensitivity explorers return with Chapters 4 and 5.</p></aside>`,
  },
  {
    id: "l2-41",
    page: 41,
    title: "Summary",
    html: `
      <div class="l2-cards">
        <article class="l2-card"><h3>Language</h3><p>Vectors and matrices package objectives and constraints.</p></article>
        <article class="l2-card"><h3>Models</h3><p>Variable choice turns production, diet, power, and scheduling into algebra.</p></article>
        <article class="l2-card"><h3>Geometry</h3><p>Halfspaces intersect into polyhedra; objectives move toward corners.</p></article>
        <article class="l2-card"><h3>Forms</h3><p>General and standard forms are equivalent tools for different jobs.</p></article>
        <article class="l2-card"><h3>Disguises</h3><p>Epigraph variables expose piecewise-linear and absolute-value LPs.</p></article>
      </div>
      <aside class="l2-callout"><h3>Next</h3><p>Proof techniques and LaTeX, then polyhedral geometry.</p></aside>`,
  },
];

const adapt = (legacyPage, page, patch = {}) => ({
  ...legacySlides[legacyPage - 1],
  ...patch,
  id: `l2-${String(page).padStart(2, "0")}`,
  page,
});

const applicationExplorations = [
  {
    id: "airlines",
    label: "Explore airlines",
    title: "Airlines",
    html: String.raw`<p class="l2-explore-kicker">Discrete · among the largest IPs solved anywhere</p><p>Airlines re-plan constantly: crews, aircraft, prices. Crew scheduling alone involves millions of yes/no choices.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Which crew pairing to fly (yes/no each)</li><li>Which aircraft type serves each route</li><li>How many seats to sell at each fare</li></ul></section><section><h4>Constraints</h4><ul><li>Every flight covered by exactly one crew</li><li>FAA duty &amp; rest rules; return to base</li><li>Fleet counts, maintenance windows, gates</li></ul></section><section><h4>Objectives</h4><ul><li>Minimize crew + fuel cost</li><li>Maximize ticket revenue</li><li>Minimize delay propagation</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> integer programming at massive scale — solved by branch-and-bound over LP relaxations.</p><p class="l2-app-data"><strong>Data needed first:</strong> full flight schedule, crew cost rules, historical demand by route &amp; fare class, disruption statistics.</p>`,
  },
  {
    id: "energy",
    label: "Explore energy",
    title: "Energy",
    html: String.raw`<p class="l2-explore-kicker">Mixed continuous/discrete · re-solved every 5 minutes</p><p>Grid operators decide which plants run and at what level — a fresh optimization every few minutes, national scale.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Unit on/off status each hour (discrete)</li><li>Output level of each running unit (continuous)</li><li>Reserve capacity held back</li></ul></section><section><h4>Constraints</h4><ul><li>Supply = demand, every moment, everywhere</li><li>Ramp-rate limits; min up/down times</li><li>Transmission line capacities</li></ul></section><section><h4>Objectives</h4><ul><li>Minimize fuel + startup cost</li><li>Minimize emissions (or price them)</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> unit commitment = MIP; dispatch = LP; true AC power physics = nonlinear (usually linearized!).</p><p class="l2-app-data"><strong>Data needed first:</strong> demand forecasts (ML!), generator cost curves, outage statistics, network parameters.</p>`,
  },
  {
    id: "logistics",
    label: "Explore logistics",
    title: "Logistics",
    html: String.raw`<p class="l2-explore-kicker">Discrete · routing and location</p><p>Every package rides a chain of optimized decisions: which warehouse, which truck, which route, which order of stops.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Route and stop sequence per vehicle</li><li>Package-to-vehicle assignment</li><li>Where to place warehouses (long-run)</li></ul></section><section><h4>Constraints</h4><ul><li>Vehicle capacity; driver hour limits</li><li>Delivery time windows</li><li>Every package delivered exactly once</li></ul></section><section><h4>Objectives</h4><ul><li>Minimize miles / fuel / cost</li><li>Maximize on-time percentage</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> vehicle routing = hard combinatorial IP; heavily attacked with LP bounds + heuristics.</p><p class="l2-app-data"><strong>Data needed first:</strong> demand by location, travel-time predictions, cost models, service-level statistics.</p>`,
  },
  {
    id: "manufacturing",
    label: "Explore manufacturing",
    title: "Manufacturing",
    html: String.raw`<p class="l2-explore-kicker">Linear at heart · the classic LP habitat</p><p>The original LP applications: what to make, how to cut, what to blend — the production examples in this course.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Quantity of each product</li><li>Which cutting patterns to use</li><li>Blend fractions (fuels, feeds, alloys)</li></ul></section><section><h4>Constraints</h4><ul><li>Machine &amp; labor capacity</li><li>Raw material availability</li><li>Quality/recipe specifications, demand</li></ul></section><section><h4>Objectives</h4><ul><li>Maximize profit</li><li>Minimize waste or cost</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> mostly genuinely linear — proportional, additive, divisible. LP's home turf since the 1940s.</p><p class="l2-app-data"><strong>Data needed first:</strong> bills of materials, capacity measurements, cost accounting, demand forecasts.</p>`,
  },
  {
    id: "finance",
    label: "Explore finance",
    title: "Finance",
    html: String.raw`<p class="l2-explore-kicker">Nonlinear risk · linear sneaks back in</p><p>Allocate wealth across assets balancing return against risk — Markowitz's Nobel-winning model and its LP cousins.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Fraction of wealth per asset</li><li>Trades to rebalance a portfolio</li></ul></section><section><h4>Constraints</h4><ul><li>Budget: fractions sum to 1</li><li>Position limits, no-short rules</li><li>Regulatory / risk limits</li></ul></section><section><h4>Objectives</h4><ul><li>Maximize return − risk penalty</li><li>Minimize tracking error vs an index</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> variance risk = quadratic (nonlinear); absolute-deviation risk versions are LPs; arbitrage detection is pure LP duality (later in this course!).</p><p class="l2-app-data"><strong>Data needed first:</strong> return histories, covariance estimates (statistics!), transaction cost models.</p>`,
  },
  {
    id: "healthcare",
    label: "Explore healthcare",
    title: "Healthcare",
    html: String.raw`<p class="l2-explore-kicker">Continuous and discrete · high stakes</p><p>From radiation dose maps to staff schedules to kidney exchanges — optimization with lives in the objective function.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Beamlet intensities (continuous)</li><li>Nurse-to-shift assignments (discrete)</li><li>Donor–patient matches (discrete)</li></ul></section><section><h4>Constraints</h4><ul><li>Tumor dose minimums, organ dose caps</li><li>Shift coverage, work rules</li><li>Medical compatibility, exchange cycles</li></ul></section><section><h4>Objectives</h4><ul><li>Minimize dose to healthy tissue</li><li>Minimize staffing cost / overtime</li><li>Maximize number of transplants</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> therapy planning ≈ LP; scheduling &amp; matching = IP.</p><p class="l2-app-data"><strong>Data needed first:</strong> imaging &amp; dose physics, patient arrival statistics, compatibility testing — and clinical workflows ready to <em>use</em> the answer.</p>`,
  },
  {
    id: "sports",
    label: "Explore sports",
    title: "Sports",
    html: String.raw`<p class="l2-explore-kicker">Discrete · yes, the MLB schedule is an IP</p><p>Season schedules juggle venues, travel, TV and fairness — Major League Baseball's is produced with integer programming.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Which teams play where, each day</li><li>Series groupings and off days</li></ul></section><section><h4>Constraints</h4><ul><li>Venue availability</li><li>Travel distance / back-to-back limits</li><li>Broadcast windows, rivalry dates, fairness</li></ul></section><section><h4>Objectives</h4><ul><li>Minimize total travel</li><li>Maximize attractive matchups in prime slots</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> pure integer programming — schedules don't come in fractions.</p><p class="l2-app-data"><strong>Data needed first:</strong> venue calendars, travel times, broadcast contracts, historical attendance.</p>`,
  },
  {
    id: "machine-learning",
    label: "Explore machine learning",
    title: "Machine learning",
    html: String.raw`<p class="l2-explore-kicker">Nonlinear · optimization all the way down</p><p>Training any model <em>is</em> optimization: choose parameters minimizing a loss. The fields are siblings, not rivals.</p><div class="l2-app-detail-grid"><section><h4>Decisions</h4><ul><li>Model weights (millions–billions of them)</li></ul></section><section><h4>Constraints</h4><ul><li>Often none explicit — or regularization playing that role</li></ul></section><section><h4>Objectives</h4><ul><li>Minimize prediction loss on data</li></ul></section></div><p class="l2-app-flavor"><strong>Flavor:</strong> high-dimensional nonlinear (gradient methods — ISE 5406). But LP appears inside ML too: \(\ell_1\)/robust regression, optimal transport.</p><p class="l2-app-data"><strong>Data needed first:</strong> the training data <em>is</em> the model — and ML's outputs (forecasts) are optimization's <em>inputs</em>, one rung down the maturity curve.</p>`,
  },
];

const applicationCard = ({ title, flavor, intro, decisions, constraints, objectives, conclusion, data }) => `
  <article class="l2-app-detail l2-box">
    <h3>${title} <span>${flavor}</span></h3>
    <p>${intro}</p>
    <div class="l2-app-detail-grid">
      <section><h4>Decisions</h4><ul>${decisions.map((item) => `<li>${item}</li>`).join("")}</ul></section>
      <section><h4>Constraints</h4><ul>${constraints.map((item) => `<li>${item}</li>`).join("")}</ul></section>
      <section><h4>Objectives</h4><ul>${objectives.map((item) => `<li>${item}</li>`).join("")}</ul></section>
    </div>
    <p class="l2-app-flavor"><strong>Flavor:</strong> ${conclusion}</p>
    <p class="l2-app-data"><strong>Data needed first:</strong> ${data}</p>
  </article>`;

export const slides = [
  {
    id: "l2-01",
    page: 1,
    title: "Introduction & Linear Optimization",
    eyebrow: "ISE 5405 · Optimization I",
    kind: "title",
    className: "native-title-slide l2-reference-title",
    html: String.raw`
      <div class="l2-title-layout">
        <div class="l2-stack">
          <p class="l2-title-kicker">ISE 5405 · OPTIMIZATION I · LECTURE 1</p>
          <p class="l2-title-word">Introduction &amp; Linear Optimization</p>
          <p class="native-lede">Why optimization runs the world · the language of LP · first models · BT §§1.1–1.4</p>
          <p class="l2-muted">Fall 2026 · Dr. Jiaxiang “Jason” Li</p>
          <div class="ns-title-shortcuts" aria-label="Presentation keyboard shortcuts">
            <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span><span><kbd>←</kbd> back</span>
            <span><kbd>F</kbd> fullscreen</span><span><kbd>M</kbd> menu</span>
            <span><kbd>P</kbd> pen</span><span><kbd>E</kbd> eraser</span>
            <span><kbd>C</kbd> clear ink</span><span><kbd>L</kbd> laser</span>
            <span><kbd>W</kbd> whiteboard</span><span><kbd>H</kbd> handout</span>
            <span><kbd>K</kbd> checkpoint</span><span><kbd>?</kbd> help</span>
          </div>
          <p class="ns-title-handout"><strong>Saving an annotated PDF:</strong> press <kbd>H</kbd>, then print and choose “Save as PDF.” All reveals and saved slide ink are included. On iPad, use Share → Print → Save to Files; Ink backup exports or imports annotations between devices.</p>
        </div>
        <svg class="l2-title-art" viewBox="0 0 400 320" role="img" aria-label="A polygonal feasible region, parallel objective contours, vertices, and a highlighted optimal corner">
          <defs><linearGradient id="l2-title-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5751f" stop-opacity=".22"/><stop offset="1" stop-color="#861f41" stop-opacity=".30"/></linearGradient></defs>
          <polygon points="70,240 140,90 250,60 340,140 320,240 180,290" fill="url(#l2-title-gradient)" stroke="#861f41" stroke-width="2.5" stroke-opacity=".5"/>
          <g stroke="#e5751f" stroke-width="1.6" stroke-dasharray="7 6" opacity=".65"><line x1="20" y1="215" x2="380" y2="118"/><line x1="20" y1="258" x2="380" y2="161"/><line x1="20" y1="172" x2="380" y2="75"/></g>
          <g fill="#861f41" opacity=".75"><circle cx="70" cy="240" r="5"/><circle cx="140" cy="90" r="5"/><circle cx="250" cy="60" r="5"/><circle cx="340" cy="140" r="5"/><circle cx="320" cy="240" r="5"/><circle cx="180" cy="290" r="5"/></g>
          <circle cx="250" cy="60" r="10" fill="none" stroke="#1a7d3c" stroke-width="3"/><path d="M250 60l34-14" stroke="#33658a" stroke-width="2.5"/><path d="M284 46l-9-1 4 8z" fill="#33658a"/>
        </svg>
      </div>`,
  },
  {
    id: "l2-02",
    page: 2,
    title: "Where We're Going",
    eyebrow: "Today · one arc",
    html: String.raw`
      <div class="l2-route-grid">
        <article class="l2-box"><h3>1 · Why optimization?</h3><p>Decisions everywhere: radiation therapy, crew schedules, portfolios—in words first.</p></article>
        <article class="l2-box l2-orange" data-reveal><h3>2 · A dose of realism</h3><p>Where optimization fits in an organization—and when it does not.</p></article>
        <article class="l2-box l2-blue" data-reveal><h3>3 · The language</h3><p>Vectors, matrices, inner products, one inequality = half a plane.</p></article>
        <article class="l2-box l2-green" data-reveal><h3>4 · First models</h3><p>Production, diet, scheduling—words → math, gently.</p></article>
        <article class="l2-box" data-reveal><h3>5 · The geometry</h3><p>Feasible regions, corners, and why brute force fails.</p></article>
        <article class="l2-box l2-orange" data-reveal><h3>6 · Canonical forms</h3><p>Getting LPs ready for algorithms.</p></article>
      </div>
      <p class="l2-note" data-reveal>Checkpoint questions appear at meaningful concept boundaries. Syllabus and logistics live in Lecture 0.</p>`,
  },
  {
    id: "l2-03",
    page: 3,
    title: "Optimization: Taking Optimal Decisions",
    html: String.raw`
      <p class="native-lede">In complex systems, <strong>“common sense” strategies can be misleading.</strong></p>
      <p data-reveal>Optimization provides a <strong>principled</strong> way to choose the best action, subject to constraints and trade-offs.</p>
      <div class="l2-box" data-reveal><h3>Every optimization problem has three ingredients</h3><ul><li><strong>Decisions</strong>—what we control</li><li><strong>Constraints</strong>—what limits us</li><li><strong>Objective</strong>—what “best” means</li></ul></div>
      <p class="l2-punchline" data-reveal><em>Our job this semester: make these notions precise—and computable.</em></p>`,
  },
  {
    id: "l2-04",
    page: 4,
    title: "Where Optimization Runs the World",
    eyebrow: "Optimization in the wild",
    html: String.raw`
      <div class="l2-app-grid" tabindex="0" role="region" aria-label="Application examples; scroll for all eight examples">
        <article class="l2-box"><h3>Airlines <button class="ns-slide-action l2-explore" data-explore="airlines">Explore ▸</button></h3><p>Which crew flies which trip, which aircraft serves which route, how tickets are priced. Savings: billions per year.</p></article>
        <article class="l2-box"><h3>Energy <button class="ns-slide-action l2-explore" data-explore="energy">Explore ▸</button></h3><p>Which generators run each hour and at what level. U.S. power markets re-solve this <em>every five minutes</em>.</p></article>
        <article class="l2-box" data-reveal><h3>Logistics <button class="ns-slide-action l2-explore" data-explore="logistics">Explore ▸</button></h3><p>Routes, warehouses, and container packing. Every package rode an optimized route.</p></article>
        <article class="l2-box" data-reveal><h3>Manufacturing <button class="ns-slide-action l2-explore" data-explore="manufacturing">Explore ▸</button></h3><p>Production mixes, cutting patterns, and blending recipes for fuel and food.</p></article>
        <article class="l2-box" data-reveal><h3>Finance <button class="ns-slide-action l2-explore" data-explore="finance">Explore ▸</button></h3><p>Portfolios trading return against risk; spotting arbitrage before it disappears.</p></article>
        <article class="l2-box" data-reveal><h3>Healthcare <button class="ns-slide-action l2-explore" data-explore="healthcare">Explore ▸</button></h3><p>Nurse schedules, radiation plans, and kidney donor-patient matching.</p></article>
        <article class="l2-box" data-reveal><h3>Sports <button class="ns-slide-action l2-explore" data-explore="sports">Explore ▸</button></h3><p>Major League Baseball’s season schedule is built with integer programming.</p></article>
        <article class="l2-box" data-reveal><h3>Machine learning <button class="ns-slide-action l2-explore" data-explore="machine-learning">Explore ▸</button></h3><p>Every training run <em>is</em> optimization: minimize a loss function.</p></article>
      </div>
      <p class="l2-punchline" data-reveal><em>Let’s look inside three of these—in words, no equations needed yet.</em></p>`,
    explorations: applicationExplorations,
  },
  {
    id: "l2-05",
    page: 5,
    title: "Radiation Therapy Planning",
    eyebrow: "Spotlight 1 · continuous & linear",
    html: String.raw`
      <div class="l2-text-visual">
        <div class="l2-stack l2-small"><p>A tumor is hit by beams from many angles. Each beam is split into thousands of <strong>beamlets</strong> whose intensities can be set individually. Dose is proportional to intensity, and doses add.</p>
          <div class="l2-box"><h3>Model in words</h3><p><strong>choose</strong>—every beamlet intensity<br><strong>minimize</strong>—dose to healthy tissue<br><strong>subject to</strong>—tumor prescription, organ safety limits, nonnegative intensities</p></div>
          <div class="l2-box l2-orange" data-reveal><strong>Flavor: LINEAR.</strong> Proportional + additive = the LP axioms. Models with roughly 100,000 variables are solved daily in clinics.</div>
        </div>
        <svg class="l2-figure" viewBox="0 0 380 300" role="img" aria-label="Patient cross-section: three radiation beams overlap on a central tumor while sparing two labeled organs">
          <ellipse cx="190" cy="160" rx="150" ry="105" fill="#f7ece2" stroke="#c9b8a8" stroke-width="2"/>
          <ellipse cx="120" cy="150" rx="34" ry="46" fill="#eef3f7" stroke="#33658a" stroke-width="1.5"/><text x="104" y="153" font-size="12" fill="#33658a">organ</text>
          <ellipse cx="262" cy="185" rx="30" ry="24" fill="#eef3f7" stroke="#33658a" stroke-width="1.5"/><text x="245" y="189" font-size="12" fill="#33658a">organ</text>
          <circle cx="205" cy="130" r="26" fill="rgba(134,31,65,.25)" stroke="#861f41" stroke-width="2.5"/><text x="182" y="134" font-size="13" font-weight="bold" fill="#861f41">tumor</text>
          <g opacity=".55" fill="rgba(229,117,31,.35)"><polygon points="205,130 40,18 120,6"/><polygon points="205,130 360,40 300,10"/><polygon points="205,130 368,255 372,180"/></g>
          <text x="46" y="34" font-size="12" fill="#b25a12">beam 1</text><text x="300" y="34" font-size="12" fill="#b25a12">beam 2</text><text x="318" y="268" font-size="12" fill="#b25a12">beam 3</text><text x="12" y="290" font-size="12" fill="#777">beamlet intensities = decision variables</text>
        </svg>
      </div>`,
  },
  {
    id: "l2-06",
    page: 6,
    title: "Airline Crew Scheduling",
    eyebrow: "Spotlight 2 · discrete decisions",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack l2-small"><p>Thousands of flights must each get a crew. Multi-day <strong>pairings</strong> obey rest rules and end back at the crew’s home base.</p><div class="l2-box"><h3>Model in words</h3><p><strong>choose</strong>—yes/no for every pairing<br><strong>minimize</strong>—total crew cost<br><strong>subject to</strong>—exactly-once flight coverage, work and rest rules</p></div><div class="l2-box l2-orange" data-reveal><strong>Flavor: DISCRETE.</strong> You cannot fly 0.7 of a trip. Millions of binary variables break divisibility.</div><div class="l2-box l2-blue" data-reveal><strong>How solved?</strong> Branch-and-bound: a search tree in which every node solves an LP relaxation.</div></div>
        <svg class="l2-figure" viewBox="0 0 380 300" role="img" aria-label="Route map from Roanoke through ORD, ATL, JFK, and CLT; one candidate crew pairing is highlighted in maroon and returns toward base">
          <g stroke="#d5cdc4" stroke-width="1.5" fill="none"><path d="M60 220Q130 120 200 150"/><path d="M200 150Q260 90 330 110"/><path d="M60 220Q160 240 270 230"/><path d="M270 230Q310 180 330 110"/><path d="M90 70Q150 110 200 150"/><path d="M90 70Q220 40 330 110"/></g>
          <g stroke="#861f41" stroke-width="3.5" fill="none"><path d="M60 220Q130 120 200 150"/><path d="M200 150Q260 90 330 110"/><path d="M330 110Q310 180 270 230"/><path d="M270 230Q160 240 60 220" stroke-dasharray="7 5"/></g>
          <g fill="#33658a"><circle cx="60" cy="220" r="9"/><circle cx="90" cy="70" r="9"/><circle cx="200" cy="150" r="9"/><circle cx="330" cy="110" r="9"/><circle cx="270" cy="230" r="9"/></g>
          <g font-size="13" fill="#444"><text x="34" y="248">ROA (base)</text><text x="70" y="52">ORD</text><text x="186" y="178">ATL</text><text x="316" y="92">JFK</text><text x="252" y="258">CLT</text></g><text x="12" y="290" font-size="12" fill="#777">one candidate pairing: choose it—yes or no?</text>
        </svg>
      </div>`,
  },
  {
    id: "l2-07",
    page: 7,
    title: "Portfolio Selection",
    eyebrow: "Spotlight 3 · smooth & nonlinear",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack l2-small"><p>Split wealth among assets. Expected return is linear, but variance contains products of allocations, so risk is <strong>quadratic</strong>.</p><div class="l2-box"><h3>Model in words</h3><p><strong>choose</strong>—wealth fractions<br><strong>maximize</strong>—return minus a risk penalty<br><strong>subject to</strong>—fractions sum to 1; position limits</p></div><div class="l2-box l2-orange" data-reveal><strong>Flavor: NONLINEAR.</strong> Products break additivity. Markowitz won a Nobel Prize for this model.</div><div class="l2-box l2-blue" data-reveal><strong>LP sneaks in:</strong> mean-absolute-deviation risk is an LP; nonlinear methods use local linear models.</div></div>
        <svg class="l2-figure" viewBox="0 0 380 300" role="img" aria-label="Risk-return plot with a curved efficient frontier and a highlighted portfolio">
          <line x1="48" y1="252" x2="360" y2="252" stroke="#888" stroke-width="1.5"/><line x1="48" y1="252" x2="48" y2="24" stroke="#888" stroke-width="1.5"/><text x="150" y="282" font-size="13" fill="#666">risk (std. dev.)</text><text x="14" y="150" font-size="13" fill="#666" transform="rotate(-90 22 150)">return</text>
          <path d="M90 235Q96 120 200 78T352 44" fill="none" stroke="#861f41" stroke-width="3.5"/><g fill="#c9b8a8"><circle cx="150" cy="200" r="4"/><circle cx="210" cy="170" r="4"/><circle cx="255" cy="190" r="4"/><circle cx="185" cy="220" r="4"/><circle cx="290" cy="150" r="4"/><circle cx="240" cy="120" r="4"/></g><circle cx="200" cy="78" r="8" fill="none" stroke="#1a7d3c" stroke-width="3"/><text x="146" y="62" font-size="13" fill="#1a7d3c" font-weight="bold">efficient frontier</text><text x="12" y="24" font-size="12" fill="#777">curved trade-off—no corner to stand on</text>
        </svg>
      </div>`,
  },
  {
    id: "l2-08",
    page: 8,
    title: "The Decision-Making Maturity Curve",
    eyebrow: "Where this course sits",
    html: String.raw`
      <svg class="l2-maturity" viewBox="0 0 1150 430" role="img" aria-label="Four rising steps: Data, Statistics, Machine learning, Optimization, followed by AI; sophistication and organizational value rise to the right">
        <line x1="60" y1="390" x2="1120" y2="390" stroke="#999" stroke-width="2"/><line x1="60" y1="390" x2="60" y2="30" stroke="#999" stroke-width="2"/><text x="880" y="418" font-size="16" fill="#666">sophistication →</text><text x="26" y="220" font-size="16" fill="#666" transform="rotate(-90 34 220)">value to the organization →</text>
        <g font-size="17" text-anchor="middle"><rect x="80" y="320" width="180" height="70" rx="10" fill="#f6f3ef" stroke="#c9b8a8" stroke-width="2"/><text x="170" y="349" font-weight="bold">Data</text><text x="170" y="372" font-size="14" fill="#777">what happened</text>
          <g data-reveal><rect x="285" y="255" width="180" height="135" rx="10" fill="#f6f3ef" stroke="#c9b8a8" stroke-width="2"/><text x="375" y="286" font-weight="bold">Statistics</text><text x="375" y="309" font-size="14" fill="#777">what patterns,</text><text x="375" y="328" font-size="14" fill="#777">and why</text></g>
          <g data-reveal><rect x="490" y="185" width="180" height="205" rx="10" fill="#eef3f7" stroke="#33658a" stroke-width="2"/><text x="580" y="216" font-weight="bold" fill="#33658a">Machine learning</text><text x="580" y="239" font-size="14" fill="#5a7a94">forecasts &amp; predictions:</text><text x="580" y="258" font-size="14" fill="#5a7a94">what will happen</text></g>
          <g data-reveal><rect x="695" y="110" width="180" height="280" rx="10" fill="#f4dee6" stroke="#861f41" stroke-width="3"/><text x="785" y="143" font-weight="bold" fill="#861f41">Optimization</text><text x="785" y="166" font-size="14" fill="#9c5570">given all of that:</text><text x="785" y="185" font-size="14" fill="#9c5570">what should we do</text><rect x="712" y="205" width="146" height="34" rx="17" fill="#861f41"/><text x="785" y="228" font-size="15" fill="#fff" font-weight="bold">THIS COURSE</text></g>
          <g data-reveal><rect x="900" y="45" width="180" height="345" rx="10" fill="#edf6ef" stroke="#1a7d3c" stroke-width="2"/><text x="990" y="78" font-weight="bold" fill="#1a7d3c">AI</text><text x="990" y="101" font-size="14" fill="#4a7a58">autonomous</text><text x="990" y="120" font-size="14" fill="#4a7a58">decision making</text></g>
        </g>
      </svg><p class="l2-note" data-reveal><strong>Framing popularized by David Simchi-Levi (MIT):</strong> each level consumes the ones below it. Optimization turns data, statistics, and predictions into <strong>decisions</strong>.</p>`,
  },
  {
    id: "l2-09",
    page: 9,
    title: "You Can't Walk In and Start Optimizing",
    eyebrow: "A dose of realism",
    html: String.raw`
      <p class="l2-small">Imagine day one at a hospital: “I’m here to optimize your nurse schedules.” What must exist <em>before</em> that sentence makes sense?</p>
      <div class="l2-grid l2-grid--equal l2-small"><div class="l2-stack"><div class="l2-box"><h3>1 · The data</h3><p>Shift records, demand by hour, absence rates. No data, no model: every coefficient \(a_{ij},b_i,c_j\) must come from somewhere.</p></div><div class="l2-box" data-reveal><h3>2 · Statistics &amp; predictions</h3><p>Demand <em>forecasts</em>, no-show probabilities, length-of-stay estimates. Optimization consumes predictions; garbage in, confidently optimal garbage out.</p></div></div><div class="l2-stack"><div class="l2-box" data-reveal><h3>3 · Organizational readiness</h3><p>Processes stable enough to model, and people willing to act on the recommendation. A perfect schedule nobody follows optimizes nothing.</p></div><div class="l2-box l2-orange" data-reveal><h3>Some places are not there yet</h3><p>They need systems engineering, process design, and data infrastructure first. Optimization has its place on the maturity curve; it cannot be forced onto every organization at every stage.</p></div></div></div>
      <div class="l2-box l2-blue" data-reveal>As ISEs, you will often <em>build the lower rungs</em>—data pipelines, statistics, forecasts, process improvements—before optimization is possible. That is not a detour; it is the job.</div>`,
  },
  {
    id: "l2-10",
    page: 10,
    title: "The Modeling Workflow",
    html: String.raw`
      <ol class="l2-workflow"><li><strong>Problem analysis</strong><span>understand objectives and constraints</span></li><li data-reveal><strong>Modeling</strong><span>translate relationships into math</span></li><li data-reveal><strong>Model analysis</strong><span>feasibility, convexity, structure</span></li><li data-reveal><strong>Solution methods</strong><span>pick algorithms, compute solutions</span></li><li data-reveal><strong>Validation</strong><span>check assumptions, sensitivity, iterate</span></li></ol>
      <div class="l2-box l2-orange" data-reveal>Real modeling is an <strong>iterative loop</strong>, not a one-shot pipeline.</div>`,
  },
  {
    id: "l2-11",
    page: 11,
    title: "Notation — Matrices",
    eyebrow: "Setup · reading the language",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack"><p>An \(m\times n\) matrix \(A\) is a rectangular array of reals with <strong>\(m\) rows and \(n\) columns</strong>.</p>
        <div class="l2-equation">\[A=\begin{bmatrix}a_{11}&a_{12}&\cdots&a_{1n}\\a_{21}&a_{22}&\cdots&a_{2n}\\\vdots&\vdots&\ddots&\vdots\\a_{m1}&a_{m2}&\cdots&a_{mn}\end{bmatrix}\]</div>
        <div class="l2-box" data-reveal><strong>Index convention:</strong> \(a_{ij}\) lies in row \(i\), column \(j\)—row first.</div><div class="l2-box l2-orange" data-reveal>In this course: <strong>rows ↔ constraints</strong>, <strong>columns ↔ variables</strong>.</div></div>
        <div class="l2-widget"><p><strong>Try it:</strong> choose any entry of this \(3\times4\) matrix.</p><div class="l2-matrix-grid" data-matrix-grid role="grid" aria-label="Three by four matrix. Choose a cell to identify its indices."></div><p class="l2-widget-output" data-matrix-output role="status">Choose a cell…</p></div>
      </div>`,
    onMount: ({ slideElement, typesetMath, clearMath }) => mountMatrixAnatomy(slideElement, typesetMath, clearMath),
  },
  adapt(4, 12, { eyebrow: "Setup" }),
  adapt(5, 13),
  {
    id: "l2-14",
    page: 14,
    title: "The Inner Product x′y — the Course Workhorse",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack"><div class="l2-equation">\[x'y=\begin{bmatrix}x_1&\cdots&x_n\end{bmatrix}\begin{bmatrix}y_1\\\vdots\\y_n\end{bmatrix}=\sum_{i=1}^n x_iy_i\]</div>
        <div data-reveal>For \(x=(1,3)'\), \(y=(2,-1)'\): \[x'y=(1)(2)+(3)(-1)=-1.\]</div><div class="l2-box l2-orange" data-reveal><strong>Everything linear is an inner product:</strong> the objective is \(c'x\); each row is \(a_i'x\ge b_i\).</div></div>
        <div class="l2-widget"><canvas data-ip-canvas width="400" height="300" role="img" aria-label="Inner-product explorer with a fixed maroon vector a and a draggable blue vector x"></canvas><p data-ip-output class="l2-widget-output" role="status"></p><p class="l2-note">Drag the blue vector \(x\). The sign of \(a'x\) tells which side of the dashed perpendicular line it lies on.</p></div></div>`,
    onMount: ({ slideElement }) => mountInnerProductCanvas(slideElement),
  },
  {
    id: "l2-15",
    page: 15,
    title: "One Inequality a′x ≥ b = Half the Plane",
    eyebrow: "The one picture to internalize",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack"><ul><li>\(a'x=b\) is a line—a hyperplane in higher dimensions.</li><li data-reveal>The vector \(a\) is perpendicular to it and points where \(a'x\) grows.</li><li data-reveal>The inequality keeps one side: a halfplane or halfspace.</li><li data-reveal>Raising \(b\) slides the line in direction \(a\).</li></ul><div class="l2-box" data-reveal>An LP feasible set is the <strong>intersection of finitely many halfspaces</strong>. Flat sides and corners begin here.</div></div>
        <div class="l2-widget"><canvas data-hp-canvas width="430" height="330" role="img" aria-label="Interactive halfplane, normal vector a, movable test point P, and boundary a-transpose-x equals b"></canvas><label class="l2-range-row"><strong>\(b=\)</strong><output data-hp-b-value>1.0</output><input data-hp-b type="range" min="-3" max="3" step="0.1" value="1" aria-label="Right-hand side b"></label><p data-hp-output class="l2-widget-output" role="status"></p><p class="l2-note">Pointer: drag the tip of \(a\) to re-aim it; drag elsewhere to move P. Keyboard: focus the plot, use Arrow keys to move P, and Shift+Arrow keys to re-aim \(a\).</p></div></div>`,
    onMount: ({ slideElement }) => mountHalfplaneCanvas(slideElement),
  },
  {
    id: "l2-16",
    page: 16,
    title: "How to Plot a Line (and an Inequality) in 2D",
    eyebrow: "Toolkit · drawing pictures of LPs",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack l2-small"><p><strong>Take \(3x+5y=15\).</strong></p><div class="l2-box" data-reveal><strong>1 · Find intercepts.</strong> Set \(y=0\): \(x=5\). Set \(x=0\): \(y=3\).</div><div class="l2-box" data-reveal><strong>2 · Connect them.</strong> Two points determine the line.</div><div class="l2-box" data-reveal><strong>3 · Choose the side.</strong> The origin gives \(0\ge15\), false, so shade away from the origin.</div><div class="l2-box l2-orange" data-reveal>Feasible regions are stacks of shaded halfplanes.</div></div>
        <svg class="l2-figure" viewBox="0 0 440 330" role="img" aria-label="Line 3x plus 5y equals 15 through intercepts 5 comma 0 and 0 comma 3; the at-least side away from the origin is shaded"><line x1="50" y1="280" x2="420" y2="280" stroke="#555"/><line x1="50" y1="280" x2="50" y2="20" stroke="#555"/><polygon points="410,30 410,280 350,280 50,100 50,30" fill="rgba(134,31,65,.12)"/><line x1="350" y1="280" x2="50" y2="100" stroke="#861f41" stroke-width="3"/><circle cx="350" cy="280" r="6" fill="#861f41"/><text x="338" y="305" font-size="14" fill="#861f41">(5,0)</text><circle cx="50" cy="100" r="6" fill="#861f41"/><text x="60" y="96" font-size="14" fill="#861f41">(0,3)</text><text x="196" y="168" font-size="14" fill="#861f41" transform="rotate(-31 196 168)">3x + 5y = 15</text><text x="42" y="305" font-size="18" fill="#b3261e">✕ origin fails</text><text x="255" y="120" font-size="14" fill="#861f41" font-weight="bold">3x + 5y ≥ 15</text></svg>
      </div>`,
  },
  {
    id: "l2-17",
    page: 17,
    title: "Building a Feasible Region, One Inequality at a Time",
    eyebrow: "Toolkit · stacking inequalities",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack"><div class="l2-box"><strong>Each inequality keeps half the plane.</strong> Intersecting \(\{x:Ax\ge b\}\) carves out a <strong>polyhedron</strong>.</div><ul><li data-reveal>Every LP feasible set has this form.</li><li data-reveal>Flat sides, straight edges, sharp corners—never curved.</li><li data-reveal>Adding a constraint can only shrink the region or leave it unchanged.</li></ul><div class="l2-box l2-orange" data-reveal>A bounded polyhedron is a <strong>polytope</strong>.</div></div>
        <div class="l2-widget"><p><strong>Build one:</strong> start with the whole plane and carve.</p><canvas data-poly-builder width="450" height="300" role="img" aria-label="Feasible-region builder showing the cumulative intersection of halfspaces"></canvas><div class="l2-button-row"><button type="button" class="ns-slide-action" data-poly-add>Add a halfspace ✂</button><button type="button" class="ns-slide-action" data-poly-reset>Reset</button></div><p data-poly-output class="l2-widget-output" role="status">0 halfspaces · 0 corners</p></div></div>`,
    onMount: ({ slideElement, announce }) => mountPolyBuilder(slideElement, announce),
  },
  {
    id: "l2-18",
    page: 18,
    title: "Level Curves: Where c′x Is Constant",
    eyebrow: "Toolkit · seeing the objective",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><div><svg class="l2-figure" viewBox="0 0 400 300" role="img" aria-label="Four equally spaced parallel level lines c-transpose-x equals 3, 6, 9, and 12; vector c is perpendicular and points uphill"><line x1="30" y1="270" x2="380" y2="270" stroke="#999"/><line x1="30" y1="270" x2="30" y2="20" stroke="#999"/><g stroke="#33658a" stroke-width="2" stroke-dasharray="8 6"><line x1="30" y1="150" x2="180" y2="270"/><line x1="30" y1="78" x2="270" y2="270"/><line x1="66" y1="20" x2="360" y2="255"/><line x1="156" y1="20" x2="392" y2="209"/></g><g font-size="13" fill="#33658a"><text x="60" y="240">c′x=3</text><text x="120" y="212">c′x=6</text><text x="185" y="180">c′x=9</text><text x="255" y="150">c′x=12</text></g><path d="M150 160l52-65" stroke="#861f41" stroke-width="2.5"/><path d="M202 95l-8 1 4 7z" fill="#861f41"/><text x="208" y="88" font-size="16" fill="#861f41">c</text><text x="42" y="38" font-size="12.5" fill="#6d6d6d">parallel lines ⟂ c · equal spacing = equal cost steps</text></svg><p class="l2-note">In 2D, every value of \(c'x\) is a straight line. All level lines are parallel; equal spacing represents equal objective increments, and \(c\) points uphill.</p></div>
        <div data-reveal><svg class="l2-figure" viewBox="0 0 430 300" role="img" aria-label="Tilted plane z equals c-transpose-x; horizontal slices cast parallel level-curve shadows on the floor"><polygon points="90,255 260,313 390,261 220,203" fill="#f0ece6" stroke="#c9c1b8"/><polygon points="90,255 260,223 390,171 220,203" fill="rgba(134,31,65,.18)" stroke="#861f41" stroke-width="2"/><g stroke="#861f41"><line x1="146" y1="244" x2="276" y2="192"/><line x1="203" y1="234" x2="333" y2="182"/></g><g stroke="#33658a" stroke-dasharray="6 5"><line x1="146" y1="274" x2="276" y2="222"/><line x1="203" y1="294" x2="333" y2="242"/></g><text x="270" y="150" font-size="14" fill="#861f41">z=c′x (tilted plane)</text><text x="52" y="290" font-size="13" fill="#33658a">shadows = level curves</text></svg><p class="l2-note">In 3D, equal-height slices cast the same parallel contours.</p></div></div>
      <div class="l2-box l2-orange" data-reveal>A linear objective has no bumps or bowls: its level curves are parallel straight lines <strong>forever</strong>. Optimizing means sliding one level line as far as the feasible region allows.</div>`,
  },
  adapt(8, 19),
  adapt(9, 20),
  {
    id: "l2-21",
    page: 21,
    title: "Click-through: From ∑ to Ax",
    eyebrow: "Reading the notation",
    html: String.raw`
      <div class="l2-derive" data-derive>
        <div data-derive-step data-note="Concrete data: two constraints, three variables. Colors in Robert's version track the two rows."><div class="l2-equation">\[A=\begin{bmatrix}4&5&0\\2&4&1\end{bmatrix},\quad x=\begin{bmatrix}x_1\\x_2\\x_3\end{bmatrix},\quad b=\begin{bmatrix}200\\160\end{bmatrix}\]</div></div>
        <div data-derive-step data-note="Row 1 times column x: multiply matching entries and add."><div class="l2-equation">\[a_1'x=4x_1+5x_2+0x_3=\sum_{j=1}^3a_{1j}x_j\]</div></div>
        <div data-derive-step data-note="The same recipe for row 2."><div class="l2-equation">\[a_2'x=2x_1+4x_2+x_3=\sum_{j=1}^3a_{2j}x_j\]</div></div>
        <div data-derive-step data-note="Stack the two numbers: Ax ≥ b means both component inequalities hold."><div class="l2-equation">\[Ax=\begin{bmatrix}4x_1+5x_2\\2x_1+4x_2+x_3\end{bmatrix},\quad Ax\ge b\iff\begin{cases}4x_1+5x_2\ge200\\2x_1+4x_2+x_3\ge160\end{cases}\]</div></div>
        <div class="l2-derive-controls"><button type="button" class="ns-slide-action" data-derive-prev>◀ Prev</button><div data-derive-dots aria-label="Derivation steps"></div><button type="button" class="ns-slide-action" data-derive-next>Next step ▶</button></div><p data-derive-note class="l2-widget-output" role="status"></p>
      </div>`,
    onMount: (context) => mountDerivationPlayer(context),
  },
  {
    id: "l2-22",
    page: 22,
    title: "Basic Definitions",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-stack"><ul><li>A <strong>feasible solution</strong> satisfies every constraint.</li><li data-reveal>The <strong>feasible set</strong> contains all of them; empty means infeasible.</li><li data-reveal>The <strong>cost</strong> of feasible \(x\) is \(c'x\).</li><li data-reveal>An <strong>optimal solution</strong> \(x^*\) is feasible and obeys \(c'x^*\le c'x\) for every feasible \(x\).</li></ul><div class="l2-box l2-orange" data-reveal>Feasible ≠ optimal. Feasibility is pass/fail; optimality is winning the entire competition.</div></div>
        <svg class="l2-figure" viewBox="0 0 430 330" role="img" aria-label="Polygonal feasible set with a feasible interior point, an infeasible outside point, and an optimal corner; dashed equal-cost lines descend toward the optimum"><g stroke="#e5751f" stroke-dasharray="7 6"><line x1="10" y1="150" x2="290" y2="320"/><line x1="60" y1="90" x2="400" y2="296"/><line x1="120" y1="40" x2="430" y2="228"/></g><polygon points="70,250 100,110 210,64 320,120 300,240 190,282" fill="rgba(134,31,65,.13)" stroke="#861f41" stroke-width="2.5"/><text x="150" y="180" font-size="15" fill="#861f41">feasible set</text><circle cx="235" cy="200" r="7" fill="#1a7d3c"/><text x="248" y="205" font-size="14" fill="#1a7d3c">feasible</text><text x="366" y="60" font-size="22" fill="#b3261e">✕</text><text x="300" y="42" font-size="14" fill="#b3261e">infeasible</text><text x="60" y="262" font-size="24" fill="#1a7d3c">★</text><text x="30" y="292" font-size="14" fill="#1a7d3c">optimal</text></svg></div>`,
    checkpoint: checkpoint11,
  },
  adapt(12, 23),
  adapt(13, 24),
  {
    id: "l2-25",
    page: 25,
    title: "Mathematical Programs",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><div><h3>General form</h3><div class="l2-equation">\[\begin{aligned}\min/\max\quad&f(x_1,\ldots,x_n)\\\text{s.t.}\quad&g_i(x_1,\ldots,x_n)\{\le,\ge,=\}b_i\\&x_j\ge0\end{aligned}\]</div></div><ul><li data-reveal><strong>Decision variables</strong> \(x_j\)—things we control</li><li data-reveal><strong>Constraints</strong>—structural, operational, technological limits</li><li data-reveal><strong>Objective</strong> \(f\)—the criterion to optimize</li><li data-reveal><strong>Feasible solution</strong>—an \(x\) satisfying every constraint</li></ul></div>
      <div class="l2-box l2-orange" data-reveal>In this course, \(f\) and every \(g_i\) are <strong>linear</strong>: linear programming.</div>`,
    checkpoint: checkpointPrograms,
  },
  {
    id: "l2-26",
    page: 26,
    title: "LP is the Master Key",
    eyebrow: "Why study LP so deeply?",
    html: String.raw`
      <div class="l2-master-layout"><div class="l2-master-key">Linear<br>Programming<span>geometry · simplex · duality</span></div><div class="l2-route-grid"><article class="l2-box" data-reveal><h3>→ Integer programming</h3><p>Branch-and-bound searches with an LP relaxation at every node.</p></article><article class="l2-box" data-reveal><h3>→ Nonlinear optimization</h3><p>Gradients, cutting planes, and Frank–Wolfe use local linear models.</p></article><article class="l2-box" data-reveal><h3>→ Network flows</h3><p>Shortest path, max flow, and assignment are structured LPs.</p></article><article class="l2-box" data-reveal><h3>→ Duality & prices</h3><p>Shadow prices, sensitivity, and market design live inside LP.</p></article></div></div><div class="l2-box" data-reveal><strong>Master LP and you hold the key to all of it.</strong> That is why this course goes deep instead of wide.</div>`,
    checkpoint: checkpointRelaxation,
  },
  {
    id: "l2-27",
    page: 27,
    title: "The Axioms of Linear Programming",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><ol><li data-reveal><strong>Proportionality</strong>—contribution scales with activity: \(c_jx_j\), \(a_{ij}x_j\).</li><li data-reveal><strong>Additivity</strong>—effects add; no cross terms such as \(x_1x_3\). Together, these two give linearity.</li><li data-reveal><strong>Divisibility</strong>—fractional values such as \(x_j=2.32\) are allowed.</li><li data-reveal><strong>Certainty</strong>—all data \(A,b,c\) are known exactly.</li></ol><div data-reveal><div class="l2-box l2-orange"><h3>Relax an axiom → a new field</h3><ul><li>drop proportionality/additivity → nonlinear programming</li><li>drop divisibility → integer programming</li><li>drop certainty → stochastic programming</li></ul></div><p class="l2-punchline" data-reveal>LP is the backbone; the other fields build on it.</p></div></div>`,
    checkpoint: checkpointAxioms,
  },
  {
    id: "l2-28",
    page: 28,
    title: "Warm-up: Is it Linear?",
    html: String.raw`
      <p>For each expression: allowed in an LP as written, not allowed, or LP-representable after a trick?</p>
      <div class="l2-widget l2-quiz" data-linearity-quiz><div data-quiz-question class="l2-quiz-question" aria-live="polite"></div><div class="l2-button-row"><button type="button" class="ns-slide-action" data-quiz-choice="A">Linear ✓</button><button type="button" class="ns-slide-action" data-quiz-choice="B">Not allowed in LP</button><button type="button" class="ns-slide-action" data-quiz-choice="C">LP-representable with a trick</button></div><p data-quiz-feedback class="l2-widget-output" role="status"></p><div class="l2-button-row"><button type="button" class="ns-slide-action" data-quiz-next>Next question ▸</button><span data-quiz-score>Score: 0 / 0</span></div></div>`,
    onMount: ({ slideElement, typesetMath, clearMath, announce }) => mountLinearityQuiz(slideElement, typesetMath, clearMath, announce),
  },
  {
    id: "l2-29",
    page: 29,
    title: "From Words to Math: The Three Questions",
    eyebrow: "§1.2 · Modeling · from the course text",
    html: String.raw`
      <p>A solver knows nothing about cakes, trucks, or hospitals. Ask—in order:</p><div class="l2-three"><article class="l2-box" data-reveal><h3>1 · What am I deciding?</h3><p>→ decision variables<br><span>“How many cakes?” \(x\ge0\)</span></p></article><article class="l2-box" data-reveal><h3>2 · What are the limits?</h3><p>→ constraints<br><span>“Only 50 lb flour.” \(2x+3y\le50\)</span></p></article><article class="l2-box" data-reveal><h3>3 · What makes a plan best?</h3><p>→ one objective<br><span>“Maximize profit.” \(\max 4x+5y\)</span></p></article></div>
      <table class="l2-table" data-reveal><thead><tr><th>Real world</th><th>OR concept</th><th>Math</th></tr></thead><tbody><tr><td>How many trucks?</td><td>decision variable</td><td>\(x\in\mathbb Z_{\ge0}\)</td></tr><tr><td>Cannot spend over $1M</td><td>budget constraint</td><td>\(50000x\le1000000\)</td></tr><tr><td>Want the cheapest plan</td><td>objective</td><td>\(\min c'x\)</td></tr></tbody></table><p class="l2-note" data-reveal>Answer in plain English first; the math is mostly mechanical from there.</p>`,
  },
  {
    id: "l2-30",
    page: 30,
    title: "Modeling Pitfalls (Everybody Makes These)",
    eyebrow: "§1.2 · Modeling · from the course text",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><div class="l2-stack"><div class="l2-box" data-reveal><h3>Forgetting nonnegativity</h3><p>\(x_C,x_K\in\mathbb R\) → \(x_C,x_K\ge0\). Otherwise a solver may choose −1000 if it helps.</p></div><div class="l2-box" data-reveal><h3>Wrong objective direction</h3><p>min profit → max profit, equivalently min negative profit.</p></div></div><div class="l2-stack"><div class="l2-box" data-reveal><h3>Constraint vs objective</h3><p>“At least,” “at most,” and “must be” create constraints. A model has many constraints but one objective.</p></div><div class="l2-box" data-reveal><h3>Solve then round</h3><p>Rounding \(x=3.7\) to 4 may be infeasible or suboptimal. Model a MIP from the start.</p></div></div></div>
      <p class="l2-note" data-reveal>Practice: <a href="https://open-optimization.github.io/open-optimization-or-book/visualizations" target="_blank" rel="noopener">Open Optimization visualizations</a>.</p>`,
  },
  {
    id: "l2-31",
    page: 31,
    title: "Worked Example: Sam's Bakery",
    eyebrow: "§1.2 · Worked example · from the course text",
    html: String.raw`
      <div class="l2-box l2-small"><strong>The story.</strong> Sam chooses chocolate cakes and cookie trays. A cake earns $4 and uses 3 cups flour + 2 eggs; a tray earns $3 and uses 2 cups + 1 egg. There are 24 cups flour, 12 eggs, and demand for at most 5 cakes.</div>
      <div class="l2-grid l2-grid--equal"><div data-reveal><h3>Step 1 · decisions</h3><div class="l2-equation">\[x_C=\text{cakes},\qquad x_K=\text{cookie trays},\qquad x_C,x_K\ge0\]</div><p class="l2-note">Allow real values for now—the LP is easier. We will revisit <strong>integrality</strong>; negative production is never allowed.</p></div><div data-reveal><h3>Step 2 · limits</h3><div class="l2-equation">\[\begin{aligned}3x_C+2x_K&\le24&&\text{ flour}\\2x_C+x_K&\le12&&\text{ eggs}\\x_C&\le5&&\text{ demand}\end{aligned}\]</div></div></div><div class="l2-box l2-orange" data-reveal>Audit the <strong>units</strong>: flour is cups on both sides. Different units mean a wrong constraint.</div>`,
  },
  {
    id: "l2-32",
    page: 32,
    title: "Sam's Bakery: Full Model, Solution, Sanity Check",
    eyebrow: "§1.2 · Worked example · from the course text",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><div><h3>Step 3 · goal and model</h3><div class="l2-equation">\[\begin{aligned}\max\quad&4x_C+3x_K\\\text{s.t.}\quad&3x_C+2x_K\le24\\&2x_C+x_K\le12\\&x_C\le5\\&x_C,x_K\ge0\end{aligned}\]</div><p data-reveal>A solver handles this in microseconds.</p></div><div data-reveal><h3>Step 4 · solve and check</h3><p>Optimum: \(x_C=4,x_K=4\), profit $28.</p><ul><li>Flour: \(20\le24\)—4 cups slack</li><li>Eggs: \(12\le12\)—<strong>binding</strong></li><li>Cakes: \(4\le5\)—1 cake slack</li></ul><div class="l2-box" data-reveal>Eggs are the bottleneck. Asking what binds begins sensitivity analysis.</div></div></div>`,
  },
  {
    id: "l2-33",
    page: 33,
    title: "Sam's Bakery in Code",
    eyebrow: "§1.2 · Worked example · looking ahead to software",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><pre class="l2-code" aria-label="Gurobi Python model for Sam's Bakery">import gurobipy as gp
from gurobipy import GRB

m = gp.Model("bakery")

# Decision variables (>= 0 by default)
xC = m.addVar(name="cakes")
xK = m.addVar(name="cookie_trays")

# Objective
m.setObjective(4*xC + 3*xK, GRB.MAXIMIZE)

# Constraints
m.addConstr(3*xC + 2*xK &lt;= 24, name="flour")
m.addConstr(2*xC + 1*xK &lt;= 12, name="eggs")
m.addConstr(xC &lt;= 5,          name="demand")

m.optimize()
print(xC.X, xK.X, m.ObjVal)   # 4.0 4.0 28.0</pre><div class="l2-stack"><div class="l2-box" data-reveal>Every modeling-library line mirrors one mathematical-model line.</div><div class="l2-box l2-orange" data-reveal><strong>Name variables → one inequality per limit → objective → code.</strong> If you cannot state the model in plain English, you are not ready to code it.</div><p class="l2-note" data-reveal>This course uses Gurobi through <code>gurobipy</code> under its free academic license.</p></div></div>`,
  },
  adapt(15, 34, { eyebrow: "§1.2 · Examples of LP models", checkpoint: checkpointProduction }),
  adapt(16, 35, {
    html: legacySlides[15].html
      .replace('<output data-value-for="pa">40</output>', '<output data-value-for="pa">30</output>')
      .replace('value="40" data-prod="pa"', 'value="30" data-prod="pa"')
      .replace('<output data-value-for="pb">55</output>', '<output data-value-for="pb">45</output>')
      .replace('value="55" data-prod="pb"', 'value="45" data-prod="pb"')
      .replace('<output data-value-for="labor">200</output>', '<output data-value-for="labor">278</output>')
      .replace('value="200" data-prod="labor"', 'value="278" data-prod="labor"')
      .replace('<output data-value-for="material">160</output>', '<output data-value-for="material">186</output>')
      .replace('value="160" data-prod="material"', 'value="186" data-prod="material"')
      .replace(
        'Optimal plan: make 0 of A and 40 of B; profit = $2,200; binding: material.',
        'Optimal plan: make 30.3 of A and 31.3 of B; profit = $2,320; binding: labor + material. Leftover: 0 h labor, 0 kg material.',
      )
      .replace(
        'data-prod-region points="83,329 311,329 83,158"',
        'data-prod-region points="82.78,328.67 399.39,328.67 220.96,194.98 82.78,130.27"',
      )
      .replace(
        'data-prod-objective d="M60 317L470 65"',
        'data-prod-objective d="M60 94.47L469.24 350"',
      )
      .replace(
        '<g data-prod-corners fill="#263238"><circle r="6"/><circle r="6"/><circle r="6"/><circle r="6"/></g>',
        '<g data-prod-corners fill="#263238"><circle cx="82.78" cy="328.67" r="6"/><circle cx="399.39" cy="328.67" r="6"/><circle cx="82.78" cy="130.27" r="6"/><circle cx="220.96" cy="194.98" r="6"/></g>',
      )
      .replace('data-prod-optimum cx="83" cy="158"', 'data-prod-optimum cx="220.96" cy="194.98"')
      .replace('data-prod-optimum-label x="100" y="145"', 'data-prod-optimum-label x="234.96" y="182.98"'),
  }),
  adapt(17, 36, { eyebrow: "§1.2 · From the course text" }),
  adapt(18, 37, { eyebrow: "Your turn · 2 minutes" }),
  adapt(19, 38),
  adapt(20, 39),
  adapt(21, 40),
  adapt(22, 41),
  adapt(23, 42),
  adapt(24, 43, { eyebrow: "§1.4 · Geometry" }),
  {
    id: "l2-44",
    page: 44,
    title: "2D LP Grapher",
    className: "l2-grapher-slide",
    html: String.raw`
      <div class="l2-grapher"><div class="l2-widget"><canvas data-g-canvas width="600" height="470" role="img" aria-label="Interactive two-dimensional LP plot with feasible region, constraints, objective line, direction vector, corners, and current optimum"></canvas><p class="l2-note">Drag on the plot to re-aim the objective vector \(c\).</p></div>
        <div class="l2-grapher-controls"><label><strong>Preset</strong><select data-g-preset><option value="ex16">Example 1.6 (min −x₁−x₂)</option><option value="prod">Production planning (max)</option><option value="caseA">Ex. 1.8(a): unique optimum</option><option value="caseB1">Ex. 1.8(b): multiple, bounded</option><option value="caseB2">Ex. 1.8(b′): multiple, unbounded</option><option value="caseC">Ex. 1.8(c): objective unbounded</option><option value="caseD">Ex. 1.8(d): infeasible</option></select></label>
          <div class="l2-widget l2-g-objective"><strong>Objective:</strong><output data-g-sense>min</output><label><input data-g-c1 type="number" step="0.5" value="-1" aria-label="Objective coefficient c1"> x₁</label><span>+</span><label><input data-g-c2 type="number" step="0.5" value="-1" aria-label="Objective coefficient c2"> x₂</label><button type="button" class="ns-slide-action" data-g-flip>min ⇄ max</button><button type="button" class="ns-slide-action" data-g-walk>▶ simplex walk</button><label class="l2-g-level">Objective line \(c'x=t\)<input data-g-t type="range" min="0" max="100" value="50" aria-label="Objective level t"></label></div>
          <div class="l2-widget l2-g-constraints"><div class="l2-g-constraints-head"><span><strong>Constraints</strong> \(a x_1+b x_2\le/\ge\text{rhs}\) · <output data-g-count aria-live="polite">4</output>/6</span><button type="button" class="ns-slide-action" data-g-add>+ add</button></div><div data-g-constraints role="group" tabindex="0" aria-label="Editable constraints, maximum six"></div></div><p data-g-status class="l2-widget-output" role="status"></p><table data-g-vertices class="l2-table l2-vertex-table" aria-label="Feasible corners and objective values"></table>
        </div></div>`,
    onMount: ({ slideElement, announce }) => mountLPGrapher(slideElement, announce),
  },
  adapt(26, 45),
  {
    id: "l2-46",
    page: 46,
    title: "Linear · Mixed-Integer · Nonlinear",
    eyebrow: "One picture · three flavors",
    className: "l2-triptych-slide",
    html: String.raw`
      <div class="l2-triptych"><article class="l2-widget"><canvas data-tri-lp width="368" height="290" role="img" aria-label="Linear program: polygon, objective contours, and optimal corner"></canvas><p><strong>Linear:</strong> flat sides and costs; an optimum sits at a <strong>corner</strong>.</p></article><article class="l2-widget"><canvas data-tri-mip width="368" height="290" role="img" aria-label="Mixed-integer program: polygon and feasible lattice points; relaxation toggle overlays the LP optimum"></canvas><p><strong>Mixed-integer:</strong> only lattice points count. <button type="button" class="ns-slide-action" data-tri-relax>Relax integrality</button></p></article><article class="l2-widget"><canvas data-tri-nlp width="368" height="290" role="img" aria-label="Nonlinear program: ellipse, curved contours, and optional tangent LP cuts"></canvas><p><strong>Nonlinear:</strong> curved boundary and costs. <button type="button" class="ns-slide-action" data-tri-cuts>Approximate by LPs</button></p></article></div>
      <div class="l2-box l2-orange" data-reveal><strong>Punchline:</strong> dropping integrality turns a MIP into an LP relaxation; tangent lines turn curved regions into LP outer approximations. <strong>LP is the common denominator.</strong></div>`,
    onMount: ({ slideElement, announce }) => mountTriptych(slideElement, announce),
    checkpoint: checkpointFlavors,
  },
  {
    id: "l2-47",
    page: 47,
    title: "Why Brute Force Fails",
    html: String.raw`
      <p>Assign \(n\) people to \(n\) jobs, one each. There are \(n!\) assignments. Try all of them?</p><div class="l2-widget"><label class="l2-range-row"><strong>\(n=\)</strong><input data-bf-slider type="range" min="2" max="70" value="10" aria-label="Number of people n"><output data-bf-n>10</output></label><div class="l2-grid l2-grid--equal"><div class="l2-box l2-blue"><h3>Number of assignments</h3><output data-bf-factorial class="l2-big-number">3,628,800</output></div><div class="l2-box l2-orange"><h3>At 10¹² checks/second</h3><output data-bf-time class="l2-big-number">&lt; 1 second</output></div></div><p data-bf-verdict class="l2-widget-output" role="status"></p></div><p class="l2-punchline" data-reveal><strong>Better modeling and algorithms beat brute force.</strong></p>`,
    onMount: ({ slideElement }) => mountBruteForce(slideElement),
  },
  {
    id: "l2-48",
    page: 48,
    title: "Example 1.7 in 3D — Spin It Yourself",
    eyebrow: "§1.4 · one dimension up",
    html: String.raw`
      <div class="l2-text-visual"><div class="l2-widget"><canvas data-cube-canvas width="500" height="420" role="img" aria-label="Rotatable unit cube with three objective level-plane slices and the optimal corner 1 comma 1 comma 1"></canvas><p class="l2-note">Drag to rotate. Orange slices are \(x_1+x_2+x_3=t\) sweeping toward the far corner.</p></div><div class="l2-stack"><div class="l2-equation">\[\begin{aligned}\min\quad&-x_1-x_2-x_3\\\text{s.t.}\quad&0\le x_i\le1,\quad i=1,2,3\end{aligned}\]</div><div class="l2-box" data-reveal>The unit cube has 8 corners, 12 edges, 6 faces. Sliding the level planes ends at \((1,1,1)\), cost −3.</div><div class="l2-box l2-orange" data-reveal>The \(n\)-cube has \(2^n\) corners—more than a googol by \(n=333\). Simplex finds a best corner without visiting them all.</div></div></div>`,
    onMount: ({ slideElement }) => mountCube(slideElement),
    printHtml: String.raw`<div class="l2-text-visual"><div class="l2-equation">\[\min\{-x_1-x_2-x_3:0\le x_i\le1\}\]</div><div class="l2-stack"><div class="l2-box">The feasible set is a unit cube. Parallel level planes sweep toward \((1,1,1)\), where the cost is −3.</div><div class="l2-box l2-orange">The \(n\)-cube has \(2^n\) corners; simplex avoids brute-force enumeration.</div></div></div>`,
  },
  adapt(28, 49),
  adapt(29, 50),
  {
    id: "l2-51",
    page: 51,
    title: "Click-through: Ex. 1.2 → General Form Ax ≥ b",
    html: String.raw`
      <div class="l2-derive" data-derive><div data-derive-step data-note="Start with the mixed ≤, =, ≥ and sign constraints."><div class="l2-equation">\[\begin{aligned}\min\;&2x_1-x_2+4x_3\\\text{s.t. }&x_1+x_2+x_4\le2\\&3x_2-x_3=5\\&x_3+x_4\ge3\\&x_1\ge0,\ x_3\le0\end{aligned}\]</div></div><div data-derive-step data-note="Multiply the ≤ row by −1."><div class="l2-equation">\[x_1+x_2+x_4\le2\Longrightarrow -x_1-x_2-x_4\ge-2\]</div></div><div data-derive-step data-note="Split equality into opposing inequalities."><div class="l2-equation">\[3x_2-x_3\ge5,\qquad -3x_2+x_3\ge-5\]</div></div><div data-derive-step data-note="Sign constraints are also ≥ rows."><div class="l2-equation">\[x_1\ge0,\qquad -x_3\ge0\]</div></div><div data-derive-step data-note="Stack all six rows into A and b."><div class="l2-equation">\[A=\begin{bmatrix}-1&-1&0&-1\\0&3&-1&0\\0&-3&1&0\\0&0&1&1\\1&0&0&0\\0&0&-1&0\end{bmatrix},\quad b=\begin{bmatrix}-2\\5\\-5\\3\\0\\0\end{bmatrix},\quad c=\begin{bmatrix}2\\-1\\4\\0\end{bmatrix}\]</div></div><div class="l2-derive-controls"><button type="button" class="ns-slide-action" data-derive-prev>◀ Prev</button><div data-derive-dots></div><button type="button" class="ns-slide-action" data-derive-next>Next step ▶</button></div><p data-derive-note class="l2-widget-output" role="status"></p></div>`,
    onMount: (context) => mountDerivationPlayer(context),
  },
  adapt(31, 52),
  adapt(32, 53),
  adapt(33, 54),
  {
    id: "l2-55",
    page: 55,
    title: "Click-through: Ex. 1.4 → Standard Form",
    html: String.raw`
      <div class="l2-derive" data-derive><div data-derive-step data-note="Original: one ≥ row, one equality, x1 nonnegative, x2 free."><div class="l2-equation">\[\begin{aligned}\min\;&2x_1+4x_2\\\text{s.t. }&x_1+x_2\ge3\\&3x_1+2x_2=14\\&x_1\ge0\end{aligned}\]</div></div><div data-derive-step data-note="Split the free variable into nonnegative parts."><div class="l2-equation">\[x_2=x_2^+-x_2^-,\qquad x_2^+,x_2^-\ge0\]</div></div><div data-derive-step data-note="Subtract a nonnegative surplus variable from the ≥ row."><div class="l2-equation">\[x_1+x_2^+-x_2^- -x_3=3,\qquad x_3\ge0\]</div></div><div data-derive-step data-note="All rows are equalities and all variables nonnegative."><div class="l2-equation">\[\begin{aligned}\min\;&2x_1+4x_2^+-4x_2^-\\\text{s.t. }&x_1+x_2^+-x_2^--x_3=3\\&3x_1+2x_2^+-2x_2^-=14\\&x_1,x_2^+,x_2^-,x_3\ge0\end{aligned}\]</div></div><div data-derive-step data-note="Feasible solutions map in both directions with equal cost."><div class="l2-equation">\[(6,-2)\mapsto(6,0,2,1),\qquad(8,1,6,0)\mapsto(8,-5)\]</div></div><div class="l2-derive-controls"><button type="button" class="ns-slide-action" data-derive-prev>◀ Prev</button><div data-derive-dots></div><button type="button" class="ns-slide-action" data-derive-next>Next step ▶</button></div><p data-derive-note class="l2-widget-output" role="status"></p></div>`,
    onMount: (context) => mountDerivationPlayer(context),
  },
  adapt(35, 56),
  adapt(36, 57),
  {
    id: "l2-58",
    page: 58,
    title: "Click-through: the “Epigraph Trick”",
    html: String.raw`
      <div class="l2-derive" data-derive><div data-derive-step data-note="The maximum makes the objective nonlinear as written."><div class="l2-equation">\[\min_x\max_{i=1,\ldots,m}(c_i'x+d_i)\quad\text{s.t. }Ax\ge b\]</div></div><div data-derive-step data-note="For fixed x, the maximum is the smallest z above every affine piece."><div class="l2-equation">\[\max_i(c_i'x+d_i)=\min\{z:z\ge c_i'x+d_i\ \forall i\}\]</div></div><div data-derive-step data-note="Introduce z and move the maximum into linear constraints."><div class="l2-equation">\[\begin{aligned}\min_{x,z}\;&z\\\text{s.t. }&z\ge c_i'x+d_i\quad\forall i\\&Ax\ge b\end{aligned}\]</div></div><div data-derive-step data-note="At optimum, minimization squeezes z down onto the maximum."><div class="l2-equation">\[z^*=\max_i(c_i'x^*+d_i)\]</div></div><div data-derive-step data-note="A concrete min-max objective becomes one extra variable and two rows."><div class="l2-equation">\[\min\max\{2x_1+4x_2,2x_1+x_2\}\Longrightarrow\min\{z:z\ge2x_1+4x_2,\ z\ge2x_1+x_2\}\]</div></div><div class="l2-derive-controls"><button type="button" class="ns-slide-action" data-derive-prev>◀ Prev</button><div data-derive-dots></div><button type="button" class="ns-slide-action" data-derive-next>Next step ▶</button></div><p data-derive-note class="l2-widget-output" role="status"></p></div>`,
    onMount: (context) => mountDerivationPlayer(context),
  },
  {
    id: "l2-59",
    page: 59,
    title: "Click-through: Absolute Values",
    html: String.raw`
      <div class="l2-derive" data-derive><div data-derive-step data-note="Absolute values make the objective nonlinear as written."><div class="l2-equation">\[\min\sum_{i=1}^n c_i|x_i|\quad\text{s.t. }Ax\ge b,\quad c_i\ge0\]</div></div><div data-derive-step data-note="|xi| is the smallest zi above both xi and −xi."><div class="l2-equation">\[|x_i|=\min\{z_i:x_i\le z_i,\ -x_i\le z_i\}\]</div></div><div data-derive-step data-note="Introduce one zi per coordinate."><div class="l2-equation">\[\begin{aligned}\min\;&\sum_i c_i z_i\\\text{s.t. }&Ax\ge b\\&x_i\le z_i,\ -x_i\le z_i\quad\forall i\end{aligned}\]</div></div><div data-derive-step data-note="The squeeze argument needs minimization and nonnegative ci."><div class="l2-box l2-orange"><strong>Warning:</strong> this needs \(c_i\ge0\) and minimization.</div></div><div data-derive-step data-note="One absolute value needs one auxiliary variable and two rows; the original constraint remains in the reformulation."><div class="l2-equation">\[\begin{aligned}\min\;&2|x_1|+x_2\\\text{s.t. }&x_1+x_2\ge4\end{aligned}\quad\Longrightarrow\quad\begin{aligned}\min\;&2z_1+x_2\\\text{s.t. }&x_1+x_2\ge4\\&x_1\le z_1,\ -x_1\le z_1\end{aligned}\]</div></div><div class="l2-derive-controls"><button type="button" class="ns-slide-action" data-derive-prev>◀ Prev</button><div data-derive-dots></div><button type="button" class="ns-slide-action" data-derive-next>Next step ▶</button></div><p data-derive-note class="l2-widget-output" role="status"></p></div>`,
    onMount: (context) => mountDerivationPlayer(context),
  },
  adapt(39, 60),
  {
    id: "l2-61",
    page: 61,
    title: "Explore More (self-study)",
    eyebrow: "Keep playing after class",
    html: String.raw`
      <div class="l2-grid l2-grid--equal"><div><h3>Live demo library</h3><p><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations" target="_blank" rel="noopener">Open Optimization visualizations</a></p><ul><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#modeling-intro" target="_blank" rel="noopener">#modeling-intro</a> words → math tutorial</li><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#objective-slider" target="_blank" rel="noopener">#objective-slider</a> objective level-line slider</li><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#concept-quiz" target="_blank" rel="noopener">#concept-quiz</a> 20-question LP concept quiz</li><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#simplex-dictionary" target="_blank" rel="noopener">#simplex-dictionary</a> pivot the bakery by hand (coming in Chapter 3)</li></ul></div><div data-reveal><h3>Further interactive explorers</h3><p>The reference deck bundles three offline explorers. This course page preserves all three topics through the corresponding public resources:</p><ul><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#lp-graphical-method" target="_blank" rel="noopener">Graphical method explorer</a></li><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#lp-duality-explorer" target="_blank" rel="noopener">Duality explorer</a> (Chapter 4)</li><li><a href="https://open-optimization.github.io/open-optimization-or-book/visualizations#lp-sensitivity-explorer" target="_blank" rel="noopener">Sensitivity explorer</a> (Chapter 5)</li></ul><div class="l2-box">Course text: Hildebrand, <cite>Mathematical Programming and Operations Research</cite>—free and open through <a href="https://github.com/open-optimization" target="_blank" rel="noopener">Open Optimization</a>.</div></div></div>`,
  },
  adapt(41, 62, {
    html: String.raw`
      <ul class="l2-summary-list"><li>LPs come in many shapes; <strong>general form</strong> \(Ax\ge b\) and <strong>standard form</strong> \(Ax=b,\ x\ge0\) capture them all.</li><li data-reveal>Transformations use sign-splitting for free variables and slack/surplus variables—with a precise notion of <strong>equivalence</strong>.</li><li data-reveal>Production, diet, capacity expansion, and scheduling all become LPs; choosing the variables is itself a design decision.</li><li data-reveal>Piecewise-linear convex objectives—max-of-affine terms, \(|x|\), and residual fitting—reduce to LP through the <strong>epigraph trick</strong>.</li><li data-reveal>Geometrically, optimal solutions live at <strong>corners</strong>—the idea on which the rest of the course is built.</li></ul><aside class="l2-callout" data-reveal><h3>Next</h3><p>Proofs bootcamp &amp; LaTeX, then the geometry of polyhedra (BT Chapter 2).</p></aside>`,
  }),
  {
    id: "l2-63",
    page: 63,
    title: "Applications in Depth: Airlines & Energy",
    eyebrow: "Appendix · the Explore-button write-ups, for your handout",
    className: "l2-appendix-slide",
    html: `<div class="l2-app-pair">${applicationCard({
      title: "Airlines", flavor: "Discrete · among the largest IPs solved anywhere",
      intro: "Airlines re-plan constantly: crews, aircraft, prices. Crew scheduling alone involves millions of yes/no choices.",
      decisions: ["Which crew pairing to fly (yes/no each)", "Which aircraft type serves each route", "How many seats to sell at each fare"],
      constraints: ["Every flight covered by exactly one crew", "FAA duty & rest rules; return to base", "Fleet counts, maintenance windows, gates"],
      objectives: ["Minimize crew + fuel cost", "Maximize ticket revenue", "Minimize delay propagation"],
      conclusion: "integer programming at massive scale, solved by branch-and-bound over LP relaxations.",
      data: "full flight schedule, crew cost rules, historical demand by route & fare class, disruption statistics.",
    })}${applicationCard({
      title: "Energy", flavor: "Mixed continuous/discrete · re-solved every 5 minutes",
      intro: "Grid operators decide which plants run and at what level—a fresh optimization every few minutes, national scale.",
      decisions: ["Unit on/off status each hour (discrete)", "Output level of each running unit (continuous)", "Reserve capacity held back"],
      constraints: ["Supply = demand, every moment, everywhere", "Ramp-rate limits; min up/down times", "Transmission line capacities"],
      objectives: ["Minimize fuel + startup cost", "Minimize emissions (or price them)"],
      conclusion: "unit commitment = MIP; dispatch = LP; true AC power physics = nonlinear (usually linearized!).",
      data: "demand forecasts (ML!), generator cost curves, outage statistics, network parameters.",
    })}</div>`,
  },
  {
    id: "l2-64",
    page: 64,
    title: "Applications in Depth: Logistics & Manufacturing",
    eyebrow: "Appendix · the Explore-button write-ups, for your handout",
    className: "l2-appendix-slide",
    html: `<div class="l2-app-pair">${applicationCard({
      title: "Logistics", flavor: "Discrete · routing and location",
      intro: "Every package rides a chain of optimized decisions: which warehouse, which truck, which route, which order of stops.",
      decisions: ["Route and stop sequence per vehicle", "Package-to-vehicle assignment", "Where to place warehouses (long-run)"],
      constraints: ["Vehicle capacity; driver hour limits", "Delivery time windows", "Every package delivered exactly once"],
      objectives: ["Minimize miles / fuel / cost", "Maximize on-time percentage"],
      conclusion: "vehicle routing = hard combinatorial IP; heavily attacked with LP bounds + heuristics.",
      data: "demand by location, travel-time predictions, cost models, service-level statistics.",
    })}${applicationCard({
      title: "Manufacturing", flavor: "Linear at heart · the classic LP habitat",
      intro: "The original LP applications: what to make, how to cut, what to blend—the production examples in this course.",
      decisions: ["Quantity of each product", "Which cutting patterns to use", "Blend fractions (fuels, feeds, alloys)"],
      constraints: ["Machine & labor capacity", "Raw material availability", "Quality/recipe specifications, demand"],
      objectives: ["Maximize profit", "Minimize waste or cost"],
      conclusion: "mostly genuinely linear—proportional, additive, divisible. LP's home turf since the 1940s.",
      data: "bills of materials, capacity measurements, cost accounting, demand forecasts.",
    })}</div>`,
  },
  {
    id: "l2-65",
    page: 65,
    title: "Applications in Depth: Finance & Healthcare",
    eyebrow: "Appendix · the Explore-button write-ups, for your handout",
    className: "l2-appendix-slide",
    html: `<div class="l2-app-pair">${applicationCard({
      title: "Finance", flavor: "Nonlinear risk · linear sneaks back in",
      intro: "Allocate wealth across assets balancing return against risk—Markowitz's Nobel-winning model and its LP cousins.",
      decisions: ["Fraction of wealth per asset", "Trades to rebalance a portfolio"],
      constraints: ["Budget: fractions sum to 1", "Position limits, no-short rules", "Regulatory / risk limits"],
      objectives: ["Maximize return − risk penalty", "Minimize tracking error vs an index"],
      conclusion: "variance risk = quadratic (nonlinear); absolute-deviation risk versions are LPs; arbitrage detection is pure LP duality (later in this course!).",
      data: "return histories, covariance estimates (statistics!), transaction cost models.",
    })}${applicationCard({
      title: "Healthcare", flavor: "Continuous and discrete · high stakes",
      intro: "From radiation dose maps to staff schedules to kidney exchanges—optimization with lives in the objective function.",
      decisions: ["Beamlet intensities (continuous)", "Nurse-to-shift assignments (discrete)", "Donor–patient matches (discrete)"],
      constraints: ["Tumor dose minimums, organ dose caps", "Shift coverage, work rules", "Medical compatibility, exchange cycles"],
      objectives: ["Minimize dose to healthy tissue", "Minimize staffing cost / overtime", "Maximize number of transplants"],
      conclusion: "therapy planning ≈ LP; scheduling & matching = IP.",
      data: "imaging & dose physics, patient arrival statistics, compatibility testing—and clinical workflows ready to use the answer.",
    })}</div>`,
  },
  {
    id: "l2-66",
    page: 66,
    title: "Applications in Depth: Sports & Machine learning",
    eyebrow: "Appendix · the Explore-button write-ups, for your handout",
    className: "l2-appendix-slide",
    html: `<div class="l2-app-pair">${applicationCard({
      title: "Sports", flavor: "Discrete · yes, the MLB schedule is an IP",
      intro: "Season schedules juggle venues, travel, TV and fairness—Major League Baseball's is produced with integer programming.",
      decisions: ["Which teams play where, each day", "Series groupings and off days"],
      constraints: ["Venue availability", "Travel distance / back-to-back limits", "Broadcast windows, rivalry dates, fairness"],
      objectives: ["Minimize total travel", "Maximize attractive matchups in prime slots"],
      conclusion: "pure integer programming—schedules don't come in fractions.",
      data: "venue calendars, travel times, broadcast contracts, historical attendance.",
    })}${applicationCard({
      title: "Machine learning", flavor: "Nonlinear · optimization all the way down",
      intro: "Training any model is optimization: choose parameters minimizing a loss. The fields are siblings, not rivals.",
      decisions: ["Model weights (millions–billions of them)"],
      constraints: ["Often none explicit—or regularization playing that role"],
      objectives: ["Minimize prediction loss on data"],
      conclusion: String.raw`high-dimensional nonlinear (gradient methods—ISE 5406). But LP appears inside ML too: \(\ell_1\)/robust regression, optimal transport.`,
      data: "the training data is the model—and ML's outputs (forecasts) are optimization's inputs, one rung down the maturity curve.",
    })}</div>`,
  },
];

const number = (input) => Number.parseFloat(input.value);
const pretty = (value, digits = 2) => {
  const rounded = Number(value.toFixed(digits));
  return String(rounded).replace("-", "−");
};

function bindInputs(root, selector, update) {
  const inputs = [...root.querySelectorAll(selector)];
  const listener = () => update(inputs);
  inputs.forEach((input) => input.addEventListener("input", listener));
  listener();
  return () => inputs.forEach((input) => input.removeEventListener("input", listener));
}

function mountDotProduct(root) {
  return bindInputs(root, "[data-dot]", (inputs) => {
    const values = Object.fromEntries(inputs.map((input) => [input.dataset.dot, number(input)]));
    inputs.forEach((input) => {
      const output = root.querySelector(`[data-value-for="${input.dataset.dot}"]`);
      if (output) output.value = pretty(number(input), 0);
    });
    const result = values.x1 * values.y1 + values.x2 * values.y2;
    root.querySelector("[data-dot-expression]").textContent =
      `${pretty(values.x1, 0)}(${pretty(values.y1, 0)}) + ${pretty(values.x2, 0)}(${pretty(values.y2, 0)})`;
    root.querySelector("[data-dot-result]").value = pretty(result, 0);
  });
}

function mountHalfspace(root) {
  return bindInputs(root, "[data-halfspace-b]", ([input]) => {
    const b = number(input);
    root.querySelector("[data-halfspace-value]").value = b.toFixed(2).replace("-", "−");
    root.querySelector("[data-halfspace-line]").setAttribute("transform", `translate(0 ${-(b - 1) * 34})`);
    const test = root.querySelector("[data-halfspace-test]");
    const feasible = 0.4 >= b - 1e-9;
    test.textContent = `P ${feasible ? "satisfies" : "violates"} b = ${pretty(b)}.`;
    test.style.color = feasible ? "#176b3a" : "#9b2226";
  });
}

function mountProduction(root) {
  return bindInputs(root, "[data-prod]", (inputs) => {
    const v = Object.fromEntries(inputs.map((input) => [input.dataset.prod, number(input)]));
    inputs.forEach((input) => {
      root.querySelector(`[data-value-for="${input.dataset.prod}"]`).value = pretty(number(input), 0);
    });
    const candidates = [[0, 0], [Math.min(v.labor / 4, v.material / 2), 0], [0, Math.min(v.labor / 5, v.material / 4)]];
    const intersection = [(4 * v.labor - 5 * v.material) / 6, (2 * v.material - v.labor) / 3];
    if (intersection[0] >= 0 && intersection[1] >= 0) candidates.push(intersection);
    const feasible = candidates.filter(
      ([a, b]) => 4 * a + 5 * b <= v.labor + 1e-7 && 2 * a + 4 * b <= v.material + 1e-7,
    );
    const best = feasible
      .map(([a, b]) => ({ a, b, value: v.pa * a + v.pb * b }))
      .sort((p, q) => q.value - p.value)[0];
    const laborUsed = 4 * best.a + 5 * best.b;
    const materialUsed = 2 * best.a + 4 * best.b;
    const binding = [];
    if (Math.abs(laborUsed - v.labor) < 1e-6) binding.push("labor");
    if (Math.abs(materialUsed - v.material) < 1e-6) binding.push("material");
    root.querySelector("[data-prod-result]").textContent =
      `Optimal plan: make ${pretty(best.a, 1)} of A and ${pretty(best.b, 1)} of B; ` +
      `profit = $${Math.round(best.value).toLocaleString("en-US")}; ` +
      `binding: ${binding.join(" + ") || "none"}. ` +
      `Leftover: ${pretty(v.labor - laborUsed, 0)} h labor, ${pretty(v.material - materialUsed, 0)} kg material.`;

    const x = (value) => 60 + ((value + 5) / 90) * 410;
    const y = (value) => 350 - ((value + 5) / 75) * 320;
    const center = feasible.reduce(
      (sum, point) => [sum[0] + point[0] / feasible.length, sum[1] + point[1] / feasible.length],
      [0, 0],
    );
    const ordered = [...feasible].sort(
      (left, right) => Math.atan2(left[1] - center[1], left[0] - center[0])
        - Math.atan2(right[1] - center[1], right[0] - center[0]),
    );
    root.querySelector("[data-prod-region]").setAttribute(
      "points",
      ordered.map(([a, b]) => `${x(a)},${y(b)}`).join(" "),
    );
    [...root.querySelectorAll("[data-prod-corners] circle")].forEach((circle, index) => {
      const point = feasible[index];
      circle.toggleAttribute("hidden", !point);
      if (point) {
        circle.setAttribute("cx", x(point[0]));
        circle.setAttribute("cy", y(point[1]));
      }
    });
    const optimum = root.querySelector("[data-prod-optimum]");
    optimum.setAttribute("cx", x(best.a));
    optimum.setAttribute("cy", y(best.b));
    const label = root.querySelector("[data-prod-optimum-label]");
    label.setAttribute("x", x(best.a) + 14);
    label.setAttribute("y", y(best.b) - 12);
    const xMin = -5;
    const xMax = 85;
    const yMin = -5;
    const yMax = 70;
    const lineEnds = [
      [xMin, (best.value - v.pa * xMin) / v.pb],
      [xMax, (best.value - v.pa * xMax) / v.pb],
      [(best.value - v.pb * yMin) / v.pa, yMin],
      [(best.value - v.pb * yMax) / v.pa, yMax],
    ].filter(([a, b]) => a >= xMin - 1e-7 && a <= xMax + 1e-7 && b >= yMin - 1e-7 && b <= yMax + 1e-7);
    root.querySelector("[data-prod-objective]").setAttribute(
      "d",
      `M${x(lineEnds[0][0])} ${y(lineEnds[0][1])}L${x(lineEnds[1][0])} ${y(lineEnds[1][1])}`,
    );
  });
}

function mountCornerObjective(root) {
  return bindInputs(root, "[data-corner]", (inputs) => {
    const v = Object.fromEntries(inputs.map((input) => [input.dataset.corner, number(input)]));
    inputs.forEach((input) => {
      root.querySelector(`[data-value-for="${input.dataset.corner}"]`).value = pretty(number(input), 1);
    });
    const best = [[0,0],[1.5,0],[1,1],[0,1.5]]
      .map(([x,y]) => ({x,y,value:v.c1*x+v.c2*y}))
      .sort((a,b) => a.value-b.value)[0];
    root.querySelector("[data-corner-result]").textContent =
      `Best corner: (${pretty(best.x,1)}, ${pretty(best.y,1)}), objective ${pretty(best.value,2)}.`;
  });
}

function mountTabs(root) {
  const buttons = [...root.querySelectorAll("[data-tab]")];
  const onClick = (event) => {
    const key = event.currentTarget.dataset.tab;
    buttons.forEach((button) => button.setAttribute("aria-selected", String(button === event.currentTarget)));
    root.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== key; });
  };
  buttons.forEach((button) => button.addEventListener("click", onClick));
  return () => buttons.forEach((button) => button.removeEventListener("click", onClick));
}

function mountDerivationTabs(root) {
  const tabs = [...root.querySelectorAll("[data-derivation-step]")];
  const panels = [...root.querySelectorAll("[data-derivation-panel]")];
  const activate = (tab, { focus = false } = {}) => {
    const step = tab.dataset.derivationStep;
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => panel.toggleAttribute("hidden", panel.dataset.derivationPanel !== step));
    if (focus) tab.focus();
  };
  const onClick = (event) => activate(event.currentTarget);
  const onKeydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = tabs.indexOf(event.currentTarget);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    activate(tabs[next], { focus: true });
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", onClick);
    tab.addEventListener("keydown", onKeydown);
  });
  activate(tabs[0]);
  return () => tabs.forEach((tab) => {
    tab.removeEventListener("click", onClick);
    tab.removeEventListener("keydown", onKeydown);
  });
}

function mountPiecewise(root) {
  return bindInputs(root, "[data-piecewise-x]", ([input]) => {
    const x = number(input);
    const positive = x;
    const negative = -x;
    const value = Math.abs(x);
    root.querySelector("[data-piecewise-value]").value = pretty(x, 1);
    root.querySelector("[data-piecewise-result]").textContent =
      `max{${pretty(positive, 1)}, ${pretty(negative, 1)}} = |${pretty(x, 1)}| = ${pretty(value, 1)}`;
    const dot = root.querySelector("[data-piecewise-dot]");
    dot.setAttribute("cx", String(250 + x * 65));
    dot.setAttribute("cy", String(175 - value * 45));
  });
}

function mountDataFit(root) {
  return bindInputs(root, "[data-fit]", (inputs) => {
    const v = Object.fromEntries(inputs.map((input) => [input.dataset.fit, number(input)]));
    inputs.forEach((input) => { root.querySelector(`[data-value-for="${input.dataset.fit}"]`).value = pretty(number(input), 1); });
    const points = [[0,0],[1,2],[2,2],[3,4]];
    const residuals = points.map(([a,b]) => Math.abs(b - (v.m*a + v.q)));
    root.querySelector("[data-fit-result]").textContent =
      `largest residual = ${pretty(Math.max(...residuals))}; sum = ${pretty(residuals.reduce((a,b)=>a+b,0))}`;
  });
}

const L2_BIG = 500;

function clipPolygon(poly, a, b, rhs) {
  const out = [];
  if (!poly.length) return out;
  for (let index = 0; index < poly.length; index += 1) {
    const point = poly[index];
    const next = poly[(index + 1) % poly.length];
    const distance = a * point[0] + b * point[1] - rhs;
    const nextDistance = a * next[0] + b * next[1] - rhs;
    if (distance <= 1e-9) out.push(point);
    if ((distance < -1e-9 && nextDistance > 1e-9) || (distance > 1e-9 && nextDistance < -1e-9)) {
      const fraction = distance / (distance - nextDistance);
      out.push([
        point[0] + fraction * (next[0] - point[0]),
        point[1] + fraction * (next[1] - point[1]),
      ]);
    }
  }
  return out;
}

function regionPolygon(constraints) {
  let poly = [[-L2_BIG, -L2_BIG], [L2_BIG, -L2_BIG], [L2_BIG, L2_BIG], [-L2_BIG, L2_BIG]];
  constraints.forEach((constraint) => {
    if (constraint.op === "ge") {
      poly = clipPolygon(poly, -constraint.a, -constraint.b, -constraint.rhs);
    } else {
      poly = clipPolygon(poly, constraint.a, constraint.b, constraint.rhs);
    }
  });
  return poly;
}

function dedupePoints(points) {
  const unique = [];
  points.forEach((point) => {
    if (!unique.some((candidate) => Math.abs(candidate[0] - point[0]) < 1e-6
      && Math.abs(candidate[1] - point[1]) < 1e-6)) unique.push(point);
  });
  return unique;
}

const isArtificialBoundary = (point) => Math.abs(point[0]) > L2_BIG - 1 || Math.abs(point[1]) > L2_BIG - 1;

function mountMatrixAnatomy(root, typesetMath, clearMath) {
  const grid = root.querySelector("[data-matrix-grid]");
  const output = root.querySelector("[data-matrix-output]");
  const values = [[3, -1, 0, 2], [1, 4, -2, 0], [0, 5, 1, -3]];
  const buttons = [];
  values.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "l2-matrix-cell";
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", `Row ${rowIndex + 1}, column ${columnIndex + 1}, value ${value}`);
    button.textContent = value;
    const choose = async () => {
      buttons.forEach(({ element, row: r, column: c }) => {
        element.classList.toggle("is-row", r === rowIndex);
        element.classList.toggle("is-column", c === columnIndex);
        element.classList.toggle("is-picked", element === button);
      });
      if (clearMath) clearMath([output]);
      output.innerHTML = String.raw`\(a_{${rowIndex + 1}${columnIndex + 1}}=${value}\) — row ${rowIndex + 1}, column ${columnIndex + 1}`;
      if (typesetMath) await typesetMath([output]);
    };
    button.addEventListener("click", choose);
    grid.appendChild(button);
    buttons.push({ element: button, row: rowIndex, column: columnIndex, choose });
  }));
  return () => buttons.forEach(({ element, choose }) => element.removeEventListener("click", choose));
}

function mountInnerProductCanvas(root) {
  const canvas = root.querySelector("[data-ip-canvas]");
  const output = root.querySelector("[data-ip-output]");
  const context = canvas.getContext("2d");
  const a = [2, 1];
  let x = [1, 2];
  let dragging = false;
  const origin = { x: 200, y: 160 };
  const scale = 40;
  canvas.tabIndex = 0;

  const arrow = (vector, color, label) => {
    const px = origin.x + vector[0] * scale;
    const py = origin.y - vector[1] * scale;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 2.2;
    context.beginPath(); context.moveTo(origin.x, origin.y); context.lineTo(px, py); context.stroke();
    const angle = Math.atan2(py - origin.y, px - origin.x);
    context.beginPath(); context.moveTo(px, py);
    context.lineTo(px - 8 * Math.cos(angle - .38), py - 8 * Math.sin(angle - .38));
    context.lineTo(px - 8 * Math.cos(angle + .38), py - 8 * Math.sin(angle + .38));
    context.closePath(); context.fill();
    context.font = "bold 15px sans-serif"; context.fillText(label, px + 8, py - 6);
  };
  const draw = () => {
    context.clearRect(0, 0, 400, 300);
    context.strokeStyle = "#eee"; context.lineWidth = 1;
    for (let grid = -4; grid <= 4; grid += 1) {
      context.beginPath(); context.moveTo(origin.x + grid * scale, 0); context.lineTo(origin.x + grid * scale, 300); context.stroke();
      context.beginPath(); context.moveTo(0, origin.y + grid * scale); context.lineTo(400, origin.y + grid * scale); context.stroke();
    }
    context.strokeStyle = "#999";
    context.beginPath(); context.moveTo(0, origin.y); context.lineTo(400, origin.y); context.stroke();
    context.beginPath(); context.moveTo(origin.x, 0); context.lineTo(origin.x, 300); context.stroke();
    context.strokeStyle = "#c9b8a8"; context.setLineDash([6, 5]); context.lineWidth = 1.6;
    context.beginPath(); context.moveTo(origin.x + a[1] * scale * 3, origin.y + a[0] * scale * 3); context.lineTo(origin.x - a[1] * scale * 3, origin.y - a[0] * scale * 3); context.stroke(); context.setLineDash([]);
    context.font = "12px sans-serif"; context.fillStyle = "#777"; context.fillText("a′x = 0", 72, 62);
    arrow(a, "#861f41", "a"); arrow(x, "#33658a", "x");
    const value = a[0] * x[0] + a[1] * x[1];
    const meaning = value > .05 ? "positive: x is on the same side as a (acute angle)"
      : value < -.05 ? "negative: x is on the opposite side (obtuse angle)" : "zero: x is perpendicular to a";
    output.textContent = `a′x = (2)(${x[0].toFixed(1)}) + (1)(${x[1].toFixed(1)}) = ${value.toFixed(2)} · ${meaning}`;
    output.dataset.state = value > .05 ? "good" : value < -.05 ? "bad" : "mid";
  };
  const setFromPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    x = [((event.clientX - rect.left) * canvas.width / rect.width - origin.x) / scale,
      (origin.y - (event.clientY - rect.top) * canvas.height / rect.height) / scale];
    draw();
  };
  const down = (event) => { dragging = true; canvas.setPointerCapture?.(event.pointerId); setFromPointer(event); };
  const move = (event) => { if (dragging) setFromPointer(event); };
  const up = () => { dragging = false; };
  const key = (event) => {
    const delta = event.shiftKey ? .5 : .2;
    if (event.key === "ArrowLeft") x[0] -= delta;
    else if (event.key === "ArrowRight") x[0] += delta;
    else if (event.key === "ArrowUp") x[1] += delta;
    else if (event.key === "ArrowDown") x[1] -= delta;
    else return;
    event.preventDefault(); draw();
  };
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("keydown", key);
  draw();
  return () => {
    canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("keydown", key);
  };
}

function mountHalfplaneCanvas(root) {
  const canvas = root.querySelector("[data-hp-canvas]");
  const context = canvas.getContext("2d");
  const slider = root.querySelector("[data-hp-b]");
  const valueOutput = root.querySelector("[data-hp-b-value]");
  const output = root.querySelector("[data-hp-output]");
  let a = [1.5, 1];
  let testPoint = [-1.2, 2.2];
  let mode = null;
  const origin = { x: 215, y: 170 };
  const scale = 44;
  canvas.tabIndex = 0;
  const pixel = (point) => [origin.x + point[0] * scale, origin.y - point[1] * scale];
  const draw = () => {
    const rhs = number(slider); valueOutput.value = rhs.toFixed(1);
    context.clearRect(0, 0, 430, 330);
    const shade = clipPolygon([[-6, -6], [6, -6], [6, 6], [-6, 6]], -a[0], -a[1], -rhs);
    if (shade.length) {
      context.beginPath(); shade.forEach((point, index) => { const q = pixel(point); index ? context.lineTo(...q) : context.moveTo(...q); }); context.closePath();
      context.fillStyle = "rgba(134,31,65,.12)"; context.fill();
    }
    context.strokeStyle = "#e8e8e8";
    for (let grid = -4; grid <= 4; grid += 1) {
      context.beginPath(); context.moveTo(origin.x + grid * scale, 0); context.lineTo(origin.x + grid * scale, 330); context.stroke();
      context.beginPath(); context.moveTo(0, origin.y + grid * scale); context.lineTo(430, origin.y + grid * scale); context.stroke();
    }
    context.strokeStyle = "#999";
    context.beginPath(); context.moveTo(0, origin.y); context.lineTo(430, origin.y); context.stroke();
    context.beginPath(); context.moveTo(origin.x, 0); context.lineTo(origin.x, 330); context.stroke();
    const norm = Math.hypot(...a) || 1;
    const base = [a[0] * rhs / (norm * norm), a[1] * rhs / (norm * norm)];
    const direction = [-a[1] / norm, a[0] / norm];
    const p1 = pixel([base[0] - direction[0] * 8, base[1] - direction[1] * 8]);
    const p2 = pixel([base[0] + direction[0] * 8, base[1] + direction[1] * 8]);
    context.strokeStyle = "#861f41"; context.lineWidth = 2.6; context.beginPath(); context.moveTo(...p1); context.lineTo(...p2); context.stroke();
    const q0 = pixel([0, 0]); const q1 = pixel(a);
    context.strokeStyle = "#33658a"; context.fillStyle = "#33658a"; context.lineWidth = 2.2; context.beginPath(); context.moveTo(...q0); context.lineTo(...q1); context.stroke();
    const angle = Math.atan2(q1[1] - q0[1], q1[0] - q0[0]); context.beginPath(); context.moveTo(...q1); context.lineTo(q1[0] - 8 * Math.cos(angle - .38), q1[1] - 8 * Math.sin(angle - .38)); context.lineTo(q1[0] - 8 * Math.cos(angle + .38), q1[1] - 8 * Math.sin(angle + .38)); context.closePath(); context.fill();
    context.font = "bold 14px sans-serif"; context.fillText("a", q1[0] + 8, q1[1] - 5);
    const lhs = a[0] * testPoint[0] + a[1] * testPoint[1]; const feasible = lhs >= rhs - 1e-9; const q = pixel(testPoint);
    context.beginPath(); context.arc(q[0], q[1], 8, 0, Math.PI * 2); context.fillStyle = feasible ? "#1a7d3c" : "#b3261e"; context.fill(); context.font = "bold 13px sans-serif"; context.fillText("P", q[0] + 11, q[1] - 9);
    output.textContent = `a = (${a[0].toFixed(1)}, ${a[1].toFixed(1)}); a′P = ${lhs.toFixed(2)} ${feasible ? "≥" : "<"} ${rhs.toFixed(1)} — P ${feasible ? "satisfies" : "violates"} the constraint.`;
    output.dataset.state = feasible ? "good" : "bad";
  };
  const world = (event) => {
    const rect = canvas.getBoundingClientRect();
    return [((event.clientX - rect.left) * canvas.width / rect.width - origin.x) / scale,
      (origin.y - (event.clientY - rect.top) * canvas.height / rect.height) / scale];
  };
  const pointerMove = (event) => {
    if (!mode) return;
    const point = world(event);
    if (mode === "a" && Math.hypot(...point) > .25) a = point.map((coordinate) => Number(coordinate.toFixed(1)));
    if (mode === "p") testPoint = point;
    draw();
  };
  const pointerDown = (event) => { const point = world(event); mode = Math.hypot(point[0] - a[0], point[1] - a[1]) < .55 ? "a" : "p"; canvas.setPointerCapture?.(event.pointerId); pointerMove(event); };
  const pointerUp = () => { mode = null; };
  const keydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const target = event.shiftKey ? a : testPoint;
    const delta = .2;
    if (event.key === "ArrowLeft") target[0] -= delta;
    if (event.key === "ArrowRight") target[0] += delta;
    if (event.key === "ArrowUp") target[1] += delta;
    if (event.key === "ArrowDown") target[1] -= delta;
    if (event.shiftKey && Math.hypot(...a) < .25) a = [1, 0];
    draw();
  };
  canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove); canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerUp); canvas.addEventListener("keydown", keydown); slider.addEventListener("input", draw); draw();
  return () => { canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove); canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerUp); canvas.removeEventListener("keydown", keydown); slider.removeEventListener("input", draw); };
}

function mountPolyBuilder(root, announce) {
  const canvas = root.querySelector("[data-poly-builder]");
  const context = canvas.getContext("2d");
  const add = root.querySelector("[data-poly-add]");
  const reset = root.querySelector("[data-poly-reset]");
  const output = root.querySelector("[data-poly-output]");
  const cuts = [[1, 1, 560], [-6, -11, -1860], [3, -13, -180], [9, -5, 2520], [-1, 8, 1780], [-12, 5, -480]];
  let count = 0;
  const draw = () => {
    context.clearRect(0, 0, 450, 300);
    let polygon = [[5, 5], [445, 5], [445, 295], [5, 295]];
    for (let index = 0; index < count; index += 1) polygon = clipPolygon(polygon, ...cuts[index]);
    if (polygon.length) {
      context.beginPath(); polygon.forEach((point, index) => index ? context.lineTo(...point) : context.moveTo(...point)); context.closePath(); context.fillStyle = "rgba(134,31,65,.15)"; context.fill(); context.strokeStyle = "#861f41"; context.lineWidth = 2.5; context.stroke();
      dedupePoints(polygon).forEach((point) => { if (point[0] > 6 && point[0] < 444 && point[1] > 6 && point[1] < 294) { context.beginPath(); context.arc(...point, 4.5, 0, Math.PI * 2); context.fillStyle = "#26282e"; context.fill(); } });
    }
    if (count) {
      const [a, b, rhs] = cuts[count - 1]; context.strokeStyle = "#e5751f"; context.lineWidth = 2; context.setLineDash([7, 5]); context.beginPath();
      if (Math.abs(b) > 1e-9) { context.moveTo(0, rhs / b); context.lineTo(450, (rhs - a * 450) / b); } else { context.moveTo(rhs / a, 0); context.lineTo(rhs / a, 300); }
      context.stroke(); context.setLineDash([]);
    }
    const corners = dedupePoints(polygon).filter((point) => point[0] > 6 && point[0] < 444 && point[1] > 6 && point[1] < 294).length;
    output.textContent = `${count} halfspace${count === 1 ? "" : "s"} · ${corners} corner${corners === 1 ? "" : "s"}`;
    add.disabled = count >= cuts.length;
  };
  const onAdd = () => { if (count < cuts.length) { count += 1; draw(); announce?.(`Added halfspace ${count}. ${output.textContent}`); } };
  const onReset = () => { count = 0; draw(); announce?.("Feasible-region builder reset."); };
  add.addEventListener("click", onAdd); reset.addEventListener("click", onReset); draw();
  return () => { add.removeEventListener("click", onAdd); reset.removeEventListener("click", onReset); };
}

function mountDerivationPlayer({ slideElement: root, typesetMath, announce }) {
  const steps = [...root.querySelectorAll("[data-derive-step]")];
  const note = root.querySelector("[data-derive-note]");
  const dots = root.querySelector("[data-derive-dots]");
  const previous = root.querySelector("[data-derive-prev]");
  const next = root.querySelector("[data-derive-next]");
  let index = 0;
  const dotButtons = steps.map((step, stepIndex) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "l2-derive-dot"; button.setAttribute("aria-label", `Go to derivation step ${stepIndex + 1}`); dots.appendChild(button); return button;
  });
  const go = async (requested) => {
    index = Math.max(0, Math.min(steps.length - 1, requested));
    steps.forEach((step, stepIndex) => step.classList.toggle("is-shown", stepIndex <= index));
    dotButtons.forEach((button, stepIndex) => { button.classList.toggle("is-current", stepIndex === index); button.setAttribute("aria-current", stepIndex === index ? "step" : "false"); });
    note.textContent = `Step ${index + 1}/${steps.length}: ${steps[index].dataset.note || ""}`;
    previous.disabled = index === 0; next.disabled = index === steps.length - 1;
    if (typesetMath) await typesetMath([root]);
    announce?.(note.textContent);
  };
  const handlers = dotButtons.map((button, stepIndex) => { const handler = () => go(stepIndex); button.addEventListener("click", handler); return [button, handler]; });
  const prev = () => go(index - 1); const nxt = () => go(index + 1); previous.addEventListener("click", prev); next.addEventListener("click", nxt); go(0);
  return () => { previous.removeEventListener("click", prev); next.removeEventListener("click", nxt); handlers.forEach(([button, handler]) => button.removeEventListener("click", handler)); };
}

function mountLinearityQuiz(root, typesetMath, clearMath, announce) {
  const questions = [
    { html: String.raw`\(3x_1-2x_2+5x_3\)`, answer: "A", why: "A sum of constants times variables is exactly linear." },
    { html: String.raw`\(x_1x_2+x_3\)`, answer: "B", why: "A product of variables violates additivity and is nonlinear." },
    { html: String.raw`\(\max\{x_1,x_2\}\le5\)`, answer: "C", why: "Split it into x₁ ≤ 5 and x₂ ≤ 5." },
    { html: String.raw`\(\min\ |x_1|+2x_2\)`, answer: "C", why: "A minimized absolute value is linearized with an epigraph variable." },
    { html: String.raw`\(x_1\in\mathbb Z\)`, answer: "B", why: "Integrality breaks divisibility; it creates an integer program, not an LP." },
  ];
  const question = root.querySelector("[data-quiz-question]"); const feedback = root.querySelector("[data-quiz-feedback]"); const scoreOutput = root.querySelector("[data-quiz-score]"); const next = root.querySelector("[data-quiz-next]"); const choices = [...root.querySelectorAll("[data-quiz-choice]")];
  let index = 0; let score = 0; let tried = 0; let answered = false;
  const load = async () => { answered = false; feedback.textContent = ""; if (clearMath) clearMath([question]); question.innerHTML = questions[index % questions.length].html; if (typesetMath) await typesetMath([question]); choices.forEach((choice) => { choice.disabled = false; choice.removeAttribute("data-state"); }); };
  const handlers = choices.map((choice) => {
    const handler = () => {
      if (answered) return; answered = true; tried += 1; const item = questions[index % questions.length]; const correct = choice.dataset.quizChoice === item.answer; if (correct) score += 1;
      feedback.textContent = `${correct ? "Correct!" : "Not quite."} ${item.why}`; feedback.dataset.state = correct ? "good" : "bad"; scoreOutput.textContent = `Score: ${score} / ${tried}`; choices.forEach((button) => { button.disabled = true; button.dataset.state = button.dataset.quizChoice === item.answer ? "correct" : button === choice ? "incorrect" : ""; }); announce?.(feedback.textContent);
    };
    choice.addEventListener("click", handler); return [choice, handler];
  });
  const onNext = () => { index += 1; load(); }; next.addEventListener("click", onNext); load();
  return () => { next.removeEventListener("click", onNext); handlers.forEach(([choice, handler]) => choice.removeEventListener("click", handler)); };
}

function mountBruteForce(root) {
  const slider = root.querySelector("[data-bf-slider]"); const nOutput = root.querySelector("[data-bf-n]"); const factorialOutput = root.querySelector("[data-bf-factorial]"); const timeOutput = root.querySelector("[data-bf-time]"); const verdict = root.querySelector("[data-bf-verdict]");
  const update = () => {
    const n = Number(slider.value); nOutput.value = String(n); let factorial = 1n; for (let value = 2n; value <= BigInt(n); value += 1n) factorial *= value;
    const digits = factorial.toString(); const exponent = digits.length - 1; factorialOutput.value = exponent < 15 ? Number(factorial).toLocaleString() : `${digits[0]}.${digits.slice(1, 4)}×10^${exponent}`;
    const logSeconds = Math.log10(Number(digits.slice(0, 15))) + (exponent - 14) - 12; let time;
    if (logSeconds < 0) time = "< 1 second"; else if (logSeconds < 2) time = `~${Math.round(10 ** logSeconds)} seconds`; else if (logSeconds < 3.6) time = `~${Math.round(10 ** logSeconds / 60)} minutes`; else if (logSeconds < 5) time = `~${Math.round(10 ** logSeconds / 3600)} hours`; else if (logSeconds < 7.6) time = `~${Math.round(10 ** logSeconds / 86400)} days`; else if (logSeconds < 10) time = `~${Math.round(10 ** logSeconds / 3.15e7).toLocaleString()} years`; else if (logSeconds < 17.64) time = `~10^${Math.round(logSeconds - 7.5)} years`; else time = `~10^${Math.round(logSeconds - 17.64)} × the age of the universe`;
    timeOutput.value = time; verdict.textContent = n <= 12 ? "Easy—a laptop laughs at this." : n <= 20 ? "Getting painful even for a supercomputer…" : "Hopeless. Real assignments have thousands of people, yet LP-based methods solve them quickly.";
  };
  slider.addEventListener("input", update); update(); return () => slider.removeEventListener("input", update);
}

function mountLPGrapher(root, announce) {
  const MAX_CONSTRAINTS = 6;
  const canvas = root.querySelector("[data-g-canvas]");
  const context = canvas.getContext("2d");
  const presetInput = root.querySelector("[data-g-preset]");
  const c1Input = root.querySelector("[data-g-c1]");
  const c2Input = root.querySelector("[data-g-c2]");
  const senseOutput = root.querySelector("[data-g-sense]");
  const levelInput = root.querySelector("[data-g-t]");
  const constraintsRoot = root.querySelector("[data-g-constraints]");
  const countOutput = root.querySelector("[data-g-count]");
  const status = root.querySelector("[data-g-status]");
  const vertexTable = root.querySelector("[data-g-vertices]");
  const addButton = root.querySelector("[data-g-add]");
  const flipButton = root.querySelector("[data-g-flip]");
  const walkButton = root.querySelector("[data-g-walk]");
  const presets = {
    ex16: { objective: { c1: -1, c2: -1, sense: "min" }, view: { xmin: -.7, xmax: 3.6, ymin: -.7, ymax: 3.6 }, constraints: [{ a: 1, b: 2, op: "le", rhs: 3 }, { a: 2, b: 1, op: "le", rhs: 3 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }] },
    prod: { objective: { c1: 40, c2: 55, sense: "max" }, view: { xmin: -6, xmax: 60, ymin: -6, ymax: 50 }, constraints: [{ a: 4, b: 5, op: "le", rhs: 200 }, { a: 2, b: 4, op: "le", rhs: 160 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }] },
    caseA: { objective: { c1: 1, c2: 1, sense: "min" }, view: { xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, constraints: [{ a: -1, b: 1, op: "le", rhs: 1 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }] },
    caseB1: { objective: { c1: 1, c2: 0, sense: "min" }, view: { xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, constraints: [{ a: -1, b: 1, op: "le", rhs: 1 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }] },
    caseB2: { objective: { c1: 0, c2: 1, sense: "min" }, view: { xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, constraints: [{ a: -1, b: 1, op: "le", rhs: 1 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }] },
    caseC: { objective: { c1: -1, c2: -1, sense: "min" }, view: { xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, constraints: [{ a: -1, b: 1, op: "le", rhs: 1 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }] },
    caseD: { objective: { c1: 1, c2: 1, sense: "min" }, view: { xmin: -3, xmax: 4, ymin: -3, ymax: 4 }, constraints: [{ a: -1, b: 1, op: "le", rhs: 1 }, { a: 1, b: 0, op: "ge", rhs: 0 }, { a: 0, b: 1, op: "ge", rhs: 0 }, { a: 1, b: 1, op: "le", rhs: -2 }] },
  };
  let constraints = [];
  let objective = { c1: -1, c2: -1, sense: "min" };
  let view = { xmin: -1, xmax: 4, ymin: -1, ymax: 4 };
  let dragging = false;
  let animationFrame = null;
  canvas.tabIndex = 0;
  const xPixel = (x) => (x - view.xmin) / (view.xmax - view.xmin) * canvas.width;
  const yPixel = (y) => canvas.height - (y - view.ymin) / (view.ymax - view.ymin) * canvas.height;
  const stopWalk = () => { if (animationFrame) cancelAnimationFrame(animationFrame); animationFrame = null; };

  const syncLevelRange = () => {
    const vertices = dedupePoints(regionPolygon(constraints)).filter((point) => !isArtificialBoundary(point));
    if (!vertices.length) { levelInput.min = -10; levelInput.max = 10; levelInput.value = 0; return; }
    const values = vertices.map((point) => objective.c1 * point[0] + objective.c2 * point[1]);
    const low = Math.min(...values); const high = Math.max(...values); const padding = (high - low) * .4 + 1;
    levelInput.min = (low - padding).toFixed(2); levelInput.max = (high + padding).toFixed(2); levelInput.step = ((high - low + 2 * padding) / 200).toFixed(3); levelInput.value = objective.sense === "min" ? low : high;
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const rawPolygon = regionPolygon(constraints);
    const allVertices = dedupePoints(rawPolygon);
    const finiteVertices = allVertices.filter((point) => !isArtificialBoundary(point));
    const span = view.xmax - view.xmin;
    const gridStep = span > 30 ? 10 : span > 12 ? 5 : 1;
    context.strokeStyle = "#eee"; context.lineWidth = 1;
    for (let grid = Math.ceil(view.xmin / gridStep) * gridStep; grid <= view.xmax; grid += gridStep) { context.beginPath(); context.moveTo(xPixel(grid), 0); context.lineTo(xPixel(grid), canvas.height); context.stroke(); }
    for (let grid = Math.ceil(view.ymin / gridStep) * gridStep; grid <= view.ymax; grid += gridStep) { context.beginPath(); context.moveTo(0, yPixel(grid)); context.lineTo(canvas.width, yPixel(grid)); context.stroke(); }
    let displayPolygon = rawPolygon.slice();
    displayPolygon = clipPolygon(displayPolygon, 1, 0, view.xmax); displayPolygon = clipPolygon(displayPolygon, -1, 0, -view.xmin); displayPolygon = clipPolygon(displayPolygon, 0, 1, view.ymax); displayPolygon = clipPolygon(displayPolygon, 0, -1, -view.ymin);
    if (displayPolygon.length) { context.beginPath(); displayPolygon.forEach((point, index) => index ? context.lineTo(xPixel(point[0]), yPixel(point[1])) : context.moveTo(xPixel(point[0]), yPixel(point[1]))); context.closePath(); context.fillStyle = "rgba(134,31,65,.14)"; context.fill(); }
    constraints.forEach((constraint) => {
      context.strokeStyle = "#8a8078"; context.lineWidth = 1.6; context.beginPath();
      if (Math.abs(constraint.b) > 1e-9) { context.moveTo(xPixel(view.xmin), yPixel((constraint.rhs - constraint.a * view.xmin) / constraint.b)); context.lineTo(xPixel(view.xmax), yPixel((constraint.rhs - constraint.a * view.xmax) / constraint.b)); }
      else if (Math.abs(constraint.a) > 1e-9) { context.moveTo(xPixel(constraint.rhs / constraint.a), yPixel(view.ymin)); context.lineTo(xPixel(constraint.rhs / constraint.a), yPixel(view.ymax)); }
      context.stroke();
    });
    context.strokeStyle = "#555"; context.lineWidth = 1.5; context.beginPath(); context.moveTo(0, yPixel(0)); context.lineTo(canvas.width, yPixel(0)); context.stroke(); context.beginPath(); context.moveTo(xPixel(0), 0); context.lineTo(xPixel(0), canvas.height); context.stroke();
    if (!rawPolygon.length) { status.textContent = "INFEASIBLE — the constraints have no common point."; status.dataset.state = "bad"; vertexTable.innerHTML = ""; return; }
    const sign = objective.sense === "min" ? 1 : -1;
    const values = allVertices.map((point) => objective.c1 * point[0] + objective.c2 * point[1]);
    let bestIndex = 0; values.forEach((value, index) => { if (sign * value < sign * values[bestIndex]) bestIndex = index; });
    const unbounded = isArtificialBoundary(allVertices[bestIndex]);
    const level = Number(levelInput.value);
    context.strokeStyle = "#e5751f"; context.lineWidth = 2.5; context.setLineDash([8, 5]); context.beginPath();
    if (Math.abs(objective.c2) > 1e-9) { context.moveTo(xPixel(view.xmin), yPixel((level - objective.c1 * view.xmin) / objective.c2)); context.lineTo(xPixel(view.xmax), yPixel((level - objective.c1 * view.xmax) / objective.c2)); }
    else if (Math.abs(objective.c1) > 1e-9) { context.moveTo(xPixel(level / objective.c1), yPixel(view.ymin)); context.lineTo(xPixel(level / objective.c1), yPixel(view.ymax)); }
    context.stroke(); context.setLineDash([]);
    const base = finiteVertices.length ? finiteVertices : displayPolygon;
    if (base.length) {
      const centerX = base.reduce((sum, point) => sum + point[0], 0) / base.length; const centerY = base.reduce((sum, point) => sum + point[1], 0) / base.length; const norm = Math.hypot(objective.c1, objective.c2) || 1; const dx = objective.c1 / norm * span * .13; const dy = objective.c2 / norm * span * .13;
      context.strokeStyle = "#33658a"; context.fillStyle = "#33658a"; context.lineWidth = 2; context.beginPath(); context.moveTo(xPixel(centerX), yPixel(centerY)); context.lineTo(xPixel(centerX + dx), yPixel(centerY + dy)); context.stroke(); const angle = Math.atan2(yPixel(centerY + dy) - yPixel(centerY), xPixel(centerX + dx) - xPixel(centerX)); context.beginPath(); context.moveTo(xPixel(centerX + dx), yPixel(centerY + dy)); context.lineTo(xPixel(centerX + dx) - 8 * Math.cos(angle - .38), yPixel(centerY + dy) - 8 * Math.sin(angle - .38)); context.lineTo(xPixel(centerX + dx) - 8 * Math.cos(angle + .38), yPixel(centerY + dy) - 8 * Math.sin(angle + .38)); context.closePath(); context.fill(); context.font = "bold 14px sans-serif"; context.fillText("c", xPixel(centerX + dx) + 6, yPixel(centerY + dy) - 4);
    }
    const bestValue = values[bestIndex]; const optimal = allVertices.map((point, index) => Math.abs(values[index] - bestValue) < 1e-6 && !isArtificialBoundary(point));
    finiteVertices.forEach((point) => { const index = allVertices.indexOf(point); const isOptimal = !unbounded && optimal[index]; context.beginPath(); context.arc(xPixel(point[0]), yPixel(point[1]), isOptimal ? 7 : 4.5, 0, Math.PI * 2); context.fillStyle = isOptimal ? "#1a7d3c" : "#26282e"; context.fill(); context.font = "12px sans-serif"; context.fillStyle = "#444"; context.fillText(`(${Number(point[0].toFixed(2))}, ${Number(point[1].toFixed(2))})`, xPixel(point[0]) + 8, yPixel(point[1]) - 8); });
    if (unbounded) { status.textContent = `UNBOUNDED — the objective improves forever in direction ${objective.sense === "min" ? "−c" : "c"}. Optimal cost is ${objective.sense === "min" ? "−∞" : "+∞"}.`; status.dataset.state = "bad"; }
    else { const count = optimal.filter(Boolean).length; const point = allVertices[bestIndex]; status.textContent = `${objective.sense.toUpperCase()} value ${bestValue.toFixed(2)} at (${point[0].toFixed(2)}, ${point[1].toFixed(2)})${count > 1 ? " — multiple optima: the edge between green corners is optimal." : ""} Drag t to this value to make the objective line touch.`; status.dataset.state = "good"; }
    vertexTable.innerHTML = finiteVertices.length ? `<thead><tr><th>Corner</th><th>c′x</th></tr></thead><tbody>${finiteVertices.map((point) => { const index = allVertices.indexOf(point); return `<tr${!unbounded && optimal[index] ? ' class="is-optimal"' : ""}><td>(${Number(point[0].toFixed(2))}, ${Number(point[1].toFixed(2))})</td><td>${values[index].toFixed(2)}</td></tr>`; }).join("")}</tbody>` : "";
  };

  const buildConstraintRows = () => {
    constraintsRoot.replaceChildren();
    constraintsRoot.dataset.constraintCount = String(constraints.length);
    constraints.forEach((constraint, index) => {
      const row = document.createElement("div"); row.className = "l2-constraint-row"; row.innerHTML = `<label><span class="sr-only">x1 coefficient</span><input type="number" step="0.5" value="${constraint.a}"></label><span>x₁ +</span><label><span class="sr-only">x2 coefficient</span><input type="number" step="0.5" value="${constraint.b}"></label><span>x₂</span><label><span class="sr-only">Inequality</span><select><option value="le"${constraint.op === "le" ? " selected" : ""}>≤</option><option value="ge"${constraint.op === "ge" ? " selected" : ""}>≥</option></select></label><label><span class="sr-only">Right hand side</span><input type="number" step="0.5" value="${constraint.rhs}"></label><button type="button" class="ns-slide-action" aria-label="Remove constraint ${index + 1}">✕</button>`;
      const numbers = row.querySelectorAll('input[type="number"]'); numbers[0].addEventListener("input", () => { constraint.a = Number(numbers[0].value) || 0; stopWalk(); draw(); }); numbers[1].addEventListener("input", () => { constraint.b = Number(numbers[1].value) || 0; stopWalk(); draw(); }); numbers[2].addEventListener("input", () => { constraint.rhs = Number(numbers[2].value) || 0; stopWalk(); draw(); }); row.querySelector("select").addEventListener("change", (event) => { constraint.op = event.target.value; stopWalk(); draw(); }); row.querySelector("button").addEventListener("click", () => { constraints.splice(index, 1); buildConstraintRows(); syncLevelRange(); draw(); }); constraintsRoot.appendChild(row);
    });
    countOutput.value = String(constraints.length);
    countOutput.textContent = String(constraints.length);
    const atLimit = constraints.length >= MAX_CONSTRAINTS;
    addButton.disabled = atLimit;
    addButton.setAttribute("aria-label", atLimit ? "Maximum of six constraints reached" : `Add constraint ${constraints.length + 1} of ${MAX_CONSTRAINTS}`);
    addButton.title = atLimit ? "Maximum: 6 constraints" : "Add one constraint";
  };

  const loadPreset = (name, shouldAnnounce = true) => {
    const preset = presets[name]; constraints = preset.constraints.map((constraint) => ({ ...constraint })); objective = { ...preset.objective }; view = { ...preset.view }; c1Input.value = objective.c1; c2Input.value = objective.c2; senseOutput.value = objective.sense; senseOutput.textContent = objective.sense; buildConstraintRows(); syncLevelRange(); draw(); if (shouldAnnounce) announce?.(`Loaded ${presetInput.options[presetInput.selectedIndex].text}. ${status.textContent}`);
  };
  const updateObjective = () => { objective.c1 = Number(c1Input.value) || 0; objective.c2 = Number(c2Input.value) || 0; stopWalk(); syncLevelRange(); draw(); };
  const flip = () => { objective.sense = objective.sense === "min" ? "max" : "min"; senseOutput.value = objective.sense; senseOutput.textContent = objective.sense; stopWalk(); draw(); announce?.(`Objective changed to ${objective.sense}. ${status.textContent}`); };
  const addConstraint = () => {
    if (constraints.length >= MAX_CONSTRAINTS) { announce?.("Maximum of six constraints reached."); return; }
    constraints.push({ a: 1, b: 1, op: "le", rhs: 2 }); buildConstraintRows(); syncLevelRange(); draw();
    announce?.(`Added constraint ${constraints.length} of ${MAX_CONSTRAINTS}${constraints.length === MAX_CONSTRAINTS ? ". Maximum reached." : "."}`);
  };
  const setObjectiveFromPointer = (event) => {
    const rect = canvas.getBoundingClientRect(); const worldX = view.xmin + (event.clientX - rect.left) / rect.width * (view.xmax - view.xmin); const worldY = view.ymin + (rect.bottom - event.clientY) / rect.height * (view.ymax - view.ymin); const polygon = dedupePoints(regionPolygon(constraints)).filter((point) => !isArtificialBoundary(point)); let centerX = 0; let centerY = 0; if (polygon.length) { centerX = polygon.reduce((sum, point) => sum + point[0], 0) / polygon.length; centerY = polygon.reduce((sum, point) => sum + point[1], 0) / polygon.length; }
    let dx = worldX - centerX; let dy = worldY - centerY; const norm = Math.hypot(dx, dy); if (norm < 1e-6) return; dx /= norm; dy /= norm; objective.c1 = Math.round(dx * 20) / 10; objective.c2 = Math.round(dy * 20) / 10; c1Input.value = objective.c1; c2Input.value = objective.c2; syncLevelRange(); draw();
  };
  const pointerDown = (event) => { dragging = true; canvas.setPointerCapture?.(event.pointerId); setObjectiveFromPointer(event); };
  const pointerMove = (event) => { if (dragging) setObjectiveFromPointer(event); };
  const pointerUp = () => { dragging = false; };
  const keyboardAim = (event) => { if (!event.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return; event.preventDefault(); if (event.key === "ArrowLeft") objective.c1 -= .5; if (event.key === "ArrowRight") objective.c1 += .5; if (event.key === "ArrowUp") objective.c2 += .5; if (event.key === "ArrowDown") objective.c2 -= .5; c1Input.value = objective.c1; c2Input.value = objective.c2; syncLevelRange(); draw(); };

  const simplexWalk = () => {
    stopWalk(); const polygon = dedupePoints(regionPolygon(constraints)).filter((point) => !isArtificialBoundary(point)); if (!polygon.length) return; const sign = objective.sense === "min" ? 1 : -1; const score = (point) => sign * (objective.c1 * point[0] + objective.c2 * point[1]); let current = 0; polygon.forEach((point, index) => { if (score(point) > score(polygon[current])) current = index; }); const path = [current]; let guard = 0;
    while (guard < 30) { guard += 1; const here = path[path.length - 1]; const neighbors = [(here + 1) % polygon.length, (here - 1 + polygon.length) % polygon.length]; let best = null; neighbors.forEach((neighbor) => { if (score(polygon[neighbor]) < score(polygon[here]) - 1e-9 && (best === null || score(polygon[neighbor]) < score(polygon[best]))) best = neighbor; }); if (best === null) break; path.push(best); }
    const points = path.map((index) => polygon[index]); const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches; const duration = Math.max(1, points.length - 1) * 900; const start = performance.now();
    const overlay = (elapsed) => { const clamped = Math.min(elapsed, duration); const segment = points.length > 1 ? Math.min(Math.floor(clamped / 900), points.length - 2) : 0; const fraction = points.length > 1 ? Math.min(1, (clamped - segment * 900) / 900) : 1; draw(); context.save(); context.strokeStyle = "#1a7d3c"; context.lineWidth = 4; context.lineCap = "round"; context.beginPath(); context.moveTo(xPixel(points[0][0]), yPixel(points[0][1])); for (let index = 1; index <= segment; index += 1) context.lineTo(xPixel(points[index][0]), yPixel(points[index][1])); let point = points[0]; if (points.length > 1) { const from = points[segment]; const to = points[segment + 1]; point = [from[0] + fraction * (to[0] - from[0]), from[1] + fraction * (to[1] - from[1])]; context.lineTo(xPixel(point[0]), yPixel(point[1])); } context.stroke(); context.beginPath(); context.arc(xPixel(point[0]), yPixel(point[1]), 9, 0, Math.PI * 2); context.fillStyle = "#1a7d3c"; context.fill(); context.restore(); };
    if (reduced) { overlay(duration); announce?.(`Simplex walk completed in ${points.length - 1} improving edge moves.`); return; }
    const frame = (now) => { const elapsed = now - start; overlay(elapsed); if (elapsed < duration) animationFrame = requestAnimationFrame(frame); else { animationFrame = null; announce?.(`Simplex walk completed in ${points.length - 1} improving edge moves.`); } }; animationFrame = requestAnimationFrame(frame);
  };

  const onPreset = () => loadPreset(presetInput.value); const onC1 = updateObjective; const onC2 = updateObjective; const onLevel = () => { stopWalk(); draw(); }; presetInput.addEventListener("change", onPreset); c1Input.addEventListener("input", onC1); c2Input.addEventListener("input", onC2); levelInput.addEventListener("input", onLevel); flipButton.addEventListener("click", flip); addButton.addEventListener("click", addConstraint); walkButton.addEventListener("click", simplexWalk); canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove); canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerUp); canvas.addEventListener("keydown", keyboardAim); loadPreset("ex16", false);
  return () => { stopWalk(); presetInput.removeEventListener("change", onPreset); c1Input.removeEventListener("input", onC1); c2Input.removeEventListener("input", onC2); levelInput.removeEventListener("input", onLevel); flipButton.removeEventListener("click", flip); addButton.removeEventListener("click", addConstraint); walkButton.removeEventListener("click", simplexWalk); canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove); canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerUp); canvas.removeEventListener("keydown", keyboardAim); };
}

function mountTriptych(root, announce) {
  const lpCanvas = root.querySelector("[data-tri-lp]");
  const mipCanvas = root.querySelector("[data-tri-mip]");
  const nlpCanvas = root.querySelector("[data-tri-nlp]");
  const relaxButton = root.querySelector("[data-tri-relax]");
  const cutsButton = root.querySelector("[data-tri-cuts]");
  const polygon = [[38, 240], [58, 88], [168, 44], [300, 96], [322, 214], [198, 258]];
  const objective = (point) => point[0] - .9 * point[1];
  const inPolygon = (x, y) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j];
      if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  const star = (context, x, y, radius, color, hollow = false) => {
    context.beginPath();
    for (let index = 0; index < 10; index += 1) { const angle = -Math.PI / 2 + index * Math.PI / 5; const r = index % 2 ? radius * .45 : radius; const px = x + r * Math.cos(angle); const py = y + r * Math.sin(angle); index ? context.lineTo(px, py) : context.moveTo(px, py); }
    context.closePath(); if (hollow) { context.strokeStyle = color; context.lineWidth = 2.5; context.stroke(); } else { context.fillStyle = color; context.fill(); }
  };
  const base = (context, fill) => { context.clearRect(0, 0, 368, 290); context.beginPath(); polygon.forEach((point, index) => index ? context.lineTo(...point) : context.moveTo(...point)); context.closePath(); if (fill) { context.fillStyle = "rgba(134,31,65,.13)"; context.fill(); } context.strokeStyle = "#861f41"; context.lineWidth = 2.2; context.stroke(); };
  const contours = (context) => { context.strokeStyle = "#e5751f"; context.lineWidth = 1.4; context.setLineDash([6, 5]); for (let value = -160; value <= 320; value += 60) { context.beginPath(); context.moveTo(value, 0); context.lineTo(value + .9 * 290, 290); context.stroke(); } context.setLineDash([]); };
  const lpOptimum = polygon.reduce((best, point) => objective(best) > objective(point) ? best : point);
  const drawLP = () => { const context = lpCanvas.getContext("2d"); base(context, true); contours(context); star(context, lpOptimum[0], lpOptimum[1], 11, "#1a7d3c"); context.fillStyle = "#1a7d3c"; context.font = "bold 13px sans-serif"; context.fillText("optimum", lpOptimum[0] - 78, lpOptimum[1] - 2); };
  const lattice = []; for (let x = 48; x < 340; x += 26) for (let y = 48; y < 276; y += 26) if (inPolygon(x, y)) lattice.push([x, y]);
  const integerOptimum = lattice.reduce((best, point) => objective(best) > objective(point) ? best : point);
  let relaxed = false;
  const drawMIP = () => { const context = mipCanvas.getContext("2d"); base(context, relaxed); context.globalAlpha = relaxed ? .3 : 1; lattice.forEach((point) => { context.beginPath(); context.arc(point[0], point[1], 3.4, 0, Math.PI * 2); context.fillStyle = "#5a4634"; context.fill(); }); context.globalAlpha = 1; if (relaxed) { star(context, lpOptimum[0], lpOptimum[1], 11, "#1a7d3c"); star(context, integerOptimum[0], integerOptimum[1], 9, "#b25a12", true); context.font = "bold 12px sans-serif"; context.fillStyle = "#1a7d3c"; context.fillText("LP relaxation optimum", lpOptimum[0] - 125, lpOptimum[1] - 4); context.fillStyle = "#b25a12"; context.fillText("best integer point", integerOptimum[0] - 105, integerOptimum[1] + 18); } else { star(context, integerOptimum[0], integerOptimum[1], 10, "#b25a12"); context.fillStyle = "#b25a12"; context.font = "bold 13px sans-serif"; context.fillText("best lattice point", integerOptimum[0] - 124, integerOptimum[1] + 20); } };
  const ellipse = { x: 182, y: 162, rx: 138, ry: 92 }; const contourCenter = { x: 330, y: 36 }; const ellipsePoint = (angle) => [ellipse.x + ellipse.rx * Math.cos(angle), ellipse.y + ellipse.ry * Math.sin(angle)];
  let optimumAngle = 0; let bestDistance = Infinity; for (let angle = 0; angle < 2 * Math.PI; angle += .01) { const [x, y] = ellipsePoint(angle); const distance = (x - contourCenter.x) ** 2 + (y - contourCenter.y) ** 2; if (distance < bestDistance) { bestDistance = distance; optimumAngle = angle; } }
  const nonlinearOptimum = ellipsePoint(optimumAngle); let showCuts = false;
  const drawNLP = () => { const context = nlpCanvas.getContext("2d"); context.clearRect(0, 0, 368, 290); context.beginPath(); context.ellipse(ellipse.x, ellipse.y, ellipse.rx, ellipse.ry, 0, 0, Math.PI * 2); context.fillStyle = "rgba(134,31,65,.13)"; context.fill(); context.strokeStyle = "#861f41"; context.lineWidth = 2.2; context.stroke(); context.strokeStyle = "#e5751f"; context.lineWidth = 1.4; context.setLineDash([6, 5]); [70, 130, 190, 250].forEach((radius) => { context.beginPath(); context.arc(contourCenter.x, contourCenter.y, radius, 0, Math.PI * 2); context.stroke(); }); context.setLineDash([]); if (showCuts) { context.strokeStyle = "#33658a"; context.lineWidth = 1.8; for (let index = 0; index < 7; index += 1) { const angle = optimumAngle + (index - 3) * .55; const [px, py] = ellipsePoint(angle); const dx = -ellipse.rx * Math.sin(angle); const dy = ellipse.ry * Math.cos(angle); const norm = Math.hypot(dx, dy); context.beginPath(); context.moveTo(px - dx / norm * 260, py - dy / norm * 260); context.lineTo(px + dx / norm * 260, py + dy / norm * 260); context.stroke(); } context.fillStyle = "#33658a"; context.font = "bold 12px sans-serif"; context.fillText("tangent cuts = LP outer approximation", 14, 278); } star(context, nonlinearOptimum[0], nonlinearOptimum[1], 10, "#1a7d3c"); context.fillStyle = "#1a7d3c"; context.font = "bold 12px sans-serif"; context.fillText("optimum on the curve", nonlinearOptimum[0] - 40, nonlinearOptimum[1] - 14); };
  const toggleRelaxation = () => { relaxed = !relaxed; relaxButton.textContent = relaxed ? "Back to integers" : "Relax integrality"; relaxButton.setAttribute("aria-pressed", String(relaxed)); drawMIP(); announce?.(relaxed ? "LP relaxation shown with both the fractional and integer optima." : "Integer feasible points shown without the relaxation."); };
  const toggleCuts = () => { showCuts = !showCuts; cutsButton.textContent = showCuts ? "Hide the cuts" : "Approximate by LPs"; cutsButton.setAttribute("aria-pressed", String(showCuts)); drawNLP(); announce?.(showCuts ? "Seven tangent-line LP outer-approximation cuts shown." : "Tangent cuts hidden."); };
  relaxButton.addEventListener("click", toggleRelaxation); cutsButton.addEventListener("click", toggleCuts); drawLP(); drawMIP(); drawNLP();
  return () => { relaxButton.removeEventListener("click", toggleRelaxation); cutsButton.removeEventListener("click", toggleCuts); };
}

function mountCube(root) {
  const canvas = root.querySelector("[data-cube-canvas]"); const context = canvas.getContext("2d");
  const vertices = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  let rotationX = -.42; let rotationY = .7; let dragging = false; let lastX = 0; let lastY = 0; let userTouched = false; let frameId = null;
  canvas.tabIndex = 0;
  const project = (point) => { const x = point[0] - .5; const y = point[1] - .5; const z = point[2] - .5; const cosY = Math.cos(rotationY); const sinY = Math.sin(rotationY); const x1 = cosY * x + sinY * z; const z1 = -sinY * x + cosY * z; const cosX = Math.cos(rotationX); const sinX = Math.sin(rotationX); const y2 = cosX * y - sinX * z1; const z2 = sinX * y + cosX * z1; return [250 + 185 * x1, 205 - 185 * y2, z2]; };
  const slicePoints = (level) => { const points = []; edges.forEach(([first, second]) => { const left = vertices[first]; const right = vertices[second]; const sumLeft = left[0] + left[1] + left[2]; const sumRight = right[0] + right[1] + right[2]; if ((sumLeft - level) * (sumRight - level) < 0) { const fraction = (level - sumLeft) / (sumRight - sumLeft); points.push([left[0] + fraction * (right[0] - left[0]), left[1] + fraction * (right[1] - left[1]), left[2] + fraction * (right[2] - left[2])]); } }); const projected = points.map(project); if (projected.length < 3) return projected; const centerX = projected.reduce((sum, point) => sum + point[0], 0) / projected.length; const centerY = projected.reduce((sum, point) => sum + point[1], 0) / projected.length; return projected.sort((left, right) => Math.atan2(left[1] - centerY, left[0] - centerX) - Math.atan2(right[1] - centerY, right[0] - centerX)); };
  const render = () => { context.clearRect(0, 0, 500, 420); [.6, 1.5, 2.4].forEach((level, index) => { const points = slicePoints(level); if (points.length >= 3) { context.beginPath(); points.forEach((point, pointIndex) => pointIndex ? context.lineTo(point[0], point[1]) : context.moveTo(point[0], point[1])); context.closePath(); context.fillStyle = `rgba(229,117,31,${.1 + .07 * index})`; context.fill(); context.strokeStyle = "rgba(229,117,31,.75)"; context.setLineDash([6, 5]); context.lineWidth = 1.6; context.stroke(); context.setLineDash([]); } }); context.strokeStyle = "#861f41"; context.lineWidth = 2.2; edges.forEach(([first, second]) => { const left = project(vertices[first]); const right = project(vertices[second]); context.globalAlpha = .45 + .55 * Math.max(0, (left[2] + right[2]) / 2 + .5); context.beginPath(); context.moveTo(left[0], left[1]); context.lineTo(right[0], right[1]); context.stroke(); }); context.globalAlpha = 1; vertices.forEach((vertex, index) => { const point = project(vertex); const optimal = index === 7; context.beginPath(); context.arc(point[0], point[1], optimal ? 8 : 4.5, 0, Math.PI * 2); context.fillStyle = optimal ? "#1a7d3c" : "#26282e"; context.fill(); if (optimal) { context.beginPath(); context.arc(point[0], point[1], 13, 0, Math.PI * 2); context.strokeStyle = "#1a7d3c"; context.lineWidth = 2.5; context.stroke(); context.fillStyle = "#1a7d3c"; context.font = "bold 15px sans-serif"; context.fillText("(1,1,1)  cost −3", point[0] + 16, point[1] + 4); } }); const origin = project([0, 0, 0]); context.fillStyle = "#777"; context.font = "13px sans-serif"; context.fillText("(0,0,0)", origin[0] + 8, origin[1] + 14); };
  const loop = () => { if (!dragging && !userTouched && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) rotationY += .004; render(); frameId = requestAnimationFrame(loop); };
  const down = (event) => { dragging = true; userTouched = true; lastX = event.clientX; lastY = event.clientY; canvas.setPointerCapture?.(event.pointerId); canvas.style.cursor = "grabbing"; };
  const move = (event) => { if (!dragging) return; rotationY += (event.clientX - lastX) * .008; rotationX -= (event.clientY - lastY) * .008; rotationX = Math.max(-1.4, Math.min(1.4, rotationX)); lastX = event.clientX; lastY = event.clientY; };
  const up = () => { dragging = false; canvas.style.cursor = "grab"; };
  const key = (event) => { if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return; event.preventDefault(); userTouched = true; if (event.key === "ArrowLeft") rotationY -= .12; if (event.key === "ArrowRight") rotationY += .12; if (event.key === "ArrowUp") rotationX = Math.min(1.4, rotationX + .12); if (event.key === "ArrowDown") rotationX = Math.max(-1.4, rotationX - .12); render(); };
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("keydown", key); loop();
  return () => { if (frameId) cancelAnimationFrame(frameId); canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("keydown", key); };
}

export const metadata = {
  id: "lecture-02",
  number: 2,
  referenceNumber: 1,
  title: "Introduction & Linear Optimization",
  subtitle: "Lecture 1 · ISE 5405: Optimization I",
  course: "ISE 5405 · Optimization I",
  date: "2026-08-27",
  whiteboards: 7,
  aspectRatio: "16:9",
  theme: "virginia-tech",
  homeUrl: "../../",
  pdfUrl: "../../materials/lecture_02.pdf",
};

export const deck = {
  schemaVersion: 1,
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  metadata,
  styles,
  slides,
};

export default deck;
