import { html, clearEl, $ } from '../helpers';

export function renderJsonViewer(container: HTMLElement, json: string): void {
  clearEl(container);

  const wrapper = document.createElement('div');
  wrapper.className = 'd-flex flex-column gap-2';

  // Search bar
  const searchGroup = document.createElement('div');
  searchGroup.className = 'input-group input-group-sm';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control';
  searchInput.placeholder = 'Buscar no JSON...';
  searchInput.setAttribute('aria-label', 'Buscar no JSON');

  const matchCount = document.createElement('span');
  matchCount.className = 'input-group-text';
  matchCount.textContent = '';

  searchGroup.append(searchInput, matchCount);
  wrapper.appendChild(searchGroup);

  // JSON content
  const pre = html('pre', {
    className: 'bg-body-tertiary border rounded-3 p-3 overflow-auto',
    tabindex: '0',
    style: 'font-family: "Cascadia Code", "Fira Code", monospace; font-size: .75rem; line-height: 1.6; max-height: 20rem; white-space: pre-wrap; word-break: break-all;'
  }, [json]);

  wrapper.appendChild(pre);
  container.appendChild(wrapper);

  // Search functionality
  let lastSearch = '';
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
      pre.innerHTML = escapeHtml(json);
      matchCount.textContent = '';
      lastSearch = '';
      return;
    }
    if (term === lastSearch) return;
    lastSearch = term;

    let count = 0;
    const escaped = escapeHtml(json);
    const parts = escaped.split(new RegExp(`(${escapeRegex(term)})`, 'gi'));
    const highlighted = parts.map(p => {
      if (p.toLowerCase() === term) { count++; return `<mark class="bg-warning">${p}</mark>`; }
      return p;
    }).join('');

    pre.innerHTML = highlighted;
    matchCount.textContent = `${count} ocorrência(s)`;
  });
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
