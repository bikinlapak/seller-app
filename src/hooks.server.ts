import type { Handle } from '@sveltejs/kit/hooks';
import { isCrossSite } from '#lib/server/csrf.js';

export const handle: Handle = async ({ event, resolve }) => {
	if (isCrossSite(event.request, event.url.origin)) {
		const message = `Cross-site ${event.request.method} form submissions are forbidden`;
		return event.request.headers.get('accept') === 'application/json'
			? Response.json({ message }, { status: 403 })
			: new Response(message, { status: 403 });
	}
	return resolve(event);
};
