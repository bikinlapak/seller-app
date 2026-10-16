import { PENGATURAN_AI, PRODUK, STOK } from '#lib/mock/fixtures.js';
import type { DaftarProduk, DaftarStok, PengaturanAI } from '#lib/types/api.js';
import { ambil } from './http.js';

export function produk(fetch: typeof globalThis.fetch): Promise<DaftarProduk | null> {
	return ambil<DaftarProduk>(fetch, '/v1/products', () => PRODUK);
}

export function stok(fetch: typeof globalThis.fetch): Promise<DaftarStok | null> {
	return ambil<DaftarStok>(fetch, '/v1/stock', () => STOK);
}

export function pengaturanAI(fetch: typeof globalThis.fetch): Promise<PengaturanAI | null> {
	return ambil<PengaturanAI>(fetch, '/v1/assistant/settings', () => PENGATURAN_AI);
}
