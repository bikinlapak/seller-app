import { products } from '#lib/server/api/catalogue.js';

export const load = async ({ fetch }) => ({
	list: await products(fetch)
});
