import { describe, expect, it } from 'vitest';
import { isActive } from './nav.js';

describe('isActive', () => {
	it('menyala untuk rute itu sendiri dan sub-halamannya', () => {
		expect(isActive('/produk', '/produk')).toBe(true);
		expect(isActive('/produk/123', '/produk')).toBe(true);
	});

	it('tidak menyala untuk rute yang hanya berawalan sama', () => {
		expect(isActive('/produk-baru', '/produk')).toBe(false);
	});
});
