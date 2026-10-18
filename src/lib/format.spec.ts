import { describe, expect, it } from 'vitest';
import { qty } from './format.js';

describe('qty', () => {
	it('pluralises like seller-svc', () => {
		expect(qty(4, 'loaf')).toBe('4 loaves');
		expect(qty(1, 'box')).toBe('1 box');
		expect(qty(14, 'box')).toBe('14 boxes');
		expect(qty(12, 'kg')).toBe('12 kg');
		expect(qty(6, 'pcs')).toBe('6 pcs');
		expect(qty(8, 'portions')).toBe('8 portions');
		expect(qty(2, 'bottle')).toBe('2 bottles');
	});
});
