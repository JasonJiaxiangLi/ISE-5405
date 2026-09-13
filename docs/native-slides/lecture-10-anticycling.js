/**
 * Simplex II, section 3.4: complete cycling and anticycling development.
 * Source: faculty-authorized Part 2 PDF, reference pages 3–40.
 * Tableau convention: row zero is [-f_B | reduced costs]; constraint rows
 * are [B^-1 b | B^-1 A]. Rational strings preserve exact audit data.
 */

export const auditData = {
  convention: "[-f_B | cbar]; [B^-1 b | B^-1 A]",
  cycling: {
    A: [["1/4", "-8", "-1", "9", "1", "0", "0"],
      ["1/2", "-12", "-1/2", "3", "0", "1", "0"],
      ["0", "0", "1", "0", "0", "0", "1"]],
    b: ["0", "0", "1"],
    c: ["-3/4", "20", "-7/2", "6", "0", "0", "-3"],
    point: ["0", "0", "0", "0", "0", "0", "1"],
    value: "-3",
    states: [
      { basis: [5, 6, 7], referencePages: [4, 5], tableau: [
        ["3", "-3/4", "20", "-1/2", "6", "0", "0", "0"],
        ["0", "1/4", "-8", "-1", "9", "1", "0", "0"],
        ["0", "1/2", "-12", "-1/2", "3", "0", "1", "0"],
        ["1", "0", "0", "1", "0", "0", "0", "1"],
      ] },
      { basis: [1, 6, 7], referencePages: [6, 7], tableau: [
        ["3", "0", "-4", "-7/2", "33", "3", "0", "0"],
        ["0", "1", "-32", "-4", "36", "4", "0", "0"],
        ["0", "0", "4", "3/2", "-15", "-2", "1", "0"],
        ["1", "0", "0", "1", "0", "0", "0", "1"],
      ] },
      { basis: [1, 2, 7], referencePages: [8, 9], tableau: [
        ["3", "0", "0", "-2", "18", "1", "1", "0"],
        ["0", "1", "0", "8", "-84", "-12", "8", "0"],
        ["0", "0", "1", "3/8", "-15/4", "-1/2", "1/4", "0"],
        ["1", "0", "0", "1", "0", "0", "0", "1"],
      ] },
      { basis: [3, 2, 7], referencePages: [10, 11], tableau: [
        ["3", "1/4", "0", "0", "-3", "-2", "3", "0"],
        ["0", "1/8", "0", "1", "-21/2", "-3/2", "1", "0"],
        ["0", "-3/64", "1", "0", "3/16", "1/16", "-1/8", "0"],
        ["1", "-1/8", "0", "0", "21/2", "3/2", "-1", "1"],
      ] },
      { basis: [3, 4, 7], referencePages: [12, 13], tableau: [
        ["3", "-1/2", "16", "0", "0", "-1", "1", "0"],
        ["0", "-5/2", "56", "1", "0", "2", "-6", "0"],
        ["0", "-1/4", "16/3", "0", "1", "1/3", "-2/3", "0"],
        ["1", "5/2", "-56", "0", "0", "-2", "6", "1"],
      ] },
      { basis: [5, 4, 7], referencePages: [14, 15], tableau: [
        ["3", "-7/4", "44", "1/2", "0", "0", "-2", "0"],
        ["0", "-5/4", "28", "1/2", "0", "1", "-3", "0"],
        ["0", "1/6", "-4", "-1/6", "1", "0", "1/3", "0"],
        ["1", "0", "0", "1", "0", "0", "0", "1"],
      ] },
      { basis: [5, 6, 7], referencePages: [16, 17, 18], tableau: [
        ["3", "-3/4", "20", "-1/2", "6", "0", "0", "0"],
        ["0", "1/4", "-8", "-1", "9", "1", "0", "0"],
        ["0", "1/2", "-12", "-1/2", "3", "0", "1", "0"],
        ["1", "0", "0", "1", "0", "0", "0", "1"],
      ] },
    ],
    pivots: [
      { entering: 1, leaving: 5, pivotRow: 0, pivotElement: "1/4", step: "0", reducedCost: "-3/4", eligibleRatios: [[5, "0"], [6, "0"]] },
      { entering: 2, leaving: 6, pivotRow: 1, pivotElement: "4", step: "0", reducedCost: "-4", eligibleRatios: [[6, "0"]] },
      { entering: 3, leaving: 1, pivotRow: 0, pivotElement: "8", step: "0", reducedCost: "-2", eligibleRatios: [[1, "0"], [2, "0"], [7, "1"]] },
      { entering: 4, leaving: 2, pivotRow: 1, pivotElement: "3/16", step: "0", reducedCost: "-3", eligibleRatios: [[2, "0"], [7, "2/21"]] },
      { entering: 5, leaving: 3, pivotRow: 0, pivotElement: "2", step: "0", reducedCost: "-1", eligibleRatios: [[3, "0"], [4, "0"]] },
      { entering: 6, leaving: 4, pivotRow: 1, pivotElement: "1/3", step: "0", reducedCost: "-2", eligibleRatios: [[4, "0"]] },
    ],
  },
  lexExample: {
    rows: [["1", "0", "5", "3"], ["2", "4", "6", "-1"], ["3", "0", "7", "9"]],
    enteringColumn: 3,
    eligibleRows: [0, 2],
    normalizedRows: [["1/3", "0", "5/3", "1"], ["1/3", "0", "7/9", "1"]],
    leavingRow: 2,
  },
  blandDeparture: { stateIndex: 4, entering: 1, leaving: 7, step: "2/5", resultingValue: "-16/5" },
};

function rationalTex(value) {
  const text = String(value);
  if (!text.includes("/")) return text;
  const [numerator, denominator] = text.split("/");
  return `${numerator.startsWith("-") ? "-" : ""}\\frac{${numerator.replace("-", "")}}{${denominator}}`;
}

function cycleTableau(index, { entering = null, leaving = null, label = "", hideCaption = false } = {}) {
  const state = auditData.cycling.states[index];
  const rows = state.tableau.map((row, rowIndex) => {
    const variable = rowIndex === 0 ? null : state.basis[rowIndex - 1];
    const rowLabel = rowIndex === 0 ? String.raw`\(R_0\)` : `\\(x_${variable}\\)`;
    return `<tr${rowIndex === 0 ? ' data-l10-objective-row' : ""}${variable !== null && variable === leaving ? ' data-l10-leaving-row="true"' : ""}>
      <th scope="row">${rowLabel}</th>${row.map((value, column) => `<td${column === entering ? ' data-l10-entering-column="true"' : ""}${column === 0 ? ' data-l10-tableau-rhs' : ""}>\\(${rationalTex(value)}\\)</td>`).join("")}</tr>`;
  }).join("");
  return `<div class="l10-table-wrap" tabindex="0" role="region" aria-label="${label || `Cycling example tableau after ${index} pivots`}">
    <table class="l10-table l10-cycle-table" data-l10-cycle-tableau="${index}" data-basis="${state.basis.join(",")}">
      <caption${hideCaption ? ' class="ns-visually-hidden"' : ""}>${label || `Example 3.6 · after ${index} pivots`}</caption>
      <thead><tr><th scope="col">row</th><th scope="col">column 0</th>${Array.from({ length: 7 }, (_, j) => `<th scope="col">\\(x_${j + 1}\\)</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

const cycleDecisions = [
  String.raw`\[\bar c_1=-\frac34< -\frac12=\bar c_3,\qquad
    \theta^*=\min\left\{\frac0{1/4},\frac0{1/2}\right\}=0.\]`,
  String.raw`\[\bar c_2=-4< -\frac72=\bar c_3,\qquad \theta^*=\frac04=0.\]`,
  String.raw`\[\bar c_3=-2,\qquad
    \theta^*=\min\left\{\frac08,\frac0{3/8},\frac11\right\}=0.\]`,
  String.raw`\[\bar c_4=-3<-2=\bar c_5,\qquad
    \theta^*=\min\left\{\frac0{3/16},\frac1{21/2}\right\}=0.\]`,
  String.raw`\[\bar c_5=-1<-\frac12=\bar c_1,\qquad
    \theta^*=\min\left\{\frac02,\frac0{1/3}\right\}=0.\]`,
  String.raw`\[\bar c_6=-2<-\frac74=\bar c_1,\qquad \theta^*=\frac0{1/3}=0.\]`,
];

const cycleReasons = [
  String.raw`\(x_5\) and \(x_6\) tie at zero; the smaller index makes \(x_5\) leave.`,
  String.raw`Only \(x_6\) has a positive entry in column \(x_2\); it leaves at step zero.`,
  String.raw`\(x_1\) and \(x_2\) tie at zero; the smaller index makes \(x_1\) leave.`,
  String.raw`The \(x_2\) row limits the step at zero; the \(x_7\) row would allow \(2/21\).`,
  String.raw`\(x_3\) and \(x_4\) tie at zero; the smaller index makes \(x_3\) leave.`,
  String.raw`Only \(x_4\) has a positive entry in column \(x_6\); it leaves at step zero.`,
];

const cycleRowOperations = [
  String.raw`\[R_1'=4R_1,\quad R_2'=R_2-\tfrac12R_1',\quad R_3'=R_3,\quad R_0'=R_0+\tfrac34R_1'.\]`,
  String.raw`\[R_2'=\tfrac14R_2,\quad R_1'=R_1+32R_2',\quad R_3'=R_3,\quad R_0'=R_0+4R_2'.\]`,
  String.raw`\[R_1'=\tfrac18R_1,\quad R_2'=R_2-\tfrac38R_1',\quad R_3'=R_3-R_1',\quad R_0'=R_0+2R_1'.\]`,
  String.raw`\[R_2'=\tfrac{16}3R_2,\quad R_1'=R_1+\tfrac{21}2R_2',\quad R_3'=R_3-\tfrac{21}2R_2',\quad R_0'=R_0+3R_2'.\]`,
  String.raw`\[R_1'=\tfrac12R_1,\quad R_2'=R_2-\tfrac13R_1',\quad R_3'=R_3+2R_1',\quad R_0'=R_0+R_1'.\]`,
  String.raw`\[R_2'=3R_2,\quad R_1'=R_1+3R_2',\quad R_3'=R_3,\quad R_0'=R_0+2R_2'.\]`,
];

// Keep each tableau once: the next page is both this pivot's result and the
// starting tableau for the next question. Decisions reveal below the unchanged
// current tableau; optional row operations stay available in an Explore dialog.
const cyclingSlides = auditData.cycling.pivots.map((pivot, index) => ({
  key: `cycle-${index + 1}-choose`,
  title: `Example 3.6: Pivot ${index + 1}`,
  referencePages: [...auditData.cycling.states[index].referencePages, ...auditData.cycling.states[index + 1].referencePages],
  className: "l10-tableau-slide l10-cycle-pivot-slide",
  html: String.raw`
    ${index === 0
      ? '<p>Most-negative reduced cost enters; smallest basic-variable index breaks a minimum-ratio tie.</p>'
      : String.raw`<p>After pivot ${index}: \(x_${auditData.cycling.pivots[index - 1].entering}\) entered, \(x_${auditData.cycling.pivots[index - 1].leaving}\) left. Same point, same \(f=-3\). Which pivot comes next?</p>`}
    ${cycleTableau(index, { entering: pivot.entering, leaving: pivot.leaving, hideCaption: true, label: index === 0 ? "Initial tableau · which variable enters and which leaves?" : `After pivot ${index} · choose the next pivot` })}
    <section class="l10-box" data-tone="blue" data-reveal="1" data-l10-cycle-choice="${index + 1}">
      <div class="l10-math">${cycleDecisions[index]}</div>
      <p>${cycleReasons[index]}</p>
    </section>
    <div class="l10-controls" data-reveal="2" data-l10-cycle-update="${index + 1}">
      <span>\(x_${pivot.entering}\) enters; \(x_${pivot.leaving}\) leaves.</span>
      <button type="button" class="ns-slide-action" data-explore="cycle-operations-${index + 1}">Row operations</button>
    </div>`,
  explorations: [{
    id: `cycle-operations-${index + 1}`,
    label: "Row operations",
    title: `Pivot ${index + 1}: obtain the next tableau`,
    html: String.raw`
      <p>\(x_${pivot.entering}\) enters and \(x_${pivot.leaving}\) leaves. The pivot entry is \(${rationalTex(pivot.pivotElement)}\).</p>
      <p>\(R_1,R_2,R_3\) are the constraint rows in their displayed order; \(R_0\) is the objective row. Primes denote new rows. Include column 0 in every operation.</p>
      <p>Divide the pivot row by the pivot entry, then eliminate the other entries in that column:</p>
      <div class="l10-math l10-row-operations">${cycleRowOperations[index]}</div>
      ${cycleTableau(index + 1, { label: `Result of pivot ${index + 1}` })}
      <p>The basis changes, but \(\theta^*=0\): \(x=(0,0,0,0,0,0,1)\) and \(f=-3\) stay fixed.</p>`,
  }],
}));

export const anticyclingSlides = [
  {
    key: "cycle-model", title: "Can Simplex Cycle? Example 3.6", referencePages: [3, 4],
    html: String.raw`
      <p>Simplex I showed a zero-length pivot: the basis changed while the point stayed fixed. Can such pivots return to the starting basis?</p>
      <div class="l10-math">\[\begin{aligned}
        \min\quad f(x)&=-\tfrac34x_1+20x_2-\tfrac72x_3+6x_4-3x_7\\
        \text{s.t.}\quad&\tfrac14x_1-8x_2-x_3+9x_4+x_5=0,\\
        &\tfrac12x_1-12x_2-\tfrac12x_3+3x_4+x_6=0,\\
        &x_3+x_7=1,\qquad x_1,\ldots,x_7\ge0.
      \end{aligned}\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p>Start with \(\mathcal B=(x_5,x_6,x_7)\): \(x=(0,0,0,0,0,0,1)\), \(f_B=-3\).</p>
        <p>Substitute \(x_7=1-x_3\): \(f=-3-\tfrac34x_1+20x_2-\tfrac12x_3+6x_4\).</p>
      </section>
      <section data-reveal="2" class="l10-tableau-key">
        <p><strong>Tableau key:</strong> row \(R_0\) records \(-f_B\), then reduced costs. Each constraint row records its basic value, then equation coefficients.</p>
      </section>`,
  },
  ...cyclingSlides,
  {
    key: "cycle-6-result", title: "Example 3.6: After Pivot 6", referencePages: [16, 17, 18],
    className: "l10-tableau-slide",
    html: String.raw`
      <p>\(x_6\) entered and \(x_4\) left with \(\theta^*=0\). Compare the result with the initial tableau.</p>
      ${cycleTableau(6, { label: "After pivot 6 · the initial tableau returns" })}
      <section class="l10-box" data-tone="orange" data-reveal="1">
        <p><strong>Initial tableau restored.</strong> Basis \((x_5,x_6,x_7)\), objective \(f=-3\), point \(x=(0,0,0,0,0,0,1)\).</p>
      </section>
      <p data-reveal="2">The same entering and leaving rules now select the same first pivot. The sequence repeats indefinitely: <strong>simplex cycles.</strong></p>`,
  },
  {
    key: "cycle-closed", title: "Six Pivots Return to the Same Basis", referencePages: [16, 17, 18],
    html: String.raw`
      <div class="l10-math">\[\begin{aligned}
        (x_5,x_6,x_7)&\to(x_1,x_6,x_7)\to(x_1,x_2,x_7)\\
        &\to(x_3,x_2,x_7)\to(x_3,x_4,x_7)\\
        &\to(x_5,x_4,x_7)\to(x_5,x_6,x_7).
      \end{aligned}\]</div>
      <section class="l10-box" data-tone="orange"><p>Every step has \(\theta^*=0\). Every tableau represents the same point and objective \(f=-3\).</p></section>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The sixth tableau equals the first. The same rules now make the same choices again: the algorithm cycles indefinitely.</p></section>
      <p data-reveal="2"><strong>A finite number of bases is not enough:</strong> we must also prevent repeated bases.</p>`,
    checkpoint: {
      prompt: "In Example 3.6, what repeats after the six zero-length pivots?",
      choices: ["Only the objective value", "The initial basis and complete tableau", "Only the entering variable", "A positive-length edge step"],
      correctIndex: 1,
      explanation: "The sixth pivot restores the initial basis and every tableau entry. The fixed pivot rules then repeat the same six choices. The point and objective were unchanged throughout.",
      autoOpen: true,
    },
  },
  {
    key: "anticycling-target", title: "What an Anticycling Rule Must Achieve", referencePages: [19],
    html: String.raw`
      <section class="l10-box" data-tone="blue"><p>Degeneracy may prevent strict objective improvement. An anticycling rule supplies another reason that a basis cannot recur.</p></section>
      <p data-reveal="1">We will study lexicographic pivoting and Bland’s rule. Both allow degenerate pivots and guarantee finite termination from a feasible basis.</p>
      <section class="l10-box" data-tone="green" data-reveal="2"><h3>A consequence</h3>
        <p>For a feasible standard-form LP with finite optimal value, an optimal basis exists:</p>
        <div class="l10-math">\[B^{-1}b\ge0,\qquad \bar c^\top=c^\top-c_{\mathcal B}^\top B^{-1}A\ge0.\]</div>
        <p>We next learn the rules; the following section supplies an initial feasible basis.</p></section>`,
  },
  {
    key: "lex-definition", title: "Lexicographic Order: Use the First Difference", referencePages: [20, 21],
    html: String.raw`
      <section class="l10-box" data-tone="blue"><h3>Definition 3.5</h3>
        <p>For distinct vectors \(r,s\), compare their entries from left to right. Write \(r>_Ls\) if the first unequal entry is larger in \(r\); write \(r<_Ls\) if it is smaller.</p></section>
      <div class="l10-math" data-reveal="1">\[(0,2,\boxed3,0)>_L(0,2,\boxed1,4).\]</div>
      <p data-reveal="1">The first two entries tie; the third entry decides. The final entry does not matter.</p>
      <div class="l10-math" data-reveal="2">\[(\boxed0,4,5,0)<_L(\boxed1,2,1,2).\]</div>
      <p data-reveal="2">Here the first entry decides, even though later entries go the other way.</p>`,
  },
  {
    key: "lex-positive", title: "Lexicographically Positive Is a Different Condition", referencePages: [22],
    html: String.raw`
      <section class="l10-box" data-tone="blue"><p>A vector is <strong>lexicographically positive</strong> if its first nonzero entry is positive:</p>
        <div class="l10-math">\[r>_L0.\]</div></section>
      <div class="l10-math" data-reveal="1">\[(0,0,2,-100)>_L0,\qquad (0,-1,100,100)<_L0.\]</div>
      <p data-reveal="1">Entries after the first nonzero entry may have either sign. The zero vector is not lexicographically positive.</p>
      <section class="l10-box" data-tone="orange" data-reveal="2"><p>Write \(R_i\) for constraint row \(i\): its basic value first, then every coefficient in a fixed column order. Lexicographic comparison examines that whole ordered row.</p></section>`,
  },
  {
    key: "lex-rule", title: "The Lexicographic Pivoting Rule", referencePages: [23],
    html: String.raw`
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>1 · Choose an improving column</h3>
          <p>Choose any nonbasic \(x_j\) with \(\bar c_j<0\). Its entries are \(t_{ij}=(B^{-1}A_j)_i\).</p></section>
        <section class="l10-box" data-tone="blue" data-reveal="1"><h3>2 · Compare normalized eligible rows</h3>
          <p>For each \(t_{ij}>0\), divide the <strong>entire row, including column 0,</strong> by \(t_{ij}\). Choose the lexicographically smallest result:</p>
          <div class="l10-math">\[\frac{R_\ell}{t_{\ell j}}<_L\frac{R_i}{t_{ij}}\qquad(i\ne\ell,\ t_{ij}>0).\]</div></section>
        <p data-reveal="2">Then \(x_{B(\ell)}\) leaves. Column 0 first minimizes the ordinary ratio; later columns resolve a tie. If no row is eligible, the improving direction is unbounded.</p>
      </div>`,
  },
  {
    key: "lex-example-ratios", title: "Example 3.7: The Ordinary Ratios Tie", referencePages: [24],
    html: String.raw`
      <p>The objective row is omitted. Column 0 holds the basic values \(\bar b_i\). Let column \(j=3\) enter.</p>
      <div class="l10-table-wrap" tabindex="0" role="region" aria-label="Example 3.7 original constraint rows">
        <table class="l10-table" data-l10-lex-example="original"><caption>Original tableau rows</caption>
          <thead><tr><th scope="col">basic</th><th scope="col">column 0</th><th scope="col">column 1</th><th scope="col">column 2</th><th scope="col">column 3</th><th scope="col">remaining</th></tr></thead>
          <tbody><tr><th scope="row">\(x_{B(1)}\)</th><td>\(1\)</td><td>\(0\)</td><td>\(5\)</td><td>\(3\)</td><td>\(\cdots\)</td></tr>
          <tr><th scope="row">\(x_{B(2)}\)</th><td>\(2\)</td><td>\(4\)</td><td>\(6\)</td><td>\(-1\)</td><td>\(\cdots\)</td></tr>
          <tr><th scope="row">\(x_{B(3)}\)</th><td>\(3\)</td><td>\(0\)</td><td>\(7\)</td><td>\(9\)</td><td>\(\cdots\)</td></tr></tbody>
        </table></div>
      <div class="l10-math" data-reveal="1">\[\frac{\bar b_1}{t_{13}}=\frac13,\qquad\frac{\bar b_3}{t_{33}}=\frac39=\frac13.\]</div>
      <p data-reveal="2">Row 2 is ineligible because \(t_{23}=-1\): that basic variable increases. Rows 1 and 3 tie for the maximum feasible step.</p>`,
  },
  {
    key: "lex-example-comparison", title: "Example 3.7: Compare the Complete Normalized Rows", referencePages: [25, 26, 27],
    html: String.raw`
      <p>Divide row 1 by \(3\) and row 3 by \(9\). Keep column 0 at the left.</p>
      <div class="l10-table-wrap" tabindex="0" role="region" aria-label="Example 3.7 eligible normalized rows">
        <table class="l10-table" data-l10-lex-example="normalized"><caption>Normalized eligible rows</caption>
          <thead><tr><th scope="col">row</th><th scope="col">column 0</th><th scope="col">column 1</th><th scope="col">column 2</th><th scope="col">column 3</th><th scope="col">remaining</th></tr></thead>
          <tbody><tr><th scope="row">\(R_1/3\)</th><td>\(1/3\)</td><td>\(0\)</td><td>\(5/3\)</td><td>\(1\)</td><td>\(\cdots\)</td></tr>
          <tr><th scope="row">\(R_3/9\)</th><td>\(1/3\)</td><td>\(0\)</td><td>\(7/9\)</td><td>\(1\)</td><td>\(\cdots\)</td></tr></tbody>
        </table></div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The ratios tie at \(1/3\), and column 1 also ties at zero. Column 2 is the first difference:</p>
        <div class="l10-math">\[\frac79<\frac53\quad\Longrightarrow\quad\frac{R_3}{9}<_L\frac{R_1}{3}.\]</div></section>
      <p data-reveal="2"><strong>Row 3 wins:</strong> \(x_{B(3)}\) leaves and \(\theta^*=1/3\).</p>`,
    checkpoint: {
      prompt: "In Example 3.7, the ordinary ratios and the next entries tie. What selects row 3?",
      choices: ["It has the largest pivot entry", "Its basic variable has the smallest index", "The first unequal normalized entries satisfy 7/9 < 5/3", "The row with the negative pivot entry leaves"],
      correctIndex: 2,
      explanation: "Lexicographic comparison starts at column 0 and stops at the first difference. The first difference is in column 2: 7/9 is smaller than 5/3, so normalized row 3 is smaller.",
      autoOpen: true,
    },
  },
  {
    key: "lex-unique", title: "Why the Lexicographic Leaving Choice Is Unique", referencePages: [28],
    html: String.raw`
      <p>Assume two different eligible rows tie in <em>every</em> entry after normalization.</p>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Proof of uniqueness of the lexicographic leaving row">
        <section><div class="l10-math">\[\frac{R_i}{t_{ij}}=\frac{R_k}{t_{kj}}\quad\Longrightarrow\quad R_i=\frac{t_{ij}}{t_{kj}}R_k.\]</div><p>The complete rows would be proportional.</p></section>
        <section data-reveal="1"><p>Deleting column 0 leaves proportional rows of \(T=B^{-1}A\), so \(T\) would not have independent rows.</p></section>
        <section data-reveal="2"><div class="l10-math">\[\operatorname{rank}(B^{-1}A)=\operatorname{rank}(A)=m.\]</div><p>This contradicts the full-row-rank assumption. Distinct eligible rows therefore cannot tie lexicographically.</p></section>
      </div>`,
  },
  {
    key: "lex-theorem", title: "Theorem 3.4: Three Claims Prevent Cycling", referencePages: [29],
    html: String.raw`
      <p>Start at a feasible basis with every constraint row \(R_i>_L0\), \(i=1,\ldots,m\). Keep the column order fixed and use the lexicographic pivoting rule.</p>
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>(a) Preserve the row condition</h3><p>Every constraint row remains lexicographically positive.</p></section>
        <section class="l10-box" data-tone="blue" data-reveal="1"><h3>(b) Obtain strict progress</h3><p>The zeroth row strictly increases lexicographically at every pivot.</p></section>
        <section class="l10-box" data-tone="green" data-reveal="2"><h3>(c) Terminate</h3><p>No basis can repeat, so only finitely many pivots are possible.</p></section>
      </div>`,
  },
  {
    key: "lex-properties", title: "Four Lexicographic Facts Used in the Proof", referencePages: [30],
    html: String.raw`
      <div class="l10-proof" tabindex="0" role="region" aria-label="Four elementary lexicographic order properties">
        <section><div class="l10-math">\[r>_Ls\quad\Longleftrightarrow\quad r-s>_L0.\]</div><p>Subtracting common entries leaves the same first difference.</p></section>
        <section data-reveal="1"><div class="l10-math">\[r>_L0,\ \alpha>0\quad\Longrightarrow\quad\alpha r>_L0.\]</div><p>Positive scaling preserves the first nonzero sign.</p></section>
        <section data-reveal="2"><div class="l10-math">\[r>_L0,\ s>_L0\quad\Longrightarrow\quad r+s>_L0.\]</div><p>At the first possible nonzero entry, positive entries cannot cancel.</p></section>
        <section data-reveal="3"><div class="l10-math">\[r>_L0\quad\Longrightarrow\quad r+s>_Ls.\]</div><p>Apply the first fact to \((r+s)-s=r\).</p></section>
      </div>`,
  },
  {
    key: "lex-proof-pivot", title: "Proof (a): The Pivot Row Stays Positive", referencePages: [31, 32],
    html: String.raw`
      <p>Assume all old constraint rows satisfy \(R_i>_L0\). Let \(x_j\) enter and let row \(\ell\) leave.</p>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Lexicographic invariant: pivot-row proof">
        <section><p>Eligibility gives \(t_{\ell j}>0\). Uniqueness and the lexicographic rule give</p>
          <div class="l10-math">\[\frac{R_\ell}{t_{\ell j}}<_L\frac{R_i}{t_{ij}}\quad(i\ne\ell,\ t_{ij}>0).\]</div></section>
        <section data-reveal="1"><div class="l10-math">\[R_\ell'=\frac{R_\ell}{t_{\ell j}}>_L0.\]</div><p>The new pivot row is a positive multiple of a lexicographically positive row.</p></section>
        <section data-reveal="2"><p>The remaining rows use \(R_i'=R_i-t_{ij}R_\ell'\). We must check both possible signs of \(t_{ij}\).</p></section>
      </div>`,
  },
  {
    key: "lex-proof-other-rows", title: "Proof (a): Every Other Row Stays Positive", referencePages: [32, 33],
    html: String.raw`
      <p>We have \(R_i>_L0\), \(R_\ell'=R_\ell/t_{\ell j}>_L0\), and \(R_i'=R_i-t_{ij}R_\ell'\).</p>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Lexicographic invariant: both signs of the pivot-column entry">
        <section><h3>Case 1: \(t_{ij}\le0\)</h3>
          <div class="l10-math">\[R_i'=R_i+(-t_{ij})R_\ell'>_L0.\]</div>
          <p>If \(t_{ij}=0\), the row is unchanged. Otherwise it is the sum of two lexicographically positive vectors.</p></section>
        <section data-reveal="1"><h3>Case 2: \(t_{ij}>0\)</h3>
          <div class="l10-math">\[R_i'=t_{ij}\left(\frac{R_i}{t_{ij}}-\frac{R_\ell}{t_{\ell j}}\right)>_L0.\]</div>
          <p>The bracket is positive by the strict lexicographic choice; the multiplier is positive.</p></section>
        <section data-reveal="2"><p><strong>Induction proves (a):</strong> every constraint row is positive initially, and every pivot preserves that condition.</p></section>
      </div>`,
  },
  {
    key: "lex-proof-objective", title: "Proof (b): The Zeroth Row Strictly Increases", referencePages: [34],
    html: String.raw`
      <p>The entering reduced cost is negative, \(\bar c_j<0\), and part (a) gives \(R_\ell'>_L0\).</p>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Proof of strict lexicographic increase of row zero">
        <section><div class="l10-math">\[R_0'=R_0-\bar c_jR_\ell'.\]</div><p>This row operation makes the entering reduced cost zero.</p></section>
        <section data-reveal="1"><div class="l10-math">\[R_0'-R_0=(-\bar c_j)R_\ell'>_L0\quad\Longrightarrow\quad R_0'>_LR_0.\]</div></section>
        <section data-reveal="2"><p><strong>Even when \(\theta^*=0\), the whole zeroth row strictly increases.</strong> Its first entry \(-f_B\) may stay fixed; a later entry then supplies the first strict difference.</p></section>
      </div>`,
  },
  {
    key: "lex-proof-termination", title: "Proof (c): A Basis Cannot Recur", referencePages: [35],
    html: String.raw`
      <div class="l10-proof" tabindex="0" role="region" aria-label="Finite-termination proof for lexicographic pivoting">
        <section><p>For fixed data and column order, the basis determines the complete zeroth row:</p>
          <div class="l10-math">\[R_0=\left[-c_{\mathcal B}^\top B^{-1}b\ \middle|\ c^\top-c_{\mathcal B}^\top B^{-1}A\right].\]</div></section>
        <section data-reveal="1"><p>Part (b) gives strict lexicographic increase at each pivot. Returning to an old basis would return to its old zeroth row, which is impossible.</p></section>
        <section data-reveal="2"><p>There are finitely many choices of basic columns. Therefore the algorithm terminates after finitely many pivots, with an optimal basis or an improving unbounded ray.</p></section>
      </div>`,
  },
  {
    key: "lex-initialization", title: "Make the Initial Constraint Rows Lex Positive", referencePages: [37],
    html: String.raw`
      <p>Start with any feasible basis \(B_0\). Put its basic columns first, in basis order; then keep this column order fixed for the entire run.</p>
      <div class="l10-math">\[\left[\begin{array}{c|c|c}
        B_0^{-1}b&I&B_0^{-1}A_{\mathcal N_0}
      \end{array}\right].\]</div>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Why ordering initial basic columns first ensures lex positivity">
        <section><p>If \(\bar b_i>0\), the first entry already makes row \(i\) positive.</p></section>
        <section data-reveal="1"><p>If \(\bar b_i=0\), its first nonzero entry in the identity block is \(+1\). Entries in the later nonbasic block cannot change that comparison.</p></section>
        <section data-reveal="2"><p><strong>Every row starts lexicographically positive.</strong> Theorem 3.4 then preserves this property through all subsequent pivots.</p></section>
      </div>`,
  },
  {
    key: "lex-implementation", title: "What Information Does the Lex Rule Need?", referencePages: [36],
    html: String.raw`
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>Full tableau</h3><p>The normalized rows are already available. Compare column 0, then subsequent columns until the first difference.</p></section>
        <section class="l10-box" data-tone="blue" data-reveal="1"><h3>Revised simplex</h3><p>The same rule can be used, but it needs information beyond the ordinary scalar ratio. One route is to form \(B^{-1}\) and recover the required tableau rows:</p>
          <div class="l10-math">\[R_i=\left[e_i^\top B^{-1}b\ \middle|\ e_i^\top B^{-1}A\right].\]</div></section>
        <p data-reveal="2">Here \(e_i\) is the unit vector selecting row \(i\). The mathematical rule is the same; the stored information and computation differ.</p>
      </div>`,
  },
  {
    key: "bland-rule", title: "Bland’s Rule: Use the Smallest Variable Indices", referencePages: [38, 39],
    html: String.raw`
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>1 · Entering variable</h3>
          <p>Among nonbasic variables with \(\bar c_j<0\), choose the smallest variable index \(j\).</p></section>
        <section class="l10-box" data-tone="blue" data-reveal="1"><h3>2 · Leaving variable</h3>
          <p>Perform the ordinary minimum-ratio test. Among its ties, choose the smallest index of the basic variable that can leave.</p></section>
        <section class="l10-box" data-tone="orange" data-reveal="2"><p><strong>Variable index is not row position.</strong> If rows for \(x_8\) and \(x_3\) tie, choose \(x_3\), even when it appears lower in the tableau.</p></section>
      </div>`,
  },
  {
    key: "bland-cycle-departure", title: "Why Bland’s Rule Does Not Repeat Our Cycle", referencePages: [12, 13, 39],
    className: "l10-tableau-slide",
    html: String.raw`
      <p>The first four entering choices agree. At basis \((x_3,x_4,x_7)\), the rules separate:</p>
      ${cycleTableau(4, { entering: 1, leaving: 7, label: "Tableau where Bland’s entering choice breaks the six-pivot cycle" })}
      <div class="l10-math" data-reveal="1">\[\bar c_1=-\tfrac12,\quad\bar c_5=-1.\]</div>
      <p data-reveal="1">Most-negative pricing chooses \(x_5\). Bland chooses \(x_1\), the smaller eligible index.</p>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Only \(x_7\) decreases: \(\theta^*=1/(5/2)=2/5\). The objective drops to \(-3+(2/5)(-1/2)=-16/5\).</p></section>`,
  },
  {
    key: "bland-termination", title: "Bland’s Rule Guarantees Finite Termination", referencePages: [40],
    html: String.raw`
      <section class="l10-box" data-tone="green"><h3>Termination theorem</h3>
        <p>Starting from a feasible basis, simplex with Bland’s entering and leaving rules never cycles and terminates after finitely many pivots.</p></section>
      <section class="l10-box" data-tone="blue" data-reveal="1"><h3>A useful implementation consequence</h3>
        <p>In revised simplex, scan nonbasic variables in increasing index order. Stop computing reduced costs once the first negative one is found.</p></section>
      <section class="l10-box" data-tone="orange" data-reveal="2"><p><strong>Both choices matter.</strong> Our cycling example already used the smallest-index leaving variable, but its most-negative entering rule still cycled.</p></section>`,
    checkpoint: {
      prompt: "Which pair of choices is Bland’s anticycling rule?",
      choices: ["Most negative reduced cost; smallest-index leaving variable", "Smallest eligible entering index; smallest variable index among minimum-ratio ties", "Smallest row number for both choices", "Smallest entering index; largest feasible ratio"],
      correctIndex: 1,
      explanation: "Bland uses the smallest variable index for the entering choice and for ties in the ordinary minimum-ratio test. Choosing a leaving variable by its row position, or choosing the most negative entering cost, is a different rule.",
      autoOpen: true,
    },
  },
  {
    key: "optimal-basis-exists", title: "Termination Gives an Optimal Basis", referencePages: [19, 35, 40],
    html: String.raw`
      <p>Suppose the standard-form LP is feasible and its optimal value is finite.</p>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Existence of an optimal basis from finite termination">
        <section><p>Start at a basic feasible solution and use either anticycling rule. The run ends after finitely many pivots.</p></section>
        <section data-reveal="1"><p>An improving unbounded ray is impossible when the optimal value is finite. The stopping basis must therefore satisfy</p>
          <div class="l10-math">\[B^{-1}b\ge0,\qquad \bar c_{\mathcal N}\ge0.\]</div></section>
        <section data-reveal="2"><p><strong>An optimal basis exists, even if the optimum is degenerate.</strong> The basic reduced costs are zero, so the complete reduced-cost vector is nonnegative.</p>
          <p>We still need a way to find the initial feasible basis. That is the next part of the method.</p></section>
      </div>`,
  },
];
