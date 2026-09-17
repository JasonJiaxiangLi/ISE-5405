/**
 * Public Lecture 6: cycling, lexicographic pivoting, and Bland's rule.
 * The complete 3D example follows Bland's rule; the full proof is in the appendix.
 */
import { anticyclingSlides, lexComparisonSlides, lexProofSlides, auditData as anticyclingAudit } from './lecture-10-anticycling.js';
import { appendixSlides as cycleExampleSlides, auditData as cycleAudit } from './lecture-10-cycle-appendix.js';
import { efficiencyPreviewSlides, auditData as efficiencyPreviewAudit } from './lecture-10-efficiency-preview.js';

export const metadata = {
  id: 'lecture-10', number: 10,
  title: 'Simplex II: Cycling and Anticycling',
  subtitle: 'Lecture 6 · Lexicographic Pivoting and Bland’s Rule',
  course: 'ISE 5405 · Optimization I',
  homeUrl: '../../', pdfUrl: '../../materials/lecture_10.pdf', whiteboards: 3,
};

// Keep the original slide keys so the full example retains its saved state.
// The historical "appendix-" keys no longer determine its teaching section.
const cycleSlides = cycleExampleSlides.map(s => ({...s,
  title: s.key === 'appendix-cycle-model' ? 'Compare the Rules on a Three-Dimensional LP' : s.title,
}));
const sections = [
  {title: '3.4 · Cycling and anticycling', slides: anticyclingSlides},
  {title: '3D · Comparing anticycling rules', slides: cycleSlides},
  {title: 'Finite termination and computational effort', slides: efficiencyPreviewSlides},
];
const intro = {
  key: '01', kind: 'title', title: metadata.title, referencePages: [1],
  html: String.raw`<p class="ns-lead">How can simplex keep changing bases without moving—and how can we prevent a cycle?</p>
    <nav class="l10-contents l10-title-contents" aria-label="Simplex II sections">` +
    sections.map((s,i) => '<a data-l10-section-link="' + i + '" href="#slide=1">' + s.title + '</a>').join('') +
    '<a data-l10-appendix-link href="#slide=1">Appendix · Lexicographic practice and proof</a></nav>' +
    '<p>Lecture 6 · Bertsimas–Tsitsiklis §3.4</p>' +
    '<div class="ns-title-shortcuts"><span><kbd>→</kbd> / <kbd>Space</kbd> reveal or advance</span><span><kbd>M</kbd> slide menu</span><span><kbd>K</kbd> checkpoint</span><span><kbd>H</kbd> handout view</span></div>',
};
const sources = {
  key: 'sources', title: 'Review Anticycling and Continue to Simplex III', referencePages: [1, 2],
  html: String.raw`<div class="l10-stack">
    <section class="l10-box" data-tone="blue"><h3>Check your understanding</h3>
      <p>Explain why a zero-length pivot can change the basis. Apply lexicographic comparison and Bland’s two index choices. Distinguish finite termination from a small pivot count.</p></section>
    <section class="l10-box" data-tone="green"><h3>Next: find a starting basis</h3>
      <p><a href="../lecture-11/#slide=1">Simplex III: Two-Phase Simplex, Geometry, and Efficiency</a> constructs the first feasible basis, then connects pivots to geometry and computational work.</p></section>
    <p><strong>Textbook:</strong> Bertsimas and Tsitsiklis, <em>Introduction to Linear Optimization</em>, §3.4; Theorem 3.4 for the full lexicographic proof. Section 3.7 develops the efficiency questions.</p>
    <p><strong>3D example:</strong> <a href="https://arxiv.org/abs/2101.01805">Cycling problems in linear programming, Problem 7</a>.</p>
    <p>The appendix contains Example 3.7 and the algebraic proof of Theorem 3.4. The complete 3D dictionaries accompany the worked example.</p>
  </div>`,
};
let assembled = [{...intro, section: 'Simplex II · Overview'}];
const starts = [];
for (const section of sections) {
  starts.push(assembled.length + 1);
  assembled.push(...section.slides.map(s => ({...s, section: section.title})));
}
assembled.push({...sources, section: 'Simplex II · Study guide'});
const appendixStart = assembled.length + 1;
assembled.push(...lexComparisonSlides.map(s => ({...s, section: 'Appendix · Lexicographic comparison practice'})));
assembled.push(...lexProofSlides.map(s => ({...s, section: 'Appendix · Proof of Theorem 3.4'})));
const pageByKey = new Map(assembled.map((s,i) => [s.key, i + 1]));
export const slides = assembled.map((s,i) => ({
  ...s, id: 'l10-' + s.key, page: i + 1, eyebrow: s.section,
  html: s.html.replace(/data-l10-section-link="(\d+)" href="#slide=1"/g,
    (_,n) => 'data-l10-section-link="' + n + '" href="#slide=' + starts[Number(n)] + '"')
    .replace('data-l10-appendix-link href="#slide=1"', 'data-l10-appendix-link href="#slide=' + appendixStart + '"')
    .replace(/data-l10-slide-link="([^"]+)" href="#slide=1"/g, (_,key) => {
      if (!pageByKey.has(key)) throw new Error('Missing slide-link target: ' + key);
      return 'data-l10-slide-link="' + key + '" href="#slide=' + pageByKey.get(key) + '"';
    }),
}));
export const referenceMap = slides.map(({id,page,title,section,referencePages}) => ({id,page,title,section,referencePages}));
export const auditData = {anticycling: anticyclingAudit, appendix: cycleAudit, efficiencyPreview: efficiencyPreviewAudit};
export const deck = {schemaVersion: 1, id: metadata.id, number: metadata.number,
  title: metadata.title, metadata, styles: new URL('./lecture-10.css', import.meta.url).href, slides};
export default deck;
