/** Public Lecture 8: column geometry and computational efficiency. */
import { geometryMainSlides, geometryAppendixSlides, geometryExampleSlides,
  auditData as geometryAudit } from './lecture-11-geometry.js';
import { efficiencyMainSlides, efficiencyImplementationSlides, efficiencyProofSlides,
  efficiencyDiameterSlides, efficiencyProbabilitySlides,
  auditData as efficiencyAudit } from './lecture-11-efficiency.js';
import { historySlides, auditData as historyAudit } from './lecture-12-history.js';
import { perspective, overrides, hirschAudit } from './lecture-12-concepts.js';

export const metadata = {
  id: 'lecture-12', number: 12,
  title: 'Simplex IV: Column Geometry and Efficiency',
  subtitle: 'Lecture 8 · The Geometry and Cost of a Pivot',
  course: 'ISE 5405 · Optimization I',
  homeUrl: '../../', pdfUrl: '../../materials/lecture_12.pdf', whiteboards: 3,
};
const library = [...geometryMainSlides, ...geometryAppendixSlides, ...geometryExampleSlides,
  ...efficiencyMainSlides, ...efficiencyImplementationSlides, ...efficiencyProofSlides,
  ...efficiencyDiameterSlides, ...efficiencyProbabilitySlides];
const byKey = new Map(library.map(s => [s.key, s]));
const pick = key => {
  if (!byKey.has(key)) throw new Error(`Unknown Simplex IV key: ${key}`);
  const source = byKey.get(key);
  return { ...source, ...overrides[key] };
};
const model = pick('column-explicit-equalities');
model.html = model.html.replace('The coefficient table gives two coordinate equations. A third equation makes the weights sum to one:',
  'Choose five nonnegative mixture weights. The first two equations fix the target at (1,1); the third makes the weights sum to one:')
  .replace('Cost is separate from these three constraints.', 'The sum-to-one condition belongs to this example; it is not an extra condition we can add to any LP.');
const support = pick('supporting-plane-optimality');
support.html = support.html.replace('Self-study: verify the five signed gaps using the coordinate table.',
  'This is a lower-bound certificate. We will develop that idea in duality.');
const sections = [
  { title: '3.6 · A conceptual picture of a pivot', slides: [perspective, model,
    ...['lifted-columns', 'column-feasible-mixture', 'requirement-line', 'physical-hinge'].map(pick), support] },
  { title: '3.7 · Efficiency and the Hirsch conjecture', slides: [
    'efficiency', 'perturbed-cube', 'perturbed-square', 'perturbed-space',
    'exponential-theorem', 'pivot-shortcut', 'diameter', 'hirsch'].map(pick) },
  { title: 'LP algorithms · History and alternatives', slides: historySlides },
  { title: 'Simplex IV · Connect the ideas', slides: ['efficiency-practice', 'complete-story'].map(pick) },
];
const mainKeys = new Set(sections.flatMap(s => s.slides.map(s => s.key)));
const optional = group => group.filter(s => !mainKeys.has(s.key));
const appendixSections = [
  { title: 'Appendix A · Column geometry calculations', slides: optional([...geometryMainSlides, ...geometryAppendixSlides]) },
  { title: 'Appendix B · Example 3.10', slides: geometryExampleSlides },
  { title: 'Appendix C · Pivot work, paths, and proofs', slides: optional([...efficiencyMainSlides, ...efficiencyImplementationSlides, ...efficiencyProofSlides]) },
  { title: 'Appendix D · Diameter and pivot paths', slides: optional(efficiencyDiameterSlides) },
  { title: 'Appendix E · Average and smoothed analysis', slides: efficiencyProbabilitySlides },
];
const link = (key, label) => `<a data-l12-slide-link="${key}" href="#slide=1">${label}</a>`;
const intro = {
  key: '01', id: 'l12-01', kind: 'title', title: metadata.title, referencePages: [2, 90, 121],
  html: String.raw`<p class="ns-lead">How does a pivot change the picture, why can simplex be slow, and what other methods solve LPs?</p>
    <nav class="l10-contents l10-title-contents" aria-label="Simplex IV main sections">` +
    sections.slice(0, 3).map(s => link(s.slides[0].key, s.title)).join('') +
    '</nav><p>Lecture 8 · Bertsimas–Tsitsiklis §§3.6–3.7</p>' +
    '<p>Build on feasible bases, reduced costs, the ratio test, and the two-phase method from Simplex I–III.</p>' +
    '<p>' + link('appendix-guide', 'Optional study: proofs, a second example, implementation, and complexity') + '</p>' +
    '<div class="ns-title-shortcuts"><span><kbd>→</kbd> / <kbd>Space</kbd> reveal or advance</span><span><kbd>M</kbd> slide menu</span><span><kbd>K</kbd> checkpoint</span><span><kbd>H</kbd> handout view</span></div>',
};
const sources = {
  key: 'sources', id: 'l12-sources', title: 'Study guide: connect a pivot to its picture and cost', referencePages: [1, 2],
  html: String.raw`<div class="l10-stack">
    <section class="l10-box" data-tone="blue"><h3>Column geometry</h3>
      <p>Explain why mixing columns represents feasibility, why an improving pivot lowers cost, and how a supporting plane certifies the optimum. Detailed dictionary calculations are optional study.</p></section>
    <section class="l10-box" data-tone="green"><h3>Computational work</h3>
      <p>Separate work per pivot from the number of pivots. Explain why finite termination and a short available path do not guarantee a fast chosen rule.</p></section>
    <p><strong>Algorithm history:</strong> explain the polynomial-time breakthrough and distinguish the ellipsoid enclosure from an interior-point path.</p>
    <p><strong>Textbook:</strong> Bertsimas and Tsitsiklis, <em>Introduction to Linear Optimization</em>, §§3.6–3.7.</p>
    <p><strong>Review:</strong> <a href="../lecture-11/#slide=1">Simplex III: Two-Phase Simplex</a> explains how to find a feasible starting basis.</p>
    <p>` + link('appendix-guide', 'Continue to optional proofs, worked Example 3.10, and implementation/complexity topics') + '</p></div>',
};
const appendixGuide = {
  key: 'appendix-guide', id: 'l12-appendix-guide', title: 'Optional study: choose a topic', referencePages: [98, 119, 121],
  html: '<p>These sections extend the main lecture. Each keeps its definitions, calculations, and diagrams together.</p>' +
    '<nav class="l10-contents l12-appendix-contents" aria-label="Optional Simplex IV topics">' +
    appendixSections.map(s => link(s.slides[0].key, s.title)).join('') + '</nav>',
};
let assembled = [{ ...intro, section: 'Simplex IV · Overview' }];
for (const section of sections) {
  assembled.push(...section.slides.map(s => ({ ...s, section: section.title })));
}
assembled.push({ ...sources, section: 'Simplex IV · Main study guide' });
assembled.push({ ...appendixGuide, section: 'Simplex IV · Optional study' });
for (const section of appendixSections) {
  assembled.push(...section.slides.map(s => ({ ...s, section: section.title })));
}
const keyPages = new Map(assembled.map((s, i) => [s.key, i + 1]));
const resolveLinks = html => html?.replace(/data-l12-slide-link="([^"]+)" href="#slide=1"/g,
  (_, key) => {
    if (!keyPages.has(key)) throw new Error(`Unknown Simplex IV link target: ${key}`);
    return `data-l12-slide-link="${key}" href="#slide=${keyPages.get(key)}"`;
  });
export const slides = assembled.map((s, i) => ({
  ...s, id: s.id || 'l10-' + s.key, page: i + 1, eyebrow: s.section,
  html: resolveLinks(s.html), ...(s.printHtml ? { printHtml: resolveLinks(s.printHtml) } : {}),
}));
export const referenceMap = slides.map(({ id, page, title, section, referencePages }) => ({ id, page, title, section, referencePages }));
export const auditData = { geometry: geometryAudit, efficiency: efficiencyAudit, history: historyAudit, hirsch: hirschAudit,
  mainKeys: assembled.slice(0, assembled.findIndex(s => s.key === 'appendix-guide')).map(s => s.key),
  appendixGroups: appendixSections.map(s => s.slides.map(s => s.key)) };
export const deck = { schemaVersion: 1, id: metadata.id, number: metadata.number,
  title: metadata.title, metadata, styles: new URL('./lecture-12.css', import.meta.url).href, slides };
export default deck;
