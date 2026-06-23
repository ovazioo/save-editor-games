import { html } from '../helpers';
import { Toast } from 'bootstrap';

export function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const bgClass = type === 'success' ? 'text-bg-success' :
    type === 'error' ? 'text-bg-danger' : 'text-bg-warning';

  const toastEl = html('div', {
    className: `toast ${bgClass} border-0`,
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': 'true',
    'data-bs-delay': '3500'
  }, [
    html('div', { className: 'd-flex' }, [
      html('div', { className: 'toast-body' }, [message]),
      html('button', {
        type: 'button',
        className: 'btn-close btn-close-white me-2 m-auto',
        'data-bs-dismiss': 'toast',
        'aria-label': 'Fechar'
      })
    ])
  ]);

  container.appendChild(toastEl);
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());

  const toast = new Toast(toastEl);
  toast.show();
}
