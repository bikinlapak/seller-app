/*
 * Data tiruan seller-svc, isinya diambil dari kanvas desain "bikinlapak Seller
 * App Funnel" supaya aplikasi langsung terlihat seperti rancangannya:
 * Toko Kopi Jasa, Kopi Arabika, Croissant Butter, PO-0771, CV Sumber Kopi.
 *
 * Dipakai hanya kalau SELLER_SVC_MOCK=true (lihat src/lib/server/api/http.ts).
 * Semua angka di sini pura-pura dihitung backend: frontend tidak menghitung
 * Rupiah atau hari sendiri, jadi mengganti sumber data cukup satu flag.
 */
import type {
	AsistenHome,
	DaftarProduk,
	DaftarStok,
	PengaturanAI,
	Thread,
	Toko
} from '#lib/types/api.js';

export const TOKO: Toko = {
	nama: 'Toko Kopi Jasa',
	pemilik: 'Rima',
	sapaan: 'Pagi, Rima.'
};

export const HOME: AsistenHome = {
	toko: TOKO,
	perhatian: [
		{
			id: 'p1',
			judul: 'Kopi Arabika habis Kamis',
			detail: 'Saran: pesan 12 kg',
			ikon: 'stok',
			href: '/asisten/pesan'
		},
		{
			id: 'p2',
			judul: '14 croissant kedaluwarsa besok',
			detail: '8 diperkirakan tidak laku',
			ikon: 'kedaluwarsa',
			href: '/asisten/kedaluwarsa'
		},
		{
			id: 'p3',
			judul: 'Jemput donasi 21.30',
			detail: '[FOOD BANK MITRA]',
			ikon: 'donasi',
			href: '/asisten/donasi'
		}
	],
	perintah: [
		{ label: 'Tambah produk dari foto', href: '/asisten/produk' },
		{ label: 'Stok susu oat berapa?', href: '/asisten/stok' },
		{ label: 'Foto sisa hari ini', href: '/asisten/sisa' },
		{ label: 'Ide menu dari stok', href: '/asisten/spesial' },
		{ label: 'Laporan minggu ini', href: '/asisten/laporan' },
		{ label: 'Ubah jam buka', href: '/asisten/toko' }
	]
};

/* B3 · Saran pesanan → PO. Ini jalur demo: kartu → tanya → ubah → setujui. */
const THREAD_PESAN: Thread = {
	topik: 'Saran pesanan',
	toko: TOKO,
	sumber: null,
	pesan: [
		{
			id: 'm1',
			penulis: 'agent',
			tipe: 'kartu_saran',
			waktu: 'Senin 07.00',
			kartu: {
				label: 'Saran pesanan',
				keyakinan: 'Keyakinan tinggi',
				judul: 'Kopi Arabika 1 kg · pesan 12 kg',
				alasan:
					'Stok 4 kg, terjual 1,6 kg/hari, habis Kamis. CV Sumber Kopi kirim 2 hari, tiba Rabu.',
				jumlah: 12,
				satuan: 'kg',
				token: 'tok_saran_0771'
			}
		},
		{
			id: 'm2',
			penulis: 'staff',
			tipe: 'teks',
			waktu: '07.03',
			teks: 'kenapa 12? minggu depan libur 2 hari'
		},
		{
			id: 'm3',
			penulis: 'agent',
			tipe: 'teks',
			waktu: '07.04',
			teks: '12 kg untuk 7 hari + cadangan. Kalau tutup 2 hari, 9 kg cukup. Libur saya catat untuk prediksi berikutnya.',
			aksi: [
				{ label: 'Pesan 9 kg', token: 'tok_saran_0771_9', utama: true },
				{ label: 'Tetap 12 kg', token: 'tok_saran_0771', utama: false }
			]
		}
	]
};

/* B5 · Foto sisa → AI vision → tujuan. */
const THREAD_SISA: Thread = {
	topik: 'Foto sisa',
	toko: TOKO,
	sumber: 'Gemini vision',
	pesan: [
		{
			id: 's1',
			penulis: 'staff',
			tipe: 'foto',
			waktu: '21.10',
			fotoLabel: '[FOTO NAMPAN SISA]',
			kotak: [
				{ x: 5, y: 15, w: 41, h: 47, yakin: true },
				{ x: 53, y: 20, w: 39, h: 57, yakin: true },
				{ x: 12, y: 67, w: 32, h: 23, yakin: false }
			]
		},
		{
			id: 's2',
			penulis: 'agent',
			tipe: 'kartu_sisa',
			waktu: '21.11',
			kartu: {
				label: 'Sisa hari ini · 3 barang',
				nilai: '±Rp167 rb',
				barang: [
					{
						id: 'b1',
						nama: 'Croissant Butter',
						jumlah: 3,
						satuan: 'pcs',
						kondisi: 'aman',
						kondisiLabel: 'masih aman · 96%',
						tujuan: [
							{ id: 'donasi', label: 'Donasi', dipilih: true },
							{ id: 'spesial', label: 'Menu spesial', dipilih: false },
							{ id: 'staf', label: 'Makan staf', dipilih: false }
						]
					},
					{
						id: 'b2',
						nama: 'Susu Oat 1 L',
						jumlah: 2,
						satuan: 'L',
						kondisi: 'lewat',
						kondisiLabel: 'lewat tanggal · 92%',
						tujuan: [
							{ id: 'kompos', label: 'Kompos / maggot', dipilih: true },
							{ id: 'buang', label: 'Buang', dipilih: false }
						],
						peringatan: 'Lewat tanggal: tidak boleh dijual atau didonasikan.'
					}
				],
				ragu: {
					keyakinan: 58,
					kandidat: [
						{ id: 'k1', nama: 'Roti Tawar Gandum' },
						{ id: 'k2', nama: 'Roti Sobek' }
					]
				},
				catatan: 'Foto disimpan sebagai bukti · lokasi foto dihapus'
			}
		}
	]
};

/* Thread yang belum didalami: asisten membuka percakapan, komposer siap. */
function threadRingkas(topik: string, sapaan: string, sumber: string | null = null): Thread {
	return {
		topik,
		toko: TOKO,
		sumber,
		pesan: [{ id: 'a1', penulis: 'agent', tipe: 'teks', waktu: 'Sekarang', teks: sapaan }]
	};
}

export const THREADS: Record<string, Thread> = {
	pesan: THREAD_PESAN,
	sisa: THREAD_SISA,
	produk: threadRingkas(
		'Tambah produk dari foto',
		'Kirim foto produknya, saya buatkan nama, kategori dan deskripsi. Kamu yang menyetujui sebelum tersimpan.'
	),
	stok: threadRingkas(
		'Cek & ubah stok',
		'Susu Oat 1 L tinggal 5 L di gudang utama, 2 lot. Mau saya catat penyesuaian?'
	),
	kedaluwarsa: threadRingkas(
		'Hampir kedaluwarsa',
		'14 croissant kedaluwarsa besok, 8 diperkirakan tidak laku. Mau pasang diskon bertahap dari 17.00?'
	),
	donasi: threadRingkas(
		'Donasi',
		'[FOOD BANK MITRA] bisa jemput 21.30. Sebelum lanjut, ada daftar periksa keamanan pangan yang harus kamu centang.'
	),
	spesial: threadRingkas(
		'Menu spesial dari stok',
		'Dari stok yang ada: croissant + susu oat jadi 6 porsi pudding. Harga Rp18.000, balik modal Rp108.000.'
	),
	laporan: threadRingkas(
		'Laporan & dampak',
		'Minggu ini omzet Rp12,4 jt, untung Rp3,1 jt. Dari 9 foto sisa, 78% terselamatkan — naik dari 61% minggu lalu.'
	),
	toko: threadRingkas('Atur toko', 'Jam buka sekarang 07.00–21.00. Mau diubah untuk hari apa?')
};

export const PRODUK: DaftarProduk = {
	total: 24,
	kategori: ['Semua', 'Minuman', 'Roti', 'Bahan', 'Draf'],
	produk: [
		{
			id: 'pr1',
			nama: 'Kopi Susu Gula Aren 250 ml',
			harga: 35000,
			hargaLabel: 'Rp35.000',
			subjudul: null,
			kategori: 'Minuman',
			stokLabel: '20 stok',
			stokKondisi: 'aman',
			status: 'Baru',
			statusPenting: false,
			fotoWarna: '#EAD9C2'
		},
		{
			id: 'pr2',
			nama: 'Croissant Butter (isi 4)',
			harga: 60000,
			hargaLabel: 'Rp60.000',
			subjudul: null,
			kategori: 'Roti',
			stokLabel: '14 · exp besok',
			stokKondisi: 'hampir',
			status: 'Diskon 17.00',
			statusPenting: true,
			fotoWarna: '#E8DCC8'
		},
		{
			id: 'pr3',
			nama: 'Kopi Arabika 1 kg',
			harga: 210000,
			hargaLabel: 'Rp210.000',
			subjudul: null,
			kategori: 'Bahan',
			stokLabel: '4 kg',
			stokKondisi: 'lewat',
			status: 'PO dikirim',
			statusPenting: false,
			fotoWarna: '#DCCFBD'
		},
		{
			id: 'pr4',
			nama: 'Susu Oat 1 L',
			harga: null,
			hargaLabel: null,
			subjudul: 'Bahan · tidak dijual',
			kategori: 'Bahan',
			stokLabel: '5 L',
			stokKondisi: 'hampir',
			status: '2 lot',
			statusPenting: false,
			fotoWarna: '#E6E2D6'
		},
		{
			id: 'pr5',
			nama: 'Donat Gula Aren',
			harga: 15000,
			hargaLabel: 'Rp15.000',
			subjudul: null,
			kategori: 'Roti',
			stokLabel: '12 stok',
			stokKondisi: 'aman',
			status: 'Aktif',
			statusPenting: false,
			fotoWarna: '#EFE0CB'
		}
	]
};

export const STOK: DaftarStok = {
	lokasi: 'Gudang utama',
	ringkasan: { nilai: 'Rp6,8 jt', hampirHabis: 3, hampirKedaluwarsa: 2 },
	baris: [
		{
			id: 'st1',
			nama: 'Kopi Arabika 1 kg',
			jumlahLabel: '4 kg',
			persen: 18,
			kondisi: 'lewat',
			kiri: 'Habis Kamis · 2,5 hari',
			kanan: 'PO-0771 tiba Rabu',
			kananPenting: true
		},
		{
			id: 'st2',
			nama: 'Susu Oat 1 L',
			jumlahLabel: '5 L',
			persen: 30,
			kondisi: 'hampir',
			kiri: '3 L kedaluwarsa Kamis',
			kanan: '2 lot',
			kananPenting: false
		},
		{
			id: 'st3',
			nama: 'Croissant Butter',
			jumlahLabel: '14 box',
			persen: 70,
			kondisi: 'hampir',
			kiri: 'Kedaluwarsa besok · diskon 17.00',
			kanan: 'lot L-889',
			kananPenting: false
		},
		{
			id: 'st4',
			nama: 'Gula Aren 1 kg',
			jumlahLabel: '9 kg',
			persen: 62,
			kondisi: 'aman',
			kiri: 'Aman · 11 hari',
			kanan: 'otomatis disetujui',
			kananPenting: false
		}
	]
};

export const PENGATURAN_AI: PengaturanAI = {
	mode: [
		{ id: 'hemat', label: 'Hemat', catatan: 'jawab singkat, model kecil' },
		{ id: 'seimbang', label: 'Seimbang', catatan: 'bawaan' },
		{ id: 'teliti', label: 'Teliti', catatan: 'alasan lebih panjang' }
	],
	modeDipilih: 'seimbang',
	model: [
		{ tugas: 'Chat & penjelasan', nama: 'Gemini Flash', sistem: false },
		{ tugas: 'Baca foto produk & sisa', nama: 'Gemini Pro', sistem: false },
		{ tugas: 'Ide menu & listing', nama: 'Gemini Flash', sistem: false },
		{
			tugas: 'Prediksi stok',
			catatan: 'angka dihitung sistem, bukan chat',
			nama: 'TimesFM',
			sistem: true
		}
	],
	otonomi: [
		{
			id: 'po-kecil',
			label: 'Pesanan kecil otomatis',
			catatan: '≤Rp500 rb, sudah 3× disetujui tanpa diubah',
			aktif: true
		},
		{ id: 'diskon', label: 'Diskon kedaluwarsa otomatis', aktif: false }
	],
	bahasa: {
		pilihan: ['Indonesia · santai', 'Indonesia · formal', 'English'],
		dipilih: 'Indonesia · santai'
	},
	biaya: {
		batasLabel: 'Rp150 rb/bln',
		terpakaiPersen: 25,
		catatan: 'Terpakai 25% bulan ini. Jika habis, asisten pakai mode Hemat.'
	},
	privasi:
		'Data tokomu tidak dipakai untuk melatih model. Foto sisa disimpan 90 hari sebagai bukti.'
};
