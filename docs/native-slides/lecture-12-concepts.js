/** Short conceptual classroom route; complete calculations remain in the appendix. */
import { columnFigure, mountColumnGeometry } from './lecture-11-geometry.js';
import { diameterSvg } from './lecture-11-efficiency.js';
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
  'perturbed-cube': { title: 'Can an improving path visit every corner?' },
  diameter: {
    title: 'A short available path is different from the path we choose',
    html: pair(raw`<p>Join vertices that share an edge. The <strong>graph diameter</strong> is the largest shortest-path distance between two vertices.</p>
      ${box('<p>For this octagon, the farthest pair is four edges apart. Its graph diameter is 4.</p>')}
      ${box('<p>These shortest paths need not improve the objective. A pivot rule may follow a longer route.</p>', 'orange')}
      <p>How large can this diameter be in higher dimensions?</p>`, `<figure class="l10-figure">${diameterSvg()}</figure>`),
  },
  hirsch: {
    title: 'The Hirsch conjecture is false—even for bounded polytopes',
    html: raw`<p>For a bounded polytope of dimension \(d\) with \(F\) facets, the conjecture proposed</p>
      ${box(raw`<div class="l10-math">\[\text{graph diameter}\le F-d.\]</div><p>A facet is a boundary face of dimension \(d-1\).</p>`)}
      ${box(raw`<h3>Santos’s counterexample</h3><p>Announced in 2010; published in 2012. A <strong>43-dimensional polytope with 86 facets</strong> has diameter greater than</p><div class="l10-math">\[86-43=43.\]</div>`, 'orange')}
      ${box('<p>This disproves the proposed linear bound. It does not rule out polynomial-time LP algorithms or say which path simplex will follow.</p>', 'green')}
      <p class="l10-note"><a href="https://arxiv.org/abs/1006.2814">Santos, <em>A counterexample to the Hirsch conjecture</em></a>. This later result updates the textbook discussion.</p>`,
    sourceRefs: [{ title: 'Santos (2012), A counterexample to the Hirsch conjecture', url: 'https://doi.org/10.4007/annals.2012.176.1.7' }],
  },
  'complete-story': {
    title: 'Three ideas to carry into duality',
    html: raw`<div class="l10-stack">
      ${box('<h3>A pivot changes a basis</h3><p>In the column picture, a positive improving step lowers the attainable cost above the same target. Degeneracy can leave that cost unchanged.</p>')}
      ${box('<h3>Termination and speed are different questions</h3><p>Work per pivot, number of pivots, and the shortest available path measure different things.</p>', 'orange')}
      ${box('<h3>A bound can certify the answer</h3><p>Our final supporting plane proved that no feasible mixture could cost less. Duality will turn this bounding idea into another LP.</p>', 'green')}
      <p>Simplex and interior-point methods take different routes to an optimal solution. We will return to interior-point methods later in the course.</p>
    </div>`,
  },
};

export const hirschAudit = { dimension: 43, facets: 86, proposedBound: 43,
  diameterStrictlyGreaterThan: 43, announced: 2010, published: 2012, bounded: true };
