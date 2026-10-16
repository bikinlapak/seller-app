import { home } from '#lib/server/api/asisten.js';

export const load = async ({ fetch }) => ({
	home: await home(fetch)
});
