import { html } from '../helpers';

export function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const bgClass = type === 'success' ? 'text-bg-success' :
    type === 'error' ? 'text-bg-danger' : 'text-bg-warning';

  const toast = html('div', {
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

  container.appendChild(toast);

  // Initialize and show using Bootstrap JS if available
  const bs = (window as unknown as Record<string, unknown>).bootstrap;
  if (bs && typeof bs.Toast === 'function') {
    const instance = new bs.Toast(toast);
    instance.show();
  } else {
    toast.classList.add('show');
    setTimeout(() => { toast.remove(); }, 3500);
  }

  toast.addEventListener('hidden.bs.toast', () => toast.remove());
}
