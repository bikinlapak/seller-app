import { SELLER_SVC_URL } from '$app/env/private';

// Semua panggilan ke seller-svc lewat sini, dan hanya dari sisi server
// (load/actions), supaya alamat internal layanan tidak bocor ke browser.
export function sellerSvcUrl(path: string): string {
	return `${SELLER_SVC_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export type Health = { status: string; version: string };

/** `null` kalau seller-svc tidak bisa dihubungi — halaman tetap tampil. */
export async function fetchHealth(fetch: typeof globalThis.fetch): Promise<Health | null> {
	try {
		const res = await fetch(sellerSvcUrl('/healthz'));
		return res.ok ? ((await res.json()) as Health) : null;
	} catch {
		return null;
	}
}
