import { html, field } from '../../../helpers';
import { getCurrentData } from '../../../session';

export function renderPrestige(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const fields = [
    { key: 'heavenlyChips', label: 'heavenlyChips (disponíveis)', hint: 'HCs disponíveis para gastar' },
    { key: 'heavenlyChipsSpent', label: 'heavenlyChipsSpent (gastos)', hint: 'Total de HCs já gastos' },
    { key: 'cookiesReset', label: 'cookiesReset', hint: 'Total de cookies resetados (viram HC)' },
    { key: 'resets', label: 'resets (ascensões)', hint: 'Quantas vezes ascendeu' }
  ];

  for (const f of fields) {
    container.appendChild(field(f.label, d[f.key] as number | undefined, (v) => {
      d[f.key] = parseInt(v) || 0;
    }, { id: `prestige-${f.key}`, hint: f.hint }));
  }

  const pu = (d.permanentUpgrades as number[]) || [-1, -1, -1, -1, -1];

  const group = document.createElement('div');
  group.className = 'mb-3';

  const lbl = document.createElement('label');
  lbl.className = 'form-label';
  lbl.textContent = 'permanentUpgrades (slots 0-4)';

  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'form-control';
  inp.value = pu.join(', ');
  inp.setAttribute('aria-label', 'Permanent upgrades (5 IDs separados por vírgula)');

  inp.addEventListener('input', () => {
    const vals = inp.value.split(',').map(s => parseInt(s.trim()) || -1);
    while (vals.length < 5) vals.push(-1);
    d.permanentUpgrades = vals.slice(0, 5);
  });

  const hint = document.createElement('div');
  hint.className = 'form-text';
  hint.textContent = 'IDs dos upgrades, -1 = vazio, separados por vírgula';

  group.append(lbl, inp, hint);
  container.appendChild(group);
}
