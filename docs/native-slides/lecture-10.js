/**
 * Public Lecture 6: cycling, lexicographic pivoting, and Bland's rule.
 * Complete calculations and the algebraic proof remain in the appendix.
 */
import { anticyclingSlides, lexComparisonSlides, lexProofSlides, auditData as anticyclingAudit } from './lecture-10-anticycling.js';
import { appendixSlides, auditData as appendixAudit } from './lecture-10-cycle-appendix.js';
import { efficiencyPreviewSlides, auditData as efficiencyPreviewAudit } from './lecture-10-efficiency-preview.js';

export const metadata = {
  id: 'lecture-10', number: 10,
  title: 'Simplex II: Cycling and Anticycling',
  subtitle: 'Lecture 6 · Lexicographic Pivoting and Bland’s Rule',
  course: 'ISE 5405 · Optimization I',
  homeUrl: '../../', pdfUrl: '../../materials/lecture_10.pdf', whiteboards: 3,
};

// The short closing demonstration reuses the exact appendix models, controls,
// and print states. Unique slide IDs keep its reveal history independent.
const capstoneKeys = ['cycle-model', 'cycle-closed', 'lex-cycle-example',
  'bland-cycle-departure', 'bland-positive-step'];
const capstoneSlides = capstoneKeys.map(key => {
  const source = appendixSlides.find(s => s.key === 'appendix-' + key);
  if (!source) throw new Error('Missing 3D capstone source: ' + key);
  return {...source, key: 'capstone-' + key,
    title: key === 'cycle-model' ? 'Compare the Rules on a Three-Dimensional LP' : source.title,
    checkpoint: undefined};
});
const sections = [
  {title: '3.4 · Cycling and anticycling', slides: anticyclingSlides},
  {title: '3D · Comparing anticycling rules', slides: capstoneSlides},
  {title: 'Finite termination and computational effort', slides: efficiencyPreviewSlides},
];
const intro = {
  key: '01', kind: 'title', title: metadata.title, referencePages: [1],
  html: String.raw`<p class="ns-lead">How can simplex keep changing bases without moving—and how can we prevent a cycle?</p>
    <nav class="l10-contents l10-title-contents" aria-label="Simplex II sections">` +
    sections.map((s,i) => '<a data-l10-section-link="' + i + '" href="#slide=1">' + s.title + '</a>').join('') +
    '<a data-l10-appendix-link href="#slide=1">Appendix · Complete 3D calculations, practice, and proof</a></nav>' +
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
    <p>The appendix contains the complete 3D dictionaries, Example 3.7, and the algebraic proof of Theorem 3.4.</p>
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
assembled.push(...appendixSlides.map(s => ({...s, section: 'Appendix · Complete 3D cycling example'})));
assembled.push(...lexComparisonSlides.map(s => ({...s, section: 'Appendix · Lexicographic comparison practice'})));
assembled.push(...lexProofSlides.map(s => ({...s, section: 'Appendix · Proof of Theorem 3.4'})));
export const slides = assembled.map((s,i) => ({
  ...s, id: 'l10-' + s.key, page: i + 1, eyebrow: s.section,
  html: s.html.replace(/data-l10-section-link="(\d+)" href="#slide=1"/g,
    (_,n) => 'data-l10-section-link="' + n + '" href="#slide=' + starts[Number(n)] + '"')
    .replace('data-l10-appendix-link href="#slide=1"', 'data-l10-appendix-link href="#slide=' + appendixStart + '"'),
}));
export const referenceMap = slides.map(({id,page,title,section,referencePages}) => ({id,page,title,section,referencePages}));
export const auditData = {anticycling: anticyclingAudit, appendix: appendixAudit, efficiencyPreview: efficiencyPreviewAudit};
export const deck = {schemaVersion: 1, id: metadata.id, number: metadata.number,
  title: metadata.title, metadata, styles: new URL('./lecture-10.css', import.meta.url).href, slides};
export default deck;
