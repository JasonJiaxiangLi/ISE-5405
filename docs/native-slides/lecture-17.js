/** Duality I: bounds, construction, and weak duality. */
const raw = String.raw;
const p = text => `<p>${text}</p>`;
const math = tex => `<div class="dy-math">\\[${tex}\\]</div>`;
const box = (body, tone = 'blue', reveal = '') => `<section class="dy-box" data-tone="${tone}"${reveal ? ` data-reveal="${reveal}"` : ''}>${body}</section>`;
const table = (heads, rows, scrollLabel = '') => `<div class="dy-table-wrap"${scrollLabel ? ` tabindex="0" role="region" aria-label="${scrollLabel}"` : ''}><table class="dy-table"><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => `<${i ? 'td' : 'th scope="row"'}>${cell}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const slide = (key, title, html, referencePages, options = {}) => ({ key, id: `l17-${key}`, title, html, referencePages, className: 'dy-slide', ...options });
const checkpoint = (prompt, choices, correctIndex, explanation) => ({ prompt, choices, correctIndex, explanation, autoOpen: true });
const formNotes = {
  warmup: raw`<strong>Primal minimization:</strong> \(\ge\) constraints; variables unrestricted.`,
  nutrition: raw`<strong>Primal minimization:</strong> \(\ge\) constraints; servings nonnegative.`,
  equality: raw`<strong>Primal minimization:</strong> equality constraints; variables nonnegative.`,
};
const formReminder = kind => `<p class="dy-form-reminder" data-form-case="${kind}">${formNotes[kind]}</p>`;
function mountFormComparison({ slideElement }) {
  const region = slideElement.querySelector('.dy-table-wrap[tabindex]');
  if (!region) return undefined;
  const onKeydown = event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || region.scrollWidth <= region.clientWidth) return;
    event.preventDefault();
    event.stopPropagation();
    region.scrollBy({ left: event.key === 'ArrowRight' ? 100 : -100, behavior: 'auto' });
  };
  region.addEventListener('keydown', onKeydown);
  return () => region.removeEventListener('keydown', onKeydown);
}
const primal46 = () => math(raw`\begin{aligned}\min\quad &13x_1+10x_2+6x_3\\\text{s.t.}\quad &5x_1+x_2+3x_3=8,\\&3x_1+x_2=3,\qquad x_1,x_2,x_3\ge0.\end{aligned}`);
const dual46 = () => math(raw`\begin{aligned}\max\quad &8p_1+3p_2\\\text{s.t.}\quad &5p_1+3p_2\le13,\\&p_1+p_2\le10,\qquad3p_1\le6,\\&p_1,p_2\text{ unrestricted}.\end{aligned}`);
const warmup = () => math(raw`\begin{aligned}\min\quad &x_1+3x_2\\\text{s.t.}\quad &x_1+x_2\ge2,\quad x_2\ge1,\quad x_1-x_2\ge3.\end{aligned}`) + p(raw`Here \(x_1,x_2\) are unrestricted variables: no additional sign restrictions are imposed.`);
const mixedPrimal = () => math(raw`\begin{aligned}\min\quad &x_1+2x_2+3x_3\\\text{s.t.}\quad &-x_1+3x_2=5,\\&2x_1-x_2+3x_3\ge6,\quad x_3\le4,\\&x_1\ge0,\quad x_2\le0,\quad x_3\text{ unrestricted}.\end{aligned}`);

export const nutritionModel = { A: [[2, 1, 1], [1, 2, 1]], b: [4, 5], c: [4, 5, 4], primal: [1, 2, 0], dual: [1, 2], value: 14 };
function boundGraphic(bound = 4, feasible = true) {
  const location = value => 65 + 46 * value;
  return `<figure class="dy-figure"><svg viewBox="0 0 520 170" role="img" aria-label="Objective-value line. The feasible point (4,1) has cost 7. Current weighted value ${bound}; ${feasible ? 'the weights certify a lower bound' : 'the weights do not certify a bound'}." data-weight-graphic>
    <line x1="60" y1="76" x2="485" y2="76" stroke="#748791" stroke-width="3"/>
    <line x1="${location(7)}" y1="52" x2="${location(7)}" y2="100" stroke="#177441" stroke-width="4"/>
    <text x="${location(7)}" y="36" text-anchor="middle" fill="#177441">Feasible cost: 7</text>
    <circle cx="${location(bound)}" cy="76" r="8" fill="${feasible ? '#861f41' : '#b95013'}" data-bound-dot/>
    <text x="${location(bound)}" y="133" text-anchor="middle" fill="#263943" data-bound-label>${feasible ? 'Lower bound' : 'Uncertified value'}: ${bound}</text>
  </svg></figure>`;
}
function weightsWidget() {
  return `<div class="dy-weights" data-weight-widget>
    ${table([raw`\(p_1=t\)`, raw`\(p_2=4-2t\)`, raw`\(p_3=1-t\)`, 'Weighted RHS'], [[`<span data-weight-value="0">1</span>`, `<span data-weight-value="1">2</span>`, `<span data-weight-value="2">0</span>`, '<span data-weight-bound>4</span>']])}
    ${boundGraphic()}
    <div class="dy-controls" data-screen-only><label for="l17-weight-t">Weight parameter t <input id="l17-weight-t" data-weight-input type="range" min="-0.5" max="1.5" step="0.25" value="1" aria-label="Adjust constraint-weight parameter t"/></label><button type="button" data-weight-reset>Reset weights</button></div>
    <p class="dy-weight-status" data-weight-status role="status">All weights are nonnegative. Every feasible objective value is at least 4.</p>
  </div>`;
}
function mountWeights({ slideElement }) {
  const root = slideElement.querySelector('[data-weight-widget]');
  if (!root) return undefined;
  const input = root.querySelector('[data-weight-input]');
  const reset = root.querySelector('[data-weight-reset]');
  const number = x => Number(x.toFixed(3)).toString();
  const update = () => {
    const t = Number(input.value), weights = [t, 4 - 2 * t, 1 - t], bound = 7 - 3 * t;
    const valid = weights.every(x => x >= 0);
    root.dataset.weights = JSON.stringify(weights); root.dataset.bound = String(bound); root.dataset.valid = String(valid);
    root.querySelectorAll('[data-weight-value]').forEach(el => { el.textContent = number(weights[Number(el.dataset.weightValue)]); });
    root.querySelector('[data-weight-bound]').textContent = number(bound);
    const dot = root.querySelector('[data-bound-dot]'), label = root.querySelector('[data-bound-label]');
    dot.setAttribute('cx', String(65 + 46 * bound)); dot.setAttribute('fill', valid ? '#861f41' : '#b95013');
    label.setAttribute('x', String(65 + 46 * bound)); label.setAttribute('text-anchor', bound > 7 ? 'end' : 'middle');
    label.textContent = `${valid ? 'Lower bound' : 'Uncertified value'}: ${number(bound)}`;
    const status = valid ? `All weights are nonnegative. Every feasible objective value is at least ${number(bound)}.` : 'A weight is negative. These weights do not certify a lower bound by adding the inequalities.';
    root.querySelector('[data-weight-status]').textContent = status;
    input.setAttribute('aria-valuetext', `t equals ${number(t)}. Weights ${weights.map(number).join(', ')}. ${status}`);
    root.querySelector('[data-weight-graphic]').setAttribute('aria-label', `Objective-value line. The feasible point (4,1) has cost 7. Weighted value ${number(bound)}. ${status}`);
  };
  const resetValues = () => { input.value = '1'; update(); };
  input.addEventListener('input', update); reset.addEventListener('click', resetValues); update();
  return () => { input.removeEventListener('input', update); reset.removeEventListener('click', resetValues); };
}

function weakDualityFigure() {
  // Equal axis scales; the unbounded feasible set is clipped to [-1,8] x [-1,4].
  const xy = ([x, y]) => [50 + 50 * (x + 1), 310 - 50 * (y + 1)];
  const line = (a, b, color, width = 2.5, dash = '') => {
    const u = xy(a), v = xy(b);
    return `<line x1="${u[0]}" y1="${u[1]}" x2="${v[0]}" y2="${v[1]}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  const label = (a, text, dx = 0, dy = 0, anchor = 'middle', color = '#263943') => {
    const q = xy(a);
    return `<text x="${q[0] + dx}" y="${q[1] + dy}" text-anchor="${anchor}" fill="${color}">${text}</text>`;
  };
  const polygon = [[4, 1], [8, 1], [8, 4], [7, 4]].map(q => xy(q).join(',')).join(' ');
  let drawing = `<polygon points="${polygon}" fill="#b9dcea" fill-opacity=".72" data-weak-feasible-polygon="4,1;8,1;8,4;7,4"/>`;
  drawing += line([-1, 0], [8, 0], '#87969d', 1.5) + line([0, -1], [0, 4], '#87969d', 1.5);
  [-1, 0, 2, 4, 6, 8].forEach(x => { drawing += line([x, -.06], [x, .06], '#87969d', 1.5) + label([x, 0], String(x), 0, 25); });
  [-1, 1, 2, 3, 4].forEach(y => { drawing += line([-.06, y], [.06, y], '#87969d', 1.5) + label([0, y], String(y), -15, 6, 'end'); });
  drawing += line([-1, 3], [3, -1], '#80939d', 2, '5 5');
  drawing += line([-1, 1], [8, 1], '#326b8c', 3) + line([2, -1], [7, 4], '#326b8c', 3);
  drawing += `<g data-weak-objective="4" data-reveal="1">${line([-1, 5 / 3], [7, -1], '#b95013', 3, '8 6')}${label([1, 1], 'cost 4', 18, 37, 'start', '#a04510')}</g>`;
  drawing += `<g data-weak-objective="7" data-reveal="2">${line([-1, 8 / 3], [8, -1 / 3], '#861f41', 3)}${label([0, 7 / 3], 'cost 7', 15, -11, 'start', '#861f41')}</g>`;
  drawing += label([6.4, 2.4], 'feasible', 0, 0) + label([6.4, 2.4], 'region', 0, 25);
  const opt = xy([4, 1]);
  drawing += `<g data-reveal="2"><circle cx="${opt[0]}" cy="${opt[1]}" r="7" fill="#177441" stroke="white" stroke-width="2.5" data-world="4,1" data-weak-optimum/>${label([4, 1], '(4, 1)', 13, 30, 'start', '#177441')}</g>`;
  drawing += line([7.15, 1.7], [7.85, 1.7], '#326b8c', 3);
  const tip = xy([7.85, 1.7]); drawing += `<path d="M ${tip[0] - 9} ${tip[1] - 6} L ${tip[0]} ${tip[1]} L ${tip[0] - 9} ${tip[1] + 6}" fill="none" stroke="#326b8c" stroke-width="3"/>`;
  return `<figure class="dy-figure dy-weak-figure"><svg viewBox="0 0 570 390" role="img" aria-label="The warmup feasible region lies above the cost 4 line and touches the cost 7 line at (4,1). Axes include negative values; variables are unrestricted. The blue feasible region continues beyond the right and upper edges of the plotting window." data-weak-geometry>
    <g font-size="21" font-family="system-ui,sans-serif">${drawing}<text x="430" y="359" text-anchor="middle">Decision 1</text><text x="100" y="27" text-anchor="middle">Decision 2</text></g>
  </svg><figcaption>${raw`Horizontal: \(x_1\); vertical: \(x_2\). Blue boundaries: \(x_2=1\) and \(x_1-x_2=3\). Gray: \(x_1+x_2=2\).`} The shaded set continues outside the window.</figcaption></figure>`;
}

export const metadata = {
  id: 'lecture-17', number: 17, title: 'Duality I: Bounds and the Dual Problem',
  subtitle: 'Lecture 9 · Constructing and Checking Objective Bounds',
  course: 'ISE 5405 · Optimization I', homeUrl: '../../',
  pdfUrl: '../../materials/lecture_17.pdf', whiteboards: 3,
};

const main = [
  slide('01', metadata.title,
    p('A feasible solution tells us what we can achieve. A dual solution tells us what no feasible solution can beat.') +
    box(p('<strong>Our route:</strong> combine constraints → choose the best weights → write the dual → prove weak duality.')) +
    p('Minimization and its lower bounds · Bertsimas and Tsitsiklis §§4.1–4.3.') +
    '<nav class="dy-contents" aria-label="Duality I sections"><a href="#slide=3">Start with arithmetic</a><a href="#slide=7">Nutrition: prove the minimum cost</a><a href="#slide=14">Compare the forms and explain the signs</a><a href="#slide=21">Weak duality</a><a href="#slide=30">Optional derivations</a></nav>', [3, 20, 46], { kind: 'title' }),

  slide('two-sides', 'A good solution and a good bound answer different questions',
    p(raw`For a minimization problem, a feasible point \(x\) gives an <strong>upper bound</strong> on the optimal value \(v^*\).`) +
    math(raw`v^*\le c^\top x.`) +
    box(p(raw`A <strong>lower bound</strong> \(L\) proves that every feasible solution costs at least \(L\).`), 'blue') +
    math(raw`L\le v^*\le c^\top x.`) +
    box(p(raw`For example, if the objective is \(x_1+3x_2\) and a constraint says \(x_1+3x_2\ge2\), the lower bound \(L=2\) is immediate.`), 'green') +
    p('When no constraint directly matches the objective, combine several constraints.'), [4, 5, 47, 51]),

  slide('add-constraints', 'Start by adding inequalities',
    formReminder('warmup') +
    math(raw`\min\ x_1+3x_2\quad\text{s.t.}\quad x_1+x_2\ge2,\quad x_2\ge1.`) +
    p('Unrestricted means no separate variable-sign restrictions; the listed constraints still apply.') +
    p(raw`Multiply the second inequality by \(2\), then add:`) +
    box(math(raw`(x_1+x_2)+2x_2\ge2+2\cdot1.`), 'blue') +
    box(math(raw`x_1+3x_2\ge4.`) + p('Every feasible solution costs at least 4. We obtained a bound without running simplex.'), 'green') +
    p(raw`The point \((1,1)\) is feasible and has cost 4, so it attains this bound.`), [4, 5, 6, 7]),

  slide('stronger-bound', 'Another constraint can give a stronger bound',
    formReminder('warmup') +
    warmup() +
    box(math(raw`0(x_1+x_2)+4x_2+(x_1-x_2)\ge0\cdot2+4\cdot1+3.`), 'blue') +
    box(math(raw`x_1+3x_2\ge7.`) + p(raw`Weights \((0,4,1)\) improve the previous bound 4 to 7. The feasible point \((4,1)\) attains 7.`), 'green'), [8, 9]),

  slide('weights-explore', 'Which constraint weights give a valid bound?',
    formReminder('warmup') +
    '<div class="dy-pair"><div class="dy-stack">' +
    p(raw`For \(x_1+x_2\ge2,\ x_2\ge1,\ x_1-x_2\ge3\), choose`) +
    math(raw`(p_1,p_2,p_3)=(t,\ 4-2t,\ 1-t).`) +
    p(raw`These weights always produce the objective coefficients \((1,3)\). They are all nonnegative exactly when \(0\le t\le1\).`) +
    '</div>'+weightsWidget()+'</div>', [9, 10], {
      onMount: mountWeights,
      printHtml: formReminder('warmup') + p(raw`Matching coefficients gives \((p_1,p_2,p_3)=(t,4-2t,1-t)\).`) +
        table([raw`\(t\)`, 'Weights', 'Weighted RHS', 'Certificate?'], [
          ['1', raw`\((1,2,0)\)`, '4', 'Yes'], ['0', raw`\((0,4,1)\)`, '7', 'Yes'],
          [raw`\(-1/2\)`, raw`\((-1/2,5,3/2)\)`, raw`\(17/2\)`, 'No: a negative weight'],
        ]) + box(p(raw`Valid weights have \(0\le t\le1\), so \(7-3t\le7\). The best bound is 7, attained at \(t=0\).`), 'green') + p('Multiplying a ≥ inequality by a negative number reverses its direction; such a term cannot be added as another ≥ inequality.'),
    }),

  slide('warmup-dual', 'The best bound is itself a linear program',
    formReminder('warmup') +
    p(raw`<strong>Weight signs:</strong> the \(\ge\) constraints need nonnegative weights to keep the weighted sum \(\ge\) its right-hand side.`) +
    p(raw`<strong>Coefficient conditions:</strong> unrestricted variables require exact matching to objective coefficients \(1,3\).`) +
    math(raw`\begin{aligned}\max\quad &2p_1+p_2+3p_3\\\text{s.t.}\quad &p_1+p_3=1,\\&p_1+p_2-p_3=3,\\&p_1,p_2,p_3\ge0.\end{aligned}`) +
    box(p('The original problem is the <strong>primal</strong>. This problem of finding the strongest weighted bound is its <strong>dual</strong>.'), 'green'), [10, 11, 12, 13], {
      checkpoint: checkpoint('For this ≥-constraint warmup, why must every weight be nonnegative?', ['To keep every weighted inequality pointing ≥ when we add them.', 'Because all dual variables in every LP are nonnegative.', 'Because the primal variables are nonnegative.', 'Because negative numbers cannot appear in an objective.'], 0, 'A negative multiplier reverses an inequality. Here the primal variables are unrestricted; the weights are nonnegative because they multiply ≥ constraints in a minimization problem.'),
    }),

  slide('nutrition-meal', 'Can we meet the requirements for less than $14?',
    formReminder('nutrition') +
    p('Nutrient requirements are still minimums; now servings are nonnegative. Data are illustrative.') +
    table(['Per serving', 'Protein units', 'Carb units', 'Cost'], [
      [raw`Lentil dish \(x_L\)`, '2', '1', '$4'], [raw`Grain dish \(x_G\)`, '1', '2', '$5'],
      [raw`Snack \(x_S\)`, '1', '1', '$4'], ['Minimum required', '4', '5', ''],
    ]) +
    p(raw`Minimize \(4x_L+5x_G+4x_S\) while meeting both minimums. Fractional servings are allowed.`) +
    box(p('<strong>One feasible meal:</strong> 1 lentil dish + 2 grain dishes + no snack.') +
      p(raw`Protein: \(2+2=4\). Carbs: \(1+4=5\). Cost: \(4+10=14\).`), 'blue') +
    p(raw`We know \(v^*\le14\). Can any other combination cost less?`), []),

  slide('nutrition-values', 'Combine the nutritional requirements',
    formReminder('nutrition') +
    box(math(raw`\begin{aligned}2x_L+x_G+x_S&\ge4 &&\text{(protein)},\\x_L+2x_G+x_S&\ge5 &&\text{(carbohydrates)}.\end{aligned}`)) +
    p('<strong>Try this combination:</strong> the protein constraint plus twice the carbohydrate constraint.') +
    math(raw`(2x_L+x_G+x_S)+2(x_L+2x_G+x_S)\ge4+2(5).`) +
    box(p(raw`Since \(x_S\ge0\), the actual meal cost satisfies`) +
      math(raw`\underbrace{4x_L+5x_G+4x_S}_{\text{meal cost}}\ge4x_L+5x_G+3x_S\ge14.`) +
      p('<strong>Our feasible meal costs $14, so it is optimal.</strong>'), 'green'), []),

  slide('nutrition-dual', 'Find the strongest cost guarantee',
    formReminder('nutrition') +
    p(raw`<strong>Weight signs:</strong> the protein and carbohydrate \(\ge\) constraints give \(p,q\ge0\).`) +
    math(raw`(2p+q)x_L+(p+2q)x_G+(p+q)x_S\ge4p+5q.`) +
    p(raw`<strong>Coefficient conditions:</strong> choose coefficients \(\le\) food costs. Multiplication by nonnegative servings preserves these inequalities.`) +
    math(raw`\begin{aligned}\max\quad &4p+5q &&\text{lower bound on meal cost}\\
      \text{s.t.}\quad &2p+q\le4 &&\text{lentil dish},\\
      &p+2q\le5 &&\text{grain dish},\\
      &p+q\le4 &&\text{snack},\\
      &p,q\ge0.\end{aligned}`) +
    p(raw`Weights \((1,1)\) give a $9 bound; \((1,2)\) give $14, matching our meal.`), []),

  slide('continuing-model', 'Our continuing example has equality constraints',
    formReminder('equality') +
    primal46() +
    box(p('<strong>What changed?</strong> The variables remain nonnegative. The constraints are now equalities, so their weights may have either sign.')) +
    p(raw`The coefficient conditions will still be \(\le\), because the primal variables remain nonnegative.`), [14, 15, 75]),

  slide('certificate-arithmetic', 'Two weighted equalities nearly reproduce the objective',
    formReminder('equality') +
    p(raw`Our equalities are \(5x_1+x_2+3x_3=8\) and \(3x_1+x_2=3\).`) +
    box(math(raw`2(5x_1+x_2+3x_3)+(3x_1+x_2)=19.`)) +
    box(math(raw`13x_1+10x_2+6x_3=19+7x_2\ge19.`), 'green') +
    p(raw`The difference is \(7x_2\), which is nonnegative. The weighted equalities give a lower bound even though the \(x_2\) coefficient is not matched exactly.`), [14, 15, 75]),

  slide('unknown-weights', 'Choose weights so the remaining terms are nonnegative',
    formReminder('equality') +
    p(raw`Multiply the equalities by unrestricted weights \(p_1,p_2\):`) +
    math(raw`(5p_1+3p_2)x_1+(p_1+p_2)x_2+3p_1x_3=8p_1+3p_2.`) +
    box(p(raw`Because \(x_1,x_2,x_3\ge0\), a lower bound follows whenever`) +
      math(raw`5p_1+3p_2\le13,\qquad p_1+p_2\le10,\qquad3p_1\le6.`), 'blue') +
    box(math(raw`8p_1+3p_2\le13x_1+10x_2+6x_3.`), 'green') +
    p('Each nonnegative primal variable supplies one coefficient inequality.'), [14, 15, 75]),

  slide('continuing-dual', 'Maximize the bound subject to those coefficient tests',
    formReminder('equality') +
    p('<strong>Weight signs:</strong> equalities allow unrestricted weights.') +
    p(raw`<strong>Coefficient conditions:</strong> nonnegative variables allow weighted coefficients \(\le\) objective coefficients.`) +
    dual46() +
    box(p(raw`Check \(p=(2,1)\): the three left sides are \(13,3,6\), all at most \(13,10,6\). Its bound is \(8(2)+3(1)=19\).`), 'green') +
    p('Two primal equations give two dual variables. Three primal variables give three dual constraints.'), [15, 75]),

  slide('compare-forms', 'Three examples, two separate decisions',
    p('<strong>All three:</strong> primal minimization → dual maximization.') +
    box(p('<strong>Primal constraint → dual variable:</strong> choose the weight’s sign.') +
      p('<strong>Primal variable → dual constraint:</strong> compare its coefficients.')) +
    table(['Example', 'Primal constraints', 'Primal variables', 'Dual variables', 'Dual constraints'], [
      ['Opening', raw`\(\ge\)`, 'Unrestricted', 'Nonnegative', raw`\(=\)`],
      ['Nutrition', raw`\(\ge\)`, 'Nonnegative', 'Nonnegative', raw`\(\le\)`],
      ['Equality', raw`\(=\)`, 'Nonnegative', 'Unrestricted', raw`\(\le\)`],
    ], 'Comparison of three primal–dual forms; scroll horizontally to read all five columns') +
    '<p class="dy-table-scroll-hint">Scroll the table horizontally to read all five columns.</p>' +
    p('<strong>Opening → nutrition:</strong> changing variable signs changes the coefficient conditions.') +
    p('<strong>Nutrition → equality:</strong> changing constraint types changes the weight signs.'), [10, 13, 16, 21, 22, 23, 24], { onMount: mountFormComparison }),

  slide('constraint-signs', 'First: choose the sign of each constraint weight',
    p('<strong>For a minimization primal:</strong> after weighting, we want') +
    math(raw`\text{weighted expression}\ \ge\ \text{weighted right-hand side}.`) +
    table(['Original constraint', 'Allowed weight', 'Example after multiplication'], [
      [raw`\(x\ge2\)`, raw`\(p\ge0\)`, raw`\(p=2:\quad 2x\ge4\)`],
      [raw`\(x\le2\)`, raw`\(p\le0\)`, raw`\(p=-1:\quad -x\ge-2\)`],
      [raw`\(x=2\)`, raw`\(p\) unrestricted`, raw`\(p=-1:\quad -x=-2\)`],
    ]) +
    box(p(raw`Both weighted inequalities now point \(\ge\), so we can add them. An equality also satisfies \(\ge\). These are three separate illustrations.`), 'green') +
    p('<strong>Next:</strong> ensure that the weighted expression does not exceed the original objective.'), [21, 22, 23, 24]),

  slide('variable-signs', 'Second: compare each variable’s coefficients',
    p('<strong>Still minimizing:</strong> the weighted expression must not exceed the objective.') +
    p(raw`For lentils, the weighted coefficient is \(2p+q\), and the unit cost is \(4\):`) +
    math(raw`2p+q\le4,\quad x_L\ge0\quad\Longrightarrow\quad(2p+q)x_L\le4x_L.`) +
    table(['Primal variable', 'Weighted coefficient vs. objective coefficient'], [
      [raw`\(x_j\ge0\)`, raw`\(\le\): nonnegative multiplication preserves the comparison.`],
      [raw`\(x_j\le0\)`, raw`\(\ge\): nonpositive multiplication reverses the comparison.`],
      [raw`\(x_j\) unrestricted`, raw`\(=\): exact matching works for either sign.`],
    ]) +
    box(math(raw`\text{weighted RHS}\le\text{weighted expression}\le\text{objective}.`) +
      p('<strong>First comparison:</strong> constraint types and weight signs.') +
      p('<strong>Second comparison:</strong> variable signs and coefficient conditions.'), 'green'), [22, 23, 24]),

  slide('standard-pair', 'Write the same argument in matrix notation',
    formReminder('equality') +
    box(math(raw`\text{Primal:}\quad\min c^\top x\quad\text{s.t.}\quad Ax=b,\quad x\ge0.`)) +
    p(raw`Each equality supplies an unrestricted weight. The weighted coefficient of \(x_j\) is \(p^\top A_j\), where \(A_j\) is column \(j\) of \(A\).`) +
    box(math(raw`\text{Dual:}\quad\max b^\top p\quad\text{s.t.}\quad A^\top p\le c,\quad p\text{ unrestricted}.`), 'green') +
    p(raw`Nonnegative \(x_j\) requires \(p^\top A_j\le c_j\). Collecting these coefficient conditions gives \(A^\top p\le c\).`), [14, 15, 16]),

  slide('mixed-question', 'Practice: a primal with mixed signs',
    mixedPrimal() +
    box(p('<strong>1. Constraint types:</strong> choose the sign of each weight.') +
      p('<strong>2. Variable signs:</strong> write one coefficient condition per variable.') +
      p('<strong>3. Objective:</strong> maximize the weighted right-hand side.')) +
    p('Use minimization rules. Constructing a dual does not assume feasibility or optimality.'), [26]),

  slide('mixed-answer', 'Mixed signs: read one column at a time',
    p('<strong>Primal minimization → dual maximization.</strong> Read constraint types and variable signs separately.') +
    box(p(raw`<strong>Weight signs from the three constraints:</strong> equality → \(p_1\) unrestricted; \(\ge\) → \(p_2\ge0\); \(\le\) → \(p_3\le0\).`)) +
    table(['Primal variable sign', 'Corresponding dual coefficient condition'], [
      [raw`\(x_1\ge0\)`, raw`\(-p_1+2p_2\le1\)`],
      [raw`\(x_2\le0\)`, raw`\(3p_1-p_2\ge2\)`],
      [raw`\(x_3\text{ unrestricted}\)`, raw`\(3p_2+p_3=3\)`],
    ]) +
    box(math(raw`\max\quad5p_1+6p_2+4p_3.`) + p('Use the three dual constraints and the weight restrictions listed above.'), 'green'), [27], {
      checkpoint: checkpoint('If a primal variable is unrestricted, which dual condition corresponds to it?', ['The corresponding dual variable must be zero.', 'The corresponding coefficient constraint must be an equality.', 'The corresponding coefficient constraint is always ≤.', 'The primal must first be feasible.'], 1, 'The difference between objective and weighted-row coefficients must vanish: otherwise one sign of the unrestricted primal variable makes the remaining term negative.'),
    }),

  slide('max-convention', 'If the primal maximizes, its dual gives an upper bound',
    p('<strong>This page changes convention:</strong> primal maximization → dual minimization.') +
    box(math(raw`\text{Primal:}\quad\max c^\top x\quad\text{s.t.}\quad Ax\le b,\quad x\ge0.`)) +
    box(math(raw`\text{Dual:}\quad\min b^\top p\quad\text{s.t.}\quad A^\top p\ge c,\quad p\ge0.`), 'green') +
    math(raw`c^\top x\le p^\top Ax\le p^\top b.`) +
    p(raw`You can instead convert the objective to \(\min(-c^\top x)\), then use the minimization rules. Track the sign of the final objective value.`) +
    p('<strong>From the next page onward, our primal is again a minimization problem.</strong>'), [18, 25]),

  slide('weak-statement', 'Weak duality compares any feasible pair',
    box(p('<strong>Theorem 4.3 — Weak duality.</strong>') + p(raw`If \(x\) is primal feasible and \(p\) is dual feasible, then`) + math(raw`b^\top p\le c^\top x.`), 'blue') +
    p('Neither solution needs to be optimal. Every dual feasible solution gives a lower bound on every primal feasible objective value.') +
    box(p('Feasibility of both points is essential. A vector that violates a dual constraint does not provide this certificate.'), 'orange'), [47, 48]),

  slide('weak-proof', 'The standard-form proof is one inequality',
    p(raw`Assume \(Ax=b,\ x\ge0\), and \(A^\top p\le c\).`) +
    box(math(raw`b^\top p=(Ax)^\top p=x^\top A^\top p.`) + p('Use primal feasibility, then regroup the same scalar product.')) +
    box(math(raw`x^\top A^\top p\le x^\top c=c^\top x.`) + p(raw`Multiply each coefficient inequality by the corresponding nonnegative \(x_j\), then add.`), 'green') +
    p('The proof compares the weighted constraints with the original objective. No simplex pivot is needed.'), [47]),

  slide('weak-gap', 'A lower bound lies below every feasible objective value',
    `<div class="dy-pair"><div class="dy-stack">` +
      math(raw`\begin{aligned}\min\quad &x_1+3x_2\\\text{s.t.}\quad &x_1+x_2\ge2,\\&x_2\ge1,\quad x_1-x_2\ge3.\end{aligned}`) +
      p(raw`Both variables are unrestricted. The plot returns to our opening example.`) +
      box(p(raw`Weights \((1,2,0)\) give the lower bound 4. Its objective line does not touch the feasible region.`), 'blue', '1') +
      box(p(raw`Weights \((0,4,1)\) give 7. This line touches the region at \((4,1)\), which attains the bound.`), 'green', '2') +
    `</div>${weakDualityFigure()}</div>`, [48, 51]),

  slide('equal-values', 'Matching feasible values certify optimality',
    box(p('<strong>Corollary 4.2.</strong> If a primal feasible point and a dual feasible point have the same objective value, both are optimal.')) +
    p(raw`Call these feasible points \(\hat x,\hat p\), with common value \(c^\top\hat x=b^\top\hat p=v\).`) +
    box(p(raw`<strong>Primal minimum.</strong> For every primal feasible \(x\), weak duality gives`) +
      math(raw`c^\top x\ge b^\top\hat p=v.`) +
      p(raw`Our point \(\hat x\) attains this lower bound, so it is optimal.`)) +
    box(p(raw`<strong>Dual maximum.</strong> For every dual feasible \(p\), weak duality gives`) +
      math(raw`b^\top p\le c^\top\hat x=v.`) +
      p(raw`Our point \(\hat p\) attains this upper bound, so it is optimal.`), 'green') +
    p('A feasible meal costs $14; dual weights prove no acceptable meal costs less. Both are optimal.'), [51]),

  slide('unbounded-implications', 'Unboundedness on one side rules out feasibility on the other',
    box(p(raw`If the primal objective decreases without bound, the dual is infeasible. A finite dual lower bound would block that decrease.`)) +
    box(p(raw`If the dual objective increases without bound, the primal is infeasible. A finite primal value would block that increase.`), 'green') +
    p('These statements follow from weak duality. Their converses do not follow: infeasibility alone does not tell us that the other problem is unbounded.'), [49]),

  slide('unbounded-example', 'A one-variable example makes the contradiction visible',
    box(math(raw`\text{Primal:}\quad\min x_1\quad\text{s.t.}\quad x_1\le1,\quad x_1\text{ unrestricted}.`)) +
    table(['Feature of this minimization primal', 'Consequence for its dual'], [
      [raw`Constraint \(x_1\le1\)`, raw`Nonpositive weight: \(p_1\le0\).`],
      [raw`Unrestricted \(x_1\); objective coefficient \(1\)`, raw`Exact coefficient matching: \(p_1=1\).`],
      [raw`Right-hand side \(1\)`, raw`Maximize \(1\cdot p_1\).`],
    ]) +
    box(math(raw`\text{Dual:}\quad\max p_1\quad\text{s.t.}\quad p_1\le0,\quad p_1=1.`), 'orange') +
    p(raw`The dual conditions contradict each other. The primal is unbounded below: choose \(x_1=-M\) and let \(M\to\infty\).`), [50]),

  slide('practice-question', 'Practice: write the dual and try a certificate',
    math(raw`\begin{aligned}\min\quad &2x_1+x_2\\\text{s.t.}\quad &x_1+x_2\ge3,\\&x_1+2x_2\le6,\quad x_1\ge0,\quad x_2\text{ unrestricted}.\end{aligned}`) +
    box(p('1. Write the dual, including every sign restriction.') + p(raw`2. Is \(p=(1,0)\) dual feasible? What bound does it give?`) + p(raw`3. Check \(x=(0,3)\). What can you conclude?`)) +
    p('Check feasibility before comparing objective values.'), [21, 24, 47, 51]),

  slide('practice-answer', 'Practice solution: both sides attain 3',
    p(raw`<strong>Constraint types:</strong> \(\ge,\le\) give \(p_1\ge0,p_2\le0\). <strong>Variable signs:</strong> \(x_1\ge0\) gives \(\le\); unrestricted \(x_2\) gives \(=\).`) +
    math(raw`\begin{aligned}\max\quad &3p_1+6p_2\\\text{s.t.}\quad &p_1+p_2\le2,\quad p_1+2p_2=1,\\&p_1\ge0,\quad p_2\le0.\end{aligned}`) +
    box(p(raw`For \(p=(1,0)\), the coefficient tests are \(1\le2\) and \(1=1\); the lower bound is 3.`), 'blue') +
    box(p(raw`For \(x=(0,3)\), the primal rows give \(3\ge3\) and \(6\le6\); the cost is 3. Weak duality therefore proves both points optimal.`), 'green'), [47, 51], {
      checkpoint: checkpoint('Suppose a primal feasible point costs 12 and a dual feasible point gives a bound 12. What is established?', ['The primal point is optimal, but nothing is known about the dual point.', 'Both points are optimal.', 'Both problems have unique solutions.', 'The primal and dual variables must be identical.'], 1, 'Weak duality puts every feasible primal value above every feasible dual value. Equal feasible values leave no room to improve either side; uniqueness is not implied.'),
    }),

  slide('study-guide', 'Study guide: build, check, and interpret a dual',
    box(p('<strong>You should be able to:</strong>') + '<ul><li>Construct a bound by weighting constraints.</li><li>Explain each dual sign and coefficient inequality.</li><li>Prove weak duality and check an optimality certificate.</li></ul>') +
    p('<strong>Textbook:</strong> Bertsimas and Tsitsiklis, <em>Introduction to Linear Optimization</em>, §§4.1–4.3.') +
    p('<strong>Optional derivations:</strong> the following appendix develops the Lagrangian viewpoint, dual-of-dual, equivalent formulations, and general weak duality.') +
    p('<strong>Continue:</strong> Duality II asks why an optimal LP always has a matching dual certificate and how complementary slackness finds it.'), [1, 2, 33, 45, 47]),
];

const appendix = [
  slide('appendix-start', 'Optional study: three ways to understand the same dual',
    box(p('<strong>Lagrangian:</strong> the dual chooses the best bound obtained after weighting the constraints.')) +
    box(p('<strong>Dual of the dual:</strong> applying the construction twice returns an equivalent primal problem.')) +
    box(p('<strong>Equivalent formulations:</strong> surplus variables, split free variables, and redundant rows change the notation while preserving the dual optimization problem.')) +
    p('The main lecture uses weighted arithmetic. These pages supply the longer derivations.'), [17, 18, 19, 33, 45]),

  slide('lagrangian-min', 'A Lagrangian packages the weighted-constraint argument',
    p(raw`Start with \(\min c^\top x\), subject to \(Ax=b,\ x\ge0\). Use unrestricted equality weights \(p\) and nonnegative sign-constraint weights \(s\).`) +
    box(math(raw`L(x,p,s)=c^\top x+p^\top(b-Ax)-s^\top x.`)) +
    math(raw`L(x,p,s)=p^\top b+(c-A^\top p-s)^\top x.`) +
    box(p(raw`For a feasible \(x\), the equality term vanishes and \(-s^\top x\le0\). Hence \(L(x,p,s)\le c^\top x\).`), 'green'), [17]),

  slide('lagrangian-infimum', 'A finite lower bound requires the remaining coefficient to vanish',
    p(raw`Minimize the Lagrangian over <strong>unrestricted</strong> \(x\). Here the sign constraints have already been included using \(s\ge0\).`) +
    math(raw`g(p,s)=\inf_{x\in\mathbb R^n}L(x,p,s)=\begin{cases}p^\top b,&c-A^\top p-s=0,\\-\infty,&\text{otherwise}.\end{cases}`) +
    p(raw`If a coefficient is nonzero, choose the sign of that \(x_j\) and make its magnitude arbitrarily large to drive \(L\) downward.`) +
    box(math(raw`\max p^\top b\quad\text{s.t.}\quad A^\top p+s=c,\quad s\ge0.`) +
      p(raw`Eliminating \(s\) gives \(A^\top p\le c\), our standard-form dual.`), 'green'), [17]),

  slide('lagrangian-max', 'For a maximization primal, construct an upper bound',
    p(raw`Consider \(\max c^\top x\), subject to \(Ax\le b,\ x\ge0\). Choose \(p\ge0\).`) +
    math(raw`L(x,p)=c^\top x+p^\top(b-Ax)=p^\top b+(c-A^\top p)^\top x.`) +
    p(raw`For a primal feasible point, \(L(x,p)\ge c^\top x\). Maximize \(L\) over \(x\ge0\):`) +
    math(raw`\sup_{x\ge0}L(x,p)=\begin{cases}p^\top b,&A^\top p\ge c,\\+\infty,&\text{otherwise}.\end{cases}`) +
    box(p(raw`The best finite upper bound is \(\min b^\top p\) subject to \(A^\top p\ge c,\ p\ge0\).`), 'green'), [18, 19]),

  slide('dual-of-dual', 'The dual of the dual returns the primal',
    box(math(raw`\text{P:}\quad\min c^\top x\quad\text{s.t.}\quad Ax=b,\quad x\ge0.`)) +
    box(math(raw`\text{D:}\quad\max b^\top p\quad\text{s.t.}\quad A^\top p\le c,\quad p\text{ unrestricted}.`), 'blue') +
    box(p(raw`Dualizing this maximization problem: its ≤ rows give \(x\ge0\); its unrestricted variables give \(Ax=b\); its objective becomes \(\min c^\top x\).`), 'green') +
    p('<strong>Theorem 4.1.</strong> The dual of the dual is equivalent to the original primal. Converting a maximization to minimization must include the objective-sign change.'), [28, 29, 30, 31, 32, 33]),

  slide('mixed-double-dual', 'Mixed-form example: convert its dual carefully',
    p('The mixed-form exercise had a maximization dual. Negate its objective and multiply its coefficient rows by −1:') +
    math(raw`\begin{aligned}\min\quad&-5p_1-6p_2-4p_3\\\text{s.t.}\quad&p_1-2p_2\ge-1,\\&-3p_1+p_2\le-2,\quad-3p_2-p_3=-3,\\&p_1\text{ unrestricted},\ p_2\ge0,\ p_3\le0.\end{aligned}`) +
    box(p('This minimization has the negative of the original dual objective value. Track that minus sign when interpreting the next dual.'), 'orange'), [28, 29]),

  slide('mixed-double-dual-answer', 'Dualizing again recovers the original mixed problem',
    p('The dual of the minimization on the previous page is') +
    math(raw`\begin{aligned}\max\quad&-x_1-2x_2-3x_3\\\text{s.t.}\quad&x_1-3x_2=-5,\\&-2x_1+x_2-3x_3\le-6,\quad-x_3\ge-4,\\&x_1\ge0,\ x_2\le0,\ x_3\text{ unrestricted}.\end{aligned}`) +
    box(p('Negating the objective to return to minimization, and reversing the displayed row signs, gives precisely the original mixed-form primal.'), 'green') +
    p(raw`Its objective is \(\min x_1+2x_2+3x_3\); its rows are \(-x_1+3x_2=5\), \(2x_1-x_2+3x_3\ge6\), and \(x_3\le4\).`), [30, 31, 32, 33]),

  slide('surplus-equivalence', 'Adding a surplus variable preserves the dual',
    p(raw`Start with \(\min c^\top x\), subject to \(Ax\ge b\), with \(x\) unrestricted. Its dual is \(\max p^\top b\), subject to \(A^\top p=c,\ p\ge0\).`) +
    box(math(raw`Ax-s=b,\qquad s\ge0,\qquad\text{objective }c^\top x+0^\top s.`)) +
    box(p('Dualizing the equality formulation gives:') +
      math(raw`A^\top p=c,\qquad -p\le0,\qquad p\text{ initially unrestricted}.`), 'blue') +
    p(raw`The surplus columns enforce \(p\ge0\). We recover the same dual constraints and objective.`), [34, 35, 37]),

  slide('free-split-equivalence', 'Splitting a free variable preserves its dual equality',
    p(raw`Write an unrestricted vector as \(x=x^+-x^-\), with \(x^+,x^-\ge0\). The primal becomes`) +
    math(raw`\min c^\top x^+-c^\top x^-\quad\text{s.t.}\quad Ax^+-Ax^-\ge b.`) +
    box(p('The two sets of nonnegative variables give two sets of dual coefficient inequalities:') +
      math(raw`A^\top p\le c,\qquad -A^\top p\le-c,\qquad p\ge0.`), 'blue') +
    box(p(raw`Together they say \(A^\top p=c\). The dual is unchanged.`), 'green'), [34, 36, 37, 38]),

  slide('redundant-row', 'A redundant equality only redistributes dual weights',
    p(raw`Suppose row \(m\) is an exact combination of the first \(m-1\) rows, including its RHS:`) +
    math(raw`a_m=\sum_{i=1}^{m-1}\gamma_i a_i,\qquad b_m=\sum_{i=1}^{m-1}\gamma_i b_i.`) +
    box(p(raw`For weights \(p_1,\ldots,p_m\), absorb the last weight into the others:`) +
      math(raw`q_i=p_i+\gamma_i p_m\qquad(i=1,\ldots,m-1).`), 'blue') +
    p('The weights are unrestricted because all primal rows are equalities. The next page checks both the bound and the coefficient tests.'), [39, 40, 41]),

  slide('redundant-row-proof', 'The new weights give exactly the same bound and coefficients',
    box(math(raw`p^\top b=\sum_{i=1}^{m-1}(p_i+\gamma_i p_m)b_i=\sum_{i=1}^{m-1}q_i b_i.`)) +
    box(math(raw`p^\top A=\sum_{i=1}^{m-1}(p_i+\gamma_i p_m)a_i^\top=\sum_{i=1}^{m-1}q_i a_i^\top.`), 'blue') +
    p('Thus a feasible dual weight vector before removal gives one after removal with the same value.') +
    box(p(raw`Conversely, given \(q\), choose \(p_i=q_i\) for \(i\lt m\) and \(p_m=0\). This recovers every feasible dual vector of the smaller system.`), 'green'), [40, 41, 42, 43, 44]),

  slide('equivalent-forms', 'Equivalent formulations give equivalent duals',
    box(p('<strong>Theorem 4.2.</strong> The following transformations preserve the dual optimization problem up to equivalent variables and constraints:') +
      '<ol><li>Replace a free variable by the difference of two nonnegative variables.</li><li>Introduce a nonnegative slack or surplus to turn an inequality into an equality.</li><li>Remove a redundant equality from a feasible standard-form system.</li></ol>') +
    p('The preceding pages provide the explicit correspondence in each case. The dual may look different on paper while describing the same attainable bounds.'), [45]),

  slide('weak-general-proof', 'Weak duality also holds with mixed row and variable signs',
    p(raw`Let \(x,p\) satisfy the minimization primal and its dual. For each row, the sign rule gives \(p_i(a_i^\top x-b_i)\ge0\). For each variable, the coefficient rule gives \((c_j-p^\top A_j)x_j\ge0\).`) +
    box(math(raw`c^\top x-p^\top b=\sum_j(c_j-p^\top A_j)x_j+\sum_i p_i(a_i^\top x-b_i).`)) +
    box(p('Every term is nonnegative. Hence the whole difference is nonnegative, which is weak duality.'), 'green') +
    p('Equality rows contribute zero. Unrestricted primal variables have zero coefficient differences. The remaining cases follow their stated signs.'), [23, 24, 47]),

  slide('unbounded-proof', 'Why weak duality rules out the unbounded–feasible combinations',
    box(p(raw`Suppose the dual has a feasible \(p\). Its finite value \(b^\top p\) is a lower bound on every primal feasible cost. The primal therefore cannot decrease without bound.`)) +
    box(p(raw`Suppose the primal has a feasible \(x\). Its finite value \(c^\top x\) is an upper bound on every dual feasible value. The dual therefore cannot increase without bound.`), 'green') +
    p('These are the contrapositives of the two unboundedness implications. Neither argument says that infeasibility forces the other side to be unbounded.'), [49]),
];

export const slides = [...main.map(s => ({ ...s, section: 'Duality I · Bounds and the dual problem' })), ...appendix.map(s => ({ ...s, section: 'Appendix · Additional derivations' }))]
  .map((s, i) => ({ ...s, page: i + 1, eyebrow: s.section }));
export const referenceMap = slides.map(({ id, page, title, section, referencePages }) => ({ id, page, title, section, referencePages }));
export const auditData = {
  mainPageCount: main.length,
  nutrition: nutritionModel,
  warmup: { variableSigns: ['free', 'free'], weights: 't,4-2t,1-t', interval: [0, 1], bound: '7-3t', optimum: [4, 1], value: 7 },
  example46: { A: [[5, 1, 3], [3, 1, 0]], b: [8, 3], c: [13, 10, 6], primal: [1, 0, 1], dual: [2, 1], reducedCosts: [0, 7, 0], value: 19 },
  practice: { A: [[1, 1], [1, 2]], b: [3, 6], c: [2, 1], rowSigns: ['>=', '<='], variableSigns: ['nonnegative', 'free'], primal: [0, 3], dual: [1, 0], value: 3 },
  weakGeometry: { window: { x: [-1, 8], y: [-1, 4] }, feasibleClipped: [[4, 1], [8, 1], [8, 4], [7, 4]], objective: [1, 3], levels: [4, 7], optimum: [4, 1], equalAxisScale: 50 },
  sourceCoverage: [...new Set(slides.flatMap(s => s.referencePages))].sort((a, b) => a - b),
};
export const deck = { schemaVersion: 1, id: metadata.id, number: metadata.number, title: metadata.title, metadata,
  styles: new URL('./lecture-17.css', import.meta.url).href, slides };
export default deck;
