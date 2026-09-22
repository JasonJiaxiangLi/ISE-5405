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
  prompt: 'A feasible Phase I solution has w = 0. What have we established?',
  choices: [
    'The original LP is infeasible',
    'The original LP is already optimal',
    'All artificial variables are zero, and the original variables satisfy the original constraints',
    'Every artificial variable has left the basis',
  ],
  correctIndex: 2,
  explanation: 'The artificial variables are nonnegative and sum to zero, so each is zero. The auxiliary equalities therefore reduce to the original equalities. This establishes feasibility, not optimality for the original objective or which variables are basic.',
  autoOpen: true,
};

const checkpointBasisExchange = {
  prompt: 'At x₂ = 0, the dictionary is x₁ = 1 − x₂ and a = 2x₂. We solve for x₂ instead of artificial a, then set a = 0. What changes?',
  choices: [
    'The basis changes from (x₁, a) to (x₁, x₂), but the feasible point remains (1, 0)',
    'The original point moves to (0, 1)',
    'The Phase I objective becomes negative',
    'The negative tableau pivot coefficient makes the new point infeasible',
  ],
  correctIndex: 0,
  explanation: 'Solving a = 2x₂ gives x₂ = a/2 and x₁ = 1 − a/2. With nonbasic a = 0, we still have x₁ = 1 and x₂ = 0. Only the basis changes; the artificial variable leaves at a zero step.',
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
  explanation: 'The constraint rows keep the feasible basis, but reduced costs depend on the objective. Substitute the current dictionary into the original objective to obtain its constant and nonbasic-variable coefficients. Example 3.8 changes from Phase I cost zero to original cost 11/6 with a negative reduced cost for x4.',
  autoOpen: true,
};

function startingDictionaryPlot() {
  // Equal scale on both axes: x1+x2>=2, x1+2*x2<=6, x>=0.
  const project = ([x, y]) => [65 + 65 * x, 285 - 65 * y];
  const point = v => project(v).join(',');
  const polygon = [[2, 0], [6, 0], [0, 3], [0, 2]];
  const ticks = [1, 2, 3, 4, 5, 6].map(x => {
    const [px, py] = project([x, 0]);
    return `<path d="M${px},${py}v6"/><text x="${px}" y="${py + 28}" text-anchor="middle">${x}</text>`;
  }).join('') + [1, 2, 3].map(y => {
    const [px, py] = project([0, y]);
    return `<path d="M${px},${py}h-6"/><text x="${px - 14}" y="${py + 7}" text-anchor="end">${y}</text>`;
  }).join('');
  return String.raw`<figure class="l10-figure l11-start-figure" data-phase-start-figure>
    <div class="l11-start-plot">
      <svg viewBox="0 0 540 390" role="img" aria-label="Feasible region in the x1-x2 plane, with vertices (2,0), (6,0), (0,3), and (0,2). The origin is outside; (2,0) is on the feasible boundary.">
        <polygon data-phase-feasible-region points="${polygon.map(point).join(' ')}" fill="#c6e5f2" stroke="#668c9c" stroke-width="2"/>
        <g stroke="#334b57" stroke-width="2" fill="none"><path d="M65,55V285H505"/>${ticks}</g>
        <line data-phase-boundary="lower" x1="65" y1="155" x2="195" y2="285" stroke="#ad510e" stroke-width="4"/>
        <line data-phase-boundary="upper" x1="65" y1="90" x2="455" y2="285" stroke="#2f6d8f" stroke-width="4"/>
        <text x="250" y="244" text-anchor="middle" class="l11-region-label">feasible set</text>
        <g data-reveal="2">
          <circle data-phase-point="origin" cx="65" cy="285" r="10" fill="white" stroke="#8b2047" stroke-width="3"/>
          <path d="M60,280l10,10m0,-10l-10,10" stroke="#8b2047" stroke-width="2"/>
          <circle data-phase-point="feasible" cx="195" cy="285" r="9" fill="#267847" stroke="white" stroke-width="3"/>
        </g>
      </svg>
      <span class="l11-plot-axis l11-plot-x">\(x_1\)</span>
      <span class="l11-plot-axis l11-plot-y">\(x_2\)</span>
      <span class="l11-plot-point l11-plot-origin" data-reveal="2">\((0,0)\)<br>infeasible</span>
      <span class="l11-plot-point l11-plot-feasible" data-reveal="2">\((2,0)\)<br>feasible</span>
    </div>
    <figcaption class="l11-boundary-key">
      <span><i class="l11-lower-key" aria-hidden="true"></i>\(x_1+x_2=2\)</span>
      <span><i class="l11-upper-key" aria-hidden="true"></i>\(x_1+2x_2=6\)</span>
    </figcaption>
  </figure>`;
}

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
    key: 'phase-artificial-start', title: 'The Usual Starting Dictionary Can Be Infeasible', referencePages: [44, 46], className: 'l11-phase-intro l11-phase-plot-slide',
    html: String.raw`<div class="l10-stack" data-phase-help-start>
      <div class="l10-math">\[x_1+x_2\ge2,\qquad x_1+2x_2\le6,\qquad x_1,x_2\ge0.\]</div>
      <div class="l10-pair">
        <div class="l10-stack">
          <section class="l10-box" data-tone="blue" data-reveal="1"><p>Subtract <strong>surplus</strong> \(s_1\ge0\).<br>Add <strong>slack</strong> \(s_2\ge0\):</p>
            <div class="l10-math">\[\begin{aligned}s_1&=-2+x_1+x_2,\\s_2&=6-x_1-2x_2.\end{aligned}\]</div></section>
          <section class="l10-box" data-tone="orange" data-reveal="2"><p>Set \(x_1=x_2=0\): then \(s_1=-2,\ s_2=6\). The starting dictionary is <strong>infeasible</strong>.</p></section>
          <p data-reveal="2">Yet \((x_1,x_2)=(2,0)\) satisfies both constraints. How can we find a feasible basis <strong>systematically</strong>?</p>
        </div>
        ${startingDictionaryPlot()}
      </div>
    </div>`,
  },
  {
    key: 'phase-artificial-dictionary', title: 'An Artificial Variable Gives a Feasible Start', referencePages: [46, 85], className: 'l11-phase-intro',
    html: String.raw`<div class="l10-stack" data-phase-auxiliary-dictionary>
      <p>Keep \(s_2\) basic. Add an <strong>artificial variable</strong> \(y\ge0\) to the first equality:</p>
      <div class="l10-math">\[x_1+x_2-s_1+y=2.\]</div>
      <section class="l10-box" data-tone="blue"><p>Solve for the new basic variables \(y,s_2\):</p>
        <div class="l10-math">\[\begin{aligned}y&=2-x_1-x_2+s_1,\\s_2&=6-x_1-2x_2.\end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>Set the nonbasic variables \(x_1=x_2=s_1=0\). Then \(y=2,\ s_2=6\):<br>we have a <strong>feasible auxiliary dictionary</strong>. All five variables are nonnegative.</p></section>
      <section class="l10-box" data-tone="blue" data-reveal="2"><p><strong>Phase I: minimize \(w=y\)</strong> subject to this dictionary and nonnegativity.<br>When \(y=0\), we recover the original constraints. Keep the legitimate slack and surplus variables.</p></section>
    </div>`,
  },
  {
    key: 'phase-auxiliary', title: 'The General Phase I Problem', referencePages: [45, 46], className: 'l11-phase-intro',
    html: String.raw`<div class="l10-stack" data-phase-general-problem>
      <p>Write the original LP as \(\min c^\top x\) subject to \(Ax=b,\ x\ge0\). Here \(x\) includes any slack and surplus variables.</p>
      <p>For \(m\) equalities, a general construction uses <strong>one artificial variable per row</strong>:</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><div class="l10-math">\[\begin{aligned}\min\quad&w=\sum_{i=1}^{m}y_i\\\text{subject to}\quad&Ax+y=b,\\&x\ge0,\quad y\ge0.\end{aligned}\]</div>
        <p><strong>Intended start:</strong> \(x=0,\ y=b,\ B=I_m\).</p>
      </section>
      <section class="l10-box" data-tone="green" data-reveal="2" data-phase-normalization><p><strong>Make this start feasible:</strong> first make \(b\ge0\). If \(b_i&lt;0\), multiply <strong>that entire equality</strong> by \(-1\) <strong>before adding the helpers</strong>. Then \(y=b\ge0\).</p></section>
      <p data-reveal="2">Since \(y\ge0\), total help \(w=0\) means <strong>every helper is zero</strong>. The original cost \(c^\top x\) waits until Phase II.</p>
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
    key: 'phase-zero-basis', title: 'Phase I Has Found a Feasible Point', referencePages: [48, 50, 51], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <section class="l10-box" data-tone="green"><p>In Example 3.8, \(w=0\). Every artificial variable is zero, and</p><div class="l10-math">\[(x_1,x_2,x_3,x_4)=(1,\tfrac12,\tfrac13,0)\]</div><p>satisfies the original constraints. <strong>Phase I has succeeded.</strong></p></section>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>The current basic variables are \((x_1,x_2,x_7,x_3)\), with values \((1,\tfrac12,0,\tfrac13)\).</p><p><strong>Basic</strong> means solved for in the dictionary; it does not mean positive. Thus artificial \(x_7\) is still basic at zero—a degenerate basis.</p></section>
      <p data-reveal="2">Next, write a dictionary using only original variables and restore \(f=x_1+x_2+x_3\). We do not need to reduce \(w\) further.</p>
    </div>`, checkpoint: checkpointPhaseOne,
  },  {
    key: 'phase-clean-basis', title: 'If the Final Basis Already Uses Original Columns', referencePages: [49],
    html: String.raw`<div class="l10-stack">
      <p>Suppose the final auxiliary basis \(B\) consists entirely of columns of \(A\). Keep its feasible basic values \(B^{-1}b\).</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><p>Delete artificial columns. The original constraint rows remain</p><div class="l10-math">\[\bigl[B^{-1}b\mid B^{-1}A\bigr].\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Using the original costs \(c\), rebuild the objective information:</p><div class="l10-math">\[f_0=c_{\mathcal B}^\top B^{-1}b,\qquad \bar c^\top=c^\top-c_{\mathcal B}^\top B^{-1}A.\]</div></section>
      <p>Here \(c_{\mathcal B}\) lists costs in the same order as the columns of \(B\). Continue simplex with this original objective.</p>
    </div>`,
  },
  {
    key: 'phase-extend-basis', title: 'Why Original Columns Can Replace the Artificial Columns', referencePages: [52, 53],
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
      <div class="l10-table-wrap" tabindex="0" role="region" aria-label="Tableau row of a zero basic artificial variable">
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
      <p><strong>The pivot may be negative:</strong> this operation exchanges basis columns at a zero step.</p>
    </div>`,
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
    key: 'phase-ex38-initial-point', title: 'Example 3.8: Solve for the Basic Variables', referencePages: [67], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <p>Choose \(x_5,x_6,x_7,x_8\) as basic. Move the other terms to the right in each equality:</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        x_5&=3-x_1-2x_2-3x_3,\\
        x_6&=2+x_1-2x_2-6x_3,\\
        x_7&=5-4x_2-9x_3,\\
        x_8&=1-3x_3-x_4.
      \end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>Set the nonbasic variables \(x_1=x_2=x_3=x_4=0\):</p><div class="l10-math">\[(x_5,x_6,x_7,x_8)=(3,2,5,1).\]</div><p>Every value is nonnegative, so this is a <strong>feasible starting dictionary</strong>.</p></section>
      <p data-reveal="2">Its Phase I cost is \(w=3+2+5+1=11\). Next, express \(w\) using only the nonbasic variables.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-build-objective', title: 'Substitute the Dictionary into the Phase I Objective', referencePages: [68, 69, 70, 71], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <p>Start with \(w=x_5+x_6+x_7+x_8\). Substitute the four expressions we just obtained:</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><div class="l10-math">\[\begin{aligned}
        w&=(3-x_1-2x_2-3x_3)\\
         &\quad +(2+x_1-2x_2-6x_3)\\
         &\quad +(5-4x_2-9x_3)\\
         &\quad +(1-3x_3-x_4).
      \end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>The \(x_1\) terms cancel. Collect the remaining terms:</p><div class="l10-math">\[\boxed{w=11-8x_2-21x_3-x_4}.\]</div></section>
      <p data-reveal="2">The coefficient \(\bar q_j\) of \(x_j\) is its <strong>Phase I reduced cost</strong>. For \(x_1,x_2,x_3,x_4\), these are \(0,-8,-21,-1\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-initial', title: 'From the Dictionary to the Initial Tableau', referencePages: [68, 69, 70, 71, 72, 73], className: 'l11-ex38-tableau l10-tableau-slide',
    html: String.raw`<div class="l10-stack">
      <p>Move nonbasic terms left in each constraint, e.g. \(x_1+2x_2+3x_3+x_5=3\).</p>
      <p>Use \(-w\) for the objective row: \(-w-8x_2-21x_3-x_4=-11\).</p>
      <div data-reveal="1">${tableau('initial')}</div>
      <p data-reveal="2">In \(R_0\), \(-w\) is implicit. The <strong>RHS</strong> (right-hand side) is \(-w_0=-11\); remaining entries are reduced costs.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-tableau-convention', title: 'The Same Calculation in Matrix Notation', referencePages: [67, 68, 69, 70, 71], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <p>Here \(A,b\) describe the original four equalities <strong>after the sign change</strong>. Group the variables as</p>
      <div class="l10-math l11-math-wrap"><span>\(x_{\mathcal B}=(x_5,x_6,x_7,x_8)^\top,\)</span><span>\(x_{\mathcal N}=(x_1,x_2,x_3,x_4)^\top.\)</span></div>
      <section class="l10-box" data-tone="blue"><div class="l10-math l11-math-wrap"><span>\(Ax_{\mathcal N}+x_{\mathcal B}=b,\quad B=I_4\)</span><span>\(\Longrightarrow\quad x_{\mathcal B}=b-Ax_{\mathcal N}.\)</span></div><p>This is the same four-equation dictionary.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>Multiplying by \(\mathbf1^\top=(1,1,1,1)\) <strong>adds those four equations</strong>:</p><div class="l10-math">\[w=\mathbf1^\top x_{\mathcal B}=\mathbf1^\top b-\mathbf1^\top A x_{\mathcal N}.\]</div></section>
      <section class="l10-box" data-tone="blue" data-reveal="2"><div class="l10-math l11-math-wrap"><span>\(\mathbf1^\top b=11,\)</span><span>\(\mathbf1^\top A=(0,8,21,1).\)</span></div><p>Thus \(w=11-8x_2-21x_3-x_4\), exactly as obtained by substitution.</p></section>
    </div>`,
  },
  {
    key: 'phase-ex38-pivot-x4', title: 'Pivot 1: x₄ Enters and x₈ Leaves', referencePages: [72, 73], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <p>We illustrate one valid pivot sequence: choose a nonbasic variable with negative Phase I reduced cost. Other choices may also be valid. Break minimum-ratio ties by smaller basic-variable index.</p>
      <p>Choose \(x_4\), whose reduced cost is \(-1\). Increasing \(x_4=\theta\) changes only \(x_8\):</p>
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
    key: 'phase-ex38-tableau-x2', title: 'After Pivot 3: Same Point, Different Basis', referencePages: [78, 79], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      ${tableau('after-x2')}
      <p>The basis is \((x_5,x_2,x_7,x_3)\), with values \((2,0,2,1/3)\). The objective remains \(w=4\).</p>
      <p data-reveal="1">Three nonbasic variables have negative reduced costs: \(x_1,x_4\), and artificial \(x_8\). Compare them before choosing.</p>
    </div>`,
  },
  {
    key: 'phase-ex38-entering-choices', title: 'Before Pivot 4: Compare the Entering Candidates', referencePages: [78, 79], className: 'l11-ex38-arithmetic l10-tableau-slide',
    html: String.raw`<div class="l10-stack">
      <p>The current objective is \(w=4-4x_1-2x_4+4x_6-x_8\).</p>
      <div class="l10-table-wrap"><table class="l10-table" data-phase-entering-choices><thead><tr><th scope="col">Enter</th><th scope="col">Reduced cost</th><th scope="col">Maximum step</th><th scope="col">New \(w\)</th></tr></thead><tbody>
        <tr data-entering="1"><th scope="row">\(x_1\)</th><td>\(-4\)</td><td>\(1\)</td><td>\(0\)</td></tr>
        <tr data-entering="4"><th scope="row">\(x_4\)</th><td>\(-2\)</td><td>\(1\)</td><td>\(2\)</td></tr>
        <tr data-entering="8"><th scope="row">\(x_8\) (artificial)</th><td>\(-1\)</td><td>\(1\)</td><td>\(3\)</td></tr>
      </tbody></table></div>
      <p data-reveal="1">We choose \(x_1\): one pivot reaches \(w=0\). Entering \(x_4\) is also valid.</p>
      <section class="l10-box" data-tone="blue" data-reveal="2"><p><strong>Retain artificial columns (as here):</strong> \(x_8\) may reenter. Increasing it decreases other artificial variables by more, so their <em>sum</em> falls.</p></section>
      <section class="l10-box" data-tone="green" data-reveal="3"><p><strong>Optional simplification:</strong> once an artificial variable leaves the basis, fix it at zero and delete its column. It then cannot reenter, even with a negative reduced cost. Every original feasible solution already has all artificial variables zero, so none is lost.</p></section>
    </div>`,
  },
  {
    key: 'phase-ex38-pivot-x1', title: 'Pivot 4: Remove Another Artificial Variable', referencePages: [78, 79], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <p>Increase \(x_1\), whose reduced cost is \(-4\). Its column is \((2,-1/2,2,0)^\top\), in basic order \((x_5,x_2,x_7,x_3)\).</p>
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
    key: 'phase-ex38-final-dictionary', title: 'Example 3.8: Read the Final Phase I Dictionary', referencePages: [80], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack" data-phase-final-dictionary>
      <p>The preceding tableau represents these equations. Nonbasic variables are \(x_4,x_5,x_6,x_8\):</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        x_1&=1-\tfrac12x_4-\tfrac12x_5+\tfrac12x_6-\tfrac12x_8,\\
        x_2&=\tfrac12+\tfrac34x_4-\tfrac14x_5-\tfrac14x_6+\tfrac34x_8,\\
        x_7&=x_5+x_6,\\
        x_3&=\tfrac13-\tfrac13x_4-\tfrac13x_8,\\
        w&=2x_5+2x_6+x_8.
      \end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>To return to the original LP, fix <strong>all artificial variables</strong> \(x_5,x_6,x_7,x_8\) at zero. What does each equation become?</p></section>
    </div>`,
  },
  {
    key: 'phase-ex38-original-dictionary', title: 'Set the Artificial Variables to Zero', referencePages: [81, 82, 83], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack" data-phase-original-dictionary>
      <p>Substitute \(x_5=x_6=x_7=x_8=0\) into the same dictionary:</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        x_1&=1-\tfrac12x_4,\\
        x_2&=\tfrac12+\tfrac34x_4,\\
        0&=0,\\
        x_3&=\tfrac13-\tfrac13x_4.
      \end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>The \(x_7=x_5+x_6\) row becomes \(0=0\). It imposes no restriction, so remove it. <strong>No additional pivot is needed in this example.</strong></p></section>
      <p data-reveal="2">The remaining basic variables are \(x_1,x_2,x_3\). Setting nonbasic \(x_4=0\) gives the same feasible point \((1,\tfrac12,\tfrac13,0)\).</p>
    </div>`,
  },
  {
    key: 'phase-ex38-redundancy', title: 'Why Did One Equation Become 0 = 0?', referencePages: [81], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack">
      <p>Look at the original equalities after reversing the sign of the second one:</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        x_1+2x_2+3x_3&=3,\\
        -x_1+2x_2+6x_3&=2.
      \end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>Add them. The \(x_1\) terms cancel:</p><div class="l10-math">\[4x_2+9x_3=5.\]</div><p>This is an original constraint in Example 3.8. It follows from the two equalities above, so it is <strong>redundant</strong>.</p></section>
      <p data-reveal="2">Subtracting those two equalities from \(4x_2+9x_3=5\) gives \(0=0\). Removing this redundant equation loses no original feasible points.</p>
    </div>`,
  },  {
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
    key: 'phase-ex38-reprice', title: 'Restore the Original Objective by Substitution', referencePages: [83], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack" data-phase-original-objective>
      <p>The original objective is \(f=x_1+x_2+x_3\). Substitute the remaining dictionary:</p>
      <section class="l10-box" data-tone="blue"><div class="l10-math">\[\begin{aligned}
        f&=(1-\tfrac12x_4)+(\tfrac12+\tfrac34x_4)+(\tfrac13-\tfrac13x_4)\\
         &=\tfrac{11}{6}+(-\tfrac12+\tfrac34-\tfrac13)x_4\\
         &=\boxed{\tfrac{11}{6}-\tfrac1{12}x_4}.
      \end{aligned}\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p>At \(x_4=0\), the original cost is \(11/6\). The coefficient \(-1/12\) is its reduced cost: increasing \(x_4\) can improve \(f\).</p></section>
      <div data-reveal="2"><p>For the tableau, write \(-f-\tfrac1{12}x_4=-\tfrac{11}{6}\):</p><div class="l10-math">\[R_0=\left[-\tfrac{11}{6}\mid0,0,0,-\tfrac1{12}\right].\]</div></div>
    </div>`, checkpoint: checkpointPhaseTwo,
  },  {
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
    key: 'phase-zero-exchange', title: 'When a Zero Artificial Variable Needs a Pivot', referencePages: [60, 61, 62], className: 'l11-ex38-arithmetic',
    html: String.raw`<div class="l10-stack" data-phase-zero-exchange>
      <p>Consider original constraints \(x_1+x_2=1,\ -2x_2=0,\ x\ge0\). Add artificial \(a\ge0\) to the second equality: \(-2x_2+a=0\).</p>
      <section class="l10-box" data-tone="blue"><p><strong>Before:</strong> basic \((x_1,a)\); nonbasic \(x_2=0\).</p><div class="l10-math">\[x_1=1-x_2,\qquad a=2x_2,\qquad w=a=0.\]</div></section>
      <section class="l10-box" data-tone="green" data-reveal="1"><p><strong>Pivot:</strong> solve \(a=2x_2\) for \(x_2\), then substitute into the other row.</p><div class="l10-math">\[x_2=\tfrac12a,\qquad x_1=1-\tfrac12a.\]</div><p>Set nonbasic \(a=0\): <strong>same point</strong> \((x_1,x_2)=(1,0)\), now both basic. Remove \(a\).</p></section>
      <p data-reveal="2">The pivot entry is \(-2\) in \(a-2x_2=0\). This <strong>zero-step exchange</strong> changes no value.</p>
    </div>`, checkpoint: checkpointBasisExchange,
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
    key: 'phase-algorithm-cleanup', title: 'Remove Artificial Variables: Two Possible Cases', referencePages: [88],
    html: String.raw`<div class="l10-stack">
      <p>At \(w=0\), fix nonbasic artificial variables at zero. For each <strong>basic</strong> artificial variable, inspect its dictionary equation:</p>
      <section class="l10-box" data-tone="blue" data-reveal="1"><h3>An original nonbasic variable has a nonzero coefficient</h3><p>Solve for that original variable and substitute into the other rows. It replaces the artificial variable in the basis at the <strong>same point</strong>—as in \(a=2x_2\).</p></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><h3>No original variable remains in the row</h3><p>Setting the artificial variables to zero leaves \(0=0\). Remove that redundant equation—as with \(x_7=x_5+x_6\) in Example 3.8.</p></section>
      <p>Repeat until no basic artificial variable remains. Remove artificial columns, then restore the original objective. The appendix gives the matrix justification.</p>
    </div>`,
  },  {
    key: 'phase-algorithm-two', title: 'Phase II: Restore and Optimize the Original Cost', referencePages: [89],
    html: String.raw`<ol class="l10-stack">
      <li><strong>Keep the basis</strong> obtained after removing artificial variables. It is feasible for the remaining independent original equalities.</li>
      <li><strong>Keep the constraint rows</strong> after removing artificial columns; discard the Phase I objective row.</li>
      <li data-reveal="1"><strong>Restore the objective:</strong> substitute the dictionary into \(f=c^\top x\). Its constant is the current cost; the nonbasic coefficients are the reduced costs.</li>
      <li data-reveal="2"><strong>Continue simplex</strong> with an anticycling rule until an optimal basis or an improving feasible ray is obtained.</li>
    </ol>`,
  },
  {
    key: 'phase-all-outcomes', title: 'Two Phases Handle Every Standard-Form Outcome', referencePages: [90],
    html: String.raw`<div class="l10-stack">
      <div class="l10-table-wrap"><table class="l10-table"><thead><tr><th scope="col">What happens?</th><th scope="col">Where it is handled</th></tr></thead><tbody>
        <tr><th scope="row">The original LP is infeasible</th><td>Phase I optimum \(w^*>0\).</td></tr>
        <tr><th scope="row">Feasible equalities are dependent</th><td>Remove redundant equality rows after Phase I.</td></tr>
        <tr><th scope="row">Original objective is unbounded below</th><td>Phase II finds an improving feasible ray.</td></tr>
        <tr><th scope="row">A finite optimum exists</th><td>Phase II terminates at an optimal basis.</td></tr>
      </tbody></table></div>
      <p data-reveal="1">An anticycling rule supplies the termination guarantee, including degenerate cases.</p>
      <section class="l10-box" data-tone="blue" data-reveal="2"><p>We now know how to start and finish. Next, interpret these basis exchanges geometrically using the columns of the constraint matrix.</p></section>
    </div>`,
  },
];
