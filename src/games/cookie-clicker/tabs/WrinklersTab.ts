import { html, field, fmt } from '../../../helpers';
import { getCurrentData } from '../../../session';

export function renderWrinklers(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const fields = [
    { key: 'elderWrath', label: 'elderWrath (0-3)', hint: '0=calmo, 1=awoken, 2=displeased, 3=angry' },
    { key: 'pledges', label: 'pledges', hint: 'Pactos de comunhão ativos' },
    { key: 'pledgeT', label: 'pledgeT (timer)', hint: 'Timer do pacto ativo' },
    { key: 'wrinklersPopped', label: 'wrinklersPopped (estourados)', hint: 'Total de wrinklers estourados' },
    { key: 'cookiesSucked', label: 'cookiesSucked (sugados)', hint: 'Total de cookies sugados por wrinklers' }
  ];

  for (const f of fields) {
    container.appendChild(field(f.label, (d[f.key] ?? 0) as number, (v) => {
      const num = parseFloat(v) || 0;
      d[f.key] = Number.isInteger(d[f.key]) ? Math.round(num) : num;
    }, { id: `wrink-${f.key}`, hint: f.hint }));
  }

  const wr = (d.wrinklers as Array<{ s: number | null; t: number }>) ||
    Array.from({ length: 14 }, () => ({ s: null, t: 0 }));

  const label = document.createElement('p');
  label.className = 'fw-semibold mt-3 mb-1';
  label.style.color = 'var(--bs-warning)';
  label.textContent = 'Wrinklers ativos';
  container.appendChild(label);

  const count = document.createElement('p');
  count.className = 'text-body-secondary small mb-2';
  count.textContent = `${wr.filter(w => w.s !== null && w.s > 0).length}/${wr.length} ativos`;
  container.appendChild(count);

  for (let i = 0; i < wr.length; i++) {
    const w = wr[i];
    const s = w.s !== null && w.s !== undefined ? w.s : 0;

    const group = document.createElement('div');
    group.className = 'mb-3';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.textContent = `wrinkler[${i}]`;

    const row = document.createElement('div');
    row.className = 'input-group input-group-sm';

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'form-control';
    inp.value = String(s);
    inp.setAttribute('aria-label', `Wrinkler ${i} cookies sugados`);

    const hint = document.createElement('span');
    hint.className = 'input-group-text';
    hint.textContent = `sugados: ${fmt(s)}`;

    inp.addEventListener('input', () => {
      const v = parseFloat(inp.value);
      wr[i].s = (v && v > 0) ? v : null;
      d.wrinklers = wr;
    });

    row.append(inp, hint);
    group.append(lbl, row);
    container.appendChild(group);
  }
}
