import { SELLER_SVC_AUDIENCE, SELLER_SVC_MOCK, SELLER_SVC_URL } from '$app/env/private';
import type { ApiError } from '#lib/types/api.js';

/*
 * The only door to seller-svc, and it is called from the server side alone
 * (load functions and form actions), so the service's internal address never
 * reaches the browser.
 *
 * While SELLER_SVC_MOCK is on, `get` and `post` touch no network and return
 * fixtures. The real path is written and exercised as soon as the flag is
 * off — see ../../../../docs/plan/02-routing.md.
 */
export const useMocks = SELLER_SVC_MOCK;

export function sellerSvcUrl(path: string): string {
	return `${SELLER_SVC_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/*
 * On Cloud Run, seller-svc admits no caller without IAM — /v1/actions must not
 * be reachable from the internet. So seller-app exchanges its runtime identity
 * for an ID token at the metadata server and sends it as a bearer.
 *
 * Locally SELLER_SVC_AUDIENCE is empty, there is no metadata server, and a
 * local seller-svc asks for nothing — so this whole path is skipped.
 */
const METADATA_ID_TOKEN =
	'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';

let cached: { value: string; expiresAt: number } | null = null;

/** Read `exp` from the JWT payload; `0` if it cannot be parsed. */
function expiryOf(jwt: string): number {
	try {
		const payload = jwt.split('.')[1];
		const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
		return typeof json.exp === 'number' ? json.exp * 1000 : 0;
	} catch {
		return 0;
	}
}

async function idToken(fetch: typeof globalThis.fetch): Promise<string | null> {
	if (!SELLER_SVC_AUDIENCE) return null;

	// Refresh a minute early, so no request leaves with a token that expires
	// in flight.
	if (cached && Date.now() < cached.expiresAt - 60_000) {
		return cached.value;
	}

	try {
		const res = await fetch(
			`${METADATA_ID_TOKEN}?audience=${encodeURIComponent(SELLER_SVC_AUDIENCE)}`,
			{ headers: { 'Metadata-Flavor': 'Google' } }
		);
		if (!res.ok) return null;

		const value = (await res.text()).trim();
		if (!value) return null;

		// If exp cannot be read, keep it for 45 minutes (metadata tokens last
		// an hour) — better to ask often than to use a dead token.
		const expiresAt = expiryOf(value) || Date.now() + 45 * 60_000;
		cached = { value, expiresAt };
		return value;
	} catch {
		return null;
	}
}

async function authHeader(fetch: typeof globalThis.fetch): Promise<Record<string, string>> {
	const token = await idToken(fetch);
	return token ? { authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch one resource. `mock` is only called when mock mode is on, so fixtures
 * do not travel into a production bundle along this path.
 *
 * A failure to reach the backend returns `null` rather than throwing: the page
 * still renders and the empty section shows a quiet retry.
 */
export async function get<T>(
	fetch: typeof globalThis.fetch,
	path: string,
	mock: () => T
): Promise<T | null> {
	if (useMocks) return mock();
	try {
		const res = await fetch(sellerSvcUrl(path), { headers: await authHeader(fetch) });
		return res.ok ? ((await res.json()) as T) : null;
	} catch {
		return null;
	}
}

export type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: ApiError };

const UNREACHABLE: ApiError = {
	code: 'unreachable',
	message: 'Could not reach the shop assistant. Try again.'
};

/**
 * Send a write and keep the backend's error. Form actions show
 * `error.message` to the merchant ("food-safety checklist incomplete: …"),
 * so unlike `get` a failure is not flattened to `null`.
 */
export async function send<T>(
	fetch: typeof globalThis.fetch,
	method: 'POST' | 'PUT',
	path: string,
	body: unknown,
	opts: { idempotencyKey?: string; mock?: () => T } = {}
): Promise<Result<T>> {
	if (useMocks) {
		return opts.mock
			? { ok: true, data: opts.mock() }
			: { ok: false, status: 501, error: { code: 'mock', message: 'Not available in mock mode.' } };
	}
	try {
		const raw = body instanceof Uint8Array;
		const res = await fetch(sellerSvcUrl(path), {
			method,
			headers: {
				'content-type': raw ? 'application/octet-stream' : 'application/json',
				...(opts.idempotencyKey ? { 'idempotency-key': opts.idempotencyKey } : {}),
				...(await authHeader(fetch))
			},
			body: raw ? new Blob([body as Uint8Array<ArrayBuffer>]) : JSON.stringify(body)
		});
		const json = await res.json().catch(() => null);
		if (res.ok) return { ok: true, data: json as T };
		const error: ApiError = json?.error ?? { code: 'http_' + res.status, message: res.statusText };
		return { ok: false, status: res.status, error };
	} catch {
		return { ok: false, status: 502, error: UNREACHABLE };
	}
}

/** Pass a binary response (a photo, a receipt PDF) straight through. */
export async function passthrough(fetch: typeof globalThis.fetch, path: string): Promise<Response> {
	if (useMocks) return new Response('Not available in mock mode', { status: 404 });
	try {
		const res = await fetch(sellerSvcUrl(path), { headers: await authHeader(fetch) });
		const headers = new Headers();
		for (const h of ['content-type', 'content-disposition', 'cache-control']) {
			const v = res.headers.get(h);
			if (v) headers.set(h, v);
		}
		return new Response(res.body, { status: res.status, headers });
	} catch {
		return new Response('Unavailable', { status: 502 });
	}
}

/** The live-update stream for one thread, proxied as-is (SSE). */
export async function stream(
	fetch: typeof globalThis.fetch,
	path: string,
	signal: AbortSignal
): Promise<Response> {
	if (useMocks) return new Response(null, { status: 204 });
	try {
		const res = await fetch(sellerSvcUrl(path), { headers: await authHeader(fetch), signal });
		return new Response(res.body, {
			status: res.status,
			headers: {
				'content-type': 'text/event-stream',
				'cache-control': 'no-cache',
				'x-accel-buffering': 'no'
			}
		});
	} catch {
		return new Response(null, { status: 502 });
	}
}

export type Health = { status: string; version: string };

/** `null` when seller-svc cannot be reached — the page still renders. */
export async function fetchHealth(fetch: typeof globalThis.fetch): Promise<Health | null> {
	if (useMocks) return { status: 'mock', version: 'mock' };
	try {
		const res = await fetch(sellerSvcUrl('/healthz'), { headers: await authHeader(fetch) });
		return res.ok ? ((await res.json()) as Health) : null;
	} catch {
		return null;
	}
}
