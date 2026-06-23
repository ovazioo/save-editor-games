import type { AppState, AppView, ThemeMode, Listener } from './types';

// ─── STORAGE KEYS ──────────────────────────────────────────
const STORAGE_PREFIX = 'cc-save-toolkit:';
const KEY_DATA = `${STORAGE_PREFIX}data`;
const KEY_GAME = `${STORAGE_PREFIX}currentGame`;
const KEY_THEME = `${STORAGE_PREFIX}theme`;
const KEY_HISTORY = `${STORAGE_PREFIX}history`;
const KEY_HISTORY_IDX = `${STORAGE_PREFIX}historyIndex`;

const MAX_HISTORY = 50;

// ─── STATE ─────────────────────────────────────────────────
let state: AppState = {
  data: null,
  originalPath: null,
  modified: false,
  currentGame: 'cookie-clicker',
  currentView: 'decrypt',
  currentTab: 'cookies',
  saveName: '',
  theme: detectTheme()
};

let history: string[] = [];
let historyIndex = -1;

const listeners: Set<Listener> = new Set();

// ─── INIT ──────────────────────────────────────────────────
function detectTheme(): ThemeMode {
  const stored = localStorage.getItem(KEY_THEME) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function loadPersisted(): void {
  try {
    const saved = localStorage.getItem(KEY_DATA);
    if (saved) {
      state.data = JSON.parse(saved);
      state.modified = true;
    }
  } catch { /* ignore */ }

  const game = localStorage.getItem(KEY_GAME);
  if (game) state.currentGame = game;

  try {
    const h = localStorage.getItem(KEY_HISTORY);
    if (h) history = JSON.parse(h);
    const hi = localStorage.getItem(KEY_HISTORY_IDX);
    if (hi !== null) historyIndex = parseInt(hi, 10);
  } catch { /* ignore */ }
}

// ─── PERSISTENCE ──────────────────────────────────────────
function persistData(): void {
  if (state.data) {
    localStorage.setItem(KEY_DATA, JSON.stringify(state.data));
  }
}

function persistHistory(): void {
  localStorage.setItem(KEY_HISTORY, JSON.stringify(history));
  localStorage.setItem(KEY_HISTORY_IDX, String(historyIndex));
}

// ─── PUBLIC API ───────────────────────────────────────────
export function getState(): AppState {
  return state;
}

export function getHistoryIndex(): number {
  return historyIndex;
}

export function getHistoryLength(): number {
  return history.length;
}

export function setData(d: SaveData): void {
  pushHistory();
  state.data = d;
  state.modified = true;
  persistData();
  notify();
}

export function setPath(p: string | null): void {
  state.originalPath = p;
}

export function setModified(v: boolean): void {
  state.modified = v;
  notify();
}

export function setView(v: AppView): void {
  state.currentView = v;
  notify();
}

export function setTab(t: string): void {
  state.currentTab = t;
  notify();
}

export function setSaveName(n: string): void {
  state.saveName = n;
}

export function setTheme(t: ThemeMode): void {
  state.theme = t;
  document.documentElement.setAttribute('data-bs-theme', t);
  localStorage.setItem(KEY_THEME, t);
  notify();
}

export function setCurrentGame(id: string): void {
  state.currentGame = id;
  state.currentView = 'decrypt';
  state.currentTab = 'cookies';
  localStorage.setItem(KEY_GAME, id);
  notify();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function notify(): void {
  for (const fn of listeners) fn(state);
}

// ─── UNDO / REDO ──────────────────────────────────────────
function pushHistory(): void {
  if (!state.data) return;
  const entry = JSON.stringify({ data: state.data, tab: state.currentTab });
  if (historyIndex >= 0 && history[historyIndex] === entry) return;
  history = history.slice(0, historyIndex + 1);
  history.push(entry);
  if (history.length > MAX_HISTORY) history.shift();
  historyIndex = history.length - 1;
  persistHistory();
}

export function undo(): boolean {
  if (historyIndex <= 0) return false;
  historyIndex--;
  restoreFromHistory();
  persistHistory();
  return true;
}

export function redo(): boolean {
  if (historyIndex >= history.length - 1) return false;
  historyIndex++;
  restoreFromHistory();
  persistHistory();
  return true;
}

function restoreFromHistory(): void {
  const entry = JSON.parse(history[historyIndex]);
  state.data = entry.data as SaveData;
  state.currentTab = entry.tab as string;
  state.modified = true;
  persistData();
  notify();
}

export function canUndo(): boolean {
  return historyIndex > 0;
}

export function canRedo(): boolean {
  return historyIndex < history.length - 1;
}

export function clearHistory(): void {
  history = [];
  historyIndex = -1;
  persistHistory();
}

// ─── BOOT ──────────────────────────────────────────────────
loadPersisted();
