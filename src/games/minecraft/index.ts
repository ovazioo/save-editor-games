import type { GamePlugin, SaveData } from '../../types';

const minecraftPlugin: GamePlugin = {
  id: 'minecraft',
  name: 'Minecraft',
  icon: '⛏️',
  description: 'Leitor de arquivos .dat do Minecraft (NBT format) — em breve',
  decode: (_text: string): SaveData => {
    throw new Error('Minecraft .dat parser ainda não implementado.');
  },
  encode: (_data: SaveData): string => {
    throw new Error('Minecraft .dat export ainda não implementado.');
  },
  validate: (_data: SaveData): string | null => {
    return 'Minecraft ainda não implementado.';
  },
  views: {
    decrypt: (container: HTMLElement) => {
      container.innerHTML = '<div class="alert alert-info">📋 Leitor de .dat do Minecraft — em desenvolvimento.</div>';
    },
    editor: (container: HTMLElement) => {
      container.innerHTML = '<div class="alert alert-secondary">Editor Minecraft — em breve.</div>';
    }
  }
};

export default minecraftPlugin;
