import { error, fail } from '@sveltejs/kit';
import { jalankanAksi, thread } from '#lib/server/api/asisten.js';
import type { Pesan } from '#lib/types/api.js';

export const load = async ({ fetch, params }) => {
	const data = await thread(fetch, params.topik);
	if (!data) error(404, 'Thread tidak ditemukan');
	return { thread: data };
};

export const actions = {
	/*
	 * Setujui / ubah jumlah. Setiap tulisan ke worksh.io lewat token aksi sekali
	 * pakai: tidak ada jalur AI yang bisa menulis sendiri. Backend yang
	 * memverifikasi token, tenant, dan batas jumlah — di sini kita hanya
	 * meneruskan ketukan penjual beserta kunci idempotennya.
	 */
	aksi: async ({ fetch, request }) => {
		const form = await request.formData();
		const token = String(form.get('token') ?? '');
		const jumlah = Number(form.get('jumlah') ?? 0);
		const satuan = String(form.get('satuan') ?? '');
		const idem = String(form.get('idem') ?? '');

		if (!token || !Number.isFinite(jumlah) || jumlah < 1) {
			return fail(400, { pesan: 'Jumlah tidak sah.' });
		}

		const hasil = await jalankanAksi(fetch, token, jumlah, satuan, idem);
		if (!hasil) return fail(502, { pesan: 'Gagal mengirim ke worksh.io. Coba lagi.' });

		/*
		 * Backend yang menyimpan pesan dan mengirimkannya lewat SSE. Kita
		 * kembalikan kartu hasil + tanda sistem supaya thread langsung terisi
		 * tanpa menunggu putaran SSE.
		 */
		const tambahan: Pesan[] = [
			{
				id: `sys-${idem}`,
				penulis: 'sistem',
				tipe: 'tanda',
				waktu: '',
				teks: `Kamu menyetujui ${jumlah} ${satuan}`
			},
			{ id: `res-${idem}`, penulis: 'agent', tipe: 'kartu_hasil', waktu: 'Baru saja', kartu: hasil }
		];
		return { tambahan };
	},

	tolak: async ({ request }) => {
		const form = await request.formData();
		const idem = String(form.get('idem') ?? '');
		const tambahan: Pesan[] = [
			{
				id: `sys-${idem}`,
				penulis: 'sistem',
				tipe: 'tanda',
				waktu: '',
				teks: 'Kamu menolak saran ini'
			}
		];
		return { tambahan };
	},

	/* Kirim pesan bebas. Jawaban sebenarnya datang dari agent lewat SSE. */
	kirim: async ({ request }) => {
		const form = await request.formData();
		const teks = String(form.get('pesan') ?? '').trim();
		if (!teks) return fail(400, { pesan: 'Pesan kosong.' });
		const tambahan: Pesan[] = [
			{ id: `me-${Date.now()}`, penulis: 'staff', tipe: 'teks', waktu: 'Baru saja', teks }
		];
		return { tambahan };
	}
};
