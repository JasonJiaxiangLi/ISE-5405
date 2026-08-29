import {
  AnnotationController,
  AnnotationStore,
  drawStrokesOnCanvas,
} from "../assets/js/annotations.js";

/**
 * Original presentation runtime for ISE 5405 native HTML decks.
 *
 * Deck modules provide trusted, repository-authored HTML. Do not pass untrusted
 * strings to this API: the runtime intentionally preserves semantic markup.
 */

let instanceCount = 0;

const SELECTABLE_TARGETS = new Set([
  "A",
  "BUTTON",
  "INPUT",
  "SELECT",
  "SUMMARY",
  "TEXTAREA",
]);

function interpolate(value) {
  if (Array.isArray(value)) return value.map(interpolate).join("");
  if (value === null || value === undefined || value === false) return "";
  return String(value);
}

/** A small tagged-template helper for readable authored slide markup. */
export function html(strings, ...values) {
  return strings.reduce(
    (result, string, index) =>
      result + string + (index < values.length ? interpolate(values[index]) : ""),
    "",
  );
}

/** Validate the stable parts of a deck as soon as its module is imported. */
export function defineNativeDeck(deck) {
  if (!deck || typeof deck !== "object") {
    throw new TypeError("A native deck must be an object.");
  }
  // Deck modules may keep their manifest-like metadata at the top level.  The
  // runtime normalizes that compact authoring shape into one internal API.
  if (!deck.metadata && typeof deck.title === "string") {
    deck = {
      ...deck,
      metadata: {
        id: deck.id,
        number: deck.number,
        title: deck.title,
        subtitle: deck.subtitle,
        date: deck.date,
        course: deck.subtitle,
        homeUrl: "../../",
        pdfUrl: `../../materials/${String(deck.id).replace("-", "_")}.pdf`,
      },
    };
  }
  if (!deck.metadata || typeof deck.metadata.title !== "string") {
    throw new TypeError("A native deck requires metadata.title.");
  }
  if (!Array.isArray(deck.slides) || deck.slides.length === 0) {
    throw new TypeError("A native deck requires at least one slide.");
  }

  const ids = new Set();
  deck.slides.forEach((slide, index) => {
    if (!slide || typeof slide !== "object") {
      throw new TypeError(`Slide ${index + 1} must be an object.`);
    }
    if (!slide.id || typeof slide.id !== "string") {
      throw new TypeError(`Slide ${index + 1} requires a stable string id.`);
    }
    if (ids.has(slide.id)) {
      throw new TypeError(`Duplicate slide id: ${slide.id}`);
    }
    ids.add(slide.id);
    if (!slide.title || typeof slide.title !== "string") {
      throw new TypeError(`Slide ${slide.id} requires a title.`);
    }
    if (slide.titleHtml !== undefined && typeof slide.titleHtml !== "string") {
      throw new TypeError(`Slide ${slide.id} titleHtml must be a string.`);
    }
    if (typeof slide.html !== "string") {
      throw new TypeError(`Slide ${slide.id} requires an html string.`);
    }
  });

  return deck;
}

function resolveRoot(target) {
  const root = typeof target === "string" ? document.querySelector(target) : target;
  if (!(root instanceof HTMLElement)) {
    throw new TypeError("mountNativeDeck requires an element or a valid selector.");
  }
  return root;
}

function setOptionalLink(link, href, label) {
  if (!href) {
    link.hidden = true;
    link.removeAttribute("href");
    return;
  }
  link.hidden = false;
  link.href = href;
  if (label) link.textContent = label;
}

function isTypingOrOperatingControl(target) {
  if (!(target instanceof Element)) return false;
  return (
    SELECTABLE_TARGETS.has(target.tagName) ||
    target.isContentEditable ||
    Boolean(target.closest("[contenteditable='true']"))
  );
}

function choiceMarkup(choice) {
  if (choice && typeof choice === "object") {
    return choice.html ?? choice.label ?? "";
  }
  return String(choice);
}

function textOrHtml(container, value, htmlValue) {
  if (typeof htmlValue === "string") {
    container.innerHTML = htmlValue;
  } else {
    container.textContent = value ?? "";
  }
}

const PRINT_ID_REFERENCE_ATTRIBUTES = [
  "aria-activedescendant",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-errormessage",
  "aria-flowto",
  "aria-labelledby",
  "for",
  "headers",
  "list",
];

/**
 * A complete print deck lives beside the live slide, so authored ids must be
 * made unique before any slide-specific code is mounted into the copy.
 */
function namespacePrintIds(root, prefix) {
  const ids = new Map();
  root.querySelectorAll("[id]").forEach((element, index) => {
    const source = element.id;
    if (!source) return;
    const target = `${prefix}-${index + 1}-${source}`;
    ids.set(source, target);
    element.id = target;
  });
  if (ids.size === 0) return;

  root.querySelectorAll("*").forEach((element) => {
    PRINT_ID_REFERENCE_ATTRIBUTES.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      const rewritten = value
        .split(/\s+/)
        .map((token) => ids.get(token) ?? token)
        .join(" ");
      if (rewritten !== value) element.setAttribute(attribute, rewritten);
    });

    ["href", "xlink:href"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value?.startsWith("#")) return;
      const target = ids.get(value.slice(1));
      if (target) element.setAttribute(attribute, `#${target}`);
    });

    // SVG definitions are commonly referenced through url(#some-id).
    [...element.attributes].forEach((attribute) => {
      if (!attribute.value.includes("url(#")) return;
      const rewritten = attribute.value.replace(/url\(#([^)]+)\)/g, (match, id) =>
        ids.has(id) ? `url(#${ids.get(id)})` : match,
      );
      if (rewritten !== attribute.value) element.setAttribute(attribute.name, rewritten);
    });
  });
}

function isInstructionalPrintButton(button) {
  if (button.getAttribute("role") === "gridcell") return true;
  return [...button.attributes].some(
    (attribute) =>
      attribute.name.startsWith("data-")
      && /(?:choice|answer|value)$/.test(attribute.name),
  );
}

/**
 * Printed pages are static. Keep cell/answer text that carries instructional
 * meaning, but remove presentation controls after their mount hooks have used
 * them to construct the final DOM and canvas state.
 */
function staticizePrintControls(root) {
  root.querySelectorAll("[data-print='omit'], [data-screen-only]").forEach((node) => node.remove());
  root.querySelectorAll("button").forEach((button) => {
    if (!isInstructionalPrintButton(button)) {
      button.remove();
      return;
    }
    const replacement = document.createElement("span");
    [...button.attributes].forEach((attribute) => {
      if (!["disabled", "tabindex", "type"].includes(attribute.name)) {
        replacement.setAttribute(attribute.name, attribute.value);
      }
    });
    replacement.classList.add("ns-print-static-control");
    replacement.append(...button.childNodes);
    button.replaceWith(replacement);
  });
  root.querySelectorAll("input, select, textarea").forEach((control) => {
    if (control instanceof HTMLInputElement && control.type === "hidden") {
      control.remove();
      return;
    }
    const replacement = document.createElement(control instanceof HTMLTextAreaElement ? "pre" : "span");
    [...control.attributes].forEach((attribute) => {
      if (
        attribute.name === "id"
        || attribute.name === "class"
        || attribute.name === "role"
        || attribute.name.startsWith("aria-")
        || attribute.name.startsWith("data-")
      ) {
        replacement.setAttribute(attribute.name, attribute.value);
      }
    });
    replacement.classList.add("ns-print-static-control", "ns-print-control-value");
    if (control instanceof HTMLSelectElement) {
      replacement.textContent = control.selectedOptions[0]?.textContent?.trim() || control.value;
    } else if (control instanceof HTMLInputElement && ["checkbox", "radio"].includes(control.type)) {
      replacement.textContent = control.checked ? "✓" : "○";
      replacement.setAttribute("aria-label", control.checked ? "Selected" : "Not selected");
    } else {
      replacement.textContent = control.value;
    }
    control.replaceWith(replacement);
  });
}

let mathJaxReadyPromise = null;
let mathTypesetQueue = Promise.resolve();

function mathTargets(elements) {
  const values = Array.isArray(elements) ? elements : [elements];
  return values.filter((element) => element instanceof Element && element.isConnected);
}

/** Wait for the locally hosted MathJax component and its asynchronous startup. */
export function waitForMathJax() {
  if (mathJaxReadyPromise) return mathJaxReadyPromise;
  mathJaxReadyPromise = new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      const mathJax = window.MathJax;
      if (mathJax?.startup?.promise) {
        mathJax.startup.promise.then(() => resolve(mathJax)).catch((error) => {
          console.error("MathJax startup failed.", error);
          resolve(null);
        });
        return;
      }
      attempts += 1;
      if (attempts < 500) window.setTimeout(check, 20);
      else {
        console.error("MathJax did not become ready within ten seconds.");
        resolve(null);
      }
    };
    check();
  });
  return mathJaxReadyPromise;
}

/** Typeset explicit TeX delimiters within one or more live DOM subtrees. */
export function typesetMath(elements) {
  mathTypesetQueue = mathTypesetQueue.catch(() => null).then(async () => {
    const mathJax = await waitForMathJax();
    const targets = mathTargets(elements);
    if (!mathJax?.typesetPromise || targets.length === 0) return false;
    await mathJax.typesetPromise(targets);
    return true;
  }).catch((error) => {
    console.error("MathJax typesetting failed.", error);
    return false;
  });
  return mathTypesetQueue;
}

/** Remove MathJax bookkeeping before a rendered subtree is replaced. */
export function clearMath(elements) {
  const mathJax = window.MathJax;
  const targets = mathTargets(elements);
  if (!mathJax?.typesetClear || targets.length === 0) return false;
  mathJax.typesetClear(targets);
  return true;
}

/**
 * Mount a deck. The returned controller exposes navigation, dialogs, printing,
 * fullscreen, announcements, and teardown for custom lecture integrations.
 */
export function mountNativeDeck(target, rawDeck, options = {}) {
  const deck = defineNativeDeck(rawDeck);
  if (deck.styles && !document.querySelector(`[data-native-deck-style="${deck.id}"]`)) {
    if (/^(?:https?:|\.?\.?\/)/.test(deck.styles)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = deck.styles;
      link.dataset.nativeDeckStyle = deck.id;
      document.head.append(link);
    } else {
      const style = document.createElement("style");
      style.dataset.nativeDeckStyle = deck.id;
      style.textContent = deck.styles;
      document.head.append(style);
    }
  }
  return new NativeDeckController(resolveRoot(target), deck, options);
}

export class NativeDeckController {
  constructor(root, deck, options = {}) {
    this.root = root;
    this.deck = deck;
    this.options = options;
    this.instanceId = `native-deck-${++instanceCount}`;
    this.index = 0;
    this.revealStep = 0;
    this.maxRevealStep = 0;
    this.revealState = new Map();
    this.currentElement = null;
    this.currentSlide = null;
    this.mountCleanup = [];
    this.shownCheckpoints = new Set();
    this.dialogReturnFocus = null;
    this.whiteboardCount = Math.max(
      0,
      Math.min(20, Number(options.whiteboards ?? deck.metadata.whiteboards) || 0),
    );
    this.whiteboardIndex = 1;
    this.viewMode = "slide";
    this.annotationMode = "none";
    this.annotationStore = null;
    this.annotationController = null;
    this.handoutMode = false;
    this.laserActive = false;
    this.destroyed = false;
    this.printReady = null;

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.handleBeforePrint = this.handleBeforePrint.bind(this);
    this.handleAfterPrint = this.handleAfterPrint.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handleImportChange = this.handleImportChange.bind(this);

    this.buildShell();
    this.setupAnnotations();
    this.bindShell();

    const initial = this.readHash();
    if (initial) {
      this.index = initial.index;
      this.revealState.set(deck.slides[this.index].id, initial.step);
    }

    this.render({ announce: false, writeHash: true });
    this.printReady = this.preparePrintDeck();
  }

  buildShell() {
    const titleId = `${this.instanceId}-deck-title`;
    const stageId = `${this.instanceId}-stage`;
    const dialogTitleId = `${this.instanceId}-dialog-title`;

    this.root.classList.add("native-deck");
    this.root.dataset.nativeDeck = this.deck.metadata.id ?? "deck";
    this.root.dataset.deckId = this.deck.metadata.id ?? "deck";
    this.root.innerHTML = `
      <a class="ns-skip-link" href="#${stageId}">Skip to current slide</a>
      <header class="ns-masthead">
        <div class="ns-identity">
          <span class="ns-course" data-role="course"></span>
          <strong id="${titleId}" data-role="deck-title"></strong>
        </div>
        <nav class="ns-document-links" aria-label="Lecture resources">
          <a class="ns-link-button" data-role="home-link">&#8592; Course home</a>
          <a class="ns-link-button" data-role="pdf-link">Download PDF</a>
        </nav>
      </header>

      <main class="ns-presentation" aria-labelledby="${titleId}">
        <div class="ns-progress-row">
          <progress data-role="progress" value="1" max="${this.deck.slides.length}"></progress>
          <span data-role="counter">Slide 1 of ${this.deck.slides.length}</span>
        </div>

        <div class="ns-stage-area">
          <div class="ns-stage" id="${stageId}" data-role="stage" data-view="slide" tabindex="-1">
            <div class="ns-slide-surface" data-role="slide-surface"></div>
            <p class="ns-whiteboard-label" data-role="whiteboard-label" hidden></p>
            <canvas class="ns-annotation-canvas" data-role="annotation-canvas"
                    aria-label="Freehand annotation layer"></canvas>
          </div>
        </div>

        <nav class="ns-controls" aria-label="Slide controls">
          <button class="ns-control" type="button" data-action-shell="previous" aria-keyshortcuts="ArrowLeft ArrowUp PageUp">Previous</button>
          <button class="ns-control ns-control-primary" type="button" data-action-shell="next" aria-keyshortcuts="ArrowRight ArrowDown PageDown Space">Next</button>
          <button class="ns-control" type="button" data-action-shell="menu" aria-keyshortcuts="M">Menu</button>
          <span class="ns-control-spacer" aria-hidden="true"></span>
          <button class="ns-control" type="button" data-action-shell="checkpoint" aria-keyshortcuts="K" hidden>Checkpoint</button>
          <button class="ns-control" type="button" data-action-shell="explore" aria-keyshortcuts="X" hidden>Explore</button>
          <div class="ns-tool-group" role="group" aria-label="Presentation ink tools">
            <button class="ns-control" type="button" data-action-shell="pen" aria-keyshortcuts="P" aria-pressed="false">Pen</button>
            <button class="ns-control" type="button" data-action-shell="eraser" aria-keyshortcuts="E" aria-pressed="false">Eraser</button>
            <button class="ns-control" type="button" data-action-shell="laser" aria-keyshortcuts="L" aria-pressed="false">Laser</button>
            <button class="ns-control" type="button" data-action-shell="whiteboard" aria-keyshortcuts="W" aria-pressed="false">Whiteboard</button>
            <button class="ns-control" type="button" data-action-shell="clear-ink" aria-keyshortcuts="C" disabled>Clear ink</button>
            <button class="ns-control" type="button" data-action-shell="ink-backup">Ink backup</button>
          </div>
          <button class="ns-control" type="button" data-action-shell="fullscreen" aria-keyshortcuts="F" aria-pressed="false">Fullscreen</button>
          <button class="ns-control" type="button" data-action-shell="handout" aria-keyshortcuts="H" aria-pressed="false">Handout</button>
          <button class="ns-control" type="button" data-action-shell="print">Print</button>
          <button class="ns-control" type="button" data-action-shell="help" aria-label="Keyboard help">?</button>
        </nav>
      </main>

      <nav class="ns-handout-toolbar" data-role="handout-toolbar" aria-label="Handout controls" hidden>
        <button class="ns-control ns-control-primary" type="button" data-action-shell="handout-print">Print / Save PDF</button>
        <button class="ns-control" type="button" data-action-shell="handout-exit">Exit handout</button>
      </nav>

      <div class="ns-laser" data-role="laser" aria-hidden="true" hidden></div>
      <input class="ns-visually-hidden" data-role="ink-import" type="file" accept="application/json,.json" tabindex="-1" aria-hidden="true">

      <p class="ns-status" data-role="status" role="status" aria-live="polite" aria-atomic="true"></p>

      <dialog class="ns-dialog" data-role="dialog" aria-labelledby="${dialogTitleId}">
        <div class="ns-dialog-frame">
          <header class="ns-dialog-header">
            <h2 id="${dialogTitleId}" data-role="dialog-title"></h2>
            <button class="ns-icon-button" type="button" data-dialog-close aria-label="Close dialog">&#215;</button>
          </header>
          <div class="ns-dialog-body" data-role="dialog-body"></div>
          <footer class="ns-dialog-footer">
            <button class="ns-control ns-control-primary" type="button" data-dialog-close>Close</button>
          </footer>
        </div>
      </dialog>

      <section class="ns-print-deck" data-role="print-deck" aria-label="Printable lecture slides"></section>
    `;

    const metadata = this.deck.metadata;
    this.elements = {
      stage: this.root.querySelector("[data-role='stage']"),
      slideSurface: this.root.querySelector("[data-role='slide-surface']"),
      annotationCanvas: this.root.querySelector("[data-role='annotation-canvas']"),
      whiteboardLabel: this.root.querySelector("[data-role='whiteboard-label']"),
      progress: this.root.querySelector("[data-role='progress']"),
      counter: this.root.querySelector("[data-role='counter']"),
      status: this.root.querySelector("[data-role='status']"),
      dialog: this.root.querySelector("[data-role='dialog']"),
      dialogTitle: this.root.querySelector("[data-role='dialog-title']"),
      dialogBody: this.root.querySelector("[data-role='dialog-body']"),
      printDeck: this.root.querySelector("[data-role='print-deck']"),
      handoutToolbar: this.root.querySelector("[data-role='handout-toolbar']"),
      laserPointer: this.root.querySelector("[data-role='laser']"),
      inkImport: this.root.querySelector("[data-role='ink-import']"),
      previous: this.root.querySelector("[data-action-shell='previous']"),
      next: this.root.querySelector("[data-action-shell='next']"),
      menu: this.root.querySelector("[data-action-shell='menu']"),
      explore: this.root.querySelector("[data-action-shell='explore']"),
      checkpoint: this.root.querySelector("[data-action-shell='checkpoint']"),
      pen: this.root.querySelector("[data-action-shell='pen']"),
      eraser: this.root.querySelector("[data-action-shell='eraser']"),
      laser: this.root.querySelector("[data-action-shell='laser']"),
      whiteboard: this.root.querySelector("[data-action-shell='whiteboard']"),
      clearInk: this.root.querySelector("[data-action-shell='clear-ink']"),
      inkBackup: this.root.querySelector("[data-action-shell='ink-backup']"),
      fullscreen: this.root.querySelector("[data-action-shell='fullscreen']"),
      handout: this.root.querySelector("[data-action-shell='handout']"),
    };

    this.root.querySelector("[data-role='course']").textContent =
      metadata.course ?? this.options.course ?? "ISE 5405";
    this.root.querySelector("[data-role='deck-title']").textContent = metadata.title;
    setOptionalLink(
      this.root.querySelector("[data-role='home-link']"),
      this.options.homeUrl ?? metadata.homeUrl,
      this.options.homeLabel ?? metadata.homeLabel ?? "← Course home",
    );
    setOptionalLink(
      this.root.querySelector("[data-role='pdf-link']"),
      this.options.pdfUrl ?? metadata.pdfUrl,
      this.options.pdfLabel ?? metadata.pdfLabel ?? "Download PDF",
    );

    this.elements.whiteboard.hidden = this.whiteboardCount === 0;
  }

  setupAnnotations() {
    const deckId = this.deck.metadata.id ?? this.deck.id ?? "native-deck";
    this.annotationStore = new AnnotationStore({
      lectureId: deckId,
      pdfHash: `native-html-${this.deck.annotationVersion ?? 1}`,
      pageCount: this.deck.slides.length + this.whiteboardCount,
      persistent: this.options.persistAnnotations !== false,
      onStatus: (message) => this.announce(message),
    });
    this.annotationController = new AnnotationController({
      canvas: this.elements.annotationCanvas,
      stage: this.elements.stage,
      store: this.annotationStore,
      getPageKey: () => this.currentAnnotationKey(),
      onStatus: (message) => {
        this.announce(message);
        this.updateAnnotationControls();
      },
    });
    this.elements.annotationCanvas.addEventListener("pointerup", () => {
      window.requestAnimationFrame(() => this.updateAnnotationControls());
    });
    this.elements.annotationCanvas.addEventListener("pointercancel", () => {
      window.requestAnimationFrame(() => this.updateAnnotationControls());
    });
    this.updateAnnotationControls();
  }

  bindShell() {
    this.root
      .querySelector("[data-action-shell='previous']")
      .addEventListener("click", () => this.previous());
    this.root
      .querySelector("[data-action-shell='next']")
      .addEventListener("click", () => this.next());
    this.root
      .querySelector("[data-action-shell='menu']")
      .addEventListener("click", () => this.openSlideMenu());
    this.root
      .querySelector("[data-action-shell='explore']")
      .addEventListener("click", () => this.openExplore());
    this.root
      .querySelector("[data-action-shell='checkpoint']")
      .addEventListener("click", () => this.openCheckpoint());
    this.root
      .querySelector("[data-action-shell='pen']")
      .addEventListener("click", () => this.setAnnotationMode("pen"));
    this.root
      .querySelector("[data-action-shell='eraser']")
      .addEventListener("click", () => this.setAnnotationMode("eraser"));
    this.root
      .querySelector("[data-action-shell='laser']")
      .addEventListener("click", () => this.toggleLaser());
    this.root
      .querySelector("[data-action-shell='whiteboard']")
      .addEventListener("click", () => this.toggleWhiteboard());
    this.root
      .querySelector("[data-action-shell='clear-ink']")
      .addEventListener("click", () => this.clearCurrentAnnotations());
    this.root
      .querySelector("[data-action-shell='ink-backup']")
      .addEventListener("click", () => this.openInkBackup());
    this.root
      .querySelector("[data-action-shell='fullscreen']")
      .addEventListener("click", () => this.toggleFullscreen());
    this.root
      .querySelector("[data-action-shell='handout']")
      .addEventListener("click", () => this.toggleHandout());
    this.root
      .querySelector("[data-action-shell='print']")
      .addEventListener("click", () => this.print());
    this.root
      .querySelector("[data-action-shell='help']")
      .addEventListener("click", () => this.openHelp());
    this.root
      .querySelector("[data-action-shell='handout-print']")
      .addEventListener("click", () => this.print());
    this.root
      .querySelector("[data-action-shell='handout-exit']")
      .addEventListener("click", () => this.toggleHandout(false));
    this.elements.inkImport.addEventListener("change", this.handleImportChange);

    this.root.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => this.closeDialog());
    });
    this.elements.dialog.addEventListener("close", () => {
      if (this.dialogReturnFocus?.isConnected) this.dialogReturnFocus.focus();
      this.dialogReturnFocus = null;
    });
    this.elements.dialog.addEventListener("click", (event) => {
      if (event.target === this.elements.dialog) this.closeDialog();
    });

    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("hashchange", this.handleHashChange);
    document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    window.addEventListener("beforeprint", this.handleBeforePrint);
    window.addEventListener("afterprint", this.handleAfterPrint);
    document.addEventListener("pointermove", this.handlePointerMove);
  }

  render({ announce = true, writeHash = true } = {}) {
    this.runMountCleanup();
    clearMath([this.currentElement]);

    const slide = this.deck.slides[this.index];
    this.currentSlide = slide;
    const article = document.createElement("article");
    const titleId = `${this.instanceId}-slide-title`;
    article.className = "ns-slide";
    article.dataset.slideId = slide.id;
    article.setAttribute("aria-labelledby", titleId);
    article.setAttribute("aria-roledescription", "slide");
    article.setAttribute("aria-label", `${this.index + 1} of ${this.deck.slides.length}`);
    if (slide.kind) article.dataset.kind = slide.kind;
    if (slide.className) {
      article.classList.add(...slide.className.split(/\s+/).filter(Boolean));
    }

    const header = document.createElement("header");
    header.className = "ns-slide-header";
    if (slide.eyebrow) {
      const eyebrow = document.createElement("p");
      eyebrow.className = "ns-eyebrow";
      eyebrow.textContent = slide.eyebrow;
      header.append(eyebrow);
    }
    const title = document.createElement("h1");
    title.id = titleId;
    title.dataset.plainTitle = slide.title;
    if (slide.titleHtml) title.innerHTML = slide.titleHtml;
    else title.textContent = slide.title;
    header.append(title);

    const body = document.createElement("div");
    body.className = "ns-slide-body";
    body.innerHTML = slide.html;
    const authoredTitle = body.querySelector("h1, h2");
    if (authoredTitle) {
      authoredTitle.id = titleId;
      article.append(body);
    } else {
      article.append(header, body);
    }

    this.appendAutomaticSlideActions(article, slide);
    this.elements.slideSurface.replaceChildren(article);
    this.currentElement = article;

    this.configureReveals();
    if (typeof this.deck.mountInteraction === "function" && slide.interaction) {
      const cleanup = this.deck.mountInteraction(
        article,
        slide.interaction,
        this.createSlideContext(),
      );
      if (typeof cleanup === "function") this.mountCleanup.push(cleanup);
    }
    this.bindSlideInteractions();
    this.annotationController?.redraw();
    this.updateAnnotationControls();
    this.updateShell();
    this.updateDocumentTitle();
    if (writeHash) this.writeHash();

    if (typeof slide.onMount === "function") {
      const cleanup = slide.onMount(this.createSlideContext());
      if (typeof cleanup === "function") this.mountCleanup.push(cleanup);
    }

    typesetMath([article]);

    this.root.dispatchEvent(
      new CustomEvent("nativeslidechange", {
        detail: {
          index: this.index,
          number: this.index + 1,
          slide,
          revealStep: this.revealStep,
        },
      }),
    );
    if (announce) this.announce(`Slide ${this.index + 1}: ${slide.title}`);
  }

  appendAutomaticSlideActions(article, slide) {
    const explorations = Array.isArray(slide.explorations) ? slide.explorations : [];
    const generated = [];

    explorations.forEach((exploration) => {
      const alreadyAuthored = [...article.querySelectorAll("[data-explore]")].some(
        (element) => element.dataset.explore === exploration.id,
      );
      if (!alreadyAuthored) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ns-slide-action";
        button.dataset.explore = exploration.id;
        button.textContent = exploration.label ?? "Explore";
        generated.push(button);
      }
    });

    if (
      slide.checkpoint &&
      !article.querySelector("[data-checkpoint], [data-action='open-checkpoint']")
    ) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ns-slide-action";
      button.dataset.checkpoint = "";
      button.textContent = slide.checkpoint.label ?? "Checkpoint";
      generated.push(button);
    }

    if (generated.length > 0) {
      const actions = document.createElement("div");
      actions.className = "ns-slide-actions";
      actions.setAttribute("aria-label", "Slide activities");
      actions.append(...generated);
      article.append(actions);
    }
  }

  configureReveals() {
    const nodes = [...this.currentElement.querySelectorAll("[data-reveal], [data-fragment]")];
    const namedGroups = new Map();
    let nextAutomaticStep = 0;
    let maximum = 0;

    nodes.forEach((node) => {
      const raw = (node.dataset.reveal ?? node.dataset.fragment ?? "").trim();
      let step;
      if (/^[1-9]\d*$/.test(raw)) {
        step = Number(raw);
      } else if (raw) {
        if (!namedGroups.has(raw)) namedGroups.set(raw, ++nextAutomaticStep);
        step = namedGroups.get(raw);
      } else {
        step = ++nextAutomaticStep;
      }
      nextAutomaticStep = Math.max(nextAutomaticStep, step);
      maximum = Math.max(maximum, step);
      node.dataset.nativeRevealStep = String(step);
    });

    this.maxRevealStep = maximum;
    const saved = this.revealState.get(this.currentSlide.id) ?? 0;
    this.revealStep = Math.max(0, Math.min(saved, maximum));
    this.revealState.set(this.currentSlide.id, this.revealStep);
    this.applyReveals();
  }

  applyReveals() {
    this.currentElement
      ?.querySelectorAll("[data-native-reveal-step]")
      .forEach((node) => {
        const revealed = Number(node.dataset.nativeRevealStep) <= this.revealStep;
        // Conceal authored reveal layers without removing them from layout.
        // This keeps surrounding blocks, equations, and SVG geometry fixed
        // while the instructor advances through the teaching states.
        node.removeAttribute("hidden");
        node.toggleAttribute("inert", !revealed);
        node.setAttribute("aria-hidden", revealed ? "false" : "true");
        node.classList.toggle("ns-concealed", !revealed);
        node.classList.toggle("ns-revealed", revealed);
      });
  }

  bindSlideInteractions() {
    this.currentElement.querySelectorAll("[data-explore]").forEach((button) => {
      button.addEventListener("click", () => this.openExplore(button.dataset.explore));
    });
    this.currentElement.querySelectorAll("[data-checkpoint]").forEach((button) => {
      button.addEventListener("click", () => this.openCheckpoint());
    });

    this.currentElement.querySelectorAll("[data-action]").forEach((trigger) => {
      if (trigger.dataset.nativeInteractionBound === "true") return;
      const name = trigger.dataset.action;
      if (name === "open-checkpoint") {
        trigger.addEventListener("click", () => this.openCheckpoint());
        return;
      }
      const candidate = this.currentSlide.actions?.[name];
      const handler = typeof candidate === "function" ? candidate : candidate?.run;
      if (typeof handler !== "function") {
        trigger.disabled = true;
        trigger.setAttribute("aria-description", `Action ${name} is unavailable.`);
        return;
      }

      trigger.addEventListener("click", async (event) => {
        const outputName = trigger.dataset.outputTarget ?? name;
        const output = [...this.currentElement.querySelectorAll("[data-output]")].find(
          (element) => element.dataset.output === outputName,
        );
        trigger.setAttribute("aria-busy", "true");
        try {
          const result = await handler({
            ...this.createSlideContext(),
            event,
            trigger,
            output,
            setOutput: (value, { html: useHtml = false } = {}) => {
              if (!output) return;
              clearMath([output]);
              if (useHtml) output.innerHTML = value;
              else output.textContent = value;
              typesetMath([output]);
            },
          });
          if (typeof result === "string" && output) output.textContent = result;
        } catch (error) {
          console.error(`Native slide action failed: ${name}`, error);
          this.announce("That slide activity could not be completed.");
        } finally {
          trigger.removeAttribute("aria-busy");
        }
      });
    });
  }

  createSlideContext() {
    return {
      controller: this,
      deck: this.deck,
      slide: this.currentSlide,
      slideElement: this.currentElement,
      $: (selector) => this.currentElement?.querySelector(selector),
      $$: (selector) => [...(this.currentElement?.querySelectorAll(selector) ?? [])],
      announce: (message) => this.announce(message),
      next: () => this.next(),
      previous: () => this.previous(),
      navigate: (reference) => this.goTo(reference),
      openExplore: (id) => this.openExplore(id),
      openCheckpoint: () => this.openCheckpoint(),
      typesetMath: (elements = [this.currentElement]) => typesetMath(elements),
      clearMath: (elements) => clearMath(elements),
      resetReveals: () => {
        this.revealStep = 0;
        this.revealState.set(this.currentSlide.id, 0);
        this.applyReveals();
        this.updateShell();
        this.writeHash();
        this.dispatchRevealChange();
      },
      registerCleanup: (callback) => {
        if (typeof callback === "function") this.mountCleanup.push(callback);
      },
    };
  }

  runMountCleanup() {
    this.mountCleanup.splice(0).forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Native slide cleanup failed.", error);
      }
    });
  }

  currentAnnotationKey() {
    if (this.viewMode === "whiteboard") {
      return `whiteboard-${this.whiteboardIndex}`;
    }
    return `slide-${this.currentSlide?.id ?? this.deck.slides[this.index].id}`;
  }

  setAnnotationMode(mode) {
    if (!["pen", "eraser", "none"].includes(mode)) return false;
    const next = mode !== "none" && this.annotationMode === mode ? "none" : mode;
    if (next !== "none" && this.laserActive) this.toggleLaser(false);
    this.annotationMode = next;
    this.annotationController?.setMode(next);
    this.updateAnnotationControls();
    const label = next === "pen" ? "Pen" : next === "eraser" ? "Stroke eraser" : "Ink tools";
    this.announce(next === "none" ? "Ink tools off." : `${label} active.`);
    return true;
  }

  toggleWhiteboard() {
    if (this.whiteboardCount === 0) {
      this.announce("No whiteboards are configured for this lecture.");
      return false;
    }
    this.viewMode = this.viewMode === "whiteboard" ? "slide" : "whiteboard";
    const whiteboard = this.viewMode === "whiteboard";
    this.elements.stage.dataset.view = this.viewMode;
    this.elements.stage.classList.toggle("is-whiteboard", whiteboard);
    this.elements.slideSurface.setAttribute("aria-hidden", String(whiteboard));
    this.elements.whiteboardLabel.hidden = !whiteboard;
    this.elements.whiteboardLabel.textContent =
      `Whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}`;
    this.annotationController?.redraw();
    this.updateShell();
    this.updateAnnotationControls();
    this.announce(
      whiteboard
        ? `Whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}. Press W to return to the slide.`
        : `Returned to slide ${this.index + 1}.`,
    );
    return true;
  }

  goToWhiteboard(index) {
    const next = Math.max(1, Math.min(this.whiteboardCount, Number(index) || 1));
    if (next === this.whiteboardIndex) return false;
    this.whiteboardIndex = next;
    this.elements.whiteboardLabel.textContent =
      `Whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}`;
    this.annotationController?.redraw();
    this.updateShell();
    this.updateAnnotationControls();
    this.announce(`Whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}.`);
    return true;
  }

  clearCurrentAnnotations() {
    const key = this.currentAnnotationKey();
    if (!this.annotationStore?.hasPageInk(key)) {
      this.announce("There is no ink on the current surface.");
      this.updateAnnotationControls();
      return false;
    }
    if (!window.confirm("Clear all ink from the current slide or whiteboard?")) return false;
    this.annotationStore.clearPage(key);
    this.annotationController?.redraw();
    this.updateAnnotationControls();
    this.announce("Ink cleared from the current surface.");
    return true;
  }

  openSlideMenu() {
    this.openDialog("Slide menu", (body) => {
      const list = document.createElement("ol");
      list.className = "ns-slide-menu";
      this.deck.slides.forEach((slide, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ns-slide-menu-button";
        button.dataset.slideIndex = String(index);
        button.setAttribute("aria-label", `Slide ${index + 1}: ${slide.title}`);
        if (index === this.index) {
          button.setAttribute("aria-current", "page");
        }
        const number = document.createElement("span");
        number.className = "ns-slide-menu-number";
        number.textContent = String(index + 1).padStart(2, "0");
        const title = document.createElement("span");
        title.textContent = slide.title;
        button.append(number, title);
        button.addEventListener("click", () => {
          this.closeDialog();
          this.goToIndex(index, { step: 0 });
        });
        item.append(button);
        list.append(item);
      });
      body.append(list);
    });
    return true;
  }

  toggleLaser(force = null) {
    const active = force === null ? !this.laserActive : Boolean(force);
    if (active === this.laserActive) return active;
    if (active && this.annotationMode !== "none") {
      this.annotationMode = "none";
      this.annotationController?.setMode("none");
      this.updateAnnotationControls();
    }
    this.laserActive = active;
    this.root.classList.toggle("is-laser-active", active);
    this.elements.laser.setAttribute("aria-pressed", String(active));
    this.elements.laserPointer.hidden = !active;
    if (!active) {
      this.elements.laserPointer.style.removeProperty("left");
      this.elements.laserPointer.style.removeProperty("top");
    }
    this.announce(active ? "Laser pointer active. Press L or Escape to turn it off." : "Laser pointer off.");
    return active;
  }

  handlePointerMove(event) {
    if (!this.laserActive || this.destroyed) return;
    const rect = this.root.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    this.elements.laserPointer.hidden = !inside;
    if (!inside) return;
    this.elements.laserPointer.style.left = `${event.clientX}px`;
    this.elements.laserPointer.style.top = `${event.clientY}px`;
  }

  async toggleHandout(force = null) {
    const active = force === null ? !this.handoutMode : Boolean(force);
    if (active === this.handoutMode) return active;
    if (active) {
      if (this.laserActive) this.toggleLaser(false);
      if (this.annotationMode !== "none") this.setAnnotationMode("none");
      this.printReady = this.preparePrintDeck();
      await this.printReady;
    }
    this.handoutMode = active;
    this.root.classList.toggle("is-handout", active);
    this.elements.handoutToolbar.hidden = !active;
    this.elements.handout.setAttribute("aria-pressed", String(active));
    this.elements.handout.textContent = active ? "Exit handout" : "Handout";
    window.scrollTo({ top: 0, behavior: "auto" });
    this.announce(
      active
        ? `Handout view opened with all ${this.deck.slides.length} slides in their final state.`
        : `Handout view closed. Returned to slide ${this.index + 1}.`,
    );
    return active;
  }

  openInkBackup() {
    this.openDialog("Annotation backup", (body) => {
      const intro = document.createElement("p");
      intro.textContent =
        "Ink is saved only in this browser. Export a JSON backup to move it to another browser or device; importing replaces this lecture’s current ink.";
      const actions = document.createElement("div");
      actions.className = "ns-ink-backup-actions";

      const exportButton = document.createElement("button");
      exportButton.type = "button";
      exportButton.className = "ns-control ns-control-primary";
      exportButton.textContent = "Export ink";
      exportButton.disabled = !this.annotationStore?.hasAnyInk();
      exportButton.addEventListener("click", () => this.exportAnnotations());

      const importButton = document.createElement("button");
      importButton.type = "button";
      importButton.className = "ns-control";
      importButton.textContent = "Import ink";
      importButton.addEventListener("click", () => this.elements.inkImport.click());

      const clearButton = document.createElement("button");
      clearButton.type = "button";
      clearButton.className = "ns-control";
      clearButton.textContent = "Clear all lecture ink";
      clearButton.disabled = !this.annotationStore?.hasAnyInk();
      clearButton.addEventListener("click", () => {
        if (this.clearAllAnnotations()) this.closeDialog();
      });

      actions.append(exportButton, importButton, clearButton);
      body.append(intro, actions);
    });
    return true;
  }

  exportAnnotations() {
    if (!this.annotationStore?.hasAnyInk()) {
      this.announce("There is no lecture ink to export.");
      return false;
    }
    const payload = JSON.stringify(this.annotationStore.exportObject(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const name = String(this.deck.metadata.id ?? this.deck.id ?? "lecture")
      .replace(/[^a-z0-9_-]+/gi, "-");
    link.href = url;
    link.download = `${name}-annotations.json`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    this.announce("Annotation backup downloaded.");
    return true;
  }

  async handleImportChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return false;
    try {
      const payload = JSON.parse(await file.text());
      const inspection = this.annotationStore.inspectImport(payload);
      const mismatches = [];
      if (inspection.lectureMismatch) mismatches.push("a different lecture");
      if (inspection.pdfMismatch) mismatches.push("a different deck version");
      if (inspection.pageCountMismatch) mismatches.push("a different page count");
      if (
        mismatches.length > 0
        && !window.confirm(
          `This backup was made for ${mismatches.join(", ")}. Import it here anyway?`,
        )
      ) {
        this.announce("Annotation import canceled.");
        return false;
      }
      this.annotationStore.importObject(payload);
      this.annotationController?.redraw();
      this.updateAnnotationControls();
      this.refreshPrintAnnotations();
      this.announce("Annotations imported. Existing lecture ink was replaced.");
      this.closeDialog();
      return true;
    } catch (error) {
      console.error("Annotation import failed.", error);
      this.announce(error?.message || "That annotation backup could not be imported.");
      return false;
    }
  }

  clearAllAnnotations() {
    if (!this.annotationStore?.hasAnyInk()) {
      this.announce("There is no lecture ink to clear.");
      return false;
    }
    if (!window.confirm("Clear all saved ink from every slide and whiteboard in this lecture?")) {
      return false;
    }
    this.annotationStore.wipe();
    this.annotationController?.redraw();
    this.updateAnnotationControls();
    this.refreshPrintAnnotations();
    this.announce("All saved ink for this lecture was cleared.");
    return true;
  }

  updateAnnotationControls() {
    if (!this.elements?.pen) return;
    const whiteboard = this.viewMode === "whiteboard";
    this.elements.pen.setAttribute("aria-pressed", String(this.annotationMode === "pen"));
    this.elements.eraser.setAttribute("aria-pressed", String(this.annotationMode === "eraser"));
    this.elements.laser.setAttribute("aria-pressed", String(this.laserActive));
    this.elements.whiteboard.setAttribute("aria-pressed", String(whiteboard));
    this.elements.whiteboard.textContent = whiteboard ? "Return to slide" : "Whiteboard";
    this.elements.whiteboard.setAttribute(
      "aria-label",
      whiteboard
        ? `Return to slide from whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}`
        : `Open whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}`,
    );
    this.elements.clearInk.disabled = !this.annotationStore?.hasPageInk(
      this.currentAnnotationKey(),
    );
    this.elements.stage.setAttribute(
      "aria-label",
      whiteboard
        ? `Whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount}`
        : `Slide ${this.index + 1} of ${this.deck.slides.length}: ${this.currentSlide?.title ?? ""}`,
    );
  }

  next() {
    if (this.viewMode === "whiteboard") {
      if (this.whiteboardIndex < this.whiteboardCount) {
        return this.goToWhiteboard(this.whiteboardIndex + 1);
      }
      this.announce("Last whiteboard.");
      return false;
    }
    if (this.revealStep < this.maxRevealStep) {
      this.revealStep += 1;
      this.revealState.set(this.currentSlide.id, this.revealStep);
      this.applyReveals();
      this.updateShell();
      this.writeHash();
      this.announce(`Reveal ${this.revealStep} of ${this.maxRevealStep}`);
      this.dispatchRevealChange();
      return true;
    }
    if (this.hasPendingCheckpoint()) {
      const slideId = this.currentSlide.id;
      if (this.openCheckpoint()) {
        this.shownCheckpoints.add(slideId);
        this.updateShell();
        this.announce("Checkpoint opened after the completed slide.");
        return true;
      }
    }
    if (this.index < this.deck.slides.length - 1) {
      return this.goToIndex(this.index + 1, { direction: 1 });
    }
    this.announce("End of lecture.");
    return false;
  }

  hasPendingCheckpoint() {
    const slide = this.currentSlide;
    const autoOpen = slide?.checkpoint?.autoOpen ?? slide?.checkpoint?.auto_open;
    return Boolean(
      slide?.checkpoint
      && autoOpen
      && this.revealStep >= this.maxRevealStep
      && !this.shownCheckpoints.has(slide.id)
    );
  }

  previous() {
    if (this.viewMode === "whiteboard") {
      if (this.whiteboardIndex > 1) {
        return this.goToWhiteboard(this.whiteboardIndex - 1);
      }
      this.announce("First whiteboard.");
      return false;
    }
    if (this.revealStep > 0) {
      this.revealStep -= 1;
      this.revealState.set(this.currentSlide.id, this.revealStep);
      this.applyReveals();
      this.updateShell();
      this.writeHash();
      this.announce(
        this.revealStep === 0
          ? "All reveals on this slide are hidden."
          : `Reveal ${this.revealStep} of ${this.maxRevealStep}`,
      );
      this.dispatchRevealChange();
      return true;
    }
    if (this.index > 0) {
      return this.goToIndex(this.index - 1, { direction: -1, showFinalState: true });
    }
    this.announce("Beginning of lecture.");
    return false;
  }

  dispatchRevealChange() {
    this.root.dispatchEvent(
      new CustomEvent("nativerevealchange", {
        detail: {
          slide: this.currentSlide,
          step: this.revealStep,
          total: this.maxRevealStep,
        },
      }),
    );
  }

  /** Go to a one-based slide number or a stable slide id. */
  goTo(reference) {
    let target = -1;
    if (typeof reference === "number" && Number.isFinite(reference)) {
      target = Math.trunc(reference) - 1;
    } else if (typeof reference === "string") {
      target = this.deck.slides.findIndex((slide) => slide.id === reference);
    }
    if (target < 0 || target >= this.deck.slides.length) return false;
    return this.goToIndex(target, { direction: Math.sign(target - this.index) });
  }

  goToIndex(index, { direction = 0, showFinalState = false, step = null } = {}) {
    if (index < 0 || index >= this.deck.slides.length) return false;
    if (this.viewMode === "whiteboard") {
      this.viewMode = "slide";
      this.elements.stage.dataset.view = "slide";
      this.elements.stage.classList.remove("is-whiteboard");
      this.elements.slideSurface.setAttribute("aria-hidden", "false");
      this.elements.whiteboardLabel.hidden = true;
    }
    this.index = index;
    const id = this.deck.slides[index].id;
    const hasSavedRevealState = this.revealState.has(id);
    if (Number.isInteger(step)) {
      this.revealState.set(id, Math.max(0, step));
    } else if ((showFinalState || direction < 0) && !hasSavedRevealState) {
      this.revealState.set(id, Number.MAX_SAFE_INTEGER);
    } else if (!hasSavedRevealState) {
      this.revealState.set(id, 0);
    }
    this.render();
    return true;
  }

  updateShell() {
    const total = this.deck.slides.length;
    this.elements.progress.value = this.index + 1;
    this.elements.progress.max = total;
    this.elements.progress.setAttribute(
      "aria-label",
      `Slide ${this.index + 1} of ${total}`,
    );
    if (this.viewMode === "whiteboard") {
      this.elements.counter.textContent =
        `Whiteboard ${this.whiteboardIndex} of ${this.whiteboardCount} · slide ${this.index + 1} paused`;
      this.elements.previous.disabled = this.whiteboardIndex <= 1;
      this.elements.next.disabled = this.whiteboardIndex >= this.whiteboardCount;
      this.elements.previous.textContent = "Previous board";
      this.elements.next.textContent = "Next board";
      this.elements.explore.hidden = true;
      this.elements.checkpoint.hidden = true;
      this.updateAnnotationControls();
      return;
    }

    this.elements.counter.textContent = `Slide ${this.index + 1} of ${total}`;

    const canGoBack = this.index > 0 || this.revealStep > 0;
    const pendingCheckpoint = this.hasPendingCheckpoint();
    const canGoForward =
      this.index < total - 1 || this.revealStep < this.maxRevealStep || pendingCheckpoint;
    this.elements.previous.disabled = !canGoBack;
    this.elements.next.disabled = !canGoForward;
    this.elements.previous.textContent =
      this.revealStep > 0 ? "Hide reveal" : "Previous slide";
    this.elements.next.textContent =
      this.revealStep < this.maxRevealStep
        ? "Reveal next"
        : pendingCheckpoint
          ? "Open checkpoint"
          : this.index < total - 1
            ? "Next slide"
            : "End of lecture";

    const explorations = this.currentSlide.explorations ?? [];
    this.elements.explore.hidden = explorations.length === 0;
    if (explorations.length > 0) {
      this.elements.explore.textContent = explorations[0].label ?? "Explore";
    }
    this.elements.checkpoint.hidden = !this.currentSlide.checkpoint;
    if (this.currentSlide.checkpoint) {
      this.elements.checkpoint.textContent =
        this.currentSlide.checkpoint.label ?? "Checkpoint";
    }
    this.updateAnnotationControls();
  }

  updateDocumentTitle() {
    if (this.options.updateDocumentTitle === false) return;
    document.title = `${this.currentSlide.title} — ${this.deck.metadata.title}`;
  }

  readHash() {
    const rawHash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(rawHash);
    const slideValue = params.get("slide");
    if (!slideValue) return null;

    let index;
    if (/^[1-9]\d*$/.test(slideValue)) {
      index = Number(slideValue) - 1;
    } else {
      index = this.deck.slides.findIndex((slide) => slide.id === slideValue);
    }
    if (index < 0 || index >= this.deck.slides.length) return null;

    const hasStep = params.has("step");
    const parsedStep = Number(params.get("step") ?? 0);
    const step = Number.isInteger(parsedStep) && parsedStep >= 0 ? parsedStep : 0;
    return { index, step, hasStep };
  }

  writeHash() {
    if (this.options.manageHash === false) return;
    const params = new URLSearchParams();
    params.set("slide", String(this.index + 1));
    if (this.revealStep > 0) params.set("step", String(this.revealStep));
    const nextHash = `#${params.toString()}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }

  handleHashChange() {
    const parsed = this.readHash();
    if (!parsed) return;
    if (
      parsed.index === this.index
      && ((parsed.hasStep && parsed.step === this.revealStep)
        || (!parsed.hasStep && this.revealStep === 0))
    ) return;
    if (parsed.hasStep) {
      this.goToIndex(parsed.index, { step: parsed.step });
      return;
    }
    this.goToIndex(parsed.index, { direction: Math.sign(parsed.index - this.index) });
  }

  handleKeydown(event) {
    if (this.destroyed || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const key = event.key.toLowerCase();
    if (this.elements.dialog.open) return;

    // Ink shortcuts remain usable after a presenter clicks one of the toolbar
    // buttons. Do not intercept letters while someone is editing an input or
    // operating a select control.
    const targetTag = event.target?.tagName;
    const targetAcceptsTextOrChoice = ["INPUT", "SELECT", "TEXTAREA"].includes(targetTag);
    if (!targetAcceptsTextOrChoice) {
      if (key === "h") {
        event.preventDefault();
        this.toggleHandout();
        return;
      }
      if (this.handoutMode) return;
      if (key === "m") {
        event.preventDefault();
        this.openSlideMenu();
        return;
      }
      if (key === "p") {
        event.preventDefault();
        this.setAnnotationMode("pen");
        return;
      }
      if (key === "e") {
        event.preventDefault();
        this.setAnnotationMode("eraser");
        return;
      }
      if (key === "c") {
        event.preventDefault();
        this.clearCurrentAnnotations();
        return;
      }
      if (key === "l") {
        event.preventDefault();
        this.toggleLaser();
        return;
      }
      if (key === "w" && this.whiteboardCount > 0) {
        event.preventDefault();
        this.toggleWhiteboard();
        return;
      }
      if (key === "k" && this.viewMode === "slide" && this.currentSlide.checkpoint) {
        event.preventDefault();
        this.openCheckpoint();
        return;
      }
      if (key === "escape" && (this.annotationMode !== "none" || this.laserActive)) {
        event.preventDefault();
        if (this.laserActive) this.toggleLaser(false);
        else this.setAnnotationMode("none");
        return;
      }
    }

    if (this.handoutMode) return;
    if (isTypingOrOperatingControl(event.target)) return;

    if (["arrowright", "arrowdown", "pagedown", " "].includes(key)) {
      event.preventDefault();
      this.next();
    } else if (["arrowleft", "arrowup", "pageup"].includes(key)) {
      event.preventDefault();
      this.previous();
    } else if (key === "home") {
      event.preventDefault();
      this.goToIndex(0, { step: 0 });
    } else if (key === "end") {
      event.preventDefault();
      this.goToIndex(this.deck.slides.length - 1, { showFinalState: true });
    } else if (key === "f") {
      event.preventDefault();
      this.toggleFullscreen();
    } else if (
      key === "x" &&
      this.viewMode === "slide" &&
      (this.currentSlide.explorations?.length ?? 0) > 0
    ) {
      event.preventDefault();
      this.openExplore();
    } else if (key === "?") {
      event.preventDefault();
      this.openHelp();
    }
  }

  openExplore(id = null) {
    const explorations = this.currentSlide.explorations ?? [];
    const exploration = id
      ? explorations.find((candidate) => candidate.id === id)
      : explorations[0];
    if (!exploration) return false;

    this.openDialog(exploration.title ?? exploration.label ?? "Explore", (body) => {
      if (typeof exploration.html === "string") {
        body.innerHTML = exploration.html;
      } else if (Array.isArray(exploration.cards)) {
        const grid = document.createElement("div");
        grid.className = "ns-explore-grid";
        exploration.cards.forEach((card) => {
          const details = document.createElement("details");
          details.className = "ns-explore-card";
          const summary = document.createElement("summary");
          summary.textContent = card.title ?? card.label ?? "Details";
          const content = document.createElement("div");
          content.className = "ns-explore-content";
          if (typeof card.html === "string") {
            content.innerHTML = card.html;
          } else if (Array.isArray(card.sections)) {
            card.sections.forEach((section) => {
              const heading = document.createElement("h3");
              heading.textContent = section.title ?? section.label ?? "";
              const paragraph = document.createElement("p");
              textOrHtml(paragraph, section.text ?? section.body, section.html);
              content.append(heading, paragraph);
            });
          }
          details.append(summary, content);
          grid.append(details);
        });
        body.append(grid);
      } else if (Array.isArray(exploration.sections)) {
        exploration.sections.forEach((section) => {
          const heading = document.createElement("h3");
          heading.textContent = section.title ?? section.label ?? "";
          const content = document.createElement("div");
          textOrHtml(content, section.text ?? section.body, section.html);
          body.append(heading, content);
        });
      }
    });
    this.root.dispatchEvent(
      new CustomEvent("nativeexploreopen", { detail: { slide: this.currentSlide, exploration } }),
    );
    return true;
  }

  openCheckpoint() {
    const checkpoint = this.currentSlide.checkpoint;
    if (!checkpoint || !Array.isArray(checkpoint.choices)) return false;

    this.openDialog(checkpoint.title ?? "Checkpoint", (body) => {
      const form = document.createElement("form");
      form.className = "ns-checkpoint";
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      textOrHtml(legend, checkpoint.prompt ?? checkpoint.question, checkpoint.promptHtml);
      fieldset.append(legend);

      const name = `${this.instanceId}-checkpoint-${this.index}`;
      checkpoint.choices.forEach((choice, index) => {
        const label = document.createElement("label");
        label.className = "ns-choice";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = name;
        input.value = String(index);
        const text = document.createElement("span");
        if (choice && typeof choice === "object" && typeof choice.html === "string") {
          text.innerHTML = choiceMarkup(choice);
        } else {
          text.textContent = choiceMarkup(choice);
        }
        label.append(input, text);
        fieldset.append(label);
      });

      const result = document.createElement("div");
      result.className = "ns-checkpoint-result";
      result.setAttribute("role", "status");
      result.setAttribute("aria-live", "polite");
      const submit = document.createElement("button");
      submit.className = "ns-control ns-control-primary";
      submit.type = "submit";
      submit.textContent = checkpoint.submitLabel ?? "Check answer";
      form.append(fieldset, submit, result);

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const selected = form.querySelector(`input[name="${name}"]:checked`);
        if (!selected) {
          result.textContent = "Choose an answer first.";
          result.dataset.result = "missing";
          return;
        }
        const selectedIndex = Number(selected.value);
        const correctIndex = checkpoint.correctIndex ?? checkpoint.correct_index;
        const correct = selectedIndex === correctIndex;
        result.replaceChildren();
        const outcome = document.createElement("strong");
        outcome.textContent = correct ? "Correct." : "Not yet.";
        result.append(outcome);
        if (checkpoint.explanation || checkpoint.explanationHtml) {
          const explanation = document.createElement("p");
          textOrHtml(explanation, checkpoint.explanation, checkpoint.explanationHtml);
          result.append(explanation);
        }
        result.dataset.result = correct ? "correct" : "incorrect";
        fieldset.querySelectorAll(".ns-choice").forEach((label, index) => {
          if (index === correctIndex) label.dataset.correct = "true";
          if (index === selectedIndex && !correct) label.dataset.incorrect = "true";
        });
        fieldset.disabled = true;
        submit.hidden = true;
        typesetMath([result]);
        checkpoint.onAnswer?.({ correct, selectedIndex, correctIndex, controller: this });
        this.root.dispatchEvent(
          new CustomEvent("nativecheckpointanswer", {
            detail: { slide: this.currentSlide, checkpoint, correct, selectedIndex },
          }),
        );
      });

      body.append(form);
    });
    return true;
  }

  openHelp() {
    this.openDialog("Presentation controls", (body) => {
      body.innerHTML = `
        <dl class="ns-shortcuts">
          <div><dt>Next or reveal</dt><dd><kbd>Space</kbd> <kbd>→</kbd> <kbd>↓</kbd> <kbd>Page Down</kbd></dd></div>
          <div><dt>Back or hide reveal</dt><dd><kbd>←</kbd> <kbd>↑</kbd> <kbd>Page Up</kbd></dd></div>
          <div><dt>First / last slide</dt><dd><kbd>Home</kbd> / <kbd>End</kbd></dd></div>
          <div><dt>Fullscreen</dt><dd><kbd>F</kbd></dd></div>
          <div><dt>Slide menu</dt><dd><kbd>M</kbd></dd></div>
          <div><dt>Explore current slide</dt><dd><kbd>X</kbd></dd></div>
          <div><dt>Open checkpoint</dt><dd><kbd>K</kbd></dd></div>
          <div><dt>Pen / eraser</dt><dd><kbd>P</kbd> / <kbd>E</kbd></dd></div>
          <div><dt>Clear current ink</dt><dd><kbd>C</kbd></dd></div>
          <div><dt>Laser pointer</dt><dd><kbd>L</kbd></dd></div>
          <div><dt>Whiteboard / return</dt><dd><kbd>W</kbd></dd></div>
          <div><dt>All-slide handout / return</dt><dd><kbd>H</kbd></dd></div>
          <div><dt>Turn ink or laser off</dt><dd><kbd>Esc</kbd></dd></div>
        </dl>
        <p>All functions are also available through the visible controls. A normal click on slide content does not advance.</p>
        <p><strong>Save an annotated PDF:</strong> open <em>Handout</em>, then choose <em>Print / Save PDF</em>. Every reveal and saved slide annotation is included. On iPad, use Share → Print → Save to Files. Use <em>Ink backup</em> to export or import annotations between browsers or devices.</p>
      `;
    });
  }

  openDialog(title, renderBody) {
    this.dialogReturnFocus = document.activeElement;
    this.elements.dialogTitle.textContent = title;
    clearMath([this.elements.dialogBody]);
    this.elements.dialogBody.replaceChildren();
    renderBody(this.elements.dialogBody);
    typesetMath([this.elements.dialogBody]);
    if (typeof this.elements.dialog.showModal === "function") {
      this.elements.dialog.showModal();
    } else {
      this.elements.dialog.setAttribute("open", "");
    }
    const firstControl = this.elements.dialog.querySelector(
      "button, input, select, textarea, summary, a[href]",
    );
    firstControl?.focus();
  }

  closeDialog() {
    if (!this.elements.dialog.hasAttribute("open")) return;
    if (typeof this.elements.dialog.close === "function") {
      this.elements.dialog.close();
    } else {
      this.elements.dialog.removeAttribute("open");
    }
  }

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement === this.root) {
        await document.exitFullscreen();
      } else if (this.root.requestFullscreen) {
        await this.root.requestFullscreen();
      } else {
        this.announce("Fullscreen is not available in this browser.");
      }
    } catch (error) {
      console.error("Fullscreen request failed.", error);
      this.announce("Fullscreen could not be opened.");
    }
  }

  handleFullscreenChange() {
    const active = document.fullscreenElement === this.root;
    this.elements.fullscreen.setAttribute("aria-pressed", String(active));
    this.elements.fullscreen.textContent = active ? "Exit fullscreen" : "Fullscreen";
    this.announce(active ? "Fullscreen opened." : "Fullscreen closed.");
  }

  renderPrintDeck() {
    clearMath([this.elements.printDeck]);
    const records = this.deck.slides.map((slide, index) => {
      const article = document.createElement("article");
      article.className = "ns-print-slide ns-slide";
      article.dataset.slideId = slide.id;
      article.setAttribute("aria-roledescription", "slide");
      article.setAttribute("aria-label", `${index + 1} of ${this.deck.slides.length}`);
      if (slide.kind) article.dataset.kind = slide.kind;
      if (slide.className) {
        article.classList.add(...slide.className.split(/\s+/).filter(Boolean));
      }

      const printPrefix = `${this.instanceId}-print-${index + 1}`;
      const header = document.createElement("header");
      header.className = "ns-slide-header";
      if (slide.eyebrow) {
        const eyebrow = document.createElement("p");
        eyebrow.className = "ns-eyebrow";
        eyebrow.textContent = slide.eyebrow;
        header.append(eyebrow);
      }
      const title = document.createElement("h1");
      title.id = `${printPrefix}-title`;
      title.dataset.plainTitle = slide.title;
      if (slide.titleHtml) title.innerHTML = slide.titleHtml;
      else title.textContent = slide.title;
      header.append(title);
      const body = document.createElement("div");
      body.className = "ns-slide-body";
      body.innerHTML = slide.printHtml ?? slide.html;
      namespacePrintIds(body, printPrefix);
      const number = document.createElement("span");
      number.className = "ns-print-number";
      number.textContent = `${index + 1} / ${this.deck.slides.length}`;
      const authoredTitle = body.querySelector("h1, h2");
      const titleId = authoredTitle?.id || title.id;
      if (authoredTitle && !authoredTitle.id) authoredTitle.id = titleId;
      article.setAttribute("aria-labelledby", titleId);
      article.append(...(authoredTitle ? [body, number] : [header, body, number]));
      return { article, index, slide };
    });
    this.elements.printDeck.replaceChildren(...records.map(({ article }) => article));
    return records;
  }

  createPrintSlideContext(record, registeredCleanups) {
    const { article, slide } = record;
    const inactive = () => false;
    const controller = {
      root: article,
      deck: this.deck,
      currentSlide: slide,
      announce: () => {},
    };
    return {
      controller,
      deck: this.deck,
      slide,
      slideElement: article,
      $: (selector) => article.querySelector(selector),
      $$: (selector) => [...article.querySelectorAll(selector)],
      announce: () => {},
      next: inactive,
      previous: inactive,
      navigate: inactive,
      openExplore: inactive,
      openCheckpoint: inactive,
      typesetMath: (elements = [article]) => typesetMath(elements),
      clearMath: (elements) => clearMath(elements),
      resetReveals: inactive,
      registerCleanup: (callback) => {
        if (typeof callback === "function") registeredCleanups.push(callback);
      },
    };
  }

  mountPrintSlide(record) {
    const { article, slide } = record;
    // `printHtml` is an explicit static replacement and may intentionally omit
    // the controls/canvas expected by the screen-only mount hook.
    if (typeof slide.printHtml === "string") return null;

    const cleanups = [];
    const context = this.createPrintSlideContext(record, cleanups);
    const finish = (cleanup) => {
      if (typeof cleanup === "function") cleanups.push(cleanup);
      cleanups.splice(0).forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error(`Native print cleanup failed for ${slide.id}.`, error);
        }
      });
    };

    try {
      const results = [];
      if (typeof this.deck.mountInteraction === "function" && slide.interaction) {
        results.push(this.deck.mountInteraction(article, slide.interaction, context));
      }
      if (typeof slide.onMount === "function") results.push(slide.onMount(context));
      const pending = results.filter((result) => result && typeof result.then === "function");
      results.filter((result) => typeof result === "function").forEach((cleanup) => cleanups.push(cleanup));
      if (pending.length > 0) {
        return Promise.allSettled(pending).then((settled) => {
          settled.forEach((result) => {
            if (result.status === "fulfilled" && typeof result.value === "function") {
              cleanups.push(result.value);
            } else if (result.status === "rejected") {
              console.error(`Native print mount failed for ${slide.id}.`, result.reason);
            }
          });
          finish();
        });
      }
      finish();
    } catch (error) {
      console.error(`Native print mount failed for ${slide.id}.`, error);
      finish();
    }
    return null;
  }

  finalizePrintSlide({ article }) {
    article.querySelectorAll("[data-reveal], [data-fragment]").forEach((node) => {
      node.removeAttribute("hidden");
      node.removeAttribute("inert");
      node.removeAttribute("aria-hidden");
      node.classList.remove("ns-concealed");
      node.classList.add("ns-revealed");
    });
    article.querySelectorAll("details").forEach((details) => {
      details.open = true;
    });
    staticizePrintControls(article);
  }

  refreshPrintAnnotations(records = null) {
    const printArticles = [...this.elements.printDeck.querySelectorAll(".ns-print-slide")];
    const pages = records ?? this.deck.slides.map((slide, index) => ({
      article: printArticles[index] ?? null,
      index,
      slide,
    }));
    pages.forEach(({ article, index, slide }) => {
      if (!article) return;
      article.querySelector(".ns-print-annotation")?.remove();
      const strokes = this.annotationStore?.strokes(`slide-${slide.id}`) ?? [];
      if (strokes.length === 0) return;
      const canvas = document.createElement("canvas");
      canvas.className = "ns-print-annotation";
      canvas.width = 1600;
      canvas.height = 900;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `Saved freehand annotations for slide ${index + 1}`);
      drawStrokesOnCanvas(canvas, strokes);
      article.append(canvas);
    });
  }

  async preparePrintDeck() {
    const records = this.renderPrintDeck();
    const mounts = records.map((record) => this.mountPrintSlide(record)).filter(Boolean);
    if (mounts.length > 0) await Promise.allSettled(mounts);
    records.forEach((record) => this.finalizePrintSlide(record));
    this.refreshPrintAnnotations(records);
    await typesetMath(records.map(({ article }) => article));
    return true;
  }

  handleBeforePrint() {
    if (this.elements.printDeck.childElementCount === 0) {
      this.printReady = this.preparePrintDeck();
    } else {
      // `beforeprint` cannot await MathJax, but refreshing the already-built
      // overlay is synchronous and captures ink added since initial mount.
      this.refreshPrintAnnotations();
    }
  }

  handleAfterPrint() {}

  async print() {
    this.printReady = this.preparePrintDeck();
    await this.printReady;
    window.print();
  }

  announce(message) {
    this.elements.status.textContent = "";
    window.requestAnimationFrame(() => {
      this.elements.status.textContent = message;
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.runMountCleanup();
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("hashchange", this.handleHashChange);
    document.removeEventListener("fullscreenchange", this.handleFullscreenChange);
    window.removeEventListener("beforeprint", this.handleBeforePrint);
    window.removeEventListener("afterprint", this.handleAfterPrint);
    document.removeEventListener("pointermove", this.handlePointerMove);
    this.elements.inkImport.removeEventListener("change", this.handleImportChange);
    this.annotationController?.resizeObserver?.disconnect();
    clearMath([this.currentElement, this.elements.dialogBody, this.elements.printDeck]);
    this.closeDialog();
    this.root.replaceChildren();
    this.root.classList.remove("native-deck", "is-handout", "is-laser-active");
    delete this.root.dataset.nativeDeck;
  }
}
