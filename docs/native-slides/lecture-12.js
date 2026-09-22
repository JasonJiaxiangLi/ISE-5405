/** Public Lecture 8: column geometry and computational efficiency. */
import { geometrySlides, auditData as geometryAudit } from './lecture-11-geometry.js';
import { efficiencySlides, auditData as efficiencyAudit } from './lecture-11-efficiency.js';

export const metadata = {
  id: 'lecture-12', number: 12,
  title: 'Simplex IV: Column Geometry and Efficiency',
  subtitle: 'Lecture 8 · The Geometry and Cost of a Pivot',
  course: 'ISE 5405 · Optimization I',
  homeUrl: '../../', pdfUrl: '../../materials/lecture_12.pdf', whiteboards: 3,
};
const sections = [
  {title: '3.6 · Column geometry', slides: geometrySlides},
  {title: '3.7 · Computational efficiency', slides: efficiencySlides},
];
const intro = {
  key: '01', id: 'l12-01', kind: 'title', title: metadata.title, referencePages: [2, 90, 121],
  html: String.raw`<p class="ns-lead">What does a pivot mean geometrically, and what determines how much work simplex takes?</p>
    <nav class="l10-contents l10-title-contents" aria-label="Simplex IV sections">` +
    sections.map((s,i) => '<a data-l12-section-link="' + i + '" href="#slide=1">' + s.title + '</a>').join('') +
    '</nav><p>Lecture 8 · Bertsimas–Tsitsiklis §§3.6–3.7</p>' +
    '<p>Build on feasible bases, reduced costs, the ratio test, and the two-phase method from Simplex I–III.</p>' +
    '<div class="ns-title-shortcuts"><span><kbd>→</kbd> / <kbd>Space</kbd> reveal or advance</span><span><kbd>M</kbd> slide menu</span><span><kbd>K</kbd> checkpoint</span><span><kbd>H</kbd> handout view</span></div>',
};
const sources = {
  key: 'sources', id: 'l12-sources', title: 'References and Paths for Independent Study', referencePages: [1, 2],
  html: String.raw`<div class="l10-stack">
    <section class="l10-box" data-tone="blue"><h3>Connect a pivot to its picture and its cost</h3>
      <p>Interpret the basic weights, reduced-cost gap, and leaving choice in the column picture. Separate work per pivot from the number of pivots.</p></section>
    <p><strong>Textbook:</strong> Bertsimas and Tsitsiklis, <em>Introduction to Linear Optimization</em>, §§3.6–3.7.</p>
    <p><strong>Review:</strong> <a href="../lecture-11/#slide=1">Simplex III: Two-Phase Simplex</a> explains how to find a feasible starting basis.</p>
    <p><strong>Further reading:</strong> <a href="https://arxiv.org/abs/1006.2814">Santos: the Hirsch counterexample</a>; <a href="https://www.cs.yale.edu/homes/spielman/simplex/">Spielman and Teng: smoothed analysis</a>; <a href="https://arxiv.org/abs/2502.18019">Disser and Mosis: the pivot-rule complexity question</a>.</p>
    <p>Distinguish a short edge path, an improving path, and an algorithm that finds such a path efficiently.</p>
  </div>`,
};
let assembled = [{...intro, section: 'Simplex IV · Overview'}];
const starts = [];
for (const section of sections) {
  starts.push(assembled.length + 1);
  assembled.push(...section.slides.map(s => ({...s, section: section.title})));
}
assembled.push({...sources, section: 'Simplex IV · Study guide'});
export const slides = assembled.map((s,i) => ({
  ...s, id: s.id || 'l10-' + s.key, page: i + 1, eyebrow: s.section,
  html: s.html.replace(/data-l12-section-link="(\d+)" href="#slide=1"/g,
    (_,n) => 'data-l12-section-link="' + n + '" href="#slide=' + starts[Number(n)] + '"'),
}));
export const referenceMap = slides.map(({id,page,title,section,referencePages}) => ({id,page,title,section,referencePages}));
export const auditData = {geometry: geometryAudit, efficiency: efficiencyAudit};
export const deck = {schemaVersion: 1, id: metadata.id, number: metadata.number,
  title: metadata.title, metadata, styles: new URL('./lecture-12.css', import.meta.url).href, slides};
export default deck;
