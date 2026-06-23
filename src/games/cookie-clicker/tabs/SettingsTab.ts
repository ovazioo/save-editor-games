import { html, field } from '../../../helpers';
import { getCurrentData } from '../../../session';

const BOOL_KEYS = ['fancy', 'particles', 'cookiepops', 'cookiewobble', 'lowMotion', 'cursors', 'diagnostic', 'debug', 'sound', 'pan', 'dislodge', 'shadows', 'milk', 'notScary'];

const NUM_KEYS = ['bgType', 'milkType', 'chimeType'];

export function renderSettings(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const st = (d.settings as Record<string, number>) || {};
  if (!d.settings) d.settings = {};

  for (const k of BOOL_KEYS) {
    const group = document.createElement('div');
    group.className = 'mb-3';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.textContent = k;
    lbl.htmlFor = `sett-${k}`;

    const sel = document.createElement('select');
    sel.className = 'form-select';
    sel.id = `sett-${k}`;

    for (const v of [0, 1]) {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = String(v);
      if (v === (st[k] ?? 0)) opt.selected = true;
      sel.appendChild(opt);
    }

    sel.addEventListener('change', () => {
      (d.settings as Record<string, number>)[k] = parseInt(sel.value);
    });

    group.append(lbl, sel);
    container.appendChild(group);
  }

  for (const e of NUM_KEYS) {
    container.appendChild(field(e.label || e, (d[e.key] ?? 0) as number, (v) => {
      d[e.key] = parseInt(v) || 0;
    }, { id: `sett-${e.key}` }));
  }
}
