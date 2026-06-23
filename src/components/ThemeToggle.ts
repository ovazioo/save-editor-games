import { html } from '../helpers';
import { getState } from '../store';
import { toggleTheme } from '../theme';

export function renderThemeToggle(container: HTMLElement): void {
  const updateBtn = () => {
    clearEl(container);
    const isDark = getState().theme === 'dark';
    const btn = html('button', {
      className: 'btn btn-sm btn-outline-secondary border-0',
      title: isDark ? 'Modo claro' : 'Modo escuro',
      'aria-label': isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro',
      onClick: toggleTheme
    }, [isDark ? '☀️' : '🌙']);
    container.appendChild(btn);
  };

  updateBtn();
  // Re-render on theme change
  const unsub = () => {}; // Will be replaced
  // Simple approach: re-render on click (already handled by toggleTheme -> notify -> App re-render)
}

function clearEl(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}
