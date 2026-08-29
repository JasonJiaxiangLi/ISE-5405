import { PDFPresentation, parseViewerConfig } from './viewer.js';

const input = document.querySelector('#local-pdf-input');
const dropZone = document.querySelector('#drop-zone');
const status = document.querySelector('#local-file-status');
const persist = document.querySelector('#persist-local-ink');
const viewerWrapper = document.querySelector('#local-viewer');
const viewer = new PDFPresentation(parseViewerConfig(), { persistent: false });
let objectUrl = null;

window.ise5405Viewer = viewer;

function hex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function loadFile(file) {
  if (!file) return;
  if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    status.textContent = 'Choose a PDF file.';
    return;
  }

  status.textContent = `Reading ${file.name}…`;
  try {
    const buffer = await file.arrayBuffer();
    const signature = new TextDecoder('ascii').decode(buffer.slice(0, 5));
    if (signature !== '%PDF-') throw new Error('The selected file does not have a PDF signature.');
    const hash = hex(await crypto.subtle.digest('SHA-256', buffer));
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);

    const title = file.name.replace(/\.pdf$/i, '');
    document.querySelector('#lecture-title').textContent = title;
    document.querySelector('#lecture-kicker').textContent = 'local PDF · stays on this device';
    const openLink = document.querySelector('#open-pdf-link');
    const downloadLink = document.querySelector('#download-pdf-link');
    [openLink, downloadLink].forEach((link) => { link.href = objectUrl; });
    downloadLink.download = file.name;
    document.title = `${title} · Local PDF Annotator`;

    viewerWrapper.hidden = false;
    await viewer.load(
      { data: new Uint8Array(buffer) },
      {
        id: `local-${hash.slice(0, 20)}`,
        title,
        pdf_hash: hash,
        pdf_url: null,
        local: true,
        whiteboards: 3,
        checkpoints: [],
        plugin_url: null
      }
    );
    viewer.setPersistent(persist.checked);
    status.textContent = `${file.name} loaded · ${viewer.pdf.numPages} pages · content key ${hash.slice(0, 12)}…`;
    viewerWrapper.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  } catch (error) {
    console.error(error);
    status.textContent = error?.message || 'The PDF could not be loaded.';
  }
}

input.addEventListener('change', () => loadFile(input.files?.[0]));
persist.addEventListener('change', () => viewer.setPersistent(persist.checked));

['dragenter', 'dragover'].forEach((name) => dropZone.addEventListener(name, (event) => {
  event.preventDefault();
  dropZone.classList.add('is-dragging');
}));

['dragleave', 'drop'].forEach((name) => dropZone.addEventListener(name, (event) => {
  event.preventDefault();
  dropZone.classList.remove('is-dragging');
}));

dropZone.addEventListener('drop', (event) => loadFile(event.dataTransfer?.files?.[0]));
window.addEventListener('beforeunload', () => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});
