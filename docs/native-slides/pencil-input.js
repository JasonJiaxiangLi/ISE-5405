/** Keep stylus ink separate from deliberate finger navigation in presentation mode. */
export class PencilInputGuard {
  constructor({root, stage, canvas, enabled}) {
    this.root = root;
    this.stage = stage;
    this.canvas = canvas;
    this.enabled = enabled;
    this.contacts = new Map();
    this.pens = new Set();
    this.quietUntil = 0;
    this.recent = null;
    this.listeners = [];
    const listen = (type, handler) => {
      document.addEventListener(type, handler, {capture: true, passive: false});
      this.listeners.push([type, handler]);
    };
    listen('pointerdown', e => this.down(e));
    listen('pointermove', e => this.move(e));
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(type, e => this.end(e));
    listen('click', e => this.click(e));
    // iPad Safari can start its native selection/callout through the TouchEvent
    // or compatibility-mouse path, even when pointerdown was canceled. Keep
    // canceling these defaults BETWEEN strokes too; pointer events still ink.
    for (const type of ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mouseup', 'dblclick']) {
      listen(type, e => {
        if (!this.enabled() || !this.stage.contains(e.target)) return;
        if (e.cancelable) e.preventDefault();
        this.clearSelection();
      });
    }
    // Some iOS selections bypass selectstart/contextmenu entirely, including
    // selection of the canvas as an object. Remove the actual selection, not
    // merely its blue highlight, so it cannot keep the edit menu open.
    listen('selectionchange', () => this.clearSelection());
    for (const type of ['selectstart', 'contextmenu', 'dragstart']) {
      listen(type, e => {
        if (this.enabled() && this.root.contains(e.target) && !this.editable(e.target)) {
          this.stop(e);
          this.clearSelection();
        }
      });
    }
  }

  editable(node) {
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    return element?.closest('input,textarea,[contenteditable]:not([contenteditable="false"]),.ns-dialog');
  }

  clearSelection() {
    if (!this.enabled()) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    const editable = this.editable(selection.anchorNode);
    if (editable && editable === this.editable(selection.focusNode)) return;
    for (let i = 0; i < selection.rangeCount; i++) {
      if (selection.getRangeAt(i).intersectsNode(this.root)) {
        selection.removeAllRanges();
        return;
      }
    }
  }

  stop(event) {
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation();
  }

  busy() { return this.pens.size > 0 || performance.now() < this.quietUntil; }
  target(element) { return element.closest?.('button,a,input,select,summary') || element; }

  down(event) {
    if (!this.enabled() || !this.root.contains(event.target)) return;
    this.clearSelection();
    const ink = event.target === this.canvas;
    const pen = event.pointerType === 'pen';
    if (pen && ink) {
      this.pens.add(event.pointerId);
      // A palm may land BEFORE the Pencil. Ignore its eventual release/click too.
      for (const contact of this.contacts.values()) if (contact.type !== 'pen') contact.blocked = true;
    }
    const blocked = pen ? !ink : ink || this.busy();
    this.contacts.set(event.pointerId, {blocked, type: event.pointerType, target: this.target(event.target)});
    if (blocked) this.stop(event);
  }

  move(event) {
    if (this.enabled() && this.contacts.get(event.pointerId)?.blocked) this.stop(event);
  }

  end(event) {
    this.clearSelection();
    const contact = this.contacts.get(event.pointerId);
    if (!contact) return;
    this.contacts.delete(event.pointerId);
    if (this.pens.delete(event.pointerId)) this.quietUntil = performance.now() + 300;
    this.recent = {...contact, until: performance.now() + 900};
    if (this.enabled() && contact.blocked) this.stop(event);
  }

  click(event) {
    if (!this.enabled() || !this.root.contains(event.target)) return;
    // Keyboard/assistive activation has no pointer type and detail zero.
    if (!event.pointerType && event.detail === 0) return;
    const recentBlocked = this.recent?.blocked && performance.now() < this.recent.until
      && this.recent.target === this.target(event.target);
    // Older Safari synthesizes MouseEvent clicks; use the preceding pointer
    // sequence too, rather than relying on click.pointerType alone.
    if (event.pointerType === 'pen' || this.stage.contains(event.target) || this.busy() || recentBlocked) this.stop(event);
  }

  reset() {
    this.contacts.clear();
    this.pens.clear();
    this.quietUntil = 0;
    this.recent = null;
  }

  destroy() {
    for (const [type, handler] of this.listeners) document.removeEventListener(type, handler, true);
    this.reset();
  }
}
