# 🍪 Cookie Clicker Save Toolkit — Plano de Desenvolvimento

## 1. Conceito

Aplicação web **front-end PWA** para descriptografar, visualizar, editar e exportar arquivos de save do jogo **Cookie Clicker**. O processamento é 100% client-side — nenhum dado sai do navegador do usuário.

---

## 2. Propósito

Fornecer uma ferramenta **privada, offline e gratuita** para a comunidade de Cookie Clicker manipular seus saves com segurança, sem depender de sites externos que poderiam armazenar ou interceptar dados.

---

## 3. Objetivos

| # | Objetivo | Prioridade |
|---|----------|------------|
| 1 | Decriptar saves do formato base64 para JSON legível | 🔴 Alta |
| 2 | Exibir JSON decodificado com opção de copiar | 🔴 Alta |
| 3 | Editar cookies, prédios, prestige, upgrades, achievements | 🔴 Alta |
| 4 | Aplicar presets de progressão (Inicial, Veterano, Legítimo) | 🟡 Média |
| 5 | Exportar save editado de volta para .txt (formato do jogo) | 🔴 Alta |
| 6 | Funcionar offline como PWA | 🟡 Média |
| 7 | Interface responsiva para mobile e desktop | 🟡 Média |
| 8 | Acessibilidade (ARIA, teclado, contraste) | 🟢 Baixa |

---

## 4. Arquitetura

### 4.1 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 com variáveis, design responsivo, dark mode |
| Lógica | Vanilla JavaScript (ES6+) — sem frameworks |
| Estado | Padrão Pub/Sub manual (store notifica listeners) |
| Roteamento | SPA caseiro por views (Decriptar / Editor / Sobre) |
| Offline | Service Worker com cache-first estático |
| Ícones | PNG 192x192 e 512x512 para PWA |

### 4.2 Estrutura de Diretórios

```
cookie-clicker-save-toolkit/
├── index.html                    # HTML principal (sem CSS inline)
├── manifest.json                 # Manifest PWA
├── sw.js                         # Service Worker
├── PLANNING.md                   # Este arquivo
├── .gitignore
├── assets/
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
└── src/
    ├── css/
    │   └── style.css             # Estilos separados do HTML
    ├── js/
    │   ├── app.js                # Entry point — inicia a SPA
    │   ├── store.js              # Estado global + Pub/Sub
    │   ├── helpers.js            # Utilitários (DOM, formatação, download)
    │   ├── save.js               # Decode/Encode/Validate de saves
    │   ├── presets.js            # Presets (Inicial, Veterano, Legítimo)
    │   ├── views/
    │   │   ├── nav.js            # Navegação principal (abas SPA)
    │   │   ├── decrypt.js        # View: Decriptar (dropzone + preview)
    │   │   ├── editor.js         # View: Editor (tabs + presets + export)
    │   │   └── about.js          # View: Sobre
    │   └── tabs/
    │       ├── cookies.js        # Aba: Cookies (saldo, ganhos, cliques)
    │       ├── buildings.js      # Aba: Prédios (quantidades por tipo)
    │       ├── prestige.js       # Aba: Prestígio (HCs, resets)
    │       ├── dragon.js         # Aba: Dragão/Santa (auras, níveis)
    │       ├── time.js           # Aba: Tempo (timestamps do save)
    │       ├── golden.js         # Aba: Golden Cookies / Fortuna
    │       ├── wrinklers.js      # Aba: Anciões / Wrinklers
    │       ├── settings.js       # Aba: Configurações do jogo
    │       └── upgrades.js       # Aba: Upgrades / Achievements
```

### 4.3 Fluxo de Dados

```
[Arquivo .txt] 
      ↓ (FileReader API)
decodeSave() → base64 → UTF-8 → JSON
      ↓
validateSave()
      ↓
store.data (objeto JS mutável)
      ↓ (usuário edita via formulários)
setData() → notify() → re-render
      ↓ (export)
encodeSave() → JSON → UTF-8 → base64 → Blob → download .txt
```

### 4.4 Componentes e Responsabilidades

| Módulo | Responsabilidade |
|--------|-----------------|
| `store.js` | Estado global (`data`, `currentView`, `currentTab`, `modified`, `saveName`). Funções `getState()`, `setData()`, `subscribe()`, `notify()` |
| `helpers.js` | `$()`, `$$()`, `html()`, `msg()`, `clearEl()`, `field()`, `fmt()`, `parseNum()`, `downloadTxt()`, `downloadJson()` |
| `save.js` | `decodeSave(text)` → objeto, `encodeSave(data)` → base64, `validateSave(data)` → erro ou null |
| `presets.js` | `presetInicial()`, `presetVeterano()`, `presetLegitimo()` — cada um sobrescreve campos do save com valores realistas |
| `nav.js` | Renderiza botões de navegação entre views (Decriptar, Editor, Sobre). Destaque visual da view ativa |
| `decrypt.js` | Dropzone + file input. Lê arquivo, decodifica, valida, exibe JSON preview. Botões "Copiar" e "Abrir no Editor" |
| `editor.js` | Renderiza abas de edição + presets + nome do save + botões de export. Roteia entre tabs. Atalhos de teclado (setas, Home, End) |
| `about.js` | Conteúdo estático: descrição, funcionalidades, privacidade, licença |

### 4.5 Abas do Editor

| Aba | Campos |
|-----|--------|
| Cookies | cookies, cookiesEarned, cookiesTotal, cookiesHandmade, cookieClicks |
| Prédios | Quantidade de cada building (Cursor, Grandma, Farm, ..., You) |
| Prestígio | heavenlyChips, heavenlyChipsSpent, cookiesReset, resets, permanentUpgrades |
| Dragão/Santa | dragonLevel, dragonAura, dragonAura2, santaLevel |
| Tempo | time, runStart, gameStart, seasonT, pledgeT + botão "Definir time para agora" |
| GC/Fortuna | gcClicks, gcClicksTotal, gcMissed, fortuneGC, fortuneCPS, powerClicks, powerClicksTotal |
| Anciões/Wrinklers | elderWrath, pledges, pledgeT, wrinklersPopped, cookiesSucked + wrinklers individuais |
| Config | fancy, particles, cursors, sound, milk, etc. (booleanos e numéricos) |
| Upgrades | Contagem total, botões "Unlock ALL Upgrades" e "Unlock ALL Achievements" |

### 4.6 Presets

| Preset | Cookies | Prédios | HCs | Upgrades | Achievements | Perfil |
|--------|---------|---------|-----|----------|-------------|--------|
| **Inicial** | 0 | 0 | 0 | 0% | 0% | Zerado |
| **Veterano** | 5e11 | 100 (12 tipos) | 0 | ~50% | ~30% | Meio do jogo |
| **Legítimo** | 1e24 | Escalonado (5000→0) | 50M | ~85% | ~75% | Endgame |

A distribuição de upgrades/achievements usa `hashInt()` pseudo-aleatório determinístico — mesmos IDs sempre resultam nos mesmos upgrades desbloqueados.

---

## 5. Cronograma

### Fase 1 — Fundação (1-2 dias)

- [x] Estrutura de diretórios
- [x] `index.html` semântico + SEO
- [ ] `src/css/style.css` completo (responsivo, dark mode)
- [ ] `src/js/store.js` — estado global + pub/sub
- [ ] `src/js/helpers.js` — funções utilitárias
- [ ] `src/js/save.js` — encode/decode/validate

### Fase 2 — Views (2-3 dias)

- [ ] `src/js/views/nav.js` — navegação SPA
- [ ] `src/js/views/decrypt.js` — dropzone + preview
- [ ] `src/js/views/about.js` — página sobre
- [ ] `src/js/views/editor.js` — editor completo com tabs

### Fase 3 — Abas do Editor (2-3 dias)

- [ ] `src/js/tabs/cookies.js`
- [ ] `src/js/tabs/buildings.js`
- [ ] `src/js/tabs/prestige.js`
- [ ] `src/js/tabs/dragon.js`
- [ ] `src/js/tabs/time.js`
- [ ] `src/js/tabs/golden.js`
- [ ] `src/js/tabs/wrinklers.js`
- [ ] `src/js/tabs/settings.js`
- [ ] `src/js/tabs/upgrades.js`

### Fase 4 — Presets + Export (1 dia)

- [ ] `src/js/presets.js`
- [ ] Export .txt (base64) e .json
- [ ] Testes manuais de ida e volta (import → edit → export → import no jogo)

### Fase 5 — PWA + Polimento (1 dia)

- [ ] `manifest.json` atualizado
- [ ] `sw.js` — cache estático + estratégia network-first para .txt
- [ ] Testes offline
- [ ] Acessibilidade (ARIA, foco, teclado)
- [ ] Responsividade mobile

---

## 6. Regras de Negócio

1. **Decode**: Tentar `atob` → `decodeURIComponent(escape())` → `JSON.parse`. Fallback: `atob` → `JSON.parse` direto.
2. **Validate**: Deve ser objeto. Deve ter campo `cookies` ou `buildings`.
3. **Edit**: Toda alteração no `data` deve chamar `setData()` para notificar listeners e re-renderizar.
4. **Presets**: Confirmar com `window.confirm()` antes de sobrescrever. Chamar `setData()` após aplicar.
5. **Export**: Nome padrão `CookieClickerSave`. Extensão `.txt` para import no jogo, `.json` para leitura humana.
6. **Privacidade**: Zero dependências externas. Zero CDN. Zero tracking.

---

## 7. Melhorias Futuras (Fora do Escopo Atual)

- Histórico de alterações (undo/redo)
- Suporte a múltiplos saves simultâneos
- Comparação entre saves (diff)
- Temas customizáveis ( light mode)
- i18n (inglês)
- Testes unitários (jest ou vitest)

---

## 8. Licença

MIT — código aberto, livre para usar, modificar e distribuir.
