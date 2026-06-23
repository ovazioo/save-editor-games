// ─── DOM SELECTORS ─────────────────────────────────────────
export const $ = <T extends HTMLElement>(s: string, c: ParentNode = document): T | null =>
  c.querySelector<T>(s);

export const $$ = <T extends HTMLElement>(s: string, c: ParentNode = document): T[] =>
  [...c.querySelectorAll<T>(s)];

// ─── ELEMENT BUILDER ──────────────────────────────────────
interface Attrs {
  [key: string]: string | number | boolean | ((e: Event) => void) | undefined;
}

export function html<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: (string | Node)[] = []
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false || v === null) continue;
    if (k === 'className') { el.className = String(v); continue; }
    if (k === 'dataset' && typeof v === 'object') {
      Object.assign(el.dataset, v as Record<string, string>);
      continue;
    }
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase() as string, v as (e: Event) => void);
      continue;
    }
    if (v === true) { el.setAttribute(k, ''); continue; }
    el.setAttribute(k, String(v));
  }
  for (const c of Array.isArray(children) ? children : [children]) {
    if (typeof c === 'string') el.appendChild(document.createTextNode(c));
    else if (c instanceof Node) el.appendChild(c);
  }
  return el;
}

// ─── CLEAR ELEMENT ────────────────────────────────────────
export function clearEl(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

// ─── NUMBER FORMATTING ────────────────────────────────────
export function fmt(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === '') return '0';
  const v = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(v)) return '0';
  if (Math.abs(v) >= 1e15) return v.toExponential(6);
  return Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

export function parseNum(s: string): number {
  if (!s) return 0;
  const clean = s.trim().replace(/\./g, '').replace(',', '.');
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

// ─── DOWNLOAD ─────────────────────────────────────────────
function dl(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export function downloadTxt(data: Record<string, unknown>, filename: string): void {
  const raw = JSON.stringify(data, (_, v) => v === undefined ? null : v);
  const encoded = btoa(unescape(encodeURIComponent(raw)));
  const blob = new Blob([encoded], { type: 'text/plain;charset=utf-8' });
  dl(blob, `${filename}.txt`);
}

export function downloadJson(data: Record<string, unknown>, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  dl(blob, `${filename}.json`);
}

// ─── FORM FIELD BUILDER ───────────────────────────────────
export function field(
  labelText: string,
  value: number | string | null | undefined,
  onChange: (v: string) => void,
  opts: { id?: string; hint?: string } = {}
): HTMLElement {
  const g = document.createElement('div');
  g.className = 'mb-3';

  const lbl = document.createElement('label');
  lbl.className = 'form-label';
  lbl.textContent = labelText;
  if (opts.id) lbl.htmlFor = opts.id;

  const inp = document.createElement('input');
  inp.className = 'form-control';
  inp.type = 'text';
  inp.value = value !== null && value !== undefined ? String(value) : '0';
  if (opts.id) inp.id = opts.id;
  if (opts.hint) inp.setAttribute('aria-describedby', `${opts.id}-hint`);

  inp.addEventListener('input', () => onChange(inp.value));

  g.append(lbl, inp);

  if (opts.hint) {
    const hint = document.createElement('div');
    hint.className = 'form-text';
    hint.id = `${opts.id}-hint`;
    hint.textContent = opts.hint;
    g.appendChild(hint);
  }

  return g;
}
