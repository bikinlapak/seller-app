import { describe, expect, it, vi } from 'vitest';

/*
 * Tests for the thread's form actions. "Approve" is the only way a write
 * reaches worksh.io, so what is tested here: an invalid quantity is refused,
 * and a successful result appends the system note plus the result card.
 *
 * $app/env/private is mocked because that module only exists in a SvelteKit
 * build.
 */
vi.mock('$app/env/private', () => ({
	SELLER_SVC_URL: 'http://127.0.0.1:8080',
	SELLER_SVC_AUDIENCE: '',
	SELLER_SVC_MOCK: true
}));

const { actions } = await import('./+page.server.js');

function request(fields: Record<string, string>) {
	const form = new FormData();
	for (const [k, v] of Object.entries(fields)) form.append(k, v);
	return {
		fetch: globalThis.fetch,
		request: new Request('http://x', { method: 'POST', body: form })
	};
}

/** `fail()` returns an ActionFailure; success returns `{ added }`. */
function status(res: unknown): number | undefined {
	return typeof res === 'object' && res !== null && 'status' in res
		? (res as { status: number }).status
		: undefined;
}

function result(res: unknown): { title: string; detail: string; waUrl?: string } {
	if (typeof res !== 'object' || res === null || !('result' in res)) {
		throw new Error('the action returned no result');
	}
	return (res as { result: { title: string; detail: string; waUrl?: string } }).result;
}

/*
 * The thread itself is no longer patched here: seller-svc stores the note and
 * the result card, and SvelteKit re-runs `load` after the action. What these
 * tests pin is the translation from form to request and back.
 */

describe('approve', () => {
	it('refuses a zero or non-numeric quantity', async () => {
		for (const quantity of ['0', '-3', 'abc', '']) {
			const res = await actions.act(
				request({ token: 'tok', quantity, idempotencyKey: 'k' }) as never
			);
			expect(status(res), `quantity=${quantity}`).toBe(400);
		}
	});

	it('refuses a request with no token', async () => {
		const res = await actions.act(request({ quantity: '9', idempotencyKey: 'k' }) as never);
		expect(status(res)).toBe(400);
	});

	it('returns the executor result for the edited quantity', async () => {
		const card = result(
			await actions.act(
				request({ token: 'tok_suggestion_0771', quantity: '9', idempotencyKey: 'k2' }) as never
			)
		);
		expect(card.title).toMatch(/^PO-/);
		expect(card.detail).toContain('9 kg');
	});

	it('refuses a negative line on a grouped order', async () => {
		const form = new FormData();
		form.append('token', 'tok');
		form.append('line', 'p4');
		form.append('qty-p4', '-1');
		const res = await actions.act({
			fetch: globalThis.fetch,
			request: new Request('http://x', { method: 'POST', body: form })
		} as never);
		expect(status(res)).toBe(400);
	});
});

describe('waste', () => {
	it('refuses an item without a destination', async () => {
		const form = new FormData();
		form.append('token', 'tok');
		form.append('item', 'i1');
		form.append('qty-i1', '2');
		const res = await actions.waste({
			fetch: globalThis.fetch,
			request: new Request('http://x', { method: 'POST', body: form })
		} as never);
		expect(status(res)).toBe(400);
	});

	it('skips an item marked "not one of our products"', async () => {
		const form = new FormData();
		form.append('token', 'tok');
		form.append('item', 'i3');
		form.append('pick-i3', 'none');
		const res = await actions.waste({
			fetch: globalThis.fetch,
			request: new Request('http://x', { method: 'POST', body: form })
		} as never);
		// Nothing left to record once the only item is skipped.
		expect(status(res)).toBe(400);
	});
});

describe('send a message', () => {
	it('refuses an empty message', async () => {
		expect(
			status(
				await actions.send({ ...request({ message: '   ' }), params: { topic: 'stock' } } as never)
			)
		).toBe(400);
	});
});

describe('photo', () => {
	it('refuses a submit with no photo', async () => {
		expect(status(await actions.photo(request({}) as never))).toBe(400);
	});
});
