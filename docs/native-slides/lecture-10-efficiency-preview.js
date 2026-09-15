/** A short bridge from finite termination to efficiency and initialization. */
const raw = String.raw;
const box = (html, tone = 'blue') => `<div class="l10-box" data-tone="${tone}">${html}</div>`;
const bits = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,1,1],[1,1,1],[1,0,1],[0,0,1]];
const vertices = bits.map(([u,v,w]) => {
  const x = 5*u, y = v*(25-4*x), z = w*(125-8*x-4*y);
  return [x,y,z];
});
const objective = ([x,y,z]) => -4*x-2*y-z;
const edges = bits.flatMap((v,i) => bits.flatMap((w,j) =>
  j>i && v.filter((b,k)=>b!==w[k]).length===1 ? [[i,j]] : []));
const paths = {
  dantzig: {label:'Most-negative + lex', vertices:[0,1,2,3,4,5,6,7],
    pivots:[[1,4,5],[2,5,5],[4,1,5],[3,6,25],[1,4,5],[5,2,5],[4,1,5]]},
  bland: {label:'Bland', vertices:[0,1,2,5,6,7],
    pivots:[[1,4,5],[2,5,5],[3,6,65],[5,2,5],[4,1,5]]},
  direct: {label:'Choose x₃ first', vertices:[0,7], pivots:[[3,6,125]]},
};
const letter = i => 'ABCDEFGH'[i];
const initialCamera = {yaw:.72,pitch:.42};
let saved = {rule:'dantzig',step:0,...initialCamera};

function plot(rule='dantzig',step=0,yaw=initialCamera.yaw,pitch=initialCamera.pitch) {
  // A fixed diagonal axis scaling keeps this long, narrow polyhedron legible.
  // Every vertex, face, edge and marker uses the same affine camera map.
  const project = v => {
    const [x,y,z]=v.map((a,i)=>a/[5,25,125][i]-.5);
    const a=x*Math.cos(yaw)-y*Math.sin(yaw), b=x*Math.sin(yaw)+y*Math.cos(yaw);
    return [255+205*a,170-200*(z*Math.cos(pitch)-b*Math.sin(pitch)),b*Math.cos(pitch)+z*Math.sin(pitch)];
  };
  const points=vertices.map(project), path=paths[rule].vertices, current=path[step];
  const faces=[];
  for(let axis=0;axis<3;axis++)for(let bit=0;bit<2;bit++) {
    const members=bits.map((v,i)=>i).filter(i=>bits[i][axis]===bit);
    const order=[members[0]];
    while(order.length<4) order.push(members.find(i=>!order.includes(i)&&edges.some(([a,b])=>(a===i&&b===order.at(-1))||(b===i&&a===order.at(-1)))));
    faces.push(order);
  }
  faces.sort((a,b)=>a.reduce((s,i)=>s+points[i][2],0)-b.reduce((s,i)=>s+points[i][2],0));
  const line=(a,b,color,width,dash='')=>`<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const offsets=[[12,22],[12,22],[-14,-12],[-14,20],[-14,-12],[12,-12],[12,-12],[12,-12]];
  return `<svg class="l10-cube-svg" viewBox="0 0 510 325" role="img" tabindex="0" aria-label="Klee–Minty feasible polyhedron. Drag or use arrow keys to rotate. A is the start and H is optimal." data-km-svg data-yaw="${yaw}" data-pitch="${pitch}" data-rule="${rule}" data-step="${step}">
    ${faces.map(f=>`<polygon points="${f.map(i=>points[i].slice(0,2).join(',')).join(' ')}" fill="#8dc5da" fill-opacity=".10"/>`).join('')}
    ${edges.map(([a,b])=>line(a,b,'#8297a2',2)).join('')}
    ${path.slice(1).map((b,i)=>line(path[i],b,i<step?'#b54800':'#bc9476',i<step?6:3,i<step?'':'6 5')).join('')}
    ${points.map((p,i)=>({p,i})).sort((a,b)=>a.p[2]-b.p[2]).map(({p,i})=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===current?8:4}" fill="${i===current?'#fff':'#2d677f'}" stroke="${i===current?'#8b2047':'#2d677f'}" stroke-width="${i===current?4:1}"/><text x="${p[0]+offsets[i][0]}" y="${p[1]+offsets[i][1]}" text-anchor="${offsets[i][0]<0?'end':'start'}">${letter(i)}${i===0?' start':i===7?' optimum':''}</text>`).join('')}
    <text x="12" y="312">Solid: visited · dashed: remaining · ring: current</text>
  </svg>`;
}
function status(rule,step) {
  const path=paths[rule], i=path.vertices[step];
  return `Pivot ${step} of ${path.pivots.length} · ${letter(i)} = (${vertices[i].join(', ')}) · objective ${objective(vertices[i])}`;
}
function widget(print=false) {
  return raw`<figure class="l10-figure l10-km-figure" data-km-widget>
    <div data-km-view>${plot('dantzig',print?7:0)}</div>
    ${print?'':`<div class="l10-controls l10-km-controls" data-screen-only><label>Rule <select data-km-rule aria-label="Pivot rule">${Object.entries(paths).map(([key,path])=>`<option value="${key}">${path.label}</option>`).join('')}</select></label><button type="button" data-km-reset>Reset view</button></div>
    <div class="l10-controls l10-km-controls" data-screen-only><label>Pivot <input data-km-step type="range" min="0" max="7" value="0" step="1"></label><button type="button" data-km-next>Next pivot</button></div>`}
    <p class="l10-caption" data-km-status role="status">${status('dantzig',print?7:0)}</p>
    <figcaption class="l10-caption">${print?'Seven-pivot path shown. ':''}Axes scaled by \(5,25,125\). ${print?'':'Drag to rotate.'}</figcaption>
  </figure>`;
}
function exampleHtml(print=false) {
  return raw`<div class="l10-pair l10-km-pair"><div>
    <p><strong>Klee–Minty example.</strong> Start at \(A=(0,0,0)\).</p>
    <div class="l10-math">\[\begin{aligned}\min\quad &f=-4x_1-2x_2-x_3\\\text{s.t.}\quad &x_1\le5,\\&4x_1+x_2\le25,\\&8x_1+4x_2+x_3\le125,\\&x_1,x_2,x_3\ge0.\end{aligned}\]</div>
    <p>Add slacks \(x_4,x_5,x_6\) in row order.</p>
    <table class="l10-table l10-km-counts" aria-label="Pivots from A to the optimum H"><thead><tr><th scope="col">Entering / leaving choice</th><th scope="col">Pivots</th></tr></thead><tbody>
      <tr><th scope="row">Most-negative / lex</th><td>7</td></tr><tr><th scope="row">Bland / Bland</th><td>5</td></tr><tr><th scope="row">Choose \(x_3\) first</th><td>1</td></tr></tbody></table>
    <p>Every step is positive: <strong>no degeneracy or cycling.</strong> \(H=(0,0,125)\), \(f=-125\).</p>
    </div>${widget(print)}</div>`;
}
function mountExample({slideElement}) {
  const root=slideElement.querySelector('[data-km-widget]');
  if(!root)return;
  const svg=root.querySelector('svg'), choice=root.querySelector('[data-km-rule]'), slider=root.querySelector('[data-km-step]'), next=root.querySelector('[data-km-next]'), reset=root.querySelector('[data-km-reset]');
  let state={...saved},pointer=null;
  const render=()=>{
    const temp=document.createElement('div');temp.innerHTML=plot(state.rule,state.step,state.yaw,state.pitch);
    svg.innerHTML=temp.firstElementChild.innerHTML;
    for(const key of ['rule','step','yaw','pitch'])svg.dataset[key]=String(state[key]);
    choice.value=state.rule;slider.max=String(paths[state.rule].pivots.length);slider.value=String(state.step);
    next.disabled=state.step===paths[state.rule].pivots.length;
    root.querySelector('[data-km-status]').textContent=status(state.rule,state.step);
    saved={...state};
  };
  const listeners=[];
  const on=(el,event,handler)=>{el.addEventListener(event,handler);listeners.push(()=>el.removeEventListener(event,handler));};
  on(choice,'change',()=>{state.rule=choice.value;state.step=0;render();});
  on(slider,'input',()=>{state.step=Number(slider.value);render();});
  on(next,'click',()=>{state.step=Math.min(state.step+1,paths[state.rule].pivots.length);render();});
  on(reset,'click',()=>{Object.assign(state,initialCamera);render();});
  on(svg,'pointerdown',e=>{pointer={id:e.pointerId,x:e.clientX,y:e.clientY};svg.setPointerCapture(e.pointerId);});
  on(svg,'pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;state.yaw+=(e.clientX-pointer.x)*.01;state.pitch=Math.max(-1.1,Math.min(1.1,state.pitch+(e.clientY-pointer.y)*.01));pointer.x=e.clientX;pointer.y=e.clientY;render();});
  const release=e=>{if(pointer?.id===e.pointerId){if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);pointer=null;}};
  on(svg,'pointerup',release);on(svg,'pointercancel',release);
  on(svg,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();state.yaw+=(e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0);state.pitch=Math.max(-1.1,Math.min(1.1,state.pitch+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));render();});
  render();
  return ()=>{listeners.forEach(remove=>remove());if(pointer&&svg.hasPointerCapture(pointer.id))svg.releasePointerCapture(pointer.id);};
}

export const efficiencyPreviewSlides = [
  {key:'finite-not-fast',title:'Finite Termination Does Not Guarantee Fast Convergence',referencePages:[],
    html:raw`<p>Lexicographic and Bland rules prevent a basis from repeating. How many <em>different</em> bases might we visit?</p>
    ${box('<strong>No repeated bases</strong> gives finite termination. It does not promise a small number of pivots.')}
    <p>A long path can consist entirely of positive, improving steps. Slow progress can occur even without degeneracy.</p>
    ${box(raw`<strong>Be precise about the rule:</strong> lex chooses the <em>leaving</em> row. In the next example, pair it with the most-negative reduced cost entering. Bland chooses both.`, 'orange')}
    <p>Bland has examples with exponentially many pivots as dimension grows. A small 3D example will let us see a detour.</p>
    <p class="l10-note"><a href="https://doi.org/10.1007/BFb0121192">Further reading: Notes on Bland’s pivoting rule</a>.</p>`},
  {key:'klee-minty-paths',title:'A Short Route Exists, but Pivots Can Take a Detour',referencePages:[],
    className:'l10-km-slide',html:exampleHtml(),printHtml:exampleHtml(true),onMount:mountExample},
  {key:'efficiency-options',title:'What Can We Do About Slow Progress?',referencePages:[],
    html:raw`${box(raw`<p><strong>Choose pivots for practical progress.</strong> Simplex solvers use entering-variable strategies such as steepest-edge and Devex: they compare improvement while accounting for direction size. Anticycling safeguards handle degeneracy.</p>`)}
    ${box(raw`<p><strong>Use a different algorithm family.</strong> Interior-point methods are not restricted to edges between vertices. Polynomial-time variants exist; we will study the idea later.</p>`, 'green')}
    <p>Neither family is always fastest. Modern solvers offer simplex and interior-point methods.</p>
    ${box(raw`<strong>Next:</strong> we can prevent cycling and will return to efficiency in §3.7. First, simplex still needs a starting feasible basis. How do we find one?`, 'orange')}
    <p class="l10-note"><a href="https://galton.uchicago.edu/~lekheng/courses/302/classics/karmarkar.pdf">Interior-point foundations</a> · <a href="https://docs.mosek.com/latest/cmdtools/solving-linear.html">Choosing an LP algorithm</a></p>`},
];
export const auditData = {
  A:[[1,0,0,1,0,0],[4,1,0,0,1,0],[8,4,1,0,0,1]], b:[5,25,125], c:[-4,-2,-1,0,0,0],
  initialBasis:[4,5,6],bits,vertices,edges,paths,
};
