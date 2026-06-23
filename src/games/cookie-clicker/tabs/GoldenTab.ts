import { field } from '../../../helpers';
import { getCurrentData } from '../../../session';

export function renderGolden(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const fields = [
    { key: 'gcClicks', label: 'gcClicks (clicados)', hint: 'Golden cookies clicados' },
    { key: 'gcClicksTotal', label: 'gcClicksTotal (total vistos)', hint: 'Total de GCs que apareceram' },
    { key: 'gcMissed', label: 'gcMissed (perdidos)', hint: 'GCs que deixou passar' },
    { key: 'fortuneGC', label: 'fortuneGC (0/1)', hint: 'Sorte de golden cookies' },
    { key: 'fortuneCPS', label: 'fortuneCPS (0/1)', hint: 'Sorte de CPS' },
    { key: 'powerClicks', label: 'powerClicks', hint: 'Cliques de poder usados' },
    { key: 'powerClicksTotal', label: 'powerClicksTotal', hint: 'Total de cliques de poder' }
  ];

  for (const f of fields) {
    container.appendChild(field(f.label, (d[f.key] ?? 0) as number, (v) => {
      d[f.key] = parseInt(v) || 0;
    }, { id: `golden-${f.key}`, hint: f.hint }));
  }
}
