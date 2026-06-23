import { describe, it, expect } from 'vitest';
import { fmt, parseNum } from '../src/helpers';

describe('helpers', () => {
  describe('fmt', () => {
    it('formats zero', () => {
      expect(fmt(0)).toBe('0');
    });

    it('handles null/undefined', () => {
      expect(fmt(null)).toBe('0');
      expect(fmt(undefined)).toBe('0');
    });

    it('handles large numbers with exponential', () => {
      const result = fmt(1e16);
      expect(result).toContain('e');
    });

    it('formats normal numbers with locale', () => {
      expect(fmt(1000)).toBe('1.000');
    });
  });

  describe('parseNum', () => {
    it('parses Brazilian formatted number', () => {
      expect(parseNum('1.500,50')).toBe(1500.5);
    });

    it('handles empty string', () => {
      expect(parseNum('')).toBe(0);
    });

    it('handles invalid input', () => {
      expect(parseNum('abc')).toBe(0);
    });
  });
});
