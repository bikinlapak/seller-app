import { error, fail } from '@sveltejs/kit';
import {
	reportAnswer,
	rejectAction,
	runAction,
	sendMessage,
	thread,
	uploadWastePhoto,
	type ActionBody
} from '#lib/server/api/assistant.js';

export const load = async ({ fetch, params, depends }) => {
	// The thread page subscribes to the SSE stream and invalidates this key
	// when seller-svc says the thread changed.
	depends('app:thread');
	const data = await thread(fetch, params.topic);
	if (!data) error(404, 'Thread not found');
	return { thread: data };
};

/** Largest photo accepted after on-device resizing; seller-svc allows 8 MB. */
const MAX_PHOTO = 8 * 1024 * 1024;

function str(form: FormData, key: string): string {
	return String(form.get(key) ?? '').trim();
}

function int(form: FormData, key: string): number {
	const n = Number(form.get(key));
	return Number.isInteger(n) ? n : NaN;
}

/*
 * Every write goes through a single-use action token: no AI path writes on
 * its own. seller-svc verifies the token, the tenant, the caps and the
 * checklist; these actions only translate the merchant's form into the
 * request and surface the backend's message when it says no. After any
 * action SvelteKit re-runs `load`, so the thread shows what was stored.
 */
async function act(fetch: typeof globalThis.fetch, form: FormData, body: ActionBody) {
	const token = str(form, 'token');
	const key = str(form, 'idempotencyKey') || crypto.randomUUID();
	if (!token) return fail(400, { message: 'This card has expired. Reload the thread.' });
	const res = await runAction(fetch, token, body, key);
	if (!res.ok) return fail(res.status, { message: res.error.message, code: res.error.code });
	return { result: res.data };
}

export const actions = {
	/* Approve a suggestion: one quantity, or one per line of a grouped PO. */
	act: async ({ fetch, request }) => {
		const form = await request.formData();
		const lineIds = form.getAll('line').map(String);
		if (lineIds.length > 0) {
			const lines = lineIds.map((productId) => ({
				productId,
				quantity: int(form, `qty-${productId}`)
			}));
			if (lines.some((l) => !(l.quantity >= 0))) {
				return fail(400, { message: 'Quantities must be whole numbers.' });
			}
			return act(fetch, form, { lines });
		}
		const quantity = int(form, 'quantity');
		if (!(quantity >= 1)) return fail(400, { message: 'Invalid quantity.' });
		return act(fetch, form, { quantity });
	},

	reject: async ({ fetch, request }) => {
		const form = await request.formData();
		const res = await rejectAction(fetch, str(form, 'token'));
		if (!res.ok) return fail(res.status, { message: res.error.message });
		return { result: res.data };
	},

	/* Waste card: count, product pick and destination per detected item. */
	waste: async ({ fetch, request }) => {
		const form = await request.formData();
		const items: NonNullable<ActionBody['items']> = [];
		for (const itemId of form.getAll('item').map(String)) {
			const pick = str(form, `pick-${itemId}`);
			if (pick === 'none') continue; // "Not one of our products"
			const quantity = int(form, `qty-${itemId}`);
			const destination = str(form, `dest-${itemId}`);
			if (!(quantity >= 1) || !destination) {
				return fail(400, { message: 'Each item needs a count and a destination.' });
			}
			items.push({ itemId, quantity, destination, ...(pick ? { productId: pick } : {}) });
		}
		if (items.length === 0) return fail(400, { message: 'Nothing to record.' });
		return act(fetch, form, { items });
	},

	/* Donation: the checklist is a hard gate here and again in seller-svc. */
	donate: async ({ fetch, request }) => {
		const form = await request.formData();
		const checklist: Record<string, boolean> = {};
		for (const id of form.getAll('check').map(String)) checklist[id] = true;
		return act(fetch, form, {
			checklist,
			recipientId: str(form, 'recipientId'),
			pickupWindow: str(form, 'pickupWindow')
		});
	},

	/* Free text. The answer is computed from stored inputs, not generated. */
	send: async ({ fetch, request, params }) => {
		const form = await request.formData();
		const text = str(form, 'message');
		if (!text) return fail(400, { message: 'Empty message.' });
		const res = await sendMessage(fetch, params.topic, text);
		if (!res.ok) return fail(res.status, { message: res.error.message });
		return { sent: true };
	},

	/* A waste photo. The browser has already re-encoded it without EXIF. */
	photo: async ({ fetch, request }) => {
		const form = await request.formData();
		const file = form.get('photo');
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { message: 'Choose or take a photo first.' });
		}
		if (file.size > MAX_PHOTO) return fail(413, { message: 'That photo is too large.' });
		const res = await uploadWastePhoto(fetch, new Uint8Array(await file.arrayBuffer()));
		if (!res.ok) return fail(res.status, { message: res.error.message });
		return { uploaded: res.data.sessionId };
	},

	/* "Report answer" → moderation queue (Permendag 19/2026 Art. 47). */
	report: async ({ fetch, request, params }) => {
		const form = await request.formData();
		const res = await reportAnswer(fetch, params.topic, str(form, 'messageId'));
		if (!res.ok) return fail(res.status, { message: res.error.message });
		return { reported: str(form, 'messageId') };
	}
};
