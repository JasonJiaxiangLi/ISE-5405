/** Exact Klee–Minty dictionaries and the Dantzig path, in minimization form. */
const raw = String.raw;
const box = (html, tone = 'blue', reveal = false) => `<section class="l10-box" data-tone="${tone}"${reveal ? ' data-reveal' : ''}>${html}</section>`;
const source = '<a href="https://arxiv.org/html/1910.10097#S4.SS1">Further reading: Klee–Minty variants, §4.1</a>';
const states = [{"step":0,"basis":[4,5,6],"nonbasic":[1,2,3],"values":[5,25,125],"coefficients":[[-1,0,0],[-4,-1,0],[-8,-4,-1]],"objective":0,"reducedCosts":[-4,-2,-1],"point":[0,0,0],"nextPivot":{"entering":1,"leaving":4,"theta":5,"reducedCost":-4}},{"step":1,"basis":[1,5,6],"nonbasic":[2,3,4],"values":[5,5,85],"coefficients":[[0,0,-1],[-1,0,4],[-4,-1,8]],"objective":-20,"reducedCosts":[-2,-1,4],"point":[5,0,0],"nextPivot":{"entering":2,"leaving":5,"theta":5,"reducedCost":-2}},{"step":2,"basis":[1,2,6],"nonbasic":[3,4,5],"values":[5,5,65],"coefficients":[[0,-1,0],[0,4,-1],[-1,-8,4]],"objective":-30,"reducedCosts":[-1,-4,2],"point":[5,5,0],"nextPivot":{"entering":4,"leaving":1,"theta":5,"reducedCost":-4}},{"step":3,"basis":[2,4,6],"nonbasic":[1,3,5],"values":[25,5,25],"coefficients":[[-4,0,-1],[-1,0,0],[8,-1,4]],"objective":-50,"reducedCosts":[4,-1,2],"point":[0,25,0],"nextPivot":{"entering":3,"leaving":6,"theta":25,"reducedCost":-1}},{"step":4,"basis":[2,3,4],"nonbasic":[1,5,6],"values":[25,25,5],"coefficients":[[-4,-1,0],[8,4,-1],[-1,0,0]],"objective":-75,"reducedCosts":[-4,-2,1],"point":[0,25,25],"nextPivot":{"entering":1,"leaving":4,"theta":5,"reducedCost":-4}},{"step":5,"basis":[1,2,3],"nonbasic":[4,5,6],"values":[5,5,65],"coefficients":[[-1,0,0],[4,-1,0],[-8,4,-1]],"objective":-95,"reducedCosts":[4,-2,1],"point":[5,5,65],"nextPivot":{"entering":5,"leaving":2,"theta":5,"reducedCost":-2}},{"step":6,"basis":[1,3,5],"nonbasic":[2,4,6],"values":[5,85,5],"coefficients":[[0,-1,0],[-4,8,-1],[-1,4,0]],"objective":-105,"reducedCosts":[2,-4,1],"point":[5,0,85],"nextPivot":{"entering":4,"leaving":1,"theta":5,"reducedCost":-4}},{"step":7,"basis":[3,4,5],"nonbasic":[1,2,6],"values":[125,5,25],"coefficients":[[-8,-4,-1],[-1,0,0],[-4,-1,0]],"objective":-125,"reducedCosts":[4,2,1],"point":[0,0,125]}];
const bits = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,1,1],[1,1,1],[1,0,1],[0,0,1]];
const vertices = states.map(s => s.point);
const edges = bits.flatMap((v,i) => bits.flatMap((w,j) =>
  j > i && v.filter((b,k) => b !== w[k]).length === 1 ? [[i,j]] : []));
const initialCamera = {yaw:.72, pitch:.42};
const letter = i => 'ABCDEFGH'[i];
const storageKey = 'ise5405:lecture12:klee-minty';
let saved = {step:0, shortcut:false, ...initialCamera};

function expression(constant, coefficients, variables) {
  let text = constant ? String(constant) : '';
  coefficients.forEach((a,i) => {
    if (!a) return;
    const term = `${Math.abs(a) === 1 ? '' : Math.abs(a)}x_{${variables[i]}}`;
    text += a < 0 ? `-${term}` : `${text ? '+' : ''}${term}`;
  });
  return text || '0';
}
function dictionary(state) {
  const rows = state.basis.map((j,i) => `x_{${j}}&=${expression(state.values[i],state.coefficients[i],state.nonbasic)}`);
  rows.push(`f&=${expression(state.objective,state.reducedCosts,state.nonbasic)}`);
  return `<div class="l10-math l12-km-dictionary" data-km-dictionary="${state.step}">\\[\\begin{aligned}${rows.join('\\\\[2pt]')}\\end{aligned}\\]</div>`;
}
function pointSummary(state) {
  return raw`\((x_1,x_2,x_3)=(${state.point.join(',')}),\quad f=${state.objective}\)`;
}
function transition(state) {
  if (!state.step) return raw`Initial basis: \(x_4,x_5,x_6\). No pivot yet.`;
  const p = states[state.step - 1].nextPivot;
  return raw`\(x_{${p.entering}}\) enters, \(x_{${p.leaving}}\) leaves; \(\theta=${p.theta}\).`;
}

function plot(step=0, yaw=initialCamera.yaw, pitch=initialCamera.pitch, interactive=true, shortcut=false) {
  // One affine camera map, shared by vertices, faces, edges, path and labels.
  const project = v => {
    const [x,y,z] = v.map((a,i) => a/[5,25,125][i]-.5);
    const u = x*Math.cos(yaw)-y*Math.sin(yaw), v2 = x*Math.sin(yaw)+y*Math.cos(yaw);
    return [255+205*u,180-170*(z*Math.cos(pitch)-v2*Math.sin(pitch)),v2*Math.cos(pitch)+z*Math.sin(pitch)];
  };
  const points = vertices.map(project), faces = [];
  for (let axis=0;axis<3;axis++) for (let bit=0;bit<2;bit++) {
    const members = bits.map((_,i)=>i).filter(i=>bits[i][axis]===bit), order=[members[0]];
    while (order.length<4) order.push(members.find(i=>!order.includes(i)&&edges.some(([a,b]) =>
      (a===i&&b===order.at(-1))||(b===i&&a===order.at(-1)))));
    faces.push(order);
  }
  faces.sort((a,b)=>a.reduce((sum,i)=>sum+points[i][2],0)-b.reduce((sum,i)=>sum+points[i][2],0));
  const line=(a,b,color,width,dash='',attributes='')=>`<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''} ${attributes}/>`;
  const offsets=[[-18,-12],[12,22],[-14,32],[-14,20],[-14,-12],[-16,-10],[12,-12],[12,-12]];
  return `<svg class="l10-cube-svg l12-km-svg" viewBox="0 0 510 370" role="img"${interactive?' tabindex="0"':''}
      aria-label="Klee–Minty feasible polyhedron. ${interactive?'Drag or use arrow keys to rotate. ':''}A is the start, H is optimal, and ${letter(step)} is the current point."
      data-l12-km-svg data-step="${step}" data-yaw="${yaw}" data-pitch="${pitch}" data-shortcut="${shortcut}">
    <title>Dantzig's seven-pivot path</title><desc>The coordinates and objective values of A through H are listed alongside the figure.</desc>
    ${faces.map(f=>`<polygon points="${f.map(i=>points[i].slice(0,2).join(',')).join(' ')}" fill="#8dc5da" fill-opacity=".14"/>`).join('')}
    ${edges.map(([a,b])=>line(a,b,'#8297a2',2,'',`data-km-edge="${a}-${b}"`)).join('')}
    ${vertices.slice(1).map((_,i)=>line(i,i+1,i<step?'#b54800':'#bc9476',i<step?6:3,i<step?'':'6 5',`data-km-path-edge="${i}" data-visited="${i<step}"`)).join('')}
    ${shortcut?line(0,7,'#237c4b',5,'10 5','data-km-shortcut'):''}
    ${points.map((p,i)=>({p,i})).sort((a,b)=>a.p[2]-b.p[2]).map(({p,i})=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===step?8:4}" fill="${i===step?'#fff':'#2d677f'}" stroke="${i===step?'#8b2047':'#2d677f'}" stroke-width="${i===step?4:1}" data-km-vertex="${i}"/><text x="${p[0]+offsets[i][0]}" y="${p[1]+offsets[i][1]}" text-anchor="${offsets[i][0]<0?'end':'start'}">${letter(i)}</text>`).join('')}
  </svg>`;
}
function widget(print=false) {
  const step = print ? 7 : 0;
  return `<figure class="l10-figure l12-km-figure" data-l12-km-widget>
    <div data-l12-km-view>${plot(step,initialCamera.yaw,initialCamera.pitch,!print,print)}</div>
    <figcaption class="l10-caption">Axes scaled by \\(5,25,125\\). ${print?'Ring: current.':'Drag / arrow keys rotate.'}</figcaption>
    ${print?'':`<div class="l10-controls l12-km-controls" data-screen-only>
      <label>Pivot <input data-l12-km-step type="range" min="0" max="7" value="0" step="1" aria-label="Dantzig pivot number"></label>
      <button type="button" data-l12-km-previous>Previous</button><button type="button" data-l12-km-next>Next pivot</button>
      <button type="button" data-l12-km-reset>Reset view</button></div>`}
    <p class="l10-caption l12-km-shortcut-note">Shortcut: \\(x_3\\) enters, \\(x_6\\) leaves, \\(\\theta=125\\).</p>
  </figure>`;
}
function pathStatus(print=false) {
  const step=print?7:0;
  return `<div class="l12-km-status" role="status" aria-live="polite" data-l12-km-status>
    ${states.filter(s=>!print||s.step===7).map(s=>`<div data-km-status-step="${s.step}"${s.step===step?'':' hidden'}><p><strong>Pivot ${s.step} of 7 · ${letter(s.step)}:</strong> ${transition(s)}</p></div>`).join('')}</div>`;
}
function pathHtml(print=false) {
  return raw`${pathStatus(print)}
    <div class="l10-pair l12-km-path-pair"><div>
      <table class="l10-table l12-km-path-table" aria-label="All eight vertices on Dantzig's path"><thead><tr><th scope="col">Point</th><th scope="col">\((x_1,x_2,x_3)\)</th><th scope="col">\(f\)</th></tr></thead><tbody>
      ${states.map(s=>`<tr data-km-state-row="${s.step}"><th scope="row">${letter(s.step)}</th><td>\\((${s.point.join(',')})\\)</td><td>\\(${s.objective}\\)</td></tr>`).join('')}</tbody></table>
      ${print?'':`<div class="l10-controls"><label class="l12-km-shortcut-toggle"><input type="checkbox" data-l12-km-shortcut>Show one-pivot shortcut</label></div>`}
      <p>A: start · H: optimum. <strong>No cycling.</strong></p>
    </div>${widget(print)}</div>`;
}
function mountPath({slideElement}) {
  const root = slideElement.querySelector('[data-l12-km-widget]'), slider = root?.querySelector('[data-l12-km-step]');
  if (!slider) return;
  const svg=root.querySelector('[data-l12-km-svg]'), previous=root.querySelector('[data-l12-km-previous]'), next=root.querySelector('[data-l12-km-next]'), reset=root.querySelector('[data-l12-km-reset]'), shortcut=slideElement.querySelector('[data-l12-km-shortcut]');
  try {
    const stored=JSON.parse(sessionStorage.getItem(storageKey));
    if (stored&&Number.isInteger(stored.step)&&stored.step>=0&&stored.step<=7&&Number.isFinite(stored.yaw)&&Number.isFinite(stored.pitch)) saved=stored;
  } catch (_) { /* The controls also work when browser storage is disabled. */ }
  const state={...saved}; let pointer=null;
  const render = () => {
    const temp=document.createElement('div'); temp.innerHTML=plot(state.step,state.yaw,state.pitch,true,Boolean(state.shortcut));
    svg.innerHTML=temp.firstElementChild.innerHTML;
    for (const key of ['step','yaw','pitch']) svg.dataset[key]=String(state[key]);
    svg.dataset.shortcut=String(Boolean(state.shortcut));shortcut.checked=Boolean(state.shortcut);
    svg.setAttribute('aria-label',temp.firstElementChild.getAttribute('aria-label'));
    slider.value=String(state.step); slider.setAttribute('aria-valuetext',`Pivot ${state.step} of 7, point ${letter(state.step)}, objective ${states[state.step].objective}`);
    previous.disabled=state.step===0; next.disabled=state.step===7;
    slideElement.querySelectorAll('[data-km-status-step]').forEach(el=>{el.hidden=Number(el.dataset.kmStatusStep)!==state.step;});
    slideElement.querySelectorAll('[data-km-state-row]').forEach(el=>el.toggleAttribute('data-current',Number(el.dataset.kmStateRow)===state.step));
    saved={...state}; try { sessionStorage.setItem(storageKey,JSON.stringify(saved)); } catch (_) { /* Optional persistence. */ }
  };
  const listeners=[];
  const on=(el,event,handler)=>{el.addEventListener(event,handler);listeners.push(()=>el.removeEventListener(event,handler));};
  on(slider,'input',()=>{state.step=Number(slider.value);render();});
  on(shortcut,'change',()=>{state.shortcut=shortcut.checked;render();});
  on(previous,'click',()=>{state.step=Math.max(0,state.step-1);render();});
  on(next,'click',()=>{state.step=Math.min(7,state.step+1);render();});
  on(reset,'click',()=>{Object.assign(state,initialCamera);render();});
  on(svg,'pointerdown',e=>{pointer={id:e.pointerId,x:e.clientX,y:e.clientY};svg.setPointerCapture(e.pointerId);});
  on(svg,'pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;state.yaw+=(e.clientX-pointer.x)*.01;state.pitch=Math.max(-1.1,Math.min(1.1,state.pitch+(e.clientY-pointer.y)*.01));pointer.x=e.clientX;pointer.y=e.clientY;render();});
  const release=e=>{if(pointer?.id===e.pointerId){if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);pointer=null;}};
  on(svg,'pointerup',release);on(svg,'pointercancel',release);
  on(svg,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();state.yaw+=(e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0);state.pitch=Math.max(-1.1,Math.min(1.1,state.pitch+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));render();});
  render();
  return ()=>{listeners.forEach(remove=>remove());if(pointer&&svg.hasPointerCapture(pointer.id))svg.releasePointerCapture(pointer.id);};
}

export const kleeMintyMain = [
  {key:'km-model',id:'l12-km-model',title:'Klee–Minty: Fix the LP and the Pivot Rule',referencePages:[],className:'l12-km-slide l12-km-model',
    html:raw`<p>Minimize \(f=-4x_1-2x_2-x_3\), with \(x_1,x_2,x_3\ge0\), subject to</p>
      <div class="l10-math">\[x_1\le5,\qquad4x_1+x_2\le25,\qquad8x_1+4x_2+x_3\le125.\]</div>
      ${box(raw`<p>Add slacks \(x_4,x_5,x_6\) in row order. The initial dictionary is</p>${dictionary(states[0])}`)}
      ${box(raw`Start at \((0,0,0)\). <strong>Dantzig's rule</strong> enters the most-negative objective coefficient; the ratio test chooses the leaving variable.`, 'green', true)}
      <p class="l10-note">${source}</p>`},
  {key:'km-first-pivot',id:'l12-km-first-pivot',title:'First Pivot: x₁ Has the Most-Negative Reduced Cost',titleHtml:raw`First Pivot: \(x_1\) Has the Most-Negative Reduced Cost`,referencePages:[],className:'l12-km-slide l12-km-first',
    html:raw`<p>The initial reduced costs are \(-4,-2,-1\), so <strong>\(x_1\) enters</strong>.</p>
      ${box(raw`\[\theta=\min\left\{\frac51,\frac{25}4,\frac{125}8\right\}=5:\quad x_4\text{ leaves}.\]`)}
      <div data-reveal><p>Solve \(x_4=5-x_1\) for \(x_1=5-x_4\), then substitute:</p>${dictionary(states[1])}</div>
      ${box(raw`We reach \((5,0,0)\) with \(f=-20\). Next, \(x_2\) has the most-negative reduced cost \(-2\).`,'green',true)}
      <p>Dantzig compares improvement <em>per unit increase</em>, before the ratio test determines the step length.</p>`},
  {key:'km-path',id:'l12-km-path',title:'Dantzig Visits All Eight Vertices',referencePages:[],className:'l12-km-slide l12-km-path',html:pathHtml(),printHtml:pathHtml(true),onMount:mountPath},
  {key:'km-family',id:'l12-km-family',title:'The Same Construction in n Dimensions',titleHtml:raw`The Same Construction in \(n\) Dimensions`,referencePages:[],className:'l12-km-slide l12-km-family',
    html:raw`<p>For \(n\ge3\), minimize \(f=-2^{n-1}x_1-2^{n-2}x_2-\cdots-x_n\), with \(x\ge0\):</p>
      ${box(raw`\[\begin{aligned}x_1&\le5,\\4x_1+x_2&\le5^2,\\8x_1+4x_2+x_3&\le5^3,\\&\ \vdots\\2^nx_1+2^{n-1}x_2+\cdots+4x_{n-1}+x_n&\le5^n.\end{aligned}\]`)}
      <p>Add ordinary slacks \(s_i=x_{n+i}\). Start at \(x=0\), \(s_i=5^i\).</p>
      ${box(raw`The unique optimum is \(x^*=(0,\ldots,0,5^n)\), with \(f^*=-5^n\). All other original variables are zero.`,'green',true)}
      <p class="l10-note">${source}.</p>`},
  {key:'km-count',id:'l12-km-count',title:'A Standard Rule Can Take Exponentially Many Pivots',referencePages:[],className:'l12-km-slide l12-km-count',
    html:raw`${box(raw`<p>For this family, starting at zero with these unscaled variables and slacks:</p>\[\boxed{\text{Dantzig pivot count}=2^n-1.}\]`)}
      <p>Each added dimension doubles the previous path and adds one crossing pivot.</p>
      ${box(raw`\[L_n=2L_{n-1}+1,\qquad L_1=1.\]<p>For \(n=10\): 1,023 pivots.</p>`,'green',true)}
      <p><strong>Rule matters.</strong> On the 3D LP, Bland takes 5 pivots; choosing \(x_3\) first takes 1. In the general LP, choosing \(x_n\) first reaches the optimum directly.</p>
      <p>Every Dantzig step is positive: no cycling. Rescaling variables can change the rule's choices.</p>
      <p class="l10-note">Full dictionaries and counting argument are in the appendix. ${source}.</p>`},
];

const dictionarySlides = states.slice(1).map(state => {
  const before=states[state.step-1],p=before.nextPivot,limiting=before.basis.indexOf(p.leaving);
  const next=state.nextPivot;
  return {key:`km-dictionary-${state.step}`,id:`l12-km-dictionary-${state.step}`,title:`Klee–Minty: Dictionary After Pivot ${state.step}`,referencePages:[],className:'l12-km-slide l12-km-appendix-dictionary',
    html:raw`<p><strong>${transition(state)}</strong> The entering reduced cost was \(${p.reducedCost}\).</p>
      <p>Before the pivot, the limiting row was \(x_{${p.leaving}}=${expression(before.values[limiting],before.coefficients[limiting],before.nonbasic)}\).</p>
      ${box(dictionary(state))}
      <p>Nonbasic variables: \(${state.nonbasic.map(j=>`x_{${j}}`).join(',')}\). Set them to zero:</p>
      ${box(pointSummary(state),'green')}
      ${next?raw`<p><strong>Next pivot:</strong> \(x_{${next.entering}}\) enters because its reduced cost \(${next.reducedCost}\) is the most negative; \(x_{${next.leaving}}\) leaves at \(\theta=${next.theta}\).</p>`:'<p><strong>Optimal:</strong> every nonbasic objective coefficient is positive.</p>'}`};
});
const proofSlides = [
  {key:'km-proof-vertices',id:'l12-km-proof-vertices',title:'Why There Are 2ⁿ Distinct, Nondegenerate Vertices',titleHtml:raw`Why There Are \(2^n\) Distinct, Nondegenerate Vertices`,referencePages:[],className:'l12-km-slide l12-km-proof',
    html:raw`<p>Row \(i\) bounds \(x_i\) between zero and an upper endpoint determined by the earlier coordinates.</p>
      ${box(raw`\[0\le x_i\le W_i,\qquad W_i=5^i-4S_{i-1},\qquad S_{i-1}=\sum_{j\lt i}2^{i-1-j}x_j.\]`)}
      <p>The preceding constraint has coefficients at least those in \(S_{i-1}\), so \(S_{i-1}\le5^{i-1}\). Thus \(W_i\ge5^{i-1}>0\) for \(i\ge2\); \(W_1=5\).</p>
      ${box(raw`<p>Successively choose \(x_i=0\) or \(x_i=W_i\). All \(2^n\) choices are feasible.</p><p>Write \(b_i=0\) for the lower endpoint and \(b_i=1\) for the upper endpoint.</p>`,'green',true)}
      <p>Each choice gives \(n\) triangular equalities and positive basic values. Conversely, a vertex needs \(n\) active bounds, exactly one from each pair \((x_i,s_i)\). These are all the vertices.</p>
      <p>Along each edge, the ratio test exchanges one pair; the other basic variables stay positive.</p>`},
  {key:'km-proof-costs',id:'l12-km-proof-costs',title:'The Reduced Costs Determine Which Edge Dantzig Takes',referencePages:[],className:'l12-km-slide l12-km-proof',
    html:raw`<p>At endpoint choices \(b_1,\ldots,b_n\), let \(v_i\) denote the <em>nonbasic</em> member of \((x_i,s_i)\).</p>
      ${box(raw`\[\bar c(v_i)=(-1)^{1+b_i+\cdots+b_n}\,2^{n-i}.\]`)}
      <div data-reveal><p>To see the sign pattern, eliminate basic original variables from the last row backward. If \(b_i=1\), substitute</p>
      <div class="l10-math">\[x_i=5^i-\sum_{j\lt i}2^{i-j+1}x_j-s_i.\]</div>
      <p>Its coefficient changes sign when transferred to \(s_i\). For each earlier \(x_j\), the substitution subtracts twice its current coefficient, reversing that sign too. If \(b_i=0\), the basic slack does not affect the objective.</p></div>
      ${box(raw`Thus \(v_i\) improves the objective exactly when \(b_i+\cdots+b_n\) is even. The distinct magnitudes \(2^{n-i}\) make Dantzig choose the <strong>smallest such index \(i\)</strong>.`,'green',true)}
      <p>That pivot flips \(b_i\); the ratio test is unique because the vertices are nondegenerate.</p>`},
  {key:'km-proof-count',id:'l12-km-proof-count',title:'The Rule Repeats the Path in Reverse on the Other Side',referencePages:[],className:'l12-km-slide l12-km-proof',
    html:raw`<p>Start with all bits zero. Flip the smallest \(i\) whose suffix sum \(b_i+\cdots+b_n\) is even.</p>
      ${box(raw`<p>For three dimensions, this gives</p>\[000\to100\to110\to010\to011\to111\to101\to001.\]`)}
      <div data-reveal><p>While \(b_n=0\), the first \(n-1\) bits follow the lower-dimensional rule: their improving coefficients have magnitude at least 2 and take priority over the last variable's magnitude 1.</p>
      <p>Then \(b_n\) flips, reversing all earlier signs. After any forward \(i\)-flip, reversing the signs makes \(i\) eligible and every \(j\lt i\) ineligible. Dantzig therefore retraces each step in reverse.</p></div>
      ${box(raw`\[L_n=L_{n-1}+1+L_{n-1},\quad L_1=1\quad\Longrightarrow\quad L_n=2^n-1.\]`,'green',true)}
      <p>The last bits are \((0,\ldots,0,1)\): the point is \((0,\ldots,0,5^n)\). All nonbasic reduced costs are strictly positive, so this is the unique optimum.</p>`},
];
export const kleeMintyAppendix = [...dictionarySlides, ...proofSlides];
export const auditData = {
  A:[[1,0,0,1,0,0],[4,1,0,0,1,0],[8,4,1,0,0,1]],b:[5,25,125],c:[-4,-2,-1,0,0,0],
  initialBasis:[4,5,6],states,bits,vertices,edges,initialCamera,
  rule:'most-negative reduced cost',convention:'minimization; ordinary unscaled slacks',
  family:{rowDiagonal:1,offDiagonalBase:2,offDiagonalExponentOffset:1,rhsBase:5,objectiveBase:2,pivotCount:'2^n-1'},
  comparisons:{bland:{vertices:[0,1,2,5,6,7],pivots:[[1,4,5],[2,5,5],[3,6,65],[5,2,5],[4,1,5]]},direct:{vertices:[0,7],pivots:[[3,6,125]]}},
  mainKeys:kleeMintyMain.map(s=>s.key),appendixKeys:kleeMintyAppendix.map(s=>s.key),
};
