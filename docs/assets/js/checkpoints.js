import { installDialogBehavior, openDialog } from './accessibility.js';

export class CheckpointController {
  constructor({ dialog, checkpoints = [], lectureId, onStatus = () => {} }) {
    this.dialog = dialog;
    this.checkpoints = new Map(checkpoints.map((checkpoint) => [Number(checkpoint.page), checkpoint]));
    this.lectureId = lectureId;
    this.onStatus = onStatus;
    this.current = null;
    this.form = dialog?.querySelector('#checkpoint-form');
    this.question = dialog?.querySelector('#checkpoint-question');
    this.choices = dialog?.querySelector('#checkpoint-choices');
    this.feedback = dialog?.querySelector('#checkpoint-feedback');
    installDialogBehavior(dialog);
    this.form?.addEventListener('submit', (event) => this.submit(event));
  }

  forPage(page) {
    return this.checkpoints.get(Number(page)) || null;
  }

  openForPage(page, opener) {
    const checkpoint = this.forPage(page);
    if (!checkpoint || !this.dialog) {
      this.onStatus('There is no checkpoint on this page.');
      return false;
    }
    this.current = checkpoint;
    this.render();
    openDialog(this.dialog, opener);
    return true;
  }

  maybeAutoOpen(page) {
    const checkpoint = this.forPage(page);
    if (!checkpoint?.auto_open) return;
    const key = `ise5405:checkpoint-session:${this.lectureId}:${page}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, 'shown');
    } catch { /* Session storage is optional. */ }
    this.openForPage(page);
  }

  render() {
    const checkpoint = this.current;
    this.question.textContent = checkpoint.question;
    this.choices.replaceChildren();
    this.feedback.textContent = '';
    this.feedback.className = 'checkpoint-feedback';
    checkpoint.choices.forEach((choice, index) => {
      const label = document.createElement('label');
      label.className = 'checkpoint-choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'checkpoint-answer';
      input.value = String(index);
      if (index === 0) input.required = true;
      const text = document.createElement('span');
      text.textContent = choice;
      label.append(input, text);
      this.choices.append(label);
    });
  }

  submit(event) {
    event.preventDefault();
    const selected = this.form.elements.namedItem('checkpoint-answer')?.value;
    if (selected === undefined || selected === '') return;
    const correct = Number(selected) === Number(this.current.correct_index);
    const label = correct ? '✓ Correct.' : '✗ Not quite.';
    this.feedback.textContent = this.current.explanation ? `${label} ${this.current.explanation}` : label;
    this.feedback.className = `checkpoint-feedback ${correct ? 'is-correct' : 'is-incorrect'}`;
    this.onStatus(correct ? 'Checkpoint answer is correct.' : 'Checkpoint answer is incorrect.');
  }
}
