import { html, clearEl } from '../../../helpers';
import { renderDropZone } from '../../../components/DropZone';
import { renderJsonViewer } from '../../../components/JsonViewer';
import { showToast } from '../../../components/Toast';
import { getCurrentPlugin, setCurrentData, navigateEditor } from '../../../session';

export function renderDecrypt(container: HTMLElement): void {
  clearEl(container);

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<div class="card-body"><h5 class="card-title mb-3">Decriptar Save</h5></div>';
  const body = card.querySelector('.card-body')!;

  const dropContainer = document.createElement('div');
  dropContainer.id = 'cc-dropzone';
  body.appendChild(dropContainer);

  const resultContainer = document.createElement('div');
  resultContainer.id = 'cc-result';
  resultContainer.className = 'mt-3';
  body.appendChild(resultContainer);

  renderDropZone(dropContainer, {
    accept: '.txt,.json',
    label: 'Solte o arquivo .txt do Cookie Clicker aqui',
    description: 'ou clique para selecionar',
    onFile: (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) { showToast('Erro ao ler arquivo', 'error'); return; }
          const plugin = getCurrentPlugin();
          if (!plugin) { showToast('Plugin não carregado', 'error'); return; }
          const data = plugin.decode(text);
          const err = plugin.validate(data);
          if (err) { showToast(err, 'error'); return; }
          setCurrentData(data);

          clearEl(resultContainer);
          renderJsonViewer(resultContainer, JSON.stringify(data, null, 2));

          const btnGroup = document.createElement('div');
          btnGroup.className = 'd-flex gap-2 mt-2';

          const copyBtn = document.createElement('button');
          copyBtn.className = 'btn btn-outline-primary btn-sm';
          copyBtn.textContent = 'Copiar JSON';
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
              .then(() => showToast('JSON copiado!', 'success'))
              .catch(() => showToast('Erro ao copiar', 'error'));
          });

          const editBtn = document.createElement('button');
          editBtn.className = 'btn btn-primary btn-sm';
          editBtn.textContent = 'Abrir no Editor';
          editBtn.addEventListener('click', () => navigateEditor());

          btnGroup.append(copyBtn, editBtn);
          resultContainer.appendChild(btnGroup);

          showToast(`Save carregado: ${file.name}`, 'success');
        } catch (ex) {
          showToast(ex instanceof Error ? ex.message : 'Erro ao decodificar', 'error');
        }
      };
      reader.onerror = () => showToast('Erro ao ler arquivo', 'error');
      reader.readAsText(file);
    }
  });

  container.appendChild(card);
}
