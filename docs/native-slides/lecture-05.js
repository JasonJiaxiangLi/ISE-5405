/**
 * Native Lecture 05: The Geometry of Linear Programming II.
 *
 * Instructional order and examples follow the faculty-authorized reference
 * deck. This module uses the repository's original native runtime and carries
 * no framework, asset, or runtime dependency on the private reference archive.
 */

const checkpointDegeneracy = Object.freeze({
  prompt: "Standard form, \\(n=7\\) variables, \\(m=4\\) equations. A basic solution is degenerate when…",
  choices: [
    "Exactly 3 components are zero",
    "More than 3 components are zero",
    "The basis matrix is singular",
    "Some component is negative",
  ],
  correctIndex: 1,
  explanation:
    "The \\(n-m\\) nonbasic variables are zero automatically. Degeneracy means at least one basic variable is zero too, so more than \\(n-m=3\\) components are zero.",
  autoOpen: true,
});

const checkpointExistence = Object.freeze({
  prompt: "Which polyhedron has no extreme point?",
  choices: [
    "The unit square",
    "A halfplane in \\(\\mathbb{R}^2\\)",
    "A triangle",
    "A nonempty standard-form polyhedron",
  ],
  correctIndex: 1,
  explanation:
    "A halfplane contains full lines, so it has no extreme point. Squares and triangles are polytopes; a nonempty standard-form polyhedron has a BFS.",
  autoOpen: true,
});

const checkpointOptimality = Object.freeze({
  prompt: "\\(P\\) has an extreme point and the LP has an optimal solution. Which statement is guaranteed?",
  choices: [
    "Every optimal solution is an extreme point",
    "At least one optimal solution is an extreme point",
    "The optimal solution is unique",
    "\\(P\\) is bounded",
  ],
  correctIndex: 1,
  explanation:
    "Theorem 2.7 guarantees some optimal extreme point. It does not require every optimum to be extreme, uniqueness, or boundedness.",
  autoOpen: true,
});

const basisMatrix = Object.freeze([
  Object.freeze([1, 1, 2, 1, 0, 0, 0]),
  Object.freeze([0, 1, 6, 0, 1, 0, 0]),
  Object.freeze([1, 0, 0, 0, 0, 1, 0]),
  Object.freeze([0, 1, 0, 0, 0, 0, 1]),
]);
const basisRhs = Object.freeze([8, 12, 4, 6]);

export const metadata = {
  id: "lecture-05",
  number: 5,
  title: "The Geometry of Linear Programming II",
  subtitle: "Lecture 4 · ISE 5405: Optimization I",
  course: "ISE 5405 · Optimization I",
  date: "2026-09-08",
  homeUrl: "../../",
  pdfUrl: "../../materials/lecture_05.pdf",
  whiteboards: 7,
};

export const slides = [
  {
    id: "l5-01",
    page: 1,
    kind: "title",
    className: "l5-title",
    eyebrow: "ISE 5405 · Optimization I",
    title: "The Geometry of Linear Programming II",
    html: String.raw`
      <div class="l5-title-grid">
        <div>
          <p class="l5-lede">Lecture 4 · Bases, Degeneracy, Existence &amp; Optimality</p>
          <p class="l5-muted">Bertsimas–Tsitsiklis §§2.3–2.8</p>
          <div class="ns-title-shortcuts" aria-label="Presentation keyboard shortcuts">
            <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span><span><kbd>←</kbd> back</span>
            <span><kbd>F</kbd> fullscreen</span><span><kbd>M</kbd> menu</span>
            <span><kbd>P</kbd> pen</span><span><kbd>E</kbd> eraser</span>
            <span><kbd>C</kbd> clear ink</span><span><kbd>L</kbd> laser</span>
            <span><kbd>W</kbd> whiteboard</span><span><kbd>H</kbd> handout</span>
            <span><kbd>K</kbd> checkpoint</span><span><kbd>?</kbd> help</span>
          </div>
          <p class="ns-title-handout"><strong>Saving an annotated PDF:</strong> press <kbd>H</kbd>, then print and choose “Save as PDF.” All reveals and saved slide ink are included. On iPad, use Share → Print → Save to Files; Export ink / Import ink moves annotations between devices.</p>
        </div>
        <svg class="l5-title-art" viewBox="0 0 420 320" role="img" aria-label="A polytope with objective level lines and an optimal corner">
          <defs><linearGradient id="l5-title-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e87722" stop-opacity=".2"/><stop offset="1" stop-color="#861f41" stop-opacity=".3"/></linearGradient></defs>
          <polygon points="65,240 135,90 250,58 350,140 325,245 175,292" fill="url(#l5-title-fill)" stroke="#861f41" stroke-width="5"/>
          <g stroke="#e87722" stroke-width="3" stroke-dasharray="10 8"><line x1="15" y1="215" x2="395" y2="112"/><line x1="15" y1="170" x2="395" y2="67"/></g>
          <circle cx="250" cy="58" r="12" fill="#fff" stroke="#277a48" stroke-width="6"/>
        </svg>
      </div>`,
  },
  {
    id: "l5-02",
    page: 2,
    title: "Today",
    html: String.raw`
      <ol class="l5-route">
        <li><strong>Corners in standard form</strong><span>bases, basic variables, and a BFS · §2.3</span></li>
        <li><strong>Degeneracy</strong><span>too many active constraints at one point · §2.4</span></li>
        <li><strong>Existence</strong><span>which polyhedra have corners · §2.5</span></li>
        <li><strong>Optimality</strong><span>why searching corners is enough · §2.6</span></li>
        <li><strong>Representations</strong><span>convex hulls and Fourier–Motzkin · §§2.7–2.8</span></li>
      </ol>
      <aside class="l5-callout" data-tone="orange" data-reveal><strong>Destination:</strong> a finite candidate set, an adjacency structure to walk on, and a guarantee that the walk is worth taking.</aside>`,
  },
  {
    id: "l5-03",
    page: 3,
    title: "Polyhedra in Standard Form (§2.3)",
    html: String.raw`
      <div class="l5-equation ns-math" role="math" aria-label="P equals x in R n such that A x equals b and x is nonnegative">\[P=\{x\in\mathbb{R}^n:Ax=b,\ x\ge0\},\qquad A\in\mathbb{R}^{m\times n}.\]</div>
      <section class="l5-card"><h3>Standing assumption</h3><p>The \(m\) rows of \(A\) are linearly independent—full row rank—so \(m\le n\).</p></section>
      <div class="l5-two">
        <section class="l5-card" data-reveal="rank"><h3>Theorem 2.5</h3><p>If \(P\) is nonempty and \(\operatorname{rank}(A)=k&lt;m\), deleting dependent equations leaves exactly the same polyhedron.</p></section>
        <section class="l5-card" data-reveal="count"><h3>Counting intuition</h3><p>\(Ax=b\) uses \(m\) degrees of freedom, leaving an \((n-m)\)-dimensional affine world. Only \(x\ge0\) remains to constrain it, and a corner pins all \(n-m\) freedoms with that many active bounds \(x_i=0\).</p></section>
      </div>
      <aside class="l5-callout" data-tone="maroon" data-reveal="count"><strong>Corner = a choice of which variables may remain nonzero.</strong></aside>`,
  },
  {
    id: "l5-04",
    page: 4,
    title: "Basic Solutions in Standard Form (Thm 2.4)",
    html: String.raw`
      <section class="l5-card l5-theorem-statement">
        <h3>Theorem</h3>
        <p>\(x\) is a basic solution of \(\{Ax=b,\ x\ge0\}\) if and only if \(Ax=b\) and there are indices \(B(1),\ldots,B(m)\) such that:</p>
        <ol class="l5-theorem-conditions" type="a">
          <li>columns \(A_{B(1)},\ldots,A_{B(m)}\) are linearly independent; and</li>
          <li>\(x_i=0\) for every \(i\notin\{B(1),\ldots,B(m)\}\).</li>
        </ol>
      </section>
      <ol class="l5-steps" data-reveal="recipe">
        <li><strong>Choose</strong> \(m\) independent columns—the basis matrix \(B\).</li>
        <li><strong>Zero</strong> every nonbasic variable.</li>
        <li><strong>Solve</strong> \(Bx_B=b\), so \(x_B=B^{-1}b\).</li>
      </ol>
      <div class="l5-two" data-reveal="verdict">
        <aside class="l5-callout" data-tone="green"><strong>\(x_B\ge0\):</strong> basic feasible solution.</aside>
        <aside class="l5-callout" data-tone="orange"><strong>Some \((x_B)_i&lt;0\):</strong> basic but infeasible—a corner of the algebra, not of \(P\).</aside>
      </div>
      <aside class="l5-callout" data-tone="blue" data-reveal="terminology"><strong>Terminology:</strong> \(B=[A_{B(1)}\ \cdots\ A_{B(m)}]\) is the basis matrix; \(B(1),\ldots,B(m)\) are the basic indices.</aside>`,
  },
  {
    id: "l5-05",
    page: 5,
    className: "l5-basis-slide",
    eyebrow: "Example 2.1 · Drive the theorem",
    title: "Pick a Basis, Get a Corner (or Not)",
    html: String.raw`
      <div class="l5-basis-layout">
        <section class="l5-basis-workspace">
          <div class="l5-basis-model l5-basis-model-wide ns-math" role="math" aria-label="A four by seven matrix times x equals the vector eight, twelve, four, six; x is nonnegative">
            \[\begin{bmatrix}1&1&2&1&0&0&0\\0&1&6&0&1&0&0\\1&0&0&0&0&1&0\\0&1&0&0&0&0&1\end{bmatrix}x=\begin{bmatrix}8\\12\\4\\6\end{bmatrix},\qquad x\ge0.\]
          </div>
          <div class="l5-basis-model l5-basis-model-mobile ns-math" role="math" aria-label="A four by seven matrix; b equals eight, twelve, four, six; A x equals b and x is nonnegative">
            <p class="l5-mobile-model-label">Read \(A\) by columns:</p>
            <div class="l5-mobile-matrix-columns">
              <span>\(A_1=(1,0,1,0)^\top\)</span><span>\(A_2=(1,1,0,1)^\top\)</span>
              <span>\(A_3=(2,6,0,0)^\top\)</span><span>\(A_4=(1,0,0,0)^\top\)</span>
              <span>\(A_5=(0,1,0,0)^\top\)</span><span>\(A_6=(0,0,1,0)^\top\)</span>
              <span>\(A_7=(0,0,0,1)^\top\)</span>
            </div>
            \[b=\begin{bmatrix}8\\12\\4\\6\end{bmatrix},\qquad Ax=b,\quad x\ge0.\]
          </div>
          <p class="l5-basis-instruction">\(n=7\) variables, \(m=4\) equations \(\longrightarrow\) pick exactly four columns.</p>
          <fieldset class="l5-basis-picker">
            <legend>Basis \(\{B(1),\ldots,B(4)\}\)</legend>
            <div class="l5-basis-columns" role="group" aria-label="Matrix columns available for the basis">
              <label class="l5-basis-column" for="l5-basis-a1"><span>\(A_1\)</span><input id="l5-basis-a1" type="checkbox" value="1" data-basis-column></label>
              <label class="l5-basis-column" for="l5-basis-a2"><span>\(A_2\)</span><input id="l5-basis-a2" type="checkbox" value="2" data-basis-column></label>
              <label class="l5-basis-column" for="l5-basis-a3"><span>\(A_3\)</span><input id="l5-basis-a3" type="checkbox" value="3" data-basis-column></label>
              <label class="l5-basis-column" for="l5-basis-a4"><span>\(A_4\)</span><input id="l5-basis-a4" type="checkbox" value="4" data-basis-column></label>
              <label class="l5-basis-column" for="l5-basis-a5"><span>\(A_5\)</span><input id="l5-basis-a5" type="checkbox" value="5" data-basis-column></label>
              <label class="l5-basis-column" for="l5-basis-a6"><span>\(A_6\)</span><input id="l5-basis-a6" type="checkbox" value="6" data-basis-column></label>
              <label class="l5-basis-column" for="l5-basis-a7"><span>\(A_7\)</span><input id="l5-basis-a7" type="checkbox" value="7" data-basis-column></label>
            </div>
            <div class="l5-basis-presets" role="group" aria-label="Example basis selections">
              <button type="button" data-basis-preset="4,5,6,7" aria-pressed="false">Try \(\{4,5,6,7\}\)</button>
              <button type="button" data-basis-preset="3,5,6,7" aria-pressed="false">Try \(\{3,5,6,7\}\)</button>
              <button type="button" data-basis-preset="1,2,3,4" aria-pressed="false">Try \(\{1,2,3,4\}\)</button>
            </div>
          </fieldset>
        </section>
        <div class="l5-basis-output">
          <section class="l5-result" data-basis-result aria-live="polite">
            <h3>Select exactly four columns</h3>
            <p><strong>0 of 4 selected.</strong></p>
            <p>Every four-column choice is tested by solving \(Bx_B=b\), not by looking up a canned answer.</p>
          </section>
          <aside class="l5-callout l5-basis-summary" data-tone="orange" data-reveal><strong>The simplex data structure:</strong> singular \(\to\) none; negative \(\to\) infeasible; nonnegative \(\to\) BFS; zero basic value \(\to\) degenerate.</aside>
        </div>
      </div>
      `,
    printHtml: String.raw`
      <div class="l5-basis-layout l5-basis-print">
        <section class="l5-basis-workspace">
          <div class="l5-basis-model ns-math" role="math" aria-label="A four by seven matrix times x equals the vector eight, twelve, four, six; x is nonnegative">
            \[\begin{bmatrix}1&1&2&1&0&0&0\\0&1&6&0&1&0&0\\1&0&0&0&0&1&0\\0&1&0&0&0&0&1\end{bmatrix}x=\begin{bmatrix}8\\12\\4\\6\end{bmatrix},\qquad x\ge0.\]
          </div>
          <p class="l5-basis-instruction">Worked state: choose basis \(\{A_1,A_2,A_3,A_4\}\).</p>
          <div class="l5-basis-print-selection" aria-label="Columns A1 through A4 selected; A5 through A7 not selected">
            <span data-selected>\(A_1\)</span><span data-selected>\(A_2\)</span><span data-selected>\(A_3\)</span><span data-selected>\(A_4\)</span><span>\(A_5\)</span><span>\(A_6\)</span><span>\(A_7\)</span>
          </div>
        </section>
        <div class="l5-basis-output">
          <section class="l5-result" data-tone="warn">
            <h3>Basis \(\{A_1,A_2,A_3,A_4\}\)</h3>
            <p class="l5-basis-vector ns-math">\[x=(4,6,1,-4,0,0,0).\]</p>
            <p class="l5-basis-verdict"><strong>Basic solution · infeasible</strong></p>
            <p>The basis is nonsingular, but \(x_4=-4\) violates nonnegativity.</p>
          </section>
          <aside class="l5-callout l5-basis-summary" data-tone="orange"><strong>The simplex data structure:</strong> singular \(\to\) none; negative \(\to\) infeasible; nonnegative \(\to\) BFS; zero basic value \(\to\) degenerate.</aside>
        </div>
      </div>
      `,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountBasisChooser(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l5-06",
    page: 6,
    title: "Degeneracy (§2.4)",
    html: String.raw`
      <div class="l5-degeneracy-layout">
        <section class="l5-card"><h3>Definitions 2.10–2.11</h3><p>A basic solution is <strong>degenerate</strong> when more than \(n\) constraints are active. In standard form: more than \(n-m\) components are zero, so a basic variable is zero too.</p></section>
        <section class="l5-degeneracy-example" aria-labelledby="l5-degeneracy-example-title">
          <h3 id="l5-degeneracy-example-title">Example of Degeneracy</h3>
          <div class="l5-degeneracy-model">
            <p>Consider the polyhedron defined by:</p>
            <div class="l5-degeneracy-system ns-math" role="math" aria-label="x 1 plus x 2 plus 2 x 3 is at most 8; x 2 plus 6 x 3 is at most 12; x 1 is at most 4; x 2 is at most 6; and x 1, x 2, x 3 are nonnegative">
              \[\begin{aligned}
                x_1+x_2+2x_3 &\le 8,\\
                x_2+6x_3 &\le 12,\\
                x_1 &\le 4,\\
                x_2 &\le 6,\\
                x_1,x_2,x_3 &\ge 0.
              \end{aligned}\]
            </div>
          </div>
          <ul class="l5-degeneracy-points">
            <li>\(x=(2,6,0)\): <strong>nondegenerate</strong>—exactly three active constraints.</li>
            <li>\(x=(4,0,2)\): <strong>degenerate</strong>—four active constraints, three linearly independent.</li>
          </ul>
        </section>
        <aside class="l5-callout" data-tone="orange" data-reveal><strong>Why care?</strong> Several bases may encode one point, so simplex can change basis without moving—the seed of cycling. Degeneracy is rare in random data but common in structured models.</aside>
      </div>`,
    checkpoint: checkpointDegeneracy,
  },
  {
    id: "l5-07",
    page: 7,
    title: "When Do Corners Exist? (§2.5)",
    html: String.raw`
      <div class="l5-visual-layout">
        <div>
          <p>A halfplane in \(\mathbb{R}^2\) has no extreme point.</p>
          <section class="l5-card"><h3>Contains a line</h3><p>Some \(\bar{x}\in P\) and \(d\ne0\) satisfy \(\bar{x}+\lambda d\in P\) for every \(\lambda\in\mathbb{R}\).</p></section>
          <section class="l5-card" data-reveal="equivalence"><h3>Theorem 2.6</h3><p>For nonempty \(P=\{x:a_i^\top x\ge b_i\}\), these are equivalent: \(P\) has an extreme point; \(P\) contains no line; \(n\) of the vectors \(a_i\) are linearly independent.</p></section>
          <aside class="l5-callout" data-tone="green" data-reveal="corollary"><strong>Corollary 2.2:</strong> nonempty bounded and nonempty standard-form polyhedra always have a BFS.</aside>
        </div>
        <svg class="l5-figure" viewBox="0 0 480 340" role="img" aria-label="A strip containing a line above a bounded polytope with corners">
          <polygon points="0,70 480,18 480,135 0,190" fill="#e9f2f8"/>
          <g stroke="#2f668e" stroke-width="4"><line x1="0" y1="70" x2="480" y2="18"/><line x1="0" y1="190" x2="480" y2="135"/></g>
          <line x1="25" y1="132" x2="455" y2="80" stroke="#a23b32" stroke-width="5" stroke-dasharray="12 8"/>
          <text x="145" y="115" font-size="18" fill="#a23b32" font-weight="700">full line · no corners</text>
          <g data-reveal="equivalence"><polygon points="65,315 115,238 245,225 385,265 340,326 125,330" fill="#f3e5ea" stroke="#861f41" stroke-width="4"/><g fill="#277a48"><circle cx="65" cy="315" r="8"/><circle cx="115" cy="238" r="8"/><circle cx="245" cy="225" r="8"/><circle cx="385" cy="265" r="8"/></g><text x="132" y="291" font-size="18" fill="#861f41" font-weight="700">no line inside → corners exist</text></g>
        </svg>
      </div>`,
  },
  {
    id: "l5-08",
    page: 8,
    title: "Click-through: Extreme Point ⇒ No Line",
    html: String.raw`
      <p class="l5-lede"><strong>Claim:</strong> if \(P\) has an extreme point \(x^{\mathrm{ext}}\), then \(P\) contains no line.</p>
      <ol class="l5-proof l5-sequence">
        <li data-sequence-step><strong>Contradiction setup.</strong> Assume \(\bar{x}+\lambda d\in P\) for all \(\lambda\in\mathbb{R}\), with \(d\ne0\).</li>
        <li data-sequence-step hidden><strong>Transport the direction.</strong> A full line in \(P=\{x:Ax\ge b\}\) forces \(Ad=0\), so \(x^{\mathrm{ext}}\pm d\in P\).</li>
        <li data-sequence-step hidden><strong>Midpoint witness.</strong> \(x^{\mathrm{ext}}=\tfrac12(x^{\mathrm{ext}}+d)+\tfrac12(x^{\mathrm{ext}}-d)\).</li>
        <li data-sequence-step hidden><strong>Contradiction.</strong> The two endpoints are distinct feasible points, violating extremality. Therefore \(P\) contains no line. \(\square\)</li>
      </ol>
      <div class="l5-sequence-controls"><button type="button" data-sequence-previous>Previous step</button><output data-sequence-progress aria-live="polite"></output><button type="button" data-sequence-next>Next step</button></div>
      <aside class="l5-callout" data-tone="blue">The reverse directions use the rank condition in Theorem 2.6.</aside>`,
    onMount: ({ slideElement, announce }) => mountCumulativeSequence(slideElement, announce),
  },
  {
    id: "l5-09",
    page: 9,
    title: "Optimality of Extreme Points (§2.6)",
    html: String.raw`
      <div class="l5-visual-layout">
        <div>
          <section class="l5-card"><h3>Theorem 2.7</h3><p>If \(P\) has an extreme point and the minimum is attained, <strong>some optimal solution is an extreme point</strong>.</p></section>
          <section class="l5-card" data-reveal="stronger"><h3>Theorem 2.8</h3><p>If \(P\) has an extreme point, either the cost is \(-\infty\) or an extreme point is optimal.</p></section>
          <aside class="l5-callout" data-tone="green" data-reveal="stronger"><strong>Corollary 2.3:</strong> a nonempty LP is unbounded below or attains an optimum—no \(e^x\)-style pathology.</aside>
          <p class="l5-muted" data-reveal="stronger">A last-contact level may touch one corner or a whole optimal edge; an optimal edge includes extreme points.</p>
        </div>
        <div class="l5-sweep-tool">
          <svg class="l5-figure" viewBox="0 0 470 330" role="img" aria-label="Objective level line sweeping across a polygon toward an optimal corner">
            <polygon points="55,280 385,292 425,100 260,42 95,125" fill="#f4e5eb" stroke="#861f41" stroke-width="5"/>
            <g fill="#861f41"><circle cx="55" cy="280" r="7"/><circle cx="385" cy="292" r="7"/><circle cx="425" cy="100" r="7"/><circle cx="260" cy="42" r="7"/><circle cx="95" cy="125" r="7"/></g>
            <line data-level-line x1="-60" y1="260" x2="530" y2="95" stroke="#e87722" stroke-width="6" stroke-dasharray="12 8"/>
            <circle data-optimal-corner cx="55" cy="280" r="13" fill="#277a48" hidden/>
          </svg>
          <button type="button" data-sweep-play>Sweep to the last contact ▶</button>
          <label>Sweep the level line <input type="range" min="0" max="100" value="15" data-sweep><output data-sweep-value>15%</output></label>
          <p class="l5-status" data-sweep-status aria-live="polite">Move the objective toward its last feasible contact.</p>
        </div>
      </div>`,
    checkpoint: checkpointExistence,
    onMount: ({ slideElement, announce }) => mountObjectiveSweep(slideElement, announce),
  },
  {
    id: "l5-10",
    page: 10,
    eyebrow: "Proof workshop · Theorem 2.7",
    title: "Some Optimal Solution is an Extreme Point",
    html: String.raw`
      <section class="l5-workshop">
        <div class="l5-workshop-state"><span><strong>Assumptions</strong><output data-l5-workshop-assumption>—</output></span><span><strong>To show</strong><output data-l5-workshop-goal>—</output></span></div>
        <div class="l5-workshop-stage" role="region" aria-label="Cumulative proof history" tabindex="0">
          <article data-l5-workshop-step data-l5-assume="\(P\) has an extreme point; \(v=\min_{x\in P}c^\top x\) is attained" data-l5-goal="some optimal solution is extreme in \(P\)" tabindex="-1"><h3>Name the optimal face.</h3><p>Let \(Q=\{x\in P:c^\top x=v\}\), the set of all optimal solutions. We will find a corner of \(Q\), then promote it to a corner of \(P\).</p></article>
          <article data-l5-workshop-step data-l5-question data-l5-assume="\(Q=\{x\in P:c^\top x=v\}\)" data-l5-goal="show \(Q\) is a polyhedron" tabindex="-1"><h3>Why is \(Q\) a polyhedron?</h3><div class="l5-workshop-choices"><button type="button" data-l5-workshop-choice data-correct data-explanation="\(Q=P\cap\{x:c^\top x\le v\}\cap\{x:c^\top x\ge v\}\), an intersection of finitely many halfspaces.">Add \(c^\top x\le v\) and \(c^\top x\ge v\) to \(P\)</button><button type="button" data-l5-workshop-choice data-explanation="An optimal face can be unbounded; boundedness is not the reason.">Because \(Q\) is bounded</button><button type="button" data-l5-workshop-choice data-explanation="It is a polyhedron: one equality is two opposing linear inequalities.">It is not one in general</button></div><output class="l5-workshop-feedback" data-l5-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output></article>
          <article data-l5-workshop-step data-l5-question data-l5-assume="\(Q\) is a nonempty polyhedron and \(Q\subseteq P\)" data-l5-goal="find an extreme point of \(Q\)" tabindex="-1"><h3>Why must \(Q\) have an extreme point?</h3><div class="l5-workshop-choices"><button type="button" data-l5-workshop-choice data-correct data-explanation="Theorem 2.6 says \(P\) has an extreme point iff it contains no line. A subset of a line-free set is line-free, so nonempty polyhedron \(Q\) has an extreme point too.">\(P\) contains no line, so \(Q\subseteq P\) contains no line</button><button type="button" data-l5-workshop-choice data-explanation="Nonempty is insufficient: a halfplane is nonempty and has no extreme point.">Because \(Q\) is nonempty</button></div><output class="l5-workshop-feedback" data-l5-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output></article>
          <article data-l5-workshop-step data-l5-assume="\(x^*\) is an extreme point of \(Q\)" data-l5-goal="\(x^*\) is extreme in \(P\)" tabindex="-1"><h3>Promote a corner from the smaller set.</h3><p>Choose an extreme point \(x^*\) of \(Q\). It is already optimal; the remaining work is to prove it stays extreme in the larger set \(P\).</p></article>
          <article data-l5-workshop-step data-l5-question data-l5-assume="\(x^*\) extreme in \(Q\)" data-l5-goal="negate extreme-in-\(P\)" tabindex="-1"><h3>For contradiction, what may we assume?</h3><div class="l5-workshop-choices"><button type="button" data-l5-workshop-choice data-correct data-explanation="Negating extreme-in-\(P\) gives distinct witnesses from \(P\), not yet from \(Q\), with \(x^*\) strictly between them.">\(x^*=\lambda y+(1-\lambda)z\), \(y,z\in P\setminus\{x^*\}\), \(0&lt;\lambda&lt;1\)</button><button type="button" data-l5-workshop-choice data-explanation="If \(y,z\in Q\), extremality in \(Q\) is already contradicted. The work is to drag witnesses from \(P\) into \(Q\).">\(y,z\in Q\)</button></div><output class="l5-workshop-feedback" data-l5-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output></article>
          <article data-l5-workshop-step data-l5-assume="\(x^*=\lambda y+(1-\lambda)z\), \(y,z\in P\), \(0&lt;\lambda&lt;1\)" data-l5-goal="show \(y,z\in Q\)" tabindex="-1"><h3>Average at the minimum.</h3><p>Both costs satisfy \(c^\top y\ge v\) and \(c^\top z\ge v\), while \(\lambda c^\top y+(1-\lambda)c^\top z=c^\top x^*=v\). Positive weights leave no room: \(c^\top y=c^\top z=v\).</p></article>
          <article data-l5-workshop-step data-l5-question data-l5-assume="\(y,z\in P\) and \(c^\top y=c^\top z=v\)" data-l5-goal="locate the contradiction" tabindex="-1"><h3>So what?</h3><div class="l5-workshop-choices"><button type="button" data-l5-workshop-choice data-correct data-explanation="Membership in \(P\) plus cost \(v\) is exactly membership in \(Q\); now \(x^*\) is a strict combination of two points of \(Q\).">\(y,z\in Q\), contradicting extremality of \(x^*\) in \(Q\)</button><button type="button" data-l5-workshop-choice data-explanation="Optimal points need not be equal; an entire face can be optimal.">\(y=z\)</button></div><output class="l5-workshop-feedback" data-l5-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output></article>
          <article data-l5-workshop-step data-l5-assume="no nontrivial witnesses in \(P\) exist" data-l5-goal="DONE" tabindex="-1"><h3>Conclude.</h3><p>Thus \(x^*\) is extreme in \(P\), and because \(x^*\in Q\), it is optimal. Some optimal solution is an extreme point. \(\square\)</p></article>
        </div>
        <div class="l5-workshop-controls"><button type="button" data-l5-workshop-previous>Previous move</button><output data-l5-workshop-progress aria-live="polite"></output><button type="button" data-l5-workshop-next>Next move</button><button type="button" data-l5-workshop-restart>Restart</button></div>
      </section>`,
    printHtml: String.raw`
      <ol class="l5-proof l5-proof-print"><li>Let \(v\) be attained and \(Q=\{x\in P:c^\top x=v\}\); \(Q\) is a nonempty polyhedron.</li><li>\(P\) contains no line, so \(Q\) contains no line and has an extreme point \(x^*\).</li><li>If \(x^*=\lambda y+(1-\lambda)z\) for \(y,z\in P\), optimality forces \(c^\top y=c^\top z=v\), so \(y,z\in Q\).</li><li>That contradicts extremality in \(Q\). Thus \(x^*\) is both extreme in \(P\) and optimal. \(\square\)</li></ol>`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountGuidedWorkshop(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l5-11",
    page: 11,
    title: "The Other Representation: Convex Hulls (§2.7)",
    html: String.raw`
      <div class="l5-visual-layout">
        <div>
          <section class="l5-card"><h3>Definition 2.5</h3><p>A convex combination is \(\sum_{i=1}^k\lambda_i x_i\) with \(\lambda_i\ge0\) and \(\sum_{i=1}^k\lambda_i=1\). Their set is the convex hull.</p></section>
          <aside class="l5-callout" data-tone="orange"><strong>Theorem 2.9:</strong> a nonempty polytope is the convex hull of its extreme points.</aside>
          <p>Inequalities describe the object outside-in; corner combinations describe it inside-out.</p>
        </div>
        <div class="l5-hull-tool">
          <p class="l5-status l5-hull-instruction">Drag any point. Keyboard: focus a point and use the arrow keys; the three buttons move point 6 to representative states.</p>
          <svg class="l5-figure l5-hull-svg" data-hull-svg viewBox="0 0 470 330" role="application" aria-label="Six movable points and their computed convex hull. Drag a point or focus it and use arrow keys.">
            <polygon data-hull-polygon points="90,220 150,70 290,55 380,150 300,255" class="l5-hull-polygon"/>
            <circle data-hull-handle="0" tabindex="0" cx="90" cy="220" r="11"/><circle data-hull-handle="1" tabindex="0" cx="150" cy="70" r="11"/><circle data-hull-handle="2" tabindex="0" cx="290" cy="55" r="11"/><circle data-hull-handle="3" tabindex="0" cx="380" cy="150" r="11"/><circle data-hull-handle="4" tabindex="0" cx="300" cy="255" r="11"/><circle data-hull-handle="5" tabindex="0" cx="210" cy="160" r="11"/>
          </svg>
          <div class="l5-tool-buttons" role="group" aria-label="Move point six to a representative state">
            <button type="button" data-hull-state="inside" aria-pressed="true">Interior</button><button type="button" data-hull-state="boundary" aria-pressed="false">Edge midpoint</button><button type="button" data-hull-state="outside" aria-pressed="false">New extreme</button>
          </div>
          <p class="l5-status" data-hull-status aria-live="polite">5 extreme points · 1 point inside or on an edge and therefore not needed as a hull vertex.</p>
        </div>
      </div>`,
    onMount: ({ slideElement, announce }) => mountHullTool(slideElement, announce),
  },
  {
    id: "l5-12",
    page: 12,
    title: "Fourier–Motzkin: Solving by Shadows (§2.8)",
    html: String.raw`
      <div class="l5-visual-layout">
        <div>
          <p><strong>Question:</strong> is \(P=\{x:Ax\ge b\}\) empty?</p>
          <section class="l5-card"><h3>Projection</h3><p>\(\Pi_{n-1}(P)\) forgets \(x_n\). Crucially, \(P\) is nonempty exactly when its shadow is nonempty.</p></section>
          <ol class="l5-steps" data-reveal="path"><li>Project \(\mathbb{R}^n\to\mathbb{R}^{n-1}\to\cdots\to\mathbb{R}\).</li><li>In \(\mathbb{R}\), test whether an interval \([\ell,u]\) with \(\ell\le u\) remains.</li></ol>
          <aside class="l5-callout" data-tone="blue" data-reveal="theorem"><strong>Theorem 2.10:</strong> the eliminated system is the projection, so projections of polyhedra are polyhedra. <strong>Corollary 2.6:</strong> convex hulls of finite point sets are polyhedra too.</aside>
        </div>
        <svg class="l5-figure" viewBox="0 0 470 340" role="img" aria-label="A polygon projected vertically to an interval on a line">
          <polygon points="100,60 270,40 390,125 335,235 155,245 72,145" fill="#f4e5eb" stroke="#861f41" stroke-width="5"/>
          <g stroke="#b8aba1" stroke-width="3" stroke-dasharray="8 7"><line x1="72" y1="145" x2="72" y2="292"/><line x1="390" y1="125" x2="390" y2="292"/><line x1="100" y1="60" x2="100" y2="292"/><line x1="335" y1="235" x2="335" y2="292"/></g>
          <line x1="35" y1="292" x2="445" y2="292" stroke="#667176" stroke-width="3"/><line x1="72" y1="292" x2="390" y2="292" stroke="#e87722" stroke-width="10"/>
          <text x="155" y="326" font-size="19" fill="#9a4c16" font-weight="700">shadow = projection Π₁(P)</text>
        </svg>
      </div>`,
  },
  {
    id: "l5-13",
    page: 13,
    title: "The Elimination Step",
    html: String.raw`
      <p>To eliminate \(x_n\), sort rows by the sign of its coefficient and normalize them as bounds.</p>
      <div class="l5-bound-grid">
        <section class="l5-card"><h3>Lower bounds · \(I^+\)</h3><p>\(x_n\ge d_i+f_i^\top\bar{x}\)</p></section>
        <section class="l5-card"><h3>Upper bounds · \(I^-\)</h3><p>\(d_j+f_j^\top\bar{x}\ge x_n\)</p></section>
        <section class="l5-card"><h3>Absent · \(I^0\)</h3><p>\(0\ge d_k+f_k^\top\bar{x}\)</p></section>
      </div>
      <p class="l5-center">Such an \(x_n\) exists exactly when every upper bound is at least every lower bound.</p>
      <aside class="l5-callout" data-tone="maroon" data-reveal="pair"><strong>Pair every lower with every upper:</strong> \(d_j+f_j^\top\bar{x}\ge d_i+f_i^\top\bar{x}\). Keep the \(I^0\) rows; \(x_n\) is gone.</aside>
      <div class="l5-two" data-reveal="lesson"><section class="l5-card"><h3>Cost</h3><p>Remove \(\lvert I^+\rvert+\lvert I^-\rvert\) rows and add \(\lvert I^+\rvert\lvert I^-\rvert\); repeated elimination can grow exponentially. Beautiful theory, terrible algorithm.</p></section><section class="l5-card"><h3>Why it matters</h3><p>Each new row is a nonnegative combination of old rows—the seed of Farkas' lemma and LP duality in Chapter 4.</p></section></div>`,
  },
  {
    id: "l5-14",
    page: 14,
    title: "Click-through: Fourier–Motzkin in Action",
    html: String.raw`
      <ol class="l5-proof l5-fm-proof l5-sequence">
        <li data-sequence-step><strong>Start.</strong> Seven rows include \(-x_1\ge-1\), \(-x_2\ge-1\), \(-x_3\ge-1\), \(-x_1-x_2\ge-3\), \(-x_1-x_3\ge-3\), \(-x_2-x_3\ge-3\), and \(x_1+x_2+x_3\ge6\).</li>
        <li data-sequence-step hidden><strong>Sort \(x_3\) bounds.</strong> Lower: \(x_3\ge6-x_1-x_2\). Uppers: \(x_3\le1\), \(x_3\le3-x_1\), \(x_3\le3-x_2\).</li>
        <li data-sequence-step hidden><strong>Pair them.</strong> Derive \(x_1+x_2\ge5\), \(x_2\ge3\), and \(x_1\ge3\).</li>
        <li data-sequence-step hidden><strong>Contradiction.</strong> The carried row \(x_1\le1\) conflicts with \(x_1\ge3\). The shadow—and therefore \(P\)—is empty. \(\square\)</li>
      </ol>
      <div class="l5-sequence-controls"><button type="button" data-sequence-previous>Previous step</button><output data-sequence-progress aria-live="polite"></output><button type="button" data-sequence-next>Next step</button></div>`,
    checkpoint: checkpointOptimality,
    onMount: ({ slideElement, announce }) => mountCumulativeSequence(slideElement, announce),
  },
  {
    id: "l5-15",
    page: 15,
    title: "Why is LP Special? The Three Properties, Earned",
    html: String.raw`
      <div class="l5-property-stack">
        <section class="l5-card"><h3>1 · Exact status trichotomy</h3><p>Every LP is infeasible, unbounded, or attains an optimal solution.</p></section>
        <section class="l5-card"><h3>2 · Local means global</h3><p>A linear objective over a convex set cannot trap us at a bad local optimum.</p></section>
        <section class="l5-card"><h3>3 · Corners suffice</h3><p>When an optimum exists over a polytope, an extreme point is optimal.</p></section>
      </div>
      <aside class="l5-callout" data-tone="orange" data-reveal><strong>The simplex birth certificate:</strong> finitely many candidates + an edge structure + a guarantee that the best corner is globally best.</aside>`,
  },
  {
    id: "l5-16",
    page: 16,
    title: "Key Takeaways",
    html: String.raw`
      <ul class="l5-takeaways">
        <li><strong>Bases:</strong> choose \(m\) independent columns, zero the rest, solve; feasibility decides BFS.</li>
        <li><strong>Degeneracy:</strong> extra active constraints can give many bases for one point.</li>
        <li><strong>Existence:</strong> corners \(\Longleftrightarrow\) no line inside \(\Longleftrightarrow\) \(n\) linearly independent vectors \(a_i\).</li>
        <li><strong>Optimality:</strong> searching corners is enough; Theorems 2.7–2.8 yield the exact status trichotomy in Property 1.</li>
        <li><strong>Representations:</strong> inequalities, convex hulls, and Fourier–Motzkin connect geometry to certificates.</li>
      </ul>
      <p class="l5-next">Next: the Simplex Method</p>
      <p class="l5-center l5-muted">We finally get to walk the corners.</p>`,
  },
];

function formatBasisValue(value) {
  if (Math.abs(value) < 1e-9) return "0";
  if (Math.abs(value - Math.round(value)) < 1e-9) return String(Math.round(value));
  return String(Number(value.toFixed(2)));
}

function solveBasis(selectedColumns) {
  const augmented = basisMatrix.map((row, rowIndex) => [
    ...selectedColumns.map((column) => row[column - 1]),
    basisRhs[rowIndex],
  ]);

  for (let column = 0; column < 4; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 4; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    if (Math.abs(augmented[pivot][column]) < 1e-9) return { state: "singular" };
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];

    const pivotValue = augmented[column][column];
    for (let entry = column; entry < 5; entry += 1) augmented[column][entry] /= pivotValue;
    for (let row = 0; row < 4; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let entry = column; entry < 5; entry += 1) {
        augmented[row][entry] -= factor * augmented[column][entry];
      }
    }
  }

  const basicValues = augmented.map((row) => row[4]);
  const solution = Array(7).fill(0);
  selectedColumns.forEach((column, index) => { solution[column - 1] = basicValues[index]; });
  const feasible = solution.every((value) => value >= -1e-9);
  const zeroCount = solution.filter((value) => Math.abs(value) < 1e-9).length;
  return {
    state: feasible ? (zeroCount > 3 ? "degenerate" : "nondegenerate") : "infeasible",
    solution,
    zeroCount,
    negativeIndices: solution
      .map((value, index) => ({ value, index: index + 1 }))
      .filter(({ value }) => value < -1e-9),
  };
}

function mountBasisChooser(root, announce, typesetMath, clearMath) {
  const checkboxes = [...root.querySelectorAll("[data-basis-column]")];
  const presetButtons = [...root.querySelectorAll("[data-basis-preset]")];
  const output = root.querySelector("[data-basis-result]");

  const selectedColumns = () => checkboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));

  const writeOutput = (html, state, tone, announcement) => {
    output.dataset.basisState = state;
    output.dataset.tone = tone;
    clearMath?.([output]);
    output.innerHTML = html;
    void typesetMath?.([output]);
    announce(announcement);
  };

  const update = () => {
    const selected = selectedColumns();
    const selectedKey = selected.join(",");
    checkboxes.forEach((checkbox) => {
      checkbox.closest(".l5-basis-column")?.toggleAttribute("data-selected", checkbox.checked);
    });
    presetButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.basisPreset === selectedKey));
    });

    if (selected.length !== 4) {
      writeOutput(
        `<h3>Select exactly four columns</h3><p><strong>${selected.length} of 4 selected.</strong></p><p>Choose any four of \\(A_1,\\ldots,A_7\\); the solver will test whether they form a basis.</p>`,
        "incomplete",
        "neutral",
        `${selected.length} of 4 basis columns selected.`,
      );
      return;
    }

    const basisLabel = selected.map((column) => `A_${column}`).join(",");
    const plainBasis = selected.map((column) => `A${column}`).join(", ");
    const result = solveBasis(selected);
    if (result.state === "singular") {
      writeOutput(
        `<h3>Basis candidate \\(\\{${basisLabel}\\}\\)</h3><p class="l5-basis-verdict"><strong>Singular · no basic solution</strong></p><p>These four columns are linearly dependent, so condition (a) of Theorem 2.4 fails and \\(Bx_B=b\\) cannot define a basic solution.</p>`,
        "singular",
        "bad",
        `Columns ${plainBasis} are singular. No basic solution comes from this choice.`,
      );
      return;
    }

    const vector = result.solution.map(formatBasisValue).join(",");
    let verdict;
    let explanation;
    let announcement;
    let tone;
    if (result.state === "infeasible") {
      const negativeMath = result.negativeIndices
        .map(({ index, value }) => `x_${index}=${formatBasisValue(value)}`)
        .join(",\\ ");
      const negativePlain = result.negativeIndices
        .map(({ index, value }) => `x${index} = ${formatBasisValue(value)}`)
        .join(", ");
      verdict = "Basic solution · infeasible";
      explanation = `The basis is nonsingular, but \\(${negativeMath}\\) violates nonnegativity.`;
      announcement = `${plainBasis} gives a basic but infeasible solution because ${negativePlain}.`;
      tone = "warn";
    } else if (result.state === "degenerate") {
      verdict = "Basic feasible solution · degenerate";
      explanation = `All components are nonnegative, but ${result.zeroCount} components are zero—more than \\(n-m=3\\). A basic variable is zero too.`;
      announcement = `${plainBasis} gives a degenerate basic feasible solution with ${result.zeroCount} zero components.`;
      tone = "mid";
    } else {
      verdict = "Basic feasible solution · nondegenerate";
      explanation = "All components are nonnegative, and exactly the three nonbasic variables are zero.";
      announcement = `${plainBasis} gives a nondegenerate basic feasible solution.`;
      tone = "good";
    }

    writeOutput(
      `<h3>Basis \\(\\{${basisLabel}\\}\\)</h3><p class="l5-basis-vector ns-math">\\[x=(${vector}).\\]</p><p class="l5-basis-verdict"><strong>${verdict}</strong></p><p>${explanation}</p>`,
      result.state,
      tone,
      announcement,
    );
  };

  const applyPreset = (event) => {
    const selected = new Set(event.currentTarget.dataset.basisPreset.split(",").map(Number));
    checkboxes.forEach((checkbox) => { checkbox.checked = selected.has(Number(checkbox.value)); });
    update();
  };

  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", update));
  presetButtons.forEach((button) => button.addEventListener("click", applyPreset));
  update();
  return () => {
    checkboxes.forEach((checkbox) => checkbox.removeEventListener("change", update));
    presetButtons.forEach((button) => button.removeEventListener("click", applyPreset));
  };
}

function mountObjectiveSweep(root, announce) {
  const input = root.querySelector("[data-sweep]");
  const line = root.querySelector("[data-level-line]");
  const corner = root.querySelector("[data-optimal-corner]");
  const value = root.querySelector("[data-sweep-value]");
  const status = root.querySelector("[data-sweep-status]");
  const play = root.querySelector("[data-sweep-play]");
  const polygon = [[55, 280], [385, 292], [425, 100], [260, 42], [95, 125]];
  const costs = polygon.map(([x, y]) => 0.55 * x - y);
  const low = Math.min(...costs);
  const high = Math.max(...costs);
  let animation = 0;
  const update = () => {
    const amount = Number(input.value);
    const objectiveValue = high - (high - low) * amount / 100;
    line.removeAttribute("transform");
    line.setAttribute("x1", "-60");
    line.setAttribute("y1", String(0.55 * -60 - objectiveValue));
    line.setAttribute("x2", "530");
    line.setAttribute("y2", String(0.55 * 530 - objectiveValue));
    value.value = `${amount}%`;
    const reached = amount >= 99.5;
    corner.toggleAttribute("hidden", !reached);
    status.textContent = reached
      ? "Last contact reached at (55, 280): an optimal extreme point."
      : "Move the objective toward its last feasible contact.";
  };
  const change = () => {
    if (animation) cancelAnimationFrame(animation);
    animation = 0;
    update();
    if (Number(input.value) >= 99.5) announce("Last contact reached at the optimal corner (55, 280).");
  };
  const run = () => {
    if (animation) cancelAnimationFrame(animation);
    input.value = "0";
    update();
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      input.value = "100";
      update();
      announce("Last contact reached at the optimal corner (55, 280).");
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      input.value = String(Math.min(100, ((now - start) / 2600) * 100));
      update();
      if (Number(input.value) < 100) animation = requestAnimationFrame(frame);
      else {
        animation = 0;
        announce("Last contact reached at the optimal corner (55, 280).");
      }
    };
    animation = requestAnimationFrame(frame);
  };
  input.addEventListener("input", change);
  play.addEventListener("click", run);
  update();
  return () => {
    if (animation) cancelAnimationFrame(animation);
    input.removeEventListener("input", change);
    play.removeEventListener("click", run);
  };
}

function mountProofTabs(root) {
  const tabs = [...root.querySelectorAll("[data-proof-tab]")];
  const panels = [...root.querySelectorAll("[data-proof-panel]")];
  const activate = (tab, focus = false) => {
    const step = tab.dataset.proofTab;
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => panel.toggleAttribute("hidden", panel.dataset.proofPanel !== step));
    if (focus) tab.focus();
  };
  const click = (event) => activate(event.currentTarget);
  const keydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = tabs.indexOf(event.currentTarget);
    const index = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    activate(tabs[index], true);
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", click);
    tab.addEventListener("keydown", keydown);
  });
  activate(tabs[0]);
  return () => tabs.forEach((tab) => {
    tab.removeEventListener("click", click);
    tab.removeEventListener("keydown", keydown);
  });
}

function mountCumulativeSequence(root, announce) {
  const steps = [...root.querySelectorAll("[data-sequence-step]")];
  const previous = root.querySelector("[data-sequence-previous]");
  const next = root.querySelector("[data-sequence-next]");
  const progress = root.querySelector("[data-sequence-progress]");
  let index = 0;
  const render = (shouldAnnounce = false) => {
    steps.forEach((step, stepIndex) => step.toggleAttribute("hidden", stepIndex > index));
    previous.disabled = index === 0;
    next.disabled = index === steps.length - 1;
    progress.textContent = `Step ${index + 1} of ${steps.length}`;
    if (shouldAnnounce) announce?.(steps[index].textContent.trim());
  };
  const goPrevious = () => { index = Math.max(0, index - 1); render(true); };
  const goNext = () => { index = Math.min(steps.length - 1, index + 1); render(true); };
  previous.addEventListener("click", goPrevious);
  next.addEventListener("click", goNext);
  render();
  return () => {
    previous.removeEventListener("click", goPrevious);
    next.removeEventListener("click", goNext);
  };
}

function mountGuidedWorkshop(root, announce, typesetMath, clearMath) {
  const steps = [...root.querySelectorAll("[data-l5-workshop-step]")];
  const stage = root.querySelector(".l5-workshop-stage");
  const previous = root.querySelector("[data-l5-workshop-previous]");
  const next = root.querySelector("[data-l5-workshop-next]");
  const restart = root.querySelector("[data-l5-workshop-restart]");
  const progress = root.querySelector("[data-l5-workshop-progress]");
  const assumption = root.querySelector("[data-l5-workshop-assumption]");
  const goal = root.querySelector("[data-l5-workshop-goal]");
  const storageKey = `ise5405:proof-workshop:lecture-05:${root.dataset.slideId}:v1`;
  const cleanups = [];
  const readProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  };
  const savedProgress = readProgress();
  const solved = new Set(
    Array.isArray(savedProgress?.solved)
      ? savedProgress.solved.filter((stepIndex) => Number.isInteger(stepIndex)
        && stepIndex >= 0 && stepIndex < steps.length)
      : [],
  );
  let index = Number.isInteger(savedProgress?.index)
    ? Math.max(0, Math.min(steps.length - 1, savedProgress.index))
    : 0;
  const listen = (element, eventName, handler) => {
    element.addEventListener(eventName, handler);
    cleanups.push(() => element.removeEventListener(eventName, handler));
  };
  const saveProgress = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ index, solved: [...solved] }));
    } catch {
      // The workshop remains fully usable when storage is unavailable.
    }
  };
  const keepCurrentInView = () => {
    requestAnimationFrame(() => {
      if (!stage?.isConnected) return;
      const current = steps[index];
      const stageRect = stage.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      if (currentRect.top < stageRect.top) stage.scrollTop -= stageRect.top - currentRect.top;
      else if (currentRect.bottom > stageRect.bottom) {
        stage.scrollTop += currentRect.bottom - stageRect.bottom;
      }
    });
  };
  const render = ({ focus = false, scroll = false } = {}) => {
    steps.forEach((step, stepIndex) => {
      const isQuestion = step.hasAttribute("data-l5-question");
      const visible = isQuestion ? stepIndex === index : stepIndex <= index;
      step.toggleAttribute("hidden", !visible);
      step.classList.toggle("l5-workshop-current", stepIndex === index);
      if (stepIndex === index) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    progress.textContent = `Move ${index + 1} of ${steps.length}`;
    previous.disabled = index === 0;
    next.disabled = index === steps.length - 1
      || (steps[index].hasAttribute("data-l5-question") && !solved.has(index));
    next.textContent = index === steps.length - 1 ? "Q.E.D. ■" : "Next move";
    clearMath?.([assumption, goal]);
    // Dataset values are plain TeX text. Literal inequality signs decoded from
    // attributes must not be reparsed as HTML tags.
    assumption.textContent = steps[index].dataset.l5Assume || "—";
    goal.textContent = steps[index].dataset.l5Goal || "—";
    void typesetMath?.([steps[index], assumption, goal]);
    if (focus) {
      steps[index].focus({ preventScroll: true });
    }
    if (focus || scroll) keepCurrentInView();
    saveProgress();
  };
  steps.forEach((step, stepIndex) => {
    const feedback = step.querySelector("[data-l5-workshop-feedback]");
    if (solved.has(stepIndex)) {
      const correctChoice = step.querySelector("[data-l5-workshop-choice][data-correct]");
      if (feedback && correctChoice) {
        feedback.textContent = `Correct. ${correctChoice.dataset.explanation || ""}`;
        feedback.dataset.tone = "good";
        step.querySelectorAll("[data-l5-workshop-choice]").forEach((choice) => {
          choice.disabled = true;
          choice.setAttribute("aria-pressed", String(choice === correctChoice));
        });
      }
    }
    step.querySelectorAll("[data-l5-workshop-choice]").forEach((button) => {
      listen(button, "click", () => {
        const correct = button.hasAttribute("data-correct");
        clearMath?.([feedback]);
        feedback.textContent = `${correct ? "Correct. " : "Not quite—try again. "}${button.dataset.explanation || ""}`;
        feedback.dataset.tone = correct ? "good" : "bad";
        void typesetMath?.([feedback]);
        announce?.(feedback.textContent);
        if (!correct) return;
        solved.add(stepIndex);
        step.querySelectorAll("[data-l5-workshop-choice]").forEach((choice) => {
          choice.disabled = true;
          choice.setAttribute("aria-pressed", String(choice === button));
        });
        if (stepIndex === index) render();
      });
    });
  });
  listen(previous, "click", () => { index = Math.max(0, index - 1); render({ focus: true }); });
  listen(next, "click", () => { index = Math.min(steps.length - 1, index + 1); render({ focus: true }); });
  listen(restart, "click", () => {
    index = 0;
    solved.clear();
    root.querySelectorAll("[data-l5-workshop-choice]").forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-pressed");
    });
    root.querySelectorAll("[data-l5-workshop-feedback]").forEach((feedback) => {
      clearMath?.([feedback]);
      feedback.textContent = "Choose an answer to unlock the next move.";
      feedback.dataset.tone = "";
    });
    stage.scrollTop = 0;
    render({ focus: true });
  });
  render({ scroll: index > 0 });
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function mountHullTool(root, announce) {
  const svg = root.querySelector("[data-hull-svg]");
  const polygon = root.querySelector("[data-hull-polygon]");
  const handles = [...root.querySelectorAll("[data-hull-handle]")];
  const status = root.querySelector("[data-hull-status]");
  const buttons = [...root.querySelectorAll("[data-hull-state]")];
  let points = [[90, 220], [150, 70], [290, 55], [380, 150], [300, 255], [210, 160]];
  let dragIndex = -1;
  const states = {
    inside: [210, 160],
    boundary: [220, 62.5],
    outside: [425, 45],
  };

  const hullIndices = () => {
    const cross = (origin, first, second) =>
      (first.x - origin.x) * (second.y - origin.y) - (first.y - origin.y) * (second.x - origin.x);
    const sorted = points.map(([x, y], index) => ({ x, y, index }))
      .sort((a, b) => a.x - b.x || a.y - b.y || a.index - b.index);
    const lower = [];
    sorted.forEach((point) => {
      while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), point) <= 1e-8) lower.pop();
      lower.push(point);
    });
    const upper = [];
    [...sorted].reverse().forEach((point) => {
      while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), point) <= 1e-8) upper.pop();
      upper.push(point);
    });
    return [...lower.slice(0, -1), ...upper.slice(0, -1)].map((point) => point.index);
  };

  const render = (shouldAnnounce = false) => {
    const hull = hullIndices();
    polygon.setAttribute("points", hull.map((index) => points[index].join(",")).join(" "));
    handles.forEach((handle, index) => {
      handle.setAttribute("cx", String(points[index][0]));
      handle.setAttribute("cy", String(points[index][1]));
      handle.toggleAttribute("data-extreme", hull.includes(index));
      handle.setAttribute("aria-label", `Point ${index + 1}: ${hull.includes(index) ? "extreme" : "inside or on an edge"}; use arrow keys or drag to move`);
    });
    const swallowed = points.length - hull.length;
    status.textContent = `${hull.length} extreme points · ${swallowed} ${swallowed === 1 ? "point" : "points"} inside or on an edge and therefore not needed as hull vertices.`;
    if (shouldAnnounce) announce(status.textContent);
  };

  const position = (event) => {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(svg.getScreenCTM().inverse());
    return [Math.max(12, Math.min(458, transformed.x)), Math.max(12, Math.min(318, transformed.y))];
  };
  const select = (event) => {
    const key = event.currentTarget.dataset.hullState;
    points[5] = [...states[key]];
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === event.currentTarget)));
    render(true);
  };
  buttons.forEach((button) => button.addEventListener("click", select));
  const pointerDown = (event) => {
    dragIndex = Number(event.currentTarget.dataset.hullHandle);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };
  const pointerMove = (event) => {
    if (dragIndex < 0) return;
    points[dragIndex] = position(event);
    render();
  };
  const pointerUp = (event) => {
    if (dragIndex < 0) return;
    dragIndex = -1;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    render(true);
  };
  const keyDown = (event) => {
    const delta = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[event.key];
    if (!delta) return;
    event.preventDefault();
    const index = Number(event.currentTarget.dataset.hullHandle);
    points[index] = [
      Math.max(12, Math.min(458, points[index][0] + delta[0])),
      Math.max(12, Math.min(318, points[index][1] + delta[1])),
    ];
    render(true);
  };
  handles.forEach((handle) => {
    handle.addEventListener("pointerdown", pointerDown);
    handle.addEventListener("pointermove", pointerMove);
    handle.addEventListener("pointerup", pointerUp);
    handle.addEventListener("pointercancel", pointerUp);
    handle.addEventListener("keydown", keyDown);
  });
  render();
  return () => {
    buttons.forEach((button) => button.removeEventListener("click", select));
    handles.forEach((handle) => {
      handle.removeEventListener("pointerdown", pointerDown);
      handle.removeEventListener("pointermove", pointerMove);
      handle.removeEventListener("pointerup", pointerUp);
      handle.removeEventListener("pointercancel", pointerUp);
      handle.removeEventListener("keydown", keyDown);
    });
  };
}

export const deck = {
  schemaVersion: 1,
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  metadata,
  styles: new URL("./lecture-05.css", import.meta.url).href,
  slides,
};

export default deck;
