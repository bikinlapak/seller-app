import { home } from '#lib/server/api/assistant.js';

export const load = async ({ fetch }) => ({
	home: await home(fetch)
});
