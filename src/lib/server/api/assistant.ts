import { HOME, THREADS } from '#lib/mock/fixtures.js';
import type { AssistantHome, ResultCard, Thread } from '#lib/types/api.js';
import { get, send, type Result } from './http.js';

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

/** What a card's form submits with its token. The executor checks all of it. */
export type ActionBody = {
	quantity?: number;
	lines?: { productId: string; quantity: number }[];
	items?: { itemId: string; quantity: number; destination: string; productId?: string }[];
	checklist?: Record<string, boolean>;
	recipientId?: string;
	pickupWindow?: string;
};

/**
 * Run an action from a card. The backend verifies the token, the tenant,
 * the caps and single use; we forward the merchant's tap and its idempotency
 * key, so a retry on a bad connection cannot write twice.
 */
export function runAction(
	fetch: typeof globalThis.fetch,
	token: string,
	body: ActionBody,
	idempotencyKey: string
): Promise<Result<ResultCard>> {
	return send<ResultCard>(fetch, 'POST', `/v1/actions/${encodeURIComponent(token)}`, body, {
		idempotencyKey,
		mock: () => ({
			title: 'PO-0772 submitted',
			detail: `${body.quantity ?? 0} kg Bread Flour · Tepung Jaya · arrives Tuesday`,
			waUrl: 'https://wa.me/6281200000001',
			links: [{ label: 'View product', href: '/products/p7' }]
		})
	});
}

export function rejectAction(
	fetch: typeof globalThis.fetch,
	token: string
): Promise<Result<ResultCard>> {
	return send<ResultCard>(fetch, 'POST', `/v1/actions/${encodeURIComponent(token)}/reject`, {});
}

/** The merchant writes; the reply comes back in the updated thread. */
export function sendMessage(
	fetch: typeof globalThis.fetch,
	topic: string,
	text: string
): Promise<Result<Thread>> {
	return send<Thread>(fetch, 'POST', '/v1/assistant/messages', { topic, text });
}

export function reportAnswer(
	fetch: typeof globalThis.fetch,
	topic: string,
	messageId: string
): Promise<Result<{ queued: number }>> {
	return send(fetch, 'POST', '/v1/assistant/report', { topic, messageId, reason: '' });
}

/**
 * Raw image bytes (already re-encoded on the device, metadata stripped).
 * A waste photo goes to the leftovers flow, a stock photo to the count.
 */
export function uploadPhoto(
	fetch: typeof globalThis.fetch,
	purpose: 'waste' | 'stock',
	bytes: Uint8Array
): Promise<Result<{ sessionId: string; photoId: string; detected: number }>> {
	const path = purpose === 'stock' ? '/v1/stock/photos' : '/v1/waste/photos';
	return send(fetch, 'POST', path, bytes);
}
