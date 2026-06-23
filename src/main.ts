import 'bootstrap';
import './style.scss';

import { renderNavbar } from './components/Navbar';
import { renderDecrypt } from './games/cookie-clicker/views/Decrypt';
import { renderEditor } from './games/cookie-clicker/views/Editor';
import { showToast } from './components/Toast';
import { registerGame, getGame, getAllGames } from './registry';
import { setCurrentPlugin, setCurrentData, getCurrentData, setNavigateToEditor } from './session';
import {
  getState, setView, setTheme, setCurrentGame, subscribe,
  undo, redo, canUndo, canRedo
} from './store';
import type { AppState, ThemeMode } from './types';
import cookieClickerPlugin from './games/cookie-clicker';
import minecraftPlugin from './games/minecraft';
import subwaySurfPlugin from './games/subway-surf';

// ─── REGISTER GAMES ────────────────────────────────────────
registerGame(cookieClickerPlugin);
registerGame(minecraftPlugin);
registerGame(subwaySurfPlugin);

// ─── APP ───────────────────────────────────────────────────
const app = document.getElementById('app');
if (!app) throw new Error('#app not found');

function init(): void {
  // Build app layout
  app.innerHTML = `
    <div id="navbar-container"></div>
    <div class="container py-3" id="view-container">
      <div class="row">
        <div class="col-12" id="game-content"></div>
      </div>
    </div>
  `;

  const navContainer = document.getElementById('navbar-container')!;
  const contentContainer = document.getElementById('game-content')!;

  // Set up navigation to editor
  setNavigateToEditor(() => setView('editor'));

  // Render navbar
  function renderNav(): void {
    const state = getState();
    const games = getAllGames().map(g => ({ id: g.id, name: g.name, icon: g.icon }));

    renderNavbar(navContainer, state, games, {
      onViewChange: (view) => setView(view),
      onUndo: () => { undo(); renderView(getState()); },
      onRedo: () => { redo(); renderView(getState()); },
      onThemeToggle: () => {
        const next: ThemeMode = getState().theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
      },
      onGameChange: (id) => {
        setCurrentGame(id);
        // Reset current data when switching games
        setCurrentData(null);
        renderView(getState());
      }
    }, {
      canUndo: canUndo(),
      canRedo: canRedo()
    });
  }

  // Render active view
  function renderView(state: AppState): void {
    const game = getGame(state.currentGame);
    if (!game) {
      contentContainer.innerHTML = '<div class="alert alert-danger">Jogo não encontrado.</div>';
      return;
    }

    setCurrentPlugin(game);

    if (state.currentView === 'decrypt') {
      game.views.decrypt(contentContainer);
    } else {
      const data = getCurrentData();
      if (!data) {
        contentContainer.innerHTML = '<div class="alert alert-info">Nenhum save carregado. Vá em "Decriptar" primeiro.</div>';
        return;
      }
      game.views.editor(contentContainer);
    }

    // Restore data from store if it exists there
    if (state.data && !getCurrentData()) {
      setCurrentData(state.data);
    }
  }

  // Initial render
  renderNav();

  // Apply theme from store
  document.documentElement.setAttribute('data-bs-theme', getState().theme);

  // Subscribe to state changes
  subscribe((state) => {
    renderNav();
    renderView(state);
  });

  // Welcome toast
  setTimeout(() => {
    showToast('Bem-vindo ao Game Save Toolkit! 🎮', 'success');
  }, 500);
}

// ─── BOOT ──────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
