/** LP algorithm history and exact two-dimensional method illustrations. */
const raw = String.raw;
const refs = {
  dantzig: { title: 'Dantzig, Origins of the Simplex Method', url: 'https://archive.computerhistory.org/resources/access/text/2024/06/102739347-05-0002-acc.pdf#page=169' },
  khachiyan: { title: 'Khachiyan’s 1979 result: contemporary announcement', url: 'https://pubsonline.informs.org/doi/abs/10.1287/moor.5.1.iv' },
  karmarkar: { title: 'Karmarkar (1984), A New Polynomial-Time Algorithm', url: 'https://www.stat.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf' },
  ellipsoid: { title: 'Stanford: the ellipsoid method', url: 'https://stanford.edu/class/ee364b/lectures/ellipsoid_method_notes.pdf' },
  barrier: { title: 'Boyd–Vandenberghe: barrier methods and the central path', url: 'https://web.stanford.edu/class/ee364a/lectures/barrier.pdf' },
  solvers: { title: 'Gurobi: choosing an LP solution method', url: 'https://docs.gurobi.com/projects/optimizer/en/current/concepts/parameters/guidelines.html' },
};
const sourceLabels = { dantzig: 'Dantzig’s account', khachiyan: 'Khachiyan (1979)', karmarkar: 'Karmarkar (1984)', ellipsoid: 'Ellipsoid notes', barrier: 'Barrier methods and the central path', solvers: 'LP solver guide' };
const sources = names => `<p class="l12-history-sources">Study sources: ${names.map(name => `<a href="${refs[name].url}" title="${refs[name].title}">${sourceLabels[name]}</a>`).join(' · ')}</p>`;
const box = (html, tone = 'blue', step) => `<section class="l10-box" data-tone="${tone}"${step ? ` data-reveal="${step}"` : ''}>${html}</section>`;
const model = () => raw`<p class="l12-history-model">Same LP in both pictures: \(\min f=-x_1-x_2,\quad 0\le x_1\le2,\quad0\le x_2\le1.\)</p>`;
const svgText = (x, y, text, cls = '', extra = '') => `<text x="${x}" y="${y}"${cls ? ` class="${cls}"` : ''} ${extra}>${text}</text>`;
const fmt = x => Number(x.toFixed(6));
const pointString = points => points.map(p => p.map(fmt).join(',')).join(' ');

function ellipsoidPanel(updated) {
  const left = updated ? 560 : 0;
  const project = ([x, y]) => [left + 200 + 70 * x, 320 - 70 * y];
  const c = project([1, 1.5]), next = project([1, 5 / 6]);
  const rectangle = [[0, 0], [2, 0], [2, 1], [0, 1]].map(project);
  const old = `<circle cx="${c[0]}" cy="${c[1]}" r="140" class="l12-ellipse-old"${updated ? ' stroke-dasharray="7 6"' : ''}/>`;
  const retained = `M${c[0] - 140},${c[1]} A140,140 0 0,0 ${c[0] + 140},${c[1]} Z`;
  return `<g data-ellipsoid-state="${updated ? 'after' : 'before'}"${updated ? ' data-reveal="1"' : ''}>
    ${svgText(left + 280, 30, updated ? '2. Enclose the retained half' : '1. Cut through the current center', 'l12-svg-heading', 'text-anchor="middle"')}
    ${old}<path d="${retained}" fill="#fff0df" stroke="none"/>
    ${updated ? `<ellipse cx="${next[0]}" cy="${next[1]}" rx="${70 * 4 / Math.sqrt(3)}" ry="${70 * 4 / 3}" class="l12-ellipse-new"/>` : ''}
    <polygon points="${pointString(rectangle)}" class="l12-method-region"/>
    <line x1="${c[0] - 150}" x2="${c[0] + 150}" y1="${c[1]}" y2="${c[1]}" class="l12-central-cut"/>
    ${svgText(left + 104, c[1] - 13, 'x₂ = 1.5', '', 'text-anchor="end"')}
    <circle cx="${c[0]}" cy="${c[1]}" r="7" class="l12-old-center"/>
    ${updated ? `<circle cx="${next[0]}" cy="${next[1]}" r="7" class="l12-new-center"/>${svgText(next[0] + 13, next[1] - 13, 'new center')}` : svgText(c[0] + 13, c[1] - 13, 'outside the feasible set')}
    ${svgText(left + 270, 304, 'feasible set', '', 'text-anchor="middle"')}
    ${svgText(left + 448, 264, 'x₂ = 1', '', 'text-anchor="start"')}
    <line x1="${left + 344}" y1="250" x2="${left + 437}" y2="255" class="l12-label-line"/>
    ${svgText(left + 200, 348, '0', '', 'text-anchor="middle"')}${svgText(left + 340, 348, '2', '', 'text-anchor="middle"')}
    ${svgText(left + 385, 343, 'x₁')}
  </g>`;
}
function ellipsoidFigure() {
  return `<figure class="l10-figure l12-history-ellipsoid">
    <svg viewBox="0 0 560 365" role="img" aria-label="The enclosing circle has an infeasible center at (1,1.5). A horizontal central cut keeps its lower half, which contains every feasible point.">${ellipsoidPanel(false)}</svg>
    <svg viewBox="560 0 560 365" role="img" aria-label="The new ellipse centered at (1,5/6) contains the entire retained half of the old circle, with about 77 percent of its area.">${ellipsoidPanel(true)}</svg>
  </figure>`;
}

export function barrierPoint(mu) {
  // Rationalized roots retain accuracy when mu is large.
  return [1 + 1 / (Math.sqrt(1 + mu * mu) + mu), .5 + .25 / (Math.sqrt(.25 + mu * mu) + mu)];
}
const mus = [2, .5, .1, .02];
const samples = mus.map(mu => ({ mu, point: barrierPoint(mu) }));
const edgePath = [[0, 0], [2, 0], [2, 1]];
function interiorFigure() {
  const project = ([x, y]) => [66 + 205 * x, 305 - 205 * y];
  const polygon = [[0, 0], [2, 0], [2, 1], [0, 1]].map(project);
  const path = Array.from({ length: 150 }, (_, i) => barrierPoint(10 ** (2 - i * 5 / 149))).map(project);
  const optimal = project([2, 1]);
  const offsets = [[-13, 32, 'end'], [-12, 34, 'end'], [-12, 49, 'end'], [-12, -15, 'end']];
  return `<figure class="l10-figure l12-history-interior"><svg viewBox="0 0 560 410" role="img" aria-label="For the rectangle LP, an orange simplex edge path goes from (0,0) through (2,0) to the optimum (2,1). Green points on the log-barrier central path approach that same optimum through the strict interior as mu decreases.">
    <polygon points="${pointString(polygon)}" class="l12-method-region"/>
    <line x1="50" y1="305" x2="530" y2="305" class="l12-method-axis"/>
    <line x1="66" y1="323" x2="66" y2="50" class="l12-method-axis"/>
    <polyline points="${pointString(edgePath.map(project))}" class="l12-simplex-path"/>
    <path d="M250,298 L263,305 L250,312 M469,207 L476,194 L483,207" fill="none" stroke="#b74b00" stroke-width="4"/>
    <g data-reveal="1"><polyline points="${pointString(path)}" class="l12-barrier-path"/>
    ${samples.map(({ mu, point }, i) => { const [x, y] = project(point), [dx, dy, anchor] = offsets[i]; return `<circle data-barrier-mu="${mu}" data-world-x="${point[0]}" data-world-y="${point[1]}" cx="${x}" cy="${y}" r="6" class="l12-barrier-sample"/>${i === 1 ? '' : svgText(x + dx, y + dy, `μ = ${mu}`, '', `text-anchor="${anchor}"`)}`; }).join('')}
    </g><circle cx="${optimal[0]}" cy="${optimal[1]}" r="8" class="l12-method-optimum"/>
    ${svgText(468, 60, '(2, 1): f = −3', 'l12-svg-optimum', 'text-anchor="end"')}
    ${svgText(55, 337, '0', '', 'text-anchor="end"')}${svgText(476, 337, '2', '', 'text-anchor="middle"')}
    ${svgText(50, 108, '1', '', 'text-anchor="end"')}${svgText(518, 337, 'x₁')}${svgText(46, 51, 'x₂')}
    <line x1="72" y1="373" x2="109" y2="373" class="l12-simplex-path"/>${svgText(121, 382, 'edge path')}
    <g data-reveal="1"><line x1="293" y1="373" x2="330" y2="373" class="l12-barrier-path"/>${svgText(342, 382, 'central path')}</g>
  </svg></figure>`;
}

const slide = (key, title, html, sourceNames) => ({ key, id: `l10-${key}`, title,
  className: 'l10-history-slide', referencePages: [], sourceRefs: sourceNames.map(name => refs[name]), html });

export const historySlides = [
  slide('history-milestones', 'Three milestones in solving linear programs', raw`
    <p>Can algorithms that do not follow polytope edges offer polynomial-time guarantees? The key breakthroughs came before the Hirsch counterexample.</p>
    <ol class="l12-history-timeline">
      <li><strong class="l12-history-year">1947</strong><div><h3>Dantzig: simplex</h3><p>Change one basis at a time. This becomes a major practical method for solving LPs.</p></div></li>
      <li data-reveal="1"><strong class="l12-history-year">1979</strong><div><h3>Khachiyan: ellipsoid method</h3><p>LP can be solved in time polynomial in the <strong>binary input length</strong>, including the bits used to encode rational coefficients.</p></div></li>
      <li data-reveal="2"><strong class="l12-history-year">1984</strong><div><h3>Karmarkar: an interior-point breakthrough</h3><p>A new polynomial-time algorithm uses projective transformations and interior steps, opening a different algorithmic direction.</p></div></li>
    </ol>
    ${sources(['dantzig', 'khachiyan', 'karmarkar'])}`, ['dantzig', 'khachiyan', 'karmarkar']),
  slide('ellipsoid-idea', 'Ellipsoid: shrink a region that still contains the answer', raw`
    ${model()}
    <p>The current center violates \(x_2\le1\). Keep the lower half through that center; every feasible point remains.</p>
    ${ellipsoidFigure()}
    ${box('Enclose the <strong>entire retained half</strong> in about 77% of the old area. Centers need not be feasible; at a feasible center, keep points with no worse objective.', 'green', '1')}
    ${sources(['ellipsoid'])}`, ['ellipsoid']),
  slide('interior-point-idea', 'Interior points can approach the same optimum', raw`
    ${model()}
    <div class="l10-pair l12-history-interior-pair"><div>
      ${box('<strong>Orange:</strong> one improving simplex route follows two edges to the optimum.')}
      ${box(raw`<strong>Green:</strong> a barrier penalizes approaching the boundary. For each \(\mu>0\), minimize cost plus this penalty.`, 'green', '1')}
      <p data-reveal="1">As \(\mu\) decreases, these <strong>barrier minimizers</strong> approach \((2,1)\). Their curve is the <strong>central path</strong>.</p>
      <p class="l12-history-note" data-reveal="1">These are exact barrier minimizers, not recorded algorithm steps. This illustrates the barrier approach, rather than Karmarkar’s particular algorithm.</p>
    </div>${interiorFigure()}</div>
    <p class="l12-history-barrier" data-reveal="1">Barrier shown: \(\Phi_\mu(x)= -x_1-x_2-\mu\log\!\left[x_1(2-x_1)x_2(1-x_2)\right].\)</p>
    ${sources(['barrier'])}`, ['barrier']),
  slide('algorithm-choice', 'Theory and practical speed answer different questions', raw`
    <table class="l10-table l12-history-comparison"><thead><tr><th scope="col">Method</th><th scope="col">What it gives us</th><th scope="col">How to interpret it</th></tr></thead><tbody>
      <tr><th scope="row">Simplex</th><td>Basis changes and an optimal dictionary.</td><td>Widely used in practice; some pivot rules have exponential worst cases.</td></tr>
      <tr><th scope="row">Ellipsoid</th><td>A polynomial-time guarantee for rational LPs.</td><td>A landmark in complexity theory; usually not the practical LP method of choice.</td></tr>
      <tr><th scope="row">Interior-point</th><td>Polynomial-time methods and practical barrier solvers.</td><td>Modern solvers offer both simplex and barrier; which is faster depends on the problem.</td></tr>
    </tbody></table>
    ${box('<strong>Three separate ideas:</strong> avoiding cycling, bounding worst-case work, and solving a particular LP quickly.', 'green', '1')}
    <p>Later in the course, we will study the interior-point idea conceptually. For now, keep these different goals separate.</p>
    ${sources(['karmarkar', 'solvers'])}`, ['karmarkar', 'solvers']),
];

export const auditData = {
  model: { sense: 'min', c: [-1, -1], A: [[-1, 0], [1, 0], [0, -1], [0, 1]], b: [0, 2, 0, 1], vertices: [[0, 0], [2, 0], [2, 1], [0, 1]], optimum: [2, 1], optimumValue: -3 },
  ellipsoid: { initial: { center: [1, 3 / 2], shape: [[4, 0], [0, 4]] },
    cut: { a: [0, 1], rhs: 3 / 2, retainedSide: '<=' },
    updated: { center: [1, 5 / 6], shape: [[16 / 3, 0], [0, 16 / 9]] }, areaRatio: 4 / (3 * Math.sqrt(3)) },
  barrier: { formula: '-x1-x2-mu*log(x1*(2-x1)*x2*(1-x2))',
    minimizer: ['1-mu+sqrt(1+mu^2)', '1/2-mu+sqrt(1/4+mu^2)'], samples, edgePath },
  history: [{ year: 1947, method: 'simplex', name: 'Dantzig' }, { year: 1979, method: 'ellipsoid', name: 'Khachiyan' }, { year: 1984, method: 'projective interior-point', name: 'Karmarkar' }],
};
