import type { SaveData } from './types';

const BUILDINGS_ORDER = [
  "Cursor", "Grandma", "Farm", "Mine", "Factory", "Bank", "Temple",
  "Wizard tower", "Shipment", "Alchemy lab", "Portal", "Time machine",
  "Antimatter condenser", "Prism", "Chancemaker", "Fractal engine",
  "Javascript console", "Idleverse", "Cortex baker", "You"
];

function hashInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function setUpgrades(data: SaveData, ratio: number, maxId?: number): number {
  const ups = (data.upgrades as Record<string, number>) || {};
  const keys = Object.keys(ups).sort((a, b) => parseInt(a) - parseInt(b));
  let count = 0;
  for (const k of keys) {
    const id = parseInt(k);
    if (maxId !== undefined && id >= maxId) { ups[k] = 0; continue; }
    if (hashInt('up_' + k) % 100 < ratio * 100) { ups[k] = 3; count++; }
    else ups[k] = 0;
  }
  return count;
}

function setAchievements(data: SaveData, ratio: number, maxId?: number): number {
  const acs = (data.achievs as Record<string, number>) || {};
  const keys = Object.keys(acs).sort((a, b) => parseInt(a) - parseInt(b));
  let count = 0;
  for (const k of keys) {
    const id = parseInt(k);
    if (maxId !== undefined && id >= maxId) { acs[k] = 0; continue; }
    if (hashInt('ach_' + k) % 100 < ratio * 100) { acs[k] = 1; count++; }
    else acs[k] = 0;
  }
  return count;
}

function setBuildings(data: SaveData, amounts: Record<string, number>): void {
  const bgs = (data.buildings as Record<string, Record<string, number>>) || {};
  for (const [name, a] of Object.entries(amounts)) {
    const b = bgs[name] || { amount: 0, amountMax: 0, bought: 0, cookiesMade: 0 };
    b.amount = a;
    if (b.amountMax < a) b.amountMax = a;
    if (a > 0) b.bought = Math.max(b.bought || 0, a + 5);
    b.cookiesMade = b.cookiesMade || a * 1e10;
    bgs[name] = b;
  }
  data.buildings = bgs;
}

function setWrinklers(data: SaveData, active: number, popped: number, total: number): void {
  const wr: Array<{ s: number | null; t: number }> = [];
  for (let i = 0; i < 14; i++) {
    if (i < active) wr.push({ s: total / active * (0.3 + (i / active) * 0.7), t: 0 });
    else wr.push({ s: null, t: 0 });
  }
  data.wrinklers = wr;
  data.wrinklersPopped = popped;
  data.cookiesSucked = total;
}

function setGC(data: SaveData, clicked: number, missed: number): void {
  data.gcClicks = clicked;
  data.gcClicksTotal = clicked + missed;
  data.gcMissed = missed;
}

// ─── PRESETS ──────────────────────────────────────────────
function presetInicial(data: SaveData): void {
  const d = data;
  d.cookies = 0; d.cookiesEarned = 0; d.cookiesTotal = 0; d.cookiesHandmade = 0; d.cookieClicks = 0;
  d.heavenlyChips = 0; d.heavenlyChipsSpent = 0; d.cookiesReset = 0; d.resets = 0;
  d.permanentUpgrades = [-1, -1, -1, -1, -1];

  if (!d.buildings) d.buildings = {};
  for (const name of BUILDINGS_ORDER) {
    const b = (d.buildings as Record<string, Record<string, number>>)[name] || {};
    b.amount = 0; b.amountMax = 0; b.bought = 0; b.cookiesMade = 0;
    (d.buildings as Record<string, Record<string, number>>)[name] = b;
  }

  if (d.upgrades) for (const k in d.upgrades as Record<string, number>) (d.upgrades as Record<string, number>)[k] = 0;
  if (d.achievs) for (const k in d.achievs as Record<string, number>) (d.achievs as Record<string, number>)[k] = 0;

  d.dragonLevel = 0; d.dragonAura = 0; d.dragonAura2 = 0; d.santaLevel = 0;
  d.elderWrath = 0; d.pledges = 0; d.pledgeT = 0;
  d.wrinklersPopped = 0; d.cookiesSucked = 0;
  d.wrinklers = Array.from({ length: 14 }, () => ({ s: null, t: 0 }));
  d.season = ''; d.seasonT = 0; d.seasonUses = 0; d.researchT = 0; d.researchTM = 0; d.researchUpgrade = -1;
  d.powerClicks = 0; d.powerClicksTotal = 0; d.fortuneGC = 0; d.fortuneCPS = 0;
  setGC(d, 0, 0);
}

function presetVeterano(data: SaveData): void {
  const d = data;
  const now = Date.now();
  d.cookies = 5e11; d.cookiesEarned = 1.5e13; d.cookiesTotal = 1.5e13; d.cookiesHandmade = 50000; d.cookieClicks = 35000;
  d.heavenlyChips = 0; d.heavenlyChipsSpent = 0; d.cookiesReset = 0; d.resets = 0;
  d.permanentUpgrades = [-1, -1, -1, -1, -1];

  const a1: Record<string, number> = {};
  for (const name of BUILDINGS_ORDER.slice(0, 12)) a1[name] = 100;
  for (const name of BUILDINGS_ORDER.slice(12)) a1[name] = 0;
  setBuildings(d, a1); setUpgrades(d, 0.50, 200); setAchievements(d, 0.30, 150);

  d.dragonLevel = 4; d.dragonAura = 1; d.dragonAura2 = 4; d.santaLevel = 4; d.elderWrath = 1;
  d.pledges = 0; d.pledgeT = 0; setWrinklers(d, 7, 350, 8e14);
  d.season = ''; d.seasonT = 0; d.seasonUses = 2; d.researchT = 482000; d.researchTM = 600000; d.researchUpgrade = 104;
  setGC(d, 3800, 700); d.powerClicks = 120; d.powerClicksTotal = 420; d.fortuneGC = 1; d.fortuneCPS = 1;
  d.time = now; d.runStart = now - 21 * 86400000; d.gameStart = now - 180 * 86400000;
}

function presetLegitimo(data: SaveData): void {
  const d = data;
  const now = Date.now();
  d.cookies = 1e24; d.cookiesEarned = 5e25; d.cookiesTotal = 8e26; d.cookiesHandmade = 500000; d.cookieClicks = 350000;
  d.heavenlyChips = 50000000; d.heavenlyChipsSpent = 42000000; d.cookiesReset = 5e25; d.resets = 25;
  d.permanentUpgrades = [37, 61, 73, 92, 128];

  const grade = [5000, 4000, 3200, 2500, 2000, 1600, 1200, 900, 700, 500, 350, 200, 100, 50, 20, 8, 3, 2, 1, 0];
  const a2: Record<string, number> = {};
  BUILDINGS_ORDER.forEach((n, i) => { a2[n] = grade[i]; });
  setBuildings(d, a2); setUpgrades(d, 0.85); setAchievements(d, 0.75);

  d.dragonLevel = 4; d.dragonAura = 1; d.dragonAura2 = 6; d.santaLevel = 4; d.elderWrath = 2;
  d.pledges = 0; d.pledgeT = 0; setWrinklers(d, 10, 8000, 5e22);
  d.season = ''; d.seasonT = 0; d.seasonUses = 8; d.researchT = 0; d.researchTM = 950000; d.researchUpgrade = -1;
  setGC(d, 25000, 3000); d.powerClicks = 1200; d.powerClicksTotal = 5000; d.fortuneGC = 1; d.fortuneCPS = 1;
  d.time = now; d.runStart = now - 60 * 86400000; d.gameStart = now - 720 * 86400000;
}

export const presets = {
  inicial: { name: 'Inicial', fn: presetInicial },
  veterano: { name: 'Veterano', fn: presetVeterano },
  legitimo: { name: 'Legítimo', fn: presetLegitimo }
} as const;
