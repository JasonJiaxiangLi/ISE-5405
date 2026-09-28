/** Short conceptual classroom route; complete calculations remain in the appendix. */
import { columnFigure, mountColumnGeometry } from './lecture-11-geometry.js';
import { diameterSvg, squareSvg } from './lecture-11-efficiency.js';
const raw = String.raw;
const box = (body, tone = 'blue') => `<section class="l10-box" data-tone="${tone}">${body}</section>`;
const pair = (body, figure) => `<div class="l10-pair"><div>${body}</div>${figure}</div>`;
const hingeBody = raw`<p>Start with basic columns C, D, F. Their equal-weight mixture is H, with cost 4.</p>
  ${box('<p><strong>E enters; C leaves.</strong> The new basic triangle DEF meets the same requirement line at G.</p>', 'blue')}
  <div class="l10-math">\[x_D=\tfrac14,\quad x_E=\tfrac12,\quad x_F=\tfrac14,\qquad z=\tfrac52.\]</div>
  ${box('<p>A positive improving step lowers the cost. A degenerate pivot can change the basis without moving this point.</p>', 'green')}
  <p class="l10-note">The moving corner illustrates a hinge; intermediate corner positions are not extra LP columns.</p>`;

export const perspective = {
  key: 'two-geometries', title: 'The same LP, viewed in two different spaces', referencePages: [91, 92],
  html: raw`<div class="l10-stack">
    ${box(raw`<h3>The picture we already know</h3><p>A feasible solution \(x=(x_1,\ldots,x_n)\) is one point in <strong>variable space</strong>. A simplex step moves along an edge, unless it is degenerate.</p>`)}
    ${box(raw`<h3>A picture built from the columns</h3><p>Each \(A_j\) is a point in <strong>constraint-coordinate space</strong>; \(x_j\) supplies its weight.</p><div class="l10-math">\[Ax=\sum_jx_jA_j=b.\]</div>`, 'green')}
    <p>With two coordinate equations, we can draw the columns on a floor and add cost as height. More coordinate equations give the same idea in higher dimensions.</p>
    <p><strong>These are different spaces:</strong> the column picture is not a projection of the original feasible region.</p>
  </div>`,
};

export const overrides = {
  'geometric-ratio-test': {
    title: 'Increase E until the first basic weight reaches zero',
    html: pair(raw`<p>Start at H: \(x_C=x_D=x_F=1/3\). Keep \(x_B=0\), set \(x_E=\theta\), and preserve the three equalities:</p>
      <div class="l10-math">\[\begin{aligned}x_C&=\tfrac13-\tfrac23\theta,\\x_D&=\tfrac13-\tfrac16\theta,\\x_F&=\tfrac13-\tfrac16\theta.\end{aligned}\]</div>
      <p>The other weights total \(1-\theta\), so \(z=4(1-\theta)+\theta=4-3\theta\).</p>
      ${box(raw`<div class="l10-math">\[\theta^*=\min\{1/2,2,2\}=1/2.\]</div><p>C reaches zero first. E enters and C leaves.</p>`, 'green')}`,
      columnFigure('leaving')),
    onMount: mountColumnGeometry,
  },
  'physical-hinge': {
    title: 'One pivot lowers the attainable cost: H to G',
    html: pair(hingeBody, columnFigure('hinge', { hinge: true })),
    printHtml: pair(hingeBody, columnFigure('hinge', { hinge: true, print: true })),
    onMount: mountColumnGeometry,
  },
  efficiency: {
    title: 'Termination is only the beginning of the cost question',
    html: raw`<p>Lexicographic and Bland rules prevent cycling. They do not promise few pivots.</p>
      ${box(raw`<div class="l10-math">\[\text{total work}\approx\text{work per pivot}\times\text{number of pivots}.\]</div>`)}
      ${box(raw`<h3>One pivot</h3><p>With \(m\) equations and \(n\) variables, row operations update about \(mn\) tableau entries: \(O(mn)\) arithmetic operations.</p>`, 'green')}
      ${box('<h3>The whole run</h3><p>Even inexpensive steps can add up. We need to understand how many steps the chosen rule takes.</p>', 'orange')}
      <p>Next: a tilted cube with a long improving path—and a short alternative.</p>`,
  },
  'perturbed-cube': {
    title: 'Textbook example: an improving path can visit every vertex',
    className: 'l12-textbook-cube',
    html: pair(raw`<p>Choose \(0<\epsilon<1/2\). In \(n\) dimensions:</p>
      <div class="l10-math">\[\begin{aligned}\min\quad&-x_n\\\text{s.t.}\quad&\epsilon\le x_1\le1,\\&\epsilon x_{i-1}\le x_i\le1-\epsilon x_{i-1}.\end{aligned}\]</div>
      <p>The last bounds apply for \(i=2,\ldots,n\).</p>
      ${box(raw`<p><strong>Two dimensions:</strong> \(\epsilon=0.2\), objective \(-x_2\). Along the orange path, the objective decreases at every step.</p>`, 'green')}
      <p>Start at \((0.2,0.04)\); finish at \((0.2,0.96)\).</p>`,
      `<figure class="l10-figure">${squareSvg(.2)}</figure>`),
  },
  'pivot-shortcut': {
    title: 'A long available path does not force a rule to follow it',
    className: 'l12-textbook-cube',
    html: pair(raw`<p><strong>For the textbook construction:</strong> all \(2^n\) vertices can be visited in strictly improving order.</p>
      ${box(raw`<p>A rule that follows this order takes</p><div class="l10-math">\[2^n-1\text{ pivots}.\]</div>`)}
      ${box(raw`<p><strong>A shortcut also exists.</strong> From the initial vertex, Dantzig’s most-negative-reduced-cost rule increases only \(x_n\) and reaches the optimum in one pivot.</p>`, 'green')}
      <p>Next: Klee–Minty makes <em>Dantzig’s rule itself</em> take the long path.</p>`,
      `<figure class="l10-figure">${squareSvg(.2,3,true)}<figcaption>Orange: 3 pivots; green dashed: 1.</figcaption></figure>`),
  },
  diameter: {
    title: 'Graph diameter and the Hirsch conjecture',
    className: 'l12-hirsch-intro',
    sourceRefs: [{ title: 'Santos (2012), statement and counterexample to the Hirsch conjecture', url: 'https://doi.org/10.4007/annals.2012.176.1.7' }],
    html: raw`<p>Dantzig can take a long route. How short could an edge path be?</p>` + pair(
      box('<p><strong>Graph diameter:</strong> for each pair of vertices, find the fewest edges connecting them. Take the largest of these distances.</p>') +
      raw`<p>Let \(d\) be the dimension and \(F\) the number of <strong>facets</strong>: boundary faces of dimension \(d-1\) (edges in 2D, faces in 3D).</p>` +
      box(raw`<p><strong>Hirsch conjecture:</strong> in a bounded polytope, any two vertices can be connected by at most \(F-d\) edges.</p><div class="l10-math">\[\operatorname{diameter}\le F-d.\]</div>`, 'green'),
      `<figure class="l10-figure">${diameterSvg().replace('cycle: D = 4 = floor(m / 2) · m = 8', '2D octagon: 8 facets')}<figcaption>` + raw`\[\underbrace{4}_{\text{actual diameter}}\le\underbrace{8-2=6}_{\text{proposed bound}}.\]` + '</figcaption></figure>'),
  },
  hirsch: {
    title: 'A counterexample to the Hirsch conjecture',
    html: box(raw`<p><strong>The proposed bound:</strong> \(\operatorname{diameter}\le F-d\) for a bounded polytope.</p>`) +
      box(raw`<h3>Santos’s counterexample</h3><p>A bounded <strong>43-dimensional polytope with 86 facets</strong> has</p><div class="l10-math">\[\operatorname{diameter}>43=86-43=F-d.\]</div><p>Some pair of vertices needs more than 43 edges, even along a shortest path.</p>`, 'orange') +
      box('<p><strong>Conclusion:</strong> the proposed linear bound is false. This does not establish exponential diameter or rule out polynomial-time LP algorithms.</p>', 'green') +
      '<p>Graph diameter concerns the <strong>shortest available paths</strong>. A pivot rule may choose a longer route.</p>' +
      '<p class="l10-note">Announced in 2010; published in 2012. <a href="https://arxiv.org/abs/1006.2814">Santos, <em>A counterexample to the Hirsch conjecture</em></a>.</p>',
    sourceRefs: [{ title: 'Santos (2012), A counterexample to the Hirsch conjecture', url: 'https://doi.org/10.4007/annals.2012.176.1.7' }],
  },
  'complete-story': {
    title: 'Three ideas to carry into duality',
    html: raw`<div class="l10-stack">
      ${box('<h3>A pivot changes a basis</h3><p>In the column picture, a positive improving step lowers the attainable cost above the same target. Degeneracy can leave that cost unchanged.</p>')}
      ${box('<h3>Termination and speed are different questions</h3><p>Work per pivot, number of pivots, and the shortest available path measure different things.</p>', 'orange')}
      ${box('<h3>A new question: how can we certify the answer?</h3><p>Duality will construct bounds on every feasible objective value. Matching a bound with a feasible solution will certify optimality.</p>', 'green')}
      <p>Simplex and interior-point methods take different routes to an optimal solution. We will return to interior-point methods later in the course.</p>
    </div>`,
  },
};

export const hirschAudit = { dimension: 43, facets: 86, proposedBound: 43,
  diameterStrictlyGreaterThan: 43, announced: 2010, published: 2012, bounded: true };
