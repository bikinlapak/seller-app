import { SELLER_SVC_MOCK, SELLER_SVC_URL } from '$app/env/private';

/*
 * Satu-satunya pintu ke seller-svc, dan hanya dipanggil dari sisi server
 * (load/actions), supaya alamat internal layanan tidak bocor ke browser.
 *
 * Selama SELLER_SVC_MOCK aktif, `ambil` tidak menyentuh jaringan dan
 * mengembalikan data tiruan. Jalur aslinya tetap ada dan dipakai apa adanya
 * begitu endpoint seller-svc berhenti menjawab 501 — lihat
 * ../../../../docs/plan/02-routing.md.
 */
export const pakaiTiruan = SELLER_SVC_MOCK;

export function sellerSvcUrl(path: string): string {
	return `${SELLER_SVC_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Ambil satu sumber daya. `tiruan` dipanggil hanya kalau mode tiruan aktif,
 * jadi fixture tidak ikut ke bundel produksi lewat jalur ini.
 *
 * Gagal menghubungi backend mengembalikan `null`, bukan melempar: halaman
 * tetap tampil dan bagian yang kosong merender tombol coba lagi.
 */
export async function ambil<T>(
	fetch: typeof globalThis.fetch,
	path: string,
	tiruan: () => T
): Promise<T | null> {
	if (pakaiTiruan) return tiruan();
	try {
		const res = await fetch(sellerSvcUrl(path));
		return res.ok ? ((await res.json()) as T) : null;
	} catch {
		return null;
	}
}

/** Kirim aksi (approve/edit/reject). Hasilnya dipakai form action. */
export async function kirim<T>(
	fetch: typeof globalThis.fetch,
	path: string,
	body: unknown,
	idempotencyKey: string,
	tiruan: () => T
): Promise<T | null> {
	if (pakaiTiruan) return tiruan();
	try {
		const res = await fetch(sellerSvcUrl(path), {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
			body: JSON.stringify(body)
		});
		return res.ok ? ((await res.json()) as T) : null;
	} catch {
		return null;
	}
}

export type Health = { status: string; version: string };

/** `null` kalau seller-svc tidak bisa dihubungi — halaman tetap tampil. */
export async function fetchHealth(fetch: typeof globalThis.fetch): Promise<Health | null> {
	if (pakaiTiruan) return { status: 'tiruan', version: 'mock' };
	try {
		const res = await fetch(sellerSvcUrl('/healthz'));
		return res.ok ? ((await res.json()) as Health) : null;
	} catch {
		return null;
	}
}
