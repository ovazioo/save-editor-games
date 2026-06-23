import { html, clearEl } from '../helpers';

interface DropZoneOptions {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
  description?: string;
}

export function renderDropZone(container: HTMLElement, opts: DropZoneOptions): void {
  clearEl(container);

  const zone = html('div', {
    className: 'drop-zone border-2 border-dashed rounded-3 p-5 text-center cursor-pointer',
    tabindex: '0',
    role: 'button',
    'aria-label': 'Clique ou arraste um arquivo'
  });

  zone.style.cssText = 'border-style: dashed !important; cursor: pointer; transition: all .2s;';

  zone.innerHTML = `
    <div class="mb-3" style="font-size: 3rem;">📂</div>
    <p class="mb-2"><strong>${opts.label || 'Solte o arquivo aqui'}</strong></p>
    <p class="text-body-secondary mb-3">${opts.description || 'ou clique para selecionar'}</p>
    <label class="btn btn-primary" for="file-input-${Date.now()}">Selecionar Arquivo</label>
  `;

  const fileInput = html('input', {
    id: zone.querySelector('label')?.getAttribute('for') || 'file-input',
    type: 'file',
    accept: opts.accept || '.txt,.json',
    style: 'display:none',
    'aria-hidden': 'true'
  }) as HTMLInputElement;

  zone.appendChild(fileInput);

  function handleFile(file: File): void {
    opts.onFile(file);
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) handleFile(fileInput.files[0]);
  });

  zone.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).tagName !== 'LABEL' && (e.target as HTMLElement).tagName !== 'INPUT') {
      fileInput.click();
    }
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--bs-primary)';
    zone.style.background = 'rgba(var(--bs-primary-rgb), 0.05)';
  });

  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '';
    zone.style.background = '';
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = '';
    zone.style.background = '';
    if (e.dataTransfer?.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  container.appendChild(zone);
}
