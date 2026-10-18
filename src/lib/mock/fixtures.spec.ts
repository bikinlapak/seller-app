import { describe, expect, it } from 'vitest';
import { AI_SETTINGS, HOME, PRODUCTS, STOCK, THREADS } from './fixtures.js';
import type { Severity } from '#lib/types/api.js';

/*
 * The fixtures are the only place a seller-svc response shape is written out
 * in full, so this doubles as a contract test: if the backend renames a field
 * the fixtures follow, and these assertions fail first.
 */

const SEVERITIES: Severity[] = ['ok', 'warn', 'critical'];

describe('assistant home', () => {
	it('every attention row points at a thread that exists', () => {
		for (const a of HOME.attention) {
			expect(a.href.startsWith('/assistant/')).toBe(true);
			expect(THREADS[a.href.replace('/assistant/', '')]).toBeDefined();
		}
	});

	it('every quick command points at a thread that exists', () => {
		for (const c of HOME.commands) {
			expect(THREADS[c.href.replace('/assistant/', '')]).toBeDefined();
		}
	});
});

describe('threads', () => {
	it('message ids are unique within a thread', () => {
		for (const [topic, thread] of Object.entries(THREADS)) {
			const ids = thread.messages.map((m) => m.id);
			expect(new Set(ids).size, topic).toBe(ids.length);
		}
	});

	it('the suggestion card carries a token and a quantity cap', () => {
		const card = THREADS.reorder.messages.find((m) => m.type === 'suggestion_card');
		expect(card).toBeDefined();
		if (card?.type !== 'suggestion_card') throw new Error('wrong message type');
		expect(card.card.token).toBeTruthy();
		expect(card.card.quantity).toBeGreaterThan(0);
	});

	it('detection boxes stay inside the photo', () => {
		const photo = THREADS.waste.messages.find((m) => m.type === 'photo');
		if (photo?.type !== 'photo') throw new Error('wrong message type');
		for (const box of photo.boxes) {
			expect(box.x + box.w).toBeLessThanOrEqual(100);
			expect(box.y + box.h).toBeLessThanOrEqual(100);
		}
	});

	it('items past their date offer neither donation nor sale', () => {
		const card = THREADS.waste.messages.find((m) => m.type === 'waste_card');
		if (card?.type !== 'waste_card') throw new Error('wrong message type');
		for (const item of card.card.items.filter((i) => i.severity === 'critical')) {
			const ids = item.destinations.map((d) => d.id);
			expect(ids).not.toContain('donated');
			expect(ids).not.toContain('repurposed');
			expect(item.warning).toBeTruthy();
		}
	});

	it('"discard" (landfill) is never preselected', () => {
		const card = THREADS.waste.messages.find((m) => m.type === 'waste_card');
		if (card?.type !== 'waste_card') throw new Error('wrong message type');
		for (const item of card.card.items) {
			expect(item.destinations.find((d) => d.id === 'landfill')?.selected ?? false).toBe(false);
		}
	});

	it('exactly one destination is preselected per item', () => {
		const card = THREADS.waste.messages.find((m) => m.type === 'waste_card');
		if (card?.type !== 'waste_card') throw new Error('wrong message type');
		for (const item of card.card.items) {
			expect(item.destinations.filter((d) => d.selected)).toHaveLength(1);
		}
	});
});

describe('products and stock', () => {
	it('severity is always a known value', () => {
		for (const p of PRODUCTS.products) expect(SEVERITIES).toContain(p.stockSeverity);
		for (const r of STOCK.rows) expect(SEVERITIES).toContain(r.severity);
	});

	it('the summary tiles count the same tagged rows the filters show', () => {
		expect(STOCK.summary.lowCount).toBe(STOCK.rows.filter((r) => r.tags.includes('low')).length);
		expect(STOCK.summary.expiringCount).toBe(
			STOCK.rows.filter((r) => r.tags.includes('expiring')).length
		);
	});

	it('stock bar percentages are within 0-100', () => {
		for (const r of STOCK.rows) {
			expect(r.percent).toBeGreaterThanOrEqual(0);
			expect(r.percent).toBeLessThanOrEqual(100);
		}
	});

	it('a product with no price explains itself in a subtitle', () => {
		for (const p of PRODUCTS.products) {
			if (p.priceLabel === null) expect(p.subtitle).toBeTruthy();
		}
	});
});

describe('AI settings', () => {
	it('the selected mode is one of the listed modes', () => {
		expect(AI_SETTINGS.modes.map((m) => m.id)).toContain(AI_SETTINGS.selectedMode);
	});

	it('the selected language is one of the options', () => {
		expect(AI_SETTINGS.language.options).toContain(AI_SETTINGS.language.selected);
	});

	it('English is the default language', () => {
		expect(AI_SETTINGS.language.selected).toBe('English');
	});

	it('stock forecasting is marked as a system number, not chat', () => {
		const forecast = AI_SETTINGS.models.find((m) => m.task === 'Stock forecasting');
		expect(forecast?.system).toBe(true);
	});
});
