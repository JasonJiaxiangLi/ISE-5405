/** Complete bounded-set normalization argument for column geometry. */
const raw = String.raw;
const box = (body, tone = 'blue', step) => `<section class="l10-box" data-tone="${tone}"${step ? ` data-reveal="${step}"` : ''}>${body}</section>`;
const math = body => `<div class="l10-math">\\[${body}\\]</div>`;
const slide = (suffix, title, html, extra = {}) => ({
  key: `normalization-${suffix}`, id: `l12-normalization-${suffix}`, title,
  className: 'l12-normalization-slide', referencePages: [], html, ...extra,
});

const example = {
  A: [[1, 2]], b: [4], c: [-3, -1], M: 4,
  samples: [
    { x: [4, 0], slack: 0, weights: [0, 1, 0], objective: -12 },
    { x: [2, 1], slack: 1, weights: [1 / 4, 1 / 2, 1 / 4], objective: -7 },
    { x: [0, 2], slack: 2, weights: [1 / 2, 0, 1 / 2], objective: -2 },
  ],
};
const projection = { origin: [76, 306], scale: 90 };
function segmentFigure() {
  const point = ([x, y]) => [projection.origin[0] + projection.scale * x,
    projection.origin[1] - projection.scale * y];
  const endpoints = [[0, 2], [4, 0]].map(point);
  const labels = [{ x: [0, 2], text: '(0, 2)', dx: 16, dy: -16 },
    { x: [2, 1], text: '(2, 1)', dx: 18, dy: -16 },
    { x: [4, 0], text: '(4, 0)', dx: 12, dy: -18 }];
  return `<figure class="l10-figure l12-normalization-segment"><svg viewBox="0 0 550 375" role="img" aria-label="The feasible set is the line segment from (0,2) to (4,0), passing through (2,1). Both axes have the same scale.">
    <path d="M60,306H515 M76,322V68" class="l12-normalization-axis"/>
    <polyline data-normalization-segment="0,2;4,0" points="${endpoints.map(p => p.join(',')).join(' ')}" class="l12-normalization-line"/>
    ${labels.map(({ x, text, dx, dy }) => { const [px, py] = point(x); return `<circle data-normalization-point="${x.join(',')}" data-world="${x.join(',')}" cx="${px}" cy="${py}" r="7" class="l12-normalization-point"/><text x="${px + dx}" y="${py + dy}">${text}</text>`; }).join('')}
    <text x="57" y="338">0</text>
  </svg><span class="l12-normalization-axis-x">\\(x_1\\)</span><span class="l12-normalization-axis-y">\\(x_2\\)</span><figcaption>Every feasible point lies on this segment.</figcaption></figure>`;
}

export const normalizationSlides = [
  slide('weights', 'Why do the weights need to sum to one?', raw`
    <p>In column space, feasibility is a combination of the columns:</p>
    ${math(raw`Ax=\sum_jx_jA_j=b,\qquad x_j\ge0.`)}
    ${box(raw`<p>If the weights also satisfy \(\sum_jx_j=1\), the combination is a <strong>weighted average</strong>. It lies in the <strong>convex hull</strong> of the column-points.</p>`, 'green', '1')}
    ${box(raw`<p>Adding \(\sum_jx_j=1\) to an existing LP can exclude feasible points.</p><p><strong>Our question:</strong> can we obtain weights summing to one by changing variables and preserving the original problem?</p>`, 'orange', '2')}`),

  slide('example', 'Start with an LP whose variables do not sum to one', raw`
    <div class="l12-normalization-model">${math(raw`\min f=-3x_1-x_2\qquad\text{s.t.}\quad x_1+2x_2=4,\quad x_1,x_2\ge0.`)}</div>
    <div class="l10-pair l12-normalization-pair"><div>
      <p>The equality and nonnegativity give a bounded feasible segment.</p>
      ${box(raw`<p>At \((4,0)\), the variables sum to 4. At \((0,2)\), they sum to 2.</p><p>They cannot serve directly as weights summing to one.</p>`)}
      <p data-reveal="1">We will represent every point on this segment using new weights, while keeping its objective value.</p>
    </div>${segmentFigure()}</div>`),

  slide('slack', 'Add the unused part of a common bound', raw`
    <p>For every feasible point of \(x_1+2x_2=4\), \(x_1,x_2\ge0\),</p>
    ${math(raw`x_1+x_2=4-x_2\le4.`)}
    ${box(raw`<p>Define the unused amount \(s\):</p>${math(raw`s=4-x_1-x_2\ge0\qquad\Longleftrightarrow\qquad x_1+x_2+s=4.`)}`, 'blue', '1')}
    ${box(raw`<p><strong>No original point is removed.</strong> Every feasible \((x_1,x_2)\) determines exactly one nonnegative \(s\).</p>`, 'green', '2')}
    <p>Now all three nonnegative quantities have the same total: 4.</p>`),

  slide('example-weights', 'Divide by the common total to get weights', raw`
    ${math(raw`\lambda_1=\frac{x_1}{4},\qquad\lambda_2=\frac{x_2}{4},\qquad\lambda_0=\frac{s}{4}.`)}
    <p>The subscript 0 identifies the extra weight for the unused amount.</p>
    ${box(math(raw`\begin{aligned}
      \min\quad &-12\lambda_1-4\lambda_2\\
      \text{s.t.}\quad &\lambda_1+2\lambda_2=1,\\
      &\lambda_0+\lambda_1+\lambda_2=1,\\
      &\lambda_0,\lambda_1,\lambda_2\ge0.
    \end{aligned}`), 'blue', '1')}
    <p data-reveal="1">Recover the original variables with \(x_1=4\lambda_1\), \(x_2=4\lambda_2\); hence \(-3x_1-x_2=-12\lambda_1-4\lambda_2\).</p>`),

  slide('example-points', 'Corresponding points have the same cost', raw`
    <p>Use \(s=4-x_1-x_2\) and \((\lambda_0,\lambda_1,\lambda_2)=(s,x_1,x_2)/4\).</p>
    <div class="l10-table-wrap"><table class="l10-table l12-normalization-table">
      <thead><tr><th scope="col">Original point<br>\((x_1,x_2)\)</th><th scope="col">Unused amount<br>\(s\)</th><th scope="col">New weights<br>\((\lambda_0,\lambda_1,\lambda_2)\)</th><th scope="col">Cost in<br>both models</th></tr></thead>
      <tbody><tr><th scope="row">\((4,0)\)</th><td>\(0\)</td><td>\((0,1,0)\)</td><td>\(-12\)</td></tr>
      <tr><th scope="row">\((2,1)\)</th><td>\(1\)</td><td>\((\tfrac14,\tfrac12,\tfrac14)\)</td><td>\(-7\)</td></tr>
      <tr><th scope="row">\((0,2)\)</th><td>\(2\)</td><td>\((\tfrac12,0,\tfrac12)\)</td><td>\(-2\)</td></tr></tbody>
    </table></div>
    ${box(raw`<p>Every row has nonnegative weights summing to 1, and \(\lambda_1+2\lambda_2=1\).</p>`, 'green', '1')}
    <p data-reveal="1">These are three examples. Next we prove that the construction works for <strong>every</strong> feasible point of any bounded standard-form LP.</p>`),

  slide('bound', 'Boundedness gives one bound for all feasible points', raw`
    <p>Consider \(\min c^\top x\) over a nonempty, bounded set</p>
    ${math(raw`P=\{x:Ax=b,\ x\ge0\}.`)}
    ${box(raw`<p>Choose one number \(M>0\) such that</p>${math(raw`\sum_{j=1}^{n}x_j\le M\qquad\text{for every }x\in P.`)}`, 'blue', '1')}
    ${box(raw`<p>Why does one exist? Boundedness gives finite coordinate bounds \(x_j\le U_j\). Any positive \(M\ge\sum_jU_j\) works.</p>`, 'green', '2')}
    <p data-reveal="2">The bound need not be tight. If all \(U_j=0\), choose any positive \(M\).</p>`),

  slide('general', 'The complete normalized LP', raw`
    <p>Let \(s=M-\mathbf1^\top x\), \(\lambda=x/M\), and \(\lambda_0=s/M\). Here \(\mathbf1\) is the vector of ones.</p>
    ${box(math(raw`\begin{aligned}
      \min\quad &M c^\top\lambda\\
      \text{s.t.}\quad &A\lambda=b/M,\\
      &\mathbf1^\top\lambda+\lambda_0=1,\\
      &\lambda\ge0,\quad\lambda_0\ge0.
    \end{aligned}`))}
    <p>The extra variable has zero coefficients in \(A\lambda=b/M\) and zero objective coefficient.</p>
    ${box(raw`<p>We must check both directions: original feasible points give feasible weights, and feasible weights recover original feasible points.</p>`, 'green', '1')}`),

  slide('forward', 'From an original feasible point to feasible weights', raw`
    <p>Take any \(x\in P\). Define \(\lambda=x/M\), \(\lambda_0=(M-\mathbf1^\top x)/M\).</p>
    ${box(raw`<p><strong>Nonnegativity:</strong> \(x\ge0\), \(M>0\), and \(\mathbf1^\top x\le M\) give \(\lambda\ge0\) and \(\lambda_0\ge0\).</p>`)}
    ${box(raw`<p><strong>Original equations, scaled:</strong></p>${math(raw`A\lambda=A(x/M)=(Ax)/M=b/M.`)}`, 'blue', '1')}
    ${box(raw`<p><strong>Weights sum to one:</strong></p>${math(raw`\mathbf1^\top\lambda+\lambda_0
      =\frac{\mathbf1^\top x}{M}+\frac{M-\mathbf1^\top x}{M}=1.`)}`, 'green', '2')}`),

  slide('reverse', 'From feasible weights back to an original point', raw`
    <p>Take any feasible \((\lambda,\lambda_0)\) of the normalized LP. Set \(x=M\lambda\).</p>
    ${box(raw`<p><strong>Nonnegativity:</strong> \(M>0\) and \(\lambda\ge0\) give \(x\ge0\).</p>`)}
    ${box(raw`<p><strong>Original equations:</strong></p>${math(raw`Ax=A(M\lambda)=M(A\lambda)=M(b/M)=b.`)}`, 'blue', '1')}
    ${box(raw`<p>The extra weight is exactly the unused amount:</p>${math(raw`M\lambda_0=M(1-\mathbf1^\top\lambda)=M-\mathbf1^\top x=s.`)}`, 'green', '2')}
    <p data-reveal="2">Thus \(x\in P\), and the two transformations undo each other.</p>`),

  slide('objective', 'The objective value is preserved as well', raw`
    <p>Corresponding feasible solutions satisfy \(x=M\lambda\).</p>
    ${box(math(raw`\underbrace{c^\top x}_{\text{original cost}}
      =c^\top(M\lambda)
      =\underbrace{M c^\top\lambda}_{\text{normalized cost}}.`))}
    ${box(raw`<p>Every feasible point has exactly one corresponding set of weights, with the same cost.</p><p>Therefore an optimal solution of either model gives an optimal solution of the other.</p>`, 'green', '1')}
    <p data-reveal="1">A better original point would give better normalized weights, and vice versa.</p>
    <p><strong>What changed:</strong> the coordinates and one extra variable. <strong>What stayed:</strong> the feasible choices and their objective values.</p>`),

  slide('scope', 'A finite optimum does not make the feasible set bounded', raw`
    <p>The construction requires a bound on <strong>every feasible point</strong>.</p>
    ${box(math(raw`\min x_1\qquad\text{s.t.}\quad x_1-x_2=0,\quad x_1,x_2\ge0.`) + raw`<p>The optimum is 0 at \((0,0)\), but \((t,t)\) is feasible for every \(t\ge0\). No finite \(M\) bounds \(x_1+x_2=2t\).</p>`)}
    ${box(raw`<p><strong>Simplex itself needs no sum-to-one condition.</strong> This reformulation gives a convex-hull picture when the feasible set is bounded.</p>`, 'green', '1')}
    <p data-reveal="1">Without normalization, nonnegative combinations of lifted columns \((A_j,c_j)\) form a <strong>cone</strong>; coefficients need not sum to one.</p>`, {
      checkpoint: {
        prompt: 'Why can we use a common positive bound M in the normalization construction?',
        choices: [
          'Because the optimal objective value is finite.',
          'Because the feasible set is bounded, so the sum of the nonnegative variables is bounded for every feasible point.',
          'Because every simplex dictionary has nonnegative right-hand sides.',
          'Because adding a sum-to-one equation never changes an LP.',
        ],
        correctIndex: 1,
        explanation: 'We need one M that works for all feasible points. A finite optimal value alone does not provide that bound. The slack and scaling preserve feasibility; simply adding a sum-to-one equation need not.',
        autoOpen: true,
      },
    }),
];

export const dimensionSlide = slide('dimensions', 'Why the next column picture fits in three dimensions', raw`
  <p>For a normalized model with two coordinate equations, each full constraint column is</p>
  ${math(raw`\widetilde A_j=\begin{pmatrix}a_{1j}\\a_{2j}\\1\end{pmatrix}.`)}
  ${box(raw`<p>The last coordinate is always 1. Draw the floor point \(A_j=(a_{1j},a_{2j})\); the sum-to-one row ensures <strong>convex weights</strong>.</p>`)}
  ${box(raw`<p>Add the objective coefficient as height:</p>${math(raw`P_j=(a_{1j},a_{2j},c_j).`)}`, 'green', '1')}
  <p data-reveal="1">The next example calls its mixture weights \(x_j\) again. Each \(x_j\) is a weight, while each \(P_j\) is a plotted column-point.</p>`);

export const auditData = {
  example: { ...example, normalizedA: [[0, 1, 2], [1, 1, 1]], normalizedB: [1, 1], normalizedC: [0, -12, -4], weightOrder: ['lambda0', 'lambda1', 'lambda2'] },
  plot: { ...projection, endpoints: [[0, 2], [4, 0]] },
  general: { assumptions: ['nonempty', 'bounded', 'nonnegative standard form'],
    map: 'lambda=x/M;lambda0=1-sum(x)/M', inverse: 'x=M*lambda',
    rhsScale: 'b/M', objectiveScale: 'M*c', normalizationIncludesSlack: true },
  unboundedExample: { A: [[1, -1]], b: [0], c: [1, 0], ray: [1, 1], optimum: [0, 0], optimumValue: 0 },
  dimensions: { coordinateRows: 2, normalizationRow: 1, equalityColumn: ['a1j', 'a2j', 1], plottedColumn: ['a1j', 'a2j', 'cj'] },
};
