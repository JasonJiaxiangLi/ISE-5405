/** Duality II: optimality, complementary slackness, and the simplex certificate. */
import { problem46, dual46, box, math, figure46 } from './duality-common.js';
const raw = String.raw;
const p = s => `<p>${s}</p>`;
const pair = (text, figure) => `<div class="dy-pair"><div class="dy-stack">${text}</div>${figure}</div>`;
const table = (headers, rows) => `<div class="dy-table-wrap"><table class="dy-table"><thead><tr>${headers.map(s => `<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((s,i) => `<${i ? 'td' : 'th scope="row"'}>${s}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const slide = (key,title,html,referencePages,options={}) => ({ key,id:`l19-${key}`,title,html,referencePages,className:'dy-slide',...options });
const checkpoint = (prompt,choices,correctIndex,explanation) => ({ prompt,choices,correctIndex,explanation,autoOpen:true });
const link = (key,label) => `<a data-d19-link="${key}" href="#slide=1">${label}</a>`;
const equalityPair = () => math(raw`\begin{aligned}(P)\quad&\min c^\top x &&\text{s.t. }Ax=b,\ x\ge0,\\(D)\quad&\max b^\top p &&\text{s.t. }A^\top p\le c,\ p\text{ unrestricted}.\end{aligned}`);
const inequalityPair = () => math(raw`\begin{aligned}(P)\quad&\min c^\top x &&\text{s.t. }Ax\ge b,\ x\ge0,\\(D)\quad&\max b^\top p &&\text{s.t. }A^\top p\le c,\ p\ge0.\end{aligned}`);

function inactiveFigure() {
  const plot = (offset, remove) => {
    const xy = ([x,y]) => [offset+45+68*x,285-55*y];
    const polygon = points => points.map(v=>xy(v).join(',')).join(' ');
    const line = (a,b,stroke,width=3,dash='') => {const u=xy(a),v=xy(b);return `<line x1="${u[0]}" y1="${u[1]}" x2="${v[0]}" y2="${v[1]}" stroke="${stroke}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;};
    const q=xy([1,1]);
    return `<g><text x="${offset+175}" y="28" text-anchor="middle">${remove?'Remove the upper bound':'Keep all constraints'}</text>
      <polygon points="${polygon(remove?[[1,1],[4,1],[4,4],[1,4]]:[[1,1],[4,1],[1,4]])}" fill="#dceef5"/>
      ${line([0,0],[4.3,0],'#465963',2)}${line([0,0],[0,4.3],'#465963',2)}
      ${line([1,1],[4,1],'#326b8c')}${line([1,1],[1,4],'#326b8c')}${line([1,4],[4,1],remove?'#8d9da5':'#b95013',3,remove?'7 5':'')}
      ${line([0,2],[2,0],'#177441',3)}
      <circle cx="${q[0]}" cy="${q[1]}" r="7" fill="#861f41"/><text x="${q[0]+10}" y="${q[1]-9}">(1,1)</text>
      <text x="${offset+323}" y="303">x₁</text><text x="${offset+13}" y="45">x₂</text>
      <text x="${offset+150}" y="325">minimum cost = 2</text>
      ${remove?`<text x="${offset+180}" y="68" text-anchor="middle">continues upward/right</text>`:''}</g>`;
  };
  return `<figure class="dy-figure"><svg viewBox="0 0 770 340" role="img" aria-label="The LP minimizes x1+x2 with x1 and x2 at least 1 and x1+x2 at most 5. Its optimum is (1,1), cost 2. Removing the inactive upper bound enlarges the feasible region to an unbounded quadrant but keeps the same optimum.">${plot(0,false)}${plot(400,true)}</svg></figure>`;
}

export const metadata = {
  id:'lecture-19',number:19,title:'Duality II: Optimality and Complementary Slackness',
  subtitle:'Lecture 10 · Proving That a Solution Is Best',course:'ISE 5405 · Optimization I',
  homeUrl:'../../',pdfUrl:'../../materials/lecture_19.pdf',whiteboards:3,
};
export const mainSlides = [
  slide('01',metadata.title,
    p('A feasible solution and a feasible dual bound can meet. When they do, we have a complete optimality certificate.')+
    box(p('<strong>Our route:</strong> strong duality → a numerical certificate → complementary slackness → the simplex connection.'))+
    p('We continue with minimization problems; their duals maximize lower bounds.')+
    '<nav class="dy-contents" aria-label="Duality II sections">'+link('retrieve-primal','Retrieve the example')+link('strong-duality','Strong duality')+link('complementary-slackness','Complementary slackness')+link('recover-weights','Recover the dual weights')+link('appendix-guide','Optional proofs and extensions')+'</nav>',[52,66],{kind:'title'}),

  slide('retrieve-primal','Recall the primal: a feasible point gives an upper bound',
    problem46()+
    box(p(raw`For example, \(x=(1,0,1)\) satisfies both equations and has cost \(19\). Therefore the minimum is at most \(19\).`))+
    p('Feasibility alone does not yet rule out a cheaper point.'),[75,76]),

  slide('retrieve-dual','Recall the dual: feasible weights give a lower bound',
    dual46()+
    box(p(raw`For every feasible primal \(x\) and feasible dual \(p\), weak duality gives`) + math(raw`8p_1+3p_2\le13x_1+10x_2+6x_3.`), 'blue')+
    p('The weights are unrestricted because the primal constraints are equalities. The three dual inequalities correspond to the three nonnegative primal variables.'),[47,51,75]),

  slide('strong-duality','Strong duality: the best bound reaches the best cost',
    equalityPair()+
    box(p('<strong>Theorem 4.4 — assumption:</strong> the primal LP is feasible and has a finite optimal value.'),'blue')+
    box(p('<strong>Conclusion:</strong> both primal and dual attain optimal solutions, and their optimal objective values are equal.')+math(raw`c^\top x^*=b^\top p^*.`), 'green')+
    p('The same statement holds starting from a finite dual optimum. Strong duality does not require nondegeneracy.'),[52,53]),

  slide('possible-outcomes','What can happen to a primal–dual pair?',
    table(['Primal minimization','Dual finite optimum','Dual unbounded above','Dual infeasible'],[
      ['Finite optimum','Possible: equal values','Impossible','Impossible'],
      ['Unbounded below','Impossible','Impossible','Possible'],
      ['Infeasible','Impossible','Possible','Possible'],
    ])+
    box(p('A finite optimum on one side gives a finite optimum on the other. If one problem is unbounded, the other must be infeasible.'))+
    p('An infeasible primal does not by itself prove that the dual is unbounded. '+link('both-infeasible','See an example in which both are infeasible.') ),[58,59,60,61,62,63]),

  slide('strong-duality-intuition','Why simplex can produce the matching bound',
    box(p('<strong>At a final simplex dictionary:</strong> every nonbasic reduced cost is nonnegative.'))+
    p('The row combinations used to form the objective row also give weights on the original equalities.')+
    box(p('Nonnegative reduced costs say that these weights are dual feasible. At the current basic solution, the weighted right-hand sides equal the current objective.'), 'green')+
    p('Weak duality checks a proposed certificate; strong duality guarantees that a matching certificate exists. The full proof is in the appendix.'),[54,55,56]),

  slide('check-primal','Check the proposed primal solution explicitly',
    p(raw`For the primal \(\min13x_1+10x_2+6x_3\), use \(x^*=(1,0,1)\).`) +
    math(raw`\begin{aligned}5(1)+0+3(1)&=8,\\3(1)+0&=3,\\x^*&\ge0.\end{aligned}`)+
    box(math(raw`c^\top x^*=13(1)+10(0)+6(1)=19.`), 'green')+
    p('This verifies primal feasibility and an upper bound of 19. Now check the lower-bound certificate.'),[75,76]),

  slide('check-dual','Check the proposed dual solution explicitly',
    pair(p(raw`Try \(p^*=(2,1)\). The dual maximizes \(8p_1+3p_2\), with unrestricted weights.`)+
      math(raw`\begin{aligned}5(2)+3(1)&=13\le13,\\2+1&=3\le10,\\3(2)&=6\le6.\end{aligned}`)+
      box(math(raw`b^\top p^*=8(2)+3(1)=19.`), 'green')+
      p('The point lies in the dual feasible region. Its lower bound matches the primal cost.'),figure46({point:[2,1],invalid:false})),[77,78],{
      checkpoint:checkpoint('Which facts are needed to certify both solutions as optimal?',[
        'Only that their objective values are equal.',
        'Primal feasibility, dual feasibility, and equal objective values.',
        'Only that both solutions are basic.',
        'Only that the primal solution has positive components.',
      ],1,'Weak duality compares feasible solutions. Equal objective values certify optimality only after both feasibility checks pass.'),
    }),

  slide('arithmetic-certificate','The certificate is a short arithmetic identity',
    p(raw`For every primal feasible \(x\), the equalities are \(5x_1+x_2+3x_3=8\) and \(3x_1+x_2=3\).`) +
    math(raw`\begin{aligned}13x_1+10x_2+6x_3
      &=2(5x_1+x_2+3x_3)+(3x_1+x_2)+7x_2\\
      &=19+7x_2\ge19.\end{aligned}`)+
    box(p(raw`Our feasible point has \(x_2=0\), so it attains the lower bound. Thus the primal and dual optimum is \(19\).`), 'green')+
    p('The unused amount 7 in the second dual inequality explains the extra term in this identity.'),[75,76,77,78]),

  slide('gap-equality','The objective gap is the sum of variable–slack products',
    p(raw`For \(Ax=b,\ x\ge0\), let \(p\) be dual feasible and define its <strong>dual slacks</strong> by \(r=c-A^\top p\ge0\).`) +
    math(raw`\begin{aligned}c^\top x-b^\top p
      &=c^\top x-p^\top Ax\\
      &=(c-A^\top p)^\top x\\
      &=\sum_j r_jx_j\ge0.\end{aligned}`)+
    box(p(raw`The gap is zero exactly when \(r_jx_j=0\) for every variable \(j\). Each summand is nonnegative.`), 'green')+
    p('Next we also allow slack in the primal constraints.'),[67,68]),

  slide('inequality-pair','With inequalities, both sides have slack',
    inequalityPair()+
    box(p(raw`Define the primal slacks \(s=Ax-b\ge0\) and the dual slacks \(r=c-A^\top p\ge0\).`))+
    p(raw`Here \(p\ge0\) because it weights ≥ constraints. In our equality example the weights are unrestricted and \(s=0\).`),[67,69]),

  slide('two-gap-terms','Add and subtract the same quantity to expose both gaps',
    p(raw`For a feasible pair in the inequality form, add and subtract \(p^\top Ax\):`) +
    math(raw`\begin{aligned}c^\top x-b^\top p
      &=c^\top x-p^\top Ax+p^\top Ax-p^\top b\\
      &=(c-A^\top p)^\top x+p^\top(Ax-b)\\
      &=\sum_jr_jx_j+\sum_ip_is_i.
    \end{aligned}`)+
    box(p('Every term is nonnegative. The total gap is zero exactly when every one of these products is zero.'), 'green'),[67,68,69]),

  slide('complementary-slackness','Complementary slackness: two feasible solutions are optimal',
    p(raw`Use the pair \(\min\{c^\top x:Ax\ge b,x\ge0\}\) and \(\max\{b^\top p:A^\top p\le c,p\ge0\}\).`)+
    box(p('<strong>Theorem 4.5 — assumption:</strong> x and p are feasible for their respective problems.'))+
    box(p('<strong>Conclusion:</strong> they are both optimal if and only if')+math(raw`\begin{aligned}p_i(a_i^\top x-b_i)&=0&&\text{for every row }i,\\x_j(c_j-A_j^\top p)&=0&&\text{for every variable }j.\end{aligned}`), 'green')+
    p('At optimality the total gap is zero; since every product is nonnegative, each must vanish.'),[67,68,69]),

  slide('complementary-pairs','Read each zero product carefully',
    table(['Product','If the first factor is positive…','If the slack is positive…'],[
      [raw`\(p_i s_i=0\)`,raw`\(p_i>0\Rightarrow s_i=0\): the primal row is tight.`,raw`\(s_i>0\Rightarrow p_i=0\): its weight is zero.`],
      [raw`\(x_j r_j=0\)`,raw`\(x_j>0\Rightarrow r_j=0\): the dual row is tight.`,raw`\(r_j>0\Rightarrow x_j=0\): that variable is unused.`],
    ])+
    box(p('A zero first factor does not force positive slack. Both factors may be zero.'), 'orange'),[69,70,71],{
      checkpoint:checkpoint('At an optimal feasible pair, the second primal variable is zero. Must its dual inequality have positive slack?',[
        'Yes: zero variables always correspond to positive dual slack.',
        'No: that dual slack may be zero or positive.',
        'No: it must be negative.',
        'Yes, unless the primal has equality constraints.',
      ],1,'The product is already zero when the primal variable is zero. Dual feasibility requires nonnegative slack, but complementary slackness does not force it to be strictly positive.'),
    }),

  slide('example-products','Our equality example has only the variable–slack products',
    p(raw`For \(x^*=(1,0,1)\) and \(p^*=(2,1)\), the dual slacks are \(r=(0,7,0)\).`) +
    table(['Variable',raw`\(x_j\)`,raw`\(r_j=c_j-A_j^\top p\)`,raw`\(x_jr_j\)`],[
      [raw`\(x_1\)`,'1','0','0'],[raw`\(x_2\)`,'0','7','0'],[raw`\(x_3\)`,'1','0','0'],
    ])+
    box(p(raw`All primal rows are equalities: \(Ax-b=0\). Thus \(p_i(a_i^\top x-b_i)=0\) automatically, even though \(p_i\) can have either sign.`), 'green')+
    p('The positive variables 1 and 3 identify the dual constraints that must be tight.'),[68,76,77]),

  slide('recover-weights','Recover the weights from the positive variables',
    p(raw`Suppose we know the optimal primal point \(x^*=(1,0,1)\). Complementary slackness gives`) +
    box(math(raw`\begin{aligned}x_1^*>0&\quad\Rightarrow\quad5p_1+3p_2=13,\\x_3^*>0&\quad\Rightarrow\quad3p_1=6.\end{aligned}`))+
    box(math(raw`p_1=2,\qquad p_2=1.`), 'green')+
    p(raw`Finally check the remaining dual inequality: \(p_1+p_2=3\le10\). Solving the tight equations proposes a candidate; this last feasibility check completes the certificate.`),[77,78]),

  slide('basis-matrix-reminder','The matrix equation packages the same two equalities',
    p(raw`The basic variables are \(x_1,x_3\), so their columns and costs are`) +
    math(raw`B=\begin{pmatrix}5&3\\3&0\end{pmatrix},\qquad c_{\mathcal B}=\begin{pmatrix}13\\6\end{pmatrix}.`)+
    box(math(raw`B^\top p=c_{\mathcal B}\quad\Longleftrightarrow\quad\begin{cases}5p_1+3p_2=13,\\3p_1=6.\end{cases}`), 'blue')+
    p(raw`This is the equation we just solved. Equivalently, \(p^\top=c_{\mathcal B}^\top B^{-1}\). No explicit inverse is needed here.`)+
    p('When all basic variables are positive, their tight constraints determine these weights uniquely.'),[79,80]),

  slide('reduced-costs-and-dual-feasibility','The simplex sign test is a dual-feasibility test',
    p(raw`For basis \(B\), compute \(p\) from \(B^\top p=c_{\mathcal B}\). Then`) +
    math(raw`\bar c_j=c_j-c_{\mathcal B}^\top B^{-1}A_j=c_j-p^\top A_j.`)+
    box(p(raw`Thus \(\bar c\ge0\) is exactly \(A^\top p\le c\): dual feasibility.`), 'blue')+
    box(p('If the current basic solution is also primal feasible, its cost equals the weighted right-hand sides. The feasible pair with equal values is an optimality certificate.'), 'green')+
    p('An optimal point may be degenerate. We need a basis whose reduced costs pass the sign test; an arbitrary basis representing that point need not do so.'),[80,81]),

  slide('nonoptimal-basis','Tight equations alone can propose the wrong weights',
    p(raw`Return to the same primal equations. Another feasible basic solution is \(x=(0,3,5/3)\), with cost \(40\).`) +
    math(raw`5(0)+3+3(5/3)=8,\qquad3(0)+3=3.`)+
    box(p('Its positive variables are 2 and 3. Making their dual inequalities tight gives')+math(raw`p_1+p_2=10,\qquad3p_1=6\quad\Rightarrow\quad p=(2,8).`), 'blue')+
    p('Does this candidate satisfy every dual inequality?'),[80,81]),

  slide('nonoptimal-dual-check','The missing dual inequality rejects that candidate',
    pair(p(raw`At \(p=(2,8)\), the first dual inequality fails:`)+
      math(raw`5p_1+3p_2=34>13.`)+
      box(p(raw`Its dual slack, and the reduced cost of \(x_1\), is \(13-34=-21\).`), 'orange')+
      p(raw`Although \(b^\top p=40=c^\top x\), this is not a valid lower bound: \(p\) is infeasible.`)+
      p('Equal values and complementary products cannot replace the feasibility checks.'),figure46({point:[2,8],invalid:true})),[81],{
      checkpoint:checkpoint('The tight equations give p=(2,8), and its weighted RHS equals the primal cost 40. Why is this not an optimality certificate?',[
        'The weights are not both nonnegative.',
        'The first dual inequality fails; matching objective values alone is insufficient.',
        'The primal point is not feasible.',
        'Complementary slackness applies only to maximization.',
      ],1,'Equality constraints allow unrestricted weights. The first dual left-hand side is 34, exceeding its allowed value 13. The proposed weights are infeasible, so weak duality does not certify 40 as a lower bound.'),
    }),

  slide('certificate-practice','Practice: construct and check a complete certificate',
    math(raw`\begin{aligned}\min\quad&2x_1+3x_2\\\text{s.t.}\quad&x_1+x_2\ge4,\qquad x_1,x_2\ge0.\end{aligned}`)+
    box(p(raw`Try the primal point \(x=(4,0)\).`))+
    '<ol><li>Write the one-variable dual.</li><li>Use the positive primal variable to find a candidate weight.</li><li>Check both feasibility and equality of the objective values.</li></ol>'+
    p('Then check both kinds of complementary products.'),[67,69,77]),

  slide('certificate-practice-answer','Practice answer: one weight certifies a cost of 8',
    math(raw`\max\ 4p\qquad\text{s.t.}\quad p\le2,\quad p\le3,\quad p\ge0.`)+
    box(p(raw`Since \(x_1=4>0\), its dual constraint is tight: \(p=2\). This satisfies every dual constraint.`))+
    box(math(raw`2(4)+3(0)=8=4(2).`)+p('Both points are feasible and their values match, so both are optimal.'), 'green')+
    math(raw`p\,s=2(4-4)=0,\qquad x_1r_1=4(2-2)=0,\qquad x_2r_2=0(3-2)=0.`),[67,69,77]),

  slide('study-guide','Use three checks before claiming optimality',
    box(p('<strong>1. Primal feasibility.</strong> Check every original constraint and variable sign.'))+
    box(p('<strong>2. Dual feasibility.</strong> Check every weight sign and dual constraint.'))+
    box(p('<strong>3. Matching values.</strong> Compare objective values, or check all complementary products.'),'green')+
    p('Bertsimas and Tsitsiklis §4.3, Theorems 4.4–4.5; Example 4.6.')+
    p('Next: interpret these same weights as prices and use weighted constraints to certify infeasibility.')+
    p(link('appendix-guide','Optional study: complete proofs, degeneracy, and additional examples')),[52,67,75]),
];

export const appendixSlides = [
  slide('appendix-guide','Optional proofs and extensions',
    '<nav class="dy-contents" aria-label="Duality II optional study">'+link('proof-setup','Strong duality: complete simplex proof')+link('both-infeasible','Example 4.5: both problems can be infeasible')+link('cs-proof','Complementary slackness: necessity and sufficiency')+link('degenerate-example','Why degeneracy changes multiplier recovery')+link('inactive-constraint','An inactive constraint and its zero weight')+link('clark','Feasible-set size versus objective boundedness')+'</nav>',[53,63,64,67,70,79]),

  slide('proof-setup','Strong duality proof: start with a terminating simplex run',
    equalityPair()+
    p(raw`First assume \(A\) has full row rank and the primal is feasible with a finite optimum.`)+
    box(p('Phase I supplies a feasible basis. Run Phase II with a valid anticycling rule. The LP is not unbounded, so the run terminates at a feasible basis whose reduced costs are nonnegative.'))+
    math(raw`x_{\mathcal B}=B^{-1}b\ge0,\qquad x_{\mathcal N}=0,\qquad c^\top-c_{\mathcal B}^\top B^{-1}A\ge0.`)+
    p('Basic values may be zero. The argument uses the final reduced-cost signs, not a nondegeneracy assumption.'),[53,54]),

  slide('proof-dual-feasibility','Strong duality proof: the final basis gives feasible weights',
    p(raw`Define \(p\) by \(B^\top p=c_{\mathcal B}\), or equivalently \(p^\top=c_{\mathcal B}^\top B^{-1}\).`)+
    box(math(raw`c^\top-p^\top A=c^\top-c_{\mathcal B}^\top B^{-1}A\ge0.`), 'blue')+
    box(math(raw`A^\top p\le c.`)+p('These are exactly the dual constraints. Equality rows impose no sign restriction on p.'), 'green')+
    p('Every basic dual inequality is tight. The nonbasic inequalities hold because the final reduced costs are nonnegative.'),[54]),

  slide('proof-equal-values','Strong duality proof: the objective values agree',
    p(raw`At this feasible basic solution, \(x_{\mathcal N}=0\) and \(x_{\mathcal B}=B^{-1}b\). Therefore`) +
    math(raw`\begin{aligned}b^\top p
      &=c_{\mathcal B}^\top B^{-1}b\\
      &=c_{\mathcal B}^\top x_{\mathcal B}\\
      &=c^\top x.\end{aligned}`)+
    box(p('We have primal feasibility, dual feasibility, and matching values. Weak duality proves that both solutions are optimal.'), 'green')+
    p('This proves strong duality for full-row-rank standard form, including degenerate optima.'),[55]),

  slide('proof-general-rows','Extend the proof: row signs and dependent equalities',
    box(p(raw`Replace \(a_i^\top x\ge b_i\) by \(a_i^\top x-s_i=b_i\), \(s_i\ge0\). Its zero-cost slack column gives \(-p_i\le0\), hence \(p_i\ge0\).`))+
    box(p(raw`Replace \(a_i^\top x\le b_i\) by \(a_i^\top x+s_i=b_i\). Its slack column gives \(p_i\le0\). Equality rows keep \(p_i\) unrestricted.`), 'blue')+
    box(p('For a feasible equality system, discard dependent rows until the remaining rows are independent. Extend any weights for the retained rows by zero on the discarded rows.'), 'green')+
    p(raw`Both \(A^\top p\) and \(b^\top p\) are unchanged by that extension, so the same certificate works for the original system.`),[56]),

  slide('proof-general-variables','Extend the proof: variable signs and the objective convention',
    box(p(raw`For a free variable, write \(x_j=u_j-v_j\), with \(u_j,v_j\ge0\). The two dual inequalities are`) +math(raw`A_j^\top p\le c_j,\qquad -A_j^\top p\le-c_j,`)+p(raw`which together say \(A_j^\top p=c_j\).`))+
    box(p(raw`For \(x_j\le0\), substitute \(x_j=-u_j\). The dual inequality becomes \(A_j^\top p\ge c_j\).`), 'blue')+
    p('These substitutions preserve feasible solutions and objective values. They recover the general dual sign rules from standard form.')+
    p('For a maximization primal, negate the objective to use the minimization proof, then undo that sign change. Dualizing the dual recovers the original problem, giving the symmetric theorem.'),[28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,56]),

  slide('both-infeasible','Example 4.5: both the primal and dual can be infeasible',
    p('In this example, the primal variables and the equality weights are unrestricted.')+
    math(raw`\begin{aligned}(P)\quad\min\ &x_1+2x_2&\quad\text{s.t. }&x_1+x_2=1,\quad2x_1+2x_2=3,\\(D)\quad\max\ &p_1+3p_2&\quad\text{s.t. }&p_1+2p_2=1,\quad p_1+2p_2=2.\end{aligned}`)+
    box(p('The primal equations disagree: twice the first left-hand side would have to equal both 2 and 3.'))+
    box(p('The dual equations also disagree: their identical left-hand sides would have to equal both 1 and 2.'), 'orange')+
    p('Thus primal infeasibility alone does not imply dual unboundedness.'),[63]),

  slide('cs-proof','Complementary slackness proof: both directions',
    p(raw`For feasible \(x,p\) in the inequality form, set \(s=Ax-b\ge0\), \(r=c-A^\top p\ge0\).`) +
    math(raw`c^\top x-b^\top p=\sum_jx_jr_j+\sum_ip_is_i.`)+
    '<div class="dy-proof" tabindex="0" role="region" aria-label="Complementary slackness proof">'+
    box(p('<strong>Necessity.</strong> If both points are optimal, strong duality says the gap is zero. Every summand is nonnegative, so each product must be zero.'), 'blue')+
    box(p('<strong>Sufficiency.</strong> If every product is zero, the gap is zero. The two feasible objective values agree; weak duality makes both points optimal.'), 'green')+
    p('For equality rows the primal slack is identically zero; their unrestricted multipliers cause no extra condition. The variable–dual-slack terms give the same conclusion.')+'</div>',[67,68,69]),

  slide('degenerate-example','A zero basic variable need not make its dual constraint tight',
    math(raw`\min\ x_1\quad\text{s.t. }x_1=0,\ x_1\ge0.`)+
    p(raw`The only basic solution is \(x_1=0\): it is optimal and degenerate. Its dual is`) +
    math(raw`\max\ 0p\quad\text{s.t. }p\le1,\quad p\text{ unrestricted}.`)+
    box(p(raw`Complementary slackness says \(0(1-p)=0\), which holds for every dual feasible \(p\). It does not determine a unique multiplier.`))+
    box(p(raw`The basis equation \(B^\top p=c_{\mathcal B}\) chooses \(p=1\), one valid optimal certificate. Strong duality still holds.`), 'green')+
    p('In a nondegenerate optimum, every basic variable is positive, so its dual constraint must be tight; that is why the recovery argument is stronger there.'),[79,80]),

  slide('inactive-constraint','An inactive constraint can have zero weight at optimum',
    math(raw`\min\ x_1+x_2\quad\text{s.t. }x_1\ge1,\ x_2\ge1,\ x_1+x_2\le5.`)+
    inactiveFigure()+
    p(raw`At \((1,1)\), the upper bound has slack \(3\) and its optimal multiplier is zero. Removing that bound enlarges the region but leaves the minimum \(2\).`),[70,71]),

  slide('inactive-constraint-argument','Why removing one inactive inequality preserves this optimum',
    p(raw`Let \(x^*\) be optimal and suppose one inequality is strict at \(x^*\). Remove that inequality.`)+
    box(p(raw`If a newly allowed point \(y\) had lower cost, then \(x(t)=(1-t)x^*+ty\) would also have lower cost for every \(t>0\).`), 'blue')+
    box(p(raw`For sufficiently small \(t>0\), the removed inequality would still hold because it had positive slack at \(x^*\). All other constraints hold along the segment by convexity.`), 'blue')+
    box(p('That would give a cheaper point in the original feasible set, contradicting optimality.'), 'green')+
    p('This explains the zero multiplier: the inactive inequality is unnecessary for a tight lower-bound certificate.'),[70,71]),

  slide('clark','An unbounded feasible set is not an unbounded objective',
    box(p('<strong>Clark’s theorem:</strong> unless both members of a primal–dual LP pair are infeasible, at least one has an unbounded feasible set. See textbook Exercise 4.21.'))+
    p(raw`For example, \(\min\{x:x\ge0\}\) has an unbounded feasible ray but a finite optimum \(0\).`)+
    box(p('“Unbounded feasible set” concerns where feasible points can go. “Unbounded minimization problem” means feasible objective values decrease without limit. These statements are different.'), 'orange')+
    p('This result is additional theory; the optimality certificate still uses the same three checks.'),[64]),
];
const assembled = [...mainSlides.map(s=>({...s,section:'Duality II · Optimality and complementary slackness'})),
  ...appendixSlides.map(s=>({...s,section:'Duality II · Optional proofs and extensions'}))];
const pages = new Map(assembled.map((s,i)=>[s.key,i+1]));
export const slides = assembled.map((s,i)=>({...s,page:i+1,eyebrow:s.section,
  html:s.html.replace(/data-d19-link="([^"]+)" href="#slide=1"/g,(_,key)=>{
    if(!pages.has(key))throw new Error(`Unknown Duality II link: ${key}`);
    return `data-d19-link="${key}" href="#slide=${pages.get(key)}"`;
  }),
}));
export const referenceMap = slides.map(({id,page,title,section,referencePages})=>({id,page,title,section,referencePages}));
export const auditData={A:[[5,1,3],[3,1,0]],b:[8,3],c:[13,10,6],primal:[1,0,1],dual:[2,1],value:19,dualSlacks:[0,7,0],badPrimal:[0,3,5/3],badDual:[2,8],badDualSlacks:[-21,0,0],practice:{primal:[4,0],dual:2,value:8}};
export const deck={schemaVersion:1,id:metadata.id,number:metadata.number,title:metadata.title,metadata,
  styles:new URL('./lecture-19.css',import.meta.url).href,slides};
export default deck;
