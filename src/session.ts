import type { SaveData, GamePlugin } from './types';

let currentPlugin: GamePlugin | null = null;
let currentData: SaveData | null = null;
let navigateToEditor: (() => void) | null = null;

export function setCurrentPlugin(p: GamePlugin | null): void {
  currentPlugin = p;
}

export function getCurrentPlugin(): GamePlugin | null {
  return currentPlugin;
}

export function setCurrentData(d: SaveData | null): void {
  currentData = d;
}

export function getCurrentData(): SaveData | null {
  return currentData;
}

export function setNavigateToEditor(fn: () => void): void {
  navigateToEditor = fn;
}

export function navigateEditor(): void {
  navigateToEditor?.();
}
