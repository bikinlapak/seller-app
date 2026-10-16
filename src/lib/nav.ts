import type { NamaIkon } from '#lib/components/Icon.svelte';

export type NavItem = { href: string; label: string; ikon: NamaIkon };

/*
 * Bar bawah dari kanvas desain: lima tujuan, Asisten lebih dulu karena chat
 * adalah inti aplikasi — tidak ada halaman "Beranda" tersendiri.
 * "Saya" membuka Pengaturan AI.
 */
export const NAV_ITEMS: readonly NavItem[] = [
	{ href: '/asisten', label: 'Asisten', ikon: 'asisten' },
	{ href: '/produk', label: 'Produk', ikon: 'produk' },
	{ href: '/stok', label: 'Stok', ikon: 'stok' },
	{ href: '/toko', label: 'Toko', ikon: 'toko' },
	{ href: '/saya', label: 'Saya', ikon: 'saya' }
];

/** Menu aktif juga untuk sub-halamannya, mis. `/produk/123` menyalakan "Produk". */
export function isActive(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}
