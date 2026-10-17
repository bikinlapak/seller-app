import { error, fail } from '@sveltejs/kit';
import { runAction, thread } from '#lib/server/api/assistant.js';
import type { Message } from '#lib/types/api.js';

export const load = async ({ fetch, params }) => {
	const data = await thread(fetch, params.topic);
	if (!data) error(404, 'Thread not found');
	return { thread: data };
};

export const actions = {
	/*
	 * Approve, or approve an edited quantity. Every write to worksh.io goes
	 * through a single-use action token: no AI path writes on its own. The
	 * backend verifies the token, the tenant and the quantity cap; here we
	 * only forward the merchant's tap along with its idempotency key.
	 */
	act: async ({ fetch, request }) => {
		const form = await request.formData();
		const token = String(form.get('token') ?? '');
		const quantity = Number(form.get('quantity') ?? 0);
		const unit = String(form.get('unit') ?? '');
		const idempotencyKey = String(form.get('idempotencyKey') ?? '');

		if (!token || !Number.isFinite(quantity) || quantity < 1) {
			return fail(400, { message: 'Invalid quantity.' });
		}

		const result = await runAction(fetch, token, quantity, unit, idempotencyKey);
		if (!result) return fail(502, { message: 'Could not reach worksh.io. Try again.' });

		/*
		 * The backend stores the messages and pushes them over SSE. We return
		 * the result card and the system note so the thread fills immediately
		 * rather than waiting for a round trip.
		 */
		const added: Message[] = [
			{
				id: `sys-${idempotencyKey}`,
				author: 'system',
				type: 'note',
				time: '',
				text: `You approved ${quantity} ${unit}`
			},
			{
				id: `res-${idempotencyKey}`,
				author: 'agent',
				type: 'result_card',
				time: 'Just now',
				card: result
			}
		];
		return { added };
	},

	reject: async ({ request }) => {
		const form = await request.formData();
		const idempotencyKey = String(form.get('idempotencyKey') ?? '');
		const added: Message[] = [
			{
				id: `sys-${idempotencyKey}`,
				author: 'system',
				type: 'note',
				time: '',
				text: 'You rejected this suggestion'
			}
		];
		return { added };
	},

	/* Send a free-text message. The real answer arrives from the agent over SSE. */
	send: async ({ request }) => {
		const form = await request.formData();
		const text = String(form.get('message') ?? '').trim();
		if (!text) return fail(400, { message: 'Empty message.' });
		const added: Message[] = [
			{ id: `me-${Date.now()}`, author: 'staff', type: 'text', time: 'Just now', text }
		];
		return { added };
	}
};
