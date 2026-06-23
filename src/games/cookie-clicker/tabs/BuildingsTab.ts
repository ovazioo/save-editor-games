import { html, fmt } from '../../../helpers';
import { getCurrentData } from '../../../session';

const BUILDINGS_ORDER = [
  "Cursor", "Grandma", "Farm", "Mine", "Factory", "Bank", "Temple",
  "Wizard tower", "Shipment", "Alchemy lab", "Portal", "Time machine",
  "Antimatter condenser", "Prism", "Chancemaker", "Fractal engine",
  "Javascript console", "Idleverse", "Cortex baker", "You"
];

export function renderBuildings(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  for (const name of BUILDINGS_ORDER) {
    const b = (d.buildings as Record<string, Record<string, number>>)?.[name] || {};
    if (!d.buildings) d.buildings = {};
    const bg = d.buildings as Record<string, Record<string, number>>;
    if (!bg[name]) bg[name] = { amount: 0, amountMax: 0, bought: 0, cookiesMade: 0 };

    const group = document.createElement('div');
    group.className = 'mb-3';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.textContent = name;

    const row = document.createElement('div');
    row.className = 'input-group input-group-sm';

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'form-control';
    inp.value = String(b.amount || 0);
    inp.setAttribute('aria-label', `${name} quantidade`);

    const maxSpan = document.createElement('span');
    maxSpan.className = 'input-group-text';
    maxSpan.textContent = `max ${fmt(b.amountMax || 0)}`;

    inp.addEventListener('input', () => {
      const v = parseInt(inp.value) || 0;
      bg[name].amount = v;
      if (bg[name].amountMax < v) bg[name].amountMax = v;
      maxSpan.textContent = `max ${fmt(bg[name].amountMax)}`;
    });

    row.append(inp, maxSpan);
    group.append(lbl, row);
    container.appendChild(group);
  }
}
