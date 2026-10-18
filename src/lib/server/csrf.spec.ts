import { describe, expect, it } from 'vitest';
import { isCrossSite } from './csrf.js';

const SELF = 'http://localhost:3000';

function post(headers: Record<string, string>, method = 'POST') {
	return new Request(`${SELF}/assistant/reorder?/act`, { method, headers });
}

describe('isCrossSite', () => {
	it('lets safe methods through', () => {
		expect(isCrossSite(post({ origin: 'https://evil.example' }, 'GET'), SELF)).toBe(false);
	});

	it('accepts a matching Origin', () => {
		expect(isCrossSite(post({ origin: SELF }), SELF)).toBe(false);
	});

	it('refuses a foreign Origin even with same-origin fetch metadata', () => {
		const req = post({ origin: 'https://evil.example', 'sec-fetch-site': 'same-origin' });
		expect(isCrossSite(req, SELF)).toBe(true);
	});

	it('refuses Origin: null', () => {
		expect(isCrossSite(post({ origin: 'null' }), SELF)).toBe(true);
	});

	// Chrome's enhanced-form fetch: no Origin, only fetch metadata.
	it('accepts no Origin with Sec-Fetch-Site: same-origin', () => {
		expect(isCrossSite(post({ 'sec-fetch-site': 'same-origin' }), SELF)).toBe(false);
	});

	it('refuses no Origin with Sec-Fetch-Site: cross-site or same-site', () => {
		expect(isCrossSite(post({ 'sec-fetch-site': 'cross-site' }), SELF)).toBe(true);
		expect(isCrossSite(post({ 'sec-fetch-site': 'same-site' }), SELF)).toBe(true);
	});

	it('refuses a request with neither header', () => {
		expect(isCrossSite(post({}), SELF)).toBe(true);
	});
});
