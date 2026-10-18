/*
 * CSRF check for every state-changing request, replacing SvelteKit's built-in
 * one (disabled with `csrf.trustedOrigins: ['*']` in vite.config.ts).
 *
 * Why: SvelteKit 3 compares only the `Origin` header, but current Chrome sends
 * a same-origin `fetch` POST — which is how `use:enhance` submits — with
 * `Sec-Fetch-Site: same-origin` and no `Origin` at all. Every enhanced form
 * then failed with 403. Fetch Metadata is the stronger signal anyway: the
 * browser sets it and page script cannot.
 *
 * Rule: a matching `Origin` passes; with no `Origin`, `Sec-Fetch-Site` must be
 * `same-origin`; with neither header the request is refused.
 */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function isCrossSite(request: Request, selfOrigin: string): boolean {
	if (SAFE_METHODS.has(request.method)) return false;

	const origin = request.headers.get('origin');
	if (origin) return origin !== selfOrigin;

	return request.headers.get('sec-fetch-site') !== 'same-origin';
}
