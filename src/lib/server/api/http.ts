import { SELLER_SVC_AUDIENCE, SELLER_SVC_MOCK, SELLER_SVC_URL } from '$app/env/private';

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

/*
 * Di Cloud Run, seller-svc tidak mengizinkan pemanggil tanpa IAM — endpoint
 * /v1/actions tidak boleh bisa dijangkau dari internet. Jadi seller-app
 * menukar identitas runtime-nya dengan ID token lewat metadata server, lalu
 * mengirimkannya sebagai bearer.
 *
 * Di lokal SELLER_SVC_AUDIENCE kosong, tidak ada metadata server, dan
 * seller-svc memang tidak meminta apa-apa — jadi seluruh jalur ini dilewati.
 */
const METADATA_ID_TOKEN =
	'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';

let tokenTersimpan: { nilai: string; kedaluwarsa: number } | null = null;

/** Ambil `exp` dari payload JWT; `0` kalau tidak terbaca. */
function kedaluwarsaToken(jwt: string): number {
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

	// Perbarui satu menit sebelum habis, supaya tidak ada permintaan yang
	// berangkat dengan token yang kedaluwarsa di tengah jalan.
	if (tokenTersimpan && Date.now() < tokenTersimpan.kedaluwarsa - 60_000) {
		return tokenTersimpan.nilai;
	}

	try {
		const res = await fetch(
			`${METADATA_ID_TOKEN}?audience=${encodeURIComponent(SELLER_SVC_AUDIENCE)}`,
			{ headers: { 'Metadata-Flavor': 'Google' } }
		);
		if (!res.ok) return null;

		const nilai = (await res.text()).trim();
		if (!nilai) return null;

		// Kalau exp tidak terbaca, simpan 45 menit saja (token metadata
		// berumur satu jam) — lebih baik sering meminta daripada memakai
		// token mati.
		const exp = kedaluwarsaToken(nilai) || Date.now() + 45 * 60_000;
		tokenTersimpan = { nilai, kedaluwarsa: exp };
		return nilai;
	} catch {
		return null;
	}
}

async function header(fetch: typeof globalThis.fetch): Promise<Record<string, string>> {
	const token = await idToken(fetch);
	return token ? { authorization: `Bearer ${token}` } : {};
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
		const res = await fetch(sellerSvcUrl(path), { headers: await header(fetch) });
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
			headers: {
				'content-type': 'application/json',
				'idempotency-key': idempotencyKey,
				...(await header(fetch))
			},
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
		const res = await fetch(sellerSvcUrl('/healthz'), { headers: await header(fetch) });
		return res.ok ? ((await res.json()) as Health) : null;
	} catch {
		return null;
	}
}
