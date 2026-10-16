/*
 * Bentuk respons seller-svc. Ditulis tangan karena seller-app dan seller-svc
 * ada di repo berbeda, jadi tidak bisa berbagi skema saat compile. Tes di
 * src/lib/mock/fixtures.spec.ts memastikan data tiruan masih cocok dengan tipe
 * ini — kalau backend mengganti nama field, tes itu yang gagal lebih dulu.
 */

/** Rupiah utuh, tanpa sen. Dihitung dan diformat di backend. */
export type Idr = number;

export type Kondisi = 'aman' | 'hampir' | 'lewat';

export type Toko = {
	nama: string;
	pemilik: string;
	sapaan: string; // "Pagi, Rima." — backend yang menentukan waktunya
};

/* ---------- Asisten ---------- */

export type PerluPerhatian = {
	id: string;
	judul: string;
	detail: string;
	ikon: 'stok' | 'kedaluwarsa' | 'donasi';
	href: string;
};

export type PerintahCepat = { label: string; href: string };

export type AsistenHome = {
	toko: Toko;
	perhatian: PerluPerhatian[];
	perintah: PerintahCepat[];
};

/** Satu baris dalam thread. `tipe` memilih komponen yang merender. */
export type Pesan =
	| { id: string; penulis: 'staff'; tipe: 'teks'; waktu: string; teks: string }
	| {
			id: string;
			penulis: 'staff';
			tipe: 'foto';
			waktu: string;
			fotoLabel: string;
			kotak: KotakDeteksi[];
	  }
	| { id: string; penulis: 'agent'; tipe: 'teks'; waktu: string; teks: string; aksi?: AksiInline[] }
	| { id: string; penulis: 'sistem'; tipe: 'tanda'; waktu: string; teks: string }
	| { id: string; penulis: 'agent'; tipe: 'kartu_saran'; waktu: string; kartu: KartuSaran }
	| { id: string; penulis: 'agent'; tipe: 'kartu_hasil'; waktu: string; kartu: KartuHasil }
	| { id: string; penulis: 'agent'; tipe: 'kartu_sisa'; waktu: string; kartu: KartuSisa };

export type KotakDeteksi = {
	/* Persen terhadap ukuran foto, supaya tidak tergantung lebar layar. */
	x: number;
	y: number;
	w: number;
	h: number;
	yakin: boolean;
};

export type AksiInline = {
	label: string;
	/* Token aksi sekali pakai dari backend. null = tombol sekunder tanpa efek. */
	token: string | null;
	utama: boolean;
};

/** B3 · Saran pesanan → PO. */
export type KartuSaran = {
	label: string; // "SARAN PESANAN"
	keyakinan: string; // "Keyakinan tinggi"
	judul: string; // "Kopi Arabika 1 kg · pesan 12 kg"
	alasan: string;
	/* Jumlah yang diusulkan; stepper tidak boleh melewatinya. */
	jumlah: number;
	satuan: string;
	token: string;
};

/** Kartu hasil setelah executor menulis ke worksh.io. */
export type KartuHasil = {
	judul: string; // "PO-0771 dibuat"
	detail: string; // "9 kg · CV Sumber Kopi · tiba Rabu"
	waUrl: string;
	poHref: string;
};

/** B5 · Foto sisa → AI vision → tujuan. */
export type KartuSisa = {
	label: string; // "SISA HARI INI · 3 BARANG"
	nilai: string; // "±Rp167 rb"
	barang: BarangSisa[];
	ragu: BarangRagu | null;
	catatan: string;
};

export type BarangSisa = {
	id: string;
	nama: string;
	jumlah: number;
	satuan: string;
	kondisi: Kondisi;
	kondisiLabel: string; // "masih aman · 96%"
	tujuan: Tujuan[];
	peringatan?: string;
};

export type Tujuan = { id: string; label: string; dipilih: boolean };

export type BarangRagu = {
	keyakinan: number;
	kandidat: { id: string; nama: string }[];
};

export type Thread = {
	topik: string;
	toko: Toko;
	sumber: string | null; // "Gemini vision", tampil di baris meta
	pesan: Pesan[];
};

/* ---------- Produk ---------- */

export type Produk = {
	id: string;
	nama: string;
	harga: Idr | null;
	hargaLabel: string | null;
	subjudul: string | null; // "Bahan · tidak dijual"
	kategori: string;
	stokLabel: string; // "20 stok", "14 · exp besok"
	stokKondisi: Kondisi;
	status: string; // "Baru", "Diskon 17.00", "PO dikirim"
	statusPenting: boolean;
	fotoWarna: string; // placeholder sampai ada gambar asli
};

export type DaftarProduk = {
	total: number;
	kategori: string[];
	produk: Produk[];
};

/* ---------- Stok ---------- */

export type RingkasanStok = { nilai: string; hampirHabis: number; hampirKedaluwarsa: number };

export type BarisStok = {
	id: string;
	nama: string;
	jumlahLabel: string; // "4 kg"
	/* Persen bar; dihitung backend dari on-hand vs reorder point. */
	persen: number;
	kondisi: Kondisi;
	kiri: string; // "Habis Kamis · 2,5 hari"
	kanan: string; // "PO-0771 tiba Rabu"
	kananPenting: boolean;
};

export type DaftarStok = {
	lokasi: string;
	ringkasan: RingkasanStok;
	baris: BarisStok[];
};

/* ---------- Pengaturan AI ---------- */

export type ModeAsisten = { id: string; label: string; catatan: string };

export type PengaturanAI = {
	mode: ModeAsisten[];
	modeDipilih: string;
	model: { tugas: string; catatan?: string; nama: string; sistem: boolean }[];
	otonomi: { id: string; label: string; catatan?: string; aktif: boolean }[];
	bahasa: { pilihan: string[]; dipilih: string };
	biaya: { batasLabel: string; terpakaiPersen: number; catatan: string };
	privasi: string;
};
