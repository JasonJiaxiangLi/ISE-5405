const SCHEMA_VERSION = 1;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeStorageRemove(key) {
  try { localStorage.removeItem(key); } catch { /* Storage can be unavailable. */ }
}

export class AnnotationStore {
  constructor({ lectureId, pdfHash, pageCount, persistent = true, onStatus = () => {} }) {
    this.lectureId = lectureId;
    this.pdfHash = pdfHash;
    this.pageCount = pageCount;
    this.persistent = persistent;
    this.onStatus = onStatus;
    this.storageKey = `ise5405:ink:${lectureId}:${pdfHash}`;
    this.data = this.emptyData();
    if (persistent) this.load();
  }

  emptyData() {
    return {
      schema_version: SCHEMA_VERSION,
      lecture_id: this.lectureId,
      pdf_hash: this.pdfHash,
      page_count: this.pageCount,
      created_at: new Date().toISOString(),
      pages: {}
    };
  }

  load() {
    const raw = safeStorageGet(this.storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.schema_version === SCHEMA_VERSION && parsed?.pages && typeof parsed.pages === 'object') {
        this.data = parsed;
      }
    } catch {
      this.onStatus('Saved annotations could not be read; a fresh layer is in use.');
    }
  }

  setPersistent(persistent) {
    this.persistent = Boolean(persistent);
    if (this.persistent) {
      const existing = safeStorageGet(this.storageKey);
      if (existing && !this.hasAnyInk()) this.load();
      this.save();
    }
  }

  save() {
    if (!this.persistent) return;
    if (!this.hasAnyInk()) {
      safeStorageRemove(this.storageKey);
      return;
    }
    if (!safeStorageSet(this.storageKey, JSON.stringify(this.data))) {
      this.onStatus('Annotations are active, but browser storage is unavailable. Export them before leaving.');
    }
  }

  strokes(pageKey) {
    return this.data.pages[pageKey] || [];
  }

  addStroke(pageKey, stroke) {
    if (!this.data.pages[pageKey]) this.data.pages[pageKey] = [];
    this.data.pages[pageKey].push(stroke);
    this.save();
  }

  replacePage(pageKey, strokes) {
    if (strokes.length) this.data.pages[pageKey] = strokes;
    else delete this.data.pages[pageKey];
    this.save();
  }

  clearPage(pageKey) {
    delete this.data.pages[pageKey];
    this.save();
  }

  wipe() {
    this.data = this.emptyData();
    safeStorageRemove(this.storageKey);
  }

  hasPageInk(pageKey) {
    return Boolean(this.data.pages[pageKey]?.length);
  }

  hasAnyInk() {
    return Object.values(this.data.pages).some((strokes) => Array.isArray(strokes) && strokes.length);
  }

  exportObject() {
    return {
      ...clone(this.data),
      exported_at: new Date().toISOString(),
      generator: 'ISE 5405 PDF presentation shell'
    };
  }

  inspectImport(value) {
    if (!value || value.schema_version !== SCHEMA_VERSION || !value.pages || typeof value.pages !== 'object') {
      throw new Error('This is not a supported annotation export.');
    }
    return {
      pdfMismatch: value.pdf_hash !== this.pdfHash,
      lectureMismatch: value.lecture_id !== this.lectureId,
      pageCountMismatch: Number(value.page_count) !== Number(this.pageCount)
    };
  }

  importObject(value) {
    this.inspectImport(value);
    const pages = {};
    for (const [pageKey, strokes] of Object.entries(value.pages)) {
      if (!Array.isArray(strokes)) continue;
      pages[pageKey] = strokes.filter(isValidStroke).map(normalizeStroke);
    }
    this.data = { ...this.emptyData(), pages };
    this.save();
  }
}

function isValidStroke(stroke) {
  return stroke && typeof stroke.color === 'string' && Number.isFinite(Number(stroke.width)) && Array.isArray(stroke.points) && stroke.points.length > 0;
}

function normalizeStroke(stroke) {
  return {
    color: stroke.color.slice(0, 32),
    width: Math.max(.0002, Math.min(.08, Number(stroke.width))),
    points: stroke.points
      .filter((point) => Number.isFinite(Number(point.x)) && Number.isFinite(Number(point.y)))
      .map((point) => ({
        x: Math.max(0, Math.min(1, Number(point.x))),
        y: Math.max(0, Math.min(1, Number(point.y))),
        p: Math.max(0.1, Math.min(1, Number(point.p) || .5))
      }))
  };
}

function pointerPoint(event, rect) {
  const pressure = event.pointerType === 'mouse' || !event.pressure ? .5 : event.pressure;
  return {
    x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    p: Math.max(.1, Math.min(1, pressure))
  };
}

function pointSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (!dx && !dy) return Math.hypot(point.x - start.x, point.y - start.y);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
}

function strokeHit(stroke, point, threshold) {
  if (stroke.points.length === 1) return pointSegmentDistance(point, stroke.points[0], stroke.points[0]) <= threshold;
  for (let index = 1; index < stroke.points.length; index += 1) {
    if (pointSegmentDistance(point, stroke.points[index - 1], stroke.points[index]) <= threshold) return true;
  }
  return false;
}

export function drawStrokesOnCanvas(canvas, strokes) {
  const context = canvas.getContext('2d');
  if (!context) return;
  for (const stroke of strokes) {
    const points = stroke.points || [];
    if (!points.length) continue;
    context.strokeStyle = stroke.color;
    context.fillStyle = stroke.color;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const baseWidth = Math.max(1, stroke.width * canvas.width);

    if (points.length === 1) {
      context.beginPath();
      context.arc(points[0].x * canvas.width, points[0].y * canvas.height, baseWidth / 2, 0, Math.PI * 2);
      context.fill();
      continue;
    }

    for (let index = 1; index < points.length; index += 1) {
      const start = points[index - 1];
      const end = points[index];
      context.lineWidth = baseWidth * (.55 + end.p * .7);
      context.beginPath();
      context.moveTo(start.x * canvas.width, start.y * canvas.height);
      context.lineTo(end.x * canvas.width, end.y * canvas.height);
      context.stroke();
    }
  }
}

export class AnnotationController {
  constructor({ canvas, stage, store, getPageKey, onStatus = () => {} }) {
    this.canvas = canvas;
    this.stage = stage;
    this.store = store;
    this.getPageKey = getPageKey;
    this.onStatus = onStatus;
    this.mode = 'none';
    this.color = '#153d63';
    this.widthPx = 4;
    this.activePointer = null;
    this.currentStroke = null;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    this.installEvents();
  }

  setStore(store) {
    this.store = store;
    this.redraw();
  }

  setMode(mode) {
    this.mode = mode;
    this.stage.classList.toggle('is-drawing', mode === 'pen');
    this.stage.classList.toggle('is-erasing', mode === 'eraser');
    this.canvas.setAttribute('aria-label', mode === 'eraser' ? 'Stroke eraser annotation layer' : 'Freehand annotation layer');
  }

  setColor(color) { this.color = color; }
  setWidth(width) { this.widthPx = Number(width) || 4; }

  resize() {
    const rect = this.stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.redraw();
  }

  redraw() {
    const context = this.canvas.getContext('2d');
    context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.store) return;
    drawStrokesOnCanvas(this.canvas, this.store.strokes(this.getPageKey()));
    if (this.currentStroke) drawStrokesOnCanvas(this.canvas, [this.currentStroke]);
  }

  installEvents() {
    this.canvas.addEventListener('pointerdown', (event) => {
      if (!this.store || !['pen', 'eraser'].includes(this.mode)) return;
      event.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const point = pointerPoint(event, rect);
      this.canvas.setPointerCapture(event.pointerId);
      this.activePointer = event.pointerId;

      if (this.mode === 'eraser') {
        this.eraseAt(point);
        return;
      }

      this.currentStroke = {
        color: this.color,
        width: this.widthPx / Math.max(1, rect.width),
        points: [point]
      };
      this.redraw();
    });

    this.canvas.addEventListener('pointermove', (event) => {
      if (this.activePointer !== event.pointerId) return;
      event.preventDefault();
      const samples = event.getCoalescedEvents?.() || [event];
      const rect = this.canvas.getBoundingClientRect();
      if (this.mode === 'eraser') {
        for (const sample of samples) this.eraseAt(pointerPoint(sample, rect));
      } else if (this.currentStroke) {
        for (const sample of samples) this.currentStroke.points.push(pointerPoint(sample, rect));
        this.redraw();
      }
    });

    const finish = (event) => {
      if (this.activePointer !== event.pointerId) return;
      if (this.currentStroke) this.store.addStroke(this.getPageKey(), this.currentStroke);
      this.currentStroke = null;
      this.activePointer = null;
      this.redraw();
    };
    this.canvas.addEventListener('pointerup', finish);
    this.canvas.addEventListener('pointercancel', finish);
  }

  eraseAt(point) {
    const pageKey = this.getPageKey();
    const strokes = this.store.strokes(pageKey);
    const index = strokes.findIndex((stroke) => strokeHit(stroke, point, Math.max(.012, stroke.width * 3.5)));
    if (index < 0) return;
    const next = strokes.filter((_, strokeIndex) => strokeIndex !== index);
    this.store.replacePage(pageKey, next);
    this.onStatus('Stroke erased.');
    this.redraw();
  }
}
