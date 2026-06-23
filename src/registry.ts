import type { GamePlugin, SaveData } from './types';

const games = new Map<string, GamePlugin>();

export function registerGame(plugin: GamePlugin): void {
  games.set(plugin.id, plugin);
}

export function getGame(id: string): GamePlugin | undefined {
  return games.get(id);
}

export function getAllGames(): GamePlugin[] {
  return [...games.values()];
}

export function getGameForData(data: SaveData): GamePlugin | null {
  for (const game of games.values()) {
    const err = game.validate(data);
    if (err === null) return game;
  }
  return null;
}
