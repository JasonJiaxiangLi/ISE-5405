/**
 * Public Lecture 6: complete native adaptation of the faculty-authorized
 * Simplex Method, Part 2 reference (§§3.4–3.7).
 * Reference overlay pages map to semantic pages and cumulative reveals below.
 */
import { anticyclingSlides, auditData as anticyclingAudit } from './lecture-10-anticycling.js';
import { phaseOneSlides, auditData as phaseOneAudit } from './lecture-10-phase-one.js';
import { geometrySlides, auditData as geometryAudit } from './lecture-10-geometry.js';
import { efficiencySlides, auditData as efficiencyAudit } from './lecture-10-efficiency.js';

export const metadata = {
  id: 'lecture-10', number: 10,
  title: 'Simplex II: Completing the Simplex Method',
  subtitle: 'Lecture 6 · Anticycling, Initialization, Geometry, and Efficiency',
  course: 'ISE 5405 · Optimization I', date: '2026-09-15',
  homeUrl: '../../', pdfUrl: '../../materials/lecture_10.pdf', whiteboards: 3,
};
const sections = [
  {title:'3.4 · Anticycling', slides:anticyclingSlides},
  {title:'3.5 · Finding an initial feasible basis', slides:phaseOneSlides},
  {title:'3.6 · Column geometry', slides:geometrySlides},
  {title:'3.7 · Computational efficiency', slides:efficiencySlides},
];
const intro = [
  {
    key:'01', kind:'title', title:metadata.title, referencePages:[1],
    html:String.raw`<p class="ns-lead">What turns a pivot procedure into a complete algorithm?</p>
      <nav class="l10-contents l10-title-contents" aria-label="Simplex II sections">${sections.map((s,i)=>`<a data-l10-section-link="${i}" href="#slide=1">${s.title}</a>`).join('')}</nav>
      <p>Lecture 6 · September 15, 2026 · Bertsimas–Tsitsiklis §§3.4–3.7</p>
      <p class="l10-note">Adapted from Robert Hildebrand’s faculty reference, which credits Alberto Del Pia. Additional explanations and exact interactive examples by Jiaxiang Li.</p>
      <div class="ns-title-shortcuts"><span><kbd>→</kbd> / <kbd>Space</kbd> reveal or advance</span><span><kbd>←</kbd> previous step</span><span><kbd>M</kbd> slide menu</span><span><kbd>K</kbd> checkpoint</span><span><kbd>H</kbd> handout view</span></div>`,
  },
];
const sources = {
  key:'sources', title:'References and paths for independent study', referencePages:[1,2],
  html:String.raw`<div class="l10-source-list"><p><strong>Primary course reference:</strong> Robert Hildebrand’s 2025 faculty handoff, <em>The Simplex Method, Part 2</em> (the source deck credits Alberto Del Pia).</p><p><strong>Textbook:</strong> Bertsimas and Tsitsiklis, <em>Introduction to Linear Optimization</em>, §§3.4–3.7. Example and theorem numbers follow this source.</p><p><strong>Further reading:</strong> <a href="https://arxiv.org/abs/1006.2814">Santos: the Hirsch counterexample</a>; <a href="https://www.cs.yale.edu/homes/spielman/simplex/">Spielman and Teng: smoothed analysis</a>; <a href="https://arxiv.org/abs/2502.18019">Disser and Mosis: the pivot-rule complexity question</a>.</p><p>For practice, recompute a cycling pivot, finish Phase I before checking its solution, and explain the difference between a short graph path and an improving simplex path.</p></div>`,
};
let assembled=[...intro.map(s=>({...s,section:'Simplex II · Overview'}))];
const starts=[];
for(const section of sections){
  starts.push(assembled.length+1);
  assembled.push(...section.slides.map(s=>({...s,section:section.title})));
}
assembled.push({...sources,section:'Simplex II · Study guide'});
export const slides=assembled.map((s,i)=>({
  ...s, id:`l10-${s.key}`, page:i+1, eyebrow:s.section,
  html:s.html.replace(/data-l10-section-link="(\d+)" href="#slide=1"/g,(_,n)=>`data-l10-section-link="${n}" href="#slide=${starts[Number(n)]}"`),
}));
export const referenceMap=slides.map(({id,page,title,section,referencePages})=>({id,page,title,section,referencePages}));
export const auditData={anticycling:anticyclingAudit,phaseOne:phaseOneAudit,geometry:geometryAudit,efficiency:efficiencyAudit};
export const deck={schemaVersion:1,id:metadata.id,number:metadata.number,title:metadata.title,metadata,styles:new URL('./lecture-10.css',import.meta.url).href,slides};
export default deck;
