import type { SaveData } from './types';

export function decodeSave(text: string): SaveData {
  const raw = text.trim();
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {
    try {
      return JSON.parse(atob(raw));
    } catch {
      throw new Error('Arquivo inválido: não foi possível decodificar o base64.');
    }
  }
}

export function encodeSave(data: SaveData): string {
  return btoa(unescape(encodeURIComponent(
    JSON.stringify(data, (_, v) => v === undefined ? null : v)
  )));
}

export function validateSave(data: SaveData): string | null {
  if (!data || typeof data !== 'object') return 'Save inválido: não é um objeto JSON.';
  if (typeof data.cookies === 'undefined' && !data.buildings) {
    return 'Save inválido: campos esperados não encontrados.';
  }
  return null;
}
