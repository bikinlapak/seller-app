import { stream } from '#lib/server/api/http.js';

/*
 * Live updates for one thread (FR-25). seller-svc is server-side only, so the
 * browser's EventSource connects here and the stream is passed through. The
 * events carry no message content — just "this thread changed" — and the page
 * re-runs its load.
 */
export const GET = ({ fetch, params, request }) =>
	stream(fetch, `/v1/assistant/stream?topic=${encodeURIComponent(params.topic)}`, request.signal);
