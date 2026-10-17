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

type TestMessage = {
	author: string;
	type: string;
	text?: string;
	card?: { detail: string; waUrl: string };
};

function added(res: unknown): TestMessage[] {
	if (typeof res !== 'object' || res === null || !('added' in res)) {
		throw new Error('the action returned no messages');
	}
	return (res as { added: TestMessage[] }).added;
}

describe('approve', () => {
	it('refuses a zero or non-numeric quantity', async () => {
		for (const quantity of ['0', '-3', 'abc', '']) {
			const res = await actions.act(
				request({ token: 'tok', quantity, unit: 'kg', idempotencyKey: 'k' }) as never
			);
			expect(status(res), `quantity=${quantity}`).toBe(400);
		}
	});

	it('refuses a request with no token', async () => {
		const res = await actions.act(
			request({ quantity: '9', unit: 'kg', idempotencyKey: 'k' }) as never
		);
		expect(status(res)).toBe(400);
	});

	it('carries the edited quantity into the result card', async () => {
		const messages = added(
			await actions.act(
				request({
					token: 'tok_suggestion_0771_9',
					quantity: '9',
					unit: 'kg',
					idempotencyKey: 'k2'
				}) as never
			)
		);
		expect(messages).toHaveLength(2);

		const [note, result] = messages;
		expect(note.author).toBe('system');
		expect(note.text).toBe('You approved 9 kg');
		expect(result.type).toBe('result_card');
		expect(result.card?.detail).toContain('9 kg');
		// The supplier message carries the final quantity, not the proposed one.
		expect(decodeURIComponent(result.card?.waUrl ?? '')).toContain('9 kg');
	});
});

describe('reject', () => {
	it('records the rejection without writing anything', async () => {
		const messages = added(await actions.reject(request({ idempotencyKey: 'k3' }) as never));
		expect(messages).toHaveLength(1);
		expect(messages[0].author).toBe('system');
		expect(messages[0].text).toContain('rejected');
	});
});

describe('send a message', () => {
	it('refuses an empty message', async () => {
		expect(status(await actions.send(request({ message: '   ' }) as never))).toBe(400);
	});

	it('appends the merchant message to the thread', async () => {
		const messages = added(await actions.send(request({ message: 'how much oat milk?' }) as never));
		expect(messages[0].author).toBe('staff');
		expect(messages[0].text).toBe('how much oat milk?');
	});
});
