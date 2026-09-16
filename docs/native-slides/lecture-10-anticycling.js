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

function negateRational(value) {
  return value === "0" ? "0" : value.startsWith("-") ? value.slice(1) : `-${value}`;
}

// Read the dictionary from the same exact coefficients as the initial tableau.
// Basic columns are omitted because their variables are on the left-hand side.
const initialState = auditData.cycling.states[0];
function dictionaryExpression(constant, coefficients, basis = initialState.basis) {
  let expression = constant === "0" ? "" : rationalTex(constant);
  coefficients.forEach((coefficient, index) => {
    if (coefficient === "0" || basis.includes(index + 1)) return;
    const negative = coefficient.startsWith("-");
    const magnitude = negative ? coefficient.slice(1) : coefficient;
    expression += `${negative ? "-" : expression ? "+" : ""}${magnitude === "1" ? "" : rationalTex(magnitude)}x_${index + 1}`;
  });
  return expression || "0";
}
const initialDictionaryRows = initialState.tableau.slice(1).map((row, index) =>
  `x_${initialState.basis[index]}&=${dictionaryExpression(row[0], row.slice(1).map(negateRational))}`
).join(String.raw`\\`);
const initialDictionaryObjective = dictionaryExpression(
  negateRational(initialState.tableau[0][0]), initialState.tableau[0].slice(1)
);


// Both runs restart the same Example 3.6. Tableau coefficients stay in
// natural variable order; comparisonOrder alone sets the lex priorities.
auditData.lexCycling = {
  "comparisonOrder": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ],
  "states": [
    {
      "basis": [
        5,
        6,
        7
      ],
      "tableau": [
        [
          "3",
          "-3/4",
          "20",
          "-1/2",
          "6",
          "0",
          "0",
          "0"
        ],
        [
          "0",
          "1/4",
          "-8",
          "-1",
          "9",
          "1",
          "0",
          "0"
        ],
        [
          "0",
          "1/2",
          "-12",
          "-1/2",
          "3",
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ],
      "point": [
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "1"
      ],
      "value": "-3"
    },
    {
      "basis": [
        1,
        6,
        7
      ],
      "tableau": [
        [
          "3",
          "0",
          "-4",
          "-7/2",
          "33",
          "3",
          "0",
          "0"
        ],
        [
          "0",
          "1",
          "-32",
          "-4",
          "36",
          "4",
          "0",
          "0"
        ],
        [
          "0",
          "0",
          "4",
          "3/2",
          "-15",
          "-2",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ],
      "point": [
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "1"
      ],
      "value": "-3"
    },
    {
      "basis": [
        1,
        2,
        7
      ],
      "tableau": [
        [
          "3",
          "0",
          "0",
          "-2",
          "18",
          "1",
          "1",
          "0"
        ],
        [
          "0",
          "1",
          "0",
          "8",
          "-84",
          "-12",
          "8",
          "0"
        ],
        [
          "0",
          "0",
          "1",
          "3/8",
          "-15/4",
          "-1/2",
          "1/4",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ],
      "point": [
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "1"
      ],
      "value": "-3"
    },
    {
      "basis": [
        1,
        3,
        7
      ],
      "tableau": [
        [
          "3",
          "0",
          "16/3",
          "0",
          "-2",
          "-5/3",
          "7/3",
          "0"
        ],
        [
          "0",
          "1",
          "-64/3",
          "0",
          "-4",
          "-4/3",
          "8/3",
          "0"
        ],
        [
          "0",
          "0",
          "8/3",
          "1",
          "-10",
          "-4/3",
          "2/3",
          "0"
        ],
        [
          "1",
          "0",
          "-8/3",
          "0",
          "10",
          "4/3",
          "-2/3",
          "1"
        ]
      ],
      "point": [
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "1"
      ],
      "value": "-3"
    },
    {
      "basis": [
        1,
        3,
        4
      ],
      "tableau": [
        [
          "16/5",
          "0",
          "24/5",
          "0",
          "0",
          "-7/5",
          "11/5",
          "1/5"
        ],
        [
          "2/5",
          "1",
          "-112/5",
          "0",
          "0",
          "-4/5",
          "12/5",
          "2/5"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ],
        [
          "1/10",
          "0",
          "-4/15",
          "0",
          "1",
          "2/15",
          "-1/15",
          "1/10"
        ]
      ],
      "point": [
        "2/5",
        "0",
        "1",
        "1/10",
        "0",
        "0",
        "0"
      ],
      "value": "-16/5"
    },
    {
      "basis": [
        1,
        3,
        5
      ],
      "tableau": [
        [
          "17/4",
          "0",
          "2",
          "0",
          "21/2",
          "0",
          "3/2",
          "5/4"
        ],
        [
          "1",
          "1",
          "-24",
          "0",
          "6",
          "0",
          "2",
          "1"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ],
        [
          "3/4",
          "0",
          "-2",
          "0",
          "15/2",
          "1",
          "-1/2",
          "3/4"
        ]
      ],
      "point": [
        "1",
        "0",
        "1",
        "0",
        "3/4",
        "0",
        "0"
      ],
      "value": "-17/4"
    }
  ],
  "pivots": [
    {
      "entering": 1,
      "leaving": 5,
      "pivotRow": 0,
      "step": "0",
      "reducedCost": "-3/4",
      "normalizedRows": [
        {
          "variable": 5,
          "divisor": "1/4",
          "entries": [
            "0",
            "1",
            "-32",
            "-4",
            "36",
            "4",
            "0",
            "0"
          ]
        },
        {
          "variable": 6,
          "divisor": "1/2",
          "entries": [
            "0",
            "1",
            "-24",
            "-1",
            "6",
            "0",
            "2",
            "0"
          ]
        }
      ]
    },
    {
      "entering": 2,
      "leaving": 6,
      "pivotRow": 1,
      "step": "0",
      "reducedCost": "-4",
      "normalizedRows": [
        {
          "variable": 6,
          "divisor": "4",
          "entries": [
            "0",
            "0",
            "1",
            "3/8",
            "-15/4",
            "-1/2",
            "1/4",
            "0"
          ]
        }
      ]
    },
    {
      "entering": 3,
      "leaving": 2,
      "pivotRow": 1,
      "step": "0",
      "reducedCost": "-2",
      "normalizedRows": [
        {
          "variable": 1,
          "divisor": "8",
          "entries": [
            "0",
            "1/8",
            "0",
            "1",
            "-21/2",
            "-3/2",
            "1",
            "0"
          ]
        },
        {
          "variable": 2,
          "divisor": "3/8",
          "entries": [
            "0",
            "0",
            "8/3",
            "1",
            "-10",
            "-4/3",
            "2/3",
            "0"
          ]
        },
        {
          "variable": 7,
          "divisor": "1",
          "entries": [
            "1",
            "0",
            "0",
            "1",
            "0",
            "0",
            "0",
            "1"
          ]
        }
      ]
    },
    {
      "entering": 4,
      "leaving": 7,
      "pivotRow": 2,
      "step": "1/10",
      "reducedCost": "-2",
      "normalizedRows": [
        {
          "variable": 7,
          "divisor": "10",
          "entries": [
            "1/10",
            "0",
            "-4/15",
            "0",
            "1",
            "2/15",
            "-1/15",
            "1/10"
          ]
        }
      ]
    },
    {
      "entering": 5,
      "leaving": 4,
      "pivotRow": 2,
      "step": "3/4",
      "reducedCost": "-7/5",
      "normalizedRows": [
        {
          "variable": 4,
          "divisor": "2/15",
          "entries": [
            "3/4",
            "0",
            "-2",
            "0",
            "15/2",
            "1",
            "-1/2",
            "3/4"
          ]
        }
      ]
    }
  ],
  "finalPoint": [
    "1",
    "0",
    "1",
    "0",
    "3/4",
    "0",
    "0"
  ],
  "finalValue": "-17/4"
};
auditData.basicFirstLex = {
  "comparisonOrder": [
    0,
    5,
    6,
    7,
    1,
    2,
    3,
    4
  ],
  "states": [
    {
      "basis": [
        5,
        6,
        7
      ],
      "referencePages": [
        4,
        5
      ],
      "tableau": [
        [
          "3",
          "-3/4",
          "20",
          "-1/2",
          "6",
          "0",
          "0",
          "0"
        ],
        [
          "0",
          "1/4",
          "-8",
          "-1",
          "9",
          "1",
          "0",
          "0"
        ],
        [
          "0",
          "1/2",
          "-12",
          "-1/2",
          "3",
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ]
    },
    {
      "basis": [
        5,
        1,
        7
      ],
      "tableau": [
        [
          "3",
          "0",
          "2",
          "-5/4",
          "21/2",
          "0",
          "3/2",
          "0"
        ],
        [
          "0",
          "0",
          "-2",
          "-3/4",
          "15/2",
          "1",
          "-1/2",
          "0"
        ],
        [
          "0",
          "1",
          "-24",
          "-1",
          "6",
          "0",
          "2",
          "0"
        ],
        [
          "1",
          "0",
          "0",
          "1",
          "0",
          "0",
          "0",
          "1"
        ]
      ]
    }
  ],
  "pivots": [
    {
      "entering": 1,
      "leaving": 6,
      "pivotRow": 1,
      "step": "0",
      "reducedCost": "-3/4",
      "normalizedRows": [
        {
          "variable": 5,
          "divisor": "1/4",
          "entries": [
            "0",
            "4",
            "0",
            "0",
            "1",
            "-32",
            "-4",
            "36"
          ]
        },
        {
          "variable": 6,
          "divisor": "1/2",
          "entries": [
            "0",
            "0",
            "2",
            "0",
            "1",
            "-24",
            "-1",
            "6"
          ]
        }
      ]
    }
  ]
};

function lexDictionary(index, trace = auditData.lexCycling) {
  const {basis, tableau} = trace.states[index];
  const rows = tableau.slice(1).map((row, i) => ({row, variable: basis[i]}))
    .sort((a, b) => a.variable - b.variable)
    .map(({row, variable}) => `x_${variable}&=${dictionaryExpression(row[0], row.slice(1).map(negateRational), basis)}`);
  rows.push(`f&=${dictionaryExpression(negateRational(tableau[0][0]), tableau[0].slice(1), basis)}`);
  return String.raw`<div class="l10-math" data-l10-lex-dictionary="${index}" data-basis="${[...basis].sort((a,b)=>a-b).join(',')}">\[\begin{aligned}${rows.join(String.raw`\\`)}\end{aligned}\]</div>`;
}


function lexNormalizedRows(pivotIndex = 0, trace = auditData.lexCycling, highlightColumn = 2) {
  const pivot = trace.pivots[pivotIndex];
  return String.raw`<div class="l10-table-wrap" tabindex="0" role="region" aria-label="Normalized eligible rows in fixed comparison order">
    <table class="l10-table" data-l10-lex-cycle-rows="${pivotIndex+1}">
      <caption>\(R_{x_i}\) is the row for basic \(x_i\); divide by its \(x_${pivot.entering}\)-column entry.</caption>
      <thead><tr><th scope="col">row</th>${trace.comparisonOrder.map(j=>`<th scope="col">${j===0?'RHS':`\\(x_${j}\\)`}</th>`).join('')}</tr></thead>
      <tbody>${pivot.normalizedRows.map(({variable,divisor,entries})=>String.raw`<tr><th scope="row">\(R_{x_${variable}}/(${rationalTex(divisor)})\)</th>${entries.map((v,i)=>String.raw`<td${i===highlightColumn?' data-pivot':''}>\(${rationalTex(v)}\)</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
}

const lexCyclingSlides = [
  {
    key: "lex-cycle-start", title: "Example 3.6 Again: Keep the Usual Column Order", referencePages: [4,23,37],
    html: String.raw`
      <p>Restart the same <strong>minimization</strong> problem at \(\mathcal B=(x_5,x_6,x_7)\). Keep the most-negative reduced-cost entering rule.</p>
      ${lexDictionary(0)}
      <section class="l10-box" data-tone="blue" data-reveal="1" data-l10-lex-fixed-order>
        <p>Compare tableau rows from left to right, always in this order:</p>
        <div class="l10-math">\[\mathrm{RHS}\;\big|\;x_1,x_2,x_3,x_4,x_5,x_6,x_7.\]</div>

      </section>`,
  },
  {
    key: "lex-cycle-first-choice", title: "Lex Pivot 1: The First Tie Still Chooses x₅", referencePages: [4,5,23],
    html: String.raw`
      <p>\(x_1\) enters: \(-\frac34<-\frac12\). Rows \(x_5,x_6\) tie at ratio zero; the \(x_7\) row is ineligible.</p>
      ${lexNormalizedRows(0)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p>The RHS and \(x_1\) entries tie. The first difference is in column \(x_2\):</p>
        <div class="l10-math">\[-32<-24\quad\Longrightarrow\quad
          \frac{R_{x_5}}{1/4}<_L\frac{R_{x_6}}{1/2}.\]</div>
      </section>
      <p data-reveal="2"><strong>\(x_5\) leaves at \(\theta=0\).</strong> This first pivot agrees with the earlier cycling run.</p>`,
  },
  {
    key: "lex-cycle-first-result", title: "After Pivot 1: Choose the Second Pivot", referencePages: [6,7,23],
    html: String.raw`
      <p>Solve the old \(x_5\) equation for \(x_1\) and substitute. The basis becomes \((x_1,x_6,x_7)\):</p>
      ${lexDictionary(1)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p><strong>\(x_2\) enters:</strong> \(-4<-\frac72\). With the other nonbasic variables zero, \(x_6=-4x_2\ge0\) forces \(x_2=0\).</p>
      </section>
      <p data-reveal="2"><strong>Pivot 2: \(x_6\) leaves, \(\theta=0\).</strong> No ratio tie occurs. The first two pivots still match the cycling run.</p>`,
  },
  {
    key: "lex-cycle-second-result", title: "After Pivot 2: A New Tie to Resolve", referencePages: [8,9,23],
    html: String.raw`
      <p>Solve the old \(x_6\) equation for \(x_2\), then substitute. Now \(\mathcal B=(x_1,x_2,x_7)\):</p>
      ${lexDictionary(2)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p><strong>\(x_3\) enters:</strong> \(\bar c_3=-2\) is the only negative reduced cost.</p>
        <div class="l10-math">\[\theta^*=\min\left\{\frac08,\frac0{3/8},\frac11\right\}=0.\]</div>
      </section>
      <p data-reveal="2">\(x_1\) and \(x_2\) tie at zero. Which complete normalized row is smaller?</p>`,
  },
  {
    key: "lex-cycle-third-choice", title: "Lex Pivot 3: This Choice Breaks the Cycle", referencePages: [8,9,23],
    html: String.raw`
      <p>Compare the eligible rows in the same order: RHS, then \(x_1,\ldots,x_7\).</p>
      ${lexNormalizedRows(2,auditData.lexCycling,1)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p>The \(x_7\) row has ratio 1. Among the zero-ratio rows, column \(x_1\) decides:</p>
        <div class="l10-math">\[0<\frac18\quad\Longrightarrow\quad
          \frac{R_{x_2}}{3/8}<_L\frac{R_{x_1}}8.\]</div>
      </section>
      <p data-reveal="2"><strong>\(x_2\) leaves at \(\theta=0\).</strong> The cycling run instead made \(x_1\) leave. We now reach a different basis.</p>`,
  },
  {
    key: "lex-cycle-third-result", title: "After Pivot 3: The Fourth Pivot Can Move", referencePages: [23],
    html: String.raw`
      <p>Pivot on the old \(x_2\) row to make \(x_3\) basic. The new dictionary is</p>
      ${lexDictionary(3)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p><strong>\(x_4\) enters:</strong> \(-2<-\frac53\). Set \(x_4=\theta\), with \(x_2=x_5=x_6=0\):</p>
        <div class="l10-math">\[x_1=4\theta,\quad x_3=10\theta,\quad x_7=1-10\theta.\]</div>
      </section>
      <p data-reveal="2"><strong>Pivot 4: \(x_7\) leaves at \(\theta=\frac1{10}\).</strong> Only \(x_7\) decreases; the objective drops to \(-\frac{16}{5}\).</p>`,
  },
  {
    key: "lex-cycle-fourth-result", title: "After Pivot 4: One More Improving Pivot", referencePages: [23],
    html: String.raw`
      <p>Solve the old \(x_7\) equation for \(x_4\) and substitute. Now \(\mathcal B=(x_1,x_3,x_4)\):</p>
      ${lexDictionary(4)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p><strong>\(x_5\) enters:</strong> \(-\frac75\) is the only negative reduced cost. Only \(x_4\) decreases:</p>
        <div class="l10-math">\[x_4=\frac1{10}-\frac2{15}\theta\ge0
          \quad\Longrightarrow\quad\theta\le\frac34.\]</div>
      </section>
      <p data-reveal="2"><strong>Pivot 5: \(x_4\) leaves at \(\theta=\frac34\).</strong> Solve for \(x_5\) and substitute once more.</p>`,
  },
  {
    key: "lex-cycle-optimal", title: "Example 3.6: Optimal After Five Lex Pivots", referencePages: [23,35],
    html: String.raw`
      <p>The final basis is \((x_1,x_3,x_5)\); the nonbasic variables are \((x_2,x_4,x_6,x_7)\).</p>
      ${lexDictionary(5)}
      <section class="l10-box" data-tone="green" data-reveal="1">
        <p>All nonbasic reduced costs are positive. Set the nonbasic variables to zero:</p>
        <div class="l10-math">\[x^*=(1,0,1,0,\tfrac34,0,0),\qquad f^*=-\tfrac{17}{4}.\]</div>
      </section>
      <p data-reveal="2">Three zero-length pivots, then two positive steps. The changed leaving choice at pivot 3 prevents the earlier six-pivot cycle.</p>`,
  },
];

const basicFirstSlides = [
  {
    key:"lex-basic-first-choice", title:"Basic Columns First: A Convenient Setup", referencePages:[4,23,37],
    html:String.raw`
      <p>Restart Example 3.6 at \((x_5,x_6,x_7)\). Apply the setup just described and fix the comparison order:</p>
      <div class="l10-math">\[\mathrm{RHS}\mid x_5,x_6,x_7\mid x_1,x_2,x_3,x_4.\]</div>
      ${lexNormalizedRows(0,auditData.basicFirstLex,1)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p>\(x_1\) still enters. The RHS entries tie; the very next entry gives \(0<4\). <strong>\(x_6\) leaves at step zero.</strong></p>
      </section>
      <p data-reveal="2">The identity block guarantees a lex-positive start. Here it also resolves the tie one entry earlier than the usual column order.</p>`,
  },
  {
    key:"lex-basic-first-result", title:"One Pivot with Basic Columns First", referencePages:[4,23,37],
    html:String.raw`
      <p>Solve the initial \(x_6\) equation for \(x_1\), then substitute into the other equations and the objective:</p>
      ${lexDictionary(1,auditData.basicFirstLex)}
      <section class="l10-box" data-tone="blue" data-reveal="1">
        <p>New basis: \((x_1,x_5,x_7)\). The point is unchanged and \(f=-3\). Keep the comparison order fixed if continuing this run.</p>
      </section>
      <p data-reveal="2">Different fixed orders can give different pivot paths. This setup guarantees the starting row condition; it does not guarantee fewer pivots.</p>`,
  },
];

function lexObjectiveRow(index) {
  return String.raw`<div class="l10-table-wrap" tabindex="0" role="region" aria-label="Complete objective row ${index===2?'before':'after'} pivot 3; fixed order minus objective, then x1 through x7">
    <table class="l10-table" data-l10-lex-objective-state="${index}">
      <thead><tr><th scope="col">\(R_0\)</th><th scope="col">\(-f_B\)</th>${Array.from({length:7},(_,j)=>`<th scope="col">\\(x_${j+1}\\)</th>`).join('')}</tr></thead>
      <tbody><tr><th scope="row">${index===2?'Before':'After'}</th>${auditData.lexCycling.states[index].tableau[0].map((v,j)=>String.raw`<td${j===2?' data-pivot':''}>\(${rationalTex(v)}\)</td>`).join('')}</tr></tbody>
    </table></div>`;
}

const lexIntuitionSlides = [
  {
    key:"lex-intuition-before", title:"Intuition: Before Pivot 3", referencePages:[8,9,30,31,32,33,34],
    className:"l10-lex-intuition-dictionary-slide",
    html:String.raw`
      <p>Example 3.6 after two pivots: \(\mathcal B=(x_1,x_2,x_7)\).</p>
      ${lexDictionary(2)}
      ${lexObjectiveRow(2)}
      <section class="l10-box" data-tone="blue">
        <p><strong>Pivot 3:</strong> \(x_3\) enters, \(x_2\) leaves, and \(\theta=0\). Solve the \(x_2\) equation for \(x_3\), then substitute into every other equation and the objective.</p>
      </section>`,
  },
  {
    key:"lex-intuition-progress", title:"Intuition: After Pivot 3", referencePages:[23,30,31,32,33,34],
    className:"l10-lex-intuition-dictionary-slide",
    html:String.raw`
      <p>After substitution: \(\mathcal B=(x_1,x_3,x_7)\).</p>
      ${lexDictionary(3)}
      ${lexObjectiveRow(3)}
      <section class="l10-box" data-tone="green">
        <p>Same point, same \(f=-3\). The first change in \(R_0\) is \(0\to\frac{16}{3}\) in the \(x_2\) column: strict lexicographic progress, even with a zero step.</p>
      </section>`,
  },
  {
    key:"lex-intuition-finite", title:"Intuition: Strict Progress Prevents Repeated Bases", referencePages:[35],
    html:String.raw`
      <p>With a lex-positive start, the rule preserves lex-positive constraint rows and makes \(R_0\) strictly increase at every pivot.</p>
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>A basis determines its objective row</h3><p>For the same LP and fixed column order, returning to a basis would reproduce exactly the same \(R_0\).</p></section>
        <section class="l10-box" data-tone="blue" data-reveal="1"><h3>The row strictly increases at every pivot</h3><p>A strictly increasing lexicographic sequence cannot return to an earlier row. Therefore no basis can repeat.</p></section>
        <section class="l10-box" data-tone="green" data-reveal="2"><h3>There are only finitely many bases</h3><p>Simplex must stop: either all reduced costs are nonnegative, or an improving column has no eligible leaving row. These certify optimality or unboundedness, respectively.</p></section>
      </div>
      <p data-reveal="2">The complete algebraic proof is available in the appendix, and textbook Theorem 3.4.</p>`,
  },
];

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
      </section>
      <p data-reveal="1">First write a dictionary, just as in Simplex I.</p>`,
  },
  {
    key: "cycle-dictionary", title: "Example 3.6: Start with a Dictionary", referencePages: [4],
    html: String.raw`
      <p>Basic variables: \((x_5,x_6,x_7)\). Nonbasic variables: \((x_1,x_2,x_3,x_4)\).</p>
      <div class="l10-math" data-l10-initial-dictionary>\[\begin{aligned}${initialDictionaryRows}\end{aligned}\]</div>
      <section data-reveal="1" data-l10-dictionary-objective>
        <p>Substitute \(x_7=1-x_3\) into the minimization objective:</p>
        <div class="l10-math">\[\begin{aligned}
          f&=-\tfrac34x_1+20x_2-\tfrac72x_3+6x_4-3(1-x_3)\\
           &=${initialDictionaryObjective}.
        \end{aligned}\]</div>
      </section>
      <section class="l10-box" data-tone="blue" data-reveal="2">
        <p>Set the nonbasic variables to zero: \((x_5,x_6,x_7)=(0,0,1)\) and \(f=-3\).</p>
        <p>The objective coefficients are the reduced costs for this basis.</p>
      </section>`,
  },
  {
    key: "cycle-tableau-format", title: "From Dictionary Equations to a Tableau", referencePages: [4, 5],
    className: "l10-tableau-slide l10-tableau-introduction",
    html: String.raw`
      <p>A <strong>tableau</strong> records each equation’s right-hand side and left-hand coefficients.</p>
      <section data-l10-tableau-constraint>
        <p><strong>Constraint rows:</strong> move the nonbasic terms to the left. For example,</p>
        <div class="l10-math">\[\tfrac14x_1-8x_2-x_3+9x_4+x_5=0.\]</div>
      </section>
      <section data-reveal="1" data-l10-tableau-objective>
        <p><strong>Objective row \(R_0\):</strong> move \(f\) left and the constant right:</p>
        <div class="l10-math">\[-f-\tfrac34x_1+20x_2-\tfrac12x_3+6x_4=3.\]</div>
      </section>
      <section data-reveal="2" data-l10-tableau-format>
        ${cycleTableau(0, { hideCaption: true, label: "The initial dictionary written as a tableau" })}
        <p>\(R_0\) omits \(-f\). Column 0 is \(-f_B=3\); the other entries are unchanged reduced costs.</p>
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
    key: "lex-rule", title: "The Lexicographic Pivoting Rule", referencePages: [23],
    html: String.raw`
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>1 · Choose an improving column</h3>
          <p>Choose any nonbasic \(x_j\) with \(\bar c_j<0\). Its entries are \(t_{ij}=(B^{-1}A_j)_i\).</p></section>
        <section class="l10-box" data-tone="blue" data-reveal="1"><h3>2 · Compare normalized eligible rows</h3>
          <p>Let \(R_i\) be the full tableau row: RHS, then coefficients in a fixed column order. For each \(t_{ij}>0\), divide \(R_i\) by \(t_{ij}\) and choose the lexicographically smallest result:</p>
          <div class="l10-math">\[\frac{R_\ell}{t_{\ell j}}<_L\frac{R_i}{t_{ij}}\qquad(i\ne\ell,\ t_{ij}>0).\]</div></section>
        <p data-reveal="2">Then \(x_{B(\ell)}\) leaves. Column 0 first minimizes the ordinary ratio; later columns resolve a tie. If no row is eligible, the improving direction is unbounded.</p>
      </div>`,
  },
  ...lexCyclingSlides,
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
    key: "lex-termination-bridge", title: "What Guarantees Termination More Generally?", referencePages: [22,29],
    html: String.raw`
      <p>Example 3.6 reached an optimal dictionary after five pivots. We verified this run directly.</p>
      <section class="l10-box" data-tone="blue"><h3>Computing the pivots</h3>
        <p>Normalize eligible rows and compare them lexicographically. No extra positivity test is used to choose the leaving row.</p></section>
      <section class="l10-box" data-tone="green"><h3>Guaranteeing termination</h3>
        <p>Theorem 3.4 uses a property called <strong>lex positivity</strong>. Our example’s initial tableau already has it.</p></section>
      <p>We now define this property and explain its role in the no-cycling guarantee.</p>`,
  },
  {
    key: "lex-positive", title: "Lex Positivity: A Condition for the Termination Theorem", referencePages: [22],
    html: String.raw`
      <section class="l10-box" data-tone="blue"><p>A vector is <strong>lexicographically positive</strong> if its first nonzero entry is positive: \(r>_L0\).</p></section>
      <section data-reveal="1" data-l10-initial-lex-positive>
        <p>Example 3.6 already starts this way. In the order RHS, \(x_1,\ldots,x_7\), its constraint rows begin</p>
        <div class="l10-math">\[\begin{aligned}
          R_{x_5}&=(0,\boxed{\tfrac14},-8,\ldots),\\
          R_{x_6}&=(0,\boxed{\tfrac12},-12,\ldots),\\
          R_{x_7}&=(\boxed1,0,0,\ldots).
        \end{aligned}\]</div>
      </section>
      <section class="l10-box" data-tone="green" data-reveal="2">
        <p>All three rows are lex positive. Later entries may be negative; only the first nonzero entry decides. The zero vector is not lex positive.</p>
      </section>`,
  },
  {
    key:"lex-theorem", title:"Theorem 3.4: Finite Termination of Lexicographic Simplex", referencePages:[29],
    html:String.raw`
      <p>Consider \(\min\{c^\top x:Ax=b,\ x\ge0\}\), with \(\operatorname{rank}(A)=m\).</p>
      <p>Start from a feasible basis whose constraint rows are lexicographically positive. Keep the column order fixed and use the lexicographic pivoting rule.</p>
      <section class="l10-box" data-tone="blue" data-l10-theorem-statement>
        <p><strong>Then all of the following hold:</strong></p>
        <p><strong>(a)</strong> Every constraint row remains lexicographically positive at every iteration.</p>
        <p><strong>(b)</strong> The complete objective row \(R_0=[-f_B\mid\bar c^\top]\) strictly increases lexicographically at every pivot.</p>
        <p><strong>(c)</strong> The algorithm terminates after finitely many pivots, producing an optimal basis or certifying that the objective is unbounded below.</p>
      </section>`,
  },
  ...lexIntuitionSlides,
  {
    key: "lex-initialization", title: "Make the Initial Constraint Rows Lex Positive", referencePages: [37],
    html: String.raw`
      <p>The usual column order already worked for Example 3.6. For a general feasible basis \(B_0\), an easy setup is to put its initial basic columns first and then keep that order fixed.</p>
      <div class="l10-math">\[\left[\begin{array}{c|c|c}
        B_0^{-1}b&I&B_0^{-1}A_{\mathcal N_0}
      \end{array}\right].\]</div>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Why ordering initial basic columns first ensures lex positivity">
        <section><p>If \(\bar b_i>0\), the first entry already makes row \(i\) positive.</p></section>
        <section data-reveal="1"><p>If \(\bar b_i=0\), its first nonzero entry in the identity block is \(+1\). Entries in the later nonbasic block cannot change that comparison.</p></section>
        <section data-reveal="2"><p><strong>Every row starts lexicographically positive.</strong> Theorem 3.4 then preserves this property through all subsequent pivots.</p></section>
      </div>`,
  },
  ...basicFirstSlides,
  {
    key: "lex-to-bland", title: "From Row Comparisons to Variable Indices", referencePages: [38, 39],
    html: String.raw`
      <p>Lexicographic comparison prevents cycling. Can we also prevent cycling using the <strong>variable indices</strong>?</p>
      <div class="l10-stack">
        <section class="l10-box" data-tone="blue"><h3>Lex: look farther along the rows</h3><p>When the ordinary minimum ratios tie, compare subsequent entries of the normalized rows in the fixed column order.</p></section>
        <section class="l10-box" data-tone="green" data-reveal="1"><h3>Bland: use the basic-variable indices</h3><p>Among minimum-ratio ties, let the basic variable with the smallest index leave. If \(x_8\) and \(x_3\) tie, choose \(x_3\), regardless of row position.</p></section>
        <section class="l10-box" data-tone="orange" data-reveal="2"><p><strong>The leaving choice alone is not enough.</strong> Bland also prescribes the entering choice. We need both parts of the rule for its termination guarantee.</p></section>
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
      <section class="l10-box" data-tone="orange" data-reveal="1"><p><strong>Both choices matter.</strong> Our cycling example already used the smallest-index leaving variable, but its most-negative entering rule still cycled.</p></section>`,
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
          <p>Finite termination answers whether we stop. Does it also tell us how quickly?</p></section>
      </div>`,
  },
];

// Preserve the separate row-comparison exercise as optional appendix practice.
export const lexComparisonSlides = [
  {
    key: "appendix-lex-example-ratios", title: "Example 3.7: The Ordinary Ratios Tie", referencePages: [24],
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
    key: "appendix-lex-example-comparison", title: "Example 3.7: Compare the Complete Normalized Rows", referencePages: [25, 26, 27],
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
];

export const lexProofSlides = [
  {
    key: "appendix-lex-properties", title: "Four Lexicographic Facts Used in the Proof", referencePages: [30],
    html: String.raw`
      <div class="l10-proof" tabindex="0" role="region" aria-label="Four elementary lexicographic order properties">
        <section><div class="l10-math">\[r>_Ls\quad\Longleftrightarrow\quad r-s>_L0.\]</div><p>Subtracting common entries leaves the same first difference.</p></section>
        <section data-reveal="1"><div class="l10-math">\[r>_L0,\ \alpha>0\quad\Longrightarrow\quad\alpha r>_L0.\]</div><p>Positive scaling preserves the first nonzero sign.</p></section>
        <section data-reveal="2"><div class="l10-math">\[r>_L0,\ s>_L0\quad\Longrightarrow\quad r+s>_L0.\]</div><p>At the first possible nonzero entry, positive entries cannot cancel.</p></section>
        <section data-reveal="3"><div class="l10-math">\[r>_L0\quad\Longrightarrow\quad r+s>_Ls.\]</div><p>Apply the first fact to \((r+s)-s=r\).</p></section>
      </div>`,
  },
  {
    key: "appendix-lex-proof-pivot", title: "Proof (a): The Pivot Row Stays Positive", referencePages: [31, 32],
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
    key: "appendix-lex-proof-other-rows", title: "Proof (a): Every Other Row Stays Positive", referencePages: [32, 33],
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
    key: "appendix-lex-proof-objective", title: "Proof (b): The Zeroth Row Strictly Increases", referencePages: [34],
    html: String.raw`
      <p>The entering reduced cost is negative, \(\bar c_j<0\), and part (a) gives \(R_\ell'>_L0\).</p>
      <div class="l10-proof" tabindex="0" role="region" aria-label="Proof of strict lexicographic increase of row zero">
        <section><div class="l10-math">\[R_0'=R_0-\bar c_jR_\ell'.\]</div><p>This row operation makes the entering reduced cost zero.</p></section>
        <section data-reveal="1"><div class="l10-math">\[R_0'-R_0=(-\bar c_j)R_\ell'>_L0\quad\Longrightarrow\quad R_0'>_LR_0.\]</div></section>
        <section data-reveal="2"><p><strong>Even when \(\theta^*=0\), the whole zeroth row strictly increases.</strong> Its first entry \(-f_B\) may stay fixed; a later entry then supplies the first strict difference.</p></section>
      </div>`,
  },
  {
    key: "appendix-lex-proof-termination", title: "Proof (c): A Basis Cannot Recur", referencePages: [35],
    html: String.raw`
      <div class="l10-proof" tabindex="0" role="region" aria-label="Finite-termination proof for lexicographic pivoting">
        <section><p>For fixed data and column order, the basis determines the complete zeroth row:</p>
          <div class="l10-math">\[R_0=\left[-c_{\mathcal B}^\top B^{-1}b\ \middle|\ c^\top-c_{\mathcal B}^\top B^{-1}A\right].\]</div></section>
        <section data-reveal="1"><p>Part (b) gives strict lexicographic increase at each pivot. Returning to an old basis would return to its old zeroth row, which is impossible.</p></section>
        <section data-reveal="2"><p>There are finitely many choices of basic columns. Therefore the algorithm terminates after finitely many pivots, with an optimal basis or an improving unbounded ray.</p></section>
      </div>`,
  },
];
