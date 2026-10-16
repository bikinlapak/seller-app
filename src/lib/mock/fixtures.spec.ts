import { describe, expect, it } from 'vitest';
import { HOME, PENGATURAN_AI, PRODUK, STOK, THREADS } from './fixtures.js';
import type { Kondisi } from '#lib/types/api.js';

/*
 * Data tiruan adalah satu-satunya tempat bentuk respons seller-svc ditulis
 * lengkap, jadi tes ini merangkap sebagai tes kontrak: kalau backend mengganti
 * nama field, fixture ikut berubah dan tes di sini yang gagal lebih dulu.
 */

const KONDISI: Kondisi[] = ['aman', 'hampir', 'lewat'];

describe('beranda asisten', () => {
	it('tiap baris perhatian menunjuk thread yang ada', () => {
		for (const p of HOME.perhatian) {
			expect(p.href.startsWith('/asisten/')).toBe(true);
			expect(THREADS[p.href.replace('/asisten/', '')]).toBeDefined();
		}
	});

	it('tiap perintah cepat menunjuk thread yang ada', () => {
		for (const p of HOME.perintah) {
			expect(THREADS[p.href.replace('/asisten/', '')]).toBeDefined();
		}
	});
});

describe('thread', () => {
	it('semua pesan punya id unik', () => {
		for (const [topik, t] of Object.entries(THREADS)) {
			const ids = t.pesan.map((p) => p.id);
			expect(new Set(ids).size, topik).toBe(ids.length);
		}
	});

	it('kartu saran membawa token dan batas jumlah', () => {
		const kartu = THREADS.pesan.pesan.find((p) => p.tipe === 'kartu_saran');
		expect(kartu).toBeDefined();
		if (kartu?.tipe !== 'kartu_saran') throw new Error('tipe tidak cocok');
		expect(kartu.kartu.token).toBeTruthy();
		expect(kartu.kartu.jumlah).toBeGreaterThan(0);
	});

	it('kotak deteksi foto tetap di dalam bidang foto', () => {
		const foto = THREADS.sisa.pesan.find((p) => p.tipe === 'foto');
		if (foto?.tipe !== 'foto') throw new Error('tipe tidak cocok');
		for (const k of foto.kotak) {
			expect(k.x + k.w).toBeLessThanOrEqual(100);
			expect(k.y + k.h).toBeLessThanOrEqual(100);
		}
	});

	it('barang lewat tanggal tidak menawarkan donasi atau jual', () => {
		const kartu = THREADS.sisa.pesan.find((p) => p.tipe === 'kartu_sisa');
		if (kartu?.tipe !== 'kartu_sisa') throw new Error('tipe tidak cocok');
		for (const b of kartu.kartu.barang.filter((x) => x.kondisi === 'lewat')) {
			const ids = b.tujuan.map((t) => t.id);
			expect(ids).not.toContain('donasi');
			expect(ids).not.toContain('spesial');
			expect(b.peringatan).toBeTruthy();
		}
	});

	it('"Buang" tidak pernah terpilih otomatis', () => {
		const kartu = THREADS.sisa.pesan.find((p) => p.tipe === 'kartu_sisa');
		if (kartu?.tipe !== 'kartu_sisa') throw new Error('tipe tidak cocok');
		for (const b of kartu.kartu.barang) {
			expect(b.tujuan.find((t) => t.id === 'buang')?.dipilih ?? false).toBe(false);
		}
	});

	it('tepat satu tujuan terpilih per barang', () => {
		const kartu = THREADS.sisa.pesan.find((p) => p.tipe === 'kartu_sisa');
		if (kartu?.tipe !== 'kartu_sisa') throw new Error('tipe tidak cocok');
		for (const b of kartu.kartu.barang) {
			expect(b.tujuan.filter((t) => t.dipilih)).toHaveLength(1);
		}
	});
});

describe('produk & stok', () => {
	it('kondisi stok selalu salah satu nilai yang dikenal', () => {
		for (const p of PRODUK.produk) expect(KONDISI).toContain(p.stokKondisi);
		for (const b of STOK.baris) expect(KONDISI).toContain(b.kondisi);
	});

	it('persen bar stok masuk rentang 0-100', () => {
		for (const b of STOK.baris) {
			expect(b.persen).toBeGreaterThanOrEqual(0);
			expect(b.persen).toBeLessThanOrEqual(100);
		}
	});

	it('produk tanpa harga punya subjudul penjelas', () => {
		for (const p of PRODUK.produk) {
			if (p.hargaLabel === null) expect(p.subjudul).toBeTruthy();
		}
	});
});

describe('pengaturan AI', () => {
	it('mode terpilih ada di daftar mode', () => {
		expect(PENGATURAN_AI.mode.map((m) => m.id)).toContain(PENGATURAN_AI.modeDipilih);
	});

	it('bahasa terpilih ada di daftar pilihan', () => {
		expect(PENGATURAN_AI.bahasa.pilihan).toContain(PENGATURAN_AI.bahasa.dipilih);
	});

	it('prediksi stok ditandai sebagai hitungan sistem, bukan chat', () => {
		const prediksi = PENGATURAN_AI.model.find((m) => m.tugas === 'Prediksi stok');
		expect(prediksi?.sistem).toBe(true);
	});
});
