/** 3D primal cycling geometry. Adapted from Simplex I l6-16's SVG player:
 * centered world model, common yaw/pitch projection, depth-sorted translucent
 * faces, captured two-axis dragging, keyboard/buttons, and local state.
 * Independent axis scales keep this narrow pyramid legible; tick labels and
 * the visible scale note retain the original LP coordinates.
 */
import { cycleData } from './lecture-10-cycle-data.js';
const model = cycleData.geometry;
const defaults = {yaw:-0.7, pitch:0.54};
const numeric = value => String(value).split('/').map(Number).reduce((a,b)=>a/b);
const dot = (a,b) => a.reduce((s,x,i)=>s+x*b[i],0);
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normal = v => {const n=Math.hypot(...v);return v.map(x=>x/n);};
const planes = [
 {normal:[1,0,0],rhs:0}, {normal:[0,1,0],rhs:0}, {normal:[0,0,1],rhs:0},
 ...cycleData.cycling.A.map((r,i)=>({normal:r.slice(0,3).map(numeric),rhs:numeric(cycleData.cycling.b[i])})),
];
const box = Array.from({length:8},(_,i)=>model.axisMaxima.map((m,j)=>((i>>j)&1)*m));
function planePatch({normal:n,rhs}) {
 const hits=[];
 const add=p=>{if(!hits.some(q=>Math.hypot(...p.map((x,i)=>x-q[i]))<1e-8))hits.push(p);};
 for(let i=0;i<8;i++)for(let axis=0;axis<3;axis++){
  const j=i^(1<<axis);if(j<i)continue;
  const a=box[i],b=box[j],va=dot(n,a)-rhs,vb=dot(n,b)-rhs;
  if(Math.abs(va)<1e-9)add(a);if(Math.abs(vb)<1e-9)add(b);
  if(va*vb<0){const t=va/(va-vb);add(a.map((x,k)=>x+t*(b[k]-x)));}
 }
 if(hits.length<3)return [];
 const center=hits[0].map((_,i)=>hits.reduce((s,p)=>s+p[i],0)/hits.length);
 const u=normal(cross(n,Math.abs(n[0])<Math.abs(n[1])?[1,0,0]:[0,1,0]));
 const v=normal(cross(n,u));
 return hits.sort((a,b)=>Math.atan2(dot(a.map((x,i)=>x-center[i]),v),dot(a.map((x,i)=>x-center[i]),u))-Math.atan2(dot(b.map((x,i)=>x-center[i]),v),dot(b.map((x,i)=>x-center[i]),u)));
}
export const cycleGeometryAudit = {...model,planes,patches:planes.map(planePatch),projection:'Simplex I l6-16 centered yaw/pitch SVG; independent labeled axis scales'};
function project(point,yaw=defaults.yaw,pitch=defaults.pitch){
 const [x,y,z]=point.map((v,i)=>(v/model.axisMaxima[i]-.5)*5.2);
 const horizontal=x*Math.cos(yaw)-y*Math.sin(yaw);
 const depth=x*Math.sin(yaw)+y*Math.cos(yaw);
 return {x:300+horizontal*43,y:162-z*35+depth*14.6*Math.cos(pitch),depth:depth+z*Math.sin(pitch)};
}
const line=(a,b,attrs='')=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" ${attrs}/>`;
function triangle(a,b){const angle=Math.atan2(b.y-a.y,b.x-a.x);return `${b.x},${b.y} ${b.x-13*Math.cos(angle-.4)},${b.y-13*Math.sin(angle-.4)} ${b.x-13*Math.cos(angle+.4)},${b.y-13*Math.sin(angle+.4)}`;}
const fmt=x=>Number.isInteger(x)?String(x):x.toFixed(2);
const nonbasic=s=>Array.from({length:7},(_,i)=>i+1).filter(j=>!s.basis.includes(j));
const stateAt=(root)=>cycleData[root.dataset.cycleTrace||'cycling'].states[Number(root.dataset.cycleState)||0];
function geometry(state,pivot,{yaw=defaults.yaw,pitch=defaults.pitch,showPlanes=false,theta=0,edge=false}={}){
 const p=q=>project(q,yaw,pitch),zero=p([0,0,0]);
 const faces=model.faces.map((indices,i)=>({id:i,points:indices.map(j=>model.vertices[j])}));
 const basisPlanes=showPlanes?nonbasic(state).map(j=>({variable:j,points:cycleGeometryAudit.patches[j-1]})).filter(f=>f.points.length):[];
 const polygons=[...faces.map(f=>({...f,kind:'feasible'})),...basisPlanes.map(f=>({...f,kind:'basis'}))]
  .map(f=>({...f,screen:f.points.map(p)})).sort((a,b)=>a.screen.reduce((s,q)=>s+q.depth,0)/a.screen.length-b.screen.reduce((s,q)=>s+q.depth,0)/b.screen.length)
  .map(f=>`<polygon ${f.kind==='basis'?`data-cycle-basis-plane="${f.variable}"`:`data-cycle-face="${f.id}"`} points="${f.screen.map(q=>`${q.x},${q.y}`).join(' ')}"/>`).join('');
 const axes=model.axisMaxima.map((m,i)=>{const q=[0,0,0];q[i]=m*1.14;return line(zero,p(q),'class="l10-cycle-axis"');}).join('');
 const edges=model.edges.map(([a,b])=>line(p(model.vertices[a]),p(model.vertices[b]),'class="l10-cycle-edge"')).join('');
 let proposal='';
 if(pivot&&!edge){
  const d=pivot.direction.slice(0,3).map(numeric),length=Math.hypot(...d.map((v,i)=>v/model.axisMaxima[i]));
  let endpoint=d.map(v=>v/length*.38),end=p(endpoint);
  // The arrow is a scaled direction, so shorten it when needed to leave the legend clear.
  if(end.y>320){const scale=Math.max(0,(320-zero.y)/(end.y-zero.y));endpoint=endpoint.map(v=>v*scale);end=p(endpoint);}
  const patch=cycleGeometryAudit.patches[pivot.leaving-1];
  proposal=`<g data-cycle-reveal-geometry>${patch.length?`<polygon data-cycle-blocker="${pivot.leaving}" points="${patch.map(p).map(q=>`${q.x},${q.y}`).join(' ')}"/>`:''}${line(zero,end,'class="l10-cycle-proposal"')}<polygon class="l10-cycle-arrowhead" points="${triangle(zero,end)}"/></g>`;
 }
 const optimal=p(model.optimum),current=p(edge?model.optimum.map(v=>v*theta):state.point.slice(0,3).map(numeric));
 const path=edge?`${line(zero,optimal,'class="l10-cycle-possible-edge"')}${line(zero,current,'class="l10-cycle-traveled"')}`:'';
 return axes+polygons+edges+proposal+path+`<polygon class="l10-cycle-optimum" points="${optimal.x},${optimal.y-9} ${optimal.x+9},${optimal.y} ${optimal.x},${optimal.y+9} ${optimal.x-9},${optimal.y}"/><circle data-cycle-current cx="${current.x}" cy="${current.y}" r="9"/>`;
}
function axisLabelPosition(point,index){return {x:Math.max(0,Math.min(532,point.x-12)),y:Math.max(0,Math.min(280,point.y-31-(index===1?24:0)))};}
function labels(){return model.axisMaxima.map((m,i)=>{const point=[0,0,0];point[i]=m*1.14;const q=axisLabelPosition(project(point),i);return `<foreignObject data-cycle-axis-label="${i}" x="${q.x}" y="${q.y}" width="62" height="40"><div xmlns="http://www.w3.org/1999/xhtml">\\(x_${i+1}\\)</div></foreignObject>`;}).join('')+`<text data-cycle-origin-label x="${project([0,0,0]).x}" y="${project([0,0,0]).y+28}">O: (0,0,0)</text><text data-cycle-optimum-label x="${Math.min(450,project(model.optimum).x+12)}" y="${project(model.optimum).y-16}">V: (4,1,0)</text>`;}
export function cycleFigure({trace='cycling',index=0,proposal=false,planes=false,edge=false,print=false}={}){
 const state=cycleData[trace].states[index],pivot=proposal?cycleData[trace].pivots[index]:null;
 const theta=edge&&print?1:0;
 return `<figure class="l10-cycle-figure" data-cycle-widget data-cycle-trace="${trace}" data-cycle-state="${index}" data-cycle-proposal="${proposal}" data-cycle-edge="${edge}" data-cycle-planes="${planes}" data-cycle-print="${print}" data-cycle-theta="${theta}" data-cycle-camera="${defaults.yaw},${defaults.pitch}" data-cycle-vertices='${JSON.stringify(model.vertices)}'>
  <svg class="l10-cycle-svg" viewBox="0 0 600 360" role="img" ${print?'':'tabindex="0"'} aria-label="Three-dimensional feasible pyramid. O is the degenerate origin; V is (4,1,0). Drag or use arrow keys to rotate.">
   <g data-cycle-geometry>${geometry(state,pivot,{showPlanes:planes,edge,theta})}</g><g class="l10-cycle-labels">${labels()}</g>${proposal?'<text x="12" y="348" class="l10-cycle-plot-key" data-cycle-reveal-geometry>Dashed: direction (scaled) · orange: blocker</text>':''}
  </svg>
  <figcaption><p class="l10-cycle-key"><span>Blue: feasible</span><span>○ current</span><span>◆ optimum</span></p><p class="l10-cycle-scale">Axis maxima: 4, 1, 4/3 (independent scales).</p>

   ${edge?'<p data-cycle-live-status role="status">'+(print?'At V: θ = 1, f = −10.':'At O: θ = 0, f = 0.')+'</p>':''}
  </figcaption>
  ${print?'':`<div class="l10-cycle-camera-controls"><button type="button" data-cycle-rotate="-1" aria-label="Rotate left">↶</button><button type="button" data-cycle-rotate="1" aria-label="Rotate right">↷</button><button type="button" data-cycle-reset>Reset view</button></div><label class="l10-cycle-plane-control" ${edge?'hidden':''}><input type="checkbox" data-cycle-plane-toggle ${planes?'checked':''}>Nonbasic planes (variables set to zero)</label>${edge?'<div class="l10-cycle-edge-controls"><label>Step θ <input type="range" min="0" max="1" step="0.01" value="0" data-cycle-theta-control></label><button type="button" data-cycle-replay>Replay edge</button></div>':''}`}
 </figure>`;
}
export function mountCycleFigure({slideElement,slide,announce=()=>{}}){
 const root=slideElement.querySelector('[data-cycle-widget]');if(!root)return;
 let yaw=defaults.yaw,pitch=defaults.pitch,theta=Number(root.dataset.cycleTheta),frame=0,pointer=null;
 const isPrint=root.dataset.cyclePrint==='true'||slideElement.closest('[data-role=print-deck]');
 const svg=root.querySelector('svg'),layer=root.querySelector('[data-cycle-geometry]'),toggle=root.querySelector('[data-cycle-plane-toggle]'),slider=root.querySelector('[data-cycle-theta-control]');
 const storageKey=`ise5405:cycle3d:${slide?.id||'preview'}:v1`;
 if(!isPrint){try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved){yaw=saved.yaw;pitch=saved.pitch;if(slider)theta=saved.theta??0;}}catch{}}
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
 const listeners=[];
 const bind=(el,type,fn)=>{if(el){el.addEventListener(type,fn);listeners.push([el,type,fn]);}};
 const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;};
 const persist=()=>{if(!isPrint)try{localStorage.setItem(storageKey,JSON.stringify({yaw,pitch,theta}));}catch{}};
 function render(){
  const state=stateAt(root),index=Number(root.dataset.cycleState),trace=root.dataset.cycleTrace;
  const pivot=root.dataset.cycleProposal==='true'?cycleData[trace].pivots[index]:null;
  const edge=root.dataset.cycleEdge==='true',showPlanes=toggle?toggle.checked:root.dataset.cyclePlanes==='true';
  layer.innerHTML=geometry(state,pivot,{yaw,pitch,showPlanes,theta,edge});
  root.dataset.cycleCamera=`${yaw},${pitch}`;root.dataset.cycleTheta=String(theta);root.dataset.cycleBasis=state.basis.join(',');root.dataset.cycleNonbasic=nonbasic(state).join(',');
  root.dataset.cyclePoint=JSON.stringify(edge?model.optimum.map(v=>v*theta):state.point.slice(0,3).map(numeric));
  root.dataset.reducedMotion=String(reduced());
  model.axisMaxima.forEach((m,i)=>{const point=[0,0,0];point[i]=m*1.14;const q=axisLabelPosition(project(point,yaw,pitch),i),label=root.querySelector(`[data-cycle-axis-label="${i}"]`);label.setAttribute('x',q.x);label.setAttribute('y',q.y);});
  for(const [selector,point,offset] of [['[data-cycle-origin-label]',[0,0,0],[0,28]],['[data-cycle-optimum-label]',model.optimum,[12,-16]]]){
   const q=project(point,yaw,pitch),label=root.querySelector(selector);label.setAttribute('x',Math.max(8,Math.min(450,q.x+offset[0])));label.setAttribute('y',Math.max(24,Math.min(315,q.y+offset[1])));
  }
  if(slider)slider.value=theta;
  const status=root.querySelector('[data-cycle-live-status]');if(status)status.textContent=`θ = ${fmt(theta)}; point (${model.optimum.map(v=>fmt(v*theta)).join(', ')}); f = ${fmt(-10*theta)}.`;
  svg.setAttribute('aria-label',`Feasible pyramid. Current point ${root.dataset.cyclePoint}. ${edge?`Objective ${fmt(-10*theta)}.`:'All cycling pivots stay at the origin.'} ${showPlanes?`Nonbasic planes: variables ${nonbasic(state).join(', ')}.`:''} Arrow keys rotate the view.`);
 }
 bind(svg,'pointerdown',e=>{stop();pointer={id:e.pointerId,x:e.clientX,y:e.clientY};svg.setPointerCapture?.(e.pointerId);svg.focus({preventScroll:true});e.preventDefault();});
 bind(svg,'pointermove',e=>{if(pointer?.id!==e.pointerId)return;yaw+=(e.clientX-pointer.x)*.008;pitch=Math.max(.2,Math.min(1.05,pitch+(e.clientY-pointer.y)*.004));pointer.x=e.clientX;pointer.y=e.clientY;render();persist();});
 const release=e=>{if(pointer?.id!==e.pointerId)return;if(svg.hasPointerCapture?.(e.pointerId))svg.releasePointerCapture(e.pointerId);pointer=null;};
 bind(svg,'pointerup',release);bind(svg,'pointercancel',release);
 bind(svg,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();stop();yaw+=e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0;pitch=Math.max(.2,Math.min(1.05,pitch+(e.key==='ArrowUp'?-.06:e.key==='ArrowDown'?.06:0)));render();persist();announce('Rotated the feasible pyramid.');});
 root.querySelectorAll('[data-cycle-rotate]').forEach(b=>bind(b,'click',()=>{stop();yaw+=Number(b.dataset.cycleRotate)*.16;render();persist();}));
 bind(root.querySelector('[data-cycle-reset]'),'click',()=>{stop();yaw=defaults.yaw;pitch=defaults.pitch;render();persist();});
 bind(toggle,'change',render);bind(root,'cycle-state',render);
 bind(slider,'input',()=>{stop();theta=Number(slider.value);render();persist();});
 bind(root.querySelector('[data-cycle-replay]'),'click',()=>{stop();theta=0;if(reduced()){theta=1;render();persist();return;}const start=performance.now();const tick=now=>{theta=Math.min(1,(now-start)/1400);render();if(theta<1)frame=requestAnimationFrame(tick);else{frame=0;persist();announce('Reached (4,1,0); objective minus ten.');}};frame=requestAnimationFrame(tick);});
 render();
 return ()=>{stop();if(pointer&&svg.hasPointerCapture?.(pointer.id))svg.releasePointerCapture(pointer.id);listeners.forEach(([el,event,fn])=>el.removeEventListener(event,fn));};
}
