# 🍪 Game Save Toolkit

**Decripte, edite e exporte saves do Cookie Clicker e outros jogos. 100% client-side, offline-first, PWA.**

## Funcionalidades

- **Decriptar saves** — Cole ou arraste um save `.txt` do Cookie Clicker e veja todos os campos decodificados
- **Editor completo** — 9 abas de edição (Cookies, Prédios, Prestígio, Dragão, Tempo, GC/Fortuna, Anciões, Config, Upgrades)
- **Presets** — 3 presets determinísticos: Inicial, Veterano e Legítimo
- **Undo/Redo** — 50 níveis de histórico com atalhos Ctrl+Z / Ctrl+Shift+Z
- **Exportar** — Baixe como `.txt` (para importar no jogo) ou `.json` (legível)
- **Multi-game** — Sistema de plugins: Cookie Clicker (completo), Minecraft (esqueleto), Subway Surf (esqueleto)
- **Tema escuro/claro** — Alternância com persistência
- **PWA** — Instalável, funciona offline, Service Worker com Workbox
- **Auto-save** — Estado persistido no localStorage

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Bundler | [Vite 6](https://vitejs.dev/) |
| Linguagem | [TypeScript 5.7](https://www.typescriptlang.org/) (strict) |
| UI | [Bootstrap 5.3](https://getbootstrap.com/) (SCSS components) |
| Testes | [Vitest](https://vitest.dev/) |
| PWA | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + Workbox |
| Ícones | Emoji-only (sem dependência de icon library) |

## Começando

```bash
# Instalar dependências
npm install

# Desenvolvimento (hot-reload)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Rodar testes
npm test
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes UI reutilizáveis
│   ├── ConfirmModal.ts  # Modal de confirmação Bootstrap
│   ├── DropZone.ts      # Área de drop para arquivos
│   ├── GameSelector.ts  # Seletor de jogo
│   ├── JsonViewer.ts    # Visualização JSON
│   ├── Navbar.ts        # Barra de navegação principal
│   ├── ThemeToggle.ts   # Alternância de tema
│   └── Toast.ts         # Sistema de notificações
├── games/               # Plugins de jogos
│   ├── cookie-clicker/  # Cookie Clicker (completo)
│   │   ├── tabs/        # 9 abas do editor
│   │   └── views/       # Decrypt + Editor views
│   ├── minecraft/       # Minecraft (esqueleto)
│   └── subway-surf/     # Subway Surf (esqueleto)
├── types/               # Tipos TypeScript compartilhados
├── helpers.ts           # Utilitários (DOM, formatação, download)
├── main.ts              # Entry point
├── presets.ts           # Presets de save do Cookie Clicker
├── registry.ts          # Registro de plugins de jogos
├── save.ts              # Decode/encode/validate de saves
├── session.ts           # Sessão atual (plugin + dados correntes)
├── store.ts             # Estado global + undo/redo + persistência
├── style.scss           # Bootstrap SCSS customizado
└── theme.ts             # Gerenciamento de tema
```

## Sistema de Plugins

Para adicionar um novo jogo, crie uma pasta em `src/games/<game-id>/` com um `index.ts` exportando um `GamePlugin`:

```typescript
import type { GamePlugin } from '../../types';

const plugin: GamePlugin = {
  id: 'meu-jogo',
  name: 'Meu Jogo',
  icon: '🎮',
  description: 'Editor de saves do Meu Jogo',
  decode: (text: string) => JSON.parse(text),
  encode: (data: SaveData) => JSON.stringify(data),
  validate: (data: SaveData) => null, // null = válido
  presets: [{ name: 'Preset 1', apply: (d) => { d.score = 999999; } }],
  views: {
    decrypt: (container) => { /* view de decriptação */ },
    editor: (container) => { /* view de edição */ }
  }
};

export default plugin;
```

Depois registre em `src/main.ts`:

```typescript
import meuJogo from './games/meu-jogo';
registerGame(meuJogo);
```

## PWA

O app é instalável (add to home screen) e funciona offline:

- **Service Worker** gerado automaticamente pelo Workbox
- **Cache** de assets estáticos (JS, CSS, HTML, fontes, ícones)
- **Runtime caching** para arquivos `.txt` e `.json` com estratégia NetworkFirst
- **Auto-update** do SW em segundo plano

## Licença

MIT
