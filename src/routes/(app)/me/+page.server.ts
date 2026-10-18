import { fail } from '@sveltejs/kit';
import { aiSettings, saveSettings } from '#lib/server/api/catalogue.js';

export const load = async ({ fetch }) => ({
	settings: await aiSettings(fetch)
});

export const actions = {
	/*
	 * The whole form is saved at once: mode, every autonomy switch (an
	 * unchecked box sends nothing, so absence means off) and the language.
	 */
	save: async ({ fetch, request }) => {
		const form = await request.formData();
		const known = form.getAll('autonomyId').map(String);
		const on = new Set(form.getAll('autonomy').map(String));
		const res = await saveSettings(fetch, {
			selectedMode: String(form.get('mode') ?? '') || undefined,
			language: String(form.get('language') ?? '') || undefined,
			autonomy: Object.fromEntries(known.map((id) => [id, on.has(id)]))
		});
		if (!res.ok) return fail(res.status, { message: res.error.message });
		return { saved: true };
	}
};
