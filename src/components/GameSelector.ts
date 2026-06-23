import { html, clearEl } from '../helpers';

export function renderGameSelector(
  container: HTMLElement,
  games: Array<{ id: string; name: string; icon: string }>,
  current: string,
  onChange: (id: string) => void
): void {
  clearEl(container);

  const select = document.createElement('select');
  select.className = 'form-select form-select-sm';
  select.style.width = 'auto';
  select.setAttribute('aria-label', 'Selecionar jogo');

  for (const g of games) {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = `${g.icon} ${g.name}`;
    if (g.id === current) opt.selected = true;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => onChange(select.value));

  container.appendChild(html('div', { className: 'd-flex align-items-center gap-2' }, [
    html('span', { className: 'text-body-secondary small' }, ['Jogo:']),
    select
  ]));
}
