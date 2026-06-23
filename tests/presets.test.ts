import { describe, it, expect } from 'vitest';
import { decodeSave, encodeSave } from '../src/save';
import { presets } from '../src/presets';
import type { SaveData } from '../src/types';

function createEmptySave(): SaveData {
  const raw = {
    cookies: 0,
    cookiesEarned: 0,
    cookiesTotal: 0,
    cookiesHandmade: 0,
    cookieClicks: 0,
    heavenlyChips: 0,
    heavenlyChipsSpent: 0,
    cookiesReset: 0,
    resets: 0,
    permanentUpgrades: [-1, -1, -1, -1, -1],
    buildings: {},
    upgrades: {},
    achievs: {},
    dragonLevel: 0,
    dragonAura: 0,
    dragonAura2: 0,
    santaLevel: 0,
    wrinklers: Array.from({ length: 14 }, () => ({ s: null, t: 0 })),
    wrinklersPopped: 0,
    cookiesSucked: 0
  };
  return raw as unknown as SaveData;
}

describe('presets', () => {
  describe('inicial', () => {
    it('zeros out all values', () => {
      const d = createEmptySave();
      d.cookies = 999999;
      presets.inicial.fn(d);
      expect(d.cookies).toBe(0);
      expect(d.heavenlyChips).toBe(0);
      expect(d.resets).toBe(0);
    });

    it('resets buildings to 0', () => {
      const d = createEmptySave();
      d.buildings = { Cursor: { amount: 100, amountMax: 100, bought: 200, cookiesMade: 1e12 } };
      presets.inicial.fn(d);
      expect((d.buildings as Record<string, Record<string, number>>).Cursor.amount).toBe(0);
    });
  });

  describe('veterano', () => {
    it('sets cookies to 5e11', () => {
      const d = createEmptySave();
      presets.veterano.fn(d);
      expect(d.cookies).toBe(5e11);
    });

    it('sets dragon level to 4', () => {
      const d = createEmptySave();
      presets.veterano.fn(d);
      expect(d.dragonLevel).toBe(4);
    });

    it('sets 12 buildings to 100 each', () => {
      const d = createEmptySave();
      presets.veterano.fn(d);
      const bgs = d.buildings as Record<string, Record<string, number>>;
      expect(bgs.Cursor.amount).toBe(100);
      expect(bgs.Bank.amount).toBe(100);
      expect(bgs.You?.amount || 0).toBe(0);
    });
  });

  describe('legitimo', () => {
    it('sets cookies to 1e24', () => {
      const d = createEmptySave();
      presets.legitimo.fn(d);
      expect(d.cookies).toBe(1e24);
    });

    it('sets heavenlyChips to 50M', () => {
      const d = createEmptySave();
      presets.legitimo.fn(d);
      expect(d.heavenlyChips).toBe(50000000);
    });

    it('sets permanentUpgrades array', () => {
      const d = createEmptySave();
      presets.legitimo.fn(d);
      expect(d.permanentUpgrades).toEqual([37, 61, 73, 92, 128]);
    });
  });

  describe('deterministic hash', () => {
    it('produces consistent results', () => {
      const d1 = createEmptySave();
      const d2 = createEmptySave();
      presets.veterano.fn(d1);
      presets.veterano.fn(d2);
      expect(d1.upgrades).toEqual(d2.upgrades);
      expect(d1.achievs).toEqual(d2.achievs);
    });
  });

  describe('roundtrip', () => {
    it('preset -> encode -> decode -> preset values match', () => {
      const d = createEmptySave();
      presets.legitimo.fn(d);

      const encoded = encodeSave(d);
      const decoded = decodeSave(encoded);

      expect(decoded.cookies).toBe(d.cookies);
      expect(decoded.heavenlyChips).toBe(d.heavenlyChips);
      expect(decoded.resets).toBe(d.resets);
    });
  });
});
