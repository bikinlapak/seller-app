import { fail, redirect } from '@sveltejs/kit';
import { home, sendMessage } from '#lib/server/api/assistant.js';

export const load = async ({ fetch }) => ({
	home: await home(fetch)
});

/*
 * A message typed on the home screen goes to the thread that can answer it.
 * Plain keyword routing: the answer itself is computed in seller-svc, and
 * every thread falls back to "here is what I can help with".
 */
const ROUTES: [RegExp, string][] = [
	[/expir|discount|markdown|kadaluarsa/i, 'expiry'],
	[/leftover|waste|thrown|sisa makanan|buang/i, 'waste'],
	[/donat/i, 'donation'],
	[/special|menu|idea/i, 'special'],
	[/order|reorder|why|supplier|closed|libur|tutup|po\b/i, 'reorder'],
	[/report|week|impact|laporan/i, 'report'],
	[/open|hour|jam/i, 'shop']
];

function topicFor(text: string): string {
	return ROUTES.find(([re]) => re.test(text))?.[1] ?? 'stock';
}

export const actions = {
	send: async ({ fetch, request }) => {
		const text = String((await request.formData()).get('message') ?? '').trim();
		if (!text) return fail(400, { message: 'Empty message.' });
		const topic = topicFor(text);
		const res = await sendMessage(fetch, topic, text);
		if (!res.ok) return fail(res.status, { message: res.error.message });
		redirect(303, `/assistant/${topic}`);
	}
};
