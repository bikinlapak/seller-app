import { error } from '@sveltejs/kit';
import { product } from '#lib/server/api/catalogue.js';

export const load = async ({ fetch, params }) => {
	const detail = await product(fetch, params.id);
	if (!detail) error(404, 'Product not found');
	return { detail };
};
