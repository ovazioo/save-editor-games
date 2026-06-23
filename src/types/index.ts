export interface SaveData {
  [key: string]: unknown;
}

export interface Preset {
  name: string;
  apply: (data: SaveData) => void;
}

export interface GameViews {
  decrypt: (container: HTMLElement) => void;
  editor: (container: HTMLElement) => void;
}

export interface GamePlugin {
  id: string;
  name: string;
  icon: string;
  description: string;
  decode: (text: string) => SaveData;
  encode: (data: SaveData) => string;
  validate: (data: SaveData) => string | null;
  presets?: Preset[];
  views: GameViews;
}

export type ThemeMode = 'light' | 'dark';
export type AppView = 'decrypt' | 'editor';

export interface AppState {
  data: SaveData | null;
  originalPath: string | null;
  modified: boolean;
  currentGame: string;
  currentView: AppView;
  currentTab: string;
  saveName: string;
  theme: ThemeMode;
}

export interface HistoryEntry {
  data: SaveData;
  tab: string;
}

export interface Listener {
  (state: AppState): void;
}
