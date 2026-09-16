/** Phase I/II: adapted from the authorized Simplex Part 2 reference, pp.41–90.
 * Tableau entries are exact rational strings; row0 stores minus the objective. */

export const auditData = Object.freeze({
  "A": [
    [
      1,
      2,
      3,
      0
    ],
    [
      -1,
      2,
      6,
      0
    ],
    [
      0,
      4,
      9,
      0
    ],
    [
      0,
      0,
      3,
      1
    ]
  ],
  "b": [
    3,
    2,
    5,
    1
  ],
  "augmented": [
    [
      1,
      2,
      3,
      0,
      1,
      0,
      0,
      0
    ],
    [
      -1,
      2,
      6,
      0,
      0,
      1,
      0,
      0
    ],
    [
      0,
      4,
      9,
      0,
      0,
      0,
      1,
      0
    ],
    [
      0,
      0,
      3,
      1,
      0,
      0,
      0,
      1
    ]
  ],
  "phaseOneCost": [
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1
  ],
  "originalCost": [
    1,
    1,
    1,
    0
  ],
  "states": [
    {
      "key": "initial",
      "phase": "I",
      "basis": [
        5,
        6,
        7,
        8
      ],
      "rows": [
        [
          "-11",
          "0",
          "-8",
          "-21",
          "-1",
          "0",
          "0",
          "0",
          "0"
        ],
        [
          "3",
          "1",
          "2",
          "3",
          "0",
          "1",
          "0",
          "0",
          "0"
        ],
        [
          "2",
          "-1",
          "2",
          "6",
          "0",
          "0",
          "1",
          "0",
          "0"
        ],
        [
          "5",
          "0",
          "4",
          "9",
          "0",
          "0",
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "3",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ]
    },
    {
      "key": "after-x4",
      "phase": "I",
      "basis": [
        5,
        6,
        7,
        4
      ],
      "rows": [
        [
          "-10",
          "0",
          "-8",
          "-18",
          "0",
          "0",
          "0",
          "0",
          "1"
        ],
        [
          "3",
          "1",
          "2",
          "3",
          "0",
          "1",
          "0",
          "0",
          "0"
        ],
        [
          "2",
          "-1",
          "2",
          "6",
          "0",
          "0",
          "1",
          "0",
          "0"
        ],
        [
          "5",
          "0",
          "4",
          "9",
          "0",
          "0",
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "3",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ]
    },
    {
      "key": "after-x3",
      "phase": "I",
      "basis": [
        5,
        6,
        7,
        3
      ],
      "rows": [
        [
          "-4",
          "0",
          "-8",
          "0",
          "6",
          "0",
          "0",
          "0",
          "7"
        ],
        [
          "2",
          "1",
          "2",
          "0",
          "-1",
          "1",
          "0",
          "0",
          "-1"
        ],
        [
          "0",
          "-1",
          "2",
          "0",
          "-2",
          "0",
          "1",
          "0",
          "-2"
        ],
        [
          "2",
          "0",
          "4",
          "0",
          "-3",
          "0",
          "0",
          "1",
          "-3"
        ],
        [
          "1/3",
          "0",
          "0",
          "1",
          "1/3",
          "0",
          "0",
          "0",
          "1/3"
        ]
      ]
    },
    {
      "key": "after-x2",
      "phase": "I",
      "basis": [
        5,
        2,
        7,
        3
      ],
      "rows": [
        [
          "-4",
          "-4",
          "0",
          "0",
          "-2",
          "0",
          "4",
          "0",
          "-1"
        ],
        [
          "2",
          "2",
          "0",
          "0",
          "1",
          "1",
          "-1",
          "0",
          "1"
        ],
        [
          "0",
          "-1/2",
          "1",
          "0",
          "-1",
          "0",
          "1/2",
          "0",
          "-1"
        ],
        [
          "2",
          "2",
          "0",
          "0",
          "1",
          "0",
          "-2",
          "1",
          "1"
        ],
        [
          "1/3",
          "0",
          "0",
          "1",
          "1/3",
          "0",
          "0",
          "0",
          "1/3"
        ]
      ]
    },
    {
      "key": "phase-one-zero",
      "phase": "I",
      "basis": [
        1,
        2,
        7,
        3
      ],
      "rows": [
        [
          "0",
          "0",
          "0",
          "0",
          "0",
          "2",
          "2",
          "0",
          "1"
        ],
        [
          "1",
          "1",
          "0",
          "0",
          "1/2",
          "1/2",
          "-1/2",
          "0",
          "1/2"
        ],
        [
          "1/2",
          "0",
          "1",
          "0",
          "-3/4",
          "1/4",
          "1/4",
          "0",
          "-3/4"
        ],
        [
          "0",
          "0",
          "0",
          "0",
          "0",
          "-1",
          "-1",
          "1",
          "0"
        ],
        [
          "1/3",
          "0",
          "0",
          "1",
          "1/3",
          "0",
          "0",
          "0",
          "1/3"
        ]
      ]
    },
    {
      "key": "redundant-row-removed",
      "phase": "cleanup",
      "basis": [
        1,
        2,
        3
      ],
      "rows": [
        [
          "0",
          "0",
          "0",
          "0",
          "0",
          "2",
          "2",
          "0",
          "1"
        ],
        [
          "1",
          "1",
          "0",
          "0",
          "1/2",
          "1/2",
          "-1/2",
          "0",
          "1/2"
        ],
        [
          "1/2",
          "0",
          "1",
          "0",
          "-3/4",
          "1/4",
          "1/4",
          "0",
          "-3/4"
        ],
        [
          "1/3",
          "0",
          "0",
          "1",
          "1/3",
          "0",
          "0",
          "0",
          "1/3"
        ]
      ]
    },
    {
      "key": "artificial-columns-removed",
      "phase": "cleanup",
      "basis": [
        1,
        2,
        3
      ],
      "rows": [
        [
          "0",
          "0",
          "0",
          "0",
          "0"
        ],
        [
          "1",
          "1",
          "0",
          "0",
          "1/2"
        ],
        [
          "1/2",
          "0",
          "1",
          "0",
          "-3/4"
        ],
        [
          "1/3",
          "0",
          "0",
          "1",
          "1/3"
        ]
      ]
    },
    {
      "key": "phase-two-start",
      "phase": "II",
      "basis": [
        1,
        2,
        3
      ],
      "rows": [
        [
          "-11/6",
          "0",
          "0",
          "0",
          "-1/12"
        ],
        [
          "1",
          "1",
          "0",
          "0",
          "1/2"
        ],
        [
          "1/2",
          "0",
          "1",
          "0",
          "-3/4"
        ],
        [
          "1/3",
          "0",
          "0",
          "1",
          "1/3"
        ]
      ]
    },
    {
      "key": "phase-two-optimal",
      "phase": "II",
      "basis": [
        1,
        2,
        4
      ],
      "rows": [
        [
          "-7/4",
          "0",
          "0",
          "1/4",
          "0"
        ],
        [
          "1/2",
          "1",
          "0",
          "-3/2",
          "0"
        ],
        [
          "5/4",
          "0",
          "1",
          "9/4",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "3",
          "1"
        ]
      ]
    }
  ],
  "originalA": [
    [
      1,
      2,
      3,
      0
    ],
    [
      1,
      -2,
      -6,
      0
    ],
    [
      0,
      4,
      9,
      0
    ],
    [
      0,
      0,
      3,
      1
    ]
  ],
  "originalB": [
    3,
    -2,
    5,
    1
  ],
  "reducedA": [
    [
      1,
      2,
      3,
      0
    ],
    [
      -1,
      2,
      6,
      0
    ],
    [
      0,
      0,
      3,
      1
    ]
  ],
  "reducedB": [
    3,
    2,
    1
  ],
  "rowDependency": [
    -1,
    -1,
    1,
    0
  ],
  "pivots": [
    {
      "before": "initial",
      "after": "after-x4",
      "entering": 4,
      "leaving": 8,
      "row": 4,
      "theta": "1",
      "reducedCost": "-1"
    },
    {
      "before": "after-x4",
      "after": "after-x3",
      "entering": 3,
      "leaving": 4,
      "row": 4,
      "theta": "1/3",
      "reducedCost": "-18"
    },
    {
      "before": "after-x3",
      "after": "after-x2",
      "entering": 2,
      "leaving": 6,
      "row": 2,
      "theta": "0",
      "reducedCost": "-8"
    },
    {
      "before": "after-x2",
      "after": "phase-one-zero",
      "entering": 1,
      "leaving": 5,
      "row": 1,
      "theta": "1",
      "reducedCost": "-4"
    },
    {
      "before": "phase-two-start",
      "after": "phase-two-optimal",
      "entering": 4,
      "leaving": 3,
      "row": 3,
      "theta": "1",
      "reducedCost": "-1/12"
    }
  ],
  "referencePages": [
    41,
    90
  ],
  "referenceErrors": []
});

const stateByKey = new Map(auditData.states.map(state => [state.key, state]));
const mathNumber = value => {
  const [numerator, denominator] = String(value).split('/');
  if (!denominator) return `\\(${numerator}\\)`;
  const negative = numerator.startsWith('-');
  return `\\(${negative ? '-' : ''}\\frac{${negative ? numerator.slice(1) : numerator}}{${denominator}}\\)`;
};

function tableau(key) {
  const state = stateByKey.get(key);
  const n = state.rows[0].length - 1;
  const columns = Array.from({length: n}, (_, index) => index + 1);
  const header = n === 8
    ? `<tr><th scope="col" rowspan="2">Basic</th><th scope="col" rowspan="2">RHS</th><th scope="colgroup" colspan="4">Original variables</th><th scope="colgroup" colspan="4" data-phase-artificial>Artificial variables</th></tr><tr>${columns.map(j => `<th scope="col"${j > 4 ? ' data-phase-artificial' : ''}>\\(x_${j}\\)</th>`).join('')}</tr>`
    : `<tr><th scope="col">Basic</th><th scope="col">RHS</th>${columns.map(j => `<th scope="col">\\(x_${j}\\)</th>`).join('')}</tr>`;
  return `<div class="l10-table-wrap" role="region" tabindex="0" aria-label="Example 3.8 tableau: ${key.replaceAll('-', ' ')}">
    <table class="l10-table" data-l10-phase-tableau="${key}" data-basis='${JSON.stringify(state.basis)}' data-tableau='${JSON.stringify(state.rows)}'>
      <thead>${header}</thead><tbody>${state.rows.map((row, i) => `<tr${i === 0 ? ' data-objective-row' : ''}><th scope="row">${i === 0 ? '\\(R_0\\)' : `\\(x_${state.basis[i - 1]}\\)`}</th>${row.map((value, j) => `<td${j > 4 ? ' data-phase-artificial' : ''}>${mathNumber(value)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
}

const checkpointPhaseOne = {
  prompt: 'Phase I ends with objective zero and an artificial variable still basic at zero. What do we know?',
  choices: [
    'The original LP is infeasible',
    'The original LP is already optimal',
    'An original feasible point exists, but its basis may still need cleanup',
    'The artificial variable must become positive before Phase II',
  ],
  correctIndex: 2,
  explanation: 'A zero sum of nonnegative artificial variables makes every artificial variable zero. The original variables are feasible. A zero artificial variable may remain in a degenerate basis, so we still need an original-variable basis and the original objective row.',
  autoOpen: true,
};

const checkpointCleanup = {
  prompt: 'An artificial basic variable has value zero. Its tableau row contains a negative, nonzero coefficient in an original column. Can we pivot on it?',
  choices: [
    'Yes: the zero right-hand side makes this a basis change at the same feasible point',
    'No: every pivot element must be positive',
    'No: a negative coefficient proves infeasibility',
    'Only if the Phase I objective increases',
  ],
  correctIndex: 0,
  explanation: 'Cleanup changes the basis without taking a positive step. Dividing a zero-right-hand-side row by a negative pivot still leaves its right-hand side zero; eliminating that column from other rows does not change their right-hand sides. The feasible point is preserved.',
  autoOpen: true,
};

const checkpointPhaseTwo = {
  prompt: 'After all artificial columns are removed, why must we recompute the objective row?',
  choices: [
    'The feasible set has changed',
    'The basis columns must always become artificial again',
    'A zero Phase I cost means every original reduced cost is zero',
    'Phase I minimized artificial variables; Phase II uses the original cost vector',
  ],
  correctIndex: 3,
  explanation: 'The constraint rows keep the feasible basis, but reduced costs depend on the objective. Recompute the current cost and every reduced cost using the original coefficients. Example 3.8 changes from Phase I cost zero to original cost 11/6 with a negative reduced cost for x4.',
  autoOpen: true,
};

export const phaseOneSlides = [
  {
    key: 'phase-start', title: 'How Do We Find the First Feasible Basis?', referencePages: [41, 44],
    html: String.raw`<div class="l10-stack">
      <p>An anticycling rule tells simplex how to continue without repeating bases. We still need a place to start.</p>
      <section class="l10-box" data-tone="blue"><h3>The missing input</h3><p>A <strong>basic feasible solution</strong>, together with its basis matrix and constraint rows.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><h3>The two-phase idea</h3><p><strong>Phase I:</strong> find a feasible basis or prove infeasibility.<br><strong>Phase II:</strong> optimize the original objective from that basis.</p></section>
    </div>`,
  },
  {
    key: 'phase-slacks', title: 'An Easy Start: Nonnegative Slacks', referencePages: [42, 43],
    html: String.raw`<div class="l10-stack">
      <p>Suppose \(A\) has \(m\) rows and \(n\) columns, and the constraints are</p>
      <div class="l10-math">\[Ax\le b,\qquad x\ge0,\qquad b\ge0.\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Add a vector \(s\in\mathbb R^m\) of nonnegative <strong>slack variables</strong>:</p><div class="l10-math">\[Ax+s=b,\qquad x,s\ge0.\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><div class="l10-math">\[x=0,\quad s=b,\quad B=I_m.\]</div><p>The slack columns form the identity matrix \(I_m\); their values are nonnegative. This is a basic feasible solution.</p></section>
    </div>`,
  },
  {
    key: 'phase-normalize', title: 'Prepare the Equality Constraints', referencePages: [45],
    html: String.raw`<div class="l10-stack">
      <p>Now consider the general standard-form linear program:</p>
      <div class="l10-math">\[\min f(x)=c^\top x\quad\text{subject to }Ax=b,\quad x\ge0.\]</div>
      <p>Here \(x\in\mathbb R^n\), \(b\in\mathbb R^m\), and \(c\) is the original cost vector.</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>If a right-hand side \(b_i&lt;0\), multiply <strong>that entire equality</strong> by \(-1\).</p><div class="l10-math">\[A_{i:}x=b_i\quad\Longleftrightarrow\quad(-A_{i:})x=-b_i.\]</div></section>
      <p data-reveal="2">After these equivalent row changes, assume \(b\ge0\). This alone does not supply an original-variable basis.</p>
    </div>`,
  },
  {
    key: 'phase-auxiliary', title: 'Artificial Variables Give an Initial Basis', referencePages: [46],
    html: String.raw`<div class="l10-stack">
      <p>Introduce \(y\in\mathbb R^m\), a vector of <strong>artificial variables</strong>. Define the auxiliary objective \(w=\sum_{i=1}^m y_i\).</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}\min\quad&w=\mathbf1^\top y\\\text{subject to}\quad&Ax+y=b,\\&x\ge0,\quad y\ge0.\end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><div class="l10-math">\[x=0,\qquad y=b,\qquad B=I_m.\]</div><p>The artificial columns supply a feasible basis immediately. The vector \(\mathbf1\) contains \(m\) ones.</p></section>
      <p data-reveal="2">The original objective \(c^\top x\) waits until Phase II. Phase I asks whether the artificial variables can all become zero.</p>
    </div>`,
  },
  {
    key: 'phase-zero', title: 'Why Zero Phase I Cost Means Feasibility', referencePages: [47],
    html: String.raw`<div class="l10-stack">
      <section class="l10-box" data-tone="blue"><p>If \(Ax=b, x\ge0\), then \((x,0)\) satisfies the auxiliary constraints and has \(w=0\).</p></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>Conversely, if an auxiliary feasible point has \(w=0\),</p><div class="l10-math">\[y\ge0,\quad \sum_i y_i=0\quad\Longrightarrow\quad y=0.\]</div><p>Thus \(Ax+y=b\) becomes \(Ax=b\).</p></section>
      <div class="l10-math" data-reveal="2">\[\boxed{\text{Original LP feasible}\quad\Longleftrightarrow\quad w^*=0.}\]</div>
      <p class="l10-note">The symbol \(w^*\) denotes the optimal Phase I objective value. Nonnegativity of each artificial variable is essential.</p>
    </div>`,
  },
  {
    key: 'phase-positive', title: 'A Positive Phase I Optimum Proves Infeasibility', referencePages: [47, 87],
    html: String.raw`<div class="l10-stack">
      <p>Phase I starts feasible and its objective satisfies \(w\ge0\), so it cannot be unbounded below.</p>
      <section class="l10-box" data-tone="orange" data-reveal="1"><div class="l10-math">\[w^*>0\quad\Longrightarrow\quad\text{the original LP is infeasible}.\]</div><p>An original feasible point would give auxiliary cost zero, contradicting optimality of \(w^*>0\).</p></section>
      <section class="l10-box" data-tone="blue" data-reveal="2"><p>A <strong>current</strong> positive Phase I cost is inconclusive. Continue until the auxiliary optimum is certified. A feasible auxiliary point of cost zero already reaches the lower bound.</p></section>
    </div>`,
  },
  {
    key: 'phase-zero-basis', title: 'A Feasible Point Is Not Yet the Starting Basis', referencePages: [48, 50, 51],
    html: String.raw`<div class="l10-stack">
      <p>Suppose Phase I ends at \((x^*,y^*)\) with \(w=0\). Then \(y^*=0\), and \(x^*\) is feasible for the original LP.</p>
      <section class="l10-box" data-tone="orange" data-reveal="1"><p>An artificial variable can still be <strong>basic at value zero</strong>. The auxiliary basic feasible solution is then degenerate.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><h3>What Phase II needs</h3><p>A basis made entirely of original columns, its constraint rows, and reduced costs for the <strong>original</strong> objective.</p></section>
    </div>`, checkpoint: checkpointPhaseOne,
  },
  {
    key: 'phase-clean-basis', title: 'If the Final Basis Already Uses Original Columns', referencePages: [49],
    html: String.raw`<div class="l10-stack">
      <p>Suppose the final auxiliary basis \(B\) consists entirely of columns of \(A\). Keep its feasible basic values \(B^{-1}b\).</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Delete artificial columns. The original constraint rows remain</p><div class="l10-math">\[\bigl[B^{-1}b\mid B^{-1}A\bigr].\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Using the original costs \(c\), rebuild the objective information:</p><div class="l10-math">\[f_0=c_{\mathcal B}^\top B^{-1}b,\qquad \bar c^\top=c^\top-c_{\mathcal B}^\top B^{-1}A.\]</div></section>
      <p>Here \(c_{\mathcal B}\) lists costs in the same order as the columns of \(B\). Continue simplex with this original objective.</p>
    </div>`,
  },
  {
    key: 'phase-extend-basis', title: 'Why Cleanup Is Possible When A Has Full Row Rank', referencePages: [52, 53],
    html: String.raw`<div class="l10-stack">
      <p>Suppose the final auxiliary basis contains \(k&lt;m\) original columns. Reorder the basis so these are \(A_{B(1)},\ldots,A_{B(k)}\).</p>
      <section class="l10-box" data-tone="blue"><p>They are linearly independent because they are part of a basis.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>If \(\operatorname{rank}(A)=m\), the columns of \(A\) span \(\mathbb R^m\). Extend those \(k\) independent columns to \(m\) independent original columns:</p><div class="l10-math">\[\widetilde B=[A_{B(1)}\ \cdots\ A_{B(k)}\ A_{B(k+1)}\ \cdots\ A_{B(m)}].\]</div></section>
      <p data-reveal="2">The symbols \(B(i)\) name column indices; \(B\) and \(\widetilde B\) are basis matrices.</p>
    </div>`,
  },
  {
    key: 'phase-same-point', title: 'The Extended Basis Represents the Same Point', referencePages: [54, 55],
    html: String.raw`<div class="l10-stack">
      <section class="l10-box" data-tone="blue"><p>Every positive original component of \(x^*\) was already basic. Original variables outside those \(k\) columns were nonbasic and therefore zero.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>The added original columns receive value zero. With all other nonbasic values zero,</p><div class="l10-math">\[\widetilde Bx^*_{\widetilde{\mathcal B}}=b,\qquad x^*_{\widetilde{\mathcal B}}\ge0.\]</div><p>Nonsingularity makes these the basic values \(\widetilde B^{-1}b\). Thus \(x^*\) is unchanged.</p></section>
      <aside class="l10-box" data-tone="orange" data-reveal="2"><p>If \(\operatorname{rank}(A)&lt;m\), no such \(m\)-column basis exists. We must identify and remove redundant equality constraints.</p></aside>
    </div>`,
  },
  {
    key: 'phase-cleanup-row', title: 'Inspect the Row of a Zero Artificial Variable', referencePages: [56, 57],
    html: String.raw`<div class="l10-stack">
      <p>Let row \(\ell\) belong to an artificial basic variable with value zero. Write \(H=B^{-1}A\) and \(h=B^{-1}b\); \(H_{ij}\) is row \(i\), column \(j\).</p>
      <div class="l10-table-wrap" tabindex="0" role="region" aria-label="Artificial-variable cleanup tableau">
      <table class="l10-table"><thead><tr><th scope="col">Value</th><th scope="col">\(x_1\)</th><th scope="col">\(\cdots\)</th><th scope="col">\(x_j\)</th><th scope="col">\(\cdots\)</th><th scope="col">\(x_n\)</th><th scope="col">Artificial column</th></tr></thead><tbody>
      <tr><td>\(h_i\)</td><td>\(H_{i1}\)</td><td>\(\cdots\)</td><td>\(H_{ij}\)</td><td>\(\cdots\)</td><td>\(H_{in}\)</td><td>\(0\)</td></tr>
      <tr><td>\(h_\ell=0\)</td><td>\(H_{\ell1}\)</td><td>\(\cdots\)</td><td>\(\boxed{H_{\ell j}}\)</td><td>\(\cdots\)</td><td>\(H_{\ell n}\)</td><td>\(1\)</td></tr>
      <tr><td>\(h_r\)</td><td>\(H_{r1}\)</td><td>\(\cdots\)</td><td>\(H_{rj}\)</td><td>\(\cdots\)</td><td>\(H_{rn}\)</td><td>\(0\)</td></tr>
      </tbody></table></div>
      <p class="l10-caption">Rows \(i,r\ne\ell\) stand for the other constraint rows. The basic artificial column is the unit vector \(e_\ell\).</p>
      <p data-reveal="1"><strong>Search only the original columns:</strong> is some \(H_{\ell j}\ne0\)? A nonzero entry permits a basis exchange; an entirely zero row reveals a redundancy.</p>
    </div>`,
  },
  {
    key: 'phase-cleanup-independent', title: 'Case 1: A Nonzero Entry Supplies a New Column', referencePages: [58, 59],
    html: String.raw`<div class="l10-stack">
      <p>Keep the original basic columns first, so their positions are \(1,\ldots,k\) and the artificial row satisfies \(\ell>k\). The vector \(e_i\) has a one in position \(i\), zeros elsewhere.</p>
      <div class="l10-math">\[B^{-1}A_{B(i)}=e_i\quad(i=1,\ldots,k).\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Every linear combination of these vectors has zero \(\ell\)th component.</p><div class="l10-math">\[H_{\ell j}=(B^{-1}A_j)_\ell\ne0\quad\Longrightarrow\quad B^{-1}A_j\notin\operatorname{span}\{e_1,\ldots,e_k\}.\]</div></section>
      <p data-reveal="2">Because \(B\) is invertible, \(A_j\) is independent of the original columns already in the basis.</p>
    </div>`,
  },
  {
    key: 'phase-cleanup-pivot', title: 'Pivot at Zero: Even a Negative Entry Works', referencePages: [60, 61, 62],
    html: String.raw`<div class="l10-stack">
      <p>Choose a nonzero original entry \(p=H_{\ell j}\). Let \(R_i\) denote the entire \(i\)th tableau row.</p>
      <div class="l10-math">\[R_\ell\leftarrow R_\ell/p,\qquad R_i\leftarrow R_i-H_{ij}R_\ell\quad(i\ne\ell).\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The entering column becomes \(e_\ell\). Original variable \(x_j\) enters; the artificial variable leaves.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Since \(h_\ell=0\), scaling this row and adding it to other rows changes no basic value. The same feasible point remains, with one fewer basic artificial variable.</p></section>
      <p><strong>The pivot may be negative:</strong> this cleanup exchanges basis columns at a zero step.</p>
    </div>`, checkpoint: checkpointCleanup,
  },
  {
    key: 'phase-cleanup-zero-row', title: 'Case 2: Every Original Entry in the Row Is Zero', referencePages: [63],
    html: String.raw`<div class="l10-stack">
      <p>Suppose \(H_{\ell j}=0\) for every original column \(j=1,\ldots,n\).</p>
      <div class="l10-table-wrap"><table class="l10-table"><thead><tr><th scope="col">Value</th><th scope="col">All original columns</th><th scope="col">Artificial column</th></tr></thead><tbody><tr><td>\(0\)</td><td>\(0\quad\cdots\quad0\)</td><td>\(1\)</td></tr></tbody></table></div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Let \(g^\top=e_\ell^\top B^{-1}\), the \(\ell\)th row of the inverse basis matrix.</p><div class="l10-math">\[g\ne0,\qquad g^\top A=e_\ell^\top B^{-1}A=0^\top.\]</div></section>
      <p data-reveal="2">A row of an invertible matrix cannot be zero. Thus \(g\) gives a nontrivial linear dependence among the rows of \(A\).</p>
    </div>`,
  },
  {
    key: 'phase-cleanup-delete', title: 'Why the Zero Row Can Be Removed', referencePages: [64],
    html: String.raw`<div class="l10-stack">
      <p>Phase I has reached zero, so an original feasible point \(x^*\) exists.</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[g^\top b=g^\top Ax^*=0.\]</div><p>The same combination of right-hand sides is therefore also zero.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><div class="l10-math">\[g^\top Ax=g^\top b\quad\Longleftrightarrow\quad0=0.\]</div><p>After artificial variables are set to zero, this transformed tableau row imposes no restriction. Delete that redundant row and its artificial basic variable.</p></section>
      <p data-reveal="2">Repeat: pivot out a zero artificial variable when possible; otherwise delete its redundant row. Finish with an original-variable basis for the remaining independent constraints.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-model', title: 'Example 3.8: Start Without an Obvious Basis', referencePages: [65],
    html: String.raw`<div class="l10-stack">
      <p>We will carry this complete model through both phases:</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        \min\quad&f=x_1+x_2+x_3\\
        \text{subject to}\quad&x_1+2x_2+3x_3=3,\\
        &x_1-2x_2-6x_3=-2,\\
        &4x_2+9x_3=5,\\
        &3x_3+x_4=1,\qquad x_1,x_2,x_3,x_4\ge0.
      \end{aligned}\]</div></section>
      <p data-reveal="1">Reverse the second equality to make its right-hand side positive. Keep the original costs \(c=(1,1,1,0)\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-auxiliary', title: 'Example 3.8: Build the Auxiliary LP', referencePages: [66],
    html: String.raw`<div class="l10-stack">
      <p>In this example, name the four artificial variables \(x_5,x_6,x_7,x_8\).</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        \min\quad&w=x_5+x_6+x_7+x_8\\
        \text{subject to}\quad&x_1+2x_2+3x_3+x_5=3,\\
        &-x_1+2x_2+6x_3+x_6=2,\\
        &4x_2+9x_3+x_7=5,\\
        &3x_3+x_4+x_8=1,\qquad x_1,\ldots,x_8\ge0.
      \end{aligned}\]</div></section>
      <p data-reveal="1">Original variables \(x_1,\ldots,x_4\) have zero Phase I cost; every artificial variable has cost one.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-initial-point', title: 'Example 3.8: The Artificial Basis Costs 11', referencePages: [67],
    html: String.raw`<div class="l10-stack">
      <div class="l10-math">\[x_1=x_2=x_3=x_4=0,\qquad(x_5,x_6,x_7,x_8)=(3,2,5,1).\]</div>
      <section class="l10-box" data-tone="blue"><p>The basis columns are the four artificial unit columns:</p><div class="l10-math">\[B=[A_5\ A_6\ A_7\ A_8]=I_4,\qquad w=3+2+5+1=11.\]</div></section>
      <p data-reveal="1">Here \(A_5,\ldots,A_8\) denote columns of the <strong>augmented</strong> constraint matrix. The original matrix has only columns \(A_1,\ldots,A_4\).</p>
      <p data-reveal="2">Our task is to reduce \(w\) to zero while preserving the augmented equalities and nonnegativity.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-convention', title: 'Read the Objective Row Before We Pivot', referencePages: [68, 69, 70, 71],
    html: String.raw`<div class="l10-stack">
      <p>Let \(M=[A\mid I_4]\), \(v=(x_1,\ldots,x_8)\), and \(q=(0,0,0,0,1,1,1,1)\). The auxiliary objective is \(w=q^\top v\).</p>
      <div class="l10-math">\[w=w_0+\bar q^\top v,\qquad \bar q^\top=q^\top-q_{\mathcal B}^\top B^{-1}M.\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Our tableau convention is</p><div class="l10-math">\[\begin{array}{c|c}-w_0&\bar q^\top\\\hline B^{-1}b&B^{-1}M\end{array}.\]</div></section>
      <p data-reveal="2"><strong>RHS</strong> means right-hand side. Its top entry is <strong>minus</strong> the current objective; entries below it are basic values. \(R_0\) names the objective row.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-build-objective', title: 'Construct the Phase I Objective Row', referencePages: [68, 69, 70, 71],
    html: String.raw`<div class="l10-stack">
      <p>Initially \(B=I_4\) and \(q_{\mathcal B}=\mathbf1\). Eliminate the basic artificial coefficients from the raw objective row.</p>
      <div class="l10-math">\[\begin{aligned}
        \bar q^\top&=[\mathbf0^\top\mid\mathbf1^\top]-\mathbf1^\top[A\mid I_4]\\
                    &=[-\mathbf1^\top A\mid\mathbf0^\top].
      \end{aligned}\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The four original column sums are \(0,8,21,1\). Therefore</p><div class="l10-math">\[\bar q=(0,-8,-21,-1,0,0,0,0).\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Subtract the four constraint rows from the raw objective row:</p><div class="l10-math">\[R_0=[-11\mid0,-8,-21,-1,0,0,0,0].\]</div></section>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-initial', title: 'Example 3.8: The Initial Tableau', referencePages: [72, 73],
    html: String.raw`<div class="l10-stack">
      ${tableau('initial')}
      <p>The upper-left entry is \(-11\), so \(w=11\). The basic artificial columns form the identity.</p>
      <p data-reveal="1">We choose eligible entering variables in the reference order \(x_4,x_3,x_2,x_1\). Break leaving-variable ties by smaller variable index.</p>
      <p data-reveal="2">First choose \(x_4\): its reduced cost is \(-1\), and its column is already a unit column.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-pivot-x4', title: 'Pivot 1: x₄ Enters and x₈ Leaves', referencePages: [72, 73],
    html: String.raw`<div class="l10-stack">
      <p>Increase \(x_4=\theta\). Its only nonzero constraint coefficient is one in the \(x_8\) row.</p>
      <div class="l10-math">\[x_8=1-\theta\ge0\quad\Longrightarrow\quad\theta^*=1.\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Replace basic \(x_8\) by \(x_4\). Their columns are identical, so the basis matrix remains \(I_4\).</p><div class="l10-math">\[w_{\mathrm{new}}=11+(-1)(1)=10.\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Only the objective row changes numerically:</p><div class="l10-math">\[R_0\leftarrow R_0+R_4.\]</div><p>The fourth basic-variable label changes from \(x_8\) to \(x_4\).</p></section>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-x4', title: 'After Pivot 1: The Cost Is 10', referencePages: [74, 75],
    html: String.raw`<div class="l10-stack">
      ${tableau('after-x4')}
      <p>The basis is \((x_5,x_6,x_7,x_4)\), with values \((3,2,5,1)\).</p>
      <p data-reveal="1">Next choose \(x_3\), whose reduced cost is \(-18\). Its tableau column is \((3,6,9,3)^\top\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-pivot-x3', title: 'Pivot 2: A Tie Sends x₄ Out of the Basis', referencePages: [74, 75],
    html: String.raw`<div class="l10-stack">
      <p>For entering \(x_3\), divide each basic value by its positive entering-column coefficient:</p>
      <div class="l10-table-wrap"><table class="l10-table"><thead><tr><th scope="col">Basic variable</th><th scope="col">Value</th><th scope="col">Coefficient</th><th scope="col">Step bound</th></tr></thead><tbody>
        <tr><th scope="row">\(x_5\)</th><td>\(3\)</td><td>\(3\)</td><td>\(1\)</td></tr>
        <tr><th scope="row">\(x_6\)</th><td>\(2\)</td><td>\(6\)</td><td>\(1/3\)</td></tr>
        <tr><th scope="row">\(x_7\)</th><td>\(5\)</td><td>\(9\)</td><td>\(5/9\)</td></tr>
        <tr><th scope="row">\(x_4\)</th><td>\(1\)</td><td>\(3\)</td><td>\(1/3\)</td></tr>
      </tbody></table></div>
      <p data-reveal="1">The minimum is \(\theta^*=1/3\). The tie is between \(x_4\) and \(x_6\); choose \(x_4\).</p>
      <div class="l10-math" data-reveal="2">\[w_{\mathrm{new}}=10-18(1/3)=4.\]</div>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-x3', title: 'After Pivot 2: A Basic Artificial Variable Is Zero', referencePages: [76, 77],
    html: String.raw`<div class="l10-stack">
      ${tableau('after-x3')}
      <p>The basis is \((x_5,x_6,x_7,x_3)\). Artificial variable \(x_6\) is still basic, but its value is now zero.</p>
      <p data-reveal="1">The remaining negative reduced cost is \(\bar q_2=-8\), so choose \(x_2\) next.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-pivot-x2', title: 'Pivot 3: The Step Is Zero', referencePages: [76, 77],
    html: String.raw`<div class="l10-stack">
      <p>The entering \(x_2\) column is \((2,2,4,0)^\top\), in basic order \((x_5,x_6,x_7,x_3)\).</p>
      <div class="l10-math">\[\theta^*=\min\left\{\frac{2}{2},\frac{0}{2},\frac{2}{4}\right\}=0.\]</div>
      <section class="l10-box" data-tone="orange" data-reveal="1"><p>Basic \(x_6\) leaves and \(x_2\) enters at zero. The basis changes while the point and objective stay fixed:</p><div class="l10-math">\[w_{\mathrm{new}}=4+(-8)(0)=4.\]</div></section>
      <p data-reveal="2">Normalize the pivot row by dividing by \(2\); eliminate \(x_2\) from every other row, including \(R_0\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-x2', title: 'After Pivot 3: Same Point, Different Basis', referencePages: [78, 79],
    html: String.raw`<div class="l10-stack">
      ${tableau('after-x2')}
      <p>The basis is \((x_5,x_2,x_7,x_3)\), with values \((2,0,2,1/3)\). The objective remains \(w=4\).</p>
      <p data-reveal="1">Choose \(x_1\), whose reduced cost is \(-4\). Its entering column is \((2,-1/2,2,0)^\top\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-pivot-x1', title: 'Pivot 4: Remove Another Artificial Variable', referencePages: [78, 79],
    html: String.raw`<div class="l10-stack">
      <p>Increase \(x_1\). Only the positive coefficients in its tableau column give upper bounds.</p>
      <div class="l10-math">\[\theta^*=\min\left\{\frac{x_5}{2},\frac{x_7}{2}\right\}=\min\{1,1\}=1.\]</div>
      <p>The \(-1/2\) coefficient makes basic \(x_2\) increase; the zero coefficient leaves \(x_3\) unchanged.</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The leaving tie is between \(x_5\) and \(x_7\). Choose \(x_5\), then pivot on the coefficient \(2\).</p></section>
      <div class="l10-math" data-reveal="2">\[w_{\mathrm{new}}=4-4(1)=0.\]</div>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-zero', title: 'Phase I Reaches Zero, with x₇ Still Basic', referencePages: [80],
    html: String.raw`<div class="l10-stack">
      ${tableau('phase-one-zero')}
      <p>All artificial values are zero, so the original point is \((x_1,x_2,x_3,x_4)=(1,1/2,1/3,0)\).</p>
      <p data-reveal="1">The basis still includes artificial \(x_7=0\). Inspect its row before starting Phase II.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-redundancy', title: 'The x₇ Row Identifies an Exact Redundancy', referencePages: [81],
    html: String.raw`<div class="l10-stack">
      <p>The \(x_7\) tableau row is</p>
      <div class="l10-math">\[\bigl[0\mid0,0,0,0\mid-1,-1,1,0\bigr].\]</div>
      <p>Every original-column entry is zero. The artificial block identifies \(g=(-1,-1,1,0)\).</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><div class="l10-math">\[-A_{1:}-A_{2:}+A_{3:}=0,\qquad-3-2+5=0.\]</div><p>For the normalized model, row 3 equals row 1 plus row 2.</p></section>
      <p data-reveal="2">Delete this zero transformed row and the basic artificial variable \(x_7\). The remaining independent equations have a three-column basis.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-row-removed', title: 'Remove the Redundant Tableau Row', referencePages: [82],
    html: String.raw`<div class="l10-stack">
      ${tableau('redundant-row-removed')}
      <p>The remaining basic variables are \(x_1,x_2,x_3\). Their nonnegative values are unchanged.</p>
      <p data-reveal="1">No artificial variable is now basic. We can delete all four artificial columns, including nonbasic \(x_7\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-columns-removed', title: 'Remove Artificial Columns, Keep the Constraint Rows', referencePages: [83],
    html: String.raw`<div class="l10-stack">
      ${tableau('artificial-columns-removed')}
      <p>The zero objective row still belongs to <strong>Phase I</strong>. It says nothing about optimality for \(f=x_1+x_2+x_3\).</p>
      <p data-reveal="1">Use the original costs \(c=(1,1,1,0)\). In basic order \((x_1,x_2,x_3)\), \(c_{\mathcal B}=(1,1,1)\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-reprice', title: 'Rebuild the Original Objective Row', referencePages: [83],
    html: String.raw`<div class="l10-stack">
      <p>The current original objective is \(f_0=1+\frac12+\frac13=\frac{11}{6}\).</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The basic reduced costs are zero. For \(x_4\), the transformed column is \((1/2,-3/4,1/3)^\top\):</p><div class="l10-math">\[\bar c_4=0-\left(\frac12-\frac34+\frac13\right)=-\frac1{12}.\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><div class="l10-math">\[R_0=\left[-\frac{11}{6}\mid0,0,0,-\frac1{12}\right].\]</div><p>Feasibility survives cleanup. Reduced costs change because the objective changes.</p></section>
    </div>`, checkpoint: checkpointPhaseTwo,
  },
  {
    key: 'phase-ex38-phase-two', title: 'Phase II Begins from a Feasible Original Basis', referencePages: [84],
    html: String.raw`<div class="l10-stack">
      ${tableau('phase-two-start')}
      <section class="l10-box" data-tone="blue"><h3>Try the next pivot</h3><p>Which variable can enter? Which basic variable limits the step? Compute the next point and original objective before continuing.</p></section>
      <p class="l10-note">The following slides give the complete solution to this exercise.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-phase-two-pivot', title: 'Phase II: x₄ Enters and x₃ Leaves', referencePages: [84],
    html: String.raw`<div class="l10-stack">
      <p>Since \(\bar c_4=-1/12\), let \(x_4=\theta\). The basic values change as</p>
      <div class="l10-math">\[\begin{aligned}x_1&=1-\theta/2,\\x_2&=1/2+3\theta/4,\\x_3&=1/3-\theta/3.\end{aligned}\]</div>
      <section class="l10-box" data-tone="blue" data-reveal="1"><div class="l10-math">\[\theta^*=\min\left\{\frac{1}{1/2},\frac{1/3}{1/3}\right\}=1.\]</div><p>Basic \(x_3\) leaves. Basic \(x_2\) increases and gives no upper bound.</p></section>
      <div class="l10-math" data-reveal="2">\[f_{\mathrm{new}}=\frac{11}{6}-\frac1{12}=\frac74.\]</div>
    </div>`,
  },
  {
    key: 'phase-ex38-optimal', title: 'Example 3.8: The Original Optimum Is 7/4', referencePages: [84],
    html: String.raw`<div class="l10-stack">
      ${tableau('phase-two-optimal')}
      <section class="l10-box" data-tone="green" data-reveal="1"><div class="l10-math">\[x^*=(1/2,5/4,0,1),\qquad f(x^*)=7/4.\]</div><p>The sole nonbasic reduced cost is \(\bar c_3=1/4>0\). The feasible basis is optimal for the original minimization problem.</p></section>
      <p data-reveal="2">Check the original four equalities directly. The redundant equality still holds even though we no longer store it.</p>
    </div>`,
  },
  {
    key: 'phase-fewer-artificials', title: 'Use Existing Unit Columns When Possible', referencePages: [85],
    html: String.raw`<div class="l10-stack">
      <p>In Example 3.8, \(x_4\) appears only in the fourth equation, with coefficient one. Its column already supplies the fourth unit column.</p>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>Start with \((x_5,x_6,x_7,x_4)=(3,2,5,1)\), omit artificial \(x_8\), and skip the first pivot.</p></section>
      <section class="l10-box" data-tone="blue" data-reveal="2"><p>More generally, an original variable occurring in only one normalized row with coefficient \(\alpha>0\) can be basic there at value \(b_i/\alpha\ge0\). Artificial columns are needed only for the remaining rows.</p></section>
      <p>Keep the rows and chosen starting columns independent; the initial Phase I objective counts only artificial variables actually introduced.</p>
    </div>`,
  },
  {
    key: 'phase-algorithm-one', title: 'Phase I: Establish Feasibility', referencePages: [86, 87],
    html: String.raw`<ol class="l10-stack">
      <li><strong>Normalize:</strong> multiply equality rows by \(-1\) as needed so \(b\ge0\).</li>
      <li data-reveal="1"><strong>Initialize:</strong> keep suitable original starting columns, introduce any needed artificial variables, and minimize their sum using simplex with an anticycling rule.</li>
      <li data-reveal="2"><strong>Read the optimum:</strong> if \(w^*>0\), stop: the original LP is infeasible. If \(w^*=0\), all artificial values are zero and an original feasible point has been found.</li>
    </ol>`,
  },
  {
    key: 'phase-algorithm-cleanup', title: 'Phase I: Turn the Feasible Point into a Basis', referencePages: [88],
    html: String.raw`<div class="l10-stack">
      <p>While an artificial variable is basic at zero, inspect its tableau row \(\ell\) over original columns:</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><h3>A nonzero original entry exists</h3><p>Pivot on any \((B^{-1}A_j)_\ell\ne0\). Original \(x_j\) enters; the artificial basic variable leaves. The point stays fixed.</p></section>
      <section class="l10-box" data-tone="orange" data-reveal="2"><h3>All original entries are zero</h3><p>The row is a redundant equality at zero Phase I cost. Delete it and its artificial basic variable.</p></section>
      <p>Repeat until all basic variables are original. Discard the remaining artificial columns.</p>
    </div>`,
  },
  {
    key: 'phase-algorithm-two', title: 'Phase II: Restore and Optimize the Original Cost', referencePages: [89],
    html: String.raw`<ol class="l10-stack">
      <li><strong>Keep the basis</strong> produced by Phase I after cleanup. It is feasible for the remaining independent original equalities.</li>
      <li><strong>Keep the constraint rows</strong> after removing artificial columns; discard the Phase I objective row.</li>
      <li data-reveal="1"><strong>Reprice:</strong> compute the current original objective \(f_0\) and \(\bar c_j=c_j-c_{\mathcal B}^\top B^{-1}A_j\) using the original costs.</li>
      <li data-reveal="2"><strong>Continue simplex</strong> with an anticycling rule until an optimal basis or an improving feasible ray is obtained.</li>
    </ol>`,
  },
  {
    key: 'phase-all-outcomes', title: 'Two Phases Handle Every Standard-Form Outcome', referencePages: [90],
    html: String.raw`<div class="l10-stack">
      <div class="l10-table-wrap"><table class="l10-table"><thead><tr><th scope="col">What happens?</th><th scope="col">Where it is handled</th></tr></thead><tbody>
        <tr><th scope="row">The original LP is infeasible</th><td>Phase I optimum \(w^*>0\).</td></tr>
        <tr><th scope="row">Feasible equalities are dependent</th><td>Phase I cleanup removes redundant rows.</td></tr>
        <tr><th scope="row">Original objective is unbounded below</th><td>Phase II finds an improving feasible ray.</td></tr>
        <tr><th scope="row">A finite optimum exists</th><td>Phase II terminates at an optimal basis.</td></tr>
      </tbody></table></div>
      <p data-reveal="1">An anticycling rule supplies the termination guarantee, including degenerate cases.</p>
      <section class="l10-box" data-tone="blue" data-reveal="2"><p>We now know how to start and finish. Next, interpret these basis exchanges geometrically using the columns of the constraint matrix.</p></section>
    </div>`,
  },
];
