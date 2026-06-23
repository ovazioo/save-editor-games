import { html, clearEl } from '../helpers';
import type { AppState, ThemeMode } from '../types';

interface NavbarCallbacks {
  onViewChange: (view: 'decrypt' | 'editor') => void;
  onUndo: () => void;
  onRedo: () => void;
  onThemeToggle: () => void;
  onGameChange: (gameId: string) => void;
}

export function renderNavbar(
  container: HTMLElement,
  state: AppState,
  games: Array<{ id: string; name: string; icon: string }>,
  callbacks: NavbarCallbacks,
  undoRedoState: { canUndo: boolean; canRedo: boolean }
): void {
  clearEl(container);

  const nav = html('nav', {
    className: 'navbar navbar-expand-sm navbar-dark bg-dark border-bottom border-secondary-subtle sticky-top',
    'aria-label': 'Navegação principal'
  });

  const inner = document.createElement('div');
  inner.className = 'container-fluid';

  const brand = html('a', { className: 'navbar-brand d-flex align-items-center gap-2', href: '#' }, [
    html('span', { style: 'font-size: 1.4rem;' }, ['🍪']),
    html('span', { className: 'd-none d-sm-inline fw-semibold' }, ['Save Toolkit'])
  ]);

  const toggler = html('button', {
    className: 'navbar-toggler', type: 'button',
    'data-bs-toggle': 'collapse', 'data-bs-target': '#navbarMain',
    'aria-controls': 'navbarMain', 'aria-expanded': 'false',
    'aria-label': 'Alternar navegação'
  }, [html('span', { className: 'navbar-toggler-icon' })]);

  const collapse = document.createElement('div');
  collapse.className = 'collapse navbar-collapse';
  collapse.id = 'navbarMain';

  const rightGroup = document.createElement('div');
  rightGroup.className = 'd-flex align-items-center gap-2 ms-auto flex-wrap';

  // Game selector
  const sel = document.createElement('select');
  sel.className = 'form-select form-select-sm';
  sel.style.width = 'auto';
  sel.setAttribute('aria-label', 'Selecionar jogo');
  for (const g of games) {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = `${g.icon} ${g.name}`;
    if (g.id === state.currentGame) opt.selected = true;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => callbacks.onGameChange(sel.value));

  const gameGroup = html('div', { className: 'd-flex align-items-center gap-1' }, [
    html('span', { className: 'text-secondary small' }, ['Jogo:']), sel
  ]);
  rightGroup.appendChild(gameGroup);

  // View buttons
  const views = [
    { id: 'decrypt' as const, label: '🔓 Decriptar' },
    { id: 'editor' as const, label: '✏️ Editor' }
  ];
  const viewGroup = document.createElement('div');
  viewGroup.className = 'btn-group btn-group-sm';
  for (const v of views) {
    const isActive = state.currentView === v.id;
    const btn = html('button', {
      className: `btn btn-sm ${isActive ? 'btn-light' : 'btn-outline-light'}`,
      onClick: () => callbacks.onViewChange(v.id)
    }, [v.label]);
    viewGroup.appendChild(btn);
  }
  rightGroup.appendChild(viewGroup);

  // Undo/Redo
  const urGroup = document.createElement('div');
  urGroup.className = 'btn-group btn-group-sm';

  const undoBtn = html('button', {
    className: 'btn btn-outline-secondary',
    disabled: !undoRedoState.canUndo,
    title: 'Desfazer (Ctrl+Z)',
    'aria-label': 'Desfazer'
  }, ['↩']);
  undoBtn.addEventListener('click', () => callbacks.onUndo());

  const redoBtn = html('button', {
    className: 'btn btn-outline-secondary',
    disabled: !undoRedoState.canRedo,
    title: 'Refazer (Ctrl+Shift+Z)',
    'aria-label': 'Refazer'
  }, ['↪']);
  redoBtn.addEventListener('click', () => callbacks.onRedo());

  urGroup.append(undoBtn, redoBtn);
  rightGroup.appendChild(urGroup);

  // Theme toggle
  const themeBtn = html('button', {
    className: 'btn btn-sm btn-outline-secondary border-0',
    onClick: () => callbacks.onThemeToggle(),
    'aria-label': 'Alternar tema'
  }, [state.theme === 'dark' ? '☀️' : '🌙']);
  rightGroup.appendChild(themeBtn);

  collapse.appendChild(rightGroup);
  inner.append(brand, toggler, collapse);
  nav.appendChild(inner);
  container.appendChild(nav);
}
