import { passthrough } from '#lib/server/api/http.js';

/* A waste photo kept as evidence, served through the app (seller-svc is private). */
export const GET = ({ fetch, params }) =>
	passthrough(fetch, `/v1/photos/${encodeURIComponent(params.id)}`);
