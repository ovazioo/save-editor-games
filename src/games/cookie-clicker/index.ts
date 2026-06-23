import type { GamePlugin } from '../../types';
import { decodeSave, encodeSave, validateSave } from '../../save';
import { presets } from '../../presets';
import { renderDecrypt } from './views/Decrypt';
import { renderEditor } from './views/Editor';

const cookieClickerPlugin: GamePlugin = {
  id: 'cookie-clicker',
  name: 'Cookie Clicker',
  icon: '🍪',
  description: 'Editor de saves do Cookie Clicker',
  decode: decodeSave,
  encode: encodeSave,
  validate: validateSave,
  presets: [
    { name: presets.inicial.name, apply: presets.inicial.fn },
    { name: presets.veterano.name, apply: presets.veterano.fn },
    { name: presets.legitimo.name, apply: presets.legitimo.fn }
  ],
  views: {
    decrypt: renderDecrypt,
    editor: renderEditor
  }
};

export default cookieClickerPlugin;
