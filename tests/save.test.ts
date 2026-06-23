import { describe, it, expect } from 'vitest';
import { decodeSave, encodeSave, validateSave } from '../src/save';
import type { SaveData } from '../src/types';

describe('save', () => {
  it('decode/encode roundtrip', () => {
    const original: SaveData = {
      cookies: 1000,
      cookiesEarned: 5000,
      buildings: {
        Cursor: { amount: 10, amountMax: 10, bought: 15, cookiesMade: 1000 }
      }
    };

    const encoded = encodeSave(original);
    const decoded = decodeSave(encoded);

    expect(decoded.cookies).toBe(1000);
    expect(decoded.cookiesEarned).toBe(5000);
    expect((decoded.buildings as Record<string, Record<string, number>>).Cursor.amount).toBe(10);
  });

  it('decode with simple base64 (no UTF-8)', () => {
    const data = { cookies: 500 };
    const encoded = btoa(JSON.stringify(data));
    const decoded = decodeSave(encoded);
    expect(decoded.cookies).toBe(500);
  });

  it('validate rejects null', () => {
    expect(validateSave(null as unknown as SaveData)).toBe('Save inválido: não é um objeto JSON.');
  });

  it('validate rejects non-object', () => {
    expect(validateSave('string' as unknown as SaveData)).toBe('Save inválido: não é um objeto JSON.');
  });

  it('validate rejects empty object', () => {
    expect(validateSave({})).toBe('Save inválido: campos esperados não encontrados.');
  });

  it('validate accepts valid save', () => {
    expect(validateSave({ cookies: 100 })).toBeNull();
    expect(validateSave({ buildings: {} })).toBeNull();
  });

  it('decode throws on invalid base64', () => {
    expect(() => decodeSave('not-base64!!!')).toThrow('Arquivo inválido');
  });

  it('encode handles undefined values (converts to null)', () => {
    const data: SaveData = { a: 1, b: undefined };
    const encoded = encodeSave(data);
    const decoded = decodeSave(encoded);
    expect(decoded.a).toBe(1);
    expect(decoded.b).toBeNull();
  });
});
