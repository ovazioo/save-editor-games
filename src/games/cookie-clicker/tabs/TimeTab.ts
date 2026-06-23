import { html, field } from '../../../helpers';
import { showToast } from '../../../components/Toast';
import { getCurrentData } from '../../../session';

function msToDate(ms: number | undefined): string {
  return (!ms || ms < 1e12) ? '—' : new Date(ms).toLocaleString('pt-BR');
}

export function renderTime(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const now = Date.now();

  const info = document.createElement('p');
  info.className = 'text-body-secondary small mb-2';
  info.textContent = `Agora: ${new Date(now).toLocaleString('pt-BR')} (${now}ms)`;
  container.appendChild(info);

  const fields = [
    { key: 'time', label: 'time (save atual)', hint: msToDate(d.time as number | undefined) },
    { key: 'runStart', label: 'runStart (início da run)', hint: msToDate(d.runStart as number | undefined) },
    { key: 'gameStart', label: 'gameStart (criação do jogo)', hint: msToDate(d.gameStart as number | undefined) },
    { key: 'seasonT', label: 'seasonT (timer estação)', hint: '' },
    { key: 'pledgeT', label: 'pledgeT (timer pacto)', hint: '' }
  ];

  for (const f of fields) {
    container.appendChild(field(f.label, (d[f.key] ?? 0) as number, (v) => {
      d[f.key] = parseInt(v) || 0;
    }, { id: `time-${f.key}`, hint: f.hint }));
  }

  const btnGroup = document.createElement('div');
  btnGroup.className = 'mt-2';

  const btn = document.createElement('button');
  btn.className = 'btn btn-outline-primary btn-sm';
  btn.textContent = 'Definir "time" para agora';
  btn.addEventListener('click', () => {
    d.time = Date.now();
    showToast('time atualizado!', 'success');
  });

  btnGroup.appendChild(btn);
  container.appendChild(btnGroup);
}
