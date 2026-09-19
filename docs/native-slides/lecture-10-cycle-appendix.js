/** Complete 3D cycling example, taught after Bland. Historical slide keys stay stable. */
import { cycleData } from './lecture-10-cycle-data.js';
import { cycleFigure, mountCycleFigure, cycleGeometryAudit } from './lecture-10-cycle-3d.js';
export const auditData = {
 convention:'[-f_B | cbar]; [B^-1 b | B^-1 A]', ...cycleData, geometry:cycleGeometryAudit,
 lexExample:{rows:[['1','0','5','3'],['2','4','6','-1'],['3','0','7','9']],enteringColumn:3,eligibleRows:[0,2],normalizedRows:[['1/3','0','5/3','1'],['1/3','0','7/9','1']],leavingRow:2},
 blandDeparture:{stateIndex:5,entering:1,leaving:3,step:'0',resultingValue:'0'},
};
function rationalTex(value){
 const text=String(value);if(!text.includes('/'))return text;
 const [n,d]=text.split('/').map(Number);let denominator=d;
 while(denominator%2===0)denominator/=2;while(denominator%5===0)denominator/=5;
 if(denominator===1)return String(n/d);
 return `${n<0?'-':''}\\frac{${Math.abs(n)}}{${d}}`;
}
const neg=value=>value==='0'?'0':value.startsWith('-')?value.slice(1):`-${value}`;
const sortedBasis=state=>[...state.basis].sort((a,b)=>a-b);
const basisTex=state=>`(${sortedBasis(state).map(j=>`x_${j}`).join(',')})`;
const nonbasic=state=>Array.from({length:7},(_,i)=>i+1).filter(j=>!state.basis.includes(j));
function expression(constant,coefficients,state){let result=constant==='0'?'':rationalTex(constant);coefficients.forEach((c,i)=>{if(c==='0'||state.basis.includes(i+1))return;const negative=c.startsWith('-'),m=negative?c.slice(1):c;result+=`${negative?'-':result?'+':''}${m==='1'?'':rationalTex(m)}x_${i+1}`;});return result||'0';}
function dictionary(state,{tag='',highlight=null}={}){
 const rows=sortedBasis(state).map(j=>{const row=state.tableau[state.basis.indexOf(j)+1];return `x_${j}&=${expression(row[0],row.slice(1).map(neg),state)}`;});
 rows.push(`f&=${expression(neg(state.tableau[0][0]),state.tableau[0].slice(1),state)}`);
 return `<div class="l10-math l10-cycle-dictionary" data-cycle-dictionary="${tag}" data-basis="${sortedBasis(state).join(',')}">\\[\\begin{aligned}${rows.join('\\\\')}\\end{aligned}\\]</div>`;
}
function cycleTableau(index,{trace='cycling',entering=null,leaving=null,label='',hideCaption=false}={}){
 const state=cycleData[trace].states[index];
 const ordered=[{variable:null,row:state.tableau[0]},...sortedBasis(state).map(j=>({variable:j,row:state.tableau[state.basis.indexOf(j)+1]}))];
 const rows=ordered.map(({variable,row})=>`<tr${variable===null?' data-l10-objective-row':''}${variable===leaving&&leaving!==null?' data-l10-leaving-row="true"':''}><th scope="row">\\(${variable===null?'R_0':`x_${variable}`}\\)</th>${row.map((v,j)=>`<td${j===entering?' data-l10-entering-column="true"':''}${j===0?' data-l10-tableau-rhs':''}>\\(${rationalTex(v)}\\)</td>`).join('')}</tr>`).join('');
 return `<div class="l10-table-wrap" tabindex="0" role="region" aria-label="${label||'3D cycling example tableau'}"><table class="l10-table l10-cycle-table" data-l10-cycle-tableau="${index}" data-cycle-trace="${trace}" data-basis="${sortedBasis(state).join(',')}"><caption${hideCaption?' class="ns-visually-hidden"':''}>${label||`After ${index} pivots`}</caption><thead><tr><th scope="col">row</th><th scope="col">column 0</th>${Array.from({length:7},(_,i)=>`<th scope="col">\\(x_${i+1}\\)</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function rowOperations(index,trace='cycling'){
 const state=cycleData[trace].states[index],pivot=cycleData[trace].pivots[index];
 // Row labels refer to the OLD basic variable, so sorting displayed rows does
 // not silently change the meaning of an operation.
 const leave=pivot.leaving,j=pivot.entering,old=state.tableau;
 const equations=[`P=R_{x_${leave}}/(${rationalTex(pivot.pivotElement)})`];
 sortedBasis(state).filter(v=>v!==leave).forEach(v=>{const coefficient=old[state.basis.indexOf(v)+1][j];equations.push(`R'_{x_${v}}=R_{x_${v}}${coefficient==='0'?'':`-(${rationalTex(coefficient)})P`}`);});
 equations.push(`R'_0=R_0-(${rationalTex(pivot.reducedCost)})P`);
 return `<p>Label each old constraint row by its basic variable. The normalized pivot row \\(P\\) becomes the new \\(x_${j}\\) row; display the resulting rows by increasing basic-variable index.</p><div class="l10-math">\\[\\begin{gathered}${equations.join('\\\\')}\\end{gathered}\\]</div>`;
}
function tableauExplore(index,trace='cycling',withPivot=true){return {
 id:`cycle-operations-${trace}-${index}`,label:'Tableau and row operations',title:withPivot?'Compute the next dictionary':'The same dictionary in tableau form',
 html:`${cycleTableau(index,{trace})}${withPivot?rowOperations(index,trace)+cycleTableau(index+1,{trace,label:'Result after the pivot'}):''}`,
};}
function figureSlide(render,options={}){
 const build=print=>{let markup=render(cycleFigure({...options,print}));
  const button=markup.match(/<button[^>]+data-explore="[^"]+"[^>]*>[^<]*<\/button>/)?.[0];
  if(button){markup=markup.replace(button,'');if(!print)markup=markup.replace('<div class="l10-cycle-camera-controls">','<div class="l10-cycle-camera-controls">'+button.replace('<button ','<button data-reveal="2" '));}
  return markup;};
 return {html:build(false),printHtml:build(true),onMount:mountCycleFigure};
}
const cycleReasons=[
 String.raw`\(\bar c_1=\bar c_2=-2\): choose \(x_1\) by index. But \(x_4=-0.6\theta\ge0\) forces \(\theta=0\). Three ratios tie; \(x_4\) leaves by index.`,
 String.raw`Zero tie: \(x_5\) leaves before \(x_6\) by index.`,
 String.raw`\(x_6\) is zero and would decrease. It blocks the move before the \(x_7\) bound of \(1/3\).`,
 String.raw`\(\bar c_4=\bar c_5=-2\): choose \(x_4\). All three zero ratios tie; \(x_1\) leaves.`,
 String.raw`Zero tie: \(x_2\) leaves before \(x_3\) by index.`,
 String.raw`\(\bar c_6=-45<-20=\bar c_1\): choose \(x_6\). Only \(x_3\) limits its increase.`,
];
function ratioMath(pivot,state){if(pivot!==cycleData.cycling.pivots[0])return `\\theta^*=\\min\\{${pivot.eligibleRatios.map(([,v])=>rationalTex(v)).join(',')}\\}=0`;return `\\theta^*=\\min\\left\\{${pivot.eligibleRatios.map(([v])=>{const row=state.tableau[state.basis.indexOf(v)+1];return `\\frac{${rationalTex(row[0])}}{${rationalTex(row[pivot.entering])}}`;}).join(',')}\\right\\}=0`;}
const cyclingSlides=cycleData.cycling.pivots.map((pivot,index)=>{
 const state=cycleData.cycling.states[index],explore=tableauExplore(index);
 return {key:`cycle-${index+1}-choose`,title:`3D Cycling: Pivot ${index+1}`,referencePages:[4+2*index,5+2*index,6+2*index,7+2*index].filter(p=>p<=18),className:'l10-cycle-slide l10-cycle-pivot-slide',
 ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra">
  <p>${index===0?'Choose the most negative reduced cost. Break ties by variable index.':`After pivot ${index}: same point \\(O=(0,0,0)\\), same \\(f=0\\).`}</p>
  ${dictionary(state,{tag:index})}
  <section class="l10-box l10-cycle-choice" data-tone="orange" data-reveal="1" data-l10-cycle-choice="${index+1}">
   <div class="l10-math">\[\bar c_${pivot.entering}=${rationalTex(pivot.reducedCost)},\qquad ${ratioMath(pivot,state)}.\]</div>
   <p>${cycleReasons[index]}</p>
  </section>
  <button type="button" class="ns-slide-action" data-explore="${explore.id}">Tableau</button>
 </section><section class="l10-cycle-visual">${fig}<p class="l10-cycle-nonbasic">Nonbasic: \(${nonbasic(state).map(j=>`x_${j}`).join(',')}\).<br><span data-reveal="2" data-l10-cycle-update="${index+1}"><strong>\(x_${pivot.entering}\) enters; \(x_${pivot.leaving}\) leaves.</strong></span></p></section></div>`,{index,proposal:true,planes:false}),explorations:[explore]};
});
const cycleInitial=cycleData.cycling.states[0];
const lexFourthPivotComparison=String.raw`<section><h3>Choosing the leaving row at pivot 4</h3>
 <p>\(x_4\) and \(x_5\) tie at reduced cost \(-2\); choose \(x_4\) by index. Move the dictionary terms to the left to form the tableau. In RHS, then \(x_1,\ldots,x_7\) order, these normalized-row prefixes settle the zero-ratio tie:</p>
 <table class="l10-table" data-cycle-lex-prefix><thead><tr><th>row</th><th>RHS</th><th>\(x_1\)</th><th>\(x_2\)</th></tr></thead><tbody>
 ${cycleData.lex.pivots[3].normalizedRows.map(r=>String.raw`<tr><th>\(R_{x_${r.variable}}/(${rationalTex(r.divisor)})\)</th>${r.entries.slice(0,3).map(v=>`<td>\\(${rationalTex(v)}\\)</td>`).join('')}</tr>`).join('')}
 </tbody></table><p>The \(x_3\) row is lexicographically smallest, so \(x_3\) leaves at \(\theta=0\). The cycling rule chose \(x_1\).</p></section>`;
function mountCycleSummary(context){
 const cleanup=mountCycleFigure(context),root=context.slideElement.querySelector('[data-cycle-summary]');if(!root)return cleanup;
 const widget=root.querySelector('[data-cycle-widget]'),copies=[...root.querySelectorAll('[data-cycle-summary-state]')],buttons=[...root.querySelectorAll('[data-cycle-summary-action]')];let index=0,timer=0;
 const storage='ise5405:cycle3d:summary:v1';try{index=Math.max(0,Math.min(6,Number(localStorage.getItem(storage))||0));}catch{}
 const update=()=>{copies.forEach(c=>c.hidden=Number(c.dataset.cycleSummaryState)!==index);widget.dataset.cycleState=index;widget.dispatchEvent(new Event('cycle-state'));root.querySelector('[data-cycle-summary-action="previous"]').disabled=index===0;root.querySelector('[data-cycle-summary-action="next"]').disabled=index===6;root.dataset.cycleSummaryIndex=index;try{localStorage.setItem(storage,index);}catch{}};
 const stop=()=>{clearTimeout(timer);timer=0;};
 const handlers=buttons.map(b=>{const f=()=>{stop();const action=b.dataset.cycleSummaryAction;index=action==='restart'?0:Math.max(0,Math.min(6,index+(action==='next'?1:-1)));update();context.announce(`After ${index} pivots: basis ${sortedBasis(cycleData.cycling.states[index]).join(', ')}. Point (0,0,0); objective zero.`);};b.addEventListener('click',f);return [b,f];});
 update();return ()=>{stop();handlers.forEach(([b,f])=>b.removeEventListener('click',f));cleanup?.();};
}
export const appendixSlides=[

 {key:'cycle-model',title:'Can Simplex Cycle? A Three-Dimensional Example',referencePages:[3,4],className:'l10-cycle-slide',
 ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra"><p>A zero-length pivot changes the basis. Can several such pivots return to the starting basis?</p>
 <div class="l10-math">\[\begin{aligned}
 \min\quad f&=-2x_1-2x_2+9x_3\\
 \text{s.t.}\quad 0.6x_1-6.4x_2+4.8x_3&\le0,\\
 0.2x_1-1.8x_2+0.6x_3&\le0,\\
 0.4x_1-1.6x_2+0.2x_3&\le0,\\
 x_2&\le1,\\x_1,x_2,x_3&\ge0.
 \end{aligned}\]</div>
 <section class="l10-box" data-tone="blue" data-reveal="1"><p>Start at the apex \(O=(0,0,0)\), with \(f=0\). Several constraints are tight there.</p></section></section><section class="l10-cycle-visual">${fig}</section></div>`),},
 {key:'cycle-dictionary',title:'Start with the Slack Dictionary',referencePages:[4],className:'l10-cycle-slide l10-cycle-dictionary-start',
 ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra"><p>Add nonnegative slacks \(x_4,x_5,x_6,x_7\), in constraint order.</p>
 <div data-l10-initial-dictionary>${dictionary(cycleInitial,{tag:0})}</div>
 <section data-reveal="1" data-l10-dictionary-objective><p>Slacks have zero cost: \(f\) already uses only nonbasic variables.</p></section>
 <section class="l10-box" data-tone="blue" data-reveal="2"><p>Set \(x_1=x_2=x_3=0\). Then \((x_4,x_5,x_6,x_7)=(0,0,0,1)\).</p><p>Three basic variables are zero: this basis is <strong>degenerate</strong>.</p></section><a class="ns-link-button l10-cycle-route" data-print="omit" data-l10-slide-link="appendix-cycle-closed" href="#slide=1">Compare the pivot rules</a></section><section class="l10-cycle-visual">${fig}<p>A tight plane may touch the pyramid only at O.</p></section></div>`,{planes:true}),},
 {key:'cycle-tableau-format',title:'From Dictionary Equations to a Tableau',referencePages:[4,5],className:'l10-tableau-slide l10-tableau-introduction',
 html:String.raw`<p>A <strong>tableau</strong> records right-hand sides and left-hand coefficients. Columns and basic-variable rows follow increasing variable index.</p>
 <section data-l10-tableau-constraint><div class="l10-math">\[x_4=-0.6x_1+6.4x_2-4.8x_3\ \Longleftrightarrow\ 0.6x_1-6.4x_2+4.8x_3+x_4=0.\]</div></section>
 <section data-reveal="1" data-l10-tableau-objective><div class="l10-math">\[f=-2x_1-2x_2+9x_3\ \Longleftrightarrow\ -f-2x_1-2x_2+9x_3=0.\]</div></section>
 <section data-reveal="2" data-l10-tableau-format>${cycleTableau(0,{hideCaption:true})}<p>\(R_0\) omits the \(-f\) coefficient. Column 0 stores \(-f_B=0\); the remaining entries are reduced costs.</p></section>`,},
 ...cyclingSlides,
 {key:'cycle-6-result',title:'After Pivot 6: The Initial Dictionary Returns',referencePages:[16,17,18],className:'l10-cycle-slide',
 ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra"><p>\(x_6\) entered and \(x_3\) left. Compare this with our first dictionary:</p>${dictionary(cycleData.cycling.states[6],{tag:6})}<section class="l10-box" data-tone="orange" data-reveal="1"><p><strong>Every coefficient is restored.</strong> The basis is \((x_4,x_5,x_6,x_7)\), and the point is still O.</p></section><p data-reveal="2">The same rules choose \(x_1\) again. The entire six-pivot sequence repeats.</p></section><section class="l10-cycle-visual">${fig}<p>Six basis changes. No displacement. No change in \(f=0\).</p></section></div>`,{index:6,planes:true}),},
 {key:'cycle-closed',title:'A Cycle of Bases at One Fixed Point',referencePages:[16,17,18],className:'l10-cycle-slide',
 html:String.raw`<div class="l10-cycle-layout" data-cycle-summary><section class="l10-cycle-algebra"><p>Step through the six basis changes at O.</p><div class="l10-cycle-summary-states">${cycleData.cycling.states.map((s,i)=>`<section data-cycle-summary-state="${i}"${i?' hidden':''}><h3>After ${i} pivots</h3><p>\\(\\mathcal B=${basisTex(s)}\\)</p><p>\\(\\mathcal N=(${nonbasic(s).map(j=>`x_${j}`).join(',')})\\)</p><section class="l10-box" data-tone="orange"><p>Point \\(O=(0,0,0)\\), objective \\(f=0\\).</p><p>${i===6?'The initial basis returns.':`Next: \\(x_${cycleData.cycling.pivots[i].entering}\\) enters; \\(x_${cycleData.cycling.pivots[i].leaving}\\) leaves.`}</p></section></section>`).join('')}</div><div class="l10-cycle-summary-controls"><button type="button" data-cycle-summary-action="restart">Restart</button><button type="button" data-cycle-summary-action="previous">Previous basis</button><button type="button" data-cycle-summary-action="next">Next basis</button></div><p data-reveal="1"><strong>Same dictionary ⇒ same six choices again.</strong></p><a class="ns-link-button l10-cycle-route" data-l10-slide-link="appendix-cycle-1-choose" href="#slide=1">See the six cycling pivots</a></section><section class="l10-cycle-visual">${cycleFigure({planes:true})}</section></div>`,
 printHtml:String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra"><p>Each row lists basic-variable indices. Every row represents the same point O, with \(f=0\).</p><table class="l10-table"><thead><tr><th>After pivot</th><th>Basis indices</th></tr></thead><tbody>${cycleData.cycling.states.map((s,i)=>`<tr><td>${i}</td><td>\\(${sortedBasis(s).join(',')}\\)</td></tr>`).join('')}</tbody></table><section class="l10-box" data-tone="orange"><p>After six zero-length pivots, the initial dictionary returns. The same choices repeat forever.</p></section><p>An anticycling rule must prevent repeated bases.</p></section><section>${cycleFigure({index:6,planes:true,print:true})}<p>The geometry stays fixed while the basis changes.</p></section></div>`,onMount:mountCycleSummary,
 },
  {
    key:'lex-cycle-example',title:'The Lex Rule Breaks the 3D Cycle at Pivot 4',referencePages:[23,37],className:'l10-cycle-slide',
    ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra">
      <p><strong>Before pivot 4:</strong> the first three pivots match the cycling run.</p>
      ${dictionary(cycleData.lex.states[3],{tag:'lex-3'})}
      <section data-reveal="1"><p>\(x_4\) enters (tie by index). Compare rows in RHS, then \(x_1,\ldots,x_7\) order.</p><p><strong>\(x_3\) leaves at \(\theta=0\).</strong> The cycling rule chose \(x_1\).</p></section>
      <section class="l10-box" data-tone="green" data-reveal="2"><p>Pivot 5: \(x_5\) enters, \(x_7\) leaves at \(\theta=1\). We reach \((4,1,0)\), with \(f=-10\).</p></section>
      <button type="button" class="ns-slide-action" data-explore="lex-cycle-dictionaries">All five pivots</button>
    </section><section class="l10-cycle-visual"><p><strong>Pivot 5:</strong> move from O to V.</p>${fig}</section></div>`,{trace:'lex',index:4,edge:true}),
    explorations:[{id:'lex-cycle-dictionaries',label:'All five pivots and dictionaries',title:'The complete natural-order lexicographic run',html:String.raw`<p>Keep RHS, then \(x_1,\ldots,x_7\), throughout. The first three pivots match the cycling sequence. Pivot 4 changes the leaving choice; pivot 5 reaches the optimum.</p>${cycleData.lex.states.map((s,i)=>String.raw`<section><h3>${i===0?'Initial dictionary':`After pivot ${i}`}</h3>${i?String.raw`<p>\(x_${cycleData.lex.pivots[i-1].entering}\) enters; \(x_${cycleData.lex.pivots[i-1].leaving}\) leaves; \(\theta=${rationalTex(cycleData.lex.pivots[i-1].step)}\).</p>`:''}${dictionary(s,{tag:'lex-'+i})}${i===3?lexFourthPivotComparison:''}</section>`).join('')}<p>The final nonbasic objective coefficients are positive. The final feasible dictionary is optimal.</p>`}],
  },
  {
    key:'bland-cycle-departure',title:'Bland Changes the Sixth Pivot',referencePages:[12,13,39],className:'l10-cycle-slide l10-cycle-pivot-slide',
    ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra"><p><strong>Before pivot 6:</strong> after five pivots.</p>
     ${dictionary(cycleData.bland.states[5],{tag:'bland-5'})}
     <section class="l10-box" data-tone="blue" data-reveal="1" data-l10-cycle-choice="bland"><div class="l10-math">\[\bar c_1=-20,\qquad\bar c_6=-45.\]</div><p>Most-negative pricing chooses \(x_6\). Bland chooses the smaller eligible index, \(x_1\).</p></section>
     <section data-reveal="2"><p><strong>\(x_1\) enters; \(x_3\) leaves at \(\theta=0\).</strong> The new basis is \((x_1,x_4,x_5,x_7)\). Still O; a different basis.</p></section>
    </section><section class="l10-cycle-visual">${fig}</section></div>`,{trace:'bland',index:5,proposal:true}),
  },
  {
    key:'bland-positive-step',title:'The Next Pivot Leaves the Apex',referencePages:[39,40],className:'l10-cycle-slide',
    ...figureSlide(fig=>String.raw`<div class="l10-cycle-layout"><section class="l10-cycle-algebra"><p>After Bland’s sixth pivot:</p>${dictionary(cycleData.bland.states[6],{tag:'bland-6'})}
     <section data-reveal="1"><p>Only \(x_2\) has negative reduced cost. Keep \(x_3=x_6=0\); set \(x_2=\theta\).</p><div class="l10-math">\[x_1=4\theta,\quad x_7=1-\theta,\quad 0\le\theta\le1.\]</div></section>
     <section class="l10-box" data-tone="green" data-reveal="2"><p>At \(\theta=1\), \(x_7\) leaves.<br>We reach \(V=(4,1,0)\) with \(f=-10\).</p></section>
     <button type="button" class="ns-slide-action" data-explore="bland-final-dictionary">Dictionary</button>
    </section><section class="l10-cycle-visual">${fig}</section></div>`,{trace:'bland',index:6,edge:true}),
    explorations:[{id:'bland-final-dictionary',label:'Final dictionary',title:'The final dictionary certifies optimality',html:String.raw`${dictionary(cycleData.bland.states[7],{tag:'bland-7'})}<p>At \(x_3=x_6=x_7=0\), the point is \((4,1,0)\) and \(f=-10\). Every nonbasic objective coefficient is nonnegative: no feasible point has smaller cost.</p>`}],
  },
].map(slide=>({...slide,
 key:`appendix-${slide.key}`,
 title:slide.key==='cycle-model'?'Appendix: A Three-Dimensional Cycling Example':slide.title,
 referencePages:[],
}));
