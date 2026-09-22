/**
 * Public Lecture 7: initialization, two-phase simplex, column geometry,
 * and computational efficiency. Moved slides retain their stable IDs.
 */
import { phaseOneSlides, auditData as phaseOneAudit } from './lecture-11-phase-one.js';
import { geometrySlides, auditData as geometryAudit } from './lecture-11-geometry.js';
import { efficiencySlides, auditData as efficiencyAudit } from './lecture-11-efficiency.js';

export const metadata = {
  id: 'lecture-11', number: 11,
  title: 'Simplex III: Two-Phase Simplex, Geometry, and Efficiency',
  subtitle: 'Lecture 7 · Initialization, Column Geometry, and Computational Work',
  course: 'ISE 5405 · Optimization I',
  homeUrl: '../../', pdfUrl: '../../materials/lecture_11.pdf', whiteboards: 3,
};

// Complete Example 3.8 with equations before generalizing the basis operations.
// Preserve the full matrix justification in an optional study appendix.
const phaseIndex = new Map(phaseOneSlides.map((s,i) => [s.key,i]));
const range = (first,last) => phaseOneSlides.slice(phaseIndex.get(first), phaseIndex.get(last) + 1);
const redundancyKey = 'phase-ex38-redundancy';
const phaseAppendix = [
  phaseOneSlides[phaseIndex.get(redundancyKey)],
  ...range('phase-clean-basis', 'phase-cleanup-delete'),
];
const phaseTeachingOrder = [
  ...range('phase-start', 'phase-positive'),
  ...range('phase-ex38-model', 'phase-ex38-tableau-zero'),
  phaseOneSlides[phaseIndex.get('phase-zero-basis')],
  ...range('phase-ex38-final-dictionary', 'phase-all-outcomes').filter(s => s.key !== redundancyKey),
];
const allPhaseSlides = [...phaseTeachingOrder, ...phaseAppendix];
if (allPhaseSlides.length !== phaseOneSlides.length ||
    new Set(allPhaseSlides.map(s => s.key)).size !== phaseOneSlides.length)
  throw new Error('The two-phase sequence must preserve every authored slide exactly once.');
const phaseDetails = s => ({...s, className: [s.className, 'l11-phase-details'].filter(Boolean).join(' ')});
const sections = [
  {title: '3.5 · Finding an initial feasible basis', slides: phaseTeachingOrder.map(phaseDetails)},
  {title: '3.6 · Column geometry', slides: geometrySlides},
  {title: '3.7 · Computational efficiency', slides: efficiencySlides},
];
const intro = {
  key: '01', id: 'l11-01', kind: 'title', title: metadata.title, referencePages: [41],
  html: String.raw`<p class="ns-lead">How do we start simplex, interpret its basis changes, and understand its computational cost?</p>
    <nav class="l10-contents l10-title-contents" aria-label="Simplex III sections">` +
    sections.map((s,i) => '<a data-l11-section-link="' + i + '" href="#slide=1">' + s.title + '</a>').join('') +
    '</nav><p>Lecture 7 · Bertsimas–Tsitsiklis §§3.5–3.7</p>' +
    '<p>Use the pivot, reduced-cost, and anticycling rules developed in Simplex I and II.</p>' +
    '<div class="ns-title-shortcuts"><span><kbd>→</kbd> / <kbd>Space</kbd> reveal or advance</span><span><kbd>M</kbd> slide menu</span><span><kbd>K</kbd> checkpoint</span><span><kbd>H</kbd> handout view</span></div>',
};
const sources = {
  key: 'sources', id: 'l11-sources', title: 'References and Paths for Independent Study', referencePages: [1, 2],
  html: String.raw`<div class="l10-stack">
    <section class="l10-box" data-tone="blue"><h3>Practice the complete method</h3>
      <p>Construct Phase I, interpret its optimum, remove artificial variables, and restore the original objective. Explain a pivot using both the dictionary and the column picture.</p></section>
    <p><strong>Optional details:</strong> <a data-l11-appendix-link href="#slide=1">Why artificial variables can be removed</a>. Review the worked dictionaries first.</p>
    <p><strong>Textbook:</strong> Bertsimas and Tsitsiklis, <em>Introduction to Linear Optimization</em>, §§3.5–3.7.</p>
    <p><strong>Review:</strong> <a href="../lecture-10/#slide=1">Simplex II: Cycling and Anticycling</a> develops the finite-termination rules used in both phases.</p>
    <p><strong>Further reading:</strong> <a href="https://arxiv.org/abs/1006.2814">Santos: the Hirsch counterexample</a>; <a href="https://www.cs.yale.edu/homes/spielman/simplex/">Spielman and Teng: smoothed analysis</a>; <a href="https://arxiv.org/abs/2502.18019">Disser and Mosis: the pivot-rule complexity question</a>.</p>
    <p>Distinguish the existence of a short edge path, an improving path, and an algorithm that finds such a path efficiently.</p>
  </div>`,
};
let assembled = [{...intro, section: 'Simplex III · Overview'}];
const starts = [];
for (const section of sections) {
  starts.push(assembled.length + 1);
  assembled.push(...section.slides.map(s => ({...s, section: section.title})));
}
assembled.push({...sources, section: 'Simplex III · Study guide'});
const appendixStart = assembled.length + 1;
assembled.push(...phaseAppendix.map(s => ({...phaseDetails(s),
  section: s.key === redundancyKey ? 'Appendix · Example 3.8: redundant equality'
    : 'Appendix · Removing artificial variables: matrix justification'})));
export const slides = assembled.map((s,i) => ({
  ...s, id: s.id || 'l10-' + s.key, page: i + 1, eyebrow: s.section,
  html: s.html.replace(/data-l11-section-link="(\d+)" href="#slide=1"/g,
    (_,n) => 'data-l11-section-link="' + n + '" href="#slide=' + starts[Number(n)] + '"').replace('data-l11-appendix-link href="#slide=1"',
    'data-l11-appendix-link href="#slide=' + appendixStart + '"'),
}));
export const referenceMap = slides.map(({id,page,title,section,referencePages}) => ({id,page,title,section,referencePages}));
export const auditData = {phaseOne: phaseOneAudit, geometry: geometryAudit, efficiency: efficiencyAudit};
export const deck = {schemaVersion: 1, id: metadata.id, number: metadata.number,
  title: metadata.title, metadata, styles: new URL('./lecture-11.css', import.meta.url).href, slides};
export default deck;
