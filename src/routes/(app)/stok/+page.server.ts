import { stok } from '#lib/server/api/katalog.js';

export const load = async ({ fetch }) => ({
	daftar: await stok(fetch)
});
