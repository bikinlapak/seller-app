import { aiSettings } from '#lib/server/api/catalogue.js';

export const load = async ({ fetch }) => ({
	settings: await aiSettings(fetch)
});
