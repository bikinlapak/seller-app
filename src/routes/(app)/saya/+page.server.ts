import { pengaturanAI } from '#lib/server/api/katalog.js';

export const load = async ({ fetch }) => ({
	pengaturan: await pengaturanAI(fetch)
});
