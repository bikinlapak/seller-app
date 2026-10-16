import { describe, expect, it, vi } from 'vitest';

/*
 * Tes form action thread. Jalur "setujui" adalah satu-satunya cara tulisan
 * sampai ke worksh.io, jadi yang diuji di sini: jumlah tidak sah ditolak, dan
 * hasil sukses menambah tanda sistem + kartu hasil ke thread.
 *
 * $app/env/private di-mock karena modul itu hanya ada saat SvelteKit build.
 */
vi.mock('$app/env/private', () => ({
	SELLER_SVC_URL: 'http://127.0.0.1:8080',
	SELLER_SVC_MOCK: true
}));

const { actions } = await import('./+page.server.js');

function minta(fields: Record<string, string>) {
	const form = new FormData();
	for (const [k, v] of Object.entries(fields)) form.append(k, v);
	return {
		fetch: globalThis.fetch,
		request: new Request('http://x', { method: 'POST', body: form })
	};
}

/** `fail()` mengembalikan ActionFailure; sukses mengembalikan `{ tambahan }`. */
function status(res: unknown): number | undefined {
	return typeof res === 'object' && res !== null && 'status' in res
		? (res as { status: number }).status
		: undefined;
}

type PesanUji = {
	penulis: string;
	tipe: string;
	teks?: string;
	kartu?: { detail: string; waUrl: string };
};

function tambahan(res: unknown): PesanUji[] {
	if (typeof res !== 'object' || res === null || !('tambahan' in res)) {
		throw new Error('aksi tidak mengembalikan tambahan pesan');
	}
	return (res as { tambahan: PesanUji[] }).tambahan;
}

describe('aksi setujui', () => {
	it('menolak jumlah nol atau bukan angka', async () => {
		for (const jumlah of ['0', '-3', 'abc', '']) {
			const res = await actions.aksi(
				minta({ token: 'tok', jumlah, satuan: 'kg', idem: 'k' }) as never
			);
			expect(status(res), `jumlah=${jumlah}`).toBe(400);
		}
	});

	it('menolak tanpa token', async () => {
		const res = await actions.aksi(minta({ jumlah: '9', satuan: 'kg', idem: 'k' }) as never);
		expect(status(res)).toBe(400);
	});

	it('jumlah yang diubah ikut ke kartu hasil', async () => {
		const pesan = tambahan(
			await actions.aksi(
				minta({ token: 'tok_saran_0771_9', jumlah: '9', satuan: 'kg', idem: 'k2' }) as never
			)
		);
		expect(pesan).toHaveLength(2);

		const [tanda, hasil] = pesan;
		expect(tanda.penulis).toBe('sistem');
		expect(tanda.teks).toBe('Kamu menyetujui 9 kg');
		expect(hasil.tipe).toBe('kartu_hasil');
		expect(hasil.kartu?.detail).toContain('9 kg');
		// Pesan WhatsApp ke supplier membawa jumlah final, bukan yang diusulkan.
		expect(decodeURIComponent(hasil.kartu?.waUrl ?? '')).toContain('9 kg');
	});
});

describe('aksi tolak', () => {
	it('mencatat penolakan tanpa menulis apa pun', async () => {
		const pesan = tambahan(await actions.tolak(minta({ idem: 'k3' }) as never));
		expect(pesan).toHaveLength(1);
		expect(pesan[0].penulis).toBe('sistem');
		expect(pesan[0].teks).toContain('menolak');
	});
});

describe('aksi kirim pesan', () => {
	it('menolak pesan kosong', async () => {
		expect(status(await actions.kirim(minta({ pesan: '   ' }) as never))).toBe(400);
	});

	it('menambahkan pesan penjual ke thread', async () => {
		const pesan = tambahan(await actions.kirim(minta({ pesan: 'stok susu oat?' }) as never));
		expect(pesan[0].penulis).toBe('staff');
		expect(pesan[0].teks).toBe('stok susu oat?');
	});
});
