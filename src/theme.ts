import type { ThemeMode } from './types';
import { setTheme, getState } from './store';

export function initTheme(): void {
  const theme = getState().theme;
  document.documentElement.setAttribute('data-bs-theme', theme);
}

export function toggleTheme(): void {
  const current = getState().theme;
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}
