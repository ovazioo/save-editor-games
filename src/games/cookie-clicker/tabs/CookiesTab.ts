import { field } from '../../../helpers';
import { showToast } from '../../../components/Toast';
import { getCurrentData } from '../../../session';

export function renderCookies(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const fields = [
    { key: 'cookies', label: 'cookies (saldo atual)', hint: 'Seu saldo atual de cookies' },
    { key: 'cookiesEarned', label: 'cookiesEarned (ganhos na run)', hint: 'Total de cookies ganhos nesta run' },
    { key: 'cookiesTotal', label: 'cookiesTotal (total histórico)', hint: 'Total em TODAS as runs (nunca zera)' },
    { key: 'cookiesHandmade', label: 'cookiesHandmade (manuais)', hint: 'Cookies clicados manualmente' },
    { key: 'cookieClicks', label: 'cookieClicks (cliques)', hint: 'Quantas vezes clicou no cookie grande' }
  ];

  for (const f of fields) {
    container.appendChild(field(f.label, d[f.key] as number | undefined, (v) => {
      const num = typeof d[f.key] === 'number' ? parseFloat(v) || 0 : parseInt(v) || 0;
      d[f.key] = num;
    }, { id: `cookies-${f.key}`, hint: f.hint }));
  }
}
