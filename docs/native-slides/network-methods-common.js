/** Shared authoring primitives; numerical states remain exported for independent checks. */
export {raw,box,math} from './duality-common.js';
// Convert authoring shorthand to genuine MathJax, never positioned pseudo-math.
const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ᵢ':'i','ⱼ':'j','ᵣ':'r'};
const inline=value=>String(value).replace(/([A-Za-z])([₀₁₂₃₄₅₆₇₈₉ᵢⱼᵣ]+)/g,(_,v,sub)=>`\\(${v}_{${[...sub].map(c=>subs[c]).join('')}}\\)`).replace(/([A-Za-z])ᵀ([A-Za-z])/g,(_,a,b)=>`\\(${a}^\\top ${b}\\)`);
export const p=s=>`<p>${inline(s)}</p>`;
export const table=(heads,rows,label='Worked example data')=>`<div class="dy-table-wrap" tabindex="0" aria-label="${label}"><table class="dy-table"><thead><tr>${heads.map(h=>`<th scope="col">${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((x,i)=>i?`<td>${inline(x)}</td>`:`<th scope="row">${inline(x)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export const pair=(left,right)=>`<div class="dy-pair"><div class="dy-stack">${left}</div><div class="dy-stack">${right}</div></div>`;
export const checkpoint=(promptHtml,choices,correctIndex,explanationHtml)=>({promptHtml,choices:choices.map(html=>({html})),correctIndex,explanationHtml,autoOpen:true});
export const link=(key,label)=>`<a data-network-link="${key}" href="#slide=1">${label}</a>`;
export function assemble(number,title,mainSlides,appendixSlides,subtitle){
 const metadata={id:`lecture-${number}`,number,title,subtitle,course:'ISE 5405 · Optimization I',homeUrl:'../../',pdfUrl:`../../materials/lecture_${number}.pdf`,whiteboards:3};
 const all=[...mainSlides.map(s=>({...s,section:title})),...appendixSlides.map(s=>({...s,section:'Appendix · Complete arguments and practice'}))];
 const pages=new Map(all.map((s,i)=>[s.key,i+1]));
 const slides=all.map((s,i)=>({...s,id:`l${number}-${s.key}`,page:i+1,eyebrow:s.section,className:'dy-slide nm-slide',html:s.html.replace(/data-network-link="([^"]+)" href="#slide=1"/g,(_,key)=>{if(!pages.has(key))throw Error('Unknown slide '+key);return `data-network-link="${key}" href="#slide=${pages.get(key)}"`;})}));
 const referenceMap=slides.map(({id,key,page,title,section,reference})=>({id,key,page,title,section,source:reference||'New explanation connecting the reference examples'}));
 return {metadata,slides,referenceMap,deck:{schemaVersion:1,id:metadata.id,number,title,metadata,styles:new URL(`./lecture-${number}.css`,import.meta.url).href,slides}};
}
export const slide=(key,title,html,reference='',options={})=>({key,title,html,reference,...options});
export const shipping={nodes:['1','2','3','4'],positions:[[65,180],[290,55],[290,310],[520,180]],arcs:[[1,2,2],[1,3,3],[2,3,2],[2,4,1],[3,4,4]],b:[10,0,0,-10]};
export const degenerate={nodes:['1','2','3','4','5'],positions:[[80,310],[500,310],[80,160],[500,160],[290,40]],arcs:[[1,2,0],[1,3,1],[2,4,0],[3,5,0],[4,3,0],[4,5,1]],b:[1,0,0,0,-1]};
export function network(graph,{flows=null,tree=[],focus=[],caption='',costs=null}={}){
 let svg='';
 graph.arcs.forEach(([i,j,c],k)=>{
  const [x,y]=graph.positions[i-1],[X,Y]=graph.positions[j-1],dx=X-x,dy=Y-y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const col=focus.includes(k)?'#b95013':tree.includes(k)?'#861f41':'#6e8794';
  const a=[x+25*ux,y+25*uy],b=[X-28*ux,Y-28*uy];
  const [tx,ty]=graph.labelPositions?.[k]||[(x+X)/2-uy*24,(y+Y)/2+ux*24];
  svg+=`<path d="M${a} L${b}" stroke="${col}" stroke-width="${tree.includes(k)||focus.includes(k)?5:2}" fill="none"/><path d="M${b} l${-11*ux+6*uy},${-11*uy-6*ux} M${b} l${-11*ux-6*uy},${-11*uy+6*ux}" stroke="${col}" stroke-width="3"/>`;
  svg+=`<text class="nm-label" x="${tx}" y="${ty}" text-anchor="middle">${flows?`x=${flows[k]}`:`c=${costs?costs[k]:c}`}</text>`;
 });
 graph.nodes.forEach((n,k)=>{const [x,y]=graph.positions[k];svg+=`<circle cx="${x}" cy="${y}" r="23" fill="white" stroke="#354b58" stroke-width="2"/><text x="${x}" y="${y+8}" text-anchor="middle" font-weight="700">${n}</text>`;});
 const desc=graph.arcs.map(([i,j,c],k)=>`${i} to ${j}: cost ${costs?costs[k]:c}${flows?', flow '+flows[k]:''}${tree.includes(k)?', basic arc':''}`).join('; ');
 return `<figure class="dy-figure nm-network"><svg viewBox="0 0 590 365" role="img" aria-label="${desc}">${svg}</svg><figcaption>${caption||(flows?'Arrow: original arc direction. Labels: current flow. Thick maroon arcs form the basis tree.':'Arrow: original arc direction. Labels: cost per unit. Node balances are stated beside the graph.')}</figcaption></figure>`;
}
