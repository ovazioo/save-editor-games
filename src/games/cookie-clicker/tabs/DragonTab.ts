import { html, field } from '../../../helpers';
import { getCurrentData } from '../../../session';

const AURAS = [
  { id: 0, name: 'Nenhuma' },
  { id: 1, name: "Breath of Milk" },
  { id: 2, name: "Dragon's Fortune" },
  { id: 3, name: 'Dragonflight' },
  { id: 4, name: 'Radiant Appetite' },
  { id: 5, name: 'Elder Spice' },
  { id: 6, name: 'Reality Bending' },
  { id: 7, name: "Dragon's Curve" },
  { id: 8, name: "Haggler's Charm" },
  { id: 9, name: 'Summon Crafty Pixies' }
];

function mkAuraSelect(container: HTMLElement, id: string, label: string, valKey: string, d: Record<string, unknown>): void {
  const group = document.createElement('div');
  group.className = 'mb-3';

  const lbl = document.createElement('label');
  lbl.className = 'form-label';
  lbl.textContent = label;
  lbl.htmlFor = id;

  const sel = document.createElement('select');
  sel.className = 'form-select';
  sel.id = id;

  for (const a of AURAS) {
    const opt = document.createElement('option');
    opt.value = String(a.id);
    opt.textContent = a.name;
    if (a.id === (d[valKey] as number)) opt.selected = true;
    sel.appendChild(opt);
  }

  sel.addEventListener('change', () => {
    d[valKey] = parseInt(sel.value);
  });

  group.append(lbl, sel);
  container.appendChild(group);
}

export function renderDragon(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  container.appendChild(field('dragonLevel (0-4)', d.dragonLevel as number | undefined, (v) => {
    d.dragonLevel = Math.min(4, Math.max(0, parseInt(v) || 0));
  }, { id: 'dragon-level', hint: 'Nível do dragão (0 a 4)' }));

  mkAuraSelect(container, 'dragon-aura1', 'dragonAura (slot 1)', 'dragonAura', d);
  mkAuraSelect(container, 'dragon-aura2', 'dragonAura2 (slot 2)', 'dragonAura2', d);

  container.appendChild(field('santaLevel (0-4)', d.santaLevel as number | undefined, (v) => {
    d.santaLevel = Math.min(4, Math.max(0, parseInt(v) || 0));
  }, { id: 'santa-level', hint: 'Nível do Papai Noel (0 a 4)' }));
}
