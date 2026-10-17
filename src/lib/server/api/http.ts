import { SELLER_SVC_AUDIENCE, SELLER_SVC_MOCK, SELLER_SVC_URL } from '$app/env/private';

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

/** Send an action (approve / edit / reject). The form action uses the result. */
export async function post<T>(
	fetch: typeof globalThis.fetch,
	path: string,
	body: unknown,
	idempotencyKey: string,
	mock: () => T
): Promise<T | null> {
	if (useMocks) return mock();
	try {
		const res = await fetch(sellerSvcUrl(path), {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'idempotency-key': idempotencyKey,
				...(await authHeader(fetch))
			},
			body: JSON.stringify(body)
		});
		return res.ok ? ((await res.json()) as T) : null;
	} catch {
		return null;
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
