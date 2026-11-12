/** Exact two-dimensional teaching views for the IPM / PDHG sequence. */
const C={ink:'#263943',blue:'#326b8c',green:'#177441',orange:'#b95013',maroon:'#861f41',grid:'#dbe3e7'};
const fmt=(n,d=3)=>Number(n.toFixed(d)).toString();
const residualText=n=>n>0&&n<1e-5?n.toExponential(2):fmt(n,5);
const xy=([u,v])=>[65+112*u,335-70*v];
const pts=a=>a.map(q=>xy(q).map(x=>fmt(x)).join(',')).join(' ');
const path=a=>'M'+a.map(q=>xy(q).map(x=>fmt(x)).join(',')).join(' L');
const line=(a,b,color=C.ink,width=2,dash='')=>`<path d="${path([a,b])}" fill="none" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const label=(q,text,dx=8,dy=-9,color=C.ink)=>{const [x,y]=xy(q);return `<text x="${fmt(x+dx)}" y="${fmt(y+dy)}" fill="${color}">${text}</text>`;};
const dot=(q,color=C.green,r=6)=>{const [x,y]=xy(q);return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="2" data-point="${q.join(',')}"/>`;};
const arrow=(a,b,color=C.ink)=>{const A=xy(a),B=xy(b),d=[B[0]-A[0],B[1]-A[1]],L=Math.hypot(...d),t=d.map(x=>x/L);return line(a,b,color,3)+`<path d="M${B} l${-11*t[0]+5*t[1]},${-11*t[1]-5*t[0]} M${B} l${-11*t[0]-5*t[1]},${-11*t[1]+5*t[0]}" fill="none" stroke="${color}" stroke-width="3"/>`;};
const svg=(contents,description)=>`<svg viewBox="0 0 580 390" role="img" aria-label="${description}" class="ipm-plot">${contents}</svg>`;
const output=(text)=>`<div class="ipm-readout" data-ipm-output role="status" aria-live="polite">${text}</div>`;
const rootOf=context=>context.slideElement||context;
const remember=(element,kind,value)=>{if(element.closest('.ns-print-slide'))return;try{sessionStorage.setItem(`ise5405-ipm-${element.closest('[data-slide-id]')?.dataset.slideId||'local'}-${kind}`,JSON.stringify(value));}catch(_){}};
const recalled=(element,kind,fallback)=>{if(element.closest('.ns-print-slide'))return fallback;try{const v=sessionStorage.getItem(`ise5405-ipm-${element.closest('[data-slide-id]')?.dataset.slideId||'local'}-${kind}`);return v===null?fallback:JSON.parse(v);}catch(_){return fallback;}};

export const ipmModel=Object.freeze({A:[[1,1,1,0],[1,0,0,1]],b:[4,3],c:[-2,-1,0,0],optimum:[3,1,0,0],optimalValue:-7});
export const slacks=([u,v])=>[u,v,4-u-v,3-u];
export const objective=([u,v])=>-2*u-v;
export function barrierValue(q,mu){const x=slacks(q);return Math.min(...x)>0?objective(q)-mu*x.reduce((s,t)=>s+Math.log(t),0):Infinity;}
export function barrierDerivatives([u,v],mu){
 const a=4-u-v,b=3-u;
 return {g:[-2-mu/u+mu/a+mu/b,-1-mu/v+mu/a],H:[[mu*(1/u**2+1/a**2+1/b**2),mu/a**2],[mu/a**2,mu*(1/v**2+1/a**2)]]};
}
export function centralPoint(mu){
 if(!(mu>0))throw new Error('The barrier parameter must be positive.');
 let q=[1,1];
 for(let k=0;k<100;k++){
  const {g,H}=barrierDerivatives(q,mu),det=H[0][0]*H[1][1]-H[0][1]**2;
  const d=[(-H[1][1]*g[0]+H[0][1]*g[1])/det,(H[0][1]*g[0]-H[0][0]*g[1])/det];
  const slope=g[0]*d[0]+g[1]*d[1];
  if(-slope<1e-25||Math.max(...g.map(Math.abs))<1e-11)break;
  let alpha=1,F=barrierValue(q,mu),next;
  while(alpha>1e-14){
   next=q.map((a,i)=>a+alpha*d[i]);
   if(barrierValue(next,mu)<=F+0.01*alpha*slope)break;
   alpha*=.5;
  }
  if(alpha<=1e-14)break;
  q=next;
 }
 return q;
}

function baseGraph({contours=false}={}){
 let s='';
 for(let k=1;k<=4;k++)s+=line([0,k],[4.2,k],C.grid,1)+line([k,0],[k,4.4],C.grid,1);
 s+=`<polygon points="${pts([[0,0],[3,0],[3,1],[0,4]])}" fill="#dceef5" stroke="${C.blue}" stroke-width="2.5"/>`;
 if(contours){
  for(const f of [-2,-4,-6]){
   const d=-f, candidates=[[0,d],[d/2,0],[3,d-6],[d-4,8-d]].filter(([u,v])=>u>=0&&u<=3&&v>=0&&u+v<=4+1e-9).filter((q,i,a)=>a.findIndex(p=>Math.hypot(q[0]-p[0],q[1]-p[1])<1e-9)===i);
   if(candidates.length>=2)s+=line(candidates[0],candidates[1],C.orange,1.6,'6 5');
  }
  s+=label([.3,1.4],'f = −2',0,-5,C.orange)+label([.3,3.4],'f = −4',0,-5,C.orange)+label([2.8,.4],'f = −6',-70,-5,C.orange);
 }
 s+=line([0,0],[4.2,0],C.ink,2)+line([0,0],[0,4.5],C.ink,2);
 for(let k=0;k<=4;k++)s+=label([k,0],String(k),-5,26)+label([0,k],String(k),-25,7);
 s+=label([4.2,0],'u',9,7)+label([0,4.5],'v',-5,10);
 s+=label([.4,3.6],'u + v = 4',12,-13,C.blue)+label([3,2.5],'u = 3',10,0,C.blue);
 s+=line([3,1],[3,3.8],C.blue,1.8,'6 4');
 s+=dot([3,1],C.maroon,7)+label([3,1],'optimum (3, 1)',12,23,C.maroon);
 return s;
}
const centralSamples=Array.from({length:101},(_,k)=>centralPoint(10**(1-3*k/100)));
export function centralPathSvg(mu=1,{simplex=false}={}){
 const q=centralPoint(mu);
 let s=baseGraph({contours:true});
 if(simplex)s+=arrow([0,0],[3,0],C.orange)+arrow([3,0],[3,1],C.orange)+label([.3,.2],'one simplex route',0,0,C.orange);
 s+=`<path d="${path(centralSamples)}" fill="none" stroke="${C.green}" stroke-width="4"/>`;
 s+=dot(q,C.green,8)+label(q,'barrier minimum',-145,-20,C.green);
 s+=label([.45,.6],'feasible region',0,0,C.blue);
 return svg(s,`Feasible polygon for u+v≤4, u≤3, u,v≥0. Green central path approaches optimum (3,1). Current barrier parameter ${fmt(mu)} gives u=${fmt(q[0])}, v=${fmt(q[1])}.${simplex?' Orange arrows show one illustrative simplex route.':''}`);
}
const centralText=mu=>{const [u,v]=centralPoint(mu),x=slacks([u,v]);return `<strong>μ = ${fmt(mu)}</strong> · u = ${fmt(u)}, v = ${fmt(v)}<br>LP objective f = ${fmt(objective([u,v]))}; slacks = (${fmt(x[2])}, ${fmt(x[3])})`;};
export function centralPathFigure({mu=1,simplex=false,print=false}={}){
 return `<figure class="ipm-visual" data-ipm-kind="central" data-mu="${mu}" data-simplex="${simplex}"><div data-ipm-drawing>${centralPathSvg(mu,{simplex})}</div>${print?'':`<div class="ipm-controls"><label>Barrier parameter μ <input type="range" aria-label="Barrier parameter, logarithmic scale" min="-2" max="1" step="any" value="${Math.log10(mu)}" data-ipm-range></label><button type="button" data-ipm-reset>Reset</button></div>`}${output(centralText(mu))}<figcaption>Green: barrier minima as μ decreases. Orange dashed lines: equal LP objective values.${simplex?' Solid orange arrows: one simplex route.':''}</figcaption></figure>`;
}
export function mountCentralPath(context){
 const host=rootOf(context),cleanups=[];
 host.querySelectorAll('[data-ipm-kind="central"]').forEach(el=>{
  const slider=el.querySelector('[data-ipm-range]');if(!slider)return;
  const initial=Number(el.dataset.mu),simplex=el.dataset.simplex==='true';
  const render=()=>{const mu=10**Number(slider.value);el.querySelector('[data-ipm-drawing]').innerHTML=centralPathSvg(mu,{simplex});el.querySelector('[data-ipm-output]').innerHTML=centralText(mu);slider.setAttribute('aria-valuetext',`μ equals ${fmt(mu)}`);remember(el,'central',Number(slider.value));};
  const reset=()=>{slider.value=Math.log10(initial);render();};
  slider.value=recalled(el,'central',Math.log10(initial));slider.addEventListener('input',render);el.querySelector('button').addEventListener('click',reset);render();
  cleanups.push(()=>{slider.removeEventListener('input',render);el.querySelector('button').removeEventListener('click',reset);});
 });return()=>cleanups.forEach(f=>f());
}

// This slice is explicitly v=1, not the two-dimensional central path.
export function sliceMinimum(mu){
 let lo=1e-10,hi=3-1e-10;
 for(let i=0;i<80;i++){const u=(lo+hi)/2,g=-2-mu/u+2*mu/(3-u);if(g>0)hi=u;else lo=u;}
 return (lo+hi)/2;
}
export function barrierSliceSvg(mu=1){
 const minimum=sliceMinimum(mu),value=barrierValue([minimum,1],mu);
 const project=(u,F)=>[65+150*u,315-18*(F+8)];
 const samples=Array.from({length:321},(_,i)=>{const u=.002+2.996*i/320;return project(u,barrierValue([u,1],mu));});
 let s=`<defs><clipPath id="ipm-slice-window"><rect x="65" y="30" width="450" height="285"/></clipPath></defs>`;
 s+=`<path d="M65 30V315H535" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
 for(const u of [0,1,2,3])s+=`<text x="${65+150*u}" y="345" text-anchor="middle">${u}</text>`;
 for(const F of [-8,-4,0,4,8]){const y=project(0,F)[1];if(y>=30)s+=`<path d="M65 ${y}H515" stroke="${C.grid}"/><text x="52" y="${y+6}" text-anchor="end">${F}</text>`;}
 s+=`<text x="540" y="323">u</text><text x="75" y="25">barrier objective Fμ(u, 1)</text>`;
 s+=`<path d="M${samples.map(q=>q.map(n=>fmt(n)).join(',')).join(' L')}" fill="none" stroke="${C.green}" stroke-width="3.5" clip-path="url(#ipm-slice-window)"/>`;
 const q=project(minimum,value);s+=`<circle cx="${q[0]}" cy="${q[1]}" r="7" fill="${C.green}"/><text x="${q[0]-12}" y="${q[1]-17}" text-anchor="end" fill="${C.green}">slice minimum</text>`;
 s+=`<path d="M65 35V310 M515 35V310" stroke="${C.orange}" stroke-dasharray="5 5" stroke-width="2"/><text x="96" y="65" fill="${C.orange}">↑ +∞</text><text x="435" y="65" fill="${C.orange}">+∞ ↑</text>`;
 return svg(s,`Barrier objective along v=1, defined for 0<u<3. It tends to positive infinity at both endpoints. At μ=${fmt(mu)} the slice minimum is u=${fmt(minimum)}. The vertical plotting window clips the diverging ends.`);
}
const sliceText=mu=>`<strong>μ = ${fmt(mu)}</strong> · Keep v = 1. The slice minimum has u = ${fmt(sliceMinimum(mu))}.`;
export function barrierSliceFigure({mu=1,print=false}={}){
 return `<figure class="ipm-visual" data-ipm-kind="slice" data-mu="${mu}"><div data-ipm-drawing>${barrierSliceSvg(mu)}</div>${print?'':`<div class="ipm-controls"><label>Barrier parameter μ <input type="range" aria-label="Barrier parameter for the fixed v equals one slice" min="-2" max=".3" step="any" value="${Math.log10(mu)}" data-ipm-range></label><button type="button" data-ipm-reset>Reset</button></div>`}${output(sliceText(mu))}<figcaption>This is a one-dimensional slice with v fixed at 1. Its minimum need not be the minimum over all feasible (u, v).</figcaption></figure>`;
}
export function mountBarrierSlice(context){
 const cleanups=[];rootOf(context).querySelectorAll('[data-ipm-kind="slice"]').forEach(el=>{
  const slider=el.querySelector('input');if(!slider)return;
  const initial=Math.log10(Number(el.dataset.mu));
  const render=()=>{const mu=10**Number(slider.value);el.querySelector('[data-ipm-drawing]').innerHTML=barrierSliceSvg(mu);el.querySelector('[data-ipm-output]').innerHTML=sliceText(mu);slider.setAttribute('aria-valuetext',`μ equals ${fmt(mu)}`);remember(el,'slice',Number(slider.value));};
  const reset=()=>{slider.value=initial;render();};slider.value=recalled(el,'slice',initial);slider.addEventListener('input',render);el.querySelector('button').addEventListener('click',reset);render();
  cleanups.push(()=>{slider.removeEventListener('input',render);el.querySelector('button').removeEventListener('click',reset);});
 });return()=>cleanups.forEach(f=>f());
}

export const newtonData=Object.freeze({start:[1,1],mu:1,direction:[34/29,28/29],maximumStep:29/31,dampedStep:261/310});
export function newtonSvg(alpha=newtonData.dampedStep){
 const {start,direction,maximumStep}=newtonData,end=start.map((a,i)=>a+alpha*direction[i]),full=start.map((a,i)=>a+direction[i]),hit=start.map((a,i)=>a+maximumStep*direction[i]);
 let s=baseGraph();s+=line(start,full,C.orange,3,'6 5')+arrow(start,end,C.green)+dot(start,C.blue)+label(start,'start (1, 1)',-75,25,C.blue);
 s+=dot(full,C.orange)+label(full,'full step: outside',12,-15,C.orange)+dot(hit,C.ink,4)+label(hit,'boundary',12,10);
 s+=dot(end,C.green,8)+label(end,'chosen step',-85,-18,C.green);
 return svg(s,`Newton direction (34/29,28/29) from (1,1). The full step violates u+v≤4. The boundary occurs at α=29/31. Current α=${fmt(alpha)} gives (${fmt(end[0])},${fmt(end[1])}).`);
}
const newtonText=alpha=>{const q=newtonData.start.map((a,i)=>a+alpha*newtonData.direction[i]),s=slacks(q),feasible=Math.min(...s)>1e-10;return `<strong>α = ${fmt(alpha)}</strong> · (u, v) = (${fmt(q[0])}, ${fmt(q[1])})<br>4 − u − v = ${fmt(s[2])}; ${feasible?'all four variables are positive.':Math.abs(s[2])<1e-9?'on the boundary: log barrier is undefined.':'outside the feasible region.'}`;};
export function newtonFigure({alpha=newtonData.dampedStep,print=false}={}){
 return `<figure class="ipm-visual" data-ipm-kind="newton" data-alpha="${alpha}"><div data-ipm-drawing>${newtonSvg(alpha)}</div>${print?'':`<div class="ipm-controls"><label>Step length α <input type="range" aria-label="Newton step length alpha" min="0" max="1" step="any" value="${alpha}" data-ipm-range></label><button type="button" data-step="${newtonData.dampedStep}">90% of limit</button><button type="button" data-step="1">Full step</button></div>`}${output(newtonText(alpha))}<figcaption>The dashed extension shows the same Newton direction. Shortening the step preserves positivity.</figcaption></figure>`;
}
export function mountNewton(context){
 const cleanups=[];rootOf(context).querySelectorAll('[data-ipm-kind="newton"]').forEach(el=>{
  const slider=el.querySelector('input');if(!slider)return;
  const render=()=>{const alpha=Number(slider.value);el.querySelector('[data-ipm-drawing]').innerHTML=newtonSvg(alpha);el.querySelector('[data-ipm-output]').innerHTML=newtonText(alpha);remember(el,'newton',alpha);};
  slider.value=recalled(el,'newton',Number(el.dataset.alpha));slider.addEventListener('input',render);
  const buttons=[...el.querySelectorAll('button')],callbacks=buttons.map(button=>{const fn=()=>{slider.value=button.dataset.step;render();};button.addEventListener('click',fn);return fn;});render();
  cleanups.push(()=>{slider.removeEventListener('input',render);buttons.forEach((b,i)=>b.removeEventListener('click',callbacks[i]));});
 });return()=>cleanups.forEach(f=>f());
}

export function pdhgStates(count=2000){
 let x=[1,1,2,2],p=[0,0];const states=[];
 for(let k=0;k<=count;k++){
  const residual=[x[0]+x[1]+x[2]-4,x[0]+x[3]-3];
  states.push({k,x:[...x],p:[...p],residual,residualNorm:Math.max(...residual.map(Math.abs)),objective:-2*x[0]-x[1]});
  const Atp=[p[0]+p[1],p[0],p[0],p[1]],c=[-2,-1,0,0];
  const next=x.map((a,i)=>Math.max(0,a-.25*(c[i]-Atp[i]))),bar=next.map((a,i)=>2*a-x[i]);
  p=[p[0]+.25*(4-bar[0]-bar[1]-bar[2]),p[1]+.25*(3-bar[0]-bar[3])];x=next;
 }return states;
}
const pdhgData=pdhgStates();
export function pdhgSvg(iteration=0){
 const k=Math.max(0,Math.min(2000,Math.round(iteration))),q=pdhgData[k].x.slice(0,2);
 let s=baseGraph();
 if(k)s+=`<path d="${path(pdhgData.slice(0,k+1).map(a=>a.x.slice(0,2)))}" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-opacity=".8"/>`;
 s+=dot([1,1],C.blue,5)+label([1,1],'start',-30,25,C.blue)+dot(q,C.green,8)+label(q,`iteration ${k}`,-70,-20,C.green);
 return svg(s,`First two coordinates of PDHG iterates. At iteration ${k}, u=${fmt(q[0])}, v=${fmt(q[1])}. The full iterate has equality residual ${residualText(pdhgData[k].residualNorm)}; being inside this projected polygon does not establish standard-form feasibility.`);
}
const pdhgText=k=>{const a=pdhgData[k];return `<strong>Iteration ${k}</strong> · x = (${a.x.map(n=>fmt(n)).join(', ')})<br>Largest equality error = ${residualText(a.residualNorm)}; objective = ${fmt(a.objective)}.`;};
export function pdhgFigure({iteration=0,print=false}={}){
 const k=Math.max(0,Math.min(2000,Math.round(iteration)));
 return `<figure class="ipm-visual" data-ipm-kind="pdhg" data-iteration="${k}"><div data-ipm-drawing>${pdhgSvg(k)}</div>${print?'':`<div class="ipm-controls"><label>Iteration <input type="range" aria-label="PDHG iteration number" min="0" max="2000" step="1" value="${k}" data-ipm-range></label><button type="button" data-ipm-next>Next step</button><button type="button" data-ipm-reset>Reset</button></div>`}${output(pdhgText(k))}<figcaption>x order: (u, v, s₁, s₂). The plot shows only (u, v). Equality error checks both equations Ax = b; the objective alone is not an optimality certificate.</figcaption></figure>`;
}
export function mountPDHG(context){
 const cleanups=[];rootOf(context).querySelectorAll('[data-ipm-kind="pdhg"]').forEach(el=>{
  const slider=el.querySelector('input');if(!slider)return;
  const render=()=>{const k=Number(slider.value);el.querySelector('[data-ipm-drawing]').innerHTML=pdhgSvg(k);el.querySelector('[data-ipm-output]').innerHTML=pdhgText(k);remember(el,'pdhg',k);};
  const next=()=>{slider.value=Math.min(2000,Number(slider.value)+1);render();},reset=()=>{slider.value=0;render();};
  slider.value=recalled(el,'pdhg',Number(el.dataset.iteration));slider.addEventListener('input',render);el.querySelector('[data-ipm-next]').addEventListener('click',next);el.querySelector('[data-ipm-reset]').addEventListener('click',reset);render();
  cleanups.push(()=>{slider.removeEventListener('input',render);el.querySelector('[data-ipm-next]').removeEventListener('click',next);el.querySelector('[data-ipm-reset]').removeEventListener('click',reset);});
 });return()=>cleanups.forEach(f=>f());
}
