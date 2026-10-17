import { stock } from '#lib/server/api/catalogue.js';

export const load = async ({ fetch }) => ({
	list: await stock(fetch)
});
