import type { GamePlugin, SaveData } from '../../types';

const subwaySurfPlugin: GamePlugin = {
  id: 'subway-surf',
  name: 'Subway Surf',
  icon: '🏃',
  description: 'Leitor de arquivos de save do Subway Surf — em breve',
  decode: (_text: string): SaveData => {
    throw new Error('Subway Surf parser ainda não implementado.');
  },
  encode: (_data: SaveData): string => {
    throw new Error('Subway Surf export ainda não implementado.');
  },
  validate: (_data: SaveData): string | null => {
    return 'Subway Surf ainda não implementado.';
  },
  views: {
    decrypt: (container: HTMLElement) => {
      container.innerHTML = '<div class="alert alert-info">🏃 Leitor de saves do Subway Surf — em desenvolvimento.</div>';
    },
    editor: (container: HTMLElement) => {
      container.innerHTML = '<div class="alert alert-secondary">Editor Subway Surf — em breve.</div>';
    }
  }
};

export default subwaySurfPlugin;
