/** Part 2 §3.7. Exact cube models; reference PDF pages 121–154. */
const raw = String.raw;
const box = (s, tone = 'blue', reveal = '') => `<div class="l10-box" data-tone="${tone}" ${reveal ? `data-reveal="${reveal}"` : ''}>${s}</div>`;
const slide = (key, title, html, referencePages, extra = {}) => ({key, title, html, referencePages, ...extra});

export function grayPath(n) {
  if (n === 1) return [[0], [1]];
  const previous = grayPath(n - 1);
  return [...previous.map(v => [...v, 0]), ...previous.slice().reverse().map(v => [...v, 1])];
}
export function cubeVertex(bits, epsilon = 0) {
  const x = [];
  bits.forEach((bit, i) => {
    const lower = i ? epsilon * x[i - 1] : epsilon;
    const upper = i ? 1 - epsilon * x[i - 1] : 1;
    x.push(bit ? upper : lower);
  });
  return x;
}
const fmt = n => Number(n.toFixed(4)).toString();
const path2 = grayPath(2);
const path3 = grayPath(3);
function squareSvg(epsilon = 0, step = 3, shortcut = false) {
  const points = path2.map(v => cubeVertex(v, epsilon));
  const project = ([x,y]) => [65 + 310*x, 340 - 280*y];
  const p = points.map(project);
  const line = (a,b,color,width=5,dash='') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
  const edgeLabels = epsilon ? `<text x="116" y="43">upper: 1 − εx₁</text><text x="116" y="378">lower: εx₁</text><text x="4" y="198">x₁=ε</text><text x="383" y="198">x₁=1</text>` : '';
  return `<svg viewBox="0 0 460 405" role="img" aria-label="${epsilon ? 'Perturbed cube: three strictly improving edges, or a direct one-edge shortcut' : 'A square spanning path visits all four vertices'}" data-l10-square-epsilon="${epsilon}">
    <polygon points="${p.map(q=>q.join(',')).join(' ')}" fill="#d9edf5" stroke="#2c6a88" stroke-width="3"/>
    ${p.slice(1).map((q,i)=>line(p[i],q,i<step?'#c45408':'#aebbc1',i<step?7:2)).join('')}
    ${shortcut ? line(p[0],p[3],'#237e46',7,'9 5') : ''}
    ${p.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="7" fill="${i===step?'#8b2047':'white'}" stroke="#8b2047" stroke-width="3"/><text data-l10-square-label="${i}" x="${q[0]+(i===1||i===2?-15:15)}" y="${q[1]+(epsilon&&i===0?-36:epsilon&&i===3?50:i<2?-15:25)}" text-anchor="${i===1||i===2?'end':'start'}">${i}: (${points[i].map(fmt).join(', ')})</text>`).join('')}
    ${edgeLabels}<text x="190" y="402">minimize f = −x₂</text>
  </svg>`;
}
function cubeSvg(epsilon = 0, step = 7, yaw = -.62, pitch = .38) {
  const vertices = path3.map(v=>cubeVertex(v,epsilon));
  const project = v => {
    const x=v[0]-.5,y=v[1]-.5,z=v[2]-.5;
    const a=x*Math.cos(yaw)-y*Math.sin(yaw), b=x*Math.sin(yaw)+y*Math.cos(yaw);
    return [240+220*a,215-210*(z*Math.cos(pitch)-b*Math.sin(pitch)),b*Math.cos(pitch)+z*Math.sin(pitch)];
  };
  const points=vertices.map(project);
  const edges=[];
  path3.forEach((v,i)=>path3.forEach((w,j)=>{if(j>i&&v.reduce((n,b,k)=>n+(b!==w[k]),0)===1)edges.push([i,j]);}));
  const line=(i,j,color,width,dash='')=>`<line x1="${points[i][0]}" y1="${points[i][1]}" x2="${points[j][0]}" y2="${points[j][1]}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const ordered=points.map((p,i)=>({p,i})).sort((a,b)=>a.p[2]-b.p[2]);
  return `<svg class="l10-cube-svg" viewBox="0 0 480 405" role="img" tabindex="0" aria-label="Rotatable ${epsilon?'perturbed':'unit'} cube. Drag or use arrow keys to rotate. The path visits all eight vertices." data-l10-cube-epsilon="${epsilon}" data-l10-cube-step="${step}" data-yaw="${yaw}" data-pitch="${pitch}">
    ${edges.map(([i,j])=>line(i,j,'#a0b0b8',2,'5 4')).join('')}
    ${path3.slice(1).map((_,i)=>line(i,i+1,i<step?'#c45408':'#d0d9de',i<step?6:2)).join('')}
    ${ordered.map(({p,i})=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===step?9:5}" fill="${i===step?'#8b2047':'#fff'}" stroke="#8b2047" stroke-width="2"/><text data-l10-cube-label="${i}" x="${p[0]+11}" y="${p[1]+(p[1]>350?-12:i%2?18:-11)}">${i}</text>`).join('')}
    <text x="16" y="385">orange: visited edges · ring: current vertex</text>
  </svg>`;
}
function cubeWidget(epsilon=0) {
  return `<figure class="l10-figure" data-l10-cube-widget data-epsilon="${epsilon}"><div data-l10-cube-view>${cubeSvg(epsilon)}</div><div class="l10-controls" data-screen-only><label>Vertex <input data-cube-step type="range" min="0" max="7" value="7" step="1"></label><button type="button" data-cube-reset>Reset view</button></div><p data-cube-status class="l10-caption" role="status">${cubeStatus(epsilon,7)}</p></figure>`;
}
function cubeStatus(epsilon,step) {
  const point=cubeVertex(path3[step],epsilon);
  return `Vertex ${step} of 7; x = (${point.map(fmt).join(', ')}); f = ${fmt(-point[2])}.`;
}
function perturbedSpaceHtml(print = false) {
  return raw`<div class="l10-pair"><div><p>Use the same inequalities with \(n=3\) and \(\epsilon=0.2\).</p>
    <p>${print ? 'The figure shows the complete path from vertex 0 to vertex 7.' : 'Move the vertex slider to follow the path.'} The objective \(f=-x_3\) decreases at every step.</p>
    ${box(raw`The path visits all 8 vertices. In dimension \(n\), it visits all \(2^n\) vertices.`)}
    ${print ? '' : '<p class="l10-note">Drag the figure or use its arrow keys to see edges hidden by the initial view.</p>'}
    </div>${cubeWidget(.2)}</div>`;
}
function mountCube({slideElement}) {
  const root=slideElement.querySelector('[data-l10-cube-widget]');
  if(!root)return;
  const epsilon=Number(root.dataset.epsilon), view=root.querySelector('[data-l10-cube-view]');
  const slider=root.querySelector('[data-cube-step]'), reset=root.querySelector('[data-cube-reset]');
  let step=7,yaw=-.62,pitch=.38,pointer=null;
  const render=()=>{
    // Keep the SVG element and its focus/pointer capture; replace only primitives.
    const temp=document.createElement('div');temp.innerHTML=cubeSvg(epsilon,step,yaw,pitch);
    const svg=view.querySelector('svg');svg.innerHTML=temp.firstElementChild.innerHTML;
    svg.dataset.l10CubeStep=String(step);svg.dataset.yaw=String(yaw);svg.dataset.pitch=String(pitch);
    root.querySelector('[data-cube-status]').textContent=cubeStatus(epsilon,step);
  };
  const svg=view.querySelector('svg');
  const input=()=>{step=Number(slider.value);render();};
  const down=e=>{pointer={id:e.pointerId,x:e.clientX,y:e.clientY};svg.setPointerCapture(e.pointerId);};
  const move=e=>{if(!pointer||pointer.id!==e.pointerId)return;yaw+=(e.clientX-pointer.x)*.01;pitch=Math.max(-1.1,Math.min(1.1,pitch+(e.clientY-pointer.y)*.01));pointer.x=e.clientX;pointer.y=e.clientY;render();};
  const up=e=>{if(pointer?.id===e.pointerId){if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);pointer=null;}};
  const key=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();yaw+=(e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0);pitch=Math.max(-1.1,Math.min(1.1,pitch+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));render();};
  const resetView=()=>{yaw=-.62;pitch=.38;render();};
  slider.addEventListener('input',input);reset.addEventListener('click',resetView);
  svg.addEventListener('pointerdown',down);svg.addEventListener('pointermove',move);svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);svg.addEventListener('keydown',key);
  return ()=>{slider.removeEventListener('input',input);reset.removeEventListener('click',resetView);svg.removeEventListener('pointerdown',down);svg.removeEventListener('pointermove',move);svg.removeEventListener('pointerup',up);svg.removeEventListener('pointercancel',up);svg.removeEventListener('keydown',key);};
}
function diameterSvg(unbounded=false) {
  const pts=unbounded?Array.from({length:7},(_,i)=>[65+53*i,315-23*(i-3)**2]):Array.from({length:8},(_,i)=>[230+145*Math.cos(i*Math.PI/4),200+145*Math.sin(i*Math.PI/4)]);
  const start=0,end=unbounded?6:4;
  return `<svg viewBox="0 0 460 400" role="img" aria-label="${unbounded?'Eight-facet unbounded polygon: seven vertices form a chain of six edges':'Eight-facet bounded polygon: opposite vertices are four edges apart'}">
    <defs><marker id="l10-ray-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#2c6a88"/></marker></defs>
    ${unbounded?`<polygon points="55,20 ${pts.map(p=>p.join(',')).join(' ')} 393,20" fill="#d9edf5"/><polyline marker-start="url(#l10-ray-arrow)" marker-end="url(#l10-ray-arrow)" points="55,20 ${pts.map(p=>p.join(',')).join(' ')} 393,20" fill="none" stroke="#2c6a88" stroke-width="4"/>`:`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="#d9edf5" stroke="#2c6a88" stroke-width="4"/>`}
    <polyline points="${pts.slice(start,end+1).map(p=>p.join(',')).join(' ')}" fill="none" stroke="#c45408" stroke-width="7"/>
    ${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${i===start||i===end?'#8b2047':'white'}" stroke="#8b2047" stroke-width="2"/>`).join('')}
    <text x="25" y="385">${unbounded?'chain: D = 6 = m − 2':'cycle: D = 4 = floor(m / 2)'} · m = 8</text>
  </svg>`;
}

export const efficiencySlides=[
  slide('efficiency','How much work does simplex require?',raw`<p>We now know how to start, pivot, and avoid cycling. Termination alone does not tell us how long the algorithm takes.</p>${box(raw`\[\text{total work}\approx\text{work per pivot}\times\text{number of pivots}.\]`)}<p>We will examine both factors, then separate a deliberately difficult LP from typical behavior.</p>`,[121,122]),
  slide('pivot-work','First factor: the work in one pivot',raw`<p>For standard form, let \(m\) be the number of independent equations and \(n\) the number of variables.</p><div class="l10-stack">${box(raw`A full tableau has \(O(mn)\) entries. One pivot updates them by row operations: \(O(mn)\) arithmetic operations.`)}${box(raw`Revised simplex maintains and updates basis factors. Dense worst-case pricing and updates can also cost \(O(mn)\), since \(m\le n\).`,'blue','1')}${box(raw`A fresh dense factorization costs \(O(m^3)\). Sparsity matters; arithmetic counts also omit the bit length of exact numbers.`,'orange','2')}</div>`,[123]),
  slide('pivot-count','Second factor: how many pivots?',raw`<p>Many practical LPs need relatively few pivots. The reference describes counts roughly proportional to problem dimensions as an empirical observation.</p>${box(raw`That observation is not a bound for every LP. The feasible region can have exponentially many vertices.`)}<p data-reveal="1">To show slow behavior, we need more than many vertices: an <strong>improving edge path</strong> that a pivoting rule actually follows.</p>`,[124,125,126]),
  slide('cube-vertices','A cube already has exponentially many corners',raw`<div class="l10-pair"><div><p>Consider the unit cube:</p><div class="l10-math">\[0\le x_i\le1,\quad i=1,\ldots,n.\]</div><p>At a vertex each coordinate is either 0 or 1. There are \(2^n\) binary choices.</p>${box('A spanning path visits every vertex exactly once using edges.')}</div><figure class="l10-figure">${squareSvg()}<figcaption class="l10-caption">In two dimensions: 4 vertices and a path of 3 edges.</figcaption></figure></div>`,[127,128]),
  slide('cube-recursion','Build the path one dimension at a time',raw`<div class="l10-pair"><div><ol><li>Follow the square path on \(x_3=0\).</li><li>Cross one edge to \(x_3=1\).</li><li>Follow the same square path in reverse.</li></ol>${box(raw`\[L_n=2L_{n-1}+1=2^n-1.\]`)}<p>The same construction works recursively in every dimension.</p></div>${cubeWidget()}</div>`,[129],{onMount:mountCube}),
  slide('cube-cost','Why the ordinary cube is not enough',raw`<p>Choose the minimization objective \(f(x)=-x_n\).</p>${box(raw`On the cube, half the vertices have \(f=0\), and half have \(f=-1\).`)}<p>Our spanning path has many edges along which the objective stays constant. It does not yet demonstrate a long sequence of <em>strictly improving</em> pivots.</p>${box('Next we tilt the bounds, so movement in an earlier coordinate changes the possible value of the last coordinate.','orange','1')}`,[130]),
  slide('perturbed-cube','Tilt the cube while keeping its combinatorics',raw`<p>Choose \(0<\epsilon<\tfrac12\) and solve</p><div class="l10-math">\[\begin{aligned}\min\quad &-x_n\\\text{s.t.}\quad &\epsilon\le x_1\le1,\\&\epsilon x_{i-1}\le x_i\le1-\epsilon x_{i-1},\quad i=2,\ldots,n.\end{aligned}\]</div>${box('Each coordinate still has a lower and an upper bound. Their dependence on the previous coordinate makes the long path strictly improve the objective.','blue','1')}`,[131]),
  slide('perturbed-square','See the improvement in two dimensions',raw`<div class="l10-pair"><div><p>Set \(\epsilon=0.2\). Start at the vertex labeled 0 and follow the orange path.</p><div class="l10-math">\[\begin{array}{c|rrrr}\text{vertex}&0&1&2&3\\x_2&.04&.20&.80&.96\\f=-x_2&-.04&-.20&-.80&-.96\end{array}\]</div>${box('All three edge moves strictly decrease the objective. The fourth vertex is optimal.','green')}</div><figure class="l10-figure">${squareSvg(.2)}</figure></div>`,[132,133]),
  slide('perturbed-space','The same construction gives seven improving edges',perturbedSpaceHtml(),[133,134,135],{onMount:mountCube,printHtml:perturbedSpaceHtml(true)}),
  slide('exponential-theorem','Theorem 3.5: an exponential pivot path exists',raw`<p>For the perturbed cube just defined:</p><ol><li>The feasible set has \(2^n\) vertices.</li><li>They can be ordered so consecutive vertices share an edge and the cost strictly decreases.</li><li>A pivoting rule that follows this order takes \(2^n-1\) pivots.</li></ol>${box('This is an existence statement about a bad path and a rule that follows it. It does not say every rule follows that path.','orange','1')}`,[135]),
  slide('cube-proof-vertices','Why there are exactly 2ⁿ vertices',raw`<div class="l10-proof" tabindex="0" role="region" aria-label="Proof of the cube vertex count"><p>Choose a lower or upper bound for each coordinate, starting with \(x_1\).</p>${box(raw`The resulting triangular system has diagonal coefficients 1, so it defines a unique point.`,'blue','1')}${box(raw`Each lower bound is strictly below its upper bound: \(\epsilon x_{i-1}<1-\epsilon x_{i-1}\), since \(x_{i-1}\le1\) and \(\epsilon<\tfrac12\).`,'blue','2')}${box(raw`At most one bound per coordinate can be tight. A vertex needs \(n\) independent tight bounds, hence exactly one per coordinate. Every binary choice gives one distinct vertex.`,'green','3')}</div>`,[135]),
  slide('cube-proof-path','Why reversing the upper path preserves improvement',raw`<div class="l10-proof" tabindex="0" role="region" aria-label="Inductive proof of the improving path"><p>On the lower face, \(x_n=\epsilon x_{n-1}\): increasing \(x_{n-1}\) increases \(x_n\).</p>${box(raw`Cross to the upper face, \(x_n=1-\epsilon x_{n-1}\). This increases \(x_n\), because \(\epsilon x_{n-1}<1-\epsilon x_{n-1}\).`,'blue','1')}${box(raw`Then traverse the previous path backward. Now \(x_{n-1}\) decreases, so \(1-\epsilon x_{n-1}\) increases.`,'blue','2')}${box(raw`Consecutive vertices share \(n-1\) independent tight bounds. They are adjacent, and \(-x_n\) strictly decreases throughout.`,'green','3')}</div>`,[129,135]),
  slide('pivot-shortcut','A different pivot choice can take a shortcut',raw`<div class="l10-pair"><div><p>The first and last vertices of this spanning path are adjacent.</p>${box('Orange: follow the three-edge detour. Green: move directly to the optimum in one pivot.')}<p>The same first-to-last adjacency holds in the higher-dimensional construction.</p><p><strong>Choosing a rule matters.</strong> A long available path does not force every algorithm to use it.</p></div><figure class="l10-figure">${squareSvg(.2,3,true)}</figure></div>`,[136],{checkpoint:{prompt:'What does the perturbed-cube example establish?',choices:['Every pivoting rule needs exponentially many pivots','Some pivoting rule can follow an exponentially long improving path','Simplex can never solve a cube quickly','Avoiding cycling guarantees a short path'],correctIndex:1,explanation:'The construction supplies a long improving path and a rule that follows it. The same starting and optimal vertices are adjacent, allowing another rule to finish in one pivot.',autoOpen:true}}),
  slide('pivot-open-question','Can a pivoting rule always find a short route?',raw`<p>Exponential examples are known for many individual pivoting rules. That does not rule out every possible choice of rule.</p>${box('The general search for a polynomial-time pivot rule remains a central question. A lower bound for one rule is not a lower bound for all rules.')}<p>We next separate two questions: <strong>does a short path exist?</strong> And <strong>can an algorithm find an improving one efficiently?</strong></p><p class="l10-note">See <a href="https://arxiv.org/abs/2502.18019">Disser and Mosis (2025)</a> for the scope of this open question.</p>`,[137,138]),
  slide('diameter','Measure the shortest paths in the vertex graph',raw`<p>For a nonempty pointed polyhedron with vertices \(v,w\), let \(d(v,w)\) be the <strong>minimum number of edges</strong> in a path joining them.</p>${box(raw`\[D(P)=\max_{v,w\text{ vertices of }P}d(v,w).\]`)}<p>This maximum of shortest-path distances is the <strong>diameter</strong> of the polyhedron's vertex-edge graph.</p>${box('Distance counts edges, not Euclidean length. The paths in this definition need not improve an objective.','orange','1')}`,[139,140,141]),
  slide('diameter-bounded','In two dimensions, a bounded polygon is a cycle',raw`<div class="l10-pair"><div><p>Here \(m\) counts inequality constraints and \(n\) is the ambient dimension. A bounded full-dimensional polygon has at most \(m\) edges.</p><p>Between two vertices, choose the shorter route around the boundary.</p>${box(raw`\[D(P)\le\left\lfloor\frac m2\right\rfloor.\]`)}<p>The illustrated octagon attains 4.</p></div><figure class="l10-figure">${diameterSvg()}</figure></div>`,[141,143]),
  slide('diameter-unbounded','An unbounded polygon can have a longer chain',raw`<div class="l10-pair"><div><p>For a pointed, full-dimensional unbounded polygon, two boundary edges are rays. The finite vertices form a chain.</p>${box(raw`\[D(P)\le m-2.\]`)}<p>With \(m=8\), the illustrated chain has seven vertices and six finite edges.</p><p>Thus the worst case over bounded and unbounded polygons is \(\Delta(2,m)=m-2\) for \(m\ge3\).</p></div><figure class="l10-figure">${diameterSvg(true)}</figure></div>`,[141,143]),
  slide('diameter-lower-bound','Why diameter constrains every edge-following method',raw`<p>Suppose \(d(v,w)=D(P)\). Start at \(v\), and choose an objective for which \(w\) is the unique optimal vertex.</p>${box(raw`Every edge-following route from \(v\) to \(w\) needs at least \(D(P)\) edge moves.`)}<p>Define \(\Delta(n,m)\) as the largest diameter among pointed \(n\)-dimensional polyhedra described by \(m\) inequalities.</p>${box('A polynomial bound on diameter is necessary for a universally short edge path. It would not by itself tell us how to choose the pivots.','orange','1')}`,[142,143,144]),
  slide('hirsch','The Hirsch conjecture proposed a linear bound',raw`<p>The proposed bound was</p><div class="l10-math">\[\Delta(n,m)\le m-n.\]</div><div class="l10-stack">${box('Klee and Walkup (1967) gave an unbounded-polyhedron counterexample.','blue','1')}${box('Santos announced a bounded-polytope counterexample in 2010, published in 2012. The original Hirsch bound is therefore false even for polytopes.','orange','2')}</div><p class="l10-note"><a href="https://arxiv.org/abs/1006.2814">Santos, A counterexample to the Hirsch conjecture</a>.</p>`,[145,146]),
  slide('polynomial-hirsch','A weaker question asks for a polynomial bound',raw`<p>The <strong>polynomial Hirsch conjecture</strong> asks whether \(\Delta(n,m)\) is bounded by some polynomial in \(n\) and \(m\).</p>${box(raw`A classical bound is \[\Delta(n,m)\le m^{1+\log_2 n}=(2n)^{\log_2 m}.\]`)}<p>The exponent depends on the dimension. This is a quasipolynomial bound, not a polynomial bound jointly in both parameters.</p><p>The false linear conjecture and the weaker polynomial question must be kept separate.</p>`,[147,149]),
  slide('diameter-not-runtime','A short path need not give a fast algorithm',raw`<p>Suppose a polynomial diameter bound were proved. Would that make simplex a polynomial-time algorithm?</p>${box('<strong>No.</strong> Diameter promises some short edge path. It does not promise an improving path, identify the path, or bound the work needed to find it.','green','1')}<p data-reveal="2">Degenerate pivots may also change the basis without traversing an edge to a new vertex. Their number needs its own control.</p>`,[148],{checkpoint:{prompt:'Why would a polynomial diameter bound alone be insufficient to prove simplex runs in polynomial time?',choices:['Diameter counts Euclidean distance','A short graph path need not be improving or efficiently found by the pivot rule','Polyhedra have no vertex graphs','Polynomial diameter implies every path is short'],correctIndex:1,explanation:'Diameter bounds the shortest unrestricted edge paths. A chosen simplex rule follows improving feasible pivots, and may also take degenerate zero steps; neither behavior is bounded by diameter alone.',autoOpen:true}}),
  slide('average','Worst-case behavior does not describe every instance',raw`<p>A worst-case result asks how badly a method can behave. An average-case result asks how it behaves under a specified distribution of inputs.</p>${box('Many LPs encountered in practice require modest pivot counts. The reference describes roughly linear observed counts; these are observations, not universal theorems.')}<p>To turn “usually fast” into a mathematical claim, we must say what <em>usually</em> means.</p>`,[150,151,152]),
  slide('average-distribution','Define the random experiment before taking an average',raw`<ol><li>Fix the problem dimensions and choose a probability distribution over LP data.</li><li>Specify the algorithm, its initialization, and its pivoting rule.</li><li>Let \(T\) count the iterations and study \(\mathbb E[T]\).</li></ol>${box('There is no single natural uniform distribution over all LPs. A result for one random model need not describe a different application.','orange','1')}`,[153]),
  slide('haimovich','One model: randomly orient fixed inequalities',raw`<p>Fix \(c,a_1,\ldots,a_m\in\mathbb R^n\) and \(b_1,\ldots,b_m\). Independently choose, with equal probability,</p><div class="l10-math">\[a_i^\top x\le b_i\quad\text{or}\quad a_i^\top x\ge b_i.\]</div><p>There are \(2^m\) sign choices. Suppose \(L>0\) produce feasible LPs.</p>${box(raw`The reference's Haimovich (1983) result bounds the average by \(n/2\) pivots over those \(L\) feasible problems, for the specially specified pivoting procedure.`,'blue','1')}<p class="l10-note">The distribution and procedure are essential assumptions; this is not a bound for arbitrary simplex implementations.</p>`,[154]),
  slide('smoothed','Smoothed analysis: perturb an arbitrary starting instance',raw`<p>Average-case analysis randomizes the whole input. <strong>Smoothed analysis</strong> starts with arbitrary data and adds small random perturbations.</p>${box(raw`For an appropriate shadow-vertex simplex algorithm, Gaussian perturbation models give polynomial expected complexity in the problem dimensions and \(1/\sigma\), where \(\sigma\) measures the noise scale.`)}<p>This helps explain why carefully constructed difficult instances can be fragile. It does not give every pivoting rule a polynomial worst-case guarantee.</p><p class="l10-note"><a href="https://www.cs.yale.edu/homes/spielman/simplex/">Spielman and Teng, Smoothed Analysis (2004)</a>.</p>`,[152]),
  slide('complete-story','Four questions now form one complete story',raw`<ol><li><strong>Can pivots repeat forever?</strong> Lexicographic and Bland rules prevent cycling.</li><li><strong>How do we start?</strong> Phase I finds a feasible basis or proves infeasibility.</li><li><strong>What is a pivot geometrically?</strong> Replace one basic point. A positive improving step lowers the intersection; a degenerate pivot can leave it unchanged.</li><li><strong>How long can this take?</strong> Count work per pivot and pivots; distinguish worst-case, average-case, and smoothed claims.</li></ol>`,[2,90,118,122,154]),
];
export const auditData={path2,path3,unitVertices:path3.map(v=>cubeVertex(v)),perturbedVertices:path3.map(v=>cubeVertex(v,.2)),epsilon:.2};
