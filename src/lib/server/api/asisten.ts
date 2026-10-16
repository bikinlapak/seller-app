import { HOME, THREADS } from '#lib/mock/fixtures.js';
import type { AsistenHome, KartuHasil, Thread } from '#lib/types/api.js';
import { ambil, kirim } from './http.js';

export function home(fetch: typeof globalThis.fetch): Promise<AsistenHome | null> {
	return ambil<AsistenHome>(fetch, '/v1/home', () => HOME);
}

export function thread(
	fetch: typeof globalThis.fetch,
	topik: string
): Promise<Thread | null | undefined> {
	return ambil<Thread | undefined>(
		fetch,
		`/v1/assistant/thread?topik=${encodeURIComponent(topik)}`,
		() => THREADS[topik]
	);
}

export const TOPIK = Object.keys(THREADS);

/**
 * Jalankan aksi dari kartu saran. Backend memverifikasi token dan batas jumlah;
 * di mode tiruan kita bentuk kartu hasil yang sama seperti executor.
 */
export function jalankanAksi(
	fetch: typeof globalThis.fetch,
	token: string,
	jumlah: number,
	satuan: string,
	idempotencyKey: string
): Promise<KartuHasil | null> {
	return kirim<KartuHasil>(
		fetch,
		`/v1/actions/${encodeURIComponent(token)}`,
		{ jumlah },
		idempotencyKey,
		() => ({
			judul: 'PO-0771 dibuat',
			detail: `${jumlah} ${satuan} · CV Sumber Kopi · tiba Rabu`,
			waUrl: `https://wa.me/?text=${encodeURIComponent(
				`Halo CV Sumber Kopi, kami pesan Kopi Arabika ${jumlah} ${satuan} (PO-0771).`
			)}`,
			poHref: '/stok/st1'
		})
	);
}
