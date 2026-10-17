import { HOME, THREADS } from '#lib/mock/fixtures.js';
import type { AssistantHome, ResultCard, Thread } from '#lib/types/api.js';
import { get, post } from './http.js';

export function home(fetch: typeof globalThis.fetch): Promise<AssistantHome | null> {
	return get<AssistantHome>(fetch, '/v1/home', () => HOME);
}

export function thread(
	fetch: typeof globalThis.fetch,
	topic: string
): Promise<Thread | null | undefined> {
	return get<Thread | undefined>(
		fetch,
		`/v1/assistant/thread?topic=${encodeURIComponent(topic)}`,
		() => THREADS[topic]
	);
}

export const TOPICS = Object.keys(THREADS);

/**
 * Run an action from a suggestion card. The backend verifies the token and
 * the quantity cap; in mock mode we shape the same result card the executor
 * would return.
 */
export function runAction(
	fetch: typeof globalThis.fetch,
	token: string,
	quantity: number,
	unit: string,
	idempotencyKey: string
): Promise<ResultCard | null> {
	return post<ResultCard>(
		fetch,
		`/v1/actions/${encodeURIComponent(token)}`,
		{ quantity },
		idempotencyKey,
		() => ({
			title: 'PO-0771 created',
			detail: `${quantity} ${unit} · Sumber Kopi · arrives Wednesday`,
			waUrl: `https://wa.me/?text=${encodeURIComponent(
				`Hello Sumber Kopi, we'd like to order ${quantity} ${unit} of Arabica (PO-0771).`
			)}`,
			poHref: '/stock/s1'
		})
	);
}
