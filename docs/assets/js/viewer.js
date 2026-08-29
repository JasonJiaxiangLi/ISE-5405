import {
  getDocument,
  GlobalWorkerOptions,
  TextLayer
} from '../../vendor/pdfjs/pdf.mjs';
import {
  AnnotationController,
  AnnotationStore,
  drawStrokesOnCanvas
} from './annotations.js';
import {
  closeDialog,
  closeTopDialog,
  installDialogBehavior,
  openDialog
} from './accessibility.js';
import { CheckpointController } from './checkpoints.js';
import { ExplorationController } from './explorations.js';

GlobalWorkerOptions.workerSrc = new URL('../../vendor/pdfjs/pdf.worker.mjs', import.meta.url).href;

const PDFJS_OPTIONS = {
  cMapUrl: new URL('../../vendor/pdfjs/cmaps/', import.meta.url).href,
  cMapPacked: true,
  standardFontDataUrl: new URL('../../vendor/pdfjs/standard_fonts/', import.meta.url).href,
  wasmUrl: new URL('../../vendor/pdfjs/wasm/', import.meta.url).href,
  iccUrl: new URL('../../vendor/pdfjs/iccs/', import.meta.url).href
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeFilename(value) {
  return String(value || 'annotations').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'annotations';
}

function readPosition(key) {
  try { return Number(localStorage.getItem(key)) || null; } catch { return null; }
}

function savePosition(key, page) {
  try { localStorage.setItem(key, String(page)); } catch { /* Persistence is an enhancement. */ }
}

function pageFromHash() {
  const match = location.hash.match(/(?:^#|&)page=(\d+)/);
  return match ? Number(match[1]) : null;
}

function isEditableTarget(target) {
  return target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, summary, details, dialog, [contenteditable="true"]'));
}

function isTypingTarget(target) {
  return target instanceof Element && Boolean(target.closest('input, select, textarea, [contenteditable="true"]'));
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

export function parseViewerConfig() {
  const element = document.querySelector('#viewer-config');
  if (!element) throw new Error('Viewer configuration is missing.');
  return JSON.parse(element.textContent);
}

export class PDFPresentation {
  constructor(config, { persistent = true } = {}) {
    this.config = config;
    this.persistent = persistent;
    this.pdf = null;
    this.loadingTask = null;
    this.renderTask = null;
    this.textLayerTask = null;
    this.page = 1;
    this.pageMode = 'pdf';
    this.whiteboardPage = 1;
    this.zoomMode = 'fit-page';
    this.annotationStore = null;
    this.annotationController = null;
    this.thumbnailsRendered = false;
    this.renderSerial = 0;
    this.lastViewport = null;
    this.positionKey = `ise5405:position:${config.id}`;
    this.elements = this.collectElements();
    this.checkpoints = new CheckpointController({
      dialog: this.elements.checkpointDialog,
      checkpoints: config.checkpoints || [],
      lectureId: config.id,
      onStatus: (message) => this.announce(message)
    });
    this.explorations = new ExplorationController({
      dialog: this.elements.explorationDialog,
      button: this.elements.explorationButton,
      explorations: config.explorations || [],
      onStatus: (message) => this.announce(message)
    });
    this.installEvents();
  }

  collectElements() {
    const byId = (id) => document.getElementById(id);
    return {
      app: byId('viewer-app'),
      loading: byId('viewer-loading'),
      loadingMessage: byId('loading-message'),
      error: byId('viewer-error'),
      errorMessage: byId('viewer-error-message'),
      shell: byId('presentation-shell'),
      stageContainer: byId('stage-container'),
      stage: byId('page-stage'),
      pdfCanvas: byId('pdf-canvas'),
      textLayer: byId('text-layer'),
      annotationCanvas: byId('annotation-canvas'),
      laser: byId('laser-pointer'),
      whiteboardLabel: byId('whiteboard-label'),
      currentPage: byId('current-page'),
      totalPages: byId('total-pages'),
      progress: byId('progress-fill'),
      zoomSelect: byId('zoom-select'),
      inkOptions: byId('ink-options'),
      penWidth: byId('pen-width'),
      importInput: byId('annotation-import'),
      status: byId('viewer-status'),
      thumbnailDialog: byId('thumbnail-dialog'),
      thumbnailGrid: byId('thumbnail-grid'),
      helpDialog: byId('help-dialog'),
      checkpointDialog: byId('checkpoint-dialog'),
      explorationDialog: byId('exploration-dialog'),
      explorationButton: byId('exploration-button'),
      handout: byId('handout-view'),
      handoutPages: byId('handout-pages'),
      handoutStatus: byId('handout-status'),
      pluginPanel: byId('plugin-panel'),
      openPdfLink: byId('open-pdf-link'),
      downloadPdfLink: byId('download-pdf-link'),
      lectureTitle: byId('lecture-title'),
      lectureKicker: byId('lecture-kicker')
    };
  }

  async start() {
    if (!this.config.pdf_url) return;
    await this.load({ url: this.config.pdf_url });
  }

  async load(source, overrides = {}) {
    this.config = { ...this.config, ...overrides };
    this.positionKey = `ise5405:position:${this.config.id}`;
    this.elements.error.hidden = true;
    this.elements.loading.hidden = false;
    this.elements.shell.hidden = true;
    this.elements.handout.hidden = true;
    this.elements.loadingMessage.textContent = 'Loading PDF…';
    this.pdf = null;
    this.thumbnailsRendered = false;
    this.elements.thumbnailGrid.replaceChildren();

    try {
      this.loadingTask?.destroy();
      const parameters = { ...PDFJS_OPTIONS, ...source };
      this.loadingTask = getDocument(parameters);
      this.loadingTask.onProgress = ({ loaded, total }) => {
        if (!total) return;
        this.elements.loadingMessage.textContent = `Loading PDF… ${Math.round((loaded / total) * 100)}%`;
      };
      this.pdf = await this.loadingTask.promise;
      this.config.page_count = this.pdf.numPages;
      this.elements.totalPages.textContent = String(this.pdf.numPages);

      this.annotationStore = new AnnotationStore({
        lectureId: this.config.id,
        pdfHash: this.config.pdf_hash,
        pageCount: this.pdf.numPages,
        persistent: this.persistent,
        onStatus: (message) => this.announce(message)
      });

      if (!this.annotationController) {
        this.annotationController = new AnnotationController({
          canvas: this.elements.annotationCanvas,
          stage: this.elements.stage,
          store: this.annotationStore,
          getPageKey: () => this.currentPageKey(),
          onStatus: (message) => this.announce(message)
        });
      } else {
        this.annotationController.setStore(this.annotationStore);
      }

      const requested = pageFromHash();
      const saved = this.config.local ? null : readPosition(this.positionKey);
      this.page = clamp(requested || saved || 1, 1, this.pdf.numPages);
      this.elements.loading.hidden = true;
      this.elements.shell.hidden = false;
      await this.renderCurrentPage();
      this.updateControls();
      this.installPlugin();
      this.announce(`PDF loaded. ${this.pdf.numPages} pages.`);
      this.elements.app.focus({ preventScroll: true });
    } catch (error) {
      console.error(error);
      this.elements.loading.hidden = true;
      this.elements.shell.hidden = true;
      this.elements.error.hidden = false;
      this.elements.errorMessage.textContent = error?.message || 'The browser could not render this PDF.';
      throw error;
    }
  }

  setPersistent(persistent) {
    this.persistent = Boolean(persistent);
    this.annotationStore?.setPersistent(this.persistent);
    this.announce(this.persistent ? 'Local annotation persistence enabled.' : 'Local annotation persistence disabled.');
  }

  currentPageKey() {
    return this.pageMode === 'whiteboard' ? `whiteboard-${this.whiteboardPage}` : `page-${this.page}`;
  }

  async renderCurrentPage() {
    if (!this.pdf) return;
    if (this.pageMode === 'whiteboard') {
      this.renderWhiteboard();
      return;
    }

    const serial = ++this.renderSerial;
    this.renderTask?.cancel();
    this.textLayerTask?.cancel?.();
    const page = await this.pdf.getPage(this.page);
    if (serial !== this.renderSerial) return;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = this.scaleFor(baseViewport);
    const viewport = page.getViewport({ scale });
    this.lastViewport = viewport;
    this.sizeStage(viewport.width, viewport.height);
    this.elements.stage.classList.remove('is-whiteboard');
    this.elements.whiteboardLabel.hidden = true;
    this.elements.pdfCanvas.hidden = false;
    this.elements.textLayer.hidden = false;

    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    const canvas = this.elements.pdfCanvas;
    canvas.width = Math.max(1, Math.floor(viewport.width * ratio));
    canvas.height = Math.max(1, Math.floor(viewport.height * ratio));
    const context = canvas.getContext('2d', { alpha: false });
    this.renderTask = page.render({
      canvasContext: context,
      viewport,
      transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0]
    });
    await this.renderTask.promise;
    if (serial !== this.renderSerial) return;

    this.elements.textLayer.replaceChildren();
    try {
      this.textLayerTask = new TextLayer({
        textContentSource: page.streamTextContent({
          includeMarkedContent: true,
          disableNormalization: true
        }),
        container: this.elements.textLayer,
        viewport
      });
      await this.textLayerTask.render();
      const endOfContent = document.createElement('div');
      endOfContent.className = 'end-of-content';
      endOfContent.setAttribute('aria-hidden', 'true');
      this.elements.textLayer.append(endOfContent);
    } catch (error) {
      console.warn('PDF text layer unavailable for this page.', error);
    }

    this.annotationController.resize();
    this.updateControls();
    this.prefetchAdjacent();
    this.checkpoints.maybeAutoOpen(this.page);
  }

  scaleFor(baseViewport) {
    const container = this.elements.stageContainer;
    const horizontalChrome = window.innerWidth < 760 ? 104 : 168;
    const verticalChrome = window.innerWidth < 760 ? 18 : 38;
    const width = Math.max(240, container.clientWidth - horizontalChrome);
    // Measure the remaining browser viewport, not the current slide's content
    // height. Otherwise an oversized rendered page can enlarge the flex item,
    // and every subsequent fit-page calculation grows again.
    const containerTop = container.getBoundingClientRect().top;
    const instructionsHeight = this.elements.shell.querySelector('.viewer-instructions')?.offsetHeight || 0;
    const height = Math.max(180, window.innerHeight - containerTop - instructionsHeight - verticalChrome);
    if (this.zoomMode === 'fit-width') return clamp(width / baseViewport.width, .15, 5);
    if (this.zoomMode === 'fit-page') return clamp(Math.min(width / baseViewport.width, height / baseViewport.height), .15, 5);
    return clamp(Number(this.zoomMode) || 1, .15, 5);
  }

  sizeStage(width, height) {
    this.elements.stage.style.width = `${Math.round(width)}px`;
    this.elements.stage.style.height = `${Math.round(height)}px`;
  }

  renderWhiteboard() {
    const viewport = this.lastViewport || { width: 960, height: 540 };
    this.sizeStage(viewport.width, viewport.height);
    const context = this.elements.pdfCanvas.getContext('2d');
    context?.clearRect(0, 0, this.elements.pdfCanvas.width, this.elements.pdfCanvas.height);
    this.elements.pdfCanvas.hidden = true;
    this.elements.textLayer.hidden = true;
    this.elements.stage.classList.add('is-whiteboard');
    this.elements.whiteboardLabel.hidden = false;
    this.elements.whiteboardLabel.textContent = `whiteboard ${this.whiteboardPage}`;
    this.annotationController.resize();
    this.updateControls();
  }

  async goTo(page, { pushHistory = false, fromHistory = false } = {}) {
    if (!this.pdf) return;
    if (this.pageMode === 'whiteboard') {
      const next = clamp(page, 1, Math.max(1, Number(this.config.whiteboards) || 0));
      if (next === this.whiteboardPage) return;
      this.whiteboardPage = next;
      this.renderWhiteboard();
      this.announce(`Whiteboard ${next} of ${this.config.whiteboards}.`);
      return;
    }

    const next = clamp(page, 1, this.pdf.numPages);
    if (next === this.page && this.lastViewport) return;
    this.page = next;
    if (!this.config.local) {
      savePosition(this.positionKey, next);
      if (!fromHistory) {
        const url = `${location.pathname}${location.search}#page=${next}`;
        history[pushHistory ? 'pushState' : 'replaceState']({ page: next }, '', url);
      }
    }
    await this.renderCurrentPage();
    this.announce(`Page ${next} of ${this.pdf.numPages}.`);
  }

  previous() {
    return this.goTo((this.pageMode === 'whiteboard' ? this.whiteboardPage : this.page) - 1);
  }

  next() {
    return this.goTo((this.pageMode === 'whiteboard' ? this.whiteboardPage : this.page) + 1);
  }

  updateControls() {
    if (!this.pdf) return;
    const whiteboard = this.pageMode === 'whiteboard';
    const current = whiteboard ? this.whiteboardPage : this.page;
    const total = whiteboard ? Number(this.config.whiteboards) || 0 : this.pdf.numPages;
    this.elements.currentPage.textContent = whiteboard ? `W${current}` : String(current);
    this.elements.totalPages.textContent = whiteboard ? `W${total}` : String(total);
    this.elements.progress.style.width = `${total ? (current / total) * 100 : 0}%`;
    this.explorations.update(whiteboard ? Number.NaN : this.page);
    this.elements.stage.setAttribute('aria-label', whiteboard ? `Whiteboard ${current} of ${total}` : `Lecture page ${current} of ${total}`);
    document.querySelectorAll('[data-action="previous"]').forEach((button) => { button.disabled = current <= 1; });
    document.querySelectorAll('[data-action="next"]').forEach((button) => { button.disabled = current >= total; });
    document.querySelectorAll('[data-action="whiteboard"]').forEach((button) => button.setAttribute('aria-pressed', String(whiteboard)));
    document.querySelectorAll('.thumbnail-button').forEach((button) => button.setAttribute('aria-current', button.dataset.page === String(this.page) ? 'page' : 'false'));
  }

  setTool(mode) {
    const current = this.annotationController?.mode || 'none';
    const next = current === mode ? 'none' : mode;
    this.annotationController?.setMode(next);
    this.elements.stage.classList.toggle('is-laser', next === 'laser');
    this.elements.inkOptions.hidden = !['pen', 'eraser'].includes(next);
    document.querySelectorAll('[data-action="pen"]').forEach((button) => button.setAttribute('aria-pressed', String(next === 'pen')));
    document.querySelectorAll('[data-action="eraser"]').forEach((button) => button.setAttribute('aria-pressed', String(next === 'eraser')));
    document.querySelectorAll('[data-action="laser"]').forEach((button) => button.setAttribute('aria-pressed', String(next === 'laser')));
    this.announce(next === 'none' ? 'Pointer tools off.' : `${next === 'eraser' ? 'Stroke eraser' : next} active.`);
  }

  toggleWhiteboard() {
    const count = Number(this.config.whiteboards) || 0;
    if (!count) {
      this.announce('No whiteboards are configured for this document.');
      return;
    }
    this.pageMode = this.pageMode === 'whiteboard' ? 'pdf' : 'whiteboard';
    if (this.pageMode === 'whiteboard') {
      this.renderWhiteboard();
      this.announce(`Whiteboard ${this.whiteboardPage} of ${count}. Press W to return to the lecture.`);
    } else {
      this.renderCurrentPage();
      this.announce(`Returned to lecture page ${this.page}.`);
    }
  }

  changeZoom(direction) {
    const values = [.5, .75, 1, 1.25, 1.5, 2, 2.5, 3];
    const current = Number(this.zoomMode) || (this.lastViewport ? this.lastViewport.scale : 1);
    const target = direction > 0
      ? values.find((value) => value > current + .01) || values.at(-1)
      : [...values].reverse().find((value) => value < current - .01) || values[0];
    this.zoomMode = String(target);
    if (![...this.elements.zoomSelect.options].some((option) => option.value === this.zoomMode)) {
      const option = document.createElement('option');
      option.value = this.zoomMode;
      option.textContent = `${Math.round(target * 100)}%`;
      this.elements.zoomSelect.append(option);
    }
    this.elements.zoomSelect.value = this.zoomMode;
    this.renderCurrentPage();
  }

  clearCurrentPage() {
    const key = this.currentPageKey();
    if (!this.annotationStore?.hasPageInk(key)) {
      this.announce('There are no annotations on this page.');
      return;
    }
    if (!confirm('Clear all annotations on the current page?')) return;
    this.annotationStore.clearPage(key);
    this.annotationController.redraw();
    this.announce('Current-page annotations cleared.');
  }

  wipeAnnotations() {
    if (!this.annotationStore?.hasAnyInk()) {
      this.announce('There are no annotations to wipe.');
      return;
    }
    if (!confirm('Permanently wipe all PDF and whiteboard annotations for this document? Export first if you need a backup.')) return;
    this.annotationStore.wipe();
    this.annotationController.redraw();
    this.announce('All annotations wiped.');
  }

  exportAnnotations() {
    if (!this.annotationStore) return;
    const json = JSON.stringify(this.annotationStore.exportObject(), null, 2);
    downloadBlob(new Blob([json], { type: 'application/json' }), `${safeFilename(this.config.id)}-${this.config.pdf_hash.slice(0, 12)}-annotations.json`);
    this.announce('Annotation JSON exported.');
  }

  async importAnnotations(file) {
    if (!file || !this.annotationStore) return;
    try {
      const value = JSON.parse(await file.text());
      const mismatch = this.annotationStore.inspectImport(value);
      if (mismatch.pdfMismatch || mismatch.lectureMismatch || mismatch.pageCountMismatch) {
        const details = [
          mismatch.pdfMismatch && 'PDF content hash',
          mismatch.lectureMismatch && 'lecture identifier',
          mismatch.pageCountMismatch && 'page count'
        ].filter(Boolean).join(', ');
        if (!confirm(`This annotation file has a different ${details}. Import it onto the current PDF anyway? Ink may not align.`)) return;
      }
      this.annotationStore.importObject(value);
      this.annotationController.redraw();
      this.thumbnailsRendered = false;
      this.announce('Annotations imported.');
    } catch (error) {
      alert(error?.message || 'The annotation file could not be imported.');
      this.announce('Annotation import failed.');
    } finally {
      this.elements.importInput.value = '';
    }
  }

  async renderThumbnails() {
    if (this.thumbnailsRendered || !this.pdf) return;
    this.thumbnailsRendered = true;
    this.elements.thumbnailGrid.replaceChildren();
    for (let pageNumber = 1; pageNumber <= this.pdf.numPages; pageNumber += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'thumbnail-button';
      button.dataset.page = String(pageNumber);
      button.setAttribute('aria-label', `Go to page ${pageNumber}`);
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = `page ${pageNumber}`;
      button.append(canvas, label);
      button.addEventListener('click', () => {
        closeDialog(this.elements.thumbnailDialog);
        this.pageMode = 'pdf';
        this.goTo(pageNumber, { pushHistory: true });
      });
      this.elements.thumbnailGrid.append(button);

      try {
        const page = await this.pdf.getPage(pageNumber);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(1, 130 / base.width);
        const viewport = page.getViewport({ scale });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      } catch {
        label.textContent = `page ${pageNumber} (preview unavailable)`;
      }
      if (pageNumber % 4 === 0) await nextFrame();
    }
    this.updateControls();
  }

  async openThumbnails(opener) {
    openDialog(this.elements.thumbnailDialog, opener);
    await this.renderThumbnails();
    this.elements.thumbnailGrid.querySelector(`[data-page="${this.page}"]`)?.focus();
  }

  async enterHandout() {
    if (!this.pdf) return;
    this.elements.shell.hidden = true;
    this.elements.handout.hidden = false;
    this.elements.handoutPages.replaceChildren();
    this.elements.handoutStatus.hidden = false;
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

    for (let pageNumber = 1; pageNumber <= this.pdf.numPages; pageNumber += 1) {
      this.elements.handoutStatus.textContent = `Rendering page ${pageNumber} of ${this.pdf.numPages}…`;
      const page = await this.pdf.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = clamp(1500 / base.width, 1, 2.2);
      const viewport = page.getViewport({ scale });
      const wrapper = document.createElement('article');
      wrapper.className = 'handout-page';
      wrapper.setAttribute('aria-label', `Lecture page ${pageNumber}`);
      wrapper.style.aspectRatio = `${viewport.width} / ${viewport.height}`;
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const label = document.createElement('span');
      label.className = 'handout-page-label';
      label.textContent = String(pageNumber);
      wrapper.append(canvas, label);
      this.elements.handoutPages.append(wrapper);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      drawStrokesOnCanvas(canvas, this.annotationStore.strokes(`page-${pageNumber}`));
      if (pageNumber % 3 === 0) await nextFrame();
    }

    const whiteboardCount = Number(this.config.whiteboards) || 0;
    for (let number = 1; number <= whiteboardCount; number += 1) {
      const strokes = this.annotationStore.strokes(`whiteboard-${number}`);
      if (!strokes.length) continue;
      const width = 1500;
      const ratio = this.lastViewport ? this.lastViewport.height / this.lastViewport.width : 9 / 16;
      const wrapper = document.createElement('article');
      wrapper.className = 'handout-page handout-whiteboard';
      wrapper.setAttribute('aria-label', `Whiteboard ${number}`);
      wrapper.style.aspectRatio = `1 / ${ratio}`;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round(width * ratio);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawStrokesOnCanvas(canvas, strokes);
      const label = document.createElement('span');
      label.className = 'handout-page-label';
      label.textContent = `whiteboard ${number}`;
      wrapper.append(canvas, label);
      this.elements.handoutPages.append(wrapper);
    }

    this.elements.handoutStatus.textContent = `${this.pdf.numPages} lecture pages ready${whiteboardCount ? '; nonempty whiteboards included' : ''}.`;
    this.announce('Handout view ready.');
  }

  exitHandout() {
    this.elements.handout.hidden = true;
    this.elements.shell.hidden = false;
    this.renderCurrentPage();
    this.elements.app.focus({ preventScroll: true });
    this.announce('Returned to presentation view.');
  }

  async printHandout() {
    if (this.elements.handout.hidden) await this.enterHandout();
    this.elements.handoutStatus.textContent = 'All pages are ready. Opening the print dialog…';
    await nextFrame();
    window.print();
  }

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await this.elements.app.requestFullscreen({ navigationUI: 'hide' });
    } catch {
      this.announce('Fullscreen is unavailable in this browser or context.');
    }
  }

  prefetchAdjacent() {
    [this.page - 1, this.page + 1]
      .filter((number) => number >= 1 && number <= this.pdf.numPages)
      .forEach((number) => this.pdf.getPage(number).then((page) => page.getOperatorList()).catch(() => {}));
  }

  announce(message) {
    if (!this.elements.status) return;
    this.elements.status.textContent = '';
    requestAnimationFrame(() => { this.elements.status.textContent = message; });
  }

  async installPlugin() {
    if (!this.elements.pluginPanel) return;
    const demos = Array.isArray(this.config.demos) ? this.config.demos : [];
    if (demos.length) {
      this.elements.pluginPanel.hidden = false;
      const heading = document.createElement('h2');
      heading.textContent = 'Related interactive resources';
      const list = document.createElement('ul');
      demos.forEach((demo) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = demo.url;
        link.textContent = demo.title;
        const description = document.createElement('span');
        description.textContent = ` — ${demo.description}`;
        item.append(link, description);
        list.append(item);
      });
      this.elements.pluginPanel.append(heading, list);
    }
    if (!this.config.plugin_url) return;
    try {
      const module = await import(this.config.plugin_url);
      if (typeof module.default !== 'function') throw new Error('Plug-in has no default mount function.');
      this.elements.pluginPanel.hidden = false;
      const container = document.createElement('div');
      container.className = 'plugin-module';
      this.elements.pluginPanel.append(container);
      await module.default({ viewer: this, config: this.config, container });
    } catch (error) {
      console.error('Lecture plug-in failed to load.', error);
      this.elements.pluginPanel.hidden = false;
      this.elements.pluginPanel.textContent = 'The optional lecture interaction could not be loaded. The PDF viewer remains available.';
    }
  }

  installEvents() {
    [this.elements.thumbnailDialog, this.elements.helpDialog].forEach(installDialogBehavior);

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      event.preventDefault();
      const action = button.dataset.action;
      const actions = {
        previous: () => this.previous(),
        next: () => this.next(),
        pen: () => this.setTool('pen'),
        eraser: () => this.setTool('eraser'),
        laser: () => this.setTool('laser'),
        whiteboard: () => this.toggleWhiteboard(),
        'zoom-out': () => this.changeZoom(-1),
        'zoom-in': () => this.changeZoom(1),
        'clear-page': () => this.clearCurrentPage(),
        'wipe-ink': () => this.wipeAnnotations(),
        'export-ink': () => this.exportAnnotations(),
        'import-ink': () => this.elements.importInput.click(),
        thumbnails: () => this.openThumbnails(button),
        help: () => openDialog(this.elements.helpDialog, button),
        explore: () => this.explorations.openForPage(this.page, button),
        checkpoint: () => this.checkpoints.openForPage(this.page, button),
        fullscreen: () => this.toggleFullscreen(),
        handout: () => this.enterHandout(),
        'exit-handout': () => this.exitHandout(),
        print: () => this.printHandout()
      };
      actions[action]?.();
    });

    this.elements.zoomSelect?.addEventListener('change', () => {
      this.zoomMode = this.elements.zoomSelect.value;
      this.renderCurrentPage();
    });
    this.elements.penWidth?.addEventListener('change', () => this.annotationController?.setWidth(this.elements.penWidth.value));
    document.querySelectorAll('input[name="pen-color"]').forEach((input) => input.addEventListener('change', () => {
      if (input.checked) this.annotationController?.setColor(input.value);
    }));
    this.elements.importInput?.addEventListener('change', () => this.importAnnotations(this.elements.importInput.files?.[0]));

    this.elements.stage?.addEventListener('pointermove', (event) => {
      if (!this.elements.stage.classList.contains('is-laser')) return;
      const rect = this.elements.stage.getBoundingClientRect();
      this.elements.laser.style.left = `${event.clientX - rect.left}px`;
      this.elements.laser.style.top = `${event.clientY - rect.top}px`;
    });
    this.elements.stage?.addEventListener('pointerleave', () => {
      this.elements.laser.style.left = '-100px';
    });
    this.elements.textLayer?.addEventListener('pointerdown', () => {
      this.elements.textLayer.classList.add('selecting');
    });
    document.addEventListener('pointerup', () => {
      this.elements.textLayer?.classList.remove('selecting');
    });

    document.addEventListener('keydown', (event) => this.handleKey(event));
    window.addEventListener('popstate', () => {
      const page = pageFromHash();
      if (page && this.pdf) this.goTo(page, { fromHistory: true });
    });
    window.addEventListener('hashchange', () => {
      const page = pageFromHash();
      if (page && this.pdf && page !== this.page) this.goTo(page, { fromHistory: true });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.pdf && ['fit-page', 'fit-width'].includes(this.zoomMode)) this.renderCurrentPage();
        else this.annotationController?.resize();
      }, 140);
    });
  }

  handleKey(event) {
    if (!this.pdf || isTypingTarget(event.target)) return;
    if (isEditableTarget(event.target) && [' ', 'Enter', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) return;
    if (document.querySelector('dialog[open]')) return;
    const key = event.key;
    const normalized = key.length === 1 ? key.toLowerCase() : key;

    if (key === 'Escape') {
      if (closeTopDialog()) return;
      const details = document.querySelector('.more-menu[open]');
      if (details) { details.open = false; return; }
      if (this.elements.handout && !this.elements.handout.hidden) { this.exitHandout(); return; }
      if (this.pageMode === 'whiteboard') { this.toggleWhiteboard(); return; }
      if (this.annotationController?.mode !== 'none') { this.setTool(this.annotationController.mode); }
      return;
    }

    const handled = ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'f', 'm', '?', 'p', 'e', 'c', 'l', 'w', 'h', 'k', 'x'].includes(normalized);
    if (!handled) return;
    event.preventDefault();

    if (['ArrowRight', 'PageDown', ' '].includes(key)) this.next();
    else if (['ArrowLeft', 'PageUp'].includes(key)) this.previous();
    else if (key === 'Home') this.goTo(1);
    else if (key === 'End') this.goTo(this.pageMode === 'whiteboard' ? Number(this.config.whiteboards) : this.pdf.numPages);
    else if (normalized === 'f') this.toggleFullscreen();
    else if (normalized === 'm') this.openThumbnails(document.activeElement);
    else if (normalized === '?') openDialog(this.elements.helpDialog, document.activeElement);
    else if (normalized === 'p') this.setTool('pen');
    else if (normalized === 'e') this.setTool('eraser');
    else if (normalized === 'c') this.clearCurrentPage();
    else if (normalized === 'l') this.setTool('laser');
    else if (normalized === 'w') this.toggleWhiteboard();
    else if (normalized === 'h') this.elements.handout.hidden ? this.enterHandout() : this.exitHandout();
    else if (normalized === 'k') this.checkpoints.openForPage(this.page, document.activeElement);
    else if (normalized === 'x') this.explorations.openForPage(this.page, document.activeElement);
  }
}

async function bootstrap() {
  try {
    const viewer = new PDFPresentation(parseViewerConfig());
    window.ise5405Viewer = viewer;
    await viewer.start();
  } catch (error) {
    console.error('Viewer startup failed.', error);
  }
}

if (!document.body.classList.contains('annotator-page')) bootstrap();
