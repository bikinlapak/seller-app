import { fetchHealth } from '#lib/server/seller-svc.js';

export const load = async ({ fetch }) => ({
	health: await fetchHealth(fetch)
});
