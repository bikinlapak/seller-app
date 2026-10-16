import { produk } from '#lib/server/api/katalog.js';

export const load = async ({ fetch }) => ({
	daftar: await produk(fetch)
});
