import { describe, expect, it } from 'vitest';
import { isActive } from './nav.js';

describe('isActive', () => {
	it('lights up for the route itself and its sub-pages', () => {
		expect(isActive('/products', '/products')).toBe(true);
		expect(isActive('/products/123', '/products')).toBe(true);
	});

	it('does not light up for a route that merely shares a prefix', () => {
		expect(isActive('/products-new', '/products')).toBe(false);
	});
});
