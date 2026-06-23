import { html, clearEl } from '../../../helpers';
import { showToast } from '../../../components/Toast';
import { showConfirm } from '../../../components/ConfirmModal';
import { getCurrentData, getCurrentPlugin } from '../../../session';
import { downloadTxt, downloadJson } from '../../../helpers';
import { renderCookies } from '../tabs/CookiesTab';
import { renderBuildings } from '../tabs/BuildingsTab';
import { renderPrestige } from '../tabs/PrestigeTab';
import { renderDragon } from '../tabs/DragonTab';
import { renderTime } from '../tabs/TimeTab';
import { renderGolden } from '../tabs/GoldenTab';
import { renderWrinklers } from '../tabs/WrinklersTab';
import { renderSettings } from '../tabs/SettingsTab';
import { renderUpgrades } from '../tabs/UpgradesTab';

interface TabDef {
  id: string;
  label: string;
  render: (container: HTMLElement) => void;
}

const TABS: TabDef[] = [
  { id: 'cookies', label: 'Cookies', render: renderCookies },
  { id: 'buildings', label: 'Prédios', render: renderBuildings },
  { id: 'prestige', label: 'Prestígio', render: renderPrestige },
  { id: 'dragon', label: 'Dragão/Santa', render: renderDragon },
  { id: 'time', label: 'Tempo', render: renderTime },
  { id: 'golden', label: 'GC/Fortuna', render: renderGolden },
  { id: 'wrinklers', label: 'Anciões/Wrinklers', render: renderWrinklers },
  { id: 'settings', label: 'Config', render: renderSettings },
  { id: 'upgrades', label: 'Upgrades', render: renderUpgrades }
];

let activeTab = 'cookies';

export function renderEditor(container: HTMLElement): void {
  clearEl(container);

  const data = getCurrentData();
  if (!data) {
    container.innerHTML = '<div class="alert alert-info">Nenhum save carregado. Vá em "Decriptar" primeiro.</div>';
    return;
  }

  const plugin = getCurrentPlugin();

  const card = document.createElement('div');
  card.className = 'card';
  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title mb-3';
  title.textContent = 'Editor de Save';
  body.appendChild(title);

  // Tab navigation
  const nav = document.createElement('nav');
  nav.className = 'd-flex flex-wrap gap-1 mb-3';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Abas do editor');

  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  for (const tab of TABS) {
    const btn = document.createElement('button');
    btn.className = `btn btn-sm ${tab.id === activeTab ? 'btn-primary' : 'btn-outline-secondary'}`;
    btn.setAttribute('role', 'tab');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => switchTab(tab.id, tabContent));
    nav.appendChild(btn);
  }

  body.appendChild(nav);
  body.appendChild(tabContent);

  // Presets section
  if (plugin?.presets && plugin.presets.length > 0) {
    const presetSection = document.createElement('div');
    presetSection.className = 'mt-3 pt-3 border-top';

    const presetLabel = document.createElement('p');
    presetLabel.className = 'text-body-secondary small mb-2';
    presetLabel.textContent = 'Presets:';
    presetSection.appendChild(presetLabel);

    const presetGroup = document.createElement('div');
    presetGroup.className = 'd-flex gap-2 flex-wrap';

    for (const p of plugin.presets) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-warning btn-sm';
      btn.textContent = p.name;
      btn.addEventListener('click', async () => {
        if (!await showConfirm('Aplicar Preset', `Aplicar preset "${p.name}"? Isso vai sobrescrever vários campos.`, { confirmVariant: 'warning' })) return;
        const d = getCurrentData();
        if (d) {
          p.apply(d);
          showToast(`Preset "${p.name}" aplicado!`, 'success');
          switchTab(activeTab, tabContent);
        }
      });
      presetGroup.appendChild(btn);
    }

    presetSection.appendChild(presetGroup);
    body.appendChild(presetSection);
  }

  // Export section
  const exportSection = document.createElement('div');
  exportSection.className = 'mt-3 pt-3 border-top';

  // Save name
  const nameGroup = document.createElement('div');
  nameGroup.className = 'mb-2';

  const nameLabel = document.createElement('label');
  nameLabel.className = 'form-label small';
  nameLabel.textContent = 'Nome do save:';
  nameLabel.htmlFor = 'save-name-input';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'form-control form-control-sm';
  nameInput.id = 'save-name-input';
  nameInput.placeholder = 'CookieClickerSave';

  nameGroup.append(nameLabel, nameInput);
  exportSection.appendChild(nameGroup);

  const exportGroup = document.createElement('div');
  exportGroup.className = 'd-flex gap-2';

  const txtBtn = document.createElement('button');
  txtBtn.className = 'btn btn-success btn-sm';
  txtBtn.textContent = '💾 Baixar .txt (pro jogo)';
  txtBtn.addEventListener('click', () => {
    const d = getCurrentData();
    if (!d) return;
    downloadTxt(d, nameInput.value.trim() || 'CookieClickerSave');
    showToast('Save baixado!', 'success');
  });

  const jsonBtn = document.createElement('button');
  jsonBtn.className = 'btn btn-outline-secondary btn-sm';
  jsonBtn.textContent = '📄 Baixar .json (legível)';
  jsonBtn.addEventListener('click', () => {
    const d = getCurrentData();
    if (!d) return;
    downloadJson(d, nameInput.value.trim() || 'CookieClickerSave');
    showToast('JSON baixado!', 'success');
  });

  exportGroup.append(txtBtn, jsonBtn);
  exportSection.appendChild(exportGroup);
  body.appendChild(exportSection);

  card.appendChild(body);
  container.appendChild(card);

  // Render initial active tab
  renderTabContent(tabContent, activeTab);
}

function switchTab(id: string, tabContent: HTMLElement): void {
  activeTab = id;
  // Update button styles
  const nav = tabContent.parentElement?.querySelector('[role="tablist"]');
  if (nav) {
    const btns = nav.querySelectorAll('button');
    btns.forEach(b => {
      b.className = `btn btn-sm ${b.textContent === TABS.find(t => t.id === id)?.label ? 'btn-primary' : 'btn-outline-secondary'}`;
    });
  }
  renderTabContent(tabContent, id);
}

function renderTabContent(tabContent: HTMLElement, id: string): void {
  clearEl(tabContent);
  const tab = TABS.find(t => t.id === id);
  if (tab) tab.render(tabContent);
}
