const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function openDialog(dialog, opener = document.activeElement) {
  if (!dialog || dialog.open) return;
  dialog.__opener = opener;
  dialog.showModal();
  const first = dialog.querySelector(FOCUSABLE);
  first?.focus();
}

export function closeDialog(dialog) {
  if (!dialog?.open) return false;
  const opener = dialog.__opener;
  dialog.close();
  if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
  return true;
}

export function installDialogBehavior(dialog) {
  if (!dialog) return;

  dialog.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(dialog));
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog(dialog);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll(FOCUSABLE)].filter((item) => item.offsetParent !== null);
    if (!controls.length) return;
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

export function closeTopDialog() {
  const dialogs = [...document.querySelectorAll('dialog[open]')];
  return dialogs.length ? closeDialog(dialogs.at(-1)) : false;
}
