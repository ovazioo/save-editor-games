import { html } from '../../../helpers';
import { showToast } from '../../../components/Toast';
import { showConfirm } from '../../../components/ConfirmModal';
import { getCurrentData } from '../../../session';

export function renderUpgrades(container: HTMLElement): void {
  const d = getCurrentData();
  if (!d) return;

  const ups = (d.upgrades as Record<string, number>) || {};
  const acs = (d.achievs as Record<string, number>) || {};

  const nUp = Object.values(ups).filter(v => v && v > 0).length;
  const nAc = Object.values(acs).filter(v => v && v > 0).length;

  const info = document.createElement('p');
  info.className = 'text-body-secondary mb-3';
  info.textContent = `Upgrades: ${nUp}/${Object.keys(ups).length} | Achievements: ${nAc}/${Object.keys(acs).length}`;
  container.appendChild(info);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'd-flex gap-2 flex-wrap';

  const unlockUp = document.createElement('button');
  unlockUp.className = 'btn btn-warning btn-sm';
  unlockUp.textContent = 'Unlock ALL Upgrades';
  unlockUp.addEventListener('click', async () => {
    if (!await showConfirm('Desbloquear Upgrades', 'Tem certeza? Isso vai desbloquear TODOS os upgrades (823).', { confirmVariant: 'danger' })) return;
    for (const k in d.upgrades as Record<string, number>) (d.upgrades as Record<string, number>)[k] = 3;
    showToast('823 upgrades desbloqueados!', 'success');
  });

  const unlockAch = document.createElement('button');
  unlockAch.className = 'btn btn-warning btn-sm';
  unlockAch.textContent = 'Unlock ALL Achievements';
  unlockAch.addEventListener('click', async () => {
    if (!await showConfirm('Desbloquear Achievements', 'Tem certeza? Isso vai desbloquear TODAS as achievements (572).', { confirmVariant: 'danger' })) return;
    for (const k in d.achievs as Record<string, number>) (d.achievs as Record<string, number>)[k] = 1;
    showToast('572 achievements desbloqueadas!', 'success');
  });

  btnGroup.append(unlockUp, unlockAch);
  container.appendChild(btnGroup);
}
