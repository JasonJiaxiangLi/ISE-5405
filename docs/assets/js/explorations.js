import { installDialogBehavior, openDialog } from './accessibility.js';

export class ExplorationController {
  constructor({ dialog, button, explorations = [], onStatus = () => {} }) {
    this.dialog = dialog;
    this.button = button;
    this.explorations = new Map(
      explorations.map((exploration) => [Number(exploration.page), exploration])
    );
    this.onStatus = onStatus;
    this.title = dialog?.querySelector('#exploration-title');
    this.intro = dialog?.querySelector('#exploration-intro');
    this.items = dialog?.querySelector('#exploration-items');
    this.currentPage = 1;
    installDialogBehavior(dialog);
  }

  forPage(page) {
    return this.explorations.get(Number(page)) || null;
  }

  update(page) {
    this.currentPage = Number(page);
    const exploration = this.forPage(page);
    if (!this.button) return;
    this.button.hidden = !exploration;
    if (!exploration) {
      this.button.removeAttribute('aria-label');
      this.button.removeAttribute('title');
      return;
    }
    const label = exploration.button_label || 'Explore this slide';
    const visibleLabel = this.button.querySelector('.control-label');
    if (visibleLabel) visibleLabel.textContent = ` ${label}`;
    this.button.setAttribute('aria-label', label);
    this.button.title = label;
  }

  openForPage(page = this.currentPage, opener = this.button) {
    const exploration = this.forPage(page);
    if (!exploration || !this.dialog) {
      this.onStatus('There is no exploration on this page.');
      return false;
    }
    this.render(exploration);
    openDialog(this.dialog, opener);
    return true;
  }

  render(exploration) {
    this.title.textContent = exploration.title;
    this.intro.textContent = exploration.intro || '';
    this.intro.hidden = !exploration.intro;
    this.items.replaceChildren();

    exploration.items.forEach((item) => {
      const card = document.createElement('details');
      card.className = 'exploration-card';

      const summary = document.createElement('summary');
      const heading = document.createElement('span');
      heading.className = 'exploration-card-title';
      heading.textContent = item.title;
      const teaser = document.createElement('span');
      teaser.className = 'exploration-card-summary';
      teaser.textContent = item.summary;
      summary.append(heading, teaser);

      const details = document.createElement('dl');
      details.className = 'exploration-details';
      item.sections.forEach((section) => {
        const row = document.createElement('div');
        const term = document.createElement('dt');
        const description = document.createElement('dd');
        term.textContent = section.heading;
        description.textContent = section.body;
        row.append(term, description);
        details.append(row);
      });

      card.append(summary, details);
      this.items.append(card);
    });
  }
}
