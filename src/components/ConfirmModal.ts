import { html } from '../helpers';
import { Modal } from 'bootstrap';

export function showConfirm(
  title: string,
  message: string,
  options: {
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: string;
    icon?: string;
  } = {}
): Promise<boolean> {
  const {
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    confirmVariant = 'danger',
    icon = '⚠️'
  } = options;

  return new Promise(resolve => {
    const modalEl = html('div', { className: 'modal fade', tabindex: '-1', 'aria-hidden': 'true' }, [
      html('div', { className: 'modal-dialog modal-dialog-centered' }, [
        html('div', { className: 'modal-content' }, [
          html('div', { className: 'modal-header border-0 pb-0' }, [
            html('span', { className: 'fs-5' }, [icon + ' ']),
            html('h6', { className: 'modal-title d-inline' }, [title]),
            html('button', { type: 'button', className: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Fechar' })
          ]),
          html('div', { className: 'modal-body' }, [message]),
          html('div', { className: 'modal-footer border-0' }, [
            html('button', { type: 'button', className: 'btn btn-outline-secondary', 'data-bs-dismiss': 'modal' }, [cancelLabel]),
            html('button', { type: 'button', className: `btn btn-${confirmVariant}`, id: 'confirm-btn' }, [confirmLabel])
          ])
        ])
      ])
    ]);

    const container = document.getElementById('modal-container');
    if (!container) {
      resolve(false);
      return;
    }
    container.appendChild(modalEl);

    let modal: Modal;
    try {
      modal = new Modal(modalEl);
    } catch {
      modalEl.remove();
      resolve(false);
      return;
    }

    const confirmBtn = modalEl.querySelector('#confirm-btn') as HTMLButtonElement | null;

    modalEl.addEventListener('shown.bs.modal', () => confirmBtn?.focus());

    confirmBtn?.addEventListener('click', () => {
      resolve(true);
      modal.hide();
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      modalEl.remove();
      resolve(false);
    });

    modal.show();
  });
}
